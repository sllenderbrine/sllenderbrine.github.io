import { Color } from "../paintlib/index.js";
import { Camera3D, Mat3, Mat4, Vec3 } from "../veclib/index.js";
import { WGL2Attribute, WGL2ComponentUniform, WGL2Object, WGL2Shader } from "../wgl2lib/index.js";
import { Mesh } from "./Mesh.js";

export const planeFrontMesh = new Mesh();
planeFrontMesh.positions.push(-1,-1,1, 1,-1,1, 1,1,1, -1,-1,1, 1,1,1, -1,1,1);
planeFrontMesh.texcoords.push(0,0, 1,0, 1,1, 0,0, 0,1, 1,1);
planeFrontMesh.normals.push(0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1);
const tmp0 = Vec3.zero();
export const planeLeftMesh = planeFrontMesh.clone().transformSelf((position, texcoord, normal) => {
    tmp0.fromArray(position).rotateYPut(Math.PI/2, tmp0).toArrayPut(position);
    tmp0.fromArray(normal).rotateYPut(Math.PI/2, tmp0).toArrayPut(normal);
});
export const planeBackMesh = planeFrontMesh.clone().transformSelf((position, texcoord, normal) => {
    tmp0.fromArray(position).rotateYPut(Math.PI, tmp0).toArrayPut(position);
    tmp0.fromArray(normal).rotateYPut(Math.PI, tmp0).toArrayPut(normal);
});
export const planeRightMesh = planeFrontMesh.clone().transformSelf((position, texcoord, normal) => {
    tmp0.fromArray(position).rotateYPut(3*Math.PI/2, tmp0).toArrayPut(position);
    tmp0.fromArray(normal).rotateYPut(3*Math.PI/2, tmp0).toArrayPut(normal);
});
export const planeBottomMesh = planeFrontMesh.clone().transformSelf((position, texcoord, normal) => {
    tmp0.fromArray(position).rotateXPut(Math.PI/2, tmp0).toArrayPut(position);
    tmp0.fromArray(normal).rotateXPut(Math.PI/2, tmp0).toArrayPut(normal);
});
export const planeTopMesh = planeFrontMesh.clone().transformSelf((position, texcoord, normal) => {
    tmp0.fromArray(position).rotateXPut(3*Math.PI/2, tmp0).toArrayPut(position);
    tmp0.fromArray(normal).rotateXPut(3*Math.PI/2, tmp0).toArrayPut(normal);
});
export const cubeMesh = new Mesh().concatSelf(
    planeFrontMesh, planeLeftMesh, planeBackMesh,
    planeRightMesh, planeBottomMesh, planeTopMesh
);
export const cubeMeshPositions = new Float32Array(cubeMesh.positions);
export const cubeMeshNormals = new Float32Array(cubeMesh.normals);

export class MeshPart {
    shaderObject: WGL2Object;
    position: Vec3;
    rotation: Vec3;
    size: Vec3;
    scaleMatrix: Float32Array;
    translationMatrix: Float32Array;
    rotationLocked = false;
    rotationMatrix: Float32Array;
    modelMatrix: Float32Array;
    normalMatrix: Float32Array;
    color: Color;
    colorUniform: [number, number, number];
    matrixValid: boolean;
    constructor(public scene: SimpleScene, public shader: SimpleSceneShader, positions: Float32Array, normals: Float32Array) {
        this.shaderObject = shader.shader.createObject();
        this.shaderObject.setData(shader.aPosition.name, positions);
        this.shaderObject.setData(shader.aNormal.name, normals);
        this.position = Vec3.zero();
        this.rotation = Vec3.zero();
        this.size = Vec3.one();
        this.scaleMatrix = Mat4.partialScale();
        this.translationMatrix = Mat4.partialTranslation();
        this.rotationMatrix = Mat4.partialRotationYXZ();
        this.modelMatrix = Mat4.newIdentity();
        this.normalMatrix = Mat3.newIdentity();
        this.color = new Color(255, 0, 0);
        this.colorUniform = [1, 0, 0];
        this.matrixValid = false;
    }
    invalidateMatrix() {
        this.matrixValid = false;
    }
    updateColor() {
        this.colorUniform[0] = this.color.r / 255;
        this.colorUniform[1] = this.color.g / 255;
        this.colorUniform[2] = this.color.b / 255;
    }
    calculateMatrix() {
        if(this.matrixValid)
            return;
        this.matrixValid = true;
        Mat4.setScale(this.size.x, this.size.y, this.size.z, this.scaleMatrix);
        Mat4.setTranslation(this.position.x, this.position.y, this.position.z, this.translationMatrix);
        if(!this.rotationLocked)
            Mat4.setRotationYXZ(this.rotation.x, this.rotation.y, this.rotation.z, this.rotationMatrix);
        Mat4.multiplyPut(
            Mat4.multiplyPut(
                this.translationMatrix,
                this.rotationMatrix,
                this.modelMatrix
            ),
            this.scaleMatrix,
            this.modelMatrix
        );
        Mat3.mat4ToNormalPut(this.modelMatrix, this.normalMatrix);
    }
    render() {
        this.calculateMatrix();
        this.shader.uModel.setValues(this.modelMatrix);
        this.shader.uModelNormal.setValues(this.normalMatrix);
        this.shader.uColor.setValues(this.colorUniform);
        this.shaderObject.drawTriangles();
    }
    remove() {
        const index = this.scene.objects.indexOf(this);
        if(index >= 0) {
            this.scene.objects.splice(index, 1);
        }
        this.shaderObject.delete();
    }
}

export class SimpleSceneShader {
    shader: WGL2Shader;
    uPerspective: WGL2ComponentUniform;
    uView: WGL2ComponentUniform;
    uModel: WGL2ComponentUniform;
    uModelNormal: WGL2ComponentUniform;
    uSunDirection: WGL2ComponentUniform;
    uColor: WGL2ComponentUniform;
    aPosition: WGL2Attribute;
    aNormal: WGL2Attribute;
    constructor(public gl: WebGL2RenderingContext) {
        this.shader = new WGL2Shader(
            gl,
            `#version 300 es
                in vec3 a_position;
                in vec3 a_normal;
                uniform mat4 u_perspective;
                uniform mat4 u_view;
                uniform mat4 u_model;
                uniform mat3 u_model_normal;
                uniform vec3 u_sun_direction;
                out float v_lighting;
                void main() {
                    gl_Position = u_perspective * u_view * u_model * vec4(a_position, 1);
                    vec3 normal = normalize(u_model_normal * a_normal);
                    v_lighting = dot(normal, u_sun_direction) * 0.5 + 0.5;
                }
            `, `#version 300 es
                precision highp float;
                in float v_lighting;
                uniform vec3 u_color;
                out vec4 outColor;
                void main() {
                    outColor = vec4(u_color * v_lighting, 1);
                }
            `
        );
        this.uPerspective = this.shader.createUniform("u_perspective", "mat4");
        this.uView = this.shader.createUniform("u_view", "mat4");
        this.uModel = this.shader.createUniform("u_model", "mat4");
        this.uModelNormal = this.shader.createUniform("u_model_normal", "mat3");
        this.uSunDirection = this.shader.createUniform("u_sun_direction", "vec3");
        this.uColor = this.shader.createUniform("u_color", "vec3");
        let sunDir = new Vec3(1,2,3);
        sunDir.normPut(sunDir);
        this.uSunDirection.setValues(sunDir.toArray());
        this.aPosition = this.shader.addAttribute("a_position", "vec3");
        this.aNormal = this.shader.addAttribute("a_normal", "vec3");
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.clearColor(0.05, 0.07, 0.1, 1);
    }
}

export class SimpleScene {
    objects: MeshPart[] = [];
    shader: SimpleSceneShader;
    constructor(public gl: WebGL2RenderingContext) {
        this.shader = new SimpleSceneShader(gl);
    }
    createPart() {
        let part = new MeshPart(this, this.shader, cubeMeshPositions, cubeMeshNormals);
        this.objects.push(part);
        return part;
    }
    render(camera: Camera3D) {
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        camera.calculateProjection();
        camera.calculateView();
        this.shader.uPerspective.setValues(camera.projectionMatrix);
        this.shader.uView.setValues(camera.viewMatrix);
        for(let obj of this.objects) {
            obj.render();
        }
    }
}