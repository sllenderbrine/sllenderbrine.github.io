import * as WebGL2 from "../shared-modules/WebGL2/WebGL2-v1.0.js";

export const MandelbrotShading: any = {};
MandelbrotShading.SOFT_FAST = `@
    float hue = mandelbrotSmooth(mi, mz)/100.;
    outColor = vec4(hsv2rgb(vec3(hue-0.02,0.3+0.6*cos(hue*6.0),0.9)),1);
`
MandelbrotShading.SOFT = MandelbrotShading.SOFT_FAST + `
    for(int x=-1;x<=1;x++) {
    for(int y=-1;y<=1;y++) {
        mandelbrot(cf + float(x)/zoom, ci + float(y)/zoom, mi, mz);
        if(mi==-1) outColor = mix(outColor, vec4(0,0,0,1), 0.35);
    }
    }
`;
MandelbrotShading.DEFAULT = "#vec4(hsv2rgb(vec3(float(mi)/100.,1,1)),1);";
MandelbrotShading.DEFAULT_SMOOTH = "#vec4(hsv2rgb(vec3(mandelbrotSmooth(mi, mz)/100.,1,1)),1);";

export class MandelbrotShader {
    vertexShader: WebGL2.Shader;
    fragmentShader: WebGL2.Shader;
    program: WebGL2.Program;
    uResolution: WebGL2.Uniform;
    uCamera: WebGL2.Uniform;
    vao: WebGL2.VertexArray;
    positionBuffer: WebGL2.Buffer;
    constructor (public gl: WebGL2RenderingContext, shadeFunc: string) {
        let sft = shadeFunc.charAt(0);
        shadeFunc = shadeFunc.substring(1);
        if(sft == "@" || sft == "#")
            shadeFunc = `if(mi==-1) outColor = vec4(0,0,0,1); else { ${(sft=="#"?"outColor=":"")+shadeFunc} } `
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
            void mandelbrot(float cf, float ci, out int iterations, out vec2 z) {
                float zf = 0.0;
                float zi = 0.0;
                float zf2 = 0.0;
                float zi2 = 0.0;
                float temp = 0.0;
                for(int i=0;i<1000;i++) {
                    temp = zf2 - zi2 + cf;
                    zi = 2.0 * zf * zi + ci;
                    zf = temp;
                    zi2 = zi * zi;
                    zf2 = zf * zf;
                    if(abs(zi2 + zf2) >= 4.0) {
                        iterations = i;
                        z = vec2(zf, zi);
                        return;
                    }
                }
                iterations = -1;
                z = vec2(zf, zi);
            }
            float mandelbrotSmooth(int i, vec2 z) {
                return (float(i) + 1.0 - log(log(length(z))) / log(2.0));
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
                int mi = 0;
                vec2 mz = vec2(0, 0);
                mandelbrot(cf, ci, mi, mz);
                ${shadeFunc}
            }
        `;
        this.vertexShader = new WebGL2.Shader(gl, gl.VERTEX_SHADER, vertexSource);
        this.fragmentShader = new WebGL2.Shader(gl, gl.FRAGMENT_SHADER, fragmentSource);
        this.program = new WebGL2.Program(gl, this.vertexShader, this.fragmentShader);
        this.program.setActive();
        this.uResolution = new WebGL2.Uniform(gl, this.program, "u_resolution", "vec2");
        this.uCamera = new WebGL2.Uniform(gl, this.program, "u_camera", "vec3");
        this.vao = new WebGL2.VertexArray(gl);
        this.vao.setActive();
        this.positionBuffer = new WebGL2.Buffer(gl, this.program, "a_position", "vec2");
        this.positionBuffer.setActive();
        this.vao.enableBuffer(this.positionBuffer);
        this.positionBuffer.setData(new Float32Array([-1,-1, -1,1, 1,-1, 1,-1, -1,1, 1,1]));
    }
    render(camera: [x:number,y:number,z:number]) {
        const gl = this.gl;
        this.uCamera.setValues(camera);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    resize(width: number, height: number) {
        const gl = this.gl;
        gl.viewport(0, 0, width, height);
        this.uResolution.setValues([width, height]);
    }
    delete() {
        this.vao.delete();
        this.vertexShader.delete();
        this.fragmentShader.delete();
        this.program.delete();
    }
}