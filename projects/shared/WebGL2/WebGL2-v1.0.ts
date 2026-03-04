export type BufferType = (
    "float" | "int" | "uint" | "vec2" | "vec3" | "vec4"
    | "ivec2" | "ivec3" | "ivec4" | "uvec2" | "uvec3" | "uvec4"
);

export type UniformType = (
    "float" | "int" | "uint" | "vec2" | "vec3"
    | "vec4" | "ivec2" | "ivec3" | "ivec4" | "uvec2"
    | "uvec3" | "uvec4" | "mat2" | "mat3" | "mat4"
);

export class Shader {
    gl: WebGL2RenderingContext;
    type: GLenum;
    source: string;
    shader: WebGLShader;
    constructor(gl: WebGL2RenderingContext, type: GLenum, source: string) {
        this.gl = gl;
        this.type = type;
        this.source = source;
        const shader = gl.createShader(this.type);
        if (!shader) {
            throw new Error("Failed to create shader");
        }
        this.shader = shader;
        this.gl.shaderSource(this.shader, this.source);
        this.gl.compileShader(this.shader);
        if(!this.gl.getShaderParameter(this.shader, this.gl.COMPILE_STATUS)) {
            const log = this.gl.getShaderInfoLog(this.shader);
            this.gl.deleteShader(this.shader);
            throw new Error("Failed to compile shader: " + log);
        }
    }
    delete(): void {
        this.gl.deleteShader(this.shader);
    }
}

export class Program {
    gl: WebGL2RenderingContext;
    vertexShader: Shader;
    fragmentShader: Shader;
    program: WebGLProgram;
    constructor(gl: WebGL2RenderingContext, vertexShader: Shader, fragmentShader: Shader) {
        this.gl = gl;
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
        const program = gl.createProgram();
        if (!program) {
            throw new Error("Failed to create shader program");
        }
        this.program = program;
        this.gl.attachShader(this.program, this.vertexShader.shader);
        this.gl.attachShader(this.program, this.fragmentShader.shader);
        this.gl.linkProgram(this.program);
        if(!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            const log = this.gl.getProgramInfoLog(this.program);
            this.gl.deleteProgram(this.program);
            throw new Error("Failed to link program: " + log);
        }
    }
    setActive(): void {
        this.gl.useProgram(this.program);
    }
    delete(): void {
        this.gl.deleteProgram(this.program);
    }
}

export class Buffer {
    gl: WebGL2RenderingContext;
    name: string;
    glType: GLenum;
    buffer: WebGLBuffer;
    usage: GLenum;
    glLocation: GLint;
    dimensions: number;
    constructor(gl: WebGL2RenderingContext, program: Program, name: string, type: BufferType, usage: GLenum = gl.STATIC_DRAW) {
        this.gl = gl;
        this.name = name;
        this.usage = usage;
        const buffer = gl.createBuffer();
        if(!buffer) {
            throw new Error("Failed to create buffer");
        }
        this.buffer = buffer;
        this.glLocation = this.gl.getAttribLocation(program.program, this.name);
        switch(type) {
            case "float": this.glType = gl.FLOAT; this.dimensions = 1; break;
            case "vec2": this.glType = gl.FLOAT; this.dimensions = 2; break;
            case "vec3": this.glType = gl.FLOAT; this.dimensions = 3; break;
            case "vec4": this.glType = gl.FLOAT; this.dimensions = 4; break;
            case "int": this.glType = gl.INT; this.dimensions = 1; break;
            case "ivec2": this.glType = gl.INT; this.dimensions = 2; break;
            case "ivec3": this.glType = gl.INT; this.dimensions = 3; break;
            case "ivec4": this.glType = gl.INT; this.dimensions = 4; break;
            case "uint": this.glType = gl.UNSIGNED_INT; this.dimensions = 1; break;
            case "uvec2": this.glType = gl.UNSIGNED_INT; this.dimensions = 2; break;
            case "uvec3": this.glType = gl.UNSIGNED_INT; this.dimensions = 3; break;
            case "uvec4": this.glType = gl.UNSIGNED_INT; this.dimensions = 4; break;
            default: throw new Error("Unsupported buffer type: " + type);
        }
    }
    setActive(): void {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    }
    setData(values: any): void {
        this.gl.bufferData(this.gl.ARRAY_BUFFER, values, this.usage);
    }
    delete(): void {
        this.gl.deleteBuffer(this.buffer);
    }
}

export class VertexArray {
    gl: WebGL2RenderingContext;
    vao: WebGLVertexArrayObject;
    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.vao = this.gl.createVertexArray();
    }
    setActive(): void {
        this.gl.bindVertexArray(this.vao);
    }
    enableBuffer(buffer: Buffer): void {
        buffer.setActive();
        this.gl.enableVertexAttribArray(buffer.glLocation);
        if(buffer.glType == this.gl.FLOAT) {
            this.gl.vertexAttribPointer(buffer.glLocation, buffer.dimensions, buffer.glType, false, 0, 0);
        } else {
            this.gl.vertexAttribIPointer(buffer.glLocation, buffer.dimensions, buffer.glType, 0, 0);
        }
    }
    delete(): void {
        this.gl.deleteVertexArray(this.vao);
    }
}

export class Uniform {
    gl: WebGL2RenderingContext;
    name: string;
    glLocation: WebGLUniformLocation;
    type: UniformType;
    constructor(gl: WebGL2RenderingContext, program: Program, name: string, type: UniformType) {
        this.gl = gl;
        this.name = name;
        this.type = type;
        const location = this.gl.getUniformLocation(program.program, this.name);
        if(location === null) {
            throw new Error("Failed to get uniform location for " + this.name);
        }
        this.glLocation = location;
    }
    setValues(values : any[] | any): void {
        switch(this.type) {
            case "float": this.gl.uniform1f(this.glLocation, values); break;
            case "vec2": this.gl.uniform2fv(this.glLocation, values); break;
            case "vec3": this.gl.uniform3fv(this.glLocation, values); break;
            case "vec4": this.gl.uniform4fv(this.glLocation, values); break;
            case "int": this.gl.uniform1i(this.glLocation, values); break;
            case "ivec2": this.gl.uniform2iv(this.glLocation, values); break;
            case "ivec3": this.gl.uniform3iv(this.glLocation, values); break;
            case "ivec4": this.gl.uniform4iv(this.glLocation, values); break;
            case "uint": this.gl.uniform1ui(this.glLocation, values); break;
            case "uvec2": this.gl.uniform2uiv(this.glLocation, values); break;
            case "uvec3": this.gl.uniform3uiv(this.glLocation, values); break;
            case "uvec4": this.gl.uniform4uiv(this.glLocation, values); break;
            case "mat2": this.gl.uniformMatrix2fv(this.glLocation, false, values); break;
            case "mat3": this.gl.uniformMatrix3fv(this.glLocation, false, values); break;
            case "mat4": this.gl.uniformMatrix4fv(this.glLocation, false, values); break;
            default: throw new Error("Unsupported uniform type: " + this.type);
        }
    }
}

export class Texture2D {
    gl: WebGL2RenderingContext;
    texture: WebGLTexture;
    slot: number;
    uniform: Uniform;
    name: string;
    constructor(gl: WebGL2RenderingContext, program: Program, name: string, slot: number) {
        this.gl = gl;
        this.name = name;
        this.slot = slot;
        this.texture = gl.createTexture();
        this.setActive();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.uniform = new Uniform(this.gl, program, this.name, "int");
        this.uniform.setValues(this.slot);
    }
    setActive(): void {
        this.gl.activeTexture(this.gl.TEXTURE0 + this.slot);
    }
    setInterpolation(isEnabled: boolean = true) {
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, isEnabled ? this.gl.LINEAR : this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, isEnabled ? this.gl.LINEAR : this.gl.NEAREST);
    }
    setRepeat(isEnabled: boolean = true) {
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, isEnabled ? this.gl.REPEAT : this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, isEnabled ? this.gl.REPEAT : this.gl.CLAMP_TO_EDGE);
    }
    setData(width: number, height: number, data: ArrayBufferView | null = null): void {
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
    }
    setImage(image: TexImageSource): void {
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
    }
    generateMipmap(): void {
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
    }
    delete(): void {
        this.gl.deleteTexture(this.texture);
    }
}