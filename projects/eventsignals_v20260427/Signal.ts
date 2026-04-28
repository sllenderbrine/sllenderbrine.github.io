import Connection from "./Connection.js";

export default class Signal<T extends any[]> {
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