function pmod(v: number, n: number) {
    return ((v % n) + n) % n;
}
function clamp(v: number, min: number, max: number) {
    return Math.min(Math.max(v, min), max);
}

export class Color {
    constructor(r: number, g: number, b: number, a = 1) {
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
        this.rgbValid = true;
    }

    rgbValid = false;
    _r: number = 0;
    get r() { return this._r; }
    set r(v: number) {
        if(!this.rgbValid) this.calculateRgb();
        this._r = clamp(Math.floor(v), 0, 255);
    }
    _g: number = 0;
    get g() { return this._g; }
    set g(v: number) {
        if(!this.rgbValid) this.calculateRgb();
        this._g = clamp(Math.floor(v), 0, 255);
    }
    _b: number = 0;
    get b() { return this._b; }
    set b(v: number) {
        if(!this.rgbValid) this.calculateRgb();
        this._b = clamp(Math.floor(v), 0, 255);
    }

    calculateRgb() {
        if(this.rgbValid)
            return;
        this.rgbValid = true;
        if(!this.hsvValid)
            return;
        const h = this._h, s = this._s, v = this._v;
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
    }

    hsvValid = false;
    _h: number = 0;
    get h() { return this._h; }
    set h(v: number) {
        if(!this.hsvValid) this.calculateHsv();
        this._h = pmod(Math.floor(v), 360);
    }
    _s: number = 0;
    get s() { return this._s; }
    set s(v: number) {
        if(!this.hsvValid) this.calculateHsv();
        this._s = clamp(Math.floor(v), 0, 100);
    }
    _v: number = 0;
    get v() { return this._v; }
    set v(v: number) {
        if(!this.hsvValid) this.calculateHsv();
        this._v = clamp(Math.floor(v), 0, 100);
    }

    _a: number = 0;
    get a() { return this._a; }
    set a(v: number) {
        this._a = clamp(v, 0, 1);
    }

    calculateHsv() {
        if(this.hsvValid)
            return;
        this.hsvValid = true;
        if(!this.rgbValid)
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
        this._h = h;
        this._s = s;
        this._v = v;
    }

    // Static Constructors
    static zero() { return new Color(0, 0, 0, 0); }
    static white() { return new Color(255, 255, 255); }
    static black() { return new Color(0, 0, 0); }
    static fromHsv(h: number, s: number, v: number, a?: number) {
        const out = new Color(0, 0, 0, a);
        out.rgbValid = false;
        out.hsvValid = true;
        out.h = h;
        out.s = s;
        out.v = v;
        return out;
    }
    static fromRgbArray(arr: [r:number, g:number, b:number, a?:number]) {
        return new Color(arr[0], arr[1], arr[2], arr[3]);
    }
    static fromHsvArray(arr: [h:number, s:number, v:number, a?:number]) {
        return this.fromHsv(arr[0], arr[1], arr[2], arr[3]);
    }
    static fromRgbObject(obj: {r:number, g:number, b:number, a?:number}) {
        return new Color(obj.r, obj.g, obj.b, obj.a);
    }
    static fromHsvObject(obj: {h:number, s:number, v:number, a?:number}) {
        return this.fromHsv(obj.h, obj.s, obj.v, obj.a);
    }
    static fromDecimal(d: number) {
        d = Math.min(Math.max(d, 0), 1-1e-6);
        let index = Math.floor(d * 16777216);
        let r = (index >> 16) & 0xFF;
        let g = (index >> 8) & 0xFF;
        let b = (index) & 0xFF;
        return new Color(r, g, b);
    }

    // Conversions
    toRgbArray(): [number, number, number, number] {
        return [this.r, this.g, this.b, this.a];
    }
    toHsvArray(): [number, number, number, number] {
        return [this.h, this.s, this.v, this.a];
    }
    toRgbObject(): {r: number, g: number, b: number, a: number} {
        return {r:this.r, g:this.g, b:this.b, a:this.a};
    }
    toHsvObject(): {h: number, s: number, v: number, a: number} {
        return {h:this.h, s:this.s, v:this.v, a:this.a};
    }
    toString(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    // Calculations
    strictEqualsRgb(other: Color) {
        this.calculateRgb();
        other.calculateRgb();
        return (
            this._r == other._r
            && this._g == other._g
            && this._b == other._b
            && this.a == other.a
        );
    }
    isCloseRgb(other: Color, e = 1e-6) {
        this.calculateRgb();
        other.calculateRgb();
        return (
            Math.abs(this._r - other._r) < e
            && Math.abs(this._g - other._g) < e
            && Math.abs(this._b - other._b) < e
            && Math.abs(this.a - other.a) < e
        );
    }
    getIsForegroundWhite(threshold = 0.42) {
        this.calculateRgb();
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

    // No-Allocation Operations
    lerpRgbaPut(other: Color, t: number, out: Color): Color {
        this.calculateRgb();
        other.calculateRgb();
        out.rgbValid = true;
        out.hsvValid = false;
        out.r = this._r + (other._r - this._r) * t;
        out.g = this._g + (other._g - this._g) * t;
        out.b = this._b + (other._b - this._b) * t;
        out.a = this._a + (other._a - this._a) * t;
        return out;
    }
    lerpHsvaPut(other: Color, t: number, out: Color): Color {
        this.calculateHsv();
        other.calculateHsv();
        out._h = this._h + (other._h - this._h) * t;
        out._s = this._s + (other._s - this._s) * t;
        out._v = this._v + (other._v - this._v) * t;
        out._a = this._a + (other._a - this._a) * t;
        out.hsvValid = true;
        out.rgbValid = false;
        return out;
    }

    // Allocation Operations
    clone(): Color { return new Color(this.r, this.g, this.b, this.a); }
    lerpRgba(other: Color, t: number): Color { return this.lerpRgbaPut(other, t, Color.zero()); }
    lerpHsva(other: Color, t: number): Color { return this.lerpHsvaPut(other, t, Color.zero()); }
}