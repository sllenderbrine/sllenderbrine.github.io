import Vec2 from "../vectors/Vec2.js";
import EMath from "../utility/EMath.js";
import type Rect2D from "./Rect2D.js";
import type Circle2D from "./Circle2D.js";
import type { Shape2DCollision } from "./Shape2DCollision.js";

export default class Point2D {
    constructor(public position: Vec2) {

    }
    isInsideRect(rect: Rect2D) {
        let diff = this.position.sub(rect.position);
        let dx = diff.dot(rect.right);
        let dy = diff.dot(rect.up);
        return (Math.abs(dx) <= rect.size.x && Math.abs(dy) <= rect.size.y);
    }
    getRectCollision(rect: Rect2D): Shape2DCollision {
        let diff = this.position.sub(rect.position);
        let dx = diff.dot(rect.right);
        let dy = diff.dot(rect.up);
        let isInside = (Math.abs(dx) < rect.size.x && Math.abs(dy) < rect.size.y);
        if(isInside) {
            let d1 = Math.abs(this.position.sub(rect.position.addScaled(rect.up, rect.size.y)).dot(rect.up));
            let d2 = Math.abs(this.position.sub(rect.position.addScaled(rect.up, -rect.size.y)).dot(rect.up));
            let d3 = Math.abs(this.position.sub(rect.position.addScaled(rect.right, rect.size.x)).dot(rect.right));
            let d4 = Math.abs(this.position.sub(rect.position.addScaled(rect.right, -rect.size.x)).dot(rect.right));
            let minIndex = 0;
            let minDist = d1;
            if(d2 < minDist) { minDist = d2; minIndex = 1; }
            if(d3 < minDist) { minDist = d3; minIndex = 2; }
            if(d4 < minDist) { minDist = d4; minIndex = 3; }
            let edge: Vec2;
            let normal: Vec2;
            switch(minIndex) {
                case 0:
                    edge = rect.position.addScaled(rect.right, dx).addScaled(rect.up, rect.size.y);
                    normal = rect.up;
                    break;
                case 1:
                    edge = rect.position.addScaled(rect.right, dx).addScaled(rect.up, -rect.size.y);
                    normal = rect.up.neg();
                    break;
                case 2:
                    edge = rect.position.addScaled(rect.up, dy).addScaled(rect.right, rect.size.x);
                    normal = rect.right;
                    break;
                case 3:
                    edge = rect.position.addScaled(rect.up, dy).addScaled(rect.right, -rect.size.x);
                    normal = rect.right.neg();
                    break;
            }
            return {
                inside: true,
                collision: edge!,
                distance: -edge!.distTo(this.position),
                normal: normal!,
            }
        } else {
            dx = EMath.clamp(dx, -rect.size.x, rect.size.x);
            dy = EMath.clamp(dy, -rect.size.y, rect.size.y);
            let edge = rect.position.addScaled(rect.right, dx).addScaled(rect.up, dy);
            let dist = edge.distTo(this.position);
            return {
                inside: false,
                collision: edge,
                distance: dist,
                normal: edge.look(this.position),
            };
        }
    }
    distToCircle(circle: Circle2D) {
        let dist = this.position.distTo(circle.position);
        return dist - circle.radius;
    }
    isInsideCircle(circle: Circle2D) {
        return this.distToCircle(circle) <= 0;
    }
}