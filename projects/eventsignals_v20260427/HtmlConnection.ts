import type ConnectionGroup from "./ConnectionGroup.js";

export default class HtmlConnection {
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