import EMath from "../utility/EMath";

export default class Vec3 {
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
    lengthSq(): number {
        return this.dot(this);
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
    distSqTo(other: Vec3): number {
        return this.sub(other).lengthSq();
    }
    distSqToC(x: number, y: number, z: number): number {
        return this.subC(x, y, z).lengthSq();
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