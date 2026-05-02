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
    clone(): Vec2 {
        return new Vec2(this.x, this.y);
    }
    toArray(): [number, number] {
        return [this.x, this.y];
    }
    toString(): string {
        return `<${this.x}, ${this.y}>`;
    }
    toObject(): {x: number, y: number} {
        return {x:this.x, y:this.y};
    }

    // Calculations
    lengthSq(): number {
        return this.x * this.x + this.y * this.y;
    }
    length(): number {
        return Math.sqrt(this.x * this.x + this.y);
    }
    roll(): number {
        return Math.atan2(this.y, this.x);
    }
    isClose(other: Vec2, e = 1e-6) {
        return Math.abs(this.x - other.x) < e && Math.abs(this.y - other.y) < e;
    }
    isZero(e = 1e-6) {
        return Math.abs(this.x) < e && Math.abs(this.y) < e;
    }
    isNaN() {
        return Number.isNaN(this.x) || Number.isNaN(this.y);
    }
    isFinite() {
        return Number.isFinite(this.x) && Number.isFinite(this.y);
    }
    distSq(other: Vec2): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return dx*dx + dy*dy;
    }
    dist(other: Vec2): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx*dx + dy*dy);
    }
    dot(other: Vec2): number {
        return this.x * other.x + this.y * other.y;
    }
    angle(other: Vec2): number {
        const d = Math.sqrt(this.lengthSq() * (other.x*other.x + other.y*other.y));
        if(d === 0) return 0;
        return Math.acos(Math.min(Math.max(this.dot(other) / d, -1), 1));
    }
    strictEquals(other: Vec2): boolean {
        return this.x === other.x && this.y === other.y;
    }

    // Operations
    fromVector(other: Vec2): this {
        this.x = other.x;
        this.y = other.y;
        return this;
    }
    fromArray(arr: [number, number, ...number[]]): this {
        this.x = arr[0];
        this.y = arr[1];
        return this;
    }
    fromObject(obj: {x: number, y: number}): this {
        this.x = obj.x;
        this.y = obj.y;
        return this;
    }
    fromAdd(a: Vec2, b: Vec2): this {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
    }
    fromSub(a: Vec2, b: Vec2): this {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;
    }
    fromMul(a: Vec2, b: Vec2): this {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        return this;
    }
    fromDiv(a: Vec2, b: Vec2): this {
        this.x = a.x / b.x;
        this.y = a.y / b.y;
        return this;
    }
    fromNorm(a: Vec2): this {
        const len = a.length();
        if(len === 0) return this.fromVector(a);
        this.x = a.x / len;
        this.y = a.y / len;
        return this;
    }
    fromLerp(a: Vec2, b: Vec2, t: number): this {
        this.x = a.x + (b.x - a.x) * t;
        this.y = a.y + (b.y - a.y) * t;
        return this;
    }
    add(other: Vec2): this {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    sub(other: Vec2): this {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
    mul(other: Vec2): this {
        this.x *= other.x;
        this.y *= other.y;
        return this;
    }
    div(other: Vec2): this {
        this.x /= other.x;
        this.y /= other.y;
        return this;
    }
    negate(): this {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    addScalar(v: number) {
        this.x += v;
        this.y += v;
        return this;
    }
    mulScalar(v: number) {
        this.x *= v;
        this.y *= v;
        return this;
    }
    addScaled(other: Vec2, v: number) {
        this.x += other.x * v;
        this.y += other.y * v;
        return this;
    }
    norm(): this {
        const len = this.length();
        if(len === 0) return this;
        this.x /= len;
        this.y /= len;
        return this;
    }
    rescale(length: number): this {
        return this.norm().mulScalar(length);
    }
    look(other: Vec2): this {
        return this.fromSub(other, this).norm();
    }
    map(callback: (v: number, i: number) => number): this {
        this.x = callback(this.x, 0);
        this.y = callback(this.y, 1);
        return this;
    }
    redot(other: Vec2, targetDot: number): this {
        const d = other.lengthSq();
        if(d === 0) return this.fromVector(other);
        const t = (targetDot - this.dot(other)) / d;
        this.x = this.x + other.x * t;
        this.y = this.y + other.y * t;
        return this;
    }
    clampLength(min: number, max: number): this {
        const len = this.length();
        if(len < min) return this.rescale(min);
        else if(len > max) return this.rescale(max);
        return this;
    }
    applyMatrix(m: Float32Array | number[]): this {
        const x = this.x;
        const y = this.y;
        this.x = m[0]!*x + m[3]!*y + m[6]!;
        this.y = m[1]!*x + m[4]!*y + m[7]!;
        return this;
    }
    applyProjection(m: Float32Array | number[]): this {
        const x = this.x;
        const y = this.y;
        const w = m[2]!*x + m[5]!*y + m[8]!;
        this.x = (m[0]!*x + m[3]!*y + m[6]!) / w;
        this.y = (m[1]!*x + m[4]!*y + m[7]!) / w;
        return this;
    }
    rotate(angle: number): this {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const x = this.x;
        const y = this.y;
        this.x = x * c - y * s;
        this.y = x * s + y * c;
        return this;
    }
}