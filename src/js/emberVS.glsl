#define USE_MAP true
precision highp float;

uniform float time;
uniform float size;
uniform float maxOffset;
uniform float amount;

varying float height;
varying float lifeProgress;
varying float off;
varying float rVar;

attribute vec3 offset;
attribute float timeOffset;
attribute float speed;
attribute float onThreshold;
attribute float r;

void main(){
    off = 0.0;
    rVar = r;
    height = mod(time, timeOffset) * r;

    lifeProgress = height / timeOffset;

    // float xCurve = 0.0;
    // float zCurve = 0.0;
    float xCurve = sin((lifeProgress*10.0)-(onThreshold*10.0));
    float zCurve = cos((lifeProgress*10.0)-(onThreshold*10.0));


    vec3 newPos = vec3(offset.x + xCurve, offset.y + height * speed, offset.z + zCurve);
 
    vec4 mvPosition = modelViewMatrix * vec4(position + newPos, 1.0);

    if (onThreshold > amount) {
        off = 1.0;
    }
    // mvPosition.y = mvPosition.y + time;
    gl_Position = projectionMatrix * mvPosition;

    float distToCamera = 1.0 / (-mvPosition.z);
    gl_PointSize = size * distToCamera;
}
