import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float uTime;
  
  // Simplex 3D Noise 
  // by Ian McEwan, Ashima Arts
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float snoise(vec3 v){ 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0 ); 
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 1.0/7.0; // N=7
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vNormal = normal;
    
    // Displace vertices along their normal using noise
    float noise = snoise(position * 2.0 + uTime * 0.5);
    vec3 displacedPosition = position + normal * (noise * 0.15);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float uTime;
  
  void main() {
    // Basic rim lighting effect
    float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
    
    // Core color (dark gray/black) with red glowing rim
    vec3 coreColor = vec3(0.05, 0.05, 0.05);
    vec3 glowColor = vec3(0.67, 0.23, 1.0); // var(--red)
    
    vec3 finalColor = mix(coreColor, glowColor, intensity * 1.5);
    
    // Add some pulsing to the glow
    float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
    finalColor += glowColor * pulse * 0.2;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export default function HeroSphere({ mouseX, mouseY }) {
  const meshRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      // Rotate slowly over time
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x += 0.001;
      
      // Update shader time
      uniforms.uTime.value = state.clock.elapsedTime;
      
      // Parallax react to mouse (smooth lerp)
      const targetX = (mouseX.current / window.innerWidth) * 0.5;
      const targetY = (mouseY.current / window.innerHeight) * 0.5;
      
      meshRef.current.rotation.y += (targetX - meshRef.current.rotation.y) * 0.05;
      meshRef.current.rotation.x += (targetY - meshRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 128, 128]} scale={1.8}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </Sphere>
  );
}
