#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURFACE_DIST 0.01


vec3 palette(in float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
//    vec3 b = vec3(0.5, 0.5, 0.5);
//    vec3 c = vec3(1.0, 1.0, 1.0);
//    vec3 d = vec3(0.263, 0.416, 0.557);
    
   // vec3 a = vec3(0.218, 0.750, 0.750);
    vec3 b = vec3(-1.268, 0.546, 0.546);
    vec3 c = vec3(-1.663, -1.338, -1.703);
    vec3 d = vec3(-0.063, 1.412, 1.745);
    
    return a + b*cos( 6.28318*(c*t+d) );
}

float GetDist(vec3 p) {
    vec4 sphere = vec4(0, 1, 6, 1);
    
    float sphereDistance = length(p - sphere.xyz) - sphere.w;
    float planeDistance = p.y;
    
    float d = min(sphereDistance, planeDistance);
    
    return d;
}


float RayMarch(vec3 ro, vec3 rd) {
    float dO = 0.0;

    for(int i=0; i < MAX_STEPS; i++){
        vec3 p = ro + dO * rd;
        
        float dS = GetDist(p);
        
        dO += dS;
        
        if (dO > MAX_DIST || dS < SURFACE_DIST) {
            break;
        }

    }

    return dO;
}


vec3 GetNormal(vec3 p) {
    float d = GetDist(p);
    vec2 e = vec2(.01, 0); // swizzle

    vec3 n = d - vec3(
        GetDist(p - e.xyy),
        GetDist(p - e.yxy),
        GetDist(p - e.yyx)
        );

    return normalize(n);
}

float GetLight (vec3 p) {
    vec3 lightPos = vec3(0, 5, 6);
    lightPos.xz += vec2(sin(iTime), cos(iTime)) * 2.;
    vec3 l = normalize(lightPos - p);
    vec3 n = GetNormal(p);
    
    float dif = clamp(dot(n, l), 0., 1.);
    
    float d = RayMarch(p + n * SURFACE_DIST * 2., l);
    
    if(d < length(lightPos - p)) {
        dif *= .1;
    }
    
    return dif;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - .5 * iResolution.xy)/iResolution.y;

    vec3 col = vec3(0);

    vec3 ro = vec3(0, 1, 0);
    vec3 rd = normalize(vec3(uv.x, uv.y, 1));
    
    float d = RayMarch(ro, rd);
    
    vec3 p = ro + rd * d;
    
    float difuse = GetLight(p);
    
    
    col = vec3(difuse);    
    
    fragColor = vec4(col,1.0);
}

