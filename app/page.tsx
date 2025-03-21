"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    window.addEventListener("resize", () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    /**
     * Camera
     */
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 3;
    scene.add(camera);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const spheres: THREE.Mesh[] = [];

    /**
     * Geometry
     */

    const fontLoader = new FontLoader();
    fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
      const textGeometry = new TextGeometry("Hello Three.js", {
        font,
        size: 0.5,
        depth: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });

      textGeometry.center();
      const textMaterial = new THREE.MeshNormalMaterial();
      const text = new THREE.Mesh(textGeometry, textMaterial);
      scene.add(text);

      const sphereGeometry = new THREE.SphereGeometry(0.5, 64, 32);
      const sphereMaterial = new THREE.MeshPhysicalMaterial();
      sphereMaterial.metalness = 0;
      sphereMaterial.roughness = 0;
      sphereMaterial.transmission = 1;
      sphereMaterial.ior = 2;
      sphereMaterial.thickness = 0.5;

      // Créer les sphères
      for (let i = 0; i < 100; i++) {
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.x = (Math.random() - 0.5) * 10;
        sphere.position.y = (Math.random() - 0.5) * 10;
        sphere.position.z = (Math.random() - 0.5) * 10;
        // Ajouter des vitesses aléatoires pour chaque sphère
        sphere.userData.speedX = (Math.random() - 0.5) * 0.02;
        sphere.userData.speedY = (Math.random() - 0.5) * 0.02;
        sphere.userData.speedZ = (Math.random() - 0.5) * 0.02;
        scene.add(sphere);
        spheres.push(sphere);
      }
    });

    const tick = () => {
      // Animer toutes les sphères
      spheres.forEach((sphere) => {
        // Mouvement aléatoire et lent
        sphere.position.x += sphere.userData.speedX;
        sphere.position.y += sphere.userData.speedY;
        sphere.position.z += sphere.userData.speedZ;

        // Inverser la direction si la sphère va trop loin
        if (Math.abs(sphere.position.x) > 5) sphere.userData.speedX *= -1;
        if (Math.abs(sphere.position.y) > 5) sphere.userData.speedY *= -1;
        if (Math.abs(sphere.position.z) > 5) sphere.userData.speedZ *= -1;
      });

      controls.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return <canvas ref={canvasRef} className="canvas" />;
}
