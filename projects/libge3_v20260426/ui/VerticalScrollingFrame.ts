import Slider from "./Slider";

export class VerticalScrollingFrame {
    containerEl: HTMLDivElement;
    scrollbarEl: Slider;
    constructor() {

    }

    _scrollHeight = 0;
    get scrollHeight() { return this._scrollHeight; }
    set scrollHeight(value: number) {
        
    }

    _viewHeight = 0;
    get viewHeight() { return this._viewHeight; }
    set viewHeight(value: number) {
        
    }
}