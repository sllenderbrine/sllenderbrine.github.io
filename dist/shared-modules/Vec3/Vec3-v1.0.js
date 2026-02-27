export default class Vec3 {
    /* Full 3D vector class for vector operations. */
    x;
    y;
    z;
    constructor(x, y, z) {
        /* Initialize the Vec3 object. */
        if (x === undefined) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        else if (typeof x === "object") {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
        }
        else if (y === undefined) {
            this.x = x;
            this.y = x;
            this.z = x;
        }
        else {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }
    // static constructors
    static random() {
        /* Generate a Vec3 pointing in a random direction with uniform distribution */
        const z = Math.random() * 2 - 1;
        const t = Math.random() * 2 * Math.PI;
        const r = Math.sqrt(Math.max(0, 1 - z * z));
        const x = r * Math.cos(t);
        const y = r * Math.sin(t);
        return new Vec3(x, y, z);
    }
    static randomRotation() {
        /* Get the angles of a Vec3 pointing in a random direction with uniform distribution */
        const v = Vec3.random();
        return new Vec3(v.pitch(), v.yaw(), Math.random() * 2 * Math.PI);
    }
    static one() {
        /* Shortcut to create a new vector with 1 as each component */
        return new Vec3(1, 1, 1);
    }
    static zero() {
        /* Shortcut to create a new vector with 0 as each component */
        return new Vec3();
    }
    static xAxis() {
        /* Shortcut to create a unit vector pointing along the position x direction */
        return new Vec3(1, 0, 0);
    }
    static yAxis() {
        /* Shortcut to create a unit vector pointing along the position y direction */
        return new Vec3(0, 1, 0);
    }
    static zAxis() {
        /* Shortcut to create a unit vector pointing along the position z direction */
        return new Vec3(0, 0, 1);
    }
    static forward(rotation) {
        /* Get the forward basis vector given a rotation */
        return Vec3.zAxis().rotateXYZSelf(rotation);
    }
    static right(rotation) {
        /* Get the right basis vector given a rotation */
        return Vec3.xAxis().rotateXYZSelf(rotation);
    }
    static up(rotation) {
        /* Get the up basis vector given a rotation */
        return Vec3.yAxis().rotateXYZSelf(rotation);
    }
    // getter methods
    lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    length() {
        return Math.sqrt(this.lengthSq());
    }
    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }
    cross(other) {
        return new Vec3(this.y * other.z - this.z * other.y, this.z * other.x - this.x * other.z, this.x * other.y - this.y * other.x);
    }
    angleTo(other) {
        const lenProduct = this.length() * other.length();
        if (lenProduct === 0)
            return 0;
        return Math.acos(this.dot(other) / lenProduct);
    }
    distanceTo(other) {
        return (this.subtract(other)).length();
    }
    yaw() {
        return Math.atan2(this.z, this.x);
    }
    pitch() {
        return Math.asin(this.y);
    }
    strictEquals(other) {
        return this.x == other.x && this.y == other.y && this.z == other.z;
    }
    equals(other, e = 1e-6) {
        return Math.abs(this.x - other.x) < e && Math.abs(this.y - other.y) < e && Math.abs(this.z - other.z) < e;
    }
    // non-destructive modify methods
    add(other) {
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    subtract(other) {
        return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
    }
    multiply(s) {
        return new Vec3(this.x * s, this.y * s, this.z * s);
    }
    divide(s) {
        return new Vec3(this.x / s, this.y / s, this.z / s);
    }
    negative() {
        return new Vec3(-this.x, -this.y, -this.z);
    }
    get(i) {
        switch (i) {
            case 0: return this.x;
            case 1: return this.y;
            case 2: return this.z;
        }
        return undefined;
    }
    *iterate() {
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
    normalize() {
        return this.clone().normalizeSelf();
    }
    lerp(other, t) {
        return this.clone().lerpSelf(other, t);
    }
    flat() {
        return this.clone().flattenSelf();
    }
    rescale(length) {
        return this.clone().rescaleSelf(length);
    }
    rotateX(angle) {
        return this.clone().rotateXSelf(angle);
    }
    rotateY(angle) {
        return this.clone().rotateYSelf(angle);
    }
    rotateZ(angle) {
        return this.clone().rotateZSelf(angle);
    }
    rotateXYZ(rotation) {
        return this.clone().rotateXYZSelf(rotation);
    }
    rotateZYX(rotation) {
        return this.clone().rotateZYXSelf(rotation);
    }
    // destructive modify methods
    addSelf(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }
    subtractSelf(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }
    multiplySelf(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }
    divideSelf(s) {
        this.x /= s;
        this.y /= s;
        this.z /= s;
        return this;
    }
    negativeSelf() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }
    normalizeSelf() {
        const mag = this.length();
        if (mag == 0)
            return this;
        this.divideSelf(mag);
        return this;
    }
    lerpSelf(other, t) {
        this.x = this.x + (other.x - this.x) * t;
        this.y = this.y + (other.y - this.y) * t;
        this.z = this.z + (other.z - this.z) * t;
        return this;
    }
    flattenSelf() {
        this.y = 0;
        return this;
    }
    rescaleSelf(length) {
        this.normalizeSelf().multiplySelf(length);
        return this;
    }
    rotateXSelf(angle) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const newY = this.y * c - this.z * s;
        const newZ = this.y * s + this.z * c;
        this.y = newY;
        this.z = newZ;
        return this;
    }
    rotateYSelf(angle) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const newX = this.z * c - this.x * s;
        const newZ = this.z * s + this.x * c;
        this.x = newX;
        this.z = newZ;
        return this;
    }
    rotateZSelf(angle) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const newX = this.x * c - this.y * s;
        const newY = this.x * s + this.y * c;
        this.x = newX;
        this.y = newY;
        return this;
    }
    rotateXYZSelf(rotation) {
        return this.rotateXSelf(rotation.x).rotateYSelf(rotation.y).rotateZSelf(rotation.z);
    }
    rotateZYXSelf(rotation) {
        return this.rotateZSelf(rotation.z).rotateYSelf(rotation.y).rotateXSelf(rotation.x);
    }
}
//# sourceMappingURL=Vec3-v1.0.js.map