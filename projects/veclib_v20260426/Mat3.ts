// Column-major 3x3 matrix
export abstract class Mat3 {
    constructor() {}

    // Identity
    static newIdentity(): Float32Array {
        const out = new Float32Array(9);
        out[0] = 1;
        out[4] = 1;
        out[8] = 1;
        return out;
    }

    // Partial Constructors
    static partialTranslation(): Float32Array {
        const out = new Float32Array(9);
        out[0] = 1;
        out[4] = 1;
        out[8] = 1;
        return out;
    }
    static partialScale(): Float32Array {
        const out = new Float32Array(9);
        out[8] = 1;
        return out;
    }
    static partialRotation(): Float32Array {
        const out = new Float32Array(9);
        out[8] = 1;
        return out;
    }

    // Partial Modifiers
    static setTranslation(x: number, y: number, out: Float32Array): Float32Array {
        out[6] = x;
        out[7] = y;
        return out;
    }
    static setScale(x: number, y: number, out: Float32Array): Float32Array {
        out[0] = x;
        out[4] = y;
        return out;
    }
    static setRotation(a: number, out: Float32Array): Float32Array {
        const c = Math.cos(a);
        const s = Math.sin(a);
        out[0] = c;
        out[1] = s;
        out[3] = -s
        out[4] = c;
        return out;
    }

    // Full Constructors
    static translation(x: number, y: number): Float32Array {
        return this.setTranslation(x, y, this.partialTranslation());
    }
    static scale(x: number, y: number): Float32Array {
        return this.setScale(x, y, this.partialScale());
    }
    static rotation(a: number) {
        return this.setRotation(a, this.partialRotation());
    }

    // Full Modifiers
    static fromIdentity(out: Float32Array): Float32Array {
        out[0]=1; out[1]=0; out[2]=0;
        out[3]=0; out[4]=1; out[5]=0;
        out[6]=0; out[7]=0; out[8]=1;
        return out;
    }
    static fromTranslation(x: number, y: number, out: Float32Array): Float32Array {
        out[0]=1; out[1]=0; out[2]=0;
        out[3]=0; out[4]=1; out[5]=0;
        /*out[6]=0; out[7]=0;*/ out[8]=1;
        return this.setTranslation(x, y, out);
    }
    static fromScale(x: number, y: number, out: Float32Array): Float32Array {
        /*out[0]=0;*/ out[1]=0; out[2]=0;
        out[3]=0; /*out[4]=0;*/ out[5]=0;
        out[6]=0; out[7]=0; out[8]=1;
        return this.setScale(x, y, out);
    }
    static fromRotation(a: number, out: Float32Array): Float32Array {
        /*out[0]=0; out[1]=0;*/ out[2]=0;
        /*out[3]=0; out[4]=0;*/ out[5]=0;
        out[6]=0; out[7]=0; out[8]=1;
        return this.setRotation(a, out);
    }
    static fromMat4(m4: Float32Array, out: Float32Array) {
        out[0] = m4[0]!;
        out[1] = m4[1]!;
        out[2] = m4[2]!;

        out[3] = m4[4]!;
        out[4] = m4[5]!;
        out[5] = m4[6]!;
        
        out[6] = m4[8]!;
        out[7] = m4[9]!;
        out[8] = m4[10]!;
        return out;
    }

    // Operations
    static multiplyPut(a: Float32Array | number[], b: Float32Array | number[], out: Float32Array): Float32Array {
        const a0 = a[0]!, a1 = a[1]!, a2 = a[2]!;
        const a3 = a[3]!, a4 = a[4]!, a5 = a[5]!;
        const a6 = a[6]!, a7 = a[7]!, a8 = a[8]!;

        const b0 = b[0]!, b1 = b[1]!, b2 = b[2]!;
        const b3 = b[3]!, b4 = b[4]!, b5 = b[5]!;
        const b6 = b[6]!, b7 = b[7]!, b8 = b[8]!;

        out[0] = a0*b0  + a3*b1  + a6*b2;
        out[1] = a1*b0  + a4*b1  + a7*b2;
        out[2] = a2*b0  + a5*b1  + a8*b2;

        out[3] = a0*b3  + a3*b4  + a6*b5;
        out[4] = a1*b3  + a4*b4  + a7*b5;
        out[5] = a2*b3  + a5*b4  + a8*b5;

        out[6] = a0*b6  + a3*b7  + a6*b8;
        out[7] = a1*b6  + a4*b7  + a7*b8;
        out[8] = a2*b6  + a5*b7  + a8*b8;

        return out;
    }
    static transposePut(m: Float32Array, out: Float32Array) {
        if (out === m) {
            let tmp: number;
            tmp = m[1]!; m[1] = m[3]!; m[3] = tmp;
            tmp = m[2]!; m[2] = m[6]!; m[6] = tmp;
            tmp = m[5]!; m[5] = m[7]!; m[7] = tmp;
            return m;
        }

        out[0] = m[0]!;
        out[1] = m[3]!;
        out[2] = m[6]!;

        out[3] = m[1]!;
        out[4] = m[4]!;
        out[5] = m[7]!;

        out[6] = m[2]!;
        out[7] = m[5]!;
        out[8] = m[8]!;

        return out;
    }
    static invertPut(m: Float32Array, out: Float32Array): Float32Array {
        const a00 = m[0]!, a01 = m[1]!, a02 = m[2]!;
        const a10 = m[3]!, a11 = m[4]!, a12 = m[5]!;
        const a20 = m[6]!, a21 = m[7]!, a22 = m[8]!;

        const b01 =  a22 * a11 - a12 * a21;
        const b11 = -a22 * a10 + a12 * a20;
        const b21 =  a21 * a10 - a11 * a20;

        let det = a00 * b01 + a01 * b11 + a02 * b21;

        if (det === 0) {
            throw new Error("Mat3.invertInto: matrix not invertible");
        }

        det = 1.0 / det;

        out[0] = b01 * det;
        out[1] = (-a22 * a01 + a02 * a21) * det;
        out[2] = ( a12 * a01 - a02 * a11) * det;

        out[3] = b11 * det;
        out[4] = ( a22 * a00 - a02 * a20) * det;
        out[5] = (-a12 * a00 + a02 * a10) * det;

        out[6] = b21 * det;
        out[7] = (-a21 * a00 + a01 * a20) * det;
        out[8] = ( a11 * a00 - a01 * a10) * det;

        return out;
    }
    static mat4ToNormalPut(m4: Float32Array, out: Float32Array): Float32Array {
        this.fromMat4(m4, out);
        this.invertPut(out, out);
        this.transposePut(out, out);
        return out;
    }

    static multiply(m1: Float32Array | number[], m2: Float32Array | number[]): Float32Array {
        return this.multiplyPut(m1, m2, new Float32Array(9));
    }
    static transpose(m: Float32Array): Float32Array {
        return this.transposePut(m, new Float32Array(9));
    }
    static modelToNormal(m4: Float32Array): Float32Array {
        return this.mat4ToNormalPut(m4, new Float32Array(9));
    }
}