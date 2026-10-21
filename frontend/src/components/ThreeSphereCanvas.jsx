import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function ThreeSphereCanvas() {
  const mountRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.8);

    // Renderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      container.appendChild(renderer.domElement);
    } catch {
      setHasWebGL(false);
      return;
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x061e18, 2.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xf5fffc, 2.2);
    mainLight.position.set(4, 6, 4);
    scene.add(mainLight);

    const neonMintLight = new THREE.PointLight(0x00f5b8, 3.5, 12);
    neonMintLight.position.set(-2, 1, 2);
    scene.add(neonMintLight);

    const pedestalLight = new THREE.PointLight(0x00dda5, 4.0, 10);
    pedestalLight.position.set(0, -1.6, 0.8);
    scene.add(pedestalLight);

    // Central Emerald Glass Sphere
    const sphereGeometry = new THREE.SphereGeometry(1.35, 64, 64);
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x052a20,
      emissive: 0x003322,
      emissiveIntensity: 0.4,
      roughness: 0.08,
      metalness: 0.15,
      transmission: 0.88,
      ior: 1.52,
      reflectivity: 0.85,
      transparent: true,
      opacity: 0.92,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });
    const glassSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    glassSphere.position.set(0, 0.25, 0);
    scene.add(glassSphere);

    // Glowing Emerald Inner Core
    const coreGeometry = new THREE.SphereGeometry(0.75, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f5b8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const innerCore = new THREE.Mesh(coreGeometry, coreMaterial);
    glassSphere.add(innerCore);

    // Orbital Neon Rings
    const ring1Geom = new THREE.TorusGeometry(1.85, 0.032, 24, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00f5b8,
      transparent: true,
      opacity: 0.85,
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    ring1.position.set(0, 0.25, 0);
    scene.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(2.15, 0.022, 24, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x00dda5,
      transparent: true,
      opacity: 0.65,
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = -Math.PI / 5;
    ring2.position.set(0, 0.25, 0);
    scene.add(ring2);

    // Glowing Circular Pedestal Base
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, -1.5, 0);

    const baseDiscGeom = new THREE.CylinderGeometry(2.2, 2.4, 0.16, 48);
    const baseDiscMat = new THREE.MeshStandardMaterial({
      color: 0x061510,
      roughness: 0.3,
      metalness: 0.8,
    });
    const baseDisc = new THREE.Mesh(baseDiscGeom, baseDiscMat);
    pedestalGroup.add(baseDisc);

    // Outer Neon Pedestal Ring
    const pedRingOuterGeom = new THREE.TorusGeometry(2.35, 0.035, 16, 64);
    const pedRingOuterMat = new THREE.MeshBasicMaterial({ color: 0x00f5b8 });
    const pedRingOuter = new THREE.Mesh(pedRingOuterGeom, pedRingOuterMat);
    pedRingOuter.rotation.x = Math.PI / 2;
    pedRingOuter.position.y = 0.09;
    pedestalGroup.add(pedRingOuter);

    // Inner Concentric Neon Ring
    const pedRingInnerGeom = new THREE.TorusGeometry(1.65, 0.025, 16, 64);
    const pedRingInnerMat = new THREE.MeshBasicMaterial({ color: 0x00dda5, transparent: true, opacity: 0.8 });
    const pedRingInner = new THREE.Mesh(pedRingInnerGeom, pedRingInnerMat);
    pedRingInner.rotation.x = Math.PI / 2;
    pedRingInner.position.y = 0.09;
    pedestalGroup.add(pedRingInner);

    scene.add(pedestalGroup);

    // Ambient Floating Particles
    const particleCount = 90;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 6;
      particlePositions[i + 1] = (Math.random() - 0.5) * 5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4;
    }
    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f5b8,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Animation Loop
    let animId;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Gentle floating & rotation
      glassSphere.position.y = 0.25 + Math.sin(elapsed * 1.4) * 0.08;
      glassSphere.rotation.y = elapsed * 0.35;
      glassSphere.rotation.x = Math.sin(elapsed * 0.7) * 0.15;

      innerCore.rotation.y = -elapsed * 0.6;
      innerCore.rotation.z = elapsed * 0.4;

      ring1.position.y = glassSphere.position.y;
      ring1.rotation.z = elapsed * 0.45;
      ring1.rotation.y = Math.sin(elapsed * 0.5) * 0.3;

      ring2.position.y = glassSphere.position.y;
      ring2.rotation.z = -elapsed * 0.35;
      ring2.rotation.x = Math.cos(elapsed * 0.4) * 0.3;

      particles.rotation.y = elapsed * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || 480;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      ring1Geom.dispose();
      ring1Mat.dispose();
      ring2Geom.dispose();
      ring2Mat.dispose();
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
        minHeight: "440px",
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
