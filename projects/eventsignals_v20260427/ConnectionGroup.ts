import type Connection from "./Connection.js";
import type HtmlConnection from "./HtmlConnection.js";

export default class ConnectionGroup {
    connections: (Connection<any> | HtmlConnection)[] = [];
    constructor() {

    }
    add(conn: Connection<any> | HtmlConnection) {
        this.connections.push(conn);
    }
    disconnectAll() {
        for(const conn of [...this.connections]) {
            conn.disconnect();
        }
        this.connections = [];
    }
}