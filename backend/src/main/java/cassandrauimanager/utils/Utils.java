package cassandrauimanager.utils;

import cassandrauimanager.Entity;
import com.datastax.oss.driver.api.core.CqlSession;
import com.datastax.oss.driver.api.core.cql.ResultSet;
import com.datastax.oss.driver.api.core.cql.SimpleStatement;
import com.datastax.oss.driver.api.core.type.DataType;
import com.datastax.oss.driver.api.core.type.DataTypes;

import java.util.*;

import static com.datastax.oss.driver.api.querybuilder.QueryBuilder.selectFrom;

public class Utils {


    public static Map<String, DataType> getHandleSignature(String signature) throws Exception {

        String str = signature.trim().replaceAll("\\s+", " ");

        Map<String, DataType> paramsFunction = new HashMap<>();

        boolean complicated = checkComplicatedType(str);


        if (!complicated) {
            int i = str.indexOf(" ");
            str = str.trim();
            String nameParameter = str.substring(0, i);
            String type = str.substring(i + 1);
            paramsFunction.put(nameParameter, getType(type));
        } else {

            for (String param : checkAndReturnParams(str)) {
                String nameParameter;
                String type;
                try {
                    int i = param.trim().indexOf(" ");
                    nameParameter = param.trim().substring(0, i);
                    type = param.substring(i + 1);
                } catch (Exception e) {
                    throw new Exception("Lost name in parameter " + param);
                }
                DataType[] complicatedType = getComplicatedType(type);
                paramsFunction.put(nameParameter.trim(), complicatedType[0]);

            }

        }

        return paramsFunction;
    }


    public static DataType[] getComplicatedType(String type) throws Exception {

        if (!type.contains("<") || !type.contains(">")) {
            String t = type.trim();
            DataType[] types = new DataType[1];
            types[0] = getType(t);
            return types;
        } else {
            String stringTrim = type.trim();

            if (stringTrim.toLowerCase().startsWith("tuple")) {
                return getDataTypes(stringTrim, "tuple");
            } else if (stringTrim.toLowerCase().startsWith("map")) {
                return getDataTypes(stringTrim, "map");
            } else if (stringTrim.toLowerCase().startsWith("set")) {

                return getDataTypes(stringTrim, "set");
            } else if (stringTrim.toLowerCase().startsWith("list")) {

                return getDataTypes(stringTrim, "list");
            } else {
                throw new Exception("Not valid parameter " + stringTrim);
            }
        }

    }

    public static DataType[] getDataTypes(String stringTrim, String type) throws Exception {

        if (!stringTrim.toLowerCase().matches(type + "[\\s<].*")) {
            throw new Exception("Type " + stringTrim + " not valid");
        }

        stringTrim = stringTrim.replaceFirst(type, "").trim().replaceAll("<(.*)>", "$1").trim();
        List<String> strings = checkAndReturnParams(stringTrim);


        List<DataType> types = new ArrayList<>();
        for (String item : strings) {
            types.add(getComplicatedType(item)[0]);
        }
        DataType[] dataTypes = new DataType[types.size()];
        for (int i = 0; i < types.size(); i++) {
            dataTypes[i] = types.get(i);
        }
        DataType[] dataType = new DataType[1];

        dataType[0] = getConcreteDataType(dataTypes, type);

        return dataType;
    }

    public static byte[] getRolesAsBytes(CqlSession cqlSession) {
        SimpleStatement statement = selectFrom("system_auth", "roles").all().build();
        ResultSet execute = cqlSession.execute(statement);


        Entity.Roles.Builder roles = Entity.Roles.newBuilder();

        execute.all().forEach(item -> {
            Entity.Role.Builder user = Entity.Role.newBuilder();

            user.setName(item.getString("role"));
            user.putOptions("login", item.getBoolean("can_login") + "");
            user.putOptions("superuser", item.getBoolean("is_superuser") + "");
            Set<String> member_of = item.getSet("member_of", String.class);
            user.setMemberOf(member_of !=  null ? member_of.toString() : "");
            roles.addRoles(user);
        });
        return roles.build().toByteArray();
    }

    public static List<Entity.Role> getRolesAsArray(CqlSession cqlSession) {
        SimpleStatement statement = selectFrom("system_auth", "roles").all().build();
        ResultSet execute = cqlSession.execute(statement);

        List<Entity.Role> roles = new ArrayList<>();

        execute.all().forEach(item -> {
            Entity.Role.Builder user = Entity.Role.newBuilder();

            user.setName(item.getString("role"));
            user.putOptions("login", item.getBoolean("can_login") + "");
            user.putOptions("superuser", item.getBoolean("is_superuser") + "");
            Set<String> member_of = item.getSet("member_of", String.class);
            user.setMemberOf(member_of.toString());
            roles.add(user.build());
        });
        return roles;
    }


    public static DataType getConcreteDataType(DataType[] dataTypes, String stringTrim) {
        if (stringTrim.toLowerCase().startsWith("tuple")) {
            return DataTypes.tupleOf(dataTypes);
        }

        if (stringTrim.toLowerCase().startsWith("map")) {
            return DataTypes.mapOf(dataTypes[0], dataTypes[1]);
        }
        if (stringTrim.toLowerCase().startsWith("set")) {
            return DataTypes.setOf(dataTypes[0]);
        }
        if (stringTrim.toLowerCase().startsWith("list")) {
            return DataTypes.listOf(dataTypes[0]);
        }
        return null;
    }

    public static List<String> checkAndReturnParams(String string) {
        List<String> params = new ArrayList<>();

        String[] split = string.split(",");

        String end = Arrays.stream(split).reduce("", (left, right) ->
        {
            if (left.contains("<") || left.contains(">")) {
                if (checkComplicatedType(left)) {
                    params.add(left);
                    return right;
                } else {
                    return left + "," + right;
                }
            } else {
                if (!left.trim().isEmpty()) {
                    params.add(left);
                }
                return right;
            }
        });
        params.add(end);
        return params;
    }

    public static boolean checkComplicatedType(String string) {
        long countLeftAngleBrackets = string.chars().filter(ch -> ch == '<').count();
        long countRightAngleBrackets = string.chars().filter(ch -> ch == '>').count();
        return countLeftAngleBrackets == countRightAngleBrackets;
    }

    public static DataType getType(String type) {
        switch (type) {
            case "ascii":
                return DataTypes.ASCII;
            case "bigint":
                return DataTypes.BIGINT;
            case "blob":
                return DataTypes.BLOB;
            case "boolean":
                return DataTypes.BOOLEAN;
            case "counter":
                return DataTypes.COUNTER;
            case "decimal":
                return DataTypes.DECIMAL;
            case "double":
                return DataTypes.DOUBLE;
            case "float":
                return DataTypes.FLOAT;
            case "int":
                return DataTypes.INT;
            case "timestamp":
                return DataTypes.TIMESTAMP;
            case "uuid":
                return DataTypes.UUID;
            case "varint":
                return DataTypes.VARINT;
            case "timeuuid":
                return DataTypes.TIMEUUID;
            case "inet":
                return DataTypes.INET;
            case "date":
                return DataTypes.DATE;
            case "text":
                return DataTypes.TEXT;
            case "time":
                return DataTypes.TIME;
            case "smallint":
                return DataTypes.SMALLINT;
            case "tinyint":
                return DataTypes.TINYINT;
            case "duration":
                return DataTypes.DURATION;
            default:
//                return "0x" + Integer.toHexString(type);
                return DataTypes.custom(type);
        }
    }

}
