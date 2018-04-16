precision highp float;

uniform sampler2D texture1;
varying vec2 segment;
varying float lifeProgress;
varying float off;
varying float rVar;

void main() {
    vec4 tex = texture2D(texture1, gl_PointCoord);
    if ( tex.a < 0.5 ) discard;
    if ( off == 1.0 ) discard;
    gl_FragColor = vec4(tex.r - lifeProgress, tex.g - lifeProgress, tex.b - lifeProgress, tex.a - lifeProgress );
    // gl_FragColor = vec4(tex.r , tex.g , tex.b , tex.a );
}

