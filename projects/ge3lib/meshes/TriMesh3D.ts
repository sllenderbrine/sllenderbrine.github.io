import Vec3 from "../vectors/Vec3";

export default class TriMesh3D {
    positions: number[] = [];
    texcoords: number[] = [];
    normals: number[] = [];
    constructor() { }

    clone(): TriMesh3D {
        return new TriMesh3D().append(this);
    }

    translateSelf(v: Vec3): this {
        return this.translateSelfC(v.x, v.y, v.z);
    }

    translateSelfC(x: number, y: number, z: number): this {
        for(let i=0; i<this.positions.length; i+=3) {
            this.positions[i]! += x;
            this.positions[i+1]! += y;
            this.positions[i+2]! += z;
        }
        return this;
    }

    scaleSelf(v: Vec3): this {
        return this.scaleSelfC(v.x, v.y, v.z);
    }

    scaleSelfC(x: number, y: number, z: number): this {
        for(let i=0; i<this.positions.length; i+=3) {
            this.positions[i]! *= x;
            this.positions[i+1]! *= y;
            this.positions[i+2]! *= z;
        }
        return this;
    }

    rotateSelf(v: Vec3) {
        return this.rotateSelfC(v.x, v.y, v.z);
    }

    rotateSelfC(ax: number, ay: number, az: number): this {
        for(let i=0; i<this.positions.length; i+=3) {
            let p = new Vec3(this.positions[i]!, this.positions[i+1]!, this.positions[i+2]!);
            p.rotXYZSelfC(ax, ay, az);
            this.positions[i] = p.x;
            this.positions[i+1] = p.y;
            this.positions[i+2] = p.z;
        }
        for(let i=0; i<this.normals.length; i+=3) {
            let p = new Vec3(this.normals[i]!, this.normals[i+1]!, this.normals[i+2]!);
            p.rotXYZSelfC(ax, ay, az);
            this.normals[i] = p.x;
            this.normals[i+1] = p.y;
            this.normals[i+2] = p.z;
        }
        return this;
    }

    rotateAroundSelf(origin: Vec3, v: Vec3) {
        return this.rotateAroundSelfC(origin.x, origin.y, origin.z, v.x, v.y, v.z);
    }

    rotateAroundSelfC(x: number, y: number, z: number, ax: number, ay: number, az: number): this {
        return this.translateSelfC(-x, -y, -z).rotateSelfC(ax, ay, az).translateSelfC(x, y, z);
    }

    append(...meshes: TriMesh3D[]): this {
        for(const mesh of meshes) {
            this.positions.push(...mesh.positions);
            this.texcoords.push(...mesh.texcoords);
            this.normals.push(...mesh.normals);
        }
        return this;
    }
    
    static getLines(positions: number[]): number[] {
        let edges: number[] = [];
        for(let i=0; i<positions.length; i+=9) {
            edges.push(positions[i]!, positions[i+1]!, positions[i+2]!, positions[i+3]!, positions[i+4]!, positions[i+5]!);
            edges.push(positions[i+3]!, positions[i+4]!, positions[i+5]!, positions[i+6]!, positions[i+7]!, positions[i+8]!);
            edges.push(positions[i+6]!, positions[i+7]!, positions[i+8]!, positions[i]!, positions[i+1]!, positions[i+2]!);
        }
        return edges;
    }

    static getQuadLines(positions: number[]): number[] {
        let edges: number[] = [];
        for(let i=0; i<positions.length; i+=18) {
            edges.push(positions[i]!, positions[i+1]!, positions[i+2]!, positions[i+3]!, positions[i+4]!, positions[i+5]!);
            edges.push(positions[i+3]!, positions[i+4]!, positions[i+5]!, positions[i+6]!, positions[i+7]!, positions[i+8]!);
            edges.push(positions[i+6]!, positions[i+7]!, positions[i+8]!, positions[i+9]!, positions[i+10]!, positions[i+11]!);
            edges.push(positions[i+9]!, positions[i+10]!, positions[i+11]!, positions[i+12]!, positions[i+13]!, positions[i+14]!);
        }
        return edges;
    }
}