import Color from "../shared-modules/Color/Color-v1.0.js";
import FullscreenCanvas from "../shared-modules/FullscreenCanvas/FullscreenCanvas-v1.0.js";
const canvas = new FullscreenCanvas().getHTMLCanvasElement();
const ctx = canvas.getContext('2d');
function mandelbrot(x, y) {
    let zf = 0;
    let zi = 0;
    let zf2 = 0;
    let zi2 = 0;
    let zft = 0;
    for (let i = 0; i < 200; i++) {
        zft = zf;
        zf = zf2 - zi2 + x;
        zi = 2 * zft * zi + y;
        zf2 = zf * zf;
        zi2 = zi * zi;
        if (zf2 + zi2 > 4)
            return i;
    }
    return -1;
}
function render() {
    let data = ctx.createImageData(canvas.width, canvas.height);
    for (let cy = 0; cy < canvas.height; cy++) {
        for (let cx = 0; cx < canvas.width; cx++) {
            let dataIndex = (cy * canvas.width + cx) * 4;
            let sizeMin = Math.min(canvas.width, canvas.height);
            let x = (cx - canvas.width / 2) / sizeMin * 6;
            let y = (cy - canvas.height / 2) / sizeMin * 6;
            let escapeTime = mandelbrot(x, y);
            if (escapeTime === -1) {
            }
            else {
                let c = new Color().setHSV(escapeTime * 360 / 100, 100, 100);
                data.data[dataIndex] = c.r;
                data.data[dataIndex + 1] = c.g;
                data.data[dataIndex + 2] = c.b;
            }
            data.data[dataIndex + 3] = 255;
        }
    }
    ctx.putImageData(data, 0, 0);
}
FullscreenCanvas.getFullscreenCanvas(canvas)?.resized.connect(() => {
    render();
}, { init: true });
//# sourceMappingURL=main.js.map