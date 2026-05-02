import { Camera3D, Keypresses, Mat4, Mat3, Mesh, RenderLoop, Vec3, WGL2Shader, Color, WindowResizeObserver, Slider, SimpleScene, FpsCounter } from "../ge3lib_v20260428/index.js";

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

const scene = new SimpleScene(gl);

const camera = new Camera3D();
camera.position = new Vec3(10, 4, 26);
camera.lookAt(new Vec3(0, 0, 0));
camera.invalidateView();
camera.aspect = canvas.width / canvas.height;
camera.invalidateProjection();

let moveSpeed = 20;
let turnSpeed = 4;
const fpsCounter = new FpsCounter();
fpsCounter.fpsObserver.connect(fps=>{fpsLabel.textContent=`${Math.floor(fps)} FPS`;});
let renderLoop = new RenderLoop(dt => {
    fpsCounter.update(dt);
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
    scene.render(camera);
}).start();


let testFunc = null;
let testObjs = [];
testSizeSlider.inputObserver.connect(value => {
    for(const obj of testObjs) {
        obj.remove();
    }
    if(testFunc) {
        testFunc.disconnect();
        testFunc = null;
    }
    testObjs = [];
    for(let x=-value; x<=value; x++) {
        for(let z=-value; z<=value; z++) {
            const obj = scene.createPart();
            obj.position = new Vec3(x*4, 0, z*4);
            obj.size = new Vec3(1, 1, 1);
            obj.color = Color.fromHsv(x * 10, Math.sin(z / 5) * 50 + 50, 50);
            obj.updateColor();
            obj.invalidateMatrix();
            testObjs.push(obj);
            obj.x = x;
            obj.z = z;
        }
    }
    testFunc = renderLoop.renderSteppedEvent.connect(dt => {
        for(const obj of testObjs) {
            obj.rotation.y += dt * (1 + obj.x * 0.1);
            obj.rotation.x += dt * (1 + obj.z * 0.1);
            obj.position.y = Math.sin(obj.z * 0.5 + performance.now()*0.001) * Math.cos(obj.x * 0.5 + performance.now()*0.001) * 5;
            obj.invalidateMatrix();
        }
    });
});

const obj2 = scene.createPart();
obj2.position.y -= 10;
obj2.size.mulPut(new Vec3(20, 1, 20), obj2.size);
obj2.invalidateMatrix();
obj2.color = new Color(87, 97, 96);
obj2.updateColor();