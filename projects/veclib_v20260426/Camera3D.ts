import { Mat4 } from "./Mat4.js";
import { Vec3 } from "./Vec3.js";

export class Camera3D {
    aspect = 1;
    verticalFov = 90*Math.PI/180;
    near = 0.1;
    far = 10000;
    position = Vec3.zero();
    rotation = Vec3.zero();
    viewValid = false
    viewMatrix = Mat4.partialCameraView();
    projectionValid = false;
    projectionMatrix = Mat4.partialPerspective();

    constructor() {

    }

    invalidateProjection() {
        this.projectionValid = false;
    }

    invalidateView() {
        this.viewValid = false;
    }

    calculateProjection() {
        if(this.projectionValid)
            return false;
        Mat4.setPerspective(this.verticalFov, this.aspect, this.near, this.far, this.projectionMatrix);
        this.projectionValid = true;
        return true;
    }

    calculateView() {
        if(this.viewValid)
            return false;
        Mat4.setCameraView(this.position.x, this.position.y, this.position.z, this.rotation.x, this.rotation.y, this.rotation.z, this.viewMatrix);
        this.viewValid = true;
        return true;
    }
    
    lookAt(p: Vec3) {
        let f = this.position.look(p);
        this.rotation = new Vec3(f.pitch(), f.yaw(), 0);
    }
}