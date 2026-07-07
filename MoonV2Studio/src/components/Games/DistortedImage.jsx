import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uHover;
  uniform float uTime;

  void main() {
    vec2 uv = vUv;
    
    // Glitch / displacement effect
    if (uHover > 0.0) {
      float noise = sin(uv.y * 20.0 + uTime * 10.0) * 0.02 * uHover;
      uv.x += noise;
      
      float rgbSplit = 0.01 * uHover;
      float r = texture2D(uTexture, uv + vec2(rgbSplit, 0.0)).r;
      float g = texture2D(uTexture, uv).g;
      float b = texture2D(uTexture, uv - vec2(rgbSplit, 0.0)).b;
      
      gl_FragColor = vec4(r, g, b, 1.0);
    } else {
      vec4 color = texture2D(uTexture, uv);
      // Grayscale filter
      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      // Mix grayscale to full color based on hover
      vec3 finalColor = mix(vec3(gray) * 0.8, color.rgb, uHover);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  }
`;

function Scene({ url, isHovered }) {
  const meshRef = useRef();
  const texture = useTexture(url);
  
  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uHover: { value: 0 },
    uTime: { value: 0 },
  }), [texture]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    // Lerp hover state
    uniforms.uHover.value += (isHovered ? 1 : 0 - uniforms.uHover.value) * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function DistortedImage({ url }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Scene url={url} isHovered={isHovered} />
      </Canvas>
    </div>
  );
}
