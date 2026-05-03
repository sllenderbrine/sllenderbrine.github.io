import { Slider } from "./Slider.js";

export class VerticalScrollBox {
    containerEl: HTMLDivElement;
    contentEl: HTMLDivElement;
    slider: Slider
    constructor() {
        this.containerEl = document.createElement("div");
        this.contentEl = document.createElement("div");
        this.slider = new Slider(0, 100, 0);
        this.slider.setOrientation("vertical");
        this.slider.containerEl.style.position = "absolute";
        this.slider.containerEl.style.right = "0";
        this.slider.containerEl.style.top = "0";
        this.slider.containerEl.style.margin = "0";
        this.slider.containerEl.style.outline = "none";
        this.slider.handleEl.style.outline = "none";
    }
    _viewHeight = 0;
    setViewHeight(v: number) {
        this._viewHeight = v;
        this.containerEl.style.height = `${v}px`;
        this.slider.setSize(v);
        this.slider.setHandleSize(v/2);
    }
    _scrollHeight = 0;
    setScrollHeight(v: number) {
        this._scrollHeight = v;
    }
    _viewWidth = 0;
    setViewWidth(v: number) {
        this._viewWidth = v;
        this.containerEl.style.width = `${this._viewWidth + this._scrollBarWidth}px`;
    }
    _scrollBarWidth = 20;
    setScrollBarWidth(v: number) {
        this._scrollBarWidth = v;
        this.containerEl.style.width = `${this._viewWidth + this._scrollBarWidth}px`;
        this.slider.setThickness(v);
    }
}