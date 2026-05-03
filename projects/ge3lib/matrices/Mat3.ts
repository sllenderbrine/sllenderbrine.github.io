// Column-major 3x3 matrix
export default abstract class Mat3 {
    constructor() {}

    static new() {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ];
    }
    static translate(x: number, y: number) {
        return [
            1, 0, 0,
            0, 1, 0,
            x, y, 1,
        ];
    }
    static scale(x: number, y: number) {
        return [
            x, 0, 0,
            0, y, 0,
            0, 0, 1,
        ];
    }
    static rotate(a: number) {
        const c = Math.cos(a);
        const s = Math.sin(a);
        return [
            c, s, 0,
            -s, c, 0,
            0, 0, 1,
        ];
    }
    static multiply(m1: number[], m2: number[]) {
        const out = Mat3.new();
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