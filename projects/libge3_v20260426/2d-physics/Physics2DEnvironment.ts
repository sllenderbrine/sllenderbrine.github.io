import Camera2D from "../cameras/Camera2D";
import { Signal } from "../utility/EventSignals";
import WGL2Shader from "../wgl2-shaders/WGL2Shader";
import PhysicsPart2D from "./PhysicsPart2D";

export class Physics2DEnvironment {
    partObserver: Signal<[obj: any]> = new Signal({onConnect:(conn)=>{for(const obj of this.parts)conn.fire(obj);}});
    parts: PhysicsPart2D[] = [];
    defaultShader: WGL2Shader;
    constructor(public gl: WebGL2RenderingContext) {
        this.defaultShader = new WGL2Shader(
            gl,
            `#version 300 es
                in vec2 a_position;
                uniform mat3 u_view;
                void main() {
                    vec2 v_position = (u_view * vec3(a_position, 1)).xy;
                    gl_Position = vec4(v_position, 0, 1);
                }
            `,
            `#version 300 es
                precision highp float;
                uniform vec3 u_color;
                out vec4 outColor;
                void main() {
                    outColor = vec4(u_color/255., 1);
                }
            `,
        );
        this.defaultShader.addAttribute("a_position", "vec2");
        this.defaultShader.createUniform("u_view", "mat3");
        this.defaultShader.createUniform("u_color", "vec3");
    }
    addPart(part: PhysicsPart2D) {
        this.parts.push(part);
    }
    removePart(part: PhysicsPart2D) {
        const index = this.parts.indexOf(part);
        if(index == -1) return;
        this.parts.splice(index, 1);
    }
    update(dt: number, solvesCount = 3) {
        for(let part of this.parts) {
            if(part.anchored) {
                part.velocity = part.position.sub(part.lastPosition).mulF(1/dt);
                part.lastPosition.setC(part.position.x, part.position.y);
            } else {
                part.lastPosition.setC(part.position.x, part.position.y);
                part.velocity.y -= part.gravity * dt;
                part.position.addScaledSelf(part.velocity, dt);
            }
        }
        for(let i=0; i<solvesCount; i++) {
            for(let j=0; j<this.parts.length; j++) {
                const part = this.parts[j]!;
                if(!part.hasCollision) continue;
                for(let k=j+1; k<this.parts.length; k++) {
                    const other = this.parts[k]!;
                    if(!other.hasCollision) continue;
                    if(part.anchored && other.anchored) continue;
                    if(part.shapeType === "circle" && other.shapeType === "circle") {
                        part.resolveCircleCircleCollision(other);
                    } else if(part.shapeType === "circle" && other.shapeType === "rect") {
                        part.resolveCircleAnchoredRectCollision(other);
                    } else if(part.shapeType === "rect" && other.shapeType === "circle") {
                        other.resolveCircleAnchoredRectCollision(part);
                    }
                }
            }
        }
    }
    renderAll(camera: Camera2D) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        for(let part of this.parts) {
            part.render(camera);
        }
    }
}