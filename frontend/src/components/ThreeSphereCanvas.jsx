import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * NEXA AI 3D Neural Core Canvas
 * - Crystalline faceted icosahedron with glowing neon wireframe edges
 * - Dual concentric orbital rings rotating on offset angles
 * - Orbiting satellite nodes and dynamic 350+ particle swarm
 * - Smooth mouse parallax with inertia damping
 * - Real-time dark / light theme adaptation
 */
export default function ThreeSphereCanvas() {
  const mountRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 520;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 6.0);

    // Renderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      container.appendChild(renderer.domElement);
    } catch {
      setHasWebGL(false);
      return;
    }

    // ── Theme State Helpers ──
    const isThemeLight = () => document.documentElement.getAttribute("data-theme") === "light";

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x061e18, 2.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xf5fffc, 2.4);
    mainLight.position.set(5, 7, 5);
    scene.add(mainLight);

    const neonLimeLight = new THREE.PointLight(0x94ff00, 3.8, 14);
    neonLimeLight.position.set(-2.5, 1.8, 2.5);
    scene.add(neonLimeLight);

    const emeraldLight = new THREE.PointLight(0x00f5b8, 3.5, 12);
    emeraldLight.position.set(2.8, -1.2, 2.2);
    scene.add(emeraldLight);

    const pedestalLight = new THREE.PointLight(0x00dda5, 4.2, 10);
    pedestalLight.position.set(0, -1.8, 0.8);
    scene.add(pedestalLight);

    // ── Central Neural Core Group ──
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0.25, 0);
    scene.add(coreGroup);

    // 1. Faceted Crystalline Polyhedron (Icosahedron Detail 1)
    const crystalGeom = new THREE.IcosahedronGeometry(1.3, 1);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x052a20,
      emissive: 0x012419,
      emissiveIntensity: 0.5,
      roughness: 0.12,
      metalness: 0.3,
      transmission: 0.82,
      ior: 1.55,
      reflectivity: 0.9,
      transparent: true,
      opacity: 0.88,
      flatShading: true,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const crystalMesh = new THREE.Mesh(crystalGeom, crystalMat);
    coreGroup.add(crystalMesh);

    // 2. Glowing Neon-Lime Wireframe Overlay
    const wireframeGeom = new THREE.WireframeGeometry(crystalGeom);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x94ff00,
      transparent: true,
      opacity: 0.72,
      linewidth: 1.5,
      blending: THREE.AdditiveBlending,
    });
    const wireframeLines = new THREE.LineSegments(wireframeGeom, wireframeMat);
    coreGroup.add(wireframeLines);

    // 3. Inner Pulsing Emerald Energy Sphere
    const innerCoreGeom = new THREE.SphereGeometry(0.72, 32, 32);
    const innerCoreMat = new THREE.MeshStandardMaterial({
      color: 0x00f5b8,
      emissive: 0x00f5b8,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.4,
      transparent: true,
      opacity: 0.55,
    });
    const innerCore = new THREE.Mesh(innerCoreGeom, innerCoreMat);
    coreGroup.add(innerCore);

    // ── Concentric Orbital Rings ──
    // Ring 1 (Inner, tilted positive, Neon-Lime)
    const ring1Geom = new THREE.TorusGeometry(1.92, 0.034, 24, 128);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x94ff00,
      transparent: true,
      opacity: 0.88,
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 7;
    coreGroup.add(ring1);

    // Ring 2 (Outer, tilted negative, Emerald)
    const ring2Geom = new THREE.TorusGeometry(2.32, 0.026, 24, 128);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x00f5b8,
      transparent: true,
      opacity: 0.72,
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = -Math.PI / 3.8;
    ring2.rotation.y = -Math.PI / 5.5;
    coreGroup.add(ring2);

    // ── Orbiting Satellite Nodes ──
    const satGroup = new THREE.Group();
    coreGroup.add(satGroup);

    const satGeom = new THREE.SphereGeometry(0.085, 16, 16);
    const satMat1 = new THREE.MeshBasicMaterial({ color: 0x94ff00 });
    const satMat2 = new THREE.MeshBasicMaterial({ color: 0x00f5b8 });

    const satNode1 = new THREE.Mesh(satGeom, satMat1);
    const satNode2 = new THREE.Mesh(satGeom, satMat2);
    satGroup.add(satNode1);
    satGroup.add(satNode2);

    // ── Futuristic Pedestal Base ──
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, -1.6, 0);

    const baseDiscGeom = new THREE.CylinderGeometry(2.35, 2.55, 0.16, 52);
    const baseDiscMat = new THREE.MeshStandardMaterial({
      color: 0x061611,
      roughness: 0.35,
      metalness: 0.85,
    });
    const baseDisc = new THREE.Mesh(baseDiscGeom, baseDiscMat);
    pedestalGroup.add(baseDisc);

    // Outer Neon Pedestal Ring
    const pedRingOuterGeom = new THREE.TorusGeometry(2.48, 0.038, 16, 80);
    const pedRingOuterMat = new THREE.MeshBasicMaterial({ color: 0x94ff00 });
    const pedRingOuter = new THREE.Mesh(pedRingOuterGeom, pedRingOuterMat);
    pedRingOuter.rotation.x = Math.PI / 2;
    pedRingOuter.position.y = 0.09;
    pedestalGroup.add(pedRingOuter);

    // Inner Concentric Neon Ring
    const pedRingInnerGeom = new THREE.TorusGeometry(1.78, 0.026, 16, 80);
    const pedRingInnerMat = new THREE.MeshBasicMaterial({
      color: 0x00f5b8,
      transparent: true,
      opacity: 0.85,
    });
    const pedRingInner = new THREE.Mesh(pedRingInnerGeom, pedRingInnerMat);
    pedRingInner.rotation.x = Math.PI / 2;
    pedRingInner.position.y = 0.09;
    pedestalGroup.add(pedRingInner);

    scene.add(pedestalGroup);

    // ── Floating Particle Cloud (Desktop 360, Mobile 180) ──
    const isMobile = window.innerWidth <= 640;
    const particleCount = isMobile ? 180 : 360;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorLime = new THREE.Color(0x94ff00);
    const colorEmerald = new THREE.Color(0x00f5b8);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      // Spherical distribution
      const radius = 1.4 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[idx] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[idx + 2] = radius * Math.cos(phi);

      const mixed = Math.random() > 0.5 ? colorLime : colorEmerald;
      particleColors[idx] = mixed.r;
      particleColors[idx + 1] = mixed.g;
      particleColors[idx + 2] = mixed.b;
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeom.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.042,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeom, particleMat);
    scene.add(particleSystem);

    // ── Mouse Parallax with Damping ──
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = x * 0.45;
      targetMouseY = y * 0.35;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // ── Dynamic Theme Observer ──
    const applyThemeLighting = () => {
      const light = isThemeLight();
      if (light) {
        renderer.toneMappingExposure = 1.1;
        ambientLight.intensity = 3.6;
        ambientLight.color.setHex(0xe0f2eb);
        mainLight.intensity = 2.8;
        crystalMat.color.setHex(0x1a4035);
        crystalMat.emissive.setHex(0x0a2820);
        crystalMat.opacity = 0.92;
        wireframeMat.opacity = 0.55;
        baseDiscMat.color.setHex(0x0e241c);
      } else {
        renderer.toneMappingExposure = 1.35;
        ambientLight.intensity = 2.8;
        ambientLight.color.setHex(0x061e18);
        mainLight.intensity = 2.4;
        crystalMat.color.setHex(0x052a20);
        crystalMat.emissive.setHex(0x012419);
        crystalMat.opacity = 0.88;
        wireframeMat.opacity = 0.72;
        baseDiscMat.color.setHex(0x061611);
      }
    };

    applyThemeLighting();
    const themeObserver = new MutationObserver(() => applyThemeLighting());
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // ── Animation Loop ──
    let animId;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Inertia mouse parallax interpolation
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Central core floating & rotation
      coreGroup.position.y = 0.25 + Math.sin(elapsed * 1.5) * 0.09;
      coreGroup.rotation.y = elapsed * 0.38 + currentMouseX;
      coreGroup.rotation.x = Math.sin(elapsed * 0.8) * 0.12 + currentMouseY;

      // Faceted crystal counter-rotation
      crystalMesh.rotation.y = -elapsed * 0.15;

      // Inner core pulse
      const pulse = 0.8 + Math.sin(elapsed * 3.2) * 0.25;
      innerCoreMat.emissiveIntensity = pulse;

      // Orbital rings rotation
      ring1.rotation.z = elapsed * 0.55;
      ring1.rotation.y = Math.sin(elapsed * 0.6) * 0.25;

      ring2.rotation.z = -elapsed * 0.42;
      ring2.rotation.x = Math.cos(elapsed * 0.5) * 0.22;

      // Orbiting satellite nodes along the ring radii
      const r1Angle = elapsed * 1.2;
      satNode1.position.set(Math.cos(r1Angle) * 1.92, Math.sin(r1Angle) * 1.92, 0);

      const r2Angle = -elapsed * 0.95;
      satNode2.position.set(Math.cos(r2Angle) * 2.32, 0, Math.sin(r2Angle) * 2.32);

      // Particle cloud gentle rotation
      particleSystem.rotation.y = elapsed * 0.06;
      particleSystem.rotation.x = Math.sin(elapsed * 0.25) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // ── Resize Observer ──
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || 520;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      themeObserver.disconnect();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();

      // Geometry and material disposal
      crystalGeom.dispose();
      crystalMat.dispose();
      wireframeGeom.dispose();
      wireframeMat.dispose();
      innerCoreGeom.dispose();
      innerCoreMat.dispose();
      ring1Geom.dispose();
      ring1Mat.dispose();
      ring2Geom.dispose();
      ring2Mat.dispose();
      satGeom.dispose();
      satMat1.dispose();
      satMat2.dispose();
      baseDiscGeom.dispose();
      baseDiscMat.dispose();
      pedRingOuterGeom.dispose();
      pedRingOuterMat.dispose();
      pedRingInnerGeom.dispose();
      pedRingInnerMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="hero-3d-canvas-container"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "460px",
        display: "grid",
        placeItems: "center",
        pointerEvents: "none",
      }}
    >
      {!hasWebGL && (
        <div className="hero-orb-fallback">
          <div className="hero-orb-fallback__sphere" />
          <div className="hero-orb-fallback__pedestal" />
        </div>
      )}
    </div>
  );
}
