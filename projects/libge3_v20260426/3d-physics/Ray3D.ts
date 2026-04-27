import Vec3 from "../vectors/Vec3";

export class Ray3D {
    constructor(public origin: Vec3, public direction: Vec3) {

    }
    raycastVoxels<T>(
        predicate: (pos:Vec3, normal:Vec3, dist:number) => T | undefined,
        maxIterations = 1000
    ): T | undefined {
        const invDirAbs = this.direction.rdivF(1).map(x => Math.abs(x));
        const sign = this.direction.map(x => x > 0 ? 1 : 0);
        const step = this.direction.map(x => x > 0 ? 1 : -1);
        let tMaxX = invDirAbs.x * (sign.x===0 ? (this.origin.x - Math.floor(this.origin.x)) : (Math.floor(this.origin.x) + 1 - this.origin.x));
        let tMaxY = invDirAbs.y * (sign.y===0 ? (this.origin.y - Math.floor(this.origin.y)) : (Math.floor(this.origin.y) + 1 - this.origin.y));
        let tMaxZ = invDirAbs.z * (sign.z===0 ? (this.origin.z - Math.floor(this.origin.z)) : (Math.floor(this.origin.z) + 1 - this.origin.z));
        let pos = new Vec3(this.origin).mapSelf(x => Math.floor(x));
        let distance = 0;
        let normal = Vec3.zero();
        for(let i=0; i<maxIterations; i++) {
            let res = predicate(pos, normal, distance);
            if(res !== undefined)
                return res;
            if(tMaxX < tMaxY) {
                if(tMaxX < tMaxZ) {
                    distance = tMaxX;
                    normal.setC(-step.x, 0, 0);
                    tMaxX += invDirAbs.x;
                    pos.x += step.x;
                } else {
                    distance = tMaxZ;
                    normal.setC(0, 0, -step.z);
                    tMaxZ += invDirAbs.z;
                    pos.z += step.z;
                }
            } else {
                if(tMaxY < tMaxZ) {
                    distance = tMaxY;
                    normal.setC(0, -step.y, 0);
                    tMaxY += invDirAbs.y;
                    pos.y += step.y;
                } else {
                    distance = tMaxZ;
                    normal.setC(0, 0, -step.z);
                    tMaxZ += invDirAbs.z;
                    pos.z += step.z;
                }
            }
        }
        return undefined;
    }
    raycastBox(bounds: Vec3[]) {
        const invDir = this.direction.rdivF(1);
        const sign = this.direction.map(x => x > 0 ? 1 : 0);
        const signFlip = this.direction.map(x => x > 0 ? 0 : 1);
        const stepFlip = this.direction.map(x => x > 0 ? -1 : 1);
        let tmin = (bounds[signFlip.x]!.x - this.origin.x) * invDir.x;
        let tmax = (bounds[sign.x]!.x - this.origin.x) * invDir.x;
        let normal = new Vec3(stepFlip.x,0,0);
        let tymin = (bounds[signFlip.y]!.y - this.origin.y) * invDir.y;
        let tymax = (bounds[sign.y]!.y - this.origin.y) * invDir.y;
        if((tmin > tymax) || (tymin > tmax)) return null;
        if(tymin > tmin) {
            tmin = tymin;
            normal = new Vec3(0,stepFlip.y,0);
        }
        if(tymax < tmax) tmax = tymax;
        let tzmin = (bounds[signFlip.z]!.z - this.origin.z) * invDir.z;
        let tzmax = (bounds[sign.z]!.z - this.origin.z) * invDir.z;
        if((tmin > tzmax) || (tzmin > tmax)) return null;
        if(tzmin > tmin) {
            tmin = tzmin;
            normal = new Vec3(0,0,stepFlip.z);
        }
        if(tzmax < tmax) tmax = tzmax;
        const distance = tmin < 0 ? 0 : tmin;
        return { normal, distance, intersection: this.origin.addScaled(this.direction, distance) };
    }
}