import EMath from "../utility/EMath";
import { ConnectionGroup, HtmlConnection, Signal } from "../utility/EventSignals";

export default class Slider {
    containerEl: HTMLDivElement;
    handleEl: HTMLButtonElement;
    valueEl: HTMLButtonElement;
    dragConnections = new ConnectionGroup();
    inputEvent: Signal<[value: number]> = new Signal({onConnect:(conn)=>{conn.fire(this.value);}});
    constructor(
        min: number,
        max: number,
        step: number,
        value: number = (min + max) / 2,
        direction: "vertical" | "horizontal" = "horizontal",
    ) {
        this.containerEl = document.createElement("div");
        document.body.appendChild(this.containerEl);
        this.containerEl.style = `width:150px;height:14px;position:relative;
        border:2px solid white;cursor:pointer;border-radius:4px;
        outline:2px solid black;background-color:rgb(20,20,20);
        margin:2px;user-select:none;`;
        this.valueEl = document.createElement("button");
        this.valueEl.style = `border:none;padding:0px;width:100%;height:100%;
        position:absolute;left:0;bottom:0;background-color:rgb(142, 187, 255);
        cursor:pointer;border-radius:2px;user-select:none;`;
        this.containerEl.appendChild(this.valueEl);
        this.handleEl = document.createElement("button");
        this.handleEl.style = `width:20px;height:20px;position:absolute;
        left:100%;top:50%;transform:translate(-50%,-50%);
        background-color:rgb(142, 187, 255);border:2px solid white;
        cursor:pointer;border-radius:50%;outline:2px solid black;
        user-select:none;`;
        this.valueEl.appendChild(this.handleEl);
        this.containerEl.addEventListener("mousedown", e => {
            if(e.target == this.handleEl)
                return;
            const update = (e: MouseEvent) => {
                let rect = this.containerEl.getBoundingClientRect();
                let t = 0;
                if(this.direction == "horizontal")
                    t = (e.clientX - (rect.left + rect.width * this._paddingT)) / (rect.width * (1 - this._paddingT * 2));
                else
                    t = 1 - (e.clientY - (rect.top + rect.height * this._paddingT)) / (rect.height * (1 - this._paddingT * 2));
                this.value = t * (this.max - this.min) + this.min;
                this.inputEvent.fire(this.value);
            }
            update(e);
            this.dragConnections.add(new HtmlConnection(window, "mousemove", update));
            this.dragConnections.add(new HtmlConnection(window, "mouseup", e => {
                this.dragConnections.disconnectAll();
            }));
        });
        this.handleEl.addEventListener("mousedown", e => {
            let x0 = e.clientX;
            let y0 = e.clientY;
            let v0 = this.value;
            this.dragConnections.add(new HtmlConnection(window, "mousemove", e => {
                let dt = 0;
                if(this.direction == "horizontal")
                    dt = (e.clientX - x0) / (this.containerEl.offsetWidth * (1 - this._paddingT * 2));
                else
                    dt = (y0 - e.clientY) / (this.containerEl.offsetHeight * (1 - this._paddingT * 2));
                this.value = v0 + dt * (this.max - this.min) + this.min;
                this.inputEvent.fire(this.value);
            }));
            this.dragConnections.add(new HtmlConnection(window, "mouseup", e => {
                this.dragConnections.disconnectAll();
            }));
        });
        this.min = min;
        this.max = max;
        this.step = step;
        this.value = value;
        this.direction = direction;
    }

    _value = 0;
    _valueT = 0;
    _valueTL = 0;
    get value() { return this._value; }
    set value(value: number) {
        if(this._value === value)
            return;
        this._value = value;
        this.updateValueClamp();
        this.updateValueStyle();
    }
    updateValueClamp() {
        this._value = Math.floor(this._value/this._step)*this._step;
        this._value = EMath.clamp(this._value, this._min, this._max);
    }
    updateValueStyle() {
        let t = (this._value - this._min) / (this._max - this._min);
        t = EMath.clamp(t, 0, 1);
        this._valueT = t;
        this.updateValueAnimation();
    }
    updateValueElWidth() {
        const str = `${(this._valueTL + this._paddingT) * (100 - 200 * this._paddingT)}%`;
        if(this.direction == "horizontal")
            this.valueEl.style.width = str;
        else
            this.valueEl.style.height = str;
    }

    _isAnimating = false;
    animationSpeedLinear = 1;
    animationSpeedExp = 10;
    updateValueAnimation() {
        if(this._isAnimating)
            return;
        let frameTime = performance.now();
        let update = () => {
            let now = performance.now();
            let deltaTime = (now - frameTime) / 1000;
            frameTime = now;
            this._valueTL += Math.sign(this._valueT - this._valueTL) * deltaTime * this.animationSpeedLinear;
            this._valueTL = EMath.lerp(this._valueTL, this._valueT, deltaTime * this.animationSpeedExp);
            let dist = Math.abs(this._valueT - this._valueTL);
            if(dist < 0.01 * (this.animationSpeedLinear * 1 + this.animationSpeedExp * 0.1) || dist > 10 || isNaN(this._valueTL)) {
                this._valueTL = this._valueT;
                this.updateValueElWidth();
                this._isAnimating = false;
                return;
            }
            this.updateValueElWidth();
            requestAnimationFrame(update);
        }
        this._isAnimating = true;
        update();
    }

    _direction: "horizontal" | "vertical" = "horizontal";
    get direction() { return this._direction; }
    set direction(value: "horizontal" | "vertical") {
        this._direction = value;
        if(value == "vertical") {
            this.containerEl.style.width = "14px";
            this.containerEl.style.height = "150px";
            this.handleEl.style.left = "50%";
            this.handleEl.style.top = "0";
        } else {
            this.containerEl.style.height = "14px";
            this.containerEl.style.width = "150px";
            this.handleEl.style.top = "50%";
            this.handleEl.style.left = "100%";
        }
        this.valueEl.style.width = "100%";
        this.valueEl.style.height = "100%";
        this.updateValueClamp();
        this.updateValueStyle();
    }

    _paddingT = 0;
    get valuePadding() { return this._paddingT; }
    set valuePadding(value: number) {
        if(this._paddingT === value)
            return;
        this._paddingT = value;
        this.updateValueClamp();
        this.updateValueStyle();
    }

    _min = 0;
    get min() { return this._min; }
    set min(value: number) {
        if(this._min === value)
            return;
        this._min = value;
        this.updateValueClamp();
        this.updateValueStyle();
    }

    _max = 0;
    get max() { return this._max; }
    set max(value: number) {
        if(this._max === value)
            return;
        this._max = value;
        this.updateValueClamp();
        this.updateValueStyle();
    }

    _step = 0;
    get step() { return this._step; }
    set step(value: number) {
        if(this._step === value)
            return;
        this._step = value;
        this.updateValueClamp();
        this.updateValueStyle();
    }
}