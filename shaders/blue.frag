#pragma header

uniform float AMT;
uniform float SPEED;
uniform float iTime;
uniform float hue;
uniform float hueBlend;
uniform float pix;

float random2d(vec2 n){
    return fract(sin(dot(n,vec2(12.9898,4.1414)))*43758.5453);
}

float randomRange(in vec2 seed,in float min,in float max){
    return min+random2d(seed)*(max-min);
}

float insideRange(float v,float bottom,float top){
    return step(bottom,v)-step(top,v);
}

void main()
{
    vec2 pixelSize = openfl_TextureSize.xy / pix;
    vec2 uv = floor(openfl_TextureCoordv.xy * pixelSize) / pixelSize;

    float time=floor(iTime*SPEED);
    vec4 outCol=flixel_texture2D(bitmap,uv);
    
    float maxOffset=AMT/32.;
    for(float i=0.;i<10.*AMT;i+=.25){
        float sliceY=random2d(vec2(time,2345.+float(i)));
        float sliceH=random2d(vec2(time,925.+float(i)))*.075;
        float hOffset=randomRange(vec2(time,25.+float(i)),-maxOffset,maxOffset);
        vec2 uvOff=uv.xy;
        uvOff.x+=hOffset;
        if(insideRange(openfl_TextureCoordv.y,sliceY,fract(sliceY+sliceH))==1.){
            outCol=flixel_texture2D(bitmap,uvOff);
        }
    }

    float Cmax = max(outCol.x, max(outCol.y, outCol.z));
    float Cmin = min(outCol.x, min(outCol.y, outCol.z));
    float delta = Cmax - Cmin;
    
    float H = 0.;
    float S = 0.;
    float V = Cmax;
    
    if(delta == 0.){
        H = 0.;
    } else if(outCol.x >= outCol.y && outCol.x >= outCol.z){
        H = 60. * mod((outCol.y - outCol.z) / delta, 6.);
    } else if(outCol.y >= outCol.x && outCol.y >= outCol.z){
        H = 60. * ((outCol.z - outCol.x) / delta + 2.);
    } else if(outCol.z >= outCol.y && outCol.z >= outCol.x){
        H = 60. * ((outCol.x - outCol.y) / delta + 4.);
    }
    
    if(Cmax == 0.){
        S = 0.;
    } else {
        S = delta / Cmax;
    }
    
    H = hue / 2. * 360.;
        
    float C = V * S;
    float X = C * (1. - abs(mod(H / 60., 2.) - 1.));
    float m = V - C;
    
    vec3 rgbP = vec3(0.);
    
    if(0. <= H && H < 60.){
        rgbP = vec3(C, X, 0.);
    } else if(60. <= H && H < 120.){
        rgbP = vec3(X, C, 0.);
    } else if(120. <= H && H < 180.){
        rgbP = vec3(0., C, X);
    } else if(180. <= H && H < 240.){
        rgbP = vec3(0., X, C);
    } else if(240. <= H && H < 300.){
        rgbP = vec3(X, 0., C);
    } else {
        rgbP = vec3(C, 0., X);
    }

    vec3 hueShifted = vec3(rgbP.x + m, rgbP.y + m, rgbP.z + m);
    vec3 finalColor = mix(outCol.rgb, hueShifted, clamp(hueBlend, 0.0, 1.0));

    gl_FragColor = vec4(finalColor, outCol.a);

}