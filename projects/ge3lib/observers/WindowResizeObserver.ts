import { ConnectionGroup, HtmlConnection, Signal } from "../utility/EventSignals";

export default class WindowResizeObserver {
    resizeEvent: Signal<[w: number, h: number]> = new Signal({
        onConnect: conn => conn.fire(window.innerWidth, window.innerHeight),
    });
    connections = new ConnectionGroup();
    constructor() {
        this.connections.add(new HtmlConnection(window, "resize", () => {
            this.resizeEvent.fire(window.innerWidth, window.innerHeight);
        }));
    }
    remove() {
        this.connections.disconnectAll();
    }
}