export default class Color {
    // R,G,B = 0..255
    // H = 0..360
    // S,V,A = 0..100
    r: number = 0;
    g: number = 0;
    b: number = 0;
    h: number = 0;
    s: number = 0;
    v: number = 0;
    a: number = 100;
    constructor();
    constructor(r:number, g:number, b:number);
    constructor(r:number, g:number, b:number, a:number);
    constructor(r?:number, g?:number, b?:number, a?:number) {
        if(r !== undefined)
            this.setRGB(r,g!,b!);
        this.a = Math.min(Math.max(a??100,0),100);
    }
    setRGB(r:number, g:number, b:number): this {
        this.r = Math.min(Math.max(r,0),255);
        this.g = Math.min(Math.max(g,0),255);
        this.b = Math.min(Math.max(b,0),255);
        const max = Math.max(this.r, this.g, this.b);
        const min = Math.min(this.r, this.g, this.b);
        const delta = max - min;
        this.h = 0;
        if(delta !== 0) {
            if(max === this.r) this.h = 60 * (((this.g-this.b)/delta+6)%6);
            else if(max === this.g) this.h = 60 * ((this.b-this.r)/delta+2);
            else this.h = 60 * ((this.r-this.g)/delta+4);
        }
        if(this.h<0) this.h+=360;
        this.s = max === 0 ? 0 : delta/max*100;
        this.v = max/255*100;
        return this;
    }
    setHSV(h:number, s:number, v:number): this {
        this.h = ((h%360)+360)%360;
        this.s = Math.min(Math.max(s,0),100);
        this.v = Math.min(Math.max(v,0),100);
        const c = this.v/100 * this.s/100;
        const x = c * (1 - Math.abs(((this.h/60)%2)-1));
        const m = this.v/100 - c;
        let rp=0, gp=0, bp=0;
        switch(Math.floor(this.h/60)) {
            case 0: rp=c; gp=x; break;
            case 1: rp=x; gp=c; break;
            case 2: gp=c; bp=x; break;
            case 3: gp=x; bp=c; break;
            case 4: rp=x; bp=c; break;
            default: rp=c; bp=x; break;
        }
        this.r = Math.round((rp + m) * 255);
        this.g = Math.round((gp + m) * 255);
        this.b = Math.round((bp + m) * 255);
        return this;
    }
    toString() {
        return `rgba(${this.r},${this.g},${this.b},${this.a/100})`;
    }
    toArray() {
        return [this.r,this.g,this.b,this.a];
    }
}