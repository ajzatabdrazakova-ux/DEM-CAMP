import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Rotate3d, Sparkles, Eye } from 'lucide-react';
import { Language } from '../types';

interface ThreeDHeroAnimationProps {
  lang: Language;
}

export const ThreeDHeroAnimation: React.FC<ThreeDHeroAnimationProps> = ({ lang }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteractiveMode, setIsInteractiveMode] = useState<boolean>(true);
  const [activeTheme, setActiveTheme] = useState<'bridge' | 'crystal' | 'network'>('bridge');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    
    // CAMERA
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 11);

    // RENDERER
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.warn('WebGL not supported, 3D will fall back gracefully', e);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.5);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 8, 50);
    cyanLight.position.set(4, 5, 5);
    scene.add(cyanLight);

    const indigoLight = new THREE.PointLight(0x6366f1, 8, 50);
    indigoLight.position.set(-5, -2, 4);
    scene.add(indigoLight);

    const accentLight = new THREE.PointLight(0x38bdf8, 5, 40);
    accentLight.position.set(0, 3, 2);
    scene.add(accentLight);

    // MASTER ROOT GROUP FOR 3D ANIMATION
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // ----------------------------------------------------
    // 1. 3D GLOWING DIALOGUE BRIDGE (Arch Curve)
    // ----------------------------------------------------
    const bridgeCurvePoints: THREE.Vector3[] = [];
    const curveResolution = 64;
    const bridgeSpan = 14;
    const bridgeHeight = 3.8;

    for (let i = 0; i <= curveResolution; i++) {
      const t = (i / curveResolution) * 2 - 1; // -1 to 1
      const x = t * (bridgeSpan / 2);
      const y = (1 - t * t) * bridgeHeight - 1.2;
      const z = Math.sin(t * Math.PI) * 1.5;
      bridgeCurvePoints.push(new THREE.Vector3(x, y, z));
    }

    const bridgeCurve = new THREE.CatmullRomCurve3(bridgeCurvePoints);
    const bridgeGeometry = new THREE.TubeGeometry(bridgeCurve, 70, 0.09, 12, false);
    const bridgeMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      metalness: 0.4,
      roughness: 0.2,
      wireframe: false,
    });
    const bridgeMesh = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
    masterGroup.add(bridgeMesh);

    // Secondary lower bridge support rail
    const railPoints = bridgeCurvePoints.map(p => new THREE.Vector3(p.x, p.y - 0.4, p.z - 0.3));
    const railCurve = new THREE.CatmullRomCurve3(railPoints);
    const railGeo = new THREE.TubeGeometry(railCurve, 50, 0.04, 8, false);
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      emissive: 0x4338ca,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.75,
    });
    const railMesh = new THREE.Mesh(railGeo, railMat);
    masterGroup.add(railMesh);

    // Vertical suspension beams (Pillars connecting bridge arch to base)
    const suspensionGroup = new THREE.Group();
    const beamCount = 13;
    for (let i = 1; i < beamCount; i++) {
      const frac = i / beamCount;
      const pt = bridgeCurve.getPoint(frac);
      const beamGeo = new THREE.CylinderGeometry(0.02, 0.02, pt.y + 2.5, 6);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.35,
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(pt.x, (pt.y - 2.5) / 2, pt.z);
      suspensionGroup.add(beam);
    }
    masterGroup.add(suspensionGroup);

    // ----------------------------------------------------
    // 2. TRAVELING ENERGY PHOTONS (Pulsing data across the bridge)
    // ----------------------------------------------------
    const photonCount = 6;
    const photonMeshes: THREE.Mesh[] = [];
    const photonOffsets = [0, 0.18, 0.35, 0.52, 0.7, 0.88];

    const photonGeo = new THREE.SphereGeometry(0.16, 16, 16);
    const photonMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
    });

    for (let i = 0; i < photonCount; i++) {
      const pMesh = new THREE.Mesh(photonGeo, photonMat);
      masterGroup.add(pMesh);
      photonMeshes.push(pMesh);
    }

    // ----------------------------------------------------
    // 3. CENTRAL 3D DEMOCRATIC CORE (Rotating Gyroscope & Crystal)
    // ----------------------------------------------------
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 1.8, 0);
    masterGroup.add(coreGroup);

    // Central faceted crystal
    const crystalGeo = new THREE.IcosahedronGeometry(0.9, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.7,
      metalness: 0.9,
      roughness: 0.15,
      wireframe: true,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    coreGroup.add(crystalMesh);

    // Inner glowing solid crystal
    const innerCrystalGeo = new THREE.OctahedronGeometry(0.5, 0);
    const innerCrystalMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.2,
      metalness: 0.3,
      roughness: 0.2,
    });
    const innerCrystal = new THREE.Mesh(innerCrystalGeo, innerCrystalMat);
    coreGroup.add(innerCrystal);

    // Orbiting Ring 1 (Yaw)
    const ring1Geo = new THREE.TorusGeometry(1.6, 0.03, 16, 60);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x0891b2,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    coreGroup.add(ring1);

    // Orbiting Ring 2 (Pitch)
    const ring2Geo = new THREE.TorusGeometry(2.0, 0.035, 16, 60);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.75,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 2.5;
    coreGroup.add(ring2);

    // Orbiting Ring 3 (Roll with dashed appearance via rings)
    const ring3Geo = new THREE.TorusGeometry(2.4, 0.025, 16, 60);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x059669,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.7,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.y = Math.PI / 3;
    coreGroup.add(ring3);

    // ----------------------------------------------------
    // 4. FLOATING 3D STUDENT & MENTOR DIALOGUE NODES
    // ----------------------------------------------------
    const nodeCount = 22;
    const nodeMeshes: THREE.Mesh[] = [];
    const nodeInitialPositions: { x: number; y: number; z: number; speed: number; phase: number }[] = [];

    const nodeColors = [0x38bdf8, 0x818cf8, 0x34d399, 0xfbbf24, 0xa78bfa];
    const nodeMaterials = nodeColors.map(col => new THREE.MeshStandardMaterial({
      color: col,
      emissive: col,
      emissiveIntensity: 0.7,
      metalness: 0.2,
      roughness: 0.2,
    }));

    for (let i = 0; i < nodeCount; i++) {
      const radius = 0.12 + Math.random() * 0.14;
      const sphereGeo = new THREE.SphereGeometry(radius, 16, 16);
      const mat = nodeMaterials[i % nodeMaterials.length];
      const mesh = new THREE.Mesh(sphereGeo, mat);

      // Distribute in a spherical cloud around the bridge and center
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;
      const dist = 3.5 + Math.random() * 5.5;

      const x = Math.cos(theta) * Math.cos(phi) * dist;
      const y = Math.sin(phi) * dist * 0.75 + 0.5;
      const z = Math.sin(theta) * Math.cos(phi) * dist * 0.75 - 1.5;

      mesh.position.set(x, y, z);
      masterGroup.add(mesh);
      nodeMeshes.push(mesh);

      nodeInitialPositions.push({
        x, y, z,
        speed: 0.4 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Dynamic connection lines between close nodes
    const maxLines = 45;
    const linePositions = new Float32Array(maxLines * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    const connectionLines = new THREE.LineSegments(lineGeo, lineMat);
    masterGroup.add(connectionLines);

    // ----------------------------------------------------
    // 5. 3D AMBIENT STAR/PARTICLE FIELD
    // ----------------------------------------------------
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 26;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;
      particleScales[i] = Math.random() * 0.08 + 0.03;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    // Canvas texture for circular glowing particles
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 32;
    particleCanvas.height = 32;
    const pCtx = particleCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(56, 189, 248, 0.8)');
      grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    const particlesMat = new THREE.PointsMaterial({
      size: 0.22,
      map: particleTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // ----------------------------------------------------
    // MOUSE & TOUCH INTERACTION
    // ----------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let dragDeltaX = 0;
    let dragDeltaY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      const rect = container.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const relativeY = clientY - rect.top;

      targetMouseX = (relativeX / rect.width) * 2 - 1;
      targetMouseY = -(relativeY / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = clientX - previousPointerX;
        const deltaY = clientY - previousPointerY;
        dragDeltaX += deltaX * 0.005;
        dragDeltaY += deltaY * 0.005;
        previousPointerX = clientX;
        previousPointerY = clientY;
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      if ('touches' in e && e.touches.length > 0) {
        previousPointerX = e.touches[0].clientX;
        previousPointerY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        previousPointerX = (e as MouseEvent).clientX;
        previousPointerY = (e as MouseEvent).clientY;
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    container.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // RESIZE OBSERVER
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // ----------------------------------------------------
    // ANIMATION LOOP
    // ----------------------------------------------------
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Group rotation with drag & mouse parallax
      masterGroup.rotation.y = dragDeltaX + mouseX * 0.35 + Math.sin(elapsedTime * 0.15) * 0.08;
      masterGroup.rotation.x = dragDeltaY - mouseY * 0.25;
      masterGroup.position.y = Math.sin(elapsedTime * 0.5) * 0.15;

      // Center core animations
      crystalMesh.rotation.x = elapsedTime * 0.6;
      crystalMesh.rotation.y = elapsedTime * 0.8;
      innerCrystal.rotation.x = -elapsedTime * 0.9;
      innerCrystal.rotation.z = elapsedTime * 0.7;
      const scalePulse = 1 + Math.sin(elapsedTime * 2.2) * 0.08;
      innerCrystal.scale.set(scalePulse, scalePulse, scalePulse);

      ring1.rotation.z = elapsedTime * 0.45;
      ring2.rotation.x = elapsedTime * 0.35 + Math.PI / 2.5;
      ring3.rotation.y = -elapsedTime * 0.5 + Math.PI / 3;

      // Photons animation along the 3D bridge
      for (let i = 0; i < photonCount; i++) {
        const offset = photonOffsets[i];
        // Move along curve in loop
        const t = ((elapsedTime * 0.22 + offset) % 1.0);
        const pos = bridgeCurve.getPoint(t);
        photonMeshes[i].position.copy(pos);
        // Subtle pulse scale
        const pScale = 0.9 + Math.sin(elapsedTime * 6 + i) * 0.3;
        photonMeshes[i].scale.set(pScale, pScale, pScale);
      }

      // Floating dialogue nodes movement
      for (let i = 0; i < nodeCount; i++) {
        const init = nodeInitialPositions[i];
        const mesh = nodeMeshes[i];
        mesh.position.y = init.y + Math.sin(elapsedTime * init.speed + init.phase) * 0.35;
        mesh.position.x = init.x + Math.cos(elapsedTime * (init.speed * 0.7) + init.phase) * 0.2;
      }

      // Update dynamic connection lines
      let lineVertexIndex = 0;
      const lineArray = connectionLines.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dist = nodeMeshes[i].position.distanceTo(nodeMeshes[j].position);
          if (dist < 3.2 && lineVertexIndex < maxLines * 6) {
            lineArray[lineVertexIndex++] = nodeMeshes[i].position.x;
            lineArray[lineVertexIndex++] = nodeMeshes[i].position.y;
            lineArray[lineVertexIndex++] = nodeMeshes[i].position.z;
            lineArray[lineVertexIndex++] = nodeMeshes[j].position.x;
            lineArray[lineVertexIndex++] = nodeMeshes[j].position.y;
            lineArray[lineVertexIndex++] = nodeMeshes[j].position.z;
          }
        }
      }
      
      // Zero out remaining lines
      for (let k = lineVertexIndex; k < maxLines * 6; k++) {
        lineArray[k] = 0;
      }
      connectionLines.geometry.attributes.position.needsUpdate = true;

      // Slow particle field drift
      particleSystem.rotation.y = elapsedTime * 0.02;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.015) * 0.05;

      // Dynamic light movement
      cyanLight.position.x = Math.sin(elapsedTime * 0.7) * 6;
      cyanLight.position.z = Math.cos(elapsedTime * 0.7) * 6;
      indigoLight.position.x = -Math.sin(elapsedTime * 0.5) * 7;
      indigoLight.position.y = Math.cos(elapsedTime * 0.6) * 4;

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      window.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries and materials
      bridgeGeometry.dispose();
      bridgeMaterial.dispose();
      railGeo.dispose();
      railMat.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      innerCrystalGeo.dispose();
      innerCrystalMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      photonGeo.dispose();
      photonMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      particleTexture.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-auto select-none rounded-3xl">
      {/* 3D WebGL Canvas host */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-700"
        title={lang === 'ky' ? '3D мейкиндикти айландыруу үчүн чычкан же тийүү менен сүйрөңүз' : lang === 'ru' ? 'Перетаскивайте мышкой или касанием для вращения 3D сцены' : 'Drag with mouse or touch to rotate 3D scene'}
      />

      {/* Atmospheric gradient overlay so text remains 100% crisp and readable */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-transparent lg:w-3/5" />
      <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

      {/* 3D Interactive Controls Pill at the top-right */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800/90 text-cyan-300 border border-cyan-500/30 text-xs font-semibold backdrop-blur-md shadow-lg shadow-cyan-950/50 transition-all">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <Rotate3d className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="hidden sm:inline">
            {lang === 'ky' ? '3D Интерактивдүү анимация' : lang === 'ru' ? 'Интерактивная 3D сцена' : 'Interactive 3D Scene'}
          </span>
          <span className="text-[10px] text-slate-400 hidden md:inline">
            ({lang === 'ky' ? 'айландырыңыз' : lang === 'ru' ? 'вращайте' : 'drag to rotate'})
          </span>
        </div>
      </div>
    </div>
  );
};
