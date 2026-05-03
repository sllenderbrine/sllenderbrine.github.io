import EMath from "../utility/EMath";
import Vec2 from "../vectors/Vec2";
import Vec3 from "../vectors/Vec3";

export default abstract class Noise {
    static randomConstant3(a: number, b: number, c: number) : number {
        const it = (a * 2394823549) ^ (b * 43859742850) ^ (c * 23094565234);
        return EMath.pmod(it, 10000) / 10000;
    }
    static randomConstant4(a: number, b: number, c: number, d: number) : number {
        const it = (a * 2394823549) ^ (b * 43859742850) ^ (c * 23094565234) ^ (d * 8427824566);
        return EMath.pmod(it, 10000) / 10000;
    }
    static fade(t: number) : number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    static generatePerlin2DGradients(count = 12) {
        const gradients: Vec2[] = [];
        for(let i=0; i<count; i++) {
            const angle = 2 * Math.PI * i/count;
            gradients.push(new Vec2(Math.cos(angle), Math.sin(angle)));
        }
        return gradients;
    }
    static getPerlin2DVectorAt(x: number, y: number, seed: number, gradients: Vec2[]) : Vec2 {
        return gradients[Math.floor(this.randomConstant3(seed, x, y) * gradients.length)]!;
    }
    static getPerlin2DValueAt(x: number, y: number, seed: number, gradients: Vec2[]) : number {
        const getPerlin2DVectorAt = this.getPerlin2DVectorAt.bind(this);
        const lerp = EMath.lerp;
        const fade = this.fade;
        const g0 = new Vec2(x, y).mapSelf(Math.floor);
        const g1 = new Vec2(g0).addSelfC(1, 1);
        const f0 = new Vec2(x, y).subSelf(g0);
        const f1 = new Vec2(x, y).subSelf(g1);
        const cAA = getPerlin2DVectorAt(g0.x, g0.y, seed, gradients).dot(f0);
        const cAB = getPerlin2DVectorAt(g0.x, g1.y, seed, gradients).dotC(f0.x, f1.y);
        const cBA = getPerlin2DVectorAt(g1.x, g0.y, seed, gradients).dotC(f1.x, f0.y);
        const cBB = getPerlin2DVectorAt(g1.x, g1.y, seed, gradients).dot(f1);
        const tx = fade(f0.x);
        const ty = fade(f0.y);
        const cA = lerp(cAA, cBA, tx);
        const cB = lerp(cAB, cBB, tx);
        const c = lerp(cA, cB, ty);
        return EMath.clamp(c * 0.5 + 0.5, 0, 1);
    }
    static generatePerlin3DGradients(count = 16) {
        const gradients: Vec3[] = [];
        for(let i=0;i<count;i++) {
            const y = 1 - (2*i)/(count-1);
            const r = Math.sqrt(1-y*y);
            const angle = i * Math.PI * (3-Math.sqrt(5));
            gradients.push(new Vec3(
                Math.cos(angle) * r,
                y,
                Math.sin(angle) * r,
            ));
        }
        return gradients;
    }
    static getPerlin3DVectorAt(x: number, y: number, z: number, seed: number, gradients: Vec3[]) : Vec3 {
        return gradients[Math.floor(this.randomConstant4(seed, x, y, z) * gradients.length)]!;
    }
    static getPerlin3DValueAt(x: number, y: number, z: number, seed: number, gradients: Vec3[]) : number {
        const getPerlin3DVectorAt = this.getPerlin3DVectorAt.bind(this);
        const lerp = EMath.lerp;
        const fade = this.fade;
        const g0 = new Vec3(x, y, z).mapSelf(Math.floor);
        const g1 = new Vec3(g0).addSelfC(1, 1, 1);
        const f0 = new Vec3(x, y, z).subSelf(g0);
        const f1 = new Vec3(x, y, z).subSelf(g1);
        const cAAA = getPerlin3DVectorAt(g0.x, g0.y, g0.z, seed, gradients).dot(f0);
        const cAAB = getPerlin3DVectorAt(g0.x, g0.y, g1.z, seed, gradients).dotC(f0.x, f0.y, f1.z);
        const cABA = getPerlin3DVectorAt(g0.x, g1.y, g0.z, seed, gradients).dotC(f0.x, f1.y, f0.z);
        const cABB = getPerlin3DVectorAt(g0.x, g1.y, g1.z, seed, gradients).dotC(f0.x, f1.y, f1.z);
        const cBAA = getPerlin3DVectorAt(g1.x, g0.y, g0.z, seed, gradients).dotC(f1.x, f0.y, f0.z);
        const cBAB = getPerlin3DVectorAt(g1.x, g0.y, g1.z, seed, gradients).dotC(f1.x, f0.y, f1.z);
        const cBBA = getPerlin3DVectorAt(g1.x, g1.y, g0.z, seed, gradients).dotC(f1.x, f1.y, f0.z);
        const cBBB = getPerlin3DVectorAt(g1.x, g1.y, g1.z, seed, gradients).dot(f1);
        const tx = fade(f0.x);
        const ty = fade(f0.y);
        const tz = fade(f0.z);
        const cAA = lerp(cAAA, cBAA, tx);
        const cAB = lerp(cAAB, cBAB, tx);
        const cBA = lerp(cABA, cBBA, tx);
        const cBB = lerp(cABB, cBBB, tx);
        const cA = lerp(cAA, cBA, ty);
        const cB = lerp(cAB, cBB, ty);
        const c = lerp(cA, cB, tz);
        return EMath.clamp(c * 0.5 + 0.5, 0, 1);
    }
    static getWorley2DPositionAtGrid(x: number, y: number, seed: number, offsetAmp: number) {
        const xo = (this.randomConstant3(x, y, seed+1) - 0.5) * offsetAmp;
        const yo = (this.randomConstant3(x, y, seed+2) - 0.5) * offsetAmp;
        return new Vec2(x + xo, y + yo);
    }
    static getWorley2DValueAtGrid(x: number, y: number, seed: number) {
        return this.randomConstant3(x, y, seed);
    }
    static getWorley2DAt(x: number, y: number, seed: number, offsetAmp: number, search?: number) {
        search = search ?? Math.ceil(offsetAmp) + 1;
        const gx = Math.floor(x);
        const gy = Math.floor(y);
        let minDist = Infinity;
        let minDist2 = Infinity;
        let value = 0;
        let value2 = 0;
        for(let ix=gx-search; ix<=gx+search; ix++) {
            for(let iy=gy-search; iy<=gy+search; iy++) {
                let point = this.getWorley2DPositionAtGrid(ix, iy, seed, offsetAmp);
                let dist = point.distToC(x, y);
                if(dist < minDist) {
                    minDist2 = minDist;
                    value2 = value;
                    minDist = dist;
                    value = this.getWorley2DValueAtGrid(ix, iy, seed);
                } else if(dist < minDist2) {
                    minDist2 = dist;
                    value2 = this.getWorley2DValueAtGrid(ix, iy, seed);
                }
            }
        }
        return { value, value2, minDist, minDist2 };
    }
    static getWorley3DPositionAtGrid(x: number, y: number, z: number, seed: number, offsetAmp: number) {
        const xo = (this.randomConstant4(x, y, z, seed+1) - 0.5) * offsetAmp;
        const yo = (this.randomConstant4(x, y, z, seed+2) - 0.5) * offsetAmp;
        const zo = (this.randomConstant4(x, y, z, seed+3) - 0.5) * offsetAmp;
        return new Vec3(x + xo, y + yo, z + zo);
    }
    static getWorley3DValueAtGrid(x: number, y: number, z: number, seed: number) {
        return this.randomConstant4(x, y, z, seed);
    }
    static getWorley3DAt(x: number, y: number, z: number, seed: number, offsetAmp: number, search?: number) {
        search = search ?? Math.ceil(offsetAmp) + 1;
        const gx = Math.floor(x);
        const gy = Math.floor(y);
        const gz = Math.floor(z);
        let minDist = Infinity;
        let minDist2 = Infinity;
        let value = 0;
        let value2 = 0;
        for(let ix=gx-search; ix<=gx+search; ix++) {
            for(let iy=gy-search; iy<=gy+search; iy++) {
                for(let iz=gz-search; iz<=gz+search; iz++) {
                    let point = this.getWorley3DPositionAtGrid(ix, iy, iz, seed, offsetAmp);
                    let dist = point.distToC(x, y, z);
                    if(dist < minDist) {
                        minDist2 = minDist;
                        value2 = value;
                        minDist = dist;
                        value = this.getWorley3DValueAtGrid(ix, iy, iz, seed);
                    } else if(dist < minDist2) {
                        minDist2 = dist;
                        value2 = this.getWorley3DValueAtGrid(ix, iy, iz, seed);
                    }
                }
            }
        }
        return { value, value2, minDist, minDist2 };
    }
}