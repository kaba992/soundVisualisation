// import "reset-css";
import "./styles.css";
import * as THREE from "three";
import fragmentShader from "./fragment.glsl";
import vertexShader from "./vertex.glsl";

import Nebula, {
  Alpha,
  Body,
  Color,
  CrossZone,
  Emitter,
  Force,
  Life,
  Mass,
  RadialVelocity,
  Radius,
  Rate,
  Scale,
  ScreenZone,
  Span,
  SpriteRenderer,
} from "three-nebula";
import getThreeApp from "./three-app";
import json from "./emit1.json";
import soundtrack from "./Seyar.mp3"



const clickBtn = document.querySelector(".click");

clickBtn.addEventListener("click", () => {
  init();
  // loadSound();
  clickBtn.style.display = "none";
});
const init = () => {
  const app = getThreeApp();

  const settings = {
    speed: 0.2,
    density: 2.5,
  };

  const clock = new THREE.Clock();

  const emitters = [];

  // create an Audio source
  // load a sound and set it as the Audio object's buffer

  const listener = new THREE.AudioListener();
  app.camera.add(listener);
  const sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load(soundtrack, function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();

  });
  const analyser = new THREE.AudioAnalyser(sound, 128);

  const data = analyser


  const geometry = new THREE.SphereBufferGeometry(1, 50, 50)
  // console.log(geometry)

  const count = geometry.attributes.position.count //number of vertices in the geometry
  const randoms = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    randoms[i] = Math.random()
  }
  // console.log(randoms)

  geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

  console.log(geometry);
  const SphereMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uNoiseStrength: { value: 0 },
      
      uSpeed: { value: settings.speed },
      uNoiseDensity: { value: settings.density  * Math.random()},
     

    },
    // wireframe: true,

  });
  let time = 0;

  const sphere = new THREE.Mesh(geometry, SphereMaterial);
  sphere.position.set(0, 0, 20);
  app.scene.add(sphere);
  // create an AudioAnalyser, passing in the sound and desired fftSize
  let soundFreq

  function animate(nebula, app) {
    requestAnimationFrame(() => animate(nebula, app));


    nebula.update();
    app.renderer.render(app.scene, app.camera);
  }
  Nebula.fromJSONAsync(json.particleSystemState, THREE).then(loaded => {

    for (let i = 0; i < loaded.emitters.length; i++) {
      const emitter = loaded.emitters[i];
      // emitter.position.y = -350;
      let montagnegauche = loaded.emitters[0];
      let etoile = loaded.emitters[1];
      let montagnedroite = loaded.emitters[2];
      let fumée = loaded.emitters[3];
      montagnegauche.name = "montagnegauche";
      etoile.name = "etoile";
      montagnedroite.name = "montagnedroite";
      fumée.name = "fumée";

      function update() {
        time += 0.05;
        const elapsedTime = clock.getElapsedTime();
        let freq = data.getAverageFrequency();
        // if (freq > 0 && freq < 50) {
        //   etoile.position.y = 0;
        // } else {
        //   etoile.position.y = -350;
        // }
        // if (freq > 50 && freq < 100) {
        //   montagnegauche.position.y = 0;
        //   fumée.position.y = 0;
        // } else {
        //   montagnegauche.position.y = -350;
        //   fumée.position.y = -350;
        // }

        sphere.material.uniforms.uNoiseStrength.value = freq /256;
        sphere.material.uniforms.uTime.value = elapsedTime;
        // console.log(sphere.material.uniforms.uFrequency.value);
        // console.log(sphere.material.uniforms.uTime.value);
        requestAnimationFrame(update);
      }
      update();

    }
    const nebulaRenderer = new SpriteRenderer(app.scene, THREE);
    const nebula = loaded.addRenderer(nebulaRenderer);

    animate(nebula, app);
  });

  // iterate over the emitters object type
  emitters.forEach((emitter) => {
    for (const [key, value] of Object.entries(emitter)) {
      console.log(key, value);
    }
  });

};
