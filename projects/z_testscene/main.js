import { Camera3D, Keypresses, Mesh, RenderLoop, Vec3, WGL2Shader } from "../ge3lib_v20260428/index.js";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.style = `
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
    object-fit: contain;
`;
canvas.width = 1280;
canvas.height = 720;
const gl = canvas.getContext("webgl2");

const shader = new WGL2Shader(
    gl,
    `#version 300 es
        in vec3 a_position;
        in vec3 a_normal;
        uniform mat4 u_perspective;
        uniform mat4 u_view;
        uniform vec3 u_sun_direction;
        out float v_lighting;
        void main() {
            gl_Position = u_perspective * u_view * vec4(a_position, 1);
            v_lighting = dot(a_normal, u_sun_direction) * 0.25 + 0.75;
        }
    `, `#version 300 es
        precision highp float;
        in float v_lighting;
        out vec4 outColor;
        void main() {
            outColor = vec4(vec3(1, 0, 0) * v_lighting, 1);
        }
    `
);
const uPerspective = shader.createUniform("u_perspective", "mat4");
const uView = shader.createUniform("u_view", "mat4");
const uSunDirection = shader.createUniform("u_sun_direction", "vec3");
let sunDir = new Vec3(1,3,2);
sunDir.normPut(sunDir);
uSunDirection.setValues(sunDir.toArray());
const aPosition = shader.addAttribute("a_position", "vec3");
const aNormal = shader.addAttribute("a_normal", "vec3");

const camera = new Camera3D();
camera.position = new Vec3(4, 4, 4);
camera.lookAt(new Vec3(0, 0, 0));
camera.invalidateView();
camera.aspect = canvas.width / canvas.height;
camera.invalidateProjection();

const planeFront = new Mesh();
planeFront.positions.push(-1,-1,1, 1,-1,1, 1,1,1, -1,-1,1, 1,1,1, -1,1,1);
planeFront.texcoords.push(0,0, 1,0, 1,1, 0,0, 0,1, 1,1);
planeFront.normals.push(0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1);
const tmp0 = Vec3.zero();
const planeLeft = planeFront.clone().transformSelf((position, texcoord, normal) => {
    tmp0.fromArray(position).rotateYPut(Math.PI/2, tmp0).toArrayPut(position);
    tmp0.fromArray(normal).rotateYPut(Math.PI/2, tmp0).toArrayPut(normal);
});
const planeBack = planeFront.clone().transformSelf((position, texcoord, normal) => {
    tmp0.fromArray(position).rotateYPut(Math.PI, tmp0).toArrayPut(position);
    tmp0.fromArray(normal).rotateYPut(Math.PI, tmp0).toArrayPut(normal);
});
const planeRight = planeFront.clone().transformSelf((position, texcoord, normal) => {
    tmp0.fromArray(position).rotateYPut(3*Math.PI/2, tmp0).toArrayPut(position);
    tmp0.fromArray(normal).rotateYPut(3*Math.PI/2, tmp0).toArrayPut(normal);
});
const planeBottom = planeFront.clone().transformSelf((position, texcoord, normal) => {
    tmp0.fromArray(position).rotateXPut(Math.PI/2, tmp0).toArrayPut(position);
    tmp0.fromArray(normal).rotateXPut(Math.PI/2, tmp0).toArrayPut(normal);
});
const planeTop = planeFront.clone().transformSelf((position, texcoord, normal) => {
    tmp0.fromArray(position).rotateXPut(3*Math.PI/2, tmp0).toArrayPut(position);
    tmp0.fromArray(normal).rotateXPut(3*Math.PI/2, tmp0).toArrayPut(normal);
});
const cube = new Mesh().concatSelf(
    planeFront, planeLeft, planeBack, planeRight, planeBottom, planeTop
);
const cubePositions = new Float32Array(cube.positions);
const cubeNormals = new Float32Array(cube.normals);

const shaderObj = shader.createObject();
shaderObj.setData(aPosition.name, cubePositions);
shaderObj.setData(aNormal.name, cubeNormals);

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