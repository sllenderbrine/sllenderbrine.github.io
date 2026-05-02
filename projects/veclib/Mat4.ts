import type { Vec3 } from "./Vec3.js";

// Column-major 4x4 matrix
export class Mat4 {
    elements = new Float32Array(16);
    constructor() { }

    set(
        n11: number, n12: number, n13: number, n14: number,
        n21: number, n22: number, n23: number, n24: number,
        n31: number, n32: number, n33: number, n34: number,
        n41: number, n42: number, n43: number, n44: number,
    ): this {
        const m = this.elements;
        m[ 0] = n11; m[ 1] = n12; m[ 2] = n13; m[ 3] = n14;
        m[ 4] = n21; m[ 5] = n22; m[ 6] = n23; m[ 7] = n24;
        m[ 8] = n31; m[ 9] = n32; m[10] = n33; m[11] = n34;
        m[12] = n41; m[13] = n42; m[14] = n43; m[15] = n44;
        return this;
    }
    
    fromIdentity(): this {
        return this.set(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        );
    }

    fromTranslation(position: Vec3): this {
        const {x, y, z} = position;
        return this.set(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1,
        );
    }
    
    fromScale(scale: Vec3): this {
        const {x, y, z} = scale;
        return this.set(
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1,
        );
    }

    fromRotationYXZ(rotation: Vec3): this {
        const sx = Math.sin(rotation.x), cx = Math.cos(rotation.x);
        const sy = Math.sin(rotation.y), cy = Math.cos(rotation.y);
        const sz = Math.sin(rotation.z), cz = Math.cos(rotation.z);
        const sxsy = sx * sy;
        const sxcy = sx * cy;

        const n11 = cz*cy + -sz*sxsy;
        const n12 = sz*cy + cz*sxsy;
        const n13 = cx*-sy;
        const n21 = -sz*cx;
        const n22 = cz*cx;
        const n23 = sx;
        const n31 = cz*sy + sz*sxcy;
        const n32 = sz*sy + cz*-sxcy;
        const n33 = cx*cy;

        return this.set(
            n11, n12, n13, 0,
            n21, n22, n23, 0,
            n31, n32, n33, 0,
            0,   0,   0,   1,
        );
    }

    fromPerspective(fovY: number, aspect: number, near: number, far: number): this {
        const f = 1 / Math.tan(fovY / 2);
        const nf = 1 / (near - far);
        
        const n11 = f/aspect;
        const n33 = (far + near) * nf;
        const n43 = 2 * far * near * nf;

        return this.set(
            n11, 0, 0,   0,
            0,   f, 0,   0,
            0,   0, n33, -1,
            0,   0, n43, 0,
        );
    }

    fromCameraView(position: Vec3, rotation: Vec3): this {
        // (rz * (rx * ry)) * translation
        // and flips signs of position and angles
        const ax = -rotation.x;
        const ay = -rotation.y;
        const az = -rotation.z;

        const sx = Math.sin(ax), cx = Math.cos(ax);
        const sy = Math.sin(ay), cy = Math.cos(ay);
        const sz = Math.sin(az), cz = Math.cos(az);
        const sxsy = sx * sy;
        const sxcy = sx * cy;

        const n11  = cz*cy + -sz*sxsy;
        const n12  = sz*cy + cz*sxsy;
        const n13  = cx*-sy;

        const n21  = -sz*cx;
        const n22  = cz*cx;
        const n23  = sx;

        const n31  = cz*sy + sz*sxcy;
        const n32  = sz*sy + cz*-sxcy;
        const n33 = cx*cy;

        const {x, y, z} = position;
        const n41 = -(n11*x + n21*y + n31*z);
        const n42 = -(n12*x + n22*y + n32*z);
        const n43 = -(n13*x + n23*y + n33*z);

        return this.set(
            n11, n12, n13, 0,
            n21, n22, n23, 0,
            n31, n32, n33, 0,
            n41, n42, n43, 1
        );
    }

    fromMul(a: Mat4, b: Mat4): this {
        const j = a.elements;
        const k = b.elements;
        const a0  = j[0]!,  a1  = j[1]!,  a2  = j[2]!,  a3  = j[3]!;
        const a4  = j[4]!,  a5  = j[5]!,  a6  = j[6]!,  a7  = j[7]!;
        const a8  = j[8]!,  a9  = j[9]!,  a10 = j[10]!, a11 = j[11]!;
        const a12 = j[12]!, a13 = j[13]!, a14 = j[14]!, a15 = j[15]!;

        const b0  = k[0]!,  b1  = k[1]!,  b2  = k[2]!,  b3  = k[3]!;
        const b4  = k[4]!,  b5  = k[5]!,  b6  = k[6]!,  b7  = k[7]!;
        const b8  = k[8]!,  b9  = k[9]!,  b10 = k[10]!, b11 = k[11]!;
        const b12 = k[12]!, b13 = k[13]!, b14 = k[14]!, b15 = k[15]!;

        return this.set(
            a0*b0  + a4*b1  + a8*b2   + a12*b3,
            a1*b0  + a5*b1  + a9*b2   + a13*b3,
            a2*b0  + a6*b1  + a10*b2  + a14*b3,
            a3*b0  + a7*b1  + a11*b2  + a15*b3,

            a0*b4  + a4*b5  + a8*b6   + a12*b7,
            a1*b4  + a5*b5  + a9*b6   + a13*b7,
            a2*b4  + a6*b5  + a10*b6  + a14*b7,
            a3*b4  + a7*b5  + a11*b6  + a15*b7,

            a0*b8  + a4*b9  + a8*b10  + a12*b11,
            a1*b8  + a5*b9  + a9*b10  + a13*b11,
            a2*b8  + a6*b9  + a10*b10 + a14*b11,
            a3*b8  + a7*b9  + a11*b10 + a15*b11,

            a0*b12 + a4*b13 + a8*b14  + a12*b15,
            a1*b12 + a5*b13 + a9*b14  + a13*b15,
            a2*b12 + a6*b13 + a10*b14 + a14*b15,
            a3*b12 + a7*b13 + a11*b14 + a15*b15,
        );
    }
}