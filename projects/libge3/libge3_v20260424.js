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
///////////////////
//  UI ELEMENTS  //
///////////////////
export class HorizontalSlider {
    containerEl;
    handleEl;
    valueEl;
    dragConnections = new ConnectionGroup();
    inputEvent = new Signal({ onConnect: (conn) => { conn.fire(this.value); } });
    constructor(min, max, step, value = (min + max) / 2) {
        this.containerEl = document.createElement("div");
        document.body.appendChild(this.containerEl);
        this.containerEl.style = `width:150px;height:14px;position:relative;
        border:2px solid white;cursor:pointer;border-radius:4px;
        outline:2px solid black;background-color:rgb(20,20,20);
        margin:2px;`;
        this.valueEl = document.createElement("button");
        this.valueEl.style = `border:none;padding:0px;width:100%;height:100%;
        position:absolute;left:0;top:0;background-color:rgb(142, 187, 255);
        cursor:pointer;border-radius:2px;`;
        this.containerEl.appendChild(this.valueEl);
        this.handleEl = document.createElement("button");
        this.handleEl.style = `width:20px;height:20px;position:absolute;
        left:100%;top:50%;transform:translate(-50%,-50%);
        background-color:rgb(142, 187, 255);border:2px solid white;
        cursor:pointer;border-radius:50%;outline:2px solid black;`;
        this.valueEl.appendChild(this.handleEl);
        this.containerEl.addEventListener("mousedown", e => {
            if (e.target == this.handleEl)
                return;
            const update = (e) => {
                let rect = this.containerEl.getBoundingClientRect();
                let t = (e.clientX - rect.left) / rect.width;
                this.value = t * (this.max - this.min) + this.min;
                this.inputEvent.fire(this.value);
            };
            update(e);
            this.dragConnections.add(new HtmlConnection(window, "mousemove", update));
            this.dragConnections.add(new HtmlConnection(window, "mouseup", e => {
                this.dragConnections.disconnectAll();
            }));
        });
        this.handleEl.addEventListener("mousedown", e => {
            let x0 = e.clientX;
            let v0 = this.value;
            this.dragConnections.add(new HtmlConnection(window, "mousemove", e => {
                let dt = (e.clientX - x0) / this.containerEl.offsetWidth;
                this.value = v0 + dt * (this.max - this.min) + this.min;
                this.inputEvent.fire(this.value);
            }));
            this.dragConnections.add(new HtmlConnection(window, "mouseup", e => {
                this.dragConnections.disconnectAll();
            }));
        });
        this.min = min;
        this.max = max;
        this.step = step;
        this.value = value;
    }
    _value = 0;
    _width = 0;
    _widthLerp = 0;
    _isAnimating = false;
    get value() { return this._value; }
    set value(value) {
        if (this._value === value)
            return;
        this._value = value;
        this.updateValueClamp();
        this.updateValueStyle();
    }
    updateValueClamp() {
        this._value = Math.floor(this._value / this._step) * this._step;
        this._value = EMath.clamp(this._value, this._min, this._max);
    }
    updateValueStyle() {
        let t = (this._value - this._min) / (this._max - this._min);
        t = EMath.clamp(t, 0, 1);
        this._width = t;
        this.updateValueAnimation();
    }
    updateValueAnimation() {
        if (this._isAnimating)
            return;
        let frameTime = performance.now();
        let update = () => {
            let now = performance.now();
            let deltaTime = (now - frameTime) / 1000;
            frameTime = now;
            this._widthLerp += Math.sign(this._width - this._widthLerp) * deltaTime * 1;
            this._widthLerp = EMath.lerp(this._widthLerp, this._width, deltaTime * 10);
            let dist = Math.abs(this._width - this._widthLerp);
            if (dist < deltaTime * 2 || dist > 10 || isNaN(this._widthLerp)) {
                this._widthLerp = this._width;
                this.valueEl.style.width = `${this._widthLerp * 100}%`;
                this._isAnimating = false;
                return;
            }
            this.valueEl.style.width = `${this._widthLerp * 100}%`;
            requestAnimationFrame(update);
        };
        this._isAnimating = true;
        update();
    }
    _min = 0;
    get min() { return this._min; }
    set min(value) {
        if (this._min === value)
            return;
        this._min = value;
        this.updateValueClamp();
        this.updateValueStyle();
    }
    _max = 0;
    get max() { return this._max; }
    set max(value) {
        if (this._max === value)
            return;
        this._max = value;
        this.updateValueClamp();
        this.updateValueStyle();
    }
    _step = 0;
    get step() { return this._step; }
    set step(value) {
        if (this._step === value)
            return;
        this._step = value;
        this.updateValueClamp();
        this.updateValueStyle();
    }
}
export class Checkbox {
    containerEl;
    svgEl;
    inputEvent = new Signal({ onConnect: (conn) => { conn.fire(this.isChecked); } });
    constructor(value = false) {
        this.containerEl = document.createElement("div");
        this.containerEl.style = `width:16px;height:16px;background-color:white;outline:2px solid black;
        border:2px solid white;cursor:pointer;color:white;display:flex;user-select:none;
        justify-content:center;align-items:center;border-radius:2px;margin:2px;`;
        document.body.appendChild(this.containerEl);
        this.containerEl.addEventListener("mousedown", e => {
            this.isChecked = !this.isChecked;
            this.inputEvent.fire(this.isChecked);
        });
        this.containerEl.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -4 7 7" style="width:60%;height:60%;pointer-events:none;">
                <path d="M 0 0 L 1 -1 L 2 1 L 6 -4 L 7 -3 L 2 3 Z" fill="currentColor"/>
            </svg>
        `;
        this.svgEl = this.containerEl.querySelector("svg");
        this.isChecked = value;
    }
    _isChecked = false;
    get isChecked() { return this._isChecked; }
    set isChecked(value) {
        this._isChecked = value;
        this.updateCheckedStyle();
    }
    updateCheckedStyle() {
        if (this._isChecked) {
            this.svgEl.style.display = "block";
            this.svgEl.animate([
                { scale: "0" },
                { scale: "1" },
            ], { duration: 100 });
            this.containerEl.animate([
                { backgroundColor: "rgb(200, 200, 200)" },
                { backgroundColor: "rgb(142, 187, 255)" },
            ], { duration: 100 });
            this.containerEl.style.backgroundColor = "rgb(142, 187, 255)";
        }
        else {
            this.svgEl.style.display = "none";
            this.containerEl.animate([
                { backgroundColor: "rgb(142, 187, 255)" },
                { backgroundColor: "rgb(200, 200, 200)" },
            ], { duration: 100 });
            this.containerEl.style.backgroundColor = "rgb(200, 200, 200)";
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGliZ2UzX3YyMDI2MDQyNC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpYmdlM192MjAyNjA0MjQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQStCO0FBQy9CLG1DQUFtQztBQUVuQyxxQkFBcUI7QUFDckIsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsRUFBVSxFQUFFLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUU3RSxtQkFBbUI7QUFDbkIsbUJBQW1CO0FBQ25CLG1CQUFtQjtBQUNuQixNQUFNLE9BQWdCLEtBQUs7SUFDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFTLEVBQUMsQ0FBUyxFQUFDLENBQVM7UUFDdEMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQVMsRUFBQyxDQUFTLEVBQUMsQ0FBUztRQUNyQyxPQUFPLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBUyxFQUFDLENBQVM7UUFDM0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLElBQVksSUFBSTtRQUNqRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxD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QyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUNELFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDcEMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFTO1FBQ1YsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFDRCxRQUFRLENBQUMsQ0FBUztRQUNkLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxJQUFJLENBQUMsS0FBVztRQUNaLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBQ0QsUUFBUSxDQUFDLEtBQVc7UUFDaEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELEtBQUssQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDakMsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFDRCxTQUFTLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQ3JDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxLQUFLLENBQUMsQ0FBUztRQUNYLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBQ0QsU0FBUyxDQUFDLENBQVM7UUFDZixJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsR0FBRztRQUNDLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBQ0QsT0FBTztRQUNILElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxJQUFJLENBQUMsS0FBVyxFQUFFLENBQVM7UUFDdkIsT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBQ0QsUUFBUSxDQUFDLEtBQVcsRUFBRSxDQUFTO1FBQzNCLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxLQUFLLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUM1QyxPQUFPLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUNELFNBQVMsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQ2hELElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxJQUFJO1FBQ0EsT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUNELFFBQVE7UUFDSixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDMUIsSUFBRyxHQUFHLEtBQUssQ0FBQztZQUNSLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFDRCxPQUFPLENBQUMsR0FBVztRQUNmLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBQ0QsV0FBVyxDQUFDLEdBQVc7UUFDbkIsT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUNELElBQUksQ0FBQyxLQUFXO1FBQ1osT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFDRCxRQUFRLENBQUMsS0FBVztRQUNoQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDM0MsQ0FBQztJQUNELFdBQVcsQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUM1QixPQUFPLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDRCxlQUFlLENBQUMsQ0FBUyxFQUFFLENBQVM7UUFDaEMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFDRCxJQUFJO1FBQ0EsT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUNELFFBQVE7UUFDSixJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxRQUFRO1FBQ0osT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUNELFlBQVk7UUFDUixPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQVcsRUFBRSxNQUFjO1FBQzlCLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUNELFVBQVUsQ0FBQyxLQUFXLEVBQUUsTUFBYztRQUNsQyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLElBQUcsQ0FBQyxLQUFLLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQztRQUN4QixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBQ0QsT0FBTyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLE1BQWM7UUFDbkQsT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFDRCxXQUFXLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsTUFBYztRQUN2RCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUMsQ0FBQyxHQUFHLENBQUMsR0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQztRQUMxQixJQUFHLENBQUMsS0FBSyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFDeEIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFDRCxHQUFHLENBQUMsTUFBd0M7UUFDeEMsT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFDRCxPQUFPLENBQUMsTUFBd0M7UUFDNUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFTO1FBQ1YsT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFDRCxRQUFRLENBQUMsQ0FBUztRQUNkLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxJQUFJLENBQUMsQ0FBUztRQUNWLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBQ0QsUUFBUSxDQUFDLENBQVM7UUFDZCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDWixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsSUFBSSxDQUFDLENBQVM7UUFDVixPQUFPLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUNELFFBQVEsQ0FBQyxDQUFTO1FBQ2QsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1osSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELE9BQU8sQ0FBQyxJQUFVLEVBQUUsS0FBYTtRQUM3QixPQUFPLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFDRCxXQUFXLENBQUMsSUFBVSxFQUFFLEtBQWE7UUFDakMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuQixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9DLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxNQUFNLENBQUMsR0FBUztRQUNaLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBQ0QsVUFBVSxDQUFDLEdBQVM7UUFDaEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUNELE9BQU8sQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDbkMsT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUNELFdBQVcsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDdkMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUNELE1BQU0sQ0FBQyxHQUFTO1FBQ1osT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFDRCxVQUFVLENBQUMsR0FBUztRQUNoQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBQ0QsT0FBTyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUNuQyxPQUFPLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBQ0QsV0FBVyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUN2QyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRCxDQUFDO0NBQ0o7QUFFRCxNQUFNLE9BQU8sSUFBSTtJQUdiLFlBQVksQ0FBZ0MsRUFBRSxDQUFVO1FBQ3BELElBQUcsT0FBTyxDQUFDLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLENBQUM7YUFBTSxDQUFDO1lBQ0osSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDWixJQUFJLENBQUMsRUFBRSxHQUFHLENBQVcsQ0FBQztRQUMxQixDQUFDO0lBQ0wsQ0FBQztJQUVELEVBQUUsQ0FBUztJQUNYLElBQUksQ0FBQyxLQUFLLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDM0IsSUFBSSxDQUFDLENBQUMsS0FBYTtRQUNmLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBQ0QsRUFBRSxDQUFTO0lBQ1gsSUFBSSxDQUFDLEtBQUssT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMzQixJQUFJLENBQUMsQ0FBQyxLQUFhO1FBQ2YsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUM7UUFDaEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFDRCxRQUFRLENBQWM7SUFFdEIsTUFBTTtRQUNGLElBQUcsSUFBSSxDQUFDLFFBQVE7WUFDWixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELHNCQUFzQjtJQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDLENBQVMsSUFBVSxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkQsTUFBTSxDQUFDLElBQUksS0FBVyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVDLE1BQU0sQ0FBQyxHQUFHLEtBQVcsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQyxNQUFNLENBQUMsS0FBSyxLQUFXLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQyxNQUFNLENBQUMsS0FBSyxLQUFXLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQyxNQUFNLENBQUMsTUFBTTtRQUNULE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUN0QyxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsSUFBSSxDQUFDLENBQVM7UUFDVixRQUFPLENBQUMsRUFBRSxDQUFDO1lBQ1AsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDdkIsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDM0IsQ0FBQztRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFDRCxJQUFJLENBQUMsQ0FBUyxFQUFFLENBQVM7UUFDckIsUUFBTyxDQUFDLEVBQUUsQ0FBQztZQUNQLEtBQUssQ0FBQztnQkFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFBQyxPQUFPO1lBQzVCLEtBQUssQ0FBQztnQkFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFBQyxPQUFPO1FBQ2hDLENBQUM7UUFDRCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUNELEdBQUcsQ0FBQyxLQUFXO1FBQ1gsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsSUFBSSxDQUFDLENBQVMsRUFBRSxDQUFTO1FBQ3JCLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1osSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDWixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDZCxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDZCxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUNELFFBQVE7UUFDSixPQUFPLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUM1RCxDQUFDO0lBQ0QsT0FBTztRQUNILE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBQ0QsS0FBSztRQUNELE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELGVBQWU7SUFDZixNQUFNO1FBQ0YsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ0QsUUFBUTtRQUNKLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBQ0QsR0FBRyxDQUFDLEtBQVc7UUFDWCxPQUFPLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUM7SUFDbkQsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUNyQixPQUFPLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxPQUFPLENBQUMsS0FBVztRQUNmLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDekMsSUFBRyxDQUFDLEtBQUssQ0FBQztZQUNOLE9BQU8sQ0FBQyxDQUFDO1FBQ2IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBQ0QsYUFBYSxDQUFDLEtBQVc7UUFDckIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFDRCxNQUFNLENBQUMsS0FBVztRQUNkLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBQ0QsT0FBTyxDQUFDLENBQVMsRUFBRSxDQUFTO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUNELFFBQVEsQ0FBQyxLQUFXO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBQ0QsU0FBUyxDQUFDLENBQVMsRUFBRSxDQUFTO1FBQzFCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUNELFlBQVksQ0FBQyxLQUFXO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQztJQUN0RCxDQUFDO0lBQ0QsT0FBTyxDQUFDLEtBQVcsRUFBRSxDQUFDLEdBQUcsSUFBSTtRQUN6QixPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7SUFDRCxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUk7UUFDWCxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUNELEtBQUs7UUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELGFBQWE7SUFDYixHQUFHLENBQUMsS0FBVztRQUNYLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFDRCxPQUFPLENBQUMsS0FBVztRQUNmLElBQUksQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUNyQixPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUNELFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUN6QixJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFTO1FBQ1YsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDRCxRQUFRLENBQUMsQ0FBUztRQUNkLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsU0FBUyxDQUFDLEtBQVcsRUFBRSxDQUFTO1FBQzVCLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUNELGFBQWEsQ0FBQyxLQUFXLEVBQUUsQ0FBUztRQUNoQyxJQUFJLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELFVBQVUsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDdEMsT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUNELGNBQWMsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDMUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsR0FBRyxDQUFDLEtBQVc7UUFDWCxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBQ0QsT0FBTyxDQUFDLEtBQVc7UUFDZixJQUFJLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxJQUFJLENBQUMsQ0FBUyxFQUFFLENBQVM7UUFDckIsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDRCxRQUFRLENBQUMsQ0FBUyxFQUFFLENBQVM7UUFDekIsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxJQUFJLENBQUMsQ0FBUztRQUNWLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQ0QsUUFBUSxDQUFDLENBQVM7UUFDZCxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxLQUFXO1FBQ1osT0FBTyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUNELFFBQVEsQ0FBQyxLQUFXO1FBQ2hCLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxLQUFLLENBQUMsQ0FBUyxFQUFFLENBQVM7UUFDdEIsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDRCxTQUFTLENBQUMsQ0FBUyxFQUFFLENBQVM7UUFDMUIsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxLQUFLLENBQUMsQ0FBUztRQUNYLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQ0QsU0FBUyxDQUFDLENBQVM7UUFDZixJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDdEIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELEdBQUcsQ0FBQyxLQUFXO1FBQ1gsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUNELE9BQU8sQ0FBQyxLQUFXO1FBQ2YsSUFBSSxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsSUFBSSxDQUFDLENBQVMsRUFBRSxDQUFTO1FBQ3JCLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQ0QsUUFBUSxDQUFDLENBQVMsRUFBRSxDQUFTO1FBQ3pCLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsSUFBSSxDQUFDLENBQVM7UUFDVixPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUNELFFBQVEsQ0FBQyxDQUFTO1FBQ2QsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxHQUFHLENBQUMsS0FBVztRQUNYLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFDRCxPQUFPLENBQUMsS0FBVztRQUNmLElBQUksQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUNyQixPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUNELFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUN6QixJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFTO1FBQ1YsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDRCxRQUFRLENBQUMsQ0FBUztRQUNkLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsSUFBSSxDQUFDLEtBQVc7UUFDWixPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBQ0QsUUFBUSxDQUFDLEtBQVc7UUFDaEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDN0IsSUFB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RSxDQUFDO1lBQ1YsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztTQUNiLENBQUM7SUFDTixDQUFDO0lBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDNUMsT0FBTztZQUNILENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDVixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ1YsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNWLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDYixDQUFDO0lBQ04sQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQ3hDLE9BQU87WUFDSCxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ1YsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNWLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDVixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1NBQ2IsQ0FBQztJQUNOLENBQUM7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQVM7UUFDcEIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE9BQU87WUFDSCxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ1YsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNWLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNYLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDYixDQUFDO0lBQ04sQ0FBQztJQUNELE1BQU0sQ0FB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Q0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlFLE1BQU0sR0FBRyxHQUFHLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlFLE1BQU0sR0FBRyxHQUFHLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM5QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM5QixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMzQixPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFDRCxNQUFNLENBQUMseUJBQXlCLENBQUMsS0FBSyxHQUFHLEVBQUU7UUFDdkMsTUFBTSxTQUFTLEdBQVcsRUFBRSxDQUFDO1FBQzdCLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxLQUFLLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN0QixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLE1BQU0sS0FBSyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFDbkIsQ0FBQyxFQUNELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUN0QixDQUFDLENBQUM7UUFDUCxDQUFDO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUNELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxJQUFZLEVBQUUsU0FBaUI7UUFDdkYsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBRSxDQUFDO0lBQzFGLENBQUM7SUFDRCxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsSUFBWSxFQUFFLFNBQWlCO1FBQ3RGLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoRSxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ3hCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsTUFBTSxFQUFFLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pELE1BQU0sRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sSUFBSSxHQUFHLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDNUUsTUFBTSxJQUFJLEdBQUcsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNGLE1BQU0sSUFBSSxHQUFHLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRixNQUFNLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0YsTUFBTSxJQUFJLEdBQUcsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNGLE1BQU0sSUFBSSxHQUFHLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRixNQUFNLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0YsTUFBTSxJQUFJLEdBQUcsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdB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QUFRLEdBQVIsUUFBUSxDQUFNO0lBRWpDLENBQUM7SUFDRCxZQUFZLENBQUMsSUFBWTtRQUNyQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDM0IsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFDRCxnQkFBZ0IsQ0FBQyxJQUFZO1FBQ3pCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMzQixJQUFJLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFFLElBQUcsUUFBUSxFQUFFLENBQUM7WUFDVixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNqRyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xHLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3ZHLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDeEcsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNqQixJQUFHLEVBQUUsR0FBRyxPQUFPLEVBQUUsQ0FBQztnQkFBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7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Q0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2SSxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkksSUFBSSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RCxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDakIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3pCLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxhQUFh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b0I7UUFDbkQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQWlCLENBQUM7UUFDdEMsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQWUsQ0FBQztRQUNuQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDM0IsSUFBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTTtZQUN6RixPQUFPO1FBQ1gsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDakcsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsRyxJQUFJLEVB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QyxDQUFDLENBQUM7UUFDdkksSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZJLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2SSxJQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDekIsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLGFBQWEsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ2hDLElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzNDLElBQUcsR0FBRyxLQUFLLFNBQVM7Z0JBQ2hCLE9BQU8sR0FBRyxDQUFDO1lBQ2YsSUFBRyxLQUFLLEdBQUcsS0FBSyxFQUFFLENBQUM7Z0JBQ2YsSUFBRyxLQUFLLEdBQUcsS0FBSyxFQUFFLENBQUM7b0JBQ2YsUUFBUSxHQUFHLEtBQUssQ0FBQztvQkFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUMzQixLQUFLLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDckIsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixDQUFDO3FCQUFNLENBQUM7b0JBQ0osUUFBUSxHQUFHLEtBQUssQ0FBQztvQkFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzQixLQUFLLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDckIsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixDQUFDO1lBQ0wsQ0FBQztpQkFBTSxDQUFDO2dCQUNKLElBQUcsS0FBSyxHQUFHLEtBQUssRUFBRSxDQUFDO29CQUNmLFFBQVEsR0FBRyxLQUFLLENBQUM7b0JBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDM0IsS0FBSyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsQ0FBQztxQkFBTSxDQUFDO29CQUNKLFFBQVEsR0FBRyxLQUFLLENBQUM7b0JBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0IsS0FBSyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUNELFVBQVUsQ0FBQyxNQUFjO1FBQ3JCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDOUQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDMUQsSUFBSSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDL0QsSUFBSSxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDM0QsSUFBRyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQztRQUNqRCxJQUFHLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQztZQUNkLElBQUksR0FBRyxLQUFLLENBQUM7WUFDYixNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUNELElBQUcsS0FBSyxHQUFHLElBQUk7WUFBRSxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQzlCLElBQUksS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQy9ELElBQUksS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENB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QUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU87Z0JBQzNHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUTtnQkFDMUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU07Z0JBQzFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxHQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUztnQkFDM0ksR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsV0FBVztnQkFDL0UsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLFlBQVk7Z0JBQzlHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxjQUFjO2dCQUNoSCxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxHQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLE9B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QUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUUsSUFBSSxFQUFFLEdBQUcsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUMxRCxLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNuQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsQ0FBRSxDQUFDO2dCQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsQ0FBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDaEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO2dCQUNyRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsQ0FBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsQ0FBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUks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RyxFQUFDO2FBQ2QsRUFBRSxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO2dCQUNyQixFQUFDLGVBQWUsRUFBQyxvQkFBb0IsRUFBQztnQkFDdEMsRUFBQyxlQUFlLEVBQUMsb0JBQW9CLEVBQUM7YUFDekMsRUFBRSxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxvQkFBb0IsQ0FBQztRQUNsRSxDQUFDO2FBQU0sQ0FBQztZQUNKLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDbEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUM7Z0JBQ3JCLEVBQUMsZUFBZSxFQUFDLG9CQUFvQixFQUFDO2dCQUN0QyxFQUFDLGVBQWUsRUFBQyxvQkFBb0IsRUFBQzthQUN6QyxFQUFFLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLG9CQUFvQixDQUFDO1FBQ2xFLENBQUM7SUFDTCxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAzRC8yRCBKUyBHYW1lIEVuZ2luZSBMaWJyYXJ5XHJcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zbGxlbmRlcmJyaW5lXHJcblxyXG4vLyAgREVMQVkgVVRJTElUWSAgLy9cclxuZXhwb3J0IGNvbnN0IGRlbGF5ID0gKG1zOiBudW1iZXIpID0+IG5ldyBQcm9taXNlKHJlcyA9PiBzZXRUaW1lb3V0KHJlcywgbXMpKTtcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIEVNQVRIIENMQVNTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFTWF0aCB7XHJcbiAgICBzdGF0aWMgY2xhbXAobjogbnVtYmVyLGE6IG51bWJlcixiOiBudW1iZXIpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobixhKSxiKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBsZXJwKGE6IG51bWJlcixiOiBudW1iZXIsdDogbnVtYmVyKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIGErKGItYSkqdDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBwbW9kKHg6IG51bWJlcixhOiBudW1iZXIpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gKCh4JWEpK2EpJWE7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgaXNDbG9zZShhOiBudW1iZXIsIGI6IG51bWJlciwgZTogbnVtYmVyID0gMWUtNikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFicyhhLWIpIDwgZTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBpc1plcm8odjogbnVtYmVyLCBlOiBudW1iZXIgPSAxZS02KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKHYpIDwgZTtcclxuICAgIH1cclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgQVJSQVkgVVRJTFMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFycmF5VXRpbHMge1xyXG4gICAgc3RhdGljIHNodWZmbGVTZWxmPFQ+KGFycmF5OiBUW10pOiBUW10ge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSBhcnJheS5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcclxuICAgICAgICAgICAgW2FycmF5W2ldISwgYXJyYXlbal0hXSA9IFthcnJheVtqXSEsIGFycmF5W2ldIV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIFZFQ1RPUiBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBWZWMzIHtcclxuICAgIF94OiBudW1iZXI7XHJcbiAgICBfeTogbnVtYmVyO1xyXG4gICAgX3o6IG51bWJlcjtcclxuICAgIG9uTXV0YXRlPzogKCkgPT4gdm9pZDtcclxuICAgIGNvbnN0cnVjdG9yKHY6IFZlYzMgfCB7eDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcn0pO1xyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik7XHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIgfCBWZWMzIHwge3g6bnVtYmVyLCB5Om51bWJlciwgejpudW1iZXJ9LCB5PzogbnVtYmVyLCB6PzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYodHlwZW9mIHggPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgdGhpcy5feCA9IHgueDtcclxuICAgICAgICAgICAgdGhpcy5feSA9IHgueTtcclxuICAgICAgICAgICAgdGhpcy5feiA9IHguejtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl94ID0geDtcclxuICAgICAgICAgICAgdGhpcy5feSA9IHkhIGFzIG51bWJlcjtcclxuICAgICAgICAgICAgdGhpcy5feiA9IHohO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtdXRhdGUoKSB7XHJcbiAgICAgICAgaWYodGhpcy5vbk11dGF0ZSlcclxuICAgICAgICAgICAgdGhpcy5vbk11dGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXQgeCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5feCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgeCgpIHsgcmV0dXJuIHRoaXMuX3g7IH1cclxuICAgIHNldCB5KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl95ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgIH1cclxuICAgIGdldCB5KCkgeyByZXR1cm4gdGhpcy5feTsgfVxyXG4gICAgc2V0IHoodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3ogPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IHooKSB7IHJldHVybiB0aGlzLl96OyB9XHJcblxyXG4gICAgLy8gU3RhdGljIENvbnN0cnVjdG9yc1xyXG4gICAgc3RhdGljIGZpbGwobjogbnVtYmVyKTogVmVjMyB7IHJldHVybiBuZXcgVmVjMyhuLCBuLCBuKTsgfVxyXG4gICAgc3RhdGljIHplcm8oKTogVmVjMyB7IHJldHVybiBWZWMzLmZpbGwoMCk7IH1cclxuICAgIHN0YXRpYyBvbmUoKTogVmVjMyB7IHJldHVybiBWZWMzLmZpbGwoMSk7IH1cclxuICAgIHN0YXRpYyB4QXhpcygpOiBWZWMzIHsgcmV0dXJuIG5ldyBWZWMzKDEsIDAsIDApOyB9XHJcbiAgICBzdGF0aWMgeUF4aXMoKTogVmVjMyB7IHJldHVybiBuZXcgVmVjMygwLCAxLCAwKTsgfVxyXG4gICAgc3RhdGljIHpBeGlzKCk6IFZlYzMgeyByZXR1cm4gbmV3IFZlYzMoMCwgMCwgMSk7IH1cclxuICAgIHN0YXRpYyByYW5kb20oKTogVmVjMyB7XHJcbiAgICAgICAgY29uc3QgeiA9IE1hdGgucmFuZG9tKCkgKiAyIC0gMTtcclxuICAgICAgICBjb25zdCBhID0gTWF0aC5yYW5kb20oKSAqIDIgKiBNYXRoLlBJO1xyXG4gICAgICAgIGNvbnN0IGIgPSBNYXRoLnNxcnQoTWF0aC5tYXgoMCwgMSAtIHogKiB6KSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKGIgKiBNYXRoLmNvcyhhKSwgYiAqIE1hdGguc2luKGEpLCB6KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyByYW5kb21Sb3RhdGlvbigpOiBWZWMzIHtcclxuICAgICAgICBjb25zdCB2ID0gVmVjMy5yYW5kb20oKTtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModi5waXRjaCgpLCB2LnlhdygpLCBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1pc2NlbGxhbmVvdXNcclxuICAgIGdldEkoaTogbnVtYmVyKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBzd2l0Y2goaSkge1xyXG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiB0aGlzLl94O1xyXG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiB0aGlzLl95O1xyXG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiB0aGlzLl96O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgc2V0SShpOiBudW1iZXIsIHY6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHN3aXRjaChpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDogdGhpcy5feCA9IHY7IHRoaXMubXV0YXRlKCk7IHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSAxOiB0aGlzLl95ID0gdjsgdGhpcy5tdXRhdGUoKTsgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIDI6IHRoaXMuX3ogPSB2OyB0aGlzLm11dGF0ZSgpOyByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2V0KG90aGVyOiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IG90aGVyLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSBvdGhlci5feTtcclxuICAgICAgICB0aGlzLl96ID0gb3RoZXIuX3o7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHNldEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSB4O1xyXG4gICAgICAgIHRoaXMuX3kgPSB5O1xyXG4gICAgICAgIHRoaXMuX3ogPSB6O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XHJcbiAgICAgICAgeWllbGQgdGhpcy5feDtcclxuICAgICAgICB5aWVsZCB0aGlzLl95O1xyXG4gICAgICAgIHlpZWxkIHRoaXMuX3o7XHJcbiAgICB9XHJcbiAgICB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBgPCR7dGhpcy5feC50b0ZpeGVkKDIpfSwgJHt0aGlzLl95LnRvRml4ZWQoMil9LCAke3RoaXMuX3oudG9GaXhlZCgyKX0+YDtcclxuICAgIH1cclxuICAgIHRvQXJyYXkoKTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMuX3gsIHRoaXMuX3ksIHRoaXMuX3pdO1xyXG4gICAgfVxyXG4gICAgY2xvbmUoKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgZ2V0UHJpbWFyeUF4aXMoKTogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBheCA9IE1hdGguYWJzKHRoaXMuX3gpO1xyXG4gICAgICAgIGNvbnN0IGF5ID0gTWF0aC5hYnModGhpcy5feSk7XHJcbiAgICAgICAgY29uc3QgYXogPSBNYXRoLmFicyh0aGlzLl96KTtcclxuICAgICAgICBpZihheCA+IGF5KSByZXR1cm4gYXggPiBheiA/IDAgOiAyO1xyXG4gICAgICAgIGVsc2UgcmV0dXJuIGF5ID4gYXogPyAxIDogMjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxjdWxhdGlvbnNcclxuICAgIGxlbmd0aCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy5kb3QodGhpcykpO1xyXG4gICAgfVxyXG4gICAgbGVuZ3RoU3EoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kb3QodGhpcyk7XHJcbiAgICB9XHJcbiAgICBkb3Qob3RoZXI6IFZlYzMpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl94ICogb3RoZXIuX3ggKyB0aGlzLl95ICogb3RoZXIuX3kgKyB0aGlzLl96ICogb3RoZXIuX3o7XHJcbiAgICB9XHJcbiAgICBkb3RDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl94ICogeCArIHRoaXMuX3kgKiB5ICsgdGhpcy5feiAqIHo7XHJcbiAgICB9XHJcbiAgICBjcm9zcyhvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl95ICogb3RoZXIuX3ogLSB0aGlzLl96ICogb3RoZXIuX3ksIC0gKHRoaXMuX3ggKiBvdGhlci5feiAtIHRoaXMuX3ogKiBvdGhlci5feCksIHRoaXMuX3ggKiBvdGhlci5feSAtIHRoaXMuX3kgKiBvdGhlci5feCk7XHJcbiAgICB9XHJcbiAgICBjcm9zc0MoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl95ICogeiAtIHRoaXMuX3ogKiB5LCAtICh0aGlzLl94ICogeiAtIHRoaXMuX3ogKiB4KSwgdGhpcy5feCAqIHkgLSB0aGlzLl95ICogeCk7XHJcbiAgICB9XHJcbiAgICBhbmdsZVRvKG90aGVyOiBWZWMzKTogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBjID0gdGhpcy5sZW5ndGgoKSAqIG90aGVyLmxlbmd0aCgpO1xyXG4gICAgICAgIGlmKGMgPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoRU1hdGguY2xhbXAodGhpcy5kb3Qob3RoZXIpIC8gYywgLTEsIDEpKTtcclxuICAgIH1cclxuICAgIHNpZ25lZEFuZ2xlVG8ob3RoZXI6IFZlYzMsIHJlZmVyZW5jZTogVmVjMyA9IFZlYzMueUF4aXMoKSk6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgYW5nbGUgPSB0aGlzLmFuZ2xlVG8ob3RoZXIpO1xyXG4gICAgICAgIGNvbnN0IG5vcm1hbCA9IHRoaXMuY3Jvc3Mob3RoZXIpLm5vcm1TZWxmKCk7XHJcbiAgICAgICAgaWYobm9ybWFsLmRvdChyZWZlcmVuY2Uubm9ybSgpKSA+IDApXHJcbiAgICAgICAgICAgIHJldHVybiAtYW5nbGU7XHJcbiAgICAgICAgcmV0dXJuIGFuZ2xlO1xyXG4gICAgfVxyXG4gICAgZGlzdFRvKG90aGVyOiBWZWMzKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdWIob3RoZXIpLmxlbmd0aCgpO1xyXG4gICAgfVxyXG4gICAgZGlzdFRvQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdWJDKHgsIHksIHopLmxlbmd0aCgpO1xyXG4gICAgfVxyXG4gICAgZGlzdFNxVG8ob3RoZXI6IFZlYzMpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN1YihvdGhlcikubGVuZ3RoU3EoKTtcclxuICAgIH1cclxuICAgIGRpc3RTcVRvQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdWJDKHgsIHksIHopLmxlbmd0aFNxKCk7XHJcbiAgICB9XHJcbiAgICBzdHJpY3RFcXVhbHMob3RoZXI6IFZlYzMpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5feCA9PSBvdGhlci5feCAmJiB0aGlzLl95ID09IG90aGVyLl95ICYmIHRoaXMuX3ogPT0gb3RoZXIuX3o7XHJcbiAgICB9XHJcbiAgICBpc0Nsb3NlKG90aGVyOiBWZWMzLCBlID0gMWUtNik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5pc0Nsb3NlKHRoaXMuX3gsIG90aGVyLl94LCBlKSAmJiBFTWF0aC5pc0Nsb3NlKHRoaXMuX3ksIG90aGVyLl95LCBlKSAmJiBFTWF0aC5pc0Nsb3NlKHRoaXMuX3osIG90aGVyLl96LCBlKTtcclxuICAgIH1cclxuICAgIGlzWmVybyhlID0gMWUtNik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5pc1plcm8odGhpcy5feCwgZSkgJiYgRU1hdGguaXNaZXJvKHRoaXMuX3ksIGUpICYmIEVNYXRoLmlzWmVybyh0aGlzLl96LCBlKTtcclxuICAgIH1cclxuICAgIHBpdGNoKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYXNpbih0aGlzLl95KTtcclxuICAgIH1cclxuICAgIHlhdygpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKC10aGlzLl94LCAtdGhpcy5feik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gT3BlcmF0aW9uc1xyXG4gICAgYWRkKG90aGVyOiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggKyBvdGhlci5feCwgdGhpcy5feSArIG90aGVyLl95LCB0aGlzLl96ICsgb3RoZXIuX3opO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZihvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0gb3RoZXIuX3g7XHJcbiAgICAgICAgdGhpcy5feSArPSBvdGhlci5feTtcclxuICAgICAgICB0aGlzLl96ICs9IG90aGVyLl96O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feCArIHgsIHRoaXMuX3kgKyB5LCB0aGlzLl96ICsgeik7XHJcbiAgICB9XHJcbiAgICBhZGRTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCArPSB4O1xyXG4gICAgICAgIHRoaXMuX3kgKz0geTtcclxuICAgICAgICB0aGlzLl96ICs9IHo7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZEYobjogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggKyBuLCB0aGlzLl95ICsgbiwgdGhpcy5feiArIG4pO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCArPSBuO1xyXG4gICAgICAgIHRoaXMuX3kgKz0gbjtcclxuICAgICAgICB0aGlzLl96ICs9IG47XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZChvdGhlcjogVmVjMywgczogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5hZGRTY2FsZWRTZWxmKG90aGVyLCBzKTtcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZFNlbGYob3RoZXI6IFZlYzMsIHM6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0gb3RoZXIuX3ggKiBzO1xyXG4gICAgICAgIHRoaXMuX3kgKz0gb3RoZXIuX3kgKiBzO1xyXG4gICAgICAgIHRoaXMuX3ogKz0gb3RoZXIuX3ogKiBzO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWRDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHM6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuYWRkU2NhbGVkU2VsZkMoeCwgeSwgeiwgcyk7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWRTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBzOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICs9IHggKiBzO1xyXG4gICAgICAgIHRoaXMuX3kgKz0geSAqIHM7XHJcbiAgICAgICAgdGhpcy5feiArPSB6ICogcztcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3ViKG90aGVyOiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggLSBvdGhlci5feCwgdGhpcy5feSAtIG90aGVyLl95LCB0aGlzLl96IC0gb3RoZXIuX3opO1xyXG4gICAgfVxyXG4gICAgc3ViU2VsZihvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggLT0gb3RoZXIuX3g7XHJcbiAgICAgICAgdGhpcy5feSAtPSBvdGhlci5feTtcclxuICAgICAgICB0aGlzLl96IC09IG90aGVyLl96O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWJDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feCAtIHgsIHRoaXMuX3kgLSB5LCB0aGlzLl96IC0geik7XHJcbiAgICB9XHJcbiAgICBzdWJTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAtPSB4O1xyXG4gICAgICAgIHRoaXMuX3kgLT0geTtcclxuICAgICAgICB0aGlzLl96IC09IHo7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN1YkYobjogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggLSBuLCB0aGlzLl95IC0gbiwgdGhpcy5feiAtIG4pO1xyXG4gICAgfVxyXG4gICAgc3ViU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAtPSBuO1xyXG4gICAgICAgIHRoaXMuX3kgLT0gbjtcclxuICAgICAgICB0aGlzLl96IC09IG47XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJzdWIob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMob3RoZXIuX3ggLSB0aGlzLl94LCBvdGhlci5feSAtIHRoaXMuX3ksIG90aGVyLl96IC0gdGhpcy5feik7XHJcbiAgICB9XHJcbiAgICByc3ViU2VsZihvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSBvdGhlci5feCAtIHRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IG90aGVyLl95IC0gdGhpcy5feTtcclxuICAgICAgICB0aGlzLl96ID0gb3RoZXIuX3ogLSB0aGlzLl96O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByc3ViQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHggLSB0aGlzLl94LCB5IC0gdGhpcy5feSwgeiAtIHRoaXMuX3opO1xyXG4gICAgfVxyXG4gICAgcnN1YlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0geCAtIHRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IHkgLSB0aGlzLl95O1xyXG4gICAgICAgIHRoaXMuX3ogPSB6IC0gdGhpcy5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcnN1YkYobjogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKG4gLSB0aGlzLl94LCBuIC0gdGhpcy5feSwgbiAtIHRoaXMuX3opO1xyXG4gICAgfVxyXG4gICAgcnN1YlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSBuIC0gdGhpcy5feDtcclxuICAgICAgICB0aGlzLl95ID0gbiAtIHRoaXMuX3k7XHJcbiAgICAgICAgdGhpcy5feiA9IG4gLSB0aGlzLl96O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBtdWwob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feCAqIG90aGVyLl94LCB0aGlzLl95ICogb3RoZXIuX3ksIHRoaXMuX3ogKiBvdGhlci5feik7XHJcbiAgICB9XHJcbiAgICBtdWxTZWxmKG90aGVyOiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAqPSBvdGhlci5feDtcclxuICAgICAgICB0aGlzLl95ICo9IG90aGVyLl95O1xyXG4gICAgICAgIHRoaXMuX3ogKj0gb3RoZXIuX3o7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG11bEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl94ICogeCwgdGhpcy5feSAqIHksIHRoaXMuX3ogKiB6KTtcclxuICAgIH1cclxuICAgIG11bFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICo9IHg7XHJcbiAgICAgICAgdGhpcy5feSAqPSB5O1xyXG4gICAgICAgIHRoaXMuX3ogKj0gejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbXVsRihuOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feCAqIG4sIHRoaXMuX3kgKiBuLCB0aGlzLl96ICogbik7XHJcbiAgICB9XHJcbiAgICBtdWxTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICo9IG47XHJcbiAgICAgICAgdGhpcy5feSAqPSBuO1xyXG4gICAgICAgIHRoaXMuX3ogKj0gbjtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZGl2KG90aGVyOiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggLyBvdGhlci5feCwgdGhpcy5feSAvIG90aGVyLl95LCB0aGlzLl96IC8gb3RoZXIuX3opO1xyXG4gICAgfVxyXG4gICAgZGl2U2VsZihvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggLz0gb3RoZXIuX3g7XHJcbiAgICAgICAgdGhpcy5feSAvPSBvdGhlci5feTtcclxuICAgICAgICB0aGlzLl96IC89IG90aGVyLl96O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBkaXZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feCAvIHgsIHRoaXMuX3kgLyB5LCB0aGlzLl96IC8geik7XHJcbiAgICB9XHJcbiAgICBkaXZTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAvPSB4O1xyXG4gICAgICAgIHRoaXMuX3kgLz0geTtcclxuICAgICAgICB0aGlzLl96IC89IHo7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGRpdkYobjogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggLyBuLCB0aGlzLl95IC8gbiwgdGhpcy5feiAvIG4pO1xyXG4gICAgfVxyXG4gICAgZGl2U2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAvPSBuO1xyXG4gICAgICAgIHRoaXMuX3kgLz0gbjtcclxuICAgICAgICB0aGlzLl96IC89IG47XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJkaXYob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMob3RoZXIuX3ggLyB0aGlzLl94LCBvdGhlci5feSAvIHRoaXMuX3ksIG90aGVyLl96IC8gdGhpcy5feik7XHJcbiAgICB9XHJcbiAgICByZGl2U2VsZihvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSBvdGhlci5feCAvIHRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IG90aGVyLl95IC8gdGhpcy5feTtcclxuICAgICAgICB0aGlzLl96ID0gb3RoZXIuX3ogLyB0aGlzLl96O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByZGl2Qyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHggLyB0aGlzLl94LCB5IC8gdGhpcy5feSwgeiAvIHRoaXMuX3opO1xyXG4gICAgfVxyXG4gICAgcmRpdlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0geCAvIHRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IHkgLyB0aGlzLl95O1xyXG4gICAgICAgIHRoaXMuX3ogPSB6IC8gdGhpcy5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmRpdkYobjogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKG4gLyB0aGlzLl94LCBuIC8gdGhpcy5feSwgbiAvIHRoaXMuX3opO1xyXG4gICAgfVxyXG4gICAgcmRpdlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSBuIC8gdGhpcy5feDtcclxuICAgICAgICB0aGlzLl95ID0gbiAvIHRoaXMuX3k7XHJcbiAgICAgICAgdGhpcy5feiA9IG4gLyB0aGlzLl96O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBuZWcoKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKC10aGlzLl94LCAtdGhpcy5feSwgLXRoaXMuX3opO1xyXG4gICAgfVxyXG4gICAgbmVnU2VsZigpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gLXRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IC10aGlzLl95O1xyXG4gICAgICAgIHRoaXMuX3ogPSAtdGhpcy5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbGVycChvdGhlcjogVmVjMywgdDogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sZXJwU2VsZihvdGhlciwgdCk7XHJcbiAgICB9XHJcbiAgICBsZXJwU2VsZihvdGhlcjogVmVjMywgdDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCArPSAob3RoZXIuX3ggLSB0aGlzLl94KSAqIHQ7XHJcbiAgICAgICAgdGhpcy5feSArPSAob3RoZXIuX3kgLSB0aGlzLl95KSAqIHQ7XHJcbiAgICAgICAgdGhpcy5feiArPSAob3RoZXIuX3ogLSB0aGlzLl96KSAqIHQ7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGxlcnBDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHQ6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubGVycFNlbGZDKHgsIHksIHosIHQpO1xyXG4gICAgfVxyXG4gICAgbGVycFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0gKHggLSB0aGlzLl94KSAqIHQ7XHJcbiAgICAgICAgdGhpcy5feSArPSAoeSAtIHRoaXMuX3kpICogdDtcclxuICAgICAgICB0aGlzLl96ICs9ICh6IC0gdGhpcy5feikgKiB0O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBub3JtKCk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubm9ybVNlbGYoKTtcclxuICAgIH1cclxuICAgIG5vcm1TZWxmKCk6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IG1hZyA9IHRoaXMubGVuZ3RoKCk7XHJcbiAgICAgICAgaWYobWFnID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICByZXR1cm4gdGhpcy5kaXZTZWxmQyhtYWcsIG1hZywgbWFnKTtcclxuICAgIH1cclxuICAgIHJlc2NhbGUobWFnOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJlc2NhbGVTZWxmKG1hZyk7XHJcbiAgICB9XHJcbiAgICByZXNjYWxlU2VsZihtYWc6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1TZWxmKCkubXVsU2VsZkMobWFnLCBtYWcsIG1hZyk7XHJcbiAgICB9XHJcbiAgICBsb29rKG90aGVyOiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sb29rU2VsZihvdGhlcik7XHJcbiAgICB9XHJcbiAgICBsb29rU2VsZihvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJzdWJTZWxmKG90aGVyKS5ub3JtU2VsZigpO1xyXG4gICAgfVxyXG4gICAgY2xhbXBMZW5ndGgoYTogbnVtYmVyLCBiOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmNsYW1wTGVuZ3RoU2VsZihhLCBiKTtcclxuICAgIH1cclxuICAgIGNsYW1wTGVuZ3RoU2VsZihhOiBudW1iZXIsIGI6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc2NhbGVTZWxmKEVNYXRoLmNsYW1wKHRoaXMubGVuZ3RoKCksIGEsIGIpKTtcclxuICAgIH1cclxuICAgIGZsYXQoKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5mbGF0U2VsZigpO1xyXG4gICAgfVxyXG4gICAgZmxhdFNlbGYoKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feSA9IDA7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGZsYXROb3JtKCk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuZmxhdE5vcm1TZWxmKCk7XHJcbiAgICB9XHJcbiAgICBmbGF0Tm9ybVNlbGYoKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmxhdFNlbGYoKS5ub3JtU2VsZigpO1xyXG4gICAgfVxyXG4gICAgc2V0RG90KG90aGVyOiBWZWMzLCB0YXJnZXQ6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuc2V0RG90U2VsZihvdGhlciwgdGFyZ2V0KTtcclxuICAgIH1cclxuICAgIHNldERvdFNlbGYob3RoZXI6IFZlYzMsIHRhcmdldDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgZCA9IG90aGVyLmRvdChvdGhlcik7XHJcbiAgICAgICAgaWYoZCA9PT0gMCkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkU2NhbGVkU2VsZihvdGhlciwgKHRhcmdldCAtIHRoaXMuZG90KG90aGVyKSkgLyBkKTtcclxuICAgIH1cclxuICAgIHNldERvdEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdGFyZ2V0OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnNldERvdFNlbGZDKHgsIHksIHosIHRhcmdldCk7XHJcbiAgICB9XHJcbiAgICBzZXREb3RTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IGQgPSB4KnggKyB5KnkgKyB6Kno7XHJcbiAgICAgICAgaWYoZCA9PT0gMCkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkU2NhbGVkU2VsZkMoeCwgeSwgeiwgKHRhcmdldCAtIHRoaXMuZG90Qyh4LCB5LCB6KSkgLyBkKTtcclxuICAgIH1cclxuICAgIG1hcChtZXRob2Q6ICh4OiBudW1iZXIsIGk6IG51bWJlcikgPT4gbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5tYXBTZWxmKG1ldGhvZCk7XHJcbiAgICB9XHJcbiAgICBtYXBTZWxmKG1ldGhvZDogKHg6IG51bWJlciwgaTogbnVtYmVyKSA9PiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gbWV0aG9kKHRoaXMuX3gsIDApO1xyXG4gICAgICAgIHRoaXMuX3kgPSBtZXRob2QodGhpcy5feSwgMSk7XHJcbiAgICAgICAgdGhpcy5feiA9IG1ldGhvZCh0aGlzLl96LCAyKTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm90WChhOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdFhTZWxmKGEpO1xyXG4gICAgfVxyXG4gICAgcm90WFNlbGYoYTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGEpLCBjID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3QgeSA9IHRoaXMuX3kgKiBjIC0gdGhpcy5feiAqIHM7XHJcbiAgICAgICAgdGhpcy5feiA9IHRoaXMuX3kgKiBzICsgdGhpcy5feiAqIGM7XHJcbiAgICAgICAgdGhpcy5feSA9IHk7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdFkoYTogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RZU2VsZihhKTtcclxuICAgIH1cclxuICAgIHJvdFlTZWxmKGE6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhKSwgYyA9IE1hdGguY29zKGEpO1xyXG4gICAgICAgIGNvbnN0IHogPSB0aGlzLl96ICogYyAtIHRoaXMuX3ggKiBzO1xyXG4gICAgICAgIHRoaXMuX3ggPSB0aGlzLl94ICogYyArIHRoaXMuX3ogKiBzO1xyXG4gICAgICAgIHRoaXMuX3ogPSB6O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByb3RaKGE6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90WlNlbGYoYSk7XHJcbiAgICB9XHJcbiAgICByb3RaU2VsZihhOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSksIGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCB4ID0gdGhpcy5feCAqIGMgLSB0aGlzLl95ICogcztcclxuICAgICAgICB0aGlzLl95ID0gdGhpcy5feCAqIHMgKyB0aGlzLl95ICogYztcclxuICAgICAgICB0aGlzLl94ID0geDtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm90QXhpcyhheGlzOiBWZWMzLCBhbmdsZTogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RBeGlzU2VsZihheGlzLCBhbmdsZSk7XHJcbiAgICB9XHJcbiAgICByb3RBeGlzU2VsZihheGlzOiBWZWMzLCBhbmdsZTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgYXhpcyA9IGF4aXMubm9ybSgpO1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZSksIGMgPSBNYXRoLmNvcyhhbmdsZSk7XHJcbiAgICAgICAgY29uc3QgY3Jvc3MgPSBheGlzLmNyb3NzKHRoaXMpO1xyXG4gICAgICAgIGNvbnN0IGRvdCA9IGF4aXMuZG90KHRoaXMpO1xyXG4gICAgICAgIGxldCB4ID0gdGhpcy5feCwgeSA9IHRoaXMuX3ksIHogPSB0aGlzLl96O1xyXG4gICAgICAgIHRoaXMuX3ggPSB4ICogYyArIGNyb3NzLl94ICogcyArIGF4aXMuX3ggKiBkb3QgKiAoMSAtIGMpO1xyXG4gICAgICAgIHRoaXMuX3kgPSB5ICogYyArIGNyb3NzLl95ICogcyArIGF4aXMuX3kgKiBkb3QgKiAoMSAtIGMpO1xyXG4gICAgICAgIHRoaXMuX3ogPSB6ICogYyArIGNyb3NzLl96ICogcyArIGF4aXMuX3ogKiBkb3QgKiAoMSAtIGMpO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByb3RYWVoocm90OiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RYWVpTZWxmKHJvdCk7XHJcbiAgICB9XHJcbiAgICByb3RYWVpTZWxmKHJvdDogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvdFhTZWxmKHJvdC5feCkucm90WVNlbGYocm90Ll95KS5yb3RaU2VsZihyb3QuX3opO1xyXG4gICAgfVxyXG4gICAgcm90WFlaQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RYWVpTZWxmQyh4LCB5LCB6KTtcclxuICAgIH1cclxuICAgIHJvdFhZWlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3RYU2VsZih4KS5yb3RZU2VsZih5KS5yb3RaU2VsZih6KTtcclxuICAgIH1cclxuICAgIHJvdFpZWChyb3Q6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdFpZWFNlbGYocm90KTtcclxuICAgIH1cclxuICAgIHJvdFpZWFNlbGYocm90OiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90WlNlbGYocm90Ll96KS5yb3RZU2VsZihyb3QuX3kpLnJvdFhTZWxmKHJvdC5feCk7XHJcbiAgICB9XHJcbiAgICByb3RaWVhDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdFpZWFNlbGZDKHgsIHksIHopO1xyXG4gICAgfVxyXG4gICAgcm90WllYU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvdFpTZWxmKHopLnJvdFlTZWxmKHkpLnJvdFhTZWxmKHgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVmVjMiB7XHJcbiAgICBjb25zdHJ1Y3Rvcih2OiBWZWMyIHwge3g6IG51bWJlciwgeTogbnVtYmVyfSk7XHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcik7XHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIgfCB7eDpudW1iZXIsIHk6bnVtYmVyfSwgeT86IG51bWJlcikge1xyXG4gICAgICAgIGlmKHR5cGVvZiB4ID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ggPSB4Lng7XHJcbiAgICAgICAgICAgIHRoaXMuX3kgPSB4Lnk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5feCA9IHg7XHJcbiAgICAgICAgICAgIHRoaXMuX3kgPSB5IGFzIG51bWJlcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX3g6IG51bWJlcjtcclxuICAgIGdldCB4KCkgeyByZXR1cm4gdGhpcy5feDsgfVxyXG4gICAgc2V0IHgodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3ggPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgX3k6IG51bWJlcjtcclxuICAgIGdldCB5KCkgeyByZXR1cm4gdGhpcy5feTsgfVxyXG4gICAgc2V0IHkodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3kgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgb25NdXRhdGU/OiAoKSA9PiB2b2lkO1xyXG5cclxuICAgIG11dGF0ZSgpIHtcclxuICAgICAgICBpZih0aGlzLm9uTXV0YXRlKVxyXG4gICAgICAgICAgICB0aGlzLm9uTXV0YXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU3RhdGljIENvbnN0cnVjdG9yc1xyXG4gICAgc3RhdGljIGZpbGwobjogbnVtYmVyKTogVmVjMiB7IHJldHVybiBuZXcgVmVjMihuLCBuKTsgfVxyXG4gICAgc3RhdGljIHplcm8oKTogVmVjMiB7IHJldHVybiBWZWMyLmZpbGwoMCk7IH1cclxuICAgIHN0YXRpYyBvbmUoKTogVmVjMiB7IHJldHVybiBWZWMyLmZpbGwoMSk7IH1cclxuICAgIHN0YXRpYyB4QXhpcygpOiBWZWMyIHsgcmV0dXJuIG5ldyBWZWMyKDEsIDApOyB9XHJcbiAgICBzdGF0aWMgeUF4aXMoKTogVmVjMiB7IHJldHVybiBuZXcgVmVjMigwLCAxKTsgfVxyXG4gICAgc3RhdGljIHJhbmRvbSgpOiBWZWMyIHtcclxuICAgICAgICBjb25zdCBhID0gTWF0aC5yYW5kb20oKSAqIDIgKiBNYXRoLlBJO1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMihNYXRoLmNvcyhhKSwgTWF0aC5zaW4oYSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1pc2NlbGxhbmVvdXNcclxuICAgIGdldEkoaTogbnVtYmVyKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBzd2l0Y2goaSkge1xyXG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiB0aGlzLl94O1xyXG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiB0aGlzLl95O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgc2V0SShpOiBudW1iZXIsIHY6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHN3aXRjaChpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDogdGhpcy5feCA9IHY7IHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSAxOiB0aGlzLl95ID0gdjsgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgc2V0KG90aGVyOiBWZWMyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IG90aGVyLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSBvdGhlci5feTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc2V0Qyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSB4O1xyXG4gICAgICAgIHRoaXMuX3kgPSB5O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XHJcbiAgICAgICAgeWllbGQgdGhpcy5feDtcclxuICAgICAgICB5aWVsZCB0aGlzLl95O1xyXG4gICAgfVxyXG4gICAgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gYDwke3RoaXMuX3gudG9GaXhlZCgyKX0sICR7dGhpcy5feS50b0ZpeGVkKDIpfT5gO1xyXG4gICAgfVxyXG4gICAgdG9BcnJheSgpOiBbbnVtYmVyLCBudW1iZXJdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMuX3gsIHRoaXMuX3ldO1xyXG4gICAgfVxyXG4gICAgY2xvbmUoKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENhbGN1bGF0aW9uc1xyXG4gICAgbGVuZ3RoKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLmRvdCh0aGlzKSk7XHJcbiAgICB9XHJcbiAgICBsZW5ndGhTcSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRvdCh0aGlzKTtcclxuICAgIH1cclxuICAgIGRvdChvdGhlcjogVmVjMik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ggKiBvdGhlci5feCArIHRoaXMuX3kgKiBvdGhlci5feTtcclxuICAgIH1cclxuICAgIGRvdEMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl94ICogeCArIHRoaXMuX3kgKiB5O1xyXG4gICAgfVxyXG4gICAgYW5nbGVUbyhvdGhlcjogVmVjMik6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgYyA9IHRoaXMubGVuZ3RoKCkgKiBvdGhlci5sZW5ndGgoKTtcclxuICAgICAgICBpZihjID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICByZXR1cm4gTWF0aC5hY29zKEVNYXRoLmNsYW1wKHRoaXMuZG90KG90aGVyKSAvIGMsIC0xLCAxKSk7XHJcbiAgICB9XHJcbiAgICBzaWduZWRBbmdsZVRvKG90aGVyOiBWZWMyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLl94ICogb3RoZXIuX3kgLSB0aGlzLl95ICogb3RoZXIuX3gsIHRoaXMuZG90KG90aGVyKSk7XHJcbiAgICB9XHJcbiAgICBkaXN0VG8ob3RoZXI6IFZlYzIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN1YihvdGhlcikubGVuZ3RoKCk7XHJcbiAgICB9XHJcbiAgICBkaXN0VG9DKHg6IG51bWJlciwgeTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdWJDKHgsIHkpLmxlbmd0aCgpO1xyXG4gICAgfVxyXG4gICAgZGlzdFNxVG8ob3RoZXI6IFZlYzIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN1YihvdGhlcikubGVuZ3RoU3EoKTtcclxuICAgIH1cclxuICAgIGRpc3RTcVRvQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViQyh4LCB5KS5sZW5ndGhTcSgpO1xyXG4gICAgfVxyXG4gICAgc3RyaWN0RXF1YWxzKG90aGVyOiBWZWMyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ggPT0gb3RoZXIuX3ggJiYgdGhpcy5feSA9PSBvdGhlci5feTtcclxuICAgIH1cclxuICAgIGlzQ2xvc2Uob3RoZXI6IFZlYzIsIGUgPSAxZS02KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIEVNYXRoLmlzQ2xvc2UodGhpcy5feCwgb3RoZXIuX3gsIGUpICYmIEVNYXRoLmlzQ2xvc2UodGhpcy5feSwgb3RoZXIuX3ksIGUpO1xyXG4gICAgfVxyXG4gICAgaXNaZXJvKGUgPSAxZS02KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIEVNYXRoLmlzWmVybyh0aGlzLl94LCBlKSAmJiBFTWF0aC5pc1plcm8odGhpcy5feSwgZSk7XHJcbiAgICB9XHJcbiAgICB0aGV0YSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKHRoaXMuX3ksIHRoaXMuX3gpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE9wZXJhdGlvbnNcclxuICAgIGFkZChvdGhlcjogVmVjMik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLl94ICsgb3RoZXIuX3gsIHRoaXMuX3kgKyBvdGhlci5feSk7XHJcbiAgICB9XHJcbiAgICBhZGRTZWxmKG90aGVyOiBWZWMyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCArPSBvdGhlci5feDtcclxuICAgICAgICB0aGlzLl95ICs9IG90aGVyLl95O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRDKHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMuX3ggKyB4LCB0aGlzLl95ICsgeSk7XHJcbiAgICB9XHJcbiAgICBhZGRTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0geDtcclxuICAgICAgICB0aGlzLl95ICs9IHk7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZEYobjogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMuX3ggKyBuLCB0aGlzLl95ICsgbik7XHJcbiAgICB9XHJcbiAgICBhZGRTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICs9IG47XHJcbiAgICAgICAgdGhpcy5feSArPSBuO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWQob3RoZXI6IFZlYzIsIHM6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuYWRkU2NhbGVkU2VsZihvdGhlciwgcyk7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWRTZWxmKG90aGVyOiBWZWMyLCBzOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICs9IG90aGVyLl94ICogcztcclxuICAgICAgICB0aGlzLl95ICs9IG90aGVyLl95ICogcztcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkQyh4OiBudW1iZXIsIHk6IG51bWJlciwgczogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5hZGRTY2FsZWRTZWxmQyh4LCB5LCBzKTtcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCBzOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICs9IHggKiBzO1xyXG4gICAgICAgIHRoaXMuX3kgKz0geSAqIHM7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN1YihvdGhlcjogVmVjMik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLl94IC0gb3RoZXIuX3gsIHRoaXMuX3kgLSBvdGhlci5feSk7XHJcbiAgICB9XHJcbiAgICBzdWJTZWxmKG90aGVyOiBWZWMyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAtPSBvdGhlci5feDtcclxuICAgICAgICB0aGlzLl95IC09IG90aGVyLl95O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWJDKHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMuX3ggLSB4LCB0aGlzLl95IC0geSk7XHJcbiAgICB9XHJcbiAgICBzdWJTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggLT0geDtcclxuICAgICAgICB0aGlzLl95IC09IHk7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN1YkYobjogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMuX3ggLSBuLCB0aGlzLl95IC0gbik7XHJcbiAgICB9XHJcbiAgICBzdWJTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94IC09IG47XHJcbiAgICAgICAgdGhpcy5feSAtPSBuO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByc3ViKG90aGVyOiBWZWMyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKG90aGVyLl94IC0gdGhpcy5feCwgb3RoZXIuX3kgLSB0aGlzLl95KTtcclxuICAgIH1cclxuICAgIHJzdWJTZWxmKG90aGVyOiBWZWMyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IG90aGVyLl94IC0gdGhpcy5feDtcclxuICAgICAgICB0aGlzLl95ID0gb3RoZXIuX3kgLSB0aGlzLl95O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByc3ViQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih4IC0gdGhpcy5feCwgeSAtIHRoaXMuX3kpO1xyXG4gICAgfVxyXG4gICAgcnN1YlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IHggLSB0aGlzLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSB5IC0gdGhpcy5feTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcnN1YkYobjogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKG4gLSB0aGlzLl94LCBuIC0gdGhpcy5feSk7XHJcbiAgICB9XHJcbiAgICByc3ViU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IG4gLSB0aGlzLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSBuIC0gdGhpcy5feTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG11bChvdGhlcjogVmVjMik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLl94ICogb3RoZXIuX3gsIHRoaXMuX3kgKiBvdGhlci5feSk7XHJcbiAgICB9XHJcbiAgICBtdWxTZWxmKG90aGVyOiBWZWMyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAqPSBvdGhlci5feDtcclxuICAgICAgICB0aGlzLl95ICo9IG90aGVyLl95O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBtdWxDKHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMuX3ggKiB4LCB0aGlzLl95ICogeSk7XHJcbiAgICB9XHJcbiAgICBtdWxTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKj0geDtcclxuICAgICAgICB0aGlzLl95ICo9IHk7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG11bEYobjogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMuX3ggKiBuLCB0aGlzLl95ICogbik7XHJcbiAgICB9XHJcbiAgICBtdWxTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICo9IG47XHJcbiAgICAgICAgdGhpcy5feSAqPSBuO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBkaXYob3RoZXI6IFZlYzIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5feCAvIG90aGVyLl94LCB0aGlzLl95IC8gb3RoZXIuX3kpO1xyXG4gICAgfVxyXG4gICAgZGl2U2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggLz0gb3RoZXIuX3g7XHJcbiAgICAgICAgdGhpcy5feSAvPSBvdGhlci5feTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZGl2Qyh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLl94IC8geCwgdGhpcy5feSAvIHkpO1xyXG4gICAgfVxyXG4gICAgZGl2U2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94IC89IHg7XHJcbiAgICAgICAgdGhpcy5feSAvPSB5O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBkaXZGKG46IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLl94IC8gbiwgdGhpcy5feSAvIG4pO1xyXG4gICAgfVxyXG4gICAgZGl2U2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAvPSBuO1xyXG4gICAgICAgIHRoaXMuX3kgLz0gbjtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmRpdihvdGhlcjogVmVjMik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMihvdGhlci5feCAvIHRoaXMuX3gsIG90aGVyLl95IC8gdGhpcy5feSk7XHJcbiAgICB9XHJcbiAgICByZGl2U2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSBvdGhlci5feCAvIHRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IG90aGVyLl95IC8gdGhpcy5feTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmRpdkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoeCAvIHRoaXMuX3gsIHkgLyB0aGlzLl95KTtcclxuICAgIH1cclxuICAgIHJkaXZTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSB4IC8gdGhpcy5feDtcclxuICAgICAgICB0aGlzLl95ID0geSAvIHRoaXMuX3k7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJkaXZGKG46IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMihuIC8gdGhpcy5feCwgbiAvIHRoaXMuX3kpO1xyXG4gICAgfVxyXG4gICAgcmRpdlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSBuIC8gdGhpcy5feDtcclxuICAgICAgICB0aGlzLl95ID0gbiAvIHRoaXMuX3k7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG5lZygpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoLXRoaXMuX3gsIC10aGlzLl95KTtcclxuICAgIH1cclxuICAgIG5lZ1NlbGYoKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IC10aGlzLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSAtdGhpcy5feTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbGVycChvdGhlcjogVmVjMiwgdDogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sZXJwU2VsZihvdGhlciwgdCk7XHJcbiAgICB9XHJcbiAgICBsZXJwU2VsZihvdGhlcjogVmVjMiwgdDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCArPSAob3RoZXIuX3ggLSB0aGlzLl94KSAqIHQ7XHJcbiAgICAgICAgdGhpcy5feSArPSAob3RoZXIuX3kgLSB0aGlzLl95KSAqIHQ7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGxlcnBDKHg6IG51bWJlciwgeTogbnVtYmVyLCB0OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxlcnBTZWxmQyh4LCB5LCB0KTtcclxuICAgIH1cclxuICAgIGxlcnBTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgdDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCArPSAoeCAtIHRoaXMuX3gpICogdDtcclxuICAgICAgICB0aGlzLl95ICs9ICh5IC0gdGhpcy5feSkgKiB0O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBub3JtKCk6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubm9ybVNlbGYoKTtcclxuICAgIH1cclxuICAgIG5vcm1TZWxmKCk6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IG1hZyA9IHRoaXMubGVuZ3RoKCk7XHJcbiAgICAgICAgaWYobWFnID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICByZXR1cm4gdGhpcy5kaXZTZWxmQyhtYWcsIG1hZyk7XHJcbiAgICB9XHJcbiAgICByZXNjYWxlKG1hZzogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yZXNjYWxlU2VsZihtYWcpO1xyXG4gICAgfVxyXG4gICAgcmVzY2FsZVNlbGYobWFnOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ub3JtU2VsZigpLm11bFNlbGZDKG1hZywgbWFnKTtcclxuICAgIH1cclxuICAgIGxvb2sob3RoZXI6IFZlYzIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxvb2tTZWxmKG90aGVyKTtcclxuICAgIH1cclxuICAgIGxvb2tTZWxmKG90aGVyOiBWZWMyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucnN1YlNlbGYob3RoZXIpLm5vcm1TZWxmKCk7XHJcbiAgICB9XHJcbiAgICBjbGFtcExlbmd0aChhOiBudW1iZXIsIGI6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuY2xhbXBMZW5ndGhTZWxmKGEsIGIpO1xyXG4gICAgfVxyXG4gICAgY2xhbXBMZW5ndGhTZWxmKGE6IG51bWJlciwgYjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzY2FsZVNlbGYoRU1hdGguY2xhbXAodGhpcy5sZW5ndGgoKSwgYSwgYikpO1xyXG4gICAgfVxyXG4gICAgc2V0RG90KG90aGVyOiBWZWMyLCB0YXJnZXQ6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuc2V0RG90U2VsZihvdGhlciwgdGFyZ2V0KTtcclxuICAgIH1cclxuICAgIHNldERvdFNlbGYob3RoZXI6IFZlYzIsIHRhcmdldDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgZCA9IG90aGVyLmRvdChvdGhlcik7XHJcbiAgICAgICAgaWYoZCA9PT0gMCkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkU2NhbGVkU2VsZihvdGhlciwgKHRhcmdldCAtIHRoaXMuZG90KG90aGVyKSkgLyBkKTtcclxuICAgIH1cclxuICAgIHNldERvdEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHRhcmdldDogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5zZXREb3RTZWxmQyh4LCB5LCB0YXJnZXQpO1xyXG4gICAgfVxyXG4gICAgc2V0RG90U2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHRhcmdldDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgZCA9IHgqeCArIHkqeTtcclxuICAgICAgICBpZihkID09PSAwKSByZXR1cm4gdGhpcztcclxuICAgICAgICByZXR1cm4gdGhpcy5hZGRTY2FsZWRTZWxmQyh4LCB5LCAodGFyZ2V0IC0gdGhpcy5kb3RDKHgsIHkpKSAvIGQpO1xyXG4gICAgfVxyXG4gICAgbWFwKG1ldGhvZDogKHg6IG51bWJlciwgaTogbnVtYmVyKSA9PiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLm1hcFNlbGYobWV0aG9kKTtcclxuICAgIH1cclxuICAgIG1hcFNlbGYobWV0aG9kOiAoeDogbnVtYmVyLCBpOiBudW1iZXIpID0+IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSBtZXRob2QodGhpcy5feCwgMCk7XHJcbiAgICAgICAgdGhpcy5feSA9IG1ldGhvZCh0aGlzLl95LCAxKTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm90YXRlKGE6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90YXRlU2VsZihhKTtcclxuICAgIH1cclxuICAgIHJvdGF0ZVNlbGYoYTogbnVtYmVyKSA6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhKSwgYyA9IE1hdGguY29zKGEpO1xyXG4gICAgICAgIGNvbnN0IHggPSB0aGlzLngsIHkgPSB0aGlzLnk7XHJcbiAgICAgICAgdGhpcy5feCA9IHggKiBjIC0geSAqIHM7XHJcbiAgICAgICAgdGhpcy5feSA9IHggKiBzICsgeSAqIGM7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIE1BVFJJWCBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIENvbHVtbi1tYWpvciA0eDQgbWF0cml4XHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNYXQ0IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuICAgIFxyXG4gICAgc3RhdGljIG5ldygpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAxLCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAxLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAxLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdHJhbnNsYXRlKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAxLCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAxLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAxLCAwLFxyXG4gICAgICAgICAgICB4LCB5LCB6LCAxLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgc2NhbGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHgsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIHksIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIHosIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDAsIDEsXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyByb3RhdGVYKGE6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSk7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgMSwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgYywgcywgMCxcclxuICAgICAgICAgICAgMCwgLXMsIGMsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDAsIDFcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJvdGF0ZVkoYTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKGEpO1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhKTtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBjLCAwLCAtcywgMCxcclxuICAgICAgICAgICAgMCwgMSwgMCwgMCxcclxuICAgICAgICAgICAgcywgMCwgYywgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcm90YXRlWihhOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGEpO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIGMsIHMsIDAsIDAsXHJcbiAgICAgICAgICAgIC1zLCBjLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAxLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBwZXJzcGVjdGl2ZShmb3ZZOiBudW1iZXIsIGFzcGVjdDogbnVtYmVyLCBuZWFyOiBudW1iZXIgPSAxLCBmYXI6IG51bWJlciA9IDEwMDApIHtcclxuICAgICAgICBjb25zdCBmID0gMSAvIE1hdGgudGFuKGZvdlkgLyAyKTtcclxuICAgICAgICBjb25zdCBuZiA9IDEgLyAobmVhciAtIGZhcik7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgZi9hc3BlY3QsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIGYsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIChmYXIgKyBuZWFyKSAqIG5mLCAtMSxcclxuICAgICAgICAgICAgMCwgMCwgKDIgKiBmYXIgKiBuZWFyKSAqIG5mLCAwXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBtdWx0aXBseShtMTogbnVtYmVyW10sIG0yOiBudW1iZXJbXSkge1xyXG4gICAgICAgIGNvbnN0IG91dCA9IE1hdDQubmV3KCk7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8NDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaj0wOyBqPDQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgb3V0W2kqNCArIGpdID0gKFxyXG4gICAgICAgICAgICAgICAgICAgIG0xWzAqNCArIGpdISAqIG0yW2kqNCArIDBdIVxyXG4gICAgICAgICAgICAgICAgICAgICsgbTFbMSo0ICsgal0hICogbTJbaSo0ICsgMV0hXHJcbiAgICAgICAgICAgICAgICAgICAgKyBtMVsyKjQgKyBqXSEgKiBtMltpKjQgKyAyXSFcclxuICAgICAgICAgICAgICAgICAgICArIG0xWzMqNCArIGpdISAqIG0yW2kqNCArIDNdIVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8gQ29sdW1uLW1ham9yIDN4MyBtYXRyaXhcclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1hdDMge1xyXG4gICAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAgIHN0YXRpYyBuZXcoKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgMSwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMSwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHRyYW5zbGF0ZSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIDEsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDEsIDAsXHJcbiAgICAgICAgICAgIHgsIHksIDEsXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBzY2FsZSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHgsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIHksIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDEsXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyByb3RhdGUoYTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKGEpO1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhKTtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBjLCBzLCAwLFxyXG4gICAgICAgICAgICAtcywgYywgMCxcclxuICAgICAgICAgICAgMCwgMCwgMSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIG11bHRpcGx5KG0xOiBudW1iZXJbXSwgbTI6IG51bWJlcltdKSB7XHJcbiAgICAgICAgY29uc3Qgb3V0ID0gTWF0My5uZXcoKTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTwzOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCBqPTA7IGo8MzsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRbaSozICsgal0gPSAoXHJcbiAgICAgICAgICAgICAgICAgICAgbTFbMCozICsgal0hICogbTJbaSozICsgMF0hXHJcbiAgICAgICAgICAgICAgICAgICAgKyBtMVsxKjMgKyBqXSEgKiBtMltpKjMgKyAxXSFcclxuICAgICAgICAgICAgICAgICAgICArIG0xWzIqMyArIGpdISAqIG0yW2kqMyArIDJdIVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgTk9JU0UgQ0xBU1MgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE5vaXNlIHtcclxuICAgIHN0YXRpYyByYW5kb21Db25zdGFudDMoYTogbnVtYmVyLCBiOiBudW1iZXIsIGM6IG51bWJlcikgOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGl0ID0gKGEgKiAyMzk0ODIzNTQ5KSBeIChiICogNDM4NTk3NDI4NTApIF4gKGMgKiAyMzA5NDU2NTIzNCk7XHJcbiAgICAgICAgcmV0dXJuIEVNYXRoLnBtb2QoaXQsIDEwMDAwKSAvIDEwMDAwO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJhbmRvbUNvbnN0YW50NChhOiBudW1iZXIsIGI6IG51bWJlciwgYzogbnVtYmVyLCBkOiBudW1iZXIpIDogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBpdCA9IChhICogMjM5NDgyMzU0OSkgXiAoYiAqIDQzODU5NzQyODUwKSBeIChjICogMjMwOTQ1NjUyMzQpIF4gKGQgKiA4NDI3ODI0NTY2KTtcclxuICAgICAgICByZXR1cm4gRU1hdGgucG1vZChpdCwgMTAwMDApIC8gMTAwMDA7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZmFkZSh0OiBudW1iZXIpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdCAqIHQgKiB0ICogKHQgKiAodCAqIDYgLSAxNSkgKyAxMCk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2VuZXJhdGVQZXJsaW4yREdyYWRpZW50cyhjb3VudCA9IDEyKSB7XHJcbiAgICAgICAgY29uc3QgZ3JhZGllbnRzOiBWZWMyW10gPSBbXTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxjb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gMiAqIE1hdGguUEkgKiBpL2NvdW50O1xyXG4gICAgICAgICAgICBncmFkaWVudHMucHVzaChuZXcgVmVjMihNYXRoLmNvcyhhbmdsZSksIE1hdGguc2luKGFuZ2xlKSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZ3JhZGllbnRzO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldFBlcmxpbjJEVmVjdG9yQXQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHNlZWQ6IG51bWJlciwgZ3JhZGllbnRzOiBWZWMyW10pIDogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIGdyYWRpZW50c1tNYXRoLmZsb29yKHRoaXMucmFuZG9tQ29uc3RhbnQzKHNlZWQsIHgsIHkpICogZ3JhZGllbnRzLmxlbmd0aCldITtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRQZXJsaW4yRFZhbHVlQXQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHNlZWQ6IG51bWJlciwgZ3JhZGllbnRzOiBWZWMyW10pIDogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBnZXRQZXJsaW4yRFZlY3RvckF0ID0gdGhpcy5nZXRQZXJsaW4yRFZlY3RvckF0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgY29uc3QgbGVycCA9IEVNYXRoLmxlcnA7XHJcbiAgICAgICAgY29uc3QgZmFkZSA9IHRoaXMuZmFkZTtcclxuICAgICAgICBjb25zdCBnMCA9IG5ldyBWZWMyKHgsIHkpLm1hcFNlbGYoTWF0aC5mbG9vcik7XHJcbiAgICAgICAgY29uc3QgZzEgPSBuZXcgVmVjMihnMCkuYWRkU2VsZkMoMSwgMSk7XHJcbiAgICAgICAgY29uc3QgZjAgPSBuZXcgVmVjMih4LCB5KS5zdWJTZWxmKGcwKTtcclxuICAgICAgICBjb25zdCBmMSA9IG5ldyBWZWMyKHgsIHkpLnN1YlNlbGYoZzEpO1xyXG4gICAgICAgIGNvbnN0IGNBQSA9IGdldFBlcmxpbjJEVmVjdG9yQXQoZzAueCwgZzAueSwgc2VlZCwgZ3JhZGllbnRzKS5kb3QoZjApO1xyXG4gICAgICAgIGNvbnN0IGNBQiA9IGdldFBlcmxpbjJEVmVjdG9yQXQoZzAueCwgZzEueSwgc2VlZCwgZ3JhZGllbnRzKS5kb3RDKGYwLngsIGYxLnkpO1xyXG4gICAgICAgIGNvbnN0IGNCQSA9IGdldFBlcmxpbjJEVmVjdG9yQXQoZzEueCwgZzAueSwgc2VlZCwgZ3JhZGllbnRzKS5kb3RDKGYxLngsIGYwLnkpO1xyXG4gICAgICAgIGNvbnN0IGNCQiA9IGdldFBlcmxpbjJEVmVjdG9yQXQoZzEueCwgZzEueSwgc2VlZCwgZ3JhZGllbnRzKS5kb3QoZjEpO1xyXG4gICAgICAgIGNvbnN0IHR4ID0gZmFkZShmMC54KTtcclxuICAgICAgICBjb25zdCB0eSA9IGZhZGUoZjAueSk7XHJcbiAgICAgICAgY29uc3QgY0EgPSBsZXJwKGNBQSwgY0JBLCB0eCk7XHJcbiAgICAgICAgY29uc3QgY0IgPSBsZXJwKGNBQiwgY0JCLCB0eCk7XHJcbiAgICAgICAgY29uc3QgYyA9IGxlcnAoY0EsIGNCLCB0eSk7XHJcbiAgICAgICAgcmV0dXJuIEVNYXRoLmNsYW1wKGMgKiAwLjUgKyAwLjUsIDAsIDEpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdlbmVyYXRlUGVybGluM0RHcmFkaWVudHMoY291bnQgPSAxNikge1xyXG4gICAgICAgIGNvbnN0IGdyYWRpZW50czogVmVjM1tdID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxjb3VudDtpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgeSA9IDEgLSAoMippKS8oY291bnQtMSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHIgPSBNYXRoLnNxcnQoMS15KnkpO1xyXG4gICAgICAgICAgICBjb25zdCBhbmdsZSA9IGkgKiBNYXRoLlBJICogKDMtTWF0aC5zcXJ0KDUpKTtcclxuICAgICAgICAgICAgZ3JhZGllbnRzLnB1c2gobmV3IFZlYzMoXHJcbiAgICAgICAgICAgICAgICBNYXRoLmNvcyhhbmdsZSkgKiByLFxyXG4gICAgICAgICAgICAgICAgeSxcclxuICAgICAgICAgICAgICAgIE1hdGguc2luKGFuZ2xlKSAqIHIsXHJcbiAgICAgICAgICAgICkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZ3JhZGllbnRzO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldFBlcmxpbjNEVmVjdG9yQXQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgc2VlZDogbnVtYmVyLCBncmFkaWVudHM6IFZlYzNbXSkgOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gZ3JhZGllbnRzW01hdGguZmxvb3IodGhpcy5yYW5kb21Db25zdGFudDQoc2VlZCwgeCwgeSwgeikgKiBncmFkaWVudHMubGVuZ3RoKV0hO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldFBlcmxpbjNEVmFsdWVBdCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBzZWVkOiBudW1iZXIsIGdyYWRpZW50czogVmVjM1tdKSA6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgZ2V0UGVybGluM0RWZWN0b3JBdCA9IHRoaXMuZ2V0UGVybGluM0RWZWN0b3JBdC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIGNvbnN0IGxlcnAgPSBFTWF0aC5sZXJwO1xyXG4gICAgICAgIGNvbnN0IGZhZGUgPSB0aGlzLmZhZGU7XHJcbiAgICAgICAgY29uc3QgZzAgPSBuZXcgVmVjMyh4LCB5LCB6KS5tYXBTZWxmKE1hdGguZmxvb3IpO1xyXG4gICAgICAgIGNvbnN0IGcxID0gbmV3IFZlYzMoZzApLmFkZFNlbGZDKDEsIDEsIDEpO1xyXG4gICAgICAgIGNvbnN0IGYwID0gbmV3IFZlYzMoeCwgeSwgeikuc3ViU2VsZihnMCk7XHJcbiAgICAgICAgY29uc3QgZjEgPSBuZXcgVmVjMyh4LCB5LCB6KS5zdWJTZWxmKGcxKTtcclxuICAgICAgICBjb25zdCBjQUFBID0gZ2V0UGVybGluM0RWZWN0b3JBdChnMC54LCBnMC55LCBnMC56LCBzZWVkLCBncmFkaWVudHMpLmRvdChmMCk7XHJcbiAgICAgICAgY29uc3QgY0FBQiA9IGdldFBlcmxpbjNEVmVjdG9yQXQoZzAueCwgZzAueSwgZzEueiwgc2VlZCwgZ3JhZGllbnRzKS5kb3RDKGYwLngsIGYwLnksIGYxLnopO1xyXG4gICAgICAgIGNvbnN0IGNBQkEgPSBnZXRQZXJsaW4zRFZlY3RvckF0KGcwLngsIGcxLnksIGcwLnosIHNlZWQsIGdyYWRpZW50cykuZG90QyhmMC54LCBmMS55LCBmMC56KTtcclxuICAgICAgICBjb25zdCBjQUJCID0gZ2V0UGVybGluM0RWZWN0b3JBdChnMC54LCBnMS55LCBnMS56LCBzZWVkLCBncmFkaWVudHMpLmRvdEMoZjAueCwgZjEueSwgZjEueik7XHJcbiAgICAgICAgY29uc3QgY0JBQSA9IGdldFBlcmxpbjNEVmVjdG9yQXQoZzEueCwgZzAueSwgZzAueiwgc2VlZCwgZ3JhZGllbnRzKS5kb3RDKGYxLngsIGYwLnksIGYwLnopO1xyXG4gICAgICAgIGNvbnN0IGNCQUIgPSBnZXRQZXJsaW4zRFZlY3RvckF0KGcxLngsIGcwLnksIGcxLnosIHNlZWQsIGdyYWRpZW50cykuZG90QyhmMS54LCBmMC55LCBmMS56KTtcclxuICAgICAgICBjb25zdCBjQkJBID0gZ2V0UGVybGluM0RWZWN0b3JBdChnMS54LCBnMS55LCBnMC56LCBzZWVkLCBncmFkaWVudHMpLmRvdEMoZjEueCwgZjEueSwgZjAueik7XHJcbiAgICAgICAgY29uc3QgY0JCQiA9IGdldFBlcmxpbjNEVmVjdG9yQXQoZzEueCwgZzEueSwgZzEueiwgc2VlZCwgZ3JhZGllbnRzKS5kb3QoZjEpO1xyXG4gICAgICAgIGNvbnN0IHR4ID0gZmFkZShmMC54KTtcclxuICAgICAgICBjb25zdCB0eSA9IGZhZGUoZjAueSk7XHJcbiAgICAgICAgY29uc3QgdHogPSBmYWRlKGYwLnopO1xyXG4gICAgICAgIGNvbnN0IGNBQSA9IGxlcnAoY0FBQSwgY0JBQSwgdHgpO1xyXG4gICAgICAgIGNvbnN0IGNBQiA9IGxlcnAoY0FBQiwgY0JBQiwgdHgpO1xyXG4gICAgICAgIGNvbnN0IGNCQSA9IGxlcnAoY0FCQSwgY0JCQSwgdHgpO1xyXG4gICAgICAgIGNvbnN0IGNCQiA9IGxlcnAoY0FCQiwgY0JCQiwgdHgpO1xyXG4gICAgICAgIGNvbnN0IGNBID0gbGVycChjQUEsIGNCQSwgdHkpO1xyXG4gICAgICAgIGNvbnN0IGNCID0gbGVycChjQUIsIGNCQiwgdHkpO1xyXG4gICAgICAgIGNvbnN0IGMgPSBsZXJwKGNBLCBjQiwgdHopO1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5jbGFtcChjICogMC41ICsgMC41LCAwLCAxKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRXb3JsZXkyRFBvc2l0aW9uQXRHcmlkKHg6IG51bWJlciwgeTogbnVtYmVyLCBzZWVkOiBudW1iZXIsIG9mZnNldEFtcDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgeG8gPSAodGhpcy5yYW5kb21Db25zdGFudDMoeCwgeSwgc2VlZCsxKSAtIDAuNSkgKiBvZmZzZXRBbXA7XHJcbiAgICAgICAgY29uc3QgeW8gPSAodGhpcy5yYW5kb21Db25zdGFudDMoeCwgeSwgc2VlZCsyKSAtIDAuNSkgKiBvZmZzZXRBbXA7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHggKyB4bywgeSArIHlvKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRXb3JsZXkyRFZhbHVlQXRHcmlkKHg6IG51bWJlciwgeTogbnVtYmVyLCBzZWVkOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yYW5kb21Db25zdGFudDMoeCwgeSwgc2VlZCk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0V29ybGV5MkRBdCh4OiBudW1iZXIsIHk6IG51bWJlciwgc2VlZDogbnVtYmVyLCBvZmZzZXRBbXA6IG51bWJlciwgc2VhcmNoPzogbnVtYmVyKSB7XHJcbiAgICAgICAgc2VhcmNoID0gc2VhcmNoID8/IE1hdGguY2VpbChvZmZzZXRBbXApICsgMTtcclxuICAgICAgICBjb25zdCBneCA9IE1hdGguZmxvb3IoeCk7XHJcbiAgICAgICAgY29uc3QgZ3kgPSBNYXRoLmZsb29yKHkpO1xyXG4gICAgICAgIGxldCBtaW5EaXN0ID0gSW5maW5pdHk7XHJcbiAgICAgICAgbGV0IG1pbkRpc3QyID0gSW5maW5pdHk7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gMDtcclxuICAgICAgICBsZXQgdmFsdWUyID0gMDtcclxuICAgICAgICBmb3IobGV0IGl4PWd4LXNlYXJjaDsgaXg8PWd4K3NlYXJjaDsgaXgrKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IGl5PWd5LXNlYXJjaDsgaXk8PWd5K3NlYXJjaDsgaXkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBvaW50ID0gdGhpcy5nZXRXb3JsZXkyRFBvc2l0aW9uQXRHcmlkKGl4LCBpeSwgc2VlZCwgb2Zmc2V0QW1wKTtcclxuICAgICAgICAgICAgICAgIGxldCBkaXN0ID0gcG9pbnQuZGlzdFRvQyh4LCB5KTtcclxuICAgICAgICAgICAgICAgIGlmKGRpc3QgPCBtaW5EaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWluRGlzdDIgPSBtaW5EaXN0O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlMiA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbkRpc3QgPSBkaXN0O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5nZXRXb3JsZXkyRFZhbHVlQXRHcmlkKGl4LCBpeSwgc2VlZCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoZGlzdCA8IG1pbkRpc3QyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWluRGlzdDIgPSBkaXN0O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlMiA9IHRoaXMuZ2V0V29ybGV5MkRWYWx1ZUF0R3JpZChpeCwgaXksIHNlZWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7IHZhbHVlLCB2YWx1ZTIsIG1pbkRpc3QsIG1pbkRpc3QyIH07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0V29ybGV5M0RQb3NpdGlvbkF0R3JpZCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBzZWVkOiBudW1iZXIsIG9mZnNldEFtcDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgeG8gPSAodGhpcy5yYW5kb21Db25zdGFudDQoeCwgeSwgeiwgc2VlZCsxKSAtIDAuNSkgKiBvZmZzZXRBbXA7XHJcbiAgICAgICAgY29uc3QgeW8gPSAodGhpcy5yYW5kb21Db25zdGFudDQoeCwgeSwgeiwgc2VlZCsyKSAtIDAuNSkgKiBvZmZzZXRBbXA7XHJcbiAgICAgICAgY29uc3Qgem8gPSAodGhpcy5yYW5kb21Db25zdGFudDQoeCwgeSwgeiwgc2VlZCszKSAtIDAuNSkgKiBvZmZzZXRBbXA7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHggKyB4bywgeSArIHlvLCB6ICsgem8pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldFdvcmxleTNEVmFsdWVBdEdyaWQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgc2VlZDogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmFuZG9tQ29uc3RhbnQ0KHgsIHksIHosIHNlZWQpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldFdvcmxleTNEQXQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgc2VlZDogbnVtYmVyLCBvZmZzZXRBbXA6IG51bWJlciwgc2VhcmNoPzogbnVtYmVyKSB7XHJcbiAgICAgICAgc2VhcmNoID0gc2VhcmNoID8/IE1hdGguY2VpbChvZmZzZXRBbXApICsgMTtcclxuICAgICAgICBjb25zdCBneCA9IE1hdGguZmxvb3IoeCk7XHJcbiAgICAgICAgY29uc3QgZ3kgPSBNYXRoLmZsb29yKHkpO1xyXG4gICAgICAgIGNvbnN0IGd6ID0gTWF0aC5mbG9vcih6KTtcclxuICAgICAgICBsZXQgbWluRGlzdCA9IEluZmluaXR5O1xyXG4gICAgICAgIGxldCBtaW5EaXN0MiA9IEluZmluaXR5O1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IDA7XHJcbiAgICAgICAgbGV0IHZhbHVlMiA9IDA7XHJcbiAgICAgICAgZm9yKGxldCBpeD1neC1zZWFyY2g7IGl4PD1neCtzZWFyY2g7IGl4KyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCBpeT1neS1zZWFyY2g7IGl5PD1neStzZWFyY2g7IGl5KyspIHtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaXo9Z3otc2VhcmNoOyBpejw9Z3orc2VhcmNoOyBpeisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBvaW50ID0gdGhpcy5nZXRXb3JsZXkzRFBvc2l0aW9uQXRHcmlkKGl4LCBpeSwgaXosIHNlZWQsIG9mZnNldEFtcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRpc3QgPSBwb2ludC5kaXN0VG9DKHgsIHksIHopO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGRpc3QgPCBtaW5EaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbkRpc3QyID0gbWluRGlzdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUyID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbkRpc3QgPSBkaXN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuZ2V0V29ybGV5M0RWYWx1ZUF0R3JpZChpeCwgaXksIGl6LCBzZWVkKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoZGlzdCA8IG1pbkRpc3QyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbkRpc3QyID0gZGlzdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUyID0gdGhpcy5nZXRXb3JsZXkzRFZhbHVlQXRHcmlkKGl4LCBpeSwgaXosIHNlZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geyB2YWx1ZSwgdmFsdWUyLCBtaW5EaXN0LCBtaW5EaXN0MiB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgQ0FNRVJBIENMQVNTRVMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGNsYXNzIENhbWVyYTNEIHtcclxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uPzogVmVjMywgZm92WT86IG51bWJlciwgYXNwZWN0PzogbnVtYmVyLCBuZWFyPzogbnVtYmVyLCBmYXI/OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb24gPz8gVmVjMy56ZXJvKCk7XHJcbiAgICAgICAgdGhpcy5mb3ZZID0gZm92WSA/PyA5NS8xODAqTWF0aC5QSTtcclxuICAgICAgICB0aGlzLmFzcGVjdCA9IGFzcGVjdCA/PyAxO1xyXG4gICAgICAgIHRoaXMubmVhciA9IG5lYXIgPz8gMC4xO1xyXG4gICAgICAgIHRoaXMuZmFyID0gZmFyID8/IDEwMDAwO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSBWZWMzLnplcm8oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9mb3ZZITogbnVtYmVyO1xyXG4gICAgZ2V0IGZvdlkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Zvdlk7XHJcbiAgICB9XHJcbiAgICBzZXQgZm92WShuOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9mb3ZZID0gbjtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZFBlcnNwZWN0aXZlTWF0cml4ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9hc3BlY3QhOiBudW1iZXI7XHJcbiAgICBnZXQgYXNwZWN0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hc3BlY3Q7XHJcbiAgICB9XHJcbiAgICBzZXQgYXNwZWN0KG46IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2FzcGVjdCA9IG47XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRQZXJzcGVjdGl2ZU1hdHJpeCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfbmVhciE6IG51bWJlcjtcclxuICAgIGdldCBuZWFyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9uZWFyO1xyXG4gICAgfVxyXG4gICAgc2V0IG5lYXIobjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fbmVhciA9IG47XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRQZXJzcGVjdGl2ZU1hdHJpeCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZmFyITogbnVtYmVyO1xyXG4gICAgZ2V0IGZhcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZmFyO1xyXG4gICAgfVxyXG4gICAgc2V0IGZhcihuOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9mYXIgPSBuO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkUGVyc3BlY3RpdmVNYXRyaXggPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3Bvc2l0aW9uITogVmVjMztcclxuICAgIGdldCBwb3NpdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9zaXRpb247XHJcbiAgICB9XHJcbiAgICBzZXQgcG9zaXRpb24odjogVmVjMykge1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gdjtcclxuICAgICAgICB2Lm9uTXV0YXRlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFRyYW5zbGF0aW9uTWF0cml4ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRWaWV3TWF0cml4ID0gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHYubXV0YXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfd29ybGRTY2FsZSA9IDE7XHJcbiAgICBnZXQgd29ybGRTY2FsZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd29ybGRTY2FsZTtcclxuICAgIH1cclxuICAgIHNldCB3b3JsZFNjYWxlKG46IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3dvcmxkU2NhbGUgPSBuO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkVHJhbnNsYXRpb25NYXRyaXggPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkVmlld01hdHJpeCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcm90YXRpb24hOiBWZWMzO1xyXG4gICAgZ2V0IHJvdGF0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yb3RhdGlvbjtcclxuICAgIH1cclxuICAgIHNldCByb3RhdGlvbih2OiBWZWMzKSB7XHJcbiAgICAgICAgdGhpcy5fcm90YXRpb24gPSB2O1xyXG4gICAgICAgIHYub25NdXRhdGUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkRm9yd2FyZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkUmlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFVwID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRGb3J3YXJkRmxhdCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkUm90YXRpb25NYXRyaXggPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFZpZXdNYXRyaXggPSB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdi5tdXRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9mb3J3YXJkID0gVmVjMy56ZXJvKCk7XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZEZvcndhcmQ/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGdldCBmb3J3YXJkKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlRm9yd2FyZCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3J3YXJkO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlRm9yd2FyZCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZEZvcndhcmQgIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX2ZvcndhcmQgPSBWZWMzLnpBeGlzKCkubmVnU2VsZigpLnJvdFhZWlNlbGYodGhpcy5fcm90YXRpb24pO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZEZvcndhcmQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmlnaHQgPSBWZWMzLnplcm8oKTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkUmlnaHQ/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGdldCByaWdodCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJpZ2h0KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JpZ2h0O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlUmlnaHQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRSaWdodCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fcmlnaHQgPSBWZWMzLnhBeGlzKCkucm90WFlaU2VsZih0aGlzLl9yb3RhdGlvbik7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkUmlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdXAgPSBWZWMzLnplcm8oKTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkVXA/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGdldCB1cCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVVwKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VwO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlVXAoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRVcCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fdXAgPSBWZWMzLnlBeGlzKCkucm90WFlaU2VsZih0aGlzLl9yb3RhdGlvbik7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkVXA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZm9yd2FyZEZsYXQgPSBWZWMzLnplcm8oKTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkRm9yd2FyZEZsYXQ/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGdldCBmb3J3YXJkRmxhdCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUZvcndhcmRGbGF0KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZvcndhcmRGbGF0O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlRm9yd2FyZEZsYXQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRGb3J3YXJkRmxhdCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fZm9yd2FyZEZsYXQgPSBWZWMzLnpBeGlzKCkubmVnU2VsZigpLnJvdFlTZWxmKHRoaXMuX3JvdGF0aW9uLnkpO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZEZvcndhcmRGbGF0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3BlcnNwZWN0aXZlTWF0cml4OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRQZXJzcGVjdGl2ZU1hdHJpeD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIHBlcnNwZWN0aXZlTWF0cml4T2JzZXJ2ZXIgPSBuZXcgU2lnbmFsKHsgb25Db25uZWN0OiBjb25uID0+IGNvbm4uZmlyZSh0aGlzLnBlcnNwZWN0aXZlTWF0cml4KSB9KTtcclxuICAgIGdldCBwZXJzcGVjdGl2ZU1hdHJpeCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVBlcnNwZWN0aXZlTWF0cml4KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BlcnNwZWN0aXZlTWF0cml4O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlUGVyc3BlY3RpdmVNYXRyaXgoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRQZXJzcGVjdGl2ZU1hdHJpeCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fcGVyc3BlY3RpdmVNYXRyaXggPSBNYXQ0LnBlcnNwZWN0aXZlKHRoaXMuX2ZvdlksIHRoaXMuX2FzcGVjdCwgdGhpcy5fbmVhciwgdGhpcy5fZmFyKTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRQZXJzcGVjdGl2ZU1hdHJpeDtcclxuICAgICAgICB0aGlzLnBlcnNwZWN0aXZlTWF0cml4T2JzZXJ2ZXIuZmlyZSh0aGlzLl9wZXJzcGVjdGl2ZU1hdHJpeCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdHJhbnNsYXRpb25NYXRyaXg6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZFRyYW5zbGF0aW9uTWF0cml4PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgdHJhbnNsYXRpb25NYXRyaXhPYnNlcnZlciA9IG5ldyBTaWduYWwoeyBvbkNvbm5lY3Q6IGNvbm4gPT4gY29ubi5maXJlKHRoaXMudHJhbnNsYXRpb25NYXRyaXgpIH0pO1xyXG4gICAgZ2V0IHRyYW5zbGF0aW9uTWF0cml4KCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVHJhbnNsYXRpb25NYXRyaXgoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRpb25NYXRyaXg7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVUcmFuc2xhdGlvbk1hdHJpeCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFRyYW5zbGF0aW9uTWF0cml4ICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl90cmFuc2xhdGlvbk1hdHJpeCA9IE1hdDQudHJhbnNsYXRlKC10aGlzLl9wb3NpdGlvbi54ICogdGhpcy5fd29ybGRTY2FsZSwgLXRoaXMuX3Bvc2l0aW9uLnkgKiB0aGlzLl93b3JsZFNjYWxlLCAtdGhpcy5fcG9zaXRpb24ueiAqIHRoaXMuX3dvcmxkU2NhbGUpO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFRyYW5zbGF0aW9uTWF0cml4O1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRpb25NYXRyaXhPYnNlcnZlci5maXJlKHRoaXMuX3ZpZXdNYXRyaXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JvdGF0aW9uTWF0cml4OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRSb3RhdGlvbk1hdHJpeD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIHJvdGF0aW9uTWF0cml4T2JzZXJ2ZXIgPSBuZXcgU2lnbmFsKHsgb25Db25uZWN0OiBjb25uID0+IGNvbm4uZmlyZSh0aGlzLnJvdGF0aW9uTWF0cml4KSB9KTtcclxuICAgIGdldCByb3RhdGlvbk1hdHJpeCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJvdGF0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvdGF0aW9uTWF0cml4O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlUm90YXRpb25NYXRyaXgoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRSb3RhdGlvbk1hdHJpeCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fcm90YXRpb25NYXRyaXggPSBNYXQ0Lm11bHRpcGx5KFxyXG4gICAgICAgICAgICBNYXQ0LnJvdGF0ZVooLXRoaXMuX3JvdGF0aW9uLnopLFxyXG4gICAgICAgICAgICBNYXQ0Lm11bHRpcGx5KFxyXG4gICAgICAgICAgICAgICAgTWF0NC5yb3RhdGVYKC10aGlzLl9yb3RhdGlvbi54KSxcclxuICAgICAgICAgICAgICAgIE1hdDQucm90YXRlWSgtdGhpcy5fcm90YXRpb24ueSksXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICApO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFJvdGF0aW9uTWF0cml4O1xyXG4gICAgICAgIHRoaXMucm90YXRpb25NYXRyaXhPYnNlcnZlci5maXJlKHRoaXMuX3ZpZXdNYXRyaXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3ZpZXdNYXRyaXg6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZFZpZXdNYXRyaXg/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyB2aWV3TWF0cml4T2JzZXJ2ZXIgPSBuZXcgU2lnbmFsKHsgb25Db25uZWN0OiBjb25uID0+IGNvbm4uZmlyZSh0aGlzLnZpZXdNYXRyaXgpIH0pO1xyXG4gICAgZ2V0IHZpZXdNYXRyaXgoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaWV3TWF0cml4KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZpZXdNYXRyaXg7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVWaWV3TWF0cml4KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkVmlld01hdHJpeCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fdmlld01hdHJpeCA9IE1hdDQubXVsdGlwbHkodGhpcy5yb3RhdGlvbk1hdHJpeCwgdGhpcy50cmFuc2xhdGlvbk1hdHJpeCk7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkVmlld01hdHJpeDtcclxuICAgICAgICB0aGlzLnZpZXdNYXRyaXhPYnNlcnZlci5maXJlKHRoaXMuX3ZpZXdNYXRyaXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NvbWJpbmVkTWF0cml4OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRDb21iaW5lZE1hdHJpeD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIGNvbWJpbmVkTWF0cml4T2JzZXJ2ZXIgPSBuZXcgU2lnbmFsKHsgb25Db25uZWN0OiBjb25uID0+IGNvbm4uZmlyZSh0aGlzLmNvbWJpbmVkTWF0cml4KSB9KTtcclxuICAgIGdldCBjb21iaW5lZE1hdHJpeCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNvbWJpbmVkTWF0cml4KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbWJpbmVkTWF0cml4O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlQ29tYmluZWRNYXRyaXgoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRDb21iaW5lZE1hdHJpeCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fY29tYmluZWRNYXRyaXggPSBNYXQzLm11bHRpcGx5KHRoaXMudmlld01hdHJpeCwgdGhpcy5wZXJzcGVjdGl2ZU1hdHJpeCk7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkQ29tYmluZWRNYXRyaXg7XHJcbiAgICAgICAgdGhpcy5jb21iaW5lZE1hdHJpeE9ic2VydmVyLmZpcmUodGhpcy5fY29tYmluZWRNYXRyaXgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvb2tBdChwOiBWZWMzKSB7XHJcbiAgICAgICAgbGV0IGYgPSB0aGlzLnBvc2l0aW9uLmxvb2socCk7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbiA9IG5ldyBWZWMzKGYucGl0Y2goKSwgZi55YXcoKSwgMCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDYW1lcmEyRCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbj86IFZlYzIsIHNjYWxlPzogVmVjMikge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbiA/PyBWZWMyLnplcm8oKTtcclxuICAgICAgICB0aGlzLnNjYWxlID0gc2NhbGUgPz8gVmVjMi5maWxsKDEpO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3Bvc2l0aW9uITogVmVjMjtcclxuICAgIGdldCBwb3NpdGlvbigpIHsgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uOyB9XHJcbiAgICBzZXQgcG9zaXRpb24odmFsdWU6IFZlYzIpIHtcclxuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uLm9uTXV0YXRlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFRyYW5zbGF0aW9uTWF0cml4ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRWaWV3TWF0cml4ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24ubXV0YXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2NhbGUhOiBWZWMyO1xyXG4gICAgZ2V0IHNjYWxlKCkgeyByZXR1cm4gdGhpcy5fc2NhbGU7IH1cclxuICAgIHNldCBzY2FsZSh2YWx1ZTogVmVjMikge1xyXG4gICAgICAgIHRoaXMuX3NjYWxlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fc2NhbGUub25NdXRhdGUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkU2NhbGVNYXRyaXggPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFZpZXdNYXRyaXggPSB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fc2NhbGUubXV0YXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcm90YXRpb24hOiBudW1iZXI7XHJcbiAgICBnZXQgcm90YXRpb24oKSB7IHJldHVybiB0aGlzLl9yb3RhdGlvbjsgfVxyXG4gICAgc2V0IHJvdGF0aW9uKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9yb3RhdGlvbiA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkUm90YXRpb25NYXRyaXggPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkVmlld01hdHJpeCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSaWdodCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRVcCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmlnaHQgPSBWZWMyLnplcm8oKTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkUmlnaHQ/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGdldCByaWdodCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJpZ2h0KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JpZ2h0O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlUmlnaHQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRSaWdodCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fcmlnaHQgPSBWZWMyLnhBeGlzKCkucm90YXRlU2VsZih0aGlzLl9yb3RhdGlvbik7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkUmlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdXAgPSBWZWMyLnplcm8oKTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkVXA/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGdldCB1cCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVVwKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VwO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlVXAoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRVcCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fdXAgPSBWZWMyLnlBeGlzKCkucm90YXRlU2VsZih0aGlzLl9yb3RhdGlvbik7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkVXA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdHJhbnNsYXRpb25NYXRyaXg6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZFRyYW5zbGF0aW9uTWF0cml4PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgdHJhbnNsYXRpb25NYXRyaXhPYnNlcnZlciA9IG5ldyBTaWduYWwoeyBvbkNvbm5lY3Q6IGNvbm4gPT4gY29ubi5maXJlKHRoaXMudHJhbnNsYXRpb25NYXRyaXgpIH0pO1xyXG4gICAgZ2V0IHRyYW5zbGF0aW9uTWF0cml4KCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVHJhbnNsYXRpb25NYXRyaXgoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRpb25NYXRyaXg7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVUcmFuc2xhdGlvbk1hdHJpeCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFRyYW5zbGF0aW9uTWF0cml4ICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl90cmFuc2xhdGlvbk1hdHJpeCA9IE1hdDMudHJhbnNsYXRlKC10aGlzLnBvc2l0aW9uLngsIC10aGlzLnBvc2l0aW9uLnkpO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFZpZXdNYXRyaXg7XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGlvbk1hdHJpeE9ic2VydmVyLmZpcmUodGhpcy5fdHJhbnNsYXRpb25NYXRyaXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JvdGF0aW9uTWF0cml4OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRSb3RhdGlvbk1hdHJpeD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIHJvdGF0aW9uTWF0cml4T2JzZXJ2ZXIgPSBuZXcgU2lnbmFsKHsgb25Db25uZWN0OiBjb25uID0+IGNvbm4uZmlyZSh0aGlzLnJvdGF0aW9uTWF0cml4KSB9KTtcclxuICAgIGdldCByb3RhdGlvbk1hdHJpeCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJvdGF0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvdGF0aW9uTWF0cml4O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlUm90YXRpb25NYXRyaXgoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRSb3RhdGlvbk1hdHJpeCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fcm90YXRpb25NYXRyaXggPSBNYXQzLnJvdGF0ZSh0aGlzLnJvdGF0aW9uKTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRSb3RhdGlvbk1hdHJpeDtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uTWF0cml4T2JzZXJ2ZXIuZmlyZSh0aGlzLl9yb3RhdGlvbk1hdHJpeCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2NhbGVNYXRyaXg6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZFNjYWxlTWF0cml4PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgc2NhbGVNYXRyaXhPYnNlcnZlciA9IG5ldyBTaWduYWwoeyBvbkNvbm5lY3Q6IGNvbm4gPT4gY29ubi5maXJlKHRoaXMuc2NhbGVNYXRyaXgpIH0pO1xyXG4gICAgZ2V0IHNjYWxlTWF0cml4KCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2NhbGVNYXRyaXgoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGVNYXRyaXg7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVTY2FsZU1hdHJpeCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFNjYWxlTWF0cml4ICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl9zY2FsZU1hdHJpeCA9IE1hdDMuc2NhbGUodGhpcy5zY2FsZS54LCB0aGlzLnNjYWxlLnkpO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFNjYWxlTWF0cml4O1xyXG4gICAgICAgIHRoaXMuc2NhbGVNYXRyaXhPYnNlcnZlci5maXJlKHRoaXMuX3NjYWxlTWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF92aWV3TWF0cml4OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRWaWV3TWF0cml4PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgdmlld01hdHJpeE9ic2VydmVyID0gbmV3IFNpZ25hbCh7IG9uQ29ubmVjdDogY29ubiA9PiBjb25uLmZpcmUodGhpcy52aWV3TWF0cml4KSB9KTtcclxuICAgIGdldCB2aWV3TWF0cml4KCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlld01hdHJpeCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92aWV3TWF0cml4O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlVmlld01hdHJpeCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFZpZXdNYXRyaXggIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3ZpZXdNYXRyaXggPSBNYXQzLm11bHRpcGx5KHRoaXMuc2NhbGVNYXRyaXgsIE1hdDMubXVsdGlwbHkodGhpcy50cmFuc2xhdGlvbk1hdHJpeCwgdGhpcy5yb3RhdGlvbk1hdHJpeCkpO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFZpZXdNYXRyaXg7XHJcbiAgICAgICAgdGhpcy52aWV3TWF0cml4T2JzZXJ2ZXIuZmlyZSh0aGlzLl92aWV3TWF0cml4KTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBNRVNIIENMQVNTRVMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBUcmlNZXNoM0Qge1xyXG4gICAgcG9zaXRpb25zOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgdGV4Y29vcmRzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgbm9ybWFsczogbnVtYmVyW10gPSBbXTtcclxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gICAgY2xvbmUoKTogVHJpTWVzaDNEIHtcclxuICAgICAgICByZXR1cm4gbmV3IFRyaU1lc2gzRCgpLmFwcGVuZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2xhdGVTZWxmKHY6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGVTZWxmQyh2LngsIHYueSwgdi56KTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2xhdGVTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5wb3NpdGlvbnMubGVuZ3RoOyBpKz0zKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2ldISArPSB4O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzFdISArPSB5O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzJdISArPSB6O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzY2FsZVNlbGYodjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNjYWxlU2VsZkModi54LCB2LnksIHYueik7XHJcbiAgICB9XHJcblxyXG4gICAgc2NhbGVTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5wb3NpdGlvbnMubGVuZ3RoOyBpKz0zKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2ldISAqPSB4O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzFdISAqPSB5O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzJdISAqPSB6O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICByb3RhdGVTZWxmKHY6IFZlYzMpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3RhdGVTZWxmQyh2LngsIHYueSwgdi56KTtcclxuICAgIH1cclxuXHJcbiAgICByb3RhdGVTZWxmQyhheDogbnVtYmVyLCBheTogbnVtYmVyLCBhejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5wb3NpdGlvbnMubGVuZ3RoOyBpKz0zKSB7XHJcbiAgICAgICAgICAgIGxldCBwID0gbmV3IFZlYzModGhpcy5wb3NpdGlvbnNbaV0hLCB0aGlzLnBvc2l0aW9uc1tpKzFdISwgdGhpcy5wb3NpdGlvbnNbaSsyXSEpO1xyXG4gICAgICAgICAgICBwLnJvdFhZWlNlbGZDKGF4LCBheSwgYXopO1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpXSA9IHAueDtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsxXSA9IHAueTtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsyXSA9IHAuejtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5ub3JtYWxzLmxlbmd0aDsgaSs9Mykge1xyXG4gICAgICAgICAgICBsZXQgcCA9IG5ldyBWZWMzKHRoaXMubm9ybWFsc1tpXSEsIHRoaXMubm9ybWFsc1tpKzFdISwgdGhpcy5ub3JtYWxzW2krMl0hKTtcclxuICAgICAgICAgICAgcC5yb3RYWVpTZWxmQyhheCwgYXksIGF6KTtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzW2ldID0gcC54O1xyXG4gICAgICAgICAgICB0aGlzLm5vcm1hbHNbaSsxXSA9IHAueTtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzW2krMl0gPSBwLno7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0ZUFyb3VuZFNlbGYob3JpZ2luOiBWZWMzLCB2OiBWZWMzKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90YXRlQXJvdW5kU2VsZkMob3JpZ2luLngsIG9yaWdpbi55LCBvcmlnaW4ueiwgdi54LCB2LnksIHYueik7XHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRlQXJvdW5kU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgYXg6IG51bWJlciwgYXk6IG51bWJlciwgYXo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZVNlbGZDKC14LCAteSwgLXopLnJvdGF0ZVNlbGZDKGF4LCBheSwgYXopLnRyYW5zbGF0ZVNlbGZDKHgsIHksIHopO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGVuZCguLi5tZXNoZXM6IFRyaU1lc2gzRFtdKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGNvbnN0IG1lc2ggb2YgbWVzaGVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zLnB1c2goLi4ubWVzaC5wb3NpdGlvbnMpO1xyXG4gICAgICAgICAgICB0aGlzLnRleGNvb3Jkcy5wdXNoKC4uLm1lc2gudGV4Y29vcmRzKTtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzLnB1c2goLi4ubWVzaC5ub3JtYWxzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBnZXRMaW5lcyhwb3NpdGlvbnM6IG51bWJlcltdKTogbnVtYmVyW10ge1xyXG4gICAgICAgIGxldCBlZGdlczogbnVtYmVyW10gPSBbXTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxwb3NpdGlvbnMubGVuZ3RoOyBpKz05KSB7XHJcbiAgICAgICAgICAgIGVkZ2VzLnB1c2gocG9zaXRpb25zW2ldISwgcG9zaXRpb25zW2krMV0hLCBwb3NpdGlvbnNbaSsyXSEsIHBvc2l0aW9uc1tpKzNdISwgcG9zaXRpb25zW2krNF0hLCBwb3NpdGlvbnNbaSs1XSEpO1xyXG4gICAgICAgICAgICBlZGdlcy5wdXNoKHBvc2l0aW9uc1tpKzNdISwgcG9zaXRpb25zW2krNF0hLCBwb3NpdGlvbnNbaSs1XSEsIHBvc2l0aW9uc1tpKzZdISwgcG9zaXRpb25zW2krN10hLCBwb3NpdGlvbnNbaSs4XSEpO1xyXG4gICAgICAgICAgICBlZGdlcy5wdXNoKHBvc2l0aW9uc1tpKzZdISwgcG9zaXRpb25zW2krN10hLCBwb3NpdGlvbnNbaSs4XSEsIHBvc2l0aW9uc1tpXSEsIHBvc2l0aW9uc1tpKzFdISwgcG9zaXRpb25zW2krMl0hKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVkZ2VzO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRRdWFkTGluZXMocG9zaXRpb25zOiBudW1iZXJbXSk6IG51bWJlcltdIHtcclxuICAgICAgICBsZXQgZWRnZXM6IG51bWJlcltdID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8cG9zaXRpb25zLmxlbmd0aDsgaSs9MTgpIHtcclxuICAgICAgICAgICAgZWRnZXMucHVzaChwb3NpdGlvbnNbaV0hLCBwb3NpdGlvbnNbaSsxXSEsIHBvc2l0aW9uc1tpKzJdISwgcG9zaXRpb25zW2krM10hLCBwb3NpdGlvbnNbaSs0XSEsIHBvc2l0aW9uc1tpKzVdISk7XHJcbiAgICAgICAgICAgIGVkZ2VzLnB1c2gocG9zaXRpb25zW2krM10hLCBwb3NpdGlvbnNbaSs0XSEsIHBvc2l0aW9uc1tpKzVdISwgcG9zaXRpb25zW2krNl0hLCBwb3NpdGlvbnNbaSs3XSEsIHBvc2l0aW9uc1tpKzhdISk7XHJcbiAgICAgICAgICAgIGVkZ2VzLnB1c2gocG9zaXRpb25zW2krNl0hLCBwb3NpdGlvbnNbaSs3XSEsIHBvc2l0aW9uc1tpKzhdISwgcG9zaXRpb25zW2krOV0hLCBwb3NpdGlvbnNbaSsxMF0hLCBwb3NpdGlvbnNbaSsxMV0hKTtcclxuICAgICAgICAgICAgZWRnZXMucHVzaChwb3NpdGlvbnNbaSs5XSEsIHBvc2l0aW9uc1tpKzEwXSEsIHBvc2l0aW9uc1tpKzExXSEsIHBvc2l0aW9uc1tpKzEyXSEsIHBvc2l0aW9uc1tpKzEzXSEsIHBvc2l0aW9uc1tpKzE0XSEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZWRnZXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUcmlNZXNoMkQge1xyXG4gICAgcG9zaXRpb25zOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgdGV4Y29vcmRzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgIFxyXG4gICAgY2xvbmUoKTogVHJpTWVzaDJEIHtcclxuICAgICAgICByZXR1cm4gbmV3IFRyaU1lc2gyRCgpLmFwcGVuZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2xhdGVTZWxmKHY6IFZlYzIpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGVTZWxmQyh2LngsIHYueSk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNsYXRlU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTIpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaV0hICs9IHg7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMV0hICs9IHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNjYWxlU2VsZih2OiBWZWMyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbGVTZWxmQyh2LngsIHYueSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2NhbGVTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mikge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpXSEgKj0geDtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsxXSEgKj0geTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRlU2VsZihhOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTIpIHtcclxuICAgICAgICAgICAgbGV0IHAgPSBuZXcgVmVjMih0aGlzLnBvc2l0aW9uc1tpXSEsIHRoaXMucG9zaXRpb25zW2krMV0hKTtcclxuICAgICAgICAgICAgcC5yb3RhdGVTZWxmKGEpO1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpXSA9IHAueDtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsxXSA9IHAueTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRlQXJvdW5kU2VsZihvcmlnaW46IFZlYzIsIGE6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvdGF0ZUFyb3VuZFNlbGZDKG9yaWdpbi54LCBvcmlnaW4ueSwgYSk7XHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRlQXJvdW5kU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIGE6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZVNlbGZDKC14LCAteSkucm90YXRlU2VsZihhKS50cmFuc2xhdGVTZWxmQyh4LCB5KTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBlbmQoLi4ubWVzaGVzOiBUcmlNZXNoMkRbXSk6IHRoaXMge1xyXG4gICAgICAgIGZvcihjb25zdCBtZXNoIG9mIG1lc2hlcykge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKC4uLm1lc2gucG9zaXRpb25zKTtcclxuICAgICAgICAgICAgdGhpcy50ZXhjb29yZHMucHVzaCguLi5tZXNoLnRleGNvb3Jkcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUG9seWdvbjJEIHtcclxuICAgIHBvc2l0aW9uczogbnVtYmVyW10gPSBbXTtcclxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gICAgc3RhdGljIGNyZWF0ZVBvc2l0aW9ucyhwb3NpdGlvbnM6IG51bWJlcltdKTogUG9seWdvbjJEIHtcclxuICAgICAgICBjb25zdCBwb2x5ID0gbmV3IFBvbHlnb24yRCgpO1xyXG4gICAgICAgIHBvbHkucG9zaXRpb25zID0gcG9zaXRpb25zO1xyXG4gICAgICAgIHJldHVybiBwb2x5O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZWN0KHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcik6IFBvbHlnb24yRCB7XHJcbiAgICAgICAgY29uc3QgeDAgPSB4IC0gdy8yO1xyXG4gICAgICAgIGNvbnN0IHgxID0geCArIHcvMjtcclxuICAgICAgICBjb25zdCB5MCA9IHkgLSBoLzI7XHJcbiAgICAgICAgY29uc3QgeTEgPSB5ICsgaC8yO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVBvc2l0aW9ucyhbeDAseTAsIHgxLHkwLCB4MSx5MSwgeDAseTFdKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY2lyY2xlKHg6IG51bWJlciwgeTogbnVtYmVyLCByOiBudW1iZXIsIGFyYzogbnVtYmVyID0gTWF0aC5QSSAqIDIsIHN0ZXAgPSBNYXRoLlBJIC8gOCk6IFBvbHlnb24yRCB7XHJcbiAgICAgICAgYXJjID0gRU1hdGguY2xhbXAoYXJjLCAwLCBNYXRoLlBJICogMik7XHJcbiAgICAgICAgbGV0IHBvc2l0aW9uczogbnVtYmVyW10gPSBbXTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxhcmM7IGkrPXN0ZXApIHtcclxuICAgICAgICAgICAgcG9zaXRpb25zLnB1c2goTWF0aC5jb3MoaSkgKiByICsgeCwgTWF0aC5zaW4oaSkgKiByICsgeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBvc2l0aW9ucy5wdXNoKE1hdGguY29zKGFyYykgKiByICsgeCwgTWF0aC5zaW4oYXJjKSAqIHIgKyB5KTtcclxuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVQb3NpdGlvbnMocG9zaXRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY2lyY2xlRmFuKHg6IG51bWJlciwgeTogbnVtYmVyLCByOiBudW1iZXIsIGFyYzogbnVtYmVyID0gTWF0aC5QSSAqIDIsIHN0ZXAgPSBNYXRoLlBJIC8gOCk6IFBvbHlnb24yRCB7XHJcbiAgICAgICAgY29uc3QgcG9seSA9IHRoaXMuY2lyY2xlKHgsIHksIHIsIGFyYywgc3RlcCk7XHJcbiAgICAgICAgcG9seS5wb3NpdGlvbnMuc3BsaWNlKDAsIDAsIHgsIHkpO1xyXG4gICAgICAgIHJldHVybiBwb2x5O1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zbGF0ZVNlbGYodjogVmVjMikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZVNlbGZDKHYueCwgdi55KTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2xhdGVTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mikge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpXSEgKz0geDtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsxXSEgKz0geTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2NhbGVTZWxmKHY6IFZlYzIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zY2FsZVNlbGZDKHYueCwgdi55KTtcclxuICAgIH1cclxuXHJcbiAgICBzY2FsZVNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5wb3NpdGlvbnMubGVuZ3RoOyBpKz0yKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2ldISAqPSB4O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzFdISAqPSB5O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICByb3RhdGVTZWxmKGE6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mykge1xyXG4gICAgICAgICAgICBsZXQgcCA9IG5ldyBWZWMyKHRoaXMucG9zaXRpb25zW2ldISwgdGhpcy5wb3NpdGlvbnNbaSsxXSEpO1xyXG4gICAgICAgICAgICBwLnJvdGF0ZVNlbGYoYSk7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2ldID0gcC54O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzFdID0gcC55O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICByb3RhdGVBcm91bmRTZWxmKG9yaWdpbjogVmVjMiwgYTogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90YXRlQXJvdW5kU2VsZkMob3JpZ2luLngsIG9yaWdpbi55LCBhKTtcclxuICAgIH1cclxuXHJcbiAgICByb3RhdGVBcm91bmRTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgYTogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlU2VsZkMoLXgsIC15KS5yb3RhdGVTZWxmKGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXdQYXRoKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBzeCA9IDEsIHN5ID0gMSkge1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTIpIHtcclxuICAgICAgICAgICAgaWYoaSA9PSAwKSBjdHgubW92ZVRvKHRoaXMucG9zaXRpb25zW2ldISAqIHN4LCB0aGlzLnBvc2l0aW9uc1tpKzFdISAqIHN5KTtcclxuICAgICAgICAgICAgZWxzZSBjdHgubGluZVRvKHRoaXMucG9zaXRpb25zW2ldISAqIHN4LCB0aGlzLnBvc2l0aW9uc1tpKzFdISAqIHN5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRWZXJ0ZXgoaW5kZXg6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIGNvbnN0IGogPSBFTWF0aC5wbW9kKGluZGV4LCBNYXRoLmZsb29yKHRoaXMucG9zaXRpb25zLmxlbmd0aC8yKSkqMjtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5wb3NpdGlvbnNbal0hLCB0aGlzLnBvc2l0aW9uc1tqKzFdISk7XHJcbiAgICB9XHJcblxyXG4gICAgYmV2ZWxTZWxmKGluZGljZXM6IFNldDxudW1iZXI+IHwgbnVtYmVyW10sIGFtb3VudDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgaWYoIShpbmRpY2VzIGluc3RhbmNlb2YgU2V0KSlcclxuICAgICAgICAgICAgaW5kaWNlcyA9IG5ldyBTZXQoaW5kaWNlcyk7XHJcbiAgICAgICAgbGV0IG5ld1Bvc2l0aW9uczogbnVtYmVyW10gPSBbXTtcclxuICAgICAgICBsZXQgbGVuID0gTWF0aC5mbG9vcih0aGlzLnBvc2l0aW9ucy5sZW5ndGgvMik7XHJcbiAgICAgICAgZm9yKGxldCBpbmRleD0wOyBpbmRleDxsZW47IGluZGV4KyspIHtcclxuICAgICAgICAgICAgaWYoIWluZGljZXMuaGFzKGluZGV4KSlcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBsZXQgdkEgPSB0aGlzLmdldFZlcnRleChpbmRleC0xKTtcclxuICAgICAgICAgICAgbGV0IHZCID0gdGhpcy5nZXRWZXJ0ZXgoaW5kZXgpO1xyXG4gICAgICAgICAgICBsZXQgdkMgPSB0aGlzLmdldFZlcnRleChpbmRleCsxKTtcclxuICAgICAgICAgICAgbGV0IHRNYXhBID0gdkEuZGlzdFRvKHZCKTtcclxuICAgICAgICAgICAgbGV0IHRNYXhDID0gdkMuZGlzdFRvKHZCKTtcclxuICAgICAgICAgICAgaWYoaW5kaWNlcy5oYXMoaW5kZXgtMSkpIHRNYXhBIC89IDI7XHJcbiAgICAgICAgICAgIGlmKGluZGljZXMuaGFzKGluZGV4KzEpKSB0TWF4QyAvPSAyO1xyXG4gICAgICAgICAgICBsZXQgYjEgPSB2Qi5hZGRTY2FsZWQodkIubG9vayh2QSksIEVNYXRoLmNsYW1wKGFtb3VudCwgMCwgdE1heEEpKTtcclxuICAgICAgICAgICAgbGV0IGIyID0gdkIuYWRkU2NhbGVkKHZCLmxvb2sodkMpLCBFTWF0aC5jbGFtcChhbW91bnQsIDAsIHRNYXhDKSk7XHJcbiAgICAgICAgICAgIG5ld1Bvc2l0aW9ucy5wdXNoKGIxLngsIGIxLnksIGIyLngsIGIyLnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBvc2l0aW9ucyA9IG5ld1Bvc2l0aW9ucztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBiZXZlbEFsbFNlbGYoYW1vdW50OiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgbmV3UG9zaXRpb25zOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgIGxldCBsZW4gPSBNYXRoLmZsb29yKHRoaXMucG9zaXRpb25zLmxlbmd0aC8yKTtcclxuICAgICAgICBmb3IobGV0IGluZGV4PTA7IGluZGV4PGxlbjsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICBsZXQgdkEgPSB0aGlzLmdldFZlcnRleChpbmRleC0xKTtcclxuICAgICAgICAgICAgbGV0IHZCID0gdGhpcy5nZXRWZXJ0ZXgoaW5kZXgpO1xyXG4gICAgICAgICAgICBsZXQgdkMgPSB0aGlzLmdldFZlcnRleChpbmRleCsxKTtcclxuICAgICAgICAgICAgbGV0IHRNYXhBID0gdkEuZGlzdFRvKHZCKSAvIDI7XHJcbiAgICAgICAgICAgIGxldCB0TWF4QyA9IHZDLmRpc3RUbyh2QikgLyAyO1xyXG4gICAgICAgICAgICBsZXQgYjEgPSB2Qi5hZGRTY2FsZWQodkIubG9vayh2QSksIEVNYXRoLmNsYW1wKGFtb3VudCwgMCwgdE1heEEpKTtcclxuICAgICAgICAgICAgbGV0IGIyID0gdkIuYWRkU2NhbGVkKHZCLmxvb2sodkMpLCBFTWF0aC5jbGFtcChhbW91bnQsIDAsIHRNYXhDKSk7XHJcbiAgICAgICAgICAgIG5ld1Bvc2l0aW9ucy5wdXNoKGIxLngsIGIxLnksIGIyLngsIGIyLnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBvc2l0aW9ucyA9IG5ld1Bvc2l0aW9ucztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBQSFlTSUNTIENMQVNTRVMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCB0eXBlIFNoYXBlMkRDb2xsaXNpb24gPSB7XHJcbiAgICBpbnNpZGU6IGJvb2xlYW4sXHJcbiAgICBjb2xsaXNpb246IFZlYzIsXHJcbiAgICBkaXN0YW5jZTogbnVtYmVyLFxyXG4gICAgbm9ybWFsOiBWZWMyLFxyXG59O1xyXG5cclxuZXhwb3J0IGNsYXNzIFBvaW50MkQge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHBvc2l0aW9uOiBWZWMyKSB7XHJcblxyXG4gICAgfVxyXG4gICAgaXNJbnNpZGVSZWN0KHJlY3Q6IFJlY3QyRCkge1xyXG4gICAgICAgIGxldCBkaWZmID0gdGhpcy5wb3NpdGlvbi5zdWIocmVjdC5wb3NpdGlvbik7XHJcbiAgICAgICAgbGV0IGR4ID0gZGlmZi5kb3QocmVjdC5yaWdodCk7XHJcbiAgICAgICAgbGV0IGR5ID0gZGlmZi5kb3QocmVjdC51cCk7XHJcbiAgICAgICAgcmV0dXJuIChNYXRoLmFicyhkeCkgPD0gcmVjdC5zaXplLnggJiYgTWF0aC5hYnMoZHkpIDw9IHJlY3Quc2l6ZS55KTtcclxuICAgIH1cclxuICAgIGdldFJlY3RDb2xsaXNpb24ocmVjdDogUmVjdDJEKTogU2hhcGUyRENvbGxpc2lvbiB7XHJcbiAgICAgICAgbGV0IGRpZmYgPSB0aGlzLnBvc2l0aW9uLnN1YihyZWN0LnBvc2l0aW9uKTtcclxuICAgICAgICBsZXQgZHggPSBkaWZmLmRvdChyZWN0LnJpZ2h0KTtcclxuICAgICAgICBsZXQgZHkgPSBkaWZmLmRvdChyZWN0LnVwKTtcclxuICAgICAgICBsZXQgaXNJbnNpZGUgPSAoTWF0aC5hYnMoZHgpIDwgcmVjdC5zaXplLnggJiYgTWF0aC5hYnMoZHkpIDwgcmVjdC5zaXplLnkpO1xyXG4gICAgICAgIGlmKGlzSW5zaWRlKSB7XHJcbiAgICAgICAgICAgIGxldCBkMSA9IE1hdGguYWJzKHRoaXMucG9zaXRpb24uc3ViKHJlY3QucG9zaXRpb24uYWRkU2NhbGVkKHJlY3QudXAsIHJlY3Quc2l6ZS55KSkuZG90KHJlY3QudXApKTtcclxuICAgICAgICAgICAgbGV0IGQyID0gTWF0aC5hYnModGhpcy5wb3NpdGlvbi5zdWIocmVjdC5wb3NpdGlvbi5hZGRTY2FsZWQocmVjdC51cCwgLXJlY3Quc2l6ZS55KSkuZG90KHJlY3QudXApKTtcclxuICAgICAgICAgICAgbGV0IGQzID0gTWF0aC5hYnModGhpcy5wb3NpdGlvbi5zdWIocmVjdC5wb3NpdGlvbi5hZGRTY2FsZWQocmVjdC5yaWdodCwgcmVjdC5zaXplLngpKS5kb3QocmVjdC5yaWdodCkpO1xyXG4gICAgICAgICAgICBsZXQgZDQgPSBNYXRoLmFicyh0aGlzLnBvc2l0aW9uLnN1YihyZWN0LnBvc2l0aW9uLmFkZFNjYWxlZChyZWN0LnJpZ2h0LCAtcmVjdC5zaXplLngpKS5kb3QocmVjdC5yaWdodCkpO1xyXG4gICAgICAgICAgICBsZXQgbWluSW5kZXggPSAwO1xyXG4gICAgICAgICAgICBsZXQgbWluRGlzdCA9IGQxO1xyXG4gICAgICAgICAgICBpZihkMiA8IG1pbkRpc3QpIHsgbWluRGlzdCA9IGQyOyBtaW5JbmRleCA9IDE7IH1cclxuICAgICAgICAgICAgaWYoZDMgPCBtaW5EaXN0KSB7IG1pbkRpc3QgPSBkMzsgbWluSW5kZXggPSAyOyB9XHJcbiAgICAgICAgICAgIGlmKGQ0IDwgbWluRGlzdCkgeyBtaW5EaXN0ID0gZDQ7IG1pbkluZGV4ID0gMzsgfVxyXG4gICAgICAgICAgICBsZXQgZWRnZTogVmVjMjtcclxuICAgICAgICAgICAgbGV0IG5vcm1hbDogVmVjMjtcclxuICAgICAgICAgICAgc3dpdGNoKG1pbkluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZSA9IHJlY3QucG9zaXRpb24uYWRkU2NhbGVkKHJlY3QucmlnaHQsIGR4KS5hZGRTY2FsZWQocmVjdC51cCwgcmVjdC5zaXplLnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbCA9IHJlY3QudXA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZSA9IHJlY3QucG9zaXRpb24uYWRkU2NhbGVkKHJlY3QucmlnaHQsIGR4KS5hZGRTY2FsZWQocmVjdC51cCwgLXJlY3Quc2l6ZS55KTtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWwgPSByZWN0LnVwLm5lZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2UgPSByZWN0LnBvc2l0aW9uLmFkZFNjYWxlZChyZWN0LnVwLCBkeSkuYWRkU2NhbGVkKHJlY3QucmlnaHQsIHJlY3Quc2l6ZS54KTtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWwgPSByZWN0LnJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2UgPSByZWN0LnBvc2l0aW9uLmFkZFNjYWxlZChyZWN0LnVwLCBkeSkuYWRkU2NhbGVkKHJlY3QucmlnaHQsIC1yZWN0LnNpemUueCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsID0gcmVjdC5yaWdodC5uZWcoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgaW5zaWRlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29sbGlzaW9uOiBlZGdlISxcclxuICAgICAgICAgICAgICAgIGRpc3RhbmNlOiAtZWRnZSEuZGlzdFRvKHRoaXMucG9zaXRpb24pLFxyXG4gICAgICAgICAgICAgICAgbm9ybWFsOiBub3JtYWwhLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZHggPSBFTWF0aC5jbGFtcChkeCwgLXJlY3Quc2l6ZS54LCByZWN0LnNpemUueCk7XHJcbiAgICAgICAgICAgIGR5ID0gRU1hdGguY2xhbXAoZHksIC1yZWN0LnNpemUueSwgcmVjdC5zaXplLnkpO1xyXG4gICAgICAgICAgICBsZXQgZWRnZSA9IHJlY3QucG9zaXRpb24uYWRkU2NhbGVkKHJlY3QucmlnaHQsIGR4KS5hZGRTY2FsZWQocmVjdC51cCwgZHkpO1xyXG4gICAgICAgICAgICBsZXQgZGlzdCA9IGVkZ2UuZGlzdFRvKHRoaXMucG9zaXRpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgaW5zaWRlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbGxpc2lvbjogZWRnZSxcclxuICAgICAgICAgICAgICAgIGRpc3RhbmNlOiBkaXN0LFxyXG4gICAgICAgICAgICAgICAgbm9ybWFsOiBlZGdlLmxvb2sodGhpcy5wb3NpdGlvbiksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZGlzdFRvQ2lyY2xlKGNpcmNsZTogQ2lyY2xlMkQpIHtcclxuICAgICAgICBsZXQgZGlzdCA9IHRoaXMucG9zaXRpb24uZGlzdFRvKGNpcmNsZS5wb3NpdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIGRpc3QgLSBjaXJjbGUucmFkaXVzO1xyXG4gICAgfVxyXG4gICAgaXNJbnNpZGVDaXJjbGUoY2lyY2xlOiBDaXJjbGUyRCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpc3RUb0NpcmNsZShjaXJjbGUpIDw9IDA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBSYXkyRCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgb3JpZ2luOiBWZWMyLCBwdWJsaWMgZGlyZWN0aW9uOiBWZWMyKSB7XHJcblxyXG4gICAgfVxyXG4gICAgcmF5Y2FzdEdyaWQ8VD4oXHJcbiAgICAgICAgcHJlZGljYXRlOiAocG9zOlZlYzIsIG5vcm1hbDpWZWMyLCBkaXN0Om51bWJlcikgPT4gVCB8IHVuZGVmaW5lZCxcclxuICAgICAgICBtYXhJdGVyYXRpb25zID0gMTAwMFxyXG4gICAgKTogVCB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgY29uc3QgaW52RGlyQWJzID0gdGhpcy5kaXJlY3Rpb24ucmRpdkYoMSkubWFwKHggPT4gTWF0aC5hYnMoeCkpO1xyXG4gICAgICAgIGNvbnN0IHNpZ24gPSB0aGlzLmRpcmVjdGlvbi5tYXAoeCA9PiB4ID4gMCA/IDEgOiAwKTtcclxuICAgICAgICBjb25zdCBzdGVwID0gdGhpcy5kaXJlY3Rpb24ubWFwKHggPT4geCA+IDAgPyAxIDogLTEpO1xyXG4gICAgICAgIGxldCB0TWF4WCA9IGludkRpckFicy54ICogKHNpZ24ueD09PTAgPyAodGhpcy5vcmlnaW4ueCAtIE1hdGguZmxvb3IodGhpcy5vcmlnaW4ueCkpIDogKE1hdGguZmxvb3IodGhpcy5vcmlnaW4ueCkgKyAxIC0gdGhpcy5vcmlnaW4ueCkpO1xyXG4gICAgICAgIGxldCB0TWF4WSA9IGludkRpckFicy55ICogKHNpZ24ueT09PTAgPyAodGhpcy5vcmlnaW4ueSAtIE1hdGguZmxvb3IodGhpcy5vcmlnaW4ueSkpIDogKE1hdGguZmxvb3IodGhpcy5vcmlnaW4ueSkgKyAxIC0gdGhpcy5vcmlnaW4ueSkpO1xyXG4gICAgICAgIGxldCBwb3MgPSBuZXcgVmVjMih0aGlzLm9yaWdpbikubWFwU2VsZih4ID0+IE1hdGguZmxvb3IoeCkpO1xyXG4gICAgICAgIGxldCBkaXN0YW5jZSA9IDA7XHJcbiAgICAgICAgbGV0IG5vcm1hbCA9IFZlYzIuemVybygpO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPG1heEl0ZXJhdGlvbnM7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgcmVzID0gcHJlZGljYXRlKHBvcywgbm9ybWFsLCBkaXN0YW5jZSk7XHJcbiAgICAgICAgICAgIGlmKHJlcyAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICAgICAgaWYodE1heFggPCB0TWF4WSkge1xyXG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSB0TWF4WDtcclxuICAgICAgICAgICAgICAgIG5vcm1hbC5zZXRDKC1zdGVwLngsIDApO1xyXG4gICAgICAgICAgICAgICAgdE1heFggKz0gaW52RGlyQWJzLng7XHJcbiAgICAgICAgICAgICAgICBwb3MueCArPSBzdGVwLng7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IHRNYXhZO1xyXG4gICAgICAgICAgICAgICAgbm9ybWFsLnNldEMoMCwgLXN0ZXAueSk7XHJcbiAgICAgICAgICAgICAgICB0TWF4WSArPSBpbnZEaXJBYnMueTtcclxuICAgICAgICAgICAgICAgIHBvcy55ICs9IHN0ZXAueTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2VnbWVudDJEIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzdGFydDogVmVjMiwgcHVibGljIGVuZDogVmVjMikge1xyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJlY3QyRCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcG9zaXRpb246IFZlYzIsIHNpemU6IFZlYzIsIHJvdGF0aW9uOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSByb3RhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zaXplITogVmVjMjtcclxuICAgIGdldCBzaXplKCkgeyByZXR1cm4gdGhpcy5fc2l6ZTsgfVxyXG4gICAgc2V0IHNpemUodmFsdWU6IFZlYzIpIHtcclxuICAgICAgICB0aGlzLl9zaXplID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcm90YXRpb24hOiBudW1iZXJcclxuICAgIGdldCByb3RhdGlvbigpIHsgcmV0dXJuIHRoaXMuX3JvdGF0aW9uOyB9XHJcbiAgICBzZXQgcm90YXRpb24odmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3JvdGF0aW9uID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmlnaHQgPSBWZWMyLnplcm8oKTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkUmlnaHQ/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGdldCByaWdodCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJpZ2h0KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JpZ2h0O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlUmlnaHQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRSaWdodCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fcmlnaHQgPSBWZWMyLnhBeGlzKCkucm90YXRlU2VsZih0aGlzLl9yb3RhdGlvbik7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkUmlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdXAgPSBWZWMyLnplcm8oKTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkVXA/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGdldCB1cCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVVwKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VwO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlVXAoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRVcCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fdXAgPSBWZWMyLnlBeGlzKCkucm90YXRlU2VsZih0aGlzLl9yb3RhdGlvbik7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkVXA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDaXJjbGUyRCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcG9zaXRpb246IFZlYzIsIHB1YmxpYyByYWRpdXM6IG51bWJlcikge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgZ2V0UmVjdENvbGxpc2lvbihyZWN0OiBSZWN0MkQpOiBTaGFwZTJEQ29sbGlzaW9uIHtcclxuICAgICAgICBsZXQgcmVzID0gbmV3IFBvaW50MkQodGhpcy5wb3NpdGlvbikuZ2V0UmVjdENvbGxpc2lvbihyZWN0KTtcclxuICAgICAgICByZXMuZGlzdGFuY2UgLT0gdGhpcy5yYWRpdXM7XHJcbiAgICAgICAgaWYocmVzLmRpc3RhbmNlIDw9IDApIHJlcy5pbnNpZGUgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICBpc0luc2lkZUNpcmNsZShvdGhlcjogQ2lyY2xlMkQpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi5kaXN0VG8ob3RoZXIucG9zaXRpb24pIDw9IHRoaXMucmFkaXVzICsgb3RoZXIucmFkaXVzXHJcbiAgICB9XHJcbiAgICBnZXRDaXJjbGVDb2xsaXNpb24ob3RoZXI6IENpcmNsZTJEKTogU2hhcGUyRENvbGxpc2lvbiB7XHJcbiAgICAgICAgbGV0IGRpc3QgPSB0aGlzLnBvc2l0aW9uLmRpc3RUbyhvdGhlci5wb3NpdGlvbikgLSB0aGlzLnJhZGl1cyAtIG90aGVyLnJhZGl1cztcclxuICAgICAgICBsZXQgbm9ybWFsID0gdGhpcy5wb3NpdGlvbi5sb29rKG90aGVyLnBvc2l0aW9uKTtcclxuICAgICAgICBsZXQgY29sbGlzaW9uID0gdGhpcy5wb3NpdGlvbi5hZGRTY2FsZWQobm9ybWFsLCB0aGlzLnJhZGl1cyk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgaW5zaWRlOiBkaXN0IDw9IDAsXHJcbiAgICAgICAgICAgIGNvbGxpc2lvbixcclxuICAgICAgICAgICAgZGlzdGFuY2U6IGRpc3QsXHJcbiAgICAgICAgICAgIG5vcm1hbCxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZ2V0U2VnbWVudENvbGxpc2lvbihzZWdtZW50OiBTZWdtZW50MkQpOiBTaGFwZTJEQ29sbGlzaW9uIHtcclxuICAgICAgICBsZXQgZGlyID0gc2VnbWVudC5zdGFydC5sb29rKHNlZ21lbnQuZW5kKTtcclxuICAgICAgICBsZXQgb2ZmID0gdGhpcy5wb3NpdGlvbi5zdWIoc2VnbWVudC5zdGFydCk7XHJcbiAgICAgICAgbGV0IHQgPSBvZmYuZG90KGRpcik7XHJcbiAgICAgICAgbGV0IG1heFQgPSBzZWdtZW50LmVuZC5kaXN0VG8oc2VnbWVudC5zdGFydCk7XHJcbiAgICAgICAgdCA9IEVNYXRoLmNsYW1wKHQsIDAsIG1heFQpO1xyXG4gICAgICAgIGxldCBjb2xsaXNpb24gPSBzZWdtZW50LnN0YXJ0LmFkZFNjYWxlZChkaXIsIHQpO1xyXG4gICAgICAgIGxldCBub3JtYWwgPSBjb2xsaXNpb24ubG9vayh0aGlzLnBvc2l0aW9uKTtcclxuICAgICAgICBsZXQgZGlzdCA9IGNvbGxpc2lvbi5kaXN0VG8odGhpcy5wb3NpdGlvbikgLSB0aGlzLnJhZGl1cztcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBpbnNpZGU6IGRpc3QgPD0gMCxcclxuICAgICAgICAgICAgY29sbGlzaW9uLFxyXG4gICAgICAgICAgICBkaXN0YW5jZTogZGlzdCxcclxuICAgICAgICAgICAgbm9ybWFsLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBsZXQgQ2lyY2xlMkRNZXNoID0gbmV3IFRyaU1lc2gyRCgpO1xyXG5mb3IobGV0IGk9MDsgaTwxNjsgaSsrKSB7XHJcbiAgICBsZXQgYTEgPSBpLzE2ICogTWF0aC5QSSAqIDI7XHJcbiAgICBsZXQgYTIgPSAoaSsxKS8xNiAqIE1hdGguUEkgKiAyO1xyXG4gICAgQ2lyY2xlMkRNZXNoLnBvc2l0aW9ucy5wdXNoKE1hdGguY29zKGExKSwgTWF0aC5zaW4oYTEpKTtcclxuICAgIENpcmNsZTJETWVzaC5wb3NpdGlvbnMucHVzaCgwLCAwKTtcclxuICAgIENpcmNsZTJETWVzaC5wb3NpdGlvbnMucHVzaChNYXRoLmNvcyhhMiksIE1hdGguc2luKGEyKSk7XHJcbn1cclxuZXhwb3J0IGxldCBDaXJjbGUyRFBvc2l0aW9uc0YzMiA9IG5ldyBGbG9hdDMyQXJyYXkoQ2lyY2xlMkRNZXNoLnBvc2l0aW9ucyk7XHJcbmV4cG9ydCBsZXQgUmVjdDJETWVzaCA9IG5ldyBUcmlNZXNoMkQoKTtcclxuUmVjdDJETWVzaC5wb3NpdGlvbnMucHVzaCgtMSwtMSwxLC0xLDEsMSwtMSwtMSwtMSwxLDEsMSk7XHJcbmV4cG9ydCBsZXQgUmVjdDJEUG9zaXRpb25zRjMyID0gbmV3IEZsb2F0MzJBcnJheShSZWN0MkRNZXNoLnBvc2l0aW9ucyk7XHJcblxyXG5leHBvcnQgdHlwZSBQaHlzaWNzUGFydDJEU2hhcGUgPSBcInJlY3RcIiB8IFwiY2lyY2xlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGh5c2ljc1BhcnQyRCB7XHJcbiAgICBhbmNob3JlZDogYm9vbGVhbjtcclxuICAgIHZlbG9jaXR5ID0gVmVjMi56ZXJvKCk7XHJcbiAgICBoYXNDb2xsaXNpb24gPSB0cnVlO1xyXG4gICAgY29sb3I6IENvbG9yO1xyXG4gICAgc2hhZGVyT2JqZWN0ITogV0dMMk9iamVjdDtcclxuICAgIG1hc3M6IG51bWJlcjtcclxuICAgIHJlc3RpdHV0aW9uOiBudW1iZXI7XHJcbiAgICBncmF2aXR5ID0gNTAwO1xyXG4gICAgY29sbGlzaW9uRXZlbnQ6IFNpZ25hbDxbcGFydDogUGh5c2ljc1BhcnQyRF0+ID0gbmV3IFNpZ25hbCgpO1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgc2hhZGVyOiBXR0wyU2hhZGVyLFxyXG4gICAgICAgIHBvc2l0aW9uOiBWZWMyLFxyXG4gICAgICAgIHNpemU6IFZlYzIsXHJcbiAgICAgICAgY29sb3IgPSBuZXcgQ29sb3IoMCwgMCwgMCksXHJcbiAgICAgICAgc2hhcGVUeXBlOiBQaHlzaWNzUGFydDJEU2hhcGUgPSBcImNpcmNsZVwiLFxyXG4gICAgICAgIGFuY2hvcmVkID0gZmFsc2UsXHJcbiAgICAgICAgcmVzdGl0dXRpb24gPSAxLFxyXG4gICAgICAgIG1hc3MgPSAxLFxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5zaGFkZXIgPSBzaGFkZXI7XHJcbiAgICAgICAgdGhpcy5zaGFwZVR5cGUgPSBzaGFwZVR5cGU7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMuYW5jaG9yZWQgPSBhbmNob3JlZDtcclxuICAgICAgICB0aGlzLnJlc3RpdHV0aW9uID0gcmVzdGl0dXRpb247XHJcbiAgICAgICAgdGhpcy5tYXNzID0gbWFzcztcclxuICAgICAgICB0aGlzLnJvdGF0aW9uID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zaGFkZXIhOiBXR0wyU2hhZGVyO1xyXG4gICAgdUNvbG9yPzogV0dMMkNvbXBvbmVudFVuaWZvcm07XHJcbiAgICB1Vmlldz86IFdHTDJDb21wb25lbnRVbmlmb3JtO1xyXG4gICAgZ2V0IHNoYWRlcigpIHsgcmV0dXJuIHRoaXMuX3NoYWRlcjsgfVxyXG4gICAgc2V0IHNoYWRlcih2YWx1ZTogV0dMMlNoYWRlcikge1xyXG4gICAgICAgIHRoaXMuX3NoYWRlciA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudUNvbG9yID0gdmFsdWUuZ2V0VW5pZm9ybShcInVfY29sb3JcIik7XHJcbiAgICAgICAgdGhpcy51VmlldyA9IHZhbHVlLmdldFVuaWZvcm0oXCJ1X3ZpZXdcIik7XHJcbiAgICAgICAgaWYodGhpcy5zaGFkZXJPYmplY3QpXHJcbiAgICAgICAgICAgIHRoaXMuc2hhZGVyT2JqZWN0LmRlbGV0ZSgpO1xyXG4gICAgICAgIHRoaXMuc2hhZGVyT2JqZWN0ID0gdmFsdWUuY3JlYXRlT2JqZWN0KCk7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlU2hhZGVyT2JqZWN0RGF0YSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JvdGF0aW9uITogbnVtYmVyO1xyXG4gICAgZ2V0IHJvdGF0aW9uKCkgeyByZXR1cm4gdGhpcy5fcm90YXRpb247IH1cclxuICAgIHNldCByb3RhdGlvbih2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYodmFsdWUgPT0gdGhpcy5fcm90YXRpb24pXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl9yb3RhdGlvbiA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkUm90YXRpb25NYXRyaXggPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkVmlld01hdHJpeCA9IHRydWU7XHJcbiAgICAgICAgaWYodGhpcy5zaGFwZSBpbnN0YW5jZW9mIFJlY3QyRCkge1xyXG4gICAgICAgICAgICB0aGlzLnNoYXBlLnJvdGF0aW9uID0gdGhpcy5fcm90YXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgfSBcclxuXHJcbiAgICBsYXN0UG9zaXRpb24gPSBWZWMyLnplcm8oKTtcclxuICAgIHByaXZhdGUgX3Bvc2l0aW9uITogVmVjMjtcclxuICAgIGdldCBwb3NpdGlvbigpIHsgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uOyB9XHJcbiAgICBzZXQgcG9zaXRpb24odmFsdWU6IFZlYzIpIHtcclxuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uLm9uTXV0YXRlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFRyYW5zbGF0aW9uTWF0cml4ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRWaWV3TWF0cml4ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24ubXV0YXRlKCk7XHJcbiAgICAgICAgdGhpcy5zaGFwZS5wb3NpdGlvbiA9IHRoaXMuX3Bvc2l0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHNoYXBlITogQ2lyY2xlMkQgfCBSZWN0MkQ7XHJcbiAgICBwcml2YXRlIF9zaGFwZVR5cGUhOiBQaHlzaWNzUGFydDJEU2hhcGU7XHJcbiAgICBnZXQgc2hhcGVUeXBlKCkgeyByZXR1cm4gdGhpcy5fc2hhcGVUeXBlOyB9XHJcbiAgICBzZXQgc2hhcGVUeXBlKHZhbHVlOiBQaHlzaWNzUGFydDJEU2hhcGUpIHtcclxuICAgICAgICB0aGlzLl9zaGFwZVR5cGUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl91cGRhdGVTaGFkZXJPYmplY3REYXRhKCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF91cGRhdGVTaGFkZXJPYmplY3REYXRhKCkge1xyXG4gICAgICAgIGNvbnN0IHNpemUgPSB0aGlzLnNpemUgPz8gVmVjMi56ZXJvKCk7XHJcbiAgICAgICAgc3dpdGNoKHRoaXMuX3NoYXBlVHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwicmVjdFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGFkZXJPYmplY3Quc2V0RGF0YShcImFfcG9zaXRpb25cIiwgUmVjdDJEUG9zaXRpb25zRjMyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hhcGUgPSBuZXcgUmVjdDJEKHRoaXMucG9zaXRpb24sIHNpemUsIHRoaXMucm90YXRpb24pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJjaXJjbGVcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hhZGVyT2JqZWN0LnNldERhdGEoXCJhX3Bvc2l0aW9uXCIsIENpcmNsZTJEUG9zaXRpb25zRjMyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hhcGUgPSBuZXcgQ2lyY2xlMkQodGhpcy5wb3NpdGlvbiwgTWF0aC5taW4oc2l6ZS54LCBzaXplLnkpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zaXplITogVmVjMjtcclxuICAgIGdldCBzaXplKCkgeyByZXR1cm4gdGhpcy5fc2l6ZTsgfVxyXG4gICAgc2V0IHNpemUodmFsdWU6IFZlYzIpIHtcclxuICAgICAgICB0aGlzLl9zaXplID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fc2l6ZS5vbk11dGF0ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRTY2FsZU1hdHJpeCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkVmlld01hdHJpeCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3NpemUubXV0YXRlKCk7XHJcbiAgICAgICAgaWYodGhpcy5zaGFwZSBpbnN0YW5jZW9mIFJlY3QyRCkge1xyXG4gICAgICAgICAgICB0aGlzLnNoYXBlLnNpemUgPSB0aGlzLl9zaXplO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hhcGUucmFkaXVzID0gTWF0aC5taW4odGhpcy5fc2l6ZS54LCB0aGlzLl9zaXplLnkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfdHJhbnNsYXRpb25NYXRyaXg6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZFRyYW5zbGF0aW9uTWF0cml4PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBnZXQgdHJhbnNsYXRpb25NYXRyaXgoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUcmFuc2xhdGlvbk1hdHJpeCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGlvbk1hdHJpeDtcclxuICAgIH1cclxuICAgIHVwZGF0ZVRyYW5zbGF0aW9uTWF0cml4KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkVHJhbnNsYXRpb25NYXRyaXggIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3RyYW5zbGF0aW9uTWF0cml4ID0gTWF0My50cmFuc2xhdGUodGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnkpO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFRyYW5zbGF0aW9uTWF0cml4O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JvdGF0aW9uTWF0cml4OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRSb3RhdGlvbk1hdHJpeD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgZ2V0IHJvdGF0aW9uTWF0cml4KCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUm90YXRpb25NYXRyaXgoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcm90YXRpb25NYXRyaXg7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVSb3RhdGlvbk1hdHJpeCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFJvdGF0aW9uTWF0cml4ICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl9yb3RhdGlvbk1hdHJpeCA9IE1hdDMucm90YXRlKHRoaXMucm90YXRpb24pO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFJvdGF0aW9uTWF0cml4O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3NjYWxlTWF0cml4OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRTY2FsZU1hdHJpeD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgZ2V0IHNjYWxlTWF0cml4KCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2NhbGVNYXRyaXgoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGVNYXRyaXg7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVTY2FsZU1hdHJpeCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFNjYWxlTWF0cml4ICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZih0aGlzLl9zaGFwZVR5cGUgPT0gXCJjaXJjbGVcIikge1xyXG4gICAgICAgICAgICBjb25zdCByYWRpdXMgPSBNYXRoLm1pbih0aGlzLnNpemUueCwgdGhpcy5zaXplLnkpO1xyXG4gICAgICAgICAgICB0aGlzLl9zY2FsZU1hdHJpeCA9IE1hdDMuc2NhbGUocmFkaXVzLCByYWRpdXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlTWF0cml4ID0gTWF0My5zY2FsZSh0aGlzLnNpemUueCwgdGhpcy5zaXplLnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRTY2FsZU1hdHJpeDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF92aWV3TWF0cml4OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRWaWV3TWF0cml4PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBnZXQgdmlld01hdHJpeCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpZXdNYXRyaXgoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmlld01hdHJpeDtcclxuICAgIH1cclxuICAgIHVwZGF0ZVZpZXdNYXRyaXgoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRWaWV3TWF0cml4ICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl92aWV3TWF0cml4ID0gTWF0My5tdWx0aXBseSh0aGlzLnJvdGF0aW9uTWF0cml4LCBNYXQzLm11bHRpcGx5KHRoaXMudHJhbnNsYXRpb25NYXRyaXgsIHRoaXMuc2NhbGVNYXRyaXgpKTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRWaWV3TWF0cml4O1xyXG4gICAgfVxyXG5cclxuICAgIHJlc29sdmVDaXJjbGVDaXJjbGVDb2xsaXNpb24ob3RoZXI6IFBoeXNpY3NQYXJ0MkQpIHtcclxuICAgICAgICBjb25zdCBjaXJjbGVBID0gdGhpcy5zaGFwZSBhcyBDaXJjbGUyRDtcclxuICAgICAgICBjb25zdCBjaXJjbGVCID0gb3RoZXIuc2hhcGUgYXMgQ2lyY2xlMkQ7XHJcbiAgICAgICAgbGV0IGRpc3QgPSB0aGlzLnBvc2l0aW9uLmRpc3RUbyhvdGhlci5wb3NpdGlvbikgLSBjaXJjbGVBLnJhZGl1cyAtIGNpcmNsZUIucmFkaXVzO1xyXG4gICAgICAgIGlmKGRpc3QgPiAwKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgbGV0IG5vcm1hbCA9IHRoaXMucG9zaXRpb24ubG9vayhvdGhlci5wb3NpdGlvbik7XHJcbiAgICAgICAgY29uc3QgdmVsQWxvbmdOb3JtYWwgPSBvdGhlci52ZWxvY2l0eS5zdWIodGhpcy52ZWxvY2l0eSkuZG90KG5vcm1hbCk7XHJcbiAgICAgICAgY29uc3QgbWkgPSAoMS90aGlzLm1hc3MgKyAxL290aGVyLm1hc3MpO1xyXG4gICAgICAgIGlmICh2ZWxBbG9uZ05vcm1hbCA8IDApIHtcclxuICAgICAgICAgICAgY29uc3QgcmVzdGl0dXRpb24gPSBNYXRoLm1pbih0aGlzLnJlc3RpdHV0aW9uLCBvdGhlci5yZXN0aXR1dGlvbik7XHJcbiAgICAgICAgICAgIGNvbnN0IGogPSAtKDErcmVzdGl0dXRpb24pICogdmVsQWxvbmdOb3JtYWwgLyBtaTtcclxuICAgICAgICAgICAgdGhpcy52ZWxvY2l0eS5hZGRTY2FsZWRTZWxmKG5vcm1hbCwgaiAqIC0xIC8gdGhpcy5tYXNzKTtcclxuICAgICAgICAgICAgb3RoZXIudmVsb2NpdHkuYWRkU2NhbGVkU2VsZihub3JtYWwsIGogKiAxIC8gb3RoZXIubWFzcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGNvcnJlY3Rpb24gPSBub3JtYWwucmVzY2FsZShNYXRoLm1heCgtZGlzdCAtIDFlLTQsIDApIC8gbWkgKiAwLjgpO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24uYWRkU2NhbGVkU2VsZihjb3JyZWN0aW9uLCAtMS90aGlzLm1hc3MpO1xyXG4gICAgICAgIG90aGVyLnBvc2l0aW9uLmFkZFNjYWxlZFNlbGYoY29ycmVjdGlvbiwgMS9vdGhlci5tYXNzKTtcclxuICAgICAgICB0aGlzLmNvbGxpc2lvbkV2ZW50LmZpcmUob3RoZXIpO1xyXG4gICAgICAgIG90aGVyLmNvbGxpc2lvbkV2ZW50LmZpcmUodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzb2x2ZUNpcmNsZUFuY2hvcmVkUmVjdENvbGxpc2lvbihvdGhlcjogUGh5c2ljc1BhcnQyRCkge1xyXG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuc2hhcGUgYXMgQ2lyY2xlMkQ7XHJcbiAgICAgICAgY29uc3QgcmVjdCA9IG90aGVyLnNoYXBlIGFzIFJlY3QyRDtcclxuICAgICAgICBsZXQgZGlmZiA9IHRoaXMucG9zaXRpb24uc3ViKHJlY3QucG9zaXRpb24pO1xyXG4gICAgICAgIGxldCBkeCA9IGRpZmYuZG90KHJlY3QucmlnaHQpO1xyXG4gICAgICAgIGxldCBkeSA9IGRpZmYuZG90KHJlY3QudXApO1xyXG4gICAgICAgIGlmKE1hdGguYWJzKGR4KSA+PSByZWN0LnNpemUueCArIGNpcmNsZS5yYWRpdXMgfHwgTWF0aC5hYnMoZHkpID49IHJlY3Quc2l6ZS55ICsgY2lyY2xlLnJhZGl1cylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGxldCBkMSA9IE1hdGguYWJzKHRoaXMucG9zaXRpb24uc3ViKHJlY3QucG9zaXRpb24uYWRkU2NhbGVkKHJlY3QudXAsIHJlY3Quc2l6ZS55KSkuZG90KHJlY3QudXApKTtcclxuICAgICAgICBsZXQgZDIgPSBNYXRoLmFicyh0aGlzLnBvc2l0aW9uLnN1YihyZWN0LnBvc2l0aW9uLmFkZFNjYWxlZChyZWN0LnVwLCAtcmVjdC5zaXplLnkpKS5kb3QocmVjdC51cCkpO1xyXG4gICAgICAgIGxldCBkMyA9IE1hdGguYWJzKHRoaXMucG9zaXRpb24uc3ViKHJlY3QucG9zaXRpb24uYWRkU2NhbGVkKHJlY3QucmlnaHQsIHJlY3Quc2l6ZS54KSkuZG90KHJlY3QucmlnaHQpKTtcclxuICAgICAgICBsZXQgZDQgPSBNYXRoLmFicyh0aGlzLnBvc2l0aW9uLnN1YihyZWN0LnBvc2l0aW9uLmFkZFNjYWxlZChyZWN0LnJpZ2h0LCAtcmVjdC5zaXplLngpKS5kb3QocmVjdC5yaWdodCkpO1xyXG4gICAgICAgIGxldCBtaW5JbmRleCA9IDA7XHJcbiAgICAgICAgbGV0IG1pbkRpc3QgPSBkMTtcclxuICAgICAgICBpZihkMiA8IG1pbkRpc3QpIHsgbWluRGlzdCA9IGQyOyBtaW5JbmRleCA9IDE7IH1cclxuICAgICAgICBpZihkMyA8IG1pbkRpc3QpIHsgbWluRGlzdCA9IGQzOyBtaW5JbmRleCA9IDI7IH1cclxuICAgICAgICBpZihkNCA8IG1pbkRpc3QpIHsgbWluRGlzdCA9IGQ0OyBtaW5JbmRleCA9IDM7IH1cclxuICAgICAgICBpZihtaW5EaXN0ID4gY2lyY2xlLnJhZGl1cylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGxldCBlZGdlITogVmVjMjtcclxuICAgICAgICBsZXQgbm9ybWFsITogVmVjMjtcclxuICAgICAgICBzd2l0Y2gobWluSW5kZXgpIHtcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgZWRnZSA9IHJlY3QucG9zaXRpb24uYWRkU2NhbGVkKHJlY3QucmlnaHQsIGR4KS5hZGRTY2FsZWRTZWxmKHJlY3QudXAsIHJlY3Quc2l6ZS55KTtcclxuICAgICAgICAgICAgICAgIG5vcm1hbCA9IHJlY3QudXA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgZWRnZSA9IHJlY3QucG9zaXRpb24uYWRkU2NhbGVkKHJlY3QucmlnaHQsIGR4KS5hZGRTY2FsZWRTZWxmKHJlY3QudXAsIC1yZWN0LnNpemUueSk7XHJcbiAgICAgICAgICAgICAgICBub3JtYWwgPSByZWN0LnVwLm5lZygpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIGVkZ2UgPSByZWN0LnBvc2l0aW9uLmFkZFNjYWxlZChyZWN0LnVwLCBkeSkuYWRkU2NhbGVkU2VsZihyZWN0LnJpZ2h0LCByZWN0LnNpemUueCk7XHJcbiAgICAgICAgICAgICAgICBub3JtYWwgPSByZWN0LnJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIGVkZ2UgPSByZWN0LnBvc2l0aW9uLmFkZFNjYWxlZChyZWN0LnVwLCBkeSkuYWRkU2NhbGVkU2VsZihyZWN0LnJpZ2h0LCAtcmVjdC5zaXplLngpO1xyXG4gICAgICAgICAgICAgICAgbm9ybWFsID0gcmVjdC5yaWdodC5uZWcoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB2ZWxBbG9uZ05vcm1hbCA9IHRoaXMudmVsb2NpdHkuc3ViKG90aGVyLnZlbG9jaXR5KS5kb3Qobm9ybWFsKTtcclxuICAgICAgICBpZiAodmVsQWxvbmdOb3JtYWwgPCAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3RpdHV0aW9uID0gTWF0aC5taW4odGhpcy5yZXN0aXR1dGlvbiwgb3RoZXIucmVzdGl0dXRpb24pO1xyXG4gICAgICAgICAgICBjb25zdCBqID0gLSgxK3Jlc3RpdHV0aW9uKSAqIHZlbEFsb25nTm9ybWFsO1xyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5LmFkZFNjYWxlZFNlbGYobm9ybWFsLCBqKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IGVkZ2UuYWRkU2NhbGVkU2VsZihub3JtYWwsIGNpcmNsZS5yYWRpdXMgKyAxZS02KTtcclxuICAgICAgICB0aGlzLmNvbGxpc2lvbkV2ZW50LmZpcmUob3RoZXIpO1xyXG4gICAgICAgIG90aGVyLmNvbGxpc2lvbkV2ZW50LmZpcmUodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKGNhbWVyYT86IENhbWVyYTJEKSB7XHJcbiAgICAgICAgaWYodGhpcy51Q29sb3IpXHJcbiAgICAgICAgICAgIHRoaXMudUNvbG9yLnNldFZhbHVlcyhbdGhpcy5jb2xvci5yLCB0aGlzLmNvbG9yLmcsIHRoaXMuY29sb3IuYl0pO1xyXG4gICAgICAgIGlmKHRoaXMudVZpZXcpXHJcbiAgICAgICAgICAgIHRoaXMudVZpZXcuc2V0VmFsdWVzKGNhbWVyYSA/IE1hdDMubXVsdGlwbHkoY2FtZXJhLnZpZXdNYXRyaXgsIHRoaXMudmlld01hdHJpeCkgOiB0aGlzLnZpZXdNYXRyaXgpO1xyXG4gICAgICAgIHRoaXMuc2hhZGVyT2JqZWN0LmRyYXdUcmlhbmdsZXMoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJheTNEIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBvcmlnaW46IFZlYzMsIHB1YmxpYyBkaXJlY3Rpb246IFZlYzMpIHtcclxuXHJcbiAgICB9XHJcbiAgICByYXljYXN0Vm94ZWxzPFQ+KFxyXG4gICAgICAgIHByZWRpY2F0ZTogKHBvczpWZWMzLCBub3JtYWw6VmVjMywgZGlzdDpudW1iZXIpID0+IFQgfCB1bmRlZmluZWQsXHJcbiAgICAgICAgbWF4SXRlcmF0aW9ucyA9IDEwMDBcclxuICAgICk6IFQgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGNvbnN0IGludkRpckFicyA9IHRoaXMuZGlyZWN0aW9uLnJkaXZGKDEpLm1hcCh4ID0+IE1hdGguYWJzKHgpKTtcclxuICAgICAgICBjb25zdCBzaWduID0gdGhpcy5kaXJlY3Rpb24ubWFwKHggPT4geCA+IDAgPyAxIDogMCk7XHJcbiAgICAgICAgY29uc3Qgc3RlcCA9IHRoaXMuZGlyZWN0aW9uLm1hcCh4ID0+IHggPiAwID8gMSA6IC0xKTtcclxuICAgICAgICBsZXQgdE1heFggPSBpbnZEaXJBYnMueCAqIChzaWduLng9PT0wID8gKHRoaXMub3JpZ2luLnggLSBNYXRoLmZsb29yKHRoaXMub3JpZ2luLngpKSA6IChNYXRoLmZsb29yKHRoaXMub3JpZ2luLngpICsgMSAtIHRoaXMub3JpZ2luLngpKTtcclxuICAgICAgICBsZXQgdE1heFkgPSBpbnZEaXJBYnMueSAqIChzaWduLnk9PT0wID8gKHRoaXMub3JpZ2luLnkgLSBNYXRoLmZsb29yKHRoaXMub3JpZ2luLnkpKSA6IChNYXRoLmZsb29yKHRoaXMub3JpZ2luLnkpICsgMSAtIHRoaXMub3JpZ2luLnkpKTtcclxuICAgICAgICBsZXQgdE1heFogPSBpbnZEaXJBYnMueiAqIChzaWduLno9PT0wID8gKHRoaXMub3JpZ2luLnogLSBNYXRoLmZsb29yKHRoaXMub3JpZ2luLnopKSA6IChNYXRoLmZsb29yKHRoaXMub3JpZ2luLnopICsgMSAtIHRoaXMub3JpZ2luLnopKTtcclxuICAgICAgICBsZXQgcG9zID0gbmV3IFZlYzModGhpcy5vcmlnaW4pLm1hcFNlbGYoeCA9PiBNYXRoLmZsb29yKHgpKTtcclxuICAgICAgICBsZXQgZGlzdGFuY2UgPSAwO1xyXG4gICAgICAgIGxldCBub3JtYWwgPSBWZWMzLnplcm8oKTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxtYXhJdGVyYXRpb25zOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHJlcyA9IHByZWRpY2F0ZShwb3MsIG5vcm1hbCwgZGlzdGFuY2UpO1xyXG4gICAgICAgICAgICBpZihyZXMgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgICAgIGlmKHRNYXhYIDwgdE1heFkpIHtcclxuICAgICAgICAgICAgICAgIGlmKHRNYXhYIDwgdE1heFopIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IHRNYXhYO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbC5zZXRDKC1zdGVwLngsIDAsIDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRNYXhYICs9IGludkRpckFicy54O1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcy54ICs9IHN0ZXAueDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2UgPSB0TWF4WjtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWwuc2V0QygwLCAwLCAtc3RlcC56KTtcclxuICAgICAgICAgICAgICAgICAgICB0TWF4WiArPSBpbnZEaXJBYnMuejtcclxuICAgICAgICAgICAgICAgICAgICBwb3MueiArPSBzdGVwLno7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZih0TWF4WSA8IHRNYXhaKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2UgPSB0TWF4WTtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWwuc2V0QygwLCAtc3RlcC55LCAwKTtcclxuICAgICAgICAgICAgICAgICAgICB0TWF4WSArPSBpbnZEaXJBYnMueTtcclxuICAgICAgICAgICAgICAgICAgICBwb3MueSArPSBzdGVwLnk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gdE1heFo7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsLnNldEMoMCwgMCwgLXN0ZXAueik7XHJcbiAgICAgICAgICAgICAgICAgICAgdE1heFogKz0gaW52RGlyQWJzLno7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zLnogKz0gc3RlcC56O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICByYXljYXN0Qm94KGJvdW5kczogVmVjM1tdKSB7XHJcbiAgICAgICAgY29uc3QgaW52RGlyID0gdGhpcy5kaXJlY3Rpb24ucmRpdkYoMSk7XHJcbiAgICAgICAgY29uc3Qgc2lnbiA9IHRoaXMuZGlyZWN0aW9uLm1hcCh4ID0+IHggPiAwID8gMSA6IDApO1xyXG4gICAgICAgIGNvbnN0IHNpZ25GbGlwID0gdGhpcy5kaXJlY3Rpb24ubWFwKHggPT4geCA+IDAgPyAwIDogMSk7XHJcbiAgICAgICAgY29uc3Qgc3RlcEZsaXAgPSB0aGlzLmRpcmVjdGlvbi5tYXAoeCA9PiB4ID4gMCA/IC0xIDogMSk7XHJcbiAgICAgICAgbGV0IHRtaW4gPSAoYm91bmRzW3NpZ25GbGlwLnhdIS54IC0gdGhpcy5vcmlnaW4ueCkgKiBpbnZEaXIueDtcclxuICAgICAgICBsZXQgdG1heCA9IChib3VuZHNbc2lnbi54XSEueCAtIHRoaXMub3JpZ2luLngpICogaW52RGlyLng7XHJcbiAgICAgICAgbGV0IG5vcm1hbCA9IG5ldyBWZWMzKHN0ZXBGbGlwLngsMCwwKTtcclxuICAgICAgICBsZXQgdHltaW4gPSAoYm91bmRzW3NpZ25GbGlwLnldIS55IC0gdGhpcy5vcmlnaW4ueSkgKiBpbnZEaXIueTtcclxuICAgICAgICBsZXQgdHltYXggPSAoYm91bmRzW3NpZ24ueV0hLnkgLSB0aGlzLm9yaWdpbi55KSAqIGludkRpci55O1xyXG4gICAgICAgIGlmKCh0bWluID4gdHltYXgpIHx8ICh0eW1pbiA+IHRtYXgpKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBpZih0eW1pbiA+IHRtaW4pIHtcclxuICAgICAgICAgICAgdG1pbiA9IHR5bWluO1xyXG4gICAgICAgICAgICBub3JtYWwgPSBuZXcgVmVjMygwLHN0ZXBGbGlwLnksMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR5bWF4IDwgdG1heCkgdG1heCA9IHR5bWF4O1xyXG4gICAgICAgIGxldCB0em1pbiA9IChib3VuZHNbc2lnbkZsaXAuel0hLnogLSB0aGlzLm9yaWdpbi56KSAqIGludkRpci56O1xyXG4gICAgICAgIGxldCB0em1heCA9IChib3VuZHNbc2lnbi56XSEueiAtIHRoaXMub3JpZ2luLnopICogaW52RGlyLno7XHJcbiAgICAgICAgaWYoKHRtaW4gPiB0em1heCkgfHwgKHR6bWluID4gdG1heCkpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmKHR6bWluID4gdG1pbikge1xyXG4gICAgICAgICAgICB0bWluID0gdHptaW47XHJcbiAgICAgICAgICAgIG5vcm1hbCA9IG5ldyBWZWMzKDAsMCxzdGVwRmxpcC56KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHptYXggPCB0bWF4KSB0bWF4ID0gdHptYXg7XHJcbiAgICAgICAgY29uc3QgZGlzdGFuY2UgPSB0bWluIDwgMCA/IDAgOiB0bWluO1xyXG4gICAgICAgIHJldHVybiB7IG5vcm1hbCwgZGlzdGFuY2UsIGludGVyc2VjdGlvbjogdGhpcy5vcmlnaW4uYWRkU2NhbGVkKHRoaXMuZGlyZWN0aW9uLCBkaXN0YW5jZSkgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFBoeXNpY3MyREVudmlyb25tZW50IHtcclxuICAgIHBhcnRPYnNlcnZlcjogU2lnbmFsPFtvYmo6IGFueV0+ID0gbmV3IFNpZ25hbCh7b25Db25uZWN0Oihjb25uKT0+e2Zvcihjb25zdCBvYmogb2YgdGhpcy5wYXJ0cyljb25uLmZpcmUob2JqKTt9fSk7XHJcbiAgICBwYXJ0czogUGh5c2ljc1BhcnQyRFtdID0gW107XHJcbiAgICBkZWZhdWx0U2hhZGVyOiBXR0wyU2hhZGVyO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0U2hhZGVyID0gbmV3IFdHTDJTaGFkZXIoXHJcbiAgICAgICAgICAgIGdsLFxyXG4gICAgICAgICAgICBgI3ZlcnNpb24gMzAwIGVzXHJcbiAgICAgICAgICAgICAgICBpbiB2ZWMyIGFfcG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICB1bmlmb3JtIG1hdDMgdV92aWV3O1xyXG4gICAgICAgICAgICAgICAgdm9pZCBtYWluKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZlYzIgdl9wb3NpdGlvbiA9ICh1X3ZpZXcgKiB2ZWMzKGFfcG9zaXRpb24sIDEpKS54eTtcclxuICAgICAgICAgICAgICAgICAgICBnbF9Qb3NpdGlvbiA9IHZlYzQodl9wb3NpdGlvbiwgMCwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGAsXHJcbiAgICAgICAgICAgIGAjdmVyc2lvbiAzMDAgZXNcclxuICAgICAgICAgICAgICAgIHByZWNpc2lvbiBoaWdocCBmbG9hdDtcclxuICAgICAgICAgICAgICAgIHVuaWZvcm0gdmVjMyB1X2NvbG9yO1xyXG4gICAgICAgICAgICAgICAgb3V0IHZlYzQgb3V0Q29sb3I7XHJcbiAgICAgICAgICAgICAgICB2b2lkIG1haW4oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0Q29sb3IgPSB2ZWM0KHVfY29sb3IvMjU1LiwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGAsXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLmRlZmF1bHRTaGFkZXIuYWRkQXR0cmlidXRlKFwiYV9wb3NpdGlvblwiLCBcInZlYzJcIik7XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0U2hhZGVyLmNyZWF0ZVVuaWZvcm0oXCJ1X3ZpZXdcIiwgXCJtYXQzXCIpO1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdFNoYWRlci5jcmVhdGVVbmlmb3JtKFwidV9jb2xvclwiLCBcInZlYzNcIik7XHJcbiAgICB9XHJcbiAgICBhZGRQYXJ0KHBhcnQ6IFBoeXNpY3NQYXJ0MkQpIHtcclxuICAgICAgICB0aGlzLnBhcnRzLnB1c2gocGFydCk7XHJcbiAgICB9XHJcbiAgICByZW1vdmVQYXJ0KHBhcnQ6IFBoeXNpY3NQYXJ0MkQpIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMucGFydHMuaW5kZXhPZihwYXJ0KTtcclxuICAgICAgICBpZihpbmRleCA9PSAtMSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucGFydHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZShkdDogbnVtYmVyLCBzb2x2ZXNDb3VudCA9IDMpIHtcclxuICAgICAgICBmb3IobGV0IHBhcnQgb2YgdGhpcy5wYXJ0cykge1xyXG4gICAgICAgICAgICBpZihwYXJ0LmFuY2hvcmVkKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJ0LnZlbG9jaXR5ID0gcGFydC5wb3NpdGlvbi5zdWIocGFydC5sYXN0UG9zaXRpb24pLm11bEYoMS9kdCk7XHJcbiAgICAgICAgICAgICAgICBwYXJ0Lmxhc3RQb3NpdGlvbi5zZXRDKHBhcnQucG9zaXRpb24ueCwgcGFydC5wb3NpdGlvbi55KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBhcnQubGFzdFBvc2l0aW9uLnNldEMocGFydC5wb3NpdGlvbi54LCBwYXJ0LnBvc2l0aW9uLnkpO1xyXG4gICAgICAgICAgICAgICAgcGFydC52ZWxvY2l0eS55IC09IHBhcnQuZ3Jhdml0eSAqIGR0O1xyXG4gICAgICAgICAgICAgICAgcGFydC5wb3NpdGlvbi5hZGRTY2FsZWRTZWxmKHBhcnQudmVsb2NpdHksIGR0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxzb2x2ZXNDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaj0wOyBqPHRoaXMucGFydHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhcnQgPSB0aGlzLnBhcnRzW2pdITtcclxuICAgICAgICAgICAgICAgIGlmKCFwYXJ0Lmhhc0NvbGxpc2lvbikgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGs9aisxOyBrPHRoaXMucGFydHMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvdGhlciA9IHRoaXMucGFydHNba10hO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFvdGhlci5oYXNDb2xsaXNpb24pIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHBhcnQuYW5jaG9yZWQgJiYgb3RoZXIuYW5jaG9yZWQpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHBhcnQuc2hhcGVUeXBlID09PSBcImNpcmNsZVwiICYmIG90aGVyLnNoYXBlVHlwZSA9PT0gXCJjaXJjbGVcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0LnJlc29sdmVDaXJjbGVDaXJjbGVDb2xsaXNpb24ob3RoZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihwYXJ0LnNoYXBlVHlwZSA9PT0gXCJjaXJjbGVcIiAmJiBvdGhlci5zaGFwZVR5cGUgPT09IFwicmVjdFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnQucmVzb2x2ZUNpcmNsZUFuY2hvcmVkUmVjdENvbGxpc2lvbihvdGhlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKHBhcnQuc2hhcGVUeXBlID09PSBcInJlY3RcIiAmJiBvdGhlci5zaGFwZVR5cGUgPT09IFwiY2lyY2xlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXIucmVzb2x2ZUNpcmNsZUFuY2hvcmVkUmVjdENvbGxpc2lvbihwYXJ0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZW5kZXJBbGwoY2FtZXJhOiBDYW1lcmEyRCkge1xyXG4gICAgICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUIHwgdGhpcy5nbC5ERVBUSF9CVUZGRVJfQklUKTtcclxuICAgICAgICBmb3IobGV0IHBhcnQgb2YgdGhpcy5wYXJ0cykge1xyXG4gICAgICAgICAgICBwYXJ0LnJlbmRlcihjYW1lcmEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgRVZFTlQgQ0xBU1NFUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBTaWduYWw8VCBleHRlbmRzIGFueVtdPiB7XHJcbiAgICBjb25uZWN0aW9uczogQ29ubmVjdGlvbjxUPltdID0gW107XHJcbiAgICB0aW1lRmlyZWQ6IG51bWJlciA9IC1OdW1iZXIuTUFYX1ZBTFVFO1xyXG4gICAgb25Db25uZWN0PzogKGNvbm46IENvbm5lY3Rpb248VD4pID0+IHZvaWQ7XHJcbiAgICBjb25zdHJ1Y3Rvcih7XHJcbiAgICAgICAgb25Db25uZWN0ID0gdW5kZWZpbmVkLFxyXG4gICAgfToge1xyXG4gICAgICAgIG9uQ29ubmVjdD86IChjb25uOiBDb25uZWN0aW9uPFQ+KSA9PiB2b2lkLFxyXG4gICAgfSA9IHt9KSB7XHJcbiAgICAgICAgdGhpcy5vbkNvbm5lY3QgPSBvbkNvbm5lY3Q7XHJcbiAgICB9XHJcbiAgICBjb25uZWN0KGNhbGxiYWNrOiAoLi4uYXJnczogVCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGNvbnN0IGNvbm4gPSBuZXcgQ29ubmVjdGlvbjxUPih0aGlzLCBjYWxsYmFjayk7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5wdXNoKGNvbm4pO1xyXG4gICAgICAgIGlmKHRoaXMub25Db25uZWN0KSB7XHJcbiAgICAgICAgICAgIHRoaXMub25Db25uZWN0KGNvbm4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29ubjtcclxuICAgIH1cclxuICAgIG9uY2UoY2FsbGJhY2s6ICguLi5hcmdzOiBUKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgY29uc3QgY29ubiA9IHRoaXMuY29ubmVjdCgoLi4uYXJnczogVCkgPT4ge1xyXG4gICAgICAgICAgICBjYWxsYmFjayguLi5hcmdzKTtcclxuICAgICAgICAgICAgY29ubi5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGNvbm47XHJcbiAgICB9XHJcbiAgICBhc3luYyB3YWl0KCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxUPihyZXMgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm9uY2UoKC4uLmFyZ3M6IFQpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlcyhhcmdzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBmaXJlKC4uLmFyZ3M6IFQpIHtcclxuICAgICAgICB0aGlzLnRpbWVGaXJlZCA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIGZvcihjb25zdCBjb25uIG9mIFsuLi50aGlzLmNvbm5lY3Rpb25zXSkge1xyXG4gICAgICAgICAgICBjb25uLmZpcmUoLi4uYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0VGltZVNpbmNlRmlyZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHBlcmZvcm1hbmNlLm5vdygpIC8gMTAwMCAtIHRoaXMudGltZUZpcmVkO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvbjxUIGV4dGVuZHMgYW55W10+IHtcclxuICAgIGdyb3VwczogQ29ubmVjdGlvbkdyb3VwW10gPSBbXTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzaWduYWw6IFNpZ25hbDxUPiwgcHVibGljIGNhbGxiYWNrOiAoLi4uYXJnczogVCkgPT4gdm9pZCkge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgZGlzY29ubmVjdCgpIHtcclxuICAgICAgICB0aGlzLnNpZ25hbC5jb25uZWN0aW9ucy5zcGxpY2UodGhpcy5zaWduYWwuY29ubmVjdGlvbnMuaW5kZXhPZih0aGlzKSwgMSk7XHJcbiAgICAgICAgZm9yKGNvbnN0IGdyb3VwIG9mIHRoaXMuZ3JvdXBzKSB7XHJcbiAgICAgICAgICAgIGdyb3VwLmNvbm5lY3Rpb25zLnNwbGljZShncm91cC5jb25uZWN0aW9ucy5pbmRleE9mKHRoaXMpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ncm91cHMgPSBbXTtcclxuICAgIH1cclxuICAgIGZpcmUoLi4uYXJnczogVCkge1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2soLi4uYXJncyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBIdG1sQ29ubmVjdGlvbiB7XHJcbiAgICBncm91cHM6IENvbm5lY3Rpb25Hcm91cFtdID0gW107XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEV2ZW50VGFyZ2V0LCBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgY2FsbGJhY2s6IChlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5uYW1lLCB0aGlzLmNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIGRpc2Nvbm5lY3QoKSB7XHJcbiAgICAgICAgdGhpcy5lbC5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMubmFtZSwgdGhpcy5jYWxsYmFjayk7XHJcbiAgICAgICAgZm9yKGNvbnN0IGdyb3VwIG9mIHRoaXMuZ3JvdXBzKSB7XHJcbiAgICAgICAgICAgIGdyb3VwLmNvbm5lY3Rpb25zLnNwbGljZShncm91cC5jb25uZWN0aW9ucy5pbmRleE9mKHRoaXMpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ncm91cHMgPSBbXTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvbm5lY3Rpb25Hcm91cCB7XHJcbiAgICBjb25uZWN0aW9uczogKENvbm5lY3Rpb248YW55PiB8IEh0bWxDb25uZWN0aW9uKVtdID0gW107XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcbiAgICBhZGQoY29ubjogQ29ubmVjdGlvbjxhbnk+IHwgSHRtbENvbm5lY3Rpb24pIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLnB1c2goY29ubik7XHJcbiAgICB9XHJcbiAgICBkaXNjb25uZWN0QWxsKCkge1xyXG4gICAgICAgIGZvcihjb25zdCBjb25uIG9mIFsuLi50aGlzLmNvbm5lY3Rpb25zXSkge1xyXG4gICAgICAgICAgICBjb25uLmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucyA9IFtdO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIFdFQkdMMiBTSEFERVIgQ0xBU1NFUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGNsYXNzIFdHTDJDb21wb25lbnRTaGFkZXIge1xyXG4gICAgd1NoYWRlcjogV2ViR0xTaGFkZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsIHB1YmxpYyB0eXBlOiBcInZlcnRleFwiIHwgXCJmcmFnbWVudFwiLCBwdWJsaWMgc291cmNlOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCB3U2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKHR5cGUgPT0gXCJ2ZXJ0ZXhcIiA/IGdsLlZFUlRFWF9TSEFERVIgOiBnbC5GUkFHTUVOVF9TSEFERVIpO1xyXG4gICAgICAgIGlmKHdTaGFkZXIgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gY3JlYXRlIHNoYWRlclwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy53U2hhZGVyID0gd1NoYWRlcjtcclxuICAgICAgICBnbC5zaGFkZXJTb3VyY2Uod1NoYWRlciwgc291cmNlKTtcclxuICAgICAgICBnbC5jb21waWxlU2hhZGVyKHdTaGFkZXIpXHJcbiAgICAgICAgaWYoIWdsLmdldFNoYWRlclBhcmFtZXRlcih3U2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUykpIHtcclxuICAgICAgICAgICAgY29uc3QgbG9nID0gZ2wuZ2V0U2hhZGVySW5mb0xvZyh3U2hhZGVyKTtcclxuICAgICAgICAgICAgZ2wuZGVsZXRlU2hhZGVyKHdTaGFkZXIpO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gY29tcGlsZSBzaGFkZXI6IFwiICsgbG9nKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBkZWxldGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nbC5kZWxldGVTaGFkZXIodGhpcy53U2hhZGVyKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJDb21wb25lbnRQcm9ncmFtIHtcclxuICAgIHdQcm9ncmFtOiBXZWJHTFByb2dyYW07XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsIHB1YmxpYyBjU2hhZGVyVjogV0dMMkNvbXBvbmVudFNoYWRlciwgcHVibGljIGNTaGFkZXJGOiBXR0wyQ29tcG9uZW50U2hhZGVyKSB7XHJcbiAgICAgICAgY29uc3Qgd1Byb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XHJcbiAgICAgICAgaWYgKCF3UHJvZ3JhbSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gY3JlYXRlIHByb2dyYW1cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMud1Byb2dyYW0gPSB3UHJvZ3JhbTtcclxuICAgICAgICBnbC5hdHRhY2hTaGFkZXIod1Byb2dyYW0sIGNTaGFkZXJWLndTaGFkZXIpO1xyXG4gICAgICAgIGdsLmF0dGFjaFNoYWRlcih3UHJvZ3JhbSwgY1NoYWRlckYud1NoYWRlcik7XHJcbiAgICAgICAgZ2wubGlua1Byb2dyYW0od1Byb2dyYW0pO1xyXG4gICAgICAgIGlmKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHdQcm9ncmFtLCBnbC5MSU5LX1NUQVRVUykpIHtcclxuICAgICAgICAgICAgY29uc3QgbG9nID0gZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cod1Byb2dyYW0pO1xyXG4gICAgICAgICAgICBnbC5kZWxldGVQcm9ncmFtKHdQcm9ncmFtKTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGxpbmsgcHJvZ3JhbTogXCIgKyBsb2cpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNldEFjdGl2ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdsLnVzZVByb2dyYW0odGhpcy53UHJvZ3JhbSk7XHJcbiAgICB9XHJcbiAgICBkZWxldGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nbC5kZWxldGVQcm9ncmFtKHRoaXMud1Byb2dyYW0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBXR0wyQXR0cmlidXRlVHlwZSA9IChcclxuICAgIFwiZmxvYXRcIiB8IFwiaW50XCIgfCBcInVpbnRcIiB8IFwidmVjMlwiIHwgXCJ2ZWMzXCIgfCBcInZlYzRcIlxyXG4gICAgfCBcIml2ZWMyXCIgfCBcIml2ZWMzXCIgfCBcIml2ZWM0XCIgfCBcInV2ZWMyXCIgfCBcInV2ZWMzXCIgfCBcInV2ZWM0XCJcclxuKTtcclxuXHJcbmV4cG9ydCB0eXBlIFdHTDJVbmlmb3JtVHlwZSA9IChcclxuICAgIFwiZmxvYXRcIiB8IFwiaW50XCIgfCBcInVpbnRcIiB8IFwidmVjMlwiIHwgXCJ2ZWMzXCJcclxuICAgIHwgXCJ2ZWM0XCIgfCBcIml2ZWMyXCIgfCBcIml2ZWMzXCIgfCBcIml2ZWM0XCIgfCBcInV2ZWMyXCJcclxuICAgIHwgXCJ1dmVjM1wiIHwgXCJ1dmVjNFwiIHwgXCJtYXQyXCIgfCBcIm1hdDNcIiB8IFwibWF0NFwiXHJcbik7XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMkNvbXBvbmVudEJ1ZmZlciB7XHJcbiAgICB3VHlwZTogR0xlbnVtO1xyXG4gICAgd0RpbWVuc2lvbnM6IG51bWJlcjtcclxuICAgIHdCdWZmZXI6IFdlYkdMQnVmZmVyO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LCB0eXBlOiBXR0wyQXR0cmlidXRlVHlwZSkge1xyXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgICAgIGlmKCFidWZmZXIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGNyZWF0ZSBidWZmZXJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMud0J1ZmZlciA9IGJ1ZmZlcjtcclxuICAgICAgICBzd2l0Y2godHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiZmxvYXRcIjogdGhpcy53VHlwZSA9IGdsLkZMT0FUOyB0aGlzLndEaW1lbnNpb25zID0gMTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ2ZWMyXCI6IHRoaXMud1R5cGUgPSBnbC5GTE9BVDsgdGhpcy53RGltZW5zaW9ucyA9IDI7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidmVjM1wiOiB0aGlzLndUeXBlID0gZ2wuRkxPQVQ7IHRoaXMud0RpbWVuc2lvbnMgPSAzOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInZlYzRcIjogdGhpcy53VHlwZSA9IGdsLkZMT0FUOyB0aGlzLndEaW1lbnNpb25zID0gNDsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpbnRcIjogdGhpcy53VHlwZSA9IGdsLklOVDsgdGhpcy53RGltZW5zaW9ucyA9IDE7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaXZlYzJcIjogdGhpcy53VHlwZSA9IGdsLklOVDsgdGhpcy53RGltZW5zaW9ucyA9IDI7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaXZlYzNcIjogdGhpcy53VHlwZSA9IGdsLklOVDsgdGhpcy53RGltZW5zaW9ucyA9IDM7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaXZlYzRcIjogdGhpcy53VHlwZSA9IGdsLklOVDsgdGhpcy53RGltZW5zaW9ucyA9IDQ7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidWludFwiOiB0aGlzLndUeXBlID0gZ2wuVU5TSUdORURfSU5UOyB0aGlzLndEaW1lbnNpb25zID0gMTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1dmVjMlwiOiB0aGlzLndUeXBlID0gZ2wuVU5TSUdORURfSU5UOyB0aGlzLndEaW1lbnNpb25zID0gMjsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1dmVjM1wiOiB0aGlzLndUeXBlID0gZ2wuVU5TSUdORURfSU5UOyB0aGlzLndEaW1lbnNpb25zID0gMzsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1dmVjNFwiOiB0aGlzLndUeXBlID0gZ2wuVU5TSUdORURfSU5UOyB0aGlzLndEaW1lbnNpb25zID0gNDsgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIGJ1ZmZlciB0eXBlOiBcIiArIHR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNldEFjdGl2ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHRoaXMud0J1ZmZlcik7XHJcbiAgICB9XHJcbiAgICBkZWxldGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nbC5kZWxldGVCdWZmZXIodGhpcy53QnVmZmVyKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJDb21wb25lbnRWYW8ge1xyXG4gICAgd1ZhbzogV2ViR0xWZXJ0ZXhBcnJheU9iamVjdDtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkge1xyXG4gICAgICAgIHRoaXMud1ZhbyA9IGdsLmNyZWF0ZVZlcnRleEFycmF5KCk7XHJcbiAgICB9XHJcbiAgICBzZXRBY3RpdmUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kVmVydGV4QXJyYXkodGhpcy53VmFvKTtcclxuICAgIH1cclxuICAgIGVuYWJsZUJ1ZmZlcihjQnVmZmVyOiBXR0wyQ29tcG9uZW50QnVmZmVyLCB3TG9jYXRpb246IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGNCdWZmZXIuc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh3TG9jYXRpb24pO1xyXG4gICAgICAgIGlmKGNCdWZmZXIud1R5cGUgPT0gdGhpcy5nbC5GTE9BVCkge1xyXG4gICAgICAgICAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIod0xvY2F0aW9uLCBjQnVmZmVyLndEaW1lbnNpb25zLCBjQnVmZmVyLndUeXBlLCBmYWxzZSwgMCwgMCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJJUG9pbnRlcih3TG9jYXRpb24sIGNCdWZmZXIud0RpbWVuc2lvbnMsIGNCdWZmZXIud1R5cGUsIDAsIDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGRlbGV0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdsLmRlbGV0ZVZlcnRleEFycmF5KHRoaXMud1Zhbyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXR0wyQ29tcG9uZW50VW5pZm9ybSB7XHJcbiAgICB3TG9jYXRpb246IFdlYkdMVW5pZm9ybUxvY2F0aW9uO1xyXG4gICAgcXVldWVkVmFsdWVzOiBhbnlbXSB8IGFueSB8IG51bGwgPSBudWxsO1xyXG4gICAgaGFzUXVldWVkID0gZmFsc2U7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsIGNQcm9ncmFtOiBXR0wyQ29tcG9uZW50UHJvZ3JhbSwgbmFtZTogc3RyaW5nLCBwdWJsaWMgdHlwZTogV0dMMlVuaWZvcm1UeXBlKSB7XHJcbiAgICAgICAgY29uc3Qgd0xvY2F0aW9uID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24oY1Byb2dyYW0ud1Byb2dyYW0sIG5hbWUpO1xyXG4gICAgICAgIGlmKHdMb2NhdGlvbiA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gZ2V0IHVuaWZvcm0gbG9jYXRpb24gZm9yIFwiICsgbmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMud0xvY2F0aW9uID0gd0xvY2F0aW9uO1xyXG4gICAgfVxyXG4gICAgc2V0VmFsdWVzKHZhbHVlcyA6IGFueVtdIHwgYW55KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3Qgd0xvY2F0aW9uID0gdGhpcy53TG9jYXRpb25cclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgc3dpdGNoKHRoaXMudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiZmxvYXRcIjogZ2wudW5pZm9ybTFmKHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ2ZWMyXCI6IGdsLnVuaWZvcm0yZnYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInZlYzNcIjogZ2wudW5pZm9ybTNmdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidmVjNFwiOiBnbC51bmlmb3JtNGZ2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpbnRcIjogZ2wudW5pZm9ybTFpKHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpdmVjMlwiOiBnbC51bmlmb3JtMml2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpdmVjM1wiOiBnbC51bmlmb3JtM2l2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpdmVjNFwiOiBnbC51bmlmb3JtNGl2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1aW50XCI6IGdsLnVuaWZvcm0xdWkod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInV2ZWMyXCI6IGdsLnVuaWZvcm0ydWl2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1dmVjM1wiOiBnbC51bmlmb3JtM3Vpdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXZlYzRcIjogZ2wudW5pZm9ybTR1aXYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIm1hdDJcIjogZ2wudW5pZm9ybU1hdHJpeDJmdih3TG9jYXRpb24sIGZhbHNlLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIm1hdDNcIjogZ2wudW5pZm9ybU1hdHJpeDNmdih3TG9jYXRpb24sIGZhbHNlLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIm1hdDRcIjogZ2wudW5pZm9ybU1hdHJpeDRmdih3TG9jYXRpb24sIGZhbHNlLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKFwiVW5zdXBwb3J0ZWQgdW5pZm9ybSB0eXBlOiBcIiArIHRoaXMudHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcXVldWVWYWx1ZXModmFsdWVzOiBhbnlbXSB8IGFueSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaGFzUXVldWVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnF1ZXVlZFZhbHVlcyA9IHZhbHVlcztcclxuICAgIH1cclxuICAgIHVwZGF0ZSgpIHtcclxuICAgICAgICBpZighdGhpcy5oYXNRdWV1ZWQpIHJldHVybjtcclxuICAgICAgICB0aGlzLmhhc1F1ZXVlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc2V0VmFsdWVzKHRoaXMucXVldWVkVmFsdWVzKTtcclxuICAgICAgICB0aGlzLnF1ZXVlZFZhbHVlcyA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXR0wyQXR0cmlidXRlIHtcclxuICAgIHdMb2NhdGlvbjogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LCBwdWJsaWMgd1Byb2dyYW06IFdlYkdMUHJvZ3JhbSwgcHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIHR5cGU6IFdHTDJBdHRyaWJ1dGVUeXBlKSB7XHJcbiAgICAgICAgdGhpcy53TG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbih3UHJvZ3JhbSwgbmFtZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXR0wyVGV4dHVyZTJEIHtcclxuICAgIHdUZXh0dXJlOiBXZWJHTFRleHR1cmU7XHJcbiAgICB1bmlmb3JtOiBXR0wyQ29tcG9uZW50VW5pZm9ybTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzaGFkZXI6IFdHTDJTaGFkZXIsIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBzbG90OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLndUZXh0dXJlID0gc2hhZGVyLmdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICB0aGlzLnNldEFjdGl2ZSgpO1xyXG4gICAgICAgIHRoaXMudW5pZm9ybSA9IHNoYWRlci5jcmVhdGVVbmlmb3JtKG5hbWUsIFwiaW50XCIpO1xyXG4gICAgICAgIHRoaXMudW5pZm9ybS5zZXRWYWx1ZXModGhpcy5zbG90KTtcclxuICAgIH1cclxuICAgIHNldEFjdGl2ZSgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTAgKyB0aGlzLnNsb3QpO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRoaXMud1RleHR1cmUpO1xyXG4gICAgfVxyXG4gICAgc2V0SW50ZXJwb2xhdGlvbihpc0VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgaXNFbmFibGVkID8gZ2wuTElORUFSIDogZ2wuTkVBUkVTVCk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGlzRW5hYmxlZCA/IGdsLkxJTkVBUiA6IGdsLk5FQVJFU1QpO1xyXG4gICAgfVxyXG4gICAgc2V0UmVwZWF0KGlzRW5hYmxlZDogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGlzRW5hYmxlZCA/IGdsLlJFUEVBVCA6IGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGlzRW5hYmxlZCA/IGdsLlJFUEVBVCA6IGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgfVxyXG4gICAgc2V0RGF0YSh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgZGF0YTogQXJyYXlCdWZmZXJWaWV3IHwgbnVsbCA9IG51bGwpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgd2lkdGgsIGhlaWdodCwgMCwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgZGF0YSk7XHJcbiAgICB9XHJcbiAgICBzZXRJbWFnZShpbWFnZTogVGV4SW1hZ2VTb3VyY2UpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgaW1hZ2UpO1xyXG4gICAgfVxyXG4gICAgZ2VuZXJhdGVNaXBtYXAoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzJEKTtcclxuICAgIH1cclxuICAgIGRlbGV0ZSgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLmRlbGV0ZVRleHR1cmUodGhpcy53VGV4dHVyZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXR0wyVGV4dHVyZTNEIHtcclxuICAgIHdUZXh0dXJlOiBXZWJHTFRleHR1cmU7XHJcbiAgICB1bmlmb3JtOiBXR0wyQ29tcG9uZW50VW5pZm9ybTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzaGFkZXI6IFdHTDJTaGFkZXIsIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBzbG90OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLndUZXh0dXJlID0gc2hhZGVyLmdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICB0aGlzLnNldEFjdGl2ZSgpO1xyXG4gICAgICAgIHRoaXMudW5pZm9ybSA9IHNoYWRlci5jcmVhdGVVbmlmb3JtKG5hbWUsIFwiaW50XCIpO1xyXG4gICAgICAgIHRoaXMudW5pZm9ybS5zZXRWYWx1ZXModGhpcy5zbG90KTtcclxuICAgIH1cclxuICAgIHNldEFjdGl2ZSgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTAgKyB0aGlzLnNsb3QpO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfM0QsIHRoaXMud1RleHR1cmUpO1xyXG4gICAgfVxyXG4gICAgc2V0SW50ZXJwb2xhdGlvbihpc0VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfM0QsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgaXNFbmFibGVkID8gZ2wuTElORUFSIDogZ2wuTkVBUkVTVCk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzNELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGlzRW5hYmxlZCA/IGdsLkxJTkVBUiA6IGdsLk5FQVJFU1QpO1xyXG4gICAgfVxyXG4gICAgc2V0UmVwZWF0KGlzRW5hYmxlZDogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8zRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGlzRW5hYmxlZCA/IGdsLlJFUEVBVCA6IGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8zRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGlzRW5hYmxlZCA/IGdsLlJFUEVBVCA6IGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgfVxyXG4gICAgc2V0RGF0YSh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgZGVwdGg6IG51bWJlciwgZGF0YTogQXJyYXlCdWZmZXJWaWV3IHwgbnVsbCA9IG51bGwpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLnRleEltYWdlM0QoZ2wuVEVYVFVSRV8zRCwgMCwgZ2wuUkdCQSwgd2lkdGgsIGhlaWdodCwgZGVwdGgsIDAsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIGRhdGEpO1xyXG4gICAgfVxyXG4gICAgZ2VuZXJhdGVNaXBtYXAoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzNEKTtcclxuICAgIH1cclxuICAgIGRlbGV0ZSgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLmRlbGV0ZVRleHR1cmUodGhpcy53VGV4dHVyZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXR0wyT2JqZWN0IHtcclxuICAgIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0O1xyXG4gICAgY1ZhbzogV0dMMkNvbXBvbmVudFZhbztcclxuICAgIGNCdWZmZXJCeU5hbWU6IHtba2V5OnN0cmluZ106IFdHTDJDb21wb25lbnRCdWZmZXJ9ID0ge307XHJcbiAgICB2ZXJ0ZXhDb3VudDogbnVtYmVyID0gMDtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzaGFkZXI6IFdHTDJTaGFkZXIpIHtcclxuICAgICAgICB0aGlzLmdsID0gc2hhZGVyLmdsO1xyXG4gICAgICAgIHRoaXMuY1ZhbyA9IG5ldyBXR0wyQ29tcG9uZW50VmFvKHNoYWRlci5nbCk7XHJcbiAgICAgICAgdGhpcy5jVmFvLnNldEFjdGl2ZSgpO1xyXG4gICAgICAgIGZvcihjb25zdCBhdHRyaWJ1dGUgb2Ygc2hhZGVyLmF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgY0J1ZiA9IG5ldyBXR0wyQ29tcG9uZW50QnVmZmVyKHNoYWRlci5nbCwgYXR0cmlidXRlLnR5cGUpO1xyXG4gICAgICAgICAgICBjQnVmLnNldEFjdGl2ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmNWYW8uZW5hYmxlQnVmZmVyKGNCdWYsIGF0dHJpYnV0ZS53TG9jYXRpb24pO1xyXG4gICAgICAgICAgICB0aGlzLmNCdWZmZXJCeU5hbWVbYXR0cmlidXRlLm5hbWVdID0gY0J1ZjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzZXREYXRhKGF0dHJpYnV0ZU5hbWU6IHN0cmluZywgdmFsdWVzOiBGbG9hdDMyQXJyYXksIHVzYWdlOiBHTGVudW0gPSB0aGlzLmdsLlNUQVRJQ19EUkFXKSB7XHJcbiAgICAgICAgY29uc3QgY0J1ZiA9IHRoaXMuY0J1ZmZlckJ5TmFtZVthdHRyaWJ1dGVOYW1lXTtcclxuICAgICAgICBpZihjQnVmID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGQgbm90IGZpbmQgYXR0cmlidXRlIHdpdGggbmFtZTogXCIgKyBhdHRyaWJ1dGVOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY0J1Zi5zZXRBY3RpdmUoKTtcclxuICAgICAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHZhbHVlcywgdXNhZ2UpO1xyXG4gICAgICAgIHRoaXMudmVydGV4Q291bnQgPSB2YWx1ZXMubGVuZ3RoIC8gY0J1Zi53RGltZW5zaW9ucztcclxuICAgIH1cclxuICAgIGRyYXdUcmlhbmdsZXMoKSB7XHJcbiAgICAgICAgdGhpcy5jVmFvLnNldEFjdGl2ZSgpO1xyXG4gICAgICAgIHRoaXMuZ2wuZHJhd0FycmF5cyh0aGlzLmdsLlRSSUFOR0xFUywgMCwgdGhpcy52ZXJ0ZXhDb3VudCk7XHJcbiAgICB9XHJcbiAgICBkcmF3TGluZXMoKSB7XHJcbiAgICAgICAgdGhpcy5jVmFvLnNldEFjdGl2ZSgpO1xyXG4gICAgICAgIHRoaXMuZ2wuZHJhd0FycmF5cyh0aGlzLmdsLkxJTkVTLCAwLCB0aGlzLnZlcnRleENvdW50KTtcclxuICAgIH1cclxuICAgIGRyYXdQb2ludHMoKSB7XHJcbiAgICAgICAgdGhpcy5jVmFvLnNldEFjdGl2ZSgpO1xyXG4gICAgICAgIHRoaXMuZ2wuZHJhd0FycmF5cyh0aGlzLmdsLlBPSU5UUywgMCwgdGhpcy52ZXJ0ZXhDb3VudCk7XHJcbiAgICB9XHJcbiAgICBkZWxldGUoKSB7XHJcbiAgICAgICAgZm9yKGNvbnN0IG5hbWUgaW4gdGhpcy5jQnVmZmVyQnlOYW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY0J1ZmZlckJ5TmFtZVtuYW1lXSEuZGVsZXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY1Zhby5kZWxldGUoKTtcclxuICAgICAgICB0aGlzLmNCdWZmZXJCeU5hbWUgPSB7fTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJTaGFkZXIge1xyXG4gICAgY1Byb2dyYW06IFdHTDJDb21wb25lbnRQcm9ncmFtO1xyXG4gICAgYXR0cmlidXRlczogV0dMMkF0dHJpYnV0ZVtdID0gW107XHJcbiAgICBjVW5pZm9ybXM6IFdHTDJDb21wb25lbnRVbmlmb3JtW10gPSBbXVxyXG4gICAgY1VuaWZvcm1CeU5hbWU6IHtba2V5OnN0cmluZ106V0dMMkNvbXBvbmVudFVuaWZvcm19ID0ge307XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsIHZTb3VyY2U6IHN0cmluZywgZlNvdXJjZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5jUHJvZ3JhbSA9IG5ldyBXR0wyQ29tcG9uZW50UHJvZ3JhbShcclxuICAgICAgICAgICAgZ2wsIG5ldyBXR0wyQ29tcG9uZW50U2hhZGVyKGdsLCBcInZlcnRleFwiLCB2U291cmNlKSxcclxuICAgICAgICAgICAgbmV3IFdHTDJDb21wb25lbnRTaGFkZXIoZ2wsIFwiZnJhZ21lbnRcIiwgZlNvdXJjZSksXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLmNQcm9ncmFtLnNldEFjdGl2ZSgpO1xyXG4gICAgfVxyXG4gICAgYWRkQXR0cmlidXRlKG5hbWU6IHN0cmluZywgdHlwZTogV0dMMkF0dHJpYnV0ZVR5cGUpIHtcclxuICAgICAgICBjb25zdCBhdHQgPSBuZXcgV0dMMkF0dHJpYnV0ZSh0aGlzLmdsLCB0aGlzLmNQcm9ncmFtLndQcm9ncmFtLCBuYW1lLCB0eXBlKTtcclxuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMucHVzaChhdHQpO1xyXG4gICAgICAgIHJldHVybiBhdHQ7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVVbmlmb3JtKG5hbWU6IHN0cmluZywgdHlwZTogV0dMMlVuaWZvcm1UeXBlKSB7XHJcbiAgICAgICAgY29uc3QgdW5pZm9ybSA9IG5ldyBXR0wyQ29tcG9uZW50VW5pZm9ybSh0aGlzLmdsLCB0aGlzLmNQcm9ncmFtLCBuYW1lLCB0eXBlKTtcclxuICAgICAgICB0aGlzLmNVbmlmb3Jtcy5wdXNoKHVuaWZvcm0pO1xyXG4gICAgICAgIHRoaXMuY1VuaWZvcm1CeU5hbWVbbmFtZV0gPSB1bmlmb3JtO1xyXG4gICAgICAgIHJldHVybiB1bmlmb3JtO1xyXG4gICAgfVxyXG4gICAgZ2V0VW5pZm9ybShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jVW5pZm9ybUJ5TmFtZVtuYW1lXTtcclxuICAgIH1cclxuICAgIGNyZWF0ZU9iamVjdCgpIHtcclxuICAgICAgICBjb25zdCBvYmogPSBuZXcgV0dMMk9iamVjdCh0aGlzKTtcclxuICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlVGV4dHVyZTJEKG5hbWU6IHN0cmluZywgc2xvdDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgdGV4dHVyZSA9IG5ldyBXR0wyVGV4dHVyZTJEKHRoaXMsIG5hbWUsIHNsb3QpO1xyXG4gICAgICAgIHJldHVybiB0ZXh0dXJlO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlVGV4dHVyZTNEKG5hbWU6IHN0cmluZywgc2xvdDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgdGV4dHVyZSA9IG5ldyBXR0wyVGV4dHVyZTNEKHRoaXMsIG5hbWUsIHNsb3QpO1xyXG4gICAgICAgIHJldHVybiB0ZXh0dXJlO1xyXG4gICAgfVxyXG4gICAgc2V0QWN0aXZlKCkge1xyXG4gICAgICAgIHRoaXMuY1Byb2dyYW0uc2V0QWN0aXZlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIFRFWFRVUkUgQVRMQVMgQ0xBU1MgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgdHlwZSBBdGxhc0ltYWdlID0ge3g6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlciwgaW1nOiBIVE1MSW1hZ2VFbGVtZW50LCBuYW1lOiBzdHJpbmd9O1xyXG5cclxuZXhwb3J0IGNsYXNzIFRleHR1cmVBdGxhcyB7XHJcbiAgICB3aWR0aDogbnVtYmVyO1xyXG4gICAgaGVpZ2h0OiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnQsIHB1YmxpYyBib3VuZHM6IHtbbmFtZTpzdHJpbmddOiBBdGxhc0ltYWdlfSkge1xyXG4gICAgICAgIHRoaXMud2lkdGggPSBpbWFnZS5uYXR1cmFsV2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBpbWFnZS5uYXR1cmFsSGVpZ2h0O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGZyb21VcmxzKGFyZ3M6IFtuYW1lOnN0cmluZywgdXJsOnN0cmluZ11bXSwgcGFkZGluZyA9IDApIHtcclxuICAgICAgICBsZXQgaW1hZ2VzOiBBdGxhc0ltYWdlW10gPSBbXTtcclxuICAgICAgICBsZXQgcHJvbWlzZXM6IFByb21pc2U8dm9pZD5bXSA9IFtdO1xyXG4gICAgICAgIGxldCBhdGxhc1NpemUgPSAwO1xyXG4gICAgICAgIGZvcihsZXQgW25hbWUsIHVybF0gb2YgYXJncykge1xyXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKG5ldyBQcm9taXNlPHZvaWQ+KGFzeW5jIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXRhOiBBdGxhc0ltYWdlID0ge2ltZywgeDowLCB5OjAsIHc6aW1nLm5hdHVyYWxXaWR0aCsyKnBhZGRpbmcsIGg6aW1nLm5hdHVyYWxIZWlnaHQrMipwYWRkaW5nLCBuYW1lfTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXNDb2xsaWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgeD0wO3g8PWF0bGFzU2l6ZS1kYXRhLnc7eCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgeT0wO3k8PWF0bGFzU2l6ZS1kYXRhLmg7eSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbGxpZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBvdGhlciBvZiBpbWFnZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih4ICsgZGF0YS53ID4gb3RoZXIueCAmJiB5ICsgZGF0YS5oID4gb3RoZXIueSAmJiB4IDwgb3RoZXIueCArIG90aGVyLncgJiYgeSA8IG90aGVyLnkgKyBvdGhlci5oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29sbGlkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWlzQ29sbGlkaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS54ID0geDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnkgPSB5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFpc0NvbGxpZGluZykgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGlzQ29sbGlkaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEueCA9IGF0bGFzU2l6ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS55ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXRsYXNTaXplID0gZGF0YS54ICsgZGF0YS53O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpbWFnZXMucHVzaChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICByZXMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGltZy5zcmMgPSB1cmw7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xyXG4gICAgICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICAgIGNhbnZhcy53aWR0aCA9IGF0bGFzU2l6ZTtcclxuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gYXRsYXNTaXplO1xyXG4gICAgICAgIGxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpITtcclxuICAgICAgICBsZXQgYm91bmRzOiB7W25hbWU6c3RyaW5nXTogQXRsYXNJbWFnZX0gPSB7fTtcclxuICAgICAgICBmb3IobGV0IGltZyBvZiBpbWFnZXMpIHtcclxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCBpbWcueCArIHBhZGRpbmcsIGltZy55ICsgcGFkZGluZyk7XHJcbiAgICAgICAgICAgIGlmKHBhZGRpbmcgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgMCwgMCwgMSwgaW1nLmgtMipwYWRkaW5nLCBpbWcueCwgaW1nLnkgKyBwYWRkaW5nLCBwYWRkaW5nLCBpbWcuaC0yKnBhZGRpbmcpOyAvLyBsZWZ0XHJcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZy5pbWcsIGltZy53LTIqcGFkZGluZy0xLCAwLCAxLCBpbWcuaC0yKnBhZGRpbmcsIGltZy54K2ltZy53LXBhZGRpbmcsIGltZy55ICsgcGFkZGluZywgcGFkZGluZywgaW1nLmgtMipwYWRkaW5nKTsgLy8gcmlnaHRcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgMCwgMCwgaW1nLnctMipwYWRkaW5nLCAxLCBpbWcueCArIHBhZGRpbmcsIGltZy55LCBpbWcudy0yKnBhZGRpbmcsIHBhZGRpbmcpOyAvLyB0b3BcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgMCwgaW1nLmgtMipwYWRkaW5nLTEsIGltZy53LTIqcGFkZGluZywgMSwgaW1nLnggKyBwYWRkaW5nLCBpbWcueStpbWcuaC1wYWRkaW5nLCBpbWcudy0yKnBhZGRpbmcsIHBhZGRpbmcpOyAvLyBib3R0b21cclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgMCwgMCwgMiwgMiwgaW1nLngsIGltZy55LCBwYWRkaW5nLCBwYWRkaW5nKTsgLy8gdG9wLWxlZnRcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgaW1nLnctMipwYWRkaW5nLTIsIDAsIDIsIDIsIGltZy54K2ltZy53LXBhZGRpbmcsIGltZy55LCBwYWRkaW5nLCBwYWRkaW5nKTsgLy8gdG9wLXJpZ2h0XHJcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZy5pbWcsIDAsIGltZy5oLTIqcGFkZGluZy0yLCAyLCAyLCBpbWcueCwgaW1nLnkraW1nLmgtcGFkZGluZywgcGFkZGluZywgcGFkZGluZyk7IC8vIGJvdHRvbS1sZWZ0XHJcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZy5pbWcsIGltZy53LTIqcGFkZGluZy0yLCBpbWcuaC0yKnBhZGRpbmctMiwgMiwgMiwgaW1nLngraW1nLnctcGFkZGluZywgaW1nLnkraW1nLmgtcGFkZGluZywgcGFkZGluZywgcGFkZGluZyk7IC8vIGJvdHRvbS1yaWdodFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGltZy54ID0gKGltZy54ICsgcGFkZGluZykgLyBhdGxhc1NpemU7XHJcbiAgICAgICAgICAgIGltZy55ID0gKGltZy55ICsgcGFkZGluZykgLyBhdGxhc1NpemU7XHJcbiAgICAgICAgICAgIGltZy53ID0gKGltZy53IC0gMipwYWRkaW5nKSAvIGF0bGFzU2l6ZTtcclxuICAgICAgICAgICAgaW1nLmggPSAoaW1nLmggLSAyKnBhZGRpbmcpIC8gYXRsYXNTaXplO1xyXG4gICAgICAgICAgICBib3VuZHNbaW1nLm5hbWVdID0gaW1nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdXJsID0gY2FudmFzLnRvRGF0YVVSTCgpO1xyXG4gICAgICAgIGNvbnN0IGF0bGFzSW1hZ2UgPSBhd2FpdCBuZXcgUHJvbWlzZTxIVE1MSW1hZ2VFbGVtZW50PihyZXMgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXMoaW1nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbWcuc3JjID0gdXJsO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBuZXcgVGV4dHVyZUF0bGFzKGF0bGFzSW1hZ2UsIGJvdW5kcyk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBDT0xPUiBDTEFTUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgY2xhc3MgQ29sb3Ige1xyXG4gICAgY29uc3RydWN0b3IoKTtcclxuICAgIGNvbnN0cnVjdG9yKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIpO1xyXG4gICAgY29uc3RydWN0b3IocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlciwgYTogbnVtYmVyKTtcclxuICAgIGNvbnN0cnVjdG9yKGNvbG9yOiBzdHJpbmcgfCBDb2xvcik7XHJcbiAgICBjb25zdHJ1Y3RvcihhcmdBPzogbnVtYmVyIHwgc3RyaW5nIHwgQ29sb3IsIGFyZ0I/OiBudW1iZXIsIGFyZ0M/OiBudW1iZXIsIGFyZ0Q/OiBudW1iZXIpIHtcclxuICAgICAgICBpZih0eXBlb2YgYXJnQSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBsZXQgY29tcCA9IGFyZ0Euc3BsaXQoXCIoXCIpO1xyXG4gICAgICAgICAgICBpZihjb21wLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciBjb25zdHJ1Y3RvcjogRW1wdHkgc3RyaW5nXCIpO1xyXG4gICAgICAgICAgICBpZihjb21wLmxlbmd0aCA8IDIpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIGNvbnN0cnVjdG9yOiBcIiArIGNvbXBbMF0pO1xyXG4gICAgICAgICAgICBsZXQgY3N0cnVjdCA9IGNvbXBbMF07XHJcbiAgICAgICAgICAgIGxldCBjcGFyYW0gPSBjb21wWzFdIS5yZXBsYWNlKFwiKVwiLCBcIlwiKTtcclxuICAgICAgICAgICAgaWYoY3N0cnVjdCA9PT0gXCJyZ2JcIiB8fCBjc3RydWN0ID09PSBcInJnYmFcIikge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhcmdzID0gY3BhcmFtLnNwbGl0KFwiLFwiKTtcclxuICAgICAgICAgICAgICAgIGlmKGNhcmdzLmxlbmd0aCA8IDMgfHwgY2FyZ3MubGVuZ3RoID4gNClcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIGFyZ3VtZW50IGNvdW50OiBcIiArIGNhcmdzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgciA9IHBhcnNlSW50KGNhcmdzWzBdISk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZyA9IHBhcnNlSW50KGNhcmdzWzFdISk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYiA9IHBhcnNlSW50KGNhcmdzWzJdISk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYSA9IGNhcmdzWzNdID8gcGFyc2VGbG9hdChjYXJnc1szXSEpIDogMTtcclxuICAgICAgICAgICAgICAgIGlmKGlzTmFOKHIpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIHZhbHVlOiBcIiArIGNhcmdzWzBdKTtcclxuICAgICAgICAgICAgICAgIGlmKGlzTmFOKGcpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIHZhbHVlOiBcIiArIGNhcmdzWzFdKTtcclxuICAgICAgICAgICAgICAgIGlmKGlzTmFOKGIpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIHZhbHVlOiBcIiArIGNhcmdzWzJdKTtcclxuICAgICAgICAgICAgICAgIGlmKGlzTmFOKGEpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIHZhbHVlOiBcIiArIGNhcmdzWzNdKTtcclxuICAgICAgICAgICAgICAgIHIgPSBFTWF0aC5jbGFtcChNYXRoLnJvdW5kKHIpLCAwLCAyNTUpO1xyXG4gICAgICAgICAgICAgICAgZyA9IEVNYXRoLmNsYW1wKE1hdGgucm91bmQoZyksIDAsIDI1NSk7XHJcbiAgICAgICAgICAgICAgICBiID0gRU1hdGguY2xhbXAoTWF0aC5yb3VuZChiKSwgMCwgMjU1KTtcclxuICAgICAgICAgICAgICAgIGEgPSBFTWF0aC5jbGFtcChhLCAwLCAxKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3IgPSByO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZyA9IGc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iID0gYjtcclxuICAgICAgICAgICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFJnYiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRIc3YgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYoY3N0cnVjdCA9PT0gXCJoc3ZcIiB8fCBjc3RydWN0ID09PSBcImhzdmFcIikge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhcmdzID0gY3BhcmFtLnNwbGl0KFwiLFwiKTtcclxuICAgICAgICAgICAgICAgIGlmKGNhcmdzLmxlbmd0aCA8IDMgfHwgY2FyZ3MubGVuZ3RoID4gNClcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIGFyZ3VtZW50IGNvdW50OiBcIiArIGNhcmdzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgaDogbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgaWYoY2FyZ3NbMF0hLmluY2x1ZGVzKFwicmFkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaCA9IHBhcnNlRmxvYXQoY2FyZ3NbMF0hKSAqIDE4MCAvIE1hdGguUEk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGggPSBwYXJzZUludChjYXJnc1swXSEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IHMgPSBwYXJzZUludChjYXJnc1sxXSEpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHYgPSBwYXJzZUludChjYXJnc1syXSEpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGEgPSBjYXJnc1szXSA/IHBhcnNlSW50KGNhcmdzWzNdISkgOiAxO1xyXG4gICAgICAgICAgICAgICAgaWYoaXNOYU4oaCkpIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgdmFsdWU6IFwiICsgY2FyZ3NbMF0pO1xyXG4gICAgICAgICAgICAgICAgaWYoaXNOYU4ocykpIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgdmFsdWU6IFwiICsgY2FyZ3NbMV0pO1xyXG4gICAgICAgICAgICAgICAgaWYoaXNOYU4odikpIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgdmFsdWU6IFwiICsgY2FyZ3NbMl0pO1xyXG4gICAgICAgICAgICAgICAgaWYoaXNOYU4oYSkpIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgdmFsdWU6IFwiICsgY2FyZ3NbM10pO1xyXG4gICAgICAgICAgICAgICAgaCA9IEVNYXRoLnBtb2QoaCwgMzYwKTtcclxuICAgICAgICAgICAgICAgIHMgPSBFTWF0aC5jbGFtcChzLCAwLCAxMDApO1xyXG4gICAgICAgICAgICAgICAgdiA9IEVNYXRoLmNsYW1wKHYsIDAsIDEwMCk7XHJcbiAgICAgICAgICAgICAgICBhID0gRU1hdGguY2xhbXAoYSwgMCwgMSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9odWUgPSBoO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2F0ID0gcztcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZhbCA9IHY7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRIc3YgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX291dGRhdGVkUmdiID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgY29uc3RydWN0b3I6IFwiICsgY3N0cnVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYodHlwZW9mIGFyZ0EgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgaWYgKGFyZ0IgPT09IHVuZGVmaW5lZCB8fCBhcmdDID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgY29uc3RydWN0b3I6IE5vdCBlbm91Z2ggYXJndW1lbnRzXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3IgPSBFTWF0aC5jbGFtcChNYXRoLnJvdW5kKGFyZ0EpLCAwLCAyNTUpO1xyXG4gICAgICAgICAgICB0aGlzLl9nID0gRU1hdGguY2xhbXAoTWF0aC5yb3VuZChhcmdCISksIDAsIDI1NSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2IgPSBFTWF0aC5jbGFtcChNYXRoLnJvdW5kKGFyZ0MhKSwgMCwgMjU1KTtcclxuICAgICAgICAgICAgdGhpcy5hID0gRU1hdGguY2xhbXAoYXJnRCA/PyAxLCAwLCAxKTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSZ2IgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRIc3YgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZihhcmdBID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fciA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuX2cgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLl9iID0gMDtcclxuICAgICAgICAgICAgdGhpcy5hID0gMTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSZ2IgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRIc3YgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3IgPSBhcmdBIS5yO1xyXG4gICAgICAgICAgICB0aGlzLl9nID0gYXJnQSEuZztcclxuICAgICAgICAgICAgdGhpcy5fYiA9IGFyZ0EhLmI7XHJcbiAgICAgICAgICAgIHRoaXMuYSA9IGFyZ0EhLmE7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkUmdiID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkSHN2ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25NdXRhdGU/OiAoKSA9PiB2b2lkO1xyXG4gICAgbXV0YXRlKCkge1xyXG4gICAgICAgIGlmKHRoaXMub25NdXRhdGUpXHJcbiAgICAgICAgICAgIHRoaXMub25NdXRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9uZSgpOiBDb2xvciB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcih0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZGVjaW1hbFRvUkdCKGQ6IG51bWJlcikge1xyXG4gICAgICAgIGQgPSBFTWF0aC5jbGFtcChkLCAwLCAxLTFlLTYpO1xyXG4gICAgICAgIGxldCBpbmRleCA9IE1hdGguZmxvb3IoZCAqIDE2Nzc3MjE2KTtcclxuICAgICAgICBsZXQgciA9IChpbmRleCA+PiAxNikgJiAweEZGO1xyXG4gICAgICAgIGxldCBnID0gKGluZGV4ID4+IDgpICYgMHhGRjtcclxuICAgICAgICBsZXQgYiA9IChpbmRleCkgJiAweEZGO1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29sb3IociwgZywgYik7XHJcbiAgICB9XHJcblxyXG4gICAgX291dGRhdGVkUmdiPzogYm9vbGVhbjtcclxuICAgIF9yID0gMDtcclxuICAgIC8qKlxyXG4gICAgICogKGludCkgcmVkIHZhbHVlIG9mIHRoZSBjb2xvciwgMCAtIDI1NS5cclxuICAgICovXHJcbiAgICBzZXQgcih2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFsdWUgPSBFTWF0aC5jbGFtcChNYXRoLnJvdW5kKHZhbHVlKSwgMCwgMjU1KTtcclxuICAgICAgICBpZih2YWx1ZSA9PSB0aGlzLl9yKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZ2IoKTtcclxuICAgICAgICB0aGlzLl9yID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRIc3YgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgcigpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yO1xyXG4gICAgfVxyXG5cclxuICAgIF9nID0gMDtcclxuICAgIC8qKlxyXG4gICAgICogKGludCkgZ3JlZW4gdmFsdWUgb2YgdGhlIGNvbG9yLCAwIC0gMjU1LlxyXG4gICAgKi9cclxuICAgIHNldCBnKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB2YWx1ZSA9IEVNYXRoLmNsYW1wKE1hdGgucm91bmQodmFsdWUpLCAwLCAyNTUpO1xyXG4gICAgICAgIGlmKHZhbHVlID09IHRoaXMuX2cpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIHRoaXMuX2cgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZEhzdiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgIH1cclxuICAgIGdldCBnKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2c7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIF9iID0gMDtcclxuICAgIC8qKlxyXG4gICAgICogKGludCkgYmx1ZSB2YWx1ZSBvZiB0aGUgY29sb3IsIDAgLSAyNTUuXHJcbiAgICAqL1xyXG4gICAgc2V0IGIodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHZhbHVlID0gRU1hdGguY2xhbXAoTWF0aC5yb3VuZCh2YWx1ZSksIDAsIDI1NSk7XHJcbiAgICAgICAgaWYodmFsdWUgPT0gdGhpcy5fYilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgdGhpcy5fYiA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkSHN2ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IGIoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZ2IoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYjtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVSZ2IoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRSZ2IgIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHtfaHVlOmgsIF9zYXQ6cywgX3ZhbDp2fSA9IHRoaXM7XHJcbiAgICAgICAgY29uc3QgYyA9IHYgLyAxMDAgKiBzIC8gMTAwO1xyXG4gICAgICAgIGNvbnN0IHggPSBjICogKDEgLSBNYXRoLmFicygoKGggLyA2MCkgJSAyKSAtIDEpKTtcclxuICAgICAgICBjb25zdCBtID0gdiAvIDEwMCAtIGM7XHJcbiAgICAgICAgbGV0IHJwPTAsIGdwPTAsIGJwPTA7XHJcbiAgICAgICAgc3dpdGNoKE1hdGguZmxvb3IoaCAvIDYwKSkge1xyXG4gICAgICAgICAgICBjYXNlIDA6IHJwPWM7IGdwPXg7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDE6IHJwPXg7IGdwPWM7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDI6IGdwPWM7IGJwPXg7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM6IGdwPXg7IGJwPWM7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQ6IHJwPXg7IGJwPWM7IGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBycD1jOyBicD14OyBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fciA9IE1hdGgucm91bmQoKHJwICsgbSkgKiAyNTUpO1xyXG4gICAgICAgIHRoaXMuX2cgPSBNYXRoLnJvdW5kKChncCArIG0pICogMjU1KTtcclxuICAgICAgICB0aGlzLl9iID0gTWF0aC5yb3VuZCgoYnAgKyBtKSAqIDI1NSk7XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSZ2IgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBfb3V0ZGF0ZWRIc3Y/OiBib29sZWFuO1xyXG4gICAgX2h1ZSA9IDA7XHJcbiAgICAvKipcclxuICAgICAqIChkZWNpbWFsKSBodWUgb2YgdGhlIGNvbG9yIGluIGRlZ3JlZXMsIDAgLSAzNjAuXHJcbiAgICAqL1xyXG4gICAgc2V0IGh1ZSh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFsdWUgPSBFTWF0aC5wbW9kKHZhbHVlLCAzNjApO1xyXG4gICAgICAgIGlmKHZhbHVlID09IHRoaXMuX2h1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudXBkYXRlSHN2KCk7XHJcbiAgICAgICAgdGhpcy5faHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSZ2IgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgaHVlKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlSHN2KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2h1ZTtcclxuICAgIH1cclxuXHJcbiAgICBfc2F0ID0gMDtcclxuICAgIC8qKlxyXG4gICAgICogKGRlY2ltYWwpIHNhdHVyYXRpb24gb2YgdGhlIGNvbG9yLCAwIC0gMTAwLlxyXG4gICAgKi9cclxuICAgIHNldCBzYXQodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHZhbHVlID0gRU1hdGguY2xhbXAodmFsdWUsIDAsIDEwMCk7XHJcbiAgICAgICAgaWYodmFsdWUgPT0gdGhpcy5fc2F0KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy51cGRhdGVIc3YoKTtcclxuICAgICAgICB0aGlzLl9zYXQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZFJnYiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgIH1cclxuICAgIGdldCBzYXQoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVIc3YoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2F0O1xyXG4gICAgfVxyXG5cclxuICAgIF92YWwgPSAwO1xyXG4gICAgLyoqXHJcbiAgICAgKiAoZGVjaW1hbCkgdmFsdWUvYnJpZ2h0bmVzcyBvZiB0aGUgY29sb3IsIDAgLSAxMDAuXHJcbiAgICAqL1xyXG4gICAgc2V0IHZhbCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFsdWUgPSBFTWF0aC5jbGFtcCh2YWx1ZSwgMCwgMTAwKTtcclxuICAgICAgICBpZih2YWx1ZSA9PSB0aGlzLl92YWwpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnVwZGF0ZUhzdigpO1xyXG4gICAgICAgIHRoaXMuX3ZhbCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkUmdiID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IHZhbCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUhzdigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92YWw7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlSHN2KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkSHN2ICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjb25zdCBtYXggPSBNYXRoLm1heCh0aGlzLnIsIHRoaXMuZywgdGhpcy5iKTtcclxuICAgICAgICBjb25zdCBtaW4gPSBNYXRoLm1pbih0aGlzLnIsIHRoaXMuZywgdGhpcy5iKTtcclxuICAgICAgICBjb25zdCBkZWx0YSA9IG1heCAtIG1pbjtcclxuICAgICAgICBsZXQgaCA9IDA7XHJcbiAgICAgICAgaWYoZGVsdGEgIT09IDApIHtcclxuICAgICAgICAgICAgaWYobWF4ID09PSB0aGlzLnIpIGggPSA2MCAqICgoKHRoaXMuZyAtIHRoaXMuYikgLyBkZWx0YSArIDYpICUgNik7XHJcbiAgICAgICAgICAgIGVsc2UgaWYobWF4ID09PSB0aGlzLmcpIGggPSA2MCAqICgodGhpcy5iIC0gdGhpcy5yKSAvIGRlbHRhICsgMik7XHJcbiAgICAgICAgICAgIGVsc2UgaCA9IDYwICogKCh0aGlzLnIgLSB0aGlzLmcpIC8gZGVsdGEgKyA0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoaCA8IDApIGggKz0gMzYwO1xyXG4gICAgICAgIGNvbnN0IHMgPSBtYXggPT09IDAgPyAwIDogZGVsdGEvbWF4KjEwMDtcclxuICAgICAgICBjb25zdCB2ID0gbWF4LzI1NSoxMDA7XHJcbiAgICAgICAgdGhpcy5faHVlID0gaDtcclxuICAgICAgICB0aGlzLl9zYXQgPSBzO1xyXG4gICAgICAgIHRoaXMuX3ZhbCA9IHY7XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRIc3YgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIChkZWNpbWFsKSBhbHBoYS9vcGFjaXR5IG9mIHRoZSBjb2xvciwgMCAtIDEuXHJcbiAgICAqL1xyXG4gICAgYSA9IDE7XHJcblxyXG4gICAgc3RyaWN0RXF1YWxzKG90aGVyOiBDb2xvcikge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgb3RoZXIudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgdGhpcy5fciA9PSBvdGhlci5fclxyXG4gICAgICAgICAgICAmJiB0aGlzLl9nID09IG90aGVyLl9nXHJcbiAgICAgICAgICAgICYmIHRoaXMuX2IgPT0gb3RoZXIuX2JcclxuICAgICAgICAgICAgJiYgdGhpcy5hID09IG90aGVyLmFcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgaXNDbG9zZShvdGhlcjogQ29sb3IsIGUgPSAxZS02KSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZ2IoKTtcclxuICAgICAgICBvdGhlci51cGRhdGVSZ2IoKTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICBFTWF0aC5pc0Nsb3NlKHRoaXMuX3IsIG90aGVyLl9yLCBlKVxyXG4gICAgICAgICAgICAmJiBFTWF0aC5pc0Nsb3NlKHRoaXMuX2csIG90aGVyLl9nLCBlKVxyXG4gICAgICAgICAgICAmJiBFTWF0aC5pc0Nsb3NlKHRoaXMuX2IsIG90aGVyLl9iLCBlKVxyXG4gICAgICAgICAgICAmJiBFTWF0aC5pc0Nsb3NlKHRoaXMuYSwgb3RoZXIuYSwgZSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgc3RyaWN0RXF1YWxzUmdiKG90aGVyOiBDb2xvcikge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgb3RoZXIudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgdGhpcy5fciA9PSBvdGhlci5fclxyXG4gICAgICAgICAgICAmJiB0aGlzLl9nID09IG90aGVyLl9nXHJcbiAgICAgICAgICAgICYmIHRoaXMuX2IgPT0gb3RoZXIuX2JcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgaXNDbG9zZVJnYihvdGhlcjogQ29sb3IsIGUgPSAxZS02KSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZ2IoKTtcclxuICAgICAgICBvdGhlci51cGRhdGVSZ2IoKTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICBFTWF0aC5pc0Nsb3NlKHRoaXMuX3IsIG90aGVyLl9yLCBlKVxyXG4gICAgICAgICAgICAmJiBFTWF0aC5pc0Nsb3NlKHRoaXMuX2csIG90aGVyLl9nLCBlKVxyXG4gICAgICAgICAgICAmJiBFTWF0aC5pc0Nsb3NlKHRoaXMuX2IsIG90aGVyLl9iLCBlKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBsZXJwUmdiYShvdGhlcjogQ29sb3IsIHQ6IG51bWJlcik6IENvbG9yIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxlcnBSZ2JhU2VsZihvdGhlciwgdCk7XHJcbiAgICB9XHJcbiAgICBsZXJwUmdiYVNlbGYob3RoZXI6IENvbG9yLCB0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIG90aGVyLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIHRoaXMuX3IgPSBFTWF0aC5sZXJwKHRoaXMuX3IsIG90aGVyLl9yLCB0KTtcclxuICAgICAgICB0aGlzLl9nID0gRU1hdGgubGVycCh0aGlzLl9nLCBvdGhlci5fZywgdCk7XHJcbiAgICAgICAgdGhpcy5fYiA9IEVNYXRoLmxlcnAodGhpcy5fYiwgb3RoZXIuX2IsIHQpO1xyXG4gICAgICAgIHRoaXMuYSA9IEVNYXRoLmxlcnAodGhpcy5hLCBvdGhlci5hLCB0KTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbGVycEhzdmEob3RoZXI6IENvbG9yLCB0OiBudW1iZXIpOiBDb2xvciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sZXJwSHN2YVNlbGYob3RoZXIsIHQpO1xyXG4gICAgfVxyXG4gICAgbGVycEhzdmFTZWxmKG90aGVyOiBDb2xvciwgdDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVIc3YoKTtcclxuICAgICAgICBvdGhlci51cGRhdGVIc3YoKTtcclxuICAgICAgICB0aGlzLl9odWUgPSBFTWF0aC5sZXJwKHRoaXMuX2h1ZSwgb3RoZXIuX2h1ZSwgdCk7XHJcbiAgICAgICAgdGhpcy5fc2F0ID0gRU1hdGgubGVycCh0aGlzLl9zYXQsIG90aGVyLl9zYXQsIHQpO1xyXG4gICAgICAgIHRoaXMuX3ZhbCA9IEVNYXRoLmxlcnAodGhpcy5fdmFsLCBvdGhlci5fdmFsLCB0KTtcclxuICAgICAgICB0aGlzLmEgPSBFTWF0aC5sZXJwKHRoaXMuYSwgb3RoZXIuYSwgdCk7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGdldElzRm9yZWdyb3VuZFdoaXRlKHRocmVzaG9sZCA9IDAuNDIpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIGxldCB7X3I6ciwgX2c6ZywgX2I6Yn0gPSB0aGlzO1xyXG4gICAgICAgIHIgLz0gMjU1O1xyXG4gICAgICAgIGcgLz0gMjU1O1xyXG4gICAgICAgIGIgLz0gMjU1O1xyXG4gICAgICAgIHIgPSAociA8IDAuMDM5MjgpID8gKHIgLyAxMi45MikgOiAoKChyICsgMC4wNTUpIC8gMS4wNTUpICoqIDIuNClcclxuICAgICAgICBnID0gKGcgPCAwLjAzOTI4KSA/IChnIC8gMTIuOTIpIDogKCgoZyArIDAuMDU1KSAvIDEuMDU1KSAqKiAyLjQpXHJcbiAgICAgICAgYiA9IChiIDwgMC4wMzkyOCkgPyAoYiAvIDEyLjkyKSA6ICgoKGIgKyAwLjA1NSkgLyAxLjA1NSkgKiogMi40KVxyXG4gICAgICAgIGxldCBsID0gMC4yMTI2ICogciArIDAuNzE1MiAqIGcgKyAwLjA3MjIgKiBiXHJcbiAgICAgICAgcmV0dXJuIGwgPCB0aHJlc2hvbGQ7XHJcbiAgICB9XHJcbiAgICB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBgcmdiYSgke3RoaXMucn0sICR7dGhpcy5nfSwgJHt0aGlzLmJ9LCAke3RoaXMuYX0pYDtcclxuICAgIH1cclxuICAgIHRvUmdiYUFycmF5KCk6IFtyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyLCBhOiBudW1iZXJdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMuciwgdGhpcy5nLCB0aGlzLmIsIHRoaXMuYV07XHJcbiAgICB9XHJcbiAgICB0b0hzdmFBcnJheSgpOiBbaDogbnVtYmVyLCBzOiBudW1iZXIsIHY6IG51bWJlciwgYTogbnVtYmVyXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLmh1ZSwgdGhpcy5zYXQsIHRoaXMudmFsLCB0aGlzLmFdO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBJTlBVVCBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEtleXByZXNzZXMge1xyXG4gICAgc3RhdGljIGtleVByZXNzZWQ6IHtba2V5OnN0cmluZ106IGFueX0gPSB7fTtcclxuICAgIHN0YXRpYyBwcmVzc2VkS2V5czogU2V0PHN0cmluZz4gPSBuZXcgU2V0KCk7XHJcbiAgICBzdGF0aWMga2V5RG93bkV2ZW50ID0gbmV3IFNpZ25hbDxba2V5TmFtZTpzdHJpbmddPigpO1xyXG4gICAgc3RhdGljIGtleVVwRXZlbnQgPSBuZXcgU2lnbmFsPFtrZXlOYW1lOnN0cmluZ10+KCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBrZXlkb3duKGtleTogc3RyaW5nKSB7XHJcbiAgICBLZXlwcmVzc2VzLmtleVByZXNzZWRba2V5XSA9IHRydWU7XHJcbiAgICBLZXlwcmVzc2VzLnByZXNzZWRLZXlzLmFkZChrZXkpO1xyXG4gICAgS2V5cHJlc3Nlcy5rZXlEb3duRXZlbnQuZmlyZShrZXkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24ga2V5dXAoa2V5OiBzdHJpbmcpIHtcclxuICAgIGRlbGV0ZSBLZXlwcmVzc2VzLmtleVByZXNzZWRba2V5XTtcclxuICAgIEtleXByZXNzZXMucHJlc3NlZEtleXMuZGVsZXRlKGtleSk7XHJcbiAgICBLZXlwcmVzc2VzLmtleVVwRXZlbnQuZmlyZShrZXkpO1xyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZSA9PiB7XHJcbiAgICBjb25zdCBrZXkgPSBlLmtleS50b0xvd2VyQ2FzZSgpO1xyXG4gICAga2V5ZG93bihrZXkpO1xyXG59KTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZSA9PiB7XHJcbiAgICBjb25zdCBrZXkgPSBlLmtleS50b0xvd2VyQ2FzZSgpO1xyXG4gICAga2V5dXAoa2V5KTtcclxufSk7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBlID0+IHtcclxuICAgIGlmKGUuYnV0dG9uID09PSAwKSB7XHJcbiAgICAgICAga2V5ZG93bihcImxtYlwiKTtcclxuICAgIH0gZWxzZSBpZihlLmJ1dHRvbiA9PT0gMSkge1xyXG4gICAgICAgIGtleWRvd24oXCJtbWJcIik7XHJcbiAgICB9IGVsc2UgaWYoZS5idXR0b24gPT09IDIpIHtcclxuICAgICAgICBrZXlkb3duKFwicm1iXCIpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBlID0+IHtcclxuICAgIGlmKGUuYnV0dG9uID09PSAwKSB7XHJcbiAgICAgICAga2V5dXAoXCJsbWJcIik7XHJcbiAgICB9IGVsc2UgaWYoZS5idXR0b24gPT09IDEpIHtcclxuICAgICAgICBrZXl1cChcIm1tYlwiKTtcclxuICAgIH0gZWxzZSBpZihlLmJ1dHRvbiA9PT0gMikge1xyXG4gICAgICAgIGtleXVwKFwicm1iXCIpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmV4cG9ydCBjbGFzcyBQb2ludGVyTG9jayB7XHJcbiAgICBjb25uZWN0aW9ucyA9IG5ldyBDb25uZWN0aW9uR3JvdXAoKTtcclxuICAgIHBvaW50ZXJMb2NrQ2hhbmdlRXZlbnQ6IFNpZ25hbDxbaXNMb2NrZWQ6IGJvb2xlYW5dPiA9IG5ldyBTaWduYWwoKTtcclxuICAgIGxvY2tlZE1vdXNlTW92ZUV2ZW50OiBTaWduYWw8W2R4OiBudW1iZXIsIGR5OiBudW1iZXJdPiA9IG5ldyBTaWduYWwoKTtcclxuICAgIGlzRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5hZGQobmV3IEh0bWxDb25uZWN0aW9uKHdpbmRvdywgXCJtb3VzZWRvd25cIiwgKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYodGhpcy5pc0VuYWJsZWQgJiYgZG9jdW1lbnQucG9pbnRlckxvY2tFbGVtZW50ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVxdWVzdFBvaW50ZXJMb2NrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5hZGQobmV3IEh0bWxDb25uZWN0aW9uKHdpbmRvdywgXCJtb3VzZW1vdmVcIiwgKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYoZG9jdW1lbnQucG9pbnRlckxvY2tFbGVtZW50ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2tlZE1vdXNlTW92ZUV2ZW50LmZpcmUoZS5tb3ZlbWVudFgsIGUubW92ZW1lbnRZKTtcclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5hZGQobmV3IEh0bWxDb25uZWN0aW9uKGRvY3VtZW50LCBcInBvaW50ZXJsb2NrY2hhbmdlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wb2ludGVyTG9ja0NoYW5nZUV2ZW50LmZpcmUoZG9jdW1lbnQucG9pbnRlckxvY2tFbGVtZW50ICE9IG51bGwpO1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuICAgIGxvY2soKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5pc0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVxdWVzdFBvaW50ZXJMb2NrKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICB1bmxvY2soKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5pc0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICBkb2N1bWVudC5leGl0UG9pbnRlckxvY2soKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJlbW92ZSgpIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmRpc2Nvbm5lY3RBbGwoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgT0JTRVJWRVIgQ0xBU1NFUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBXaW5kb3dSZXNpemVPYnNlcnZlciB7XHJcbiAgICByZXNpemVFdmVudDogU2lnbmFsPFt3OiBudW1iZXIsIGg6IG51bWJlcl0+ID0gbmV3IFNpZ25hbCh7XHJcbiAgICAgICAgb25Db25uZWN0OiBjb25uID0+IGNvbm4uZmlyZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KSxcclxuICAgIH0pO1xyXG4gICAgY29ubmVjdGlvbnMgPSBuZXcgQ29ubmVjdGlvbkdyb3VwKCk7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmFkZChuZXcgSHRtbENvbm5lY3Rpb24od2luZG93LCBcInJlc2l6ZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzaXplRXZlbnQuZmlyZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcbiAgICByZW1vdmUoKSB7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5kaXNjb25uZWN0QWxsKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBSRU5ERVIgTE9PUCBDTEFTUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgY2xhc3MgUmVuZGVyTG9vcCB7XHJcbiAgICByZW5kZXJTdGVwcGVkRXZlbnQ6IFNpZ25hbDxbZHQ6IG51bWJlcl0+ID0gbmV3IFNpZ25hbCgpO1xyXG4gICAgcnVuSW5kZXggPSAwO1xyXG4gICAgaXNSdW5uaW5nID0gZmFsc2U7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgY2FsbGJhY2s6IChkdDogbnVtYmVyKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIGlmKCF0aGlzLmlzUnVubmluZylcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgdGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJ1bkluZGV4Kys7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICBpZih0aGlzLmlzUnVubmluZylcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgdGhpcy5pc1J1bm5pbmcgPSB0cnVlO1xyXG4gICAgICAgIGxldCByaSA9IHRoaXMucnVuSW5kZXg7XHJcbiAgICAgICAgbGV0IGZyYW1lVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpLzEwMDA7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZih0aGlzLnJ1bkluZGV4ICE9IHJpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpLzEwMDA7XHJcbiAgICAgICAgICAgIGxldCBkdCA9IG5vdyAtIGZyYW1lVGltZTtcclxuICAgICAgICAgICAgZnJhbWVUaW1lID0gbm93O1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlclN0ZXBwZWRFdmVudC5maXJlKGR0KTtcclxuICAgICAgICAgICAgdGhpcy5jYWxsYmFjayhkdCk7XHJcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZW5kZXIoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIEFSVElGSUNJQUwgSU5URUxMSUdFTkNFICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCB0eXBlIExheWVyQWN0aXZhdGlvbiA9IHtcclxuICAgIGFjdGl2YXRlOiAoejogbnVtYmVyKSA9PiBudW1iZXIsXHJcbiAgICBkYV9kejogKHo6IG51bWJlciwgYTogbnVtYmVyKSA9PiBudW1iZXIsXHJcbiAgICBuYW1lOiBzdHJpbmcsXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBTaWdtb2lkQWN0aXZhdGlvbjogTGF5ZXJBY3RpdmF0aW9uID0ge1xyXG4gICAgYWN0aXZhdGU6ICh6OiBudW1iZXIpID0+IDEvKDErTWF0aC5leHAoLXopKSxcclxuICAgIGRhX2R6OiAoejogbnVtYmVyLCBhOiBudW1iZXIpID0+IGEgKiAoMSAtIGEpLFxyXG4gICAgbmFtZTogXCJTaWdtb2lkXCIsXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBSZWx1QWN0aXZhdGlvbjogTGF5ZXJBY3RpdmF0aW9uID0ge1xyXG4gICAgYWN0aXZhdGU6ICh6OiBudW1iZXIpID0+IE1hdGgubWF4KHosIDApLFxyXG4gICAgZGFfZHo6ICh6OiBudW1iZXIsIGE6IG51bWJlcikgPT4geiA+IDAgPyAxIDogMCxcclxuICAgIG5hbWU6IFwiUmVMVVwiLFxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgTGluZWFyQWN0aXZhdGlvbjogTGF5ZXJBY3RpdmF0aW9uID0ge1xyXG4gICAgYWN0aXZhdGU6ICh6OiBudW1iZXIpID0+IHosXHJcbiAgICBkYV9kejogKHo6IG51bWJlciwgYTogbnVtYmVyKSA9PiAxLFxyXG4gICAgbmFtZTogXCJMaW5lYXJcIixcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzb2Z0bWF4TGF5ZXIobGF5ZXI6IERlbnNlTGF5ZXIpIHtcclxuICAgIGxldCBtYXggPSAtSW5maW5pdHk7XHJcbiAgICBmb3IobGV0IGk9MDsgaTxsYXllci5zaXplOyBpKyspIHtcclxuICAgICAgICBtYXggPSBNYXRoLm1heChtYXgsIGxheWVyLnZhbHVlc196W2ldISk7XHJcbiAgICB9XHJcbiAgICBsZXQgc3VtID0gMDtcclxuICAgIGZvcihsZXQgaT0wOyBpPGxheWVyLnNpemU7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHYgPSBNYXRoLmV4cChsYXllci52YWx1ZXNfeltpXSEgLSBtYXgpO1xyXG4gICAgICAgIGxheWVyLnZhbHVlc19hW2ldID0gdjtcclxuICAgICAgICBzdW0gKz0gdjtcclxuICAgIH1cclxuICAgIGZvcihsZXQgaT0wOyBpPGxheWVyLnNpemU7IGkrKykge1xyXG4gICAgICAgIGxheWVyLnZhbHVlc19hW2ldISAvPSBzdW07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIExheWVyRXJyb3IgPSB7XHJcbiAgICBkZXJyX2RhOiAobGF5ZXI6IERlbnNlTGF5ZXIsIG91dHB1dDogRmxvYXQzMkFycmF5IHwgbnVtYmVyW10sIGk6IG51bWJlcikgPT4gbnVtYmVyLFxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgTXNlRXJyb3I6IExheWVyRXJyb3IgPSB7XHJcbiAgICBkZXJyX2RhOiAobGF5ZXI6IERlbnNlTGF5ZXIsIG91dHB1dDogRmxvYXQzMkFycmF5IHwgbnVtYmVyW10sIGk6IG51bWJlcikgPT4ge1xyXG4gICAgICAgIHJldHVybiAtMi9sYXllci5zaXplICogKG91dHB1dFtpXSEgLSBsYXllci52YWx1ZXNfYVtpXSEpO1xyXG4gICAgfSxcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgV2VpZ2h0UmFuZG9taXplciA9IHtcclxuICAgIGdldDogKG5JbjogbnVtYmVyLCBuT3V0OiBudW1iZXIpID0+IG51bWJlcixcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBYYXZpZXJOb3JtYWw6IFdlaWdodFJhbmRvbWl6ZXIgPSB7XHJcbiAgICBnZXQ6IChuSW46IG51bWJlciwgbk91dDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcDEgPSBNYXRoLnNxcnQoLTIgKiBNYXRoLmxvZyhNYXRoLm1heChNYXRoLnJhbmRvbSgpLCAxZS03KSkpO1xyXG4gICAgICAgIGNvbnN0IHAyID0gTWF0aC5jb3MoMiAqIE1hdGguUEkgKiBNYXRoLnJhbmRvbSgpKTtcclxuICAgICAgICBjb25zdCBwMyA9IE1hdGguc3FydCgyIC8gKG5JbiArIG5PdXQpKTtcclxuICAgICAgICByZXR1cm4gcDEgKiBwMiAqIHAzO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IFhhdmllclVuaWZvcm06IFdlaWdodFJhbmRvbWl6ZXIgPSB7XHJcbiAgICBnZXQ6IChuSW46IG51bWJlciwgbk91dDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbGltaXQgPSBNYXRoLnNxcnQoNiAvIChuSW4gKyBuT3V0KSk7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiAoMiAqIGxpbWl0KSAtIGxpbWl0O1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IEhlTm9ybWFsOiBXZWlnaHRSYW5kb21pemVyID0ge1xyXG4gICAgZ2V0OiAobkluOiBudW1iZXIsIG5PdXQ6IG51bWJlcikgPT4ge1xyXG4gICAgICAgIGNvbnN0IHAxID0gTWF0aC5zcXJ0KC0yICogTWF0aC5sb2coTWF0aC5tYXgoTWF0aC5yYW5kb20oKSwgMWUtNykpKTtcclxuICAgICAgICBjb25zdCBwMiA9IE1hdGguY29zKDIgKiBNYXRoLlBJICogTWF0aC5yYW5kb20oKSk7XHJcbiAgICAgICAgY29uc3QgcDMgPSBNYXRoLnNxcnQoMiAvIG5Jbik7XHJcbiAgICAgICAgcmV0dXJuIHAxICogcDIgKiBwMztcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBIZVVuaWZvcm06IFdlaWdodFJhbmRvbWl6ZXIgPSB7XHJcbiAgICBnZXQ6IChuSW46IG51bWJlciwgbk91dDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbGltaXQgPSBNYXRoLnNxcnQoNiAvIG5Jbik7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiAoMiAqIGxpbWl0KSAtIGxpbWl0O1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IFJhbmRvbVVuaWZvcm06IFdlaWdodFJhbmRvbWl6ZXIgPSB7XHJcbiAgICBnZXQ6IChuSW46IG51bWJlciwgbk91dDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogMC4wMTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBMYXllck9wdGltaXplciB7XHJcbiAgICBhYnN0cmFjdCBhcHBseUdyYWRpZW50cyhsZWFyblJhdGU6IG51bWJlciwgYmF0Y2hTaXplOiBudW1iZXIsIGNsZWFyR3JhZGllbnRzOiBib29sZWFuKTogdm9pZDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNnZE9wdGltaXplciBleHRlbmRzIExheWVyT3B0aW1pemVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBsYXllcjogRGVuc2VMYXllcikgeyBzdXBlcigpOyB9XHJcbiAgICBhcHBseUdyYWRpZW50cyhsZWFyblJhdGU6IG51bWJlciwgYmF0Y2hTaXplOiBudW1iZXIsIGNsZWFyR3JhZGllbnRzOiBib29sZWFuKSB7XHJcbiAgICAgICAgY29uc3QgbGF5ZXIgPSB0aGlzLmxheWVyO1xyXG4gICAgICAgIGNvbnN0IGwgPSBsZWFyblJhdGUgLyBiYXRjaFNpemU7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8bGF5ZXIuc2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaj0wOyBqPGxheWVyLmlucHV0U2l6ZTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBsYXllci53ZWlnaHRzW2ldIVtqXSEgLT0gbGF5ZXIud2VpZ2h0R3JhZHNbaV0hW2pdISAqIGw7XHJcbiAgICAgICAgICAgICAgICBpZihjbGVhckdyYWRpZW50cykgbGF5ZXIud2VpZ2h0R3JhZHNbaV0hW2pdISA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGF5ZXIuYmlhc2VzW2ldISAtPSBsYXllci5iaWFzR3JhZHNbaV0hICogbDtcclxuICAgICAgICAgICAgaWYoY2xlYXJHcmFkaWVudHMpIGxheWVyLmJpYXNHcmFkc1tpXSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQWRhbU9wdGltaXplciBleHRlbmRzIExheWVyT3B0aW1pemVyIHtcclxuICAgIHdlaWdodE06IEZsb2F0MzJBcnJheVtdO1xyXG4gICAgd2VpZ2h0VjogRmxvYXQzMkFycmF5W107XHJcbiAgICBiaWFzTTogRmxvYXQzMkFycmF5O1xyXG4gICAgYmlhc1Y6IEZsb2F0MzJBcnJheTtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHB1YmxpYyBsYXllcjogRGVuc2VMYXllcixcclxuICAgICAgICBwdWJsaWMgYmV0YTEgPSAwLjksXHJcbiAgICAgICAgcHVibGljIGJldGEyID0gMC45OTksXHJcbiAgICAgICAgcHVibGljIGVwc2lsb24gPSAxZS04LFxyXG4gICAgICAgIHB1YmxpYyB0ID0gMCxcclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy53ZWlnaHRNID0gW107XHJcbiAgICAgICAgdGhpcy53ZWlnaHRWID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8bGF5ZXIuc2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMud2VpZ2h0TS5wdXNoKG5ldyBGbG9hdDMyQXJyYXkobGF5ZXIuaW5wdXRTaXplKSk7XHJcbiAgICAgICAgICAgIHRoaXMud2VpZ2h0Vi5wdXNoKG5ldyBGbG9hdDMyQXJyYXkobGF5ZXIuaW5wdXRTaXplKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYmlhc00gPSBuZXcgRmxvYXQzMkFycmF5KGxheWVyLnNpemUpO1xyXG4gICAgICAgIHRoaXMuYmlhc1YgPSBuZXcgRmxvYXQzMkFycmF5KGxheWVyLnNpemUpO1xyXG4gICAgfVxyXG4gICAgYXBwbHlHcmFkaWVudHMobGVhcm5SYXRlOiBudW1iZXIsIGJhdGNoU2l6ZTogbnVtYmVyLCBjbGVhckdyYWRpZW50czogYm9vbGVhbikge1xyXG4gICAgICAgIGNvbnN0IGxheWVyID0gdGhpcy5sYXllcjtcclxuICAgICAgICBjb25zdCBsciA9IGxlYXJuUmF0ZSAvIGJhdGNoU2l6ZTtcclxuICAgICAgICB0aGlzLnQrKztcclxuICAgICAgICBjb25zdCBiMSA9IHRoaXMuYmV0YTE7XHJcbiAgICAgICAgY29uc3QgYjIgPSB0aGlzLmJldGEyO1xyXG4gICAgICAgIGNvbnN0IGVwcyA9IHRoaXMuZXBzaWxvbjtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxsYXllci5zaXplOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZ0IgPSBsYXllci5iaWFzR3JhZHNbaV0hO1xyXG4gICAgICAgICAgICB0aGlzLmJpYXNNW2ldID0gYjEgKiB0aGlzLmJpYXNNW2ldISArICgxIC0gYjEpICogZ0I7XHJcbiAgICAgICAgICAgIHRoaXMuYmlhc1ZbaV0gPSBiMiAqIHRoaXMuYmlhc1ZbaV0hICsgKDEgLSBiMikgKiBnQiAqIGdCO1xyXG4gICAgICAgICAgICBjb25zdCBtSGF0QiA9IHRoaXMuYmlhc01baV0hIC8gKDEgLSBNYXRoLnBvdyhiMSwgdGhpcy50KSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHZIYXRCID0gdGhpcy5iaWFzVltpXSEgLyAoMSAtIE1hdGgucG93KGIyLCB0aGlzLnQpKTtcclxuICAgICAgICAgICAgbGF5ZXIuYmlhc2VzW2ldISAtPSBsciAqIG1IYXRCIC8gKE1hdGguc3FydCh2SGF0QikgKyBlcHMpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7IGo8bGF5ZXIuaW5wdXRTaXplOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdXID0gbGF5ZXIud2VpZ2h0R3JhZHNbaV0hW2pdITtcclxuICAgICAgICAgICAgICAgIHRoaXMud2VpZ2h0TVtpXSFbal0gPSBiMSAqIHRoaXMud2VpZ2h0TVtpXSFbal0hICsgKDEgLSBiMSkgKiBnVztcclxuICAgICAgICAgICAgICAgIHRoaXMud2VpZ2h0VltpXSFbal0gPSBiMiAqIHRoaXMud2VpZ2h0VltpXSFbal0hICsgKDEgLSBiMikgKiBnVyAqIGdXO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbUhhdCA9IHRoaXMud2VpZ2h0TVtpXSFbal0hIC8gKDEgLSBNYXRoLnBvdyhiMSwgdGhpcy50KSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2SGF0ID0gdGhpcy53ZWlnaHRWW2ldIVtqXSEgLyAoMSAtIE1hdGgucG93KGIyLCB0aGlzLnQpKTtcclxuICAgICAgICAgICAgICAgIGxheWVyLndlaWdodHNbaV0hW2pdISAtPSBsciAqIG1IYXQgLyAoTWF0aC5zcXJ0KHZIYXQpICsgZXBzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIERlbnNlTGF5ZXIge1xyXG4gICAgdmFsdWVzX2E6IEZsb2F0MzJBcnJheTtcclxuICAgIHZhbHVlc196OiBGbG9hdDMyQXJyYXk7XHJcbiAgICBkZXJyX2R6OiBGbG9hdDMyQXJyYXk7XHJcbiAgICB3ZWlnaHRzOiBGbG9hdDMyQXJyYXlbXTtcclxuICAgIHdlaWdodEdyYWRzOiBGbG9hdDMyQXJyYXlbXTtcclxuICAgIGJpYXNlczogRmxvYXQzMkFycmF5O1xyXG4gICAgYmlhc0dyYWRzOiBGbG9hdDMyQXJyYXk7XHJcbiAgICBvcHRpbWl6ZXI6IExheWVyT3B0aW1pemVyO1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHVibGljIGlucHV0U2l6ZTogbnVtYmVyLFxyXG4gICAgICAgIHB1YmxpYyBzaXplOiBudW1iZXIsXHJcbiAgICAgICAgcHVibGljIGFjdGl2YXRpb25Pck92ZXJyaWRlOiBMYXllckFjdGl2YXRpb24gfCBcInNvZnRtYXhfY3Jvc3NfZW50cm9weVwiLFxyXG4gICAgICAgIG9wdGltaXplcj86IExheWVyT3B0aW1pemVyLFxyXG4gICAgICAgIHdlaWdodEluaXQ/OiBXZWlnaHRSYW5kb21pemVyXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLnZhbHVlc19hID0gbmV3IEZsb2F0MzJBcnJheShzaXplKTtcclxuICAgICAgICB0aGlzLnZhbHVlc196ID0gbmV3IEZsb2F0MzJBcnJheShzaXplKTtcclxuICAgICAgICB0aGlzLmRlcnJfZHogPSBuZXcgRmxvYXQzMkFycmF5KHNpemUpO1xyXG4gICAgICAgIHRoaXMud2VpZ2h0cyA9IFtdO1xyXG4gICAgICAgIHRoaXMud2VpZ2h0R3JhZHMgPSBbXTtcclxuICAgICAgICB0aGlzLmJpYXNlcyA9IG5ldyBGbG9hdDMyQXJyYXkoc2l6ZSk7XHJcbiAgICAgICAgdGhpcy5iaWFzR3JhZHMgPSBuZXcgRmxvYXQzMkFycmF5KHNpemUpO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHNpemU7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLndlaWdodHMucHVzaChuZXcgRmxvYXQzMkFycmF5KGlucHV0U2l6ZSkpO1xyXG4gICAgICAgICAgICB0aGlzLndlaWdodEdyYWRzLnB1c2gobmV3IEZsb2F0MzJBcnJheShpbnB1dFNpemUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yYW5kb21pemVXZWlnaHRzKHdlaWdodEluaXQgPz8gKChhY3RpdmF0aW9uT3JPdmVycmlkZSAhPSBcInNvZnRtYXhfY3Jvc3NfZW50cm9weVwiICYmIGFjdGl2YXRpb25Pck92ZXJyaWRlLm5hbWUudG9Mb3dlckNhc2UoKSA9PSBcInJlbHVcIikgPyBIZU5vcm1hbCA6IFhhdmllclVuaWZvcm0pKTtcclxuICAgICAgICB0aGlzLm9wdGltaXplciA9IG9wdGltaXplciA/PyBuZXcgQWRhbU9wdGltaXplcih0aGlzKTtcclxuICAgIH1cclxuICAgIHJhbmRvbWl6ZVdlaWdodHMobWV0aG9kOiBXZWlnaHRSYW5kb21pemVyID0gWGF2aWVyVW5pZm9ybSkge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMuc2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaj0wOyBqPHRoaXMuaW5wdXRTaXplOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2VpZ2h0c1tpXSFbal0gPSBtZXRob2QuZ2V0KHRoaXMuaW5wdXRTaXplLCB0aGlzLnNpemUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yd2FyZChpbnB1dDogRGVuc2VMYXllciB8IEZsb2F0MzJBcnJheSB8IG51bWJlcltdKSB7XHJcbiAgICAgICAgaWYoaW5wdXQgaW5zdGFuY2VvZiBEZW5zZUxheWVyKVxyXG4gICAgICAgICAgICBpbnB1dCA9IGlucHV0LnZhbHVlc19hO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMuc2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCB6ID0gdGhpcy5iaWFzZXNbaV0hO1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDsgajx0aGlzLmlucHV0U2l6ZTsgaisrKVxyXG4gICAgICAgICAgICAgICAgeiArPSBpbnB1dFtqXSEgKiB0aGlzLndlaWdodHNbaV0hW2pdITtcclxuICAgICAgICAgICAgaWYodGhpcy5hY3RpdmF0aW9uT3JPdmVycmlkZSAhPSBcInNvZnRtYXhfY3Jvc3NfZW50cm9weVwiKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYSA9IHRoaXMuYWN0aXZhdGlvbk9yT3ZlcnJpZGUuYWN0aXZhdGUoeik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc19hW2ldID0gYTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnZhbHVlc196W2ldID0gejtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5hY3RpdmF0aW9uT3JPdmVycmlkZSA9PSBcInNvZnRtYXhfY3Jvc3NfZW50cm9weVwiKSB7XHJcbiAgICAgICAgICAgIHNvZnRtYXhMYXllcih0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjbGVhckdyYWRpZW50cygpIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnNpemU7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmJpYXNHcmFkcyFbaV0gPSAwO1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDsgajx0aGlzLmlucHV0U2l6ZTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlaWdodEdyYWRzIVtpXSFbal0gPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYmFja3dhcmRUYXJnZXQoaW5wdXQ6IERlbnNlTGF5ZXIgfCBGbG9hdDMyQXJyYXkgfCBudW1iZXJbXSwgb3V0cHV0OiBGbG9hdDMyQXJyYXkgfCBudW1iZXJbXSwgZXJyb3I6IExheWVyRXJyb3IgPSBNc2VFcnJvciwgYWNjdW11bGF0ZSA9IHRydWUpIHtcclxuICAgICAgICBpZihpbnB1dCBpbnN0YW5jZW9mIERlbnNlTGF5ZXIpXHJcbiAgICAgICAgICAgIGlucHV0ID0gaW5wdXQudmFsdWVzX2E7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5zaXplOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGRlcnJfZHo7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYWN0aXZhdGlvbk9yT3ZlcnJpZGUgPT0gXCJzb2Z0bWF4X2Nyb3NzX2VudHJvcHlcIikge1xyXG4gICAgICAgICAgICAgICAgZGVycl9keiA9IHRoaXMudmFsdWVzX2FbaV0hIC0gb3V0cHV0W2ldITtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVycl9keltpXSA9IGRlcnJfZHo7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZXJyX2RhID0gZXJyb3IuZGVycl9kYSh0aGlzLCBvdXRwdXQsIGkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGFfZHogPSB0aGlzLmFjdGl2YXRpb25Pck92ZXJyaWRlLmRhX2R6KHRoaXMudmFsdWVzX3pbaV0hLCB0aGlzLnZhbHVlc19hW2ldISk7XHJcbiAgICAgICAgICAgICAgICBkZXJyX2R6ID0gZGVycl9kYSAqIGRhX2R6O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXJyX2R6W2ldID0gZGVycl9kejtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDsgajx0aGlzLmlucHV0U2l6ZTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkel9kd2lqID0gaW5wdXRbal0hO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGVycl9kd2lqID0gZGVycl9keiAqIGR6X2R3aWo7XHJcbiAgICAgICAgICAgICAgICBpZihhY2N1bXVsYXRlKSB0aGlzLndlaWdodEdyYWRzW2ldIVtqXSEgKz0gZGVycl9kd2lqO1xyXG4gICAgICAgICAgICAgICAgZWxzZSB0aGlzLndlaWdodEdyYWRzW2ldIVtqXSEgPSBkZXJyX2R3aWo7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoYWNjdW11bGF0ZSkgdGhpcy5iaWFzR3JhZHNbaV0hICs9IGRlcnJfZHo7XHJcbiAgICAgICAgICAgIGVsc2UgdGhpcy5iaWFzR3JhZHNbaV0hID0gZGVycl9kejtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBiYWNrd2FyZExheWVyKGlucHV0OiBEZW5zZUxheWVyIHwgRmxvYXQzMkFycmF5IHwgbnVtYmVyW10sIG91dHB1dDogRGVuc2VMYXllciwgYWNjdW11bGF0ZSA9IHRydWUpIHtcclxuICAgICAgICBpZihpbnB1dCBpbnN0YW5jZW9mIERlbnNlTGF5ZXIpXHJcbiAgICAgICAgICAgIGlucHV0ID0gaW5wdXQudmFsdWVzX2E7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5zaXplOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGRlcnJfZGFpID0gMDtcclxuICAgICAgICAgICAgaWYodGhpcy5hY3RpdmF0aW9uT3JPdmVycmlkZSA9PSBcInNvZnRtYXhfY3Jvc3NfZW50cm9weVwiKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHVzZSBzb2Z0bWF4L2Nyb3NzLWVudHJvcHkgb24gYSBoaWRkZW4gbGF5ZXJcIik7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhaV9kemkgPSB0aGlzLmFjdGl2YXRpb25Pck92ZXJyaWRlLmRhX2R6KHRoaXMudmFsdWVzX3pbaV0hLCB0aGlzLnZhbHVlc19hW2ldISk7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaj0wOyBqPG91dHB1dC5zaXplOyBqKyspXHJcbiAgICAgICAgICAgICAgICBkZXJyX2RhaSArPSBvdXRwdXQuZGVycl9keltqXSEgKiBvdXRwdXQud2VpZ2h0c1tqXSFbaV0hO1xyXG4gICAgICAgICAgICBjb25zdCBkZXJyX2R6ID0gZGVycl9kYWkgKiBkYWlfZHppXHJcbiAgICAgICAgICAgIHRoaXMuZGVycl9keltpXSA9IGRlcnJfZHo7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaj0wOyBqPHRoaXMuaW5wdXRTaXplOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGR6X2R3aWogPSBpbnB1dFtqXSE7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZXJyX2R3aWogPSBkZXJyX2R6ICogZHpfZHdpajtcclxuICAgICAgICAgICAgICAgIGlmKGFjY3VtdWxhdGUpIHRoaXMud2VpZ2h0R3JhZHNbaV0hW2pdISArPSBkZXJyX2R3aWo7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMud2VpZ2h0R3JhZHNbaV0hW2pdISA9IGRlcnJfZHdpajtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihhY2N1bXVsYXRlKSB0aGlzLmJpYXNHcmFkc1tpXSEgKz0gZGVycl9kejtcclxuICAgICAgICAgICAgZWxzZSB0aGlzLmJpYXNHcmFkc1tpXSEgPSBkZXJyX2R6O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFwcGx5R3JhZGllbnRzKGxlYXJuUmF0ZTogbnVtYmVyLCBiYXRjaFNpemU6IG51bWJlciwgY2xlYXJHcmFkaWVudHMgPSB0cnVlKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpbWl6ZXIuYXBwbHlHcmFkaWVudHMobGVhcm5SYXRlLCBiYXRjaFNpemUsIGNsZWFyR3JhZGllbnRzKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIERlbnNlTmV0d29yayB7XHJcbiAgICBwdWJsaWMgbGF5ZXJzOiBEZW5zZUxheWVyW10gPSBbXTtcclxuICAgIGlucHV0OiBGbG9hdDMyQXJyYXk7XHJcbiAgICBiYXRjaGVzID0gMDtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpbnB1dFNpemU6IG51bWJlciwgbGF5ZXJzOiBbc2l6ZTogbnVtYmVyLCBhY3RpdmF0aW9uOiBMYXllckFjdGl2YXRpb24sIG9wdGltaXplcj86IExheWVyT3B0aW1pemVyLCB3ZWlnaHRJbml0PzogV2VpZ2h0UmFuZG9taXplcl1bXSkge1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBuZXcgRmxvYXQzMkFycmF5KGlucHV0U2l6ZSk7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8bGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBsYXllciA9IG5ldyBEZW5zZUxheWVyKGk9PTAgPyBpbnB1dFNpemUgOiBsYXllcnNbaS0xXSFbMF0sIGxheWVyc1tpXSFbMF0sIGxheWVyc1tpXSFbMV0sIGxheWVyc1tpXSFbMl0sIGxheWVyc1tpXSFbM10pO1xyXG4gICAgICAgICAgICB0aGlzLmxheWVycy5wdXNoKGxheWVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3J3YXJkKHZhbHVlcz86IEZsb2F0MzJBcnJheSB8IG51bWJlcltdKSB7XHJcbiAgICAgICAgbGV0IGlucHV0OiBEZW5zZUxheWVyIHwgRmxvYXQzMkFycmF5ID0gdGhpcy5pbnB1dDtcclxuICAgICAgICBpZih2YWx1ZXMpIHRoaXMuaW5wdXQuc2V0KHZhbHVlcyk7XHJcbiAgICAgICAgZm9yKGNvbnN0IGxheWVyIG9mIHRoaXMubGF5ZXJzKSB7XHJcbiAgICAgICAgICAgIGxheWVyLmZvcndhcmQoaW5wdXQpO1xyXG4gICAgICAgICAgICBpbnB1dCA9IGxheWVyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGJhY2t3YXJkKG91dHB1dDogRmxvYXQzMkFycmF5IHwgbnVtYmVyW10sIGVycm9yOiBMYXllckVycm9yID0gTXNlRXJyb3IpIHtcclxuICAgICAgICBmb3IobGV0IGk9dGhpcy5sYXllcnMubGVuZ3RoLTE7IGk+PTA7IGktLSkge1xyXG4gICAgICAgICAgICBjb25zdCBsYXllciA9IHRoaXMubGF5ZXJzW2ldITtcclxuICAgICAgICAgICAgY29uc3QgcHJldkxheWVyID0gaSA9PSAwID8gdGhpcy5pbnB1dCA6IHRoaXMubGF5ZXJzW2ktMV0hO1xyXG4gICAgICAgICAgICBpZihpID09IHRoaXMubGF5ZXJzLmxlbmd0aC0xKSB7XHJcbiAgICAgICAgICAgICAgICBsYXllci5iYWNrd2FyZFRhcmdldChwcmV2TGF5ZXIsIG91dHB1dCwgZXJyb3IsIHRydWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGF5ZXIuYmFja3dhcmRMYXllcihwcmV2TGF5ZXIsIHRoaXMubGF5ZXJzW2krMV0hLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmJhdGNoZXMrKztcclxuICAgIH1cclxuICAgIGFwcGx5R3JhZGllbnQobGVhcm5SYXRlOiBudW1iZXIpIHtcclxuICAgICAgICBmb3IoY29uc3QgbGF5ZXIgb2YgdGhpcy5sYXllcnMpIHtcclxuICAgICAgICAgICAgbGF5ZXIuYXBwbHlHcmFkaWVudHMobGVhcm5SYXRlLCB0aGlzLmJhdGNoZXMsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmJhdGNoZXMgPSAwO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgVUkgRUxFTUVOVFMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGNsYXNzIEhvcml6b250YWxTbGlkZXIge1xyXG4gICAgY29udGFpbmVyRWw6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgaGFuZGxlRWw6IEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgdmFsdWVFbDogSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBkcmFnQ29ubmVjdGlvbnMgPSBuZXcgQ29ubmVjdGlvbkdyb3VwKCk7XHJcbiAgICBpbnB1dEV2ZW50OiBTaWduYWw8W3ZhbHVlOiBudW1iZXJdPiA9IG5ldyBTaWduYWwoe29uQ29ubmVjdDooY29ubik9Pntjb25uLmZpcmUodGhpcy52YWx1ZSk7fX0pO1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgbWluOiBudW1iZXIsXHJcbiAgICAgICAgbWF4OiBudW1iZXIsXHJcbiAgICAgICAgc3RlcDogbnVtYmVyLFxyXG4gICAgICAgIHZhbHVlOiBudW1iZXIgPSAobWluICsgbWF4KSAvIDIsXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lckVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyRWwpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuc3R5bGUgPSBgd2lkdGg6MTUwcHg7aGVpZ2h0OjE0cHg7cG9zaXRpb246cmVsYXRpdmU7XHJcbiAgICAgICAgYm9yZGVyOjJweCBzb2xpZCB3aGl0ZTtjdXJzb3I6cG9pbnRlcjtib3JkZXItcmFkaXVzOjRweDtcclxuICAgICAgICBvdXRsaW5lOjJweCBzb2xpZCBibGFjaztiYWNrZ3JvdW5kLWNvbG9yOnJnYigyMCwyMCwyMCk7XHJcbiAgICAgICAgbWFyZ2luOjJweDtgO1xyXG4gICAgICAgIHRoaXMudmFsdWVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgICAgdGhpcy52YWx1ZUVsLnN0eWxlID0gYGJvcmRlcjpub25lO3BhZGRpbmc6MHB4O3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7XHJcbiAgICAgICAgcG9zaXRpb246YWJzb2x1dGU7bGVmdDowO3RvcDowO2JhY2tncm91bmQtY29sb3I6cmdiKDE0MiwgMTg3LCAyNTUpO1xyXG4gICAgICAgIGN1cnNvcjpwb2ludGVyO2JvcmRlci1yYWRpdXM6MnB4O2A7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5hcHBlbmRDaGlsZCh0aGlzLnZhbHVlRWwpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlRWwuc3R5bGUgPSBgd2lkdGg6MjBweDtoZWlnaHQ6MjBweDtwb3NpdGlvbjphYnNvbHV0ZTtcclxuICAgICAgICBsZWZ0OjEwMCU7dG9wOjUwJTt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSk7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjpyZ2IoMTQyLCAxODcsIDI1NSk7Ym9yZGVyOjJweCBzb2xpZCB3aGl0ZTtcclxuICAgICAgICBjdXJzb3I6cG9pbnRlcjtib3JkZXItcmFkaXVzOjUwJTtvdXRsaW5lOjJweCBzb2xpZCBibGFjaztgO1xyXG4gICAgICAgIHRoaXMudmFsdWVFbC5hcHBlbmRDaGlsZCh0aGlzLmhhbmRsZUVsKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGUudGFyZ2V0ID09IHRoaXMuaGFuZGxlRWwpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZSA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVjdCA9IHRoaXMuY29udGFpbmVyRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdCA9IChlLmNsaWVudFggLSByZWN0LmxlZnQpIC8gcmVjdC53aWR0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0ICogKHRoaXMubWF4IC0gdGhpcy5taW4pICsgdGhpcy5taW47XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0RXZlbnQuZmlyZSh0aGlzLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB1cGRhdGUoZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhZ0Nvbm5lY3Rpb25zLmFkZChuZXcgSHRtbENvbm5lY3Rpb24od2luZG93LCBcIm1vdXNlbW92ZVwiLCB1cGRhdGUpKTtcclxuICAgICAgICAgICAgdGhpcy5kcmFnQ29ubmVjdGlvbnMuYWRkKG5ldyBIdG1sQ29ubmVjdGlvbih3aW5kb3csIFwibW91c2V1cFwiLCBlID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ0Nvbm5lY3Rpb25zLmRpc2Nvbm5lY3RBbGwoKTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlRWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBlID0+IHtcclxuICAgICAgICAgICAgbGV0IHgwID0gZS5jbGllbnRYO1xyXG4gICAgICAgICAgICBsZXQgdjAgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmRyYWdDb25uZWN0aW9ucy5hZGQobmV3IEh0bWxDb25uZWN0aW9uKHdpbmRvdywgXCJtb3VzZW1vdmVcIiwgZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZHQgPSAoZS5jbGllbnRYIC0geDApIC8gdGhpcy5jb250YWluZXJFbC5vZmZzZXRXaWR0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2MCArIGR0ICogKHRoaXMubWF4IC0gdGhpcy5taW4pICsgdGhpcy5taW47XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0RXZlbnQuZmlyZSh0aGlzLnZhbHVlKTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB0aGlzLmRyYWdDb25uZWN0aW9ucy5hZGQobmV3IEh0bWxDb25uZWN0aW9uKHdpbmRvdywgXCJtb3VzZXVwXCIsIGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnQ29ubmVjdGlvbnMuZGlzY29ubmVjdEFsbCgpO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5taW4gPSBtaW47XHJcbiAgICAgICAgdGhpcy5tYXggPSBtYXg7XHJcbiAgICAgICAgdGhpcy5zdGVwID0gc3RlcDtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgX3ZhbHVlID0gMDtcclxuICAgIF93aWR0aCA9IDA7XHJcbiAgICBfd2lkdGhMZXJwID0gMDtcclxuICAgIF9pc0FuaW1hdGluZyA9IGZhbHNlO1xyXG4gICAgZ2V0IHZhbHVlKCkgeyByZXR1cm4gdGhpcy5fdmFsdWU7IH1cclxuICAgIHNldCB2YWx1ZSh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYodGhpcy5fdmFsdWUgPT09IHZhbHVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlQ2xhbXAoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlU3R5bGUoKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZVZhbHVlQ2xhbXAoKSB7XHJcbiAgICAgICAgdGhpcy5fdmFsdWUgPSBNYXRoLmZsb29yKHRoaXMuX3ZhbHVlL3RoaXMuX3N0ZXApKnRoaXMuX3N0ZXA7XHJcbiAgICAgICAgdGhpcy5fdmFsdWUgPSBFTWF0aC5jbGFtcCh0aGlzLl92YWx1ZSwgdGhpcy5fbWluLCB0aGlzLl9tYXgpO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlVmFsdWVTdHlsZSgpIHtcclxuICAgICAgICBsZXQgdCA9ICh0aGlzLl92YWx1ZSAtIHRoaXMuX21pbikgLyAodGhpcy5fbWF4IC0gdGhpcy5fbWluKTtcclxuICAgICAgICB0ID0gRU1hdGguY2xhbXAodCwgMCwgMSk7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSB0O1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWVBbmltYXRpb24oKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZVZhbHVlQW5pbWF0aW9uKCkge1xyXG4gICAgICAgIGlmKHRoaXMuX2lzQW5pbWF0aW5nKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgbGV0IGZyYW1lVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIGxldCB1cGRhdGUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICAgICAgbGV0IGRlbHRhVGltZSA9IChub3cgLSBmcmFtZVRpbWUpIC8gMTAwMDtcclxuICAgICAgICAgICAgZnJhbWVUaW1lID0gbm93O1xyXG4gICAgICAgICAgICB0aGlzLl93aWR0aExlcnAgKz0gTWF0aC5zaWduKHRoaXMuX3dpZHRoIC0gdGhpcy5fd2lkdGhMZXJwKSAqIGRlbHRhVGltZSAqIDE7XHJcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoTGVycCA9IEVNYXRoLmxlcnAodGhpcy5fd2lkdGhMZXJwLCB0aGlzLl93aWR0aCwgZGVsdGFUaW1lICogMTApO1xyXG4gICAgICAgICAgICBsZXQgZGlzdCA9IE1hdGguYWJzKHRoaXMuX3dpZHRoIC0gdGhpcy5fd2lkdGhMZXJwKTtcclxuICAgICAgICAgICAgaWYoZGlzdCA8IGRlbHRhVGltZSAqIDIgfHwgZGlzdCA+IDEwIHx8IGlzTmFOKHRoaXMuX3dpZHRoTGVycCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3dpZHRoTGVycCA9IHRoaXMuX3dpZHRoO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZUVsLnN0eWxlLndpZHRoID0gYCR7dGhpcy5fd2lkdGhMZXJwICogMTAwfSVgO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faXNBbmltYXRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnZhbHVlRWwuc3R5bGUud2lkdGggPSBgJHt0aGlzLl93aWR0aExlcnAgKiAxMDB9JWA7XHJcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9pc0FuaW1hdGluZyA9IHRydWU7XHJcbiAgICAgICAgdXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX21pbiA9IDA7XHJcbiAgICBnZXQgbWluKCkgeyByZXR1cm4gdGhpcy5fbWluOyB9XHJcbiAgICBzZXQgbWluKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICBpZih0aGlzLl9taW4gPT09IHZhbHVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fbWluID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZUNsYW1wKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZVN0eWxlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX21heCA9IDA7XHJcbiAgICBnZXQgbWF4KCkgeyByZXR1cm4gdGhpcy5fbWF4OyB9XHJcbiAgICBzZXQgbWF4KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICBpZih0aGlzLl9tYXggPT09IHZhbHVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fbWF4ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZUNsYW1wKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZVN0eWxlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3N0ZXAgPSAwO1xyXG4gICAgZ2V0IHN0ZXAoKSB7IHJldHVybiB0aGlzLl9zdGVwOyB9XHJcbiAgICBzZXQgc3RlcCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYodGhpcy5fc3RlcCA9PT0gdmFsdWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl9zdGVwID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZUNsYW1wKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZVN0eWxlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDaGVja2JveCB7XHJcbiAgICBjb250YWluZXJFbDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBzdmdFbDogU1ZHRWxlbWVudDtcclxuICAgIGlucHV0RXZlbnQ6IFNpZ25hbDxbdmFsdWU6IGJvb2xlYW5dPiA9IG5ldyBTaWduYWwoe29uQ29ubmVjdDooY29ubik9Pntjb25uLmZpcmUodGhpcy5pc0NoZWNrZWQpO319KTtcclxuICAgIGNvbnN0cnVjdG9yKHZhbHVlID0gZmFsc2UpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lckVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLnN0eWxlID0gYHdpZHRoOjE2cHg7aGVpZ2h0OjE2cHg7YmFja2dyb3VuZC1jb2xvcjp3aGl0ZTtvdXRsaW5lOjJweCBzb2xpZCBibGFjaztcclxuICAgICAgICBib3JkZXI6MnB4IHNvbGlkIHdoaXRlO2N1cnNvcjpwb2ludGVyO2NvbG9yOndoaXRlO2Rpc3BsYXk6ZmxleDt1c2VyLXNlbGVjdDpub25lO1xyXG4gICAgICAgIGp1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO2JvcmRlci1yYWRpdXM6MnB4O21hcmdpbjoycHg7YDtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyRWwpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pc0NoZWNrZWQgPSAhdGhpcy5pc0NoZWNrZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXRFdmVudC5maXJlKHRoaXMuaXNDaGVja2VkKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmlubmVySFRNTCA9IGBcclxuICAgICAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgLTQgNyA3XCIgc3R5bGU9XCJ3aWR0aDo2MCU7aGVpZ2h0OjYwJTtwb2ludGVyLWV2ZW50czpub25lO1wiPlxyXG4gICAgICAgICAgICAgICAgPHBhdGggZD1cIk0gMCAwIEwgMSAtMSBMIDIgMSBMIDYgLTQgTCA3IC0zIEwgMiAzIFpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPlxyXG4gICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICBgO1xyXG4gICAgICAgIHRoaXMuc3ZnRWwgPSB0aGlzLmNvbnRhaW5lckVsLnF1ZXJ5U2VsZWN0b3IoXCJzdmdcIikhO1xyXG4gICAgICAgIHRoaXMuaXNDaGVja2VkID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBfaXNDaGVja2VkID0gZmFsc2U7XHJcbiAgICBnZXQgaXNDaGVja2VkKCkgeyByZXR1cm4gdGhpcy5faXNDaGVja2VkOyB9XHJcbiAgICBzZXQgaXNDaGVja2VkKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5faXNDaGVja2VkID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDaGVja2VkU3R5bGUoKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZUNoZWNrZWRTdHlsZSgpIHtcclxuICAgICAgICBpZih0aGlzLl9pc0NoZWNrZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdmdFbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgICAgICB0aGlzLnN2Z0VsLmFuaW1hdGUoW1xyXG4gICAgICAgICAgICAgICAge3NjYWxlOlwiMFwifSxcclxuICAgICAgICAgICAgICAgIHtzY2FsZTpcIjFcIn0sXHJcbiAgICAgICAgICAgIF0sIHtkdXJhdGlvbjoxMDB9KTtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXJFbC5hbmltYXRlKFtcclxuICAgICAgICAgICAgICAgIHtiYWNrZ3JvdW5kQ29sb3I6XCJyZ2IoMjAwLCAyMDAsIDIwMClcIn0sXHJcbiAgICAgICAgICAgICAgICB7YmFja2dyb3VuZENvbG9yOlwicmdiKDE0MiwgMTg3LCAyNTUpXCJ9LFxyXG4gICAgICAgICAgICBdLCB7ZHVyYXRpb246MTAwfSk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyRWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2IoMTQyLCAxODcsIDI1NSlcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN2Z0VsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXJFbC5hbmltYXRlKFtcclxuICAgICAgICAgICAgICAgIHtiYWNrZ3JvdW5kQ29sb3I6XCJyZ2IoMTQyLCAxODcsIDI1NSlcIn0sXHJcbiAgICAgICAgICAgICAgICB7YmFja2dyb3VuZENvbG9yOlwicmdiKDIwMCwgMjAwLCAyMDApXCJ9LFxyXG4gICAgICAgICAgICBdLCB7ZHVyYXRpb246MTAwfSk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyRWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2IoMjAwLCAyMDAsIDIwMClcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXX0=