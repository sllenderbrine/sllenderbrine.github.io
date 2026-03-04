export class Connection {
    signal: Signal;
    callback: (...args: any[]) => void;
    constructor(signal: Signal, callback: (...args: any[]) => void) {
        this.signal = signal;
        this.callback = callback;
    }
    disconnect() {
        this.signal.removeConnection(this);
    }
}

export class Signal {
    private connections: Connection[] = []; 
    constructor() {}
    connect(callback: (...args: any[]) => void, options: {init?:boolean, initArgs?:any[]} = {}): Connection {
        const connection = new Connection(this, callback);
        this.connections.push(connection);
        if(options.init) {
            callback(...(options.initArgs ?? []));
        }
        return connection;
    }
    once(callback: (...args: any[]) => void): Connection {
        const connection = this.connect((...args: any[]) => {
            callback(...args);
            connection.disconnect();
        });
        return connection;
    }
    connectAndRun(callback: (...args: any[]) => void): Connection {
        const connection = this.connect(callback);
        callback();
        return connection;
    }
    removeConnection(connection: Connection) {
        const index = this.connections.indexOf(connection);
        if(index===-1) return;
        this.connections.splice(index, 1);
    }
    fire(...args: any[]) {
        for(const connection of [...this.connections]) {
            connection.callback(...args);
        }
    }
}

export class ConnectionGroup {
    private connections: Connection[] = [];
    constructor() {}
    add(connection: Connection) {
        this.connections.push(connection);
    }
    remove(connection: Connection) {
        const index = this.connections.indexOf(connection);
        if(index===-1) return;
        this.connections.splice(index, 1);
    }
    disconnect(connection: Connection) {
        connection.disconnect();
        this.remove(connection);
    }
    disconnectAll() {
        for(const connection of this.connections) {
            connection.disconnect();
        }
        this.connections = [];
    }
}