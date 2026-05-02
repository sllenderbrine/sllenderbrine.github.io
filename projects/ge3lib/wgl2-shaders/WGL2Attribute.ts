import type { WGL2AttributeType } from "./WGL2UniformType";

export default class WGL2Attribute {
    wLocation: number;
    constructor(public gl: WebGL2RenderingContext, public wProgram: WebGLProgram, public name: string, public type: WGL2AttributeType) {
        this.wLocation = gl.getAttribLocation(wProgram, name);
    }
}