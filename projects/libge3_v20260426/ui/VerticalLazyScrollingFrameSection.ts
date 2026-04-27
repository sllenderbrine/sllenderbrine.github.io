import { Signal } from "../utility/EventSignals";

export default class VerticalLazyScrollingFrameSection {
    top: number = 0;
    containerEl?: HTMLDivElement;
    visibleEvent: Signal<[containerEl: HTMLDivElement]> = new Signal();
    constructor(public size: number) { }
};