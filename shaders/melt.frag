// Automatically converted with https://github.com/TheLeerName/ShadertoyToFlixel

#pragma header

#define iResolution vec3(openfl_TextureSize, 0.)
uniform float iTime;
#define iChannel0 bitmap
#define texture flixel_texture2D

// end of ShadertoyToFlixel header

void mainImage(out vec4 o, vec2 p)
{
	p /= iResolution.xy;
    p.y += .01 * iTime * fract(sin(dot(vec2(p.x), vec2(12.9, 78.2)))* 437.5);

    o = texture(iChannel0, p);
}

void main() {
	mainImage(gl_FragColor, openfl_TextureCoordv*openfl_TextureSize);
}