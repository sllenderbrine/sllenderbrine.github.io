import VerticalLazyScrollingFrame from "./VerticalLazyScrollingFrame";
import VerticalLazyScrollingFrameSection from "./VerticalLazyScrollingFrameSection";

export default class Dropdown {
    containerEl: HTMLDivElement;
    dropdownEl: VerticalLazyScrollingFrame;
    constructor(options: string[], value: number | string) {
        this.containerEl = document.createElement("div");
        this.containerEl.style = `width:100px;height:16px;outline:2px solid black;
        border:2px solid white;border-radius:4px;margin:2px;background-color:rgb(200,200,200);
        color:white;cursor:pointer;`;
        document.body.appendChild(this.containerEl);
        this.dropdownEl = new VerticalLazyScrollingFrame();
        for(const v of options) this.addOption(v);
        if(typeof value === "string") {
            value = options.indexOf(value);
            if(value < 0) value = 0;
        }
        this.selectedIndex = value;
    }

    selectedIndex = 0;
    _optionNames: string[] = [];
    _optionSections: VerticalLazyScrollingFrameSection[] = [];
    addOption(value: string) {
        this._optionNames.push(value);
        this._optionSections.push(this.dropdownEl.addSection(32));
    }
    removeOption(value: number | string) {
        if(typeof value === "string")
            value = this._optionNames.indexOf(value);
        if(value < 0) return;
        if(value >= this._optionNames.length) return;
        if(this.selectedIndex > value) this.selectedIndex--;
        else if(this.selectedIndex === value) this.selectedIndex = 0;
        this._optionNames.splice(value, 1);
        this._optionSections.splice(value, 1);
    }
}