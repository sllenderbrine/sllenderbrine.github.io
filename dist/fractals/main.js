import * as WebGL2 from "../shared-modules/WebGL2/WebGL2-v1.0.js";
import FullscreenCanvas from "../shared-modules/FullscreenCanvas/FullscreenCanvas-v1.0.js";
import Vec3 from "../shared-modules/Vec3/Vec3-v1.0.js";
const canvas = new FullscreenCanvas().getHTMLCanvasElement();
const gl = canvas.getContext('webgl2');
let vertexSource = `#version 300 es
in vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0, 1);
}
`;
let fragmentSource = `#version 300 es
precision highp float;
uniform vec2 u_resolution;
uniform vec3 u_camera;
out vec4 outColor;
int mandelbrot(float cf, float ci) {
    float zf = 0.0;
    float zi = 0.0;
    float zf2 = 0.0;
    float zi2 = 0.0;
    float temp = 0.0;
    for(int i=0;i<100;i++) {
        temp = zf2 - zi2 + cf;
        zi = 2.0 * zf * zi + ci;
        zf = temp;
        zi2 = zi * zi;
        zf2 = zf * zf;
        if(abs(zi2 + zf2) >= 4.0)
            return i;
    }
    return -1;
}
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
void main() {
    float zoom = min(u_resolution.x, u_resolution.y) * u_camera.z;
    float cf = (gl_FragCoord.x - u_resolution.x / 2.0) / zoom + u_camera.x;
    float ci = (gl_FragCoord.y - u_resolution.y / 2.0) / zoom + u_camera.y;
    int i = mandelbrot(cf, ci);
    if(i==-1) {
        outColor = vec4(0,0,0,1);
    } else {
        outColor = vec4(hsv2rgb(vec3(float(i)/100.0,1,1)),1);
    }
}
`;
let vertexShader = new WebGL2.Shader(gl, gl.VERTEX_SHADER, vertexSource);
let fragmentShader = new WebGL2.Shader(gl, gl.FRAGMENT_SHADER, fragmentSource);
let program = new WebGL2.Program(gl, vertexShader, fragmentShader);
program.setActive();
let uResolution = new WebGL2.Uniform(gl, program, "u_resolution", "vec2");
let uCamera = new WebGL2.Uniform(gl, program, "u_camera", "vec3");
let vao = new WebGL2.VertexArray(gl);
vao.setActive();
let positionBuffer = new WebGL2.Buffer(gl, program, "a_position", "vec2");
positionBuffer.setActive();
vao.enableBuffer(positionBuffer);
positionBuffer.setData(new Float32Array([-1, -1, -1, 1, 1, -1, 1, -1, -1, 1, 1, 1]));
let camera = new Vec3(-0.875, 0, 0.446);
function render() {
    uCamera.setValues(camera.toArray());
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}
FullscreenCanvas.getFullscreenCanvas(canvas)?.resized.connect(() => {
    canvas.width = Math.floor(canvas.width / 1);
    canvas.height = Math.floor(canvas.height / 1);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.imageRendering = "pixelated";
    gl.viewport(0, 0, canvas.width, canvas.height);
    uResolution.setValues([canvas.width, canvas.height]);
    render();
}, { init: true });
//# sourceMappingURL=main.js.map