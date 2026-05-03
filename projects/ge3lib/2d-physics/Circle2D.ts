import type Vec2 from "../vectors/Vec2.js";
import type Rect2D from "./Rect2D.js";
import type { Shape2DCollision } from "./Shape2DCollision.js";
import type Segment2D from "./Segment2D.js";
import Point2D from "./Point2D.js";
import EMath from "../utility/EMath.js";

export default class Circle2D {
    constructor(public position: Vec2, public radius: number) {
        
    }
    getRectCollision(rect: Rect2D): Shape2DCollision {
        let res = new Point2D(this.position).getRectCollision(rect);
        res.distance -= this.radius;
        if(res.distance <= 0) res.inside = true;
        return res;
    }
    isInsideCircle(other: Circle2D): boolean {
        return this.position.distTo(other.position) <= this.radius + other.radius
    }
    getCircleCollision(other: Circle2D): Shape2DCollision {
        let dist = this.position.distTo(other.position) - this.radius - other.radius;
        let normal = this.position.look(other.position);
        let collision = this.position.addScaled(normal, this.radius);
        return {
            inside: dist <= 0,
            collision,
            distance: dist,
            normal,
        };
    }
    getSegmentCollision(segment: Segment2D): Shape2DCollision {
        let dir = segment.start.look(segment.end);
        let off = this.position.sub(segment.start);
        let t = off.dot(dir);
        let maxT = segment.end.distTo(segment.start);
        t = EMath.clamp(t, 0, maxT);
        let collision = segment.start.addScaled(dir, t);
        let normal = collision.look(this.position);
        let dist = collision.distTo(this.position) - this.radius;
        return {
            inside: dist <= 0,
            collision,
            distance: dist,
            normal,
        };
    }
}