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
    get(i) {
        switch (i) {
            case 0: return this._x;
            case 1: return this._y;
            case 2: return this._z;
        }
        return undefined;
    }
    set(i, v) {
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
    get(i) {
        switch (i) {
            case 0: return this._x;
            case 1: return this._y;
        }
        return undefined;
    }
    set(i, v) {
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
    static getWorley3DValueAt(x, y, z, seed, offsetAmp, search) {
        search = search ?? Math.ceil(offsetAmp) + 1;
        const gx = Math.floor(x);
        const gy = Math.floor(y);
        const gz = Math.floor(z);
        let minDist = Infinity;
        let value = 0;
        for (let ix = gx - search; ix <= gx + search; ix++) {
            for (let iy = gy - search; iy <= gy + search; iy++) {
                for (let iz = gz - search; iz <= gz + search; iz++) {
                    let point = this.getWorley3DPositionAtGrid(ix, iy, iz, seed, offsetAmp);
                    let dist = point.distToC(x, y, z);
                    if (dist < minDist) {
                        minDist = dist;
                        value = this.getWorley3DValueAtGrid(ix, iy, iz, seed);
                    }
                }
            }
        }
        return value;
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
        v.onMutate();
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
        v.onMutate();
    }
    _forward = Vec3.zero();
    _outdatedForward = true;
    get forward() {
        if (this._outdatedForward) {
            this._forward = Vec3.zAxis().negSelf().rotXYZSelf(this._rotation);
            delete this._outdatedForward;
        }
        return this._forward;
    }
    _right = Vec3.zero();
    _outdatedRight = true;
    get right() {
        if (this._outdatedRight) {
            this._right = Vec3.xAxis().rotXYZSelf(this._rotation);
            delete this._outdatedRight;
        }
        return this._right;
    }
    _up = Vec3.zero();
    _outdatedUp = true;
    get up() {
        if (this._outdatedUp) {
            this._up = Vec3.yAxis().rotXYZSelf(this._rotation);
            delete this._outdatedUp;
        }
        return this._up;
    }
    _forwardFlat = Vec3.zero();
    _outdatedForwardFlat = true;
    get forwardFlat() {
        if (this._outdatedForwardFlat) {
            this._forwardFlat = Vec3.zAxis().negSelf().rotYSelf(this._rotation.y);
            delete this._outdatedForwardFlat;
        }
        return this._forwardFlat;
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
    lookAt(p) {
        let f = this.position.look(p);
        this.rotation = new Vec3(f.pitch(), f.yaw(), 0);
    }
}
export class Camera2D {
    constructor(position, size) {
        this.position = position ?? Vec2.zero();
        this.size = size ?? Vec2.one();
    }
    position;
    size;
}
////////////////////
//  MESH CLASSES  //
////////////////////
export class Mesh3D {
    positions = [];
    texcoords = [];
    normals = [];
    constructor() {
    }
    clone() {
        return new Mesh3D().append(this);
    }
    translate(x, y, z) {
        for (let i = 0; i < this.positions.length; i += 3) {
            this.positions[i] += x;
            this.positions[i + 1] += y;
            this.positions[i + 2] += z;
        }
        return this;
    }
    scale(x, y, z) {
        for (let i = 0; i < this.positions.length; i += 3) {
            this.positions[i] *= x;
            this.positions[i + 1] *= y;
            this.positions[i + 2] *= z;
        }
        return this;
    }
    rotate(ax, ay, az) {
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
    rotateAround(x, y, z, ax, ay, az) {
        for (let i = 0; i < this.positions.length; i += 3) {
            let p = new Vec3(this.positions[i] - x, this.positions[i + 1] - y, this.positions[i + 2] - z);
            p.rotXYZSelfC(ax, ay, az);
            this.positions[i] = p.x + x;
            this.positions[i + 1] = p.y + y;
            this.positions[i + 2] = p.z + z;
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
    append(...meshes) {
        for (const mesh of meshes) {
            this.positions.push(...mesh.positions);
            this.texcoords.push(...mesh.texcoords);
            this.normals.push(...mesh.normals);
        }
        return this;
    }
    pushPositions(arr, x, y, z) {
        for (let i = 0; i < this.positions.length; i += 3) {
            arr.push(this.positions[i] + x);
            arr.push(this.positions[i + 1] + y);
            arr.push(this.positions[i + 2] + z);
        }
        return arr;
    }
    setNormals(x, y, z) {
        for (let i = 0; i < this.normals.length; i += 3) {
            this.normals[i] = x;
            this.normals[i + 1] = y;
            this.normals[i + 2] = z;
        }
        return this;
    }
    static trianglesToEdges(positions) {
        let edges = [];
        for (let i = 0; i < positions.length; i += 9) {
            edges.push(positions[i], positions[i + 1], positions[i + 2], positions[i + 3], positions[i + 4], positions[i + 5]);
            edges.push(positions[i + 3], positions[i + 4], positions[i + 5], positions[i + 6], positions[i + 7], positions[i + 8]);
            edges.push(positions[i + 6], positions[i + 7], positions[i + 8], positions[i], positions[i + 1], positions[i + 2]);
        }
        return edges;
    }
    static triangleQuadsToEdges(positions) {
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
///////////////////////
//  PHYSICS CLASSES  //
///////////////////////
export class Physics2D {
    static getPointRectCollision(point, center, rightOffset, upOffset) {
        const right = rightOffset.norm();
        const up = upOffset.norm();
        const sizeX = rightOffset.length();
        const sizeY = upOffset.length();
        let diff = point.sub(center);
        let dx = diff.dot(right);
        let dy = diff.dot(up);
        let isInside = (Math.abs(dx) < sizeX && Math.abs(dy) < sizeY);
        if (isInside) {
            let d1 = Math.abs(point.sub(center.addScaled(up, sizeY)).dot(up));
            let d2 = Math.abs(point.sub(center.addScaled(up, -sizeY)).dot(up));
            let d3 = Math.abs(point.sub(center.addScaled(right, sizeX)).dot(right));
            let d4 = Math.abs(point.sub(center.addScaled(right, -sizeX)).dot(right));
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
                collision: edge,
                distance: -edge.distTo(point),
                normal: normal,
            };
        }
        else {
            dx = EMath.clamp(dx, -sizeX, sizeX);
            dy = EMath.clamp(dy, -sizeY, sizeY);
            let edge = center.addScaled(right, dx).addScaled(up, dy);
            let dist = edge.distTo(point);
            return {
                inside: false,
                collision: edge,
                distance: dist,
                normal: edge.look(point),
            };
        }
    }
    static getIsPointInsideRect(point, center, rightOffset, upOffset) {
        let diff = point.sub(center);
        let dx = diff.dot(rightOffset.norm());
        let dy = diff.dot(upOffset.norm());
        return (Math.abs(dx) < rightOffset.length() && Math.abs(dy) < upOffset.length());
    }
    static getCircleRectCollision(point, radius, center, rightOffset, upOffset) {
        let res = this.getPointRectCollision(point, center, rightOffset, upOffset);
        res.distance -= radius;
        if (res.distance <= 0)
            res.inside = true;
        return res;
    }
    static getCircleCircleCollision(pointA, radiusA, pointB, radiusB) {
        let dist = pointA.distTo(pointB) - radiusA - radiusB;
        let normal = pointA.look(pointB);
        let collision = pointA.addScaled(normal, radiusA);
        return {
            inside: dist <= 0,
            collision,
            distance: dist,
            normal,
        };
    }
    static getCircleLineCollision(point, radius, start, end) {
        let dir = start.look(end);
        let off = point.sub(start);
        let t = off.dot(dir);
        let maxT = end.distTo(start);
        t = EMath.clamp(t, 0, maxT);
        let collision = start.addScaled(dir, t);
        let normal = collision.look(point);
        let dist = collision.distTo(point) - radius;
        return {
            inside: dist <= 0,
            collision,
            distance: dist,
            normal,
        };
    }
    static resolveCircleCircleCollision(a, b, col) {
        if (!col.inside)
            return;
        const velAlongNormal = b.velocity.sub(a.velocity).dot(col.normal);
        const mi = (1 / a.mass + 1 / b.mass);
        if (velAlongNormal < 0) {
            const restitution = Math.min(a.restitution, b.restitution);
            const j = -(1 + restitution) * velAlongNormal / mi;
            a.velocity.addScaledSelf(col.normal, j * -1 / a.mass);
            b.velocity.addScaledSelf(col.normal, j * 1 / b.mass);
        }
        const correction = col.normal.rescale(Math.max(-col.distance - 1e-4, 0) / mi * 0.8);
        a.position.addScaledSelf(correction, -1 / a.mass);
        b.position.addScaledSelf(correction, 1 / b.mass);
    }
    static resolveCircleAnchoredRectCollision(a, b, col) {
        if (!col.inside)
            return;
        const velAlongNormal = a.velocity.sub(b.velocity).dot(col.normal);
        if (velAlongNormal < 0) {
            const restitution = Math.min(a.restitution, b.restitution);
            const j = -(1 + restitution) * velAlongNormal;
            a.velocity.addScaledSelf(col.normal, j);
        }
        a.position = col.collision.addScaled(col.normal, a.radius + 1e-6);
    }
}
export class Physics3D {
    static raycastVoxels(origin, direction, predicate, maxIterations = 1000) {
        const invDirAbs = direction.rdivF(1).map(x => Math.abs(x));
        const sign = direction.map(x => x > 0 ? 1 : 0);
        const step = direction.map(x => x > 0 ? 1 : -1);
        let tMaxX = invDirAbs.x * (sign.x === 0 ? (origin.x - Math.floor(origin.x)) : (Math.floor(origin.x) + 1 - origin.x));
        let tMaxY = invDirAbs.y * (sign.y === 0 ? (origin.y - Math.floor(origin.y)) : (Math.floor(origin.y) + 1 - origin.y));
        let tMaxZ = invDirAbs.z * (sign.z === 0 ? (origin.z - Math.floor(origin.z)) : (Math.floor(origin.z) + 1 - origin.z));
        let pos = new Vec3(origin).mapSelf(x => Math.floor(x));
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
    static raycastBox(origin, direction, bounds) {
        const invDir = direction.rdivF(1);
        const sign = direction.map(x => x > 0 ? 1 : 0);
        const signFlip = direction.map(x => x > 0 ? 0 : 1);
        const stepFlip = direction.map(x => x > 0 ? -1 : 1);
        let tmin = (bounds[signFlip.x].x - origin.x) * invDir.x;
        let tmax = (bounds[sign.x].x - origin.x) * invDir.x;
        let normal = new Vec3(stepFlip.x, 0, 0);
        let tymin = (bounds[signFlip.y].y - origin.y) * invDir.y;
        let tymax = (bounds[sign.y].y - origin.y) * invDir.y;
        if ((tmin > tymax) || (tymin > tmax))
            return null;
        if (tymin > tmin) {
            tmin = tymin;
            normal = new Vec3(0, stepFlip.y, 0);
        }
        if (tymax < tmax)
            tmax = tymax;
        let tzmin = (bounds[signFlip.z].z - origin.z) * invDir.z;
        let tzmax = (bounds[sign.z].z - origin.z) * invDir.z;
        if ((tmin > tzmax) || (tzmin > tmax))
            return null;
        if (tzmin > tmin) {
            tmin = tzmin;
            normal = new Vec3(0, 0, stepFlip.z);
        }
        if (tzmax < tmax)
            tmax = tzmax;
        const distance = tmin < 0 ? 0 : tmin;
        return { normal, distance, intersection: origin.addScaled(direction, distance) };
    }
}
export class PhysicsLab2DPart {
    lab;
    constructor(lab) {
        this.lab = lab;
    }
}
export class PhysicsLab2D {
    objectObserver = new Signal({ onConnect: (conn) => { for (const obj of this.objects)
            conn.fire(obj); } });
    objects = [];
    constructor() {
    }
    createRect(position, size, rotation) {
        let rect = { position, size };
        rect.lastPosition = position.clone();
        rect.setRotation = (angle) => {
            rect.rotation = angle;
            rect.right = Vec2.xAxis().rotate(angle);
            rect.up = Vec2.yAxis().rotate(angle);
            rect.rightOffset = rect.right.mulF(rect.size.x / 2);
            rect.upOffset = rect.up.mulF(rect.size.y / 2);
            rect.rotationMatrix = Mat3.rotate(rect.rotation);
        };
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
        this.objectObserver.fire(rect);
        return rect;
    }
    createBall(position, radius) {
        let ball = { position, radius };
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
        this.objectObserver.fire(ball);
        return ball;
    }
    update(dt) {
        for (let obj of this.objects) {
            obj.collision = null;
            if (!obj.anchored)
                continue;
            obj.velocity = obj.position.sub(obj.lastPosition).mulF(1 / dt);
            obj.lastPosition.setC(obj.position.x, obj.position.y);
        }
        for (let i = 0; i < 3; i++) {
            for (let obj of this.objects) {
                if (obj.anchored)
                    continue;
                if (i == 0) {
                    obj.velocity.y -= obj.gravity * dt;
                    obj.position.addScaledSelf(obj.velocity, dt);
                }
                if (obj.type == "ball") {
                    for (let obj2 of this.objects) {
                        if (!obj2.hasCollision)
                            continue;
                        if (obj2 == obj)
                            continue;
                        if (obj2.type == "ball") {
                            let col = Physics2D.getCircleCircleCollision(obj.position, obj.radius, obj2.position, obj2.radius);
                            Physics2D.resolveCircleCircleCollision(obj, obj2, col);
                            if (col.inside) {
                                obj.collision = col;
                                obj2.collision = col;
                            }
                        }
                        else {
                            let col = Physics2D.getCircleRectCollision(obj.position, obj.radius, obj2.position, obj2.rightOffset, obj2.upOffset);
                            Physics2D.resolveCircleAnchoredRectCollision(obj, obj2, col);
                            if (col.inside) {
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
//////////
//  AI  //
//////////
export class LayerActivation {
}
export class SigmoidActivation extends LayerActivation {
    forward(z) { return 1 / (1 + Math.exp(-z)); }
    derivative(a, z) { return a * (1 - a); }
}
export class ReLuActivation extends LayerActivation {
    forward(z) { return Math.max(z, 0); }
    derivative(a, z) { return z > 0 ? 1 : 0; }
}
export class LinearActivation extends LayerActivation {
    forward(z) { return z; }
    derivative(a, z) { return 1; }
}
export class Layer {
    inputSize;
    size;
    activation;
    values;
    weights;
    biases;
    constructor(inputSize, size, activation) {
        this.inputSize = inputSize;
        this.size = size;
        this.activation = activation;
        this.values = new Float32Array(size);
        this.weights = [];
        for (let i = 0; i < size; i++)
            this.weights.push(new Float32Array(inputSize));
        this.biases = new Float32Array(size);
    }
    forward(input) {
        for (let i = 0; i < this.size; i++) {
            let weightedSum = this.biases[i];
            for (let j = 0; j < this.inputSize; j++) {
                weightedSum += input[j] * this.weights[i][j];
            }
            let value = this.activation.forward(weightedSum);
            this.values[i] = value;
        }
    }
    backward(output) {
    }
}
/////////////////////
//  ICON GENERATOR //
/////////////////////
export class IconPolygon2D {
    positions = [];
    constructor() {
    }
    clone() {
        let poly = new IconPolygon2D();
        poly.positions.push(...this.positions);
        return poly;
    }
    getCenterOfMass() {
        let c = Vec2.zero();
        for (let i = 0; i < this.positions.length; i += 2)
            c.addSelfC(this.positions[i], this.positions[i + 1]);
        if (this.positions.length > 0)
            c.divSelfF(this.positions.length / 2);
        return c;
    }
    rotateSelf(a) {
        for (let i = 0; i < this.positions.length; i += 2) {
            let v = new Vec2(this.positions[i], this.positions[i + 1]).rotateSelf(a);
            this.positions[i] = v.x;
            this.positions[i + 1] = v.y;
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
    drawFill(ctx, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(this.positions[0] * ctx.canvas.width, this.positions[1] * ctx.canvas.height);
        for (let i = 2; i < this.positions.length; i += 2) {
            ctx.lineTo(this.positions[i] * ctx.canvas.width, this.positions[i + 1] * ctx.canvas.height);
        }
        ctx.closePath();
        ctx.fill();
        return this;
    }
    static createPositions(positions) {
        const poly = new IconPolygon2D();
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
}
export class IconGenerationContext2D {
    ctx;
    layers = {};
    selectedLayer;
    constructor(ctx) {
        this.ctx = ctx;
        this.setLayer("0");
    }
    map(callback) {
        const ctx = this.selectedLayer;
        let data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        let newData = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
        const getColor = (x, y) => {
            const i = (y * ctx.canvas.width + x) * 4;
            if (i < 0 || i >= data.data.length)
                return new Color(0, 0, 0, 0);
            return new Color(data.data[i], data.data[i + 1], data.data[i + 2], data.data[i + 3] / 255);
        };
        for (let y = 0; y < ctx.canvas.height; y++) {
            for (let x = 0; x < ctx.canvas.width; x++) {
                const i = (y * ctx.canvas.width + x) * 4;
                let color = callback(x, y, getColor);
                newData.data[i] = Math.floor(color.r);
                newData.data[i + 1] = Math.floor(color.g);
                newData.data[i + 2] = Math.floor(color.b);
                newData.data[i + 3] = Math.floor(color.a * 255);
            }
        }
        ctx.putImageData(newData, 0, 0);
        return this;
    }
    brightnessToOpacity(invert = false) {
        return this.map((x, y, getColor) => {
            let color = getColor(x, y);
            let t = color.a;
            color.a = color.val / 100;
            if (invert)
                color.a = 1 - color.a;
            color.a *= t;
            let v = invert ? 0 : 255;
            color.r = v;
            color.g = v;
            color.b = v;
            return color;
        });
    }
    mirrorX() {
        return this.map((x, y, getColor) => getColor(this.ctx.canvas.width - 1 - x, y));
    }
    mirrorY() {
        return this.map((x, y, getColor) => getColor(x, this.ctx.canvas.height - 1 - y));
    }
    setLayer(name) {
        let layer = this.layers[name];
        if (layer == null) {
            layer = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
            layer.canvas.width = this.ctx.canvas.width;
            layer.canvas.height = this.ctx.canvas.height;
            this.layers[name] = layer;
        }
        this.selectedLayer = layer;
        return this;
    }
    flatten() {
        const ctx = this.ctx;
        let flattenedData = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
        let layerDatas = [];
        for (const name in this.layers) {
            let layer = this.layers[name];
            let data = layer.getImageData(0, 0, layer.canvas.width, layer.canvas.height);
            layerDatas.push(data);
        }
        for (let y = 0; y < ctx.canvas.height; y++) {
            for (let x = 0; x < ctx.canvas.width; x++) {
                const i = (y * ctx.canvas.width + x) * 4;
                for (let data of layerDatas) {
                    let srcA = data.data[i + 3] / 255;
                    let dstA = flattenedData.data[i + 3] / 255;
                    let newA = srcA + dstA * (1 - srcA);
                    if (newA > 0) {
                        flattenedData.data[i] = (data.data[i] * srcA + flattenedData.data[i] * dstA * (1 - srcA)) / newA;
                        flattenedData.data[i + 1] = (data.data[i + 1] * srcA + flattenedData.data[i + 1] * dstA * (1 - srcA)) / newA;
                        flattenedData.data[i + 2] = (data.data[i + 2] * srcA + flattenedData.data[i + 2] * dstA * (1 - srcA)) / newA;
                    }
                    else {
                        flattenedData.data[i] = 0;
                        flattenedData.data[i + 1] = 0;
                        flattenedData.data[i + 2] = 0;
                    }
                    flattenedData.data[i + 3] = newA * 255;
                }
            }
        }
        ctx.putImageData(flattenedData, 0, 0);
        for (const name in this.layers) {
            let layer = this.layers[name];
            layer.canvas.remove();
        }
        this.layers = {};
        this.setLayer("0");
        this.selectedLayer.drawImage(this.ctx.canvas, 0, 0);
        return this;
    }
}
export async function generateIcon2D(width, height, callback) {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    let ctx = new IconGenerationContext2D(canvas.getContext("2d", { willReadFrequently: true }));
    callback(ctx);
    ctx.flatten();
    let url = await new Promise(res => {
        canvas.toBlob(blob => {
            if (!blob)
                return;
            const url = URL.createObjectURL(blob);
            res(url);
        }, "image/png");
    });
    canvas.remove();
    return url;
}
////////////////////////
//  UI DROPDOWN CLASS //
////////////////////////
export class UiContextMenu {
    position;
    containerEl;
    constructor(x, y) {
        this.position = new Vec2(x, y);
        this.containerEl = document.createElement("div");
    }
}
//////////////////////
//  UI BUTTON CLASS //
//////////////////////
export class UiButton {
    containerEl;
    labelEl;
    buttonEl;
    isHovering = false;
    mouseEnterEvent = new Signal();
    mouseLeaveEvent = new Signal();
    prefixIcons = [];
    suffixIcons = [];
    textContentChangedEvent = new Signal({ onConnect: (conn) => { conn.fire(this._textContent); } });
    _textContent = "Button";
    get textContent() { return this._textContent; }
    set textContent(value) {
        this._textContent = value;
        this.textContentChangedEvent.fire(value);
    }
    textSizeChangedEvent = new Signal({ onConnect: (conn) => { conn.fire(this._textSize); } });
    _textSize = 16;
    get textSize() { return this._textSize; }
    set textSize(value) {
        this._textSize = value;
        this.textSizeChangedEvent.fire(value);
    }
    paddingXChangedEvent = new Signal({ onConnect: (conn) => { conn.fire(this._paddingX); } });
    _paddingX = 4;
    get paddingX() { return this._paddingX; }
    set paddingX(value) {
        this._paddingX = value;
    }
    paddingYChangedEvent = new Signal({ onConnect: (conn) => { conn.fire(this._paddingY); } });
    _paddingY = 8;
    get paddingY() { return this._paddingY; }
    set paddingY(value) {
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
    addIcon(url, position = "prefix") {
        let icon = new UiButtonIcon(url);
        if (position == "prefix")
            this.labelEl.before(icon.iconEl);
        else
            this.labelEl.after(icon.iconEl);
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
    iconEl;
    connections = new ConnectionGroup();
    constructor(url) {
        this.iconEl = document.createElement("img");
        this.iconEl.src = url;
    }
    remove() {
        this.connections.disconnectAll();
        this.iconEl.remove();
    }
}
export class UiBtnHoverFxSolidColor {
    button;
    duration = 0.1;
    connections = new ConnectionGroup();
    constructor(button, color, hoverColor) {
        this.button = button;
        this.color = color;
        this.hoverColor = hoverColor;
        this.connections.add(button.mouseEnterEvent.connect(() => {
            button.containerEl.animate([
                { backgroundColor: this.color.toString() },
                { backgroundColor: this.hoverColor.toString() },
            ], { duration: this.duration * 1000, easing: "ease" });
            button.containerEl.style.backgroundColor = this.hoverColor.toString();
        }));
        this.connections.add(button.mouseLeaveEvent.connect(() => {
            button.containerEl.animate([
                { backgroundColor: this.hoverColor.toString() },
                { backgroundColor: this.color.toString() },
            ], { duration: this.duration * 1000, easing: "ease" });
            button.containerEl.style.backgroundColor = this.color.toString();
        }));
        if (button.isHovering) {
            this.button.containerEl.style.backgroundColor = this.hoverColor.toString();
        }
        else {
            this.button.containerEl.style.backgroundColor = this.color.toString();
        }
    }
    _color;
    set color(value) {
        this._color = value;
        if (!this.button.isHovering)
            this.button.containerEl.style.backgroundColor = value.toString();
    }
    get color() { return this._color; }
    _hoverColor;
    set hoverColor(value) {
        this._hoverColor = value;
        if (this.button.isHovering)
            this.button.containerEl.style.backgroundColor = value.toString();
    }
    get hoverColor() { return this._hoverColor; }
    remove() {
        this.connections.disconnectAll();
        this.button.containerEl.style.backgroundColor = this.color.toString();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGliZ2UzX3YyMDI2MDQxNi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpYmdlM192MjAyNjA0MTYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQStCO0FBQy9CLG1DQUFtQztBQUVuQyxxQkFBcUI7QUFDckIsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsRUFBVSxFQUFFLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUU3RSxtQkFBbUI7QUFDbkIsbUJBQW1CO0FBQ25CLG1CQUFtQjtBQUNuQixNQUFNLE9BQWdCLEtBQUs7SUFDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFTLEVBQUMsQ0FBUyxFQUFDLENBQVM7UUFDdEMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQVMsRUFBQyxDQUFTLEVBQUMsQ0FBUztRQUNyQyxPQUFPLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBUyxFQUFDLENBQVM7UUFDM0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLElBQVksSUFBSTtRQUNqRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxD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SyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBQ0QsT0FBTyxDQUFDLEtBQVc7UUFDZixJQUFJLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsSUFBSSxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUNoQyxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUNELFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDcEMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFTO1FBQ1YsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFDRCxRQUFRLENBQUMsQ0FBUztRQUNkLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLEVBQUUsSUFB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O0lBQzNELENBQUM7SUFDRCxRQUFRLENBQUMsQ0FBUztRQUNkLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxJQUFJLENBQUMsS0FBVztRQUNaLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBQ0QsUUFBUSxDQUFDLEtBQVc7UUFDaEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELEtBQUssQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDakMsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFDRCxTQUFTLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQ3JDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FB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LEtBQVcsRUFBRSxDQUFTO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNELFFBQVEsQ0FBQyxLQUFXLEVBQUUsQ0FBUztRQUMzQixJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsS0FBSyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDNUMsT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDRCxTQUFTLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUNoRCxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsTUFBTSxF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SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUNyQixPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUNELFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUN6QixJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFTO1FBQ1YsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDRCxRQUFRLENBQUMsQ0FBUztRQUNkLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsSUFBSSxDQUFDLEtBQVc7UUFDWixPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBQ0QsUUFBUSxDQUFDLEtBQVc7UUFDaEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFD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QUFHLEdBQUcsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsTUFBTSxHQUFHLEdBQUcsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDckUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzNCLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNELE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLEdBQUcsRUFBRTtRQUN2QyxNQUFNLFNBQVMsR0FBVyxFQUFFLENBQUM7UUFDN0IsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLEtBQUssRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLEtBQUssR0FBQyxDQUFD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QUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRixNQUFNLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0YsTUFBTSxJQUFJLEdBQUcsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNGLE1BQU0sSUFBSSxHQUFHLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRixNQUFNLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzVFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzNCLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNELE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLElBQVksRUFBRSxTQUFpQjtRQUNsRixNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEdBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDO1FBQ2xFLE1BQU0sRUFBRSxHQUFHLENB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Q0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEQsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkgsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkgsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxD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LENBQUMsQ0FBQztRQUNuRCxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDekQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNyRCxJQUFJLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxJQUFJLEtBQUssR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzFELElBQUksS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDdEQsSUFBRyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQztRQUNqRCxJQUFHLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQztZQUNkLElBQUksR0FBRyxLQUFLLENBQUM7WUFDYixNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxD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Q0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDckQsS0FBSyxLQUFLO2dCQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDbkQsS0FBSyxPQUFPO2dCQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDdEQsS0FBSyxPQUFPO2dCQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDdEQsS0FBSyxPQUFPO2dCQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDdEQsS0FBSyxNQUFNO2dCQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDckQsS0FBSyxPQUFPO2dCQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDdkQsS0FBSyxPQUFPO2dCQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDdkQsS0FBSyxPQUFPO2dCQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDdkQsS0FBSyxNQUFNO2dCQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDbEUsS0FBSyxNQUFNO2dCQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDbEUsS0FBSyxNQUFNO2dCQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxD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QUFDLEdBQUcsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUM7WUFDekQsSUFBRyxPQUFPLEtBQUssQ0FBQyxFQUFFLENBQUM7Z0JBQ2YsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU87Z0JBQzNHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUTtnQkFDMUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU07Z0JBQzFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxHQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUztnQkFDM0ksR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsV0FBVztnQkFDL0UsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLFlBQVk7Z0JBQzlHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxjQUFjO2dCQUNoSCxHQUFHLENBQUMs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LENBQUM7WUFDL0IsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUIsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUIsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNsRSxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUM7UUFDOUIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELFFBQVEsQ0FBQyxHQUE2QixFQUFFLEtBQWE7UUFDakQsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdEIsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUYsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBRSxDQUFDLEVBQUUsQ0FBQztZQUN6QyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoRyxDQUFDO1FBQ0QsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxNQUFNLENBQUMsZUFBZSxDQUFDLFNBQW1CO1FBQ3RDLE1BQU0sSUFBSSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7UUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUNsRCxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQztRQUNuQixNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQztRQUNuQixNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQztRQUNuQixNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQztRQUNuQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLEVBQUMsRUFBRSxFQUFFLEVBQUUsRUFBQyxFQUFFLEVBQUUsRUFBRSxFQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxNQUFjLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUM7UUFDeEYsR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksU0FBUyxHQUFhLEVBQUUsQ0FBQztRQUM3QixLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsR0FBRyxFQUFFLENBQUMsSUFBRSxJQUFJLEVBQUUsQ0FBQztZQUMxQixTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM3RCxDQUFDO1FBQ0QsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDN0QsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLE1BQWMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQztRQUMzRixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVB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QWEsRUFBRSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMxRSxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAzRC8yRCBKUyBHYW1lIEVuZ2luZSBMaWJyYXJ5XHJcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zbGxlbmRlcmJyaW5lXHJcblxyXG4vLyAgREVMQVkgVVRJTElUWSAgLy9cclxuZXhwb3J0IGNvbnN0IGRlbGF5ID0gKG1zOiBudW1iZXIpID0+IG5ldyBQcm9taXNlKHJlcyA9PiBzZXRUaW1lb3V0KHJlcywgbXMpKTtcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIEVNQVRIIENMQVNTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFTWF0aCB7XHJcbiAgICBzdGF0aWMgY2xhbXAobjogbnVtYmVyLGE6IG51bWJlcixiOiBudW1iZXIpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobixhKSxiKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBsZXJwKGE6IG51bWJlcixiOiBudW1iZXIsdDogbnVtYmVyKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIGErKGItYSkqdDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBwbW9kKHg6IG51bWJlcixhOiBudW1iZXIpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gKCh4JWEpK2EpJWE7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgaXNDbG9zZShhOiBudW1iZXIsIGI6IG51bWJlciwgZTogbnVtYmVyID0gMWUtNikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFicyhhLWIpIDwgZTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBpc1plcm8odjogbnVtYmVyLCBlOiBudW1iZXIgPSAxZS02KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKHYpIDwgZTtcclxuICAgIH1cclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgQVJSQVkgVVRJTFMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFycmF5VXRpbHMge1xyXG4gICAgc3RhdGljIHNodWZmbGVTZWxmPFQ+KGFycmF5OiBUW10pOiBUW10ge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSBhcnJheS5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcclxuICAgICAgICAgICAgW2FycmF5W2ldISwgYXJyYXlbal0hXSA9IFthcnJheVtqXSEsIGFycmF5W2ldIV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIFZFQ1RPUiBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBWZWMzIHtcclxuICAgIF94OiBudW1iZXI7XHJcbiAgICBfeTogbnVtYmVyO1xyXG4gICAgX3o6IG51bWJlcjtcclxuICAgIG9uTXV0YXRlPzogKCkgPT4gdm9pZDtcclxuICAgIGNvbnN0cnVjdG9yKHY6IFZlYzMgfCB7eDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcn0pO1xyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik7XHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIgfCBWZWMzIHwge3g6bnVtYmVyLCB5Om51bWJlciwgejpudW1iZXJ9LCB5PzogbnVtYmVyLCB6PzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYodHlwZW9mIHggPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgdGhpcy5feCA9IHgueDtcclxuICAgICAgICAgICAgdGhpcy5feSA9IHgueTtcclxuICAgICAgICAgICAgdGhpcy5feiA9IHguejtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl94ID0geDtcclxuICAgICAgICAgICAgdGhpcy5feSA9IHkhIGFzIG51bWJlcjtcclxuICAgICAgICAgICAgdGhpcy5feiA9IHohO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtdXRhdGUoKSB7XHJcbiAgICAgICAgaWYodGhpcy5vbk11dGF0ZSlcclxuICAgICAgICAgICAgdGhpcy5vbk11dGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXQgeCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5feCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgeCgpIHsgcmV0dXJuIHRoaXMuX3g7IH1cclxuICAgIHNldCB5KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl95ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgIH1cclxuICAgIGdldCB5KCkgeyByZXR1cm4gdGhpcy5feTsgfVxyXG4gICAgc2V0IHoodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3ogPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IHooKSB7IHJldHVybiB0aGlzLl96OyB9XHJcblxyXG4gICAgLy8gU3RhdGljIENvbnN0cnVjdG9yc1xyXG4gICAgc3RhdGljIGZpbGwobjogbnVtYmVyKTogVmVjMyB7IHJldHVybiBuZXcgVmVjMyhuLCBuLCBuKTsgfVxyXG4gICAgc3RhdGljIHplcm8oKTogVmVjMyB7IHJldHVybiBWZWMzLmZpbGwoMCk7IH1cclxuICAgIHN0YXRpYyBvbmUoKTogVmVjMyB7IHJldHVybiBWZWMzLmZpbGwoMSk7IH1cclxuICAgIHN0YXRpYyB4QXhpcygpOiBWZWMzIHsgcmV0dXJuIG5ldyBWZWMzKDEsIDAsIDApOyB9XHJcbiAgICBzdGF0aWMgeUF4aXMoKTogVmVjMyB7IHJldHVybiBuZXcgVmVjMygwLCAxLCAwKTsgfVxyXG4gICAgc3RhdGljIHpBeGlzKCk6IFZlYzMgeyByZXR1cm4gbmV3IFZlYzMoMCwgMCwgMSk7IH1cclxuICAgIHN0YXRpYyByYW5kb20oKTogVmVjMyB7XHJcbiAgICAgICAgY29uc3QgeiA9IE1hdGgucmFuZG9tKCkgKiAyIC0gMTtcclxuICAgICAgICBjb25zdCBhID0gTWF0aC5yYW5kb20oKSAqIDIgKiBNYXRoLlBJO1xyXG4gICAgICAgIGNvbnN0IGIgPSBNYXRoLnNxcnQoTWF0aC5tYXgoMCwgMSAtIHogKiB6KSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKGIgKiBNYXRoLmNvcyhhKSwgYiAqIE1hdGguc2luKGEpLCB6KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyByYW5kb21Sb3RhdGlvbigpOiBWZWMzIHtcclxuICAgICAgICBjb25zdCB2ID0gVmVjMy5yYW5kb20oKTtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModi5waXRjaCgpLCB2LnlhdygpLCBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1pc2NlbGxhbmVvdXNcclxuICAgIGdldChpOiBudW1iZXIpOiBudW1iZXIgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIHN3aXRjaChpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIHRoaXMuX3g7XHJcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIHRoaXMuX3k7XHJcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIHRoaXMuX3o7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBzZXQoaTogbnVtYmVyLCB2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBzd2l0Y2goaSkge1xyXG4gICAgICAgICAgICBjYXNlIDA6IHRoaXMuX3ggPSB2OyB0aGlzLm11dGF0ZSgpOyByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgMTogdGhpcy5feSA9IHY7IHRoaXMubXV0YXRlKCk7IHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSAyOiB0aGlzLl96ID0gdjsgdGhpcy5tdXRhdGUoKTsgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNldEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSB4O1xyXG4gICAgICAgIHRoaXMuX3kgPSB5O1xyXG4gICAgICAgIHRoaXMuX3ogPSB6O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XHJcbiAgICAgICAgeWllbGQgdGhpcy5feDtcclxuICAgICAgICB5aWVsZCB0aGlzLl95O1xyXG4gICAgICAgIHlpZWxkIHRoaXMuX3o7XHJcbiAgICB9XHJcbiAgICB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBgPCR7dGhpcy5feC50b0ZpeGVkKDIpfSwgJHt0aGlzLl95LnRvRml4ZWQoMil9LCAke3RoaXMuX3oudG9GaXhlZCgyKX0+YDtcclxuICAgIH1cclxuICAgIHRvQXJyYXkoKTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMuX3gsIHRoaXMuX3ksIHRoaXMuX3pdO1xyXG4gICAgfVxyXG4gICAgY2xvbmUoKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgZ2V0UHJpbWFyeUF4aXMoKTogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBheCA9IE1hdGguYWJzKHRoaXMuX3gpO1xyXG4gICAgICAgIGNvbnN0IGF5ID0gTWF0aC5hYnModGhpcy5feSk7XHJcbiAgICAgICAgY29uc3QgYXogPSBNYXRoLmFicyh0aGlzLl96KTtcclxuICAgICAgICBpZihheCA+IGF5KSByZXR1cm4gYXggPiBheiA/IDAgOiAyO1xyXG4gICAgICAgIGVsc2UgcmV0dXJuIGF5ID4gYXogPyAxIDogMjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxjdWxhdGlvbnNcclxuICAgIGxlbmd0aCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy5kb3QodGhpcykpO1xyXG4gICAgfVxyXG4gICAgZG90KG90aGVyOiBWZWMzKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5feCAqIG90aGVyLl94ICsgdGhpcy5feSAqIG90aGVyLl95ICsgdGhpcy5feiAqIG90aGVyLl96O1xyXG4gICAgfVxyXG4gICAgZG90Qyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5feCAqIHggKyB0aGlzLl95ICogeSArIHRoaXMuX3ogKiB6O1xyXG4gICAgfVxyXG4gICAgY3Jvc3Mob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feSAqIG90aGVyLl96IC0gdGhpcy5feiAqIG90aGVyLl95LCAtICh0aGlzLl94ICogb3RoZXIuX3ogLSB0aGlzLl96ICogb3RoZXIuX3gpLCB0aGlzLl94ICogb3RoZXIuX3kgLSB0aGlzLl95ICogb3RoZXIuX3gpO1xyXG4gICAgfVxyXG4gICAgY3Jvc3NDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feSAqIHogLSB0aGlzLl96ICogeSwgLSAodGhpcy5feCAqIHogLSB0aGlzLl96ICogeCksIHRoaXMuX3ggKiB5IC0gdGhpcy5feSAqIHgpO1xyXG4gICAgfVxyXG4gICAgYW5nbGVUbyhvdGhlcjogVmVjMyk6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgYyA9IHRoaXMubGVuZ3RoKCkgKiBvdGhlci5sZW5ndGgoKTtcclxuICAgICAgICBpZihjID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICByZXR1cm4gTWF0aC5hY29zKEVNYXRoLmNsYW1wKHRoaXMuZG90KG90aGVyKSAvIGMsIC0xLCAxKSk7XHJcbiAgICB9XHJcbiAgICBzaWduZWRBbmdsZVRvKG90aGVyOiBWZWMzLCByZWZlcmVuY2U6IFZlYzMgPSBWZWMzLnlBeGlzKCkpOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGFuZ2xlID0gdGhpcy5hbmdsZVRvKG90aGVyKTtcclxuICAgICAgICBjb25zdCBub3JtYWwgPSB0aGlzLmNyb3NzKG90aGVyKS5ub3JtU2VsZigpO1xyXG4gICAgICAgIGlmKG5vcm1hbC5kb3QocmVmZXJlbmNlLm5vcm0oKSkgPiAwKVxyXG4gICAgICAgICAgICByZXR1cm4gLWFuZ2xlO1xyXG4gICAgICAgIHJldHVybiBhbmdsZTtcclxuICAgIH1cclxuICAgIGRpc3RUbyhvdGhlcjogVmVjMyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViKG90aGVyKS5sZW5ndGgoKTtcclxuICAgIH1cclxuICAgIGRpc3RUb0MoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViQyh4LCB5LCB6KS5sZW5ndGgoKTtcclxuICAgIH1cclxuICAgIHN0cmljdEVxdWFscyhvdGhlcjogVmVjMyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl94ID09IG90aGVyLl94ICYmIHRoaXMuX3kgPT0gb3RoZXIuX3kgJiYgdGhpcy5feiA9PSBvdGhlci5fejtcclxuICAgIH1cclxuICAgIGlzQ2xvc2Uob3RoZXI6IFZlYzMsIGUgPSAxZS02KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIEVNYXRoLmlzQ2xvc2UodGhpcy5feCwgb3RoZXIuX3gsIGUpICYmIEVNYXRoLmlzQ2xvc2UodGhpcy5feSwgb3RoZXIuX3ksIGUpICYmIEVNYXRoLmlzQ2xvc2UodGhpcy5feiwgb3RoZXIuX3osIGUpO1xyXG4gICAgfVxyXG4gICAgaXNaZXJvKGUgPSAxZS02KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIEVNYXRoLmlzWmVybyh0aGlzLl94LCBlKSAmJiBFTWF0aC5pc1plcm8odGhpcy5feSwgZSkgJiYgRU1hdGguaXNaZXJvKHRoaXMuX3osIGUpO1xyXG4gICAgfVxyXG4gICAgcGl0Y2goKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hc2luKHRoaXMuX3kpO1xyXG4gICAgfVxyXG4gICAgeWF3KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIoLXRoaXMuX3gsIC10aGlzLl96KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBPcGVyYXRpb25zXHJcbiAgICBhZGQob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feCArIG90aGVyLl94LCB0aGlzLl95ICsgb3RoZXIuX3ksIHRoaXMuX3ogKyBvdGhlci5feik7XHJcbiAgICB9XHJcbiAgICBhZGRTZWxmKG90aGVyOiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCArPSBvdGhlci5feDtcclxuICAgICAgICB0aGlzLl95ICs9IG90aGVyLl95O1xyXG4gICAgICAgIHRoaXMuX3ogKz0gb3RoZXIuX3o7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl94ICsgeCwgdGhpcy5feSArIHksIHRoaXMuX3ogKyB6KTtcclxuICAgIH1cclxuICAgIGFkZFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICs9IHg7XHJcbiAgICAgICAgdGhpcy5feSArPSB5O1xyXG4gICAgICAgIHRoaXMuX3ogKz0gejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkRihuOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feCArIG4sIHRoaXMuX3kgKyBuLCB0aGlzLl96ICsgbik7XHJcbiAgICB9XHJcbiAgICBhZGRTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICs9IG47XHJcbiAgICAgICAgdGhpcy5feSArPSBuO1xyXG4gICAgICAgIHRoaXMuX3ogKz0gbjtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkKG90aGVyOiBWZWMzLCBzOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmFkZFNjYWxlZFNlbGYob3RoZXIsIHMpO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkU2VsZihvdGhlcjogVmVjMywgczogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCArPSBvdGhlci5feCAqIHM7XHJcbiAgICAgICAgdGhpcy5feSArPSBvdGhlci5feSAqIHM7XHJcbiAgICAgICAgdGhpcy5feiArPSBvdGhlci5feiAqIHM7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgczogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5hZGRTY2FsZWRTZWxmQyh4LCB5LCB6LCBzKTtcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHM6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0geCAqIHM7XHJcbiAgICAgICAgdGhpcy5feSArPSB5ICogcztcclxuICAgICAgICB0aGlzLl96ICs9IHogKiBzO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWIob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feCAtIG90aGVyLl94LCB0aGlzLl95IC0gb3RoZXIuX3ksIHRoaXMuX3ogLSBvdGhlci5feik7XHJcbiAgICB9XHJcbiAgICBzdWJTZWxmKG90aGVyOiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAtPSBvdGhlci5feDtcclxuICAgICAgICB0aGlzLl95IC09IG90aGVyLl95O1xyXG4gICAgICAgIHRoaXMuX3ogLT0gb3RoZXIuX3o7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN1YkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl94IC0geCwgdGhpcy5feSAtIHksIHRoaXMuX3ogLSB6KTtcclxuICAgIH1cclxuICAgIHN1YlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94IC09IHg7XHJcbiAgICAgICAgdGhpcy5feSAtPSB5O1xyXG4gICAgICAgIHRoaXMuX3ogLT0gejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3ViRihuOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feCAtIG4sIHRoaXMuX3kgLSBuLCB0aGlzLl96IC0gbik7XHJcbiAgICB9XHJcbiAgICBzdWJTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94IC09IG47XHJcbiAgICAgICAgdGhpcy5feSAtPSBuO1xyXG4gICAgICAgIHRoaXMuX3ogLT0gbjtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcnN1YihvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhvdGhlci5feCAtIHRoaXMuX3gsIG90aGVyLl95IC0gdGhpcy5feSwgb3RoZXIuX3ogLSB0aGlzLl96KTtcclxuICAgIH1cclxuICAgIHJzdWJTZWxmKG90aGVyOiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IG90aGVyLl94IC0gdGhpcy5feDtcclxuICAgICAgICB0aGlzLl95ID0gb3RoZXIuX3kgLSB0aGlzLl95O1xyXG4gICAgICAgIHRoaXMuX3ogPSBvdGhlci5feiAtIHRoaXMuX3o7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJzdWJDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoeCAtIHRoaXMuX3gsIHkgLSB0aGlzLl95LCB6IC0gdGhpcy5feik7XHJcbiAgICB9XHJcbiAgICByc3ViU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSB4IC0gdGhpcy5feDtcclxuICAgICAgICB0aGlzLl95ID0geSAtIHRoaXMuX3k7XHJcbiAgICAgICAgdGhpcy5feiA9IHogLSB0aGlzLl96O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByc3ViRihuOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMobiAtIHRoaXMuX3gsIG4gLSB0aGlzLl95LCBuIC0gdGhpcy5feik7XHJcbiAgICB9XHJcbiAgICByc3ViU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IG4gLSB0aGlzLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSBuIC0gdGhpcy5feTtcclxuICAgICAgICB0aGlzLl96ID0gbiAtIHRoaXMuX3o7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG11bChvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl94ICogb3RoZXIuX3gsIHRoaXMuX3kgKiBvdGhlci5feSwgdGhpcy5feiAqIG90aGVyLl96KTtcclxuICAgIH1cclxuICAgIG11bFNlbGYob3RoZXI6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICo9IG90aGVyLl94O1xyXG4gICAgICAgIHRoaXMuX3kgKj0gb3RoZXIuX3k7XHJcbiAgICAgICAgdGhpcy5feiAqPSBvdGhlci5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbXVsQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggKiB4LCB0aGlzLl95ICogeSwgdGhpcy5feiAqIHopO1xyXG4gICAgfVxyXG4gICAgbXVsU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKj0geDtcclxuICAgICAgICB0aGlzLl95ICo9IHk7XHJcbiAgICAgICAgdGhpcy5feiAqPSB6O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBtdWxGKG46IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl94ICogbiwgdGhpcy5feSAqIG4sIHRoaXMuX3ogKiBuKTtcclxuICAgIH1cclxuICAgIG11bFNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKj0gbjtcclxuICAgICAgICB0aGlzLl95ICo9IG47XHJcbiAgICAgICAgdGhpcy5feiAqPSBuO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBkaXYob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feCAvIG90aGVyLl94LCB0aGlzLl95IC8gb3RoZXIuX3ksIHRoaXMuX3ogLyBvdGhlci5feik7XHJcbiAgICB9XHJcbiAgICBkaXZTZWxmKG90aGVyOiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAvPSBvdGhlci5feDtcclxuICAgICAgICB0aGlzLl95IC89IG90aGVyLl95O1xyXG4gICAgICAgIHRoaXMuX3ogLz0gb3RoZXIuX3o7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGRpdkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl94IC8geCwgdGhpcy5feSAvIHksIHRoaXMuX3ogLyB6KTtcclxuICAgIH1cclxuICAgIGRpdlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94IC89IHg7XHJcbiAgICAgICAgdGhpcy5feSAvPSB5O1xyXG4gICAgICAgIHRoaXMuX3ogLz0gejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZGl2RihuOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feCAvIG4sIHRoaXMuX3kgLyBuLCB0aGlzLl96IC8gbik7XHJcbiAgICB9XHJcbiAgICBkaXZTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94IC89IG47XHJcbiAgICAgICAgdGhpcy5feSAvPSBuO1xyXG4gICAgICAgIHRoaXMuX3ogLz0gbjtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmRpdihvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhvdGhlci5feCAvIHRoaXMuX3gsIG90aGVyLl95IC8gdGhpcy5feSwgb3RoZXIuX3ogLyB0aGlzLl96KTtcclxuICAgIH1cclxuICAgIHJkaXZTZWxmKG90aGVyOiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IG90aGVyLl94IC8gdGhpcy5feDtcclxuICAgICAgICB0aGlzLl95ID0gb3RoZXIuX3kgLyB0aGlzLl95O1xyXG4gICAgICAgIHRoaXMuX3ogPSBvdGhlci5feiAvIHRoaXMuX3o7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJkaXZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoeCAvIHRoaXMuX3gsIHkgLyB0aGlzLl95LCB6IC8gdGhpcy5feik7XHJcbiAgICB9XHJcbiAgICByZGl2U2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSB4IC8gdGhpcy5feDtcclxuICAgICAgICB0aGlzLl95ID0geSAvIHRoaXMuX3k7XHJcbiAgICAgICAgdGhpcy5feiA9IHogLyB0aGlzLl96O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByZGl2RihuOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMobiAvIHRoaXMuX3gsIG4gLyB0aGlzLl95LCBuIC8gdGhpcy5feik7XHJcbiAgICB9XHJcbiAgICByZGl2U2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IG4gLyB0aGlzLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSBuIC8gdGhpcy5feTtcclxuICAgICAgICB0aGlzLl96ID0gbiAvIHRoaXMuX3o7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG5lZygpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoLXRoaXMuX3gsIC10aGlzLl95LCAtdGhpcy5feik7XHJcbiAgICB9XHJcbiAgICBuZWdTZWxmKCk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSAtdGhpcy5feDtcclxuICAgICAgICB0aGlzLl95ID0gLXRoaXMuX3k7XHJcbiAgICAgICAgdGhpcy5feiA9IC10aGlzLl96O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBsZXJwKG90aGVyOiBWZWMzLCB0OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxlcnBTZWxmKG90aGVyLCB0KTtcclxuICAgIH1cclxuICAgIGxlcnBTZWxmKG90aGVyOiBWZWMzLCB0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICs9IChvdGhlci5feCAtIHRoaXMuX3gpICogdDtcclxuICAgICAgICB0aGlzLl95ICs9IChvdGhlci5feSAtIHRoaXMuX3kpICogdDtcclxuICAgICAgICB0aGlzLl96ICs9IChvdGhlci5feiAtIHRoaXMuX3opICogdDtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbGVycEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdDogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sZXJwU2VsZkMoeCwgeSwgeiwgdCk7XHJcbiAgICB9XHJcbiAgICBsZXJwU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCArPSAoeCAtIHRoaXMuX3gpICogdDtcclxuICAgICAgICB0aGlzLl95ICs9ICh5IC0gdGhpcy5feSkgKiB0O1xyXG4gICAgICAgIHRoaXMuX3ogKz0gKHogLSB0aGlzLl96KSAqIHQ7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG5vcm0oKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5ub3JtU2VsZigpO1xyXG4gICAgfVxyXG4gICAgbm9ybVNlbGYoKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgbWFnID0gdGhpcy5sZW5ndGgoKTtcclxuICAgICAgICBpZihtYWcgPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdlNlbGZDKG1hZywgbWFnLCBtYWcpO1xyXG4gICAgfVxyXG4gICAgcmVzY2FsZShtYWc6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucmVzY2FsZVNlbGYobWFnKTtcclxuICAgIH1cclxuICAgIHJlc2NhbGVTZWxmKG1hZzogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9ybVNlbGYoKS5tdWxTZWxmQyhtYWcsIG1hZywgbWFnKTtcclxuICAgIH1cclxuICAgIGxvb2sob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxvb2tTZWxmKG90aGVyKTtcclxuICAgIH1cclxuICAgIGxvb2tTZWxmKG90aGVyOiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucnN1YlNlbGYob3RoZXIpLm5vcm1TZWxmKCk7XHJcbiAgICB9XHJcbiAgICBjbGFtcExlbmd0aChhOiBudW1iZXIsIGI6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuY2xhbXBMZW5ndGhTZWxmKGEsIGIpO1xyXG4gICAgfVxyXG4gICAgY2xhbXBMZW5ndGhTZWxmKGE6IG51bWJlciwgYjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzY2FsZVNlbGYoRU1hdGguY2xhbXAodGhpcy5sZW5ndGgoKSwgYSwgYikpO1xyXG4gICAgfVxyXG4gICAgZmxhdCgpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmZsYXRTZWxmKCk7XHJcbiAgICB9XHJcbiAgICBmbGF0U2VsZigpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl95ID0gMDtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZmxhdE5vcm0oKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5mbGF0Tm9ybVNlbGYoKTtcclxuICAgIH1cclxuICAgIGZsYXROb3JtU2VsZigpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mbGF0U2VsZigpLm5vcm1TZWxmKCk7XHJcbiAgICB9XHJcbiAgICBzZXREb3Qob3RoZXI6IFZlYzMsIHRhcmdldDogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5zZXREb3RTZWxmKG90aGVyLCB0YXJnZXQpO1xyXG4gICAgfVxyXG4gICAgc2V0RG90U2VsZihvdGhlcjogVmVjMywgdGFyZ2V0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBkID0gb3RoZXIuZG90KG90aGVyKTtcclxuICAgICAgICBpZihkID09PSAwKSByZXR1cm4gdGhpcztcclxuICAgICAgICByZXR1cm4gdGhpcy5hZGRTY2FsZWRTZWxmKG90aGVyLCAodGFyZ2V0IC0gdGhpcy5kb3Qob3RoZXIpKSAvIGQpO1xyXG4gICAgfVxyXG4gICAgc2V0RG90Qyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuc2V0RG90U2VsZkMoeCwgeSwgeiwgdGFyZ2V0KTtcclxuICAgIH1cclxuICAgIHNldERvdFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHRhcmdldDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgZCA9IHgqeCArIHkqeSArIHoqejtcclxuICAgICAgICBpZihkID09PSAwKSByZXR1cm4gdGhpcztcclxuICAgICAgICByZXR1cm4gdGhpcy5hZGRTY2FsZWRTZWxmQyh4LCB5LCB6LCAodGFyZ2V0IC0gdGhpcy5kb3RDKHgsIHksIHopKSAvIGQpO1xyXG4gICAgfVxyXG4gICAgbWFwKG1ldGhvZDogKHg6IG51bWJlciwgaTogbnVtYmVyKSA9PiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLm1hcFNlbGYobWV0aG9kKTtcclxuICAgIH1cclxuICAgIG1hcFNlbGYobWV0aG9kOiAoeDogbnVtYmVyLCBpOiBudW1iZXIpID0+IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSBtZXRob2QodGhpcy5feCwgMCk7XHJcbiAgICAgICAgdGhpcy5feSA9IG1ldGhvZCh0aGlzLl95LCAxKTtcclxuICAgICAgICB0aGlzLl96ID0gbWV0aG9kKHRoaXMuX3osIDIpO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByb3RYKGE6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90WFNlbGYoYSk7XHJcbiAgICB9XHJcbiAgICByb3RYU2VsZihhOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSksIGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCB5ID0gdGhpcy5feSAqIGMgLSB0aGlzLl96ICogcztcclxuICAgICAgICB0aGlzLl96ID0gdGhpcy5feSAqIHMgKyB0aGlzLl96ICogYztcclxuICAgICAgICB0aGlzLl95ID0geTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm90WShhOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdFlTZWxmKGEpO1xyXG4gICAgfVxyXG4gICAgcm90WVNlbGYoYTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGEpLCBjID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3QgeiA9IHRoaXMuX3ogKiBjIC0gdGhpcy5feCAqIHM7XHJcbiAgICAgICAgdGhpcy5feCA9IHRoaXMuX3ggKiBjICsgdGhpcy5feiAqIHM7XHJcbiAgICAgICAgdGhpcy5feiA9IHo7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdFooYTogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RaU2VsZihhKTtcclxuICAgIH1cclxuICAgIHJvdFpTZWxmKGE6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhKSwgYyA9IE1hdGguY29zKGEpO1xyXG4gICAgICAgIGNvbnN0IHggPSB0aGlzLl94ICogYyAtIHRoaXMuX3kgKiBzO1xyXG4gICAgICAgIHRoaXMuX3kgPSB0aGlzLl94ICogcyArIHRoaXMuX3kgKiBjO1xyXG4gICAgICAgIHRoaXMuX3ggPSB4O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByb3RBeGlzKGF4aXM6IFZlYzMsIGFuZ2xlOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdEF4aXNTZWxmKGF4aXMsIGFuZ2xlKTtcclxuICAgIH1cclxuICAgIHJvdEF4aXNTZWxmKGF4aXM6IFZlYzMsIGFuZ2xlOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBheGlzID0gYXhpcy5ub3JtKCk7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGFuZ2xlKSwgYyA9IE1hdGguY29zKGFuZ2xlKTtcclxuICAgICAgICBjb25zdCBjcm9zcyA9IGF4aXMuY3Jvc3ModGhpcyk7XHJcbiAgICAgICAgY29uc3QgZG90ID0gYXhpcy5kb3QodGhpcyk7XHJcbiAgICAgICAgbGV0IHggPSB0aGlzLl94LCB5ID0gdGhpcy5feSwgeiA9IHRoaXMuX3o7XHJcbiAgICAgICAgdGhpcy5feCA9IHggKiBjICsgY3Jvc3MuX3ggKiBzICsgYXhpcy5feCAqIGRvdCAqICgxIC0gYyk7XHJcbiAgICAgICAgdGhpcy5feSA9IHkgKiBjICsgY3Jvc3MuX3kgKiBzICsgYXhpcy5feSAqIGRvdCAqICgxIC0gYyk7XHJcbiAgICAgICAgdGhpcy5feiA9IHogKiBjICsgY3Jvc3MuX3ogKiBzICsgYXhpcy5feiAqIGRvdCAqICgxIC0gYyk7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdFhZWihyb3Q6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdFhZWlNlbGYocm90KTtcclxuICAgIH1cclxuICAgIHJvdFhZWlNlbGYocm90OiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90WFNlbGYocm90Ll94KS5yb3RZU2VsZihyb3QuX3kpLnJvdFpTZWxmKHJvdC5feik7XHJcbiAgICB9XHJcbiAgICByb3RYWVpDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdFhZWlNlbGZDKHgsIHksIHopO1xyXG4gICAgfVxyXG4gICAgcm90WFlaU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvdFhTZWxmKHgpLnJvdFlTZWxmKHkpLnJvdFpTZWxmKHopO1xyXG4gICAgfVxyXG4gICAgcm90WllYKHJvdDogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90WllYU2VsZihyb3QpO1xyXG4gICAgfVxyXG4gICAgcm90WllYU2VsZihyb3Q6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3RaU2VsZihyb3QuX3opLnJvdFlTZWxmKHJvdC5feSkucm90WFNlbGYocm90Ll94KTtcclxuICAgIH1cclxuICAgIHJvdFpZWEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90WllYU2VsZkMoeCwgeSwgeik7XHJcbiAgICB9XHJcbiAgICByb3RaWVhTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90WlNlbGYoeikucm90WVNlbGYoeSkucm90WFNlbGYoeCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBWZWMyIHtcclxuICAgIGNvbnN0cnVjdG9yKHY6IFZlYzIgfCB7eDogbnVtYmVyLCB5OiBudW1iZXJ9KTtcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKTtcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciB8IHt4Om51bWJlciwgeTpudW1iZXJ9LCB5PzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYodHlwZW9mIHggPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgdGhpcy5feCA9IHgueDtcclxuICAgICAgICAgICAgdGhpcy5feSA9IHgueTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl94ID0geDtcclxuICAgICAgICAgICAgdGhpcy5feSA9IHkgYXMgbnVtYmVyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfeDogbnVtYmVyO1xyXG4gICAgZ2V0IHgoKSB7IHJldHVybiB0aGlzLl94OyB9XHJcbiAgICBzZXQgeCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5feCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICB9XHJcbiAgICBfeTogbnVtYmVyO1xyXG4gICAgZ2V0IHkoKSB7IHJldHVybiB0aGlzLl95OyB9XHJcbiAgICBzZXQgeSh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5feSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICB9XHJcbiAgICBvbk11dGF0ZT86ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgbXV0YXRlKCkge1xyXG4gICAgICAgIGlmKHRoaXMub25NdXRhdGUpXHJcbiAgICAgICAgICAgIHRoaXMub25NdXRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTdGF0aWMgQ29uc3RydWN0b3JzXHJcbiAgICBzdGF0aWMgZmlsbChuOiBudW1iZXIpOiBWZWMyIHsgcmV0dXJuIG5ldyBWZWMyKG4sIG4pOyB9XHJcbiAgICBzdGF0aWMgemVybygpOiBWZWMyIHsgcmV0dXJuIFZlYzIuZmlsbCgwKTsgfVxyXG4gICAgc3RhdGljIG9uZSgpOiBWZWMyIHsgcmV0dXJuIFZlYzIuZmlsbCgxKTsgfVxyXG4gICAgc3RhdGljIHhBeGlzKCk6IFZlYzIgeyByZXR1cm4gbmV3IFZlYzIoMSwgMCk7IH1cclxuICAgIHN0YXRpYyB5QXhpcygpOiBWZWMyIHsgcmV0dXJuIG5ldyBWZWMyKDAsIDEpOyB9XHJcbiAgICBzdGF0aWMgcmFuZG9tKCk6IFZlYzIge1xyXG4gICAgICAgIGNvbnN0IGEgPSBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKE1hdGguY29zKGEpLCBNYXRoLnNpbihhKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTWlzY2VsbGFuZW91c1xyXG4gICAgZ2V0KGk6IG51bWJlcik6IG51bWJlciB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgc3dpdGNoKGkpIHtcclxuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gdGhpcy5feDtcclxuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gdGhpcy5feTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIHNldChpOiBudW1iZXIsIHY6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHN3aXRjaChpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDogdGhpcy5feCA9IHY7IHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSAxOiB0aGlzLl95ID0gdjsgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgc2V0Qyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSB4O1xyXG4gICAgICAgIHRoaXMuX3kgPSB5O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XHJcbiAgICAgICAgeWllbGQgdGhpcy5feDtcclxuICAgICAgICB5aWVsZCB0aGlzLl95O1xyXG4gICAgfVxyXG4gICAgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gYDwke3RoaXMuX3gudG9GaXhlZCgyKX0sICR7dGhpcy5feS50b0ZpeGVkKDIpfT5gO1xyXG4gICAgfVxyXG4gICAgdG9BcnJheSgpOiBbbnVtYmVyLCBudW1iZXJdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMuX3gsIHRoaXMuX3ldO1xyXG4gICAgfVxyXG4gICAgY2xvbmUoKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENhbGN1bGF0aW9uc1xyXG4gICAgbGVuZ3RoKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLmRvdCh0aGlzKSk7XHJcbiAgICB9XHJcbiAgICBkb3Qob3RoZXI6IFZlYzIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl94ICogb3RoZXIuX3ggKyB0aGlzLl95ICogb3RoZXIuX3k7XHJcbiAgICB9XHJcbiAgICBkb3RDKHg6IG51bWJlciwgeTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5feCAqIHggKyB0aGlzLl95ICogeTtcclxuICAgIH1cclxuICAgIGFuZ2xlVG8ob3RoZXI6IFZlYzIpOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGMgPSB0aGlzLmxlbmd0aCgpICogb3RoZXIubGVuZ3RoKCk7XHJcbiAgICAgICAgaWYoYyA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWNvcyhFTWF0aC5jbGFtcCh0aGlzLmRvdChvdGhlcikgLyBjLCAtMSwgMSkpO1xyXG4gICAgfVxyXG4gICAgc2lnbmVkQW5nbGVUbyhvdGhlcjogVmVjMik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodGhpcy5feCAqIG90aGVyLl95IC0gdGhpcy5feSAqIG90aGVyLl94LCB0aGlzLmRvdChvdGhlcikpO1xyXG4gICAgfVxyXG4gICAgZGlzdFRvKG90aGVyOiBWZWMyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdWIob3RoZXIpLmxlbmd0aCgpO1xyXG4gICAgfVxyXG4gICAgZGlzdFRvQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViQyh4LCB5KS5sZW5ndGgoKTtcclxuICAgIH1cclxuICAgIHN0cmljdEVxdWFscyhvdGhlcjogVmVjMik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl94ID09IG90aGVyLl94ICYmIHRoaXMuX3kgPT0gb3RoZXIuX3k7XHJcbiAgICB9XHJcbiAgICBpc0Nsb3NlKG90aGVyOiBWZWMyLCBlID0gMWUtNik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5pc0Nsb3NlKHRoaXMuX3gsIG90aGVyLl94LCBlKSAmJiBFTWF0aC5pc0Nsb3NlKHRoaXMuX3ksIG90aGVyLl95LCBlKTtcclxuICAgIH1cclxuICAgIGlzWmVybyhlID0gMWUtNik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5pc1plcm8odGhpcy5feCwgZSkgJiYgRU1hdGguaXNaZXJvKHRoaXMuX3ksIGUpO1xyXG4gICAgfVxyXG4gICAgdGhldGEoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLl95LCB0aGlzLl94KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBPcGVyYXRpb25zXHJcbiAgICBhZGQob3RoZXI6IFZlYzIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5feCArIG90aGVyLl94LCB0aGlzLl95ICsgb3RoZXIuX3kpO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0gb3RoZXIuX3g7XHJcbiAgICAgICAgdGhpcy5feSArPSBvdGhlci5feTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLl94ICsgeCwgdGhpcy5feSArIHkpO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICs9IHg7XHJcbiAgICAgICAgdGhpcy5feSArPSB5O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRGKG46IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLl94ICsgbiwgdGhpcy5feSArIG4pO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCArPSBuO1xyXG4gICAgICAgIHRoaXMuX3kgKz0gbjtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkKG90aGVyOiBWZWMyLCBzOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmFkZFNjYWxlZFNlbGYob3RoZXIsIHMpO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkU2VsZihvdGhlcjogVmVjMiwgczogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCArPSBvdGhlci5feCAqIHM7XHJcbiAgICAgICAgdGhpcy5feSArPSBvdGhlci5feSAqIHM7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHM6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuYWRkU2NhbGVkU2VsZkMoeCwgeSwgcyk7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWRTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgczogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCArPSB4ICogcztcclxuICAgICAgICB0aGlzLl95ICs9IHkgKiBzO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWIob3RoZXI6IFZlYzIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5feCAtIG90aGVyLl94LCB0aGlzLl95IC0gb3RoZXIuX3kpO1xyXG4gICAgfVxyXG4gICAgc3ViU2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggLT0gb3RoZXIuX3g7XHJcbiAgICAgICAgdGhpcy5feSAtPSBvdGhlci5feTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3ViQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLl94IC0geCwgdGhpcy5feSAtIHkpO1xyXG4gICAgfVxyXG4gICAgc3ViU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94IC09IHg7XHJcbiAgICAgICAgdGhpcy5feSAtPSB5O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWJGKG46IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLl94IC0gbiwgdGhpcy5feSAtIG4pO1xyXG4gICAgfVxyXG4gICAgc3ViU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAtPSBuO1xyXG4gICAgICAgIHRoaXMuX3kgLT0gbjtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcnN1YihvdGhlcjogVmVjMik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMihvdGhlci5feCAtIHRoaXMuX3gsIG90aGVyLl95IC0gdGhpcy5feSk7XHJcbiAgICB9XHJcbiAgICByc3ViU2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSBvdGhlci5feCAtIHRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IG90aGVyLl95IC0gdGhpcy5feTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcnN1YkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoeCAtIHRoaXMuX3gsIHkgLSB0aGlzLl95KTtcclxuICAgIH1cclxuICAgIHJzdWJTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSB4IC0gdGhpcy5feDtcclxuICAgICAgICB0aGlzLl95ID0geSAtIHRoaXMuX3k7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJzdWJGKG46IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMihuIC0gdGhpcy5feCwgbiAtIHRoaXMuX3kpO1xyXG4gICAgfVxyXG4gICAgcnN1YlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSBuIC0gdGhpcy5feDtcclxuICAgICAgICB0aGlzLl95ID0gbiAtIHRoaXMuX3k7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBtdWwob3RoZXI6IFZlYzIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5feCAqIG90aGVyLl94LCB0aGlzLl95ICogb3RoZXIuX3kpO1xyXG4gICAgfVxyXG4gICAgbXVsU2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKj0gb3RoZXIuX3g7XHJcbiAgICAgICAgdGhpcy5feSAqPSBvdGhlci5feTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbXVsQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLl94ICogeCwgdGhpcy5feSAqIHkpO1xyXG4gICAgfVxyXG4gICAgbXVsU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICo9IHg7XHJcbiAgICAgICAgdGhpcy5feSAqPSB5O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBtdWxGKG46IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLl94ICogbiwgdGhpcy5feSAqIG4pO1xyXG4gICAgfVxyXG4gICAgbXVsU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAqPSBuO1xyXG4gICAgICAgIHRoaXMuX3kgKj0gbjtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZGl2KG90aGVyOiBWZWMyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMuX3ggLyBvdGhlci5feCwgdGhpcy5feSAvIG90aGVyLl95KTtcclxuICAgIH1cclxuICAgIGRpdlNlbGYob3RoZXI6IFZlYzIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94IC89IG90aGVyLl94O1xyXG4gICAgICAgIHRoaXMuX3kgLz0gb3RoZXIuX3k7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGRpdkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5feCAvIHgsIHRoaXMuX3kgLyB5KTtcclxuICAgIH1cclxuICAgIGRpdlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAvPSB4O1xyXG4gICAgICAgIHRoaXMuX3kgLz0geTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZGl2RihuOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5feCAvIG4sIHRoaXMuX3kgLyBuKTtcclxuICAgIH1cclxuICAgIGRpdlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggLz0gbjtcclxuICAgICAgICB0aGlzLl95IC89IG47XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJkaXYob3RoZXI6IFZlYzIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIob3RoZXIuX3ggLyB0aGlzLl94LCBvdGhlci5feSAvIHRoaXMuX3kpO1xyXG4gICAgfVxyXG4gICAgcmRpdlNlbGYob3RoZXI6IFZlYzIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gb3RoZXIuX3ggLyB0aGlzLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSBvdGhlci5feSAvIHRoaXMuX3k7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJkaXZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHggLyB0aGlzLl94LCB5IC8gdGhpcy5feSk7XHJcbiAgICB9XHJcbiAgICByZGl2U2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0geCAvIHRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IHkgLyB0aGlzLl95O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByZGl2RihuOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIobiAvIHRoaXMuX3gsIG4gLyB0aGlzLl95KTtcclxuICAgIH1cclxuICAgIHJkaXZTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gbiAvIHRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IG4gLyB0aGlzLl95O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBuZWcoKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKC10aGlzLl94LCAtdGhpcy5feSk7XHJcbiAgICB9XHJcbiAgICBuZWdTZWxmKCk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSAtdGhpcy5feDtcclxuICAgICAgICB0aGlzLl95ID0gLXRoaXMuX3k7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGxlcnAob3RoZXI6IFZlYzIsIHQ6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubGVycFNlbGYob3RoZXIsIHQpO1xyXG4gICAgfVxyXG4gICAgbGVycFNlbGYob3RoZXI6IFZlYzIsIHQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0gKG90aGVyLl94IC0gdGhpcy5feCkgKiB0O1xyXG4gICAgICAgIHRoaXMuX3kgKz0gKG90aGVyLl95IC0gdGhpcy5feSkgKiB0O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBsZXJwQyh4OiBudW1iZXIsIHk6IG51bWJlciwgdDogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sZXJwU2VsZkMoeCwgeSwgdCk7XHJcbiAgICB9XHJcbiAgICBsZXJwU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0gKHggLSB0aGlzLl94KSAqIHQ7XHJcbiAgICAgICAgdGhpcy5feSArPSAoeSAtIHRoaXMuX3kpICogdDtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbm9ybSgpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLm5vcm1TZWxmKCk7XHJcbiAgICB9XHJcbiAgICBub3JtU2VsZigpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBtYWcgPSB0aGlzLmxlbmd0aCgpO1xyXG4gICAgICAgIGlmKG1hZyA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2U2VsZkMobWFnLCBtYWcpO1xyXG4gICAgfVxyXG4gICAgcmVzY2FsZShtYWc6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucmVzY2FsZVNlbGYobWFnKTtcclxuICAgIH1cclxuICAgIHJlc2NhbGVTZWxmKG1hZzogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9ybVNlbGYoKS5tdWxTZWxmQyhtYWcsIG1hZyk7XHJcbiAgICB9XHJcbiAgICBsb29rKG90aGVyOiBWZWMyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sb29rU2VsZihvdGhlcik7XHJcbiAgICB9XHJcbiAgICBsb29rU2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJzdWJTZWxmKG90aGVyKS5ub3JtU2VsZigpO1xyXG4gICAgfVxyXG4gICAgY2xhbXBMZW5ndGgoYTogbnVtYmVyLCBiOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmNsYW1wTGVuZ3RoU2VsZihhLCBiKTtcclxuICAgIH1cclxuICAgIGNsYW1wTGVuZ3RoU2VsZihhOiBudW1iZXIsIGI6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc2NhbGVTZWxmKEVNYXRoLmNsYW1wKHRoaXMubGVuZ3RoKCksIGEsIGIpKTtcclxuICAgIH1cclxuICAgIHNldERvdChvdGhlcjogVmVjMiwgdGFyZ2V0OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnNldERvdFNlbGYob3RoZXIsIHRhcmdldCk7XHJcbiAgICB9XHJcbiAgICBzZXREb3RTZWxmKG90aGVyOiBWZWMyLCB0YXJnZXQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IGQgPSBvdGhlci5kb3Qob3RoZXIpO1xyXG4gICAgICAgIGlmKGQgPT09IDApIHJldHVybiB0aGlzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNjYWxlZFNlbGYob3RoZXIsICh0YXJnZXQgLSB0aGlzLmRvdChvdGhlcikpIC8gZCk7XHJcbiAgICB9XHJcbiAgICBzZXREb3RDKHg6IG51bWJlciwgeTogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuc2V0RG90U2VsZkMoeCwgeSwgdGFyZ2V0KTtcclxuICAgIH1cclxuICAgIHNldERvdFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IGQgPSB4KnggKyB5Knk7XHJcbiAgICAgICAgaWYoZCA9PT0gMCkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkU2NhbGVkU2VsZkMoeCwgeSwgKHRhcmdldCAtIHRoaXMuZG90Qyh4LCB5KSkgLyBkKTtcclxuICAgIH1cclxuICAgIG1hcChtZXRob2Q6ICh4OiBudW1iZXIsIGk6IG51bWJlcikgPT4gbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5tYXBTZWxmKG1ldGhvZCk7XHJcbiAgICB9XHJcbiAgICBtYXBTZWxmKG1ldGhvZDogKHg6IG51bWJlciwgaTogbnVtYmVyKSA9PiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gbWV0aG9kKHRoaXMuX3gsIDApO1xyXG4gICAgICAgIHRoaXMuX3kgPSBtZXRob2QodGhpcy5feSwgMSk7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdGF0ZShhOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdGF0ZVNlbGYoYSk7XHJcbiAgICB9XHJcbiAgICByb3RhdGVTZWxmKGE6IG51bWJlcikgOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSksIGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCB4ID0gdGhpcy54LCB5ID0gdGhpcy55O1xyXG4gICAgICAgIHRoaXMuX3ggPSB4ICogYyAtIHkgKiBzO1xyXG4gICAgICAgIHRoaXMuX3kgPSB4ICogcyArIHkgKiBjO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBNQVRSSVggQ0xBU1NFUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBDb2x1bW4tbWFqb3IgNHg0IG1hdHJpeFxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0NCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgICBcclxuICAgIHN0YXRpYyBuZXcoKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgMSwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMSwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMSwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHRyYW5zbGF0ZSh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgMSwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMSwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMSwgMCxcclxuICAgICAgICAgICAgeCwgeSwgeiwgMSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHNjYWxlKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB4LCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCB5LCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCB6LCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcm90YXRlWChhOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGEpO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIDEsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIGMsIHMsIDAsXHJcbiAgICAgICAgICAgIDAsIC1zLCBjLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyByb3RhdGVZKGE6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSk7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgYywgMCwgLXMsIDAsXHJcbiAgICAgICAgICAgIDAsIDEsIDAsIDAsXHJcbiAgICAgICAgICAgIHMsIDAsIGMsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDAsIDFcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJvdGF0ZVooYTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKGEpO1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhKTtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBjLCBzLCAwLCAwLFxyXG4gICAgICAgICAgICAtcywgYywgMCwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMSwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcGVyc3BlY3RpdmUoZm92WTogbnVtYmVyLCBhc3BlY3Q6IG51bWJlciwgbmVhcjogbnVtYmVyID0gMSwgZmFyOiBudW1iZXIgPSAxMDAwKSB7XHJcbiAgICAgICAgY29uc3QgZiA9IDEgLyBNYXRoLnRhbihmb3ZZIC8gMik7XHJcbiAgICAgICAgY29uc3QgbmYgPSAxIC8gKG5lYXIgLSBmYXIpO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIGYvYXNwZWN0LCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCBmLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAoZmFyICsgbmVhcikgKiBuZiwgLTEsXHJcbiAgICAgICAgICAgIDAsIDAsICgyICogZmFyICogbmVhcikgKiBuZiwgMFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgbXVsdGlwbHkobTE6IG51bWJlcltdLCBtMjogbnVtYmVyW10pIHtcclxuICAgICAgICBjb25zdCBvdXQgPSBNYXQ0Lm5ldygpO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPDQ7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDsgajw0OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIG91dFtpKjQgKyBqXSA9IChcclxuICAgICAgICAgICAgICAgICAgICBtMVswKjQgKyBqXSEgKiBtMltpKjQgKyAwXSFcclxuICAgICAgICAgICAgICAgICAgICArIG0xWzEqNCArIGpdISAqIG0yW2kqNCArIDFdIVxyXG4gICAgICAgICAgICAgICAgICAgICsgbTFbMio0ICsgal0hICogbTJbaSo0ICsgMl0hXHJcbiAgICAgICAgICAgICAgICAgICAgKyBtMVszKjQgKyBqXSEgKiBtMltpKjQgKyAzXSFcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vIENvbHVtbi1tYWpvciAzeDMgbWF0cml4XHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNYXQzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgICBzdGF0aWMgbmV3KCkge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIDEsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDEsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDEsXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyB0cmFuc2xhdGUoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAxLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAxLCAwLFxyXG4gICAgICAgICAgICB4LCB5LCAxLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgc2NhbGUoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB4LCAwLCAwLFxyXG4gICAgICAgICAgICAwLCB5LCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAxLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcm90YXRlKGE6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSk7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgYywgcywgMCxcclxuICAgICAgICAgICAgLXMsIGMsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDEsXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBtdWx0aXBseShtMTogbnVtYmVyW10sIG0yOiBudW1iZXJbXSkge1xyXG4gICAgICAgIGNvbnN0IG91dCA9IE1hdDMubmV3KCk7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8MzsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaj0wOyBqPDM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgb3V0W2kqMyArIGpdID0gKFxyXG4gICAgICAgICAgICAgICAgICAgIG0xWzAqMyArIGpdISAqIG0yW2kqMyArIDBdIVxyXG4gICAgICAgICAgICAgICAgICAgICsgbTFbMSozICsgal0hICogbTJbaSozICsgMV0hXHJcbiAgICAgICAgICAgICAgICAgICAgKyBtMVsyKjMgKyBqXSEgKiBtMltpKjMgKyAyXSFcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIE5PSVNFIENMQVNTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOb2lzZSB7XHJcbiAgICBzdGF0aWMgcmFuZG9tQ29uc3RhbnQzKGE6IG51bWJlciwgYjogbnVtYmVyLCBjOiBudW1iZXIpIDogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBpdCA9IChhICogMjM5NDgyMzU0OSkgXiAoYiAqIDQzODU5NzQyODUwKSBeIChjICogMjMwOTQ1NjUyMzQpO1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5wbW9kKGl0LCAxMDAwMCkgLyAxMDAwMDtcclxuICAgIH1cclxuICAgIHN0YXRpYyByYW5kb21Db25zdGFudDQoYTogbnVtYmVyLCBiOiBudW1iZXIsIGM6IG51bWJlciwgZDogbnVtYmVyKSA6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgaXQgPSAoYSAqIDIzOTQ4MjM1NDkpIF4gKGIgKiA0Mzg1OTc0Mjg1MCkgXiAoYyAqIDIzMDk0NTY1MjM0KSBeIChkICogODQyNzgyNDU2Nik7XHJcbiAgICAgICAgcmV0dXJuIEVNYXRoLnBtb2QoaXQsIDEwMDAwKSAvIDEwMDAwO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGZhZGUodDogbnVtYmVyKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHQgKiB0ICogdCAqICh0ICogKHQgKiA2IC0gMTUpICsgMTApO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdlbmVyYXRlUGVybGluMkRHcmFkaWVudHMoY291bnQgPSAxMikge1xyXG4gICAgICAgIGNvbnN0IGdyYWRpZW50czogVmVjMltdID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8Y291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBhbmdsZSA9IDIgKiBNYXRoLlBJICogaS9jb3VudDtcclxuICAgICAgICAgICAgZ3JhZGllbnRzLnB1c2gobmV3IFZlYzIoTWF0aC5jb3MoYW5nbGUpLCBNYXRoLnNpbihhbmdsZSkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGdyYWRpZW50cztcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRQZXJsaW4yRFZlY3RvckF0KHg6IG51bWJlciwgeTogbnVtYmVyLCBzZWVkOiBudW1iZXIsIGdyYWRpZW50czogVmVjMltdKSA6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBncmFkaWVudHNbTWF0aC5mbG9vcih0aGlzLnJhbmRvbUNvbnN0YW50MyhzZWVkLCB4LCB5KSAqIGdyYWRpZW50cy5sZW5ndGgpXSE7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0UGVybGluMkRWYWx1ZUF0KHg6IG51bWJlciwgeTogbnVtYmVyLCBzZWVkOiBudW1iZXIsIGdyYWRpZW50czogVmVjMltdKSA6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgZ2V0UGVybGluMkRWZWN0b3JBdCA9IHRoaXMuZ2V0UGVybGluMkRWZWN0b3JBdC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIGNvbnN0IGxlcnAgPSBFTWF0aC5sZXJwO1xyXG4gICAgICAgIGNvbnN0IGZhZGUgPSB0aGlzLmZhZGU7XHJcbiAgICAgICAgY29uc3QgZzAgPSBuZXcgVmVjMih4LCB5KS5tYXBTZWxmKE1hdGguZmxvb3IpO1xyXG4gICAgICAgIGNvbnN0IGcxID0gbmV3IFZlYzIoZzApLmFkZFNlbGZDKDEsIDEpO1xyXG4gICAgICAgIGNvbnN0IGYwID0gbmV3IFZlYzIoeCwgeSkuc3ViU2VsZihnMCk7XHJcbiAgICAgICAgY29uc3QgZjEgPSBuZXcgVmVjMih4LCB5KS5zdWJTZWxmKGcxKTtcclxuICAgICAgICBjb25zdCBjQUEgPSBnZXRQZXJsaW4yRFZlY3RvckF0KGcwLngsIGcwLnksIHNlZWQsIGdyYWRpZW50cykuZG90KGYwKTtcclxuICAgICAgICBjb25zdCBjQUIgPSBnZXRQZXJsaW4yRFZlY3RvckF0KGcwLngsIGcxLnksIHNlZWQsIGdyYWRpZW50cykuZG90QyhmMC54LCBmMS55KTtcclxuICAgICAgICBjb25zdCBjQkEgPSBnZXRQZXJsaW4yRFZlY3RvckF0KGcxLngsIGcwLnksIHNlZWQsIGdyYWRpZW50cykuZG90QyhmMS54LCBmMC55KTtcclxuICAgICAgICBjb25zdCBjQkIgPSBnZXRQZXJsaW4yRFZlY3RvckF0KGcxLngsIGcxLnksIHNlZWQsIGdyYWRpZW50cykuZG90KGYxKTtcclxuICAgICAgICBjb25zdCB0eCA9IGZhZGUoZjAueCk7XHJcbiAgICAgICAgY29uc3QgdHkgPSBmYWRlKGYwLnkpO1xyXG4gICAgICAgIGNvbnN0IGNBID0gbGVycChjQUEsIGNCQSwgdHgpO1xyXG4gICAgICAgIGNvbnN0IGNCID0gbGVycChjQUIsIGNCQiwgdHgpO1xyXG4gICAgICAgIGNvbnN0IGMgPSBsZXJwKGNBLCBjQiwgdHkpO1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5jbGFtcChjICogMC41ICsgMC41LCAwLCAxKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZW5lcmF0ZVBlcmxpbjNER3JhZGllbnRzKGNvdW50ID0gMTYpIHtcclxuICAgICAgICBjb25zdCBncmFkaWVudHM6IFZlYzNbXSA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8Y291bnQ7aSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHkgPSAxIC0gKDIqaSkvKGNvdW50LTEpO1xyXG4gICAgICAgICAgICBjb25zdCByID0gTWF0aC5zcXJ0KDEteSp5KTtcclxuICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBpICogTWF0aC5QSSAqICgzLU1hdGguc3FydCg1KSk7XHJcbiAgICAgICAgICAgIGdyYWRpZW50cy5wdXNoKG5ldyBWZWMzKFxyXG4gICAgICAgICAgICAgICAgTWF0aC5jb3MoYW5nbGUpICogcixcclxuICAgICAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgICAgICBNYXRoLnNpbihhbmdsZSkgKiByLFxyXG4gICAgICAgICAgICApKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGdyYWRpZW50cztcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRQZXJsaW4zRFZlY3RvckF0KHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHNlZWQ6IG51bWJlciwgZ3JhZGllbnRzOiBWZWMzW10pIDogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIGdyYWRpZW50c1tNYXRoLmZsb29yKHRoaXMucmFuZG9tQ29uc3RhbnQ0KHNlZWQsIHgsIHksIHopICogZ3JhZGllbnRzLmxlbmd0aCldITtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRQZXJsaW4zRFZhbHVlQXQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgc2VlZDogbnVtYmVyLCBncmFkaWVudHM6IFZlYzNbXSkgOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGdldFBlcmxpbjNEVmVjdG9yQXQgPSB0aGlzLmdldFBlcmxpbjNEVmVjdG9yQXQuYmluZCh0aGlzKTtcclxuICAgICAgICBjb25zdCBsZXJwID0gRU1hdGgubGVycDtcclxuICAgICAgICBjb25zdCBmYWRlID0gdGhpcy5mYWRlO1xyXG4gICAgICAgIGNvbnN0IGcwID0gbmV3IFZlYzMoeCwgeSwgeikubWFwU2VsZihNYXRoLmZsb29yKTtcclxuICAgICAgICBjb25zdCBnMSA9IG5ldyBWZWMzKGcwKS5hZGRTZWxmQygxLCAxLCAxKTtcclxuICAgICAgICBjb25zdCBmMCA9IG5ldyBWZWMzKHgsIHksIHopLnN1YlNlbGYoZzApO1xyXG4gICAgICAgIGNvbnN0IGYxID0gbmV3IFZlYzMoeCwgeSwgeikuc3ViU2VsZihnMSk7XHJcbiAgICAgICAgY29uc3QgY0FBQSA9IGdldFBlcmxpbjNEVmVjdG9yQXQoZzAueCwgZzAueSwgZzAueiwgc2VlZCwgZ3JhZGllbnRzKS5kb3QoZjApO1xyXG4gICAgICAgIGNvbnN0IGNBQUIgPSBnZXRQZXJsaW4zRFZlY3RvckF0KGcwLngsIGcwLnksIGcxLnosIHNlZWQsIGdyYWRpZW50cykuZG90QyhmMC54LCBmMC55LCBmMS56KTtcclxuICAgICAgICBjb25zdCBjQUJBID0gZ2V0UGVybGluM0RWZWN0b3JBdChnMC54LCBnMS55LCBnMC56LCBzZWVkLCBncmFkaWVudHMpLmRvdEMoZjAueCwgZjEueSwgZjAueik7XHJcbiAgICAgICAgY29uc3QgY0FCQiA9IGdldFBlcmxpbjNEVmVjdG9yQXQoZzAueCwgZzEueSwgZzEueiwgc2VlZCwgZ3JhZGllbnRzKS5kb3RDKGYwLngsIGYxLnksIGYxLnopO1xyXG4gICAgICAgIGNvbnN0IGNCQUEgPSBnZXRQZXJsaW4zRFZlY3RvckF0KGcxLngsIGcwLnksIGcwLnosIHNlZWQsIGdyYWRpZW50cykuZG90QyhmMS54LCBmMC55LCBmMC56KTtcclxuICAgICAgICBjb25zdCBjQkFCID0gZ2V0UGVybGluM0RWZWN0b3JBdChnMS54LCBnMC55LCBnMS56LCBzZWVkLCBncmFkaWVudHMpLmRvdEMoZjEueCwgZjAueSwgZjEueik7XHJcbiAgICAgICAgY29uc3QgY0JCQSA9IGdldFBlcmxpbjNEVmVjdG9yQXQoZzEueCwgZzEueSwgZzAueiwgc2VlZCwgZ3JhZGllbnRzKS5kb3RDKGYxLngsIGYxLnksIGYwLnopO1xyXG4gICAgICAgIGNvbnN0IGNCQkIgPSBnZXRQZXJsaW4zRFZlY3RvckF0KGcxLngsIGcxLnksIGcxLnosIHNlZWQsIGdyYWRpZW50cykuZG90KGYxKTtcclxuICAgICAgICBjb25zdCB0eCA9IGZhZGUoZjAueCk7XHJcbiAgICAgICAgY29uc3QgdHkgPSBmYWRlKGYwLnkpO1xyXG4gICAgICAgIGNvbnN0IHR6ID0gZmFkZShmMC56KTtcclxuICAgICAgICBjb25zdCBjQUEgPSBsZXJwKGNBQUEsIGNCQUEsIHR4KTtcclxuICAgICAgICBjb25zdCBjQUIgPSBsZXJwKGNBQUIsIGNCQUIsIHR4KTtcclxuICAgICAgICBjb25zdCBjQkEgPSBsZXJwKGNBQkEsIGNCQkEsIHR4KTtcclxuICAgICAgICBjb25zdCBjQkIgPSBsZXJwKGNBQkIsIGNCQkIsIHR4KTtcclxuICAgICAgICBjb25zdCBjQSA9IGxlcnAoY0FBLCBjQkEsIHR5KTtcclxuICAgICAgICBjb25zdCBjQiA9IGxlcnAoY0FCLCBjQkIsIHR5KTtcclxuICAgICAgICBjb25zdCBjID0gbGVycChjQSwgY0IsIHR6KTtcclxuICAgICAgICByZXR1cm4gRU1hdGguY2xhbXAoYyAqIDAuNSArIDAuNSwgMCwgMSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0V29ybGV5MkRQb3NpdGlvbkF0R3JpZCh4OiBudW1iZXIsIHk6IG51bWJlciwgc2VlZDogbnVtYmVyLCBvZmZzZXRBbXA6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHhvID0gKHRoaXMucmFuZG9tQ29uc3RhbnQzKHgsIHksIHNlZWQrMSkgLSAwLjUpICogb2Zmc2V0QW1wO1xyXG4gICAgICAgIGNvbnN0IHlvID0gKHRoaXMucmFuZG9tQ29uc3RhbnQzKHgsIHksIHNlZWQrMikgLSAwLjUpICogb2Zmc2V0QW1wO1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih4ICsgeG8sIHkgKyB5byk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0V29ybGV5MkRWYWx1ZUF0R3JpZCh4OiBudW1iZXIsIHk6IG51bWJlciwgc2VlZDogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmFuZG9tQ29uc3RhbnQzKHgsIHksIHNlZWQpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldFdvcmxleTJEQXQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHNlZWQ6IG51bWJlciwgb2Zmc2V0QW1wOiBudW1iZXIsIHNlYXJjaD86IG51bWJlcikge1xyXG4gICAgICAgIHNlYXJjaCA9IHNlYXJjaCA/PyBNYXRoLmNlaWwob2Zmc2V0QW1wKSArIDE7XHJcbiAgICAgICAgY29uc3QgZ3ggPSBNYXRoLmZsb29yKHgpO1xyXG4gICAgICAgIGNvbnN0IGd5ID0gTWF0aC5mbG9vcih5KTtcclxuICAgICAgICBsZXQgbWluRGlzdCA9IEluZmluaXR5O1xyXG4gICAgICAgIGxldCBtaW5EaXN0MiA9IEluZmluaXR5O1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IDA7XHJcbiAgICAgICAgbGV0IHZhbHVlMiA9IDA7XHJcbiAgICAgICAgZm9yKGxldCBpeD1neC1zZWFyY2g7IGl4PD1neCtzZWFyY2g7IGl4KyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCBpeT1neS1zZWFyY2g7IGl5PD1neStzZWFyY2g7IGl5KyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwb2ludCA9IHRoaXMuZ2V0V29ybGV5MkRQb3NpdGlvbkF0R3JpZChpeCwgaXksIHNlZWQsIG9mZnNldEFtcCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGlzdCA9IHBvaW50LmRpc3RUb0MoeCwgeSk7XHJcbiAgICAgICAgICAgICAgICBpZihkaXN0IDwgbWluRGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbkRpc3QyID0gbWluRGlzdDtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTIgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBtaW5EaXN0ID0gZGlzdDtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuZ2V0V29ybGV5MkRWYWx1ZUF0R3JpZChpeCwgaXksIHNlZWQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKGRpc3QgPCBtaW5EaXN0Mikge1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbkRpc3QyID0gZGlzdDtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTIgPSB0aGlzLmdldFdvcmxleTJEVmFsdWVBdEdyaWQoaXgsIGl5LCBzZWVkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geyB2YWx1ZSwgdmFsdWUyLCBtaW5EaXN0LCBtaW5EaXN0MiB9O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldFdvcmxleTNEUG9zaXRpb25BdEdyaWQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgc2VlZDogbnVtYmVyLCBvZmZzZXRBbXA6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHhvID0gKHRoaXMucmFuZG9tQ29uc3RhbnQ0KHgsIHksIHosIHNlZWQrMSkgLSAwLjUpICogb2Zmc2V0QW1wO1xyXG4gICAgICAgIGNvbnN0IHlvID0gKHRoaXMucmFuZG9tQ29uc3RhbnQ0KHgsIHksIHosIHNlZWQrMikgLSAwLjUpICogb2Zmc2V0QW1wO1xyXG4gICAgICAgIGNvbnN0IHpvID0gKHRoaXMucmFuZG9tQ29uc3RhbnQ0KHgsIHksIHosIHNlZWQrMykgLSAwLjUpICogb2Zmc2V0QW1wO1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh4ICsgeG8sIHkgKyB5bywgeiArIHpvKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRXb3JsZXkzRFZhbHVlQXRHcmlkKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHNlZWQ6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJhbmRvbUNvbnN0YW50NCh4LCB5LCB6LCBzZWVkKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRXb3JsZXkzRFZhbHVlQXQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgc2VlZDogbnVtYmVyLCBvZmZzZXRBbXA6IG51bWJlciwgc2VhcmNoPzogbnVtYmVyKSB7XHJcbiAgICAgICAgc2VhcmNoID0gc2VhcmNoID8/IE1hdGguY2VpbChvZmZzZXRBbXApICsgMTtcclxuICAgICAgICBjb25zdCBneCA9IE1hdGguZmxvb3IoeCk7XHJcbiAgICAgICAgY29uc3QgZ3kgPSBNYXRoLmZsb29yKHkpO1xyXG4gICAgICAgIGNvbnN0IGd6ID0gTWF0aC5mbG9vcih6KTtcclxuICAgICAgICBsZXQgbWluRGlzdCA9IEluZmluaXR5O1xyXG4gICAgICAgIGxldCB2YWx1ZSA9IDA7XHJcbiAgICAgICAgZm9yKGxldCBpeD1neC1zZWFyY2g7IGl4PD1neCtzZWFyY2g7IGl4KyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCBpeT1neS1zZWFyY2g7IGl5PD1neStzZWFyY2g7IGl5KyspIHtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaXo9Z3otc2VhcmNoOyBpejw9Z3orc2VhcmNoOyBpeisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBvaW50ID0gdGhpcy5nZXRXb3JsZXkzRFBvc2l0aW9uQXRHcmlkKGl4LCBpeSwgaXosIHNlZWQsIG9mZnNldEFtcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRpc3QgPSBwb2ludC5kaXN0VG9DKHgsIHksIHopO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGRpc3QgPCBtaW5EaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbkRpc3QgPSBkaXN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuZ2V0V29ybGV5M0RWYWx1ZUF0R3JpZChpeCwgaXksIGl6LCBzZWVkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgQ0FNRVJBIENMQVNTRVMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGNsYXNzIENhbWVyYTNEIHtcclxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uPzogVmVjMywgZm92WT86IG51bWJlciwgYXNwZWN0PzogbnVtYmVyLCBuZWFyPzogbnVtYmVyLCBmYXI/OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb24gPz8gVmVjMy56ZXJvKCk7XHJcbiAgICAgICAgdGhpcy5mb3ZZID0gZm92WSA/PyA5NS8xODAqTWF0aC5QSTtcclxuICAgICAgICB0aGlzLmFzcGVjdCA9IGFzcGVjdCA/PyAxO1xyXG4gICAgICAgIHRoaXMubmVhciA9IG5lYXIgPz8gMC4xO1xyXG4gICAgICAgIHRoaXMuZmFyID0gZmFyID8/IDEwMDAwO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSBWZWMzLnplcm8oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9mb3ZZITogbnVtYmVyO1xyXG4gICAgZ2V0IGZvdlkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Zvdlk7XHJcbiAgICB9XHJcbiAgICBzZXQgZm92WShuOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9mb3ZZID0gbjtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZFBlcnNwZWN0aXZlTWF0cml4ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9hc3BlY3QhOiBudW1iZXI7XHJcbiAgICBnZXQgYXNwZWN0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hc3BlY3Q7XHJcbiAgICB9XHJcbiAgICBzZXQgYXNwZWN0KG46IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2FzcGVjdCA9IG47XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRQZXJzcGVjdGl2ZU1hdHJpeCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfbmVhciE6IG51bWJlcjtcclxuICAgIGdldCBuZWFyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9uZWFyO1xyXG4gICAgfVxyXG4gICAgc2V0IG5lYXIobjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fbmVhciA9IG47XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRQZXJzcGVjdGl2ZU1hdHJpeCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZmFyITogbnVtYmVyO1xyXG4gICAgZ2V0IGZhcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZmFyO1xyXG4gICAgfVxyXG4gICAgc2V0IGZhcihuOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9mYXIgPSBuO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkUGVyc3BlY3RpdmVNYXRyaXggPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3Bvc2l0aW9uITogVmVjMztcclxuICAgIGdldCBwb3NpdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9zaXRpb247XHJcbiAgICB9XHJcbiAgICBzZXQgcG9zaXRpb24odjogVmVjMykge1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gdjtcclxuICAgICAgICB2Lm9uTXV0YXRlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFRyYW5zbGF0aW9uTWF0cml4ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRWaWV3TWF0cml4ID0gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHYub25NdXRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF93b3JsZFNjYWxlID0gMTtcclxuICAgIGdldCB3b3JsZFNjYWxlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93b3JsZFNjYWxlO1xyXG4gICAgfVxyXG4gICAgc2V0IHdvcmxkU2NhbGUobjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fd29ybGRTY2FsZSA9IG47XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRUcmFuc2xhdGlvbk1hdHJpeCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRWaWV3TWF0cml4ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yb3RhdGlvbiE6IFZlYzM7XHJcbiAgICBnZXQgcm90YXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvdGF0aW9uO1xyXG4gICAgfVxyXG4gICAgc2V0IHJvdGF0aW9uKHY6IFZlYzMpIHtcclxuICAgICAgICB0aGlzLl9yb3RhdGlvbiA9IHY7XHJcbiAgICAgICAgdi5vbk11dGF0ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRGb3J3YXJkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSaWdodCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkVXAgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZEZvcndhcmRGbGF0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSb3RhdGlvbk1hdHJpeCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkVmlld01hdHJpeCA9IHRydWU7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2Lm9uTXV0YXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZm9yd2FyZCA9IFZlYzMuemVybygpO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRGb3J3YXJkPzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBnZXQgZm9yd2FyZCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZEZvcndhcmQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZm9yd2FyZCA9IFZlYzMuekF4aXMoKS5uZWdTZWxmKCkucm90WFlaU2VsZih0aGlzLl9yb3RhdGlvbik7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZEZvcndhcmQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3J3YXJkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JpZ2h0ID0gVmVjMy56ZXJvKCk7XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZFJpZ2h0PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBnZXQgcmlnaHQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRSaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yaWdodCA9IFZlYzMueEF4aXMoKS5yb3RYWVpTZWxmKHRoaXMuX3JvdGF0aW9uKTtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkUmlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9yaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF91cCA9IFZlYzMuemVybygpO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRVcD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgZ2V0IHVwKCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkVXApIHtcclxuICAgICAgICAgICAgdGhpcy5fdXAgPSBWZWMzLnlBeGlzKCkucm90WFlaU2VsZih0aGlzLl9yb3RhdGlvbik7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFVwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fdXA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZm9yd2FyZEZsYXQgPSBWZWMzLnplcm8oKTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkRm9yd2FyZEZsYXQ/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGdldCBmb3J3YXJkRmxhdCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZEZvcndhcmRGbGF0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvcndhcmRGbGF0ID0gVmVjMy56QXhpcygpLm5lZ1NlbGYoKS5yb3RZU2VsZih0aGlzLl9yb3RhdGlvbi55KTtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkRm9yd2FyZEZsYXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3J3YXJkRmxhdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9wZXJzcGVjdGl2ZU1hdHJpeDogbnVtYmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkUGVyc3BlY3RpdmVNYXRyaXg/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBwZXJzcGVjdGl2ZU1hdHJpeE9ic2VydmVyID0gbmV3IFNpZ25hbCh7IG9uQ29ubmVjdDogY29ubiA9PiBjb25uLmZpcmUodGhpcy5wZXJzcGVjdGl2ZU1hdHJpeCkgfSk7XHJcbiAgICBnZXQgcGVyc3BlY3RpdmVNYXRyaXgoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVQZXJzcGVjdGl2ZU1hdHJpeCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wZXJzcGVjdGl2ZU1hdHJpeDtcclxuICAgIH1cclxuICAgIHVwZGF0ZVBlcnNwZWN0aXZlTWF0cml4KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkUGVyc3BlY3RpdmVNYXRyaXggIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3BlcnNwZWN0aXZlTWF0cml4ID0gTWF0NC5wZXJzcGVjdGl2ZSh0aGlzLl9mb3ZZLCB0aGlzLl9hc3BlY3QsIHRoaXMuX25lYXIsIHRoaXMuX2Zhcik7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkUGVyc3BlY3RpdmVNYXRyaXg7XHJcbiAgICAgICAgdGhpcy5wZXJzcGVjdGl2ZU1hdHJpeE9ic2VydmVyLmZpcmUodGhpcy5fcGVyc3BlY3RpdmVNYXRyaXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3RyYW5zbGF0aW9uTWF0cml4OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRUcmFuc2xhdGlvbk1hdHJpeD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIHRyYW5zbGF0aW9uTWF0cml4T2JzZXJ2ZXIgPSBuZXcgU2lnbmFsKHsgb25Db25uZWN0OiBjb25uID0+IGNvbm4uZmlyZSh0aGlzLnRyYW5zbGF0aW9uTWF0cml4KSB9KTtcclxuICAgIGdldCB0cmFuc2xhdGlvbk1hdHJpeCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRyYW5zbGF0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9uTWF0cml4O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlVHJhbnNsYXRpb25NYXRyaXgoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRUcmFuc2xhdGlvbk1hdHJpeCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fdHJhbnNsYXRpb25NYXRyaXggPSBNYXQ0LnRyYW5zbGF0ZSgtdGhpcy5fcG9zaXRpb24ueCAqIHRoaXMuX3dvcmxkU2NhbGUsIC10aGlzLl9wb3NpdGlvbi55ICogdGhpcy5fd29ybGRTY2FsZSwgLXRoaXMuX3Bvc2l0aW9uLnogKiB0aGlzLl93b3JsZFNjYWxlKTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRUcmFuc2xhdGlvbk1hdHJpeDtcclxuICAgICAgICB0aGlzLnRyYW5zbGF0aW9uTWF0cml4T2JzZXJ2ZXIuZmlyZSh0aGlzLl92aWV3TWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yb3RhdGlvbk1hdHJpeDogbnVtYmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkUm90YXRpb25NYXRyaXg/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyByb3RhdGlvbk1hdHJpeE9ic2VydmVyID0gbmV3IFNpZ25hbCh7IG9uQ29ubmVjdDogY29ubiA9PiBjb25uLmZpcmUodGhpcy5yb3RhdGlvbk1hdHJpeCkgfSk7XHJcbiAgICBnZXQgcm90YXRpb25NYXRyaXgoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSb3RhdGlvbk1hdHJpeCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yb3RhdGlvbk1hdHJpeDtcclxuICAgIH1cclxuICAgIHVwZGF0ZVJvdGF0aW9uTWF0cml4KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkUm90YXRpb25NYXRyaXggIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3JvdGF0aW9uTWF0cml4ID0gTWF0NC5tdWx0aXBseShcclxuICAgICAgICAgICAgTWF0NC5yb3RhdGVaKC10aGlzLl9yb3RhdGlvbi56KSxcclxuICAgICAgICAgICAgTWF0NC5tdWx0aXBseShcclxuICAgICAgICAgICAgICAgIE1hdDQucm90YXRlWCgtdGhpcy5fcm90YXRpb24ueCksXHJcbiAgICAgICAgICAgICAgICBNYXQ0LnJvdGF0ZVkoLXRoaXMuX3JvdGF0aW9uLnkpLFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgKTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRSb3RhdGlvbk1hdHJpeDtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uTWF0cml4T2JzZXJ2ZXIuZmlyZSh0aGlzLl92aWV3TWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF92aWV3TWF0cml4OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRWaWV3TWF0cml4PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgdmlld01hdHJpeE9ic2VydmVyID0gbmV3IFNpZ25hbCh7IG9uQ29ubmVjdDogY29ubiA9PiBjb25uLmZpcmUodGhpcy52aWV3TWF0cml4KSB9KTtcclxuICAgIGdldCB2aWV3TWF0cml4KCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlld01hdHJpeCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92aWV3TWF0cml4O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlVmlld01hdHJpeCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFZpZXdNYXRyaXggIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3ZpZXdNYXRyaXggPSBNYXQ0Lm11bHRpcGx5KHRoaXMucm90YXRpb25NYXRyaXgsIHRoaXMudHJhbnNsYXRpb25NYXRyaXgpO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFZpZXdNYXRyaXg7XHJcbiAgICAgICAgdGhpcy52aWV3TWF0cml4T2JzZXJ2ZXIuZmlyZSh0aGlzLl92aWV3TWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICBsb29rQXQocDogVmVjMykge1xyXG4gICAgICAgIGxldCBmID0gdGhpcy5wb3NpdGlvbi5sb29rKHApO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSBuZXcgVmVjMyhmLnBpdGNoKCksIGYueWF3KCksIDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2FtZXJhMkQge1xyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb24/OiBWZWMyLCBzaXplPzogVmVjMikge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbiA/PyBWZWMyLnplcm8oKTtcclxuICAgICAgICB0aGlzLnNpemUgPSBzaXplID8/IFZlYzIub25lKCk7XHJcbiAgICB9XHJcbiAgICBwb3NpdGlvbjogVmVjMjtcclxuICAgIHNpemU6IFZlYzI7XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgTUVTSCBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgY2xhc3MgTWVzaDNEIHtcclxuICAgIHBvc2l0aW9uczogbnVtYmVyW10gPSBbXTtcclxuICAgIHRleGNvb3JkczogbnVtYmVyW10gPSBbXTtcclxuICAgIG5vcm1hbHM6IG51bWJlcltdID0gW107XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcbiAgICBjbG9uZSgpOiBNZXNoM0Qge1xyXG4gICAgICAgIHJldHVybiBuZXcgTWVzaDNEKCkuYXBwZW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgdHJhbnNsYXRlKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTMpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaV0hICs9IHg7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMV0hICs9IHk7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMl0hICs9IHo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc2NhbGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mykge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpXSEgKj0geDtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsxXSEgKj0geTtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsyXSEgKj0gejtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByb3RhdGUoYXg6IG51bWJlciwgYXk6IG51bWJlciwgYXo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mykge1xyXG4gICAgICAgICAgICBsZXQgcCA9IG5ldyBWZWMzKHRoaXMucG9zaXRpb25zW2ldISwgdGhpcy5wb3NpdGlvbnNbaSsxXSEsIHRoaXMucG9zaXRpb25zW2krMl0hKTtcclxuICAgICAgICAgICAgcC5yb3RYWVpTZWxmQyhheCwgYXksIGF6KTtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaV0gPSBwLng7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMV0gPSBwLnk7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMl0gPSBwLno7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMubm9ybWFscy5sZW5ndGg7IGkrPTMpIHtcclxuICAgICAgICAgICAgbGV0IHAgPSBuZXcgVmVjMyh0aGlzLm5vcm1hbHNbaV0hLCB0aGlzLm5vcm1hbHNbaSsxXSEsIHRoaXMubm9ybWFsc1tpKzJdISk7XHJcbiAgICAgICAgICAgIHAucm90WFlaU2VsZkMoYXgsIGF5LCBheik7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFsc1tpXSA9IHAueDtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzW2krMV0gPSBwLnk7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFsc1tpKzJdID0gcC56O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdGF0ZUFyb3VuZCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBheDogbnVtYmVyLCBheTogbnVtYmVyLCBhejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5wb3NpdGlvbnMubGVuZ3RoOyBpKz0zKSB7XHJcbiAgICAgICAgICAgIGxldCBwID0gbmV3IFZlYzModGhpcy5wb3NpdGlvbnNbaV0hIC0geCwgdGhpcy5wb3NpdGlvbnNbaSsxXSEgLSB5LCB0aGlzLnBvc2l0aW9uc1tpKzJdISAtIHopO1xyXG4gICAgICAgICAgICBwLnJvdFhZWlNlbGZDKGF4LCBheSwgYXopO1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpXSA9IHAueCArIHg7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMV0gPSBwLnkgKyB5O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzJdID0gcC56ICsgejtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5ub3JtYWxzLmxlbmd0aDsgaSs9Mykge1xyXG4gICAgICAgICAgICBsZXQgcCA9IG5ldyBWZWMzKHRoaXMubm9ybWFsc1tpXSEsIHRoaXMubm9ybWFsc1tpKzFdISwgdGhpcy5ub3JtYWxzW2krMl0hKTtcclxuICAgICAgICAgICAgcC5yb3RYWVpTZWxmQyhheCwgYXksIGF6KTtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzW2ldID0gcC54O1xyXG4gICAgICAgICAgICB0aGlzLm5vcm1hbHNbaSsxXSA9IHAueTtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzW2krMl0gPSBwLno7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYXBwZW5kKC4uLm1lc2hlczogTWVzaDNEW10pOiB0aGlzIHtcclxuICAgICAgICBmb3IoY29uc3QgbWVzaCBvZiBtZXNoZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnMucHVzaCguLi5tZXNoLnBvc2l0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMudGV4Y29vcmRzLnB1c2goLi4ubWVzaC50ZXhjb29yZHMpO1xyXG4gICAgICAgICAgICB0aGlzLm5vcm1hbHMucHVzaCguLi5tZXNoLm5vcm1hbHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHB1c2hQb3NpdGlvbnMoYXJyOiBudW1iZXJbXSwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcikge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mykge1xyXG4gICAgICAgICAgICBhcnIucHVzaCh0aGlzLnBvc2l0aW9uc1tpXSEgKyB4KTtcclxuICAgICAgICAgICAgYXJyLnB1c2godGhpcy5wb3NpdGlvbnNbaSsxXSEgKyB5KTtcclxuICAgICAgICAgICAgYXJyLnB1c2godGhpcy5wb3NpdGlvbnNbaSsyXSEgKyB6KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH1cclxuICAgIHNldE5vcm1hbHMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMubm9ybWFscy5sZW5ndGg7IGkrPTMpIHtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzW2ldID0geDtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzW2krMV0gPSB5O1xyXG4gICAgICAgICAgICB0aGlzLm5vcm1hbHNbaSsyXSA9IHo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHRyaWFuZ2xlc1RvRWRnZXMocG9zaXRpb25zOiBudW1iZXJbXSk6IG51bWJlcltdIHtcclxuICAgICAgICBsZXQgZWRnZXM6IG51bWJlcltdID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8cG9zaXRpb25zLmxlbmd0aDsgaSs9OSkge1xyXG4gICAgICAgICAgICBlZGdlcy5wdXNoKHBvc2l0aW9uc1tpXSEsIHBvc2l0aW9uc1tpKzFdISwgcG9zaXRpb25zW2krMl0hLCBwb3NpdGlvbnNbaSszXSEsIHBvc2l0aW9uc1tpKzRdISwgcG9zaXRpb25zW2krNV0hKTtcclxuICAgICAgICAgICAgZWRnZXMucHVzaChwb3NpdGlvbnNbaSszXSEsIHBvc2l0aW9uc1tpKzRdISwgcG9zaXRpb25zW2krNV0hLCBwb3NpdGlvbnNbaSs2XSEsIHBvc2l0aW9uc1tpKzddISwgcG9zaXRpb25zW2krOF0hKTtcclxuICAgICAgICAgICAgZWRnZXMucHVzaChwb3NpdGlvbnNbaSs2XSEsIHBvc2l0aW9uc1tpKzddISwgcG9zaXRpb25zW2krOF0hLCBwb3NpdGlvbnNbaV0hLCBwb3NpdGlvbnNbaSsxXSEsIHBvc2l0aW9uc1tpKzJdISk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlZGdlcztcclxuICAgIH1cclxuICAgIHN0YXRpYyB0cmlhbmdsZVF1YWRzVG9FZGdlcyhwb3NpdGlvbnM6IG51bWJlcltdKTogbnVtYmVyW10ge1xyXG4gICAgICAgIGxldCBlZGdlczogbnVtYmVyW10gPSBbXTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxwb3NpdGlvbnMubGVuZ3RoOyBpKz0xOCkge1xyXG4gICAgICAgICAgICBlZGdlcy5wdXNoKHBvc2l0aW9uc1tpXSEsIHBvc2l0aW9uc1tpKzFdISwgcG9zaXRpb25zW2krMl0hLCBwb3NpdGlvbnNbaSszXSEsIHBvc2l0aW9uc1tpKzRdISwgcG9zaXRpb25zW2krNV0hKTtcclxuICAgICAgICAgICAgZWRnZXMucHVzaChwb3NpdGlvbnNbaSszXSEsIHBvc2l0aW9uc1tpKzRdISwgcG9zaXRpb25zW2krNV0hLCBwb3NpdGlvbnNbaSs2XSEsIHBvc2l0aW9uc1tpKzddISwgcG9zaXRpb25zW2krOF0hKTtcclxuICAgICAgICAgICAgZWRnZXMucHVzaChwb3NpdGlvbnNbaSs2XSEsIHBvc2l0aW9uc1tpKzddISwgcG9zaXRpb25zW2krOF0hLCBwb3NpdGlvbnNbaSs5XSEsIHBvc2l0aW9uc1tpKzEwXSEsIHBvc2l0aW9uc1tpKzExXSEpO1xyXG4gICAgICAgICAgICBlZGdlcy5wdXNoKHBvc2l0aW9uc1tpKzldISwgcG9zaXRpb25zW2krMTBdISwgcG9zaXRpb25zW2krMTFdISwgcG9zaXRpb25zW2krMTJdISwgcG9zaXRpb25zW2krMTNdISwgcG9zaXRpb25zW2krMTRdISk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlZGdlcztcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBQSFlTSUNTIENMQVNTRVMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQaHlzaWNzMkQge1xyXG4gICAgc3RhdGljIGdldFBvaW50UmVjdENvbGxpc2lvbihwb2ludDogVmVjMiwgY2VudGVyOiBWZWMyLCByaWdodE9mZnNldDogVmVjMiwgdXBPZmZzZXQ6IFZlYzIpIHtcclxuICAgICAgICBjb25zdCByaWdodCA9IHJpZ2h0T2Zmc2V0Lm5vcm0oKTtcclxuICAgICAgICBjb25zdCB1cCA9IHVwT2Zmc2V0Lm5vcm0oKTtcclxuICAgICAgICBjb25zdCBzaXplWCA9IHJpZ2h0T2Zmc2V0Lmxlbmd0aCgpO1xyXG4gICAgICAgIGNvbnN0IHNpemVZID0gdXBPZmZzZXQubGVuZ3RoKCk7XHJcbiAgICAgICAgbGV0IGRpZmYgPSBwb2ludC5zdWIoY2VudGVyKTtcclxuICAgICAgICBsZXQgZHggPSBkaWZmLmRvdChyaWdodCk7XHJcbiAgICAgICAgbGV0IGR5ID0gZGlmZi5kb3QodXApO1xyXG4gICAgICAgIGxldCBpc0luc2lkZSA9IChNYXRoLmFicyhkeCkgPCBzaXplWCAmJiBNYXRoLmFicyhkeSkgPCBzaXplWSk7XHJcbiAgICAgICAgaWYoaXNJbnNpZGUpIHtcclxuICAgICAgICAgICAgbGV0IGQxID0gTWF0aC5hYnMocG9pbnQuc3ViKGNlbnRlci5hZGRTY2FsZWQodXAsIHNpemVZKSkuZG90KHVwKSk7XHJcbiAgICAgICAgICAgIGxldCBkMiA9IE1hdGguYWJzKHBvaW50LnN1YihjZW50ZXIuYWRkU2NhbGVkKHVwLCAtc2l6ZVkpKS5kb3QodXApKTtcclxuICAgICAgICAgICAgbGV0IGQzID0gTWF0aC5hYnMocG9pbnQuc3ViKGNlbnRlci5hZGRTY2FsZWQocmlnaHQsIHNpemVYKSkuZG90KHJpZ2h0KSk7XHJcbiAgICAgICAgICAgIGxldCBkNCA9IE1hdGguYWJzKHBvaW50LnN1YihjZW50ZXIuYWRkU2NhbGVkKHJpZ2h0LCAtc2l6ZVgpKS5kb3QocmlnaHQpKTtcclxuICAgICAgICAgICAgbGV0IG1pbkluZGV4ID0gMDtcclxuICAgICAgICAgICAgbGV0IG1pbkRpc3QgPSBkMTtcclxuICAgICAgICAgICAgaWYoZDIgPCBtaW5EaXN0KSB7IG1pbkRpc3QgPSBkMjsgbWluSW5kZXggPSAxOyB9XHJcbiAgICAgICAgICAgIGlmKGQzIDwgbWluRGlzdCkgeyBtaW5EaXN0ID0gZDM7IG1pbkluZGV4ID0gMjsgfVxyXG4gICAgICAgICAgICBpZihkNCA8IG1pbkRpc3QpIHsgbWluRGlzdCA9IGQ0OyBtaW5JbmRleCA9IDM7IH1cclxuICAgICAgICAgICAgbGV0IGVkZ2U6IFZlYzI7XHJcbiAgICAgICAgICAgIGxldCBub3JtYWw6IFZlYzI7XHJcbiAgICAgICAgICAgIHN3aXRjaChtaW5JbmRleCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2UgPSBjZW50ZXIuYWRkU2NhbGVkKHJpZ2h0LCBkeCkuYWRkU2NhbGVkKHVwLCBzaXplWSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsID0gdXA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZSA9IGNlbnRlci5hZGRTY2FsZWQocmlnaHQsIGR4KS5hZGRTY2FsZWQodXAsIC1zaXplWSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsID0gdXAubmVnKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZSA9IGNlbnRlci5hZGRTY2FsZWQodXAsIGR5KS5hZGRTY2FsZWQocmlnaHQsIHNpemVYKTtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWwgPSByaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICBlZGdlID0gY2VudGVyLmFkZFNjYWxlZCh1cCwgZHkpLmFkZFNjYWxlZChyaWdodCwgLXNpemVYKTtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWwgPSByaWdodC5uZWcoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgaW5zaWRlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29sbGlzaW9uOiBlZGdlISxcclxuICAgICAgICAgICAgICAgIGRpc3RhbmNlOiAtZWRnZSEuZGlzdFRvKHBvaW50KSxcclxuICAgICAgICAgICAgICAgIG5vcm1hbDogbm9ybWFsISxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGR4ID0gRU1hdGguY2xhbXAoZHgsIC1zaXplWCwgc2l6ZVgpO1xyXG4gICAgICAgICAgICBkeSA9IEVNYXRoLmNsYW1wKGR5LCAtc2l6ZVksIHNpemVZKTtcclxuICAgICAgICAgICAgbGV0IGVkZ2UgPSBjZW50ZXIuYWRkU2NhbGVkKHJpZ2h0LCBkeCkuYWRkU2NhbGVkKHVwLCBkeSk7XHJcbiAgICAgICAgICAgIGxldCBkaXN0ID0gZWRnZS5kaXN0VG8ocG9pbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgaW5zaWRlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbGxpc2lvbjogZWRnZSxcclxuICAgICAgICAgICAgICAgIGRpc3RhbmNlOiBkaXN0LFxyXG4gICAgICAgICAgICAgICAgbm9ybWFsOiBlZGdlLmxvb2socG9pbnQpLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRJc1BvaW50SW5zaWRlUmVjdChwb2ludDogVmVjMiwgY2VudGVyOiBWZWMyLCByaWdodE9mZnNldDogVmVjMiwgdXBPZmZzZXQ6IFZlYzIpIHtcclxuICAgICAgICBsZXQgZGlmZiA9IHBvaW50LnN1YihjZW50ZXIpO1xyXG4gICAgICAgIGxldCBkeCA9IGRpZmYuZG90KHJpZ2h0T2Zmc2V0Lm5vcm0oKSk7XHJcbiAgICAgICAgbGV0IGR5ID0gZGlmZi5kb3QodXBPZmZzZXQubm9ybSgpKTtcclxuICAgICAgICByZXR1cm4gKE1hdGguYWJzKGR4KSA8IHJpZ2h0T2Zmc2V0Lmxlbmd0aCgpICYmIE1hdGguYWJzKGR5KSA8IHVwT2Zmc2V0Lmxlbmd0aCgpKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRDaXJjbGVSZWN0Q29sbGlzaW9uKHBvaW50OiBWZWMyLCByYWRpdXM6IG51bWJlciwgY2VudGVyOiBWZWMyLCByaWdodE9mZnNldDogVmVjMiwgdXBPZmZzZXQ6IFZlYzIpIHtcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy5nZXRQb2ludFJlY3RDb2xsaXNpb24ocG9pbnQsIGNlbnRlciwgcmlnaHRPZmZzZXQsIHVwT2Zmc2V0KTtcclxuICAgICAgICByZXMuZGlzdGFuY2UgLT0gcmFkaXVzO1xyXG4gICAgICAgIGlmKHJlcy5kaXN0YW5jZSA8PSAwKSByZXMuaW5zaWRlID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldENpcmNsZUNpcmNsZUNvbGxpc2lvbihwb2ludEE6IFZlYzIsIHJhZGl1c0E6IG51bWJlciwgcG9pbnRCOiBWZWMyLCByYWRpdXNCOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgZGlzdCA9IHBvaW50QS5kaXN0VG8ocG9pbnRCKSAtIHJhZGl1c0EgLSByYWRpdXNCO1xyXG4gICAgICAgIGxldCBub3JtYWwgPSBwb2ludEEubG9vayhwb2ludEIpO1xyXG4gICAgICAgIGxldCBjb2xsaXNpb24gPSBwb2ludEEuYWRkU2NhbGVkKG5vcm1hbCwgcmFkaXVzQSk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgaW5zaWRlOiBkaXN0IDw9IDAsXHJcbiAgICAgICAgICAgIGNvbGxpc2lvbixcclxuICAgICAgICAgICAgZGlzdGFuY2U6IGRpc3QsXHJcbiAgICAgICAgICAgIG5vcm1hbCxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldENpcmNsZUxpbmVDb2xsaXNpb24ocG9pbnQ6IFZlYzIsIHJhZGl1czogbnVtYmVyLCBzdGFydDogVmVjMiwgZW5kOiBWZWMyKSB7XHJcbiAgICAgICAgbGV0IGRpciA9IHN0YXJ0Lmxvb2soZW5kKTtcclxuICAgICAgICBsZXQgb2ZmID0gcG9pbnQuc3ViKHN0YXJ0KTtcclxuICAgICAgICBsZXQgdCA9IG9mZi5kb3QoZGlyKTtcclxuICAgICAgICBsZXQgbWF4VCA9IGVuZC5kaXN0VG8oc3RhcnQpO1xyXG4gICAgICAgIHQgPSBFTWF0aC5jbGFtcCh0LCAwLCBtYXhUKTtcclxuICAgICAgICBsZXQgY29sbGlzaW9uID0gc3RhcnQuYWRkU2NhbGVkKGRpciwgdCk7XHJcbiAgICAgICAgbGV0IG5vcm1hbCA9IGNvbGxpc2lvbi5sb29rKHBvaW50KTtcclxuICAgICAgICBsZXQgZGlzdCA9IGNvbGxpc2lvbi5kaXN0VG8ocG9pbnQpIC0gcmFkaXVzO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGluc2lkZTogZGlzdCA8PSAwLFxyXG4gICAgICAgICAgICBjb2xsaXNpb24sXHJcbiAgICAgICAgICAgIGRpc3RhbmNlOiBkaXN0LFxyXG4gICAgICAgICAgICBub3JtYWwsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHN0YXRpYyByZXNvbHZlQ2lyY2xlQ2lyY2xlQ29sbGlzaW9uKGE6IGFueSwgYjogYW55LCBjb2w6IGFueSkge1xyXG4gICAgICAgIGlmKCFjb2wuaW5zaWRlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgY29uc3QgdmVsQWxvbmdOb3JtYWwgPSBiLnZlbG9jaXR5LnN1YihhLnZlbG9jaXR5KS5kb3QoY29sLm5vcm1hbCk7XHJcbiAgICAgICAgY29uc3QgbWkgPSAoMS9hLm1hc3MgKyAxL2IubWFzcyk7XHJcbiAgICAgICAgaWYgKHZlbEFsb25nTm9ybWFsIDwgMCkge1xyXG4gICAgICAgICAgICBjb25zdCByZXN0aXR1dGlvbiA9IE1hdGgubWluKGEucmVzdGl0dXRpb24sIGIucmVzdGl0dXRpb24pO1xyXG4gICAgICAgICAgICBjb25zdCBqID0gLSgxK3Jlc3RpdHV0aW9uKSAqIHZlbEFsb25nTm9ybWFsIC8gbWk7XHJcbiAgICAgICAgICAgIGEudmVsb2NpdHkuYWRkU2NhbGVkU2VsZihjb2wubm9ybWFsLCBqICogLTEgLyBhLm1hc3MpO1xyXG4gICAgICAgICAgICBiLnZlbG9jaXR5LmFkZFNjYWxlZFNlbGYoY29sLm5vcm1hbCwgaiAqIDEgLyBiLm1hc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBjb3JyZWN0aW9uID0gY29sLm5vcm1hbC5yZXNjYWxlKE1hdGgubWF4KC1jb2wuZGlzdGFuY2UgLSAxZS00LCAwKSAvIG1pICogMC44KTtcclxuICAgICAgICBhLnBvc2l0aW9uLmFkZFNjYWxlZFNlbGYoY29ycmVjdGlvbiwgLTEvYS5tYXNzKTtcclxuICAgICAgICBiLnBvc2l0aW9uLmFkZFNjYWxlZFNlbGYoY29ycmVjdGlvbiwgMS9iLm1hc3MpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJlc29sdmVDaXJjbGVBbmNob3JlZFJlY3RDb2xsaXNpb24oYTogYW55LCBiOiBhbnksIGNvbDogYW55KSB7XHJcbiAgICAgICAgaWYoIWNvbC5pbnNpZGUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjb25zdCB2ZWxBbG9uZ05vcm1hbCA9IGEudmVsb2NpdHkuc3ViKGIudmVsb2NpdHkpLmRvdChjb2wubm9ybWFsKTtcclxuICAgICAgICBpZiAodmVsQWxvbmdOb3JtYWwgPCAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3RpdHV0aW9uID0gTWF0aC5taW4oYS5yZXN0aXR1dGlvbiwgYi5yZXN0aXR1dGlvbik7XHJcbiAgICAgICAgICAgIGNvbnN0IGogPSAtKDErcmVzdGl0dXRpb24pICogdmVsQWxvbmdOb3JtYWw7XHJcbiAgICAgICAgICAgIGEudmVsb2NpdHkuYWRkU2NhbGVkU2VsZihjb2wubm9ybWFsLCBqKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYS5wb3NpdGlvbiA9IGNvbC5jb2xsaXNpb24uYWRkU2NhbGVkKGNvbC5ub3JtYWwsIGEucmFkaXVzICsgMWUtNik7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGh5c2ljczNEIHtcclxuICAgIHN0YXRpYyByYXljYXN0Vm94ZWxzPFQ+KFxyXG4gICAgICAgIG9yaWdpbjogVmVjMyxcclxuICAgICAgICBkaXJlY3Rpb246IFZlYzMsXHJcbiAgICAgICAgcHJlZGljYXRlOiAocG9zOlZlYzMsIG5vcm1hbDpWZWMzLCBkaXN0Om51bWJlcikgPT4gVCB8IHVuZGVmaW5lZCxcclxuICAgICAgICBtYXhJdGVyYXRpb25zID0gMTAwMFxyXG4gICAgKTogVCB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgY29uc3QgaW52RGlyQWJzID0gZGlyZWN0aW9uLnJkaXZGKDEpLm1hcCh4ID0+IE1hdGguYWJzKHgpKTtcclxuICAgICAgICBjb25zdCBzaWduID0gZGlyZWN0aW9uLm1hcCh4ID0+IHggPiAwID8gMSA6IDApO1xyXG4gICAgICAgIGNvbnN0IHN0ZXAgPSBkaXJlY3Rpb24ubWFwKHggPT4geCA+IDAgPyAxIDogLTEpO1xyXG4gICAgICAgIGxldCB0TWF4WCA9IGludkRpckFicy54ICogKHNpZ24ueD09PTAgPyAob3JpZ2luLnggLSBNYXRoLmZsb29yKG9yaWdpbi54KSkgOiAoTWF0aC5mbG9vcihvcmlnaW4ueCkgKyAxIC0gb3JpZ2luLngpKTtcclxuICAgICAgICBsZXQgdE1heFkgPSBpbnZEaXJBYnMueSAqIChzaWduLnk9PT0wID8gKG9yaWdpbi55IC0gTWF0aC5mbG9vcihvcmlnaW4ueSkpIDogKE1hdGguZmxvb3Iob3JpZ2luLnkpICsgMSAtIG9yaWdpbi55KSk7XHJcbiAgICAgICAgbGV0IHRNYXhaID0gaW52RGlyQWJzLnogKiAoc2lnbi56PT09MCA/IChvcmlnaW4ueiAtIE1hdGguZmxvb3Iob3JpZ2luLnopKSA6IChNYXRoLmZsb29yKG9yaWdpbi56KSArIDEgLSBvcmlnaW4ueikpO1xyXG4gICAgICAgIGxldCBwb3MgPSBuZXcgVmVjMyhvcmlnaW4pLm1hcFNlbGYoeCA9PiBNYXRoLmZsb29yKHgpKTtcclxuICAgICAgICBsZXQgZGlzdGFuY2UgPSAwO1xyXG4gICAgICAgIGxldCBub3JtYWwgPSBWZWMzLnplcm8oKTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxtYXhJdGVyYXRpb25zOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHJlcyA9IHByZWRpY2F0ZShwb3MsIG5vcm1hbCwgZGlzdGFuY2UpO1xyXG4gICAgICAgICAgICBpZihyZXMgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgICAgIGlmKHRNYXhYIDwgdE1heFkpIHtcclxuICAgICAgICAgICAgICAgIGlmKHRNYXhYIDwgdE1heFopIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IHRNYXhYO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbC5zZXRDKC1zdGVwLngsIDAsIDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRNYXhYICs9IGludkRpckFicy54O1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcy54ICs9IHN0ZXAueDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2UgPSB0TWF4WjtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWwuc2V0QygwLCAwLCAtc3RlcC56KTtcclxuICAgICAgICAgICAgICAgICAgICB0TWF4WiArPSBpbnZEaXJBYnMuejtcclxuICAgICAgICAgICAgICAgICAgICBwb3MueiArPSBzdGVwLno7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZih0TWF4WSA8IHRNYXhaKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2UgPSB0TWF4WTtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWwuc2V0QygwLCAtc3RlcC55LCAwKTtcclxuICAgICAgICAgICAgICAgICAgICB0TWF4WSArPSBpbnZEaXJBYnMueTtcclxuICAgICAgICAgICAgICAgICAgICBwb3MueSArPSBzdGVwLnk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gdE1heFo7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsLnNldEMoMCwgMCwgLXN0ZXAueik7XHJcbiAgICAgICAgICAgICAgICAgICAgdE1heFogKz0gaW52RGlyQWJzLno7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zLnogKz0gc3RlcC56O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcmF5Y2FzdEJveChcclxuICAgICAgICBvcmlnaW46IFZlYzMsXHJcbiAgICAgICAgZGlyZWN0aW9uOiBWZWMzLFxyXG4gICAgICAgIGJvdW5kczogVmVjM1tdXHJcbiAgICApIHtcclxuICAgICAgICBjb25zdCBpbnZEaXIgPSBkaXJlY3Rpb24ucmRpdkYoMSk7XHJcbiAgICAgICAgY29uc3Qgc2lnbiA9IGRpcmVjdGlvbi5tYXAoeCA9PiB4ID4gMCA/IDEgOiAwKTtcclxuICAgICAgICBjb25zdCBzaWduRmxpcCA9IGRpcmVjdGlvbi5tYXAoeCA9PiB4ID4gMCA/IDAgOiAxKTtcclxuICAgICAgICBjb25zdCBzdGVwRmxpcCA9IGRpcmVjdGlvbi5tYXAoeCA9PiB4ID4gMCA/IC0xIDogMSk7XHJcbiAgICAgICAgbGV0IHRtaW4gPSAoYm91bmRzW3NpZ25GbGlwLnhdIS54IC0gb3JpZ2luLngpICogaW52RGlyLng7XHJcbiAgICAgICAgbGV0IHRtYXggPSAoYm91bmRzW3NpZ24ueF0hLnggLSBvcmlnaW4ueCkgKiBpbnZEaXIueDtcclxuICAgICAgICBsZXQgbm9ybWFsID0gbmV3IFZlYzMoc3RlcEZsaXAueCwwLDApO1xyXG4gICAgICAgIGxldCB0eW1pbiA9IChib3VuZHNbc2lnbkZsaXAueV0hLnkgLSBvcmlnaW4ueSkgKiBpbnZEaXIueTtcclxuICAgICAgICBsZXQgdHltYXggPSAoYm91bmRzW3NpZ24ueV0hLnkgLSBvcmlnaW4ueSkgKiBpbnZEaXIueTtcclxuICAgICAgICBpZigodG1pbiA+IHR5bWF4KSB8fCAodHltaW4gPiB0bWF4KSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYodHltaW4gPiB0bWluKSB7XHJcbiAgICAgICAgICAgIHRtaW4gPSB0eW1pbjtcclxuICAgICAgICAgICAgbm9ybWFsID0gbmV3IFZlYzMoMCxzdGVwRmxpcC55LDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eW1heCA8IHRtYXgpIHRtYXggPSB0eW1heDtcclxuICAgICAgICBsZXQgdHptaW4gPSAoYm91bmRzW3NpZ25GbGlwLnpdIS56IC0gb3JpZ2luLnopICogaW52RGlyLno7XHJcbiAgICAgICAgbGV0IHR6bWF4ID0gKGJvdW5kc1tzaWduLnpdIS56IC0gb3JpZ2luLnopICogaW52RGlyLno7XHJcbiAgICAgICAgaWYoKHRtaW4gPiB0em1heCkgfHwgKHR6bWluID4gdG1heCkpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmKHR6bWluID4gdG1pbikge1xyXG4gICAgICAgICAgICB0bWluID0gdHptaW47XHJcbiAgICAgICAgICAgIG5vcm1hbCA9IG5ldyBWZWMzKDAsMCxzdGVwRmxpcC56KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHptYXggPCB0bWF4KSB0bWF4ID0gdHptYXg7XHJcbiAgICAgICAgY29uc3QgZGlzdGFuY2UgPSB0bWluIDwgMCA/IDAgOiB0bWluO1xyXG4gICAgICAgIHJldHVybiB7IG5vcm1hbCwgZGlzdGFuY2UsIGludGVyc2VjdGlvbjogb3JpZ2luLmFkZFNjYWxlZChkaXJlY3Rpb24sIGRpc3RhbmNlKSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFBoeXNpY3NMYWIyRFBhcnQge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGxhYjogUGh5c2ljc0xhYjJEKSB7XHJcblxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBQaHlzaWNzTGFiMkQge1xyXG4gICAgb2JqZWN0T2JzZXJ2ZXI6IFNpZ25hbDxbb2JqOiBhbnldPiA9IG5ldyBTaWduYWwoe29uQ29ubmVjdDooY29ubik9Pntmb3IoY29uc3Qgb2JqIG9mIHRoaXMub2JqZWN0cyljb25uLmZpcmUob2JqKTt9fSk7XHJcbiAgICBvYmplY3RzOiBhbnkgPSBbXTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuICAgIGNyZWF0ZVJlY3QocG9zaXRpb246IFZlYzIsIHNpemU6IFZlYzIsIHJvdGF0aW9uOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgcmVjdDogYW55ID0ge3Bvc2l0aW9uLCBzaXplfTtcclxuICAgICAgICByZWN0Lmxhc3RQb3NpdGlvbiA9IHBvc2l0aW9uLmNsb25lKCk7XHJcbiAgICAgICAgcmVjdC5zZXRSb3RhdGlvbiA9IChhbmdsZTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJlY3Qucm90YXRpb24gPSBhbmdsZTtcclxuICAgICAgICAgICAgcmVjdC5yaWdodCA9IFZlYzIueEF4aXMoKS5yb3RhdGUoYW5nbGUpO1xyXG4gICAgICAgICAgICByZWN0LnVwID0gVmVjMi55QXhpcygpLnJvdGF0ZShhbmdsZSk7XHJcbiAgICAgICAgICAgIHJlY3QucmlnaHRPZmZzZXQgPSByZWN0LnJpZ2h0Lm11bEYocmVjdC5zaXplLngvMik7XHJcbiAgICAgICAgICAgIHJlY3QudXBPZmZzZXQgPSByZWN0LnVwLm11bEYocmVjdC5zaXplLnkvMik7XHJcbiAgICAgICAgICAgIHJlY3Qucm90YXRpb25NYXRyaXggPSBNYXQzLnJvdGF0ZShyZWN0LnJvdGF0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVjdC5zZXRSb3RhdGlvbihyb3RhdGlvbik7XHJcbiAgICAgICAgcmVjdC5yb3RhdGlvbk1hdHJpeCA9IE1hdDMucm90YXRlKHJlY3Qucm90YXRpb24pO1xyXG4gICAgICAgIHJlY3QudmVsb2NpdHkgPSBWZWMyLnplcm8oKTtcclxuICAgICAgICByZWN0LnJlc3RpdHV0aW9uID0gMTtcclxuICAgICAgICByZWN0LmdyYXZpdHkgPSA1MDA7XHJcbiAgICAgICAgcmVjdC5oYXNDb2xsaXNpb24gPSB0cnVlO1xyXG4gICAgICAgIHJlY3QuYW5jaG9yZWQgPSB0cnVlO1xyXG4gICAgICAgIHJlY3QudHlwZSA9IFwicmVjdFwiO1xyXG4gICAgICAgIHJlY3QuY29sbGlzaW9uID0gbnVsbDtcclxuICAgICAgICB0aGlzLm9iamVjdHMucHVzaChyZWN0KTtcclxuICAgICAgICB0aGlzLm9iamVjdE9ic2VydmVyLmZpcmUocmVjdCk7XHJcbiAgICAgICAgcmV0dXJuIHJlY3Q7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVCYWxsKHBvc2l0aW9uOiBWZWMyLCByYWRpdXM6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBiYWxsOiBhbnkgPSB7cG9zaXRpb24sIHJhZGl1c307XHJcbiAgICAgICAgYmFsbC5sYXN0UG9zaXRpb24gPSBwb3NpdGlvbi5jbG9uZSgpO1xyXG4gICAgICAgIGJhbGwudmVsb2NpdHkgPSBWZWMyLnplcm8oKTtcclxuICAgICAgICBiYWxsLnJvdGF0aW9uTWF0cml4ID0gTWF0My5uZXcoKTtcclxuICAgICAgICBiYWxsLm1hc3MgPSAxO1xyXG4gICAgICAgIGJhbGwucmVzdGl0dXRpb24gPSAxO1xyXG4gICAgICAgIGJhbGwuZ3Jhdml0eSA9IDUwMDtcclxuICAgICAgICBiYWxsLmhhc0NvbGxpc2lvbiA9IHRydWU7XHJcbiAgICAgICAgYmFsbC5hbmNob3JlZCA9IGZhbHNlO1xyXG4gICAgICAgIGJhbGwudHlwZSA9IFwiYmFsbFwiO1xyXG4gICAgICAgIGJhbGwuY29sbGlzaW9uID0gbnVsbDtcclxuICAgICAgICB0aGlzLm9iamVjdHMucHVzaChiYWxsKTtcclxuICAgICAgICB0aGlzLm9iamVjdE9ic2VydmVyLmZpcmUoYmFsbCk7XHJcbiAgICAgICAgcmV0dXJuIGJhbGw7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIGZvcihsZXQgb2JqIG9mIHRoaXMub2JqZWN0cykge1xyXG4gICAgICAgICAgICBvYmouY29sbGlzaW9uID0gbnVsbDtcclxuICAgICAgICAgICAgaWYoIW9iai5hbmNob3JlZCkgY29udGludWU7XHJcbiAgICAgICAgICAgIG9iai52ZWxvY2l0eSA9IG9iai5wb3NpdGlvbi5zdWIob2JqLmxhc3RQb3NpdGlvbikubXVsRigxL2R0KTtcclxuICAgICAgICAgICAgb2JqLmxhc3RQb3NpdGlvbi5zZXRDKG9iai5wb3NpdGlvbi54LCBvYmoucG9zaXRpb24ueSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPDM7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IG9iaiBvZiB0aGlzLm9iamVjdHMpIHtcclxuICAgICAgICAgICAgICAgIGlmKG9iai5hbmNob3JlZCkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBpZihpPT0wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLnZlbG9jaXR5LnkgLT0gb2JqLmdyYXZpdHkgKiBkdDtcclxuICAgICAgICAgICAgICAgICAgICBvYmoucG9zaXRpb24uYWRkU2NhbGVkU2VsZihvYmoudmVsb2NpdHksIGR0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKG9iai50eXBlID09IFwiYmFsbFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBvYmoyIG9mIHRoaXMub2JqZWN0cykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZighb2JqMi5oYXNDb2xsaXNpb24pIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihvYmoyID09IG9iaikgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG9iajIudHlwZSA9PSBcImJhbGxcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbCA9IFBoeXNpY3MyRC5nZXRDaXJjbGVDaXJjbGVDb2xsaXNpb24ob2JqLnBvc2l0aW9uLCBvYmoucmFkaXVzLCBvYmoyLnBvc2l0aW9uLCBvYmoyLnJhZGl1cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQaHlzaWNzMkQucmVzb2x2ZUNpcmNsZUNpcmNsZUNvbGxpc2lvbihvYmosIG9iajIsIGNvbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihjb2wuaW5zaWRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmNvbGxpc2lvbiA9IGNvbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmoyLmNvbGxpc2lvbiA9IGNvbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb2wgPSBQaHlzaWNzMkQuZ2V0Q2lyY2xlUmVjdENvbGxpc2lvbihvYmoucG9zaXRpb24sIG9iai5yYWRpdXMsIG9iajIucG9zaXRpb24sIG9iajIucmlnaHRPZmZzZXQsIG9iajIudXBPZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUGh5c2ljczJELnJlc29sdmVDaXJjbGVBbmNob3JlZFJlY3RDb2xsaXNpb24ob2JqLCBvYmoyLCBjb2wpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoY29sLmluc2lkZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5jb2xsaXNpb24gPSBjb2w7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqMi5jb2xsaXNpb24gPSBjb2w7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIEVWRU5UIENMQVNTRVMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgY2xhc3MgU2lnbmFsPFQgZXh0ZW5kcyBhbnlbXT4ge1xyXG4gICAgY29ubmVjdGlvbnM6IENvbm5lY3Rpb248VD5bXSA9IFtdO1xyXG4gICAgdGltZUZpcmVkOiBudW1iZXIgPSAtTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgIG9uQ29ubmVjdD86IChjb25uOiBDb25uZWN0aW9uPFQ+KSA9PiB2b2lkO1xyXG4gICAgY29uc3RydWN0b3Ioe1xyXG4gICAgICAgIG9uQ29ubmVjdCA9IHVuZGVmaW5lZCxcclxuICAgIH06IHtcclxuICAgICAgICBvbkNvbm5lY3Q/OiAoY29ubjogQ29ubmVjdGlvbjxUPikgPT4gdm9pZCxcclxuICAgIH0gPSB7fSkge1xyXG4gICAgICAgIHRoaXMub25Db25uZWN0ID0gb25Db25uZWN0O1xyXG4gICAgfVxyXG4gICAgY29ubmVjdChjYWxsYmFjazogKC4uLmFyZ3M6IFQpID0+IHZvaWQpIHtcclxuICAgICAgICBjb25zdCBjb25uID0gbmV3IENvbm5lY3Rpb248VD4odGhpcywgY2FsbGJhY2spO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMucHVzaChjb25uKTtcclxuICAgICAgICBpZih0aGlzLm9uQ29ubmVjdCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ29ubmVjdChjb25uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbm47XHJcbiAgICB9XHJcbiAgICBvbmNlKGNhbGxiYWNrOiAoLi4uYXJnczogVCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGNvbnN0IGNvbm4gPSB0aGlzLmNvbm5lY3QoKC4uLmFyZ3M6IFQpID0+IHtcclxuICAgICAgICAgICAgY2FsbGJhY2soLi4uYXJncyk7XHJcbiAgICAgICAgICAgIGNvbm4uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBjb25uO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgd2FpdCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8VD4ocmVzID0+IHtcclxuICAgICAgICAgICAgdGhpcy5vbmNlKCguLi5hcmdzOiBUKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXMoYXJncyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZmlyZSguLi5hcmdzOiBUKSB7XHJcbiAgICAgICAgdGhpcy50aW1lRmlyZWQgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICBmb3IoY29uc3QgY29ubiBvZiBbLi4udGhpcy5jb25uZWN0aW9uc10pIHtcclxuICAgICAgICAgICAgY29ubi5maXJlKC4uLmFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldFRpbWVTaW5jZUZpcmVkKCkge1xyXG4gICAgICAgIHJldHVybiBwZXJmb3JtYW5jZS5ub3coKSAvIDEwMDAgLSB0aGlzLnRpbWVGaXJlZDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvbm5lY3Rpb248VCBleHRlbmRzIGFueVtdPiB7XHJcbiAgICBncm91cHM6IENvbm5lY3Rpb25Hcm91cFtdID0gW107XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc2lnbmFsOiBTaWduYWw8VD4sIHB1YmxpYyBjYWxsYmFjazogKC4uLmFyZ3M6IFQpID0+IHZvaWQpIHtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIGRpc2Nvbm5lY3QoKSB7XHJcbiAgICAgICAgdGhpcy5zaWduYWwuY29ubmVjdGlvbnMuc3BsaWNlKHRoaXMuc2lnbmFsLmNvbm5lY3Rpb25zLmluZGV4T2YodGhpcyksIDEpO1xyXG4gICAgICAgIGZvcihjb25zdCBncm91cCBvZiB0aGlzLmdyb3Vwcykge1xyXG4gICAgICAgICAgICBncm91cC5jb25uZWN0aW9ucy5zcGxpY2UoZ3JvdXAuY29ubmVjdGlvbnMuaW5kZXhPZih0aGlzKSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ3JvdXBzID0gW107XHJcbiAgICB9XHJcbiAgICBmaXJlKC4uLmFyZ3M6IFQpIHtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrKC4uLmFyZ3MpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSHRtbENvbm5lY3Rpb24ge1xyXG4gICAgZ3JvdXBzOiBDb25uZWN0aW9uR3JvdXBbXSA9IFtdO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFdmVudFRhcmdldCwgcHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIGNhbGxiYWNrOiAoZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKHRoaXMubmFtZSwgdGhpcy5jYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBkaXNjb25uZWN0KCkge1xyXG4gICAgICAgIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLm5hbWUsIHRoaXMuY2FsbGJhY2spO1xyXG4gICAgICAgIGZvcihjb25zdCBncm91cCBvZiB0aGlzLmdyb3Vwcykge1xyXG4gICAgICAgICAgICBncm91cC5jb25uZWN0aW9ucy5zcGxpY2UoZ3JvdXAuY29ubmVjdGlvbnMuaW5kZXhPZih0aGlzKSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ3JvdXBzID0gW107XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uR3JvdXAge1xyXG4gICAgY29ubmVjdGlvbnM6IChDb25uZWN0aW9uPGFueT4gfCBIdG1sQ29ubmVjdGlvbilbXSA9IFtdO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG4gICAgYWRkKGNvbm46IENvbm5lY3Rpb248YW55PiB8IEh0bWxDb25uZWN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5wdXNoKGNvbm4pO1xyXG4gICAgfVxyXG4gICAgZGlzY29ubmVjdEFsbCgpIHtcclxuICAgICAgICBmb3IoY29uc3QgY29ubiBvZiBbLi4udGhpcy5jb25uZWN0aW9uc10pIHtcclxuICAgICAgICAgICAgY29ubi5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMgPSBbXTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBXRUJHTDIgU0hBREVSIENMQVNTRVMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBXR0wyQ29tcG9uZW50U2hhZGVyIHtcclxuICAgIHdTaGFkZXI6IFdlYkdMU2hhZGVyO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LCBwdWJsaWMgdHlwZTogXCJ2ZXJ0ZXhcIiB8IFwiZnJhZ21lbnRcIiwgcHVibGljIHNvdXJjZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgd1NoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0eXBlID09IFwidmVydGV4XCIgPyBnbC5WRVJURVhfU0hBREVSIDogZ2wuRlJBR01FTlRfU0hBREVSKTtcclxuICAgICAgICBpZih3U2hhZGVyID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGNyZWF0ZSBzaGFkZXJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMud1NoYWRlciA9IHdTaGFkZXI7XHJcbiAgICAgICAgZ2wuc2hhZGVyU291cmNlKHdTaGFkZXIsIHNvdXJjZSk7XHJcbiAgICAgICAgZ2wuY29tcGlsZVNoYWRlcih3U2hhZGVyKVxyXG4gICAgICAgIGlmKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIod1NoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvZyA9IGdsLmdldFNoYWRlckluZm9Mb2cod1NoYWRlcik7XHJcbiAgICAgICAgICAgIGdsLmRlbGV0ZVNoYWRlcih3U2hhZGVyKTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGNvbXBpbGUgc2hhZGVyOiBcIiArIGxvZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZGVsZXRlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2wuZGVsZXRlU2hhZGVyKHRoaXMud1NoYWRlcik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXR0wyQ29tcG9uZW50UHJvZ3JhbSB7XHJcbiAgICB3UHJvZ3JhbTogV2ViR0xQcm9ncmFtO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LCBwdWJsaWMgY1NoYWRlclY6IFdHTDJDb21wb25lbnRTaGFkZXIsIHB1YmxpYyBjU2hhZGVyRjogV0dMMkNvbXBvbmVudFNoYWRlcikge1xyXG4gICAgICAgIGNvbnN0IHdQcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG4gICAgICAgIGlmICghd1Byb2dyYW0pIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGNyZWF0ZSBwcm9ncmFtXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLndQcm9ncmFtID0gd1Byb2dyYW07XHJcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKHdQcm9ncmFtLCBjU2hhZGVyVi53U2hhZGVyKTtcclxuICAgICAgICBnbC5hdHRhY2hTaGFkZXIod1Byb2dyYW0sIGNTaGFkZXJGLndTaGFkZXIpO1xyXG4gICAgICAgIGdsLmxpbmtQcm9ncmFtKHdQcm9ncmFtKTtcclxuICAgICAgICBpZighZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcih3UHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvZyA9IGdsLmdldFByb2dyYW1JbmZvTG9nKHdQcm9ncmFtKTtcclxuICAgICAgICAgICAgZ2wuZGVsZXRlUHJvZ3JhbSh3UHJvZ3JhbSk7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBsaW5rIHByb2dyYW06IFwiICsgbG9nKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzZXRBY3RpdmUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKHRoaXMud1Byb2dyYW0pO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2wuZGVsZXRlUHJvZ3JhbSh0aGlzLndQcm9ncmFtKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHR5cGUgV0dMMkF0dHJpYnV0ZVR5cGUgPSAoXHJcbiAgICBcImZsb2F0XCIgfCBcImludFwiIHwgXCJ1aW50XCIgfCBcInZlYzJcIiB8IFwidmVjM1wiIHwgXCJ2ZWM0XCJcclxuICAgIHwgXCJpdmVjMlwiIHwgXCJpdmVjM1wiIHwgXCJpdmVjNFwiIHwgXCJ1dmVjMlwiIHwgXCJ1dmVjM1wiIHwgXCJ1dmVjNFwiXHJcbik7XHJcblxyXG5leHBvcnQgdHlwZSBXR0wyVW5pZm9ybVR5cGUgPSAoXHJcbiAgICBcImZsb2F0XCIgfCBcImludFwiIHwgXCJ1aW50XCIgfCBcInZlYzJcIiB8IFwidmVjM1wiXHJcbiAgICB8IFwidmVjNFwiIHwgXCJpdmVjMlwiIHwgXCJpdmVjM1wiIHwgXCJpdmVjNFwiIHwgXCJ1dmVjMlwiXHJcbiAgICB8IFwidXZlYzNcIiB8IFwidXZlYzRcIiB8IFwibWF0MlwiIHwgXCJtYXQzXCIgfCBcIm1hdDRcIlxyXG4pO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJDb21wb25lbnRCdWZmZXIge1xyXG4gICAgd1R5cGU6IEdMZW51bTtcclxuICAgIHdEaW1lbnNpb25zOiBudW1iZXI7XHJcbiAgICB3QnVmZmVyOiBXZWJHTEJ1ZmZlcjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCwgdHlwZTogV0dMMkF0dHJpYnV0ZVR5cGUpIHtcclxuICAgICAgICBjb25zdCBidWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgICAgICBpZighYnVmZmVyKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBjcmVhdGUgYnVmZmVyXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLndCdWZmZXIgPSBidWZmZXI7XHJcbiAgICAgICAgc3dpdGNoKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImZsb2F0XCI6IHRoaXMud1R5cGUgPSBnbC5GTE9BVDsgdGhpcy53RGltZW5zaW9ucyA9IDE7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidmVjMlwiOiB0aGlzLndUeXBlID0gZ2wuRkxPQVQ7IHRoaXMud0RpbWVuc2lvbnMgPSAyOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInZlYzNcIjogdGhpcy53VHlwZSA9IGdsLkZMT0FUOyB0aGlzLndEaW1lbnNpb25zID0gMzsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ2ZWM0XCI6IHRoaXMud1R5cGUgPSBnbC5GTE9BVDsgdGhpcy53RGltZW5zaW9ucyA9IDQ7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaW50XCI6IHRoaXMud1R5cGUgPSBnbC5JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSAxOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIml2ZWMyXCI6IHRoaXMud1R5cGUgPSBnbC5JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSAyOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIml2ZWMzXCI6IHRoaXMud1R5cGUgPSBnbC5JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSAzOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIml2ZWM0XCI6IHRoaXMud1R5cGUgPSBnbC5JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSA0OyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInVpbnRcIjogdGhpcy53VHlwZSA9IGdsLlVOU0lHTkVEX0lOVDsgdGhpcy53RGltZW5zaW9ucyA9IDE7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXZlYzJcIjogdGhpcy53VHlwZSA9IGdsLlVOU0lHTkVEX0lOVDsgdGhpcy53RGltZW5zaW9ucyA9IDI7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXZlYzNcIjogdGhpcy53VHlwZSA9IGdsLlVOU0lHTkVEX0lOVDsgdGhpcy53RGltZW5zaW9ucyA9IDM7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXZlYzRcIjogdGhpcy53VHlwZSA9IGdsLlVOU0lHTkVEX0lOVDsgdGhpcy53RGltZW5zaW9ucyA9IDQ7IGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoXCJVbnN1cHBvcnRlZCBidWZmZXIgdHlwZTogXCIgKyB0eXBlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzZXRBY3RpdmUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLndCdWZmZXIpO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2wuZGVsZXRlQnVmZmVyKHRoaXMud0J1ZmZlcik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXR0wyQ29tcG9uZW50VmFvIHtcclxuICAgIHdWYW86IFdlYkdMVmVydGV4QXJyYXlPYmplY3Q7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpIHtcclxuICAgICAgICB0aGlzLndWYW8gPSBnbC5jcmVhdGVWZXJ0ZXhBcnJheSgpO1xyXG4gICAgfVxyXG4gICAgc2V0QWN0aXZlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZFZlcnRleEFycmF5KHRoaXMud1Zhbyk7XHJcbiAgICB9XHJcbiAgICBlbmFibGVCdWZmZXIoY0J1ZmZlcjogV0dMMkNvbXBvbmVudEJ1ZmZlciwgd0xvY2F0aW9uOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBjQnVmZmVyLnNldEFjdGl2ZSgpO1xyXG4gICAgICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkod0xvY2F0aW9uKTtcclxuICAgICAgICBpZihjQnVmZmVyLndUeXBlID09IHRoaXMuZ2wuRkxPQVQpIHtcclxuICAgICAgICAgICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHdMb2NhdGlvbiwgY0J1ZmZlci53RGltZW5zaW9ucywgY0J1ZmZlci53VHlwZSwgZmFsc2UsIDAsIDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2wudmVydGV4QXR0cmliSVBvaW50ZXIod0xvY2F0aW9uLCBjQnVmZmVyLndEaW1lbnNpb25zLCBjQnVmZmVyLndUeXBlLCAwLCAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBkZWxldGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nbC5kZWxldGVWZXJ0ZXhBcnJheSh0aGlzLndWYW8pO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMkNvbXBvbmVudFVuaWZvcm0ge1xyXG4gICAgd0xvY2F0aW9uOiBXZWJHTFVuaWZvcm1Mb2NhdGlvbjtcclxuICAgIHF1ZXVlZFZhbHVlczogYW55W10gfCBhbnkgfCBudWxsID0gbnVsbDtcclxuICAgIGhhc1F1ZXVlZCA9IGZhbHNlO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LCBjUHJvZ3JhbTogV0dMMkNvbXBvbmVudFByb2dyYW0sIG5hbWU6IHN0cmluZywgcHVibGljIHR5cGU6IFdHTDJVbmlmb3JtVHlwZSkge1xyXG4gICAgICAgIGNvbnN0IHdMb2NhdGlvbiA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKGNQcm9ncmFtLndQcm9ncmFtLCBuYW1lKTtcclxuICAgICAgICBpZih3TG9jYXRpb24gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGdldCB1bmlmb3JtIGxvY2F0aW9uIGZvciBcIiArIG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLndMb2NhdGlvbiA9IHdMb2NhdGlvbjtcclxuICAgIH1cclxuICAgIHNldFZhbHVlcyh2YWx1ZXMgOiBhbnlbXSB8IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHdMb2NhdGlvbiA9IHRoaXMud0xvY2F0aW9uXHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHN3aXRjaCh0aGlzLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImZsb2F0XCI6IGdsLnVuaWZvcm0xZih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidmVjMlwiOiBnbC51bmlmb3JtMmZ2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ2ZWMzXCI6IGdsLnVuaWZvcm0zZnYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInZlYzRcIjogZ2wudW5pZm9ybTRmdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaW50XCI6IGdsLnVuaWZvcm0xaSh3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaXZlYzJcIjogZ2wudW5pZm9ybTJpdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaXZlYzNcIjogZ2wudW5pZm9ybTNpdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaXZlYzRcIjogZ2wudW5pZm9ybTRpdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidWludFwiOiBnbC51bmlmb3JtMXVpKHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1dmVjMlwiOiBnbC51bmlmb3JtMnVpdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXZlYzNcIjogZ2wudW5pZm9ybTN1aXYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInV2ZWM0XCI6IGdsLnVuaWZvcm00dWl2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJtYXQyXCI6IGdsLnVuaWZvcm1NYXRyaXgyZnYod0xvY2F0aW9uLCBmYWxzZSwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJtYXQzXCI6IGdsLnVuaWZvcm1NYXRyaXgzZnYod0xvY2F0aW9uLCBmYWxzZSwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJtYXQ0XCI6IGdsLnVuaWZvcm1NYXRyaXg0ZnYod0xvY2F0aW9uLCBmYWxzZSwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIHVuaWZvcm0gdHlwZTogXCIgKyB0aGlzLnR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHF1ZXVlVmFsdWVzKHZhbHVlczogYW55W10gfCBhbnkpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmhhc1F1ZXVlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5xdWV1ZWRWYWx1ZXMgPSB2YWx1ZXM7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMuaGFzUXVldWVkKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5oYXNRdWV1ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnNldFZhbHVlcyh0aGlzLnF1ZXVlZFZhbHVlcyk7XHJcbiAgICAgICAgdGhpcy5xdWV1ZWRWYWx1ZXMgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMkF0dHJpYnV0ZSB7XHJcbiAgICB3TG9jYXRpb246IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCwgcHVibGljIHdQcm9ncmFtOiBXZWJHTFByb2dyYW0sIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyB0eXBlOiBXR0wyQXR0cmlidXRlVHlwZSkge1xyXG4gICAgICAgIHRoaXMud0xvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24od1Byb2dyYW0sIG5hbWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMlRleHR1cmUyRCB7XHJcbiAgICB3VGV4dHVyZTogV2ViR0xUZXh0dXJlO1xyXG4gICAgdW5pZm9ybTogV0dMMkNvbXBvbmVudFVuaWZvcm07XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc2hhZGVyOiBXR0wyU2hhZGVyLCBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgc2xvdDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy53VGV4dHVyZSA9IHNoYWRlci5nbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgdGhpcy5zZXRBY3RpdmUoKTtcclxuICAgICAgICB0aGlzLnVuaWZvcm0gPSBzaGFkZXIuY3JlYXRlVW5pZm9ybShuYW1lLCBcImludFwiKTtcclxuICAgICAgICB0aGlzLnVuaWZvcm0uc2V0VmFsdWVzKHRoaXMuc2xvdCk7XHJcbiAgICB9XHJcbiAgICBzZXRBY3RpdmUoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgdGhpcy5zbG90KTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0aGlzLndUZXh0dXJlKTtcclxuICAgIH1cclxuICAgIHNldEludGVycG9sYXRpb24oaXNFbmFibGVkOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGlzRW5hYmxlZCA/IGdsLkxJTkVBUiA6IGdsLk5FQVJFU1QpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBpc0VuYWJsZWQgPyBnbC5MSU5FQVIgOiBnbC5ORUFSRVNUKTtcclxuICAgIH1cclxuICAgIHNldFJlcGVhdChpc0VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBpc0VuYWJsZWQgPyBnbC5SRVBFQVQgOiBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBpc0VuYWJsZWQgPyBnbC5SRVBFQVQgOiBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgIH1cclxuICAgIHNldERhdGEod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGRhdGE6IEFycmF5QnVmZmVyVmlldyB8IG51bGwgPSBudWxsKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIHdpZHRoLCBoZWlnaHQsIDAsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIGRhdGEpO1xyXG4gICAgfVxyXG4gICAgc2V0SW1hZ2UoaW1hZ2U6IFRleEltYWdlU291cmNlKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIGltYWdlKTtcclxuICAgIH1cclxuICAgIGdlbmVyYXRlTWlwbWFwKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XHJcbiAgICB9XHJcbiAgICBkZWxldGUoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC5kZWxldGVUZXh0dXJlKHRoaXMud1RleHR1cmUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMlRleHR1cmUzRCB7XHJcbiAgICB3VGV4dHVyZTogV2ViR0xUZXh0dXJlO1xyXG4gICAgdW5pZm9ybTogV0dMMkNvbXBvbmVudFVuaWZvcm07XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc2hhZGVyOiBXR0wyU2hhZGVyLCBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgc2xvdDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy53VGV4dHVyZSA9IHNoYWRlci5nbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgdGhpcy5zZXRBY3RpdmUoKTtcclxuICAgICAgICB0aGlzLnVuaWZvcm0gPSBzaGFkZXIuY3JlYXRlVW5pZm9ybShuYW1lLCBcImludFwiKTtcclxuICAgICAgICB0aGlzLnVuaWZvcm0uc2V0VmFsdWVzKHRoaXMuc2xvdCk7XHJcbiAgICB9XHJcbiAgICBzZXRBY3RpdmUoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgdGhpcy5zbG90KTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzNELCB0aGlzLndUZXh0dXJlKTtcclxuICAgIH1cclxuICAgIHNldEludGVycG9sYXRpb24oaXNFbmFibGVkOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzNELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGlzRW5hYmxlZCA/IGdsLkxJTkVBUiA6IGdsLk5FQVJFU1QpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8zRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBpc0VuYWJsZWQgPyBnbC5MSU5FQVIgOiBnbC5ORUFSRVNUKTtcclxuICAgIH1cclxuICAgIHNldFJlcGVhdChpc0VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfM0QsIGdsLlRFWFRVUkVfV1JBUF9TLCBpc0VuYWJsZWQgPyBnbC5SRVBFQVQgOiBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfM0QsIGdsLlRFWFRVUkVfV1JBUF9ULCBpc0VuYWJsZWQgPyBnbC5SRVBFQVQgOiBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgIH1cclxuICAgIHNldERhdGEod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGRlcHRoOiBudW1iZXIsIGRhdGE6IEFycmF5QnVmZmVyVmlldyB8IG51bGwgPSBudWxsKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC50ZXhJbWFnZTNEKGdsLlRFWFRVUkVfM0QsIDAsIGdsLlJHQkEsIHdpZHRoLCBoZWlnaHQsIGRlcHRoLCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBkYXRhKTtcclxuICAgIH1cclxuICAgIGdlbmVyYXRlTWlwbWFwKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8zRCk7XHJcbiAgICB9XHJcbiAgICBkZWxldGUoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC5kZWxldGVUZXh0dXJlKHRoaXMud1RleHR1cmUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMk9iamVjdCB7XHJcbiAgICBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dDtcclxuICAgIGNWYW86IFdHTDJDb21wb25lbnRWYW87XHJcbiAgICBjQnVmZmVyQnlOYW1lOiB7W2tleTpzdHJpbmddOiBXR0wyQ29tcG9uZW50QnVmZmVyfSA9IHt9O1xyXG4gICAgdmVydGV4Q291bnQ6IG51bWJlciA9IDA7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc2hhZGVyOiBXR0wyU2hhZGVyKSB7XHJcbiAgICAgICAgdGhpcy5nbCA9IHNoYWRlci5nbDtcclxuICAgICAgICB0aGlzLmNWYW8gPSBuZXcgV0dMMkNvbXBvbmVudFZhbyhzaGFkZXIuZ2wpO1xyXG4gICAgICAgIHRoaXMuY1Zhby5zZXRBY3RpdmUoKTtcclxuICAgICAgICBmb3IoY29uc3QgYXR0cmlidXRlIG9mIHNoYWRlci5hdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNCdWYgPSBuZXcgV0dMMkNvbXBvbmVudEJ1ZmZlcihzaGFkZXIuZ2wsIGF0dHJpYnV0ZS50eXBlKTtcclxuICAgICAgICAgICAgY0J1Zi5zZXRBY3RpdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5jVmFvLmVuYWJsZUJ1ZmZlcihjQnVmLCBhdHRyaWJ1dGUud0xvY2F0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5jQnVmZmVyQnlOYW1lW2F0dHJpYnV0ZS5uYW1lXSA9IGNCdWY7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2V0RGF0YShhdHRyaWJ1dGVOYW1lOiBzdHJpbmcsIHZhbHVlczogRmxvYXQzMkFycmF5LCB1c2FnZTogR0xlbnVtID0gdGhpcy5nbC5TVEFUSUNfRFJBVykge1xyXG4gICAgICAgIGNvbnN0IGNCdWYgPSB0aGlzLmNCdWZmZXJCeU5hbWVbYXR0cmlidXRlTmFtZV07XHJcbiAgICAgICAgaWYoY0J1ZiA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkIG5vdCBmaW5kIGF0dHJpYnV0ZSB3aXRoIG5hbWU6IFwiICsgYXR0cmlidXRlTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNCdWYuc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB2YWx1ZXMsIHVzYWdlKTtcclxuICAgICAgICB0aGlzLnZlcnRleENvdW50ID0gdmFsdWVzLmxlbmd0aCAvIGNCdWYud0RpbWVuc2lvbnM7XHJcbiAgICB9XHJcbiAgICBkcmF3VHJpYW5nbGVzKCkge1xyXG4gICAgICAgIHRoaXMuY1Zhby5zZXRBY3RpdmUoKTtcclxuICAgICAgICB0aGlzLmdsLmRyYXdBcnJheXModGhpcy5nbC5UUklBTkdMRVMsIDAsIHRoaXMudmVydGV4Q291bnQpO1xyXG4gICAgfVxyXG4gICAgZHJhd0xpbmVzKCkge1xyXG4gICAgICAgIHRoaXMuY1Zhby5zZXRBY3RpdmUoKTtcclxuICAgICAgICB0aGlzLmdsLmRyYXdBcnJheXModGhpcy5nbC5MSU5FUywgMCwgdGhpcy52ZXJ0ZXhDb3VudCk7XHJcbiAgICB9XHJcbiAgICBkcmF3UG9pbnRzKCkge1xyXG4gICAgICAgIHRoaXMuY1Zhby5zZXRBY3RpdmUoKTtcclxuICAgICAgICB0aGlzLmdsLmRyYXdBcnJheXModGhpcy5nbC5QT0lOVFMsIDAsIHRoaXMudmVydGV4Q291bnQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMlNoYWRlciB7XHJcbiAgICBjUHJvZ3JhbTogV0dMMkNvbXBvbmVudFByb2dyYW07XHJcbiAgICBhdHRyaWJ1dGVzOiBXR0wyQXR0cmlidXRlW10gPSBbXTtcclxuICAgIGNVbmlmb3JtczogV0dMMkNvbXBvbmVudFVuaWZvcm1bXSA9IFtdXHJcbiAgICBjVW5pZm9ybUJ5TmFtZToge1trZXk6c3RyaW5nXTpXR0wyQ29tcG9uZW50VW5pZm9ybX0gPSB7fTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCwgdlNvdXJjZTogc3RyaW5nLCBmU291cmNlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmNQcm9ncmFtID0gbmV3IFdHTDJDb21wb25lbnRQcm9ncmFtKFxyXG4gICAgICAgICAgICBnbCwgbmV3IFdHTDJDb21wb25lbnRTaGFkZXIoZ2wsIFwidmVydGV4XCIsIHZTb3VyY2UpLFxyXG4gICAgICAgICAgICBuZXcgV0dMMkNvbXBvbmVudFNoYWRlcihnbCwgXCJmcmFnbWVudFwiLCBmU291cmNlKSxcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMuY1Byb2dyYW0uc2V0QWN0aXZlKCk7XHJcbiAgICB9XHJcbiAgICBhZGRBdHRyaWJ1dGUobmFtZTogc3RyaW5nLCB0eXBlOiBXR0wyQXR0cmlidXRlVHlwZSkge1xyXG4gICAgICAgIGNvbnN0IGF0dCA9IG5ldyBXR0wyQXR0cmlidXRlKHRoaXMuZ2wsIHRoaXMuY1Byb2dyYW0ud1Byb2dyYW0sIG5hbWUsIHR5cGUpO1xyXG4gICAgICAgIHRoaXMuYXR0cmlidXRlcy5wdXNoKGF0dCk7XHJcbiAgICAgICAgcmV0dXJuIGF0dDtcclxuICAgIH1cclxuICAgIGNyZWF0ZVVuaWZvcm0obmFtZTogc3RyaW5nLCB0eXBlOiBXR0wyVW5pZm9ybVR5cGUpIHtcclxuICAgICAgICBjb25zdCB1bmlmb3JtID0gbmV3IFdHTDJDb21wb25lbnRVbmlmb3JtKHRoaXMuZ2wsIHRoaXMuY1Byb2dyYW0sIG5hbWUsIHR5cGUpO1xyXG4gICAgICAgIHRoaXMuY1VuaWZvcm1zLnB1c2godW5pZm9ybSk7XHJcbiAgICAgICAgdGhpcy5jVW5pZm9ybUJ5TmFtZVtuYW1lXSA9IHVuaWZvcm07XHJcbiAgICAgICAgcmV0dXJuIHVuaWZvcm07XHJcbiAgICB9XHJcbiAgICBnZXRVbmlmb3JtKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNVbmlmb3JtQnlOYW1lW25hbWVdO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlT2JqZWN0KCkge1xyXG4gICAgICAgIGNvbnN0IG9iaiA9IG5ldyBXR0wyT2JqZWN0KHRoaXMpO1xyXG4gICAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVUZXh0dXJlMkQobmFtZTogc3RyaW5nLCBzbG90OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB0ZXh0dXJlID0gbmV3IFdHTDJUZXh0dXJlMkQodGhpcywgbmFtZSwgc2xvdCk7XHJcbiAgICAgICAgcmV0dXJuIHRleHR1cmU7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVUZXh0dXJlM0QobmFtZTogc3RyaW5nLCBzbG90OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB0ZXh0dXJlID0gbmV3IFdHTDJUZXh0dXJlM0QodGhpcywgbmFtZSwgc2xvdCk7XHJcbiAgICAgICAgcmV0dXJuIHRleHR1cmU7XHJcbiAgICB9XHJcbiAgICBzZXRBY3RpdmUoKSB7XHJcbiAgICAgICAgdGhpcy5jUHJvZ3JhbS5zZXRBY3RpdmUoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgVEVYVFVSRSBBVExBUyBDTEFTUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCB0eXBlIEF0bGFzSW1hZ2UgPSB7eDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyLCBpbWc6IEhUTUxJbWFnZUVsZW1lbnQsIG5hbWU6IHN0cmluZ307XHJcblxyXG5leHBvcnQgY2xhc3MgVGV4dHVyZUF0bGFzIHtcclxuICAgIHdpZHRoOiBudW1iZXI7XHJcbiAgICBoZWlnaHQ6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpbWFnZTogSFRNTEltYWdlRWxlbWVudCwgcHVibGljIGJvdW5kczoge1tuYW1lOnN0cmluZ106IEF0bGFzSW1hZ2V9KSB7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IGltYWdlLm5hdHVyYWxXaWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGltYWdlLm5hdHVyYWxIZWlnaHQ7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZnJvbVVybHMoYXJnczogW25hbWU6c3RyaW5nLCB1cmw6c3RyaW5nXVtdLCBwYWRkaW5nID0gMCkge1xyXG4gICAgICAgIGxldCBpbWFnZXM6IEF0bGFzSW1hZ2VbXSA9IFtdO1xyXG4gICAgICAgIGxldCBwcm9taXNlczogUHJvbWlzZTx2b2lkPltdID0gW107XHJcbiAgICAgICAgbGV0IGF0bGFzU2l6ZSA9IDA7XHJcbiAgICAgICAgZm9yKGxldCBbbmFtZSwgdXJsXSBvZiBhcmdzKSB7XHJcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2gobmV3IFByb21pc2U8dm9pZD4oYXN5bmMgcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGE6IEF0bGFzSW1hZ2UgPSB7aW1nLCB4OjAsIHk6MCwgdzppbWcubmF0dXJhbFdpZHRoKzIqcGFkZGluZywgaDppbWcubmF0dXJhbEhlaWdodCsyKnBhZGRpbmcsIG5hbWV9O1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpc0NvbGxpZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCB4PTA7eDw9YXRsYXNTaXplLWRhdGEudzt4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCB5PTA7eTw9YXRsYXNTaXplLWRhdGEuaDt5KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29sbGlkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IG90aGVyIG9mIGltYWdlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHggKyBkYXRhLncgPiBvdGhlci54ICYmIHkgKyBkYXRhLmggPiBvdGhlci55ICYmIHggPCBvdGhlci54ICsgb3RoZXIudyAmJiB5IDwgb3RoZXIueSArIG90aGVyLmgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb2xsaWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighaXNDb2xsaWRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnggPSB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEueSA9IHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWlzQ29sbGlkaW5nKSBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaXNDb2xsaWRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS54ID0gYXRsYXNTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnkgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdGxhc1NpemUgPSBkYXRhLnggKyBkYXRhLnc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlcy5wdXNoKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IHVybDtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XHJcbiAgICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICAgICAgY2FudmFzLndpZHRoID0gYXRsYXNTaXplO1xyXG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBhdGxhc1NpemU7XHJcbiAgICAgICAgbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIikhO1xyXG4gICAgICAgIGxldCBib3VuZHM6IHtbbmFtZTpzdHJpbmddOiBBdGxhc0ltYWdlfSA9IHt9O1xyXG4gICAgICAgIGZvcihsZXQgaW1nIG9mIGltYWdlcykge1xyXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZy5pbWcsIGltZy54ICsgcGFkZGluZywgaW1nLnkgKyBwYWRkaW5nKTtcclxuICAgICAgICAgICAgaWYocGFkZGluZyAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCAwLCAwLCAxLCBpbWcuaC0yKnBhZGRpbmcsIGltZy54LCBpbWcueSArIHBhZGRpbmcsIHBhZGRpbmcsIGltZy5oLTIqcGFkZGluZyk7IC8vIGxlZnRcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgaW1nLnctMipwYWRkaW5nLTEsIDAsIDEsIGltZy5oLTIqcGFkZGluZywgaW1nLngraW1nLnctcGFkZGluZywgaW1nLnkgKyBwYWRkaW5nLCBwYWRkaW5nLCBpbWcuaC0yKnBhZGRpbmcpOyAvLyByaWdodFxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCAwLCAwLCBpbWcudy0yKnBhZGRpbmcsIDEsIGltZy54ICsgcGFkZGluZywgaW1nLnksIGltZy53LTIqcGFkZGluZywgcGFkZGluZyk7IC8vIHRvcFxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCAwLCBpbWcuaC0yKnBhZGRpbmctMSwgaW1nLnctMipwYWRkaW5nLCAxLCBpbWcueCArIHBhZGRpbmcsIGltZy55K2ltZy5oLXBhZGRpbmcsIGltZy53LTIqcGFkZGluZywgcGFkZGluZyk7IC8vIGJvdHRvbVxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCAwLCAwLCAyLCAyLCBpbWcueCwgaW1nLnksIHBhZGRpbmcsIHBhZGRpbmcpOyAvLyB0b3AtbGVmdFxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCBpbWcudy0yKnBhZGRpbmctMiwgMCwgMiwgMiwgaW1nLngraW1nLnctcGFkZGluZywgaW1nLnksIHBhZGRpbmcsIHBhZGRpbmcpOyAvLyB0b3AtcmlnaHRcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgMCwgaW1nLmgtMipwYWRkaW5nLTIsIDIsIDIsIGltZy54LCBpbWcueStpbWcuaC1wYWRkaW5nLCBwYWRkaW5nLCBwYWRkaW5nKTsgLy8gYm90dG9tLWxlZnRcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgaW1nLnctMipwYWRkaW5nLTIsIGltZy5oLTIqcGFkZGluZy0yLCAyLCAyLCBpbWcueCtpbWcudy1wYWRkaW5nLCBpbWcueStpbWcuaC1wYWRkaW5nLCBwYWRkaW5nLCBwYWRkaW5nKTsgLy8gYm90dG9tLXJpZ2h0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW1nLnggPSAoaW1nLnggKyBwYWRkaW5nKSAvIGF0bGFzU2l6ZTtcclxuICAgICAgICAgICAgaW1nLnkgPSAoaW1nLnkgKyBwYWRkaW5nKSAvIGF0bGFzU2l6ZTtcclxuICAgICAgICAgICAgaW1nLncgPSAoaW1nLncgLSAyKnBhZGRpbmcpIC8gYXRsYXNTaXplO1xyXG4gICAgICAgICAgICBpbWcuaCA9IChpbWcuaCAtIDIqcGFkZGluZykgLyBhdGxhc1NpemU7XHJcbiAgICAgICAgICAgIGJvdW5kc1tpbWcubmFtZV0gPSBpbWc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB1cmwgPSBjYW52YXMudG9EYXRhVVJMKCk7XHJcbiAgICAgICAgY29uc3QgYXRsYXNJbWFnZSA9IGF3YWl0IG5ldyBQcm9taXNlPEhUTUxJbWFnZUVsZW1lbnQ+KHJlcyA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlcyhpbWcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGltZy5zcmMgPSB1cmw7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUZXh0dXJlQXRsYXMoYXRsYXNJbWFnZSwgYm91bmRzKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIENPTE9SIENMQVNTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBDb2xvciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpO1xyXG4gICAgY29uc3RydWN0b3IocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcik7XHJcbiAgICBjb25zdHJ1Y3RvcihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyLCBhOiBudW1iZXIpO1xyXG4gICAgY29uc3RydWN0b3IoY29sb3I6IHN0cmluZyB8IENvbG9yKTtcclxuICAgIGNvbnN0cnVjdG9yKGFyZ0E/OiBudW1iZXIgfCBzdHJpbmcgfCBDb2xvciwgYXJnQj86IG51bWJlciwgYXJnQz86IG51bWJlciwgYXJnRD86IG51bWJlcikge1xyXG4gICAgICAgIGlmKHR5cGVvZiBhcmdBID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIGxldCBjb21wID0gYXJnQS5zcGxpdChcIihcIik7XHJcbiAgICAgICAgICAgIGlmKGNvbXAubGVuZ3RoID09IDApXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIGNvbnN0cnVjdG9yOiBFbXB0eSBzdHJpbmdcIik7XHJcbiAgICAgICAgICAgIGlmKGNvbXAubGVuZ3RoIDwgMilcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgY29uc3RydWN0b3I6IFwiICsgY29tcFswXSk7XHJcbiAgICAgICAgICAgIGxldCBjc3RydWN0ID0gY29tcFswXTtcclxuICAgICAgICAgICAgbGV0IGNwYXJhbSA9IGNvbXBbMV0hLnJlcGxhY2UoXCIpXCIsIFwiXCIpO1xyXG4gICAgICAgICAgICBpZihjc3RydWN0ID09PSBcInJnYlwiIHx8IGNzdHJ1Y3QgPT09IFwicmdiYVwiKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FyZ3MgPSBjcGFyYW0uc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYoY2FyZ3MubGVuZ3RoIDwgMyB8fCBjYXJncy5sZW5ndGggPiA0KVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgYXJndW1lbnQgY291bnQ6IFwiICsgY2FyZ3MubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIGxldCByID0gcGFyc2VJbnQoY2FyZ3NbMF0hKTtcclxuICAgICAgICAgICAgICAgIGxldCBnID0gcGFyc2VJbnQoY2FyZ3NbMV0hKTtcclxuICAgICAgICAgICAgICAgIGxldCBiID0gcGFyc2VJbnQoY2FyZ3NbMl0hKTtcclxuICAgICAgICAgICAgICAgIGxldCBhID0gY2FyZ3NbM10gPyBwYXJzZUZsb2F0KGNhcmdzWzNdISkgOiAxO1xyXG4gICAgICAgICAgICAgICAgaWYoaXNOYU4ocikpIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgdmFsdWU6IFwiICsgY2FyZ3NbMF0pO1xyXG4gICAgICAgICAgICAgICAgaWYoaXNOYU4oZykpIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgdmFsdWU6IFwiICsgY2FyZ3NbMV0pO1xyXG4gICAgICAgICAgICAgICAgaWYoaXNOYU4oYikpIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgdmFsdWU6IFwiICsgY2FyZ3NbMl0pO1xyXG4gICAgICAgICAgICAgICAgaWYoaXNOYU4oYSkpIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgdmFsdWU6IFwiICsgY2FyZ3NbM10pO1xyXG4gICAgICAgICAgICAgICAgciA9IEVNYXRoLmNsYW1wKE1hdGgucm91bmQociksIDAsIDI1NSk7XHJcbiAgICAgICAgICAgICAgICBnID0gRU1hdGguY2xhbXAoTWF0aC5yb3VuZChnKSwgMCwgMjU1KTtcclxuICAgICAgICAgICAgICAgIGIgPSBFTWF0aC5jbGFtcChNYXRoLnJvdW5kKGIpLCAwLCAyNTUpO1xyXG4gICAgICAgICAgICAgICAgYSA9IEVNYXRoLmNsYW1wKGEsIDAsIDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fciA9IHI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9nID0gZztcclxuICAgICAgICAgICAgICAgIHRoaXMuX2IgPSBiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hID0gYTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX291dGRhdGVkUmdiID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vdXRkYXRlZEhzdiA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihjc3RydWN0ID09PSBcImhzdlwiIHx8IGNzdHJ1Y3QgPT09IFwiaHN2YVwiKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FyZ3MgPSBjcGFyYW0uc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYoY2FyZ3MubGVuZ3RoIDwgMyB8fCBjYXJncy5sZW5ndGggPiA0KVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgYXJndW1lbnQgY291bnQ6IFwiICsgY2FyZ3MubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIGxldCBoOiBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICBpZihjYXJnc1swXSEuaW5jbHVkZXMoXCJyYWRcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBoID0gcGFyc2VGbG9hdChjYXJnc1swXSEpICogMTgwIC8gTWF0aC5QSTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaCA9IHBhcnNlSW50KGNhcmdzWzBdISk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgcyA9IHBhcnNlSW50KGNhcmdzWzFdISk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdiA9IHBhcnNlSW50KGNhcmdzWzJdISk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYSA9IGNhcmdzWzNdID8gcGFyc2VJbnQoY2FyZ3NbM10hKSA6IDE7XHJcbiAgICAgICAgICAgICAgICBpZihpc05hTihoKSkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciB2YWx1ZTogXCIgKyBjYXJnc1swXSk7XHJcbiAgICAgICAgICAgICAgICBpZihpc05hTihzKSkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciB2YWx1ZTogXCIgKyBjYXJnc1sxXSk7XHJcbiAgICAgICAgICAgICAgICBpZihpc05hTih2KSkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciB2YWx1ZTogXCIgKyBjYXJnc1syXSk7XHJcbiAgICAgICAgICAgICAgICBpZihpc05hTihhKSkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciB2YWx1ZTogXCIgKyBjYXJnc1szXSk7XHJcbiAgICAgICAgICAgICAgICBoID0gRU1hdGgucG1vZChoLCAzNjApO1xyXG4gICAgICAgICAgICAgICAgcyA9IEVNYXRoLmNsYW1wKHMsIDAsIDEwMCk7XHJcbiAgICAgICAgICAgICAgICB2ID0gRU1hdGguY2xhbXAodiwgMCwgMTAwKTtcclxuICAgICAgICAgICAgICAgIGEgPSBFTWF0aC5jbGFtcChhLCAwLCAxKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2h1ZSA9IGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zYXQgPSBzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsID0gdjtcclxuICAgICAgICAgICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vdXRkYXRlZEhzdiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSZ2IgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciBjb25zdHJ1Y3RvcjogXCIgKyBjc3RydWN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZih0eXBlb2YgYXJnQSA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICBpZiAoYXJnQiA9PT0gdW5kZWZpbmVkIHx8IGFyZ0MgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciBjb25zdHJ1Y3RvcjogTm90IGVub3VnaCBhcmd1bWVudHNcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fciA9IEVNYXRoLmNsYW1wKE1hdGgucm91bmQoYXJnQSksIDAsIDI1NSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2cgPSBFTWF0aC5jbGFtcChNYXRoLnJvdW5kKGFyZ0IhKSwgMCwgMjU1KTtcclxuICAgICAgICAgICAgdGhpcy5fYiA9IEVNYXRoLmNsYW1wKE1hdGgucm91bmQoYXJnQyEpLCAwLCAyNTUpO1xyXG4gICAgICAgICAgICB0aGlzLmEgPSBFTWF0aC5jbGFtcChhcmdEID8/IDEsIDAsIDEpO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFJnYiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZEhzdiA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIGlmKGFyZ0EgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yID0gMDtcclxuICAgICAgICAgICAgdGhpcy5fZyA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuX2IgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmEgPSAxO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFJnYiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZEhzdiA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fciA9IGFyZ0EhLnI7XHJcbiAgICAgICAgICAgIHRoaXMuX2cgPSBhcmdBIS5nO1xyXG4gICAgICAgICAgICB0aGlzLl9iID0gYXJnQSEuYjtcclxuICAgICAgICAgICAgdGhpcy5hID0gYXJnQSEuYTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSZ2IgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRIc3YgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbk11dGF0ZT86ICgpID0+IHZvaWQ7XHJcbiAgICBtdXRhdGUoKSB7XHJcbiAgICAgICAgaWYodGhpcy5vbk11dGF0ZSlcclxuICAgICAgICAgICAgdGhpcy5vbk11dGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb25lKCk6IENvbG9yIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBkZWNpbWFsVG9SR0IoZDogbnVtYmVyKSB7XHJcbiAgICAgICAgZCA9IEVNYXRoLmNsYW1wKGQsIDAsIDEtMWUtNik7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gTWF0aC5mbG9vcihkICogMTY3NzcyMTYpO1xyXG4gICAgICAgIGxldCByID0gKGluZGV4ID4+IDE2KSAmIDB4RkY7XHJcbiAgICAgICAgbGV0IGcgPSAoaW5kZXggPj4gOCkgJiAweEZGO1xyXG4gICAgICAgIGxldCBiID0gKGluZGV4KSAmIDB4RkY7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihyLCBnLCBiKTtcclxuICAgIH1cclxuXHJcbiAgICBfb3V0ZGF0ZWRSZ2I/OiBib29sZWFuO1xyXG4gICAgX3IgPSAwO1xyXG4gICAgLyoqXHJcbiAgICAgKiAoaW50KSByZWQgdmFsdWUgb2YgdGhlIGNvbG9yLCAwIC0gMjU1LlxyXG4gICAgKi9cclxuICAgIHNldCByKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB2YWx1ZSA9IEVNYXRoLmNsYW1wKE1hdGgucm91bmQodmFsdWUpLCAwLCAyNTUpO1xyXG4gICAgICAgIGlmKHZhbHVlID09IHRoaXMuX3IpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIHRoaXMuX3IgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZEhzdiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgIH1cclxuICAgIGdldCByKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3I7XHJcbiAgICB9XHJcblxyXG4gICAgX2cgPSAwO1xyXG4gICAgLyoqXHJcbiAgICAgKiAoaW50KSBncmVlbiB2YWx1ZSBvZiB0aGUgY29sb3IsIDAgLSAyNTUuXHJcbiAgICAqL1xyXG4gICAgc2V0IGcodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHZhbHVlID0gRU1hdGguY2xhbXAoTWF0aC5yb3VuZCh2YWx1ZSksIDAsIDI1NSk7XHJcbiAgICAgICAgaWYodmFsdWUgPT0gdGhpcy5fZylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgdGhpcy5fZyA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkSHN2ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IGcoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZ2IoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZztcclxuICAgIH1cclxuICAgIFxyXG4gICAgX2IgPSAwO1xyXG4gICAgLyoqXHJcbiAgICAgKiAoaW50KSBibHVlIHZhbHVlIG9mIHRoZSBjb2xvciwgMCAtIDI1NS5cclxuICAgICovXHJcbiAgICBzZXQgYih2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFsdWUgPSBFTWF0aC5jbGFtcChNYXRoLnJvdW5kKHZhbHVlKSwgMCwgMjU1KTtcclxuICAgICAgICBpZih2YWx1ZSA9PSB0aGlzLl9iKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZ2IoKTtcclxuICAgICAgICB0aGlzLl9iID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRIc3YgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgYigpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9iO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVJnYigpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFJnYiAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgY29uc3Qge19odWU6aCwgX3NhdDpzLCBfdmFsOnZ9ID0gdGhpcztcclxuICAgICAgICBjb25zdCBjID0gdiAvIDEwMCAqIHMgLyAxMDA7XHJcbiAgICAgICAgY29uc3QgeCA9IGMgKiAoMSAtIE1hdGguYWJzKCgoaCAvIDYwKSAlIDIpIC0gMSkpO1xyXG4gICAgICAgIGNvbnN0IG0gPSB2IC8gMTAwIC0gYztcclxuICAgICAgICBsZXQgcnA9MCwgZ3A9MCwgYnA9MDtcclxuICAgICAgICBzd2l0Y2goTWF0aC5mbG9vcihoIC8gNjApKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDogcnA9YzsgZ3A9eDsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMTogcnA9eDsgZ3A9YzsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMjogZ3A9YzsgYnA9eDsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzogZ3A9eDsgYnA9YzsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNDogcnA9eDsgYnA9YzsgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHJwPWM7IGJwPXg7IGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9yID0gTWF0aC5yb3VuZCgocnAgKyBtKSAqIDI1NSk7XHJcbiAgICAgICAgdGhpcy5fZyA9IE1hdGgucm91bmQoKGdwICsgbSkgKiAyNTUpO1xyXG4gICAgICAgIHRoaXMuX2IgPSBNYXRoLnJvdW5kKChicCArIG0pICogMjU1KTtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZFJnYiA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIF9vdXRkYXRlZEhzdj86IGJvb2xlYW47XHJcbiAgICBfaHVlID0gMDtcclxuICAgIC8qKlxyXG4gICAgICogKGRlY2ltYWwpIGh1ZSBvZiB0aGUgY29sb3IgaW4gZGVncmVlcywgMCAtIDM2MC5cclxuICAgICovXHJcbiAgICBzZXQgaHVlKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB2YWx1ZSA9IEVNYXRoLnBtb2QodmFsdWUsIDM2MCk7XHJcbiAgICAgICAgaWYodmFsdWUgPT0gdGhpcy5faHVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy51cGRhdGVIc3YoKTtcclxuICAgICAgICB0aGlzLl9odWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZFJnYiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgIH1cclxuICAgIGdldCBodWUoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVIc3YoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5faHVlO1xyXG4gICAgfVxyXG5cclxuICAgIF9zYXQgPSAwO1xyXG4gICAgLyoqXHJcbiAgICAgKiAoZGVjaW1hbCkgc2F0dXJhdGlvbiBvZiB0aGUgY29sb3IsIDAgLSAxMDAuXHJcbiAgICAqL1xyXG4gICAgc2V0IHNhdCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFsdWUgPSBFTWF0aC5jbGFtcCh2YWx1ZSwgMCwgMTAwKTtcclxuICAgICAgICBpZih2YWx1ZSA9PSB0aGlzLl9zYXQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnVwZGF0ZUhzdigpO1xyXG4gICAgICAgIHRoaXMuX3NhdCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkUmdiID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IHNhdCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUhzdigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zYXQ7XHJcbiAgICB9XHJcblxyXG4gICAgX3ZhbCA9IDA7XHJcbiAgICAvKipcclxuICAgICAqIChkZWNpbWFsKSB2YWx1ZS9icmlnaHRuZXNzIG9mIHRoZSBjb2xvciwgMCAtIDEwMC5cclxuICAgICovXHJcbiAgICBzZXQgdmFsKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB2YWx1ZSA9IEVNYXRoLmNsYW1wKHZhbHVlLCAwLCAxMDApO1xyXG4gICAgICAgIGlmKHZhbHVlID09IHRoaXMuX3ZhbClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudXBkYXRlSHN2KCk7XHJcbiAgICAgICAgdGhpcy5fdmFsID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSZ2IgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgdmFsKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlSHN2KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbDtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVIc3YoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRIc3YgIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KHRoaXMuciwgdGhpcy5nLCB0aGlzLmIpO1xyXG4gICAgICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKHRoaXMuciwgdGhpcy5nLCB0aGlzLmIpO1xyXG4gICAgICAgIGNvbnN0IGRlbHRhID0gbWF4IC0gbWluO1xyXG4gICAgICAgIGxldCBoID0gMDtcclxuICAgICAgICBpZihkZWx0YSAhPT0gMCkge1xyXG4gICAgICAgICAgICBpZihtYXggPT09IHRoaXMucikgaCA9IDYwICogKCgodGhpcy5nIC0gdGhpcy5iKSAvIGRlbHRhICsgNikgJSA2KTtcclxuICAgICAgICAgICAgZWxzZSBpZihtYXggPT09IHRoaXMuZykgaCA9IDYwICogKCh0aGlzLmIgLSB0aGlzLnIpIC8gZGVsdGEgKyAyKTtcclxuICAgICAgICAgICAgZWxzZSBoID0gNjAgKiAoKHRoaXMuciAtIHRoaXMuZykgLyBkZWx0YSArIDQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihoIDwgMCkgaCArPSAzNjA7XHJcbiAgICAgICAgY29uc3QgcyA9IG1heCA9PT0gMCA/IDAgOiBkZWx0YS9tYXgqMTAwO1xyXG4gICAgICAgIGNvbnN0IHYgPSBtYXgvMjU1KjEwMDtcclxuICAgICAgICB0aGlzLl9odWUgPSBoO1xyXG4gICAgICAgIHRoaXMuX3NhdCA9IHM7XHJcbiAgICAgICAgdGhpcy5fdmFsID0gdjtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZEhzdiA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogKGRlY2ltYWwpIGFscGhhL29wYWNpdHkgb2YgdGhlIGNvbG9yLCAwIC0gMS5cclxuICAgICovXHJcbiAgICBhID0gMTtcclxuXHJcbiAgICBzdHJpY3RFcXVhbHMob3RoZXI6IENvbG9yKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZ2IoKTtcclxuICAgICAgICBvdGhlci51cGRhdGVSZ2IoKTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICB0aGlzLl9yID09IG90aGVyLl9yXHJcbiAgICAgICAgICAgICYmIHRoaXMuX2cgPT0gb3RoZXIuX2dcclxuICAgICAgICAgICAgJiYgdGhpcy5fYiA9PSBvdGhlci5fYlxyXG4gICAgICAgICAgICAmJiB0aGlzLmEgPT0gb3RoZXIuYVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBpc0Nsb3NlKG90aGVyOiBDb2xvciwgZSA9IDFlLTYpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIG90aGVyLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIEVNYXRoLmlzQ2xvc2UodGhpcy5fciwgb3RoZXIuX3IsIGUpXHJcbiAgICAgICAgICAgICYmIEVNYXRoLmlzQ2xvc2UodGhpcy5fZywgb3RoZXIuX2csIGUpXHJcbiAgICAgICAgICAgICYmIEVNYXRoLmlzQ2xvc2UodGhpcy5fYiwgb3RoZXIuX2IsIGUpXHJcbiAgICAgICAgICAgICYmIEVNYXRoLmlzQ2xvc2UodGhpcy5hLCBvdGhlci5hLCBlKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBzdHJpY3RFcXVhbHNSZ2Iob3RoZXI6IENvbG9yKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZ2IoKTtcclxuICAgICAgICBvdGhlci51cGRhdGVSZ2IoKTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICB0aGlzLl9yID09IG90aGVyLl9yXHJcbiAgICAgICAgICAgICYmIHRoaXMuX2cgPT0gb3RoZXIuX2dcclxuICAgICAgICAgICAgJiYgdGhpcy5fYiA9PSBvdGhlci5fYlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBpc0Nsb3NlUmdiKG90aGVyOiBDb2xvciwgZSA9IDFlLTYpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIG90aGVyLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIEVNYXRoLmlzQ2xvc2UodGhpcy5fciwgb3RoZXIuX3IsIGUpXHJcbiAgICAgICAgICAgICYmIEVNYXRoLmlzQ2xvc2UodGhpcy5fZywgb3RoZXIuX2csIGUpXHJcbiAgICAgICAgICAgICYmIEVNYXRoLmlzQ2xvc2UodGhpcy5fYiwgb3RoZXIuX2IsIGUpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIGxlcnBSZ2JhKG90aGVyOiBDb2xvciwgdDogbnVtYmVyKTogQ29sb3Ige1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubGVycFJnYmFTZWxmKG90aGVyLCB0KTtcclxuICAgIH1cclxuICAgIGxlcnBSZ2JhU2VsZihvdGhlcjogQ29sb3IsIHQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgb3RoZXIudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgdGhpcy5fciA9IEVNYXRoLmxlcnAodGhpcy5fciwgb3RoZXIuX3IsIHQpO1xyXG4gICAgICAgIHRoaXMuX2cgPSBFTWF0aC5sZXJwKHRoaXMuX2csIG90aGVyLl9nLCB0KTtcclxuICAgICAgICB0aGlzLl9iID0gRU1hdGgubGVycCh0aGlzLl9iLCBvdGhlci5fYiwgdCk7XHJcbiAgICAgICAgdGhpcy5hID0gRU1hdGgubGVycCh0aGlzLmEsIG90aGVyLmEsIHQpO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBsZXJwSHN2YShvdGhlcjogQ29sb3IsIHQ6IG51bWJlcik6IENvbG9yIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxlcnBIc3ZhU2VsZihvdGhlciwgdCk7XHJcbiAgICB9XHJcbiAgICBsZXJwSHN2YVNlbGYob3RoZXI6IENvbG9yLCB0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUhzdigpO1xyXG4gICAgICAgIG90aGVyLnVwZGF0ZUhzdigpO1xyXG4gICAgICAgIHRoaXMuX2h1ZSA9IEVNYXRoLmxlcnAodGhpcy5faHVlLCBvdGhlci5faHVlLCB0KTtcclxuICAgICAgICB0aGlzLl9zYXQgPSBFTWF0aC5sZXJwKHRoaXMuX3NhdCwgb3RoZXIuX3NhdCwgdCk7XHJcbiAgICAgICAgdGhpcy5fdmFsID0gRU1hdGgubGVycCh0aGlzLl92YWwsIG90aGVyLl92YWwsIHQpO1xyXG4gICAgICAgIHRoaXMuYSA9IEVNYXRoLmxlcnAodGhpcy5hLCBvdGhlci5hLCB0KTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZ2V0SXNGb3JlZ3JvdW5kV2hpdGUodGhyZXNob2xkID0gMC40Mikge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgbGV0IHtfcjpyLCBfZzpnLCBfYjpifSA9IHRoaXM7XHJcbiAgICAgICAgciAvPSAyNTU7XHJcbiAgICAgICAgZyAvPSAyNTU7XHJcbiAgICAgICAgYiAvPSAyNTU7XHJcbiAgICAgICAgciA9IChyIDwgMC4wMzkyOCkgPyAociAvIDEyLjkyKSA6ICgoKHIgKyAwLjA1NSkgLyAxLjA1NSkgKiogMi40KVxyXG4gICAgICAgIGcgPSAoZyA8IDAuMDM5MjgpID8gKGcgLyAxMi45MikgOiAoKChnICsgMC4wNTUpIC8gMS4wNTUpICoqIDIuNClcclxuICAgICAgICBiID0gKGIgPCAwLjAzOTI4KSA/IChiIC8gMTIuOTIpIDogKCgoYiArIDAuMDU1KSAvIDEuMDU1KSAqKiAyLjQpXHJcbiAgICAgICAgbGV0IGwgPSAwLjIxMjYgKiByICsgMC43MTUyICogZyArIDAuMDcyMiAqIGJcclxuICAgICAgICByZXR1cm4gbCA8IHRocmVzaG9sZDtcclxuICAgIH1cclxuICAgIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGByZ2JhKCR7dGhpcy5yfSwgJHt0aGlzLmd9LCAke3RoaXMuYn0sICR7dGhpcy5hfSlgO1xyXG4gICAgfVxyXG4gICAgdG9SZ2JhQXJyYXkoKTogW3I6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIsIGE6IG51bWJlcl0ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy5yLCB0aGlzLmcsIHRoaXMuYiwgdGhpcy5hXTtcclxuICAgIH1cclxuICAgIHRvSHN2YUFycmF5KCk6IFtoOiBudW1iZXIsIHM6IG51bWJlciwgdjogbnVtYmVyLCBhOiBudW1iZXJdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMuaHVlLCB0aGlzLnNhdCwgdGhpcy52YWwsIHRoaXMuYV07XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIElOUFVUIENMQVNTRVMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgS2V5cHJlc3NlcyB7XHJcbiAgICBzdGF0aWMga2V5UHJlc3NlZDoge1trZXk6c3RyaW5nXTogYW55fSA9IHt9O1xyXG4gICAgc3RhdGljIHByZXNzZWRLZXlzOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKTtcclxuICAgIHN0YXRpYyBrZXlEb3duRXZlbnQgPSBuZXcgU2lnbmFsPFtrZXlOYW1lOnN0cmluZ10+KCk7XHJcbiAgICBzdGF0aWMga2V5VXBFdmVudCA9IG5ldyBTaWduYWw8W2tleU5hbWU6c3RyaW5nXT4oKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGtleWRvd24oa2V5OiBzdHJpbmcpIHtcclxuICAgIEtleXByZXNzZXMua2V5UHJlc3NlZFtrZXldID0gdHJ1ZTtcclxuICAgIEtleXByZXNzZXMucHJlc3NlZEtleXMuYWRkKGtleSk7XHJcbiAgICBLZXlwcmVzc2VzLmtleURvd25FdmVudC5maXJlKGtleSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBrZXl1cChrZXk6IHN0cmluZykge1xyXG4gICAgZGVsZXRlIEtleXByZXNzZXMua2V5UHJlc3NlZFtrZXldO1xyXG4gICAgS2V5cHJlc3Nlcy5wcmVzc2VkS2V5cy5kZWxldGUoa2V5KTtcclxuICAgIEtleXByZXNzZXMua2V5VXBFdmVudC5maXJlKGtleSk7XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlID0+IHtcclxuICAgIGNvbnN0IGtleSA9IGUua2V5LnRvTG93ZXJDYXNlKCk7XHJcbiAgICBrZXlkb3duKGtleSk7XHJcbn0pO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBlID0+IHtcclxuICAgIGNvbnN0IGtleSA9IGUua2V5LnRvTG93ZXJDYXNlKCk7XHJcbiAgICBrZXl1cChrZXkpO1xyXG59KTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGUgPT4ge1xyXG4gICAgaWYoZS5idXR0b24gPT09IDApIHtcclxuICAgICAgICBrZXlkb3duKFwibG1iXCIpO1xyXG4gICAgfSBlbHNlIGlmKGUuYnV0dG9uID09PSAxKSB7XHJcbiAgICAgICAga2V5ZG93bihcIm1tYlwiKTtcclxuICAgIH0gZWxzZSBpZihlLmJ1dHRvbiA9PT0gMikge1xyXG4gICAgICAgIGtleWRvd24oXCJybWJcIik7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGUgPT4ge1xyXG4gICAgaWYoZS5idXR0b24gPT09IDApIHtcclxuICAgICAgICBrZXl1cChcImxtYlwiKTtcclxuICAgIH0gZWxzZSBpZihlLmJ1dHRvbiA9PT0gMSkge1xyXG4gICAgICAgIGtleXVwKFwibW1iXCIpO1xyXG4gICAgfSBlbHNlIGlmKGUuYnV0dG9uID09PSAyKSB7XHJcbiAgICAgICAga2V5dXAoXCJybWJcIik7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBvaW50ZXJMb2NrIHtcclxuICAgIGNvbm5lY3Rpb25zID0gbmV3IENvbm5lY3Rpb25Hcm91cCgpO1xyXG4gICAgcG9pbnRlckxvY2tDaGFuZ2VFdmVudDogU2lnbmFsPFtpc0xvY2tlZDogYm9vbGVhbl0+ID0gbmV3IFNpZ25hbCgpO1xyXG4gICAgbG9ja2VkTW91c2VNb3ZlRXZlbnQ6IFNpZ25hbDxbZHg6IG51bWJlciwgZHk6IG51bWJlcl0+ID0gbmV3IFNpZ25hbCgpO1xyXG4gICAgaXNFbmFibGVkID0gZmFsc2U7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmFkZChuZXcgSHRtbENvbm5lY3Rpb24od2luZG93LCBcIm1vdXNlZG93blwiLCAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZih0aGlzLmlzRW5hYmxlZCAmJiBkb2N1bWVudC5wb2ludGVyTG9ja0VsZW1lbnQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZXF1ZXN0UG9pbnRlckxvY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmFkZChuZXcgSHRtbENvbm5lY3Rpb24od2luZG93LCBcIm1vdXNlbW92ZVwiLCAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZihkb2N1bWVudC5wb2ludGVyTG9ja0VsZW1lbnQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRoaXMubG9ja2VkTW91c2VNb3ZlRXZlbnQuZmlyZShlLm1vdmVtZW50WCwgZS5tb3ZlbWVudFkpO1xyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmFkZChuZXcgSHRtbENvbm5lY3Rpb24oZG9jdW1lbnQsIFwicG9pbnRlcmxvY2tjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBvaW50ZXJMb2NrQ2hhbmdlRXZlbnQuZmlyZShkb2N1bWVudC5wb2ludGVyTG9ja0VsZW1lbnQgIT0gbnVsbCk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG4gICAgbG9jaygpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLmlzRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZXF1ZXN0UG9pbnRlckxvY2soKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHVubG9jaygpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLmlzRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIGRvY3VtZW50LmV4aXRQb2ludGVyTG9jaygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmVtb3ZlKCkge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMuZGlzY29ubmVjdEFsbCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBPQlNFUlZFUiBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGNsYXNzIFdpbmRvd1Jlc2l6ZU9ic2VydmVyIHtcclxuICAgIHJlc2l6ZUV2ZW50OiBTaWduYWw8W3c6IG51bWJlciwgaDogbnVtYmVyXT4gPSBuZXcgU2lnbmFsKHtcclxuICAgICAgICBvbkNvbm5lY3Q6IGNvbm4gPT4gY29ubi5maXJlKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpLFxyXG4gICAgfSk7XHJcbiAgICBjb25uZWN0aW9ucyA9IG5ldyBDb25uZWN0aW9uR3JvdXAoKTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMuYWRkKG5ldyBIdG1sQ29ubmVjdGlvbih3aW5kb3csIFwicmVzaXplXCIsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZXNpemVFdmVudC5maXJlKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuICAgIHJlbW92ZSgpIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmRpc2Nvbm5lY3RBbGwoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIFJFTkRFUiBMT09QIENMQVNTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBSZW5kZXJMb29wIHtcclxuICAgIHJlbmRlclN0ZXBwZWRFdmVudDogU2lnbmFsPFtkdDogbnVtYmVyXT4gPSBuZXcgU2lnbmFsKCk7XHJcbiAgICBydW5JbmRleCA9IDA7XHJcbiAgICBpc1J1bm5pbmcgPSBmYWxzZTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBjYWxsYmFjazogKGR0OiBudW1iZXIpID0+IHZvaWQpIHtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMuaXNSdW5uaW5nKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucnVuSW5kZXgrKztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIGlmKHRoaXMuaXNSdW5uaW5nKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB0aGlzLmlzUnVubmluZyA9IHRydWU7XHJcbiAgICAgICAgbGV0IHJpID0gdGhpcy5ydW5JbmRleDtcclxuICAgICAgICBsZXQgZnJhbWVUaW1lID0gcGVyZm9ybWFuY2Uubm93KCkvMTAwMDtcclxuICAgICAgICBjb25zdCByZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMucnVuSW5kZXggIT0gcmkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgbm93ID0gcGVyZm9ybWFuY2Uubm93KCkvMTAwMDtcclxuICAgICAgICAgICAgbGV0IGR0ID0gbm93IC0gZnJhbWVUaW1lO1xyXG4gICAgICAgICAgICBmcmFtZVRpbWUgPSBub3c7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyU3RlcHBlZEV2ZW50LmZpcmUoZHQpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrKGR0KTtcclxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlbmRlcigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vL1xyXG4vLyAgQUkgIC8vXHJcbi8vLy8vLy8vLy9cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIExheWVyQWN0aXZhdGlvbiB7XHJcbiAgICBhYnN0cmFjdCBmb3J3YXJkKHo6IG51bWJlcik6IG51bWJlcjtcclxuICAgIGFic3RyYWN0IGRlcml2YXRpdmUoYTogbnVtYmVyLCB6OiBudW1iZXIpOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTaWdtb2lkQWN0aXZhdGlvbiBleHRlbmRzIExheWVyQWN0aXZhdGlvbiB7XHJcbiAgICBmb3J3YXJkKHo6IG51bWJlcikgeyByZXR1cm4gMS8oMStNYXRoLmV4cCgteikpOyB9XHJcbiAgICBkZXJpdmF0aXZlKGE6IG51bWJlciwgejogbnVtYmVyKSB7IHJldHVybiBhICogKDEgLSBhKTsgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmVMdUFjdGl2YXRpb24gZXh0ZW5kcyBMYXllckFjdGl2YXRpb24ge1xyXG4gICAgZm9yd2FyZCh6OiBudW1iZXIpIHsgcmV0dXJuIE1hdGgubWF4KHosIDApOyB9XHJcbiAgICBkZXJpdmF0aXZlKGE6IG51bWJlciwgejogbnVtYmVyKSB7IHJldHVybiB6ID4gMCA/IDEgOiAwOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMaW5lYXJBY3RpdmF0aW9uIGV4dGVuZHMgTGF5ZXJBY3RpdmF0aW9uIHtcclxuICAgIGZvcndhcmQoejogbnVtYmVyKSB7IHJldHVybiB6OyB9XHJcbiAgICBkZXJpdmF0aXZlKGE6IG51bWJlciwgejogbnVtYmVyKSB7IHJldHVybiAxOyB9XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIExheWVyIHtcclxuICAgIHZhbHVlczogRmxvYXQzMkFycmF5O1xyXG4gICAgd2VpZ2h0czogRmxvYXQzMkFycmF5W107XHJcbiAgICBiaWFzZXM6IEZsb2F0MzJBcnJheTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpbnB1dFNpemU6IG51bWJlciwgcHVibGljIHNpemU6IG51bWJlciwgcHVibGljIGFjdGl2YXRpb246IExheWVyQWN0aXZhdGlvbikge1xyXG4gICAgICAgIHRoaXMudmFsdWVzID0gbmV3IEZsb2F0MzJBcnJheShzaXplKTtcclxuICAgICAgICB0aGlzLndlaWdodHMgPSBbXTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxzaXplOyBpKyspXHJcbiAgICAgICAgICAgIHRoaXMud2VpZ2h0cy5wdXNoKG5ldyBGbG9hdDMyQXJyYXkoaW5wdXRTaXplKSk7XHJcbiAgICAgICAgdGhpcy5iaWFzZXMgPSBuZXcgRmxvYXQzMkFycmF5KHNpemUpO1xyXG4gICAgfVxyXG4gICAgZm9yd2FyZChpbnB1dDogRmxvYXQzMkFycmF5KSB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5zaXplOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHdlaWdodGVkU3VtID0gdGhpcy5iaWFzZXNbaV0hO1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDsgajx0aGlzLmlucHV0U2l6ZTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB3ZWlnaHRlZFN1bSArPSBpbnB1dFtqXSEgKiB0aGlzLndlaWdodHNbaV0hW2pdITtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLmFjdGl2YXRpb24uZm9yd2FyZCh3ZWlnaHRlZFN1bSk7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVzW2ldID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYmFja3dhcmQob3V0cHV0OiBGbG9hdDMyQXJyYXkpIHtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIElDT04gR0VORVJBVE9SIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgY2xhc3MgSWNvblBvbHlnb24yRCB7XHJcbiAgICBwb3NpdGlvbnM6IG51bWJlcltdID0gW107XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcbiAgICBjbG9uZSgpOiBJY29uUG9seWdvbjJEIHtcclxuICAgICAgICBsZXQgcG9seSA9IG5ldyBJY29uUG9seWdvbjJEKCk7XHJcbiAgICAgICAgcG9seS5wb3NpdGlvbnMucHVzaCguLi50aGlzLnBvc2l0aW9ucyk7XHJcbiAgICAgICAgcmV0dXJuIHBvbHk7XHJcbiAgICB9XHJcbiAgICBnZXRDZW50ZXJPZk1hc3MoKTogVmVjMiB7XHJcbiAgICAgICAgbGV0IGMgPSBWZWMyLnplcm8oKTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTIpXHJcbiAgICAgICAgICAgIGMuYWRkU2VsZkModGhpcy5wb3NpdGlvbnNbaV0hLCB0aGlzLnBvc2l0aW9uc1tpKzFdISk7XHJcbiAgICAgICAgaWYodGhpcy5wb3NpdGlvbnMubGVuZ3RoID4gMCkgYy5kaXZTZWxmRih0aGlzLnBvc2l0aW9ucy5sZW5ndGgvMik7XHJcbiAgICAgICAgcmV0dXJuIGM7XHJcbiAgICB9XHJcbiAgICByb3RhdGVTZWxmKGE6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mikge1xyXG4gICAgICAgICAgICBsZXQgdiA9IG5ldyBWZWMyKHRoaXMucG9zaXRpb25zW2ldISwgdGhpcy5wb3NpdGlvbnNbaSsxXSEpLnJvdGF0ZVNlbGYoYSk7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2ldID0gdi54O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzFdID0gdi55O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHNjYWxlU2VsZih2OiBWZWMyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbGVTZWxmQyh2LngsIHYueSk7XHJcbiAgICB9XHJcbiAgICBzY2FsZVNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5wb3NpdGlvbnMubGVuZ3RoOyBpKz0yKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2ldISAqPSB4O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzFdISAqPSB5O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHRyYW5zbGF0ZVNlbGYodjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZVNlbGZDKHYueCwgdi55KTtcclxuICAgIH1cclxuICAgIHRyYW5zbGF0ZVNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5wb3NpdGlvbnMubGVuZ3RoOyBpKz0yKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2ldISArPSB4O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzFdISArPSB5O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGdldFZlcnRleChpbmRleDogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgY29uc3QgaiA9IEVNYXRoLnBtb2QoaW5kZXgsIE1hdGguZmxvb3IodGhpcy5wb3NpdGlvbnMubGVuZ3RoLzIpKSoyO1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnBvc2l0aW9uc1tqXSEsIHRoaXMucG9zaXRpb25zW2orMV0hKTtcclxuICAgIH1cclxuICAgIGJldmVsU2VsZihpbmRpY2VzOiBTZXQ8bnVtYmVyPiB8IG51bWJlcltdLCBhbW91bnQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGlmKCEoaW5kaWNlcyBpbnN0YW5jZW9mIFNldCkpXHJcbiAgICAgICAgICAgIGluZGljZXMgPSBuZXcgU2V0KGluZGljZXMpO1xyXG4gICAgICAgIGxldCBuZXdQb3NpdGlvbnM6IG51bWJlcltdID0gW107XHJcbiAgICAgICAgbGV0IGxlbiA9IE1hdGguZmxvb3IodGhpcy5wb3NpdGlvbnMubGVuZ3RoLzIpO1xyXG4gICAgICAgIGZvcihsZXQgaW5kZXg9MDsgaW5kZXg8bGVuOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgIGlmKCFpbmRpY2VzLmhhcyhpbmRleCkpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgbGV0IHZBID0gdGhpcy5nZXRWZXJ0ZXgoaW5kZXgtMSk7XHJcbiAgICAgICAgICAgIGxldCB2QiA9IHRoaXMuZ2V0VmVydGV4KGluZGV4KTtcclxuICAgICAgICAgICAgbGV0IHZDID0gdGhpcy5nZXRWZXJ0ZXgoaW5kZXgrMSk7XHJcbiAgICAgICAgICAgIGxldCB0TWF4QSA9IHZBLmRpc3RUbyh2Qik7XHJcbiAgICAgICAgICAgIGxldCB0TWF4QyA9IHZDLmRpc3RUbyh2Qik7XHJcbiAgICAgICAgICAgIGlmKGluZGljZXMuaGFzKGluZGV4LTEpKSB0TWF4QSAvPSAyO1xyXG4gICAgICAgICAgICBpZihpbmRpY2VzLmhhcyhpbmRleCsxKSkgdE1heEMgLz0gMjtcclxuICAgICAgICAgICAgbGV0IGIxID0gdkIuYWRkU2NhbGVkKHZCLmxvb2sodkEpLCBFTWF0aC5jbGFtcChhbW91bnQsIDAsIHRNYXhBKSk7XHJcbiAgICAgICAgICAgIGxldCBiMiA9IHZCLmFkZFNjYWxlZCh2Qi5sb29rKHZDKSwgRU1hdGguY2xhbXAoYW1vdW50LCAwLCB0TWF4QykpO1xyXG4gICAgICAgICAgICBuZXdQb3NpdGlvbnMucHVzaChiMS54LCBiMS55LCBiMi54LCBiMi55KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbnMgPSBuZXdQb3NpdGlvbnM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBiZXZlbEFsbFNlbGYoYW1vdW50OiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgbmV3UG9zaXRpb25zOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgIGxldCBsZW4gPSBNYXRoLmZsb29yKHRoaXMucG9zaXRpb25zLmxlbmd0aC8yKTtcclxuICAgICAgICBmb3IobGV0IGluZGV4PTA7IGluZGV4PGxlbjsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICBsZXQgdkEgPSB0aGlzLmdldFZlcnRleChpbmRleC0xKTtcclxuICAgICAgICAgICAgbGV0IHZCID0gdGhpcy5nZXRWZXJ0ZXgoaW5kZXgpO1xyXG4gICAgICAgICAgICBsZXQgdkMgPSB0aGlzLmdldFZlcnRleChpbmRleCsxKTtcclxuICAgICAgICAgICAgbGV0IHRNYXhBID0gdkEuZGlzdFRvKHZCKSAvIDI7XHJcbiAgICAgICAgICAgIGxldCB0TWF4QyA9IHZDLmRpc3RUbyh2QikgLyAyO1xyXG4gICAgICAgICAgICBsZXQgYjEgPSB2Qi5hZGRTY2FsZWQodkIubG9vayh2QSksIEVNYXRoLmNsYW1wKGFtb3VudCwgMCwgdE1heEEpKTtcclxuICAgICAgICAgICAgbGV0IGIyID0gdkIuYWRkU2NhbGVkKHZCLmxvb2sodkMpLCBFTWF0aC5jbGFtcChhbW91bnQsIDAsIHRNYXhDKSk7XHJcbiAgICAgICAgICAgIG5ld1Bvc2l0aW9ucy5wdXNoKGIxLngsIGIxLnksIGIyLngsIGIyLnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBvc2l0aW9ucyA9IG5ld1Bvc2l0aW9ucztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGRyYXdGaWxsKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBjb2xvcjogc3RyaW5nKTogdGhpcyB7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKHRoaXMucG9zaXRpb25zWzBdISAqIGN0eC5jYW52YXMud2lkdGgsIHRoaXMucG9zaXRpb25zWzFdISAqIGN0eC5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICBmb3IobGV0IGk9MjsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTIpIHtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh0aGlzLnBvc2l0aW9uc1tpXSEgKiBjdHguY2FudmFzLndpZHRoLCB0aGlzLnBvc2l0aW9uc1tpKzFdISAqIGN0eC5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgY3JlYXRlUG9zaXRpb25zKHBvc2l0aW9uczogbnVtYmVyW10pOiBJY29uUG9seWdvbjJEIHtcclxuICAgICAgICBjb25zdCBwb2x5ID0gbmV3IEljb25Qb2x5Z29uMkQoKTtcclxuICAgICAgICBwb2x5LnBvc2l0aW9ucyA9IHBvc2l0aW9ucztcclxuICAgICAgICByZXR1cm4gcG9seTtcclxuICAgIH1cclxuICAgIHN0YXRpYyByZWN0KHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcik6IEljb25Qb2x5Z29uMkQge1xyXG4gICAgICAgIGNvbnN0IHgwID0geCAtIHcvMjtcclxuICAgICAgICBjb25zdCB4MSA9IHggKyB3LzI7XHJcbiAgICAgICAgY29uc3QgeTAgPSB5IC0gaC8yO1xyXG4gICAgICAgIGNvbnN0IHkxID0geSArIGgvMjtcclxuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVQb3NpdGlvbnMoW3gwLHkwLCB4MSx5MCwgeDEseTEsIHgwLHkxXSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgY2lyY2xlKHg6IG51bWJlciwgeTogbnVtYmVyLCByOiBudW1iZXIsIGFyYzogbnVtYmVyID0gTWF0aC5QSSAqIDIsIHN0ZXAgPSBNYXRoLlBJIC8gOCk6IEljb25Qb2x5Z29uMkQge1xyXG4gICAgICAgIGFyYyA9IEVNYXRoLmNsYW1wKGFyYywgMCwgTWF0aC5QSSAqIDIpO1xyXG4gICAgICAgIGxldCBwb3NpdGlvbnM6IG51bWJlcltdID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8YXJjOyBpKz1zdGVwKSB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9ucy5wdXNoKE1hdGguY29zKGkpICogciArIHgsIE1hdGguc2luKGkpICogciArIHkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwb3NpdGlvbnMucHVzaChNYXRoLmNvcyhhcmMpICogciArIHgsIE1hdGguc2luKGFyYykgKiByICsgeSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlUG9zaXRpb25zKHBvc2l0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgY2lyY2xlRmFuKHg6IG51bWJlciwgeTogbnVtYmVyLCByOiBudW1iZXIsIGFyYzogbnVtYmVyID0gTWF0aC5QSSAqIDIsIHN0ZXAgPSBNYXRoLlBJIC8gOCk6IEljb25Qb2x5Z29uMkQge1xyXG4gICAgICAgIGNvbnN0IHBvbHkgPSB0aGlzLmNpcmNsZSh4LCB5LCByLCBhcmMsIHN0ZXApO1xyXG4gICAgICAgIHBvbHkucG9zaXRpb25zLnNwbGljZSgwLCAwLCB4LCB5KTtcclxuICAgICAgICByZXR1cm4gcG9seTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEljb25HZW5lcmF0aW9uQ29udGV4dDJEIHtcclxuICAgIGxheWVyczoge1trZXk6IHN0cmluZ106IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gPSB7fTtcclxuICAgIHNlbGVjdGVkTGF5ZXIhOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcclxuICAgICAgICB0aGlzLnNldExheWVyKFwiMFwiKTtcclxuICAgIH1cclxuICAgIG1hcChjYWxsYmFjazogKHg6IG51bWJlciwgeTogbnVtYmVyLCBnZXRDb2xvcjogKHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiBDb2xvcikgPT4gQ29sb3IpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBjdHggPSB0aGlzLnNlbGVjdGVkTGF5ZXI7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBjdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIGN0eC5jYW52YXMud2lkdGgsIGN0eC5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICBsZXQgbmV3RGF0YSA9IGN0eC5jcmVhdGVJbWFnZURhdGEoY3R4LmNhbnZhcy53aWR0aCwgY3R4LmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIGNvbnN0IGdldENvbG9yID0gKHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGkgPSAoeSAqIGN0eC5jYW52YXMud2lkdGggKyB4KSAqIDQ7XHJcbiAgICAgICAgICAgIGlmKGkgPCAwIHx8IGkgPj0gZGF0YS5kYXRhLmxlbmd0aClcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ29sb3IoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29sb3IoZGF0YS5kYXRhW2ldISwgZGF0YS5kYXRhW2krMV0hLCBkYXRhLmRhdGFbaSsyXSEsIGRhdGEuZGF0YVtpKzNdIS8yNTUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IobGV0IHk9MDsgeTxjdHguY2FudmFzLmhlaWdodDsgeSsrKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgeD0wOyB4PGN0eC5jYW52YXMud2lkdGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaSA9ICh5ICogY3R4LmNhbnZhcy53aWR0aCArIHgpICogNDtcclxuICAgICAgICAgICAgICAgIGxldCBjb2xvciA9IGNhbGxiYWNrKHgsIHksIGdldENvbG9yKTtcclxuICAgICAgICAgICAgICAgIG5ld0RhdGEuZGF0YVtpXSA9IE1hdGguZmxvb3IoY29sb3Iucik7XHJcbiAgICAgICAgICAgICAgICBuZXdEYXRhLmRhdGFbaSsxXSA9IE1hdGguZmxvb3IoY29sb3IuZyk7XHJcbiAgICAgICAgICAgICAgICBuZXdEYXRhLmRhdGFbaSsyXSA9IE1hdGguZmxvb3IoY29sb3IuYik7XHJcbiAgICAgICAgICAgICAgICBuZXdEYXRhLmRhdGFbaSszXSA9IE1hdGguZmxvb3IoY29sb3IuYSoyNTUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC5wdXRJbWFnZURhdGEobmV3RGF0YSwgMCwgMCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBicmlnaHRuZXNzVG9PcGFjaXR5KGludmVydCA9IGZhbHNlKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwKCh4LCB5LCBnZXRDb2xvcikgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY29sb3IgPSBnZXRDb2xvcih4LCB5KTtcclxuICAgICAgICAgICAgbGV0IHQgPSBjb2xvci5hO1xyXG4gICAgICAgICAgICBjb2xvci5hID0gY29sb3IudmFsIC8gMTAwO1xyXG4gICAgICAgICAgICBpZihpbnZlcnQpIGNvbG9yLmEgPSAxIC0gY29sb3IuYTtcclxuICAgICAgICAgICAgY29sb3IuYSAqPSB0O1xyXG4gICAgICAgICAgICBsZXQgdiA9IGludmVydCA/IDAgOiAyNTU7XHJcbiAgICAgICAgICAgIGNvbG9yLnIgPSB2O1xyXG4gICAgICAgICAgICBjb2xvci5nID0gdjtcclxuICAgICAgICAgICAgY29sb3IuYiA9IHY7XHJcbiAgICAgICAgICAgIHJldHVybiBjb2xvcjtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIG1pcnJvclgoKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwKCh4LCB5LCBnZXRDb2xvcikgPT4gZ2V0Q29sb3IodGhpcy5jdHguY2FudmFzLndpZHRoIC0gMSAtIHgsIHkpKTtcclxuICAgIH1cclxuICAgIG1pcnJvclkoKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwKCh4LCB5LCBnZXRDb2xvcikgPT4gZ2V0Q29sb3IoeCwgdGhpcy5jdHguY2FudmFzLmhlaWdodCAtIDEgLSB5KSk7XHJcbiAgICB9XHJcbiAgICBzZXRMYXllcihuYW1lOiBzdHJpbmcpOiB0aGlzIHtcclxuICAgICAgICBsZXQgbGF5ZXIgPSB0aGlzLmxheWVyc1tuYW1lXTtcclxuICAgICAgICBpZihsYXllciA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxheWVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKS5nZXRDb250ZXh0KFwiMmRcIiwgeyB3aWxsUmVhZEZyZXF1ZW50bHk6IHRydWUgfSkhO1xyXG4gICAgICAgICAgICBsYXllci5jYW52YXMud2lkdGggPSB0aGlzLmN0eC5jYW52YXMud2lkdGg7XHJcbiAgICAgICAgICAgIGxheWVyLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmN0eC5jYW52YXMuaGVpZ2h0O1xyXG4gICAgICAgICAgICB0aGlzLmxheWVyc1tuYW1lXSA9IGxheWVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNlbGVjdGVkTGF5ZXIgPSBsYXllcjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGZsYXR0ZW4oKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XHJcbiAgICAgICAgbGV0IGZsYXR0ZW5lZERhdGEgPSBjdHguY3JlYXRlSW1hZ2VEYXRhKGN0eC5jYW52YXMud2lkdGgsIGN0eC5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICBsZXQgbGF5ZXJEYXRhcyA9IFtdO1xyXG4gICAgICAgIGZvcihjb25zdCBuYW1lIGluIHRoaXMubGF5ZXJzKSB7XHJcbiAgICAgICAgICAgIGxldCBsYXllciA9IHRoaXMubGF5ZXJzW25hbWVdITtcclxuICAgICAgICAgICAgbGV0IGRhdGEgPSBsYXllci5nZXRJbWFnZURhdGEoMCwgMCwgbGF5ZXIuY2FudmFzLndpZHRoLCBsYXllci5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICAgICAgbGF5ZXJEYXRhcy5wdXNoKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IobGV0IHk9MDsgeTxjdHguY2FudmFzLmhlaWdodDsgeSsrKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgeD0wOyB4PGN0eC5jYW52YXMud2lkdGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaSA9ICh5ICogY3R4LmNhbnZhcy53aWR0aCArIHgpICogNDtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgZGF0YSBvZiBsYXllckRhdGFzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNyY0EgPSBkYXRhLmRhdGFbaSszXSEvMjU1O1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkc3RBID0gZmxhdHRlbmVkRGF0YS5kYXRhW2krM10hLzI1NTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3QSA9IHNyY0EgKyBkc3RBICogKDEgLSBzcmNBKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihuZXdBID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF0dGVuZWREYXRhLmRhdGFbaV0gPSAoZGF0YS5kYXRhW2ldISAqIHNyY0EgKyBmbGF0dGVuZWREYXRhLmRhdGFbaV0hICogZHN0QSAqICgxIC0gc3JjQSkpIC8gbmV3QTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdHRlbmVkRGF0YS5kYXRhW2krMV0gPSAoZGF0YS5kYXRhW2krMV0hICogc3JjQSArIGZsYXR0ZW5lZERhdGEuZGF0YVtpKzFdISAqIGRzdEEgKiAoMSAtIHNyY0EpKSAvIG5ld0E7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXR0ZW5lZERhdGEuZGF0YVtpKzJdID0gKGRhdGEuZGF0YVtpKzJdISAqIHNyY0EgKyBmbGF0dGVuZWREYXRhLmRhdGFbaSsyXSEgKiBkc3RBICogKDEgLSBzcmNBKSkgLyBuZXdBO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXR0ZW5lZERhdGEuZGF0YVtpXSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXR0ZW5lZERhdGEuZGF0YVtpKzFdID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdHRlbmVkRGF0YS5kYXRhW2krMl0gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmbGF0dGVuZWREYXRhLmRhdGFbaSszXSA9IG5ld0EgKiAyNTU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LnB1dEltYWdlRGF0YShmbGF0dGVuZWREYXRhLCAwLCAwKTtcclxuICAgICAgICBmb3IoY29uc3QgbmFtZSBpbiB0aGlzLmxheWVycykge1xyXG4gICAgICAgICAgICBsZXQgbGF5ZXIgPSB0aGlzLmxheWVyc1tuYW1lXSE7XHJcbiAgICAgICAgICAgIGxheWVyLmNhbnZhcy5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sYXllcnMgPSB7fTtcclxuICAgICAgICB0aGlzLnNldExheWVyKFwiMFwiKTtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkTGF5ZXIuZHJhd0ltYWdlKHRoaXMuY3R4LmNhbnZhcywgMCwgMCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZUljb24yRCh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgY2FsbGJhY2s6IChjdHg6IEljb25HZW5lcmF0aW9uQ29udGV4dDJEKSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuICAgIGxldCBjdHggPSBuZXcgSWNvbkdlbmVyYXRpb25Db250ZXh0MkQoY2FudmFzLmdldENvbnRleHQoXCIyZFwiLCB7IHdpbGxSZWFkRnJlcXVlbnRseTogdHJ1ZSB9KSEpO1xyXG4gICAgY2FsbGJhY2soY3R4KTtcclxuICAgIGN0eC5mbGF0dGVuKCk7XHJcbiAgICBsZXQgdXJsID0gYXdhaXQgbmV3IFByb21pc2U8c3RyaW5nPihyZXMgPT4ge1xyXG4gICAgICAgIGNhbnZhcy50b0Jsb2IoYmxvYiA9PiB7XHJcbiAgICAgICAgICAgIGlmKCFibG9iKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xyXG4gICAgICAgICAgICByZXModXJsKTtcclxuICAgICAgICB9LCBcImltYWdlL3BuZ1wiKTtcclxuICAgIH0pXHJcbiAgICBjYW52YXMucmVtb3ZlKCk7XHJcbiAgICByZXR1cm4gdXJsO1xyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBVSSBEUk9QRE9XTiBDTEFTUyAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGNsYXNzIFVpQ29udGV4dE1lbnUge1xyXG4gICAgcG9zaXRpb246IFZlYzI7XHJcbiAgICBjb250YWluZXJFbDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVmVjMih4LCB5KTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lckVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIFVJIEJVVFRPTiBDTEFTUyAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBVaUJ1dHRvbiB7XHJcbiAgICBjb250YWluZXJFbDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBsYWJlbEVsOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGJ1dHRvbkVsOiBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGlzSG92ZXJpbmcgPSBmYWxzZTtcclxuICAgIG1vdXNlRW50ZXJFdmVudDogU2lnbmFsPFtdPiA9IG5ldyBTaWduYWwoKTtcclxuICAgIG1vdXNlTGVhdmVFdmVudDogU2lnbmFsPFtdPiA9IG5ldyBTaWduYWwoKTtcclxuICAgIHByZWZpeEljb25zOiBVaUJ1dHRvbkljb25bXSA9IFtdO1xyXG4gICAgc3VmZml4SWNvbnM6IFVpQnV0dG9uSWNvbltdID0gW107XHJcbiAgICB0ZXh0Q29udGVudENoYW5nZWRFdmVudDogU2lnbmFsPFt0ZXh0OnN0cmluZ10+ID0gbmV3IFNpZ25hbCh7b25Db25uZWN0Oihjb25uKT0+e2Nvbm4uZmlyZSh0aGlzLl90ZXh0Q29udGVudCl9fSk7XHJcbiAgICBfdGV4dENvbnRlbnQgPSBcIkJ1dHRvblwiO1xyXG4gICAgZ2V0IHRleHRDb250ZW50KCkgeyByZXR1cm4gdGhpcy5fdGV4dENvbnRlbnQ7IH1cclxuICAgIHNldCB0ZXh0Q29udGVudCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fdGV4dENvbnRlbnQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnRleHRDb250ZW50Q2hhbmdlZEV2ZW50LmZpcmUodmFsdWUpO1xyXG4gICAgfVxyXG4gICAgdGV4dFNpemVDaGFuZ2VkRXZlbnQ6IFNpZ25hbDxbc2l6ZTpudW1iZXJdPiA9IG5ldyBTaWduYWwoe29uQ29ubmVjdDooY29ubik9Pntjb25uLmZpcmUodGhpcy5fdGV4dFNpemUpfX0pO1xyXG4gICAgX3RleHRTaXplID0gMTY7XHJcbiAgICBnZXQgdGV4dFNpemUoKSB7IHJldHVybiB0aGlzLl90ZXh0U2l6ZTsgfVxyXG4gICAgc2V0IHRleHRTaXplKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl90ZXh0U2l6ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudGV4dFNpemVDaGFuZ2VkRXZlbnQuZmlyZSh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwYWRkaW5nWENoYW5nZWRFdmVudDogU2lnbmFsPFt2YWx1ZTpudW1iZXJdPiA9IG5ldyBTaWduYWwoe29uQ29ubmVjdDooY29ubik9Pntjb25uLmZpcmUodGhpcy5fcGFkZGluZ1gpfX0pO1xyXG4gICAgX3BhZGRpbmdYID0gNDtcclxuICAgIGdldCBwYWRkaW5nWCgpIHsgcmV0dXJuIHRoaXMuX3BhZGRpbmdYOyB9XHJcbiAgICBzZXQgcGFkZGluZ1godmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3BhZGRpbmdYID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBwYWRkaW5nWUNoYW5nZWRFdmVudDogU2lnbmFsPFt2YWx1ZTpudW1iZXJdPiA9IG5ldyBTaWduYWwoe29uQ29ubmVjdDooY29ubik9Pntjb25uLmZpcmUodGhpcy5fcGFkZGluZ1kpfX0pO1xyXG4gICAgX3BhZGRpbmdZID0gODtcclxuICAgIGdldCBwYWRkaW5nWSgpIHsgcmV0dXJuIHRoaXMuX3BhZGRpbmdZOyB9XHJcbiAgICBzZXQgcGFkZGluZ1kodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3BhZGRpbmdZID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lckVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyRWwpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuc3R5bGUgPSBgXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICAgICAgd2lkdGg6IGZpdC1jb250ZW50O1xyXG4gICAgICAgICAgICBoZWlnaHQ6IGZpdC1jb250ZW50O1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcclxuICAgICAgICAgICAgdXNlci1zZWxlY3Q6IG5vbmU7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgIGA7XHJcbiAgICAgICAgdGhpcy5wYWRkaW5nWENoYW5nZWRFdmVudC5jb25uZWN0KHZhbHVlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXJFbC5zdHlsZS5wYWRkaW5nID0gYCR7dmFsdWV9cHggJHt0aGlzLnBhZGRpbmdZfXB4YDtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXJFbC5zdHlsZS5nYXAgPSBgJHt2YWx1ZX1weGA7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5wYWRkaW5nWUNoYW5nZWRFdmVudC5jb25uZWN0KHZhbHVlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXJFbC5zdHlsZS5wYWRkaW5nID0gYCR7dGhpcy5wYWRkaW5nWH1weCAke3ZhbHVlfXB4YDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmJ1dHRvbkVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmFwcGVuZENoaWxkKHRoaXMuYnV0dG9uRWwpO1xyXG4gICAgICAgIHRoaXMuYnV0dG9uRWwuc3R5bGUgPSBgXHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDA7XHJcbiAgICAgICAgICAgIG1hcmdpbjogMDtcclxuICAgICAgICAgICAgYm9yZGVyOiBub25lO1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcclxuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgICAgICBsZWZ0OiAwcHg7XHJcbiAgICAgICAgICAgIHRvcDogMHB4O1xyXG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgYDtcclxuICAgICAgICB0aGlzLmxhYmVsRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuYXBwZW5kQ2hpbGQodGhpcy5sYWJlbEVsKTtcclxuICAgICAgICB0aGlzLmxhYmVsRWwuc3R5bGUgPSBgXHJcbiAgICAgICAgICAgIGNvbG9yOiBibGFjaztcclxuICAgICAgICAgICAgZm9udC1mYW1pbHk6IEFyaWFsO1xyXG4gICAgICAgICAgICB3aWR0aDogZml0LWNvbnRlbnQ7XHJcbiAgICAgICAgICAgIGhlaWdodDogZml0LWNvbnRlbnQ7XHJcbiAgICAgICAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xyXG4gICAgICAgIGA7XHJcbiAgICAgICAgdGhpcy50ZXh0U2l6ZUNoYW5nZWRFdmVudC5jb25uZWN0KHNpemUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmxhYmVsRWwuc3R5bGUuZm9udFNpemUgPSBgJHtzaXplfXB4YDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnRleHRDb250ZW50Q2hhbmdlZEV2ZW50LmNvbm5lY3QodGV4dCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubGFiZWxFbC50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5idXR0b25FbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCBlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pc0hvdmVyaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZUVudGVyRXZlbnQuZmlyZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYnV0dG9uRWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNIb3ZlcmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlTGVhdmVFdmVudC5maXJlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhZGRJY29uKHVybDogc3RyaW5nLCBwb3NpdGlvbjogXCJwcmVmaXhcIiB8IFwic3VmZml4XCIgPSBcInByZWZpeFwiKSB7XHJcbiAgICAgICAgbGV0IGljb24gPSBuZXcgVWlCdXR0b25JY29uKHVybCk7XHJcbiAgICAgICAgaWYocG9zaXRpb24gPT0gXCJwcmVmaXhcIikgdGhpcy5sYWJlbEVsLmJlZm9yZShpY29uLmljb25FbClcclxuICAgICAgICBlbHNlIHRoaXMubGFiZWxFbC5hZnRlcihpY29uLmljb25FbCk7XHJcbiAgICAgICAgaWNvbi5jb25uZWN0aW9ucy5hZGQodGhpcy50ZXh0U2l6ZUNoYW5nZWRFdmVudC5jb25uZWN0KHNpemUgPT4ge1xyXG4gICAgICAgICAgICBpY29uLmljb25FbC5zdHlsZS53aWR0aCA9IGAke3NpemV9cHhgO1xyXG4gICAgICAgICAgICBpY29uLmljb25FbC5zdHlsZS5oZWlnaHQgPSBgJHtzaXplfXB4YDtcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcbiAgICByZW1vdmUoKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5yZW1vdmUoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFVpQnV0dG9uSWNvbiB7XHJcbiAgICBpY29uRWw6IEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgICBjb25uZWN0aW9ucyA9IG5ldyBDb25uZWN0aW9uR3JvdXAoKTtcclxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5pY29uRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIHRoaXMuaWNvbkVsLnNyYyA9IHVybDtcclxuICAgIH1cclxuICAgIHJlbW92ZSgpIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmRpc2Nvbm5lY3RBbGwoKTtcclxuICAgICAgICB0aGlzLmljb25FbC5yZW1vdmUoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFVpQnRuSG92ZXJGeFNvbGlkQ29sb3Ige1xyXG4gICAgZHVyYXRpb24gPSAwLjE7XHJcbiAgICBjb25uZWN0aW9ucyA9IG5ldyBDb25uZWN0aW9uR3JvdXAoKTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBidXR0b246IFVpQnV0dG9uLCBjb2xvcjogQ29sb3IsIGhvdmVyQ29sb3I6IENvbG9yKSB7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMuaG92ZXJDb2xvciA9IGhvdmVyQ29sb3I7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5hZGQoYnV0dG9uLm1vdXNlRW50ZXJFdmVudC5jb25uZWN0KCgpID0+IHtcclxuICAgICAgICAgICAgYnV0dG9uLmNvbnRhaW5lckVsLmFuaW1hdGUoW1xyXG4gICAgICAgICAgICAgICAge2JhY2tncm91bmRDb2xvcjp0aGlzLmNvbG9yLnRvU3RyaW5nKCl9LFxyXG4gICAgICAgICAgICAgICAge2JhY2tncm91bmRDb2xvcjp0aGlzLmhvdmVyQ29sb3IudG9TdHJpbmcoKX0sXHJcbiAgICAgICAgICAgIF0sIHtkdXJhdGlvbjp0aGlzLmR1cmF0aW9uKjEwMDAsIGVhc2luZzpcImVhc2VcIn0pO1xyXG4gICAgICAgICAgICBidXR0b24uY29udGFpbmVyRWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5ob3ZlckNvbG9yLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMuYWRkKGJ1dHRvbi5tb3VzZUxlYXZlRXZlbnQuY29ubmVjdCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5jb250YWluZXJFbC5hbmltYXRlKFtcclxuICAgICAgICAgICAgICAgIHtiYWNrZ3JvdW5kQ29sb3I6dGhpcy5ob3ZlckNvbG9yLnRvU3RyaW5nKCl9LFxyXG4gICAgICAgICAgICAgICAge2JhY2tncm91bmRDb2xvcjp0aGlzLmNvbG9yLnRvU3RyaW5nKCl9LFxyXG4gICAgICAgICAgICBdLCB7ZHVyYXRpb246dGhpcy5kdXJhdGlvbioxMDAwLCBlYXNpbmc6XCJlYXNlXCJ9KTtcclxuICAgICAgICAgICAgYnV0dG9uLmNvbnRhaW5lckVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuY29sb3IudG9TdHJpbmcoKTtcclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgaWYoYnV0dG9uLmlzSG92ZXJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b24uY29udGFpbmVyRWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5ob3ZlckNvbG9yLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b24uY29udGFpbmVyRWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5jb2xvci50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfY29sb3IhOiBDb2xvcjtcclxuICAgIHNldCBjb2xvcih2YWx1ZTogQ29sb3IpIHtcclxuICAgICAgICB0aGlzLl9jb2xvciA9IHZhbHVlO1xyXG4gICAgICAgIGlmKCF0aGlzLmJ1dHRvbi5pc0hvdmVyaW5nKVxyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5jb250YWluZXJFbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gICAgfVxyXG4gICAgZ2V0IGNvbG9yKCkgeyByZXR1cm4gdGhpcy5fY29sb3I7IH1cclxuICAgIF9ob3ZlckNvbG9yITogQ29sb3I7XHJcbiAgICBzZXQgaG92ZXJDb2xvcih2YWx1ZTogQ29sb3IpIHtcclxuICAgICAgICB0aGlzLl9ob3ZlckNvbG9yID0gdmFsdWU7XHJcbiAgICAgICAgaWYodGhpcy5idXR0b24uaXNIb3ZlcmluZylcclxuICAgICAgICAgICAgdGhpcy5idXR0b24uY29udGFpbmVyRWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdmFsdWUudG9TdHJpbmcoKTtcclxuICAgIH1cclxuICAgIGdldCBob3ZlckNvbG9yKCkgeyByZXR1cm4gdGhpcy5faG92ZXJDb2xvcjsgfVxyXG5cclxuICAgIHJlbW92ZSgpIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmRpc2Nvbm5lY3RBbGwoKTtcclxuICAgICAgICB0aGlzLmJ1dHRvbi5jb250YWluZXJFbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmNvbG9yLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcbn0iXX0=