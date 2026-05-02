import EMath from "../utility/EMath";
import Vec2 from "../vectors/Vec2";

export default class Polygon2D {
    positions: number[] = [];
    constructor() { }

    static createPositions(positions: number[]): Polygon2D {
        const poly = new Polygon2D();
        poly.positions = positions;
        return poly;
    }

    static rect(x: number, y: number, w: number, h: number): Polygon2D {
        const x0 = x - w/2;
        const x1 = x + w/2;
        const y0 = y - h/2;
        const y1 = y + h/2;
        return this.createPositions([x0,y0, x1,y0, x1,y1, x0,y1]);
    }

    static circle(x: number, y: number, r: number, arc: number = Math.PI * 2, step = Math.PI / 8): Polygon2D {
        arc = EMath.clamp(arc, 0, Math.PI * 2);
        let positions: number[] = [];
        for(let i=0; i<arc; i+=step) {
            positions.push(Math.cos(i) * r + x, Math.sin(i) * r + y);
        }
        positions.push(Math.cos(arc) * r + x, Math.sin(arc) * r + y);
        return this.createPositions(positions);
    }

    static circleFan(x: number, y: number, r: number, arc: number = Math.PI * 2, step = Math.PI / 8): Polygon2D {
        const poly = this.circle(x, y, r, arc, step);
        poly.positions.splice(0, 0, x, y);
        return poly;
    }

    translateSelf(v: Vec2) {
        return this.translateSelfC(v.x, v.y);
    }

    translateSelfC(x: number, y: number): this {
        for(let i=0; i<this.positions.length; i+=2) {
            this.positions[i]! += x;
            this.positions[i+1]! += y;
        }
        return this;
    }

    scaleSelf(v: Vec2) {
        return this.scaleSelfC(v.x, v.y);
    }

    scaleSelfC(x: number, y: number): this {
        for(let i=0; i<this.positions.length; i+=2) {
            this.positions[i]! *= x;
            this.positions[i+1]! *= y;
        }
        return this;
    }

    rotateSelf(a: number): this {
        for(let i=0; i<this.positions.length; i+=3) {
            let p = new Vec2(this.positions[i]!, this.positions[i+1]!);
            p.rotateSelf(a);
            this.positions[i] = p.x;
            this.positions[i+1] = p.y;
        }
        return this;
    }

    rotateAroundSelf(origin: Vec2, a: number) {
        return this.rotateAroundSelfC(origin.x, origin.y, a);
    }

    rotateAroundSelfC(x: number, y: number, a: number) {
        return this.translateSelfC(-x, -y).rotateSelf(a);
    }

    drawPath(ctx: CanvasRenderingContext2D, sx = 1, sy = 1) {
        ctx.beginPath();
        for(let i=0; i<this.positions.length; i+=2) {
            if(i == 0) ctx.moveTo(this.positions[i]! * sx, this.positions[i+1]! * sy);
            else ctx.lineTo(this.positions[i]! * sx, this.positions[i+1]! * sy);
        }
        ctx.closePath();
    }
    
    getVertex(index: number): Vec2 {
        const j = EMath.pmod(index, Math.floor(this.positions.length/2))*2;
        return new Vec2(this.positions[j]!, this.positions[j+1]!);
    }

    bevelSelf(indices: Set<number> | number[], amount: number): this {
        if(!(indices instanceof Set))
            indices = new Set(indices);
        let newPositions: number[] = [];
        let len = Math.floor(this.positions.length/2);
        for(let index=0; index<len; index++) {
            if(!indices.has(index))
                continue;
            let vA = this.getVertex(index-1);
            let vB = this.getVertex(index);
            let vC = this.getVertex(index+1);
            let tMaxA = vA.distTo(vB);
            let tMaxC = vC.distTo(vB);
            if(indices.has(index-1)) tMaxA /= 2;
            if(indices.has(index+1)) tMaxC /= 2;
            let b1 = vB.addScaled(vB.look(vA), EMath.clamp(amount, 0, tMaxA));
            let b2 = vB.addScaled(vB.look(vC), EMath.clamp(amount, 0, tMaxC));
            newPositions.push(b1.x, b1.y, b2.x, b2.y);
        }
        this.positions = newPositions;
        return this;
    }

    bevelAllSelf(amount: number) {
        let newPositions: number[] = [];
        let len = Math.floor(this.positions.length/2);
        for(let index=0; index<len; index++) {
            let vA = this.getVertex(index-1);
            let vB = this.getVertex(index);
            let vC = this.getVertex(index+1);
            let tMaxA = vA.distTo(vB) / 2;
            let tMaxC = vC.distTo(vB) / 2;
            let b1 = vB.addScaled(vB.look(vA), EMath.clamp(amount, 0, tMaxA));
            let b2 = vB.addScaled(vB.look(vC), EMath.clamp(amount, 0, tMaxC));
            newPositions.push(b1.x, b1.y, b2.x, b2.y);
        }
        this.positions = newPositions;
        return this;
    }
}