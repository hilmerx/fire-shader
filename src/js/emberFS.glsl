precision highp float;

uniform sampler2D texture1;
varying vec2 segment;
varying float lifeProgress;
varying float off;
varying float rVar;
varying float rVarInt;

void main() {
    if ( off == 1.0 ) discard;

    vec4 tex = texture2D(texture1, gl_PointCoord);
    if ( tex.a < 0.5 ) discard;

    gl_FragColor = vec4(tex.r - lifeProgress, tex.g - lifeProgress, tex.b - lifeProgress, tex.a - lifeProgress );

    // float r = tex.r - (rVarInt * (1.0 - lifeProgress) * 5.0) - lifeProgress;
    // float g = tex.g - lifeProgress;
    // float b = tex.b + (rVarInt * (1.0 - lifeProgress) * 5.0) - lifeProgress;
    // float a = tex.a - lifeProgress;

    // gl_FragColor = vec4(r, g, b, a);
}

