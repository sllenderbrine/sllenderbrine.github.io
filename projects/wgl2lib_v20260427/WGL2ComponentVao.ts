import type WGL2ComponentBuffer from "./WGL2ComponentBuffer.js";

export default class WGL2ComponentVao {
    wVao: WebGLVertexArrayObject;
    constructor(public gl: WebGL2RenderingContext) {
        this.wVao = gl.createVertexArray();
    }
    setActive(): void {
        this.gl.bindVertexArray(this.wVao);
    }
    enableBuffer(cBuffer: WGL2ComponentBuffer, wLocation: number): void {
        cBuffer.setActive();
        this.gl.enableVertexAttribArray(wLocation);
        if(cBuffer.wType == this.gl.FLOAT) {
            this.gl.vertexAttribPointer(wLocation, cBuffer.wDimensions, cBuffer.wType, false, 0, 0);
        } else {
            this.gl.vertexAttribIPointer(wLocation, cBuffer.wDimensions, cBuffer.wType, 0, 0);
        }
    }
    delete(): void {
        this.gl.deleteVertexArray(this.wVao);
    }
}