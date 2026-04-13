// compilation of all of the scripts i made that i use for 3d games

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

export class Vec3 {
    x: number;
    y: number;
    z: number;
    constructor(v: Vec3 | {x: number, y: number, z: number});
    constructor(x: number, y: number, z: number);
    constructor(x: number | {x:number, y:number, z:number}, y?: number, z?: number) {
        if(typeof x === "object") {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
        } else {
            this.x = x;
            this.y = y!;
            this.z = z!;
        }
    }

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
            case 0: return this.x;
            case 1: return this.y;
            case 2: return this.z;
        }
        return undefined;
    }
    set(i: number, v: number): void {
        switch(i) {
            case 0: this.x = v; return;
            case 1: this.y = v; return;
            case 2: this.z = v; return;
        }
    }
    setC(x: number, y: number, z: number): this {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        yield this.z;
    }
    toString(): string {
        return `<${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)}>`;
    }
    toArray(): [number, number, number] {
        return [this.x, this.y, this.z];
    }
    clone(): Vec3 {
        return new Vec3(this);
    }
    getAxisBit(): number {
        const ax = Math.abs(this.x);
        const ay = Math.abs(this.y);
        const az = Math.abs(this.z);
        if(ax > ay) {
            if(ax > az) {
                return 0b100;
            } else {
                return 0b001;
            }
        } else {
            if(ay > az) {
                return 0b010;
            } else {
                return 0b001;
            }
        }
    }

    // Calculations
    length(): number {
        return Math.sqrt(this.dot(this));
    }
    dot(other: Vec3): number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }
    dotC(x: number, y: number, z: number): number {
        return this.x * x + this.y * y + this.z * z;
    }
    cross(other: Vec3): Vec3 {
        return new Vec3(this.y * other.z - this.z * other.y, - (this.x * other.z - this.z * other.x), this.x * other.y - this.y * other.x);
    }
    crossC(x: number, y: number, z: number): Vec3 {
        return new Vec3(this.y * z - this.z * y, - (this.x * z - this.z * x), this.x * y - this.y * x);
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
        return this.x == other.x && this.y == other.y && this.z == other.z;
    }
    isClose(other: Vec3, e = 1e-6): boolean {
        return EMath.isClose(this.x, other.x, e) && EMath.isClose(this.y, other.y, e) && EMath.isClose(this.z, other.z, e);
    }
    isZero(e = 1e-6): boolean {
        return EMath.isZero(this.x, e) && EMath.isZero(this.y, e) && EMath.isZero(this.z, e);
    }
    pitch(): number {
        return Math.asin(this.y);
    }
    yaw(): number {
        return Math.atan2(-this.x, -this.z);
    }

    // Operations
    add(other: Vec3): Vec3 {
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    addSelf(other: Vec3): this {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }
    addC(x: number, y: number, z: number): Vec3 {
        return new Vec3(this.x + x, this.y + y, this.z + z);
    }
    addSelfC(x: number, y: number, z: number): this {
        this.x += x;
        this.y += y;
        this.z += z;
        return this;
    }
    addF(n: number): Vec3 {
        return new Vec3(this.x + n, this.y + n, this.z + n);
    }
    addSelfF(n: number): this {
        this.x += n;
        this.y += n;
        this.z += n;
        return this;
    }
    addScaled(other: Vec3, s: number): Vec3 {
        return this.clone().addScaledSelf(other, s);
    }
    addScaledSelf(other: Vec3, s: number): this {
        this.x += other.x * s;
        this.y += other.y * s;
        this.z += other.z * s;
        return this;
    }
    addScaledC(x: number, y: number, z: number, s: number): Vec3 {
        return this.clone().addScaledSelfC(x, y, z, s);
    }
    addScaledSelfC(x: number, y: number, z: number, s: number): this {
        this.x += x * s;
        this.y += y * s;
        this.z += z * s;
        return this;
    }
    sub(other: Vec3): Vec3 {
        return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
    }
    subSelf(other: Vec3): this {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }
    subC(x: number, y: number, z: number): Vec3 {
        return new Vec3(this.x - x, this.y - y, this.z - z);
    }
    subSelfC(x: number, y: number, z: number): this {
        this.x -= x;
        this.y -= y;
        this.z -= z;
        return this;
    }
    subF(n: number): Vec3 {
        return new Vec3(this.x - n, this.y - n, this.z - n);
    }
    subSelfF(n: number): this {
        this.x -= n;
        this.y -= n;
        this.z -= n;
        return this;
    }
    rsub(other: Vec3): Vec3 {
        return new Vec3(other.x - this.x, other.y - this.y, other.z - this.z);
    }
    rsubSelf(other: Vec3): this {
        this.x = other.x - this.x;
        this.y = other.y - this.y;
        this.z = other.z - this.z;
        return this;
    }
    rsubC(x: number, y: number, z: number): Vec3 {
        return new Vec3(x - this.x, y - this.y, z - this.z);
    }
    rsubSelfC(x: number, y: number, z: number): this {
        this.x = x - this.x;
        this.y = y - this.y;
        this.z = z - this.z;
        return this;
    }
    rsubF(n: number): Vec3 {
        return new Vec3(n - this.x, n - this.y, n - this.z);
    }
    rsubSelfF(n: number): this {
        this.x = n - this.x;
        this.y = n - this.y;
        this.z = n - this.z;
        return this;
    }
    mul(other: Vec3): Vec3 {
        return new Vec3(this.x * other.x, this.y * other.y, this.z * other.z);
    }
    mulSelf(other: Vec3): this {
        this.x *= other.x;
        this.y *= other.y;
        this.z *= other.z;
        return this;
    }
    mulC(x: number, y: number, z: number): Vec3 {
        return new Vec3(this.x * x, this.y * y, this.z * z);
    }
    mulSelfC(x: number, y: number, z: number): this {
        this.x *= x;
        this.y *= y;
        this.z *= z;
        return this;
    }
    mulF(n: number): Vec3 {
        return new Vec3(this.x * n, this.y * n, this.z * n);
    }
    mulSelfF(n: number): this {
        this.x *= n;
        this.y *= n;
        this.z *= n;
        return this;
    }
    div(other: Vec3): Vec3 {
        return new Vec3(this.x / other.x, this.y / other.y, this.z / other.z);
    }
    divSelf(other: Vec3): this {
        this.x /= other.x;
        this.y /= other.y;
        this.z /= other.z;
        return this;
    }
    divC(x: number, y: number, z: number): Vec3 {
        return new Vec3(this.x / x, this.y / y, this.z / z);
    }
    divSelfC(x: number, y: number, z: number): this {
        this.x /= x;
        this.y /= y;
        this.z /= z;
        return this;
    }
    divF(n: number): Vec3 {
        return new Vec3(this.x / n, this.y / n, this.z / n);
    }
    divSelfF(n: number): this {
        this.x /= n;
        this.y /= n;
        this.z /= n;
        return this;
    }
    rdiv(other: Vec3): Vec3 {
        return new Vec3(other.x / this.x, other.y / this.y, other.z / this.z);
    }
    rdivSelf(other: Vec3): this {
        this.x = other.x / this.x;
        this.y = other.y / this.y;
        this.z = other.z / this.z;
        return this;
    }
    rdivC(x: number, y: number, z: number): Vec3 {
        return new Vec3(x / this.x, y / this.y, z / this.z);
    }
    rdivSelfC(x: number, y: number, z: number): this {
        this.x = x / this.x;
        this.y = y / this.y;
        this.z = z / this.z;
        return this;
    }
    rdivF(n: number): Vec3 {
        return new Vec3(n / this.x, n / this.y, n / this.z);
    }
    rdivSelfF(n: number): this {
        this.x = n / this.x;
        this.y = n / this.y;
        this.z = n / this.z;
        return this;
    }
    neg(): Vec3 {
        return new Vec3(-this.x, -this.y, -this.z);
    }
    negSelf(): this {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }
    lerp(other: Vec3, t: number): Vec3 {
        return this.clone().lerpSelf(other, t);
    }
    lerpSelf(other: Vec3, t: number): this {
        this.x += (other.x - this.x) * t;
        this.y += (other.y - this.y) * t;
        this.z += (other.z - this.z) * t;
        return this;
    }
    lerpC(x: number, y: number, z: number, t: number): Vec3 {
        return this.clone().lerpSelfC(x, y, z, t);
    }
    lerpSelfC(x: number, y: number, z: number, t: number): this {
        this.x += (x - this.x) * t;
        this.y += (y - this.y) * t;
        this.z += (z - this.z) * t;
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
        this.y = 0;
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
        this.x = method(this.x, 0);
        this.y = method(this.y, 1);
        this.z = method(this.z, 2);
        return this;
    }
    rotX(a: number): Vec3 {
        return this.clone().rotXSelf(a);
    }
    rotXSelf(a: number): this {
        const s = Math.sin(a), c = Math.cos(a);
        const y = this.y * c - this.z * s;
        this.z = this.y * s + this.z * c;
        this.y = y;
        return this;
    }
    rotY(a: number): Vec3 {
        return this.clone().rotYSelf(a);
    }
    rotYSelf(a: number): this {
        const s = Math.sin(a), c = Math.cos(a);
        const z = this.z * c - this.x * s;
        this.x = this.x * c + this.z * s;
        this.z = z;
        return this;
    }
    rotZ(a: number): Vec3 {
        return this.clone().rotZSelf(a);
    }
    rotZSelf(a: number): this {
        const s = Math.sin(a), c = Math.cos(a);
        const x = this.x * c - this.y * s;
        this.y = this.x * s + this.y * c;
        this.x = x;
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
        let x = this.x, y = this.y, z = this.z;
        this.x = x * c + cross.x * s + axis.x * dot * (1 - c);
        this.y = y * c + cross.y * s + axis.y * dot * (1 - c);
        this.z = z * c + cross.z * s + axis.z * dot * (1 - c);
        return this;
    }
    rotXYZ(rot: Vec3): Vec3 {
        return this.clone().rotXYZSelf(rot);
    }
    rotXYZSelf(rot: Vec3): this {
        return this.rotXSelf(rot.x).rotYSelf(rot.y).rotZSelf(rot.z);
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
        return this.rotZSelf(rot.z).rotYSelf(rot.y).rotXSelf(rot.x);
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


// Column-major 4x4 matrix
export abstract class Mat4 {
    constructor() {

    }
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
    static randomConstant3(a: number, b: number, c: number) : number {
        const it = (a * 2394823549) ^ (b * 43859742850) ^ (c * 23094565234);
        return EMath.pmod(it, 10000) / 10000;
    }
    static randomConstant4(a: number, b: number, c: number, d: number) : number {
        const it = (a * 2394823549) ^ (b * 43859742850) ^ (c * 23094565234) ^ (d * 8427824566);
        return EMath.pmod(it, 10000) / 10000;
    }
}



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

export class Camera3D {
    private _fovY: number = 95/180*Math.PI;
    get fovY() {
        return this._fovY;
    }
    set fovY(n: number) {
        this._fovY = n;
        this._perspectiveMatrixU = true;
    }

    private _aspect: number = 1;
    get aspect() {
        return this._aspect;
    }
    set aspect(n: number) {
        this._aspect = n;
        this._perspectiveMatrixU = true;
    }

    private _near: number = 0.1;
    get near() {
        return this._near;
    }
    set near(n: number) {
        this._near = n;
        this._perspectiveMatrixU = true;
    }

    private _far: number = 10000;
    get far() {
        return this._far;
    }
    set far(n: number) {
        this._far = n;
        this._perspectiveMatrixU = true;
    }

    private _position = Vec3.zero();
    get position() {
        return this._position;
    }
    set position(v: Vec3) {
        this._position = v;
        this._translationMatrixU = true;
        this._viewMatrixU = true;
    }

    private _worldScale = 1;
    get worldScale() {
        return this._worldScale;
    }
    set worldScale(n: number) {
        this._worldScale = n;
        this._translationMatrixU = true;
        this._viewMatrixU = true;
    }

    private _rotation = Vec3.zero();
    get rotation() {
        return this._rotation;
    }
    set rotation(v: Vec3) {
        this._rotation = v;
        this._forwardU = true;
        this._rightU = true;
        this._upU = true;
        this._forwardFlatU = true;
        this._rotationMatrixU = true;
        this._viewMatrixU = true;
    }

    private _forward = Vec3.zero();
    private _forwardU = true;
    get forward() {
        if(this._forwardU) {
            this._forward = Vec3.zAxis().negSelf().rotXYZSelf(this._rotation);
            this._forwardU = false;
        }
        return this._forward;
    }

    private _right = Vec3.zero();
    private _rightU = true;
    get right() {
        if(this._rightU) {
            this._right = Vec3.xAxis().rotXYZSelf(this._rotation);
            this._rightU = false;
        }
        return this._right;
    }

    private _up = Vec3.zero();
    private _upU = true;
    get up() {
        if(this._upU) {
            this._up = Vec3.yAxis().rotXYZSelf(this._rotation);
            this._upU = false;
        }
        return this._up;
    }

    private _forwardFlat = Vec3.zero();
    private _forwardFlatU = true;
    get forwardFlat() {
        if(this._forwardFlatU) {
            this._forwardFlat = Vec3.zAxis().negSelf().rotYSelf(this._rotation.y);
            this._forwardFlatU = false;
        }
        return this._forwardFlat;
    }

    private _perspectiveMatrix: number[] = [];
    private _perspectiveMatrixU = true;
    get perspectiveMatrix() {
        if(this._perspectiveMatrixU) {
            this._perspectiveMatrix = Mat4.perspective(this._fovY, this._aspect, this._near, this._far);
            this._perspectiveMatrixU = false;
            this.perspectiveMatrixChangeEvent.fire(this._perspectiveMatrix);
        }
        return this._perspectiveMatrix;
    }

    private _translationMatrix: number[] = [];
    private _translationMatrixU = true;
    get translationMatrix() {
        if(this._translationMatrixU) {
            this._translationMatrix = Mat4.translate(-this._position.x * this._worldScale, -this._position.y * this._worldScale, -this._position.z * this._worldScale);
            this._translationMatrixU = false;
            this.translationMatrixChangeEvent.fire(this._viewMatrix);
        }
        return this._translationMatrix;
    }

    private _rotationMatrix: number[] = [];
    private _rotationMatrixU = true;
    get rotationMatrix() {
        if(this._rotationMatrixU) {
            this._rotationMatrix = Mat4.multiply(
                Mat4.rotateZ(-this._rotation.z),
                Mat4.multiply(
                    Mat4.rotateX(-this._rotation.x),
                    Mat4.rotateY(-this._rotation.y),
                )
            );
            this._rotationMatrixU = false;
            this.rotationMatrixChangeEvent.fire(this._viewMatrix);
        }
        return this._rotationMatrix;
    }

    private _viewMatrix: number[] = [];
    private _viewMatrixU = true;
    get viewMatrix() {
        if(this._viewMatrixU) {
            this._viewMatrix = Mat4.multiply(this.rotationMatrix, this.translationMatrix);
            this._viewMatrixU = false;
            this.viewMatrixChangeEvent.fire(this._viewMatrix);
        }
        return this._viewMatrix;
    }

    public perspectiveMatrixChangeEvent = new Signal({ onConnect: conn => conn.fire(this.perspectiveMatrix) });
    public viewMatrixChangeEvent = new Signal({ onConnect: conn => conn.fire(this.viewMatrix) });
    public rotationMatrixChangeEvent = new Signal({ onConnect: conn => conn.fire(this.rotationMatrix) });
    public translationMatrixChangeEvent = new Signal({ onConnect: conn => conn.fire(this.translationMatrix) });

    constructor(position?: Vec3, fovY?: number, aspect?: number, near?: number, far?: number) {
        if(position) this.position = position;
        if(fovY) this.fovY = fovY;
        if(aspect) this.aspect = aspect;
        if(near) this.near = near;
        if(far) this.far = far;
    }

    lookAt(p: Vec3) {
        let f = this.position.look(p);
        this.rotation = new Vec3(f.pitch(), f.yaw(), 0);
    }
}


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
    setActive() {
        this.cProgram.setActive();
    }
}

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

export function voxelRaymarch<T>(
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

export function intersectsWithBox(
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

export class PointerLock {
    connections = new ConnectionGroup();
    pointerLockChangeEvent = new Signal();
    lockedMouseMoveEvent = new Signal();
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

export class FullscreenResize {
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


export class Color {
    // RGB 0-255
    r: number;
    g: number;
    b: number;
    // Alpha 0-100
    a: number;
    constructor(r: number, g: number, b: number, a: number = 100) {
        this.r = EMath.clamp(r, 0, 255);
        this.g = EMath.clamp(g, 0, 255);
        this.b = EMath.clamp(b, 0, 255);
        this.a = EMath.clamp(a, 0, 100);
    }
    static fromHSV(h: number, s: number, v: number, a: number = 100) {
        h = EMath.pmod(h, 360);
        s = EMath.clamp(s, 0, 100);
        v = EMath.clamp(v, 0 ,100);
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
        const r = Math.round((rp + m) * 255);
        const g = Math.round((gp + m) * 255);
        const b = Math.round((bp + m) * 255);
        return new Color(r, g, b, a);
    }
    toHSV() {
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
        return { h, s, v, a:this.a };
    }
    lerp(other: Color, t: number): Color {
        return new Color(
            this.r + (other.r - this.r) * t,
            this.g + (other.g - this.g) * t,
            this.b + (other.b - this.b) * t,
            this.a + (other.a - this.a) * t,
        )
    }
    getIsForegroundWhite(threshold = 0.42) {
        let {r, g, b} = this;
        r = (r < 0.03928) ? (r / 12.92) : (((r + 0.055) / 1.055) ^ 2.4)
        g = (g < 0.03928) ? (g / 12.92) : (((g + 0.055) / 1.055) ^ 2.4)
        b = (b < 0.03928) ? (b / 12.92) : (((b + 0.055) / 1.055) ^ 2.4)
        let l = 0.2126 * r + 0.7152 * g + 0.0722 * b
        return l < threshold;
    }
    toString(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a/100})`;
    }
    toArray(): [r: number, g: number, b:number, a:number] {
        return [this.r, this.g, this.b, this.a];
    }
}