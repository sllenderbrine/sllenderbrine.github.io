import { Camera3D, Keypresses, Mat4, Mat3, Mesh, RenderLoop, Vec3, WGL2Shader, Color, WindowResizeObserver, Slider, SimpleScene, EMath } from "../ge3lib_v20260428/index.js";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.style = `
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
    object-fit: contain;
`;
const gl = canvas.getContext("webgl2");

const cursorImg = new Image();
cursorImg.style = `
    position: absolute;
    left: 0px;
    top: 0px;
    pointer-events: none;
`;
document.body.appendChild(cursorImg);
cursorImg.src = "./cursor.png";

let mouseX = 0;
let mouseY = 0;

canvas.addEventListener("mousedown", e => {
    if(document.pointerLockElement == null) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
    document.body.requestPointerLock();
});

window.addEventListener("mousemove", e => {
    if(document.pointerLockElement != null) {
        if(Keypresses.keyPressed["rmb"]) {
            camera.rotation.y -= e.movementX * 0.01;
            camera.rotation.x -= e.movementY * 0.01;
            camera.invalidateView();
        } else {
            mouseX += e.movementX;
            mouseY += e.movementY;
        }
    }
    mouseX = Math.min(Math.max(mouseX, 0), window.innerWidth);
    mouseY = Math.min(Math.max(mouseY, 0), window.innerHeight);
    cursorImg.style.left = `${mouseX}px`;
    cursorImg.style.top = `${mouseY}px`;
});

const camera = new Camera3D();
camera.position = new Vec3(10, 4, 26);
camera.lookAt(new Vec3(0, 0, 0));
camera.invalidateView();
camera.verticalFov = 70 * Math.PI / 180;
camera.invalidateProjection();
let cameraZoom = 20;

const scene = new SimpleScene(gl);
const tmpRY0 = Mat4.partialRotationY();

class PlayerCharacter {
    yaw = 0;
    constructor() {
        this.position = Vec3.zero();
        this.torso = scene.createPart();
        this.torso.size = new Vec3(1, 1.1, 0.5);
        this.torso.color = Color.fromString("rgb(121, 60, 68)");
        this.torso.updateColor();
        this.rightArm = scene.createPart();
        this.rightArm.size = new Vec3(0.5, 1.1, 0.5);
        this.rightArm.color = Color.fromString("rgb(240, 198, 159)");
        this.rightArm.updateColor();
        this.rightArmPitch = 0.5;
        this.rightArmPitchStart = 0.5;
        this.rightArm.rotationLocked = true;
        this.leftArm = scene.createPart();
        this.leftArm.size = new Vec3(0.5, 1.1, 0.5);
        this.leftArm.color = Color.fromString("rgb(240, 198, 159)");
        this.leftArm.updateColor();
        this.leftArmPitch = 0;
        this.leftArmPitchStart = 0;
        this.leftArm.rotationLocked = true;
        this.rightLeg = scene.createPart();
        this.rightLeg.size = new Vec3(0.501, 1.1, 0.5);
        this.rightLeg.color = Color.fromString("rgb(46, 46, 58)");
        this.rightLeg.updateColor();
        this.rightLegPitch = 0;
        this.rightLegPitchStart = 0;
        this.rightLeg.rotationLocked = true;
        this.leftLeg = scene.createPart();
        this.leftLeg.size = new Vec3(0.501, 1.1, 0.5);
        this.leftLeg.color = Color.fromString("rgb(46, 46, 58)");
        this.leftLeg.updateColor();
        this.leftLegPitch = 0;
        this.leftLegPitchStart = 0;
        this.leftLeg.rotationLocked = true;
        this.head = scene.createPart();
        this.head.size = new Vec3(0.65, 0.65, 0.65);
        this.head.color = Color.fromString("rgb(240, 198, 159)");
        this.head.updateColor();
        this.headYaw = 0;
        this.animation = "idle";
        this.animationStart = 0;
    }
    animateWalk(dt) {
        const t = EMath.clamp((performance.now() - this.animationStart)/500, 0, 1);
        const speed = 9;
        this.rightArmPitch = EMath.lerp(this.rightArmPitchStart, Math.sin(performance.now()/1000 * speed) * 0.8, t);
        this.leftArmPitch = EMath.lerp(this.leftArmPitchStart, (-Math.sin(performance.now()/1000 * speed) * 0.8), t);
        this.rightLegPitch = EMath.lerp(this.rightLegPitchStart, (-Math.sin(performance.now()/1000 * speed) * 0.8), t);
        this.leftLegPitch = EMath.lerp(this.leftLegPitchStart, Math.sin(performance.now()/1000 * speed) * 0.8, t);
    }
    animateIdle(dt) {
        this.rightArmPitch = EMath.fixedInterp(this.rightArmPitch, 0, dt * 3);
        this.leftArmPitch = EMath.fixedInterp(this.leftArmPitch, 0, dt * 3);
        this.rightLegPitch = EMath.fixedInterp(this.rightLegPitch, 0, dt * 3);
        this.leftLegPitch = EMath.fixedInterp(this.leftLegPitch, 0, dt * 3);
    }
    setAnimation(name) {
        if(this.animation == name)
            return;
        this.animation = name;
        this.animationStart = performance.now();
        this.rightArmPitchStart = this.rightArmPitch;
        this.leftArmPitchStart = this.leftArmPitch;
        this.rightLegPitchStart = this.rightLegPitch;
        this.leftLegPitchStart = this.leftLegPitch;
    }
    update(dt) {
        const cameraForwardFlatX = Math.sin(camera.rotation.y);
        const cameraForwardFlatZ = Math.cos(camera.rotation.y);
        const cameraRightFlatX = -cameraForwardFlatZ;
        const cameraRightFlatZ = cameraForwardFlatX;
        let moveX = 0;
        let moveZ = 0;
        if(Keypresses.keyPressed["w"]) moveZ--;
        if(Keypresses.keyPressed["s"]) moveZ++;
        if(Keypresses.keyPressed["a"]) moveX++;
        if(Keypresses.keyPressed["d"]) moveX--;
        const len = Math.sqrt(moveX*moveX + moveZ*moveZ);
        if(len > 0) {
            moveX /= len;
            moveZ /= len;
            this.position.x += moveZ * cameraForwardFlatX * dt * moveSpeed;
            this.position.z += moveZ * cameraForwardFlatZ * dt * moveSpeed;
            this.position.x += moveX * cameraRightFlatX * dt * moveSpeed;
            this.position.z += moveX * cameraRightFlatZ * dt * moveSpeed;
            let worldMoveX = moveZ * cameraForwardFlatX + moveX * cameraRightFlatX;
            let worldMoveZ = moveZ * cameraForwardFlatZ + moveX * cameraRightFlatZ;
            let targetYaw = Math.PI/2 + Math.atan2(-worldMoveZ, worldMoveX);
            this.yaw += EMath.wrapAngle(targetYaw - this.yaw) * dt * 6;
            if(Math.abs(EMath.wrapAngle(targetYaw - this.yaw)) > dt * 4) {
                this.yaw += Math.sign(EMath.wrapAngle(targetYaw - this.yaw)) * dt * 3;
            }
            this.setAnimation("walk");
            this.animateWalk(dt);
        } else {
            this.setAnimation("idle");
            this.animateIdle(dt);
        }
        if(Keypresses.keyPressed[" "]) {
            this.position.y += dt * moveSpeed;
        }
        if(Keypresses.keyPressed["shift"]) {
            this.position.y -= dt * moveSpeed;
        }
        this.torso.position.copyFrom(this.position);
        this.torso.rotation.y = this.yaw;
        this.torso.invalidateMatrix();
        const characterForwardFlatX = Math.sin(this.yaw);
        const characterForwardFlatZ = Math.cos(this.yaw);
        const characterRightFlatX = -characterForwardFlatZ;
        const characterRightFlatZ = characterForwardFlatX;
        this.rightArm.position.copyFrom(this.position);
        this.rightArm.position.x -= characterRightFlatX * 1.5;
        this.rightArm.position.z -= characterRightFlatZ * 1.5;
        Mat4.fromRotationX(this.rightArmPitch, this.rightArm.rotationMatrix);
        Mat4.fromRotationY(this.yaw, tmpRY0);
        Mat4.multiplyPut(tmpRY0, this.rightArm.rotationMatrix, this.rightArm.rotationMatrix);
        this.rightArm.position.x -= characterForwardFlatX * Math.sin(this.rightArmPitch);
        this.rightArm.position.z -= characterForwardFlatZ * Math.sin(this.rightArmPitch);
        this.rightArm.position.y -= Math.cos(this.rightArmPitch) * 0.5 - 0.5;
        this.rightArm.invalidateMatrix();
        this.leftArm.position.copyFrom(this.position);
        this.leftArm.position.x += characterRightFlatX * 1.5;
        this.leftArm.position.z += characterRightFlatZ * 1.5;
        Mat4.fromRotationX(this.leftArmPitch, this.leftArm.rotationMatrix);
        Mat4.fromRotationY(this.yaw, tmpRY0);
        Mat4.multiplyPut(tmpRY0, this.leftArm.rotationMatrix, this.leftArm.rotationMatrix);
        this.leftArm.position.x -= characterForwardFlatX * Math.sin(this.leftArmPitch);
        this.leftArm.position.z -= characterForwardFlatZ * Math.sin(this.leftArmPitch);
        this.leftArm.position.y -= Math.cos(this.leftArmPitch) * 1 - 1;
        this.leftArm.invalidateMatrix();
        this.rightLeg.position.copyFrom(this.position);
        this.rightLeg.position.x -= characterRightFlatX * 0.5;
        this.rightLeg.position.z -= characterRightFlatZ * 0.5;
        this.rightLeg.position.y -= 2.2;
        Mat4.fromRotationX(this.rightLegPitch, this.rightLeg.rotationMatrix);
        Mat4.fromRotationY(this.yaw, tmpRY0);
        Mat4.multiplyPut(tmpRY0, this.rightLeg.rotationMatrix, this.rightLeg.rotationMatrix);
        this.rightLeg.position.x -= characterForwardFlatX * Math.sin(this.rightLegPitch);
        this.rightLeg.position.z -= characterForwardFlatZ * Math.sin(this.rightLegPitch);
        this.rightLeg.position.y -= Math.cos(this.rightLegPitch) * 1 - 1;
        this.rightLeg.invalidateMatrix();
        this.leftLeg.position.copyFrom(this.position);
        this.leftLeg.position.x += characterRightFlatX * 0.5;
        this.leftLeg.position.z += characterRightFlatZ * 0.5;
        this.leftLeg.position.y -= 2.2;
        Mat4.fromRotationX(this.leftLegPitch, this.leftLeg.rotationMatrix);
        Mat4.fromRotationY(this.yaw, tmpRY0);
        Mat4.multiplyPut(tmpRY0, this.leftLeg.rotationMatrix, this.leftLeg.rotationMatrix);
        this.leftLeg.position.x -= characterForwardFlatX * Math.sin(this.leftLegPitch);
        this.leftLeg.position.z -= characterForwardFlatZ * Math.sin(this.leftLegPitch);
        this.leftLeg.position.y -= Math.cos(this.leftLegPitch) * 1 - 1;
        this.leftLeg.invalidateMatrix();
        this.head.position.copyFrom(this.position);
        this.head.position.y += 1.75;
        this.head.rotation.y = this.yaw;
        this.head.invalidateMatrix();
    }
}

let character = new PlayerCharacter();

let resizeObserver = new WindowResizeObserver()
resizeObserver.resizeEvent.connect((w, h) => {
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    camera.aspect = w/h;
    camera.invalidateProjection();
});

let moveSpeed = 20;
let turnSpeed = 4;
const tmp0 = Vec3.zero();
let renderLoop = new RenderLoop(dt => {
    camera.rotation.x = Math.min(Math.max(camera.rotation.x, -Math.PI/2), Math.PI/2);
    character.update(dt);
    tmp0.x = 0; tmp0.y = 0; tmp0.z = -1;
    tmp0.rotateXyzPut(camera.rotation, tmp0);
    camera.position.x = character.position.x - tmp0.x * cameraZoom;
    camera.position.y = character.position.y - tmp0.y * cameraZoom;
    camera.position.z = character.position.z - tmp0.z * cameraZoom;
    camera.invalidateView();
    scene.render(camera);
}).start();

const obj2 = scene.createPart();
obj2.position.y -= 10;
obj2.size.mulPut(new Vec3(20, 1, 20), obj2.size);
obj2.invalidateMatrix();
obj2.color = new Color(87, 97, 96);
obj2.updateColor();