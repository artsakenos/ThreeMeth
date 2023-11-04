import * as THREE from 'three';
import { setupKeyboard, isDown, isDownNumber } from '../components/keyboard'
import { scene, camera, renderer, init } from '../components/init.js';
import { loadPhoenix } from '../components/phoenix_loader';
import Bullet from '../components/bullet'
import Text from '../components/text_loader';
import Sound from '../components/sound';
import ParticleSystem from '../components/particle_system';
import Background from '../components/background';
import CustomSprite from '../components/CustomSprite'
import Hud from '../components/Hud';

// ----- Inizializzazione
const C = init();
setupKeyboard();

// ----- Scene Objects
const hud = new Hud(scene, camera);
hud.update("Buona Fortuna!");
hud.verbose = "Score: ";
const background = new Background(scene, '/images/background_creepy.png');
// const sprite_face = new CustomSprite(scene, '/images/face.png');
let explosion = null; // Indica se c'è un esplosione in corso.

let phoenix = loadPhoenix(scene).then((model) => {
  phoenix = model;
});

const bullets = [];
const question = new Text(scene, "", new THREE.Vector3(100, 0, 0));
const answer = new Text(scene, "", new THREE.Vector3(0, 0, 0));
answer.moveSpeed = 0.002;

const sound_slap = new Sound(camera, 'sounds/slash.mp3');
const sound_ccb = new Sound(camera, 'sounds/oh-no-113125.mp3');
const sound_scream = new Sound(camera, 'sounds/man-scream-121085.mp3');
const sound_shot = new Sound(camera, 'sounds/shotgun-shooting-things-105837.mp3');
const sound_background = new Sound(camera, 'sounds/comic5-25269.mp3', true);
const sound_yeah = new Sound(camera, 'sounds/yeah-7106.mp3');

// ----- Animation
let prevTime = 0;
let lastShotTime = 0;
let lastNumber = 0;
let seeking = false; // Significa che c'è un missile in corsa.
let shooting = false; // Significa che c'è uno sparo in corsa.
let expectedAnswer;
let score = 0;
let game_over = false;
function animate(time) {
  requestAnimationFrame(animate);
  const dt = time - prevTime; // Il delta time
  prevTime = time;

  if (isDown('ArrowLeft')) {
    phoenix.position.x -= C.moveSpeed;
    if (phoenix.position.x < -10) phoenix.position.x = -10;
  }
  if (isDown('ArrowRight')) {
    phoenix.position.x += C.moveSpeed;
    if (phoenix.position.x > +10) phoenix.position.x = +10;
  }
  if (isDown('ArrowUp')) {
    phoenix.position.y += C.moveSpeed;
    if (phoenix.position.y > +6) phoenix.position.y = +6;
  }
  if (isDown('ArrowDown')) {
    phoenix.position.y -= C.moveSpeed;
    if (phoenix.position.y < -6) phoenix.position.y = -6;
  }

  if (isDown('a') && time - lastShotTime > C.shotCooldown) {
    lastShotTime = time;
    const bulletDirection = new THREE.Vector3(1, 0, 0); // Change direction as needed
    const bullet = new Bullet(phoenix.position, bulletDirection, scene);
    bullets.push(bullet);
    sound_slap.play();
  }

  if (!shooting && isDown('Enter') && time - lastShotTime > C.shotCooldown) {
    sound_shot.play();
    sound_background.play();
    shooting = true;
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

  const accelerator = (time - lastShotTime) / 30_000;
  question.update(dt * accelerator);
  const velocity = answer.update(dt * accelerator);
  question.setDestination(phoenix.position);
  if (explosion) explosion.updateExplosion(dt);
  // background.update(dt*0.000001);

  if (shooting) {
    answer.setDestination(question.mesh.position);
  } else {
    answer.setPosition(phoenix.position);
  }

  const distanceAnswerQuestion = answer.mesh.position.distanceTo(question.mesh.position);
  const distanceQuestionPhoenix = phoenix.position.distanceTo(question.mesh.position);
  if (shooting && distanceAnswerQuestion < 0.1) {
    if (expectedAnswer === answer.text) {
      question.updateText("");
      score += 10;
      hud.update(score, "Vai così!");
      sound_yeah.play();
      if (explosion) explosion.clearParticles();
      explosion = new ParticleSystem(scene, question.mesh.position, velocity);
      seeking = false;
      lastShotTime = time;
    } else {
      hud.update(score, "Dai che lo sai!");
      sound_ccb.play();
    }
    answer.updateText("");
    shooting = false;
  }

  if (seeking && distanceQuestionPhoenix < 0.1) {
    // Colpito: Game Over.
    scene.remove(phoenix);
    if (!game_over) sound_scream.play();
    hud.update(score, "Game Over!");
    game_over = true;
  }

  // Update Pheonix
  if (phoenix?.mixerx) {
    phoenix.mixerx.update(dt * 0.1);
  }

  // Update Face
  // sprite_face.moveBy(new THREE.Vector3(0.01, 0, 0));

  // Update Numbers
  if (!seeking && !game_over && time - lastNumber > 10_000) {
    lastNumber = time;
    const a = Math.floor(Math.random() * 10 + score / 20);
    const b = Math.floor(Math.random() * 10 + score / 20);
    expectedAnswer = "" + (a + b);
    question.updateText(`${a} + ${b}`);
    question.setPosition(phoenix.position.x + 7, phoenix.position.y + 5, 5);
    seeking = true;
  }

  renderer.render(scene, camera);
}

animate();
