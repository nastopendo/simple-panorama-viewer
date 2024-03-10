import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const PanoramaViewer = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("/images/pano_1.jpg");
    texture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.FrontSide,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.set(0, 0, 0.1);
    sphere.rotation.y = -Math.PI / 2; // Rotate the sphere for correct orientation

    // Controls for pan and zoom
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.rotateSpeed = -0.5;
    controls.update();

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onWindowResize, false);

    // Handle mouse wheel to zoom in/out
    let targetFOV = camera.fov;
    const onWheel = (event) => {
      const delta = event.deltaY;
      targetFOV += delta * 0.05;
      targetFOV = THREE.MathUtils.clamp(targetFOV, 20, 90); // Clamp between 20 and 90 degrees or your desired min/max zoom
    };
    renderer.domElement.addEventListener("wheel", onWheel);

    // Render Loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (Math.abs(targetFOV - camera.fov) > 0.1) {
        camera.fov += (targetFOV - camera.fov) * 0.1; // Smoothly interpolate FOV
        camera.updateProjectionMatrix();
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Clean up on component unmount
    return () => {
      renderer.domElement.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onWindowResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef}></div>;
};

export default PanoramaViewer;
