export default class Vec3 {
    constructor(public x: number, public y: number, public z: number) { }

    // Static Constructors
    static xAxis() { return new Vec3(1, 0, 0); }
    static yAxis() { return new Vec3(0, 1, 0); }
    static zAxis() { return new Vec3(0, 0, 1); }
    static zero() { return new Vec3(0, 0, 0); }
    static one() { return new Vec3(1, 1, 1); }
    static fill(v: number) { return new Vec3(v, v, v); }
    static fromArray(arr: [number, number, number]) {
        return new Vec3(arr[0], arr[1], arr[2]);
    }
    static fromObject(obj: {x: number, y: number, z: number}) {
        return new Vec3(obj.x, obj.y, obj.z);
    }
    static randomUnit(): Vec3 {
        const z = Math.random() * 2 - 1;
        const a = Math.random() * 2 * Math.PI;
        const b = Math.sqrt(Math.max(0, 1 - z * z));
        return new Vec3(b * Math.cos(a), b * Math.sin(a), z);
    }
    static randomUnitRotation(): Vec3 {
        const v = Vec3.randomUnit();
        return new Vec3(v.pitch(), v.yaw(), Math.random() * 2 * Math.PI);
    }

    // Conversions
    toArray(): [number, number, number] {
        return [this.x, this.y, this.z];
    }
    toString(): string {
        return `<${this.x}, ${this.y}, ${this.z}>`;
    }
    toObject(): {x: number, y: number, z: number} {
        return {x:this.x, y:this.y, z:this.z};
    }

    // Calculations
    lengthSq(): number { return this.x * this.x + this.y * this.y + this.z * this.z; }
    length(): number { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); }
    pitch(): number { return Math.asin(this.y); }
    yaw(): number { return Math.atan2(-this.x, -this.z); }
    isCloseC(x: number, y: number, z: number, e = 1e-6) {
        return Math.abs(this.x - x) < e && Math.abs(this.y - y) < e && Math.abs(this.z - z) < e;
    }
    isClose(other: Vec3, e = 1e-6) { return this.isCloseC(other.x, other.y, other.z, e); }
    isZero(e = 1e-6) {
        return Math.abs(this.x) < e && Math.abs(this.y) < e && Math.abs(this.z) < e
    }
    isNaN() {
        return Number.isNaN(this.x) || Number.isNaN(this.y) || Number.isNaN(this.z);
    }
    isFinite() {
        return Number.isFinite(this.x) && Number.isFinite(this.y) && Number.isFinite(this.z);
    }
    distSqParts(x: number, y: number, z: number): number {
        const dx = this.x - x;
        const dy = this.y - y;
        const dz = this.z - z;
        return dx*dx + dy*dy + dz*dz;
    }
    distSq(other: Vec3): number { return this.distSqParts(other.x, other.y, other.z); }
    distParts(x: number, y: number, z: number): number {
        const dx = this.x - x;
        const dy = this.y - y;
        const dz = this.z - z;
        return Math.sqrt(dx*dx + dy*dy + dz*dz);
    }
    dist(other: Vec3): number { return this.distParts(other.x, other.y, other.z); }
    dotParts(x: number, y: number, z: number): number {
        return this.x * x + this.y * y + this.z * z;
    }
    dot(other: Vec3): number { return this.dotParts(other.x, other.y, other.z); }
    angleParts(x: number, y: number, z: number): number {
        const d = Math.sqrt(this.lengthSq() * (x*x + y*y + z*z));
        if(d === 0) return 0;
        return Math.acos(Math.min(Math.max(this.dotParts(x, y, z) / d, -1), 1));
    }
    angle(other: Vec3): number { return this.angleParts(other.x, other.y, other.z); }
    signedAngle(other: Vec3, normal: Vec3): number {
        const cx = this.y * other.z - this.z * other.y;
        const cy = this.z * other.x - this.x * other.z;
        const cz = this.x * other.y - this.y * other.x;
        const crossLength = Math.sqrt(cx*cx + cy*cy + cz*cz);
        const dot = this.dot(other);
        const angle = Math.atan2(crossLength, dot);
        return normal.dotParts(cx, cy, cz) < 0 ? -angle : angle;
    }
    strictEquals(other: Vec3): boolean {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    // No-Allocation Operations
    copyFrom(other: Vec3): Vec3 {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    }
    addPut(other: Vec3, out: Vec3): Vec3 {
        out.x = this.x + other.x;
        out.y = this.y + other.y;
        out.z = this.z + other.z;
        return out;
    }
    subPut(other: Vec3, out: Vec3): Vec3 {
        out.x = this.x - other.x;
        out.y = this.y - other.y;
        out.z = this.z - other.z;
        return out;
    }
    mulPut(other: Vec3, out: Vec3): Vec3 {
        out.x = this.x * other.x;
        out.y = this.y * other.y;
        out.z = this.z * other.z;
        return out;
    }
    divPut(other: Vec3, out: Vec3): Vec3 {
        out.x = this.x / other.x;
        out.y = this.y / other.y;
        out.z = this.z / other.z;
        return out;
    }
    crossPut(other: Vec3, out: Vec3): Vec3 {
        const cx = this.y * other.z - this.z * other.y;
        const cy = this.z * other.x - this.x * other.z;
        const cz = this.x * other.y - this.y * other.x;
        out.x = cx;
        out.y = cy;
        out.z = cz;
        return out;
    }
    normPut(out: Vec3): Vec3 {
        const len = this.length();
        if(len === 0) {
            out.x = 0;
            out.y = 0;
            out.z = 0;
        } else {
            out.x = this.x / len;
            out.y = this.y / len;
            out.z = this.z / len;
        }
        return out;
    }
    invertPut(out: Vec3): Vec3 {
        out.x = -this.x;
        out.y = -this.y;
        out.z = -this.z;
        return out;
    }
    lerpPut(other: Vec3, t: number, out: Vec3): Vec3 {
        out.x = this.x + (other.x - this.x) * t;
        out.y = this.y + (other.y - this.y) * t;
        out.z = this.z + (other.z - this.z) * t;
        return out;
    }
    rescalePut(length: number, out: Vec3): Vec3 {
        this.normPut(out);
        out.x *= length;
        out.y *= length;
        out.z *= length;
        return out;
    }
    lookPut(other: Vec3, out: Vec3): Vec3 {
        return other.subPut(this, out).normPut(out);
    }
    flatPut(out: Vec3): Vec3 {
        out.x = this.x;
        out.y = 0;
        out.z = this.z;
        return out;
    }
    mapPut(callback: (v: number, i: number) => number, out: Vec3): Vec3 {
        out.x = callback(this.x, 0);
        out.y = callback(this.y, 1);
        out.z = callback(this.z, 2);
        return out;
    }
    redotPut(other: Vec3, targetDot: number, out: Vec3): Vec3 {
        const d = other.lengthSq();
        if(d === 0) return out.copyFrom(this);
        const t = (targetDot - this.dot(other)) / d;
        out.x = this.x + other.x * t;
        out.y = this.y + other.y * t;
        out.z = this.z + other.z * t;
        return out;
    }
    clampLengthPut(min: number, max: number, out: Vec3) {
        const len = Math.min(Math.max(this.length(), min), max);
        return this.rescalePut(len, out);
    }
    transformPut(m: Float32Array | number[], out: Vec3): Vec3 {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        out.x = m[0]!*x + m[4]!*y + m[8]!*z + m[12]!;
        out.y = m[1]!*x + m[5]!*y + m[9]!*z + m[13]!;
        out.z = m[2]!*x + m[6]!*y + m[10]!*z + m[14]!;
        return out;
    }
    applyProjectionPut(m: Float32Array | number[], out: Vec3): Vec3 {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        const w = m[3]! * x + m[7]! * y + m[11]! * z + m[15]!;
        out.x = (m[0]!*x + m[4]!*y + m[8]!*z + m[12]!) / w;
        out.y = (m[1]!*x + m[5]!*y + m[9]!*z + m[13]!) / w;
        out.z = (m[2]!*x + m[6]!*y + m[10]!*z + m[14]!) / w;
        return out;
    }
    rotateXPut(a: number, out: Vec3): Vec3 {
        const s = Math.sin(a);
        const c = Math.cos(a);
        const y = this.y * c - this.z * s;
        out.z = this.y * s + this.z * c;
        out.y = y;
        out.x = this.x;
        return out;
    }
    rotateYPut(a: number, out: Vec3): Vec3 {
        const s = Math.sin(a);
        const c = Math.cos(a);
        const z = this.z * c - this.x * s;
        out.x = this.x * c + this.z * s;
        out.z = z;
        out.y = this.y;
        return out;
    }
    rotateZPut(a: number, out: Vec3): Vec3 {
        const s = Math.sin(a);
        const c = Math.cos(a);
        const x = this.x * c - this.y * s;
        out.y = this.x * s + this.y * c;
        out.x = x;
        out.z = this.z;
        return out;
    }
    rotateAxisPut(a: number, axisUnit: Vec3, out: Vec3): Vec3 {
        const s = Math.sin(a);
        const c = Math.cos(a);
        const crossX = this.y * axisUnit.z - this.z * axisUnit.y;
        const crossY = this.z * axisUnit.x - this.x * axisUnit.z;
        const crossZ = this.x * axisUnit.y - this.y * axisUnit.x;
        const dot = axisUnit.dot(this);
        out.x = this.x * c + crossX * s + axisUnit.x * dot * (1 - c);
        out.y = this.y * c + crossY * s + axisUnit.y * dot * (1 - c);
        out.z = this.z * c + crossZ * s + axisUnit.z * dot * (1 - c);
        return out;
    }
    rotateXyzPut(rotation: Vec3, out: Vec3) {
        return this.rotateXPut(rotation.x, out)
            .rotateYPut(rotation.y, out)
            .rotateZPut(rotation.z, out);
    }
    rotateXyzPartsPut(rx: number, ry: number, rz: number, out: Vec3): Vec3 {
        return this.rotateXPut(rx, out)
            .rotateYPut(ry, out)
            .rotateZPut(rz, out);
    }
    rotateZyxPut(rotation: Vec3, out: Vec3) {
        return this.rotateZPut(rotation.z, out)
            .rotateYPut(rotation.y, out)
            .rotateXPut(rotation.x, out);
    }
    rotateZyxPartsPut(rx: number, ry: number, rz: number, out: Vec3): Vec3 {
        return this.rotateZPut(rz, out)
            .rotateYPut(ry, out)
            .rotateXPut(rx, out);
    }

    addScalarPut(f: number, out: Vec3): Vec3 {
        out.x = this.x + f;
        out.y = this.y + f;
        out.z = this.z + f;
        return out;
    }
    subScalarPut(f: number, out: Vec3): Vec3 {
        out.x = this.x - f;
        out.y = this.y - f;
        out.z = this.z - f;
        return out;
    }
    rsubScalarPut(f: number, out: Vec3): Vec3 {
        out.x = f - this.x;
        out.y = f - this.y;
        out.z = f - this.z;
        return out;
    }
    mulScalarPut(f: number, out: Vec3): Vec3 {
        out.x = this.x * f;
        out.y = this.y * f;
        out.z = this.z * f;
        return out;
    }
    divScalarPut(f: number, out: Vec3): Vec3 {
        out.x = this.x / f;
        out.y = this.y / f;
        out.z = this.z / f;
        return out;
    }
    rdivScalarPut(f: number, out: Vec3): Vec3 {
        out.x = f / this.x;
        out.y = f / this.y;
        out.z = f / this.z;
        return out;
    }

    // Allocation Operations
    clone(): Vec3 { return new Vec3(this.x, this.y, this.z); }
    add(other: Vec3): Vec3 { return this.addPut(other, Vec3.zero()); }
    sub(other: Vec3): Vec3 { return this.subPut(other, Vec3.zero()); }
    mul(other: Vec3): Vec3 { return this.mulPut(other, Vec3.zero()); }
    div(other: Vec3): Vec3 { return this.divPut(other, Vec3.zero()); }
    cross(other: Vec3): Vec3 { return this.crossPut(other, Vec3.zero()); }
    norm(): Vec3 { return this.normPut(Vec3.zero()); }
    invert(): Vec3 { return this.invertPut(Vec3.zero()); }
    lerp(other: Vec3, t: number): Vec3 { return this.lerpPut(other, t, Vec3.zero()); }
    rescale(length: number): Vec3 { return this.rescalePut(length, Vec3.zero()); }
    look(other: Vec3): Vec3 { return this.lookPut(other, Vec3.zero()); }
    flat(): Vec3 { return this.flatPut(Vec3.zero()); }
    map(callback: (v: number, i: number) => number): Vec3 { return this.mapPut(callback, Vec3.zero()); }
    redot(other: Vec3, targetDot: number): Vec3 { return this.redotPut(other, targetDot, Vec3.zero()); }
    clampLength(min: number, max: number): Vec3 { return this.clampLengthPut(min, max, Vec3.zero()); }
    transform(m: number[]): Vec3 { return this.transformPut(m, Vec3.zero()); }
    applyProjection(m: number[]): Vec3 { return this.applyProjectionPut(m, Vec3.zero()); }
    rotateX(a: number): Vec3 { return this.rotateXPut(a, Vec3.zero()); }
    rotateY(a: number): Vec3 { return this.rotateYPut(a, Vec3.zero()); }
    rotateZ(a: number): Vec3 { return this.rotateZPut(a, Vec3.zero()); }
    rotateAxis(a: number, axisUnit: Vec3): Vec3 { return this.rotateAxisPut(a, axisUnit, Vec3.zero()); }
    rotateXyz(rotation: Vec3): Vec3 { return this.rotateXyzPut(rotation, Vec3.zero()); }
    rotateXyzParts(rx: number, ry: number, rz: number): Vec3 { return this.rotateXyzPartsPut(rx, ry, rz, Vec3.zero()); }
    rotateZyx(rotation: Vec3): Vec3 { return this.rotateZyxPut(rotation, Vec3.zero()); }
    rotateZyxParts(rx: number, ry: number, rz: number): Vec3 { return this.rotateZyxPartsPut(rx, ry, rz, Vec3.zero()); }

    addScalar(f: number): Vec3 { return this.addScalarPut(f, Vec3.zero()); }
    subScalar(f: number): Vec3 { return this.subScalarPut(f, Vec3.zero()); }
    rsubScalar(f: number): Vec3 { return this.rsubScalarPut(f, Vec3.zero()); }
    mulScalar(f: number): Vec3 { return this.mulScalarPut(f, Vec3.zero()); }
    divScalar(f: number): Vec3 { return this.divScalarPut(f, Vec3.zero()); }
    rdivScalar(f: number): Vec3 { return this.rdivScalarPut(f, Vec3.zero()); }
}