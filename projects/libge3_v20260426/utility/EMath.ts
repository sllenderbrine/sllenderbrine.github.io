export default abstract class EMath {
    static clamp(n: number,a: number,b: number) : number {
        return Math.min(Math.max(n,a),b);
    }
    static lerp(a: number,b: number,t: number) : number {
        return a+(b-a)*t;
    }
    static pmod(x: number,a: number) : number {
        return ((x%a)+a)%a;
    }
    static isClose(a: number, b: number, e: number = 1e-6) {
        return Math.abs(a-b) < e;
    }
    static isZero(v: number, e: number = 1e-6) {
        return Math.abs(v) < e;
    }
}