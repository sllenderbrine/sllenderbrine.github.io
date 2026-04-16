import { Camera3D, EMath, Keypresses, Noise, PointerLock, RenderLoop, UiButton, Vec2, Vec3, WGL2Shader } from "../../libge3/libge3_v20260414.js";
let camera = new Camera3D(new Vec3(42, 28, 42));
camera.lookAt(Vec3.fill(16));
let voxels = new Uint32Array(32*32*32);
let canvas = document.createElement("canvas");
canvas.width = 400;
canvas.height = 300;
canvas.style.imageRendering = "pixelated";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.objectFit = "contain";
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
        uniform vec3 u_camera_right;
        uniform vec3 u_camera_up;
        uniform vec2 u_resolution;
        uniform float u_tan_fov;
        uniform float u_aspect;
        uniform vec3 u_sun_direction;
        uniform sampler3D u_chunk;

        void voxelRaycast(vec3 origin, vec3 direction, int maxIterations, inout bool hit, inout vec3 normal, inout float distance) {
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
            for(int i=0; i<maxIterations; i++) {
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

        void softShadow(vec3 origin, vec3 direction, int maxIterations, inout float volume) {
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
            bool hit = false;
            float distance = 0.0;
            for(int i=0; i<maxIterations; i++) {
                vec4 block = texelFetch(u_chunk, pos, 0);
                hit = false;
                if(block.r > 0.5) {
                    hit = true;
                }
                if(tmaxx < tmaxy) {
                    if(tmaxx < tmaxz) {
                        if(hit) volume += tmaxx - distance;
                        distance = tmaxx;
                        // normal = vec3(-stepx, 0, 0);
                        tmaxx += idirx;
                        pos.x += stepx;
                    } else {
                        if(hit) volume += tmaxz - distance;
                        distance = tmaxz;
                        // normal = vec3(0, 0, -stepz);
                        tmaxz += idirz;
                        pos.z += stepz;
                    }
                } else {
                    if(tmaxy < tmaxz) {
                        if(hit) volume += tmaxy - distance;
                        distance = tmaxy;
                        // normal = vec3(0, -stepy, 0);
                        tmaxy += idiry;
                        pos.y += stepy;
                    } else {
                        if(hit) volume += tmaxz - distance;
                        distance = tmaxz;
                        // normal = vec3(0, 0, -stepz);
                        tmaxz += idirz;
                        pos.z += stepz;
                    }
                }
            }
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution;
            vec2 ndc = uv * 2.0 - 1.0;
            vec3 dir = u_camera_direction;
            dir += u_camera_right * (ndc.x * u_aspect * u_tan_fov);
            dir += u_camera_up * (ndc.y * u_tan_fov);
            dir = normalize(dir);
            bool hit = false;
            vec3 normal = vec3(0);
            float distance = 0.0;
            voxelRaycast(u_camera_position, dir, 150, hit, normal, distance);
            outColor = vec4(0.3, 0.6, 1, 1);
            if(hit) {
                float v_light = dot(normal, u_sun_direction) * 0.5 + 0.5;
                float volume = 0.0;
                softShadow(u_camera_position + dir * distance + normal * 0.01, u_sun_direction, 10, volume);
                float density = 1.0;
                float shadow = exp(-volume * density);
                v_light = min(v_light, shadow);
                v_light = clamp(v_light, 0.2, 1.0);
                outColor = vec4(vec3(1, 1, 1) * v_light, 1);
            }
        }
    `
);
shader.addAttribute("a_position", "vec2");
let uCameraPosition = shader.createUniform("u_camera_position", "vec3");
let uCameraDirection = shader.createUniform("u_camera_direction", "vec3");
let uCameraRight = shader.createUniform("u_camera_right", "vec3");
let uCameraUp = shader.createUniform("u_camera_up", "vec3");
let uResolution = shader.createUniform("u_resolution", "vec2");
let uAspect = shader.createUniform("u_aspect", "float");
let uTanFov = shader.createUniform("u_tan_fov", "float");
let uSunDirection = shader.createUniform("u_sun_direction", "vec3");
let uChunk = shader.createTexture3D("u_chunk", 0);
uResolution.setValues([canvas.width, canvas.height]);
uAspect.setValues(canvas.width / canvas.height);
uTanFov.setValues(Math.tan(camera.fovY * 0.5));
uSunDirection.setValues(new Vec3(1, 3, 2).normSelf().toArray());
let rect = shader.createObject();
rect.setData("a_position", new Float32Array([-1,-1,1,-1,1,1,-1,-1,-1,1,1,1]));
uChunk.setInterpolation(false);
uChunk.setRepeat(false);
let chunkData = new Uint8Array(32*32*32*4);
for(let x=0; x<32; x++) {
    for(let z=0; z<32; z++) {
        let height = Noise.perlinNoise2D(x/12, z/12) * 10 + 10;
        for(let y=0; y<32; y++) {
            let index = (z * 32 * 32 + y * 32 + x) * 4;
            if(y < height) {
                chunkData[index] = 255;
                chunkData[index+1] = 255;
                chunkData[index+2] = 255;
                chunkData[index+3] = 255;
            }
        }
    }
}
uChunk.setData(32, 32, 32, chunkData);
let pointerLock = new PointerLock();
pointerLock.lock();
pointerLock.lockedMouseMoveEvent.connect((mx, my) => {
    camera.rotation.x -= my * 0.01;
    camera.rotation.y -= mx * 0.01;
    camera.rotation.x = EMath.clamp(camera.rotation.x, -Math.PI/2, Math.PI/2);
    camera.rotation = camera.rotation;
});
new RenderLoop(dt => {
    let moveVector = Vec2.zero();
    let moveUp = 0;
    if(Keypresses.keyPressed["w"]) moveVector.y++;
    if(Keypresses.keyPressed["s"]) moveVector.y--;
    if(Keypresses.keyPressed["a"]) moveVector.x--;
    if(Keypresses.keyPressed["d"]) moveVector.x++;
    if(Keypresses.keyPressed[" "]) moveUp++;
    if(Keypresses.keyPressed["shift"]) moveUp--;
    moveVector.normSelf();
    camera.position.addScaledSelf(camera.forwardFlat, moveVector.y * dt * 15);
    camera.position.addScaledSelf(camera.right, moveVector.x * dt * 15);
    camera.position.y += moveUp * dt * 15;
    uCameraPosition.setValues([camera.position.x, camera.position.y, camera.position.z]);
    uCameraDirection.setValues(camera.forward.toArray());
    uCameraRight.setValues(camera.right.toArray());
    uCameraUp.setValues(camera.up.toArray());
    rect.drawTriangles();
}).start();