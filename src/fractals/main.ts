import Color from "../shared-modules/Color/Color-v1.0.js";
import FullscreenCanvas from "../shared-modules/FullscreenCanvas/FullscreenCanvas-v1.0.js";

const canvas = new FullscreenCanvas().getHTMLCanvasElement();
const ctx = canvas.getContext('2d')!;

let precision = 300n;
let cameraX = 0n;
let cameraY = 0n;
let maxIterations = 200;

function mandelbrot(x:bigint, y:bigint) {
    let exit = 4n * precision;
    let zf = 0n;
    let zi = 0n;
    let zf2 = 0n;
    let zi2 = 0n;
    let zft = 0n;
    let cf = x;
    let ci = y
    for(let i=0;i<maxIterations;i++) {
        zft = zf;
        zf = zf2 - zi2 + cf;
        zi = 2n*zft*zi/precision + ci;
        zf2 = zf*zf/precision;
        zi2 = zi*zi/precision;
        if(zf2 + zi2 > exit) return i;
    }
    return -1;
}

function render() {
    let data = ctx.createImageData(canvas.width,canvas.height);
    for(let cy=0;cy<canvas.height;cy++) {
        for(let cx=0;cx<canvas.width;cx++) {
            let dataIndex = (cy*canvas.width+cx)*4;
            let sizeMin = Math.min(canvas.width, canvas.height);
            let x = Math.floor((cx-canvas.width/2)/sizeMin*700);
            let y = Math.floor((cy-canvas.height/2)/sizeMin*700);
            let escapeTime = mandelbrot(BigInt(x) + cameraX, BigInt(y) + cameraY);
            if(escapeTime === -1) {
                
            } else {
                let c = new Color().setHSV(escapeTime * 360 / 100, 100, 100);
                data.data[dataIndex] = c.r;
                data.data[dataIndex+1] = c.g;
                data.data[dataIndex+2] = c.b;
            }
            data.data[dataIndex+3] = 255;
        }
    }
    ctx.putImageData(data,0,0);
}

FullscreenCanvas.getFullscreenCanvas(canvas)?.resized.connect(() => {
    canvas.width = Math.floor(canvas.width / 10);
    canvas.height = Math.floor(canvas.height / 10);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.imageRendering = "pixelated";
    render();
}, { init:true });

window.addEventListener("mousedown", e=>{
    let dx = BigInt(Math.floor(e.clientX - canvas.offsetWidth/2));
    let dy = BigInt(Math.floor(e.clientY - canvas.offsetHeight/2));
    let sizeMin = BigInt(Math.min(canvas.width, canvas.height));
    cameraX += dx * 70n / sizeMin;
    cameraY += dy * 70n / sizeMin;
    cameraX *= 2n;
    cameraY *= 2n;
    precision *= 2n;
    render();
});

window.addEventListener("keydown", e=>{
    const key = e.key.toLowerCase();
    if(key=="=") {
        maxIterations *= 2;
        render();
    }
    if(key=="p") {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render();
    }
});