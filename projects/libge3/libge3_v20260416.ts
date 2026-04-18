// 3D/2D JS Game Engine Library
// https://github.com/sllenderbrine

//  DELAY UTILITY  //
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

///////////////////
//  EMATH CLASS  //
///////////////////
export abstract class EMath {
    static clamp(n: number,a: number,b: number) : number {
        return Math.min(Math.max(n,a),b);
    }
    static lerp(a: number,b: number,t: number) : number {
        return a+(b-a)*t;
    }
    static pmod(x: number,a: number) : number {
        return ((x%a)+a)%a;
    }
    static isClose(a: number, b: number, e: number = 1e-6) {
        return Math.abs(a-b) < e;
    }
    static isZero(v: number, e: number = 1e-6) {
        return Math.abs(v) < e;
    }
}

//////////////////////
//  VECTOR CLASSES  //
//////////////////////
export class Vec3 {
    _x: number;
    _y: number;
    _z: number;
    onMutate?: () => void;
    constructor(v: Vec3 | {x: number, y: number, z: number}, onMutate?: () => void);
    constructor(x: number, y: number, z: number, onMutate?: () => void);
    constructor(x: number | Vec3 | {x:number, y:number, z:number}, y?: number | ((index: number) => void), z?: number, onMutate?: () => void) {
        if(typeof x === "object") {
            this._x = x.x;
            this._y = x.y;
            this._z = x.z;
            this.onMutate = y as (() => void);
        } else {
            this._x = x;
            this._y = y! as number;
            this._z = z!;
            this.onMutate = onMutate;
        }
    }

    mutate() {
        if(this.onMutate)
            this.onMutate();
    }
    
    set x(value: number) {
        this._x = value;
        this.mutate();
    }
    get x() { return this._x; }
    set y(value: number) {
        this._y = value;
        this.mutate();
    }
    get y() { return this._y; }
    set z(value: number) {
        this._z = value;
        this.mutate();
    }
    get z() { return this._z; }

    // Static Constructors
    static fill(n: number): Vec3 { return new Vec3(n, n, n); }
    static zero(): Vec3 { return Vec3.fill(0); }
    static one(): Vec3 { return Vec3.fill(1); }
    static xAxis(): Vec3 { return new Vec3(1, 0, 0); }
    static yAxis(): Vec3 { return new Vec3(0, 1, 0); }
    static zAxis(): Vec3 { return new Vec3(0, 0, 1); }
    static random(): Vec3 {
        const z = Math.random() * 2 - 1;
        const a = Math.random() * 2 * Math.PI;
        const b = Math.sqrt(Math.max(0, 1 - z * z));
        return new Vec3(b * Math.cos(a), b * Math.sin(a), z);
    }
    static randomRotation(): Vec3 {
        const v = Vec3.random();
        return new Vec3(v.pitch(), v.yaw(), Math.random() * 2 * Math.PI);
    }

    // Miscellaneous
    get(i: number): number | undefined {
        switch(i) {
            case 0: return this._x;
            case 1: return this._y;
            case 2: return this._z;
        }
        return undefined;
    }
    set(i: number, v: number): void {
        switch(i) {
            case 0: this._x = v; this.mutate(); return;
            case 1: this._y = v; this.mutate(); return;
            case 2: this._z = v; this.mutate(); return;
        }
    }
    setC(x: number, y: number, z: number): this {
        this._x = x;
        this._y = y;
        this._z = z;
        this.mutate();
        return this;
    }
    *[Symbol.iterator]() {
        yield this._x;
        yield this._y;
        yield this._z;
    }
    toString(): string {
        return `<${this._x.toFixed(2)}, ${this._y.toFixed(2)}, ${this._z.toFixed(2)}>`;
    }
    toArray(): [number, number, number] {
        return [this._x, this._y, this._z];
    }
    clone(): Vec3 {
        return new Vec3(this);
    }
    getPrimaryAxis(): number {
        const ax = Math.abs(this._x);
        const ay = Math.abs(this._y);
        const az = Math.abs(this._z);
        if(ax > ay) return ax > az ? 0 : 2;
        else return ay > az ? 1 : 2;
    }

    // Calculations
    length(): number {
        return Math.sqrt(this.dot(this));
    }
    dot(other: Vec3): number {
        return this._x * other._x + this._y * other._y + this._z * other._z;
    }
    dotC(x: number, y: number, z: number): number {
        return this._x * x + this._y * y + this._z * z;
    }
    cross(other: Vec3): Vec3 {
        return new Vec3(this._y * other._z - this._z * other._y, - (this._x * other._z - this._z * other._x), this._x * other._y - this._y * other._x);
    }
    crossC(x: number, y: number, z: number): Vec3 {
        return new Vec3(this._y * z - this._z * y, - (this._x * z - this._z * x), this._x * y - this._y * x);
    }
    angle(other: Vec3): number {
        const c = this.length() * other.length();
        if(c === 0)
            return 0;
        return Math.acos(EMath.clamp(this.dot(other) / c, -1, 1));
    }
    signedAngle(other: Vec3, reference: Vec3 = Vec3.yAxis()): number {
        const angle = this.angle(other);
        const normal = this.cross(other).normSelf();
        if(normal.dot(reference.norm()) > 0)
            return -angle;
        return angle;
    }
    dist(other: Vec3): number {
        return this.sub(other).length();
    }
    distC(x: number, y: number, z: number): number {
        return this.subC(x, y, z).length();
    }
    strictEquals(other: Vec3): boolean {
        return this._x == other._x && this._y == other._y && this._z == other._z;
    }
    isClose(other: Vec3, e = 1e-6): boolean {
        return EMath.isClose(this._x, other._x, e) && EMath.isClose(this._y, other._y, e) && EMath.isClose(this._z, other._z, e);
    }
    isZero(e = 1e-6): boolean {
        return EMath.isZero(this._x, e) && EMath.isZero(this._y, e) && EMath.isZero(this._z, e);
    }
    pitch(): number {
        return Math.asin(this._y);
    }
    yaw(): number {
        return Math.atan2(-this._x, -this._z);
    }

    // Operations
    add(other: Vec3): Vec3 {
        return new Vec3(this._x + other._x, this._y + other._y, this._z + other._z);
    }
    addSelf(other: Vec3): this {
        this._x += other._x;
        this._y += other._y;
        this._z += other._z;
        this.mutate();
        return this;
    }
    addC(x: number, y: number, z: number): Vec3 {
        return new Vec3(this._x + x, this._y + y, this._z + z);
    }
    addSelfC(x: number, y: number, z: number): this {
        this._x += x;
        this._y += y;
        this._z += z;
        this.mutate();
        return this;
    }
    addF(n: number): Vec3 {
        return new Vec3(this._x + n, this._y + n, this._z + n);
    }
    addSelfF(n: number): this {
        this._x += n;
        this._y += n;
        this._z += n;
        this.mutate();
        return this;
    }
    addScaled(other: Vec3, s: number): Vec3 {
        return this.clone().addScaledSelf(other, s);
    }
    addScaledSelf(other: Vec3, s: number): this {
        this._x += other._x * s;
        this._y += other._y * s;
        this._z += other._z * s;
        this.mutate();
        return this;
    }
    addScaledC(x: number, y: number, z: number, s: number): Vec3 {
        return this.clone().addScaledSelfC(x, y, z, s);
    }
    addScaledSelfC(x: number, y: number, z: number, s: number): this {
        this._x += x * s;
        this._y += y * s;
        this._z += z * s;
        this.mutate();
        return this;
    }
    sub(other: Vec3): Vec3 {
        return new Vec3(this._x - other._x, this._y - other._y, this._z - other._z);
    }
    subSelf(other: Vec3): this {
        this._x -= other._x;
        this._y -= other._y;
        this._z -= other._z;
        this.mutate();
        return this;
    }
    subC(x: number, y: number, z: number): Vec3 {
        return new Vec3(this._x - x, this._y - y, this._z - z);
    }
    subSelfC(x: number, y: number, z: number): this {
        this._x -= x;
        this._y -= y;
        this._z -= z;
        this.mutate();
        return this;
    }
    subF(n: number): Vec3 {
        return new Vec3(this._x - n, this._y - n, this._z - n);
    }
    subSelfF(n: number): this {
        this._x -= n;
        this._y -= n;
        this._z -= n;
        this.mutate();
        return this;
    }
    rsub(other: Vec3): Vec3 {
        return new Vec3(other._x - this._x, other._y - this._y, other._z - this._z);
    }
    rsubSelf(other: Vec3): this {
        this._x = other._x - this._x;
        this._y = other._y - this._y;
        this._z = other._z - this._z;
        this.mutate();
        return this;
    }
    rsubC(x: number, y: number, z: number): Vec3 {
        return new Vec3(x - this._x, y - this._y, z - this._z);
    }
    rsubSelfC(x: number, y: number, z: number): this {
        this._x = x - this._x;
        this._y = y - this._y;
        this._z = z - this._z;
        this.mutate();
        return this;
    }
    rsubF(n: number): Vec3 {
        return new Vec3(n - this._x, n - this._y, n - this._z);
    }
    rsubSelfF(n: number): this {
        this._x = n - this._x;
        this._y = n - this._y;
        this._z = n - this._z;
        this.mutate();
        return this;
    }
    mul(other: Vec3): Vec3 {
        return new Vec3(this._x * other._x, this._y * other._y, this._z * other._z);
    }
    mulSelf(other: Vec3): this {
        this._x *= other._x;
        this._y *= other._y;
        this._z *= other._z;
        this.mutate();
        return this;
    }
    mulC(x: number, y: number, z: number): Vec3 {
        return new Vec3(this._x * x, this._y * y, this._z * z);
    }
    mulSelfC(x: number, y: number, z: number): this {
        this._x *= x;
        this._y *= y;
        this._z *= z;
        this.mutate();
        return this;
    }
    mulF(n: number): Vec3 {
        return new Vec3(this._x * n, this._y * n, this._z * n);
    }
    mulSelfF(n: number): this {
        this._x *= n;
        this._y *= n;
        this._z *= n;
        this.mutate();
        return this;
    }
    div(other: Vec3): Vec3 {
        return new Vec3(this._x / other._x, this._y / other._y, this._z / other._z);
    }
    divSelf(other: Vec3): this {
        this._x /= other._x;
        this._y /= other._y;
        this._z /= other._z;
        this.mutate();
        return this;
    }
    divC(x: number, y: number, z: number): Vec3 {
        return new Vec3(this._x / x, this._y / y, this._z / z);
    }
    divSelfC(x: number, y: number, z: number): this {
        this._x /= x;
        this._y /= y;
        this._z /= z;
        this.mutate();
        return this;
    }
    divF(n: number): Vec3 {
        return new Vec3(this._x / n, this._y / n, this._z / n);
    }
    divSelfF(n: number): this {
        this._x /= n;
        this._y /= n;
        this._z /= n;
        this.mutate();
        return this;
    }
    rdiv(other: Vec3): Vec3 {
        return new Vec3(other._x / this._x, other._y / this._y, other._z / this._z);
    }
    rdivSelf(other: Vec3): this {
        this._x = other._x / this._x;
        this._y = other._y / this._y;
        this._z = other._z / this._z;
        this.mutate();
        return this;
    }
    rdivC(x: number, y: number, z: number): Vec3 {
        return new Vec3(x / this._x, y / this._y, z / this._z);
    }
    rdivSelfC(x: number, y: number, z: number): this {
        this._x = x / this._x;
        this._y = y / this._y;
        this._z = z / this._z;
        this.mutate();
        return this;
    }
    rdivF(n: number): Vec3 {
        return new Vec3(n / this._x, n / this._y, n / this._z);
    }
    rdivSelfF(n: number): this {
        this._x = n / this._x;
        this._y = n / this._y;
        this._z = n / this._z;
        this.mutate();
        return this;
    }
    neg(): Vec3 {
        return new Vec3(-this._x, -this._y, -this._z);
    }
    negSelf(): this {
        this._x = -this._x;
        this._y = -this._y;
        this._z = -this._z;
        this.mutate();
        return this;
    }
    lerp(other: Vec3, t: number): Vec3 {
        return this.clone().lerpSelf(other, t);
    }
    lerpSelf(other: Vec3, t: number): this {
        this._x += (other._x - this._x) * t;
        this._y += (other._y - this._y) * t;
        this._z += (other._z - this._z) * t;
        this.mutate();
        return this;
    }
    lerpC(x: number, y: number, z: number, t: number): Vec3 {
        return this.clone().lerpSelfC(x, y, z, t);
    }
    lerpSelfC(x: number, y: number, z: number, t: number): this {
        this._x += (x - this._x) * t;
        this._y += (y - this._y) * t;
        this._z += (z - this._z) * t;
        this.mutate();
        return this;
    }
    norm(): Vec3 {
        return this.clone().normSelf();
    }
    normSelf(): this {
        const mag = this.length();
        if(mag === 0)
            return this;
        return this.divSelfC(mag, mag, mag);
    }
    rescale(mag: number): Vec3 {
        return this.clone().rescaleSelf(mag);
    }
    rescaleSelf(mag: number): this {
        return this.normSelf().mulSelfC(mag, mag, mag);
    }
    look(other: Vec3): Vec3 {
        return this.clone().lookSelf(other);
    }
    lookSelf(other: Vec3): this {
        return this.rsubSelf(other).normSelf();
    }
    clampLength(a: number, b: number): Vec3 {
        return this.clone().clampLengthSelf(a, b);
    }
    clampLengthSelf(a: number, b: number): this {
        return this.rescaleSelf(EMath.clamp(this.length(), a, b));
    }
    flat(): Vec3 {
        return this.clone().flatSelf();
    }
    flatSelf(): this {
        this._y = 0;
        this.mutate();
        return this;
    }
    flatNorm(): Vec3 {
        return this.clone().flatNormSelf();
    }
    flatNormSelf(): this {
        return this.flatSelf().normSelf();
    }
    setDot(other: Vec3, target: number): Vec3 {
        return this.clone().setDotSelf(other, target);
    }
    setDotSelf(other: Vec3, target: number): this {
        const d = other.dot(other);
        if(d === 0) return this;
        return this.addScaledSelf(other, (target - this.dot(other)) / d);
    }
    setDotC(x: number, y: number, z: number, target: number): Vec3 {
        return this.clone().setDotSelfC(x, y, z, target);
    }
    setDotSelfC(x: number, y: number, z: number, target: number): this {
        const d = x*x + y*y + z*z;
        if(d === 0) return this;
        return this.addScaledSelfC(x, y, z, (target - this.dotC(x, y, z)) / d);
    }
    map(method: (x: number, i: number) => number): Vec3 {
        return this.clone().mapSelf(method);
    }
    mapSelf(method: (x: number, i: number) => number): this {
        this._x = method(this._x, 0);
        this._y = method(this._y, 1);
        this._z = method(this._z, 2);
        this.mutate();
        return this;
    }
    rotX(a: number): Vec3 {
        return this.clone().rotXSelf(a);
    }
    rotXSelf(a: number): this {
        const s = Math.sin(a), c = Math.cos(a);
        const y = this._y * c - this._z * s;
        this._z = this._y * s + this._z * c;
        this._y = y;
        this.mutate();
        return this;
    }
    rotY(a: number): Vec3 {
        return this.clone().rotYSelf(a);
    }
    rotYSelf(a: number): this {
        const s = Math.sin(a), c = Math.cos(a);
        const z = this._z * c - this._x * s;
        this._x = this._x * c + this._z * s;
        this._z = z;
        this.mutate();
        return this;
    }
    rotZ(a: number): Vec3 {
        return this.clone().rotZSelf(a);
    }
    rotZSelf(a: number): this {
        const s = Math.sin(a), c = Math.cos(a);
        const x = this._x * c - this._y * s;
        this._y = this._x * s + this._y * c;
        this._x = x;
        this.mutate();
        return this;
    }
    rotAxis(axis: Vec3, angle: number): Vec3 {
        return this.clone().rotAxisSelf(axis, angle);
    }
    rotAxisSelf(axis: Vec3, angle: number): this {
        axis = axis.norm();
        const s = Math.sin(angle), c = Math.cos(angle);
        const cross = axis.cross(this);
        const dot = axis.dot(this);
        let x = this._x, y = this._y, z = this._z;
        this._x = x * c + cross._x * s + axis._x * dot * (1 - c);
        this._y = y * c + cross._y * s + axis._y * dot * (1 - c);
        this._z = z * c + cross._z * s + axis._z * dot * (1 - c);
        this.mutate();
        return this;
    }
    rotXYZ(rot: Vec3): Vec3 {
        return this.clone().rotXYZSelf(rot);
    }
    rotXYZSelf(rot: Vec3): this {
        return this.rotXSelf(rot._x).rotYSelf(rot._y).rotZSelf(rot._z);
    }
    rotXYZC(x: number, y: number, z: number): Vec3 {
        return this.clone().rotXYZSelfC(x, y, z);
    }
    rotXYZSelfC(x: number, y: number, z: number): this {
        return this.rotXSelf(x).rotYSelf(y).rotZSelf(z);
    }
    rotZYX(rot: Vec3): Vec3 {
        return this.clone().rotZYXSelf(rot);
    }
    rotZYXSelf(rot: Vec3): this {
        return this.rotZSelf(rot._z).rotYSelf(rot._y).rotXSelf(rot._x);
    }
    rotZYXC(x: number, y: number, z: number): Vec3 {
        return this.clone().rotZYXSelfC(x, y, z);
    }
    rotZYXSelfC(x: number, y: number, z: number): this {
        return this.rotZSelf(z).rotYSelf(y).rotXSelf(x);
    }
}

export class Vec2 {
    x: number;
    y: number;
    constructor(v: Vec2 | {x: number, y: number});
    constructor(x: number, y: number);
    constructor(x: number | {x:number, y:number}, y?: number) {
        if(typeof x === "object") {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y!;
        }
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
    get(i: number): number | undefined {
        switch(i) {
            case 0: return this.x;
            case 1: return this.y;
        }
        return undefined;
    }
    set(i: number, v: number): void {
        switch(i) {
            case 0: this.x = v; return;
            case 1: this.y = v; return;
        }
    }
    setC(x: number, y: number): this {
        this.x = x;
        this.y = y;
        return this;
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
    }
    toString(): string {
        return `<${this.x.toFixed(2)}, ${this.y.toFixed(2)}>`;
    }
    toArray(): [number, number] {
        return [this.x, this.y];
    }
    clone(): Vec2 {
        return new Vec2(this);
    }

    // Calculations
    length(): number {
        return Math.sqrt(this.dot(this));
    }
    dot(other: Vec2): number {
        return this.x * other.x + this.y * other.y;
    }
    dotC(x: number, y: number): number {
        return this.x * x + this.y * y;
    }
    angle(other: Vec2): number {
        const c = this.length() * other.length();
        if(c === 0)
            return 0;
        return Math.acos(EMath.clamp(this.dot(other) / c, -1, 1));
    }
    signedAngle(other: Vec2): number {
        return Math.atan2(this.x * other.y - this.y * other.x, this.dot(other));
    }
    dist(other: Vec2): number {
        return this.sub(other).length();
    }
    distC(x: number, y: number): number {
        return this.subC(x, y).length();
    }
    strictEquals(other: Vec2): boolean {
        return this.x == other.x && this.y == other.y;
    }
    isClose(other: Vec2, e = 1e-6): boolean {
        return EMath.isClose(this.x, other.x, e) && EMath.isClose(this.y, other.y, e);
    }
    isZero(e = 1e-6): boolean {
        return EMath.isZero(this.x, e) && EMath.isZero(this.y, e);
    }
    theta(): number {
        return Math.atan2(this.y, this.x);
    }

    // Operations
    add(other: Vec2): Vec2 {
        return new Vec2(this.x + other.x, this.y + other.y);
    }
    addSelf(other: Vec2): this {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    addC(x: number, y: number): Vec2 {
        return new Vec2(this.x + x, this.y + y);
    }
    addSelfC(x: number, y: number): this {
        this.x += x;
        this.y += y;
        return this;
    }
    addF(n: number): Vec2 {
        return new Vec2(this.x + n, this.y + n);
    }
    addSelfF(n: number): this {
        this.x += n;
        this.y += n;
        return this;
    }
    addScaled(other: Vec2, s: number): Vec2 {
        return this.clone().addScaledSelf(other, s);
    }
    addScaledSelf(other: Vec2, s: number): this {
        this.x += other.x * s;
        this.y += other.y * s;
        return this;
    }
    addScaledC(x: number, y: number, s: number): Vec2 {
        return this.clone().addScaledSelfC(x, y, s);
    }
    addScaledSelfC(x: number, y: number, s: number): this {
        this.x += x * s;
        this.y += y * s;
        return this;
    }
    sub(other: Vec2): Vec2 {
        return new Vec2(this.x - other.x, this.y - other.y);
    }
    subSelf(other: Vec2): this {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
    subC(x: number, y: number): Vec2 {
        return new Vec2(this.x - x, this.y - y);
    }
    subSelfC(x: number, y: number): this {
        this.x -= x;
        this.y -= y;
        return this;
    }
    subF(n: number): Vec2 {
        return new Vec2(this.x - n, this.y - n);
    }
    subSelfF(n: number): this {
        this.x -= n;
        this.y -= n;
        return this;
    }
    rsub(other: Vec2): Vec2 {
        return new Vec2(other.x - this.x, other.y - this.y);
    }
    rsubSelf(other: Vec2): this {
        this.x = other.x - this.x;
        this.y = other.y - this.y;
        return this;
    }
    rsubC(x: number, y: number): Vec2 {
        return new Vec2(x - this.x, y - this.y);
    }
    rsubSelfC(x: number, y: number): this {
        this.x = x - this.x;
        this.y = y - this.y;
        return this;
    }
    rsubF(n: number): Vec2 {
        return new Vec2(n - this.x, n - this.y);
    }
    rsubSelfF(n: number): this {
        this.x = n - this.x;
        this.y = n - this.y;
        return this;
    }
    mul(other: Vec2): Vec2 {
        return new Vec2(this.x * other.x, this.y * other.y);
    }
    mulSelf(other: Vec2): this {
        this.x *= other.x;
        this.y *= other.y;
        return this;
    }
    mulC(x: number, y: number): Vec2 {
        return new Vec2(this.x * x, this.y * y);
    }
    mulSelfC(x: number, y: number): this {
        this.x *= x;
        this.y *= y;
        return this;
    }
    mulF(n: number): Vec2 {
        return new Vec2(this.x * n, this.y * n);
    }
    mulSelfF(n: number): this {
        this.x *= n;
        this.y *= n;
        return this;
    }
    div(other: Vec2): Vec2 {
        return new Vec2(this.x / other.x, this.y / other.y);
    }
    divSelf(other: Vec2): this {
        this.x /= other.x;
        this.y /= other.y;
        return this;
    }
    divC(x: number, y: number): Vec2 {
        return new Vec2(this.x / x, this.y / y);
    }
    divSelfC(x: number, y: number): this {
        this.x /= x;
        this.y /= y;
        return this;
    }
    divF(n: number): Vec2 {
        return new Vec2(this.x / n, this.y / n);
    }
    divSelfF(n: number): this {
        this.x /= n;
        this.y /= n;
        return this;
    }
    rdiv(other: Vec2): Vec2 {
        return new Vec2(other.x / this.x, other.y / this.y);
    }
    rdivSelf(other: Vec2): this {
        this.x = other.x / this.x;
        this.y = other.y / this.y;
        return this;
    }
    rdivC(x: number, y: number): Vec2 {
        return new Vec2(x / this.x, y / this.y);
    }
    rdivSelfC(x: number, y: number): this {
        this.x = x / this.x;
        this.y = y / this.y;
        return this;
    }
    rdivF(n: number): Vec2 {
        return new Vec2(n / this.x, n / this.y);
    }
    rdivSelfF(n: number): this {
        this.x = n / this.x;
        this.y = n / this.y;
        return this;
    }
    neg(): Vec2 {
        return new Vec2(-this.x, -this.y);
    }
    negSelf(): this {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    lerp(other: Vec2, t: number): Vec2 {
        return this.clone().lerpSelf(other, t);
    }
    lerpSelf(other: Vec2, t: number): this {
        this.x += (other.x - this.x) * t;
        this.y += (other.y - this.y) * t;
        return this;
    }
    lerpC(x: number, y: number, t: number): Vec2 {
        return this.clone().lerpSelfC(x, y, t);
    }
    lerpSelfC(x: number, y: number, t: number): this {
        this.x += (x - this.x) * t;
        this.y += (y - this.y) * t;
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
        this.x = method(this.x, 0);
        this.y = method(this.y, 1);
        return this;
    }
    rotate(a: number): Vec2 {
        return this.clone().rotateSelf(a);
    }
    rotateSelf(a: number) : this {
        const s = Math.sin(a), c = Math.cos(a);
        const x = this.x, y = this.y;
        this.x = x * c - y * s;
        this.y = x * s + y * c;
        return this;
    }
}


//////////////////////
//  MATRIX CLASSES  //
//////////////////////
// Column-major 4x4 matrix
export abstract class Mat4 {
    constructor() {}
    
    static new() {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    }
    static translate(x: number, y: number, z: number) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1,
        ];
    }
    static scale(x: number, y: number, z: number) {
        return [
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1,
        ];
    }
    static rotateX(a: number) {
        const c = Math.cos(a);
        const s = Math.sin(a);
        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        ];
    }
    static rotateY(a: number) {
        const c = Math.cos(a);
        const s = Math.sin(a);
        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ];
    }
    static rotateZ(a: number) {
        const c = Math.cos(a);
        const s = Math.sin(a);
        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }
    static perspective(fovY: number, aspect: number, near: number = 1, far: number = 1000) {
        const f = 1 / Math.tan(fovY / 2);
        const nf = 1 / (near - far);
        return [
            f/aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, (2 * far * near) * nf, 0
        ];
    }
    static multiply(m1: number[], m2: number[]) {
        const out = Mat4.new();
        for(let i=0; i<4; i++) {
            for(let j=0; j<4; j++) {
                out[i*4 + j] = (
                    m1[0*4 + j]! * m2[i*4 + 0]!
                    + m1[1*4 + j]! * m2[i*4 + 1]!
                    + m1[2*4 + j]! * m2[i*4 + 2]!
                    + m1[3*4 + j]! * m2[i*4 + 3]!
                );
            }
        }
        return out;
    }
}


// Column-major 3x3 matrix
export abstract class Mat3 {
    constructor() {}

    static new() {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ];
    }
    static translate(x: number, y: number) {
        return [
            1, 0, 0,
            0, 1, 0,
            x, y, 1,
        ];
    }
    static scale(x: number, y: number) {
        return [
            x, 0, 0,
            0, y, 0,
            0, 0, 1,
        ];
    }
    static rotate(a: number) {
        const c = Math.cos(a);
        const s = Math.sin(a);
        return [
            c, s, 0,
            -s, c, 0,
            0, 0, 1,
        ];
    }
    static multiply(m1: number[], m2: number[]) {
        const out = Mat3.new();
        for(let i=0; i<3; i++) {
            for(let j=0; j<3; j++) {
                out[i*3 + j] = (
                    m1[0*3 + j]! * m2[i*3 + 0]!
                    + m1[1*3 + j]! * m2[i*3 + 1]!
                    + m1[2*3 + j]! * m2[i*3 + 2]!
                );
            }
        }
        return out;
    }
}


///////////////////
//  NOISE CLASS  //
///////////////////
const gradients2D: Vec2[] = [];
for(let i=0;i<12;i++) {
    const angle = 2 * Math.PI * i/12;
    gradients2D.push(new Vec2(Math.cos(angle), Math.sin(angle)));
}
const gradients3D: Vec3[] = [];
for(let i=0;i<16;i++) {
    const y = 1 - (2*i)/(15);
    const r = Math.sqrt(1-y*y);
    const angle = i * Math.PI * (3-Math.sqrt(5));
    gradients3D.push(new Vec3(
        Math.cos(angle) * r,
        y,
        Math.sin(angle) * r,
    ));
}
export abstract class Noise {
    static fade(t: number) : number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    static randomConstant3(a: number, b: number, c: number) : number {
        const it = (a * 2394823549) ^ (b * 43859742850) ^ (c * 23094565234);
        return EMath.pmod(it, 10000) / 10000;
    }
    static randomConstant4(a: number, b: number, c: number, d: number) : number {
        const it = (a * 2394823549) ^ (b * 43859742850) ^ (c * 23094565234) ^ (d * 8427824566);
        return EMath.pmod(it, 10000) / 10000;
    }
    static getPerlinVector2D(x: number, y: number, seed = 0) : Vec2 {
        return gradients2D[Math.floor(Noise.randomConstant3(seed, x, y) * gradients2D.length)]!;
    }
    static getPerlinVector3D(x: number, y: number, z: number, seed = 0) : Vec3 {
        return gradients3D[Math.floor(Noise.randomConstant4(seed, x, y, z) * gradients3D.length)]!;
    }
    static getVoronoiGridPosition2D(x: number, y: number, seed = 0, t = 1) : Vec2 {
        return new Vec2(
            x + t * Noise.randomConstant3(x, y, seed),
            y + t * Noise.randomConstant3(x, y, seed+1)
        );
    }
    static getVoronoiGridValue2D(x: number, y: number, seed = 0) : number {
        return Noise.randomConstant3(x, y, seed+2);
    }
    static getVoronoiGridPosition3D(x: number, y: number, z: number, seed = 0, t = 1) : Vec3 {
        return new Vec3(
            x + t * Noise.randomConstant4(x, y, z, seed),
            y + t * Noise.randomConstant4(y, z, x, seed+1),
            z + t * Noise.randomConstant4(z, x, y, seed+2),
        );
    }
    static getVoronoiGridValue3D(x: number, y: number, z: number, seed = 0) : number {
        return Noise.randomConstant4(x, y, z, seed+3);
    }
    static perlinNoise2D(x: number, y: number, seed = 0) : number {
        const getPerlinVector2D = Noise.getPerlinVector2D;
        const lerp = EMath.lerp;
        const fade = Noise.fade;
        const g0 = new Vec2(x, y).mapSelf(Math.floor);
        const g1 = new Vec2(g0).addSelfC(1, 1);
        const f0 = new Vec2(x, y).subSelf(g0);
        const f1 = new Vec2(x, y).subSelf(g1);
        const cAA = getPerlinVector2D(g0.x, g0.y, seed).dot(f0);
        const cAB = getPerlinVector2D(g0.x, g1.y, seed).dotC(f0.x, f1.y);
        const cBA = getPerlinVector2D(g1.x, g0.y, seed).dotC(f1.x, f0.y);
        const cBB = getPerlinVector2D(g1.x, g1.y, seed).dot(f1);
        const tx = fade(f0.x);
        const ty = fade(f0.y);
        const cA = lerp(cAA, cBA, tx);
        const cB = lerp(cAB, cBB, tx);
        const c = lerp(cA, cB, ty);
        return EMath.clamp(c * 0.5 + 0.5, 0, 1);
    }
    static perlinNoise3D(x: number, y: number, z: number, seed = 0) : number {
        const getPerlinVector3D = Noise.getPerlinVector3D;
        const lerp = EMath.lerp;
        const fade = Noise.fade;
        const g0 = new Vec3(x, y, z).mapSelf(Math.floor);
        const g1 = new Vec3(g0).addSelfC(1, 1, 1);
        const f0 = new Vec3(x, y, z).subSelf(g0);
        const f1 = new Vec3(x, y, z).subSelf(g1);
        const cAAA = getPerlinVector3D(g0.x, g0.y, g0.z, seed).dot(f0);
        const cAAB = getPerlinVector3D(g0.x, g0.y, g1.z, seed).dotC(f0.x, f0.y, f1.z);
        const cABA = getPerlinVector3D(g0.x, g1.y, g0.z, seed).dotC(f0.x, f1.y, f0.z);
        const cABB = getPerlinVector3D(g0.x, g1.y, g1.z, seed).dotC(f0.x, f1.y, f1.z);
        const cBAA = getPerlinVector3D(g1.x, g0.y, g0.z, seed).dotC(f1.x, f0.y, f0.z);
        const cBAB = getPerlinVector3D(g1.x, g0.y, g1.z, seed).dotC(f1.x, f0.y, f1.z);
        const cBBA = getPerlinVector3D(g1.x, g1.y, g0.z, seed).dotC(f1.x, f1.y, f0.z);
        const cBBB = getPerlinVector3D(g1.x, g1.y, g1.z, seed).dot(f1);
        const tx = fade(f0.x);
        const ty = fade(f0.y);
        const tz = fade(f0.z);
        const cAA = lerp(cAAA, cBAA, tx);
        const cAB = lerp(cAAB, cBAB, tx);
        const cBA = lerp(cABA, cBBA, tx);
        const cBB = lerp(cABB, cBBB, tx);
        const cA = lerp(cAA, cBA, ty);
        const cB = lerp(cAB, cBB, ty);
        const c = lerp(cA, cB, tz);
        return EMath.clamp(c * 0.5 + 0.5, 0, 1);
    }
    static voronoiNoise2D(x: number, y: number, seed = 0, t = 1) {
        let p = new Vec2(x, y);
        const g0 = p.map(Math.floor);
        let data = {
            pointDistance: Infinity,
            value: 0,
            gridPos: Vec2.zero(),
        };
        for(let xoff=-1;xoff<=1;xoff++) {
            for(let yoff=-1;yoff<=1;yoff++) {
                const gridPos = g0.addC(xoff, yoff);
                const pointPos = Noise.getVoronoiGridPosition2D(gridPos.x, gridPos.y, seed, t);
                const dist = p.dist(pointPos);
                if(dist<data.pointDistance) {
                    data.gridPos = gridPos;
                    data.pointDistance = dist;
                    data.value = Noise.getVoronoiGridValue2D(gridPos.x, gridPos.y, seed);
                }
            }
        }
        return data;
    }
    static voronoiNoise3D(x: number, y: number, z: number, seed = 0, t = 1) {
        let p = new Vec3(x, y, z);
        const g0 = p.map(Math.floor);
        let data = {
            pointDistance: Infinity,
            value: 0,
            gridPos: Vec3.zero(),
        };
        for(let xoff=-1;xoff<=1;xoff++) {
            for(let yoff=-1;yoff<=1;yoff++) {
                for(let zoff=-1;zoff<=1;zoff++) {
                    const gridPos = g0.addC(xoff, yoff, zoff);
                    const pointPos = Noise.getVoronoiGridPosition3D(gridPos.x, gridPos.y, gridPos.z, seed, t);
                    const dist = p.dist(pointPos);
                    if(dist<data.pointDistance) {
                        data.gridPos = gridPos;
                        data.pointDistance = dist;
                        data.value = Noise.getVoronoiGridValue3D(gridPos.x, gridPos.y, gridPos.z, seed);
                    }
                }
            }
        }
        return data;
    }
}


//////////////////////
//  CAMERA CLASSES  //
//////////////////////
export class Camera3D {
    private _fovY!: number;
    get fovY() {
        return this._fovY;
    }
    set fovY(n: number) {
        this._fovY = n;
        this._outdatedPerspectiveMatrix = true;
    }

    private _aspect!: number;
    get aspect() {
        return this._aspect;
    }
    set aspect(n: number) {
        this._aspect = n;
        this._outdatedPerspectiveMatrix = true;
    }

    private _near!: number;
    get near() {
        return this._near;
    }
    set near(n: number) {
        this._near = n;
        this._outdatedPerspectiveMatrix = true;
    }

    private _far!: number;
    get far() {
        return this._far;
    }
    set far(n: number) {
        this._far = n;
        this._outdatedPerspectiveMatrix = true;
    }

    private _position!: Vec3;
    get position() {
        return this._position;
    }
    set position(v: Vec3) {
        this._position = v;
        v.onMutate = () => {
            this._outdatedTranslationMatrix = true;
            this._outdatedViewMatrix = true;
        };
        v.onMutate();
    }

    private _worldScale = 1;
    get worldScale() {
        return this._worldScale;
    }
    set worldScale(n: number) {
        this._worldScale = n;
        this._outdatedTranslationMatrix = true;
        this._outdatedViewMatrix = true;
    }

    private _rotation!: Vec3;
    get rotation() {
        return this._rotation;
    }
    set rotation(v: Vec3) {
        this._rotation = v;
        v.onMutate = () => {
            this._outdatedForward = true;
            this._outdatedRight = true;
            this._outdatedUp = true;
            this._outdatedForwardFlat = true;
            this._outdatedRotationMatrix = true;
            this._outdatedViewMatrix = true;
        };
        v.onMutate();
    }

    private _forward = Vec3.zero();
    private _outdatedForward?: boolean = true;
    get forward() {
        if(this._outdatedForward) {
            this._forward = Vec3.zAxis().negSelf().rotXYZSelf(this._rotation);
            delete this._outdatedForward;
        }
        return this._forward;
    }

    private _right = Vec3.zero();
    private _outdatedRight?: boolean = true;
    get right() {
        if(this._outdatedRight) {
            this._right = Vec3.xAxis().rotXYZSelf(this._rotation);
            delete this._outdatedRight;
        }
        return this._right;
    }

    private _up = Vec3.zero();
    private _outdatedUp?: boolean = true;
    get up() {
        if(this._outdatedUp) {
            this._up = Vec3.yAxis().rotXYZSelf(this._rotation);
            delete this._outdatedUp;
        }
        return this._up;
    }

    private _forwardFlat = Vec3.zero();
    private _outdatedForwardFlat?: boolean = true;
    get forwardFlat() {
        if(this._outdatedForwardFlat) {
            this._forwardFlat = Vec3.zAxis().negSelf().rotYSelf(this._rotation.y);
            delete this._outdatedForwardFlat;
        }
        return this._forwardFlat;
    }

    private _perspectiveMatrix: number[] = [];
    private _outdatedPerspectiveMatrix?: boolean = true;
    get perspectiveMatrix() {
        if(this._outdatedPerspectiveMatrix) {
            this._perspectiveMatrix = Mat4.perspective(this._fovY, this._aspect, this._near, this._far);
            delete this._outdatedPerspectiveMatrix;
            this.perspectiveMatrixChangeEvent.fire(this._perspectiveMatrix);
        }
        return this._perspectiveMatrix;
    }

    private _translationMatrix: number[] = [];
    private _outdatedTranslationMatrix?: boolean = true;
    get translationMatrix() {
        if(this._outdatedTranslationMatrix) {
            this._translationMatrix = Mat4.translate(-this._position.x * this._worldScale, -this._position.y * this._worldScale, -this._position.z * this._worldScale);
            delete this._outdatedTranslationMatrix;
            this.translationMatrixChangeEvent.fire(this._viewMatrix);
        }
        return this._translationMatrix;
    }

    private _rotationMatrix: number[] = [];
    private _outdatedRotationMatrix?: boolean = true;
    get rotationMatrix() {
        if(this._outdatedRotationMatrix) {
            this._rotationMatrix = Mat4.multiply(
                Mat4.rotateZ(-this._rotation.z),
                Mat4.multiply(
                    Mat4.rotateX(-this._rotation.x),
                    Mat4.rotateY(-this._rotation.y),
                )
            );
            delete this._outdatedRotationMatrix;
            this.rotationMatrixChangeEvent.fire(this._viewMatrix);
        }
        return this._rotationMatrix;
    }

    private _viewMatrix: number[] = [];
    private _outdatedViewMatrix?: boolean = true;
    get viewMatrix() {
        if(this._outdatedViewMatrix) {
            this._viewMatrix = Mat4.multiply(this.rotationMatrix, this.translationMatrix);
            delete this._outdatedViewMatrix;
            this.viewMatrixChangeEvent.fire(this._viewMatrix);
        }
        return this._viewMatrix;
    }

    public perspectiveMatrixChangeEvent = new Signal({ onConnect: conn => conn.fire(this.perspectiveMatrix) });
    public viewMatrixChangeEvent = new Signal({ onConnect: conn => conn.fire(this.viewMatrix) });
    public rotationMatrixChangeEvent = new Signal({ onConnect: conn => conn.fire(this.rotationMatrix) });
    public translationMatrixChangeEvent = new Signal({ onConnect: conn => conn.fire(this.translationMatrix) });

    constructor(position?: Vec3, fovY?: number, aspect?: number, near?: number, far?: number) {
        this.position = position ?? Vec3.zero();
        this.fovY = fovY ?? 95/180*Math.PI;
        this.aspect = aspect ?? 1;
        this.near = near ?? 0.1;
        this.far = far ?? 10000;
        this.rotation = Vec3.zero();
    }

    lookAt(p: Vec3) {
        let f = this.position.look(p);
        this.rotation = new Vec3(f.pitch(), f.yaw(), 0);
    }
}


////////////////////
//  MESH CLASSES  //
////////////////////
export class Mesh3D {
    positions: number[] = [];
    texcoords: number[] = [];
    normals: number[] = [];
    constructor() {

    }
    clone(): Mesh3D {
        return new Mesh3D().append(this);
    }
    translate(x: number, y: number, z: number): this {
        for(let i=0; i<this.positions.length; i+=3) {
            this.positions[i]! += x;
            this.positions[i+1]! += y;
            this.positions[i+2]! += z;
        }
        return this;
    }
    scale(x: number, y: number, z: number): this {
        for(let i=0; i<this.positions.length; i+=3) {
            this.positions[i]! *= x;
            this.positions[i+1]! *= y;
            this.positions[i+2]! *= z;
        }
        return this;
    }
    rotate(ax: number, ay: number, az: number): this {
        for(let i=0; i<this.positions.length; i+=3) {
            let p = new Vec3(this.positions[i]!, this.positions[i+1]!, this.positions[i+2]!);
            p.rotXYZSelfC(ax, ay, az);
            this.positions[i] = p.x;
            this.positions[i+1] = p.y;
            this.positions[i+2] = p.z;
        }
        for(let i=0; i<this.normals.length; i+=3) {
            let p = new Vec3(this.normals[i]!, this.normals[i+1]!, this.normals[i+2]!);
            p.rotXYZSelfC(ax, ay, az);
            this.normals[i] = p.x;
            this.normals[i+1] = p.y;
            this.normals[i+2] = p.z;
        }
        return this;
    }
    rotateAround(x: number, y: number, z: number, ax: number, ay: number, az: number): this {
        for(let i=0; i<this.positions.length; i+=3) {
            let p = new Vec3(this.positions[i]! - x, this.positions[i+1]! - y, this.positions[i+2]! - z);
            p.rotXYZSelfC(ax, ay, az);
            this.positions[i] = p.x + x;
            this.positions[i+1] = p.y + y;
            this.positions[i+2] = p.z + z;
        }
        for(let i=0; i<this.normals.length; i+=3) {
            let p = new Vec3(this.normals[i]!, this.normals[i+1]!, this.normals[i+2]!);
            p.rotXYZSelfC(ax, ay, az);
            this.normals[i] = p.x;
            this.normals[i+1] = p.y;
            this.normals[i+2] = p.z;
        }
        return this;
    }
    append(...meshes: Mesh3D[]): this {
        for(const mesh of meshes) {
            this.positions.push(...mesh.positions);
            this.texcoords.push(...mesh.texcoords);
            this.normals.push(...mesh.normals);
        }
        return this;
    }
    pushPositions(arr: number[], x: number, y: number, z: number) {
        for(let i=0; i<this.positions.length; i+=3) {
            arr.push(this.positions[i]! + x);
            arr.push(this.positions[i+1]! + y);
            arr.push(this.positions[i+2]! + z);
        }
        return arr;
    }
    setNormals(x: number, y: number, z: number): this {
        for(let i=0; i<this.normals.length; i+=3) {
            this.normals[i] = x;
            this.normals[i+1] = y;
            this.normals[i+2] = z;
        }
        return this;
    }
    static trianglesToEdges(positions: number[]): number[] {
        let edges: number[] = [];
        for(let i=0; i<positions.length; i+=9) {
            edges.push(positions[i]!, positions[i+1]!, positions[i+2]!, positions[i+3]!, positions[i+4]!, positions[i+5]!);
            edges.push(positions[i+3]!, positions[i+4]!, positions[i+5]!, positions[i+6]!, positions[i+7]!, positions[i+8]!);
            edges.push(positions[i+6]!, positions[i+7]!, positions[i+8]!, positions[i]!, positions[i+1]!, positions[i+2]!);
        }
        return edges;
    }
    static triangleQuadsToEdges(positions: number[]): number[] {
        let edges: number[] = [];
        for(let i=0; i<positions.length; i+=18) {
            edges.push(positions[i]!, positions[i+1]!, positions[i+2]!, positions[i+3]!, positions[i+4]!, positions[i+5]!);
            edges.push(positions[i+3]!, positions[i+4]!, positions[i+5]!, positions[i+6]!, positions[i+7]!, positions[i+8]!);
            edges.push(positions[i+6]!, positions[i+7]!, positions[i+8]!, positions[i+9]!, positions[i+10]!, positions[i+11]!);
            edges.push(positions[i+9]!, positions[i+10]!, positions[i+11]!, positions[i+12]!, positions[i+13]!, positions[i+14]!);
        }
        return edges;
    }
}


///////////////////////
//  PHYSICS CLASSES  //
///////////////////////
export abstract class Physics2D {
    static getPointRectCollision(point: Vec2, center: Vec2, rightOffset: Vec2, upOffset: Vec2) {
        const right = rightOffset.norm();
        const up = upOffset.norm();
        const sizeX = rightOffset.length();
        const sizeY = upOffset.length();
        let diff = point.sub(center);
        let dx = diff.dot(right);
        let dy = diff.dot(up);
        let isInside = (Math.abs(dx) < sizeX && Math.abs(dy) < sizeY);
        if(isInside) {
            let d1 = Math.abs(point.sub(center.addScaled(up, sizeY)).dot(up));
            let d2 = Math.abs(point.sub(center.addScaled(up, -sizeY)).dot(up));
            let d3 = Math.abs(point.sub(center.addScaled(right, sizeX)).dot(right));
            let d4 = Math.abs(point.sub(center.addScaled(right, -sizeX)).dot(right));
            let minIndex = 0;
            let minDist = d1;
            if(d2 < minDist) { minDist = d2; minIndex = 1; }
            if(d3 < minDist) { minDist = d3; minIndex = 2; }
            if(d4 < minDist) { minDist = d4; minIndex = 3; }
            let edge: Vec2;
            let normal: Vec2;
            switch(minIndex) {
                case 0:
                    edge = center.addScaled(right, dx).addScaled(up, sizeY);
                    normal = up;
                    break;
                case 1:
                    edge = center.addScaled(right, dx).addScaled(up, -sizeY);
                    normal = up.neg();
                    break;
                case 2:
                    edge = center.addScaled(up, dy).addScaled(right, sizeX);
                    normal = right;
                    break;
                case 3:
                    edge = center.addScaled(up, dy).addScaled(right, -sizeX);
                    normal = right.neg();
                    break;
            }
            return {
                inside: true,
                collision: edge!,
                distance: -edge!.dist(point),
                normal: normal!,
            }
        } else {
            dx = EMath.clamp(dx, -sizeX, sizeX);
            dy = EMath.clamp(dy, -sizeY, sizeY);
            let edge = center.addScaled(right, dx).addScaled(up, dy);
            let dist = edge.dist(point);
            return {
                inside: false,
                collision: edge,
                distance: dist,
                normal: edge.look(point),
            };
        }
    }
    static getIsPointInsideRect(point: Vec2, center: Vec2, rightOffset: Vec2, upOffset: Vec2) {
        let diff = point.sub(center);
        let dx = diff.dot(rightOffset.norm());
        let dy = diff.dot(upOffset.norm());
        return (Math.abs(dx) < rightOffset.length() && Math.abs(dy) < upOffset.length());
    }
    static getCircleRectCollision(point: Vec2, radius: number, center: Vec2, rightOffset: Vec2, upOffset: Vec2) {
        let res = this.getPointRectCollision(point, center, rightOffset, upOffset);
        res.distance -= radius;
        if(res.distance <= 0) res.inside = true;
        return res;
    }
    static getCircleCircleCollision(pointA: Vec2, radiusA: number, pointB: Vec2, radiusB: number) {
        let dist = pointA.dist(pointB) - radiusA - radiusB;
        let normal = pointA.look(pointB);
        let collision = pointA.addScaled(normal, radiusA);
        return {
            inside: dist <= 0,
            collision,
            distance: dist,
            normal,
        };
    }
    static getCircleLineCollision(point: Vec2, radius: number, start: Vec2, end: Vec2) {
        let dir = start.look(end);
        let off = point.sub(start);
        let t = off.dot(dir);
        let maxT = end.dist(start);
        t = EMath.clamp(t, 0, maxT);
        let collision = start.addScaled(dir, t);
        let normal = collision.look(point);
        let dist = collision.dist(point) - radius;
        return {
            inside: dist <= 0,
            collision,
            distance: dist,
            normal,
        };
    }
    static resolveCircleCircleCollision(a: any, b: any, col: any) {
        if(!col.inside)
            return;
        const velAlongNormal = b.velocity.sub(a.velocity).dot(col.normal);
        const mi = (1/a.mass + 1/b.mass);
        if (velAlongNormal < 0) {
            const restitution = Math.min(a.restitution, b.restitution);
            const j = -(1+restitution) * velAlongNormal / mi;
            a.velocity.addScaledSelf(col.normal, j * -1 / a.mass);
            b.velocity.addScaledSelf(col.normal, j * 1 / b.mass);
        }
        const correction = col.normal.rescale(Math.max(-col.distance - 1e-4, 0) / mi * 0.8);
        a.position.addScaledSelf(correction, -1/a.mass);
        b.position.addScaledSelf(correction, 1/b.mass);
    }
    static resolveCircleAnchoredRectCollision(a: any, b: any, col: any) {
        if(!col.inside)
            return;
        const velAlongNormal = a.velocity.sub(b.velocity).dot(col.normal);
        if (velAlongNormal < 0) {
            const restitution = Math.min(a.restitution, b.restitution);
            const j = -(1+restitution) * velAlongNormal;
            a.velocity.addScaledSelf(col.normal, j);
        }
        a.position = col.collision.addScaled(col.normal, a.radius + 1e-6);
    }
}


export abstract class Physics3D {
    static raycastVoxels<T>(
        origin: Vec3,
        direction: Vec3,
        predicate: (pos:Vec3, normal:Vec3, dist:number) => T | undefined,
        maxIterations = 1000
    ): T | undefined {
        const invDirAbs = direction.rdivF(1).map(x => Math.abs(x));
        const sign = direction.map(x => x > 0 ? 1 : 0);
        const step = direction.map(x => x > 0 ? 1 : -1);
        let tMaxX = invDirAbs.x * (sign.x===0 ? (origin.x - Math.floor(origin.x)) : (Math.floor(origin.x) + 1 - origin.x));
        let tMaxY = invDirAbs.y * (sign.y===0 ? (origin.y - Math.floor(origin.y)) : (Math.floor(origin.y) + 1 - origin.y));
        let tMaxZ = invDirAbs.z * (sign.z===0 ? (origin.z - Math.floor(origin.z)) : (Math.floor(origin.z) + 1 - origin.z));
        let pos = new Vec3(origin).mapSelf(x => Math.floor(x));
        let distance = 0;
        let normal = Vec3.zero();
        for(let i=0; i<maxIterations; i++) {
            let res = predicate(pos, normal, distance);
            if(res !== undefined)
                return res;
            if(tMaxX < tMaxY) {
                if(tMaxX < tMaxZ) {
                    distance = tMaxX;
                    normal.setC(-step.x, 0, 0);
                    tMaxX += invDirAbs.x;
                    pos.x += step.x;
                } else {
                    distance = tMaxZ;
                    normal.setC(0, 0, -step.z);
                    tMaxZ += invDirAbs.z;
                    pos.z += step.z;
                }
            } else {
                if(tMaxY < tMaxZ) {
                    distance = tMaxY;
                    normal.setC(0, -step.y, 0);
                    tMaxY += invDirAbs.y;
                    pos.y += step.y;
                } else {
                    distance = tMaxZ;
                    normal.setC(0, 0, -step.z);
                    tMaxZ += invDirAbs.z;
                    pos.z += step.z;
                }
            }
        }
        return undefined;
    }
    static raycastBox(
        origin: Vec3,
        direction: Vec3,
        bounds: Vec3[]
    ) {
        const invDir = direction.rdivF(1);
        const sign = direction.map(x => x > 0 ? 1 : 0);
        const signFlip = direction.map(x => x > 0 ? 0 : 1);
        const stepFlip = direction.map(x => x > 0 ? -1 : 1);
        let tmin = (bounds[signFlip.x]!.x - origin.x) * invDir.x;
        let tmax = (bounds[sign.x]!.x - origin.x) * invDir.x;
        let normal = new Vec3(stepFlip.x,0,0);
        let tymin = (bounds[signFlip.y]!.y - origin.y) * invDir.y;
        let tymax = (bounds[sign.y]!.y - origin.y) * invDir.y;
        if((tmin > tymax) || (tymin > tmax)) return null;
        if(tymin > tmin) {
            tmin = tymin;
            normal = new Vec3(0,stepFlip.y,0);
        }
        if(tymax < tmax) tmax = tymax;
        let tzmin = (bounds[signFlip.z]!.z - origin.z) * invDir.z;
        let tzmax = (bounds[sign.z]!.z - origin.z) * invDir.z;
        if((tmin > tzmax) || (tzmin > tmax)) return null;
        if(tzmin > tmin) {
            tmin = tzmin;
            normal = new Vec3(0,0,stepFlip.z);
        }
        if(tzmax < tmax) tmax = tzmax;
        const distance = tmin < 0 ? 0 : tmin;
        return { normal, distance, intersection: origin.addScaled(direction, distance) };
    }
}


export class PhysicsLab2D {
    objectAddedEvent: Signal<[obj: any]> = new Signal();
    objects: any = [];
    constructor() {

    }
    createRect(position: Vec2, size: Vec2, rotation: number) {
        let rect: any = {position, size};
        rect.lastPosition = position.clone();
        rect.setRotation = (angle: number) => {
            rect.rotation = angle;
            rect.right = Vec2.xAxis().rotate(angle);
            rect.up = Vec2.yAxis().rotate(angle);
            rect.rightOffset = rect.right.mulF(rect.size.x/2);
            rect.upOffset = rect.up.mulF(rect.size.y/2);
            rect.rotationMatrix = Mat3.rotate(rect.rotation);
        }
        rect.setRotation(rotation);
        rect.rotationMatrix = Mat3.rotate(rect.rotation);
        rect.velocity = Vec2.zero();
        rect.restitution = 1;
        rect.gravity = 500;
        rect.hasCollision = true;
        rect.anchored = true;
        rect.type = "rect";
        rect.collision = null;
        this.objects.push(rect);
        this.objectAddedEvent.fire(rect);
        return rect;
    }
    createBall(position: Vec2, radius: number) {
        let ball: any = {position, radius};
        ball.lastPosition = position.clone();
        ball.velocity = Vec2.zero();
        ball.rotationMatrix = Mat3.new();
        ball.mass = 1;
        ball.restitution = 1;
        ball.gravity = 500;
        ball.hasCollision = true;
        ball.anchored = false;
        ball.type = "ball";
        ball.collision = null;
        this.objects.push(ball);
        this.objectAddedEvent.fire(ball);
        return ball;
    }
    update(dt: number) {
        for(let obj of this.objects) {
            obj.collision = null;
            if(!obj.anchored) continue;
            obj.velocity = obj.position.sub(obj.lastPosition).mulF(1/dt);
            obj.lastPosition.setC(obj.position.x, obj.position.y);
        }
        for(let i=0; i<3; i++) {
            for(let obj of this.objects) {
                if(obj.anchored) continue;
                if(i==0) {
                    obj.velocity.y -= obj.gravity * dt;
                    obj.position.addScaledSelf(obj.velocity, dt);
                }
                if(obj.type == "ball") {
                    for(let obj2 of this.objects) {
                        if(!obj2.hasCollision) continue;
                        if(obj2 == obj) continue;
                        if(obj2.type == "ball") {
                            let col = Physics2D.getCircleCircleCollision(obj.position, obj.radius, obj2.position, obj2.radius);
                            Physics2D.resolveCircleCircleCollision(obj, obj2, col);
                            if(col.inside) {
                                obj.collision = col;
                                obj2.collision = col;
                            }
                        } else {
                            let col = Physics2D.getCircleRectCollision(obj.position, obj.radius, obj2.position, obj2.rightOffset, obj2.upOffset);
                            Physics2D.resolveCircleAnchoredRectCollision(obj, obj2, col);
                            if(col.inside) {
                                obj.collision = col;
                                obj2.collision = col;
                            }
                        }
                    }
                }
            }
        }
    }
}


/////////////////////
//  EVENT CLASSES  //
/////////////////////
export class Signal<T extends any[]> {
    connections: Connection<T>[] = [];
    timeFired: number = -Number.MAX_VALUE;
    onConnect?: (conn: Connection<T>) => void;
    constructor({
        onConnect = undefined,
    }: {
        onConnect?: (conn: Connection<T>) => void,
    } = {}) {
        this.onConnect = onConnect;
    }
    connect(callback: (...args: T) => void) {
        const conn = new Connection<T>(this, callback);
        this.connections.push(conn);
        if(this.onConnect) {
            this.onConnect(conn);
        }
        return conn;
    }
    once(callback: (...args: T) => void) {
        const conn = this.connect((...args: T) => {
            callback(...args);
            conn.disconnect();
        });
        return conn;
    }
    async wait() {
        return new Promise<T>(res => {
            this.once((...args: T) => {
                res(args);
            });
        });
    }
    fire(...args: T) {
        this.timeFired = performance.now();
        for(const conn of [...this.connections]) {
            conn.fire(...args);
        }
    }
    getTimeSinceFired() {
        return performance.now() / 1000 - this.timeFired;
    }
}

export class Connection<T extends any[]> {
    groups: ConnectionGroup[] = [];
    constructor(public signal: Signal<T>, public callback: (...args: T) => void) {
        
    }
    disconnect() {
        this.signal.connections.splice(this.signal.connections.indexOf(this), 1);
        for(const group of this.groups) {
            group.connections.splice(group.connections.indexOf(this), 1);
        }
        this.groups = [];
    }
    fire(...args: T) {
        this.callback(...args);
    }
}

export class HtmlConnection {
    groups: ConnectionGroup[] = [];
    constructor(public el: EventTarget, public name: string, public callback: (e: any) => void) {
        this.el.addEventListener(this.name, this.callback);
    }
    disconnect() {
        this.el.removeEventListener(this.name, this.callback);
        for(const group of this.groups) {
            group.connections.splice(group.connections.indexOf(this), 1);
        }
        this.groups = [];
    }
}

export class ConnectionGroup {
    connections: (Connection<any> | HtmlConnection)[] = [];
    constructor() {

    }
    add(conn: Connection<any> | HtmlConnection) {
        this.connections.push(conn);
    }
    disconnectAll() {
        for(const conn of [...this.connections]) {
            conn.disconnect();
        }
        this.connections = [];
    }
}


/////////////////////////////
//  WEBGL2 SHADER CLASSES  //
/////////////////////////////
export class WGL2ComponentShader {
    wShader: WebGLShader;
    constructor(public gl: WebGL2RenderingContext, public type: "vertex" | "fragment", public source: string) {
        const wShader = gl.createShader(type == "vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
        if(wShader == null) {
            throw new Error("Failed to create shader");
        }
        this.wShader = wShader;
        gl.shaderSource(wShader, source);
        gl.compileShader(wShader)
        if(!gl.getShaderParameter(wShader, gl.COMPILE_STATUS)) {
            const log = gl.getShaderInfoLog(wShader);
            gl.deleteShader(wShader);
            throw new Error("Failed to compile shader: " + log);
        }
    }
    delete(): void {
        this.gl.deleteShader(this.wShader);
    }
}

export class WGL2ComponentProgram {
    wProgram: WebGLProgram;
    constructor(public gl: WebGL2RenderingContext, public cShaderV: WGL2ComponentShader, public cShaderF: WGL2ComponentShader) {
        const wProgram = gl.createProgram();
        if (!wProgram) {
            throw new Error("Failed to create program");
        }
        this.wProgram = wProgram;
        gl.attachShader(wProgram, cShaderV.wShader);
        gl.attachShader(wProgram, cShaderF.wShader);
        gl.linkProgram(wProgram);
        if(!gl.getProgramParameter(wProgram, gl.LINK_STATUS)) {
            const log = gl.getProgramInfoLog(wProgram);
            gl.deleteProgram(wProgram);
            throw new Error("Failed to link program: " + log);
        }
    }
    setActive(): void {
        this.gl.useProgram(this.wProgram);
    }
    delete(): void {
        this.gl.deleteProgram(this.wProgram);
    }
}

export type WGL2AttributeType = (
    "float" | "int" | "uint" | "vec2" | "vec3" | "vec4"
    | "ivec2" | "ivec3" | "ivec4" | "uvec2" | "uvec3" | "uvec4"
);

export type WGL2UniformType = (
    "float" | "int" | "uint" | "vec2" | "vec3"
    | "vec4" | "ivec2" | "ivec3" | "ivec4" | "uvec2"
    | "uvec3" | "uvec4" | "mat2" | "mat3" | "mat4"
);

export class WGL2ComponentBuffer {
    wType: GLenum;
    wDimensions: number;
    wBuffer: WebGLBuffer;
    constructor(public gl: WebGL2RenderingContext, type: WGL2AttributeType) {
        const buffer = gl.createBuffer();
        if(!buffer) {
            throw new Error("Failed to create buffer");
        }
        this.wBuffer = buffer;
        switch(type) {
            case "float": this.wType = gl.FLOAT; this.wDimensions = 1; break;
            case "vec2": this.wType = gl.FLOAT; this.wDimensions = 2; break;
            case "vec3": this.wType = gl.FLOAT; this.wDimensions = 3; break;
            case "vec4": this.wType = gl.FLOAT; this.wDimensions = 4; break;
            case "int": this.wType = gl.INT; this.wDimensions = 1; break;
            case "ivec2": this.wType = gl.INT; this.wDimensions = 2; break;
            case "ivec3": this.wType = gl.INT; this.wDimensions = 3; break;
            case "ivec4": this.wType = gl.INT; this.wDimensions = 4; break;
            case "uint": this.wType = gl.UNSIGNED_INT; this.wDimensions = 1; break;
            case "uvec2": this.wType = gl.UNSIGNED_INT; this.wDimensions = 2; break;
            case "uvec3": this.wType = gl.UNSIGNED_INT; this.wDimensions = 3; break;
            case "uvec4": this.wType = gl.UNSIGNED_INT; this.wDimensions = 4; break;
            default: throw new Error("Unsupported buffer type: " + type);
        }
    }
    setActive(): void {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.wBuffer);
    }
    delete(): void {
        this.gl.deleteBuffer(this.wBuffer);
    }
}

export class WGL2ComponentVao {
    wVao: WebGLVertexArrayObject;
    constructor(public gl: WebGL2RenderingContext) {
        this.wVao = gl.createVertexArray();
    }
    setActive(): void {
        this.gl.bindVertexArray(this.wVao);
    }
    enableBuffer(cBuffer: WGL2ComponentBuffer, wLocation: number): void {
        cBuffer.setActive();
        this.gl.enableVertexAttribArray(wLocation);
        if(cBuffer.wType == this.gl.FLOAT) {
            this.gl.vertexAttribPointer(wLocation, cBuffer.wDimensions, cBuffer.wType, false, 0, 0);
        } else {
            this.gl.vertexAttribIPointer(wLocation, cBuffer.wDimensions, cBuffer.wType, 0, 0);
        }
    }
    delete(): void {
        this.gl.deleteVertexArray(this.wVao);
    }
}

export class WGL2ComponentUniform {
    wLocation: WebGLUniformLocation;
    queuedValues: any[] | any | null = null;
    hasQueued = false;
    constructor(public gl: WebGL2RenderingContext, cProgram: WGL2ComponentProgram, name: string, public type: WGL2UniformType) {
        const wLocation = this.gl.getUniformLocation(cProgram.wProgram, name);
        if(wLocation === null) {
            throw new Error("Failed to get uniform location for " + name);
        }
        this.wLocation = wLocation;
    }
    setValues(values : any[] | any): void {
        const wLocation = this.wLocation
        const gl = this.gl;
        switch(this.type) {
            case "float": gl.uniform1f(wLocation, values); break;
            case "vec2": gl.uniform2fv(wLocation, values); break;
            case "vec3": gl.uniform3fv(wLocation, values); break;
            case "vec4": gl.uniform4fv(wLocation, values); break;
            case "int": gl.uniform1i(wLocation, values); break;
            case "ivec2": gl.uniform2iv(wLocation, values); break;
            case "ivec3": gl.uniform3iv(wLocation, values); break;
            case "ivec4": gl.uniform4iv(wLocation, values); break;
            case "uint": gl.uniform1ui(wLocation, values); break;
            case "uvec2": gl.uniform2uiv(wLocation, values); break;
            case "uvec3": gl.uniform3uiv(wLocation, values); break;
            case "uvec4": gl.uniform4uiv(wLocation, values); break;
            case "mat2": gl.uniformMatrix2fv(wLocation, false, values); break;
            case "mat3": gl.uniformMatrix3fv(wLocation, false, values); break;
            case "mat4": gl.uniformMatrix4fv(wLocation, false, values); break;
            default: throw new Error("Unsupported uniform type: " + this.type);
        }
    }
    queueValues(values: any[] | any): void {
        this.hasQueued = true;
        this.queuedValues = values;
    }
    update() {
        if(!this.hasQueued) return;
        this.hasQueued = false;
        this.setValues(this.queuedValues);
        this.queuedValues = null;
    }
}

export class WGL2Attribute {
    wLocation: number;
    constructor(public gl: WebGL2RenderingContext, public wProgram: WebGLProgram, public name: string, public type: WGL2AttributeType) {
        this.wLocation = gl.getAttribLocation(wProgram, name);
    }
}

export class WGL2Texture2D {
    wTexture: WebGLTexture;
    uniform: WGL2ComponentUniform;
    constructor(public shader: WGL2Shader, public name: string, public slot: number) {
        this.wTexture = shader.gl.createTexture();
        this.setActive();
        this.uniform = shader.createUniform(name, "int");
        this.uniform.setValues(this.slot);
    }
    setActive(): void {
        const gl = this.shader.gl;
        gl.activeTexture(gl.TEXTURE0 + this.slot);
        gl.bindTexture(gl.TEXTURE_2D, this.wTexture);
    }
    setInterpolation(isEnabled: boolean = true) {
        const gl = this.shader.gl;
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, isEnabled ? gl.LINEAR : gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, isEnabled ? gl.LINEAR : gl.NEAREST);
    }
    setRepeat(isEnabled: boolean = true) {
        const gl = this.shader.gl;
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, isEnabled ? gl.REPEAT : gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, isEnabled ? gl.REPEAT : gl.CLAMP_TO_EDGE);
    }
    setData(width: number, height: number, data: ArrayBufferView | null = null): void {
        const gl = this.shader.gl;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    }
    setImage(image: TexImageSource): void {
        const gl = this.shader.gl;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }
    generateMipmap(): void {
        const gl = this.shader.gl;
        gl.generateMipmap(gl.TEXTURE_2D);
    }
    delete(): void {
        const gl = this.shader.gl;
        gl.deleteTexture(this.wTexture);
    }
}

export class WGL2Texture3D {
    wTexture: WebGLTexture;
    uniform: WGL2ComponentUniform;
    constructor(public shader: WGL2Shader, public name: string, public slot: number) {
        this.wTexture = shader.gl.createTexture();
        this.setActive();
        this.uniform = shader.createUniform(name, "int");
        this.uniform.setValues(this.slot);
    }
    setActive(): void {
        const gl = this.shader.gl;
        gl.activeTexture(gl.TEXTURE0 + this.slot);
        gl.bindTexture(gl.TEXTURE_3D, this.wTexture);
    }
    setInterpolation(isEnabled: boolean = true) {
        const gl = this.shader.gl;
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, isEnabled ? gl.LINEAR : gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, isEnabled ? gl.LINEAR : gl.NEAREST);
    }
    setRepeat(isEnabled: boolean = true) {
        const gl = this.shader.gl;
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, isEnabled ? gl.REPEAT : gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, isEnabled ? gl.REPEAT : gl.CLAMP_TO_EDGE);
    }
    setData(width: number, height: number, depth: number, data: ArrayBufferView | null = null): void {
        const gl = this.shader.gl;
        gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGBA, width, height, depth, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    }
    generateMipmap(): void {
        const gl = this.shader.gl;
        gl.generateMipmap(gl.TEXTURE_3D);
    }
    delete(): void {
        const gl = this.shader.gl;
        gl.deleteTexture(this.wTexture);
    }
}

export class WGL2Object {
    gl: WebGL2RenderingContext;
    cVao: WGL2ComponentVao;
    cBufferByName: {[key:string]: WGL2ComponentBuffer} = {};
    vertexCount: number = 0;
    constructor(public shader: WGL2Shader) {
        this.gl = shader.gl;
        this.cVao = new WGL2ComponentVao(shader.gl);
        this.cVao.setActive();
        for(const attribute of shader.attributes) {
            const cBuf = new WGL2ComponentBuffer(shader.gl, attribute.type);
            cBuf.setActive();
            this.cVao.enableBuffer(cBuf, attribute.wLocation);
            this.cBufferByName[attribute.name] = cBuf;
        }
    }
    setData(attributeName: string, values: Float32Array, usage: GLenum = this.gl.STATIC_DRAW) {
        const cBuf = this.cBufferByName[attributeName];
        if(cBuf == null) {
            throw new Error("Could not find attribute with name: " + attributeName);
        }
        cBuf.setActive();
        this.gl.bufferData(this.gl.ARRAY_BUFFER, values, usage);
        this.vertexCount = values.length / cBuf.wDimensions;
    }
    drawTriangles() {
        this.cVao.setActive();
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);
    }
    drawLines() {
        this.cVao.setActive();
        this.gl.drawArrays(this.gl.LINES, 0, this.vertexCount);
    }
    drawPoints() {
        this.cVao.setActive();
        this.gl.drawArrays(this.gl.POINTS, 0, this.vertexCount);
    }
}

export class WGL2Shader {
    cProgram: WGL2ComponentProgram;
    attributes: WGL2Attribute[] = [];
    cUniforms: WGL2ComponentUniform[] = []
    cUniformByName: {[key:string]:WGL2ComponentUniform} = {};
    constructor(public gl: WebGL2RenderingContext, vSource: string, fSource: string) {
        this.cProgram = new WGL2ComponentProgram(
            gl, new WGL2ComponentShader(gl, "vertex", vSource),
            new WGL2ComponentShader(gl, "fragment", fSource),
        );
        this.cProgram.setActive();
    }
    addAttribute(name: string, type: WGL2AttributeType) {
        const att = new WGL2Attribute(this.gl, this.cProgram.wProgram, name, type);
        this.attributes.push(att);
        return att;
    }
    createUniform(name: string, type: WGL2UniformType) {
        const uniform = new WGL2ComponentUniform(this.gl, this.cProgram, name, type);
        this.cUniforms.push(uniform);
        this.cUniformByName[name] = uniform;
        return uniform;
    }
    getUniform(name: string) {
        return this.cUniformByName[name];
    }
    createObject() {
        const obj = new WGL2Object(this);
        return obj;
    }
    createTexture2D(name: string, slot: number) {
        const texture = new WGL2Texture2D(this, name, slot);
        return texture;
    }
    createTexture3D(name: string, slot: number) {
        const texture = new WGL2Texture3D(this, name, slot);
        return texture;
    }
    setActive() {
        this.cProgram.setActive();
    }
}


///////////////////////////
//  TEXTURE ATLAS CLASS  //
///////////////////////////
export type AtlasImage = {x: number, y: number, w: number, h: number, img: HTMLImageElement, name: string};

export class TextureAtlas {
    width: number;
    height: number;
    constructor(public image: HTMLImageElement, public bounds: {[name:string]: AtlasImage}) {
        this.width = image.naturalWidth;
        this.height = image.naturalHeight;
    }
    static async fromUrls(args: [name:string, url:string][], padding = 0) {
        let images: AtlasImage[] = [];
        let promises: Promise<void>[] = [];
        let atlasSize = 0;
        for(let [name, url] of args) {
            promises.push(new Promise<void>(async res => {
                let img = new Image();
                img.onload = () => {
                    let data: AtlasImage = {img, x:0, y:0, w:img.naturalWidth+2*padding, h:img.naturalHeight+2*padding, name};
                    let isColliding = true;
                    for(let x=0;x<=atlasSize-data.w;x++) {
                        for(let y=0;y<=atlasSize-data.h;y++) {
                            isColliding = false;
                            for(let other of images) {
                                if(x + data.w > other.x && y + data.h > other.y && x < other.x + other.w && y < other.y + other.h) {
                                    isColliding = true;
                                    break;
                                }
                            }
                            if(!isColliding) {
                                data.x = x;
                                data.y = y;
                                break;
                            }
                        }
                        if(!isColliding) break;
                    }
                    if(isColliding) {
                        data.x = atlasSize;
                        data.y = 0;
                        atlasSize = data.x + data.w;
                    }
                    images.push(data);
                    res();
                }
                img.src = url;
            }));
        }
        await Promise.all(promises);
        let canvas = document.createElement("canvas");
        canvas.width = atlasSize;
        canvas.height = atlasSize;
        let ctx = canvas.getContext("2d")!;
        let bounds: {[name:string]: AtlasImage} = {};
        for(let img of images) {
            ctx.drawImage(img.img, img.x + padding, img.y + padding);
            if(padding !== 0) {
                ctx.drawImage(img.img, 0, 0, 1, img.h-2*padding, img.x, img.y + padding, padding, img.h-2*padding); // left
                ctx.drawImage(img.img, img.w-2*padding-1, 0, 1, img.h-2*padding, img.x+img.w-padding, img.y + padding, padding, img.h-2*padding); // right
                ctx.drawImage(img.img, 0, 0, img.w-2*padding, 1, img.x + padding, img.y, img.w-2*padding, padding); // top
                ctx.drawImage(img.img, 0, img.h-2*padding-1, img.w-2*padding, 1, img.x + padding, img.y+img.h-padding, img.w-2*padding, padding); // bottom
                ctx.drawImage(img.img, 0, 0, 2, 2, img.x, img.y, padding, padding); // top-left
                ctx.drawImage(img.img, img.w-2*padding-2, 0, 2, 2, img.x+img.w-padding, img.y, padding, padding); // top-right
                ctx.drawImage(img.img, 0, img.h-2*padding-2, 2, 2, img.x, img.y+img.h-padding, padding, padding); // bottom-left
                ctx.drawImage(img.img, img.w-2*padding-2, img.h-2*padding-2, 2, 2, img.x+img.w-padding, img.y+img.h-padding, padding, padding); // bottom-right
            }
            img.x = (img.x + padding) / atlasSize;
            img.y = (img.y + padding) / atlasSize;
            img.w = (img.w - 2*padding) / atlasSize;
            img.h = (img.h - 2*padding) / atlasSize;
            bounds[img.name] = img;
        }
        let url = canvas.toDataURL();
        const atlasImage = await new Promise<HTMLImageElement>(res => {
            let img = new Image();
            img.onload = () => {
                res(img);
            }
            img.src = url;
        });
        return new TextureAtlas(atlasImage, bounds);
    }
}


///////////////////
//  COLOR CLASS  //
///////////////////
/**
 * Represents a color and a transparency value. Implements lazy conversion between RGB and HSV space.
*/
export class Color {
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

    clone(): Color {
        return new Color(this);
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
        if(this._outdatedRgb)
            this._updateRgb();
        this._r = value;
        this._outdatedHsv = true;
    }
    get r() {
        if(this._outdatedRgb)
            this._updateRgb();
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
        if(this._outdatedRgb)
            this._updateRgb();
        this._g = value;
        this._outdatedHsv = true;
    }
    get g() {
        if(this._outdatedRgb)
            this._updateRgb();
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
        if(this._outdatedRgb)
            this._updateRgb();
        this._b = value;
        this._outdatedHsv = true;
    }
    get b() {
        if(this._outdatedRgb)
            this._updateRgb();
        return this._b;
    }

    _updateRgb() {
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
        if(this._outdatedHsv)
            this._updateHsv();
        this._hue = value;
        this._outdatedRgb = true;
    }
    get hue() {
        if(this._outdatedHsv)
            this._updateHsv();
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
        if(this._outdatedHsv)
            this._updateHsv();
        this._sat = value;
        this._outdatedRgb = true;
    }
    get sat() {
        if(this._outdatedHsv)
            this._updateHsv();
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
        if(this._outdatedHsv)
            this._updateHsv();
        this._val = value;
        this._outdatedRgb = true;
    }
    get val() {
        if(this._outdatedHsv)
            this._updateHsv();
        return this._val;
    }

    _updateHsv() {
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
        return (
            this.r == other.r
            && this.g == other.g
            && this.b == other.b
            && this.a == other.a
        );
    }
    isClose(other: Color, e = 1e-6) {
        return (
            EMath.isClose(this.r, other.r, e)
            && EMath.isClose(this.g, other.g, e)
            && EMath.isClose(this.b, other.b, e)
            && EMath.isClose(this.a, other.a, e)
        );
    }
    strictEqualsRgb(other: Color) {
        return (
            this.r == other.r
            && this.g == other.g
            && this.b == other.b
        );
    }
    isCloseRgb(other: Color, e = 1e-6) {
        return (
            EMath.isClose(this.r, other.r, e)
            && EMath.isClose(this.g, other.g, e)
            && EMath.isClose(this.b, other.b, e)
        );
    }
    lerpRgba(other: Color, t: number): Color {
        return this.clone().lerpRgbaSelf(other, t);
    }
    lerpRgbaSelf(other: Color, t: number): this {
        this.r = EMath.lerp(this.r, other.r, t);
        this.g = EMath.lerp(this.g, other.g, t);
        this.b = EMath.lerp(this.b, other.b, t);
        this.a = EMath.lerp(this.a, other.a, t);
        return this;
    }
    lerpHsva(other: Color, t: number): Color {
        return this.clone().lerpHsvaSelf(other, t);
    }
    lerpHsvaSelf(other: Color, t: number): this {
        this.hue = EMath.lerp(this.hue, other.hue, t);
        this.sat = EMath.lerp(this.sat, other.sat, t);
        this.val = EMath.lerp(this.val, other.val, t);
        this.a = EMath.lerp(this.a, other.a, t);
        return this;
    }
    getIsForegroundWhite(threshold = 0.42) {
        let {r, g, b} = this;
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


///////////////////
//  ARRAY UTILS  //
///////////////////
export abstract class ArrayUtils {
    static shuffleSelf<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i]!, array[j]!] = [array[j]!, array[i]!];
        }
        return array;
    }
}


/////////////////////
//  INPUT CLASSES  //
/////////////////////
export abstract class Keypresses {
    static keyPressed: {[key:string]: any} = {};
    static pressedKeys: Set<string> = new Set();
    static keyDownEvent = new Signal<[keyName:string]>();
    static keyUpEvent = new Signal<[keyName:string]>();
}

export function keydown(key: string) {
    Keypresses.keyPressed[key] = true;
    Keypresses.pressedKeys.add(key);
    Keypresses.keyDownEvent.fire(key);
}

export function keyup(key: string) {
    delete Keypresses.keyPressed[key];
    Keypresses.pressedKeys.delete(key);
    Keypresses.keyUpEvent.fire(key);
}

window.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();
    keydown(key);
});

window.addEventListener("keyup", e => {
    const key = e.key.toLowerCase();
    keyup(key);
});

window.addEventListener("mousedown", e => {
    if(e.button === 0) {
        keydown("lmb");
    } else if(e.button === 1) {
        keydown("mmb");
    } else if(e.button === 2) {
        keydown("rmb");
    }
});

window.addEventListener("mouseup", e => {
    if(e.button === 0) {
        keyup("lmb");
    } else if(e.button === 1) {
        keyup("mmb");
    } else if(e.button === 2) {
        keyup("rmb");
    }
});

export class PointerLock {
    connections = new ConnectionGroup();
    pointerLockChangeEvent: Signal<[isLocked: boolean]> = new Signal();
    lockedMouseMoveEvent: Signal<[dx: number, dy: number]> = new Signal();
    isEnabled = false;
    constructor() {
        this.connections.add(new HtmlConnection(window, "mousedown", (e: MouseEvent) => {
            if(this.isEnabled && document.pointerLockElement == null) {
                document.body.requestPointerLock();
            }
        }));
        this.connections.add(new HtmlConnection(window, "mousemove", (e: MouseEvent) => {
            if(document.pointerLockElement != null)
                this.lockedMouseMoveEvent.fire(e.movementX, e.movementY);
        }));
        this.connections.add(new HtmlConnection(document, "pointerlockchange", () => {
            this.pointerLockChangeEvent.fire(document.pointerLockElement != null);
        }));
    }
    lock(): this {
        this.isEnabled = true;
        document.body.requestPointerLock();
        return this;
    }
    unlock(): this {
        this.isEnabled = false;
        document.exitPointerLock();
        return this;
    }
    remove() {
        this.connections.disconnectAll();
    }
}


////////////////////////
//  OBSERVER CLASSES  //
////////////////////////
export class WindowResizeObserver {
    resizeEvent: Signal<[w: number, h: number]> = new Signal({
        onConnect: conn => conn.fire(window.innerWidth, window.innerHeight),
    });
    connections = new ConnectionGroup();
    constructor() {
        this.connections.add(new HtmlConnection(window, "resize", () => {
            this.resizeEvent.fire(window.innerWidth, window.innerHeight);
        }));
    }
    remove() {
        this.connections.disconnectAll();
    }
}


/////////////////////////
//  RENDER LOOP CLASS  //
/////////////////////////
export class RenderLoop {
    renderSteppedEvent: Signal<[dt: number]> = new Signal();
    runIndex = 0;
    isRunning = false;
    constructor(public callback: (dt: number) => void) {
        
    }
    stop() {
        if(!this.isRunning)
            return this;
        this.isRunning = false;
        this.runIndex++;
        return this;
    }
    start() {
        if(this.isRunning)
            return this;
        this.isRunning = true;
        let ri = this.runIndex;
        let frameTime = performance.now()/1000;
        const render = () => {
            if(this.runIndex != ri) {
                return;
            }
            let now = performance.now()/1000;
            let dt = now - frameTime;
            frameTime = now;
            this.renderSteppedEvent.fire(dt);
            this.callback(dt);
            requestAnimationFrame(render);
        }
        render();
        return this;
    }
}


/////////////////////
//  ICON GENERATOR //
/////////////////////
export class IconPolygon2D {
    positions: number[] = [];
    constructor() {

    }
    clone(): IconPolygon2D {
        let poly = new IconPolygon2D();
        poly.positions.push(...this.positions);
        return poly;
    }
    getCenterOfMass(): Vec2 {
        let c = Vec2.zero();
        for(let i=0; i<this.positions.length; i+=2)
            c.addSelfC(this.positions[i]!, this.positions[i+1]!);
        if(this.positions.length > 0) c.divSelfF(this.positions.length/2);
        return c;
    }
    rotateSelf(a: number): this {
        for(let i=0; i<this.positions.length; i+=2) {
            let v = new Vec2(this.positions[i]!, this.positions[i+1]!).rotateSelf(a);
            this.positions[i] = v.x;
            this.positions[i+1] = v.y;
        }
        return this;
    }
    scaleSelf(v: Vec2): this {
        return this.scaleSelfC(v.x, v.y);
    }
    scaleSelfC(x: number, y: number): this {
        for(let i=0; i<this.positions.length; i+=2) {
            this.positions[i]! *= x;
            this.positions[i+1]! *= y;
        }
        return this;
    }
    translateSelf(v: Vec2): this {
        return this.translateSelfC(v.x, v.y);
    }
    translateSelfC(x: number, y: number): this {
        for(let i=0; i<this.positions.length; i+=2) {
            this.positions[i]! += x;
            this.positions[i+1]! += y;
        }
        return this;
    }
    getVertex(index: number): Vec2 {
        const j = EMath.pmod(index, Math.floor(this.positions.length/2))*2;
        return new Vec2(this.positions[j]!, this.positions[j+1]!);
    }
    bevelSelf(indices: Set<number> | number[], amount: number): this {
        if(!(indices instanceof Set))
            indices = new Set(indices);
        let newPositions: number[] = [];
        let len = Math.floor(this.positions.length/2);
        for(let index=0; index<len; index++) {
            if(!indices.has(index))
                continue;
            let vA = this.getVertex(index-1);
            let vB = this.getVertex(index);
            let vC = this.getVertex(index+1);
            let tMaxA = vA.dist(vB);
            let tMaxC = vC.dist(vB);
            if(indices.has(index-1)) tMaxA /= 2;
            if(indices.has(index+1)) tMaxC /= 2;
            let b1 = vB.addScaled(vB.look(vA), EMath.clamp(amount, 0, tMaxA));
            let b2 = vB.addScaled(vB.look(vC), EMath.clamp(amount, 0, tMaxC));
            newPositions.push(b1.x, b1.y, b2.x, b2.y);
        }
        this.positions = newPositions;
        return this;
    }
    bevelAllSelf(amount: number) {
        let newPositions: number[] = [];
        let len = Math.floor(this.positions.length/2);
        for(let index=0; index<len; index++) {
            let vA = this.getVertex(index-1);
            let vB = this.getVertex(index);
            let vC = this.getVertex(index+1);
            let tMaxA = vA.dist(vB) / 2;
            let tMaxC = vC.dist(vB) / 2;
            let b1 = vB.addScaled(vB.look(vA), EMath.clamp(amount, 0, tMaxA));
            let b2 = vB.addScaled(vB.look(vC), EMath.clamp(amount, 0, tMaxC));
            newPositions.push(b1.x, b1.y, b2.x, b2.y);
        }
        this.positions = newPositions;
        return this;
    }
    drawFill(ctx: CanvasRenderingContext2D, color: string): this {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(this.positions[0]! * ctx.canvas.width, this.positions[1]! * ctx.canvas.height);
        for(let i=2; i<this.positions.length; i+=2) {
            ctx.lineTo(this.positions[i]! * ctx.canvas.width, this.positions[i+1]! * ctx.canvas.height);
        }
        ctx.closePath();
        ctx.fill();
        return this;
    }
    static createPositions(positions: number[]): IconPolygon2D {
        const poly = new IconPolygon2D();
        poly.positions = positions;
        return poly;
    }
    static rect(x: number, y: number, w: number, h: number): IconPolygon2D {
        const x0 = x - w/2;
        const x1 = x + w/2;
        const y0 = y - h/2;
        const y1 = y + h/2;
        return this.createPositions([x0,y0, x1,y0, x1,y1, x0,y1]);
    }
    static circle(x: number, y: number, r: number, arc: number = Math.PI * 2, step = Math.PI / 8): IconPolygon2D {
        arc = EMath.clamp(arc, 0, Math.PI * 2);
        let positions: number[] = [];
        for(let i=0; i<arc; i+=step) {
            positions.push(Math.cos(i) * r + x, Math.sin(i) * r + y);
        }
        positions.push(Math.cos(arc) * r + x, Math.sin(arc) * r + y);
        return this.createPositions(positions);
    }
    static circleFan(x: number, y: number, r: number, arc: number = Math.PI * 2, step = Math.PI / 8): IconPolygon2D {
        const poly = this.circle(x, y, r, arc, step);
        poly.positions.splice(0, 0, x, y);
        return poly;
    }
}

export class IconGenerationContext2D {
    layers: {[key: string]: CanvasRenderingContext2D} = {};
    selectedLayer!: CanvasRenderingContext2D;
    constructor(public ctx: CanvasRenderingContext2D) {
        this.setLayer("0");
    }
    map(callback: (x: number, y: number, getColor: (x: number, y: number) => Color) => Color): this {
        const ctx = this.selectedLayer;
        let data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        let newData = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
        const getColor = (x: number, y: number) => {
            const i = (y * ctx.canvas.width + x) * 4;
            if(i < 0 || i >= data.data.length)
                return new Color(0, 0, 0, 0);
            return new Color(data.data[i]!, data.data[i+1]!, data.data[i+2]!, data.data[i+3]!/255);
        }
        for(let y=0; y<ctx.canvas.height; y++) {
            for(let x=0; x<ctx.canvas.width; x++) {
                const i = (y * ctx.canvas.width + x) * 4;
                let color = callback(x, y, getColor);
                newData.data[i] = Math.floor(color.r);
                newData.data[i+1] = Math.floor(color.g);
                newData.data[i+2] = Math.floor(color.b);
                newData.data[i+3] = Math.floor(color.a*255);
            }
        }
        ctx.putImageData(newData, 0, 0);
        return this;
    }
    brightnessToOpacity(invert = false): this {
        return this.map((x, y, getColor) => {
            let color = getColor(x, y);
            let t = color.a;
            color.a = color.val / 100;
            if(invert) color.a = 1 - color.a;
            color.a *= t;
            let v = invert ? 0 : 255;
            color.r = v;
            color.g = v;
            color.b = v;
            return color;
        });
    }
    mirrorX(): this {
        return this.map((x, y, getColor) => getColor(this.ctx.canvas.width - 1 - x, y));
    }
    mirrorY(): this {
        return this.map((x, y, getColor) => getColor(x, this.ctx.canvas.height - 1 - y));
    }
    setLayer(name: string): this {
        let layer = this.layers[name];
        if(layer == null) {
            layer = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
            layer.canvas.width = this.ctx.canvas.width;
            layer.canvas.height = this.ctx.canvas.height;
            this.layers[name] = layer;
        }
        this.selectedLayer = layer;
        return this;
    }
    flatten(): this {
        const ctx = this.ctx;
        let flattenedData = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
        let layerDatas = [];
        for(const name in this.layers) {
            let layer = this.layers[name]!;
            let data = layer.getImageData(0, 0, layer.canvas.width, layer.canvas.height);
            layerDatas.push(data);
        }
        for(let y=0; y<ctx.canvas.height; y++) {
            for(let x=0; x<ctx.canvas.width; x++) {
                const i = (y * ctx.canvas.width + x) * 4;
                for(let data of layerDatas) {
                    let srcA = data.data[i+3]!/255;
                    let dstA = flattenedData.data[i+3]!/255;
                    let newA = srcA + dstA * (1 - srcA);
                    if(newA > 0) {
                        flattenedData.data[i] = (data.data[i]! * srcA + flattenedData.data[i]! * dstA * (1 - srcA)) / newA;
                        flattenedData.data[i+1] = (data.data[i+1]! * srcA + flattenedData.data[i+1]! * dstA * (1 - srcA)) / newA;
                        flattenedData.data[i+2] = (data.data[i+2]! * srcA + flattenedData.data[i+2]! * dstA * (1 - srcA)) / newA;
                    } else {
                        flattenedData.data[i] = 0;
                        flattenedData.data[i+1] = 0;
                        flattenedData.data[i+2] = 0;
                    }
                    flattenedData.data[i+3] = newA * 255;
                }
            }
        }
        ctx.putImageData(flattenedData, 0, 0);
        for(const name in this.layers) {
            let layer = this.layers[name]!;
            layer.canvas.remove();
        }
        this.layers = {};
        this.setLayer("0");
        this.selectedLayer.drawImage(this.ctx.canvas, 0, 0);
        return this;
    }
}

export async function generateIcon2D(width: number, height: number, callback: (ctx: IconGenerationContext2D) => void) {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    let ctx = new IconGenerationContext2D(canvas.getContext("2d", { willReadFrequently: true })!);
    callback(ctx);
    ctx.flatten();
    let url = await new Promise<string>(res => {
        canvas.toBlob(blob => {
            if(!blob)
                return;
            const url = URL.createObjectURL(blob);
            res(url);
        }, "image/png");
    })
    canvas.remove();
    return url;
}


////////////////////////
//  UI DROPDOWN CLASS //
////////////////////////
export class UiContextMenu {
    position: Vec2;
    containerEl: HTMLDivElement;
    constructor(x: number, y: number) {
        this.position = new Vec2(x, y);
        this.containerEl = document.createElement("div");
    }
}


//////////////////////
//  UI BUTTON CLASS //
//////////////////////
export class UiButton {
    containerEl: HTMLDivElement;
    labelEl: HTMLDivElement;
    buttonEl: HTMLButtonElement;
    isHovering = false;
    mouseEnterEvent: Signal<[]> = new Signal();
    mouseLeaveEvent: Signal<[]> = new Signal();
    prefixIcons: UiButtonIcon[] = [];
    suffixIcons: UiButtonIcon[] = [];
    textContentChangedEvent: Signal<[text:string]> = new Signal({onConnect:(conn)=>{conn.fire(this._textContent)}});
    _textContent = "Button";
    get textContent() { return this._textContent; }
    set textContent(value: string) {
        this._textContent = value;
        this.textContentChangedEvent.fire(value);
    }
    textSizeChangedEvent: Signal<[size:number]> = new Signal({onConnect:(conn)=>{conn.fire(this._textSize)}});
    _textSize = 16;
    get textSize() { return this._textSize; }
    set textSize(value: number) {
        this._textSize = value;
        this.textSizeChangedEvent.fire(value);
    }
    paddingXChangedEvent: Signal<[value:number]> = new Signal({onConnect:(conn)=>{conn.fire(this._paddingX)}});
    _paddingX = 4;
    get paddingX() { return this._paddingX; }
    set paddingX(value: number) {
        this._paddingX = value;
    }
    paddingYChangedEvent: Signal<[value:number]> = new Signal({onConnect:(conn)=>{conn.fire(this._paddingY)}});
    _paddingY = 8;
    get paddingY() { return this._paddingY; }
    set paddingY(value: number) {
        this._paddingY = value;
    }
    constructor() {
        this.containerEl = document.createElement("div");
        document.body.appendChild(this.containerEl);
        this.containerEl.style = `
            position: relative;
            width: fit-content;
            height: fit-content;
            background-color: white;
            border-radius: 4px;
            border: 1px solid black;
            user-select: none;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
        `;
        this.paddingXChangedEvent.connect(value => {
            this.containerEl.style.padding = `${value}px ${this.paddingY}px`;
            this.containerEl.style.gap = `${value}px`;
        });
        this.paddingYChangedEvent.connect(value => {
            this.containerEl.style.padding = `${this.paddingX}px ${value}px`;
        });
        this.buttonEl = document.createElement("button");
        this.containerEl.appendChild(this.buttonEl);
        this.buttonEl.style = `
            padding: 0;
            margin: 0;
            border: none;
            background-color: transparent;
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0px;
            top: 0px;
            cursor: pointer;
        `;
        this.labelEl = document.createElement("div");
        this.containerEl.appendChild(this.labelEl);
        this.labelEl.style = `
            color: black;
            font-family: Arial;
            width: fit-content;
            height: fit-content;
            pointer-events: none;
        `;
        this.textSizeChangedEvent.connect(size => {
            this.labelEl.style.fontSize = `${size}px`;
        });
        this.textContentChangedEvent.connect(text => {
            this.labelEl.textContent = text;
        });
        this.buttonEl.addEventListener("mouseenter", e => {
            this.isHovering = true;
            this.mouseEnterEvent.fire();
        });
        this.buttonEl.addEventListener("mouseleave", e => {
            this.isHovering = false;
            this.mouseLeaveEvent.fire();
        });
    }
    addIcon(url: string, position: "prefix" | "suffix" = "prefix") {
        let icon = new UiButtonIcon(url);
        if(position == "prefix") this.labelEl.before(icon.iconEl)
        else this.labelEl.after(icon.iconEl);
        icon.connections.add(this.textSizeChangedEvent.connect(size => {
            icon.iconEl.style.width = `${size}px`;
            icon.iconEl.style.height = `${size}px`;
        }));
    }
    remove() {
        this.containerEl.remove();
    }
}

export class UiButtonIcon {
    iconEl: HTMLImageElement;
    connections = new ConnectionGroup();
    constructor(url: string) {
        this.iconEl = document.createElement("img");
        this.iconEl.src = url;
    }
    remove() {
        this.connections.disconnectAll();
        this.iconEl.remove();
    }
}

export class UiBtnHoverFxSolidColor {
    duration = 0.1;
    connections = new ConnectionGroup();
    constructor(public button: UiButton, color: Color, hoverColor: Color) {
        this.color = color;
        this.hoverColor = hoverColor;
        this.connections.add(button.mouseEnterEvent.connect(() => {
            button.containerEl.animate([
                {backgroundColor:this.color.toString()},
                {backgroundColor:this.hoverColor.toString()},
            ], {duration:this.duration*1000, easing:"ease"});
            button.containerEl.style.backgroundColor = this.hoverColor.toString();
        }));
        this.connections.add(button.mouseLeaveEvent.connect(() => {
            button.containerEl.animate([
                {backgroundColor:this.hoverColor.toString()},
                {backgroundColor:this.color.toString()},
            ], {duration:this.duration*1000, easing:"ease"});
            button.containerEl.style.backgroundColor = this.color.toString();
        }));
        if(button.isHovering) {
            this.button.containerEl.style.backgroundColor = this.hoverColor.toString();
        } else {
            this.button.containerEl.style.backgroundColor = this.color.toString();
        }
    }

    _color!: Color;
    set color(value: Color) {
        this._color = value;
        if(!this.button.isHovering)
            this.button.containerEl.style.backgroundColor = value.toString();
    }
    get color() { return this._color; }
    _hoverColor!: Color;
    set hoverColor(value: Color) {
        this._hoverColor = value;
        if(this.button.isHovering)
            this.button.containerEl.style.backgroundColor = value.toString();
    }
    get hoverColor() { return this._hoverColor; }

    remove() {
        this.connections.disconnectAll();
        this.button.containerEl.style.backgroundColor = this.color.toString();
    }
}