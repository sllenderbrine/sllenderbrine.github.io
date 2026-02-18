export class Shader {
    gl;
    type;
    source;
    shader;
    constructor(gl, type, source) {
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
        if (!this.gl.getShaderParameter(this.shader, this.gl.COMPILE_STATUS)) {
            const log = this.gl.getShaderInfoLog(this.shader);
            this.gl.deleteShader(this.shader);
            throw new Error("Failed to compile shader: " + log);
        }
    }
    delete() {
        this.gl.deleteShader(this.shader);
    }
}
export class Program {
    gl;
    vertexShader;
    fragmentShader;
    program;
    constructor(gl, vertexShader, fragmentShader) {
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
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            const log = this.gl.getProgramInfoLog(this.program);
            this.gl.deleteProgram(this.program);
            throw new Error("Failed to link program: " + log);
        }
    }
    setActive() {
        this.gl.useProgram(this.program);
    }
    delete() {
        this.gl.deleteProgram(this.program);
    }
}
export class Buffer {
    gl;
    name;
    glType;
    buffer;
    usage;
    glLocation;
    dimensions;
    constructor(gl, program, name, type, usage = gl.STATIC_DRAW) {
        this.gl = gl;
        this.name = name;
        this.usage = usage;
        const buffer = gl.createBuffer();
        if (!buffer) {
            throw new Error("Failed to create buffer");
        }
        this.buffer = buffer;
        this.glLocation = this.gl.getAttribLocation(program.program, this.name);
        switch (type) {
            case "float":
                this.glType = gl.FLOAT;
                this.dimensions = 1;
                break;
            case "vec2":
                this.glType = gl.FLOAT;
                this.dimensions = 2;
                break;
            case "vec3":
                this.glType = gl.FLOAT;
                this.dimensions = 3;
                break;
            case "vec4":
                this.glType = gl.FLOAT;
                this.dimensions = 4;
                break;
            case "int":
                this.glType = gl.INT;
                this.dimensions = 1;
                break;
            case "ivec2":
                this.glType = gl.INT;
                this.dimensions = 2;
                break;
            case "ivec3":
                this.glType = gl.INT;
                this.dimensions = 3;
                break;
            case "ivec4":
                this.glType = gl.INT;
                this.dimensions = 4;
                break;
            case "uint":
                this.glType = gl.UNSIGNED_INT;
                this.dimensions = 1;
                break;
            case "uvec2":
                this.glType = gl.UNSIGNED_INT;
                this.dimensions = 2;
                break;
            case "uvec3":
                this.glType = gl.UNSIGNED_INT;
                this.dimensions = 3;
                break;
            case "uvec4":
                this.glType = gl.UNSIGNED_INT;
                this.dimensions = 4;
                break;
            default: throw new Error("Unsupported buffer type: " + type);
        }
    }
    setActive() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    }
    setData(values) {
        this.gl.bufferData(this.gl.ARRAY_BUFFER, values, this.usage);
    }
    delete() {
        this.gl.deleteBuffer(this.buffer);
    }
}
export class VertexArray {
    gl;
    vao;
    constructor(gl) {
        this.gl = gl;
        this.vao = this.gl.createVertexArray();
    }
    setActive() {
        this.gl.bindVertexArray(this.vao);
    }
    enableBuffer(buffer) {
        buffer.setActive();
        this.gl.enableVertexAttribArray(buffer.glLocation);
        if (buffer.glType == this.gl.FLOAT) {
            this.gl.vertexAttribPointer(buffer.glLocation, buffer.dimensions, buffer.glType, false, 0, 0);
        }
        else {
            this.gl.vertexAttribIPointer(buffer.glLocation, buffer.dimensions, buffer.glType, 0, 0);
        }
    }
    delete() {
        this.gl.deleteVertexArray(this.vao);
    }
}
export class Uniform {
    gl;
    name;
    glLocation;
    type;
    constructor(gl, program, name, type) {
        this.gl = gl;
        this.name = name;
        this.type = type;
        const location = this.gl.getUniformLocation(program.program, this.name);
        if (location === null) {
            throw new Error("Failed to get uniform location for " + this.name);
        }
        this.glLocation = location;
    }
    setValues(values) {
        switch (this.type) {
            case "float":
                this.gl.uniform1f(this.glLocation, values);
                break;
            case "vec2":
                this.gl.uniform2fv(this.glLocation, values);
                break;
            case "vec3":
                this.gl.uniform3fv(this.glLocation, values);
                break;
            case "vec4":
                this.gl.uniform4fv(this.glLocation, values);
                break;
            case "int":
                this.gl.uniform1i(this.glLocation, values);
                break;
            case "ivec2":
                this.gl.uniform2iv(this.glLocation, values);
                break;
            case "ivec3":
                this.gl.uniform3iv(this.glLocation, values);
                break;
            case "ivec4":
                this.gl.uniform4iv(this.glLocation, values);
                break;
            case "uint":
                this.gl.uniform1ui(this.glLocation, values);
                break;
            case "uvec2":
                this.gl.uniform2uiv(this.glLocation, values);
                break;
            case "uvec3":
                this.gl.uniform3uiv(this.glLocation, values);
                break;
            case "uvec4":
                this.gl.uniform4uiv(this.glLocation, values);
                break;
            case "mat2":
                this.gl.uniformMatrix2fv(this.glLocation, false, values);
                break;
            case "mat3":
                this.gl.uniformMatrix3fv(this.glLocation, false, values);
                break;
            case "mat4":
                this.gl.uniformMatrix4fv(this.glLocation, false, values);
                break;
            default: throw new Error("Unsupported uniform type: " + this.type);
        }
    }
}
export class Texture2D {
    gl;
    texture;
    slot;
    uniform;
    name;
    constructor(gl, program, name, slot) {
        this.gl = gl;
        this.name = name;
        this.slot = slot;
        this.texture = gl.createTexture();
        this.setActive();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.uniform = new Uniform(this.gl, program, this.name, "int");
        this.uniform.setValues(this.slot);
    }
    setActive() {
        this.gl.activeTexture(this.gl.TEXTURE0 + this.slot);
    }
    setInterpolation(isEnabled = true) {
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, isEnabled ? this.gl.LINEAR : this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, isEnabled ? this.gl.LINEAR : this.gl.NEAREST);
    }
    setRepeat(isEnabled = true) {
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, isEnabled ? this.gl.REPEAT : this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, isEnabled ? this.gl.REPEAT : this.gl.CLAMP_TO_EDGE);
    }
    setData(width, height, data = null) {
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
    }
    setImage(image) {
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
    }
    generateMipmap() {
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
    }
    delete() {
        this.gl.deleteTexture(this.texture);
    }
}
//# sourceMappingURL=WebGL2-v1.0.js.map