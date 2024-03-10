import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const MOUSE_SCALE = 0.2;
const SMOOTH_INTERPOLATION_VALUE = 0.12;
const INITIAL_ROTATE_SPEED = -0.5;

const PanoramaViewer = ({
  texturePath,
  fov = 75,
  fovMin = 20,
  fovMax = 90,
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(texturePath);
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
    controls.rotateSpeed = INITIAL_ROTATE_SPEED;
    controls.update();

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onWindowResize, false);

    // Handle mouse wheel to zoom in/out
    let targetFOV = camera.fov;
    let targetPosition = camera.position;

    const reflectVectorAcrossPlaneWithNormal = (A, B) => {
      const normalB = B.clone().normalize();
      const dotProduct = A.dot(normalB);

      // Calculate the reflection vector R = A - 2*(A·B)*B
      // This reflects A in the plane orthogonal to B (using B as the plane's normal)
      const reflectionVector = normalB
        .multiplyScalar(2 * dotProduct)
        .sub(A)
        .negate();

      return reflectionVector;
    };

    const onWheel = (event) => {
      event.preventDefault();
      const delta = event.deltaY;

      targetFOV += delta;
      targetFOV = THREE.MathUtils.clamp(targetFOV, fovMin, fovMax);

      if (targetFOV <= fovMin || targetFOV >= fovMax) return;

      // Determine mouse position
      const rect = renderer.domElement.getBoundingClientRect();
      let mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      let mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Scale mouse position lower camera translation distance per zoom level
      mouseX *= MOUSE_SCALE;
      mouseY *= MOUSE_SCALE;

      // Raycasting to find intersecting point on the sphere
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
      const intersects = raycaster.intersectObject(sphere);

      if (intersects.length > 0) {
        const endVector = intersects[0].point.normalize().multiplyScalar(0.1);

        if (delta > 0) {
          //   mirror the vector across the camera vector to get the new position
          targetPosition = reflectVectorAcrossPlaneWithNormal(
            endVector,
            targetPosition
          );
        } else {
          targetPosition = endVector.negate();
        }
      }
    };
    renderer.domElement.addEventListener("wheel", onWheel);

    const animate = () => {
      requestAnimationFrame(animate);
      if (Math.abs(targetFOV - camera.fov) > 0.1) {
        camera.fov += (targetFOV - camera.fov) * SMOOTH_INTERPOLATION_VALUE; // Smoothly interpolate FOV
        controls.rotateSpeed = -0.5 + (75 - camera.fov) / 150; // might need to be adjusted

        camera.position.lerp(targetPosition, SMOOTH_INTERPOLATION_VALUE);
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
  }, [texturePath, fov, fovMin, fovMax]);

  return <div ref={mountRef}></div>;
};

export default PanoramaViewer;
