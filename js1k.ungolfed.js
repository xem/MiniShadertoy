// GUI: canvas
a.style="width:49.5%;height:95vh";

// GUI: textarea with demo shader
b.innerHTML+=`<textarea id=c style=width:49.5%;height:95vh>void mainImage(out vec4 fragColor,in vec2 fragCoord){
  vec4 p=vec4((fragCoord.xy/iResolution.xy-.5)*2.,0,1);
  fragColor=p+sin(atan(p.y,p.x)*9.)*sin(p*iGlobalTime/2.+9./dot(p,p)+iGlobalTime*5.);
}`;

// Canvas methods hashing:
// This loop creates tiny shortcuts for all the webgl context's methods/constants we need:
// createProgram => cP
// shaderSource => sS
// createShader => cS
// compileShader => ce
// attachShader => aS
// linkProgram => lo
// useProgram => ug
// bindBuffer => bf
// createBuffer => cB
// enableVertexAttribArray => eV
// vertexAttribPointer => vA
// bufferData => bD
// getUniformLocation => gf
// drawArrays => dr
// NO_ERROR => NO (value = 0)
// FRAGMENT_SHADER => FN (value: 35632)
// ELEMENT_ARRAY_BUFFER_BINDING => ET (value: 34965)
// We need to redefine the webgl context because adding the textarea in the DOM rewrote the canvas "a".
for(i in g=a.getContext("webgl")){
  g[i[0]+i[6]]=g[i];
}
// Fill the textarea if the hash is set, decoded from base64
if(l=location.hash){
  c.value=atob(l.slice(1));
}
// Mouse coordinates
iMouse=[0,0,0,0];
// Use the WebGL context's scope for all the following code
with(g){
  
  // Onload / oninput
  (oninput=function(){
    
    // Update hash with shader code in base64
    location.hash=btoa(c.value);
    
    // Define a new program
    // p=createProgram();
    p=cP();
    
    // Basic vertex shader
    // shaderSource(s=createShader(VERTEX_SHADER),"attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}");
    sS(s=cS(35633),"attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}");
    
    // Compile and attach it to the program
    // compileShader(s);
    ce(s);
    
    //attachShader(p,s);
    aS(p,s);
    
    // Main program
    // shaderSource(s=createShader(FRAGMENT_SHADER),'precision mediump float;uniform float iGlobalTime,iFrame,iDate,iTimeDelta;varying lowp vec4 fragCoord;uniform vec2 iResolution;uniform vec4 iMouse;' +c.value+'void main(){mainImage(gl_FragColor,gl_FragCoord.xy);gl_FragColor.w=1.;}');
    sS(s=cS(FN),'precision mediump float;uniform float iGlobalTime,iFrame,iDate,iTimeDelta;varying lowp vec4 fragCoord;uniform vec2 iResolution;uniform vec4 iMouse;'+c.value+'void main(){mainImage(gl_FragColor,gl_FragCoord.xy);gl_FragColor.w=1.;}');
    
    // Compile and attach it to the program
    // compileShader(s);
    ce(s);
    
    // attachShader(p,s);
    aS(p,s);
    
    // Link and start the program
    //linkProgram(P);
    lo(p);
    
    //useProgram(p);
    ug(p);
    
    // Define a big triangle the canvas, containing the viewport
    // bindBuffer(g=ARRAY_BUFFER, createBuffer());
    bf(g=34962,cB());
    
    // enableVertexAttribArray(0);
    eV(0);
    
    // vertexAttribPointer(0, 2, BYTE, 0, 0, 0);
    vA(0,2,5120,0,0,0);
    
    // bufferData(g,new Int8Array([-3, 1, 1, -3, 1, 1]), STATIC_DRAW);
    bD(g,new Int8Array([-3,1,1,-3,1,1]),35044);
    
    // Reset frame counter
    iFrame=0;
    // Reset playback time (in seconds)
    o=0;
    
    // Date (in seconds)
    f=new Date()/1e3
    
    // Time delta (in seconds)
    d=0;
  })();
  
  // Main loop
  (L=function(){
    
    // Time delta since last frame (in seconds)
    d=(new Date()/1e3-f);
    // Date (in seconds)
    f=new Date()/1e3;
    
    // uniform1f(getUniformLocation(p, "iTimeDelta"), d);
    uniform1f(gf(p,"iTimeDelta"),d);
    
    // Current playback time (in seconds)
    // uniform1f(getUniformLocation(p,"iGlobalTime"), o += d);
    uniform1f(gf(p,"iGlobalTime"),o+=d);
    
    // Current playback frame
    // uniform1f(getUniformLocation(p,"iFrame"),iFrame++);  
    uniform1f(gf(p,"iFrame"),iFrame++);  
    
    // Date
    // uniform1f(getUniformLocation(p,"iDate"), ~~f);
    uniform1f(gf(p,"iDate"),~~f);
    
    // Mouse coordinates
    // uniform4f(getUniformLocation(p,"iMouse"),iMouse[0],iMouse[1],iMouse[2],iMouse[3]);
    uniform4f(gf(p,"iMouse"),iMouse[0],iMouse[1],iMouse[2],iMouse[3]);
    
    // Viewport resolution
    // uniform2f(getUniformLocation(p,"iResolution"),640,360);
    uniform2f(gf(p,"iResolution"), 640, 360);
    
    // Draw
    // drawArrays(TRIANGLE_FAN,0,3);
    dr(6,0,3);
    
    // Next frame
    requestAnimationFrame(L);
  })();
}

// Mouse input:
// y: mouse down (0 / 1)
y=0;

// z: canvas size (1: half / 2: full screen)
z=1;

// Toggle y on mouse down / up
onmousedown=onmouseup=function(e){y^=1}

// Update iMouse on mouse move / click, according to z.
a.onmousemove=function(e){if(y)iMouse[0]=e.pageX*0.495*z,iMouse[1]=e.pageY}
a.onclick=function(e){iMouse[2]=e.pageX*0.495*z,iMouse[3]=e.pageY}

// On double click, toggle canvas size
a.ondblclick=function(e){z=3-z;a.style.width=c.style.width=z*49.5+'%'}