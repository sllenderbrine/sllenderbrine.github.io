import Color from "../shared-modules/Color/Color-v1.0.js";
import FullscreenCanvas from "../shared-modules/FullscreenCanvas/FullscreenCanvas-v1.0.js";

const canvas = new FullscreenCanvas().getHTMLCanvasElement();
const ctx = canvas.getContext('2d')!;

function render() {
    let data = ctx.createImageData(canvas.width,canvas.height);
    for(let y=0;y<canvas.height;y++) {
        for(let x=0;x<canvas.width;x++) {
            let i = (y*canvas.width+x)*4;
            let c = new Color(1,0,0);
            data.data[i] = c.r;
            data.data[i+1] = c.g;
            data.data[i+2] = c.b;
            data.data[i+3] = 255;
        }
    }
    ctx.putImageData(data,0,0);
}

FullscreenCanvas.getFullscreenCanvas(canvas)?.resized.connect(() => {
    render();
}, { init:true });