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
const hud = document.getElementById("hud");
scene.add(hud);

let phoenix = loadPhoenix(scene).then((model) => {
  phoenix = model;
});
const bullets = [];
const sound_slap = new Sound(camera, 'sounds/slash.mp3');
const question = new Text(scene, "", new THREE.Vector3(100, 0, 0));
const answer = new Text(scene, "", new THREE.Vector3(0, 0, 0));
answer.moveSpeed = 0.002;

// ----- Animation
let prevTime = 0;
let lastShotTime = 0;
let lastNumber = 0;
let seeking = false;
let expectedAnswer;
let score = 0;
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
    seeking = true;
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

  if (seeking) {
    answer.setDestination(question.mesh.position);
  } else {
    answer.setPosition(phoenix.position);
  }

  const distanceAnswerQuestion = answer.mesh.position.distanceTo(question.mesh.position);
  const distanceQuestionPhoenix = phoenix.position.distanceTo(question.mesh.position);
  if (distanceAnswerQuestion < 0.1) {
    if (expectedAnswer === answer.text) {
      question.updateText("");
      score += 10;
      updateHud("Vai Così");
    } else {
      updateHud("Dai che lo sai!");
    }
    answer.updateText("");
    seeking = false;
  }

  if (distanceQuestionPhoenix < 0.1) {
    // Colpito: Game Over.
    scene.remove(phoenix);
    updateHud("Game Over!");
  }


  // Update Pheonix
  if (phoenix?.mixerx) {
    phoenix.mixerx.update(dt * 0.1);
  }

  // Update Numbers
  if (time - lastNumber > 10_000) {
    lastNumber = time;
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    expectedAnswer = "" + (a + b);
    question.updateText(`${a} + ${b}`);
    question.setPosition(phoenix.position.x + 5, phoenix.position.y + 5, 0);
  }

  renderer.render(scene, camera);
}

animate();

function updateHud(verbose) {
  document.getElementById("score").innerHTML = `Punteggio: ${score}`;
  if (lives) document.getElementById("lives").innerHTML = `${verbose}`;
}