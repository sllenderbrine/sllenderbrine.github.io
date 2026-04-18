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
//////////////////////
//  VECTOR CLASSES  //
//////////////////////
export class Vec3 {
    _x;
    _y;
    _z;
    onMutate;
    constructor(x, y, z, onMutate) {
        if (typeof x === "object") {
            this._x = x.x;
            this._y = x.y;
            this._z = x.z;
            this.onMutate = y;
        }
        else {
            this._x = x;
            this._y = y;
            this._z = z;
            this.onMutate = onMutate;
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
    angle(other) {
        const c = this.length() * other.length();
        if (c === 0)
            return 0;
        return Math.acos(EMath.clamp(this.dot(other) / c, -1, 1));
    }
    signedAngle(other, reference = Vec3.yAxis()) {
        const angle = this.angle(other);
        const normal = this.cross(other).normSelf();
        if (normal.dot(reference.norm()) > 0)
            return -angle;
        return angle;
    }
    dist(other) {
        return this.sub(other).length();
    }
    distC(x, y, z) {
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
    x;
    y;
    constructor(x, y) {
        if (typeof x === "object") {
            this.x = x.x;
            this.y = x.y;
        }
        else {
            this.x = x;
            this.y = y;
        }
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
            case 0: return this.x;
            case 1: return this.y;
        }
        return undefined;
    }
    set(i, v) {
        switch (i) {
            case 0:
                this.x = v;
                return;
            case 1:
                this.y = v;
                return;
        }
    }
    setC(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
    }
    toString() {
        return `<${this.x.toFixed(2)}, ${this.y.toFixed(2)}>`;
    }
    toArray() {
        return [this.x, this.y];
    }
    clone() {
        return new Vec2(this);
    }
    // Calculations
    length() {
        return Math.sqrt(this.dot(this));
    }
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    dotC(x, y) {
        return this.x * x + this.y * y;
    }
    angle(other) {
        const c = this.length() * other.length();
        if (c === 0)
            return 0;
        return Math.acos(EMath.clamp(this.dot(other) / c, -1, 1));
    }
    signedAngle(other) {
        return Math.atan2(this.x * other.y - this.y * other.x, this.dot(other));
    }
    dist(other) {
        return this.sub(other).length();
    }
    distC(x, y) {
        return this.subC(x, y).length();
    }
    strictEquals(other) {
        return this.x == other.x && this.y == other.y;
    }
    isClose(other, e = 1e-6) {
        return EMath.isClose(this.x, other.x, e) && EMath.isClose(this.y, other.y, e);
    }
    isZero(e = 1e-6) {
        return EMath.isZero(this.x, e) && EMath.isZero(this.y, e);
    }
    theta() {
        return Math.atan2(this.y, this.x);
    }
    // Operations
    add(other) {
        return new Vec2(this.x + other.x, this.y + other.y);
    }
    addSelf(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    addC(x, y) {
        return new Vec2(this.x + x, this.y + y);
    }
    addSelfC(x, y) {
        this.x += x;
        this.y += y;
        return this;
    }
    addF(n) {
        return new Vec2(this.x + n, this.y + n);
    }
    addSelfF(n) {
        this.x += n;
        this.y += n;
        return this;
    }
    addScaled(other, s) {
        return this.clone().addScaledSelf(other, s);
    }
    addScaledSelf(other, s) {
        this.x += other.x * s;
        this.y += other.y * s;
        return this;
    }
    addScaledC(x, y, s) {
        return this.clone().addScaledSelfC(x, y, s);
    }
    addScaledSelfC(x, y, s) {
        this.x += x * s;
        this.y += y * s;
        return this;
    }
    sub(other) {
        return new Vec2(this.x - other.x, this.y - other.y);
    }
    subSelf(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
    subC(x, y) {
        return new Vec2(this.x - x, this.y - y);
    }
    subSelfC(x, y) {
        this.x -= x;
        this.y -= y;
        return this;
    }
    subF(n) {
        return new Vec2(this.x - n, this.y - n);
    }
    subSelfF(n) {
        this.x -= n;
        this.y -= n;
        return this;
    }
    rsub(other) {
        return new Vec2(other.x - this.x, other.y - this.y);
    }
    rsubSelf(other) {
        this.x = other.x - this.x;
        this.y = other.y - this.y;
        return this;
    }
    rsubC(x, y) {
        return new Vec2(x - this.x, y - this.y);
    }
    rsubSelfC(x, y) {
        this.x = x - this.x;
        this.y = y - this.y;
        return this;
    }
    rsubF(n) {
        return new Vec2(n - this.x, n - this.y);
    }
    rsubSelfF(n) {
        this.x = n - this.x;
        this.y = n - this.y;
        return this;
    }
    mul(other) {
        return new Vec2(this.x * other.x, this.y * other.y);
    }
    mulSelf(other) {
        this.x *= other.x;
        this.y *= other.y;
        return this;
    }
    mulC(x, y) {
        return new Vec2(this.x * x, this.y * y);
    }
    mulSelfC(x, y) {
        this.x *= x;
        this.y *= y;
        return this;
    }
    mulF(n) {
        return new Vec2(this.x * n, this.y * n);
    }
    mulSelfF(n) {
        this.x *= n;
        this.y *= n;
        return this;
    }
    div(other) {
        return new Vec2(this.x / other.x, this.y / other.y);
    }
    divSelf(other) {
        this.x /= other.x;
        this.y /= other.y;
        return this;
    }
    divC(x, y) {
        return new Vec2(this.x / x, this.y / y);
    }
    divSelfC(x, y) {
        this.x /= x;
        this.y /= y;
        return this;
    }
    divF(n) {
        return new Vec2(this.x / n, this.y / n);
    }
    divSelfF(n) {
        this.x /= n;
        this.y /= n;
        return this;
    }
    rdiv(other) {
        return new Vec2(other.x / this.x, other.y / this.y);
    }
    rdivSelf(other) {
        this.x = other.x / this.x;
        this.y = other.y / this.y;
        return this;
    }
    rdivC(x, y) {
        return new Vec2(x / this.x, y / this.y);
    }
    rdivSelfC(x, y) {
        this.x = x / this.x;
        this.y = y / this.y;
        return this;
    }
    rdivF(n) {
        return new Vec2(n / this.x, n / this.y);
    }
    rdivSelfF(n) {
        this.x = n / this.x;
        this.y = n / this.y;
        return this;
    }
    neg() {
        return new Vec2(-this.x, -this.y);
    }
    negSelf() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    lerp(other, t) {
        return this.clone().lerpSelf(other, t);
    }
    lerpSelf(other, t) {
        this.x += (other.x - this.x) * t;
        this.y += (other.y - this.y) * t;
        return this;
    }
    lerpC(x, y, t) {
        return this.clone().lerpSelfC(x, y, t);
    }
    lerpSelfC(x, y, t) {
        this.x += (x - this.x) * t;
        this.y += (y - this.y) * t;
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
        this.x = method(this.x, 0);
        this.y = method(this.y, 1);
        return this;
    }
    rotate(a) {
        return this.clone().rotateSelf(a);
    }
    rotateSelf(a) {
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
const gradients2D = [];
for (let i = 0; i < 12; i++) {
    const angle = 2 * Math.PI * i / 12;
    gradients2D.push(new Vec2(Math.cos(angle), Math.sin(angle)));
}
const gradients3D = [];
for (let i = 0; i < 16; i++) {
    const y = 1 - (2 * i) / (15);
    const r = Math.sqrt(1 - y * y);
    const angle = i * Math.PI * (3 - Math.sqrt(5));
    gradients3D.push(new Vec3(Math.cos(angle) * r, y, Math.sin(angle) * r));
}
export class Noise {
    static fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    static randomConstant3(a, b, c) {
        const it = (a * 2394823549) ^ (b * 43859742850) ^ (c * 23094565234);
        return EMath.pmod(it, 10000) / 10000;
    }
    static randomConstant4(a, b, c, d) {
        const it = (a * 2394823549) ^ (b * 43859742850) ^ (c * 23094565234) ^ (d * 8427824566);
        return EMath.pmod(it, 10000) / 10000;
    }
    static getPerlinVector2D(x, y, seed = 0) {
        return gradients2D[Math.floor(Noise.randomConstant3(seed, x, y) * gradients2D.length)];
    }
    static getPerlinVector3D(x, y, z, seed = 0) {
        return gradients3D[Math.floor(Noise.randomConstant4(seed, x, y, z) * gradients3D.length)];
    }
    static getVoronoiGridPosition2D(x, y, seed = 0, t = 1) {
        return new Vec2(x + t * Noise.randomConstant3(x, y, seed), y + t * Noise.randomConstant3(x, y, seed + 1));
    }
    static getVoronoiGridValue2D(x, y, seed = 0) {
        return Noise.randomConstant3(x, y, seed + 2);
    }
    static getVoronoiGridPosition3D(x, y, z, seed = 0, t = 1) {
        return new Vec3(x + t * Noise.randomConstant4(x, y, z, seed), y + t * Noise.randomConstant4(y, z, x, seed + 1), z + t * Noise.randomConstant4(z, x, y, seed + 2));
    }
    static getVoronoiGridValue3D(x, y, z, seed = 0) {
        return Noise.randomConstant4(x, y, z, seed + 3);
    }
    static perlinNoise2D(x, y, seed = 0) {
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
    static perlinNoise3D(x, y, z, seed = 0) {
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
    static voronoiNoise2D(x, y, seed = 0, t = 1) {
        let p = new Vec2(x, y);
        const g0 = p.map(Math.floor);
        let data = {
            pointDistance: Infinity,
            value: 0,
            gridPos: Vec2.zero(),
        };
        for (let xoff = -1; xoff <= 1; xoff++) {
            for (let yoff = -1; yoff <= 1; yoff++) {
                const gridPos = g0.addC(xoff, yoff);
                const pointPos = Noise.getVoronoiGridPosition2D(gridPos.x, gridPos.y, seed, t);
                const dist = p.dist(pointPos);
                if (dist < data.pointDistance) {
                    data.gridPos = gridPos;
                    data.pointDistance = dist;
                    data.value = Noise.getVoronoiGridValue2D(gridPos.x, gridPos.y, seed);
                }
            }
        }
        return data;
    }
    static voronoiNoise3D(x, y, z, seed = 0, t = 1) {
        let p = new Vec3(x, y, z);
        const g0 = p.map(Math.floor);
        let data = {
            pointDistance: Infinity,
            value: 0,
            gridPos: Vec3.zero(),
        };
        for (let xoff = -1; xoff <= 1; xoff++) {
            for (let yoff = -1; yoff <= 1; yoff++) {
                for (let zoff = -1; zoff <= 1; zoff++) {
                    const gridPos = g0.addC(xoff, yoff, zoff);
                    const pointPos = Noise.getVoronoiGridPosition3D(gridPos.x, gridPos.y, gridPos.z, seed, t);
                    const dist = p.dist(pointPos);
                    if (dist < data.pointDistance) {
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
    get perspectiveMatrix() {
        if (this._outdatedPerspectiveMatrix) {
            this._perspectiveMatrix = Mat4.perspective(this._fovY, this._aspect, this._near, this._far);
            delete this._outdatedPerspectiveMatrix;
            this.perspectiveMatrixChangeEvent.fire(this._perspectiveMatrix);
        }
        return this._perspectiveMatrix;
    }
    _translationMatrix = [];
    _outdatedTranslationMatrix = true;
    get translationMatrix() {
        if (this._outdatedTranslationMatrix) {
            this._translationMatrix = Mat4.translate(-this._position.x * this._worldScale, -this._position.y * this._worldScale, -this._position.z * this._worldScale);
            delete this._outdatedTranslationMatrix;
            this.translationMatrixChangeEvent.fire(this._viewMatrix);
        }
        return this._translationMatrix;
    }
    _rotationMatrix = [];
    _outdatedRotationMatrix = true;
    get rotationMatrix() {
        if (this._outdatedRotationMatrix) {
            this._rotationMatrix = Mat4.multiply(Mat4.rotateZ(-this._rotation.z), Mat4.multiply(Mat4.rotateX(-this._rotation.x), Mat4.rotateY(-this._rotation.y)));
            delete this._outdatedRotationMatrix;
            this.rotationMatrixChangeEvent.fire(this._viewMatrix);
        }
        return this._rotationMatrix;
    }
    _viewMatrix = [];
    _outdatedViewMatrix = true;
    get viewMatrix() {
        if (this._outdatedViewMatrix) {
            this._viewMatrix = Mat4.multiply(this.rotationMatrix, this.translationMatrix);
            delete this._outdatedViewMatrix;
            this.viewMatrixChangeEvent.fire(this._viewMatrix);
        }
        return this._viewMatrix;
    }
    perspectiveMatrixChangeEvent = new Signal({ onConnect: conn => conn.fire(this.perspectiveMatrix) });
    viewMatrixChangeEvent = new Signal({ onConnect: conn => conn.fire(this.viewMatrix) });
    rotationMatrixChangeEvent = new Signal({ onConnect: conn => conn.fire(this.rotationMatrix) });
    translationMatrixChangeEvent = new Signal({ onConnect: conn => conn.fire(this.translationMatrix) });
    constructor(position, fovY, aspect, near, far) {
        this.position = position ?? Vec3.zero();
        this.fovY = fovY ?? 95 / 180 * Math.PI;
        this.aspect = aspect ?? 1;
        this.near = near ?? 0.1;
        this.far = far ?? 10000;
        this.rotation = Vec3.zero();
    }
    lookAt(p) {
        let f = this.position.look(p);
        this.rotation = new Vec3(f.pitch(), f.yaw(), 0);
    }
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
                distance: -edge.dist(point),
                normal: normal,
            };
        }
        else {
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
    static getCircleLineCollision(point, radius, start, end) {
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
export class PhysicsLab2D {
    objectAddedEvent = new Signal();
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
        this.objectAddedEvent.fire(rect);
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
        this.objectAddedEvent.fire(ball);
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
/**
 * Represents a color and a transparency value. Implements lazy conversion between RGB and HSV space.
*/
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
    clone() {
        return new Color(this);
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
        if (this._outdatedRgb)
            this._updateRgb();
        this._r = value;
        this._outdatedHsv = true;
    }
    get r() {
        if (this._outdatedRgb)
            this._updateRgb();
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
        if (this._outdatedRgb)
            this._updateRgb();
        this._g = value;
        this._outdatedHsv = true;
    }
    get g() {
        if (this._outdatedRgb)
            this._updateRgb();
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
        if (this._outdatedRgb)
            this._updateRgb();
        this._b = value;
        this._outdatedHsv = true;
    }
    get b() {
        if (this._outdatedRgb)
            this._updateRgb();
        return this._b;
    }
    _updateRgb() {
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
        if (this._outdatedHsv)
            this._updateHsv();
        this._hue = value;
        this._outdatedRgb = true;
    }
    get hue() {
        if (this._outdatedHsv)
            this._updateHsv();
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
        if (this._outdatedHsv)
            this._updateHsv();
        this._sat = value;
        this._outdatedRgb = true;
    }
    get sat() {
        if (this._outdatedHsv)
            this._updateHsv();
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
        if (this._outdatedHsv)
            this._updateHsv();
        this._val = value;
        this._outdatedRgb = true;
    }
    get val() {
        if (this._outdatedHsv)
            this._updateHsv();
        return this._val;
    }
    _updateHsv() {
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
        return (this.r == other.r
            && this.g == other.g
            && this.b == other.b
            && this.a == other.a);
    }
    isClose(other, e = 1e-6) {
        return (EMath.isClose(this.r, other.r, e)
            && EMath.isClose(this.g, other.g, e)
            && EMath.isClose(this.b, other.b, e)
            && EMath.isClose(this.a, other.a, e));
    }
    strictEqualsRgb(other) {
        return (this.r == other.r
            && this.g == other.g
            && this.b == other.b);
    }
    isCloseRgb(other, e = 1e-6) {
        return (EMath.isClose(this.r, other.r, e)
            && EMath.isClose(this.g, other.g, e)
            && EMath.isClose(this.b, other.b, e));
    }
    lerpRgba(other, t) {
        return this.clone().lerpRgbaSelf(other, t);
    }
    lerpRgbaSelf(other, t) {
        this.r = EMath.lerp(this.r, other.r, t);
        this.g = EMath.lerp(this.g, other.g, t);
        this.b = EMath.lerp(this.b, other.b, t);
        this.a = EMath.lerp(this.a, other.a, t);
        return this;
    }
    lerpHsva(other, t) {
        return this.clone().lerpHsvaSelf(other, t);
    }
    lerpHsvaSelf(other, t) {
        this.hue = EMath.lerp(this.hue, other.hue, t);
        this.sat = EMath.lerp(this.sat, other.sat, t);
        this.val = EMath.lerp(this.val, other.val, t);
        this.a = EMath.lerp(this.a, other.a, t);
        return this;
    }
    getIsForegroundWhite(threshold = 0.42) {
        let { r, g, b } = this;
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
            let tMaxA = vA.dist(vB);
            let tMaxC = vC.dist(vB);
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
            let tMaxA = vA.dist(vB) / 2;
            let tMaxC = vC.dist(vB) / 2;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGliZ2UzX3YyMDI2MDQxNi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpYmdlM192MjAyNjA0MTYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQStCO0FBQy9CLG1DQUFtQztBQUVuQyxxQkFBcUI7QUFDckIsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsRUFBVSxFQUFFLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUU3RSxtQkFBbUI7QUFDbkIsbUJBQW1CO0FBQ25CLG1CQUFtQjtBQUNuQixNQUFNLE9BQWdCLEtBQUs7SUFDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFTLEVBQUMsQ0FBUyxFQUFDLENBQVM7UUFDdEMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQVMsRUFBQyxDQUFTLEVBQUMsQ0FBUztRQUNyQyxPQUFPLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBUyxFQUFDLENBQVM7UUFDM0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLElBQVksSUFBSTtRQUNqRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxD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QUFDO0lBQ0QsSUFBSSxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUNoQyxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUNELFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDcEMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFTO1FBQ1YsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFDRCxRQUFRLENBQUMsQ0FBUztRQUNkLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxJQUFJLENBQUMsS0FBVztRQUNaLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBQ0QsUUFBUSxDQUFDLEtBQVc7UUFDaEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELEtBQUssQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDakMsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFDRCxTQUFTLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQ3JDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxLQUFLLENBQUMsQ0FBUztRQUNYLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBQ0QsU0FBUyxDQUFDLENBQVM7UUFDZixJ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QUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLE1BQU0sR0FBRyxHQUFHLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakUsTUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4RCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDOUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDOUIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDM0IsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBQ0QsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQztRQUMxRCxNQUFNLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQztRQUNsRCxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ3hCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDeEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pELE1BQU0sRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sSUFBSSxHQUFHLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvRCxNQUFNLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RSxNQUFNLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RSxNQUFNLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RSxNQUFNLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RSxNQUFNLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RSxNQUFNLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RSxNQUFNLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0QsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDOUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDOUIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDM0IsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBQ0QsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUM7UUFDdkQsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFD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LENBQUMsQ0FBQyxDQUFDO1FBQzNELE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEQsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkgsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkgsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFD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QUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRCxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDekQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNyRCxJQUFJLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxJQUFJLEtBQUssR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzFELElBQUksS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDdEQsSUFBRyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQztRQUNqRCxJQUFHLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQztZQUNk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QyxVQUFVLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDdEQsS0FBSyxPQUFPO2dCQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDdEQsS0FBSyxPQUFPO2dCQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDdEQsS0FBSyxNQUFNO2dCQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDckQsS0FBSyxPQUFPO2dCQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDdkQsS0FBSyxPQUFPO2dCQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDdkQsS0FBSyxPQUFPO2dCQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDdkQsS0FBSyxNQUFNO2dCQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDbEUsS0FBSyxNQUFNO2dCQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDbEUsS0FBSyxNQUFNO2dCQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDbEUsT0FBTyxDQUFDLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkUsQ0FBQztJQUNMLENBQUM7SUFDRCxXQUFXLENBQUMs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RyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU87Z0JBQzNHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUTtnQkFDMUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU07Z0JBQzFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxHQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUztnQkFDM0ksR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsV0FBVztnQkFDL0UsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLFlBQVk7Z0JBQzlHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxjQUFjO2dCQUNoSCxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxHQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEdBQUMsQ0FBQyxFQUFF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O0lBRUQsVUFBVTtRQUNOLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0MsTUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUN4QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixJQUFHLEtBQUssS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUNiLElBQUcsR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUM3RCxJQUFHLEdBQUcsS0FBSyxJQUFJLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7O2dCQUM1RCxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUNELElBQUcsQ0FBQyxHQUFHLENBQUM7WUFBRSxDQUFDLElBQUksR0FBRyxDQUFDO1FBQ25CLE1BQU0sQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFDLEdBQUcsR0FBQyxHQUFHLENB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QUM7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDbEQsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBQyxDQUFDLENBQUM7UUFDbkIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBQyxDQUFDLENBQUM7UUFDbkIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBQyxDQUFDLENBQUM7UUFDbkIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBQyxDQUFDLENBQUM7UUFDbkIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUMsRUFBRSxFQUFFLEVBQUUsRUFBQyxFQUFFLEVBQUUsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsTUFBYyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDO1FBQ3hGLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2QyxJQUFJLFNBQVMsR0FBYSxFQUFFLENBQUM7UUFDN0IsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLEdBQUcsRUFBRSxDQUFDLElBQUUsSUFBSSxFQUFFLENBQUM7WUFDMUIsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDN0QsQ0FBQztRQUNELFNBQVMsQ0FBQyxJ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QUN6RSxDQUFDO0lBQ0QsSUFBSSxLQUFLLEtBQUssT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNuQyxXQUFXLENBQVM7SUFDcEIsSUFBSSxVQUFVLENBQUMsS0FBWTtRQUN2QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVTtZQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN6RSxDQUFDO0lBQ0QsSUFBSSxVQUFVLEtBQUssT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUU3QyxNQUFNO1FBQ0YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDMUUsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiLy8gM0QvMkQgSlMgR2FtZSBFbmdpbmUgTGlicmFyeVxyXG4vLyBodHRwczovL2dpdGh1Yi5jb20vc2xsZW5kZXJicmluZVxyXG5cclxuLy8gIERFTEFZIFVUSUxJVFkgIC8vXHJcbmV4cG9ydCBjb25zdCBkZWxheSA9IChtczogbnVtYmVyKSA9PiBuZXcgUHJvbWlzZShyZXMgPT4gc2V0VGltZW91dChyZXMsIG1zKSk7XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBFTUFUSCBDTEFTUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRU1hdGgge1xyXG4gICAgc3RhdGljIGNsYW1wKG46IG51bWJlcixhOiBudW1iZXIsYjogbnVtYmVyKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KG4sYSksYik7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgbGVycChhOiBudW1iZXIsYjogbnVtYmVyLHQ6IG51bWJlcikgOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBhKyhiLWEpKnQ7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcG1vZCh4OiBudW1iZXIsYTogbnVtYmVyKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICgoeCVhKSthKSVhO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGlzQ2xvc2UoYTogbnVtYmVyLCBiOiBudW1iZXIsIGU6IG51bWJlciA9IDFlLTYpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hYnMoYS1iKSA8IGU7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgaXNaZXJvKHY6IG51bWJlciwgZTogbnVtYmVyID0gMWUtNikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFicyh2KSA8IGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIFZFQ1RPUiBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBWZWMzIHtcclxuICAgIF94OiBudW1iZXI7XHJcbiAgICBfeTogbnVtYmVyO1xyXG4gICAgX3o6IG51bWJlcjtcclxuICAgIG9uTXV0YXRlPzogKCkgPT4gdm9pZDtcclxuICAgIGNvbnN0cnVjdG9yKHY6IFZlYzMgfCB7eDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcn0sIG9uTXV0YXRlPzogKCkgPT4gdm9pZCk7XHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBvbk11dGF0ZT86ICgpID0+IHZvaWQpO1xyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyIHwgVmVjMyB8IHt4Om51bWJlciwgeTpudW1iZXIsIHo6bnVtYmVyfSwgeT86IG51bWJlciB8ICgoaW5kZXg6IG51bWJlcikgPT4gdm9pZCksIHo/OiBudW1iZXIsIG9uTXV0YXRlPzogKCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGlmKHR5cGVvZiB4ID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ggPSB4Lng7XHJcbiAgICAgICAgICAgIHRoaXMuX3kgPSB4Lnk7XHJcbiAgICAgICAgICAgIHRoaXMuX3ogPSB4Lno7XHJcbiAgICAgICAgICAgIHRoaXMub25NdXRhdGUgPSB5IGFzICgoKSA9PiB2b2lkKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl94ID0geDtcclxuICAgICAgICAgICAgdGhpcy5feSA9IHkhIGFzIG51bWJlcjtcclxuICAgICAgICAgICAgdGhpcy5feiA9IHohO1xyXG4gICAgICAgICAgICB0aGlzLm9uTXV0YXRlID0gb25NdXRhdGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG11dGF0ZSgpIHtcclxuICAgICAgICBpZih0aGlzLm9uTXV0YXRlKVxyXG4gICAgICAgICAgICB0aGlzLm9uTXV0YXRlKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldCB4KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl94ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgIH1cclxuICAgIGdldCB4KCkgeyByZXR1cm4gdGhpcy5feDsgfVxyXG4gICAgc2V0IHkodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3kgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IHkoKSB7IHJldHVybiB0aGlzLl95OyB9XHJcbiAgICBzZXQgeih2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5feiA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgeigpIHsgcmV0dXJuIHRoaXMuX3o7IH1cclxuXHJcbiAgICAvLyBTdGF0aWMgQ29uc3RydWN0b3JzXHJcbiAgICBzdGF0aWMgZmlsbChuOiBudW1iZXIpOiBWZWMzIHsgcmV0dXJuIG5ldyBWZWMzKG4sIG4sIG4pOyB9XHJcbiAgICBzdGF0aWMgemVybygpOiBWZWMzIHsgcmV0dXJuIFZlYzMuZmlsbCgwKTsgfVxyXG4gICAgc3RhdGljIG9uZSgpOiBWZWMzIHsgcmV0dXJuIFZlYzMuZmlsbCgxKTsgfVxyXG4gICAgc3RhdGljIHhBeGlzKCk6IFZlYzMgeyByZXR1cm4gbmV3IFZlYzMoMSwgMCwgMCk7IH1cclxuICAgIHN0YXRpYyB5QXhpcygpOiBWZWMzIHsgcmV0dXJuIG5ldyBWZWMzKDAsIDEsIDApOyB9XHJcbiAgICBzdGF0aWMgekF4aXMoKTogVmVjMyB7IHJldHVybiBuZXcgVmVjMygwLCAwLCAxKTsgfVxyXG4gICAgc3RhdGljIHJhbmRvbSgpOiBWZWMzIHtcclxuICAgICAgICBjb25zdCB6ID0gTWF0aC5yYW5kb20oKSAqIDIgLSAxO1xyXG4gICAgICAgIGNvbnN0IGEgPSBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XHJcbiAgICAgICAgY29uc3QgYiA9IE1hdGguc3FydChNYXRoLm1heCgwLCAxIC0geiAqIHopKTtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoYiAqIE1hdGguY29zKGEpLCBiICogTWF0aC5zaW4oYSksIHopO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJhbmRvbVJvdGF0aW9uKCk6IFZlYzMge1xyXG4gICAgICAgIGNvbnN0IHYgPSBWZWMzLnJhbmRvbSgpO1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh2LnBpdGNoKCksIHYueWF3KCksIE1hdGgucmFuZG9tKCkgKiAyICogTWF0aC5QSSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTWlzY2VsbGFuZW91c1xyXG4gICAgZ2V0KGk6IG51bWJlcik6IG51bWJlciB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgc3dpdGNoKGkpIHtcclxuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gdGhpcy5feDtcclxuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gdGhpcy5feTtcclxuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gdGhpcy5fejtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIHNldChpOiBudW1iZXIsIHY6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHN3aXRjaChpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDogdGhpcy5feCA9IHY7IHRoaXMubXV0YXRlKCk7IHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSAxOiB0aGlzLl95ID0gdjsgdGhpcy5tdXRhdGUoKTsgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIDI6IHRoaXMuX3ogPSB2OyB0aGlzLm11dGF0ZSgpOyByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2V0Qyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCA9IHg7XHJcbiAgICAgICAgdGhpcy5feSA9IHk7XHJcbiAgICAgICAgdGhpcy5feiA9IHo7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcclxuICAgICAgICB5aWVsZCB0aGlzLl94O1xyXG4gICAgICAgIHlpZWxkIHRoaXMuX3k7XHJcbiAgICAgICAgeWllbGQgdGhpcy5fejtcclxuICAgIH1cclxuICAgIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGA8JHt0aGlzLl94LnRvRml4ZWQoMil9LCAke3RoaXMuX3kudG9GaXhlZCgyKX0sICR7dGhpcy5fei50b0ZpeGVkKDIpfT5gO1xyXG4gICAgfVxyXG4gICAgdG9BcnJheSgpOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy5feCwgdGhpcy5feSwgdGhpcy5fel07XHJcbiAgICB9XHJcbiAgICBjbG9uZSgpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcyk7XHJcbiAgICB9XHJcbiAgICBnZXRQcmltYXJ5QXhpcygpOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGF4ID0gTWF0aC5hYnModGhpcy5feCk7XHJcbiAgICAgICAgY29uc3QgYXkgPSBNYXRoLmFicyh0aGlzLl95KTtcclxuICAgICAgICBjb25zdCBheiA9IE1hdGguYWJzKHRoaXMuX3opO1xyXG4gICAgICAgIGlmKGF4ID4gYXkpIHJldHVybiBheCA+IGF6ID8gMCA6IDI7XHJcbiAgICAgICAgZWxzZSByZXR1cm4gYXkgPiBheiA/IDEgOiAyO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENhbGN1bGF0aW9uc1xyXG4gICAgbGVuZ3RoKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLmRvdCh0aGlzKSk7XHJcbiAgICB9XHJcbiAgICBkb3Qob3RoZXI6IFZlYzMpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl94ICogb3RoZXIuX3ggKyB0aGlzLl95ICogb3RoZXIuX3kgKyB0aGlzLl96ICogb3RoZXIuX3o7XHJcbiAgICB9XHJcbiAgICBkb3RDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl94ICogeCArIHRoaXMuX3kgKiB5ICsgdGhpcy5feiAqIHo7XHJcbiAgICB9XHJcbiAgICBjcm9zcyhvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl95ICogb3RoZXIuX3ogLSB0aGlzLl96ICogb3RoZXIuX3ksIC0gKHRoaXMuX3ggKiBvdGhlci5feiAtIHRoaXMuX3ogKiBvdGhlci5feCksIHRoaXMuX3ggKiBvdGhlci5feSAtIHRoaXMuX3kgKiBvdGhlci5feCk7XHJcbiAgICB9XHJcbiAgICBjcm9zc0MoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl95ICogeiAtIHRoaXMuX3ogKiB5LCAtICh0aGlzLl94ICogeiAtIHRoaXMuX3ogKiB4KSwgdGhpcy5feCAqIHkgLSB0aGlzLl95ICogeCk7XHJcbiAgICB9XHJcbiAgICBhbmdsZShvdGhlcjogVmVjMyk6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgYyA9IHRoaXMubGVuZ3RoKCkgKiBvdGhlci5sZW5ndGgoKTtcclxuICAgICAgICBpZihjID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICByZXR1cm4gTWF0aC5hY29zKEVNYXRoLmNsYW1wKHRoaXMuZG90KG90aGVyKSAvIGMsIC0xLCAxKSk7XHJcbiAgICB9XHJcbiAgICBzaWduZWRBbmdsZShvdGhlcjogVmVjMywgcmVmZXJlbmNlOiBWZWMzID0gVmVjMy55QXhpcygpKTogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBhbmdsZSA9IHRoaXMuYW5nbGUob3RoZXIpO1xyXG4gICAgICAgIGNvbnN0IG5vcm1hbCA9IHRoaXMuY3Jvc3Mob3RoZXIpLm5vcm1TZWxmKCk7XHJcbiAgICAgICAgaWYobm9ybWFsLmRvdChyZWZlcmVuY2Uubm9ybSgpKSA+IDApXHJcbiAgICAgICAgICAgIHJldHVybiAtYW5nbGU7XHJcbiAgICAgICAgcmV0dXJuIGFuZ2xlO1xyXG4gICAgfVxyXG4gICAgZGlzdChvdGhlcjogVmVjMyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViKG90aGVyKS5sZW5ndGgoKTtcclxuICAgIH1cclxuICAgIGRpc3RDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN1YkMoeCwgeSwgeikubGVuZ3RoKCk7XHJcbiAgICB9XHJcbiAgICBzdHJpY3RFcXVhbHMob3RoZXI6IFZlYzMpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5feCA9PSBvdGhlci5feCAmJiB0aGlzLl95ID09IG90aGVyLl95ICYmIHRoaXMuX3ogPT0gb3RoZXIuX3o7XHJcbiAgICB9XHJcbiAgICBpc0Nsb3NlKG90aGVyOiBWZWMzLCBlID0gMWUtNik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5pc0Nsb3NlKHRoaXMuX3gsIG90aGVyLl94LCBlKSAmJiBFTWF0aC5pc0Nsb3NlKHRoaXMuX3ksIG90aGVyLl95LCBlKSAmJiBFTWF0aC5pc0Nsb3NlKHRoaXMuX3osIG90aGVyLl96LCBlKTtcclxuICAgIH1cclxuICAgIGlzWmVybyhlID0gMWUtNik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5pc1plcm8odGhpcy5feCwgZSkgJiYgRU1hdGguaXNaZXJvKHRoaXMuX3ksIGUpICYmIEVNYXRoLmlzWmVybyh0aGlzLl96LCBlKTtcclxuICAgIH1cclxuICAgIHBpdGNoKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYXNpbih0aGlzLl95KTtcclxuICAgIH1cclxuICAgIHlhdygpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKC10aGlzLl94LCAtdGhpcy5feik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gT3BlcmF0aW9uc1xyXG4gICAgYWRkKG90aGVyOiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggKyBvdGhlci5feCwgdGhpcy5feSArIG90aGVyLl95LCB0aGlzLl96ICsgb3RoZXIuX3opO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZihvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0gb3RoZXIuX3g7XHJcbiAgICAgICAgdGhpcy5feSArPSBvdGhlci5feTtcclxuICAgICAgICB0aGlzLl96ICs9IG90aGVyLl96O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feCArIHgsIHRoaXMuX3kgKyB5LCB0aGlzLl96ICsgeik7XHJcbiAgICB9XHJcbiAgICBhZGRTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCArPSB4O1xyXG4gICAgICAgIHRoaXMuX3kgKz0geTtcclxuICAgICAgICB0aGlzLl96ICs9IHo7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZEYobjogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggKyBuLCB0aGlzLl95ICsgbiwgdGhpcy5feiArIG4pO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCArPSBuO1xyXG4gICAgICAgIHRoaXMuX3kgKz0gbjtcclxuICAgICAgICB0aGlzLl96ICs9IG47XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZChvdGhlcjogVmVjMywgczogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5hZGRTY2FsZWRTZWxmKG90aGVyLCBzKTtcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZFNlbGYob3RoZXI6IFZlYzMsIHM6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0gb3RoZXIuX3ggKiBzO1xyXG4gICAgICAgIHRoaXMuX3kgKz0gb3RoZXIuX3kgKiBzO1xyXG4gICAgICAgIHRoaXMuX3ogKz0gb3RoZXIuX3ogKiBzO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWRDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHM6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuYWRkU2NhbGVkU2VsZkMoeCwgeSwgeiwgcyk7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWRTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBzOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICs9IHggKiBzO1xyXG4gICAgICAgIHRoaXMuX3kgKz0geSAqIHM7XHJcbiAgICAgICAgdGhpcy5feiArPSB6ICogcztcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3ViKG90aGVyOiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggLSBvdGhlci5feCwgdGhpcy5feSAtIG90aGVyLl95LCB0aGlzLl96IC0gb3RoZXIuX3opO1xyXG4gICAgfVxyXG4gICAgc3ViU2VsZihvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggLT0gb3RoZXIuX3g7XHJcbiAgICAgICAgdGhpcy5feSAtPSBvdGhlci5feTtcclxuICAgICAgICB0aGlzLl96IC09IG90aGVyLl96O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWJDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feCAtIHgsIHRoaXMuX3kgLSB5LCB0aGlzLl96IC0geik7XHJcbiAgICB9XHJcbiAgICBzdWJTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAtPSB4O1xyXG4gICAgICAgIHRoaXMuX3kgLT0geTtcclxuICAgICAgICB0aGlzLl96IC09IHo7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN1YkYobjogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggLSBuLCB0aGlzLl95IC0gbiwgdGhpcy5feiAtIG4pO1xyXG4gICAgfVxyXG4gICAgc3ViU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAtPSBuO1xyXG4gICAgICAgIHRoaXMuX3kgLT0gbjtcclxuICAgICAgICB0aGlzLl96IC09IG47XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJzdWIob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMob3RoZXIuX3ggLSB0aGlzLl94LCBvdGhlci5feSAtIHRoaXMuX3ksIG90aGVyLl96IC0gdGhpcy5feik7XHJcbiAgICB9XHJcbiAgICByc3ViU2VsZihvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSBvdGhlci5feCAtIHRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IG90aGVyLl95IC0gdGhpcy5feTtcclxuICAgICAgICB0aGlzLl96ID0gb3RoZXIuX3ogLSB0aGlzLl96O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByc3ViQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHggLSB0aGlzLl94LCB5IC0gdGhpcy5feSwgeiAtIHRoaXMuX3opO1xyXG4gICAgfVxyXG4gICAgcnN1YlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0geCAtIHRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IHkgLSB0aGlzLl95O1xyXG4gICAgICAgIHRoaXMuX3ogPSB6IC0gdGhpcy5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcnN1YkYobjogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKG4gLSB0aGlzLl94LCBuIC0gdGhpcy5feSwgbiAtIHRoaXMuX3opO1xyXG4gICAgfVxyXG4gICAgcnN1YlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSBuIC0gdGhpcy5feDtcclxuICAgICAgICB0aGlzLl95ID0gbiAtIHRoaXMuX3k7XHJcbiAgICAgICAgdGhpcy5feiA9IG4gLSB0aGlzLl96O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBtdWwob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feCAqIG90aGVyLl94LCB0aGlzLl95ICogb3RoZXIuX3ksIHRoaXMuX3ogKiBvdGhlci5feik7XHJcbiAgICB9XHJcbiAgICBtdWxTZWxmKG90aGVyOiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAqPSBvdGhlci5feDtcclxuICAgICAgICB0aGlzLl95ICo9IG90aGVyLl95O1xyXG4gICAgICAgIHRoaXMuX3ogKj0gb3RoZXIuX3o7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG11bEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLl94ICogeCwgdGhpcy5feSAqIHksIHRoaXMuX3ogKiB6KTtcclxuICAgIH1cclxuICAgIG11bFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICo9IHg7XHJcbiAgICAgICAgdGhpcy5feSAqPSB5O1xyXG4gICAgICAgIHRoaXMuX3ogKj0gejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbXVsRihuOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feCAqIG4sIHRoaXMuX3kgKiBuLCB0aGlzLl96ICogbik7XHJcbiAgICB9XHJcbiAgICBtdWxTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ICo9IG47XHJcbiAgICAgICAgdGhpcy5feSAqPSBuO1xyXG4gICAgICAgIHRoaXMuX3ogKj0gbjtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZGl2KG90aGVyOiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggLyBvdGhlci5feCwgdGhpcy5feSAvIG90aGVyLl95LCB0aGlzLl96IC8gb3RoZXIuX3opO1xyXG4gICAgfVxyXG4gICAgZGl2U2VsZihvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggLz0gb3RoZXIuX3g7XHJcbiAgICAgICAgdGhpcy5feSAvPSBvdGhlci5feTtcclxuICAgICAgICB0aGlzLl96IC89IG90aGVyLl96O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBkaXZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy5feCAvIHgsIHRoaXMuX3kgLyB5LCB0aGlzLl96IC8geik7XHJcbiAgICB9XHJcbiAgICBkaXZTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAvPSB4O1xyXG4gICAgICAgIHRoaXMuX3kgLz0geTtcclxuICAgICAgICB0aGlzLl96IC89IHo7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGRpdkYobjogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMuX3ggLyBuLCB0aGlzLl95IC8gbiwgdGhpcy5feiAvIG4pO1xyXG4gICAgfVxyXG4gICAgZGl2U2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCAvPSBuO1xyXG4gICAgICAgIHRoaXMuX3kgLz0gbjtcclxuICAgICAgICB0aGlzLl96IC89IG47XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJkaXYob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMob3RoZXIuX3ggLyB0aGlzLl94LCBvdGhlci5feSAvIHRoaXMuX3ksIG90aGVyLl96IC8gdGhpcy5feik7XHJcbiAgICB9XHJcbiAgICByZGl2U2VsZihvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSBvdGhlci5feCAvIHRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IG90aGVyLl95IC8gdGhpcy5feTtcclxuICAgICAgICB0aGlzLl96ID0gb3RoZXIuX3ogLyB0aGlzLl96O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByZGl2Qyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHggLyB0aGlzLl94LCB5IC8gdGhpcy5feSwgeiAvIHRoaXMuX3opO1xyXG4gICAgfVxyXG4gICAgcmRpdlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0geCAvIHRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IHkgLyB0aGlzLl95O1xyXG4gICAgICAgIHRoaXMuX3ogPSB6IC8gdGhpcy5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmRpdkYobjogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKG4gLyB0aGlzLl94LCBuIC8gdGhpcy5feSwgbiAvIHRoaXMuX3opO1xyXG4gICAgfVxyXG4gICAgcmRpdlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggPSBuIC8gdGhpcy5feDtcclxuICAgICAgICB0aGlzLl95ID0gbiAvIHRoaXMuX3k7XHJcbiAgICAgICAgdGhpcy5feiA9IG4gLyB0aGlzLl96O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBuZWcoKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKC10aGlzLl94LCAtdGhpcy5feSwgLXRoaXMuX3opO1xyXG4gICAgfVxyXG4gICAgbmVnU2VsZigpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gLXRoaXMuX3g7XHJcbiAgICAgICAgdGhpcy5feSA9IC10aGlzLl95O1xyXG4gICAgICAgIHRoaXMuX3ogPSAtdGhpcy5fejtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbGVycChvdGhlcjogVmVjMywgdDogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sZXJwU2VsZihvdGhlciwgdCk7XHJcbiAgICB9XHJcbiAgICBsZXJwU2VsZihvdGhlcjogVmVjMywgdDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feCArPSAob3RoZXIuX3ggLSB0aGlzLl94KSAqIHQ7XHJcbiAgICAgICAgdGhpcy5feSArPSAob3RoZXIuX3kgLSB0aGlzLl95KSAqIHQ7XHJcbiAgICAgICAgdGhpcy5feiArPSAob3RoZXIuX3ogLSB0aGlzLl96KSAqIHQ7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGxlcnBDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHQ6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubGVycFNlbGZDKHgsIHksIHosIHQpO1xyXG4gICAgfVxyXG4gICAgbGVycFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3ggKz0gKHggLSB0aGlzLl94KSAqIHQ7XHJcbiAgICAgICAgdGhpcy5feSArPSAoeSAtIHRoaXMuX3kpICogdDtcclxuICAgICAgICB0aGlzLl96ICs9ICh6IC0gdGhpcy5feikgKiB0O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBub3JtKCk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubm9ybVNlbGYoKTtcclxuICAgIH1cclxuICAgIG5vcm1TZWxmKCk6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IG1hZyA9IHRoaXMubGVuZ3RoKCk7XHJcbiAgICAgICAgaWYobWFnID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICByZXR1cm4gdGhpcy5kaXZTZWxmQyhtYWcsIG1hZywgbWFnKTtcclxuICAgIH1cclxuICAgIHJlc2NhbGUobWFnOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJlc2NhbGVTZWxmKG1hZyk7XHJcbiAgICB9XHJcbiAgICByZXNjYWxlU2VsZihtYWc6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1TZWxmKCkubXVsU2VsZkMobWFnLCBtYWcsIG1hZyk7XHJcbiAgICB9XHJcbiAgICBsb29rKG90aGVyOiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sb29rU2VsZihvdGhlcik7XHJcbiAgICB9XHJcbiAgICBsb29rU2VsZihvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJzdWJTZWxmKG90aGVyKS5ub3JtU2VsZigpO1xyXG4gICAgfVxyXG4gICAgY2xhbXBMZW5ndGgoYTogbnVtYmVyLCBiOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmNsYW1wTGVuZ3RoU2VsZihhLCBiKTtcclxuICAgIH1cclxuICAgIGNsYW1wTGVuZ3RoU2VsZihhOiBudW1iZXIsIGI6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc2NhbGVTZWxmKEVNYXRoLmNsYW1wKHRoaXMubGVuZ3RoKCksIGEsIGIpKTtcclxuICAgIH1cclxuICAgIGZsYXQoKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5mbGF0U2VsZigpO1xyXG4gICAgfVxyXG4gICAgZmxhdFNlbGYoKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5feSA9IDA7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGZsYXROb3JtKCk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuZmxhdE5vcm1TZWxmKCk7XHJcbiAgICB9XHJcbiAgICBmbGF0Tm9ybVNlbGYoKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmxhdFNlbGYoKS5ub3JtU2VsZigpO1xyXG4gICAgfVxyXG4gICAgc2V0RG90KG90aGVyOiBWZWMzLCB0YXJnZXQ6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuc2V0RG90U2VsZihvdGhlciwgdGFyZ2V0KTtcclxuICAgIH1cclxuICAgIHNldERvdFNlbGYob3RoZXI6IFZlYzMsIHRhcmdldDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgZCA9IG90aGVyLmRvdChvdGhlcik7XHJcbiAgICAgICAgaWYoZCA9PT0gMCkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkU2NhbGVkU2VsZihvdGhlciwgKHRhcmdldCAtIHRoaXMuZG90KG90aGVyKSkgLyBkKTtcclxuICAgIH1cclxuICAgIHNldERvdEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdGFyZ2V0OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnNldERvdFNlbGZDKHgsIHksIHosIHRhcmdldCk7XHJcbiAgICB9XHJcbiAgICBzZXREb3RTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IGQgPSB4KnggKyB5KnkgKyB6Kno7XHJcbiAgICAgICAgaWYoZCA9PT0gMCkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkU2NhbGVkU2VsZkMoeCwgeSwgeiwgKHRhcmdldCAtIHRoaXMuZG90Qyh4LCB5LCB6KSkgLyBkKTtcclxuICAgIH1cclxuICAgIG1hcChtZXRob2Q6ICh4OiBudW1iZXIsIGk6IG51bWJlcikgPT4gbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5tYXBTZWxmKG1ldGhvZCk7XHJcbiAgICB9XHJcbiAgICBtYXBTZWxmKG1ldGhvZDogKHg6IG51bWJlciwgaTogbnVtYmVyKSA9PiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl94ID0gbWV0aG9kKHRoaXMuX3gsIDApO1xyXG4gICAgICAgIHRoaXMuX3kgPSBtZXRob2QodGhpcy5feSwgMSk7XHJcbiAgICAgICAgdGhpcy5feiA9IG1ldGhvZCh0aGlzLl96LCAyKTtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm90WChhOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdFhTZWxmKGEpO1xyXG4gICAgfVxyXG4gICAgcm90WFNlbGYoYTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGEpLCBjID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3QgeSA9IHRoaXMuX3kgKiBjIC0gdGhpcy5feiAqIHM7XHJcbiAgICAgICAgdGhpcy5feiA9IHRoaXMuX3kgKiBzICsgdGhpcy5feiAqIGM7XHJcbiAgICAgICAgdGhpcy5feSA9IHk7XHJcbiAgICAgICAgdGhpcy5tdXRhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdFkoYTogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RZU2VsZihhKTtcclxuICAgIH1cclxuICAgIHJvdFlTZWxmKGE6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhKSwgYyA9IE1hdGguY29zKGEpO1xyXG4gICAgICAgIGNvbnN0IHogPSB0aGlzLl96ICogYyAtIHRoaXMuX3ggKiBzO1xyXG4gICAgICAgIHRoaXMuX3ggPSB0aGlzLl94ICogYyArIHRoaXMuX3ogKiBzO1xyXG4gICAgICAgIHRoaXMuX3ogPSB6O1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByb3RaKGE6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90WlNlbGYoYSk7XHJcbiAgICB9XHJcbiAgICByb3RaU2VsZihhOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSksIGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCB4ID0gdGhpcy5feCAqIGMgLSB0aGlzLl95ICogcztcclxuICAgICAgICB0aGlzLl95ID0gdGhpcy5feCAqIHMgKyB0aGlzLl95ICogYztcclxuICAgICAgICB0aGlzLl94ID0geDtcclxuICAgICAgICB0aGlzLm11dGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm90QXhpcyhheGlzOiBWZWMzLCBhbmdsZTogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RBeGlzU2VsZihheGlzLCBhbmdsZSk7XHJcbiAgICB9XHJcbiAgICByb3RBeGlzU2VsZihheGlzOiBWZWMzLCBhbmdsZTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgYXhpcyA9IGF4aXMubm9ybSgpO1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZSksIGMgPSBNYXRoLmNvcyhhbmdsZSk7XHJcbiAgICAgICAgY29uc3QgY3Jvc3MgPSBheGlzLmNyb3NzKHRoaXMpO1xyXG4gICAgICAgIGNvbnN0IGRvdCA9IGF4aXMuZG90KHRoaXMpO1xyXG4gICAgICAgIGxldCB4ID0gdGhpcy5feCwgeSA9IHRoaXMuX3ksIHogPSB0aGlzLl96O1xyXG4gICAgICAgIHRoaXMuX3ggPSB4ICogYyArIGNyb3NzLl94ICogcyArIGF4aXMuX3ggKiBkb3QgKiAoMSAtIGMpO1xyXG4gICAgICAgIHRoaXMuX3kgPSB5ICogYyArIGNyb3NzLl95ICogcyArIGF4aXMuX3kgKiBkb3QgKiAoMSAtIGMpO1xyXG4gICAgICAgIHRoaXMuX3ogPSB6ICogYyArIGNyb3NzLl96ICogcyArIGF4aXMuX3ogKiBkb3QgKiAoMSAtIGMpO1xyXG4gICAgICAgIHRoaXMubXV0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByb3RYWVoocm90OiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RYWVpTZWxmKHJvdCk7XHJcbiAgICB9XHJcbiAgICByb3RYWVpTZWxmKHJvdDogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvdFhTZWxmKHJvdC5feCkucm90WVNlbGYocm90Ll95KS5yb3RaU2VsZihyb3QuX3opO1xyXG4gICAgfVxyXG4gICAgcm90WFlaQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RYWVpTZWxmQyh4LCB5LCB6KTtcclxuICAgIH1cclxuICAgIHJvdFhZWlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3RYU2VsZih4KS5yb3RZU2VsZih5KS5yb3RaU2VsZih6KTtcclxuICAgIH1cclxuICAgIHJvdFpZWChyb3Q6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdFpZWFNlbGYocm90KTtcclxuICAgIH1cclxuICAgIHJvdFpZWFNlbGYocm90OiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90WlNlbGYocm90Ll96KS5yb3RZU2VsZihyb3QuX3kpLnJvdFhTZWxmKHJvdC5feCk7XHJcbiAgICB9XHJcbiAgICByb3RaWVhDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdFpZWFNlbGZDKHgsIHksIHopO1xyXG4gICAgfVxyXG4gICAgcm90WllYU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvdFpTZWxmKHopLnJvdFlTZWxmKHkpLnJvdFhTZWxmKHgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVmVjMiB7XHJcbiAgICB4OiBudW1iZXI7XHJcbiAgICB5OiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3Rvcih2OiBWZWMyIHwge3g6IG51bWJlciwgeTogbnVtYmVyfSk7XHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcik7XHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIgfCB7eDpudW1iZXIsIHk6bnVtYmVyfSwgeT86IG51bWJlcikge1xyXG4gICAgICAgIGlmKHR5cGVvZiB4ID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHgueDtcclxuICAgICAgICAgICAgdGhpcy55ID0geC55O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHkhO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBTdGF0aWMgQ29uc3RydWN0b3JzXHJcbiAgICBzdGF0aWMgZmlsbChuOiBudW1iZXIpOiBWZWMyIHsgcmV0dXJuIG5ldyBWZWMyKG4sIG4pOyB9XHJcbiAgICBzdGF0aWMgemVybygpOiBWZWMyIHsgcmV0dXJuIFZlYzIuZmlsbCgwKTsgfVxyXG4gICAgc3RhdGljIG9uZSgpOiBWZWMyIHsgcmV0dXJuIFZlYzIuZmlsbCgxKTsgfVxyXG4gICAgc3RhdGljIHhBeGlzKCk6IFZlYzIgeyByZXR1cm4gbmV3IFZlYzIoMSwgMCk7IH1cclxuICAgIHN0YXRpYyB5QXhpcygpOiBWZWMyIHsgcmV0dXJuIG5ldyBWZWMyKDAsIDEpOyB9XHJcbiAgICBzdGF0aWMgcmFuZG9tKCk6IFZlYzIge1xyXG4gICAgICAgIGNvbnN0IGEgPSBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKE1hdGguY29zKGEpLCBNYXRoLnNpbihhKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTWlzY2VsbGFuZW91c1xyXG4gICAgZ2V0KGk6IG51bWJlcik6IG51bWJlciB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgc3dpdGNoKGkpIHtcclxuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gdGhpcy54O1xyXG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiB0aGlzLnk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBzZXQoaTogbnVtYmVyLCB2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBzd2l0Y2goaSkge1xyXG4gICAgICAgICAgICBjYXNlIDA6IHRoaXMueCA9IHY7IHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSAxOiB0aGlzLnkgPSB2OyByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2V0Qyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcclxuICAgICAgICB5aWVsZCB0aGlzLng7XHJcbiAgICAgICAgeWllbGQgdGhpcy55O1xyXG4gICAgfVxyXG4gICAgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gYDwke3RoaXMueC50b0ZpeGVkKDIpfSwgJHt0aGlzLnkudG9GaXhlZCgyKX0+YDtcclxuICAgIH1cclxuICAgIHRvQXJyYXkoKTogW251bWJlciwgbnVtYmVyXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLngsIHRoaXMueV07XHJcbiAgICB9XHJcbiAgICBjbG9uZSgpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRpb25zXHJcbiAgICBsZW5ndGgoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMuZG90KHRoaXMpKTtcclxuICAgIH1cclxuICAgIGRvdChvdGhlcjogVmVjMik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIG90aGVyLnggKyB0aGlzLnkgKiBvdGhlci55O1xyXG4gICAgfVxyXG4gICAgZG90Qyh4OiBudW1iZXIsIHk6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHggKyB0aGlzLnkgKiB5O1xyXG4gICAgfVxyXG4gICAgYW5nbGUob3RoZXI6IFZlYzIpOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGMgPSB0aGlzLmxlbmd0aCgpICogb3RoZXIubGVuZ3RoKCk7XHJcbiAgICAgICAgaWYoYyA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWNvcyhFTWF0aC5jbGFtcCh0aGlzLmRvdChvdGhlcikgLyBjLCAtMSwgMSkpO1xyXG4gICAgfVxyXG4gICAgc2lnbmVkQW5nbGUob3RoZXI6IFZlYzIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKHRoaXMueCAqIG90aGVyLnkgLSB0aGlzLnkgKiBvdGhlci54LCB0aGlzLmRvdChvdGhlcikpO1xyXG4gICAgfVxyXG4gICAgZGlzdChvdGhlcjogVmVjMik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViKG90aGVyKS5sZW5ndGgoKTtcclxuICAgIH1cclxuICAgIGRpc3RDKHg6IG51bWJlciwgeTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdWJDKHgsIHkpLmxlbmd0aCgpO1xyXG4gICAgfVxyXG4gICAgc3RyaWN0RXF1YWxzKG90aGVyOiBWZWMyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCA9PSBvdGhlci54ICYmIHRoaXMueSA9PSBvdGhlci55O1xyXG4gICAgfVxyXG4gICAgaXNDbG9zZShvdGhlcjogVmVjMiwgZSA9IDFlLTYpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gRU1hdGguaXNDbG9zZSh0aGlzLngsIG90aGVyLngsIGUpICYmIEVNYXRoLmlzQ2xvc2UodGhpcy55LCBvdGhlci55LCBlKTtcclxuICAgIH1cclxuICAgIGlzWmVybyhlID0gMWUtNik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5pc1plcm8odGhpcy54LCBlKSAmJiBFTWF0aC5pc1plcm8odGhpcy55LCBlKTtcclxuICAgIH1cclxuICAgIHRoZXRhKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodGhpcy55LCB0aGlzLngpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE9wZXJhdGlvbnNcclxuICAgIGFkZChvdGhlcjogVmVjMik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggKyBvdGhlci54LCB0aGlzLnkgKyBvdGhlci55KTtcclxuICAgIH1cclxuICAgIGFkZFNlbGYob3RoZXI6IFZlYzIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKz0gb3RoZXIueDtcclxuICAgICAgICB0aGlzLnkgKz0gb3RoZXIueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZEMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy54ICsgeCwgdGhpcy55ICsgeSk7XHJcbiAgICB9XHJcbiAgICBhZGRTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCArPSB4O1xyXG4gICAgICAgIHRoaXMueSArPSB5O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkRihuOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy54ICsgbiwgdGhpcy55ICsgbik7XHJcbiAgICB9XHJcbiAgICBhZGRTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKz0gbjtcclxuICAgICAgICB0aGlzLnkgKz0gbjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZChvdGhlcjogVmVjMiwgczogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5hZGRTY2FsZWRTZWxmKG90aGVyLCBzKTtcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZFNlbGYob3RoZXI6IFZlYzIsIHM6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCArPSBvdGhlci54ICogcztcclxuICAgICAgICB0aGlzLnkgKz0gb3RoZXIueSAqIHM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWRDKHg6IG51bWJlciwgeTogbnVtYmVyLCBzOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmFkZFNjYWxlZFNlbGZDKHgsIHksIHMpO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHM6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCArPSB4ICogcztcclxuICAgICAgICB0aGlzLnkgKz0geSAqIHM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWIob3RoZXI6IFZlYzIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy54IC0gb3RoZXIueCwgdGhpcy55IC0gb3RoZXIueSk7XHJcbiAgICB9XHJcbiAgICBzdWJTZWxmKG90aGVyOiBWZWMyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54IC09IG90aGVyLng7XHJcbiAgICAgICAgdGhpcy55IC09IG90aGVyLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWJDKHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCAtIHgsIHRoaXMueSAtIHkpO1xyXG4gICAgfVxyXG4gICAgc3ViU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggLT0geDtcclxuICAgICAgICB0aGlzLnkgLT0geTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN1YkYobjogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCAtIG4sIHRoaXMueSAtIG4pO1xyXG4gICAgfVxyXG4gICAgc3ViU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54IC09IG47XHJcbiAgICAgICAgdGhpcy55IC09IG47XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByc3ViKG90aGVyOiBWZWMyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKG90aGVyLnggLSB0aGlzLngsIG90aGVyLnkgLSB0aGlzLnkpO1xyXG4gICAgfVxyXG4gICAgcnN1YlNlbGYob3RoZXI6IFZlYzIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSBvdGhlci54IC0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMueSA9IG90aGVyLnkgLSB0aGlzLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByc3ViQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih4IC0gdGhpcy54LCB5IC0gdGhpcy55KTtcclxuICAgIH1cclxuICAgIHJzdWJTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCA9IHggLSB0aGlzLng7XHJcbiAgICAgICAgdGhpcy55ID0geSAtIHRoaXMueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJzdWJGKG46IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMihuIC0gdGhpcy54LCBuIC0gdGhpcy55KTtcclxuICAgIH1cclxuICAgIHJzdWJTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSBuIC0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMueSA9IG4gLSB0aGlzLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBtdWwob3RoZXI6IFZlYzIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy54ICogb3RoZXIueCwgdGhpcy55ICogb3RoZXIueSk7XHJcbiAgICB9XHJcbiAgICBtdWxTZWxmKG90aGVyOiBWZWMyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICo9IG90aGVyLng7XHJcbiAgICAgICAgdGhpcy55ICo9IG90aGVyLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBtdWxDKHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCAqIHgsIHRoaXMueSAqIHkpO1xyXG4gICAgfVxyXG4gICAgbXVsU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKj0geDtcclxuICAgICAgICB0aGlzLnkgKj0geTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG11bEYobjogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCAqIG4sIHRoaXMueSAqIG4pO1xyXG4gICAgfVxyXG4gICAgbXVsU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICo9IG47XHJcbiAgICAgICAgdGhpcy55ICo9IG47XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBkaXYob3RoZXI6IFZlYzIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy54IC8gb3RoZXIueCwgdGhpcy55IC8gb3RoZXIueSk7XHJcbiAgICB9XHJcbiAgICBkaXZTZWxmKG90aGVyOiBWZWMyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54IC89IG90aGVyLng7XHJcbiAgICAgICAgdGhpcy55IC89IG90aGVyLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBkaXZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCAvIHgsIHRoaXMueSAvIHkpO1xyXG4gICAgfVxyXG4gICAgZGl2U2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggLz0geDtcclxuICAgICAgICB0aGlzLnkgLz0geTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGRpdkYobjogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCAvIG4sIHRoaXMueSAvIG4pO1xyXG4gICAgfVxyXG4gICAgZGl2U2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54IC89IG47XHJcbiAgICAgICAgdGhpcy55IC89IG47XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByZGl2KG90aGVyOiBWZWMyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKG90aGVyLnggLyB0aGlzLngsIG90aGVyLnkgLyB0aGlzLnkpO1xyXG4gICAgfVxyXG4gICAgcmRpdlNlbGYob3RoZXI6IFZlYzIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSBvdGhlci54IC8gdGhpcy54O1xyXG4gICAgICAgIHRoaXMueSA9IG90aGVyLnkgLyB0aGlzLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByZGl2Qyh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih4IC8gdGhpcy54LCB5IC8gdGhpcy55KTtcclxuICAgIH1cclxuICAgIHJkaXZTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCA9IHggLyB0aGlzLng7XHJcbiAgICAgICAgdGhpcy55ID0geSAvIHRoaXMueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJkaXZGKG46IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMihuIC8gdGhpcy54LCBuIC8gdGhpcy55KTtcclxuICAgIH1cclxuICAgIHJkaXZTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSBuIC8gdGhpcy54O1xyXG4gICAgICAgIHRoaXMueSA9IG4gLyB0aGlzLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBuZWcoKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKC10aGlzLngsIC10aGlzLnkpO1xyXG4gICAgfVxyXG4gICAgbmVnU2VsZigpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSAtdGhpcy54O1xyXG4gICAgICAgIHRoaXMueSA9IC10aGlzLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBsZXJwKG90aGVyOiBWZWMyLCB0OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxlcnBTZWxmKG90aGVyLCB0KTtcclxuICAgIH1cclxuICAgIGxlcnBTZWxmKG90aGVyOiBWZWMyLCB0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKz0gKG90aGVyLnggLSB0aGlzLngpICogdDtcclxuICAgICAgICB0aGlzLnkgKz0gKG90aGVyLnkgLSB0aGlzLnkpICogdDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGxlcnBDKHg6IG51bWJlciwgeTogbnVtYmVyLCB0OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxlcnBTZWxmQyh4LCB5LCB0KTtcclxuICAgIH1cclxuICAgIGxlcnBTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgdDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICs9ICh4IC0gdGhpcy54KSAqIHQ7XHJcbiAgICAgICAgdGhpcy55ICs9ICh5IC0gdGhpcy55KSAqIHQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBub3JtKCk6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubm9ybVNlbGYoKTtcclxuICAgIH1cclxuICAgIG5vcm1TZWxmKCk6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IG1hZyA9IHRoaXMubGVuZ3RoKCk7XHJcbiAgICAgICAgaWYobWFnID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICByZXR1cm4gdGhpcy5kaXZTZWxmQyhtYWcsIG1hZyk7XHJcbiAgICB9XHJcbiAgICByZXNjYWxlKG1hZzogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yZXNjYWxlU2VsZihtYWcpO1xyXG4gICAgfVxyXG4gICAgcmVzY2FsZVNlbGYobWFnOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ub3JtU2VsZigpLm11bFNlbGZDKG1hZywgbWFnKTtcclxuICAgIH1cclxuICAgIGxvb2sob3RoZXI6IFZlYzIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxvb2tTZWxmKG90aGVyKTtcclxuICAgIH1cclxuICAgIGxvb2tTZWxmKG90aGVyOiBWZWMyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucnN1YlNlbGYob3RoZXIpLm5vcm1TZWxmKCk7XHJcbiAgICB9XHJcbiAgICBjbGFtcExlbmd0aChhOiBudW1iZXIsIGI6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuY2xhbXBMZW5ndGhTZWxmKGEsIGIpO1xyXG4gICAgfVxyXG4gICAgY2xhbXBMZW5ndGhTZWxmKGE6IG51bWJlciwgYjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzY2FsZVNlbGYoRU1hdGguY2xhbXAodGhpcy5sZW5ndGgoKSwgYSwgYikpO1xyXG4gICAgfVxyXG4gICAgc2V0RG90KG90aGVyOiBWZWMyLCB0YXJnZXQ6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuc2V0RG90U2VsZihvdGhlciwgdGFyZ2V0KTtcclxuICAgIH1cclxuICAgIHNldERvdFNlbGYob3RoZXI6IFZlYzIsIHRhcmdldDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgZCA9IG90aGVyLmRvdChvdGhlcik7XHJcbiAgICAgICAgaWYoZCA9PT0gMCkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkU2NhbGVkU2VsZihvdGhlciwgKHRhcmdldCAtIHRoaXMuZG90KG90aGVyKSkgLyBkKTtcclxuICAgIH1cclxuICAgIHNldERvdEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHRhcmdldDogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5zZXREb3RTZWxmQyh4LCB5LCB0YXJnZXQpO1xyXG4gICAgfVxyXG4gICAgc2V0RG90U2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHRhcmdldDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgZCA9IHgqeCArIHkqeTtcclxuICAgICAgICBpZihkID09PSAwKSByZXR1cm4gdGhpcztcclxuICAgICAgICByZXR1cm4gdGhpcy5hZGRTY2FsZWRTZWxmQyh4LCB5LCAodGFyZ2V0IC0gdGhpcy5kb3RDKHgsIHkpKSAvIGQpO1xyXG4gICAgfVxyXG4gICAgbWFwKG1ldGhvZDogKHg6IG51bWJlciwgaTogbnVtYmVyKSA9PiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLm1hcFNlbGYobWV0aG9kKTtcclxuICAgIH1cclxuICAgIG1hcFNlbGYobWV0aG9kOiAoeDogbnVtYmVyLCBpOiBudW1iZXIpID0+IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCA9IG1ldGhvZCh0aGlzLngsIDApO1xyXG4gICAgICAgIHRoaXMueSA9IG1ldGhvZCh0aGlzLnksIDEpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm90YXRlKGE6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90YXRlU2VsZihhKTtcclxuICAgIH1cclxuICAgIHJvdGF0ZVNlbGYoYTogbnVtYmVyKSA6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhKSwgYyA9IE1hdGguY29zKGEpO1xyXG4gICAgICAgIGNvbnN0IHggPSB0aGlzLngsIHkgPSB0aGlzLnk7XHJcbiAgICAgICAgdGhpcy54ID0geCAqIGMgLSB5ICogcztcclxuICAgICAgICB0aGlzLnkgPSB4ICogcyArIHkgKiBjO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgTUFUUklYIENMQVNTRVMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gQ29sdW1uLW1ham9yIDR4NCBtYXRyaXhcclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1hdDQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7fVxyXG4gICAgXHJcbiAgICBzdGF0aWMgbmV3KCkge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIDEsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDEsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDEsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDAsIDEsXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyB0cmFuc2xhdGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIDEsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDEsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDEsIDAsXHJcbiAgICAgICAgICAgIHgsIHksIHosIDEsXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBzY2FsZSh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgeCwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgeSwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMCwgeiwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJvdGF0ZVgoYTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKGEpO1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhKTtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAxLCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCBjLCBzLCAwLFxyXG4gICAgICAgICAgICAwLCAtcywgYywgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcm90YXRlWShhOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGEpO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIGMsIDAsIC1zLCAwLFxyXG4gICAgICAgICAgICAwLCAxLCAwLCAwLFxyXG4gICAgICAgICAgICBzLCAwLCBjLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyByb3RhdGVaKGE6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSk7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgYywgcywgMCwgMCxcclxuICAgICAgICAgICAgLXMsIGMsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDEsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDAsIDFcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHBlcnNwZWN0aXZlKGZvdlk6IG51bWJlciwgYXNwZWN0OiBudW1iZXIsIG5lYXI6IG51bWJlciA9IDEsIGZhcjogbnVtYmVyID0gMTAwMCkge1xyXG4gICAgICAgIGNvbnN0IGYgPSAxIC8gTWF0aC50YW4oZm92WSAvIDIpO1xyXG4gICAgICAgIGNvbnN0IG5mID0gMSAvIChuZWFyIC0gZmFyKTtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBmL2FzcGVjdCwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgZiwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMCwgKGZhciArIG5lYXIpICogbmYsIC0xLFxyXG4gICAgICAgICAgICAwLCAwLCAoMiAqIGZhciAqIG5lYXIpICogbmYsIDBcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIG11bHRpcGx5KG0xOiBudW1iZXJbXSwgbTI6IG51bWJlcltdKSB7XHJcbiAgICAgICAgY29uc3Qgb3V0ID0gTWF0NC5uZXcoKTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTw0OyBpKyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCBqPTA7IGo8NDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRbaSo0ICsgal0gPSAoXHJcbiAgICAgICAgICAgICAgICAgICAgbTFbMCo0ICsgal0hICogbTJbaSo0ICsgMF0hXHJcbiAgICAgICAgICAgICAgICAgICAgKyBtMVsxKjQgKyBqXSEgKiBtMltpKjQgKyAxXSFcclxuICAgICAgICAgICAgICAgICAgICArIG0xWzIqNCArIGpdISAqIG0yW2kqNCArIDJdIVxyXG4gICAgICAgICAgICAgICAgICAgICsgbTFbMyo0ICsgal0hICogbTJbaSo0ICsgM10hXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLyBDb2x1bW4tbWFqb3IgM3gzIG1hdHJpeFxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0MyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gICAgc3RhdGljIG5ldygpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAxLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAxLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAxLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdHJhbnNsYXRlKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgMSwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMSwgMCxcclxuICAgICAgICAgICAgeCwgeSwgMSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHNjYWxlKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgeCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgeSwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJvdGF0ZShhOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGEpO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIGMsIHMsIDAsXHJcbiAgICAgICAgICAgIC1zLCBjLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAxLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgbXVsdGlwbHkobTE6IG51bWJlcltdLCBtMjogbnVtYmVyW10pIHtcclxuICAgICAgICBjb25zdCBvdXQgPSBNYXQzLm5ldygpO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPDM7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDsgajwzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIG91dFtpKjMgKyBqXSA9IChcclxuICAgICAgICAgICAgICAgICAgICBtMVswKjMgKyBqXSEgKiBtMltpKjMgKyAwXSFcclxuICAgICAgICAgICAgICAgICAgICArIG0xWzEqMyArIGpdISAqIG0yW2kqMyArIDFdIVxyXG4gICAgICAgICAgICAgICAgICAgICsgbTFbMiozICsgal0hICogbTJbaSozICsgMl0hXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBOT0lTRSBDTEFTUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5jb25zdCBncmFkaWVudHMyRDogVmVjMltdID0gW107XHJcbmZvcihsZXQgaT0wO2k8MTI7aSsrKSB7XHJcbiAgICBjb25zdCBhbmdsZSA9IDIgKiBNYXRoLlBJICogaS8xMjtcclxuICAgIGdyYWRpZW50czJELnB1c2gobmV3IFZlYzIoTWF0aC5jb3MoYW5nbGUpLCBNYXRoLnNpbihhbmdsZSkpKTtcclxufVxyXG5jb25zdCBncmFkaWVudHMzRDogVmVjM1tdID0gW107XHJcbmZvcihsZXQgaT0wO2k8MTY7aSsrKSB7XHJcbiAgICBjb25zdCB5ID0gMSAtICgyKmkpLygxNSk7XHJcbiAgICBjb25zdCByID0gTWF0aC5zcXJ0KDEteSp5KTtcclxuICAgIGNvbnN0IGFuZ2xlID0gaSAqIE1hdGguUEkgKiAoMy1NYXRoLnNxcnQoNSkpO1xyXG4gICAgZ3JhZGllbnRzM0QucHVzaChuZXcgVmVjMyhcclxuICAgICAgICBNYXRoLmNvcyhhbmdsZSkgKiByLFxyXG4gICAgICAgIHksXHJcbiAgICAgICAgTWF0aC5zaW4oYW5nbGUpICogcixcclxuICAgICkpO1xyXG59XHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOb2lzZSB7XHJcbiAgICBzdGF0aWMgZmFkZSh0OiBudW1iZXIpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdCAqIHQgKiB0ICogKHQgKiAodCAqIDYgLSAxNSkgKyAxMCk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcmFuZG9tQ29uc3RhbnQzKGE6IG51bWJlciwgYjogbnVtYmVyLCBjOiBudW1iZXIpIDogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBpdCA9IChhICogMjM5NDgyMzU0OSkgXiAoYiAqIDQzODU5NzQyODUwKSBeIChjICogMjMwOTQ1NjUyMzQpO1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5wbW9kKGl0LCAxMDAwMCkgLyAxMDAwMDtcclxuICAgIH1cclxuICAgIHN0YXRpYyByYW5kb21Db25zdGFudDQoYTogbnVtYmVyLCBiOiBudW1iZXIsIGM6IG51bWJlciwgZDogbnVtYmVyKSA6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgaXQgPSAoYSAqIDIzOTQ4MjM1NDkpIF4gKGIgKiA0Mzg1OTc0Mjg1MCkgXiAoYyAqIDIzMDk0NTY1MjM0KSBeIChkICogODQyNzgyNDU2Nik7XHJcbiAgICAgICAgcmV0dXJuIEVNYXRoLnBtb2QoaXQsIDEwMDAwKSAvIDEwMDAwO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldFBlcmxpblZlY3RvcjJEKHg6IG51bWJlciwgeTogbnVtYmVyLCBzZWVkID0gMCkgOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gZ3JhZGllbnRzMkRbTWF0aC5mbG9vcihOb2lzZS5yYW5kb21Db25zdGFudDMoc2VlZCwgeCwgeSkgKiBncmFkaWVudHMyRC5sZW5ndGgpXSE7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0UGVybGluVmVjdG9yM0QoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgc2VlZCA9IDApIDogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIGdyYWRpZW50czNEW01hdGguZmxvb3IoTm9pc2UucmFuZG9tQ29uc3RhbnQ0KHNlZWQsIHgsIHksIHopICogZ3JhZGllbnRzM0QubGVuZ3RoKV0hO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldFZvcm9ub2lHcmlkUG9zaXRpb24yRCh4OiBudW1iZXIsIHk6IG51bWJlciwgc2VlZCA9IDAsIHQgPSAxKSA6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMihcclxuICAgICAgICAgICAgeCArIHQgKiBOb2lzZS5yYW5kb21Db25zdGFudDMoeCwgeSwgc2VlZCksXHJcbiAgICAgICAgICAgIHkgKyB0ICogTm9pc2UucmFuZG9tQ29uc3RhbnQzKHgsIHksIHNlZWQrMSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldFZvcm9ub2lHcmlkVmFsdWUyRCh4OiBudW1iZXIsIHk6IG51bWJlciwgc2VlZCA9IDApIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTm9pc2UucmFuZG9tQ29uc3RhbnQzKHgsIHksIHNlZWQrMik7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0Vm9yb25vaUdyaWRQb3NpdGlvbjNEKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHNlZWQgPSAwLCB0ID0gMSkgOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoXHJcbiAgICAgICAgICAgIHggKyB0ICogTm9pc2UucmFuZG9tQ29uc3RhbnQ0KHgsIHksIHosIHNlZWQpLFxyXG4gICAgICAgICAgICB5ICsgdCAqIE5vaXNlLnJhbmRvbUNvbnN0YW50NCh5LCB6LCB4LCBzZWVkKzEpLFxyXG4gICAgICAgICAgICB6ICsgdCAqIE5vaXNlLnJhbmRvbUNvbnN0YW50NCh6LCB4LCB5LCBzZWVkKzIpLFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0Vm9yb25vaUdyaWRWYWx1ZTNEKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHNlZWQgPSAwKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE5vaXNlLnJhbmRvbUNvbnN0YW50NCh4LCB5LCB6LCBzZWVkKzMpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHBlcmxpbk5vaXNlMkQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHNlZWQgPSAwKSA6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgZ2V0UGVybGluVmVjdG9yMkQgPSBOb2lzZS5nZXRQZXJsaW5WZWN0b3IyRDtcclxuICAgICAgICBjb25zdCBsZXJwID0gRU1hdGgubGVycDtcclxuICAgICAgICBjb25zdCBmYWRlID0gTm9pc2UuZmFkZTtcclxuICAgICAgICBjb25zdCBnMCA9IG5ldyBWZWMyKHgsIHkpLm1hcFNlbGYoTWF0aC5mbG9vcik7XHJcbiAgICAgICAgY29uc3QgZzEgPSBuZXcgVmVjMihnMCkuYWRkU2VsZkMoMSwgMSk7XHJcbiAgICAgICAgY29uc3QgZjAgPSBuZXcgVmVjMih4LCB5KS5zdWJTZWxmKGcwKTtcclxuICAgICAgICBjb25zdCBmMSA9IG5ldyBWZWMyKHgsIHkpLnN1YlNlbGYoZzEpO1xyXG4gICAgICAgIGNvbnN0IGNBQSA9IGdldFBlcmxpblZlY3RvcjJEKGcwLngsIGcwLnksIHNlZWQpLmRvdChmMCk7XHJcbiAgICAgICAgY29uc3QgY0FCID0gZ2V0UGVybGluVmVjdG9yMkQoZzAueCwgZzEueSwgc2VlZCkuZG90QyhmMC54LCBmMS55KTtcclxuICAgICAgICBjb25zdCBjQkEgPSBnZXRQZXJsaW5WZWN0b3IyRChnMS54LCBnMC55LCBzZWVkKS5kb3RDKGYxLngsIGYwLnkpO1xyXG4gICAgICAgIGNvbnN0IGNCQiA9IGdldFBlcmxpblZlY3RvcjJEKGcxLngsIGcxLnksIHNlZWQpLmRvdChmMSk7XHJcbiAgICAgICAgY29uc3QgdHggPSBmYWRlKGYwLngpO1xyXG4gICAgICAgIGNvbnN0IHR5ID0gZmFkZShmMC55KTtcclxuICAgICAgICBjb25zdCBjQSA9IGxlcnAoY0FBLCBjQkEsIHR4KTtcclxuICAgICAgICBjb25zdCBjQiA9IGxlcnAoY0FCLCBjQkIsIHR4KTtcclxuICAgICAgICBjb25zdCBjID0gbGVycChjQSwgY0IsIHR5KTtcclxuICAgICAgICByZXR1cm4gRU1hdGguY2xhbXAoYyAqIDAuNSArIDAuNSwgMCwgMSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcGVybGluTm9pc2UzRCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBzZWVkID0gMCkgOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGdldFBlcmxpblZlY3RvcjNEID0gTm9pc2UuZ2V0UGVybGluVmVjdG9yM0Q7XHJcbiAgICAgICAgY29uc3QgbGVycCA9IEVNYXRoLmxlcnA7XHJcbiAgICAgICAgY29uc3QgZmFkZSA9IE5vaXNlLmZhZGU7XHJcbiAgICAgICAgY29uc3QgZzAgPSBuZXcgVmVjMyh4LCB5LCB6KS5tYXBTZWxmKE1hdGguZmxvb3IpO1xyXG4gICAgICAgIGNvbnN0IGcxID0gbmV3IFZlYzMoZzApLmFkZFNlbGZDKDEsIDEsIDEpO1xyXG4gICAgICAgIGNvbnN0IGYwID0gbmV3IFZlYzMoeCwgeSwgeikuc3ViU2VsZihnMCk7XHJcbiAgICAgICAgY29uc3QgZjEgPSBuZXcgVmVjMyh4LCB5LCB6KS5zdWJTZWxmKGcxKTtcclxuICAgICAgICBjb25zdCBjQUFBID0gZ2V0UGVybGluVmVjdG9yM0QoZzAueCwgZzAueSwgZzAueiwgc2VlZCkuZG90KGYwKTtcclxuICAgICAgICBjb25zdCBjQUFCID0gZ2V0UGVybGluVmVjdG9yM0QoZzAueCwgZzAueSwgZzEueiwgc2VlZCkuZG90QyhmMC54LCBmMC55LCBmMS56KTtcclxuICAgICAgICBjb25zdCBjQUJBID0gZ2V0UGVybGluVmVjdG9yM0QoZzAueCwgZzEueSwgZzAueiwgc2VlZCkuZG90QyhmMC54LCBmMS55LCBmMC56KTtcclxuICAgICAgICBjb25zdCBjQUJCID0gZ2V0UGVybGluVmVjdG9yM0QoZzAueCwgZzEueSwgZzEueiwgc2VlZCkuZG90QyhmMC54LCBmMS55LCBmMS56KTtcclxuICAgICAgICBjb25zdCBjQkFBID0gZ2V0UGVybGluVmVjdG9yM0QoZzEueCwgZzAueSwgZzAueiwgc2VlZCkuZG90QyhmMS54LCBmMC55LCBmMC56KTtcclxuICAgICAgICBjb25zdCBjQkFCID0gZ2V0UGVybGluVmVjdG9yM0QoZzEueCwgZzAueSwgZzEueiwgc2VlZCkuZG90QyhmMS54LCBmMC55LCBmMS56KTtcclxuICAgICAgICBjb25zdCBjQkJBID0gZ2V0UGVybGluVmVjdG9yM0QoZzEueCwgZzEueSwgZzAueiwgc2VlZCkuZG90QyhmMS54LCBmMS55LCBmMC56KTtcclxuICAgICAgICBjb25zdCBjQkJCID0gZ2V0UGVybGluVmVjdG9yM0QoZzEueCwgZzEueSwgZzEueiwgc2VlZCkuZG90KGYxKTtcclxuICAgICAgICBjb25zdCB0eCA9IGZhZGUoZjAueCk7XHJcbiAgICAgICAgY29uc3QgdHkgPSBmYWRlKGYwLnkpO1xyXG4gICAgICAgIGNvbnN0IHR6ID0gZmFkZShmMC56KTtcclxuICAgICAgICBjb25zdCBjQUEgPSBsZXJwKGNBQUEsIGNCQUEsIHR4KTtcclxuICAgICAgICBjb25zdCBjQUIgPSBsZXJwKGNBQUIsIGNCQUIsIHR4KTtcclxuICAgICAgICBjb25zdCBjQkEgPSBsZXJwKGNBQkEsIGNCQkEsIHR4KTtcclxuICAgICAgICBjb25zdCBjQkIgPSBsZXJwKGNBQkIsIGNCQkIsIHR4KTtcclxuICAgICAgICBjb25zdCBjQSA9IGxlcnAoY0FBLCBjQkEsIHR5KTtcclxuICAgICAgICBjb25zdCBjQiA9IGxlcnAoY0FCLCBjQkIsIHR5KTtcclxuICAgICAgICBjb25zdCBjID0gbGVycChjQSwgY0IsIHR6KTtcclxuICAgICAgICByZXR1cm4gRU1hdGguY2xhbXAoYyAqIDAuNSArIDAuNSwgMCwgMSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdm9yb25vaU5vaXNlMkQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHNlZWQgPSAwLCB0ID0gMSkge1xyXG4gICAgICAgIGxldCBwID0gbmV3IFZlYzIoeCwgeSk7XHJcbiAgICAgICAgY29uc3QgZzAgPSBwLm1hcChNYXRoLmZsb29yKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgcG9pbnREaXN0YW5jZTogSW5maW5pdHksXHJcbiAgICAgICAgICAgIHZhbHVlOiAwLFxyXG4gICAgICAgICAgICBncmlkUG9zOiBWZWMyLnplcm8oKSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGZvcihsZXQgeG9mZj0tMTt4b2ZmPD0xO3hvZmYrKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IHlvZmY9LTE7eW9mZjw9MTt5b2ZmKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdyaWRQb3MgPSBnMC5hZGRDKHhvZmYsIHlvZmYpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcG9pbnRQb3MgPSBOb2lzZS5nZXRWb3Jvbm9pR3JpZFBvc2l0aW9uMkQoZ3JpZFBvcy54LCBncmlkUG9zLnksIHNlZWQsIHQpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdCA9IHAuZGlzdChwb2ludFBvcyk7XHJcbiAgICAgICAgICAgICAgICBpZihkaXN0PGRhdGEucG9pbnREaXN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuZ3JpZFBvcyA9IGdyaWRQb3M7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5wb2ludERpc3RhbmNlID0gZGlzdDtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnZhbHVlID0gTm9pc2UuZ2V0Vm9yb25vaUdyaWRWYWx1ZTJEKGdyaWRQb3MueCwgZ3JpZFBvcy55LCBzZWVkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuICAgIHN0YXRpYyB2b3Jvbm9pTm9pc2UzRCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBzZWVkID0gMCwgdCA9IDEpIHtcclxuICAgICAgICBsZXQgcCA9IG5ldyBWZWMzKHgsIHksIHopO1xyXG4gICAgICAgIGNvbnN0IGcwID0gcC5tYXAoTWF0aC5mbG9vcik7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHBvaW50RGlzdGFuY2U6IEluZmluaXR5LFxyXG4gICAgICAgICAgICB2YWx1ZTogMCxcclxuICAgICAgICAgICAgZ3JpZFBvczogVmVjMy56ZXJvKCksXHJcbiAgICAgICAgfTtcclxuICAgICAgICBmb3IobGV0IHhvZmY9LTE7eG9mZjw9MTt4b2ZmKyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCB5b2ZmPS0xO3lvZmY8PTE7eW9mZisrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IHpvZmY9LTE7em9mZjw9MTt6b2ZmKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBncmlkUG9zID0gZzAuYWRkQyh4b2ZmLCB5b2ZmLCB6b2ZmKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludFBvcyA9IE5vaXNlLmdldFZvcm9ub2lHcmlkUG9zaXRpb24zRChncmlkUG9zLngsIGdyaWRQb3MueSwgZ3JpZFBvcy56LCBzZWVkLCB0KTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0ID0gcC5kaXN0KHBvaW50UG9zKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihkaXN0PGRhdGEucG9pbnREaXN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmdyaWRQb3MgPSBncmlkUG9zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnBvaW50RGlzdGFuY2UgPSBkaXN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnZhbHVlID0gTm9pc2UuZ2V0Vm9yb25vaUdyaWRWYWx1ZTNEKGdyaWRQb3MueCwgZ3JpZFBvcy55LCBncmlkUG9zLnosIHNlZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIENBTUVSQSBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBDYW1lcmEzRCB7XHJcbiAgICBwcml2YXRlIF9mb3ZZITogbnVtYmVyO1xyXG4gICAgZ2V0IGZvdlkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Zvdlk7XHJcbiAgICB9XHJcbiAgICBzZXQgZm92WShuOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9mb3ZZID0gbjtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZFBlcnNwZWN0aXZlTWF0cml4ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9hc3BlY3QhOiBudW1iZXI7XHJcbiAgICBnZXQgYXNwZWN0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hc3BlY3Q7XHJcbiAgICB9XHJcbiAgICBzZXQgYXNwZWN0KG46IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2FzcGVjdCA9IG47XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRQZXJzcGVjdGl2ZU1hdHJpeCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfbmVhciE6IG51bWJlcjtcclxuICAgIGdldCBuZWFyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9uZWFyO1xyXG4gICAgfVxyXG4gICAgc2V0IG5lYXIobjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fbmVhciA9IG47XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRQZXJzcGVjdGl2ZU1hdHJpeCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZmFyITogbnVtYmVyO1xyXG4gICAgZ2V0IGZhcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZmFyO1xyXG4gICAgfVxyXG4gICAgc2V0IGZhcihuOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9mYXIgPSBuO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkUGVyc3BlY3RpdmVNYXRyaXggPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3Bvc2l0aW9uITogVmVjMztcclxuICAgIGdldCBwb3NpdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9zaXRpb247XHJcbiAgICB9XHJcbiAgICBzZXQgcG9zaXRpb24odjogVmVjMykge1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gdjtcclxuICAgICAgICB2Lm9uTXV0YXRlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFRyYW5zbGF0aW9uTWF0cml4ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRWaWV3TWF0cml4ID0gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHYub25NdXRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF93b3JsZFNjYWxlID0gMTtcclxuICAgIGdldCB3b3JsZFNjYWxlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93b3JsZFNjYWxlO1xyXG4gICAgfVxyXG4gICAgc2V0IHdvcmxkU2NhbGUobjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fd29ybGRTY2FsZSA9IG47XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRUcmFuc2xhdGlvbk1hdHJpeCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRWaWV3TWF0cml4ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yb3RhdGlvbiE6IFZlYzM7XHJcbiAgICBnZXQgcm90YXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvdGF0aW9uO1xyXG4gICAgfVxyXG4gICAgc2V0IHJvdGF0aW9uKHY6IFZlYzMpIHtcclxuICAgICAgICB0aGlzLl9yb3RhdGlvbiA9IHY7XHJcbiAgICAgICAgdi5vbk11dGF0ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRGb3J3YXJkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSaWdodCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkVXAgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZEZvcndhcmRGbGF0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSb3RhdGlvbk1hdHJpeCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkVmlld01hdHJpeCA9IHRydWU7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2Lm9uTXV0YXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZm9yd2FyZCA9IFZlYzMuemVybygpO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRGb3J3YXJkPzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBnZXQgZm9yd2FyZCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZEZvcndhcmQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZm9yd2FyZCA9IFZlYzMuekF4aXMoKS5uZWdTZWxmKCkucm90WFlaU2VsZih0aGlzLl9yb3RhdGlvbik7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZEZvcndhcmQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3J3YXJkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JpZ2h0ID0gVmVjMy56ZXJvKCk7XHJcbiAgICBwcml2YXRlIF9vdXRkYXRlZFJpZ2h0PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBnZXQgcmlnaHQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRSaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yaWdodCA9IFZlYzMueEF4aXMoKS5yb3RYWVpTZWxmKHRoaXMuX3JvdGF0aW9uKTtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkUmlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9yaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF91cCA9IFZlYzMuemVybygpO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRVcD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgZ2V0IHVwKCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkVXApIHtcclxuICAgICAgICAgICAgdGhpcy5fdXAgPSBWZWMzLnlBeGlzKCkucm90WFlaU2VsZih0aGlzLl9yb3RhdGlvbik7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFVwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fdXA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZm9yd2FyZEZsYXQgPSBWZWMzLnplcm8oKTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkRm9yd2FyZEZsYXQ/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGdldCBmb3J3YXJkRmxhdCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZEZvcndhcmRGbGF0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvcndhcmRGbGF0ID0gVmVjMy56QXhpcygpLm5lZ1NlbGYoKS5yb3RZU2VsZih0aGlzLl9yb3RhdGlvbi55KTtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX291dGRhdGVkRm9yd2FyZEZsYXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3J3YXJkRmxhdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9wZXJzcGVjdGl2ZU1hdHJpeDogbnVtYmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkUGVyc3BlY3RpdmVNYXRyaXg/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGdldCBwZXJzcGVjdGl2ZU1hdHJpeCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFBlcnNwZWN0aXZlTWF0cml4KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BlcnNwZWN0aXZlTWF0cml4ID0gTWF0NC5wZXJzcGVjdGl2ZSh0aGlzLl9mb3ZZLCB0aGlzLl9hc3BlY3QsIHRoaXMuX25lYXIsIHRoaXMuX2Zhcik7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFBlcnNwZWN0aXZlTWF0cml4O1xyXG4gICAgICAgICAgICB0aGlzLnBlcnNwZWN0aXZlTWF0cml4Q2hhbmdlRXZlbnQuZmlyZSh0aGlzLl9wZXJzcGVjdGl2ZU1hdHJpeCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9wZXJzcGVjdGl2ZU1hdHJpeDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF90cmFuc2xhdGlvbk1hdHJpeDogbnVtYmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX291dGRhdGVkVHJhbnNsYXRpb25NYXRyaXg/OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGdldCB0cmFuc2xhdGlvbk1hdHJpeCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFRyYW5zbGF0aW9uTWF0cml4KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zbGF0aW9uTWF0cml4ID0gTWF0NC50cmFuc2xhdGUoLXRoaXMuX3Bvc2l0aW9uLnggKiB0aGlzLl93b3JsZFNjYWxlLCAtdGhpcy5fcG9zaXRpb24ueSAqIHRoaXMuX3dvcmxkU2NhbGUsIC10aGlzLl9wb3NpdGlvbi56ICogdGhpcy5fd29ybGRTY2FsZSk7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFRyYW5zbGF0aW9uTWF0cml4O1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zbGF0aW9uTWF0cml4Q2hhbmdlRXZlbnQuZmlyZSh0aGlzLl92aWV3TWF0cml4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9uTWF0cml4O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JvdGF0aW9uTWF0cml4OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRSb3RhdGlvbk1hdHJpeD86IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgZ2V0IHJvdGF0aW9uTWF0cml4KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkUm90YXRpb25NYXRyaXgpIHtcclxuICAgICAgICAgICAgdGhpcy5fcm90YXRpb25NYXRyaXggPSBNYXQ0Lm11bHRpcGx5KFxyXG4gICAgICAgICAgICAgICAgTWF0NC5yb3RhdGVaKC10aGlzLl9yb3RhdGlvbi56KSxcclxuICAgICAgICAgICAgICAgIE1hdDQubXVsdGlwbHkoXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0NC5yb3RhdGVYKC10aGlzLl9yb3RhdGlvbi54KSxcclxuICAgICAgICAgICAgICAgICAgICBNYXQ0LnJvdGF0ZVkoLXRoaXMuX3JvdGF0aW9uLnkpLFxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fb3V0ZGF0ZWRSb3RhdGlvbk1hdHJpeDtcclxuICAgICAgICAgICAgdGhpcy5yb3RhdGlvbk1hdHJpeENoYW5nZUV2ZW50LmZpcmUodGhpcy5fdmlld01hdHJpeCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9yb3RhdGlvbk1hdHJpeDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF92aWV3TWF0cml4OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfb3V0ZGF0ZWRWaWV3TWF0cml4PzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBnZXQgdmlld01hdHJpeCgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFZpZXdNYXRyaXgpIHtcclxuICAgICAgICAgICAgdGhpcy5fdmlld01hdHJpeCA9IE1hdDQubXVsdGlwbHkodGhpcy5yb3RhdGlvbk1hdHJpeCwgdGhpcy50cmFuc2xhdGlvbk1hdHJpeCk7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9vdXRkYXRlZFZpZXdNYXRyaXg7XHJcbiAgICAgICAgICAgIHRoaXMudmlld01hdHJpeENoYW5nZUV2ZW50LmZpcmUodGhpcy5fdmlld01hdHJpeCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl92aWV3TWF0cml4O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwZXJzcGVjdGl2ZU1hdHJpeENoYW5nZUV2ZW50ID0gbmV3IFNpZ25hbCh7IG9uQ29ubmVjdDogY29ubiA9PiBjb25uLmZpcmUodGhpcy5wZXJzcGVjdGl2ZU1hdHJpeCkgfSk7XHJcbiAgICBwdWJsaWMgdmlld01hdHJpeENoYW5nZUV2ZW50ID0gbmV3IFNpZ25hbCh7IG9uQ29ubmVjdDogY29ubiA9PiBjb25uLmZpcmUodGhpcy52aWV3TWF0cml4KSB9KTtcclxuICAgIHB1YmxpYyByb3RhdGlvbk1hdHJpeENoYW5nZUV2ZW50ID0gbmV3IFNpZ25hbCh7IG9uQ29ubmVjdDogY29ubiA9PiBjb25uLmZpcmUodGhpcy5yb3RhdGlvbk1hdHJpeCkgfSk7XHJcbiAgICBwdWJsaWMgdHJhbnNsYXRpb25NYXRyaXhDaGFuZ2VFdmVudCA9IG5ldyBTaWduYWwoeyBvbkNvbm5lY3Q6IGNvbm4gPT4gY29ubi5maXJlKHRoaXMudHJhbnNsYXRpb25NYXRyaXgpIH0pO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uPzogVmVjMywgZm92WT86IG51bWJlciwgYXNwZWN0PzogbnVtYmVyLCBuZWFyPzogbnVtYmVyLCBmYXI/OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb24gPz8gVmVjMy56ZXJvKCk7XHJcbiAgICAgICAgdGhpcy5mb3ZZID0gZm92WSA/PyA5NS8xODAqTWF0aC5QSTtcclxuICAgICAgICB0aGlzLmFzcGVjdCA9IGFzcGVjdCA/PyAxO1xyXG4gICAgICAgIHRoaXMubmVhciA9IG5lYXIgPz8gMC4xO1xyXG4gICAgICAgIHRoaXMuZmFyID0gZmFyID8/IDEwMDAwO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSBWZWMzLnplcm8oKTtcclxuICAgIH1cclxuXHJcbiAgICBsb29rQXQocDogVmVjMykge1xyXG4gICAgICAgIGxldCBmID0gdGhpcy5wb3NpdGlvbi5sb29rKHApO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSBuZXcgVmVjMyhmLnBpdGNoKCksIGYueWF3KCksIDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIE1FU0ggQ0xBU1NFUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGNsYXNzIE1lc2gzRCB7XHJcbiAgICBwb3NpdGlvbnM6IG51bWJlcltdID0gW107XHJcbiAgICB0ZXhjb29yZHM6IG51bWJlcltdID0gW107XHJcbiAgICBub3JtYWxzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG4gICAgY2xvbmUoKTogTWVzaDNEIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1lc2gzRCgpLmFwcGVuZCh0aGlzKTtcclxuICAgIH1cclxuICAgIHRyYW5zbGF0ZSh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5wb3NpdGlvbnMubGVuZ3RoOyBpKz0zKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2ldISArPSB4O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzFdISArPSB5O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzJdISArPSB6O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHNjYWxlKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTMpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaV0hICo9IHg7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMV0hICo9IHk7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMl0hICo9IHo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm90YXRlKGF4OiBudW1iZXIsIGF5OiBudW1iZXIsIGF6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTMpIHtcclxuICAgICAgICAgICAgbGV0IHAgPSBuZXcgVmVjMyh0aGlzLnBvc2l0aW9uc1tpXSEsIHRoaXMucG9zaXRpb25zW2krMV0hLCB0aGlzLnBvc2l0aW9uc1tpKzJdISk7XHJcbiAgICAgICAgICAgIHAucm90WFlaU2VsZkMoYXgsIGF5LCBheik7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2ldID0gcC54O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzFdID0gcC55O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzJdID0gcC56O1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLm5vcm1hbHMubGVuZ3RoOyBpKz0zKSB7XHJcbiAgICAgICAgICAgIGxldCBwID0gbmV3IFZlYzModGhpcy5ub3JtYWxzW2ldISwgdGhpcy5ub3JtYWxzW2krMV0hLCB0aGlzLm5vcm1hbHNbaSsyXSEpO1xyXG4gICAgICAgICAgICBwLnJvdFhZWlNlbGZDKGF4LCBheSwgYXopO1xyXG4gICAgICAgICAgICB0aGlzLm5vcm1hbHNbaV0gPSBwLng7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFsc1tpKzFdID0gcC55O1xyXG4gICAgICAgICAgICB0aGlzLm5vcm1hbHNbaSsyXSA9IHAuejtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByb3RhdGVBcm91bmQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgYXg6IG51bWJlciwgYXk6IG51bWJlciwgYXo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mykge1xyXG4gICAgICAgICAgICBsZXQgcCA9IG5ldyBWZWMzKHRoaXMucG9zaXRpb25zW2ldISAtIHgsIHRoaXMucG9zaXRpb25zW2krMV0hIC0geSwgdGhpcy5wb3NpdGlvbnNbaSsyXSEgLSB6KTtcclxuICAgICAgICAgICAgcC5yb3RYWVpTZWxmQyhheCwgYXksIGF6KTtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaV0gPSBwLnggKyB4O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzFdID0gcC55ICsgeTtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsyXSA9IHAueiArIHo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMubm9ybWFscy5sZW5ndGg7IGkrPTMpIHtcclxuICAgICAgICAgICAgbGV0IHAgPSBuZXcgVmVjMyh0aGlzLm5vcm1hbHNbaV0hLCB0aGlzLm5vcm1hbHNbaSsxXSEsIHRoaXMubm9ybWFsc1tpKzJdISk7XHJcbiAgICAgICAgICAgIHAucm90WFlaU2VsZkMoYXgsIGF5LCBheik7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFsc1tpXSA9IHAueDtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzW2krMV0gPSBwLnk7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFsc1tpKzJdID0gcC56O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFwcGVuZCguLi5tZXNoZXM6IE1lc2gzRFtdKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGNvbnN0IG1lc2ggb2YgbWVzaGVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zLnB1c2goLi4ubWVzaC5wb3NpdGlvbnMpO1xyXG4gICAgICAgICAgICB0aGlzLnRleGNvb3Jkcy5wdXNoKC4uLm1lc2gudGV4Y29vcmRzKTtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzLnB1c2goLi4ubWVzaC5ub3JtYWxzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBwdXNoUG9zaXRpb25zKGFycjogbnVtYmVyW10sIHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTMpIHtcclxuICAgICAgICAgICAgYXJyLnB1c2godGhpcy5wb3NpdGlvbnNbaV0hICsgeCk7XHJcbiAgICAgICAgICAgIGFyci5wdXNoKHRoaXMucG9zaXRpb25zW2krMV0hICsgeSk7XHJcbiAgICAgICAgICAgIGFyci5wdXNoKHRoaXMucG9zaXRpb25zW2krMl0hICsgeik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9XHJcbiAgICBzZXROb3JtYWxzKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLm5vcm1hbHMubGVuZ3RoOyBpKz0zKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFsc1tpXSA9IHg7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFsc1tpKzFdID0geTtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzW2krMl0gPSB6O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN0YXRpYyB0cmlhbmdsZXNUb0VkZ2VzKHBvc2l0aW9uczogbnVtYmVyW10pOiBudW1iZXJbXSB7XHJcbiAgICAgICAgbGV0IGVkZ2VzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHBvc2l0aW9ucy5sZW5ndGg7IGkrPTkpIHtcclxuICAgICAgICAgICAgZWRnZXMucHVzaChwb3NpdGlvbnNbaV0hLCBwb3NpdGlvbnNbaSsxXSEsIHBvc2l0aW9uc1tpKzJdISwgcG9zaXRpb25zW2krM10hLCBwb3NpdGlvbnNbaSs0XSEsIHBvc2l0aW9uc1tpKzVdISk7XHJcbiAgICAgICAgICAgIGVkZ2VzLnB1c2gocG9zaXRpb25zW2krM10hLCBwb3NpdGlvbnNbaSs0XSEsIHBvc2l0aW9uc1tpKzVdISwgcG9zaXRpb25zW2krNl0hLCBwb3NpdGlvbnNbaSs3XSEsIHBvc2l0aW9uc1tpKzhdISk7XHJcbiAgICAgICAgICAgIGVkZ2VzLnB1c2gocG9zaXRpb25zW2krNl0hLCBwb3NpdGlvbnNbaSs3XSEsIHBvc2l0aW9uc1tpKzhdISwgcG9zaXRpb25zW2ldISwgcG9zaXRpb25zW2krMV0hLCBwb3NpdGlvbnNbaSsyXSEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZWRnZXM7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdHJpYW5nbGVRdWFkc1RvRWRnZXMocG9zaXRpb25zOiBudW1iZXJbXSk6IG51bWJlcltdIHtcclxuICAgICAgICBsZXQgZWRnZXM6IG51bWJlcltdID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8cG9zaXRpb25zLmxlbmd0aDsgaSs9MTgpIHtcclxuICAgICAgICAgICAgZWRnZXMucHVzaChwb3NpdGlvbnNbaV0hLCBwb3NpdGlvbnNbaSsxXSEsIHBvc2l0aW9uc1tpKzJdISwgcG9zaXRpb25zW2krM10hLCBwb3NpdGlvbnNbaSs0XSEsIHBvc2l0aW9uc1tpKzVdISk7XHJcbiAgICAgICAgICAgIGVkZ2VzLnB1c2gocG9zaXRpb25zW2krM10hLCBwb3NpdGlvbnNbaSs0XSEsIHBvc2l0aW9uc1tpKzVdISwgcG9zaXRpb25zW2krNl0hLCBwb3NpdGlvbnNbaSs3XSEsIHBvc2l0aW9uc1tpKzhdISk7XHJcbiAgICAgICAgICAgIGVkZ2VzLnB1c2gocG9zaXRpb25zW2krNl0hLCBwb3NpdGlvbnNbaSs3XSEsIHBvc2l0aW9uc1tpKzhdISwgcG9zaXRpb25zW2krOV0hLCBwb3NpdGlvbnNbaSsxMF0hLCBwb3NpdGlvbnNbaSsxMV0hKTtcclxuICAgICAgICAgICAgZWRnZXMucHVzaChwb3NpdGlvbnNbaSs5XSEsIHBvc2l0aW9uc1tpKzEwXSEsIHBvc2l0aW9uc1tpKzExXSEsIHBvc2l0aW9uc1tpKzEyXSEsIHBvc2l0aW9uc1tpKzEzXSEsIHBvc2l0aW9uc1tpKzE0XSEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZWRnZXM7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgUEhZU0lDUyBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGh5c2ljczJEIHtcclxuICAgIHN0YXRpYyBnZXRQb2ludFJlY3RDb2xsaXNpb24ocG9pbnQ6IFZlYzIsIGNlbnRlcjogVmVjMiwgcmlnaHRPZmZzZXQ6IFZlYzIsIHVwT2Zmc2V0OiBWZWMyKSB7XHJcbiAgICAgICAgY29uc3QgcmlnaHQgPSByaWdodE9mZnNldC5ub3JtKCk7XHJcbiAgICAgICAgY29uc3QgdXAgPSB1cE9mZnNldC5ub3JtKCk7XHJcbiAgICAgICAgY29uc3Qgc2l6ZVggPSByaWdodE9mZnNldC5sZW5ndGgoKTtcclxuICAgICAgICBjb25zdCBzaXplWSA9IHVwT2Zmc2V0Lmxlbmd0aCgpO1xyXG4gICAgICAgIGxldCBkaWZmID0gcG9pbnQuc3ViKGNlbnRlcik7XHJcbiAgICAgICAgbGV0IGR4ID0gZGlmZi5kb3QocmlnaHQpO1xyXG4gICAgICAgIGxldCBkeSA9IGRpZmYuZG90KHVwKTtcclxuICAgICAgICBsZXQgaXNJbnNpZGUgPSAoTWF0aC5hYnMoZHgpIDwgc2l6ZVggJiYgTWF0aC5hYnMoZHkpIDwgc2l6ZVkpO1xyXG4gICAgICAgIGlmKGlzSW5zaWRlKSB7XHJcbiAgICAgICAgICAgIGxldCBkMSA9IE1hdGguYWJzKHBvaW50LnN1YihjZW50ZXIuYWRkU2NhbGVkKHVwLCBzaXplWSkpLmRvdCh1cCkpO1xyXG4gICAgICAgICAgICBsZXQgZDIgPSBNYXRoLmFicyhwb2ludC5zdWIoY2VudGVyLmFkZFNjYWxlZCh1cCwgLXNpemVZKSkuZG90KHVwKSk7XHJcbiAgICAgICAgICAgIGxldCBkMyA9IE1hdGguYWJzKHBvaW50LnN1YihjZW50ZXIuYWRkU2NhbGVkKHJpZ2h0LCBzaXplWCkpLmRvdChyaWdodCkpO1xyXG4gICAgICAgICAgICBsZXQgZDQgPSBNYXRoLmFicyhwb2ludC5zdWIoY2VudGVyLmFkZFNjYWxlZChyaWdodCwgLXNpemVYKSkuZG90KHJpZ2h0KSk7XHJcbiAgICAgICAgICAgIGxldCBtaW5JbmRleCA9IDA7XHJcbiAgICAgICAgICAgIGxldCBtaW5EaXN0ID0gZDE7XHJcbiAgICAgICAgICAgIGlmKGQyIDwgbWluRGlzdCkgeyBtaW5EaXN0ID0gZDI7IG1pbkluZGV4ID0gMTsgfVxyXG4gICAgICAgICAgICBpZihkMyA8IG1pbkRpc3QpIHsgbWluRGlzdCA9IGQzOyBtaW5JbmRleCA9IDI7IH1cclxuICAgICAgICAgICAgaWYoZDQgPCBtaW5EaXN0KSB7IG1pbkRpc3QgPSBkNDsgbWluSW5kZXggPSAzOyB9XHJcbiAgICAgICAgICAgIGxldCBlZGdlOiBWZWMyO1xyXG4gICAgICAgICAgICBsZXQgbm9ybWFsOiBWZWMyO1xyXG4gICAgICAgICAgICBzd2l0Y2gobWluSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICBlZGdlID0gY2VudGVyLmFkZFNjYWxlZChyaWdodCwgZHgpLmFkZFNjYWxlZCh1cCwgc2l6ZVkpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbCA9IHVwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2UgPSBjZW50ZXIuYWRkU2NhbGVkKHJpZ2h0LCBkeCkuYWRkU2NhbGVkKHVwLCAtc2l6ZVkpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbCA9IHVwLm5lZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2UgPSBjZW50ZXIuYWRkU2NhbGVkKHVwLCBkeSkuYWRkU2NhbGVkKHJpZ2h0LCBzaXplWCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsID0gcmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZSA9IGNlbnRlci5hZGRTY2FsZWQodXAsIGR5KS5hZGRTY2FsZWQocmlnaHQsIC1zaXplWCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsID0gcmlnaHQubmVnKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGluc2lkZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbGxpc2lvbjogZWRnZSEsXHJcbiAgICAgICAgICAgICAgICBkaXN0YW5jZTogLWVkZ2UhLmRpc3QocG9pbnQpLFxyXG4gICAgICAgICAgICAgICAgbm9ybWFsOiBub3JtYWwhLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZHggPSBFTWF0aC5jbGFtcChkeCwgLXNpemVYLCBzaXplWCk7XHJcbiAgICAgICAgICAgIGR5ID0gRU1hdGguY2xhbXAoZHksIC1zaXplWSwgc2l6ZVkpO1xyXG4gICAgICAgICAgICBsZXQgZWRnZSA9IGNlbnRlci5hZGRTY2FsZWQocmlnaHQsIGR4KS5hZGRTY2FsZWQodXAsIGR5KTtcclxuICAgICAgICAgICAgbGV0IGRpc3QgPSBlZGdlLmRpc3QocG9pbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgaW5zaWRlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbGxpc2lvbjogZWRnZSxcclxuICAgICAgICAgICAgICAgIGRpc3RhbmNlOiBkaXN0LFxyXG4gICAgICAgICAgICAgICAgbm9ybWFsOiBlZGdlLmxvb2socG9pbnQpLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRJc1BvaW50SW5zaWRlUmVjdChwb2ludDogVmVjMiwgY2VudGVyOiBWZWMyLCByaWdodE9mZnNldDogVmVjMiwgdXBPZmZzZXQ6IFZlYzIpIHtcclxuICAgICAgICBsZXQgZGlmZiA9IHBvaW50LnN1YihjZW50ZXIpO1xyXG4gICAgICAgIGxldCBkeCA9IGRpZmYuZG90KHJpZ2h0T2Zmc2V0Lm5vcm0oKSk7XHJcbiAgICAgICAgbGV0IGR5ID0gZGlmZi5kb3QodXBPZmZzZXQubm9ybSgpKTtcclxuICAgICAgICByZXR1cm4gKE1hdGguYWJzKGR4KSA8IHJpZ2h0T2Zmc2V0Lmxlbmd0aCgpICYmIE1hdGguYWJzKGR5KSA8IHVwT2Zmc2V0Lmxlbmd0aCgpKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRDaXJjbGVSZWN0Q29sbGlzaW9uKHBvaW50OiBWZWMyLCByYWRpdXM6IG51bWJlciwgY2VudGVyOiBWZWMyLCByaWdodE9mZnNldDogVmVjMiwgdXBPZmZzZXQ6IFZlYzIpIHtcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy5nZXRQb2ludFJlY3RDb2xsaXNpb24ocG9pbnQsIGNlbnRlciwgcmlnaHRPZmZzZXQsIHVwT2Zmc2V0KTtcclxuICAgICAgICByZXMuZGlzdGFuY2UgLT0gcmFkaXVzO1xyXG4gICAgICAgIGlmKHJlcy5kaXN0YW5jZSA8PSAwKSByZXMuaW5zaWRlID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldENpcmNsZUNpcmNsZUNvbGxpc2lvbihwb2ludEE6IFZlYzIsIHJhZGl1c0E6IG51bWJlciwgcG9pbnRCOiBWZWMyLCByYWRpdXNCOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgZGlzdCA9IHBvaW50QS5kaXN0KHBvaW50QikgLSByYWRpdXNBIC0gcmFkaXVzQjtcclxuICAgICAgICBsZXQgbm9ybWFsID0gcG9pbnRBLmxvb2socG9pbnRCKTtcclxuICAgICAgICBsZXQgY29sbGlzaW9uID0gcG9pbnRBLmFkZFNjYWxlZChub3JtYWwsIHJhZGl1c0EpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGluc2lkZTogZGlzdCA8PSAwLFxyXG4gICAgICAgICAgICBjb2xsaXNpb24sXHJcbiAgICAgICAgICAgIGRpc3RhbmNlOiBkaXN0LFxyXG4gICAgICAgICAgICBub3JtYWwsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRDaXJjbGVMaW5lQ29sbGlzaW9uKHBvaW50OiBWZWMyLCByYWRpdXM6IG51bWJlciwgc3RhcnQ6IFZlYzIsIGVuZDogVmVjMikge1xyXG4gICAgICAgIGxldCBkaXIgPSBzdGFydC5sb29rKGVuZCk7XHJcbiAgICAgICAgbGV0IG9mZiA9IHBvaW50LnN1YihzdGFydCk7XHJcbiAgICAgICAgbGV0IHQgPSBvZmYuZG90KGRpcik7XHJcbiAgICAgICAgbGV0IG1heFQgPSBlbmQuZGlzdChzdGFydCk7XHJcbiAgICAgICAgdCA9IEVNYXRoLmNsYW1wKHQsIDAsIG1heFQpO1xyXG4gICAgICAgIGxldCBjb2xsaXNpb24gPSBzdGFydC5hZGRTY2FsZWQoZGlyLCB0KTtcclxuICAgICAgICBsZXQgbm9ybWFsID0gY29sbGlzaW9uLmxvb2socG9pbnQpO1xyXG4gICAgICAgIGxldCBkaXN0ID0gY29sbGlzaW9uLmRpc3QocG9pbnQpIC0gcmFkaXVzO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGluc2lkZTogZGlzdCA8PSAwLFxyXG4gICAgICAgICAgICBjb2xsaXNpb24sXHJcbiAgICAgICAgICAgIGRpc3RhbmNlOiBkaXN0LFxyXG4gICAgICAgICAgICBub3JtYWwsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHN0YXRpYyByZXNvbHZlQ2lyY2xlQ2lyY2xlQ29sbGlzaW9uKGE6IGFueSwgYjogYW55LCBjb2w6IGFueSkge1xyXG4gICAgICAgIGlmKCFjb2wuaW5zaWRlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgY29uc3QgdmVsQWxvbmdOb3JtYWwgPSBiLnZlbG9jaXR5LnN1YihhLnZlbG9jaXR5KS5kb3QoY29sLm5vcm1hbCk7XHJcbiAgICAgICAgY29uc3QgbWkgPSAoMS9hLm1hc3MgKyAxL2IubWFzcyk7XHJcbiAgICAgICAgaWYgKHZlbEFsb25nTm9ybWFsIDwgMCkge1xyXG4gICAgICAgICAgICBjb25zdCByZXN0aXR1dGlvbiA9IE1hdGgubWluKGEucmVzdGl0dXRpb24sIGIucmVzdGl0dXRpb24pO1xyXG4gICAgICAgICAgICBjb25zdCBqID0gLSgxK3Jlc3RpdHV0aW9uKSAqIHZlbEFsb25nTm9ybWFsIC8gbWk7XHJcbiAgICAgICAgICAgIGEudmVsb2NpdHkuYWRkU2NhbGVkU2VsZihjb2wubm9ybWFsLCBqICogLTEgLyBhLm1hc3MpO1xyXG4gICAgICAgICAgICBiLnZlbG9jaXR5LmFkZFNjYWxlZFNlbGYoY29sLm5vcm1hbCwgaiAqIDEgLyBiLm1hc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBjb3JyZWN0aW9uID0gY29sLm5vcm1hbC5yZXNjYWxlKE1hdGgubWF4KC1jb2wuZGlzdGFuY2UgLSAxZS00LCAwKSAvIG1pICogMC44KTtcclxuICAgICAgICBhLnBvc2l0aW9uLmFkZFNjYWxlZFNlbGYoY29ycmVjdGlvbiwgLTEvYS5tYXNzKTtcclxuICAgICAgICBiLnBvc2l0aW9uLmFkZFNjYWxlZFNlbGYoY29ycmVjdGlvbiwgMS9iLm1hc3MpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJlc29sdmVDaXJjbGVBbmNob3JlZFJlY3RDb2xsaXNpb24oYTogYW55LCBiOiBhbnksIGNvbDogYW55KSB7XHJcbiAgICAgICAgaWYoIWNvbC5pbnNpZGUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjb25zdCB2ZWxBbG9uZ05vcm1hbCA9IGEudmVsb2NpdHkuc3ViKGIudmVsb2NpdHkpLmRvdChjb2wubm9ybWFsKTtcclxuICAgICAgICBpZiAodmVsQWxvbmdOb3JtYWwgPCAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3RpdHV0aW9uID0gTWF0aC5taW4oYS5yZXN0aXR1dGlvbiwgYi5yZXN0aXR1dGlvbik7XHJcbiAgICAgICAgICAgIGNvbnN0IGogPSAtKDErcmVzdGl0dXRpb24pICogdmVsQWxvbmdOb3JtYWw7XHJcbiAgICAgICAgICAgIGEudmVsb2NpdHkuYWRkU2NhbGVkU2VsZihjb2wubm9ybWFsLCBqKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYS5wb3NpdGlvbiA9IGNvbC5jb2xsaXNpb24uYWRkU2NhbGVkKGNvbC5ub3JtYWwsIGEucmFkaXVzICsgMWUtNik7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGh5c2ljczNEIHtcclxuICAgIHN0YXRpYyByYXljYXN0Vm94ZWxzPFQ+KFxyXG4gICAgICAgIG9yaWdpbjogVmVjMyxcclxuICAgICAgICBkaXJlY3Rpb246IFZlYzMsXHJcbiAgICAgICAgcHJlZGljYXRlOiAocG9zOlZlYzMsIG5vcm1hbDpWZWMzLCBkaXN0Om51bWJlcikgPT4gVCB8IHVuZGVmaW5lZCxcclxuICAgICAgICBtYXhJdGVyYXRpb25zID0gMTAwMFxyXG4gICAgKTogVCB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgY29uc3QgaW52RGlyQWJzID0gZGlyZWN0aW9uLnJkaXZGKDEpLm1hcCh4ID0+IE1hdGguYWJzKHgpKTtcclxuICAgICAgICBjb25zdCBzaWduID0gZGlyZWN0aW9uLm1hcCh4ID0+IHggPiAwID8gMSA6IDApO1xyXG4gICAgICAgIGNvbnN0IHN0ZXAgPSBkaXJlY3Rpb24ubWFwKHggPT4geCA+IDAgPyAxIDogLTEpO1xyXG4gICAgICAgIGxldCB0TWF4WCA9IGludkRpckFicy54ICogKHNpZ24ueD09PTAgPyAob3JpZ2luLnggLSBNYXRoLmZsb29yKG9yaWdpbi54KSkgOiAoTWF0aC5mbG9vcihvcmlnaW4ueCkgKyAxIC0gb3JpZ2luLngpKTtcclxuICAgICAgICBsZXQgdE1heFkgPSBpbnZEaXJBYnMueSAqIChzaWduLnk9PT0wID8gKG9yaWdpbi55IC0gTWF0aC5mbG9vcihvcmlnaW4ueSkpIDogKE1hdGguZmxvb3Iob3JpZ2luLnkpICsgMSAtIG9yaWdpbi55KSk7XHJcbiAgICAgICAgbGV0IHRNYXhaID0gaW52RGlyQWJzLnogKiAoc2lnbi56PT09MCA/IChvcmlnaW4ueiAtIE1hdGguZmxvb3Iob3JpZ2luLnopKSA6IChNYXRoLmZsb29yKG9yaWdpbi56KSArIDEgLSBvcmlnaW4ueikpO1xyXG4gICAgICAgIGxldCBwb3MgPSBuZXcgVmVjMyhvcmlnaW4pLm1hcFNlbGYoeCA9PiBNYXRoLmZsb29yKHgpKTtcclxuICAgICAgICBsZXQgZGlzdGFuY2UgPSAwO1xyXG4gICAgICAgIGxldCBub3JtYWwgPSBWZWMzLnplcm8oKTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxtYXhJdGVyYXRpb25zOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHJlcyA9IHByZWRpY2F0ZShwb3MsIG5vcm1hbCwgZGlzdGFuY2UpO1xyXG4gICAgICAgICAgICBpZihyZXMgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgICAgIGlmKHRNYXhYIDwgdE1heFkpIHtcclxuICAgICAgICAgICAgICAgIGlmKHRNYXhYIDwgdE1heFopIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IHRNYXhYO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbC5zZXRDKC1zdGVwLngsIDAsIDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRNYXhYICs9IGludkRpckFicy54O1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcy54ICs9IHN0ZXAueDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2UgPSB0TWF4WjtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWwuc2V0QygwLCAwLCAtc3RlcC56KTtcclxuICAgICAgICAgICAgICAgICAgICB0TWF4WiArPSBpbnZEaXJBYnMuejtcclxuICAgICAgICAgICAgICAgICAgICBwb3MueiArPSBzdGVwLno7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZih0TWF4WSA8IHRNYXhaKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2UgPSB0TWF4WTtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWwuc2V0QygwLCAtc3RlcC55LCAwKTtcclxuICAgICAgICAgICAgICAgICAgICB0TWF4WSArPSBpbnZEaXJBYnMueTtcclxuICAgICAgICAgICAgICAgICAgICBwb3MueSArPSBzdGVwLnk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gdE1heFo7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsLnNldEMoMCwgMCwgLXN0ZXAueik7XHJcbiAgICAgICAgICAgICAgICAgICAgdE1heFogKz0gaW52RGlyQWJzLno7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zLnogKz0gc3RlcC56O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcmF5Y2FzdEJveChcclxuICAgICAgICBvcmlnaW46IFZlYzMsXHJcbiAgICAgICAgZGlyZWN0aW9uOiBWZWMzLFxyXG4gICAgICAgIGJvdW5kczogVmVjM1tdXHJcbiAgICApIHtcclxuICAgICAgICBjb25zdCBpbnZEaXIgPSBkaXJlY3Rpb24ucmRpdkYoMSk7XHJcbiAgICAgICAgY29uc3Qgc2lnbiA9IGRpcmVjdGlvbi5tYXAoeCA9PiB4ID4gMCA/IDEgOiAwKTtcclxuICAgICAgICBjb25zdCBzaWduRmxpcCA9IGRpcmVjdGlvbi5tYXAoeCA9PiB4ID4gMCA/IDAgOiAxKTtcclxuICAgICAgICBjb25zdCBzdGVwRmxpcCA9IGRpcmVjdGlvbi5tYXAoeCA9PiB4ID4gMCA/IC0xIDogMSk7XHJcbiAgICAgICAgbGV0IHRtaW4gPSAoYm91bmRzW3NpZ25GbGlwLnhdIS54IC0gb3JpZ2luLngpICogaW52RGlyLng7XHJcbiAgICAgICAgbGV0IHRtYXggPSAoYm91bmRzW3NpZ24ueF0hLnggLSBvcmlnaW4ueCkgKiBpbnZEaXIueDtcclxuICAgICAgICBsZXQgbm9ybWFsID0gbmV3IFZlYzMoc3RlcEZsaXAueCwwLDApO1xyXG4gICAgICAgIGxldCB0eW1pbiA9IChib3VuZHNbc2lnbkZsaXAueV0hLnkgLSBvcmlnaW4ueSkgKiBpbnZEaXIueTtcclxuICAgICAgICBsZXQgdHltYXggPSAoYm91bmRzW3NpZ24ueV0hLnkgLSBvcmlnaW4ueSkgKiBpbnZEaXIueTtcclxuICAgICAgICBpZigodG1pbiA+IHR5bWF4KSB8fCAodHltaW4gPiB0bWF4KSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYodHltaW4gPiB0bWluKSB7XHJcbiAgICAgICAgICAgIHRtaW4gPSB0eW1pbjtcclxuICAgICAgICAgICAgbm9ybWFsID0gbmV3IFZlYzMoMCxzdGVwRmxpcC55LDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0eW1heCA8IHRtYXgpIHRtYXggPSB0eW1heDtcclxuICAgICAgICBsZXQgdHptaW4gPSAoYm91bmRzW3NpZ25GbGlwLnpdIS56IC0gb3JpZ2luLnopICogaW52RGlyLno7XHJcbiAgICAgICAgbGV0IHR6bWF4ID0gKGJvdW5kc1tzaWduLnpdIS56IC0gb3JpZ2luLnopICogaW52RGlyLno7XHJcbiAgICAgICAgaWYoKHRtaW4gPiB0em1heCkgfHwgKHR6bWluID4gdG1heCkpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmKHR6bWluID4gdG1pbikge1xyXG4gICAgICAgICAgICB0bWluID0gdHptaW47XHJcbiAgICAgICAgICAgIG5vcm1hbCA9IG5ldyBWZWMzKDAsMCxzdGVwRmxpcC56KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHptYXggPCB0bWF4KSB0bWF4ID0gdHptYXg7XHJcbiAgICAgICAgY29uc3QgZGlzdGFuY2UgPSB0bWluIDwgMCA/IDAgOiB0bWluO1xyXG4gICAgICAgIHJldHVybiB7IG5vcm1hbCwgZGlzdGFuY2UsIGludGVyc2VjdGlvbjogb3JpZ2luLmFkZFNjYWxlZChkaXJlY3Rpb24sIGRpc3RhbmNlKSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFBoeXNpY3NMYWIyRCB7XHJcbiAgICBvYmplY3RBZGRlZEV2ZW50OiBTaWduYWw8W29iajogYW55XT4gPSBuZXcgU2lnbmFsKCk7XHJcbiAgICBvYmplY3RzOiBhbnkgPSBbXTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuICAgIGNyZWF0ZVJlY3QocG9zaXRpb246IFZlYzIsIHNpemU6IFZlYzIsIHJvdGF0aW9uOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgcmVjdDogYW55ID0ge3Bvc2l0aW9uLCBzaXplfTtcclxuICAgICAgICByZWN0Lmxhc3RQb3NpdGlvbiA9IHBvc2l0aW9uLmNsb25lKCk7XHJcbiAgICAgICAgcmVjdC5zZXRSb3RhdGlvbiA9IChhbmdsZTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJlY3Qucm90YXRpb24gPSBhbmdsZTtcclxuICAgICAgICAgICAgcmVjdC5yaWdodCA9IFZlYzIueEF4aXMoKS5yb3RhdGUoYW5nbGUpO1xyXG4gICAgICAgICAgICByZWN0LnVwID0gVmVjMi55QXhpcygpLnJvdGF0ZShhbmdsZSk7XHJcbiAgICAgICAgICAgIHJlY3QucmlnaHRPZmZzZXQgPSByZWN0LnJpZ2h0Lm11bEYocmVjdC5zaXplLngvMik7XHJcbiAgICAgICAgICAgIHJlY3QudXBPZmZzZXQgPSByZWN0LnVwLm11bEYocmVjdC5zaXplLnkvMik7XHJcbiAgICAgICAgICAgIHJlY3Qucm90YXRpb25NYXRyaXggPSBNYXQzLnJvdGF0ZShyZWN0LnJvdGF0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVjdC5zZXRSb3RhdGlvbihyb3RhdGlvbik7XHJcbiAgICAgICAgcmVjdC5yb3RhdGlvbk1hdHJpeCA9IE1hdDMucm90YXRlKHJlY3Qucm90YXRpb24pO1xyXG4gICAgICAgIHJlY3QudmVsb2NpdHkgPSBWZWMyLnplcm8oKTtcclxuICAgICAgICByZWN0LnJlc3RpdHV0aW9uID0gMTtcclxuICAgICAgICByZWN0LmdyYXZpdHkgPSA1MDA7XHJcbiAgICAgICAgcmVjdC5oYXNDb2xsaXNpb24gPSB0cnVlO1xyXG4gICAgICAgIHJlY3QuYW5jaG9yZWQgPSB0cnVlO1xyXG4gICAgICAgIHJlY3QudHlwZSA9IFwicmVjdFwiO1xyXG4gICAgICAgIHJlY3QuY29sbGlzaW9uID0gbnVsbDtcclxuICAgICAgICB0aGlzLm9iamVjdHMucHVzaChyZWN0KTtcclxuICAgICAgICB0aGlzLm9iamVjdEFkZGVkRXZlbnQuZmlyZShyZWN0KTtcclxuICAgICAgICByZXR1cm4gcmVjdDtcclxuICAgIH1cclxuICAgIGNyZWF0ZUJhbGwocG9zaXRpb246IFZlYzIsIHJhZGl1czogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IGJhbGw6IGFueSA9IHtwb3NpdGlvbiwgcmFkaXVzfTtcclxuICAgICAgICBiYWxsLmxhc3RQb3NpdGlvbiA9IHBvc2l0aW9uLmNsb25lKCk7XHJcbiAgICAgICAgYmFsbC52ZWxvY2l0eSA9IFZlYzIuemVybygpO1xyXG4gICAgICAgIGJhbGwucm90YXRpb25NYXRyaXggPSBNYXQzLm5ldygpO1xyXG4gICAgICAgIGJhbGwubWFzcyA9IDE7XHJcbiAgICAgICAgYmFsbC5yZXN0aXR1dGlvbiA9IDE7XHJcbiAgICAgICAgYmFsbC5ncmF2aXR5ID0gNTAwO1xyXG4gICAgICAgIGJhbGwuaGFzQ29sbGlzaW9uID0gdHJ1ZTtcclxuICAgICAgICBiYWxsLmFuY2hvcmVkID0gZmFsc2U7XHJcbiAgICAgICAgYmFsbC50eXBlID0gXCJiYWxsXCI7XHJcbiAgICAgICAgYmFsbC5jb2xsaXNpb24gPSBudWxsO1xyXG4gICAgICAgIHRoaXMub2JqZWN0cy5wdXNoKGJhbGwpO1xyXG4gICAgICAgIHRoaXMub2JqZWN0QWRkZWRFdmVudC5maXJlKGJhbGwpO1xyXG4gICAgICAgIHJldHVybiBiYWxsO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBmb3IobGV0IG9iaiBvZiB0aGlzLm9iamVjdHMpIHtcclxuICAgICAgICAgICAgb2JqLmNvbGxpc2lvbiA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmKCFvYmouYW5jaG9yZWQpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBvYmoudmVsb2NpdHkgPSBvYmoucG9zaXRpb24uc3ViKG9iai5sYXN0UG9zaXRpb24pLm11bEYoMS9kdCk7XHJcbiAgICAgICAgICAgIG9iai5sYXN0UG9zaXRpb24uc2V0QyhvYmoucG9zaXRpb24ueCwgb2JqLnBvc2l0aW9uLnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IobGV0IGk9MDsgaTwzOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCBvYmogb2YgdGhpcy5vYmplY3RzKSB7XHJcbiAgICAgICAgICAgICAgICBpZihvYmouYW5jaG9yZWQpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaWYoaT09MCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai52ZWxvY2l0eS55IC09IG9iai5ncmF2aXR5ICogZHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLnBvc2l0aW9uLmFkZFNjYWxlZFNlbGYob2JqLnZlbG9jaXR5LCBkdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZihvYmoudHlwZSA9PSBcImJhbGxcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgb2JqMiBvZiB0aGlzLm9iamVjdHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIW9iajIuaGFzQ29sbGlzaW9uKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYob2JqMiA9PSBvYmopIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihvYmoyLnR5cGUgPT0gXCJiYWxsXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb2wgPSBQaHlzaWNzMkQuZ2V0Q2lyY2xlQ2lyY2xlQ29sbGlzaW9uKG9iai5wb3NpdGlvbiwgb2JqLnJhZGl1cywgb2JqMi5wb3NpdGlvbiwgb2JqMi5yYWRpdXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUGh5c2ljczJELnJlc29sdmVDaXJjbGVDaXJjbGVDb2xsaXNpb24ob2JqLCBvYmoyLCBjb2wpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoY29sLmluc2lkZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5jb2xsaXNpb24gPSBjb2w7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqMi5jb2xsaXNpb24gPSBjb2w7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29sID0gUGh5c2ljczJELmdldENpcmNsZVJlY3RDb2xsaXNpb24ob2JqLnBvc2l0aW9uLCBvYmoucmFkaXVzLCBvYmoyLnBvc2l0aW9uLCBvYmoyLnJpZ2h0T2Zmc2V0LCBvYmoyLnVwT2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBoeXNpY3MyRC5yZXNvbHZlQ2lyY2xlQW5jaG9yZWRSZWN0Q29sbGlzaW9uKG9iaiwgb2JqMiwgY29sKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNvbC5pbnNpZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouY29sbGlzaW9uID0gY29sO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iajIuY29sbGlzaW9uID0gY29sO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBFVkVOVCBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGNsYXNzIFNpZ25hbDxUIGV4dGVuZHMgYW55W10+IHtcclxuICAgIGNvbm5lY3Rpb25zOiBDb25uZWN0aW9uPFQ+W10gPSBbXTtcclxuICAgIHRpbWVGaXJlZDogbnVtYmVyID0gLU51bWJlci5NQVhfVkFMVUU7XHJcbiAgICBvbkNvbm5lY3Q/OiAoY29ubjogQ29ubmVjdGlvbjxUPikgPT4gdm9pZDtcclxuICAgIGNvbnN0cnVjdG9yKHtcclxuICAgICAgICBvbkNvbm5lY3QgPSB1bmRlZmluZWQsXHJcbiAgICB9OiB7XHJcbiAgICAgICAgb25Db25uZWN0PzogKGNvbm46IENvbm5lY3Rpb248VD4pID0+IHZvaWQsXHJcbiAgICB9ID0ge30pIHtcclxuICAgICAgICB0aGlzLm9uQ29ubmVjdCA9IG9uQ29ubmVjdDtcclxuICAgIH1cclxuICAgIGNvbm5lY3QoY2FsbGJhY2s6ICguLi5hcmdzOiBUKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgY29uc3QgY29ubiA9IG5ldyBDb25uZWN0aW9uPFQ+KHRoaXMsIGNhbGxiYWNrKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLnB1c2goY29ubik7XHJcbiAgICAgICAgaWYodGhpcy5vbkNvbm5lY3QpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkNvbm5lY3QoY29ubik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb25uO1xyXG4gICAgfVxyXG4gICAgb25jZShjYWxsYmFjazogKC4uLmFyZ3M6IFQpID0+IHZvaWQpIHtcclxuICAgICAgICBjb25zdCBjb25uID0gdGhpcy5jb25uZWN0KCguLi5hcmdzOiBUKSA9PiB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKC4uLmFyZ3MpO1xyXG4gICAgICAgICAgICBjb25uLmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gY29ubjtcclxuICAgIH1cclxuICAgIGFzeW5jIHdhaXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPFQ+KHJlcyA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMub25jZSgoLi4uYXJnczogVCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzKGFyZ3MpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGZpcmUoLi4uYXJnczogVCkge1xyXG4gICAgICAgIHRoaXMudGltZUZpcmVkID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgZm9yKGNvbnN0IGNvbm4gb2YgWy4uLnRoaXMuY29ubmVjdGlvbnNdKSB7XHJcbiAgICAgICAgICAgIGNvbm4uZmlyZSguLi5hcmdzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXRUaW1lU2luY2VGaXJlZCgpIHtcclxuICAgICAgICByZXR1cm4gcGVyZm9ybWFuY2Uubm93KCkgLyAxMDAwIC0gdGhpcy50aW1lRmlyZWQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uPFQgZXh0ZW5kcyBhbnlbXT4ge1xyXG4gICAgZ3JvdXBzOiBDb25uZWN0aW9uR3JvdXBbXSA9IFtdO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHNpZ25hbDogU2lnbmFsPFQ+LCBwdWJsaWMgY2FsbGJhY2s6ICguLi5hcmdzOiBUKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBkaXNjb25uZWN0KCkge1xyXG4gICAgICAgIHRoaXMuc2lnbmFsLmNvbm5lY3Rpb25zLnNwbGljZSh0aGlzLnNpZ25hbC5jb25uZWN0aW9ucy5pbmRleE9mKHRoaXMpLCAxKTtcclxuICAgICAgICBmb3IoY29uc3QgZ3JvdXAgb2YgdGhpcy5ncm91cHMpIHtcclxuICAgICAgICAgICAgZ3JvdXAuY29ubmVjdGlvbnMuc3BsaWNlKGdyb3VwLmNvbm5lY3Rpb25zLmluZGV4T2YodGhpcyksIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdyb3VwcyA9IFtdO1xyXG4gICAgfVxyXG4gICAgZmlyZSguLi5hcmdzOiBUKSB7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFjayguLi5hcmdzKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEh0bWxDb25uZWN0aW9uIHtcclxuICAgIGdyb3VwczogQ29ubmVjdGlvbkdyb3VwW10gPSBbXTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRXZlbnRUYXJnZXQsIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBjYWxsYmFjazogKGU6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLm5hbWUsIHRoaXMuY2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgZGlzY29ubmVjdCgpIHtcclxuICAgICAgICB0aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5uYW1lLCB0aGlzLmNhbGxiYWNrKTtcclxuICAgICAgICBmb3IoY29uc3QgZ3JvdXAgb2YgdGhpcy5ncm91cHMpIHtcclxuICAgICAgICAgICAgZ3JvdXAuY29ubmVjdGlvbnMuc3BsaWNlKGdyb3VwLmNvbm5lY3Rpb25zLmluZGV4T2YodGhpcyksIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdyb3VwcyA9IFtdO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvbkdyb3VwIHtcclxuICAgIGNvbm5lY3Rpb25zOiAoQ29ubmVjdGlvbjxhbnk+IHwgSHRtbENvbm5lY3Rpb24pW10gPSBbXTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuICAgIGFkZChjb25uOiBDb25uZWN0aW9uPGFueT4gfCBIdG1sQ29ubmVjdGlvbikge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMucHVzaChjb25uKTtcclxuICAgIH1cclxuICAgIGRpc2Nvbm5lY3RBbGwoKSB7XHJcbiAgICAgICAgZm9yKGNvbnN0IGNvbm4gb2YgWy4uLnRoaXMuY29ubmVjdGlvbnNdKSB7XHJcbiAgICAgICAgICAgIGNvbm4uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zID0gW107XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgV0VCR0wyIFNIQURFUiBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgY2xhc3MgV0dMMkNvbXBvbmVudFNoYWRlciB7XHJcbiAgICB3U2hhZGVyOiBXZWJHTFNoYWRlcjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCwgcHVibGljIHR5cGU6IFwidmVydGV4XCIgfCBcImZyYWdtZW50XCIsIHB1YmxpYyBzb3VyY2U6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHdTaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIodHlwZSA9PSBcInZlcnRleFwiID8gZ2wuVkVSVEVYX1NIQURFUiA6IGdsLkZSQUdNRU5UX1NIQURFUik7XHJcbiAgICAgICAgaWYod1NoYWRlciA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBjcmVhdGUgc2hhZGVyXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLndTaGFkZXIgPSB3U2hhZGVyO1xyXG4gICAgICAgIGdsLnNoYWRlclNvdXJjZSh3U2hhZGVyLCBzb3VyY2UpO1xyXG4gICAgICAgIGdsLmNvbXBpbGVTaGFkZXIod1NoYWRlcilcclxuICAgICAgICBpZighZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHdTaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSkge1xyXG4gICAgICAgICAgICBjb25zdCBsb2cgPSBnbC5nZXRTaGFkZXJJbmZvTG9nKHdTaGFkZXIpO1xyXG4gICAgICAgICAgICBnbC5kZWxldGVTaGFkZXIod1NoYWRlcik7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBjb21waWxlIHNoYWRlcjogXCIgKyBsb2cpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGRlbGV0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdsLmRlbGV0ZVNoYWRlcih0aGlzLndTaGFkZXIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMkNvbXBvbmVudFByb2dyYW0ge1xyXG4gICAgd1Byb2dyYW06IFdlYkdMUHJvZ3JhbTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCwgcHVibGljIGNTaGFkZXJWOiBXR0wyQ29tcG9uZW50U2hhZGVyLCBwdWJsaWMgY1NoYWRlckY6IFdHTDJDb21wb25lbnRTaGFkZXIpIHtcclxuICAgICAgICBjb25zdCB3UHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcclxuICAgICAgICBpZiAoIXdQcm9ncmFtKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBjcmVhdGUgcHJvZ3JhbVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy53UHJvZ3JhbSA9IHdQcm9ncmFtO1xyXG4gICAgICAgIGdsLmF0dGFjaFNoYWRlcih3UHJvZ3JhbSwgY1NoYWRlclYud1NoYWRlcik7XHJcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKHdQcm9ncmFtLCBjU2hhZGVyRi53U2hhZGVyKTtcclxuICAgICAgICBnbC5saW5rUHJvZ3JhbSh3UHJvZ3JhbSk7XHJcbiAgICAgICAgaWYoIWdsLmdldFByb2dyYW1QYXJhbWV0ZXIod1Byb2dyYW0sIGdsLkxJTktfU1RBVFVTKSkge1xyXG4gICAgICAgICAgICBjb25zdCBsb2cgPSBnbC5nZXRQcm9ncmFtSW5mb0xvZyh3UHJvZ3JhbSk7XHJcbiAgICAgICAgICAgIGdsLmRlbGV0ZVByb2dyYW0od1Byb2dyYW0pO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gbGluayBwcm9ncmFtOiBcIiArIGxvZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2V0QWN0aXZlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSh0aGlzLndQcm9ncmFtKTtcclxuICAgIH1cclxuICAgIGRlbGV0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdsLmRlbGV0ZVByb2dyYW0odGhpcy53UHJvZ3JhbSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIFdHTDJBdHRyaWJ1dGVUeXBlID0gKFxyXG4gICAgXCJmbG9hdFwiIHwgXCJpbnRcIiB8IFwidWludFwiIHwgXCJ2ZWMyXCIgfCBcInZlYzNcIiB8IFwidmVjNFwiXHJcbiAgICB8IFwiaXZlYzJcIiB8IFwiaXZlYzNcIiB8IFwiaXZlYzRcIiB8IFwidXZlYzJcIiB8IFwidXZlYzNcIiB8IFwidXZlYzRcIlxyXG4pO1xyXG5cclxuZXhwb3J0IHR5cGUgV0dMMlVuaWZvcm1UeXBlID0gKFxyXG4gICAgXCJmbG9hdFwiIHwgXCJpbnRcIiB8IFwidWludFwiIHwgXCJ2ZWMyXCIgfCBcInZlYzNcIlxyXG4gICAgfCBcInZlYzRcIiB8IFwiaXZlYzJcIiB8IFwiaXZlYzNcIiB8IFwiaXZlYzRcIiB8IFwidXZlYzJcIlxyXG4gICAgfCBcInV2ZWMzXCIgfCBcInV2ZWM0XCIgfCBcIm1hdDJcIiB8IFwibWF0M1wiIHwgXCJtYXQ0XCJcclxuKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBXR0wyQ29tcG9uZW50QnVmZmVyIHtcclxuICAgIHdUeXBlOiBHTGVudW07XHJcbiAgICB3RGltZW5zaW9uczogbnVtYmVyO1xyXG4gICAgd0J1ZmZlcjogV2ViR0xCdWZmZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsIHR5cGU6IFdHTDJBdHRyaWJ1dGVUeXBlKSB7XHJcbiAgICAgICAgY29uc3QgYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICAgICAgaWYoIWJ1ZmZlcikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gY3JlYXRlIGJ1ZmZlclwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy53QnVmZmVyID0gYnVmZmVyO1xyXG4gICAgICAgIHN3aXRjaCh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJmbG9hdFwiOiB0aGlzLndUeXBlID0gZ2wuRkxPQVQ7IHRoaXMud0RpbWVuc2lvbnMgPSAxOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInZlYzJcIjogdGhpcy53VHlwZSA9IGdsLkZMT0FUOyB0aGlzLndEaW1lbnNpb25zID0gMjsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ2ZWMzXCI6IHRoaXMud1R5cGUgPSBnbC5GTE9BVDsgdGhpcy53RGltZW5zaW9ucyA9IDM7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidmVjNFwiOiB0aGlzLndUeXBlID0gZ2wuRkxPQVQ7IHRoaXMud0RpbWVuc2lvbnMgPSA0OyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImludFwiOiB0aGlzLndUeXBlID0gZ2wuSU5UOyB0aGlzLndEaW1lbnNpb25zID0gMTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpdmVjMlwiOiB0aGlzLndUeXBlID0gZ2wuSU5UOyB0aGlzLndEaW1lbnNpb25zID0gMjsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpdmVjM1wiOiB0aGlzLndUeXBlID0gZ2wuSU5UOyB0aGlzLndEaW1lbnNpb25zID0gMzsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpdmVjNFwiOiB0aGlzLndUeXBlID0gZ2wuSU5UOyB0aGlzLndEaW1lbnNpb25zID0gNDsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1aW50XCI6IHRoaXMud1R5cGUgPSBnbC5VTlNJR05FRF9JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSAxOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInV2ZWMyXCI6IHRoaXMud1R5cGUgPSBnbC5VTlNJR05FRF9JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSAyOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInV2ZWMzXCI6IHRoaXMud1R5cGUgPSBnbC5VTlNJR05FRF9JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSAzOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInV2ZWM0XCI6IHRoaXMud1R5cGUgPSBnbC5VTlNJR05FRF9JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSA0OyBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKFwiVW5zdXBwb3J0ZWQgYnVmZmVyIHR5cGU6IFwiICsgdHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2V0QWN0aXZlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdGhpcy53QnVmZmVyKTtcclxuICAgIH1cclxuICAgIGRlbGV0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdsLmRlbGV0ZUJ1ZmZlcih0aGlzLndCdWZmZXIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMkNvbXBvbmVudFZhbyB7XHJcbiAgICB3VmFvOiBXZWJHTFZlcnRleEFycmF5T2JqZWN0O1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy53VmFvID0gZ2wuY3JlYXRlVmVydGV4QXJyYXkoKTtcclxuICAgIH1cclxuICAgIHNldEFjdGl2ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdsLmJpbmRWZXJ0ZXhBcnJheSh0aGlzLndWYW8pO1xyXG4gICAgfVxyXG4gICAgZW5hYmxlQnVmZmVyKGNCdWZmZXI6IFdHTDJDb21wb25lbnRCdWZmZXIsIHdMb2NhdGlvbjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgY0J1ZmZlci5zZXRBY3RpdmUoKTtcclxuICAgICAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHdMb2NhdGlvbik7XHJcbiAgICAgICAgaWYoY0J1ZmZlci53VHlwZSA9PSB0aGlzLmdsLkZMT0FUKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcih3TG9jYXRpb24sIGNCdWZmZXIud0RpbWVuc2lvbnMsIGNCdWZmZXIud1R5cGUsIGZhbHNlLCAwLCAwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmdsLnZlcnRleEF0dHJpYklQb2ludGVyKHdMb2NhdGlvbiwgY0J1ZmZlci53RGltZW5zaW9ucywgY0J1ZmZlci53VHlwZSwgMCwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZGVsZXRlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2wuZGVsZXRlVmVydGV4QXJyYXkodGhpcy53VmFvKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJDb21wb25lbnRVbmlmb3JtIHtcclxuICAgIHdMb2NhdGlvbjogV2ViR0xVbmlmb3JtTG9jYXRpb247XHJcbiAgICBxdWV1ZWRWYWx1ZXM6IGFueVtdIHwgYW55IHwgbnVsbCA9IG51bGw7XHJcbiAgICBoYXNRdWV1ZWQgPSBmYWxzZTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCwgY1Byb2dyYW06IFdHTDJDb21wb25lbnRQcm9ncmFtLCBuYW1lOiBzdHJpbmcsIHB1YmxpYyB0eXBlOiBXR0wyVW5pZm9ybVR5cGUpIHtcclxuICAgICAgICBjb25zdCB3TG9jYXRpb24gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbihjUHJvZ3JhbS53UHJvZ3JhbSwgbmFtZSk7XHJcbiAgICAgICAgaWYod0xvY2F0aW9uID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBnZXQgdW5pZm9ybSBsb2NhdGlvbiBmb3IgXCIgKyBuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy53TG9jYXRpb24gPSB3TG9jYXRpb247XHJcbiAgICB9XHJcbiAgICBzZXRWYWx1ZXModmFsdWVzIDogYW55W10gfCBhbnkpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB3TG9jYXRpb24gPSB0aGlzLndMb2NhdGlvblxyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICBzd2l0Y2godGhpcy50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJmbG9hdFwiOiBnbC51bmlmb3JtMWYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInZlYzJcIjogZ2wudW5pZm9ybTJmdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidmVjM1wiOiBnbC51bmlmb3JtM2Z2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ2ZWM0XCI6IGdsLnVuaWZvcm00ZnYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImludFwiOiBnbC51bmlmb3JtMWkod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIml2ZWMyXCI6IGdsLnVuaWZvcm0yaXYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIml2ZWMzXCI6IGdsLnVuaWZvcm0zaXYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIml2ZWM0XCI6IGdsLnVuaWZvcm00aXYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInVpbnRcIjogZ2wudW5pZm9ybTF1aSh3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXZlYzJcIjogZ2wudW5pZm9ybTJ1aXYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInV2ZWMzXCI6IGdsLnVuaWZvcm0zdWl2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1dmVjNFwiOiBnbC51bmlmb3JtNHVpdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWF0MlwiOiBnbC51bmlmb3JtTWF0cml4MmZ2KHdMb2NhdGlvbiwgZmFsc2UsIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWF0M1wiOiBnbC51bmlmb3JtTWF0cml4M2Z2KHdMb2NhdGlvbiwgZmFsc2UsIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWF0NFwiOiBnbC51bmlmb3JtTWF0cml4NGZ2KHdMb2NhdGlvbiwgZmFsc2UsIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoXCJVbnN1cHBvcnRlZCB1bmlmb3JtIHR5cGU6IFwiICsgdGhpcy50eXBlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBxdWV1ZVZhbHVlcyh2YWx1ZXM6IGFueVtdIHwgYW55KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5oYXNRdWV1ZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucXVldWVkVmFsdWVzID0gdmFsdWVzO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIGlmKCF0aGlzLmhhc1F1ZXVlZCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuaGFzUXVldWVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZXModGhpcy5xdWV1ZWRWYWx1ZXMpO1xyXG4gICAgICAgIHRoaXMucXVldWVkVmFsdWVzID0gbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJBdHRyaWJ1dGUge1xyXG4gICAgd0xvY2F0aW9uOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsIHB1YmxpYyB3UHJvZ3JhbTogV2ViR0xQcm9ncmFtLCBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgdHlwZTogV0dMMkF0dHJpYnV0ZVR5cGUpIHtcclxuICAgICAgICB0aGlzLndMb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHdQcm9ncmFtLCBuYW1lKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJUZXh0dXJlMkQge1xyXG4gICAgd1RleHR1cmU6IFdlYkdMVGV4dHVyZTtcclxuICAgIHVuaWZvcm06IFdHTDJDb21wb25lbnRVbmlmb3JtO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHNoYWRlcjogV0dMMlNoYWRlciwgcHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIHNsb3Q6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMud1RleHR1cmUgPSBzaGFkZXIuZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgdGhpcy51bmlmb3JtID0gc2hhZGVyLmNyZWF0ZVVuaWZvcm0obmFtZSwgXCJpbnRcIik7XHJcbiAgICAgICAgdGhpcy51bmlmb3JtLnNldFZhbHVlcyh0aGlzLnNsb3QpO1xyXG4gICAgfVxyXG4gICAgc2V0QWN0aXZlKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIHRoaXMuc2xvdCk7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy53VGV4dHVyZSk7XHJcbiAgICB9XHJcbiAgICBzZXRJbnRlcnBvbGF0aW9uKGlzRW5hYmxlZDogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBpc0VuYWJsZWQgPyBnbC5MSU5FQVIgOiBnbC5ORUFSRVNUKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgaXNFbmFibGVkID8gZ2wuTElORUFSIDogZ2wuTkVBUkVTVCk7XHJcbiAgICB9XHJcbiAgICBzZXRSZXBlYXQoaXNFbmFibGVkOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgaXNFbmFibGVkID8gZ2wuUkVQRUFUIDogZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgaXNFbmFibGVkID8gZ2wuUkVQRUFUIDogZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICB9XHJcbiAgICBzZXREYXRhKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBkYXRhOiBBcnJheUJ1ZmZlclZpZXcgfCBudWxsID0gbnVsbCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCB3aWR0aCwgaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBkYXRhKTtcclxuICAgIH1cclxuICAgIHNldEltYWdlKGltYWdlOiBUZXhJbWFnZVNvdXJjZSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBpbWFnZSk7XHJcbiAgICB9XHJcbiAgICBnZW5lcmF0ZU1pcG1hcCgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wuZGVsZXRlVGV4dHVyZSh0aGlzLndUZXh0dXJlKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJUZXh0dXJlM0Qge1xyXG4gICAgd1RleHR1cmU6IFdlYkdMVGV4dHVyZTtcclxuICAgIHVuaWZvcm06IFdHTDJDb21wb25lbnRVbmlmb3JtO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHNoYWRlcjogV0dMMlNoYWRlciwgcHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIHNsb3Q6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMud1RleHR1cmUgPSBzaGFkZXIuZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgdGhpcy51bmlmb3JtID0gc2hhZGVyLmNyZWF0ZVVuaWZvcm0obmFtZSwgXCJpbnRcIik7XHJcbiAgICAgICAgdGhpcy51bmlmb3JtLnNldFZhbHVlcyh0aGlzLnNsb3QpO1xyXG4gICAgfVxyXG4gICAgc2V0QWN0aXZlKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIHRoaXMuc2xvdCk7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8zRCwgdGhpcy53VGV4dHVyZSk7XHJcbiAgICB9XHJcbiAgICBzZXRJbnRlcnBvbGF0aW9uKGlzRW5hYmxlZDogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8zRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBpc0VuYWJsZWQgPyBnbC5MSU5FQVIgOiBnbC5ORUFSRVNUKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfM0QsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgaXNFbmFibGVkID8gZ2wuTElORUFSIDogZ2wuTkVBUkVTVCk7XHJcbiAgICB9XHJcbiAgICBzZXRSZXBlYXQoaXNFbmFibGVkOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzNELCBnbC5URVhUVVJFX1dSQVBfUywgaXNFbmFibGVkID8gZ2wuUkVQRUFUIDogZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzNELCBnbC5URVhUVVJFX1dSQVBfVCwgaXNFbmFibGVkID8gZ2wuUkVQRUFUIDogZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICB9XHJcbiAgICBzZXREYXRhKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBkZXB0aDogbnVtYmVyLCBkYXRhOiBBcnJheUJ1ZmZlclZpZXcgfCBudWxsID0gbnVsbCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wudGV4SW1hZ2UzRChnbC5URVhUVVJFXzNELCAwLCBnbC5SR0JBLCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCwgMCwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgZGF0YSk7XHJcbiAgICB9XHJcbiAgICBnZW5lcmF0ZU1pcG1hcCgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfM0QpO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wuZGVsZXRlVGV4dHVyZSh0aGlzLndUZXh0dXJlKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJPYmplY3Qge1xyXG4gICAgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQ7XHJcbiAgICBjVmFvOiBXR0wyQ29tcG9uZW50VmFvO1xyXG4gICAgY0J1ZmZlckJ5TmFtZToge1trZXk6c3RyaW5nXTogV0dMMkNvbXBvbmVudEJ1ZmZlcn0gPSB7fTtcclxuICAgIHZlcnRleENvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHNoYWRlcjogV0dMMlNoYWRlcikge1xyXG4gICAgICAgIHRoaXMuZ2wgPSBzaGFkZXIuZ2w7XHJcbiAgICAgICAgdGhpcy5jVmFvID0gbmV3IFdHTDJDb21wb25lbnRWYW8oc2hhZGVyLmdsKTtcclxuICAgICAgICB0aGlzLmNWYW8uc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgZm9yKGNvbnN0IGF0dHJpYnV0ZSBvZiBzaGFkZXIuYXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICBjb25zdCBjQnVmID0gbmV3IFdHTDJDb21wb25lbnRCdWZmZXIoc2hhZGVyLmdsLCBhdHRyaWJ1dGUudHlwZSk7XHJcbiAgICAgICAgICAgIGNCdWYuc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY1Zhby5lbmFibGVCdWZmZXIoY0J1ZiwgYXR0cmlidXRlLndMb2NhdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuY0J1ZmZlckJ5TmFtZVthdHRyaWJ1dGUubmFtZV0gPSBjQnVmO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNldERhdGEoYXR0cmlidXRlTmFtZTogc3RyaW5nLCB2YWx1ZXM6IEZsb2F0MzJBcnJheSwgdXNhZ2U6IEdMZW51bSA9IHRoaXMuZ2wuU1RBVElDX0RSQVcpIHtcclxuICAgICAgICBjb25zdCBjQnVmID0gdGhpcy5jQnVmZmVyQnlOYW1lW2F0dHJpYnV0ZU5hbWVdO1xyXG4gICAgICAgIGlmKGNCdWYgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgZmluZCBhdHRyaWJ1dGUgd2l0aCBuYW1lOiBcIiArIGF0dHJpYnV0ZU5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjQnVmLnNldEFjdGl2ZSgpO1xyXG4gICAgICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdmFsdWVzLCB1c2FnZSk7XHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhDb3VudCA9IHZhbHVlcy5sZW5ndGggLyBjQnVmLndEaW1lbnNpb25zO1xyXG4gICAgfVxyXG4gICAgZHJhd1RyaWFuZ2xlcygpIHtcclxuICAgICAgICB0aGlzLmNWYW8uc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgdGhpcy5nbC5kcmF3QXJyYXlzKHRoaXMuZ2wuVFJJQU5HTEVTLCAwLCB0aGlzLnZlcnRleENvdW50KTtcclxuICAgIH1cclxuICAgIGRyYXdMaW5lcygpIHtcclxuICAgICAgICB0aGlzLmNWYW8uc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgdGhpcy5nbC5kcmF3QXJyYXlzKHRoaXMuZ2wuTElORVMsIDAsIHRoaXMudmVydGV4Q291bnQpO1xyXG4gICAgfVxyXG4gICAgZHJhd1BvaW50cygpIHtcclxuICAgICAgICB0aGlzLmNWYW8uc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgdGhpcy5nbC5kcmF3QXJyYXlzKHRoaXMuZ2wuUE9JTlRTLCAwLCB0aGlzLnZlcnRleENvdW50KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJTaGFkZXIge1xyXG4gICAgY1Byb2dyYW06IFdHTDJDb21wb25lbnRQcm9ncmFtO1xyXG4gICAgYXR0cmlidXRlczogV0dMMkF0dHJpYnV0ZVtdID0gW107XHJcbiAgICBjVW5pZm9ybXM6IFdHTDJDb21wb25lbnRVbmlmb3JtW10gPSBbXVxyXG4gICAgY1VuaWZvcm1CeU5hbWU6IHtba2V5OnN0cmluZ106V0dMMkNvbXBvbmVudFVuaWZvcm19ID0ge307XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsIHZTb3VyY2U6IHN0cmluZywgZlNvdXJjZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5jUHJvZ3JhbSA9IG5ldyBXR0wyQ29tcG9uZW50UHJvZ3JhbShcclxuICAgICAgICAgICAgZ2wsIG5ldyBXR0wyQ29tcG9uZW50U2hhZGVyKGdsLCBcInZlcnRleFwiLCB2U291cmNlKSxcclxuICAgICAgICAgICAgbmV3IFdHTDJDb21wb25lbnRTaGFkZXIoZ2wsIFwiZnJhZ21lbnRcIiwgZlNvdXJjZSksXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLmNQcm9ncmFtLnNldEFjdGl2ZSgpO1xyXG4gICAgfVxyXG4gICAgYWRkQXR0cmlidXRlKG5hbWU6IHN0cmluZywgdHlwZTogV0dMMkF0dHJpYnV0ZVR5cGUpIHtcclxuICAgICAgICBjb25zdCBhdHQgPSBuZXcgV0dMMkF0dHJpYnV0ZSh0aGlzLmdsLCB0aGlzLmNQcm9ncmFtLndQcm9ncmFtLCBuYW1lLCB0eXBlKTtcclxuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMucHVzaChhdHQpO1xyXG4gICAgICAgIHJldHVybiBhdHQ7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVVbmlmb3JtKG5hbWU6IHN0cmluZywgdHlwZTogV0dMMlVuaWZvcm1UeXBlKSB7XHJcbiAgICAgICAgY29uc3QgdW5pZm9ybSA9IG5ldyBXR0wyQ29tcG9uZW50VW5pZm9ybSh0aGlzLmdsLCB0aGlzLmNQcm9ncmFtLCBuYW1lLCB0eXBlKTtcclxuICAgICAgICB0aGlzLmNVbmlmb3Jtcy5wdXNoKHVuaWZvcm0pO1xyXG4gICAgICAgIHRoaXMuY1VuaWZvcm1CeU5hbWVbbmFtZV0gPSB1bmlmb3JtO1xyXG4gICAgICAgIHJldHVybiB1bmlmb3JtO1xyXG4gICAgfVxyXG4gICAgZ2V0VW5pZm9ybShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jVW5pZm9ybUJ5TmFtZVtuYW1lXTtcclxuICAgIH1cclxuICAgIGNyZWF0ZU9iamVjdCgpIHtcclxuICAgICAgICBjb25zdCBvYmogPSBuZXcgV0dMMk9iamVjdCh0aGlzKTtcclxuICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlVGV4dHVyZTJEKG5hbWU6IHN0cmluZywgc2xvdDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgdGV4dHVyZSA9IG5ldyBXR0wyVGV4dHVyZTJEKHRoaXMsIG5hbWUsIHNsb3QpO1xyXG4gICAgICAgIHJldHVybiB0ZXh0dXJlO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlVGV4dHVyZTNEKG5hbWU6IHN0cmluZywgc2xvdDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgdGV4dHVyZSA9IG5ldyBXR0wyVGV4dHVyZTNEKHRoaXMsIG5hbWUsIHNsb3QpO1xyXG4gICAgICAgIHJldHVybiB0ZXh0dXJlO1xyXG4gICAgfVxyXG4gICAgc2V0QWN0aXZlKCkge1xyXG4gICAgICAgIHRoaXMuY1Byb2dyYW0uc2V0QWN0aXZlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIFRFWFRVUkUgQVRMQVMgQ0xBU1MgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgdHlwZSBBdGxhc0ltYWdlID0ge3g6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlciwgaW1nOiBIVE1MSW1hZ2VFbGVtZW50LCBuYW1lOiBzdHJpbmd9O1xyXG5cclxuZXhwb3J0IGNsYXNzIFRleHR1cmVBdGxhcyB7XHJcbiAgICB3aWR0aDogbnVtYmVyO1xyXG4gICAgaGVpZ2h0OiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnQsIHB1YmxpYyBib3VuZHM6IHtbbmFtZTpzdHJpbmddOiBBdGxhc0ltYWdlfSkge1xyXG4gICAgICAgIHRoaXMud2lkdGggPSBpbWFnZS5uYXR1cmFsV2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBpbWFnZS5uYXR1cmFsSGVpZ2h0O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGZyb21VcmxzKGFyZ3M6IFtuYW1lOnN0cmluZywgdXJsOnN0cmluZ11bXSwgcGFkZGluZyA9IDApIHtcclxuICAgICAgICBsZXQgaW1hZ2VzOiBBdGxhc0ltYWdlW10gPSBbXTtcclxuICAgICAgICBsZXQgcHJvbWlzZXM6IFByb21pc2U8dm9pZD5bXSA9IFtdO1xyXG4gICAgICAgIGxldCBhdGxhc1NpemUgPSAwO1xyXG4gICAgICAgIGZvcihsZXQgW25hbWUsIHVybF0gb2YgYXJncykge1xyXG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKG5ldyBQcm9taXNlPHZvaWQ+KGFzeW5jIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXRhOiBBdGxhc0ltYWdlID0ge2ltZywgeDowLCB5OjAsIHc6aW1nLm5hdHVyYWxXaWR0aCsyKnBhZGRpbmcsIGg6aW1nLm5hdHVyYWxIZWlnaHQrMipwYWRkaW5nLCBuYW1lfTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXNDb2xsaWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgeD0wO3g8PWF0bGFzU2l6ZS1kYXRhLnc7eCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgeT0wO3k8PWF0bGFzU2l6ZS1kYXRhLmg7eSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbGxpZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBvdGhlciBvZiBpbWFnZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih4ICsgZGF0YS53ID4gb3RoZXIueCAmJiB5ICsgZGF0YS5oID4gb3RoZXIueSAmJiB4IDwgb3RoZXIueCArIG90aGVyLncgJiYgeSA8IG90aGVyLnkgKyBvdGhlci5oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29sbGlkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWlzQ29sbGlkaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS54ID0geDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnkgPSB5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFpc0NvbGxpZGluZykgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGlzQ29sbGlkaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEueCA9IGF0bGFzU2l6ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS55ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXRsYXNTaXplID0gZGF0YS54ICsgZGF0YS53O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpbWFnZXMucHVzaChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICByZXMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGltZy5zcmMgPSB1cmw7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xyXG4gICAgICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICAgIGNhbnZhcy53aWR0aCA9IGF0bGFzU2l6ZTtcclxuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gYXRsYXNTaXplO1xyXG4gICAgICAgIGxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpITtcclxuICAgICAgICBsZXQgYm91bmRzOiB7W25hbWU6c3RyaW5nXTogQXRsYXNJbWFnZX0gPSB7fTtcclxuICAgICAgICBmb3IobGV0IGltZyBvZiBpbWFnZXMpIHtcclxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCBpbWcueCArIHBhZGRpbmcsIGltZy55ICsgcGFkZGluZyk7XHJcbiAgICAgICAgICAgIGlmKHBhZGRpbmcgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgMCwgMCwgMSwgaW1nLmgtMipwYWRkaW5nLCBpbWcueCwgaW1nLnkgKyBwYWRkaW5nLCBwYWRkaW5nLCBpbWcuaC0yKnBhZGRpbmcpOyAvLyBsZWZ0XHJcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZy5pbWcsIGltZy53LTIqcGFkZGluZy0xLCAwLCAxLCBpbWcuaC0yKnBhZGRpbmcsIGltZy54K2ltZy53LXBhZGRpbmcsIGltZy55ICsgcGFkZGluZywgcGFkZGluZywgaW1nLmgtMipwYWRkaW5nKTsgLy8gcmlnaHRcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgMCwgMCwgaW1nLnctMipwYWRkaW5nLCAxLCBpbWcueCArIHBhZGRpbmcsIGltZy55LCBpbWcudy0yKnBhZGRpbmcsIHBhZGRpbmcpOyAvLyB0b3BcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgMCwgaW1nLmgtMipwYWRkaW5nLTEsIGltZy53LTIqcGFkZGluZywgMSwgaW1nLnggKyBwYWRkaW5nLCBpbWcueStpbWcuaC1wYWRkaW5nLCBpbWcudy0yKnBhZGRpbmcsIHBhZGRpbmcpOyAvLyBib3R0b21cclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgMCwgMCwgMiwgMiwgaW1nLngsIGltZy55LCBwYWRkaW5nLCBwYWRkaW5nKTsgLy8gdG9wLWxlZnRcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgaW1nLnctMipwYWRkaW5nLTIsIDAsIDIsIDIsIGltZy54K2ltZy53LXBhZGRpbmcsIGltZy55LCBwYWRkaW5nLCBwYWRkaW5nKTsgLy8gdG9wLXJpZ2h0XHJcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZy5pbWcsIDAsIGltZy5oLTIqcGFkZGluZy0yLCAyLCAyLCBpbWcueCwgaW1nLnkraW1nLmgtcGFkZGluZywgcGFkZGluZywgcGFkZGluZyk7IC8vIGJvdHRvbS1sZWZ0XHJcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZy5pbWcsIGltZy53LTIqcGFkZGluZy0yLCBpbWcuaC0yKnBhZGRpbmctMiwgMiwgMiwgaW1nLngraW1nLnctcGFkZGluZywgaW1nLnkraW1nLmgtcGFkZGluZywgcGFkZGluZywgcGFkZGluZyk7IC8vIGJvdHRvbS1yaWdodFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGltZy54ID0gKGltZy54ICsgcGFkZGluZykgLyBhdGxhc1NpemU7XHJcbiAgICAgICAgICAgIGltZy55ID0gKGltZy55ICsgcGFkZGluZykgLyBhdGxhc1NpemU7XHJcbiAgICAgICAgICAgIGltZy53ID0gKGltZy53IC0gMipwYWRkaW5nKSAvIGF0bGFzU2l6ZTtcclxuICAgICAgICAgICAgaW1nLmggPSAoaW1nLmggLSAyKnBhZGRpbmcpIC8gYXRsYXNTaXplO1xyXG4gICAgICAgICAgICBib3VuZHNbaW1nLm5hbWVdID0gaW1nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdXJsID0gY2FudmFzLnRvRGF0YVVSTCgpO1xyXG4gICAgICAgIGNvbnN0IGF0bGFzSW1hZ2UgPSBhd2FpdCBuZXcgUHJvbWlzZTxIVE1MSW1hZ2VFbGVtZW50PihyZXMgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXMoaW1nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbWcuc3JjID0gdXJsO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBuZXcgVGV4dHVyZUF0bGFzKGF0bGFzSW1hZ2UsIGJvdW5kcyk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBDT0xPUiBDTEFTUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vKipcclxuICogUmVwcmVzZW50cyBhIGNvbG9yIGFuZCBhIHRyYW5zcGFyZW5jeSB2YWx1ZS4gSW1wbGVtZW50cyBsYXp5IGNvbnZlcnNpb24gYmV0d2VlbiBSR0IgYW5kIEhTViBzcGFjZS5cclxuKi9cclxuZXhwb3J0IGNsYXNzIENvbG9yIHtcclxuICAgIGNvbnN0cnVjdG9yKCk7XHJcbiAgICBjb25zdHJ1Y3RvcihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyKTtcclxuICAgIGNvbnN0cnVjdG9yKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIsIGE6IG51bWJlcik7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb2xvcjogc3RyaW5nIHwgQ29sb3IpO1xyXG4gICAgY29uc3RydWN0b3IoYXJnQT86IG51bWJlciB8IHN0cmluZyB8IENvbG9yLCBhcmdCPzogbnVtYmVyLCBhcmdDPzogbnVtYmVyLCBhcmdEPzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYodHlwZW9mIGFyZ0EgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgbGV0IGNvbXAgPSBhcmdBLnNwbGl0KFwiKFwiKTtcclxuICAgICAgICAgICAgaWYoY29tcC5sZW5ndGggPT0gMClcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgY29uc3RydWN0b3I6IEVtcHR5IHN0cmluZ1wiKTtcclxuICAgICAgICAgICAgaWYoY29tcC5sZW5ndGggPCAyKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciBjb25zdHJ1Y3RvcjogXCIgKyBjb21wWzBdKTtcclxuICAgICAgICAgICAgbGV0IGNzdHJ1Y3QgPSBjb21wWzBdO1xyXG4gICAgICAgICAgICBsZXQgY3BhcmFtID0gY29tcFsxXSEucmVwbGFjZShcIilcIiwgXCJcIik7XHJcbiAgICAgICAgICAgIGlmKGNzdHJ1Y3QgPT09IFwicmdiXCIgfHwgY3N0cnVjdCA9PT0gXCJyZ2JhXCIpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYXJncyA9IGNwYXJhbS5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgICAgICBpZihjYXJncy5sZW5ndGggPCAzIHx8IGNhcmdzLmxlbmd0aCA+IDQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciBhcmd1bWVudCBjb3VudDogXCIgKyBjYXJncy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHIgPSBwYXJzZUludChjYXJnc1swXSEpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGcgPSBwYXJzZUludChjYXJnc1sxXSEpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGIgPSBwYXJzZUludChjYXJnc1syXSEpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGEgPSBjYXJnc1szXSA/IHBhcnNlRmxvYXQoY2FyZ3NbM10hKSA6IDE7XHJcbiAgICAgICAgICAgICAgICBpZihpc05hTihyKSkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciB2YWx1ZTogXCIgKyBjYXJnc1swXSk7XHJcbiAgICAgICAgICAgICAgICBpZihpc05hTihnKSkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciB2YWx1ZTogXCIgKyBjYXJnc1sxXSk7XHJcbiAgICAgICAgICAgICAgICBpZihpc05hTihiKSkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciB2YWx1ZTogXCIgKyBjYXJnc1syXSk7XHJcbiAgICAgICAgICAgICAgICBpZihpc05hTihhKSkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciB2YWx1ZTogXCIgKyBjYXJnc1szXSk7XHJcbiAgICAgICAgICAgICAgICByID0gRU1hdGguY2xhbXAoTWF0aC5yb3VuZChyKSwgMCwgMjU1KTtcclxuICAgICAgICAgICAgICAgIGcgPSBFTWF0aC5jbGFtcChNYXRoLnJvdW5kKGcpLCAwLCAyNTUpO1xyXG4gICAgICAgICAgICAgICAgYiA9IEVNYXRoLmNsYW1wKE1hdGgucm91bmQoYiksIDAsIDI1NSk7XHJcbiAgICAgICAgICAgICAgICBhID0gRU1hdGguY2xhbXAoYSwgMCwgMSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yID0gcjtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2cgPSBnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYiA9IGI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSZ2IgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX291dGRhdGVkSHN2ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmKGNzdHJ1Y3QgPT09IFwiaHN2XCIgfHwgY3N0cnVjdCA9PT0gXCJoc3ZhXCIpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYXJncyA9IGNwYXJhbS5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgICAgICBpZihjYXJncy5sZW5ndGggPCAzIHx8IGNhcmdzLmxlbmd0aCA+IDQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciBhcmd1bWVudCBjb3VudDogXCIgKyBjYXJncy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGg6IG51bWJlcjtcclxuICAgICAgICAgICAgICAgIGlmKGNhcmdzWzBdIS5pbmNsdWRlcyhcInJhZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGggPSBwYXJzZUZsb2F0KGNhcmdzWzBdISkgKiAxODAgLyBNYXRoLlBJO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBoID0gcGFyc2VJbnQoY2FyZ3NbMF0hKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCBzID0gcGFyc2VJbnQoY2FyZ3NbMV0hKTtcclxuICAgICAgICAgICAgICAgIGxldCB2ID0gcGFyc2VJbnQoY2FyZ3NbMl0hKTtcclxuICAgICAgICAgICAgICAgIGxldCBhID0gY2FyZ3NbM10gPyBwYXJzZUludChjYXJnc1szXSEpIDogMTtcclxuICAgICAgICAgICAgICAgIGlmKGlzTmFOKGgpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIHZhbHVlOiBcIiArIGNhcmdzWzBdKTtcclxuICAgICAgICAgICAgICAgIGlmKGlzTmFOKHMpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIHZhbHVlOiBcIiArIGNhcmdzWzFdKTtcclxuICAgICAgICAgICAgICAgIGlmKGlzTmFOKHYpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIHZhbHVlOiBcIiArIGNhcmdzWzJdKTtcclxuICAgICAgICAgICAgICAgIGlmKGlzTmFOKGEpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIHZhbHVlOiBcIiArIGNhcmdzWzNdKTtcclxuICAgICAgICAgICAgICAgIGggPSBFTWF0aC5wbW9kKGgsIDM2MCk7XHJcbiAgICAgICAgICAgICAgICBzID0gRU1hdGguY2xhbXAocywgMCwgMTAwKTtcclxuICAgICAgICAgICAgICAgIHYgPSBFTWF0aC5jbGFtcCh2LCAwLCAxMDApO1xyXG4gICAgICAgICAgICAgICAgYSA9IEVNYXRoLmNsYW1wKGEsIDAsIDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faHVlID0gaDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NhdCA9IHM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92YWwgPSB2O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hID0gYTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX291dGRhdGVkSHN2ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFJnYiA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIGNvbnN0cnVjdG9yOiBcIiArIGNzdHJ1Y3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmKHR5cGVvZiBhcmdBID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgIGlmIChhcmdCID09PSB1bmRlZmluZWQgfHwgYXJnQyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIGNvbnN0cnVjdG9yOiBOb3QgZW5vdWdoIGFyZ3VtZW50c1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9yID0gRU1hdGguY2xhbXAoTWF0aC5yb3VuZChhcmdBKSwgMCwgMjU1KTtcclxuICAgICAgICAgICAgdGhpcy5fZyA9IEVNYXRoLmNsYW1wKE1hdGgucm91bmQoYXJnQiEpLCAwLCAyNTUpO1xyXG4gICAgICAgICAgICB0aGlzLl9iID0gRU1hdGguY2xhbXAoTWF0aC5yb3VuZChhcmdDISksIDAsIDI1NSk7XHJcbiAgICAgICAgICAgIHRoaXMuYSA9IEVNYXRoLmNsYW1wKGFyZ0QgPz8gMSwgMCwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkUmdiID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkSHN2ID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2UgaWYoYXJnQSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3IgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLl9nID0gMDtcclxuICAgICAgICAgICAgdGhpcy5fYiA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuYSA9IDE7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkUmdiID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX291dGRhdGVkSHN2ID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9yID0gYXJnQSEucjtcclxuICAgICAgICAgICAgdGhpcy5fZyA9IGFyZ0EhLmc7XHJcbiAgICAgICAgICAgIHRoaXMuX2IgPSBhcmdBIS5iO1xyXG4gICAgICAgICAgICB0aGlzLmEgPSBhcmdBIS5hO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZFJnYiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRkYXRlZEhzdiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsb25lKCk6IENvbG9yIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIF9vdXRkYXRlZFJnYj86IGJvb2xlYW47XHJcbiAgICBfciA9IDA7XHJcbiAgICAvKipcclxuICAgICAqIChpbnQpIHJlZCB2YWx1ZSBvZiB0aGUgY29sb3IsIDAgLSAyNTUuXHJcbiAgICAqL1xyXG4gICAgc2V0IHIodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHZhbHVlID0gRU1hdGguY2xhbXAoTWF0aC5yb3VuZCh2YWx1ZSksIDAsIDI1NSk7XHJcbiAgICAgICAgaWYodmFsdWUgPT0gdGhpcy5fcilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkUmdiKVxyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVSZ2IoKTtcclxuICAgICAgICB0aGlzLl9yID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRIc3YgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZ2V0IHIoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRSZ2IpXHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVJnYigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yO1xyXG4gICAgfVxyXG5cclxuICAgIF9nID0gMDtcclxuICAgIC8qKlxyXG4gICAgICogKGludCkgZ3JlZW4gdmFsdWUgb2YgdGhlIGNvbG9yLCAwIC0gMjU1LlxyXG4gICAgKi9cclxuICAgIHNldCBnKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB2YWx1ZSA9IEVNYXRoLmNsYW1wKE1hdGgucm91bmQodmFsdWUpLCAwLCAyNTUpO1xyXG4gICAgICAgIGlmKHZhbHVlID09IHRoaXMuX2cpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFJnYilcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmdiKCk7XHJcbiAgICAgICAgdGhpcy5fZyA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkSHN2ID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGdldCBnKCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkUmdiKVxyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVSZ2IoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZztcclxuICAgIH1cclxuICAgIFxyXG4gICAgX2IgPSAwO1xyXG4gICAgLyoqXHJcbiAgICAgKiAoaW50KSBibHVlIHZhbHVlIG9mIHRoZSBjb2xvciwgMCAtIDI1NS5cclxuICAgICovXHJcbiAgICBzZXQgYih2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFsdWUgPSBFTWF0aC5jbGFtcChNYXRoLnJvdW5kKHZhbHVlKSwgMCwgMjU1KTtcclxuICAgICAgICBpZih2YWx1ZSA9PSB0aGlzLl9iKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRSZ2IpXHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVJnYigpO1xyXG4gICAgICAgIHRoaXMuX2IgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZEhzdiA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBnZXQgYigpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZFJnYilcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmdiKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2I7XHJcbiAgICB9XHJcblxyXG4gICAgX3VwZGF0ZVJnYigpIHtcclxuICAgICAgICBjb25zdCB7X2h1ZTpoLCBfc2F0OnMsIF92YWw6dn0gPSB0aGlzO1xyXG4gICAgICAgIGNvbnN0IGMgPSB2IC8gMTAwICogcyAvIDEwMDtcclxuICAgICAgICBjb25zdCB4ID0gYyAqICgxIC0gTWF0aC5hYnMoKChoIC8gNjApICUgMikgLSAxKSk7XHJcbiAgICAgICAgY29uc3QgbSA9IHYgLyAxMDAgLSBjO1xyXG4gICAgICAgIGxldCBycD0wLCBncD0wLCBicD0wO1xyXG4gICAgICAgIHN3aXRjaChNYXRoLmZsb29yKGggLyA2MCkpIHtcclxuICAgICAgICAgICAgY2FzZSAwOiBycD1jOyBncD14OyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAxOiBycD14OyBncD1jOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAyOiBncD1jOyBicD14OyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAzOiBncD14OyBicD1jOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA0OiBycD14OyBicD1jOyBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDogcnA9YzsgYnA9eDsgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3IgPSBNYXRoLnJvdW5kKChycCArIG0pICogMjU1KTtcclxuICAgICAgICB0aGlzLl9nID0gTWF0aC5yb3VuZCgoZ3AgKyBtKSAqIDI1NSk7XHJcbiAgICAgICAgdGhpcy5fYiA9IE1hdGgucm91bmQoKGJwICsgbSkgKiAyNTUpO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkUmdiID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgX291dGRhdGVkSHN2PzogYm9vbGVhbjtcclxuICAgIF9odWUgPSAwO1xyXG4gICAgLyoqXHJcbiAgICAgKiAoZGVjaW1hbCkgaHVlIG9mIHRoZSBjb2xvciBpbiBkZWdyZWVzLCAwIC0gMzYwLlxyXG4gICAgKi9cclxuICAgIHNldCBodWUodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHZhbHVlID0gRU1hdGgucG1vZCh2YWx1ZSwgMzYwKTtcclxuICAgICAgICBpZih2YWx1ZSA9PSB0aGlzLl9odWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZEhzdilcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlSHN2KCk7XHJcbiAgICAgICAgdGhpcy5faHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fb3V0ZGF0ZWRSZ2IgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZ2V0IGh1ZSgpIHtcclxuICAgICAgICBpZih0aGlzLl9vdXRkYXRlZEhzdilcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlSHN2KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2h1ZTtcclxuICAgIH1cclxuXHJcbiAgICBfc2F0ID0gMDtcclxuICAgIC8qKlxyXG4gICAgICogKGRlY2ltYWwpIHNhdHVyYXRpb24gb2YgdGhlIGNvbG9yLCAwIC0gMTAwLlxyXG4gICAgKi9cclxuICAgIHNldCBzYXQodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHZhbHVlID0gRU1hdGguY2xhbXAodmFsdWUsIDAsIDEwMCk7XHJcbiAgICAgICAgaWYodmFsdWUgPT0gdGhpcy5fc2F0KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRIc3YpXHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUhzdigpO1xyXG4gICAgICAgIHRoaXMuX3NhdCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkUmdiID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGdldCBzYXQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fb3V0ZGF0ZWRIc3YpXHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUhzdigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zYXQ7XHJcbiAgICB9XHJcblxyXG4gICAgX3ZhbCA9IDA7XHJcbiAgICAvKipcclxuICAgICAqIChkZWNpbWFsKSB2YWx1ZS9icmlnaHRuZXNzIG9mIHRoZSBjb2xvciwgMCAtIDEwMC5cclxuICAgICovXHJcbiAgICBzZXQgdmFsKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB2YWx1ZSA9IEVNYXRoLmNsYW1wKHZhbHVlLCAwLCAxMDApO1xyXG4gICAgICAgIGlmKHZhbHVlID09IHRoaXMuX3ZhbClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkSHN2KVxyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVIc3YoKTtcclxuICAgICAgICB0aGlzLl92YWwgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9vdXRkYXRlZFJnYiA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBnZXQgdmFsKCkge1xyXG4gICAgICAgIGlmKHRoaXMuX291dGRhdGVkSHN2KVxyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVIc3YoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIF91cGRhdGVIc3YoKSB7XHJcbiAgICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgodGhpcy5yLCB0aGlzLmcsIHRoaXMuYik7XHJcbiAgICAgICAgY29uc3QgbWluID0gTWF0aC5taW4odGhpcy5yLCB0aGlzLmcsIHRoaXMuYik7XHJcbiAgICAgICAgY29uc3QgZGVsdGEgPSBtYXggLSBtaW47XHJcbiAgICAgICAgbGV0IGggPSAwO1xyXG4gICAgICAgIGlmKGRlbHRhICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGlmKG1heCA9PT0gdGhpcy5yKSBoID0gNjAgKiAoKCh0aGlzLmcgLSB0aGlzLmIpIC8gZGVsdGEgKyA2KSAlIDYpO1xyXG4gICAgICAgICAgICBlbHNlIGlmKG1heCA9PT0gdGhpcy5nKSBoID0gNjAgKiAoKHRoaXMuYiAtIHRoaXMucikgLyBkZWx0YSArIDIpO1xyXG4gICAgICAgICAgICBlbHNlIGggPSA2MCAqICgodGhpcy5yIC0gdGhpcy5nKSAvIGRlbHRhICsgNCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGggPCAwKSBoICs9IDM2MDtcclxuICAgICAgICBjb25zdCBzID0gbWF4ID09PSAwID8gMCA6IGRlbHRhL21heCoxMDA7XHJcbiAgICAgICAgY29uc3QgdiA9IG1heC8yNTUqMTAwO1xyXG4gICAgICAgIHRoaXMuX2h1ZSA9IGg7XHJcbiAgICAgICAgdGhpcy5fc2F0ID0gcztcclxuICAgICAgICB0aGlzLl92YWwgPSB2O1xyXG4gICAgICAgIHRoaXMuX291dGRhdGVkSHN2ID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAoZGVjaW1hbCkgYWxwaGEvb3BhY2l0eSBvZiB0aGUgY29sb3IsIDAgLSAxLlxyXG4gICAgKi9cclxuICAgIGEgPSAxO1xyXG5cclxuICAgIHN0cmljdEVxdWFscyhvdGhlcjogQ29sb3IpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICB0aGlzLnIgPT0gb3RoZXIuclxyXG4gICAgICAgICAgICAmJiB0aGlzLmcgPT0gb3RoZXIuZ1xyXG4gICAgICAgICAgICAmJiB0aGlzLmIgPT0gb3RoZXIuYlxyXG4gICAgICAgICAgICAmJiB0aGlzLmEgPT0gb3RoZXIuYVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBpc0Nsb3NlKG90aGVyOiBDb2xvciwgZSA9IDFlLTYpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICBFTWF0aC5pc0Nsb3NlKHRoaXMuciwgb3RoZXIuciwgZSlcclxuICAgICAgICAgICAgJiYgRU1hdGguaXNDbG9zZSh0aGlzLmcsIG90aGVyLmcsIGUpXHJcbiAgICAgICAgICAgICYmIEVNYXRoLmlzQ2xvc2UodGhpcy5iLCBvdGhlci5iLCBlKVxyXG4gICAgICAgICAgICAmJiBFTWF0aC5pc0Nsb3NlKHRoaXMuYSwgb3RoZXIuYSwgZSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgc3RyaWN0RXF1YWxzUmdiKG90aGVyOiBDb2xvcikge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIHRoaXMuciA9PSBvdGhlci5yXHJcbiAgICAgICAgICAgICYmIHRoaXMuZyA9PSBvdGhlci5nXHJcbiAgICAgICAgICAgICYmIHRoaXMuYiA9PSBvdGhlci5iXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIGlzQ2xvc2VSZ2Iob3RoZXI6IENvbG9yLCBlID0gMWUtNikge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIEVNYXRoLmlzQ2xvc2UodGhpcy5yLCBvdGhlci5yLCBlKVxyXG4gICAgICAgICAgICAmJiBFTWF0aC5pc0Nsb3NlKHRoaXMuZywgb3RoZXIuZywgZSlcclxuICAgICAgICAgICAgJiYgRU1hdGguaXNDbG9zZSh0aGlzLmIsIG90aGVyLmIsIGUpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIGxlcnBSZ2JhKG90aGVyOiBDb2xvciwgdDogbnVtYmVyKTogQ29sb3Ige1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubGVycFJnYmFTZWxmKG90aGVyLCB0KTtcclxuICAgIH1cclxuICAgIGxlcnBSZ2JhU2VsZihvdGhlcjogQ29sb3IsIHQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuciA9IEVNYXRoLmxlcnAodGhpcy5yLCBvdGhlci5yLCB0KTtcclxuICAgICAgICB0aGlzLmcgPSBFTWF0aC5sZXJwKHRoaXMuZywgb3RoZXIuZywgdCk7XHJcbiAgICAgICAgdGhpcy5iID0gRU1hdGgubGVycCh0aGlzLmIsIG90aGVyLmIsIHQpO1xyXG4gICAgICAgIHRoaXMuYSA9IEVNYXRoLmxlcnAodGhpcy5hLCBvdGhlci5hLCB0KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGxlcnBIc3ZhKG90aGVyOiBDb2xvciwgdDogbnVtYmVyKTogQ29sb3Ige1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubGVycEhzdmFTZWxmKG90aGVyLCB0KTtcclxuICAgIH1cclxuICAgIGxlcnBIc3ZhU2VsZihvdGhlcjogQ29sb3IsIHQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuaHVlID0gRU1hdGgubGVycCh0aGlzLmh1ZSwgb3RoZXIuaHVlLCB0KTtcclxuICAgICAgICB0aGlzLnNhdCA9IEVNYXRoLmxlcnAodGhpcy5zYXQsIG90aGVyLnNhdCwgdCk7XHJcbiAgICAgICAgdGhpcy52YWwgPSBFTWF0aC5sZXJwKHRoaXMudmFsLCBvdGhlci52YWwsIHQpO1xyXG4gICAgICAgIHRoaXMuYSA9IEVNYXRoLmxlcnAodGhpcy5hLCBvdGhlci5hLCB0KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGdldElzRm9yZWdyb3VuZFdoaXRlKHRocmVzaG9sZCA9IDAuNDIpIHtcclxuICAgICAgICBsZXQge3IsIGcsIGJ9ID0gdGhpcztcclxuICAgICAgICByIC89IDI1NTtcclxuICAgICAgICBnIC89IDI1NTtcclxuICAgICAgICBiIC89IDI1NTtcclxuICAgICAgICByID0gKHIgPCAwLjAzOTI4KSA/IChyIC8gMTIuOTIpIDogKCgociArIDAuMDU1KSAvIDEuMDU1KSAqKiAyLjQpXHJcbiAgICAgICAgZyA9IChnIDwgMC4wMzkyOCkgPyAoZyAvIDEyLjkyKSA6ICgoKGcgKyAwLjA1NSkgLyAxLjA1NSkgKiogMi40KVxyXG4gICAgICAgIGIgPSAoYiA8IDAuMDM5MjgpID8gKGIgLyAxMi45MikgOiAoKChiICsgMC4wNTUpIC8gMS4wNTUpICoqIDIuNClcclxuICAgICAgICBsZXQgbCA9IDAuMjEyNiAqIHIgKyAwLjcxNTIgKiBnICsgMC4wNzIyICogYlxyXG4gICAgICAgIHJldHVybiBsIDwgdGhyZXNob2xkO1xyXG4gICAgfVxyXG4gICAgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gYHJnYmEoJHt0aGlzLnJ9LCAke3RoaXMuZ30sICR7dGhpcy5ifSwgJHt0aGlzLmF9KWA7XHJcbiAgICB9XHJcbiAgICB0b1JnYmFBcnJheSgpOiBbcjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlciwgYTogbnVtYmVyXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLnIsIHRoaXMuZywgdGhpcy5iLCB0aGlzLmFdO1xyXG4gICAgfVxyXG4gICAgdG9Ic3ZhQXJyYXkoKTogW2g6IG51bWJlciwgczogbnVtYmVyLCB2OiBudW1iZXIsIGE6IG51bWJlcl0ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy5odWUsIHRoaXMuc2F0LCB0aGlzLnZhbCwgdGhpcy5hXTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIEFSUkFZIFVUSUxTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBcnJheVV0aWxzIHtcclxuICAgIHN0YXRpYyBzaHVmZmxlU2VsZjxUPihhcnJheTogVFtdKTogVFtdIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gYXJyYXkubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xyXG4gICAgICAgICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XHJcbiAgICAgICAgICAgIFthcnJheVtpXSEsIGFycmF5W2pdIV0gPSBbYXJyYXlbal0hLCBhcnJheVtpXSFdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIElOUFVUIENMQVNTRVMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgS2V5cHJlc3NlcyB7XHJcbiAgICBzdGF0aWMga2V5UHJlc3NlZDoge1trZXk6c3RyaW5nXTogYW55fSA9IHt9O1xyXG4gICAgc3RhdGljIHByZXNzZWRLZXlzOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKTtcclxuICAgIHN0YXRpYyBrZXlEb3duRXZlbnQgPSBuZXcgU2lnbmFsPFtrZXlOYW1lOnN0cmluZ10+KCk7XHJcbiAgICBzdGF0aWMga2V5VXBFdmVudCA9IG5ldyBTaWduYWw8W2tleU5hbWU6c3RyaW5nXT4oKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGtleWRvd24oa2V5OiBzdHJpbmcpIHtcclxuICAgIEtleXByZXNzZXMua2V5UHJlc3NlZFtrZXldID0gdHJ1ZTtcclxuICAgIEtleXByZXNzZXMucHJlc3NlZEtleXMuYWRkKGtleSk7XHJcbiAgICBLZXlwcmVzc2VzLmtleURvd25FdmVudC5maXJlKGtleSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBrZXl1cChrZXk6IHN0cmluZykge1xyXG4gICAgZGVsZXRlIEtleXByZXNzZXMua2V5UHJlc3NlZFtrZXldO1xyXG4gICAgS2V5cHJlc3Nlcy5wcmVzc2VkS2V5cy5kZWxldGUoa2V5KTtcclxuICAgIEtleXByZXNzZXMua2V5VXBFdmVudC5maXJlKGtleSk7XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlID0+IHtcclxuICAgIGNvbnN0IGtleSA9IGUua2V5LnRvTG93ZXJDYXNlKCk7XHJcbiAgICBrZXlkb3duKGtleSk7XHJcbn0pO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBlID0+IHtcclxuICAgIGNvbnN0IGtleSA9IGUua2V5LnRvTG93ZXJDYXNlKCk7XHJcbiAgICBrZXl1cChrZXkpO1xyXG59KTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGUgPT4ge1xyXG4gICAgaWYoZS5idXR0b24gPT09IDApIHtcclxuICAgICAgICBrZXlkb3duKFwibG1iXCIpO1xyXG4gICAgfSBlbHNlIGlmKGUuYnV0dG9uID09PSAxKSB7XHJcbiAgICAgICAga2V5ZG93bihcIm1tYlwiKTtcclxuICAgIH0gZWxzZSBpZihlLmJ1dHRvbiA9PT0gMikge1xyXG4gICAgICAgIGtleWRvd24oXCJybWJcIik7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGUgPT4ge1xyXG4gICAgaWYoZS5idXR0b24gPT09IDApIHtcclxuICAgICAgICBrZXl1cChcImxtYlwiKTtcclxuICAgIH0gZWxzZSBpZihlLmJ1dHRvbiA9PT0gMSkge1xyXG4gICAgICAgIGtleXVwKFwibW1iXCIpO1xyXG4gICAgfSBlbHNlIGlmKGUuYnV0dG9uID09PSAyKSB7XHJcbiAgICAgICAga2V5dXAoXCJybWJcIik7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBvaW50ZXJMb2NrIHtcclxuICAgIGNvbm5lY3Rpb25zID0gbmV3IENvbm5lY3Rpb25Hcm91cCgpO1xyXG4gICAgcG9pbnRlckxvY2tDaGFuZ2VFdmVudDogU2lnbmFsPFtpc0xvY2tlZDogYm9vbGVhbl0+ID0gbmV3IFNpZ25hbCgpO1xyXG4gICAgbG9ja2VkTW91c2VNb3ZlRXZlbnQ6IFNpZ25hbDxbZHg6IG51bWJlciwgZHk6IG51bWJlcl0+ID0gbmV3IFNpZ25hbCgpO1xyXG4gICAgaXNFbmFibGVkID0gZmFsc2U7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmFkZChuZXcgSHRtbENvbm5lY3Rpb24od2luZG93LCBcIm1vdXNlZG93blwiLCAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZih0aGlzLmlzRW5hYmxlZCAmJiBkb2N1bWVudC5wb2ludGVyTG9ja0VsZW1lbnQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZXF1ZXN0UG9pbnRlckxvY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmFkZChuZXcgSHRtbENvbm5lY3Rpb24od2luZG93LCBcIm1vdXNlbW92ZVwiLCAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZihkb2N1bWVudC5wb2ludGVyTG9ja0VsZW1lbnQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRoaXMubG9ja2VkTW91c2VNb3ZlRXZlbnQuZmlyZShlLm1vdmVtZW50WCwgZS5tb3ZlbWVudFkpO1xyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmFkZChuZXcgSHRtbENvbm5lY3Rpb24oZG9jdW1lbnQsIFwicG9pbnRlcmxvY2tjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBvaW50ZXJMb2NrQ2hhbmdlRXZlbnQuZmlyZShkb2N1bWVudC5wb2ludGVyTG9ja0VsZW1lbnQgIT0gbnVsbCk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG4gICAgbG9jaygpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLmlzRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZXF1ZXN0UG9pbnRlckxvY2soKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHVubG9jaygpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLmlzRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIGRvY3VtZW50LmV4aXRQb2ludGVyTG9jaygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmVtb3ZlKCkge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMuZGlzY29ubmVjdEFsbCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBPQlNFUlZFUiBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGNsYXNzIFdpbmRvd1Jlc2l6ZU9ic2VydmVyIHtcclxuICAgIHJlc2l6ZUV2ZW50OiBTaWduYWw8W3c6IG51bWJlciwgaDogbnVtYmVyXT4gPSBuZXcgU2lnbmFsKHtcclxuICAgICAgICBvbkNvbm5lY3Q6IGNvbm4gPT4gY29ubi5maXJlKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpLFxyXG4gICAgfSk7XHJcbiAgICBjb25uZWN0aW9ucyA9IG5ldyBDb25uZWN0aW9uR3JvdXAoKTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMuYWRkKG5ldyBIdG1sQ29ubmVjdGlvbih3aW5kb3csIFwicmVzaXplXCIsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZXNpemVFdmVudC5maXJlKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuICAgIHJlbW92ZSgpIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmRpc2Nvbm5lY3RBbGwoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIFJFTkRFUiBMT09QIENMQVNTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBSZW5kZXJMb29wIHtcclxuICAgIHJlbmRlclN0ZXBwZWRFdmVudDogU2lnbmFsPFtkdDogbnVtYmVyXT4gPSBuZXcgU2lnbmFsKCk7XHJcbiAgICBydW5JbmRleCA9IDA7XHJcbiAgICBpc1J1bm5pbmcgPSBmYWxzZTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBjYWxsYmFjazogKGR0OiBudW1iZXIpID0+IHZvaWQpIHtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMuaXNSdW5uaW5nKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucnVuSW5kZXgrKztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIGlmKHRoaXMuaXNSdW5uaW5nKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB0aGlzLmlzUnVubmluZyA9IHRydWU7XHJcbiAgICAgICAgbGV0IHJpID0gdGhpcy5ydW5JbmRleDtcclxuICAgICAgICBsZXQgZnJhbWVUaW1lID0gcGVyZm9ybWFuY2Uubm93KCkvMTAwMDtcclxuICAgICAgICBjb25zdCByZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMucnVuSW5kZXggIT0gcmkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgbm93ID0gcGVyZm9ybWFuY2Uubm93KCkvMTAwMDtcclxuICAgICAgICAgICAgbGV0IGR0ID0gbm93IC0gZnJhbWVUaW1lO1xyXG4gICAgICAgICAgICBmcmFtZVRpbWUgPSBub3c7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyU3RlcHBlZEV2ZW50LmZpcmUoZHQpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrKGR0KTtcclxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlbmRlcigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBJQ09OIEdFTkVSQVRPUiAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGNsYXNzIEljb25Qb2x5Z29uMkQge1xyXG4gICAgcG9zaXRpb25zOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG4gICAgY2xvbmUoKTogSWNvblBvbHlnb24yRCB7XHJcbiAgICAgICAgbGV0IHBvbHkgPSBuZXcgSWNvblBvbHlnb24yRCgpO1xyXG4gICAgICAgIHBvbHkucG9zaXRpb25zLnB1c2goLi4udGhpcy5wb3NpdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiBwb2x5O1xyXG4gICAgfVxyXG4gICAgZ2V0Q2VudGVyT2ZNYXNzKCk6IFZlYzIge1xyXG4gICAgICAgIGxldCBjID0gVmVjMi56ZXJvKCk7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5wb3NpdGlvbnMubGVuZ3RoOyBpKz0yKVxyXG4gICAgICAgICAgICBjLmFkZFNlbGZDKHRoaXMucG9zaXRpb25zW2ldISwgdGhpcy5wb3NpdGlvbnNbaSsxXSEpO1xyXG4gICAgICAgIGlmKHRoaXMucG9zaXRpb25zLmxlbmd0aCA+IDApIGMuZGl2U2VsZkYodGhpcy5wb3NpdGlvbnMubGVuZ3RoLzIpO1xyXG4gICAgICAgIHJldHVybiBjO1xyXG4gICAgfVxyXG4gICAgcm90YXRlU2VsZihhOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTIpIHtcclxuICAgICAgICAgICAgbGV0IHYgPSBuZXcgVmVjMih0aGlzLnBvc2l0aW9uc1tpXSEsIHRoaXMucG9zaXRpb25zW2krMV0hKS5yb3RhdGVTZWxmKGEpO1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpXSA9IHYueDtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsxXSA9IHYueTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzY2FsZVNlbGYodjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNjYWxlU2VsZkModi54LCB2LnkpO1xyXG4gICAgfVxyXG4gICAgc2NhbGVTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mikge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpXSEgKj0geDtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsxXSEgKj0geTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICB0cmFuc2xhdGVTZWxmKHY6IFZlYzIpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGVTZWxmQyh2LngsIHYueSk7XHJcbiAgICB9XHJcbiAgICB0cmFuc2xhdGVTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mikge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpXSEgKz0geDtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsxXSEgKz0geTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBnZXRWZXJ0ZXgoaW5kZXg6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIGNvbnN0IGogPSBFTWF0aC5wbW9kKGluZGV4LCBNYXRoLmZsb29yKHRoaXMucG9zaXRpb25zLmxlbmd0aC8yKSkqMjtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5wb3NpdGlvbnNbal0hLCB0aGlzLnBvc2l0aW9uc1tqKzFdISk7XHJcbiAgICB9XHJcbiAgICBiZXZlbFNlbGYoaW5kaWNlczogU2V0PG51bWJlcj4gfCBudW1iZXJbXSwgYW1vdW50OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBpZighKGluZGljZXMgaW5zdGFuY2VvZiBTZXQpKVxyXG4gICAgICAgICAgICBpbmRpY2VzID0gbmV3IFNldChpbmRpY2VzKTtcclxuICAgICAgICBsZXQgbmV3UG9zaXRpb25zOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgIGxldCBsZW4gPSBNYXRoLmZsb29yKHRoaXMucG9zaXRpb25zLmxlbmd0aC8yKTtcclxuICAgICAgICBmb3IobGV0IGluZGV4PTA7IGluZGV4PGxlbjsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICBpZighaW5kaWNlcy5oYXMoaW5kZXgpKVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIGxldCB2QSA9IHRoaXMuZ2V0VmVydGV4KGluZGV4LTEpO1xyXG4gICAgICAgICAgICBsZXQgdkIgPSB0aGlzLmdldFZlcnRleChpbmRleCk7XHJcbiAgICAgICAgICAgIGxldCB2QyA9IHRoaXMuZ2V0VmVydGV4KGluZGV4KzEpO1xyXG4gICAgICAgICAgICBsZXQgdE1heEEgPSB2QS5kaXN0KHZCKTtcclxuICAgICAgICAgICAgbGV0IHRNYXhDID0gdkMuZGlzdCh2Qik7XHJcbiAgICAgICAgICAgIGlmKGluZGljZXMuaGFzKGluZGV4LTEpKSB0TWF4QSAvPSAyO1xyXG4gICAgICAgICAgICBpZihpbmRpY2VzLmhhcyhpbmRleCsxKSkgdE1heEMgLz0gMjtcclxuICAgICAgICAgICAgbGV0IGIxID0gdkIuYWRkU2NhbGVkKHZCLmxvb2sodkEpLCBFTWF0aC5jbGFtcChhbW91bnQsIDAsIHRNYXhBKSk7XHJcbiAgICAgICAgICAgIGxldCBiMiA9IHZCLmFkZFNjYWxlZCh2Qi5sb29rKHZDKSwgRU1hdGguY2xhbXAoYW1vdW50LCAwLCB0TWF4QykpO1xyXG4gICAgICAgICAgICBuZXdQb3NpdGlvbnMucHVzaChiMS54LCBiMS55LCBiMi54LCBiMi55KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbnMgPSBuZXdQb3NpdGlvbnM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBiZXZlbEFsbFNlbGYoYW1vdW50OiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgbmV3UG9zaXRpb25zOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgIGxldCBsZW4gPSBNYXRoLmZsb29yKHRoaXMucG9zaXRpb25zLmxlbmd0aC8yKTtcclxuICAgICAgICBmb3IobGV0IGluZGV4PTA7IGluZGV4PGxlbjsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICBsZXQgdkEgPSB0aGlzLmdldFZlcnRleChpbmRleC0xKTtcclxuICAgICAgICAgICAgbGV0IHZCID0gdGhpcy5nZXRWZXJ0ZXgoaW5kZXgpO1xyXG4gICAgICAgICAgICBsZXQgdkMgPSB0aGlzLmdldFZlcnRleChpbmRleCsxKTtcclxuICAgICAgICAgICAgbGV0IHRNYXhBID0gdkEuZGlzdCh2QikgLyAyO1xyXG4gICAgICAgICAgICBsZXQgdE1heEMgPSB2Qy5kaXN0KHZCKSAvIDI7XHJcbiAgICAgICAgICAgIGxldCBiMSA9IHZCLmFkZFNjYWxlZCh2Qi5sb29rKHZBKSwgRU1hdGguY2xhbXAoYW1vdW50LCAwLCB0TWF4QSkpO1xyXG4gICAgICAgICAgICBsZXQgYjIgPSB2Qi5hZGRTY2FsZWQodkIubG9vayh2QyksIEVNYXRoLmNsYW1wKGFtb3VudCwgMCwgdE1heEMpKTtcclxuICAgICAgICAgICAgbmV3UG9zaXRpb25zLnB1c2goYjEueCwgYjEueSwgYjIueCwgYjIueSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucG9zaXRpb25zID0gbmV3UG9zaXRpb25zO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZHJhd0ZpbGwoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGNvbG9yOiBzdHJpbmcpOiB0aGlzIHtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8odGhpcy5wb3NpdGlvbnNbMF0hICogY3R4LmNhbnZhcy53aWR0aCwgdGhpcy5wb3NpdGlvbnNbMV0hICogY3R4LmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIGZvcihsZXQgaT0yOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mikge1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHRoaXMucG9zaXRpb25zW2ldISAqIGN0eC5jYW52YXMud2lkdGgsIHRoaXMucG9zaXRpb25zW2krMV0hICogY3R4LmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN0YXRpYyBjcmVhdGVQb3NpdGlvbnMocG9zaXRpb25zOiBudW1iZXJbXSk6IEljb25Qb2x5Z29uMkQge1xyXG4gICAgICAgIGNvbnN0IHBvbHkgPSBuZXcgSWNvblBvbHlnb24yRCgpO1xyXG4gICAgICAgIHBvbHkucG9zaXRpb25zID0gcG9zaXRpb25zO1xyXG4gICAgICAgIHJldHVybiBwb2x5O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJlY3QoeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyKTogSWNvblBvbHlnb24yRCB7XHJcbiAgICAgICAgY29uc3QgeDAgPSB4IC0gdy8yO1xyXG4gICAgICAgIGNvbnN0IHgxID0geCArIHcvMjtcclxuICAgICAgICBjb25zdCB5MCA9IHkgLSBoLzI7XHJcbiAgICAgICAgY29uc3QgeTEgPSB5ICsgaC8yO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVBvc2l0aW9ucyhbeDAseTAsIHgxLHkwLCB4MSx5MSwgeDAseTFdKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBjaXJjbGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIHI6IG51bWJlciwgYXJjOiBudW1iZXIgPSBNYXRoLlBJICogMiwgc3RlcCA9IE1hdGguUEkgLyA4KTogSWNvblBvbHlnb24yRCB7XHJcbiAgICAgICAgYXJjID0gRU1hdGguY2xhbXAoYXJjLCAwLCBNYXRoLlBJICogMik7XHJcbiAgICAgICAgbGV0IHBvc2l0aW9uczogbnVtYmVyW10gPSBbXTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxhcmM7IGkrPXN0ZXApIHtcclxuICAgICAgICAgICAgcG9zaXRpb25zLnB1c2goTWF0aC5jb3MoaSkgKiByICsgeCwgTWF0aC5zaW4oaSkgKiByICsgeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBvc2l0aW9ucy5wdXNoKE1hdGguY29zKGFyYykgKiByICsgeCwgTWF0aC5zaW4oYXJjKSAqIHIgKyB5KTtcclxuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVQb3NpdGlvbnMocG9zaXRpb25zKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBjaXJjbGVGYW4oeDogbnVtYmVyLCB5OiBudW1iZXIsIHI6IG51bWJlciwgYXJjOiBudW1iZXIgPSBNYXRoLlBJICogMiwgc3RlcCA9IE1hdGguUEkgLyA4KTogSWNvblBvbHlnb24yRCB7XHJcbiAgICAgICAgY29uc3QgcG9seSA9IHRoaXMuY2lyY2xlKHgsIHksIHIsIGFyYywgc3RlcCk7XHJcbiAgICAgICAgcG9seS5wb3NpdGlvbnMuc3BsaWNlKDAsIDAsIHgsIHkpO1xyXG4gICAgICAgIHJldHVybiBwb2x5O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSWNvbkdlbmVyYXRpb25Db250ZXh0MkQge1xyXG4gICAgbGF5ZXJzOiB7W2tleTogc3RyaW5nXTogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSA9IHt9O1xyXG4gICAgc2VsZWN0ZWRMYXllciE6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xyXG4gICAgICAgIHRoaXMuc2V0TGF5ZXIoXCIwXCIpO1xyXG4gICAgfVxyXG4gICAgbWFwKGNhbGxiYWNrOiAoeDogbnVtYmVyLCB5OiBudW1iZXIsIGdldENvbG9yOiAoeDogbnVtYmVyLCB5OiBudW1iZXIpID0+IENvbG9yKSA9PiBDb2xvcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuc2VsZWN0ZWRMYXllcjtcclxuICAgICAgICBsZXQgZGF0YSA9IGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgY3R4LmNhbnZhcy53aWR0aCwgY3R4LmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIGxldCBuZXdEYXRhID0gY3R4LmNyZWF0ZUltYWdlRGF0YShjdHguY2FudmFzLndpZHRoLCBjdHguY2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgY29uc3QgZ2V0Q29sb3IgPSAoeDogbnVtYmVyLCB5OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaSA9ICh5ICogY3R4LmNhbnZhcy53aWR0aCArIHgpICogNDtcclxuICAgICAgICAgICAgaWYoaSA8IDAgfHwgaSA+PSBkYXRhLmRhdGEubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvcigwLCAwLCAwLCAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihkYXRhLmRhdGFbaV0hLCBkYXRhLmRhdGFbaSsxXSEsIGRhdGEuZGF0YVtpKzJdISwgZGF0YS5kYXRhW2krM10hLzI1NSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihsZXQgeT0wOyB5PGN0eC5jYW52YXMuaGVpZ2h0OyB5KyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCB4PTA7IHg8Y3R4LmNhbnZhcy53aWR0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpID0gKHkgKiBjdHguY2FudmFzLndpZHRoICsgeCkgKiA0O1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbG9yID0gY2FsbGJhY2soeCwgeSwgZ2V0Q29sb3IpO1xyXG4gICAgICAgICAgICAgICAgbmV3RGF0YS5kYXRhW2ldID0gTWF0aC5mbG9vcihjb2xvci5yKTtcclxuICAgICAgICAgICAgICAgIG5ld0RhdGEuZGF0YVtpKzFdID0gTWF0aC5mbG9vcihjb2xvci5nKTtcclxuICAgICAgICAgICAgICAgIG5ld0RhdGEuZGF0YVtpKzJdID0gTWF0aC5mbG9vcihjb2xvci5iKTtcclxuICAgICAgICAgICAgICAgIG5ld0RhdGEuZGF0YVtpKzNdID0gTWF0aC5mbG9vcihjb2xvci5hKjI1NSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LnB1dEltYWdlRGF0YShuZXdEYXRhLCAwLCAwKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGJyaWdodG5lc3NUb09wYWNpdHkoaW52ZXJ0ID0gZmFsc2UpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAoKHgsIHksIGdldENvbG9yKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjb2xvciA9IGdldENvbG9yKHgsIHkpO1xyXG4gICAgICAgICAgICBsZXQgdCA9IGNvbG9yLmE7XHJcbiAgICAgICAgICAgIGNvbG9yLmEgPSBjb2xvci52YWwgLyAxMDA7XHJcbiAgICAgICAgICAgIGlmKGludmVydCkgY29sb3IuYSA9IDEgLSBjb2xvci5hO1xyXG4gICAgICAgICAgICBjb2xvci5hICo9IHQ7XHJcbiAgICAgICAgICAgIGxldCB2ID0gaW52ZXJ0ID8gMCA6IDI1NTtcclxuICAgICAgICAgICAgY29sb3IuciA9IHY7XHJcbiAgICAgICAgICAgIGNvbG9yLmcgPSB2O1xyXG4gICAgICAgICAgICBjb2xvci5iID0gdjtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbG9yO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgbWlycm9yWCgpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAoKHgsIHksIGdldENvbG9yKSA9PiBnZXRDb2xvcih0aGlzLmN0eC5jYW52YXMud2lkdGggLSAxIC0geCwgeSkpO1xyXG4gICAgfVxyXG4gICAgbWlycm9yWSgpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAoKHgsIHksIGdldENvbG9yKSA9PiBnZXRDb2xvcih4LCB0aGlzLmN0eC5jYW52YXMuaGVpZ2h0IC0gMSAtIHkpKTtcclxuICAgIH1cclxuICAgIHNldExheWVyKG5hbWU6IHN0cmluZyk6IHRoaXMge1xyXG4gICAgICAgIGxldCBsYXllciA9IHRoaXMubGF5ZXJzW25hbWVdO1xyXG4gICAgICAgIGlmKGxheWVyID09IG51bGwpIHtcclxuICAgICAgICAgICAgbGF5ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLmdldENvbnRleHQoXCIyZFwiLCB7IHdpbGxSZWFkRnJlcXVlbnRseTogdHJ1ZSB9KSE7XHJcbiAgICAgICAgICAgIGxheWVyLmNhbnZhcy53aWR0aCA9IHRoaXMuY3R4LmNhbnZhcy53aWR0aDtcclxuICAgICAgICAgICAgbGF5ZXIuY2FudmFzLmhlaWdodCA9IHRoaXMuY3R4LmNhbnZhcy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHRoaXMubGF5ZXJzW25hbWVdID0gbGF5ZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRMYXllciA9IGxheWVyO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZmxhdHRlbigpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcclxuICAgICAgICBsZXQgZmxhdHRlbmVkRGF0YSA9IGN0eC5jcmVhdGVJbWFnZURhdGEoY3R4LmNhbnZhcy53aWR0aCwgY3R4LmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIGxldCBsYXllckRhdGFzID0gW107XHJcbiAgICAgICAgZm9yKGNvbnN0IG5hbWUgaW4gdGhpcy5sYXllcnMpIHtcclxuICAgICAgICAgICAgbGV0IGxheWVyID0gdGhpcy5sYXllcnNbbmFtZV0hO1xyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IGxheWVyLmdldEltYWdlRGF0YSgwLCAwLCBsYXllci5jYW52YXMud2lkdGgsIGxheWVyLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgICAgICBsYXllckRhdGFzLnB1c2goZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihsZXQgeT0wOyB5PGN0eC5jYW52YXMuaGVpZ2h0OyB5KyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCB4PTA7IHg8Y3R4LmNhbnZhcy53aWR0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpID0gKHkgKiBjdHguY2FudmFzLndpZHRoICsgeCkgKiA0O1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBkYXRhIG9mIGxheWVyRGF0YXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3JjQSA9IGRhdGEuZGF0YVtpKzNdIS8yNTU7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRzdEEgPSBmbGF0dGVuZWREYXRhLmRhdGFbaSszXSEvMjU1O1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdBID0gc3JjQSArIGRzdEEgKiAoMSAtIHNyY0EpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG5ld0EgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXR0ZW5lZERhdGEuZGF0YVtpXSA9IChkYXRhLmRhdGFbaV0hICogc3JjQSArIGZsYXR0ZW5lZERhdGEuZGF0YVtpXSEgKiBkc3RBICogKDEgLSBzcmNBKSkgLyBuZXdBO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF0dGVuZWREYXRhLmRhdGFbaSsxXSA9IChkYXRhLmRhdGFbaSsxXSEgKiBzcmNBICsgZmxhdHRlbmVkRGF0YS5kYXRhW2krMV0hICogZHN0QSAqICgxIC0gc3JjQSkpIC8gbmV3QTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdHRlbmVkRGF0YS5kYXRhW2krMl0gPSAoZGF0YS5kYXRhW2krMl0hICogc3JjQSArIGZsYXR0ZW5lZERhdGEuZGF0YVtpKzJdISAqIGRzdEEgKiAoMSAtIHNyY0EpKSAvIG5ld0E7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdHRlbmVkRGF0YS5kYXRhW2ldID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmxhdHRlbmVkRGF0YS5kYXRhW2krMV0gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGF0dGVuZWREYXRhLmRhdGFbaSsyXSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZsYXR0ZW5lZERhdGEuZGF0YVtpKzNdID0gbmV3QSAqIDI1NTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjdHgucHV0SW1hZ2VEYXRhKGZsYXR0ZW5lZERhdGEsIDAsIDApO1xyXG4gICAgICAgIGZvcihjb25zdCBuYW1lIGluIHRoaXMubGF5ZXJzKSB7XHJcbiAgICAgICAgICAgIGxldCBsYXllciA9IHRoaXMubGF5ZXJzW25hbWVdITtcclxuICAgICAgICAgICAgbGF5ZXIuY2FudmFzLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxheWVycyA9IHt9O1xyXG4gICAgICAgIHRoaXMuc2V0TGF5ZXIoXCIwXCIpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRMYXllci5kcmF3SW1hZ2UodGhpcy5jdHguY2FudmFzLCAwLCAwKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlSWNvbjJEKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBjYWxsYmFjazogKGN0eDogSWNvbkdlbmVyYXRpb25Db250ZXh0MkQpID0+IHZvaWQpIHtcclxuICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgY2FudmFzLndpZHRoID0gd2lkdGg7XHJcbiAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgbGV0IGN0eCA9IG5ldyBJY29uR2VuZXJhdGlvbkNvbnRleHQyRChjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIsIHsgd2lsbFJlYWRGcmVxdWVudGx5OiB0cnVlIH0pISk7XHJcbiAgICBjYWxsYmFjayhjdHgpO1xyXG4gICAgY3R4LmZsYXR0ZW4oKTtcclxuICAgIGxldCB1cmwgPSBhd2FpdCBuZXcgUHJvbWlzZTxzdHJpbmc+KHJlcyA9PiB7XHJcbiAgICAgICAgY2FudmFzLnRvQmxvYihibG9iID0+IHtcclxuICAgICAgICAgICAgaWYoIWJsb2IpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XHJcbiAgICAgICAgICAgIHJlcyh1cmwpO1xyXG4gICAgICAgIH0sIFwiaW1hZ2UvcG5nXCIpO1xyXG4gICAgfSlcclxuICAgIGNhbnZhcy5yZW1vdmUoKTtcclxuICAgIHJldHVybiB1cmw7XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIFVJIERST1BET1dOIENMQVNTIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgY2xhc3MgVWlDb250ZXh0TWVudSB7XHJcbiAgICBwb3NpdGlvbjogVmVjMjtcclxuICAgIGNvbnRhaW5lckVsOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWZWMyKHgsIHkpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgVUkgQlVUVE9OIENMQVNTIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGNsYXNzIFVpQnV0dG9uIHtcclxuICAgIGNvbnRhaW5lckVsOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGxhYmVsRWw6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgYnV0dG9uRWw6IEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgaXNIb3ZlcmluZyA9IGZhbHNlO1xyXG4gICAgbW91c2VFbnRlckV2ZW50OiBTaWduYWw8W10+ID0gbmV3IFNpZ25hbCgpO1xyXG4gICAgbW91c2VMZWF2ZUV2ZW50OiBTaWduYWw8W10+ID0gbmV3IFNpZ25hbCgpO1xyXG4gICAgcHJlZml4SWNvbnM6IFVpQnV0dG9uSWNvbltdID0gW107XHJcbiAgICBzdWZmaXhJY29uczogVWlCdXR0b25JY29uW10gPSBbXTtcclxuICAgIHRleHRDb250ZW50Q2hhbmdlZEV2ZW50OiBTaWduYWw8W3RleHQ6c3RyaW5nXT4gPSBuZXcgU2lnbmFsKHtvbkNvbm5lY3Q6KGNvbm4pPT57Y29ubi5maXJlKHRoaXMuX3RleHRDb250ZW50KX19KTtcclxuICAgIF90ZXh0Q29udGVudCA9IFwiQnV0dG9uXCI7XHJcbiAgICBnZXQgdGV4dENvbnRlbnQoKSB7IHJldHVybiB0aGlzLl90ZXh0Q29udGVudDsgfVxyXG4gICAgc2V0IHRleHRDb250ZW50KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl90ZXh0Q29udGVudCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudGV4dENvbnRlbnRDaGFuZ2VkRXZlbnQuZmlyZSh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICB0ZXh0U2l6ZUNoYW5nZWRFdmVudDogU2lnbmFsPFtzaXplOm51bWJlcl0+ID0gbmV3IFNpZ25hbCh7b25Db25uZWN0Oihjb25uKT0+e2Nvbm4uZmlyZSh0aGlzLl90ZXh0U2l6ZSl9fSk7XHJcbiAgICBfdGV4dFNpemUgPSAxNjtcclxuICAgIGdldCB0ZXh0U2l6ZSgpIHsgcmV0dXJuIHRoaXMuX3RleHRTaXplOyB9XHJcbiAgICBzZXQgdGV4dFNpemUodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3RleHRTaXplID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy50ZXh0U2l6ZUNoYW5nZWRFdmVudC5maXJlKHZhbHVlKTtcclxuICAgIH1cclxuICAgIHBhZGRpbmdYQ2hhbmdlZEV2ZW50OiBTaWduYWw8W3ZhbHVlOm51bWJlcl0+ID0gbmV3IFNpZ25hbCh7b25Db25uZWN0Oihjb25uKT0+e2Nvbm4uZmlyZSh0aGlzLl9wYWRkaW5nWCl9fSk7XHJcbiAgICBfcGFkZGluZ1ggPSA0O1xyXG4gICAgZ2V0IHBhZGRpbmdYKCkgeyByZXR1cm4gdGhpcy5fcGFkZGluZ1g7IH1cclxuICAgIHNldCBwYWRkaW5nWCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fcGFkZGluZ1ggPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIHBhZGRpbmdZQ2hhbmdlZEV2ZW50OiBTaWduYWw8W3ZhbHVlOm51bWJlcl0+ID0gbmV3IFNpZ25hbCh7b25Db25uZWN0Oihjb25uKT0+e2Nvbm4uZmlyZSh0aGlzLl9wYWRkaW5nWSl9fSk7XHJcbiAgICBfcGFkZGluZ1kgPSA4O1xyXG4gICAgZ2V0IHBhZGRpbmdZKCkgeyByZXR1cm4gdGhpcy5fcGFkZGluZ1k7IH1cclxuICAgIHNldCBwYWRkaW5nWSh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fcGFkZGluZ1kgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXJFbCk7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5zdHlsZSA9IGBcclxuICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICAgICAgICB3aWR0aDogZml0LWNvbnRlbnQ7XHJcbiAgICAgICAgICAgIGhlaWdodDogZml0LWNvbnRlbnQ7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xyXG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA0cHg7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xyXG4gICAgICAgICAgICB1c2VyLXNlbGVjdDogbm9uZTtcclxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgYDtcclxuICAgICAgICB0aGlzLnBhZGRpbmdYQ2hhbmdlZEV2ZW50LmNvbm5lY3QodmFsdWUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckVsLnN0eWxlLnBhZGRpbmcgPSBgJHt2YWx1ZX1weCAke3RoaXMucGFkZGluZ1l9cHhgO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckVsLnN0eWxlLmdhcCA9IGAke3ZhbHVlfXB4YDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnBhZGRpbmdZQ2hhbmdlZEV2ZW50LmNvbm5lY3QodmFsdWUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckVsLnN0eWxlLnBhZGRpbmcgPSBgJHt0aGlzLnBhZGRpbmdYfXB4ICR7dmFsdWV9cHhgO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYnV0dG9uRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuYXBwZW5kQ2hpbGQodGhpcy5idXR0b25FbCk7XHJcbiAgICAgICAgdGhpcy5idXR0b25FbC5zdHlsZSA9IGBcclxuICAgICAgICAgICAgcGFkZGluZzogMDtcclxuICAgICAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgICAgICAgICBib3JkZXI6IG5vbmU7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xyXG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgICAgIGxlZnQ6IDBweDtcclxuICAgICAgICAgICAgdG9wOiAwcHg7XHJcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICBgO1xyXG4gICAgICAgIHRoaXMubGFiZWxFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsRWwpO1xyXG4gICAgICAgIHRoaXMubGFiZWxFbC5zdHlsZSA9IGBcclxuICAgICAgICAgICAgY29sb3I6IGJsYWNrO1xyXG4gICAgICAgICAgICBmb250LWZhbWlseTogQXJpYWw7XHJcbiAgICAgICAgICAgIHdpZHRoOiBmaXQtY29udGVudDtcclxuICAgICAgICAgICAgaGVpZ2h0OiBmaXQtY29udGVudDtcclxuICAgICAgICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XHJcbiAgICAgICAgYDtcclxuICAgICAgICB0aGlzLnRleHRTaXplQ2hhbmdlZEV2ZW50LmNvbm5lY3Qoc2l6ZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubGFiZWxFbC5zdHlsZS5mb250U2l6ZSA9IGAke3NpemV9cHhgO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudGV4dENvbnRlbnRDaGFuZ2VkRXZlbnQuY29ubmVjdCh0ZXh0ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sYWJlbEVsLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmJ1dHRvbkVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsIGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmlzSG92ZXJpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlRW50ZXJFdmVudC5maXJlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5idXR0b25FbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCBlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pc0hvdmVyaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMubW91c2VMZWF2ZUV2ZW50LmZpcmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFkZEljb24odXJsOiBzdHJpbmcsIHBvc2l0aW9uOiBcInByZWZpeFwiIHwgXCJzdWZmaXhcIiA9IFwicHJlZml4XCIpIHtcclxuICAgICAgICBsZXQgaWNvbiA9IG5ldyBVaUJ1dHRvbkljb24odXJsKTtcclxuICAgICAgICBpZihwb3NpdGlvbiA9PSBcInByZWZpeFwiKSB0aGlzLmxhYmVsRWwuYmVmb3JlKGljb24uaWNvbkVsKVxyXG4gICAgICAgIGVsc2UgdGhpcy5sYWJlbEVsLmFmdGVyKGljb24uaWNvbkVsKTtcclxuICAgICAgICBpY29uLmNvbm5lY3Rpb25zLmFkZCh0aGlzLnRleHRTaXplQ2hhbmdlZEV2ZW50LmNvbm5lY3Qoc2l6ZSA9PiB7XHJcbiAgICAgICAgICAgIGljb24uaWNvbkVsLnN0eWxlLndpZHRoID0gYCR7c2l6ZX1weGA7XHJcbiAgICAgICAgICAgIGljb24uaWNvbkVsLnN0eWxlLmhlaWdodCA9IGAke3NpemV9cHhgO1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuICAgIHJlbW92ZSgpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLnJlbW92ZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVWlCdXR0b25JY29uIHtcclxuICAgIGljb25FbDogSFRNTEltYWdlRWxlbWVudDtcclxuICAgIGNvbm5lY3Rpb25zID0gbmV3IENvbm5lY3Rpb25Hcm91cCgpO1xyXG4gICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmljb25FbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgdGhpcy5pY29uRWwuc3JjID0gdXJsO1xyXG4gICAgfVxyXG4gICAgcmVtb3ZlKCkge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMuZGlzY29ubmVjdEFsbCgpO1xyXG4gICAgICAgIHRoaXMuaWNvbkVsLnJlbW92ZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVWlCdG5Ib3ZlckZ4U29saWRDb2xvciB7XHJcbiAgICBkdXJhdGlvbiA9IDAuMTtcclxuICAgIGNvbm5lY3Rpb25zID0gbmV3IENvbm5lY3Rpb25Hcm91cCgpO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGJ1dHRvbjogVWlCdXR0b24sIGNvbG9yOiBDb2xvciwgaG92ZXJDb2xvcjogQ29sb3IpIHtcclxuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XHJcbiAgICAgICAgdGhpcy5ob3ZlckNvbG9yID0gaG92ZXJDb2xvcjtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmFkZChidXR0b24ubW91c2VFbnRlckV2ZW50LmNvbm5lY3QoKCkgPT4ge1xyXG4gICAgICAgICAgICBidXR0b24uY29udGFpbmVyRWwuYW5pbWF0ZShbXHJcbiAgICAgICAgICAgICAgICB7YmFja2dyb3VuZENvbG9yOnRoaXMuY29sb3IudG9TdHJpbmcoKX0sXHJcbiAgICAgICAgICAgICAgICB7YmFja2dyb3VuZENvbG9yOnRoaXMuaG92ZXJDb2xvci50b1N0cmluZygpfSxcclxuICAgICAgICAgICAgXSwge2R1cmF0aW9uOnRoaXMuZHVyYXRpb24qMTAwMCwgZWFzaW5nOlwiZWFzZVwifSk7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5jb250YWluZXJFbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmhvdmVyQ29sb3IudG9TdHJpbmcoKTtcclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5hZGQoYnV0dG9uLm1vdXNlTGVhdmVFdmVudC5jb25uZWN0KCgpID0+IHtcclxuICAgICAgICAgICAgYnV0dG9uLmNvbnRhaW5lckVsLmFuaW1hdGUoW1xyXG4gICAgICAgICAgICAgICAge2JhY2tncm91bmRDb2xvcjp0aGlzLmhvdmVyQ29sb3IudG9TdHJpbmcoKX0sXHJcbiAgICAgICAgICAgICAgICB7YmFja2dyb3VuZENvbG9yOnRoaXMuY29sb3IudG9TdHJpbmcoKX0sXHJcbiAgICAgICAgICAgIF0sIHtkdXJhdGlvbjp0aGlzLmR1cmF0aW9uKjEwMDAsIGVhc2luZzpcImVhc2VcIn0pO1xyXG4gICAgICAgICAgICBidXR0b24uY29udGFpbmVyRWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5jb2xvci50b1N0cmluZygpO1xyXG4gICAgICAgIH0pKTtcclxuICAgICAgICBpZihidXR0b24uaXNIb3ZlcmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5jb250YWluZXJFbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmhvdmVyQ29sb3IudG9TdHJpbmcoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5jb250YWluZXJFbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmNvbG9yLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9jb2xvciE6IENvbG9yO1xyXG4gICAgc2V0IGNvbG9yKHZhbHVlOiBDb2xvcikge1xyXG4gICAgICAgIHRoaXMuX2NvbG9yID0gdmFsdWU7XHJcbiAgICAgICAgaWYoIXRoaXMuYnV0dG9uLmlzSG92ZXJpbmcpXHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLmNvbnRhaW5lckVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgY29sb3IoKSB7IHJldHVybiB0aGlzLl9jb2xvcjsgfVxyXG4gICAgX2hvdmVyQ29sb3IhOiBDb2xvcjtcclxuICAgIHNldCBob3ZlckNvbG9yKHZhbHVlOiBDb2xvcikge1xyXG4gICAgICAgIHRoaXMuX2hvdmVyQ29sb3IgPSB2YWx1ZTtcclxuICAgICAgICBpZih0aGlzLmJ1dHRvbi5pc0hvdmVyaW5nKVxyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5jb250YWluZXJFbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gICAgfVxyXG4gICAgZ2V0IGhvdmVyQ29sb3IoKSB7IHJldHVybiB0aGlzLl9ob3ZlckNvbG9yOyB9XHJcblxyXG4gICAgcmVtb3ZlKCkge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMuZGlzY29ubmVjdEFsbCgpO1xyXG4gICAgICAgIHRoaXMuYnV0dG9uLmNvbnRhaW5lckVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuY29sb3IudG9TdHJpbmcoKTtcclxuICAgIH1cclxufSJdfQ==