export class Connection {
    signal;
    callback;
    constructor(signal, callback) {
        this.signal = signal;
        this.callback = callback;
    }
    disconnect() {
        this.signal.removeConnection(this);
    }
}
export class Signal {
    connections = [];
    constructor() { }
    connect(callback, options = {}) {
        const connection = new Connection(this, callback);
        this.connections.push(connection);
        if (options.init) {
            callback(...(options.initArgs ?? []));
        }
        return connection;
    }
    once(callback) {
        const connection = this.connect((...args) => {
            callback(...args);
            connection.disconnect();
        });
        return connection;
    }
    connectAndRun(callback) {
        const connection = this.connect(callback);
        callback();
        return connection;
    }
    removeConnection(connection) {
        const index = this.connections.indexOf(connection);
        if (index === -1)
            return;
        this.connections.splice(index, 1);
    }
    fire(...args) {
        for (const connection of [...this.connections]) {
            connection.callback(...args);
        }
    }
}
export class ConnectionGroup {
    connections = [];
    constructor() { }
    add(connection) {
        this.connections.push(connection);
    }
    remove(connection) {
        const index = this.connections.indexOf(connection);
        if (index === -1)
            return;
        this.connections.splice(index, 1);
    }
    disconnect(connection) {
        connection.disconnect();
        this.remove(connection);
    }
    disconnectAll() {
        for (const connection of this.connections) {
            connection.disconnect();
        }
        this.connections = [];
    }
}
//# sourceMappingURL=EventSignals-v1.0.js.map