// compilation of all of the scripts i made that i use for 3d games
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
export function voxelRaymarch(origin, direction, predicate, maxIterations = 1000) {
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
export function intersectsWithBox(origin, direction, bounds) {
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
export class FullscreenResize {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGliM2RfdjIwMjYwNDEzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGliM2RfdjIwMjYwNDEzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG1FQUFtRTtBQUVuRSxNQUFNLE9BQWdCLEtBQUs7SUFDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFTLEVBQUMsQ0FBUyxFQUFDLENBQVM7UUFDdEMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQVMsRUFBQyxDQUFTLEVBQUMsQ0FBUztRQUNyQyxPQUFPLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBUyxFQUFDLENBQVM7UUFDM0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLElBQVksSUFBSTtRQUNqRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFTLEVBQUUsSUFBWSxJQUFJO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDM0IsQ0FBQztDQUNKO0FBRUQsTUFBTSxPQUFPLElBQUk7SUFDYixDQUFDLENBQVM7SUFDVixDQUFDLENBQVM7SUFDVixDQUFDLENBQVM7SUFHVixZQUFZLENBQTBDLEVBQUUsQ0FBVSxFQUFFLENBQVU7UUFDMUUs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QyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNELFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUN6QixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1osT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFTO1FBQ1YsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFDRCxRQUFRLENBQUMsQ0FBUztRQUNkLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1osSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsSUFBSSxDQUFDLEtBQVc7UUFDWixPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBQ0QsUUFBUSxDQUFDLEtBQVc7UUFDaEIsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDMUIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELEtBQUssQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUN0QixPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNELFNBQVMsQ0FBQyxD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RSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekMsTUFBTSxFQUFFLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekMsTUFBTSxJQUFJLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sSUFBSSxHQUFHLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlFLE1BQU0sSUFBSSxHQUFHLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlFLE1BQU0sSUFBSSxHQUFHLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlFLE1BQU0sSUFBSSxHQUFHLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlFLE1BQU0sSUFBSSxHQUFHLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlFLE1BQU0sSUFBSSxHQUFHLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlFLE1BQU0sSUFBSSxHQUFHLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvRCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLEdBQUcsR0FB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QUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDdEQsS0FBSyxNQUFNO2dCQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDckQsS0FBSyxPQUFPO2dCQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDdkQsS0FBSyxPQUFPO2dCQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDdkQsS0FBSyxPQUFPO2dCQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDdkQsS0FBSyxNQUFNO2dCQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDbEUsS0FBSyxNQUFNO2dCQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDbEUsS0FBSyxNQUFNO2dCQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDbEUsT0FBTyxDQUFDLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkUsQ0FBQztJQUNMLENBQUM7SUFDRCxXQUFXLENBQUMsTUFBbUI7UUFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUM7SUFDL0IsQ0FBQztJQUNELE1BQU07UUFDRixJQUFHLENBQUMsSUFBSSxDQUFDLFNBQVM7WUFBRSxPQUFPO1FBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFD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LEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUTtnQkFDMUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU07Z0JBQzFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxHQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUMsR0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUztnQkFDM0ksR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsV0FBVztnQkFDL0UsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLE9BQU8sR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLFlBQVk7Z0JBQzlHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxjQUFjO2dCQUNoSCxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsT0FBTyxHQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxPQUFPLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLGVBQWU7WUFDbkosQ0FBQztZQUNELEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztZQUN0QyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7WUFDdEMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFDLE9BQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztZQUN4QyxHQUFHLENBQUMsQ0FB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QU0sRUFBRSxDQUFDLElBQUUsQ0FBQyxFQUFFLENBQUM7WUFDekMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUUsSUFBSSxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFFLElBQUksQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBRSxJQUFJLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELE1BQU0sQ0FBQyxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVU7UUFDckMsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBRSxDQUFDLEVBQUUsQ0FBQztZQUN6QyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBRSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBRSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBRSxDQUFDLENBQUM7WUFDakYsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUNELEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0s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RyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkgsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkgsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkgsSUFBSSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztJQUNqQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDekIsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLGFBQWEsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ2hDLElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzNDLElBQUcsR0FBRyxLQUFLLFNBQVM7WUFDaEIsT0FBTyxHQUFHLENBQUM7UUFDZixJQUFHLEtBQUssR0FBRyxLQUFLLEVBQUUsQ0FBQztZQUNmLElBQUcsS0FBSyxHQUFHLEtBQUssRUFBRSxDQUFDO2dCQUNmLFFBQVEsR0FBRyxLQUFLLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDM0IsS0FBSyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNwQixDQUFDO2lCQUFNLENBQUM7Z0JBQ0osUUFBUSxHQUFHLEtBQUssQ0FBQztnQkFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixLQUFLLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDckIsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLENBQUM7UUFDTCxDQUFDO2FBQU0sQ0FBQztZQUNKLElBQUcsS0FBSyxHQUFHLEtBQUssRUFBRSxDQUFDO2dCQUNmLFFBQVEsR0FBRyxLQUFLLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDM0IsS0FBSyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNwQixDQUFDO2lCQUFNLENBQUM7Z0JBQ0osUUFBUSxHQUFHLEtBQUssQ0FBQztnQkFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixLQUFLLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDckIsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUNELE9BQU8sU0FBUyxDQUFDO0FBQ3JCLENBQUM7QUFFRCxNQUFNLFVBQVUsaUJBQWlCLENBQzdCLE1BQVksRUFDWixTQUFlLEVBQ2YsTUFBYztJQUVkLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEMsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkQsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRCxJQUFJLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3pELElBQUksSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDckQsSUFBSSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUMxRCxJQUFJLEtBQUssR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3RELElBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDakQsSUFBRyxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUM7UUFDZCxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2IsTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsRUFBQyxRQUFRLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFDRCxJQUFHLEtBQUssR0FBRyxJQUFJO1FBQUUsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUM5QixJQUFJLEtBQUssR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzFELElBQUksS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FB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LEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdkIsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMzQixDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUM1QixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDdEIsSUFBSSxFQUFFLEdBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFDLENBQUMsQ0FBQztRQUNyQixRQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDeEIsS0FBSyxDQUFDO2dCQUFFLEVBQUUsR0FBQyxDQUFDLENBQUM7Z0JBQUMsRUFBRSxHQUFDLENBQUMsQ0FBQztnQkFBQyxNQUFNO1lBQzFCLEtBQUssQ0FBQztnQkFBRSxFQUFFLEdBQUMsQ0FBQyxDQUFDO2dCQUFDLEVBQUUsR0FBQyxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUMxQixLQUFLLENBQUM7Z0JBQUUsRUFBRSxHQUFDLENBQUMsQ0FBQztnQkFBQyxFQUFFLEdBQUMsQ0FBQyxDQUFDO2dCQUFDLE1BQU07WUFDMUIsS0FBSyxDQUFDO2dCQUFFLEVBQUUsR0FBQyxDQUFDLENBQUM7Z0JBQUMsRUFBRSxHQUFDLENBQUMsQ0FBQztnQkFBQyxNQUFNO1lBQzFCLEtBQUssQ0FBQztnQkFBRSxFQUFFLEdBQUMsQ0FBQyxDQUFDO2dCQUFDLEVBQUUsR0FBQyxDQUFDLENBQUM7Z0JBQUMsTUFBTTtZQUMxQjtnQkFBUyxFQUFFLEdBQUMsQ0FBQyxDQUFDO2dCQUFDLEVBQUUsR0FBQyxDQUFDLENBQUM7Z0JBQUMsTUFBTTtRQUMvQixDQUFDO1FBQ0QsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDckMsT0FBTyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQ0QsS0FBSztRQUNELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0MsTUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUN4QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixJQUFHLEtBQUssS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUNiLElBQUcsR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDO2dCQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFD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LENBQUM7U0FDVixDQUFDO0lBQ04sQ0FBQztJQUNELE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBWSxFQUFFLEVBQVk7UUFDdEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNwQixLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3BCLEdBQUcsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQ1gsRUFBRSxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFFO3NCQUN6QixFQUFFLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBRyxDQUFDLENBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBRyxDQUFDLENBQUU7c0JBQzNCLEVBQUUsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUNoQyxDQUFDO1lBQ04sQ0FBQztRQUNMLENBQUM7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbIi8vIGNvbXBpbGF0aW9uIG9mIGFsbCBvZiB0aGUgc2NyaXB0cyBpIG1hZGUgdGhhdCBpIHVzZSBmb3IgM2QgZ2FtZXNcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFTWF0aCB7XHJcbiAgICBzdGF0aWMgY2xhbXAobjogbnVtYmVyLGE6IG51bWJlcixiOiBudW1iZXIpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobixhKSxiKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBsZXJwKGE6IG51bWJlcixiOiBudW1iZXIsdDogbnVtYmVyKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIGErKGItYSkqdDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBwbW9kKHg6IG51bWJlcixhOiBudW1iZXIpIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gKCh4JWEpK2EpJWE7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgaXNDbG9zZShhOiBudW1iZXIsIGI6IG51bWJlciwgZTogbnVtYmVyID0gMWUtNikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFicyhhLWIpIDwgZTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBpc1plcm8odjogbnVtYmVyLCBlOiBudW1iZXIgPSAxZS02KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKHYpIDwgZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFZlYzMge1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgeTogbnVtYmVyO1xyXG4gICAgejogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IodjogVmVjMyB8IHt4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyfSk7XHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTtcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciB8IHt4Om51bWJlciwgeTpudW1iZXIsIHo6bnVtYmVyfSwgeT86IG51bWJlciwgej86IG51bWJlcikge1xyXG4gICAgICAgIGlmKHR5cGVvZiB4ID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHgueDtcclxuICAgICAgICAgICAgdGhpcy55ID0geC55O1xyXG4gICAgICAgICAgICB0aGlzLnogPSB4Lno7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICAgICAgdGhpcy55ID0geSE7XHJcbiAgICAgICAgICAgIHRoaXMueiA9IHohO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBTdGF0aWMgQ29uc3RydWN0b3JzXHJcbiAgICBzdGF0aWMgZmlsbChuOiBudW1iZXIpOiBWZWMzIHsgcmV0dXJuIG5ldyBWZWMzKG4sIG4sIG4pOyB9XHJcbiAgICBzdGF0aWMgemVybygpOiBWZWMzIHsgcmV0dXJuIFZlYzMuZmlsbCgwKTsgfVxyXG4gICAgc3RhdGljIG9uZSgpOiBWZWMzIHsgcmV0dXJuIFZlYzMuZmlsbCgxKTsgfVxyXG4gICAgc3RhdGljIHhBeGlzKCk6IFZlYzMgeyByZXR1cm4gbmV3IFZlYzMoMSwgMCwgMCk7IH1cclxuICAgIHN0YXRpYyB5QXhpcygpOiBWZWMzIHsgcmV0dXJuIG5ldyBWZWMzKDAsIDEsIDApOyB9XHJcbiAgICBzdGF0aWMgekF4aXMoKTogVmVjMyB7IHJldHVybiBuZXcgVmVjMygwLCAwLCAxKTsgfVxyXG4gICAgc3RhdGljIHJhbmRvbSgpOiBWZWMzIHtcclxuICAgICAgICBjb25zdCB6ID0gTWF0aC5yYW5kb20oKSAqIDIgLSAxO1xyXG4gICAgICAgIGNvbnN0IGEgPSBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XHJcbiAgICAgICAgY29uc3QgYiA9IE1hdGguc3FydChNYXRoLm1heCgwLCAxIC0geiAqIHopKTtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoYiAqIE1hdGguY29zKGEpLCBiICogTWF0aC5zaW4oYSksIHopO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJhbmRvbVJvdGF0aW9uKCk6IFZlYzMge1xyXG4gICAgICAgIGNvbnN0IHYgPSBWZWMzLnJhbmRvbSgpO1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh2LnBpdGNoKCksIHYueWF3KCksIE1hdGgucmFuZG9tKCkgKiAyICogTWF0aC5QSSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTWlzY2VsbGFuZW91c1xyXG4gICAgZ2V0KGk6IG51bWJlcik6IG51bWJlciB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgc3dpdGNoKGkpIHtcclxuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gdGhpcy54O1xyXG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiB0aGlzLnk7XHJcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIHRoaXMuejtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIHNldChpOiBudW1iZXIsIHY6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHN3aXRjaChpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDogdGhpcy54ID0gdjsgcmV0dXJuO1xyXG4gICAgICAgICAgICBjYXNlIDE6IHRoaXMueSA9IHY7IHJldHVybjtcclxuICAgICAgICAgICAgY2FzZSAyOiB0aGlzLnogPSB2OyByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2V0Qyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMueiA9IHo7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XHJcbiAgICAgICAgeWllbGQgdGhpcy54O1xyXG4gICAgICAgIHlpZWxkIHRoaXMueTtcclxuICAgICAgICB5aWVsZCB0aGlzLno7XHJcbiAgICB9XHJcbiAgICB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBgPCR7dGhpcy54LnRvRml4ZWQoMil9LCAke3RoaXMueS50b0ZpeGVkKDIpfSwgJHt0aGlzLnoudG9GaXhlZCgyKX0+YDtcclxuICAgIH1cclxuICAgIHRvQXJyYXkoKTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMueCwgdGhpcy55LCB0aGlzLnpdO1xyXG4gICAgfVxyXG4gICAgY2xvbmUoKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgZ2V0QXhpc0JpdCgpOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGF4ID0gTWF0aC5hYnModGhpcy54KTtcclxuICAgICAgICBjb25zdCBheSA9IE1hdGguYWJzKHRoaXMueSk7XHJcbiAgICAgICAgY29uc3QgYXogPSBNYXRoLmFicyh0aGlzLnopO1xyXG4gICAgICAgIGlmKGF4ID4gYXkpIHtcclxuICAgICAgICAgICAgaWYoYXggPiBheikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDBiMTAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDBiMDAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYoYXkgPiBheikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDBiMDEwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDBiMDAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENhbGN1bGF0aW9uc1xyXG4gICAgbGVuZ3RoKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLmRvdCh0aGlzKSk7XHJcbiAgICB9XHJcbiAgICBkb3Qob3RoZXI6IFZlYzMpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiBvdGhlci54ICsgdGhpcy55ICogb3RoZXIueSArIHRoaXMueiAqIG90aGVyLno7XHJcbiAgICB9XHJcbiAgICBkb3RDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiB4ICsgdGhpcy55ICogeSArIHRoaXMueiAqIHo7XHJcbiAgICB9XHJcbiAgICBjcm9zcyhvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLnkgKiBvdGhlci56IC0gdGhpcy56ICogb3RoZXIueSwgLSAodGhpcy54ICogb3RoZXIueiAtIHRoaXMueiAqIG90aGVyLngpLCB0aGlzLnggKiBvdGhlci55IC0gdGhpcy55ICogb3RoZXIueCk7XHJcbiAgICB9XHJcbiAgICBjcm9zc0MoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLnkgKiB6IC0gdGhpcy56ICogeSwgLSAodGhpcy54ICogeiAtIHRoaXMueiAqIHgpLCB0aGlzLnggKiB5IC0gdGhpcy55ICogeCk7XHJcbiAgICB9XHJcbiAgICBhbmdsZShvdGhlcjogVmVjMyk6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgYyA9IHRoaXMubGVuZ3RoKCkgKiBvdGhlci5sZW5ndGgoKTtcclxuICAgICAgICBpZihjID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICByZXR1cm4gTWF0aC5hY29zKEVNYXRoLmNsYW1wKHRoaXMuZG90KG90aGVyKSAvIGMsIC0xLCAxKSk7XHJcbiAgICB9XHJcbiAgICBzaWduZWRBbmdsZShvdGhlcjogVmVjMywgcmVmZXJlbmNlOiBWZWMzID0gVmVjMy55QXhpcygpKTogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBhbmdsZSA9IHRoaXMuYW5nbGUob3RoZXIpO1xyXG4gICAgICAgIGNvbnN0IG5vcm1hbCA9IHRoaXMuY3Jvc3Mob3RoZXIpLm5vcm1TZWxmKCk7XHJcbiAgICAgICAgaWYobm9ybWFsLmRvdChyZWZlcmVuY2Uubm9ybSgpKSA+IDApXHJcbiAgICAgICAgICAgIHJldHVybiAtYW5nbGU7XHJcbiAgICAgICAgcmV0dXJuIGFuZ2xlO1xyXG4gICAgfVxyXG4gICAgZGlzdChvdGhlcjogVmVjMyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViKG90aGVyKS5sZW5ndGgoKTtcclxuICAgIH1cclxuICAgIGRpc3RDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN1YkMoeCwgeSwgeikubGVuZ3RoKCk7XHJcbiAgICB9XHJcbiAgICBzdHJpY3RFcXVhbHMob3RoZXI6IFZlYzMpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ID09IG90aGVyLnggJiYgdGhpcy55ID09IG90aGVyLnkgJiYgdGhpcy56ID09IG90aGVyLno7XHJcbiAgICB9XHJcbiAgICBpc0Nsb3NlKG90aGVyOiBWZWMzLCBlID0gMWUtNik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5pc0Nsb3NlKHRoaXMueCwgb3RoZXIueCwgZSkgJiYgRU1hdGguaXNDbG9zZSh0aGlzLnksIG90aGVyLnksIGUpICYmIEVNYXRoLmlzQ2xvc2UodGhpcy56LCBvdGhlci56LCBlKTtcclxuICAgIH1cclxuICAgIGlzWmVybyhlID0gMWUtNik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBFTWF0aC5pc1plcm8odGhpcy54LCBlKSAmJiBFTWF0aC5pc1plcm8odGhpcy55LCBlKSAmJiBFTWF0aC5pc1plcm8odGhpcy56LCBlKTtcclxuICAgIH1cclxuICAgIHBpdGNoKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYXNpbih0aGlzLnkpO1xyXG4gICAgfVxyXG4gICAgeWF3KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIoLXRoaXMueCwgLXRoaXMueik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gT3BlcmF0aW9uc1xyXG4gICAgYWRkKG90aGVyOiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMueCArIG90aGVyLngsIHRoaXMueSArIG90aGVyLnksIHRoaXMueiArIG90aGVyLnopO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZihvdGhlcjogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCArPSBvdGhlci54O1xyXG4gICAgICAgIHRoaXMueSArPSBvdGhlci55O1xyXG4gICAgICAgIHRoaXMueiArPSBvdGhlci56O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMueCArIHgsIHRoaXMueSArIHksIHRoaXMueiArIHopO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCArPSB4O1xyXG4gICAgICAgIHRoaXMueSArPSB5O1xyXG4gICAgICAgIHRoaXMueiArPSB6O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkRihuOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy54ICsgbiwgdGhpcy55ICsgbiwgdGhpcy56ICsgbik7XHJcbiAgICB9XHJcbiAgICBhZGRTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKz0gbjtcclxuICAgICAgICB0aGlzLnkgKz0gbjtcclxuICAgICAgICB0aGlzLnogKz0gbjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZChvdGhlcjogVmVjMywgczogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5hZGRTY2FsZWRTZWxmKG90aGVyLCBzKTtcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZFNlbGYob3RoZXI6IFZlYzMsIHM6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCArPSBvdGhlci54ICogcztcclxuICAgICAgICB0aGlzLnkgKz0gb3RoZXIueSAqIHM7XHJcbiAgICAgICAgdGhpcy56ICs9IG90aGVyLnogKiBzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBzOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmFkZFNjYWxlZFNlbGZDKHgsIHksIHosIHMpO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgczogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICs9IHggKiBzO1xyXG4gICAgICAgIHRoaXMueSArPSB5ICogcztcclxuICAgICAgICB0aGlzLnogKz0geiAqIHM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWIob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy54IC0gb3RoZXIueCwgdGhpcy55IC0gb3RoZXIueSwgdGhpcy56IC0gb3RoZXIueik7XHJcbiAgICB9XHJcbiAgICBzdWJTZWxmKG90aGVyOiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54IC09IG90aGVyLng7XHJcbiAgICAgICAgdGhpcy55IC09IG90aGVyLnk7XHJcbiAgICAgICAgdGhpcy56IC09IG90aGVyLno7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWJDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy54IC0geCwgdGhpcy55IC0geSwgdGhpcy56IC0geik7XHJcbiAgICB9XHJcbiAgICBzdWJTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54IC09IHg7XHJcbiAgICAgICAgdGhpcy55IC09IHk7XHJcbiAgICAgICAgdGhpcy56IC09IHo7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWJGKG46IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLnggLSBuLCB0aGlzLnkgLSBuLCB0aGlzLnogLSBuKTtcclxuICAgIH1cclxuICAgIHN1YlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAtPSBuO1xyXG4gICAgICAgIHRoaXMueSAtPSBuO1xyXG4gICAgICAgIHRoaXMueiAtPSBuO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcnN1YihvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhvdGhlci54IC0gdGhpcy54LCBvdGhlci55IC0gdGhpcy55LCBvdGhlci56IC0gdGhpcy56KTtcclxuICAgIH1cclxuICAgIHJzdWJTZWxmKG90aGVyOiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0gb3RoZXIueCAtIHRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSBvdGhlci55IC0gdGhpcy55O1xyXG4gICAgICAgIHRoaXMueiA9IG90aGVyLnogLSB0aGlzLno7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByc3ViQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHggLSB0aGlzLngsIHkgLSB0aGlzLnksIHogLSB0aGlzLnopO1xyXG4gICAgfVxyXG4gICAgcnN1YlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSB4IC0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMueSA9IHkgLSB0aGlzLnk7XHJcbiAgICAgICAgdGhpcy56ID0geiAtIHRoaXMuejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJzdWJGKG46IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhuIC0gdGhpcy54LCBuIC0gdGhpcy55LCBuIC0gdGhpcy56KTtcclxuICAgIH1cclxuICAgIHJzdWJTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSBuIC0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMueSA9IG4gLSB0aGlzLnk7XHJcbiAgICAgICAgdGhpcy56ID0gbiAtIHRoaXMuejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG11bChvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLnggKiBvdGhlci54LCB0aGlzLnkgKiBvdGhlci55LCB0aGlzLnogKiBvdGhlci56KTtcclxuICAgIH1cclxuICAgIG11bFNlbGYob3RoZXI6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKj0gb3RoZXIueDtcclxuICAgICAgICB0aGlzLnkgKj0gb3RoZXIueTtcclxuICAgICAgICB0aGlzLnogKj0gb3RoZXIuejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG11bEMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLnggKiB4LCB0aGlzLnkgKiB5LCB0aGlzLnogKiB6KTtcclxuICAgIH1cclxuICAgIG11bFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKj0geDtcclxuICAgICAgICB0aGlzLnkgKj0geTtcclxuICAgICAgICB0aGlzLnogKj0gejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG11bEYobjogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHRoaXMueCAqIG4sIHRoaXMueSAqIG4sIHRoaXMueiAqIG4pO1xyXG4gICAgfVxyXG4gICAgbXVsU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICo9IG47XHJcbiAgICAgICAgdGhpcy55ICo9IG47XHJcbiAgICAgICAgdGhpcy56ICo9IG47XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBkaXYob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy54IC8gb3RoZXIueCwgdGhpcy55IC8gb3RoZXIueSwgdGhpcy56IC8gb3RoZXIueik7XHJcbiAgICB9XHJcbiAgICBkaXZTZWxmKG90aGVyOiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54IC89IG90aGVyLng7XHJcbiAgICAgICAgdGhpcy55IC89IG90aGVyLnk7XHJcbiAgICAgICAgdGhpcy56IC89IG90aGVyLno7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBkaXZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy54IC8geCwgdGhpcy55IC8geSwgdGhpcy56IC8geik7XHJcbiAgICB9XHJcbiAgICBkaXZTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54IC89IHg7XHJcbiAgICAgICAgdGhpcy55IC89IHk7XHJcbiAgICAgICAgdGhpcy56IC89IHo7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBkaXZGKG46IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLnggLyBuLCB0aGlzLnkgLyBuLCB0aGlzLnogLyBuKTtcclxuICAgIH1cclxuICAgIGRpdlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAvPSBuO1xyXG4gICAgICAgIHRoaXMueSAvPSBuO1xyXG4gICAgICAgIHRoaXMueiAvPSBuO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmRpdihvdGhlcjogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhvdGhlci54IC8gdGhpcy54LCBvdGhlci55IC8gdGhpcy55LCBvdGhlci56IC8gdGhpcy56KTtcclxuICAgIH1cclxuICAgIHJkaXZTZWxmKG90aGVyOiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0gb3RoZXIueCAvIHRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSBvdGhlci55IC8gdGhpcy55O1xyXG4gICAgICAgIHRoaXMueiA9IG90aGVyLnogLyB0aGlzLno7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByZGl2Qyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHggLyB0aGlzLngsIHkgLyB0aGlzLnksIHogLyB0aGlzLnopO1xyXG4gICAgfVxyXG4gICAgcmRpdlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSB4IC8gdGhpcy54O1xyXG4gICAgICAgIHRoaXMueSA9IHkgLyB0aGlzLnk7XHJcbiAgICAgICAgdGhpcy56ID0geiAvIHRoaXMuejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJkaXZGKG46IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhuIC8gdGhpcy54LCBuIC8gdGhpcy55LCBuIC8gdGhpcy56KTtcclxuICAgIH1cclxuICAgIHJkaXZTZWxmRihuOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSBuIC8gdGhpcy54O1xyXG4gICAgICAgIHRoaXMueSA9IG4gLyB0aGlzLnk7XHJcbiAgICAgICAgdGhpcy56ID0gbiAvIHRoaXMuejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG5lZygpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoLXRoaXMueCwgLXRoaXMueSwgLXRoaXMueik7XHJcbiAgICB9XHJcbiAgICBuZWdTZWxmKCk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCA9IC10aGlzLng7XHJcbiAgICAgICAgdGhpcy55ID0gLXRoaXMueTtcclxuICAgICAgICB0aGlzLnogPSAtdGhpcy56O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbGVycChvdGhlcjogVmVjMywgdDogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sZXJwU2VsZihvdGhlciwgdCk7XHJcbiAgICB9XHJcbiAgICBsZXJwU2VsZihvdGhlcjogVmVjMywgdDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICs9IChvdGhlci54IC0gdGhpcy54KSAqIHQ7XHJcbiAgICAgICAgdGhpcy55ICs9IChvdGhlci55IC0gdGhpcy55KSAqIHQ7XHJcbiAgICAgICAgdGhpcy56ICs9IChvdGhlci56IC0gdGhpcy56KSAqIHQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBsZXJwQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB0OiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxlcnBTZWxmQyh4LCB5LCB6LCB0KTtcclxuICAgIH1cclxuICAgIGxlcnBTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKz0gKHggLSB0aGlzLngpICogdDtcclxuICAgICAgICB0aGlzLnkgKz0gKHkgLSB0aGlzLnkpICogdDtcclxuICAgICAgICB0aGlzLnogKz0gKHogLSB0aGlzLnopICogdDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIG5vcm0oKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5ub3JtU2VsZigpO1xyXG4gICAgfVxyXG4gICAgbm9ybVNlbGYoKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgbWFnID0gdGhpcy5sZW5ndGgoKTtcclxuICAgICAgICBpZihtYWcgPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpdlNlbGZDKG1hZywgbWFnLCBtYWcpO1xyXG4gICAgfVxyXG4gICAgcmVzY2FsZShtYWc6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucmVzY2FsZVNlbGYobWFnKTtcclxuICAgIH1cclxuICAgIHJlc2NhbGVTZWxmKG1hZzogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9ybVNlbGYoKS5tdWxTZWxmQyhtYWcsIG1hZywgbWFnKTtcclxuICAgIH1cclxuICAgIGxvb2sob3RoZXI6IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxvb2tTZWxmKG90aGVyKTtcclxuICAgIH1cclxuICAgIGxvb2tTZWxmKG90aGVyOiBWZWMzKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucnN1YlNlbGYob3RoZXIpLm5vcm1TZWxmKCk7XHJcbiAgICB9XHJcbiAgICBjbGFtcExlbmd0aChhOiBudW1iZXIsIGI6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuY2xhbXBMZW5ndGhTZWxmKGEsIGIpO1xyXG4gICAgfVxyXG4gICAgY2xhbXBMZW5ndGhTZWxmKGE6IG51bWJlciwgYjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzY2FsZVNlbGYoRU1hdGguY2xhbXAodGhpcy5sZW5ndGgoKSwgYSwgYikpO1xyXG4gICAgfVxyXG4gICAgZmxhdCgpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmZsYXRTZWxmKCk7XHJcbiAgICB9XHJcbiAgICBmbGF0U2VsZigpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnkgPSAwO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZmxhdE5vcm0oKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5mbGF0Tm9ybVNlbGYoKTtcclxuICAgIH1cclxuICAgIGZsYXROb3JtU2VsZigpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mbGF0U2VsZigpLm5vcm1TZWxmKCk7XHJcbiAgICB9XHJcbiAgICBzZXREb3Qob3RoZXI6IFZlYzMsIHRhcmdldDogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5zZXREb3RTZWxmKG90aGVyLCB0YXJnZXQpO1xyXG4gICAgfVxyXG4gICAgc2V0RG90U2VsZihvdGhlcjogVmVjMywgdGFyZ2V0OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBkID0gb3RoZXIuZG90KG90aGVyKTtcclxuICAgICAgICBpZihkID09PSAwKSByZXR1cm4gdGhpcztcclxuICAgICAgICByZXR1cm4gdGhpcy5hZGRTY2FsZWRTZWxmKG90aGVyLCAodGFyZ2V0IC0gdGhpcy5kb3Qob3RoZXIpKSAvIGQpO1xyXG4gICAgfVxyXG4gICAgc2V0RG90Qyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuc2V0RG90U2VsZkMoeCwgeSwgeiwgdGFyZ2V0KTtcclxuICAgIH1cclxuICAgIHNldERvdFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHRhcmdldDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgZCA9IHgqeCArIHkqeSArIHoqejtcclxuICAgICAgICBpZihkID09PSAwKSByZXR1cm4gdGhpcztcclxuICAgICAgICByZXR1cm4gdGhpcy5hZGRTY2FsZWRTZWxmQyh4LCB5LCB6LCAodGFyZ2V0IC0gdGhpcy5kb3RDKHgsIHksIHopKSAvIGQpO1xyXG4gICAgfVxyXG4gICAgbWFwKG1ldGhvZDogKHg6IG51bWJlciwgaTogbnVtYmVyKSA9PiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLm1hcFNlbGYobWV0aG9kKTtcclxuICAgIH1cclxuICAgIG1hcFNlbGYobWV0aG9kOiAoeDogbnVtYmVyLCBpOiBudW1iZXIpID0+IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCA9IG1ldGhvZCh0aGlzLngsIDApO1xyXG4gICAgICAgIHRoaXMueSA9IG1ldGhvZCh0aGlzLnksIDEpO1xyXG4gICAgICAgIHRoaXMueiA9IG1ldGhvZCh0aGlzLnosIDIpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm90WChhOiBudW1iZXIpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdFhTZWxmKGEpO1xyXG4gICAgfVxyXG4gICAgcm90WFNlbGYoYTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGEpLCBjID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3QgeSA9IHRoaXMueSAqIGMgLSB0aGlzLnogKiBzO1xyXG4gICAgICAgIHRoaXMueiA9IHRoaXMueSAqIHMgKyB0aGlzLnogKiBjO1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByb3RZKGE6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90WVNlbGYoYSk7XHJcbiAgICB9XHJcbiAgICByb3RZU2VsZihhOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSksIGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCB6ID0gdGhpcy56ICogYyAtIHRoaXMueCAqIHM7XHJcbiAgICAgICAgdGhpcy54ID0gdGhpcy54ICogYyArIHRoaXMueiAqIHM7XHJcbiAgICAgICAgdGhpcy56ID0gejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdFooYTogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RaU2VsZihhKTtcclxuICAgIH1cclxuICAgIHJvdFpTZWxmKGE6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhKSwgYyA9IE1hdGguY29zKGEpO1xyXG4gICAgICAgIGNvbnN0IHggPSB0aGlzLnggKiBjIC0gdGhpcy55ICogcztcclxuICAgICAgICB0aGlzLnkgPSB0aGlzLnggKiBzICsgdGhpcy55ICogYztcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm90QXhpcyhheGlzOiBWZWMzLCBhbmdsZTogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RBeGlzU2VsZihheGlzLCBhbmdsZSk7XHJcbiAgICB9XHJcbiAgICByb3RBeGlzU2VsZihheGlzOiBWZWMzLCBhbmdsZTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgYXhpcyA9IGF4aXMubm9ybSgpO1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZSksIGMgPSBNYXRoLmNvcyhhbmdsZSk7XHJcbiAgICAgICAgY29uc3QgY3Jvc3MgPSBheGlzLmNyb3NzKHRoaXMpO1xyXG4gICAgICAgIGNvbnN0IGRvdCA9IGF4aXMuZG90KHRoaXMpO1xyXG4gICAgICAgIGxldCB4ID0gdGhpcy54LCB5ID0gdGhpcy55LCB6ID0gdGhpcy56O1xyXG4gICAgICAgIHRoaXMueCA9IHggKiBjICsgY3Jvc3MueCAqIHMgKyBheGlzLnggKiBkb3QgKiAoMSAtIGMpO1xyXG4gICAgICAgIHRoaXMueSA9IHkgKiBjICsgY3Jvc3MueSAqIHMgKyBheGlzLnkgKiBkb3QgKiAoMSAtIGMpO1xyXG4gICAgICAgIHRoaXMueiA9IHogKiBjICsgY3Jvc3MueiAqIHMgKyBheGlzLnogKiBkb3QgKiAoMSAtIGMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm90WFlaKHJvdDogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90WFlaU2VsZihyb3QpO1xyXG4gICAgfVxyXG4gICAgcm90WFlaU2VsZihyb3Q6IFZlYzMpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3RYU2VsZihyb3QueCkucm90WVNlbGYocm90LnkpLnJvdFpTZWxmKHJvdC56KTtcclxuICAgIH1cclxuICAgIHJvdFhZWkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucm90WFlaU2VsZkMoeCwgeSwgeik7XHJcbiAgICB9XHJcbiAgICByb3RYWVpTZWxmQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm90WFNlbGYoeCkucm90WVNlbGYoeSkucm90WlNlbGYoeik7XHJcbiAgICB9XHJcbiAgICByb3RaWVgocm90OiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RaWVhTZWxmKHJvdCk7XHJcbiAgICB9XHJcbiAgICByb3RaWVhTZWxmKHJvdDogVmVjMyk6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvdFpTZWxmKHJvdC56KS5yb3RZU2VsZihyb3QueSkucm90WFNlbGYocm90LngpO1xyXG4gICAgfVxyXG4gICAgcm90WllYQyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5yb3RaWVhTZWxmQyh4LCB5LCB6KTtcclxuICAgIH1cclxuICAgIHJvdFpZWFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3RaU2VsZih6KS5yb3RZU2VsZih5KS5yb3RYU2VsZih4KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFZlYzIge1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgeTogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IodjogVmVjMiB8IHt4OiBudW1iZXIsIHk6IG51bWJlcn0pO1xyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpO1xyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyIHwge3g6bnVtYmVyLCB5Om51bWJlcn0sIHk/OiBudW1iZXIpIHtcclxuICAgICAgICBpZih0eXBlb2YgeCA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB4Lng7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHgueTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSB5ITtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU3RhdGljIENvbnN0cnVjdG9yc1xyXG4gICAgc3RhdGljIGZpbGwobjogbnVtYmVyKTogVmVjMiB7IHJldHVybiBuZXcgVmVjMihuLCBuKTsgfVxyXG4gICAgc3RhdGljIHplcm8oKTogVmVjMiB7IHJldHVybiBWZWMyLmZpbGwoMCk7IH1cclxuICAgIHN0YXRpYyBvbmUoKTogVmVjMiB7IHJldHVybiBWZWMyLmZpbGwoMSk7IH1cclxuICAgIHN0YXRpYyB4QXhpcygpOiBWZWMyIHsgcmV0dXJuIG5ldyBWZWMyKDEsIDApOyB9XHJcbiAgICBzdGF0aWMgeUF4aXMoKTogVmVjMiB7IHJldHVybiBuZXcgVmVjMigwLCAxKTsgfVxyXG4gICAgc3RhdGljIHJhbmRvbSgpOiBWZWMyIHtcclxuICAgICAgICBjb25zdCBhID0gTWF0aC5yYW5kb20oKSAqIDIgKiBNYXRoLlBJO1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMihNYXRoLmNvcyhhKSwgTWF0aC5zaW4oYSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1pc2NlbGxhbmVvdXNcclxuICAgIGdldChpOiBudW1iZXIpOiBudW1iZXIgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIHN3aXRjaChpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIHRoaXMueDtcclxuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gdGhpcy55O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgc2V0KGk6IG51bWJlciwgdjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgc3dpdGNoKGkpIHtcclxuICAgICAgICAgICAgY2FzZSAwOiB0aGlzLnggPSB2OyByZXR1cm47XHJcbiAgICAgICAgICAgIGNhc2UgMTogdGhpcy55ID0gdjsgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNldEMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XHJcbiAgICAgICAgeWllbGQgdGhpcy54O1xyXG4gICAgICAgIHlpZWxkIHRoaXMueTtcclxuICAgIH1cclxuICAgIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGA8JHt0aGlzLngudG9GaXhlZCgyKX0sICR7dGhpcy55LnRvRml4ZWQoMil9PmA7XHJcbiAgICB9XHJcbiAgICB0b0FycmF5KCk6IFtudW1iZXIsIG51bWJlcl0ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy54LCB0aGlzLnldO1xyXG4gICAgfVxyXG4gICAgY2xvbmUoKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENhbGN1bGF0aW9uc1xyXG4gICAgbGVuZ3RoKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLmRvdCh0aGlzKSk7XHJcbiAgICB9XHJcbiAgICBkb3Qob3RoZXI6IFZlYzIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiBvdGhlci54ICsgdGhpcy55ICogb3RoZXIueTtcclxuICAgIH1cclxuICAgIGRvdEMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiB4ICsgdGhpcy55ICogeTtcclxuICAgIH1cclxuICAgIGFuZ2xlKG90aGVyOiBWZWMyKTogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBjID0gdGhpcy5sZW5ndGgoKSAqIG90aGVyLmxlbmd0aCgpO1xyXG4gICAgICAgIGlmKGMgPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoRU1hdGguY2xhbXAodGhpcy5kb3Qob3RoZXIpIC8gYywgLTEsIDEpKTtcclxuICAgIH1cclxuICAgIHNpZ25lZEFuZ2xlKG90aGVyOiBWZWMyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnggKiBvdGhlci55IC0gdGhpcy55ICogb3RoZXIueCwgdGhpcy5kb3Qob3RoZXIpKTtcclxuICAgIH1cclxuICAgIGRpc3Qob3RoZXI6IFZlYzIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN1YihvdGhlcikubGVuZ3RoKCk7XHJcbiAgICB9XHJcbiAgICBkaXN0Qyh4OiBudW1iZXIsIHk6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViQyh4LCB5KS5sZW5ndGgoKTtcclxuICAgIH1cclxuICAgIHN0cmljdEVxdWFscyhvdGhlcjogVmVjMik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggPT0gb3RoZXIueCAmJiB0aGlzLnkgPT0gb3RoZXIueTtcclxuICAgIH1cclxuICAgIGlzQ2xvc2Uob3RoZXI6IFZlYzIsIGUgPSAxZS02KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIEVNYXRoLmlzQ2xvc2UodGhpcy54LCBvdGhlci54LCBlKSAmJiBFTWF0aC5pc0Nsb3NlKHRoaXMueSwgb3RoZXIueSwgZSk7XHJcbiAgICB9XHJcbiAgICBpc1plcm8oZSA9IDFlLTYpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gRU1hdGguaXNaZXJvKHRoaXMueCwgZSkgJiYgRU1hdGguaXNaZXJvKHRoaXMueSwgZSk7XHJcbiAgICB9XHJcbiAgICB0aGV0YSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKHRoaXMueSwgdGhpcy54KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBPcGVyYXRpb25zXHJcbiAgICBhZGQob3RoZXI6IFZlYzIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy54ICsgb3RoZXIueCwgdGhpcy55ICsgb3RoZXIueSk7XHJcbiAgICB9XHJcbiAgICBhZGRTZWxmKG90aGVyOiBWZWMyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICs9IG90aGVyLng7XHJcbiAgICAgICAgdGhpcy55ICs9IG90aGVyLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRDKHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCArIHgsIHRoaXMueSArIHkpO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKz0geDtcclxuICAgICAgICB0aGlzLnkgKz0geTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGFkZEYobjogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCArIG4sIHRoaXMueSArIG4pO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICs9IG47XHJcbiAgICAgICAgdGhpcy55ICs9IG47XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWQob3RoZXI6IFZlYzIsIHM6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuYWRkU2NhbGVkU2VsZihvdGhlciwgcyk7XHJcbiAgICB9XHJcbiAgICBhZGRTY2FsZWRTZWxmKG90aGVyOiBWZWMyLCBzOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKz0gb3RoZXIueCAqIHM7XHJcbiAgICAgICAgdGhpcy55ICs9IG90aGVyLnkgKiBzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgYWRkU2NhbGVkQyh4OiBudW1iZXIsIHk6IG51bWJlciwgczogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5hZGRTY2FsZWRTZWxmQyh4LCB5LCBzKTtcclxuICAgIH1cclxuICAgIGFkZFNjYWxlZFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCBzOiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggKz0geCAqIHM7XHJcbiAgICAgICAgdGhpcy55ICs9IHkgKiBzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3ViKG90aGVyOiBWZWMyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCAtIG90aGVyLngsIHRoaXMueSAtIG90aGVyLnkpO1xyXG4gICAgfVxyXG4gICAgc3ViU2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAtPSBvdGhlci54O1xyXG4gICAgICAgIHRoaXMueSAtPSBvdGhlci55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3ViQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggLSB4LCB0aGlzLnkgLSB5KTtcclxuICAgIH1cclxuICAgIHN1YlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54IC09IHg7XHJcbiAgICAgICAgdGhpcy55IC09IHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdWJGKG46IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggLSBuLCB0aGlzLnkgLSBuKTtcclxuICAgIH1cclxuICAgIHN1YlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAtPSBuO1xyXG4gICAgICAgIHRoaXMueSAtPSBuO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcnN1YihvdGhlcjogVmVjMik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMihvdGhlci54IC0gdGhpcy54LCBvdGhlci55IC0gdGhpcy55KTtcclxuICAgIH1cclxuICAgIHJzdWJTZWxmKG90aGVyOiBWZWMyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0gb3RoZXIueCAtIHRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSBvdGhlci55IC0gdGhpcy55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcnN1YkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoeCAtIHRoaXMueCwgeSAtIHRoaXMueSk7XHJcbiAgICB9XHJcbiAgICByc3ViU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSB4IC0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMueSA9IHkgLSB0aGlzLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByc3ViRihuOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIobiAtIHRoaXMueCwgbiAtIHRoaXMueSk7XHJcbiAgICB9XHJcbiAgICByc3ViU2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0gbiAtIHRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSBuIC0gdGhpcy55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbXVsKG90aGVyOiBWZWMyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCAqIG90aGVyLngsIHRoaXMueSAqIG90aGVyLnkpO1xyXG4gICAgfVxyXG4gICAgbXVsU2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAqPSBvdGhlci54O1xyXG4gICAgICAgIHRoaXMueSAqPSBvdGhlci55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbXVsQyh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggKiB4LCB0aGlzLnkgKiB5KTtcclxuICAgIH1cclxuICAgIG11bFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICo9IHg7XHJcbiAgICAgICAgdGhpcy55ICo9IHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBtdWxGKG46IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggKiBuLCB0aGlzLnkgKiBuKTtcclxuICAgIH1cclxuICAgIG11bFNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAqPSBuO1xyXG4gICAgICAgIHRoaXMueSAqPSBuO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZGl2KG90aGVyOiBWZWMyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCAvIG90aGVyLngsIHRoaXMueSAvIG90aGVyLnkpO1xyXG4gICAgfVxyXG4gICAgZGl2U2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAvPSBvdGhlci54O1xyXG4gICAgICAgIHRoaXMueSAvPSBvdGhlci55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgZGl2Qyh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggLyB4LCB0aGlzLnkgLyB5KTtcclxuICAgIH1cclxuICAgIGRpdlNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54IC89IHg7XHJcbiAgICAgICAgdGhpcy55IC89IHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBkaXZGKG46IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggLyBuLCB0aGlzLnkgLyBuKTtcclxuICAgIH1cclxuICAgIGRpdlNlbGZGKG46IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCAvPSBuO1xyXG4gICAgICAgIHRoaXMueSAvPSBuO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmRpdihvdGhlcjogVmVjMik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMihvdGhlci54IC8gdGhpcy54LCBvdGhlci55IC8gdGhpcy55KTtcclxuICAgIH1cclxuICAgIHJkaXZTZWxmKG90aGVyOiBWZWMyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0gb3RoZXIueCAvIHRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSBvdGhlci55IC8gdGhpcy55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmRpdkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIoeCAvIHRoaXMueCwgeSAvIHRoaXMueSk7XHJcbiAgICB9XHJcbiAgICByZGl2U2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSB4IC8gdGhpcy54O1xyXG4gICAgICAgIHRoaXMueSA9IHkgLyB0aGlzLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByZGl2RihuOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIobiAvIHRoaXMueCwgbiAvIHRoaXMueSk7XHJcbiAgICB9XHJcbiAgICByZGl2U2VsZkYobjogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0gbiAvIHRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSBuIC8gdGhpcy55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbmVnKCk6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMigtdGhpcy54LCAtdGhpcy55KTtcclxuICAgIH1cclxuICAgIG5lZ1NlbGYoKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ID0gLXRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSAtdGhpcy55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbGVycChvdGhlcjogVmVjMiwgdDogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sZXJwU2VsZihvdGhlciwgdCk7XHJcbiAgICB9XHJcbiAgICBsZXJwU2VsZihvdGhlcjogVmVjMiwgdDogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy54ICs9IChvdGhlci54IC0gdGhpcy54KSAqIHQ7XHJcbiAgICAgICAgdGhpcy55ICs9IChvdGhlci55IC0gdGhpcy55KSAqIHQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBsZXJwQyh4OiBudW1iZXIsIHk6IG51bWJlciwgdDogbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sZXJwU2VsZkMoeCwgeSwgdCk7XHJcbiAgICB9XHJcbiAgICBsZXJwU2VsZkMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMueCArPSAoeCAtIHRoaXMueCkgKiB0O1xyXG4gICAgICAgIHRoaXMueSArPSAoeSAtIHRoaXMueSkgKiB0O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgbm9ybSgpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLm5vcm1TZWxmKCk7XHJcbiAgICB9XHJcbiAgICBub3JtU2VsZigpOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBtYWcgPSB0aGlzLmxlbmd0aCgpO1xyXG4gICAgICAgIGlmKG1hZyA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2U2VsZkMobWFnLCBtYWcpO1xyXG4gICAgfVxyXG4gICAgcmVzY2FsZShtYWc6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkucmVzY2FsZVNlbGYobWFnKTtcclxuICAgIH1cclxuICAgIHJlc2NhbGVTZWxmKG1hZzogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9ybVNlbGYoKS5tdWxTZWxmQyhtYWcsIG1hZyk7XHJcbiAgICB9XHJcbiAgICBsb29rKG90aGVyOiBWZWMyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sb29rU2VsZihvdGhlcik7XHJcbiAgICB9XHJcbiAgICBsb29rU2VsZihvdGhlcjogVmVjMik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJzdWJTZWxmKG90aGVyKS5ub3JtU2VsZigpO1xyXG4gICAgfVxyXG4gICAgY2xhbXBMZW5ndGgoYTogbnVtYmVyLCBiOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmNsYW1wTGVuZ3RoU2VsZihhLCBiKTtcclxuICAgIH1cclxuICAgIGNsYW1wTGVuZ3RoU2VsZihhOiBudW1iZXIsIGI6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc2NhbGVTZWxmKEVNYXRoLmNsYW1wKHRoaXMubGVuZ3RoKCksIGEsIGIpKTtcclxuICAgIH1cclxuICAgIHNldERvdChvdGhlcjogVmVjMiwgdGFyZ2V0OiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnNldERvdFNlbGYob3RoZXIsIHRhcmdldCk7XHJcbiAgICB9XHJcbiAgICBzZXREb3RTZWxmKG90aGVyOiBWZWMyLCB0YXJnZXQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IGQgPSBvdGhlci5kb3Qob3RoZXIpO1xyXG4gICAgICAgIGlmKGQgPT09IDApIHJldHVybiB0aGlzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNjYWxlZFNlbGYob3RoZXIsICh0YXJnZXQgLSB0aGlzLmRvdChvdGhlcikpIC8gZCk7XHJcbiAgICB9XHJcbiAgICBzZXREb3RDKHg6IG51bWJlciwgeTogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcik6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkuc2V0RG90U2VsZkMoeCwgeSwgdGFyZ2V0KTtcclxuICAgIH1cclxuICAgIHNldERvdFNlbGZDKHg6IG51bWJlciwgeTogbnVtYmVyLCB0YXJnZXQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGNvbnN0IGQgPSB4KnggKyB5Knk7XHJcbiAgICAgICAgaWYoZCA9PT0gMCkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkU2NhbGVkU2VsZkMoeCwgeSwgKHRhcmdldCAtIHRoaXMuZG90Qyh4LCB5KSkgLyBkKTtcclxuICAgIH1cclxuICAgIG1hcChtZXRob2Q6ICh4OiBudW1iZXIsIGk6IG51bWJlcikgPT4gbnVtYmVyKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5tYXBTZWxmKG1ldGhvZCk7XHJcbiAgICB9XHJcbiAgICBtYXBTZWxmKG1ldGhvZDogKHg6IG51bWJlciwgaTogbnVtYmVyKSA9PiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnggPSBtZXRob2QodGhpcy54LCAwKTtcclxuICAgICAgICB0aGlzLnkgPSBtZXRob2QodGhpcy55LCAxKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdGF0ZShhOiBudW1iZXIpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnJvdGF0ZVNlbGYoYSk7XHJcbiAgICB9XHJcbiAgICByb3RhdGVTZWxmKGE6IG51bWJlcikgOiB0aGlzIHtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSksIGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCB4ID0gdGhpcy54LCB5ID0gdGhpcy55O1xyXG4gICAgICAgIHRoaXMueCA9IHggKiBjIC0geSAqIHM7XHJcbiAgICAgICAgdGhpcy55ID0geCAqIHMgKyB5ICogYztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vIENvbHVtbi1tYWpvciA0eDQgbWF0cml4XHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNYXQ0IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuICAgIFxyXG4gICAgc3RhdGljIG5ldygpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAxLCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAxLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAxLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdHJhbnNsYXRlKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAxLCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAxLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAxLCAwLFxyXG4gICAgICAgICAgICB4LCB5LCB6LCAxLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgc2NhbGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHgsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIHksIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIHosIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDAsIDEsXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyByb3RhdGVYKGE6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4oYSk7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgMSwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgYywgcywgMCxcclxuICAgICAgICAgICAgMCwgLXMsIGMsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDAsIDFcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJvdGF0ZVkoYTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKGEpO1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhKTtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBjLCAwLCAtcywgMCxcclxuICAgICAgICAgICAgMCwgMSwgMCwgMCxcclxuICAgICAgICAgICAgcywgMCwgYywgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcm90YXRlWihhOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGEpO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIGMsIHMsIDAsIDAsXHJcbiAgICAgICAgICAgIC1zLCBjLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAxLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBwZXJzcGVjdGl2ZShmb3ZZOiBudW1iZXIsIGFzcGVjdDogbnVtYmVyLCBuZWFyOiBudW1iZXIgPSAxLCBmYXI6IG51bWJlciA9IDEwMDApIHtcclxuICAgICAgICBjb25zdCBmID0gMSAvIE1hdGgudGFuKGZvdlkgLyAyKTtcclxuICAgICAgICBjb25zdCBuZiA9IDEgLyAobmVhciAtIGZhcik7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgZi9hc3BlY3QsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIGYsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIChmYXIgKyBuZWFyKSAqIG5mLCAtMSxcclxuICAgICAgICAgICAgMCwgMCwgKDIgKiBmYXIgKiBuZWFyKSAqIG5mLCAwXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBtdWx0aXBseShtMTogbnVtYmVyW10sIG0yOiBudW1iZXJbXSkge1xyXG4gICAgICAgIGNvbnN0IG91dCA9IE1hdDQubmV3KCk7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8NDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaj0wOyBqPDQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgb3V0W2kqNCArIGpdID0gKFxyXG4gICAgICAgICAgICAgICAgICAgIG0xWzAqNCArIGpdISAqIG0yW2kqNCArIDBdIVxyXG4gICAgICAgICAgICAgICAgICAgICsgbTFbMSo0ICsgal0hICogbTJbaSo0ICsgMV0hXHJcbiAgICAgICAgICAgICAgICAgICAgKyBtMVsyKjQgKyBqXSEgKiBtMltpKjQgKyAyXSFcclxuICAgICAgICAgICAgICAgICAgICArIG0xWzMqNCArIGpdISAqIG0yW2kqNCArIDNdIVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbmNvbnN0IGdyYWRpZW50czJEOiBWZWMyW10gPSBbXTtcclxuZm9yKGxldCBpPTA7aTwxMjtpKyspIHtcclxuICAgIGNvbnN0IGFuZ2xlID0gMiAqIE1hdGguUEkgKiBpLzEyO1xyXG4gICAgZ3JhZGllbnRzMkQucHVzaChuZXcgVmVjMihNYXRoLmNvcyhhbmdsZSksIE1hdGguc2luKGFuZ2xlKSkpO1xyXG59XHJcblxyXG5jb25zdCBncmFkaWVudHMzRDogVmVjM1tdID0gW107XHJcbmZvcihsZXQgaT0wO2k8MTY7aSsrKSB7XHJcbiAgICBjb25zdCB5ID0gMSAtICgyKmkpLygxNSk7XHJcbiAgICBjb25zdCByID0gTWF0aC5zcXJ0KDEteSp5KTtcclxuICAgIGNvbnN0IGFuZ2xlID0gaSAqIE1hdGguUEkgKiAoMy1NYXRoLnNxcnQoNSkpO1xyXG4gICAgZ3JhZGllbnRzM0QucHVzaChuZXcgVmVjMyhcclxuICAgICAgICBNYXRoLmNvcyhhbmdsZSkgKiByLFxyXG4gICAgICAgIHksXHJcbiAgICAgICAgTWF0aC5zaW4oYW5nbGUpICogcixcclxuICAgICkpO1xyXG59XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTm9pc2Uge1xyXG4gICAgc3RhdGljIGZhZGUodDogbnVtYmVyKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHQgKiB0ICogdCAqICh0ICogKHQgKiA2IC0gMTUpICsgMTApO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldFBlcmxpblZlY3RvcjJEKHg6IG51bWJlciwgeTogbnVtYmVyLCBzZWVkID0gMCkgOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gZ3JhZGllbnRzMkRbTWF0aC5mbG9vcihOb2lzZS5yYW5kb21Db25zdGFudDMoc2VlZCwgeCwgeSkgKiBncmFkaWVudHMyRC5sZW5ndGgpXSE7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0UGVybGluVmVjdG9yM0QoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgc2VlZCA9IDApIDogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIGdyYWRpZW50czNEW01hdGguZmxvb3IoTm9pc2UucmFuZG9tQ29uc3RhbnQ0KHNlZWQsIHgsIHksIHopICogZ3JhZGllbnRzM0QubGVuZ3RoKV0hO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldFZvcm9ub2lHcmlkUG9zaXRpb24yRCh4OiBudW1iZXIsIHk6IG51bWJlciwgc2VlZCA9IDAsIHQgPSAxKSA6IFZlYzIge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMihcclxuICAgICAgICAgICAgeCArIHQgKiBOb2lzZS5yYW5kb21Db25zdGFudDMoeCwgeSwgc2VlZCksXHJcbiAgICAgICAgICAgIHkgKyB0ICogTm9pc2UucmFuZG9tQ29uc3RhbnQzKHgsIHksIHNlZWQrMSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldFZvcm9ub2lHcmlkVmFsdWUyRCh4OiBudW1iZXIsIHk6IG51bWJlciwgc2VlZCA9IDApIDogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTm9pc2UucmFuZG9tQ29uc3RhbnQzKHgsIHksIHNlZWQrMik7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0Vm9yb25vaUdyaWRQb3NpdGlvbjNEKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHNlZWQgPSAwLCB0ID0gMSkgOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoXHJcbiAgICAgICAgICAgIHggKyB0ICogTm9pc2UucmFuZG9tQ29uc3RhbnQ0KHgsIHksIHosIHNlZWQpLFxyXG4gICAgICAgICAgICB5ICsgdCAqIE5vaXNlLnJhbmRvbUNvbnN0YW50NCh5LCB6LCB4LCBzZWVkKzEpLFxyXG4gICAgICAgICAgICB6ICsgdCAqIE5vaXNlLnJhbmRvbUNvbnN0YW50NCh6LCB4LCB5LCBzZWVkKzIpLFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0Vm9yb25vaUdyaWRWYWx1ZTNEKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHNlZWQgPSAwKSA6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE5vaXNlLnJhbmRvbUNvbnN0YW50NCh4LCB5LCB6LCBzZWVkKzMpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHBlcmxpbk5vaXNlMkQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHNlZWQgPSAwKSA6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgZ2V0UGVybGluVmVjdG9yMkQgPSBOb2lzZS5nZXRQZXJsaW5WZWN0b3IyRDtcclxuICAgICAgICBjb25zdCBsZXJwID0gRU1hdGgubGVycDtcclxuICAgICAgICBjb25zdCBmYWRlID0gTm9pc2UuZmFkZTtcclxuICAgICAgICBjb25zdCBnMCA9IG5ldyBWZWMyKHgsIHkpLm1hcFNlbGYoTWF0aC5mbG9vcik7XHJcbiAgICAgICAgY29uc3QgZzEgPSBuZXcgVmVjMihnMCkuYWRkU2VsZkMoMSwgMSk7XHJcbiAgICAgICAgY29uc3QgZjAgPSBuZXcgVmVjMih4LCB5KS5zdWJTZWxmKGcwKTtcclxuICAgICAgICBjb25zdCBmMSA9IG5ldyBWZWMyKHgsIHkpLnN1YlNlbGYoZzEpO1xyXG4gICAgICAgIGNvbnN0IGNBQSA9IGdldFBlcmxpblZlY3RvcjJEKGcwLngsIGcwLnksIHNlZWQpLmRvdChmMCk7XHJcbiAgICAgICAgY29uc3QgY0FCID0gZ2V0UGVybGluVmVjdG9yMkQoZzAueCwgZzEueSwgc2VlZCkuZG90QyhmMC54LCBmMS55KTtcclxuICAgICAgICBjb25zdCBjQkEgPSBnZXRQZXJsaW5WZWN0b3IyRChnMS54LCBnMC55LCBzZWVkKS5kb3RDKGYxLngsIGYwLnkpO1xyXG4gICAgICAgIGNvbnN0IGNCQiA9IGdldFBlcmxpblZlY3RvcjJEKGcxLngsIGcxLnksIHNlZWQpLmRvdChmMSk7XHJcbiAgICAgICAgY29uc3QgdHggPSBmYWRlKGYwLngpO1xyXG4gICAgICAgIGNvbnN0IHR5ID0gZmFkZShmMC55KTtcclxuICAgICAgICBjb25zdCBjQSA9IGxlcnAoY0FBLCBjQkEsIHR4KTtcclxuICAgICAgICBjb25zdCBjQiA9IGxlcnAoY0FCLCBjQkIsIHR4KTtcclxuICAgICAgICBjb25zdCBjID0gbGVycChjQSwgY0IsIHR5KTtcclxuICAgICAgICByZXR1cm4gRU1hdGguY2xhbXAoYyAqIDAuNSArIDAuNSwgMCwgMSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcGVybGluTm9pc2UzRCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBzZWVkID0gMCkgOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGdldFBlcmxpblZlY3RvcjNEID0gTm9pc2UuZ2V0UGVybGluVmVjdG9yM0Q7XHJcbiAgICAgICAgY29uc3QgbGVycCA9IEVNYXRoLmxlcnA7XHJcbiAgICAgICAgY29uc3QgZmFkZSA9IE5vaXNlLmZhZGU7XHJcbiAgICAgICAgY29uc3QgZzAgPSBuZXcgVmVjMyh4LCB5LCB6KS5tYXBTZWxmKE1hdGguZmxvb3IpO1xyXG4gICAgICAgIGNvbnN0IGcxID0gbmV3IFZlYzMoZzApLmFkZFNlbGZDKDEsIDEsIDEpO1xyXG4gICAgICAgIGNvbnN0IGYwID0gbmV3IFZlYzMoeCwgeSwgeikuc3ViU2VsZihnMCk7XHJcbiAgICAgICAgY29uc3QgZjEgPSBuZXcgVmVjMyh4LCB5LCB6KS5zdWJTZWxmKGcxKTtcclxuICAgICAgICBjb25zdCBjQUFBID0gZ2V0UGVybGluVmVjdG9yM0QoZzAueCwgZzAueSwgZzAueiwgc2VlZCkuZG90KGYwKTtcclxuICAgICAgICBjb25zdCBjQUFCID0gZ2V0UGVybGluVmVjdG9yM0QoZzAueCwgZzAueSwgZzEueiwgc2VlZCkuZG90QyhmMC54LCBmMC55LCBmMS56KTtcclxuICAgICAgICBjb25zdCBjQUJBID0gZ2V0UGVybGluVmVjdG9yM0QoZzAueCwgZzEueSwgZzAueiwgc2VlZCkuZG90QyhmMC54LCBmMS55LCBmMC56KTtcclxuICAgICAgICBjb25zdCBjQUJCID0gZ2V0UGVybGluVmVjdG9yM0QoZzAueCwgZzEueSwgZzEueiwgc2VlZCkuZG90QyhmMC54LCBmMS55LCBmMS56KTtcclxuICAgICAgICBjb25zdCBjQkFBID0gZ2V0UGVybGluVmVjdG9yM0QoZzEueCwgZzAueSwgZzAueiwgc2VlZCkuZG90QyhmMS54LCBmMC55LCBmMC56KTtcclxuICAgICAgICBjb25zdCBjQkFCID0gZ2V0UGVybGluVmVjdG9yM0QoZzEueCwgZzAueSwgZzEueiwgc2VlZCkuZG90QyhmMS54LCBmMC55LCBmMS56KTtcclxuICAgICAgICBjb25zdCBjQkJBID0gZ2V0UGVybGluVmVjdG9yM0QoZzEueCwgZzEueSwgZzAueiwgc2VlZCkuZG90QyhmMS54LCBmMS55LCBmMC56KTtcclxuICAgICAgICBjb25zdCBjQkJCID0gZ2V0UGVybGluVmVjdG9yM0QoZzEueCwgZzEueSwgZzEueiwgc2VlZCkuZG90KGYxKTtcclxuICAgICAgICBjb25zdCB0eCA9IGZhZGUoZjAueCk7XHJcbiAgICAgICAgY29uc3QgdHkgPSBmYWRlKGYwLnkpO1xyXG4gICAgICAgIGNvbnN0IHR6ID0gZmFkZShmMC56KTtcclxuICAgICAgICBjb25zdCBjQUEgPSBsZXJwKGNBQUEsIGNCQUEsIHR4KTtcclxuICAgICAgICBjb25zdCBjQUIgPSBsZXJwKGNBQUIsIGNCQUIsIHR4KTtcclxuICAgICAgICBjb25zdCBjQkEgPSBsZXJwKGNBQkEsIGNCQkEsIHR4KTtcclxuICAgICAgICBjb25zdCBjQkIgPSBsZXJwKGNBQkIsIGNCQkIsIHR4KTtcclxuICAgICAgICBjb25zdCBjQSA9IGxlcnAoY0FBLCBjQkEsIHR5KTtcclxuICAgICAgICBjb25zdCBjQiA9IGxlcnAoY0FCLCBjQkIsIHR5KTtcclxuICAgICAgICBjb25zdCBjID0gbGVycChjQSwgY0IsIHR6KTtcclxuICAgICAgICByZXR1cm4gRU1hdGguY2xhbXAoYyAqIDAuNSArIDAuNSwgMCwgMSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdm9yb25vaU5vaXNlMkQoeDogbnVtYmVyLCB5OiBudW1iZXIsIHNlZWQgPSAwLCB0ID0gMSkge1xyXG4gICAgICAgIGxldCBwID0gbmV3IFZlYzIoeCwgeSk7XHJcbiAgICAgICAgY29uc3QgZzAgPSBwLm1hcChNYXRoLmZsb29yKTtcclxuICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgcG9pbnREaXN0YW5jZTogSW5maW5pdHksXHJcbiAgICAgICAgICAgIHZhbHVlOiAwLFxyXG4gICAgICAgICAgICBncmlkUG9zOiBWZWMyLnplcm8oKSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGZvcihsZXQgeG9mZj0tMTt4b2ZmPD0xO3hvZmYrKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IHlvZmY9LTE7eW9mZjw9MTt5b2ZmKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdyaWRQb3MgPSBnMC5hZGRDKHhvZmYsIHlvZmYpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcG9pbnRQb3MgPSBOb2lzZS5nZXRWb3Jvbm9pR3JpZFBvc2l0aW9uMkQoZ3JpZFBvcy54LCBncmlkUG9zLnksIHNlZWQsIHQpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdCA9IHAuZGlzdChwb2ludFBvcyk7XHJcbiAgICAgICAgICAgICAgICBpZihkaXN0PGRhdGEucG9pbnREaXN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuZ3JpZFBvcyA9IGdyaWRQb3M7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5wb2ludERpc3RhbmNlID0gZGlzdDtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnZhbHVlID0gTm9pc2UuZ2V0Vm9yb25vaUdyaWRWYWx1ZTJEKGdyaWRQb3MueCwgZ3JpZFBvcy55LCBzZWVkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuICAgIHN0YXRpYyB2b3Jvbm9pTm9pc2UzRCh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCBzZWVkID0gMCwgdCA9IDEpIHtcclxuICAgICAgICBsZXQgcCA9IG5ldyBWZWMzKHgsIHksIHopO1xyXG4gICAgICAgIGNvbnN0IGcwID0gcC5tYXAoTWF0aC5mbG9vcik7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHBvaW50RGlzdGFuY2U6IEluZmluaXR5LFxyXG4gICAgICAgICAgICB2YWx1ZTogMCxcclxuICAgICAgICAgICAgZ3JpZFBvczogVmVjMy56ZXJvKCksXHJcbiAgICAgICAgfTtcclxuICAgICAgICBmb3IobGV0IHhvZmY9LTE7eG9mZjw9MTt4b2ZmKyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCB5b2ZmPS0xO3lvZmY8PTE7eW9mZisrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IHpvZmY9LTE7em9mZjw9MTt6b2ZmKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBncmlkUG9zID0gZzAuYWRkQyh4b2ZmLCB5b2ZmLCB6b2ZmKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludFBvcyA9IE5vaXNlLmdldFZvcm9ub2lHcmlkUG9zaXRpb24zRChncmlkUG9zLngsIGdyaWRQb3MueSwgZ3JpZFBvcy56LCBzZWVkLCB0KTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0ID0gcC5kaXN0KHBvaW50UG9zKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihkaXN0PGRhdGEucG9pbnREaXN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmdyaWRQb3MgPSBncmlkUG9zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnBvaW50RGlzdGFuY2UgPSBkaXN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnZhbHVlID0gTm9pc2UuZ2V0Vm9yb25vaUdyaWRWYWx1ZTNEKGdyaWRQb3MueCwgZ3JpZFBvcy55LCBncmlkUG9zLnosIHNlZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuICAgIHN0YXRpYyByYW5kb21Db25zdGFudDMoYTogbnVtYmVyLCBiOiBudW1iZXIsIGM6IG51bWJlcikgOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGl0ID0gKGEgKiAyMzk0ODIzNTQ5KSBeIChiICogNDM4NTk3NDI4NTApIF4gKGMgKiAyMzA5NDU2NTIzNCk7XHJcbiAgICAgICAgcmV0dXJuIEVNYXRoLnBtb2QoaXQsIDEwMDAwKSAvIDEwMDAwO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJhbmRvbUNvbnN0YW50NChhOiBudW1iZXIsIGI6IG51bWJlciwgYzogbnVtYmVyLCBkOiBudW1iZXIpIDogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBpdCA9IChhICogMjM5NDgyMzU0OSkgXiAoYiAqIDQzODU5NzQyODUwKSBeIChjICogMjMwOTQ1NjUyMzQpIF4gKGQgKiA4NDI3ODI0NTY2KTtcclxuICAgICAgICByZXR1cm4gRU1hdGgucG1vZChpdCwgMTAwMDApIC8gMTAwMDA7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFNpZ25hbDxUIGV4dGVuZHMgYW55W10+IHtcclxuICAgIGNvbm5lY3Rpb25zOiBDb25uZWN0aW9uPFQ+W10gPSBbXTtcclxuICAgIHRpbWVGaXJlZDogbnVtYmVyID0gLU51bWJlci5NQVhfVkFMVUU7XHJcbiAgICBvbkNvbm5lY3Q/OiAoY29ubjogQ29ubmVjdGlvbjxUPikgPT4gdm9pZDtcclxuICAgIGNvbnN0cnVjdG9yKHtcclxuICAgICAgICBvbkNvbm5lY3QgPSB1bmRlZmluZWQsXHJcbiAgICB9OiB7XHJcbiAgICAgICAgb25Db25uZWN0PzogKGNvbm46IENvbm5lY3Rpb248VD4pID0+IHZvaWQsXHJcbiAgICB9ID0ge30pIHtcclxuICAgICAgICB0aGlzLm9uQ29ubmVjdCA9IG9uQ29ubmVjdDtcclxuICAgIH1cclxuICAgIGNvbm5lY3QoY2FsbGJhY2s6ICguLi5hcmdzOiBUKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgY29uc3QgY29ubiA9IG5ldyBDb25uZWN0aW9uPFQ+KHRoaXMsIGNhbGxiYWNrKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLnB1c2goY29ubik7XHJcbiAgICAgICAgaWYodGhpcy5vbkNvbm5lY3QpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkNvbm5lY3QoY29ubik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb25uO1xyXG4gICAgfVxyXG4gICAgb25jZShjYWxsYmFjazogKC4uLmFyZ3M6IFQpID0+IHZvaWQpIHtcclxuICAgICAgICBjb25zdCBjb25uID0gdGhpcy5jb25uZWN0KCguLi5hcmdzOiBUKSA9PiB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKC4uLmFyZ3MpO1xyXG4gICAgICAgICAgICBjb25uLmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gY29ubjtcclxuICAgIH1cclxuICAgIGFzeW5jIHdhaXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPFQ+KHJlcyA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMub25jZSgoLi4uYXJnczogVCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzKGFyZ3MpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGZpcmUoLi4uYXJnczogVCkge1xyXG4gICAgICAgIHRoaXMudGltZUZpcmVkID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgZm9yKGNvbnN0IGNvbm4gb2YgWy4uLnRoaXMuY29ubmVjdGlvbnNdKSB7XHJcbiAgICAgICAgICAgIGNvbm4uZmlyZSguLi5hcmdzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXRUaW1lU2luY2VGaXJlZCgpIHtcclxuICAgICAgICByZXR1cm4gcGVyZm9ybWFuY2Uubm93KCkgLyAxMDAwIC0gdGhpcy50aW1lRmlyZWQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uPFQgZXh0ZW5kcyBhbnlbXT4ge1xyXG4gICAgZ3JvdXBzOiBDb25uZWN0aW9uR3JvdXBbXSA9IFtdO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHNpZ25hbDogU2lnbmFsPFQ+LCBwdWJsaWMgY2FsbGJhY2s6ICguLi5hcmdzOiBUKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBkaXNjb25uZWN0KCkge1xyXG4gICAgICAgIHRoaXMuc2lnbmFsLmNvbm5lY3Rpb25zLnNwbGljZSh0aGlzLnNpZ25hbC5jb25uZWN0aW9ucy5pbmRleE9mKHRoaXMpLCAxKTtcclxuICAgICAgICBmb3IoY29uc3QgZ3JvdXAgb2YgdGhpcy5ncm91cHMpIHtcclxuICAgICAgICAgICAgZ3JvdXAuY29ubmVjdGlvbnMuc3BsaWNlKGdyb3VwLmNvbm5lY3Rpb25zLmluZGV4T2YodGhpcyksIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdyb3VwcyA9IFtdO1xyXG4gICAgfVxyXG4gICAgZmlyZSguLi5hcmdzOiBUKSB7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFjayguLi5hcmdzKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEh0bWxDb25uZWN0aW9uIHtcclxuICAgIGdyb3VwczogQ29ubmVjdGlvbkdyb3VwW10gPSBbXTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRXZlbnRUYXJnZXQsIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBjYWxsYmFjazogKGU6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLm5hbWUsIHRoaXMuY2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgZGlzY29ubmVjdCgpIHtcclxuICAgICAgICB0aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5uYW1lLCB0aGlzLmNhbGxiYWNrKTtcclxuICAgICAgICBmb3IoY29uc3QgZ3JvdXAgb2YgdGhpcy5ncm91cHMpIHtcclxuICAgICAgICAgICAgZ3JvdXAuY29ubmVjdGlvbnMuc3BsaWNlKGdyb3VwLmNvbm5lY3Rpb25zLmluZGV4T2YodGhpcyksIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdyb3VwcyA9IFtdO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvbkdyb3VwIHtcclxuICAgIGNvbm5lY3Rpb25zOiAoQ29ubmVjdGlvbjxhbnk+IHwgSHRtbENvbm5lY3Rpb24pW10gPSBbXTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuICAgIGFkZChjb25uOiBDb25uZWN0aW9uPGFueT4gfCBIdG1sQ29ubmVjdGlvbikge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMucHVzaChjb25uKTtcclxuICAgIH1cclxuICAgIGRpc2Nvbm5lY3RBbGwoKSB7XHJcbiAgICAgICAgZm9yKGNvbnN0IGNvbm4gb2YgWy4uLnRoaXMuY29ubmVjdGlvbnNdKSB7XHJcbiAgICAgICAgICAgIGNvbm4uZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zID0gW107XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDYW1lcmEzRCB7XHJcbiAgICBwcml2YXRlIF9mb3ZZOiBudW1iZXIgPSA5NS8xODAqTWF0aC5QSTtcclxuICAgIGdldCBmb3ZZKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3ZZO1xyXG4gICAgfVxyXG4gICAgc2V0IGZvdlkobjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fZm92WSA9IG47XHJcbiAgICAgICAgdGhpcy5fcGVyc3BlY3RpdmVNYXRyaXhVID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9hc3BlY3Q6IG51bWJlciA9IDE7XHJcbiAgICBnZXQgYXNwZWN0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hc3BlY3Q7XHJcbiAgICB9XHJcbiAgICBzZXQgYXNwZWN0KG46IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2FzcGVjdCA9IG47XHJcbiAgICAgICAgdGhpcy5fcGVyc3BlY3RpdmVNYXRyaXhVID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9uZWFyOiBudW1iZXIgPSAwLjE7XHJcbiAgICBnZXQgbmVhcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbmVhcjtcclxuICAgIH1cclxuICAgIHNldCBuZWFyKG46IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX25lYXIgPSBuO1xyXG4gICAgICAgIHRoaXMuX3BlcnNwZWN0aXZlTWF0cml4VSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZmFyOiBudW1iZXIgPSAxMDAwMDtcclxuICAgIGdldCBmYXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZhcjtcclxuICAgIH1cclxuICAgIHNldCBmYXIobjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fZmFyID0gbjtcclxuICAgICAgICB0aGlzLl9wZXJzcGVjdGl2ZU1hdHJpeFUgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3Bvc2l0aW9uID0gVmVjMy56ZXJvKCk7XHJcbiAgICBnZXQgcG9zaXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uO1xyXG4gICAgfVxyXG4gICAgc2V0IHBvc2l0aW9uKHY6IFZlYzMpIHtcclxuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IHY7XHJcbiAgICAgICAgdGhpcy5fdHJhbnNsYXRpb25NYXRyaXhVID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl92aWV3TWF0cml4VSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfd29ybGRTY2FsZSA9IDE7XHJcbiAgICBnZXQgd29ybGRTY2FsZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd29ybGRTY2FsZTtcclxuICAgIH1cclxuICAgIHNldCB3b3JsZFNjYWxlKG46IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3dvcmxkU2NhbGUgPSBuO1xyXG4gICAgICAgIHRoaXMuX3RyYW5zbGF0aW9uTWF0cml4VSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fdmlld01hdHJpeFUgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JvdGF0aW9uID0gVmVjMy56ZXJvKCk7XHJcbiAgICBnZXQgcm90YXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvdGF0aW9uO1xyXG4gICAgfVxyXG4gICAgc2V0IHJvdGF0aW9uKHY6IFZlYzMpIHtcclxuICAgICAgICB0aGlzLl9yb3RhdGlvbiA9IHY7XHJcbiAgICAgICAgdGhpcy5fZm9yd2FyZFUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3JpZ2h0VSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fdXBVID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9mb3J3YXJkRmxhdFUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3JvdGF0aW9uTWF0cml4VSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fdmlld01hdHJpeFUgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2ZvcndhcmQgPSBWZWMzLnplcm8oKTtcclxuICAgIHByaXZhdGUgX2ZvcndhcmRVID0gdHJ1ZTtcclxuICAgIGdldCBmb3J3YXJkKCkge1xyXG4gICAgICAgIGlmKHRoaXMuX2ZvcndhcmRVKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvcndhcmQgPSBWZWMzLnpBeGlzKCkubmVnU2VsZigpLnJvdFhZWlNlbGYodGhpcy5fcm90YXRpb24pO1xyXG4gICAgICAgICAgICB0aGlzLl9mb3J3YXJkVSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fZm9yd2FyZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yaWdodCA9IFZlYzMuemVybygpO1xyXG4gICAgcHJpdmF0ZSBfcmlnaHRVID0gdHJ1ZTtcclxuICAgIGdldCByaWdodCgpIHtcclxuICAgICAgICBpZih0aGlzLl9yaWdodFUpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmlnaHQgPSBWZWMzLnhBeGlzKCkucm90WFlaU2VsZih0aGlzLl9yb3RhdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuX3JpZ2h0VSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fcmlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdXAgPSBWZWMzLnplcm8oKTtcclxuICAgIHByaXZhdGUgX3VwVSA9IHRydWU7XHJcbiAgICBnZXQgdXAoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fdXBVKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwID0gVmVjMy55QXhpcygpLnJvdFhZWlNlbGYodGhpcy5fcm90YXRpb24pO1xyXG4gICAgICAgICAgICB0aGlzLl91cFUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2ZvcndhcmRGbGF0ID0gVmVjMy56ZXJvKCk7XHJcbiAgICBwcml2YXRlIF9mb3J3YXJkRmxhdFUgPSB0cnVlO1xyXG4gICAgZ2V0IGZvcndhcmRGbGF0KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX2ZvcndhcmRGbGF0VSkge1xyXG4gICAgICAgICAgICB0aGlzLl9mb3J3YXJkRmxhdCA9IFZlYzMuekF4aXMoKS5uZWdTZWxmKCkucm90WVNlbGYodGhpcy5fcm90YXRpb24ueSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZvcndhcmRGbGF0VSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fZm9yd2FyZEZsYXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcGVyc3BlY3RpdmVNYXRyaXg6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIF9wZXJzcGVjdGl2ZU1hdHJpeFUgPSB0cnVlO1xyXG4gICAgZ2V0IHBlcnNwZWN0aXZlTWF0cml4KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX3BlcnNwZWN0aXZlTWF0cml4VSkge1xyXG4gICAgICAgICAgICB0aGlzLl9wZXJzcGVjdGl2ZU1hdHJpeCA9IE1hdDQucGVyc3BlY3RpdmUodGhpcy5fZm92WSwgdGhpcy5fYXNwZWN0LCB0aGlzLl9uZWFyLCB0aGlzLl9mYXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9wZXJzcGVjdGl2ZU1hdHJpeFUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5wZXJzcGVjdGl2ZU1hdHJpeENoYW5nZUV2ZW50LmZpcmUodGhpcy5fcGVyc3BlY3RpdmVNYXRyaXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fcGVyc3BlY3RpdmVNYXRyaXg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdHJhbnNsYXRpb25NYXRyaXg6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIF90cmFuc2xhdGlvbk1hdHJpeFUgPSB0cnVlO1xyXG4gICAgZ2V0IHRyYW5zbGF0aW9uTWF0cml4KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX3RyYW5zbGF0aW9uTWF0cml4VSkge1xyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2xhdGlvbk1hdHJpeCA9IE1hdDQudHJhbnNsYXRlKC10aGlzLl9wb3NpdGlvbi54ICogdGhpcy5fd29ybGRTY2FsZSwgLXRoaXMuX3Bvc2l0aW9uLnkgKiB0aGlzLl93b3JsZFNjYWxlLCAtdGhpcy5fcG9zaXRpb24ueiAqIHRoaXMuX3dvcmxkU2NhbGUpO1xyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2xhdGlvbk1hdHJpeFUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2xhdGlvbk1hdHJpeENoYW5nZUV2ZW50LmZpcmUodGhpcy5fdmlld01hdHJpeCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGlvbk1hdHJpeDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yb3RhdGlvbk1hdHJpeDogbnVtYmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX3JvdGF0aW9uTWF0cml4VSA9IHRydWU7XHJcbiAgICBnZXQgcm90YXRpb25NYXRyaXgoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fcm90YXRpb25NYXRyaXhVKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JvdGF0aW9uTWF0cml4ID0gTWF0NC5tdWx0aXBseShcclxuICAgICAgICAgICAgICAgIE1hdDQucm90YXRlWigtdGhpcy5fcm90YXRpb24ueiksXHJcbiAgICAgICAgICAgICAgICBNYXQ0Lm11bHRpcGx5KFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdDQucm90YXRlWCgtdGhpcy5fcm90YXRpb24ueCksXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0NC5yb3RhdGVZKC10aGlzLl9yb3RhdGlvbi55KSxcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdGhpcy5fcm90YXRpb25NYXRyaXhVID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMucm90YXRpb25NYXRyaXhDaGFuZ2VFdmVudC5maXJlKHRoaXMuX3ZpZXdNYXRyaXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fcm90YXRpb25NYXRyaXg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdmlld01hdHJpeDogbnVtYmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX3ZpZXdNYXRyaXhVID0gdHJ1ZTtcclxuICAgIGdldCB2aWV3TWF0cml4KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX3ZpZXdNYXRyaXhVKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZpZXdNYXRyaXggPSBNYXQ0Lm11bHRpcGx5KHRoaXMucm90YXRpb25NYXRyaXgsIHRoaXMudHJhbnNsYXRpb25NYXRyaXgpO1xyXG4gICAgICAgICAgICB0aGlzLl92aWV3TWF0cml4VSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdNYXRyaXhDaGFuZ2VFdmVudC5maXJlKHRoaXMuX3ZpZXdNYXRyaXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fdmlld01hdHJpeDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGVyc3BlY3RpdmVNYXRyaXhDaGFuZ2VFdmVudCA9IG5ldyBTaWduYWwoeyBvbkNvbm5lY3Q6IGNvbm4gPT4gY29ubi5maXJlKHRoaXMucGVyc3BlY3RpdmVNYXRyaXgpIH0pO1xyXG4gICAgcHVibGljIHZpZXdNYXRyaXhDaGFuZ2VFdmVudCA9IG5ldyBTaWduYWwoeyBvbkNvbm5lY3Q6IGNvbm4gPT4gY29ubi5maXJlKHRoaXMudmlld01hdHJpeCkgfSk7XHJcbiAgICBwdWJsaWMgcm90YXRpb25NYXRyaXhDaGFuZ2VFdmVudCA9IG5ldyBTaWduYWwoeyBvbkNvbm5lY3Q6IGNvbm4gPT4gY29ubi5maXJlKHRoaXMucm90YXRpb25NYXRyaXgpIH0pO1xyXG4gICAgcHVibGljIHRyYW5zbGF0aW9uTWF0cml4Q2hhbmdlRXZlbnQgPSBuZXcgU2lnbmFsKHsgb25Db25uZWN0OiBjb25uID0+IGNvbm4uZmlyZSh0aGlzLnRyYW5zbGF0aW9uTWF0cml4KSB9KTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbj86IFZlYzMsIGZvdlk/OiBudW1iZXIsIGFzcGVjdD86IG51bWJlciwgbmVhcj86IG51bWJlciwgZmFyPzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYocG9zaXRpb24pIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICBpZihmb3ZZKSB0aGlzLmZvdlkgPSBmb3ZZO1xyXG4gICAgICAgIGlmKGFzcGVjdCkgdGhpcy5hc3BlY3QgPSBhc3BlY3Q7XHJcbiAgICAgICAgaWYobmVhcikgdGhpcy5uZWFyID0gbmVhcjtcclxuICAgICAgICBpZihmYXIpIHRoaXMuZmFyID0gZmFyO1xyXG4gICAgfVxyXG5cclxuICAgIGxvb2tBdChwOiBWZWMzKSB7XHJcbiAgICAgICAgbGV0IGYgPSB0aGlzLnBvc2l0aW9uLmxvb2socCk7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbiA9IG5ldyBWZWMzKGYucGl0Y2goKSwgZi55YXcoKSwgMCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMkNvbXBvbmVudFNoYWRlciB7XHJcbiAgICB3U2hhZGVyOiBXZWJHTFNoYWRlcjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCwgcHVibGljIHR5cGU6IFwidmVydGV4XCIgfCBcImZyYWdtZW50XCIsIHB1YmxpYyBzb3VyY2U6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHdTaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIodHlwZSA9PSBcInZlcnRleFwiID8gZ2wuVkVSVEVYX1NIQURFUiA6IGdsLkZSQUdNRU5UX1NIQURFUik7XHJcbiAgICAgICAgaWYod1NoYWRlciA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBjcmVhdGUgc2hhZGVyXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLndTaGFkZXIgPSB3U2hhZGVyO1xyXG4gICAgICAgIGdsLnNoYWRlclNvdXJjZSh3U2hhZGVyLCBzb3VyY2UpO1xyXG4gICAgICAgIGdsLmNvbXBpbGVTaGFkZXIod1NoYWRlcilcclxuICAgICAgICBpZighZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHdTaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSkge1xyXG4gICAgICAgICAgICBjb25zdCBsb2cgPSBnbC5nZXRTaGFkZXJJbmZvTG9nKHdTaGFkZXIpO1xyXG4gICAgICAgICAgICBnbC5kZWxldGVTaGFkZXIod1NoYWRlcik7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBjb21waWxlIHNoYWRlcjogXCIgKyBsb2cpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGRlbGV0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdsLmRlbGV0ZVNoYWRlcih0aGlzLndTaGFkZXIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMkNvbXBvbmVudFByb2dyYW0ge1xyXG4gICAgd1Byb2dyYW06IFdlYkdMUHJvZ3JhbTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCwgcHVibGljIGNTaGFkZXJWOiBXR0wyQ29tcG9uZW50U2hhZGVyLCBwdWJsaWMgY1NoYWRlckY6IFdHTDJDb21wb25lbnRTaGFkZXIpIHtcclxuICAgICAgICBjb25zdCB3UHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcclxuICAgICAgICBpZiAoIXdQcm9ncmFtKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBjcmVhdGUgcHJvZ3JhbVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy53UHJvZ3JhbSA9IHdQcm9ncmFtO1xyXG4gICAgICAgIGdsLmF0dGFjaFNoYWRlcih3UHJvZ3JhbSwgY1NoYWRlclYud1NoYWRlcik7XHJcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKHdQcm9ncmFtLCBjU2hhZGVyRi53U2hhZGVyKTtcclxuICAgICAgICBnbC5saW5rUHJvZ3JhbSh3UHJvZ3JhbSk7XHJcbiAgICAgICAgaWYoIWdsLmdldFByb2dyYW1QYXJhbWV0ZXIod1Byb2dyYW0sIGdsLkxJTktfU1RBVFVTKSkge1xyXG4gICAgICAgICAgICBjb25zdCBsb2cgPSBnbC5nZXRQcm9ncmFtSW5mb0xvZyh3UHJvZ3JhbSk7XHJcbiAgICAgICAgICAgIGdsLmRlbGV0ZVByb2dyYW0od1Byb2dyYW0pO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gbGluayBwcm9ncmFtOiBcIiArIGxvZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2V0QWN0aXZlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSh0aGlzLndQcm9ncmFtKTtcclxuICAgIH1cclxuICAgIGRlbGV0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdsLmRlbGV0ZVByb2dyYW0odGhpcy53UHJvZ3JhbSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIFdHTDJBdHRyaWJ1dGVUeXBlID0gKFxyXG4gICAgXCJmbG9hdFwiIHwgXCJpbnRcIiB8IFwidWludFwiIHwgXCJ2ZWMyXCIgfCBcInZlYzNcIiB8IFwidmVjNFwiXHJcbiAgICB8IFwiaXZlYzJcIiB8IFwiaXZlYzNcIiB8IFwiaXZlYzRcIiB8IFwidXZlYzJcIiB8IFwidXZlYzNcIiB8IFwidXZlYzRcIlxyXG4pO1xyXG5cclxuZXhwb3J0IHR5cGUgV0dMMlVuaWZvcm1UeXBlID0gKFxyXG4gICAgXCJmbG9hdFwiIHwgXCJpbnRcIiB8IFwidWludFwiIHwgXCJ2ZWMyXCIgfCBcInZlYzNcIlxyXG4gICAgfCBcInZlYzRcIiB8IFwiaXZlYzJcIiB8IFwiaXZlYzNcIiB8IFwiaXZlYzRcIiB8IFwidXZlYzJcIlxyXG4gICAgfCBcInV2ZWMzXCIgfCBcInV2ZWM0XCIgfCBcIm1hdDJcIiB8IFwibWF0M1wiIHwgXCJtYXQ0XCJcclxuKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBXR0wyQ29tcG9uZW50QnVmZmVyIHtcclxuICAgIHdUeXBlOiBHTGVudW07XHJcbiAgICB3RGltZW5zaW9uczogbnVtYmVyO1xyXG4gICAgd0J1ZmZlcjogV2ViR0xCdWZmZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsIHR5cGU6IFdHTDJBdHRyaWJ1dGVUeXBlKSB7XHJcbiAgICAgICAgY29uc3QgYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICAgICAgaWYoIWJ1ZmZlcikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gY3JlYXRlIGJ1ZmZlclwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy53QnVmZmVyID0gYnVmZmVyO1xyXG4gICAgICAgIHN3aXRjaCh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJmbG9hdFwiOiB0aGlzLndUeXBlID0gZ2wuRkxPQVQ7IHRoaXMud0RpbWVuc2lvbnMgPSAxOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInZlYzJcIjogdGhpcy53VHlwZSA9IGdsLkZMT0FUOyB0aGlzLndEaW1lbnNpb25zID0gMjsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ2ZWMzXCI6IHRoaXMud1R5cGUgPSBnbC5GTE9BVDsgdGhpcy53RGltZW5zaW9ucyA9IDM7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidmVjNFwiOiB0aGlzLndUeXBlID0gZ2wuRkxPQVQ7IHRoaXMud0RpbWVuc2lvbnMgPSA0OyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImludFwiOiB0aGlzLndUeXBlID0gZ2wuSU5UOyB0aGlzLndEaW1lbnNpb25zID0gMTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpdmVjMlwiOiB0aGlzLndUeXBlID0gZ2wuSU5UOyB0aGlzLndEaW1lbnNpb25zID0gMjsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpdmVjM1wiOiB0aGlzLndUeXBlID0gZ2wuSU5UOyB0aGlzLndEaW1lbnNpb25zID0gMzsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpdmVjNFwiOiB0aGlzLndUeXBlID0gZ2wuSU5UOyB0aGlzLndEaW1lbnNpb25zID0gNDsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1aW50XCI6IHRoaXMud1R5cGUgPSBnbC5VTlNJR05FRF9JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSAxOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInV2ZWMyXCI6IHRoaXMud1R5cGUgPSBnbC5VTlNJR05FRF9JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSAyOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInV2ZWMzXCI6IHRoaXMud1R5cGUgPSBnbC5VTlNJR05FRF9JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSAzOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInV2ZWM0XCI6IHRoaXMud1R5cGUgPSBnbC5VTlNJR05FRF9JTlQ7IHRoaXMud0RpbWVuc2lvbnMgPSA0OyBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKFwiVW5zdXBwb3J0ZWQgYnVmZmVyIHR5cGU6IFwiICsgdHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2V0QWN0aXZlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlcih0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdGhpcy53QnVmZmVyKTtcclxuICAgIH1cclxuICAgIGRlbGV0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdsLmRlbGV0ZUJ1ZmZlcih0aGlzLndCdWZmZXIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV0dMMkNvbXBvbmVudFZhbyB7XHJcbiAgICB3VmFvOiBXZWJHTFZlcnRleEFycmF5T2JqZWN0O1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy53VmFvID0gZ2wuY3JlYXRlVmVydGV4QXJyYXkoKTtcclxuICAgIH1cclxuICAgIHNldEFjdGl2ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdsLmJpbmRWZXJ0ZXhBcnJheSh0aGlzLndWYW8pO1xyXG4gICAgfVxyXG4gICAgZW5hYmxlQnVmZmVyKGNCdWZmZXI6IFdHTDJDb21wb25lbnRCdWZmZXIsIHdMb2NhdGlvbjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgY0J1ZmZlci5zZXRBY3RpdmUoKTtcclxuICAgICAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHdMb2NhdGlvbik7XHJcbiAgICAgICAgaWYoY0J1ZmZlci53VHlwZSA9PSB0aGlzLmdsLkZMT0FUKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcih3TG9jYXRpb24sIGNCdWZmZXIud0RpbWVuc2lvbnMsIGNCdWZmZXIud1R5cGUsIGZhbHNlLCAwLCAwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmdsLnZlcnRleEF0dHJpYklQb2ludGVyKHdMb2NhdGlvbiwgY0J1ZmZlci53RGltZW5zaW9ucywgY0J1ZmZlci53VHlwZSwgMCwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZGVsZXRlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2wuZGVsZXRlVmVydGV4QXJyYXkodGhpcy53VmFvKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJDb21wb25lbnRVbmlmb3JtIHtcclxuICAgIHdMb2NhdGlvbjogV2ViR0xVbmlmb3JtTG9jYXRpb247XHJcbiAgICBxdWV1ZWRWYWx1ZXM6IGFueVtdIHwgYW55IHwgbnVsbCA9IG51bGw7XHJcbiAgICBoYXNRdWV1ZWQgPSBmYWxzZTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCwgY1Byb2dyYW06IFdHTDJDb21wb25lbnRQcm9ncmFtLCBuYW1lOiBzdHJpbmcsIHB1YmxpYyB0eXBlOiBXR0wyVW5pZm9ybVR5cGUpIHtcclxuICAgICAgICBjb25zdCB3TG9jYXRpb24gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbihjUHJvZ3JhbS53UHJvZ3JhbSwgbmFtZSk7XHJcbiAgICAgICAgaWYod0xvY2F0aW9uID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBnZXQgdW5pZm9ybSBsb2NhdGlvbiBmb3IgXCIgKyBuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy53TG9jYXRpb24gPSB3TG9jYXRpb247XHJcbiAgICB9XHJcbiAgICBzZXRWYWx1ZXModmFsdWVzIDogYW55W10gfCBhbnkpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB3TG9jYXRpb24gPSB0aGlzLndMb2NhdGlvblxyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICBzd2l0Y2godGhpcy50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJmbG9hdFwiOiBnbC51bmlmb3JtMWYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInZlYzJcIjogZ2wudW5pZm9ybTJmdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidmVjM1wiOiBnbC51bmlmb3JtM2Z2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ2ZWM0XCI6IGdsLnVuaWZvcm00ZnYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImludFwiOiBnbC51bmlmb3JtMWkod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIml2ZWMyXCI6IGdsLnVuaWZvcm0yaXYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIml2ZWMzXCI6IGdsLnVuaWZvcm0zaXYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIml2ZWM0XCI6IGdsLnVuaWZvcm00aXYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInVpbnRcIjogZ2wudW5pZm9ybTF1aSh3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXZlYzJcIjogZ2wudW5pZm9ybTJ1aXYod0xvY2F0aW9uLCB2YWx1ZXMpOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInV2ZWMzXCI6IGdsLnVuaWZvcm0zdWl2KHdMb2NhdGlvbiwgdmFsdWVzKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ1dmVjNFwiOiBnbC51bmlmb3JtNHVpdih3TG9jYXRpb24sIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWF0MlwiOiBnbC51bmlmb3JtTWF0cml4MmZ2KHdMb2NhdGlvbiwgZmFsc2UsIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWF0M1wiOiBnbC51bmlmb3JtTWF0cml4M2Z2KHdMb2NhdGlvbiwgZmFsc2UsIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWF0NFwiOiBnbC51bmlmb3JtTWF0cml4NGZ2KHdMb2NhdGlvbiwgZmFsc2UsIHZhbHVlcyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoXCJVbnN1cHBvcnRlZCB1bmlmb3JtIHR5cGU6IFwiICsgdGhpcy50eXBlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBxdWV1ZVZhbHVlcyh2YWx1ZXM6IGFueVtdIHwgYW55KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5oYXNRdWV1ZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucXVldWVkVmFsdWVzID0gdmFsdWVzO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIGlmKCF0aGlzLmhhc1F1ZXVlZCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuaGFzUXVldWVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZXModGhpcy5xdWV1ZWRWYWx1ZXMpO1xyXG4gICAgICAgIHRoaXMucXVldWVkVmFsdWVzID0gbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJBdHRyaWJ1dGUge1xyXG4gICAgd0xvY2F0aW9uOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsIHB1YmxpYyB3UHJvZ3JhbTogV2ViR0xQcm9ncmFtLCBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgdHlwZTogV0dMMkF0dHJpYnV0ZVR5cGUpIHtcclxuICAgICAgICB0aGlzLndMb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHdQcm9ncmFtLCBuYW1lKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJUZXh0dXJlMkQge1xyXG4gICAgd1RleHR1cmU6IFdlYkdMVGV4dHVyZTtcclxuICAgIHVuaWZvcm06IFdHTDJDb21wb25lbnRVbmlmb3JtO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHNoYWRlcjogV0dMMlNoYWRlciwgcHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIHNsb3Q6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMud1RleHR1cmUgPSBzaGFkZXIuZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgdGhpcy51bmlmb3JtID0gc2hhZGVyLmNyZWF0ZVVuaWZvcm0obmFtZSwgXCJpbnRcIik7XHJcbiAgICAgICAgdGhpcy51bmlmb3JtLnNldFZhbHVlcyh0aGlzLnNsb3QpO1xyXG4gICAgfVxyXG4gICAgc2V0QWN0aXZlKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIHRoaXMuc2xvdCk7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy53VGV4dHVyZSk7XHJcbiAgICB9XHJcbiAgICBzZXRJbnRlcnBvbGF0aW9uKGlzRW5hYmxlZDogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBpc0VuYWJsZWQgPyBnbC5MSU5FQVIgOiBnbC5ORUFSRVNUKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgaXNFbmFibGVkID8gZ2wuTElORUFSIDogZ2wuTkVBUkVTVCk7XHJcbiAgICB9XHJcbiAgICBzZXRSZXBlYXQoaXNFbmFibGVkOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgaXNFbmFibGVkID8gZ2wuUkVQRUFUIDogZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgaXNFbmFibGVkID8gZ2wuUkVQRUFUIDogZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICB9XHJcbiAgICBzZXREYXRhKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBkYXRhOiBBcnJheUJ1ZmZlclZpZXcgfCBudWxsID0gbnVsbCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCB3aWR0aCwgaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBkYXRhKTtcclxuICAgIH1cclxuICAgIHNldEltYWdlKGltYWdlOiBUZXhJbWFnZVNvdXJjZSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBpbWFnZSk7XHJcbiAgICB9XHJcbiAgICBnZW5lcmF0ZU1pcG1hcCgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuc2hhZGVyLmdsO1xyXG4gICAgICAgIGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5zaGFkZXIuZ2w7XHJcbiAgICAgICAgZ2wuZGVsZXRlVGV4dHVyZSh0aGlzLndUZXh0dXJlKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJPYmplY3Qge1xyXG4gICAgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQ7XHJcbiAgICBjVmFvOiBXR0wyQ29tcG9uZW50VmFvO1xyXG4gICAgY0J1ZmZlckJ5TmFtZToge1trZXk6c3RyaW5nXTogV0dMMkNvbXBvbmVudEJ1ZmZlcn0gPSB7fTtcclxuICAgIHZlcnRleENvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHNoYWRlcjogV0dMMlNoYWRlcikge1xyXG4gICAgICAgIHRoaXMuZ2wgPSBzaGFkZXIuZ2w7XHJcbiAgICAgICAgdGhpcy5jVmFvID0gbmV3IFdHTDJDb21wb25lbnRWYW8oc2hhZGVyLmdsKTtcclxuICAgICAgICB0aGlzLmNWYW8uc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgZm9yKGNvbnN0IGF0dHJpYnV0ZSBvZiBzaGFkZXIuYXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICBjb25zdCBjQnVmID0gbmV3IFdHTDJDb21wb25lbnRCdWZmZXIoc2hhZGVyLmdsLCBhdHRyaWJ1dGUudHlwZSk7XHJcbiAgICAgICAgICAgIGNCdWYuc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY1Zhby5lbmFibGVCdWZmZXIoY0J1ZiwgYXR0cmlidXRlLndMb2NhdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuY0J1ZmZlckJ5TmFtZVthdHRyaWJ1dGUubmFtZV0gPSBjQnVmO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNldERhdGEoYXR0cmlidXRlTmFtZTogc3RyaW5nLCB2YWx1ZXM6IEZsb2F0MzJBcnJheSwgdXNhZ2U6IEdMZW51bSA9IHRoaXMuZ2wuU1RBVElDX0RSQVcpIHtcclxuICAgICAgICBjb25zdCBjQnVmID0gdGhpcy5jQnVmZmVyQnlOYW1lW2F0dHJpYnV0ZU5hbWVdO1xyXG4gICAgICAgIGlmKGNCdWYgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgZmluZCBhdHRyaWJ1dGUgd2l0aCBuYW1lOiBcIiArIGF0dHJpYnV0ZU5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjQnVmLnNldEFjdGl2ZSgpO1xyXG4gICAgICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkFSUkFZX0JVRkZFUiwgdmFsdWVzLCB1c2FnZSk7XHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhDb3VudCA9IHZhbHVlcy5sZW5ndGggLyBjQnVmLndEaW1lbnNpb25zO1xyXG4gICAgfVxyXG4gICAgZHJhd1RyaWFuZ2xlcygpIHtcclxuICAgICAgICB0aGlzLmNWYW8uc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgdGhpcy5nbC5kcmF3QXJyYXlzKHRoaXMuZ2wuVFJJQU5HTEVTLCAwLCB0aGlzLnZlcnRleENvdW50KTtcclxuICAgIH1cclxuICAgIGRyYXdMaW5lcygpIHtcclxuICAgICAgICB0aGlzLmNWYW8uc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgdGhpcy5nbC5kcmF3QXJyYXlzKHRoaXMuZ2wuTElORVMsIDAsIHRoaXMudmVydGV4Q291bnQpO1xyXG4gICAgfVxyXG4gICAgZHJhd1BvaW50cygpIHtcclxuICAgICAgICB0aGlzLmNWYW8uc2V0QWN0aXZlKCk7XHJcbiAgICAgICAgdGhpcy5nbC5kcmF3QXJyYXlzKHRoaXMuZ2wuUE9JTlRTLCAwLCB0aGlzLnZlcnRleENvdW50KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdHTDJTaGFkZXIge1xyXG4gICAgY1Byb2dyYW06IFdHTDJDb21wb25lbnRQcm9ncmFtO1xyXG4gICAgYXR0cmlidXRlczogV0dMMkF0dHJpYnV0ZVtdID0gW107XHJcbiAgICBjVW5pZm9ybXM6IFdHTDJDb21wb25lbnRVbmlmb3JtW10gPSBbXVxyXG4gICAgY1VuaWZvcm1CeU5hbWU6IHtba2V5OnN0cmluZ106V0dMMkNvbXBvbmVudFVuaWZvcm19ID0ge307XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQsIHZTb3VyY2U6IHN0cmluZywgZlNvdXJjZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5jUHJvZ3JhbSA9IG5ldyBXR0wyQ29tcG9uZW50UHJvZ3JhbShcclxuICAgICAgICAgICAgZ2wsIG5ldyBXR0wyQ29tcG9uZW50U2hhZGVyKGdsLCBcInZlcnRleFwiLCB2U291cmNlKSxcclxuICAgICAgICAgICAgbmV3IFdHTDJDb21wb25lbnRTaGFkZXIoZ2wsIFwiZnJhZ21lbnRcIiwgZlNvdXJjZSksXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLmNQcm9ncmFtLnNldEFjdGl2ZSgpO1xyXG4gICAgfVxyXG4gICAgYWRkQXR0cmlidXRlKG5hbWU6IHN0cmluZywgdHlwZTogV0dMMkF0dHJpYnV0ZVR5cGUpIHtcclxuICAgICAgICBjb25zdCBhdHQgPSBuZXcgV0dMMkF0dHJpYnV0ZSh0aGlzLmdsLCB0aGlzLmNQcm9ncmFtLndQcm9ncmFtLCBuYW1lLCB0eXBlKTtcclxuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMucHVzaChhdHQpO1xyXG4gICAgICAgIHJldHVybiBhdHQ7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVVbmlmb3JtKG5hbWU6IHN0cmluZywgdHlwZTogV0dMMlVuaWZvcm1UeXBlKSB7XHJcbiAgICAgICAgY29uc3QgdW5pZm9ybSA9IG5ldyBXR0wyQ29tcG9uZW50VW5pZm9ybSh0aGlzLmdsLCB0aGlzLmNQcm9ncmFtLCBuYW1lLCB0eXBlKTtcclxuICAgICAgICB0aGlzLmNVbmlmb3Jtcy5wdXNoKHVuaWZvcm0pO1xyXG4gICAgICAgIHRoaXMuY1VuaWZvcm1CeU5hbWVbbmFtZV0gPSB1bmlmb3JtO1xyXG4gICAgICAgIHJldHVybiB1bmlmb3JtO1xyXG4gICAgfVxyXG4gICAgZ2V0VW5pZm9ybShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jVW5pZm9ybUJ5TmFtZVtuYW1lXTtcclxuICAgIH1cclxuICAgIGNyZWF0ZU9iamVjdCgpIHtcclxuICAgICAgICBjb25zdCBvYmogPSBuZXcgV0dMMk9iamVjdCh0aGlzKTtcclxuICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlVGV4dHVyZTJEKG5hbWU6IHN0cmluZywgc2xvdDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgdGV4dHVyZSA9IG5ldyBXR0wyVGV4dHVyZTJEKHRoaXMsIG5hbWUsIHNsb3QpO1xyXG4gICAgICAgIHJldHVybiB0ZXh0dXJlO1xyXG4gICAgfVxyXG4gICAgc2V0QWN0aXZlKCkge1xyXG4gICAgICAgIHRoaXMuY1Byb2dyYW0uc2V0QWN0aXZlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIEF0bGFzSW1hZ2UgPSB7eDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyLCBpbWc6IEhUTUxJbWFnZUVsZW1lbnQsIG5hbWU6IHN0cmluZ307XHJcblxyXG5leHBvcnQgY2xhc3MgVGV4dHVyZUF0bGFzIHtcclxuICAgIHdpZHRoOiBudW1iZXI7XHJcbiAgICBoZWlnaHQ6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpbWFnZTogSFRNTEltYWdlRWxlbWVudCwgcHVibGljIGJvdW5kczoge1tuYW1lOnN0cmluZ106IEF0bGFzSW1hZ2V9KSB7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IGltYWdlLm5hdHVyYWxXaWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGltYWdlLm5hdHVyYWxIZWlnaHQ7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZnJvbVVybHMoYXJnczogW25hbWU6c3RyaW5nLCB1cmw6c3RyaW5nXVtdLCBwYWRkaW5nID0gMCkge1xyXG4gICAgICAgIGxldCBpbWFnZXM6IEF0bGFzSW1hZ2VbXSA9IFtdO1xyXG4gICAgICAgIGxldCBwcm9taXNlczogUHJvbWlzZTx2b2lkPltdID0gW107XHJcbiAgICAgICAgbGV0IGF0bGFzU2l6ZSA9IDA7XHJcbiAgICAgICAgZm9yKGxldCBbbmFtZSwgdXJsXSBvZiBhcmdzKSB7XHJcbiAgICAgICAgICAgIHByb21pc2VzLnB1c2gobmV3IFByb21pc2U8dm9pZD4oYXN5bmMgcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGE6IEF0bGFzSW1hZ2UgPSB7aW1nLCB4OjAsIHk6MCwgdzppbWcubmF0dXJhbFdpZHRoKzIqcGFkZGluZywgaDppbWcubmF0dXJhbEhlaWdodCsyKnBhZGRpbmcsIG5hbWV9O1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpc0NvbGxpZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCB4PTA7eDw9YXRsYXNTaXplLWRhdGEudzt4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCB5PTA7eTw9YXRsYXNTaXplLWRhdGEuaDt5KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29sbGlkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IG90aGVyIG9mIGltYWdlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHggKyBkYXRhLncgPiBvdGhlci54ICYmIHkgKyBkYXRhLmggPiBvdGhlci55ICYmIHggPCBvdGhlci54ICsgb3RoZXIudyAmJiB5IDwgb3RoZXIueSArIG90aGVyLmgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb2xsaWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighaXNDb2xsaWRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnggPSB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEueSA9IHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWlzQ29sbGlkaW5nKSBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaXNDb2xsaWRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS54ID0gYXRsYXNTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnkgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdGxhc1NpemUgPSBkYXRhLnggKyBkYXRhLnc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlcy5wdXNoKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IHVybDtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XHJcbiAgICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICAgICAgY2FudmFzLndpZHRoID0gYXRsYXNTaXplO1xyXG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBhdGxhc1NpemU7XHJcbiAgICAgICAgbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIikhO1xyXG4gICAgICAgIGxldCBib3VuZHM6IHtbbmFtZTpzdHJpbmddOiBBdGxhc0ltYWdlfSA9IHt9O1xyXG4gICAgICAgIGZvcihsZXQgaW1nIG9mIGltYWdlcykge1xyXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZy5pbWcsIGltZy54ICsgcGFkZGluZywgaW1nLnkgKyBwYWRkaW5nKTtcclxuICAgICAgICAgICAgaWYocGFkZGluZyAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCAwLCAwLCAxLCBpbWcuaC0yKnBhZGRpbmcsIGltZy54LCBpbWcueSArIHBhZGRpbmcsIHBhZGRpbmcsIGltZy5oLTIqcGFkZGluZyk7IC8vIGxlZnRcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgaW1nLnctMipwYWRkaW5nLTEsIDAsIDEsIGltZy5oLTIqcGFkZGluZywgaW1nLngraW1nLnctcGFkZGluZywgaW1nLnkgKyBwYWRkaW5nLCBwYWRkaW5nLCBpbWcuaC0yKnBhZGRpbmcpOyAvLyByaWdodFxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCAwLCAwLCBpbWcudy0yKnBhZGRpbmcsIDEsIGltZy54ICsgcGFkZGluZywgaW1nLnksIGltZy53LTIqcGFkZGluZywgcGFkZGluZyk7IC8vIHRvcFxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCAwLCBpbWcuaC0yKnBhZGRpbmctMSwgaW1nLnctMipwYWRkaW5nLCAxLCBpbWcueCArIHBhZGRpbmcsIGltZy55K2ltZy5oLXBhZGRpbmcsIGltZy53LTIqcGFkZGluZywgcGFkZGluZyk7IC8vIGJvdHRvbVxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCAwLCAwLCAyLCAyLCBpbWcueCwgaW1nLnksIHBhZGRpbmcsIHBhZGRpbmcpOyAvLyB0b3AtbGVmdFxyXG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcuaW1nLCBpbWcudy0yKnBhZGRpbmctMiwgMCwgMiwgMiwgaW1nLngraW1nLnctcGFkZGluZywgaW1nLnksIHBhZGRpbmcsIHBhZGRpbmcpOyAvLyB0b3AtcmlnaHRcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgMCwgaW1nLmgtMipwYWRkaW5nLTIsIDIsIDIsIGltZy54LCBpbWcueStpbWcuaC1wYWRkaW5nLCBwYWRkaW5nLCBwYWRkaW5nKTsgLy8gYm90dG9tLWxlZnRcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLmltZywgaW1nLnctMipwYWRkaW5nLTIsIGltZy5oLTIqcGFkZGluZy0yLCAyLCAyLCBpbWcueCtpbWcudy1wYWRkaW5nLCBpbWcueStpbWcuaC1wYWRkaW5nLCBwYWRkaW5nLCBwYWRkaW5nKTsgLy8gYm90dG9tLXJpZ2h0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW1nLnggPSAoaW1nLnggKyBwYWRkaW5nKSAvIGF0bGFzU2l6ZTtcclxuICAgICAgICAgICAgaW1nLnkgPSAoaW1nLnkgKyBwYWRkaW5nKSAvIGF0bGFzU2l6ZTtcclxuICAgICAgICAgICAgaW1nLncgPSAoaW1nLncgLSAyKnBhZGRpbmcpIC8gYXRsYXNTaXplO1xyXG4gICAgICAgICAgICBpbWcuaCA9IChpbWcuaCAtIDIqcGFkZGluZykgLyBhdGxhc1NpemU7XHJcbiAgICAgICAgICAgIGJvdW5kc1tpbWcubmFtZV0gPSBpbWc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB1cmwgPSBjYW52YXMudG9EYXRhVVJMKCk7XHJcbiAgICAgICAgY29uc3QgYXRsYXNJbWFnZSA9IGF3YWl0IG5ldyBQcm9taXNlPEhUTUxJbWFnZUVsZW1lbnQ+KHJlcyA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlcyhpbWcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGltZy5zcmMgPSB1cmw7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUZXh0dXJlQXRsYXMoYXRsYXNJbWFnZSwgYm91bmRzKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEtleXByZXNzZXMge1xyXG4gICAgc3RhdGljIGtleVByZXNzZWQ6IHtba2V5OnN0cmluZ106IGFueX0gPSB7fTtcclxuICAgIHN0YXRpYyBwcmVzc2VkS2V5czogU2V0PHN0cmluZz4gPSBuZXcgU2V0KCk7XHJcbiAgICBzdGF0aWMga2V5RG93bkV2ZW50ID0gbmV3IFNpZ25hbDxba2V5TmFtZTpzdHJpbmddPigpO1xyXG4gICAgc3RhdGljIGtleVVwRXZlbnQgPSBuZXcgU2lnbmFsPFtrZXlOYW1lOnN0cmluZ10+KCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBrZXlkb3duKGtleTogc3RyaW5nKSB7XHJcbiAgICBLZXlwcmVzc2VzLmtleVByZXNzZWRba2V5XSA9IHRydWU7XHJcbiAgICBLZXlwcmVzc2VzLnByZXNzZWRLZXlzLmFkZChrZXkpO1xyXG4gICAgS2V5cHJlc3Nlcy5rZXlEb3duRXZlbnQuZmlyZShrZXkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24ga2V5dXAoa2V5OiBzdHJpbmcpIHtcclxuICAgIGRlbGV0ZSBLZXlwcmVzc2VzLmtleVByZXNzZWRba2V5XTtcclxuICAgIEtleXByZXNzZXMucHJlc3NlZEtleXMuZGVsZXRlKGtleSk7XHJcbiAgICBLZXlwcmVzc2VzLmtleVVwRXZlbnQuZmlyZShrZXkpO1xyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZSA9PiB7XHJcbiAgICBjb25zdCBrZXkgPSBlLmtleS50b0xvd2VyQ2FzZSgpO1xyXG4gICAga2V5ZG93bihrZXkpO1xyXG59KTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZSA9PiB7XHJcbiAgICBjb25zdCBrZXkgPSBlLmtleS50b0xvd2VyQ2FzZSgpO1xyXG4gICAga2V5dXAoa2V5KTtcclxufSk7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBlID0+IHtcclxuICAgIGlmKGUuYnV0dG9uID09PSAwKSB7XHJcbiAgICAgICAga2V5ZG93bihcImxtYlwiKTtcclxuICAgIH0gZWxzZSBpZihlLmJ1dHRvbiA9PT0gMSkge1xyXG4gICAgICAgIGtleWRvd24oXCJtbWJcIik7XHJcbiAgICB9IGVsc2UgaWYoZS5idXR0b24gPT09IDIpIHtcclxuICAgICAgICBrZXlkb3duKFwicm1iXCIpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBlID0+IHtcclxuICAgIGlmKGUuYnV0dG9uID09PSAwKSB7XHJcbiAgICAgICAga2V5dXAoXCJsbWJcIik7XHJcbiAgICB9IGVsc2UgaWYoZS5idXR0b24gPT09IDEpIHtcclxuICAgICAgICBrZXl1cChcIm1tYlwiKTtcclxuICAgIH0gZWxzZSBpZihlLmJ1dHRvbiA9PT0gMikge1xyXG4gICAgICAgIGtleXVwKFwicm1iXCIpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmV4cG9ydCBjbGFzcyBNZXNoM0Qge1xyXG4gICAgcG9zaXRpb25zOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgdGV4Y29vcmRzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgbm9ybWFsczogbnVtYmVyW10gPSBbXTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuICAgIGNsb25lKCk6IE1lc2gzRCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNZXNoM0QoKS5hcHBlbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICB0cmFuc2xhdGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMucG9zaXRpb25zLmxlbmd0aDsgaSs9Mykge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpXSEgKz0geDtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsxXSEgKz0geTtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsyXSEgKz0gejtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzY2FsZSh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5wb3NpdGlvbnMubGVuZ3RoOyBpKz0zKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2ldISAqPSB4O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzFdISAqPSB5O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpKzJdISAqPSB6O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJvdGF0ZShheDogbnVtYmVyLCBheTogbnVtYmVyLCBhejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5wb3NpdGlvbnMubGVuZ3RoOyBpKz0zKSB7XHJcbiAgICAgICAgICAgIGxldCBwID0gbmV3IFZlYzModGhpcy5wb3NpdGlvbnNbaV0hLCB0aGlzLnBvc2l0aW9uc1tpKzFdISwgdGhpcy5wb3NpdGlvbnNbaSsyXSEpO1xyXG4gICAgICAgICAgICBwLnJvdFhZWlNlbGZDKGF4LCBheSwgYXopO1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uc1tpXSA9IHAueDtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsxXSA9IHAueTtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsyXSA9IHAuejtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5ub3JtYWxzLmxlbmd0aDsgaSs9Mykge1xyXG4gICAgICAgICAgICBsZXQgcCA9IG5ldyBWZWMzKHRoaXMubm9ybWFsc1tpXSEsIHRoaXMubm9ybWFsc1tpKzFdISwgdGhpcy5ub3JtYWxzW2krMl0hKTtcclxuICAgICAgICAgICAgcC5yb3RYWVpTZWxmQyhheCwgYXksIGF6KTtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzW2ldID0gcC54O1xyXG4gICAgICAgICAgICB0aGlzLm5vcm1hbHNbaSsxXSA9IHAueTtcclxuICAgICAgICAgICAgdGhpcy5ub3JtYWxzW2krMl0gPSBwLno7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcm90YXRlQXJvdW5kKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIGF4OiBudW1iZXIsIGF5OiBudW1iZXIsIGF6OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLnBvc2l0aW9ucy5sZW5ndGg7IGkrPTMpIHtcclxuICAgICAgICAgICAgbGV0IHAgPSBuZXcgVmVjMyh0aGlzLnBvc2l0aW9uc1tpXSEgLSB4LCB0aGlzLnBvc2l0aW9uc1tpKzFdISAtIHksIHRoaXMucG9zaXRpb25zW2krMl0hIC0geik7XHJcbiAgICAgICAgICAgIHAucm90WFlaU2VsZkMoYXgsIGF5LCBheik7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2ldID0gcC54ICsgeDtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbnNbaSsxXSA9IHAueSArIHk7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25zW2krMl0gPSBwLnogKyB6O1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLm5vcm1hbHMubGVuZ3RoOyBpKz0zKSB7XHJcbiAgICAgICAgICAgIGxldCBwID0gbmV3IFZlYzModGhpcy5ub3JtYWxzW2ldISwgdGhpcy5ub3JtYWxzW2krMV0hLCB0aGlzLm5vcm1hbHNbaSsyXSEpO1xyXG4gICAgICAgICAgICBwLnJvdFhZWlNlbGZDKGF4LCBheSwgYXopO1xyXG4gICAgICAgICAgICB0aGlzLm5vcm1hbHNbaV0gPSBwLng7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFsc1tpKzFdID0gcC55O1xyXG4gICAgICAgICAgICB0aGlzLm5vcm1hbHNbaSsyXSA9IHAuejtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBhcHBlbmQoLi4ubWVzaGVzOiBNZXNoM0RbXSk6IHRoaXMge1xyXG4gICAgICAgIGZvcihjb25zdCBtZXNoIG9mIG1lc2hlcykge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKC4uLm1lc2gucG9zaXRpb25zKTtcclxuICAgICAgICAgICAgdGhpcy50ZXhjb29yZHMucHVzaCguLi5tZXNoLnRleGNvb3Jkcyk7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFscy5wdXNoKC4uLm1lc2gubm9ybWFscyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcHVzaFBvc2l0aW9ucyhhcnI6IG51bWJlcltdLCB4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKSB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5wb3NpdGlvbnMubGVuZ3RoOyBpKz0zKSB7XHJcbiAgICAgICAgICAgIGFyci5wdXNoKHRoaXMucG9zaXRpb25zW2ldISArIHgpO1xyXG4gICAgICAgICAgICBhcnIucHVzaCh0aGlzLnBvc2l0aW9uc1tpKzFdISArIHkpO1xyXG4gICAgICAgICAgICBhcnIucHVzaCh0aGlzLnBvc2l0aW9uc1tpKzJdISArIHopO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfVxyXG4gICAgc2V0Tm9ybWFscyh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5ub3JtYWxzLmxlbmd0aDsgaSs9Mykge1xyXG4gICAgICAgICAgICB0aGlzLm5vcm1hbHNbaV0gPSB4O1xyXG4gICAgICAgICAgICB0aGlzLm5vcm1hbHNbaSsxXSA9IHk7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFsc1tpKzJdID0gejtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdHJpYW5nbGVzVG9FZGdlcyhwb3NpdGlvbnM6IG51bWJlcltdKTogbnVtYmVyW10ge1xyXG4gICAgICAgIGxldCBlZGdlczogbnVtYmVyW10gPSBbXTtcclxuICAgICAgICBmb3IobGV0IGk9MDsgaTxwb3NpdGlvbnMubGVuZ3RoOyBpKz05KSB7XHJcbiAgICAgICAgICAgIGVkZ2VzLnB1c2gocG9zaXRpb25zW2ldISwgcG9zaXRpb25zW2krMV0hLCBwb3NpdGlvbnNbaSsyXSEsIHBvc2l0aW9uc1tpKzNdISwgcG9zaXRpb25zW2krNF0hLCBwb3NpdGlvbnNbaSs1XSEpO1xyXG4gICAgICAgICAgICBlZGdlcy5wdXNoKHBvc2l0aW9uc1tpKzNdISwgcG9zaXRpb25zW2krNF0hLCBwb3NpdGlvbnNbaSs1XSEsIHBvc2l0aW9uc1tpKzZdISwgcG9zaXRpb25zW2krN10hLCBwb3NpdGlvbnNbaSs4XSEpO1xyXG4gICAgICAgICAgICBlZGdlcy5wdXNoKHBvc2l0aW9uc1tpKzZdISwgcG9zaXRpb25zW2krN10hLCBwb3NpdGlvbnNbaSs4XSEsIHBvc2l0aW9uc1tpXSEsIHBvc2l0aW9uc1tpKzFdISwgcG9zaXRpb25zW2krMl0hKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVkZ2VzO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHRyaWFuZ2xlUXVhZHNUb0VkZ2VzKHBvc2l0aW9uczogbnVtYmVyW10pOiBudW1iZXJbXSB7XHJcbiAgICAgICAgbGV0IGVkZ2VzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHBvc2l0aW9ucy5sZW5ndGg7IGkrPTE4KSB7XHJcbiAgICAgICAgICAgIGVkZ2VzLnB1c2gocG9zaXRpb25zW2ldISwgcG9zaXRpb25zW2krMV0hLCBwb3NpdGlvbnNbaSsyXSEsIHBvc2l0aW9uc1tpKzNdISwgcG9zaXRpb25zW2krNF0hLCBwb3NpdGlvbnNbaSs1XSEpO1xyXG4gICAgICAgICAgICBlZGdlcy5wdXNoKHBvc2l0aW9uc1tpKzNdISwgcG9zaXRpb25zW2krNF0hLCBwb3NpdGlvbnNbaSs1XSEsIHBvc2l0aW9uc1tpKzZdISwgcG9zaXRpb25zW2krN10hLCBwb3NpdGlvbnNbaSs4XSEpO1xyXG4gICAgICAgICAgICBlZGdlcy5wdXNoKHBvc2l0aW9uc1tpKzZdISwgcG9zaXRpb25zW2krN10hLCBwb3NpdGlvbnNbaSs4XSEsIHBvc2l0aW9uc1tpKzldISwgcG9zaXRpb25zW2krMTBdISwgcG9zaXRpb25zW2krMTFdISk7XHJcbiAgICAgICAgICAgIGVkZ2VzLnB1c2gocG9zaXRpb25zW2krOV0hLCBwb3NpdGlvbnNbaSsxMF0hLCBwb3NpdGlvbnNbaSsxMV0hLCBwb3NpdGlvbnNbaSsxMl0hLCBwb3NpdGlvbnNbaSsxM10hLCBwb3NpdGlvbnNbaSsxNF0hKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVkZ2VzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdm94ZWxSYXltYXJjaDxUPihcclxuICAgIG9yaWdpbjogVmVjMyxcclxuICAgIGRpcmVjdGlvbjogVmVjMyxcclxuICAgIHByZWRpY2F0ZTogKHBvczpWZWMzLCBub3JtYWw6VmVjMywgZGlzdDpudW1iZXIpID0+IFQgfCB1bmRlZmluZWQsXHJcbiAgICBtYXhJdGVyYXRpb25zID0gMTAwMFxyXG4pOiBUIHwgdW5kZWZpbmVkIHtcclxuICAgIGNvbnN0IGludkRpckFicyA9IGRpcmVjdGlvbi5yZGl2RigxKS5tYXAoeCA9PiBNYXRoLmFicyh4KSk7XHJcbiAgICBjb25zdCBzaWduID0gZGlyZWN0aW9uLm1hcCh4ID0+IHggPiAwID8gMSA6IDApO1xyXG4gICAgY29uc3Qgc3RlcCA9IGRpcmVjdGlvbi5tYXAoeCA9PiB4ID4gMCA/IDEgOiAtMSk7XHJcbiAgICBsZXQgdE1heFggPSBpbnZEaXJBYnMueCAqIChzaWduLng9PT0wID8gKG9yaWdpbi54IC0gTWF0aC5mbG9vcihvcmlnaW4ueCkpIDogKE1hdGguZmxvb3Iob3JpZ2luLngpICsgMSAtIG9yaWdpbi54KSk7XHJcbiAgICBsZXQgdE1heFkgPSBpbnZEaXJBYnMueSAqIChzaWduLnk9PT0wID8gKG9yaWdpbi55IC0gTWF0aC5mbG9vcihvcmlnaW4ueSkpIDogKE1hdGguZmxvb3Iob3JpZ2luLnkpICsgMSAtIG9yaWdpbi55KSk7XHJcbiAgICBsZXQgdE1heFogPSBpbnZEaXJBYnMueiAqIChzaWduLno9PT0wID8gKG9yaWdpbi56IC0gTWF0aC5mbG9vcihvcmlnaW4ueikpIDogKE1hdGguZmxvb3Iob3JpZ2luLnopICsgMSAtIG9yaWdpbi56KSk7XHJcbiAgICBsZXQgcG9zID0gbmV3IFZlYzMob3JpZ2luKS5tYXBTZWxmKHggPT4gTWF0aC5mbG9vcih4KSk7XHJcbiAgICBsZXQgZGlzdGFuY2UgPSAwO1xyXG4gICAgbGV0IG5vcm1hbCA9IFZlYzMuemVybygpO1xyXG4gICAgZm9yKGxldCBpPTA7IGk8bWF4SXRlcmF0aW9uczsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHJlcyA9IHByZWRpY2F0ZShwb3MsIG5vcm1hbCwgZGlzdGFuY2UpO1xyXG4gICAgICAgIGlmKHJlcyAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgIGlmKHRNYXhYIDwgdE1heFkpIHtcclxuICAgICAgICAgICAgaWYodE1heFggPCB0TWF4Wikge1xyXG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSB0TWF4WDtcclxuICAgICAgICAgICAgICAgIG5vcm1hbC5zZXRDKC1zdGVwLngsIDAsIDApO1xyXG4gICAgICAgICAgICAgICAgdE1heFggKz0gaW52RGlyQWJzLng7XHJcbiAgICAgICAgICAgICAgICBwb3MueCArPSBzdGVwLng7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IHRNYXhaO1xyXG4gICAgICAgICAgICAgICAgbm9ybWFsLnNldEMoMCwgMCwgLXN0ZXAueik7XHJcbiAgICAgICAgICAgICAgICB0TWF4WiArPSBpbnZEaXJBYnMuejtcclxuICAgICAgICAgICAgICAgIHBvcy56ICs9IHN0ZXAuejtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmKHRNYXhZIDwgdE1heFopIHtcclxuICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gdE1heFk7XHJcbiAgICAgICAgICAgICAgICBub3JtYWwuc2V0QygwLCAtc3RlcC55LCAwKTtcclxuICAgICAgICAgICAgICAgIHRNYXhZICs9IGludkRpckFicy55O1xyXG4gICAgICAgICAgICAgICAgcG9zLnkgKz0gc3RlcC55O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSB0TWF4WjtcclxuICAgICAgICAgICAgICAgIG5vcm1hbC5zZXRDKDAsIDAsIC1zdGVwLnopO1xyXG4gICAgICAgICAgICAgICAgdE1heFogKz0gaW52RGlyQWJzLno7XHJcbiAgICAgICAgICAgICAgICBwb3MueiArPSBzdGVwLno7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW50ZXJzZWN0c1dpdGhCb3goXHJcbiAgICBvcmlnaW46IFZlYzMsXHJcbiAgICBkaXJlY3Rpb246IFZlYzMsXHJcbiAgICBib3VuZHM6IFZlYzNbXVxyXG4pIHtcclxuICAgIGNvbnN0IGludkRpciA9IGRpcmVjdGlvbi5yZGl2RigxKTtcclxuICAgIGNvbnN0IHNpZ24gPSBkaXJlY3Rpb24ubWFwKHggPT4geCA+IDAgPyAxIDogMCk7XHJcbiAgICBjb25zdCBzaWduRmxpcCA9IGRpcmVjdGlvbi5tYXAoeCA9PiB4ID4gMCA/IDAgOiAxKTtcclxuICAgIGNvbnN0IHN0ZXBGbGlwID0gZGlyZWN0aW9uLm1hcCh4ID0+IHggPiAwID8gLTEgOiAxKTtcclxuICAgIGxldCB0bWluID0gKGJvdW5kc1tzaWduRmxpcC54XSEueCAtIG9yaWdpbi54KSAqIGludkRpci54O1xyXG4gICAgbGV0IHRtYXggPSAoYm91bmRzW3NpZ24ueF0hLnggLSBvcmlnaW4ueCkgKiBpbnZEaXIueDtcclxuICAgIGxldCBub3JtYWwgPSBuZXcgVmVjMyhzdGVwRmxpcC54LDAsMCk7XHJcbiAgICBsZXQgdHltaW4gPSAoYm91bmRzW3NpZ25GbGlwLnldIS55IC0gb3JpZ2luLnkpICogaW52RGlyLnk7XHJcbiAgICBsZXQgdHltYXggPSAoYm91bmRzW3NpZ24ueV0hLnkgLSBvcmlnaW4ueSkgKiBpbnZEaXIueTtcclxuICAgIGlmKCh0bWluID4gdHltYXgpIHx8ICh0eW1pbiA+IHRtYXgpKSByZXR1cm4gbnVsbDtcclxuICAgIGlmKHR5bWluID4gdG1pbikge1xyXG4gICAgICAgIHRtaW4gPSB0eW1pbjtcclxuICAgICAgICBub3JtYWwgPSBuZXcgVmVjMygwLHN0ZXBGbGlwLnksMCk7XHJcbiAgICB9XHJcbiAgICBpZih0eW1heCA8IHRtYXgpIHRtYXggPSB0eW1heDtcclxuICAgIGxldCB0em1pbiA9IChib3VuZHNbc2lnbkZsaXAuel0hLnogLSBvcmlnaW4ueikgKiBpbnZEaXIuejtcclxuICAgIGxldCB0em1heCA9IChib3VuZHNbc2lnbi56XSEueiAtIG9yaWdpbi56KSAqIGludkRpci56O1xyXG4gICAgaWYoKHRtaW4gPiB0em1heCkgfHwgKHR6bWluID4gdG1heCkpIHJldHVybiBudWxsO1xyXG4gICAgaWYodHptaW4gPiB0bWluKSB7XHJcbiAgICAgICAgdG1pbiA9IHR6bWluO1xyXG4gICAgICAgIG5vcm1hbCA9IG5ldyBWZWMzKDAsMCxzdGVwRmxpcC56KTtcclxuICAgIH1cclxuICAgIGlmKHR6bWF4IDwgdG1heCkgdG1heCA9IHR6bWF4O1xyXG4gICAgY29uc3QgZGlzdGFuY2UgPSB0bWluIDwgMCA/IDAgOiB0bWluO1xyXG4gICAgcmV0dXJuIHsgbm9ybWFsLCBkaXN0YW5jZSwgaW50ZXJzZWN0aW9uOiBvcmlnaW4uYWRkU2NhbGVkKGRpcmVjdGlvbiwgZGlzdGFuY2UpIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQb2ludGVyTG9jayB7XHJcbiAgICBjb25uZWN0aW9ucyA9IG5ldyBDb25uZWN0aW9uR3JvdXAoKTtcclxuICAgIHBvaW50ZXJMb2NrQ2hhbmdlRXZlbnQgPSBuZXcgU2lnbmFsKCk7XHJcbiAgICBsb2NrZWRNb3VzZU1vdmVFdmVudCA9IG5ldyBTaWduYWwoKTtcclxuICAgIGlzRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5hZGQobmV3IEh0bWxDb25uZWN0aW9uKHdpbmRvdywgXCJtb3VzZWRvd25cIiwgKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYodGhpcy5pc0VuYWJsZWQgJiYgZG9jdW1lbnQucG9pbnRlckxvY2tFbGVtZW50ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVxdWVzdFBvaW50ZXJMb2NrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5hZGQobmV3IEh0bWxDb25uZWN0aW9uKHdpbmRvdywgXCJtb3VzZW1vdmVcIiwgKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYoZG9jdW1lbnQucG9pbnRlckxvY2tFbGVtZW50ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2tlZE1vdXNlTW92ZUV2ZW50LmZpcmUoZS5tb3ZlbWVudFgsIGUubW92ZW1lbnRZKTtcclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5hZGQobmV3IEh0bWxDb25uZWN0aW9uKGRvY3VtZW50LCBcInBvaW50ZXJsb2NrY2hhbmdlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wb2ludGVyTG9ja0NoYW5nZUV2ZW50LmZpcmUoZG9jdW1lbnQucG9pbnRlckxvY2tFbGVtZW50ICE9IG51bGwpO1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuICAgIGxvY2soKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5pc0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVxdWVzdFBvaW50ZXJMb2NrKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICB1bmxvY2soKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5pc0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICBkb2N1bWVudC5leGl0UG9pbnRlckxvY2soKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJlbW92ZSgpIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmRpc2Nvbm5lY3RBbGwoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEZ1bGxzY3JlZW5SZXNpemUge1xyXG4gICAgcmVzaXplRXZlbnQ6IFNpZ25hbDxbdzogbnVtYmVyLCBoOiBudW1iZXJdPiA9IG5ldyBTaWduYWwoe1xyXG4gICAgICAgIG9uQ29ubmVjdDogY29ubiA9PiBjb25uLmZpcmUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCksXHJcbiAgICB9KTtcclxuICAgIGNvbm5lY3Rpb25zID0gbmV3IENvbm5lY3Rpb25Hcm91cCgpO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5hZGQobmV3IEh0bWxDb25uZWN0aW9uKHdpbmRvdywgXCJyZXNpemVcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlc2l6ZUV2ZW50LmZpcmUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG4gICAgcmVtb3ZlKCkge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMuZGlzY29ubmVjdEFsbCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIENvbG9yIHtcclxuICAgIC8vIFJHQiAwLTI1NVxyXG4gICAgcjogbnVtYmVyO1xyXG4gICAgZzogbnVtYmVyO1xyXG4gICAgYjogbnVtYmVyO1xyXG4gICAgLy8gQWxwaGEgMC0xMDBcclxuICAgIGE6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIsIGE6IG51bWJlciA9IDEwMCkge1xyXG4gICAgICAgIHRoaXMuciA9IEVNYXRoLmNsYW1wKHIsIDAsIDI1NSk7XHJcbiAgICAgICAgdGhpcy5nID0gRU1hdGguY2xhbXAoZywgMCwgMjU1KTtcclxuICAgICAgICB0aGlzLmIgPSBFTWF0aC5jbGFtcChiLCAwLCAyNTUpO1xyXG4gICAgICAgIHRoaXMuYSA9IEVNYXRoLmNsYW1wKGEsIDAsIDEwMCk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZnJvbUhTVihoOiBudW1iZXIsIHM6IG51bWJlciwgdjogbnVtYmVyLCBhOiBudW1iZXIgPSAxMDApIHtcclxuICAgICAgICBoID0gRU1hdGgucG1vZChoLCAzNjApO1xyXG4gICAgICAgIHMgPSBFTWF0aC5jbGFtcChzLCAwLCAxMDApO1xyXG4gICAgICAgIHYgPSBFTWF0aC5jbGFtcCh2LCAwICwxMDApO1xyXG4gICAgICAgIGNvbnN0IGMgPSB2IC8gMTAwICogcyAvIDEwMDtcclxuICAgICAgICBjb25zdCB4ID0gYyAqICgxIC0gTWF0aC5hYnMoKChoIC8gNjApICUgMikgLSAxKSk7XHJcbiAgICAgICAgY29uc3QgbSA9IHYgLyAxMDAgLSBjO1xyXG4gICAgICAgIGxldCBycD0wLCBncD0wLCBicD0wO1xyXG4gICAgICAgIHN3aXRjaChNYXRoLmZsb29yKGggLyA2MCkpIHtcclxuICAgICAgICAgICAgY2FzZSAwOiBycD1jOyBncD14OyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAxOiBycD14OyBncD1jOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAyOiBncD1jOyBicD14OyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAzOiBncD14OyBicD1jOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA0OiBycD14OyBicD1jOyBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDogcnA9YzsgYnA9eDsgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHIgPSBNYXRoLnJvdW5kKChycCArIG0pICogMjU1KTtcclxuICAgICAgICBjb25zdCBnID0gTWF0aC5yb3VuZCgoZ3AgKyBtKSAqIDI1NSk7XHJcbiAgICAgICAgY29uc3QgYiA9IE1hdGgucm91bmQoKGJwICsgbSkgKiAyNTUpO1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29sb3IociwgZywgYiwgYSk7XHJcbiAgICB9XHJcbiAgICB0b0hTVigpIHtcclxuICAgICAgICBjb25zdCBtYXggPSBNYXRoLm1heCh0aGlzLnIsIHRoaXMuZywgdGhpcy5iKTtcclxuICAgICAgICBjb25zdCBtaW4gPSBNYXRoLm1pbih0aGlzLnIsIHRoaXMuZywgdGhpcy5iKTtcclxuICAgICAgICBjb25zdCBkZWx0YSA9IG1heCAtIG1pbjtcclxuICAgICAgICBsZXQgaCA9IDA7XHJcbiAgICAgICAgaWYoZGVsdGEgIT09IDApIHtcclxuICAgICAgICAgICAgaWYobWF4ID09PSB0aGlzLnIpIGggPSA2MCAqICgoKHRoaXMuZyAtIHRoaXMuYikgLyBkZWx0YSArIDYpICUgNik7XHJcbiAgICAgICAgICAgIGVsc2UgaWYobWF4ID09PSB0aGlzLmcpIGggPSA2MCAqICgodGhpcy5iIC0gdGhpcy5yKSAvIGRlbHRhICsgMik7XHJcbiAgICAgICAgICAgIGVsc2UgaCA9IDYwICogKCh0aGlzLnIgLSB0aGlzLmcpIC8gZGVsdGEgKyA0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoaCA8IDApIGggKz0gMzYwO1xyXG4gICAgICAgIGNvbnN0IHMgPSBtYXggPT09IDAgPyAwIDogZGVsdGEvbWF4KjEwMDtcclxuICAgICAgICBjb25zdCB2ID0gbWF4LzI1NSoxMDA7XHJcbiAgICAgICAgcmV0dXJuIHsgaCwgcywgdiwgYTp0aGlzLmEgfTtcclxuICAgIH1cclxuICAgIGxlcnAob3RoZXI6IENvbG9yLCB0OiBudW1iZXIpOiBDb2xvciB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihcclxuICAgICAgICAgICAgdGhpcy5yICsgKG90aGVyLnIgLSB0aGlzLnIpICogdCxcclxuICAgICAgICAgICAgdGhpcy5nICsgKG90aGVyLmcgLSB0aGlzLmcpICogdCxcclxuICAgICAgICAgICAgdGhpcy5iICsgKG90aGVyLmIgLSB0aGlzLmIpICogdCxcclxuICAgICAgICAgICAgdGhpcy5hICsgKG90aGVyLmEgLSB0aGlzLmEpICogdCxcclxuICAgICAgICApXHJcbiAgICB9XHJcbiAgICBnZXRJc0ZvcmVncm91bmRXaGl0ZSh0aHJlc2hvbGQgPSAwLjQyKSB7XHJcbiAgICAgICAgbGV0IHtyLCBnLCBifSA9IHRoaXM7XHJcbiAgICAgICAgciA9IChyIDwgMC4wMzkyOCkgPyAociAvIDEyLjkyKSA6ICgoKHIgKyAwLjA1NSkgLyAxLjA1NSkgXiAyLjQpXHJcbiAgICAgICAgZyA9IChnIDwgMC4wMzkyOCkgPyAoZyAvIDEyLjkyKSA6ICgoKGcgKyAwLjA1NSkgLyAxLjA1NSkgXiAyLjQpXHJcbiAgICAgICAgYiA9IChiIDwgMC4wMzkyOCkgPyAoYiAvIDEyLjkyKSA6ICgoKGIgKyAwLjA1NSkgLyAxLjA1NSkgXiAyLjQpXHJcbiAgICAgICAgbGV0IGwgPSAwLjIxMjYgKiByICsgMC43MTUyICogZyArIDAuMDcyMiAqIGJcclxuICAgICAgICByZXR1cm4gbCA8IHRocmVzaG9sZDtcclxuICAgIH1cclxuICAgIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGByZ2JhKCR7dGhpcy5yfSwgJHt0aGlzLmd9LCAke3RoaXMuYn0sICR7dGhpcy5hLzEwMH0pYDtcclxuICAgIH1cclxuICAgIHRvQXJyYXkoKTogW3I6IG51bWJlciwgZzogbnVtYmVyLCBiOm51bWJlciwgYTpudW1iZXJdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMuciwgdGhpcy5nLCB0aGlzLmIsIHRoaXMuYV07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBSZW5kZXJMb29wIHtcclxuICAgIHJ1bkluZGV4ID0gMDtcclxuICAgIGlzUnVubmluZyA9IGZhbHNlO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGNhbGxiYWNrOiAoZHQ6IG51bWJlcikgPT4gdm9pZCkge1xyXG5cclxuICAgIH1cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMuaXNSdW5uaW5nKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucnVuSW5kZXgrKztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIGlmKHRoaXMuaXNSdW5uaW5nKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB0aGlzLmlzUnVubmluZyA9IHRydWU7XHJcbiAgICAgICAgbGV0IHJpID0gdGhpcy5ydW5JbmRleDtcclxuICAgICAgICBsZXQgZnJhbWVUaW1lID0gcGVyZm9ybWFuY2Uubm93KCkvMTAwMDtcclxuICAgICAgICBjb25zdCByZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMucnVuSW5kZXggIT0gcmkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgbm93ID0gcGVyZm9ybWFuY2Uubm93KCkvMTAwMDtcclxuICAgICAgICAgICAgbGV0IGR0ID0gbm93IC0gZnJhbWVUaW1lO1xyXG4gICAgICAgICAgICBmcmFtZVRpbWUgPSBub3c7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2soZHQpO1xyXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVuZGVyKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLyBDb2x1bW4tbWFqb3IgM3gzIG1hdHJpeFxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0MyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gICAgc3RhdGljIG5ldygpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAxLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAxLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAxLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgdHJhbnNsYXRlKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgMSwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMSwgMCxcclxuICAgICAgICAgICAgeCwgeSwgMSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHNjYWxlKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgeCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgeSwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJvdGF0ZShhOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKGEpO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIGMsIHMsIDAsXHJcbiAgICAgICAgICAgIC1zLCBjLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAxLFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgbXVsdGlwbHkobTE6IG51bWJlcltdLCBtMjogbnVtYmVyW10pIHtcclxuICAgICAgICBjb25zdCBvdXQgPSBNYXQzLm5ldygpO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPDM7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDsgajwzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIG91dFtpKjMgKyBqXSA9IChcclxuICAgICAgICAgICAgICAgICAgICBtMVswKjMgKyBqXSEgKiBtMltpKjMgKyAwXSFcclxuICAgICAgICAgICAgICAgICAgICArIG0xWzEqMyArIGpdISAqIG0yW2kqMyArIDFdIVxyXG4gICAgICAgICAgICAgICAgICAgICsgbTFbMiozICsgal0hICogbTJbaSozICsgMl0hXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbn0iXX0=