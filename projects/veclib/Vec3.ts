export class Vec3 {
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
    clone(): Vec3 {
        return new Vec3(this.x, this.y, this.z);
    }
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
    lengthSq(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    pitch(): number {
        return Math.asin(this.y);
    }
    yaw(): number {
        return Math.atan2(-this.x, -this.z);
    }
    isClose(other: Vec3, e = 1e-6) {
        return Math.abs(this.x - other.x) < e && Math.abs(this.y - other.y) < e && Math.abs(this.z - other.z) < e;
    }
    isZero(e = 1e-6) {
        return Math.abs(this.x) < e && Math.abs(this.y) < e && Math.abs(this.z) < e;
    }
    isNaN() {
        return Number.isNaN(this.x) || Number.isNaN(this.y) || Number.isNaN(this.z);
    }
    isFinite() {
        return Number.isFinite(this.x) && Number.isFinite(this.y) && Number.isFinite(this.z);
    }
    distSq(other: Vec3): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dz = this.z - other.z;
        return dx*dx + dy*dy + dz*dz;
    }
    dist(other: Vec3): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dz = this.z - other.z;
        return Math.sqrt(dx*dx + dy*dy + dz*dz);
    }
    dot(other: Vec3): number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }
    angle(other: Vec3): number {
        const d = Math.sqrt(this.lengthSq() * (other.x*other.x + other.y*other.y + other.z*other.z));
        if(d === 0) return 0;
        return Math.acos(Math.min(Math.max(this.dot(other) / d, -1), 1));
    }
    signedAngle(other: Vec3, normal: Vec3): number {
        const cx = this.y * other.z - this.z * other.y;
        const cy = this.z * other.x - this.x * other.z;
        const cz = this.x * other.y - this.y * other.x;
        const crossLength = Math.sqrt(cx*cx + cy*cy + cz*cz);
        const dot = this.dot(other);
        const angle = Math.atan2(crossLength, dot);
        const crossNormalDot = cx*normal.x + cy*normal.y + cz*normal.z;
        return crossNormalDot < 0 ? -angle : angle;
    }
    strictEquals(other: Vec3): boolean {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    // Operations
    fromVector(other: Vec3): this {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    }
    fromArray(arr: [number, number, number, ...number[]]): this {
        this.x = arr[0];
        this.y = arr[1];
        this.z = arr[2];
        return this;
    }
    fromObject(obj: {x: number, y: number, z: number}): this {
        this.x = obj.x;
        this.y = obj.y;
        this.z = obj.z;
        return this;
    }
    fromAdd(a: Vec3, b: Vec3): this {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    }
    fromSub(a: Vec3, b: Vec3): this {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    }
    fromMul(a: Vec3, b: Vec3): this {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        return this;
    }
    fromDiv(a: Vec3, b: Vec3): this {
        this.x = a.x / b.x;
        this.y = a.y / b.y;
        this.z = a.z / b.z;
        return this;
    }
    fromCross(a: Vec3, b: Vec3): this {
        const cx = a.y * b.z - a.z * b.y;
        const cy = a.z * b.x - a.x * b.z;
        const cz = a.x * b.y - a.y * b.x;
        this.x = cx;
        this.y = cy;
        this.z = cz;
        return this;
    }
    fromNorm(a: Vec3): this {
        const len = a.length();
        if(len === 0) return this.fromVector(a);
        this.x = a.x / len;
        this.y = a.y / len;
        this.z = a.z / len;
        return this;
    }
    fromLerp(a: Vec3, b: Vec3, t: number): this {
        this.x = a.x + (b.x - a.x) * t;
        this.y = a.y + (b.y - a.y) * t;
        this.z = a.z + (b.z - a.z) * t;
        return this;
    }
    add(other: Vec3): this {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }
    sub(other: Vec3): this {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }
    mul(other: Vec3): this {
        this.x *= other.x;
        this.y *= other.y;
        this.z *= other.z;
        return this;
    }
    div(other: Vec3): this {
        this.x /= other.x;
        this.y /= other.y;
        this.z /= other.z;
        return this;
    }
    negate(): this {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }
    addScalar(v: number) {
        this.x += v;
        this.y += v;
        this.z += v;
        return this;
    }
    mulScalar(v: number) {
        this.x *= v;
        this.y *= v;
        this.z *= v;
        return this;
    }
    addScaled(other: Vec3, v: number) {
        this.x += other.x * v;
        this.y += other.y * v;
        this.z += other.z * v;
        return this;
    }
    norm(): this {
        const len = this.length();
        if(len === 0) return this;
        this.x /= len;
        this.y /= len;
        this.z /= len;
        return this;
    }
    rescale(length: number): this {
        return this.norm().mulScalar(length);
    }
    look(other: Vec3): this {
        return this.fromSub(other, this).norm();
    }
    flatten(): this {
        this.y = 0;
        return this;
    }
    map(callback: (v: number, i: number) => number): this {
        this.x = callback(this.x, 0);
        this.y = callback(this.y, 1);
        this.z = callback(this.z, 2);
        return this;
    }
    redot(other: Vec3, targetDot: number): this {
        const d = other.lengthSq();
        if(d === 0) return this.fromVector(other);
        const t = (targetDot - this.dot(other)) / d;
        this.x = this.x + other.x * t;
        this.y = this.y + other.y * t;
        this.z = this.z + other.z * t;
        return this;
    }
    clampLength(min: number, max: number): this {
        const len = this.length();
        if(len < min) return this.rescale(min);
        else if(len > max) return this.rescale(max);
        return this;
    }
    applyMatrix(m: Float32Array): this {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        this.x = m[0]!*x + m[4]!*y + m[8]!*z + m[12]!;
        this.y = m[1]!*x + m[5]!*y + m[9]!*z + m[13]!;
        this.z = m[2]!*x + m[6]!*y + m[10]!*z + m[14]!;
        return this;
    }
    applyProjection(m: Float32Array): this {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        const w = m[3]! * x + m[7]! * y + m[11]! * z + m[15]!;
        this.x = (m[0]!*x + m[4]!*y + m[8]!*z + m[12]!) / w;
        this.y = (m[1]!*x + m[5]!*y + m[9]!*z + m[13]!) / w;
        this.z = (m[2]!*x + m[6]!*y + m[10]!*z + m[14]!) / w;
        return this;
    }
    rotateX(angle: number): this {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const y = this.y * c - this.z * s;
        this.z = this.y * s + this.z * c;
        this.y = y;
        this.x = this.x;
        return this;
    }
    rotateY(angle: number): this {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const z = this.z * c - this.x * s;
        this.x = this.x * c + this.z * s;
        this.z = z;
        this.y = this.y;
        return this;
    }
    rotateZ(angle: number): this {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const x = this.x * c - this.y * s;
        this.y = this.x * s + this.y * c;
        this.x = x;
        this.z = this.z;
        return this;
    }
    rotateAxis(axisUnit: Vec3, angle: number): this {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const crossX = this.y * axisUnit.z - this.z * axisUnit.y;
        const crossY = this.z * axisUnit.x - this.x * axisUnit.z;
        const crossZ = this.x * axisUnit.y - this.y * axisUnit.x;
        const dot = axisUnit.dot(this);
        this.x = this.x * c + crossX * s + axisUnit.x * dot * (1 - c);
        this.y = this.y * c + crossY * s + axisUnit.y * dot * (1 - c);
        this.z = this.z * c + crossZ * s + axisUnit.z * dot * (1 - c);
        return this;
    }
    rotateXyz(rotation: Vec3): this {
        return this.rotateX(rotation.x).rotateY(rotation.y).rotateZ(rotation.z);
    }
    rotateZyx(rotation: Vec3): this {
        return this.rotateZ(rotation.z).rotateY(rotation.y).rotateX(rotation.x);
    }
}