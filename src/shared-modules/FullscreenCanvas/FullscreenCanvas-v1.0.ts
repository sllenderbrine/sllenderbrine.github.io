import * as EventSignals from "../EventSignals/EventSignals-v1.0.js";

export default class FullscreenCanvas {
    canvas: HTMLCanvasElement;
    resized: EventSignals.Signal;
    private static fullscreenCanvasByHTMLCanvas: Map<HTMLCanvasElement, FullscreenCanvas> = new Map();
    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvas.style.position = "absolute";
        this.canvas.style.top = "0";
        this.canvas.style.left = "0";
        document.body.appendChild(this.canvas);
        FullscreenCanvas.fullscreenCanvasByHTMLCanvas.set(this.canvas, this);
        this.resized = new EventSignals.Signal();
        const resize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.resized.fire(this.canvas.width, this.canvas.height);
        }
        window.addEventListener("resize", resize);
        resize();
    }
    getHTMLCanvasElement(): HTMLCanvasElement {
        return this.canvas;
    }
    static getFullscreenCanvas(canvas: HTMLCanvasElement): FullscreenCanvas | undefined {
        return FullscreenCanvas.fullscreenCanvasByHTMLCanvas.get(canvas);
    }
}