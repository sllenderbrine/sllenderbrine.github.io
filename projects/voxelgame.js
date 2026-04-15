import { Camera3D, RenderLoop, Vec3, WGL2Shader } from "./libge3/libge3_v20260414.js";
let camera = new Camera3D(Vec3.fill(16));
let voxels = new Uint32Array(32*32*32);
let canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);
let gl = canvas.getContext("webgl2");
let shader = new WGL2Shader(
    gl,
    `#version 300 es
        in vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0, 1);
        }
    `,
    `#version 300 es
        precision highp float;
        precision highp sampler3D;
        out vec4 outColor;
        uniform vec3 u_camera_position;
        uniform vec3 u_camera_direction;
        uniform vec2 u_resolution;
        uniform sampler3D u_chunk;

        void voxelRaycast(vec3 origin, vec3 direction, inout bool hit) {
            float idirx = abs(1.0/direction.x);
            float idiry = abs(1.0/direction.y);
            float idirz = abs(1.0/direction.z);
            int signx = direction.x>0.0?1:0;
            int signy = direction.y>0.0?1:0;
            int signz = direction.z>0.0?1:0;
            int stepx = signx*2-1;
            int stepy = signy*2-1;
            int stepz = signz*2-1;
            float tmaxx = idirx * (signx==0 ? (origin.x - floor(origin.x)) : (floor(origin.x) + 1.0 - origin.x));
            float tmaxy = idiry * (signy==0 ? (origin.y - floor(origin.y)) : (floor(origin.y) + 1.0 - origin.y));
            float tmaxz = idirz * (signz==0 ? (origin.z - floor(origin.z)) : (floor(origin.z) + 1.0 - origin.z));
            ivec3 pos = ivec3(floor(origin));
            float distance = 0.0;
            vec3 normal = vec3(0);
            for(int i=0; i<50; i++) {
                vec4 block = texelFetch(u_chunk, pos, 0);
                if(block.r > 0.5) {
                    hit = true;
                    return;
                }
                if(tmaxx < tmaxy) {
                    if(tmaxx < tmaxz) {
                        distance = tmaxx;
                        normal = vec3(-stepx, 0, 0);
                        tmaxx += idirx;
                        pos.x += stepx;
                    } else {
                        distance = tmaxz;
                        normal = vec3(0, 0, -stepz);
                        tmaxz += idirz;
                        pos.z += stepz;
                    }
                } else {
                    if(tmaxy < tmaxz) {
                        distance = tmaxy;
                        normal = vec3(0, -stepy, 0);
                        tmaxy += idiry;
                        pos.y += stepy;
                    } else {
                        distance = tmaxz;
                        normal = vec3(0, 0, -stepz);
                        tmaxz += idirz;
                        pos.z += stepz;
                    }
                }
            }
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution;
            vec3 dir = u_camera_direction;
            dir.x += uv.x;
            dir.y += uv.y;
            dir = normalize(dir);
            bool hit = false;
            voxelRaycast(u_camera_position, dir, hit);
            outColor = vec4(0.3, 0.6, 1, 1);
            if(hit) {
                outColor = vec4(1, 0, 0, 1);
            }
        }
    `
);
shader.addAttribute("a_position", "vec2");
let uCameraPosition = shader.createUniform("u_camera_position", "vec3");
let uCameraDirection = shader.createUniform("u_camera_direction", "vec3");
let uResolution = shader.createUniform("u_resolution", "vec2");
let uChunk = shader.createTexture3D("u_chunk", 0);
uResolution.setValues([canvas.width, canvas.height]);
let rect = shader.createObject();
rect.setData("a_position", new Float32Array([-1,-1,1,-1,1,1,-1,-1,-1,1,1,1]));
uChunk.setInterpolation(false);
uChunk.setRepeat(false);
let chunkData = new Uint8Array(32*32*32*4);
for(let i=0; i<chunkData.length; i++) {
    chunkData[i] = Math.floor(Math.random()*256);
}
uChunk.setData(32, 32, 32, chunkData);
new RenderLoop(dt => {
    uCameraPosition.setValues(camera.position.toArray());
    uCameraDirection.setValues(camera.forward.toArray());
    rect.drawTriangles();
}).start();