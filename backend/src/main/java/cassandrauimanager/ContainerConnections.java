package cassandrauimanager;

import com.datastax.oss.driver.api.core.CqlSession;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ContainerConnections {


    private final Map<String, CqlSession> connections = new ConcurrentHashMap<>();

    public static final ContainerConnections INSTANCE = new ContainerConnections();


    public Map<String, CqlSession> getConnections() {
        return connections;
    }

    public static ContainerConnections getINSTANCE() {
        return INSTANCE;
    }
}
