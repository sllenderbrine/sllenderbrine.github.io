import { Signal } from "../eventsignals_v20260427/Signal.js";

export abstract class Keypresses {
    static keyPressed: {[key:string]: any} = {};
    static pressedKeys: Set<string> = new Set();
    static keyDownEvent = new Signal<[keyName:string]>();
    static keyUpEvent = new Signal<[keyName:string]>();
}

export function keydown(key: string) {
    Keypresses.keyPressed[key] = true;
    Keypresses.pressedKeys.add(key);
    Keypresses.keyDownEvent.fire(key);
}

export function keyup(key: string) {
    delete Keypresses.keyPressed[key];
    Keypresses.pressedKeys.delete(key);
    Keypresses.keyUpEvent.fire(key);
}

window.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();
    keydown(key);
});

window.addEventListener("keyup", e => {
    const key = e.key.toLowerCase();
    keyup(key);
});

window.addEventListener("mousedown", e => {
    if(e.button === 0) {
        keydown("lmb");
    } else if(e.button === 1) {
        keydown("mmb");
    } else if(e.button === 2) {
        keydown("rmb");
    }
});

window.addEventListener("mouseup", e => {
    if(e.button === 0) {
        keyup("lmb");
    } else if(e.button === 1) {
        keyup("mmb");
    } else if(e.button === 2) {
        keyup("rmb");
    }
});