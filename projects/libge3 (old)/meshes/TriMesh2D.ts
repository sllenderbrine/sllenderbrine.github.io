import Vec2 from "../vectors/Vec2";

export default class TriMesh2D {
    positions: number[] = [];
    texcoords: number[] = [];
    constructor() { }
    
    clone(): TriMesh2D {
        return new TriMesh2D().append(this);
    }

    translateSelf(v: Vec2): this {
        return this.translateSelfC(v.x, v.y);
    }

    translateSelfC(x: number, y: number): this {
        for(let i=0; i<this.positions.length; i+=2) {
            this.positions[i]! += x;
            this.positions[i+1]! += y;
        }
        return this;
    }

    scaleSelf(v: Vec2): this {
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
        for(let i=0; i<this.positions.length; i+=2) {
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

    rotateAroundSelfC(x: number, y: number, a: number): this {
        return this.translateSelfC(-x, -y).rotateSelf(a).translateSelfC(x, y);
    }

    append(...meshes: TriMesh2D[]): this {
        for(const mesh of meshes) {
            this.positions.push(...mesh.positions);
            this.texcoords.push(...mesh.texcoords);
        }
        return this;
    }
}