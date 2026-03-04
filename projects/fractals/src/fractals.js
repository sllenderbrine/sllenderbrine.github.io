import * as WebGL2 from "../../shared/WebGL2/WebGL2-v1.0.js";
export const MandelbrotShading = {};
MandelbrotShading.SOFT_FAST = `@
    float hue = it/100.;
    outColor = vec4(hsv2rgb(vec3(hue-0.02,0.3+0.6*cos(hue*6.0),0.9)),1);
`;
MandelbrotShading.SOFT = MandelbrotShading.SOFT_FAST + `
    for(int x=-1;x<=1;x++) {
    for(int y=-1;y<=1;y++) {
        mandelbrot(cf + float(x)/zoom, ci + float(y)/zoom, mi, mz);
        if(mi==-1) outColor = mix(outColor, vec4(0,0,0,1), 0.35);
    }
    }
`;
MandelbrotShading.DEFAULT = "#vec4(hsv2rgb(vec3(it/100.,1,1)),1);";
MandelbrotShading.GRAYSCALE = `@
    float hue = it/100.;
    outColor = vec4(hsv2rgb(vec3(0,0,0.5 + 0.2 * cos(hue*30.0))),1);
`;
MandelbrotShading.PURPLE = `@
    float hue = cos(it/100.*24.0)*0.5+0.5;
    vec3 rgb = vec3(0,0,0);
    if(hue < 0.33) {
        rgb = mix(vec3(0.07,0.07,0.12), vec3(0.3,0.1,0.5), (hue-0.0)/0.33);
    } else if(hue < 0.66) {
        rgb = mix(vec3(0.3,0.1,0.5), vec3(0.9,0.1,0.3), (hue-0.33)/0.33);
    } else {
        rgb = mix(vec3(0.9,0.1,0.3), vec3(0.9,0.4,0.3), (hue-0.66)/0.33);
    }
    outColor = vec4(rgb,1);
`;
export class MandelbrotShader {
    gl;
    vertexShader;
    fragmentShader;
    program;
    uResolution;
    uCamera;
    vao;
    positionBuffer;
    constructor(gl, shadeFunc, smooth = false) {
        this.gl = gl;
        let sft = shadeFunc.charAt(0);
        shadeFunc = shadeFunc.substring(1);
        if (sft == "@" || sft == "#")
            shadeFunc = `if(mi==-1) outColor = vec4(0,0,0,1); else { ${(sft == "#" ? "outColor=" : "") + shadeFunc} } `;
        let vertexSource = `#version 300 es
            in vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0, 1);
            }
        `;
        let fragmentSource = `#version 300 es
            precision highp float;
            uniform vec2 u_resolution;
            uniform vec3 u_camera;
            out vec4 outColor;
            void mandelbrot(float cf, float ci, out int iterations, out vec2 z) {
                float zf = 0.0;
                float zi = 0.0;
                float zf2 = 0.0;
                float zi2 = 0.0;
                float temp = 0.0;
                for(int i=0;i<1000;i++) {
                    temp = zf2 - zi2 + cf;
                    zi = 2.0 * zf * zi + ci;
                    zf = temp;
                    zi2 = zi * zi;
                    zf2 = zf * zf;
                    if(abs(zi2 + zf2) >= 4.0) {
                        iterations = i;
                        z = vec2(zf, zi);
                        return;
                    }
                }
                iterations = -1;
                z = vec2(zf, zi);
            }
            float mandelbrotSmooth(int i, vec2 z) {
                return (float(i) + 1.0 - log(log(length(z))) / log(2.0));
            }
            vec3 hsv2rgb(vec3 c) {
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }
            void main() {
                float zoom = min(u_resolution.x, u_resolution.y) * u_camera.z;
                float cf = (gl_FragCoord.x - u_resolution.x / 2.0) / zoom + u_camera.x;
                float ci = (gl_FragCoord.y - u_resolution.y / 2.0) / zoom + u_camera.y;
                int mi = 0;
                vec2 mz = vec2(0, 0);
                mandelbrot(cf, ci, mi, mz);
                float it = ${smooth ? "mandelbrotSmooth(mi,mz);" : "float(mi);"}
                ${shadeFunc}
            }
        `;
        this.vertexShader = new WebGL2.Shader(gl, gl.VERTEX_SHADER, vertexSource);
        this.fragmentShader = new WebGL2.Shader(gl, gl.FRAGMENT_SHADER, fragmentSource);
        this.program = new WebGL2.Program(gl, this.vertexShader, this.fragmentShader);
        this.program.setActive();
        this.uResolution = new WebGL2.Uniform(gl, this.program, "u_resolution", "vec2");
        this.uCamera = new WebGL2.Uniform(gl, this.program, "u_camera", "vec3");
        this.vao = new WebGL2.VertexArray(gl);
        this.vao.setActive();
        this.positionBuffer = new WebGL2.Buffer(gl, this.program, "a_position", "vec2");
        this.positionBuffer.setActive();
        this.vao.enableBuffer(this.positionBuffer);
        this.positionBuffer.setData(new Float32Array([-1, -1, -1, 1, 1, -1, 1, -1, -1, 1, 1, 1]));
    }
    render(camera) {
        const gl = this.gl;
        this.uCamera.setValues(camera);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    resize(width, height) {
        const gl = this.gl;
        gl.viewport(0, 0, width, height);
        this.uResolution.setValues([width, height]);
    }
    delete() {
        this.vao.delete();
        this.vertexShader.delete();
        this.fragmentShader.delete();
        this.program.delete();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhY3RhbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmcmFjdGFscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssTUFBTSxNQUFNLG9DQUFvQyxDQUFDO0FBRTdELE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFRLEVBQUUsQ0FBQztBQUN6QyxpQkFBaUIsQ0FBQyxTQUFTLEdBQUc7OztDQUc3QixDQUFBO0FBQ0QsaUJBQWlCLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDLFNBQVMsR0FBRzs7Ozs7OztDQU90RCxDQUFDO0FBQ0YsaUJBQWlCLENBQUMsT0FBTyxHQUFHLHNDQUFzQyxDQUFDO0FBQ25FLGlCQUFpQixDQUFDLFNBQVMsR0FBRzs7O0NBRzdCLENBQUE7QUFDRCxpQkFBaUIsQ0FBQyxNQUFNLEdBQUc7Ozs7Ozs7Ozs7O0NBVzFCLENBQUE7QUFFRCxNQUFNLE9BQU8sZ0JBQWdCO0lBUUw7SUFQcEIsWUFBWSxDQUFnQjtJQUM1QixjQUFjLENBQWdCO0lBQzlCLE9BQU8sQ0FBaUI7SUFDeEIsV0FBVyxDQUFpQjtJQUM1QixPQUFPLENBQWlCO0lBQ3hCLEdBQUcsQ0FBcUI7SUFDeEIsY0FBYyxDQUFnQjtJQUM5QixZQUFvQixFQUEwQixFQUFFLFNBQWlCLEVBQUUsTUFBTSxHQUFHLEtBQUs7UUFBN0QsT0FBRSxHQUFGLEVBQUUsQ0FBd0I7UUFDMUMsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxJQUFHLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUc7WUFDdkIsU0FBUyxHQUFHLCtDQUErQyxDQUFDLEdBQUcsSUFBRSxHQUFHLENBQUEsQ0FBQyxDQUFBLFdBQVcsQ0FBQSxDQUFDLENBQUEsRUFBRSxDQUFDLEdBQUMsU0FBUyxLQUFLLENBQUE7UUFD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QUFDLE1BQU0sRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDMUIsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgV2ViR0wyIGZyb20gXCIuLi8uLi9zaGFyZWQvV2ViR0wyL1dlYkdMMi12MS4wLmpzXCI7XG5cbmV4cG9ydCBjb25zdCBNYW5kZWxicm90U2hhZGluZzogYW55ID0ge307XG5NYW5kZWxicm90U2hhZGluZy5TT0ZUX0ZBU1QgPSBgQFxuICAgIGZsb2F0IGh1ZSA9IGl0LzEwMC47XG4gICAgb3V0Q29sb3IgPSB2ZWM0KGhzdjJyZ2IodmVjMyhodWUtMC4wMiwwLjMrMC42KmNvcyhodWUqNi4wKSwwLjkpKSwxKTtcbmBcbk1hbmRlbGJyb3RTaGFkaW5nLlNPRlQgPSBNYW5kZWxicm90U2hhZGluZy5TT0ZUX0ZBU1QgKyBgXG4gICAgZm9yKGludCB4PS0xO3g8PTE7eCsrKSB7XG4gICAgZm9yKGludCB5PS0xO3k8PTE7eSsrKSB7XG4gICAgICAgIG1hbmRlbGJyb3QoY2YgKyBmbG9hdCh4KS96b29tLCBjaSArIGZsb2F0KHkpL3pvb20sIG1pLCBteik7XG4gICAgICAgIGlmKG1pPT0tMSkgb3V0Q29sb3IgPSBtaXgob3V0Q29sb3IsIHZlYzQoMCwwLDAsMSksIDAuMzUpO1xuICAgIH1cbiAgICB9XG5gO1xuTWFuZGVsYnJvdFNoYWRpbmcuREVGQVVMVCA9IFwiI3ZlYzQoaHN2MnJnYih2ZWMzKGl0LzEwMC4sMSwxKSksMSk7XCI7XG5NYW5kZWxicm90U2hhZGluZy5HUkFZU0NBTEUgPSBgQFxuICAgIGZsb2F0IGh1ZSA9IGl0LzEwMC47XG4gICAgb3V0Q29sb3IgPSB2ZWM0KGhzdjJyZ2IodmVjMygwLDAsMC41ICsgMC4yICogY29zKGh1ZSozMC4wKSkpLDEpO1xuYFxuTWFuZGVsYnJvdFNoYWRpbmcuUFVSUExFID0gYEBcbiAgICBmbG9hdCBodWUgPSBjb3MoaXQvMTAwLioyNC4wKSowLjUrMC41O1xuICAgIHZlYzMgcmdiID0gdmVjMygwLDAsMCk7XG4gICAgaWYoaHVlIDwgMC4zMykge1xuICAgICAgICByZ2IgPSBtaXgodmVjMygwLjA3LDAuMDcsMC4xMiksIHZlYzMoMC4zLDAuMSwwLjUpLCAoaHVlLTAuMCkvMC4zMyk7XG4gICAgfSBlbHNlIGlmKGh1ZSA8IDAuNjYpIHtcbiAgICAgICAgcmdiID0gbWl4KHZlYzMoMC4zLDAuMSwwLjUpLCB2ZWMzKDAuOSwwLjEsMC4zKSwgKGh1ZS0wLjMzKS8wLjMzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZ2IgPSBtaXgodmVjMygwLjksMC4xLDAuMyksIHZlYzMoMC45LDAuNCwwLjMpLCAoaHVlLTAuNjYpLzAuMzMpO1xuICAgIH1cbiAgICBvdXRDb2xvciA9IHZlYzQocmdiLDEpO1xuYFxuXG5leHBvcnQgY2xhc3MgTWFuZGVsYnJvdFNoYWRlciB7XG4gICAgdmVydGV4U2hhZGVyOiBXZWJHTDIuU2hhZGVyO1xuICAgIGZyYWdtZW50U2hhZGVyOiBXZWJHTDIuU2hhZGVyO1xuICAgIHByb2dyYW06IFdlYkdMMi5Qcm9ncmFtO1xuICAgIHVSZXNvbHV0aW9uOiBXZWJHTDIuVW5pZm9ybTtcbiAgICB1Q2FtZXJhOiBXZWJHTDIuVW5pZm9ybTtcbiAgICB2YW86IFdlYkdMMi5WZXJ0ZXhBcnJheTtcbiAgICBwb3NpdGlvbkJ1ZmZlcjogV2ViR0wyLkJ1ZmZlcjtcbiAgICBjb25zdHJ1Y3RvciAocHVibGljIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0LCBzaGFkZUZ1bmM6IHN0cmluZywgc21vb3RoID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IHNmdCA9IHNoYWRlRnVuYy5jaGFyQXQoMCk7XG4gICAgICAgIHNoYWRlRnVuYyA9IHNoYWRlRnVuYy5zdWJzdHJpbmcoMSk7XG4gICAgICAgIGlmKHNmdCA9PSBcIkBcIiB8fCBzZnQgPT0gXCIjXCIpXG4gICAgICAgICAgICBzaGFkZUZ1bmMgPSBgaWYobWk9PS0xKSBvdXRDb2xvciA9IHZlYzQoMCwwLDAsMSk7IGVsc2UgeyAkeyhzZnQ9PVwiI1wiP1wib3V0Q29sb3I9XCI6XCJcIikrc2hhZGVGdW5jfSB9IGBcbiAgICAgICAgbGV0IHZlcnRleFNvdXJjZSA9IGAjdmVyc2lvbiAzMDAgZXNcbiAgICAgICAgICAgIGluIHZlYzIgYV9wb3NpdGlvbjtcbiAgICAgICAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgICAgICAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoYV9wb3NpdGlvbiwgMCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIGA7XG4gICAgICAgIGxldCBmcmFnbWVudFNvdXJjZSA9IGAjdmVyc2lvbiAzMDAgZXNcbiAgICAgICAgICAgIHByZWNpc2lvbiBoaWdocCBmbG9hdDtcbiAgICAgICAgICAgIHVuaWZvcm0gdmVjMiB1X3Jlc29sdXRpb247XG4gICAgICAgICAgICB1bmlmb3JtIHZlYzMgdV9jYW1lcmE7XG4gICAgICAgICAgICBvdXQgdmVjNCBvdXRDb2xvcjtcbiAgICAgICAgICAgIHZvaWQgbWFuZGVsYnJvdChmbG9hdCBjZiwgZmxvYXQgY2ksIG91dCBpbnQgaXRlcmF0aW9ucywgb3V0IHZlYzIgeikge1xuICAgICAgICAgICAgICAgIGZsb2F0IHpmID0gMC4wO1xuICAgICAgICAgICAgICAgIGZsb2F0IHppID0gMC4wO1xuICAgICAgICAgICAgICAgIGZsb2F0IHpmMiA9IDAuMDtcbiAgICAgICAgICAgICAgICBmbG9hdCB6aTIgPSAwLjA7XG4gICAgICAgICAgICAgICAgZmxvYXQgdGVtcCA9IDAuMDtcbiAgICAgICAgICAgICAgICBmb3IoaW50IGk9MDtpPDEwMDA7aSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAgPSB6ZjIgLSB6aTIgKyBjZjtcbiAgICAgICAgICAgICAgICAgICAgemkgPSAyLjAgKiB6ZiAqIHppICsgY2k7XG4gICAgICAgICAgICAgICAgICAgIHpmID0gdGVtcDtcbiAgICAgICAgICAgICAgICAgICAgemkyID0gemkgKiB6aTtcbiAgICAgICAgICAgICAgICAgICAgemYyID0gemYgKiB6ZjtcbiAgICAgICAgICAgICAgICAgICAgaWYoYWJzKHppMiArIHpmMikgPj0gNC4wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVyYXRpb25zID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHogPSB2ZWMyKHpmLCB6aSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaXRlcmF0aW9ucyA9IC0xO1xuICAgICAgICAgICAgICAgIHogPSB2ZWMyKHpmLCB6aSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmbG9hdCBtYW5kZWxicm90U21vb3RoKGludCBpLCB2ZWMyIHopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGZsb2F0KGkpICsgMS4wIC0gbG9nKGxvZyhsZW5ndGgoeikpKSAvIGxvZygyLjApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZlYzMgaHN2MnJnYih2ZWMzIGMpIHtcbiAgICAgICAgICAgICAgICB2ZWM0IEsgPSB2ZWM0KDEuMCwgMi4wIC8gMy4wLCAxLjAgLyAzLjAsIDMuMCk7XG4gICAgICAgICAgICAgICAgdmVjMyBwID0gYWJzKGZyYWN0KGMueHh4ICsgSy54eXopICogNi4wIC0gSy53d3cpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjLnogKiBtaXgoSy54eHgsIGNsYW1wKHAgLSBLLnh4eCwgMC4wLCAxLjApLCBjLnkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICAgICAgICAgIGZsb2F0IHpvb20gPSBtaW4odV9yZXNvbHV0aW9uLngsIHVfcmVzb2x1dGlvbi55KSAqIHVfY2FtZXJhLno7XG4gICAgICAgICAgICAgICAgZmxvYXQgY2YgPSAoZ2xfRnJhZ0Nvb3JkLnggLSB1X3Jlc29sdXRpb24ueCAvIDIuMCkgLyB6b29tICsgdV9jYW1lcmEueDtcbiAgICAgICAgICAgICAgICBmbG9hdCBjaSA9IChnbF9GcmFnQ29vcmQueSAtIHVfcmVzb2x1dGlvbi55IC8gMi4wKSAvIHpvb20gKyB1X2NhbWVyYS55O1xuICAgICAgICAgICAgICAgIGludCBtaSA9IDA7XG4gICAgICAgICAgICAgICAgdmVjMiBteiA9IHZlYzIoMCwgMCk7XG4gICAgICAgICAgICAgICAgbWFuZGVsYnJvdChjZiwgY2ksIG1pLCBteik7XG4gICAgICAgICAgICAgICAgZmxvYXQgaXQgPSAke3Ntb290aD9cIm1hbmRlbGJyb3RTbW9vdGgobWksbXopO1wiOlwiZmxvYXQobWkpO1wifVxuICAgICAgICAgICAgICAgICR7c2hhZGVGdW5jfVxuICAgICAgICAgICAgfVxuICAgICAgICBgO1xuICAgICAgICB0aGlzLnZlcnRleFNoYWRlciA9IG5ldyBXZWJHTDIuU2hhZGVyKGdsLCBnbC5WRVJURVhfU0hBREVSLCB2ZXJ0ZXhTb3VyY2UpO1xuICAgICAgICB0aGlzLmZyYWdtZW50U2hhZGVyID0gbmV3IFdlYkdMMi5TaGFkZXIoZ2wsIGdsLkZSQUdNRU5UX1NIQURFUiwgZnJhZ21lbnRTb3VyY2UpO1xuICAgICAgICB0aGlzLnByb2dyYW0gPSBuZXcgV2ViR0wyLlByb2dyYW0oZ2wsIHRoaXMudmVydGV4U2hhZGVyLCB0aGlzLmZyYWdtZW50U2hhZGVyKTtcbiAgICAgICAgdGhpcy5wcm9ncmFtLnNldEFjdGl2ZSgpO1xuICAgICAgICB0aGlzLnVSZXNvbHV0aW9uID0gbmV3IFdlYkdMMi5Vbmlmb3JtKGdsLCB0aGlzLnByb2dyYW0sIFwidV9yZXNvbHV0aW9uXCIsIFwidmVjMlwiKTtcbiAgICAgICAgdGhpcy51Q2FtZXJhID0gbmV3IFdlYkdMMi5Vbmlmb3JtKGdsLCB0aGlzLnByb2dyYW0sIFwidV9jYW1lcmFcIiwgXCJ2ZWMzXCIpO1xuICAgICAgICB0aGlzLnZhbyA9IG5ldyBXZWJHTDIuVmVydGV4QXJyYXkoZ2wpO1xuICAgICAgICB0aGlzLnZhby5zZXRBY3RpdmUoKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbkJ1ZmZlciA9IG5ldyBXZWJHTDIuQnVmZmVyKGdsLCB0aGlzLnByb2dyYW0sIFwiYV9wb3NpdGlvblwiLCBcInZlYzJcIik7XG4gICAgICAgIHRoaXMucG9zaXRpb25CdWZmZXIuc2V0QWN0aXZlKCk7XG4gICAgICAgIHRoaXMudmFvLmVuYWJsZUJ1ZmZlcih0aGlzLnBvc2l0aW9uQnVmZmVyKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbkJ1ZmZlci5zZXREYXRhKG5ldyBGbG9hdDMyQXJyYXkoWy0xLC0xLCAtMSwxLCAxLC0xLCAxLC0xLCAtMSwxLCAxLDFdKSk7XG4gICAgfVxuICAgIHJlbmRlcihjYW1lcmE6IFt4Om51bWJlcix5Om51bWJlcix6Om51bWJlcl0pIHtcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLmdsO1xuICAgICAgICB0aGlzLnVDYW1lcmEuc2V0VmFsdWVzKGNhbWVyYSk7XG4gICAgICAgIGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVTLCAwLCA2KTtcbiAgICB9XG4gICAgcmVzaXplKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5nbDtcbiAgICAgICAgZ2wudmlld3BvcnQoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIHRoaXMudVJlc29sdXRpb24uc2V0VmFsdWVzKFt3aWR0aCwgaGVpZ2h0XSk7XG4gICAgfVxuICAgIGRlbGV0ZSgpIHtcbiAgICAgICAgdGhpcy52YW8uZGVsZXRlKCk7XG4gICAgICAgIHRoaXMudmVydGV4U2hhZGVyLmRlbGV0ZSgpO1xuICAgICAgICB0aGlzLmZyYWdtZW50U2hhZGVyLmRlbGV0ZSgpO1xuICAgICAgICB0aGlzLnByb2dyYW0uZGVsZXRlKCk7XG4gICAgfVxufSJdfQ==