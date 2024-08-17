debug=1,W={t:{},reset:s=>{W.canvas=s,W.objs=0,W.current={},W.next={},W.textures={},W.gl=s.getContext("webgl2"),W.gl.blendFunc(770,771),W.gl.activeTexture(33984),W.program=W.gl.createProgram(),W.gl.enable(2884),W.gl.shaderSource(t=W.gl.createShader(35633),"#version 300 es\nprecision highp float;in vec4 pos, col, uv, normal;uniform mat4 pv, eye, m, im;uniform vec4 bb;out vec4 v_pos, v_col, v_uv, v_normal;void main() {gl_Position = pv * (v_pos = bb.z > 0.? m[3] + eye * (pos * bb): m * pos);v_col = col;v_uv = uv;v_normal = transpose(inverse(m)) * normal;}"),W.gl.compileShader(t),W.gl.attachShader(W.program,t),console.log("vertex shader:",W.gl.getShaderInfoLog(t)||"OK"),W.gl.shaderSource(t=W.gl.createShader(35632),"#version 300 es\nprecision highp float;in vec4 v_pos, v_col, v_uv, v_normal;uniform vec3 light;uniform vec4 o;uniform sampler2D sampler;out vec4 c;void main() {c = mix(texture(sampler, v_uv.xy), v_col, o[3]);if(o[1] > 0.) {c = vec4(c.rgb * (max(0., dot(light, -normalize(o[0] > 0.? vec3(v_normal.xyz): cross(dFdx(v_pos.xyz), dFdy(v_pos.xyz)))))+ o[2]),c.a);}}"),W.gl.compileShader(t),W.gl.attachShader(W.program,t),console.log("fragment shader:",W.gl.getShaderInfoLog(t)||"OK"),W.gl.linkProgram(W.program),W.gl.useProgram(W.program),console.log("program:",W.gl.getProgramInfoLog(W.program)||"OK"),W.gl.clearColor(1,1,1,1),W.clearColor=t=>W.gl.clearColor(...W.i(t)),W.clearColor("fff"),W.gl.enable(2929),W.W({y:-1}),W.camera({fov:30}),setTimeout(W.draw,16)},o:(t,s,e,i,o=[],r,h,n,a,c,d,l,u)=>{if(t.n||="o"+W.objs++,t.size&&(t.w=t.h=t.d=t.size),t.l&&t.l.width&&!W.textures[t.l.id]&&(e=W.gl.createTexture(),W.gl.pixelStorei(37441,!0),W.gl.bindTexture(3553,e),W.gl.pixelStorei(37440,1),W.gl.texImage2D(3553,0,6408,6408,5121,t.l),W.gl.generateMipmap(3553),W.textures[t.l.id]=e),t.fov){const s=1/Math.tan(t.fov*Math.PI/180),e=.1,i=1e3,o=i-e;W.projection=new DOMMatrix([s/(W.canvas.width/W.canvas.height),0,0,0,0,s,0,0,0,0,-(i+e)/o,-1,0,0,-2*i*e/o,0])}t={type:s,...W.current[t.n]=W.next[t.n]||{w:1,h:1,d:1,x:0,y:0,z:0,rx:0,ry:0,rz:0,b:"888",mode:4,mix:0},...t,f:0},W.t[t.type]?.vertices&&!W.t?.[t.type].verticesBuffer&&(W.gl.bindBuffer(34962,W.t[t.type].verticesBuffer=W.gl.createBuffer()),W.gl.bufferData(34962,new Float32Array(W.t[t.type].vertices),35044),W.t[t.type].u||W.smooth(t),W.t[t.type].u&&(W.gl.bindBuffer(34962,W.t[t.type].normalsBuffer=W.gl.createBuffer()),W.gl.bufferData(34962,new Float32Array(W.t[t.type].u.flat()),35044))),W.t[t.type]?.uv&&!W.t[t.type].uvBuffer&&(W.gl.bindBuffer(34962,W.t[t.type].uvBuffer=W.gl.createBuffer()),W.gl.bufferData(34962,new Float32Array(W.t[t.type].uv),35044)),W.t[t.type]?.indices&&!W.t[t.type].indicesBuffer&&(W.gl.bindBuffer(34963,W.t[t.type].indicesBuffer=W.gl.createBuffer()),W.gl.bufferData(34963,new Uint16Array(W.t[t.type].indices),35044)),t.l?t.l&&!t.mix&&(t.mix=0):t.mix=1,W.next[t.n]=t},draw:(t,s,e,i,o=[])=>{for(i in s=t-W.lastFrame,W.lastFrame=t,requestAnimationFrame(W.draw),W.next.camera.g&&W.m(W.next[W.next.camera.g],s,1),e=W.animation("camera"),W.next?.camera?.g&&e.preMultiplySelf(W.next[W.next.camera.g].M||W.next[W.next.camera.g].v),W.gl.uniformMatrix4fv(W.gl.getUniformLocation(W.program,"eye"),!1,e.toFloat32Array()),e.invertSelf(),e.preMultiplySelf(W.projection),W.gl.uniformMatrix4fv(W.gl.getUniformLocation(W.program,"pv"),!1,e.toFloat32Array()),W.gl.clear(16640),W.next){const t=W.next[i];t.l||1!=W.i(t.b)[3]?o.push(t):W.m(t,s)}for(i of(o.sort(((t,s)=>W.p(s)-W.p(t))),W.gl.enable(3042),o))["plane","billboard"].includes(i.type)&&W.gl.depthMask(0),W.m(i,s),W.gl.depthMask(1);W.gl.disable(3042),W.gl.uniform3f(W.gl.getUniformLocation(W.program,"light"),W._("light","x"),W._("light","y"),W._("light","z")),W.onDraw(t)},m:(t,s,e=["camera","light","group"].includes(t.type),i)=>{t.l&&(W.gl.bindTexture(3553,W.textures[t.l.id]),W.gl.uniform1i(W.gl.getUniformLocation(W.program,"sampler"),0)),t.f<t.a&&(t.f+=s),t.f>t.a&&(t.f=t.a),W.next[t.n].v=W.animation(t.n),W.next[t.g]&&W.next[t.n].v.preMultiplySelf(W.next[t.g].M||W.next[t.g].v),W.gl.uniformMatrix4fv(W.gl.getUniformLocation(W.program,"m"),!1,(W.next[t.n].M||W.next[t.n].v).toFloat32Array()),W.gl.uniformMatrix4fv(W.gl.getUniformLocation(W.program,"im"),!1,new DOMMatrix(W.next[t.n].M||W.next[t.n].v).invertSelf().toFloat32Array()),e||(W.gl.bindBuffer(34962,W.t[t.type].verticesBuffer),W.gl.vertexAttribPointer(i=W.gl.getAttribLocation(W.program,"pos"),3,5126,!1,0,0),W.gl.enableVertexAttribArray(i),W.t[t.type].uvBuffer&&(W.gl.bindBuffer(34962,W.t[t.type].uvBuffer),W.gl.vertexAttribPointer(i=W.gl.getAttribLocation(W.program,"uv"),2,5126,!1,0,0),W.gl.enableVertexAttribArray(i)),(t.s||W.t[t.type].customNormals)&&W.t[t.type].normalsBuffer&&(W.gl.bindBuffer(34962,W.t[t.type].normalsBuffer),W.gl.vertexAttribPointer(i=W.gl.getAttribLocation(W.program,"normal"),3,5126,!1,0,0),W.gl.enableVertexAttribArray(i)),W.gl.uniform4f(W.gl.getUniformLocation(W.program,"o"),t.s,(t.mode>3||W.gl[t.mode]>3)&&!t.A?1:0,W.ambientLight||.2,t.mix),W.gl.uniform4f(W.gl.getUniformLocation(W.program,"bb"),t.w,t.h,"billboard"==t.type,0),W.t[t.type].indicesBuffer&&W.gl.bindBuffer(34963,W.t[t.type].indicesBuffer),W.gl.vertexAttrib4fv(W.gl.getAttribLocation(W.program,"col"),W.i(t.b)),W.t[t.type].indicesBuffer?W.gl.drawElements(+t.mode||W.gl[t.mode],W.t[t.type].indices.length,5123,0):W.gl.drawArrays(+t.mode||W.gl[t.mode],0,W.t[t.type].vertices.length/3))},_:(t,s)=>{const e=W.next[t];if(!e?.a)return e[s];const i=W.current[t];return i[s]+(e[s]-i[s])*(e.f/e.a)},animation:(t,s=new DOMMatrix)=>W.next[t]?s.translateSelf(W._(t,"x"),W._(t,"y"),W._(t,"z")).rotateSelf(W._(t,"rx"),W._(t,"ry"),W._(t,"rz")).scaleSelf(W._(t,"w"),W._(t,"h"),W._(t,"d")):s,p:(t,s=W.next.camera)=>t?.v&&s?.v?(s.v.m41-t.v.m41)**2+(s.v.m42-t.v.m42)**2+(s.v.m43-t.v.m43)**2:0,M:t=>W.ambientLight=t,i:t=>[...t.match(t.length<5?/./g:/../g).map((s=>("0x"+s)/(t.length<5?15:255))),1],add:(t,s)=>{W.t[t]=s,s.u&&(W.t[t].customNormals=1),W[t]=s=>W.o(s,t)},group:t=>W.o(t,"group"),move:(t,s)=>setTimeout((()=>{W.o(t)}),s||1),delete:(t,s)=>setTimeout((()=>{delete W.next[t]}),s||1),camera:(t,s)=>setTimeout((()=>{W.o(t,t.n="camera")}),s||1),W:(t,s)=>s?setTimeout((()=>{W.o(t,t.n="light")}),s):W.o(t,t.n="light")},W.smooth=(t,s={},e=[],i,o,r,h,n,a,c,d,l,u,m)=>{for(W.t[t.type].u=[],r=0;r<W.t[t.type].vertices.length;r+=3)e.push(W.t[t.type].vertices.slice(r,r+3));for((i=W.t[t.type].indices)?o=1:(i=e,o=0),r=0;r<2*i.length;r+=3){h=r%i.length,n=e[d=o?W.t[t.type].indices[h]:h],a=e[l=o?W.t[t.type].indices[h+1]:h+1],c=e[u=o?W.t[t.type].indices[h+2]:h+2],AB=[a[0]-n[0],a[1]-n[1],a[2]-n[2]],BC=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],m=r>h?[0,0,0]:[AB[1]*BC[2]-AB[2]*BC[1],AB[2]*BC[0]-AB[0]*BC[2],AB[0]*BC[1]-AB[1]*BC[0]];const v=n[0]+"_"+n[1]+"_"+n[2],p=a[0]+"_"+a[1]+"_"+a[2],f=c[0]+"_"+c[1]+"_"+c[2];s[v]||=[0,0,0],s[p]||=[0,0,0],s[f]||=[0,0,0],W.t[t.type].u[d]=s[v]=s[v].map(((t,s)=>t+m[s])),W.t[t.type].u[l]=s[p]=s[p].map(((t,s)=>t+m[s])),W.t[t.type].u[u]=s[f]=s[f].map(((t,s)=>t+m[s]))}},W.add("plane",{vertices:[.5,.5,0,-.5,.5,0,-.5,-.5,0,.5,.5,0,-.5,-.5,0,.5,-.5,0],uv:[1,1,0,1,0,0,1,1,0,0,1,0]}),W.add("billboard",W.t.plane),W.add("cube",{vertices:[.5,.5,.5,-.5,.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,-.5,.5,.5,-.5,.5,.5,.5,-.5,.5,.5,.5,.5,-.5,.5,.5,.5,-.5,.5,-.5,.5,.5,-.5,-.5,.5,.5,-.5,-.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,-.5,.5,.5,.5,.5,.5,-.5,.5,.5,-.5,.5,-.5,-.5,-.5,-.5,-.5,.5,.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,.5,-.5,.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,-.5],uv:[1,1,0,1,0,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1,0,0,1,0]}),W.cube=t=>W.o(t,"cube"),W.add("pyramid",{vertices:[-.5,-.5,.5,.5,-.5,.5,0,.5,0,.5,-.5,.5,.5,-.5,-.5,0,.5,0,.5,-.5,-.5,-.5,-.5,-.5,0,.5,0,-.5,-.5,-.5,-.5,-.5,.5,0,.5,0,.5,-.5,.5,-.5,-.5,.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,-.5],uv:[0,0,1,0,.5,1,0,0,1,0,.5,1,0,0,1,0,.5,1,0,0,1,0,.5,1,1,1,0,1,0,0,1,1,0,0,1,0]}),((t,s,e,i,o,r,h=[],n=[],a=[],c=20)=>{for(e=0;e<=c;e++)for(i=e*Math.PI/c,t=0;t<=c;t++)s=2*t*Math.PI/c,h.push(+(Math.sin(s)*Math.sin(i)/2).toFixed(6),+(Math.cos(i)/2).toFixed(6),+(Math.cos(s)*Math.sin(i)/2).toFixed(6)),a.push(3.5*Math.sin(t/c),-Math.sin(e/c)),t<c&&e<c&&n.push(o=e*(c+1)+t,r=o+c+1,o+1,o+1,r,r+1);W.add("sphere",{vertices:h,uv:a,indices:n})})();let s=new AudioContext;"use strict";const e={T:"Arial, sans-serif",K:'"Times New Roman", serif',C:'"Courier New", monospace',O:60,init(){e.S.init(),e.B.init()},D(){const t=localStorage.getItem("2024_sd_elevator.save");return t?JSON.parse(t):null},N(t){localStorage.setItem("2024_sd_elevator.save",JSON.stringify({level:t}))}};window.addEventListener("load",(()=>e.init())),e.Audio={play(t){((t=1,e=.05,i=220,W=0,o=0,r=.1,h=0,n=1,a=0,c=0,d=0,l=0,u=0,m=0,v=0,p=0,f=0,g=1,y=0,_=0,b=0)=>{let w=Math,x=2*w.PI,A=44100,M=a*=500*x/A/A,T=i*=(1-e+2*e*w.random(e=[]))*x/A,E=0,K=0,C=0,O=1,z=0,S=0,B=0,D=b<0?-1:1,N=x*D*b*2/A,F=w.cos(N),k=w.sin,P=k(N)/4,R=1+P,G=-2*F/R,L=(1-P)/R,U=(1+D*F)/2/R,I=-(D+F)/R,J=U,q=0,H=0,Q=0,V=0;for(c*=500*x/A**3,v*=x/A,d*=x/A,l*=A,u=A*u|0,t*=.3,D=(W=A*W+9)+(y*=A)+(o*=A)+(r*=A)+(f*=A)|0;C<D;e[C++]=B*t)++S%(100*p|0)||(B=h?1<h?2<h?3<h?k(E**3):w.max(w.min(w.tan(E),1),-1):1-(2*E/x%2+2)%2:1-4*w.abs(w.round(E/x)-E/x):k(E),B=(u?1-_+_*k(x*C/u):1)*(B<0?-1:1)*w.abs(B)**n*(C<W?C/W:C<W+y?1-(C-W)/y*(1-g):C<W+y+o?g:C<D-f?(D-C-f)/r*g:0),B=f?B/2+(f>C?0:(C<D-f?1:(D-C)/f)*e[C-f|0]/2/t):B,b&&(B=V=J*q+I*(q=H)+U*(H=B)-L*Q-G*(Q=V))),N=(i+=a+=c)*w.cos(v*K++),E+=N+N*m*k(C**5),O&&++O>l&&(i+=d,T+=d,O=0),!u||++z%u||(i=T,a=M,O=O||1);(t=s.createBuffer(1,D,A)).getChannelData(0).set(e),(i=s.createBufferSource()).buffer=t,i.connect(s.destination),i.start()})(...t)}},e.S={F:{k:1,P:2,R:3,G:4,L:5,U:6,I:10,J:11,q:12,H:13,V:14,X:15},Y:{},Z:{},j:{gp_connect:[],gp_disconnect:[]},$:{},tt:{},st:{},et:{},it:0,camera:{rx:0,ry:0},Wt(){this.ot={[this.F.k]:{keyboard:["Escape"],gamepad:[9]},[this.F.J]:{keyboard:["ArrowUp","KeyW","KeyZ","KeyY"],gamepad:[12]},[this.F.I]:{keyboard:["ArrowLeft","KeyA","KeyQ"],gamepad:[14]},[this.F.H]:{keyboard:["ArrowDown","KeyS"],gamepad:[13]},[this.F.q]:{keyboard:["ArrowRight","KeyD"],gamepad:[15]},[this.F.G]:{keyboard:["Space","Enter"],gamepad:[0,2]},[this.F.U]:{keyboard:["ShiftLeft","ShiftRight"],gamepad:[4,5]},[this.F.P]:{keyboard:["Space","Enter"],gamepad:[0,2]},[this.F.L]:{keyboard:["KeyE","CtrlLeft"],gamepad:[1,3]}}},rt(){let t=0,s=0;if(this.ht(this.F.I)?t=-1:this.ht(this.F.q)&&(t=1),this.ht(this.F.J)?s=-1:this.ht(this.F.H)&&(s=1),!t||!s){const e=.3;for(const i in this.st){const W=this.st[i];W.axes[0]&&Math.abs(W.axes[0])>e?t=W.axes[0]>0?1:-1:W.axes[2]&&Math.abs(W.axes[2])>e&&(t=W.axes[2]>0?1:-1),W.axes[1]&&Math.abs(W.axes[1])>e?s=W.axes[1]>0?1:-1:W.axes[3]&&Math.abs(W.axes[3])>e&&(s=W.axes[3]>0?1:-1)}}return{x:t,y:s}},nt(t){return this.ot[t]},init(){this.Wt(),this.ct()},ht(t,s){const e=this.nt(t);for(const t of e.keyboard)if(this.dt(t,s))return!0;for(const t of e.gamepad)if(this.lt(t,s))return!0;if(t==this.F.I)for(const t in this.st){const e=this.st[t];if(e.axes[6]&&e.axes[6]<=-.2)return!this.Z["axis6-"]&&(s&&(this.Z["axis6-"]=!0),!0)}else if(t==this.F.q)for(const t in this.st){const e=this.st[t];if(e.axes[6]&&e.axes[6]>=.2)return!this.Z["axis6+"]&&(s&&(this.Z["axis6+"]=!0),!0)}else if(t==this.F.J)for(const t in this.st){const e=this.st[t];if(e.axes[7]&&e.axes[7]<=-.2)return!this.Z["axis7-"]&&(s&&(this.Z["axis7-"]=!0),!0)}else if(t==this.F.H)for(const t in this.st){const e=this.st[t];if(e.axes[7]&&e.axes[7]>=.2)return!this.Z["axis7+"]&&(s&&(this.Z["axis7+"]=!0),!0)}return!1},lt(t,s){for(const e in this.st){const i=this.st[e].buttons[t];if(i&&i.pressed)return!this.Z[t]&&(s&&(this.Z[t]=!0),!0)}return!1},dt(t,s){const e=this.et[t];return!(!e||!e.time)&&(s&&(e.time=0,e.ut=!0),!0)},on(t,s){this.j[t].push(s)},vt(t,s){const e=this.$[t]||[];e.push(s),this.$[t]=e},ft(t,s){const e=this.tt[t]||[];e.push(s),this.tt[t]=e},ct(){let t=!1,s=0,e=0;document.body.onmousedown=i=>{t=!0,s=i.clientX,e=i.clientY},document.body.onmouseup=s=>{t=!1},document.body.onmousemove=i=>{t&&(this.camera.rx-=.5*(i.clientY-e),this.camera.ry-=.5*(i.clientX-s),this.camera.rx=this.camera.rx%360,this.camera.ry=this.camera.ry%360,W.camera(this.camera),e=i.clientY,s=i.clientX)},document.body.onkeydown=t=>{const s=this.et[t.code];s&&s.ut||(this.et[t.code]={time:Date.now()},this.$[t.code]&&this.$[t.code].forEach((t=>t())))},document.body.onkeyup=t=>{this.et[t.code]={time:0},this.tt[t.code]&&this.tt[t.code].forEach((t=>t()))},window.addEventListener("gamepadconnected",(t=>{this.it++,this.st[t.gamepad.index]=t.gamepad,this.j.gp_connect.forEach((t=>t()))})),window.addEventListener("gamepaddisconnected",(t=>{this.it--,delete this.st[t.gamepad.index],this.j.gp_disconnect.forEach((t=>t()))}))},update(){const t=navigator.getGamepads();for(const s of t)if(s){this.st[s.index]=s;for(const t in this.Z)"axis6-"==t||"axis6+"==t?s.axes[6]||delete this.Z[t]:"axis7-"==t||"axis7+"==t?s.axes[7]||delete this.Z[t]:s.buttons[t]&&!s.buttons[t].pressed&&delete this.Z[t]}}},e.B={gt:0,yt(){},_t(t,s){const e=document.createElement("canvas");e.width=t,e.height=s;const i=e.getContext("2d",{alpha:!0});return i.imageSmoothingEnabled=!1,[e,i]},init(){this.bt=document.getElementById("c"),this.wt=document.getElementById("ui"),this.xt=this.wt.getContext("2d",{alpha:!0}),this.xt.imageSmoothingEnabled=!1,this.resize(),this.At((()=>{W.onDraw=this.update.bind(this),W.reset(this.bt),W.clearColor("000"),W.M(.4),this.ct(),this.level=new e.Mt}))},At(t){t()},update(t=0){if(e.S.update(),t&&this.Tt){const s=(t-this.Tt)/(1e3/e.O);if(this.xt.imageSmoothingEnabled=!1,this.Et)return void this.yt();this.gt+=s,this.level.update(s),this.level.m()}this.Tt=t},pause(){this.Et=!0},ct(){window.addEventListener("resize",(t=>this.resize()));const t=e.S.nt(e.S.F.k);setInterval((()=>{this.Et&&e.S.update(),t.gamepad.forEach((t=>{e.S.lt(t,!0)&&this.Kt()}))}),100);const s=()=>this.Kt();t.keyboard.forEach((t=>e.S.ft(t,s))),e.S.on("gp_disconnect",(()=>this.pause()))},resize(){this.bt.width=1200,this.bt.height=900,this.wt.width=1200,this.wt.height=900},Kt(){this.Et?this.unpause():this.pause()},unpause(){this.Et=!1}},e.Mt=class{constructor(){this.gt=0,W.group({n:"ev"}),W.plane({g:"ev",x:0,y:-2,z:0,w:2,h:2,rx:-90,b:"aaa"}),W.plane({g:"ev",x:-1,y:0,z:0,ry:90,w:2,h:4,b:"ddd"}),W.plane({g:"ev",x:1,y:0,z:0,ry:-90,w:2,h:4,b:"ddd"}),W.plane({g:"ev",x:0,y:0,z:1,ry:180,w:2,h:4,b:"f00"})}m(){}update(t){this.gt+=t}},e.Ct=class{constructor(t,s=0){this.level=t,this.set(s)}Ot(){return this.level.gt>this.timeEnd}zt(){return Math.min(1,1-(this.timeEnd-this.level.gt)/this.duration)}set(t){this.duration=t*e.O,this.timeEnd=this.level.gt+this.duration}},e.St=class{constructor(t=0,s=0){this.x=t,this.y=s}clone(){return new e.St(this.x,this.y)}length(){return this.x+this.y==0?0:Math.sqrt(this.x*this.x+this.y*this.y)}mul(t){return this.x*=t,this.y*=t,this}normalize(){const t=this.length();return t&&(this.x/=t,this.y/=t),this}set(t,s){this.x=t,this.y=s}sub(t){return this.x-=t.x,this.y-=t.y,this}};