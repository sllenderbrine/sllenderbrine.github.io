import type WGL2ComponentProgram from "./WGL2ComponentProgram.js";
import type { WGL2UniformType } from "./WGL2UniformType.js";

export default class WGL2ComponentUniform {
    wLocation: WebGLUniformLocation;
    queuedValues: any[] | any | null = null;
    hasQueued = false;
    constructor(public gl: WebGL2RenderingContext, cProgram: WGL2ComponentProgram, name: string, public type: WGL2UniformType) {
        const wLocation = this.gl.getUniformLocation(cProgram.wProgram, name);
        if(wLocation === null) {
            throw new Error("Failed to get uniform location for " + name);
        }
        this.wLocation = wLocation;
    }
    setValues(values : any[] | any): void {
        const wLocation = this.wLocation
        const gl = this.gl;
        switch(this.type) {
            case "float": gl.uniform1f(wLocation, values); break;
            case "vec2": gl.uniform2fv(wLocation, values); break;
            case "vec3": gl.uniform3fv(wLocation, values); break;
            case "vec4": gl.uniform4fv(wLocation, values); break;
            case "int": gl.uniform1i(wLocation, values); break;
            case "ivec2": gl.uniform2iv(wLocation, values); break;
            case "ivec3": gl.uniform3iv(wLocation, values); break;
            case "ivec4": gl.uniform4iv(wLocation, values); break;
            case "uint": gl.uniform1ui(wLocation, values); break;
            case "uvec2": gl.uniform2uiv(wLocation, values); break;
            case "uvec3": gl.uniform3uiv(wLocation, values); break;
            case "uvec4": gl.uniform4uiv(wLocation, values); break;
            case "mat2": gl.uniformMatrix2fv(wLocation, false, values); break;
            case "mat3": gl.uniformMatrix3fv(wLocation, false, values); break;
            case "mat4": gl.uniformMatrix4fv(wLocation, false, values); break;
            default: throw new Error("Unsupported uniform type: " + this.type);
        }
    }
    queueValues(values: any[] | any): void {
        this.hasQueued = true;
        this.queuedValues = values;
    }
    update() {
        if(!this.hasQueued) return;
        this.hasQueued = false;
        this.setValues(this.queuedValues);
        this.queuedValues = null;
    }
}