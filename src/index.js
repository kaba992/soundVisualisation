// import "reset-css";
import "./styles.css";
import * as THREE from "three";

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


const app = getThreeApp();

const clickBtn = document.querySelector(".click");
let sound, listener, analyser, data;
const emitters = [];

clickBtn.addEventListener("click", () => {
  loadSound();
  clickBtn.style.display = "none";
});


// create an Audio source
// load a sound and set it as the Audio object's buffer
function loadSound() {
  listener = new THREE.AudioListener();
  app.camera.add(listener);
  console.log(app.camera);
  sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load(soundtrack, function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    // sound.play();
    console.log(sound, 'jrgfhgfgfhgfhg');
  });
  analyser = new THREE.AudioAnalyser(sound, 128);
  data = analyser

}



const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial()
)
sphere.position.set(0, 0, 20);
app.scene.add(sphere);
// create an AudioAnalyser, passing in the sound and desired fftSize

function animate(nebula, app) {
  requestAnimationFrame(() => animate(nebula, app));
  if (data) {
    const soundFreq = data.getAverageFrequency();

    console.log(soundFreq);
  }
  nebula.update();
  app.renderer.render(app.scene, app.camera);
}

Nebula.fromJSONAsync(json.particleSystemState, THREE).then(loaded => {
  loaded.emitters.forEach(emitter => {
console.log(emitter, 'emitter');
emitter.alpha = 0
emitter.position.y = -500
    // make emitter not visible

    // emitter.behaviours.forEach(behaviour => {
    //  if (behaviour.type ==="Alpha") {

    //    console.log(behaviour);
    //  }
    // });

    emitters.push(emitter);
    // console.log(emitter);
  });
  const nebulaRenderer = new SpriteRenderer(app.scene, THREE);
  const nebula = loaded.addRenderer(nebulaRenderer);

  animate(nebula, app);
});

// iterate over the emitters object type
console.log(emitters);
emitters.forEach((emitter) => {
  for (const [key, value] of Object.entries(emitter)) {
    console.log(key, value);
  }
});
