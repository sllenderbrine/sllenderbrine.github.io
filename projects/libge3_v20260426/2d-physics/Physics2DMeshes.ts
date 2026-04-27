import TriMesh2D from "../meshes/TriMesh2D.js";

export let Circle2DMesh = new TriMesh2D();
for(let i=0; i<16; i++) {
    let a1 = i/16 * Math.PI * 2;
    let a2 = (i+1)/16 * Math.PI * 2;
    Circle2DMesh.positions.push(Math.cos(a1), Math.sin(a1));
    Circle2DMesh.positions.push(0, 0);
    Circle2DMesh.positions.push(Math.cos(a2), Math.sin(a2));
}
export let Circle2DPositionsF32 = new Float32Array(Circle2DMesh.positions);
export let Rect2DMesh = new TriMesh2D();
Rect2DMesh.positions.push(-1,-1,1,-1,1,1,-1,-1,-1,1,1,1);
export let Rect2DPositionsF32 = new Float32Array(Rect2DMesh.positions);