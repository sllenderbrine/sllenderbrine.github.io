import {WindowResizeObserver, WGL2Shader, Vec2, Color, Mat3, RenderLoop, Keypresses, EMath, PhysicsLab2D} from "../../libge3/libge3_v20260416.js";

let audioContext = new AudioContext();
export class SoundEffect {
    constructor(url, targetCooldown) {
        this.isLoaded = false;
        this.targetCooldown = targetCooldown;
        this.lastPlayedTime = performance.now();
        this.cooldownWeight = 0;
        fetch(url).then(async res => {
            const arrayBuffer = await res.arrayBuffer();
            this.audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            this.isLoaded = true;
        });
        this.update = new RenderLoop(dt => {
            this.cooldownWeight = EMath.clamp(this.cooldownWeight - dt * 5, 0, 1);
        }).start();
    }
    play(gain=0, pitch=1) {
        if(!this.isLoaded)
            return;
        if(gain < -0.95)
            return;
        this.cooldownWeight += (this.targetCooldown*1000) / (performance.now() - this.lastPlayedTime);
        if(this.cooldownWeight > 0.8)
            return;
        this.lastPlayedTime = performance.now();
        const source = audioContext.createBufferSource();
        source.buffer = this.audioBuffer;
        source.connect(audioContext.destination);
        const gainNode = audioContext.createGain();
        gainNode.gain.value = gain;
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        // const reverb = audioContext.createConvolver();
        // reverb.buffer = this.audioBuffer;
        // source.connect(reverb);
        // reverb.connect(audioContext.destination);
        source.playbackRate.value = pitch;
        source.start(0);
    }
}

const fsresize = new WindowResizeObserver();

let canvas = document.createElement("canvas");
canvas.width = 1912;
canvas.height = 914;
canvas.style.objectFit = "contain";
document.body.appendChild(canvas);
fsresize.resizeEvent.connect((w, h) => {
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
});
let gl = canvas.getContext("webgl2");

let shader = new WGL2Shader(
    gl,
    `#version 300 es
        in vec2 a_position;
        uniform mat3 u_rotation;
        uniform vec2 u_offset;
        uniform vec2 u_scale;
        uniform vec2 u_resolution;
        void main() {
            vec3 rotated = u_rotation * vec3(a_position * u_scale, 1);
            gl_Position = vec4(rotated.xy / u_resolution + u_offset, 0, 1);
        }
    `,
    `#version 300 es
        precision highp float;
        uniform vec3 u_color;
        out vec4 outColor;
        void main() {
            outColor = vec4(u_color/255., 1);
        }
    `,
)
shader.addAttribute("a_position", "vec2");
const uRotation = shader.createUniform("u_rotation", "mat3");
const uOffset = shader.createUniform("u_offset", "vec2");
const uResolution = shader.createUniform("u_resolution", "vec2");
const uScale = shader.createUniform("u_scale", "vec2");
const uColor = shader.createUniform("u_color", "vec3");
uResolution.setValues([canvas.width, canvas.height]);

let circleMeshPositions = [];
for(let i=0; i<16; i++) {
    let a1 = Math.PI*2*(i/16);
    let a2 = Math.PI*2*((i+1)/16);
    circleMeshPositions.push(0, 0);
    circleMeshPositions.push(Math.cos(a1), Math.sin(a1));
    circleMeshPositions.push(Math.cos(a2), Math.sin(a2));
}
let rectMeshPositions = [-1,-1,1,-1,1,1,-1,-1,-1,1,1,1].map(x => x*0.5);

let render = new RenderLoop(dt => { });
let env = new PhysicsLab2D();
function createRect(position, size, rotation) {
    let rect = env.createRect(position, size, rotation);
    rect.shaderObject = shader.createObject();
    rect.shaderObject.setData("a_position", new Float32Array(rectMeshPositions));
    rect.color = new Color(0, 0, 0);
    return rect;
}
function createBall(position, radius, sfxC = 0.2) {
    let ball = env.createBall(position, radius);
    ball.shaderObject = shader.createObject();
    ball.shaderObject.setData("a_position", new Float32Array(circleMeshPositions));
    ball.color = new Color("rgb(255, 170, 70)");
    render.renderSteppedEvent.connect(dt => {
        if(Math.abs(ball.position.x) > 3824 || ball.position.y > 1828 || ball.position.y < -914) {
            ball.position = Vec2.zero();
        }
    });
    ball.punchSfx = new SoundEffect("./punch2.wav", sfxC);
    return ball;
}
function createRing(
    radius=150,
    speed=1,
    angle=0,
) {
    let rects = [];
    for(let i=0; i<20; i++) {
        let a = Math.PI*2*(i/48);
        let rect = createRect(
            new Vec2(Math.cos(a)*radius, Math.sin(a)*radius),
            new Vec2(2*Math.PI*radius/48 + 3, 15),
            a + Math.PI/2
        );
        rect.color = new Color("rgb(140, 90, 150)").lerpRgba(new Color("rgb(255, 170, 70)"), 1-radius/500);
        rect.color = rect.color.lerpRgba(new Color("rgb(255, 255, 255)"), Math.sin(i*2*Math.PI/4)*0.25+0.25);
        rects.push(rect);
    }
    render.renderSteppedEvent.connect(dt => {
        for(let i=0; i<rects.length; i++) {
            let rect = rects[i];
            let a = Math.PI*2*(i/48) + ((performance.now())/1000 + 5)*speed;
            rect.position = new Vec2(Math.cos(a)*radius, Math.sin(a)*radius);
            rect.setRotation(a + Math.PI/2);
        }
    });
    return rects;
}


let bg = createRect(new Vec2(0, 0), new Vec2(10000, 10000), 0);
bg.hasCollision = false;
bg.color = new Color("rgb(35, 15, 25)");
for(let i=0; i<5; i++) {
    let ground = createRect(new Vec2(0, -600 + i * -60), new Vec2(2500 + i * 200, 60), 0);
    ground.color = new Color("rgb(140, 90, 150)").lerpRgba(new Color("rgb(255, 170, 70)"), i/10);
    ground.color.sat += 20 - i/5*20;
    ground.color.val += i/5*60;
    ground.restitution = 1 - i/5;
}
let sweeper = createRect(new Vec2(-900, -505), new Vec2(50, 45), 0);
sweeper.restitution = 0;
sweeper.color = new Color("rgb(140, 90, 150)");
render.renderSteppedEvent.connect(dt => {
    sweeper.position.x = Math.sin(performance.now()/4000)*5000;
});
for(let i=0; i<5; i++) {
    createBall(new Vec2(Math.random()*10-5, 0), 18);
}
for(let i=0; i<5; i++) {
    createRing(100 + 80 * i**1.1, 0.5 + 0.1 * i);
}
let myBall = createBall(Vec2.zero(), 18, 0.02);
myBall.color = new Color("rgb(140, 90, 150)").lerpRgba(new Color("rgb(255, 170, 70)"), 0.5);
myBall.color.sat += 20;


render.callback = dt => {
    dt = EMath.clamp(dt, 0, 0.5);
    let lastVel = myBall.velocity;
    env.update(dt);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if(Keypresses.keyPressed["w"]) myBall.velocity.y += 200 * dt;
    if(Keypresses.keyPressed["s"]) myBall.velocity.y -= 500 * dt;
    if(Keypresses.keyPressed["a"]) myBall.velocity.x -= 1000 * dt;
    if(Keypresses.keyPressed["d"]) myBall.velocity.x += 1000 * dt;
    if(myBall.collision && myBall.collision.inside) {
        if(myBall.collision.normal.y > 0.7 && Keypresses.keyPressed["w"]) {
            myBall.velocity.y += 350 / Math.abs(myBall.velocity.y/50 + 1);
        }
        let gain = lastVel.length() / 2000;
        gain = - Math.exp(-gain);
            gain = EMath.lerp(gain, -1, 0.5);
        let pitch = 0.75 + Math.min(lastVel.length() / 2000, 0.5) + 0.1 * Math.random();
        myBall.punchSfx.play(gain, pitch);
        myBall.punchSfx.targetCooldown = EMath.clamp(1 / lastVel.length(), 0.015, 1);
    }
    for(let obj of env.objects) {
        if(obj.type == "ball" && obj != myBall && obj.lastVel) {
            if(obj.collision && obj.collision.inside) {
                let gain = obj.lastVel.length() / 2000;
                gain = - Math.exp(-gain);
                gain = EMath.lerp(gain, -1, 0.8);
                let pitch = 0.75 + Math.min(obj.lastVel.length() / 2000, 0.5) + 0.1 * Math.random();
                obj.punchSfx.play(gain, pitch);
            }
        }
        obj.lastVel = obj.velocity;
        uRotation.setValues(obj.rotationMatrix);
        uColor.setValues([obj.color.r, obj.color.g, obj.color.b]);
        uOffset.setValues([obj.position.x/canvas.width, obj.position.y/canvas.height]);
        if(obj.type == "rect") uScale.setValues([obj.size.x, obj.size.y]);
        else uScale.setValues([obj.radius, obj.radius]);
        obj.shaderObject.drawTriangles();
    }
};
render.start();