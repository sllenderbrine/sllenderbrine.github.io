import { Signal } from "../eventsignals_v20260427/index.js";

export class RenderLoop {
    renderSteppedEvent: Signal<[dt: number]> = new Signal();
    runIndex = 0;
    isRunning = false;
    constructor(public callback: (dt: number) => void) {
        
    }
    stop() {
        if(!this.isRunning)
            return this;
        this.isRunning = false;
        this.runIndex++;
        return this;
    }
    start() {
        if(this.isRunning)
            return this;
        this.isRunning = true;
        let ri = this.runIndex;
        let frameTime = performance.now()/1000;
        const render = () => {
            if(this.runIndex != ri) {
                return;
            }
            let now = performance.now()/1000;
            let dt = now - frameTime;
            frameTime = now;
            this.renderSteppedEvent.fire(dt);
            this.callback(dt);
            requestAnimationFrame(render);
        }
        render();
        return this;
    }
}