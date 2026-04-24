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
    constructor(position, zoom) {
        this.position = position ?? Vec2.zero();
        this.zoom = zoom ?? 1;
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
    _zoom;
    get zoom() { return this._zoom; }
    set zoom(value) {
        this._zoom = value;
        this._outdatedScaleMatrix = true;
        this._outdatedViewMatrix = true;
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
        this._scaleMatrix = Mat3.rotate(this.zoom);
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
        this._viewMatrix = Mat3.multiply(this.rotationMatrix, Mat3.multiply(this.translationMatrix, this.scaleMatrix));
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
export let Circle2DPositionsF32 = new Float32Array(Circle2DMesh.positions);
export let Rect2DMesh = new TriMesh2D();
export let Rect2DPositionsF32 = new Float32Array(Rect2DMesh.positions);
export class PhysicsPart2D {
    anchored = false;
    velocity = Vec2.zero();
    hasCollision = true;
    color = new Color();
    shaderObject;
    mass = 1;
    restitution = 1;
    gravity = 500;
    collisionEvent = new Signal();
    constructor(shader, position, size) {
        this.shapeType = "circle";
        this.shader = shader;
        this.position = position;
        this.size = size;
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
            this.shaderObject.remove();
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
    _shapeType = "rect";
    get shapeType() { return this._shapeType; }
    set shapeType(value) {
        this._shapeType = value;
        this._updateShaderObjectData();
    }
    _updateShaderObjectData() {
        switch (this._shapeType) {
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
            this.shape.radius = Math.max(this._size.x, this._size.y);
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
        this._scaleMatrix = Mat3.scale(this.size.x, this.size.y);
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
    }
    resolveCircleCircleCollision(other, collision) {
        if (!collision.inside)
            return;
        const velAlongNormal = other.velocity.sub(this.velocity).dot(collision.normal);
        const mi = (1 / this.mass + 1 / other.mass);
        if (velAlongNormal < 0) {
            const restitution = Math.min(this.restitution, other.restitution);
            const j = -(1 + restitution) * velAlongNormal / mi;
            this.velocity.addScaledSelf(collision.normal, j * -1 / this.mass);
            other.velocity.addScaledSelf(collision.normal, j * 1 / other.mass);
        }
        const correction = collision.normal.rescale(Math.max(-collision.distance - 1e-4, 0) / mi * 0.8);
        this.position.addScaledSelf(correction, -1 / this.mass);
        other.position.addScaledSelf(correction, 1 / other.mass);
    }
    resolveCircleAnchoredRectCollision(other, collision) {
        if (!collision.inside)
            return;
        const velAlongNormal = this.velocity.sub(other.velocity).dot(collision.normal);
        if (velAlongNormal < 0) {
            const restitution = Math.min(this.restitution, other.restitution);
            const j = -(1 + restitution) * velAlongNormal;
            this.velocity.addScaledSelf(collision.normal, j);
        }
        const radius = Math.max(this.size.x, this.size.y);
        this.position = collision.collision.addScaled(collision.normal, radius + 1e-6);
    }
    render(camera) {
        if (this.uColor)
            this.uColor.setValues([this.color.r, this.color.g, this.color.b]);
        if (this.uView)
            this.uView.setValues(camera ? Mat3.multiply(this.viewMatrix, camera.viewMatrix) : this.viewMatrix);
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
                    gl_Position = vec4(v_position, 0, 1)
                }
            `, `#version 300 es
                precision highp float;
                uniform vec3 color;
                out vec4 outColor;
                void main() {
                    outColor = vec4(color/255., 1);
                }
            `);
    }
    addPart(part) {
        this.parts.push(part);
    }
    update(dt) {
        for (let part of this.parts) {
            if (part.anchored) {
                part.velocity = part.position.sub(part.lastPosition).mulF(1 / dt);
                part.lastPosition.setC(part.position.x, part.position.y);
            }
            else {
                part.lastPosition.setC(part.position.x, part.position.y);
            }
        }
        for (let i = 0; i < 3; i++) {
            for (let part of this.parts) {
                if (part.anchored)
                    continue;
                if (i == 0) {
                    part.velocity.y -= part.gravity * dt;
                    part.position.addScaledSelf(part.velocity, dt);
                }
                if (part.shapeType == "circle" && !part.anchored) {
                    for (let other of this.parts) {
                        if (!other.hasCollision)
                            continue;
                        if (other == part)
                            continue;
                        if (other.shapeType == "circle" && !other.anchored) {
                            let collision = part.shape.getCircleCollision(other.shape);
                            part.resolveCircleCircleCollision(other, collision);
                            if (collision.inside) {
                                part.collisionEvent.fire(collision, part, other);
                                other.collisionEvent.fire(collision, part, other);
                            }
                        }
                        else {
                            let collision = part.shape.getRectCollision(other.shape);
                            part.resolveCircleAnchoredRectCollision(other, collision);
                            if (collision.inside) {
                                part.collisionEvent.fire(collision, part, other);
                                other.collisionEvent.fire(collision, part, other);
                            }
                        }
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
    remove() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGliZ2UzX3YyMDI2MDQyMS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpYmdlM192MjAyNjA0MjEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQStCO0FBQy9CLG1DQUFtQztBQUVuQyxxQkFBcUI7QUFDckIsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsRUFBVSxFQUFFLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUU3RSxtQkFBbUI7QUFDbkIsbUJBQW1CO0FBQ25CLG1CQUFtQjtBQUNuQixNQUFNLE9BQWdCLEtBQUs7SUFDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFTLEVBQUMsQ0FBUyxFQUFDLENBQVM7UUFDdEMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQVMsRUFBQyxDQUFTLEVBQUMsQ0FBUztRQUNyQyxPQUFPLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBUyxFQUFDLENBQVM7UUFDM0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLElBQVksSUFBSTtRQUNqRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxD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QUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFTO1FBQ1YsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFDRCxRQUFRLENBQUMsQ0FBUztRQUNkLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxJQUFJLENBQUMsS0FBVztRQUNaLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBQ0QsUUFBUSxDQUFDLEtBQVc7UUFDaEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELEtBQUssQ0FBQyxDQUFTLEVB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LENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsSUFBSSxDQUFDLEtBQVcsRUFBRSxDQUFTO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNELFFBQVEsQ0FBQyxLQUFXLEVBQUUsQ0FBUztRQUMzQixJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsS0FBSyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDNUMsT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDRCxTQUFTLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUNoRCxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMs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QUMsRUFBRSxDQUFDLENBQUM7UUFDdEMsTUFBTSxFQUFFLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QyxNQUFNLEdBQUcsR0FBRyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNyRSxNQUFNLEdBQUcsR0FBRyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RSxNQUFNLEdBQUcsR0FBRyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RSxNQUFNLEdBQUcsR0FBRyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNyRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDOUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7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Q0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRixNQUFNLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0YsTUFBTSxJQUFJLEdBQUcsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNGLE1BQU0sSUFBSSxHQUFHLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRixNQUFNLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0YsTUFBTSxJQUFJLEdBQUcsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNGLE1BQU0sSUFBSSxHQUFHLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDNUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDOUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFB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QyxDQUFDLEdBQUMsQ0FBQyxDQUFFLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFFLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDO1lBQy9HLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFFLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQztZQUNqSCxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFFLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQztRQUNuSCxDQUFDO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBbUI7UUFDbkMsSUFBSSxLQUFLLEdBQWEsRUFBRSxDQUFDO1FBQ3pCLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNyQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFFLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQztZQUMvRyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFFLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFFLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBRSxDQUFDLENBQUM7WUFDakgsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFFLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFFLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUUsQ0FBQyxDQUFDO1lBQ25ILEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFFLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFFLENBQUMsQ0FBQztRQUMxSCxD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QUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDO1FBQ3hGLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2QyxJQUFJLFNBQVMsR0FBYSxFQUFFLENBQUM7UUFDN0IsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLEdBQUcsRUFBRSxDQUFDLElBQUUsSUFBSSxFQUFFLENBQUM7WUFDMUIsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDN0QsQ0FBQztRQUNELFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzdELE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxNQUFjLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUM7UUFDM0YsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEMsT0FBTyxJ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QUFDLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUUsSUFBRyxRQUFRLEVBQUUsQ0FBQztZQUNWLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pHLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEcsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDdkcsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENB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RSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckQsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZJLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2SSxJQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFF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QUMsQ0FBQyxDQUFDO1FBQ3JELElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2SSxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkksSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFD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U0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RCxJQUFJLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM5RCxJQUFJLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMxRCxJQUFJLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxJQUFJLEtBQUssR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMvRCxJQUFJLEtBQUssR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMzRCxJQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQ2pELElBQUcsS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDO1lBQ2QsSUFBSSxHQUFHLEtBQUssQ0FBQztZQUNiLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUMsUUFBUSxDQUFDLENBQUMsRUFB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Q0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPO2dCQUMzRyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVE7Z0JBQzFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNO2dCQUMxRyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sR0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVM7Z0JBQzNJLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLFdBQVc7Z0JBQy9FLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxZQUFZO2dCQUM5RyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsY0FBYztnQkFDaEgsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sR0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxD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QUUsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFELEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFFLElBQUksRUFBRSxHQUFHLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDMUQsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDbkMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUUsQ0FBQztnQkFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ2hFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxDQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztnQkFDckUsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxJ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UUFDeEQsQ0FBQztRQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbIi8vIDNELzJEIEpTIEdhbWUgRW5naW5lIExpYnJhcnlcclxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3NsbGVuZGVyYnJpbmVcclxuXHJcbi8vICBERUxBWSBVVElMSVRZICAvL1xyXG5leHBvcnQgY29uc3QgZGVsYXkgPSAobXM6IG51bWJlcikgPT4gbmV3IFByb21pc2UocmVzID0+IHNldFRpbWVvdXQocmVzLCBtcykpO1xyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgRU1BVEggQ0xBU1MgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEVNYXRoIHtcclxuICAgIHN0YXRpYyBjbGFtcChuOiBudW1iZXIsYTogbnVtYmVyLGI6IG51bWJlcikgOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChuLGEpLGIpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGxlcnAoYTogbnVtYmVyLGI6IG51bWJlcix0OiBudW1iZXIpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gYSsoYi1hKSp0O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHBtb2QoeDogbnVtYmVyLGE6IG51bWJlcikgOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAoKHglYSkrYSklYTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBpc0Nsb3NlKGE6IG51bWJlciwgYjogbnVtYmVyLCBlOiBudW1iZXIgPSAxZS02KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKGEtYikgPCBlO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGlzWmVybyh2OiBudW1iZXIsIGU6IG51bWJlciA9IDFlLTYpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hYnModikgPCBlO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBBUlJBWSBVVElMUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQXJyYXlVdGlscyB7XHJcbiAgICBzdGF0aWMgc2h1ZmZsZVNlbGY8VD4oYXJyYXk6IFRbXSk6IFRbXSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGFycmF5Lmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcclxuICAgICAgICAgICAgY29uc3QgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xyXG4gICAgICAgICAgICBbYXJyYXlbaV0hLCBhcnJheVtqXSFdID0gW2FycmF5W2pdISwgYXJyYXlbaV0hXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgVkVDVE9SIENMQVNTRVMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGNsYXNzIFZlYzMge1xyXG4gICAgX3g6IG51bWJlcjtcclxuICAgIF95OiBudW1iZXI7XHJcbiAgICBfejogbnVtYmVyO1xyXG4gICAgb25NdXRhdGU/OiAoKSA9PiB2b2lkO1xyXG4gICAgY29uc3RydWN0b3IodjogVmVjMyB8IHt4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyfSk7XHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTtcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciB8IFZlYzMgfCB7eDpudW1iZXIsIHk6bnVtYmVyLCB6Om51bWJlcn0sIHk/OiBudW1iZXIsIHo/OiBudW1iZXIpIHtcclxuICAgICAgICBpZih0eXBlb2YgeCA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICB0aGlzLl94ID0geC54O1xyXG4gICAgICAgICAgICB0aGlzLl95ID0geC55O1xyXG4gICAgICAgICAgICB0aGlzLl96ID0geC56O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ggPSB4O1xyXG4gICAgICAgICAgICB0aGlzLl95ID0geSEgYXMgbnVtYmVyO1xyXG4gICAgICAgICAgICB0aGlzLl96ID0geiE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG11dGF0ZSgpIHtcclxuICAgICAgICBpZih0aGlzLm9uTXV0YXRlKVxyXG4gICAgICAgICAgICB0aGlzLm9uTXV0YXRlKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldCB4KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl94ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgIH1cclxuICAgIGdldCB4KCkgeyByZXR1cm4gdGhpcy5feDsgfVxyXG4gICAgc2V0IHkodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3kgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IHkoKSB7IHJldHVybiB0aGlzLl95OyB9XHJcbiAgICBzZXQgeih2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5feiA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgeigpIHsgcmV0dXJuIHRoaXMuX3o7IH1cclxuXHJcbiAgICAvLyBTdGF0aWMgQ29uc3RydWN0b3JzXHJcbiAgICBzdGF0aWMgZmlsbChuOiBudW1iZXIpOiBWZWMzIHsgcmV0dXJuIG5ldyBWZWMzKG4sIG4sIG4pOyB9XHJcbiAgICBzdGF0aWMgemVybygpOiBWZWMzIHsgcmV0dXJuIFZlYzMuZmlsbCgwKTsgfVxyXG4gICAgc3RhdGljIG9uZSgpOiBWZWMzIHsgcmV0dXJuIFZlYzMuZmlsbCgxKTsgfVxyXG4gICAgc3RhdGljIHhBeGlzKCk6IFZlYzMgeyByZXR1cm4gbmV3IFZlYzMoMSwgMCwgMCk7IH1cclxuICAgIHN0YXRpYyB5QXhpcygpOiBWZWMzIHsgcmV0dXJuIG5ldyBWZWMzKDAsIDEsIDApOyB9XHJcbiAgICBzdGF0aWMgekF4aXMoKTogVmVjMyB7IHJldHVybiBuZXcgVmVjMygwLCAwLCAxKTsgfVxyXG4gICAgc3RhdGljIHJhbmRvbSgpOiBWZWMzIHtcclxuICAgICAgICBjb25zdCB6ID0gTWF0aC5yYW5kb20oKSAqIDIgLSAxO1xyXG4gICAgICAgIGNvbnN0IGEgPSBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XHJcbiAgICAgICAgY29uc3QgYiA9IE1hdGguc3FydChNYXRoLm1heCgwLCAxIC0geiAqIHopKTtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoYiAqIE1hdGguY29zKGEpLCBiICogTWF0aC5zaW4oYSksIHopO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJhbmRvbVJvdGF0aW9uKCk6IFZlYzMge1xyXG4gICAgICAgIGNvbnN0IHYgPSBWZWMzLnJhbmRvbSgpO1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh2LnBpdGNoKCksIHYueWF3KCksIE1hdGgucmFuZG9tKCkgKiAyICogTWF0aC5QSSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTWlzY2VsbGFuZW91c1xyXG4gICAgZ2V0SShpOiBudW1iZXIpOiBudW1iZXIgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIHN3aXRjaChpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIHRoaXMuX3g7XHJcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIHRoaXMuX3k7XHJcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIHRoaXMuX3o7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBzZXRJKGk6IG51bWJlciwgdjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgc3dpdGNoKGkpIHtcclxuICAgICAgICAgICAgY2FzZSAwOiB0aGlzLl94ID0gdjsgdGhpcy5tdXRhdGUoKTsgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIDE6IHRoaXMuX3kgPSB2OyB0aGlzLm11dGF0ZSgpOyByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgMjogdGhpcy5feiA9IHY7IHRoaXMubXV0YXRlKCk7IHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzZXQob3RoZXI6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gb3RoZXIuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IG90aGVyLl95O1xyXG4gICAgICAgIHRoaXMuX3ogPSBvdGhlci5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc2V0Qyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IHg7XHJcbiAgICAgICAgdGhpcy5feSA9IHk7XHJcbiAgICAgICAgdGhpcy5feiA9IHo7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcclxuICAgICAgICB5aWVsZCB0aGlzLl94O1xyXG4gICAgICAgIHlpZWxkIHRoaXMuX3k7XHJcbiAgICAgICAgeWllbGQgdGhpcy5fejtcclxuICAgIH1cclxuICAgIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGA8JHt0aGlzLl94LnRvRml4ZWQoMil9LCAke3RoaXMuX3kudG9GaXhlZCgyKX0sICR7dGhpcy5fei50b0ZpeGVkKDIpfT5gO1xyXG4gICAgfVxyXG4gICAgdG9BcnJheSgpOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy5feCwgdGhpcy5feSwgdGhpcy5fel07XHJcbiAgICB9XHJcbiAgICBjbG9uZSgpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcyk7XHJcbiAgICB9XHJcbiAgICBnZXRQcmltYXJ5QXhpcygpOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGF4ID0gTWF0aC5hYnModGhpcy5feCk7XHJcbiAgICAgICAgY29uc3QgYXkgPSBNYXRoLmFicyh0aGlzLl95KTtcclxuICAgICAgICBjb25zdCBheiA9IE1hdGguYWJzKHRoaXMuX3opO1xyXG4gICAgICAgIGlmKGF4ID4gYXkpIHJldHVybiBheCA+IGF6ID8gMCA6IDI7XHJcbiAgICAgICAgZWxzZSByZXR1cm4gYXkgPiBheiA/IDEgOiAyO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENhbGN1bGF0aW9uc1xyXG4gICAgbGVuZ3RoKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLmRvdCh0aGlzKSk7XHJcbiAgICB9XHJcbiAgICBkb3Qob3RoZXI6IFZlYzMpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl94ICogb3RoZXIuX3ggKyB0aGlzLl95ICogb3RoZXIuX3kgKyB0aGlzLl96ICogb3RoZXIuX3o7XHJcbiAgICB9XHJcbiAgICBkb3RDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl94ICogeCArIHRoaXMuX3kgKiB5ICsgdGhpcy5feiAqIHo7XHJcbiAgICB9XHJcbiAgICBjcm9zcyhvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl95ICogb3RoZXIuX3ogLSB0aGlzLl96ICogb3RoZXIuX3ksIC0gKHRoaXMuX3ggKiBvdGhlci5feiAtIHRoaXMuX3ogKiBvdGhlci5feCksIHRoaXMuX3ggKiBvdGhlci5feSAtIHRoaXMuX3kgKiBvdGhlci5feCk7XHJcbiAgICB9XHJcbiAgICBjcm9zc0MoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl95ICogeiAtIHRoaXMuX3ogKiB5LCAtICh0aGlzLl94ICogeiAtIHRoaXMuX3ogKiB4KSwgdGhpcy5feCAqIHkgLSB0aGlzLl95ICogeCk7XHJcbiAgICB9XHJcbiAgICBhbmdsZVRvKG90aGVyOiBWZWMzKTogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBjID0gdGhpcy5sZW5ndGgoKSAqIG90aGVyLmxlbmd0aCgpO1xyXG4gICAgICAgIGlmKGMgPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoRU1hdGguY2xhbXAodGhpcy5kb3Qob3RoZXIpIC8gYywgLTEsIDEpKTtcclxuICAgIH1cclxuICAgIHNpZ25lZEFuZ2xlVG8ob3RoZXI6IFZlYzMsIHJlZmVyZW5jZTogVmVjMyA9IFZlYzMueUF4aXMoKSk6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgYW5nbGUgPSB0aGlzLmFuZ2xlVG8ob3RoZXIpO1xyXG4gICAgICAgIGNvbnN0IG5vcm1hbCA9IHRoaXMuY3Jvc3Mob3RoZXIpLm5vcm1TZWxmKCk7XHJcbiAgICAgICAgaWYobm9ybWFsLmRvdChyZWZlcmVuY2Uubm9ybSgpKSA+IDApXHJcbiAgICAgICAgICAgIHJldHVybiAtYW5nbGU7XHJcbiAgICAgICAgcmV0dXJuIGFuZ2xlO1xyXG4gICAgfVxyXG4gICAgZGlzdFRvKG90aGVyOiBWZWMzKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdWIob3RoZXIpLmxlbmd0aCgpO1xyXG4gICAgfVxyXG4gICAgZGlzdFRvQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdWJDKHgsIHksIHopLmxlbmd0aCgpO1xyXG4gICAgfVxyXG4gICAgc3RyaWN0RXF1YWxzKG90aGVyOiBWZWMzKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ggPT0gb3RoZXIuX3ggJiYgdGhpcy5feSA9PSBvdGhlci5feSAmJiB0aGlzLl96ID09IG90aGVyLl96O1xyXG4gICAgfVxyXG4gICAgaXNDbG9zZShvdGhlcjogVmVjMywgZSA9IDFlLTYpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gRU1hdGguaXNDbG9zZSh0aGlzLl94LCBvdGhlci5feCwgZSkgJiYgRU1hdGguaXNDbG9zZSh0aGlzLl95LCBvdGhlci5feSwgZSkgJiYgRU1hdGguaXNDbG9zZSh0aGlzLl96LCBvdGhlci5feiwgZSk7XHJcbiAgICB9XHJcbiAgICBpc1plcm8oZSA9IDFlLTYpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gRU1hdGguaXNaZXJvKHRoaXMuX3gsIGUpICYmIEVNYXRoLmlzWmVybyh0aGlzLl95LCBlKSAmJiBFTWF0aC5pc1plcm8odGhpcy5feiwgZSk7XHJcbiAgICB9XHJcbiAgICBwaXRjaCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFzaW4odGhpcy5feSk7XHJcbiAgICB9XHJcbiAgICB5YXcoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMigtdGhpcy5feCwgLXRoaXMuX3opO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE9wZXJhdGlvbnNcclxuICAgIGFkZChvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl94ICsgb3RoZXIuX3gsIHRoaXMuX3kgKyBvdGhlci5feSwgdGhpcy5feiArIG90aGVyLl96KTtcclxuICAgIH1cclxuICAgIGFkZFNlbGYob3RoZXI6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICs9IG90aGVyLl94O1xyXG4gICAgICAgIHRoaXMuX3kgKz0gb3RoZXIuX3k7XHJcbiAgICAgICAgdGhpcy5feiArPSBvdGhlci5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggKyB4LCB0aGlzLl95ICsgeSwgdGhpcy5feiArIHopO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0geDtcclxuICAgICAgICB0aGlzLl95ICs9IHk7XHJcbiAgICAgICAgdGhpcy5feiArPSB6O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRGKG46IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl94ICsgbiwgdGhpcy5feSArIG4sIHRoaXMuX3ogKyBuKTtcclxuICAgIH1cclxuICAgIGFkZFNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0gbjtcclxuICAgICAgICB0aGlzLl95ICs9IG47XHJcbiAgICAgICAgdGhpcy5feiArPSBuO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWQob3RoZXI6IFZlYzMsIHM6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuYWRkU2NhbGVkU2VsZihvdGhlciwgcyk7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWRTZWxmKG90aGVyOiBWZWMzLCBzOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICs9IG90aGVyLl94ICogcztcclxuICAgICAgICB0aGlzLl95ICs9IG90aGVyLl95ICogcztcclxuICAgICAgICB0aGlzLl96ICs9IG90aGVyLl96ICogcztcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBzOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmFkZFNjYWxlZFNlbGZDKHgsIHksIHosIHMpO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgczogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCArPSB4ICogcztcclxuICAgICAgICB0aGlzLl95ICs9IHkgKiBzO1xyXG4gICAgICAgIHRoaXMuX3ogKz0geiAqIHM7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN1YihvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl94IC0gb3RoZXIuX3gsIHRoaXMuX3kgLSBvdGhlci5feSwgdGhpcy5feiAtIG90aGVyLl96KTtcclxuICAgIH1cclxuICAgIHN1YlNlbGYob3RoZXI6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94IC09IG90aGVyLl94O1xyXG4gICAgICAgIHRoaXMuX3kgLT0gb3RoZXIuX3k7XHJcbiAgICAgICAgdGhpcy5feiAtPSBvdGhlci5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3ViQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggLSB4LCB0aGlzLl95IC0geSwgdGhpcy5feiAtIHopO1xyXG4gICAgfVxyXG4gICAgc3ViU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggLT0geDtcclxuICAgICAgICB0aGlzLl95IC09IHk7XHJcbiAgICAgICAgdGhpcy5feiAtPSB6O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWJGKG46IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl94IC0gbiwgdGhpcy5feSAtIG4sIHRoaXMuX3ogLSBuKTtcclxuICAgIH1cclxuICAgIHN1YlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggLT0gbjtcclxuICAgICAgICB0aGlzLl95IC09IG47XHJcbiAgICAgICAgdGhpcy5feiAtPSBuO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByc3ViKG90aGVyOiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKG90aGVyLl94IC0gdGhpcy5feCwgb3RoZXIuX3kgLSB0aGlzLl95LCBvdGhlci5feiAtIHRoaXMuX3opO1xyXG4gICAgfVxyXG4gICAgcnN1YlNlbGYob3RoZXI6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gb3RoZXIuX3ggLSB0aGlzLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSBvdGhlci5feSAtIHRoaXMuX3k7XHJcbiAgICAgICAgdGhpcy5feiA9IG90aGVyLl96IC0gdGhpcy5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcnN1YkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh4IC0gdGhpcy5feCwgeSAtIHRoaXMuX3ksIHogLSB0aGlzLl96KTtcclxuICAgIH1cclxuICAgIHJzdWJTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IHggLSB0aGlzLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSB5IC0gdGhpcy5feTtcclxuICAgICAgICB0aGlzLl96ID0geiAtIHRoaXMuX3o7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJzdWJGKG46IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhuIC0gdGhpcy5feCwgbiAtIHRoaXMuX3ksIG4gLSB0aGlzLl96KTtcclxuICAgIH1cclxuICAgIHJzdWJTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gbiAtIHRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IG4gLSB0aGlzLl95O1xyXG4gICAgICAgIHRoaXMuX3ogPSBuIC0gdGhpcy5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbXVsKG90aGVyOiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggKiBvdGhlci5feCwgdGhpcy5feSAqIG90aGVyLl95LCB0aGlzLl96ICogb3RoZXIuX3opO1xyXG4gICAgfVxyXG4gICAgbXVsU2VsZihvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKj0gb3RoZXIuX3g7XHJcbiAgICAgICAgdGhpcy5feSAqPSBvdGhlci5feTtcclxuICAgICAgICB0aGlzLl96ICo9IG90aGVyLl96O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBtdWxDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feCAqIHgsIHRoaXMuX3kgKiB5LCB0aGlzLl96ICogeik7XHJcbiAgICB9XHJcbiAgICBtdWxTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAqPSB4O1xyXG4gICAgICAgIHRoaXMuX3kgKj0geTtcclxuICAgICAgICB0aGlzLl96ICo9IHo7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG11bEYobjogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggKiBuLCB0aGlzLl95ICogbiwgdGhpcy5feiAqIG4pO1xyXG4gICAgfVxyXG4gICAgbXVsU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAqPSBuO1xyXG4gICAgICAgIHRoaXMuX3kgKj0gbjtcclxuICAgICAgICB0aGlzLl96ICo9IG47XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGRpdihvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl94IC8gb3RoZXIuX3gsIHRoaXMuX3kgLyBvdGhlci5feSwgdGhpcy5feiAvIG90aGVyLl96KTtcclxuICAgIH1cclxuICAgIGRpdlNlbGYob3RoZXI6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94IC89IG90aGVyLl94O1xyXG4gICAgICAgIHRoaXMuX3kgLz0gb3RoZXIuX3k7XHJcbiAgICAgICAgdGhpcy5feiAvPSBvdGhlci5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZGl2Qyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggLyB4LCB0aGlzLl95IC8geSwgdGhpcy5feiAvIHopO1xyXG4gICAgfVxyXG4gICAgZGl2U2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggLz0geDtcclxuICAgICAgICB0aGlzLl95IC89IHk7XHJcbiAgICAgICAgdGhpcy5feiAvPSB6O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBkaXZGKG46IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl94IC8gbiwgdGhpcy5feSAvIG4sIHRoaXMuX3ogLyBuKTtcclxuICAgIH1cclxuICAgIGRpdlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggLz0gbjtcclxuICAgICAgICB0aGlzLl95IC89IG47XHJcbiAgICAgICAgdGhpcy5feiAvPSBuO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByZGl2KG90aGVyOiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKG90aGVyLl94IC8gdGhpcy5feCwgb3RoZXIuX3kgLyB0aGlzLl95LCBvdGhlci5feiAvIHRoaXMuX3opO1xyXG4gICAgfVxyXG4gICAgcmRpdlNlbGYob3RoZXI6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gb3RoZXIuX3ggLyB0aGlzLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSBvdGhlci5feSAvIHRoaXMuX3k7XHJcbiAgICAgICAgdGhpcy5feiA9IG90aGVyLl96IC8gdGhpcy5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmRpdkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh4IC8gdGhpcy5feCwgeSAvIHRoaXMuX3ksIHogLyB0aGlzLl96KTtcclxuICAgIH1cclxuICAgIHJkaXZTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IHggLyB0aGlzLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSB5IC8gdGhpcy5feTtcclxuICAgICAgICB0aGlzLl96ID0geiAvIHRoaXMuX3o7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJkaXZGKG46IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhuIC8gdGhpcy5feCwgbiAvIHRoaXMuX3ksIG4gLyB0aGlzLl96KTtcclxuICAgIH1cclxuICAgIHJkaXZTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gbiAvIHRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IG4gLyB0aGlzLl95O1xyXG4gICAgICAgIHRoaXMuX3ogPSBuIC8gdGhpcy5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbmVnKCk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMygtdGhpcy5feCwgLXRoaXMuX3ksIC10aGlzLl96KTtcclxuICAgIH1cclxuICAgIG5lZ1NlbGYoKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IC10aGlzLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSAtdGhpcy5feTtcclxuICAgICAgICB0aGlzLl96ID0gLXRoaXMuX3o7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGxlcnAob3RoZXI6IFZlYzMsIHQ6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubGVycFNlbGYob3RoZXIsIHQpO1xyXG4gICAgfVxyXG4gICAgbGVycFNlbGYob3RoZXI6IFZlYzMsIHQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0gKG90aGVyLl94IC0gdGhpcy5feCkgKiB0O1xyXG4gICAgICAgIHRoaXMuX3kgKz0gKG90aGVyLl95IC0gdGhpcy5feSkgKiB0O1xyXG4gICAgICAgIHRoaXMuX3ogKz0gKG90aGVyLl96IC0gdGhpcy5feikgKiB0O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBsZXJwQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB0OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxlcnBTZWxmQyh4LCB5LCB6LCB0KTtcclxuICAgIH1cclxuICAgIGxlcnBTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICs9ICh4IC0gdGhpcy5feCkgKiB0O1xyXG4gICAgICAgIHRoaXMuX3kgKz0gKHkgLSB0aGlzLl95KSAqIHQ7XHJcbiAgICAgICAgdGhpcy5feiArPSAoeiAtIHRoaXMuX3opICogdDtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbm9ybSgpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLm5vcm1TZWxmKCk7XHJcbiAgICB9XHJcbiAgICBub3JtU2VsZigpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBtYWcgPSB0aGlzLmxlbmd0aCgpO1xyXG4gICAgICAgIGlmKG1hZyA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2U2VsZkMobWFnLCBtYWcsIG1hZyk7XHJcbiAgICB9XHJcbiAgICByZXNjYWxlKG1hZzogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yZXNjYWxlU2VsZihtYWcpO1xyXG4gICAgfVxyXG4gICAgcmVzY2FsZVNlbGYobWFnOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ub3JtU2VsZigpLm11bFNlbGZDKG1hZywgbWFnLCBtYWcpO1xyXG4gICAgfVxyXG4gICAgbG9vayhvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubG9va1NlbGYob3RoZXIpO1xyXG4gICAgfVxyXG4gICAgbG9va1NlbGYob3RoZXI6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yc3ViU2VsZihvdGhlcikubm9ybVNlbGYoKTtcclxuICAgIH1cclxuICAgIGNsYW1wTGVuZ3RoKGE6IG51bWJlciwgYjogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5jbGFtcExlbmd0aFNlbGYoYSwgYik7XHJcbiAgICB9XHJcbiAgICBjbGFtcExlbmd0aFNlbGYoYTogbnVtYmVyLCBiOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNjYWxlU2VsZihFTWF0aC5jbGFtcCh0aGlzLmxlbmd0aCgpLCBhLCBiKSk7XHJcbiAgICB9XHJcbiAgICBmbGF0KCk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuZmxhdFNlbGYoKTtcclxuICAgIH1cclxuICAgIGZsYXRTZWxmKCk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3kgPSAwO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBmbGF0Tm9ybSgpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmZsYXROb3JtU2VsZigpO1xyXG4gICAgfVxyXG4gICAgZmxhdE5vcm1TZWxmKCk6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZsYXRTZWxmKCkubm9ybVNlbGYoKTtcclxuICAgIH1cclxuICAgIHNldERvdChvdGhlcjogVmVjMywgdGFyZ2V0OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnNldERvdFNlbGYob3RoZXIsIHRhcmdldCk7XHJcbiAgICB9XHJcbiAgICBzZXREb3RTZWxmKG90aGVyOiBWZWMzLCB0YXJnZXQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IGQgPSBvdGhlci5kb3Qob3RoZXIpO1xyXG4gICAgICAgIGlmKGQgPT09IDApIHJldHVybiB0aGlzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNjYWxlZFNlbGYob3RoZXIsICh0YXJnZXQgLSB0aGlzLmRvdChvdGhlcikpIC8gZCk7XHJcbiAgICB9XHJcbiAgICBzZXREb3RDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHRhcmdldDogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5zZXREb3RTZWxmQyh4LCB5LCB6LCB0YXJnZXQpO1xyXG4gICAgfVxyXG4gICAgc2V0RG90U2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdGFyZ2V0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBkID0geCp4ICsgeSp5ICsgeip6O1xyXG4gICAgICAgIGlmKGQgPT09IDApIHJldHVybiB0aGlzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNjYWxlZFNlbGZDKHgsIHksIHosICh0YXJnZXQgLSB0aGlzLmRvdEMoeCwgeSwgeikpIC8gZCk7XHJcbiAgICB9XHJcbiAgICBtYXAobWV0aG9kOiAoeDogbnVtYmVyLCBpOiBudW1iZXIpID0+IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubWFwU2VsZihtZXRob2QpO1xyXG4gICAgfVxyXG4gICAgbWFwU2VsZihtZXRob2Q6ICh4OiBudW1iZXIsIGk6IG51bWJlcikgPT4gbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IG1ldGhvZCh0aGlzLl94LCAwKTtcclxuICAgICAgICB0aGlzLl95ID0gbWV0aG9kKHRoaXMuX3ksIDEpO1xyXG4gICAgICAgIHRoaXMuX3ogPSBtZXRob2QodGhpcy5feiwgMik7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdFgoYTogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RYU2VsZihhKTtcclxuICAgIH1cclxuICAgIHJvdFhTZWxmKGE6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhKSwgYyA9IE1hdGguY29zKGEpO1xyXG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLl95ICogYyAtIHRoaXMuX3ogKiBzO1xyXG4gICAgICAgIHRoaXMuX3ogPSB0aGlzLl95ICogcyArIHRoaXMuX3ogKiBjO1xyXG4gICAgICAgIHRoaXMuX3kgPSB5O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByb3RZKGE6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90WVNlbGYoYSk7XHJcbiAgICB9XHJcbiAgICByb3RZU2VsZihhOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSksIGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCB6ID0gdGhpcy5feiAqIGMgLSB0aGlzLl94ICogcztcclxuICAgICAgICB0aGlzLl94ID0gdGhpcy5feCAqIGMgKyB0aGlzLl96ICogcztcclxuICAgICAgICB0aGlzLl96ID0gejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm90WihhOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdFpTZWxmKGEpO1xyXG4gICAgfVxyXG4gICAgcm90WlNlbGYoYTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGEpLCBjID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3QgeCA9IHRoaXMuX3ggKiBjIC0gdGhpcy5feSAqIHM7XHJcbiAgICAgICAgdGhpcy5feSA9IHRoaXMuX3ggKiBzICsgdGhpcy5feSAqIGM7XHJcbiAgICAgICAgdGhpcy5feCA9IHg7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdEF4aXMoYXhpczogVmVjMywgYW5nbGU6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90QXhpc1NlbGYoYXhpcywgYW5nbGUpO1xyXG4gICAgfVxyXG4gICAgcm90QXhpc1NlbGYoYXhpczogVmVjMywgYW5nbGU6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGF4aXMgPSBheGlzLm5vcm0oKTtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYW5nbGUpLCBjID0gTWF0aC5jb3MoYW5nbGUpO1xyXG4gICAgICAgIGNvbnN0IGNyb3NzID0gYXhpcy5jcm9zcyh0aGlzKTtcclxuICAgICAgICBjb25zdCBkb3QgPSBheGlzLmRvdCh0aGlzKTtcclxuICAgICAgICBsZXQgeCA9IHRoaXMuX3gsIHkgPSB0aGlzLl95LCB6ID0gdGhpcy5fejtcclxuICAgICAgICB0aGlzLl94ID0geCAqIGMgKyBjcm9zcy5feCAqIHMgKyBheGlzLl94ICogZG90ICogKDEgLSBjKTtcclxuICAgICAgICB0aGlzLl95ID0geSAqIGMgKyBjcm9zcy5feSAqIHMgKyBheGlzLl95ICogZG90ICogKDEgLSBjKTtcclxuICAgICAgICB0aGlzLl96ID0geiAqIGMgKyBjcm9zcy5feiAqIHMgKyBheGlzLl96ICogZG90ICogKDEgLSBjKTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm90WFlaKHJvdDogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90WFlaU2VsZihyb3QpO1xyXG4gICAgfVxyXG4gICAgcm90WFlaU2VsZihyb3Q6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3RYU2VsZihyb3QuX3gpLnJvdFlTZWxmKHJvdC5feSkucm90WlNlbGYocm90Ll96KTtcclxuICAgIH1cclxuICAgIHJvdFhZWkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90WFlaU2VsZkMoeCwgeSwgeik7XHJcbiAgICB9XHJcbiAgICByb3RYWVpTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90WFNlbGYoeCkucm90WVNlbGYoeSkucm90WlNlbGYoeik7XHJcbiAgICB9XHJcbiAgICByb3RaWVgocm90OiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RaWVhTZWxmKHJvdCk7XHJcbiAgICB9XHJcbiAgICByb3RaWVhTZWxmKHJvdDogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvdFpTZWxmKHJvdC5feikucm90WVNlbGYocm90Ll95KS5yb3RYU2VsZihyb3QuX3gpO1xyXG4gICAgfVxyXG4gICAgcm90WllYQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RaWVhTZWxmQyh4LCB5LCB6KTtcclxuICAgIH1cclxuICAgIHJvdFpZWFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3RaU2VsZih6KS5yb3RZU2VsZih5KS5yb3RYU2VsZih4KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFZlYzIge1xyXG4gICAgY29uc3RydWN0b3IodjogVmVjMiB8IHt4OiBudW1iZXIsIHk6IG51bWJlcn0pO1xyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpO1xyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyIHwge3g6bnVtYmVyLCB5Om51bWJlcn0sIHk/OiBudW1iZXIpIHtcclxuICAgICAgICBpZih0eXBlb2YgeCA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICB0aGlzLl94ID0geC54O1xyXG4gICAgICAgICAgICB0aGlzLl95ID0geC55O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ggPSB4O1xyXG4gICAgICAgICAgICB0aGlzLl95ID0geSBhcyBudW1iZXI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF94OiBudW1iZXI7XHJcbiAgICBnZXQgeCgpIHsgcmV0dXJuIHRoaXMuX3g7IH1cclxuICAgIHNldCB4KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl94ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgIH1cclxuICAgIF95OiBudW1iZXI7XHJcbiAgICBnZXQgeSgpIHsgcmV0dXJuIHRoaXMuX3k7IH1cclxuICAgIHNldCB5KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl95ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgIH1cclxuICAgIG9uTXV0YXRlPzogKCkgPT4gdm9pZDtcclxuXHJcbiAgICBtdXRhdGUoKSB7XHJcbiAgICAgICAgaWYodGhpcy5vbk11dGF0ZSlcclxuICAgICAgICAgICAgdGhpcy5vbk11dGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFN0YXRpYyBDb25zdHJ1Y3RvcnNcclxuICAgIHN0YXRpYyBmaWxsKG46IG51bWJlcik6IFZlYzIgeyByZXR1cm4gbmV3IFZlYzIobiwgbik7IH1cclxuICAgIHN0YXRpYyB6ZXJvKCk6IFZlYzIgeyByZXR1cm4gVmVjMi5maWxsKDApOyB9XHJcbiAgICBzdGF0aWMgb25lKCk6IFZlYzIgeyByZXR1cm4gVmVjMi5maWxsKDEpOyB9XHJcbiAgICBzdGF0aWMgeEF4aXMoKTogVmVjMiB7IHJldHVybiBuZXcgVmVjMigxLCAwKTsgfVxyXG4gICAgc3RhdGljIHlBeGlzKCk6IFZlYzIgeyByZXR1cm4gbmV3IFZlYzIoMCwgMSk7IH1cclxuICAgIHN0YXRpYyByYW5kb20oKTogVmVjMiB7XHJcbiAgICAgICAgY29uc3QgYSA9IE1hdGgucmFuZG9tKCkgKiAyICogTWF0aC5QSTtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoTWF0aC5jb3MoYSksIE1hdGguc2luKGEpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBNaXNjZWxsYW5lb3VzXHJcbiAgICBnZXRJKGk6IG51bWJlcik6IG51bWJlciB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgc3dpdGNoKGkpIHtcclxuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gdGhpcy5feDtcclxuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gdGhpcy5feTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIHNldEkoaTogbnVtYmVyLCB2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBzd2l0Y2goaSkge1xyXG4gICAgICAgICAgICBjYXNlIDA6IHRoaXMuX3ggPSB2OyByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgMTogdGhpcy5feSA9IHY7IHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgIH1cclxuICAgIHNldChvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSBvdGhlci5feDtcclxuICAgICAgICB0aGlzLl95ID0gb3RoZXIuX3k7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHNldEMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0geDtcclxuICAgICAgICB0aGlzLl95ID0geTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xyXG4gICAgICAgIHlpZWxkIHRoaXMuX3g7XHJcbiAgICAgICAgeWllbGQgdGhpcy5feTtcclxuICAgIH1cclxuICAgIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGA8JHt0aGlzLl94LnRvRml4ZWQoMil9LCAke3RoaXMuX3kudG9GaXhlZCgyKX0+YDtcclxuICAgIH1cclxuICAgIHRvQXJyYXkoKTogW251bWJlciwgbnVtYmVyXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLl94LCB0aGlzLl95XTtcclxuICAgIH1cclxuICAgIGNsb25lKCk6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxjdWxhdGlvbnNcclxuICAgIGxlbmd0aCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy5kb3QodGhpcykpO1xyXG4gICAgfVxyXG4gICAgZG90KG90aGVyOiBWZWMyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5feCAqIG90aGVyLl94ICsgdGhpcy5feSAqIG90aGVyLl95O1xyXG4gICAgfVxyXG4gICAgZG90Qyh4OiBudW1iZXIsIHk6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ggKiB4ICsgdGhpcy5feSAqIHk7XHJcbiAgICB9XHJcbiAgICBhbmdsZVRvKG90aGVyOiBWZWMyKTogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBjID0gdGhpcy5sZW5ndGgoKSAqIG90aGVyLmxlbmd0aCgpO1xyXG4gICAgICAgIGlmKGMgPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoRU1hdGguY2xhbXAodGhpcy5kb3Qob3RoZXIpIC8gYywgLTEsIDEpKTtcclxuICAgIH1cclxuICAgIHNpZ25lZEFuZ2xlVG8ob3RoZXI6IFZlYzIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKHRoaXMuX3ggKiBvdGhlci5feSAtIHRoaXMuX3kgKiBvdGhlci5feCwgdGhpcy5kb3Qob3RoZXIpKTtcclxuICAgIH1cclxuICAgIGRpc3RUbyhvdGhlcjogVmVjMik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViKG90aGVyKS5sZW5ndGgoKTtcclxuICAgIH1cclxuICAgIGRpc3RUb0MoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN1YkMoeCwgeSkubGVuZ3RoKCk7XHJcbiAgICB9XHJcbiAgICBzdHJpY3RFcXVhbHMob3RoZXI6IFZlYzIpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5feCA9PSBvdGhlci5feCAmJiB0aGlzLl95ID09IG90aGVyLl95O1xyXG4gICAgfVxyXG4gICAgaXNDbG9zZShvdGhlcjogVmVjMiwgZSA9IDFlLTYpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gRU1hdGguaXNDbG9zZSh0aGlzLl94LCBvdGhlci5feCwgZSkgJiYgRU1hdGguaXNDbG9zZSh0aGlzLl95LCBvdGhlci5feSwgZSk7XHJcbiAgICB9XHJcbiAgICBpc1plcm8oZSA9IDFlLTYpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gRU1hdGguaXNaZXJvKHRoaXMuX3gsIGUpICYmIEVNYXRoLmlzWmVybyh0aGlzLl95LCBlKTtcclxuICAgIH1cclxuICAgIHRoZXRhKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodGhpcy5feSwgdGhpcy5feCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gT3BlcmF0aW9uc1xyXG4gICAgYWRkKG90aGVyOiBWZWMyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMuX3ggKyBvdGhlci5feCwgdGhpcy5feSArIG90aGVyLl95KTtcclxuICAgIH1cclxuICAgIGFkZFNlbGYob3RoZXI6IFZlYzIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICs9IG90aGVyLl94O1xyXG4gICAgICAgIHRoaXMuX3kgKz0gb3RoZXIuX3k7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZEMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5feCArIHgsIHRoaXMuX3kgKyB5KTtcclxuICAgIH1cclxuICAgIGFkZFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCArPSB4O1xyXG4gICAgICAgIHRoaXMuX3kgKz0geTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkRihuOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5feCArIG4sIHRoaXMuX3kgKyBuKTtcclxuICAgIH1cclxuICAgIGFkZFNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0gbjtcclxuICAgICAgICB0aGlzLl95ICs9IG47XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZChvdGhlcjogVmVjMiwgczogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5hZGRTY2FsZWRTZWxmKG90aGVyLCBzKTtcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZFNlbGYob3RoZXI6IFZlYzIsIHM6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0gb3RoZXIuX3ggKiBzO1xyXG4gICAgICAgIHRoaXMuX3kgKz0gb3RoZXIuX3kgKiBzO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWRDKHg6IG51bWJlciwgeTogbnVtYmVyLCBzOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmFkZFNjYWxlZFNlbGZDKHgsIHksIHMpO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHM6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0geCAqIHM7XHJcbiAgICAgICAgdGhpcy5feSArPSB5ICogcztcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3ViKG90aGVyOiBWZWMyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMuX3ggLSBvdGhlci5feCwgdGhpcy5feSAtIG90aGVyLl95KTtcclxuICAgIH1cclxuICAgIHN1YlNlbGYob3RoZXI6IFZlYzIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94IC09IG90aGVyLl94O1xyXG4gICAgICAgIHRoaXMuX3kgLT0gb3RoZXIuX3k7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN1YkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5feCAtIHgsIHRoaXMuX3kgLSB5KTtcclxuICAgIH1cclxuICAgIHN1YlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAtPSB4O1xyXG4gICAgICAgIHRoaXMuX3kgLT0geTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3ViRihuOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5feCAtIG4sIHRoaXMuX3kgLSBuKTtcclxuICAgIH1cclxuICAgIHN1YlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggLT0gbjtcclxuICAgICAgICB0aGlzLl95IC09IG47XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJzdWIob3RoZXI6IFZlYzIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIob3RoZXIuX3ggLSB0aGlzLl94LCBvdGhlci5feSAtIHRoaXMuX3kpO1xyXG4gICAgfVxyXG4gICAgcnN1YlNlbGYob3RoZXI6IFZlYzIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gb3RoZXIuX3ggLSB0aGlzLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSBvdGhlci5feSAtIHRoaXMuX3k7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJzdWJDKHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHggLSB0aGlzLl94LCB5IC0gdGhpcy5feSk7XHJcbiAgICB9XHJcbiAgICByc3ViU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0geCAtIHRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IHkgLSB0aGlzLl95O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByc3ViRihuOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIobiAtIHRoaXMuX3gsIG4gLSB0aGlzLl95KTtcclxuICAgIH1cclxuICAgIHJzdWJTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gbiAtIHRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IG4gLSB0aGlzLl95O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbXVsKG90aGVyOiBWZWMyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMuX3ggKiBvdGhlci5feCwgdGhpcy5feSAqIG90aGVyLl95KTtcclxuICAgIH1cclxuICAgIG11bFNlbGYob3RoZXI6IFZlYzIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICo9IG90aGVyLl94O1xyXG4gICAgICAgIHRoaXMuX3kgKj0gb3RoZXIuX3k7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG11bEMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5feCAqIHgsIHRoaXMuX3kgKiB5KTtcclxuICAgIH1cclxuICAgIG11bFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAqPSB4O1xyXG4gICAgICAgIHRoaXMuX3kgKj0geTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbXVsRihuOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5feCAqIG4sIHRoaXMuX3kgKiBuKTtcclxuICAgIH1cclxuICAgIG11bFNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKj0gbjtcclxuICAgICAgICB0aGlzLl95ICo9IG47XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGRpdihvdGhlcjogVmVjMik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLl94IC8gb3RoZXIuX3gsIHRoaXMuX3kgLyBvdGhlci5feSk7XHJcbiAgICB9XHJcbiAgICBkaXZTZWxmKG90aGVyOiBWZWMyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAvPSBvdGhlci5feDtcclxuICAgICAgICB0aGlzLl95IC89IG90aGVyLl95O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBkaXZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMuX3ggLyB4LCB0aGlzLl95IC8geSk7XHJcbiAgICB9XHJcbiAgICBkaXZTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggLz0geDtcclxuICAgICAgICB0aGlzLl95IC89IHk7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGRpdkYobjogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMuX3ggLyBuLCB0aGlzLl95IC8gbik7XHJcbiAgICB9XHJcbiAgICBkaXZTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94IC89IG47XHJcbiAgICAgICAgdGhpcy5feSAvPSBuO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByZGl2KG90aGVyOiBWZWMyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKG90aGVyLl94IC8gdGhpcy5feCwgb3RoZXIuX3kgLyB0aGlzLl95KTtcclxuICAgIH1cclxuICAgIHJkaXZTZWxmKG90aGVyOiBWZWMyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IG90aGVyLl94IC8gdGhpcy5feDtcclxuICAgICAgICB0aGlzLl95ID0gb3RoZXIuX3kgLyB0aGlzLl95O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByZGl2Qyh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih4IC8gdGhpcy5feCwgeSAvIHRoaXMuX3kpO1xyXG4gICAgfVxyXG4gICAgcmRpdlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IHggLyB0aGlzLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSB5IC8gdGhpcy5feTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmRpdkYobjogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKG4gLyB0aGlzLl94LCBuIC8gdGhpcy5feSk7XHJcbiAgICB9XHJcbiAgICByZGl2U2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IG4gLyB0aGlzLl94O1xyXG4gICAgICAgIHRoaXMuX3kgPSBuIC8gdGhpcy5feTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbmVnKCk6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMigtdGhpcy5feCwgLXRoaXMuX3kpO1xyXG4gICAgfVxyXG4gICAgbmVnU2VsZigpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gLXRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IC10aGlzLl95O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBsZXJwKG90aGVyOiBWZWMyLCB0OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxlcnBTZWxmKG90aGVyLCB0KTtcclxuICAgIH1cclxuICAgIGxlcnBTZWxmKG90aGVyOiBWZWMyLCB0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICs9IChvdGhlci5feCAtIHRoaXMuX3gpICogdDtcclxuICAgICAgICB0aGlzLl95ICs9IChvdGhlci5feSAtIHRoaXMuX3kpICogdDtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbGVycEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHQ6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubGVycFNlbGZDKHgsIHksIHQpO1xyXG4gICAgfVxyXG4gICAgbGVycFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICs9ICh4IC0gdGhpcy5feCkgKiB0O1xyXG4gICAgICAgIHRoaXMuX3kgKz0gKHkgLSB0aGlzLl95KSAqIHQ7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG5vcm0oKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5ub3JtU2VsZigpO1xyXG4gICAgfVxyXG4gICAgbm9ybVNlbGYoKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgbWFnID0gdGhpcy5sZW5ndGgoKTtcclxuICAgICAgICBpZihtYWcgPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdlNlbGZDKG1hZywgbWFnKTtcclxuICAgIH1cclxuICAgIHJlc2NhbGUobWFnOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJlc2NhbGVTZWxmKG1hZyk7XHJcbiAgICB9XHJcbiAgICByZXNjYWxlU2VsZihtYWc6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1TZWxmKCkubXVsU2VsZkMobWFnLCBtYWcpO1xyXG4gICAgfVxyXG4gICAgbG9vayhvdGhlcjogVmVjMik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubG9va1NlbGYob3RoZXIpO1xyXG4gICAgfVxyXG4gICAgbG9va1NlbGYob3RoZXI6IFZlYzIpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yc3ViU2VsZihvdGhlcikubm9ybVNlbGYoKTtcclxuICAgIH1cclxuICAgIGNsYW1wTGVuZ3RoKGE6IG51bWJlciwgYjogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5jbGFtcExlbmd0aFNlbGYoYSwgYik7XHJcbiAgICB9XHJcbiAgICBjbGFtcExlbmd0aFNlbGYoYTogbnVtYmVyLCBiOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNjYWxlU2VsZihFTWF0aC5jbGFtcCh0aGlzLmxlbmd0aCgpLCBhLCBiKSk7XHJcbiAgICB9XHJcbiAgICBzZXREb3Qob3RoZXI6IFZlYzIsIHRhcmdldDogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5zZXREb3RTZWxmKG90aGVyLCB0YXJnZXQpO1xyXG4gICAgfVxyXG4gICAgc2V0RG90U2VsZihvdGhlcjogVmVjMiwgdGFyZ2V0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBkID0gb3RoZXIuZG90KG90aGVyKTtcclxuICAgICAgICBpZihkID09PSAwKSByZXR1cm4gdGhpcztcclxuICAgICAgICByZXR1cm4gdGhpcy5hZGRTY2FsZWRTZWxmKG90aGVyLCAodGFyZ2V0IC0gdGhpcy5kb3Qob3RoZXIpKSAvIGQpO1xyXG4gICAgfVxyXG4gICAgc2V0RG90Qyh4OiBudW1iZXIsIHk6IG51bWJlciwgdGFyZ2V0OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnNldERvdFNlbGZDKHgsIHksIHRhcmdldCk7XHJcbiAgICB9XHJcbiAgICBzZXREb3RTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgdGFyZ2V0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBkID0geCp4ICsgeSp5O1xyXG4gICAgICAgIGlmKGQgPT09IDApIHJldHVybiB0aGlzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNjYWxlZFNlbGZDKHgsIHksICh0YXJnZXQgLSB0aGlzLmRvdEMoeCwgeSkpIC8gZCk7XHJcbiAgICB9XHJcbiAgICBtYXAobWV0aG9kOiAoeDogbnVtYmVyLCBpOiBudW1iZXIpID0+IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubWFwU2VsZihtZXRob2QpO1xyXG4gICAgfVxyXG4gICAgbWFwU2VsZihtZXRob2Q6ICh4OiBudW1iZXIsIGk6IG51bWJlcikgPT4gbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IG1ldGhvZCh0aGlzLl94LCAwKTtcclxuICAgICAgICB0aGlzLl95ID0gbWV0aG9kKHRoaXMuX3ksIDEpO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByb3RhdGUoYTogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RhdGVTZWxmKGEpO1xyXG4gICAgfVxyXG4gICAgcm90YXRlU2VsZihhOiBudW1iZXIpIDogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGEpLCBjID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3QgeCA9IHRoaXMueCwgeSA9IHRoaXMueTtcclxuICAgICAgICB0aGlzLl94ID0geCAqIGMgLSB5ICogcztcclxuICAgICAgICB0aGlzLl95ID0geCAqIHMgKyB5ICogYztcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgTUFUUklYIENMQVNTRVMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gQ29sdW1uLW1ham9yIDR4NCBtYXRyaXhcclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1hdDQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7fVxyXG4gICAgXHJcbiAgICBzdGF0aWMgbmV3KCkge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIDEsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDEsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDEsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDAsIDEsXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyB0cmFuc2xhdGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIDEsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDEsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDEsIDAsXHJcbiAgICAgICAgICAgIHgsIHksIHosIDEsXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBzY2FsZSh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgeCwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgeSwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMCwgeiwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJvdGF0ZVgoYTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKGEpO1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhKTtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAxLCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCBjLCBzLCAwLFxyXG4gICAgICAgICAgICAwLCAtcywgYywgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcm90YXRlWShhOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGEpO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIGMsIDAsIC1zLCAwLFxyXG4gICAgICAgICAgICAwLCAxLCAwLCAwLFxyXG4gICAgICAgICAgICBzLCAwLCBjLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyByb3RhdGVaKGE6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSk7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgYywgcywgMCwgMCxcclxuICAgICAgICAgICAgLXMsIGMsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDEsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDAsIDFcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHBlcnNwZWN0aXZlKGZvdlk6IG51bWJlciwgYXNwZWN0OiBudW1iZXIsIG5lYXI6IG51bWJlciA9IDEsIGZhcjogbnVtYmVyID0gMTAwMCkge1xyXG4gICAgICAgIGNvbnN0IGYgPSAxIC8gTWF0aC50YW4oZm92WSAvIDIpO1xyXG4gICAgICAgIGNvbnN0IG5mID0gMSAvIChuZWFyIC0gZmFyKTtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBmL2FzcGVjdCwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgZiwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMCwgKGZhciArIG5lYXIpICogbmYsIC0xLFxyXG4gICAgICAgICAgICAwLCAwLCAoMiAqIGZhciAqIG5lYXIpICogbmYsIDBcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIG11bHRpcGx5KG0xOiBudW1iZXJbXSwgbTI6IG51bWJlcltdKSB7XHJcbiAgICAgICAgY29uc3Qgb3V0ID0gTWF0NC5uZXcoKTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTw0OyBpKyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCBqPTA7IGo8NDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRbaSo0ICsgal0gPSAoXHJcbiAgICAgICAgICAgICAgICAgICAgbTFbMCo0ICsgal0hICogbTJbaSo0ICsgMF0hXHJcbiAgICAgICAgICAgICAgICAgICAgKyBtMVsxKjQgKyBqXSEgKiBtMltpKjQgKyAxXSFcclxuICAgICAgICAgICAgICAgICAgICArIG0xWzIqNCArIGpdISAqIG0yW2kqNCArIDJdIVxyXG4gICAgICAgICAgICAgICAgICAgICsgbTFbMyo0ICsgal0hICogbTJbaSo0ICsgM10hXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLyBDb2x1bW4tbWFqb3IgM3gzIG1hdHJpeFxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0MyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gICAgc3RhdGljIG5ldygpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAxLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAxLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAxLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdHJhbnNsYXRlKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgMSwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMSwgMCxcclxuICAgICAgICAgICAgeCwgeSwgMSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHNjYWxlKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgeCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgeSwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJvdGF0ZShhOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGEpO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIGMsIHMsIDAsXHJcbiAgICAgICAgICAgIC1zLCBjLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAxLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgbXVsdGlwbHkobTE6IG51bWJlcltdLCBtMjogbnVtYmVyW10pIHtcclxuICAgICAgICBjb25zdCBvdXQgPSBNYXQzLm5ldygpO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPDM7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDsgajwzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIG91dFtpKjMgKyBqXSA9IChcclxuICAgICAgICAgICAgICAgICAgICBtMVswKjMgKyBqXSEgKiBtMltpKjMgKyAwXSFcclxuICAgICAgICAgICAgICAgICAgICArIG0xWzEqMyArIGpdISAqIG0yW2kqMyArIDFdIVxyXG4gICAgICAgICAgICAgICAgICAgICsgbTFbMiozICsgal0hICogbTJbaSozICsgMl0hXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBOT0lTRSBDTEFTUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTm9pc2Uge1xyXG4gICAgc3RhdGljIHJhbmRvbUNvbnN0YW50MyhhOiBudW1iZXIsIGI6IG51bWJlciwgYzogbnVtYmVyKSA6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgaXQgPSAoYSAqIDIzOTQ4MjM1NDkpIF4gKGIgKiA0Mzg1OTc0Mjg1MCkgXiAoYyAqIDIzMDk0NTY1MjM0KTtcclxuICAgICAgICByZXR1cm4gRU1hdGgucG1vZChpdCwgMTAwMDApIC8gMTAwMDA7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcmFuZG9tQ29uc3RhbnQ0KGE6IG51bWJlciwgYjogbnVtYmVyLCBjOiBudW1iZXIsIGQ6IG51bWJlcikgOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGl0ID0gKGEgKiAyMzk0ODIzNTQ5KSBeIChiICogNDM4NTk3NDI4NTApIF4gKGMgKiAyMzA5NDU2NTIzNCkgXiAoZCAqIDg0Mjc4MjQ1NjYpO1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5wbW9kKGl0LCAxMDAwMCkgLyAxMDAwMDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBmYWRlKHQ6IG51bWJlcikgOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0ICogdCAqIHQgKiAodCAqICh0ICogNiAtIDE1KSArIDEwKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZW5lcmF0ZVBlcmxpbjJER3JhZGllbnRzKGNvdW50ID0gMTIpIHtcclxuICAgICAgICBjb25zdCBncmFkaWVudHM6IFZlYzJbXSA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPGNvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgYW5nbGUgPSAyICogTWF0aC5QSSAqIGkvY291bnQ7XHJcbiAgICAgICAgICAgIGdyYWRpZW50cy5wdXNoKG5ldyBWZWMyKE1hdGguY29zKGFuZ2xlKSwgTWF0aC5zaW4oYW5nbGUpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBncmFkaWVudHM7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0UGVybGluMkRWZWN0b3JBdCh4OiBudW1iZXIsIHk6IG51bWJlciwgc2VlZDogbnVtYmVyLCBncmFkaWVudHM6IFZlYzJbXSkgOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gZ3JhZGllbnRzW01hdGguZmxvb3IodGhpcy5yYW5kb21Db25zdGFudDMoc2VlZCwgeCwgeSkgKiBncmFkaWVudHMubGVuZ3RoKV0hO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldFBlcmxpbjJEVmFsdWVBdCh4OiBudW1iZXIsIHk6IG51bWJlciwgc2VlZDogbnVtYmVyLCBncmFkaWVudHM6IFZlYzJbXSkgOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGdldFBlcmxpbjJEVmVjdG9yQXQgPSB0aGlzLmdldFBlcmxpbjJEVmVjdG9yQXQuYmluZCh0aGlzKTtcclxuICAgICAgICBjb25zdCBsZXJwID0gRU1hdGgubGVycDtcclxuICAgICAgICBjb25zdCBmYWRlID0gdGhpcy5mYWRlO1xyXG4gICAgICAgIGNvbnN0IGcwID0gbmV3IFZlYzIoeCwgeSkubWFwU2VsZihNYXRoLmZsb29yKTtcclxuICAgICAgICBjb25zdCBnMSA9IG5ldyBWZWMyKGcwKS5hZGRTZWxmQygxLCAxKTtcclxuICAgICAgICBjb25zdCBmMCA9IG5ldyBWZWMyKHgsIHkpLnN1YlNlbGYoZzApO1xyXG4gICAgICAgIGNvbnN0IGYxID0gbmV3IFZlYzIoeCwgeSkuc3ViU2VsZihnMSk7XHJcbiAgICAgICAgY29uc3QgY0FBID0gZ2V0UGVybGluMkRWZWN0b3JBdChnMC54LCBnMC55LCBzZWVkLCBncmFkaWVudHMpLmRvdChmMCk7XHJcbiAgICAgICAgY29uc3QgY0FCID0gZ2V0UGVybGluMkRWZWN0b3JBdChnMC54LCBnMS55LCBzZWVkLCBncmFkaWVudHMpLmRvdEMoZjAueCwgZjEueSk7XHJcbiAgICAgICAgY29uc3QgY0JBID0gZ2V0UGVybGluMkRWZWN0b3JBdChnMS54LCBnMC55LCBzZWVkLCBncmFkaWVudHMpLmRvdEMoZjEueCwgZjAueSk7XHJcbiAgICAgICAgY29uc3QgY0JCID0gZ2V0UGVybGluMkRWZWN0b3JBdChnMS54LCBnMS55LCBzZWVkLCBncmFkaWVudHMpLmRvdChmMSk7XHJcbiAgICAgICAgY29uc3QgdHggPSBmYWRlKGYwLngpO1xyXG4gICAgICAgIGNvbnN0IHR5ID0gZmFkZShmMC55KTtcclxuICAgICAgICBjb25zdCBjQSA9IGxlcnAoY0FBLCBjQkEsIHR4KTtcclxuICAgICAgICBjb25zdCBjQiA9IGxlcnAoY0FCLCBjQkIsIHR4KTtcclxuICAgICAgICBjb25zdCBjID0gbGVycChjQSwgY0IsIHR5KTtcclxuICAgICAgICByZXR1cm4gRU1hdGguY2xhbXAoYyAqIDAuNSArIDAuNSwgMCwgMSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2VuZXJhdGVQZXJsaW4zREdyYWRpZW50cyhjb3VudCA9IDE2KSB7XHJcbiAgICAgICAgY29uc3QgZ3JhZGllbnRzOiBWZWMzW10gPSBbXTtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPGNvdW50O2krKykge1xyXG4gICAgICAgICAgICBjb25zdCB5ID0gMSAtICgyKmkpLyhjb3VudC0xKTtcclxuICAgICAgICAgICAgY29uc3QgciA9IE1hdGguc3FydCgxLXkqeSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gaSAqIE1hdGguUEkgKiAoMy1NYXRoLnNxcnQoNSkpO1xyXG4gICAgICAgICAgICBncmFkaWVudHMucHVzaChuZXcgVmVjMyhcclxuICAgICAgICAgICAgICAgIE1hdGguY29zKGFuZ2xlKSAqIHIsXHJcbiAgICAgICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICAgICAgTWF0aC5zaW4oYW5nbGUpICogcixcclxuICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBncmFkaWVudHM7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0UGVybGluM0RWZWN0b3JBdCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBzZWVkOiBudW1iZXIsIGdyYWRpZW50czogVmVjM1tdKSA6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBncmFkaWVudHNbTWF0aC5mbG9vcih0aGlzLnJhbmRvbUNvbnN0YW50NChzZWVkLCB4LCB5LCB6KSAqIGdyYWRpZW50cy5sZW5ndGgpXSE7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0UGVybGluM0RWYWx1ZUF0KHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHNlZWQ6IG51bWJlciwgZ3JhZGllbnRzOiBWZWMzW10pIDogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBnZXRQZXJsaW4zRFZlY3RvckF0ID0gdGhpcy5nZXRQZXJsaW4zRFZlY3RvckF0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgY29uc3QgbGVycCA9IEVNYXRoLmxlcnA7XHJcbiAgICAgICAgY29uc3QgZmFkZSA9IHRoaXMuZmFkZTtcclxuICAgICAgICBjb25zdCBnMCA9IG5ldyBWZWMzKHgsIHksIHopLm1hcFNlbGYoTWF0aC5mbG9vcik7XHJcbiAgICAgICAgY29uc3QgZzEgPSBuZXcgVmVjMyhnMCkuYWRkU2VsZkMoMSwgMSwgMSk7XHJcbiAgICAgICAgY29uc3QgZjAgPSBuZXcgVmVjMyh4LCB5LCB6KS5zdWJTZWxmKGcwKTtcclxuICAgICAgICBjb25zdCBmMSA9IG5ldyBWZWMzKHgsIHksIHopLnN1YlNlbGYoZzEpO1xyXG4gICAgICAgIGNvbnN0IGNBQUEgPSBnZXRQZXJsaW4zRFZlY3RvckF0KGcwLngsIGcwLnksIGcwLnosIHNlZWQsIGdyYWRpZW50cykuZG90KGYwKTtcclxuICAgICAgICBjb25zdCBjQUFCID0gZ2V0UGVybGluM0RWZWN0b3JBdChnMC54LCBnMC55LCBnMS56LCBzZWVkLCBncmFkaWVudHMpLmRvdEMoZjAueCwgZjAueSwgZjEueik7XHJcbiAgICAgICAgY29uc3QgY0FCQSA9IGdldFBlcmxpbjNEVmVjdG9yQXQoZzAueCwgZzEueSwgZzAueiwgc2VlZCwgZ3JhZGllbnRzKS5kb3RDKGYwLngsIGYxLnksIGYwLnopO1xyXG4gICAgICAgIGNvbnN0IGNBQkIgPSBnZXRQZXJsaW4zRFZlY3RvckF0KGcwLngsIGcxLnksIGcxLnosIHNlZWQsIGdyYWRpZW50cykuZG90QyhmMC54LCBmMS55LCBmMS56KTtcclxuICAgICAgICBjb25zdCBjQkFBID0gZ2V0UGVybGluM0RWZWN0b3JBdChnMS54LCBnMC55LCBnMC56LCBzZWVkLCBncmFkaWVudHMpLmRvdEMoZjEueCwgZjAueSwgZjAueik7XHJcbiAgICAgICAgY29uc3QgY0JBQiA9IGdldFBlcmxpbjNEVmVjdG9yQXQoZzEueCwgZzAueSwgZzEueiwgc2VlZCwgZ3JhZGllbnRzKS5kb3RDKGYxLngsIGYwLnksIGYxLnopO1xyXG4gICAgICAgIGNvbnN0IGNCQkEgPSBnZXRQZXJsaW4zRFZlY3RvckF0KGcxLngsIGcxLnksIGcwLnosIHNlZWQsIGdyYWRpZW50cykuZG90QyhmMS54LCBmMS55LCBmMC56KTtcclxuICAgICAgICBjb25zdCBjQkJCID0gZ2V0UGVybGluM0RWZWN0b3JBdChnMS54LCBnMS55LCBnMS56LCBzZWVkLCBncmFkaWVudHMpLmRvdChmMSk7XHJcbiAgICAgICAgY29uc3QgdHggPSBmYWRlKGYwLngpO1xyXG4gICAgICAgIGNvbnN0IHR5ID0gZmFkZShmMC55KTtcclxuICAgICAgICBjb25zdCB0eiA9IGZhZGUoZjAueik7XHJcbiAgICAgICAgY29uc3QgY0FBID0gbGVycChjQUFBLCBjQkFBLCB0eCk7XHJcbiAgICAgICAgY29uc3QgY0FCID0gbGVycChjQUFCLCBjQkFCLCB0eCk7XHJcbiAgICAgICAgY29uc3QgY0JBID0gbGVycChjQUJBLCBjQkJBLCB0eCk7XHJcbiAgICAgICAgY29uc3QgY0JCID0gbGVycChjQUJCLCBjQkJCLCB0eCk7XHJcbiAgICAgICAgY29uc3QgY0EgPSBsZXJwKGNBQSwgY0JBLCB0eSk7XHJcbiAgICAgICAgY29uc3QgY0IgPSBsZXJwKGNBQiwgY0JCLCB0eSk7XHJcbiAgICAgICAgY29uc3QgYyA9IGxlcnAoY0EsIGNCLCB0eik7XHJcbiAgICAgICAgcmV0dXJuIEVNYXRoLmNsYW1wKGMgKiAwLjUgKyAwLjUsIDAsIDEpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldFdvcmxleTJEUG9zaXRpb25BdEdyaWQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHNlZWQ6IG51bWJlciwgb2Zmc2V0QW1wOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB4byA9ICh0aGlzLnJhbmRvbUNvbnN0YW50Myh4LCB5LCBzZWVkKzEpIC0gMC41KSAqIG9mZnNldEFtcDtcclxuICAgICAgICBjb25zdCB5byA9ICh0aGlzLnJhbmRvbUNvbnN0YW50Myh4LCB5LCBzZWVkKzIpIC0gMC41KSAqIG9mZnNldEFtcDtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoeCArIHhvLCB5ICsgeW8pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldFdvcmxleTJEVmFsdWVBdEdyaWQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHNlZWQ6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJhbmRvbUNvbnN0YW50Myh4LCB5LCBzZWVkKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRXb3JsZXkyREF0KHg6IG51bWJlciwgeTogbnVtYmVyLCBzZWVkOiBudW1iZXIsIG9mZnNldEFtcDogbnVtYmVyLCBzZWFyY2g/OiBudW1iZXIpIHtcclxuICAgICAgICBzZWFyY2ggPSBzZWFyY2ggPz8gTWF0aC5jZWlsKG9mZnNldEFtcCkgKyAxO1xyXG4gICAgICAgIGNvbnN0IGd4ID0gTWF0aC5mbG9vcih4KTtcclxuICAgICAgICBjb25zdCBneSA9IE1hdGguZmxvb3IoeSk7XHJcbiAgICAgICAgbGV0IG1pbkRpc3QgPSBJbmZpbml0eTtcclxuICAgICAgICBsZXQgbWluRGlzdDIgPSBJbmZpbml0eTtcclxuICAgICAgICBsZXQgdmFsdWUgPSAwO1xyXG4gICAgICAgIGxldCB2YWx1ZTIgPSAwO1xyXG4gICAgICAgIGZvcihsZXQgaXg9Z3gtc2VhcmNoOyBpeDw9Z3grc2VhcmNoOyBpeCsrKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaXk9Z3ktc2VhcmNoOyBpeTw9Z3krc2VhcmNoOyBpeSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcG9pbnQgPSB0aGlzLmdldFdvcmxleTJEUG9zaXRpb25BdEdyaWQoaXgsIGl5LCBzZWVkLCBvZmZzZXRBbXApO1xyXG4gICAgICAgICAgICAgICAgbGV0IGRpc3QgPSBwb2ludC5kaXN0VG9DKHgsIHkpO1xyXG4gICAgICAgICAgICAgICAgaWYoZGlzdCA8IG1pbkRpc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBtaW5EaXN0MiA9IG1pbkRpc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUyID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgbWluRGlzdCA9IGRpc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmdldFdvcmxleTJEVmFsdWVBdEdyaWQoaXgsIGl5LCBzZWVkKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihkaXN0IDwgbWluRGlzdDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBtaW5EaXN0MiA9IGRpc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUyID0gdGhpcy5nZXRXb3JsZXkyRFZhbHVlQXRHcmlkKGl4LCBpeSwgc2VlZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHsgdmFsdWUsIHZhbHVlMiwgbWluRGlzdCwgbWluRGlzdDIgfTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRXb3JsZXkzRFBvc2l0aW9uQXRHcmlkKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHNlZWQ6IG51bWJlciwgb2Zmc2V0QW1wOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB4byA9ICh0aGlzLnJhbmRvbUNvbnN0YW50NCh4LCB5LCB6LCBzZWVkKzEpIC0gMC41KSAqIG9mZnNldEFtcDtcclxuICAgICAgICBjb25zdCB5byA9ICh0aGlzLnJhbmRvbUNvbnN0YW50NCh4LCB5LCB6LCBzZWVkKzIpIC0gMC41KSAqIG9mZnNldEFtcDtcclxuICAgICAgICBjb25zdCB6byA9ICh0aGlzLnJhbmRvbUNvbnN0YW50NCh4LCB5LCB6LCBzZWVkKzMpIC0gMC41KSAqIG9mZnNldEFtcDtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoeCArIHhvLCB5ICsgeW8sIHogKyB6byk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0V29ybGV5M0RWYWx1ZUF0R3JpZCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBzZWVkOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yYW5kb21Db25zdGFudDQoeCwgeSwgeiwgc2VlZCk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0V29ybGV5M0RBdCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBzZWVkOiBudW1iZXIsIG9mZnNldEFtcDogbnVtYmVyLCBzZWFyY2g/OiBudW1iZXIpIHtcclxuICAgICAgICBzZWFyY2ggPSBzZWFyY2ggPz8gTWF0aC5jZWlsKG9mZnNldEFtcCkgKyAxO1xyXG4gICAgICAgIGNvbnN0IGd4ID0gTWF0aC5mbG9vcih4KTtcclxuICAgICAgICBjb25zdCBneSA9IE1hdGguZmxvb3IoeSk7XHJcbiAgICAgICAgY29uc3QgZ3ogPSBNYXRoLmZsb29yKHopO1xyXG4gICAgICAgIGxldCBtaW5EaXN0ID0gSW5maW5pdHk7XHJcbiAgICAgICAgbGV0IG1pbkRpc3QyID0gSW5maW5pdHk7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gMDtcclxuICAgICAgICBsZXQgdmFsdWUyID0gMDtcclxuICAgICAgICBmb3IobGV0IGl4PWd4LXNlYXJjaDsgaXg8PWd4K3NlYXJjaDsgaXgrKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IGl5PWd5LXNlYXJjaDsgaXk8PWd5K3NlYXJjaDsgaXkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpej1nei1zZWFyY2g7IGl6PD1neitzZWFyY2g7IGl6KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcG9pbnQgPSB0aGlzLmdldFdvcmxleTNEUG9zaXRpb25BdEdyaWQoaXgsIGl5LCBpeiwgc2VlZCwgb2Zmc2V0QW1wKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGlzdCA9IHBvaW50LmRpc3RUb0MoeCwgeSwgeik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZGlzdCA8IG1pbkRpc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWluRGlzdDIgPSBtaW5EaXN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTIgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWluRGlzdCA9IGRpc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5nZXRXb3JsZXkzRFZhbHVlQXRHcmlkKGl4LCBpeSwgaXosIHNlZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihkaXN0IDwgbWluRGlzdDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWluRGlzdDIgPSBkaXN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTIgPSB0aGlzLmdldFdvcmxleTNEVmFsdWVBdEdyaWQoaXgsIGl5LCBpeiwgc2VlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7IHZhbHVlLCB2YWx1ZTIsIG1pbkRpc3QsIG1pbkRpc3QyIH07XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBDQU1FUkEgQ0xBU1NFUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgY2xhc3MgQ2FtZXJhM0Qge1xyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb24/OiBWZWMzLCBmb3ZZPzogbnVtYmVyLCBhc3BlY3Q/OiBudW1iZXIsIG5lYXI/OiBudW1iZXIsIGZhcj86IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbiA/PyBWZWMzLnplcm8oKTtcclxuICAgICAgICB0aGlzLmZvdlkgPSBmb3ZZID8/IDk1LzE4MCpNYXRoLlBJO1xyXG4gICAgICAgIHRoaXMuYXNwZWN0ID0gYXNwZWN0ID8/IDE7XHJcbiAgICAgICAgdGhpcy5uZWFyID0gbmVhciA/PyAwLjE7XHJcbiAgICAgICAgdGhpcy5mYXIgPSBmYXIgPz8gMTAwMDA7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbiA9IFZlYzMuemVybygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2ZvdlkhOiBudW1iZXI7XHJcbiAgICBnZXQgZm92WSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZm92WTtcclxuICAgIH1cclxuICAgIHNldCBmb3ZZKG46IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2ZvdlkgPSBuO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkUGVyc3BlY3RpdmVNYXRyaXggPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2FzcGVjdCE6IG51bWJlcjtcclxuICAgIGdldCBhc3BlY3QoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FzcGVjdDtcclxuICAgIH1cclxuICAgIHNldCBhc3BlY3QobjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fYXNwZWN0ID0gbjtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZFBlcnNwZWN0aXZlTWF0cml4ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9uZWFyITogbnVtYmVyO1xyXG4gICAgZ2V0IG5lYXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25lYXI7XHJcbiAgICB9XHJcbiAgICBzZXQgbmVhcihuOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9uZWFyID0gbjtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZFBlcnNwZWN0aXZlTWF0cml4ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9mYXIhOiBudW1iZXI7XHJcbiAgICBnZXQgZmFyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mYXI7XHJcbiAgICB9XHJcbiAgICBzZXQgZmFyKG46IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2ZhciA9IG47XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRQZXJzcGVjdGl2ZU1hdHJpeCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcG9zaXRpb24hOiBWZWMzO1xyXG4gICAgZ2V0IHBvc2l0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcclxuICAgIH1cclxuICAgIHNldCBwb3NpdGlvbih2OiBWZWMzKSB7XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gPSB2O1xyXG4gICAgICAgIHYub25NdXRhdGUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkVHJhbnNsYXRpb25NYXRyaXggPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFZpZXdNYXRyaXggPSB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdi5tdXRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF93b3JsZFNjYWxlID0gMTtcclxuICAgIGdldCB3b3JsZFNjYWxlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93b3JsZFNjYWxlO1xyXG4gICAgfVxyXG4gICAgc2V0IHdvcmxkU2NhbGUobjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fd29ybGRTY2FsZSA9IG47XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRUcmFuc2xhdGlvbk1hdHJpeCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRWaWV3TWF0cml4ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yb3RhdGlvbiE6IFZlYzM7XHJcbiAgICBnZXQgcm90YXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvdGF0aW9uO1xyXG4gICAgfVxyXG4gICAgc2V0IHJvdGF0aW9uKHY6IFZlYzMpIHtcclxuICAgICAgICB0aGlzLl9yb3RhdGlvbiA9IHY7XHJcbiAgICAgICAgdi5vbk11dGF0ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRGb3J3YXJkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSaWdodCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkVXAgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZEZvcndhcmRGbGF0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSb3RhdGlvbk1hdHJpeCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkVmlld01hdHJpeCA9IHRydWU7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2Lm11dGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2ZvcndhcmQgPSBWZWMzLnplcm8oKTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkRm9yd2FyZD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgZ2V0IGZvcndhcmQoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVGb3J3YXJkKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZvcndhcmQ7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVGb3J3YXJkKCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkRm9yd2FyZCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fZm9yd2FyZCA9IFZlYzMuekF4aXMoKS5uZWdTZWxmKCkucm90WFlaU2VsZih0aGlzLl9yb3RhdGlvbik7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkRm9yd2FyZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yaWdodCA9IFZlYzMuemVybygpO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRSaWdodD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgZ2V0IHJpZ2h0KCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmlnaHQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmlnaHQ7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVSaWdodCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFJpZ2h0ICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl9yaWdodCA9IFZlYzMueEF4aXMoKS5yb3RYWVpTZWxmKHRoaXMuX3JvdGF0aW9uKTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRSaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF91cCA9IFZlYzMuemVybygpO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRVcD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgZ2V0IHVwKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVXAoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdXA7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVVcCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFVwICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl91cCA9IFZlYzMueUF4aXMoKS5yb3RYWVpTZWxmKHRoaXMuX3JvdGF0aW9uKTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRVcDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9mb3J3YXJkRmxhdCA9IFZlYzMuemVybygpO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRGb3J3YXJkRmxhdD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgZ2V0IGZvcndhcmRGbGF0KCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlRm9yd2FyZEZsYXQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZm9yd2FyZEZsYXQ7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVGb3J3YXJkRmxhdCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZEZvcndhcmRGbGF0ICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl9mb3J3YXJkRmxhdCA9IFZlYzMuekF4aXMoKS5uZWdTZWxmKCkucm90WVNlbGYodGhpcy5fcm90YXRpb24ueSk7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkRm9yd2FyZEZsYXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcGVyc3BlY3RpdmVNYXRyaXg6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZFBlcnNwZWN0aXZlTWF0cml4PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgcGVyc3BlY3RpdmVNYXRyaXhPYnNlcnZlciA9IG5ldyBTaWduYWwoeyBvbkNvbm5lY3Q6IGNvbm4gPT4gY29ubi5maXJlKHRoaXMucGVyc3BlY3RpdmVNYXRyaXgpIH0pO1xyXG4gICAgZ2V0IHBlcnNwZWN0aXZlTWF0cml4KCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUGVyc3BlY3RpdmVNYXRyaXgoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGVyc3BlY3RpdmVNYXRyaXg7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVQZXJzcGVjdGl2ZU1hdHJpeCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFBlcnNwZWN0aXZlTWF0cml4ICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl9wZXJzcGVjdGl2ZU1hdHJpeCA9IE1hdDQucGVyc3BlY3RpdmUodGhpcy5fZm92WSwgdGhpcy5fYXNwZWN0LCB0aGlzLl9uZWFyLCB0aGlzLl9mYXIpO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFBlcnNwZWN0aXZlTWF0cml4O1xyXG4gICAgICAgIHRoaXMucGVyc3BlY3RpdmVNYXRyaXhPYnNlcnZlci5maXJlKHRoaXMuX3BlcnNwZWN0aXZlTWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF90cmFuc2xhdGlvbk1hdHJpeDogbnVtYmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkVHJhbnNsYXRpb25NYXRyaXg/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyB0cmFuc2xhdGlvbk1hdHJpeE9ic2VydmVyID0gbmV3IFNpZ25hbCh7IG9uQ29ubmVjdDogY29ubiA9PiBjb25uLmZpcmUodGhpcy50cmFuc2xhdGlvbk1hdHJpeCkgfSk7XHJcbiAgICBnZXQgdHJhbnNsYXRpb25NYXRyaXgoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUcmFuc2xhdGlvbk1hdHJpeCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGlvbk1hdHJpeDtcclxuICAgIH1cclxuICAgIHVwZGF0ZVRyYW5zbGF0aW9uTWF0cml4KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkVHJhbnNsYXRpb25NYXRyaXggIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3RyYW5zbGF0aW9uTWF0cml4ID0gTWF0NC50cmFuc2xhdGUoLXRoaXMuX3Bvc2l0aW9uLnggKiB0aGlzLl93b3JsZFNjYWxlLCAtdGhpcy5fcG9zaXRpb24ueSAqIHRoaXMuX3dvcmxkU2NhbGUsIC10aGlzLl9wb3NpdGlvbi56ICogdGhpcy5fd29ybGRTY2FsZSk7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkVHJhbnNsYXRpb25NYXRyaXg7XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGlvbk1hdHJpeE9ic2VydmVyLmZpcmUodGhpcy5fdmlld01hdHJpeCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcm90YXRpb25NYXRyaXg6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZFJvdGF0aW9uTWF0cml4PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgcm90YXRpb25NYXRyaXhPYnNlcnZlciA9IG5ldyBTaWduYWwoeyBvbkNvbm5lY3Q6IGNvbm4gPT4gY29ubi5maXJlKHRoaXMucm90YXRpb25NYXRyaXgpIH0pO1xyXG4gICAgZ2V0IHJvdGF0aW9uTWF0cml4KCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUm90YXRpb25NYXRyaXgoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcm90YXRpb25NYXRyaXg7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVSb3RhdGlvbk1hdHJpeCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFJvdGF0aW9uTWF0cml4ICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl9yb3RhdGlvbk1hdHJpeCA9IE1hdDQubXVsdGlwbHkoXHJcbiAgICAgICAgICAgIE1hdDQucm90YXRlWigtdGhpcy5fcm90YXRpb24ueiksXHJcbiAgICAgICAgICAgIE1hdDQubXVsdGlwbHkoXHJcbiAgICAgICAgICAgICAgICBNYXQ0LnJvdGF0ZVgoLXRoaXMuX3JvdGF0aW9uLngpLFxyXG4gICAgICAgICAgICAgICAgTWF0NC5yb3RhdGVZKC10aGlzLl9yb3RhdGlvbi55KSxcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkUm90YXRpb25NYXRyaXg7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbk1hdHJpeE9ic2VydmVyLmZpcmUodGhpcy5fdmlld01hdHJpeCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdmlld01hdHJpeDogbnVtYmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkVmlld01hdHJpeD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIHZpZXdNYXRyaXhPYnNlcnZlciA9IG5ldyBTaWduYWwoeyBvbkNvbm5lY3Q6IGNvbm4gPT4gY29ubi5maXJlKHRoaXMudmlld01hdHJpeCkgfSk7XHJcbiAgICBnZXQgdmlld01hdHJpeCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpZXdNYXRyaXgoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmlld01hdHJpeDtcclxuICAgIH1cclxuICAgIHVwZGF0ZVZpZXdNYXRyaXgoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRWaWV3TWF0cml4ICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl92aWV3TWF0cml4ID0gTWF0NC5tdWx0aXBseSh0aGlzLnJvdGF0aW9uTWF0cml4LCB0aGlzLnRyYW5zbGF0aW9uTWF0cml4KTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRWaWV3TWF0cml4O1xyXG4gICAgICAgIHRoaXMudmlld01hdHJpeE9ic2VydmVyLmZpcmUodGhpcy5fdmlld01hdHJpeCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY29tYmluZWRNYXRyaXg6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZENvbWJpbmVkTWF0cml4PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgY29tYmluZWRNYXRyaXhPYnNlcnZlciA9IG5ldyBTaWduYWwoeyBvbkNvbm5lY3Q6IGNvbm4gPT4gY29ubi5maXJlKHRoaXMuY29tYmluZWRNYXRyaXgpIH0pO1xyXG4gICAgZ2V0IGNvbWJpbmVkTWF0cml4KCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ29tYmluZWRNYXRyaXgoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29tYmluZWRNYXRyaXg7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVDb21iaW5lZE1hdHJpeCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZENvbWJpbmVkTWF0cml4ICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl9jb21iaW5lZE1hdHJpeCA9IE1hdDMubXVsdGlwbHkodGhpcy52aWV3TWF0cml4LCB0aGlzLnBlcnNwZWN0aXZlTWF0cml4KTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRDb21iaW5lZE1hdHJpeDtcclxuICAgICAgICB0aGlzLmNvbWJpbmVkTWF0cml4T2JzZXJ2ZXIuZmlyZSh0aGlzLl9jb21iaW5lZE1hdHJpeCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9va0F0KHA6IFZlYzMpIHtcclxuICAgICAgICBsZXQgZiA9IHRoaXMucG9zaXRpb24ubG9vayhwKTtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uID0gbmV3IFZlYzMoZi5waXRjaCgpLCBmLnlhdygpLCAwKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENhbWVyYTJEIHtcclxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uPzogVmVjMiwgem9vbT86IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbiA/PyBWZWMyLnplcm8oKTtcclxuICAgICAgICB0aGlzLnpvb20gPSB6b29tID8/IDE7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbiA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcG9zaXRpb24hOiBWZWMyO1xyXG4gICAgZ2V0IHBvc2l0aW9uKCkgeyByZXR1cm4gdGhpcy5fcG9zaXRpb247IH1cclxuICAgIHNldCBwb3NpdGlvbih2YWx1ZTogVmVjMikge1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24ub25NdXRhdGUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkVHJhbnNsYXRpb25NYXRyaXggPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFZpZXdNYXRyaXggPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9wb3NpdGlvbi5tdXRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF96b29tITogbnVtYmVyO1xyXG4gICAgZ2V0IHpvb20oKSB7IHJldHVybiB0aGlzLl96b29tOyB9XHJcbiAgICBzZXQgem9vbSh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fem9vbSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkU2NhbGVNYXRyaXggPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkVmlld01hdHJpeCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcm90YXRpb24hOiBudW1iZXI7XHJcbiAgICBnZXQgcm90YXRpb24oKSB7IHJldHVybiB0aGlzLl9yb3RhdGlvbjsgfVxyXG4gICAgc2V0IHJvdGF0aW9uKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9yb3RhdGlvbiA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkUm90YXRpb25NYXRyaXggPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkVmlld01hdHJpeCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSaWdodCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRVcCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmlnaHQgPSBWZWMyLnplcm8oKTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkUmlnaHQ/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGdldCByaWdodCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJpZ2h0KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JpZ2h0O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlUmlnaHQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRSaWdodCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fcmlnaHQgPSBWZWMyLnhBeGlzKCkucm90YXRlU2VsZih0aGlzLl9yb3RhdGlvbik7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkUmlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdXAgPSBWZWMyLnplcm8oKTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkVXA/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGdldCB1cCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVVwKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VwO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlVXAoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRVcCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fdXAgPSBWZWMyLnlBeGlzKCkucm90YXRlU2VsZih0aGlzLl9yb3RhdGlvbik7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkVXA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdHJhbnNsYXRpb25NYXRyaXg6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZFRyYW5zbGF0aW9uTWF0cml4PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgdHJhbnNsYXRpb25NYXRyaXhPYnNlcnZlciA9IG5ldyBTaWduYWwoeyBvbkNvbm5lY3Q6IGNvbm4gPT4gY29ubi5maXJlKHRoaXMudHJhbnNsYXRpb25NYXRyaXgpIH0pO1xyXG4gICAgZ2V0IHRyYW5zbGF0aW9uTWF0cml4KCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVHJhbnNsYXRpb25NYXRyaXgoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRpb25NYXRyaXg7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVUcmFuc2xhdGlvbk1hdHJpeCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFRyYW5zbGF0aW9uTWF0cml4ICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl90cmFuc2xhdGlvbk1hdHJpeCA9IE1hdDMudHJhbnNsYXRlKC10aGlzLnBvc2l0aW9uLngsIC10aGlzLnBvc2l0aW9uLnkpO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFZpZXdNYXRyaXg7XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGlvbk1hdHJpeE9ic2VydmVyLmZpcmUodGhpcy5fdHJhbnNsYXRpb25NYXRyaXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JvdGF0aW9uTWF0cml4OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRSb3RhdGlvbk1hdHJpeD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIHJvdGF0aW9uTWF0cml4T2JzZXJ2ZXIgPSBuZXcgU2lnbmFsKHsgb25Db25uZWN0OiBjb25uID0+IGNvbm4uZmlyZSh0aGlzLnJvdGF0aW9uTWF0cml4KSB9KTtcclxuICAgIGdldCByb3RhdGlvbk1hdHJpeCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJvdGF0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvdGF0aW9uTWF0cml4O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlUm90YXRpb25NYXRyaXgoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRSb3RhdGlvbk1hdHJpeCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fcm90YXRpb25NYXRyaXggPSBNYXQzLnJvdGF0ZSh0aGlzLnJvdGF0aW9uKTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRSb3RhdGlvbk1hdHJpeDtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uTWF0cml4T2JzZXJ2ZXIuZmlyZSh0aGlzLl9yb3RhdGlvbk1hdHJpeCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2NhbGVNYXRyaXg6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZFNjYWxlTWF0cml4PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgc2NhbGVNYXRyaXhPYnNlcnZlciA9IG5ldyBTaWduYWwoeyBvbkNvbm5lY3Q6IGNvbm4gPT4gY29ubi5maXJlKHRoaXMuc2NhbGVNYXRyaXgpIH0pO1xyXG4gICAgZ2V0IHNjYWxlTWF0cml4KCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2NhbGVNYXRyaXgoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGVNYXRyaXg7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVTY2FsZU1hdHJpeCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFNjYWxlTWF0cml4ICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl9zY2FsZU1hdHJpeCA9IE1hdDMucm90YXRlKHRoaXMuem9vbSk7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkU2NhbGVNYXRyaXg7XHJcbiAgICAgICAgdGhpcy5zY2FsZU1hdHJpeE9ic2VydmVyLmZpcmUodGhpcy5fc2NhbGVNYXRyaXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3ZpZXdNYXRyaXg6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZFZpZXdNYXRyaXg/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyB2aWV3TWF0cml4T2JzZXJ2ZXIgPSBuZXcgU2lnbmFsKHsgb25Db25uZWN0OiBjb25uID0+IGNvbm4uZmlyZSh0aGlzLnZpZXdNYXRyaXgpIH0pO1xyXG4gICAgZ2V0IHZpZXdNYXRyaXgoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaWV3TWF0cml4KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZpZXdNYXRyaXg7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVWaWV3TWF0cml4KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkVmlld01hdHJpeCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fdmlld01hdHJpeCA9IE1hdDMubXVsdGlwbHkodGhpcy5yb3RhdGlvbk1hdHJpeCwgTWF0My5tdWx0aXBseSh0aGlzLnRyYW5zbGF0aW9uTWF0cml4LCB0aGlzLnNjYWxlTWF0cml4KSk7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkVmlld01hdHJpeDtcclxuICAgICAgICB0aGlzLnZpZXdNYXRyaXhPYnNlcnZlci5maXJlKHRoaXMuX3ZpZXdNYXRyaXgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIE1FU0ggQ0xBU1NFUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGNsYXNzIFRyaU1lc2gzRCB7XHJcbiAgICBwb3NpdGlvbnM6IG51bWJlcltdID0gW107XHJcbiAgICB0ZXhjb29yZHM6IG51bWJlcltdID0gW107XHJcbiAgICBub3JtYWxzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgY29uc3RydWN0b3IoKSB7IH1cclxuXHJcbiAgICBjbG9uZSgpOiBUcmlNZXNoM0Qge1xyXG4gICAgICAgIHJldHVybiBuZXcgVHJpTWVzaDNEKCkuYXBwZW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zbGF0ZVNlbGYodjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZVNlbGZDKHYueCwgdi55LCB2LnopO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zbGF0ZVNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTMpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaV0hICs9IHg7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMV0hICs9IHk7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMl0hICs9IHo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNjYWxlU2VsZih2OiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbGVTZWxmQyh2LngsIHYueSwgdi56KTtcclxuICAgIH1cclxuXHJcbiAgICBzY2FsZVNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTMpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaV0hICo9IHg7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMV0hICo9IHk7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMl0hICo9IHo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0ZVNlbGYodjogVmVjMykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvdGF0ZVNlbGZDKHYueCwgdi55LCB2LnopO1xyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0ZVNlbGZDKGF4OiBudW1iZXIsIGF5OiBudW1iZXIsIGF6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTMpIHtcclxuICAgICAgICAgICAgbGV0IHAgPSBuZXcgVmVjMyh0aGlzLnBvc2l0aW9uc1tpXSEsIHRoaXMucG9zaXRpb25zW2krMV0hLCB0aGlzLnBvc2l0aW9uc1tpKzJdISk7XHJcbiAgICAgICAgICAgIHAucm90WFlaU2VsZkMoYXgsIGF5LCBheik7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2ldID0gcC54O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzFdID0gcC55O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzJdID0gcC56O1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLm5vcm1hbHMubGVuZ3RoOyBpKz0zKSB7XHJcbiAgICAgICAgICAgIGxldCBwID0gbmV3IFZlYzModGhpcy5ub3JtYWxzW2ldISwgdGhpcy5ub3JtYWxzW2krMV0hLCB0aGlzLm5vcm1hbHNbaSsyXSEpO1xyXG4gICAgICAgICAgICBwLnJvdFhZWlNlbGZDKGF4LCBheSwgYXopO1xyXG4gICAgICAgICAgICB0aGlzLm5vcm1hbHNbaV0gPSBwLng7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFsc1tpKzFdID0gcC55O1xyXG4gICAgICAgICAgICB0aGlzLm5vcm1hbHNbaSsyXSA9IHAuejtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRlQXJvdW5kU2VsZihvcmlnaW46IFZlYzMsIHY6IFZlYzMpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3RhdGVBcm91bmRTZWxmQyhvcmlnaW4ueCwgb3JpZ2luLnksIG9yaWdpbi56LCB2LngsIHYueSwgdi56KTtcclxuICAgIH1cclxuXHJcbiAgICByb3RhdGVBcm91bmRTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBheDogbnVtYmVyLCBheTogbnVtYmVyLCBhejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlU2VsZkMoLXgsIC15LCAteikucm90YXRlU2VsZkMoYXgsIGF5LCBheikudHJhbnNsYXRlU2VsZkMoeCwgeSwgeik7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwZW5kKC4uLm1lc2hlczogVHJpTWVzaDNEW10pOiB0aGlzIHtcclxuICAgICAgICBmb3IoY29uc3QgbWVzaCBvZiBtZXNoZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnMucHVzaCguLi5tZXNoLnBvc2l0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMudGV4Y29vcmRzLnB1c2goLi4ubWVzaC50ZXhjb29yZHMpO1xyXG4gICAgICAgICAgICB0aGlzLm5vcm1hbHMucHVzaCguLi5tZXNoLm5vcm1hbHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIGdldExpbmVzKHBvc2l0aW9uczogbnVtYmVyW10pOiBudW1iZXJbXSB7XHJcbiAgICAgICAgbGV0IGVkZ2VzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHBvc2l0aW9ucy5sZW5ndGg7IGkrPTkpIHtcclxuICAgICAgICAgICAgZWRnZXMucHVzaChwb3NpdGlvbnNbaV0hLCBwb3NpdGlvbnNbaSsxXSEsIHBvc2l0aW9uc1tpKzJdISwgcG9zaXRpb25zW2krM10hLCBwb3NpdGlvbnNbaSs0XSEsIHBvc2l0aW9uc1tpKzVdISk7XHJcbiAgICAgICAgICAgIGVkZ2VzLnB1c2gocG9zaXRpb25zW2krM10hLCBwb3NpdGlvbnNbaSs0XSEsIHBvc2l0aW9uc1tpKzVdISwgcG9zaXRpb25zW2krNl0hLCBwb3NpdGlvbnNbaSs3XSEsIHBvc2l0aW9uc1tpKzhdISk7XHJcbiAgICAgICAgICAgIGVkZ2VzLnB1c2gocG9zaXRpb25zW2krNl0hLCBwb3NpdGlvbnNbaSs3XSEsIHBvc2l0aW9uc1tpKzhdISwgcG9zaXRpb25zW2ldISwgcG9zaXRpb25zW2krMV0hLCBwb3NpdGlvbnNbaSsyXSEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZWRnZXM7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldFF1YWRMaW5lcyhwb3NpdGlvbnM6IG51bWJlcltdKTogbnVtYmVyW10ge1xyXG4gICAgICAgIGxldCBlZGdlczogbnVtYmVyW10gPSBbXTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxwb3NpdGlvbnMubGVuZ3RoOyBpKz0xOCkge1xyXG4gICAgICAgICAgICBlZGdlcy5wdXNoKHBvc2l0aW9uc1tpXSEsIHBvc2l0aW9uc1tpKzFdISwgcG9zaXRpb25zW2krMl0hLCBwb3NpdGlvbnNbaSszXSEsIHBvc2l0aW9uc1tpKzRdISwgcG9zaXRpb25zW2krNV0hKTtcclxuICAgICAgICAgICAgZWRnZXMucHVzaChwb3NpdGlvbnNbaSszXSEsIHBvc2l0aW9uc1tpKzRdISwgcG9zaXRpb25zW2krNV0hLCBwb3NpdGlvbnNbaSs2XSEsIHBvc2l0aW9uc1tpKzddISwgcG9zaXRpb25zW2krOF0hKTtcclxuICAgICAgICAgICAgZWRnZXMucHVzaChwb3NpdGlvbnNbaSs2XSEsIHBvc2l0aW9uc1tpKzddISwgcG9zaXRpb25zW2krOF0hLCBwb3NpdGlvbnNbaSs5XSEsIHBvc2l0aW9uc1tpKzEwXSEsIHBvc2l0aW9uc1tpKzExXSEpO1xyXG4gICAgICAgICAgICBlZGdlcy5wdXNoKHBvc2l0aW9uc1tpKzldISwgcG9zaXRpb25zW2krMTBdISwgcG9zaXRpb25zW2krMTFdISwgcG9zaXRpb25zW2krMTJdISwgcG9zaXRpb25zW2krMTNdISwgcG9zaXRpb25zW2krMTRdISk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlZGdlcztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRyaU1lc2gyRCB7XHJcbiAgICBwb3NpdGlvbnM6IG51bWJlcltdID0gW107XHJcbiAgICB0ZXhjb29yZHM6IG51bWJlcltdID0gW107XHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgXHJcbiAgICBjbG9uZSgpOiBUcmlNZXNoMkQge1xyXG4gICAgICAgIHJldHVybiBuZXcgVHJpTWVzaDJEKCkuYXBwZW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zbGF0ZVNlbGYodjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZVNlbGZDKHYueCwgdi55KTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2xhdGVTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mikge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpXSEgKz0geDtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsxXSEgKz0geTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2NhbGVTZWxmKHY6IFZlYzIpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zY2FsZVNlbGZDKHYueCwgdi55KTtcclxuICAgIH1cclxuXHJcbiAgICBzY2FsZVNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5wb3NpdGlvbnMubGVuZ3RoOyBpKz0yKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2ldISAqPSB4O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzFdISAqPSB5O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICByb3RhdGVTZWxmKGE6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mikge1xyXG4gICAgICAgICAgICBsZXQgcCA9IG5ldyBWZWMyKHRoaXMucG9zaXRpb25zW2ldISwgdGhpcy5wb3NpdGlvbnNbaSsxXSEpO1xyXG4gICAgICAgICAgICBwLnJvdGF0ZVNlbGYoYSk7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2ldID0gcC54O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzFdID0gcC55O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICByb3RhdGVBcm91bmRTZWxmKG9yaWdpbjogVmVjMiwgYTogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90YXRlQXJvdW5kU2VsZkMob3JpZ2luLngsIG9yaWdpbi55LCBhKTtcclxuICAgIH1cclxuXHJcbiAgICByb3RhdGVBcm91bmRTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgYTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlU2VsZkMoLXgsIC15KS5yb3RhdGVTZWxmKGEpLnRyYW5zbGF0ZVNlbGZDKHgsIHkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGVuZCguLi5tZXNoZXM6IFRyaU1lc2gyRFtdKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGNvbnN0IG1lc2ggb2YgbWVzaGVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zLnB1c2goLi4ubWVzaC5wb3NpdGlvbnMpO1xyXG4gICAgICAgICAgICB0aGlzLnRleGNvb3Jkcy5wdXNoKC4uLm1lc2gudGV4Y29vcmRzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQb2x5Z29uMkQge1xyXG4gICAgcG9zaXRpb25zOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgY29uc3RydWN0b3IoKSB7IH1cclxuXHJcbiAgICBzdGF0aWMgY3JlYXRlUG9zaXRpb25zKHBvc2l0aW9uczogbnVtYmVyW10pOiBQb2x5Z29uMkQge1xyXG4gICAgICAgIGNvbnN0IHBvbHkgPSBuZXcgUG9seWdvbjJEKCk7XHJcbiAgICAgICAgcG9seS5wb3NpdGlvbnMgPSBwb3NpdGlvbnM7XHJcbiAgICAgICAgcmV0dXJuIHBvbHk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHJlY3QoeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyKTogUG9seWdvbjJEIHtcclxuICAgICAgICBjb25zdCB4MCA9IHggLSB3LzI7XHJcbiAgICAgICAgY29uc3QgeDEgPSB4ICsgdy8yO1xyXG4gICAgICAgIGNvbnN0IHkwID0geSAtIGgvMjtcclxuICAgICAgICBjb25zdCB5MSA9IHkgKyBoLzI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlUG9zaXRpb25zKFt4MCx5MCwgeDEseTAsIHgxLHkxLCB4MCx5MV0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjaXJjbGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIHI6IG51bWJlciwgYXJjOiBudW1iZXIgPSBNYXRoLlBJICogMiwgc3RlcCA9IE1hdGguUEkgLyA4KTogUG9seWdvbjJEIHtcclxuICAgICAgICBhcmMgPSBFTWF0aC5jbGFtcChhcmMsIDAsIE1hdGguUEkgKiAyKTtcclxuICAgICAgICBsZXQgcG9zaXRpb25zOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPGFyYzsgaSs9c3RlcCkge1xyXG4gICAgICAgICAgICBwb3NpdGlvbnMucHVzaChNYXRoLmNvcyhpKSAqIHIgKyB4LCBNYXRoLnNpbihpKSAqIHIgKyB5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcG9zaXRpb25zLnB1c2goTWF0aC5jb3MoYXJjKSAqIHIgKyB4LCBNYXRoLnNpbihhcmMpICogciArIHkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVBvc2l0aW9ucyhwb3NpdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjaXJjbGVGYW4oeDogbnVtYmVyLCB5OiBudW1iZXIsIHI6IG51bWJlciwgYXJjOiBudW1iZXIgPSBNYXRoLlBJICogMiwgc3RlcCA9IE1hdGguUEkgLyA4KTogUG9seWdvbjJEIHtcclxuICAgICAgICBjb25zdCBwb2x5ID0gdGhpcy5jaXJjbGUoeCwgeSwgciwgYXJjLCBzdGVwKTtcclxuICAgICAgICBwb2x5LnBvc2l0aW9ucy5zcGxpY2UoMCwgMCwgeCwgeSk7XHJcbiAgICAgICAgcmV0dXJuIHBvbHk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNsYXRlU2VsZih2OiBWZWMyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlU2VsZkModi54LCB2LnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zbGF0ZVNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5wb3NpdGlvbnMubGVuZ3RoOyBpKz0yKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2ldISArPSB4O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzFdISArPSB5O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzY2FsZVNlbGYodjogVmVjMikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNjYWxlU2VsZkModi54LCB2LnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHNjYWxlU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTIpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaV0hICo9IHg7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMV0hICo9IHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0ZVNlbGYoYTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5wb3NpdGlvbnMubGVuZ3RoOyBpKz0zKSB7XHJcbiAgICAgICAgICAgIGxldCBwID0gbmV3IFZlYzIodGhpcy5wb3NpdGlvbnNbaV0hLCB0aGlzLnBvc2l0aW9uc1tpKzFdISk7XHJcbiAgICAgICAgICAgIHAucm90YXRlU2VsZihhKTtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaV0gPSBwLng7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMV0gPSBwLnk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0ZUFyb3VuZFNlbGYob3JpZ2luOiBWZWMyLCBhOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3RhdGVBcm91bmRTZWxmQyhvcmlnaW4ueCwgb3JpZ2luLnksIGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0ZUFyb3VuZFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCBhOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGVTZWxmQygteCwgLXkpLnJvdGF0ZVNlbGYoYSk7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd1BhdGgoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHN4ID0gMSwgc3kgPSAxKSB7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mikge1xyXG4gICAgICAgICAgICBpZihpID09IDApIGN0eC5tb3ZlVG8odGhpcy5wb3NpdGlvbnNbaV0hICogc3gsIHRoaXMucG9zaXRpb25zW2krMV0hICogc3kpO1xyXG4gICAgICAgICAgICBlbHNlIGN0eC5saW5lVG8odGhpcy5wb3NpdGlvbnNbaV0hICogc3gsIHRoaXMucG9zaXRpb25zW2krMV0hICogc3kpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldFZlcnRleChpbmRleDogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgY29uc3QgaiA9IEVNYXRoLnBtb2QoaW5kZXgsIE1hdGguZmxvb3IodGhpcy5wb3NpdGlvbnMubGVuZ3RoLzIpKSoyO1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnBvc2l0aW9uc1tqXSEsIHRoaXMucG9zaXRpb25zW2orMV0hKTtcclxuICAgIH1cclxuXHJcbiAgICBiZXZlbFNlbGYoaW5kaWNlczogU2V0PG51bWJlcj4gfCBudW1iZXJbXSwgYW1vdW50OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBpZighKGluZGljZXMgaW5zdGFuY2VvZiBTZXQpKVxyXG4gICAgICAgICAgICBpbmRpY2VzID0gbmV3IFNldChpbmRpY2VzKTtcclxuICAgICAgICBsZXQgbmV3UG9zaXRpb25zOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgIGxldCBsZW4gPSBNYXRoLmZsb29yKHRoaXMucG9zaXRpb25zLmxlbmd0aC8yKTtcclxuICAgICAgICBmb3IobGV0IGluZGV4PTA7IGluZGV4PGxlbjsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICBpZighaW5kaWNlcy5oYXMoaW5kZXgpKVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIGxldCB2QSA9IHRoaXMuZ2V0VmVydGV4KGluZGV4LTEpO1xyXG4gICAgICAgICAgICBsZXQgdkIgPSB0aGlzLmdldFZlcnRleChpbmRleCk7XHJcbiAgICAgICAgICAgIGxldCB2QyA9IHRoaXMuZ2V0VmVydGV4KGluZGV4KzEpO1xyXG4gICAgICAgICAgICBsZXQgdE1heEEgPSB2QS5kaXN0VG8odkIpO1xyXG4gICAgICAgICAgICBsZXQgdE1heEMgPSB2Qy5kaXN0VG8odkIpO1xyXG4gICAgICAgICAgICBpZihpbmRpY2VzLmhhcyhpbmRleC0xKSkgdE1heEEgLz0gMjtcclxuICAgICAgICAgICAgaWYoaW5kaWNlcy5oYXMoaW5kZXgrMSkpIHRNYXhDIC89IDI7XHJcbiAgICAgICAgICAgIGxldCBiMSA9IHZCLmFkZFNjYWxlZCh2Qi5sb29rKHZBKSwgRU1hdGguY2xhbXAoYW1vdW50LCAwLCB0TWF4QSkpO1xyXG4gICAgICAgICAgICBsZXQgYjIgPSB2Qi5hZGRTY2FsZWQodkIubG9vayh2QyksIEVNYXRoLmNsYW1wKGFtb3VudCwgMCwgdE1heEMpKTtcclxuICAgICAgICAgICAgbmV3UG9zaXRpb25zLnB1c2goYjEueCwgYjEueSwgYjIueCwgYjIueSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucG9zaXRpb25zID0gbmV3UG9zaXRpb25zO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGJldmVsQWxsU2VsZihhbW91bnQ6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBuZXdQb3NpdGlvbnM6IG51bWJlcltdID0gW107XHJcbiAgICAgICAgbGV0IGxlbiA9IE1hdGguZmxvb3IodGhpcy5wb3NpdGlvbnMubGVuZ3RoLzIpO1xyXG4gICAgICAgIGZvcihsZXQgaW5kZXg9MDsgaW5kZXg8bGVuOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgIGxldCB2QSA9IHRoaXMuZ2V0VmVydGV4KGluZGV4LTEpO1xyXG4gICAgICAgICAgICBsZXQgdkIgPSB0aGlzLmdldFZlcnRleChpbmRleCk7XHJcbiAgICAgICAgICAgIGxldCB2QyA9IHRoaXMuZ2V0VmVydGV4KGluZGV4KzEpO1xyXG4gICAgICAgICAgICBsZXQgdE1heEEgPSB2QS5kaXN0VG8odkIpIC8gMjtcclxuICAgICAgICAgICAgbGV0IHRNYXhDID0gdkMuZGlzdFRvKHZCKSAvIDI7XHJcbiAgICAgICAgICAgIGxldCBiMSA9IHZCLmFkZFNjYWxlZCh2Qi5sb29rKHZBKSwgRU1hdGguY2xhbXAoYW1vdW50LCAwLCB0TWF4QSkpO1xyXG4gICAgICAgICAgICBsZXQgYjIgPSB2Qi5hZGRTY2FsZWQodkIubG9vayh2QyksIEVNYXRoLmNsYW1wKGFtb3VudCwgMCwgdE1heEMpKTtcclxuICAgICAgICAgICAgbmV3UG9zaXRpb25zLnB1c2goYjEueCwgYjEueSwgYjIueCwgYjIueSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucG9zaXRpb25zID0gbmV3UG9zaXRpb25zO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIFBIWVNJQ1MgQ0xBU1NFUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IHR5cGUgU2hhcGUyRENvbGxpc2lvbiA9IHtcclxuICAgIGluc2lkZTogYm9vbGVhbixcclxuICAgIGNvbGxpc2lvbjogVmVjMixcclxuICAgIGRpc3RhbmNlOiBudW1iZXIsXHJcbiAgICBub3JtYWw6IFZlYzIsXHJcbn07XHJcblxyXG5leHBvcnQgY2xhc3MgUG9pbnQyRCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcG9zaXRpb246IFZlYzIpIHtcclxuXHJcbiAgICB9XHJcbiAgICBpc0luc2lkZVJlY3QocmVjdDogUmVjdDJEKSB7XHJcbiAgICAgICAgbGV0IGRpZmYgPSB0aGlzLnBvc2l0aW9uLnN1YihyZWN0LnBvc2l0aW9uKTtcclxuICAgICAgICBsZXQgZHggPSBkaWZmLmRvdChyZWN0LnJpZ2h0KTtcclxuICAgICAgICBsZXQgZHkgPSBkaWZmLmRvdChyZWN0LnVwKTtcclxuICAgICAgICByZXR1cm4gKE1hdGguYWJzKGR4KSA8PSByZWN0LnNpemUueCAmJiBNYXRoLmFicyhkeSkgPD0gcmVjdC5zaXplLnkpO1xyXG4gICAgfVxyXG4gICAgZ2V0UmVjdENvbGxpc2lvbihyZWN0OiBSZWN0MkQpOiBTaGFwZTJEQ29sbGlzaW9uIHtcclxuICAgICAgICBsZXQgZGlmZiA9IHRoaXMucG9zaXRpb24uc3ViKHJlY3QucG9zaXRpb24pO1xyXG4gICAgICAgIGxldCBkeCA9IGRpZmYuZG90KHJlY3QucmlnaHQpO1xyXG4gICAgICAgIGxldCBkeSA9IGRpZmYuZG90KHJlY3QudXApO1xyXG4gICAgICAgIGxldCBpc0luc2lkZSA9IChNYXRoLmFicyhkeCkgPCByZWN0LnNpemUueCAmJiBNYXRoLmFicyhkeSkgPCByZWN0LnNpemUueSk7XHJcbiAgICAgICAgaWYoaXNJbnNpZGUpIHtcclxuICAgICAgICAgICAgbGV0IGQxID0gTWF0aC5hYnModGhpcy5wb3NpdGlvbi5zdWIocmVjdC5wb3NpdGlvbi5hZGRTY2FsZWQocmVjdC51cCwgcmVjdC5zaXplLnkpKS5kb3QocmVjdC51cCkpO1xyXG4gICAgICAgICAgICBsZXQgZDIgPSBNYXRoLmFicyh0aGlzLnBvc2l0aW9uLnN1YihyZWN0LnBvc2l0aW9uLmFkZFNjYWxlZChyZWN0LnVwLCAtcmVjdC5zaXplLnkpKS5kb3QocmVjdC51cCkpO1xyXG4gICAgICAgICAgICBsZXQgZDMgPSBNYXRoLmFicyh0aGlzLnBvc2l0aW9uLnN1YihyZWN0LnBvc2l0aW9uLmFkZFNjYWxlZChyZWN0LnJpZ2h0LCByZWN0LnNpemUueCkpLmRvdChyZWN0LnJpZ2h0KSk7XHJcbiAgICAgICAgICAgIGxldCBkNCA9IE1hdGguYWJzKHRoaXMucG9zaXRpb24uc3ViKHJlY3QucG9zaXRpb24uYWRkU2NhbGVkKHJlY3QucmlnaHQsIC1yZWN0LnNpemUueCkpLmRvdChyZWN0LnJpZ2h0KSk7XHJcbiAgICAgICAgICAgIGxldCBtaW5JbmRleCA9IDA7XHJcbiAgICAgICAgICAgIGxldCBtaW5EaXN0ID0gZDE7XHJcbiAgICAgICAgICAgIGlmKGQyIDwgbWluRGlzdCkgeyBtaW5EaXN0ID0gZDI7IG1pbkluZGV4ID0gMTsgfVxyXG4gICAgICAgICAgICBpZihkMyA8IG1pbkRpc3QpIHsgbWluRGlzdCA9IGQzOyBtaW5JbmRleCA9IDI7IH1cclxuICAgICAgICAgICAgaWYoZDQgPCBtaW5EaXN0KSB7IG1pbkRpc3QgPSBkNDsgbWluSW5kZXggPSAzOyB9XHJcbiAgICAgICAgICAgIGxldCBlZGdlOiBWZWMyO1xyXG4gICAgICAgICAgICBsZXQgbm9ybWFsOiBWZWMyO1xyXG4gICAgICAgICAgICBzd2l0Y2gobWluSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICBlZGdlID0gcmVjdC5wb3NpdGlvbi5hZGRTY2FsZWQocmVjdC5yaWdodCwgZHgpLmFkZFNjYWxlZChyZWN0LnVwLCByZWN0LnNpemUueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsID0gcmVjdC51cDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICBlZGdlID0gcmVjdC5wb3NpdGlvbi5hZGRTY2FsZWQocmVjdC5yaWdodCwgZHgpLmFkZFNjYWxlZChyZWN0LnVwLCAtcmVjdC5zaXplLnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbCA9IHJlY3QudXAubmVnKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZSA9IHJlY3QucG9zaXRpb24uYWRkU2NhbGVkKHJlY3QudXAsIGR5KS5hZGRTY2FsZWQocmVjdC5yaWdodCwgcmVjdC5zaXplLngpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbCA9IHJlY3QucmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZSA9IHJlY3QucG9zaXRpb24uYWRkU2NhbGVkKHJlY3QudXAsIGR5KS5hZGRTY2FsZWQocmVjdC5yaWdodCwgLXJlY3Quc2l6ZS54KTtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWwgPSByZWN0LnJpZ2h0Lm5lZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBpbnNpZGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb2xsaXNpb246IGVkZ2UhLFxyXG4gICAgICAgICAgICAgICAgZGlzdGFuY2U6IC1lZGdlIS5kaXN0VG8odGhpcy5wb3NpdGlvbiksXHJcbiAgICAgICAgICAgICAgICBub3JtYWw6IG5vcm1hbCEsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkeCA9IEVNYXRoLmNsYW1wKGR4LCAtcmVjdC5zaXplLngsIHJlY3Quc2l6ZS54KTtcclxuICAgICAgICAgICAgZHkgPSBFTWF0aC5jbGFtcChkeSwgLXJlY3Quc2l6ZS55LCByZWN0LnNpemUueSk7XHJcbiAgICAgICAgICAgIGxldCBlZGdlID0gcmVjdC5wb3NpdGlvbi5hZGRTY2FsZWQocmVjdC5yaWdodCwgZHgpLmFkZFNjYWxlZChyZWN0LnVwLCBkeSk7XHJcbiAgICAgICAgICAgIGxldCBkaXN0ID0gZWRnZS5kaXN0VG8odGhpcy5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBpbnNpZGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY29sbGlzaW9uOiBlZGdlLFxyXG4gICAgICAgICAgICAgICAgZGlzdGFuY2U6IGRpc3QsXHJcbiAgICAgICAgICAgICAgICBub3JtYWw6IGVkZ2UubG9vayh0aGlzLnBvc2l0aW9uKSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBkaXN0VG9DaXJjbGUoY2lyY2xlOiBDaXJjbGUyRCkge1xyXG4gICAgICAgIGxldCBkaXN0ID0gdGhpcy5wb3NpdGlvbi5kaXN0VG8oY2lyY2xlLnBvc2l0aW9uKTtcclxuICAgICAgICByZXR1cm4gZGlzdCAtIGNpcmNsZS5yYWRpdXM7XHJcbiAgICB9XHJcbiAgICBpc0luc2lkZUNpcmNsZShjaXJjbGU6IENpcmNsZTJEKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzdFRvQ2lyY2xlKGNpcmNsZSkgPD0gMDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJheTJEIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBvcmlnaW46IFZlYzIsIHB1YmxpYyBkaXJlY3Rpb246IFZlYzIpIHtcclxuXHJcbiAgICB9XHJcbiAgICByYXljYXN0R3JpZDxUPihcclxuICAgICAgICBwcmVkaWNhdGU6IChwb3M6VmVjMiwgbm9ybWFsOlZlYzIsIGRpc3Q6bnVtYmVyKSA9PiBUIHwgdW5kZWZpbmVkLFxyXG4gICAgICAgIG1heEl0ZXJhdGlvbnMgPSAxMDAwXHJcbiAgICApOiBUIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBjb25zdCBpbnZEaXJBYnMgPSB0aGlzLmRpcmVjdGlvbi5yZGl2RigxKS5tYXAoeCA9PiBNYXRoLmFicyh4KSk7XHJcbiAgICAgICAgY29uc3Qgc2lnbiA9IHRoaXMuZGlyZWN0aW9uLm1hcCh4ID0+IHggPiAwID8gMSA6IDApO1xyXG4gICAgICAgIGNvbnN0IHN0ZXAgPSB0aGlzLmRpcmVjdGlvbi5tYXAoeCA9PiB4ID4gMCA/IDEgOiAtMSk7XHJcbiAgICAgICAgbGV0IHRNYXhYID0gaW52RGlyQWJzLnggKiAoc2lnbi54PT09MCA/ICh0aGlzLm9yaWdpbi54IC0gTWF0aC5mbG9vcih0aGlzLm9yaWdpbi54KSkgOiAoTWF0aC5mbG9vcih0aGlzLm9yaWdpbi54KSArIDEgLSB0aGlzLm9yaWdpbi54KSk7XHJcbiAgICAgICAgbGV0IHRNYXhZID0gaW52RGlyQWJzLnkgKiAoc2lnbi55PT09MCA/ICh0aGlzLm9yaWdpbi55IC0gTWF0aC5mbG9vcih0aGlzLm9yaWdpbi55KSkgOiAoTWF0aC5mbG9vcih0aGlzLm9yaWdpbi55KSArIDEgLSB0aGlzLm9yaWdpbi55KSk7XHJcbiAgICAgICAgbGV0IHBvcyA9IG5ldyBWZWMyKHRoaXMub3JpZ2luKS5tYXBTZWxmKHggPT4gTWF0aC5mbG9vcih4KSk7XHJcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gMDtcclxuICAgICAgICBsZXQgbm9ybWFsID0gVmVjMi56ZXJvKCk7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8bWF4SXRlcmF0aW9uczsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCByZXMgPSBwcmVkaWNhdGUocG9zLCBub3JtYWwsIGRpc3RhbmNlKTtcclxuICAgICAgICAgICAgaWYocmVzICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgICAgICBpZih0TWF4WCA8IHRNYXhZKSB7XHJcbiAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IHRNYXhYO1xyXG4gICAgICAgICAgICAgICAgbm9ybWFsLnNldEMoLXN0ZXAueCwgMCk7XHJcbiAgICAgICAgICAgICAgICB0TWF4WCArPSBpbnZEaXJBYnMueDtcclxuICAgICAgICAgICAgICAgIHBvcy54ICs9IHN0ZXAueDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gdE1heFk7XHJcbiAgICAgICAgICAgICAgICBub3JtYWwuc2V0QygwLCAtc3RlcC55KTtcclxuICAgICAgICAgICAgICAgIHRNYXhZICs9IGludkRpckFicy55O1xyXG4gICAgICAgICAgICAgICAgcG9zLnkgKz0gc3RlcC55O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTZWdtZW50MkQge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHN0YXJ0OiBWZWMyLCBwdWJsaWMgZW5kOiBWZWMyKSB7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmVjdDJEIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwb3NpdGlvbjogVmVjMiwgc2l6ZTogVmVjMiwgcm90YXRpb246IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbiA9IHJvdGF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3NpemUhOiBWZWMyO1xyXG4gICAgZ2V0IHNpemUoKSB7IHJldHVybiB0aGlzLl9zaXplOyB9XHJcbiAgICBzZXQgc2l6ZSh2YWx1ZTogVmVjMikge1xyXG4gICAgICAgIHRoaXMuX3NpemUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yb3RhdGlvbiE6IG51bWJlclxyXG4gICAgZ2V0IHJvdGF0aW9uKCkgeyByZXR1cm4gdGhpcy5fcm90YXRpb247IH1cclxuICAgIHNldCByb3RhdGlvbih2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fcm90YXRpb24gPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yaWdodCA9IFZlYzIuemVybygpO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRSaWdodD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgZ2V0IHJpZ2h0KCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmlnaHQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmlnaHQ7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVSaWdodCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFJpZ2h0ICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl9yaWdodCA9IFZlYzIueEF4aXMoKS5yb3RhdGVTZWxmKHRoaXMuX3JvdGF0aW9uKTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRSaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF91cCA9IFZlYzIuemVybygpO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRVcD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgZ2V0IHVwKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVXAoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdXA7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVVcCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFVwICE9IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl91cCA9IFZlYzIueUF4aXMoKS5yb3RhdGVTZWxmKHRoaXMuX3JvdGF0aW9uKTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRVcDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENpcmNsZTJEIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwb3NpdGlvbjogVmVjMiwgcHVibGljIHJhZGl1czogbnVtYmVyKSB7XHJcblxyXG4gICAgfVxyXG4gICAgZ2V0UmVjdENvbGxpc2lvbihyZWN0OiBSZWN0MkQpOiBTaGFwZTJEQ29sbGlzaW9uIHtcclxuICAgICAgICBsZXQgcmVzID0gbmV3IFBvaW50MkQodGhpcy5wb3NpdGlvbikuZ2V0UmVjdENvbGxpc2lvbihyZWN0KTtcclxuICAgICAgICByZXMuZGlzdGFuY2UgLT0gdGhpcy5yYWRpdXM7XHJcbiAgICAgICAgaWYocmVzLmRpc3RhbmNlIDw9IDApIHJlcy5pbnNpZGUgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICBnZXRDaXJjbGVDb2xsaXNpb24ob3RoZXI6IENpcmNsZTJEKTogU2hhcGUyRENvbGxpc2lvbiB7XHJcbiAgICAgICAgbGV0IGRpc3QgPSB0aGlzLnBvc2l0aW9uLmRpc3RUbyhvdGhlci5wb3NpdGlvbikgLSB0aGlzLnJhZGl1cyAtIG90aGVyLnJhZGl1cztcclxuICAgICAgICBsZXQgbm9ybWFsID0gdGhpcy5wb3NpdGlvbi5sb29rKG90aGVyLnBvc2l0aW9uKTtcclxuICAgICAgICBsZXQgY29sbGlzaW9uID0gdGhpcy5wb3NpdGlvbi5hZGRTY2FsZWQobm9ybWFsLCB0aGlzLnJhZGl1cyk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgaW5zaWRlOiBkaXN0IDw9IDAsXHJcbiAgICAgICAgICAgIGNvbGxpc2lvbixcclxuICAgICAgICAgICAgZGlzdGFuY2U6IGRpc3QsXHJcbiAgICAgICAgICAgIG5vcm1hbCxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZ2V0U2VnbWVudENvbGxpc2lvbihzZWdtZW50OiBTZWdtZW50MkQpOiBTaGFwZTJEQ29sbGlzaW9uIHtcclxuICAgICAgICBsZXQgZGlyID0gc2VnbWVudC5zdGFydC5sb29rKHNlZ21lbnQuZW5kKTtcclxuICAgICAgICBsZXQgb2ZmID0gdGhpcy5wb3NpdGlvbi5zdWIoc2VnbWVudC5zdGFydCk7XHJcbiAgICAgICAgbGV0IHQgPSBvZmYuZG90KGRpcik7XHJcbiAgICAgICAgbGV0IG1heFQgPSBzZWdtZW50LmVuZC5kaXN0VG8oc2VnbWVudC5zdGFydCk7XHJcbiAgICAgICAgdCA9IEVNYXRoLmNsYW1wKHQsIDAsIG1heFQpO1xyXG4gICAgICAgIGxldCBjb2xsaXNpb24gPSBzZWdtZW50LnN0YXJ0LmFkZFNjYWxlZChkaXIsIHQpO1xyXG4gICAgICAgIGxldCBub3JtYWwgPSBjb2xsaXNpb24ubG9vayh0aGlzLnBvc2l0aW9uKTtcclxuICAgICAgICBsZXQgZGlzdCA9IGNvbGxpc2lvbi5kaXN0VG8odGhpcy5wb3NpdGlvbikgLSB0aGlzLnJhZGl1cztcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBpbnNpZGU6IGRpc3QgPD0gMCxcclxuICAgICAgICAgICAgY29sbGlzaW9uLFxyXG4gICAgICAgICAgICBkaXN0YW5jZTogZGlzdCxcclxuICAgICAgICAgICAgbm9ybWFsLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBsZXQgQ2lyY2xlMkRNZXNoID0gbmV3IFRyaU1lc2gyRCgpO1xyXG5leHBvcnQgbGV0IENpcmNsZTJEUG9zaXRpb25zRjMyID0gbmV3IEZsb2F0MzJBcnJheShDaXJjbGUyRE1lc2gucG9zaXRpb25zKTtcclxuZXhwb3J0IGxldCBSZWN0MkRNZXNoID0gbmV3IFRyaU1lc2gyRCgpO1xyXG5leHBvcnQgbGV0IFJlY3QyRFBvc2l0aW9uc0YzMiA9IG5ldyBGbG9hdDMyQXJyYXkoUmVjdDJETWVzaC5wb3NpdGlvbnMpO1xyXG5cclxuZXhwb3J0IHR5cGUgUGh5c2ljc1BhcnQyRFNoYXBlID0gXCJyZWN0XCIgfCBcImNpcmNsZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBoeXNpY3NQYXJ0MkQge1xyXG4gICAgYW5jaG9yZWQgPSBmYWxzZTtcclxuICAgIHZlbG9jaXR5ID0gVmVjMi56ZXJvKCk7XHJcbiAgICBoYXNDb2xsaXNpb24gPSB0cnVlO1xyXG4gICAgY29sb3IgPSBuZXcgQ29sb3IoKTtcclxuICAgIHNoYWRlck9iamVjdCE6IFdHTDJPYmplY3Q7XHJcbiAgICBtYXNzID0gMTtcclxuICAgIHJlc3RpdHV0aW9uID0gMTtcclxuICAgIGdyYXZpdHkgPSA1MDA7XHJcbiAgICBjb2xsaXNpb25FdmVudDogU2lnbmFsPFtjb2xsaXNpb246IFNoYXBlMkRDb2xsaXNpb24sIHBhcnRBOiBQaHlzaWNzUGFydDJELCBwYXJ0QjogUGh5c2ljc1BhcnQyRF0+ID0gbmV3IFNpZ25hbCgpO1xyXG4gICAgY29uc3RydWN0b3Ioc2hhZGVyOiBXR0wyU2hhZGVyLCBwb3NpdGlvbjogVmVjMiwgc2l6ZTogVmVjMikge1xyXG4gICAgICAgIHRoaXMuc2hhcGVUeXBlID0gXCJjaXJjbGVcIjtcclxuICAgICAgICB0aGlzLnNoYWRlciA9IHNoYWRlcjtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zaGFkZXIhOiBXR0wyU2hhZGVyO1xyXG4gICAgdUNvbG9yPzogV0dMMkNvbXBvbmVudFVuaWZvcm07XHJcbiAgICB1Vmlldz86IFdHTDJDb21wb25lbnRVbmlmb3JtO1xyXG4gICAgZ2V0IHNoYWRlcigpIHsgcmV0dXJuIHRoaXMuX3NoYWRlcjsgfVxyXG4gICAgc2V0IHNoYWRlcih2YWx1ZTogV0dMMlNoYWRlcikge1xyXG4gICAgICAgIHRoaXMuX3NoYWRlciA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudUNvbG9yID0gdmFsdWUuZ2V0VW5pZm9ybShcInVfY29sb3JcIik7XHJcbiAgICAgICAgdGhpcy51VmlldyA9IHZhbHVlLmdldFVuaWZvcm0oXCJ1X3ZpZXdcIik7XHJcbiAgICAgICAgaWYodGhpcy5zaGFkZXJPYmplY3QpXHJcbiAgICAgICAgICAgIHRoaXMuc2hhZGVyT2JqZWN0LnJlbW92ZSgpO1xyXG4gICAgICAgIHRoaXMuc2hhZGVyT2JqZWN0ID0gdmFsdWUuY3JlYXRlT2JqZWN0KCk7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlU2hhZGVyT2JqZWN0RGF0YSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JvdGF0aW9uITogbnVtYmVyO1xyXG4gICAgZ2V0IHJvdGF0aW9uKCkgeyByZXR1cm4gdGhpcy5fcm90YXRpb247IH1cclxuICAgIHNldCByb3RhdGlvbih2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYodmFsdWUgPT0gdGhpcy5fcm90YXRpb24pXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl9yb3RhdGlvbiA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkUm90YXRpb25NYXRyaXggPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkVmlld01hdHJpeCA9IHRydWU7XHJcbiAgICAgICAgaWYodGhpcy5zaGFwZSBpbnN0YW5jZW9mIFJlY3QyRCkge1xyXG4gICAgICAgICAgICB0aGlzLnNoYXBlLnJvdGF0aW9uID0gdGhpcy5fcm90YXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgfSBcclxuXHJcbiAgICBsYXN0UG9zaXRpb24gPSBWZWMyLnplcm8oKTtcclxuICAgIHByaXZhdGUgX3Bvc2l0aW9uITogVmVjMjtcclxuICAgIGdldCBwb3NpdGlvbigpIHsgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uOyB9XHJcbiAgICBzZXQgcG9zaXRpb24odmFsdWU6IFZlYzIpIHtcclxuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uLm9uTXV0YXRlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFRyYW5zbGF0aW9uTWF0cml4ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRWaWV3TWF0cml4ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24ubXV0YXRlKCk7XHJcbiAgICAgICAgdGhpcy5zaGFwZS5wb3NpdGlvbiA9IHRoaXMuX3Bvc2l0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHNoYXBlITogQ2lyY2xlMkQgfCBSZWN0MkQ7XHJcbiAgICBwcml2YXRlIF9zaGFwZVR5cGU6IFBoeXNpY3NQYXJ0MkRTaGFwZSA9IFwicmVjdFwiO1xyXG4gICAgZ2V0IHNoYXBlVHlwZSgpIHsgcmV0dXJuIHRoaXMuX3NoYXBlVHlwZTsgfVxyXG4gICAgc2V0IHNoYXBlVHlwZSh2YWx1ZTogUGh5c2ljc1BhcnQyRFNoYXBlKSB7XHJcbiAgICAgICAgdGhpcy5fc2hhcGVUeXBlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlU2hhZGVyT2JqZWN0RGF0YSgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfdXBkYXRlU2hhZGVyT2JqZWN0RGF0YSgpIHtcclxuICAgICAgICBzd2l0Y2godGhpcy5fc2hhcGVUeXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJyZWN0XCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoYWRlck9iamVjdC5zZXREYXRhKFwiYV9wb3NpdGlvblwiLCBSZWN0MkRQb3NpdGlvbnNGMzIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGFwZSA9IG5ldyBSZWN0MkQodGhpcy5wb3NpdGlvbiwgdGhpcy5zaXplLCB0aGlzLnJvdGF0aW9uKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiY2lyY2xlXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoYWRlck9iamVjdC5zZXREYXRhKFwiYV9wb3NpdGlvblwiLCBDaXJjbGUyRFBvc2l0aW9uc0YzMik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoYXBlID0gbmV3IENpcmNsZTJEKHRoaXMucG9zaXRpb24sIE1hdGgubWF4KHRoaXMuc2l6ZS54LCB0aGlzLnNpemUueSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3NpemUhOiBWZWMyO1xyXG4gICAgZ2V0IHNpemUoKSB7IHJldHVybiB0aGlzLl9zaXplOyB9XHJcbiAgICBzZXQgc2l6ZSh2YWx1ZTogVmVjMikge1xyXG4gICAgICAgIHRoaXMuX3NpemUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9zaXplLm9uTXV0YXRlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFNjYWxlTWF0cml4ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRWaWV3TWF0cml4ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fc2l6ZS5tdXRhdGUoKTtcclxuICAgICAgICBpZih0aGlzLnNoYXBlIGluc3RhbmNlb2YgUmVjdDJEKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hhcGUuc2l6ZSA9IHRoaXMuX3NpemU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zaGFwZS5yYWRpdXMgPSBNYXRoLm1heCh0aGlzLl9zaXplLngsIHRoaXMuX3NpemUueSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIF90cmFuc2xhdGlvbk1hdHJpeDogbnVtYmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkVHJhbnNsYXRpb25NYXRyaXg/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGdldCB0cmFuc2xhdGlvbk1hdHJpeCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRyYW5zbGF0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9uTWF0cml4O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlVHJhbnNsYXRpb25NYXRyaXgoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRUcmFuc2xhdGlvbk1hdHJpeCAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fdHJhbnNsYXRpb25NYXRyaXggPSBNYXQzLnRyYW5zbGF0ZSh0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcm90YXRpb25NYXRyaXg6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZFJvdGF0aW9uTWF0cml4PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBnZXQgcm90YXRpb25NYXRyaXgoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSb3RhdGlvbk1hdHJpeCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yb3RhdGlvbk1hdHJpeDtcclxuICAgIH1cclxuICAgIHVwZGF0ZVJvdGF0aW9uTWF0cml4KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkUm90YXRpb25NYXRyaXggIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3JvdGF0aW9uTWF0cml4ID0gTWF0My5yb3RhdGUodGhpcy5yb3RhdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2NhbGVNYXRyaXg6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZFNjYWxlTWF0cml4PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBnZXQgc2NhbGVNYXRyaXgoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTY2FsZU1hdHJpeCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zY2FsZU1hdHJpeDtcclxuICAgIH1cclxuICAgIHVwZGF0ZVNjYWxlTWF0cml4KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkU2NhbGVNYXRyaXggIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3NjYWxlTWF0cml4ID0gTWF0My5zY2FsZSh0aGlzLnNpemUueCwgdGhpcy5zaXplLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3ZpZXdNYXRyaXg6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZFZpZXdNYXRyaXg/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGdldCB2aWV3TWF0cml4KCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlld01hdHJpeCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92aWV3TWF0cml4O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlVmlld01hdHJpeCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFZpZXdNYXRyaXggIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3ZpZXdNYXRyaXggPSBNYXQzLm11bHRpcGx5KHRoaXMucm90YXRpb25NYXRyaXgsIE1hdDMubXVsdGlwbHkodGhpcy50cmFuc2xhdGlvbk1hdHJpeCwgdGhpcy5zY2FsZU1hdHJpeCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc29sdmVDaXJjbGVDaXJjbGVDb2xsaXNpb24ob3RoZXI6IFBoeXNpY3NQYXJ0MkQsIGNvbGxpc2lvbjogU2hhcGUyRENvbGxpc2lvbikge1xyXG4gICAgICAgIGlmKCFjb2xsaXNpb24uaW5zaWRlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgY29uc3QgdmVsQWxvbmdOb3JtYWwgPSBvdGhlci52ZWxvY2l0eS5zdWIodGhpcy52ZWxvY2l0eSkuZG90KGNvbGxpc2lvbi5ub3JtYWwpO1xyXG4gICAgICAgIGNvbnN0IG1pID0gKDEvdGhpcy5tYXNzICsgMS9vdGhlci5tYXNzKTtcclxuICAgICAgICBpZiAodmVsQWxvbmdOb3JtYWwgPCAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3RpdHV0aW9uID0gTWF0aC5taW4odGhpcy5yZXN0aXR1dGlvbiwgb3RoZXIucmVzdGl0dXRpb24pO1xyXG4gICAgICAgICAgICBjb25zdCBqID0gLSgxK3Jlc3RpdHV0aW9uKSAqIHZlbEFsb25nTm9ybWFsIC8gbWk7XHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHkuYWRkU2NhbGVkU2VsZihjb2xsaXNpb24ubm9ybWFsLCBqICogLTEgLyB0aGlzLm1hc3MpO1xyXG4gICAgICAgICAgICBvdGhlci52ZWxvY2l0eS5hZGRTY2FsZWRTZWxmKGNvbGxpc2lvbi5ub3JtYWwsIGogKiAxIC8gb3RoZXIubWFzcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGNvcnJlY3Rpb24gPSBjb2xsaXNpb24ubm9ybWFsLnJlc2NhbGUoTWF0aC5tYXgoLWNvbGxpc2lvbi5kaXN0YW5jZSAtIDFlLTQsIDApIC8gbWkgKiAwLjgpO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24uYWRkU2NhbGVkU2VsZihjb3JyZWN0aW9uLCAtMS90aGlzLm1hc3MpO1xyXG4gICAgICAgIG90aGVyLnBvc2l0aW9uLmFkZFNjYWxlZFNlbGYoY29ycmVjdGlvbiwgMS9vdGhlci5tYXNzKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNvbHZlQ2lyY2xlQW5jaG9yZWRSZWN0Q29sbGlzaW9uKG90aGVyOiBQaHlzaWNzUGFydDJELCBjb2xsaXNpb246IFNoYXBlMkRDb2xsaXNpb24pIHtcclxuICAgICAgICBpZighY29sbGlzaW9uLmluc2lkZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHZlbEFsb25nTm9ybWFsID0gdGhpcy52ZWxvY2l0eS5zdWIob3RoZXIudmVsb2NpdHkpLmRvdChjb2xsaXNpb24ubm9ybWFsKTtcclxuICAgICAgICBpZiAodmVsQWxvbmdOb3JtYWwgPCAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3RpdHV0aW9uID0gTWF0aC5taW4odGhpcy5yZXN0aXR1dGlvbiwgb3RoZXIucmVzdGl0dXRpb24pO1xyXG4gICAgICAgICAgICBjb25zdCBqID0gLSgxK3Jlc3RpdHV0aW9uKSAqIHZlbEFsb25nTm9ybWFsO1xyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5LmFkZFNjYWxlZFNlbGYoY29sbGlzaW9uLm5vcm1hbCwgaik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHJhZGl1cyA9IE1hdGgubWF4KHRoaXMuc2l6ZS54LCB0aGlzLnNpemUueSk7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IGNvbGxpc2lvbi5jb2xsaXNpb24uYWRkU2NhbGVkKGNvbGxpc2lvbi5ub3JtYWwsIHJhZGl1cyArIDFlLTYpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihjYW1lcmE/OiBDYW1lcmEyRCkge1xyXG4gICAgICAgIGlmKHRoaXMudUNvbG9yKVxyXG4gICAgICAgICAgICB0aGlzLnVDb2xvci5zZXRWYWx1ZXMoW3RoaXMuY29sb3IuciwgdGhpcy5jb2xvci5nLCB0aGlzLmNvbG9yLmJdKTtcclxuICAgICAgICBpZih0aGlzLnVWaWV3KVxyXG4gICAgICAgICAgICB0aGlzLnVWaWV3LnNldFZhbHVlcyhjYW1lcmEgPyBNYXQzLm11bHRpcGx5KHRoaXMudmlld01hdHJpeCwgY2FtZXJhLnZpZXdNYXRyaXgpIDogdGhpcy52aWV3TWF0cml4KTtcclxuICAgICAgICB0aGlzLnNoYWRlck9iamVjdC5kcmF3VHJpYW5nbGVzKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBSYXkzRCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgb3JpZ2luOiBWZWMzLCBwdWJsaWMgZGlyZWN0aW9uOiBWZWMzKSB7XHJcblxyXG4gICAgfVxyXG4gICAgcmF5Y2FzdFZveGVsczxUPihcclxuICAgICAgICBwcmVkaWNhdGU6IChwb3M6VmVjMywgbm9ybWFsOlZlYzMsIGRpc3Q6bnVtYmVyKSA9PiBUIHwgdW5kZWZpbmVkLFxyXG4gICAgICAgIG1heEl0ZXJhdGlvbnMgPSAxMDAwXHJcbiAgICApOiBUIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBjb25zdCBpbnZEaXJBYnMgPSB0aGlzLmRpcmVjdGlvbi5yZGl2RigxKS5tYXAoeCA9PiBNYXRoLmFicyh4KSk7XHJcbiAgICAgICAgY29uc3Qgc2lnbiA9IHRoaXMuZGlyZWN0aW9uLm1hcCh4ID0+IHggPiAwID8gMSA6IDApO1xyXG4gICAgICAgIGNvbnN0IHN0ZXAgPSB0aGlzLmRpcmVjdGlvbi5tYXAoeCA9PiB4ID4gMCA/IDEgOiAtMSk7XHJcbiAgICAgICAgbGV0IHRNYXhYID0gaW52RGlyQWJzLnggKiAoc2lnbi54PT09MCA/ICh0aGlzLm9yaWdpbi54IC0gTWF0aC5mbG9vcih0aGlzLm9yaWdpbi54KSkgOiAoTWF0aC5mbG9vcih0aGlzLm9yaWdpbi54KSArIDEgLSB0aGlzLm9yaWdpbi54KSk7XHJcbiAgICAgICAgbGV0IHRNYXhZID0gaW52RGlyQWJzLnkgKiAoc2lnbi55PT09MCA/ICh0aGlzLm9yaWdpbi55IC0gTWF0aC5mbG9vcih0aGlzLm9yaWdpbi55KSkgOiAoTWF0aC5mbG9vcih0aGlzLm9yaWdpbi55KSArIDEgLSB0aGlzLm9yaWdpbi55KSk7XHJcbiAgICAgICAgbGV0IHRNYXhaID0gaW52RGlyQWJzLnogKiAoc2lnbi56PT09MCA/ICh0aGlzLm9yaWdpbi56IC0gTWF0aC5mbG9vcih0aGlzLm9yaWdpbi56KSkgOiAoTWF0aC5mbG9vcih0aGlzLm9yaWdpbi56KSArIDEgLSB0aGlzLm9yaWdpbi56KSk7XHJcbiAgICAgICAgbGV0IHBvcyA9IG5ldyBWZWMzKHRoaXMub3JpZ2luKS5tYXBTZWxmKHggPT4gTWF0aC5mbG9vcih4KSk7XHJcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gMDtcclxuICAgICAgICBsZXQgbm9ybWFsID0gVmVjMy56ZXJvKCk7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8bWF4SXRlcmF0aW9uczsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCByZXMgPSBwcmVkaWNhdGUocG9zLCBub3JtYWwsIGRpc3RhbmNlKTtcclxuICAgICAgICAgICAgaWYocmVzICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgICAgICBpZih0TWF4WCA8IHRNYXhZKSB7XHJcbiAgICAgICAgICAgICAgICBpZih0TWF4WCA8IHRNYXhaKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2UgPSB0TWF4WDtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWwuc2V0Qygtc3RlcC54LCAwLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICB0TWF4WCArPSBpbnZEaXJBYnMueDtcclxuICAgICAgICAgICAgICAgICAgICBwb3MueCArPSBzdGVwLng7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gdE1heFo7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsLnNldEMoMCwgMCwgLXN0ZXAueik7XHJcbiAgICAgICAgICAgICAgICAgICAgdE1heFogKz0gaW52RGlyQWJzLno7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zLnogKz0gc3RlcC56O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYodE1heFkgPCB0TWF4Wikge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gdE1heFk7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsLnNldEMoMCwgLXN0ZXAueSwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdE1heFkgKz0gaW52RGlyQWJzLnk7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zLnkgKz0gc3RlcC55O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IHRNYXhaO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbC5zZXRDKDAsIDAsIC1zdGVwLnopO1xyXG4gICAgICAgICAgICAgICAgICAgIHRNYXhaICs9IGludkRpckFicy56O1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcy56ICs9IHN0ZXAuejtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgcmF5Y2FzdEJveChib3VuZHM6IFZlYzNbXSkge1xyXG4gICAgICAgIGNvbnN0IGludkRpciA9IHRoaXMuZGlyZWN0aW9uLnJkaXZGKDEpO1xyXG4gICAgICAgIGNvbnN0IHNpZ24gPSB0aGlzLmRpcmVjdGlvbi5tYXAoeCA9PiB4ID4gMCA/IDEgOiAwKTtcclxuICAgICAgICBjb25zdCBzaWduRmxpcCA9IHRoaXMuZGlyZWN0aW9uLm1hcCh4ID0+IHggPiAwID8gMCA6IDEpO1xyXG4gICAgICAgIGNvbnN0IHN0ZXBGbGlwID0gdGhpcy5kaXJlY3Rpb24ubWFwKHggPT4geCA+IDAgPyAtMSA6IDEpO1xyXG4gICAgICAgIGxldCB0bWluID0gKGJvdW5kc1tzaWduRmxpcC54XSEueCAtIHRoaXMub3JpZ2luLngpICogaW52RGlyLng7XHJcbiAgICAgICAgbGV0IHRtYXggPSAoYm91bmRzW3NpZ24ueF0hLnggLSB0aGlzLm9yaWdpbi54KSAqIGludkRpci54O1xyXG4gICAgICAgIGxldCBub3JtYWwgPSBuZXcgVmVjMyhzdGVwRmxpcC54LDAsMCk7XHJcbiAgICAgICAgbGV0IHR5bWluID0gKGJvdW5kc1tzaWduRmxpcC55XSEueSAtIHRoaXMub3JpZ2luLnkpICogaW52RGlyLnk7XHJcbiAgICAgICAgbGV0IHR5bWF4ID0gKGJvdW5kc1tzaWduLnldIS55IC0gdGhpcy5vcmlnaW4ueSkgKiBpbnZEaXIueTtcclxuICAgICAgICBpZigodG1pbiA+IHR5bWF4KSB8fCAodHltaW4gPiB0bWF4KSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYodHltaW4gPiB0bWluKSB7XHJcbiAgICAgICAgICAgIHRtaW4gPSB0eW1pbjtcclxuICAgICAgICAgICAgbm9ybWFsID0gbmV3IFZlYzMoMCxzdGVwRmxpcC55LDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eW1heCA8IHRtYXgpIHRtYXggPSB0eW1heDtcclxuICAgICAgICBsZXQgdHptaW4gPSAoYm91bmRzW3NpZ25GbGlwLnpdIS56IC0gdGhpcy5vcmlnaW4ueikgKiBpbnZEaXIuejtcclxuICAgICAgICBsZXQgdHptYXggPSAoYm91bmRzW3NpZ24uel0hLnogLSB0aGlzLm9yaWdpbi56KSAqIGludkRpci56O1xyXG4gICAgICAgIGlmKCh0bWluID4gdHptYXgpIHx8ICh0em1pbiA+IHRtYXgpKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBpZih0em1pbiA+IHRtaW4pIHtcclxuICAgICAgICAgICAgdG1pbiA9IHR6bWluO1xyXG4gICAgICAgICAgICBub3JtYWwgPSBuZXcgVmVjMygwLDAsc3RlcEZsaXAueik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR6bWF4IDwgdG1heCkgdG1heCA9IHR6bWF4O1xyXG4gICAgICAgIGNvbnN0IGRpc3RhbmNlID0gdG1pbiA8IDAgPyAwIDogdG1pbjtcclxuICAgICAgICByZXR1cm4geyBub3JtYWwsIGRpc3RhbmNlLCBpbnRlcnNlY3Rpb246IHRoaXMub3JpZ2luLmFkZFNjYWxlZCh0aGlzLmRpcmVjdGlvbiwgZGlzdGFuY2UpIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQaHlzaWNzMkRFbnZpcm9ubWVudCB7XHJcbiAgICBwYXJ0T2JzZXJ2ZXI6IFNpZ25hbDxbb2JqOiBhbnldPiA9IG5ldyBTaWduYWwoe29uQ29ubmVjdDooY29ubik9Pntmb3IoY29uc3Qgb2JqIG9mIHRoaXMucGFydHMpY29ubi5maXJlKG9iaik7fX0pO1xyXG4gICAgcGFydHM6IFBoeXNpY3NQYXJ0MkRbXSA9IFtdO1xyXG4gICAgZGVmYXVsdFNoYWRlcjogV0dMMlNoYWRlcjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdFNoYWRlciA9IG5ldyBXR0wyU2hhZGVyKFxyXG4gICAgICAgICAgICBnbCxcclxuICAgICAgICAgICAgYCN2ZXJzaW9uIDMwMCBlc1xyXG4gICAgICAgICAgICAgICAgaW4gdmVjMiBhX3Bvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgdW5pZm9ybSBtYXQzIHVfdmlldztcclxuICAgICAgICAgICAgICAgIHZvaWQgbWFpbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB2ZWMyIHZfcG9zaXRpb24gPSAodV92aWV3ICogdmVjMyhhX3Bvc2l0aW9uLCAxKSkueHk7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2xfUG9zaXRpb24gPSB2ZWM0KHZfcG9zaXRpb24sIDAsIDEpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGAsXHJcbiAgICAgICAgICAgIGAjdmVyc2lvbiAzMDAgZXNcclxuICAgICAgICAgICAgICAgIHByZWNpc2lvbiBoaWdocCBmbG9hdDtcclxuICAgICAgICAgICAgICAgIHVuaWZvcm0gdmVjMyBjb2xvcjtcclxuICAgICAgICAgICAgICAgIG91dCB2ZWM0IG91dENvbG9yO1xyXG4gICAgICAgICAgICAgICAgdm9pZCBtYWluKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dENvbG9yID0gdmVjNChjb2xvci8yNTUuLCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYCxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgYWRkUGFydChwYXJ0OiBQaHlzaWNzUGFydDJEKSB7XHJcbiAgICAgICAgdGhpcy5wYXJ0cy5wdXNoKHBhcnQpO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBmb3IobGV0IHBhcnQgb2YgdGhpcy5wYXJ0cykge1xyXG4gICAgICAgICAgICBpZihwYXJ0LmFuY2hvcmVkKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJ0LnZlbG9jaXR5ID0gcGFydC5wb3NpdGlvbi5zdWIocGFydC5sYXN0UG9zaXRpb24pLm11bEYoMS9kdCk7XHJcbiAgICAgICAgICAgICAgICBwYXJ0Lmxhc3RQb3NpdGlvbi5zZXRDKHBhcnQucG9zaXRpb24ueCwgcGFydC5wb3NpdGlvbi55KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBhcnQubGFzdFBvc2l0aW9uLnNldEMocGFydC5wb3NpdGlvbi54LCBwYXJ0LnBvc2l0aW9uLnkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPDM7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IHBhcnQgb2YgdGhpcy5wYXJ0cykge1xyXG4gICAgICAgICAgICAgICAgaWYocGFydC5hbmNob3JlZCkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBpZihpPT0wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFydC52ZWxvY2l0eS55IC09IHBhcnQuZ3Jhdml0eSAqIGR0O1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcnQucG9zaXRpb24uYWRkU2NhbGVkU2VsZihwYXJ0LnZlbG9jaXR5LCBkdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZihwYXJ0LnNoYXBlVHlwZSA9PSBcImNpcmNsZVwiICYmICFwYXJ0LmFuY2hvcmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBvdGhlciBvZiB0aGlzLnBhcnRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFvdGhlci5oYXNDb2xsaXNpb24pIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihvdGhlciA9PSBwYXJ0KSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYob3RoZXIuc2hhcGVUeXBlID09IFwiY2lyY2xlXCIgJiYgIW90aGVyLmFuY2hvcmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29sbGlzaW9uID0gKHBhcnQuc2hhcGUgYXMgQ2lyY2xlMkQpLmdldENpcmNsZUNvbGxpc2lvbihvdGhlci5zaGFwZSBhcyBDaXJjbGUyRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0LnJlc29sdmVDaXJjbGVDaXJjbGVDb2xsaXNpb24ob3RoZXIsIGNvbGxpc2lvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihjb2xsaXNpb24uaW5zaWRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydC5jb2xsaXNpb25FdmVudC5maXJlKGNvbGxpc2lvbiwgcGFydCwgb3RoZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyLmNvbGxpc2lvbkV2ZW50LmZpcmUoY29sbGlzaW9uLCBwYXJ0LCBvdGhlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29sbGlzaW9uID0gKHBhcnQuc2hhcGUgYXMgQ2lyY2xlMkQpLmdldFJlY3RDb2xsaXNpb24ob3RoZXIuc2hhcGUgYXMgUmVjdDJEKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnQucmVzb2x2ZUNpcmNsZUFuY2hvcmVkUmVjdENvbGxpc2lvbihvdGhlciwgY29sbGlzaW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNvbGxpc2lvbi5pbnNpZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0LmNvbGxpc2lvbkV2ZW50LmZpcmUoY29sbGlzaW9uLCBwYXJ0LCBvdGhlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXIuY29sbGlzaW9uRXZlbnQuZmlyZShjb2xsaXNpb24sIHBhcnQsIG90aGVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJlbmRlckFsbChjYW1lcmE6IENhbWVyYTJEKSB7XHJcbiAgICAgICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQgfCB0aGlzLmdsLkRFUFRIX0JVRkZFUl9CSVQpO1xyXG4gICAgICAgIGZvcihsZXQgcGFydCBvZiB0aGlzLnBhcnRzKSB7XHJcbiAgICAgICAgICAgIHBhcnQucmVuZGVyKGNhbWVyYSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBFVkVOVCBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGNsYXNzIFNpZ25hbDxUIGV4dGVuZHMgYW55W10+IHtcclxuICAgIGNvbm5lY3Rpb25zOiBDb25uZWN0aW9uPFQ+W10gPSBbXTtcclxuICAgIHRpbWVGaXJlZDogbnVtYmVyID0gLU51bWJlci5NQVhfVkFMVUU7XHJcbiAgICBvbkNvbm5lY3Q/OiAoY29ubjogQ29ubmVjdGlvbjxUPikgPT4gdm9pZDtcclxuICAgIGNvbnN0cnVjdG9yKHtcclxuICAgICAgICBvbkNvbm5lY3QgPSB1bmRlZmluZWQsXHJcbiAgICB9OiB7XHJcbiAgICAgICAgb25Db25uZWN0PzogKGNvbm46IENvbm5lY3Rpb248VD4pID0+IHZvaWQsXHJcbiAgICB9ID0ge30pIHtcclxuICAgICAgICB0aGlzLm9uQ29ubmVjdCA9IG9uQ29ubmVjdDtcclxuICAgIH1cclxuICAgIGNvbm5lY3QoY2FsbGJhY2s6ICguLi5hcmdzOiBUKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgY29uc3QgY29ubiA9IG5ldyBDb25uZWN0aW9uPFQ+KHRoaXMsIGNhbGxiYWNrKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLnB1c2goY29ubik7XHJcbiAgICAgICAgaWYodGhpcy5vbkNvbm5lY3QpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkNvbm5lY3QoY29ubik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb25uO1xyXG4gICAgfVxyXG4gICAgb25jZShjYWxsYmFjazogKC4uLmFyZ3M6IFQpID0+IHZvaWQpIHtcclxuICAgICAgICBjb25zdCBjb25uID0gdGhpcy5jb25uZWN0KCguLi5hcmdzOiBUKSA9PiB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKC4uLmFyZ3MpO1xyXG4gICAgICAgICAgICBjb25uLmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gY29ubjtcclxuICAgIH1cclxuICAgIGFzeW5jIHdhaXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPFQ+KHJlcyA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMub25jZSgoLi4uYXJnczogVCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzKGFyZ3MpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGZpcmUoLi4uYXJnczogVCkge1xyXG4gICAgICAgIHRoaXMudGltZUZpcmVkID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgZm9yKGNvbnN0IGNvbm4gb2YgWy4uLnRoaXMuY29ubmVjdGlvbnNdKSB7XHJcbiAgICAgICAgICAgIGNvbm4uZmlyZSguLi5hcmdzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXRUaW1lU2luY2VGaXJlZCgpIHtcclxuICAgICAgICByZXR1cm4gcGVyZm9ybWFuY2Uubm93KCkgLyAxMDAwIC0gdGhpcy50aW1lRmlyZWQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uPFQgZXh0ZW5kcyBhbnlbXT4ge1xyXG4gICAgZ3JvdXBzOiBDb25uZWN0aW9uR3JvdXBbXSA9IFtdO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHNpZ25hbDogU2lnbmFsPFQ+LCBwdWJsaWMgY2FsbGJhY2s6ICguLi5hcmdzOiBUKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBkaXNjb25uZWN0KCkge1xyXG4gICAgICAgIHRoaXMuc2lnbmFsLmNvbm5lY3Rpb25zLnNwbGljZSh0aGlzLnNpZ25hbC5jb25uZWN0aW9ucy5pbmRleE9mKHRoaXMpLCAxKTtcclxuICAgICAgICBmb3IoY29uc3QgZ3JvdXAgb2YgdGhpcy5ncm91cHMpIHtcclxuICAgICAgICAgICAgZ3JvdXAuY29ubmVjdGlvbnMuc3BsaWNlKGdyb3VwLmNvbm5lY3Rpb25zLmluZGV4T2YodGhpcyksIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdyb3VwcyA9IFtdO1xyXG4gICAgfVxyXG4gICAgZmlyZSguLi5hcmdzOiBUKSB7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFjayguLi5hcmdzKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEh0bWxDb25uZWN0aW9uIHtcclxuICAgIGdyb3VwczogQ29ubmVjdGlvbkdyb3VwW10gPSBbXTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRXZlbnRUYXJnZXQsIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBjYWxsYmFjazogKGU6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLm5hbWUsIHRoaXMuY2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgZGlzY29ubmVjdCgpIHtcclxuICAgICAgICB0aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5uYW1lLCB0aGlzLmNhbGxiYWNrKTtcclxuICAgICAgICBmb3IoY29uc3QgZ3JvdXAgb2YgdGhpcy5ncm91cHMpIHtcclxuICAgICAgICAgICAgZ3JvdXAuY29ubmVjdGlvbnMuc3BsaWNlKGdyb3VwLmNvbm5lY3Rpb25zLmluZGV4T2YodGhpcyksIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdyb3VwcyA9IFtdO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvbkdyb3VwIHtcclxuICAgIGNvbm5lY3Rpb25zOiAoQ29ubmVjdGlvbjxhbnk+IHwgSHRtbENvbm5lY3Rpb24pW10gPSBbXTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuICAgIGFkZChjb25uOiBDb25uZWN0aW9uPGFueT4gfCBIdG1sQ29ubmVjdGlvbikge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMucHVzaChjb25uKTtcclxuICAgIH1cclxuICAgIGRpc2Nvbm5lY3RBbGwoKSB7XHJcbiAgICAgICAgZm9yKGNvbnN0IGNvbm4gb2YgWy4uLnRoaXMuY29ubmVjdGlvbnNdKSB7XHJcbiAgICAgICAgICAgIGNvbm4uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zID0gW107XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgV0VCR0wyIFNIQURFUiBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgY2xhc3MgV0dMMkNvbXBvbmVudFNoYWRlciB7XHJcbiAgICB3U2hhZGVyOiBXZWJHTFNoYWRlcjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCwgcHVibGljIHR5cGU6IFwidmVydGV4XCIgfCBcImZyYWdtZW50XCIsIHB1YmxpYyBzb3VyY2U6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHdTaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIodHlwZSA9PSBcInZlcnRleFwiID8gZ2wuVkVSVEVYX1NIQURFUiA6IGdsLkZSQUdNRU5UX1NIQURFUik7XHJcbiAgICAgICAgaWYod1NoYWRlciA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBjcmVhdGUgc2hhZGVyXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLndTaGFkZXIgPSB3U2hhZGVyO1xyXG4gICAgICAgIGdsLnNoYWRlclNvdXJjZSh3U2hhZGVyLCBzb3VyY2UpO1xyXG4gICAgICAgIGdsLmNvbXBpbGVTaGFkZXIod1NoYWRlcilcclxuICAgICAgICBpZighZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHdTaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSkge1xyXG4gICAgICAgICAgICBjb25zdCBsb2cgPSBnbC5nZXRTaGFkZXJJbmZvTG9nKHdTaGFkZXIpO1xyXG4gICAgICAgICAgICBnbC5kZWxldGVTaGFkZXIod1NoYWRlcik7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBjb21waWxlIHNoYWRlcjogXCIgKyBsb2cpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGRlbGV0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdsLmRlbGV0ZVNoYWRlcih0aGlzLndTaGFkZXIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMkNvbXBvbmVudFByb2dyYW0ge1xyXG4gICAgd1Byb2dyYW06IFdlYkdMUHJvZ3JhbTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCwgcHVibGljIGNTaGFkZXJWOiBXR0wyQ29tcG9uZW50U2hhZGVyLCBwdWJsaWMgY1NoYWRlckY6IFdHTDJDb21wb25lbnRTaGFkZXIpIHtcclxuICAgICAgICBjb25zdCB3UHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcclxuICAgICAgICBpZiAoIXdQcm9ncmFtKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBjcmVhdGUgcHJvZ3JhbVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy53UHJvZ3JhbSA9IHdQcm9ncmFtO1xyXG4gICAgICAgIGdsLmF0dGFjaFNoYWRlcih3UHJvZ3JhbSwgY1NoYWRlclYud1NoYWRlcik7XHJcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKHdQcm9ncmFtLCBjU2hhZGVyRi53U2hhZGVyKTtcclxuICAgICAgICBnbC5saW5rUHJvZ3JhbSh3UHJvZ3JhbSk7XHJcbiAgICAgICAgaWYoIWdsLmdldFByb2dyYW1QYXJhbWV0ZXIod1Byb2dyYW0sIGdsLkxJTktfU1RBVFVTKSkge1xyXG4gICAgICAgICAgICBjb25zdCBsb2cgPSBnbC5nZXRQcm9ncmFtSW5mb0xvZyh3UHJvZ3JhbSk7XHJcbiAgICAgICAgICAgIGdsLmRlbGV0ZVByb2dyYW0od1Byb2dyYW0pO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gbGluayBwcm9ncmFtOiBcIiArIGxvZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2V0QWN0aXZlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSh0aGlzLndQcm9ncmFtKTtcclxuICAgIH1cclxuICAgIGRlbGV0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdsLmRlbGV0ZVByb2dyYW0odGhpcy53UHJvZ3JhbSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIFdHTDJBdHRyaWJ1dGVUeXBlID0gKFxyXG4gICAgXCJmbG9hdFwiIHwgXCJpbnRcIiB8IFwidWludFwiIHwgXCJ2ZWMyXCIgfCBcInZlYzNcIiB8IFwidmVjNFwiXHJcbiAgICB8IFwiaXZlYzJcIiB8IFwiaXZlYzNcIiB8IFwiaXZlYzRcIiB8IFwidXZlYzJcIiB8IFwidXZlYzNcIiB8IFwidXZlYzRcIlxyXG4pO1xyXG5cclxuZXhwb3J0IHR5cGUgV0dMMlVuaWZvcm1UeXBlID0gKFxyXG4gICAgXCJmbG9hdFwiIHwgXCJpbnRcIiB8IFwidWludFwiIHwgXCJ2ZWMyXCIgfCBcInZlYzNcIlxyXG4gICAgfCBcInZlYzRcIiB8IFwiaXZlYzJcIiB8IFwiaXZlYzNcIiB8IFwiaXZlYzRcIiB8IFwidXZlYzJcIlxyXG4gICAgfCBcInV2ZWMzXCIgfCBcInV2ZWM0XCIgfCBcIm1hdDJcIiB8IFwibWF0M1wiIHwgXCJtYXQ0XCJcclxuKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBXR0wyQ29tcG9uZW50QnVmZmVyIHtcclxuICAgIHdUeXBlOiBHTGVudW07XHJcbiAgICB3RGltZW5zaW9uczogbnVtYmVyO1xyXG4gICAgd0J1ZmZlcjogV2ViR0xCdWZmZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsIHR5cGU6IFdHTDJBdHRyaWJ1dGVUeXBlKSB7XHJcbiAgICAgICAgY29uc3QgYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICAgICAgaWYoIWJ1ZmZlcikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gY3JlYXRlIGJ1ZmZlclwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy53QnVmZmVyID0gYnVmZmVyO1xyXG4gICAgICAgIHN3aXRjaCh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJmbG9hdFwiOiB0aGlzLndUeXBlID0gZ2wuRkxPQVQ7IHRoaXMud0RpbWVuc2lvbnMgPSAxOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInZlYzJcIjogdGhpcy53VHlwZSA9IGdsLkZMT0FUOyB0aGlzLndEaW1lbnNpb25zID0gMjsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ2ZWMzXCI6IHRoaXMud1R5cGUgPSBnbC5GTE9BVDsgdGhpcy53RGltZW5zaW9ucyA9IDM7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidmVjNFwiOiB0aGlzLndUeXBlID0gZ2wuRkxPQVQ7IHRoaXMud0RpbWVuc2lvbnMgPSA0OyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImludFwiOiB0aGlzLndUeXBlID0gZ2wuSU5UOyB0aGlzLndEaW1lbnNpb25zID0gMTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpdmVjMlwiOiB0aGlzLndUeXBlID0gZ2wuSU5UOyB0aGlzLndEaW1lbnNpb25zID0gMjsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpdmVjM1wiOiB0aGlzLndUeXBlID0gZ2wuSU5UOyB0aGlzLndEaW1lbnNpb25zID0gMzsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpdmVjNFwiOiB0aGlzLndUeXBlID0gZ2wuSU5UOyB0aGlzLndEaW1lbnNpb25zID0gNDsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1aW50XCI6IHRoaXMud1R5cGUgPSBnbC5VTlNJR05FRF9JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSAxOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInV2ZWMyXCI6IHRoaXMud1R5cGUgPSBnbC5VTlNJR05FRF9JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSAyOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInV2ZWMzXCI6IHRoaXMud1R5cGUgPSBnbC5VTlNJR05FRF9JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSAzOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInV2ZWM0XCI6IHRoaXMud1R5cGUgPSBnbC5VTlNJR05FRF9JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSA0OyBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKFwiVW5zdXBwb3J0ZWQgYnVmZmVyIHR5cGU6IFwiICsgdHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2V0QWN0aXZlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdGhpcy53QnVmZmVyKTtcclxuICAgIH1cclxuICAgIGRlbGV0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdsLmRlbGV0ZUJ1ZmZlcih0aGlzLndCdWZmZXIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMkNvbXBvbmVudFZhbyB7XHJcbiAgICB3VmFvOiBXZWJHTFZlcnRleEFycmF5T2JqZWN0O1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy53VmFvID0gZ2wuY3JlYXRlVmVydGV4QXJyYXkoKTtcclxuICAgIH1cclxuICAgIHNldEFjdGl2ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdsLmJpbmRWZXJ0ZXhBcnJheSh0aGlzLndWYW8pO1xyXG4gICAgfVxyXG4gICAgZW5hYmxlQnVmZmVyKGNCdWZmZXI6IFdHTDJDb21wb25lbnRCdWZmZXIsIHdMb2NhdGlvbjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgY0J1ZmZlci5zZXRBY3RpdmUoKTtcclxuICAgICAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHdMb2NhdGlvbik7XHJcbiAgICAgICAgaWYoY0J1ZmZlci53VHlwZSA9PSB0aGlzLmdsLkZMT0FUKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcih3TG9jYXRpb24sIGNCdWZmZXIud0RpbWVuc2lvbnMsIGNCdWZmZXIud1R5cGUsIGZhbHNlLCAwLCAwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmdsLnZlcnRleEF0dHJpYklQb2ludGVyKHdMb2NhdGlvbiwgY0J1ZmZlci53RGltZW5zaW9ucywgY0J1ZmZlci53VHlwZSwgMCwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZGVsZXRlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2wuZGVsZXRlVmVydGV4QXJyYXkodGhpcy53VmFvKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJDb21wb25lbnRVbmlmb3JtIHtcclxuICAgIHdMb2NhdGlvbjogV2ViR0xVbmlmb3JtTG9jYXRpb247XHJcbiAgICBxdWV1ZWRWYWx1ZXM6IGFueVtdIHwgYW55IHwgbnVsbCA9IG51bGw7XHJcbiAgICBoYXNRdWV1ZWQgPSBmYWxzZTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCwgY1Byb2dyYW06IFdHTDJDb21wb25lbnRQcm9ncmFtLCBuYW1lOiBzdHJpbmcsIHB1YmxpYyB0eXBlOiBXR0wyVW5pZm9ybVR5cGUpIHtcclxuICAgICAgICBjb25zdCB3TG9jYXRpb24gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbihjUHJvZ3JhbS53UHJvZ3JhbSwgbmFtZSk7XHJcbiAgICAgICAgaWYod0xvY2F0aW9uID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBnZXQgdW5pZm9ybSBsb2NhdGlvbiBmb3IgXCIgKyBuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy53TG9jYXRpb24gPSB3TG9jYXRpb247XHJcbiAgICB9XHJcbiAgICBzZXRWYWx1ZXModmFsdWVzIDogYW55W10gfCBhbnkpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB3TG9jYXRpb24gPSB0aGlzLndMb2NhdGlvblxyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICBzd2l0Y2godGhpcy50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJmbG9hdFwiOiBnbC51bmlmb3JtMWYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInZlYzJcIjogZ2wudW5pZm9ybTJmdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidmVjM1wiOiBnbC51bmlmb3JtM2Z2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ2ZWM0XCI6IGdsLnVuaWZvcm00ZnYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImludFwiOiBnbC51bmlmb3JtMWkod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIml2ZWMyXCI6IGdsLnVuaWZvcm0yaXYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIml2ZWMzXCI6IGdsLnVuaWZvcm0zaXYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIml2ZWM0XCI6IGdsLnVuaWZvcm00aXYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInVpbnRcIjogZ2wudW5pZm9ybTF1aSh3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXZlYzJcIjogZ2wudW5pZm9ybTJ1aXYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInV2ZWMzXCI6IGdsLnVuaWZvcm0zdWl2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1dmVjNFwiOiBnbC51bmlmb3JtNHVpdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWF0MlwiOiBnbC51bmlmb3JtTWF0cml4MmZ2KHdMb2NhdGlvbiwgZmFsc2UsIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWF0M1wiOiBnbC51bmlmb3JtTWF0cml4M2Z2KHdMb2NhdGlvbiwgZmFsc2UsIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWF0NFwiOiBnbC51bmlmb3JtTWF0cml4NGZ2KHdMb2NhdGlvbiwgZmFsc2UsIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoXCJVbnN1cHBvcnRlZCB1bmlmb3JtIHR5cGU6IFwiICsgdGhpcy50eXBlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBxdWV1ZVZhbHVlcyh2YWx1ZXM6IGFueVtdIHwgYW55KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5oYXNRdWV1ZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucXVldWVkVmFsdWVzID0gdmFsdWVzO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIGlmKCF0aGlzLmhhc1F1ZXVlZCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuaGFzUXVldWVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZXModGhpcy5xdWV1ZWRWYWx1ZXMpO1xyXG4gICAgICAgIHRoaXMucXVldWVkVmFsdWVzID0gbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJBdHRyaWJ1dGUge1xyXG4gICAgd0xvY2F0aW9uOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsIHB1YmxpYyB3UHJvZ3JhbTogV2ViR0xQcm9ncmFtLCBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgdHlwZTogV0dMMkF0dHJpYnV0ZVR5cGUpIHtcclxuICAgICAgICB0aGlzLndMb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHdQcm9ncmFtLCBuYW1lKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJUZXh0dXJlMkQge1xyXG4gICAgd1RleHR1cmU6IFdlYkdMVGV4dHVyZTtcclxuICAgIHVuaWZvcm06IFdHTDJDb21wb25lbnRVbmlmb3JtO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHNoYWRlcjogV0dMMlNoYWRlciwgcHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIHNsb3Q6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMud1RleHR1cmUgPSBzaGFkZXIuZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgdGhpcy51bmlmb3JtID0gc2hhZGVyLmNyZWF0ZVVuaWZvcm0obmFtZSwgXCJpbnRcIik7XHJcbiAgICAgICAgdGhpcy51bmlmb3JtLnNldFZhbHVlcyh0aGlzLnNsb3QpO1xyXG4gICAgfVxyXG4gICAgc2V0QWN0aXZlKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIHRoaXMuc2xvdCk7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy53VGV4dHVyZSk7XHJcbiAgICB9XHJcbiAgICBzZXRJbnRlcnBvbGF0aW9uKGlzRW5hYmxlZDogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBpc0VuYWJsZWQgPyBnbC5MSU5FQVIgOiBnbC5ORUFSRVNUKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgaXNFbmFibGVkID8gZ2wuTElORUFSIDogZ2wuTkVBUkVTVCk7XHJcbiAgICB9XHJcbiAgICBzZXRSZXBlYXQoaXNFbmFibGVkOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgaXNFbmFibGVkID8gZ2wuUkVQRUFUIDogZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgaXNFbmFibGVkID8gZ2wuUkVQRUFUIDogZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICB9XHJcbiAgICBzZXREYXRhKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBkYXRhOiBBcnJheUJ1ZmZlclZpZXcgfCBudWxsID0gbnVsbCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCB3aWR0aCwgaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBkYXRhKTtcclxuICAgIH1cclxuICAgIHNldEltYWdlKGltYWdlOiBUZXhJbWFnZVNvdXJjZSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBpbWFnZSk7XHJcbiAgICB9XHJcbiAgICBnZW5lcmF0ZU1pcG1hcCgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wuZGVsZXRlVGV4dHVyZSh0aGlzLndUZXh0dXJlKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJUZXh0dXJlM0Qge1xyXG4gICAgd1RleHR1cmU6IFdlYkdMVGV4dHVyZTtcclxuICAgIHVuaWZvcm06IFdHTDJDb21wb25lbnRVbmlmb3JtO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHNoYWRlcjogV0dMMlNoYWRlciwgcHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIHNsb3Q6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMud1RleHR1cmUgPSBzaGFkZXIuZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgdGhpcy51bmlmb3JtID0gc2hhZGVyLmNyZWF0ZVVuaWZvcm0obmFtZSwgXCJpbnRcIik7XHJcbiAgICAgICAgdGhpcy51bmlmb3JtLnNldFZhbHVlcyh0aGlzLnNsb3QpO1xyXG4gICAgfVxyXG4gICAgc2V0QWN0aXZlKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIHRoaXMuc2xvdCk7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8zRCwgdGhpcy53VGV4dHVyZSk7XHJcbiAgICB9XHJcbiAgICBzZXRJbnRlcnBvbGF0aW9uKGlzRW5hYmxlZDogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8zRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBpc0VuYWJsZWQgPyBnbC5MSU5FQVIgOiBnbC5ORUFSRVNUKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfM0QsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgaXNFbmFibGVkID8gZ2wuTElORUFSIDogZ2wuTkVBUkVTVCk7XHJcbiAgICB9XHJcbiAgICBzZXRSZXBlYXQoaXNFbmFibGVkOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzNELCBnbC5URVhUVVJFX1dSQVBfUywgaXNFbmFibGVkID8gZ2wuUkVQRUFUIDogZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzNELCBnbC5URVhUVVJFX1dSQVBfVCwgaXNFbmFibGVkID8gZ2wuUkVQRUFUIDogZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICB9XHJcbiAgICBzZXREYXRhKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBkZXB0aDogbnVtYmVyLCBkYXRhOiBBcnJheUJ1ZmZlclZpZXcgfCBudWxsID0gbnVsbCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wudGV4SW1hZ2UzRChnbC5URVhUVVJFXzNELCAwLCBnbC5SR0JBLCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCwgMCwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgZGF0YSk7XHJcbiAgICB9XHJcbiAgICBnZW5lcmF0ZU1pcG1hcCgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfM0QpO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wuZGVsZXRlVGV4dHVyZSh0aGlzLndUZXh0dXJlKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJPYmplY3Qge1xyXG4gICAgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQ7XHJcbiAgICBjVmFvOiBXR0wyQ29tcG9uZW50VmFvO1xyXG4gICAgY0J1ZmZlckJ5TmFtZToge1trZXk6c3RyaW5nXTogV0dMMkNvbXBvbmVudEJ1ZmZlcn0gPSB7fTtcclxuICAgIHZlcnRleENvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHNoYWRlcjogV0dMMlNoYWRlcikge1xyXG4gICAgICAgIHRoaXMuZ2wgPSBzaGFkZXIuZ2w7XHJcbiAgICAgICAgdGhpcy5jVmFvID0gbmV3IFdHTDJDb21wb25lbnRWYW8oc2hhZGVyLmdsKTtcclxuICAgICAgICB0aGlzLmNWYW8uc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgZm9yKGNvbnN0IGF0dHJpYnV0ZSBvZiBzaGFkZXIuYXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICBjb25zdCBjQnVmID0gbmV3IFdHTDJDb21wb25lbnRCdWZmZXIoc2hhZGVyLmdsLCBhdHRyaWJ1dGUudHlwZSk7XHJcbiAgICAgICAgICAgIGNCdWYuc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY1Zhby5lbmFibGVCdWZmZXIoY0J1ZiwgYXR0cmlidXRlLndMb2NhdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuY0J1ZmZlckJ5TmFtZVthdHRyaWJ1dGUubmFtZV0gPSBjQnVmO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNldERhdGEoYXR0cmlidXRlTmFtZTogc3RyaW5nLCB2YWx1ZXM6IEZsb2F0MzJBcnJheSwgdXNhZ2U6IEdMZW51bSA9IHRoaXMuZ2wuU1RBVElDX0RSQVcpIHtcclxuICAgICAgICBjb25zdCBjQnVmID0gdGhpcy5jQnVmZmVyQnlOYW1lW2F0dHJpYnV0ZU5hbWVdO1xyXG4gICAgICAgIGlmKGNCdWYgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgZmluZCBhdHRyaWJ1dGUgd2l0aCBuYW1lOiBcIiArIGF0dHJpYnV0ZU5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjQnVmLnNldEFjdGl2ZSgpO1xyXG4gICAgICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdmFsdWVzLCB1c2FnZSk7XHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhDb3VudCA9IHZhbHVlcy5sZW5ndGggLyBjQnVmLndEaW1lbnNpb25zO1xyXG4gICAgfVxyXG4gICAgZHJhd1RyaWFuZ2xlcygpIHtcclxuICAgICAgICB0aGlzLmNWYW8uc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgdGhpcy5nbC5kcmF3QXJyYXlzKHRoaXMuZ2wuVFJJQU5HTEVTLCAwLCB0aGlzLnZlcnRleENvdW50KTtcclxuICAgIH1cclxuICAgIGRyYXdMaW5lcygpIHtcclxuICAgICAgICB0aGlzLmNWYW8uc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgdGhpcy5nbC5kcmF3QXJyYXlzKHRoaXMuZ2wuTElORVMsIDAsIHRoaXMudmVydGV4Q291bnQpO1xyXG4gICAgfVxyXG4gICAgZHJhd1BvaW50cygpIHtcclxuICAgICAgICB0aGlzLmNWYW8uc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgdGhpcy5nbC5kcmF3QXJyYXlzKHRoaXMuZ2wuUE9JTlRTLCAwLCB0aGlzLnZlcnRleENvdW50KTtcclxuICAgIH1cclxuICAgIHJlbW92ZSgpIHtcclxuICAgICAgICBmb3IoY29uc3QgbmFtZSBpbiB0aGlzLmNCdWZmZXJCeU5hbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5jQnVmZmVyQnlOYW1lW25hbWVdIS5kZWxldGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jVmFvLmRlbGV0ZSgpO1xyXG4gICAgICAgIHRoaXMuY0J1ZmZlckJ5TmFtZSA9IHt9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMlNoYWRlciB7XHJcbiAgICBjUHJvZ3JhbTogV0dMMkNvbXBvbmVudFByb2dyYW07XHJcbiAgICBhdHRyaWJ1dGVzOiBXR0wyQXR0cmlidXRlW10gPSBbXTtcclxuICAgIGNVbmlmb3JtczogV0dMMkNvbXBvbmVudFVuaWZvcm1bXSA9IFtdXHJcbiAgICBjVW5pZm9ybUJ5TmFtZToge1trZXk6c3RyaW5nXTpXR0wyQ29tcG9uZW50VW5pZm9ybX0gPSB7fTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCwgdlNvdXJjZTogc3RyaW5nLCBmU291cmNlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmNQcm9ncmFtID0gbmV3IFdHTDJDb21wb25lbnRQcm9ncmFtKFxyXG4gICAgICAgICAgICBnbCwgbmV3IFdHTDJDb21wb25lbnRTaGFkZXIoZ2wsIFwidmVydGV4XCIsIHZTb3VyY2UpLFxyXG4gICAgICAgICAgICBuZXcgV0dMMkNvbXBvbmVudFNoYWRlcihnbCwgXCJmcmFnbWVudFwiLCBmU291cmNlKSxcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMuY1Byb2dyYW0uc2V0QWN0aXZlKCk7XHJcbiAgICB9XHJcbiAgICBhZGRBdHRyaWJ1dGUobmFtZTogc3RyaW5nLCB0eXBlOiBXR0wyQXR0cmlidXRlVHlwZSkge1xyXG4gICAgICAgIGNvbnN0IGF0dCA9IG5ldyBXR0wyQXR0cmlidXRlKHRoaXMuZ2wsIHRoaXMuY1Byb2dyYW0ud1Byb2dyYW0sIG5hbWUsIHR5cGUpO1xyXG4gICAgICAgIHRoaXMuYXR0cmlidXRlcy5wdXNoKGF0dCk7XHJcbiAgICAgICAgcmV0dXJuIGF0dDtcclxuICAgIH1cclxuICAgIGNyZWF0ZVVuaWZvcm0obmFtZTogc3RyaW5nLCB0eXBlOiBXR0wyVW5pZm9ybVR5cGUpIHtcclxuICAgICAgICBjb25zdCB1bmlmb3JtID0gbmV3IFdHTDJDb21wb25lbnRVbmlmb3JtKHRoaXMuZ2wsIHRoaXMuY1Byb2dyYW0sIG5hbWUsIHR5cGUpO1xyXG4gICAgICAgIHRoaXMuY1VuaWZvcm1zLnB1c2godW5pZm9ybSk7XHJcbiAgICAgICAgdGhpcy5jVW5pZm9ybUJ5TmFtZVtuYW1lXSA9IHVuaWZvcm07XHJcbiAgICAgICAgcmV0dXJuIHVuaWZvcm07XHJcbiAgICB9XHJcbiAgICBnZXRVbmlmb3JtKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNVbmlmb3JtQnlOYW1lW25hbWVdO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlT2JqZWN0KCkge1xyXG4gICAgICAgIGNvbnN0IG9iaiA9IG5ldyBXR0wyT2JqZWN0KHRoaXMpO1xyXG4gICAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVUZXh0dXJlMkQobmFtZTogc3RyaW5nLCBzbG90OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB0ZXh0dXJlID0gbmV3IFdHTDJUZXh0dXJlMkQodGhpcywgbmFtZSwgc2xvdCk7XHJcbiAgICAgICAgcmV0dXJuIHRleHR1cmU7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVUZXh0dXJlM0QobmFtZTogc3RyaW5nLCBzbG90OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB0ZXh0dXJlID0gbmV3IFdHTDJUZXh0dXJlM0QodGhpcywgbmFtZSwgc2xvdCk7XHJcbiAgICAgICAgcmV0dXJuIHRleHR1cmU7XHJcbiAgICB9XHJcbiAgICBzZXRBY3RpdmUoKSB7XHJcbiAgICAgICAgdGhpcy5jUHJvZ3JhbS5zZXRBY3RpdmUoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgVEVYVFVSRSBBVExBUyBDTEFTUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCB0eXBlIEF0bGFzSW1hZ2UgPSB7eDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyLCBpbWc6IEhUTUxJbWFnZUVsZW1lbnQsIG5hbWU6IHN0cmluZ307XHJcblxyXG5leHBvcnQgY2xhc3MgVGV4dHVyZUF0bGFzIHtcclxuICAgIHdpZHRoOiBudW1iZXI7XHJcbiAgICBoZWlnaHQ6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpbWFnZTogSFRNTEltYWdlRWxlbWVudCwgcHVibGljIGJvdW5kczoge1tuYW1lOnN0cmluZ106IEF0bGFzSW1hZ2V9KSB7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IGltYWdlLm5hdHVyYWxXaWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGltYWdlLm5hdHVyYWxIZWlnaHQ7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZnJvbVVybHMoYXJnczogW25hbWU6c3RyaW5nLCB1cmw6c3RyaW5nXVtdLCBwYWRkaW5nID0gMCkge1xyXG4gICAgICAgIGxldCBpbWFnZXM6IEF0bGFzSW1hZ2VbXSA9IFtdO1xyXG4gICAgICAgIGxldCBwcm9taXNlczogUHJvbWlzZTx2b2lkPltdID0gW107XHJcbiAgICAgICAgbGV0IGF0bGFzU2l6ZSA9IDA7XHJcbiAgICAgICAgZm9yKGxldCBbbmFtZSwgdXJsXSBvZiBhcmdzKSB7XHJcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2gobmV3IFByb21pc2U8dm9pZD4oYXN5bmMgcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGE6IEF0bGFzSW1hZ2UgPSB7aW1nLCB4OjAsIHk6MCwgdzppbWcubmF0dXJhbFdpZHRoKzIqcGFkZGluZywgaDppbWcubmF0dXJhbEhlaWdodCsyKnBhZGRpbmcsIG5hbWV9O1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpc0NvbGxpZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCB4PTA7eDw9YXRsYXNTaXplLWRhdGEudzt4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCB5PTA7eTw9YXRsYXNTaXplLWRhdGEuaDt5KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29sbGlkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IG90aGVyIG9mIGltYWdlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHggKyBkYXRhLncgPiBvdGhlci54ICYmIHkgKyBkYXRhLmggPiBvdGhlci55ICYmIHggPCBvdGhlci54ICsgb3RoZXIudyAmJiB5IDwgb3RoZXIueSArIG90aGVyLmgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb2xsaWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighaXNDb2xsaWRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnggPSB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEueSA9IHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWlzQ29sbGlkaW5nKSBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaXNDb2xsaWRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS54ID0gYXRsYXNTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnkgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdGxhc1NpemUgPSBkYXRhLnggKyBkYXRhLnc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlcy5wdXNoKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IHVybDtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XHJcbiAgICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICAgICAgY2FudmFzLndpZHRoID0gYXRsYXNTaXplO1xyXG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBhdGxhc1NpemU7XHJcbiAgICAgICAgbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIikhO1xyXG4gICAgICAgIGxldCBib3VuZHM6IHtbbmFtZTpzdHJpbmddOiBBdGxhc0ltYWdlfSA9IHt9O1xyXG4gICAgICAgIGZvcihsZXQgaW1nIG9mIGltYWdlcykge1xyXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZy5pbWcsIGltZy54ICsgcGFkZGluZywgaW1nLnkgKyBwYWRkaW5nKTtcclxuICAgICAgICAgICAgaWYocGFkZGluZyAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCAwLCAwLCAxLCBpbWcuaC0yKnBhZGRpbmcsIGltZy54LCBpbWcueSArIHBhZGRpbmcsIHBhZGRpbmcsIGltZy5oLTIqcGFkZGluZyk7IC8vIGxlZnRcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgaW1nLnctMipwYWRkaW5nLTEsIDAsIDEsIGltZy5oLTIqcGFkZGluZywgaW1nLngraW1nLnctcGFkZGluZywgaW1nLnkgKyBwYWRkaW5nLCBwYWRkaW5nLCBpbWcuaC0yKnBhZGRpbmcpOyAvLyByaWdodFxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCAwLCAwLCBpbWcudy0yKnBhZGRpbmcsIDEsIGltZy54ICsgcGFkZGluZywgaW1nLnksIGltZy53LTIqcGFkZGluZywgcGFkZGluZyk7IC8vIHRvcFxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCAwLCBpbWcuaC0yKnBhZGRpbmctMSwgaW1nLnctMipwYWRkaW5nLCAxLCBpbWcueCArIHBhZGRpbmcsIGltZy55K2ltZy5oLXBhZGRpbmcsIGltZy53LTIqcGFkZGluZywgcGFkZGluZyk7IC8vIGJvdHRvbVxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCAwLCAwLCAyLCAyLCBpbWcueCwgaW1nLnksIHBhZGRpbmcsIHBhZGRpbmcpOyAvLyB0b3AtbGVmdFxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCBpbWcudy0yKnBhZGRpbmctMiwgMCwgMiwgMiwgaW1nLngraW1nLnctcGFkZGluZywgaW1nLnksIHBhZGRpbmcsIHBhZGRpbmcpOyAvLyB0b3AtcmlnaHRcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgMCwgaW1nLmgtMipwYWRkaW5nLTIsIDIsIDIsIGltZy54LCBpbWcueStpbWcuaC1wYWRkaW5nLCBwYWRkaW5nLCBwYWRkaW5nKTsgLy8gYm90dG9tLWxlZnRcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgaW1nLnctMipwYWRkaW5nLTIsIGltZy5oLTIqcGFkZGluZy0yLCAyLCAyLCBpbWcueCtpbWcudy1wYWRkaW5nLCBpbWcueStpbWcuaC1wYWRkaW5nLCBwYWRkaW5nLCBwYWRkaW5nKTsgLy8gYm90dG9tLXJpZ2h0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW1nLnggPSAoaW1nLnggKyBwYWRkaW5nKSAvIGF0bGFzU2l6ZTtcclxuICAgICAgICAgICAgaW1nLnkgPSAoaW1nLnkgKyBwYWRkaW5nKSAvIGF0bGFzU2l6ZTtcclxuICAgICAgICAgICAgaW1nLncgPSAoaW1nLncgLSAyKnBhZGRpbmcpIC8gYXRsYXNTaXplO1xyXG4gICAgICAgICAgICBpbWcuaCA9IChpbWcuaCAtIDIqcGFkZGluZykgLyBhdGxhc1NpemU7XHJcbiAgICAgICAgICAgIGJvdW5kc1tpbWcubmFtZV0gPSBpbWc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB1cmwgPSBjYW52YXMudG9EYXRhVVJMKCk7XHJcbiAgICAgICAgY29uc3QgYXRsYXNJbWFnZSA9IGF3YWl0IG5ldyBQcm9taXNlPEhUTUxJbWFnZUVsZW1lbnQ+KHJlcyA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlcyhpbWcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGltZy5zcmMgPSB1cmw7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUZXh0dXJlQXRsYXMoYXRsYXNJbWFnZSwgYm91bmRzKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIENPTE9SIENMQVNTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBDb2xvciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpO1xyXG4gICAgY29uc3RydWN0b3IocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcik7XHJcbiAgICBjb25zdHJ1Y3RvcihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyLCBhOiBudW1iZXIpO1xyXG4gICAgY29uc3RydWN0b3IoY29sb3I6IHN0cmluZyB8IENvbG9yKTtcclxuICAgIGNvbnN0cnVjdG9yKGFyZ0E/OiBudW1iZXIgfCBzdHJpbmcgfCBDb2xvciwgYXJnQj86IG51bWJlciwgYXJnQz86IG51bWJlciwgYXJnRD86IG51bWJlcikge1xyXG4gICAgICAgIGlmKHR5cGVvZiBhcmdBID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIGxldCBjb21wID0gYXJnQS5zcGxpdChcIihcIik7XHJcbiAgICAgICAgICAgIGlmKGNvbXAubGVuZ3RoID09IDApXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIGNvbnN0cnVjdG9yOiBFbXB0eSBzdHJpbmdcIik7XHJcbiAgICAgICAgICAgIGlmKGNvbXAubGVuZ3RoIDwgMilcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgY29uc3RydWN0b3I6IFwiICsgY29tcFswXSk7XHJcbiAgICAgICAgICAgIGxldCBjc3RydWN0ID0gY29tcFswXTtcclxuICAgICAgICAgICAgbGV0IGNwYXJhbSA9IGNvbXBbMV0hLnJlcGxhY2UoXCIpXCIsIFwiXCIpO1xyXG4gICAgICAgICAgICBpZihjc3RydWN0ID09PSBcInJnYlwiIHx8IGNzdHJ1Y3QgPT09IFwicmdiYVwiKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FyZ3MgPSBjcGFyYW0uc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYoY2FyZ3MubGVuZ3RoIDwgMyB8fCBjYXJncy5sZW5ndGggPiA0KVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgYXJndW1lbnQgY291bnQ6IFwiICsgY2FyZ3MubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIGxldCByID0gcGFyc2VJbnQoY2FyZ3NbMF0hKTtcclxuICAgICAgICAgICAgICAgIGxldCBnID0gcGFyc2VJbnQoY2FyZ3NbMV0hKTtcclxuICAgICAgICAgICAgICAgIGxldCBiID0gcGFyc2VJbnQoY2FyZ3NbMl0hKTtcclxuICAgICAgICAgICAgICAgIGxldCBhID0gY2FyZ3NbM10gPyBwYXJzZUZsb2F0KGNhcmdzWzNdISkgOiAxO1xyXG4gICAgICAgICAgICAgICAgaWYoaXNOYU4ocikpIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgdmFsdWU6IFwiICsgY2FyZ3NbMF0pO1xyXG4gICAgICAgICAgICAgICAgaWYoaXNOYU4oZykpIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgdmFsdWU6IFwiICsgY2FyZ3NbMV0pO1xyXG4gICAgICAgICAgICAgICAgaWYoaXNOYU4oYikpIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgdmFsdWU6IFwiICsgY2FyZ3NbMl0pO1xyXG4gICAgICAgICAgICAgICAgaWYoaXNOYU4oYSkpIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgdmFsdWU6IFwiICsgY2FyZ3NbM10pO1xyXG4gICAgICAgICAgICAgICAgciA9IEVNYXRoLmNsYW1wKE1hdGgucm91bmQociksIDAsIDI1NSk7XHJcbiAgICAgICAgICAgICAgICBnID0gRU1hdGguY2xhbXAoTWF0aC5yb3VuZChnKSwgMCwgMjU1KTtcclxuICAgICAgICAgICAgICAgIGIgPSBFTWF0aC5jbGFtcChNYXRoLnJvdW5kKGIpLCAwLCAyNTUpO1xyXG4gICAgICAgICAgICAgICAgYSA9IEVNYXRoLmNsYW1wKGEsIDAsIDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fciA9IHI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9nID0gZztcclxuICAgICAgICAgICAgICAgIHRoaXMuX2IgPSBiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hID0gYTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX291dGRhdGVkUmdiID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vdXRkYXRlZEhzdiA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihjc3RydWN0ID09PSBcImhzdlwiIHx8IGNzdHJ1Y3QgPT09IFwiaHN2YVwiKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FyZ3MgPSBjcGFyYW0uc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYoY2FyZ3MubGVuZ3RoIDwgMyB8fCBjYXJncy5sZW5ndGggPiA0KVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgYXJndW1lbnQgY291bnQ6IFwiICsgY2FyZ3MubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIGxldCBoOiBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICBpZihjYXJnc1swXSEuaW5jbHVkZXMoXCJyYWRcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBoID0gcGFyc2VGbG9hdChjYXJnc1swXSEpICogMTgwIC8gTWF0aC5QSTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaCA9IHBhcnNlSW50KGNhcmdzWzBdISk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgcyA9IHBhcnNlSW50KGNhcmdzWzFdISk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdiA9IHBhcnNlSW50KGNhcmdzWzJdISk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYSA9IGNhcmdzWzNdID8gcGFyc2VJbnQoY2FyZ3NbM10hKSA6IDE7XHJcbiAgICAgICAgICAgICAgICBpZihpc05hTihoKSkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciB2YWx1ZTogXCIgKyBjYXJnc1swXSk7XHJcbiAgICAgICAgICAgICAgICBpZihpc05hTihzKSkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciB2YWx1ZTogXCIgKyBjYXJnc1sxXSk7XHJcbiAgICAgICAgICAgICAgICBpZihpc05hTih2KSkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciB2YWx1ZTogXCIgKyBjYXJnc1syXSk7XHJcbiAgICAgICAgICAgICAgICBpZihpc05hTihhKSkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciB2YWx1ZTogXCIgKyBjYXJnc1szXSk7XHJcbiAgICAgICAgICAgICAgICBoID0gRU1hdGgucG1vZChoLCAzNjApO1xyXG4gICAgICAgICAgICAgICAgcyA9IEVNYXRoLmNsYW1wKHMsIDAsIDEwMCk7XHJcbiAgICAgICAgICAgICAgICB2ID0gRU1hdGguY2xhbXAodiwgMCwgMTAwKTtcclxuICAgICAgICAgICAgICAgIGEgPSBFTWF0aC5jbGFtcChhLCAwLCAxKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2h1ZSA9IGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zYXQgPSBzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsID0gdjtcclxuICAgICAgICAgICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vdXRkYXRlZEhzdiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSZ2IgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciBjb25zdHJ1Y3RvcjogXCIgKyBjc3RydWN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZih0eXBlb2YgYXJnQSA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICBpZiAoYXJnQiA9PT0gdW5kZWZpbmVkIHx8IGFyZ0MgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciBjb25zdHJ1Y3RvcjogTm90IGVub3VnaCBhcmd1bWVudHNcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fciA9IEVNYXRoLmNsYW1wKE1hdGgucm91bmQoYXJnQSksIDAsIDI1NSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2cgPSBFTWF0aC5jbGFtcChNYXRoLnJvdW5kKGFyZ0IhKSwgMCwgMjU1KTtcclxuICAgICAgICAgICAgdGhpcy5fYiA9IEVNYXRoLmNsYW1wKE1hdGgucm91bmQoYXJnQyEpLCAwLCAyNTUpO1xyXG4gICAgICAgICAgICB0aGlzLmEgPSBFTWF0aC5jbGFtcChhcmdEID8/IDEsIDAsIDEpO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFJnYiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZEhzdiA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIGlmKGFyZ0EgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yID0gMDtcclxuICAgICAgICAgICAgdGhpcy5fZyA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuX2IgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmEgPSAxO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFJnYiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZEhzdiA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fciA9IGFyZ0EhLnI7XHJcbiAgICAgICAgICAgIHRoaXMuX2cgPSBhcmdBIS5nO1xyXG4gICAgICAgICAgICB0aGlzLl9iID0gYXJnQSEuYjtcclxuICAgICAgICAgICAgdGhpcy5hID0gYXJnQSEuYTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSZ2IgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRIc3YgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbk11dGF0ZT86ICgpID0+IHZvaWQ7XHJcbiAgICBtdXRhdGUoKSB7XHJcbiAgICAgICAgaWYodGhpcy5vbk11dGF0ZSlcclxuICAgICAgICAgICAgdGhpcy5vbk11dGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb25lKCk6IENvbG9yIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBkZWNpbWFsVG9SR0IoZDogbnVtYmVyKSB7XHJcbiAgICAgICAgZCA9IEVNYXRoLmNsYW1wKGQsIDAsIDEtMWUtNik7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gTWF0aC5mbG9vcihkICogMTY3NzcyMTYpO1xyXG4gICAgICAgIGxldCByID0gKGluZGV4ID4+IDE2KSAmIDB4RkY7XHJcbiAgICAgICAgbGV0IGcgPSAoaW5kZXggPj4gOCkgJiAweEZGO1xyXG4gICAgICAgIGxldCBiID0gKGluZGV4KSAmIDB4RkY7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihyLCBnLCBiKTtcclxuICAgIH1cclxuXHJcbiAgICBfb3V0ZGF0ZWRSZ2I/OiBib29sZWFuO1xyXG4gICAgX3IgPSAwO1xyXG4gICAgLyoqXHJcbiAgICAgKiAoaW50KSByZWQgdmFsdWUgb2YgdGhlIGNvbG9yLCAwIC0gMjU1LlxyXG4gICAgKi9cclxuICAgIHNldCByKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB2YWx1ZSA9IEVNYXRoLmNsYW1wKE1hdGgucm91bmQodmFsdWUpLCAwLCAyNTUpO1xyXG4gICAgICAgIGlmKHZhbHVlID09IHRoaXMuX3IpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIHRoaXMuX3IgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZEhzdiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgIH1cclxuICAgIGdldCByKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3I7XHJcbiAgICB9XHJcblxyXG4gICAgX2cgPSAwO1xyXG4gICAgLyoqXHJcbiAgICAgKiAoaW50KSBncmVlbiB2YWx1ZSBvZiB0aGUgY29sb3IsIDAgLSAyNTUuXHJcbiAgICAqL1xyXG4gICAgc2V0IGcodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHZhbHVlID0gRU1hdGguY2xhbXAoTWF0aC5yb3VuZCh2YWx1ZSksIDAsIDI1NSk7XHJcbiAgICAgICAgaWYodmFsdWUgPT0gdGhpcy5fZylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgdGhpcy5fZyA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkSHN2ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IGcoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZ2IoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZztcclxuICAgIH1cclxuICAgIFxyXG4gICAgX2IgPSAwO1xyXG4gICAgLyoqXHJcbiAgICAgKiAoaW50KSBibHVlIHZhbHVlIG9mIHRoZSBjb2xvciwgMCAtIDI1NS5cclxuICAgICovXHJcbiAgICBzZXQgYih2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFsdWUgPSBFTWF0aC5jbGFtcChNYXRoLnJvdW5kKHZhbHVlKSwgMCwgMjU1KTtcclxuICAgICAgICBpZih2YWx1ZSA9PSB0aGlzLl9iKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZ2IoKTtcclxuICAgICAgICB0aGlzLl9iID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRIc3YgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgYigpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9iO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVJnYigpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFJnYiAhPSB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgY29uc3Qge19odWU6aCwgX3NhdDpzLCBfdmFsOnZ9ID0gdGhpcztcclxuICAgICAgICBjb25zdCBjID0gdiAvIDEwMCAqIHMgLyAxMDA7XHJcbiAgICAgICAgY29uc3QgeCA9IGMgKiAoMSAtIE1hdGguYWJzKCgoaCAvIDYwKSAlIDIpIC0gMSkpO1xyXG4gICAgICAgIGNvbnN0IG0gPSB2IC8gMTAwIC0gYztcclxuICAgICAgICBsZXQgcnA9MCwgZ3A9MCwgYnA9MDtcclxuICAgICAgICBzd2l0Y2goTWF0aC5mbG9vcihoIC8gNjApKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDogcnA9YzsgZ3A9eDsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMTogcnA9eDsgZ3A9YzsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMjogZ3A9YzsgYnA9eDsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzogZ3A9eDsgYnA9YzsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNDogcnA9eDsgYnA9YzsgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHJwPWM7IGJwPXg7IGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9yID0gTWF0aC5yb3VuZCgocnAgKyBtKSAqIDI1NSk7XHJcbiAgICAgICAgdGhpcy5fZyA9IE1hdGgucm91bmQoKGdwICsgbSkgKiAyNTUpO1xyXG4gICAgICAgIHRoaXMuX2IgPSBNYXRoLnJvdW5kKChicCArIG0pICogMjU1KTtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZFJnYiA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIF9vdXRkYXRlZEhzdj86IGJvb2xlYW47XHJcbiAgICBfaHVlID0gMDtcclxuICAgIC8qKlxyXG4gICAgICogKGRlY2ltYWwpIGh1ZSBvZiB0aGUgY29sb3IgaW4gZGVncmVlcywgMCAtIDM2MC5cclxuICAgICovXHJcbiAgICBzZXQgaHVlKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB2YWx1ZSA9IEVNYXRoLnBtb2QodmFsdWUsIDM2MCk7XHJcbiAgICAgICAgaWYodmFsdWUgPT0gdGhpcy5faHVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy51cGRhdGVIc3YoKTtcclxuICAgICAgICB0aGlzLl9odWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZFJnYiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgIH1cclxuICAgIGdldCBodWUoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVIc3YoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5faHVlO1xyXG4gICAgfVxyXG5cclxuICAgIF9zYXQgPSAwO1xyXG4gICAgLyoqXHJcbiAgICAgKiAoZGVjaW1hbCkgc2F0dXJhdGlvbiBvZiB0aGUgY29sb3IsIDAgLSAxMDAuXHJcbiAgICAqL1xyXG4gICAgc2V0IHNhdCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFsdWUgPSBFTWF0aC5jbGFtcCh2YWx1ZSwgMCwgMTAwKTtcclxuICAgICAgICBpZih2YWx1ZSA9PSB0aGlzLl9zYXQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnVwZGF0ZUhzdigpO1xyXG4gICAgICAgIHRoaXMuX3NhdCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkUmdiID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IHNhdCgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUhzdigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zYXQ7XHJcbiAgICB9XHJcblxyXG4gICAgX3ZhbCA9IDA7XHJcbiAgICAvKipcclxuICAgICAqIChkZWNpbWFsKSB2YWx1ZS9icmlnaHRuZXNzIG9mIHRoZSBjb2xvciwgMCAtIDEwMC5cclxuICAgICovXHJcbiAgICBzZXQgdmFsKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB2YWx1ZSA9IEVNYXRoLmNsYW1wKHZhbHVlLCAwLCAxMDApO1xyXG4gICAgICAgIGlmKHZhbHVlID09IHRoaXMuX3ZhbClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudXBkYXRlSHN2KCk7XHJcbiAgICAgICAgdGhpcy5fdmFsID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSZ2IgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgdmFsKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlSHN2KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbDtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVIc3YoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRIc3YgIT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KHRoaXMuciwgdGhpcy5nLCB0aGlzLmIpO1xyXG4gICAgICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKHRoaXMuciwgdGhpcy5nLCB0aGlzLmIpO1xyXG4gICAgICAgIGNvbnN0IGRlbHRhID0gbWF4IC0gbWluO1xyXG4gICAgICAgIGxldCBoID0gMDtcclxuICAgICAgICBpZihkZWx0YSAhPT0gMCkge1xyXG4gICAgICAgICAgICBpZihtYXggPT09IHRoaXMucikgaCA9IDYwICogKCgodGhpcy5nIC0gdGhpcy5iKSAvIGRlbHRhICsgNikgJSA2KTtcclxuICAgICAgICAgICAgZWxzZSBpZihtYXggPT09IHRoaXMuZykgaCA9IDYwICogKCh0aGlzLmIgLSB0aGlzLnIpIC8gZGVsdGEgKyAyKTtcclxuICAgICAgICAgICAgZWxzZSBoID0gNjAgKiAoKHRoaXMuciAtIHRoaXMuZykgLyBkZWx0YSArIDQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihoIDwgMCkgaCArPSAzNjA7XHJcbiAgICAgICAgY29uc3QgcyA9IG1heCA9PT0gMCA/IDAgOiBkZWx0YS9tYXgqMTAwO1xyXG4gICAgICAgIGNvbnN0IHYgPSBtYXgvMjU1KjEwMDtcclxuICAgICAgICB0aGlzLl9odWUgPSBoO1xyXG4gICAgICAgIHRoaXMuX3NhdCA9IHM7XHJcbiAgICAgICAgdGhpcy5fdmFsID0gdjtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZEhzdiA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogKGRlY2ltYWwpIGFscGhhL29wYWNpdHkgb2YgdGhlIGNvbG9yLCAwIC0gMS5cclxuICAgICovXHJcbiAgICBhID0gMTtcclxuXHJcbiAgICBzdHJpY3RFcXVhbHMob3RoZXI6IENvbG9yKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZ2IoKTtcclxuICAgICAgICBvdGhlci51cGRhdGVSZ2IoKTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICB0aGlzLl9yID09IG90aGVyLl9yXHJcbiAgICAgICAgICAgICYmIHRoaXMuX2cgPT0gb3RoZXIuX2dcclxuICAgICAgICAgICAgJiYgdGhpcy5fYiA9PSBvdGhlci5fYlxyXG4gICAgICAgICAgICAmJiB0aGlzLmEgPT0gb3RoZXIuYVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBpc0Nsb3NlKG90aGVyOiBDb2xvciwgZSA9IDFlLTYpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIG90aGVyLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIEVNYXRoLmlzQ2xvc2UodGhpcy5fciwgb3RoZXIuX3IsIGUpXHJcbiAgICAgICAgICAgICYmIEVNYXRoLmlzQ2xvc2UodGhpcy5fZywgb3RoZXIuX2csIGUpXHJcbiAgICAgICAgICAgICYmIEVNYXRoLmlzQ2xvc2UodGhpcy5fYiwgb3RoZXIuX2IsIGUpXHJcbiAgICAgICAgICAgICYmIEVNYXRoLmlzQ2xvc2UodGhpcy5hLCBvdGhlci5hLCBlKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBzdHJpY3RFcXVhbHNSZ2Iob3RoZXI6IENvbG9yKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZ2IoKTtcclxuICAgICAgICBvdGhlci51cGRhdGVSZ2IoKTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICB0aGlzLl9yID09IG90aGVyLl9yXHJcbiAgICAgICAgICAgICYmIHRoaXMuX2cgPT0gb3RoZXIuX2dcclxuICAgICAgICAgICAgJiYgdGhpcy5fYiA9PSBvdGhlci5fYlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBpc0Nsb3NlUmdiKG90aGVyOiBDb2xvciwgZSA9IDFlLTYpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIG90aGVyLnVwZGF0ZVJnYigpO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIEVNYXRoLmlzQ2xvc2UodGhpcy5fciwgb3RoZXIuX3IsIGUpXHJcbiAgICAgICAgICAgICYmIEVNYXRoLmlzQ2xvc2UodGhpcy5fZywgb3RoZXIuX2csIGUpXHJcbiAgICAgICAgICAgICYmIEVNYXRoLmlzQ2xvc2UodGhpcy5fYiwgb3RoZXIuX2IsIGUpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIGxlcnBSZ2JhKG90aGVyOiBDb2xvciwgdDogbnVtYmVyKTogQ29sb3Ige1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubGVycFJnYmFTZWxmKG90aGVyLCB0KTtcclxuICAgIH1cclxuICAgIGxlcnBSZ2JhU2VsZihvdGhlcjogQ29sb3IsIHQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgb3RoZXIudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgdGhpcy5fciA9IEVNYXRoLmxlcnAodGhpcy5fciwgb3RoZXIuX3IsIHQpO1xyXG4gICAgICAgIHRoaXMuX2cgPSBFTWF0aC5sZXJwKHRoaXMuX2csIG90aGVyLl9nLCB0KTtcclxuICAgICAgICB0aGlzLl9iID0gRU1hdGgubGVycCh0aGlzLl9iLCBvdGhlci5fYiwgdCk7XHJcbiAgICAgICAgdGhpcy5hID0gRU1hdGgubGVycCh0aGlzLmEsIG90aGVyLmEsIHQpO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBsZXJwSHN2YShvdGhlcjogQ29sb3IsIHQ6IG51bWJlcik6IENvbG9yIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxlcnBIc3ZhU2VsZihvdGhlciwgdCk7XHJcbiAgICB9XHJcbiAgICBsZXJwSHN2YVNlbGYob3RoZXI6IENvbG9yLCB0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUhzdigpO1xyXG4gICAgICAgIG90aGVyLnVwZGF0ZUhzdigpO1xyXG4gICAgICAgIHRoaXMuX2h1ZSA9IEVNYXRoLmxlcnAodGhpcy5faHVlLCBvdGhlci5faHVlLCB0KTtcclxuICAgICAgICB0aGlzLl9zYXQgPSBFTWF0aC5sZXJwKHRoaXMuX3NhdCwgb3RoZXIuX3NhdCwgdCk7XHJcbiAgICAgICAgdGhpcy5fdmFsID0gRU1hdGgubGVycCh0aGlzLl92YWwsIG90aGVyLl92YWwsIHQpO1xyXG4gICAgICAgIHRoaXMuYSA9IEVNYXRoLmxlcnAodGhpcy5hLCBvdGhlci5hLCB0KTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZ2V0SXNGb3JlZ3JvdW5kV2hpdGUodGhyZXNob2xkID0gMC40Mikge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmdiKCk7XHJcbiAgICAgICAgbGV0IHtfcjpyLCBfZzpnLCBfYjpifSA9IHRoaXM7XHJcbiAgICAgICAgciAvPSAyNTU7XHJcbiAgICAgICAgZyAvPSAyNTU7XHJcbiAgICAgICAgYiAvPSAyNTU7XHJcbiAgICAgICAgciA9IChyIDwgMC4wMzkyOCkgPyAociAvIDEyLjkyKSA6ICgoKHIgKyAwLjA1NSkgLyAxLjA1NSkgKiogMi40KVxyXG4gICAgICAgIGcgPSAoZyA8IDAuMDM5MjgpID8gKGcgLyAxMi45MikgOiAoKChnICsgMC4wNTUpIC8gMS4wNTUpICoqIDIuNClcclxuICAgICAgICBiID0gKGIgPCAwLjAzOTI4KSA/IChiIC8gMTIuOTIpIDogKCgoYiArIDAuMDU1KSAvIDEuMDU1KSAqKiAyLjQpXHJcbiAgICAgICAgbGV0IGwgPSAwLjIxMjYgKiByICsgMC43MTUyICogZyArIDAuMDcyMiAqIGJcclxuICAgICAgICByZXR1cm4gbCA8IHRocmVzaG9sZDtcclxuICAgIH1cclxuICAgIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGByZ2JhKCR7dGhpcy5yfSwgJHt0aGlzLmd9LCAke3RoaXMuYn0sICR7dGhpcy5hfSlgO1xyXG4gICAgfVxyXG4gICAgdG9SZ2JhQXJyYXkoKTogW3I6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIsIGE6IG51bWJlcl0ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy5yLCB0aGlzLmcsIHRoaXMuYiwgdGhpcy5hXTtcclxuICAgIH1cclxuICAgIHRvSHN2YUFycmF5KCk6IFtoOiBudW1iZXIsIHM6IG51bWJlciwgdjogbnVtYmVyLCBhOiBudW1iZXJdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMuaHVlLCB0aGlzLnNhdCwgdGhpcy52YWwsIHRoaXMuYV07XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIElOUFVUIENMQVNTRVMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgS2V5cHJlc3NlcyB7XHJcbiAgICBzdGF0aWMga2V5UHJlc3NlZDoge1trZXk6c3RyaW5nXTogYW55fSA9IHt9O1xyXG4gICAgc3RhdGljIHByZXNzZWRLZXlzOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKTtcclxuICAgIHN0YXRpYyBrZXlEb3duRXZlbnQgPSBuZXcgU2lnbmFsPFtrZXlOYW1lOnN0cmluZ10+KCk7XHJcbiAgICBzdGF0aWMga2V5VXBFdmVudCA9IG5ldyBTaWduYWw8W2tleU5hbWU6c3RyaW5nXT4oKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGtleWRvd24oa2V5OiBzdHJpbmcpIHtcclxuICAgIEtleXByZXNzZXMua2V5UHJlc3NlZFtrZXldID0gdHJ1ZTtcclxuICAgIEtleXByZXNzZXMucHJlc3NlZEtleXMuYWRkKGtleSk7XHJcbiAgICBLZXlwcmVzc2VzLmtleURvd25FdmVudC5maXJlKGtleSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBrZXl1cChrZXk6IHN0cmluZykge1xyXG4gICAgZGVsZXRlIEtleXByZXNzZXMua2V5UHJlc3NlZFtrZXldO1xyXG4gICAgS2V5cHJlc3Nlcy5wcmVzc2VkS2V5cy5kZWxldGUoa2V5KTtcclxuICAgIEtleXByZXNzZXMua2V5VXBFdmVudC5maXJlKGtleSk7XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlID0+IHtcclxuICAgIGNvbnN0IGtleSA9IGUua2V5LnRvTG93ZXJDYXNlKCk7XHJcbiAgICBrZXlkb3duKGtleSk7XHJcbn0pO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBlID0+IHtcclxuICAgIGNvbnN0IGtleSA9IGUua2V5LnRvTG93ZXJDYXNlKCk7XHJcbiAgICBrZXl1cChrZXkpO1xyXG59KTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGUgPT4ge1xyXG4gICAgaWYoZS5idXR0b24gPT09IDApIHtcclxuICAgICAgICBrZXlkb3duKFwibG1iXCIpO1xyXG4gICAgfSBlbHNlIGlmKGUuYnV0dG9uID09PSAxKSB7XHJcbiAgICAgICAga2V5ZG93bihcIm1tYlwiKTtcclxuICAgIH0gZWxzZSBpZihlLmJ1dHRvbiA9PT0gMikge1xyXG4gICAgICAgIGtleWRvd24oXCJybWJcIik7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGUgPT4ge1xyXG4gICAgaWYoZS5idXR0b24gPT09IDApIHtcclxuICAgICAgICBrZXl1cChcImxtYlwiKTtcclxuICAgIH0gZWxzZSBpZihlLmJ1dHRvbiA9PT0gMSkge1xyXG4gICAgICAgIGtleXVwKFwibW1iXCIpO1xyXG4gICAgfSBlbHNlIGlmKGUuYnV0dG9uID09PSAyKSB7XHJcbiAgICAgICAga2V5dXAoXCJybWJcIik7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBvaW50ZXJMb2NrIHtcclxuICAgIGNvbm5lY3Rpb25zID0gbmV3IENvbm5lY3Rpb25Hcm91cCgpO1xyXG4gICAgcG9pbnRlckxvY2tDaGFuZ2VFdmVudDogU2lnbmFsPFtpc0xvY2tlZDogYm9vbGVhbl0+ID0gbmV3IFNpZ25hbCgpO1xyXG4gICAgbG9ja2VkTW91c2VNb3ZlRXZlbnQ6IFNpZ25hbDxbZHg6IG51bWJlciwgZHk6IG51bWJlcl0+ID0gbmV3IFNpZ25hbCgpO1xyXG4gICAgaXNFbmFibGVkID0gZmFsc2U7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmFkZChuZXcgSHRtbENvbm5lY3Rpb24od2luZG93LCBcIm1vdXNlZG93blwiLCAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZih0aGlzLmlzRW5hYmxlZCAmJiBkb2N1bWVudC5wb2ludGVyTG9ja0VsZW1lbnQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZXF1ZXN0UG9pbnRlckxvY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmFkZChuZXcgSHRtbENvbm5lY3Rpb24od2luZG93LCBcIm1vdXNlbW92ZVwiLCAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZihkb2N1bWVudC5wb2ludGVyTG9ja0VsZW1lbnQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRoaXMubG9ja2VkTW91c2VNb3ZlRXZlbnQuZmlyZShlLm1vdmVtZW50WCwgZS5tb3ZlbWVudFkpO1xyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmFkZChuZXcgSHRtbENvbm5lY3Rpb24oZG9jdW1lbnQsIFwicG9pbnRlcmxvY2tjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBvaW50ZXJMb2NrQ2hhbmdlRXZlbnQuZmlyZShkb2N1bWVudC5wb2ludGVyTG9ja0VsZW1lbnQgIT0gbnVsbCk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG4gICAgbG9jaygpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLmlzRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZXF1ZXN0UG9pbnRlckxvY2soKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHVubG9jaygpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLmlzRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIGRvY3VtZW50LmV4aXRQb2ludGVyTG9jaygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmVtb3ZlKCkge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMuZGlzY29ubmVjdEFsbCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBPQlNFUlZFUiBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGNsYXNzIFdpbmRvd1Jlc2l6ZU9ic2VydmVyIHtcclxuICAgIHJlc2l6ZUV2ZW50OiBTaWduYWw8W3c6IG51bWJlciwgaDogbnVtYmVyXT4gPSBuZXcgU2lnbmFsKHtcclxuICAgICAgICBvbkNvbm5lY3Q6IGNvbm4gPT4gY29ubi5maXJlKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpLFxyXG4gICAgfSk7XHJcbiAgICBjb25uZWN0aW9ucyA9IG5ldyBDb25uZWN0aW9uR3JvdXAoKTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMuYWRkKG5ldyBIdG1sQ29ubmVjdGlvbih3aW5kb3csIFwicmVzaXplXCIsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZXNpemVFdmVudC5maXJlKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuICAgIHJlbW92ZSgpIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmRpc2Nvbm5lY3RBbGwoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIFJFTkRFUiBMT09QIENMQVNTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBSZW5kZXJMb29wIHtcclxuICAgIHJlbmRlclN0ZXBwZWRFdmVudDogU2lnbmFsPFtkdDogbnVtYmVyXT4gPSBuZXcgU2lnbmFsKCk7XHJcbiAgICBydW5JbmRleCA9IDA7XHJcbiAgICBpc1J1bm5pbmcgPSBmYWxzZTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBjYWxsYmFjazogKGR0OiBudW1iZXIpID0+IHZvaWQpIHtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMuaXNSdW5uaW5nKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucnVuSW5kZXgrKztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIGlmKHRoaXMuaXNSdW5uaW5nKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB0aGlzLmlzUnVubmluZyA9IHRydWU7XHJcbiAgICAgICAgbGV0IHJpID0gdGhpcy5ydW5JbmRleDtcclxuICAgICAgICBsZXQgZnJhbWVUaW1lID0gcGVyZm9ybWFuY2Uubm93KCkvMTAwMDtcclxuICAgICAgICBjb25zdCByZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMucnVuSW5kZXggIT0gcmkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgbm93ID0gcGVyZm9ybWFuY2Uubm93KCkvMTAwMDtcclxuICAgICAgICAgICAgbGV0IGR0ID0gbm93IC0gZnJhbWVUaW1lO1xyXG4gICAgICAgICAgICBmcmFtZVRpbWUgPSBub3c7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyU3RlcHBlZEV2ZW50LmZpcmUoZHQpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrKGR0KTtcclxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlbmRlcigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgQVJUSUZJQ0lBTCBJTlRFTExJR0VOQ0UgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IHR5cGUgTGF5ZXJBY3RpdmF0aW9uID0ge1xyXG4gICAgYWN0aXZhdGU6ICh6OiBudW1iZXIpID0+IG51bWJlcixcclxuICAgIGRhX2R6OiAoejogbnVtYmVyLCBhOiBudW1iZXIpID0+IG51bWJlcixcclxuICAgIG5hbWU6IHN0cmluZyxcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFNpZ21vaWRBY3RpdmF0aW9uOiBMYXllckFjdGl2YXRpb24gPSB7XHJcbiAgICBhY3RpdmF0ZTogKHo6IG51bWJlcikgPT4gMS8oMStNYXRoLmV4cCgteikpLFxyXG4gICAgZGFfZHo6ICh6OiBudW1iZXIsIGE6IG51bWJlcikgPT4gYSAqICgxIC0gYSksXHJcbiAgICBuYW1lOiBcIlNpZ21vaWRcIixcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFJlbHVBY3RpdmF0aW9uOiBMYXllckFjdGl2YXRpb24gPSB7XHJcbiAgICBhY3RpdmF0ZTogKHo6IG51bWJlcikgPT4gTWF0aC5tYXgoeiwgMCksXHJcbiAgICBkYV9kejogKHo6IG51bWJlciwgYTogbnVtYmVyKSA9PiB6ID4gMCA/IDEgOiAwLFxyXG4gICAgbmFtZTogXCJSZUxVXCIsXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBMaW5lYXJBY3RpdmF0aW9uOiBMYXllckFjdGl2YXRpb24gPSB7XHJcbiAgICBhY3RpdmF0ZTogKHo6IG51bWJlcikgPT4geixcclxuICAgIGRhX2R6OiAoejogbnVtYmVyLCBhOiBudW1iZXIpID0+IDEsXHJcbiAgICBuYW1lOiBcIkxpbmVhclwiLFxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNvZnRtYXhMYXllcihsYXllcjogRGVuc2VMYXllcikge1xyXG4gICAgbGV0IG1heCA9IC1JbmZpbml0eTtcclxuICAgIGZvcihsZXQgaT0wOyBpPGxheWVyLnNpemU7IGkrKykge1xyXG4gICAgICAgIG1heCA9IE1hdGgubWF4KG1heCwgbGF5ZXIudmFsdWVzX3pbaV0hKTtcclxuICAgIH1cclxuICAgIGxldCBzdW0gPSAwO1xyXG4gICAgZm9yKGxldCBpPTA7IGk8bGF5ZXIuc2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgdiA9IE1hdGguZXhwKGxheWVyLnZhbHVlc196W2ldISAtIG1heCk7XHJcbiAgICAgICAgbGF5ZXIudmFsdWVzX2FbaV0gPSB2O1xyXG4gICAgICAgIHN1bSArPSB2O1xyXG4gICAgfVxyXG4gICAgZm9yKGxldCBpPTA7IGk8bGF5ZXIuc2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgbGF5ZXIudmFsdWVzX2FbaV0hIC89IHN1bTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHR5cGUgTGF5ZXJFcnJvciA9IHtcclxuICAgIGRlcnJfZGE6IChsYXllcjogRGVuc2VMYXllciwgb3V0cHV0OiBGbG9hdDMyQXJyYXkgfCBudW1iZXJbXSwgaTogbnVtYmVyKSA9PiBudW1iZXIsXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBNc2VFcnJvcjogTGF5ZXJFcnJvciA9IHtcclxuICAgIGRlcnJfZGE6IChsYXllcjogRGVuc2VMYXllciwgb3V0cHV0OiBGbG9hdDMyQXJyYXkgfCBudW1iZXJbXSwgaTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIC0yL2xheWVyLnNpemUgKiAob3V0cHV0W2ldISAtIGxheWVyLnZhbHVlc19hW2ldISk7XHJcbiAgICB9LFxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBXZWlnaHRSYW5kb21pemVyID0ge1xyXG4gICAgZ2V0OiAobkluOiBudW1iZXIsIG5PdXQ6IG51bWJlcikgPT4gbnVtYmVyLFxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IFhhdmllck5vcm1hbDogV2VpZ2h0UmFuZG9taXplciA9IHtcclxuICAgIGdldDogKG5JbjogbnVtYmVyLCBuT3V0OiBudW1iZXIpID0+IHtcclxuICAgICAgICBjb25zdCBwMSA9IE1hdGguc3FydCgtMiAqIE1hdGgubG9nKE1hdGgubWF4KE1hdGgucmFuZG9tKCksIDFlLTcpKSk7XHJcbiAgICAgICAgY29uc3QgcDIgPSBNYXRoLmNvcygyICogTWF0aC5QSSAqIE1hdGgucmFuZG9tKCkpO1xyXG4gICAgICAgIGNvbnN0IHAzID0gTWF0aC5zcXJ0KDIgLyAobkluICsgbk91dCkpO1xyXG4gICAgICAgIHJldHVybiBwMSAqIHAyICogcDM7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgWGF2aWVyVW5pZm9ybTogV2VpZ2h0UmFuZG9taXplciA9IHtcclxuICAgIGdldDogKG5JbjogbnVtYmVyLCBuT3V0OiBudW1iZXIpID0+IHtcclxuICAgICAgICBjb25zdCBsaW1pdCA9IE1hdGguc3FydCg2IC8gKG5JbiArIG5PdXQpKTtcclxuICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqICgyICogbGltaXQpIC0gbGltaXQ7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgSGVOb3JtYWw6IFdlaWdodFJhbmRvbWl6ZXIgPSB7XHJcbiAgICBnZXQ6IChuSW46IG51bWJlciwgbk91dDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcDEgPSBNYXRoLnNxcnQoLTIgKiBNYXRoLmxvZyhNYXRoLm1heChNYXRoLnJhbmRvbSgpLCAxZS03KSkpO1xyXG4gICAgICAgIGNvbnN0IHAyID0gTWF0aC5jb3MoMiAqIE1hdGguUEkgKiBNYXRoLnJhbmRvbSgpKTtcclxuICAgICAgICBjb25zdCBwMyA9IE1hdGguc3FydCgyIC8gbkluKTtcclxuICAgICAgICByZXR1cm4gcDEgKiBwMiAqIHAzO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IEhlVW5pZm9ybTogV2VpZ2h0UmFuZG9taXplciA9IHtcclxuICAgIGdldDogKG5JbjogbnVtYmVyLCBuT3V0OiBudW1iZXIpID0+IHtcclxuICAgICAgICBjb25zdCBsaW1pdCA9IE1hdGguc3FydCg2IC8gbkluKTtcclxuICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqICgyICogbGltaXQpIC0gbGltaXQ7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgUmFuZG9tVW5pZm9ybTogV2VpZ2h0UmFuZG9taXplciA9IHtcclxuICAgIGdldDogKG5JbjogbnVtYmVyLCBuT3V0OiBudW1iZXIpID0+IHtcclxuICAgICAgICByZXR1cm4gKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiAwLjAxO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIExheWVyT3B0aW1pemVyIHtcclxuICAgIGFic3RyYWN0IGFwcGx5R3JhZGllbnRzKGxlYXJuUmF0ZTogbnVtYmVyLCBiYXRjaFNpemU6IG51bWJlciwgY2xlYXJHcmFkaWVudHM6IGJvb2xlYW4pOiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2dkT3B0aW1pemVyIGV4dGVuZHMgTGF5ZXJPcHRpbWl6ZXIge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGxheWVyOiBEZW5zZUxheWVyKSB7IHN1cGVyKCk7IH1cclxuICAgIGFwcGx5R3JhZGllbnRzKGxlYXJuUmF0ZTogbnVtYmVyLCBiYXRjaFNpemU6IG51bWJlciwgY2xlYXJHcmFkaWVudHM6IGJvb2xlYW4pIHtcclxuICAgICAgICBjb25zdCBsYXllciA9IHRoaXMubGF5ZXI7XHJcbiAgICAgICAgY29uc3QgbCA9IGxlYXJuUmF0ZSAvIGJhdGNoU2l6ZTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxsYXllci5zaXplOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCBqPTA7IGo8bGF5ZXIuaW5wdXRTaXplOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGxheWVyLndlaWdodHNbaV0hW2pdISAtPSBsYXllci53ZWlnaHRHcmFkc1tpXSFbal0hICogbDtcclxuICAgICAgICAgICAgICAgIGlmKGNsZWFyR3JhZGllbnRzKSBsYXllci53ZWlnaHRHcmFkc1tpXSFbal0hID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsYXllci5iaWFzZXNbaV0hIC09IGxheWVyLmJpYXNHcmFkc1tpXSEgKiBsO1xyXG4gICAgICAgICAgICBpZihjbGVhckdyYWRpZW50cykgbGF5ZXIuYmlhc0dyYWRzW2ldID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBZGFtT3B0aW1pemVyIGV4dGVuZHMgTGF5ZXJPcHRpbWl6ZXIge1xyXG4gICAgd2VpZ2h0TTogRmxvYXQzMkFycmF5W107XHJcbiAgICB3ZWlnaHRWOiBGbG9hdDMyQXJyYXlbXTtcclxuICAgIGJpYXNNOiBGbG9hdDMyQXJyYXk7XHJcbiAgICBiaWFzVjogRmxvYXQzMkFycmF5O1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHVibGljIGxheWVyOiBEZW5zZUxheWVyLFxyXG4gICAgICAgIHB1YmxpYyBiZXRhMSA9IDAuOSxcclxuICAgICAgICBwdWJsaWMgYmV0YTIgPSAwLjk5OSxcclxuICAgICAgICBwdWJsaWMgZXBzaWxvbiA9IDFlLTgsXHJcbiAgICAgICAgcHVibGljIHQgPSAwLFxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLndlaWdodE0gPSBbXTtcclxuICAgICAgICB0aGlzLndlaWdodFYgPSBbXTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxsYXllci5zaXplOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy53ZWlnaHRNLnB1c2gobmV3IEZsb2F0MzJBcnJheShsYXllci5pbnB1dFNpemUpKTtcclxuICAgICAgICAgICAgdGhpcy53ZWlnaHRWLnB1c2gobmV3IEZsb2F0MzJBcnJheShsYXllci5pbnB1dFNpemUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5iaWFzTSA9IG5ldyBGbG9hdDMyQXJyYXkobGF5ZXIuc2l6ZSk7XHJcbiAgICAgICAgdGhpcy5iaWFzViA9IG5ldyBGbG9hdDMyQXJyYXkobGF5ZXIuc2l6ZSk7XHJcbiAgICB9XHJcbiAgICBhcHBseUdyYWRpZW50cyhsZWFyblJhdGU6IG51bWJlciwgYmF0Y2hTaXplOiBudW1iZXIsIGNsZWFyR3JhZGllbnRzOiBib29sZWFuKSB7XHJcbiAgICAgICAgY29uc3QgbGF5ZXIgPSB0aGlzLmxheWVyO1xyXG4gICAgICAgIGNvbnN0IGxyID0gbGVhcm5SYXRlIC8gYmF0Y2hTaXplO1xyXG4gICAgICAgIHRoaXMudCsrO1xyXG4gICAgICAgIGNvbnN0IGIxID0gdGhpcy5iZXRhMTtcclxuICAgICAgICBjb25zdCBiMiA9IHRoaXMuYmV0YTI7XHJcbiAgICAgICAgY29uc3QgZXBzID0gdGhpcy5lcHNpbG9uO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPGxheWVyLnNpemU7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBnQiA9IGxheWVyLmJpYXNHcmFkc1tpXSE7XHJcbiAgICAgICAgICAgIHRoaXMuYmlhc01baV0gPSBiMSAqIHRoaXMuYmlhc01baV0hICsgKDEgLSBiMSkgKiBnQjtcclxuICAgICAgICAgICAgdGhpcy5iaWFzVltpXSA9IGIyICogdGhpcy5iaWFzVltpXSEgKyAoMSAtIGIyKSAqIGdCICogZ0I7XHJcbiAgICAgICAgICAgIGNvbnN0IG1IYXRCID0gdGhpcy5iaWFzTVtpXSEgLyAoMSAtIE1hdGgucG93KGIxLCB0aGlzLnQpKTtcclxuICAgICAgICAgICAgY29uc3QgdkhhdEIgPSB0aGlzLmJpYXNWW2ldISAvICgxIC0gTWF0aC5wb3coYjIsIHRoaXMudCkpO1xyXG4gICAgICAgICAgICBsYXllci5iaWFzZXNbaV0hIC09IGxyICogbUhhdEIgLyAoTWF0aC5zcXJ0KHZIYXRCKSArIGVwcyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGo9MDsgajxsYXllci5pbnB1dFNpemU7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ1cgPSBsYXllci53ZWlnaHRHcmFkc1tpXSFbal0hO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWlnaHRNW2ldIVtqXSA9IGIxICogdGhpcy53ZWlnaHRNW2ldIVtqXSEgKyAoMSAtIGIxKSAqIGdXO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWlnaHRWW2ldIVtqXSA9IGIyICogdGhpcy53ZWlnaHRWW2ldIVtqXSEgKyAoMSAtIGIyKSAqIGdXICogZ1c7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtSGF0ID0gdGhpcy53ZWlnaHRNW2ldIVtqXSEgLyAoMSAtIE1hdGgucG93KGIxLCB0aGlzLnQpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZIYXQgPSB0aGlzLndlaWdodFZbaV0hW2pdISAvICgxIC0gTWF0aC5wb3coYjIsIHRoaXMudCkpO1xyXG4gICAgICAgICAgICAgICAgbGF5ZXIud2VpZ2h0c1tpXSFbal0hIC09IGxyICogbUhhdCAvIChNYXRoLnNxcnQodkhhdCkgKyBlcHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRGVuc2VMYXllciB7XHJcbiAgICB2YWx1ZXNfYTogRmxvYXQzMkFycmF5O1xyXG4gICAgdmFsdWVzX3o6IEZsb2F0MzJBcnJheTtcclxuICAgIGRlcnJfZHo6IEZsb2F0MzJBcnJheTtcclxuICAgIHdlaWdodHM6IEZsb2F0MzJBcnJheVtdO1xyXG4gICAgd2VpZ2h0R3JhZHM6IEZsb2F0MzJBcnJheVtdO1xyXG4gICAgYmlhc2VzOiBGbG9hdDMyQXJyYXk7XHJcbiAgICBiaWFzR3JhZHM6IEZsb2F0MzJBcnJheTtcclxuICAgIG9wdGltaXplcjogTGF5ZXJPcHRpbWl6ZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwdWJsaWMgaW5wdXRTaXplOiBudW1iZXIsXHJcbiAgICAgICAgcHVibGljIHNpemU6IG51bWJlcixcclxuICAgICAgICBwdWJsaWMgYWN0aXZhdGlvbk9yT3ZlcnJpZGU6IExheWVyQWN0aXZhdGlvbiB8IFwic29mdG1heF9jcm9zc19lbnRyb3B5XCIsXHJcbiAgICAgICAgb3B0aW1pemVyPzogTGF5ZXJPcHRpbWl6ZXIsXHJcbiAgICAgICAgd2VpZ2h0SW5pdD86IFdlaWdodFJhbmRvbWl6ZXJcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMudmFsdWVzX2EgPSBuZXcgRmxvYXQzMkFycmF5KHNpemUpO1xyXG4gICAgICAgIHRoaXMudmFsdWVzX3ogPSBuZXcgRmxvYXQzMkFycmF5KHNpemUpO1xyXG4gICAgICAgIHRoaXMuZGVycl9keiA9IG5ldyBGbG9hdDMyQXJyYXkoc2l6ZSk7XHJcbiAgICAgICAgdGhpcy53ZWlnaHRzID0gW107XHJcbiAgICAgICAgdGhpcy53ZWlnaHRHcmFkcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuYmlhc2VzID0gbmV3IEZsb2F0MzJBcnJheShzaXplKTtcclxuICAgICAgICB0aGlzLmJpYXNHcmFkcyA9IG5ldyBGbG9hdDMyQXJyYXkoc2l6ZSk7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8c2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMud2VpZ2h0cy5wdXNoKG5ldyBGbG9hdDMyQXJyYXkoaW5wdXRTaXplKSk7XHJcbiAgICAgICAgICAgIHRoaXMud2VpZ2h0R3JhZHMucHVzaChuZXcgRmxvYXQzMkFycmF5KGlucHV0U2l6ZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJhbmRvbWl6ZVdlaWdodHMod2VpZ2h0SW5pdCA/PyAoKGFjdGl2YXRpb25Pck92ZXJyaWRlICE9IFwic29mdG1heF9jcm9zc19lbnRyb3B5XCIgJiYgYWN0aXZhdGlvbk9yT3ZlcnJpZGUubmFtZS50b0xvd2VyQ2FzZSgpID09IFwicmVsdVwiKSA/IEhlTm9ybWFsIDogWGF2aWVyVW5pZm9ybSkpO1xyXG4gICAgICAgIHRoaXMub3B0aW1pemVyID0gb3B0aW1pemVyID8/IG5ldyBBZGFtT3B0aW1pemVyKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgcmFuZG9taXplV2VpZ2h0cyhtZXRob2Q6IFdlaWdodFJhbmRvbWl6ZXIgPSBYYXZpZXJVbmlmb3JtKSB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5zaXplOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCBqPTA7IGo8dGhpcy5pbnB1dFNpemU7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWlnaHRzW2ldIVtqXSA9IG1ldGhvZC5nZXQodGhpcy5pbnB1dFNpemUsIHRoaXMuc2l6ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3J3YXJkKGlucHV0OiBEZW5zZUxheWVyIHwgRmxvYXQzMkFycmF5IHwgbnVtYmVyW10pIHtcclxuICAgICAgICBpZihpbnB1dCBpbnN0YW5jZW9mIERlbnNlTGF5ZXIpXHJcbiAgICAgICAgICAgIGlucHV0ID0gaW5wdXQudmFsdWVzX2E7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5zaXplOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHogPSB0aGlzLmJpYXNlc1tpXSE7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaj0wOyBqPHRoaXMuaW5wdXRTaXplOyBqKyspXHJcbiAgICAgICAgICAgICAgICB6ICs9IGlucHV0W2pdISAqIHRoaXMud2VpZ2h0c1tpXSFbal0hO1xyXG4gICAgICAgICAgICBpZih0aGlzLmFjdGl2YXRpb25Pck92ZXJyaWRlICE9IFwic29mdG1heF9jcm9zc19lbnRyb3B5XCIpIHtcclxuICAgICAgICAgICAgICAgIGxldCBhID0gdGhpcy5hY3RpdmF0aW9uT3JPdmVycmlkZS5hY3RpdmF0ZSh6KTtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzX2FbaV0gPSBhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVzX3pbaV0gPSB6O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmFjdGl2YXRpb25Pck92ZXJyaWRlID09IFwic29mdG1heF9jcm9zc19lbnRyb3B5XCIpIHtcclxuICAgICAgICAgICAgc29mdG1heExheWVyKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNsZWFyR3JhZGllbnRzKCkge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMuc2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYmlhc0dyYWRzIVtpXSA9IDA7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaj0wOyBqPHRoaXMuaW5wdXRTaXplOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2VpZ2h0R3JhZHMhW2ldIVtqXSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBiYWNrd2FyZFRhcmdldChpbnB1dDogRGVuc2VMYXllciB8IEZsb2F0MzJBcnJheSB8IG51bWJlcltdLCBvdXRwdXQ6IEZsb2F0MzJBcnJheSB8IG51bWJlcltdLCBlcnJvcjogTGF5ZXJFcnJvciA9IE1zZUVycm9yLCBhY2N1bXVsYXRlID0gdHJ1ZSkge1xyXG4gICAgICAgIGlmKGlucHV0IGluc3RhbmNlb2YgRGVuc2VMYXllcilcclxuICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC52YWx1ZXNfYTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnNpemU7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZGVycl9kejtcclxuICAgICAgICAgICAgaWYodGhpcy5hY3RpdmF0aW9uT3JPdmVycmlkZSA9PSBcInNvZnRtYXhfY3Jvc3NfZW50cm9weVwiKSB7XHJcbiAgICAgICAgICAgICAgICBkZXJyX2R6ID0gdGhpcy52YWx1ZXNfYVtpXSEgLSBvdXRwdXRbaV0hO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXJyX2R6W2ldID0gZGVycl9kejtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlcnJfZGEgPSBlcnJvci5kZXJyX2RhKHRoaXMsIG91dHB1dCwgaSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYV9keiA9IHRoaXMuYWN0aXZhdGlvbk9yT3ZlcnJpZGUuZGFfZHoodGhpcy52YWx1ZXNfeltpXSEsIHRoaXMudmFsdWVzX2FbaV0hKTtcclxuICAgICAgICAgICAgICAgIGRlcnJfZHogPSBkZXJyX2RhICogZGFfZHo7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlcnJfZHpbaV0gPSBkZXJyX2R6O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvcihsZXQgaj0wOyBqPHRoaXMuaW5wdXRTaXplOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGR6X2R3aWogPSBpbnB1dFtqXSE7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZXJyX2R3aWogPSBkZXJyX2R6ICogZHpfZHdpajtcclxuICAgICAgICAgICAgICAgIGlmKGFjY3VtdWxhdGUpIHRoaXMud2VpZ2h0R3JhZHNbaV0hW2pdISArPSBkZXJyX2R3aWo7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMud2VpZ2h0R3JhZHNbaV0hW2pdISA9IGRlcnJfZHdpajtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihhY2N1bXVsYXRlKSB0aGlzLmJpYXNHcmFkc1tpXSEgKz0gZGVycl9kejtcclxuICAgICAgICAgICAgZWxzZSB0aGlzLmJpYXNHcmFkc1tpXSEgPSBkZXJyX2R6O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGJhY2t3YXJkTGF5ZXIoaW5wdXQ6IERlbnNlTGF5ZXIgfCBGbG9hdDMyQXJyYXkgfCBudW1iZXJbXSwgb3V0cHV0OiBEZW5zZUxheWVyLCBhY2N1bXVsYXRlID0gdHJ1ZSkge1xyXG4gICAgICAgIGlmKGlucHV0IGluc3RhbmNlb2YgRGVuc2VMYXllcilcclxuICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC52YWx1ZXNfYTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnNpemU7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZGVycl9kYWkgPSAwO1xyXG4gICAgICAgICAgICBpZih0aGlzLmFjdGl2YXRpb25Pck92ZXJyaWRlID09IFwic29mdG1heF9jcm9zc19lbnRyb3B5XCIpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgdXNlIHNvZnRtYXgvY3Jvc3MtZW50cm9weSBvbiBhIGhpZGRlbiBsYXllclwiKTtcclxuICAgICAgICAgICAgY29uc3QgZGFpX2R6aSA9IHRoaXMuYWN0aXZhdGlvbk9yT3ZlcnJpZGUuZGFfZHoodGhpcy52YWx1ZXNfeltpXSEsIHRoaXMudmFsdWVzX2FbaV0hKTtcclxuICAgICAgICAgICAgZm9yKGxldCBqPTA7IGo8b3V0cHV0LnNpemU7IGorKylcclxuICAgICAgICAgICAgICAgIGRlcnJfZGFpICs9IG91dHB1dC5kZXJyX2R6W2pdISAqIG91dHB1dC53ZWlnaHRzW2pdIVtpXSE7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlcnJfZHogPSBkZXJyX2RhaSAqIGRhaV9kemlcclxuICAgICAgICAgICAgdGhpcy5kZXJyX2R6W2ldID0gZGVycl9kejtcclxuICAgICAgICAgICAgZm9yKGxldCBqPTA7IGo8dGhpcy5pbnB1dFNpemU7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZHpfZHdpaiA9IGlucHV0W2pdITtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlcnJfZHdpaiA9IGRlcnJfZHogKiBkel9kd2lqO1xyXG4gICAgICAgICAgICAgICAgaWYoYWNjdW11bGF0ZSkgdGhpcy53ZWlnaHRHcmFkc1tpXSFbal0hICs9IGRlcnJfZHdpajtcclxuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy53ZWlnaHRHcmFkc1tpXSFbal0hID0gZGVycl9kd2lqO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKGFjY3VtdWxhdGUpIHRoaXMuYmlhc0dyYWRzW2ldISArPSBkZXJyX2R6O1xyXG4gICAgICAgICAgICBlbHNlIHRoaXMuYmlhc0dyYWRzW2ldISA9IGRlcnJfZHo7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYXBwbHlHcmFkaWVudHMobGVhcm5SYXRlOiBudW1iZXIsIGJhdGNoU2l6ZTogbnVtYmVyLCBjbGVhckdyYWRpZW50cyA9IHRydWUpIHtcclxuICAgICAgICB0aGlzLm9wdGltaXplci5hcHBseUdyYWRpZW50cyhsZWFyblJhdGUsIGJhdGNoU2l6ZSwgY2xlYXJHcmFkaWVudHMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRGVuc2VOZXR3b3JrIHtcclxuICAgIHB1YmxpYyBsYXllcnM6IERlbnNlTGF5ZXJbXSA9IFtdO1xyXG4gICAgaW5wdXQ6IEZsb2F0MzJBcnJheTtcclxuICAgIGJhdGNoZXMgPSAwO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGlucHV0U2l6ZTogbnVtYmVyLCBsYXllcnM6IFtzaXplOiBudW1iZXIsIGFjdGl2YXRpb246IExheWVyQWN0aXZhdGlvbiwgb3B0aW1pemVyPzogTGF5ZXJPcHRpbWl6ZXIsIHdlaWdodEluaXQ/OiBXZWlnaHRSYW5kb21pemVyXVtdKSB7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IG5ldyBGbG9hdDMyQXJyYXkoaW5wdXRTaXplKTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGxheWVyID0gbmV3IERlbnNlTGF5ZXIoaT09MCA/IGlucHV0U2l6ZSA6IGxheWVyc1tpLTFdIVswXSwgbGF5ZXJzW2ldIVswXSwgbGF5ZXJzW2ldIVsxXSwgbGF5ZXJzW2ldIVsyXSwgbGF5ZXJzW2ldIVszXSk7XHJcbiAgICAgICAgICAgIHRoaXMubGF5ZXJzLnB1c2gobGF5ZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvcndhcmQodmFsdWVzPzogRmxvYXQzMkFycmF5IHwgbnVtYmVyW10pIHtcclxuICAgICAgICBsZXQgaW5wdXQ6IERlbnNlTGF5ZXIgfCBGbG9hdDMyQXJyYXkgPSB0aGlzLmlucHV0O1xyXG4gICAgICAgIGlmKHZhbHVlcykgdGhpcy5pbnB1dC5zZXQodmFsdWVzKTtcclxuICAgICAgICBmb3IoY29uc3QgbGF5ZXIgb2YgdGhpcy5sYXllcnMpIHtcclxuICAgICAgICAgICAgbGF5ZXIuZm9yd2FyZChpbnB1dCk7XHJcbiAgICAgICAgICAgIGlucHV0ID0gbGF5ZXI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYmFja3dhcmQob3V0cHV0OiBGbG9hdDMyQXJyYXkgfCBudW1iZXJbXSwgZXJyb3I6IExheWVyRXJyb3IgPSBNc2VFcnJvcikge1xyXG4gICAgICAgIGZvcihsZXQgaT10aGlzLmxheWVycy5sZW5ndGgtMTsgaT49MDsgaS0tKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxheWVyID0gdGhpcy5sYXllcnNbaV0hO1xyXG4gICAgICAgICAgICBjb25zdCBwcmV2TGF5ZXIgPSBpID09IDAgPyB0aGlzLmlucHV0IDogdGhpcy5sYXllcnNbaS0xXSE7XHJcbiAgICAgICAgICAgIGlmKGkgPT0gdGhpcy5sYXllcnMubGVuZ3RoLTEpIHtcclxuICAgICAgICAgICAgICAgIGxheWVyLmJhY2t3YXJkVGFyZ2V0KHByZXZMYXllciwgb3V0cHV0LCBlcnJvciwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsYXllci5iYWNrd2FyZExheWVyKHByZXZMYXllciwgdGhpcy5sYXllcnNbaSsxXSEsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYmF0Y2hlcysrO1xyXG4gICAgfVxyXG4gICAgYXBwbHlHcmFkaWVudChsZWFyblJhdGU6IG51bWJlcikge1xyXG4gICAgICAgIGZvcihjb25zdCBsYXllciBvZiB0aGlzLmxheWVycykge1xyXG4gICAgICAgICAgICBsYXllci5hcHBseUdyYWRpZW50cyhsZWFyblJhdGUsIHRoaXMuYmF0Y2hlcywgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYmF0Y2hlcyA9IDA7XHJcbiAgICB9XHJcbn0iXX0=