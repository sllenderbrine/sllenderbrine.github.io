import Vec2 from "../vectors/Vec2";
import Mat3 from "../matrices/Mat3";
import { Signal } from "../utility/EventSignals";

export default class Camera2D {
    constructor(position?: Vec2, scale?: Vec2) {
        this.position = position ?? Vec2.zero();
        this.scale = scale ?? Vec2.fill(1);
        this.rotation = 0;
    }

    private _position!: Vec2;
    get position() { return this._position; }
    set position(value: Vec2) {
        this._position = value;
        this._position.onMutate = () => {
            this._outdatedTranslationMatrix = true;
            this._outdatedViewMatrix = true;
        }
        this._position.mutate();
    }

    private _scale!: Vec2;
    get scale() { return this._scale; }
    set scale(value: Vec2) {
        this._scale = value;
        this._scale.onMutate = () => {
            this._outdatedScaleMatrix = true;
            this._outdatedViewMatrix = true;
        };
        this._scale.mutate();
    }

    private _rotation!: number;
    get rotation() { return this._rotation; }
    set rotation(value: number) {
        this._rotation = value;
        this._outdatedRotationMatrix = true;
        this._outdatedViewMatrix = true;
        this._outdatedRight = true;
        this._outdatedUp = true;
    }

    private _right = Vec2.zero();
    private _outdatedRight?: boolean = true;
    get right() {
        this.updateRight();
        return this._right;
    }
    updateRight() {
        if(this._outdatedRight != true)
            return;
        this._right = Vec2.xAxis().rotateSelf(this._rotation);
        delete this._outdatedRight;
    }

    private _up = Vec2.zero();
    private _outdatedUp?: boolean = true;
    get up() {
        this.updateUp();
        return this._up;
    }
    updateUp() {
        if(this._outdatedUp != true)
            return;
        this._up = Vec2.yAxis().rotateSelf(this._rotation);
        delete this._outdatedUp;
    }

    private _translationMatrix: number[] = [];
    private _outdatedTranslationMatrix?: boolean = true;
    public translationMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.translationMatrix) });
    get translationMatrix() {
        this.updateTranslationMatrix();
        return this._translationMatrix;
    }
    updateTranslationMatrix() {
        if(this._outdatedTranslationMatrix != true)
            return;
        this._translationMatrix = Mat3.translate(-this.position.x, -this.position.y);
        delete this._outdatedViewMatrix;
        this.translationMatrixObserver.fire(this._translationMatrix);
    }

    private _rotationMatrix: number[] = [];
    private _outdatedRotationMatrix?: boolean = true;
    public rotationMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.rotationMatrix) });
    get rotationMatrix() {
        this.updateRotationMatrix();
        return this._rotationMatrix;
    }
    updateRotationMatrix() {
        if(this._outdatedRotationMatrix != true)
            return;
        this._rotationMatrix = Mat3.rotate(this.rotation);
        delete this._outdatedRotationMatrix;
        this.rotationMatrixObserver.fire(this._rotationMatrix);
    }

    private _scaleMatrix: number[] = [];
    private _outdatedScaleMatrix?: boolean = true;
    public scaleMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.scaleMatrix) });
    get scaleMatrix() {
        this.updateScaleMatrix();
        return this._scaleMatrix;
    }
    updateScaleMatrix() {
        if(this._outdatedScaleMatrix != true)
            return;
        this._scaleMatrix = Mat3.scale(this.scale.x, this.scale.y);
        delete this._outdatedScaleMatrix;
        this.scaleMatrixObserver.fire(this._scaleMatrix);
    }

    private _viewMatrix: number[] = [];
    private _outdatedViewMatrix?: boolean = true;
    public viewMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.viewMatrix) });
    get viewMatrix() {
        this.updateViewMatrix();
        return this._viewMatrix;
    }
    updateViewMatrix() {
        if(this._outdatedViewMatrix != true)
            return;
        this._viewMatrix = Mat3.multiply(this.scaleMatrix, Mat3.multiply(this.translationMatrix, this.rotationMatrix));
        delete this._outdatedViewMatrix;
        this.viewMatrixObserver.fire(this._viewMatrix);
    }
}