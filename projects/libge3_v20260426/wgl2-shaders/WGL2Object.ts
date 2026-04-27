import WGL2ComponentVao from "./WGL2ComponentVao.js";
import WGL2ComponentBuffer from "./WGL2ComponentBuffer.js";
import type WGL2Shader from "./WGL2Shader.js";

export default class WGL2Object {
    gl: WebGL2RenderingContext;
    cVao: WGL2ComponentVao;
    cBufferByName: {[key:string]: WGL2ComponentBuffer} = {};
    vertexCount: number = 0;
    constructor(public shader: WGL2Shader) {
        this.gl = shader.gl;
        this.cVao = new WGL2ComponentVao(shader.gl);
        this.cVao.setActive();
        for(const attribute of shader.attributes) {
            const cBuf = new WGL2ComponentBuffer(shader.gl, attribute.type);
            cBuf.setActive();
            this.cVao.enableBuffer(cBuf, attribute.wLocation);
            this.cBufferByName[attribute.name] = cBuf;
        }
    }
    setData(attributeName: string, values: Float32Array, usage: GLenum = this.gl.STATIC_DRAW) {
        const cBuf = this.cBufferByName[attributeName];
        if(cBuf == null) {
            throw new Error("Could not find attribute with name: " + attributeName);
        }
        cBuf.setActive();
        this.gl.bufferData(this.gl.ARRAY_BUFFER, values, usage);
        this.vertexCount = values.length / cBuf.wDimensions;
    }
    drawTriangles() {
        this.cVao.setActive();
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);
    }
    drawLines() {
        this.cVao.setActive();
        this.gl.drawArrays(this.gl.LINES, 0, this.vertexCount);
    }
    drawPoints() {
        this.cVao.setActive();
        this.gl.drawArrays(this.gl.POINTS, 0, this.vertexCount);
    }
    delete() {
        for(const name in this.cBufferByName) {
            this.cBufferByName[name]!.delete();
        }
        this.cVao.delete();
        this.cBufferByName = {};
    }
}