import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

export const Hero3DCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Store mutable refs for animation loop and theme updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const materialsRef = useRef<{
    coreMaterial?: THREE.MeshPhysicalMaterial;
    orbitMaterial?: THREE.MeshStandardMaterial;
    nodeMaterial?: THREE.MeshStandardMaterial;
    lineMaterial?: THREE.LineBasicMaterial;
    dustMaterial?: THREE.PointsMaterial;
    keyLight?: THREE.DirectionalLight;
    fillLight?: THREE.DirectionalLight;
    ambientLight?: THREE.AmbientLight;
  }>({});

  const pointerRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    // Check prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    const motionListener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionListener);

    return () => motionQuery.removeEventListener('change', motionListener);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || reducedMotion) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const testCanvas = document.createElement('canvas');
        const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // 2. Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setHasWebGL(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    // Clear previous children and mount canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    // 3. Lighting Rig
    const ambientLight = new THREE.AmbientLight(
      resolvedTheme === 'dark' ? 0x0a192f : 0xe0f2fe,
      resolvedTheme === 'dark' ? 1.5 : 2.2
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(
      resolvedTheme === 'dark' ? 0x38bdf8 : 0x0284c7,
      resolvedTheme === 'dark' ? 2.5 : 3.0
    );
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(
      resolvedTheme === 'dark' ? 0x818cf8 : 0x3b82f6,
      resolvedTheme === 'dark' ? 1.8 : 1.5
    );
    fillLight.position.set(-4, -3, -3);
    scene.add(fillLight);

    // 4. Abstract Floating Geometry Group (Composite 3D Assembly)
    const clusterGroup = new THREE.Group();
    scene.add(clusterGroup);

    // Part A: Central faceted geometric core (Icosahedron with bevel wireframe)
    const coreGeometry = new THREE.IcosahedronGeometry(1.35, 1);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: resolvedTheme === 'dark' ? 0x0ea5e9 : 0x0284c7,
      metalness: 0.85,
      roughness: 0.18,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      wireframe: false,
      transparent: true,
      opacity: resolvedTheme === 'dark' ? 0.85 : 0.75,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    clusterGroup.add(coreMesh);

    // Inner wireframe lattice
    const wireframeGeometry = new THREE.IcosahedronGeometry(1.38, 1);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: resolvedTheme === 'dark' ? 0x38bdf8 : 0x0369a1,
      wireframe: true,
      transparent: true,
      opacity: resolvedTheme === 'dark' ? 0.4 : 0.25,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    clusterGroup.add(wireframeMesh);

    // Part B: Concentric Orbital Gimbal Rings
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.02, 16, 80);
    const orbitMaterial = new THREE.MeshStandardMaterial({
      color: resolvedTheme === 'dark' ? 0x38bdf8 : 0x0284c7,
      metalness: 0.9,
      roughness: 0.2,
      emissive: resolvedTheme === 'dark' ? 0x0369a1 : 0x0284c7,
      emissiveIntensity: resolvedTheme === 'dark' ? 0.35 : 0.1,
    });
    const ring1 = new THREE.Mesh(ring1Geo, orbitMaterial);
    ring1.rotation.x = Math.PI / 3;
    clusterGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.4, 0.018, 16, 80);
    const ring2 = new THREE.Mesh(ring2Geo, orbitMaterial);
    ring2.rotation.y = Math.PI / 4;
    clusterGroup.add(ring2);

    // Part C: Floating Constellation Nodes & Connecting Rays
    const nodeCount = 14;
    const nodeGeometry = new THREE.SphereGeometry(0.08, 12, 12);
    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: resolvedTheme === 'dark' ? 0x67e8f9 : 0x0284c7,
      metalness: 0.8,
      roughness: 0.2,
      emissive: resolvedTheme === 'dark' ? 0x38bdf8 : 0x0284c7,
      emissiveIntensity: resolvedTheme === 'dark' ? 0.7 : 0.2,
    });

    const nodes: THREE.Mesh[] = [];
    const nodePositions: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.0 + Math.random() * 1.0;

      const sinPhi = Math.sin(phi);
      const x = r * sinPhi * Math.cos(theta);
      const y = r * sinPhi * Math.sin(theta);
      const z = r * Math.cos(phi);

      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(x, y, z);
      clusterGroup.add(node);
      nodes.push(node);
      nodePositions.push(node.position);
    }

    // Connect pairs with lines
    const lineIndices: number[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 2.0) {
          lineIndices.push(i, j);
        }
      }
    }

    const linePoints: THREE.Vector3[] = [];
    for (let k = 0; k < lineIndices.length; k++) {
      linePoints.push(nodePositions[lineIndices[k]]);
    }

    const linesGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: resolvedTheme === 'dark' ? 0x38bdf8 : 0x0284c7,
      transparent: true,
      opacity: resolvedTheme === 'dark' ? 0.35 : 0.2,
    });
    const connectionLines = new THREE.LineSegments(linesGeometry, lineMaterial);
    clusterGroup.add(connectionLines);

    // Part D: Ambient Particle Dust
    const dustCount = 80;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 12;
      dustPositions[i + 1] = (Math.random() - 0.5) * 8;
      dustPositions[i + 2] = (Math.random() - 0.5) * 10;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      size: 0.04,
      color: resolvedTheme === 'dark' ? 0x38bdf8 : 0x0284c7,
      transparent: true,
      opacity: resolvedTheme === 'dark' ? 0.45 : 0.25,
    });
    const dustPoints = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustPoints);

    // Save references for theme updates
    materialsRef.current = {
      coreMaterial,
      orbitMaterial,
      nodeMaterial,
      lineMaterial,
      dustMaterial,
      keyLight,
      fillLight,
      ambientLight,
    };

    // 5. Pointer Interaction handlers
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const rect = container.getBoundingClientRect();
      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      pointerRef.current.targetX = normX * 0.7;
      pointerRef.current.targetY = normY * 0.7;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // 6. Resize handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 500;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 7. Animation Loop with smooth exponential damping
    let animId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Exponential damping on pointer target
      pointerRef.current.x = THREE.MathUtils.damp(pointerRef.current.x, pointerRef.current.targetX, 4.0, delta);
      pointerRef.current.y = THREE.MathUtils.damp(pointerRef.current.y, pointerRef.current.targetY, 4.0, delta);

      // Continuous subtle organic rotation
      const time = clock.getElapsedTime();
      clusterGroup.rotation.y = time * 0.15 + pointerRef.current.x * 0.8;
      clusterGroup.rotation.x = time * 0.08 + pointerRef.current.y * 0.6;

      ring1.rotation.z = time * 0.25;
      ring2.rotation.z = -time * 0.2;

      // Subtle pulse on nodes
      for (let i = 0; i < nodes.length; i++) {
        const scale = 1 + Math.sin(time * 2.5 + i) * 0.15;
        nodes[i].scale.set(scale, scale, scale);
      }

      // Slow drift on dust
      dustPoints.rotation.y = time * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      // Dispose Three.js resources
      coreGeometry.dispose();
      coreMaterial.dispose();
      wireframeGeometry.dispose();
      wireframeMaterial.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      orbitMaterial.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      linesGeometry.dispose();
      lineMaterial.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      renderer.dispose();

      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [reducedMotion]);

  // Update materials and lights reactively when theme changes
  useEffect(() => {
    const mats = materialsRef.current;
    if (!mats.coreMaterial) return;

    const isDark = resolvedTheme === 'dark';

    // Materials
    mats.coreMaterial.color.setHex(isDark ? 0x0ea5e9 : 0x0284c7);
    mats.coreMaterial.opacity = isDark ? 0.85 : 0.75;

    if (mats.orbitMaterial) {
      mats.orbitMaterial.color.setHex(isDark ? 0x38bdf8 : 0x0284c7);
      mats.orbitMaterial.emissive.setHex(isDark ? 0x0369a1 : 0x0284c7);
      mats.orbitMaterial.emissiveIntensity = isDark ? 0.35 : 0.1;
    }

    if (mats.nodeMaterial) {
      mats.nodeMaterial.color.setHex(isDark ? 0x67e8f9 : 0x0284c7);
      mats.nodeMaterial.emissive.setHex(isDark ? 0x38bdf8 : 0x0284c7);
      mats.nodeMaterial.emissiveIntensity = isDark ? 0.7 : 0.2;
    }

    if (mats.lineMaterial) {
      mats.lineMaterial.color.setHex(isDark ? 0x38bdf8 : 0x0284c7);
      mats.lineMaterial.opacity = isDark ? 0.35 : 0.2;
    }

    if (mats.dustMaterial) {
      mats.dustMaterial.color.setHex(isDark ? 0x38bdf8 : 0x0284c7);
      mats.dustMaterial.opacity = isDark ? 0.45 : 0.25;
    }

    // Lights
    if (mats.ambientLight) {
      mats.ambientLight.color.setHex(isDark ? 0x0a192f : 0xe0f2fe);
      mats.ambientLight.intensity = isDark ? 1.5 : 2.2;
    }

    if (mats.keyLight) {
      mats.keyLight.color.setHex(isDark ? 0x38bdf8 : 0x0284c7);
      mats.keyLight.intensity = isDark ? 2.5 : 3.0;
    }

    if (mats.fillLight) {
      mats.fillLight.color.setHex(isDark ? 0x818cf8 : 0x3b82f6);
      mats.fillLight.intensity = isDark ? 1.8 : 1.5;
    }
  }, [resolvedTheme]);

  // CSS Fallback if user prefers reduced motion or WebGL is unsupported
  if (reducedMotion || !hasWebGL) {
    return (
      <div className="relative w-full h-full flex items-center justify-center p-8 overflow-hidden select-none">
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          {/* Static geometric circles & rings */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/20 dark:border-cyan-400/20" />
          <div className="absolute inset-4 rounded-full border border-dashed border-cyan-500/30 dark:border-cyan-400/30" />
          <div className="absolute inset-12 rounded-full border border-sky-500/40 dark:border-sky-400/40" />
          <div className="w-28 h-28 rounded-2xl rotate-45 border-2 border-cyan-500 bg-gradient-to-tr from-cyan-500/20 to-blue-500/30 backdrop-blur-sm shadow-xl flex items-center justify-center">
            <div className="w-12 h-12 rounded-xl -rotate-45 border border-cyan-300 bg-cyan-400/30" />
          </div>
          {/* Subtle accent dots */}
          <div className="absolute top-4 left-1/4 w-3 h-3 rounded-full bg-cyan-400 shadow-md shadow-cyan-500/50" />
          <div className="absolute bottom-8 right-1/4 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-md shadow-blue-500/50" />
          <div className="absolute top-1/2 right-4 w-3.5 h-3.5 rounded-full bg-sky-400 shadow-md shadow-sky-500/50" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[420px] md:min-h-[520px] pointer-events-auto cursor-grab active:cursor-grabbing transition-opacity duration-700"
      aria-label="Interactive 3D Abstract Geometry Hero"
      role="img"
    />
  );
};
