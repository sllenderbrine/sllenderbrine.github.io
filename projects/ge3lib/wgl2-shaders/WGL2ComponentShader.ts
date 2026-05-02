export default class WGL2ComponentShader {
    wShader: WebGLShader;
    constructor(public gl: WebGL2RenderingContext, public type: "vertex" | "fragment", public source: string) {
        const wShader = gl.createShader(type == "vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
        if(wShader == null) {
            throw new Error("Failed to create shader");
        }
        this.wShader = wShader;
        gl.shaderSource(wShader, source);
        gl.compileShader(wShader)
        if(!gl.getShaderParameter(wShader, gl.COMPILE_STATUS)) {
            const log = gl.getShaderInfoLog(wShader);
            gl.deleteShader(wShader);
            throw new Error("Failed to compile shader: " + log);
        }
    }
    delete(): void {
        this.gl.deleteShader(this.wShader);
    }
}