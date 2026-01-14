#pragma header

vec2 uv = openfl_TextureCoordv.xy;
vec2 fragCoord = openfl_TextureCoordv*openfl_TextureSize;
vec2 iResolution = openfl_TextureSize;

uniform float range;
uniform float steps;
uniform float threshhold;
uniform float brightness;

uniform float iTime;
#define iChannel0 bitmap
#define texture flixel_texture2D
#define fragColor gl_FragColor
#define mainImage main

void mainImage() {
  vec2 uv = fragCoord / iResolution.xy;
  fragColor = texture(iChannel0, uv);
    
  for (float i = -range; i < range; i += steps) {
    float falloff = 1.0 - abs(i / range);
    
    vec4 blur = texture(iChannel0, uv + i);
    if (blur.r + blur.g + blur.b > threshhold * 3.0) {
      fragColor += blur * falloff * steps * brightness;
    }
        
    blur = texture(iChannel0, uv + vec2(i, -i));
    if (blur.r + blur.g + blur.b > threshhold * 3.0) {
      fragColor += blur * falloff * steps * brightness;
    }
  }
}