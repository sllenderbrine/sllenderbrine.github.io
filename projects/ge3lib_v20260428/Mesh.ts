export class Mesh {
    positions: number[] = [];
    texcoords: number[] = [];
    normals: number[] = [];
    constructor() { }
    transformSelf(
        callback: (
            position: [number, number, number],
            texcoord: [number, number],
            normal: [number, number, number]
        ) => void
    ): this {
        let position: [number, number, number] = [0, 0, 0];
        let texcoord: [number, number] = [0, 0];
        let normal: [number, number, number] = [0, 0, 0];
        for(let i=0; i<this.positions.length/3; i++) {
            const positionIndex = i * 3;
            const texcoordIndex = i * 2;
            position[0] = this.positions[positionIndex]!;
            position[1] = this.positions[positionIndex+1]!;
            position[2] = this.positions[positionIndex+2]!;
            texcoord[0] = this.texcoords[texcoordIndex]!;
            texcoord[1] = this.texcoords[texcoordIndex+1]!;
            normal[0] = this.normals[positionIndex]!;
            normal[1] = this.normals[positionIndex+1]!;
            normal[2] = this.normals[positionIndex+2]!;
            callback(position, texcoord, normal);
            this.positions[positionIndex] = position[0];
            this.positions[positionIndex+1] = position[1];
            this.positions[positionIndex+2] = position[2];
            this.texcoords[texcoordIndex] = texcoord[0];
            this.texcoords[texcoordIndex+1] = texcoord[1];
            this.normals[positionIndex] = normal[0];
            this.normals[positionIndex+1] = normal[1];
            this.normals[positionIndex+2] = normal[2];
        }
        return this;
    }
    concatSelf(...meshes: Mesh[]): this {
        for(const mesh of meshes) {
            this.positions.push(...mesh.positions);
            this.texcoords.push(...mesh.texcoords);
            this.normals.push(...mesh.normals);
        }
        return this;
    }
    clone(): Mesh {
        const out = new Mesh();
        out.positions.push(...this.positions);
        out.texcoords.push(...this.texcoords);
        out.normals.push(...this.normals);
        return out;
    }
}