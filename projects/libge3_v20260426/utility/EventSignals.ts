export class Signal<T extends any[]> {
    connections: Connection<T>[] = [];
    timeFired: number = -Number.MAX_VALUE;
    onConnect?: (conn: Connection<T>) => void;
    constructor({
        onConnect = undefined,
    }: {
        onConnect?: (conn: Connection<T>) => void,
    } = {}) {
        this.onConnect = onConnect;
    }
    connect(callback: (...args: T) => void) {
        const conn = new Connection<T>(this, callback);
        this.connections.push(conn);
        if(this.onConnect) {
            this.onConnect(conn);
        }
        return conn;
    }
    once(callback: (...args: T) => void) {
        const conn = this.connect((...args: T) => {
            callback(...args);
            conn.disconnect();
        });
        return conn;
    }
    async wait() {
        return new Promise<T>(res => {
            this.once((...args: T) => {
                res(args);
            });
        });
    }
    fire(...args: T) {
        this.timeFired = performance.now();
        for(const conn of [...this.connections]) {
            conn.fire(...args);
        }
    }
    getTimeSinceFired() {
        return performance.now() / 1000 - this.timeFired;
    }
}

export class Connection<T extends any[]> {
    groups: ConnectionGroup[] = [];
    constructor(public signal: Signal<T>, public callback: (...args: T) => void) {
        
    }
    disconnect() {
        this.signal.connections.splice(this.signal.connections.indexOf(this), 1);
        for(const group of this.groups) {
            group.connections.splice(group.connections.indexOf(this), 1);
        }
        this.groups = [];
    }
    fire(...args: T) {
        this.callback(...args);
    }
}

export class HtmlConnection {
    groups: ConnectionGroup[] = [];
    constructor(public el: EventTarget, public name: string, public callback: (e: any) => void) {
        this.el.addEventListener(this.name, this.callback);
    }
    disconnect() {
        this.el.removeEventListener(this.name, this.callback);
        for(const group of this.groups) {
            group.connections.splice(group.connections.indexOf(this), 1);
        }
        this.groups = [];
    }
}

export class ConnectionGroup {
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