import type { ConnectionGroup } from "./ConnectionGroup.js";
import type { Signal } from "./Signal.js";

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