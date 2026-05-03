import Vec2 from "../vectors/Vec2.js";
import Mat3 from "../matrices/Mat3.js";
import Color from "../colors/Color.js";
import Rect2D from "./Rect2D.js";
import Circle2D from "./Circle2D.js";
import { Signal } from "../utility/EventSignals.js";
import { Circle2DPositionsF32, Rect2DPositionsF32 } from "./Physics2DMeshes.js";
import type Camera2D from "../cameras/Camera2D.js";
import type WGL2Object from "../wgl2-shaders/WGL2Object.js";
import type WGL2Shader from "../wgl2-shaders/WGL2Shader.js";
import type WGL2ComponentUniform from "../wgl2-shaders/WGL2ComponentUniform.js";
import type { PhysicsPart2DShape } from "./PhysicsPart2DShape.js";

export default class PhysicsPart2D {
    anchored: boolean;
    velocity = Vec2.zero();
    hasCollision = true;
    color: Color;
    shaderObject!: WGL2Object;
    mass: number;
    restitution: number;
    gravity = 500;
    collisionEvent: Signal<[part: PhysicsPart2D]> = new Signal();
    constructor(
        shader: WGL2Shader,
        position: Vec2,
        size: Vec2,
        color = new Color(0, 0, 0),
        shapeType: PhysicsPart2DShape = "circle",
        anchored = false,
        restitution = 1,
        mass = 1,
    ) {
        this.shader = shader;
        this.shapeType = shapeType;
        this.position = position;
        this.size = size;
        this.color = color;
        this.anchored = anchored;
        this.restitution = restitution;
        this.mass = mass;
        this.rotation = 0;
    }

    private _shader!: WGL2Shader;
    uColor?: WGL2ComponentUniform;
    uView?: WGL2ComponentUniform;
    get shader() { return this._shader; }
    set shader(value: WGL2Shader) {
        this._shader = value;
        this.uColor = value.getUniform("u_color");
        this.uView = value.getUniform("u_view");
        if(this.shaderObject)
            this.shaderObject.delete();
        this.shaderObject = value.createObject();
        this._updateShaderObjectData();
    }

    private _rotation!: number;
    get rotation() { return this._rotation; }
    set rotation(value: number) {
        if(value == this._rotation)
            return;
        this._rotation = value;
        this._outdatedRotationMatrix = true;
        this._outdatedViewMatrix = true;
        if(this.shape instanceof Rect2D) {
            this.shape.rotation = this._rotation;
        }
    } 

    lastPosition = Vec2.zero();
    private _position!: Vec2;
    get position() { return this._position; }
    set position(value: Vec2) {
        this._position = value;
        this._position.onMutate = () => {
            this._outdatedTranslationMatrix = true;
            this._outdatedViewMatrix = true;
        }
        this._position.mutate();
        this.shape.position = this._position;
    }

    shape!: Circle2D | Rect2D;
    private _shapeType!: PhysicsPart2DShape;
    get shapeType() { return this._shapeType; }
    set shapeType(value: PhysicsPart2DShape) {
        this._shapeType = value;
        this._updateShaderObjectData();
    }
    private _updateShaderObjectData() {
        const size = this.size ?? Vec2.zero();
        switch(this._shapeType) {
            case "rect":
                this.shaderObject.setData("a_position", Rect2DPositionsF32);
                this.shape = new Rect2D(this.position, size, this.rotation);
                break;
            case "circle":
                this.shaderObject.setData("a_position", Circle2DPositionsF32);
                this.shape = new Circle2D(this.position, Math.min(size.x, size.y));
                break;
        }
    }

    private _size!: Vec2;
    get size() { return this._size; }
    set size(value: Vec2) {
        this._size = value;
        this._size.onMutate = () => {
            this._outdatedScaleMatrix = true;
            this._outdatedViewMatrix = true;
        }
        this._size.mutate();
        if(this.shape instanceof Rect2D) {
            this.shape.size = this._size;
        } else {
            this.shape.radius = Math.min(this._size.x, this._size.y);
        }
    }
    
    private _translationMatrix: number[] = [];
    private _outdatedTranslationMatrix?: boolean = true;
    get translationMatrix() {
        this.updateTranslationMatrix();
        return this._translationMatrix;
    }
    updateTranslationMatrix() {
        if(this._outdatedTranslationMatrix != true)
            return;
        this._translationMatrix = Mat3.translate(this.position.x, this.position.y);
        delete this._outdatedTranslationMatrix;
    }

    private _rotationMatrix: number[] = [];
    private _outdatedRotationMatrix?: boolean = true;
    get rotationMatrix() {
        this.updateRotationMatrix();
        return this._rotationMatrix;
    }
    updateRotationMatrix() {
        if(this._outdatedRotationMatrix != true)
            return;
        this._rotationMatrix = Mat3.rotate(this.rotation);
        delete this._outdatedRotationMatrix;
    }

    private _scaleMatrix: number[] = [];
    private _outdatedScaleMatrix?: boolean = true;
    get scaleMatrix() {
        this.updateScaleMatrix();
        return this._scaleMatrix;
    }
    updateScaleMatrix() {
        if(this._outdatedScaleMatrix != true)
            return;
        if(this._shapeType == "circle") {
            const radius = Math.min(this.size.x, this.size.y);
            this._scaleMatrix = Mat3.scale(radius, radius);
        } else {
            this._scaleMatrix = Mat3.scale(this.size.x, this.size.y);
        }
        delete this._outdatedScaleMatrix;
    }

    private _viewMatrix: number[] = [];
    private _outdatedViewMatrix?: boolean = true;
    get viewMatrix() {
        this.updateViewMatrix();
        return this._viewMatrix;
    }
    updateViewMatrix() {
        if(this._outdatedViewMatrix != true)
            return;
        this._viewMatrix = Mat3.multiply(this.rotationMatrix, Mat3.multiply(this.translationMatrix, this.scaleMatrix));
        delete this._outdatedViewMatrix;
    }

    resolveCircleCircleCollision(other: PhysicsPart2D) {
        const circleA = this.shape as Circle2D;
        const circleB = other.shape as Circle2D;
        let dist = this.position.distTo(other.position) - circleA.radius - circleB.radius;
        if(dist > 0)
            return;
        let normal = this.position.look(other.position);
        const velAlongNormal = other.velocity.sub(this.velocity).dot(normal);
        const mi = (1/this.mass + 1/other.mass);
        if (velAlongNormal < 0) {
            const restitution = Math.min(this.restitution, other.restitution);
            const j = -(1+restitution) * velAlongNormal / mi;
            this.velocity.addScaledSelf(normal, j * -1 / this.mass);
            other.velocity.addScaledSelf(normal, j * 1 / other.mass);
        }
        const correction = normal.rescale(Math.max(-dist - 1e-4, 0) / mi * 0.8);
        this.position.addScaledSelf(correction, -1/this.mass);
        other.position.addScaledSelf(correction, 1/other.mass);
        this.collisionEvent.fire(other);
        other.collisionEvent.fire(this);
    }

    resolveCircleAnchoredRectCollision(other: PhysicsPart2D) {
        const circle = this.shape as Circle2D;
        const rect = other.shape as Rect2D;
        let diff = this.position.sub(rect.position);
        let dx = diff.dot(rect.right);
        let dy = diff.dot(rect.up);
        if(Math.abs(dx) >= rect.size.x + circle.radius || Math.abs(dy) >= rect.size.y + circle.radius)
            return;
        let d1 = Math.abs(this.position.sub(rect.position.addScaled(rect.up, rect.size.y)).dot(rect.up));
        let d2 = Math.abs(this.position.sub(rect.position.addScaled(rect.up, -rect.size.y)).dot(rect.up));
        let d3 = Math.abs(this.position.sub(rect.position.addScaled(rect.right, rect.size.x)).dot(rect.right));
        let d4 = Math.abs(this.position.sub(rect.position.addScaled(rect.right, -rect.size.x)).dot(rect.right));
        let minIndex = 0;
        let minDist = d1;
        if(d2 < minDist) { minDist = d2; minIndex = 1; }
        if(d3 < minDist) { minDist = d3; minIndex = 2; }
        if(d4 < minDist) { minDist = d4; minIndex = 3; }
        if(minDist > circle.radius)
            return;
        let edge!: Vec2;
        let normal!: Vec2;
        switch(minIndex) {
            case 0:
                edge = rect.position.addScaled(rect.right, dx).addScaledSelf(rect.up, rect.size.y);
                normal = rect.up;
                break;
            case 1:
                edge = rect.position.addScaled(rect.right, dx).addScaledSelf(rect.up, -rect.size.y);
                normal = rect.up.neg();
                break;
            case 2:
                edge = rect.position.addScaled(rect.up, dy).addScaledSelf(rect.right, rect.size.x);
                normal = rect.right;
                break;
            case 3:
                edge = rect.position.addScaled(rect.up, dy).addScaledSelf(rect.right, -rect.size.x);
                normal = rect.right.neg();
                break;
        }
        const velAlongNormal = this.velocity.sub(other.velocity).dot(normal);
        if (velAlongNormal < 0) {
            const restitution = Math.min(this.restitution, other.restitution);
            const j = -(1+restitution) * velAlongNormal;
            this.velocity.addScaledSelf(normal, j);
        }
        this.position = edge.addScaledSelf(normal, circle.radius + 1e-6);
        this.collisionEvent.fire(other);
        other.collisionEvent.fire(this);
    }

    render(camera?: Camera2D) {
        if(this.uColor)
            this.uColor.setValues([this.color.r, this.color.g, this.color.b]);
        if(this.uView)
            this.uView.setValues(camera ? Mat3.multiply(camera.viewMatrix, this.viewMatrix) : this.viewMatrix);
        this.shaderObject.drawTriangles();
    }
}