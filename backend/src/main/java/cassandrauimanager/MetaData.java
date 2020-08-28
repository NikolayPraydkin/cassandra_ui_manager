package cassandrauimanager;

import com.datastax.oss.driver.api.core.CqlIdentifier;
import com.datastax.oss.driver.api.core.CqlSession;

import com.datastax.oss.driver.api.core.metadata.Metadata;

import com.datastax.oss.driver.api.core.metadata.schema.*;

import com.datastax.oss.driver.api.core.type.UserDefinedType;
import com.datastax.oss.driver.internal.core.data.DefaultTupleValue;

import java.nio.ByteBuffer;
import java.util.*;


import static cassandrauimanager.utils.Utils.*;

public class MetaData {


    private CqlSession session;
//    private Map<String, Map<String, String>> triggers = new HashMap<>();

    public MetaData(CqlSession session) {
        this.session = session;
    }

    byte[] getKeyspaces(String name) {
        Metadata metadata = this.session.getMetadata();

//        if (trig.size() != 0) {
//            //todo: i dont how add triggers to cassandra
//            triggers.clear();
//            trig.forEach(row -> {
//                String keyspace_name = row.getString("keyspace_name");
//                String table_name = row.getString("table_name");
//                String trigger_name = row.getString("trigger_name");
//                if (triggers.containsKey(keyspace_name)) {
//                    triggers.get("trigger_name").put(table_name,trigger_name);
//                } else {
//                    Map<String,String> trigByKS = new HashMap<>();
//                    trigByKS.put(table_name,trigger_name);
//                    triggers.put(keyspace_name,trigByKS);
//                }
//
//            });
//        }

        cassandrauimanager.Entity.KeySpaces.Builder keySpaces = cassandrauimanager.Entity.KeySpaces.newBuilder();

        metadata.getKeyspaces().forEach((k, v) -> {
            if (name == null) {
                fillKeyspace(keySpaces, k, v);
            } else {
                if (k.toString().toLowerCase().equals(name.toLowerCase())) {
                    fillKeyspace(keySpaces, k, v);
                }
            }

        });

        keySpaces.addAllRoles(getRolesAsArray(session));

        return keySpaces.build().toByteArray();

    }

    byte[] getTypes(String nameKS) {
        Metadata metadata = this.session.getMetadata();

        cassandrauimanager.Entity.KeySpace.Builder kSpace = cassandrauimanager.Entity.KeySpace.newBuilder();

        metadata.getKeyspace(nameKS).get().getUserDefinedTypes().forEach((nameType, valueType) -> {
            cassandrauimanager.Entity.UserType.Builder types = cassandrauimanager.Entity.UserType.newBuilder();
            types.setName(nameType.toString());
            int countTypes = valueType.getFieldNames().size();
            for (int i = 0; i < countTypes; i++) {
                cassandrauimanager.Entity.Field.Builder field = cassandrauimanager.Entity.Field.newBuilder();
                field.setName(valueType.getFieldNames().get(i).toString());
                field.setType(valueType.getFieldTypes().get(i).toString().toLowerCase());
                types.addFields(field);
            }
            kSpace.addUserTypes(types);
        });


        return kSpace.build().toByteArray();

    }

    byte[] getTables(String nameKS) {
        Metadata metadata = this.session.getMetadata();

        cassandrauimanager.Entity.KeySpace.Builder kSpace = cassandrauimanager.Entity.KeySpace.newBuilder();

        if (metadata.getKeyspace(nameKS).isPresent()) {
            metadata.getKeyspace(nameKS).get().getTables().forEach((nameTable, valueTable) -> {
                cassandrauimanager.Entity.Table.Builder table = cassandrauimanager.Entity.Table.newBuilder();
                table.setName(nameTable.toString());


                valueTable.getPartitionKey().forEach(pK -> {
                    table.addPartitionKey(pK.getName().toString());

                });
                valueTable.getClusteringColumns().forEach((columnMetadata, clusteringOrder) -> {
                    table.addClusteringKey(columnMetadata.getName().toString());
                });

                valueTable.getOptions().forEach((kOpt, vOpt) -> {
                    table.putOptions(kOpt.toString(), vOpt.toString());
                });

                table.setDescribe(valueTable.describe(true));


                valueTable.getIndexes().forEach((kIn, vIn) -> {
                    String name = vIn.getName().toString();
                    String className = "";
                    if (vIn.getClassName().isPresent()) {
                        className = vIn.getClassName().get();
                    }
                    String target = vIn.getTarget();
                    String keySpace = vIn.getKeyspace().toString();

                    cassandrauimanager.Entity.Index.Builder index = cassandrauimanager.Entity.Index.newBuilder();
                    index.setName(name);
                    index.setClassName(className);
                    index.setColumn(target);
                    index.setKeyspace(keySpace);

                    table.addIndices(index);
                });

                valueTable.getColumns().forEach((cName, cValue) -> {
                    cassandrauimanager.Entity.Column.Builder column = cassandrauimanager.Entity.Column.newBuilder();
                    if (table.getPartitionKeyList().contains(cName.toString())) {
                        column.setIsPartitionKey(true);
                    }
                    if (table.getClusteringKeyList().contains(cName.toString())) {
                        column.setIsClusteringKey(true);
                    }
                    column.setIsStatic(cValue.isStatic());
                    column.setName(cName.toString());
                    column.setType(cValue.getType().toString());
                    table.addColumns(column);
                });
                kSpace.addTables(table);
            });
        }

        return kSpace.build().toByteArray();

    }

    byte[] getFunctions(String nameKS) {
        Metadata metadata = this.session.getMetadata();

        cassandrauimanager.Entity.KeySpace.Builder kSpace = cassandrauimanager.Entity.KeySpace.newBuilder();

        metadata.getKeyspace(nameKS).get().getFunctions().forEach((nameFunc, valueFunc) -> {
            cassandrauimanager.Entity.UserFunction.Builder func = cassandrauimanager.Entity.UserFunction.newBuilder();

            func.setName(valueFunc.getSignature().getName().toString());
            func.setSignature(valueFunc.getSignature().toString());
            func.setCalledOnNullInput(valueFunc.isCalledOnNullInput());
            func.setKeyspace(valueFunc.getKeyspace().toString());
            func.setBody(valueFunc.getBody());
            func.setReturnType(valueFunc.getReturnType().toString());
            func.setLanguage(valueFunc.getLanguage());


            kSpace.addUserFunctions(func);

        });


        return kSpace.build().toByteArray();

    }

    byte[] getAggregateFunctions(String nameKS) {
        Metadata metadata = this.session.getMetadata();

        cassandrauimanager.Entity.KeySpace.Builder kSpace = cassandrauimanager.Entity.KeySpace.newBuilder();

        if (metadata.getKeyspace(nameKS).isPresent()) {
            metadata.getKeyspace(nameKS).get().getAggregates().forEach((nameFunc, valueFunc) -> {
                cassandrauimanager.Entity.AggregateFunction.Builder aggfunc = cassandrauimanager.Entity.AggregateFunction.newBuilder();

                aggfunc.setName(valueFunc.getSignature().getName().toString());
                aggfunc.setSignature(valueFunc.getSignature().toString());
                aggfunc.setSFunc(valueFunc.getStateFuncSignature().toString());
                aggfunc.setSType(valueFunc.getStateType().toString());
                aggfunc.setFinalFunc(valueFunc.getFinalFuncSignature().toString());
                aggfunc.setInitCond(valueFunc.getInitCond().toString());

                kSpace.addAggregateFunctions(aggfunc);

            });
        }

        return kSpace.build().toByteArray();

    }

    byte[] getMViews(String nameKS) {
        Metadata metadata = this.session.getMetadata();

        cassandrauimanager.Entity.KeySpace.Builder kSpace = cassandrauimanager.Entity.KeySpace.newBuilder();

        if (metadata.getKeyspace(nameKS).isPresent()) {
            metadata.getKeyspace(nameKS).get().getViews().forEach((name, value) -> {
                cassandrauimanager.Entity.MateriliazedView.Builder view = cassandrauimanager.Entity.MateriliazedView.newBuilder();
                view.setName(value.getName().toString());
                view.setBaseTable(value.getBaseTable().toString());
                view.setNameKeySpace(value.getKeyspace().toString());
                view.setWhereClause(value.getWhereClause().toString());
                value.getOptions().forEach((k, v) -> {
                    view.putOptions(k.toString(), v.toString());
                });
                view.setDescribe(value.describe(true));
                view.setIncludesAllColumns(value.includesAllColumns());
                kSpace.addViews(view);

            });
        }

        return kSpace.build().toByteArray();

    }

    private void fillKeyspace(cassandrauimanager.Entity.KeySpaces.Builder keySpaces, CqlIdentifier k, KeyspaceMetadata v) {
        try {
            cassandrauimanager.Entity.KeySpace.Builder kSpace = cassandrauimanager.Entity.KeySpace.newBuilder();
            kSpace.setName(k.toString());

            // durableWrites
            kSpace.setDurableWrites(v.isDurableWrites());

            //replication
            kSpace.putAllReplication(v.getReplication());


            // set tables to keyspace
            Map<CqlIdentifier, TableMetadata> tables = v.getTables();
            tables.forEach((nameTable, valueTable) -> {
                cassandrauimanager.Entity.Table.Builder table = cassandrauimanager.Entity.Table.newBuilder();
                table.setName(nameTable.toString());


                valueTable.getPartitionKey().forEach(pK -> {
                    table.addPartitionKey(pK.getName().toString());

                });
                valueTable.getClusteringColumns().forEach((columnMetadata, clusteringOrder) -> {
                    table.addClusteringKey(columnMetadata.getName().toString());
                });

                valueTable.getOptions().forEach((kOpt, vOpt) -> {
                    table.putOptions(kOpt.toString(), vOpt.toString());
                });

                table.setDescribe(valueTable.describe(true));


                valueTable.getIndexes().forEach((kIn, vIn) -> {
                    String name = vIn.getName().toString();
                    String className = "";
                    if (vIn.getClassName().isPresent()) {
                        className = vIn.getClassName().get();
                    }
                    String target = vIn.getTarget();
                    String keySpace = vIn.getKeyspace().toString();

                    cassandrauimanager.Entity.Index.Builder index = cassandrauimanager.Entity.Index.newBuilder();
                    index.setName(name);
                    index.setClassName(className);
                    index.setColumn(target);
                    index.setKeyspace(keySpace);

                    table.addIndices(index);
                });

                valueTable.getColumns().forEach((cName, cValue) -> {
                    cassandrauimanager.Entity.Column.Builder column = cassandrauimanager.Entity.Column.newBuilder();
                    if (table.getPartitionKeyList().contains(cName.toString())) {
                        column.setIsPartitionKey(true);
                    }
                    if (table.getClusteringKeyList().contains(cName.toString())) {
                        column.setIsClusteringKey(true);
                    }
                    column.setIsStatic(cValue.isStatic());
                    column.setName(cName.toString());
                    column.setType(cValue.getType().toString());
                    table.addColumns(column);
                });
                kSpace.addTables(table);
            });

            // set user types
            Map<CqlIdentifier, UserDefinedType> userDefinedTypes = v.getUserDefinedTypes();

            userDefinedTypes.forEach((nameType, valueType) -> {
                cassandrauimanager.Entity.UserType.Builder types = cassandrauimanager.Entity.UserType.newBuilder();


                types.setName(nameType.toString());

                int countTypes = valueType.getFieldNames().size();

                for (int i = 0; i < countTypes; i++) {
                    cassandrauimanager.Entity.Field.Builder field = cassandrauimanager.Entity.Field.newBuilder();
                    field.setName(valueType.getFieldNames().get(i).toString());
                    field.setType(valueType.getFieldTypes().get(i).toString().toLowerCase());
                    types.addFields(field);
                }
                kSpace.addUserTypes(types);
            });


            // set functions
            Map<FunctionSignature, FunctionMetadata> functions = v.getFunctions();

            functions.forEach((nameFunc, valueFunc) -> {
                cassandrauimanager.Entity.UserFunction.Builder func = cassandrauimanager.Entity.UserFunction.newBuilder();

                func.setName(valueFunc.getSignature().getName().toString());

                StringBuilder signatureWithName = new StringBuilder();

                if (valueFunc.getParameterNames().size() > 0) {

                    String nameWithoutSignature = valueFunc.getSignature().getName().toString();
                    try {
                        String signatureWithoutName = valueFunc.getSignature().toString().replaceAll(nameWithoutSignature + "\\((.*)\\)", "$1").trim();
                        List<String> strings = checkAndReturnParams(signatureWithoutName);

                        List<CqlIdentifier> parameterNames = valueFunc.getParameterNames();

                        for (int i = 0; i < parameterNames.size(); i++) {
                            if (i == parameterNames.size() - 1) {
                                signatureWithName.append(parameterNames.get(i)).append(" ").append(strings.get(i));
                            } else {
                                signatureWithName.append(parameterNames.get(i)).append(" ").append(strings.get(i)).append(",");
                            }

                        }
                        String format = String.format(nameWithoutSignature + "(%s)", signatureWithName);
                        signatureWithName.setLength(0);
                        signatureWithName.append(format);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }


                }

                func.setSignature(signatureWithName.toString());

                func.setCalledOnNullInput(valueFunc.isCalledOnNullInput());
                func.setKeyspace(valueFunc.getKeyspace().toString());
                func.setBody(valueFunc.getBody());
                func.setLanguage(valueFunc.getLanguage());
                func.setReturnType(valueFunc.getReturnType().toString());


                kSpace.addUserFunctions(func);

            });

            //set aggregates
            Map<FunctionSignature, AggregateMetadata> aggregates = v.getAggregates();

            aggregates.forEach((nameAggregate, valueAggregate) -> {
                cassandrauimanager.Entity.AggregateFunction.Builder aggr = cassandrauimanager.Entity.AggregateFunction.newBuilder();
                aggr.setName(valueAggregate.getSignature().getName().toString());
                aggr.setSignature(valueAggregate.getSignature().toString());
                aggr.setSFunc(valueAggregate.getStateFuncSignature().toString());
                aggr.setSType(valueAggregate.getStateType().toString());

                if (valueAggregate.getFinalFuncSignature().isPresent()) {
                    aggr.setFinalFunc(valueAggregate.getFinalFuncSignature().get().getName().toString());
                }
                if (valueAggregate.getInitCond().isPresent()) {
                    Object o = valueAggregate.getInitCond().get();
                    // todo: need think about this
                    if (o instanceof DefaultTupleValue) {
                        DefaultTupleValue o1 = (DefaultTupleValue) o;
                        ByteBuffer bytesUnsafe = o1.getBytesUnsafe(0);
//                        System.out.println("dasdf");
                    }

//                    aggr.setInitCond("fdg");
                }
                kSpace.addAggregateFunctions(aggr);
            });


            // set views
            Map<CqlIdentifier, ViewMetadata> views = v.getViews();

            views.forEach((nameView, value) -> {
                cassandrauimanager.Entity.MateriliazedView.Builder view = cassandrauimanager.Entity.MateriliazedView.newBuilder();
                view.setName(value.getName().toString());
                view.setBaseTable(value.getBaseTable().toString());
                view.setNameKeySpace(value.getKeyspace().toString());
                view.setWhereClause(value.getWhereClause().toString());

                value.getOptions().forEach((kOpt, vOpt) -> {
                    view.putOptions(kOpt.toString(), vOpt.toString());
                });
                view.setDescribe(value.describe(true));
                view.setIncludesAllColumns(value.includesAllColumns());
                kSpace.addViews(view);
            });
            keySpaces.addKeyspaces(kSpace);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
