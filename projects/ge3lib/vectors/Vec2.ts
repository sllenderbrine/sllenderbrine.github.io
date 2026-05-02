import EMath from "../utility/EMath";

export default class Vec2 {
    constructor(v: Vec2 | {x: number, y: number});
    constructor(x: number, y: number);
    constructor(x: number | {x:number, y:number}, y?: number) {
        if(typeof x === "object") {
            this._x = x.x;
            this._y = x.y;
        } else {
            this._x = x;
            this._y = y as number;
        }
    }

    _x: number;
    get x() { return this._x; }
    set x(value: number) {
        this._x = value;
        this.mutate();
    }
    _y: number;
    get y() { return this._y; }
    set y(value: number) {
        this._y = value;
        this.mutate();
    }
    onMutate?: () => void;

    mutate() {
        if(this.onMutate)
            this.onMutate();
    }

    // Static Constructors
    static fill(n: number): Vec2 { return new Vec2(n, n); }
    static zero(): Vec2 { return Vec2.fill(0); }
    static one(): Vec2 { return Vec2.fill(1); }
    static xAxis(): Vec2 { return new Vec2(1, 0); }
    static yAxis(): Vec2 { return new Vec2(0, 1); }
    static random(): Vec2 {
        const a = Math.random() * 2 * Math.PI;
        return new Vec2(Math.cos(a), Math.sin(a));
    }

    // Miscellaneous
    getI(i: number): number | undefined {
        switch(i) {
            case 0: return this._x;
            case 1: return this._y;
        }
        return undefined;
    }
    setI(i: number, v: number): void {
        switch(i) {
            case 0: this._x = v; return;
            case 1: this._y = v; return;
        }
        this.mutate();
    }
    set(other: Vec2): this {
        this._x = other._x;
        this._y = other._y;
        this.mutate();
        return this;
    }
    setC(x: number, y: number): this {
        this._x = x;
        this._y = y;
        this.mutate();
        return this;
    }
    *[Symbol.iterator]() {
        yield this._x;
        yield this._y;
    }
    toString(): string {
        return `<${this._x.toFixed(2)}, ${this._y.toFixed(2)}>`;
    }
    toArray(): [number, number] {
        return [this._x, this._y];
    }
    clone(): Vec2 {
        return new Vec2(this);
    }

    // Calculations
    length(): number {
        return Math.sqrt(this.dot(this));
    }
    lengthSq(): number {
        return this.dot(this);
    }
    dot(other: Vec2): number {
        return this._x * other._x + this._y * other._y;
    }
    dotC(x: number, y: number): number {
        return this._x * x + this._y * y;
    }
    angleTo(other: Vec2): number {
        const c = this.length() * other.length();
        if(c === 0)
            return 0;
        return Math.acos(EMath.clamp(this.dot(other) / c, -1, 1));
    }
    signedAngleTo(other: Vec2): number {
        return Math.atan2(this._x * other._y - this._y * other._x, this.dot(other));
    }
    distTo(other: Vec2): number {
        return this.sub(other).length();
    }
    distToC(x: number, y: number): number {
        return this.subC(x, y).length();
    }
    distSqTo(other: Vec2): number {
        return this.sub(other).lengthSq();
    }
    distSqToC(x: number, y: number): number {
        return this.subC(x, y).lengthSq();
    }
    strictEquals(other: Vec2): boolean {
        return this._x == other._x && this._y == other._y;
    }
    isClose(other: Vec2, e = 1e-6): boolean {
        return EMath.isClose(this._x, other._x, e) && EMath.isClose(this._y, other._y, e);
    }
    isZero(e = 1e-6): boolean {
        return EMath.isZero(this._x, e) && EMath.isZero(this._y, e);
    }
    theta(): number {
        return Math.atan2(this._y, this._x);
    }

    // Operations
    add(other: Vec2): Vec2 {
        return new Vec2(this._x + other._x, this._y + other._y);
    }
    addSelf(other: Vec2): this {
        this._x += other._x;
        this._y += other._y;
        this.mutate();
        return this;
    }
    addC(x: number, y: number): Vec2 {
        return new Vec2(this._x + x, this._y + y);
    }
    addSelfC(x: number, y: number): this {
        this._x += x;
        this._y += y;
        this.mutate();
        return this;
    }
    addF(n: number): Vec2 {
        return new Vec2(this._x + n, this._y + n);
    }
    addSelfF(n: number): this {
        this._x += n;
        this._y += n;
        this.mutate();
        return this;
    }
    addScaled(other: Vec2, s: number): Vec2 {
        return this.clone().addScaledSelf(other, s);
    }
    addScaledSelf(other: Vec2, s: number): this {
        this._x += other._x * s;
        this._y += other._y * s;
        this.mutate();
        return this;
    }
    addScaledC(x: number, y: number, s: number): Vec2 {
        return this.clone().addScaledSelfC(x, y, s);
    }
    addScaledSelfC(x: number, y: number, s: number): this {
        this._x += x * s;
        this._y += y * s;
        this.mutate();
        return this;
    }
    sub(other: Vec2): Vec2 {
        return new Vec2(this._x - other._x, this._y - other._y);
    }
    subSelf(other: Vec2): this {
        this._x -= other._x;
        this._y -= other._y;
        this.mutate();
        return this;
    }
    subC(x: number, y: number): Vec2 {
        return new Vec2(this._x - x, this._y - y);
    }
    subSelfC(x: number, y: number): this {
        this._x -= x;
        this._y -= y;
        this.mutate();
        return this;
    }
    subF(n: number): Vec2 {
        return new Vec2(this._x - n, this._y - n);
    }
    subSelfF(n: number): this {
        this._x -= n;
        this._y -= n;
        this.mutate();
        return this;
    }
    rsub(other: Vec2): Vec2 {
        return new Vec2(other._x - this._x, other._y - this._y);
    }
    rsubSelf(other: Vec2): this {
        this._x = other._x - this._x;
        this._y = other._y - this._y;
        this.mutate();
        return this;
    }
    rsubC(x: number, y: number): Vec2 {
        return new Vec2(x - this._x, y - this._y);
    }
    rsubSelfC(x: number, y: number): this {
        this._x = x - this._x;
        this._y = y - this._y;
        this.mutate();
        return this;
    }
    rsubF(n: number): Vec2 {
        return new Vec2(n - this._x, n - this._y);
    }
    rsubSelfF(n: number): this {
        this._x = n - this._x;
        this._y = n - this._y;
        return this;
    }
    mul(other: Vec2): Vec2 {
        return new Vec2(this._x * other._x, this._y * other._y);
    }
    mulSelf(other: Vec2): this {
        this._x *= other._x;
        this._y *= other._y;
        this.mutate();
        return this;
    }
    mulC(x: number, y: number): Vec2 {
        return new Vec2(this._x * x, this._y * y);
    }
    mulSelfC(x: number, y: number): this {
        this._x *= x;
        this._y *= y;
        this.mutate();
        return this;
    }
    mulF(n: number): Vec2 {
        return new Vec2(this._x * n, this._y * n);
    }
    mulSelfF(n: number): this {
        this._x *= n;
        this._y *= n;
        this.mutate();
        return this;
    }
    div(other: Vec2): Vec2 {
        return new Vec2(this._x / other._x, this._y / other._y);
    }
    divSelf(other: Vec2): this {
        this._x /= other._x;
        this._y /= other._y;
        this.mutate();
        return this;
    }
    divC(x: number, y: number): Vec2 {
        return new Vec2(this._x / x, this._y / y);
    }
    divSelfC(x: number, y: number): this {
        this._x /= x;
        this._y /= y;
        this.mutate();
        return this;
    }
    divF(n: number): Vec2 {
        return new Vec2(this._x / n, this._y / n);
    }
    divSelfF(n: number): this {
        this._x /= n;
        this._y /= n;
        this.mutate();
        return this;
    }
    rdiv(other: Vec2): Vec2 {
        return new Vec2(other._x / this._x, other._y / this._y);
    }
    rdivSelf(other: Vec2): this {
        this._x = other._x / this._x;
        this._y = other._y / this._y;
        this.mutate();
        return this;
    }
    rdivC(x: number, y: number): Vec2 {
        return new Vec2(x / this._x, y / this._y);
    }
    rdivSelfC(x: number, y: number): this {
        this._x = x / this._x;
        this._y = y / this._y;
        this.mutate();
        return this;
    }
    rdivF(n: number): Vec2 {
        return new Vec2(n / this._x, n / this._y);
    }
    rdivSelfF(n: number): this {
        this._x = n / this._x;
        this._y = n / this._y;
        this.mutate();
        return this;
    }
    neg(): Vec2 {
        return new Vec2(-this._x, -this._y);
    }
    negSelf(): this {
        this._x = -this._x;
        this._y = -this._y;
        this.mutate();
        return this;
    }
    lerp(other: Vec2, t: number): Vec2 {
        return this.clone().lerpSelf(other, t);
    }
    lerpSelf(other: Vec2, t: number): this {
        this._x += (other._x - this._x) * t;
        this._y += (other._y - this._y) * t;
        this.mutate();
        return this;
    }
    lerpC(x: number, y: number, t: number): Vec2 {
        return this.clone().lerpSelfC(x, y, t);
    }
    lerpSelfC(x: number, y: number, t: number): this {
        this._x += (x - this._x) * t;
        this._y += (y - this._y) * t;
        this.mutate();
        return this;
    }
    norm(): Vec2 {
        return this.clone().normSelf();
    }
    normSelf(): this {
        const mag = this.length();
        if(mag === 0)
            return this;
        return this.divSelfC(mag, mag);
    }
    rescale(mag: number): Vec2 {
        return this.clone().rescaleSelf(mag);
    }
    rescaleSelf(mag: number): this {
        return this.normSelf().mulSelfC(mag, mag);
    }
    look(other: Vec2): Vec2 {
        return this.clone().lookSelf(other);
    }
    lookSelf(other: Vec2): this {
        return this.rsubSelf(other).normSelf();
    }
    clampLength(a: number, b: number): Vec2 {
        return this.clone().clampLengthSelf(a, b);
    }
    clampLengthSelf(a: number, b: number): this {
        return this.rescaleSelf(EMath.clamp(this.length(), a, b));
    }
    setDot(other: Vec2, target: number): Vec2 {
        return this.clone().setDotSelf(other, target);
    }
    setDotSelf(other: Vec2, target: number): this {
        const d = other.dot(other);
        if(d === 0) return this;
        return this.addScaledSelf(other, (target - this.dot(other)) / d);
    }
    setDotC(x: number, y: number, target: number): Vec2 {
        return this.clone().setDotSelfC(x, y, target);
    }
    setDotSelfC(x: number, y: number, target: number): this {
        const d = x*x + y*y;
        if(d === 0) return this;
        return this.addScaledSelfC(x, y, (target - this.dotC(x, y)) / d);
    }
    map(method: (x: number, i: number) => number): Vec2 {
        return this.clone().mapSelf(method);
    }
    mapSelf(method: (x: number, i: number) => number): this {
        this._x = method(this._x, 0);
        this._y = method(this._y, 1);
        this.mutate();
        return this;
    }
    rotate(a: number): Vec2 {
        return this.clone().rotateSelf(a);
    }
    rotateSelf(a: number) : this {
        const s = Math.sin(a), c = Math.cos(a);
        const x = this.x, y = this.y;
        this._x = x * c - y * s;
        this._y = x * s + y * c;
        this.mutate();
        return this;
    }
}