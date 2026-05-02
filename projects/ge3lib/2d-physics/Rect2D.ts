import Vec2 from "../vectors/Vec2.js";

export default class Rect2D {
    constructor(public position: Vec2, size: Vec2, rotation: number) {
        this.size = size;
        this.rotation = rotation;
    }

    private _size!: Vec2;
    get size() { return this._size; }
    set size(value: Vec2) {
        this._size = value;
    }

    private _rotation!: number
    get rotation() { return this._rotation; }
    set rotation(value: number) {
        this._rotation = value;
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
}