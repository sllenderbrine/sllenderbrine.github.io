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


//////////////////////
//  VECTOR CLASSES  //
//////////////////////
export class Vec3 {
    _x: number;
    _y: number;
    _z: number;
    onMutate?: () => void;
    constructor(v: Vec3 | {x: number, y: number, z: number});
    constructor(x: number, y: number, z: number);
    constructor(x: number | Vec3 | {x:number, y:number, z:number}, y?: number, z?: number) {
        if(typeof x === "object") {
            this._x = x.x;
            this._y = x.y;
            this._z = x.z;
        } else {
            this._x = x;
            this._y = y! as number;
            this._z = z!;
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
    getI(i: number): number | undefined {
        switch(i) {
            case 0: return this._x;
            case 1: return this._y;
            case 2: return this._z;
        }
        return undefined;
    }
    setI(i: number, v: number): void {
        switch(i) {
            case 0: this._x = v; this.mutate(); return;
            case 1: this._y = v; this.mutate(); return;
            case 2: this._z = v; this.mutate(); return;
        }
    }
    set(other: Vec3): this {
        this._x = other._x;
        this._y = other._y;
        this._z = other._z;
        this.mutate();
        return this;
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
    angleTo(other: Vec3): number {
        const c = this.length() * other.length();
        if(c === 0)
            return 0;
        return Math.acos(EMath.clamp(this.dot(other) / c, -1, 1));
    }
    signedAngleTo(other: Vec3, reference: Vec3 = Vec3.yAxis()): number {
        const angle = this.angleTo(other);
        const normal = this.cross(other).normSelf();
        if(normal.dot(reference.norm()) > 0)
            return -angle;
        return angle;
    }
    distTo(other: Vec3): number {
        return this.sub(other).length();
    }
    distToC(x: number, y: number, z: number): number {
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
export abstract class Noise {
    static randomConstant3(a: number, b: number, c: number) : number {
        const it = (a * 2394823549) ^ (b * 43859742850) ^ (c * 23094565234);
        return EMath.pmod(it, 10000) / 10000;
    }
    static randomConstant4(a: number, b: number, c: number, d: number) : number {
        const it = (a * 2394823549) ^ (b * 43859742850) ^ (c * 23094565234) ^ (d * 8427824566);
        return EMath.pmod(it, 10000) / 10000;
    }
    static fade(t: number) : number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    static generatePerlin2DGradients(count = 12) {
        const gradients: Vec2[] = [];
        for(let i=0; i<count; i++) {
            const angle = 2 * Math.PI * i/count;
            gradients.push(new Vec2(Math.cos(angle), Math.sin(angle)));
        }
        return gradients;
    }
    static getPerlin2DVectorAt(x: number, y: number, seed: number, gradients: Vec2[]) : Vec2 {
        return gradients[Math.floor(this.randomConstant3(seed, x, y) * gradients.length)]!;
    }
    static getPerlin2DValueAt(x: number, y: number, seed: number, gradients: Vec2[]) : number {
        const getPerlin2DVectorAt = this.getPerlin2DVectorAt.bind(this);
        const lerp = EMath.lerp;
        const fade = this.fade;
        const g0 = new Vec2(x, y).mapSelf(Math.floor);
        const g1 = new Vec2(g0).addSelfC(1, 1);
        const f0 = new Vec2(x, y).subSelf(g0);
        const f1 = new Vec2(x, y).subSelf(g1);
        const cAA = getPerlin2DVectorAt(g0.x, g0.y, seed, gradients).dot(f0);
        const cAB = getPerlin2DVectorAt(g0.x, g1.y, seed, gradients).dotC(f0.x, f1.y);
        const cBA = getPerlin2DVectorAt(g1.x, g0.y, seed, gradients).dotC(f1.x, f0.y);
        const cBB = getPerlin2DVectorAt(g1.x, g1.y, seed, gradients).dot(f1);
        const tx = fade(f0.x);
        const ty = fade(f0.y);
        const cA = lerp(cAA, cBA, tx);
        const cB = lerp(cAB, cBB, tx);
        const c = lerp(cA, cB, ty);
        return EMath.clamp(c * 0.5 + 0.5, 0, 1);
    }
    static generatePerlin3DGradients(count = 16) {
        const gradients: Vec3[] = [];
        for(let i=0;i<count;i++) {
            const y = 1 - (2*i)/(count-1);
            const r = Math.sqrt(1-y*y);
            const angle = i * Math.PI * (3-Math.sqrt(5));
            gradients.push(new Vec3(
                Math.cos(angle) * r,
                y,
                Math.sin(angle) * r,
            ));
        }
        return gradients;
    }
    static getPerlin3DVectorAt(x: number, y: number, z: number, seed: number, gradients: Vec3[]) : Vec3 {
        return gradients[Math.floor(this.randomConstant4(seed, x, y, z) * gradients.length)]!;
    }
    static getPerlin3DValueAt(x: number, y: number, z: number, seed: number, gradients: Vec3[]) : number {
        const getPerlin3DVectorAt = this.getPerlin3DVectorAt.bind(this);
        const lerp = EMath.lerp;
        const fade = this.fade;
        const g0 = new Vec3(x, y, z).mapSelf(Math.floor);
        const g1 = new Vec3(g0).addSelfC(1, 1, 1);
        const f0 = new Vec3(x, y, z).subSelf(g0);
        const f1 = new Vec3(x, y, z).subSelf(g1);
        const cAAA = getPerlin3DVectorAt(g0.x, g0.y, g0.z, seed, gradients).dot(f0);
        const cAAB = getPerlin3DVectorAt(g0.x, g0.y, g1.z, seed, gradients).dotC(f0.x, f0.y, f1.z);
        const cABA = getPerlin3DVectorAt(g0.x, g1.y, g0.z, seed, gradients).dotC(f0.x, f1.y, f0.z);
        const cABB = getPerlin3DVectorAt(g0.x, g1.y, g1.z, seed, gradients).dotC(f0.x, f1.y, f1.z);
        const cBAA = getPerlin3DVectorAt(g1.x, g0.y, g0.z, seed, gradients).dotC(f1.x, f0.y, f0.z);
        const cBAB = getPerlin3DVectorAt(g1.x, g0.y, g1.z, seed, gradients).dotC(f1.x, f0.y, f1.z);
        const cBBA = getPerlin3DVectorAt(g1.x, g1.y, g0.z, seed, gradients).dotC(f1.x, f1.y, f0.z);
        const cBBB = getPerlin3DVectorAt(g1.x, g1.y, g1.z, seed, gradients).dot(f1);
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
    static getWorley2DPositionAtGrid(x: number, y: number, seed: number, offsetAmp: number) {
        const xo = (this.randomConstant3(x, y, seed+1) - 0.5) * offsetAmp;
        const yo = (this.randomConstant3(x, y, seed+2) - 0.5) * offsetAmp;
        return new Vec2(x + xo, y + yo);
    }
    static getWorley2DValueAtGrid(x: number, y: number, seed: number) {
        return this.randomConstant3(x, y, seed);
    }
    static getWorley2DAt(x: number, y: number, seed: number, offsetAmp: number, search?: number) {
        search = search ?? Math.ceil(offsetAmp) + 1;
        const gx = Math.floor(x);
        const gy = Math.floor(y);
        let minDist = Infinity;
        let minDist2 = Infinity;
        let value = 0;
        let value2 = 0;
        for(let ix=gx-search; ix<=gx+search; ix++) {
            for(let iy=gy-search; iy<=gy+search; iy++) {
                let point = this.getWorley2DPositionAtGrid(ix, iy, seed, offsetAmp);
                let dist = point.distToC(x, y);
                if(dist < minDist) {
                    minDist2 = minDist;
                    value2 = value;
                    minDist = dist;
                    value = this.getWorley2DValueAtGrid(ix, iy, seed);
                } else if(dist < minDist2) {
                    minDist2 = dist;
                    value2 = this.getWorley2DValueAtGrid(ix, iy, seed);
                }
            }
        }
        return { value, value2, minDist, minDist2 };
    }
    static getWorley3DPositionAtGrid(x: number, y: number, z: number, seed: number, offsetAmp: number) {
        const xo = (this.randomConstant4(x, y, z, seed+1) - 0.5) * offsetAmp;
        const yo = (this.randomConstant4(x, y, z, seed+2) - 0.5) * offsetAmp;
        const zo = (this.randomConstant4(x, y, z, seed+3) - 0.5) * offsetAmp;
        return new Vec3(x + xo, y + yo, z + zo);
    }
    static getWorley3DValueAtGrid(x: number, y: number, z: number, seed: number) {
        return this.randomConstant4(x, y, z, seed);
    }
    static getWorley3DAt(x: number, y: number, z: number, seed: number, offsetAmp: number, search?: number) {
        search = search ?? Math.ceil(offsetAmp) + 1;
        const gx = Math.floor(x);
        const gy = Math.floor(y);
        const gz = Math.floor(z);
        let minDist = Infinity;
        let minDist2 = Infinity;
        let value = 0;
        let value2 = 0;
        for(let ix=gx-search; ix<=gx+search; ix++) {
            for(let iy=gy-search; iy<=gy+search; iy++) {
                for(let iz=gz-search; iz<=gz+search; iz++) {
                    let point = this.getWorley3DPositionAtGrid(ix, iy, iz, seed, offsetAmp);
                    let dist = point.distToC(x, y, z);
                    if(dist < minDist) {
                        minDist2 = minDist;
                        value2 = value;
                        minDist = dist;
                        value = this.getWorley3DValueAtGrid(ix, iy, iz, seed);
                    } else if(dist < minDist2) {
                        minDist2 = dist;
                        value2 = this.getWorley3DValueAtGrid(ix, iy, iz, seed);
                    }
                }
            }
        }
        return { value, value2, minDist, minDist2 };
    }
}


//////////////////////
//  CAMERA CLASSES  //
//////////////////////
export class Camera3D {
    constructor(position?: Vec3, fovY?: number, aspect?: number, near?: number, far?: number) {
        this.position = position ?? Vec3.zero();
        this.fovY = fovY ?? 95/180*Math.PI;
        this.aspect = aspect ?? 1;
        this.near = near ?? 0.1;
        this.far = far ?? 10000;
        this.rotation = Vec3.zero();
    }

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
        v.mutate();
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
        v.mutate();
    }

    private _forward = Vec3.zero();
    private _outdatedForward?: boolean = true;
    get forward() {
        this.updateForward();
        return this._forward;
    }
    updateForward() {
        if(this._outdatedForward != true)
            return;
        this._forward = Vec3.zAxis().negSelf().rotXYZSelf(this._rotation);
        delete this._outdatedForward;
    }

    private _right = Vec3.zero();
    private _outdatedRight?: boolean = true;
    get right() {
        this.updateRight();
        return this._right;
    }
    updateRight() {
        if(this._outdatedRight != true)
            return;
        this._right = Vec3.xAxis().rotXYZSelf(this._rotation);
        delete this._outdatedRight;
    }

    private _up = Vec3.zero();
    private _outdatedUp?: boolean = true;
    get up() {
        this.updateUp();
        return this._up;
    }
    updateUp() {
        if(this._outdatedUp != true)
            return;
        this._up = Vec3.yAxis().rotXYZSelf(this._rotation);
        delete this._outdatedUp;
    }

    private _forwardFlat = Vec3.zero();
    private _outdatedForwardFlat?: boolean = true;
    get forwardFlat() {
        this.updateForwardFlat();
        return this._forwardFlat;
    }
    updateForwardFlat() {
        if(this._outdatedForwardFlat != true)
            return;
        this._forwardFlat = Vec3.zAxis().negSelf().rotYSelf(this._rotation.y);
        delete this._outdatedForwardFlat;
    }

    private _perspectiveMatrix: number[] = [];
    private _outdatedPerspectiveMatrix?: boolean = true;
    public perspectiveMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.perspectiveMatrix) });
    get perspectiveMatrix() {
        this.updatePerspectiveMatrix();
        return this._perspectiveMatrix;
    }
    updatePerspectiveMatrix() {
        if(this._outdatedPerspectiveMatrix != true)
            return;
        this._perspectiveMatrix = Mat4.perspective(this._fovY, this._aspect, this._near, this._far);
        delete this._outdatedPerspectiveMatrix;
        this.perspectiveMatrixObserver.fire(this._perspectiveMatrix);
    }

    private _translationMatrix: number[] = [];
    private _outdatedTranslationMatrix?: boolean = true;
    public translationMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.translationMatrix) });
    get translationMatrix() {
        this.updateTranslationMatrix();
        return this._translationMatrix;
    }
    updateTranslationMatrix() {
        if(this._outdatedTranslationMatrix != true)
            return;
        this._translationMatrix = Mat4.translate(-this._position.x * this._worldScale, -this._position.y * this._worldScale, -this._position.z * this._worldScale);
        delete this._outdatedTranslationMatrix;
        this.translationMatrixObserver.fire(this._viewMatrix);
    }

    private _rotationMatrix: number[] = [];
    private _outdatedRotationMatrix?: boolean = true;
    public rotationMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.rotationMatrix) });
    get rotationMatrix() {
        this.updateRotationMatrix();
        return this._rotationMatrix;
    }
    updateRotationMatrix() {
        if(this._outdatedRotationMatrix != true)
            return;
        this._rotationMatrix = Mat4.multiply(
            Mat4.rotateZ(-this._rotation.z),
            Mat4.multiply(
                Mat4.rotateX(-this._rotation.x),
                Mat4.rotateY(-this._rotation.y),
            )
        );
        delete this._outdatedRotationMatrix;
        this.rotationMatrixObserver.fire(this._viewMatrix);
    }

    private _viewMatrix: number[] = [];
    private _outdatedViewMatrix?: boolean = true;
    public viewMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.viewMatrix) });
    get viewMatrix() {
        this.updateViewMatrix();
        return this._viewMatrix;
    }
    updateViewMatrix() {
        if(this._outdatedViewMatrix != true)
            return;
        this._viewMatrix = Mat4.multiply(this.rotationMatrix, this.translationMatrix);
        delete this._outdatedViewMatrix;
        this.viewMatrixObserver.fire(this._viewMatrix);
    }

    private _combinedMatrix: number[] = [];
    private _outdatedCombinedMatrix?: boolean = true;
    public combinedMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.combinedMatrix) });
    get combinedMatrix() {
        this.updateCombinedMatrix();
        return this._combinedMatrix;
    }
    updateCombinedMatrix() {
        if(this._outdatedCombinedMatrix != true)
            return;
        this._combinedMatrix = Mat3.multiply(this.viewMatrix, this.perspectiveMatrix);
        delete this._outdatedCombinedMatrix;
        this.combinedMatrixObserver.fire(this._combinedMatrix);
    }

    lookAt(p: Vec3) {
        let f = this.position.look(p);
        this.rotation = new Vec3(f.pitch(), f.yaw(), 0);
    }
}

export class Camera2D {
    constructor(position?: Vec2, zoom?: number) {
        this.position = position ?? Vec2.zero();
        this.zoom = zoom ?? 1;
        this.rotation = 0;
    }

    private _position!: Vec2;
    get position() { return this._position; }
    set position(value: Vec2) {
        this._position = value;
        this._position.onMutate = () => {
            this._outdatedTranslationMatrix = true;
            this._outdatedViewMatrix = true;
        }
        this._position.mutate();
    }

    private _zoom!: number;
    get zoom() { return this._zoom; }
    set zoom(value: number) {
        this._zoom = value;
        this._outdatedScaleMatrix = true;
        this._outdatedViewMatrix = true;
    }

    private _rotation!: number;
    get rotation() { return this._rotation; }
    set rotation(value: number) {
        this._rotation = value;
        this._outdatedRotationMatrix = true;
        this._outdatedViewMatrix = true;
        this._outdatedRight = true;
        this._outdatedUp = true;
    }

    private _right = Vec2.zero();
    private _outdatedRight?: boolean = true;
    get right() {
        this.updateRight();
        return this._right;
    }
    updateRight() {
        if(this._outdatedRight != true)
            return;
        this._right = Vec2.xAxis().rotateSelf(this._rotation);
        delete this._outdatedRight;
    }

    private _up = Vec2.zero();
    private _outdatedUp?: boolean = true;
    get up() {
        this.updateUp();
        return this._up;
    }
    updateUp() {
        if(this._outdatedUp != true)
            return;
        this._up = Vec2.yAxis().rotateSelf(this._rotation);
        delete this._outdatedUp;
    }

    private _translationMatrix: number[] = [];
    private _outdatedTranslationMatrix?: boolean = true;
    public translationMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.translationMatrix) });
    get translationMatrix() {
        this.updateTranslationMatrix();
        return this._translationMatrix;
    }
    updateTranslationMatrix() {
        if(this._outdatedTranslationMatrix != true)
            return;
        this._translationMatrix = Mat3.translate(-this.position.x, -this.position.y);
        delete this._outdatedViewMatrix;
        this.translationMatrixObserver.fire(this._translationMatrix);
    }

    private _rotationMatrix: number[] = [];
    private _outdatedRotationMatrix?: boolean = true;
    public rotationMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.rotationMatrix) });
    get rotationMatrix() {
        this.updateRotationMatrix();
        return this._rotationMatrix;
    }
    updateRotationMatrix() {
        if(this._outdatedRotationMatrix != true)
            return;
        this._rotationMatrix = Mat3.rotate(this.rotation);
        delete this._outdatedRotationMatrix;
        this.rotationMatrixObserver.fire(this._rotationMatrix);
    }

    private _scaleMatrix: number[] = [];
    private _outdatedScaleMatrix?: boolean = true;
    public scaleMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.scaleMatrix) });
    get scaleMatrix() {
        this.updateScaleMatrix();
        return this._scaleMatrix;
    }
    updateScaleMatrix() {
        if(this._outdatedScaleMatrix != true)
            return;
        this._scaleMatrix = Mat3.rotate(this.zoom);
        delete this._outdatedScaleMatrix;
        this.scaleMatrixObserver.fire(this._scaleMatrix);
    }

    private _viewMatrix: number[] = [];
    private _outdatedViewMatrix?: boolean = true;
    public viewMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.viewMatrix) });
    get viewMatrix() {
        this.updateViewMatrix();
        return this._viewMatrix;
    }
    updateViewMatrix() {
        if(this._outdatedViewMatrix != true)
            return;
        this._viewMatrix = Mat3.multiply(this.rotationMatrix, Mat3.multiply(this.translationMatrix, this.scaleMatrix));
        delete this._outdatedViewMatrix;
        this.viewMatrixObserver.fire(this._viewMatrix);
    }
}


////////////////////
//  MESH CLASSES  //
////////////////////
export class TriMesh3D {
    positions: number[] = [];
    texcoords: number[] = [];
    normals: number[] = [];
    constructor() { }

    clone(): TriMesh3D {
        return new TriMesh3D().append(this);
    }

    translateSelf(v: Vec3): this {
        return this.translateSelfC(v.x, v.y, v.z);
    }

    translateSelfC(x: number, y: number, z: number): this {
        for(let i=0; i<this.positions.length; i+=3) {
            this.positions[i]! += x;
            this.positions[i+1]! += y;
            this.positions[i+2]! += z;
        }
        return this;
    }

    scaleSelf(v: Vec3): this {
        return this.scaleSelfC(v.x, v.y, v.z);
    }

    scaleSelfC(x: number, y: number, z: number): this {
        for(let i=0; i<this.positions.length; i+=3) {
            this.positions[i]! *= x;
            this.positions[i+1]! *= y;
            this.positions[i+2]! *= z;
        }
        return this;
    }

    rotateSelf(v: Vec3) {
        return this.rotateSelfC(v.x, v.y, v.z);
    }

    rotateSelfC(ax: number, ay: number, az: number): this {
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

    rotateAroundSelf(origin: Vec3, v: Vec3) {
        return this.rotateAroundSelfC(origin.x, origin.y, origin.z, v.x, v.y, v.z);
    }

    rotateAroundSelfC(x: number, y: number, z: number, ax: number, ay: number, az: number): this {
        return this.translateSelfC(-x, -y, -z).rotateSelfC(ax, ay, az).translateSelfC(x, y, z);
    }

    append(...meshes: TriMesh3D[]): this {
        for(const mesh of meshes) {
            this.positions.push(...mesh.positions);
            this.texcoords.push(...mesh.texcoords);
            this.normals.push(...mesh.normals);
        }
        return this;
    }
    
    static getLines(positions: number[]): number[] {
        let edges: number[] = [];
        for(let i=0; i<positions.length; i+=9) {
            edges.push(positions[i]!, positions[i+1]!, positions[i+2]!, positions[i+3]!, positions[i+4]!, positions[i+5]!);
            edges.push(positions[i+3]!, positions[i+4]!, positions[i+5]!, positions[i+6]!, positions[i+7]!, positions[i+8]!);
            edges.push(positions[i+6]!, positions[i+7]!, positions[i+8]!, positions[i]!, positions[i+1]!, positions[i+2]!);
        }
        return edges;
    }

    static getQuadLines(positions: number[]): number[] {
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

export class TriMesh2D {
    positions: number[] = [];
    texcoords: number[] = [];
    constructor() { }
    
    clone(): TriMesh2D {
        return new TriMesh2D().append(this);
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

    rotateSelf(a: number): this {
        for(let i=0; i<this.positions.length; i+=2) {
            let p = new Vec2(this.positions[i]!, this.positions[i+1]!);
            p.rotateSelf(a);
            this.positions[i] = p.x;
            this.positions[i+1] = p.y;
        }
        return this;
    }

    rotateAroundSelf(origin: Vec2, a: number) {
        return this.rotateAroundSelfC(origin.x, origin.y, a);
    }

    rotateAroundSelfC(x: number, y: number, a: number): this {
        return this.translateSelfC(-x, -y).rotateSelf(a).translateSelfC(x, y);
    }

    append(...meshes: TriMesh2D[]): this {
        for(const mesh of meshes) {
            this.positions.push(...mesh.positions);
            this.texcoords.push(...mesh.texcoords);
        }
        return this;
    }
}

export class Polygon2D {
    positions: number[] = [];
    constructor() { }

    static createPositions(positions: number[]): Polygon2D {
        const poly = new Polygon2D();
        poly.positions = positions;
        return poly;
    }

    static rect(x: number, y: number, w: number, h: number): Polygon2D {
        const x0 = x - w/2;
        const x1 = x + w/2;
        const y0 = y - h/2;
        const y1 = y + h/2;
        return this.createPositions([x0,y0, x1,y0, x1,y1, x0,y1]);
    }

    static circle(x: number, y: number, r: number, arc: number = Math.PI * 2, step = Math.PI / 8): Polygon2D {
        arc = EMath.clamp(arc, 0, Math.PI * 2);
        let positions: number[] = [];
        for(let i=0; i<arc; i+=step) {
            positions.push(Math.cos(i) * r + x, Math.sin(i) * r + y);
        }
        positions.push(Math.cos(arc) * r + x, Math.sin(arc) * r + y);
        return this.createPositions(positions);
    }

    static circleFan(x: number, y: number, r: number, arc: number = Math.PI * 2, step = Math.PI / 8): Polygon2D {
        const poly = this.circle(x, y, r, arc, step);
        poly.positions.splice(0, 0, x, y);
        return poly;
    }

    translateSelf(v: Vec2) {
        return this.translateSelfC(v.x, v.y);
    }

    translateSelfC(x: number, y: number): this {
        for(let i=0; i<this.positions.length; i+=2) {
            this.positions[i]! += x;
            this.positions[i+1]! += y;
        }
        return this;
    }

    scaleSelf(v: Vec2) {
        return this.scaleSelfC(v.x, v.y);
    }

    scaleSelfC(x: number, y: number): this {
        for(let i=0; i<this.positions.length; i+=2) {
            this.positions[i]! *= x;
            this.positions[i+1]! *= y;
        }
        return this;
    }

    rotateSelf(a: number): this {
        for(let i=0; i<this.positions.length; i+=3) {
            let p = new Vec2(this.positions[i]!, this.positions[i+1]!);
            p.rotateSelf(a);
            this.positions[i] = p.x;
            this.positions[i+1] = p.y;
        }
        return this;
    }

    rotateAroundSelf(origin: Vec2, a: number) {
        return this.rotateAroundSelfC(origin.x, origin.y, a);
    }

    rotateAroundSelfC(x: number, y: number, a: number) {
        return this.translateSelfC(-x, -y).rotateSelf(a);
    }

    drawPath(ctx: CanvasRenderingContext2D, sx = 1, sy = 1) {
        ctx.beginPath();
        for(let i=0; i<this.positions.length; i+=2) {
            if(i == 0) ctx.moveTo(this.positions[i]! * sx, this.positions[i+1]! * sy);
            else ctx.lineTo(this.positions[i]! * sx, this.positions[i+1]! * sy);
        }
        ctx.closePath();
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
            let tMaxA = vA.distTo(vB);
            let tMaxC = vC.distTo(vB);
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
            let tMaxA = vA.distTo(vB) / 2;
            let tMaxC = vC.distTo(vB) / 2;
            let b1 = vB.addScaled(vB.look(vA), EMath.clamp(amount, 0, tMaxA));
            let b2 = vB.addScaled(vB.look(vC), EMath.clamp(amount, 0, tMaxC));
            newPositions.push(b1.x, b1.y, b2.x, b2.y);
        }
        this.positions = newPositions;
        return this;
    }
}


///////////////////////
//  PHYSICS CLASSES  //
///////////////////////
export type Shape2DCollision = {
    inside: boolean,
    collision: Vec2,
    distance: number,
    normal: Vec2,
};

export class Point2D {
    constructor(public position: Vec2) {

    }
    isInsideRect(rect: Rect2D) {
        let diff = this.position.sub(rect.position);
        let dx = diff.dot(rect.right);
        let dy = diff.dot(rect.up);
        return (Math.abs(dx) <= rect.size.x && Math.abs(dy) <= rect.size.y);
    }
    getRectCollision(rect: Rect2D): Shape2DCollision {
        let diff = this.position.sub(rect.position);
        let dx = diff.dot(rect.right);
        let dy = diff.dot(rect.up);
        let isInside = (Math.abs(dx) < rect.size.x && Math.abs(dy) < rect.size.y);
        if(isInside) {
            let d1 = Math.abs(this.position.sub(rect.position.addScaled(rect.up, rect.size.y)).dot(rect.up));
            let d2 = Math.abs(this.position.sub(rect.position.addScaled(rect.up, -rect.size.y)).dot(rect.up));
            let d3 = Math.abs(this.position.sub(rect.position.addScaled(rect.right, rect.size.x)).dot(rect.right));
            let d4 = Math.abs(this.position.sub(rect.position.addScaled(rect.right, -rect.size.x)).dot(rect.right));
            let minIndex = 0;
            let minDist = d1;
            if(d2 < minDist) { minDist = d2; minIndex = 1; }
            if(d3 < minDist) { minDist = d3; minIndex = 2; }
            if(d4 < minDist) { minDist = d4; minIndex = 3; }
            let edge: Vec2;
            let normal: Vec2;
            switch(minIndex) {
                case 0:
                    edge = rect.position.addScaled(rect.right, dx).addScaled(rect.up, rect.size.y);
                    normal = rect.up;
                    break;
                case 1:
                    edge = rect.position.addScaled(rect.right, dx).addScaled(rect.up, -rect.size.y);
                    normal = rect.up.neg();
                    break;
                case 2:
                    edge = rect.position.addScaled(rect.up, dy).addScaled(rect.right, rect.size.x);
                    normal = rect.right;
                    break;
                case 3:
                    edge = rect.position.addScaled(rect.up, dy).addScaled(rect.right, -rect.size.x);
                    normal = rect.right.neg();
                    break;
            }
            return {
                inside: true,
                collision: edge!,
                distance: -edge!.distTo(this.position),
                normal: normal!,
            }
        } else {
            dx = EMath.clamp(dx, -rect.size.x, rect.size.x);
            dy = EMath.clamp(dy, -rect.size.y, rect.size.y);
            let edge = rect.position.addScaled(rect.right, dx).addScaled(rect.up, dy);
            let dist = edge.distTo(this.position);
            return {
                inside: false,
                collision: edge,
                distance: dist,
                normal: edge.look(this.position),
            };
        }
    }
    distToCircle(circle: Circle2D) {
        let dist = this.position.distTo(circle.position);
        return dist - circle.radius;
    }
    isInsideCircle(circle: Circle2D) {
        return this.distToCircle(circle) <= 0;
    }
}

export class Ray2D {
    constructor(public origin: Vec2, public direction: Vec2) {

    }
    raycastGrid<T>(
        predicate: (pos:Vec2, normal:Vec2, dist:number) => T | undefined,
        maxIterations = 1000
    ): T | undefined {
        const invDirAbs = this.direction.rdivF(1).map(x => Math.abs(x));
        const sign = this.direction.map(x => x > 0 ? 1 : 0);
        const step = this.direction.map(x => x > 0 ? 1 : -1);
        let tMaxX = invDirAbs.x * (sign.x===0 ? (this.origin.x - Math.floor(this.origin.x)) : (Math.floor(this.origin.x) + 1 - this.origin.x));
        let tMaxY = invDirAbs.y * (sign.y===0 ? (this.origin.y - Math.floor(this.origin.y)) : (Math.floor(this.origin.y) + 1 - this.origin.y));
        let pos = new Vec2(this.origin).mapSelf(x => Math.floor(x));
        let distance = 0;
        let normal = Vec2.zero();
        for(let i=0; i<maxIterations; i++) {
            let res = predicate(pos, normal, distance);
            if(res !== undefined)
                return res;
            if(tMaxX < tMaxY) {
                distance = tMaxX;
                normal.setC(-step.x, 0);
                tMaxX += invDirAbs.x;
                pos.x += step.x;
            } else {
                distance = tMaxY;
                normal.setC(0, -step.y);
                tMaxY += invDirAbs.y;
                pos.y += step.y;
            }
        }
        return undefined;
    }
}

export class Segment2D {
    constructor(public start: Vec2, public end: Vec2) {

    }
}

export class Rect2D {
    constructor(public position: Vec2, size: Vec2, rotation: number) {
        this.size = size;
        this.rotation = rotation;
    }

    private _size!: Vec2;
    get size() { return this._size; }
    set size(value: Vec2) {
        this._size = value;
    }

    private _rotation!: number
    get rotation() { return this._rotation; }
    set rotation(value: number) {
        this._rotation = value;
    }

    private _right = Vec2.zero();
    private _outdatedRight?: boolean = true;
    get right() {
        this.updateRight();
        return this._right;
    }
    updateRight() {
        if(this._outdatedRight != true)
            return;
        this._right = Vec2.xAxis().rotateSelf(this._rotation);
        delete this._outdatedRight;
    }

    private _up = Vec2.zero();
    private _outdatedUp?: boolean = true;
    get up() {
        this.updateUp();
        return this._up;
    }
    updateUp() {
        if(this._outdatedUp != true)
            return;
        this._up = Vec2.yAxis().rotateSelf(this._rotation);
        delete this._outdatedUp;
    }
}

export class Circle2D {
    constructor(public position: Vec2, public radius: number) {

    }
    getRectCollision(rect: Rect2D): Shape2DCollision {
        let res = new Point2D(this.position).getRectCollision(rect);
        res.distance -= this.radius;
        if(res.distance <= 0) res.inside = true;
        return res;
    }
    getCircleCollision(other: Circle2D): Shape2DCollision {
        let dist = this.position.distTo(other.position) - this.radius - other.radius;
        let normal = this.position.look(other.position);
        let collision = this.position.addScaled(normal, this.radius);
        return {
            inside: dist <= 0,
            collision,
            distance: dist,
            normal,
        };
    }
    getSegmentCollision(segment: Segment2D): Shape2DCollision {
        let dir = segment.start.look(segment.end);
        let off = this.position.sub(segment.start);
        let t = off.dot(dir);
        let maxT = segment.end.distTo(segment.start);
        t = EMath.clamp(t, 0, maxT);
        let collision = segment.start.addScaled(dir, t);
        let normal = collision.look(this.position);
        let dist = collision.distTo(this.position) - this.radius;
        return {
            inside: dist <= 0,
            collision,
            distance: dist,
            normal,
        };
    }
}

export let Circle2DMesh = new TriMesh2D();
export let Circle2DPositionsF32 = new Float32Array(Circle2DMesh.positions);
export let Rect2DMesh = new TriMesh2D();
export let Rect2DPositionsF32 = new Float32Array(Rect2DMesh.positions);

export type PhysicsPart2DShape = "rect" | "circle";

export class PhysicsPart2D {
    anchored = false;
    velocity = Vec2.zero();
    hasCollision = true;
    color = new Color();
    shaderObject!: WGL2Object;
    mass = 1;
    restitution = 1;
    gravity = 500;
    collisionEvent: Signal<[collision: Shape2DCollision, partA: PhysicsPart2D, partB: PhysicsPart2D]> = new Signal();
    constructor(shader: WGL2Shader, position: Vec2, size: Vec2) {
        this.shapeType = "circle";
        this.shader = shader;
        this.position = position;
        this.size = size;
        this.rotation = 0;
    }

    private _shader!: WGL2Shader;
    uColor?: WGL2ComponentUniform;
    uView?: WGL2ComponentUniform;
    get shader() { return this._shader; }
    set shader(value: WGL2Shader) {
        this._shader = value;
        this.uColor = value.getUniform("u_color");
        this.uView = value.getUniform("u_view");
        if(this.shaderObject)
            this.shaderObject.remove();
        this.shaderObject = value.createObject();
        this._updateShaderObjectData();
    }

    private _rotation!: number;
    get rotation() { return this._rotation; }
    set rotation(value: number) {
        if(value == this._rotation)
            return;
        this._rotation = value;
        this._outdatedRotationMatrix = true;
        this._outdatedViewMatrix = true;
        if(this.shape instanceof Rect2D) {
            this.shape.rotation = this._rotation;
        }
    } 

    lastPosition = Vec2.zero();
    private _position!: Vec2;
    get position() { return this._position; }
    set position(value: Vec2) {
        this._position = value;
        this._position.onMutate = () => {
            this._outdatedTranslationMatrix = true;
            this._outdatedViewMatrix = true;
        }
        this._position.mutate();
        this.shape.position = this._position;
    }

    shape!: Circle2D | Rect2D;
    private _shapeType: PhysicsPart2DShape = "rect";
    get shapeType() { return this._shapeType; }
    set shapeType(value: PhysicsPart2DShape) {
        this._shapeType = value;
        this._updateShaderObjectData();
    }
    private _updateShaderObjectData() {
        switch(this._shapeType) {
            case "rect":
                this.shaderObject.setData("a_position", Rect2DPositionsF32);
                this.shape = new Rect2D(this.position, this.size, this.rotation);
                break;
            case "circle":
                this.shaderObject.setData("a_position", Circle2DPositionsF32);
                this.shape = new Circle2D(this.position, Math.max(this.size.x, this.size.y));
                break;
        }
    }

    private _size!: Vec2;
    get size() { return this._size; }
    set size(value: Vec2) {
        this._size = value;
        this._size.onMutate = () => {
            this._outdatedScaleMatrix = true;
            this._outdatedViewMatrix = true;
        }
        this._size.mutate();
        if(this.shape instanceof Rect2D) {
            this.shape.size = this._size;
        } else {
            this.shape.radius = Math.max(this._size.x, this._size.y);
        }
    }
    
    private _translationMatrix: number[] = [];
    private _outdatedTranslationMatrix?: boolean = true;
    get translationMatrix() {
        this.updateTranslationMatrix();
        return this._translationMatrix;
    }
    updateTranslationMatrix() {
        if(this._outdatedTranslationMatrix != true)
            return;
        this._translationMatrix = Mat3.translate(this.position.x, this.position.y);
    }

    private _rotationMatrix: number[] = [];
    private _outdatedRotationMatrix?: boolean = true;
    get rotationMatrix() {
        this.updateRotationMatrix();
        return this._rotationMatrix;
    }
    updateRotationMatrix() {
        if(this._outdatedRotationMatrix != true)
            return;
        this._rotationMatrix = Mat3.rotate(this.rotation);
    }

    private _scaleMatrix: number[] = [];
    private _outdatedScaleMatrix?: boolean = true;
    get scaleMatrix() {
        this.updateScaleMatrix();
        return this._scaleMatrix;
    }
    updateScaleMatrix() {
        if(this._outdatedScaleMatrix != true)
            return;
        this._scaleMatrix = Mat3.scale(this.size.x, this.size.y);
    }

    private _viewMatrix: number[] = [];
    private _outdatedViewMatrix?: boolean = true;
    get viewMatrix() {
        this.updateViewMatrix();
        return this._viewMatrix;
    }
    updateViewMatrix() {
        if(this._outdatedViewMatrix != true)
            return;
        this._viewMatrix = Mat3.multiply(this.rotationMatrix, Mat3.multiply(this.translationMatrix, this.scaleMatrix));
    }

    resolveCircleCircleCollision(other: PhysicsPart2D, collision: Shape2DCollision) {
        if(!collision.inside)
            return;
        const velAlongNormal = other.velocity.sub(this.velocity).dot(collision.normal);
        const mi = (1/this.mass + 1/other.mass);
        if (velAlongNormal < 0) {
            const restitution = Math.min(this.restitution, other.restitution);
            const j = -(1+restitution) * velAlongNormal / mi;
            this.velocity.addScaledSelf(collision.normal, j * -1 / this.mass);
            other.velocity.addScaledSelf(collision.normal, j * 1 / other.mass);
        }
        const correction = collision.normal.rescale(Math.max(-collision.distance - 1e-4, 0) / mi * 0.8);
        this.position.addScaledSelf(correction, -1/this.mass);
        other.position.addScaledSelf(correction, 1/other.mass);
    }

    resolveCircleAnchoredRectCollision(other: PhysicsPart2D, collision: Shape2DCollision) {
        if(!collision.inside)
            return;
        const velAlongNormal = this.velocity.sub(other.velocity).dot(collision.normal);
        if (velAlongNormal < 0) {
            const restitution = Math.min(this.restitution, other.restitution);
            const j = -(1+restitution) * velAlongNormal;
            this.velocity.addScaledSelf(collision.normal, j);
        }
        const radius = Math.max(this.size.x, this.size.y);
        this.position = collision.collision.addScaled(collision.normal, radius + 1e-6);
    }

    render(camera?: Camera2D) {
        if(this.uColor)
            this.uColor.setValues([this.color.r, this.color.g, this.color.b]);
        if(this.uView)
            this.uView.setValues(camera ? Mat3.multiply(this.viewMatrix, camera.viewMatrix) : this.viewMatrix);
        this.shaderObject.drawTriangles();
    }
}

export class Ray3D {
    constructor(public origin: Vec3, public direction: Vec3) {

    }
    raycastVoxels<T>(
        predicate: (pos:Vec3, normal:Vec3, dist:number) => T | undefined,
        maxIterations = 1000
    ): T | undefined {
        const invDirAbs = this.direction.rdivF(1).map(x => Math.abs(x));
        const sign = this.direction.map(x => x > 0 ? 1 : 0);
        const step = this.direction.map(x => x > 0 ? 1 : -1);
        let tMaxX = invDirAbs.x * (sign.x===0 ? (this.origin.x - Math.floor(this.origin.x)) : (Math.floor(this.origin.x) + 1 - this.origin.x));
        let tMaxY = invDirAbs.y * (sign.y===0 ? (this.origin.y - Math.floor(this.origin.y)) : (Math.floor(this.origin.y) + 1 - this.origin.y));
        let tMaxZ = invDirAbs.z * (sign.z===0 ? (this.origin.z - Math.floor(this.origin.z)) : (Math.floor(this.origin.z) + 1 - this.origin.z));
        let pos = new Vec3(this.origin).mapSelf(x => Math.floor(x));
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
    raycastBox(bounds: Vec3[]) {
        const invDir = this.direction.rdivF(1);
        const sign = this.direction.map(x => x > 0 ? 1 : 0);
        const signFlip = this.direction.map(x => x > 0 ? 0 : 1);
        const stepFlip = this.direction.map(x => x > 0 ? -1 : 1);
        let tmin = (bounds[signFlip.x]!.x - this.origin.x) * invDir.x;
        let tmax = (bounds[sign.x]!.x - this.origin.x) * invDir.x;
        let normal = new Vec3(stepFlip.x,0,0);
        let tymin = (bounds[signFlip.y]!.y - this.origin.y) * invDir.y;
        let tymax = (bounds[sign.y]!.y - this.origin.y) * invDir.y;
        if((tmin > tymax) || (tymin > tmax)) return null;
        if(tymin > tmin) {
            tmin = tymin;
            normal = new Vec3(0,stepFlip.y,0);
        }
        if(tymax < tmax) tmax = tymax;
        let tzmin = (bounds[signFlip.z]!.z - this.origin.z) * invDir.z;
        let tzmax = (bounds[sign.z]!.z - this.origin.z) * invDir.z;
        if((tmin > tzmax) || (tzmin > tmax)) return null;
        if(tzmin > tmin) {
            tmin = tzmin;
            normal = new Vec3(0,0,stepFlip.z);
        }
        if(tzmax < tmax) tmax = tzmax;
        const distance = tmin < 0 ? 0 : tmin;
        return { normal, distance, intersection: this.origin.addScaled(this.direction, distance) };
    }
}

export class Physics2DEnvironment {
    partObserver: Signal<[obj: any]> = new Signal({onConnect:(conn)=>{for(const obj of this.parts)conn.fire(obj);}});
    parts: PhysicsPart2D[] = [];
    defaultShader: WGL2Shader;
    constructor(public gl: WebGL2RenderingContext) {
        this.defaultShader = new WGL2Shader(
            gl,
            `#version 300 es
                in vec2 a_position;
                uniform mat3 u_view;
                void main() {
                    vec2 v_position = (u_view * vec3(a_position, 1)).xy;
                    gl_Position = vec4(v_position, 0, 1)
                }
            `,
            `#version 300 es
                precision highp float;
                uniform vec3 color;
                out vec4 outColor;
                void main() {
                    outColor = vec4(color/255., 1);
                }
            `,
        );
    }
    addPart(part: PhysicsPart2D) {
        this.parts.push(part);
    }
    update(dt: number) {
        for(let part of this.parts) {
            if(part.anchored) {
                part.velocity = part.position.sub(part.lastPosition).mulF(1/dt);
                part.lastPosition.setC(part.position.x, part.position.y);
            } else {
                part.lastPosition.setC(part.position.x, part.position.y);
            }
        }
        for(let i=0; i<3; i++) {
            for(let part of this.parts) {
                if(part.anchored) continue;
                if(i==0) {
                    part.velocity.y -= part.gravity * dt;
                    part.position.addScaledSelf(part.velocity, dt);
                }
                if(part.shapeType == "circle" && !part.anchored) {
                    for(let other of this.parts) {
                        if(!other.hasCollision) continue;
                        if(other == part) continue;
                        if(other.shapeType == "circle" && !other.anchored) {
                            let collision = (part.shape as Circle2D).getCircleCollision(other.shape as Circle2D);
                            part.resolveCircleCircleCollision(other, collision);
                            if(collision.inside) {
                                part.collisionEvent.fire(collision, part, other);
                                other.collisionEvent.fire(collision, part, other);
                            }
                        } else {
                            let collision = (part.shape as Circle2D).getRectCollision(other.shape as Rect2D);
                            part.resolveCircleAnchoredRectCollision(other, collision);
                            if(collision.inside) {
                                part.collisionEvent.fire(collision, part, other);
                                other.collisionEvent.fire(collision, part, other);
                            }
                        }
                    }
                }
            }
        }
    }
    renderAll(camera: Camera2D) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        for(let part of this.parts) {
            part.render(camera);
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
    remove() {
        for(const name in this.cBufferByName) {
            this.cBufferByName[name]!.delete();
        }
        this.cVao.delete();
        this.cBufferByName = {};
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


///////////////////////////////
//  ARTIFICIAL INTELLIGENCE  //
///////////////////////////////
export type LayerActivation = {
    activate: (z: number) => number,
    da_dz: (z: number, a: number) => number,
    name: string,
}

export const SigmoidActivation: LayerActivation = {
    activate: (z: number) => 1/(1+Math.exp(-z)),
    da_dz: (z: number, a: number) => a * (1 - a),
    name: "Sigmoid",
}

export const ReluActivation: LayerActivation = {
    activate: (z: number) => Math.max(z, 0),
    da_dz: (z: number, a: number) => z > 0 ? 1 : 0,
    name: "ReLU",
}

export const LinearActivation: LayerActivation = {
    activate: (z: number) => z,
    da_dz: (z: number, a: number) => 1,
    name: "Linear",
};

export function softmaxLayer(layer: DenseLayer) {
    let max = -Infinity;
    for(let i=0; i<layer.size; i++) {
        max = Math.max(max, layer.values_z[i]!);
    }
    let sum = 0;
    for(let i=0; i<layer.size; i++) {
        const v = Math.exp(layer.values_z[i]! - max);
        layer.values_a[i] = v;
        sum += v;
    }
    for(let i=0; i<layer.size; i++) {
        layer.values_a[i]! /= sum;
    }
}

export type LayerError = {
    derr_da: (layer: DenseLayer, output: Float32Array | number[], i: number) => number,
}

export const MseError: LayerError = {
    derr_da: (layer: DenseLayer, output: Float32Array | number[], i: number) => {
        return -2/layer.size * (output[i]! - layer.values_a[i]!);
    },
}

export type WeightRandomizer = {
    get: (nIn: number, nOut: number) => number,
};

export const XavierNormal: WeightRandomizer = {
    get: (nIn: number, nOut: number) => {
        const p1 = Math.sqrt(-2 * Math.log(Math.max(Math.random(), 1e-7)));
        const p2 = Math.cos(2 * Math.PI * Math.random());
        const p3 = Math.sqrt(2 / (nIn + nOut));
        return p1 * p2 * p3;
    }
};

export const XavierUniform: WeightRandomizer = {
    get: (nIn: number, nOut: number) => {
        const limit = Math.sqrt(6 / (nIn + nOut));
        return Math.random() * (2 * limit) - limit;
    }
};

export const HeNormal: WeightRandomizer = {
    get: (nIn: number, nOut: number) => {
        const p1 = Math.sqrt(-2 * Math.log(Math.max(Math.random(), 1e-7)));
        const p2 = Math.cos(2 * Math.PI * Math.random());
        const p3 = Math.sqrt(2 / nIn);
        return p1 * p2 * p3;
    }
};

export const HeUniform: WeightRandomizer = {
    get: (nIn: number, nOut: number) => {
        const limit = Math.sqrt(6 / nIn);
        return Math.random() * (2 * limit) - limit;
    }
};

export const RandomUniform: WeightRandomizer = {
    get: (nIn: number, nOut: number) => {
        return (Math.random() * 2 - 1) * 0.01;
    }
};

export abstract class LayerOptimizer {
    abstract applyGradients(learnRate: number, batchSize: number, clearGradients: boolean): void;
}

export class SgdOptimizer extends LayerOptimizer {
    constructor(public layer: DenseLayer) { super(); }
    applyGradients(learnRate: number, batchSize: number, clearGradients: boolean) {
        const layer = this.layer;
        const l = learnRate / batchSize;
        for(let i=0; i<layer.size; i++) {
            for(let j=0; j<layer.inputSize; j++) {
                layer.weights[i]![j]! -= layer.weightGrads[i]![j]! * l;
                if(clearGradients) layer.weightGrads[i]![j]! = 0;
            }
            layer.biases[i]! -= layer.biasGrads[i]! * l;
            if(clearGradients) layer.biasGrads[i] = 0;
        }
    }
}

export class AdamOptimizer extends LayerOptimizer {
    weightM: Float32Array[];
    weightV: Float32Array[];
    biasM: Float32Array;
    biasV: Float32Array;
    constructor(
        public layer: DenseLayer,
        public beta1 = 0.9,
        public beta2 = 0.999,
        public epsilon = 1e-8,
        public t = 0,
    ) {
        super();
        this.weightM = [];
        this.weightV = [];
        for(let i=0; i<layer.size; i++) {
            this.weightM.push(new Float32Array(layer.inputSize));
            this.weightV.push(new Float32Array(layer.inputSize));
        }
        this.biasM = new Float32Array(layer.size);
        this.biasV = new Float32Array(layer.size);
    }
    applyGradients(learnRate: number, batchSize: number, clearGradients: boolean) {
        const layer = this.layer;
        const lr = learnRate / batchSize;
        this.t++;
        const b1 = this.beta1;
        const b2 = this.beta2;
        const eps = this.epsilon;
        for(let i=0; i<layer.size; i++) {
            const gB = layer.biasGrads[i]!;
            this.biasM[i] = b1 * this.biasM[i]! + (1 - b1) * gB;
            this.biasV[i] = b2 * this.biasV[i]! + (1 - b2) * gB * gB;
            const mHatB = this.biasM[i]! / (1 - Math.pow(b1, this.t));
            const vHatB = this.biasV[i]! / (1 - Math.pow(b2, this.t));
            layer.biases[i]! -= lr * mHatB / (Math.sqrt(vHatB) + eps);
            for (let j=0; j<layer.inputSize; j++) {
                const gW = layer.weightGrads[i]![j]!;
                this.weightM[i]![j] = b1 * this.weightM[i]![j]! + (1 - b1) * gW;
                this.weightV[i]![j] = b2 * this.weightV[i]![j]! + (1 - b2) * gW * gW;
                const mHat = this.weightM[i]![j]! / (1 - Math.pow(b1, this.t));
                const vHat = this.weightV[i]![j]! / (1 - Math.pow(b2, this.t));
                layer.weights[i]![j]! -= lr * mHat / (Math.sqrt(vHat) + eps);
            }
        }
    }
}

export class DenseLayer {
    values_a: Float32Array;
    values_z: Float32Array;
    derr_dz: Float32Array;
    weights: Float32Array[];
    weightGrads: Float32Array[];
    biases: Float32Array;
    biasGrads: Float32Array;
    optimizer: LayerOptimizer;
    constructor(
        public inputSize: number,
        public size: number,
        public activationOrOverride: LayerActivation | "softmax_cross_entropy",
        optimizer?: LayerOptimizer,
        weightInit?: WeightRandomizer
    ) {
        this.values_a = new Float32Array(size);
        this.values_z = new Float32Array(size);
        this.derr_dz = new Float32Array(size);
        this.weights = [];
        this.weightGrads = [];
        this.biases = new Float32Array(size);
        this.biasGrads = new Float32Array(size);
        for(let i=0; i<size; i++) {
            this.weights.push(new Float32Array(inputSize));
            this.weightGrads.push(new Float32Array(inputSize));
        }
        this.randomizeWeights(weightInit ?? ((activationOrOverride != "softmax_cross_entropy" && activationOrOverride.name.toLowerCase() == "relu") ? HeNormal : XavierUniform));
        this.optimizer = optimizer ?? new AdamOptimizer(this);
    }
    randomizeWeights(method: WeightRandomizer = XavierUniform) {
        for(let i=0; i<this.size; i++) {
            for(let j=0; j<this.inputSize; j++) {
                this.weights[i]![j] = method.get(this.inputSize, this.size);
            }
        }
    }
    forward(input: DenseLayer | Float32Array | number[]) {
        if(input instanceof DenseLayer)
            input = input.values_a;
        for(let i=0; i<this.size; i++) {
            let z = this.biases[i]!;
            for(let j=0; j<this.inputSize; j++)
                z += input[j]! * this.weights[i]![j]!;
            if(this.activationOrOverride != "softmax_cross_entropy") {
                let a = this.activationOrOverride.activate(z);
                this.values_a[i] = a;
            }
            this.values_z[i] = z;
        }
        if(this.activationOrOverride == "softmax_cross_entropy") {
            softmaxLayer(this);
        }
    }
    clearGradients() {
        for(let i=0; i<this.size; i++) {
            this.biasGrads![i] = 0;
            for(let j=0; j<this.inputSize; j++) {
                this.weightGrads![i]![j] = 0;
            }
        }
    }
    backwardTarget(input: DenseLayer | Float32Array | number[], output: Float32Array | number[], error: LayerError = MseError, accumulate = true) {
        if(input instanceof DenseLayer)
            input = input.values_a;
        for(let i=0; i<this.size; i++) {
            let derr_dz;
            if(this.activationOrOverride == "softmax_cross_entropy") {
                derr_dz = this.values_a[i]! - output[i]!;
                this.derr_dz[i] = derr_dz;
            } else {
                const derr_da = error.derr_da(this, output, i);
                const da_dz = this.activationOrOverride.da_dz(this.values_z[i]!, this.values_a[i]!);
                derr_dz = derr_da * da_dz;
                this.derr_dz[i] = derr_dz;
            }
            for(let j=0; j<this.inputSize; j++) {
                const dz_dwij = input[j]!;
                const derr_dwij = derr_dz * dz_dwij;
                if(accumulate) this.weightGrads[i]![j]! += derr_dwij;
                else this.weightGrads[i]![j]! = derr_dwij;
            }
            if(accumulate) this.biasGrads[i]! += derr_dz;
            else this.biasGrads[i]! = derr_dz;
        }
    }
    backwardLayer(input: DenseLayer | Float32Array | number[], output: DenseLayer, accumulate = true) {
        if(input instanceof DenseLayer)
            input = input.values_a;
        for(let i=0; i<this.size; i++) {
            let derr_dai = 0;
            if(this.activationOrOverride == "softmax_cross_entropy")
                throw new Error("Cannot use softmax/cross-entropy on a hidden layer");
            const dai_dzi = this.activationOrOverride.da_dz(this.values_z[i]!, this.values_a[i]!);
            for(let j=0; j<output.size; j++)
                derr_dai += output.derr_dz[j]! * output.weights[j]![i]!;
            const derr_dz = derr_dai * dai_dzi
            this.derr_dz[i] = derr_dz;
            for(let j=0; j<this.inputSize; j++) {
                const dz_dwij = input[j]!;
                const derr_dwij = derr_dz * dz_dwij;
                if(accumulate) this.weightGrads[i]![j]! += derr_dwij;
                else this.weightGrads[i]![j]! = derr_dwij;
            }
            if(accumulate) this.biasGrads[i]! += derr_dz;
            else this.biasGrads[i]! = derr_dz;
        }
    }
    applyGradients(learnRate: number, batchSize: number, clearGradients = true) {
        this.optimizer.applyGradients(learnRate, batchSize, clearGradients);
    }
}

export class DenseNetwork {
    public layers: DenseLayer[] = [];
    input: Float32Array;
    batches = 0;
    constructor(public inputSize: number, layers: [size: number, activation: LayerActivation, optimizer?: LayerOptimizer, weightInit?: WeightRandomizer][]) {
        this.input = new Float32Array(inputSize);
        for(let i=0; i<layers.length; i++) {
            let layer = new DenseLayer(i==0 ? inputSize : layers[i-1]![0], layers[i]![0], layers[i]![1], layers[i]![2], layers[i]![3]);
            this.layers.push(layer);
        }
    }
    forward(values?: Float32Array | number[]) {
        let input: DenseLayer | Float32Array = this.input;
        if(values) this.input.set(values);
        for(const layer of this.layers) {
            layer.forward(input);
            input = layer;
        }
    }
    backward(output: Float32Array | number[], error: LayerError = MseError) {
        for(let i=this.layers.length-1; i>=0; i--) {
            const layer = this.layers[i]!;
            const prevLayer = i == 0 ? this.input : this.layers[i-1]!;
            if(i == this.layers.length-1) {
                layer.backwardTarget(prevLayer, output, error, true);
            } else {
                layer.backwardLayer(prevLayer, this.layers[i+1]!, true);
            }
        }
        this.batches++;
    }
    applyGradient(learnRate: number) {
        for(const layer of this.layers) {
            layer.applyGradients(learnRate, this.batches, true);
        }
        this.batches = 0;
    }
}