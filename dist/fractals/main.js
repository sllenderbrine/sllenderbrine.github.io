import FullscreenCanvas from "../shared-modules/FullscreenCanvas/FullscreenCanvas-v1.0.js";
import Vec3 from "../shared-modules/Vec3/Vec3-v1.0.js";
import { MandelbrotShader, MandelbrotShading } from "./fractals.js";
const canvas = new FullscreenCanvas().getHTMLCanvasElement();
const gl = canvas.getContext('webgl2');
let shader = new MandelbrotShader(gl, MandelbrotShading.PURPLE, true);
let camera = new Vec3(-0.75, 0, 0.4);
FullscreenCanvas.getFullscreenCanvas(canvas)?.resized.connect(() => {
    canvas.width = Math.floor(canvas.width / 1);
    canvas.height = Math.floor(canvas.height / 1);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.imageRendering = "pixelated";
    shader.resize(canvas.width, canvas.height);
    shader.render(camera.toArray());
}, { init: true });
//# sourceMappingURL=main.js.map