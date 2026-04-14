// 3D/2D JS Game Engine Library
// https://github.com/sllenderbrine
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
    x;
    y;
    z;
    constructor(x, y, z) {
        if (typeof x === "object") {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
        }
        else {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }
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
            case 0: return this.x;
            case 1: return this.y;
            case 2: return this.z;
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
            case 2:
                this.z = v;
                return;
        }
    }
    setC(x, y, z) {
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
    toString() {
        return `<${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)}>`;
    }
    toArray() {
        return [this.x, this.y, this.z];
    }
    clone() {
        return new Vec3(this);
    }
    getAxisBit() {
        const ax = Math.abs(this.x);
        const ay = Math.abs(this.y);
        const az = Math.abs(this.z);
        if (ax > ay) {
            if (ax > az) {
                return 0b100;
            }
            else {
                return 0b001;
            }
        }
        else {
            if (ay > az) {
                return 0b010;
            }
            else {
                return 0b001;
            }
        }
    }
    // Calculations
    length() {
        return Math.sqrt(this.dot(this));
    }
    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }
    dotC(x, y, z) {
        return this.x * x + this.y * y + this.z * z;
    }
    cross(other) {
        return new Vec3(this.y * other.z - this.z * other.y, -(this.x * other.z - this.z * other.x), this.x * other.y - this.y * other.x);
    }
    crossC(x, y, z) {
        return new Vec3(this.y * z - this.z * y, -(this.x * z - this.z * x), this.x * y - this.y * x);
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
        return this.x == other.x && this.y == other.y && this.z == other.z;
    }
    isClose(other, e = 1e-6) {
        return EMath.isClose(this.x, other.x, e) && EMath.isClose(this.y, other.y, e) && EMath.isClose(this.z, other.z, e);
    }
    isZero(e = 1e-6) {
        return EMath.isZero(this.x, e) && EMath.isZero(this.y, e) && EMath.isZero(this.z, e);
    }
    pitch() {
        return Math.asin(this.y);
    }
    yaw() {
        return Math.atan2(-this.x, -this.z);
    }
    // Operations
    add(other) {
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    addSelf(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }
    addC(x, y, z) {
        return new Vec3(this.x + x, this.y + y, this.z + z);
    }
    addSelfC(x, y, z) {
        this.x += x;
        this.y += y;
        this.z += z;
        return this;
    }
    addF(n) {
        return new Vec3(this.x + n, this.y + n, this.z + n);
    }
    addSelfF(n) {
        this.x += n;
        this.y += n;
        this.z += n;
        return this;
    }
    addScaled(other, s) {
        return this.clone().addScaledSelf(other, s);
    }
    addScaledSelf(other, s) {
        this.x += other.x * s;
        this.y += other.y * s;
        this.z += other.z * s;
        return this;
    }
    addScaledC(x, y, z, s) {
        return this.clone().addScaledSelfC(x, y, z, s);
    }
    addScaledSelfC(x, y, z, s) {
        this.x += x * s;
        this.y += y * s;
        this.z += z * s;
        return this;
    }
    sub(other) {
        return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
    }
    subSelf(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }
    subC(x, y, z) {
        return new Vec3(this.x - x, this.y - y, this.z - z);
    }
    subSelfC(x, y, z) {
        this.x -= x;
        this.y -= y;
        this.z -= z;
        return this;
    }
    subF(n) {
        return new Vec3(this.x - n, this.y - n, this.z - n);
    }
    subSelfF(n) {
        this.x -= n;
        this.y -= n;
        this.z -= n;
        return this;
    }
    rsub(other) {
        return new Vec3(other.x - this.x, other.y - this.y, other.z - this.z);
    }
    rsubSelf(other) {
        this.x = other.x - this.x;
        this.y = other.y - this.y;
        this.z = other.z - this.z;
        return this;
    }
    rsubC(x, y, z) {
        return new Vec3(x - this.x, y - this.y, z - this.z);
    }
    rsubSelfC(x, y, z) {
        this.x = x - this.x;
        this.y = y - this.y;
        this.z = z - this.z;
        return this;
    }
    rsubF(n) {
        return new Vec3(n - this.x, n - this.y, n - this.z);
    }
    rsubSelfF(n) {
        this.x = n - this.x;
        this.y = n - this.y;
        this.z = n - this.z;
        return this;
    }
    mul(other) {
        return new Vec3(this.x * other.x, this.y * other.y, this.z * other.z);
    }
    mulSelf(other) {
        this.x *= other.x;
        this.y *= other.y;
        this.z *= other.z;
        return this;
    }
    mulC(x, y, z) {
        return new Vec3(this.x * x, this.y * y, this.z * z);
    }
    mulSelfC(x, y, z) {
        this.x *= x;
        this.y *= y;
        this.z *= z;
        return this;
    }
    mulF(n) {
        return new Vec3(this.x * n, this.y * n, this.z * n);
    }
    mulSelfF(n) {
        this.x *= n;
        this.y *= n;
        this.z *= n;
        return this;
    }
    div(other) {
        return new Vec3(this.x / other.x, this.y / other.y, this.z / other.z);
    }
    divSelf(other) {
        this.x /= other.x;
        this.y /= other.y;
        this.z /= other.z;
        return this;
    }
    divC(x, y, z) {
        return new Vec3(this.x / x, this.y / y, this.z / z);
    }
    divSelfC(x, y, z) {
        this.x /= x;
        this.y /= y;
        this.z /= z;
        return this;
    }
    divF(n) {
        return new Vec3(this.x / n, this.y / n, this.z / n);
    }
    divSelfF(n) {
        this.x /= n;
        this.y /= n;
        this.z /= n;
        return this;
    }
    rdiv(other) {
        return new Vec3(other.x / this.x, other.y / this.y, other.z / this.z);
    }
    rdivSelf(other) {
        this.x = other.x / this.x;
        this.y = other.y / this.y;
        this.z = other.z / this.z;
        return this;
    }
    rdivC(x, y, z) {
        return new Vec3(x / this.x, y / this.y, z / this.z);
    }
    rdivSelfC(x, y, z) {
        this.x = x / this.x;
        this.y = y / this.y;
        this.z = z / this.z;
        return this;
    }
    rdivF(n) {
        return new Vec3(n / this.x, n / this.y, n / this.z);
    }
    rdivSelfF(n) {
        this.x = n / this.x;
        this.y = n / this.y;
        this.z = n / this.z;
        return this;
    }
    neg() {
        return new Vec3(-this.x, -this.y, -this.z);
    }
    negSelf() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }
    lerp(other, t) {
        return this.clone().lerpSelf(other, t);
    }
    lerpSelf(other, t) {
        this.x += (other.x - this.x) * t;
        this.y += (other.y - this.y) * t;
        this.z += (other.z - this.z) * t;
        return this;
    }
    lerpC(x, y, z, t) {
        return this.clone().lerpSelfC(x, y, z, t);
    }
    lerpSelfC(x, y, z, t) {
        this.x += (x - this.x) * t;
        this.y += (y - this.y) * t;
        this.z += (z - this.z) * t;
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
        this.y = 0;
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
        this.x = method(this.x, 0);
        this.y = method(this.y, 1);
        this.z = method(this.z, 2);
        return this;
    }
    rotX(a) {
        return this.clone().rotXSelf(a);
    }
    rotXSelf(a) {
        const s = Math.sin(a), c = Math.cos(a);
        const y = this.y * c - this.z * s;
        this.z = this.y * s + this.z * c;
        this.y = y;
        return this;
    }
    rotY(a) {
        return this.clone().rotYSelf(a);
    }
    rotYSelf(a) {
        const s = Math.sin(a), c = Math.cos(a);
        const z = this.z * c - this.x * s;
        this.x = this.x * c + this.z * s;
        this.z = z;
        return this;
    }
    rotZ(a) {
        return this.clone().rotZSelf(a);
    }
    rotZSelf(a) {
        const s = Math.sin(a), c = Math.cos(a);
        const x = this.x * c - this.y * s;
        this.y = this.x * s + this.y * c;
        this.x = x;
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
        let x = this.x, y = this.y, z = this.z;
        this.x = x * c + cross.x * s + axis.x * dot * (1 - c);
        this.y = y * c + cross.y * s + axis.y * dot * (1 - c);
        this.z = z * c + cross.z * s + axis.z * dot * (1 - c);
        return this;
    }
    rotXYZ(rot) {
        return this.clone().rotXYZSelf(rot);
    }
    rotXYZSelf(rot) {
        return this.rotXSelf(rot.x).rotYSelf(rot.y).rotZSelf(rot.z);
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
        return this.rotZSelf(rot.z).rotYSelf(rot.y).rotXSelf(rot.x);
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
///////////////////
//  NOISE CLASS  //
///////////////////
export class Noise {
    static fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
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
    static randomConstant3(a, b, c) {
        const it = (a * 2394823549) ^ (b * 43859742850) ^ (c * 23094565234);
        return EMath.pmod(it, 10000) / 10000;
    }
    static randomConstant4(a, b, c, d) {
        const it = (a * 2394823549) ^ (b * 43859742850) ^ (c * 23094565234) ^ (d * 8427824566);
        return EMath.pmod(it, 10000) / 10000;
    }
}
//////////////////////
//  CAMERA CLASSES  //
//////////////////////
export class Camera3D {
    _fovY = 95 / 180 * Math.PI;
    get fovY() {
        return this._fovY;
    }
    set fovY(n) {
        this._fovY = n;
        this._perspectiveMatrixU = true;
    }
    _aspect = 1;
    get aspect() {
        return this._aspect;
    }
    set aspect(n) {
        this._aspect = n;
        this._perspectiveMatrixU = true;
    }
    _near = 0.1;
    get near() {
        return this._near;
    }
    set near(n) {
        this._near = n;
        this._perspectiveMatrixU = true;
    }
    _far = 10000;
    get far() {
        return this._far;
    }
    set far(n) {
        this._far = n;
        this._perspectiveMatrixU = true;
    }
    _position = Vec3.zero();
    get position() {
        return this._position;
    }
    set position(v) {
        this._position = v;
        this._translationMatrixU = true;
        this._viewMatrixU = true;
    }
    _worldScale = 1;
    get worldScale() {
        return this._worldScale;
    }
    set worldScale(n) {
        this._worldScale = n;
        this._translationMatrixU = true;
        this._viewMatrixU = true;
    }
    _rotation = Vec3.zero();
    get rotation() {
        return this._rotation;
    }
    set rotation(v) {
        this._rotation = v;
        this._forwardU = true;
        this._rightU = true;
        this._upU = true;
        this._forwardFlatU = true;
        this._rotationMatrixU = true;
        this._viewMatrixU = true;
    }
    _forward = Vec3.zero();
    _forwardU = true;
    get forward() {
        if (this._forwardU) {
            this._forward = Vec3.zAxis().negSelf().rotXYZSelf(this._rotation);
            this._forwardU = false;
        }
        return this._forward;
    }
    _right = Vec3.zero();
    _rightU = true;
    get right() {
        if (this._rightU) {
            this._right = Vec3.xAxis().rotXYZSelf(this._rotation);
            this._rightU = false;
        }
        return this._right;
    }
    _up = Vec3.zero();
    _upU = true;
    get up() {
        if (this._upU) {
            this._up = Vec3.yAxis().rotXYZSelf(this._rotation);
            this._upU = false;
        }
        return this._up;
    }
    _forwardFlat = Vec3.zero();
    _forwardFlatU = true;
    get forwardFlat() {
        if (this._forwardFlatU) {
            this._forwardFlat = Vec3.zAxis().negSelf().rotYSelf(this._rotation.y);
            this._forwardFlatU = false;
        }
        return this._forwardFlat;
    }
    _perspectiveMatrix = [];
    _perspectiveMatrixU = true;
    get perspectiveMatrix() {
        if (this._perspectiveMatrixU) {
            this._perspectiveMatrix = Mat4.perspective(this._fovY, this._aspect, this._near, this._far);
            this._perspectiveMatrixU = false;
            this.perspectiveMatrixChangeEvent.fire(this._perspectiveMatrix);
        }
        return this._perspectiveMatrix;
    }
    _translationMatrix = [];
    _translationMatrixU = true;
    get translationMatrix() {
        if (this._translationMatrixU) {
            this._translationMatrix = Mat4.translate(-this._position.x * this._worldScale, -this._position.y * this._worldScale, -this._position.z * this._worldScale);
            this._translationMatrixU = false;
            this.translationMatrixChangeEvent.fire(this._viewMatrix);
        }
        return this._translationMatrix;
    }
    _rotationMatrix = [];
    _rotationMatrixU = true;
    get rotationMatrix() {
        if (this._rotationMatrixU) {
            this._rotationMatrix = Mat4.multiply(Mat4.rotateZ(-this._rotation.z), Mat4.multiply(Mat4.rotateX(-this._rotation.x), Mat4.rotateY(-this._rotation.y)));
            this._rotationMatrixU = false;
            this.rotationMatrixChangeEvent.fire(this._viewMatrix);
        }
        return this._rotationMatrix;
    }
    _viewMatrix = [];
    _viewMatrixU = true;
    get viewMatrix() {
        if (this._viewMatrixU) {
            this._viewMatrix = Mat4.multiply(this.rotationMatrix, this.translationMatrix);
            this._viewMatrixU = false;
            this.viewMatrixChangeEvent.fire(this._viewMatrix);
        }
        return this._viewMatrix;
    }
    perspectiveMatrixChangeEvent = new Signal({ onConnect: conn => conn.fire(this.perspectiveMatrix) });
    viewMatrixChangeEvent = new Signal({ onConnect: conn => conn.fire(this.viewMatrix) });
    rotationMatrixChangeEvent = new Signal({ onConnect: conn => conn.fire(this.rotationMatrix) });
    translationMatrixChangeEvent = new Signal({ onConnect: conn => conn.fire(this.translationMatrix) });
    constructor(position, fovY, aspect, near, far) {
        if (position)
            this.position = position;
        if (fovY)
            this.fovY = fovY;
        if (aspect)
            this.aspect = aspect;
        if (near)
            this.near = near;
        if (far)
            this.far = far;
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
            let cd = Math.min(d1, d2, d3, d4);
            let edge;
            let normal;
            if (EMath.isClose(cd, d1)) {
                edge = center.addScaled(right, dx).addScaled(up, sizeY);
                normal = up;
            }
            else if (EMath.isClose(cd, d2)) {
                edge = center.addScaled(right, dx).addScaled(up, -sizeY);
                normal = up.neg();
            }
            else if (EMath.isClose(cd, d3)) {
                edge = center.addScaled(up, dy).addScaled(right, sizeX);
                normal = right;
            }
            else {
                edge = center.addScaled(up, dy).addScaled(right, -sizeX);
                normal = right.neg();
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
        let collision = pointA.addScaled(pointA.look(pointB), radiusA);
        let normal = pointB.look(pointA);
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
        let vn1 = col.normal.dot(a.velocity);
        let vn2 = col.normal.dot(b.velocity);
        a.velocity.addScaledSelf(col.normal, vn2 - vn1);
        b.velocity.addScaledSelf(col.normal, vn1 - vn2);
        a.position.addScaledSelf(col.normal, -col.distance / 2);
        b.position.addScaledSelf(col.normal, col.distance / 2);
    }
    static resolveCircleAnchoredRectCollision(a, b, col) {
        if (!col.inside)
            return;
        a.position = col.position.addScaled(col.normal, a.radius + 1e-6);
        a.velocity.addScaledSelf(col.normal, -col.normal.dot(a.velocity) * 2);
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
    // RGB 0-255
    r;
    g;
    b;
    // Alpha 0-100
    a;
    constructor(r, g, b, a = 100) {
        this.r = EMath.clamp(r, 0, 255);
        this.g = EMath.clamp(g, 0, 255);
        this.b = EMath.clamp(b, 0, 255);
        this.a = EMath.clamp(a, 0, 100);
    }
    static fromHSV(h, s, v, a = 100) {
        h = EMath.pmod(h, 360);
        s = EMath.clamp(s, 0, 100);
        v = EMath.clamp(v, 0, 100);
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
        return { h, s, v, a: this.a };
    }
    lerp(other, t) {
        return new Color(this.r + (other.r - this.r) * t, this.g + (other.g - this.g) * t, this.b + (other.b - this.b) * t, this.a + (other.a - this.a) * t);
    }
    getIsForegroundWhite(threshold = 0.42) {
        let { r, g, b } = this;
        r = (r < 0.03928) ? (r / 12.92) : (((r + 0.055) / 1.055) ^ 2.4);
        g = (g < 0.03928) ? (g / 12.92) : (((g + 0.055) / 1.055) ^ 2.4);
        b = (b < 0.03928) ? (b / 12.92) : (((b + 0.055) / 1.055) ^ 2.4);
        let l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return l < threshold;
    }
    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a / 100})`;
    }
    toArray() {
        return [this.r, this.g, this.b, this.a];
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
            this.callback(dt);
            requestAnimationFrame(render);
        };
        render();
        return this;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGliZ2UzX3YyMDI2MDQxNC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpYmdlM192MjAyNjA0MTQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQStCO0FBQy9CLG1DQUFtQztBQUVuQyxtQkFBbUI7QUFDbkIsbUJBQW1CO0FBQ25CLG1CQUFtQjtBQUNuQixNQUFNLE9BQWdCLEtBQUs7SUFDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFTLEVBQUMsQ0FBUyxFQUFDLENBQVM7UUFDdEMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQVMsRUFBQyxDQUFTLEVBQUMsQ0FBUztRQUNyQyxPQUFPLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBUyxFQUFDLENBQVM7UUFDM0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLElBQVksSUFBSTtRQUNqRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFTLEVBQUUsSUFBWSxJQUFJO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDM0IsQ0FBQztDQUNKO0FBRUQsc0JBQXNCO0FBQ3RCLHNCQUFzQjtBQUN0QixzQkFBc0I7QUFDdEIsTUFBTSxPQUFP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QUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUNELFFBQVEsQ0FBQyxDQUFTO1FBQ2QsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1osT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxLQUFXO1FBQ1osT0FBTyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFDRCxRQUFRLENBQUMsS0FBVztRQUNoQixJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMxQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsS0FBSyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUNqQyxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUNELFNBQVMsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDckMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELEtBQUssQ0FBQyxDQUFTO1FBQ1gsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFDRCxTQUFTLENBQUMsQ0FBUztRQUNmLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxHQUFHO1FBQ0MsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFDRCxPQUFPO1FBQ0gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxLQUFXLEVBQUUsQ0FBUztRQUN2QixPQUFPLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFDRCxRQUFRLENBQUMsS0FBVyxFQUFFLENBQVM7UUFDM0IsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELEtBQUssQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQzVDLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQ0QsU0FBUyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDaEQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0IsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUk7UUFDQSxPQUFPLElBQUksQ0FB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QUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUNyQixPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNELFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUN6QixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1osT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFTO1FBQ1YsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFDRCxRQUFRLENBQUMsQ0FBUztRQUNkLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1osSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsSUFBSSxDQUFDLEtBQVc7UUFDWixPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBQ0QsUUFBUSxDQUFDLEtBQVc7UUFDaEIsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDMUIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELEtBQUssQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUN0QixPQUFPLElBQUksSUFBSSxDQUFD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QyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QyxNQUFNLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0QsTUFBTSxJQUFJLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsTUFBTSxJQUFJLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsTUFBTSxJQUFJLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsTUFBTSxJQUFJLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsTUFBTSxJQUFJLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsTUFBTSxJQUFJLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsTUFBTSxJQUFJLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLEVB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QUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0QsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0MsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuSCxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuSCxJ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Q0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN6RCxJQUFJLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQUksTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDMUQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN0RCxJQUFHLENBQUMsSUFBSSxHQUFHLEtB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RCxLQUFLLEtBQUs7Z0JBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUNuRCxLQUFLLE9BQU87Z0JBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUN0RCxLQUFLLE9BQU87Z0JBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUN0RCxLQUFLLE9BQU87Z0JBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUN0RCxLQUFLLE1BQU07Z0JBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUNyRCxLQUFLLE9BQU87Z0JBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUN2RCxLQUFLLE9BQU87Z0JBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUN2RCxLQUFLLE9BQU87Z0JBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUN2RCxLQUFLLE1BQU07Z0JBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUNsRSxLQUFLLE1BQU07Z0JBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUNsRSxLQUFLLE1BQU07Z0JBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUNsRSxPQUFP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QyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTztnQkFDM0csR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRO2dCQUMxSSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTTtnQkFDMUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEdBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTO2dCQUMzSSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxXQUFXO2dCQUMvRSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsWUFBWTtnQkFDOUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLGNBQWM7Z0JBQ2hILEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEdBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsZUFBZTtZQUNuSixDQUFDO1lBQ0QsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO1lBQ3RDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztZQUN0QyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUMsT0FBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO1lBQ3hDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBQyxPQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7WUFDeEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDM0IsQ0FBQztRQUNELElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM3QixNQUFNLFVBQVUsR0FBRyxNQUFNLElBQUksT0FBTyxDQUFtQixHQUFHLENBQUMsRUFBRTtZQUN6RCxJQUFJLEdBQUcsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ3RCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFO2dCQUNkLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNiLENBQUMsQ0FBQTtZQUNELEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLFlBQVksQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDaEQsQ0FBQztDQUNKO0FBR0QsbUJBQW1CO0FBQ25CLG1CQUFtQjtBQUNuQixtQkFBbUI7QUFDbkIsTUFBTSxPQUFPLEtBQUs7SUFDZCxZQUFZO0lBQ1osQ0FBQyxDQUFTO0lBQ1YsQ0FBQyxDQUFTO0lBQ1YsQ0FBQyxDQUFTO0lBQ1YsY0FBYztJQUNkLENBQUMsQ0FBUztJQUNWLFlBQVksQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsSUFBWSxHQUFHO1FBQ3hELElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLElBQVksR0FBRztRQUMzRCxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdkIsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMzQixDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUM1QixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDdEIsSUFBSSxFQUFFLEdBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFDLENBQUMsQ0FBQztRQUNyQixRQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDeEIsS0FBSyxDQUFDO2dCQUFFLEVBQUUsR0FBQyxDQUFDLENBQUM7Z0JBQUMsRUFBRSxHQUFDLENBQUMsQ0FBQztnQkFBQyxNQUFNO1lBQzFCLEtBQUssQ0FBQztnQkFBRSxFQUFFLEdBQUMsQ0FBQyxDQUFDO2dCQUFDLEVBQUUsR0FBQyxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUMxQixLQUFLLENBQUM7Z0JBQUUsRUFBRSxHQUFDLENBQUMsQ0FBQztnQkFBQyxFQUFFLEdBQUMsQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDMUIsS0FBSyxDQUFDO2dCQUFFLEVBQUUsR0FBQyxDQUFDLENBQUM7Z0JBQUMsRUFBRSxHQUFDLENBQUMsQ0FBQztnQkFBQyxNQUFNO1lBQzFCLEtBQUssQ0FBQztnQkFBRSxFQUFFLEdBQUMsQ0FBQyxDQUFDO2dCQUFDLEVBQUUsR0FBQyxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUMxQjtnQkFBUyxFQUFFLEdBQUMsQ0FBQyxDQUFDO2dCQUFDLEVBQUUsR0FBQyxDQUFDLENBQUM7Z0JBQUMsTUFBTTtRQUMvQixDQUFDO1FBQ0QsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDckMsT0FBTyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQ0QsS0FBSztRQUNELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0MsTUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUN4QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixJQUFHLEtBQUssS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUNiLElBQUcsR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUM3RCxJQUFHLEdBQUcsS0FBSyxJQUFJLENBQUMsQ0FBQztnQkFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7O2dCQUM1RCxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUNELElBQUcsQ0FBQyxHQUFHLENBQUM7WUFBRSxDQUFDLElBQUksR0FBRyxDQUFDO1FBQ25CLE1BQU0sQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFDLEdBQUcsR0FBQyxHQUFHLENBQUM7UUFDeEMsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFDLEdBQUcsR0FBQyxHQUFHLENBQUM7UUFDdEIsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDakMsQ0FBQztJQUNELElBQUksQ0FBQyxLQUFZLEVBQUUsQ0FBUztRQUN4QixPQUFPLElBQUksS0FBSyxDQUNaLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQy9CLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQy9CLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQy9CLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQ2xDLENBQUE7SUFDTCxDQUFDO0lBQ0Qsb0JBQW9CLENBQUMsU0FBUyxHQUFHLElBQUk7UUFDakMsSUFBSSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQTtRQUMvRCxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUE7UUFDL0QsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFBO1FBQy9ELElBQUksQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFBO1FBQzVDLE9BQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUN6QixDQUFDO0lBQ0QsUUFBUTtRQUNKLE9BQU8sUUFBUSxJQUFJLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxHQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ2xFLENBQUM7SUFDRCxPQUFPO1FBQ0gsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDO0NBQ0o7QUFHRCxxQkFBcUI7QUFDckIscUJBQXFCO0FBQ3JCLHFCQUFxQjtBQUNyQixNQUFNLE9BQWdCLFVBQVU7SUFDNUIsTUFBTSxDQUFDLFVBQVUsR0FBd0IsRUFBRSxDQUFDO0lBQzVDLE1BQU0sQ0FBQyxXQUFXLEdBQWdCLElBQUksR0FBRyxFQUFFLENBQUM7SUFDNUMsTUFBTSxDQUFDLFlBQVksR0FBRyxJQUFJLE1BQU0sRUFBb0IsQ0FBQztJQUNyRCxNQUFNLENBQUMsVUFBVSxHQUFHLElBQUksTUFBTSxFQUFvQixDQUFDOztBQUd2RCxNQUFNLFVBQVUsT0FBTyxDQUFDLEdBQVc7SUFDL0IsVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDbEMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEMsVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEMsQ0FBQztBQUVELE1BQU0sVUFBVSxLQUFLLENBQUMsR0FBVztJQUM3QixPQUFPLFVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEMsQ0FBQztBQUVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDbkMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakIsQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFO0lBQ2pDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDaEMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFO0lBQ3JDLElBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkIsQ0FBQztTQUFNLElBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUN2QixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkIsQ0FBQztTQUFNLElBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUN2QixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkIsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRTtJQUNuQyxJQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDaEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pCLENBQUM7U0FBTSxJQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDdkIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pCLENBQUM7U0FBTSxJQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDdkIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pCLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILE1BQU0sT0FBTyxXQUFXO0lBQ3BCLFdBQVcsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO0lBQ3BDLHNCQUFzQixHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7SUFDdEMsb0JBQW9CLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztJQUNwQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ2xCO1FBQ0ksSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxjQUFjLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQWEsRUFBRSxFQUFFO1lBQzNFLElBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxRQUFRLENBQUMsa0JBQWtCLElBQUksSUFBSSxFQUFFLENBQUM7Z0JBQ3ZELFFBQVEsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUN2QyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNKLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksY0FBYyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFhLEVBQUUsRUFBRTtZQUMzRSxJQUFHLFFBQVEsQ0FBQyxrQkFBa0IsSUFBSSxJQUFJO2dCQUNsQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDSixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxRQUFRLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO1lBQ3hFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixJQUFJLElBQUksQ0FBQyxDQUFDO1FBQzFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDO0lBQ0QsSUFBSTtRQUNBLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLFFBQVEsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUNuQyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsTUFBTTtRQUNGLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLFFBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUMzQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsTUFBTTtRQUNGLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDckMsQ0FBQztDQUNKO0FBR0Qsd0JBQXdCO0FBQ3hCLHdCQUF3QjtBQUN4Qix3QkFBd0I7QUFDeEIsTUFBTSxPQUFPLG9CQUFvQjtJQUM3QixXQUFXLEdBQW1DLElBQUksTUFBTSxDQUFDO1FBQ3JELFNBQVMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDO0tBQ3RFLENBQUMsQ0FBQztJQUNILFdBQVcsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO0lBQ3BDO1FBQ0ksSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxjQUFjLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFDM0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDakUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7SUFDRCxNQUFNO1FBQ0YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0NBQ0o7QUFHRCx5QkFBeUI7QUFDekIseUJBQXlCO0FBQ3pCLHlCQUF5QjtBQUN6QixNQUFNLE9BQU8sVUFBVTtJQUdBO0lBRm5CLFFBQVEsR0FBRyxDQUFDLENBQUM7SUFDYixTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ2xCLFlBQW1CLFFBQThCO1FBQTlCLGFBQVEsR0FBUixRQUFRLENBQXNCO0lBRWpELENBQUM7SUFDRCxJQUFJO1FBQ0EsSUFBRyxDQUFDLElBQUksQ0FBQyxTQUFTO1lBQ2QsT0FBTyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxLQUFLO1FBQ0QsSUFBRyxJQUFJLENBQUMsU0FBUztZQUNiLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdkIsSUFBSSxTQUFTLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxHQUFDLElBQUksQ0FBQztRQUN2QyxNQUFNLE1BQU0sR0FBRyxHQUFHLEVBQUU7WUFDaEIsSUFBRyxJQUFJLENBQUMsUUFBUSxJQUFJLEVBQUUsRUFBRSxDQUFDO2dCQUNyQixPQUFPO1lBQ1gsQ0FBQztZQUNELElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBQyxJQUFJLENBQUM7WUFDakMsSUFBSSxFQUFFLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQztZQUN6QixTQUFTLEdBQUcsR0FBRyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbEIscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFBO1FBQ0QsTUFBTSxFQUFFLENBQUM7UUFDVCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAzRC8yRCBKUyBHYW1lIEVuZ2luZSBMaWJyYXJ5XHJcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zbGxlbmRlcmJyaW5lXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBFTUFUSCBDTEFTUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRU1hdGgge1xyXG4gICAgc3RhdGljIGNsYW1wKG46IG51bWJlcixhOiBudW1iZXIsYjogbnVtYmVyKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KG4sYSksYik7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgbGVycChhOiBudW1iZXIsYjogbnVtYmVyLHQ6IG51bWJlcikgOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBhKyhiLWEpKnQ7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcG1vZCh4OiBudW1iZXIsYTogbnVtYmVyKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICgoeCVhKSthKSVhO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGlzQ2xvc2UoYTogbnVtYmVyLCBiOiBudW1iZXIsIGU6IG51bWJlciA9IDFlLTYpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hYnMoYS1iKSA8IGU7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgaXNaZXJvKHY6IG51bWJlciwgZTogbnVtYmVyID0gMWUtNikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFicyh2KSA8IGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIFZFQ1RPUiBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBWZWMzIHtcclxuICAgIHg6IG51bWJlcjtcclxuICAgIHk6IG51bWJlcjtcclxuICAgIHo6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKHY6IFZlYzMgfCB7eDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcn0pO1xyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik7XHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIgfCB7eDpudW1iZXIsIHk6bnVtYmVyLCB6Om51bWJlcn0sIHk/OiBudW1iZXIsIHo/OiBudW1iZXIpIHtcclxuICAgICAgICBpZih0eXBlb2YgeCA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB4Lng7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHgueTtcclxuICAgICAgICAgICAgdGhpcy56ID0geC56O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHkhO1xyXG4gICAgICAgICAgICB0aGlzLnogPSB6ITtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU3RhdGljIENvbnN0cnVjdG9yc1xyXG4gICAgc3RhdGljIGZpbGwobjogbnVtYmVyKTogVmVjMyB7IHJldHVybiBuZXcgVmVjMyhuLCBuLCBuKTsgfVxyXG4gICAgc3RhdGljIHplcm8oKTogVmVjMyB7IHJldHVybiBWZWMzLmZpbGwoMCk7IH1cclxuICAgIHN0YXRpYyBvbmUoKTogVmVjMyB7IHJldHVybiBWZWMzLmZpbGwoMSk7IH1cclxuICAgIHN0YXRpYyB4QXhpcygpOiBWZWMzIHsgcmV0dXJuIG5ldyBWZWMzKDEsIDAsIDApOyB9XHJcbiAgICBzdGF0aWMgeUF4aXMoKTogVmVjMyB7IHJldHVybiBuZXcgVmVjMygwLCAxLCAwKTsgfVxyXG4gICAgc3RhdGljIHpBeGlzKCk6IFZlYzMgeyByZXR1cm4gbmV3IFZlYzMoMCwgMCwgMSk7IH1cclxuICAgIHN0YXRpYyByYW5kb20oKTogVmVjMyB7XHJcbiAgICAgICAgY29uc3QgeiA9IE1hdGgucmFuZG9tKCkgKiAyIC0gMTtcclxuICAgICAgICBjb25zdCBhID0gTWF0aC5yYW5kb20oKSAqIDIgKiBNYXRoLlBJO1xyXG4gICAgICAgIGNvbnN0IGIgPSBNYXRoLnNxcnQoTWF0aC5tYXgoMCwgMSAtIHogKiB6KSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKGIgKiBNYXRoLmNvcyhhKSwgYiAqIE1hdGguc2luKGEpLCB6KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyByYW5kb21Sb3RhdGlvbigpOiBWZWMzIHtcclxuICAgICAgICBjb25zdCB2ID0gVmVjMy5yYW5kb20oKTtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModi5waXRjaCgpLCB2LnlhdygpLCBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1pc2NlbGxhbmVvdXNcclxuICAgIGdldChpOiBudW1iZXIpOiBudW1iZXIgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIHN3aXRjaChpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIHRoaXMueDtcclxuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gdGhpcy55O1xyXG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiB0aGlzLno7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBzZXQoaTogbnVtYmVyLCB2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBzd2l0Y2goaSkge1xyXG4gICAgICAgICAgICBjYXNlIDA6IHRoaXMueCA9IHY7IHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSAxOiB0aGlzLnkgPSB2OyByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgMjogdGhpcy56ID0gdjsgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNldEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLnogPSB6O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xyXG4gICAgICAgIHlpZWxkIHRoaXMueDtcclxuICAgICAgICB5aWVsZCB0aGlzLnk7XHJcbiAgICAgICAgeWllbGQgdGhpcy56O1xyXG4gICAgfVxyXG4gICAgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gYDwke3RoaXMueC50b0ZpeGVkKDIpfSwgJHt0aGlzLnkudG9GaXhlZCgyKX0sICR7dGhpcy56LnRvRml4ZWQoMil9PmA7XHJcbiAgICB9XHJcbiAgICB0b0FycmF5KCk6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLngsIHRoaXMueSwgdGhpcy56XTtcclxuICAgIH1cclxuICAgIGNsb25lKCk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzKTtcclxuICAgIH1cclxuICAgIGdldEF4aXNCaXQoKTogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBheCA9IE1hdGguYWJzKHRoaXMueCk7XHJcbiAgICAgICAgY29uc3QgYXkgPSBNYXRoLmFicyh0aGlzLnkpO1xyXG4gICAgICAgIGNvbnN0IGF6ID0gTWF0aC5hYnModGhpcy56KTtcclxuICAgICAgICBpZihheCA+IGF5KSB7XHJcbiAgICAgICAgICAgIGlmKGF4ID4gYXopIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwYjEwMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwYjAwMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmKGF5ID4gYXopIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwYjAxMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwYjAwMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxjdWxhdGlvbnNcclxuICAgIGxlbmd0aCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy5kb3QodGhpcykpO1xyXG4gICAgfVxyXG4gICAgZG90KG90aGVyOiBWZWMzKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ICogb3RoZXIueCArIHRoaXMueSAqIG90aGVyLnkgKyB0aGlzLnogKiBvdGhlci56O1xyXG4gICAgfVxyXG4gICAgZG90Qyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ICogeCArIHRoaXMueSAqIHkgKyB0aGlzLnogKiB6O1xyXG4gICAgfVxyXG4gICAgY3Jvc3Mob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy55ICogb3RoZXIueiAtIHRoaXMueiAqIG90aGVyLnksIC0gKHRoaXMueCAqIG90aGVyLnogLSB0aGlzLnogKiBvdGhlci54KSwgdGhpcy54ICogb3RoZXIueSAtIHRoaXMueSAqIG90aGVyLngpO1xyXG4gICAgfVxyXG4gICAgY3Jvc3NDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy55ICogeiAtIHRoaXMueiAqIHksIC0gKHRoaXMueCAqIHogLSB0aGlzLnogKiB4KSwgdGhpcy54ICogeSAtIHRoaXMueSAqIHgpO1xyXG4gICAgfVxyXG4gICAgYW5nbGUob3RoZXI6IFZlYzMpOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGMgPSB0aGlzLmxlbmd0aCgpICogb3RoZXIubGVuZ3RoKCk7XHJcbiAgICAgICAgaWYoYyA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWNvcyhFTWF0aC5jbGFtcCh0aGlzLmRvdChvdGhlcikgLyBjLCAtMSwgMSkpO1xyXG4gICAgfVxyXG4gICAgc2lnbmVkQW5nbGUob3RoZXI6IFZlYzMsIHJlZmVyZW5jZTogVmVjMyA9IFZlYzMueUF4aXMoKSk6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgYW5nbGUgPSB0aGlzLmFuZ2xlKG90aGVyKTtcclxuICAgICAgICBjb25zdCBub3JtYWwgPSB0aGlzLmNyb3NzKG90aGVyKS5ub3JtU2VsZigpO1xyXG4gICAgICAgIGlmKG5vcm1hbC5kb3QocmVmZXJlbmNlLm5vcm0oKSkgPiAwKVxyXG4gICAgICAgICAgICByZXR1cm4gLWFuZ2xlO1xyXG4gICAgICAgIHJldHVybiBhbmdsZTtcclxuICAgIH1cclxuICAgIGRpc3Qob3RoZXI6IFZlYzMpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN1YihvdGhlcikubGVuZ3RoKCk7XHJcbiAgICB9XHJcbiAgICBkaXN0Qyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdWJDKHgsIHksIHopLmxlbmd0aCgpO1xyXG4gICAgfVxyXG4gICAgc3RyaWN0RXF1YWxzKG90aGVyOiBWZWMzKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCA9PSBvdGhlci54ICYmIHRoaXMueSA9PSBvdGhlci55ICYmIHRoaXMueiA9PSBvdGhlci56O1xyXG4gICAgfVxyXG4gICAgaXNDbG9zZShvdGhlcjogVmVjMywgZSA9IDFlLTYpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gRU1hdGguaXNDbG9zZSh0aGlzLngsIG90aGVyLngsIGUpICYmIEVNYXRoLmlzQ2xvc2UodGhpcy55LCBvdGhlci55LCBlKSAmJiBFTWF0aC5pc0Nsb3NlKHRoaXMueiwgb3RoZXIueiwgZSk7XHJcbiAgICB9XHJcbiAgICBpc1plcm8oZSA9IDFlLTYpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gRU1hdGguaXNaZXJvKHRoaXMueCwgZSkgJiYgRU1hdGguaXNaZXJvKHRoaXMueSwgZSkgJiYgRU1hdGguaXNaZXJvKHRoaXMueiwgZSk7XHJcbiAgICB9XHJcbiAgICBwaXRjaCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFzaW4odGhpcy55KTtcclxuICAgIH1cclxuICAgIHlhdygpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKC10aGlzLngsIC10aGlzLnopO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE9wZXJhdGlvbnNcclxuICAgIGFkZChvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLnggKyBvdGhlci54LCB0aGlzLnkgKyBvdGhlci55LCB0aGlzLnogKyBvdGhlci56KTtcclxuICAgIH1cclxuICAgIGFkZFNlbGYob3RoZXI6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKz0gb3RoZXIueDtcclxuICAgICAgICB0aGlzLnkgKz0gb3RoZXIueTtcclxuICAgICAgICB0aGlzLnogKz0gb3RoZXIuejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLnggKyB4LCB0aGlzLnkgKyB5LCB0aGlzLnogKyB6KTtcclxuICAgIH1cclxuICAgIGFkZFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKz0geDtcclxuICAgICAgICB0aGlzLnkgKz0geTtcclxuICAgICAgICB0aGlzLnogKz0gejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZEYobjogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMueCArIG4sIHRoaXMueSArIG4sIHRoaXMueiArIG4pO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICs9IG47XHJcbiAgICAgICAgdGhpcy55ICs9IG47XHJcbiAgICAgICAgdGhpcy56ICs9IG47XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWQob3RoZXI6IFZlYzMsIHM6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuYWRkU2NhbGVkU2VsZihvdGhlciwgcyk7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWRTZWxmKG90aGVyOiBWZWMzLCBzOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKz0gb3RoZXIueCAqIHM7XHJcbiAgICAgICAgdGhpcy55ICs9IG90aGVyLnkgKiBzO1xyXG4gICAgICAgIHRoaXMueiArPSBvdGhlci56ICogcztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgczogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5hZGRTY2FsZWRTZWxmQyh4LCB5LCB6LCBzKTtcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHM6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCArPSB4ICogcztcclxuICAgICAgICB0aGlzLnkgKz0geSAqIHM7XHJcbiAgICAgICAgdGhpcy56ICs9IHogKiBzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3ViKG90aGVyOiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMueCAtIG90aGVyLngsIHRoaXMueSAtIG90aGVyLnksIHRoaXMueiAtIG90aGVyLnopO1xyXG4gICAgfVxyXG4gICAgc3ViU2VsZihvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAtPSBvdGhlci54O1xyXG4gICAgICAgIHRoaXMueSAtPSBvdGhlci55O1xyXG4gICAgICAgIHRoaXMueiAtPSBvdGhlci56O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3ViQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMueCAtIHgsIHRoaXMueSAtIHksIHRoaXMueiAtIHopO1xyXG4gICAgfVxyXG4gICAgc3ViU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAtPSB4O1xyXG4gICAgICAgIHRoaXMueSAtPSB5O1xyXG4gICAgICAgIHRoaXMueiAtPSB6O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3ViRihuOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy54IC0gbiwgdGhpcy55IC0gbiwgdGhpcy56IC0gbik7XHJcbiAgICB9XHJcbiAgICBzdWJTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggLT0gbjtcclxuICAgICAgICB0aGlzLnkgLT0gbjtcclxuICAgICAgICB0aGlzLnogLT0gbjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJzdWIob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMob3RoZXIueCAtIHRoaXMueCwgb3RoZXIueSAtIHRoaXMueSwgb3RoZXIueiAtIHRoaXMueik7XHJcbiAgICB9XHJcbiAgICByc3ViU2VsZihvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCA9IG90aGVyLnggLSB0aGlzLng7XHJcbiAgICAgICAgdGhpcy55ID0gb3RoZXIueSAtIHRoaXMueTtcclxuICAgICAgICB0aGlzLnogPSBvdGhlci56IC0gdGhpcy56O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcnN1YkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh4IC0gdGhpcy54LCB5IC0gdGhpcy55LCB6IC0gdGhpcy56KTtcclxuICAgIH1cclxuICAgIHJzdWJTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0geCAtIHRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSB5IC0gdGhpcy55O1xyXG4gICAgICAgIHRoaXMueiA9IHogLSB0aGlzLno7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByc3ViRihuOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMobiAtIHRoaXMueCwgbiAtIHRoaXMueSwgbiAtIHRoaXMueik7XHJcbiAgICB9XHJcbiAgICByc3ViU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0gbiAtIHRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSBuIC0gdGhpcy55O1xyXG4gICAgICAgIHRoaXMueiA9IG4gLSB0aGlzLno7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBtdWwob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy54ICogb3RoZXIueCwgdGhpcy55ICogb3RoZXIueSwgdGhpcy56ICogb3RoZXIueik7XHJcbiAgICB9XHJcbiAgICBtdWxTZWxmKG90aGVyOiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICo9IG90aGVyLng7XHJcbiAgICAgICAgdGhpcy55ICo9IG90aGVyLnk7XHJcbiAgICAgICAgdGhpcy56ICo9IG90aGVyLno7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBtdWxDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy54ICogeCwgdGhpcy55ICogeSwgdGhpcy56ICogeik7XHJcbiAgICB9XHJcbiAgICBtdWxTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICo9IHg7XHJcbiAgICAgICAgdGhpcy55ICo9IHk7XHJcbiAgICAgICAgdGhpcy56ICo9IHo7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBtdWxGKG46IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLnggKiBuLCB0aGlzLnkgKiBuLCB0aGlzLnogKiBuKTtcclxuICAgIH1cclxuICAgIG11bFNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAqPSBuO1xyXG4gICAgICAgIHRoaXMueSAqPSBuO1xyXG4gICAgICAgIHRoaXMueiAqPSBuO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZGl2KG90aGVyOiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMueCAvIG90aGVyLngsIHRoaXMueSAvIG90aGVyLnksIHRoaXMueiAvIG90aGVyLnopO1xyXG4gICAgfVxyXG4gICAgZGl2U2VsZihvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAvPSBvdGhlci54O1xyXG4gICAgICAgIHRoaXMueSAvPSBvdGhlci55O1xyXG4gICAgICAgIHRoaXMueiAvPSBvdGhlci56O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZGl2Qyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMueCAvIHgsIHRoaXMueSAvIHksIHRoaXMueiAvIHopO1xyXG4gICAgfVxyXG4gICAgZGl2U2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAvPSB4O1xyXG4gICAgICAgIHRoaXMueSAvPSB5O1xyXG4gICAgICAgIHRoaXMueiAvPSB6O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZGl2RihuOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy54IC8gbiwgdGhpcy55IC8gbiwgdGhpcy56IC8gbik7XHJcbiAgICB9XHJcbiAgICBkaXZTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggLz0gbjtcclxuICAgICAgICB0aGlzLnkgLz0gbjtcclxuICAgICAgICB0aGlzLnogLz0gbjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJkaXYob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMob3RoZXIueCAvIHRoaXMueCwgb3RoZXIueSAvIHRoaXMueSwgb3RoZXIueiAvIHRoaXMueik7XHJcbiAgICB9XHJcbiAgICByZGl2U2VsZihvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCA9IG90aGVyLnggLyB0aGlzLng7XHJcbiAgICAgICAgdGhpcy55ID0gb3RoZXIueSAvIHRoaXMueTtcclxuICAgICAgICB0aGlzLnogPSBvdGhlci56IC8gdGhpcy56O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmRpdkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh4IC8gdGhpcy54LCB5IC8gdGhpcy55LCB6IC8gdGhpcy56KTtcclxuICAgIH1cclxuICAgIHJkaXZTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0geCAvIHRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSB5IC8gdGhpcy55O1xyXG4gICAgICAgIHRoaXMueiA9IHogLyB0aGlzLno7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByZGl2RihuOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMobiAvIHRoaXMueCwgbiAvIHRoaXMueSwgbiAvIHRoaXMueik7XHJcbiAgICB9XHJcbiAgICByZGl2U2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0gbiAvIHRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSBuIC8gdGhpcy55O1xyXG4gICAgICAgIHRoaXMueiA9IG4gLyB0aGlzLno7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBuZWcoKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKC10aGlzLngsIC10aGlzLnksIC10aGlzLnopO1xyXG4gICAgfVxyXG4gICAgbmVnU2VsZigpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSAtdGhpcy54O1xyXG4gICAgICAgIHRoaXMueSA9IC10aGlzLnk7XHJcbiAgICAgICAgdGhpcy56ID0gLXRoaXMuejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGxlcnAob3RoZXI6IFZlYzMsIHQ6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubGVycFNlbGYob3RoZXIsIHQpO1xyXG4gICAgfVxyXG4gICAgbGVycFNlbGYob3RoZXI6IFZlYzMsIHQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCArPSAob3RoZXIueCAtIHRoaXMueCkgKiB0O1xyXG4gICAgICAgIHRoaXMueSArPSAob3RoZXIueSAtIHRoaXMueSkgKiB0O1xyXG4gICAgICAgIHRoaXMueiArPSAob3RoZXIueiAtIHRoaXMueikgKiB0O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbGVycEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdDogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sZXJwU2VsZkMoeCwgeSwgeiwgdCk7XHJcbiAgICB9XHJcbiAgICBsZXJwU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICs9ICh4IC0gdGhpcy54KSAqIHQ7XHJcbiAgICAgICAgdGhpcy55ICs9ICh5IC0gdGhpcy55KSAqIHQ7XHJcbiAgICAgICAgdGhpcy56ICs9ICh6IC0gdGhpcy56KSAqIHQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBub3JtKCk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubm9ybVNlbGYoKTtcclxuICAgIH1cclxuICAgIG5vcm1TZWxmKCk6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IG1hZyA9IHRoaXMubGVuZ3RoKCk7XHJcbiAgICAgICAgaWYobWFnID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICByZXR1cm4gdGhpcy5kaXZTZWxmQyhtYWcsIG1hZywgbWFnKTtcclxuICAgIH1cclxuICAgIHJlc2NhbGUobWFnOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJlc2NhbGVTZWxmKG1hZyk7XHJcbiAgICB9XHJcbiAgICByZXNjYWxlU2VsZihtYWc6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1TZWxmKCkubXVsU2VsZkMobWFnLCBtYWcsIG1hZyk7XHJcbiAgICB9XHJcbiAgICBsb29rKG90aGVyOiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sb29rU2VsZihvdGhlcik7XHJcbiAgICB9XHJcbiAgICBsb29rU2VsZihvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJzdWJTZWxmKG90aGVyKS5ub3JtU2VsZigpO1xyXG4gICAgfVxyXG4gICAgY2xhbXBMZW5ndGgoYTogbnVtYmVyLCBiOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmNsYW1wTGVuZ3RoU2VsZihhLCBiKTtcclxuICAgIH1cclxuICAgIGNsYW1wTGVuZ3RoU2VsZihhOiBudW1iZXIsIGI6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc2NhbGVTZWxmKEVNYXRoLmNsYW1wKHRoaXMubGVuZ3RoKCksIGEsIGIpKTtcclxuICAgIH1cclxuICAgIGZsYXQoKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5mbGF0U2VsZigpO1xyXG4gICAgfVxyXG4gICAgZmxhdFNlbGYoKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy55ID0gMDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGZsYXROb3JtKCk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuZmxhdE5vcm1TZWxmKCk7XHJcbiAgICB9XHJcbiAgICBmbGF0Tm9ybVNlbGYoKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmxhdFNlbGYoKS5ub3JtU2VsZigpO1xyXG4gICAgfVxyXG4gICAgc2V0RG90KG90aGVyOiBWZWMzLCB0YXJnZXQ6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuc2V0RG90U2VsZihvdGhlciwgdGFyZ2V0KTtcclxuICAgIH1cclxuICAgIHNldERvdFNlbGYob3RoZXI6IFZlYzMsIHRhcmdldDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgZCA9IG90aGVyLmRvdChvdGhlcik7XHJcbiAgICAgICAgaWYoZCA9PT0gMCkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkU2NhbGVkU2VsZihvdGhlciwgKHRhcmdldCAtIHRoaXMuZG90KG90aGVyKSkgLyBkKTtcclxuICAgIH1cclxuICAgIHNldERvdEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdGFyZ2V0OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnNldERvdFNlbGZDKHgsIHksIHosIHRhcmdldCk7XHJcbiAgICB9XHJcbiAgICBzZXREb3RTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IGQgPSB4KnggKyB5KnkgKyB6Kno7XHJcbiAgICAgICAgaWYoZCA9PT0gMCkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkU2NhbGVkU2VsZkMoeCwgeSwgeiwgKHRhcmdldCAtIHRoaXMuZG90Qyh4LCB5LCB6KSkgLyBkKTtcclxuICAgIH1cclxuICAgIG1hcChtZXRob2Q6ICh4OiBudW1iZXIsIGk6IG51bWJlcikgPT4gbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5tYXBTZWxmKG1ldGhvZCk7XHJcbiAgICB9XHJcbiAgICBtYXBTZWxmKG1ldGhvZDogKHg6IG51bWJlciwgaTogbnVtYmVyKSA9PiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSBtZXRob2QodGhpcy54LCAwKTtcclxuICAgICAgICB0aGlzLnkgPSBtZXRob2QodGhpcy55LCAxKTtcclxuICAgICAgICB0aGlzLnogPSBtZXRob2QodGhpcy56LCAyKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdFgoYTogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RYU2VsZihhKTtcclxuICAgIH1cclxuICAgIHJvdFhTZWxmKGE6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhKSwgYyA9IE1hdGguY29zKGEpO1xyXG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLnkgKiBjIC0gdGhpcy56ICogcztcclxuICAgICAgICB0aGlzLnogPSB0aGlzLnkgKiBzICsgdGhpcy56ICogYztcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm90WShhOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdFlTZWxmKGEpO1xyXG4gICAgfVxyXG4gICAgcm90WVNlbGYoYTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGEpLCBjID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3QgeiA9IHRoaXMueiAqIGMgLSB0aGlzLnggKiBzO1xyXG4gICAgICAgIHRoaXMueCA9IHRoaXMueCAqIGMgKyB0aGlzLnogKiBzO1xyXG4gICAgICAgIHRoaXMueiA9IHo7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByb3RaKGE6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90WlNlbGYoYSk7XHJcbiAgICB9XHJcbiAgICByb3RaU2VsZihhOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSksIGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCB4ID0gdGhpcy54ICogYyAtIHRoaXMueSAqIHM7XHJcbiAgICAgICAgdGhpcy55ID0gdGhpcy54ICogcyArIHRoaXMueSAqIGM7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdEF4aXMoYXhpczogVmVjMywgYW5nbGU6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90QXhpc1NlbGYoYXhpcywgYW5nbGUpO1xyXG4gICAgfVxyXG4gICAgcm90QXhpc1NlbGYoYXhpczogVmVjMywgYW5nbGU6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGF4aXMgPSBheGlzLm5vcm0oKTtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYW5nbGUpLCBjID0gTWF0aC5jb3MoYW5nbGUpO1xyXG4gICAgICAgIGNvbnN0IGNyb3NzID0gYXhpcy5jcm9zcyh0aGlzKTtcclxuICAgICAgICBjb25zdCBkb3QgPSBheGlzLmRvdCh0aGlzKTtcclxuICAgICAgICBsZXQgeCA9IHRoaXMueCwgeSA9IHRoaXMueSwgeiA9IHRoaXMuejtcclxuICAgICAgICB0aGlzLnggPSB4ICogYyArIGNyb3NzLnggKiBzICsgYXhpcy54ICogZG90ICogKDEgLSBjKTtcclxuICAgICAgICB0aGlzLnkgPSB5ICogYyArIGNyb3NzLnkgKiBzICsgYXhpcy55ICogZG90ICogKDEgLSBjKTtcclxuICAgICAgICB0aGlzLnogPSB6ICogYyArIGNyb3NzLnogKiBzICsgYXhpcy56ICogZG90ICogKDEgLSBjKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdFhZWihyb3Q6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdFhZWlNlbGYocm90KTtcclxuICAgIH1cclxuICAgIHJvdFhZWlNlbGYocm90OiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90WFNlbGYocm90LngpLnJvdFlTZWxmKHJvdC55KS5yb3RaU2VsZihyb3Queik7XHJcbiAgICB9XHJcbiAgICByb3RYWVpDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdFhZWlNlbGZDKHgsIHksIHopO1xyXG4gICAgfVxyXG4gICAgcm90WFlaU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvdFhTZWxmKHgpLnJvdFlTZWxmKHkpLnJvdFpTZWxmKHopO1xyXG4gICAgfVxyXG4gICAgcm90WllYKHJvdDogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90WllYU2VsZihyb3QpO1xyXG4gICAgfVxyXG4gICAgcm90WllYU2VsZihyb3Q6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3RaU2VsZihyb3Queikucm90WVNlbGYocm90LnkpLnJvdFhTZWxmKHJvdC54KTtcclxuICAgIH1cclxuICAgIHJvdFpZWEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90WllYU2VsZkMoeCwgeSwgeik7XHJcbiAgICB9XHJcbiAgICByb3RaWVhTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90WlNlbGYoeikucm90WVNlbGYoeSkucm90WFNlbGYoeCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBWZWMyIHtcclxuICAgIHg6IG51bWJlcjtcclxuICAgIHk6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKHY6IFZlYzIgfCB7eDogbnVtYmVyLCB5OiBudW1iZXJ9KTtcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKTtcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciB8IHt4Om51bWJlciwgeTpudW1iZXJ9LCB5PzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYodHlwZW9mIHggPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0geC54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSB4Lnk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICAgICAgdGhpcy55ID0geSE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFN0YXRpYyBDb25zdHJ1Y3RvcnNcclxuICAgIHN0YXRpYyBmaWxsKG46IG51bWJlcik6IFZlYzIgeyByZXR1cm4gbmV3IFZlYzIobiwgbik7IH1cclxuICAgIHN0YXRpYyB6ZXJvKCk6IFZlYzIgeyByZXR1cm4gVmVjMi5maWxsKDApOyB9XHJcbiAgICBzdGF0aWMgb25lKCk6IFZlYzIgeyByZXR1cm4gVmVjMi5maWxsKDEpOyB9XHJcbiAgICBzdGF0aWMgeEF4aXMoKTogVmVjMiB7IHJldHVybiBuZXcgVmVjMigxLCAwKTsgfVxyXG4gICAgc3RhdGljIHlBeGlzKCk6IFZlYzIgeyByZXR1cm4gbmV3IFZlYzIoMCwgMSk7IH1cclxuICAgIHN0YXRpYyByYW5kb20oKTogVmVjMiB7XHJcbiAgICAgICAgY29uc3QgYSA9IE1hdGgucmFuZG9tKCkgKiAyICogTWF0aC5QSTtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoTWF0aC5jb3MoYSksIE1hdGguc2luKGEpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBNaXNjZWxsYW5lb3VzXHJcbiAgICBnZXQoaTogbnVtYmVyKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBzd2l0Y2goaSkge1xyXG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiB0aGlzLng7XHJcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIHRoaXMueTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIHNldChpOiBudW1iZXIsIHY6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHN3aXRjaChpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDogdGhpcy54ID0gdjsgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIDE6IHRoaXMueSA9IHY7IHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzZXRDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xyXG4gICAgICAgIHlpZWxkIHRoaXMueDtcclxuICAgICAgICB5aWVsZCB0aGlzLnk7XHJcbiAgICB9XHJcbiAgICB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBgPCR7dGhpcy54LnRvRml4ZWQoMil9LCAke3RoaXMueS50b0ZpeGVkKDIpfT5gO1xyXG4gICAgfVxyXG4gICAgdG9BcnJheSgpOiBbbnVtYmVyLCBudW1iZXJdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMueCwgdGhpcy55XTtcclxuICAgIH1cclxuICAgIGNsb25lKCk6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxjdWxhdGlvbnNcclxuICAgIGxlbmd0aCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy5kb3QodGhpcykpO1xyXG4gICAgfVxyXG4gICAgZG90KG90aGVyOiBWZWMyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ICogb3RoZXIueCArIHRoaXMueSAqIG90aGVyLnk7XHJcbiAgICB9XHJcbiAgICBkb3RDKHg6IG51bWJlciwgeTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ICogeCArIHRoaXMueSAqIHk7XHJcbiAgICB9XHJcbiAgICBhbmdsZShvdGhlcjogVmVjMik6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgYyA9IHRoaXMubGVuZ3RoKCkgKiBvdGhlci5sZW5ndGgoKTtcclxuICAgICAgICBpZihjID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICByZXR1cm4gTWF0aC5hY29zKEVNYXRoLmNsYW1wKHRoaXMuZG90KG90aGVyKSAvIGMsIC0xLCAxKSk7XHJcbiAgICB9XHJcbiAgICBzaWduZWRBbmdsZShvdGhlcjogVmVjMik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodGhpcy54ICogb3RoZXIueSAtIHRoaXMueSAqIG90aGVyLngsIHRoaXMuZG90KG90aGVyKSk7XHJcbiAgICB9XHJcbiAgICBkaXN0KG90aGVyOiBWZWMyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdWIob3RoZXIpLmxlbmd0aCgpO1xyXG4gICAgfVxyXG4gICAgZGlzdEMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN1YkMoeCwgeSkubGVuZ3RoKCk7XHJcbiAgICB9XHJcbiAgICBzdHJpY3RFcXVhbHMob3RoZXI6IFZlYzIpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ID09IG90aGVyLnggJiYgdGhpcy55ID09IG90aGVyLnk7XHJcbiAgICB9XHJcbiAgICBpc0Nsb3NlKG90aGVyOiBWZWMyLCBlID0gMWUtNik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5pc0Nsb3NlKHRoaXMueCwgb3RoZXIueCwgZSkgJiYgRU1hdGguaXNDbG9zZSh0aGlzLnksIG90aGVyLnksIGUpO1xyXG4gICAgfVxyXG4gICAgaXNaZXJvKGUgPSAxZS02KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIEVNYXRoLmlzWmVybyh0aGlzLngsIGUpICYmIEVNYXRoLmlzWmVybyh0aGlzLnksIGUpO1xyXG4gICAgfVxyXG4gICAgdGhldGEoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnksIHRoaXMueCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gT3BlcmF0aW9uc1xyXG4gICAgYWRkKG90aGVyOiBWZWMyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCArIG90aGVyLngsIHRoaXMueSArIG90aGVyLnkpO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCArPSBvdGhlci54O1xyXG4gICAgICAgIHRoaXMueSArPSBvdGhlci55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggKyB4LCB0aGlzLnkgKyB5KTtcclxuICAgIH1cclxuICAgIGFkZFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICs9IHg7XHJcbiAgICAgICAgdGhpcy55ICs9IHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRGKG46IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggKyBuLCB0aGlzLnkgKyBuKTtcclxuICAgIH1cclxuICAgIGFkZFNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCArPSBuO1xyXG4gICAgICAgIHRoaXMueSArPSBuO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkKG90aGVyOiBWZWMyLCBzOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmFkZFNjYWxlZFNlbGYob3RoZXIsIHMpO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkU2VsZihvdGhlcjogVmVjMiwgczogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICs9IG90aGVyLnggKiBzO1xyXG4gICAgICAgIHRoaXMueSArPSBvdGhlci55ICogcztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHM6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuYWRkU2NhbGVkU2VsZkMoeCwgeSwgcyk7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWRTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgczogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICs9IHggKiBzO1xyXG4gICAgICAgIHRoaXMueSArPSB5ICogcztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN1YihvdGhlcjogVmVjMik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggLSBvdGhlci54LCB0aGlzLnkgLSBvdGhlci55KTtcclxuICAgIH1cclxuICAgIHN1YlNlbGYob3RoZXI6IFZlYzIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggLT0gb3RoZXIueDtcclxuICAgICAgICB0aGlzLnkgLT0gb3RoZXIueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN1YkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy54IC0geCwgdGhpcy55IC0geSk7XHJcbiAgICB9XHJcbiAgICBzdWJTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAtPSB4O1xyXG4gICAgICAgIHRoaXMueSAtPSB5O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3ViRihuOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy54IC0gbiwgdGhpcy55IC0gbik7XHJcbiAgICB9XHJcbiAgICBzdWJTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggLT0gbjtcclxuICAgICAgICB0aGlzLnkgLT0gbjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJzdWIob3RoZXI6IFZlYzIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIob3RoZXIueCAtIHRoaXMueCwgb3RoZXIueSAtIHRoaXMueSk7XHJcbiAgICB9XHJcbiAgICByc3ViU2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCA9IG90aGVyLnggLSB0aGlzLng7XHJcbiAgICAgICAgdGhpcy55ID0gb3RoZXIueSAtIHRoaXMueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJzdWJDKHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHggLSB0aGlzLngsIHkgLSB0aGlzLnkpO1xyXG4gICAgfVxyXG4gICAgcnN1YlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0geCAtIHRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSB5IC0gdGhpcy55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcnN1YkYobjogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKG4gLSB0aGlzLngsIG4gLSB0aGlzLnkpO1xyXG4gICAgfVxyXG4gICAgcnN1YlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCA9IG4gLSB0aGlzLng7XHJcbiAgICAgICAgdGhpcy55ID0gbiAtIHRoaXMueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG11bChvdGhlcjogVmVjMik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggKiBvdGhlci54LCB0aGlzLnkgKiBvdGhlci55KTtcclxuICAgIH1cclxuICAgIG11bFNlbGYob3RoZXI6IFZlYzIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKj0gb3RoZXIueDtcclxuICAgICAgICB0aGlzLnkgKj0gb3RoZXIueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG11bEMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy54ICogeCwgdGhpcy55ICogeSk7XHJcbiAgICB9XHJcbiAgICBtdWxTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAqPSB4O1xyXG4gICAgICAgIHRoaXMueSAqPSB5O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbXVsRihuOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy54ICogbiwgdGhpcy55ICogbik7XHJcbiAgICB9XHJcbiAgICBtdWxTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKj0gbjtcclxuICAgICAgICB0aGlzLnkgKj0gbjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGRpdihvdGhlcjogVmVjMik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggLyBvdGhlci54LCB0aGlzLnkgLyBvdGhlci55KTtcclxuICAgIH1cclxuICAgIGRpdlNlbGYob3RoZXI6IFZlYzIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggLz0gb3RoZXIueDtcclxuICAgICAgICB0aGlzLnkgLz0gb3RoZXIueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGRpdkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy54IC8geCwgdGhpcy55IC8geSk7XHJcbiAgICB9XHJcbiAgICBkaXZTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAvPSB4O1xyXG4gICAgICAgIHRoaXMueSAvPSB5O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZGl2RihuOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy54IC8gbiwgdGhpcy55IC8gbik7XHJcbiAgICB9XHJcbiAgICBkaXZTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggLz0gbjtcclxuICAgICAgICB0aGlzLnkgLz0gbjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJkaXYob3RoZXI6IFZlYzIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIob3RoZXIueCAvIHRoaXMueCwgb3RoZXIueSAvIHRoaXMueSk7XHJcbiAgICB9XHJcbiAgICByZGl2U2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCA9IG90aGVyLnggLyB0aGlzLng7XHJcbiAgICAgICAgdGhpcy55ID0gb3RoZXIueSAvIHRoaXMueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJkaXZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHggLyB0aGlzLngsIHkgLyB0aGlzLnkpO1xyXG4gICAgfVxyXG4gICAgcmRpdlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0geCAvIHRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSB5IC8gdGhpcy55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmRpdkYobjogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKG4gLyB0aGlzLngsIG4gLyB0aGlzLnkpO1xyXG4gICAgfVxyXG4gICAgcmRpdlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCA9IG4gLyB0aGlzLng7XHJcbiAgICAgICAgdGhpcy55ID0gbiAvIHRoaXMueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG5lZygpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoLXRoaXMueCwgLXRoaXMueSk7XHJcbiAgICB9XHJcbiAgICBuZWdTZWxmKCk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCA9IC10aGlzLng7XHJcbiAgICAgICAgdGhpcy55ID0gLXRoaXMueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGxlcnAob3RoZXI6IFZlYzIsIHQ6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubGVycFNlbGYob3RoZXIsIHQpO1xyXG4gICAgfVxyXG4gICAgbGVycFNlbGYob3RoZXI6IFZlYzIsIHQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCArPSAob3RoZXIueCAtIHRoaXMueCkgKiB0O1xyXG4gICAgICAgIHRoaXMueSArPSAob3RoZXIueSAtIHRoaXMueSkgKiB0O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbGVycEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHQ6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubGVycFNlbGZDKHgsIHksIHQpO1xyXG4gICAgfVxyXG4gICAgbGVycFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKz0gKHggLSB0aGlzLngpICogdDtcclxuICAgICAgICB0aGlzLnkgKz0gKHkgLSB0aGlzLnkpICogdDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG5vcm0oKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5ub3JtU2VsZigpO1xyXG4gICAgfVxyXG4gICAgbm9ybVNlbGYoKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgbWFnID0gdGhpcy5sZW5ndGgoKTtcclxuICAgICAgICBpZihtYWcgPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdlNlbGZDKG1hZywgbWFnKTtcclxuICAgIH1cclxuICAgIHJlc2NhbGUobWFnOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJlc2NhbGVTZWxmKG1hZyk7XHJcbiAgICB9XHJcbiAgICByZXNjYWxlU2VsZihtYWc6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1TZWxmKCkubXVsU2VsZkMobWFnLCBtYWcpO1xyXG4gICAgfVxyXG4gICAgbG9vayhvdGhlcjogVmVjMik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubG9va1NlbGYob3RoZXIpO1xyXG4gICAgfVxyXG4gICAgbG9va1NlbGYob3RoZXI6IFZlYzIpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yc3ViU2VsZihvdGhlcikubm9ybVNlbGYoKTtcclxuICAgIH1cclxuICAgIGNsYW1wTGVuZ3RoKGE6IG51bWJlciwgYjogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5jbGFtcExlbmd0aFNlbGYoYSwgYik7XHJcbiAgICB9XHJcbiAgICBjbGFtcExlbmd0aFNlbGYoYTogbnVtYmVyLCBiOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXNjYWxlU2VsZihFTWF0aC5jbGFtcCh0aGlzLmxlbmd0aCgpLCBhLCBiKSk7XHJcbiAgICB9XHJcbiAgICBzZXREb3Qob3RoZXI6IFZlYzIsIHRhcmdldDogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5zZXREb3RTZWxmKG90aGVyLCB0YXJnZXQpO1xyXG4gICAgfVxyXG4gICAgc2V0RG90U2VsZihvdGhlcjogVmVjMiwgdGFyZ2V0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBkID0gb3RoZXIuZG90KG90aGVyKTtcclxuICAgICAgICBpZihkID09PSAwKSByZXR1cm4gdGhpcztcclxuICAgICAgICByZXR1cm4gdGhpcy5hZGRTY2FsZWRTZWxmKG90aGVyLCAodGFyZ2V0IC0gdGhpcy5kb3Qob3RoZXIpKSAvIGQpO1xyXG4gICAgfVxyXG4gICAgc2V0RG90Qyh4OiBudW1iZXIsIHk6IG51bWJlciwgdGFyZ2V0OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnNldERvdFNlbGZDKHgsIHksIHRhcmdldCk7XHJcbiAgICB9XHJcbiAgICBzZXREb3RTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgdGFyZ2V0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBkID0geCp4ICsgeSp5O1xyXG4gICAgICAgIGlmKGQgPT09IDApIHJldHVybiB0aGlzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNjYWxlZFNlbGZDKHgsIHksICh0YXJnZXQgLSB0aGlzLmRvdEMoeCwgeSkpIC8gZCk7XHJcbiAgICB9XHJcbiAgICBtYXAobWV0aG9kOiAoeDogbnVtYmVyLCBpOiBudW1iZXIpID0+IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubWFwU2VsZihtZXRob2QpO1xyXG4gICAgfVxyXG4gICAgbWFwU2VsZihtZXRob2Q6ICh4OiBudW1iZXIsIGk6IG51bWJlcikgPT4gbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0gbWV0aG9kKHRoaXMueCwgMCk7XHJcbiAgICAgICAgdGhpcy55ID0gbWV0aG9kKHRoaXMueSwgMSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByb3RhdGUoYTogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RhdGVTZWxmKGEpO1xyXG4gICAgfVxyXG4gICAgcm90YXRlU2VsZihhOiBudW1iZXIpIDogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGEpLCBjID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3QgeCA9IHRoaXMueCwgeSA9IHRoaXMueTtcclxuICAgICAgICB0aGlzLnggPSB4ICogYyAtIHkgKiBzO1xyXG4gICAgICAgIHRoaXMueSA9IHggKiBzICsgeSAqIGM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBNQVRSSVggQ0xBU1NFUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBDb2x1bW4tbWFqb3IgNHg0IG1hdHJpeFxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0NCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgICBcclxuICAgIHN0YXRpYyBuZXcoKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgMSwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMSwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMSwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHRyYW5zbGF0ZSh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgMSwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMSwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMSwgMCxcclxuICAgICAgICAgICAgeCwgeSwgeiwgMSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHNjYWxlKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB4LCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCB5LCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCB6LCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcm90YXRlWChhOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGEpO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIDEsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIGMsIHMsIDAsXHJcbiAgICAgICAgICAgIDAsIC1zLCBjLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyByb3RhdGVZKGE6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSk7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgYywgMCwgLXMsIDAsXHJcbiAgICAgICAgICAgIDAsIDEsIDAsIDAsXHJcbiAgICAgICAgICAgIHMsIDAsIGMsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDAsIDFcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJvdGF0ZVooYTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKGEpO1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhKTtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBjLCBzLCAwLCAwLFxyXG4gICAgICAgICAgICAtcywgYywgMCwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMSwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcGVyc3BlY3RpdmUoZm92WTogbnVtYmVyLCBhc3BlY3Q6IG51bWJlciwgbmVhcjogbnVtYmVyID0gMSwgZmFyOiBudW1iZXIgPSAxMDAwKSB7XHJcbiAgICAgICAgY29uc3QgZiA9IDEgLyBNYXRoLnRhbihmb3ZZIC8gMik7XHJcbiAgICAgICAgY29uc3QgbmYgPSAxIC8gKG5lYXIgLSBmYXIpO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIGYvYXNwZWN0LCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCBmLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAoZmFyICsgbmVhcikgKiBuZiwgLTEsXHJcbiAgICAgICAgICAgIDAsIDAsICgyICogZmFyICogbmVhcikgKiBuZiwgMFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgbXVsdGlwbHkobTE6IG51bWJlcltdLCBtMjogbnVtYmVyW10pIHtcclxuICAgICAgICBjb25zdCBvdXQgPSBNYXQ0Lm5ldygpO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPDQ7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDsgajw0OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIG91dFtpKjQgKyBqXSA9IChcclxuICAgICAgICAgICAgICAgICAgICBtMVswKjQgKyBqXSEgKiBtMltpKjQgKyAwXSFcclxuICAgICAgICAgICAgICAgICAgICArIG0xWzEqNCArIGpdISAqIG0yW2kqNCArIDFdIVxyXG4gICAgICAgICAgICAgICAgICAgICsgbTFbMio0ICsgal0hICogbTJbaSo0ICsgMl0hXHJcbiAgICAgICAgICAgICAgICAgICAgKyBtMVszKjQgKyBqXSEgKiBtMltpKjQgKyAzXSFcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vIENvbHVtbi1tYWpvciAzeDMgbWF0cml4XHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNYXQzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgICBzdGF0aWMgbmV3KCkge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIDEsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDEsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDEsXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyB0cmFuc2xhdGUoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAxLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAxLCAwLFxyXG4gICAgICAgICAgICB4LCB5LCAxLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgc2NhbGUoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB4LCAwLCAwLFxyXG4gICAgICAgICAgICAwLCB5LCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAxLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcm90YXRlKGE6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSk7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgYywgcywgMCxcclxuICAgICAgICAgICAgLXMsIGMsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDEsXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBtdWx0aXBseShtMTogbnVtYmVyW10sIG0yOiBudW1iZXJbXSkge1xyXG4gICAgICAgIGNvbnN0IG91dCA9IE1hdDMubmV3KCk7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8MzsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaj0wOyBqPDM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgb3V0W2kqMyArIGpdID0gKFxyXG4gICAgICAgICAgICAgICAgICAgIG0xWzAqMyArIGpdISAqIG0yW2kqMyArIDBdIVxyXG4gICAgICAgICAgICAgICAgICAgICsgbTFbMSozICsgal0hICogbTJbaSozICsgMV0hXHJcbiAgICAgICAgICAgICAgICAgICAgKyBtMVsyKjMgKyBqXSEgKiBtMltpKjMgKyAyXSFcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmNvbnN0IGdyYWRpZW50czJEOiBWZWMyW10gPSBbXTtcclxuZm9yKGxldCBpPTA7aTwxMjtpKyspIHtcclxuICAgIGNvbnN0IGFuZ2xlID0gMiAqIE1hdGguUEkgKiBpLzEyO1xyXG4gICAgZ3JhZGllbnRzMkQucHVzaChuZXcgVmVjMihNYXRoLmNvcyhhbmdsZSksIE1hdGguc2luKGFuZ2xlKSkpO1xyXG59XHJcblxyXG5jb25zdCBncmFkaWVudHMzRDogVmVjM1tdID0gW107XHJcbmZvcihsZXQgaT0wO2k8MTY7aSsrKSB7XHJcbiAgICBjb25zdCB5ID0gMSAtICgyKmkpLygxNSk7XHJcbiAgICBjb25zdCByID0gTWF0aC5zcXJ0KDEteSp5KTtcclxuICAgIGNvbnN0IGFuZ2xlID0gaSAqIE1hdGguUEkgKiAoMy1NYXRoLnNxcnQoNSkpO1xyXG4gICAgZ3JhZGllbnRzM0QucHVzaChuZXcgVmVjMyhcclxuICAgICAgICBNYXRoLmNvcyhhbmdsZSkgKiByLFxyXG4gICAgICAgIHksXHJcbiAgICAgICAgTWF0aC5zaW4oYW5nbGUpICogcixcclxuICAgICkpO1xyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBOT0lTRSBDTEFTUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTm9pc2Uge1xyXG4gICAgc3RhdGljIGZhZGUodDogbnVtYmVyKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHQgKiB0ICogdCAqICh0ICogKHQgKiA2IC0gMTUpICsgMTApO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldFBlcmxpblZlY3RvcjJEKHg6IG51bWJlciwgeTogbnVtYmVyLCBzZWVkID0gMCkgOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gZ3JhZGllbnRzMkRbTWF0aC5mbG9vcihOb2lzZS5yYW5kb21Db25zdGFudDMoc2VlZCwgeCwgeSkgKiBncmFkaWVudHMyRC5sZW5ndGgpXSE7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0UGVybGluVmVjdG9yM0QoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgc2VlZCA9IDApIDogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIGdyYWRpZW50czNEW01hdGguZmxvb3IoTm9pc2UucmFuZG9tQ29uc3RhbnQ0KHNlZWQsIHgsIHksIHopICogZ3JhZGllbnRzM0QubGVuZ3RoKV0hO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldFZvcm9ub2lHcmlkUG9zaXRpb24yRCh4OiBudW1iZXIsIHk6IG51bWJlciwgc2VlZCA9IDAsIHQgPSAxKSA6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMihcclxuICAgICAgICAgICAgeCArIHQgKiBOb2lzZS5yYW5kb21Db25zdGFudDMoeCwgeSwgc2VlZCksXHJcbiAgICAgICAgICAgIHkgKyB0ICogTm9pc2UucmFuZG9tQ29uc3RhbnQzKHgsIHksIHNlZWQrMSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldFZvcm9ub2lHcmlkVmFsdWUyRCh4OiBudW1iZXIsIHk6IG51bWJlciwgc2VlZCA9IDApIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTm9pc2UucmFuZG9tQ29uc3RhbnQzKHgsIHksIHNlZWQrMik7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0Vm9yb25vaUdyaWRQb3NpdGlvbjNEKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHNlZWQgPSAwLCB0ID0gMSkgOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoXHJcbiAgICAgICAgICAgIHggKyB0ICogTm9pc2UucmFuZG9tQ29uc3RhbnQ0KHgsIHksIHosIHNlZWQpLFxyXG4gICAgICAgICAgICB5ICsgdCAqIE5vaXNlLnJhbmRvbUNvbnN0YW50NCh5LCB6LCB4LCBzZWVkKzEpLFxyXG4gICAgICAgICAgICB6ICsgdCAqIE5vaXNlLnJhbmRvbUNvbnN0YW50NCh6LCB4LCB5LCBzZWVkKzIpLFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0Vm9yb25vaUdyaWRWYWx1ZTNEKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHNlZWQgPSAwKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE5vaXNlLnJhbmRvbUNvbnN0YW50NCh4LCB5LCB6LCBzZWVkKzMpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHBlcmxpbk5vaXNlMkQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHNlZWQgPSAwKSA6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgZ2V0UGVybGluVmVjdG9yMkQgPSBOb2lzZS5nZXRQZXJsaW5WZWN0b3IyRDtcclxuICAgICAgICBjb25zdCBsZXJwID0gRU1hdGgubGVycDtcclxuICAgICAgICBjb25zdCBmYWRlID0gTm9pc2UuZmFkZTtcclxuICAgICAgICBjb25zdCBnMCA9IG5ldyBWZWMyKHgsIHkpLm1hcFNlbGYoTWF0aC5mbG9vcik7XHJcbiAgICAgICAgY29uc3QgZzEgPSBuZXcgVmVjMihnMCkuYWRkU2VsZkMoMSwgMSk7XHJcbiAgICAgICAgY29uc3QgZjAgPSBuZXcgVmVjMih4LCB5KS5zdWJTZWxmKGcwKTtcclxuICAgICAgICBjb25zdCBmMSA9IG5ldyBWZWMyKHgsIHkpLnN1YlNlbGYoZzEpO1xyXG4gICAgICAgIGNvbnN0IGNBQSA9IGdldFBlcmxpblZlY3RvcjJEKGcwLngsIGcwLnksIHNlZWQpLmRvdChmMCk7XHJcbiAgICAgICAgY29uc3QgY0FCID0gZ2V0UGVybGluVmVjdG9yMkQoZzAueCwgZzEueSwgc2VlZCkuZG90QyhmMC54LCBmMS55KTtcclxuICAgICAgICBjb25zdCBjQkEgPSBnZXRQZXJsaW5WZWN0b3IyRChnMS54LCBnMC55LCBzZWVkKS5kb3RDKGYxLngsIGYwLnkpO1xyXG4gICAgICAgIGNvbnN0IGNCQiA9IGdldFBlcmxpblZlY3RvcjJEKGcxLngsIGcxLnksIHNlZWQpLmRvdChmMSk7XHJcbiAgICAgICAgY29uc3QgdHggPSBmYWRlKGYwLngpO1xyXG4gICAgICAgIGNvbnN0IHR5ID0gZmFkZShmMC55KTtcclxuICAgICAgICBjb25zdCBjQSA9IGxlcnAoY0FBLCBjQkEsIHR4KTtcclxuICAgICAgICBjb25zdCBjQiA9IGxlcnAoY0FCLCBjQkIsIHR4KTtcclxuICAgICAgICBjb25zdCBjID0gbGVycChjQSwgY0IsIHR5KTtcclxuICAgICAgICByZXR1cm4gRU1hdGguY2xhbXAoYyAqIDAuNSArIDAuNSwgMCwgMSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcGVybGluTm9pc2UzRCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBzZWVkID0gMCkgOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGdldFBlcmxpblZlY3RvcjNEID0gTm9pc2UuZ2V0UGVybGluVmVjdG9yM0Q7XHJcbiAgICAgICAgY29uc3QgbGVycCA9IEVNYXRoLmxlcnA7XHJcbiAgICAgICAgY29uc3QgZmFkZSA9IE5vaXNlLmZhZGU7XHJcbiAgICAgICAgY29uc3QgZzAgPSBuZXcgVmVjMyh4LCB5LCB6KS5tYXBTZWxmKE1hdGguZmxvb3IpO1xyXG4gICAgICAgIGNvbnN0IGcxID0gbmV3IFZlYzMoZzApLmFkZFNlbGZDKDEsIDEsIDEpO1xyXG4gICAgICAgIGNvbnN0IGYwID0gbmV3IFZlYzMoeCwgeSwgeikuc3ViU2VsZihnMCk7XHJcbiAgICAgICAgY29uc3QgZjEgPSBuZXcgVmVjMyh4LCB5LCB6KS5zdWJTZWxmKGcxKTtcclxuICAgICAgICBjb25zdCBjQUFBID0gZ2V0UGVybGluVmVjdG9yM0QoZzAueCwgZzAueSwgZzAueiwgc2VlZCkuZG90KGYwKTtcclxuICAgICAgICBjb25zdCBjQUFCID0gZ2V0UGVybGluVmVjdG9yM0QoZzAueCwgZzAueSwgZzEueiwgc2VlZCkuZG90QyhmMC54LCBmMC55LCBmMS56KTtcclxuICAgICAgICBjb25zdCBjQUJBID0gZ2V0UGVybGluVmVjdG9yM0QoZzAueCwgZzEueSwgZzAueiwgc2VlZCkuZG90QyhmMC54LCBmMS55LCBmMC56KTtcclxuICAgICAgICBjb25zdCBjQUJCID0gZ2V0UGVybGluVmVjdG9yM0QoZzAueCwgZzEueSwgZzEueiwgc2VlZCkuZG90QyhmMC54LCBmMS55LCBmMS56KTtcclxuICAgICAgICBjb25zdCBjQkFBID0gZ2V0UGVybGluVmVjdG9yM0QoZzEueCwgZzAueSwgZzAueiwgc2VlZCkuZG90QyhmMS54LCBmMC55LCBmMC56KTtcclxuICAgICAgICBjb25zdCBjQkFCID0gZ2V0UGVybGluVmVjdG9yM0QoZzEueCwgZzAueSwgZzEueiwgc2VlZCkuZG90QyhmMS54LCBmMC55LCBmMS56KTtcclxuICAgICAgICBjb25zdCBjQkJBID0gZ2V0UGVybGluVmVjdG9yM0QoZzEueCwgZzEueSwgZzAueiwgc2VlZCkuZG90QyhmMS54LCBmMS55LCBmMC56KTtcclxuICAgICAgICBjb25zdCBjQkJCID0gZ2V0UGVybGluVmVjdG9yM0QoZzEueCwgZzEueSwgZzEueiwgc2VlZCkuZG90KGYxKTtcclxuICAgICAgICBjb25zdCB0eCA9IGZhZGUoZjAueCk7XHJcbiAgICAgICAgY29uc3QgdHkgPSBmYWRlKGYwLnkpO1xyXG4gICAgICAgIGNvbnN0IHR6ID0gZmFkZShmMC56KTtcclxuICAgICAgICBjb25zdCBjQUEgPSBsZXJwKGNBQUEsIGNCQUEsIHR4KTtcclxuICAgICAgICBjb25zdCBjQUIgPSBsZXJwKGNBQUIsIGNCQUIsIHR4KTtcclxuICAgICAgICBjb25zdCBjQkEgPSBsZXJwKGNBQkEsIGNCQkEsIHR4KTtcclxuICAgICAgICBjb25zdCBjQkIgPSBsZXJwKGNBQkIsIGNCQkIsIHR4KTtcclxuICAgICAgICBjb25zdCBjQSA9IGxlcnAoY0FBLCBjQkEsIHR5KTtcclxuICAgICAgICBjb25zdCBjQiA9IGxlcnAoY0FCLCBjQkIsIHR5KTtcclxuICAgICAgICBjb25zdCBjID0gbGVycChjQSwgY0IsIHR6KTtcclxuICAgICAgICByZXR1cm4gRU1hdGguY2xhbXAoYyAqIDAuNSArIDAuNSwgMCwgMSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdm9yb25vaU5vaXNlMkQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHNlZWQgPSAwLCB0ID0gMSkge1xyXG4gICAgICAgIGxldCBwID0gbmV3IFZlYzIoeCwgeSk7XHJcbiAgICAgICAgY29uc3QgZzAgPSBwLm1hcChNYXRoLmZsb29yKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgcG9pbnREaXN0YW5jZTogSW5maW5pdHksXHJcbiAgICAgICAgICAgIHZhbHVlOiAwLFxyXG4gICAgICAgICAgICBncmlkUG9zOiBWZWMyLnplcm8oKSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGZvcihsZXQgeG9mZj0tMTt4b2ZmPD0xO3hvZmYrKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IHlvZmY9LTE7eW9mZjw9MTt5b2ZmKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdyaWRQb3MgPSBnMC5hZGRDKHhvZmYsIHlvZmYpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcG9pbnRQb3MgPSBOb2lzZS5nZXRWb3Jvbm9pR3JpZFBvc2l0aW9uMkQoZ3JpZFBvcy54LCBncmlkUG9zLnksIHNlZWQsIHQpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdCA9IHAuZGlzdChwb2ludFBvcyk7XHJcbiAgICAgICAgICAgICAgICBpZihkaXN0PGRhdGEucG9pbnREaXN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuZ3JpZFBvcyA9IGdyaWRQb3M7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5wb2ludERpc3RhbmNlID0gZGlzdDtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnZhbHVlID0gTm9pc2UuZ2V0Vm9yb25vaUdyaWRWYWx1ZTJEKGdyaWRQb3MueCwgZ3JpZFBvcy55LCBzZWVkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuICAgIHN0YXRpYyB2b3Jvbm9pTm9pc2UzRCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBzZWVkID0gMCwgdCA9IDEpIHtcclxuICAgICAgICBsZXQgcCA9IG5ldyBWZWMzKHgsIHksIHopO1xyXG4gICAgICAgIGNvbnN0IGcwID0gcC5tYXAoTWF0aC5mbG9vcik7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHBvaW50RGlzdGFuY2U6IEluZmluaXR5LFxyXG4gICAgICAgICAgICB2YWx1ZTogMCxcclxuICAgICAgICAgICAgZ3JpZFBvczogVmVjMy56ZXJvKCksXHJcbiAgICAgICAgfTtcclxuICAgICAgICBmb3IobGV0IHhvZmY9LTE7eG9mZjw9MTt4b2ZmKyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCB5b2ZmPS0xO3lvZmY8PTE7eW9mZisrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IHpvZmY9LTE7em9mZjw9MTt6b2ZmKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBncmlkUG9zID0gZzAuYWRkQyh4b2ZmLCB5b2ZmLCB6b2ZmKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludFBvcyA9IE5vaXNlLmdldFZvcm9ub2lHcmlkUG9zaXRpb24zRChncmlkUG9zLngsIGdyaWRQb3MueSwgZ3JpZFBvcy56LCBzZWVkLCB0KTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0ID0gcC5kaXN0KHBvaW50UG9zKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihkaXN0PGRhdGEucG9pbnREaXN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmdyaWRQb3MgPSBncmlkUG9zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnBvaW50RGlzdGFuY2UgPSBkaXN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnZhbHVlID0gTm9pc2UuZ2V0Vm9yb25vaUdyaWRWYWx1ZTNEKGdyaWRQb3MueCwgZ3JpZFBvcy55LCBncmlkUG9zLnosIHNlZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuICAgIHN0YXRpYyByYW5kb21Db25zdGFudDMoYTogbnVtYmVyLCBiOiBudW1iZXIsIGM6IG51bWJlcikgOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGl0ID0gKGEgKiAyMzk0ODIzNTQ5KSBeIChiICogNDM4NTk3NDI4NTApIF4gKGMgKiAyMzA5NDU2NTIzNCk7XHJcbiAgICAgICAgcmV0dXJuIEVNYXRoLnBtb2QoaXQsIDEwMDAwKSAvIDEwMDAwO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJhbmRvbUNvbnN0YW50NChhOiBudW1iZXIsIGI6IG51bWJlciwgYzogbnVtYmVyLCBkOiBudW1iZXIpIDogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBpdCA9IChhICogMjM5NDgyMzU0OSkgXiAoYiAqIDQzODU5NzQyODUwKSBeIChjICogMjMwOTQ1NjUyMzQpIF4gKGQgKiA4NDI3ODI0NTY2KTtcclxuICAgICAgICByZXR1cm4gRU1hdGgucG1vZChpdCwgMTAwMDApIC8gMTAwMDA7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBDQU1FUkEgQ0xBU1NFUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgY2xhc3MgQ2FtZXJhM0Qge1xyXG4gICAgcHJpdmF0ZSBfZm92WTogbnVtYmVyID0gOTUvMTgwKk1hdGguUEk7XHJcbiAgICBnZXQgZm92WSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZm92WTtcclxuICAgIH1cclxuICAgIHNldCBmb3ZZKG46IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2ZvdlkgPSBuO1xyXG4gICAgICAgIHRoaXMuX3BlcnNwZWN0aXZlTWF0cml4VSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfYXNwZWN0OiBudW1iZXIgPSAxO1xyXG4gICAgZ2V0IGFzcGVjdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYXNwZWN0O1xyXG4gICAgfVxyXG4gICAgc2V0IGFzcGVjdChuOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9hc3BlY3QgPSBuO1xyXG4gICAgICAgIHRoaXMuX3BlcnNwZWN0aXZlTWF0cml4VSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfbmVhcjogbnVtYmVyID0gMC4xO1xyXG4gICAgZ2V0IG5lYXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25lYXI7XHJcbiAgICB9XHJcbiAgICBzZXQgbmVhcihuOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9uZWFyID0gbjtcclxuICAgICAgICB0aGlzLl9wZXJzcGVjdGl2ZU1hdHJpeFUgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2ZhcjogbnVtYmVyID0gMTAwMDA7XHJcbiAgICBnZXQgZmFyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mYXI7XHJcbiAgICB9XHJcbiAgICBzZXQgZmFyKG46IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2ZhciA9IG47XHJcbiAgICAgICAgdGhpcy5fcGVyc3BlY3RpdmVNYXRyaXhVID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9wb3NpdGlvbiA9IFZlYzMuemVybygpO1xyXG4gICAgZ2V0IHBvc2l0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcclxuICAgIH1cclxuICAgIHNldCBwb3NpdGlvbih2OiBWZWMzKSB7XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gPSB2O1xyXG4gICAgICAgIHRoaXMuX3RyYW5zbGF0aW9uTWF0cml4VSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fdmlld01hdHJpeFUgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3dvcmxkU2NhbGUgPSAxO1xyXG4gICAgZ2V0IHdvcmxkU2NhbGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dvcmxkU2NhbGU7XHJcbiAgICB9XHJcbiAgICBzZXQgd29ybGRTY2FsZShuOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl93b3JsZFNjYWxlID0gbjtcclxuICAgICAgICB0aGlzLl90cmFuc2xhdGlvbk1hdHJpeFUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3ZpZXdNYXRyaXhVID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yb3RhdGlvbiA9IFZlYzMuemVybygpO1xyXG4gICAgZ2V0IHJvdGF0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yb3RhdGlvbjtcclxuICAgIH1cclxuICAgIHNldCByb3RhdGlvbih2OiBWZWMzKSB7XHJcbiAgICAgICAgdGhpcy5fcm90YXRpb24gPSB2O1xyXG4gICAgICAgIHRoaXMuX2ZvcndhcmRVID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9yaWdodFUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3VwVSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fZm9yd2FyZEZsYXRVID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9yb3RhdGlvbk1hdHJpeFUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3ZpZXdNYXRyaXhVID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9mb3J3YXJkID0gVmVjMy56ZXJvKCk7XHJcbiAgICBwcml2YXRlIF9mb3J3YXJkVSA9IHRydWU7XHJcbiAgICBnZXQgZm9yd2FyZCgpIHtcclxuICAgICAgICBpZih0aGlzLl9mb3J3YXJkVSkge1xyXG4gICAgICAgICAgICB0aGlzLl9mb3J3YXJkID0gVmVjMy56QXhpcygpLm5lZ1NlbGYoKS5yb3RYWVpTZWxmKHRoaXMuX3JvdGF0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5fZm9yd2FyZFUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZvcndhcmQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmlnaHQgPSBWZWMzLnplcm8oKTtcclxuICAgIHByaXZhdGUgX3JpZ2h0VSA9IHRydWU7XHJcbiAgICBnZXQgcmlnaHQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fcmlnaHRVKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JpZ2h0ID0gVmVjMy54QXhpcygpLnJvdFhZWlNlbGYodGhpcy5fcm90YXRpb24pO1xyXG4gICAgICAgICAgICB0aGlzLl9yaWdodFUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3VwID0gVmVjMy56ZXJvKCk7XHJcbiAgICBwcml2YXRlIF91cFUgPSB0cnVlO1xyXG4gICAgZ2V0IHVwKCkge1xyXG4gICAgICAgIGlmKHRoaXMuX3VwVSkge1xyXG4gICAgICAgICAgICB0aGlzLl91cCA9IFZlYzMueUF4aXMoKS5yb3RYWVpTZWxmKHRoaXMuX3JvdGF0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5fdXBVID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl91cDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9mb3J3YXJkRmxhdCA9IFZlYzMuemVybygpO1xyXG4gICAgcHJpdmF0ZSBfZm9yd2FyZEZsYXRVID0gdHJ1ZTtcclxuICAgIGdldCBmb3J3YXJkRmxhdCgpIHtcclxuICAgICAgICBpZih0aGlzLl9mb3J3YXJkRmxhdFUpIHtcclxuICAgICAgICAgICAgdGhpcy5fZm9yd2FyZEZsYXQgPSBWZWMzLnpBeGlzKCkubmVnU2VsZigpLnJvdFlTZWxmKHRoaXMuX3JvdGF0aW9uLnkpO1xyXG4gICAgICAgICAgICB0aGlzLl9mb3J3YXJkRmxhdFUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZvcndhcmRGbGF0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3BlcnNwZWN0aXZlTWF0cml4OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfcGVyc3BlY3RpdmVNYXRyaXhVID0gdHJ1ZTtcclxuICAgIGdldCBwZXJzcGVjdGl2ZU1hdHJpeCgpIHtcclxuICAgICAgICBpZih0aGlzLl9wZXJzcGVjdGl2ZU1hdHJpeFUpIHtcclxuICAgICAgICAgICAgdGhpcy5fcGVyc3BlY3RpdmVNYXRyaXggPSBNYXQ0LnBlcnNwZWN0aXZlKHRoaXMuX2ZvdlksIHRoaXMuX2FzcGVjdCwgdGhpcy5fbmVhciwgdGhpcy5fZmFyKTtcclxuICAgICAgICAgICAgdGhpcy5fcGVyc3BlY3RpdmVNYXRyaXhVID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMucGVyc3BlY3RpdmVNYXRyaXhDaGFuZ2VFdmVudC5maXJlKHRoaXMuX3BlcnNwZWN0aXZlTWF0cml4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BlcnNwZWN0aXZlTWF0cml4O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3RyYW5zbGF0aW9uTWF0cml4OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfdHJhbnNsYXRpb25NYXRyaXhVID0gdHJ1ZTtcclxuICAgIGdldCB0cmFuc2xhdGlvbk1hdHJpeCgpIHtcclxuICAgICAgICBpZih0aGlzLl90cmFuc2xhdGlvbk1hdHJpeFUpIHtcclxuICAgICAgICAgICAgdGhpcy5fdHJhbnNsYXRpb25NYXRyaXggPSBNYXQ0LnRyYW5zbGF0ZSgtdGhpcy5fcG9zaXRpb24ueCAqIHRoaXMuX3dvcmxkU2NhbGUsIC10aGlzLl9wb3NpdGlvbi55ICogdGhpcy5fd29ybGRTY2FsZSwgLXRoaXMuX3Bvc2l0aW9uLnogKiB0aGlzLl93b3JsZFNjYWxlKTtcclxuICAgICAgICAgICAgdGhpcy5fdHJhbnNsYXRpb25NYXRyaXhVID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNsYXRpb25NYXRyaXhDaGFuZ2VFdmVudC5maXJlKHRoaXMuX3ZpZXdNYXRyaXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRpb25NYXRyaXg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcm90YXRpb25NYXRyaXg6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIF9yb3RhdGlvbk1hdHJpeFUgPSB0cnVlO1xyXG4gICAgZ2V0IHJvdGF0aW9uTWF0cml4KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX3JvdGF0aW9uTWF0cml4VSkge1xyXG4gICAgICAgICAgICB0aGlzLl9yb3RhdGlvbk1hdHJpeCA9IE1hdDQubXVsdGlwbHkoXHJcbiAgICAgICAgICAgICAgICBNYXQ0LnJvdGF0ZVooLXRoaXMuX3JvdGF0aW9uLnopLFxyXG4gICAgICAgICAgICAgICAgTWF0NC5tdWx0aXBseShcclxuICAgICAgICAgICAgICAgICAgICBNYXQ0LnJvdGF0ZVgoLXRoaXMuX3JvdGF0aW9uLngpLFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdDQucm90YXRlWSgtdGhpcy5fcm90YXRpb24ueSksXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHRoaXMuX3JvdGF0aW9uTWF0cml4VSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnJvdGF0aW9uTWF0cml4Q2hhbmdlRXZlbnQuZmlyZSh0aGlzLl92aWV3TWF0cml4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvdGF0aW9uTWF0cml4O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3ZpZXdNYXRyaXg6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIF92aWV3TWF0cml4VSA9IHRydWU7XHJcbiAgICBnZXQgdmlld01hdHJpeCgpIHtcclxuICAgICAgICBpZih0aGlzLl92aWV3TWF0cml4VSkge1xyXG4gICAgICAgICAgICB0aGlzLl92aWV3TWF0cml4ID0gTWF0NC5tdWx0aXBseSh0aGlzLnJvdGF0aW9uTWF0cml4LCB0aGlzLnRyYW5zbGF0aW9uTWF0cml4KTtcclxuICAgICAgICAgICAgdGhpcy5fdmlld01hdHJpeFUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy52aWV3TWF0cml4Q2hhbmdlRXZlbnQuZmlyZSh0aGlzLl92aWV3TWF0cml4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZpZXdNYXRyaXg7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBlcnNwZWN0aXZlTWF0cml4Q2hhbmdlRXZlbnQgPSBuZXcgU2lnbmFsKHsgb25Db25uZWN0OiBjb25uID0+IGNvbm4uZmlyZSh0aGlzLnBlcnNwZWN0aXZlTWF0cml4KSB9KTtcclxuICAgIHB1YmxpYyB2aWV3TWF0cml4Q2hhbmdlRXZlbnQgPSBuZXcgU2lnbmFsKHsgb25Db25uZWN0OiBjb25uID0+IGNvbm4uZmlyZSh0aGlzLnZpZXdNYXRyaXgpIH0pO1xyXG4gICAgcHVibGljIHJvdGF0aW9uTWF0cml4Q2hhbmdlRXZlbnQgPSBuZXcgU2lnbmFsKHsgb25Db25uZWN0OiBjb25uID0+IGNvbm4uZmlyZSh0aGlzLnJvdGF0aW9uTWF0cml4KSB9KTtcclxuICAgIHB1YmxpYyB0cmFuc2xhdGlvbk1hdHJpeENoYW5nZUV2ZW50ID0gbmV3IFNpZ25hbCh7IG9uQ29ubmVjdDogY29ubiA9PiBjb25uLmZpcmUodGhpcy50cmFuc2xhdGlvbk1hdHJpeCkgfSk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb24/OiBWZWMzLCBmb3ZZPzogbnVtYmVyLCBhc3BlY3Q/OiBudW1iZXIsIG5lYXI/OiBudW1iZXIsIGZhcj86IG51bWJlcikge1xyXG4gICAgICAgIGlmKHBvc2l0aW9uKSB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgICAgaWYoZm92WSkgdGhpcy5mb3ZZID0gZm92WTtcclxuICAgICAgICBpZihhc3BlY3QpIHRoaXMuYXNwZWN0ID0gYXNwZWN0O1xyXG4gICAgICAgIGlmKG5lYXIpIHRoaXMubmVhciA9IG5lYXI7XHJcbiAgICAgICAgaWYoZmFyKSB0aGlzLmZhciA9IGZhcjtcclxuICAgIH1cclxuXHJcbiAgICBsb29rQXQocDogVmVjMykge1xyXG4gICAgICAgIGxldCBmID0gdGhpcy5wb3NpdGlvbi5sb29rKHApO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSBuZXcgVmVjMyhmLnBpdGNoKCksIGYueWF3KCksIDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIE1FU0ggQ0xBU1NFUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGNsYXNzIE1lc2gzRCB7XHJcbiAgICBwb3NpdGlvbnM6IG51bWJlcltdID0gW107XHJcbiAgICB0ZXhjb29yZHM6IG51bWJlcltdID0gW107XHJcbiAgICBub3JtYWxzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG4gICAgY2xvbmUoKTogTWVzaDNEIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1lc2gzRCgpLmFwcGVuZCh0aGlzKTtcclxuICAgIH1cclxuICAgIHRyYW5zbGF0ZSh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5wb3NpdGlvbnMubGVuZ3RoOyBpKz0zKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2ldISArPSB4O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzFdISArPSB5O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzJdISArPSB6O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHNjYWxlKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTMpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaV0hICo9IHg7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMV0hICo9IHk7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMl0hICo9IHo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm90YXRlKGF4OiBudW1iZXIsIGF5OiBudW1iZXIsIGF6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTMpIHtcclxuICAgICAgICAgICAgbGV0IHAgPSBuZXcgVmVjMyh0aGlzLnBvc2l0aW9uc1tpXSEsIHRoaXMucG9zaXRpb25zW2krMV0hLCB0aGlzLnBvc2l0aW9uc1tpKzJdISk7XHJcbiAgICAgICAgICAgIHAucm90WFlaU2VsZkMoYXgsIGF5LCBheik7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2ldID0gcC54O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzFdID0gcC55O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzJdID0gcC56O1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLm5vcm1hbHMubGVuZ3RoOyBpKz0zKSB7XHJcbiAgICAgICAgICAgIGxldCBwID0gbmV3IFZlYzModGhpcy5ub3JtYWxzW2ldISwgdGhpcy5ub3JtYWxzW2krMV0hLCB0aGlzLm5vcm1hbHNbaSsyXSEpO1xyXG4gICAgICAgICAgICBwLnJvdFhZWlNlbGZDKGF4LCBheSwgYXopO1xyXG4gICAgICAgICAgICB0aGlzLm5vcm1hbHNbaV0gPSBwLng7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFsc1tpKzFdID0gcC55O1xyXG4gICAgICAgICAgICB0aGlzLm5vcm1hbHNbaSsyXSA9IHAuejtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByb3RhdGVBcm91bmQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgYXg6IG51bWJlciwgYXk6IG51bWJlciwgYXo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mykge1xyXG4gICAgICAgICAgICBsZXQgcCA9IG5ldyBWZWMzKHRoaXMucG9zaXRpb25zW2ldISAtIHgsIHRoaXMucG9zaXRpb25zW2krMV0hIC0geSwgdGhpcy5wb3NpdGlvbnNbaSsyXSEgLSB6KTtcclxuICAgICAgICAgICAgcC5yb3RYWVpTZWxmQyhheCwgYXksIGF6KTtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaV0gPSBwLnggKyB4O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzFdID0gcC55ICsgeTtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsyXSA9IHAueiArIHo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMubm9ybWFscy5sZW5ndGg7IGkrPTMpIHtcclxuICAgICAgICAgICAgbGV0IHAgPSBuZXcgVmVjMyh0aGlzLm5vcm1hbHNbaV0hLCB0aGlzLm5vcm1hbHNbaSsxXSEsIHRoaXMubm9ybWFsc1tpKzJdISk7XHJcbiAgICAgICAgICAgIHAucm90WFlaU2VsZkMoYXgsIGF5LCBheik7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFsc1tpXSA9IHAueDtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzW2krMV0gPSBwLnk7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFsc1tpKzJdID0gcC56O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFwcGVuZCguLi5tZXNoZXM6IE1lc2gzRFtdKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGNvbnN0IG1lc2ggb2YgbWVzaGVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zLnB1c2goLi4ubWVzaC5wb3NpdGlvbnMpO1xyXG4gICAgICAgICAgICB0aGlzLnRleGNvb3Jkcy5wdXNoKC4uLm1lc2gudGV4Y29vcmRzKTtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzLnB1c2goLi4ubWVzaC5ub3JtYWxzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBwdXNoUG9zaXRpb25zKGFycjogbnVtYmVyW10sIHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTMpIHtcclxuICAgICAgICAgICAgYXJyLnB1c2godGhpcy5wb3NpdGlvbnNbaV0hICsgeCk7XHJcbiAgICAgICAgICAgIGFyci5wdXNoKHRoaXMucG9zaXRpb25zW2krMV0hICsgeSk7XHJcbiAgICAgICAgICAgIGFyci5wdXNoKHRoaXMucG9zaXRpb25zW2krMl0hICsgeik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9XHJcbiAgICBzZXROb3JtYWxzKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLm5vcm1hbHMubGVuZ3RoOyBpKz0zKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFsc1tpXSA9IHg7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFsc1tpKzFdID0geTtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzW2krMl0gPSB6O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN0YXRpYyB0cmlhbmdsZXNUb0VkZ2VzKHBvc2l0aW9uczogbnVtYmVyW10pOiBudW1iZXJbXSB7XHJcbiAgICAgICAgbGV0IGVkZ2VzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHBvc2l0aW9ucy5sZW5ndGg7IGkrPTkpIHtcclxuICAgICAgICAgICAgZWRnZXMucHVzaChwb3NpdGlvbnNbaV0hLCBwb3NpdGlvbnNbaSsxXSEsIHBvc2l0aW9uc1tpKzJdISwgcG9zaXRpb25zW2krM10hLCBwb3NpdGlvbnNbaSs0XSEsIHBvc2l0aW9uc1tpKzVdISk7XHJcbiAgICAgICAgICAgIGVkZ2VzLnB1c2gocG9zaXRpb25zW2krM10hLCBwb3NpdGlvbnNbaSs0XSEsIHBvc2l0aW9uc1tpKzVdISwgcG9zaXRpb25zW2krNl0hLCBwb3NpdGlvbnNbaSs3XSEsIHBvc2l0aW9uc1tpKzhdISk7XHJcbiAgICAgICAgICAgIGVkZ2VzLnB1c2gocG9zaXRpb25zW2krNl0hLCBwb3NpdGlvbnNbaSs3XSEsIHBvc2l0aW9uc1tpKzhdISwgcG9zaXRpb25zW2ldISwgcG9zaXRpb25zW2krMV0hLCBwb3NpdGlvbnNbaSsyXSEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZWRnZXM7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdHJpYW5nbGVRdWFkc1RvRWRnZXMocG9zaXRpb25zOiBudW1iZXJbXSk6IG51bWJlcltdIHtcclxuICAgICAgICBsZXQgZWRnZXM6IG51bWJlcltdID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8cG9zaXRpb25zLmxlbmd0aDsgaSs9MTgpIHtcclxuICAgICAgICAgICAgZWRnZXMucHVzaChwb3NpdGlvbnNbaV0hLCBwb3NpdGlvbnNbaSsxXSEsIHBvc2l0aW9uc1tpKzJdISwgcG9zaXRpb25zW2krM10hLCBwb3NpdGlvbnNbaSs0XSEsIHBvc2l0aW9uc1tpKzVdISk7XHJcbiAgICAgICAgICAgIGVkZ2VzLnB1c2gocG9zaXRpb25zW2krM10hLCBwb3NpdGlvbnNbaSs0XSEsIHBvc2l0aW9uc1tpKzVdISwgcG9zaXRpb25zW2krNl0hLCBwb3NpdGlvbnNbaSs3XSEsIHBvc2l0aW9uc1tpKzhdISk7XHJcbiAgICAgICAgICAgIGVkZ2VzLnB1c2gocG9zaXRpb25zW2krNl0hLCBwb3NpdGlvbnNbaSs3XSEsIHBvc2l0aW9uc1tpKzhdISwgcG9zaXRpb25zW2krOV0hLCBwb3NpdGlvbnNbaSsxMF0hLCBwb3NpdGlvbnNbaSsxMV0hKTtcclxuICAgICAgICAgICAgZWRnZXMucHVzaChwb3NpdGlvbnNbaSs5XSEsIHBvc2l0aW9uc1tpKzEwXSEsIHBvc2l0aW9uc1tpKzExXSEsIHBvc2l0aW9uc1tpKzEyXSEsIHBvc2l0aW9uc1tpKzEzXSEsIHBvc2l0aW9uc1tpKzE0XSEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZWRnZXM7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgUEhZU0lDUyBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGh5c2ljczJEIHtcclxuICAgIHN0YXRpYyBnZXRQb2ludFJlY3RDb2xsaXNpb24ocG9pbnQ6IFZlYzIsIGNlbnRlcjogVmVjMiwgcmlnaHRPZmZzZXQ6IFZlYzIsIHVwT2Zmc2V0OiBWZWMyKSB7XHJcbiAgICAgICAgY29uc3QgcmlnaHQgPSByaWdodE9mZnNldC5ub3JtKCk7XHJcbiAgICAgICAgY29uc3QgdXAgPSB1cE9mZnNldC5ub3JtKCk7XHJcbiAgICAgICAgY29uc3Qgc2l6ZVggPSByaWdodE9mZnNldC5sZW5ndGgoKTtcclxuICAgICAgICBjb25zdCBzaXplWSA9IHVwT2Zmc2V0Lmxlbmd0aCgpO1xyXG4gICAgICAgIGxldCBkaWZmID0gcG9pbnQuc3ViKGNlbnRlcik7XHJcbiAgICAgICAgbGV0IGR4ID0gZGlmZi5kb3QocmlnaHQpO1xyXG4gICAgICAgIGxldCBkeSA9IGRpZmYuZG90KHVwKTtcclxuICAgICAgICBsZXQgaXNJbnNpZGUgPSAoTWF0aC5hYnMoZHgpIDwgc2l6ZVggJiYgTWF0aC5hYnMoZHkpIDwgc2l6ZVkpO1xyXG4gICAgICAgIGlmKGlzSW5zaWRlKSB7XHJcbiAgICAgICAgICAgIGxldCBkMSA9IE1hdGguYWJzKHBvaW50LnN1YihjZW50ZXIuYWRkU2NhbGVkKHVwLCBzaXplWSkpLmRvdCh1cCkpO1xyXG4gICAgICAgICAgICBsZXQgZDIgPSBNYXRoLmFicyhwb2ludC5zdWIoY2VudGVyLmFkZFNjYWxlZCh1cCwgLXNpemVZKSkuZG90KHVwKSk7XHJcbiAgICAgICAgICAgIGxldCBkMyA9IE1hdGguYWJzKHBvaW50LnN1YihjZW50ZXIuYWRkU2NhbGVkKHJpZ2h0LCBzaXplWCkpLmRvdChyaWdodCkpO1xyXG4gICAgICAgICAgICBsZXQgZDQgPSBNYXRoLmFicyhwb2ludC5zdWIoY2VudGVyLmFkZFNjYWxlZChyaWdodCwgLXNpemVYKSkuZG90KHJpZ2h0KSk7XHJcbiAgICAgICAgICAgIGxldCBjZCA9IE1hdGgubWluKGQxLCBkMiwgZDMsIGQ0KTtcclxuICAgICAgICAgICAgbGV0IGVkZ2U6IFZlYzI7XHJcbiAgICAgICAgICAgIGxldCBub3JtYWw6IFZlYzI7XHJcbiAgICAgICAgICAgIGlmKEVNYXRoLmlzQ2xvc2UoY2QsIGQxKSkge1xyXG4gICAgICAgICAgICAgICAgZWRnZSA9IGNlbnRlci5hZGRTY2FsZWQocmlnaHQsIGR4KS5hZGRTY2FsZWQodXAsIHNpemVZKTtcclxuICAgICAgICAgICAgICAgIG5vcm1hbCA9IHVwO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYoRU1hdGguaXNDbG9zZShjZCwgZDIpKSB7XHJcbiAgICAgICAgICAgICAgICBlZGdlID0gY2VudGVyLmFkZFNjYWxlZChyaWdodCwgZHgpLmFkZFNjYWxlZCh1cCwgLXNpemVZKTtcclxuICAgICAgICAgICAgICAgIG5vcm1hbCA9IHVwLm5lZygpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYoRU1hdGguaXNDbG9zZShjZCwgZDMpKSB7XHJcbiAgICAgICAgICAgICAgICBlZGdlID0gY2VudGVyLmFkZFNjYWxlZCh1cCwgZHkpLmFkZFNjYWxlZChyaWdodCwgc2l6ZVgpO1xyXG4gICAgICAgICAgICAgICAgbm9ybWFsID0gcmlnaHQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlZGdlID0gY2VudGVyLmFkZFNjYWxlZCh1cCwgZHkpLmFkZFNjYWxlZChyaWdodCwgLXNpemVYKTtcclxuICAgICAgICAgICAgICAgIG5vcm1hbCA9IHJpZ2h0Lm5lZygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBpbnNpZGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb2xsaXNpb246IGVkZ2UsXHJcbiAgICAgICAgICAgICAgICBkaXN0YW5jZTogLWVkZ2UuZGlzdChwb2ludCksXHJcbiAgICAgICAgICAgICAgICBub3JtYWw6IG5vcm1hbCxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGR4ID0gRU1hdGguY2xhbXAoZHgsIC1zaXplWCwgc2l6ZVgpO1xyXG4gICAgICAgICAgICBkeSA9IEVNYXRoLmNsYW1wKGR5LCAtc2l6ZVksIHNpemVZKTtcclxuICAgICAgICAgICAgbGV0IGVkZ2UgPSBjZW50ZXIuYWRkU2NhbGVkKHJpZ2h0LCBkeCkuYWRkU2NhbGVkKHVwLCBkeSk7XHJcbiAgICAgICAgICAgIGxldCBkaXN0ID0gZWRnZS5kaXN0KHBvaW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGluc2lkZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjb2xsaXNpb246IGVkZ2UsXHJcbiAgICAgICAgICAgICAgICBkaXN0YW5jZTogZGlzdCxcclxuICAgICAgICAgICAgICAgIG5vcm1hbDogZWRnZS5sb29rKHBvaW50KSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0SXNQb2ludEluc2lkZVJlY3QocG9pbnQ6IFZlYzIsIGNlbnRlcjogVmVjMiwgcmlnaHRPZmZzZXQ6IFZlYzIsIHVwT2Zmc2V0OiBWZWMyKSB7XHJcbiAgICAgICAgbGV0IGRpZmYgPSBwb2ludC5zdWIoY2VudGVyKTtcclxuICAgICAgICBsZXQgZHggPSBkaWZmLmRvdChyaWdodE9mZnNldC5ub3JtKCkpO1xyXG4gICAgICAgIGxldCBkeSA9IGRpZmYuZG90KHVwT2Zmc2V0Lm5vcm0oKSk7XHJcbiAgICAgICAgcmV0dXJuIChNYXRoLmFicyhkeCkgPCByaWdodE9mZnNldC5sZW5ndGgoKSAmJiBNYXRoLmFicyhkeSkgPCB1cE9mZnNldC5sZW5ndGgoKSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0Q2lyY2xlUmVjdENvbGxpc2lvbihwb2ludDogVmVjMiwgcmFkaXVzOiBudW1iZXIsIGNlbnRlcjogVmVjMiwgcmlnaHRPZmZzZXQ6IFZlYzIsIHVwT2Zmc2V0OiBWZWMyKSB7XHJcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuZ2V0UG9pbnRSZWN0Q29sbGlzaW9uKHBvaW50LCBjZW50ZXIsIHJpZ2h0T2Zmc2V0LCB1cE9mZnNldCk7XHJcbiAgICAgICAgcmVzLmRpc3RhbmNlIC09IHJhZGl1cztcclxuICAgICAgICBpZihyZXMuZGlzdGFuY2UgPD0gMCkgcmVzLmluc2lkZSA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRDaXJjbGVDaXJjbGVDb2xsaXNpb24ocG9pbnRBOiBWZWMyLCByYWRpdXNBOiBudW1iZXIsIHBvaW50QjogVmVjMiwgcmFkaXVzQjogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IGRpc3QgPSBwb2ludEEuZGlzdChwb2ludEIpIC0gcmFkaXVzQSAtIHJhZGl1c0I7XHJcbiAgICAgICAgbGV0IGNvbGxpc2lvbiA9IHBvaW50QS5hZGRTY2FsZWQocG9pbnRBLmxvb2socG9pbnRCKSwgcmFkaXVzQSk7XHJcbiAgICAgICAgbGV0IG5vcm1hbCA9IHBvaW50Qi5sb29rKHBvaW50QSk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgaW5zaWRlOiBkaXN0IDw9IDAsXHJcbiAgICAgICAgICAgIGNvbGxpc2lvbixcclxuICAgICAgICAgICAgZGlzdGFuY2U6IGRpc3QsXHJcbiAgICAgICAgICAgIG5vcm1hbCxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldENpcmNsZUxpbmVDb2xsaXNpb24ocG9pbnQ6IFZlYzIsIHJhZGl1czogbnVtYmVyLCBzdGFydDogVmVjMiwgZW5kOiBWZWMyKSB7XHJcbiAgICAgICAgbGV0IGRpciA9IHN0YXJ0Lmxvb2soZW5kKTtcclxuICAgICAgICBsZXQgb2ZmID0gcG9pbnQuc3ViKHN0YXJ0KTtcclxuICAgICAgICBsZXQgdCA9IG9mZi5kb3QoZGlyKTtcclxuICAgICAgICBsZXQgbWF4VCA9IGVuZC5kaXN0KHN0YXJ0KTtcclxuICAgICAgICB0ID0gRU1hdGguY2xhbXAodCwgMCwgbWF4VCk7XHJcbiAgICAgICAgbGV0IGNvbGxpc2lvbiA9IHN0YXJ0LmFkZFNjYWxlZChkaXIsIHQpO1xyXG4gICAgICAgIGxldCBub3JtYWwgPSBjb2xsaXNpb24ubG9vayhwb2ludCk7XHJcbiAgICAgICAgbGV0IGRpc3QgPSBjb2xsaXNpb24uZGlzdChwb2ludCkgLSByYWRpdXM7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgaW5zaWRlOiBkaXN0IDw9IDAsXHJcbiAgICAgICAgICAgIGNvbGxpc2lvbixcclxuICAgICAgICAgICAgZGlzdGFuY2U6IGRpc3QsXHJcbiAgICAgICAgICAgIG5vcm1hbCxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJlc29sdmVDaXJjbGVDaXJjbGVDb2xsaXNpb24oYTogYW55LCBiOiBhbnksIGNvbDogYW55KSB7XHJcbiAgICAgICAgaWYoIWNvbC5pbnNpZGUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBsZXQgdm4xID0gY29sLm5vcm1hbC5kb3QoYS52ZWxvY2l0eSk7XHJcbiAgICAgICAgbGV0IHZuMiA9IGNvbC5ub3JtYWwuZG90KGIudmVsb2NpdHkpO1xyXG4gICAgICAgIGEudmVsb2NpdHkuYWRkU2NhbGVkU2VsZihjb2wubm9ybWFsLCB2bjIgLSB2bjEpO1xyXG4gICAgICAgIGIudmVsb2NpdHkuYWRkU2NhbGVkU2VsZihjb2wubm9ybWFsLCB2bjEgLSB2bjIpO1xyXG4gICAgICAgIGEucG9zaXRpb24uYWRkU2NhbGVkU2VsZihjb2wubm9ybWFsLCAtY29sLmRpc3RhbmNlLzIpO1xyXG4gICAgICAgIGIucG9zaXRpb24uYWRkU2NhbGVkU2VsZihjb2wubm9ybWFsLCBjb2wuZGlzdGFuY2UvMik7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcmVzb2x2ZUNpcmNsZUFuY2hvcmVkUmVjdENvbGxpc2lvbihhOiBhbnksIGI6IGFueSwgY29sOiBhbnkpIHtcclxuICAgICAgICBpZighY29sLmluc2lkZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGEucG9zaXRpb24gPSBjb2wucG9zaXRpb24uYWRkU2NhbGVkKGNvbC5ub3JtYWwsIGEucmFkaXVzICsgMWUtNik7XHJcbiAgICAgICAgYS52ZWxvY2l0eS5hZGRTY2FsZWRTZWxmKGNvbC5ub3JtYWwsIC1jb2wubm9ybWFsLmRvdChhLnZlbG9jaXR5KSoyKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQaHlzaWNzM0Qge1xyXG4gICAgc3RhdGljIHJheWNhc3RWb3hlbHM8VD4oXHJcbiAgICAgICAgb3JpZ2luOiBWZWMzLFxyXG4gICAgICAgIGRpcmVjdGlvbjogVmVjMyxcclxuICAgICAgICBwcmVkaWNhdGU6IChwb3M6VmVjMywgbm9ybWFsOlZlYzMsIGRpc3Q6bnVtYmVyKSA9PiBUIHwgdW5kZWZpbmVkLFxyXG4gICAgICAgIG1heEl0ZXJhdGlvbnMgPSAxMDAwXHJcbiAgICApOiBUIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBjb25zdCBpbnZEaXJBYnMgPSBkaXJlY3Rpb24ucmRpdkYoMSkubWFwKHggPT4gTWF0aC5hYnMoeCkpO1xyXG4gICAgICAgIGNvbnN0IHNpZ24gPSBkaXJlY3Rpb24ubWFwKHggPT4geCA+IDAgPyAxIDogMCk7XHJcbiAgICAgICAgY29uc3Qgc3RlcCA9IGRpcmVjdGlvbi5tYXAoeCA9PiB4ID4gMCA/IDEgOiAtMSk7XHJcbiAgICAgICAgbGV0IHRNYXhYID0gaW52RGlyQWJzLnggKiAoc2lnbi54PT09MCA/IChvcmlnaW4ueCAtIE1hdGguZmxvb3Iob3JpZ2luLngpKSA6IChNYXRoLmZsb29yKG9yaWdpbi54KSArIDEgLSBvcmlnaW4ueCkpO1xyXG4gICAgICAgIGxldCB0TWF4WSA9IGludkRpckFicy55ICogKHNpZ24ueT09PTAgPyAob3JpZ2luLnkgLSBNYXRoLmZsb29yKG9yaWdpbi55KSkgOiAoTWF0aC5mbG9vcihvcmlnaW4ueSkgKyAxIC0gb3JpZ2luLnkpKTtcclxuICAgICAgICBsZXQgdE1heFogPSBpbnZEaXJBYnMueiAqIChzaWduLno9PT0wID8gKG9yaWdpbi56IC0gTWF0aC5mbG9vcihvcmlnaW4ueikpIDogKE1hdGguZmxvb3Iob3JpZ2luLnopICsgMSAtIG9yaWdpbi56KSk7XHJcbiAgICAgICAgbGV0IHBvcyA9IG5ldyBWZWMzKG9yaWdpbikubWFwU2VsZih4ID0+IE1hdGguZmxvb3IoeCkpO1xyXG4gICAgICAgIGxldCBkaXN0YW5jZSA9IDA7XHJcbiAgICAgICAgbGV0IG5vcm1hbCA9IFZlYzMuemVybygpO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPG1heEl0ZXJhdGlvbnM7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgcmVzID0gcHJlZGljYXRlKHBvcywgbm9ybWFsLCBkaXN0YW5jZSk7XHJcbiAgICAgICAgICAgIGlmKHJlcyAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICAgICAgaWYodE1heFggPCB0TWF4WSkge1xyXG4gICAgICAgICAgICAgICAgaWYodE1heFggPCB0TWF4Wikge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gdE1heFg7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsLnNldEMoLXN0ZXAueCwgMCwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdE1heFggKz0gaW52RGlyQWJzLng7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zLnggKz0gc3RlcC54O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IHRNYXhaO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbC5zZXRDKDAsIDAsIC1zdGVwLnopO1xyXG4gICAgICAgICAgICAgICAgICAgIHRNYXhaICs9IGludkRpckFicy56O1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcy56ICs9IHN0ZXAuejtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmKHRNYXhZIDwgdE1heFopIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IHRNYXhZO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbC5zZXRDKDAsIC1zdGVwLnksIDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRNYXhZICs9IGludkRpckFicy55O1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcy55ICs9IHN0ZXAueTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2UgPSB0TWF4WjtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWwuc2V0QygwLCAwLCAtc3RlcC56KTtcclxuICAgICAgICAgICAgICAgICAgICB0TWF4WiArPSBpbnZEaXJBYnMuejtcclxuICAgICAgICAgICAgICAgICAgICBwb3MueiArPSBzdGVwLno7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIHN0YXRpYyByYXljYXN0Qm94KFxyXG4gICAgICAgIG9yaWdpbjogVmVjMyxcclxuICAgICAgICBkaXJlY3Rpb246IFZlYzMsXHJcbiAgICAgICAgYm91bmRzOiBWZWMzW11cclxuICAgICkge1xyXG4gICAgICAgIGNvbnN0IGludkRpciA9IGRpcmVjdGlvbi5yZGl2RigxKTtcclxuICAgICAgICBjb25zdCBzaWduID0gZGlyZWN0aW9uLm1hcCh4ID0+IHggPiAwID8gMSA6IDApO1xyXG4gICAgICAgIGNvbnN0IHNpZ25GbGlwID0gZGlyZWN0aW9uLm1hcCh4ID0+IHggPiAwID8gMCA6IDEpO1xyXG4gICAgICAgIGNvbnN0IHN0ZXBGbGlwID0gZGlyZWN0aW9uLm1hcCh4ID0+IHggPiAwID8gLTEgOiAxKTtcclxuICAgICAgICBsZXQgdG1pbiA9IChib3VuZHNbc2lnbkZsaXAueF0hLnggLSBvcmlnaW4ueCkgKiBpbnZEaXIueDtcclxuICAgICAgICBsZXQgdG1heCA9IChib3VuZHNbc2lnbi54XSEueCAtIG9yaWdpbi54KSAqIGludkRpci54O1xyXG4gICAgICAgIGxldCBub3JtYWwgPSBuZXcgVmVjMyhzdGVwRmxpcC54LDAsMCk7XHJcbiAgICAgICAgbGV0IHR5bWluID0gKGJvdW5kc1tzaWduRmxpcC55XSEueSAtIG9yaWdpbi55KSAqIGludkRpci55O1xyXG4gICAgICAgIGxldCB0eW1heCA9IChib3VuZHNbc2lnbi55XSEueSAtIG9yaWdpbi55KSAqIGludkRpci55O1xyXG4gICAgICAgIGlmKCh0bWluID4gdHltYXgpIHx8ICh0eW1pbiA+IHRtYXgpKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBpZih0eW1pbiA+IHRtaW4pIHtcclxuICAgICAgICAgICAgdG1pbiA9IHR5bWluO1xyXG4gICAgICAgICAgICBub3JtYWwgPSBuZXcgVmVjMygwLHN0ZXBGbGlwLnksMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR5bWF4IDwgdG1heCkgdG1heCA9IHR5bWF4O1xyXG4gICAgICAgIGxldCB0em1pbiA9IChib3VuZHNbc2lnbkZsaXAuel0hLnogLSBvcmlnaW4ueikgKiBpbnZEaXIuejtcclxuICAgICAgICBsZXQgdHptYXggPSAoYm91bmRzW3NpZ24uel0hLnogLSBvcmlnaW4ueikgKiBpbnZEaXIuejtcclxuICAgICAgICBpZigodG1pbiA+IHR6bWF4KSB8fCAodHptaW4gPiB0bWF4KSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYodHptaW4gPiB0bWluKSB7XHJcbiAgICAgICAgICAgIHRtaW4gPSB0em1pbjtcclxuICAgICAgICAgICAgbm9ybWFsID0gbmV3IFZlYzMoMCwwLHN0ZXBGbGlwLnopO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0em1heCA8IHRtYXgpIHRtYXggPSB0em1heDtcclxuICAgICAgICBjb25zdCBkaXN0YW5jZSA9IHRtaW4gPCAwID8gMCA6IHRtaW47XHJcbiAgICAgICAgcmV0dXJuIHsgbm9ybWFsLCBkaXN0YW5jZSwgaW50ZXJzZWN0aW9uOiBvcmlnaW4uYWRkU2NhbGVkKGRpcmVjdGlvbiwgZGlzdGFuY2UpIH07XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIEVWRU5UIENMQVNTRVMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgY2xhc3MgU2lnbmFsPFQgZXh0ZW5kcyBhbnlbXT4ge1xyXG4gICAgY29ubmVjdGlvbnM6IENvbm5lY3Rpb248VD5bXSA9IFtdO1xyXG4gICAgdGltZUZpcmVkOiBudW1iZXIgPSAtTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgIG9uQ29ubmVjdD86IChjb25uOiBDb25uZWN0aW9uPFQ+KSA9PiB2b2lkO1xyXG4gICAgY29uc3RydWN0b3Ioe1xyXG4gICAgICAgIG9uQ29ubmVjdCA9IHVuZGVmaW5lZCxcclxuICAgIH06IHtcclxuICAgICAgICBvbkNvbm5lY3Q/OiAoY29ubjogQ29ubmVjdGlvbjxUPikgPT4gdm9pZCxcclxuICAgIH0gPSB7fSkge1xyXG4gICAgICAgIHRoaXMub25Db25uZWN0ID0gb25Db25uZWN0O1xyXG4gICAgfVxyXG4gICAgY29ubmVjdChjYWxsYmFjazogKC4uLmFyZ3M6IFQpID0+IHZvaWQpIHtcclxuICAgICAgICBjb25zdCBjb25uID0gbmV3IENvbm5lY3Rpb248VD4odGhpcywgY2FsbGJhY2spO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMucHVzaChjb25uKTtcclxuICAgICAgICBpZih0aGlzLm9uQ29ubmVjdCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ29ubmVjdChjb25uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbm47XHJcbiAgICB9XHJcbiAgICBvbmNlKGNhbGxiYWNrOiAoLi4uYXJnczogVCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGNvbnN0IGNvbm4gPSB0aGlzLmNvbm5lY3QoKC4uLmFyZ3M6IFQpID0+IHtcclxuICAgICAgICAgICAgY2FsbGJhY2soLi4uYXJncyk7XHJcbiAgICAgICAgICAgIGNvbm4uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBjb25uO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgd2FpdCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8VD4ocmVzID0+IHtcclxuICAgICAgICAgICAgdGhpcy5vbmNlKCguLi5hcmdzOiBUKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXMoYXJncyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZmlyZSguLi5hcmdzOiBUKSB7XHJcbiAgICAgICAgdGhpcy50aW1lRmlyZWQgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICBmb3IoY29uc3QgY29ubiBvZiBbLi4udGhpcy5jb25uZWN0aW9uc10pIHtcclxuICAgICAgICAgICAgY29ubi5maXJlKC4uLmFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldFRpbWVTaW5jZUZpcmVkKCkge1xyXG4gICAgICAgIHJldHVybiBwZXJmb3JtYW5jZS5ub3coKSAvIDEwMDAgLSB0aGlzLnRpbWVGaXJlZDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvbm5lY3Rpb248VCBleHRlbmRzIGFueVtdPiB7XHJcbiAgICBncm91cHM6IENvbm5lY3Rpb25Hcm91cFtdID0gW107XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc2lnbmFsOiBTaWduYWw8VD4sIHB1YmxpYyBjYWxsYmFjazogKC4uLmFyZ3M6IFQpID0+IHZvaWQpIHtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIGRpc2Nvbm5lY3QoKSB7XHJcbiAgICAgICAgdGhpcy5zaWduYWwuY29ubmVjdGlvbnMuc3BsaWNlKHRoaXMuc2lnbmFsLmNvbm5lY3Rpb25zLmluZGV4T2YodGhpcyksIDEpO1xyXG4gICAgICAgIGZvcihjb25zdCBncm91cCBvZiB0aGlzLmdyb3Vwcykge1xyXG4gICAgICAgICAgICBncm91cC5jb25uZWN0aW9ucy5zcGxpY2UoZ3JvdXAuY29ubmVjdGlvbnMuaW5kZXhPZih0aGlzKSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ3JvdXBzID0gW107XHJcbiAgICB9XHJcbiAgICBmaXJlKC4uLmFyZ3M6IFQpIHtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrKC4uLmFyZ3MpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSHRtbENvbm5lY3Rpb24ge1xyXG4gICAgZ3JvdXBzOiBDb25uZWN0aW9uR3JvdXBbXSA9IFtdO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFdmVudFRhcmdldCwgcHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIGNhbGxiYWNrOiAoZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKHRoaXMubmFtZSwgdGhpcy5jYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBkaXNjb25uZWN0KCkge1xyXG4gICAgICAgIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLm5hbWUsIHRoaXMuY2FsbGJhY2spO1xyXG4gICAgICAgIGZvcihjb25zdCBncm91cCBvZiB0aGlzLmdyb3Vwcykge1xyXG4gICAgICAgICAgICBncm91cC5jb25uZWN0aW9ucy5zcGxpY2UoZ3JvdXAuY29ubmVjdGlvbnMuaW5kZXhPZih0aGlzKSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ3JvdXBzID0gW107XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uR3JvdXAge1xyXG4gICAgY29ubmVjdGlvbnM6IChDb25uZWN0aW9uPGFueT4gfCBIdG1sQ29ubmVjdGlvbilbXSA9IFtdO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG4gICAgYWRkKGNvbm46IENvbm5lY3Rpb248YW55PiB8IEh0bWxDb25uZWN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5wdXNoKGNvbm4pO1xyXG4gICAgfVxyXG4gICAgZGlzY29ubmVjdEFsbCgpIHtcclxuICAgICAgICBmb3IoY29uc3QgY29ubiBvZiBbLi4udGhpcy5jb25uZWN0aW9uc10pIHtcclxuICAgICAgICAgICAgY29ubi5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMgPSBbXTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBXRUJHTDIgU0hBREVSIENMQVNTRVMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBXR0wyQ29tcG9uZW50U2hhZGVyIHtcclxuICAgIHdTaGFkZXI6IFdlYkdMU2hhZGVyO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LCBwdWJsaWMgdHlwZTogXCJ2ZXJ0ZXhcIiB8IFwiZnJhZ21lbnRcIiwgcHVibGljIHNvdXJjZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgd1NoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0eXBlID09IFwidmVydGV4XCIgPyBnbC5WRVJURVhfU0hBREVSIDogZ2wuRlJBR01FTlRfU0hBREVSKTtcclxuICAgICAgICBpZih3U2hhZGVyID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGNyZWF0ZSBzaGFkZXJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMud1NoYWRlciA9IHdTaGFkZXI7XHJcbiAgICAgICAgZ2wuc2hhZGVyU291cmNlKHdTaGFkZXIsIHNvdXJjZSk7XHJcbiAgICAgICAgZ2wuY29tcGlsZVNoYWRlcih3U2hhZGVyKVxyXG4gICAgICAgIGlmKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIod1NoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvZyA9IGdsLmdldFNoYWRlckluZm9Mb2cod1NoYWRlcik7XHJcbiAgICAgICAgICAgIGdsLmRlbGV0ZVNoYWRlcih3U2hhZGVyKTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGNvbXBpbGUgc2hhZGVyOiBcIiArIGxvZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZGVsZXRlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2wuZGVsZXRlU2hhZGVyKHRoaXMud1NoYWRlcik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXR0wyQ29tcG9uZW50UHJvZ3JhbSB7XHJcbiAgICB3UHJvZ3JhbTogV2ViR0xQcm9ncmFtO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LCBwdWJsaWMgY1NoYWRlclY6IFdHTDJDb21wb25lbnRTaGFkZXIsIHB1YmxpYyBjU2hhZGVyRjogV0dMMkNvbXBvbmVudFNoYWRlcikge1xyXG4gICAgICAgIGNvbnN0IHdQcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG4gICAgICAgIGlmICghd1Byb2dyYW0pIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGNyZWF0ZSBwcm9ncmFtXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLndQcm9ncmFtID0gd1Byb2dyYW07XHJcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKHdQcm9ncmFtLCBjU2hhZGVyVi53U2hhZGVyKTtcclxuICAgICAgICBnbC5hdHRhY2hTaGFkZXIod1Byb2dyYW0sIGNTaGFkZXJGLndTaGFkZXIpO1xyXG4gICAgICAgIGdsLmxpbmtQcm9ncmFtKHdQcm9ncmFtKTtcclxuICAgICAgICBpZighZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcih3UHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvZyA9IGdsLmdldFByb2dyYW1JbmZvTG9nKHdQcm9ncmFtKTtcclxuICAgICAgICAgICAgZ2wuZGVsZXRlUHJvZ3JhbSh3UHJvZ3JhbSk7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBsaW5rIHByb2dyYW06IFwiICsgbG9nKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzZXRBY3RpdmUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKHRoaXMud1Byb2dyYW0pO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2wuZGVsZXRlUHJvZ3JhbSh0aGlzLndQcm9ncmFtKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHR5cGUgV0dMMkF0dHJpYnV0ZVR5cGUgPSAoXHJcbiAgICBcImZsb2F0XCIgfCBcImludFwiIHwgXCJ1aW50XCIgfCBcInZlYzJcIiB8IFwidmVjM1wiIHwgXCJ2ZWM0XCJcclxuICAgIHwgXCJpdmVjMlwiIHwgXCJpdmVjM1wiIHwgXCJpdmVjNFwiIHwgXCJ1dmVjMlwiIHwgXCJ1dmVjM1wiIHwgXCJ1dmVjNFwiXHJcbik7XHJcblxyXG5leHBvcnQgdHlwZSBXR0wyVW5pZm9ybVR5cGUgPSAoXHJcbiAgICBcImZsb2F0XCIgfCBcImludFwiIHwgXCJ1aW50XCIgfCBcInZlYzJcIiB8IFwidmVjM1wiXHJcbiAgICB8IFwidmVjNFwiIHwgXCJpdmVjMlwiIHwgXCJpdmVjM1wiIHwgXCJpdmVjNFwiIHwgXCJ1dmVjMlwiXHJcbiAgICB8IFwidXZlYzNcIiB8IFwidXZlYzRcIiB8IFwibWF0MlwiIHwgXCJtYXQzXCIgfCBcIm1hdDRcIlxyXG4pO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJDb21wb25lbnRCdWZmZXIge1xyXG4gICAgd1R5cGU6IEdMZW51bTtcclxuICAgIHdEaW1lbnNpb25zOiBudW1iZXI7XHJcbiAgICB3QnVmZmVyOiBXZWJHTEJ1ZmZlcjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCwgdHlwZTogV0dMMkF0dHJpYnV0ZVR5cGUpIHtcclxuICAgICAgICBjb25zdCBidWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgICAgICBpZighYnVmZmVyKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBjcmVhdGUgYnVmZmVyXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLndCdWZmZXIgPSBidWZmZXI7XHJcbiAgICAgICAgc3dpdGNoKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImZsb2F0XCI6IHRoaXMud1R5cGUgPSBnbC5GTE9BVDsgdGhpcy53RGltZW5zaW9ucyA9IDE7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidmVjMlwiOiB0aGlzLndUeXBlID0gZ2wuRkxPQVQ7IHRoaXMud0RpbWVuc2lvbnMgPSAyOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInZlYzNcIjogdGhpcy53VHlwZSA9IGdsLkZMT0FUOyB0aGlzLndEaW1lbnNpb25zID0gMzsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ2ZWM0XCI6IHRoaXMud1R5cGUgPSBnbC5GTE9BVDsgdGhpcy53RGltZW5zaW9ucyA9IDQ7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaW50XCI6IHRoaXMud1R5cGUgPSBnbC5JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSAxOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIml2ZWMyXCI6IHRoaXMud1R5cGUgPSBnbC5JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSAyOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIml2ZWMzXCI6IHRoaXMud1R5cGUgPSBnbC5JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSAzOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIml2ZWM0XCI6IHRoaXMud1R5cGUgPSBnbC5JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSA0OyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInVpbnRcIjogdGhpcy53VHlwZSA9IGdsLlVOU0lHTkVEX0lOVDsgdGhpcy53RGltZW5zaW9ucyA9IDE7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXZlYzJcIjogdGhpcy53VHlwZSA9IGdsLlVOU0lHTkVEX0lOVDsgdGhpcy53RGltZW5zaW9ucyA9IDI7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXZlYzNcIjogdGhpcy53VHlwZSA9IGdsLlVOU0lHTkVEX0lOVDsgdGhpcy53RGltZW5zaW9ucyA9IDM7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXZlYzRcIjogdGhpcy53VHlwZSA9IGdsLlVOU0lHTkVEX0lOVDsgdGhpcy53RGltZW5zaW9ucyA9IDQ7IGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoXCJVbnN1cHBvcnRlZCBidWZmZXIgdHlwZTogXCIgKyB0eXBlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzZXRBY3RpdmUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLndCdWZmZXIpO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2wuZGVsZXRlQnVmZmVyKHRoaXMud0J1ZmZlcik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXR0wyQ29tcG9uZW50VmFvIHtcclxuICAgIHdWYW86IFdlYkdMVmVydGV4QXJyYXlPYmplY3Q7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpIHtcclxuICAgICAgICB0aGlzLndWYW8gPSBnbC5jcmVhdGVWZXJ0ZXhBcnJheSgpO1xyXG4gICAgfVxyXG4gICAgc2V0QWN0aXZlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZFZlcnRleEFycmF5KHRoaXMud1Zhbyk7XHJcbiAgICB9XHJcbiAgICBlbmFibGVCdWZmZXIoY0J1ZmZlcjogV0dMMkNvbXBvbmVudEJ1ZmZlciwgd0xvY2F0aW9uOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBjQnVmZmVyLnNldEFjdGl2ZSgpO1xyXG4gICAgICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkod0xvY2F0aW9uKTtcclxuICAgICAgICBpZihjQnVmZmVyLndUeXBlID09IHRoaXMuZ2wuRkxPQVQpIHtcclxuICAgICAgICAgICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHdMb2NhdGlvbiwgY0J1ZmZlci53RGltZW5zaW9ucywgY0J1ZmZlci53VHlwZSwgZmFsc2UsIDAsIDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2wudmVydGV4QXR0cmliSVBvaW50ZXIod0xvY2F0aW9uLCBjQnVmZmVyLndEaW1lbnNpb25zLCBjQnVmZmVyLndUeXBlLCAwLCAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBkZWxldGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nbC5kZWxldGVWZXJ0ZXhBcnJheSh0aGlzLndWYW8pO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMkNvbXBvbmVudFVuaWZvcm0ge1xyXG4gICAgd0xvY2F0aW9uOiBXZWJHTFVuaWZvcm1Mb2NhdGlvbjtcclxuICAgIHF1ZXVlZFZhbHVlczogYW55W10gfCBhbnkgfCBudWxsID0gbnVsbDtcclxuICAgIGhhc1F1ZXVlZCA9IGZhbHNlO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LCBjUHJvZ3JhbTogV0dMMkNvbXBvbmVudFByb2dyYW0sIG5hbWU6IHN0cmluZywgcHVibGljIHR5cGU6IFdHTDJVbmlmb3JtVHlwZSkge1xyXG4gICAgICAgIGNvbnN0IHdMb2NhdGlvbiA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKGNQcm9ncmFtLndQcm9ncmFtLCBuYW1lKTtcclxuICAgICAgICBpZih3TG9jYXRpb24gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGdldCB1bmlmb3JtIGxvY2F0aW9uIGZvciBcIiArIG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLndMb2NhdGlvbiA9IHdMb2NhdGlvbjtcclxuICAgIH1cclxuICAgIHNldFZhbHVlcyh2YWx1ZXMgOiBhbnlbXSB8IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHdMb2NhdGlvbiA9IHRoaXMud0xvY2F0aW9uXHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIHN3aXRjaCh0aGlzLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImZsb2F0XCI6IGdsLnVuaWZvcm0xZih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidmVjMlwiOiBnbC51bmlmb3JtMmZ2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ2ZWMzXCI6IGdsLnVuaWZvcm0zZnYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInZlYzRcIjogZ2wudW5pZm9ybTRmdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaW50XCI6IGdsLnVuaWZvcm0xaSh3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaXZlYzJcIjogZ2wudW5pZm9ybTJpdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaXZlYzNcIjogZ2wudW5pZm9ybTNpdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaXZlYzRcIjogZ2wudW5pZm9ybTRpdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidWludFwiOiBnbC51bmlmb3JtMXVpKHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1dmVjMlwiOiBnbC51bmlmb3JtMnVpdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXZlYzNcIjogZ2wudW5pZm9ybTN1aXYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInV2ZWM0XCI6IGdsLnVuaWZvcm00dWl2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJtYXQyXCI6IGdsLnVuaWZvcm1NYXRyaXgyZnYod0xvY2F0aW9uLCBmYWxzZSwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJtYXQzXCI6IGdsLnVuaWZvcm1NYXRyaXgzZnYod0xvY2F0aW9uLCBmYWxzZSwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJtYXQ0XCI6IGdsLnVuaWZvcm1NYXRyaXg0ZnYod0xvY2F0aW9uLCBmYWxzZSwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIHVuaWZvcm0gdHlwZTogXCIgKyB0aGlzLnR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHF1ZXVlVmFsdWVzKHZhbHVlczogYW55W10gfCBhbnkpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmhhc1F1ZXVlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5xdWV1ZWRWYWx1ZXMgPSB2YWx1ZXM7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMuaGFzUXVldWVkKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5oYXNRdWV1ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnNldFZhbHVlcyh0aGlzLnF1ZXVlZFZhbHVlcyk7XHJcbiAgICAgICAgdGhpcy5xdWV1ZWRWYWx1ZXMgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMkF0dHJpYnV0ZSB7XHJcbiAgICB3TG9jYXRpb246IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCwgcHVibGljIHdQcm9ncmFtOiBXZWJHTFByb2dyYW0sIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyB0eXBlOiBXR0wyQXR0cmlidXRlVHlwZSkge1xyXG4gICAgICAgIHRoaXMud0xvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24od1Byb2dyYW0sIG5hbWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMlRleHR1cmUyRCB7XHJcbiAgICB3VGV4dHVyZTogV2ViR0xUZXh0dXJlO1xyXG4gICAgdW5pZm9ybTogV0dMMkNvbXBvbmVudFVuaWZvcm07XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc2hhZGVyOiBXR0wyU2hhZGVyLCBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgc2xvdDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy53VGV4dHVyZSA9IHNoYWRlci5nbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgdGhpcy5zZXRBY3RpdmUoKTtcclxuICAgICAgICB0aGlzLnVuaWZvcm0gPSBzaGFkZXIuY3JlYXRlVW5pZm9ybShuYW1lLCBcImludFwiKTtcclxuICAgICAgICB0aGlzLnVuaWZvcm0uc2V0VmFsdWVzKHRoaXMuc2xvdCk7XHJcbiAgICB9XHJcbiAgICBzZXRBY3RpdmUoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgdGhpcy5zbG90KTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0aGlzLndUZXh0dXJlKTtcclxuICAgIH1cclxuICAgIHNldEludGVycG9sYXRpb24oaXNFbmFibGVkOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGlzRW5hYmxlZCA/IGdsLkxJTkVBUiA6IGdsLk5FQVJFU1QpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBpc0VuYWJsZWQgPyBnbC5MSU5FQVIgOiBnbC5ORUFSRVNUKTtcclxuICAgIH1cclxuICAgIHNldFJlcGVhdChpc0VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBpc0VuYWJsZWQgPyBnbC5SRVBFQVQgOiBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBpc0VuYWJsZWQgPyBnbC5SRVBFQVQgOiBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgIH1cclxuICAgIHNldERhdGEod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGRhdGE6IEFycmF5QnVmZmVyVmlldyB8IG51bGwgPSBudWxsKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIHdpZHRoLCBoZWlnaHQsIDAsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIGRhdGEpO1xyXG4gICAgfVxyXG4gICAgc2V0SW1hZ2UoaW1hZ2U6IFRleEltYWdlU291cmNlKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIGltYWdlKTtcclxuICAgIH1cclxuICAgIGdlbmVyYXRlTWlwbWFwKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XHJcbiAgICB9XHJcbiAgICBkZWxldGUoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC5kZWxldGVUZXh0dXJlKHRoaXMud1RleHR1cmUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMk9iamVjdCB7XHJcbiAgICBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dDtcclxuICAgIGNWYW86IFdHTDJDb21wb25lbnRWYW87XHJcbiAgICBjQnVmZmVyQnlOYW1lOiB7W2tleTpzdHJpbmddOiBXR0wyQ29tcG9uZW50QnVmZmVyfSA9IHt9O1xyXG4gICAgdmVydGV4Q291bnQ6IG51bWJlciA9IDA7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc2hhZGVyOiBXR0wyU2hhZGVyKSB7XHJcbiAgICAgICAgdGhpcy5nbCA9IHNoYWRlci5nbDtcclxuICAgICAgICB0aGlzLmNWYW8gPSBuZXcgV0dMMkNvbXBvbmVudFZhbyhzaGFkZXIuZ2wpO1xyXG4gICAgICAgIHRoaXMuY1Zhby5zZXRBY3RpdmUoKTtcclxuICAgICAgICBmb3IoY29uc3QgYXR0cmlidXRlIG9mIHNoYWRlci5hdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNCdWYgPSBuZXcgV0dMMkNvbXBvbmVudEJ1ZmZlcihzaGFkZXIuZ2wsIGF0dHJpYnV0ZS50eXBlKTtcclxuICAgICAgICAgICAgY0J1Zi5zZXRBY3RpdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5jVmFvLmVuYWJsZUJ1ZmZlcihjQnVmLCBhdHRyaWJ1dGUud0xvY2F0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5jQnVmZmVyQnlOYW1lW2F0dHJpYnV0ZS5uYW1lXSA9IGNCdWY7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2V0RGF0YShhdHRyaWJ1dGVOYW1lOiBzdHJpbmcsIHZhbHVlczogRmxvYXQzMkFycmF5LCB1c2FnZTogR0xlbnVtID0gdGhpcy5nbC5TVEFUSUNfRFJBVykge1xyXG4gICAgICAgIGNvbnN0IGNCdWYgPSB0aGlzLmNCdWZmZXJCeU5hbWVbYXR0cmlidXRlTmFtZV07XHJcbiAgICAgICAgaWYoY0J1ZiA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkIG5vdCBmaW5kIGF0dHJpYnV0ZSB3aXRoIG5hbWU6IFwiICsgYXR0cmlidXRlTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNCdWYuc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB2YWx1ZXMsIHVzYWdlKTtcclxuICAgICAgICB0aGlzLnZlcnRleENvdW50ID0gdmFsdWVzLmxlbmd0aCAvIGNCdWYud0RpbWVuc2lvbnM7XHJcbiAgICB9XHJcbiAgICBkcmF3VHJpYW5nbGVzKCkge1xyXG4gICAgICAgIHRoaXMuY1Zhby5zZXRBY3RpdmUoKTtcclxuICAgICAgICB0aGlzLmdsLmRyYXdBcnJheXModGhpcy5nbC5UUklBTkdMRVMsIDAsIHRoaXMudmVydGV4Q291bnQpO1xyXG4gICAgfVxyXG4gICAgZHJhd0xpbmVzKCkge1xyXG4gICAgICAgIHRoaXMuY1Zhby5zZXRBY3RpdmUoKTtcclxuICAgICAgICB0aGlzLmdsLmRyYXdBcnJheXModGhpcy5nbC5MSU5FUywgMCwgdGhpcy52ZXJ0ZXhDb3VudCk7XHJcbiAgICB9XHJcbiAgICBkcmF3UG9pbnRzKCkge1xyXG4gICAgICAgIHRoaXMuY1Zhby5zZXRBY3RpdmUoKTtcclxuICAgICAgICB0aGlzLmdsLmRyYXdBcnJheXModGhpcy5nbC5QT0lOVFMsIDAsIHRoaXMudmVydGV4Q291bnQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMlNoYWRlciB7XHJcbiAgICBjUHJvZ3JhbTogV0dMMkNvbXBvbmVudFByb2dyYW07XHJcbiAgICBhdHRyaWJ1dGVzOiBXR0wyQXR0cmlidXRlW10gPSBbXTtcclxuICAgIGNVbmlmb3JtczogV0dMMkNvbXBvbmVudFVuaWZvcm1bXSA9IFtdXHJcbiAgICBjVW5pZm9ybUJ5TmFtZToge1trZXk6c3RyaW5nXTpXR0wyQ29tcG9uZW50VW5pZm9ybX0gPSB7fTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCwgdlNvdXJjZTogc3RyaW5nLCBmU291cmNlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmNQcm9ncmFtID0gbmV3IFdHTDJDb21wb25lbnRQcm9ncmFtKFxyXG4gICAgICAgICAgICBnbCwgbmV3IFdHTDJDb21wb25lbnRTaGFkZXIoZ2wsIFwidmVydGV4XCIsIHZTb3VyY2UpLFxyXG4gICAgICAgICAgICBuZXcgV0dMMkNvbXBvbmVudFNoYWRlcihnbCwgXCJmcmFnbWVudFwiLCBmU291cmNlKSxcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMuY1Byb2dyYW0uc2V0QWN0aXZlKCk7XHJcbiAgICB9XHJcbiAgICBhZGRBdHRyaWJ1dGUobmFtZTogc3RyaW5nLCB0eXBlOiBXR0wyQXR0cmlidXRlVHlwZSkge1xyXG4gICAgICAgIGNvbnN0IGF0dCA9IG5ldyBXR0wyQXR0cmlidXRlKHRoaXMuZ2wsIHRoaXMuY1Byb2dyYW0ud1Byb2dyYW0sIG5hbWUsIHR5cGUpO1xyXG4gICAgICAgIHRoaXMuYXR0cmlidXRlcy5wdXNoKGF0dCk7XHJcbiAgICAgICAgcmV0dXJuIGF0dDtcclxuICAgIH1cclxuICAgIGNyZWF0ZVVuaWZvcm0obmFtZTogc3RyaW5nLCB0eXBlOiBXR0wyVW5pZm9ybVR5cGUpIHtcclxuICAgICAgICBjb25zdCB1bmlmb3JtID0gbmV3IFdHTDJDb21wb25lbnRVbmlmb3JtKHRoaXMuZ2wsIHRoaXMuY1Byb2dyYW0sIG5hbWUsIHR5cGUpO1xyXG4gICAgICAgIHRoaXMuY1VuaWZvcm1zLnB1c2godW5pZm9ybSk7XHJcbiAgICAgICAgdGhpcy5jVW5pZm9ybUJ5TmFtZVtuYW1lXSA9IHVuaWZvcm07XHJcbiAgICAgICAgcmV0dXJuIHVuaWZvcm07XHJcbiAgICB9XHJcbiAgICBnZXRVbmlmb3JtKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNVbmlmb3JtQnlOYW1lW25hbWVdO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlT2JqZWN0KCkge1xyXG4gICAgICAgIGNvbnN0IG9iaiA9IG5ldyBXR0wyT2JqZWN0KHRoaXMpO1xyXG4gICAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVUZXh0dXJlMkQobmFtZTogc3RyaW5nLCBzbG90OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB0ZXh0dXJlID0gbmV3IFdHTDJUZXh0dXJlMkQodGhpcywgbmFtZSwgc2xvdCk7XHJcbiAgICAgICAgcmV0dXJuIHRleHR1cmU7XHJcbiAgICB9XHJcbiAgICBzZXRBY3RpdmUoKSB7XHJcbiAgICAgICAgdGhpcy5jUHJvZ3JhbS5zZXRBY3RpdmUoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgVEVYVFVSRSBBVExBUyBDTEFTUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCB0eXBlIEF0bGFzSW1hZ2UgPSB7eDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyLCBpbWc6IEhUTUxJbWFnZUVsZW1lbnQsIG5hbWU6IHN0cmluZ307XHJcblxyXG5leHBvcnQgY2xhc3MgVGV4dHVyZUF0bGFzIHtcclxuICAgIHdpZHRoOiBudW1iZXI7XHJcbiAgICBoZWlnaHQ6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpbWFnZTogSFRNTEltYWdlRWxlbWVudCwgcHVibGljIGJvdW5kczoge1tuYW1lOnN0cmluZ106IEF0bGFzSW1hZ2V9KSB7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IGltYWdlLm5hdHVyYWxXaWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGltYWdlLm5hdHVyYWxIZWlnaHQ7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZnJvbVVybHMoYXJnczogW25hbWU6c3RyaW5nLCB1cmw6c3RyaW5nXVtdLCBwYWRkaW5nID0gMCkge1xyXG4gICAgICAgIGxldCBpbWFnZXM6IEF0bGFzSW1hZ2VbXSA9IFtdO1xyXG4gICAgICAgIGxldCBwcm9taXNlczogUHJvbWlzZTx2b2lkPltdID0gW107XHJcbiAgICAgICAgbGV0IGF0bGFzU2l6ZSA9IDA7XHJcbiAgICAgICAgZm9yKGxldCBbbmFtZSwgdXJsXSBvZiBhcmdzKSB7XHJcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2gobmV3IFByb21pc2U8dm9pZD4oYXN5bmMgcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGE6IEF0bGFzSW1hZ2UgPSB7aW1nLCB4OjAsIHk6MCwgdzppbWcubmF0dXJhbFdpZHRoKzIqcGFkZGluZywgaDppbWcubmF0dXJhbEhlaWdodCsyKnBhZGRpbmcsIG5hbWV9O1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpc0NvbGxpZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCB4PTA7eDw9YXRsYXNTaXplLWRhdGEudzt4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCB5PTA7eTw9YXRsYXNTaXplLWRhdGEuaDt5KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29sbGlkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IG90aGVyIG9mIGltYWdlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHggKyBkYXRhLncgPiBvdGhlci54ICYmIHkgKyBkYXRhLmggPiBvdGhlci55ICYmIHggPCBvdGhlci54ICsgb3RoZXIudyAmJiB5IDwgb3RoZXIueSArIG90aGVyLmgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb2xsaWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighaXNDb2xsaWRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnggPSB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEueSA9IHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWlzQ29sbGlkaW5nKSBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaXNDb2xsaWRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS54ID0gYXRsYXNTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnkgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdGxhc1NpemUgPSBkYXRhLnggKyBkYXRhLnc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlcy5wdXNoKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IHVybDtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XHJcbiAgICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICAgICAgY2FudmFzLndpZHRoID0gYXRsYXNTaXplO1xyXG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBhdGxhc1NpemU7XHJcbiAgICAgICAgbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIikhO1xyXG4gICAgICAgIGxldCBib3VuZHM6IHtbbmFtZTpzdHJpbmddOiBBdGxhc0ltYWdlfSA9IHt9O1xyXG4gICAgICAgIGZvcihsZXQgaW1nIG9mIGltYWdlcykge1xyXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZy5pbWcsIGltZy54ICsgcGFkZGluZywgaW1nLnkgKyBwYWRkaW5nKTtcclxuICAgICAgICAgICAgaWYocGFkZGluZyAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCAwLCAwLCAxLCBpbWcuaC0yKnBhZGRpbmcsIGltZy54LCBpbWcueSArIHBhZGRpbmcsIHBhZGRpbmcsIGltZy5oLTIqcGFkZGluZyk7IC8vIGxlZnRcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgaW1nLnctMipwYWRkaW5nLTEsIDAsIDEsIGltZy5oLTIqcGFkZGluZywgaW1nLngraW1nLnctcGFkZGluZywgaW1nLnkgKyBwYWRkaW5nLCBwYWRkaW5nLCBpbWcuaC0yKnBhZGRpbmcpOyAvLyByaWdodFxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCAwLCAwLCBpbWcudy0yKnBhZGRpbmcsIDEsIGltZy54ICsgcGFkZGluZywgaW1nLnksIGltZy53LTIqcGFkZGluZywgcGFkZGluZyk7IC8vIHRvcFxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCAwLCBpbWcuaC0yKnBhZGRpbmctMSwgaW1nLnctMipwYWRkaW5nLCAxLCBpbWcueCArIHBhZGRpbmcsIGltZy55K2ltZy5oLXBhZGRpbmcsIGltZy53LTIqcGFkZGluZywgcGFkZGluZyk7IC8vIGJvdHRvbVxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCAwLCAwLCAyLCAyLCBpbWcueCwgaW1nLnksIHBhZGRpbmcsIHBhZGRpbmcpOyAvLyB0b3AtbGVmdFxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCBpbWcudy0yKnBhZGRpbmctMiwgMCwgMiwgMiwgaW1nLngraW1nLnctcGFkZGluZywgaW1nLnksIHBhZGRpbmcsIHBhZGRpbmcpOyAvLyB0b3AtcmlnaHRcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgMCwgaW1nLmgtMipwYWRkaW5nLTIsIDIsIDIsIGltZy54LCBpbWcueStpbWcuaC1wYWRkaW5nLCBwYWRkaW5nLCBwYWRkaW5nKTsgLy8gYm90dG9tLWxlZnRcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgaW1nLnctMipwYWRkaW5nLTIsIGltZy5oLTIqcGFkZGluZy0yLCAyLCAyLCBpbWcueCtpbWcudy1wYWRkaW5nLCBpbWcueStpbWcuaC1wYWRkaW5nLCBwYWRkaW5nLCBwYWRkaW5nKTsgLy8gYm90dG9tLXJpZ2h0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW1nLnggPSAoaW1nLnggKyBwYWRkaW5nKSAvIGF0bGFzU2l6ZTtcclxuICAgICAgICAgICAgaW1nLnkgPSAoaW1nLnkgKyBwYWRkaW5nKSAvIGF0bGFzU2l6ZTtcclxuICAgICAgICAgICAgaW1nLncgPSAoaW1nLncgLSAyKnBhZGRpbmcpIC8gYXRsYXNTaXplO1xyXG4gICAgICAgICAgICBpbWcuaCA9IChpbWcuaCAtIDIqcGFkZGluZykgLyBhdGxhc1NpemU7XHJcbiAgICAgICAgICAgIGJvdW5kc1tpbWcubmFtZV0gPSBpbWc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB1cmwgPSBjYW52YXMudG9EYXRhVVJMKCk7XHJcbiAgICAgICAgY29uc3QgYXRsYXNJbWFnZSA9IGF3YWl0IG5ldyBQcm9taXNlPEhUTUxJbWFnZUVsZW1lbnQ+KHJlcyA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlcyhpbWcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGltZy5zcmMgPSB1cmw7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUZXh0dXJlQXRsYXMoYXRsYXNJbWFnZSwgYm91bmRzKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIENPTE9SIENMQVNTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBDb2xvciB7XHJcbiAgICAvLyBSR0IgMC0yNTVcclxuICAgIHI6IG51bWJlcjtcclxuICAgIGc6IG51bWJlcjtcclxuICAgIGI6IG51bWJlcjtcclxuICAgIC8vIEFscGhhIDAtMTAwXHJcbiAgICBhOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyLCBhOiBudW1iZXIgPSAxMDApIHtcclxuICAgICAgICB0aGlzLnIgPSBFTWF0aC5jbGFtcChyLCAwLCAyNTUpO1xyXG4gICAgICAgIHRoaXMuZyA9IEVNYXRoLmNsYW1wKGcsIDAsIDI1NSk7XHJcbiAgICAgICAgdGhpcy5iID0gRU1hdGguY2xhbXAoYiwgMCwgMjU1KTtcclxuICAgICAgICB0aGlzLmEgPSBFTWF0aC5jbGFtcChhLCAwLCAxMDApO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGZyb21IU1YoaDogbnVtYmVyLCBzOiBudW1iZXIsIHY6IG51bWJlciwgYTogbnVtYmVyID0gMTAwKSB7XHJcbiAgICAgICAgaCA9IEVNYXRoLnBtb2QoaCwgMzYwKTtcclxuICAgICAgICBzID0gRU1hdGguY2xhbXAocywgMCwgMTAwKTtcclxuICAgICAgICB2ID0gRU1hdGguY2xhbXAodiwgMCAsMTAwKTtcclxuICAgICAgICBjb25zdCBjID0gdiAvIDEwMCAqIHMgLyAxMDA7XHJcbiAgICAgICAgY29uc3QgeCA9IGMgKiAoMSAtIE1hdGguYWJzKCgoaCAvIDYwKSAlIDIpIC0gMSkpO1xyXG4gICAgICAgIGNvbnN0IG0gPSB2IC8gMTAwIC0gYztcclxuICAgICAgICBsZXQgcnA9MCwgZ3A9MCwgYnA9MDtcclxuICAgICAgICBzd2l0Y2goTWF0aC5mbG9vcihoIC8gNjApKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDogcnA9YzsgZ3A9eDsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMTogcnA9eDsgZ3A9YzsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMjogZ3A9YzsgYnA9eDsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzogZ3A9eDsgYnA9YzsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNDogcnA9eDsgYnA9YzsgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHJwPWM7IGJwPXg7IGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCByID0gTWF0aC5yb3VuZCgocnAgKyBtKSAqIDI1NSk7XHJcbiAgICAgICAgY29uc3QgZyA9IE1hdGgucm91bmQoKGdwICsgbSkgKiAyNTUpO1xyXG4gICAgICAgIGNvbnN0IGIgPSBNYXRoLnJvdW5kKChicCArIG0pICogMjU1KTtcclxuICAgICAgICByZXR1cm4gbmV3IENvbG9yKHIsIGcsIGIsIGEpO1xyXG4gICAgfVxyXG4gICAgdG9IU1YoKSB7XHJcbiAgICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgodGhpcy5yLCB0aGlzLmcsIHRoaXMuYik7XHJcbiAgICAgICAgY29uc3QgbWluID0gTWF0aC5taW4odGhpcy5yLCB0aGlzLmcsIHRoaXMuYik7XHJcbiAgICAgICAgY29uc3QgZGVsdGEgPSBtYXggLSBtaW47XHJcbiAgICAgICAgbGV0IGggPSAwO1xyXG4gICAgICAgIGlmKGRlbHRhICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGlmKG1heCA9PT0gdGhpcy5yKSBoID0gNjAgKiAoKCh0aGlzLmcgLSB0aGlzLmIpIC8gZGVsdGEgKyA2KSAlIDYpO1xyXG4gICAgICAgICAgICBlbHNlIGlmKG1heCA9PT0gdGhpcy5nKSBoID0gNjAgKiAoKHRoaXMuYiAtIHRoaXMucikgLyBkZWx0YSArIDIpO1xyXG4gICAgICAgICAgICBlbHNlIGggPSA2MCAqICgodGhpcy5yIC0gdGhpcy5nKSAvIGRlbHRhICsgNCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGggPCAwKSBoICs9IDM2MDtcclxuICAgICAgICBjb25zdCBzID0gbWF4ID09PSAwID8gMCA6IGRlbHRhL21heCoxMDA7XHJcbiAgICAgICAgY29uc3QgdiA9IG1heC8yNTUqMTAwO1xyXG4gICAgICAgIHJldHVybiB7IGgsIHMsIHYsIGE6dGhpcy5hIH07XHJcbiAgICB9XHJcbiAgICBsZXJwKG90aGVyOiBDb2xvciwgdDogbnVtYmVyKTogQ29sb3Ige1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29sb3IoXHJcbiAgICAgICAgICAgIHRoaXMuciArIChvdGhlci5yIC0gdGhpcy5yKSAqIHQsXHJcbiAgICAgICAgICAgIHRoaXMuZyArIChvdGhlci5nIC0gdGhpcy5nKSAqIHQsXHJcbiAgICAgICAgICAgIHRoaXMuYiArIChvdGhlci5iIC0gdGhpcy5iKSAqIHQsXHJcbiAgICAgICAgICAgIHRoaXMuYSArIChvdGhlci5hIC0gdGhpcy5hKSAqIHQsXHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG4gICAgZ2V0SXNGb3JlZ3JvdW5kV2hpdGUodGhyZXNob2xkID0gMC40Mikge1xyXG4gICAgICAgIGxldCB7ciwgZywgYn0gPSB0aGlzO1xyXG4gICAgICAgIHIgPSAociA8IDAuMDM5MjgpID8gKHIgLyAxMi45MikgOiAoKChyICsgMC4wNTUpIC8gMS4wNTUpIF4gMi40KVxyXG4gICAgICAgIGcgPSAoZyA8IDAuMDM5MjgpID8gKGcgLyAxMi45MikgOiAoKChnICsgMC4wNTUpIC8gMS4wNTUpIF4gMi40KVxyXG4gICAgICAgIGIgPSAoYiA8IDAuMDM5MjgpID8gKGIgLyAxMi45MikgOiAoKChiICsgMC4wNTUpIC8gMS4wNTUpIF4gMi40KVxyXG4gICAgICAgIGxldCBsID0gMC4yMTI2ICogciArIDAuNzE1MiAqIGcgKyAwLjA3MjIgKiBiXHJcbiAgICAgICAgcmV0dXJuIGwgPCB0aHJlc2hvbGQ7XHJcbiAgICB9XHJcbiAgICB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBgcmdiYSgke3RoaXMucn0sICR7dGhpcy5nfSwgJHt0aGlzLmJ9LCAke3RoaXMuYS8xMDB9KWA7XHJcbiAgICB9XHJcbiAgICB0b0FycmF5KCk6IFtyOiBudW1iZXIsIGc6IG51bWJlciwgYjpudW1iZXIsIGE6bnVtYmVyXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLnIsIHRoaXMuZywgdGhpcy5iLCB0aGlzLmFdO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBJTlBVVCBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEtleXByZXNzZXMge1xyXG4gICAgc3RhdGljIGtleVByZXNzZWQ6IHtba2V5OnN0cmluZ106IGFueX0gPSB7fTtcclxuICAgIHN0YXRpYyBwcmVzc2VkS2V5czogU2V0PHN0cmluZz4gPSBuZXcgU2V0KCk7XHJcbiAgICBzdGF0aWMga2V5RG93bkV2ZW50ID0gbmV3IFNpZ25hbDxba2V5TmFtZTpzdHJpbmddPigpO1xyXG4gICAgc3RhdGljIGtleVVwRXZlbnQgPSBuZXcgU2lnbmFsPFtrZXlOYW1lOnN0cmluZ10+KCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBrZXlkb3duKGtleTogc3RyaW5nKSB7XHJcbiAgICBLZXlwcmVzc2VzLmtleVByZXNzZWRba2V5XSA9IHRydWU7XHJcbiAgICBLZXlwcmVzc2VzLnByZXNzZWRLZXlzLmFkZChrZXkpO1xyXG4gICAgS2V5cHJlc3Nlcy5rZXlEb3duRXZlbnQuZmlyZShrZXkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24ga2V5dXAoa2V5OiBzdHJpbmcpIHtcclxuICAgIGRlbGV0ZSBLZXlwcmVzc2VzLmtleVByZXNzZWRba2V5XTtcclxuICAgIEtleXByZXNzZXMucHJlc3NlZEtleXMuZGVsZXRlKGtleSk7XHJcbiAgICBLZXlwcmVzc2VzLmtleVVwRXZlbnQuZmlyZShrZXkpO1xyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZSA9PiB7XHJcbiAgICBjb25zdCBrZXkgPSBlLmtleS50b0xvd2VyQ2FzZSgpO1xyXG4gICAga2V5ZG93bihrZXkpO1xyXG59KTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZSA9PiB7XHJcbiAgICBjb25zdCBrZXkgPSBlLmtleS50b0xvd2VyQ2FzZSgpO1xyXG4gICAga2V5dXAoa2V5KTtcclxufSk7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBlID0+IHtcclxuICAgIGlmKGUuYnV0dG9uID09PSAwKSB7XHJcbiAgICAgICAga2V5ZG93bihcImxtYlwiKTtcclxuICAgIH0gZWxzZSBpZihlLmJ1dHRvbiA9PT0gMSkge1xyXG4gICAgICAgIGtleWRvd24oXCJtbWJcIik7XHJcbiAgICB9IGVsc2UgaWYoZS5idXR0b24gPT09IDIpIHtcclxuICAgICAgICBrZXlkb3duKFwicm1iXCIpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBlID0+IHtcclxuICAgIGlmKGUuYnV0dG9uID09PSAwKSB7XHJcbiAgICAgICAga2V5dXAoXCJsbWJcIik7XHJcbiAgICB9IGVsc2UgaWYoZS5idXR0b24gPT09IDEpIHtcclxuICAgICAgICBrZXl1cChcIm1tYlwiKTtcclxuICAgIH0gZWxzZSBpZihlLmJ1dHRvbiA9PT0gMikge1xyXG4gICAgICAgIGtleXVwKFwicm1iXCIpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmV4cG9ydCBjbGFzcyBQb2ludGVyTG9jayB7XHJcbiAgICBjb25uZWN0aW9ucyA9IG5ldyBDb25uZWN0aW9uR3JvdXAoKTtcclxuICAgIHBvaW50ZXJMb2NrQ2hhbmdlRXZlbnQgPSBuZXcgU2lnbmFsKCk7XHJcbiAgICBsb2NrZWRNb3VzZU1vdmVFdmVudCA9IG5ldyBTaWduYWwoKTtcclxuICAgIGlzRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5hZGQobmV3IEh0bWxDb25uZWN0aW9uKHdpbmRvdywgXCJtb3VzZWRvd25cIiwgKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYodGhpcy5pc0VuYWJsZWQgJiYgZG9jdW1lbnQucG9pbnRlckxvY2tFbGVtZW50ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVxdWVzdFBvaW50ZXJMb2NrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5hZGQobmV3IEh0bWxDb25uZWN0aW9uKHdpbmRvdywgXCJtb3VzZW1vdmVcIiwgKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYoZG9jdW1lbnQucG9pbnRlckxvY2tFbGVtZW50ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2tlZE1vdXNlTW92ZUV2ZW50LmZpcmUoZS5tb3ZlbWVudFgsIGUubW92ZW1lbnRZKTtcclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5hZGQobmV3IEh0bWxDb25uZWN0aW9uKGRvY3VtZW50LCBcInBvaW50ZXJsb2NrY2hhbmdlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wb2ludGVyTG9ja0NoYW5nZUV2ZW50LmZpcmUoZG9jdW1lbnQucG9pbnRlckxvY2tFbGVtZW50ICE9IG51bGwpO1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuICAgIGxvY2soKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5pc0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVxdWVzdFBvaW50ZXJMb2NrKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICB1bmxvY2soKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5pc0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICBkb2N1bWVudC5leGl0UG9pbnRlckxvY2soKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJlbW92ZSgpIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmRpc2Nvbm5lY3RBbGwoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgT0JTRVJWRVIgQ0xBU1NFUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBXaW5kb3dSZXNpemVPYnNlcnZlciB7XHJcbiAgICByZXNpemVFdmVudDogU2lnbmFsPFt3OiBudW1iZXIsIGg6IG51bWJlcl0+ID0gbmV3IFNpZ25hbCh7XHJcbiAgICAgICAgb25Db25uZWN0OiBjb25uID0+IGNvbm4uZmlyZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KSxcclxuICAgIH0pO1xyXG4gICAgY29ubmVjdGlvbnMgPSBuZXcgQ29ubmVjdGlvbkdyb3VwKCk7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmFkZChuZXcgSHRtbENvbm5lY3Rpb24od2luZG93LCBcInJlc2l6ZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzaXplRXZlbnQuZmlyZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcbiAgICByZW1vdmUoKSB7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5kaXNjb25uZWN0QWxsKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBSRU5ERVIgTE9PUCBDTEFTUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgY2xhc3MgUmVuZGVyTG9vcCB7XHJcbiAgICBydW5JbmRleCA9IDA7XHJcbiAgICBpc1J1bm5pbmcgPSBmYWxzZTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBjYWxsYmFjazogKGR0OiBudW1iZXIpID0+IHZvaWQpIHtcclxuXHJcbiAgICB9XHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIGlmKCF0aGlzLmlzUnVubmluZylcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgdGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJ1bkluZGV4Kys7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICBpZih0aGlzLmlzUnVubmluZylcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgdGhpcy5pc1J1bm5pbmcgPSB0cnVlO1xyXG4gICAgICAgIGxldCByaSA9IHRoaXMucnVuSW5kZXg7XHJcbiAgICAgICAgbGV0IGZyYW1lVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpLzEwMDA7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZih0aGlzLnJ1bkluZGV4ICE9IHJpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpLzEwMDA7XHJcbiAgICAgICAgICAgIGxldCBkdCA9IG5vdyAtIGZyYW1lVGltZTtcclxuICAgICAgICAgICAgZnJhbWVUaW1lID0gbm93O1xyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrKGR0KTtcclxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlbmRlcigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59Il19