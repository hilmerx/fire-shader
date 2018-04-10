#define USE_MAP true

uniform float size;
varying float distToCamera;
varying float height;

void main(){

    height = (position.y * 0.015);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    distToCamera = 1.0 / (-mvPosition.z);
    gl_PointSize = size * distToCamera;
}
