import { ConnectionGroup, HtmlConnection, Signal } from "../utility/EventSignals";

export default class PointerLock {
    connections = new ConnectionGroup();
    pointerLockChangeEvent: Signal<[isLocked: boolean]> = new Signal();
    lockedMouseMoveEvent: Signal<[dx: number, dy: number]> = new Signal();
    isEnabled = false;
    constructor() {
        this.connections.add(new HtmlConnection(window, "mousedown", (e: MouseEvent) => {
            if(this.isEnabled && document.pointerLockElement == null) {
                document.body.requestPointerLock();
            }
        }));
        this.connections.add(new HtmlConnection(window, "mousemove", (e: MouseEvent) => {
            if(document.pointerLockElement != null)
                this.lockedMouseMoveEvent.fire(e.movementX, e.movementY);
        }));
        this.connections.add(new HtmlConnection(document, "pointerlockchange", () => {
            this.pointerLockChangeEvent.fire(document.pointerLockElement != null);
        }));
    }
    lock(): this {
        this.isEnabled = true;
        document.body.requestPointerLock();
        return this;
    }
    unlock(): this {
        this.isEnabled = false;
        document.exitPointerLock();
        return this;
    }
    remove() {
        this.connections.disconnectAll();
    }
}