// Column-major 4x4 matrix
export default abstract class Mat4 {
    constructor() {}

    // Identity
    static newIdentity(): Float32Array {
        const out = new Float32Array(16);
        out[0] = 1;
        out[5] = 1;
        out[10] = 1;
        out[15] = 1;
        return out;
    }

    // Partial Constructors
    static newTranslation(): Float32Array {
        const out = new Float32Array(16);
        out[0] = 1;
        out[5] = 1;
        out[10] = 1;
        out[15] = 1;
        return out;
    }
    static newScale(): Float32Array {
        const out = new Float32Array(16);
        out[15] = 1;
        return out;
    }
    static newPerspective(): Float32Array {
        const out = new Float32Array(16);
        out[11] = -1;
        return out;
    }
    static newRotationX(): Float32Array {
        const out = new Float32Array(16);
        out[0] = 1;
        out[15] = 1;
        return out;
    }
    static newRotationY(): Float32Array {
        const out = new Float32Array(16);
        out[5] = 1;
        out[15] = 1;
        return out;
    }
    static newRotationZ(): Float32Array {
        const out = new Float32Array(16);
        out[10] = 1;
        out[15] = 1;
        return out;
    }
    static newEuler(): Float32Array {
        const out = new Float32Array(16);
        out[15] = 1;
        return out;
    }
    static newView(): Float32Array {
        const out = new Float32Array(16);
        out[15] = 1;
        return out;
    }

    // Partial Modifiers
    static setTranslation(out: Float32Array, x: number, y: number, z: number): Float32Array {
        out[12] = x;
        out[13] = y;
        out[14] = z;
        return out;
    }
    static setScale(out: Float32Array, x: number, y: number, z: number): Float32Array {
        out[0] = x;
        out[5] = y;
        out[10] = z;
        return out;
    }
    static setPerspective(out: Float32Array, fovY: number, aspect: number, near: number, far: number): Float32Array {
        const f = 1 / Math.tan(fovY / 2);
        const nf = 1 / (near - far);
        out[0] = f/aspect;
        out[5] = f;
        out[10] = (far + near) * nf;
        out[14] = (2 * far * near) * nf;
        return out;
    }
    static setRotationX(out: Float32Array, a: number): Float32Array {
        const c = Math.cos(a);
        const s = Math.sin(a);
        out[5] = c;
        out[6] = s;
        out[9] = -s;
        out[10] = c;
        return out;
    }
    static setRotationY(out: Float32Array, a: number): Float32Array {
        const c = Math.cos(a);
        const s = Math.sin(a);
        out[0] = c;
        out[2] = -s;
        out[8] = s;
        out[10] = c;
        return out;
    }
    static setRotationZ(out: Float32Array, a: number): Float32Array {
        const c = Math.cos(a);
        const s = Math.sin(a);
        out[0] = c;
        out[1] = s;
        out[4] = -s;
        out[5] = c;
        return out;
    }
    static setEuler(out: Float32Array, ax: number, ay: number, az: number): Float32Array {
        const sx = Math.sin(ax), cx = Math.cos(ax);
        const sy = Math.sin(ay), cy = Math.cos(ay);
        const sz = Math.sin(az), cz = Math.cos(az);
        const sxsy = sx * sy;
        const cxsy = cx * sy;
        const cysx = cy * sx;

        out[0]  = cy * cz + sxsy * sz;
        out[1]  = cx * sz;
        out[2]  = cysx * sz - sy * cz;

        out[4]  = cy * -sz + sxsy * cz;
        out[5]  = cx * cz;
        out[6]  = -sy * -sz - cysx * cz;

        out[8]  = cxsy;
        out[9]  = -sx;
        out[10] = cx * cy;

        return out;
    }
    static setView(out: Float32Array, px: number, py: number, pz: number, ax: number, ay: number, az: number): Float32Array {
        ax = -ax; ay = -ay; az = -az;

        const sx = Math.sin(ax), cx = Math.cos(ax);
        const sy = Math.sin(ay), cy = Math.cos(ay);
        const sz = Math.sin(az), cz = Math.cos(az);
        const sxsy = sx * sy;
        const cxsy = cx * sy;

        const m00 = cy * cz + sxsy * sz;
        const m01 = cx * sz;
        const m02 = cy * sx * sz - sy * cz;

        const m10 = -cy * sz + sxsy * cz;
        const m11 = cx * cz;
        const m12 = sy * sz + cy * sx * cz;

        const m20 = cxsy;
        const m21 = -sx;
        const m22 = cx * cy;

        out[0] = m00; out[1] = m01; out[2] = m02; out[3] = 0;
        out[4] = m10; out[5] = m11; out[6] = m12; out[7] = 0;
        out[8] = m20; out[9] = m21; out[10] = m22; out[11] = 0;

        out[12] = -(m00 * px + m10 * py + m20 * pz);
        out[13] = -(m01 * px + m11 * py + m21 * pz);
        out[14] = -(m02 * px + m12 * py + m22 * pz);
        out[15] = 1;
        
        return out;
    }

    // Full Constructors
    static translation(x: number, y: number, z: number): Float32Array {
        return this.setTranslation(this.newTranslation(), x, y, z);
    }
    static scale(x: number, y: number, z: number): Float32Array {
        return this.setScale(this.newScale(), x, y, z);
    }
    static perspective(fovY: number, aspect: number, near: number, far: number): Float32Array {
        return this.setPerspective(this.newPerspective(), fovY, aspect, near, far);
    }
    static rotationX(a: number): Float32Array {
        return this.setRotationX(this.newRotationX(), a);
    }
    static rotationY(a: number): Float32Array {
        return this.setRotationY(this.newRotationY(), a);
    }
    static rotationZ(a: number): Float32Array {
        return this.setRotationZ(this.newRotationZ(), a);
    }
    static euler(ax: number, ay: number, az: number): Float32Array {
        return this.setEuler(this.newEuler(), ax, ay, az);
    }
    static view(px: number, py: number, pz: number, ax: number, ay: number, az: number): Float32Array {
        return this.setView(this.newView(), px, py, pz, ax, ay, az);
    }

    // Full Modifiers
    static fromIdentity(out: Float32Array): Float32Array {
        out[0]=1; out[1]=0; out[2]=0; out[3]=0;
        out[4]=0; out[5]=1; out[6]=0; out[7]=0;
        out[8]=0; out[9]=0; out[10]=1;out[11]=0;
        out[12]=0;out[13]=0;out[14]=0;out[15]=1;
        return out;
    }
    static fromTranslation(out: Float32Array, x: number, y: number, z: number): Float32Array {
        out[0]=1; out[1]=0; out[2]=0; out[3]=0;
        out[4]=0; out[5]=1; out[6]=0; out[7]=0;
        out[8]=0; out[9]=0; out[10]=1;out[11]=0;
        /*out[12]=0;out[13]=0;out[14]=0;*/out[15]=1;
        return this.setTranslation(out, x, y, z);
    }
    static fromScale(out: Float32Array, x: number, y: number, z: number): Float32Array {
        /*out[0]=0;*/ out[1]=0; out[2]=0; out[3]=0;
        out[4]=0; /*out[5]=0;*/ out[6]=0; out[7]=0;
        out[8]=0; out[9]=0; /*out[10]=0;*/out[11]=0;
        out[12]=0;out[13]=0;out[14]=0;out[15]=1;
        return this.setScale(out, x, y, z);
    }
    static fromPerspective(out: Float32Array, fovY: number, aspect: number, near: number, far: number): Float32Array {
        /*out[0]=0;*/ out[1]=0; out[2]=0; out[3]=0;
        out[4]=0; /*out[5]=0;*/ out[6]=0; out[7]=0;
        out[8]=0; out[9]=0; /*out[10]=0;*/out[11]=-1;
        out[12]=0;out[13]=0;/*out[14]=0;*/out[15]=0;
        return this.setPerspective(out, fovY, aspect, near, far);
    }
    static fromRotationX(out: Float32Array, a: number): Float32Array {
        out[0]=1; out[1]=0; out[2]=0; out[3]=0;
        out[4]=0; /*out[5]=0; out[6]=0;*/ out[7]=0;
        out[8]=0; /*out[9]=0; out[10]=0;*/out[11]=0;
        out[12]=0;out[13]=0;out[14]=0;out[15]=1;
        return this.setRotationX(out, a);
    }
    static fromRotationY(out: Float32Array, a: number): Float32Array {
        /*out[0]=0;*/ out[1]=0; /*out[2]=0;*/ out[3]=0;
        out[4]=0; out[5]=1; out[6]=0; out[7]=0;
        /*out[8]=0;*/ out[9]=0; /*out[10]=0;*/out[11]=0;
        out[12]=0;out[13]=0;out[14]=0;out[15]=1;
        return this.setRotationY(out, a);
    }
    static fromRotationZ(out: Float32Array, a: number): Float32Array {
        /*out[0]=0; out[1]=0;*/ out[2]=0; out[3]=0;
        /*out[4]=0; out[5]=0;*/ out[6]=0; out[7]=0;
        out[8]=0; out[9]=0; out[10]=1;out[11]=0;
        out[12]=0;out[13]=0;out[14]=0;out[15]=1;
        return this.setRotationZ(out, a);
    }
    static fromEuler(out: Float32Array, ax: number, ay: number, az: number): Float32Array {
        /*out[0]=0; out[1]=0; out[2]=0;*/ out[3]=0;
        /*out[4]=0; out[5]=0; out[6]=0;*/ out[7]=0;
        /*out[8]=0; out[9]=0; out[10]=0;*/out[11]=0;
        out[12]=0;out[13]=0;out[14]=0;out[15]=1;
        return this.setEuler(out, ax, ay, az);
    }
    static fromView(out: Float32Array, px: number, py: number, pz: number, ax: number, ay: number, az: number): Float32Array {
        /*out[0]=1; out[1]=0; out[2]=0;*/ out[3]=0;
        /*out[4]=0; out[5]=1; out[6]=0;*/ out[7]=0;
        /*out[8]=0; out[9]=0; out[10]=1;*/out[11]=0;
        /*out[12]=0;out[13]=0;out[14]=0;*/out[15]=1;
        return this.setView(out, px, py, pz, ax, ay, az);
    }

    // Operations
    static multiplyInto(a: Float32Array | number[], b: Float32Array | number[], out: Float32Array): Float32Array {
        const a0  = a[0]!,  a1  = a[1]!,  a2  = a[2]!,  a3  = a[3]!;
        const a4  = a[4]!,  a5  = a[5]!,  a6  = a[6]!,  a7  = a[7]!;
        const a8  = a[8]!,  a9  = a[9]!,  a10 = a[10]!, a11 = a[11]!;
        const a12 = a[12]!, a13 = a[13]!, a14 = a[14]!, a15 = a[15]!;

        const b0  = b[0]!,  b1  = b[1]!,  b2  = b[2]!,  b3  = b[3]!;
        const b4  = b[4]!,  b5  = b[5]!,  b6  = b[6]!,  b7  = b[7]!;
        const b8  = b[8]!,  b9  = b[9]!,  b10 = b[10]!, b11 = b[11]!;
        const b12 = b[12]!, b13 = b[13]!, b14 = b[14]!, b15 = b[15]!;

        out[0]  = a0*b0  + a4*b1  + a8*b2   + a12*b3;
        out[1]  = a1*b0  + a5*b1  + a9*b2   + a13*b3;
        out[2]  = a2*b0  + a6*b1  + a10*b2  + a14*b3;
        out[3]  = a3*b0  + a7*b1  + a11*b2  + a15*b3;

        out[4]  = a0*b4  + a4*b5  + a8*b6   + a12*b7;
        out[5]  = a1*b4  + a5*b5  + a9*b6   + a13*b7;
        out[6]  = a2*b4  + a6*b5  + a10*b6  + a14*b7;
        out[7]  = a3*b4  + a7*b5  + a11*b6  + a15*b7;

        out[8]  = a0*b8  + a4*b9  + a8*b10  + a12*b11;
        out[9]  = a1*b8  + a5*b9  + a9*b10  + a13*b11;
        out[10] = a2*b8  + a6*b9  + a10*b10 + a14*b11;
        out[11] = a3*b8  + a7*b9  + a11*b10 + a15*b11;

        out[12] = a0*b12 + a4*b13 + a8*b14  + a12*b15;
        out[13] = a1*b12 + a5*b13 + a9*b14  + a13*b15;
        out[14] = a2*b12 + a6*b13 + a10*b14 + a14*b15;
        out[15] = a3*b12 + a7*b13 + a11*b14 + a15*b15;

        return out;
    }
    static multiply(m1: Float32Array | number[], m2: Float32Array | number[]): Float32Array {
        return this.multiplyInto(m1, m2, new Float32Array(16));
    }
}