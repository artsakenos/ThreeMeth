import * as THREE from 'three';
import { setupKeyboard, isDown, isDownNumber } from '../components/keyboard'
import { scene, camera, renderer, init } from '../components/init.js';
import { loadPhoenix } from '../components/phoenix_loader';
import Bullet from '../components/bullet'
import Text from '../components/text_loader';
import Sound from '../components/sound';

// ----- Inizializzazione
const C = init();
setupKeyboard();

// ----- Scene Objects
let phoenix = loadPhoenix(scene).then((model) => {
  phoenix = model;
});
const bullets = [];
const sound_slap = new Sound(camera, 'sounds/slash.mp3');
const question = new Text(scene, "", new THREE.Vector3(0, 0, 0));
const answer = new Text(scene, "", new THREE.Vector3(0, 0, 0));

// ----- Animation
let prevTime = 0;
let lastShotTime = 0;
let lastNumber = 0;
function animate(time) {
  requestAnimationFrame(animate);
  const dt = time - prevTime; // Il delta time
  prevTime = time;

  if (isDown('ArrowLeft')) {
    phoenix.position.x -= C.moveSpeed;
  }
  if (isDown('ArrowRight')) {
    phoenix.position.x += C.moveSpeed;
  }
  if (isDown('ArrowUp')) {
    phoenix.position.y += C.moveSpeed;
  }
  if (isDown('ArrowDown')) {
    phoenix.position.y -= C.moveSpeed;
  }

  if (isDown('a') && time - lastShotTime > C.shotCooldown) {
    lastShotTime = time;
    const bulletDirection = new THREE.Vector3(1, 0, 0); // Change direction as needed
    const bullet = new Bullet(phoenix.position, bulletDirection, scene);
    bullets.push(bullet);
    sound_slap.play();
  }

  if (isDown('Enter') && time - lastShotTime > C.shotCooldown) {
    lastShotTime = time;
    // answer.updateText("");
    answer.setDestination(new THREE.Vector3(5, 0, 0));
  }

  const numberPressed = isDownNumber();
  if (numberPressed !== null) {
    // console.log(`Number ${numberPressed} pressed.`);
    answer.updateText(answer.text + numberPressed);
  }

  // Update bullets
  bullets.forEach(bullet => {
    bullet.update(dt);
  });

  question.update(dt);
  answer.update(dt);
  question.setDestination(phoenix.position);


  // Update Pheonix
  if (phoenix?.mixerx) {
    phoenix.mixerx.update(dt * 0.1);
  }

  // Update Numbers
  if (time - lastNumber > 10_000) {
    lastNumber = time;
    question.updateText("5+5");
    // question.setPosition(10,0,0);
  }

  renderer.render(scene, camera);
}

animate();