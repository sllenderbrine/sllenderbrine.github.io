import { Signal } from "../eventsignals_v20260427/Signal.js";

export class Checkbox {
    containerEl: HTMLDivElement;
    svgEl: SVGElement;
    inputEvent: Signal<[value: boolean]> = new Signal({onConnect:(conn)=>{conn.fire(this._isChecked);}});
    constructor(value = false) {
        this.containerEl = document.createElement("div");
        this.containerEl.style = `width:20px;height:20px;background-color:white;outline:2px solid black;
        border:2px solid white;cursor:pointer;color:white;display:flex;user-select:none;
        justify-content:center;align-items:center;margin:2px;`;
        document.body.appendChild(this.containerEl);
        this.containerEl.addEventListener("mousedown", e => {
            this.click();
        });
        this.containerEl.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -4 7 7" style="width:60%;height:60%;pointer-events:none;">
                <path d="M 0 0 L 1 -1 L 2 1 L 6 -4 L 7 -3 L 2 3 Z" fill="currentColor"/>
            </svg>
        `;
        this.svgEl = this.containerEl.querySelector("svg")!;
        this.setChecked(value);
    }

    click() {
        this.setChecked(!this._isChecked);
        this.inputEvent.fire(this._isChecked);
    }

    _isChecked = false;
    getChecked() {
        return this._isChecked;
    }
    setChecked(v: boolean) {
        this._isChecked = v;
        this.updateCheckedStyle();
    }
    updateCheckedStyle() {
        if(this._isChecked) {
            this.svgEl.style.display = "block";
            this.svgEl.animate([
                {scale:"0"},
                {scale:"1"},
            ], {duration:100});
            this.containerEl.animate([
                {backgroundColor:"rgb(192, 201, 207)"},
                {backgroundColor:"rgb(140, 200, 250)"},
            ], {duration:100});
            this.containerEl.style.backgroundColor = "rgb(140, 200, 250)";
        } else {
            this.svgEl.style.display = "none";
            this.containerEl.animate([
                {backgroundColor:"rgb(140, 200, 250)"},
                {backgroundColor:"rgb(192, 201, 207)"},
            ], {duration:100});
            this.containerEl.style.backgroundColor = "rgb(192, 201, 207)";
        }
    }
}