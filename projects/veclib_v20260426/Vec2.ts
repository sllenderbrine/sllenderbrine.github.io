export class Vec2 {
    constructor(public x: number, public y: number) { }

    // Static Constructors
    static xAxis() { return new Vec2(1, 0); }
    static yAxis() { return new Vec2(0, 1); }
    static zero() { return new Vec2(0, 0); }
    static one() { return new Vec2(1, 1); }
    static fill(v: number) { return new Vec2(v, v); }
    static fromArray(arr: [number, number]) {
        return new Vec2(arr[0], arr[1]);
    }
    static fromObject(obj: {x: number, y: number}) {
        return new Vec2(obj.x, obj.y);
    }
    static randomUnit(): Vec2 {
        const a = Math.random() * 2 * Math.PI;
        return new Vec2(Math.cos(a), Math.sin(a));
    }

    // Conversions
    toArray(): [number, number] {
        return [this.x, this.y];
    }
    toArrayPut(arr: number[]): number[] {
        arr[0] = this.x;
        arr[1] = this.y;
        return arr;
    }
    toString(): string {
        return `<${this.x}, ${this.y}>`;
    }
    toObject(): {x: number, y: number} {
        return {x:this.x, y:this.y};
    }
    toObjectPut(obj: any): any {
        obj.x = this.x;
        obj.y = this.y;
        return obj;
    }

    // Calculations
    lengthSq(): number { return this.x * this.x + this.y * this.y; }
    length(): number { return Math.sqrt(this.x * this.x + this.y * this.y); }
    roll(): number { return Math.atan2(this.y, this.x); }
    isCloseParts(x: number, y: number, e = 1e-6) {
        return Math.abs(this.x - x) < e && Math.abs(this.y - y) < e;
    }
    isClose(other: Vec2, e = 1e-6) { return this.isCloseParts(other.x, other.y, e); }
    isZero(e = 1e-6) {
        return Math.abs(this.x) < e && Math.abs(this.y) < e;
    }
    isNaN() {
        return Number.isNaN(this.x) || Number.isNaN(this.y);
    }
    isFinite() {
        return Number.isFinite(this.x) && Number.isFinite(this.y);
    }
    distSqParts(x: number, y: number): number {
        const dx = this.x - x;
        const dy = this.y - y;
        return dx*dx + dy*dy;
    }
    distSq(other: Vec2): number { return this.distSqParts(other.x, other.y); }
    distParts(x: number, y: number): number {
        const dx = this.x - x;
        const dy = this.y - y;
        return Math.sqrt(dx*dx + dy*dy);
    }
    dist(other: Vec2): number { return this.distParts(other.x, other.y); }
    dotParts(x: number, y: number): number {
        return this.x * x + this.y * y;
    }
    dot(other: Vec2): number { return this.dotParts(other.x, other.y); }
    angleParts(x: number, y: number): number {
        const d = Math.sqrt(this.lengthSq() * (x*x + y*y));
        if(d === 0) return 0;
        return Math.acos(Math.min(Math.max(this.dotParts(x, y) / d, -1), 1));
    }
    angle(other: Vec2): number { return this.angleParts(other.x, other.y); }
    strictEquals(other: Vec2): boolean {
        return this.x === other.x && this.y === other.y;
    }

    // No-Allocation Operations
    copyFrom(other: Vec2): Vec2 {
        this.x = other.x;
        this.y = other.y;
        return this;
    }
    fromArray(arr: [number, number, ...number[]]): Vec2 {
        this.x = arr[0];
        this.y = arr[1];
        return this;
    }
    addPut(other: Vec2, out: Vec2): Vec2 {
        out.x = this.x + other.x;
        out.y = this.y + other.y;
        return out;
    }
    subPut(other: Vec2, out: Vec2): Vec2 {
        out.x = this.x - other.x;
        out.y = this.y - other.y;
        return out;
    }
    mulPut(other: Vec2, out: Vec2): Vec2 {
        out.x = this.x * other.x;
        out.y = this.y * other.y;
        return out;
    }
    divPut(other: Vec2, out: Vec2): Vec2 {
        out.x = this.x / other.x;
        out.y = this.y / other.y;
        return out;
    }
    normPut(out: Vec2): Vec2 {
        const len = this.length();
        if(len === 0) {
            out.x = 0;
            out.y = 0;
        } else {
            out.x = this.x / len;
            out.y = this.y / len;
        }
        return out;
    }
    invertPut(out: Vec2): Vec2 {
        out.x = -this.x;
        out.y = -this.y;
        return out;
    }
    lerpPut(other: Vec2, t: number, out: Vec2): Vec2 {
        out.x = this.x + (other.x - this.x) * t;
        out.y = this.y + (other.y - this.y) * t;
        return out;
    }
    rescalePut(length: number, out: Vec2): Vec2 {
        this.normPut(out);
        out.x *= length;
        out.y *= length;
        return out;
    }
    lookPut(other: Vec2, out: Vec2): Vec2 {
        return other.subPut(this, out).normPut(out);
    }
    mapPut(callback: (v: number, i: number) => number, out: Vec2): Vec2 {
        out.x = callback(this.x, 0);
        out.y = callback(this.y, 1);
        return out;
    }
    redotPut(other: Vec2, targetDot: number, out: Vec2): Vec2 {
        const d = other.lengthSq();
        if(d === 0) return out.copyFrom(this);
        const t = (targetDot - this.dot(other)) / d;
        out.x = this.x + other.x * t;
        out.y = this.y + other.y * t;
        return out;
    }
    clampLengthPut(min: number, max: number, out: Vec2) {
        const len = Math.min(Math.max(this.length(), min), max);
        return this.rescalePut(len, out);
    }
    transformPut(m: Float32Array | number[], out: Vec2): Vec2 {
        const x = this.x;
        const y = this.y;
        out.x = m[0]!*x + m[3]!*y + m[6]!;
        out.y = m[1]!*x + m[4]!*y + m[7]!;
        return out;
    }
    applyProjectionPut(m: Float32Array | number[], out: Vec2): Vec2 {
        const x = this.x;
        const y = this.y;
        const w = m[2]!*x + m[5]!*y + m[8]!;
        out.x = (m[0]!*x + m[3]!*y + m[6]!) / w;
        out.y = (m[1]!*x + m[4]!*y + m[7]!) / w;
        return out;
    }
    rotatePut(a: number, out: Vec2): Vec2 {
        const s = Math.sin(a);
        const c = Math.cos(a);
        const x = this.x;
        const y = this.y;
        out.x = x * c - y * s;
        out.y = x * s + y * c;
        return out;
    }

    addScalarPut(f: number, out: Vec2): Vec2 {
        out.x = this.x + f;
        out.y = this.y + f;
        return out;
    }
    subScalarPut(f: number, out: Vec2): Vec2 {
        out.x = this.x - f;
        out.y = this.y - f;
        return out;
    }
    rsubScalarPut(f: number, out: Vec2): Vec2 {
        out.x = f - this.x;
        out.y = f - this.y;
        return out;
    }
    mulScalarPut(f: number, out: Vec2): Vec2 {
        out.x = this.x * f;
        out.y = this.y * f;
        return out;
    }
    divScalarPut(f: number, out: Vec2): Vec2 {
        out.x = this.x / f;
        out.y = this.y / f;
        return out;
    }
    rdivScalarPut(f: number, out: Vec2): Vec2 {
        out.x = f / this.x;
        out.y = f / this.y;
        return out;
    }

    // Allocation Operations
    clone(): Vec2 { return new Vec2(this.x, this.y); }
    add(other: Vec2): Vec2 { return this.addPut(other, Vec2.zero()); }
    sub(other: Vec2): Vec2 { return this.subPut(other, Vec2.zero()); }
    mul(other: Vec2): Vec2 { return this.mulPut(other, Vec2.zero()); }
    div(other: Vec2): Vec2 { return this.divPut(other, Vec2.zero()); }
    norm(): Vec2 { return this.normPut(Vec2.zero()); }
    invert(): Vec2 { return this.invertPut(Vec2.zero()); }
    lerp(other: Vec2, t: number): Vec2 { return this.lerpPut(other, t, Vec2.zero()); }
    rescale(length: number): Vec2 { return this.rescalePut(length, Vec2.zero()); }
    look(other: Vec2): Vec2 { return this.lookPut(other, Vec2.zero()); }
    map(callback: (v: number, i: number) => number): Vec2 { return this.mapPut(callback, Vec2.zero()); }
    redot(other: Vec2, targetDot: number): Vec2 { return this.redotPut(other, targetDot, Vec2.zero()); }
    clampLength(min: number, max: number): Vec2 { return this.clampLengthPut(min, max, Vec2.zero()); }
    transform(m: number[]): Vec2 { return this.transformPut(m, Vec2.zero()); }
    applyProjection(m: number[]): Vec2 { return this.applyProjectionPut(m, Vec2.zero()); }
    rotate(a: number): Vec2 { return this.rotatePut(a, Vec2.zero()); }

    addScalar(f: number): Vec2 { return this.addScalarPut(f, Vec2.zero()); }
    subScalar(f: number): Vec2 { return this.subScalarPut(f, Vec2.zero()); }
    rsubScalar(f: number): Vec2 { return this.rsubScalarPut(f, Vec2.zero()); }
    mulScalar(f: number): Vec2 { return this.mulScalarPut(f, Vec2.zero()); }
    divScalar(f: number): Vec2 { return this.divScalarPut(f, Vec2.zero()); }
    rdivScalar(f: number): Vec2 { return this.rdivScalarPut(f, Vec2.zero()); }
}