import Vec3 from "../vectors/Vec3";
import Mat4 from "../matrices/Mat4";
import { Signal } from "../utility/EventSignals";

export default class Camera3D {
    constructor(position?: Vec3, fovY?: number, aspect?: number, near?: number, far?: number) {
        this.position = position ?? Vec3.zero();
        this.fovY = fovY ?? 95/180*Math.PI;
        this.aspect = aspect ?? 1;
        this.near = near ?? 0.1;
        this.far = far ?? 10000;
        this.rotation = Vec3.zero();
    }

    private _fovY!: number;
    get fovY() {
        return this._fovY;
    }
    set fovY(n: number) {
        this._fovY = n;
        this._outdatedPerspectiveMatrix = true;
    }

    private _aspect!: number;
    get aspect() {
        return this._aspect;
    }
    set aspect(n: number) {
        this._aspect = n;
        this._outdatedPerspectiveMatrix = true;
    }

    private _near!: number;
    get near() {
        return this._near;
    }
    set near(n: number) {
        this._near = n;
        this._outdatedPerspectiveMatrix = true;
    }

    private _far!: number;
    get far() {
        return this._far;
    }
    set far(n: number) {
        this._far = n;
        this._outdatedPerspectiveMatrix = true;
    }

    private _position!: Vec3;
    get position() {
        return this._position;
    }
    set position(v: Vec3) {
        this._position = v;
        v.onMutate = () => {
            this._outdatedTranslationMatrix = true;
            this._outdatedViewMatrix = true;
        };
        v.mutate();
    }

    private _worldScale = 1;
    get worldScale() {
        return this._worldScale;
    }
    set worldScale(n: number) {
        this._worldScale = n;
        this._outdatedTranslationMatrix = true;
        this._outdatedViewMatrix = true;
    }

    private _rotation!: Vec3;
    get rotation() {
        return this._rotation;
    }
    set rotation(v: Vec3) {
        this._rotation = v;
        v.onMutate = () => {
            this._outdatedForward = true;
            this._outdatedRight = true;
            this._outdatedUp = true;
            this._outdatedForwardFlat = true;
            this._outdatedRotationMatrix = true;
            this._outdatedViewMatrix = true;
        };
        v.mutate();
    }

    private _forward = Vec3.zero();
    private _outdatedForward?: boolean = true;
    get forward() {
        this.updateForward();
        return this._forward;
    }
    updateForward() {
        if(this._outdatedForward != true)
            return;
        this._forward = Vec3.zAxis().negSelf().rotXYZSelf(this._rotation);
        delete this._outdatedForward;
    }

    private _right = Vec3.zero();
    private _outdatedRight?: boolean = true;
    get right() {
        this.updateRight();
        return this._right;
    }
    updateRight() {
        if(this._outdatedRight != true)
            return;
        this._right = Vec3.xAxis().rotXYZSelf(this._rotation);
        delete this._outdatedRight;
    }

    private _up = Vec3.zero();
    private _outdatedUp?: boolean = true;
    get up() {
        this.updateUp();
        return this._up;
    }
    updateUp() {
        if(this._outdatedUp != true)
            return;
        this._up = Vec3.yAxis().rotXYZSelf(this._rotation);
        delete this._outdatedUp;
    }

    private _forwardFlat = Vec3.zero();
    private _outdatedForwardFlat?: boolean = true;
    get forwardFlat() {
        this.updateForwardFlat();
        return this._forwardFlat;
    }
    updateForwardFlat() {
        if(this._outdatedForwardFlat != true)
            return;
        this._forwardFlat = Vec3.zAxis().negSelf().rotYSelf(this._rotation.y);
        delete this._outdatedForwardFlat;
    }

    private _perspectiveMatrix: number[] = [];
    private _outdatedPerspectiveMatrix?: boolean = true;
    public perspectiveMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.perspectiveMatrix) });
    get perspectiveMatrix() {
        this.updatePerspectiveMatrix();
        return this._perspectiveMatrix;
    }
    updatePerspectiveMatrix() {
        if(this._outdatedPerspectiveMatrix != true)
            return;
        this._perspectiveMatrix = Mat4.perspective(this._fovY, this._aspect, this._near, this._far);
        delete this._outdatedPerspectiveMatrix;
        this.perspectiveMatrixObserver.fire(this._perspectiveMatrix);
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
        this._translationMatrix = Mat4.translate(-this._position.x * this._worldScale, -this._position.y * this._worldScale, -this._position.z * this._worldScale);
        delete this._outdatedTranslationMatrix;
        this.translationMatrixObserver.fire(this._viewMatrix);
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
        this._rotationMatrix = Mat4.multiply(
            Mat4.rotateZ(-this._rotation.z),
            Mat4.multiply(
                Mat4.rotateX(-this._rotation.x),
                Mat4.rotateY(-this._rotation.y),
            )
        );
        delete this._outdatedRotationMatrix;
        this.rotationMatrixObserver.fire(this._viewMatrix);
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
        this._viewMatrix = Mat4.multiply(this.rotationMatrix, this.translationMatrix);
        delete this._outdatedViewMatrix;
        this.viewMatrixObserver.fire(this._viewMatrix);
    }

    private _combinedMatrix: number[] = [];
    private _outdatedCombinedMatrix?: boolean = true;
    public combinedMatrixObserver = new Signal({ onConnect: conn => conn.fire(this.combinedMatrix) });
    get combinedMatrix() {
        this.updateCombinedMatrix();
        return this._combinedMatrix;
    }
    updateCombinedMatrix() {
        if(this._outdatedCombinedMatrix != true)
            return;
        this._combinedMatrix = Mat4.multiply(this.viewMatrix, this.perspectiveMatrix);
        delete this._outdatedCombinedMatrix;
        this.combinedMatrixObserver.fire(this._combinedMatrix);
    }

    lookAt(p: Vec3) {
        let f = this.position.look(p);
        this.rotation = new Vec3(f.pitch(), f.yaw(), 0);
    }
}