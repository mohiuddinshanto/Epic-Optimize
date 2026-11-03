import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { useLocale } from '../../context/LocaleContext';

export const DhakaGlobe3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const { t } = useLocale();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const l = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', l);
    return () => mq.removeEventListener('change', l);
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

    const scene = new THREE.Scene();
    const width = container.clientWidth || 280;
    const height = container.clientHeight || 280;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isSoftwareGl,
        powerPreference: 'low-power',
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    const isDark = resolvedTheme === 'dark';

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const radius = 1.4;

    // Base Wireframe / Dot Sphere
    const globeGeo = new THREE.SphereGeometry(radius, 24, 24);
    const globeMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x0284c7 : 0x0ea5e9,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.22 : 0.18,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // Inner translucent sphere core
    const coreGeo = new THREE.SphereGeometry(radius * 0.98, 20, 20);
    const coreMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x07090e : 0xf1f5f9,
      transparent: true,
      opacity: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // Latitude & Longitude helper rings
    const ringGeo = new THREE.RingGeometry(radius * 1.01, radius * 1.02, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x38bdf8 : 0x0284c7,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const equator = new THREE.Mesh(ringGeo, ringMat);
    equator.rotation.x = Math.PI / 2;
    globeGroup.add(equator);

    // Single Marker: DHAKA ONLY (23.8103° N, 90.4125° E)
    const lat = 23.8103;
    const lon = 90.4125;
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    // Marker Pin
    const markerGeo = new THREE.SphereGeometry(0.065, 12, 12);
    const markerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });
    const markerMesh = new THREE.Mesh(markerGeo, markerMat);
    markerMesh.position.set(x, y, z);
    globeGroup.add(markerMesh);

    // Pulsing Beacon Ring on Dhaka
    const beaconGeo = new THREE.RingGeometry(0.07, 0.12, 16);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    });
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    beaconMesh.position.set(x * 1.01, y * 1.01, z * 1.01);
    beaconMesh.lookAt(x * 2, y * 2, z * 2);
    globeGroup.add(beaconMesh);

    // Initial orientation: tilt toward Dhaka
    globeGroup.rotation.y = -Math.PI / 2;
    globeGroup.rotation.x = 0.2;

    // Drag interaction state
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let dragVelocity = { x: 0.005, y: 0 };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      globeGroup.rotation.y += deltaX * 0.008;
      globeGroup.rotation.x += deltaY * 0.008;

      dragVelocity = { x: deltaX * 0.008, y: deltaY * 0.008 };
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging) {
        // Slow continuous rotation with damped momentum
        dragVelocity.x = THREE.MathUtils.damp(dragVelocity.x, 0.004, 2.0, 0.016);
        dragVelocity.y = THREE.MathUtils.damp(dragVelocity.y, 0, 2.0, 0.016);
        globeGroup.rotation.y += dragVelocity.x;
        globeGroup.rotation.x += dragVelocity.y;
      }

      // Pulse beacon ring
      const time = clock.getElapsedTime();
      const scale = 1 + Math.sin(time * 3) * 0.3;
      beaconMesh.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onPointerDown);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);

      globeGeo.dispose();
      globeMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      markerGeo.dispose();
      markerMat.dispose();
      beaconGeo.dispose();
      beaconMat.dispose();
      renderer.dispose();

      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [reducedMotion, resolvedTheme]);

  if (reducedMotion) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center relative">
          <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500" />
          <span className="absolute -bottom-6 text-[11px] font-mono text-cyan-500">{t.common.dhakaLocation} • 23.81° N</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[260px] flex items-center justify-center cursor-grab active:cursor-grabbing">
      <div ref={mountRef} className="w-[260px] h-[260px]" />
      <div className="absolute bottom-1 px-3 py-1 rounded-full bg-[var(--bg-card)]/90 border border-[var(--border-subtle)] shadow-sm text-[11px] font-mono text-cyan-500 backdrop-blur-sm pointer-events-none flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>{t.common.dhakaLocation} (23.81° N, 90.41° E)</span>
      </div>
    </div>
  );
};
