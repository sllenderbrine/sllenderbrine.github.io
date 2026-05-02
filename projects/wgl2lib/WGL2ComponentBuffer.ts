import type { WGL2AttributeType } from "./WGL2AttributeType.d.ts";

export class WGL2ComponentBuffer {
    wType: GLenum;
    wDimensions: number;
    wBuffer: WebGLBuffer;
    constructor(public gl: WebGL2RenderingContext, type: WGL2AttributeType) {
        const buffer = gl.createBuffer();
        if(!buffer) {
            throw new Error("Failed to create buffer");
        }
        this.wBuffer = buffer;
        switch(type) {
            case "float": this.wType = gl.FLOAT; this.wDimensions = 1; break;
            case "vec2": this.wType = gl.FLOAT; this.wDimensions = 2; break;
            case "vec3": this.wType = gl.FLOAT; this.wDimensions = 3; break;
            case "vec4": this.wType = gl.FLOAT; this.wDimensions = 4; break;
            case "int": this.wType = gl.INT; this.wDimensions = 1; break;
            case "ivec2": this.wType = gl.INT; this.wDimensions = 2; break;
            case "ivec3": this.wType = gl.INT; this.wDimensions = 3; break;
            case "ivec4": this.wType = gl.INT; this.wDimensions = 4; break;
            case "uint": this.wType = gl.UNSIGNED_INT; this.wDimensions = 1; break;
            case "uvec2": this.wType = gl.UNSIGNED_INT; this.wDimensions = 2; break;
            case "uvec3": this.wType = gl.UNSIGNED_INT; this.wDimensions = 3; break;
            case "uvec4": this.wType = gl.UNSIGNED_INT; this.wDimensions = 4; break;
            default: throw new Error("Unsupported buffer type: " + type);
        }
    }
    setActive(): void {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.wBuffer);
    }
    remove(): void {
        this.gl.deleteBuffer(this.wBuffer);
    }
}