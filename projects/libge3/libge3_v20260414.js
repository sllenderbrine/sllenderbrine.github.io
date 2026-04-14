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
                this._hasRgb = true;
                this._hasHsv = false;
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
                this._hasHsv = true;
                this._hasRgb = false;
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
            this._hasRgb = true;
            this._hasHsv = false;
        }
        else if (argA === undefined) {
            this._r = 0;
            this._g = 0;
            this._b = 0;
            this.a = 1;
            this._hasRgb = true;
            this._hasHsv = false;
        }
        else {
            this._r = argA.r;
            this._g = argA.g;
            this._b = argA.b;
            this.a = argA.a;
            this._hasRgb = true;
            this._hasHsv = false;
        }
    }
    clone() {
        return new Color(this);
    }
    _hasRgb = false;
    _hasHsv = false;
    _r = 0;
    /**
     * (int) red value of the color, 0 - 255.
    */
    set r(value) {
        value = EMath.clamp(Math.round(value), 0, 255);
        if (value == this._r)
            return;
        if (!this._hasRgb)
            this._addRgb();
        this._r = value;
        this._hasHsv = false;
    }
    get r() {
        if (!this._hasRgb)
            this._addRgb();
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
        if (!this._hasRgb)
            this._addRgb();
        this._g = value;
        this._hasHsv = false;
    }
    get g() {
        if (!this._hasRgb)
            this._addRgb();
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
        if (!this._hasRgb)
            this._addRgb();
        this._b = value;
        this._hasHsv = false;
    }
    get b() {
        if (!this._hasRgb)
            this._addRgb();
        return this._b;
    }
    _addRgb() {
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
        this._hasRgb = true;
    }
    _hue = 0;
    /**
     * (decimal) hue of the color in degrees, 0 - 360.
    */
    set hue(value) {
        value = EMath.pmod(value, 360);
        if (value == this._hue)
            return;
        if (!this._hasHsv)
            this._addHsv();
        this._hue = value;
        this._hasRgb = false;
    }
    get hue() {
        if (!this._hasHsv)
            this._addHsv();
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
        if (!this._hasHsv)
            this._addHsv();
        this._sat = value;
        this._hasRgb = false;
    }
    get sat() {
        if (!this._hasHsv)
            this._addHsv();
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
        if (!this._hasHsv)
            this._addHsv();
        this._val = value;
        this._hasRgb = false;
    }
    get val() {
        if (!this._hasHsv)
            this._addHsv();
        return this._val;
    }
    _addHsv() {
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
        this._hasHsv = true;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGliZ2UzX3YyMDI2MDQxNC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpYmdlM192MjAyNjA0MTQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQStCO0FBQy9CLG1DQUFtQztBQUVuQyxtQkFBbUI7QUFDbkIsbUJBQW1CO0FBQ25CLG1CQUFtQjtBQUNuQixNQUFNLE9BQWdCLEtBQUs7SUFDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFTLEVBQUMsQ0FBUyxFQUFDLENBQVM7UUFDdEMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQVMsRUFBQyxDQUFTLEVBQUMsQ0FBUztRQUNyQyxPQUFPLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBUyxFQUFDLENBQVM7UUFDM0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLElBQVksSUFBSTtRQUNqRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFTLEVBQUUsSUFBWSxJQUFJO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDM0IsQ0FBQztDQUNKO0FBRUQsc0JBQXNCO0FBQ3RCLHNCQUFzQjtBQUN0QixzQkFBc0I7QUFDdEIsTUFBTSxPQUFP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QUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUNELFFBQVEsQ0FBQyxDQUFTO1FBQ2QsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1osT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxLQUFXO1FBQ1osT0FBTyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFDRCxRQUFRLENBQUMsS0FBVztRQUNoQixJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMxQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsS0FBSyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUNqQyxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUNELFNBQVMsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDckMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELEtBQUssQ0FBQyxDQUFTO1FBQ1gsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFDRCxTQUFTLENBQUMsQ0FBUztRQUNmLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxHQUFHO1FBQ0MsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFDRCxPQUFPO1FBQ0gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxLQUFXLEVBQUUsQ0FBUztRQUN2QixPQUFPLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFDRCxRQUFRLENBQUMsS0FBVyxFQUFFLENBQVM7UUFDM0IsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELEtBQUssQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQzVDLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQ0QsU0FBUyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDaEQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0IsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUk7UUFDQSxPQUFPLElBQUksQ0FB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QUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUNyQixPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNELFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUN6QixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1osT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFTO1FBQ1YsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFDRCxRQUFRLENBQUMsQ0FBUztRQUNkLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1osSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsSUFBSSxDQUFDLEtBQVc7UUFDWixPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBQ0QsUUFBUSxDQUFDLEtBQVc7UUFDaEIsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDMUIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELEtBQUssQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUN0QixPQUFPLElBQUksSUFBSSxDQUFD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QyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QyxNQUFNLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0QsTUFBTSxJQUFJLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsTUFBTSxJQUFJLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsTUFBTSxJQUFJLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsTUFBTSxJQUFJLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsTUFBTSxJQUFJLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsTUFBTSxJQUFJLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsTUFBTSxJQUFJLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLEVB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QUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0QsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0MsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuSCxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuSCxJ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Q0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN6RCxJQUFJLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQUksTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDMUQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN0RCxJQUFHLENBQUMsSUFBSSxHQUFHLEtB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RCxLQUFLLEtBQUs7Z0JBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUNuRCxLQUFLLE9BQU87Z0JBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUN0RCxLQUFLLE9BQU87Z0JBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUN0RCxLQUFLLE9BQU87Z0JBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUN0RCxLQUFLLE1BQU07Z0JBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUNyRCxLQUFLLE9BQU87Z0JBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUN2RCxLQUFLLE9BQU87Z0JBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUN2RCxLQUFLLE9BQU87Z0JBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUN2RCxLQUFLLE1BQU07Z0JBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUNsRSxLQUFLLE1BQU07Z0JBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUNsRSxLQUFLLE1BQU07Z0JBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUNsRSxPQUFP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QyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTztnQkFDM0csR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRO2dCQUMxSSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTTtnQkFDMUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEdBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTO2dCQUMzSSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxXQUFXO2dCQUMvRSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsWUFBWTtnQkFDOUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLGNBQWM7Z0JBQ2hILEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEdBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFD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LENBQUM7UUFDdEIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN2QixJQUFJLFNBQVMsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUMsSUFBSSxDQUFDO1FBQ3ZDLE1BQU0sTUFBTSxHQUFHLEdBQUcsRUFBRTtZQUNoQixJQUFHLElBQUksQ0FBQyxRQUFRLElBQUksRUFBRSxFQUFFLENBQUM7Z0JBQ3JCLE9BQU87WUFDWCxDQUFDO1lBQ0QsSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxHQUFDLElBQUksQ0FBQztZQUNqQyxJQUFJLEVBQUUsR0FBRyxHQUFHLEdBQUcsU0FBUyxDQUFDO1lBQ3pCLFNBQVMsR0FBRyxHQUFHLENBQUM7WUFDaEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNsQixxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUE7UUFDRCxNQUFNLEVBQUUsQ0FBQztRQUNULE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbIi8vIDNELzJEIEpTIEdhbWUgRW5naW5lIExpYnJhcnlcclxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3NsbGVuZGVyYnJpbmVcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIEVNQVRIIENMQVNTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFTWF0aCB7XHJcbiAgICBzdGF0aWMgY2xhbXAobjogbnVtYmVyLGE6IG51bWJlcixiOiBudW1iZXIpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobixhKSxiKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBsZXJwKGE6IG51bWJlcixiOiBudW1iZXIsdDogbnVtYmVyKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIGErKGItYSkqdDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBwbW9kKHg6IG51bWJlcixhOiBudW1iZXIpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gKCh4JWEpK2EpJWE7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgaXNDbG9zZShhOiBudW1iZXIsIGI6IG51bWJlciwgZTogbnVtYmVyID0gMWUtNikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFicyhhLWIpIDwgZTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBpc1plcm8odjogbnVtYmVyLCBlOiBudW1iZXIgPSAxZS02KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKHYpIDwgZTtcclxuICAgIH1cclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgVkVDVE9SIENMQVNTRVMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGNsYXNzIFZlYzMge1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgeTogbnVtYmVyO1xyXG4gICAgejogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IodjogVmVjMyB8IHt4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyfSk7XHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTtcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciB8IHt4Om51bWJlciwgeTpudW1iZXIsIHo6bnVtYmVyfSwgeT86IG51bWJlciwgej86IG51bWJlcikge1xyXG4gICAgICAgIGlmKHR5cGVvZiB4ID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHgueDtcclxuICAgICAgICAgICAgdGhpcy55ID0geC55O1xyXG4gICAgICAgICAgICB0aGlzLnogPSB4Lno7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICAgICAgdGhpcy55ID0geSE7XHJcbiAgICAgICAgICAgIHRoaXMueiA9IHohO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBTdGF0aWMgQ29uc3RydWN0b3JzXHJcbiAgICBzdGF0aWMgZmlsbChuOiBudW1iZXIpOiBWZWMzIHsgcmV0dXJuIG5ldyBWZWMzKG4sIG4sIG4pOyB9XHJcbiAgICBzdGF0aWMgemVybygpOiBWZWMzIHsgcmV0dXJuIFZlYzMuZmlsbCgwKTsgfVxyXG4gICAgc3RhdGljIG9uZSgpOiBWZWMzIHsgcmV0dXJuIFZlYzMuZmlsbCgxKTsgfVxyXG4gICAgc3RhdGljIHhBeGlzKCk6IFZlYzMgeyByZXR1cm4gbmV3IFZlYzMoMSwgMCwgMCk7IH1cclxuICAgIHN0YXRpYyB5QXhpcygpOiBWZWMzIHsgcmV0dXJuIG5ldyBWZWMzKDAsIDEsIDApOyB9XHJcbiAgICBzdGF0aWMgekF4aXMoKTogVmVjMyB7IHJldHVybiBuZXcgVmVjMygwLCAwLCAxKTsgfVxyXG4gICAgc3RhdGljIHJhbmRvbSgpOiBWZWMzIHtcclxuICAgICAgICBjb25zdCB6ID0gTWF0aC5yYW5kb20oKSAqIDIgLSAxO1xyXG4gICAgICAgIGNvbnN0IGEgPSBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XHJcbiAgICAgICAgY29uc3QgYiA9IE1hdGguc3FydChNYXRoLm1heCgwLCAxIC0geiAqIHopKTtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoYiAqIE1hdGguY29zKGEpLCBiICogTWF0aC5zaW4oYSksIHopO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJhbmRvbVJvdGF0aW9uKCk6IFZlYzMge1xyXG4gICAgICAgIGNvbnN0IHYgPSBWZWMzLnJhbmRvbSgpO1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh2LnBpdGNoKCksIHYueWF3KCksIE1hdGgucmFuZG9tKCkgKiAyICogTWF0aC5QSSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTWlzY2VsbGFuZW91c1xyXG4gICAgZ2V0KGk6IG51bWJlcik6IG51bWJlciB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgc3dpdGNoKGkpIHtcclxuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gdGhpcy54O1xyXG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiB0aGlzLnk7XHJcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIHRoaXMuejtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIHNldChpOiBudW1iZXIsIHY6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHN3aXRjaChpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDogdGhpcy54ID0gdjsgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIDE6IHRoaXMueSA9IHY7IHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSAyOiB0aGlzLnogPSB2OyByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2V0Qyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMueiA9IHo7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XHJcbiAgICAgICAgeWllbGQgdGhpcy54O1xyXG4gICAgICAgIHlpZWxkIHRoaXMueTtcclxuICAgICAgICB5aWVsZCB0aGlzLno7XHJcbiAgICB9XHJcbiAgICB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBgPCR7dGhpcy54LnRvRml4ZWQoMil9LCAke3RoaXMueS50b0ZpeGVkKDIpfSwgJHt0aGlzLnoudG9GaXhlZCgyKX0+YDtcclxuICAgIH1cclxuICAgIHRvQXJyYXkoKTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMueCwgdGhpcy55LCB0aGlzLnpdO1xyXG4gICAgfVxyXG4gICAgY2xvbmUoKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgZ2V0QXhpc0JpdCgpOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGF4ID0gTWF0aC5hYnModGhpcy54KTtcclxuICAgICAgICBjb25zdCBheSA9IE1hdGguYWJzKHRoaXMueSk7XHJcbiAgICAgICAgY29uc3QgYXogPSBNYXRoLmFicyh0aGlzLnopO1xyXG4gICAgICAgIGlmKGF4ID4gYXkpIHtcclxuICAgICAgICAgICAgaWYoYXggPiBheikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDBiMTAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDBiMDAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYoYXkgPiBheikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDBiMDEwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDBiMDAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENhbGN1bGF0aW9uc1xyXG4gICAgbGVuZ3RoKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLmRvdCh0aGlzKSk7XHJcbiAgICB9XHJcbiAgICBkb3Qob3RoZXI6IFZlYzMpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiBvdGhlci54ICsgdGhpcy55ICogb3RoZXIueSArIHRoaXMueiAqIG90aGVyLno7XHJcbiAgICB9XHJcbiAgICBkb3RDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiB4ICsgdGhpcy55ICogeSArIHRoaXMueiAqIHo7XHJcbiAgICB9XHJcbiAgICBjcm9zcyhvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLnkgKiBvdGhlci56IC0gdGhpcy56ICogb3RoZXIueSwgLSAodGhpcy54ICogb3RoZXIueiAtIHRoaXMueiAqIG90aGVyLngpLCB0aGlzLnggKiBvdGhlci55IC0gdGhpcy55ICogb3RoZXIueCk7XHJcbiAgICB9XHJcbiAgICBjcm9zc0MoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLnkgKiB6IC0gdGhpcy56ICogeSwgLSAodGhpcy54ICogeiAtIHRoaXMueiAqIHgpLCB0aGlzLnggKiB5IC0gdGhpcy55ICogeCk7XHJcbiAgICB9XHJcbiAgICBhbmdsZShvdGhlcjogVmVjMyk6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgYyA9IHRoaXMubGVuZ3RoKCkgKiBvdGhlci5sZW5ndGgoKTtcclxuICAgICAgICBpZihjID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICByZXR1cm4gTWF0aC5hY29zKEVNYXRoLmNsYW1wKHRoaXMuZG90KG90aGVyKSAvIGMsIC0xLCAxKSk7XHJcbiAgICB9XHJcbiAgICBzaWduZWRBbmdsZShvdGhlcjogVmVjMywgcmVmZXJlbmNlOiBWZWMzID0gVmVjMy55QXhpcygpKTogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBhbmdsZSA9IHRoaXMuYW5nbGUob3RoZXIpO1xyXG4gICAgICAgIGNvbnN0IG5vcm1hbCA9IHRoaXMuY3Jvc3Mob3RoZXIpLm5vcm1TZWxmKCk7XHJcbiAgICAgICAgaWYobm9ybWFsLmRvdChyZWZlcmVuY2Uubm9ybSgpKSA+IDApXHJcbiAgICAgICAgICAgIHJldHVybiAtYW5nbGU7XHJcbiAgICAgICAgcmV0dXJuIGFuZ2xlO1xyXG4gICAgfVxyXG4gICAgZGlzdChvdGhlcjogVmVjMyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViKG90aGVyKS5sZW5ndGgoKTtcclxuICAgIH1cclxuICAgIGRpc3RDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN1YkMoeCwgeSwgeikubGVuZ3RoKCk7XHJcbiAgICB9XHJcbiAgICBzdHJpY3RFcXVhbHMob3RoZXI6IFZlYzMpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ID09IG90aGVyLnggJiYgdGhpcy55ID09IG90aGVyLnkgJiYgdGhpcy56ID09IG90aGVyLno7XHJcbiAgICB9XHJcbiAgICBpc0Nsb3NlKG90aGVyOiBWZWMzLCBlID0gMWUtNik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5pc0Nsb3NlKHRoaXMueCwgb3RoZXIueCwgZSkgJiYgRU1hdGguaXNDbG9zZSh0aGlzLnksIG90aGVyLnksIGUpICYmIEVNYXRoLmlzQ2xvc2UodGhpcy56LCBvdGhlci56LCBlKTtcclxuICAgIH1cclxuICAgIGlzWmVybyhlID0gMWUtNik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5pc1plcm8odGhpcy54LCBlKSAmJiBFTWF0aC5pc1plcm8odGhpcy55LCBlKSAmJiBFTWF0aC5pc1plcm8odGhpcy56LCBlKTtcclxuICAgIH1cclxuICAgIHBpdGNoKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYXNpbih0aGlzLnkpO1xyXG4gICAgfVxyXG4gICAgeWF3KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIoLXRoaXMueCwgLXRoaXMueik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gT3BlcmF0aW9uc1xyXG4gICAgYWRkKG90aGVyOiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMueCArIG90aGVyLngsIHRoaXMueSArIG90aGVyLnksIHRoaXMueiArIG90aGVyLnopO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZihvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCArPSBvdGhlci54O1xyXG4gICAgICAgIHRoaXMueSArPSBvdGhlci55O1xyXG4gICAgICAgIHRoaXMueiArPSBvdGhlci56O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMueCArIHgsIHRoaXMueSArIHksIHRoaXMueiArIHopO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCArPSB4O1xyXG4gICAgICAgIHRoaXMueSArPSB5O1xyXG4gICAgICAgIHRoaXMueiArPSB6O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkRihuOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy54ICsgbiwgdGhpcy55ICsgbiwgdGhpcy56ICsgbik7XHJcbiAgICB9XHJcbiAgICBhZGRTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKz0gbjtcclxuICAgICAgICB0aGlzLnkgKz0gbjtcclxuICAgICAgICB0aGlzLnogKz0gbjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZChvdGhlcjogVmVjMywgczogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5hZGRTY2FsZWRTZWxmKG90aGVyLCBzKTtcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZFNlbGYob3RoZXI6IFZlYzMsIHM6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCArPSBvdGhlci54ICogcztcclxuICAgICAgICB0aGlzLnkgKz0gb3RoZXIueSAqIHM7XHJcbiAgICAgICAgdGhpcy56ICs9IG90aGVyLnogKiBzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBzOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmFkZFNjYWxlZFNlbGZDKHgsIHksIHosIHMpO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgczogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICs9IHggKiBzO1xyXG4gICAgICAgIHRoaXMueSArPSB5ICogcztcclxuICAgICAgICB0aGlzLnogKz0geiAqIHM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWIob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy54IC0gb3RoZXIueCwgdGhpcy55IC0gb3RoZXIueSwgdGhpcy56IC0gb3RoZXIueik7XHJcbiAgICB9XHJcbiAgICBzdWJTZWxmKG90aGVyOiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54IC09IG90aGVyLng7XHJcbiAgICAgICAgdGhpcy55IC09IG90aGVyLnk7XHJcbiAgICAgICAgdGhpcy56IC09IG90aGVyLno7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWJDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy54IC0geCwgdGhpcy55IC0geSwgdGhpcy56IC0geik7XHJcbiAgICB9XHJcbiAgICBzdWJTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54IC09IHg7XHJcbiAgICAgICAgdGhpcy55IC09IHk7XHJcbiAgICAgICAgdGhpcy56IC09IHo7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWJGKG46IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLnggLSBuLCB0aGlzLnkgLSBuLCB0aGlzLnogLSBuKTtcclxuICAgIH1cclxuICAgIHN1YlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAtPSBuO1xyXG4gICAgICAgIHRoaXMueSAtPSBuO1xyXG4gICAgICAgIHRoaXMueiAtPSBuO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcnN1YihvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhvdGhlci54IC0gdGhpcy54LCBvdGhlci55IC0gdGhpcy55LCBvdGhlci56IC0gdGhpcy56KTtcclxuICAgIH1cclxuICAgIHJzdWJTZWxmKG90aGVyOiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0gb3RoZXIueCAtIHRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSBvdGhlci55IC0gdGhpcy55O1xyXG4gICAgICAgIHRoaXMueiA9IG90aGVyLnogLSB0aGlzLno7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByc3ViQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHggLSB0aGlzLngsIHkgLSB0aGlzLnksIHogLSB0aGlzLnopO1xyXG4gICAgfVxyXG4gICAgcnN1YlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSB4IC0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMueSA9IHkgLSB0aGlzLnk7XHJcbiAgICAgICAgdGhpcy56ID0geiAtIHRoaXMuejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJzdWJGKG46IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhuIC0gdGhpcy54LCBuIC0gdGhpcy55LCBuIC0gdGhpcy56KTtcclxuICAgIH1cclxuICAgIHJzdWJTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSBuIC0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMueSA9IG4gLSB0aGlzLnk7XHJcbiAgICAgICAgdGhpcy56ID0gbiAtIHRoaXMuejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG11bChvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLnggKiBvdGhlci54LCB0aGlzLnkgKiBvdGhlci55LCB0aGlzLnogKiBvdGhlci56KTtcclxuICAgIH1cclxuICAgIG11bFNlbGYob3RoZXI6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKj0gb3RoZXIueDtcclxuICAgICAgICB0aGlzLnkgKj0gb3RoZXIueTtcclxuICAgICAgICB0aGlzLnogKj0gb3RoZXIuejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG11bEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLnggKiB4LCB0aGlzLnkgKiB5LCB0aGlzLnogKiB6KTtcclxuICAgIH1cclxuICAgIG11bFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKj0geDtcclxuICAgICAgICB0aGlzLnkgKj0geTtcclxuICAgICAgICB0aGlzLnogKj0gejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG11bEYobjogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMueCAqIG4sIHRoaXMueSAqIG4sIHRoaXMueiAqIG4pO1xyXG4gICAgfVxyXG4gICAgbXVsU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICo9IG47XHJcbiAgICAgICAgdGhpcy55ICo9IG47XHJcbiAgICAgICAgdGhpcy56ICo9IG47XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBkaXYob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy54IC8gb3RoZXIueCwgdGhpcy55IC8gb3RoZXIueSwgdGhpcy56IC8gb3RoZXIueik7XHJcbiAgICB9XHJcbiAgICBkaXZTZWxmKG90aGVyOiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54IC89IG90aGVyLng7XHJcbiAgICAgICAgdGhpcy55IC89IG90aGVyLnk7XHJcbiAgICAgICAgdGhpcy56IC89IG90aGVyLno7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBkaXZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy54IC8geCwgdGhpcy55IC8geSwgdGhpcy56IC8geik7XHJcbiAgICB9XHJcbiAgICBkaXZTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54IC89IHg7XHJcbiAgICAgICAgdGhpcy55IC89IHk7XHJcbiAgICAgICAgdGhpcy56IC89IHo7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBkaXZGKG46IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLnggLyBuLCB0aGlzLnkgLyBuLCB0aGlzLnogLyBuKTtcclxuICAgIH1cclxuICAgIGRpdlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAvPSBuO1xyXG4gICAgICAgIHRoaXMueSAvPSBuO1xyXG4gICAgICAgIHRoaXMueiAvPSBuO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmRpdihvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhvdGhlci54IC8gdGhpcy54LCBvdGhlci55IC8gdGhpcy55LCBvdGhlci56IC8gdGhpcy56KTtcclxuICAgIH1cclxuICAgIHJkaXZTZWxmKG90aGVyOiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0gb3RoZXIueCAvIHRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSBvdGhlci55IC8gdGhpcy55O1xyXG4gICAgICAgIHRoaXMueiA9IG90aGVyLnogLyB0aGlzLno7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByZGl2Qyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHggLyB0aGlzLngsIHkgLyB0aGlzLnksIHogLyB0aGlzLnopO1xyXG4gICAgfVxyXG4gICAgcmRpdlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSB4IC8gdGhpcy54O1xyXG4gICAgICAgIHRoaXMueSA9IHkgLyB0aGlzLnk7XHJcbiAgICAgICAgdGhpcy56ID0geiAvIHRoaXMuejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJkaXZGKG46IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhuIC8gdGhpcy54LCBuIC8gdGhpcy55LCBuIC8gdGhpcy56KTtcclxuICAgIH1cclxuICAgIHJkaXZTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSBuIC8gdGhpcy54O1xyXG4gICAgICAgIHRoaXMueSA9IG4gLyB0aGlzLnk7XHJcbiAgICAgICAgdGhpcy56ID0gbiAvIHRoaXMuejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG5lZygpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoLXRoaXMueCwgLXRoaXMueSwgLXRoaXMueik7XHJcbiAgICB9XHJcbiAgICBuZWdTZWxmKCk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCA9IC10aGlzLng7XHJcbiAgICAgICAgdGhpcy55ID0gLXRoaXMueTtcclxuICAgICAgICB0aGlzLnogPSAtdGhpcy56O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbGVycChvdGhlcjogVmVjMywgdDogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sZXJwU2VsZihvdGhlciwgdCk7XHJcbiAgICB9XHJcbiAgICBsZXJwU2VsZihvdGhlcjogVmVjMywgdDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICs9IChvdGhlci54IC0gdGhpcy54KSAqIHQ7XHJcbiAgICAgICAgdGhpcy55ICs9IChvdGhlci55IC0gdGhpcy55KSAqIHQ7XHJcbiAgICAgICAgdGhpcy56ICs9IChvdGhlci56IC0gdGhpcy56KSAqIHQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBsZXJwQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB0OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxlcnBTZWxmQyh4LCB5LCB6LCB0KTtcclxuICAgIH1cclxuICAgIGxlcnBTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKz0gKHggLSB0aGlzLngpICogdDtcclxuICAgICAgICB0aGlzLnkgKz0gKHkgLSB0aGlzLnkpICogdDtcclxuICAgICAgICB0aGlzLnogKz0gKHogLSB0aGlzLnopICogdDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG5vcm0oKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5ub3JtU2VsZigpO1xyXG4gICAgfVxyXG4gICAgbm9ybVNlbGYoKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgbWFnID0gdGhpcy5sZW5ndGgoKTtcclxuICAgICAgICBpZihtYWcgPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdlNlbGZDKG1hZywgbWFnLCBtYWcpO1xyXG4gICAgfVxyXG4gICAgcmVzY2FsZShtYWc6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucmVzY2FsZVNlbGYobWFnKTtcclxuICAgIH1cclxuICAgIHJlc2NhbGVTZWxmKG1hZzogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9ybVNlbGYoKS5tdWxTZWxmQyhtYWcsIG1hZywgbWFnKTtcclxuICAgIH1cclxuICAgIGxvb2sob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxvb2tTZWxmKG90aGVyKTtcclxuICAgIH1cclxuICAgIGxvb2tTZWxmKG90aGVyOiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucnN1YlNlbGYob3RoZXIpLm5vcm1TZWxmKCk7XHJcbiAgICB9XHJcbiAgICBjbGFtcExlbmd0aChhOiBudW1iZXIsIGI6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuY2xhbXBMZW5ndGhTZWxmKGEsIGIpO1xyXG4gICAgfVxyXG4gICAgY2xhbXBMZW5ndGhTZWxmKGE6IG51bWJlciwgYjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzY2FsZVNlbGYoRU1hdGguY2xhbXAodGhpcy5sZW5ndGgoKSwgYSwgYikpO1xyXG4gICAgfVxyXG4gICAgZmxhdCgpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmZsYXRTZWxmKCk7XHJcbiAgICB9XHJcbiAgICBmbGF0U2VsZigpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnkgPSAwO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZmxhdE5vcm0oKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5mbGF0Tm9ybVNlbGYoKTtcclxuICAgIH1cclxuICAgIGZsYXROb3JtU2VsZigpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mbGF0U2VsZigpLm5vcm1TZWxmKCk7XHJcbiAgICB9XHJcbiAgICBzZXREb3Qob3RoZXI6IFZlYzMsIHRhcmdldDogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5zZXREb3RTZWxmKG90aGVyLCB0YXJnZXQpO1xyXG4gICAgfVxyXG4gICAgc2V0RG90U2VsZihvdGhlcjogVmVjMywgdGFyZ2V0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBkID0gb3RoZXIuZG90KG90aGVyKTtcclxuICAgICAgICBpZihkID09PSAwKSByZXR1cm4gdGhpcztcclxuICAgICAgICByZXR1cm4gdGhpcy5hZGRTY2FsZWRTZWxmKG90aGVyLCAodGFyZ2V0IC0gdGhpcy5kb3Qob3RoZXIpKSAvIGQpO1xyXG4gICAgfVxyXG4gICAgc2V0RG90Qyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuc2V0RG90U2VsZkMoeCwgeSwgeiwgdGFyZ2V0KTtcclxuICAgIH1cclxuICAgIHNldERvdFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHRhcmdldDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgZCA9IHgqeCArIHkqeSArIHoqejtcclxuICAgICAgICBpZihkID09PSAwKSByZXR1cm4gdGhpcztcclxuICAgICAgICByZXR1cm4gdGhpcy5hZGRTY2FsZWRTZWxmQyh4LCB5LCB6LCAodGFyZ2V0IC0gdGhpcy5kb3RDKHgsIHksIHopKSAvIGQpO1xyXG4gICAgfVxyXG4gICAgbWFwKG1ldGhvZDogKHg6IG51bWJlciwgaTogbnVtYmVyKSA9PiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLm1hcFNlbGYobWV0aG9kKTtcclxuICAgIH1cclxuICAgIG1hcFNlbGYobWV0aG9kOiAoeDogbnVtYmVyLCBpOiBudW1iZXIpID0+IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCA9IG1ldGhvZCh0aGlzLngsIDApO1xyXG4gICAgICAgIHRoaXMueSA9IG1ldGhvZCh0aGlzLnksIDEpO1xyXG4gICAgICAgIHRoaXMueiA9IG1ldGhvZCh0aGlzLnosIDIpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm90WChhOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdFhTZWxmKGEpO1xyXG4gICAgfVxyXG4gICAgcm90WFNlbGYoYTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGEpLCBjID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3QgeSA9IHRoaXMueSAqIGMgLSB0aGlzLnogKiBzO1xyXG4gICAgICAgIHRoaXMueiA9IHRoaXMueSAqIHMgKyB0aGlzLnogKiBjO1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByb3RZKGE6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90WVNlbGYoYSk7XHJcbiAgICB9XHJcbiAgICByb3RZU2VsZihhOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSksIGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCB6ID0gdGhpcy56ICogYyAtIHRoaXMueCAqIHM7XHJcbiAgICAgICAgdGhpcy54ID0gdGhpcy54ICogYyArIHRoaXMueiAqIHM7XHJcbiAgICAgICAgdGhpcy56ID0gejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdFooYTogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RaU2VsZihhKTtcclxuICAgIH1cclxuICAgIHJvdFpTZWxmKGE6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhKSwgYyA9IE1hdGguY29zKGEpO1xyXG4gICAgICAgIGNvbnN0IHggPSB0aGlzLnggKiBjIC0gdGhpcy55ICogcztcclxuICAgICAgICB0aGlzLnkgPSB0aGlzLnggKiBzICsgdGhpcy55ICogYztcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm90QXhpcyhheGlzOiBWZWMzLCBhbmdsZTogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RBeGlzU2VsZihheGlzLCBhbmdsZSk7XHJcbiAgICB9XHJcbiAgICByb3RBeGlzU2VsZihheGlzOiBWZWMzLCBhbmdsZTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgYXhpcyA9IGF4aXMubm9ybSgpO1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZSksIGMgPSBNYXRoLmNvcyhhbmdsZSk7XHJcbiAgICAgICAgY29uc3QgY3Jvc3MgPSBheGlzLmNyb3NzKHRoaXMpO1xyXG4gICAgICAgIGNvbnN0IGRvdCA9IGF4aXMuZG90KHRoaXMpO1xyXG4gICAgICAgIGxldCB4ID0gdGhpcy54LCB5ID0gdGhpcy55LCB6ID0gdGhpcy56O1xyXG4gICAgICAgIHRoaXMueCA9IHggKiBjICsgY3Jvc3MueCAqIHMgKyBheGlzLnggKiBkb3QgKiAoMSAtIGMpO1xyXG4gICAgICAgIHRoaXMueSA9IHkgKiBjICsgY3Jvc3MueSAqIHMgKyBheGlzLnkgKiBkb3QgKiAoMSAtIGMpO1xyXG4gICAgICAgIHRoaXMueiA9IHogKiBjICsgY3Jvc3MueiAqIHMgKyBheGlzLnogKiBkb3QgKiAoMSAtIGMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm90WFlaKHJvdDogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90WFlaU2VsZihyb3QpO1xyXG4gICAgfVxyXG4gICAgcm90WFlaU2VsZihyb3Q6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3RYU2VsZihyb3QueCkucm90WVNlbGYocm90LnkpLnJvdFpTZWxmKHJvdC56KTtcclxuICAgIH1cclxuICAgIHJvdFhZWkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90WFlaU2VsZkMoeCwgeSwgeik7XHJcbiAgICB9XHJcbiAgICByb3RYWVpTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90WFNlbGYoeCkucm90WVNlbGYoeSkucm90WlNlbGYoeik7XHJcbiAgICB9XHJcbiAgICByb3RaWVgocm90OiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RaWVhTZWxmKHJvdCk7XHJcbiAgICB9XHJcbiAgICByb3RaWVhTZWxmKHJvdDogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvdFpTZWxmKHJvdC56KS5yb3RZU2VsZihyb3QueSkucm90WFNlbGYocm90LngpO1xyXG4gICAgfVxyXG4gICAgcm90WllYQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RaWVhTZWxmQyh4LCB5LCB6KTtcclxuICAgIH1cclxuICAgIHJvdFpZWFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3RaU2VsZih6KS5yb3RZU2VsZih5KS5yb3RYU2VsZih4KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFZlYzIge1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgeTogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IodjogVmVjMiB8IHt4OiBudW1iZXIsIHk6IG51bWJlcn0pO1xyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpO1xyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyIHwge3g6bnVtYmVyLCB5Om51bWJlcn0sIHk/OiBudW1iZXIpIHtcclxuICAgICAgICBpZih0eXBlb2YgeCA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB4Lng7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHgueTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSB5ITtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU3RhdGljIENvbnN0cnVjdG9yc1xyXG4gICAgc3RhdGljIGZpbGwobjogbnVtYmVyKTogVmVjMiB7IHJldHVybiBuZXcgVmVjMihuLCBuKTsgfVxyXG4gICAgc3RhdGljIHplcm8oKTogVmVjMiB7IHJldHVybiBWZWMyLmZpbGwoMCk7IH1cclxuICAgIHN0YXRpYyBvbmUoKTogVmVjMiB7IHJldHVybiBWZWMyLmZpbGwoMSk7IH1cclxuICAgIHN0YXRpYyB4QXhpcygpOiBWZWMyIHsgcmV0dXJuIG5ldyBWZWMyKDEsIDApOyB9XHJcbiAgICBzdGF0aWMgeUF4aXMoKTogVmVjMiB7IHJldHVybiBuZXcgVmVjMigwLCAxKTsgfVxyXG4gICAgc3RhdGljIHJhbmRvbSgpOiBWZWMyIHtcclxuICAgICAgICBjb25zdCBhID0gTWF0aC5yYW5kb20oKSAqIDIgKiBNYXRoLlBJO1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMihNYXRoLmNvcyhhKSwgTWF0aC5zaW4oYSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1pc2NlbGxhbmVvdXNcclxuICAgIGdldChpOiBudW1iZXIpOiBudW1iZXIgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIHN3aXRjaChpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIHRoaXMueDtcclxuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gdGhpcy55O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgc2V0KGk6IG51bWJlciwgdjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgc3dpdGNoKGkpIHtcclxuICAgICAgICAgICAgY2FzZSAwOiB0aGlzLnggPSB2OyByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgMTogdGhpcy55ID0gdjsgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNldEMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XHJcbiAgICAgICAgeWllbGQgdGhpcy54O1xyXG4gICAgICAgIHlpZWxkIHRoaXMueTtcclxuICAgIH1cclxuICAgIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGA8JHt0aGlzLngudG9GaXhlZCgyKX0sICR7dGhpcy55LnRvRml4ZWQoMil9PmA7XHJcbiAgICB9XHJcbiAgICB0b0FycmF5KCk6IFtudW1iZXIsIG51bWJlcl0ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy54LCB0aGlzLnldO1xyXG4gICAgfVxyXG4gICAgY2xvbmUoKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENhbGN1bGF0aW9uc1xyXG4gICAgbGVuZ3RoKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLmRvdCh0aGlzKSk7XHJcbiAgICB9XHJcbiAgICBkb3Qob3RoZXI6IFZlYzIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiBvdGhlci54ICsgdGhpcy55ICogb3RoZXIueTtcclxuICAgIH1cclxuICAgIGRvdEMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiB4ICsgdGhpcy55ICogeTtcclxuICAgIH1cclxuICAgIGFuZ2xlKG90aGVyOiBWZWMyKTogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBjID0gdGhpcy5sZW5ndGgoKSAqIG90aGVyLmxlbmd0aCgpO1xyXG4gICAgICAgIGlmKGMgPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoRU1hdGguY2xhbXAodGhpcy5kb3Qob3RoZXIpIC8gYywgLTEsIDEpKTtcclxuICAgIH1cclxuICAgIHNpZ25lZEFuZ2xlKG90aGVyOiBWZWMyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnggKiBvdGhlci55IC0gdGhpcy55ICogb3RoZXIueCwgdGhpcy5kb3Qob3RoZXIpKTtcclxuICAgIH1cclxuICAgIGRpc3Qob3RoZXI6IFZlYzIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN1YihvdGhlcikubGVuZ3RoKCk7XHJcbiAgICB9XHJcbiAgICBkaXN0Qyh4OiBudW1iZXIsIHk6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViQyh4LCB5KS5sZW5ndGgoKTtcclxuICAgIH1cclxuICAgIHN0cmljdEVxdWFscyhvdGhlcjogVmVjMik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggPT0gb3RoZXIueCAmJiB0aGlzLnkgPT0gb3RoZXIueTtcclxuICAgIH1cclxuICAgIGlzQ2xvc2Uob3RoZXI6IFZlYzIsIGUgPSAxZS02KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIEVNYXRoLmlzQ2xvc2UodGhpcy54LCBvdGhlci54LCBlKSAmJiBFTWF0aC5pc0Nsb3NlKHRoaXMueSwgb3RoZXIueSwgZSk7XHJcbiAgICB9XHJcbiAgICBpc1plcm8oZSA9IDFlLTYpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gRU1hdGguaXNaZXJvKHRoaXMueCwgZSkgJiYgRU1hdGguaXNaZXJvKHRoaXMueSwgZSk7XHJcbiAgICB9XHJcbiAgICB0aGV0YSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKHRoaXMueSwgdGhpcy54KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBPcGVyYXRpb25zXHJcbiAgICBhZGQob3RoZXI6IFZlYzIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy54ICsgb3RoZXIueCwgdGhpcy55ICsgb3RoZXIueSk7XHJcbiAgICB9XHJcbiAgICBhZGRTZWxmKG90aGVyOiBWZWMyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICs9IG90aGVyLng7XHJcbiAgICAgICAgdGhpcy55ICs9IG90aGVyLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRDKHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCArIHgsIHRoaXMueSArIHkpO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKz0geDtcclxuICAgICAgICB0aGlzLnkgKz0geTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZEYobjogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCArIG4sIHRoaXMueSArIG4pO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICs9IG47XHJcbiAgICAgICAgdGhpcy55ICs9IG47XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWQob3RoZXI6IFZlYzIsIHM6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuYWRkU2NhbGVkU2VsZihvdGhlciwgcyk7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWRTZWxmKG90aGVyOiBWZWMyLCBzOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKz0gb3RoZXIueCAqIHM7XHJcbiAgICAgICAgdGhpcy55ICs9IG90aGVyLnkgKiBzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkQyh4OiBudW1iZXIsIHk6IG51bWJlciwgczogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5hZGRTY2FsZWRTZWxmQyh4LCB5LCBzKTtcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCBzOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKz0geCAqIHM7XHJcbiAgICAgICAgdGhpcy55ICs9IHkgKiBzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3ViKG90aGVyOiBWZWMyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCAtIG90aGVyLngsIHRoaXMueSAtIG90aGVyLnkpO1xyXG4gICAgfVxyXG4gICAgc3ViU2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAtPSBvdGhlci54O1xyXG4gICAgICAgIHRoaXMueSAtPSBvdGhlci55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3ViQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggLSB4LCB0aGlzLnkgLSB5KTtcclxuICAgIH1cclxuICAgIHN1YlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54IC09IHg7XHJcbiAgICAgICAgdGhpcy55IC09IHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWJGKG46IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggLSBuLCB0aGlzLnkgLSBuKTtcclxuICAgIH1cclxuICAgIHN1YlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAtPSBuO1xyXG4gICAgICAgIHRoaXMueSAtPSBuO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcnN1YihvdGhlcjogVmVjMik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMihvdGhlci54IC0gdGhpcy54LCBvdGhlci55IC0gdGhpcy55KTtcclxuICAgIH1cclxuICAgIHJzdWJTZWxmKG90aGVyOiBWZWMyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0gb3RoZXIueCAtIHRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSBvdGhlci55IC0gdGhpcy55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcnN1YkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoeCAtIHRoaXMueCwgeSAtIHRoaXMueSk7XHJcbiAgICB9XHJcbiAgICByc3ViU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSB4IC0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMueSA9IHkgLSB0aGlzLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByc3ViRihuOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIobiAtIHRoaXMueCwgbiAtIHRoaXMueSk7XHJcbiAgICB9XHJcbiAgICByc3ViU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0gbiAtIHRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSBuIC0gdGhpcy55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbXVsKG90aGVyOiBWZWMyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCAqIG90aGVyLngsIHRoaXMueSAqIG90aGVyLnkpO1xyXG4gICAgfVxyXG4gICAgbXVsU2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAqPSBvdGhlci54O1xyXG4gICAgICAgIHRoaXMueSAqPSBvdGhlci55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbXVsQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggKiB4LCB0aGlzLnkgKiB5KTtcclxuICAgIH1cclxuICAgIG11bFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICo9IHg7XHJcbiAgICAgICAgdGhpcy55ICo9IHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBtdWxGKG46IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggKiBuLCB0aGlzLnkgKiBuKTtcclxuICAgIH1cclxuICAgIG11bFNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAqPSBuO1xyXG4gICAgICAgIHRoaXMueSAqPSBuO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZGl2KG90aGVyOiBWZWMyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCAvIG90aGVyLngsIHRoaXMueSAvIG90aGVyLnkpO1xyXG4gICAgfVxyXG4gICAgZGl2U2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAvPSBvdGhlci54O1xyXG4gICAgICAgIHRoaXMueSAvPSBvdGhlci55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZGl2Qyh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggLyB4LCB0aGlzLnkgLyB5KTtcclxuICAgIH1cclxuICAgIGRpdlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54IC89IHg7XHJcbiAgICAgICAgdGhpcy55IC89IHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBkaXZGKG46IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggLyBuLCB0aGlzLnkgLyBuKTtcclxuICAgIH1cclxuICAgIGRpdlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAvPSBuO1xyXG4gICAgICAgIHRoaXMueSAvPSBuO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmRpdihvdGhlcjogVmVjMik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMihvdGhlci54IC8gdGhpcy54LCBvdGhlci55IC8gdGhpcy55KTtcclxuICAgIH1cclxuICAgIHJkaXZTZWxmKG90aGVyOiBWZWMyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0gb3RoZXIueCAvIHRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSBvdGhlci55IC8gdGhpcy55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmRpdkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoeCAvIHRoaXMueCwgeSAvIHRoaXMueSk7XHJcbiAgICB9XHJcbiAgICByZGl2U2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSB4IC8gdGhpcy54O1xyXG4gICAgICAgIHRoaXMueSA9IHkgLyB0aGlzLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByZGl2RihuOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIobiAvIHRoaXMueCwgbiAvIHRoaXMueSk7XHJcbiAgICB9XHJcbiAgICByZGl2U2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0gbiAvIHRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSBuIC8gdGhpcy55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbmVnKCk6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMigtdGhpcy54LCAtdGhpcy55KTtcclxuICAgIH1cclxuICAgIG5lZ1NlbGYoKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0gLXRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSAtdGhpcy55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbGVycChvdGhlcjogVmVjMiwgdDogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sZXJwU2VsZihvdGhlciwgdCk7XHJcbiAgICB9XHJcbiAgICBsZXJwU2VsZihvdGhlcjogVmVjMiwgdDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICs9IChvdGhlci54IC0gdGhpcy54KSAqIHQ7XHJcbiAgICAgICAgdGhpcy55ICs9IChvdGhlci55IC0gdGhpcy55KSAqIHQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBsZXJwQyh4OiBudW1iZXIsIHk6IG51bWJlciwgdDogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sZXJwU2VsZkMoeCwgeSwgdCk7XHJcbiAgICB9XHJcbiAgICBsZXJwU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCArPSAoeCAtIHRoaXMueCkgKiB0O1xyXG4gICAgICAgIHRoaXMueSArPSAoeSAtIHRoaXMueSkgKiB0O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbm9ybSgpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLm5vcm1TZWxmKCk7XHJcbiAgICB9XHJcbiAgICBub3JtU2VsZigpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBtYWcgPSB0aGlzLmxlbmd0aCgpO1xyXG4gICAgICAgIGlmKG1hZyA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2U2VsZkMobWFnLCBtYWcpO1xyXG4gICAgfVxyXG4gICAgcmVzY2FsZShtYWc6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucmVzY2FsZVNlbGYobWFnKTtcclxuICAgIH1cclxuICAgIHJlc2NhbGVTZWxmKG1hZzogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9ybVNlbGYoKS5tdWxTZWxmQyhtYWcsIG1hZyk7XHJcbiAgICB9XHJcbiAgICBsb29rKG90aGVyOiBWZWMyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sb29rU2VsZihvdGhlcik7XHJcbiAgICB9XHJcbiAgICBsb29rU2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJzdWJTZWxmKG90aGVyKS5ub3JtU2VsZigpO1xyXG4gICAgfVxyXG4gICAgY2xhbXBMZW5ndGgoYTogbnVtYmVyLCBiOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmNsYW1wTGVuZ3RoU2VsZihhLCBiKTtcclxuICAgIH1cclxuICAgIGNsYW1wTGVuZ3RoU2VsZihhOiBudW1iZXIsIGI6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc2NhbGVTZWxmKEVNYXRoLmNsYW1wKHRoaXMubGVuZ3RoKCksIGEsIGIpKTtcclxuICAgIH1cclxuICAgIHNldERvdChvdGhlcjogVmVjMiwgdGFyZ2V0OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnNldERvdFNlbGYob3RoZXIsIHRhcmdldCk7XHJcbiAgICB9XHJcbiAgICBzZXREb3RTZWxmKG90aGVyOiBWZWMyLCB0YXJnZXQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IGQgPSBvdGhlci5kb3Qob3RoZXIpO1xyXG4gICAgICAgIGlmKGQgPT09IDApIHJldHVybiB0aGlzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNjYWxlZFNlbGYob3RoZXIsICh0YXJnZXQgLSB0aGlzLmRvdChvdGhlcikpIC8gZCk7XHJcbiAgICB9XHJcbiAgICBzZXREb3RDKHg6IG51bWJlciwgeTogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuc2V0RG90U2VsZkMoeCwgeSwgdGFyZ2V0KTtcclxuICAgIH1cclxuICAgIHNldERvdFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IGQgPSB4KnggKyB5Knk7XHJcbiAgICAgICAgaWYoZCA9PT0gMCkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkU2NhbGVkU2VsZkMoeCwgeSwgKHRhcmdldCAtIHRoaXMuZG90Qyh4LCB5KSkgLyBkKTtcclxuICAgIH1cclxuICAgIG1hcChtZXRob2Q6ICh4OiBudW1iZXIsIGk6IG51bWJlcikgPT4gbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5tYXBTZWxmKG1ldGhvZCk7XHJcbiAgICB9XHJcbiAgICBtYXBTZWxmKG1ldGhvZDogKHg6IG51bWJlciwgaTogbnVtYmVyKSA9PiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSBtZXRob2QodGhpcy54LCAwKTtcclxuICAgICAgICB0aGlzLnkgPSBtZXRob2QodGhpcy55LCAxKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdGF0ZShhOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdGF0ZVNlbGYoYSk7XHJcbiAgICB9XHJcbiAgICByb3RhdGVTZWxmKGE6IG51bWJlcikgOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSksIGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCB4ID0gdGhpcy54LCB5ID0gdGhpcy55O1xyXG4gICAgICAgIHRoaXMueCA9IHggKiBjIC0geSAqIHM7XHJcbiAgICAgICAgdGhpcy55ID0geCAqIHMgKyB5ICogYztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIE1BVFJJWCBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIENvbHVtbi1tYWpvciA0eDQgbWF0cml4XHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNYXQ0IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuICAgIFxyXG4gICAgc3RhdGljIG5ldygpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAxLCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAxLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAxLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdHJhbnNsYXRlKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAxLCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAxLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAxLCAwLFxyXG4gICAgICAgICAgICB4LCB5LCB6LCAxLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgc2NhbGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHgsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIHksIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIHosIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDAsIDEsXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyByb3RhdGVYKGE6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSk7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgMSwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgYywgcywgMCxcclxuICAgICAgICAgICAgMCwgLXMsIGMsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDAsIDFcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJvdGF0ZVkoYTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKGEpO1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhKTtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBjLCAwLCAtcywgMCxcclxuICAgICAgICAgICAgMCwgMSwgMCwgMCxcclxuICAgICAgICAgICAgcywgMCwgYywgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcm90YXRlWihhOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGEpO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIGMsIHMsIDAsIDAsXHJcbiAgICAgICAgICAgIC1zLCBjLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAxLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBwZXJzcGVjdGl2ZShmb3ZZOiBudW1iZXIsIGFzcGVjdDogbnVtYmVyLCBuZWFyOiBudW1iZXIgPSAxLCBmYXI6IG51bWJlciA9IDEwMDApIHtcclxuICAgICAgICBjb25zdCBmID0gMSAvIE1hdGgudGFuKGZvdlkgLyAyKTtcclxuICAgICAgICBjb25zdCBuZiA9IDEgLyAobmVhciAtIGZhcik7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgZi9hc3BlY3QsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIGYsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIChmYXIgKyBuZWFyKSAqIG5mLCAtMSxcclxuICAgICAgICAgICAgMCwgMCwgKDIgKiBmYXIgKiBuZWFyKSAqIG5mLCAwXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBtdWx0aXBseShtMTogbnVtYmVyW10sIG0yOiBudW1iZXJbXSkge1xyXG4gICAgICAgIGNvbnN0IG91dCA9IE1hdDQubmV3KCk7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8NDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaj0wOyBqPDQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgb3V0W2kqNCArIGpdID0gKFxyXG4gICAgICAgICAgICAgICAgICAgIG0xWzAqNCArIGpdISAqIG0yW2kqNCArIDBdIVxyXG4gICAgICAgICAgICAgICAgICAgICsgbTFbMSo0ICsgal0hICogbTJbaSo0ICsgMV0hXHJcbiAgICAgICAgICAgICAgICAgICAgKyBtMVsyKjQgKyBqXSEgKiBtMltpKjQgKyAyXSFcclxuICAgICAgICAgICAgICAgICAgICArIG0xWzMqNCArIGpdISAqIG0yW2kqNCArIDNdIVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8gQ29sdW1uLW1ham9yIDN4MyBtYXRyaXhcclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1hdDMge1xyXG4gICAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAgIHN0YXRpYyBuZXcoKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgMSwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMSwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHRyYW5zbGF0ZSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIDEsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDEsIDAsXHJcbiAgICAgICAgICAgIHgsIHksIDEsXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBzY2FsZSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHgsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIHksIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDEsXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyByb3RhdGUoYTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKGEpO1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhKTtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBjLCBzLCAwLFxyXG4gICAgICAgICAgICAtcywgYywgMCxcclxuICAgICAgICAgICAgMCwgMCwgMSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIG11bHRpcGx5KG0xOiBudW1iZXJbXSwgbTI6IG51bWJlcltdKSB7XHJcbiAgICAgICAgY29uc3Qgb3V0ID0gTWF0My5uZXcoKTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTwzOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCBqPTA7IGo8MzsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRbaSozICsgal0gPSAoXHJcbiAgICAgICAgICAgICAgICAgICAgbTFbMCozICsgal0hICogbTJbaSozICsgMF0hXHJcbiAgICAgICAgICAgICAgICAgICAgKyBtMVsxKjMgKyBqXSEgKiBtMltpKjMgKyAxXSFcclxuICAgICAgICAgICAgICAgICAgICArIG0xWzIqMyArIGpdISAqIG0yW2kqMyArIDJdIVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuY29uc3QgZ3JhZGllbnRzMkQ6IFZlYzJbXSA9IFtdO1xyXG5mb3IobGV0IGk9MDtpPDEyO2krKykge1xyXG4gICAgY29uc3QgYW5nbGUgPSAyICogTWF0aC5QSSAqIGkvMTI7XHJcbiAgICBncmFkaWVudHMyRC5wdXNoKG5ldyBWZWMyKE1hdGguY29zKGFuZ2xlKSwgTWF0aC5zaW4oYW5nbGUpKSk7XHJcbn1cclxuXHJcbmNvbnN0IGdyYWRpZW50czNEOiBWZWMzW10gPSBbXTtcclxuZm9yKGxldCBpPTA7aTwxNjtpKyspIHtcclxuICAgIGNvbnN0IHkgPSAxIC0gKDIqaSkvKDE1KTtcclxuICAgIGNvbnN0IHIgPSBNYXRoLnNxcnQoMS15KnkpO1xyXG4gICAgY29uc3QgYW5nbGUgPSBpICogTWF0aC5QSSAqICgzLU1hdGguc3FydCg1KSk7XHJcbiAgICBncmFkaWVudHMzRC5wdXNoKG5ldyBWZWMzKFxyXG4gICAgICAgIE1hdGguY29zKGFuZ2xlKSAqIHIsXHJcbiAgICAgICAgeSxcclxuICAgICAgICBNYXRoLnNpbihhbmdsZSkgKiByLFxyXG4gICAgKSk7XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIE5PSVNFIENMQVNTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOb2lzZSB7XHJcbiAgICBzdGF0aWMgZmFkZSh0OiBudW1iZXIpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdCAqIHQgKiB0ICogKHQgKiAodCAqIDYgLSAxNSkgKyAxMCk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0UGVybGluVmVjdG9yMkQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHNlZWQgPSAwKSA6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBncmFkaWVudHMyRFtNYXRoLmZsb29yKE5vaXNlLnJhbmRvbUNvbnN0YW50MyhzZWVkLCB4LCB5KSAqIGdyYWRpZW50czJELmxlbmd0aCldITtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRQZXJsaW5WZWN0b3IzRCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBzZWVkID0gMCkgOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gZ3JhZGllbnRzM0RbTWF0aC5mbG9vcihOb2lzZS5yYW5kb21Db25zdGFudDQoc2VlZCwgeCwgeSwgeikgKiBncmFkaWVudHMzRC5sZW5ndGgpXSE7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0Vm9yb25vaUdyaWRQb3NpdGlvbjJEKHg6IG51bWJlciwgeTogbnVtYmVyLCBzZWVkID0gMCwgdCA9IDEpIDogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKFxyXG4gICAgICAgICAgICB4ICsgdCAqIE5vaXNlLnJhbmRvbUNvbnN0YW50Myh4LCB5LCBzZWVkKSxcclxuICAgICAgICAgICAgeSArIHQgKiBOb2lzZS5yYW5kb21Db25zdGFudDMoeCwgeSwgc2VlZCsxKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0Vm9yb25vaUdyaWRWYWx1ZTJEKHg6IG51bWJlciwgeTogbnVtYmVyLCBzZWVkID0gMCkgOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBOb2lzZS5yYW5kb21Db25zdGFudDMoeCwgeSwgc2VlZCsyKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRWb3Jvbm9pR3JpZFBvc2l0aW9uM0QoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgc2VlZCA9IDAsIHQgPSAxKSA6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhcclxuICAgICAgICAgICAgeCArIHQgKiBOb2lzZS5yYW5kb21Db25zdGFudDQoeCwgeSwgeiwgc2VlZCksXHJcbiAgICAgICAgICAgIHkgKyB0ICogTm9pc2UucmFuZG9tQ29uc3RhbnQ0KHksIHosIHgsIHNlZWQrMSksXHJcbiAgICAgICAgICAgIHogKyB0ICogTm9pc2UucmFuZG9tQ29uc3RhbnQ0KHosIHgsIHksIHNlZWQrMiksXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRWb3Jvbm9pR3JpZFZhbHVlM0QoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgc2VlZCA9IDApIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTm9pc2UucmFuZG9tQ29uc3RhbnQ0KHgsIHksIHosIHNlZWQrMyk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcGVybGluTm9pc2UyRCh4OiBudW1iZXIsIHk6IG51bWJlciwgc2VlZCA9IDApIDogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBnZXRQZXJsaW5WZWN0b3IyRCA9IE5vaXNlLmdldFBlcmxpblZlY3RvcjJEO1xyXG4gICAgICAgIGNvbnN0IGxlcnAgPSBFTWF0aC5sZXJwO1xyXG4gICAgICAgIGNvbnN0IGZhZGUgPSBOb2lzZS5mYWRlO1xyXG4gICAgICAgIGNvbnN0IGcwID0gbmV3IFZlYzIoeCwgeSkubWFwU2VsZihNYXRoLmZsb29yKTtcclxuICAgICAgICBjb25zdCBnMSA9IG5ldyBWZWMyKGcwKS5hZGRTZWxmQygxLCAxKTtcclxuICAgICAgICBjb25zdCBmMCA9IG5ldyBWZWMyKHgsIHkpLnN1YlNlbGYoZzApO1xyXG4gICAgICAgIGNvbnN0IGYxID0gbmV3IFZlYzIoeCwgeSkuc3ViU2VsZihnMSk7XHJcbiAgICAgICAgY29uc3QgY0FBID0gZ2V0UGVybGluVmVjdG9yMkQoZzAueCwgZzAueSwgc2VlZCkuZG90KGYwKTtcclxuICAgICAgICBjb25zdCBjQUIgPSBnZXRQZXJsaW5WZWN0b3IyRChnMC54LCBnMS55LCBzZWVkKS5kb3RDKGYwLngsIGYxLnkpO1xyXG4gICAgICAgIGNvbnN0IGNCQSA9IGdldFBlcmxpblZlY3RvcjJEKGcxLngsIGcwLnksIHNlZWQpLmRvdEMoZjEueCwgZjAueSk7XHJcbiAgICAgICAgY29uc3QgY0JCID0gZ2V0UGVybGluVmVjdG9yMkQoZzEueCwgZzEueSwgc2VlZCkuZG90KGYxKTtcclxuICAgICAgICBjb25zdCB0eCA9IGZhZGUoZjAueCk7XHJcbiAgICAgICAgY29uc3QgdHkgPSBmYWRlKGYwLnkpO1xyXG4gICAgICAgIGNvbnN0IGNBID0gbGVycChjQUEsIGNCQSwgdHgpO1xyXG4gICAgICAgIGNvbnN0IGNCID0gbGVycChjQUIsIGNCQiwgdHgpO1xyXG4gICAgICAgIGNvbnN0IGMgPSBsZXJwKGNBLCBjQiwgdHkpO1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5jbGFtcChjICogMC41ICsgMC41LCAwLCAxKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBwZXJsaW5Ob2lzZTNEKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHNlZWQgPSAwKSA6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgZ2V0UGVybGluVmVjdG9yM0QgPSBOb2lzZS5nZXRQZXJsaW5WZWN0b3IzRDtcclxuICAgICAgICBjb25zdCBsZXJwID0gRU1hdGgubGVycDtcclxuICAgICAgICBjb25zdCBmYWRlID0gTm9pc2UuZmFkZTtcclxuICAgICAgICBjb25zdCBnMCA9IG5ldyBWZWMzKHgsIHksIHopLm1hcFNlbGYoTWF0aC5mbG9vcik7XHJcbiAgICAgICAgY29uc3QgZzEgPSBuZXcgVmVjMyhnMCkuYWRkU2VsZkMoMSwgMSwgMSk7XHJcbiAgICAgICAgY29uc3QgZjAgPSBuZXcgVmVjMyh4LCB5LCB6KS5zdWJTZWxmKGcwKTtcclxuICAgICAgICBjb25zdCBmMSA9IG5ldyBWZWMzKHgsIHksIHopLnN1YlNlbGYoZzEpO1xyXG4gICAgICAgIGNvbnN0IGNBQUEgPSBnZXRQZXJsaW5WZWN0b3IzRChnMC54LCBnMC55LCBnMC56LCBzZWVkKS5kb3QoZjApO1xyXG4gICAgICAgIGNvbnN0IGNBQUIgPSBnZXRQZXJsaW5WZWN0b3IzRChnMC54LCBnMC55LCBnMS56LCBzZWVkKS5kb3RDKGYwLngsIGYwLnksIGYxLnopO1xyXG4gICAgICAgIGNvbnN0IGNBQkEgPSBnZXRQZXJsaW5WZWN0b3IzRChnMC54LCBnMS55LCBnMC56LCBzZWVkKS5kb3RDKGYwLngsIGYxLnksIGYwLnopO1xyXG4gICAgICAgIGNvbnN0IGNBQkIgPSBnZXRQZXJsaW5WZWN0b3IzRChnMC54LCBnMS55LCBnMS56LCBzZWVkKS5kb3RDKGYwLngsIGYxLnksIGYxLnopO1xyXG4gICAgICAgIGNvbnN0IGNCQUEgPSBnZXRQZXJsaW5WZWN0b3IzRChnMS54LCBnMC55LCBnMC56LCBzZWVkKS5kb3RDKGYxLngsIGYwLnksIGYwLnopO1xyXG4gICAgICAgIGNvbnN0IGNCQUIgPSBnZXRQZXJsaW5WZWN0b3IzRChnMS54LCBnMC55LCBnMS56LCBzZWVkKS5kb3RDKGYxLngsIGYwLnksIGYxLnopO1xyXG4gICAgICAgIGNvbnN0IGNCQkEgPSBnZXRQZXJsaW5WZWN0b3IzRChnMS54LCBnMS55LCBnMC56LCBzZWVkKS5kb3RDKGYxLngsIGYxLnksIGYwLnopO1xyXG4gICAgICAgIGNvbnN0IGNCQkIgPSBnZXRQZXJsaW5WZWN0b3IzRChnMS54LCBnMS55LCBnMS56LCBzZWVkKS5kb3QoZjEpO1xyXG4gICAgICAgIGNvbnN0IHR4ID0gZmFkZShmMC54KTtcclxuICAgICAgICBjb25zdCB0eSA9IGZhZGUoZjAueSk7XHJcbiAgICAgICAgY29uc3QgdHogPSBmYWRlKGYwLnopO1xyXG4gICAgICAgIGNvbnN0IGNBQSA9IGxlcnAoY0FBQSwgY0JBQSwgdHgpO1xyXG4gICAgICAgIGNvbnN0IGNBQiA9IGxlcnAoY0FBQiwgY0JBQiwgdHgpO1xyXG4gICAgICAgIGNvbnN0IGNCQSA9IGxlcnAoY0FCQSwgY0JCQSwgdHgpO1xyXG4gICAgICAgIGNvbnN0IGNCQiA9IGxlcnAoY0FCQiwgY0JCQiwgdHgpO1xyXG4gICAgICAgIGNvbnN0IGNBID0gbGVycChjQUEsIGNCQSwgdHkpO1xyXG4gICAgICAgIGNvbnN0IGNCID0gbGVycChjQUIsIGNCQiwgdHkpO1xyXG4gICAgICAgIGNvbnN0IGMgPSBsZXJwKGNBLCBjQiwgdHopO1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5jbGFtcChjICogMC41ICsgMC41LCAwLCAxKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyB2b3Jvbm9pTm9pc2UyRCh4OiBudW1iZXIsIHk6IG51bWJlciwgc2VlZCA9IDAsIHQgPSAxKSB7XHJcbiAgICAgICAgbGV0IHAgPSBuZXcgVmVjMih4LCB5KTtcclxuICAgICAgICBjb25zdCBnMCA9IHAubWFwKE1hdGguZmxvb3IpO1xyXG4gICAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgICAgICBwb2ludERpc3RhbmNlOiBJbmZpbml0eSxcclxuICAgICAgICAgICAgdmFsdWU6IDAsXHJcbiAgICAgICAgICAgIGdyaWRQb3M6IFZlYzIuemVybygpLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgZm9yKGxldCB4b2ZmPS0xO3hvZmY8PTE7eG9mZisrKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgeW9mZj0tMTt5b2ZmPD0xO3lvZmYrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JpZFBvcyA9IGcwLmFkZEMoeG9mZiwgeW9mZik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwb2ludFBvcyA9IE5vaXNlLmdldFZvcm9ub2lHcmlkUG9zaXRpb24yRChncmlkUG9zLngsIGdyaWRQb3MueSwgc2VlZCwgdCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaXN0ID0gcC5kaXN0KHBvaW50UG9zKTtcclxuICAgICAgICAgICAgICAgIGlmKGRpc3Q8ZGF0YS5wb2ludERpc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5ncmlkUG9zID0gZ3JpZFBvcztcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnBvaW50RGlzdGFuY2UgPSBkaXN0O1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEudmFsdWUgPSBOb2lzZS5nZXRWb3Jvbm9pR3JpZFZhbHVlMkQoZ3JpZFBvcy54LCBncmlkUG9zLnksIHNlZWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHZvcm9ub2lOb2lzZTNEKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHNlZWQgPSAwLCB0ID0gMSkge1xyXG4gICAgICAgIGxldCBwID0gbmV3IFZlYzMoeCwgeSwgeik7XHJcbiAgICAgICAgY29uc3QgZzAgPSBwLm1hcChNYXRoLmZsb29yKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgcG9pbnREaXN0YW5jZTogSW5maW5pdHksXHJcbiAgICAgICAgICAgIHZhbHVlOiAwLFxyXG4gICAgICAgICAgICBncmlkUG9zOiBWZWMzLnplcm8oKSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGZvcihsZXQgeG9mZj0tMTt4b2ZmPD0xO3hvZmYrKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IHlvZmY9LTE7eW9mZjw9MTt5b2ZmKyspIHtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgem9mZj0tMTt6b2ZmPD0xO3pvZmYrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGdyaWRQb3MgPSBnMC5hZGRDKHhvZmYsIHlvZmYsIHpvZmYpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50UG9zID0gTm9pc2UuZ2V0Vm9yb25vaUdyaWRQb3NpdGlvbjNEKGdyaWRQb3MueCwgZ3JpZFBvcy55LCBncmlkUG9zLnosIHNlZWQsIHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpc3QgPSBwLmRpc3QocG9pbnRQb3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGRpc3Q8ZGF0YS5wb2ludERpc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZ3JpZFBvcyA9IGdyaWRQb3M7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEucG9pbnREaXN0YW5jZSA9IGRpc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEudmFsdWUgPSBOb2lzZS5nZXRWb3Jvbm9pR3JpZFZhbHVlM0QoZ3JpZFBvcy54LCBncmlkUG9zLnksIGdyaWRQb3Mueiwgc2VlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJhbmRvbUNvbnN0YW50MyhhOiBudW1iZXIsIGI6IG51bWJlciwgYzogbnVtYmVyKSA6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgaXQgPSAoYSAqIDIzOTQ4MjM1NDkpIF4gKGIgKiA0Mzg1OTc0Mjg1MCkgXiAoYyAqIDIzMDk0NTY1MjM0KTtcclxuICAgICAgICByZXR1cm4gRU1hdGgucG1vZChpdCwgMTAwMDApIC8gMTAwMDA7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcmFuZG9tQ29uc3RhbnQ0KGE6IG51bWJlciwgYjogbnVtYmVyLCBjOiBudW1iZXIsIGQ6IG51bWJlcikgOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGl0ID0gKGEgKiAyMzk0ODIzNTQ5KSBeIChiICogNDM4NTk3NDI4NTApIF4gKGMgKiAyMzA5NDU2NTIzNCkgXiAoZCAqIDg0Mjc4MjQ1NjYpO1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5wbW9kKGl0LCAxMDAwMCkgLyAxMDAwMDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIENBTUVSQSBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBDYW1lcmEzRCB7XHJcbiAgICBwcml2YXRlIF9mb3ZZOiBudW1iZXIgPSA5NS8xODAqTWF0aC5QSTtcclxuICAgIGdldCBmb3ZZKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3ZZO1xyXG4gICAgfVxyXG4gICAgc2V0IGZvdlkobjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fZm92WSA9IG47XHJcbiAgICAgICAgdGhpcy5fcGVyc3BlY3RpdmVNYXRyaXhVID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9hc3BlY3Q6IG51bWJlciA9IDE7XHJcbiAgICBnZXQgYXNwZWN0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hc3BlY3Q7XHJcbiAgICB9XHJcbiAgICBzZXQgYXNwZWN0KG46IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2FzcGVjdCA9IG47XHJcbiAgICAgICAgdGhpcy5fcGVyc3BlY3RpdmVNYXRyaXhVID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9uZWFyOiBudW1iZXIgPSAwLjE7XHJcbiAgICBnZXQgbmVhcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbmVhcjtcclxuICAgIH1cclxuICAgIHNldCBuZWFyKG46IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX25lYXIgPSBuO1xyXG4gICAgICAgIHRoaXMuX3BlcnNwZWN0aXZlTWF0cml4VSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZmFyOiBudW1iZXIgPSAxMDAwMDtcclxuICAgIGdldCBmYXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZhcjtcclxuICAgIH1cclxuICAgIHNldCBmYXIobjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fZmFyID0gbjtcclxuICAgICAgICB0aGlzLl9wZXJzcGVjdGl2ZU1hdHJpeFUgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3Bvc2l0aW9uID0gVmVjMy56ZXJvKCk7XHJcbiAgICBnZXQgcG9zaXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uO1xyXG4gICAgfVxyXG4gICAgc2V0IHBvc2l0aW9uKHY6IFZlYzMpIHtcclxuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IHY7XHJcbiAgICAgICAgdGhpcy5fdHJhbnNsYXRpb25NYXRyaXhVID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl92aWV3TWF0cml4VSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfd29ybGRTY2FsZSA9IDE7XHJcbiAgICBnZXQgd29ybGRTY2FsZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd29ybGRTY2FsZTtcclxuICAgIH1cclxuICAgIHNldCB3b3JsZFNjYWxlKG46IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3dvcmxkU2NhbGUgPSBuO1xyXG4gICAgICAgIHRoaXMuX3RyYW5zbGF0aW9uTWF0cml4VSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fdmlld01hdHJpeFUgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JvdGF0aW9uID0gVmVjMy56ZXJvKCk7XHJcbiAgICBnZXQgcm90YXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvdGF0aW9uO1xyXG4gICAgfVxyXG4gICAgc2V0IHJvdGF0aW9uKHY6IFZlYzMpIHtcclxuICAgICAgICB0aGlzLl9yb3RhdGlvbiA9IHY7XHJcbiAgICAgICAgdGhpcy5fZm9yd2FyZFUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3JpZ2h0VSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fdXBVID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9mb3J3YXJkRmxhdFUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3JvdGF0aW9uTWF0cml4VSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fdmlld01hdHJpeFUgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2ZvcndhcmQgPSBWZWMzLnplcm8oKTtcclxuICAgIHByaXZhdGUgX2ZvcndhcmRVID0gdHJ1ZTtcclxuICAgIGdldCBmb3J3YXJkKCkge1xyXG4gICAgICAgIGlmKHRoaXMuX2ZvcndhcmRVKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvcndhcmQgPSBWZWMzLnpBeGlzKCkubmVnU2VsZigpLnJvdFhZWlNlbGYodGhpcy5fcm90YXRpb24pO1xyXG4gICAgICAgICAgICB0aGlzLl9mb3J3YXJkVSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fZm9yd2FyZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yaWdodCA9IFZlYzMuemVybygpO1xyXG4gICAgcHJpdmF0ZSBfcmlnaHRVID0gdHJ1ZTtcclxuICAgIGdldCByaWdodCgpIHtcclxuICAgICAgICBpZih0aGlzLl9yaWdodFUpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmlnaHQgPSBWZWMzLnhBeGlzKCkucm90WFlaU2VsZih0aGlzLl9yb3RhdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuX3JpZ2h0VSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fcmlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdXAgPSBWZWMzLnplcm8oKTtcclxuICAgIHByaXZhdGUgX3VwVSA9IHRydWU7XHJcbiAgICBnZXQgdXAoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fdXBVKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwID0gVmVjMy55QXhpcygpLnJvdFhZWlNlbGYodGhpcy5fcm90YXRpb24pO1xyXG4gICAgICAgICAgICB0aGlzLl91cFUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2ZvcndhcmRGbGF0ID0gVmVjMy56ZXJvKCk7XHJcbiAgICBwcml2YXRlIF9mb3J3YXJkRmxhdFUgPSB0cnVlO1xyXG4gICAgZ2V0IGZvcndhcmRGbGF0KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX2ZvcndhcmRGbGF0VSkge1xyXG4gICAgICAgICAgICB0aGlzLl9mb3J3YXJkRmxhdCA9IFZlYzMuekF4aXMoKS5uZWdTZWxmKCkucm90WVNlbGYodGhpcy5fcm90YXRpb24ueSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvcndhcmRGbGF0VSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fZm9yd2FyZEZsYXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcGVyc3BlY3RpdmVNYXRyaXg6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIF9wZXJzcGVjdGl2ZU1hdHJpeFUgPSB0cnVlO1xyXG4gICAgZ2V0IHBlcnNwZWN0aXZlTWF0cml4KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX3BlcnNwZWN0aXZlTWF0cml4VSkge1xyXG4gICAgICAgICAgICB0aGlzLl9wZXJzcGVjdGl2ZU1hdHJpeCA9IE1hdDQucGVyc3BlY3RpdmUodGhpcy5fZm92WSwgdGhpcy5fYXNwZWN0LCB0aGlzLl9uZWFyLCB0aGlzLl9mYXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9wZXJzcGVjdGl2ZU1hdHJpeFUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5wZXJzcGVjdGl2ZU1hdHJpeENoYW5nZUV2ZW50LmZpcmUodGhpcy5fcGVyc3BlY3RpdmVNYXRyaXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fcGVyc3BlY3RpdmVNYXRyaXg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdHJhbnNsYXRpb25NYXRyaXg6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIF90cmFuc2xhdGlvbk1hdHJpeFUgPSB0cnVlO1xyXG4gICAgZ2V0IHRyYW5zbGF0aW9uTWF0cml4KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX3RyYW5zbGF0aW9uTWF0cml4VSkge1xyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2xhdGlvbk1hdHJpeCA9IE1hdDQudHJhbnNsYXRlKC10aGlzLl9wb3NpdGlvbi54ICogdGhpcy5fd29ybGRTY2FsZSwgLXRoaXMuX3Bvc2l0aW9uLnkgKiB0aGlzLl93b3JsZFNjYWxlLCAtdGhpcy5fcG9zaXRpb24ueiAqIHRoaXMuX3dvcmxkU2NhbGUpO1xyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2xhdGlvbk1hdHJpeFUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2xhdGlvbk1hdHJpeENoYW5nZUV2ZW50LmZpcmUodGhpcy5fdmlld01hdHJpeCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGlvbk1hdHJpeDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yb3RhdGlvbk1hdHJpeDogbnVtYmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX3JvdGF0aW9uTWF0cml4VSA9IHRydWU7XHJcbiAgICBnZXQgcm90YXRpb25NYXRyaXgoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fcm90YXRpb25NYXRyaXhVKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JvdGF0aW9uTWF0cml4ID0gTWF0NC5tdWx0aXBseShcclxuICAgICAgICAgICAgICAgIE1hdDQucm90YXRlWigtdGhpcy5fcm90YXRpb24ueiksXHJcbiAgICAgICAgICAgICAgICBNYXQ0Lm11bHRpcGx5KFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdDQucm90YXRlWCgtdGhpcy5fcm90YXRpb24ueCksXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0NC5yb3RhdGVZKC10aGlzLl9yb3RhdGlvbi55KSxcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdGhpcy5fcm90YXRpb25NYXRyaXhVID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMucm90YXRpb25NYXRyaXhDaGFuZ2VFdmVudC5maXJlKHRoaXMuX3ZpZXdNYXRyaXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fcm90YXRpb25NYXRyaXg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdmlld01hdHJpeDogbnVtYmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX3ZpZXdNYXRyaXhVID0gdHJ1ZTtcclxuICAgIGdldCB2aWV3TWF0cml4KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX3ZpZXdNYXRyaXhVKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZpZXdNYXRyaXggPSBNYXQ0Lm11bHRpcGx5KHRoaXMucm90YXRpb25NYXRyaXgsIHRoaXMudHJhbnNsYXRpb25NYXRyaXgpO1xyXG4gICAgICAgICAgICB0aGlzLl92aWV3TWF0cml4VSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdNYXRyaXhDaGFuZ2VFdmVudC5maXJlKHRoaXMuX3ZpZXdNYXRyaXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fdmlld01hdHJpeDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGVyc3BlY3RpdmVNYXRyaXhDaGFuZ2VFdmVudCA9IG5ldyBTaWduYWwoeyBvbkNvbm5lY3Q6IGNvbm4gPT4gY29ubi5maXJlKHRoaXMucGVyc3BlY3RpdmVNYXRyaXgpIH0pO1xyXG4gICAgcHVibGljIHZpZXdNYXRyaXhDaGFuZ2VFdmVudCA9IG5ldyBTaWduYWwoeyBvbkNvbm5lY3Q6IGNvbm4gPT4gY29ubi5maXJlKHRoaXMudmlld01hdHJpeCkgfSk7XHJcbiAgICBwdWJsaWMgcm90YXRpb25NYXRyaXhDaGFuZ2VFdmVudCA9IG5ldyBTaWduYWwoeyBvbkNvbm5lY3Q6IGNvbm4gPT4gY29ubi5maXJlKHRoaXMucm90YXRpb25NYXRyaXgpIH0pO1xyXG4gICAgcHVibGljIHRyYW5zbGF0aW9uTWF0cml4Q2hhbmdlRXZlbnQgPSBuZXcgU2lnbmFsKHsgb25Db25uZWN0OiBjb25uID0+IGNvbm4uZmlyZSh0aGlzLnRyYW5zbGF0aW9uTWF0cml4KSB9KTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbj86IFZlYzMsIGZvdlk/OiBudW1iZXIsIGFzcGVjdD86IG51bWJlciwgbmVhcj86IG51bWJlciwgZmFyPzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYocG9zaXRpb24pIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICBpZihmb3ZZKSB0aGlzLmZvdlkgPSBmb3ZZO1xyXG4gICAgICAgIGlmKGFzcGVjdCkgdGhpcy5hc3BlY3QgPSBhc3BlY3Q7XHJcbiAgICAgICAgaWYobmVhcikgdGhpcy5uZWFyID0gbmVhcjtcclxuICAgICAgICBpZihmYXIpIHRoaXMuZmFyID0gZmFyO1xyXG4gICAgfVxyXG5cclxuICAgIGxvb2tBdChwOiBWZWMzKSB7XHJcbiAgICAgICAgbGV0IGYgPSB0aGlzLnBvc2l0aW9uLmxvb2socCk7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbiA9IG5ldyBWZWMzKGYucGl0Y2goKSwgZi55YXcoKSwgMCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgTUVTSCBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgY2xhc3MgTWVzaDNEIHtcclxuICAgIHBvc2l0aW9uczogbnVtYmVyW10gPSBbXTtcclxuICAgIHRleGNvb3JkczogbnVtYmVyW10gPSBbXTtcclxuICAgIG5vcm1hbHM6IG51bWJlcltdID0gW107XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcbiAgICBjbG9uZSgpOiBNZXNoM0Qge1xyXG4gICAgICAgIHJldHVybiBuZXcgTWVzaDNEKCkuYXBwZW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgdHJhbnNsYXRlKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTMpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaV0hICs9IHg7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMV0hICs9IHk7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMl0hICs9IHo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc2NhbGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mykge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpXSEgKj0geDtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsxXSEgKj0geTtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsyXSEgKj0gejtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByb3RhdGUoYXg6IG51bWJlciwgYXk6IG51bWJlciwgYXo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mykge1xyXG4gICAgICAgICAgICBsZXQgcCA9IG5ldyBWZWMzKHRoaXMucG9zaXRpb25zW2ldISwgdGhpcy5wb3NpdGlvbnNbaSsxXSEsIHRoaXMucG9zaXRpb25zW2krMl0hKTtcclxuICAgICAgICAgICAgcC5yb3RYWVpTZWxmQyhheCwgYXksIGF6KTtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaV0gPSBwLng7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMV0gPSBwLnk7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMl0gPSBwLno7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMubm9ybWFscy5sZW5ndGg7IGkrPTMpIHtcclxuICAgICAgICAgICAgbGV0IHAgPSBuZXcgVmVjMyh0aGlzLm5vcm1hbHNbaV0hLCB0aGlzLm5vcm1hbHNbaSsxXSEsIHRoaXMubm9ybWFsc1tpKzJdISk7XHJcbiAgICAgICAgICAgIHAucm90WFlaU2VsZkMoYXgsIGF5LCBheik7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFsc1tpXSA9IHAueDtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzW2krMV0gPSBwLnk7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFsc1tpKzJdID0gcC56O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdGF0ZUFyb3VuZCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBheDogbnVtYmVyLCBheTogbnVtYmVyLCBhejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5wb3NpdGlvbnMubGVuZ3RoOyBpKz0zKSB7XHJcbiAgICAgICAgICAgIGxldCBwID0gbmV3IFZlYzModGhpcy5wb3NpdGlvbnNbaV0hIC0geCwgdGhpcy5wb3NpdGlvbnNbaSsxXSEgLSB5LCB0aGlzLnBvc2l0aW9uc1tpKzJdISAtIHopO1xyXG4gICAgICAgICAgICBwLnJvdFhZWlNlbGZDKGF4LCBheSwgYXopO1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpXSA9IHAueCArIHg7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMV0gPSBwLnkgKyB5O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzJdID0gcC56ICsgejtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5ub3JtYWxzLmxlbmd0aDsgaSs9Mykge1xyXG4gICAgICAgICAgICBsZXQgcCA9IG5ldyBWZWMzKHRoaXMubm9ybWFsc1tpXSEsIHRoaXMubm9ybWFsc1tpKzFdISwgdGhpcy5ub3JtYWxzW2krMl0hKTtcclxuICAgICAgICAgICAgcC5yb3RYWVpTZWxmQyhheCwgYXksIGF6KTtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzW2ldID0gcC54O1xyXG4gICAgICAgICAgICB0aGlzLm5vcm1hbHNbaSsxXSA9IHAueTtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzW2krMl0gPSBwLno7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYXBwZW5kKC4uLm1lc2hlczogTWVzaDNEW10pOiB0aGlzIHtcclxuICAgICAgICBmb3IoY29uc3QgbWVzaCBvZiBtZXNoZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnMucHVzaCguLi5tZXNoLnBvc2l0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMudGV4Y29vcmRzLnB1c2goLi4ubWVzaC50ZXhjb29yZHMpO1xyXG4gICAgICAgICAgICB0aGlzLm5vcm1hbHMucHVzaCguLi5tZXNoLm5vcm1hbHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHB1c2hQb3NpdGlvbnMoYXJyOiBudW1iZXJbXSwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcikge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mykge1xyXG4gICAgICAgICAgICBhcnIucHVzaCh0aGlzLnBvc2l0aW9uc1tpXSEgKyB4KTtcclxuICAgICAgICAgICAgYXJyLnB1c2godGhpcy5wb3NpdGlvbnNbaSsxXSEgKyB5KTtcclxuICAgICAgICAgICAgYXJyLnB1c2godGhpcy5wb3NpdGlvbnNbaSsyXSEgKyB6KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH1cclxuICAgIHNldE5vcm1hbHMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMubm9ybWFscy5sZW5ndGg7IGkrPTMpIHtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzW2ldID0geDtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzW2krMV0gPSB5O1xyXG4gICAgICAgICAgICB0aGlzLm5vcm1hbHNbaSsyXSA9IHo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHRyaWFuZ2xlc1RvRWRnZXMocG9zaXRpb25zOiBudW1iZXJbXSk6IG51bWJlcltdIHtcclxuICAgICAgICBsZXQgZWRnZXM6IG51bWJlcltdID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8cG9zaXRpb25zLmxlbmd0aDsgaSs9OSkge1xyXG4gICAgICAgICAgICBlZGdlcy5wdXNoKHBvc2l0aW9uc1tpXSEsIHBvc2l0aW9uc1tpKzFdISwgcG9zaXRpb25zW2krMl0hLCBwb3NpdGlvbnNbaSszXSEsIHBvc2l0aW9uc1tpKzRdISwgcG9zaXRpb25zW2krNV0hKTtcclxuICAgICAgICAgICAgZWRnZXMucHVzaChwb3NpdGlvbnNbaSszXSEsIHBvc2l0aW9uc1tpKzRdISwgcG9zaXRpb25zW2krNV0hLCBwb3NpdGlvbnNbaSs2XSEsIHBvc2l0aW9uc1tpKzddISwgcG9zaXRpb25zW2krOF0hKTtcclxuICAgICAgICAgICAgZWRnZXMucHVzaChwb3NpdGlvbnNbaSs2XSEsIHBvc2l0aW9uc1tpKzddISwgcG9zaXRpb25zW2krOF0hLCBwb3NpdGlvbnNbaV0hLCBwb3NpdGlvbnNbaSsxXSEsIHBvc2l0aW9uc1tpKzJdISk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlZGdlcztcclxuICAgIH1cclxuICAgIHN0YXRpYyB0cmlhbmdsZVF1YWRzVG9FZGdlcyhwb3NpdGlvbnM6IG51bWJlcltdKTogbnVtYmVyW10ge1xyXG4gICAgICAgIGxldCBlZGdlczogbnVtYmVyW10gPSBbXTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxwb3NpdGlvbnMubGVuZ3RoOyBpKz0xOCkge1xyXG4gICAgICAgICAgICBlZGdlcy5wdXNoKHBvc2l0aW9uc1tpXSEsIHBvc2l0aW9uc1tpKzFdISwgcG9zaXRpb25zW2krMl0hLCBwb3NpdGlvbnNbaSszXSEsIHBvc2l0aW9uc1tpKzRdISwgcG9zaXRpb25zW2krNV0hKTtcclxuICAgICAgICAgICAgZWRnZXMucHVzaChwb3NpdGlvbnNbaSszXSEsIHBvc2l0aW9uc1tpKzRdISwgcG9zaXRpb25zW2krNV0hLCBwb3NpdGlvbnNbaSs2XSEsIHBvc2l0aW9uc1tpKzddISwgcG9zaXRpb25zW2krOF0hKTtcclxuICAgICAgICAgICAgZWRnZXMucHVzaChwb3NpdGlvbnNbaSs2XSEsIHBvc2l0aW9uc1tpKzddISwgcG9zaXRpb25zW2krOF0hLCBwb3NpdGlvbnNbaSs5XSEsIHBvc2l0aW9uc1tpKzEwXSEsIHBvc2l0aW9uc1tpKzExXSEpO1xyXG4gICAgICAgICAgICBlZGdlcy5wdXNoKHBvc2l0aW9uc1tpKzldISwgcG9zaXRpb25zW2krMTBdISwgcG9zaXRpb25zW2krMTFdISwgcG9zaXRpb25zW2krMTJdISwgcG9zaXRpb25zW2krMTNdISwgcG9zaXRpb25zW2krMTRdISk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlZGdlcztcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBQSFlTSUNTIENMQVNTRVMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQaHlzaWNzMkQge1xyXG4gICAgc3RhdGljIGdldFBvaW50UmVjdENvbGxpc2lvbihwb2ludDogVmVjMiwgY2VudGVyOiBWZWMyLCByaWdodE9mZnNldDogVmVjMiwgdXBPZmZzZXQ6IFZlYzIpIHtcclxuICAgICAgICBjb25zdCByaWdodCA9IHJpZ2h0T2Zmc2V0Lm5vcm0oKTtcclxuICAgICAgICBjb25zdCB1cCA9IHVwT2Zmc2V0Lm5vcm0oKTtcclxuICAgICAgICBjb25zdCBzaXplWCA9IHJpZ2h0T2Zmc2V0Lmxlbmd0aCgpO1xyXG4gICAgICAgIGNvbnN0IHNpemVZID0gdXBPZmZzZXQubGVuZ3RoKCk7XHJcbiAgICAgICAgbGV0IGRpZmYgPSBwb2ludC5zdWIoY2VudGVyKTtcclxuICAgICAgICBsZXQgZHggPSBkaWZmLmRvdChyaWdodCk7XHJcbiAgICAgICAgbGV0IGR5ID0gZGlmZi5kb3QodXApO1xyXG4gICAgICAgIGxldCBpc0luc2lkZSA9IChNYXRoLmFicyhkeCkgPCBzaXplWCAmJiBNYXRoLmFicyhkeSkgPCBzaXplWSk7XHJcbiAgICAgICAgaWYoaXNJbnNpZGUpIHtcclxuICAgICAgICAgICAgbGV0IGQxID0gTWF0aC5hYnMocG9pbnQuc3ViKGNlbnRlci5hZGRTY2FsZWQodXAsIHNpemVZKSkuZG90KHVwKSk7XHJcbiAgICAgICAgICAgIGxldCBkMiA9IE1hdGguYWJzKHBvaW50LnN1YihjZW50ZXIuYWRkU2NhbGVkKHVwLCAtc2l6ZVkpKS5kb3QodXApKTtcclxuICAgICAgICAgICAgbGV0IGQzID0gTWF0aC5hYnMocG9pbnQuc3ViKGNlbnRlci5hZGRTY2FsZWQocmlnaHQsIHNpemVYKSkuZG90KHJpZ2h0KSk7XHJcbiAgICAgICAgICAgIGxldCBkNCA9IE1hdGguYWJzKHBvaW50LnN1YihjZW50ZXIuYWRkU2NhbGVkKHJpZ2h0LCAtc2l6ZVgpKS5kb3QocmlnaHQpKTtcclxuICAgICAgICAgICAgbGV0IGNkID0gTWF0aC5taW4oZDEsIGQyLCBkMywgZDQpO1xyXG4gICAgICAgICAgICBsZXQgZWRnZTogVmVjMjtcclxuICAgICAgICAgICAgbGV0IG5vcm1hbDogVmVjMjtcclxuICAgICAgICAgICAgaWYoRU1hdGguaXNDbG9zZShjZCwgZDEpKSB7XHJcbiAgICAgICAgICAgICAgICBlZGdlID0gY2VudGVyLmFkZFNjYWxlZChyaWdodCwgZHgpLmFkZFNjYWxlZCh1cCwgc2l6ZVkpO1xyXG4gICAgICAgICAgICAgICAgbm9ybWFsID0gdXA7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihFTWF0aC5pc0Nsb3NlKGNkLCBkMikpIHtcclxuICAgICAgICAgICAgICAgIGVkZ2UgPSBjZW50ZXIuYWRkU2NhbGVkKHJpZ2h0LCBkeCkuYWRkU2NhbGVkKHVwLCAtc2l6ZVkpO1xyXG4gICAgICAgICAgICAgICAgbm9ybWFsID0gdXAubmVnKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihFTWF0aC5pc0Nsb3NlKGNkLCBkMykpIHtcclxuICAgICAgICAgICAgICAgIGVkZ2UgPSBjZW50ZXIuYWRkU2NhbGVkKHVwLCBkeSkuYWRkU2NhbGVkKHJpZ2h0LCBzaXplWCk7XHJcbiAgICAgICAgICAgICAgICBub3JtYWwgPSByaWdodDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVkZ2UgPSBjZW50ZXIuYWRkU2NhbGVkKHVwLCBkeSkuYWRkU2NhbGVkKHJpZ2h0LCAtc2l6ZVgpO1xyXG4gICAgICAgICAgICAgICAgbm9ybWFsID0gcmlnaHQubmVnKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGluc2lkZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbGxpc2lvbjogZWRnZSxcclxuICAgICAgICAgICAgICAgIGRpc3RhbmNlOiAtZWRnZS5kaXN0KHBvaW50KSxcclxuICAgICAgICAgICAgICAgIG5vcm1hbDogbm9ybWFsLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZHggPSBFTWF0aC5jbGFtcChkeCwgLXNpemVYLCBzaXplWCk7XHJcbiAgICAgICAgICAgIGR5ID0gRU1hdGguY2xhbXAoZHksIC1zaXplWSwgc2l6ZVkpO1xyXG4gICAgICAgICAgICBsZXQgZWRnZSA9IGNlbnRlci5hZGRTY2FsZWQocmlnaHQsIGR4KS5hZGRTY2FsZWQodXAsIGR5KTtcclxuICAgICAgICAgICAgbGV0IGRpc3QgPSBlZGdlLmRpc3QocG9pbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgaW5zaWRlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbGxpc2lvbjogZWRnZSxcclxuICAgICAgICAgICAgICAgIGRpc3RhbmNlOiBkaXN0LFxyXG4gICAgICAgICAgICAgICAgbm9ybWFsOiBlZGdlLmxvb2socG9pbnQpLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRJc1BvaW50SW5zaWRlUmVjdChwb2ludDogVmVjMiwgY2VudGVyOiBWZWMyLCByaWdodE9mZnNldDogVmVjMiwgdXBPZmZzZXQ6IFZlYzIpIHtcclxuICAgICAgICBsZXQgZGlmZiA9IHBvaW50LnN1YihjZW50ZXIpO1xyXG4gICAgICAgIGxldCBkeCA9IGRpZmYuZG90KHJpZ2h0T2Zmc2V0Lm5vcm0oKSk7XHJcbiAgICAgICAgbGV0IGR5ID0gZGlmZi5kb3QodXBPZmZzZXQubm9ybSgpKTtcclxuICAgICAgICByZXR1cm4gKE1hdGguYWJzKGR4KSA8IHJpZ2h0T2Zmc2V0Lmxlbmd0aCgpICYmIE1hdGguYWJzKGR5KSA8IHVwT2Zmc2V0Lmxlbmd0aCgpKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRDaXJjbGVSZWN0Q29sbGlzaW9uKHBvaW50OiBWZWMyLCByYWRpdXM6IG51bWJlciwgY2VudGVyOiBWZWMyLCByaWdodE9mZnNldDogVmVjMiwgdXBPZmZzZXQ6IFZlYzIpIHtcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy5nZXRQb2ludFJlY3RDb2xsaXNpb24ocG9pbnQsIGNlbnRlciwgcmlnaHRPZmZzZXQsIHVwT2Zmc2V0KTtcclxuICAgICAgICByZXMuZGlzdGFuY2UgLT0gcmFkaXVzO1xyXG4gICAgICAgIGlmKHJlcy5kaXN0YW5jZSA8PSAwKSByZXMuaW5zaWRlID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldENpcmNsZUNpcmNsZUNvbGxpc2lvbihwb2ludEE6IFZlYzIsIHJhZGl1c0E6IG51bWJlciwgcG9pbnRCOiBWZWMyLCByYWRpdXNCOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgZGlzdCA9IHBvaW50QS5kaXN0KHBvaW50QikgLSByYWRpdXNBIC0gcmFkaXVzQjtcclxuICAgICAgICBsZXQgY29sbGlzaW9uID0gcG9pbnRBLmFkZFNjYWxlZChwb2ludEEubG9vayhwb2ludEIpLCByYWRpdXNBKTtcclxuICAgICAgICBsZXQgbm9ybWFsID0gcG9pbnRCLmxvb2socG9pbnRBKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBpbnNpZGU6IGRpc3QgPD0gMCxcclxuICAgICAgICAgICAgY29sbGlzaW9uLFxyXG4gICAgICAgICAgICBkaXN0YW5jZTogZGlzdCxcclxuICAgICAgICAgICAgbm9ybWFsLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0Q2lyY2xlTGluZUNvbGxpc2lvbihwb2ludDogVmVjMiwgcmFkaXVzOiBudW1iZXIsIHN0YXJ0OiBWZWMyLCBlbmQ6IFZlYzIpIHtcclxuICAgICAgICBsZXQgZGlyID0gc3RhcnQubG9vayhlbmQpO1xyXG4gICAgICAgIGxldCBvZmYgPSBwb2ludC5zdWIoc3RhcnQpO1xyXG4gICAgICAgIGxldCB0ID0gb2ZmLmRvdChkaXIpO1xyXG4gICAgICAgIGxldCBtYXhUID0gZW5kLmRpc3Qoc3RhcnQpO1xyXG4gICAgICAgIHQgPSBFTWF0aC5jbGFtcCh0LCAwLCBtYXhUKTtcclxuICAgICAgICBsZXQgY29sbGlzaW9uID0gc3RhcnQuYWRkU2NhbGVkKGRpciwgdCk7XHJcbiAgICAgICAgbGV0IG5vcm1hbCA9IGNvbGxpc2lvbi5sb29rKHBvaW50KTtcclxuICAgICAgICBsZXQgZGlzdCA9IGNvbGxpc2lvbi5kaXN0KHBvaW50KSAtIHJhZGl1cztcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBpbnNpZGU6IGRpc3QgPD0gMCxcclxuICAgICAgICAgICAgY29sbGlzaW9uLFxyXG4gICAgICAgICAgICBkaXN0YW5jZTogZGlzdCxcclxuICAgICAgICAgICAgbm9ybWFsLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcmVzb2x2ZUNpcmNsZUNpcmNsZUNvbGxpc2lvbihhOiBhbnksIGI6IGFueSwgY29sOiBhbnkpIHtcclxuICAgICAgICBpZighY29sLmluc2lkZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGxldCB2bjEgPSBjb2wubm9ybWFsLmRvdChhLnZlbG9jaXR5KTtcclxuICAgICAgICBsZXQgdm4yID0gY29sLm5vcm1hbC5kb3QoYi52ZWxvY2l0eSk7XHJcbiAgICAgICAgYS52ZWxvY2l0eS5hZGRTY2FsZWRTZWxmKGNvbC5ub3JtYWwsIHZuMiAtIHZuMSk7XHJcbiAgICAgICAgYi52ZWxvY2l0eS5hZGRTY2FsZWRTZWxmKGNvbC5ub3JtYWwsIHZuMSAtIHZuMik7XHJcbiAgICAgICAgYS5wb3NpdGlvbi5hZGRTY2FsZWRTZWxmKGNvbC5ub3JtYWwsIC1jb2wuZGlzdGFuY2UvMik7XHJcbiAgICAgICAgYi5wb3NpdGlvbi5hZGRTY2FsZWRTZWxmKGNvbC5ub3JtYWwsIGNvbC5kaXN0YW5jZS8yKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyByZXNvbHZlQ2lyY2xlQW5jaG9yZWRSZWN0Q29sbGlzaW9uKGE6IGFueSwgYjogYW55LCBjb2w6IGFueSkge1xyXG4gICAgICAgIGlmKCFjb2wuaW5zaWRlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgYS5wb3NpdGlvbiA9IGNvbC5wb3NpdGlvbi5hZGRTY2FsZWQoY29sLm5vcm1hbCwgYS5yYWRpdXMgKyAxZS02KTtcclxuICAgICAgICBhLnZlbG9jaXR5LmFkZFNjYWxlZFNlbGYoY29sLm5vcm1hbCwgLWNvbC5ub3JtYWwuZG90KGEudmVsb2NpdHkpKjIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBoeXNpY3MzRCB7XHJcbiAgICBzdGF0aWMgcmF5Y2FzdFZveGVsczxUPihcclxuICAgICAgICBvcmlnaW46IFZlYzMsXHJcbiAgICAgICAgZGlyZWN0aW9uOiBWZWMzLFxyXG4gICAgICAgIHByZWRpY2F0ZTogKHBvczpWZWMzLCBub3JtYWw6VmVjMywgZGlzdDpudW1iZXIpID0+IFQgfCB1bmRlZmluZWQsXHJcbiAgICAgICAgbWF4SXRlcmF0aW9ucyA9IDEwMDBcclxuICAgICk6IFQgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGNvbnN0IGludkRpckFicyA9IGRpcmVjdGlvbi5yZGl2RigxKS5tYXAoeCA9PiBNYXRoLmFicyh4KSk7XHJcbiAgICAgICAgY29uc3Qgc2lnbiA9IGRpcmVjdGlvbi5tYXAoeCA9PiB4ID4gMCA/IDEgOiAwKTtcclxuICAgICAgICBjb25zdCBzdGVwID0gZGlyZWN0aW9uLm1hcCh4ID0+IHggPiAwID8gMSA6IC0xKTtcclxuICAgICAgICBsZXQgdE1heFggPSBpbnZEaXJBYnMueCAqIChzaWduLng9PT0wID8gKG9yaWdpbi54IC0gTWF0aC5mbG9vcihvcmlnaW4ueCkpIDogKE1hdGguZmxvb3Iob3JpZ2luLngpICsgMSAtIG9yaWdpbi54KSk7XHJcbiAgICAgICAgbGV0IHRNYXhZID0gaW52RGlyQWJzLnkgKiAoc2lnbi55PT09MCA/IChvcmlnaW4ueSAtIE1hdGguZmxvb3Iob3JpZ2luLnkpKSA6IChNYXRoLmZsb29yKG9yaWdpbi55KSArIDEgLSBvcmlnaW4ueSkpO1xyXG4gICAgICAgIGxldCB0TWF4WiA9IGludkRpckFicy56ICogKHNpZ24uej09PTAgPyAob3JpZ2luLnogLSBNYXRoLmZsb29yKG9yaWdpbi56KSkgOiAoTWF0aC5mbG9vcihvcmlnaW4ueikgKyAxIC0gb3JpZ2luLnopKTtcclxuICAgICAgICBsZXQgcG9zID0gbmV3IFZlYzMob3JpZ2luKS5tYXBTZWxmKHggPT4gTWF0aC5mbG9vcih4KSk7XHJcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gMDtcclxuICAgICAgICBsZXQgbm9ybWFsID0gVmVjMy56ZXJvKCk7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8bWF4SXRlcmF0aW9uczsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCByZXMgPSBwcmVkaWNhdGUocG9zLCBub3JtYWwsIGRpc3RhbmNlKTtcclxuICAgICAgICAgICAgaWYocmVzICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgICAgICBpZih0TWF4WCA8IHRNYXhZKSB7XHJcbiAgICAgICAgICAgICAgICBpZih0TWF4WCA8IHRNYXhaKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2UgPSB0TWF4WDtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWwuc2V0Qygtc3RlcC54LCAwLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICB0TWF4WCArPSBpbnZEaXJBYnMueDtcclxuICAgICAgICAgICAgICAgICAgICBwb3MueCArPSBzdGVwLng7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gdE1heFo7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsLnNldEMoMCwgMCwgLXN0ZXAueik7XHJcbiAgICAgICAgICAgICAgICAgICAgdE1heFogKz0gaW52RGlyQWJzLno7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zLnogKz0gc3RlcC56O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYodE1heFkgPCB0TWF4Wikge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gdE1heFk7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsLnNldEMoMCwgLXN0ZXAueSwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdE1heFkgKz0gaW52RGlyQWJzLnk7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zLnkgKz0gc3RlcC55O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IHRNYXhaO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbC5zZXRDKDAsIDAsIC1zdGVwLnopO1xyXG4gICAgICAgICAgICAgICAgICAgIHRNYXhaICs9IGludkRpckFicy56O1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcy56ICs9IHN0ZXAuejtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJheWNhc3RCb3goXHJcbiAgICAgICAgb3JpZ2luOiBWZWMzLFxyXG4gICAgICAgIGRpcmVjdGlvbjogVmVjMyxcclxuICAgICAgICBib3VuZHM6IFZlYzNbXVxyXG4gICAgKSB7XHJcbiAgICAgICAgY29uc3QgaW52RGlyID0gZGlyZWN0aW9uLnJkaXZGKDEpO1xyXG4gICAgICAgIGNvbnN0IHNpZ24gPSBkaXJlY3Rpb24ubWFwKHggPT4geCA+IDAgPyAxIDogMCk7XHJcbiAgICAgICAgY29uc3Qgc2lnbkZsaXAgPSBkaXJlY3Rpb24ubWFwKHggPT4geCA+IDAgPyAwIDogMSk7XHJcbiAgICAgICAgY29uc3Qgc3RlcEZsaXAgPSBkaXJlY3Rpb24ubWFwKHggPT4geCA+IDAgPyAtMSA6IDEpO1xyXG4gICAgICAgIGxldCB0bWluID0gKGJvdW5kc1tzaWduRmxpcC54XSEueCAtIG9yaWdpbi54KSAqIGludkRpci54O1xyXG4gICAgICAgIGxldCB0bWF4ID0gKGJvdW5kc1tzaWduLnhdIS54IC0gb3JpZ2luLngpICogaW52RGlyLng7XHJcbiAgICAgICAgbGV0IG5vcm1hbCA9IG5ldyBWZWMzKHN0ZXBGbGlwLngsMCwwKTtcclxuICAgICAgICBsZXQgdHltaW4gPSAoYm91bmRzW3NpZ25GbGlwLnldIS55IC0gb3JpZ2luLnkpICogaW52RGlyLnk7XHJcbiAgICAgICAgbGV0IHR5bWF4ID0gKGJvdW5kc1tzaWduLnldIS55IC0gb3JpZ2luLnkpICogaW52RGlyLnk7XHJcbiAgICAgICAgaWYoKHRtaW4gPiB0eW1heCkgfHwgKHR5bWluID4gdG1heCkpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmKHR5bWluID4gdG1pbikge1xyXG4gICAgICAgICAgICB0bWluID0gdHltaW47XHJcbiAgICAgICAgICAgIG5vcm1hbCA9IG5ldyBWZWMzKDAsc3RlcEZsaXAueSwwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHltYXggPCB0bWF4KSB0bWF4ID0gdHltYXg7XHJcbiAgICAgICAgbGV0IHR6bWluID0gKGJvdW5kc1tzaWduRmxpcC56XSEueiAtIG9yaWdpbi56KSAqIGludkRpci56O1xyXG4gICAgICAgIGxldCB0em1heCA9IChib3VuZHNbc2lnbi56XSEueiAtIG9yaWdpbi56KSAqIGludkRpci56O1xyXG4gICAgICAgIGlmKCh0bWluID4gdHptYXgpIHx8ICh0em1pbiA+IHRtYXgpKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBpZih0em1pbiA+IHRtaW4pIHtcclxuICAgICAgICAgICAgdG1pbiA9IHR6bWluO1xyXG4gICAgICAgICAgICBub3JtYWwgPSBuZXcgVmVjMygwLDAsc3RlcEZsaXAueik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHR6bWF4IDwgdG1heCkgdG1heCA9IHR6bWF4O1xyXG4gICAgICAgIGNvbnN0IGRpc3RhbmNlID0gdG1pbiA8IDAgPyAwIDogdG1pbjtcclxuICAgICAgICByZXR1cm4geyBub3JtYWwsIGRpc3RhbmNlLCBpbnRlcnNlY3Rpb246IG9yaWdpbi5hZGRTY2FsZWQoZGlyZWN0aW9uLCBkaXN0YW5jZSkgfTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgRVZFTlQgQ0xBU1NFUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBTaWduYWw8VCBleHRlbmRzIGFueVtdPiB7XHJcbiAgICBjb25uZWN0aW9uczogQ29ubmVjdGlvbjxUPltdID0gW107XHJcbiAgICB0aW1lRmlyZWQ6IG51bWJlciA9IC1OdW1iZXIuTUFYX1ZBTFVFO1xyXG4gICAgb25Db25uZWN0PzogKGNvbm46IENvbm5lY3Rpb248VD4pID0+IHZvaWQ7XHJcbiAgICBjb25zdHJ1Y3Rvcih7XHJcbiAgICAgICAgb25Db25uZWN0ID0gdW5kZWZpbmVkLFxyXG4gICAgfToge1xyXG4gICAgICAgIG9uQ29ubmVjdD86IChjb25uOiBDb25uZWN0aW9uPFQ+KSA9PiB2b2lkLFxyXG4gICAgfSA9IHt9KSB7XHJcbiAgICAgICAgdGhpcy5vbkNvbm5lY3QgPSBvbkNvbm5lY3Q7XHJcbiAgICB9XHJcbiAgICBjb25uZWN0KGNhbGxiYWNrOiAoLi4uYXJnczogVCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGNvbnN0IGNvbm4gPSBuZXcgQ29ubmVjdGlvbjxUPih0aGlzLCBjYWxsYmFjayk7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5wdXNoKGNvbm4pO1xyXG4gICAgICAgIGlmKHRoaXMub25Db25uZWN0KSB7XHJcbiAgICAgICAgICAgIHRoaXMub25Db25uZWN0KGNvbm4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29ubjtcclxuICAgIH1cclxuICAgIG9uY2UoY2FsbGJhY2s6ICguLi5hcmdzOiBUKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgY29uc3QgY29ubiA9IHRoaXMuY29ubmVjdCgoLi4uYXJnczogVCkgPT4ge1xyXG4gICAgICAgICAgICBjYWxsYmFjayguLi5hcmdzKTtcclxuICAgICAgICAgICAgY29ubi5kaXNjb25uZWN0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGNvbm47XHJcbiAgICB9XHJcbiAgICBhc3luYyB3YWl0KCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxUPihyZXMgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm9uY2UoKC4uLmFyZ3M6IFQpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlcyhhcmdzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBmaXJlKC4uLmFyZ3M6IFQpIHtcclxuICAgICAgICB0aGlzLnRpbWVGaXJlZCA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIGZvcihjb25zdCBjb25uIG9mIFsuLi50aGlzLmNvbm5lY3Rpb25zXSkge1xyXG4gICAgICAgICAgICBjb25uLmZpcmUoLi4uYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0VGltZVNpbmNlRmlyZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHBlcmZvcm1hbmNlLm5vdygpIC8gMTAwMCAtIHRoaXMudGltZUZpcmVkO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvbjxUIGV4dGVuZHMgYW55W10+IHtcclxuICAgIGdyb3VwczogQ29ubmVjdGlvbkdyb3VwW10gPSBbXTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzaWduYWw6IFNpZ25hbDxUPiwgcHVibGljIGNhbGxiYWNrOiAoLi4uYXJnczogVCkgPT4gdm9pZCkge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgZGlzY29ubmVjdCgpIHtcclxuICAgICAgICB0aGlzLnNpZ25hbC5jb25uZWN0aW9ucy5zcGxpY2UodGhpcy5zaWduYWwuY29ubmVjdGlvbnMuaW5kZXhPZih0aGlzKSwgMSk7XHJcbiAgICAgICAgZm9yKGNvbnN0IGdyb3VwIG9mIHRoaXMuZ3JvdXBzKSB7XHJcbiAgICAgICAgICAgIGdyb3VwLmNvbm5lY3Rpb25zLnNwbGljZShncm91cC5jb25uZWN0aW9ucy5pbmRleE9mKHRoaXMpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ncm91cHMgPSBbXTtcclxuICAgIH1cclxuICAgIGZpcmUoLi4uYXJnczogVCkge1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2soLi4uYXJncyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBIdG1sQ29ubmVjdGlvbiB7XHJcbiAgICBncm91cHM6IENvbm5lY3Rpb25Hcm91cFtdID0gW107XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEV2ZW50VGFyZ2V0LCBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgY2FsbGJhY2s6IChlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5uYW1lLCB0aGlzLmNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIGRpc2Nvbm5lY3QoKSB7XHJcbiAgICAgICAgdGhpcy5lbC5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMubmFtZSwgdGhpcy5jYWxsYmFjayk7XHJcbiAgICAgICAgZm9yKGNvbnN0IGdyb3VwIG9mIHRoaXMuZ3JvdXBzKSB7XHJcbiAgICAgICAgICAgIGdyb3VwLmNvbm5lY3Rpb25zLnNwbGljZShncm91cC5jb25uZWN0aW9ucy5pbmRleE9mKHRoaXMpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ncm91cHMgPSBbXTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvbm5lY3Rpb25Hcm91cCB7XHJcbiAgICBjb25uZWN0aW9uczogKENvbm5lY3Rpb248YW55PiB8IEh0bWxDb25uZWN0aW9uKVtdID0gW107XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcbiAgICBhZGQoY29ubjogQ29ubmVjdGlvbjxhbnk+IHwgSHRtbENvbm5lY3Rpb24pIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLnB1c2goY29ubik7XHJcbiAgICB9XHJcbiAgICBkaXNjb25uZWN0QWxsKCkge1xyXG4gICAgICAgIGZvcihjb25zdCBjb25uIG9mIFsuLi50aGlzLmNvbm5lY3Rpb25zXSkge1xyXG4gICAgICAgICAgICBjb25uLmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucyA9IFtdO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIFdFQkdMMiBTSEFERVIgQ0xBU1NFUyAgLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGNsYXNzIFdHTDJDb21wb25lbnRTaGFkZXIge1xyXG4gICAgd1NoYWRlcjogV2ViR0xTaGFkZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsIHB1YmxpYyB0eXBlOiBcInZlcnRleFwiIHwgXCJmcmFnbWVudFwiLCBwdWJsaWMgc291cmNlOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCB3U2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKHR5cGUgPT0gXCJ2ZXJ0ZXhcIiA/IGdsLlZFUlRFWF9TSEFERVIgOiBnbC5GUkFHTUVOVF9TSEFERVIpO1xyXG4gICAgICAgIGlmKHdTaGFkZXIgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gY3JlYXRlIHNoYWRlclwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy53U2hhZGVyID0gd1NoYWRlcjtcclxuICAgICAgICBnbC5zaGFkZXJTb3VyY2Uod1NoYWRlciwgc291cmNlKTtcclxuICAgICAgICBnbC5jb21waWxlU2hhZGVyKHdTaGFkZXIpXHJcbiAgICAgICAgaWYoIWdsLmdldFNoYWRlclBhcmFtZXRlcih3U2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUykpIHtcclxuICAgICAgICAgICAgY29uc3QgbG9nID0gZ2wuZ2V0U2hhZGVySW5mb0xvZyh3U2hhZGVyKTtcclxuICAgICAgICAgICAgZ2wuZGVsZXRlU2hhZGVyKHdTaGFkZXIpO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gY29tcGlsZSBzaGFkZXI6IFwiICsgbG9nKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBkZWxldGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nbC5kZWxldGVTaGFkZXIodGhpcy53U2hhZGVyKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJDb21wb25lbnRQcm9ncmFtIHtcclxuICAgIHdQcm9ncmFtOiBXZWJHTFByb2dyYW07XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsIHB1YmxpYyBjU2hhZGVyVjogV0dMMkNvbXBvbmVudFNoYWRlciwgcHVibGljIGNTaGFkZXJGOiBXR0wyQ29tcG9uZW50U2hhZGVyKSB7XHJcbiAgICAgICAgY29uc3Qgd1Byb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XHJcbiAgICAgICAgaWYgKCF3UHJvZ3JhbSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gY3JlYXRlIHByb2dyYW1cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMud1Byb2dyYW0gPSB3UHJvZ3JhbTtcclxuICAgICAgICBnbC5hdHRhY2hTaGFkZXIod1Byb2dyYW0sIGNTaGFkZXJWLndTaGFkZXIpO1xyXG4gICAgICAgIGdsLmF0dGFjaFNoYWRlcih3UHJvZ3JhbSwgY1NoYWRlckYud1NoYWRlcik7XHJcbiAgICAgICAgZ2wubGlua1Byb2dyYW0od1Byb2dyYW0pO1xyXG4gICAgICAgIGlmKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHdQcm9ncmFtLCBnbC5MSU5LX1NUQVRVUykpIHtcclxuICAgICAgICAgICAgY29uc3QgbG9nID0gZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cod1Byb2dyYW0pO1xyXG4gICAgICAgICAgICBnbC5kZWxldGVQcm9ncmFtKHdQcm9ncmFtKTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGxpbmsgcHJvZ3JhbTogXCIgKyBsb2cpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNldEFjdGl2ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdsLnVzZVByb2dyYW0odGhpcy53UHJvZ3JhbSk7XHJcbiAgICB9XHJcbiAgICBkZWxldGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nbC5kZWxldGVQcm9ncmFtKHRoaXMud1Byb2dyYW0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBXR0wyQXR0cmlidXRlVHlwZSA9IChcclxuICAgIFwiZmxvYXRcIiB8IFwiaW50XCIgfCBcInVpbnRcIiB8IFwidmVjMlwiIHwgXCJ2ZWMzXCIgfCBcInZlYzRcIlxyXG4gICAgfCBcIml2ZWMyXCIgfCBcIml2ZWMzXCIgfCBcIml2ZWM0XCIgfCBcInV2ZWMyXCIgfCBcInV2ZWMzXCIgfCBcInV2ZWM0XCJcclxuKTtcclxuXHJcbmV4cG9ydCB0eXBlIFdHTDJVbmlmb3JtVHlwZSA9IChcclxuICAgIFwiZmxvYXRcIiB8IFwiaW50XCIgfCBcInVpbnRcIiB8IFwidmVjMlwiIHwgXCJ2ZWMzXCJcclxuICAgIHwgXCJ2ZWM0XCIgfCBcIml2ZWMyXCIgfCBcIml2ZWMzXCIgfCBcIml2ZWM0XCIgfCBcInV2ZWMyXCJcclxuICAgIHwgXCJ1dmVjM1wiIHwgXCJ1dmVjNFwiIHwgXCJtYXQyXCIgfCBcIm1hdDNcIiB8IFwibWF0NFwiXHJcbik7XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMkNvbXBvbmVudEJ1ZmZlciB7XHJcbiAgICB3VHlwZTogR0xlbnVtO1xyXG4gICAgd0RpbWVuc2lvbnM6IG51bWJlcjtcclxuICAgIHdCdWZmZXI6IFdlYkdMQnVmZmVyO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LCB0eXBlOiBXR0wyQXR0cmlidXRlVHlwZSkge1xyXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgICAgIGlmKCFidWZmZXIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGNyZWF0ZSBidWZmZXJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMud0J1ZmZlciA9IGJ1ZmZlcjtcclxuICAgICAgICBzd2l0Y2godHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiZmxvYXRcIjogdGhpcy53VHlwZSA9IGdsLkZMT0FUOyB0aGlzLndEaW1lbnNpb25zID0gMTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ2ZWMyXCI6IHRoaXMud1R5cGUgPSBnbC5GTE9BVDsgdGhpcy53RGltZW5zaW9ucyA9IDI7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidmVjM1wiOiB0aGlzLndUeXBlID0gZ2wuRkxPQVQ7IHRoaXMud0RpbWVuc2lvbnMgPSAzOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInZlYzRcIjogdGhpcy53VHlwZSA9IGdsLkZMT0FUOyB0aGlzLndEaW1lbnNpb25zID0gNDsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpbnRcIjogdGhpcy53VHlwZSA9IGdsLklOVDsgdGhpcy53RGltZW5zaW9ucyA9IDE7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaXZlYzJcIjogdGhpcy53VHlwZSA9IGdsLklOVDsgdGhpcy53RGltZW5zaW9ucyA9IDI7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaXZlYzNcIjogdGhpcy53VHlwZSA9IGdsLklOVDsgdGhpcy53RGltZW5zaW9ucyA9IDM7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaXZlYzRcIjogdGhpcy53VHlwZSA9IGdsLklOVDsgdGhpcy53RGltZW5zaW9ucyA9IDQ7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidWludFwiOiB0aGlzLndUeXBlID0gZ2wuVU5TSUdORURfSU5UOyB0aGlzLndEaW1lbnNpb25zID0gMTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1dmVjMlwiOiB0aGlzLndUeXBlID0gZ2wuVU5TSUdORURfSU5UOyB0aGlzLndEaW1lbnNpb25zID0gMjsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1dmVjM1wiOiB0aGlzLndUeXBlID0gZ2wuVU5TSUdORURfSU5UOyB0aGlzLndEaW1lbnNpb25zID0gMzsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1dmVjNFwiOiB0aGlzLndUeXBlID0gZ2wuVU5TSUdORURfSU5UOyB0aGlzLndEaW1lbnNpb25zID0gNDsgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIGJ1ZmZlciB0eXBlOiBcIiArIHR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNldEFjdGl2ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHRoaXMud0J1ZmZlcik7XHJcbiAgICB9XHJcbiAgICBkZWxldGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nbC5kZWxldGVCdWZmZXIodGhpcy53QnVmZmVyKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJDb21wb25lbnRWYW8ge1xyXG4gICAgd1ZhbzogV2ViR0xWZXJ0ZXhBcnJheU9iamVjdDtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkge1xyXG4gICAgICAgIHRoaXMud1ZhbyA9IGdsLmNyZWF0ZVZlcnRleEFycmF5KCk7XHJcbiAgICB9XHJcbiAgICBzZXRBY3RpdmUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kVmVydGV4QXJyYXkodGhpcy53VmFvKTtcclxuICAgIH1cclxuICAgIGVuYWJsZUJ1ZmZlcihjQnVmZmVyOiBXR0wyQ29tcG9uZW50QnVmZmVyLCB3TG9jYXRpb246IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGNCdWZmZXIuc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh3TG9jYXRpb24pO1xyXG4gICAgICAgIGlmKGNCdWZmZXIud1R5cGUgPT0gdGhpcy5nbC5GTE9BVCkge1xyXG4gICAgICAgICAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIod0xvY2F0aW9uLCBjQnVmZmVyLndEaW1lbnNpb25zLCBjQnVmZmVyLndUeXBlLCBmYWxzZSwgMCwgMCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJJUG9pbnRlcih3TG9jYXRpb24sIGNCdWZmZXIud0RpbWVuc2lvbnMsIGNCdWZmZXIud1R5cGUsIDAsIDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGRlbGV0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdsLmRlbGV0ZVZlcnRleEFycmF5KHRoaXMud1Zhbyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXR0wyQ29tcG9uZW50VW5pZm9ybSB7XHJcbiAgICB3TG9jYXRpb246IFdlYkdMVW5pZm9ybUxvY2F0aW9uO1xyXG4gICAgcXVldWVkVmFsdWVzOiBhbnlbXSB8IGFueSB8IG51bGwgPSBudWxsO1xyXG4gICAgaGFzUXVldWVkID0gZmFsc2U7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsIGNQcm9ncmFtOiBXR0wyQ29tcG9uZW50UHJvZ3JhbSwgbmFtZTogc3RyaW5nLCBwdWJsaWMgdHlwZTogV0dMMlVuaWZvcm1UeXBlKSB7XHJcbiAgICAgICAgY29uc3Qgd0xvY2F0aW9uID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24oY1Byb2dyYW0ud1Byb2dyYW0sIG5hbWUpO1xyXG4gICAgICAgIGlmKHdMb2NhdGlvbiA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gZ2V0IHVuaWZvcm0gbG9jYXRpb24gZm9yIFwiICsgbmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMud0xvY2F0aW9uID0gd0xvY2F0aW9uO1xyXG4gICAgfVxyXG4gICAgc2V0VmFsdWVzKHZhbHVlcyA6IGFueVtdIHwgYW55KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3Qgd0xvY2F0aW9uID0gdGhpcy53TG9jYXRpb25cclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgc3dpdGNoKHRoaXMudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiZmxvYXRcIjogZ2wudW5pZm9ybTFmKHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ2ZWMyXCI6IGdsLnVuaWZvcm0yZnYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInZlYzNcIjogZ2wudW5pZm9ybTNmdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidmVjNFwiOiBnbC51bmlmb3JtNGZ2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpbnRcIjogZ2wudW5pZm9ybTFpKHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpdmVjMlwiOiBnbC51bmlmb3JtMml2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpdmVjM1wiOiBnbC51bmlmb3JtM2l2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpdmVjNFwiOiBnbC51bmlmb3JtNGl2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1aW50XCI6IGdsLnVuaWZvcm0xdWkod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInV2ZWMyXCI6IGdsLnVuaWZvcm0ydWl2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1dmVjM1wiOiBnbC51bmlmb3JtM3Vpdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXZlYzRcIjogZ2wudW5pZm9ybTR1aXYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIm1hdDJcIjogZ2wudW5pZm9ybU1hdHJpeDJmdih3TG9jYXRpb24sIGZhbHNlLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIm1hdDNcIjogZ2wudW5pZm9ybU1hdHJpeDNmdih3TG9jYXRpb24sIGZhbHNlLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIm1hdDRcIjogZ2wudW5pZm9ybU1hdHJpeDRmdih3TG9jYXRpb24sIGZhbHNlLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKFwiVW5zdXBwb3J0ZWQgdW5pZm9ybSB0eXBlOiBcIiArIHRoaXMudHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcXVldWVWYWx1ZXModmFsdWVzOiBhbnlbXSB8IGFueSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaGFzUXVldWVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnF1ZXVlZFZhbHVlcyA9IHZhbHVlcztcclxuICAgIH1cclxuICAgIHVwZGF0ZSgpIHtcclxuICAgICAgICBpZighdGhpcy5oYXNRdWV1ZWQpIHJldHVybjtcclxuICAgICAgICB0aGlzLmhhc1F1ZXVlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc2V0VmFsdWVzKHRoaXMucXVldWVkVmFsdWVzKTtcclxuICAgICAgICB0aGlzLnF1ZXVlZFZhbHVlcyA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXR0wyQXR0cmlidXRlIHtcclxuICAgIHdMb2NhdGlvbjogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LCBwdWJsaWMgd1Byb2dyYW06IFdlYkdMUHJvZ3JhbSwgcHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIHR5cGU6IFdHTDJBdHRyaWJ1dGVUeXBlKSB7XHJcbiAgICAgICAgdGhpcy53TG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbih3UHJvZ3JhbSwgbmFtZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXR0wyVGV4dHVyZTJEIHtcclxuICAgIHdUZXh0dXJlOiBXZWJHTFRleHR1cmU7XHJcbiAgICB1bmlmb3JtOiBXR0wyQ29tcG9uZW50VW5pZm9ybTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzaGFkZXI6IFdHTDJTaGFkZXIsIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBzbG90OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLndUZXh0dXJlID0gc2hhZGVyLmdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICB0aGlzLnNldEFjdGl2ZSgpO1xyXG4gICAgICAgIHRoaXMudW5pZm9ybSA9IHNoYWRlci5jcmVhdGVVbmlmb3JtKG5hbWUsIFwiaW50XCIpO1xyXG4gICAgICAgIHRoaXMudW5pZm9ybS5zZXRWYWx1ZXModGhpcy5zbG90KTtcclxuICAgIH1cclxuICAgIHNldEFjdGl2ZSgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTAgKyB0aGlzLnNsb3QpO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRoaXMud1RleHR1cmUpO1xyXG4gICAgfVxyXG4gICAgc2V0SW50ZXJwb2xhdGlvbihpc0VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgaXNFbmFibGVkID8gZ2wuTElORUFSIDogZ2wuTkVBUkVTVCk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGlzRW5hYmxlZCA/IGdsLkxJTkVBUiA6IGdsLk5FQVJFU1QpO1xyXG4gICAgfVxyXG4gICAgc2V0UmVwZWF0KGlzRW5hYmxlZDogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGlzRW5hYmxlZCA/IGdsLlJFUEVBVCA6IGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGlzRW5hYmxlZCA/IGdsLlJFUEVBVCA6IGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgfVxyXG4gICAgc2V0RGF0YSh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgZGF0YTogQXJyYXlCdWZmZXJWaWV3IHwgbnVsbCA9IG51bGwpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgd2lkdGgsIGhlaWdodCwgMCwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgZGF0YSk7XHJcbiAgICB9XHJcbiAgICBzZXRJbWFnZShpbWFnZTogVGV4SW1hZ2VTb3VyY2UpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgaW1hZ2UpO1xyXG4gICAgfVxyXG4gICAgZ2VuZXJhdGVNaXBtYXAoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLnNoYWRlci5nbDtcclxuICAgICAgICBnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzJEKTtcclxuICAgIH1cclxuICAgIGRlbGV0ZSgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLmRlbGV0ZVRleHR1cmUodGhpcy53VGV4dHVyZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXR0wyT2JqZWN0IHtcclxuICAgIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0O1xyXG4gICAgY1ZhbzogV0dMMkNvbXBvbmVudFZhbztcclxuICAgIGNCdWZmZXJCeU5hbWU6IHtba2V5OnN0cmluZ106IFdHTDJDb21wb25lbnRCdWZmZXJ9ID0ge307XHJcbiAgICB2ZXJ0ZXhDb3VudDogbnVtYmVyID0gMDtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzaGFkZXI6IFdHTDJTaGFkZXIpIHtcclxuICAgICAgICB0aGlzLmdsID0gc2hhZGVyLmdsO1xyXG4gICAgICAgIHRoaXMuY1ZhbyA9IG5ldyBXR0wyQ29tcG9uZW50VmFvKHNoYWRlci5nbCk7XHJcbiAgICAgICAgdGhpcy5jVmFvLnNldEFjdGl2ZSgpO1xyXG4gICAgICAgIGZvcihjb25zdCBhdHRyaWJ1dGUgb2Ygc2hhZGVyLmF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgY0J1ZiA9IG5ldyBXR0wyQ29tcG9uZW50QnVmZmVyKHNoYWRlci5nbCwgYXR0cmlidXRlLnR5cGUpO1xyXG4gICAgICAgICAgICBjQnVmLnNldEFjdGl2ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmNWYW8uZW5hYmxlQnVmZmVyKGNCdWYsIGF0dHJpYnV0ZS53TG9jYXRpb24pO1xyXG4gICAgICAgICAgICB0aGlzLmNCdWZmZXJCeU5hbWVbYXR0cmlidXRlLm5hbWVdID0gY0J1ZjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzZXREYXRhKGF0dHJpYnV0ZU5hbWU6IHN0cmluZywgdmFsdWVzOiBGbG9hdDMyQXJyYXksIHVzYWdlOiBHTGVudW0gPSB0aGlzLmdsLlNUQVRJQ19EUkFXKSB7XHJcbiAgICAgICAgY29uc3QgY0J1ZiA9IHRoaXMuY0J1ZmZlckJ5TmFtZVthdHRyaWJ1dGVOYW1lXTtcclxuICAgICAgICBpZihjQnVmID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGQgbm90IGZpbmQgYXR0cmlidXRlIHdpdGggbmFtZTogXCIgKyBhdHRyaWJ1dGVOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY0J1Zi5zZXRBY3RpdmUoKTtcclxuICAgICAgICB0aGlzLmdsLmJ1ZmZlckRhdGEodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHZhbHVlcywgdXNhZ2UpO1xyXG4gICAgICAgIHRoaXMudmVydGV4Q291bnQgPSB2YWx1ZXMubGVuZ3RoIC8gY0J1Zi53RGltZW5zaW9ucztcclxuICAgIH1cclxuICAgIGRyYXdUcmlhbmdsZXMoKSB7XHJcbiAgICAgICAgdGhpcy5jVmFvLnNldEFjdGl2ZSgpO1xyXG4gICAgICAgIHRoaXMuZ2wuZHJhd0FycmF5cyh0aGlzLmdsLlRSSUFOR0xFUywgMCwgdGhpcy52ZXJ0ZXhDb3VudCk7XHJcbiAgICB9XHJcbiAgICBkcmF3TGluZXMoKSB7XHJcbiAgICAgICAgdGhpcy5jVmFvLnNldEFjdGl2ZSgpO1xyXG4gICAgICAgIHRoaXMuZ2wuZHJhd0FycmF5cyh0aGlzLmdsLkxJTkVTLCAwLCB0aGlzLnZlcnRleENvdW50KTtcclxuICAgIH1cclxuICAgIGRyYXdQb2ludHMoKSB7XHJcbiAgICAgICAgdGhpcy5jVmFvLnNldEFjdGl2ZSgpO1xyXG4gICAgICAgIHRoaXMuZ2wuZHJhd0FycmF5cyh0aGlzLmdsLlBPSU5UUywgMCwgdGhpcy52ZXJ0ZXhDb3VudCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXR0wyU2hhZGVyIHtcclxuICAgIGNQcm9ncmFtOiBXR0wyQ29tcG9uZW50UHJvZ3JhbTtcclxuICAgIGF0dHJpYnV0ZXM6IFdHTDJBdHRyaWJ1dGVbXSA9IFtdO1xyXG4gICAgY1VuaWZvcm1zOiBXR0wyQ29tcG9uZW50VW5pZm9ybVtdID0gW11cclxuICAgIGNVbmlmb3JtQnlOYW1lOiB7W2tleTpzdHJpbmddOldHTDJDb21wb25lbnRVbmlmb3JtfSA9IHt9O1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LCB2U291cmNlOiBzdHJpbmcsIGZTb3VyY2U6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuY1Byb2dyYW0gPSBuZXcgV0dMMkNvbXBvbmVudFByb2dyYW0oXHJcbiAgICAgICAgICAgIGdsLCBuZXcgV0dMMkNvbXBvbmVudFNoYWRlcihnbCwgXCJ2ZXJ0ZXhcIiwgdlNvdXJjZSksXHJcbiAgICAgICAgICAgIG5ldyBXR0wyQ29tcG9uZW50U2hhZGVyKGdsLCBcImZyYWdtZW50XCIsIGZTb3VyY2UpLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5jUHJvZ3JhbS5zZXRBY3RpdmUoKTtcclxuICAgIH1cclxuICAgIGFkZEF0dHJpYnV0ZShuYW1lOiBzdHJpbmcsIHR5cGU6IFdHTDJBdHRyaWJ1dGVUeXBlKSB7XHJcbiAgICAgICAgY29uc3QgYXR0ID0gbmV3IFdHTDJBdHRyaWJ1dGUodGhpcy5nbCwgdGhpcy5jUHJvZ3JhbS53UHJvZ3JhbSwgbmFtZSwgdHlwZSk7XHJcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLnB1c2goYXR0KTtcclxuICAgICAgICByZXR1cm4gYXR0O1xyXG4gICAgfVxyXG4gICAgY3JlYXRlVW5pZm9ybShuYW1lOiBzdHJpbmcsIHR5cGU6IFdHTDJVbmlmb3JtVHlwZSkge1xyXG4gICAgICAgIGNvbnN0IHVuaWZvcm0gPSBuZXcgV0dMMkNvbXBvbmVudFVuaWZvcm0odGhpcy5nbCwgdGhpcy5jUHJvZ3JhbSwgbmFtZSwgdHlwZSk7XHJcbiAgICAgICAgdGhpcy5jVW5pZm9ybXMucHVzaCh1bmlmb3JtKTtcclxuICAgICAgICB0aGlzLmNVbmlmb3JtQnlOYW1lW25hbWVdID0gdW5pZm9ybTtcclxuICAgICAgICByZXR1cm4gdW5pZm9ybTtcclxuICAgIH1cclxuICAgIGdldFVuaWZvcm0obmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY1VuaWZvcm1CeU5hbWVbbmFtZV07XHJcbiAgICB9XHJcbiAgICBjcmVhdGVPYmplY3QoKSB7XHJcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IFdHTDJPYmplY3QodGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH1cclxuICAgIGNyZWF0ZVRleHR1cmUyRChuYW1lOiBzdHJpbmcsIHNsb3Q6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHRleHR1cmUgPSBuZXcgV0dMMlRleHR1cmUyRCh0aGlzLCBuYW1lLCBzbG90KTtcclxuICAgICAgICByZXR1cm4gdGV4dHVyZTtcclxuICAgIH1cclxuICAgIHNldEFjdGl2ZSgpIHtcclxuICAgICAgICB0aGlzLmNQcm9ncmFtLnNldEFjdGl2ZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBURVhUVVJFIEFUTEFTIENMQVNTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IHR5cGUgQXRsYXNJbWFnZSA9IHt4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIsIGltZzogSFRNTEltYWdlRWxlbWVudCwgbmFtZTogc3RyaW5nfTtcclxuXHJcbmV4cG9ydCBjbGFzcyBUZXh0dXJlQXRsYXMge1xyXG4gICAgd2lkdGg6IG51bWJlcjtcclxuICAgIGhlaWdodDogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGltYWdlOiBIVE1MSW1hZ2VFbGVtZW50LCBwdWJsaWMgYm91bmRzOiB7W25hbWU6c3RyaW5nXTogQXRsYXNJbWFnZX0pIHtcclxuICAgICAgICB0aGlzLndpZHRoID0gaW1hZ2UubmF0dXJhbFdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaW1hZ2UubmF0dXJhbEhlaWdodDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBmcm9tVXJscyhhcmdzOiBbbmFtZTpzdHJpbmcsIHVybDpzdHJpbmddW10sIHBhZGRpbmcgPSAwKSB7XHJcbiAgICAgICAgbGV0IGltYWdlczogQXRsYXNJbWFnZVtdID0gW107XHJcbiAgICAgICAgbGV0IHByb21pc2VzOiBQcm9taXNlPHZvaWQ+W10gPSBbXTtcclxuICAgICAgICBsZXQgYXRsYXNTaXplID0gMDtcclxuICAgICAgICBmb3IobGV0IFtuYW1lLCB1cmxdIG9mIGFyZ3MpIHtcclxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaChuZXcgUHJvbWlzZTx2b2lkPihhc3luYyByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YTogQXRsYXNJbWFnZSA9IHtpbWcsIHg6MCwgeTowLCB3OmltZy5uYXR1cmFsV2lkdGgrMipwYWRkaW5nLCBoOmltZy5uYXR1cmFsSGVpZ2h0KzIqcGFkZGluZywgbmFtZX07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlzQ29sbGlkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHg9MDt4PD1hdGxhc1NpemUtZGF0YS53O3grKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHk9MDt5PD1hdGxhc1NpemUtZGF0YS5oO3krKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb2xsaWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgb3RoZXIgb2YgaW1hZ2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoeCArIGRhdGEudyA+IG90aGVyLnggJiYgeSArIGRhdGEuaCA+IG90aGVyLnkgJiYgeCA8IG90aGVyLnggKyBvdGhlci53ICYmIHkgPCBvdGhlci55ICsgb3RoZXIuaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbGxpZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFpc0NvbGxpZGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEueCA9IHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS55ID0geTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZighaXNDb2xsaWRpbmcpIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZihpc0NvbGxpZGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnggPSBhdGxhc1NpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEueSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0bGFzU2l6ZSA9IGRhdGEueCArIGRhdGEudztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VzLnB1c2goZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpbWcuc3JjID0gdXJsO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcclxuICAgICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgICAgICBjYW52YXMud2lkdGggPSBhdGxhc1NpemU7XHJcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGF0bGFzU2l6ZTtcclxuICAgICAgICBsZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKSE7XHJcbiAgICAgICAgbGV0IGJvdW5kczoge1tuYW1lOnN0cmluZ106IEF0bGFzSW1hZ2V9ID0ge307XHJcbiAgICAgICAgZm9yKGxldCBpbWcgb2YgaW1hZ2VzKSB7XHJcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgaW1nLnggKyBwYWRkaW5nLCBpbWcueSArIHBhZGRpbmcpO1xyXG4gICAgICAgICAgICBpZihwYWRkaW5nICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZy5pbWcsIDAsIDAsIDEsIGltZy5oLTIqcGFkZGluZywgaW1nLngsIGltZy55ICsgcGFkZGluZywgcGFkZGluZywgaW1nLmgtMipwYWRkaW5nKTsgLy8gbGVmdFxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCBpbWcudy0yKnBhZGRpbmctMSwgMCwgMSwgaW1nLmgtMipwYWRkaW5nLCBpbWcueCtpbWcudy1wYWRkaW5nLCBpbWcueSArIHBhZGRpbmcsIHBhZGRpbmcsIGltZy5oLTIqcGFkZGluZyk7IC8vIHJpZ2h0XHJcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZy5pbWcsIDAsIDAsIGltZy53LTIqcGFkZGluZywgMSwgaW1nLnggKyBwYWRkaW5nLCBpbWcueSwgaW1nLnctMipwYWRkaW5nLCBwYWRkaW5nKTsgLy8gdG9wXHJcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZy5pbWcsIDAsIGltZy5oLTIqcGFkZGluZy0xLCBpbWcudy0yKnBhZGRpbmcsIDEsIGltZy54ICsgcGFkZGluZywgaW1nLnkraW1nLmgtcGFkZGluZywgaW1nLnctMipwYWRkaW5nLCBwYWRkaW5nKTsgLy8gYm90dG9tXHJcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZy5pbWcsIDAsIDAsIDIsIDIsIGltZy54LCBpbWcueSwgcGFkZGluZywgcGFkZGluZyk7IC8vIHRvcC1sZWZ0XHJcbiAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZy5pbWcsIGltZy53LTIqcGFkZGluZy0yLCAwLCAyLCAyLCBpbWcueCtpbWcudy1wYWRkaW5nLCBpbWcueSwgcGFkZGluZywgcGFkZGluZyk7IC8vIHRvcC1yaWdodFxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCAwLCBpbWcuaC0yKnBhZGRpbmctMiwgMiwgMiwgaW1nLngsIGltZy55K2ltZy5oLXBhZGRpbmcsIHBhZGRpbmcsIHBhZGRpbmcpOyAvLyBib3R0b20tbGVmdFxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCBpbWcudy0yKnBhZGRpbmctMiwgaW1nLmgtMipwYWRkaW5nLTIsIDIsIDIsIGltZy54K2ltZy53LXBhZGRpbmcsIGltZy55K2ltZy5oLXBhZGRpbmcsIHBhZGRpbmcsIHBhZGRpbmcpOyAvLyBib3R0b20tcmlnaHRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbWcueCA9IChpbWcueCArIHBhZGRpbmcpIC8gYXRsYXNTaXplO1xyXG4gICAgICAgICAgICBpbWcueSA9IChpbWcueSArIHBhZGRpbmcpIC8gYXRsYXNTaXplO1xyXG4gICAgICAgICAgICBpbWcudyA9IChpbWcudyAtIDIqcGFkZGluZykgLyBhdGxhc1NpemU7XHJcbiAgICAgICAgICAgIGltZy5oID0gKGltZy5oIC0gMipwYWRkaW5nKSAvIGF0bGFzU2l6ZTtcclxuICAgICAgICAgICAgYm91bmRzW2ltZy5uYW1lXSA9IGltZztcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHVybCA9IGNhbnZhcy50b0RhdGFVUkwoKTtcclxuICAgICAgICBjb25zdCBhdGxhc0ltYWdlID0gYXdhaXQgbmV3IFByb21pc2U8SFRNTEltYWdlRWxlbWVudD4ocmVzID0+IHtcclxuICAgICAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzKGltZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW1nLnNyYyA9IHVybDtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbmV3IFRleHR1cmVBdGxhcyhhdGxhc0ltYWdlLCBib3VuZHMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyAgQ09MT1IgQ0xBU1MgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLyoqXHJcbiAqIFJlcHJlc2VudHMgYSBjb2xvciBhbmQgYSB0cmFuc3BhcmVuY3kgdmFsdWUuIEltcGxlbWVudHMgbGF6eSBjb252ZXJzaW9uIGJldHdlZW4gUkdCIGFuZCBIU1Ygc3BhY2UuXHJcbiovXHJcbmV4cG9ydCBjbGFzcyBDb2xvciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpO1xyXG4gICAgY29uc3RydWN0b3IocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcik7XHJcbiAgICBjb25zdHJ1Y3RvcihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyLCBhOiBudW1iZXIpO1xyXG4gICAgY29uc3RydWN0b3IoY29sb3I6IHN0cmluZyB8IENvbG9yKTtcclxuICAgIGNvbnN0cnVjdG9yKGFyZ0E/OiBudW1iZXIgfCBzdHJpbmcgfCBDb2xvciwgYXJnQj86IG51bWJlciwgYXJnQz86IG51bWJlciwgYXJnRD86IG51bWJlcikge1xyXG4gICAgICAgIGlmKHR5cGVvZiBhcmdBID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIGxldCBjb21wID0gYXJnQS5zcGxpdChcIihcIik7XHJcbiAgICAgICAgICAgIGlmKGNvbXAubGVuZ3RoID09IDApXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIGNvbnN0cnVjdG9yOiBFbXB0eSBzdHJpbmdcIik7XHJcbiAgICAgICAgICAgIGlmKGNvbXAubGVuZ3RoIDwgMilcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgY29uc3RydWN0b3I6IFwiICsgY29tcFswXSk7XHJcbiAgICAgICAgICAgIGxldCBjc3RydWN0ID0gY29tcFswXTtcclxuICAgICAgICAgICAgbGV0IGNwYXJhbSA9IGNvbXBbMV0hLnJlcGxhY2UoXCIpXCIsIFwiXCIpO1xyXG4gICAgICAgICAgICBpZihjc3RydWN0ID09PSBcInJnYlwiIHx8IGNzdHJ1Y3QgPT09IFwicmdiYVwiKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FyZ3MgPSBjcGFyYW0uc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYoY2FyZ3MubGVuZ3RoIDwgMyB8fCBjYXJncy5sZW5ndGggPiA0KVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgYXJndW1lbnQgY291bnQ6IFwiICsgY2FyZ3MubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIGxldCByID0gcGFyc2VJbnQoY2FyZ3NbMF0hKTtcclxuICAgICAgICAgICAgICAgIGxldCBnID0gcGFyc2VJbnQoY2FyZ3NbMV0hKTtcclxuICAgICAgICAgICAgICAgIGxldCBiID0gcGFyc2VJbnQoY2FyZ3NbMl0hKTtcclxuICAgICAgICAgICAgICAgIGxldCBhID0gY2FyZ3NbM10gPyBwYXJzZUZsb2F0KGNhcmdzWzNdISkgOiAxO1xyXG4gICAgICAgICAgICAgICAgaWYoaXNOYU4ocikpIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgdmFsdWU6IFwiICsgY2FyZ3NbMF0pO1xyXG4gICAgICAgICAgICAgICAgaWYoaXNOYU4oZykpIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgdmFsdWU6IFwiICsgY2FyZ3NbMV0pO1xyXG4gICAgICAgICAgICAgICAgaWYoaXNOYU4oYikpIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgdmFsdWU6IFwiICsgY2FyZ3NbMl0pO1xyXG4gICAgICAgICAgICAgICAgaWYoaXNOYU4oYSkpIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgdmFsdWU6IFwiICsgY2FyZ3NbM10pO1xyXG4gICAgICAgICAgICAgICAgciA9IEVNYXRoLmNsYW1wKE1hdGgucm91bmQociksIDAsIDI1NSk7XHJcbiAgICAgICAgICAgICAgICBnID0gRU1hdGguY2xhbXAoTWF0aC5yb3VuZChnKSwgMCwgMjU1KTtcclxuICAgICAgICAgICAgICAgIGIgPSBFTWF0aC5jbGFtcChNYXRoLnJvdW5kKGIpLCAwLCAyNTUpO1xyXG4gICAgICAgICAgICAgICAgYSA9IEVNYXRoLmNsYW1wKGEsIDAsIDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fciA9IHI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9nID0gZztcclxuICAgICAgICAgICAgICAgIHRoaXMuX2IgPSBiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hID0gYTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hhc1JnYiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oYXNIc3YgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmKGNzdHJ1Y3QgPT09IFwiaHN2XCIgfHwgY3N0cnVjdCA9PT0gXCJoc3ZhXCIpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYXJncyA9IGNwYXJhbS5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgICAgICBpZihjYXJncy5sZW5ndGggPCAzIHx8IGNhcmdzLmxlbmd0aCA+IDQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb2xvciBhcmd1bWVudCBjb3VudDogXCIgKyBjYXJncy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGg6IG51bWJlcjtcclxuICAgICAgICAgICAgICAgIGlmKGNhcmdzWzBdIS5pbmNsdWRlcyhcInJhZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGggPSBwYXJzZUZsb2F0KGNhcmdzWzBdISkgKiAxODAgLyBNYXRoLlBJO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBoID0gcGFyc2VJbnQoY2FyZ3NbMF0hKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCBzID0gcGFyc2VJbnQoY2FyZ3NbMV0hKTtcclxuICAgICAgICAgICAgICAgIGxldCB2ID0gcGFyc2VJbnQoY2FyZ3NbMl0hKTtcclxuICAgICAgICAgICAgICAgIGxldCBhID0gY2FyZ3NbM10gPyBwYXJzZUludChjYXJnc1szXSEpIDogMTtcclxuICAgICAgICAgICAgICAgIGlmKGlzTmFOKGgpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIHZhbHVlOiBcIiArIGNhcmdzWzBdKTtcclxuICAgICAgICAgICAgICAgIGlmKGlzTmFOKHMpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIHZhbHVlOiBcIiArIGNhcmdzWzFdKTtcclxuICAgICAgICAgICAgICAgIGlmKGlzTmFOKHYpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIHZhbHVlOiBcIiArIGNhcmdzWzJdKTtcclxuICAgICAgICAgICAgICAgIGlmKGlzTmFOKGEpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvbG9yIHZhbHVlOiBcIiArIGNhcmdzWzNdKTtcclxuICAgICAgICAgICAgICAgIGggPSBFTWF0aC5wbW9kKGgsIDM2MCk7XHJcbiAgICAgICAgICAgICAgICBzID0gRU1hdGguY2xhbXAocywgMCwgMTAwKTtcclxuICAgICAgICAgICAgICAgIHYgPSBFTWF0aC5jbGFtcCh2LCAwLCAxMDApO1xyXG4gICAgICAgICAgICAgICAgYSA9IEVNYXRoLmNsYW1wKGEsIDAsIDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faHVlID0gaDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NhdCA9IHM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92YWwgPSB2O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hID0gYTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hhc0hzdiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oYXNSZ2IgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgY29uc3RydWN0b3I6IFwiICsgY3N0cnVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYodHlwZW9mIGFyZ0EgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgaWYgKGFyZ0IgPT09IHVuZGVmaW5lZCB8fCBhcmdDID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29sb3IgY29uc3RydWN0b3I6IE5vdCBlbm91Z2ggYXJndW1lbnRzXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3IgPSBFTWF0aC5jbGFtcChNYXRoLnJvdW5kKGFyZ0EpLCAwLCAyNTUpO1xyXG4gICAgICAgICAgICB0aGlzLl9nID0gRU1hdGguY2xhbXAoTWF0aC5yb3VuZChhcmdCISksIDAsIDI1NSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2IgPSBFTWF0aC5jbGFtcChNYXRoLnJvdW5kKGFyZ0MhKSwgMCwgMjU1KTtcclxuICAgICAgICAgICAgdGhpcy5hID0gRU1hdGguY2xhbXAoYXJnRCA/PyAxLCAwLCAxKTtcclxuICAgICAgICAgICAgdGhpcy5faGFzUmdiID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5faGFzSHN2ID0gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIGlmKGFyZ0EgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yID0gMDtcclxuICAgICAgICAgICAgdGhpcy5fZyA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuX2IgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmEgPSAxO1xyXG4gICAgICAgICAgICB0aGlzLl9oYXNSZ2IgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9oYXNIc3YgPSBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9yID0gYXJnQSEucjtcclxuICAgICAgICAgICAgdGhpcy5fZyA9IGFyZ0EhLmc7XHJcbiAgICAgICAgICAgIHRoaXMuX2IgPSBhcmdBIS5iO1xyXG4gICAgICAgICAgICB0aGlzLmEgPSBhcmdBIS5hO1xyXG4gICAgICAgICAgICB0aGlzLl9oYXNSZ2IgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9oYXNIc3YgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2xvbmUoKTogQ29sb3Ige1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29sb3IodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgX2hhc1JnYiA9IGZhbHNlO1xyXG4gICAgX2hhc0hzdiA9IGZhbHNlO1xyXG5cclxuICAgIF9yID0gMDtcclxuICAgIC8qKlxyXG4gICAgICogKGludCkgcmVkIHZhbHVlIG9mIHRoZSBjb2xvciwgMCAtIDI1NS5cclxuICAgICovXHJcbiAgICBzZXQgcih2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFsdWUgPSBFTWF0aC5jbGFtcChNYXRoLnJvdW5kKHZhbHVlKSwgMCwgMjU1KTtcclxuICAgICAgICBpZih2YWx1ZSA9PSB0aGlzLl9yKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYoIXRoaXMuX2hhc1JnYilcclxuICAgICAgICAgICAgdGhpcy5fYWRkUmdiKCk7XHJcbiAgICAgICAgdGhpcy5fciA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX2hhc0hzdiA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgZ2V0IHIoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMuX2hhc1JnYilcclxuICAgICAgICAgICAgdGhpcy5fYWRkUmdiKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3I7XHJcbiAgICB9XHJcblxyXG4gICAgX2cgPSAwO1xyXG4gICAgLyoqXHJcbiAgICAgKiAoaW50KSBncmVlbiB2YWx1ZSBvZiB0aGUgY29sb3IsIDAgLSAyNTUuXHJcbiAgICAqL1xyXG4gICAgc2V0IGcodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHZhbHVlID0gRU1hdGguY2xhbXAoTWF0aC5yb3VuZCh2YWx1ZSksIDAsIDI1NSk7XHJcbiAgICAgICAgaWYodmFsdWUgPT0gdGhpcy5fZylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGlmKCF0aGlzLl9oYXNSZ2IpXHJcbiAgICAgICAgICAgIHRoaXMuX2FkZFJnYigpO1xyXG4gICAgICAgIHRoaXMuX2cgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9oYXNIc3YgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGdldCBnKCkge1xyXG4gICAgICAgIGlmKCF0aGlzLl9oYXNSZ2IpXHJcbiAgICAgICAgICAgIHRoaXMuX2FkZFJnYigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9nO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBfYiA9IDA7XHJcbiAgICAvKipcclxuICAgICAqIChpbnQpIGJsdWUgdmFsdWUgb2YgdGhlIGNvbG9yLCAwIC0gMjU1LlxyXG4gICAgKi9cclxuICAgIHNldCBiKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB2YWx1ZSA9IEVNYXRoLmNsYW1wKE1hdGgucm91bmQodmFsdWUpLCAwLCAyNTUpO1xyXG4gICAgICAgIGlmKHZhbHVlID09IHRoaXMuX2IpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZighdGhpcy5faGFzUmdiKVxyXG4gICAgICAgICAgICB0aGlzLl9hZGRSZ2IoKTtcclxuICAgICAgICB0aGlzLl9iID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5faGFzSHN2ID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBnZXQgYigpIHtcclxuICAgICAgICBpZighdGhpcy5faGFzUmdiKVxyXG4gICAgICAgICAgICB0aGlzLl9hZGRSZ2IoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYjtcclxuICAgIH1cclxuXHJcbiAgICBfYWRkUmdiKCkge1xyXG4gICAgICAgIGNvbnN0IHtfaHVlOmgsIF9zYXQ6cywgX3ZhbDp2fSA9IHRoaXM7XHJcbiAgICAgICAgY29uc3QgYyA9IHYgLyAxMDAgKiBzIC8gMTAwO1xyXG4gICAgICAgIGNvbnN0IHggPSBjICogKDEgLSBNYXRoLmFicygoKGggLyA2MCkgJSAyKSAtIDEpKTtcclxuICAgICAgICBjb25zdCBtID0gdiAvIDEwMCAtIGM7XHJcbiAgICAgICAgbGV0IHJwPTAsIGdwPTAsIGJwPTA7XHJcbiAgICAgICAgc3dpdGNoKE1hdGguZmxvb3IoaCAvIDYwKSkge1xyXG4gICAgICAgICAgICBjYXNlIDA6IHJwPWM7IGdwPXg7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDE6IHJwPXg7IGdwPWM7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDI6IGdwPWM7IGJwPXg7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM6IGdwPXg7IGJwPWM7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDQ6IHJwPXg7IGJwPWM7IGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBycD1jOyBicD14OyBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fciA9IE1hdGgucm91bmQoKHJwICsgbSkgKiAyNTUpO1xyXG4gICAgICAgIHRoaXMuX2cgPSBNYXRoLnJvdW5kKChncCArIG0pICogMjU1KTtcclxuICAgICAgICB0aGlzLl9iID0gTWF0aC5yb3VuZCgoYnAgKyBtKSAqIDI1NSk7XHJcbiAgICAgICAgdGhpcy5faGFzUmdiID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBfaHVlID0gMDtcclxuICAgIC8qKlxyXG4gICAgICogKGRlY2ltYWwpIGh1ZSBvZiB0aGUgY29sb3IgaW4gZGVncmVlcywgMCAtIDM2MC5cclxuICAgICovXHJcbiAgICBzZXQgaHVlKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB2YWx1ZSA9IEVNYXRoLnBtb2QodmFsdWUsIDM2MCk7XHJcbiAgICAgICAgaWYodmFsdWUgPT0gdGhpcy5faHVlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYoIXRoaXMuX2hhc0hzdilcclxuICAgICAgICAgICAgdGhpcy5fYWRkSHN2KCk7XHJcbiAgICAgICAgdGhpcy5faHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5faGFzUmdiID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBnZXQgaHVlKCkge1xyXG4gICAgICAgIGlmKCF0aGlzLl9oYXNIc3YpXHJcbiAgICAgICAgICAgIHRoaXMuX2FkZEhzdigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9odWU7XHJcbiAgICB9XHJcblxyXG4gICAgX3NhdCA9IDA7XHJcbiAgICAvKipcclxuICAgICAqIChkZWNpbWFsKSBzYXR1cmF0aW9uIG9mIHRoZSBjb2xvciwgMCAtIDEwMC5cclxuICAgICovXHJcbiAgICBzZXQgc2F0KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB2YWx1ZSA9IEVNYXRoLmNsYW1wKHZhbHVlLCAwLCAxMDApO1xyXG4gICAgICAgIGlmKHZhbHVlID09IHRoaXMuX3NhdClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGlmKCF0aGlzLl9oYXNIc3YpXHJcbiAgICAgICAgICAgIHRoaXMuX2FkZEhzdigpO1xyXG4gICAgICAgIHRoaXMuX3NhdCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX2hhc1JnYiA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgZ2V0IHNhdCgpIHtcclxuICAgICAgICBpZighdGhpcy5faGFzSHN2KVxyXG4gICAgICAgICAgICB0aGlzLl9hZGRIc3YoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2F0O1xyXG4gICAgfVxyXG5cclxuICAgIF92YWwgPSAwO1xyXG4gICAgLyoqXHJcbiAgICAgKiAoZGVjaW1hbCkgdmFsdWUvYnJpZ2h0bmVzcyBvZiB0aGUgY29sb3IsIDAgLSAxMDAuXHJcbiAgICAqL1xyXG4gICAgc2V0IHZhbCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFsdWUgPSBFTWF0aC5jbGFtcCh2YWx1ZSwgMCwgMTAwKTtcclxuICAgICAgICBpZih2YWx1ZSA9PSB0aGlzLl92YWwpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZighdGhpcy5faGFzSHN2KVxyXG4gICAgICAgICAgICB0aGlzLl9hZGRIc3YoKTtcclxuICAgICAgICB0aGlzLl92YWwgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9oYXNSZ2IgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGdldCB2YWwoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMuX2hhc0hzdilcclxuICAgICAgICAgICAgdGhpcy5fYWRkSHN2KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbDtcclxuICAgIH1cclxuXHJcbiAgICBfYWRkSHN2KCkge1xyXG4gICAgICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KHRoaXMuciwgdGhpcy5nLCB0aGlzLmIpO1xyXG4gICAgICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKHRoaXMuciwgdGhpcy5nLCB0aGlzLmIpO1xyXG4gICAgICAgIGNvbnN0IGRlbHRhID0gbWF4IC0gbWluO1xyXG4gICAgICAgIGxldCBoID0gMDtcclxuICAgICAgICBpZihkZWx0YSAhPT0gMCkge1xyXG4gICAgICAgICAgICBpZihtYXggPT09IHRoaXMucikgaCA9IDYwICogKCgodGhpcy5nIC0gdGhpcy5iKSAvIGRlbHRhICsgNikgJSA2KTtcclxuICAgICAgICAgICAgZWxzZSBpZihtYXggPT09IHRoaXMuZykgaCA9IDYwICogKCh0aGlzLmIgLSB0aGlzLnIpIC8gZGVsdGEgKyAyKTtcclxuICAgICAgICAgICAgZWxzZSBoID0gNjAgKiAoKHRoaXMuciAtIHRoaXMuZykgLyBkZWx0YSArIDQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihoIDwgMCkgaCArPSAzNjA7XHJcbiAgICAgICAgY29uc3QgcyA9IG1heCA9PT0gMCA/IDAgOiBkZWx0YS9tYXgqMTAwO1xyXG4gICAgICAgIGNvbnN0IHYgPSBtYXgvMjU1KjEwMDtcclxuICAgICAgICB0aGlzLl9odWUgPSBoO1xyXG4gICAgICAgIHRoaXMuX3NhdCA9IHM7XHJcbiAgICAgICAgdGhpcy5fdmFsID0gdjtcclxuICAgICAgICB0aGlzLl9oYXNIc3YgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogKGRlY2ltYWwpIGFscGhhL29wYWNpdHkgb2YgdGhlIGNvbG9yLCAwIC0gMS5cclxuICAgICovXHJcbiAgICBhID0gMTtcclxuXHJcbiAgICBzdHJpY3RFcXVhbHMob3RoZXI6IENvbG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgdGhpcy5yID09IG90aGVyLnJcclxuICAgICAgICAgICAgJiYgdGhpcy5nID09IG90aGVyLmdcclxuICAgICAgICAgICAgJiYgdGhpcy5iID09IG90aGVyLmJcclxuICAgICAgICAgICAgJiYgdGhpcy5hID09IG90aGVyLmFcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgaXNDbG9zZShvdGhlcjogQ29sb3IsIGUgPSAxZS02KSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgRU1hdGguaXNDbG9zZSh0aGlzLnIsIG90aGVyLnIsIGUpXHJcbiAgICAgICAgICAgICYmIEVNYXRoLmlzQ2xvc2UodGhpcy5nLCBvdGhlci5nLCBlKVxyXG4gICAgICAgICAgICAmJiBFTWF0aC5pc0Nsb3NlKHRoaXMuYiwgb3RoZXIuYiwgZSlcclxuICAgICAgICAgICAgJiYgRU1hdGguaXNDbG9zZSh0aGlzLmEsIG90aGVyLmEsIGUpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIHN0cmljdEVxdWFsc1JnYihvdGhlcjogQ29sb3IpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICB0aGlzLnIgPT0gb3RoZXIuclxyXG4gICAgICAgICAgICAmJiB0aGlzLmcgPT0gb3RoZXIuZ1xyXG4gICAgICAgICAgICAmJiB0aGlzLmIgPT0gb3RoZXIuYlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBpc0Nsb3NlUmdiKG90aGVyOiBDb2xvciwgZSA9IDFlLTYpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICBFTWF0aC5pc0Nsb3NlKHRoaXMuciwgb3RoZXIuciwgZSlcclxuICAgICAgICAgICAgJiYgRU1hdGguaXNDbG9zZSh0aGlzLmcsIG90aGVyLmcsIGUpXHJcbiAgICAgICAgICAgICYmIEVNYXRoLmlzQ2xvc2UodGhpcy5iLCBvdGhlci5iLCBlKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBsZXJwUmdiYShvdGhlcjogQ29sb3IsIHQ6IG51bWJlcik6IENvbG9yIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxlcnBSZ2JhU2VsZihvdGhlciwgdCk7XHJcbiAgICB9XHJcbiAgICBsZXJwUmdiYVNlbGYob3RoZXI6IENvbG9yLCB0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnIgPSBFTWF0aC5sZXJwKHRoaXMuciwgb3RoZXIuciwgdCk7XHJcbiAgICAgICAgdGhpcy5nID0gRU1hdGgubGVycCh0aGlzLmcsIG90aGVyLmcsIHQpO1xyXG4gICAgICAgIHRoaXMuYiA9IEVNYXRoLmxlcnAodGhpcy5iLCBvdGhlci5iLCB0KTtcclxuICAgICAgICB0aGlzLmEgPSBFTWF0aC5sZXJwKHRoaXMuYSwgb3RoZXIuYSwgdCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBsZXJwSHN2YShvdGhlcjogQ29sb3IsIHQ6IG51bWJlcik6IENvbG9yIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxlcnBIc3ZhU2VsZihvdGhlciwgdCk7XHJcbiAgICB9XHJcbiAgICBsZXJwSHN2YVNlbGYob3RoZXI6IENvbG9yLCB0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLmh1ZSA9IEVNYXRoLmxlcnAodGhpcy5odWUsIG90aGVyLmh1ZSwgdCk7XHJcbiAgICAgICAgdGhpcy5zYXQgPSBFTWF0aC5sZXJwKHRoaXMuc2F0LCBvdGhlci5zYXQsIHQpO1xyXG4gICAgICAgIHRoaXMudmFsID0gRU1hdGgubGVycCh0aGlzLnZhbCwgb3RoZXIudmFsLCB0KTtcclxuICAgICAgICB0aGlzLmEgPSBFTWF0aC5sZXJwKHRoaXMuYSwgb3RoZXIuYSwgdCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBnZXRJc0ZvcmVncm91bmRXaGl0ZSh0aHJlc2hvbGQgPSAwLjQyKSB7XHJcbiAgICAgICAgbGV0IHtyLCBnLCBifSA9IHRoaXM7XHJcbiAgICAgICAgciAvPSAyNTU7XHJcbiAgICAgICAgZyAvPSAyNTU7XHJcbiAgICAgICAgYiAvPSAyNTU7XHJcbiAgICAgICAgciA9IChyIDwgMC4wMzkyOCkgPyAociAvIDEyLjkyKSA6ICgoKHIgKyAwLjA1NSkgLyAxLjA1NSkgKiogMi40KVxyXG4gICAgICAgIGcgPSAoZyA8IDAuMDM5MjgpID8gKGcgLyAxMi45MikgOiAoKChnICsgMC4wNTUpIC8gMS4wNTUpICoqIDIuNClcclxuICAgICAgICBiID0gKGIgPCAwLjAzOTI4KSA/IChiIC8gMTIuOTIpIDogKCgoYiArIDAuMDU1KSAvIDEuMDU1KSAqKiAyLjQpXHJcbiAgICAgICAgbGV0IGwgPSAwLjIxMjYgKiByICsgMC43MTUyICogZyArIDAuMDcyMiAqIGJcclxuICAgICAgICByZXR1cm4gbCA8IHRocmVzaG9sZDtcclxuICAgIH1cclxuICAgIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGByZ2JhKCR7dGhpcy5yfSwgJHt0aGlzLmd9LCAke3RoaXMuYn0sICR7dGhpcy5hfSlgO1xyXG4gICAgfVxyXG4gICAgdG9SZ2JhQXJyYXkoKTogW3I6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIsIGE6IG51bWJlcl0ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy5yLCB0aGlzLmcsIHRoaXMuYiwgdGhpcy5hXTtcclxuICAgIH1cclxuICAgIHRvSHN2YUFycmF5KCk6IFtoOiBudW1iZXIsIHM6IG51bWJlciwgdjogbnVtYmVyLCBhOiBudW1iZXJdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMuaHVlLCB0aGlzLnNhdCwgdGhpcy52YWwsIHRoaXMuYV07XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIElOUFVUIENMQVNTRVMgIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgS2V5cHJlc3NlcyB7XHJcbiAgICBzdGF0aWMga2V5UHJlc3NlZDoge1trZXk6c3RyaW5nXTogYW55fSA9IHt9O1xyXG4gICAgc3RhdGljIHByZXNzZWRLZXlzOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKTtcclxuICAgIHN0YXRpYyBrZXlEb3duRXZlbnQgPSBuZXcgU2lnbmFsPFtrZXlOYW1lOnN0cmluZ10+KCk7XHJcbiAgICBzdGF0aWMga2V5VXBFdmVudCA9IG5ldyBTaWduYWw8W2tleU5hbWU6c3RyaW5nXT4oKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGtleWRvd24oa2V5OiBzdHJpbmcpIHtcclxuICAgIEtleXByZXNzZXMua2V5UHJlc3NlZFtrZXldID0gdHJ1ZTtcclxuICAgIEtleXByZXNzZXMucHJlc3NlZEtleXMuYWRkKGtleSk7XHJcbiAgICBLZXlwcmVzc2VzLmtleURvd25FdmVudC5maXJlKGtleSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBrZXl1cChrZXk6IHN0cmluZykge1xyXG4gICAgZGVsZXRlIEtleXByZXNzZXMua2V5UHJlc3NlZFtrZXldO1xyXG4gICAgS2V5cHJlc3Nlcy5wcmVzc2VkS2V5cy5kZWxldGUoa2V5KTtcclxuICAgIEtleXByZXNzZXMua2V5VXBFdmVudC5maXJlKGtleSk7XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlID0+IHtcclxuICAgIGNvbnN0IGtleSA9IGUua2V5LnRvTG93ZXJDYXNlKCk7XHJcbiAgICBrZXlkb3duKGtleSk7XHJcbn0pO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBlID0+IHtcclxuICAgIGNvbnN0IGtleSA9IGUua2V5LnRvTG93ZXJDYXNlKCk7XHJcbiAgICBrZXl1cChrZXkpO1xyXG59KTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGUgPT4ge1xyXG4gICAgaWYoZS5idXR0b24gPT09IDApIHtcclxuICAgICAgICBrZXlkb3duKFwibG1iXCIpO1xyXG4gICAgfSBlbHNlIGlmKGUuYnV0dG9uID09PSAxKSB7XHJcbiAgICAgICAga2V5ZG93bihcIm1tYlwiKTtcclxuICAgIH0gZWxzZSBpZihlLmJ1dHRvbiA9PT0gMikge1xyXG4gICAgICAgIGtleWRvd24oXCJybWJcIik7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGUgPT4ge1xyXG4gICAgaWYoZS5idXR0b24gPT09IDApIHtcclxuICAgICAgICBrZXl1cChcImxtYlwiKTtcclxuICAgIH0gZWxzZSBpZihlLmJ1dHRvbiA9PT0gMSkge1xyXG4gICAgICAgIGtleXVwKFwibW1iXCIpO1xyXG4gICAgfSBlbHNlIGlmKGUuYnV0dG9uID09PSAyKSB7XHJcbiAgICAgICAga2V5dXAoXCJybWJcIik7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBvaW50ZXJMb2NrIHtcclxuICAgIGNvbm5lY3Rpb25zID0gbmV3IENvbm5lY3Rpb25Hcm91cCgpO1xyXG4gICAgcG9pbnRlckxvY2tDaGFuZ2VFdmVudCA9IG5ldyBTaWduYWwoKTtcclxuICAgIGxvY2tlZE1vdXNlTW92ZUV2ZW50ID0gbmV3IFNpZ25hbCgpO1xyXG4gICAgaXNFbmFibGVkID0gZmFsc2U7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmFkZChuZXcgSHRtbENvbm5lY3Rpb24od2luZG93LCBcIm1vdXNlZG93blwiLCAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZih0aGlzLmlzRW5hYmxlZCAmJiBkb2N1bWVudC5wb2ludGVyTG9ja0VsZW1lbnQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZXF1ZXN0UG9pbnRlckxvY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmFkZChuZXcgSHRtbENvbm5lY3Rpb24od2luZG93LCBcIm1vdXNlbW92ZVwiLCAoZTogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZihkb2N1bWVudC5wb2ludGVyTG9ja0VsZW1lbnQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRoaXMubG9ja2VkTW91c2VNb3ZlRXZlbnQuZmlyZShlLm1vdmVtZW50WCwgZS5tb3ZlbWVudFkpO1xyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmFkZChuZXcgSHRtbENvbm5lY3Rpb24oZG9jdW1lbnQsIFwicG9pbnRlcmxvY2tjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBvaW50ZXJMb2NrQ2hhbmdlRXZlbnQuZmlyZShkb2N1bWVudC5wb2ludGVyTG9ja0VsZW1lbnQgIT0gbnVsbCk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG4gICAgbG9jaygpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLmlzRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZXF1ZXN0UG9pbnRlckxvY2soKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHVubG9jaygpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLmlzRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIGRvY3VtZW50LmV4aXRQb2ludGVyTG9jaygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmVtb3ZlKCkge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMuZGlzY29ubmVjdEFsbCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vICBPQlNFUlZFUiBDTEFTU0VTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0IGNsYXNzIFdpbmRvd1Jlc2l6ZU9ic2VydmVyIHtcclxuICAgIHJlc2l6ZUV2ZW50OiBTaWduYWw8W3c6IG51bWJlciwgaDogbnVtYmVyXT4gPSBuZXcgU2lnbmFsKHtcclxuICAgICAgICBvbkNvbm5lY3Q6IGNvbm4gPT4gY29ubi5maXJlKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpLFxyXG4gICAgfSk7XHJcbiAgICBjb25uZWN0aW9ucyA9IG5ldyBDb25uZWN0aW9uR3JvdXAoKTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMuYWRkKG5ldyBIdG1sQ29ubmVjdGlvbih3aW5kb3csIFwicmVzaXplXCIsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZXNpemVFdmVudC5maXJlKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuICAgIHJlbW92ZSgpIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmRpc2Nvbm5lY3RBbGwoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gIFJFTkRFUiBMT09QIENMQVNTICAvL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydCBjbGFzcyBSZW5kZXJMb29wIHtcclxuICAgIHJ1bkluZGV4ID0gMDtcclxuICAgIGlzUnVubmluZyA9IGZhbHNlO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGNhbGxiYWNrOiAoZHQ6IG51bWJlcikgPT4gdm9pZCkge1xyXG5cclxuICAgIH1cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMuaXNSdW5uaW5nKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucnVuSW5kZXgrKztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIGlmKHRoaXMuaXNSdW5uaW5nKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB0aGlzLmlzUnVubmluZyA9IHRydWU7XHJcbiAgICAgICAgbGV0IHJpID0gdGhpcy5ydW5JbmRleDtcclxuICAgICAgICBsZXQgZnJhbWVUaW1lID0gcGVyZm9ybWFuY2Uubm93KCkvMTAwMDtcclxuICAgICAgICBjb25zdCByZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMucnVuSW5kZXggIT0gcmkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgbm93ID0gcGVyZm9ybWFuY2Uubm93KCkvMTAwMDtcclxuICAgICAgICAgICAgbGV0IGR0ID0gbm93IC0gZnJhbWVUaW1lO1xyXG4gICAgICAgICAgICBmcmFtZVRpbWUgPSBub3c7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2soZHQpO1xyXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVuZGVyKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn0iXX0=