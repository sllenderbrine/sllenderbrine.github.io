// 3D/2D JS Game Engine Library
// https://github.com/sllenderbrine
//  DELAY UTILITY  //
export const delay = (ms) => new Promise(res => setTimeout(res, ms));
///////////////////
//  EMATH CLASS  //
///////////////////
export class EMath {
    static clamp(n, a, b) {
        return Math.min(Math.max(n, a), b);
    }
    static lerp(a, b, t) {
        return a + (b - a) * t;
    }
    static pmod(x, a) {
        return ((x % a) + a) % a;
    }
    static isClose(a, b, e = 1e-6) {
        return Math.abs(a - b) < e;
    }
    static isZero(v, e = 1e-6) {
        return Math.abs(v) < e;
    }
}
///////////////////
//  ARRAY UTILS  //
///////////////////
export class ArrayUtils {
    static shuffleSelf(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}
//////////////////////
//  VECTOR CLASSES  //
//////////////////////
export class Vec3 {
    _x;
    _y;
    _z;
    onMutate;
    constructor(x, y, z) {
        if (typeof x === "object") {
            this._x = x.x;
            this._y = x.y;
            this._z = x.z;
        }
        else {
            this._x = x;
            this._y = y;
            this._z = z;
        }
    }
    mutate() {
        if (this.onMutate)
            this.onMutate();
    }
    set x(value) {
        this._x = value;
        this.mutate();
    }
    get x() { return this._x; }
    set y(value) {
        this._y = value;
        this.mutate();
    }
    get y() { return this._y; }
    set z(value) {
        this._z = value;
        this.mutate();
    }
    get z() { return this._z; }
    // Static Constructors
    static fill(n) { return new Vec3(n, n, n); }
    static zero() { return Vec3.fill(0); }
    static one() { return Vec3.fill(1); }
    static xAxis() { return new Vec3(1, 0, 0); }
    static yAxis() { return new Vec3(0, 1, 0); }
    static zAxis() { return new Vec3(0, 0, 1); }
    static random() {
        const z = Math.random() * 2 - 1;
        const a = Math.random() * 2 * Math.PI;
        const b = Math.sqrt(Math.max(0, 1 - z * z));
        return new Vec3(b * Math.cos(a), b * Math.sin(a), z);
    }
    static randomRotation() {
        const v = Vec3.random();
        return new Vec3(v.pitch(), v.yaw(), Math.random() * 2 * Math.PI);
    }
    // Miscellaneous
    getI(i) {
        switch (i) {
            case 0: return this._x;
            case 1: return this._y;
            case 2: return this._z;
        }
        return undefined;
    }
    setI(i, v) {
        switch (i) {
            case 0:
                this._x = v;
                this.mutate();
                return;
            case 1:
                this._y = v;
                this.mutate();
                return;
            case 2:
                this._z = v;
                this.mutate();
                return;
        }
    }
    set(other) {
        this._x = other._x;
        this._y = other._y;
        this._z = other._z;
        this.mutate();
        return this;
    }
    setC(x, y, z) {
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
    toString() {
        return `<${this._x.toFixed(2)}, ${this._y.toFixed(2)}, ${this._z.toFixed(2)}>`;
    }
    toArray() {
        return [this._x, this._y, this._z];
    }
    clone() {
        return new Vec3(this);
    }
    getPrimaryAxis() {
        const ax = Math.abs(this._x);
        const ay = Math.abs(this._y);
        const az = Math.abs(this._z);
        if (ax > ay)
            return ax > az ? 0 : 2;
        else
            return ay > az ? 1 : 2;
    }
    // Calculations
    length() {
        return Math.sqrt(this.dot(this));
    }
    lengthSq() {
        return this.dot(this);
    }
    dot(other) {
        return this._x * other._x + this._y * other._y + this._z * other._z;
    }
    dotC(x, y, z) {
        return this._x * x + this._y * y + this._z * z;
    }
    cross(other) {
        return new Vec3(this._y * other._z - this._z * other._y, -(this._x * other._z - this._z * other._x), this._x * other._y - this._y * other._x);
    }
    crossC(x, y, z) {
        return new Vec3(this._y * z - this._z * y, -(this._x * z - this._z * x), this._x * y - this._y * x);
    }
    angleTo(other) {
        const c = this.length() * other.length();
        if (c === 0)
            return 0;
        return Math.acos(EMath.clamp(this.dot(other) / c, -1, 1));
    }
    signedAngleTo(other, reference = Vec3.yAxis()) {
        const angle = this.angleTo(other);
        const normal = this.cross(other).normSelf();
        if (normal.dot(reference.norm()) > 0)
            return -angle;
        return angle;
    }
    distTo(other) {
        return this.sub(other).length();
    }
    distToC(x, y, z) {
        return this.subC(x, y, z).length();
    }
    distSqTo(other) {
        return this.sub(other).lengthSq();
    }
    distSqToC(x, y, z) {
        return this.subC(x, y, z).lengthSq();
    }
    strictEquals(other) {
        return this._x == other._x && this._y == other._y && this._z == other._z;
    }
    isClose(other, e = 1e-6) {
        return EMath.isClose(this._x, other._x, e) && EMath.isClose(this._y, other._y, e) && EMath.isClose(this._z, other._z, e);
    }
    isZero(e = 1e-6) {
        return EMath.isZero(this._x, e) && EMath.isZero(this._y, e) && EMath.isZero(this._z, e);
    }
    pitch() {
        return Math.asin(this._y);
    }
    yaw() {
        return Math.atan2(-this._x, -this._z);
    }
    // Operations
    add(other) {
        return new Vec3(this._x + other._x, this._y + other._y, this._z + other._z);
    }
    addSelf(other) {
        this._x += other._x;
        this._y += other._y;
        this._z += other._z;
        this.mutate();
        return this;
    }
    addC(x, y, z) {
        return new Vec3(this._x + x, this._y + y, this._z + z);
    }
    addSelfC(x, y, z) {
        this._x += x;
        this._y += y;
        this._z += z;
        this.mutate();
        return this;
    }
    addF(n) {
        return new Vec3(this._x + n, this._y + n, this._z + n);
    }
    addSelfF(n) {
        this._x += n;
        this._y += n;
        this._z += n;
        this.mutate();
        return this;
    }
    addScaled(other, s) {
        return this.clone().addScaledSelf(other, s);
    }
    addScaledSelf(other, s) {
        this._x += other._x * s;
        this._y += other._y * s;
        this._z += other._z * s;
        this.mutate();
        return this;
    }
    addScaledC(x, y, z, s) {
        return this.clone().addScaledSelfC(x, y, z, s);
    }
    addScaledSelfC(x, y, z, s) {
        this._x += x * s;
        this._y += y * s;
        this._z += z * s;
        this.mutate();
        return this;
    }
    sub(other) {
        return new Vec3(this._x - other._x, this._y - other._y, this._z - other._z);
    }
    subSelf(other) {
        this._x -= other._x;
        this._y -= other._y;
        this._z -= other._z;
        this.mutate();
        return this;
    }
    subC(x, y, z) {
        return new Vec3(this._x - x, this._y - y, this._z - z);
    }
    subSelfC(x, y, z) {
        this._x -= x;
        this._y -= y;
        this._z -= z;
        this.mutate();
        return this;
    }
    subF(n) {
        return new Vec3(this._x - n, this._y - n, this._z - n);
    }
    subSelfF(n) {
        this._x -= n;
        this._y -= n;
        this._z -= n;
        this.mutate();
        return this;
    }
    rsub(other) {
        return new Vec3(other._x - this._x, other._y - this._y, other._z - this._z);
    }
    rsubSelf(other) {
        this._x = other._x - this._x;
        this._y = other._y - this._y;
        this._z = other._z - this._z;
        this.mutate();
        return this;
    }
    rsubC(x, y, z) {
        return new Vec3(x - this._x, y - this._y, z - this._z);
    }
    rsubSelfC(x, y, z) {
        this._x = x - this._x;
        this._y = y - this._y;
        this._z = z - this._z;
        this.mutate();
        return this;
    }
    rsubF(n) {
        return new Vec3(n - this._x, n - this._y, n - this._z);
    }
    rsubSelfF(n) {
        this._x = n - this._x;
        this._y = n - this._y;
        this._z = n - this._z;
        this.mutate();
        return this;
    }
    mul(other) {
        return new Vec3(this._x * other._x, this._y * other._y, this._z * other._z);
    }
    mulSelf(other) {
        this._x *= other._x;
        this._y *= other._y;
        this._z *= other._z;
        this.mutate();
        return this;
    }
    mulC(x, y, z) {
        return new Vec3(this._x * x, this._y * y, this._z * z);
    }
    mulSelfC(x, y, z) {
        this._x *= x;
        this._y *= y;
        this._z *= z;
        this.mutate();
        return this;
    }
    mulF(n) {
        return new Vec3(this._x * n, this._y * n, this._z * n);
    }
    mulSelfF(n) {
        this._x *= n;
        this._y *= n;
        this._z *= n;
        this.mutate();
        return this;
    }
    div(other) {
        return new Vec3(this._x / other._x, this._y / other._y, this._z / other._z);
    }
    divSelf(other) {
        this._x /= other._x;
        this._y /= other._y;
        this._z /= other._z;
        this.mutate();
        return this;
    }
    divC(x, y, z) {
        return new Vec3(this._x / x, this._y / y, this._z / z);
    }
    divSelfC(x, y, z) {
        this._x /= x;
        this._y /= y;
        this._z /= z;
        this.mutate();
        return this;
    }
    divF(n) {
        return new Vec3(this._x / n, this._y / n, this._z / n);
    }
    divSelfF(n) {
        this._x /= n;
        this._y /= n;
        this._z /= n;
        this.mutate();
        return this;
    }
    rdiv(other) {
        return new Vec3(other._x / this._x, other._y / this._y, other._z / this._z);
    }
    rdivSelf(other) {
        this._x = other._x / this._x;
        this._y = other._y / this._y;
        this._z = other._z / this._z;
        this.mutate();
        return this;
    }
    rdivC(x, y, z) {
        return new Vec3(x / this._x, y / this._y, z / this._z);
    }
    rdivSelfC(x, y, z) {
        this._x = x / this._x;
        this._y = y / this._y;
        this._z = z / this._z;
        this.mutate();
        return this;
    }
    rdivF(n) {
        return new Vec3(n / this._x, n / this._y, n / this._z);
    }
    rdivSelfF(n) {
        this._x = n / this._x;
        this._y = n / this._y;
        this._z = n / this._z;
        this.mutate();
        return this;
    }
    neg() {
        return new Vec3(-this._x, -this._y, -this._z);
    }
    negSelf() {
        this._x = -this._x;
        this._y = -this._y;
        this._z = -this._z;
        this.mutate();
        return this;
    }
    lerp(other, t) {
        return this.clone().lerpSelf(other, t);
    }
    lerpSelf(other, t) {
        this._x += (other._x - this._x) * t;
        this._y += (other._y - this._y) * t;
        this._z += (other._z - this._z) * t;
        this.mutate();
        return this;
    }
    lerpC(x, y, z, t) {
        return this.clone().lerpSelfC(x, y, z, t);
    }
    lerpSelfC(x, y, z, t) {
        this._x += (x - this._x) * t;
        this._y += (y - this._y) * t;
        this._z += (z - this._z) * t;
        this.mutate();
        return this;
    }
    norm() {
        return this.clone().normSelf();
    }
    normSelf() {
        const mag = this.length();
        if (mag === 0)
            return this;
        return this.divSelfC(mag, mag, mag);
    }
    rescale(mag) {
        return this.clone().rescaleSelf(mag);
    }
    rescaleSelf(mag) {
        return this.normSelf().mulSelfC(mag, mag, mag);
    }
    look(other) {
        return this.clone().lookSelf(other);
    }
    lookSelf(other) {
        return this.rsubSelf(other).normSelf();
    }
    clampLength(a, b) {
        return this.clone().clampLengthSelf(a, b);
    }
    clampLengthSelf(a, b) {
        return this.rescaleSelf(EMath.clamp(this.length(), a, b));
    }
    flat() {
        return this.clone().flatSelf();
    }
    flatSelf() {
        this._y = 0;
        this.mutate();
        return this;
    }
    flatNorm() {
        return this.clone().flatNormSelf();
    }
    flatNormSelf() {
        return this.flatSelf().normSelf();
    }
    setDot(other, target) {
        return this.clone().setDotSelf(other, target);
    }
    setDotSelf(other, target) {
        const d = other.dot(other);
        if (d === 0)
            return this;
        return this.addScaledSelf(other, (target - this.dot(other)) / d);
    }
    setDotC(x, y, z, target) {
        return this.clone().setDotSelfC(x, y, z, target);
    }
    setDotSelfC(x, y, z, target) {
        const d = x * x + y * y + z * z;
        if (d === 0)
            return this;
        return this.addScaledSelfC(x, y, z, (target - this.dotC(x, y, z)) / d);
    }
    map(method) {
        return this.clone().mapSelf(method);
    }
    mapSelf(method) {
        this._x = method(this._x, 0);
        this._y = method(this._y, 1);
        this._z = method(this._z, 2);
        this.mutate();
        return this;
    }
    rotX(a) {
        return this.clone().rotXSelf(a);
    }
    rotXSelf(a) {
        const s = Math.sin(a), c = Math.cos(a);
        const y = this._y * c - this._z * s;
        this._z = this._y * s + this._z * c;
        this._y = y;
        this.mutate();
        return this;
    }
    rotY(a) {
        return this.clone().rotYSelf(a);
    }
    rotYSelf(a) {
        const s = Math.sin(a), c = Math.cos(a);
        const z = this._z * c - this._x * s;
        this._x = this._x * c + this._z * s;
        this._z = z;
        this.mutate();
        return this;
    }
    rotZ(a) {
        return this.clone().rotZSelf(a);
    }
    rotZSelf(a) {
        const s = Math.sin(a), c = Math.cos(a);
        const x = this._x * c - this._y * s;
        this._y = this._x * s + this._y * c;
        this._x = x;
        this.mutate();
        return this;
    }
    rotAxis(axis, angle) {
        return this.clone().rotAxisSelf(axis, angle);
    }
    rotAxisSelf(axis, angle) {
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
    rotXYZ(rot) {
        return this.clone().rotXYZSelf(rot);
    }
    rotXYZSelf(rot) {
        return this.rotXSelf(rot._x).rotYSelf(rot._y).rotZSelf(rot._z);
    }
    rotXYZC(x, y, z) {
        return this.clone().rotXYZSelfC(x, y, z);
    }
    rotXYZSelfC(x, y, z) {
        return this.rotXSelf(x).rotYSelf(y).rotZSelf(z);
    }
    rotZYX(rot) {
        return this.clone().rotZYXSelf(rot);
    }
    rotZYXSelf(rot) {
        return this.rotZSelf(rot._z).rotYSelf(rot._y).rotXSelf(rot._x);
    }
    rotZYXC(x, y, z) {
        return this.clone().rotZYXSelfC(x, y, z);
    }
    rotZYXSelfC(x, y, z) {
        return this.rotZSelf(z).rotYSelf(y).rotXSelf(x);
    }
}
export class Vec2 {
    constructor(x, y) {
        if (typeof x === "object") {
            this._x = x.x;
            this._y = x.y;
        }
        else {
            this._x = x;
            this._y = y;
        }
    }
    _x;
    get x() { return this._x; }
    set x(value) {
        this._x = value;
        this.mutate();
    }
    _y;
    get y() { return this._y; }
    set y(value) {
        this._y = value;
        this.mutate();
    }
    onMutate;
    mutate() {
        if (this.onMutate)
            this.onMutate();
    }
    // Static Constructors
    static fill(n) { return new Vec2(n, n); }
    static zero() { return Vec2.fill(0); }
    static one() { return Vec2.fill(1); }
    static xAxis() { return new Vec2(1, 0); }
    static yAxis() { return new Vec2(0, 1); }
    static random() {
        const a = Math.random() * 2 * Math.PI;
        return new Vec2(Math.cos(a), Math.sin(a));
    }
    // Miscellaneous
    getI(i) {
        switch (i) {
            case 0: return this._x;
            case 1: return this._y;
        }
        return undefined;
    }
    setI(i, v) {
        switch (i) {
            case 0:
                this._x = v;
                return;
            case 1:
                this._y = v;
                return;
        }
        this.mutate();
    }
    set(other) {
        this._x = other._x;
        this._y = other._y;
        this.mutate();
        return this;
    }
    setC(x, y) {
        this._x = x;
        this._y = y;
        this.mutate();
        return this;
    }
    *[Symbol.iterator]() {
        yield this._x;
        yield this._y;
    }
    toString() {
        return `<${this._x.toFixed(2)}, ${this._y.toFixed(2)}>`;
    }
    toArray() {
        return [this._x, this._y];
    }
    clone() {
        return new Vec2(this);
    }
    // Calculations
    length() {
        return Math.sqrt(this.dot(this));
    }
    lengthSq() {
        return this.dot(this);
    }
    dot(other) {
        return this._x * other._x + this._y * other._y;
    }
    dotC(x, y) {
        return this._x * x + this._y * y;
    }
    angleTo(other) {
        const c = this.length() * other.length();
        if (c === 0)
            return 0;
        return Math.acos(EMath.clamp(this.dot(other) / c, -1, 1));
    }
    signedAngleTo(other) {
        return Math.atan2(this._x * other._y - this._y * other._x, this.dot(other));
    }
    distTo(other) {
        return this.sub(other).length();
    }
    distToC(x, y) {
        return this.subC(x, y).length();
    }
    distSqTo(other) {
        return this.sub(other).lengthSq();
    }
    distSqToC(x, y) {
        return this.subC(x, y).lengthSq();
    }
    strictEquals(other) {
        return this._x == other._x && this._y == other._y;
    }
    isClose(other, e = 1e-6) {
        return EMath.isClose(this._x, other._x, e) && EMath.isClose(this._y, other._y, e);
    }
    isZero(e = 1e-6) {
        return EMath.isZero(this._x, e) && EMath.isZero(this._y, e);
    }
    theta() {
        return Math.atan2(this._y, this._x);
    }
    // Operations
    add(other) {
        return new Vec2(this._x + other._x, this._y + other._y);
    }
    addSelf(other) {
        this._x += other._x;
        this._y += other._y;
        this.mutate();
        return this;
    }
    addC(x, y) {
        return new Vec2(this._x + x, this._y + y);
    }
    addSelfC(x, y) {
        this._x += x;
        this._y += y;
        this.mutate();
        return this;
    }
    addF(n) {
        return new Vec2(this._x + n, this._y + n);
    }
    addSelfF(n) {
        this._x += n;
        this._y += n;
        this.mutate();
        return this;
    }
    addScaled(other, s) {
        return this.clone().addScaledSelf(other, s);
    }
    addScaledSelf(other, s) {
        this._x += other._x * s;
        this._y += other._y * s;
        this.mutate();
        return this;
    }
    addScaledC(x, y, s) {
        return this.clone().addScaledSelfC(x, y, s);
    }
    addScaledSelfC(x, y, s) {
        this._x += x * s;
        this._y += y * s;
        this.mutate();
        return this;
    }
    sub(other) {
        return new Vec2(this._x - other._x, this._y - other._y);
    }
    subSelf(other) {
        this._x -= other._x;
        this._y -= other._y;
        this.mutate();
        return this;
    }
    subC(x, y) {
        return new Vec2(this._x - x, this._y - y);
    }
    subSelfC(x, y) {
        this._x -= x;
        this._y -= y;
        this.mutate();
        return this;
    }
    subF(n) {
        return new Vec2(this._x - n, this._y - n);
    }
    subSelfF(n) {
        this._x -= n;
        this._y -= n;
        this.mutate();
        return this;
    }
    rsub(other) {
        return new Vec2(other._x - this._x, other._y - this._y);
    }
    rsubSelf(other) {
        this._x = other._x - this._x;
        this._y = other._y - this._y;
        this.mutate();
        return this;
    }
    rsubC(x, y) {
        return new Vec2(x - this._x, y - this._y);
    }
    rsubSelfC(x, y) {
        this._x = x - this._x;
        this._y = y - this._y;
        this.mutate();
        return this;
    }
    rsubF(n) {
        return new Vec2(n - this._x, n - this._y);
    }
    rsubSelfF(n) {
        this._x = n - this._x;
        this._y = n - this._y;
        return this;
    }
    mul(other) {
        return new Vec2(this._x * other._x, this._y * other._y);
    }
    mulSelf(other) {
        this._x *= other._x;
        this._y *= other._y;
        this.mutate();
        return this;
    }
    mulC(x, y) {
        return new Vec2(this._x * x, this._y * y);
    }
    mulSelfC(x, y) {
        this._x *= x;
        this._y *= y;
        this.mutate();
        return this;
    }
    mulF(n) {
        return new Vec2(this._x * n, this._y * n);
    }
    mulSelfF(n) {
        this._x *= n;
        this._y *= n;
        this.mutate();
        return this;
    }
    div(other) {
        return new Vec2(this._x / other._x, this._y / other._y);
    }
    divSelf(other) {
        this._x /= other._x;
        this._y /= other._y;
        this.mutate();
        return this;
    }
    divC(x, y) {
        return new Vec2(this._x / x, this._y / y);
    }
    divSelfC(x, y) {
        this._x /= x;
        this._y /= y;
        this.mutate();
        return this;
    }
    divF(n) {
        return new Vec2(this._x / n, this._y / n);
    }
    divSelfF(n) {
        this._x /= n;
        this._y /= n;
        this.mutate();
        return this;
    }
    rdiv(other) {
        return new Vec2(other._x / this._x, other._y / this._y);
    }
    rdivSelf(other) {
        this._x = other._x / this._x;
        this._y = other._y / this._y;
        this.mutate();
        return this;
    }
    rdivC(x, y) {
        return new Vec2(x / this._x, y / this._y);
    }
    rdivSelfC(x, y) {
        this._x = x / this._x;
        this._y = y / this._y;
        this.mutate();
        return this;
    }
    rdivF(n) {
        return new Vec2(n / this._x, n / this._y);
    }
    rdivSelfF(n) {
        this._x = n / this._x;
        this._y = n / this._y;
        this.mutate();
        return this;
    }
    neg() {
        return new Vec2(-this._x, -this._y);
    }
    negSelf() {
        this._x = -this._x;
        this._y = -this._y;
        this.mutate();
        return this;
    }
    lerp(other, t) {
        return this.clone().lerpSelf(other, t);
    }
    lerpSelf(other, t) {
        this._x += (other._x - this._x) * t;
        this._y += (other._y - this._y) * t;
        this.mutate();
        return this;
    }
    lerpC(x, y, t) {
        return this.clone().lerpSelfC(x, y, t);
    }
    lerpSelfC(x, y, t) {
        this._x += (x - this._x) * t;
        this._y += (y - this._y) * t;
        this.mutate();
        return this;
    }
    norm() {
        return this.clone().normSelf();
    }
    normSelf() {
        const mag = this.length();
        if (mag === 0)
            return this;
        return this.divSelfC(mag, mag);
    }
    rescale(mag) {
        return this.clone().rescaleSelf(mag);
    }
    rescaleSelf(mag) {
        return this.normSelf().mulSelfC(mag, mag);
    }
    look(other) {
        return this.clone().lookSelf(other);
    }
    lookSelf(other) {
        return this.rsubSelf(other).normSelf();
    }
    clampLength(a, b) {
        return this.clone().clampLengthSelf(a, b);
    }
    clampLengthSelf(a, b) {
        return this.rescaleSelf(EMath.clamp(this.length(), a, b));
    }
    setDot(other, target) {
        return this.clone().setDotSelf(other, target);
    }
    setDotSelf(other, target) {
        const d = other.dot(other);
        if (d === 0)
            return this;
        return this.addScaledSelf(other, (target - this.dot(other)) / d);
    }
    setDotC(x, y, target) {
        return this.clone().setDotSelfC(x, y, target);
    }
    setDotSelfC(x, y, target) {
        const d = x * x + y * y;
        if (d === 0)
            return this;
        return this.addScaledSelfC(x, y, (target - this.dotC(x, y)) / d);
    }
    map(method) {
        return this.clone().mapSelf(method);
    }
    mapSelf(method) {
        this._x = method(this._x, 0);
        this._y = method(this._y, 1);
        this.mutate();
        return this;
    }
    rotate(a) {
        return this.clone().rotateSelf(a);
    }
    rotateSelf(a) {
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
export class Mat4 {
    constructor() { }
    static new() {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    }
    static translate(x, y, z) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1,
        ];
    }
    static scale(x, y, z) {
        return [
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1,
        ];
    }
    static rotateX(a) {
        const c = Math.cos(a);
        const s = Math.sin(a);
        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        ];
    }
    static rotateY(a) {
        const c = Math.cos(a);
        const s = Math.sin(a);
        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ];
    }
    static rotateZ(a) {
        const c = Math.cos(a);
        const s = Math.sin(a);
        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }
    static perspective(fovY, aspect, near = 1, far = 1000) {
        const f = 1 / Math.tan(fovY / 2);
        const nf = 1 / (near - far);
        return [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, (2 * far * near) * nf, 0
        ];
    }
    static multiply(m1, m2) {
        const out = Mat4.new();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                out[i * 4 + j] = (m1[0 * 4 + j] * m2[i * 4 + 0]
                    + m1[1 * 4 + j] * m2[i * 4 + 1]
                    + m1[2 * 4 + j] * m2[i * 4 + 2]
                    + m1[3 * 4 + j] * m2[i * 4 + 3]);
            }
        }
        return out;
    }
}
// Column-major 3x3 matrix
export class Mat3 {
    constructor() { }
    static new() {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ];
    }
    static translate(x, y) {
        return [
            1, 0, 0,
            0, 1, 0,
            x, y, 1,
        ];
    }
    static scale(x, y) {
        return [
            x, 0, 0,
            0, y, 0,
            0, 0, 1,
        ];
    }
    static rotate(a) {
        const c = Math.cos(a);
        const s = Math.sin(a);
        return [
            c, s, 0,
            -s, c, 0,
            0, 0, 1,
        ];
    }
    static multiply(m1, m2) {
        const out = Mat3.new();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                out[i * 3 + j] = (m1[0 * 3 + j] * m2[i * 3 + 0]
                    + m1[1 * 3 + j] * m2[i * 3 + 1]
                    + m1[2 * 3 + j] * m2[i * 3 + 2]);
            }
        }
        return out;
    }
}
///////////////////
//  NOISE CLASS  //
///////////////////
export class Noise {
    static randomConstant3(a, b, c) {
        const it = (a * 2394823549) ^ (b * 43859742850) ^ (c * 23094565234);
        return EMath.pmod(it, 10000) / 10000;
    }
    static randomConstant4(a, b, c, d) {
        const it = (a * 2394823549) ^ (b * 43859742850) ^ (c * 23094565234) ^ (d * 8427824566);
        return EMath.pmod(it, 10000) / 10000;
    }
    static fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    static generatePerlin2DGradients(count = 12) {
        const gradients = [];
        for (let i = 0; i < count; i++) {
            const angle = 2 * Math.PI * i / count;
            gradients.push(new Vec2(Math.cos(angle), Math.sin(angle)));
        }
        return gradients;
    }
    static getPerlin2DVectorAt(x, y, seed, gradients) {
        return gradients[Math.floor(this.randomConstant3(seed, x, y) * gradients.length)];
    }
    static getPerlin2DValueAt(x, y, seed, gradients) {
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
        const gradients = [];
        for (let i = 0; i < count; i++) {
            const y = 1 - (2 * i) / (count - 1);
            const r = Math.sqrt(1 - y * y);
            const angle = i * Math.PI * (3 - Math.sqrt(5));
            gradients.push(new Vec3(Math.cos(angle) * r, y, Math.sin(angle) * r));
        }
        return gradients;
    }
    static getPerlin3DVectorAt(x, y, z, seed, gradients) {
        return gradients[Math.floor(this.randomConstant4(seed, x, y, z) * gradients.length)];
    }
    static getPerlin3DValueAt(x, y, z, seed, gradients) {
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
    static getWorley2DPositionAtGrid(x, y, seed, offsetAmp) {
        const xo = (this.randomConstant3(x, y, seed + 1) - 0.5) * offsetAmp;
        const yo = (this.randomConstant3(x, y, seed + 2) - 0.5) * offsetAmp;
        return new Vec2(x + xo, y + yo);
    }
    static getWorley2DValueAtGrid(x, y, seed) {
        return this.randomConstant3(x, y, seed);
    }
    static getWorley2DAt(x, y, seed, offsetAmp, search) {
        search = search ?? Math.ceil(offsetAmp) + 1;
        const gx = Math.floor(x);
        const gy = Math.floor(y);
        let minDist = Infinity;
        let minDist2 = Infinity;
        let value = 0;
        let value2 = 0;
        for (let ix = gx - search; ix <= gx + search; ix++) {
            for (let iy = gy - search; iy <= gy + search; iy++) {
                let point = this.getWorley2DPositionAtGrid(ix, iy, seed, offsetAmp);
                let dist = point.distToC(x, y);
                if (dist < minDist) {
                    minDist2 = minDist;
                    value2 = value;
                    minDist = dist;
                    value = this.getWorley2DValueAtGrid(ix, iy, seed);
                }
                else if (dist < minDist2) {
                    minDist2 = dist;
                    value2 = this.getWorley2DValueAtGrid(ix, iy, seed);
                }
            }
        }
        return { value, value2, minDist, minDist2 };
    }
    static getWorley3DPositionAtGrid(x, y, z, seed, offsetAmp) {
        const xo = (this.randomConstant4(x, y, z, seed + 1) - 0.5) * offsetAmp;
        const yo = (this.randomConstant4(x, y, z, seed + 2) - 0.5) * offsetAmp;
        const zo = (this.randomConstant4(x, y, z, seed + 3) - 0.5) * offsetAmp;
        return new Vec3(x + xo, y + yo, z + zo);
    }
    static getWorley3DValueAtGrid(x, y, z, seed) {
        return this.randomConstant4(x, y, z, seed);
    }
    static getWorley3DAt(x, y, z, seed, offsetAmp, search) {
        search = search ?? Math.ceil(offsetAmp) + 1;
        const gx = Math.floor(x);
        const gy = Math.floor(y);
        const gz = Math.floor(z);
        let minDist = Infinity;
        let minDist2 = Infinity;
        let value = 0;
        let value2 = 0;
        for (let ix = gx - search; ix <= gx + search; ix++) {
            for (let iy = gy - search; iy <= gy + search; iy++) {
                for (let iz = gz - search; iz <= gz + search; iz++) {
                    let point = this.getWorley3DPositionAtGrid(ix, iy, iz, seed, offsetAmp);
                    let dist = point.distToC(x, y, z);
                    if (dist < minDist) {
                        minDist2 = minDist;
                        value2 = value;
                        minDist = dist;
                        value = this.getWorley3DValueAtGrid(ix, iy, iz, seed);
                    }
                    else if (dist < minDist2) {
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
    constructor(position, fovY, aspect, near, far) {
        this.position = position ?? Vec3.zero();
        this.fovY = fovY ?? 95 / 180 * Math.PI;
        this.aspect = aspect ?? 1;
        this.near = near ?? 0.1;
        this.far = far ?? 10000;
        this.rotation = Vec3.zero();
    }
    _fovY;
    get fovY() {
        return this._fovY;
    }
    set fovY(n) {
        this._fovY = n;
        this._outdatedPerspectiveMatrix = true;
    }
    _aspect;
    get aspect() {
        return this._aspect;
    }
    set aspect(n) {
        this._aspect = n;
        this._outdatedPerspectiveMatrix = true;
    }
    _near;
    get near() {
        return this._near;
    }
    set near(n) {
        this._near = n;
        this._outdatedPerspectiveMatrix = true;
    }
    _far;
    get far() {
        return this._far;
    }
    set far(n) {
        this._far = n;
        this._outdatedPerspectiveMatrix = true;
    }
    _position;
    get position() {
        return this._position;
    }
    set position(v) {
        this._position = v;
        v.onMutate = () => {
            this._outdatedTranslationMatrix = true;
            this._outdatedViewMatrix = true;
        };
        v.mutate();
    }
    _worldScale = 1;
    get worldScale() {
        return this._worldScale;
    }
    set worldScale(n) {
        this._worldScale = n;
        this._outdatedTranslationMatrix = true;
        this._outdatedViewMatrix = true;
    }
    _rotation;
    get rotation() {
        return this._rotation;
    }
    set rotation(v) {
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
    _forward = Vec3.zero();
    _outdatedForward = true;
    get forward() {
        this.updateForward();
        return this._forward;
    }
    updateForward() {
        if (this._outdatedForward != true)
            return;
        this._forward = Vec3.zAxis().negSelf().rotXYZSelf(this._rotation);
        delete this._outdatedForward;
    }
    _right = Vec3.zero();
    _outdatedRight = true;
    get right() {
        this.updateRight();
        return this._right;
    }
    updateRight() {
        if (this._outdatedRight != true)
            return;
        this._right = Vec3.xAxis().rotXYZSelf(this._rotation);
        delete this._outdatedRight;
    }
    _up = Vec3.zero();
    _outdatedUp = true;
    get up() {
        this.updateUp();
        return this._up;
    }
    updateUp() {
        if (this._outdatedUp != true)
            return;
        this._up = Vec3.yAxis().rotXYZSelf(this._rotation);
        delete this._outdatedUp;
    }
    _forwardFlat = Vec3.zero();
    _outdatedForwardFlat = true;
    get forwardFlat() {
        this.updateForwardFlat();
        return this._forwardFlat;
    }
    updateForwardFlat() {
        if (this._outdatedForwardFlat != true)
            return;
        this._forwardFlat = Vec3.zAxis().negSelf().rotYSelf(this._rotation.y);
        delete this._outdatedForwardFlat;
    }
    _perspectiveMatrix = [];
    _outdatedPerspectiveMatrix = true;
    perspectiveMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.perspectiveMatrix) });
    get perspectiveMatrix() {
        this.updatePerspectiveMatrix();
        return this._perspectiveMatrix;
    }
    updatePerspectiveMatrix() {
        if (this._outdatedPerspectiveMatrix != true)
            return;
        this._perspectiveMatrix = Mat4.perspective(this._fovY, this._aspect, this._near, this._far);
        delete this._outdatedPerspectiveMatrix;
        this.perspectiveMatrixObserver.fire(this._perspectiveMatrix);
    }
    _translationMatrix = [];
    _outdatedTranslationMatrix = true;
    translationMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.translationMatrix) });
    get translationMatrix() {
        this.updateTranslationMatrix();
        return this._translationMatrix;
    }
    updateTranslationMatrix() {
        if (this._outdatedTranslationMatrix != true)
            return;
        this._translationMatrix = Mat4.translate(-this._position.x * this._worldScale, -this._position.y * this._worldScale, -this._position.z * this._worldScale);
        delete this._outdatedTranslationMatrix;
        this.translationMatrixObserver.fire(this._viewMatrix);
    }
    _rotationMatrix = [];
    _outdatedRotationMatrix = true;
    rotationMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.rotationMatrix) });
    get rotationMatrix() {
        this.updateRotationMatrix();
        return this._rotationMatrix;
    }
    updateRotationMatrix() {
        if (this._outdatedRotationMatrix != true)
            return;
        this._rotationMatrix = Mat4.multiply(Mat4.rotateZ(-this._rotation.z), Mat4.multiply(Mat4.rotateX(-this._rotation.x), Mat4.rotateY(-this._rotation.y)));
        delete this._outdatedRotationMatrix;
        this.rotationMatrixObserver.fire(this._viewMatrix);
    }
    _viewMatrix = [];
    _outdatedViewMatrix = true;
    viewMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.viewMatrix) });
    get viewMatrix() {
        this.updateViewMatrix();
        return this._viewMatrix;
    }
    updateViewMatrix() {
        if (this._outdatedViewMatrix != true)
            return;
        this._viewMatrix = Mat4.multiply(this.rotationMatrix, this.translationMatrix);
        delete this._outdatedViewMatrix;
        this.viewMatrixObserver.fire(this._viewMatrix);
    }
    _combinedMatrix = [];
    _outdatedCombinedMatrix = true;
    combinedMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.combinedMatrix) });
    get combinedMatrix() {
        this.updateCombinedMatrix();
        return this._combinedMatrix;
    }
    updateCombinedMatrix() {
        if (this._outdatedCombinedMatrix != true)
            return;
        this._combinedMatrix = Mat3.multiply(this.viewMatrix, this.perspectiveMatrix);
        delete this._outdatedCombinedMatrix;
        this.combinedMatrixObserver.fire(this._combinedMatrix);
    }
    lookAt(p) {
        let f = this.position.look(p);
        this.rotation = new Vec3(f.pitch(), f.yaw(), 0);
    }
}
export class Camera2D {
    constructor(position, scale) {
        this.position = position ?? Vec2.zero();
        this.scale = scale ?? Vec2.fill(1);
        this.rotation = 0;
    }
    _position;
    get position() { return this._position; }
    set position(value) {
        this._position = value;
        this._position.onMutate = () => {
            this._outdatedTranslationMatrix = true;
            this._outdatedViewMatrix = true;
        };
        this._position.mutate();
    }
    _scale;
    get scale() { return this._scale; }
    set scale(value) {
        this._scale = value;
        this._scale.onMutate = () => {
            this._outdatedScaleMatrix = true;
            this._outdatedViewMatrix = true;
        };
        this._scale.mutate();
    }
    _rotation;
    get rotation() { return this._rotation; }
    set rotation(value) {
        this._rotation = value;
        this._outdatedRotationMatrix = true;
        this._outdatedViewMatrix = true;
        this._outdatedRight = true;
        this._outdatedUp = true;
    }
    _right = Vec2.zero();
    _outdatedRight = true;
    get right() {
        this.updateRight();
        return this._right;
    }
    updateRight() {
        if (this._outdatedRight != true)
            return;
        this._right = Vec2.xAxis().rotateSelf(this._rotation);
        delete this._outdatedRight;
    }
    _up = Vec2.zero();
    _outdatedUp = true;
    get up() {
        this.updateUp();
        return this._up;
    }
    updateUp() {
        if (this._outdatedUp != true)
            return;
        this._up = Vec2.yAxis().rotateSelf(this._rotation);
        delete this._outdatedUp;
    }
    _translationMatrix = [];
    _outdatedTranslationMatrix = true;
    translationMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.translationMatrix) });
    get translationMatrix() {
        this.updateTranslationMatrix();
        return this._translationMatrix;
    }
    updateTranslationMatrix() {
        if (this._outdatedTranslationMatrix != true)
            return;
        this._translationMatrix = Mat3.translate(-this.position.x, -this.position.y);
        delete this._outdatedViewMatrix;
        this.translationMatrixObserver.fire(this._translationMatrix);
    }
    _rotationMatrix = [];
    _outdatedRotationMatrix = true;
    rotationMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.rotationMatrix) });
    get rotationMatrix() {
        this.updateRotationMatrix();
        return this._rotationMatrix;
    }
    updateRotationMatrix() {
        if (this._outdatedRotationMatrix != true)
            return;
        this._rotationMatrix = Mat3.rotate(this.rotation);
        delete this._outdatedRotationMatrix;
        this.rotationMatrixObserver.fire(this._rotationMatrix);
    }
    _scaleMatrix = [];
    _outdatedScaleMatrix = true;
    scaleMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.scaleMatrix) });
    get scaleMatrix() {
        this.updateScaleMatrix();
        return this._scaleMatrix;
    }
    updateScaleMatrix() {
        if (this._outdatedScaleMatrix != true)
            return;
        this._scaleMatrix = Mat3.scale(this.scale.x, this.scale.y);
        delete this._outdatedScaleMatrix;
        this.scaleMatrixObserver.fire(this._scaleMatrix);
    }
    _viewMatrix = [];
    _outdatedViewMatrix = true;
    viewMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.viewMatrix) });
    get viewMatrix() {
        this.updateViewMatrix();
        return this._viewMatrix;
    }
    updateViewMatrix() {
        if (this._outdatedViewMatrix != true)
            return;
        this._viewMatrix = Mat3.multiply(this.scaleMatrix, Mat3.multiply(this.translationMatrix, this.rotationMatrix));
        delete this._outdatedViewMatrix;
        this.viewMatrixObserver.fire(this._viewMatrix);
    }
}
////////////////////
//  MESH CLASSES  //
////////////////////
export class TriMesh3D {
    positions = [];
    texcoords = [];
    normals = [];
    constructor() { }
    clone() {
        return new TriMesh3D().append(this);
    }
    translateSelf(v) {
        return this.translateSelfC(v.x, v.y, v.z);
    }
    translateSelfC(x, y, z) {
        for (let i = 0; i < this.positions.length; i += 3) {
            this.positions[i] += x;
            this.positions[i + 1] += y;
            this.positions[i + 2] += z;
        }
        return this;
    }
    scaleSelf(v) {
        return this.scaleSelfC(v.x, v.y, v.z);
    }
    scaleSelfC(x, y, z) {
        for (let i = 0; i < this.positions.length; i += 3) {
            this.positions[i] *= x;
            this.positions[i + 1] *= y;
            this.positions[i + 2] *= z;
        }
        return this;
    }
    rotateSelf(v) {
        return this.rotateSelfC(v.x, v.y, v.z);
    }
    rotateSelfC(ax, ay, az) {
        for (let i = 0; i < this.positions.length; i += 3) {
            let p = new Vec3(this.positions[i], this.positions[i + 1], this.positions[i + 2]);
            p.rotXYZSelfC(ax, ay, az);
            this.positions[i] = p.x;
            this.positions[i + 1] = p.y;
            this.positions[i + 2] = p.z;
        }
        for (let i = 0; i < this.normals.length; i += 3) {
            let p = new Vec3(this.normals[i], this.normals[i + 1], this.normals[i + 2]);
            p.rotXYZSelfC(ax, ay, az);
            this.normals[i] = p.x;
            this.normals[i + 1] = p.y;
            this.normals[i + 2] = p.z;
        }
        return this;
    }
    rotateAroundSelf(origin, v) {
        return this.rotateAroundSelfC(origin.x, origin.y, origin.z, v.x, v.y, v.z);
    }
    rotateAroundSelfC(x, y, z, ax, ay, az) {
        return this.translateSelfC(-x, -y, -z).rotateSelfC(ax, ay, az).translateSelfC(x, y, z);
    }
    append(...meshes) {
        for (const mesh of meshes) {
            this.positions.push(...mesh.positions);
            this.texcoords.push(...mesh.texcoords);
            this.normals.push(...mesh.normals);
        }
        return this;
    }
    static getLines(positions) {
        let edges = [];
        for (let i = 0; i < positions.length; i += 9) {
            edges.push(positions[i], positions[i + 1], positions[i + 2], positions[i + 3], positions[i + 4], positions[i + 5]);
            edges.push(positions[i + 3], positions[i + 4], positions[i + 5], positions[i + 6], positions[i + 7], positions[i + 8]);
            edges.push(positions[i + 6], positions[i + 7], positions[i + 8], positions[i], positions[i + 1], positions[i + 2]);
        }
        return edges;
    }
    static getQuadLines(positions) {
        let edges = [];
        for (let i = 0; i < positions.length; i += 18) {
            edges.push(positions[i], positions[i + 1], positions[i + 2], positions[i + 3], positions[i + 4], positions[i + 5]);
            edges.push(positions[i + 3], positions[i + 4], positions[i + 5], positions[i + 6], positions[i + 7], positions[i + 8]);
            edges.push(positions[i + 6], positions[i + 7], positions[i + 8], positions[i + 9], positions[i + 10], positions[i + 11]);
            edges.push(positions[i + 9], positions[i + 10], positions[i + 11], positions[i + 12], positions[i + 13], positions[i + 14]);
        }
        return edges;
    }
}
export class TriMesh2D {
    positions = [];
    texcoords = [];
    constructor() { }
    clone() {
        return new TriMesh2D().append(this);
    }
    translateSelf(v) {
        return this.translateSelfC(v.x, v.y);
    }
    translateSelfC(x, y) {
        for (let i = 0; i < this.positions.length; i += 2) {
            this.positions[i] += x;
            this.positions[i + 1] += y;
        }
        return this;
    }
    scaleSelf(v) {
        return this.scaleSelfC(v.x, v.y);
    }
    scaleSelfC(x, y) {
        for (let i = 0; i < this.positions.length; i += 2) {
            this.positions[i] *= x;
            this.positions[i + 1] *= y;
        }
        return this;
    }
    rotateSelf(a) {
        for (let i = 0; i < this.positions.length; i += 2) {
            let p = new Vec2(this.positions[i], this.positions[i + 1]);
            p.rotateSelf(a);
            this.positions[i] = p.x;
            this.positions[i + 1] = p.y;
        }
        return this;
    }
    rotateAroundSelf(origin, a) {
        return this.rotateAroundSelfC(origin.x, origin.y, a);
    }
    rotateAroundSelfC(x, y, a) {
        return this.translateSelfC(-x, -y).rotateSelf(a).translateSelfC(x, y);
    }
    append(...meshes) {
        for (const mesh of meshes) {
            this.positions.push(...mesh.positions);
            this.texcoords.push(...mesh.texcoords);
        }
        return this;
    }
}
export class Polygon2D {
    positions = [];
    constructor() { }
    static createPositions(positions) {
        const poly = new Polygon2D();
        poly.positions = positions;
        return poly;
    }
    static rect(x, y, w, h) {
        const x0 = x - w / 2;
        const x1 = x + w / 2;
        const y0 = y - h / 2;
        const y1 = y + h / 2;
        return this.createPositions([x0, y0, x1, y0, x1, y1, x0, y1]);
    }
    static circle(x, y, r, arc = Math.PI * 2, step = Math.PI / 8) {
        arc = EMath.clamp(arc, 0, Math.PI * 2);
        let positions = [];
        for (let i = 0; i < arc; i += step) {
            positions.push(Math.cos(i) * r + x, Math.sin(i) * r + y);
        }
        positions.push(Math.cos(arc) * r + x, Math.sin(arc) * r + y);
        return this.createPositions(positions);
    }
    static circleFan(x, y, r, arc = Math.PI * 2, step = Math.PI / 8) {
        const poly = this.circle(x, y, r, arc, step);
        poly.positions.splice(0, 0, x, y);
        return poly;
    }
    translateSelf(v) {
        return this.translateSelfC(v.x, v.y);
    }
    translateSelfC(x, y) {
        for (let i = 0; i < this.positions.length; i += 2) {
            this.positions[i] += x;
            this.positions[i + 1] += y;
        }
        return this;
    }
    scaleSelf(v) {
        return this.scaleSelfC(v.x, v.y);
    }
    scaleSelfC(x, y) {
        for (let i = 0; i < this.positions.length; i += 2) {
            this.positions[i] *= x;
            this.positions[i + 1] *= y;
        }
        return this;
    }
    rotateSelf(a) {
        for (let i = 0; i < this.positions.length; i += 3) {
            let p = new Vec2(this.positions[i], this.positions[i + 1]);
            p.rotateSelf(a);
            this.positions[i] = p.x;
            this.positions[i + 1] = p.y;
        }
        return this;
    }
    rotateAroundSelf(origin, a) {
        return this.rotateAroundSelfC(origin.x, origin.y, a);
    }
    rotateAroundSelfC(x, y, a) {
        return this.translateSelfC(-x, -y).rotateSelf(a);
    }
    drawPath(ctx, sx = 1, sy = 1) {
        ctx.beginPath();
        for (let i = 0; i < this.positions.length; i += 2) {
            if (i == 0)
                ctx.moveTo(this.positions[i] * sx, this.positions[i + 1] * sy);
            else
                ctx.lineTo(this.positions[i] * sx, this.positions[i + 1] * sy);
        }
        ctx.closePath();
    }
    getVertex(index) {
        const j = EMath.pmod(index, Math.floor(this.positions.length / 2)) * 2;
        return new Vec2(this.positions[j], this.positions[j + 1]);
    }
    bevelSelf(indices, amount) {
        if (!(indices instanceof Set))
            indices = new Set(indices);
        let newPositions = [];
        let len = Math.floor(this.positions.length / 2);
        for (let index = 0; index < len; index++) {
            if (!indices.has(index))
                continue;
            let vA = this.getVertex(index - 1);
            let vB = this.getVertex(index);
            let vC = this.getVertex(index + 1);
            let tMaxA = vA.distTo(vB);
            let tMaxC = vC.distTo(vB);
            if (indices.has(index - 1))
                tMaxA /= 2;
            if (indices.has(index + 1))
                tMaxC /= 2;
            let b1 = vB.addScaled(vB.look(vA), EMath.clamp(amount, 0, tMaxA));
            let b2 = vB.addScaled(vB.look(vC), EMath.clamp(amount, 0, tMaxC));
            newPositions.push(b1.x, b1.y, b2.x, b2.y);
        }
        this.positions = newPositions;
        return this;
    }
    bevelAllSelf(amount) {
        let newPositions = [];
        let len = Math.floor(this.positions.length / 2);
        for (let index = 0; index < len; index++) {
            let vA = this.getVertex(index - 1);
            let vB = this.getVertex(index);
            let vC = this.getVertex(index + 1);
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
export class Point2D {
    position;
    constructor(position) {
        this.position = position;
    }
    isInsideRect(rect) {
        let diff = this.position.sub(rect.position);
        let dx = diff.dot(rect.right);
        let dy = diff.dot(rect.up);
        return (Math.abs(dx) <= rect.size.x && Math.abs(dy) <= rect.size.y);
    }
    getRectCollision(rect) {
        let diff = this.position.sub(rect.position);
        let dx = diff.dot(rect.right);
        let dy = diff.dot(rect.up);
        let isInside = (Math.abs(dx) < rect.size.x && Math.abs(dy) < rect.size.y);
        if (isInside) {
            let d1 = Math.abs(this.position.sub(rect.position.addScaled(rect.up, rect.size.y)).dot(rect.up));
            let d2 = Math.abs(this.position.sub(rect.position.addScaled(rect.up, -rect.size.y)).dot(rect.up));
            let d3 = Math.abs(this.position.sub(rect.position.addScaled(rect.right, rect.size.x)).dot(rect.right));
            let d4 = Math.abs(this.position.sub(rect.position.addScaled(rect.right, -rect.size.x)).dot(rect.right));
            let minIndex = 0;
            let minDist = d1;
            if (d2 < minDist) {
                minDist = d2;
                minIndex = 1;
            }
            if (d3 < minDist) {
                minDist = d3;
                minIndex = 2;
            }
            if (d4 < minDist) {
                minDist = d4;
                minIndex = 3;
            }
            let edge;
            let normal;
            switch (minIndex) {
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
                collision: edge,
                distance: -edge.distTo(this.position),
                normal: normal,
            };
        }
        else {
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
    distToCircle(circle) {
        let dist = this.position.distTo(circle.position);
        return dist - circle.radius;
    }
    isInsideCircle(circle) {
        return this.distToCircle(circle) <= 0;
    }
}
export class Ray2D {
    origin;
    direction;
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction;
    }
    raycastGrid(predicate, maxIterations = 1000) {
        const invDirAbs = this.direction.rdivF(1).map(x => Math.abs(x));
        const sign = this.direction.map(x => x > 0 ? 1 : 0);
        const step = this.direction.map(x => x > 0 ? 1 : -1);
        let tMaxX = invDirAbs.x * (sign.x === 0 ? (this.origin.x - Math.floor(this.origin.x)) : (Math.floor(this.origin.x) + 1 - this.origin.x));
        let tMaxY = invDirAbs.y * (sign.y === 0 ? (this.origin.y - Math.floor(this.origin.y)) : (Math.floor(this.origin.y) + 1 - this.origin.y));
        let pos = new Vec2(this.origin).mapSelf(x => Math.floor(x));
        let distance = 0;
        let normal = Vec2.zero();
        for (let i = 0; i < maxIterations; i++) {
            let res = predicate(pos, normal, distance);
            if (res !== undefined)
                return res;
            if (tMaxX < tMaxY) {
                distance = tMaxX;
                normal.setC(-step.x, 0);
                tMaxX += invDirAbs.x;
                pos.x += step.x;
            }
            else {
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
    start;
    end;
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}
export class Rect2D {
    position;
    constructor(position, size, rotation) {
        this.position = position;
        this.size = size;
        this.rotation = rotation;
    }
    _size;
    get size() { return this._size; }
    set size(value) {
        this._size = value;
    }
    _rotation;
    get rotation() { return this._rotation; }
    set rotation(value) {
        this._rotation = value;
    }
    _right = Vec2.zero();
    _outdatedRight = true;
    get right() {
        this.updateRight();
        return this._right;
    }
    updateRight() {
        if (this._outdatedRight != true)
            return;
        this._right = Vec2.xAxis().rotateSelf(this._rotation);
        delete this._outdatedRight;
    }
    _up = Vec2.zero();
    _outdatedUp = true;
    get up() {
        this.updateUp();
        return this._up;
    }
    updateUp() {
        if (this._outdatedUp != true)
            return;
        this._up = Vec2.yAxis().rotateSelf(this._rotation);
        delete this._outdatedUp;
    }
}
export class Circle2D {
    position;
    radius;
    constructor(position, radius) {
        this.position = position;
        this.radius = radius;
    }
    getRectCollision(rect) {
        let res = new Point2D(this.position).getRectCollision(rect);
        res.distance -= this.radius;
        if (res.distance <= 0)
            res.inside = true;
        return res;
    }
    isInsideCircle(other) {
        return this.position.distTo(other.position) <= this.radius + other.radius;
    }
    getCircleCollision(other) {
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
    getSegmentCollision(segment) {
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
for (let i = 0; i < 16; i++) {
    let a1 = i / 16 * Math.PI * 2;
    let a2 = (i + 1) / 16 * Math.PI * 2;
    Circle2DMesh.positions.push(Math.cos(a1), Math.sin(a1));
    Circle2DMesh.positions.push(0, 0);
    Circle2DMesh.positions.push(Math.cos(a2), Math.sin(a2));
}
export let Circle2DPositionsF32 = new Float32Array(Circle2DMesh.positions);
export let Rect2DMesh = new TriMesh2D();
Rect2DMesh.positions.push(-1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, 1);
export let Rect2DPositionsF32 = new Float32Array(Rect2DMesh.positions);
export class PhysicsPart2D {
    anchored;
    velocity = Vec2.zero();
    hasCollision = true;
    color;
    shaderObject;
    mass;
    restitution;
    gravity = 500;
    collisionEvent = new Signal();
    constructor(shader, position, size, color = new Color(0, 0, 0), shapeType = "circle", anchored = false, restitution = 1, mass = 1) {
        this.shader = shader;
        this.shapeType = shapeType;
        this.position = position;
        this.size = size;
        this.color = color;
        this.anchored = anchored;
        this.restitution = restitution;
        this.mass = mass;
        this.rotation = 0;
    }
    _shader;
    uColor;
    uView;
    get shader() { return this._shader; }
    set shader(value) {
        this._shader = value;
        this.uColor = value.getUniform("u_color");
        this.uView = value.getUniform("u_view");
        if (this.shaderObject)
            this.shaderObject.delete();
        this.shaderObject = value.createObject();
        this._updateShaderObjectData();
    }
    _rotation;
    get rotation() { return this._rotation; }
    set rotation(value) {
        if (value == this._rotation)
            return;
        this._rotation = value;
        this._outdatedRotationMatrix = true;
        this._outdatedViewMatrix = true;
        if (this.shape instanceof Rect2D) {
            this.shape.rotation = this._rotation;
        }
    }
    lastPosition = Vec2.zero();
    _position;
    get position() { return this._position; }
    set position(value) {
        this._position = value;
        this._position.onMutate = () => {
            this._outdatedTranslationMatrix = true;
            this._outdatedViewMatrix = true;
        };
        this._position.mutate();
        this.shape.position = this._position;
    }
    shape;
    _shapeType;
    get shapeType() { return this._shapeType; }
    set shapeType(value) {
        this._shapeType = value;
        this._updateShaderObjectData();
    }
    _updateShaderObjectData() {
        const size = this.size ?? Vec2.zero();
        switch (this._shapeType) {
            case "rect":
                this.shaderObject.setData("a_position", Rect2DPositionsF32);
                this.shape = new Rect2D(this.position, size, this.rotation);
                break;
            case "circle":
                this.shaderObject.setData("a_position", Circle2DPositionsF32);
                this.shape = new Circle2D(this.position, Math.min(size.x, size.y));
                break;
        }
    }
    _size;
    get size() { return this._size; }
    set size(value) {
        this._size = value;
        this._size.onMutate = () => {
            this._outdatedScaleMatrix = true;
            this._outdatedViewMatrix = true;
        };
        this._size.mutate();
        if (this.shape instanceof Rect2D) {
            this.shape.size = this._size;
        }
        else {
            this.shape.radius = Math.min(this._size.x, this._size.y);
        }
    }
    _translationMatrix = [];
    _outdatedTranslationMatrix = true;
    get translationMatrix() {
        this.updateTranslationMatrix();
        return this._translationMatrix;
    }
    updateTranslationMatrix() {
        if (this._outdatedTranslationMatrix != true)
            return;
        this._translationMatrix = Mat3.translate(this.position.x, this.position.y);
        delete this._outdatedTranslationMatrix;
    }
    _rotationMatrix = [];
    _outdatedRotationMatrix = true;
    get rotationMatrix() {
        this.updateRotationMatrix();
        return this._rotationMatrix;
    }
    updateRotationMatrix() {
        if (this._outdatedRotationMatrix != true)
            return;
        this._rotationMatrix = Mat3.rotate(this.rotation);
        delete this._outdatedRotationMatrix;
    }
    _scaleMatrix = [];
    _outdatedScaleMatrix = true;
    get scaleMatrix() {
        this.updateScaleMatrix();
        return this._scaleMatrix;
    }
    updateScaleMatrix() {
        if (this._outdatedScaleMatrix != true)
            return;
        if (this._shapeType == "circle") {
            const radius = Math.min(this.size.x, this.size.y);
            this._scaleMatrix = Mat3.scale(radius, radius);
        }
        else {
            this._scaleMatrix = Mat3.scale(this.size.x, this.size.y);
        }
        delete this._outdatedScaleMatrix;
    }
    _viewMatrix = [];
    _outdatedViewMatrix = true;
    get viewMatrix() {
        this.updateViewMatrix();
        return this._viewMatrix;
    }
    updateViewMatrix() {
        if (this._outdatedViewMatrix != true)
            return;
        this._viewMatrix = Mat3.multiply(this.rotationMatrix, Mat3.multiply(this.translationMatrix, this.scaleMatrix));
        delete this._outdatedViewMatrix;
    }
    resolveCircleCircleCollision(other) {
        const circleA = this.shape;
        const circleB = other.shape;
        let dist = this.position.distTo(other.position) - circleA.radius - circleB.radius;
        if (dist > 0)
            return;
        let normal = this.position.look(other.position);
        const velAlongNormal = other.velocity.sub(this.velocity).dot(normal);
        const mi = (1 / this.mass + 1 / other.mass);
        if (velAlongNormal < 0) {
            const restitution = Math.min(this.restitution, other.restitution);
            const j = -(1 + restitution) * velAlongNormal / mi;
            this.velocity.addScaledSelf(normal, j * -1 / this.mass);
            other.velocity.addScaledSelf(normal, j * 1 / other.mass);
        }
        const correction = normal.rescale(Math.max(-dist - 1e-4, 0) / mi * 0.8);
        this.position.addScaledSelf(correction, -1 / this.mass);
        other.position.addScaledSelf(correction, 1 / other.mass);
        this.collisionEvent.fire(other);
        other.collisionEvent.fire(this);
    }
    resolveCircleAnchoredRectCollision(other) {
        const circle = this.shape;
        const rect = other.shape;
        let diff = this.position.sub(rect.position);
        let dx = diff.dot(rect.right);
        let dy = diff.dot(rect.up);
        if (Math.abs(dx) >= rect.size.x + circle.radius || Math.abs(dy) >= rect.size.y + circle.radius)
            return;
        let d1 = Math.abs(this.position.sub(rect.position.addScaled(rect.up, rect.size.y)).dot(rect.up));
        let d2 = Math.abs(this.position.sub(rect.position.addScaled(rect.up, -rect.size.y)).dot(rect.up));
        let d3 = Math.abs(this.position.sub(rect.position.addScaled(rect.right, rect.size.x)).dot(rect.right));
        let d4 = Math.abs(this.position.sub(rect.position.addScaled(rect.right, -rect.size.x)).dot(rect.right));
        let minIndex = 0;
        let minDist = d1;
        if (d2 < minDist) {
            minDist = d2;
            minIndex = 1;
        }
        if (d3 < minDist) {
            minDist = d3;
            minIndex = 2;
        }
        if (d4 < minDist) {
            minDist = d4;
            minIndex = 3;
        }
        if (minDist > circle.radius)
            return;
        let edge;
        let normal;
        switch (minIndex) {
            case 0:
                edge = rect.position.addScaled(rect.right, dx).addScaledSelf(rect.up, rect.size.y);
                normal = rect.up;
                break;
            case 1:
                edge = rect.position.addScaled(rect.right, dx).addScaledSelf(rect.up, -rect.size.y);
                normal = rect.up.neg();
                break;
            case 2:
                edge = rect.position.addScaled(rect.up, dy).addScaledSelf(rect.right, rect.size.x);
                normal = rect.right;
                break;
            case 3:
                edge = rect.position.addScaled(rect.up, dy).addScaledSelf(rect.right, -rect.size.x);
                normal = rect.right.neg();
                break;
        }
        const velAlongNormal = this.velocity.sub(other.velocity).dot(normal);
        if (velAlongNormal < 0) {
            const restitution = Math.min(this.restitution, other.restitution);
            const j = -(1 + restitution) * velAlongNormal;
            this.velocity.addScaledSelf(normal, j);
        }
        this.position = edge.addScaledSelf(normal, circle.radius + 1e-6);
        this.collisionEvent.fire(other);
        other.collisionEvent.fire(this);
    }
    render(camera) {
        if (this.uColor)
            this.uColor.setValues([this.color.r, this.color.g, this.color.b]);
        if (this.uView)
            this.uView.setValues(camera ? Mat3.multiply(camera.viewMatrix, this.viewMatrix) : this.viewMatrix);
        this.shaderObject.drawTriangles();
    }
}
export class Ray3D {
    origin;
    direction;
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction;
    }
    raycastVoxels(predicate, maxIterations = 1000) {
        const invDirAbs = this.direction.rdivF(1).map(x => Math.abs(x));
        const sign = this.direction.map(x => x > 0 ? 1 : 0);
        const step = this.direction.map(x => x > 0 ? 1 : -1);
        let tMaxX = invDirAbs.x * (sign.x === 0 ? (this.origin.x - Math.floor(this.origin.x)) : (Math.floor(this.origin.x) + 1 - this.origin.x));
        let tMaxY = invDirAbs.y * (sign.y === 0 ? (this.origin.y - Math.floor(this.origin.y)) : (Math.floor(this.origin.y) + 1 - this.origin.y));
        let tMaxZ = invDirAbs.z * (sign.z === 0 ? (this.origin.z - Math.floor(this.origin.z)) : (Math.floor(this.origin.z) + 1 - this.origin.z));
        let pos = new Vec3(this.origin).mapSelf(x => Math.floor(x));
        let distance = 0;
        let normal = Vec3.zero();
        for (let i = 0; i < maxIterations; i++) {
            let res = predicate(pos, normal, distance);
            if (res !== undefined)
                return res;
            if (tMaxX < tMaxY) {
                if (tMaxX < tMaxZ) {
                    distance = tMaxX;
                    normal.setC(-step.x, 0, 0);
                    tMaxX += invDirAbs.x;
                    pos.x += step.x;
                }
                else {
                    distance = tMaxZ;
                    normal.setC(0, 0, -step.z);
                    tMaxZ += invDirAbs.z;
                    pos.z += step.z;
                }
            }
            else {
                if (tMaxY < tMaxZ) {
                    distance = tMaxY;
                    normal.setC(0, -step.y, 0);
                    tMaxY += invDirAbs.y;
                    pos.y += step.y;
                }
                else {
                    distance = tMaxZ;
                    normal.setC(0, 0, -step.z);
                    tMaxZ += invDirAbs.z;
                    pos.z += step.z;
                }
            }
        }
        return undefined;
    }
    raycastBox(bounds) {
        const invDir = this.direction.rdivF(1);
        const sign = this.direction.map(x => x > 0 ? 1 : 0);
        const signFlip = this.direction.map(x => x > 0 ? 0 : 1);
        const stepFlip = this.direction.map(x => x > 0 ? -1 : 1);
        let tmin = (bounds[signFlip.x].x - this.origin.x) * invDir.x;
        let tmax = (bounds[sign.x].x - this.origin.x) * invDir.x;
        let normal = new Vec3(stepFlip.x, 0, 0);
        let tymin = (bounds[signFlip.y].y - this.origin.y) * invDir.y;
        let tymax = (bounds[sign.y].y - this.origin.y) * invDir.y;
        if ((tmin > tymax) || (tymin > tmax))
            return null;
        if (tymin > tmin) {
            tmin = tymin;
            normal = new Vec3(0, stepFlip.y, 0);
        }
        if (tymax < tmax)
            tmax = tymax;
        let tzmin = (bounds[signFlip.z].z - this.origin.z) * invDir.z;
        let tzmax = (bounds[sign.z].z - this.origin.z) * invDir.z;
        if ((tmin > tzmax) || (tzmin > tmax))
            return null;
        if (tzmin > tmin) {
            tmin = tzmin;
            normal = new Vec3(0, 0, stepFlip.z);
        }
        if (tzmax < tmax)
            tmax = tzmax;
        const distance = tmin < 0 ? 0 : tmin;
        return { normal, distance, intersection: this.origin.addScaled(this.direction, distance) };
    }
}
export class Physics2DEnvironment {
    gl;
    partObserver = new Signal({ onConnect: (conn) => { for (const obj of this.parts)
            conn.fire(obj); } });
    parts = [];
    defaultShader;
    constructor(gl) {
        this.gl = gl;
        this.defaultShader = new WGL2Shader(gl, `#version 300 es
                in vec2 a_position;
                uniform mat3 u_view;
                void main() {
                    vec2 v_position = (u_view * vec3(a_position, 1)).xy;
                    gl_Position = vec4(v_position, 0, 1);
                }
            `, `#version 300 es
                precision highp float;
                uniform vec3 u_color;
                out vec4 outColor;
                void main() {
                    outColor = vec4(u_color/255., 1);
                }
            `);
        this.defaultShader.addAttribute("a_position", "vec2");
        this.defaultShader.createUniform("u_view", "mat3");
        this.defaultShader.createUniform("u_color", "vec3");
    }
    addPart(part) {
        this.parts.push(part);
    }
    removePart(part) {
        const index = this.parts.indexOf(part);
        if (index == -1)
            return;
        this.parts.splice(index, 1);
    }
    update(dt, solvesCount = 3) {
        for (let part of this.parts) {
            if (part.anchored) {
                part.velocity = part.position.sub(part.lastPosition).mulF(1 / dt);
                part.lastPosition.setC(part.position.x, part.position.y);
            }
            else {
                part.lastPosition.setC(part.position.x, part.position.y);
                part.velocity.y -= part.gravity * dt;
                part.position.addScaledSelf(part.velocity, dt);
            }
        }
        for (let i = 0; i < solvesCount; i++) {
            for (let j = 0; j < this.parts.length; j++) {
                const part = this.parts[j];
                if (!part.hasCollision)
                    continue;
                for (let k = j + 1; k < this.parts.length; k++) {
                    const other = this.parts[k];
                    if (!other.hasCollision)
                        continue;
                    if (part.anchored && other.anchored)
                        continue;
                    if (part.shapeType === "circle" && other.shapeType === "circle") {
                        part.resolveCircleCircleCollision(other);
                    }
                    else if (part.shapeType === "circle" && other.shapeType === "rect") {
                        part.resolveCircleAnchoredRectCollision(other);
                    }
                    else if (part.shapeType === "rect" && other.shapeType === "circle") {
                        other.resolveCircleAnchoredRectCollision(part);
                    }
                }
            }
        }
    }
    renderAll(camera) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        for (let part of this.parts) {
            part.render(camera);
        }
    }
}
/////////////////////
//  EVENT CLASSES  //
/////////////////////
export class Signal {
    connections = [];
    timeFired = -Number.MAX_VALUE;
    onConnect;
    constructor({ onConnect = undefined, } = {}) {
        this.onConnect = onConnect;
    }
    connect(callback) {
        const conn = new Connection(this, callback);
        this.connections.push(conn);
        if (this.onConnect) {
            this.onConnect(conn);
        }
        return conn;
    }
    once(callback) {
        const conn = this.connect((...args) => {
            callback(...args);
            conn.disconnect();
        });
        return conn;
    }
    async wait() {
        return new Promise(res => {
            this.once((...args) => {
                res(args);
            });
        });
    }
    fire(...args) {
        this.timeFired = performance.now();
        for (const conn of [...this.connections]) {
            conn.fire(...args);
        }
    }
    getTimeSinceFired() {
        return performance.now() / 1000 - this.timeFired;
    }
}
export class Connection {
    signal;
    callback;
    groups = [];
    constructor(signal, callback) {
        this.signal = signal;
        this.callback = callback;
    }
    disconnect() {
        this.signal.connections.splice(this.signal.connections.indexOf(this), 1);
        for (const group of this.groups) {
            group.connections.splice(group.connections.indexOf(this), 1);
        }
        this.groups = [];
    }
    fire(...args) {
        this.callback(...args);
    }
}
export class HtmlConnection {
    el;
    name;
    callback;
    groups = [];
    constructor(el, name, callback) {
        this.el = el;
        this.name = name;
        this.callback = callback;
        this.el.addEventListener(this.name, this.callback);
    }
    disconnect() {
        this.el.removeEventListener(this.name, this.callback);
        for (const group of this.groups) {
            group.connections.splice(group.connections.indexOf(this), 1);
        }
        this.groups = [];
    }
}
export class ConnectionGroup {
    connections = [];
    constructor() {
    }
    add(conn) {
        this.connections.push(conn);
    }
    disconnectAll() {
        for (const conn of [...this.connections]) {
            conn.disconnect();
        }
        this.connections = [];
    }
}
/////////////////////////////
//  WEBGL2 SHADER CLASSES  //
/////////////////////////////
export class WGL2ComponentShader {
    gl;
    type;
    source;
    wShader;
    constructor(gl, type, source) {
        this.gl = gl;
        this.type = type;
        this.source = source;
        const wShader = gl.createShader(type == "vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
        if (wShader == null) {
            throw new Error("Failed to create shader");
        }
        this.wShader = wShader;
        gl.shaderSource(wShader, source);
        gl.compileShader(wShader);
        if (!gl.getShaderParameter(wShader, gl.COMPILE_STATUS)) {
            const log = gl.getShaderInfoLog(wShader);
            gl.deleteShader(wShader);
            throw new Error("Failed to compile shader: " + log);
        }
    }
    delete() {
        this.gl.deleteShader(this.wShader);
    }
}
export class WGL2ComponentProgram {
    gl;
    cShaderV;
    cShaderF;
    wProgram;
    constructor(gl, cShaderV, cShaderF) {
        this.gl = gl;
        this.cShaderV = cShaderV;
        this.cShaderF = cShaderF;
        const wProgram = gl.createProgram();
        if (!wProgram) {
            throw new Error("Failed to create program");
        }
        this.wProgram = wProgram;
        gl.attachShader(wProgram, cShaderV.wShader);
        gl.attachShader(wProgram, cShaderF.wShader);
        gl.linkProgram(wProgram);
        if (!gl.getProgramParameter(wProgram, gl.LINK_STATUS)) {
            const log = gl.getProgramInfoLog(wProgram);
            gl.deleteProgram(wProgram);
            throw new Error("Failed to link program: " + log);
        }
    }
    setActive() {
        this.gl.useProgram(this.wProgram);
    }
    delete() {
        this.gl.deleteProgram(this.wProgram);
    }
}
export class WGL2ComponentBuffer {
    gl;
    wType;
    wDimensions;
    wBuffer;
    constructor(gl, type) {
        this.gl = gl;
        const buffer = gl.createBuffer();
        if (!buffer) {
            throw new Error("Failed to create buffer");
        }
        this.wBuffer = buffer;
        switch (type) {
            case "float":
                this.wType = gl.FLOAT;
                this.wDimensions = 1;
                break;
            case "vec2":
                this.wType = gl.FLOAT;
                this.wDimensions = 2;
                break;
            case "vec3":
                this.wType = gl.FLOAT;
                this.wDimensions = 3;
                break;
            case "vec4":
                this.wType = gl.FLOAT;
                this.wDimensions = 4;
                break;
            case "int":
                this.wType = gl.INT;
                this.wDimensions = 1;
                break;
            case "ivec2":
                this.wType = gl.INT;
                this.wDimensions = 2;
                break;
            case "ivec3":
                this.wType = gl.INT;
                this.wDimensions = 3;
                break;
            case "ivec4":
                this.wType = gl.INT;
                this.wDimensions = 4;
                break;
            case "uint":
                this.wType = gl.UNSIGNED_INT;
                this.wDimensions = 1;
                break;
            case "uvec2":
                this.wType = gl.UNSIGNED_INT;
                this.wDimensions = 2;
                break;
            case "uvec3":
                this.wType = gl.UNSIGNED_INT;
                this.wDimensions = 3;
                break;
            case "uvec4":
                this.wType = gl.UNSIGNED_INT;
                this.wDimensions = 4;
                break;
            default: throw new Error("Unsupported buffer type: " + type);
        }
    }
    setActive() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.wBuffer);
    }
    delete() {
        this.gl.deleteBuffer(this.wBuffer);
    }
}
export class WGL2ComponentVao {
    gl;
    wVao;
    constructor(gl) {
        this.gl = gl;
        this.wVao = gl.createVertexArray();
    }
    setActive() {
        this.gl.bindVertexArray(this.wVao);
    }
    enableBuffer(cBuffer, wLocation) {
        cBuffer.setActive();
        this.gl.enableVertexAttribArray(wLocation);
        if (cBuffer.wType == this.gl.FLOAT) {
            this.gl.vertexAttribPointer(wLocation, cBuffer.wDimensions, cBuffer.wType, false, 0, 0);
        }
        else {
            this.gl.vertexAttribIPointer(wLocation, cBuffer.wDimensions, cBuffer.wType, 0, 0);
        }
    }
    delete() {
        this.gl.deleteVertexArray(this.wVao);
    }
}
export class WGL2ComponentUniform {
    gl;
    type;
    wLocation;
    queuedValues = null;
    hasQueued = false;
    constructor(gl, cProgram, name, type) {
        this.gl = gl;
        this.type = type;
        const wLocation = this.gl.getUniformLocation(cProgram.wProgram, name);
        if (wLocation === null) {
            throw new Error("Failed to get uniform location for " + name);
        }
        this.wLocation = wLocation;
    }
    setValues(values) {
        const wLocation = this.wLocation;
        const gl = this.gl;
        switch (this.type) {
            case "float":
                gl.uniform1f(wLocation, values);
                break;
            case "vec2":
                gl.uniform2fv(wLocation, values);
                break;
            case "vec3":
                gl.uniform3fv(wLocation, values);
                break;
            case "vec4":
                gl.uniform4fv(wLocation, values);
                break;
            case "int":
                gl.uniform1i(wLocation, values);
                break;
            case "ivec2":
                gl.uniform2iv(wLocation, values);
                break;
            case "ivec3":
                gl.uniform3iv(wLocation, values);
                break;
            case "ivec4":
                gl.uniform4iv(wLocation, values);
                break;
            case "uint":
                gl.uniform1ui(wLocation, values);
                break;
            case "uvec2":
                gl.uniform2uiv(wLocation, values);
                break;
            case "uvec3":
                gl.uniform3uiv(wLocation, values);
                break;
            case "uvec4":
                gl.uniform4uiv(wLocation, values);
                break;
            case "mat2":
                gl.uniformMatrix2fv(wLocation, false, values);
                break;
            case "mat3":
                gl.uniformMatrix3fv(wLocation, false, values);
                break;
            case "mat4":
                gl.uniformMatrix4fv(wLocation, false, values);
                break;
            default: throw new Error("Unsupported uniform type: " + this.type);
        }
    }
    queueValues(values) {
        this.hasQueued = true;
        this.queuedValues = values;
    }
    update() {
        if (!this.hasQueued)
            return;
        this.hasQueued = false;
        this.setValues(this.queuedValues);
        this.queuedValues = null;
    }
}
export class WGL2Attribute {
    gl;
    wProgram;
    name;
    type;
    wLocation;
    constructor(gl, wProgram, name, type) {
        this.gl = gl;
        this.wProgram = wProgram;
        this.name = name;
        this.type = type;
        this.wLocation = gl.getAttribLocation(wProgram, name);
    }
}
export class WGL2Texture2D {
    shader;
    name;
    slot;
    wTexture;
    uniform;
    constructor(shader, name, slot) {
        this.shader = shader;
        this.name = name;
        this.slot = slot;
        this.wTexture = shader.gl.createTexture();
        this.setActive();
        this.uniform = shader.createUniform(name, "int");
        this.uniform.setValues(this.slot);
    }
    setActive() {
        const gl = this.shader.gl;
        gl.activeTexture(gl.TEXTURE0 + this.slot);
        gl.bindTexture(gl.TEXTURE_2D, this.wTexture);
    }
    setInterpolation(isEnabled = true) {
        const gl = this.shader.gl;
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, isEnabled ? gl.LINEAR : gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, isEnabled ? gl.LINEAR : gl.NEAREST);
    }
    setRepeat(isEnabled = true) {
        const gl = this.shader.gl;
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, isEnabled ? gl.REPEAT : gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, isEnabled ? gl.REPEAT : gl.CLAMP_TO_EDGE);
    }
    setData(width, height, data = null) {
        const gl = this.shader.gl;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    }
    setImage(image) {
        const gl = this.shader.gl;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }
    generateMipmap() {
        const gl = this.shader.gl;
        gl.generateMipmap(gl.TEXTURE_2D);
    }
    delete() {
        const gl = this.shader.gl;
        gl.deleteTexture(this.wTexture);
    }
}
export class WGL2Texture3D {
    shader;
    name;
    slot;
    wTexture;
    uniform;
    constructor(shader, name, slot) {
        this.shader = shader;
        this.name = name;
        this.slot = slot;
        this.wTexture = shader.gl.createTexture();
        this.setActive();
        this.uniform = shader.createUniform(name, "int");
        this.uniform.setValues(this.slot);
    }
    setActive() {
        const gl = this.shader.gl;
        gl.activeTexture(gl.TEXTURE0 + this.slot);
        gl.bindTexture(gl.TEXTURE_3D, this.wTexture);
    }
    setInterpolation(isEnabled = true) {
        const gl = this.shader.gl;
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, isEnabled ? gl.LINEAR : gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, isEnabled ? gl.LINEAR : gl.NEAREST);
    }
    setRepeat(isEnabled = true) {
        const gl = this.shader.gl;
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, isEnabled ? gl.REPEAT : gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, isEnabled ? gl.REPEAT : gl.CLAMP_TO_EDGE);
    }
    setData(width, height, depth, data = null) {
        const gl = this.shader.gl;
        gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGBA, width, height, depth, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    }
    generateMipmap() {
        const gl = this.shader.gl;
        gl.generateMipmap(gl.TEXTURE_3D);
    }
    delete() {
        const gl = this.shader.gl;
        gl.deleteTexture(this.wTexture);
    }
}
export class WGL2Object {
    shader;
    gl;
    cVao;
    cBufferByName = {};
    vertexCount = 0;
    constructor(shader) {
        this.shader = shader;
        this.gl = shader.gl;
        this.cVao = new WGL2ComponentVao(shader.gl);
        this.cVao.setActive();
        for (const attribute of shader.attributes) {
            const cBuf = new WGL2ComponentBuffer(shader.gl, attribute.type);
            cBuf.setActive();
            this.cVao.enableBuffer(cBuf, attribute.wLocation);
            this.cBufferByName[attribute.name] = cBuf;
        }
    }
    setData(attributeName, values, usage = this.gl.STATIC_DRAW) {
        const cBuf = this.cBufferByName[attributeName];
        if (cBuf == null) {
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
    delete() {
        for (const name in this.cBufferByName) {
            this.cBufferByName[name].delete();
        }
        this.cVao.delete();
        this.cBufferByName = {};
    }
}
export class WGL2Shader {
    gl;
    cProgram;
    attributes = [];
    cUniforms = [];
    cUniformByName = {};
    constructor(gl, vSource, fSource) {
        this.gl = gl;
        this.cProgram = new WGL2ComponentProgram(gl, new WGL2ComponentShader(gl, "vertex", vSource), new WGL2ComponentShader(gl, "fragment", fSource));
        this.cProgram.setActive();
    }
    addAttribute(name, type) {
        const att = new WGL2Attribute(this.gl, this.cProgram.wProgram, name, type);
        this.attributes.push(att);
        return att;
    }
    createUniform(name, type) {
        const uniform = new WGL2ComponentUniform(this.gl, this.cProgram, name, type);
        this.cUniforms.push(uniform);
        this.cUniformByName[name] = uniform;
        return uniform;
    }
    getUniform(name) {
        return this.cUniformByName[name];
    }
    createObject() {
        const obj = new WGL2Object(this);
        return obj;
    }
    createTexture2D(name, slot) {
        const texture = new WGL2Texture2D(this, name, slot);
        return texture;
    }
    createTexture3D(name, slot) {
        const texture = new WGL2Texture3D(this, name, slot);
        return texture;
    }
    setActive() {
        this.cProgram.setActive();
    }
}
export class TextureAtlas {
    image;
    bounds;
    width;
    height;
    constructor(image, bounds) {
        this.image = image;
        this.bounds = bounds;
        this.width = image.naturalWidth;
        this.height = image.naturalHeight;
    }
    static async fromUrls(args, padding = 0) {
        let images = [];
        let promises = [];
        let atlasSize = 0;
        for (let [name, url] of args) {
            promises.push(new Promise(async (res) => {
                let img = new Image();
                img.onload = () => {
                    let data = { img, x: 0, y: 0, w: img.naturalWidth + 2 * padding, h: img.naturalHeight + 2 * padding, name };
                    let isColliding = true;
                    for (let x = 0; x <= atlasSize - data.w; x++) {
                        for (let y = 0; y <= atlasSize - data.h; y++) {
                            isColliding = false;
                            for (let other of images) {
                                if (x + data.w > other.x && y + data.h > other.y && x < other.x + other.w && y < other.y + other.h) {
                                    isColliding = true;
                                    break;
                                }
                            }
                            if (!isColliding) {
                                data.x = x;
                                data.y = y;
                                break;
                            }
                        }
                        if (!isColliding)
                            break;
                    }
                    if (isColliding) {
                        data.x = atlasSize;
                        data.y = 0;
                        atlasSize = data.x + data.w;
                    }
                    images.push(data);
                    res();
                };
                img.src = url;
            }));
        }
        await Promise.all(promises);
        let canvas = document.createElement("canvas");
        canvas.width = atlasSize;
        canvas.height = atlasSize;
        let ctx = canvas.getContext("2d");
        let bounds = {};
        for (let img of images) {
            ctx.drawImage(img.img, img.x + padding, img.y + padding);
            if (padding !== 0) {
                ctx.drawImage(img.img, 0, 0, 1, img.h - 2 * padding, img.x, img.y + padding, padding, img.h - 2 * padding); // left
                ctx.drawImage(img.img, img.w - 2 * padding - 1, 0, 1, img.h - 2 * padding, img.x + img.w - padding, img.y + padding, padding, img.h - 2 * padding); // right
                ctx.drawImage(img.img, 0, 0, img.w - 2 * padding, 1, img.x + padding, img.y, img.w - 2 * padding, padding); // top
                ctx.drawImage(img.img, 0, img.h - 2 * padding - 1, img.w - 2 * padding, 1, img.x + padding, img.y + img.h - padding, img.w - 2 * padding, padding); // bottom
                ctx.drawImage(img.img, 0, 0, 2, 2, img.x, img.y, padding, padding); // top-left
                ctx.drawImage(img.img, img.w - 2 * padding - 2, 0, 2, 2, img.x + img.w - padding, img.y, padding, padding); // top-right
                ctx.drawImage(img.img, 0, img.h - 2 * padding - 2, 2, 2, img.x, img.y + img.h - padding, padding, padding); // bottom-left
                ctx.drawImage(img.img, img.w - 2 * padding - 2, img.h - 2 * padding - 2, 2, 2, img.x + img.w - padding, img.y + img.h - padding, padding, padding); // bottom-right
            }
            img.x = (img.x + padding) / atlasSize;
            img.y = (img.y + padding) / atlasSize;
            img.w = (img.w - 2 * padding) / atlasSize;
            img.h = (img.h - 2 * padding) / atlasSize;
            bounds[img.name] = img;
        }
        let url = canvas.toDataURL();
        const atlasImage = await new Promise(res => {
            let img = new Image();
            img.onload = () => {
                res(img);
            };
            img.src = url;
        });
        return new TextureAtlas(atlasImage, bounds);
    }
}
///////////////////
//  COLOR CLASS  //
///////////////////
export class Color {
    constructor(argA, argB, argC, argD) {
        if (typeof argA === "string") {
            let comp = argA.split("(");
            if (comp.length == 0)
                throw new Error("Invalid color constructor: Empty string");
            if (comp.length < 2)
                throw new Error("Invalid color constructor: " + comp[0]);
            let cstruct = comp[0];
            let cparam = comp[1].replace(")", "");
            if (cstruct === "rgb" || cstruct === "rgba") {
                let cargs = cparam.split(",");
                if (cargs.length < 3 || cargs.length > 4)
                    throw new Error("Invalid color argument count: " + cargs.length);
                let r = parseInt(cargs[0]);
                let g = parseInt(cargs[1]);
                let b = parseInt(cargs[2]);
                let a = cargs[3] ? parseFloat(cargs[3]) : 1;
                if (isNaN(r))
                    throw new Error("Invalid color value: " + cargs[0]);
                if (isNaN(g))
                    throw new Error("Invalid color value: " + cargs[1]);
                if (isNaN(b))
                    throw new Error("Invalid color value: " + cargs[2]);
                if (isNaN(a))
                    throw new Error("Invalid color value: " + cargs[3]);
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
            }
            else if (cstruct === "hsv" || cstruct === "hsva") {
                let cargs = cparam.split(",");
                if (cargs.length < 3 || cargs.length > 4)
                    throw new Error("Invalid color argument count: " + cargs.length);
                let h;
                if (cargs[0].includes("rad")) {
                    h = parseFloat(cargs[0]) * 180 / Math.PI;
                }
                else {
                    h = parseInt(cargs[0]);
                }
                let s = parseInt(cargs[1]);
                let v = parseInt(cargs[2]);
                let a = cargs[3] ? parseInt(cargs[3]) : 1;
                if (isNaN(h))
                    throw new Error("Invalid color value: " + cargs[0]);
                if (isNaN(s))
                    throw new Error("Invalid color value: " + cargs[1]);
                if (isNaN(v))
                    throw new Error("Invalid color value: " + cargs[2]);
                if (isNaN(a))
                    throw new Error("Invalid color value: " + cargs[3]);
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
            }
            else {
                throw new Error("Invalid color constructor: " + cstruct);
            }
        }
        else if (typeof argA === "number") {
            if (argB === undefined || argC === undefined) {
                throw new Error("Invalid color constructor: Not enough arguments");
            }
            this._r = EMath.clamp(Math.round(argA), 0, 255);
            this._g = EMath.clamp(Math.round(argB), 0, 255);
            this._b = EMath.clamp(Math.round(argC), 0, 255);
            this.a = EMath.clamp(argD ?? 1, 0, 1);
            this._outdatedRgb = false;
            this._outdatedHsv = true;
        }
        else if (argA === undefined) {
            this._r = 0;
            this._g = 0;
            this._b = 0;
            this.a = 1;
            this._outdatedRgb = false;
            this._outdatedHsv = true;
        }
        else {
            this._r = argA.r;
            this._g = argA.g;
            this._b = argA.b;
            this.a = argA.a;
            this._outdatedRgb = false;
            this._outdatedHsv = true;
        }
    }
    onMutate;
    mutate() {
        if (this.onMutate)
            this.onMutate();
    }
    clone() {
        return new Color(this);
    }
    static decimalToRGB(d) {
        d = EMath.clamp(d, 0, 1 - 1e-6);
        let index = Math.floor(d * 16777216);
        let r = (index >> 16) & 0xFF;
        let g = (index >> 8) & 0xFF;
        let b = (index) & 0xFF;
        return new Color(r, g, b);
    }
    _outdatedRgb;
    _r = 0;
    /**
     * (int) red value of the color, 0 - 255.
    */
    set r(value) {
        value = EMath.clamp(Math.round(value), 0, 255);
        if (value == this._r)
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
    set g(value) {
        value = EMath.clamp(Math.round(value), 0, 255);
        if (value == this._g)
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
    set b(value) {
        value = EMath.clamp(Math.round(value), 0, 255);
        if (value == this._b)
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
        if (this._outdatedRgb != true)
            return;
        const { _hue: h, _sat: s, _val: v } = this;
        const c = v / 100 * s / 100;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = v / 100 - c;
        let rp = 0, gp = 0, bp = 0;
        switch (Math.floor(h / 60)) {
            case 0:
                rp = c;
                gp = x;
                break;
            case 1:
                rp = x;
                gp = c;
                break;
            case 2:
                gp = c;
                bp = x;
                break;
            case 3:
                gp = x;
                bp = c;
                break;
            case 4:
                rp = x;
                bp = c;
                break;
            default:
                rp = c;
                bp = x;
                break;
        }
        this._r = Math.round((rp + m) * 255);
        this._g = Math.round((gp + m) * 255);
        this._b = Math.round((bp + m) * 255);
        this._outdatedRgb = false;
    }
    _outdatedHsv;
    _hue = 0;
    /**
     * (decimal) hue of the color in degrees, 0 - 360.
    */
    set hue(value) {
        value = EMath.pmod(value, 360);
        if (value == this._hue)
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
    set sat(value) {
        value = EMath.clamp(value, 0, 100);
        if (value == this._sat)
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
    set val(value) {
        value = EMath.clamp(value, 0, 100);
        if (value == this._val)
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
        if (this._outdatedHsv != true)
            return;
        const max = Math.max(this.r, this.g, this.b);
        const min = Math.min(this.r, this.g, this.b);
        const delta = max - min;
        let h = 0;
        if (delta !== 0) {
            if (max === this.r)
                h = 60 * (((this.g - this.b) / delta + 6) % 6);
            else if (max === this.g)
                h = 60 * ((this.b - this.r) / delta + 2);
            else
                h = 60 * ((this.r - this.g) / delta + 4);
        }
        if (h < 0)
            h += 360;
        const s = max === 0 ? 0 : delta / max * 100;
        const v = max / 255 * 100;
        this._hue = h;
        this._sat = s;
        this._val = v;
        this._outdatedHsv = false;
    }
    /**
     * (decimal) alpha/opacity of the color, 0 - 1.
    */
    a = 1;
    strictEquals(other) {
        this.updateRgb();
        other.updateRgb();
        return (this._r == other._r
            && this._g == other._g
            && this._b == other._b
            && this.a == other.a);
    }
    isClose(other, e = 1e-6) {
        this.updateRgb();
        other.updateRgb();
        return (EMath.isClose(this._r, other._r, e)
            && EMath.isClose(this._g, other._g, e)
            && EMath.isClose(this._b, other._b, e)
            && EMath.isClose(this.a, other.a, e));
    }
    strictEqualsRgb(other) {
        this.updateRgb();
        other.updateRgb();
        return (this._r == other._r
            && this._g == other._g
            && this._b == other._b);
    }
    isCloseRgb(other, e = 1e-6) {
        this.updateRgb();
        other.updateRgb();
        return (EMath.isClose(this._r, other._r, e)
            && EMath.isClose(this._g, other._g, e)
            && EMath.isClose(this._b, other._b, e));
    }
    lerpRgba(other, t) {
        return this.clone().lerpRgbaSelf(other, t);
    }
    lerpRgbaSelf(other, t) {
        this.updateRgb();
        other.updateRgb();
        this._r = EMath.lerp(this._r, other._r, t);
        this._g = EMath.lerp(this._g, other._g, t);
        this._b = EMath.lerp(this._b, other._b, t);
        this.a = EMath.lerp(this.a, other.a, t);
        this.mutate();
        return this;
    }
    lerpHsva(other, t) {
        return this.clone().lerpHsvaSelf(other, t);
    }
    lerpHsvaSelf(other, t) {
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
        let { _r: r, _g: g, _b: b } = this;
        r /= 255;
        g /= 255;
        b /= 255;
        r = (r < 0.03928) ? (r / 12.92) : (((r + 0.055) / 1.055) ** 2.4);
        g = (g < 0.03928) ? (g / 12.92) : (((g + 0.055) / 1.055) ** 2.4);
        b = (b < 0.03928) ? (b / 12.92) : (((b + 0.055) / 1.055) ** 2.4);
        let l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return l < threshold;
    }
    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
    toRgbaArray() {
        return [this.r, this.g, this.b, this.a];
    }
    toHsvaArray() {
        return [this.hue, this.sat, this.val, this.a];
    }
}
/////////////////////
//  INPUT CLASSES  //
/////////////////////
export class Keypresses {
    static keyPressed = {};
    static pressedKeys = new Set();
    static keyDownEvent = new Signal();
    static keyUpEvent = new Signal();
}
export function keydown(key) {
    Keypresses.keyPressed[key] = true;
    Keypresses.pressedKeys.add(key);
    Keypresses.keyDownEvent.fire(key);
}
export function keyup(key) {
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
    if (e.button === 0) {
        keydown("lmb");
    }
    else if (e.button === 1) {
        keydown("mmb");
    }
    else if (e.button === 2) {
        keydown("rmb");
    }
});
window.addEventListener("mouseup", e => {
    if (e.button === 0) {
        keyup("lmb");
    }
    else if (e.button === 1) {
        keyup("mmb");
    }
    else if (e.button === 2) {
        keyup("rmb");
    }
});
export class PointerLock {
    connections = new ConnectionGroup();
    pointerLockChangeEvent = new Signal();
    lockedMouseMoveEvent = new Signal();
    isEnabled = false;
    constructor() {
        this.connections.add(new HtmlConnection(window, "mousedown", (e) => {
            if (this.isEnabled && document.pointerLockElement == null) {
                document.body.requestPointerLock();
            }
        }));
        this.connections.add(new HtmlConnection(window, "mousemove", (e) => {
            if (document.pointerLockElement != null)
                this.lockedMouseMoveEvent.fire(e.movementX, e.movementY);
        }));
        this.connections.add(new HtmlConnection(document, "pointerlockchange", () => {
            this.pointerLockChangeEvent.fire(document.pointerLockElement != null);
        }));
    }
    lock() {
        this.isEnabled = true;
        document.body.requestPointerLock();
        return this;
    }
    unlock() {
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
    resizeEvent = new Signal({
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
    callback;
    renderSteppedEvent = new Signal();
    runIndex = 0;
    isRunning = false;
    constructor(callback) {
        this.callback = callback;
    }
    stop() {
        if (!this.isRunning)
            return this;
        this.isRunning = false;
        this.runIndex++;
        return this;
    }
    start() {
        if (this.isRunning)
            return this;
        this.isRunning = true;
        let ri = this.runIndex;
        let frameTime = performance.now() / 1000;
        const render = () => {
            if (this.runIndex != ri) {
                return;
            }
            let now = performance.now() / 1000;
            let dt = now - frameTime;
            frameTime = now;
            this.renderSteppedEvent.fire(dt);
            this.callback(dt);
            requestAnimationFrame(render);
        };
        render();
        return this;
    }
}
export const SigmoidActivation = {
    activate: (z) => 1 / (1 + Math.exp(-z)),
    da_dz: (z, a) => a * (1 - a),
    name: "Sigmoid",
};
export const ReluActivation = {
    activate: (z) => Math.max(z, 0),
    da_dz: (z, a) => z > 0 ? 1 : 0,
    name: "ReLU",
};
export const LinearActivation = {
    activate: (z) => z,
    da_dz: (z, a) => 1,
    name: "Linear",
};
export function softmaxLayer(layer) {
    let max = -Infinity;
    for (let i = 0; i < layer.size; i++) {
        max = Math.max(max, layer.values_z[i]);
    }
    let sum = 0;
    for (let i = 0; i < layer.size; i++) {
        const v = Math.exp(layer.values_z[i] - max);
        layer.values_a[i] = v;
        sum += v;
    }
    for (let i = 0; i < layer.size; i++) {
        layer.values_a[i] /= sum;
    }
}
export const MseError = {
    derr_da: (layer, output, i) => {
        return -2 / layer.size * (output[i] - layer.values_a[i]);
    },
};
export const XavierNormal = {
    get: (nIn, nOut) => {
        const p1 = Math.sqrt(-2 * Math.log(Math.max(Math.random(), 1e-7)));
        const p2 = Math.cos(2 * Math.PI * Math.random());
        const p3 = Math.sqrt(2 / (nIn + nOut));
        return p1 * p2 * p3;
    }
};
export const XavierUniform = {
    get: (nIn, nOut) => {
        const limit = Math.sqrt(6 / (nIn + nOut));
        return Math.random() * (2 * limit) - limit;
    }
};
export const HeNormal = {
    get: (nIn, nOut) => {
        const p1 = Math.sqrt(-2 * Math.log(Math.max(Math.random(), 1e-7)));
        const p2 = Math.cos(2 * Math.PI * Math.random());
        const p3 = Math.sqrt(2 / nIn);
        return p1 * p2 * p3;
    }
};
export const HeUniform = {
    get: (nIn, nOut) => {
        const limit = Math.sqrt(6 / nIn);
        return Math.random() * (2 * limit) - limit;
    }
};
export const RandomUniform = {
    get: (nIn, nOut) => {
        return (Math.random() * 2 - 1) * 0.01;
    }
};
export class LayerOptimizer {
}
export class SgdOptimizer extends LayerOptimizer {
    layer;
    constructor(layer) {
        super();
        this.layer = layer;
    }
    applyGradients(learnRate, batchSize, clearGradients) {
        const layer = this.layer;
        const l = learnRate / batchSize;
        for (let i = 0; i < layer.size; i++) {
            for (let j = 0; j < layer.inputSize; j++) {
                layer.weights[i][j] -= layer.weightGrads[i][j] * l;
                if (clearGradients)
                    layer.weightGrads[i][j] = 0;
            }
            layer.biases[i] -= layer.biasGrads[i] * l;
            if (clearGradients)
                layer.biasGrads[i] = 0;
        }
    }
}
export class AdamOptimizer extends LayerOptimizer {
    layer;
    beta1;
    beta2;
    epsilon;
    t;
    weightM;
    weightV;
    biasM;
    biasV;
    constructor(layer, beta1 = 0.9, beta2 = 0.999, epsilon = 1e-8, t = 0) {
        super();
        this.layer = layer;
        this.beta1 = beta1;
        this.beta2 = beta2;
        this.epsilon = epsilon;
        this.t = t;
        this.weightM = [];
        this.weightV = [];
        for (let i = 0; i < layer.size; i++) {
            this.weightM.push(new Float32Array(layer.inputSize));
            this.weightV.push(new Float32Array(layer.inputSize));
        }
        this.biasM = new Float32Array(layer.size);
        this.biasV = new Float32Array(layer.size);
    }
    applyGradients(learnRate, batchSize, clearGradients) {
        const layer = this.layer;
        const lr = learnRate / batchSize;
        this.t++;
        const b1 = this.beta1;
        const b2 = this.beta2;
        const eps = this.epsilon;
        for (let i = 0; i < layer.size; i++) {
            const gB = layer.biasGrads[i];
            this.biasM[i] = b1 * this.biasM[i] + (1 - b1) * gB;
            this.biasV[i] = b2 * this.biasV[i] + (1 - b2) * gB * gB;
            const mHatB = this.biasM[i] / (1 - Math.pow(b1, this.t));
            const vHatB = this.biasV[i] / (1 - Math.pow(b2, this.t));
            layer.biases[i] -= lr * mHatB / (Math.sqrt(vHatB) + eps);
            for (let j = 0; j < layer.inputSize; j++) {
                const gW = layer.weightGrads[i][j];
                this.weightM[i][j] = b1 * this.weightM[i][j] + (1 - b1) * gW;
                this.weightV[i][j] = b2 * this.weightV[i][j] + (1 - b2) * gW * gW;
                const mHat = this.weightM[i][j] / (1 - Math.pow(b1, this.t));
                const vHat = this.weightV[i][j] / (1 - Math.pow(b2, this.t));
                layer.weights[i][j] -= lr * mHat / (Math.sqrt(vHat) + eps);
            }
        }
    }
}
export class DenseLayer {
    inputSize;
    size;
    activationOrOverride;
    values_a;
    values_z;
    derr_dz;
    weights;
    weightGrads;
    biases;
    biasGrads;
    optimizer;
    constructor(inputSize, size, activationOrOverride, optimizer, weightInit) {
        this.inputSize = inputSize;
        this.size = size;
        this.activationOrOverride = activationOrOverride;
        this.values_a = new Float32Array(size);
        this.values_z = new Float32Array(size);
        this.derr_dz = new Float32Array(size);
        this.weights = [];
        this.weightGrads = [];
        this.biases = new Float32Array(size);
        this.biasGrads = new Float32Array(size);
        for (let i = 0; i < size; i++) {
            this.weights.push(new Float32Array(inputSize));
            this.weightGrads.push(new Float32Array(inputSize));
        }
        this.randomizeWeights(weightInit ?? ((activationOrOverride != "softmax_cross_entropy" && activationOrOverride.name.toLowerCase() == "relu") ? HeNormal : XavierUniform));
        this.optimizer = optimizer ?? new AdamOptimizer(this);
    }
    randomizeWeights(method = XavierUniform) {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.inputSize; j++) {
                this.weights[i][j] = method.get(this.inputSize, this.size);
            }
        }
    }
    forward(input) {
        if (input instanceof DenseLayer)
            input = input.values_a;
        for (let i = 0; i < this.size; i++) {
            let z = this.biases[i];
            for (let j = 0; j < this.inputSize; j++)
                z += input[j] * this.weights[i][j];
            if (this.activationOrOverride != "softmax_cross_entropy") {
                let a = this.activationOrOverride.activate(z);
                this.values_a[i] = a;
            }
            this.values_z[i] = z;
        }
        if (this.activationOrOverride == "softmax_cross_entropy") {
            softmaxLayer(this);
        }
    }
    clearGradients() {
        for (let i = 0; i < this.size; i++) {
            this.biasGrads[i] = 0;
            for (let j = 0; j < this.inputSize; j++) {
                this.weightGrads[i][j] = 0;
            }
        }
    }
    backwardTarget(input, output, error = MseError, accumulate = true) {
        if (input instanceof DenseLayer)
            input = input.values_a;
        for (let i = 0; i < this.size; i++) {
            let derr_dz;
            if (this.activationOrOverride == "softmax_cross_entropy") {
                derr_dz = this.values_a[i] - output[i];
                this.derr_dz[i] = derr_dz;
            }
            else {
                const derr_da = error.derr_da(this, output, i);
                const da_dz = this.activationOrOverride.da_dz(this.values_z[i], this.values_a[i]);
                derr_dz = derr_da * da_dz;
                this.derr_dz[i] = derr_dz;
            }
            for (let j = 0; j < this.inputSize; j++) {
                const dz_dwij = input[j];
                const derr_dwij = derr_dz * dz_dwij;
                if (accumulate)
                    this.weightGrads[i][j] += derr_dwij;
                else
                    this.weightGrads[i][j] = derr_dwij;
            }
            if (accumulate)
                this.biasGrads[i] += derr_dz;
            else
                this.biasGrads[i] = derr_dz;
        }
    }
    backwardLayer(input, output, accumulate = true) {
        if (input instanceof DenseLayer)
            input = input.values_a;
        for (let i = 0; i < this.size; i++) {
            let derr_dai = 0;
            if (this.activationOrOverride == "softmax_cross_entropy")
                throw new Error("Cannot use softmax/cross-entropy on a hidden layer");
            const dai_dzi = this.activationOrOverride.da_dz(this.values_z[i], this.values_a[i]);
            for (let j = 0; j < output.size; j++)
                derr_dai += output.derr_dz[j] * output.weights[j][i];
            const derr_dz = derr_dai * dai_dzi;
            this.derr_dz[i] = derr_dz;
            for (let j = 0; j < this.inputSize; j++) {
                const dz_dwij = input[j];
                const derr_dwij = derr_dz * dz_dwij;
                if (accumulate)
                    this.weightGrads[i][j] += derr_dwij;
                else
                    this.weightGrads[i][j] = derr_dwij;
            }
            if (accumulate)
                this.biasGrads[i] += derr_dz;
            else
                this.biasGrads[i] = derr_dz;
        }
    }
    applyGradients(learnRate, batchSize, clearGradients = true) {
        this.optimizer.applyGradients(learnRate, batchSize, clearGradients);
    }
}
export class DenseNetwork {
    inputSize;
    layers = [];
    input;
    batches = 0;
    constructor(inputSize, layers) {
        this.inputSize = inputSize;
        this.input = new Float32Array(inputSize);
        for (let i = 0; i < layers.length; i++) {
            let layer = new DenseLayer(i == 0 ? inputSize : layers[i - 1][0], layers[i][0], layers[i][1], layers[i][2], layers[i][3]);
            this.layers.push(layer);
        }
    }
    forward(values) {
        let input = this.input;
        if (values)
            this.input.set(values);
        for (const layer of this.layers) {
            layer.forward(input);
            input = layer;
        }
    }
    backward(output, error = MseError) {
        for (let i = this.layers.length - 1; i >= 0; i--) {
            const layer = this.layers[i];
            const prevLayer = i == 0 ? this.input : this.layers[i - 1];
            if (i == this.layers.length - 1) {
                layer.backwardTarget(prevLayer, output, error, true);
            }
            else {
                layer.backwardLayer(prevLayer, this.layers[i + 1], true);
            }
        }
        this.batches++;
    }
    applyGradient(learnRate) {
        for (const layer of this.layers) {
            layer.applyGradients(learnRate, this.batches, true);
        }
        this.batches = 0;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGliZ2UzX3YyMDI2MDQyMy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpYmdlM192MjAyNjA0MjMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQStCO0FBQy9CLG1DQUFtQztBQUVuQyxxQkFBcUI7QUFDckIsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsRUFBVSxFQUFFLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUU3RSxtQkFBbUI7QUFDbkIsbUJBQW1CO0FBQ25CLG1CQUFtQjtBQUNuQixNQUFNLE9BQWdCLEtBQUs7SUFDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFTLEVBQUMsQ0FBUyxFQUFDLENBQVM7UUFDdEMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQVMsRUFBQyxDQUFTLEVBQUMsQ0FBUztRQUNyQyxPQUFPLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBUyxFQUFDLENBQVM7UUFDM0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLElBQVksSUFBSTtRQUNqRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxD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QyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUNELFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDcEMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFTO1FBQ1YsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFDRCxRQUFRLENBQUMsQ0FBUztRQUNkLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxJQUFJLENBQUMsS0FBVztRQUNaLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBQ0QsUUFBUSxDQUFDLEtBQVc7UUFDaEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELEtBQUssQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDakMsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFDRCxTQUFTLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQ3JDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxLQUFLLENBQUMsQ0FBUztRQUNYLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBQ0QsU0FBUyxDQUFDLENBQVM7UUFDZixJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FB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LENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUNyQixPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUNELFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUN6QixJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFTO1FBQ1YsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDRCxRQUFRLENBQUMsQ0FBUztRQUNkLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsSUFBSSxDQUFDLEtBQVc7UUFDWixPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBQ0QsUUFBUSxDQUFDLEtBQVc7UUFDaEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDN0IsSUFB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RSxDQUFDO1lBQ1YsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztTQUNiLENBQUM7SUFDTixDQUFDO0lBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDNUMsT0FBTztZQUNILENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDVixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ1YsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNWLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDYixDQUFDO0lBQ04sQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQ3hDLE9BQU87WUFDSCxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ1YsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNWLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDVixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1NBQ2IsQ0FBQztJQUNOLENBQUM7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQVM7UUFDcEIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE9BQU87WUFDSCxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ1YsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNWLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNYLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDYixDQUFDO0lBQ04sQ0FBQztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBUztRQUNwQixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsT0FBTztZQUNILENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNYLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDVixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ1YsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztTQUNiLENBQUM7SUFDTixDQUFDO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFTO1FBQ3BCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixPQUFPO1lBQ0gsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNWLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNYLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDVixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1NBQ2IsQ0FBQztJQUNOLENBQUM7SUFDRCxNQUFNLENBQUMsV0FBVyxDQUFDLElBQVksRUFBRSxNQUFjLEVBQUUsT0FBZSxDQUFDLEVBQUUsTUFBYyxJQUFJO1FBQ2pGLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNqQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDNUIsT0FBTztZQUNILENBQUMsR0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ2pCLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDVixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDM0IsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7U0FDakMsQ0FBQztJQUNOLENBQUM7SUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQVksRUFBRSxFQUFZO1FBQ3RDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN2QixLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDcEIsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNwQixHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUNYLEVBQUUsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBRTtzQkFDekIsRUFBRSxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFFO3NCQUMzQixFQUFFLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBRyxDQUFDLENBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBRyxDQUFDLENBQUU7c0JBQzNCLEVBQUUsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUNoQyxDQUFDO1lBQ04sQ0FBQztRQUNMLENBQUM7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7Q0FDSjtBQUdELDBCQUEwQjtBQUMxQixNQUFNLE9BQWdCLElBQUk7SUFDdEIsZ0JBQWUsQ0FBQztJQUVoQixNQUFNLENBQUMsR0FBRztRQUNOLE9BQU87WUFDSCxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDUCxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDUCxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDVixDQUFDO0lBQ04sQ0FBQztJQUNELE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBUyxFQUFFLENBQVM7UUFDakMsT0FBTztZQUNILENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNQLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNQLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztTQUNWLENBQUM7SUFDTixDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUM3QixPQUFPO1lBQ0gsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ1AsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ1AsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1NBQ1YsQ0FBQztJQUNOLENBQUM7SUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQVM7UUFDbkIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE9BQU87WUFDSCxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDUCxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNSLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztTQUNWLENBQUM7SUFDTixDQUFDO0lBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFZLEVBQUUsRUFBWTtRQUN0QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDdkIsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3BCLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDcEIsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FDWCxFQUFFLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBRyxDQUFDLENBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBRyxDQUFDLENBQUU7c0JBQ3pCLEVBQUUsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBRTtzQkFDM0IsRUFBRSxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQ2hDLENBQUM7WUFDTixDQUFDO1FBQ0wsQ0FBQztRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztDQUNKO0FBR0QsbUJBQW1CO0FBQ25CLG1CQUFtQjtBQUNuQixtQkFBbUI7QUFDbkIsTUFBTSxPQUFnQixLQUFLO0lBQ3ZCLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQ2xELE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDO1FBQ3BFLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQ3pDLENBQUM7SUFDRCxNQUFNLENBQUMsZUFBZSxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDN0QsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUM7UUFDdkYsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDekMsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBUztRQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLHlCQUF5QixDQUFDLEtBQUssR0FBRyxFQUFFO1FBQ3ZDLE1BQU0sU0FBUyxHQUFXLEVBQUUsQ0FBQztRQUM3QixLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDeEIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFDLEtBQUssQ0FBQztZQUNwQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0QsQ0FBQztRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFDRCxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxJQUFZLEVBQUUsU0FBaUI7UUFDNUUsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFFLENBQUM7SUFDdkYsQ0FBQztJQUNELE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLElBQVksRUFBRSxTQUFpQjtRQUMzRSxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEUsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUN4QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLE1BQU0sRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLE1BQU0sRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkMsTUFBTSxFQUFFLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QyxNQUFNLEVBQUUsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sR0FBRyxHQUFHLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sR0FBRyxHQUFHLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlFLE1BQU0sR0FBRyxHQUFHLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlFLE1BQU0sR0FBRyxHQUFHLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM5QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM5QixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMzQixPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFDRCxNQUFNLENBQUMseUJBQXlCLENBQUMsS0FBSyxHQUFHLEVBQUU7UUFDdkMsTUFBTSxTQUFTLEdBQVcsRUFBRSxDQUFDO1FBQzdCLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxLQUFLLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN0QixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLE1BQU0sS0FBSyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFDbkIsQ0FBQyxFQUNELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUN0QixDQUFDLENBQUM7UUFDUCxDQUFDO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUNELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxJQUFZLEVBQUUsU0FBaUI7UUFDdkYsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBRSxDQUFDO0lBQzFGLENBQUM7SUFDRCxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsSUFBWSxFQUFFLFNBQWlCO1FBQ3RGLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoRSxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ3hCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsTUFBTSxFQUFFLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pELE1BQU0sRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sSUFBSSxHQUFHLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDNUUsTUFBTSxJQUFJLEdBQUcsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNGLE1BQU0sSUFBSSxHQUFHLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRixNQUFNLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0YsTUFBTSxJQUFJLEdBQUcsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNGLE1BQU0sSUFBSSxHQUFHLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRixNQUFNLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0YsTUFBTSxJQUFJLEdBQUcsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdB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QUFRLEdBQVIsUUFBUSxDQUFNO0lBRWpDLENBQUM7SUFDRCxZQUFZLENBQUMsSUFBWTtRQUNyQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDM0IsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFDRCxnQkFBZ0IsQ0FBQyxJQUFZO1FBQ3pCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMzQixJQUFJLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFFLElBQUcsUUFBUSxFQUFFLENBQUM7WUFDVixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNqRyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xHLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3ZHLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDeEcsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNqQixJQUFHLEVBQUUsR0FBRyxPQUFPLEVBQUUsQ0FBQztnQkFBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFBQyxDQUFDO1lBQ2hELElBQUcsRUFBRSxHQUFHLE9BQU8sRUFBRSxDQUFDO2dCQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUM7WUFDaEQsSUFBRyxFQUFFLEdBQUcsT0FBTyxFQUFFLENBQUM7Z0JBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztnQkFBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQUMsQ0FBQztZQUNoRCxJQUFJLElBQVUsQ0FBQztZQUNmLElBQUksTUFBWSxDQUFDO1lBQ2pCLFFBQU8sUUFBUSxFQUFFLENBQUM7Z0JBQ2QsS0FBSyxDQUFDO29CQUNGLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9FLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO29CQUNqQixNQUFNO2dCQUNWLEtBQUssQ0FBQztvQkFDRixJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hGLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUN2QixNQUFNO2dCQUNWLEtBQUssQ0FBQztvQkFDRixJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMvRSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztvQkFDcEIsTUFBTTtnQkFDVixLQUFLLENBQUM7b0JBQ0YsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNoRixNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDMUIsTUFBTTtZQUNkLENBQUM7WUFDRCxPQUFPO2dCQUNILE1BQU0sRUFBRSxJQUFJO2dCQUNaLFNBQVMsRUFBRSxJQUFLO2dCQUNoQixRQUFRLEVBQUUsQ0FBQyxJQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ3RDLE1BQU0sRUFBRSxNQUFPO2FBQ2xCLENBQUE7UUFDTCxDQUFDO2FBQU0sQ0FBQztZQUNKLEVBQUUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsRUFBRSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzFFLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3RDLE9BQU87Z0JBQ0gsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsU0FBUyxFQUFFLElBQUk7Z0JBQ2YsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQzthQUNuQyxDQUFDO1FBQ04sQ0FBQztJQUNMLENBQUM7SUFDRCxZQUFZLENBQUMsTUFBZ0I7UUFDekIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pELE9BQU8sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEMsQ0FBQztJQUNELGNBQWMsQ0FBQyxNQUFnQjtRQUMzQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFDLENBQUM7Q0FDSjtBQUVELE1BQU0sT0FBTyxLQUFLO0lBQ0s7SUFBcUI7SUFBeEMsWUFBbUIsTUFBWSxFQUFTLFNBQWU7UUFBcEMsV0FBTSxHQUFOLE1BQU0sQ0FBTTtRQUFTLGNBQVMsR0FBVCxTQUFTLENBQU07SUFFdkQsQ0FBQztJQUNELFdBQVcsQ0FDUCxTQUFnRSxFQUNoRSxhQUFhLEdBQUcsSUFBSTtRQUVwQixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEUsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2SSxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkksSUFBSSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RCxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDakIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3pCLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxhQUFh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b0I7UUFDbkQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQWlCLENBQUM7UUFDdEMsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQWUsQ0FBQztRQUNuQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDM0IsSUFBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTTtZQUN6RixPQUFPO1FBQ1gsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDakcsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsRyxJQUFJLEVB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QyxDQUFDLENBQUM7UUFDdkksSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZJLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2SSxJQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDekIsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLGFBQWEsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ2hDLElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzNDLElBQUcsR0FBRyxLQUFLLFNBQVM7Z0JBQ2hCLE9BQU8sR0FBRyxDQUFDO1lBQ2YsSUFBRyxLQUFLLEdBQUcsS0FBSyxFQUFFLENBQUM7Z0JBQ2YsSUFBRyxLQUFLLEdBQUcsS0FBSyxFQUFFLENBQUM7b0JBQ2YsUUFBUSxHQUFHLEtBQUssQ0FBQztvQkFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUMzQixLQUFLLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDckIsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixDQUFDO3FCQUFNLENBQUM7b0JBQ0osUUFBUSxHQUFHLEtBQUssQ0FBQztvQkFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzQixLQUFLLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDckIsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixDQUFDO1lBQ0wsQ0FBQztpQkFBTSxDQUFDO2dCQUNKLElBQUcsS0FBSyxHQUFHLEtBQUssRUFBRSxDQUFDO29CQUNmLFFBQVEsR0FBRyxLQUFLLENBQUM7b0JBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDM0IsS0FBSyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsQ0FBQztxQkFBTSxDQUFDO29CQUNKLFFBQVEsR0FBRyxLQUFLLENBQUM7b0JBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0IsS0FBSyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUNELFVBQVUsQ0FBQyxNQUFjO1FBQ3JCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDOUQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDMUQsSUFBSSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDL0QsSUFBSSxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDM0QsSUFBRyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQztRQUNqRCxJQUFHLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQztZQUNkLElBQUksR0FBRyxLQUFLLENBQUM7WUFDYixNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUNELElBQUcsS0FBSyxHQUFHLElBQUk7WUFBRSxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQzlCLElBQUksS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQy9ELElBQUksS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENB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QUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU87Z0JBQzNHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUTtnQkFDMUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU07Z0JBQzFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxHQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUztnQkFDM0ksR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsV0FBVztnQkFDL0UsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLFlBQVk7Z0JBQzlHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxjQUFjO2dCQUNoSCxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxHQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLE9B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QUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUUsSUFBSSxFQUFFLEdBQUcsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUMxRCxLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNuQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsQ0FBRSxDQUFDO2dCQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsQ0FBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDaEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO2dCQUNyRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsQ0FBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsQ0FBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUks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UUFDbEUsS0FBSSxJQUFJLENBQUMsR0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3hDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFFLENBQUM7WUFDOUIsTUFBTSxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFFLENBQUM7WUFDMUQsSUFBRyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQzNCLEtBQUssQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDekQsQ0FBQztpQkFBTSxDQUFDO2dCQUNKLEtBQUssQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzVELENBQUM7UUFDTCxDQUFDO1FBQ0QsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFDRCxhQUFhLENBQUMsU0FBaUI7UUFDM0IsS0FBSSxNQUFNLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDN0IsS0FBSyxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxDQUFDO1FBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFDckIsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiLy8gM0QvMkQgSlMgR2FtZSBFbmdpbmUgTGlicmFyeVxyXG4vLyBodHRwczovL2dpdGh1Yi5jb20vc2xsZW5kZXJicmluZVxyXG5cclxuLy8gIERFTEFZIFVUSUxJVFkgIC8vXHJcbmV4cG9ydCBjb25zdCBkZWxheSA9IChtczogbnVtYmVyKSA9PiBuZXcgUHJvbWlzZShyZXMgPT4gc2V0VGltZW91dChyZXMsIG1zKSk7XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBFTUFUSCBDTEFTUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRU1hdGgge1xyXG4gICAgc3RhdGljIGNsYW1wKG46IG51bWJlcixhOiBudW1iZXIsYjogbnVtYmVyKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KG4sYSksYik7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgbGVycChhOiBudW1iZXIsYjogbnVtYmVyLHQ6IG51bWJlcikgOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBhKyhiLWEpKnQ7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcG1vZCh4OiBudW1iZXIsYTogbnVtYmVyKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICgoeCVhKSthKSVhO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGlzQ2xvc2UoYTogbnVtYmVyLCBiOiBudW1iZXIsIGU6IG51bWJlciA9IDFlLTYpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hYnMoYS1iKSA8IGU7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgaXNaZXJvKHY6IG51bWJlciwgZTogbnVtYmVyID0gMWUtNikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFicyh2KSA8IGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIEFSUkFZIFVUSUxTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBcnJheVV0aWxzIHtcclxuICAgIHN0YXRpYyBzaHVmZmxlU2VsZjxUPihhcnJheTogVFtdKTogVFtdIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gYXJyYXkubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xyXG4gICAgICAgICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XHJcbiAgICAgICAgICAgIFthcnJheVtpXSEsIGFycmF5W2pdIV0gPSBbYXJyYXlbal0hLCBhcnJheVtpXSFdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBWRUNUT1IgQ0xBU1NFUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgY2xhc3MgVmVjMyB7XHJcbiAgICBfeDogbnVtYmVyO1xyXG4gICAgX3k6IG51bWJlcjtcclxuICAgIF96OiBudW1iZXI7XHJcbiAgICBvbk11dGF0ZT86ICgpID0+IHZvaWQ7XHJcbiAgICBjb25zdHJ1Y3Rvcih2OiBWZWMzIHwge3g6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXJ9KTtcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpO1xyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyIHwgVmVjMyB8IHt4Om51bWJlciwgeTpudW1iZXIsIHo6bnVtYmVyfSwgeT86IG51bWJlciwgej86IG51bWJlcikge1xyXG4gICAgICAgIGlmKHR5cGVvZiB4ID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ggPSB4Lng7XHJcbiAgICAgICAgICAgIHRoaXMuX3kgPSB4Lnk7XHJcbiAgICAgICAgICAgIHRoaXMuX3ogPSB4Lno7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5feCA9IHg7XHJcbiAgICAgICAgICAgIHRoaXMuX3kgPSB5ISBhcyBudW1iZXI7XHJcbiAgICAgICAgICAgIHRoaXMuX3ogPSB6ITtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbXV0YXRlKCkge1xyXG4gICAgICAgIGlmKHRoaXMub25NdXRhdGUpXHJcbiAgICAgICAgICAgIHRoaXMub25NdXRhdGUoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0IHgodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3ggPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IHgoKSB7IHJldHVybiB0aGlzLl94OyB9XHJcbiAgICBzZXQgeSh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5feSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgeSgpIHsgcmV0dXJuIHRoaXMuX3k7IH1cclxuICAgIHNldCB6KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl96ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgIH1cclxuICAgIGdldCB6KCkgeyByZXR1cm4gdGhpcy5fejsgfVxyXG5cclxuICAgIC8vIFN0YXRpYyBDb25zdHJ1Y3RvcnNcclxuICAgIHN0YXRpYyBmaWxsKG46IG51bWJlcik6IFZlYzMgeyByZXR1cm4gbmV3IFZlYzMobiwgbiwgbik7IH1cclxuICAgIHN0YXRpYyB6ZXJvKCk6IFZlYzMgeyByZXR1cm4gVmVjMy5maWxsKDApOyB9XHJcbiAgICBzdGF0aWMgb25lKCk6IFZlYzMgeyByZXR1cm4gVmVjMy5maWxsKDEpOyB9XHJcbiAgICBzdGF0aWMgeEF4aXMoKTogVmVjMyB7IHJldHVybiBuZXcgVmVjMygxLCAwLCAwKTsgfVxyXG4gICAgc3RhdGljIHlBeGlzKCk6IFZlYzMgeyByZXR1cm4gbmV3IFZlYzMoMCwgMSwgMCk7IH1cclxuICAgIHN0YXRpYyB6QXhpcygpOiBWZWMzIHsgcmV0dXJuIG5ldyBWZWMzKDAsIDAsIDEpOyB9XHJcbiAgICBzdGF0aWMgcmFuZG9tKCk6IFZlYzMge1xyXG4gICAgICAgIGNvbnN0IHogPSBNYXRoLnJhbmRvbSgpICogMiAtIDE7XHJcbiAgICAgICAgY29uc3QgYSA9IE1hdGgucmFuZG9tKCkgKiAyICogTWF0aC5QSTtcclxuICAgICAgICBjb25zdCBiID0gTWF0aC5zcXJ0KE1hdGgubWF4KDAsIDEgLSB6ICogeikpO1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhiICogTWF0aC5jb3MoYSksIGIgKiBNYXRoLnNpbihhKSwgeik7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcmFuZG9tUm90YXRpb24oKTogVmVjMyB7XHJcbiAgICAgICAgY29uc3QgdiA9IFZlYzMucmFuZG9tKCk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHYucGl0Y2goKSwgdi55YXcoKSwgTWF0aC5yYW5kb20oKSAqIDIgKiBNYXRoLlBJKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBNaXNjZWxsYW5lb3VzXHJcbiAgICBnZXRJKGk6IG51bWJlcik6IG51bWJlciB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgc3dpdGNoKGkpIHtcclxuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gdGhpcy5feDtcclxuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gdGhpcy5feTtcclxuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gdGhpcy5fejtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIHNldEkoaTogbnVtYmVyLCB2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBzd2l0Y2goaSkge1xyXG4gICAgICAgICAgICBjYXNlIDA6IHRoaXMuX3ggPSB2OyB0aGlzLm11dGF0ZSgpOyByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgMTogdGhpcy5feSA9IHY7IHRoaXMubXV0YXRlKCk7IHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSAyOiB0aGlzLl96ID0gdjsgdGhpcy5tdXRhdGUoKTsgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNldChvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSBvdGhlci5feDtcclxuICAgICAgICB0aGlzLl95ID0gb3RoZXIuX3k7XHJcbiAgICAgICAgdGhpcy5feiA9IG90aGVyLl96O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzZXRDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0geDtcclxuICAgICAgICB0aGlzLl95ID0geTtcclxuICAgICAgICB0aGlzLl96ID0gejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xyXG4gICAgICAgIHlpZWxkIHRoaXMuX3g7XHJcbiAgICAgICAgeWllbGQgdGhpcy5feTtcclxuICAgICAgICB5aWVsZCB0aGlzLl96O1xyXG4gICAgfVxyXG4gICAgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gYDwke3RoaXMuX3gudG9GaXhlZCgyKX0sICR7dGhpcy5feS50b0ZpeGVkKDIpfSwgJHt0aGlzLl96LnRvRml4ZWQoMil9PmA7XHJcbiAgICB9XHJcbiAgICB0b0FycmF5KCk6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLl94LCB0aGlzLl95LCB0aGlzLl96XTtcclxuICAgIH1cclxuICAgIGNsb25lKCk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzKTtcclxuICAgIH1cclxuICAgIGdldFByaW1hcnlBeGlzKCk6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgYXggPSBNYXRoLmFicyh0aGlzLl94KTtcclxuICAgICAgICBjb25zdCBheSA9IE1hdGguYWJzKHRoaXMuX3kpO1xyXG4gICAgICAgIGNvbnN0IGF6ID0gTWF0aC5hYnModGhpcy5feik7XHJcbiAgICAgICAgaWYoYXggPiBheSkgcmV0dXJuIGF4ID4gYXogPyAwIDogMjtcclxuICAgICAgICBlbHNlIHJldHVybiBheSA+IGF6ID8gMSA6IDI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRpb25zXHJcbiAgICBsZW5ndGgoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMuZG90KHRoaXMpKTtcclxuICAgIH1cclxuICAgIGxlbmd0aFNxKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZG90KHRoaXMpO1xyXG4gICAgfVxyXG4gICAgZG90KG90aGVyOiBWZWMzKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5feCAqIG90aGVyLl94ICsgdGhpcy5feSAqIG90aGVyLl95ICsgdGhpcy5feiAqIG90aGVyLl96O1xyXG4gICAgfVxyXG4gICAgZG90Qyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5feCAqIHggKyB0aGlzLl95ICogeSArIHRoaXMuX3ogKiB6O1xyXG4gICAgfVxyXG4gICAgY3Jvc3Mob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feSAqIG90aGVyLl96IC0gdGhpcy5feiAqIG90aGVyLl95LCAtICh0aGlzLl94ICogb3RoZXIuX3ogLSB0aGlzLl96ICogb3RoZXIuX3gpLCB0aGlzLl94ICogb3RoZXIuX3kgLSB0aGlzLl95ICogb3RoZXIuX3gpO1xyXG4gICAgfVxyXG4gICAgY3Jvc3NDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feSAqIHogLSB0aGlzLl96ICogeSwgLSAodGhpcy5feCAqIHogLSB0aGlzLl96ICogeCksIHRoaXMuX3ggKiB5IC0gdGhpcy5feSAqIHgpO1xyXG4gICAgfVxyXG4gICAgYW5nbGVUbyhvdGhlcjogVmVjMyk6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgYyA9IHRoaXMubGVuZ3RoKCkgKiBvdGhlci5sZW5ndGgoKTtcclxuICAgICAgICBpZihjID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICByZXR1cm4gTWF0aC5hY29zKEVNYXRoLmNsYW1wKHRoaXMuZG90KG90aGVyKSAvIGMsIC0xLCAxKSk7XHJcbiAgICB9XHJcbiAgICBzaWduZWRBbmdsZVRvKG90aGVyOiBWZWMzLCByZWZlcmVuY2U6IFZlYzMgPSBWZWMzLnlBeGlzKCkpOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGFuZ2xlID0gdGhpcy5hbmdsZVRvKG90aGVyKTtcclxuICAgICAgICBjb25zdCBub3JtYWwgPSB0aGlzLmNyb3NzKG90aGVyKS5ub3JtU2VsZigpO1xyXG4gICAgICAgIGlmKG5vcm1hbC5kb3QocmVmZXJlbmNlLm5vcm0oKSkgPiAwKVxyXG4gICAgICAgICAgICByZXR1cm4gLWFuZ2xlO1xyXG4gICAgICAgIHJldHVybiBhbmdsZTtcclxuICAgIH1cclxuICAgIGRpc3RUbyhvdGhlcjogVmVjMyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViKG90aGVyKS5sZW5ndGgoKTtcclxuICAgIH1cclxuICAgIGRpc3RUb0MoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViQyh4LCB5LCB6KS5sZW5ndGgoKTtcclxuICAgIH1cclxuICAgIGRpc3RTcVRvKG90aGVyOiBWZWMzKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdWIob3RoZXIpLmxlbmd0aFNxKCk7XHJcbiAgICB9XHJcbiAgICBkaXN0U3FUb0MoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViQyh4LCB5LCB6KS5sZW5ndGhTcSgpO1xyXG4gICAgfVxyXG4gICAgc3RyaWN0RXF1YWxzKG90aGVyOiBWZWMzKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ggPT0gb3RoZXIuX3ggJiYgdGhpcy5feSA9PSBvdGhlci5feSAmJiB0aGlzLl96ID09IG90aGVyLl96O1xyXG4gICAgfVxyXG4gICAgaXNDbG9zZShvdGhlcjogVmVjMywgZSA9IDFlLTYpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gRU1hdGguaXNDbG9zZSh0aGlzLl94LCBvdGhlci5feCwgZSkgJiYgRU1hdGguaXNDbG9zZSh0aGlzLl95LCBvdGhlci5feSwgZSkgJiYgRU1hdGguaXNDbG9zZSh0aGlzLl96LCBvdGhlci5feiwgZSk7XHJcbiAgICB9XHJcbiAgICBpc1plcm8oZSA9IDFlLTYpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gRU1hdGguaXNaZXJvKHRoaXMuX3gsIGUpICYmIEVNYXRoLmlzWmVybyh0aGlzLl95LCBlKSAmJiBFTWF0aC5pc1plcm8odGhpcy5feiwgZSk7XHJcbiAgICB9XHJcbiAgICBwaXRjaCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFzaW4odGhpcy5feSk7XHJcbiAgICB9XHJcbiAgICB5YXcoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMigtdGhpcy5feCwgLXRoaXMuX3opO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE9wZXJhdGlvbnNcclxuICAgIGFkZChvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl94ICsgb3RoZXIuX3gsIHRoaXMuX3kgKyBvdGhlci5feSwgdGhpcy5feiArIG90aGVyLl96KTtcclxuICAgIH1cclxuICAgIGFkZFNlbGYob3RoZXI6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICs9IG90aGVyLl94O1xyXG4gICAgICAgIHRoaXMuX3kgKz0gb3RoZXIuX3k7XHJcbiAgICAgICAgdGhpcy5feiArPSBvdGhlci5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggKyB4LCB0aGlzLl95ICsgeSwgdGhpcy5feiArIHopO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0geDtcclxuICAgICAgICB0aGlzLl95ICs9IHk7XHJcbiAgICAgICAgdGhpcy5feiArPSB6O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRGKG46IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl94ICsgbiwgdGhpcy5feSArIG4sIHRoaXMuX3ogKyBuKTtcclxuICAgIH1cclxuICAgIGFkZFNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0gbjtcclxuICAgICAgICB0aGlzLl95ICs9IG47XHJcbiAgICAgICAgdGhpcy5feiArPSBuO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWQob3RoZXI6IFZlYzMsIHM6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuYWRkU2NhbGVkU2VsZihvdGhlciwgcyk7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWRTZWxmKG90aGVyOiBWZWMzLCBzOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICs9IG90aGVyLl94ICogcztcclxuICAgICAgICB0aGlzLl95ICs9IG90aGVyLl95ICogcztcclxuICAgICAgICB0aGlzLl96ICs9IG90aGVyLl96ICogcztcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBzOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmFkZFNjYWxlZFNlbGZDKHgsIHksIHosIHMpO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgczogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCArPSB4ICogcztcclxuICAgICAgICB0aGlzLl95ICs9IHkgKiBzO1xyXG4gICAgICAgIHRoaXMuX3ogKz0geiAqIHM7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN1YihvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl94IC0gb3RoZXIuX3gsIHRoaXMuX3kgLSBvdGhlci5feSwgdGhpcy5feiAtIG90aGVyLl96KTtcclxuICAgIH1cclxuICAgIHN1YlNlbGYob3RoZXI6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94IC09IG90aGVyLl94O1xyXG4gICAgICAgIHRoaXMuX3kgLT0gb3RoZXIuX3k7XHJcbiAgICAgICAgdGhpcy5feiAtPSBvdGhlci5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3ViQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggLSB4LCB0aGlzLl95IC0geSwgdGhpcy5feiAtIHopO1xyXG4gICAgfVxyXG4gICAgc3ViU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggLT0geDtcclxuICAgICAgICB0aGlzLl95IC09IHk7XHJcbiAgICAgICAgdGhpcy5feiAtPSB6O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWJGKG46IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl94IC0gbiwgdGhpcy5feSAtIG4sIHRoaXMuX3ogLSBuKTtcclxuICAgIH1cclxuICAgIHN1YlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggLT0gbjtcclxuICAgICAgICB0aGlzLl95IC09IG47XHJcbiAgICAgICAgdGhpcy5feiAtPSBuO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByc3ViKG90aGVyOiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKG90aGVyLl94IC0gdGhpcy5feCwgb3RoZXIuX3kgLSB0aGlzLl95LCBvdGhlci5feiAtIHRoaXMuX3opO1xyXG4gICAgfVxyXG4gICAgcnN1YlNlbGYob3RoZXI6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gb3RoZXIuX3ggLSB0aGlzLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSBvdGhlci5feSAtIHRoaXMuX3k7XHJcbiAgICAgICAgdGhpcy5feiA9IG90aGVyLl96IC0gdGhpcy5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcnN1YkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh4IC0gdGhpcy5feCwgeSAtIHRoaXMuX3ksIHogLSB0aGlzLl96KTtcclxuICAgIH1cclxuICAgIHJzdWJTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IHggLSB0aGlzLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSB5IC0gdGhpcy5feTtcclxuICAgICAgICB0aGlzLl96ID0geiAtIHRoaXMuX3o7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJzdWJGKG46IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhuIC0gdGhpcy5feCwgbiAtIHRoaXMuX3ksIG4gLSB0aGlzLl96KTtcclxuICAgIH1cclxuICAgIHJzdWJTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gbiAtIHRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IG4gLSB0aGlzLl95O1xyXG4gICAgICAgIHRoaXMuX3ogPSBuIC0gdGhpcy5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbXVsKG90aGVyOiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggKiBvdGhlci5feCwgdGhpcy5feSAqIG90aGVyLl95LCB0aGlzLl96ICogb3RoZXIuX3opO1xyXG4gICAgfVxyXG4gICAgbXVsU2VsZihvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKj0gb3RoZXIuX3g7XHJcbiAgICAgICAgdGhpcy5feSAqPSBvdGhlci5feTtcclxuICAgICAgICB0aGlzLl96ICo9IG90aGVyLl96O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBtdWxDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feCAqIHgsIHRoaXMuX3kgKiB5LCB0aGlzLl96ICogeik7XHJcbiAgICB9XHJcbiAgICBtdWxTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAqPSB4O1xyXG4gICAgICAgIHRoaXMuX3kgKj0geTtcclxuICAgICAgICB0aGlzLl96ICo9IHo7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG11bEYobjogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggKiBuLCB0aGlzLl95ICogbiwgdGhpcy5feiAqIG4pO1xyXG4gICAgfVxyXG4gICAgbXVsU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAqPSBuO1xyXG4gICAgICAgIHRoaXMuX3kgKj0gbjtcclxuICAgICAgICB0aGlzLl96ICo9IG47XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGRpdihvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl94IC8gb3RoZXIuX3gsIHRoaXMuX3kgLyBvdGhlci5feSwgdGhpcy5feiAvIG90aGVyLl96KTtcclxuICAgIH1cclxuICAgIGRpdlNlbGYob3RoZXI6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94IC89IG90aGVyLl94O1xyXG4gICAgICAgIHRoaXMuX3kgLz0gb3RoZXIuX3k7XHJcbiAgICAgICAgdGhpcy5feiAvPSBvdGhlci5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZGl2Qyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggLyB4LCB0aGlzLl95IC8geSwgdGhpcy5feiAvIHopO1xyXG4gICAgfVxyXG4gICAgZGl2U2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggLz0geDtcclxuICAgICAgICB0aGlzLl95IC89IHk7XHJcbiAgICAgICAgdGhpcy5feiAvPSB6O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBkaXZGKG46IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl94IC8gbiwgdGhpcy5feSAvIG4sIHRoaXMuX3ogLyBuKTtcclxuICAgIH1cclxuICAgIGRpdlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggLz0gbjtcclxuICAgICAgICB0aGlzLl95IC89IG47XHJcbiAgICAgICAgdGhpcy5feiAvPSBuO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByZGl2KG90aGVyOiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKG90aGVyLl94IC8gdGhpcy5feCwgb3RoZXIuX3kgLyB0aGlzLl95LCBvdGhlci5feiAvIHRoaXMuX3opO1xyXG4gICAgfVxyXG4gICAgcmRpdlNlbGYob3RoZXI6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gb3RoZXIuX3ggLyB0aGlzLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSBvdGhlci5feSAvIHRoaXMuX3k7XHJcbiAgICAgICAgdGhpcy5feiA9IG90aGVyLl96IC8gdGhpcy5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmRpdkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh4IC8gdGhpcy5feCwgeSAvIHRoaXMuX3ksIHogLyB0aGlzLl96KTtcclxuICAgIH1cclxuICAgIHJkaXZTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IHggLyB0aGlzLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSB5IC8gdGhpcy5feTtcclxuICAgICAgICB0aGlzLl96ID0geiAvIHRoaXMuX3o7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJkaXZGKG46IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhuIC8gdGhpcy5feCwgbiAvIHRoaXMuX3ksIG4gLyB0aGlzLl96KTtcclxuICAgIH1cclxuICAgIHJkaXZTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gbiAvIHRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IG4gLyB0aGlzLl95O1xyXG4gICAgICAgIHRoaXMuX3ogPSBuIC8gdGhpcy5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbmVnKCk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMygtdGhpcy5feCwgLXRoaXMuX3ksIC10aGlzLl96KTtcclxuICAgIH1cclxuICAgIG5lZ1NlbGYoKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IC10aGlzLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSAtdGhpcy5feTtcclxuICAgICAgICB0aGlzLl96ID0gLXRoaXMuX3o7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGxlcnAob3RoZXI6IFZlYzMsIHQ6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubGVycFNlbGYob3RoZXIsIHQpO1xyXG4gICAgfVxyXG4gICAgbGVycFNlbGYob3RoZXI6IFZlYzMsIHQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0gKG90aGVyLl94IC0gdGhpcy5feCkgKiB0O1xyXG4gICAgICAgIHRoaXMuX3kgKz0gKG90aGVyLl95IC0gdGhpcy5feSkgKiB0O1xyXG4gICAgICAgIHRoaXMuX3ogKz0gKG90aGVyLl96IC0gdGhpcy5feikgKiB0O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBsZXJwQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB0OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxlcnBTZWxmQyh4LCB5LCB6LCB0KTtcclxuICAgIH1cclxuICAgIGxlcnBTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICs9ICh4IC0gdGhpcy5feCkgKiB0O1xyXG4gICAgICAgIHRoaXMuX3kgKz0gKHkgLSB0aGlzLl95KSAqIHQ7XHJcbiAgICAgICAgdGhpcy5feiArPSAoeiAtIHRoaXMuX3opICogdDtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbm9ybSgpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLm5vcm1TZWxmKCk7XHJcbiAgICB9XHJcbiAgICBub3JtU2VsZigpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBtYWcgPSB0aGlzLmxlbmd0aCgpO1xyXG4gICAgICAgIGlmKG1hZyA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2U2VsZkMobWFnLCBtYWcsIG1hZyk7XHJcbiAgICB9XHJcbiAgICByZXNjYWxlKG1hZzogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yZXNjYWxlU2VsZihtYWcpO1xyXG4gICAgfVxyXG4gICAgcmVzY2FsZVNlbGYobWFnOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ub3JtU2VsZigpLm11bFNlbGZDKG1hZywgbWFnLCBtYWcpO1xyXG4gICAgfVxyXG4gICAgbG9vayhvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubG9va1NlbGYob3RoZXIpO1xyXG4gICAgfVxyXG4gICAgbG9va1NlbGYob3RoZXI6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yc3ViU2VsZihvdGhlcikubm9ybVNlbGYoKTtcclxuICAgIH1cclxuICAgIGNsYW1wTGVuZ3RoKGE6IG51bWJlciwgYjogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5jbGFtcExlbmd0aFNlbGYoYSwgYik7XHJcbiAgICB9XHJcbiAgICBjbGFtcExlbmd0aFNlbGYoYTogbnVtYmVyLCBiOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNjYWxlU2VsZihFTWF0aC5jbGFtcCh0aGlzLmxlbmd0aCgpLCBhLCBiKSk7XHJcbiAgICB9XHJcbiAgICBmbGF0KCk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuZmxhdFNlbGYoKTtcclxuICAgIH1cclxuICAgIGZsYXRTZWxmKCk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3kgPSAwO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBmbGF0Tm9ybSgpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmZsYXROb3JtU2VsZigpO1xyXG4gICAgfVxyXG4gICAgZmxhdE5vcm1TZWxmKCk6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZsYXRTZWxmKCkubm9ybVNlbGYoKTtcclxuICAgIH1cclxuICAgIHNldERvdChvdGhlcjogVmVjMywgdGFyZ2V0OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnNldERvdFNlbGYob3RoZXIsIHRhcmdldCk7XHJcbiAgICB9XHJcbiAgICBzZXREb3RTZWxmKG90aGVyOiBWZWMzLCB0YXJnZXQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IGQgPSBvdGhlci5kb3Qob3RoZXIpO1xyXG4gICAgICAgIGlmKGQgPT09IDApIHJldHVybiB0aGlzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNjYWxlZFNlbGYob3RoZXIsICh0YXJnZXQgLSB0aGlzLmRvdChvdGhlcikpIC8gZCk7XHJcbiAgICB9XHJcbiAgICBzZXREb3RDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHRhcmdldDogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5zZXREb3RTZWxmQyh4LCB5LCB6LCB0YXJnZXQpO1xyXG4gICAgfVxyXG4gICAgc2V0RG90U2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdGFyZ2V0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBkID0geCp4ICsgeSp5ICsgeip6O1xyXG4gICAgICAgIGlmKGQgPT09IDApIHJldHVybiB0aGlzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNjYWxlZFNlbGZDKHgsIHksIHosICh0YXJnZXQgLSB0aGlzLmRvdEMoeCwgeSwgeikpIC8gZCk7XHJcbiAgICB9XHJcbiAgICBtYXAobWV0aG9kOiAoeDogbnVtYmVyLCBpOiBudW1iZXIpID0+IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubWFwU2VsZihtZXRob2QpO1xyXG4gICAgfVxyXG4gICAgbWFwU2VsZihtZXRob2Q6ICh4OiBudW1iZXIsIGk6IG51bWJlcikgPT4gbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IG1ldGhvZCh0aGlzLl94LCAwKTtcclxuICAgICAgICB0aGlzLl95ID0gbWV0aG9kKHRoaXMuX3ksIDEpO1xyXG4gICAgICAgIHRoaXMuX3ogPSBtZXRob2QodGhpcy5feiwgMik7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdFgoYTogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RYU2VsZihhKTtcclxuICAgIH1cclxuICAgIHJvdFhTZWxmKGE6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhKSwgYyA9IE1hdGguY29zKGEpO1xyXG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLl95ICogYyAtIHRoaXMuX3ogKiBzO1xyXG4gICAgICAgIHRoaXMuX3ogPSB0aGlzLl95ICogcyArIHRoaXMuX3ogKiBjO1xyXG4gICAgICAgIHRoaXMuX3kgPSB5O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByb3RZKGE6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90WVNlbGYoYSk7XHJcbiAgICB9XHJcbiAgICByb3RZU2VsZihhOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSksIGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCB6ID0gdGhpcy5feiAqIGMgLSB0aGlzLl94ICogcztcclxuICAgICAgICB0aGlzLl94ID0gdGhpcy5feCAqIGMgKyB0aGlzLl96ICogcztcclxuICAgICAgICB0aGlzLl96ID0gejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm90WihhOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdFpTZWxmKGEpO1xyXG4gICAgfVxyXG4gICAgcm90WlNlbGYoYTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGEpLCBjID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3QgeCA9IHRoaXMuX3ggKiBjIC0gdGhpcy5feSAqIHM7XHJcbiAgICAgICAgdGhpcy5feSA9IHRoaXMuX3ggKiBzICsgdGhpcy5feSAqIGM7XHJcbiAgICAgICAgdGhpcy5feCA9IHg7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdEF4aXMoYXhpczogVmVjMywgYW5nbGU6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90QXhpc1NlbGYoYXhpcywgYW5nbGUpO1xyXG4gICAgfVxyXG4gICAgcm90QXhpc1NlbGYoYXhpczogVmVjMywgYW5nbGU6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGF4aXMgPSBheGlzLm5vcm0oKTtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYW5nbGUpLCBjID0gTWF0aC5jb3MoYW5nbGUpO1xyXG4gICAgICAgIGNvbnN0IGNyb3NzID0gYXhpcy5jcm9zcyh0aGlzKTtcclxuICAgICAgICBjb25zdCBkb3QgPSBheGlzLmRvdCh0aGlzKTtcclxuICAgICAgICBsZXQgeCA9IHRoaXMuX3gsIHkgPSB0aGlzLl95LCB6ID0gdGhpcy5fejtcclxuICAgICAgICB0aGlzLl94ID0geCAqIGMgKyBjcm9zcy5feCAqIHMgKyBheGlzLl94ICogZG90ICogKDEgLSBjKTtcclxuICAgICAgICB0aGlzLl95ID0geSAqIGMgKyBjcm9zcy5feSAqIHMgKyBheGlzLl95ICogZG90ICogKDEgLSBjKTtcclxuICAgICAgICB0aGlzLl96ID0geiAqIGMgKyBjcm9zcy5feiAqIHMgKyBheGlzLl96ICogZG90ICogKDEgLSBjKTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm90WFlaKHJvdDogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90WFlaU2VsZihyb3QpO1xyXG4gICAgfVxyXG4gICAgcm90WFlaU2VsZihyb3Q6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3RYU2VsZihyb3QuX3gpLnJvdFlTZWxmKHJvdC5feSkucm90WlNlbGYocm90Ll96KTtcclxuICAgIH1cclxuICAgIHJvdFhZWkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90WFlaU2VsZkMoeCwgeSwgeik7XHJcbiAgICB9XHJcbiAgICByb3RYWVpTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90WFNlbGYoeCkucm90WVNlbGYoeSkucm90WlNlbGYoeik7XHJcbiAgICB9XHJcbiAgICByb3RaWVgocm90OiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RaWVhTZWxmKHJvdCk7XHJcbiAgICB9XHJcbiAgICByb3RaWVhTZWxmKHJvdDogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvdFpTZWxmKHJvdC5feikucm90WVNlbGYocm90Ll95KS5yb3RYU2VsZihyb3QuX3gpO1xyXG4gICAgfVxyXG4gICAgcm90WllYQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RaWVhTZWxmQyh4LCB5LCB6KTtcclxuICAgIH1cclxuICAgIHJvdFpZWFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3RaU2VsZih6KS5yb3RZU2VsZih5KS5yb3RYU2VsZih4KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFZlYzIge1xyXG4gICAgY29uc3RydWN0b3IodjogVmVjMiB8IHt4OiBudW1iZXIsIHk6IG51bWJlcn0pO1xyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpO1xyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyIHwge3g6bnVtYmVyLCB5Om51bWJlcn0sIHk/OiBudW1iZXIpIHtcclxuICAgICAgICBpZih0eXBlb2YgeCA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICB0aGlzLl94ID0geC54O1xyXG4gICAgICAgICAgICB0aGlzLl95ID0geC55O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ggPSB4O1xyXG4gICAgICAgICAgICB0aGlzLl95ID0geSBhcyBudW1iZXI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF94OiBudW1iZXI7XHJcbiAgICBnZXQgeCgpIHsgcmV0dXJuIHRoaXMuX3g7IH1cclxuICAgIHNldCB4KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl94ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgIH1cclxuICAgIF95OiBudW1iZXI7XHJcbiAgICBnZXQgeSgpIHsgcmV0dXJuIHRoaXMuX3k7IH1cclxuICAgIHNldCB5KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl95ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgIH1cclxuICAgIG9uTXV0YXRlPzogKCkgPT4gdm9pZDtcclxuXHJcbiAgICBtdXRhdGUoKSB7XHJcbiAgICAgICAgaWYodGhpcy5vbk11dGF0ZSlcclxuICAgICAgICAgICAgdGhpcy5vbk11dGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFN0YXRpYyBDb25zdHJ1Y3RvcnNcclxuICAgIHN0YXRpYyBmaWxsKG46IG51bWJlcik6IFZlYzIgeyByZXR1cm4gbmV3IFZlYzIobiwgbik7IH1cclxuICAgIHN0YXRpYyB6ZXJvKCk6IFZlYzIgeyByZXR1cm4gVmVjMi5maWxsKDApOyB9XHJcbiAgICBzdGF0aWMgb25lKCk6IFZlYzIgeyByZXR1cm4gVmVjMi5maWxsKDEpOyB9XHJcbiAgICBzdGF0aWMgeEF4aXMoKTogVmVjMiB7IHJldHVybiBuZXcgVmVjMigxLCAwKTsgfVxyXG4gICAgc3RhdGljIHlBeGlzKCk6IFZlYzIgeyByZXR1cm4gbmV3IFZlYzIoMCwgMSk7IH1cclxuICAgIHN0YXRpYyByYW5kb20oKTogVmVjMiB7XHJcbiAgICAgICAgY29uc3QgYSA9IE1hdGgucmFuZG9tKCkgKiAyICogTWF0aC5QSTtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoTWF0aC5jb3MoYSksIE1hdGguc2luKGEpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBNaXNjZWxsYW5lb3VzXHJcbiAgICBnZXRJKGk6IG51bWJlcik6IG51bWJlciB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgc3dpdGNoKGkpIHtcclxuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gdGhpcy5feDtcclxuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gdGhpcy5feTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIHNldEkoaTogbnVtYmVyLCB2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBzd2l0Y2goaSkge1xyXG4gICAgICAgICAgICBjYXNlIDA6IHRoaXMuX3ggPSB2OyByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgMTogdGhpcy5feSA9IHY7IHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgIH1cclxuICAgIHNldChvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSBvdGhlci5feDtcclxuICAgICAgICB0aGlzLl95ID0gb3RoZXIuX3k7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHNldEMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0geDtcclxuICAgICAgICB0aGlzLl95ID0geTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xyXG4gICAgICAgIHlpZWxkIHRoaXMuX3g7XHJcbiAgICAgICAgeWllbGQgdGhpcy5feTtcclxuICAgIH1cclxuICAgIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGA8JHt0aGlzLl94LnRvRml4ZWQoMil9LCAke3RoaXMuX3kudG9GaXhlZCgyKX0+YDtcclxuICAgIH1cclxuICAgIHRvQXJyYXkoKTogW251bWJlciwgbnVtYmVyXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLl94LCB0aGlzLl95XTtcclxuICAgIH1cclxuICAgIGNsb25lKCk6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxjdWxhdGlvbnNcclxuICAgIGxlbmd0aCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy5kb3QodGhpcykpO1xyXG4gICAgfVxyXG4gICAgbGVuZ3RoU3EoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kb3QodGhpcyk7XHJcbiAgICB9XHJcbiAgICBkb3Qob3RoZXI6IFZlYzIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl94ICogb3RoZXIuX3ggKyB0aGlzLl95ICogb3RoZXIuX3k7XHJcbiAgICB9XHJcbiAgICBkb3RDKHg6IG51bWJlciwgeTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5feCAqIHggKyB0aGlzLl95ICogeTtcclxuICAgIH1cclxuICAgIGFuZ2xlVG8ob3RoZXI6IFZlYzIpOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGMgPSB0aGlzLmxlbmd0aCgpICogb3RoZXIubGVuZ3RoKCk7XHJcbiAgICAgICAgaWYoYyA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWNvcyhFTWF0aC5jbGFtcCh0aGlzLmRvdChvdGhlcikgLyBjLCAtMSwgMSkpO1xyXG4gICAgfVxyXG4gICAgc2lnbmVkQW5nbGVUbyhvdGhlcjogVmVjMik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodGhpcy5feCAqIG90aGVyLl95IC0gdGhpcy5feSAqIG90aGVyLl94LCB0aGlzLmRvdChvdGhlcikpO1xyXG4gICAgfVxyXG4gICAgZGlzdFRvKG90aGVyOiBWZWMyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdWIob3RoZXIpLmxlbmd0aCgpO1xyXG4gICAgfVxyXG4gICAgZGlzdFRvQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViQyh4LCB5KS5sZW5ndGgoKTtcclxuICAgIH1cclxuICAgIGRpc3RTcVRvKG90aGVyOiBWZWMyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdWIob3RoZXIpLmxlbmd0aFNxKCk7XHJcbiAgICB9XHJcbiAgICBkaXN0U3FUb0MoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN1YkMoeCwgeSkubGVuZ3RoU3EoKTtcclxuICAgIH1cclxuICAgIHN0cmljdEVxdWFscyhvdGhlcjogVmVjMik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl94ID09IG90aGVyLl94ICYmIHRoaXMuX3kgPT0gb3RoZXIuX3k7XHJcbiAgICB9XHJcbiAgICBpc0Nsb3NlKG90aGVyOiBWZWMyLCBlID0gMWUtNik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5pc0Nsb3NlKHRoaXMuX3gsIG90aGVyLl94LCBlKSAmJiBFTWF0aC5pc0Nsb3NlKHRoaXMuX3ksIG90aGVyLl95LCBlKTtcclxuICAgIH1cclxuICAgIGlzWmVybyhlID0gMWUtNik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5pc1plcm8odGhpcy5feCwgZSkgJiYgRU1hdGguaXNaZXJvKHRoaXMuX3ksIGUpO1xyXG4gICAgfVxyXG4gICAgdGhldGEoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLl95LCB0aGlzLl94KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBPcGVyYXRpb25zXHJcbiAgICBhZGQob3RoZXI6IFZlYzIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5feCArIG90aGVyLl94LCB0aGlzLl95ICsgb3RoZXIuX3kpO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0gb3RoZXIuX3g7XHJcbiAgICAgICAgdGhpcy5feSArPSBvdGhlci5feTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLl94ICsgeCwgdGhpcy5feSArIHkpO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICs9IHg7XHJcbiAgICAgICAgdGhpcy5feSArPSB5O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRGKG46IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLl94ICsgbiwgdGhpcy5feSArIG4pO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCArPSBuO1xyXG4gICAgICAgIHRoaXMuX3kgKz0gbjtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkKG90aGVyOiBWZWMyLCBzOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmFkZFNjYWxlZFNlbGYob3RoZXIsIHMpO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkU2VsZihvdGhlcjogVmVjMiwgczogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCArPSBvdGhlci5feCAqIHM7XHJcbiAgICAgICAgdGhpcy5feSArPSBvdGhlci5feSAqIHM7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHM6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuYWRkU2NhbGVkU2VsZkMoeCwgeSwgcyk7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWRTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgczogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCArPSB4ICogcztcclxuICAgICAgICB0aGlzLl95ICs9IHkgKiBzO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWIob3RoZXI6IFZlYzIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5feCAtIG90aGVyLl94LCB0aGlzLl95IC0gb3RoZXIuX3kpO1xyXG4gICAgfVxyXG4gICAgc3ViU2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggLT0gb3RoZXIuX3g7XHJcbiAgICAgICAgdGhpcy5feSAtPSBvdGhlci5feTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3ViQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLl94IC0geCwgdGhpcy5feSAtIHkpO1xyXG4gICAgfVxyXG4gICAgc3ViU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94IC09IHg7XHJcbiAgICAgICAgdGhpcy5feSAtPSB5O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWJGKG46IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLl94IC0gbiwgdGhpcy5feSAtIG4pO1xyXG4gICAgfVxyXG4gICAgc3ViU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAtPSBuO1xyXG4gICAgICAgIHRoaXMuX3kgLT0gbjtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcnN1YihvdGhlcjogVmVjMik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMihvdGhlci5feCAtIHRoaXMuX3gsIG90aGVyLl95IC0gdGhpcy5feSk7XHJcbiAgICB9XHJcbiAgICByc3ViU2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSBvdGhlci5feCAtIHRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IG90aGVyLl95IC0gdGhpcy5feTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcnN1YkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoeCAtIHRoaXMuX3gsIHkgLSB0aGlzLl95KTtcclxuICAgIH1cclxuICAgIHJzdWJTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSB4IC0gdGhpcy5feDtcclxuICAgICAgICB0aGlzLl95ID0geSAtIHRoaXMuX3k7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJzdWJGKG46IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMihuIC0gdGhpcy5feCwgbiAtIHRoaXMuX3kpO1xyXG4gICAgfVxyXG4gICAgcnN1YlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSBuIC0gdGhpcy5feDtcclxuICAgICAgICB0aGlzLl95ID0gbiAtIHRoaXMuX3k7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBtdWwob3RoZXI6IFZlYzIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5feCAqIG90aGVyLl94LCB0aGlzLl95ICogb3RoZXIuX3kpO1xyXG4gICAgfVxyXG4gICAgbXVsU2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKj0gb3RoZXIuX3g7XHJcbiAgICAgICAgdGhpcy5feSAqPSBvdGhlci5feTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbXVsQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLl94ICogeCwgdGhpcy5feSAqIHkpO1xyXG4gICAgfVxyXG4gICAgbXVsU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICo9IHg7XHJcbiAgICAgICAgdGhpcy5feSAqPSB5O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBtdWxGKG46IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLl94ICogbiwgdGhpcy5feSAqIG4pO1xyXG4gICAgfVxyXG4gICAgbXVsU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAqPSBuO1xyXG4gICAgICAgIHRoaXMuX3kgKj0gbjtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZGl2KG90aGVyOiBWZWMyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMuX3ggLyBvdGhlci5feCwgdGhpcy5feSAvIG90aGVyLl95KTtcclxuICAgIH1cclxuICAgIGRpdlNlbGYob3RoZXI6IFZlYzIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94IC89IG90aGVyLl94O1xyXG4gICAgICAgIHRoaXMuX3kgLz0gb3RoZXIuX3k7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGRpdkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5feCAvIHgsIHRoaXMuX3kgLyB5KTtcclxuICAgIH1cclxuICAgIGRpdlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAvPSB4O1xyXG4gICAgICAgIHRoaXMuX3kgLz0geTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZGl2RihuOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5feCAvIG4sIHRoaXMuX3kgLyBuKTtcclxuICAgIH1cclxuICAgIGRpdlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggLz0gbjtcclxuICAgICAgICB0aGlzLl95IC89IG47XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJkaXYob3RoZXI6IFZlYzIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIob3RoZXIuX3ggLyB0aGlzLl94LCBvdGhlci5feSAvIHRoaXMuX3kpO1xyXG4gICAgfVxyXG4gICAgcmRpdlNlbGYob3RoZXI6IFZlYzIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gb3RoZXIuX3ggLyB0aGlzLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSBvdGhlci5feSAvIHRoaXMuX3k7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJkaXZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHggLyB0aGlzLl94LCB5IC8gdGhpcy5feSk7XHJcbiAgICB9XHJcbiAgICByZGl2U2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0geCAvIHRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IHkgLyB0aGlzLl95O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByZGl2RihuOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIobiAvIHRoaXMuX3gsIG4gLyB0aGlzLl95KTtcclxuICAgIH1cclxuICAgIHJkaXZTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gbiAvIHRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IG4gLyB0aGlzLl95O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBuZWcoKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKC10aGlzLl94LCAtdGhpcy5feSk7XHJcbiAgICB9XHJcbiAgICBuZWdTZWxmKCk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSAtdGhpcy5feDtcclxuICAgICAgICB0aGlzLl95ID0gLXRoaXMuX3k7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGxlcnAob3RoZXI6IFZlYzIsIHQ6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubGVycFNlbGYob3RoZXIsIHQpO1xyXG4gICAgfVxyXG4gICAgbGVycFNlbGYob3RoZXI6IFZlYzIsIHQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0gKG90aGVyLl94IC0gdGhpcy5feCkgKiB0O1xyXG4gICAgICAgIHRoaXMuX3kgKz0gKG90aGVyLl95IC0gdGhpcy5feSkgKiB0O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBsZXJwQyh4OiBudW1iZXIsIHk6IG51bWJlciwgdDogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sZXJwU2VsZkMoeCwgeSwgdCk7XHJcbiAgICB9XHJcbiAgICBsZXJwU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0gKHggLSB0aGlzLl94KSAqIHQ7XHJcbiAgICAgICAgdGhpcy5feSArPSAoeSAtIHRoaXMuX3kpICogdDtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbm9ybSgpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLm5vcm1TZWxmKCk7XHJcbiAgICB9XHJcbiAgICBub3JtU2VsZigpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBtYWcgPSB0aGlzLmxlbmd0aCgpO1xyXG4gICAgICAgIGlmKG1hZyA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2U2VsZkMobWFnLCBtYWcpO1xyXG4gICAgfVxyXG4gICAgcmVzY2FsZShtYWc6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucmVzY2FsZVNlbGYobWFnKTtcclxuICAgIH1cclxuICAgIHJlc2NhbGVTZWxmKG1hZzogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9ybVNlbGYoKS5tdWxTZWxmQyhtYWcsIG1hZyk7XHJcbiAgICB9XHJcbiAgICBsb29rKG90aGVyOiBWZWMyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sb29rU2VsZihvdGhlcik7XHJcbiAgICB9XHJcbiAgICBsb29rU2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJzdWJTZWxmKG90aGVyKS5ub3JtU2VsZigpO1xyXG4gICAgfVxyXG4gICAgY2xhbXBMZW5ndGgoYTogbnVtYmVyLCBiOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmNsYW1wTGVuZ3RoU2VsZihhLCBiKTtcclxuICAgIH1cclxuICAgIGNsYW1wTGVuZ3RoU2VsZihhOiBudW1iZXIsIGI6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc2NhbGVTZWxmKEVNYXRoLmNsYW1wKHRoaXMubGVuZ3RoKCksIGEsIGIpKTtcclxuICAgIH1cclxuICAgIHNldERvdChvdGhlcjogVmVjMiwgdGFyZ2V0OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnNldERvdFNlbGYob3RoZXIsIHRhcmdldCk7XHJcbiAgICB9XHJcbiAgICBzZXREb3RTZWxmKG90aGVyOiBWZWMyLCB0YXJnZXQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IGQgPSBvdGhlci5kb3Qob3RoZXIpO1xyXG4gICAgICAgIGlmKGQgPT09IDApIHJldHVybiB0aGlzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNjYWxlZFNlbGYob3RoZXIsICh0YXJnZXQgLSB0aGlzLmRvdChvdGhlcikpIC8gZCk7XHJcbiAgICB9XHJcbiAgICBzZXREb3RDKHg6IG51bWJlciwgeTogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuc2V0RG90U2VsZkMoeCwgeSwgdGFyZ2V0KTtcclxuICAgIH1cclxuICAgIHNldERvdFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IGQgPSB4KnggKyB5Knk7XHJcbiAgICAgICAgaWYoZCA9PT0gMCkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkU2NhbGVkU2VsZkMoeCwgeSwgKHRhcmdldCAtIHRoaXMuZG90Qyh4LCB5KSkgLyBkKTtcclxuICAgIH1cclxuICAgIG1hcChtZXRob2Q6ICh4OiBudW1iZXIsIGk6IG51bWJlcikgPT4gbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5tYXBTZWxmKG1ldGhvZCk7XHJcbiAgICB9XHJcbiAgICBtYXBTZWxmKG1ldGhvZDogKHg6IG51bWJlciwgaTogbnVtYmVyKSA9PiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gbWV0aG9kKHRoaXMuX3gsIDApO1xyXG4gICAgICAgIHRoaXMuX3kgPSBtZXRob2QodGhpcy5feSwgMSk7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdGF0ZShhOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdGF0ZVNlbGYoYSk7XHJcbiAgICB9XHJcbiAgICByb3RhdGVTZWxmKGE6IG51bWJlcikgOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSksIGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCB4ID0gdGhpcy54LCB5ID0gdGhpcy55O1xyXG4gICAgICAgIHRoaXMuX3ggPSB4ICogYyAtIHkgKiBzO1xyXG4gICAgICAgIHRoaXMuX3kgPSB4ICogcyArIHkgKiBjO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBNQVRSSVggQ0xBU1NFUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBDb2x1bW4tbWFqb3IgNHg0IG1hdHJpeFxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0NCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgICBcclxuICAgIHN0YXRpYyBuZXcoKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgMSwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMSwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMSwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHRyYW5zbGF0ZSh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgMSwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMSwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMSwgMCxcclxuICAgICAgICAgICAgeCwgeSwgeiwgMSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHNjYWxlKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB4LCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCB5LCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCB6LCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcm90YXRlWChhOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGEpO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIDEsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIGMsIHMsIDAsXHJcbiAgICAgICAgICAgIDAsIC1zLCBjLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyByb3RhdGVZKGE6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSk7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgYywgMCwgLXMsIDAsXHJcbiAgICAgICAgICAgIDAsIDEsIDAsIDAsXHJcbiAgICAgICAgICAgIHMsIDAsIGMsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDAsIDFcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJvdGF0ZVooYTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKGEpO1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhKTtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBjLCBzLCAwLCAwLFxyXG4gICAgICAgICAgICAtcywgYywgMCwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMSwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcGVyc3BlY3RpdmUoZm92WTogbnVtYmVyLCBhc3BlY3Q6IG51bWJlciwgbmVhcjogbnVtYmVyID0gMSwgZmFyOiBudW1iZXIgPSAxMDAwKSB7XHJcbiAgICAgICAgY29uc3QgZiA9IDEgLyBNYXRoLnRhbihmb3ZZIC8gMik7XHJcbiAgICAgICAgY29uc3QgbmYgPSAxIC8gKG5lYXIgLSBmYXIpO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIGYvYXNwZWN0LCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCBmLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAoZmFyICsgbmVhcikgKiBuZiwgLTEsXHJcbiAgICAgICAgICAgIDAsIDAsICgyICogZmFyICogbmVhcikgKiBuZiwgMFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgbXVsdGlwbHkobTE6IG51bWJlcltdLCBtMjogbnVtYmVyW10pIHtcclxuICAgICAgICBjb25zdCBvdXQgPSBNYXQ0Lm5ldygpO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPDQ7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDsgajw0OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIG91dFtpKjQgKyBqXSA9IChcclxuICAgICAgICAgICAgICAgICAgICBtMVswKjQgKyBqXSEgKiBtMltpKjQgKyAwXSFcclxuICAgICAgICAgICAgICAgICAgICArIG0xWzEqNCArIGpdISAqIG0yW2kqNCArIDFdIVxyXG4gICAgICAgICAgICAgICAgICAgICsgbTFbMio0ICsgal0hICogbTJbaSo0ICsgMl0hXHJcbiAgICAgICAgICAgICAgICAgICAgKyBtMVszKjQgKyBqXSEgKiBtMltpKjQgKyAzXSFcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vIENvbHVtbi1tYWpvciAzeDMgbWF0cml4XHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNYXQzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgICBzdGF0aWMgbmV3KCkge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIDEsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDEsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDEsXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyB0cmFuc2xhdGUoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAxLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAxLCAwLFxyXG4gICAgICAgICAgICB4LCB5LCAxLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgc2NhbGUoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB4LCAwLCAwLFxyXG4gICAgICAgICAgICAwLCB5LCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAxLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcm90YXRlKGE6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSk7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgYywgcywgMCxcclxuICAgICAgICAgICAgLXMsIGMsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDEsXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBtdWx0aXBseShtMTogbnVtYmVyW10sIG0yOiBudW1iZXJbXSkge1xyXG4gICAgICAgIGNvbnN0IG91dCA9IE1hdDMubmV3KCk7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8MzsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaj0wOyBqPDM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgb3V0W2kqMyArIGpdID0gKFxyXG4gICAgICAgICAgICAgICAgICAgIG0xWzAqMyArIGpdISAqIG0yW2kqMyArIDBdIVxyXG4gICAgICAgICAgICAgICAgICAgICsgbTFbMSozICsgal0hICogbTJbaSozICsgMV0hXHJcbiAgICAgICAgICAgICAgICAgICAgKyBtMVsyKjMgKyBqXSEgKiBtMltpKjMgKyAyXSFcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIE5PSVNFIENMQVNTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOb2lzZSB7XHJcbiAgICBzdGF0aWMgcmFuZG9tQ29uc3RhbnQzKGE6IG51bWJlciwgYjogbnVtYmVyLCBjOiBudW1iZXIpIDogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBpdCA9IChhICogMjM5NDgyMzU0OSkgXiAoYiAqIDQzODU5NzQyODUwKSBeIChjICogMjMwOTQ1NjUyMzQpO1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5wbW9kKGl0LCAxMDAwMCkgLyAxMDAwMDtcclxuICAgIH1cclxuICAgIHN0YXRpYyByYW5kb21Db25zdGFudDQoYTogbnVtYmVyLCBiOiBudW1iZXIsIGM6IG51bWJlciwgZDogbnVtYmVyKSA6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgaXQgPSAoYSAqIDIzOTQ4MjM1NDkpIF4gKGIgKiA0Mzg1OTc0Mjg1MCkgXiAoYyAqIDIzMDk0NTY1MjM0KSBeIChkICogODQyNzgyNDU2Nik7XHJcbiAgICAgICAgcmV0dXJuIEVNYXRoLnBtb2QoaXQsIDEwMDAwKSAvIDEwMDAwO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGZhZGUodDogbnVtYmVyKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHQgKiB0ICogdCAqICh0ICogKHQgKiA2IC0gMTUpICsgMTApO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdlbmVyYXRlUGVybGluMkRHcmFkaWVudHMoY291bnQgPSAxMikge1xyXG4gICAgICAgIGNvbnN0IGdyYWRpZW50czogVmVjMltdID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8Y291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBhbmdsZSA9IDIgKiBNYXRoLlBJICogaS9jb3VudDtcclxuICAgICAgICAgICAgZ3JhZGllbnRzLnB1c2gobmV3IFZlYzIoTWF0aC5jb3MoYW5nbGUpLCBNYXRoLnNpbihhbmdsZSkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGdyYWRpZW50cztcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRQZXJsaW4yRFZlY3RvckF0KHg6IG51bWJlciwgeTogbnVtYmVyLCBzZWVkOiBudW1iZXIsIGdyYWRpZW50czogVmVjMltdKSA6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBncmFkaWVudHNbTWF0aC5mbG9vcih0aGlzLnJhbmRvbUNvbnN0YW50MyhzZWVkLCB4LCB5KSAqIGdyYWRpZW50cy5sZW5ndGgpXSE7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0UGVybGluMkRWYWx1ZUF0KHg6IG51bWJlciwgeTogbnVtYmVyLCBzZWVkOiBudW1iZXIsIGdyYWRpZW50czogVmVjMltdKSA6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgZ2V0UGVybGluMkRWZWN0b3JBdCA9IHRoaXMuZ2V0UGVybGluMkRWZWN0b3JBdC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIGNvbnN0IGxlcnAgPSBFTWF0aC5sZXJwO1xyXG4gICAgICAgIGNvbnN0IGZhZGUgPSB0aGlzLmZhZGU7XHJcbiAgICAgICAgY29uc3QgZzAgPSBuZXcgVmVjMih4LCB5KS5tYXBTZWxmKE1hdGguZmxvb3IpO1xyXG4gICAgICAgIGNvbnN0IGcxID0gbmV3IFZlYzIoZzApLmFkZFNlbGZDKDEsIDEpO1xyXG4gICAgICAgIGNvbnN0IGYwID0gbmV3IFZlYzIoeCwgeSkuc3ViU2VsZihnMCk7XHJcbiAgICAgICAgY29uc3QgZjEgPSBuZXcgVmVjMih4LCB5KS5zdWJTZWxmKGcxKTtcclxuICAgICAgICBjb25zdCBjQUEgPSBnZXRQZXJsaW4yRFZlY3RvckF0KGcwLngsIGcwLnksIHNlZWQsIGdyYWRpZW50cykuZG90KGYwKTtcclxuICAgICAgICBjb25zdCBjQUIgPSBnZXRQZXJsaW4yRFZlY3RvckF0KGcwLngsIGcxLnksIHNlZWQsIGdyYWRpZW50cykuZG90QyhmMC54LCBmMS55KTtcclxuICAgICAgICBjb25zdCBjQkEgPSBnZXRQZXJsaW4yRFZlY3RvckF0KGcxLngsIGcwLnksIHNlZWQsIGdyYWRpZW50cykuZG90QyhmMS54LCBmMC55KTtcclxuICAgICAgICBjb25zdCBjQkIgPSBnZXRQZXJsaW4yRFZlY3RvckF0KGcxLngsIGcxLnksIHNlZWQsIGdyYWRpZW50cykuZG90KGYxKTtcclxuICAgICAgICBjb25zdCB0eCA9IGZhZGUoZjAueCk7XHJcbiAgICAgICAgY29uc3QgdHkgPSBmYWRlKGYwLnkpO1xyXG4gICAgICAgIGNvbnN0IGNBID0gbGVycChjQUEsIGNCQSwgdHgpO1xyXG4gICAgICAgIGNvbnN0IGNCID0gbGVycChjQUIsIGNCQiwgdHgpO1xyXG4gICAgICAgIGNvbnN0IGMgPSBsZXJwKGNBLCBjQiwgdHkpO1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5jbGFtcChjICogMC41ICsgMC41LCAwLCAxKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZW5lcmF0ZVBlcmxpbjNER3JhZGllbnRzKGNvdW50ID0gMTYpIHtcclxuICAgICAgICBjb25zdCBncmFkaWVudHM6IFZlYzNbXSA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8Y291bnQ7aSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHkgPSAxIC0gKDIqaSkvKGNvdW50LTEpO1xyXG4gICAgICAgICAgICBjb25zdCByID0gTWF0aC5zcXJ0KDEteSp5KTtcclxuICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBpICogTWF0aC5QSSAqICgzLU1hdGguc3FydCg1KSk7XHJcbiAgICAgICAgICAgIGdyYWRpZW50cy5wdXNoKG5ldyBWZWMzKFxyXG4gICAgICAgICAgICAgICAgTWF0aC5jb3MoYW5nbGUpICogcixcclxuICAgICAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgICAgICBNYXRoLnNpbihhbmdsZSkgKiByLFxyXG4gICAgICAgICAgICApKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGdyYWRpZW50cztcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRQZXJsaW4zRFZlY3RvckF0KHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHNlZWQ6IG51bWJlciwgZ3JhZGllbnRzOiBWZWMzW10pIDogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIGdyYWRpZW50c1tNYXRoLmZsb29yKHRoaXMucmFuZG9tQ29uc3RhbnQ0KHNlZWQsIHgsIHksIHopICogZ3JhZGllbnRzLmxlbmd0aCldITtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRQZXJsaW4zRFZhbHVlQXQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgc2VlZDogbnVtYmVyLCBncmFkaWVudHM6IFZlYzNbXSkgOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGdldFBlcmxpbjNEVmVjdG9yQXQgPSB0aGlzLmdldFBlcmxpbjNEVmVjdG9yQXQuYmluZCh0aGlzKTtcclxuICAgICAgICBjb25zdCBsZXJwID0gRU1hdGgubGVycDtcclxuICAgICAgICBjb25zdCBmYWRlID0gdGhpcy5mYWRlO1xyXG4gICAgICAgIGNvbnN0IGcwID0gbmV3IFZlYzMoeCwgeSwgeikubWFwU2VsZihNYXRoLmZsb29yKTtcclxuICAgICAgICBjb25zdCBnMSA9IG5ldyBWZWMzKGcwKS5hZGRTZWxmQygxLCAxLCAxKTtcclxuICAgICAgICBjb25zdCBmMCA9IG5ldyBWZWMzKHgsIHksIHopLnN1YlNlbGYoZzApO1xyXG4gICAgICAgIGNvbnN0IGYxID0gbmV3IFZlYzMoeCwgeSwgeikuc3ViU2VsZihnMSk7XHJcbiAgICAgICAgY29uc3QgY0FBQSA9IGdldFBlcmxpbjNEVmVjdG9yQXQoZzAueCwgZzAueSwgZzAueiwgc2VlZCwgZ3JhZGllbnRzKS5kb3QoZjApO1xyXG4gICAgICAgIGNvbnN0IGNBQUIgPSBnZXRQZXJsaW4zRFZlY3RvckF0KGcwLngsIGcwLnksIGcxLnosIHNlZWQsIGdyYWRpZW50cykuZG90QyhmMC54LCBmMC55LCBmMS56KTtcclxuICAgICAgICBjb25zdCBjQUJBID0gZ2V0UGVybGluM0RWZWN0b3JBdChnMC54LCBnMS55LCBnMC56LCBzZWVkLCBncmFkaWVudHMpLmRvdEMoZjAueCwgZjEueSwgZjAueik7XHJcbiAgICAgICAgY29uc3QgY0FCQiA9IGdldFBlcmxpbjNEVmVjdG9yQXQoZzAueCwgZzEueSwgZzEueiwgc2VlZCwgZ3JhZGllbnRzKS5kb3RDKGYwLngsIGYxLnksIGYxLnopO1xyXG4gICAgICAgIGNvbnN0IGNCQUEgPSBnZXRQZXJsaW4zRFZlY3RvckF0KGcxLngsIGcwLnksIGcwLnosIHNlZWQsIGdyYWRpZW50cykuZG90QyhmMS54LCBmMC55LCBmMC56KTtcclxuICAgICAgICBjb25zdCBjQkFCID0gZ2V0UGVybGluM0RWZWN0b3JBdChnMS54LCBnMC55LCBnMS56LCBzZWVkLCBncmFkaWVudHMpLmRvdEMoZjEueCwgZjAueSwgZjEueik7XHJcbiAgICAgICAgY29uc3QgY0JCQSA9IGdldFBlcmxpbjNEVmVjdG9yQXQoZzEueCwgZzEueSwgZzAueiwgc2VlZCwgZ3JhZGllbnRzKS5kb3RDKGYxLngsIGYxLnksIGYwLnopO1xyXG4gICAgICAgIGNvbnN0IGNCQkIgPSBnZXRQZXJsaW4zRFZlY3RvckF0KGcxLngsIGcxLnksIGcxLnosIHNlZWQsIGdyYWRpZW50cykuZG90KGYxKTtcclxuICAgICAgICBjb25zdCB0eCA9IGZhZGUoZjAueCk7XHJcbiAgICAgICAgY29uc3QgdHkgPSBmYWRlKGYwLnkpO1xyXG4gICAgICAgIGNvbnN0IHR6ID0gZmFkZShmMC56KTtcclxuICAgICAgICBjb25zdCBjQUEgPSBsZXJwKGNBQUEsIGNCQUEsIHR4KTtcclxuICAgICAgICBjb25zdCBjQUIgPSBsZXJwKGNBQUIsIGNCQUIsIHR4KTtcclxuICAgICAgICBjb25zdCBjQkEgPSBsZXJwKGNBQkEsIGNCQkEsIHR4KTtcclxuICAgICAgICBjb25zdCBjQkIgPSBsZXJwKGNBQkIsIGNCQkIsIHR4KTtcclxuICAgICAgICBjb25zdCBjQSA9IGxlcnAoY0FBLCBjQkEsIHR5KTtcclxuICAgICAgICBjb25zdCBjQiA9IGxlcnAoY0FCLCBjQkIsIHR5KTtcclxuICAgICAgICBjb25zdCBjID0gbGVycChjQSwgY0IsIHR6KTtcclxuICAgICAgICByZXR1cm4gRU1hdGguY2xhbXAoYyAqIDAuNSArIDAuNSwgMCwgMSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0V29ybGV5MkRQb3NpdGlvbkF0R3JpZCh4OiBudW1iZXIsIHk6IG51bWJlciwgc2VlZDogbnVtYmVyLCBvZmZzZXRBbXA6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHhvID0gKHRoaXMucmFuZG9tQ29uc3RhbnQzKHgsIHksIHNlZWQrMSkgLSAwLjUpICogb2Zmc2V0QW1wO1xyXG4gICAgICAgIGNvbnN0IHlvID0gKHRoaXMucmFuZG9tQ29uc3RhbnQzKHgsIHksIHNlZWQrMikgLSAwLjUpICogb2Zmc2V0QW1wO1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih4ICsgeG8sIHkgKyB5byk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0V29ybGV5MkRWYWx1ZUF0R3JpZCh4OiBudW1iZXIsIHk6IG51bWJlciwgc2VlZDogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmFuZG9tQ29uc3RhbnQzKHgsIHksIHNlZWQpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldFdvcmxleTJEQXQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHNlZWQ6IG51bWJlciwgb2Zmc2V0QW1wOiBudW1iZXIsIHNlYXJjaD86IG51bWJlcikge1xyXG4gICAgICAgIHNlYXJjaCA9IHNlYXJjaCA/PyBNYXRoLmNlaWwob2Zmc2V0QW1wKSArIDE7XHJcbiAgICAgICAgY29uc3QgZ3ggPSBNYXRoLmZsb29yKHgpO1xyXG4gICAgICAgIGNvbnN0IGd5ID0gTWF0aC5mbG9vcih5KTtcclxuICAgICAgICBsZXQgbWluRGlzdCA9IEluZmluaXR5O1xyXG4gICAgICAgIGxldCBtaW5EaXN0MiA9IEluZmluaXR5O1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IDA7XHJcbiAgICAgICAgbGV0IHZhbHVlMiA9IDA7XHJcbiAgICAgICAgZm9yKGxldCBpeD1neC1zZWFyY2g7IGl4PD1neCtzZWFyY2g7IGl4KyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCBpeT1neS1zZWFyY2g7IGl5PD1neStzZWFyY2g7IGl5KyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwb2ludCA9IHRoaXMuZ2V0V29ybGV5MkRQb3NpdGlvbkF0R3JpZChpeCwgaXksIHNlZWQsIG9mZnNldEFtcCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGlzdCA9IHBvaW50LmRpc3RUb0MoeCwgeSk7XHJcbiAgICAgICAgICAgICAgICBpZihkaXN0IDwgbWluRGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbkRpc3QyID0gbWluRGlzdDtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTIgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBtaW5EaXN0ID0gZGlzdDtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuZ2V0V29ybGV5MkRWYWx1ZUF0R3JpZChpeCwgaXksIHNlZWQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKGRpc3QgPCBtaW5EaXN0Mikge1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbkRpc3QyID0gZGlzdDtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTIgPSB0aGlzLmdldFdvcmxleTJEVmFsdWVBdEdyaWQoaXgsIGl5LCBzZWVkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geyB2YWx1ZSwgdmFsdWUyLCBtaW5EaXN0LCBtaW5EaXN0MiB9O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldFdvcmxleTNEUG9zaXRpb25BdEdyaWQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgc2VlZDogbnVtYmVyLCBvZmZzZXRBbXA6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHhvID0gKHRoaXMucmFuZG9tQ29uc3RhbnQ0KHgsIHksIHosIHNlZWQrMSkgLSAwLjUpICogb2Zmc2V0QW1wO1xyXG4gICAgICAgIGNvbnN0IHlvID0gKHRoaXMucmFuZG9tQ29uc3RhbnQ0KHgsIHksIHosIHNlZWQrMikgLSAwLjUpICogb2Zmc2V0QW1wO1xyXG4gICAgICAgIGNvbnN0IHpvID0gKHRoaXMucmFuZG9tQ29uc3RhbnQ0KHgsIHksIHosIHNlZWQrMykgLSAwLjUpICogb2Zmc2V0QW1wO1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh4ICsgeG8sIHkgKyB5bywgeiArIHpvKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRXb3JsZXkzRFZhbHVlQXRHcmlkKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHNlZWQ6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJhbmRvbUNvbnN0YW50NCh4LCB5LCB6LCBzZWVkKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRXb3JsZXkzREF0KHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHNlZWQ6IG51bWJlciwgb2Zmc2V0QW1wOiBudW1iZXIsIHNlYXJjaD86IG51bWJlcikge1xyXG4gICAgICAgIHNlYXJjaCA9IHNlYXJjaCA/PyBNYXRoLmNlaWwob2Zmc2V0QW1wKSArIDE7XHJcbiAgICAgICAgY29uc3QgZ3ggPSBNYXRoLmZsb29yKHgpO1xyXG4gICAgICAgIGNvbnN0IGd5ID0gTWF0aC5mbG9vcih5KTtcclxuICAgICAgICBjb25zdCBneiA9IE1hdGguZmxvb3Ioeik7XHJcbiAgICAgICAgbGV0IG1pbkRpc3QgPSBJbmZpbml0eTtcclxuICAgICAgICBsZXQgbWluRGlzdDIgPSBJbmZpbml0eTtcclxuICAgICAgICBsZXQgdmFsdWUgPSAwO1xyXG4gICAgICAgIGxldCB2YWx1ZTIgPSAwO1xyXG4gICAgICAgIGZvcihsZXQgaXg9Z3gtc2VhcmNoOyBpeDw9Z3grc2VhcmNoOyBpeCsrKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaXk9Z3ktc2VhcmNoOyBpeTw9Z3krc2VhcmNoOyBpeSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGl6PWd6LXNlYXJjaDsgaXo8PWd6K3NlYXJjaDsgaXorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwb2ludCA9IHRoaXMuZ2V0V29ybGV5M0RQb3NpdGlvbkF0R3JpZChpeCwgaXksIGl6LCBzZWVkLCBvZmZzZXRBbXApO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkaXN0ID0gcG9pbnQuZGlzdFRvQyh4LCB5LCB6KTtcclxuICAgICAgICAgICAgICAgICAgICBpZihkaXN0IDwgbWluRGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5EaXN0MiA9IG1pbkRpc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlMiA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5EaXN0ID0gZGlzdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmdldFdvcmxleTNEVmFsdWVBdEdyaWQoaXgsIGl5LCBpeiwgc2VlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKGRpc3QgPCBtaW5EaXN0Mikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5EaXN0MiA9IGRpc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlMiA9IHRoaXMuZ2V0V29ybGV5M0RWYWx1ZUF0R3JpZChpeCwgaXksIGl6LCBzZWVkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHsgdmFsdWUsIHZhbHVlMiwgbWluRGlzdCwgbWluRGlzdDIgfTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIENBTUVSQSBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBDYW1lcmEzRCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbj86IFZlYzMsIGZvdlk/OiBudW1iZXIsIGFzcGVjdD86IG51bWJlciwgbmVhcj86IG51bWJlciwgZmFyPzogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uID8/IFZlYzMuemVybygpO1xyXG4gICAgICAgIHRoaXMuZm92WSA9IGZvdlkgPz8gOTUvMTgwKk1hdGguUEk7XHJcbiAgICAgICAgdGhpcy5hc3BlY3QgPSBhc3BlY3QgPz8gMTtcclxuICAgICAgICB0aGlzLm5lYXIgPSBuZWFyID8/IDAuMTtcclxuICAgICAgICB0aGlzLmZhciA9IGZhciA/PyAxMDAwMDtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uID0gVmVjMy56ZXJvKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZm92WSE6IG51bWJlcjtcclxuICAgIGdldCBmb3ZZKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3ZZO1xyXG4gICAgfVxyXG4gICAgc2V0IGZvdlkobjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fZm92WSA9IG47XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRQZXJzcGVjdGl2ZU1hdHJpeCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfYXNwZWN0ITogbnVtYmVyO1xyXG4gICAgZ2V0IGFzcGVjdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYXNwZWN0O1xyXG4gICAgfVxyXG4gICAgc2V0IGFzcGVjdChuOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9hc3BlY3QgPSBuO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkUGVyc3BlY3RpdmVNYXRyaXggPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX25lYXIhOiBudW1iZXI7XHJcbiAgICBnZXQgbmVhcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbmVhcjtcclxuICAgIH1cclxuICAgIHNldCBuZWFyKG46IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX25lYXIgPSBuO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkUGVyc3BlY3RpdmVNYXRyaXggPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2ZhciE6IG51bWJlcjtcclxuICAgIGdldCBmYXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZhcjtcclxuICAgIH1cclxuICAgIHNldCBmYXIobjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fZmFyID0gbjtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZFBlcnNwZWN0aXZlTWF0cml4ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9wb3NpdGlvbiE6IFZlYzM7XHJcbiAgICBnZXQgcG9zaXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uO1xyXG4gICAgfVxyXG4gICAgc2V0IHBvc2l0aW9uKHY6IFZlYzMpIHtcclxuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IHY7XHJcbiAgICAgICAgdi5vbk11dGF0ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRUcmFuc2xhdGlvbk1hdHJpeCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkVmlld01hdHJpeCA9IHRydWU7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2Lm11dGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3dvcmxkU2NhbGUgPSAxO1xyXG4gICAgZ2V0IHdvcmxkU2NhbGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dvcmxkU2NhbGU7XHJcbiAgICB9XHJcbiAgICBzZXQgd29ybGRTY2FsZShuOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl93b3JsZFNjYWxlID0gbjtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZFRyYW5zbGF0aW9uTWF0cml4ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZFZpZXdNYXRyaXggPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JvdGF0aW9uITogVmVjMztcclxuICAgIGdldCByb3RhdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcm90YXRpb247XHJcbiAgICB9XHJcbiAgICBzZXQgcm90YXRpb24odjogVmVjMykge1xyXG4gICAgICAgIHRoaXMuX3JvdGF0aW9uID0gdjtcclxuICAgICAgICB2Lm9uTXV0YXRlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZEZvcndhcmQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFJpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRVcCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkRm9yd2FyZEZsYXQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFJvdGF0aW9uTWF0cml4ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRWaWV3TWF0cml4ID0gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHYubXV0YXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZm9yd2FyZCA9IFZlYzMuemVybygpO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRGb3J3YXJkPzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBnZXQgZm9yd2FyZCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUZvcndhcmQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZm9yd2FyZDtcclxuICAgIH1cclxuICAgIHVwZGF0ZUZvcndhcmQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRGb3J3YXJkICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl9mb3J3YXJkID0gVmVjMy56QXhpcygpLm5lZ1NlbGYoKS5yb3RYWVpTZWxmKHRoaXMuX3JvdGF0aW9uKTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRGb3J3YXJkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JpZ2h0ID0gVmVjMy56ZXJvKCk7XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZFJpZ2h0PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBnZXQgcmlnaHQoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSaWdodCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yaWdodDtcclxuICAgIH1cclxuICAgIHVwZGF0ZVJpZ2h0KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkUmlnaHQgIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3JpZ2h0ID0gVmVjMy54QXhpcygpLnJvdFhZWlNlbGYodGhpcy5fcm90YXRpb24pO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFJpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3VwID0gVmVjMy56ZXJvKCk7XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZFVwPzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBnZXQgdXAoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVVcCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl91cDtcclxuICAgIH1cclxuICAgIHVwZGF0ZVVwKCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkVXAgIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3VwID0gVmVjMy55QXhpcygpLnJvdFhZWlNlbGYodGhpcy5fcm90YXRpb24pO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFVwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2ZvcndhcmRGbGF0ID0gVmVjMy56ZXJvKCk7XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZEZvcndhcmRGbGF0PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBnZXQgZm9yd2FyZEZsYXQoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVGb3J3YXJkRmxhdCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3J3YXJkRmxhdDtcclxuICAgIH1cclxuICAgIHVwZGF0ZUZvcndhcmRGbGF0KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkRm9yd2FyZEZsYXQgIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX2ZvcndhcmRGbGF0ID0gVmVjMy56QXhpcygpLm5lZ1NlbGYoKS5yb3RZU2VsZih0aGlzLl9yb3RhdGlvbi55KTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRGb3J3YXJkRmxhdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9wZXJzcGVjdGl2ZU1hdHJpeDogbnVtYmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkUGVyc3BlY3RpdmVNYXRyaXg/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBwZXJzcGVjdGl2ZU1hdHJpeE9ic2VydmVyID0gbmV3IFNpZ25hbCh7IG9uQ29ubmVjdDogY29ubiA9PiBjb25uLmZpcmUodGhpcy5wZXJzcGVjdGl2ZU1hdHJpeCkgfSk7XHJcbiAgICBnZXQgcGVyc3BlY3RpdmVNYXRyaXgoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVQZXJzcGVjdGl2ZU1hdHJpeCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wZXJzcGVjdGl2ZU1hdHJpeDtcclxuICAgIH1cclxuICAgIHVwZGF0ZVBlcnNwZWN0aXZlTWF0cml4KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkUGVyc3BlY3RpdmVNYXRyaXggIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3BlcnNwZWN0aXZlTWF0cml4ID0gTWF0NC5wZXJzcGVjdGl2ZSh0aGlzLl9mb3ZZLCB0aGlzLl9hc3BlY3QsIHRoaXMuX25lYXIsIHRoaXMuX2Zhcik7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkUGVyc3BlY3RpdmVNYXRyaXg7XHJcbiAgICAgICAgdGhpcy5wZXJzcGVjdGl2ZU1hdHJpeE9ic2VydmVyLmZpcmUodGhpcy5fcGVyc3BlY3RpdmVNYXRyaXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3RyYW5zbGF0aW9uTWF0cml4OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRUcmFuc2xhdGlvbk1hdHJpeD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIHRyYW5zbGF0aW9uTWF0cml4T2JzZXJ2ZXIgPSBuZXcgU2lnbmFsKHsgb25Db25uZWN0OiBjb25uID0+IGNvbm4uZmlyZSh0aGlzLnRyYW5zbGF0aW9uTWF0cml4KSB9KTtcclxuICAgIGdldCB0cmFuc2xhdGlvbk1hdHJpeCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRyYW5zbGF0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9uTWF0cml4O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlVHJhbnNsYXRpb25NYXRyaXgoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRUcmFuc2xhdGlvbk1hdHJpeCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fdHJhbnNsYXRpb25NYXRyaXggPSBNYXQ0LnRyYW5zbGF0ZSgtdGhpcy5fcG9zaXRpb24ueCAqIHRoaXMuX3dvcmxkU2NhbGUsIC10aGlzLl9wb3NpdGlvbi55ICogdGhpcy5fd29ybGRTY2FsZSwgLXRoaXMuX3Bvc2l0aW9uLnogKiB0aGlzLl93b3JsZFNjYWxlKTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRUcmFuc2xhdGlvbk1hdHJpeDtcclxuICAgICAgICB0aGlzLnRyYW5zbGF0aW9uTWF0cml4T2JzZXJ2ZXIuZmlyZSh0aGlzLl92aWV3TWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yb3RhdGlvbk1hdHJpeDogbnVtYmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkUm90YXRpb25NYXRyaXg/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyByb3RhdGlvbk1hdHJpeE9ic2VydmVyID0gbmV3IFNpZ25hbCh7IG9uQ29ubmVjdDogY29ubiA9PiBjb25uLmZpcmUodGhpcy5yb3RhdGlvbk1hdHJpeCkgfSk7XHJcbiAgICBnZXQgcm90YXRpb25NYXRyaXgoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSb3RhdGlvbk1hdHJpeCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yb3RhdGlvbk1hdHJpeDtcclxuICAgIH1cclxuICAgIHVwZGF0ZVJvdGF0aW9uTWF0cml4KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkUm90YXRpb25NYXRyaXggIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3JvdGF0aW9uTWF0cml4ID0gTWF0NC5tdWx0aXBseShcclxuICAgICAgICAgICAgTWF0NC5yb3RhdGVaKC10aGlzLl9yb3RhdGlvbi56KSxcclxuICAgICAgICAgICAgTWF0NC5tdWx0aXBseShcclxuICAgICAgICAgICAgICAgIE1hdDQucm90YXRlWCgtdGhpcy5fcm90YXRpb24ueCksXHJcbiAgICAgICAgICAgICAgICBNYXQ0LnJvdGF0ZVkoLXRoaXMuX3JvdGF0aW9uLnkpLFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgKTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRSb3RhdGlvbk1hdHJpeDtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uTWF0cml4T2JzZXJ2ZXIuZmlyZSh0aGlzLl92aWV3TWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF92aWV3TWF0cml4OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRWaWV3TWF0cml4PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgdmlld01hdHJpeE9ic2VydmVyID0gbmV3IFNpZ25hbCh7IG9uQ29ubmVjdDogY29ubiA9PiBjb25uLmZpcmUodGhpcy52aWV3TWF0cml4KSB9KTtcclxuICAgIGdldCB2aWV3TWF0cml4KCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlld01hdHJpeCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92aWV3TWF0cml4O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlVmlld01hdHJpeCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFZpZXdNYXRyaXggIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3ZpZXdNYXRyaXggPSBNYXQ0Lm11bHRpcGx5KHRoaXMucm90YXRpb25NYXRyaXgsIHRoaXMudHJhbnNsYXRpb25NYXRyaXgpO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFZpZXdNYXRyaXg7XHJcbiAgICAgICAgdGhpcy52aWV3TWF0cml4T2JzZXJ2ZXIuZmlyZSh0aGlzLl92aWV3TWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jb21iaW5lZE1hdHJpeDogbnVtYmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkQ29tYmluZWRNYXRyaXg/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBjb21iaW5lZE1hdHJpeE9ic2VydmVyID0gbmV3IFNpZ25hbCh7IG9uQ29ubmVjdDogY29ubiA9PiBjb25uLmZpcmUodGhpcy5jb21iaW5lZE1hdHJpeCkgfSk7XHJcbiAgICBnZXQgY29tYmluZWRNYXRyaXgoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb21iaW5lZE1hdHJpeCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb21iaW5lZE1hdHJpeDtcclxuICAgIH1cclxuICAgIHVwZGF0ZUNvbWJpbmVkTWF0cml4KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkQ29tYmluZWRNYXRyaXggIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX2NvbWJpbmVkTWF0cml4ID0gTWF0My5tdWx0aXBseSh0aGlzLnZpZXdNYXRyaXgsIHRoaXMucGVyc3BlY3RpdmVNYXRyaXgpO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZENvbWJpbmVkTWF0cml4O1xyXG4gICAgICAgIHRoaXMuY29tYmluZWRNYXRyaXhPYnNlcnZlci5maXJlKHRoaXMuX2NvbWJpbmVkTWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICBsb29rQXQocDogVmVjMykge1xyXG4gICAgICAgIGxldCBmID0gdGhpcy5wb3NpdGlvbi5sb29rKHApO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSBuZXcgVmVjMyhmLnBpdGNoKCksIGYueWF3KCksIDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2FtZXJhMkQge1xyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb24/OiBWZWMyLCBzY2FsZT86IFZlYzIpIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb24gPz8gVmVjMi56ZXJvKCk7XHJcbiAgICAgICAgdGhpcy5zY2FsZSA9IHNjYWxlID8/IFZlYzIuZmlsbCgxKTtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9wb3NpdGlvbiE6IFZlYzI7XHJcbiAgICBnZXQgcG9zaXRpb24oKSB7IHJldHVybiB0aGlzLl9wb3NpdGlvbjsgfVxyXG4gICAgc2V0IHBvc2l0aW9uKHZhbHVlOiBWZWMyKSB7XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9wb3NpdGlvbi5vbk11dGF0ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRUcmFuc2xhdGlvbk1hdHJpeCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkVmlld01hdHJpeCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uLm11dGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3NjYWxlITogVmVjMjtcclxuICAgIGdldCBzY2FsZSgpIHsgcmV0dXJuIHRoaXMuX3NjYWxlOyB9XHJcbiAgICBzZXQgc2NhbGUodmFsdWU6IFZlYzIpIHtcclxuICAgICAgICB0aGlzLl9zY2FsZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3NjYWxlLm9uTXV0YXRlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFNjYWxlTWF0cml4ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRWaWV3TWF0cml4ID0gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX3NjYWxlLm11dGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JvdGF0aW9uITogbnVtYmVyO1xyXG4gICAgZ2V0IHJvdGF0aW9uKCkgeyByZXR1cm4gdGhpcy5fcm90YXRpb247IH1cclxuICAgIHNldCByb3RhdGlvbih2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fcm90YXRpb24gPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZFJvdGF0aW9uTWF0cml4ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZFZpZXdNYXRyaXggPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkUmlnaHQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkVXAgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JpZ2h0ID0gVmVjMi56ZXJvKCk7XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZFJpZ2h0PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBnZXQgcmlnaHQoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSaWdodCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yaWdodDtcclxuICAgIH1cclxuICAgIHVwZGF0ZVJpZ2h0KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkUmlnaHQgIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3JpZ2h0ID0gVmVjMi54QXhpcygpLnJvdGF0ZVNlbGYodGhpcy5fcm90YXRpb24pO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFJpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3VwID0gVmVjMi56ZXJvKCk7XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZFVwPzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBnZXQgdXAoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVVcCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl91cDtcclxuICAgIH1cclxuICAgIHVwZGF0ZVVwKCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkVXAgIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3VwID0gVmVjMi55QXhpcygpLnJvdGF0ZVNlbGYodGhpcy5fcm90YXRpb24pO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFVwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3RyYW5zbGF0aW9uTWF0cml4OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRUcmFuc2xhdGlvbk1hdHJpeD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIHRyYW5zbGF0aW9uTWF0cml4T2JzZXJ2ZXIgPSBuZXcgU2lnbmFsKHsgb25Db25uZWN0OiBjb25uID0+IGNvbm4uZmlyZSh0aGlzLnRyYW5zbGF0aW9uTWF0cml4KSB9KTtcclxuICAgIGdldCB0cmFuc2xhdGlvbk1hdHJpeCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRyYW5zbGF0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9uTWF0cml4O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlVHJhbnNsYXRpb25NYXRyaXgoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRUcmFuc2xhdGlvbk1hdHJpeCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fdHJhbnNsYXRpb25NYXRyaXggPSBNYXQzLnRyYW5zbGF0ZSgtdGhpcy5wb3NpdGlvbi54LCAtdGhpcy5wb3NpdGlvbi55KTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRWaWV3TWF0cml4O1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRpb25NYXRyaXhPYnNlcnZlci5maXJlKHRoaXMuX3RyYW5zbGF0aW9uTWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yb3RhdGlvbk1hdHJpeDogbnVtYmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkUm90YXRpb25NYXRyaXg/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyByb3RhdGlvbk1hdHJpeE9ic2VydmVyID0gbmV3IFNpZ25hbCh7IG9uQ29ubmVjdDogY29ubiA9PiBjb25uLmZpcmUodGhpcy5yb3RhdGlvbk1hdHJpeCkgfSk7XHJcbiAgICBnZXQgcm90YXRpb25NYXRyaXgoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSb3RhdGlvbk1hdHJpeCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yb3RhdGlvbk1hdHJpeDtcclxuICAgIH1cclxuICAgIHVwZGF0ZVJvdGF0aW9uTWF0cml4KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkUm90YXRpb25NYXRyaXggIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3JvdGF0aW9uTWF0cml4ID0gTWF0My5yb3RhdGUodGhpcy5yb3RhdGlvbik7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkUm90YXRpb25NYXRyaXg7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbk1hdHJpeE9ic2VydmVyLmZpcmUodGhpcy5fcm90YXRpb25NYXRyaXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3NjYWxlTWF0cml4OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRTY2FsZU1hdHJpeD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIHNjYWxlTWF0cml4T2JzZXJ2ZXIgPSBuZXcgU2lnbmFsKHsgb25Db25uZWN0OiBjb25uID0+IGNvbm4uZmlyZSh0aGlzLnNjYWxlTWF0cml4KSB9KTtcclxuICAgIGdldCBzY2FsZU1hdHJpeCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNjYWxlTWF0cml4KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlTWF0cml4O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlU2NhbGVNYXRyaXgoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRTY2FsZU1hdHJpeCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fc2NhbGVNYXRyaXggPSBNYXQzLnNjYWxlKHRoaXMuc2NhbGUueCwgdGhpcy5zY2FsZS55KTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRTY2FsZU1hdHJpeDtcclxuICAgICAgICB0aGlzLnNjYWxlTWF0cml4T2JzZXJ2ZXIuZmlyZSh0aGlzLl9zY2FsZU1hdHJpeCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdmlld01hdHJpeDogbnVtYmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkVmlld01hdHJpeD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIHZpZXdNYXRyaXhPYnNlcnZlciA9IG5ldyBTaWduYWwoeyBvbkNvbm5lY3Q6IGNvbm4gPT4gY29ubi5maXJlKHRoaXMudmlld01hdHJpeCkgfSk7XHJcbiAgICBnZXQgdmlld01hdHJpeCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpZXdNYXRyaXgoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmlld01hdHJpeDtcclxuICAgIH1cclxuICAgIHVwZGF0ZVZpZXdNYXRyaXgoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRWaWV3TWF0cml4ICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl92aWV3TWF0cml4ID0gTWF0My5tdWx0aXBseSh0aGlzLnNjYWxlTWF0cml4LCBNYXQzLm11bHRpcGx5KHRoaXMudHJhbnNsYXRpb25NYXRyaXgsIHRoaXMucm90YXRpb25NYXRyaXgpKTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRWaWV3TWF0cml4O1xyXG4gICAgICAgIHRoaXMudmlld01hdHJpeE9ic2VydmVyLmZpcmUodGhpcy5fdmlld01hdHJpeCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgTUVTSCBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgY2xhc3MgVHJpTWVzaDNEIHtcclxuICAgIHBvc2l0aW9uczogbnVtYmVyW10gPSBbXTtcclxuICAgIHRleGNvb3JkczogbnVtYmVyW10gPSBbXTtcclxuICAgIG5vcm1hbHM6IG51bWJlcltdID0gW107XHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG5cclxuICAgIGNsb25lKCk6IFRyaU1lc2gzRCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUcmlNZXNoM0QoKS5hcHBlbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNsYXRlU2VsZih2OiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlU2VsZkModi54LCB2LnksIHYueik7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNsYXRlU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mykge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpXSEgKz0geDtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsxXSEgKz0geTtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsyXSEgKz0gejtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2NhbGVTZWxmKHY6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zY2FsZVNlbGZDKHYueCwgdi55LCB2LnopO1xyXG4gICAgfVxyXG5cclxuICAgIHNjYWxlU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mykge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpXSEgKj0geDtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsxXSEgKj0geTtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsyXSEgKj0gejtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRlU2VsZih2OiBWZWMzKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90YXRlU2VsZkModi54LCB2LnksIHYueik7XHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRlU2VsZkMoYXg6IG51bWJlciwgYXk6IG51bWJlciwgYXo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mykge1xyXG4gICAgICAgICAgICBsZXQgcCA9IG5ldyBWZWMzKHRoaXMucG9zaXRpb25zW2ldISwgdGhpcy5wb3NpdGlvbnNbaSsxXSEsIHRoaXMucG9zaXRpb25zW2krMl0hKTtcclxuICAgICAgICAgICAgcC5yb3RYWVpTZWxmQyhheCwgYXksIGF6KTtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaV0gPSBwLng7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMV0gPSBwLnk7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMl0gPSBwLno7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMubm9ybWFscy5sZW5ndGg7IGkrPTMpIHtcclxuICAgICAgICAgICAgbGV0IHAgPSBuZXcgVmVjMyh0aGlzLm5vcm1hbHNbaV0hLCB0aGlzLm5vcm1hbHNbaSsxXSEsIHRoaXMubm9ybWFsc1tpKzJdISk7XHJcbiAgICAgICAgICAgIHAucm90WFlaU2VsZkMoYXgsIGF5LCBheik7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFsc1tpXSA9IHAueDtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzW2krMV0gPSBwLnk7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFsc1tpKzJdID0gcC56O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICByb3RhdGVBcm91bmRTZWxmKG9yaWdpbjogVmVjMywgdjogVmVjMykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvdGF0ZUFyb3VuZFNlbGZDKG9yaWdpbi54LCBvcmlnaW4ueSwgb3JpZ2luLnosIHYueCwgdi55LCB2LnopO1xyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0ZUFyb3VuZFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIGF4OiBudW1iZXIsIGF5OiBudW1iZXIsIGF6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGVTZWxmQygteCwgLXksIC16KS5yb3RhdGVTZWxmQyhheCwgYXksIGF6KS50cmFuc2xhdGVTZWxmQyh4LCB5LCB6KTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBlbmQoLi4ubWVzaGVzOiBUcmlNZXNoM0RbXSk6IHRoaXMge1xyXG4gICAgICAgIGZvcihjb25zdCBtZXNoIG9mIG1lc2hlcykge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKC4uLm1lc2gucG9zaXRpb25zKTtcclxuICAgICAgICAgICAgdGhpcy50ZXhjb29yZHMucHVzaCguLi5tZXNoLnRleGNvb3Jkcyk7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFscy5wdXNoKC4uLm1lc2gubm9ybWFscyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgZ2V0TGluZXMocG9zaXRpb25zOiBudW1iZXJbXSk6IG51bWJlcltdIHtcclxuICAgICAgICBsZXQgZWRnZXM6IG51bWJlcltdID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8cG9zaXRpb25zLmxlbmd0aDsgaSs9OSkge1xyXG4gICAgICAgICAgICBlZGdlcy5wdXNoKHBvc2l0aW9uc1tpXSEsIHBvc2l0aW9uc1tpKzFdISwgcG9zaXRpb25zW2krMl0hLCBwb3NpdGlvbnNbaSszXSEsIHBvc2l0aW9uc1tpKzRdISwgcG9zaXRpb25zW2krNV0hKTtcclxuICAgICAgICAgICAgZWRnZXMucHVzaChwb3NpdGlvbnNbaSszXSEsIHBvc2l0aW9uc1tpKzRdISwgcG9zaXRpb25zW2krNV0hLCBwb3NpdGlvbnNbaSs2XSEsIHBvc2l0aW9uc1tpKzddISwgcG9zaXRpb25zW2krOF0hKTtcclxuICAgICAgICAgICAgZWRnZXMucHVzaChwb3NpdGlvbnNbaSs2XSEsIHBvc2l0aW9uc1tpKzddISwgcG9zaXRpb25zW2krOF0hLCBwb3NpdGlvbnNbaV0hLCBwb3NpdGlvbnNbaSsxXSEsIHBvc2l0aW9uc1tpKzJdISk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlZGdlcztcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0UXVhZExpbmVzKHBvc2l0aW9uczogbnVtYmVyW10pOiBudW1iZXJbXSB7XHJcbiAgICAgICAgbGV0IGVkZ2VzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHBvc2l0aW9ucy5sZW5ndGg7IGkrPTE4KSB7XHJcbiAgICAgICAgICAgIGVkZ2VzLnB1c2gocG9zaXRpb25zW2ldISwgcG9zaXRpb25zW2krMV0hLCBwb3NpdGlvbnNbaSsyXSEsIHBvc2l0aW9uc1tpKzNdISwgcG9zaXRpb25zW2krNF0hLCBwb3NpdGlvbnNbaSs1XSEpO1xyXG4gICAgICAgICAgICBlZGdlcy5wdXNoKHBvc2l0aW9uc1tpKzNdISwgcG9zaXRpb25zW2krNF0hLCBwb3NpdGlvbnNbaSs1XSEsIHBvc2l0aW9uc1tpKzZdISwgcG9zaXRpb25zW2krN10hLCBwb3NpdGlvbnNbaSs4XSEpO1xyXG4gICAgICAgICAgICBlZGdlcy5wdXNoKHBvc2l0aW9uc1tpKzZdISwgcG9zaXRpb25zW2krN10hLCBwb3NpdGlvbnNbaSs4XSEsIHBvc2l0aW9uc1tpKzldISwgcG9zaXRpb25zW2krMTBdISwgcG9zaXRpb25zW2krMTFdISk7XHJcbiAgICAgICAgICAgIGVkZ2VzLnB1c2gocG9zaXRpb25zW2krOV0hLCBwb3NpdGlvbnNbaSsxMF0hLCBwb3NpdGlvbnNbaSsxMV0hLCBwb3NpdGlvbnNbaSsxMl0hLCBwb3NpdGlvbnNbaSsxM10hLCBwb3NpdGlvbnNbaSsxNF0hKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVkZ2VzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHJpTWVzaDJEIHtcclxuICAgIHBvc2l0aW9uczogbnVtYmVyW10gPSBbXTtcclxuICAgIHRleGNvb3JkczogbnVtYmVyW10gPSBbXTtcclxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICBcclxuICAgIGNsb25lKCk6IFRyaU1lc2gyRCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUcmlNZXNoMkQoKS5hcHBlbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNsYXRlU2VsZih2OiBWZWMyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlU2VsZkModi54LCB2LnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zbGF0ZVNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5wb3NpdGlvbnMubGVuZ3RoOyBpKz0yKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2ldISArPSB4O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzFdISArPSB5O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzY2FsZVNlbGYodjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNjYWxlU2VsZkModi54LCB2LnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHNjYWxlU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTIpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaV0hICo9IHg7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMV0hICo9IHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0ZVNlbGYoYTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5wb3NpdGlvbnMubGVuZ3RoOyBpKz0yKSB7XHJcbiAgICAgICAgICAgIGxldCBwID0gbmV3IFZlYzIodGhpcy5wb3NpdGlvbnNbaV0hLCB0aGlzLnBvc2l0aW9uc1tpKzFdISk7XHJcbiAgICAgICAgICAgIHAucm90YXRlU2VsZihhKTtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaV0gPSBwLng7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMV0gPSBwLnk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0ZUFyb3VuZFNlbGYob3JpZ2luOiBWZWMyLCBhOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3RhdGVBcm91bmRTZWxmQyhvcmlnaW4ueCwgb3JpZ2luLnksIGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0ZUFyb3VuZFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCBhOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGVTZWxmQygteCwgLXkpLnJvdGF0ZVNlbGYoYSkudHJhbnNsYXRlU2VsZkMoeCwgeSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwZW5kKC4uLm1lc2hlczogVHJpTWVzaDJEW10pOiB0aGlzIHtcclxuICAgICAgICBmb3IoY29uc3QgbWVzaCBvZiBtZXNoZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnMucHVzaCguLi5tZXNoLnBvc2l0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMudGV4Y29vcmRzLnB1c2goLi4ubWVzaC50ZXhjb29yZHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFBvbHlnb24yRCB7XHJcbiAgICBwb3NpdGlvbnM6IG51bWJlcltdID0gW107XHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG5cclxuICAgIHN0YXRpYyBjcmVhdGVQb3NpdGlvbnMocG9zaXRpb25zOiBudW1iZXJbXSk6IFBvbHlnb24yRCB7XHJcbiAgICAgICAgY29uc3QgcG9seSA9IG5ldyBQb2x5Z29uMkQoKTtcclxuICAgICAgICBwb2x5LnBvc2l0aW9ucyA9IHBvc2l0aW9ucztcclxuICAgICAgICByZXR1cm4gcG9seTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmVjdCh4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIpOiBQb2x5Z29uMkQge1xyXG4gICAgICAgIGNvbnN0IHgwID0geCAtIHcvMjtcclxuICAgICAgICBjb25zdCB4MSA9IHggKyB3LzI7XHJcbiAgICAgICAgY29uc3QgeTAgPSB5IC0gaC8yO1xyXG4gICAgICAgIGNvbnN0IHkxID0geSArIGgvMjtcclxuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVQb3NpdGlvbnMoW3gwLHkwLCB4MSx5MCwgeDEseTEsIHgwLHkxXSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNpcmNsZSh4OiBudW1iZXIsIHk6IG51bWJlciwgcjogbnVtYmVyLCBhcmM6IG51bWJlciA9IE1hdGguUEkgKiAyLCBzdGVwID0gTWF0aC5QSSAvIDgpOiBQb2x5Z29uMkQge1xyXG4gICAgICAgIGFyYyA9IEVNYXRoLmNsYW1wKGFyYywgMCwgTWF0aC5QSSAqIDIpO1xyXG4gICAgICAgIGxldCBwb3NpdGlvbnM6IG51bWJlcltdID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8YXJjOyBpKz1zdGVwKSB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9ucy5wdXNoKE1hdGguY29zKGkpICogciArIHgsIE1hdGguc2luKGkpICogciArIHkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwb3NpdGlvbnMucHVzaChNYXRoLmNvcyhhcmMpICogciArIHgsIE1hdGguc2luKGFyYykgKiByICsgeSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlUG9zaXRpb25zKHBvc2l0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNpcmNsZUZhbih4OiBudW1iZXIsIHk6IG51bWJlciwgcjogbnVtYmVyLCBhcmM6IG51bWJlciA9IE1hdGguUEkgKiAyLCBzdGVwID0gTWF0aC5QSSAvIDgpOiBQb2x5Z29uMkQge1xyXG4gICAgICAgIGNvbnN0IHBvbHkgPSB0aGlzLmNpcmNsZSh4LCB5LCByLCBhcmMsIHN0ZXApO1xyXG4gICAgICAgIHBvbHkucG9zaXRpb25zLnNwbGljZSgwLCAwLCB4LCB5KTtcclxuICAgICAgICByZXR1cm4gcG9seTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2xhdGVTZWxmKHY6IFZlYzIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGVTZWxmQyh2LngsIHYueSk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNsYXRlU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTIpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaV0hICs9IHg7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMV0hICs9IHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNjYWxlU2VsZih2OiBWZWMyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbGVTZWxmQyh2LngsIHYueSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2NhbGVTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mikge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpXSEgKj0geDtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsxXSEgKj0geTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRlU2VsZihhOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTMpIHtcclxuICAgICAgICAgICAgbGV0IHAgPSBuZXcgVmVjMih0aGlzLnBvc2l0aW9uc1tpXSEsIHRoaXMucG9zaXRpb25zW2krMV0hKTtcclxuICAgICAgICAgICAgcC5yb3RhdGVTZWxmKGEpO1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpXSA9IHAueDtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsxXSA9IHAueTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRlQXJvdW5kU2VsZihvcmlnaW46IFZlYzIsIGE6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvdGF0ZUFyb3VuZFNlbGZDKG9yaWdpbi54LCBvcmlnaW4ueSwgYSk7XHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRlQXJvdW5kU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIGE6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZVNlbGZDKC14LCAteSkucm90YXRlU2VsZihhKTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3UGF0aChjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgc3ggPSAxLCBzeSA9IDEpIHtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5wb3NpdGlvbnMubGVuZ3RoOyBpKz0yKSB7XHJcbiAgICAgICAgICAgIGlmKGkgPT0gMCkgY3R4Lm1vdmVUbyh0aGlzLnBvc2l0aW9uc1tpXSEgKiBzeCwgdGhpcy5wb3NpdGlvbnNbaSsxXSEgKiBzeSk7XHJcbiAgICAgICAgICAgIGVsc2UgY3R4LmxpbmVUbyh0aGlzLnBvc2l0aW9uc1tpXSEgKiBzeCwgdGhpcy5wb3NpdGlvbnNbaSsxXSEgKiBzeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0VmVydGV4KGluZGV4OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICBjb25zdCBqID0gRU1hdGgucG1vZChpbmRleCwgTWF0aC5mbG9vcih0aGlzLnBvc2l0aW9ucy5sZW5ndGgvMikpKjI7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMucG9zaXRpb25zW2pdISwgdGhpcy5wb3NpdGlvbnNbaisxXSEpO1xyXG4gICAgfVxyXG5cclxuICAgIGJldmVsU2VsZihpbmRpY2VzOiBTZXQ8bnVtYmVyPiB8IG51bWJlcltdLCBhbW91bnQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGlmKCEoaW5kaWNlcyBpbnN0YW5jZW9mIFNldCkpXHJcbiAgICAgICAgICAgIGluZGljZXMgPSBuZXcgU2V0KGluZGljZXMpO1xyXG4gICAgICAgIGxldCBuZXdQb3NpdGlvbnM6IG51bWJlcltdID0gW107XHJcbiAgICAgICAgbGV0IGxlbiA9IE1hdGguZmxvb3IodGhpcy5wb3NpdGlvbnMubGVuZ3RoLzIpO1xyXG4gICAgICAgIGZvcihsZXQgaW5kZXg9MDsgaW5kZXg8bGVuOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgIGlmKCFpbmRpY2VzLmhhcyhpbmRleCkpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgbGV0IHZBID0gdGhpcy5nZXRWZXJ0ZXgoaW5kZXgtMSk7XHJcbiAgICAgICAgICAgIGxldCB2QiA9IHRoaXMuZ2V0VmVydGV4KGluZGV4KTtcclxuICAgICAgICAgICAgbGV0IHZDID0gdGhpcy5nZXRWZXJ0ZXgoaW5kZXgrMSk7XHJcbiAgICAgICAgICAgIGxldCB0TWF4QSA9IHZBLmRpc3RUbyh2Qik7XHJcbiAgICAgICAgICAgIGxldCB0TWF4QyA9IHZDLmRpc3RUbyh2Qik7XHJcbiAgICAgICAgICAgIGlmKGluZGljZXMuaGFzKGluZGV4LTEpKSB0TWF4QSAvPSAyO1xyXG4gICAgICAgICAgICBpZihpbmRpY2VzLmhhcyhpbmRleCsxKSkgdE1heEMgLz0gMjtcclxuICAgICAgICAgICAgbGV0IGIxID0gdkIuYWRkU2NhbGVkKHZCLmxvb2sodkEpLCBFTWF0aC5jbGFtcChhbW91bnQsIDAsIHRNYXhBKSk7XHJcbiAgICAgICAgICAgIGxldCBiMiA9IHZCLmFkZFNjYWxlZCh2Qi5sb29rKHZDKSwgRU1hdGguY2xhbXAoYW1vdW50LCAwLCB0TWF4QykpO1xyXG4gICAgICAgICAgICBuZXdQb3NpdGlvbnMucHVzaChiMS54LCBiMS55LCBiMi54LCBiMi55KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbnMgPSBuZXdQb3NpdGlvbnM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgYmV2ZWxBbGxTZWxmKGFtb3VudDogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IG5ld1Bvc2l0aW9uczogbnVtYmVyW10gPSBbXTtcclxuICAgICAgICBsZXQgbGVuID0gTWF0aC5mbG9vcih0aGlzLnBvc2l0aW9ucy5sZW5ndGgvMik7XHJcbiAgICAgICAgZm9yKGxldCBpbmRleD0wOyBpbmRleDxsZW47IGluZGV4KyspIHtcclxuICAgICAgICAgICAgbGV0IHZBID0gdGhpcy5nZXRWZXJ0ZXgoaW5kZXgtMSk7XHJcbiAgICAgICAgICAgIGxldCB2QiA9IHRoaXMuZ2V0VmVydGV4KGluZGV4KTtcclxuICAgICAgICAgICAgbGV0IHZDID0gdGhpcy5nZXRWZXJ0ZXgoaW5kZXgrMSk7XHJcbiAgICAgICAgICAgIGxldCB0TWF4QSA9IHZBLmRpc3RUbyh2QikgLyAyO1xyXG4gICAgICAgICAgICBsZXQgdE1heEMgPSB2Qy5kaXN0VG8odkIpIC8gMjtcclxuICAgICAgICAgICAgbGV0IGIxID0gdkIuYWRkU2NhbGVkKHZCLmxvb2sodkEpLCBFTWF0aC5jbGFtcChhbW91bnQsIDAsIHRNYXhBKSk7XHJcbiAgICAgICAgICAgIGxldCBiMiA9IHZCLmFkZFNjYWxlZCh2Qi5sb29rKHZDKSwgRU1hdGguY2xhbXAoYW1vdW50LCAwLCB0TWF4QykpO1xyXG4gICAgICAgICAgICBuZXdQb3NpdGlvbnMucHVzaChiMS54LCBiMS55LCBiMi54LCBiMi55KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbnMgPSBuZXdQb3NpdGlvbnM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgUEhZU0lDUyBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgdHlwZSBTaGFwZTJEQ29sbGlzaW9uID0ge1xyXG4gICAgaW5zaWRlOiBib29sZWFuLFxyXG4gICAgY29sbGlzaW9uOiBWZWMyLFxyXG4gICAgZGlzdGFuY2U6IG51bWJlcixcclxuICAgIG5vcm1hbDogVmVjMixcclxufTtcclxuXHJcbmV4cG9ydCBjbGFzcyBQb2ludDJEIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwb3NpdGlvbjogVmVjMikge1xyXG5cclxuICAgIH1cclxuICAgIGlzSW5zaWRlUmVjdChyZWN0OiBSZWN0MkQpIHtcclxuICAgICAgICBsZXQgZGlmZiA9IHRoaXMucG9zaXRpb24uc3ViKHJlY3QucG9zaXRpb24pO1xyXG4gICAgICAgIGxldCBkeCA9IGRpZmYuZG90KHJlY3QucmlnaHQpO1xyXG4gICAgICAgIGxldCBkeSA9IGRpZmYuZG90KHJlY3QudXApO1xyXG4gICAgICAgIHJldHVybiAoTWF0aC5hYnMoZHgpIDw9IHJlY3Quc2l6ZS54ICYmIE1hdGguYWJzKGR5KSA8PSByZWN0LnNpemUueSk7XHJcbiAgICB9XHJcbiAgICBnZXRSZWN0Q29sbGlzaW9uKHJlY3Q6IFJlY3QyRCk6IFNoYXBlMkRDb2xsaXNpb24ge1xyXG4gICAgICAgIGxldCBkaWZmID0gdGhpcy5wb3NpdGlvbi5zdWIocmVjdC5wb3NpdGlvbik7XHJcbiAgICAgICAgbGV0IGR4ID0gZGlmZi5kb3QocmVjdC5yaWdodCk7XHJcbiAgICAgICAgbGV0IGR5ID0gZGlmZi5kb3QocmVjdC51cCk7XHJcbiAgICAgICAgbGV0IGlzSW5zaWRlID0gKE1hdGguYWJzKGR4KSA8IHJlY3Quc2l6ZS54ICYmIE1hdGguYWJzKGR5KSA8IHJlY3Quc2l6ZS55KTtcclxuICAgICAgICBpZihpc0luc2lkZSkge1xyXG4gICAgICAgICAgICBsZXQgZDEgPSBNYXRoLmFicyh0aGlzLnBvc2l0aW9uLnN1YihyZWN0LnBvc2l0aW9uLmFkZFNjYWxlZChyZWN0LnVwLCByZWN0LnNpemUueSkpLmRvdChyZWN0LnVwKSk7XHJcbiAgICAgICAgICAgIGxldCBkMiA9IE1hdGguYWJzKHRoaXMucG9zaXRpb24uc3ViKHJlY3QucG9zaXRpb24uYWRkU2NhbGVkKHJlY3QudXAsIC1yZWN0LnNpemUueSkpLmRvdChyZWN0LnVwKSk7XHJcbiAgICAgICAgICAgIGxldCBkMyA9IE1hdGguYWJzKHRoaXMucG9zaXRpb24uc3ViKHJlY3QucG9zaXRpb24uYWRkU2NhbGVkKHJlY3QucmlnaHQsIHJlY3Quc2l6ZS54KSkuZG90KHJlY3QucmlnaHQpKTtcclxuICAgICAgICAgICAgbGV0IGQ0ID0gTWF0aC5hYnModGhpcy5wb3NpdGlvbi5zdWIocmVjdC5wb3NpdGlvbi5hZGRTY2FsZWQocmVjdC5yaWdodCwgLXJlY3Quc2l6ZS54KSkuZG90KHJlY3QucmlnaHQpKTtcclxuICAgICAgICAgICAgbGV0IG1pbkluZGV4ID0gMDtcclxuICAgICAgICAgICAgbGV0IG1pbkRpc3QgPSBkMTtcclxuICAgICAgICAgICAgaWYoZDIgPCBtaW5EaXN0KSB7IG1pbkRpc3QgPSBkMjsgbWluSW5kZXggPSAxOyB9XHJcbiAgICAgICAgICAgIGlmKGQzIDwgbWluRGlzdCkgeyBtaW5EaXN0ID0gZDM7IG1pbkluZGV4ID0gMjsgfVxyXG4gICAgICAgICAgICBpZihkNCA8IG1pbkRpc3QpIHsgbWluRGlzdCA9IGQ0OyBtaW5JbmRleCA9IDM7IH1cclxuICAgICAgICAgICAgbGV0IGVkZ2U6IFZlYzI7XHJcbiAgICAgICAgICAgIGxldCBub3JtYWw6IFZlYzI7XHJcbiAgICAgICAgICAgIHN3aXRjaChtaW5JbmRleCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2UgPSByZWN0LnBvc2l0aW9uLmFkZFNjYWxlZChyZWN0LnJpZ2h0LCBkeCkuYWRkU2NhbGVkKHJlY3QudXAsIHJlY3Quc2l6ZS55KTtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWwgPSByZWN0LnVwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2UgPSByZWN0LnBvc2l0aW9uLmFkZFNjYWxlZChyZWN0LnJpZ2h0LCBkeCkuYWRkU2NhbGVkKHJlY3QudXAsIC1yZWN0LnNpemUueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsID0gcmVjdC51cC5uZWcoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICBlZGdlID0gcmVjdC5wb3NpdGlvbi5hZGRTY2FsZWQocmVjdC51cCwgZHkpLmFkZFNjYWxlZChyZWN0LnJpZ2h0LCByZWN0LnNpemUueCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsID0gcmVjdC5yaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICBlZGdlID0gcmVjdC5wb3NpdGlvbi5hZGRTY2FsZWQocmVjdC51cCwgZHkpLmFkZFNjYWxlZChyZWN0LnJpZ2h0LCAtcmVjdC5zaXplLngpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbCA9IHJlY3QucmlnaHQubmVnKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGluc2lkZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbGxpc2lvbjogZWRnZSEsXHJcbiAgICAgICAgICAgICAgICBkaXN0YW5jZTogLWVkZ2UhLmRpc3RUbyh0aGlzLnBvc2l0aW9uKSxcclxuICAgICAgICAgICAgICAgIG5vcm1hbDogbm9ybWFsISxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGR4ID0gRU1hdGguY2xhbXAoZHgsIC1yZWN0LnNpemUueCwgcmVjdC5zaXplLngpO1xyXG4gICAgICAgICAgICBkeSA9IEVNYXRoLmNsYW1wKGR5LCAtcmVjdC5zaXplLnksIHJlY3Quc2l6ZS55KTtcclxuICAgICAgICAgICAgbGV0IGVkZ2UgPSByZWN0LnBvc2l0aW9uLmFkZFNjYWxlZChyZWN0LnJpZ2h0LCBkeCkuYWRkU2NhbGVkKHJlY3QudXAsIGR5KTtcclxuICAgICAgICAgICAgbGV0IGRpc3QgPSBlZGdlLmRpc3RUbyh0aGlzLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGluc2lkZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjb2xsaXNpb246IGVkZ2UsXHJcbiAgICAgICAgICAgICAgICBkaXN0YW5jZTogZGlzdCxcclxuICAgICAgICAgICAgICAgIG5vcm1hbDogZWRnZS5sb29rKHRoaXMucG9zaXRpb24pLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGRpc3RUb0NpcmNsZShjaXJjbGU6IENpcmNsZTJEKSB7XHJcbiAgICAgICAgbGV0IGRpc3QgPSB0aGlzLnBvc2l0aW9uLmRpc3RUbyhjaXJjbGUucG9zaXRpb24pO1xyXG4gICAgICAgIHJldHVybiBkaXN0IC0gY2lyY2xlLnJhZGl1cztcclxuICAgIH1cclxuICAgIGlzSW5zaWRlQ2lyY2xlKGNpcmNsZTogQ2lyY2xlMkQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kaXN0VG9DaXJjbGUoY2lyY2xlKSA8PSAwO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmF5MkQge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG9yaWdpbjogVmVjMiwgcHVibGljIGRpcmVjdGlvbjogVmVjMikge1xyXG5cclxuICAgIH1cclxuICAgIHJheWNhc3RHcmlkPFQ+KFxyXG4gICAgICAgIHByZWRpY2F0ZTogKHBvczpWZWMyLCBub3JtYWw6VmVjMiwgZGlzdDpudW1iZXIpID0+IFQgfCB1bmRlZmluZWQsXHJcbiAgICAgICAgbWF4SXRlcmF0aW9ucyA9IDEwMDBcclxuICAgICk6IFQgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGNvbnN0IGludkRpckFicyA9IHRoaXMuZGlyZWN0aW9uLnJkaXZGKDEpLm1hcCh4ID0+IE1hdGguYWJzKHgpKTtcclxuICAgICAgICBjb25zdCBzaWduID0gdGhpcy5kaXJlY3Rpb24ubWFwKHggPT4geCA+IDAgPyAxIDogMCk7XHJcbiAgICAgICAgY29uc3Qgc3RlcCA9IHRoaXMuZGlyZWN0aW9uLm1hcCh4ID0+IHggPiAwID8gMSA6IC0xKTtcclxuICAgICAgICBsZXQgdE1heFggPSBpbnZEaXJBYnMueCAqIChzaWduLng9PT0wID8gKHRoaXMub3JpZ2luLnggLSBNYXRoLmZsb29yKHRoaXMub3JpZ2luLngpKSA6IChNYXRoLmZsb29yKHRoaXMub3JpZ2luLngpICsgMSAtIHRoaXMub3JpZ2luLngpKTtcclxuICAgICAgICBsZXQgdE1heFkgPSBpbnZEaXJBYnMueSAqIChzaWduLnk9PT0wID8gKHRoaXMub3JpZ2luLnkgLSBNYXRoLmZsb29yKHRoaXMub3JpZ2luLnkpKSA6IChNYXRoLmZsb29yKHRoaXMub3JpZ2luLnkpICsgMSAtIHRoaXMub3JpZ2luLnkpKTtcclxuICAgICAgICBsZXQgcG9zID0gbmV3IFZlYzIodGhpcy5vcmlnaW4pLm1hcFNlbGYoeCA9PiBNYXRoLmZsb29yKHgpKTtcclxuICAgICAgICBsZXQgZGlzdGFuY2UgPSAwO1xyXG4gICAgICAgIGxldCBub3JtYWwgPSBWZWMyLnplcm8oKTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxtYXhJdGVyYXRpb25zOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHJlcyA9IHByZWRpY2F0ZShwb3MsIG5vcm1hbCwgZGlzdGFuY2UpO1xyXG4gICAgICAgICAgICBpZihyZXMgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgICAgIGlmKHRNYXhYIDwgdE1heFkpIHtcclxuICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gdE1heFg7XHJcbiAgICAgICAgICAgICAgICBub3JtYWwuc2V0Qygtc3RlcC54LCAwKTtcclxuICAgICAgICAgICAgICAgIHRNYXhYICs9IGludkRpckFicy54O1xyXG4gICAgICAgICAgICAgICAgcG9zLnggKz0gc3RlcC54O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSB0TWF4WTtcclxuICAgICAgICAgICAgICAgIG5vcm1hbC5zZXRDKDAsIC1zdGVwLnkpO1xyXG4gICAgICAgICAgICAgICAgdE1heFkgKz0gaW52RGlyQWJzLnk7XHJcbiAgICAgICAgICAgICAgICBwb3MueSArPSBzdGVwLnk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNlZ21lbnQyRCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhcnQ6IFZlYzIsIHB1YmxpYyBlbmQ6IFZlYzIpIHtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBSZWN0MkQge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHBvc2l0aW9uOiBWZWMyLCBzaXplOiBWZWMyLCByb3RhdGlvbjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uID0gcm90YXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2l6ZSE6IFZlYzI7XHJcbiAgICBnZXQgc2l6ZSgpIHsgcmV0dXJuIHRoaXMuX3NpemU7IH1cclxuICAgIHNldCBzaXplKHZhbHVlOiBWZWMyKSB7XHJcbiAgICAgICAgdGhpcy5fc2l6ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JvdGF0aW9uITogbnVtYmVyXHJcbiAgICBnZXQgcm90YXRpb24oKSB7IHJldHVybiB0aGlzLl9yb3RhdGlvbjsgfVxyXG4gICAgc2V0IHJvdGF0aW9uKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9yb3RhdGlvbiA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JpZ2h0ID0gVmVjMi56ZXJvKCk7XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZFJpZ2h0PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBnZXQgcmlnaHQoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSaWdodCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yaWdodDtcclxuICAgIH1cclxuICAgIHVwZGF0ZVJpZ2h0KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkUmlnaHQgIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3JpZ2h0ID0gVmVjMi54QXhpcygpLnJvdGF0ZVNlbGYodGhpcy5fcm90YXRpb24pO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFJpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3VwID0gVmVjMi56ZXJvKCk7XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZFVwPzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBnZXQgdXAoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVVcCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl91cDtcclxuICAgIH1cclxuICAgIHVwZGF0ZVVwKCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkVXAgIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3VwID0gVmVjMi55QXhpcygpLnJvdGF0ZVNlbGYodGhpcy5fcm90YXRpb24pO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFVwO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2lyY2xlMkQge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHBvc2l0aW9uOiBWZWMyLCBwdWJsaWMgcmFkaXVzOiBudW1iZXIpIHtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIGdldFJlY3RDb2xsaXNpb24ocmVjdDogUmVjdDJEKTogU2hhcGUyRENvbGxpc2lvbiB7XHJcbiAgICAgICAgbGV0IHJlcyA9IG5ldyBQb2ludDJEKHRoaXMucG9zaXRpb24pLmdldFJlY3RDb2xsaXNpb24ocmVjdCk7XHJcbiAgICAgICAgcmVzLmRpc3RhbmNlIC09IHRoaXMucmFkaXVzO1xyXG4gICAgICAgIGlmKHJlcy5kaXN0YW5jZSA8PSAwKSByZXMuaW5zaWRlID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gICAgaXNJbnNpZGVDaXJjbGUob3RoZXI6IENpcmNsZTJEKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24uZGlzdFRvKG90aGVyLnBvc2l0aW9uKSA8PSB0aGlzLnJhZGl1cyArIG90aGVyLnJhZGl1c1xyXG4gICAgfVxyXG4gICAgZ2V0Q2lyY2xlQ29sbGlzaW9uKG90aGVyOiBDaXJjbGUyRCk6IFNoYXBlMkRDb2xsaXNpb24ge1xyXG4gICAgICAgIGxldCBkaXN0ID0gdGhpcy5wb3NpdGlvbi5kaXN0VG8ob3RoZXIucG9zaXRpb24pIC0gdGhpcy5yYWRpdXMgLSBvdGhlci5yYWRpdXM7XHJcbiAgICAgICAgbGV0IG5vcm1hbCA9IHRoaXMucG9zaXRpb24ubG9vayhvdGhlci5wb3NpdGlvbik7XHJcbiAgICAgICAgbGV0IGNvbGxpc2lvbiA9IHRoaXMucG9zaXRpb24uYWRkU2NhbGVkKG5vcm1hbCwgdGhpcy5yYWRpdXMpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGluc2lkZTogZGlzdCA8PSAwLFxyXG4gICAgICAgICAgICBjb2xsaXNpb24sXHJcbiAgICAgICAgICAgIGRpc3RhbmNlOiBkaXN0LFxyXG4gICAgICAgICAgICBub3JtYWwsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGdldFNlZ21lbnRDb2xsaXNpb24oc2VnbWVudDogU2VnbWVudDJEKTogU2hhcGUyRENvbGxpc2lvbiB7XHJcbiAgICAgICAgbGV0IGRpciA9IHNlZ21lbnQuc3RhcnQubG9vayhzZWdtZW50LmVuZCk7XHJcbiAgICAgICAgbGV0IG9mZiA9IHRoaXMucG9zaXRpb24uc3ViKHNlZ21lbnQuc3RhcnQpO1xyXG4gICAgICAgIGxldCB0ID0gb2ZmLmRvdChkaXIpO1xyXG4gICAgICAgIGxldCBtYXhUID0gc2VnbWVudC5lbmQuZGlzdFRvKHNlZ21lbnQuc3RhcnQpO1xyXG4gICAgICAgIHQgPSBFTWF0aC5jbGFtcCh0LCAwLCBtYXhUKTtcclxuICAgICAgICBsZXQgY29sbGlzaW9uID0gc2VnbWVudC5zdGFydC5hZGRTY2FsZWQoZGlyLCB0KTtcclxuICAgICAgICBsZXQgbm9ybWFsID0gY29sbGlzaW9uLmxvb2sodGhpcy5wb3NpdGlvbik7XHJcbiAgICAgICAgbGV0IGRpc3QgPSBjb2xsaXNpb24uZGlzdFRvKHRoaXMucG9zaXRpb24pIC0gdGhpcy5yYWRpdXM7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgaW5zaWRlOiBkaXN0IDw9IDAsXHJcbiAgICAgICAgICAgIGNvbGxpc2lvbixcclxuICAgICAgICAgICAgZGlzdGFuY2U6IGRpc3QsXHJcbiAgICAgICAgICAgIG5vcm1hbCxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgbGV0IENpcmNsZTJETWVzaCA9IG5ldyBUcmlNZXNoMkQoKTtcclxuZm9yKGxldCBpPTA7IGk8MTY7IGkrKykge1xyXG4gICAgbGV0IGExID0gaS8xNiAqIE1hdGguUEkgKiAyO1xyXG4gICAgbGV0IGEyID0gKGkrMSkvMTYgKiBNYXRoLlBJICogMjtcclxuICAgIENpcmNsZTJETWVzaC5wb3NpdGlvbnMucHVzaChNYXRoLmNvcyhhMSksIE1hdGguc2luKGExKSk7XHJcbiAgICBDaXJjbGUyRE1lc2gucG9zaXRpb25zLnB1c2goMCwgMCk7XHJcbiAgICBDaXJjbGUyRE1lc2gucG9zaXRpb25zLnB1c2goTWF0aC5jb3MoYTIpLCBNYXRoLnNpbihhMikpO1xyXG59XHJcbmV4cG9ydCBsZXQgQ2lyY2xlMkRQb3NpdGlvbnNGMzIgPSBuZXcgRmxvYXQzMkFycmF5KENpcmNsZTJETWVzaC5wb3NpdGlvbnMpO1xyXG5leHBvcnQgbGV0IFJlY3QyRE1lc2ggPSBuZXcgVHJpTWVzaDJEKCk7XHJcblJlY3QyRE1lc2gucG9zaXRpb25zLnB1c2goLTEsLTEsMSwtMSwxLDEsLTEsLTEsLTEsMSwxLDEpO1xyXG5leHBvcnQgbGV0IFJlY3QyRFBvc2l0aW9uc0YzMiA9IG5ldyBGbG9hdDMyQXJyYXkoUmVjdDJETWVzaC5wb3NpdGlvbnMpO1xyXG5cclxuZXhwb3J0IHR5cGUgUGh5c2ljc1BhcnQyRFNoYXBlID0gXCJyZWN0XCIgfCBcImNpcmNsZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBoeXNpY3NQYXJ0MkQge1xyXG4gICAgYW5jaG9yZWQ6IGJvb2xlYW47XHJcbiAgICB2ZWxvY2l0eSA9IFZlYzIuemVybygpO1xyXG4gICAgaGFzQ29sbGlzaW9uID0gdHJ1ZTtcclxuICAgIGNvbG9yOiBDb2xvcjtcclxuICAgIHNoYWRlck9iamVjdCE6IFdHTDJPYmplY3Q7XHJcbiAgICBtYXNzOiBudW1iZXI7XHJcbiAgICByZXN0aXR1dGlvbjogbnVtYmVyO1xyXG4gICAgZ3Jhdml0eSA9IDUwMDtcclxuICAgIGNvbGxpc2lvbkV2ZW50OiBTaWduYWw8W3BhcnQ6IFBoeXNpY3NQYXJ0MkRdPiA9IG5ldyBTaWduYWwoKTtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHNoYWRlcjogV0dMMlNoYWRlcixcclxuICAgICAgICBwb3NpdGlvbjogVmVjMixcclxuICAgICAgICBzaXplOiBWZWMyLFxyXG4gICAgICAgIGNvbG9yID0gbmV3IENvbG9yKDAsIDAsIDApLFxyXG4gICAgICAgIHNoYXBlVHlwZTogUGh5c2ljc1BhcnQyRFNoYXBlID0gXCJjaXJjbGVcIixcclxuICAgICAgICBhbmNob3JlZCA9IGZhbHNlLFxyXG4gICAgICAgIHJlc3RpdHV0aW9uID0gMSxcclxuICAgICAgICBtYXNzID0gMSxcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuc2hhZGVyID0gc2hhZGVyO1xyXG4gICAgICAgIHRoaXMuc2hhcGVUeXBlID0gc2hhcGVUeXBlO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICAgICAgICB0aGlzLmFuY2hvcmVkID0gYW5jaG9yZWQ7XHJcbiAgICAgICAgdGhpcy5yZXN0aXR1dGlvbiA9IHJlc3RpdHV0aW9uO1xyXG4gICAgICAgIHRoaXMubWFzcyA9IG1hc3M7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbiA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2hhZGVyITogV0dMMlNoYWRlcjtcclxuICAgIHVDb2xvcj86IFdHTDJDb21wb25lbnRVbmlmb3JtO1xyXG4gICAgdVZpZXc/OiBXR0wyQ29tcG9uZW50VW5pZm9ybTtcclxuICAgIGdldCBzaGFkZXIoKSB7IHJldHVybiB0aGlzLl9zaGFkZXI7IH1cclxuICAgIHNldCBzaGFkZXIodmFsdWU6IFdHTDJTaGFkZXIpIHtcclxuICAgICAgICB0aGlzLl9zaGFkZXIgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVDb2xvciA9IHZhbHVlLmdldFVuaWZvcm0oXCJ1X2NvbG9yXCIpO1xyXG4gICAgICAgIHRoaXMudVZpZXcgPSB2YWx1ZS5nZXRVbmlmb3JtKFwidV92aWV3XCIpO1xyXG4gICAgICAgIGlmKHRoaXMuc2hhZGVyT2JqZWN0KVxyXG4gICAgICAgICAgICB0aGlzLnNoYWRlck9iamVjdC5kZWxldGUoKTtcclxuICAgICAgICB0aGlzLnNoYWRlck9iamVjdCA9IHZhbHVlLmNyZWF0ZU9iamVjdCgpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVNoYWRlck9iamVjdERhdGEoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yb3RhdGlvbiE6IG51bWJlcjtcclxuICAgIGdldCByb3RhdGlvbigpIHsgcmV0dXJuIHRoaXMuX3JvdGF0aW9uOyB9XHJcbiAgICBzZXQgcm90YXRpb24odmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmKHZhbHVlID09IHRoaXMuX3JvdGF0aW9uKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fcm90YXRpb24gPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZFJvdGF0aW9uTWF0cml4ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZFZpZXdNYXRyaXggPSB0cnVlO1xyXG4gICAgICAgIGlmKHRoaXMuc2hhcGUgaW5zdGFuY2VvZiBSZWN0MkQpIHtcclxuICAgICAgICAgICAgdGhpcy5zaGFwZS5yb3RhdGlvbiA9IHRoaXMuX3JvdGF0aW9uO1xyXG4gICAgICAgIH1cclxuICAgIH0gXHJcblxyXG4gICAgbGFzdFBvc2l0aW9uID0gVmVjMi56ZXJvKCk7XHJcbiAgICBwcml2YXRlIF9wb3NpdGlvbiE6IFZlYzI7XHJcbiAgICBnZXQgcG9zaXRpb24oKSB7IHJldHVybiB0aGlzLl9wb3NpdGlvbjsgfVxyXG4gICAgc2V0IHBvc2l0aW9uKHZhbHVlOiBWZWMyKSB7XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9wb3NpdGlvbi5vbk11dGF0ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRUcmFuc2xhdGlvbk1hdHJpeCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkVmlld01hdHJpeCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uLm11dGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuc2hhcGUucG9zaXRpb24gPSB0aGlzLl9wb3NpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBzaGFwZSE6IENpcmNsZTJEIHwgUmVjdDJEO1xyXG4gICAgcHJpdmF0ZSBfc2hhcGVUeXBlITogUGh5c2ljc1BhcnQyRFNoYXBlO1xyXG4gICAgZ2V0IHNoYXBlVHlwZSgpIHsgcmV0dXJuIHRoaXMuX3NoYXBlVHlwZTsgfVxyXG4gICAgc2V0IHNoYXBlVHlwZSh2YWx1ZTogUGh5c2ljc1BhcnQyRFNoYXBlKSB7XHJcbiAgICAgICAgdGhpcy5fc2hhcGVUeXBlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlU2hhZGVyT2JqZWN0RGF0YSgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfdXBkYXRlU2hhZGVyT2JqZWN0RGF0YSgpIHtcclxuICAgICAgICBjb25zdCBzaXplID0gdGhpcy5zaXplID8/IFZlYzIuemVybygpO1xyXG4gICAgICAgIHN3aXRjaCh0aGlzLl9zaGFwZVR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcInJlY3RcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hhZGVyT2JqZWN0LnNldERhdGEoXCJhX3Bvc2l0aW9uXCIsIFJlY3QyRFBvc2l0aW9uc0YzMik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoYXBlID0gbmV3IFJlY3QyRCh0aGlzLnBvc2l0aW9uLCBzaXplLCB0aGlzLnJvdGF0aW9uKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiY2lyY2xlXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoYWRlck9iamVjdC5zZXREYXRhKFwiYV9wb3NpdGlvblwiLCBDaXJjbGUyRFBvc2l0aW9uc0YzMik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoYXBlID0gbmV3IENpcmNsZTJEKHRoaXMucG9zaXRpb24sIE1hdGgubWluKHNpemUueCwgc2l6ZS55KSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2l6ZSE6IFZlYzI7XHJcbiAgICBnZXQgc2l6ZSgpIHsgcmV0dXJuIHRoaXMuX3NpemU7IH1cclxuICAgIHNldCBzaXplKHZhbHVlOiBWZWMyKSB7XHJcbiAgICAgICAgdGhpcy5fc2l6ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3NpemUub25NdXRhdGUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkU2NhbGVNYXRyaXggPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFZpZXdNYXRyaXggPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9zaXplLm11dGF0ZSgpO1xyXG4gICAgICAgIGlmKHRoaXMuc2hhcGUgaW5zdGFuY2VvZiBSZWN0MkQpIHtcclxuICAgICAgICAgICAgdGhpcy5zaGFwZS5zaXplID0gdGhpcy5fc2l6ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNoYXBlLnJhZGl1cyA9IE1hdGgubWluKHRoaXMuX3NpemUueCwgdGhpcy5fc2l6ZS55KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgX3RyYW5zbGF0aW9uTWF0cml4OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRUcmFuc2xhdGlvbk1hdHJpeD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgZ2V0IHRyYW5zbGF0aW9uTWF0cml4KCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVHJhbnNsYXRpb25NYXRyaXgoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRpb25NYXRyaXg7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVUcmFuc2xhdGlvbk1hdHJpeCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFRyYW5zbGF0aW9uTWF0cml4ICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl90cmFuc2xhdGlvbk1hdHJpeCA9IE1hdDMudHJhbnNsYXRlKHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55KTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRUcmFuc2xhdGlvbk1hdHJpeDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yb3RhdGlvbk1hdHJpeDogbnVtYmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkUm90YXRpb25NYXRyaXg/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGdldCByb3RhdGlvbk1hdHJpeCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJvdGF0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvdGF0aW9uTWF0cml4O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlUm90YXRpb25NYXRyaXgoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRSb3RhdGlvbk1hdHJpeCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fcm90YXRpb25NYXRyaXggPSBNYXQzLnJvdGF0ZSh0aGlzLnJvdGF0aW9uKTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRSb3RhdGlvbk1hdHJpeDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zY2FsZU1hdHJpeDogbnVtYmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkU2NhbGVNYXRyaXg/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGdldCBzY2FsZU1hdHJpeCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNjYWxlTWF0cml4KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlTWF0cml4O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlU2NhbGVNYXRyaXgoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRTY2FsZU1hdHJpeCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYodGhpcy5fc2hhcGVUeXBlID09IFwiY2lyY2xlXCIpIHtcclxuICAgICAgICAgICAgY29uc3QgcmFkaXVzID0gTWF0aC5taW4odGhpcy5zaXplLngsIHRoaXMuc2l6ZS55KTtcclxuICAgICAgICAgICAgdGhpcy5fc2NhbGVNYXRyaXggPSBNYXQzLnNjYWxlKHJhZGl1cywgcmFkaXVzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9zY2FsZU1hdHJpeCA9IE1hdDMuc2NhbGUodGhpcy5zaXplLngsIHRoaXMuc2l6ZS55KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkU2NhbGVNYXRyaXg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdmlld01hdHJpeDogbnVtYmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkVmlld01hdHJpeD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgZ2V0IHZpZXdNYXRyaXgoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaWV3TWF0cml4KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZpZXdNYXRyaXg7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVWaWV3TWF0cml4KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkVmlld01hdHJpeCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fdmlld01hdHJpeCA9IE1hdDMubXVsdGlwbHkodGhpcy5yb3RhdGlvbk1hdHJpeCwgTWF0My5tdWx0aXBseSh0aGlzLnRyYW5zbGF0aW9uTWF0cml4LCB0aGlzLnNjYWxlTWF0cml4KSk7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkVmlld01hdHJpeDtcclxuICAgIH1cclxuXHJcbiAgICByZXNvbHZlQ2lyY2xlQ2lyY2xlQ29sbGlzaW9uKG90aGVyOiBQaHlzaWNzUGFydDJEKSB7XHJcbiAgICAgICAgY29uc3QgY2lyY2xlQSA9IHRoaXMuc2hhcGUgYXMgQ2lyY2xlMkQ7XHJcbiAgICAgICAgY29uc3QgY2lyY2xlQiA9IG90aGVyLnNoYXBlIGFzIENpcmNsZTJEO1xyXG4gICAgICAgIGxldCBkaXN0ID0gdGhpcy5wb3NpdGlvbi5kaXN0VG8ob3RoZXIucG9zaXRpb24pIC0gY2lyY2xlQS5yYWRpdXMgLSBjaXJjbGVCLnJhZGl1cztcclxuICAgICAgICBpZihkaXN0ID4gMClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGxldCBub3JtYWwgPSB0aGlzLnBvc2l0aW9uLmxvb2sob3RoZXIucG9zaXRpb24pO1xyXG4gICAgICAgIGNvbnN0IHZlbEFsb25nTm9ybWFsID0gb3RoZXIudmVsb2NpdHkuc3ViKHRoaXMudmVsb2NpdHkpLmRvdChub3JtYWwpO1xyXG4gICAgICAgIGNvbnN0IG1pID0gKDEvdGhpcy5tYXNzICsgMS9vdGhlci5tYXNzKTtcclxuICAgICAgICBpZiAodmVsQWxvbmdOb3JtYWwgPCAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3RpdHV0aW9uID0gTWF0aC5taW4odGhpcy5yZXN0aXR1dGlvbiwgb3RoZXIucmVzdGl0dXRpb24pO1xyXG4gICAgICAgICAgICBjb25zdCBqID0gLSgxK3Jlc3RpdHV0aW9uKSAqIHZlbEFsb25nTm9ybWFsIC8gbWk7XHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHkuYWRkU2NhbGVkU2VsZihub3JtYWwsIGogKiAtMSAvIHRoaXMubWFzcyk7XHJcbiAgICAgICAgICAgIG90aGVyLnZlbG9jaXR5LmFkZFNjYWxlZFNlbGYobm9ybWFsLCBqICogMSAvIG90aGVyLm1hc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBjb3JyZWN0aW9uID0gbm9ybWFsLnJlc2NhbGUoTWF0aC5tYXgoLWRpc3QgLSAxZS00LCAwKSAvIG1pICogMC44KTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLmFkZFNjYWxlZFNlbGYoY29ycmVjdGlvbiwgLTEvdGhpcy5tYXNzKTtcclxuICAgICAgICBvdGhlci5wb3NpdGlvbi5hZGRTY2FsZWRTZWxmKGNvcnJlY3Rpb24sIDEvb3RoZXIubWFzcyk7XHJcbiAgICAgICAgdGhpcy5jb2xsaXNpb25FdmVudC5maXJlKG90aGVyKTtcclxuICAgICAgICBvdGhlci5jb2xsaXNpb25FdmVudC5maXJlKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc29sdmVDaXJjbGVBbmNob3JlZFJlY3RDb2xsaXNpb24ob3RoZXI6IFBoeXNpY3NQYXJ0MkQpIHtcclxuICAgICAgICBjb25zdCBjaXJjbGUgPSB0aGlzLnNoYXBlIGFzIENpcmNsZTJEO1xyXG4gICAgICAgIGNvbnN0IHJlY3QgPSBvdGhlci5zaGFwZSBhcyBSZWN0MkQ7XHJcbiAgICAgICAgbGV0IGRpZmYgPSB0aGlzLnBvc2l0aW9uLnN1YihyZWN0LnBvc2l0aW9uKTtcclxuICAgICAgICBsZXQgZHggPSBkaWZmLmRvdChyZWN0LnJpZ2h0KTtcclxuICAgICAgICBsZXQgZHkgPSBkaWZmLmRvdChyZWN0LnVwKTtcclxuICAgICAgICBpZihNYXRoLmFicyhkeCkgPj0gcmVjdC5zaXplLnggKyBjaXJjbGUucmFkaXVzIHx8IE1hdGguYWJzKGR5KSA+PSByZWN0LnNpemUueSArIGNpcmNsZS5yYWRpdXMpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBsZXQgZDEgPSBNYXRoLmFicyh0aGlzLnBvc2l0aW9uLnN1YihyZWN0LnBvc2l0aW9uLmFkZFNjYWxlZChyZWN0LnVwLCByZWN0LnNpemUueSkpLmRvdChyZWN0LnVwKSk7XHJcbiAgICAgICAgbGV0IGQyID0gTWF0aC5hYnModGhpcy5wb3NpdGlvbi5zdWIocmVjdC5wb3NpdGlvbi5hZGRTY2FsZWQocmVjdC51cCwgLXJlY3Quc2l6ZS55KSkuZG90KHJlY3QudXApKTtcclxuICAgICAgICBsZXQgZDMgPSBNYXRoLmFicyh0aGlzLnBvc2l0aW9uLnN1YihyZWN0LnBvc2l0aW9uLmFkZFNjYWxlZChyZWN0LnJpZ2h0LCByZWN0LnNpemUueCkpLmRvdChyZWN0LnJpZ2h0KSk7XHJcbiAgICAgICAgbGV0IGQ0ID0gTWF0aC5hYnModGhpcy5wb3NpdGlvbi5zdWIocmVjdC5wb3NpdGlvbi5hZGRTY2FsZWQocmVjdC5yaWdodCwgLXJlY3Quc2l6ZS54KSkuZG90KHJlY3QucmlnaHQpKTtcclxuICAgICAgICBsZXQgbWluSW5kZXggPSAwO1xyXG4gICAgICAgIGxldCBtaW5EaXN0ID0gZDE7XHJcbiAgICAgICAgaWYoZDIgPCBtaW5EaXN0KSB7IG1pbkRpc3QgPSBkMjsgbWluSW5kZXggPSAxOyB9XHJcbiAgICAgICAgaWYoZDMgPCBtaW5EaXN0KSB7IG1pbkRpc3QgPSBkMzsgbWluSW5kZXggPSAyOyB9XHJcbiAgICAgICAgaWYoZDQgPCBtaW5EaXN0KSB7IG1pbkRpc3QgPSBkNDsgbWluSW5kZXggPSAzOyB9XHJcbiAgICAgICAgaWYobWluRGlzdCA+IGNpcmNsZS5yYWRpdXMpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBsZXQgZWRnZSE6IFZlYzI7XHJcbiAgICAgICAgbGV0IG5vcm1hbCE6IFZlYzI7XHJcbiAgICAgICAgc3dpdGNoKG1pbkluZGV4KSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIGVkZ2UgPSByZWN0LnBvc2l0aW9uLmFkZFNjYWxlZChyZWN0LnJpZ2h0LCBkeCkuYWRkU2NhbGVkU2VsZihyZWN0LnVwLCByZWN0LnNpemUueSk7XHJcbiAgICAgICAgICAgICAgICBub3JtYWwgPSByZWN0LnVwO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIGVkZ2UgPSByZWN0LnBvc2l0aW9uLmFkZFNjYWxlZChyZWN0LnJpZ2h0LCBkeCkuYWRkU2NhbGVkU2VsZihyZWN0LnVwLCAtcmVjdC5zaXplLnkpO1xyXG4gICAgICAgICAgICAgICAgbm9ybWFsID0gcmVjdC51cC5uZWcoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICBlZGdlID0gcmVjdC5wb3NpdGlvbi5hZGRTY2FsZWQocmVjdC51cCwgZHkpLmFkZFNjYWxlZFNlbGYocmVjdC5yaWdodCwgcmVjdC5zaXplLngpO1xyXG4gICAgICAgICAgICAgICAgbm9ybWFsID0gcmVjdC5yaWdodDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICBlZGdlID0gcmVjdC5wb3NpdGlvbi5hZGRTY2FsZWQocmVjdC51cCwgZHkpLmFkZFNjYWxlZFNlbGYocmVjdC5yaWdodCwgLXJlY3Quc2l6ZS54KTtcclxuICAgICAgICAgICAgICAgIG5vcm1hbCA9IHJlY3QucmlnaHQubmVnKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdmVsQWxvbmdOb3JtYWwgPSB0aGlzLnZlbG9jaXR5LnN1YihvdGhlci52ZWxvY2l0eSkuZG90KG5vcm1hbCk7XHJcbiAgICAgICAgaWYgKHZlbEFsb25nTm9ybWFsIDwgMCkge1xyXG4gICAgICAgICAgICBjb25zdCByZXN0aXR1dGlvbiA9IE1hdGgubWluKHRoaXMucmVzdGl0dXRpb24sIG90aGVyLnJlc3RpdHV0aW9uKTtcclxuICAgICAgICAgICAgY29uc3QgaiA9IC0oMStyZXN0aXR1dGlvbikgKiB2ZWxBbG9uZ05vcm1hbDtcclxuICAgICAgICAgICAgdGhpcy52ZWxvY2l0eS5hZGRTY2FsZWRTZWxmKG5vcm1hbCwgaik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBlZGdlLmFkZFNjYWxlZFNlbGYobm9ybWFsLCBjaXJjbGUucmFkaXVzICsgMWUtNik7XHJcbiAgICAgICAgdGhpcy5jb2xsaXNpb25FdmVudC5maXJlKG90aGVyKTtcclxuICAgICAgICBvdGhlci5jb2xsaXNpb25FdmVudC5maXJlKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihjYW1lcmE/OiBDYW1lcmEyRCkge1xyXG4gICAgICAgIGlmKHRoaXMudUNvbG9yKVxyXG4gICAgICAgICAgICB0aGlzLnVDb2xvci5zZXRWYWx1ZXMoW3RoaXMuY29sb3IuciwgdGhpcy5jb2xvci5nLCB0aGlzLmNvbG9yLmJdKTtcclxuICAgICAgICBpZih0aGlzLnVWaWV3KVxyXG4gICAgICAgICAgICB0aGlzLnVWaWV3LnNldFZhbHVlcyhjYW1lcmEgPyBNYXQzLm11bHRpcGx5KGNhbWVyYS52aWV3TWF0cml4LCB0aGlzLnZpZXdNYXRyaXgpIDogdGhpcy52aWV3TWF0cml4KTtcclxuICAgICAgICB0aGlzLnNoYWRlck9iamVjdC5kcmF3VHJpYW5nbGVzKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBSYXkzRCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgb3JpZ2luOiBWZWMzLCBwdWJsaWMgZGlyZWN0aW9uOiBWZWMzKSB7XHJcblxyXG4gICAgfVxyXG4gICAgcmF5Y2FzdFZveGVsczxUPihcclxuICAgICAgICBwcmVkaWNhdGU6IChwb3M6VmVjMywgbm9ybWFsOlZlYzMsIGRpc3Q6bnVtYmVyKSA9PiBUIHwgdW5kZWZpbmVkLFxyXG4gICAgICAgIG1heEl0ZXJhdGlvbnMgPSAxMDAwXHJcbiAgICApOiBUIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBjb25zdCBpbnZEaXJBYnMgPSB0aGlzLmRpcmVjdGlvbi5yZGl2RigxKS5tYXAoeCA9PiBNYXRoLmFicyh4KSk7XHJcbiAgICAgICAgY29uc3Qgc2lnbiA9IHRoaXMuZGlyZWN0aW9uLm1hcCh4ID0+IHggPiAwID8gMSA6IDApO1xyXG4gICAgICAgIGNvbnN0IHN0ZXAgPSB0aGlzLmRpcmVjdGlvbi5tYXAoeCA9PiB4ID4gMCA/IDEgOiAtMSk7XHJcbiAgICAgICAgbGV0IHRNYXhYID0gaW52RGlyQWJzLnggKiAoc2lnbi54PT09MCA/ICh0aGlzLm9yaWdpbi54IC0gTWF0aC5mbG9vcih0aGlzLm9yaWdpbi54KSkgOiAoTWF0aC5mbG9vcih0aGlzLm9yaWdpbi54KSArIDEgLSB0aGlzLm9yaWdpbi54KSk7XHJcbiAgICAgICAgbGV0IHRNYXhZID0gaW52RGlyQWJzLnkgKiAoc2lnbi55PT09MCA/ICh0aGlzLm9yaWdpbi55IC0gTWF0aC5mbG9vcih0aGlzLm9yaWdpbi55KSkgOiAoTWF0aC5mbG9vcih0aGlzLm9yaWdpbi55KSArIDEgLSB0aGlzLm9yaWdpbi55KSk7XHJcbiAgICAgICAgbGV0IHRNYXhaID0gaW52RGlyQWJzLnogKiAoc2lnbi56PT09MCA/ICh0aGlzLm9yaWdpbi56IC0gTWF0aC5mbG9vcih0aGlzLm9yaWdpbi56KSkgOiAoTWF0aC5mbG9vcih0aGlzLm9yaWdpbi56KSArIDEgLSB0aGlzLm9yaWdpbi56KSk7XHJcbiAgICAgICAgbGV0IHBvcyA9IG5ldyBWZWMzKHRoaXMub3JpZ2luKS5tYXBTZWxmKHggPT4gTWF0aC5mbG9vcih4KSk7XHJcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gMDtcclxuICAgICAgICBsZXQgbm9ybWFsID0gVmVjMy56ZXJvKCk7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8bWF4SXRlcmF0aW9uczsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCByZXMgPSBwcmVkaWNhdGUocG9zLCBub3JtYWwsIGRpc3RhbmNlKTtcclxuICAgICAgICAgICAgaWYocmVzICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgICAgICBpZih0TWF4WCA8IHRNYXhZKSB7XHJcbiAgICAgICAgICAgICAgICBpZih0TWF4WCA8IHRNYXhaKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2UgPSB0TWF4WDtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWwuc2V0Qygtc3RlcC54LCAwLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICB0TWF4WCArPSBpbnZEaXJBYnMueDtcclxuICAgICAgICAgICAgICAgICAgICBwb3MueCArPSBzdGVwLng7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gdE1heFo7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsLnNldEMoMCwgMCwgLXN0ZXAueik7XHJcbiAgICAgICAgICAgICAgICAgICAgdE1heFogKz0gaW52RGlyQWJzLno7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zLnogKz0gc3RlcC56O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYodE1heFkgPCB0TWF4Wikge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gdE1heFk7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsLnNldEMoMCwgLXN0ZXAueSwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdE1heFkgKz0gaW52RGlyQWJzLnk7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zLnkgKz0gc3RlcC55O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IHRNYXhaO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbC5zZXRDKDAsIDAsIC1zdGVwLnopO1xyXG4gICAgICAgICAgICAgICAgICAgIHRNYXhaICs9IGludkRpckFicy56O1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcy56ICs9IHN0ZXAuejtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgcmF5Y2FzdEJveChib3VuZHM6IFZlYzNbXSkge1xyXG4gICAgICAgIGNvbnN0IGludkRpciA9IHRoaXMuZGlyZWN0aW9uLnJkaXZGKDEpO1xyXG4gICAgICAgIGNvbnN0IHNpZ24gPSB0aGlzLmRpcmVjdGlvbi5tYXAoeCA9PiB4ID4gMCA/IDEgOiAwKTtcclxuICAgICAgICBjb25zdCBzaWduRmxpcCA9IHRoaXMuZGlyZWN0aW9uLm1hcCh4ID0+IHggPiAwID8gMCA6IDEpO1xyXG4gICAgICAgIGNvbnN0IHN0ZXBGbGlwID0gdGhpcy5kaXJlY3Rpb24ubWFwKHggPT4geCA+IDAgPyAtMSA6IDEpO1xyXG4gICAgICAgIGxldCB0bWluID0gKGJvdW5kc1tzaWduRmxpcC54XSEueCAtIHRoaXMub3JpZ2luLngpICogaW52RGlyLng7XHJcbiAgICAgICAgbGV0IHRtYXggPSAoYm91bmRzW3NpZ24ueF0hLnggLSB0aGlzLm9yaWdpbi54KSAqIGludkRpci54O1xyXG4gICAgICAgIGxldCBub3JtYWwgPSBuZXcgVmVjMyhzdGVwRmxpcC54LDAsMCk7XHJcbiAgICAgICAgbGV0IHR5bWluID0gKGJvdW5kc1tzaWduRmxpcC55XSEueSAtIHRoaXMub3JpZ2luLnkpICogaW52RGlyLnk7XHJcbiAgICAgICAgbGV0IHR5bWF4ID0gKGJvdW5kc1tzaWduLnldIS55IC0gdGhpcy5vcmlnaW4ueSkgKiBpbnZEaXIueTtcclxuICAgICAgICBpZigodG1pbiA+IHR5bWF4KSB8fCAodHltaW4gPiB0bWF4KSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYodHltaW4gPiB0bWluKSB7XHJcbiAgICAgICAgICAgIHRtaW4gPSB0eW1pbjtcclxuICAgICAgICAgICAgbm9ybWFsID0gbmV3IFZlYzMoMCxzdGVwRmxpcC55LDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eW1heCA8IHRtYXgpIHRtYXggPSB0eW1heDtcclxuICAgICAgICBsZXQgdHptaW4gPSAoYm91bmRzW3NpZ25GbGlwLnpdIS56IC0gdGhpcy5vcmlnaW4ueikgKiBpbnZEaXIuejtcclxuICAgICAgICBsZXQgdHptYXggPSAoYm91bmRzW3NpZ24uel0hLnogLSB0aGlzLm9yaWdpbi56KSAqIGludkRpci56O1xyXG4gICAgICAgIGlmKCh0bWluID4gdHptYXgpIHx8ICh0em1pbiA+IHRtYXgpKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBpZih0em1pbiA+IHRtaW4pIHtcclxuICAgICAgICAgICAgdG1pbiA9IHR6bWluO1xyXG4gICAgICAgICAgICBub3JtYWwgPSBuZXcgVmVjMygwLDAsc3RlcEZsaXAueik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR6bWF4IDwgdG1heCkgdG1heCA9IHR6bWF4O1xyXG4gICAgICAgIGNvbnN0IGRpc3RhbmNlID0gdG1pbiA8IDAgPyAwIDogdG1pbjtcclxuICAgICAgICByZXR1cm4geyBub3JtYWwsIGRpc3RhbmNlLCBpbnRlcnNlY3Rpb246IHRoaXMub3JpZ2luLmFkZFNjYWxlZCh0aGlzLmRpcmVjdGlvbiwgZGlzdGFuY2UpIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQaHlzaWNzMkRFbnZpcm9ubWVudCB7XHJcbiAgICBwYXJ0T2JzZXJ2ZXI6IFNpZ25hbDxbb2JqOiBhbnldPiA9IG5ldyBTaWduYWwoe29uQ29ubmVjdDooY29ubik9Pntmb3IoY29uc3Qgb2JqIG9mIHRoaXMucGFydHMpY29ubi5maXJlKG9iaik7fX0pO1xyXG4gICAgcGFydHM6IFBoeXNpY3NQYXJ0MkRbXSA9IFtdO1xyXG4gICAgZGVmYXVsdFNoYWRlcjogV0dMMlNoYWRlcjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdFNoYWRlciA9IG5ldyBXR0wyU2hhZGVyKFxyXG4gICAgICAgICAgICBnbCxcclxuICAgICAgICAgICAgYCN2ZXJzaW9uIDMwMCBlc1xyXG4gICAgICAgICAgICAgICAgaW4gdmVjMiBhX3Bvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgdW5pZm9ybSBtYXQzIHVfdmlldztcclxuICAgICAgICAgICAgICAgIHZvaWQgbWFpbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB2ZWMyIHZfcG9zaXRpb24gPSAodV92aWV3ICogdmVjMyhhX3Bvc2l0aW9uLCAxKSkueHk7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2xfUG9zaXRpb24gPSB2ZWM0KHZfcG9zaXRpb24sIDAsIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBgLFxyXG4gICAgICAgICAgICBgI3ZlcnNpb24gMzAwIGVzXHJcbiAgICAgICAgICAgICAgICBwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XHJcbiAgICAgICAgICAgICAgICB1bmlmb3JtIHZlYzMgdV9jb2xvcjtcclxuICAgICAgICAgICAgICAgIG91dCB2ZWM0IG91dENvbG9yO1xyXG4gICAgICAgICAgICAgICAgdm9pZCBtYWluKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dENvbG9yID0gdmVjNCh1X2NvbG9yLzI1NS4sIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBgLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0U2hhZGVyLmFkZEF0dHJpYnV0ZShcImFfcG9zaXRpb25cIiwgXCJ2ZWMyXCIpO1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdFNoYWRlci5jcmVhdGVVbmlmb3JtKFwidV92aWV3XCIsIFwibWF0M1wiKTtcclxuICAgICAgICB0aGlzLmRlZmF1bHRTaGFkZXIuY3JlYXRlVW5pZm9ybShcInVfY29sb3JcIiwgXCJ2ZWMzXCIpO1xyXG4gICAgfVxyXG4gICAgYWRkUGFydChwYXJ0OiBQaHlzaWNzUGFydDJEKSB7XHJcbiAgICAgICAgdGhpcy5wYXJ0cy5wdXNoKHBhcnQpO1xyXG4gICAgfVxyXG4gICAgcmVtb3ZlUGFydChwYXJ0OiBQaHlzaWNzUGFydDJEKSB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnBhcnRzLmluZGV4T2YocGFydCk7XHJcbiAgICAgICAgaWYoaW5kZXggPT0gLTEpIHJldHVybjtcclxuICAgICAgICB0aGlzLnBhcnRzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoZHQ6IG51bWJlciwgc29sdmVzQ291bnQgPSAzKSB7XHJcbiAgICAgICAgZm9yKGxldCBwYXJ0IG9mIHRoaXMucGFydHMpIHtcclxuICAgICAgICAgICAgaWYocGFydC5hbmNob3JlZCkge1xyXG4gICAgICAgICAgICAgICAgcGFydC52ZWxvY2l0eSA9IHBhcnQucG9zaXRpb24uc3ViKHBhcnQubGFzdFBvc2l0aW9uKS5tdWxGKDEvZHQpO1xyXG4gICAgICAgICAgICAgICAgcGFydC5sYXN0UG9zaXRpb24uc2V0QyhwYXJ0LnBvc2l0aW9uLngsIHBhcnQucG9zaXRpb24ueSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwYXJ0Lmxhc3RQb3NpdGlvbi5zZXRDKHBhcnQucG9zaXRpb24ueCwgcGFydC5wb3NpdGlvbi55KTtcclxuICAgICAgICAgICAgICAgIHBhcnQudmVsb2NpdHkueSAtPSBwYXJ0LmdyYXZpdHkgKiBkdDtcclxuICAgICAgICAgICAgICAgIHBhcnQucG9zaXRpb24uYWRkU2NhbGVkU2VsZihwYXJ0LnZlbG9jaXR5LCBkdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8c29sdmVzQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDsgajx0aGlzLnBhcnRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJ0ID0gdGhpcy5wYXJ0c1tqXSE7XHJcbiAgICAgICAgICAgICAgICBpZighcGFydC5oYXNDb2xsaXNpb24pIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBrPWorMTsgazx0aGlzLnBhcnRzLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3RoZXIgPSB0aGlzLnBhcnRzW2tdITtcclxuICAgICAgICAgICAgICAgICAgICBpZighb3RoZXIuaGFzQ29sbGlzaW9uKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICBpZihwYXJ0LmFuY2hvcmVkICYmIG90aGVyLmFuY2hvcmVkKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICBpZihwYXJ0LnNoYXBlVHlwZSA9PT0gXCJjaXJjbGVcIiAmJiBvdGhlci5zaGFwZVR5cGUgPT09IFwiY2lyY2xlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFydC5yZXNvbHZlQ2lyY2xlQ2lyY2xlQ29sbGlzaW9uKG90aGVyKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYocGFydC5zaGFwZVR5cGUgPT09IFwiY2lyY2xlXCIgJiYgb3RoZXIuc2hhcGVUeXBlID09PSBcInJlY3RcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0LnJlc29sdmVDaXJjbGVBbmNob3JlZFJlY3RDb2xsaXNpb24ob3RoZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihwYXJ0LnNoYXBlVHlwZSA9PT0gXCJyZWN0XCIgJiYgb3RoZXIuc2hhcGVUeXBlID09PSBcImNpcmNsZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyLnJlc29sdmVDaXJjbGVBbmNob3JlZFJlY3RDb2xsaXNpb24ocGFydCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmVuZGVyQWxsKGNhbWVyYTogQ2FtZXJhMkQpIHtcclxuICAgICAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IHRoaXMuZ2wuREVQVEhfQlVGRkVSX0JJVCk7XHJcbiAgICAgICAgZm9yKGxldCBwYXJ0IG9mIHRoaXMucGFydHMpIHtcclxuICAgICAgICAgICAgcGFydC5yZW5kZXIoY2FtZXJhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIEVWRU5UIENMQVNTRVMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgY2xhc3MgU2lnbmFsPFQgZXh0ZW5kcyBhbnlbXT4ge1xyXG4gICAgY29ubmVjdGlvbnM6IENvbm5lY3Rpb248VD5bXSA9IFtdO1xyXG4gICAgdGltZUZpcmVkOiBudW1iZXIgPSAtTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgIG9uQ29ubmVjdD86IChjb25uOiBDb25uZWN0aW9uPFQ+KSA9PiB2b2lkO1xyXG4gICAgY29uc3RydWN0b3Ioe1xyXG4gICAgICAgIG9uQ29ubmVjdCA9IHVuZGVmaW5lZCxcclxuICAgIH06IHtcclxuICAgICAgICBvbkNvbm5lY3Q/OiAoY29ubjogQ29ubmVjdGlvbjxUPikgPT4gdm9pZCxcclxuICAgIH0gPSB7fSkge1xyXG4gICAgICAgIHRoaXMub25Db25uZWN0ID0gb25Db25uZWN0O1xyXG4gICAgfVxyXG4gICAgY29ubmVjdChjYWxsYmFjazogKC4uLmFyZ3M6IFQpID0+IHZvaWQpIHtcclxuICAgICAgICBjb25zdCBjb25uID0gbmV3IENvbm5lY3Rpb248VD4odGhpcywgY2FsbGJhY2spO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMucHVzaChjb25uKTtcclxuICAgICAgICBpZih0aGlzLm9uQ29ubmVjdCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ29ubmVjdChjb25uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbm47XHJcbiAgICB9XHJcbiAgICBvbmNlKGNhbGxiYWNrOiAoLi4uYXJnczogVCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGNvbnN0IGNvbm4gPSB0aGlzLmNvbm5lY3QoKC4uLmFyZ3M6IFQpID0+IHtcclxuICAgICAgICAgICAgY2FsbGJhY2soLi4uYXJncyk7XHJcbiAgICAgICAgICAgIGNvbm4uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBjb25uO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgd2FpdCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8VD4ocmVzID0+IHtcclxuICAgICAgICAgICAgdGhpcy5vbmNlKCguLi5hcmdzOiBUKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXMoYXJncyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZmlyZSguLi5hcmdzOiBUKSB7XHJcbiAgICAgICAgdGhpcy50aW1lRmlyZWQgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICBmb3IoY29uc3QgY29ubiBvZiBbLi4udGhpcy5jb25uZWN0aW9uc10pIHtcclxuICAgICAgICAgICAgY29ubi5maXJlKC4uLmFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldFRpbWVTaW5jZUZpcmVkKCkge1xyXG4gICAgICAgIHJldHVybiBwZXJmb3JtYW5jZS5ub3coKSAvIDEwMDAgLSB0aGlzLnRpbWVGaXJlZDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvbm5lY3Rpb248VCBleHRlbmRzIGFueVtdPiB7XHJcbiAgICBncm91cHM6IENvbm5lY3Rpb25Hcm91cFtdID0gW107XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc2lnbmFsOiBTaWduYWw8VD4sIHB1YmxpYyBjYWxsYmFjazogKC4uLmFyZ3M6IFQpID0+IHZvaWQpIHtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIGRpc2Nvbm5lY3QoKSB7XHJcbiAgICAgICAgdGhpcy5zaWduYWwuY29ubmVjdGlvbnMuc3BsaWNlKHRoaXMuc2lnbmFsLmNvbm5lY3Rpb25zLmluZGV4T2YodGhpcyksIDEpO1xyXG4gICAgICAgIGZvcihjb25zdCBncm91cCBvZiB0aGlzLmdyb3Vwcykge1xyXG4gICAgICAgICAgICBncm91cC5jb25uZWN0aW9ucy5zcGxpY2UoZ3JvdXAuY29ubmVjdGlvbnMuaW5kZXhPZih0aGlzKSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ3JvdXBzID0gW107XHJcbiAgICB9XHJcbiAgICBmaXJlKC4uLmFyZ3M6IFQpIHtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrKC4uLmFyZ3MpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSHRtbENvbm5lY3Rpb24ge1xyXG4gICAgZ3JvdXBzOiBDb25uZWN0aW9uR3JvdXBbXSA9IFtdO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFdmVudFRhcmdldCwgcHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIGNhbGxiYWNrOiAoZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKHRoaXMubmFtZSwgdGhpcy5jYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBkaXNjb25uZWN0KCkge1xyXG4gICAgICAgIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLm5hbWUsIHRoaXMuY2FsbGJhY2spO1xyXG4gICAgICAgIGZvcihjb25zdCBncm91cCBvZiB0aGlzLmdyb3Vwcykge1xyXG4gICAgICAgICAgICBncm91cC5jb25uZWN0aW9ucy5zcGxpY2UoZ3JvdXAuY29ubmVjdGlvbnMuaW5kZXhPZih0aGlzKSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ3JvdXBzID0gW107XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uR3JvdXAge1xyXG4gICAgY29ubmVjdGlvbnM6IChDb25uZWN0aW9uPGFueT4gfCBIdG1sQ29ubmVjdGlvbilbXSA9IFtdO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG4gICAgYWRkKGNvbm46IENvbm5lY3Rpb248YW55PiB8IEh0bWxDb25uZWN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5wdXNoKGNvbm4pO1xyXG4gICAgfVxyXG4gICAgZGlzY29ubmVjdEFsbCgpIHtcclxuICAgICAgICBmb3IoY29uc3QgY29ubiBvZiBbLi4udGhpcy5jb25uZWN0aW9uc10pIHtcclxuICAgICAgICAgICAgY29ubi5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMgPSBbXTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBXRUJHTDIgU0hBREVSIENMQVNTRVMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBXR0wyQ29tcG9uZW50U2hhZGVyIHtcclxuICAgIHdTaGFkZXI6IFdlYkdMU2hhZGVyO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LCBwdWJsaWMgdHlwZTogXCJ2ZXJ0ZXhcIiB8IFwiZnJhZ21lbnRcIiwgcHVibGljIHNvdXJjZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgd1NoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0eXBlID09IFwidmVydGV4XCIgPyBnbC5WRVJURVhfU0hBREVSIDogZ2wuRlJBR01FTlRfU0hBREVSKTtcclxuICAgICAgICBpZih3U2hhZGVyID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGNyZWF0ZSBzaGFkZXJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMud1NoYWRlciA9IHdTaGFkZXI7XHJcbiAgICAgICAgZ2wuc2hhZGVyU291cmNlKHdTaGFkZXIsIHNvdXJjZSk7XHJcbiAgICAgICAgZ2wuY29tcGlsZVNoYWRlcih3U2hhZGVyKVxyXG4gICAgICAgIGlmKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIod1NoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvZyA9IGdsLmdldFNoYWRlckluZm9Mb2cod1NoYWRlcik7XHJcbiAgICAgICAgICAgIGdsLmRlbGV0ZVNoYWRlcih3U2hhZGVyKTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGNvbXBpbGUgc2hhZGVyOiBcIiArIGxvZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZGVsZXRlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2wuZGVsZXRlU2hhZGVyKHRoaXMud1NoYWRlcik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXR0wyQ29tcG9uZW50UHJvZ3JhbSB7XHJcbiAgICB3UHJvZ3JhbTogV2ViR0xQcm9ncmFtO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LCBwdWJsaWMgY1NoYWRlclY6IFdHTDJDb21wb25lbnRTaGFkZXIsIHB1YmxpYyBjU2hhZGVyRjogV0dMMkNvbXBvbmVudFNoYWRlcikge1xyXG4gICAgICAgIGNvbnN0IHdQcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG4gICAgICAgIGlmICghd1Byb2dyYW0pIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGNyZWF0ZSBwcm9ncmFtXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLndQcm9ncmFtID0gd1Byb2dyYW07XHJcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKHdQcm9ncmFtLCBjU2hhZGVyVi53U2hhZGVyKTtcclxuICAgICAgICBnbC5hdHRhY2hTaGFkZXIod1Byb2dyYW0sIGNTaGFkZXJGLndTaGFkZXIpO1xyXG4gICAgICAgIGdsLmxpbmtQcm9ncmFtKHdQcm9ncmFtKTtcclxuICAgICAgICBpZighZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcih3UHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvZyA9IGdsLmdldFByb2dyYW1JbmZvTG9nKHdQcm9ncmFtKTtcclxuICAgICAgICAgICAgZ2wuZGVsZXRlUHJvZ3JhbSh3UHJvZ3JhbSk7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBsaW5rIHByb2dyYW06IFwiICsgbG9nKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzZXRBY3RpdmUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKHRoaXMud1Byb2dyYW0pO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2wuZGVsZXRlUHJvZ3JhbSh0aGlzLndQcm9ncmFtKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHR5cGUgV0dMMkF0dHJpYnV0ZVR5cGUgPSAoXHJcbiAgICBcImZsb2F0XCIgfCBcImludFwiIHwgXCJ1aW50XCIgfCBcInZlYzJcIiB8IFwidmVjM1wiIHwgXCJ2ZWM0XCJcclxuICAgIHwgXCJpdmVjMlwiIHwgXCJpdmVjM1wiIHwgXCJpdmVjNFwiIHwgXCJ1dmVjMlwiIHwgXCJ1dmVjM1wiIHwgXCJ1dmVjNFwiXHJcbik7XHJcblxyXG5leHBvcnQgdHlwZSBXR0wyVW5pZm9ybVR5cGUgPSAoXHJcbiAgICBcImZsb2F0XCIgfCBcImludFwiIHwgXCJ1aW50XCIgfCBcInZlYzJcIiB8IFwidmVjM1wiXHJcbiAgICB8IFwidmVjNFwiIHwgXCJpdmVjMlwiIHwgXCJpdmVjM1wiIHwgXCJpdmVjNFwiIHwgXCJ1dmVjMlwiXHJcbiAgICB8IFwidXZlYzNcIiB8IFwidXZlYzRcIiB8IFwibWF0MlwiIHwgXCJtYXQzXCIgfCBcIm1hdDRcIlxyXG4pO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJDb21wb25lbnRCdWZmZXIge1xyXG4gICAgd1R5cGU6IEdMZW51bTtcclxuICAgIHdEaW1lbnNpb25zOiBudW1iZXI7XHJcbiAgICB3QnVmZmVyOiBXZWJHTEJ1ZmZlcjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCwgdHlwZTogV0dMMkF0dHJpYnV0ZVR5cGUpIHtcclxuICAgICAgICBjb25zdCBidWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgICAgICBpZighYnVmZmVyKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBjcmVhdGUgYnVmZmVyXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLndCdWZmZXIgPSBidWZmZXI7XHJcbiAgICAgICAgc3dpdGNoKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImZsb2F0XCI6IHRoaXMud1R5cGUgPSBnbC5GTE9BVDsgdGhpcy53RGltZW5zaW9ucyA9IDE7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidmVjMlwiOiB0aGlzLndUeXBlID0gZ2wuRkxPQVQ7IHRoaXMud0RpbWVuc2lvbnMgPSAyOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInZlYzNcIjogdGhpcy53VHlwZSA9IGdsLkZMT0FUOyB0aGlzLndEaW1lbnNpb25zID0gMzsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ2ZWM0XCI6IHRoaXMud1R5cGUgPSBnbC5GTE9BVDsgdGhpcy53RGltZW5zaW9ucyA9IDQ7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaW50XCI6IHRoaXMud1R5cGUgPSBnbC5JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSAxOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIml2ZWMyXCI6IHRoaXMud1R5cGUgPSBnbC5JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSAyOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIml2ZWMzXCI6IHRoaXMud1R5cGUgPSBnbC5JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSAzOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIml2ZWM0XCI6IHRoaXMud1R5cGUgPSBnbC5JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSA0OyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInVpbnRcIjogdGhpcy53VHlwZSA9IGdsLlVOU0lHTkVEX0lOVDsgdGhpcy53RGltZW5zaW9ucyA9IDE7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXZlYzJcIjogdGhpcy53VHlwZSA9IGdsLlVOU0lHTkVEX0lOVDsgdGhpcy53RGltZW5zaW9ucyA9IDI7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXZlYzNcIjogdGhpcy53VHlwZSA9IGdsLlVOU0lHTkVEX0lOVDsgdGhpcy53RGltZW5zaW9ucyA9IDM7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXZlYzRcIjogdGhpcy53VHlwZSA9IGdsLlVOU0lHTkVEX0lOVDsgdGhpcy53RGltZW5zaW9ucyA9IDQ7IGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoXCJVbnN1cHBvcnRlZCBidWZmZXIgdHlwZTogXCIgKyB0eXBlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzZXRBY3RpdmUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLndCdWZmZXIpO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2wuZGVsZXRlQnVmZmVyKHRoaXMud0J1ZmZlcik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXR0wyQ29tcG9uZW50VmFvIHtcclxuICAgIHdWYW86IFdlYkdMVmVydGV4QXJyYXlPYmplY3Q7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpIHtcclxuICAgICAgICB0aGlzLndWYW8gPSBnbC5jcmVhdGVWZXJ0ZXhBcnJheSgpO1xyXG4gICAgfVxyXG4gICAgc2V0QWN0aXZlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZFZlcnRleEFycmF5KHRoaXMud1Zhbyk7XHJcbiAgICB9XHJcbiAgICBlbmFibGVCdWZmZXIoY0J1ZmZlcjogV0dMMkNvbXBvbmVudEJ1ZmZlciwgd0xvY2F0aW9uOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBjQnVmZmVyLnNldEFjdGl2ZSgpO1xyXG4gICAgICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkod0xvY2F0aW9uKTtcclxuICAgICAgICBpZihjQnVmZmVyLndUeXBlID09IHRoaXMuZ2wuRkxPQVQpIHtcclxuICAgICAgICAgICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHdMb2NhdGlvbiwgY0J1ZmZlci53RGltZW5zaW9ucywgY0J1ZmZlci53VHlwZSwgZmFsc2UsIDAsIDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2wudmVydGV4QXR0cmliSVBvaW50ZXIod0xvY2F0aW9uLCBjQnVmZmVyLndEaW1lbnNpb25zLCBjQnVmZmVyLndUeXBlLCAwLCAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBkZWxldGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nbC5kZWxldGVWZXJ0ZXhBcnJheSh0aGlzLndWYW8pO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMkNvbXBvbmVudFVuaWZvcm0ge1xyXG4gICAgd0xvY2F0aW9uOiBXZWJHTFVuaWZvcm1Mb2NhdGlvbjtcclxuICAgIHF1ZXVlZFZhbHVlczogYW55W10gfCBhbnkgfCBudWxsID0gbnVsbDtcclxuICAgIGhhc1F1ZXVlZCA9IGZhbHNlO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LCBjUHJvZ3JhbTogV0dMMkNvbXBvbmVudFByb2dyYW0sIG5hbWU6IHN0cmluZywgcHVibGljIHR5cGU6IFdHTDJVbmlmb3JtVHlwZSkge1xyXG4gICAgICAgIGNvbnN0IHdMb2NhdGlvbiA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKGNQcm9ncmFtLndQcm9ncmFtLCBuYW1lKTtcclxuICAgICAgICBpZih3TG9jYXRpb24gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGdldCB1bmlmb3JtIGxvY2F0aW9uIGZvciBcIiArIG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLndMb2NhdGlvbiA9IHdMb2NhdGlvbjtcclxuICAgIH1cclxuICAgIHNldFZhbHVlcyh2YWx1ZXMgOiBhbnlbXSB8IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHdMb2NhdGlvbiA9IHRoaXMud0xvY2F0aW9uXHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHN3aXRjaCh0aGlzLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImZsb2F0XCI6IGdsLnVuaWZvcm0xZih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidmVjMlwiOiBnbC51bmlmb3JtMmZ2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ2ZWMzXCI6IGdsLnVuaWZvcm0zZnYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInZlYzRcIjogZ2wudW5pZm9ybTRmdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaW50XCI6IGdsLnVuaWZvcm0xaSh3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaXZlYzJcIjogZ2wudW5pZm9ybTJpdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaXZlYzNcIjogZ2wudW5pZm9ybTNpdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaXZlYzRcIjogZ2wudW5pZm9ybTRpdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidWludFwiOiBnbC51bmlmb3JtMXVpKHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1dmVjMlwiOiBnbC51bmlmb3JtMnVpdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXZlYzNcIjogZ2wudW5pZm9ybTN1aXYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInV2ZWM0XCI6IGdsLnVuaWZvcm00dWl2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJtYXQyXCI6IGdsLnVuaWZvcm1NYXRyaXgyZnYod0xvY2F0aW9uLCBmYWxzZSwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJtYXQzXCI6IGdsLnVuaWZvcm1NYXRyaXgzZnYod0xvY2F0aW9uLCBmYWxzZSwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJtYXQ0XCI6IGdsLnVuaWZvcm1NYXRyaXg0ZnYod0xvY2F0aW9uLCBmYWxzZSwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIHVuaWZvcm0gdHlwZTogXCIgKyB0aGlzLnR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHF1ZXVlVmFsdWVzKHZhbHVlczogYW55W10gfCBhbnkpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmhhc1F1ZXVlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5xdWV1ZWRWYWx1ZXMgPSB2YWx1ZXM7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMuaGFzUXVldWVkKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5oYXNRdWV1ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnNldFZhbHVlcyh0aGlzLnF1ZXVlZFZhbHVlcyk7XHJcbiAgICAgICAgdGhpcy5xdWV1ZWRWYWx1ZXMgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMkF0dHJpYnV0ZSB7XHJcbiAgICB3TG9jYXRpb246IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCwgcHVibGljIHdQcm9ncmFtOiBXZWJHTFByb2dyYW0sIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyB0eXBlOiBXR0wyQXR0cmlidXRlVHlwZSkge1xyXG4gICAgICAgIHRoaXMud0xvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24od1Byb2dyYW0sIG5hbWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMlRleHR1cmUyRCB7XHJcbiAgICB3VGV4dHVyZTogV2ViR0xUZXh0dXJlO1xyXG4gICAgdW5pZm9ybTogV0dMMkNvbXBvbmVudFVuaWZvcm07XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc2hhZGVyOiBXR0wyU2hhZGVyLCBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgc2xvdDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy53VGV4dHVyZSA9IHNoYWRlci5nbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgdGhpcy5zZXRBY3RpdmUoKTtcclxuICAgICAgICB0aGlzLnVuaWZvcm0gPSBzaGFkZXIuY3JlYXRlVW5pZm9ybShuYW1lLCBcImludFwiKTtcclxuICAgICAgICB0aGlzLnVuaWZvcm0uc2V0VmFsdWVzKHRoaXMuc2xvdCk7XHJcbiAgICB9XHJcbiAgICBzZXRBY3RpdmUoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgdGhpcy5zbG90KTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0aGlzLndUZXh0dXJlKTtcclxuICAgIH1cclxuICAgIHNldEludGVycG9sYXRpb24oaXNFbmFibGVkOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGlzRW5hYmxlZCA/IGdsLkxJTkVBUiA6IGdsLk5FQVJFU1QpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBpc0VuYWJsZWQgPyBnbC5MSU5FQVIgOiBnbC5ORUFSRVNUKTtcclxuICAgIH1cclxuICAgIHNldFJlcGVhdChpc0VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBpc0VuYWJsZWQgPyBnbC5SRVBFQVQgOiBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBpc0VuYWJsZWQgPyBnbC5SRVBFQVQgOiBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgIH1cclxuICAgIHNldERhdGEod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGRhdGE6IEFycmF5QnVmZmVyVmlldyB8IG51bGwgPSBudWxsKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIHdpZHRoLCBoZWlnaHQsIDAsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIGRhdGEpO1xyXG4gICAgfVxyXG4gICAgc2V0SW1hZ2UoaW1hZ2U6IFRleEltYWdlU291cmNlKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIGltYWdlKTtcclxuICAgIH1cclxuICAgIGdlbmVyYXRlTWlwbWFwKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XHJcbiAgICB9XHJcbiAgICBkZWxldGUoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC5kZWxldGVUZXh0dXJlKHRoaXMud1RleHR1cmUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMlRleHR1cmUzRCB7XHJcbiAgICB3VGV4dHVyZTogV2ViR0xUZXh0dXJlO1xyXG4gICAgdW5pZm9ybTogV0dMMkNvbXBvbmVudFVuaWZvcm07XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc2hhZGVyOiBXR0wyU2hhZGVyLCBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgc2xvdDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy53VGV4dHVyZSA9IHNoYWRlci5nbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgdGhpcy5zZXRBY3RpdmUoKTtcclxuICAgICAgICB0aGlzLnVuaWZvcm0gPSBzaGFkZXIuY3JlYXRlVW5pZm9ybShuYW1lLCBcImludFwiKTtcclxuICAgICAgICB0aGlzLnVuaWZvcm0uc2V0VmFsdWVzKHRoaXMuc2xvdCk7XHJcbiAgICB9XHJcbiAgICBzZXRBY3RpdmUoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgdGhpcy5zbG90KTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzNELCB0aGlzLndUZXh0dXJlKTtcclxuICAgIH1cclxuICAgIHNldEludGVycG9sYXRpb24oaXNFbmFibGVkOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzNELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGlzRW5hYmxlZCA/IGdsLkxJTkVBUiA6IGdsLk5FQVJFU1QpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8zRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBpc0VuYWJsZWQgPyBnbC5MSU5FQVIgOiBnbC5ORUFSRVNUKTtcclxuICAgIH1cclxuICAgIHNldFJlcGVhdChpc0VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfM0QsIGdsLlRFWFRVUkVfV1JBUF9TLCBpc0VuYWJsZWQgPyBnbC5SRVBFQVQgOiBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfM0QsIGdsLlRFWFRVUkVfV1JBUF9ULCBpc0VuYWJsZWQgPyBnbC5SRVBFQVQgOiBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgIH1cclxuICAgIHNldERhdGEod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGRlcHRoOiBudW1iZXIsIGRhdGE6IEFycmF5QnVmZmVyVmlldyB8IG51bGwgPSBudWxsKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC50ZXhJbWFnZTNEKGdsLlRFWFRVUkVfM0QsIDAsIGdsLlJHQkEsIHdpZHRoLCBoZWlnaHQsIGRlcHRoLCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBkYXRhKTtcclxuICAgIH1cclxuICAgIGdlbmVyYXRlTWlwbWFwKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8zRCk7XHJcbiAgICB9XHJcbiAgICBkZWxldGUoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC5kZWxldGVUZXh0dXJlKHRoaXMud1RleHR1cmUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMk9iamVjdCB7XHJcbiAgICBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dDtcclxuICAgIGNWYW86IFdHTDJDb21wb25lbnRWYW87XHJcbiAgICBjQnVmZmVyQnlOYW1lOiB7W2tleTpzdHJpbmddOiBXR0wyQ29tcG9uZW50QnVmZmVyfSA9IHt9O1xyXG4gICAgdmVydGV4Q291bnQ6IG51bWJlciA9IDA7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc2hhZGVyOiBXR0wyU2hhZGVyKSB7XHJcbiAgICAgICAgdGhpcy5nbCA9IHNoYWRlci5nbDtcclxuICAgICAgICB0aGlzLmNWYW8gPSBuZXcgV0dMMkNvbXBvbmVudFZhbyhzaGFkZXIuZ2wpO1xyXG4gICAgICAgIHRoaXMuY1Zhby5zZXRBY3RpdmUoKTtcclxuICAgICAgICBmb3IoY29uc3QgYXR0cmlidXRlIG9mIHNoYWRlci5hdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNCdWYgPSBuZXcgV0dMMkNvbXBvbmVudEJ1ZmZlcihzaGFkZXIuZ2wsIGF0dHJpYnV0ZS50eXBlKTtcclxuICAgICAgICAgICAgY0J1Zi5zZXRBY3RpdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5jVmFvLmVuYWJsZUJ1ZmZlcihjQnVmLCBhdHRyaWJ1dGUud0xvY2F0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5jQnVmZmVyQnlOYW1lW2F0dHJpYnV0ZS5uYW1lXSA9IGNCdWY7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2V0RGF0YShhdHRyaWJ1dGVOYW1lOiBzdHJpbmcsIHZhbHVlczogRmxvYXQzMkFycmF5LCB1c2FnZTogR0xlbnVtID0gdGhpcy5nbC5TVEFUSUNfRFJBVykge1xyXG4gICAgICAgIGNvbnN0IGNCdWYgPSB0aGlzLmNCdWZmZXJCeU5hbWVbYXR0cmlidXRlTmFtZV07XHJcbiAgICAgICAgaWYoY0J1ZiA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkIG5vdCBmaW5kIGF0dHJpYnV0ZSB3aXRoIG5hbWU6IFwiICsgYXR0cmlidXRlTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNCdWYuc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB2YWx1ZXMsIHVzYWdlKTtcclxuICAgICAgICB0aGlzLnZlcnRleENvdW50ID0gdmFsdWVzLmxlbmd0aCAvIGNCdWYud0RpbWVuc2lvbnM7XHJcbiAgICB9XHJcbiAgICBkcmF3VHJpYW5nbGVzKCkge1xyXG4gICAgICAgIHRoaXMuY1Zhby5zZXRBY3RpdmUoKTtcclxuICAgICAgICB0aGlzLmdsLmRyYXdBcnJheXModGhpcy5nbC5UUklBTkdMRVMsIDAsIHRoaXMudmVydGV4Q291bnQpO1xyXG4gICAgfVxyXG4gICAgZHJhd0xpbmVzKCkge1xyXG4gICAgICAgIHRoaXMuY1Zhby5zZXRBY3RpdmUoKTtcclxuICAgICAgICB0aGlzLmdsLmRyYXdBcnJheXModGhpcy5nbC5MSU5FUywgMCwgdGhpcy52ZXJ0ZXhDb3VudCk7XHJcbiAgICB9XHJcbiAgICBkcmF3UG9pbnRzKCkge1xyXG4gICAgICAgIHRoaXMuY1Zhby5zZXRBY3RpdmUoKTtcclxuICAgICAgICB0aGlzLmdsLmRyYXdBcnJheXModGhpcy5nbC5QT0lOVFMsIDAsIHRoaXMudmVydGV4Q291bnQpO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlKCkge1xyXG4gICAgICAgIGZvcihjb25zdCBuYW1lIGluIHRoaXMuY0J1ZmZlckJ5TmFtZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNCdWZmZXJCeU5hbWVbbmFtZV0hLmRlbGV0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNWYW8uZGVsZXRlKCk7XHJcbiAgICAgICAgdGhpcy5jQnVmZmVyQnlOYW1lID0ge307XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXR0wyU2hhZGVyIHtcclxuICAgIGNQcm9ncmFtOiBXR0wyQ29tcG9uZW50UHJvZ3JhbTtcclxuICAgIGF0dHJpYnV0ZXM6IFdHTDJBdHRyaWJ1dGVbXSA9IFtdO1xyXG4gICAgY1VuaWZvcm1zOiBXR0wyQ29tcG9uZW50VW5pZm9ybVtdID0gW11cclxuICAgIGNVbmlmb3JtQnlOYW1lOiB7W2tleTpzdHJpbmddOldHTDJDb21wb25lbnRVbmlmb3JtfSA9IHt9O1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LCB2U291cmNlOiBzdHJpbmcsIGZTb3VyY2U6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuY1Byb2dyYW0gPSBuZXcgV0dMMkNvbXBvbmVudFByb2dyYW0oXHJcbiAgICAgICAgICAgIGdsLCBuZXcgV0dMMkNvbXBvbmVudFNoYWRlcihnbCwgXCJ2ZXJ0ZXhcIiwgdlNvdXJjZSksXHJcbiAgICAgICAgICAgIG5ldyBXR0wyQ29tcG9uZW50U2hhZGVyKGdsLCBcImZyYWdtZW50XCIsIGZTb3VyY2UpLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5jUHJvZ3JhbS5zZXRBY3RpdmUoKTtcclxuICAgIH1cclxuICAgIGFkZEF0dHJpYnV0ZShuYW1lOiBzdHJpbmcsIHR5cGU6IFdHTDJBdHRyaWJ1dGVUeXBlKSB7XHJcbiAgICAgICAgY29uc3QgYXR0ID0gbmV3IFdHTDJBdHRyaWJ1dGUodGhpcy5nbCwgdGhpcy5jUHJvZ3JhbS53UHJvZ3JhbSwgbmFtZSwgdHlwZSk7XHJcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLnB1c2goYXR0KTtcclxuICAgICAgICByZXR1cm4gYXR0O1xyXG4gICAgfVxyXG4gICAgY3JlYXRlVW5pZm9ybShuYW1lOiBzdHJpbmcsIHR5cGU6IFdHTDJVbmlmb3JtVHlwZSkge1xyXG4gICAgICAgIGNvbnN0IHVuaWZvcm0gPSBuZXcgV0dMMkNvbXBvbmVudFVuaWZvcm0odGhpcy5nbCwgdGhpcy5jUHJvZ3JhbSwgbmFtZSwgdHlwZSk7XHJcbiAgICAgICAgdGhpcy5jVW5pZm9ybXMucHVzaCh1bmlmb3JtKTtcclxuICAgICAgICB0aGlzLmNVbmlmb3JtQnlOYW1lW25hbWVdID0gdW5pZm9ybTtcclxuICAgICAgICByZXR1cm4gdW5pZm9ybTtcclxuICAgIH1cclxuICAgIGdldFVuaWZvcm0obmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY1VuaWZvcm1CeU5hbWVbbmFtZV07XHJcbiAgICB9XHJcbiAgICBjcmVhdGVPYmplY3QoKSB7XHJcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IFdHTDJPYmplY3QodGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH1cclxuICAgIGNyZWF0ZVRleHR1cmUyRChuYW1lOiBzdHJpbmcsIHNsb3Q6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHRleHR1cmUgPSBuZXcgV0dMMlRleHR1cmUyRCh0aGlzLCBuYW1lLCBzbG90KTtcclxuICAgICAgICByZXR1cm4gdGV4dHVyZTtcclxuICAgIH1cclxuICAgIGNyZWF0ZVRleHR1cmUzRChuYW1lOiBzdHJpbmcsIHNsb3Q6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHRleHR1cmUgPSBuZXcgV0dMMlRleHR1cmUzRCh0aGlzLCBuYW1lLCBzbG90KTtcclxuICAgICAgICByZXR1cm4gdGV4dHVyZTtcclxuICAgIH1cclxuICAgIHNldEFjdGl2ZSgpIHtcclxuICAgICAgICB0aGlzLmNQcm9ncmFtLnNldEFjdGl2ZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBURVhUVVJFIEFUTEFTIENMQVNTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IHR5cGUgQXRsYXNJbWFnZSA9IHt4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIsIGltZzogSFRNTEltYWdlRWxlbWVudCwgbmFtZTogc3RyaW5nfTtcclxuXHJcbmV4cG9ydCBjbGFzcyBUZXh0dXJlQXRsYXMge1xyXG4gICAgd2lkdGg6IG51bWJlcjtcclxuICAgIGhlaWdodDogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGltYWdlOiBIVE1MSW1hZ2VFbGVtZW50LCBwdWJsaWMgYm91bmRzOiB7W25hbWU6c3RyaW5nXTogQXRsYXNJbWFnZX0pIHtcclxuICAgICAgICB0aGlzLndpZHRoID0gaW1hZ2UubmF0dXJhbFdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaW1hZ2UubmF0dXJhbEhlaWdodDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBmcm9tVXJscyhhcmdzOiBbbmFtZTpzdHJpbmcsIHVybDpzdHJpbmddW10sIHBhZGRpbmcgPSAwKSB7XHJcbiAgICAgICAgbGV0IGltYWdlczogQXRsYXNJbWFnZVtdID0gW107XHJcbiAgICAgICAgbGV0IHByb21pc2VzOiBQcm9taXNlPHZvaWQ+W10gPSBbXTtcclxuICAgICAgICBsZXQgYXRsYXNTaXplID0gMDtcclxuICAgICAgICBmb3IobGV0IFtuYW1lLCB1cmxdIG9mIGFyZ3MpIHtcclxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaChuZXcgUHJvbWlzZTx2b2lkPihhc3luYyByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YTogQXRsYXNJbWFnZSA9IHtpbWcsIHg6MCwgeTowLCB3OmltZy5uYXR1cmFsV2lkdGgrMipwYWRkaW5nLCBoOmltZy5uYXR1cmFsSGVpZ2h0KzIqcGFkZGluZywgbmFtZX07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlzQ29sbGlkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHg9MDt4PD1hdGxhc1NpemUtZGF0YS53O3grKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHk9MDt5PD1hdGxhc1NpemUtZGF0YS5oO3krKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb2xsaWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgb3RoZXIgb2YgaW1hZ2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoeCArIGRhdGEudyA+IG90aGVyLnggJiYgeSArIGRhdGEuaCA+IG90aGVyLnkgJiYgeCA8IG90aGVyLnggKyBvdGhlci53ICYmIHkgPCBvdGhlci55ICsgb3RoZXIuaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbGxpZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFpc0NvbGxpZGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEueCA9IHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS55ID0geTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZighaXNDb2xsaWRpbmcpIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZihpc0NvbGxpZGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnggPSBhdGxhc1NpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEueSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0bGFzU2l6ZSA9IGRhdGEueCArIGRhdGEudztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VzLnB1c2goZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpbWcuc3JjID0gdXJsO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcclxuICAgICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgICAgICBjYW52YXMud2lkdGggPSBhdGxhc1NpemU7XHJcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGF0bGFzU2l6ZTtcclxuICAgICAgICBsZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKSE7XHJcbiAgICAgICAgbGV0IGJvdW5kczoge1tuYW1lOnN0cmluZ106IEF0bGFzSW1hZ2V9ID0ge307XHJcbiAgICAgICAgZm9yKGxldCBpbWcgb2YgaW1hZ2VzKSB7XHJcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgaW1nLnggKyBwYWRkaW5nLCBpbWcueSArIHBhZGRpbmcpO1xyXG4gICAgICAgICAgICBpZihwYWRkaW5nICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZy5pbWcsIDAsIDAsIDEsIGltZy5oLTIqcGFkZGluZywgaW1nLngsIGltZy55ICsgcGFkZGluZywgcGFkZGluZywgaW1nLmgtMipwYWRkaW5nKTsgLy8gbGVmdFxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCBpbWcudy0yKnBhZGRpbmctMSwgMCwgMSwgaW1nLmgtMipwYWRkaW5nLCBpbWcueCtpbWcudy1wYWRkaW5nLCBpbWcueSArIHBhZGRpbmcsIHBhZGRpbmcsIGltZy5oLTIqcGFkZGluZyk7IC8vIHJpZ2h0XHJcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZy5pbWcsIDAsIDAsIGltZy53LTIqcGFkZGluZywgMSwgaW1nLnggKyBwYWRkaW5nLCBpbWcueSwgaW1nLnctMipwYWRkaW5nLCBwYWRkaW5nKTsgLy8gdG9wXHJcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZy5pbWcsIDAsIGltZy5oLTIqcGFkZGluZy0xLCBpbWcudy0yKnBhZGRpbmcsIDEsIGltZy54ICsgcGFkZGluZywgaW1nLnkraW1nLmgtcGFkZGluZywgaW1nLnctMipwYWRkaW5nLCBwYWRkaW5nKTsgLy8gYm90dG9tXHJcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZy5pbWcsIDAsIDAsIDIsIDIsIGltZy54LCBpbWcueSwgcGFkZGluZywgcGFkZGluZyk7IC8vIHRvcC1sZWZ0XHJcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZy5pbWcsIGltZy53LTIqcGFkZGluZy0yLCAwLCAyLCAyLCBpbWcueCtpbWcudy1wYWRkaW5nLCBpbWcueSwgcGFkZGluZywgcGFkZGluZyk7IC8vIHRvcC1yaWdodFxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCAwLCBpbWcuaC0yKnBhZGRpbmctMiwgMiwgMiwgaW1nLngsIGltZy55K2ltZy5oLXBhZGRpbmcsIHBhZGRpbmcsIHBhZGRpbmcpOyAvLyBib3R0b20tbGVmdFxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCBpbWcudy0yKnBhZGRpbmctMiwgaW1nLmgtMipwYWRkaW5nLTIsIDIsIDIsIGltZy54K2ltZy53LXBhZGRpbmcsIGltZy55K2ltZy5oLXBhZGRpbmcsIHBhZGRpbmcsIHBhZGRpbmcpOyAvLyBib3R0b20tcmlnaHRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbWcueCA9IChpbWcueCArIHBhZGRpbmcpIC8gYXRsYXNTaXplO1xyXG4gICAgICAgICAgICBpbWcueSA9IChpbWcueSArIHBhZGRpbmcpIC8gYXRsYXNTaXplO1xyXG4gICAgICAgICAgICBpbWcudyA9IChpbWcudyAtIDIqcGFkZGluZykgLyBhdGxhc1NpemU7XHJcbiAgICAgICAgICAgIGltZy5oID0gKGltZy5oIC0gMipwYWRkaW5nKSAvIGF0bGFzU2l6ZTtcclxuICAgICAgICAgICAgYm91bmRzW2ltZy5uYW1lXSA9IGltZztcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHVybCA9IGNhbnZhcy50b0RhdGFVUkwoKTtcclxuICAgICAgICBjb25zdCBhdGxhc0ltYWdlID0gYXdhaXQgbmV3IFByb21pc2U8SFRNTEltYWdlRWxlbWVudD4ocmVzID0+IHtcclxuICAgICAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzKGltZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW1nLnNyYyA9IHVybDtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbmV3IFRleHR1cmVBdGxhcyhhdGxhc0ltYWdlLCBib3VuZHMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgQ09MT1IgQ0xBU1MgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGNsYXNzIENvbG9yIHtcclxuICAgIGNvbnN0cnVjdG9yKCk7XHJcbiAgICBjb25zdHJ1Y3RvcihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyKTtcclxuICAgIGNvbnN0cnVjdG9yKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIsIGE6IG51bWJlcik7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb2xvcjogc3RyaW5nIHwgQ29sb3IpO1xyXG4gICAgY29uc3RydWN0b3IoYXJnQT86IG51bWJlciB8IHN0cmluZyB8IENvbG9yLCBhcmdCPzogbnVtYmVyLCBhcmdDPzogbnVtYmVyLCBhcmdEPzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYodHlwZW9mIGFyZ0EgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgbGV0IGNvbXAgPSBhcmdBLnNwbGl0KFwiKFwiKTtcclxuICAgICAgICAgICAgaWYoY29tcC5sZW5ndGggPT0gMClcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgY29uc3RydWN0b3I6IEVtcHR5IHN0cmluZ1wiKTtcclxuICAgICAgICAgICAgaWYoY29tcC5sZW5ndGggPCAyKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciBjb25zdHJ1Y3RvcjogXCIgKyBjb21wWzBdKTtcclxuICAgICAgICAgICAgbGV0IGNzdHJ1Y3QgPSBjb21wWzBdO1xyXG4gICAgICAgICAgICBsZXQgY3BhcmFtID0gY29tcFsxXSEucmVwbGFjZShcIilcIiwgXCJcIik7XHJcbiAgICAgICAgICAgIGlmKGNzdHJ1Y3QgPT09IFwicmdiXCIgfHwgY3N0cnVjdCA9PT0gXCJyZ2JhXCIpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYXJncyA9IGNwYXJhbS5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgICAgICBpZihjYXJncy5sZW5ndGggPCAzIHx8IGNhcmdzLmxlbmd0aCA+IDQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciBhcmd1bWVudCBjb3VudDogXCIgKyBjYXJncy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHIgPSBwYXJzZUludChjYXJnc1swXSEpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGcgPSBwYXJzZUludChjYXJnc1sxXSEpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGIgPSBwYXJzZUludChjYXJnc1syXSEpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGEgPSBjYXJnc1szXSA/IHBhcnNlRmxvYXQoY2FyZ3NbM10hKSA6IDE7XHJcbiAgICAgICAgICAgICAgICBpZihpc05hTihyKSkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciB2YWx1ZTogXCIgKyBjYXJnc1swXSk7XHJcbiAgICAgICAgICAgICAgICBpZihpc05hTihnKSkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciB2YWx1ZTogXCIgKyBjYXJnc1sxXSk7XHJcbiAgICAgICAgICAgICAgICBpZihpc05hTihiKSkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciB2YWx1ZTogXCIgKyBjYXJnc1syXSk7XHJcbiAgICAgICAgICAgICAgICBpZihpc05hTihhKSkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciB2YWx1ZTogXCIgKyBjYXJnc1szXSk7XHJcbiAgICAgICAgICAgICAgICByID0gRU1hdGguY2xhbXAoTWF0aC5yb3VuZChyKSwgMCwgMjU1KTtcclxuICAgICAgICAgICAgICAgIGcgPSBFTWF0aC5jbGFtcChNYXRoLnJvdW5kKGcpLCAwLCAyNTUpO1xyXG4gICAgICAgICAgICAgICAgYiA9IEVNYXRoLmNsYW1wKE1hdGgucm91bmQoYiksIDAsIDI1NSk7XHJcbiAgICAgICAgICAgICAgICBhID0gRU1hdGguY2xhbXAoYSwgMCwgMSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yID0gcjtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2cgPSBnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYiA9IGI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSZ2IgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX291dGRhdGVkSHN2ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmKGNzdHJ1Y3QgPT09IFwiaHN2XCIgfHwgY3N0cnVjdCA9PT0gXCJoc3ZhXCIpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYXJncyA9IGNwYXJhbS5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgICAgICBpZihjYXJncy5sZW5ndGggPCAzIHx8IGNhcmdzLmxlbmd0aCA+IDQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciBhcmd1bWVudCBjb3VudDogXCIgKyBjYXJncy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGg6IG51bWJlcjtcclxuICAgICAgICAgICAgICAgIGlmKGNhcmdzWzBdIS5pbmNsdWRlcyhcInJhZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGggPSBwYXJzZUZsb2F0KGNhcmdzWzBdISkgKiAxODAgLyBNYXRoLlBJO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBoID0gcGFyc2VJbnQoY2FyZ3NbMF0hKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCBzID0gcGFyc2VJbnQoY2FyZ3NbMV0hKTtcclxuICAgICAgICAgICAgICAgIGxldCB2ID0gcGFyc2VJbnQoY2FyZ3NbMl0hKTtcclxuICAgICAgICAgICAgICAgIGxldCBhID0gY2FyZ3NbM10gPyBwYXJzZUludChjYXJnc1szXSEpIDogMTtcclxuICAgICAgICAgICAgICAgIGlmKGlzTmFOKGgpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIHZhbHVlOiBcIiArIGNhcmdzWzBdKTtcclxuICAgICAgICAgICAgICAgIGlmKGlzTmFOKHMpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIHZhbHVlOiBcIiArIGNhcmdzWzFdKTtcclxuICAgICAgICAgICAgICAgIGlmKGlzTmFOKHYpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIHZhbHVlOiBcIiArIGNhcmdzWzJdKTtcclxuICAgICAgICAgICAgICAgIGlmKGlzTmFOKGEpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIHZhbHVlOiBcIiArIGNhcmdzWzNdKTtcclxuICAgICAgICAgICAgICAgIGggPSBFTWF0aC5wbW9kKGgsIDM2MCk7XHJcbiAgICAgICAgICAgICAgICBzID0gRU1hdGguY2xhbXAocywgMCwgMTAwKTtcclxuICAgICAgICAgICAgICAgIHYgPSBFTWF0aC5jbGFtcCh2LCAwLCAxMDApO1xyXG4gICAgICAgICAgICAgICAgYSA9IEVNYXRoLmNsYW1wKGEsIDAsIDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faHVlID0gaDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NhdCA9IHM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92YWwgPSB2O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hID0gYTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX291dGRhdGVkSHN2ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFJnYiA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIGNvbnN0cnVjdG9yOiBcIiArIGNzdHJ1Y3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmKHR5cGVvZiBhcmdBID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgIGlmIChhcmdCID09PSB1bmRlZmluZWQgfHwgYXJnQyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIGNvbnN0cnVjdG9yOiBOb3QgZW5vdWdoIGFyZ3VtZW50c1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9yID0gRU1hdGguY2xhbXAoTWF0aC5yb3VuZChhcmdBKSwgMCwgMjU1KTtcclxuICAgICAgICAgICAgdGhpcy5fZyA9IEVNYXRoLmNsYW1wKE1hdGgucm91bmQoYXJnQiEpLCAwLCAyNTUpO1xyXG4gICAgICAgICAgICB0aGlzLl9iID0gRU1hdGguY2xhbXAoTWF0aC5yb3VuZChhcmdDISksIDAsIDI1NSk7XHJcbiAgICAgICAgICAgIHRoaXMuYSA9IEVNYXRoLmNsYW1wKGFyZ0QgPz8gMSwgMCwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkUmdiID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkSHN2ID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2UgaWYoYXJnQSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3IgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLl9nID0gMDtcclxuICAgICAgICAgICAgdGhpcy5fYiA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuYSA9IDE7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkUmdiID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkSHN2ID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9yID0gYXJnQSEucjtcclxuICAgICAgICAgICAgdGhpcy5fZyA9IGFyZ0EhLmc7XHJcbiAgICAgICAgICAgIHRoaXMuX2IgPSBhcmdBIS5iO1xyXG4gICAgICAgICAgICB0aGlzLmEgPSBhcmdBIS5hO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFJnYiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZEhzdiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uTXV0YXRlPzogKCkgPT4gdm9pZDtcclxuICAgIG11dGF0ZSgpIHtcclxuICAgICAgICBpZih0aGlzLm9uTXV0YXRlKVxyXG4gICAgICAgICAgICB0aGlzLm9uTXV0YXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xvbmUoKTogQ29sb3Ige1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29sb3IodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGRlY2ltYWxUb1JHQihkOiBudW1iZXIpIHtcclxuICAgICAgICBkID0gRU1hdGguY2xhbXAoZCwgMCwgMS0xZS02KTtcclxuICAgICAgICBsZXQgaW5kZXggPSBNYXRoLmZsb29yKGQgKiAxNjc3NzIxNik7XHJcbiAgICAgICAgbGV0IHIgPSAoaW5kZXggPj4gMTYpICYgMHhGRjtcclxuICAgICAgICBsZXQgZyA9IChpbmRleCA+PiA4KSAmIDB4RkY7XHJcbiAgICAgICAgbGV0IGIgPSAoaW5kZXgpICYgMHhGRjtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKHIsIGcsIGIpO1xyXG4gICAgfVxyXG5cclxuICAgIF9vdXRkYXRlZFJnYj86IGJvb2xlYW47XHJcbiAgICBfciA9IDA7XHJcbiAgICAvKipcclxuICAgICAqIChpbnQpIHJlZCB2YWx1ZSBvZiB0aGUgY29sb3IsIDAgLSAyNTUuXHJcbiAgICAqL1xyXG4gICAgc2V0IHIodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHZhbHVlID0gRU1hdGguY2xhbXAoTWF0aC5yb3VuZCh2YWx1ZSksIDAsIDI1NSk7XHJcbiAgICAgICAgaWYodmFsdWUgPT0gdGhpcy5fcilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgdGhpcy5fciA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkSHN2ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IHIoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZ2IoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcjtcclxuICAgIH1cclxuXHJcbiAgICBfZyA9IDA7XHJcbiAgICAvKipcclxuICAgICAqIChpbnQpIGdyZWVuIHZhbHVlIG9mIHRoZSBjb2xvciwgMCAtIDI1NS5cclxuICAgICovXHJcbiAgICBzZXQgZyh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFsdWUgPSBFTWF0aC5jbGFtcChNYXRoLnJvdW5kKHZhbHVlKSwgMCwgMjU1KTtcclxuICAgICAgICBpZih2YWx1ZSA9PSB0aGlzLl9nKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZ2IoKTtcclxuICAgICAgICB0aGlzLl9nID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRIc3YgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgZygpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9nO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBfYiA9IDA7XHJcbiAgICAvKipcclxuICAgICAqIChpbnQpIGJsdWUgdmFsdWUgb2YgdGhlIGNvbG9yLCAwIC0gMjU1LlxyXG4gICAgKi9cclxuICAgIHNldCBiKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB2YWx1ZSA9IEVNYXRoLmNsYW1wKE1hdGgucm91bmQodmFsdWUpLCAwLCAyNTUpO1xyXG4gICAgICAgIGlmKHZhbHVlID09IHRoaXMuX2IpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIHRoaXMuX2IgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZEhzdiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgIH1cclxuICAgIGdldCBiKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2I7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlUmdiKCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkUmdiICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjb25zdCB7X2h1ZTpoLCBfc2F0OnMsIF92YWw6dn0gPSB0aGlzO1xyXG4gICAgICAgIGNvbnN0IGMgPSB2IC8gMTAwICogcyAvIDEwMDtcclxuICAgICAgICBjb25zdCB4ID0gYyAqICgxIC0gTWF0aC5hYnMoKChoIC8gNjApICUgMikgLSAxKSk7XHJcbiAgICAgICAgY29uc3QgbSA9IHYgLyAxMDAgLSBjO1xyXG4gICAgICAgIGxldCBycD0wLCBncD0wLCBicD0wO1xyXG4gICAgICAgIHN3aXRjaChNYXRoLmZsb29yKGggLyA2MCkpIHtcclxuICAgICAgICAgICAgY2FzZSAwOiBycD1jOyBncD14OyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAxOiBycD14OyBncD1jOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAyOiBncD1jOyBicD14OyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAzOiBncD14OyBicD1jOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA0OiBycD14OyBicD1jOyBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDogcnA9YzsgYnA9eDsgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3IgPSBNYXRoLnJvdW5kKChycCArIG0pICogMjU1KTtcclxuICAgICAgICB0aGlzLl9nID0gTWF0aC5yb3VuZCgoZ3AgKyBtKSAqIDI1NSk7XHJcbiAgICAgICAgdGhpcy5fYiA9IE1hdGgucm91bmQoKGJwICsgbSkgKiAyNTUpO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkUmdiID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgX291dGRhdGVkSHN2PzogYm9vbGVhbjtcclxuICAgIF9odWUgPSAwO1xyXG4gICAgLyoqXHJcbiAgICAgKiAoZGVjaW1hbCkgaHVlIG9mIHRoZSBjb2xvciBpbiBkZWdyZWVzLCAwIC0gMzYwLlxyXG4gICAgKi9cclxuICAgIHNldCBodWUodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHZhbHVlID0gRU1hdGgucG1vZCh2YWx1ZSwgMzYwKTtcclxuICAgICAgICBpZih2YWx1ZSA9PSB0aGlzLl9odWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnVwZGF0ZUhzdigpO1xyXG4gICAgICAgIHRoaXMuX2h1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkUmdiID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IGh1ZSgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUhzdigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9odWU7XHJcbiAgICB9XHJcblxyXG4gICAgX3NhdCA9IDA7XHJcbiAgICAvKipcclxuICAgICAqIChkZWNpbWFsKSBzYXR1cmF0aW9uIG9mIHRoZSBjb2xvciwgMCAtIDEwMC5cclxuICAgICovXHJcbiAgICBzZXQgc2F0KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB2YWx1ZSA9IEVNYXRoLmNsYW1wKHZhbHVlLCAwLCAxMDApO1xyXG4gICAgICAgIGlmKHZhbHVlID09IHRoaXMuX3NhdClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudXBkYXRlSHN2KCk7XHJcbiAgICAgICAgdGhpcy5fc2F0ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSZ2IgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgc2F0KCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlSHN2KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NhdDtcclxuICAgIH1cclxuXHJcbiAgICBfdmFsID0gMDtcclxuICAgIC8qKlxyXG4gICAgICogKGRlY2ltYWwpIHZhbHVlL2JyaWdodG5lc3Mgb2YgdGhlIGNvbG9yLCAwIC0gMTAwLlxyXG4gICAgKi9cclxuICAgIHNldCB2YWwodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHZhbHVlID0gRU1hdGguY2xhbXAodmFsdWUsIDAsIDEwMCk7XHJcbiAgICAgICAgaWYodmFsdWUgPT0gdGhpcy5fdmFsKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy51cGRhdGVIc3YoKTtcclxuICAgICAgICB0aGlzLl92YWwgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZFJnYiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgIH1cclxuICAgIGdldCB2YWwoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVIc3YoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUhzdigpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZEhzdiAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgodGhpcy5yLCB0aGlzLmcsIHRoaXMuYik7XHJcbiAgICAgICAgY29uc3QgbWluID0gTWF0aC5taW4odGhpcy5yLCB0aGlzLmcsIHRoaXMuYik7XHJcbiAgICAgICAgY29uc3QgZGVsdGEgPSBtYXggLSBtaW47XHJcbiAgICAgICAgbGV0IGggPSAwO1xyXG4gICAgICAgIGlmKGRlbHRhICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGlmKG1heCA9PT0gdGhpcy5yKSBoID0gNjAgKiAoKCh0aGlzLmcgLSB0aGlzLmIpIC8gZGVsdGEgKyA2KSAlIDYpO1xyXG4gICAgICAgICAgICBlbHNlIGlmKG1heCA9PT0gdGhpcy5nKSBoID0gNjAgKiAoKHRoaXMuYiAtIHRoaXMucikgLyBkZWx0YSArIDIpO1xyXG4gICAgICAgICAgICBlbHNlIGggPSA2MCAqICgodGhpcy5yIC0gdGhpcy5nKSAvIGRlbHRhICsgNCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGggPCAwKSBoICs9IDM2MDtcclxuICAgICAgICBjb25zdCBzID0gbWF4ID09PSAwID8gMCA6IGRlbHRhL21heCoxMDA7XHJcbiAgICAgICAgY29uc3QgdiA9IG1heC8yNTUqMTAwO1xyXG4gICAgICAgIHRoaXMuX2h1ZSA9IGg7XHJcbiAgICAgICAgdGhpcy5fc2F0ID0gcztcclxuICAgICAgICB0aGlzLl92YWwgPSB2O1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkSHN2ID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAoZGVjaW1hbCkgYWxwaGEvb3BhY2l0eSBvZiB0aGUgY29sb3IsIDAgLSAxLlxyXG4gICAgKi9cclxuICAgIGEgPSAxO1xyXG5cclxuICAgIHN0cmljdEVxdWFscyhvdGhlcjogQ29sb3IpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIG90aGVyLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIHRoaXMuX3IgPT0gb3RoZXIuX3JcclxuICAgICAgICAgICAgJiYgdGhpcy5fZyA9PSBvdGhlci5fZ1xyXG4gICAgICAgICAgICAmJiB0aGlzLl9iID09IG90aGVyLl9iXHJcbiAgICAgICAgICAgICYmIHRoaXMuYSA9PSBvdGhlci5hXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIGlzQ2xvc2Uob3RoZXI6IENvbG9yLCBlID0gMWUtNikge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgb3RoZXIudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgRU1hdGguaXNDbG9zZSh0aGlzLl9yLCBvdGhlci5fciwgZSlcclxuICAgICAgICAgICAgJiYgRU1hdGguaXNDbG9zZSh0aGlzLl9nLCBvdGhlci5fZywgZSlcclxuICAgICAgICAgICAgJiYgRU1hdGguaXNDbG9zZSh0aGlzLl9iLCBvdGhlci5fYiwgZSlcclxuICAgICAgICAgICAgJiYgRU1hdGguaXNDbG9zZSh0aGlzLmEsIG90aGVyLmEsIGUpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIHN0cmljdEVxdWFsc1JnYihvdGhlcjogQ29sb3IpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIG90aGVyLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIHRoaXMuX3IgPT0gb3RoZXIuX3JcclxuICAgICAgICAgICAgJiYgdGhpcy5fZyA9PSBvdGhlci5fZ1xyXG4gICAgICAgICAgICAmJiB0aGlzLl9iID09IG90aGVyLl9iXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIGlzQ2xvc2VSZ2Iob3RoZXI6IENvbG9yLCBlID0gMWUtNikge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgb3RoZXIudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgRU1hdGguaXNDbG9zZSh0aGlzLl9yLCBvdGhlci5fciwgZSlcclxuICAgICAgICAgICAgJiYgRU1hdGguaXNDbG9zZSh0aGlzLl9nLCBvdGhlci5fZywgZSlcclxuICAgICAgICAgICAgJiYgRU1hdGguaXNDbG9zZSh0aGlzLl9iLCBvdGhlci5fYiwgZSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgbGVycFJnYmEob3RoZXI6IENvbG9yLCB0OiBudW1iZXIpOiBDb2xvciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sZXJwUmdiYVNlbGYob3RoZXIsIHQpO1xyXG4gICAgfVxyXG4gICAgbGVycFJnYmFTZWxmKG90aGVyOiBDb2xvciwgdDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZ2IoKTtcclxuICAgICAgICBvdGhlci51cGRhdGVSZ2IoKTtcclxuICAgICAgICB0aGlzLl9yID0gRU1hdGgubGVycCh0aGlzLl9yLCBvdGhlci5fciwgdCk7XHJcbiAgICAgICAgdGhpcy5fZyA9IEVNYXRoLmxlcnAodGhpcy5fZywgb3RoZXIuX2csIHQpO1xyXG4gICAgICAgIHRoaXMuX2IgPSBFTWF0aC5sZXJwKHRoaXMuX2IsIG90aGVyLl9iLCB0KTtcclxuICAgICAgICB0aGlzLmEgPSBFTWF0aC5sZXJwKHRoaXMuYSwgb3RoZXIuYSwgdCk7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGxlcnBIc3ZhKG90aGVyOiBDb2xvciwgdDogbnVtYmVyKTogQ29sb3Ige1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubGVycEhzdmFTZWxmKG90aGVyLCB0KTtcclxuICAgIH1cclxuICAgIGxlcnBIc3ZhU2VsZihvdGhlcjogQ29sb3IsIHQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMudXBkYXRlSHN2KCk7XHJcbiAgICAgICAgb3RoZXIudXBkYXRlSHN2KCk7XHJcbiAgICAgICAgdGhpcy5faHVlID0gRU1hdGgubGVycCh0aGlzLl9odWUsIG90aGVyLl9odWUsIHQpO1xyXG4gICAgICAgIHRoaXMuX3NhdCA9IEVNYXRoLmxlcnAodGhpcy5fc2F0LCBvdGhlci5fc2F0LCB0KTtcclxuICAgICAgICB0aGlzLl92YWwgPSBFTWF0aC5sZXJwKHRoaXMuX3ZhbCwgb3RoZXIuX3ZhbCwgdCk7XHJcbiAgICAgICAgdGhpcy5hID0gRU1hdGgubGVycCh0aGlzLmEsIG90aGVyLmEsIHQpO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBnZXRJc0ZvcmVncm91bmRXaGl0ZSh0aHJlc2hvbGQgPSAwLjQyKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZ2IoKTtcclxuICAgICAgICBsZXQge19yOnIsIF9nOmcsIF9iOmJ9ID0gdGhpcztcclxuICAgICAgICByIC89IDI1NTtcclxuICAgICAgICBnIC89IDI1NTtcclxuICAgICAgICBiIC89IDI1NTtcclxuICAgICAgICByID0gKHIgPCAwLjAzOTI4KSA/IChyIC8gMTIuOTIpIDogKCgociArIDAuMDU1KSAvIDEuMDU1KSAqKiAyLjQpXHJcbiAgICAgICAgZyA9IChnIDwgMC4wMzkyOCkgPyAoZyAvIDEyLjkyKSA6ICgoKGcgKyAwLjA1NSkgLyAxLjA1NSkgKiogMi40KVxyXG4gICAgICAgIGIgPSAoYiA8IDAuMDM5MjgpID8gKGIgLyAxMi45MikgOiAoKChiICsgMC4wNTUpIC8gMS4wNTUpICoqIDIuNClcclxuICAgICAgICBsZXQgbCA9IDAuMjEyNiAqIHIgKyAwLjcxNTIgKiBnICsgMC4wNzIyICogYlxyXG4gICAgICAgIHJldHVybiBsIDwgdGhyZXNob2xkO1xyXG4gICAgfVxyXG4gICAgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gYHJnYmEoJHt0aGlzLnJ9LCAke3RoaXMuZ30sICR7dGhpcy5ifSwgJHt0aGlzLmF9KWA7XHJcbiAgICB9XHJcbiAgICB0b1JnYmFBcnJheSgpOiBbcjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlciwgYTogbnVtYmVyXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLnIsIHRoaXMuZywgdGhpcy5iLCB0aGlzLmFdO1xyXG4gICAgfVxyXG4gICAgdG9Ic3ZhQXJyYXkoKTogW2g6IG51bWJlciwgczogbnVtYmVyLCB2OiBudW1iZXIsIGE6IG51bWJlcl0ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy5odWUsIHRoaXMuc2F0LCB0aGlzLnZhbCwgdGhpcy5hXTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgSU5QVVQgQ0xBU1NFUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBLZXlwcmVzc2VzIHtcclxuICAgIHN0YXRpYyBrZXlQcmVzc2VkOiB7W2tleTpzdHJpbmddOiBhbnl9ID0ge307XHJcbiAgICBzdGF0aWMgcHJlc3NlZEtleXM6IFNldDxzdHJpbmc+ID0gbmV3IFNldCgpO1xyXG4gICAgc3RhdGljIGtleURvd25FdmVudCA9IG5ldyBTaWduYWw8W2tleU5hbWU6c3RyaW5nXT4oKTtcclxuICAgIHN0YXRpYyBrZXlVcEV2ZW50ID0gbmV3IFNpZ25hbDxba2V5TmFtZTpzdHJpbmddPigpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24ga2V5ZG93bihrZXk6IHN0cmluZykge1xyXG4gICAgS2V5cHJlc3Nlcy5rZXlQcmVzc2VkW2tleV0gPSB0cnVlO1xyXG4gICAgS2V5cHJlc3Nlcy5wcmVzc2VkS2V5cy5hZGQoa2V5KTtcclxuICAgIEtleXByZXNzZXMua2V5RG93bkV2ZW50LmZpcmUoa2V5KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGtleXVwKGtleTogc3RyaW5nKSB7XHJcbiAgICBkZWxldGUgS2V5cHJlc3Nlcy5rZXlQcmVzc2VkW2tleV07XHJcbiAgICBLZXlwcmVzc2VzLnByZXNzZWRLZXlzLmRlbGV0ZShrZXkpO1xyXG4gICAgS2V5cHJlc3Nlcy5rZXlVcEV2ZW50LmZpcmUoa2V5KTtcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGUgPT4ge1xyXG4gICAgY29uc3Qga2V5ID0gZS5rZXkudG9Mb3dlckNhc2UoKTtcclxuICAgIGtleWRvd24oa2V5KTtcclxufSk7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGUgPT4ge1xyXG4gICAgY29uc3Qga2V5ID0gZS5rZXkudG9Mb3dlckNhc2UoKTtcclxuICAgIGtleXVwKGtleSk7XHJcbn0pO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZSA9PiB7XHJcbiAgICBpZihlLmJ1dHRvbiA9PT0gMCkge1xyXG4gICAgICAgIGtleWRvd24oXCJsbWJcIik7XHJcbiAgICB9IGVsc2UgaWYoZS5idXR0b24gPT09IDEpIHtcclxuICAgICAgICBrZXlkb3duKFwibW1iXCIpO1xyXG4gICAgfSBlbHNlIGlmKGUuYnV0dG9uID09PSAyKSB7XHJcbiAgICAgICAga2V5ZG93bihcInJtYlwiKTtcclxuICAgIH1cclxufSk7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZSA9PiB7XHJcbiAgICBpZihlLmJ1dHRvbiA9PT0gMCkge1xyXG4gICAgICAgIGtleXVwKFwibG1iXCIpO1xyXG4gICAgfSBlbHNlIGlmKGUuYnV0dG9uID09PSAxKSB7XHJcbiAgICAgICAga2V5dXAoXCJtbWJcIik7XHJcbiAgICB9IGVsc2UgaWYoZS5idXR0b24gPT09IDIpIHtcclxuICAgICAgICBrZXl1cChcInJtYlwiKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5leHBvcnQgY2xhc3MgUG9pbnRlckxvY2sge1xyXG4gICAgY29ubmVjdGlvbnMgPSBuZXcgQ29ubmVjdGlvbkdyb3VwKCk7XHJcbiAgICBwb2ludGVyTG9ja0NoYW5nZUV2ZW50OiBTaWduYWw8W2lzTG9ja2VkOiBib29sZWFuXT4gPSBuZXcgU2lnbmFsKCk7XHJcbiAgICBsb2NrZWRNb3VzZU1vdmVFdmVudDogU2lnbmFsPFtkeDogbnVtYmVyLCBkeTogbnVtYmVyXT4gPSBuZXcgU2lnbmFsKCk7XHJcbiAgICBpc0VuYWJsZWQgPSBmYWxzZTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMuYWRkKG5ldyBIdG1sQ29ubmVjdGlvbih3aW5kb3csIFwibW91c2Vkb3duXCIsIChlOiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuaXNFbmFibGVkICYmIGRvY3VtZW50LnBvaW50ZXJMb2NrRWxlbWVudCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlcXVlc3RQb2ludGVyTG9jaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMuYWRkKG5ldyBIdG1sQ29ubmVjdGlvbih3aW5kb3csIFwibW91c2Vtb3ZlXCIsIChlOiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGRvY3VtZW50LnBvaW50ZXJMb2NrRWxlbWVudCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2NrZWRNb3VzZU1vdmVFdmVudC5maXJlKGUubW92ZW1lbnRYLCBlLm1vdmVtZW50WSk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMuYWRkKG5ldyBIdG1sQ29ubmVjdGlvbihkb2N1bWVudCwgXCJwb2ludGVybG9ja2NoYW5nZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRlckxvY2tDaGFuZ2VFdmVudC5maXJlKGRvY3VtZW50LnBvaW50ZXJMb2NrRWxlbWVudCAhPSBudWxsKTtcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcbiAgICBsb2NrKCk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuaXNFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlcXVlc3RQb2ludGVyTG9jaygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgdW5sb2NrKCk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuaXNFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgZG9jdW1lbnQuZXhpdFBvaW50ZXJMb2NrKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByZW1vdmUoKSB7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5kaXNjb25uZWN0QWxsKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIE9CU0VSVkVSIENMQVNTRVMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgY2xhc3MgV2luZG93UmVzaXplT2JzZXJ2ZXIge1xyXG4gICAgcmVzaXplRXZlbnQ6IFNpZ25hbDxbdzogbnVtYmVyLCBoOiBudW1iZXJdPiA9IG5ldyBTaWduYWwoe1xyXG4gICAgICAgIG9uQ29ubmVjdDogY29ubiA9PiBjb25uLmZpcmUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCksXHJcbiAgICB9KTtcclxuICAgIGNvbm5lY3Rpb25zID0gbmV3IENvbm5lY3Rpb25Hcm91cCgpO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5hZGQobmV3IEh0bWxDb25uZWN0aW9uKHdpbmRvdywgXCJyZXNpemVcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlc2l6ZUV2ZW50LmZpcmUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG4gICAgcmVtb3ZlKCkge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMuZGlzY29ubmVjdEFsbCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgUkVOREVSIExPT1AgQ0xBU1MgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGNsYXNzIFJlbmRlckxvb3Age1xyXG4gICAgcmVuZGVyU3RlcHBlZEV2ZW50OiBTaWduYWw8W2R0OiBudW1iZXJdPiA9IG5ldyBTaWduYWwoKTtcclxuICAgIHJ1bkluZGV4ID0gMDtcclxuICAgIGlzUnVubmluZyA9IGZhbHNlO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGNhbGxiYWNrOiAoZHQ6IG51bWJlcikgPT4gdm9pZCkge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICBpZighdGhpcy5pc1J1bm5pbmcpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5ydW5JbmRleCsrO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5pc1J1bm5pbmcpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIHRoaXMuaXNSdW5uaW5nID0gdHJ1ZTtcclxuICAgICAgICBsZXQgcmkgPSB0aGlzLnJ1bkluZGV4O1xyXG4gICAgICAgIGxldCBmcmFtZVRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKS8xMDAwO1xyXG4gICAgICAgIGNvbnN0IHJlbmRlciA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYodGhpcy5ydW5JbmRleCAhPSByaSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKS8xMDAwO1xyXG4gICAgICAgICAgICBsZXQgZHQgPSBub3cgLSBmcmFtZVRpbWU7XHJcbiAgICAgICAgICAgIGZyYW1lVGltZSA9IG5vdztcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJTdGVwcGVkRXZlbnQuZmlyZShkdCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2soZHQpO1xyXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVuZGVyKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBBUlRJRklDSUFMIElOVEVMTElHRU5DRSAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgdHlwZSBMYXllckFjdGl2YXRpb24gPSB7XHJcbiAgICBhY3RpdmF0ZTogKHo6IG51bWJlcikgPT4gbnVtYmVyLFxyXG4gICAgZGFfZHo6ICh6OiBudW1iZXIsIGE6IG51bWJlcikgPT4gbnVtYmVyLFxyXG4gICAgbmFtZTogc3RyaW5nLFxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgU2lnbW9pZEFjdGl2YXRpb246IExheWVyQWN0aXZhdGlvbiA9IHtcclxuICAgIGFjdGl2YXRlOiAoejogbnVtYmVyKSA9PiAxLygxK01hdGguZXhwKC16KSksXHJcbiAgICBkYV9kejogKHo6IG51bWJlciwgYTogbnVtYmVyKSA9PiBhICogKDEgLSBhKSxcclxuICAgIG5hbWU6IFwiU2lnbW9pZFwiLFxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgUmVsdUFjdGl2YXRpb246IExheWVyQWN0aXZhdGlvbiA9IHtcclxuICAgIGFjdGl2YXRlOiAoejogbnVtYmVyKSA9PiBNYXRoLm1heCh6LCAwKSxcclxuICAgIGRhX2R6OiAoejogbnVtYmVyLCBhOiBudW1iZXIpID0+IHogPiAwID8gMSA6IDAsXHJcbiAgICBuYW1lOiBcIlJlTFVcIixcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IExpbmVhckFjdGl2YXRpb246IExheWVyQWN0aXZhdGlvbiA9IHtcclxuICAgIGFjdGl2YXRlOiAoejogbnVtYmVyKSA9PiB6LFxyXG4gICAgZGFfZHo6ICh6OiBudW1iZXIsIGE6IG51bWJlcikgPT4gMSxcclxuICAgIG5hbWU6IFwiTGluZWFyXCIsXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc29mdG1heExheWVyKGxheWVyOiBEZW5zZUxheWVyKSB7XHJcbiAgICBsZXQgbWF4ID0gLUluZmluaXR5O1xyXG4gICAgZm9yKGxldCBpPTA7IGk8bGF5ZXIuc2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgbWF4ID0gTWF0aC5tYXgobWF4LCBsYXllci52YWx1ZXNfeltpXSEpO1xyXG4gICAgfVxyXG4gICAgbGV0IHN1bSA9IDA7XHJcbiAgICBmb3IobGV0IGk9MDsgaTxsYXllci5zaXplOyBpKyspIHtcclxuICAgICAgICBjb25zdCB2ID0gTWF0aC5leHAobGF5ZXIudmFsdWVzX3pbaV0hIC0gbWF4KTtcclxuICAgICAgICBsYXllci52YWx1ZXNfYVtpXSA9IHY7XHJcbiAgICAgICAgc3VtICs9IHY7XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IGk9MDsgaTxsYXllci5zaXplOyBpKyspIHtcclxuICAgICAgICBsYXllci52YWx1ZXNfYVtpXSEgLz0gc3VtO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBMYXllckVycm9yID0ge1xyXG4gICAgZGVycl9kYTogKGxheWVyOiBEZW5zZUxheWVyLCBvdXRwdXQ6IEZsb2F0MzJBcnJheSB8IG51bWJlcltdLCBpOiBudW1iZXIpID0+IG51bWJlcixcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IE1zZUVycm9yOiBMYXllckVycm9yID0ge1xyXG4gICAgZGVycl9kYTogKGxheWVyOiBEZW5zZUxheWVyLCBvdXRwdXQ6IEZsb2F0MzJBcnJheSB8IG51bWJlcltdLCBpOiBudW1iZXIpID0+IHtcclxuICAgICAgICByZXR1cm4gLTIvbGF5ZXIuc2l6ZSAqIChvdXRwdXRbaV0hIC0gbGF5ZXIudmFsdWVzX2FbaV0hKTtcclxuICAgIH0sXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIFdlaWdodFJhbmRvbWl6ZXIgPSB7XHJcbiAgICBnZXQ6IChuSW46IG51bWJlciwgbk91dDogbnVtYmVyKSA9PiBudW1iZXIsXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgWGF2aWVyTm9ybWFsOiBXZWlnaHRSYW5kb21pemVyID0ge1xyXG4gICAgZ2V0OiAobkluOiBudW1iZXIsIG5PdXQ6IG51bWJlcikgPT4ge1xyXG4gICAgICAgIGNvbnN0IHAxID0gTWF0aC5zcXJ0KC0yICogTWF0aC5sb2coTWF0aC5tYXgoTWF0aC5yYW5kb20oKSwgMWUtNykpKTtcclxuICAgICAgICBjb25zdCBwMiA9IE1hdGguY29zKDIgKiBNYXRoLlBJICogTWF0aC5yYW5kb20oKSk7XHJcbiAgICAgICAgY29uc3QgcDMgPSBNYXRoLnNxcnQoMiAvIChuSW4gKyBuT3V0KSk7XHJcbiAgICAgICAgcmV0dXJuIHAxICogcDIgKiBwMztcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBYYXZpZXJVbmlmb3JtOiBXZWlnaHRSYW5kb21pemVyID0ge1xyXG4gICAgZ2V0OiAobkluOiBudW1iZXIsIG5PdXQ6IG51bWJlcikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGxpbWl0ID0gTWF0aC5zcXJ0KDYgLyAobkluICsgbk91dCkpO1xyXG4gICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogKDIgKiBsaW1pdCkgLSBsaW1pdDtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBIZU5vcm1hbDogV2VpZ2h0UmFuZG9taXplciA9IHtcclxuICAgIGdldDogKG5JbjogbnVtYmVyLCBuT3V0OiBudW1iZXIpID0+IHtcclxuICAgICAgICBjb25zdCBwMSA9IE1hdGguc3FydCgtMiAqIE1hdGgubG9nKE1hdGgubWF4KE1hdGgucmFuZG9tKCksIDFlLTcpKSk7XHJcbiAgICAgICAgY29uc3QgcDIgPSBNYXRoLmNvcygyICogTWF0aC5QSSAqIE1hdGgucmFuZG9tKCkpO1xyXG4gICAgICAgIGNvbnN0IHAzID0gTWF0aC5zcXJ0KDIgLyBuSW4pO1xyXG4gICAgICAgIHJldHVybiBwMSAqIHAyICogcDM7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgSGVVbmlmb3JtOiBXZWlnaHRSYW5kb21pemVyID0ge1xyXG4gICAgZ2V0OiAobkluOiBudW1iZXIsIG5PdXQ6IG51bWJlcikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGxpbWl0ID0gTWF0aC5zcXJ0KDYgLyBuSW4pO1xyXG4gICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogKDIgKiBsaW1pdCkgLSBsaW1pdDtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBSYW5kb21Vbmlmb3JtOiBXZWlnaHRSYW5kb21pemVyID0ge1xyXG4gICAgZ2V0OiAobkluOiBudW1iZXIsIG5PdXQ6IG51bWJlcikgPT4ge1xyXG4gICAgICAgIHJldHVybiAoTWF0aC5yYW5kb20oKSAqIDIgLSAxKSAqIDAuMDE7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTGF5ZXJPcHRpbWl6ZXIge1xyXG4gICAgYWJzdHJhY3QgYXBwbHlHcmFkaWVudHMobGVhcm5SYXRlOiBudW1iZXIsIGJhdGNoU2l6ZTogbnVtYmVyLCBjbGVhckdyYWRpZW50czogYm9vbGVhbik6IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTZ2RPcHRpbWl6ZXIgZXh0ZW5kcyBMYXllck9wdGltaXplciB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbGF5ZXI6IERlbnNlTGF5ZXIpIHsgc3VwZXIoKTsgfVxyXG4gICAgYXBwbHlHcmFkaWVudHMobGVhcm5SYXRlOiBudW1iZXIsIGJhdGNoU2l6ZTogbnVtYmVyLCBjbGVhckdyYWRpZW50czogYm9vbGVhbikge1xyXG4gICAgICAgIGNvbnN0IGxheWVyID0gdGhpcy5sYXllcjtcclxuICAgICAgICBjb25zdCBsID0gbGVhcm5SYXRlIC8gYmF0Y2hTaXplO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPGxheWVyLnNpemU7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDsgajxsYXllci5pbnB1dFNpemU7IGorKykge1xyXG4gICAgICAgICAgICAgICAgbGF5ZXIud2VpZ2h0c1tpXSFbal0hIC09IGxheWVyLndlaWdodEdyYWRzW2ldIVtqXSEgKiBsO1xyXG4gICAgICAgICAgICAgICAgaWYoY2xlYXJHcmFkaWVudHMpIGxheWVyLndlaWdodEdyYWRzW2ldIVtqXSEgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxheWVyLmJpYXNlc1tpXSEgLT0gbGF5ZXIuYmlhc0dyYWRzW2ldISAqIGw7XHJcbiAgICAgICAgICAgIGlmKGNsZWFyR3JhZGllbnRzKSBsYXllci5iaWFzR3JhZHNbaV0gPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFkYW1PcHRpbWl6ZXIgZXh0ZW5kcyBMYXllck9wdGltaXplciB7XHJcbiAgICB3ZWlnaHRNOiBGbG9hdDMyQXJyYXlbXTtcclxuICAgIHdlaWdodFY6IEZsb2F0MzJBcnJheVtdO1xyXG4gICAgYmlhc006IEZsb2F0MzJBcnJheTtcclxuICAgIGJpYXNWOiBGbG9hdDMyQXJyYXk7XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwdWJsaWMgbGF5ZXI6IERlbnNlTGF5ZXIsXHJcbiAgICAgICAgcHVibGljIGJldGExID0gMC45LFxyXG4gICAgICAgIHB1YmxpYyBiZXRhMiA9IDAuOTk5LFxyXG4gICAgICAgIHB1YmxpYyBlcHNpbG9uID0gMWUtOCxcclxuICAgICAgICBwdWJsaWMgdCA9IDAsXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMud2VpZ2h0TSA9IFtdO1xyXG4gICAgICAgIHRoaXMud2VpZ2h0ViA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPGxheWVyLnNpemU7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLndlaWdodE0ucHVzaChuZXcgRmxvYXQzMkFycmF5KGxheWVyLmlucHV0U2l6ZSkpO1xyXG4gICAgICAgICAgICB0aGlzLndlaWdodFYucHVzaChuZXcgRmxvYXQzMkFycmF5KGxheWVyLmlucHV0U2l6ZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmJpYXNNID0gbmV3IEZsb2F0MzJBcnJheShsYXllci5zaXplKTtcclxuICAgICAgICB0aGlzLmJpYXNWID0gbmV3IEZsb2F0MzJBcnJheShsYXllci5zaXplKTtcclxuICAgIH1cclxuICAgIGFwcGx5R3JhZGllbnRzKGxlYXJuUmF0ZTogbnVtYmVyLCBiYXRjaFNpemU6IG51bWJlciwgY2xlYXJHcmFkaWVudHM6IGJvb2xlYW4pIHtcclxuICAgICAgICBjb25zdCBsYXllciA9IHRoaXMubGF5ZXI7XHJcbiAgICAgICAgY29uc3QgbHIgPSBsZWFyblJhdGUgLyBiYXRjaFNpemU7XHJcbiAgICAgICAgdGhpcy50Kys7XHJcbiAgICAgICAgY29uc3QgYjEgPSB0aGlzLmJldGExO1xyXG4gICAgICAgIGNvbnN0IGIyID0gdGhpcy5iZXRhMjtcclxuICAgICAgICBjb25zdCBlcHMgPSB0aGlzLmVwc2lsb247XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8bGF5ZXIuc2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdCID0gbGF5ZXIuYmlhc0dyYWRzW2ldITtcclxuICAgICAgICAgICAgdGhpcy5iaWFzTVtpXSA9IGIxICogdGhpcy5iaWFzTVtpXSEgKyAoMSAtIGIxKSAqIGdCO1xyXG4gICAgICAgICAgICB0aGlzLmJpYXNWW2ldID0gYjIgKiB0aGlzLmJpYXNWW2ldISArICgxIC0gYjIpICogZ0IgKiBnQjtcclxuICAgICAgICAgICAgY29uc3QgbUhhdEIgPSB0aGlzLmJpYXNNW2ldISAvICgxIC0gTWF0aC5wb3coYjEsIHRoaXMudCkpO1xyXG4gICAgICAgICAgICBjb25zdCB2SGF0QiA9IHRoaXMuYmlhc1ZbaV0hIC8gKDEgLSBNYXRoLnBvdyhiMiwgdGhpcy50KSk7XHJcbiAgICAgICAgICAgIGxheWVyLmJpYXNlc1tpXSEgLT0gbHIgKiBtSGF0QiAvIChNYXRoLnNxcnQodkhhdEIpICsgZXBzKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaj0wOyBqPGxheWVyLmlucHV0U2l6ZTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBnVyA9IGxheWVyLndlaWdodEdyYWRzW2ldIVtqXSE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlaWdodE1baV0hW2pdID0gYjEgKiB0aGlzLndlaWdodE1baV0hW2pdISArICgxIC0gYjEpICogZ1c7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlaWdodFZbaV0hW2pdID0gYjIgKiB0aGlzLndlaWdodFZbaV0hW2pdISArICgxIC0gYjIpICogZ1cgKiBnVztcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1IYXQgPSB0aGlzLndlaWdodE1baV0hW2pdISAvICgxIC0gTWF0aC5wb3coYjEsIHRoaXMudCkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdkhhdCA9IHRoaXMud2VpZ2h0VltpXSFbal0hIC8gKDEgLSBNYXRoLnBvdyhiMiwgdGhpcy50KSk7XHJcbiAgICAgICAgICAgICAgICBsYXllci53ZWlnaHRzW2ldIVtqXSEgLT0gbHIgKiBtSGF0IC8gKE1hdGguc3FydCh2SGF0KSArIGVwcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBEZW5zZUxheWVyIHtcclxuICAgIHZhbHVlc19hOiBGbG9hdDMyQXJyYXk7XHJcbiAgICB2YWx1ZXNfejogRmxvYXQzMkFycmF5O1xyXG4gICAgZGVycl9kejogRmxvYXQzMkFycmF5O1xyXG4gICAgd2VpZ2h0czogRmxvYXQzMkFycmF5W107XHJcbiAgICB3ZWlnaHRHcmFkczogRmxvYXQzMkFycmF5W107XHJcbiAgICBiaWFzZXM6IEZsb2F0MzJBcnJheTtcclxuICAgIGJpYXNHcmFkczogRmxvYXQzMkFycmF5O1xyXG4gICAgb3B0aW1pemVyOiBMYXllck9wdGltaXplcjtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHB1YmxpYyBpbnB1dFNpemU6IG51bWJlcixcclxuICAgICAgICBwdWJsaWMgc2l6ZTogbnVtYmVyLFxyXG4gICAgICAgIHB1YmxpYyBhY3RpdmF0aW9uT3JPdmVycmlkZTogTGF5ZXJBY3RpdmF0aW9uIHwgXCJzb2Z0bWF4X2Nyb3NzX2VudHJvcHlcIixcclxuICAgICAgICBvcHRpbWl6ZXI/OiBMYXllck9wdGltaXplcixcclxuICAgICAgICB3ZWlnaHRJbml0PzogV2VpZ2h0UmFuZG9taXplclxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZXNfYSA9IG5ldyBGbG9hdDMyQXJyYXkoc2l6ZSk7XHJcbiAgICAgICAgdGhpcy52YWx1ZXNfeiA9IG5ldyBGbG9hdDMyQXJyYXkoc2l6ZSk7XHJcbiAgICAgICAgdGhpcy5kZXJyX2R6ID0gbmV3IEZsb2F0MzJBcnJheShzaXplKTtcclxuICAgICAgICB0aGlzLndlaWdodHMgPSBbXTtcclxuICAgICAgICB0aGlzLndlaWdodEdyYWRzID0gW107XHJcbiAgICAgICAgdGhpcy5iaWFzZXMgPSBuZXcgRmxvYXQzMkFycmF5KHNpemUpO1xyXG4gICAgICAgIHRoaXMuYmlhc0dyYWRzID0gbmV3IEZsb2F0MzJBcnJheShzaXplKTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxzaXplOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy53ZWlnaHRzLnB1c2gobmV3IEZsb2F0MzJBcnJheShpbnB1dFNpemUpKTtcclxuICAgICAgICAgICAgdGhpcy53ZWlnaHRHcmFkcy5wdXNoKG5ldyBGbG9hdDMyQXJyYXkoaW5wdXRTaXplKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmFuZG9taXplV2VpZ2h0cyh3ZWlnaHRJbml0ID8/ICgoYWN0aXZhdGlvbk9yT3ZlcnJpZGUgIT0gXCJzb2Z0bWF4X2Nyb3NzX2VudHJvcHlcIiAmJiBhY3RpdmF0aW9uT3JPdmVycmlkZS5uYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCJyZWx1XCIpID8gSGVOb3JtYWwgOiBYYXZpZXJVbmlmb3JtKSk7XHJcbiAgICAgICAgdGhpcy5vcHRpbWl6ZXIgPSBvcHRpbWl6ZXIgPz8gbmV3IEFkYW1PcHRpbWl6ZXIodGhpcyk7XHJcbiAgICB9XHJcbiAgICByYW5kb21pemVXZWlnaHRzKG1ldGhvZDogV2VpZ2h0UmFuZG9taXplciA9IFhhdmllclVuaWZvcm0pIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnNpemU7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDsgajx0aGlzLmlucHV0U2l6ZTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlaWdodHNbaV0hW2pdID0gbWV0aG9kLmdldCh0aGlzLmlucHV0U2l6ZSwgdGhpcy5zaXplKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvcndhcmQoaW5wdXQ6IERlbnNlTGF5ZXIgfCBGbG9hdDMyQXJyYXkgfCBudW1iZXJbXSkge1xyXG4gICAgICAgIGlmKGlucHV0IGluc3RhbmNlb2YgRGVuc2VMYXllcilcclxuICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC52YWx1ZXNfYTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnNpemU7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgeiA9IHRoaXMuYmlhc2VzW2ldITtcclxuICAgICAgICAgICAgZm9yKGxldCBqPTA7IGo8dGhpcy5pbnB1dFNpemU7IGorKylcclxuICAgICAgICAgICAgICAgIHogKz0gaW5wdXRbal0hICogdGhpcy53ZWlnaHRzW2ldIVtqXSE7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYWN0aXZhdGlvbk9yT3ZlcnJpZGUgIT0gXCJzb2Z0bWF4X2Nyb3NzX2VudHJvcHlcIikge1xyXG4gICAgICAgICAgICAgICAgbGV0IGEgPSB0aGlzLmFjdGl2YXRpb25Pck92ZXJyaWRlLmFjdGl2YXRlKHopO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZXNfYVtpXSA9IGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy52YWx1ZXNfeltpXSA9IHo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuYWN0aXZhdGlvbk9yT3ZlcnJpZGUgPT0gXCJzb2Z0bWF4X2Nyb3NzX2VudHJvcHlcIikge1xyXG4gICAgICAgICAgICBzb2Z0bWF4TGF5ZXIodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2xlYXJHcmFkaWVudHMoKSB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5zaXplOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5iaWFzR3JhZHMhW2ldID0gMDtcclxuICAgICAgICAgICAgZm9yKGxldCBqPTA7IGo8dGhpcy5pbnB1dFNpemU7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWlnaHRHcmFkcyFbaV0hW2pdID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGJhY2t3YXJkVGFyZ2V0KGlucHV0OiBEZW5zZUxheWVyIHwgRmxvYXQzMkFycmF5IHwgbnVtYmVyW10sIG91dHB1dDogRmxvYXQzMkFycmF5IHwgbnVtYmVyW10sIGVycm9yOiBMYXllckVycm9yID0gTXNlRXJyb3IsIGFjY3VtdWxhdGUgPSB0cnVlKSB7XHJcbiAgICAgICAgaWYoaW5wdXQgaW5zdGFuY2VvZiBEZW5zZUxheWVyKVxyXG4gICAgICAgICAgICBpbnB1dCA9IGlucHV0LnZhbHVlc19hO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMuc2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBkZXJyX2R6O1xyXG4gICAgICAgICAgICBpZih0aGlzLmFjdGl2YXRpb25Pck92ZXJyaWRlID09IFwic29mdG1heF9jcm9zc19lbnRyb3B5XCIpIHtcclxuICAgICAgICAgICAgICAgIGRlcnJfZHogPSB0aGlzLnZhbHVlc19hW2ldISAtIG91dHB1dFtpXSE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlcnJfZHpbaV0gPSBkZXJyX2R6O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGVycl9kYSA9IGVycm9yLmRlcnJfZGEodGhpcywgb3V0cHV0LCBpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhX2R6ID0gdGhpcy5hY3RpdmF0aW9uT3JPdmVycmlkZS5kYV9keih0aGlzLnZhbHVlc196W2ldISwgdGhpcy52YWx1ZXNfYVtpXSEpO1xyXG4gICAgICAgICAgICAgICAgZGVycl9keiA9IGRlcnJfZGEgKiBkYV9kejtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVycl9keltpXSA9IGRlcnJfZHo7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yKGxldCBqPTA7IGo8dGhpcy5pbnB1dFNpemU7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZHpfZHdpaiA9IGlucHV0W2pdITtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlcnJfZHdpaiA9IGRlcnJfZHogKiBkel9kd2lqO1xyXG4gICAgICAgICAgICAgICAgaWYoYWNjdW11bGF0ZSkgdGhpcy53ZWlnaHRHcmFkc1tpXSFbal0hICs9IGRlcnJfZHdpajtcclxuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy53ZWlnaHRHcmFkc1tpXSFbal0hID0gZGVycl9kd2lqO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKGFjY3VtdWxhdGUpIHRoaXMuYmlhc0dyYWRzW2ldISArPSBkZXJyX2R6O1xyXG4gICAgICAgICAgICBlbHNlIHRoaXMuYmlhc0dyYWRzW2ldISA9IGRlcnJfZHo7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYmFja3dhcmRMYXllcihpbnB1dDogRGVuc2VMYXllciB8IEZsb2F0MzJBcnJheSB8IG51bWJlcltdLCBvdXRwdXQ6IERlbnNlTGF5ZXIsIGFjY3VtdWxhdGUgPSB0cnVlKSB7XHJcbiAgICAgICAgaWYoaW5wdXQgaW5zdGFuY2VvZiBEZW5zZUxheWVyKVxyXG4gICAgICAgICAgICBpbnB1dCA9IGlucHV0LnZhbHVlc19hO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMuc2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBkZXJyX2RhaSA9IDA7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYWN0aXZhdGlvbk9yT3ZlcnJpZGUgPT0gXCJzb2Z0bWF4X2Nyb3NzX2VudHJvcHlcIilcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCB1c2Ugc29mdG1heC9jcm9zcy1lbnRyb3B5IG9uIGEgaGlkZGVuIGxheWVyXCIpO1xyXG4gICAgICAgICAgICBjb25zdCBkYWlfZHppID0gdGhpcy5hY3RpdmF0aW9uT3JPdmVycmlkZS5kYV9keih0aGlzLnZhbHVlc196W2ldISwgdGhpcy52YWx1ZXNfYVtpXSEpO1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDsgajxvdXRwdXQuc2l6ZTsgaisrKVxyXG4gICAgICAgICAgICAgICAgZGVycl9kYWkgKz0gb3V0cHV0LmRlcnJfZHpbal0hICogb3V0cHV0LndlaWdodHNbal0hW2ldITtcclxuICAgICAgICAgICAgY29uc3QgZGVycl9keiA9IGRlcnJfZGFpICogZGFpX2R6aVxyXG4gICAgICAgICAgICB0aGlzLmRlcnJfZHpbaV0gPSBkZXJyX2R6O1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDsgajx0aGlzLmlucHV0U2l6ZTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkel9kd2lqID0gaW5wdXRbal0hO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGVycl9kd2lqID0gZGVycl9keiAqIGR6X2R3aWo7XHJcbiAgICAgICAgICAgICAgICBpZihhY2N1bXVsYXRlKSB0aGlzLndlaWdodEdyYWRzW2ldIVtqXSEgKz0gZGVycl9kd2lqO1xyXG4gICAgICAgICAgICAgICAgZWxzZSB0aGlzLndlaWdodEdyYWRzW2ldIVtqXSEgPSBkZXJyX2R3aWo7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoYWNjdW11bGF0ZSkgdGhpcy5iaWFzR3JhZHNbaV0hICs9IGRlcnJfZHo7XHJcbiAgICAgICAgICAgIGVsc2UgdGhpcy5iaWFzR3JhZHNbaV0hID0gZGVycl9kejtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhcHBseUdyYWRpZW50cyhsZWFyblJhdGU6IG51bWJlciwgYmF0Y2hTaXplOiBudW1iZXIsIGNsZWFyR3JhZGllbnRzID0gdHJ1ZSkge1xyXG4gICAgICAgIHRoaXMub3B0aW1pemVyLmFwcGx5R3JhZGllbnRzKGxlYXJuUmF0ZSwgYmF0Y2hTaXplLCBjbGVhckdyYWRpZW50cyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBEZW5zZU5ldHdvcmsge1xyXG4gICAgcHVibGljIGxheWVyczogRGVuc2VMYXllcltdID0gW107XHJcbiAgICBpbnB1dDogRmxvYXQzMkFycmF5O1xyXG4gICAgYmF0Y2hlcyA9IDA7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaW5wdXRTaXplOiBudW1iZXIsIGxheWVyczogW3NpemU6IG51bWJlciwgYWN0aXZhdGlvbjogTGF5ZXJBY3RpdmF0aW9uLCBvcHRpbWl6ZXI/OiBMYXllck9wdGltaXplciwgd2VpZ2h0SW5pdD86IFdlaWdodFJhbmRvbWl6ZXJdW10pIHtcclxuICAgICAgICB0aGlzLmlucHV0ID0gbmV3IEZsb2F0MzJBcnJheShpbnB1dFNpemUpO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPGxheWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgbGF5ZXIgPSBuZXcgRGVuc2VMYXllcihpPT0wID8gaW5wdXRTaXplIDogbGF5ZXJzW2ktMV0hWzBdLCBsYXllcnNbaV0hWzBdLCBsYXllcnNbaV0hWzFdLCBsYXllcnNbaV0hWzJdLCBsYXllcnNbaV0hWzNdKTtcclxuICAgICAgICAgICAgdGhpcy5sYXllcnMucHVzaChsYXllcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yd2FyZCh2YWx1ZXM/OiBGbG9hdDMyQXJyYXkgfCBudW1iZXJbXSkge1xyXG4gICAgICAgIGxldCBpbnB1dDogRGVuc2VMYXllciB8IEZsb2F0MzJBcnJheSA9IHRoaXMuaW5wdXQ7XHJcbiAgICAgICAgaWYodmFsdWVzKSB0aGlzLmlucHV0LnNldCh2YWx1ZXMpO1xyXG4gICAgICAgIGZvcihjb25zdCBsYXllciBvZiB0aGlzLmxheWVycykge1xyXG4gICAgICAgICAgICBsYXllci5mb3J3YXJkKGlucHV0KTtcclxuICAgICAgICAgICAgaW5wdXQgPSBsYXllcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBiYWNrd2FyZChvdXRwdXQ6IEZsb2F0MzJBcnJheSB8IG51bWJlcltdLCBlcnJvcjogTGF5ZXJFcnJvciA9IE1zZUVycm9yKSB7XHJcbiAgICAgICAgZm9yKGxldCBpPXRoaXMubGF5ZXJzLmxlbmd0aC0xOyBpPj0wOyBpLS0pIHtcclxuICAgICAgICAgICAgY29uc3QgbGF5ZXIgPSB0aGlzLmxheWVyc1tpXSE7XHJcbiAgICAgICAgICAgIGNvbnN0IHByZXZMYXllciA9IGkgPT0gMCA/IHRoaXMuaW5wdXQgOiB0aGlzLmxheWVyc1tpLTFdITtcclxuICAgICAgICAgICAgaWYoaSA9PSB0aGlzLmxheWVycy5sZW5ndGgtMSkge1xyXG4gICAgICAgICAgICAgICAgbGF5ZXIuYmFja3dhcmRUYXJnZXQocHJldkxheWVyLCBvdXRwdXQsIGVycm9yLCB0cnVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxheWVyLmJhY2t3YXJkTGF5ZXIocHJldkxheWVyLCB0aGlzLmxheWVyc1tpKzFdISwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5iYXRjaGVzKys7XHJcbiAgICB9XHJcbiAgICBhcHBseUdyYWRpZW50KGxlYXJuUmF0ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgZm9yKGNvbnN0IGxheWVyIG9mIHRoaXMubGF5ZXJzKSB7XHJcbiAgICAgICAgICAgIGxheWVyLmFwcGx5R3JhZGllbnRzKGxlYXJuUmF0ZSwgdGhpcy5iYXRjaGVzLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5iYXRjaGVzID0gMDtcclxuICAgIH1cclxufSJdfQ==