import Vec2 from "../vectors/Vec2.js";

export default class Ray2D {
    constructor(public origin: Vec2, public direction: Vec2) {

    }
    raycastGrid<T>(
        predicate: (pos:Vec2, normal:Vec2, dist:number) => T | undefined,
        maxIterations = 1000
    ): T | undefined {
        const invDirAbs = this.direction.rdivF(1).map(x => Math.abs(x));
        const sign = this.direction.map(x => x > 0 ? 1 : 0);
        const step = this.direction.map(x => x > 0 ? 1 : -1);
        let tMaxX = invDirAbs.x * (sign.x===0 ? (this.origin.x - Math.floor(this.origin.x)) : (Math.floor(this.origin.x) + 1 - this.origin.x));
        let tMaxY = invDirAbs.y * (sign.y===0 ? (this.origin.y - Math.floor(this.origin.y)) : (Math.floor(this.origin.y) + 1 - this.origin.y));
        let pos = new Vec2(this.origin).mapSelf(x => Math.floor(x));
        let distance = 0;
        let normal = Vec2.zero();
        for(let i=0; i<maxIterations; i++) {
            let res = predicate(pos, normal, distance);
            if(res !== undefined)
                return res;
            if(tMaxX < tMaxY) {
                distance = tMaxX;
                normal.setC(-step.x, 0);
                tMaxX += invDirAbs.x;
                pos.x += step.x;
            } else {
                distance = tMaxY;
                normal.setC(0, -step.y);
                tMaxY += invDirAbs.y;
                pos.y += step.y;
            }
        }
        return undefined;
    }
}