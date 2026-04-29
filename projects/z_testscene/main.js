import { Camera3D, Keypresses, Mat4, Mat3, Mesh, RenderLoop, Vec3, WGL2Shader, Color, WindowResizeObserver, Slider } from "../ge3lib_v20260428/index.js";

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

const hudDiv = document.createElement("div");
hudDiv.style = `
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
`;
document.body.appendChild(hudDiv);

const fpsLabel = document.createElement("div");
fpsLabel.style = `
    color: white;
    font-family: Arial;
    font-size: 18px;
    position: absolute;
    top: 10px;
    left: 10px;
`;
hudDiv.appendChild(fpsLabel);

const testSizeSlider = new Slider(5, 50, 5, 1);
hudDiv.appendChild(testSizeSlider.containerEl);
testSizeSlider.containerEl.style.position = "absolute";
testSizeSlider.containerEl.style.left = "10px";
testSizeSlider.containerEl.style.top = "40px";

const testSizeLabel = document.createElement("div");
testSizeLabel.style = `
    color: white;
    font-family: Arial;
    font-size: 18px;
    position: absolute;
    top: 44px;
    left: 130px;
`;
hudDiv.appendChild(testSizeLabel);

testSizeSlider.inputObserver.connect(value => {
    testSizeLabel.textContent = `${value*2+1} x ${value*2+1}`;
});

let resizeObserver = new WindowResizeObserver()
resizeObserver.resizeEvent.connect((w, h) => {
    let r1 = canvas.width/canvas.height;
    let r2 = w/h;
    if(r1 > r2) {
        let ch = canvas.height * w / canvas.width;
        let t = (h - ch) / 2;
        hudDiv.style.top = `${t}px`;
        hudDiv.style.left = `0px`;
        hudDiv.style.width = `${w}px`;
        hudDiv.style.height = `${ch}px`;
    } else {
        let cw = canvas.width * h / canvas.height;
        let t = (w - cw) / 2;
        hudDiv.style.top = `0px`;
        hudDiv.style.left = `${t}px`;
        hudDiv.style.width = `${cw}px`;
        hudDiv.style.height = `${h}px`;
    }
});

const shader = new WGL2Shader(
    gl,
    `#version 300 es
        in vec3 a_position;
        in vec3 a_normal;
        uniform mat4 u_perspective;
        uniform mat4 u_view;
        uniform mat4 u_model;
        uniform mat3 u_model_normal;
        uniform vec3 u_sun_direction;
        out float v_lighting;
        void main() {
            gl_Position = u_perspective * u_view * u_model * vec4(a_position, 1);
            vec3 normal = normalize(u_model_normal * a_normal);
            v_lighting = dot(normal, u_sun_direction) * 0.5 + 0.5;
        }
    `, `#version 300 es
        precision highp float;
        in float v_lighting;
        uniform vec3 u_color;
        out vec4 outColor;
        void main() {
            outColor = vec4(u_color * v_lighting, 1);
        }
    `
);
const uPerspective = shader.createUniform("u_perspective", "mat4");
const uView = shader.createUniform("u_view", "mat4");
const uModel = shader.createUniform("u_model", "mat4");
const uModelNormal = shader.createUniform("u_model_normal", "mat3");
const uSunDirection = shader.createUniform("u_sun_direction", "vec3");
const uColor = shader.createUniform("u_color", "vec3");
let sunDir = new Vec3(1,2,3);
sunDir.normPut(sunDir);
uSunDirection.setValues(sunDir.toArray());
const aPosition = shader.addAttribute("a_position", "vec3");
const aNormal = shader.addAttribute("a_normal", "vec3");

const camera = new Camera3D();
camera.position = new Vec3(10, 4, 26);
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

class PlatformPart {
    constructor() {
        this.shaderObject = shader.createObject();
        this.shaderObject.setData(aPosition.name, cubePositions);
        this.shaderObject.setData(aNormal.name, cubeNormals);
        this.position = Vec3.zero();
        this.rotation = Vec3.zero();
        this.size = Vec3.one();
        this.scaleMatrix = Mat4.partialScale();
        this.translationMatrix = Mat4.partialTranslation();
        this.rotationMatrix = Mat4.partialRotationYXZ();
        this.modelMatrix = Mat4.newIdentity();
        this.normalMatrix = Mat3.newIdentity();
        this.color = new Color(255, 0, 0);
        this.colorUniform = [1, 0, 0];
        this.matrixValid = false;
    }
    invalidateMatrix() {
        this.matrixValid = false;
    }
    updateColor() {
        this.colorUniform[0] = this.color.r / 255;
        this.colorUniform[1] = this.color.g / 255;
        this.colorUniform[2] = this.color.b / 255;
    }
    calculateMatrix() {
        if(this.matrixValid)
            return;
        this.matrixValid = true;
        Mat4.setScale(this.size.x, this.size.y, this.size.z, this.scaleMatrix);
        Mat4.setTranslation(this.position.x, this.position.y, this.position.z, this.translationMatrix);
        Mat4.setRotationYXZ(this.rotation.x, this.rotation.y, this.rotation.z, this.rotationMatrix);
        Mat4.multiplyPut(
            Mat4.multiplyPut(
                this.translationMatrix,
                this.rotationMatrix,
                this.modelMatrix
            ),
            this.scaleMatrix,
            this.modelMatrix
        );
        Mat3.mat4ToNormalPut(this.modelMatrix, this.normalMatrix);
    }
    render() {
        this.calculateMatrix();
        uModel.setValues(this.modelMatrix);
        uModelNormal.setValues(this.normalMatrix);
        uColor.setValues(this.colorUniform);
        this.shaderObject.drawTriangles();
    }
}

let objects = [];

function renderScene(camera) {
    camera.calculateProjection();
    camera.calculateView();
    uPerspective.setValues(camera.projectionMatrix);
    uView.setValues(camera.viewMatrix);
    for(let obj of objects) {
        obj.render();
    }
}

gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.clearColor(0.05, 0.07, 0.1, 1);
let moveSpeed = 20;
let turnSpeed = 4;
let avgFps = 0;
let avgFpsT = 0;
let avgFpsI = 0;
let renderLoop = new RenderLoop(dt => {
    avgFpsT += dt;
    avgFps += 1/dt;
    avgFpsI++;
    if(avgFpsT > 0.1) {
        let fps = avgFps / avgFpsI;
        fpsLabel.textContent = `${Math.floor(fps)} FPS`;
        avgFps = 0;
        avgFpsT = 0;
        avgFpsI = 0;
    }
    const fc = Math.cos(camera.rotation.y);
    const fs = Math.sin(camera.rotation.y);
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
        camera.position.x += -fc * dt * moveSpeed;
        camera.position.z += fs * dt * moveSpeed;
        camera.invalidateView();
    }
    if(Keypresses.keyPressed["d"]) {
        camera.position.x += fc * dt * moveSpeed;
        camera.position.z += -fs * dt * moveSpeed;
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
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderScene(camera);
}).start();


let testFunc = null;
let testObjs = [];
testSizeSlider.inputObserver.connect(value => {
    for(const obj of testObjs) {
        obj.shaderObject.delete();
        let i1 = objects.indexOf(obj);
        if(i1 >= 0) objects.splice(i1, 1);
    }
    if(testFunc) {
        testFunc.disconnect();
        testFunc = null;
    }
    testObjs = [];
    for(let x=-value; x<=value; x++) {
        for(let z=-value; z<=value; z++) {
            const obj = new PlatformPart();
            obj.position = new Vec3(x*4, 0, z*4);
            obj.size = new Vec3(1, 1, 1);
            obj.color = Color.fromHsv(x * 10, Math.sin(z / 5) * 50 + 50, 50);
            console.log(obj.color.r, obj.color.g, obj.color.b);
            obj.updateColor();
            obj.invalidateMatrix();
            objects.push(obj);
            testObjs.push(obj);
            obj.x = x;
            obj.z = z;
        }
    }
    testFunc = renderLoop.renderSteppedEvent.connect(dt => {
        for(const obj of testObjs) {
            obj.rotation.y += dt * (1 + obj.x * 0.1);
            obj.rotation.x += dt * (1 + obj.z * 0.1);
            obj.invalidateMatrix();
        }
    });
});

const obj2 = new PlatformPart();
obj2.position.y -= 10;
obj2.size.mulPut(new Vec3(20, 1, 20), obj2.size);
obj2.invalidateMatrix();
obj2.color = new Color(87, 97, 96);
obj2.updateColor();
objects.push(obj2);