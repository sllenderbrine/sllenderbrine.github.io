import EMath from "../utility/EMath";

export default class Color {
    constructor();
    constructor(r: number, g: number, b: number);
    constructor(r: number, g: number, b: number, a: number);
    constructor(color: string | Color);
    constructor(argA?: number | string | Color, argB?: number, argC?: number, argD?: number) {
        if(typeof argA === "string") {
            let comp = argA.split("(");
            if(comp.length == 0)
                throw new Error("Invalid color constructor: Empty string");
            if(comp.length < 2)
                throw new Error("Invalid color constructor: " + comp[0]);
            let cstruct = comp[0];
            let cparam = comp[1]!.replace(")", "");
            if(cstruct === "rgb" || cstruct === "rgba") {
                let cargs = cparam.split(",");
                if(cargs.length < 3 || cargs.length > 4)
                    throw new Error("Invalid color argument count: " + cargs.length);
                let r = parseInt(cargs[0]!);
                let g = parseInt(cargs[1]!);
                let b = parseInt(cargs[2]!);
                let a = cargs[3] ? parseFloat(cargs[3]!) : 1;
                if(isNaN(r)) throw new Error("Invalid color value: " + cargs[0]);
                if(isNaN(g)) throw new Error("Invalid color value: " + cargs[1]);
                if(isNaN(b)) throw new Error("Invalid color value: " + cargs[2]);
                if(isNaN(a)) throw new Error("Invalid color value: " + cargs[3]);
                r = EMath.clamp(Math.round(r), 0, 255);
                g = EMath.clamp(Math.round(g), 0, 255);
                b = EMath.clamp(Math.round(b), 0, 255);
                a = EMath.clamp(a, 0, 1);
                this._r = r;
                this._g = g;
                this._b = b;
                this.a = a;
                this._outdatedRgb = false;
                this._outdatedHsv = true;
            } else if(cstruct === "hsv" || cstruct === "hsva") {
                let cargs = cparam.split(",");
                if(cargs.length < 3 || cargs.length > 4)
                    throw new Error("Invalid color argument count: " + cargs.length);
                let h: number;
                if(cargs[0]!.includes("rad")) {
                    h = parseFloat(cargs[0]!) * 180 / Math.PI;
                } else {
                    h = parseInt(cargs[0]!);
                }
                let s = parseInt(cargs[1]!);
                let v = parseInt(cargs[2]!);
                let a = cargs[3] ? parseInt(cargs[3]!) : 1;
                if(isNaN(h)) throw new Error("Invalid color value: " + cargs[0]);
                if(isNaN(s)) throw new Error("Invalid color value: " + cargs[1]);
                if(isNaN(v)) throw new Error("Invalid color value: " + cargs[2]);
                if(isNaN(a)) throw new Error("Invalid color value: " + cargs[3]);
                h = EMath.pmod(h, 360);
                s = EMath.clamp(s, 0, 100);
                v = EMath.clamp(v, 0, 100);
                a = EMath.clamp(a, 0, 1);
                this._hue = h;
                this._sat = s;
                this._val = v;
                this.a = a;
                this._outdatedHsv = false;
                this._outdatedRgb = true;
            } else {
                throw new Error("Invalid color constructor: " + cstruct);
            }
        } else if(typeof argA === "number") {
            if (argB === undefined || argC === undefined) {
                throw new Error("Invalid color constructor: Not enough arguments");
            }
            this._r = EMath.clamp(Math.round(argA), 0, 255);
            this._g = EMath.clamp(Math.round(argB!), 0, 255);
            this._b = EMath.clamp(Math.round(argC!), 0, 255);
            this.a = EMath.clamp(argD ?? 1, 0, 1);
            this._outdatedRgb = false;
            this._outdatedHsv = true;
        } else if(argA === undefined) {
            this._r = 0;
            this._g = 0;
            this._b = 0;
            this.a = 1;
            this._outdatedRgb = false;
            this._outdatedHsv = true;
        } else {
            this._r = argA!.r;
            this._g = argA!.g;
            this._b = argA!.b;
            this.a = argA!.a;
            this._outdatedRgb = false;
            this._outdatedHsv = true;
        }
    }

    onMutate?: () => void;
    mutate() {
        if(this.onMutate)
            this.onMutate();
    }

    clone(): Color {
        return new Color(this);
    }

    static decimalToRGB(d: number) {
        d = EMath.clamp(d, 0, 1-1e-6);
        let index = Math.floor(d * 16777216);
        let r = (index >> 16) & 0xFF;
        let g = (index >> 8) & 0xFF;
        let b = (index) & 0xFF;
        return new Color(r, g, b);
    }

    _outdatedRgb?: boolean;
    _r = 0;
    /**
     * (int) red value of the color, 0 - 255.
    */
    set r(value: number) {
        value = EMath.clamp(Math.round(value), 0, 255);
        if(value == this._r)
            return;
        this.updateRgb();
        this._r = value;
        this._outdatedHsv = true;
        this.mutate();
    }
    get r() {
        this.updateRgb();
        return this._r;
    }

    _g = 0;
    /**
     * (int) green value of the color, 0 - 255.
    */
    set g(value: number) {
        value = EMath.clamp(Math.round(value), 0, 255);
        if(value == this._g)
            return;
        this.updateRgb();
        this._g = value;
        this._outdatedHsv = true;
        this.mutate();
    }
    get g() {
        this.updateRgb();
        return this._g;
    }
    
    _b = 0;
    /**
     * (int) blue value of the color, 0 - 255.
    */
    set b(value: number) {
        value = EMath.clamp(Math.round(value), 0, 255);
        if(value == this._b)
            return;
        this.updateRgb();
        this._b = value;
        this._outdatedHsv = true;
        this.mutate();
    }
    get b() {
        this.updateRgb();
        return this._b;
    }

    updateRgb() {
        if(this._outdatedRgb != true)
            return;
        const {_hue:h, _sat:s, _val:v} = this;
        const c = v / 100 * s / 100;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = v / 100 - c;
        let rp=0, gp=0, bp=0;
        switch(Math.floor(h / 60)) {
            case 0: rp=c; gp=x; break;
            case 1: rp=x; gp=c; break;
            case 2: gp=c; bp=x; break;
            case 3: gp=x; bp=c; break;
            case 4: rp=x; bp=c; break;
            default: rp=c; bp=x; break;
        }
        this._r = Math.round((rp + m) * 255);
        this._g = Math.round((gp + m) * 255);
        this._b = Math.round((bp + m) * 255);
        this._outdatedRgb = false;
    }

    _outdatedHsv?: boolean;
    _hue = 0;
    /**
     * (decimal) hue of the color in degrees, 0 - 360.
    */
    set hue(value: number) {
        value = EMath.pmod(value, 360);
        if(value == this._hue)
            return;
        this.updateHsv();
        this._hue = value;
        this._outdatedRgb = true;
        this.mutate();
    }
    get hue() {
        this.updateHsv();
        return this._hue;
    }

    _sat = 0;
    /**
     * (decimal) saturation of the color, 0 - 100.
    */
    set sat(value: number) {
        value = EMath.clamp(value, 0, 100);
        if(value == this._sat)
            return;
        this.updateHsv();
        this._sat = value;
        this._outdatedRgb = true;
        this.mutate();
    }
    get sat() {
        this.updateHsv();
        return this._sat;
    }

    _val = 0;
    /**
     * (decimal) value/brightness of the color, 0 - 100.
    */
    set val(value: number) {
        value = EMath.clamp(value, 0, 100);
        if(value == this._val)
            return;
        this.updateHsv();
        this._val = value;
        this._outdatedRgb = true;
        this.mutate();
    }
    get val() {
        this.updateHsv();
        return this._val;
    }

    updateHsv() {
        if(this._outdatedHsv != true)
            return;
        const max = Math.max(this.r, this.g, this.b);
        const min = Math.min(this.r, this.g, this.b);
        const delta = max - min;
        let h = 0;
        if(delta !== 0) {
            if(max === this.r) h = 60 * (((this.g - this.b) / delta + 6) % 6);
            else if(max === this.g) h = 60 * ((this.b - this.r) / delta + 2);
            else h = 60 * ((this.r - this.g) / delta + 4);
        }
        if(h < 0) h += 360;
        const s = max === 0 ? 0 : delta/max*100;
        const v = max/255*100;
        this._hue = h;
        this._sat = s;
        this._val = v;
        this._outdatedHsv = false;
    }

    /**
     * (decimal) alpha/opacity of the color, 0 - 1.
    */
    a = 1;

    strictEquals(other: Color) {
        this.updateRgb();
        other.updateRgb();
        return (
            this._r == other._r
            && this._g == other._g
            && this._b == other._b
            && this.a == other.a
        );
    }
    isClose(other: Color, e = 1e-6) {
        this.updateRgb();
        other.updateRgb();
        return (
            EMath.isClose(this._r, other._r, e)
            && EMath.isClose(this._g, other._g, e)
            && EMath.isClose(this._b, other._b, e)
            && EMath.isClose(this.a, other.a, e)
        );
    }
    strictEqualsRgb(other: Color) {
        this.updateRgb();
        other.updateRgb();
        return (
            this._r == other._r
            && this._g == other._g
            && this._b == other._b
        );
    }
    isCloseRgb(other: Color, e = 1e-6) {
        this.updateRgb();
        other.updateRgb();
        return (
            EMath.isClose(this._r, other._r, e)
            && EMath.isClose(this._g, other._g, e)
            && EMath.isClose(this._b, other._b, e)
        );
    }
    lerpRgba(other: Color, t: number): Color {
        return this.clone().lerpRgbaSelf(other, t);
    }
    lerpRgbaSelf(other: Color, t: number): this {
        this.updateRgb();
        other.updateRgb();
        this._r = EMath.lerp(this._r, other._r, t);
        this._g = EMath.lerp(this._g, other._g, t);
        this._b = EMath.lerp(this._b, other._b, t);
        this.a = EMath.lerp(this.a, other.a, t);
        this.mutate();
        return this;
    }
    lerpHsva(other: Color, t: number): Color {
        return this.clone().lerpHsvaSelf(other, t);
    }
    lerpHsvaSelf(other: Color, t: number): this {
        this.updateHsv();
        other.updateHsv();
        this._hue = EMath.lerp(this._hue, other._hue, t);
        this._sat = EMath.lerp(this._sat, other._sat, t);
        this._val = EMath.lerp(this._val, other._val, t);
        this.a = EMath.lerp(this.a, other.a, t);
        this.mutate();
        return this;
    }
    getIsForegroundWhite(threshold = 0.42) {
        this.updateRgb();
        let {_r:r, _g:g, _b:b} = this;
        r /= 255;
        g /= 255;
        b /= 255;
        r = (r < 0.03928) ? (r / 12.92) : (((r + 0.055) / 1.055) ** 2.4)
        g = (g < 0.03928) ? (g / 12.92) : (((g + 0.055) / 1.055) ** 2.4)
        b = (b < 0.03928) ? (b / 12.92) : (((b + 0.055) / 1.055) ** 2.4)
        let l = 0.2126 * r + 0.7152 * g + 0.0722 * b
        return l < threshold;
    }
    toString(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
    toRgbaArray(): [r: number, g: number, b: number, a: number] {
        return [this.r, this.g, this.b, this.a];
    }
    toHsvaArray(): [h: number, s: number, v: number, a: number] {
        return [this.hue, this.sat, this.val, this.a];
    }
}
