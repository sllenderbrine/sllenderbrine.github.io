import { WGL2ComponentAttribute } from "./WGL2ComponentAttribute.js";
import { WGL2ComponentProgram } from "./WGL2ComponentProgram.js";
import { WGL2ComponentShader } from "./WGL2ComponentShader.js";
import { WGL2ComponentUniform } from "./WGL2ComponentUniform.js";
import { WGL2Object } from "./WGL2Object.js";
import { WGL2Texture2D } from "./WGL2Texture2D.js";
import { WGL2Texture3D } from "./WGL2Texture3D.js";
import type { WGL2AttributeType } from "./WGL2AttributeType.d.ts";
import type { WGL2UniformType } from "./WGL2UniformType.js";

export class WGL2Shader {
    cProgram: WGL2ComponentProgram;
    cAttributes: WGL2ComponentAttribute[] = [];
    cAttributesByName: {[key:string]:WGL2ComponentAttribute} = {};
    cUniforms: WGL2ComponentUniform[] = []
    cUniformByName: {[key:string]:WGL2ComponentUniform} = {};
    constructor(public gl: WebGL2RenderingContext, vSource: string, fSource: string) {
        this.cProgram = new WGL2ComponentProgram(
            gl, new WGL2ComponentShader(gl, "vertex", vSource),
            new WGL2ComponentShader(gl, "fragment", fSource),
        );
        this.cProgram.setActive();
    }
    setActive() {
        this.cProgram.setActive();
    }
    createAttribute(name: string, type: WGL2AttributeType) {
        const att = new WGL2ComponentAttribute(this.gl, this.cProgram, name, type);
        this.cAttributes.push(att);
        this.cAttributesByName[name] = att;
        return att;
    }
    createUniform(name: string, type: WGL2UniformType) {
        const uniform = new WGL2ComponentUniform(this.gl, this.cProgram, name, type);
        this.cUniforms.push(uniform);
        this.cUniformByName[name] = uniform;
        return uniform;
    }
    createTexture2D(name: string, slot: number) {
        const texture = new WGL2Texture2D(this, name, slot);
        return texture;
    }
    createTexture3D(name: string, slot: number) {
        const texture = new WGL2Texture3D(this, name, slot);
        return texture;
    }
    createObject() {
        const obj = new WGL2Object(this);
        return obj;
    }
    getUniform(name: string) {
        return this.cUniformByName[name];
    }
    getAttribute(name: string) {
        return this.cAttributesByName[name];
    }
    remove() {
        this.cProgram.remove();
    }
}