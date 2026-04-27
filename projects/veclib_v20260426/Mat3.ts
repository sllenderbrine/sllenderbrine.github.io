// Column-major 3x3 matrix
export default abstract class Mat3 {
    constructor() {}

    static identity(): Float32Array {
        const m = new Float32Array(9);
        m[0] = 1;
        m[4] = 1;
        m[8] = 1;
        return m;
    }
    static translate(x: number, y: number): Float32Array {
        const m = this.identity();
        m[6] = x;
        m[7] = y;
        return m;
    }
    static scale(x: number, y: number): Float32Array {
        const m = new Float32Array(9);
        m[0] = x;
        m[4] = y;
        m[8] = 1;
        return m;
    }
    static rotate(a: number): Float32Array {
        const c = Math.cos(a);
        const s = Math.sin(a);
        const m = new Float32Array(9);
        m[0] = c;
        m[1] = s;
        m[3] = -s
        m[4] = c;
        m[8] = 1;
        return m;
    }
    static multiply(m1: Float32Array | number[], m2: Float32Array | number[]): Float32Array {
        const out = new Float32Array(9);
        for(let i=0; i<3; i++) {
            for(let j=0; j<3; j++) {
                out[i*3 + j] = (
                    m1[0*3 + j]! * m2[i*3 + 0]!
                    + m1[1*3 + j]! * m2[i*3 + 1]!
                    + m1[2*3 + j]! * m2[i*3 + 2]!
                );
            }
        }
        return out;
    }
}