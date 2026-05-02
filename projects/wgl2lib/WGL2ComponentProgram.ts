import type { WGL2ComponentShader } from "./WGL2ComponentShader.js";

export class WGL2ComponentProgram {
    wProgram: WebGLProgram;
    constructor(public gl: WebGL2RenderingContext, public cShaderV: WGL2ComponentShader, public cShaderF: WGL2ComponentShader) {
        const wProgram = gl.createProgram();
        if (!wProgram) {
            throw new Error("Failed to create program");
        }
        this.wProgram = wProgram;
        gl.attachShader(wProgram, cShaderV.wShader);
        gl.attachShader(wProgram, cShaderF.wShader);
        gl.linkProgram(wProgram);
        if(!gl.getProgramParameter(wProgram, gl.LINK_STATUS)) {
            const log = gl.getProgramInfoLog(wProgram);
            gl.deleteProgram(wProgram);
            throw new Error("Failed to link program: " + log);
        }
    }
    setActive(): void {
        this.gl.useProgram(this.wProgram);
    }
    remove(): void {
        this.gl.deleteProgram(this.wProgram);
    }
}