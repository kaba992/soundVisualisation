import { Scene, PerspectiveCamera, WebGLRenderer } from "three";

export let scene;
export let camera;
export let renderer;

export default () => {
  camera = new PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    100
  );
  camera.position.z = 30;
  scene = new Scene();

  renderer = new WebGLRenderer();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor("black");

  document.body.appendChild(renderer.domElement);

  return { scene, camera, renderer };
};
