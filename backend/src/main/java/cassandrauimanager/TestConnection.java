package cassandrauimanager;

import com.datastax.oss.driver.api.core.CqlSession;
import com.datastax.oss.driver.api.core.CqlSessionBuilder;

import java.net.InetSocketAddress;

public class TestConnection {

    private String host;
    private int port;
    private String user;
    private String pass;


    public TestConnection(String host, int port) {
        this.host = host;
        this.port = port;
    }

    public TestConnection(String host, int port, String user, String pass) {
        this.host = host;
        this.port = port;
        this.user = user;
        this.pass = pass;
    }

    private CqlSession makeCqlSession() {
        CqlSessionBuilder cqlSessionBuilder = CqlSession.builder()
                .addContactPoint(new InetSocketAddress(this.host, this.port));
        if (user != null && pass != null) {
            cqlSessionBuilder.withAuthCredentials(user, pass);
        }

        return cqlSessionBuilder.withLocalDatacenter("datacenter1")
                .build();
    }

    public String checkConnection() {
        try (CqlSession session = makeCqlSession()) {
            return "Connected";
        } catch (Exception e) {
            return e.getMessage();
        }

    }

    public String checkAndSaveConnection(String alias) {
        try {
            CqlSession session = makeCqlSession();
            ContainerConnections.getINSTANCE().getConnections().put(alias, session);
            return "Connected";
        } catch (Exception e) {
            return e.getMessage();
        }

    }


}
