import * as THREE from 'three';
import { setupKeyboard, isDown, isDownNumber } from '../components/keyboard'
import { scene, camera, renderer, init } from '../components/init.js';
import { loadPhoenix } from '../components/phoenix_loader';
import Bullet from '../components/bullet'
import Text from '../components/text_loader';
import Sound from '../components/sound';
import ParticleSystem from '../components/particle_system';

// ----- Inizializzazione
const C = init();
setupKeyboard();

// ----- Scene Objects
const hud = document.getElementById("hud");
scene.add(hud);
const hudObject = new THREE.Object3D();
hudObject.position.set(0, 0, 5); // Posiziona l'HUD a 5 unità di distanza dalla camera
hudObject.quaternion.setFromEuler(new THREE.Euler(0, 90, 0)); // Orientamento dell'HUD
hudObject.scale.set(0.5, 0.5, 0.5); // Scala dell'HUD
scene.add(hudObject);
let explosion = null;

var plane_loader = new THREE.TextureLoader();
plane_loader.load('/images/background_creepy.png', (texture) => {
  // Creare una superficie plana
  var geometry = new THREE.PlaneGeometry(1000, 1000);
  var material = new THREE.MeshBasicMaterial({
    map: texture,
  });
  var plane = new THREE.Mesh(geometry, material);
  plane.position.set(0, 0, -120);
  scene.add(plane);

  requestAnimationFrame(function() {
    plane.position.x += 0.1;
    renderer.render(scene, camera);
  });

  // Scala la superficie plana
  plane.scale.set(0.3, 0.3, 0.3);
});

let phoenix = loadPhoenix(scene).then((model) => {
  phoenix = model;
});
const bullets = [];
const sound_slap = new Sound(camera, 'sounds/slash.mp3');
const sound_scream = new Sound(camera, 'sounds/man-scream-121085.mp3');
const sound_shot = new Sound(camera, 'sounds/shotgun-shooting-things-105837.mp3');
const sound_background = new Sound(camera, 'sounds/comic5-25269.mp3', true);
const sound_yeah = new Sound(camera, 'sounds/yeah-7106.mp3');
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
let game_over = false;
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
    sound_shot.play();
    sound_background.play();
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
      sound_yeah.play();
      explosion = new ParticleSystem(scene, question.mesh.position);
    } else {
      updateHud("Dai che lo sai!");
    }
    answer.updateText("");
    seeking = false;
  }

  if (distanceQuestionPhoenix < 0.1) {
    // Colpito: Game Over.
    scene.remove(phoenix);
    if (!game_over) sound_scream.play();
    updateHud("Game Over!");
    game_over = true;
  }


  // Update Pheonix
  if (phoenix?.mixerx) {
    phoenix.mixerx.update(dt * 0.1);
  }

  // Update Numbers
  if (!game_over && time - lastNumber > 10_000) {
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