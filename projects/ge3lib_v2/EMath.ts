export abstract class EMath {
    static clamp(n: number, a: number, b: number): number {
        return Math.min(Math.max(n, a), b);
    }
    static lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }
    static fixedInterp(a: number, b: number, dt: number): number {
        const d = b - a;
        if(Math.abs(d) < dt * 1.1) {
            return b;
        }
        return a + Math.sign(d) * dt;
    }
    static pmod(x: number,a: number) : number {
        return ((x % a) + a) % a;
    }
    static isClose(a: number, b: number, e: number = 1e-6) {
        return Math.abs(a - b) < e;
    }
    static isZero(v: number, e: number = 1e-6) {
        return Math.abs(v) < e;
    }
    static wrapAngle(a: number) {
        return this.pmod(a + Math.PI, Math.PI * 2) - Math.PI;
    }
}