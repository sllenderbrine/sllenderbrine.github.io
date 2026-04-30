import { Signal } from "../eventsignals_v20260427/index.js";

export class FpsCounter {
    avgFpsT = 0;
    avgFps = 0;
    avgFpsI = 0;
    fps = 0;
    fpsObserver: Signal<[fps: number]> = new Signal();
    constructor() {
        
    }
    update(dt: number) {
        this.avgFpsT += dt;
        this.avgFps += 1/dt;
        this.avgFpsI++;
        if(this.avgFpsT > 0.1) {
            this.fps = Math.floor(this.avgFps / this.avgFpsI);
            this.fpsObserver.fire(this.fps);
            this.avgFps = 0;
            this.avgFpsT = 0;
            this.avgFpsI = 0;
        }
    }
}