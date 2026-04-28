import ConnectionGroup from "../eventsignals_v20260427/ConnectionGroup.js";
import HtmlConnection from "../eventsignals_v20260427/HtmlConnection.js";
import Signal from "../eventsignals_v20260427/Signal.js";

export default class Slider {
    containerEl: HTMLDivElement;
    valueEl: HTMLDivElement;
    handleEl: HTMLButtonElement;
    dragConnections = new ConnectionGroup();
    inputEvent: Signal<[value: number]> = new Signal();
    constructor(min=0, max=100, val=50, step?: number) {
        this._min = min;
        this._max = max;
        this._step = step;
        this.containerEl = document.createElement("div")
        document.body.appendChild(this.containerEl);
        this.containerEl.style = `background-color:rgb(50,50,50);
        user-select:none;border:2px solid white;outline:2px solid black;
        margin:2px;position:relative;cursor:pointer;`;
        this.valueEl = document.createElement("div");
        this.containerEl.appendChild(this.valueEl);
        this.valueEl.style = `background-color:rgb(140,200,250);width:50%;
        height:100%;position:absolute;left:0;bottom:0;user-select:none;
        position:absolute;cursor:pointer;`;
        this.handleEl = document.createElement("button");
        this.valueEl.appendChild(this.handleEl);
        this.handleEl.style = `background-color:rgb(192, 201, 207);
        user-selection:none;border:2px solid white;outline:2px solid black;
        margin:2px;position:absolute;padding:0;margin:0;cursor:pointer;`;
        this.containerEl.addEventListener("mousedown", e => {
            if(e.target == this.handleEl) {
                let x0 = e.clientX;
                let y0 = e.clientY;
                let v0 = this._value;
                const update = (e: MouseEvent) => {
                    const rect = this.containerEl.getBoundingClientRect();
                    let dt = 0;
                    if(this._orientation == "horizontal")
                        dt = (e.clientX - x0) / (rect.width - this._handleSize);
                    else
                        dt = -(e.clientY - y0) / (rect.height - this._handleSize);
                    this.setValue(v0 + dt * (this._max - this._min));
                    this.inputEvent.fire(this._value);
                }
                this.dragConnections.add(new HtmlConnection(window, "mousemove", e => {
                    update(e);
                }));
                this.dragConnections.add(new HtmlConnection(window, "mouseup", e => {
                    this.dragConnections.disconnectAll();
                }));
            } else {
                const update = (e: MouseEvent) => {
                    const rect = this.containerEl.getBoundingClientRect();
                    let t = 0;
                    if(this._orientation == "horizontal")
                        t = (e.clientX - rect.left - this._handleSize / 2) / (rect.width - this._handleSize);
                    else
                        t = (rect.bottom - e.clientY - this._handleSize / 2) / (rect.height - this._handleSize);
                    this.setValue(this._min + t * (this._max - this._min));
                    this.inputEvent.fire(this._value);
                }
                update(e);
                this.dragConnections.add(new HtmlConnection(window, "mousemove", e => {
                    update(e);
                }));
                this.dragConnections.add(new HtmlConnection(window, "mouseup", e => {
                    this.dragConnections.disconnectAll();
                }));
            }
        });
        this._handleSize = 20;
        this._thickness = 20;
        this._size = 100;
        this.setOrientation("horizontal");
        this.setValue(val);
    }

    _handleSize = 0;
    setHandleSize(v: number) {
        this._handleSize = v;
        this.updateHandleSizeStyle();
    }
    _thickness = 0;
    setThickness(v: number) {
        this._thickness = v;
        this.updateBoundsStyle();
    }
    _size = 0;
    setSize(v: number) {
        this._size = v;
        this.updateBoundsStyle();
    }
    _orientation: "horizontal" | "vertical" = "horizontal";
    setOrientation(v: "horizontal" | "vertical") {
        this._orientation = v;
        this.updateBoundsStyle();
        this.updateHandleSizeStyle();
        this.updateHandlePositionStyle();
        this.updateValueStyle();
    }
    _min = 0;
    _max = 0;
    _step?: number;
    _value = 0;
    setValue(v: number) {
        if(this._step)
            v = Math.round(v / this._step) * this._step;
        v = Math.min(Math.max(v, this._min), this._max);
        this._value = v;
        this.updateValueStyle();
    }

    updateValueStyle() {
        let t = (this._value - this._min) / (this._max - this._min);
        if(!isFinite(t))
            t = 0;
        let padt = this._handleSize / this._size;
        if(this._orientation == "horizontal") {
            this.valueEl.style.width = `${padt * 50 + t * (100 - 100 * padt)}%`;
            this.valueEl.style.height = "100%";
        } else {
            this.valueEl.style.height = `${padt * 50 + t * (100 - 100 * padt)}%`;
            this.valueEl.style.width = "100%";
        }
    }
    updateHandlePositionStyle() {
        if(this._orientation == "horizontal") {
            this.handleEl.style.left = "100%";
            this.handleEl.style.top = "50%";
            this.handleEl.style.bottom = "auto";
            this.handleEl.style.transform = "translate(-50%, -50%)";
        } else {
            this.handleEl.style.left = "50%";
            this.handleEl.style.top = "0";
            this.handleEl.style.top = "auto";
            this.handleEl.style.transform = "translate(-50%, -50%)";
        }
    }
    updateHandleSizeStyle() {
        if(this._orientation == "horizontal") {
            this.handleEl.style.width = `${this._handleSize + 4}px`;
            this.handleEl.style.height = `calc(100% + 4px)`;
        } else {
            this.handleEl.style.height = `${this._handleSize + 4}px`;
            this.handleEl.style.width = `calc(100% + 4px)`;
        }
    }
    updateBoundsStyle() {
        if(this._orientation == "horizontal") {
            this.containerEl.style.height = `${this._thickness}px`;
            this.containerEl.style.width = `${this._size}px`;
        } else {
            this.containerEl.style.width = `${this._thickness}px`;
            this.containerEl.style.height = `${this._size}px`;
        }
    }
}