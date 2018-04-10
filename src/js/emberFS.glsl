uniform sampler2D texture1;
varying vec2 segment;
varying float height;

void main() {
    vec4 tex = texture2D(texture1, gl_PointCoord);
    gl_FragColor = vec4(tex.r - height, tex.g - height, tex.b - height, tex.a );
}

