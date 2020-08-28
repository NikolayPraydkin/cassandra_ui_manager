package cassandrauimanager;

import com.datastax.oss.driver.api.core.CqlSession;
import com.datastax.oss.driver.api.core.cql.*;
import com.datastax.oss.driver.api.core.servererrors.InvalidQueryException;
import com.datastax.oss.driver.api.core.type.DataType;
import com.datastax.oss.driver.api.core.type.DataTypes;
import com.datastax.oss.driver.api.core.type.codec.TypeCodec;
import com.datastax.oss.driver.api.querybuilder.schema.*;
import com.datastax.oss.driver.api.querybuilder.schema.compaction.CompactionStrategy;
import com.datastax.oss.driver.internal.querybuilder.schema.compaction.DefaultLeveledCompactionStrategy;
import com.datastax.oss.driver.internal.querybuilder.schema.compaction.DefaultSizeTieredCompactionStrategy;
import com.datastax.oss.driver.internal.querybuilder.schema.compaction.DefaultTimeWindowCompactionStrategy;
import com.datastax.oss.protocol.internal.Compressor;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.protobuf.ProtocolStringList;
import spark.Request;

import java.awt.*;
import java.io.IOException;
import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static cassandrauimanager.utils.Utils.*;
import static com.datastax.oss.driver.api.querybuilder.QueryBuilder.literal;
import static com.datastax.oss.driver.api.querybuilder.SchemaBuilder.*;
import static spark.Spark.*;

public class Main {

    private static String getValueFromRequest(Request req, String key) {
        return req.queryMap(key).value();
    }

    public static void main(String[] args) throws IOException, InterruptedException {
        try {

            int defaultPort = 8080;
            try {
                for (int i = 0; i < args.length; i++) {
                    if (args[i].toLowerCase().startsWith("-port")) {
                        defaultPort = Integer.parseInt(args[i + 1]);
                    }
                }
            } catch (Exception e) {
            }

            port(defaultPort);


            staticFiles.location("/public");

            // cors set for development
            before((request, response) -> {
                response.header("Access-Control-Allow-Origin", "*");
            });


            get("/testConnection", (req, res) -> {
                        if (req.queryMap("host") != null && (!"".equals(req.queryMap("host").value()) && !"".equals(req.queryMap("port").value()))) {
                            try {

                                int port = Integer.parseInt(req.queryMap("port").value());

                                if (req.queryMap("user") != null && !"".equals(req.queryMap("user").value())) {
                                    cassandrauimanager.TestConnection test = new cassandrauimanager.TestConnection(getValueFromRequest(req, "host"), port,
                                            getValueFromRequest(req, "user"), getValueFromRequest(req, "pass"));
                                    return test.checkConnection();
                                } else {
                                    cassandrauimanager.TestConnection test = new cassandrauimanager.TestConnection(req.queryMap("host").value(), port);
                                    return test.checkConnection();
                                }


                            } catch (NumberFormatException e) {
                                return "Port is'n correct";
                            }
                        }
                        return "Empty fields host or port";
                    }
            );

            get("/disconnect", (req, resp) -> {
                if (req.queryMap("connection_alias") != null && !"".equals(req.queryMap("connection_alias").value())) {
                    String connection_alias = getValueFromRequest(req, "connection_alias");
                    if (cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().containsKey(connection_alias)) {
                        try {
                            cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().remove(connection_alias);
                        } catch (Exception e) {
                            return false;
                        }
                        return true;
                    }
                }
                return false;
            });

            get("/exit", (req, res) -> {
                stop();
                System.exit(0);
                return null;
            });

            post("/createuserfunction", (req, res) -> {
                try {
                    byte[] bytes = req.bodyAsBytes();
                    cassandrauimanager.Entity.UserFunction userFunction = cassandrauimanager.Entity.UserFunction.parseFrom(bytes);


                    String name = userFunction.getName();
                    String body = userFunction.getBody();
                    boolean calledOnNullInput = userFunction.getCalledOnNullInput();
                    boolean orReplace = userFunction.getOrReplace();
                    boolean ifNotExist = userFunction.getIfNotExist();
                    String keyspace = userFunction.getKeyspace();
                    String signature = userFunction.getSignature();
                    String returnType = userFunction.getReturnType();
                    String language = userFunction.getLanguage();
                    String connection = userFunction.getConnection();


                    if (!cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().containsKey(connection)) {
                        return "Unknown connection alias".getBytes();
                    }
                    CreateFunctionStart function;
                    CreateFunctionWithNullOption createFunctionWithNullOption;
                    if (orReplace) {
                        function = createFunction(keyspace, name.trim()).orReplace();
                    } else if (ifNotExist) {
                        function = createFunction(keyspace, "\"" + name.trim() + "\"").ifNotExists();
                    } else {
                        function = createFunction(keyspace, name);
                    }

                    if (!signature.trim().isEmpty()) {
                        Map<String, DataType> handleSignature = getHandleSignature(signature);

                        for (Map.Entry<String, DataType> entry : handleSignature.entrySet()) {
                            String nameType = entry.getKey();
                            DataType type = entry.getValue();
                            function = function.withParameter(nameType, type);
                        }
                    }


                    if (calledOnNullInput) {
                        createFunctionWithNullOption = function.calledOnNull();
                    } else {
                        createFunctionWithNullOption = function.returnsNullOnNull();
                    }

                    CreateFunctionWithType createFunctionWithType = createFunctionWithNullOption.returnsType(getType(returnType));
                    CreateFunctionWithLanguage createFunctionWithLanguage;

                    if (language.equals("java")) {
                        createFunctionWithLanguage = createFunctionWithType.withJavaLanguage();
                    } else if (language.equals("javascript")) {
                        createFunctionWithLanguage = createFunctionWithType.withJavaScriptLanguage();
                    } else {
                        createFunctionWithLanguage = createFunctionWithType.withLanguage(language);
                    }

                    // todo: as or asQuote?
                    SimpleStatement statement = createFunctionWithLanguage.as(body).build();

                    CqlSession cqlSession = cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(connection);


                    try {
                        cqlSession.execute(statement);
                        return ("Function '" + name + "' was created successfully.").getBytes();
                    } catch (Exception e) {
                        e.printStackTrace();
                        return e.getMessage().getBytes();
                    }

                } catch (Exception e) {
                    return e.getMessage().getBytes();
                }

            });

            post("/createrole", (req, res) -> {
                try {
                    byte[] bytes = req.bodyAsBytes();
                    cassandrauimanager.Entity.Role role = cassandrauimanager.Entity.Role.parseFrom(bytes);


                    String name = role.getName();
                    String connection = role.getConnection();

                    if (!cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().containsKey(connection)) {
                        return "Unknown connection alias".getBytes();
                    }
                    Map<String, String> optionsMap = role.getOptionsMap();

                    String isSuperUser = "";
                    String isCanLogin = "";
                    String password = "";

                    if (optionsMap.containsKey("login")) {
                        isCanLogin = optionsMap.get("login");
                    }
                    if (optionsMap.containsKey("superuser")) {
                        isSuperUser = optionsMap.get("superuser");
                    }
                    if (optionsMap.containsKey("password")) {
                        password = optionsMap.get("password");
                    }

                    StringBuilder statement = new StringBuilder();

                    statement.append("CREATE ROLE ").append(name);

                    if (isSuperUser.equals("true") || isCanLogin.equals("true") || !password.isEmpty()) {
                        boolean useWith = false;
                        statement.append(" WITH");
                        if (!isSuperUser.isEmpty()) {
                            statement.append(" SUPERUSER = ").append(isSuperUser);
                            useWith = true;
                        }
                        if (!isCanLogin.isEmpty()) {
                            if (useWith) {
                                statement.append(" AND LOGIN = ").append(isCanLogin);
                            } else {
                                statement.append(" LOGIN = true");
                                useWith = true;
                            }
                        }
                        if (!password.isEmpty()) {
                            if (useWith) {
                                statement.append(" AND PASSWORD = '").append(password).append("'");
                            } else {
                                statement.append(" PASSWORD = '").append(password).append("'");
                            }
                        }

                    }

                    CqlSession cqlSession = cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(connection);

                    cqlSession.execute(SimpleStatement.newInstance(statement.toString()));

                    return ("Role '" + name + "' was created successfully").getBytes();

                } catch (Exception e) {
                    return e.getMessage().getBytes();
                }

            });
            post("/editrole", (req, res) -> {
                try {
                    byte[] bytes = req.bodyAsBytes();
                    cassandrauimanager.Entity.Role role = cassandrauimanager.Entity.Role.parseFrom(bytes);


                    String name = role.getName();
                    String connection = role.getConnection();

                    if (!cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().containsKey(connection)) {
                        return "Unknown connection alias".getBytes();
                    }
                    Map<String, String> optionsMap = role.getOptionsMap();

                    String isSuperUser = "";
                    String isCanLogin = "";
                    String password = "";

                    if (optionsMap.containsKey("login")) {
                        isCanLogin = optionsMap.get("login");
                    }
                    if (optionsMap.containsKey("superuser")) {
                        isSuperUser = optionsMap.get("superuser");
                    }
                    if (optionsMap.containsKey("password")) {
                        password = optionsMap.get("password");
                    }

                    StringBuilder statement = new StringBuilder();

                    statement.append("ALTER ROLE ").append(name);

                    if (!isSuperUser.isEmpty() || !isCanLogin.isEmpty() || !password.isEmpty()) {
                        boolean useWith = false;
                        statement.append(" WITH");
                        if (!isSuperUser.isEmpty()) {
                            statement.append(" SUPERUSER = ").append(isSuperUser);
                            useWith = true;
                        }
                        if (!isCanLogin.isEmpty()) {
                            if (useWith) {
                                statement.append(" AND LOGIN = ").append(isCanLogin);
                            } else {
                                statement.append(" LOGIN = true");
                                useWith = true;
                            }
                        }
                        if (!password.isEmpty()) {
                            if (useWith) {
                                statement.append(" AND PASSWORD = '").append(password).append("'");
                            } else {
                                statement.append(" PASSWORD = '").append(password).append("'");
                            }
                        }

                    }

                    CqlSession cqlSession = cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(connection);

                    cqlSession.execute(SimpleStatement.newInstance(statement.toString()));

                    return ("Role '" + name + "' was altered successfully").getBytes();

                } catch (Exception e) {
                    return e.getMessage().getBytes();
                }

            });

            post("/createaggregatefunction", (req, res) -> {
                try {
                    byte[] bytes = req.bodyAsBytes();
                    cassandrauimanager.Entity.AggregateFunction aggFunction = cassandrauimanager.Entity.AggregateFunction.parseFrom(bytes);


                    String name = aggFunction.getName();
                    String keyspace = aggFunction.getKeyspace();
                    String connection = aggFunction.getConnection();

                    boolean orReplace = aggFunction.getOrReplace();
                    boolean ifNotExist = aggFunction.getIfNotExist();

                    String signature = aggFunction.getSignature();
                    String sFunc = aggFunction.getSFunc();
                    String sType = aggFunction.getSType();
                    String finalFunc = aggFunction.getFinalFunc();
                    String initCond = aggFunction.getInitCond();


                    if (!cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().containsKey(connection)) {
                        return "Unknown connection alias".getBytes();
                    }


                    //DataTypes.
//                createAggregate("cycling", "average")
//                        .withParameter(DataTypes.INT)
//                        .withSFunc("avgstate")
//                        .withSType(DataTypes.tupleOf(DataTypes.INT, DataTypes.BIGINT))
//                        .withFinalFunc("avgfinal")
//                        .withInitCond((literal(0), literal(0)));


                    CreateAggregateStart aggFunctionStart;

                    if (orReplace) {
                        aggFunctionStart = createAggregate(keyspace, name.trim()).orReplace();
                    } else if (ifNotExist) {
                        aggFunctionStart = createAggregate(keyspace, name.trim()).ifNotExists();
                    } else {
                        aggFunctionStart = createAggregate(keyspace, name);
                    }


                    CreateAggregateEnd createAggregateEnd = aggFunctionStart.withSFunc("\"" + sFunc + "\"").withSType(getType(sType));

                    if (!finalFunc.isEmpty()) {
                        createAggregateEnd = createAggregateEnd.withFinalFunc(finalFunc);
                    }
                    if (!initCond.isEmpty()) {
                        createAggregateEnd = createAggregateEnd.withInitCond(literal(initCond));
                    }


                    CqlSession cqlSession = cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(connection);


                    SimpleStatement statement = createAggregateEnd.build();
                    try {
                        cqlSession.execute(statement);
                        return ("Aggregate Function '" + name + "' was created successfully.").getBytes();
                    } catch (Exception e) {
                        e.printStackTrace();
                        return e.getMessage().getBytes();
                    }

                } catch (Exception e) {
                    return e.getMessage().getBytes();
                }

            });

            post("/dropuserfunction", (req, res) -> {
                StringBuilder statement = new StringBuilder();

                String functionName;
                String connectionName;
                CqlSession cqlSession = null;
                try {
                    String userType = req.body();

                    String[] pathType = userType.split("\\.");
                    connectionName = pathType[0];
                    String keyspace = pathType[1];
                    String signature = pathType[2];
                    functionName = pathType[2].split("\\(")[0];

                    statement.append("DROP FUNCTION ").append(keyspace).append(".").append(signature);
                    if (!cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().containsKey(connectionName)) {
                        return "Unknown connection alias".getBytes();
                    }

                    cqlSession = cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(connectionName);

                    SimpleStatement dropTypeStatement = dropFunction(keyspace, functionName).build();
                    cqlSession.execute(dropTypeStatement);
                    return ("User Function '" + functionName + "' was drop successfully").getBytes();
                } catch (InvalidQueryException e) {
                    try {
                        SimpleStatement query = SimpleStatement.newInstance(statement.toString());
                        if (cqlSession != null) {
                            cqlSession.execute(query);
                        } else {
                            throw new Exception("Unknown connection alias");
                        }
                        return ("User Function  was drop successfully").getBytes();
                    } catch (Exception ee) {
                        return ee.getMessage().getBytes();
                    }
                } catch (Exception e) {
                    return e.getMessage().getBytes();
                }
            });
            post("/droprole", (req, res) -> {

                try {
                    StringBuilder statement = new StringBuilder();
                    String userType = req.body();

                    String[] pathType = userType.split("\\.");
                    String connectionName = pathType[0];
                    String nameRole = pathType[1];


                    statement.append("DROP ROLE ").append(nameRole);
                    if (!cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().containsKey(connectionName)) {
                        return "Unknown connection alias".getBytes();
                    }

                    CqlSession cqlSession = cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(connectionName);

                    SimpleStatement query = SimpleStatement.newInstance(statement.toString());

                    cqlSession.execute(query);
                    return ("Role '" + nameRole + "' was drop successfully").getBytes();
                } catch (Exception e) {
                    return e.getMessage().getBytes();
                }
            });
            post("/droptable", (req, res) -> {

                try {
                    String table = req.body();

                    String[] pathType = table.split("\\.");
                    String connectionName = pathType[0];
                    String keyspace = pathType[1];
                    String nameTable = pathType[2];

                    if (!cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().containsKey(connectionName)) {
                        return "Unknown connection alias".getBytes();
                    }

                    SimpleStatement query = dropTable(keyspace, nameTable).build();

                    CqlSession cqlSession = cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(connectionName);

                    cqlSession.execute(query);
                    return ("Table '" + nameTable + "' was drop successfully").getBytes();
                } catch (Exception e) {
                    return e.getMessage().getBytes();
                }
            });

            post("/dropaggregatefunction", (req, res) -> {
                StringBuilder statement = new StringBuilder();

                String functionName;
                String connectionName;
                CqlSession cqlSession = null;
                try {
                    String userType = req.body();

                    String[] pathType = userType.split("\\.");
                    connectionName = pathType[0];
                    String keyspace = pathType[1];
                    String signature = pathType[2];
                    functionName = pathType[2].split("\\(")[0];

                    statement.append("DROP AGGREGATE FUNCTION ").append(keyspace).append(".").append(signature);
                    if (!cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().containsKey(connectionName)) {
                        return "Unknown connection alias".getBytes();
                    }

                    cqlSession = cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(connectionName);

                    SimpleStatement dropTypeStatement = dropAggregate(keyspace, functionName).build();
                    cqlSession.execute(dropTypeStatement);
                    return ("Aggregate Function '" + functionName + "' was drop successfully").getBytes();
                } catch (InvalidQueryException e) {
                    try {
                        SimpleStatement query = SimpleStatement.newInstance(statement.toString());
                        if (cqlSession != null) {
                            cqlSession.execute(query);
                        } else {
                            throw new Exception("Unknown connection alias");
                        }
                        return ("Aggregate Function  was drop successfully").getBytes();
                    } catch (Exception ee) {
                        return ee.getMessage().getBytes();
                    }
                } catch (Exception e) {
                    return e.getMessage().getBytes();
                }
            });
            post("/dropmaterializedview", (req, res) -> {

                try {
                    String userType = req.body();

                    String[] pathType = userType.split("\\.");
                    String connectionName = pathType[0];
                    String keyspace = pathType[1];
                    String view = pathType[2];


                    SimpleStatement statement = dropMaterializedView(keyspace, view).build();


                    if (!cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().containsKey(connectionName)) {
                        return "Unknown connection alias".getBytes();
                    }

                    CqlSession cqlSession = cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(connectionName);
                    cqlSession.execute(statement);
                    return ("Materialized View '" + view + "' was drop successfully").getBytes();
                } catch (Exception e) {
                    return e.getMessage().getBytes();
                }
            });


            post("/createkeyspace", (req, res) -> {
                try {


                    byte[] bytes = req.bodyAsBytes();
                    cassandrauimanager.Entity.KeySpace keySpace = cassandrauimanager.Entity.KeySpace.parseFrom(bytes);

                    if (!cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().containsKey(keySpace.getConnectionAlias())) {
                        return "Unknown connection alias".getBytes();
                    }
                    Map<String, String> replicationMap = keySpace.getReplicationMap();

                    CreateKeyspaceStart createKeyspaceStart;
                    createKeyspaceStart = createKeyspace(keySpace.getName());


                    CreateKeyspace prepareKS = null;
                    if (replicationMap != null) {

                        if (replicationMap.get("class").equals("simple")) {
                            if (replicationMap.containsKey("replication_factor")) {
                                prepareKS = createKeyspaceStart.withSimpleStrategy(Integer.parseInt(replicationMap.get("replication_factor")));

                            }
                        } else if (replicationMap.get("class").equals("topology")) {

                            Map<String, Integer> newMap = new HashMap<>();
                            replicationMap.forEach((k, v) -> {
                                if (!k.equals("class")) {
                                    newMap.put(k, Integer.parseInt(v));
                                }
                            });

                            prepareKS = createKeyspaceStart.withNetworkTopologyStrategy(newMap);
                        }

                    } else {
                        return "No chose strategy replication".getBytes();
                    }

                    prepareKS = prepareKS.withDurableWrites(keySpace.getDurableWrites());

                    CqlSession session = cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(keySpace.getConnectionAlias());

                    session.execute(prepareKS.build());

                    return ("Keyspace '" + keySpace.getName() + "' was created successfully").getBytes();
                } catch (Exception e) {
                    return e.getMessage().getBytes();
                }
            });
            post("/dropkeyspace", (req, res) -> {
                try {
                    byte[] bytes = req.bodyAsBytes();
                    cassandrauimanager.Entity.KeySpace keySpace = cassandrauimanager.Entity.KeySpace.parseFrom(bytes);

                    String name = keySpace.getName();
                    String connectionAlias = keySpace.getConnectionAlias();

                    if (!cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().containsKey(keySpace.getConnectionAlias())) {
                        return "Unknown connection alias".getBytes();
                    }

                    CqlSession session = cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(connectionAlias);

                    session.execute(dropKeyspace(name).build());
                    return ("Keyspace '" + keySpace.getName() + "' was dropped successfully").getBytes();
                } catch (Exception e) {
                    return e.getMessage().getBytes();
                }

            });
            post("/editkeyspace", (req, res) -> {
                try {

                    byte[] bytes = req.bodyAsBytes();
                    cassandrauimanager.Entity.KeySpace keySpace = cassandrauimanager.Entity.KeySpace.parseFrom(bytes);

                    if (!cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().containsKey(keySpace.getConnectionAlias())) {
                        return "Unknown connection alias".getBytes();
                    }
                    Map<String, String> replicationMap = keySpace.getReplicationMap();

                    AlterKeyspaceStart alterKeyspaceStart;
                    alterKeyspaceStart = alterKeyspace(keySpace.getName());

                    AlterKeyspace alterKS = null;
                    if (replicationMap != null) {

                        if (replicationMap.get("class").equals("simple")) {
                            if (replicationMap.containsKey("replication_factor")) {
                                alterKS = alterKeyspaceStart.withSimpleStrategy(Integer.parseInt(replicationMap.get("replication_factor")));

                            }
                        } else if (replicationMap.get("class").equals("topology")) {

                            Map<String, Integer> newMap = new HashMap<>();
                            replicationMap.forEach((k, v) -> {
                                if (!k.equals("class")) {
                                    newMap.put(k, Integer.parseInt(v));
                                }
                            });

                            alterKS = alterKeyspaceStart.withNetworkTopologyStrategy(newMap);
                        }

                    } else {
                        return "No choosed strategy replication".getBytes();
                    }

                    alterKS = alterKS.withDurableWrites(keySpace.getDurableWrites());

                    CqlSession session = cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(keySpace.getConnectionAlias());

                    session.execute(alterKS.build());

                    return ("Keyspace '" + keySpace.getName() + "' was altered successfully").getBytes();
                } catch (Exception e) {
                    return e.getMessage().getBytes();
                }
            });


            post("/keyspaces", (req, res) -> getDataByCondition(req, "keyspaces"));
            post("/gettypes", (req, res) -> getDataByCondition(req, "types"));
            post("/gettables", (req, res) -> getDataByCondition(req, "tables"));
            post("/getfunctions", (req, res) -> getDataByCondition(req, "functions"));
            post("/getaggregatefunctions", (req, res) -> getDataByCondition(req, "aggfunctions"));
            post("/getmaterializedviews", (req, res) -> getDataByCondition(req, "views"));
            post("/getroles", (req, res) -> getDataByCondition(req, "roles"));

            post("/createusertype", (req, res) -> {
                try {

                    String userType = req.body();

                    JsonElement element = JsonParser.parseString(userType);

                    if (element.isJsonObject()) {

                        JsonObject object = element.getAsJsonObject();

                        String path = object.get("path").getAsString();
                        String nameType = object.get("nameType").getAsString();
                        JsonArray fields = (JsonArray) object.get("fields");

                        String nameConnection = path.split("[\\.]")[0];
                        String nameTargetKs = path.split("[\\.]")[1];
                        if (!cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().containsKey(nameConnection)) {
                            return "Unknown connection alias".getBytes();
                        }


                        CreateTypeStart type = createType(nameTargetKs, nameType);
                        CreateType createType = null;
                        for (int i = 0; i < fields.size(); i++) {
                            JsonObject asJsonObject = fields.get(i).getAsJsonObject();
                            if (asJsonObject.has("name") && asJsonObject.has("type")) {
                                String nameField = asJsonObject.get("name").getAsString();
                                String typeField = asJsonObject.get("type").getAsString();


                                if (i == 0) {
                                    createType = type.withField(nameField, getType(typeField));
                                } else {
                                    createType = createType.withField(nameField, getType(typeField));
                                }

                            }
                        }


                        CqlSession cqlSession = cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(nameConnection);

                        if (createType != null) {
                            cqlSession.execute(createType.build());
                            return ("User Type '" + nameType + "' was created successfully").getBytes();
                        } else {
                            return ("Somethen wrong with creation '" + nameType + "'").getBytes();
                        }

                    } else {
                        return "Not json object".getBytes();
                    }

                } catch (Exception e) {
                    return e.getMessage().getBytes();
                }
            });
            post("/creatematerializedview", (req, res) -> {
                try {
                    cassandrauimanager.Entity.MateriliazedView materiliazedView = cassandrauimanager.Entity.MateriliazedView.parseFrom(req.bodyAsBytes());

                    String nameKs = materiliazedView.getNameKeySpace();
                    boolean includesAllColumns = materiliazedView.getIncludesAllColumns();
                    String nameView = materiliazedView.getName();
                    String baseTable = materiliazedView.getBaseTable();
                    String connectionName = materiliazedView.getConnection();
                    String select = materiliazedView.getSelect();
                    ProtocolStringList primaryKeyNamesList = materiliazedView.getPrimaryKeyNamesList();


                    if (!cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().containsKey(connectionName)) {
                        return "Unknown connection alias".getBytes();
                    }


                    CreateMaterializedViewSelection createMaterializedViewSelection = createMaterializedView(nameKs, nameView)
                            .asSelectFrom(nameKs, baseTable);
                    CreateMaterializedViewWhereStart viewWhereStart = null;
                    if (includesAllColumns) {
                        viewWhereStart = createMaterializedViewSelection.all();
                    } else {
                        if (!select.isEmpty()) {
                            if (select.contains(",")) {
                                String[] columns = select.replaceAll(" ", "").split(",");
                                viewWhereStart = createMaterializedViewSelection.columns(columns);
                            } else {
                                viewWhereStart = createMaterializedViewSelection.columns(select.trim());
                            }
                        }
                    }
                    CreateMaterializedViewWhere viewWhere = null;
                    for (String key : primaryKeyNamesList) {
                        if (viewWhere == null) {
                            viewWhere = viewWhereStart.whereColumn(key.trim()).isNotNull();
                        } else {
                            viewWhere = viewWhere.whereColumn(key.trim()).isNotNull();
                        }
                    }


                    CreateMaterializedViewPrimaryKey createMaterializedViewPrimaryKey = null;
                    CreateMaterializedViewPrimaryKey view = null;
                    for (int i = 0; i < primaryKeyNamesList.size(); i++) {
                        if (i == 0) {
                            createMaterializedViewPrimaryKey = viewWhere.withPartitionKey(primaryKeyNamesList.get(i).trim());
                        } else {
                            if (view == null) {
                                view = createMaterializedViewPrimaryKey.withClusteringColumn(primaryKeyNamesList.get(i).trim());
                            } else {
                                view = view.withClusteringColumn(primaryKeyNamesList.get(i).trim());
                            }

                        }
                    }

                    if (view != null) {
                        SimpleStatement statement = view.build();
                        CqlSession cqlSession = cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(connectionName);
                        cqlSession.execute(statement);
                        return ("View '" + nameView + "'was created successfully").getBytes();
                    }


                    return "View was not created".getBytes();

                } catch (Exception e) {
                    return e.getMessage().getBytes();
                }
            });
            post("/createtable", (req, res) -> {
                try {
                    cassandrauimanager.Entity.Table table = cassandrauimanager.Entity.Table.parseFrom(req.bodyAsBytes());

                    String nameKs = table.getKeyspace();
                    String connectionName = table.getConnectionAlias();
                    String nameTable = table.getName();
                    List<cassandrauimanager.Entity.Column> columns = table.getColumnsList();

                    List<cassandrauimanager.Entity.Index> indicesList = table.getIndicesList();


                    if (!cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().containsKey(connectionName)) {
                        return "Unknown connection alias".getBytes();
                    }


                    CreateTableStart tableStart = createTable(nameKs, nameTable);
                    CreateTable createTable = null;
                    for (cassandrauimanager.Entity.Column column : columns) {
                        if (column.getIsPartitionKey()) {
                            if (createTable == null) {
                                createTable = tableStart.withPartitionKey(column.getName(), getType(column.getType()));
                            } else {
                                createTable = createTable.withPartitionKey(column.getName(), getType(column.getType()));
                            }
                        }
                    }

                    if (createTable == null) {
                        return "No PRIMARY KEY specifed (exactly one required)".getBytes();
                    }

                    for (cassandrauimanager.Entity.Column column : columns) {
                        if (column.getIsClusteringKey()) {
                            createTable = createTable.withClusteringColumn(column.getName(), getType(column.getType()));
                        }
                        if (column.getIsStatic()) {
                            createTable = createTable.withStaticColumn(column.getName(), getType(column.getType()));
                        }
                    }
                    for (cassandrauimanager.Entity.Column column : columns) {
                        if (!column.getIsClusteringKey() && !column.getIsStatic() && !column.getIsPartitionKey()) {
                            createTable = createTable.withColumn(column.getName(), getType(column.getType()));
                        }
                    }

                    CqlSession cqlSession = cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(connectionName);
                    ResultSet execute = cqlSession.execute(createTable.build());

                    List<Row> all = execute.all();


                    StringBuilder resultCreateIndex = new StringBuilder();
                    if (indicesList.size() != 0) {

                        for (cassandrauimanager.Entity.Index in : indicesList) {

                            try {
                                String name = in.getName();
                                String column = in.getColumn();


                                resultCreateIndex.append("\n").append("Index '").append(name).append("'");

                                CreateIndexStart index = createIndex(name);
                                CreateIndex createIndex;
                                CreateIndexOnTable createIndexOnTable;
                                if (in.getClassName().trim().isEmpty()) {
                                    createIndexOnTable = index.onTable(nameKs, nameTable);
                                } else {
                                    if (in.getClassName().trim().equals("org.apache.cassandra.index.sasi.SASIIndex")) {
                                        createIndexOnTable = index.usingSASI().onTable(nameKs, nameTable);
                                    } else {
                                        createIndexOnTable = index.custom(in.getClassName().trim()).onTable(nameKs, nameTable);
                                    }
                                }

                                if (in.getIsIndexOnKeys()) {
                                    createIndex = createIndexOnTable.andColumnKeys(column);
                                } else if (in.getIsIndexOnValues()) {
                                    createIndex = createIndexOnTable.andColumnValues(column);
                                } else {
                                    createIndex = createIndexOnTable.andColumn(column);
                                }


                                cqlSession.execute(createIndex.build());

                                resultCreateIndex.append(" was created successfully");
                            } catch (Exception e) {
                                resultCreateIndex.append(" ").append(e.getMessage());
                            }
                        }

                    }


                    return ("Table '" + nameTable + "'was created successfully " +
                            "\n" + resultCreateIndex.toString()).getBytes();


                } catch (Exception e) {
                    return e.getMessage().getBytes();
                }
            });
            post("/executequery", (req, res) -> {

                cassandrauimanager.Entity.Rows.Builder builderRows = cassandrauimanager.Entity.Rows.newBuilder();

                try {

                    String data = req.body();

                    JsonObject object = JsonParser.parseString(data).getAsJsonObject();

                    String connection = object.get("connection").getAsString();
                    String query = object.get("query").getAsString();


                    if (!cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().containsKey(connection)) {
                        return "Unknown connection alias".getBytes();
                    }
                    CqlSession cqlSession = cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(connection);

                    List<Row> all = cqlSession.execute(query).all();


                    if (all.size() > 0) {
                        StringBuilder header = new StringBuilder("[");

                        ColumnDefinitions definitions = all.get(0).getColumnDefinitions();


                        // todo:// header, in future change it

                        for (int i = 0; i < definitions.size(); i++) {
                            if (i > 0) {
                                header.append(", ");
                            }
                            ColumnDefinition definition = definitions.get(i);
                            String name = definition.getName().asCql(true);
                            header.append(name);
                        }
                        header.append("]");
                        builderRows.addRows(JsonParser.parseString(header.toString()).toString());


                        all.forEach(row -> {

                            StringBuilder result = new StringBuilder("[");
                            for (int i = 0; i < definitions.size(); i++) {
                                if (i > 0) {
                                    result.append(", ");
                                }
                                ColumnDefinition definition = definitions.get(i);

                                TypeCodec<Object> codec = row.codecRegistry().codecFor(definition.getType());
                                Object value = codec.decode(row.getBytesUnsafe(i), row.protocolVersion());

                                if (definition.getType() == DataTypes.BLOB) {
                                    if (value == null) {
                                        result.append("[null]");
                                    } else {
                                        // todo: parse this throw  exeption
                                        result.append("[binary_data]");
                                    }

                                } else {
                                    result.append(codec.format(value));
                                }

                            }
                            result.append("]");
                            JsonElement jsonElement = JsonParser.parseString(result.toString());
                            builderRows.addRows(jsonElement.toString());
                        });

                    }

                    if (builderRows.getRowsList().size() == 0) {
                        builderRows.addRows("[\"result\"]");
                        if (query.toLowerCase().trim().startsWith("select")) {
                            builderRows.addRows("[0]");
                        } else {
                            builderRows.addRows("[\"success\"]");
                        }


                        return builderRows.build().toByteArray();
                    } else {
                        return builderRows.build().toByteArray();
                    }

                } catch (Exception e) {
                    builderRows.addRows("[\"result\"]");
                    String s = e.getMessage().replaceAll("\"", "'");
                    builderRows.addRows("[\"" + s + "\"]");
                    return builderRows.build().toByteArray();
                }
            });

            post("/editusertype", (req, res) -> {
                try {

                    String userType = req.body();

                    JsonElement element = JsonParser.parseString(userType);

                    if (element.isJsonObject()) {

                        JsonObject object = element.getAsJsonObject();

                        String path = object.get("path").getAsString();
                        String nameType = object.get("nameType").getAsString();
                        JsonArray changeFields = (JsonArray) object.get("changed");

                        if (changeFields.size() == 0) {
                            return "Nothing changed".getBytes();
                        }
                        String nameConnection = path.split("[\\.]")[0];
                        String nameTargetKs = path.split("[\\.]")[1];

                        if (!cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().containsKey(nameConnection)) {
                            return "Unknown connection alias".getBytes();
                        }

                        AlterTypeStart alterTypeStart = alterType(nameTargetKs, nameType);


                        CqlSession cqlSession = cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(nameConnection);

                        StringBuilder result = new StringBuilder();


                        for (int i = 0; i < changeFields.size(); i++) {
                            JsonObject asJsonObject = changeFields.get(i).getAsJsonObject();

                            if (asJsonObject.has("add")) {

                                JsonObject addField = asJsonObject.get("add").getAsJsonObject();
                                SimpleStatement statement = alterTypeStart.addField(addField.get("name").getAsString().trim(), getType(addField.get("type").getAsString().trim())).build();
                                try {
                                    cqlSession.execute(statement);
                                    result.append("Successfully added field ").append(addField.get("name").getAsString()).append("\n");
                                } catch (Exception e) {
                                    result.append("Something wrong with added field ").append(asJsonObject.get("name").getAsString()).append("\n");
                                }

                            }
                            if (asJsonObject.has("changeOriginal")) {
                                JsonArray changeOriginal = asJsonObject.get("changeOriginal").getAsJsonArray();

                                JsonObject origin = changeOriginal.get(0).getAsJsonObject();
                                JsonObject replacement = changeOriginal.get(1).getAsJsonObject();

                                // after version Cassandra 3.10 and 3.0.11 this feature was be removed
//                            if (!origin.get("type").equals(replacement.get("type"))) {
//                                SimpleStatement statement = alterTypeStart.alterField(origin.get("name").getAsString(), getType(replacement.get("type").getAsString())).build();
//
//                                try {
//                                    cqlSession.execute(statement);
//                                    result.append("Successfully alter type for field ").append(origin.get("name").getAsString()).append("\n");
//                                } catch (Exception e) {
//                                    result.append("Something wrong with altered field type for  field ").append(origin.get("name").getAsString()).append("\n");
//                                }
//                            }

                                if (!origin.get("name").equals(replacement.get("name"))) {
                                    SimpleStatement statement = alterTypeStart.renameField(origin.get("name").getAsString().trim(), replacement.get("name").getAsString().trim()).build();

                                    try {
                                        cqlSession.execute(statement);
                                        result.append("Successfully  changed from ").append(origin.get("name").getAsString()).append(" to ").append(replacement.get("name").getAsString()).append("\n");
                                    } catch (Exception e) {
                                        result.append("Something wrong with changed name ").append(origin.get("name").getAsString()).append("\n");
                                    }
                                }

                            }

                        }

                        return result.toString().getBytes();
                    } else {
                        return "Not json object".getBytes();
                    }

                } catch (Exception e) {
                    return e.getMessage().getBytes();
                }
            });
            post("/edittable", (req, res) -> {
                try {

                    String change = req.body();

                    JsonElement element = JsonParser.parseString(change);


                    JsonObject object = element.getAsJsonObject();

                    String nameTable = object.get("nameTable").getAsString();
                    String connectionAlias = object.get("connectionAlias").getAsString();
                    String keyspace = object.get("keyspace").getAsString();


                    JsonArray changedOptions = (JsonArray) object.get("changedOptions");
                    JsonArray changedColumns = (JsonArray) object.get("changedColumns");
                    JsonArray indexsForChanged = (JsonArray) object.get("indexsForChanged");

                    if (!cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().containsKey(connectionAlias)) {
                        return "Unknown connection alias".getBytes();
                    }
                    CqlSession cqlSession = cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(connectionAlias);

                    StringBuilder result = new StringBuilder();

                    if (changedOptions.size() > 0) {

                        AlterTableStart alterTableStart = alterTable(keyspace, nameTable);
                        AlterTableWithOptionsEnd alterTableWithOptionsEnd = null;
                        for (JsonElement props : changedOptions) {
                            JsonObject prop = (JsonObject) props;

                            String nameProp = prop.get("name").getAsString();
                            if (nameProp.equals("bloom_filter_fp_chance")) {
                                try {
                                    String bloom_filter_fp_chance = prop.get("value").getAsString();
                                    double v = Double.parseDouble(bloom_filter_fp_chance.trim());
                                    alterTableWithOptionsEnd = alterTableStart.withBloomFilterFpChance(v);
                                    cqlSession.execute(alterTableWithOptionsEnd.build());
                                    result.append("bloom_filter_fp_chance was changed successfully\n");
                                } catch (Exception e) {
                                    result.append("bloom_filter_fp_chance was not changed successfully\n");
                                }
                            }
                            if (nameProp.equals("caching")) {
                                try {
                                    boolean keyResult = true;
                                    RowsPerPartition rowsPerPartition = RowsPerPartition.NONE;
                                    String value = prop.get("value").getAsString();
                                    JsonObject asJsonObject = JsonParser.parseString(value).getAsJsonObject();
                                    if (asJsonObject.has("keys") && asJsonObject.has("rows_per_partition")) {

                                        String keys = asJsonObject.get("keys").getAsString().toLowerCase();
                                        String rows_per_partition = asJsonObject.get("rows_per_partition").getAsString().toLowerCase();

                                        if (keys.equals("none")) {
                                            keyResult = false;
                                        }
                                        if (rows_per_partition.equals("all")) {
                                            rowsPerPartition = RowsPerPartition.ALL;
                                        }

                                    } else {
                                        throw new Exception();
                                    }
                                    alterTableWithOptionsEnd = alterTableStart.withCaching(keyResult, rowsPerPartition);
                                    cqlSession.execute(alterTableWithOptionsEnd.build());
                                    result.append("caching was changed successfully\n");
                                } catch (Exception e) {
                                    result.append("caching was not changed successfully\n");
                                }
                            }
                            if (nameProp.equals("comment")) {
                                try {
                                    String value = prop.get("value").getAsString();
                                    alterTableWithOptionsEnd = alterTableStart.withComment(value);
                                    cqlSession.execute(alterTableWithOptionsEnd.build());
                                    result.append("caching was changed successfully\n");
                                } catch (Exception e) {
                                    result.append("caching was not changed successfully\n");
                                }
                            }
                            if (nameProp.equals("compaction")) {
                                CompactionStrategy strategy = null;
                                try {
                                    String value = prop.get("value").getAsString();
                                    JsonObject asJsonObject = JsonParser.parseString(value).getAsJsonObject();
                                    if (asJsonObject.has("class")) {
                                        String aClass = asJsonObject.get("class").getAsString();
                                        if (aClass.equals("org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy")) {
                                            strategy = new DefaultSizeTieredCompactionStrategy();
                                        }
                                        if (aClass.equals("org.apache.cassandra.db.compaction.LeveledCompactionStrategy")) {
                                            strategy = new DefaultLeveledCompactionStrategy();
                                        }
                                        if (aClass.equals("org.apache.cassandra.db.compaction.TimeWindowCompactionStrategy")) {
                                            strategy = new DefaultTimeWindowCompactionStrategy();
                                        }
                                    }
                                    // todo: or all option or nothing
                                    for (String opt : asJsonObject.keySet()) {
                                        if (!opt.equals("class"))
                                            strategy = (CompactionStrategy) strategy.withOption(opt, asJsonObject.get(opt).getAsNumber());
                                    }

                                    alterTableWithOptionsEnd = alterTableStart.withCompaction(strategy);
                                    cqlSession.execute(alterTableWithOptionsEnd.build());
                                    result.append("compaction was changed successfully\n");
                                } catch (Exception e) {
                                    result.append("compaction was not changed successfully\n");
                                }
                            }
                            if (nameProp.equals("compression")) {
                                try {
                                    Compressor compressor = null;
                                    String value = prop.get("value").getAsString();
                                    JsonObject asJsonObject = JsonParser.parseString(value).getAsJsonObject();
                                    int chunk_length_in_kb = 64;
                                    double crc_check_chance = 1.0;

                                    if (asJsonObject.has("chunk_length_in_kb")) {
                                        int chunk_length = asJsonObject.get("chunk_length_in_kb").getAsInt();
                                        if (chunk_length_in_kb != chunk_length) {
                                            chunk_length_in_kb = chunk_length;
                                        }

                                    }

                                    for (JsonElement elem : changedOptions) {
                                        JsonObject p = (JsonObject) elem;
                                        String name = p.get("name").getAsString();
                                        if (name.equals("crc_check_chance")) {
                                            double crc_check = p.get("value").getAsDouble();
                                            if (crc_check != crc_check_chance) {
                                                crc_check_chance = crc_check;
                                            }
                                            break;
                                        }
                                    }


                                    if (asJsonObject.has("class")) {
                                        String aClass = asJsonObject.get("class").getAsString();

                                        if (chunk_length_in_kb != 64 || crc_check_chance != 1.0) {
                                            if (aClass.equals("oorg.apache.cassandra.io.compress.LZ4Compressor")) {
                                                alterTableWithOptionsEnd = alterTableStart.withLZ4Compression(chunk_length_in_kb, crc_check_chance);
                                            }
                                            if (aClass.equals("org.apache.cassandra.io.compress.SnappyCompressor")) {
                                                alterTableWithOptionsEnd = alterTableStart.withSnappyCompression(chunk_length_in_kb, crc_check_chance);
                                            }
                                            if (aClass.equals("org.apache.cassandra.io.compress.DeflateCompressor")) {
                                                alterTableWithOptionsEnd = alterTableStart.withDeflateCompression(chunk_length_in_kb, crc_check_chance);
                                            }
                                        } else {
                                            if (aClass.equals("oorg.apache.cassandra.io.compress.LZ4Compressor")) {
                                                alterTableWithOptionsEnd = alterTableStart.withLZ4Compression();
                                            }
                                            if (aClass.equals("org.apache.cassandra.io.compress.SnappyCompressor")) {
                                                alterTableWithOptionsEnd = alterTableStart.withSnappyCompression();
                                            }
                                            if (aClass.equals("org.apache.cassandra.io.compress.DeflateCompressor")) {
                                                alterTableWithOptionsEnd = alterTableStart.withDeflateCompression();
                                            }
                                        }

                                    }

                                    cqlSession.execute(alterTableWithOptionsEnd.build());
                                    result.append("compaction was changed successfully\n");
                                } catch (Exception e) {
                                    result.append("compaction was not changed successfully\n");
                                }
                            }
                            if (nameProp.equals("dclocal_read_repair_chance")) {
                                try {
                                    String dclocal_read_repair_chance = prop.get("value").getAsString();
                                    double v = Double.parseDouble(dclocal_read_repair_chance.trim());
                                    alterTableWithOptionsEnd = alterTableStart.withDcLocalReadRepairChance(v);
                                    cqlSession.execute(alterTableWithOptionsEnd.build());
                                    result.append("dclocal_read_repair_chance was changed successfully\n");
                                } catch (Exception e) {
                                    result.append("dclocal_read_repair_chance was not changed successfully\n");
                                }
                            }
                            if (nameProp.equals("default_time_to_live")) {
                                try {
                                    String default_time_to_live = prop.get("value").getAsString();
                                    int v = Integer.parseInt(default_time_to_live.trim());
                                    alterTableWithOptionsEnd = alterTableStart.withDefaultTimeToLiveSeconds(v);
                                    cqlSession.execute(alterTableWithOptionsEnd.build());
                                    result.append("default_time_to_live was changed successfully\n");
                                } catch (Exception e) {
                                    result.append("default_time_to_live was not changed successfully\n");
                                }
                            }
                            // todo: extensions ?
                            if (nameProp.equals("gc_grace_seconds")) {
                                try {
                                    String gc_grace_seconds = prop.get("value").getAsString();
                                    int v = Integer.parseInt(gc_grace_seconds.trim());
                                    alterTableWithOptionsEnd = alterTableStart.withGcGraceSeconds(v);
                                    cqlSession.execute(alterTableWithOptionsEnd.build());
                                    result.append("gc_grace_seconds was changed successfully\n");
                                } catch (Exception e) {
                                    result.append("gc_grace_seconds was not changed successfully\n");
                                }
                            }
                            if (nameProp.equals("max_index_interval")) {
                                try {
                                    String max_index_interval = prop.get("value").getAsString();
                                    int v = Integer.parseInt(max_index_interval.trim());
                                    alterTableWithOptionsEnd = alterTableStart.withMaxIndexInterval(v);
                                    cqlSession.execute(alterTableWithOptionsEnd.build());
                                    result.append("max_index_interval was changed successfully\n");
                                } catch (Exception e) {
                                    result.append("max_index_interval was not changed successfully\n");
                                }
                            }
                            if (nameProp.equals("memtable_flush_period_in_ms")) {
                                try {
                                    String memtable_flush_period_in_ms = prop.get("value").getAsString();
                                    int v = Integer.parseInt(memtable_flush_period_in_ms.trim());
                                    alterTableWithOptionsEnd = alterTableStart.withMemtableFlushPeriodInMs(v);
                                    cqlSession.execute(alterTableWithOptionsEnd.build());
                                    result.append("memtable_flush_period_in_ms was changed successfully\n");
                                } catch (Exception e) {
                                    result.append("memtable_flush_period_in_ms was not changed successfully\n");
                                }
                            }
                            if (nameProp.equals("min_index_interval")) {
                                try {
                                    String min_index_interval = prop.get("value").getAsString();
                                    int v = Integer.parseInt(min_index_interval.trim());
                                    alterTableWithOptionsEnd = alterTableStart.withMinIndexInterval(v);
                                    cqlSession.execute(alterTableWithOptionsEnd.build());
                                    result.append("min_index_interval was changed successfully\n");
                                } catch (Exception e) {
                                    result.append("min_index_interval was not changed successfully\n");
                                }
                            }
                            if (nameProp.equals("read_repair_chance")) {
                                try {
                                    String read_repair_chance = prop.get("value").getAsString();
                                    double v = Double.parseDouble(read_repair_chance.trim());
                                    alterTableWithOptionsEnd = alterTableStart.withReadRepairChance(v);
                                    cqlSession.execute(alterTableWithOptionsEnd.build());
                                    result.append("read_repair_chance was changed successfully\n");
                                } catch (Exception e) {
                                    result.append("read_repair_chance was not changed successfully\n");
                                }
                            }
                            if (nameProp.equals("speculative_retry")) {
                                try {
                                    String read_repair_chance = prop.get("value").getAsString();
//                                double v = Double.parseDouble(read_repair_chance.trim());
                                    alterTableWithOptionsEnd = alterTableStart.withSpeculativeRetry(read_repair_chance);
                                    cqlSession.execute(alterTableWithOptionsEnd.build());
                                    result.append("speculative_retry was changed successfully\n");
                                } catch (Exception e) {
                                    result.append("speculative_retry was not changed successfully\n");
                                }
                            }

                        }


                    }

                    if (changedColumns.size() > 0) {
                        AlterTableStart alterTableStart = alterTable(keyspace, nameTable);
                        AlterTableAddColumnEnd alterTableAddColumnEnd = null;
                        AlterTableRenameColumnEnd alterTableRenameColumnEnd = null;
                        AlterTableDropColumnEnd dropColumnEnd = null;
                        for (JsonElement data : changedColumns) {
                            JsonObject asJsonObject = data.getAsJsonObject();

                            if (asJsonObject.has("add")) {
                                JsonArray add = asJsonObject.get("add").getAsJsonArray();
                                for (JsonElement addObject : add) {
                                    try {
                                        JsonObject obj = addObject.getAsJsonObject();
                                        alterTableAddColumnEnd = alterTableStart.addColumn(obj.get("name").getAsString(), getType(obj.get("type").getAsString()));
                                        cqlSession.execute(alterTableAddColumnEnd.build());
                                        result.append("Columns was add successfully\n");
                                    } catch (Exception e) {
                                        result.append("Columns was not add successfully\n");
                                    }
                                }
                            }

                            if (asJsonObject.has("rename")) {
                                JsonArray add = asJsonObject.get("rename").getAsJsonArray();
                                for (JsonElement addObject : add) {
                                    try {
                                        JsonObject obj = addObject.getAsJsonObject();
                                        alterTableRenameColumnEnd = alterTableStart.renameColumn(obj.get("from").getAsString(), obj.get("to").getAsString());
                                        cqlSession.execute(alterTableRenameColumnEnd.build());
                                        result.append("Columns was rename successfully\n");
                                    } catch (Exception e) {
                                        result.append("Columns was not rename successfully\n");
                                    }
                                }
                            }

                            if (asJsonObject.has("delete")) {
                                JsonArray add = asJsonObject.get("delete").getAsJsonArray();
                                for (JsonElement addObject : add) {
                                    try {
                                        String obj = addObject.getAsString();
                                        dropColumnEnd = alterTableStart.dropColumn(obj);
                                        cqlSession.execute(dropColumnEnd.build());
                                        result.append("Columns was drop successfully\n");
                                    } catch (Exception e) {
                                        result.append("Columns was not  drop successfully\n");
                                    }
                                }
                            }
                        }

                    }
                    if (indexsForChanged.size() > 0) {
                        for (JsonElement data : indexsForChanged) {
                            JsonObject asJsonObject = data.getAsJsonObject();

                            if (asJsonObject.has("add")) {
                                JsonArray add = asJsonObject.get("add").getAsJsonArray();
                                for (JsonElement addObject : add) {
                                    try {

                                        JsonObject idx = (JsonObject) addObject;

                                        CreateIndexStart index = createIndex(idx.get("name").getAsString().trim());
                                        CreateIndex createIndex = null;
                                        CreateIndexOnTable createIndexOnTable = null;
                                        if (idx.get("className").getAsString().trim().isEmpty()) {
                                            createIndexOnTable = index.onTable(keyspace, nameTable);
                                        } else {
                                            if (idx.get("className").getAsString().trim().equals("org.apache.cassandra.index.sasi.SASIIndex")) {
                                                createIndexOnTable = index.usingSASI().onTable(keyspace, nameTable);
                                            } else {
                                                createIndexOnTable = index.custom(idx.get("className").getAsString().trim()).onTable(keyspace, nameTable);
                                            }
                                        }

                                        if (idx.get("isIndexOnKeys").getAsBoolean()) {
                                            createIndex = createIndexOnTable.andColumnKeys(idx.get("column").getAsString());
                                        } else if (idx.get("isIndexOnValues").getAsBoolean()) {
                                            createIndex = createIndexOnTable.andColumnValues(idx.get("column").getAsString());
                                        } else {
                                            createIndex = createIndexOnTable.andColumn(idx.get("column").getAsString());
                                        }

                                        if (createIndex != null) {
                                            cqlSession.execute(createIndex.build());
                                        }

                                    } catch (Exception e) {

                                    }
                                }
                            }
                            if (asJsonObject.has("delete")) {

                                JsonArray add = asJsonObject.get("delete").getAsJsonArray();
                                for (JsonElement addObject : add) {
                                    try {
                                        String idx = addObject.getAsString();
                                        cqlSession.execute(dropIndex(keyspace, idx.trim()).build());
                                    } catch (Exception e) {

                                    }
                                }

                            }
                        }
                    }

                    return result.toString().getBytes();

                } catch (Exception e) {
                    return e.getMessage().getBytes();
                }
            });

            post("/dropusertype", (req, res) -> {
                try {

                    String userType = req.body();

                    String[] pathType = userType.split("\\.");
                    String connectionName = pathType[0];
                    String keyspace = pathType[1];
                    String typeName = pathType[2];

                    if (!cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().containsKey(connectionName)) {
                        return "Unknown connection alias".getBytes();
                    }

                    CqlSession cqlSession = cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(connectionName);

                    SimpleStatement dropTypeStatement = dropType(keyspace, typeName).build();
                    cqlSession.execute(dropTypeStatement);

                    return ("User Type '" + typeName + "' was drop successfully").getBytes();
                } catch (Exception e) {
                    return e.getMessage().getBytes();
                }

            });


            // open window automaticaly
            Desktop.getDesktop().browse(URI.create("http://localhost:" + defaultPort));
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

    }


    private static byte[] getDataByCondition(Request req, String condition) {
        String result = "";
        try {
            String body = req.body();

            JsonObject params = (JsonObject) JsonParser.parseString(body);

            String keyspaceName = null;

            if (params.has("nameKeySpace")) {
                keyspaceName = params.get("nameKeySpace").getAsString();
            }

            if (params.has("host") && params.has("port") && params.has("connection_alias")) {

                CqlSession cqlSession = null;
                if (cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(params.get("connection_alias").getAsString()) != null) {
                    cqlSession = cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(params.get("connection_alias").getAsString());
                } else {
                    cassandrauimanager.TestConnection checkAndSave = null;

                    if (params.get("user") != null && !"".equals(params.get("user").getAsString())) {

                        checkAndSave = new cassandrauimanager.TestConnection(params.get("host").getAsString(), params.get("port").getAsInt(),
                                params.get("user").getAsString(), params.get("pass").getAsString());
                    } else {
                        checkAndSave = new cassandrauimanager.TestConnection(params.get("host").getAsString(), params.get("port").getAsInt());
                    }
                    result = checkAndSave.checkAndSaveConnection(params.get("connection_alias").getAsString());
                    if (!result.equals("Connected")) {
                        return cassandrauimanager.Errormessage.Error.newBuilder().setText(result).build().toByteArray();
                    }
                    cqlSession = cassandrauimanager.ContainerConnections.getINSTANCE().getConnections().get(params.get("connection_alias").getAsString());

                }


                if (condition.equals("keyspaces")) {
                    return getKeyspaces(keyspaceName, cqlSession);
                }
                if (condition.equals("types")) {
                    return getTypes(keyspaceName, cqlSession);
                }
                if (condition.equals("functions")) {
                    return getFunctions(keyspaceName, cqlSession);
                }
                if (condition.equals("aggfunctions")) {
                    return getAggregateFunctions(keyspaceName, cqlSession);
                }
                if (condition.equals("roles")) {
                    return getRolesAsBytes(cqlSession);
                }
                if (condition.equals("views")) {
                    return getMViews(keyspaceName, cqlSession);
                }
                if (condition.equals("tables")) {
                    return getTables(keyspaceName, cqlSession);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return result.getBytes();
    }

    private static byte[] getKeyspaces(String keyspaceName, CqlSession cqlSession) {
        MetaData metaData = new MetaData(cqlSession);
        return metaData.getKeyspaces(keyspaceName);
    }

    private static byte[] getTypes(String keyspaceName, CqlSession cqlSession) {
        MetaData metaData = new MetaData(cqlSession);
        return metaData.getTypes(keyspaceName);
    }

    private static byte[] getFunctions(String keyspaceName, CqlSession cqlSession) {
        MetaData metaData = new MetaData(cqlSession);
        return metaData.getFunctions(keyspaceName);
    }

    private static byte[] getAggregateFunctions(String keyspaceName, CqlSession cqlSession) {
        MetaData metaData = new MetaData(cqlSession);

        return metaData.getAggregateFunctions(keyspaceName);
    }

    private static byte[] getMViews(String keyspaceName, CqlSession cqlSession) {
        MetaData metaData = new MetaData(cqlSession);
        return metaData.getMViews(keyspaceName);
    }

    private static byte[] getTables(String keyspaceName, CqlSession cqlSession) {
        MetaData metaData = new MetaData(cqlSession);
        return metaData.getTables(keyspaceName);
    }


}
