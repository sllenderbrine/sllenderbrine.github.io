import { Camera3D, Keypresses, Mesh, RenderLoop, Vec3, WGL2Shader } from "../gelib3_v20260428/index.js";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.style = `
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
    object-fit: contain;
`;
canvas.width = 640;
canvas.height = 360;
const gl = canvas.getContext("webgl2");

const shader = new WGL2Shader(
    gl,
    `#version 300 es
        in vec3 a_position;
        uniform mat4 u_perspective;
        uniform mat4 u_view;
        void main() {
            gl_Position = u_perspective * u_view * vec4(a_position, 1);
        }
    `, `#version 300 es
        precision highp float;
        out vec4 outColor;
        void main() {
            outColor = vec4(1, 0, 0, 1);
        }
    `
);
const uPerspective = shader.createUniform("u_perspective", "mat4");
const uView = shader.createUniform("u_view", "mat4");
const aPosition = shader.addAttribute("a_position", "vec3");

const camera = new Camera3D();
camera.aspect = canvas.width / canvas.height;
camera.invalidateProjection();

const planeFront = new Mesh();
planeFront.positions.push(-1,-1,1, 1,-1,1, 1,1,1, -1,-1,1, 1,1,1, -1,1,1);
planeFront.texcoords.push(0,0, 1,0, 1,1, 0,0, 0,1, 1,1);
planeFront.normals.push(0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1);
const tmp0 = Vec3.zero();
const planeBack = planeFront.clone().transformSelf((position, texcoord, normal) => {
    tmp0.fromArray(position);
    tmp0.rotateYPut(Math.PI, tmp0);
    tmp0.toArrayPut(position);
    tmp0.fromArray(normal);
    tmp0.rotateYPut(Math.PI, tmp0);
    tmp0.toArrayPut(normal);
});
const cube = new Mesh().concatSelf(
    planeFront, planeBack
);
const cubePositions = new Float32Array(cube.positions);

const shaderObj = shader.createObject();
shaderObj.setData(aPosition.name, cubePositions);

gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.clearColor(0.05, 0.07, 0.1, 1);
let moveSpeed = 20;
let turnSpeed = 4;
new RenderLoop(dt => {
    const fc = Math.cos(camera.rotation.y);
    const fs = Math.sin(camera.rotation.y);
    const rc = Math.cos(-camera.rotation.y);
    const rs = Math.sin(-camera.rotation.y);
    if(Keypresses.keyPressed["w"]) {
        camera.position.x += -fs * dt * moveSpeed;
        camera.position.z += -fc * dt * moveSpeed;
        camera.invalidateView();
    }
    if(Keypresses.keyPressed["s"]) {
        camera.position.x += fs * dt * moveSpeed;
        camera.position.z += fc * dt * moveSpeed;
        camera.invalidateView();
    }
    if(Keypresses.keyPressed["a"]) {
        camera.position.x += -rc * dt * moveSpeed;
        camera.position.z += -rs * dt * moveSpeed;
        camera.invalidateView();
    }
    if(Keypresses.keyPressed["d"]) {
        camera.position.x += rc * dt * moveSpeed;
        camera.position.z += rs * dt * moveSpeed;
        camera.invalidateView();
    }
    if(Keypresses.keyPressed[" "]) {
        camera.position.y += dt * moveSpeed;
        camera.invalidateView();
    }
    if(Keypresses.keyPressed["shift"]) {
        camera.position.y -= dt * moveSpeed;
        camera.invalidateView();
    }
    if(Keypresses.keyPressed["arrowleft"]) {
        camera.rotation.y += dt * turnSpeed;
        camera.invalidateView();
    }
    if(Keypresses.keyPressed["arrowright"]) {
        camera.rotation.y -= dt * turnSpeed;
        camera.invalidateView();
    }
    if(Keypresses.keyPressed["arrowup"]) {
        camera.rotation.x += dt * turnSpeed;
        camera.invalidateView();
    }
    if(Keypresses.keyPressed["arrowdown"]) {
        camera.rotation.x -= dt * turnSpeed;
        camera.invalidateView();
    }
    if(!camera.projectionValid) {
        camera.calculateProjection();
        uPerspective.setValues(camera.projectionMatrix);
    }
    if(!camera.viewValid) {
        camera.calculateView();
        uView.setValues(camera.viewMatrix);
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    shaderObj.drawTriangles();
}).start();