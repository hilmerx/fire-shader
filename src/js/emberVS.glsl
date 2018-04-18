#define USE_MAP true

precision highp float;

uniform float time;
uniform float size;
uniform float maxOffset;
uniform float amount;
uniform float width;
uniform float uTwist;

varying float currentHeight;
varying float currentTime;
varying float lifeProgress;
varying float off;
varying float rVar;
varying float rVarInt;

attribute vec3 offset;
attribute float timeOffset;
attribute float speed;
attribute float onThreshold;
attribute float height;
attribute float r;
attribute float rInterpolated;

vec4 DoTwist( vec4 pos, float t ) 
    {
        float st = sin(t);
        float ct = cos(t);
        vec4 new_pos;

        new_pos.x = pos.x*ct - pos.z*st;
        new_pos.z = pos.x*st + pos.z*ct;

        new_pos.y = pos.y;
        new_pos.w = pos.w;

        return( new_pos );
    }


void main() {

    off = 0.0;
    rVar = r;
    rVarInt = rInterpolated;

    currentTime = mod(time, timeOffset);
    lifeProgress = currentTime / timeOffset;
    currentHeight = height * lifeProgress * speed;

    float xCurve = sin((lifeProgress * rInterpolated * 80.0) - (onThreshold * 10.0) );
    float zCurve = cos((lifeProgress * rInterpolated * 80.0) - (onThreshold * 10.0) );

    vec3 newPos = vec3(offset.x + xCurve, offset.y + currentHeight, offset.z + zCurve);

    float angle_rad = uTwist * 3.14159 / 180.0;
    float height = -300.0;
    float ang = (position.y-height*0.5)/height * angle_rad;

    // vec4 twistedPosition = DoTwist(mPosition, ang);

    vec4 mvPosition = modelViewMatrix * vec4(position + newPos, 1.0);

    if (onThreshold > amount) {
        off = 1.0;
    }

    gl_Position = projectionMatrix * mvPosition;

    float distToCamera = 1.0 / (-mvPosition.z);
    gl_PointSize = size * distToCamera;
}




