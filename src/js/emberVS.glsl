#define USE_MAP true
precision highp float;

uniform float time;
uniform float size;
uniform float maxOffset;
uniform float amount;
uniform float width;

varying float currentHeight;
varying float currentTime;
varying float lifeProgress;
varying float off;
varying float rVar;
varying float rInterpolated;

attribute vec3 offset;
attribute float timeOffset;
attribute float speed;
attribute float onThreshold;
attribute float height;
attribute float r;

void main(){
    off = 0.0;
    rVar = r;

    currentTime = mod(time, timeOffset);
    lifeProgress = currentTime / timeOffset;
    currentHeight = height * lifeProgress * speed;

    rInterpolated = r / width;
    float xCurve = sin((lifeProgress * rInterpolated * 80.0) - (onThreshold * 10.0) );
    float zCurve = cos((lifeProgress * rInterpolated * 80.0) - (onThreshold * 10.0) );

    vec3 newPos = vec3(offset.x + xCurve, offset.y + currentHeight, offset.z + zCurve);
 
    vec4 mvPosition = modelViewMatrix * vec4(position + newPos, 1.0);

    if (onThreshold > amount) {
        off = 1.0;
    }

    gl_Position = projectionMatrix * mvPosition;

    float distToCamera = 1.0 / (-mvPosition.z);
    gl_PointSize = size * distToCamera;
}
