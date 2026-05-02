import type { WGL2AttributeType } from "./WGL2AttributeType.js";
import type { WGL2ComponentProgram } from "./WGL2ComponentProgram.js";

export class WGL2ComponentAttribute {
    wLocation: number;
    constructor(public gl: WebGL2RenderingContext, public cProgram: WGL2ComponentProgram, public name: string, public type: WGL2AttributeType) {
        this.wLocation = gl.getAttribLocation(cProgram.wProgram, name);
    }
}