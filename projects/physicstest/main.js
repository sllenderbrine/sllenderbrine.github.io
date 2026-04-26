import * as libge3 from "../libge3/libge3_v20260424.js";
const { Camera2D, Physics2DEnvironment, PhysicsPart2D, Color, Vec2, Noise, EMath } = libge3;
const canvas = document.createElement("canvas");
canvas.width = 1280;
canvas.height = 720;
canvas.style = "image-rendering:pixelated;width:100%;height:100%;object-fit:contain;";
document.body.appendChild(canvas);
const gl = canvas.getContext("webgl2");
gl.clearColor(1, 1, 1, 1);
let camera = new Camera2D(Vec2.fill(0), new Vec2(1/canvas.width, 1/canvas.height));
const env = new Physics2DEnvironment(gl);
async function runSimulation() {
    let ballCount = 350;
    let ballSize = 20;
    let spawnTime = 6;
    let simulationTime = 22;
    let frameRate = 60;
    let solvesCount = 6;
    let frameRateInv = 1/frameRate;
    let balls = [];
    let pendingCreates = [];
    for(let i=0; i<ballCount; i++) {
        let position = new Vec2((Noise.randomConstant3(i, 5, 2.6)*2-1) * 5000, 2500);
        pendingCreates.push({time:i/ballCount*spawnTime, func:()=>{
            let ball = new PhysicsPart2D(env.defaultShader, position, Vec2.fill(ballSize), new Color(205, 50, 75), "circle", false, 0.6);
            env.addPart(ball);
            ball.velocity.x = -(0.5 + 0.2*(Noise.randomConstant3(i, 4, 6)-0.5)) * ball.position.x;
            ball.velocity.y = -800;
            balls.push(ball);
            ball.loopIndex = i;
        }});
    }
    let elapsed = 0;
    while(elapsed < simulationTime) {
        env.update(frameRateInv, solvesCount);
        elapsed += frameRateInv;
        if(pendingCreates[0] && elapsed > pendingCreates[0].time) {
            pendingCreates[0].func();
            pendingCreates.shift();
        }
    }
    let colorsByIndex = {};
    for(let ball of balls) {
        let t = (ball.position.y + 580) / 400;
        if(t > 1) {
            ball.color = new Color("rgb(205, 100, 75)").lerpRgbaSelf(new Color("rgb(225, 200, 175)"), EMath.clamp(t-1, 0, 1));
        } else {
            ball.color = new Color("rgb(105, 50, 175)").lerpRgbaSelf(new Color("rgb(205, 100, 75)"), EMath.clamp(t, 0, 1));
        }
        let c = (Math.floor(ball.position.x/100) + Math.floor(ball.position.y/100)) % 2;
        if(c == 0) {
            ball.color.sat -= 20;
            ball.color.val += 20;
        }
        if(Math.abs(ball.position.x) > 420 || Math.abs(ball.position.y + 220) > 420) {
            ball.color = new Color("rgb(200, 200, 200)")
        }
        colorsByIndex[ball.loopIndex] = ball.color;
    }
    env.renderAll(camera);
    await delay(2000);
    for(let ball of balls) {
        ball.shaderObject.delete();
        env.removePart(ball);
    }
    balls = [];
    pendingCreates = [];
    for(let i=0; i<ballCount; i++) {
        let position = new Vec2((Noise.randomConstant3(i, 5, 2.6)*2-1) * 5000, 2500);
        pendingCreates.push({time:i/ballCount*spawnTime, func:()=>{
            let ball = new PhysicsPart2D(env.defaultShader, position, Vec2.fill(ballSize), colorsByIndex[i], "circle", false, 0.6);
            env.addPart(ball);
            ball.velocity.x = -(0.5 + 0.2*(Noise.randomConstant3(i, 4, 6)-0.5)) * ball.position.x;
            ball.velocity.y = -800;
            balls.push(ball);
            ball.loopIndex = i;
        }});
    }
    elapsed = 0;
    setInterval(() => {
        if(elapsed > simulationTime)
            return;
        env.update(frameRateInv, solvesCount);
        elapsed += frameRateInv;
        if(pendingCreates[0] && elapsed > pendingCreates[0].time) {
            pendingCreates[0].func();
            pendingCreates.shift();
        }
        env.renderAll(camera);
    }, 1000/60);
}
env.addPart(new PhysicsPart2D(env.defaultShader, new Vec2(0, -600), new Vec2(400, 20), new Color(200, 200, 200), "rect", true, 0.2));
env.addPart(new PhysicsPart2D(env.defaultShader, new Vec2(-400, -220), new Vec2(20, 400), new Color(200, 200, 200), "rect", true, 0.2));
env.addPart(new PhysicsPart2D(env.defaultShader, new Vec2(400, -220), new Vec2(20, 400), new Color(200, 200, 200), "rect", true, 0.2));
let ground = new PhysicsPart2D(env.defaultShader, new Vec2(0, -900), new Vec2(10000, 20), new Color(200, 200, 200), "rect", true, 0.2);
ground.collisionEvent.connect((part) => {
    part.position = new Vec2((Noise.randomConstant3(part.position.x, 5, 2.6)*2-1) * 5000, 2500);
    part.velocity.x = -(0.5 + 0.2*(Noise.randomConstant3(part.position.x, 4, 6)-0.5)) * part.position.x;
    part.velocity.y = -800;
});
env.addPart(ground);
runSimulation();