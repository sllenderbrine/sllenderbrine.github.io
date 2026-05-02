import { Mat4 } from "./Mat4.js";
import type { Vec2 } from "./Vec2.js";

// Column-major 3x3 matrix
export class Mat3 {
    elements = new Float32Array(9);
    constructor() {}

    set(
        n11: number, n12: number, n13: number,
        n21: number, n22: number, n23: number,
        n31: number, n32: number, n33: number,
    ): this {
        const m = this.elements;
        m[0] = n11; m[1] = n12; m[2] = n13;
        m[3] = n21; m[4] = n22; m[5] = n23;
        m[6] = n31; m[7] = n32; m[8] = n33;
        return this;
    }
    
    fromIdentity(): this {
        return this.set(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        );
    }
    
    fromTranslation(position: Vec2): this {
        const {x, y} = position;
        return this.set(
            1, 0, 0,
            0, 1, 0,
            x, y, 1,
        );
    }
    
    fromScale(scale: Vec2): this {
        const {x, y} = scale;
        return this.set(
            x, 0, 0,
            0, y, 0,
            0, 0, 1,
        );
    }
    
    fromRotation(angle: number): this {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return this.set(
            c,  s, 0,
            -s, c, 0,
            0,  0, 1,
        );
    }

    fromMat4(m: Mat4) {
        const j = m.elements;
        const n11 = j[0]!;
        const n12 = j[1]!;
        const n13 = j[2]!;
        const n21 = j[4]!;
        const n22 = j[5]!;
        const n23 = j[6]!;
        const n31 = j[8]!;
        const n32 = j[9]!;
        const n33 = j[10]!;
        return this.set(
            n11, n12, n13,
            n21, n22, n23,
            n31, n32, n33,
        );
    }

    fromMul(a: Mat3, b: Mat3): this {
        const j = a.elements;
        const k = b.elements;
        const a0 = j[0]!, a1 = j[1]!, a2 = j[2]!;
        const a3 = j[3]!, a4 = j[4]!, a5 = j[5]!;
        const a6 = j[6]!, a7 = j[7]!, a8 = j[8]!;

        const b0 = k[0]!, b1 = k[1]!, b2 = k[2]!;
        const b3 = k[3]!, b4 = k[4]!, b5 = k[5]!;
        const b6 = k[6]!, b7 = k[7]!, b8 = k[8]!;

        return this.set(
            a0*b0  + a3*b1  + a6*b2,
            a1*b0  + a4*b1  + a7*b2,
            a2*b0  + a5*b1  + a8*b2,

            a0*b3  + a3*b4  + a6*b5,
            a1*b3  + a4*b4  + a7*b5,
            a2*b3  + a5*b4  + a8*b5,

            a0*b6  + a3*b7  + a6*b8,
            a1*b6  + a4*b7  + a7*b8,
            a2*b6  + a5*b7  + a8*b8,
        );
    }

    fromTranspose(m: Mat3) {
        const j = m.elements;
        return this.set(
            j[0]!, j[3]!, j[6]!,
            j[1]!, j[4]!, j[7]!,
            j[2]!, j[5]!, j[8]!,
        );
    }

    fromInvert(m: Mat3): this {
        const j = m.elements;
        const a00 = j[0]!, a01 = j[1]!, a02 = j[2]!;
        const a10 = j[3]!, a11 = j[4]!, a12 = j[5]!;
        const a20 = j[6]!, a21 = j[7]!, a22 = j[8]!;

        const b01 =  a22 * a11 - a12 * a21;
        const b11 = -a22 * a10 + a12 * a20;
        const b21 =  a21 * a10 - a11 * a20;

        let det = a00 * b01 + a01 * b11 + a02 * b21;

        if (det === 0) {
            throw new Error("Mat3.invertInto: matrix not invertible");
        }

        det = 1.0 / det;

        return this.set(
            b01 * det,
            (-a22 * a01 + a02 * a21) * det,
            ( a12 * a01 - a02 * a11) * det,

            b11 * det,
            ( a22 * a00 - a02 * a20) * det,
            (-a12 * a00 + a02 * a10) * det,

            b21 * det,
            (-a21 * a00 + a01 * a20) * det,
            ( a11 * a00 - a01 * a10) * det,
        );
    }

    fromNormal(m: Mat4): this {
        return this.fromMat4(m).fromInvert(this).fromTranspose(this);
    }
}