import { BLOB, FORM, FORM_COUNT, TEX_WIDTH, buildForms } from './shapes';

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
 const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.);
 vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
 vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
 vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
 i=mod289(i);
 vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
 float n_=.142857142857; vec3 ns=n_*D.wyz-D.xzx;
 vec4 j=p-49.*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.*x_);
 vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.-abs(x)-abs(y);
 vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
 vec4 s0=floor(b0)*2.+1.; vec4 s1=floor(b1)*2.+1.; vec4 sh=-step(h,vec4(0.));
 vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
 vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
 vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
 p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
 vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.); m=m*m;
 return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const VERT = /* glsl */ `#version 300 es
precision highp float; precision highp sampler2D;
uniform sampler2D uTex; uniform int uRows; uniform int uA; uniform int uB; uniform float uMix; uniform float uTime; uniform float uMotion;
uniform mat4 uProj; uniform mat4 uView; uniform vec2 uMouse; uniform float uMouseOn; uniform float uSize; uniform float uAspect;
uniform float uBlobA; uniform float uBlobB; uniform vec3 uOffA; uniform vec3 uOffB; uniform float uArc; uniform float uScale;
uniform float uIntro; uniform int uCloud;
out vec3 vCol; out float vA;
${NOISE}
const float TAU=6.2831853;
vec3 trefoil(float u){ return vec3(sin(u)+2.*sin(2.*u), cos(u)-2.*cos(2.*u), -sin(3.*u))*.37; }
vec3 knot(vec4 q, out float along){
  float u=q.x*TAU+uTime*(.1+q.w*.16)*uMotion;
  along=u;
  vec3 c=trefoil(u), T=normalize(trefoil(u+.01)-c);
  vec3 Nn=normalize(cross(T,normalize(c+vec3(0.,0.,.001)))); vec3 Bn=cross(T,Nn);
  float th=q.y*TAU+u*3.+uTime*.35*uMotion;
  float pulse=1.+.25*sin(u*2.-uTime*1.6);
  return c+(Nn*cos(th)+Bn*sin(th))*q.z*pulse;
}
vec4 S(int s,int i,out float along){
  vec4 q=texelFetch(uTex, ivec2(i%256, s*uRows + i/256), 0);
  along=-1.;
  if(s==0) return vec4(knot(q,along),q.w);
  return q;
}
void main(){
  int i=gl_VertexID; float alA; float alB;
  vec4 a=S(uA,i,alA); vec4 b=S(uB,i,alB); float r=a.w;
  float t=clamp(uMix*1.6-r*.6,0.,1.); t=t*t*(3.-2.*t);
  vec3 p=mix(a.xyz,b.xyz,t);
  float fl=sin(t*3.14159)*uMotion;
  // Assembly from the cloud is its own layer on top of whatever form the scroll is on, so scrolling during it never stalls.
  vec4 cl=texelFetch(uTex, ivec2(i%256, uCloud*uRows + i/256), 0);
  float it=clamp(uIntro*1.6-r*.6,0.,1.); it=it*it*(3.-2.*it);
  p=mix(cl.xyz,p,it);
  fl=max(fl,sin(it*3.14159)*uMotion);
  float tt=uTime*.18;
  vec3 n=vec3(snoise(p*1.25+vec3(tt)), snoise(p*1.25+vec3(17.1,-tt,4.)), snoise(p*1.25+vec3(-8.,31.,tt)));
  p+=n*((.035+.02*sin(uTime*1.3+r*6.28))*uMotion+fl*.65);
  float blob=mix(uBlobA,uBlobB,t);
  float wave=snoise(normalize(p+1e-4)*1.15+vec3(0.,uTime*.32,uTime*.21));
  p+=normalize(p+1e-4)*wave*.3*blob*uMotion;
  vec4 mv=uView*vec4(p*uScale,1.);
  vec3 off=mix(uOffA,uOffB,t)+vec3(0.,-fl*.5,fl*1.2)*uArc;
  mv.xyz+=off;
  vec3 cv=(uView*vec4(0.,0.,0.,1.)).xyz+off;
  float face=clamp(dot(normalize(mv.xyz-cv),vec3(0.,0.,1.))*.5+.5,0.,1.);
  vec4 clip=uProj*mv;
  vec2 d=clip.xy/clip.w-uMouse; d.x*=uAspect;
  float push=smoothstep(.2,0.,length(d))*.09*uMouseOn;
  clip.xy+=normalize(d+1e-5)*push*clip.w*vec2(1./uAspect,1.);
  gl_Position=clip;
  float depth=-mv.z;
  gl_PointSize=uSize*(.55+r)/depth*(1.+push*4.)*(1.+fl*.4);
  vec3 iris=vec3(.50,.32,1.), saf=vec3(1.,.72,.16);
  float k=snoise(p*.7+vec3(0.,uTime*.12,0.))*.5+.5;
  vCol=mix(iris,saf,smoothstep(.15,.85,k*.8+wave*.35*blob+p.y*.2));
  float kn=(uA==0?1.-t:0.)+(uB==0?t:0.);
  float al=alA>-.5?alA:alB;
  vec3 kc=mix(iris,saf,smoothstep(-.6,.9,sin(al-uTime*.9)));
  kc=mix(kc,vec3(1.,.93,.8),smoothstep(.8,1.,sin(al*3.+uTime*1.4))*.6);
  vCol=mix(vCol,kc,kn);
  if(r>.985) vCol=vec3(1.,.95,.86)*1.4;
  vCol*=1.+push*5.;
  vA=(.4+fl*.3)*mix(1.,.25+face*1.35,blob)*smoothstep(10.,3.,depth)*(1.+blob*.35)*(1.+kn*.35);
}`;

const FRAG = /* glsl */ `#version 300 es
precision highp float; in vec3 vCol; in float vA; out vec4 o;
void main(){ vec2 c=gl_PointCoord-.5; float a=smoothstep(.5,0.,length(c)); a*=a; float k=a*vA; o=vec4(vCol*k,min(k,1.)); }`;

export type Vec3 = [number, number, number];

export interface FrameParams {
  a: number;
  b: number;
  mix: number;
  offA: Vec3;
  offB: Vec3;
  arc: number;
  yaw: number;
  pitch: number;
  time: number;
  motion: number;
  mouse: { x: number; y: number; on: number };
  /** Base particle size in CSS px at depth 1; scaled by DPR and canvas height. */
  size: number;
  distance: number;
  /** Uniform size of the form; used to fit portrait screens without moving the camera. */
  scale: number;
  /** 0 = particles still scattered in the intro cloud, 1 = fully on the current forms. */
  intro: number;
}

const persp = (fovy: number, asp: number, n: number, f: number) => {
  const t = 1 / Math.tan(fovy / 2);
  return new Float32Array([t / asp, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) / (n - f), -1, 0, 0, (2 * f * n) / (n - f), 0]);
};

function viewMatrix(dist: number, pitch: number, yaw: number) {
  const cx = Math.cos(pitch), sx = Math.sin(pitch), cy = Math.cos(yaw), sy = Math.sin(yaw);
  // translate(0,0,-dist) · rotX(pitch) · rotY(yaw), column-major
  return new Float32Array([cy, sx * sy, -cx * sy, 0, 0, cx, sx, 0, sy, -sx * cy, cx * cy, 0, 0, 0, -dist, 1]);
}

export interface ParticleEngine {
  readonly count: number;
  resize: () => void;
  render: (p: FrameParams) => void;
  destroy: () => void;
}

export function createParticleEngine(canvas: HTMLCanvasElement, count: number): ParticleEngine | null {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
    return s;
  };
  let prog: WebGLProgram;
  try {
    prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  } catch {
    return null;
  }

  const u: Record<string, WebGLUniformLocation | null> = {};
  const n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS) as number;
  for (let i = 0; i < n; i++) {
    const name = gl.getActiveUniform(prog, i)!.name;
    u[name] = gl.getUniformLocation(prog, name);
  }

  const { data, rows } = buildForms(count);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, TEX_WIDTH, rows * FORM_COUNT, 0, gl.RGBA, gl.FLOAT, data);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  const vao = gl.createVertexArray();

  const dpr = () => Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.5 : 1.75);

  const resize = () => {
    const r = dpr();
    const w = Math.max(1, Math.round(canvas.clientWidth * r));
    const h = Math.max(1, Math.round(canvas.clientHeight * r));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  };

  const render = (p: FrameParams) => {
    const aspect = canvas.width / canvas.height;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(prog);
    gl.bindVertexArray(vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(u.uTex, 0);
    gl.uniform1i(u.uRows, rows);
    gl.uniform1i(u.uA, p.a);
    gl.uniform1i(u.uB, p.b);
    gl.uniform1f(u.uBlobA, BLOB[p.a]);
    gl.uniform1f(u.uBlobB, BLOB[p.b]);
    gl.uniform1f(u.uMix, p.mix);
    gl.uniform1f(u.uTime, p.time);
    gl.uniform1f(u.uMotion, p.motion);
    gl.uniformMatrix4fv(u.uProj, false, persp((40 * Math.PI) / 180, aspect, 0.1, 50));
    gl.uniformMatrix4fv(u.uView, false, viewMatrix(p.distance, p.pitch, p.yaw));
    gl.uniform3f(u.uOffA, ...p.offA);
    gl.uniform3f(u.uOffB, ...p.offB);
    gl.uniform1f(u.uArc, p.arc);
    gl.uniform1f(u.uScale, p.scale);
    gl.uniform1f(u.uIntro, p.intro);
    gl.uniform1i(u.uCloud, FORM.cloud);
    gl.uniform2f(u.uMouse, p.mouse.x, p.mouse.y);
    gl.uniform1f(u.uMouseOn, p.mouse.on);
    gl.uniform1f(u.uSize, p.size * (canvas.height / 900));
    gl.uniform1f(u.uAspect, aspect);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.drawArrays(gl.POINTS, 0, count);
  };

  const destroy = () => {
    gl.deleteTexture(tex);
    gl.deleteVertexArray(vao);
    gl.deleteProgram(prog);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };

  resize();
  return { count, resize, render, destroy };
}
