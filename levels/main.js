import * as THREE from 'three';
import { setupKeyboard, isDown } from '../components/keyboard'
import { scene, camera, renderer, init } from '../components/init.js';
import { loadPhoenix } from '../components/phoenix_loader';
import * as Ammo from 'ammo.js';
import Bullet from '../components/bullet'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Text from '../components/text_loader';

const C = init();
setupKeyboard();
const physicsWorld = new Ammo.btDiscreteDynamicsWorld();
const shotCooldown = 500;
var controls = new OrbitControls(camera, renderer.domElement);

// ----- Scene Objects
let phoenix = loadPhoenix(scene).then((model) => {
  phoenix = model;
});
const bullets = [];
let testo = new Text(scene, "Ciao!");
testo.update("Pippo!");

// ----- Animation
let prevTime = 0;
let lastShotTime = 0;
function animate(time) {
  requestAnimationFrame(animate);
  const dt = time - prevTime;
  prevTime = time;

  if (isDown('ArrowLeft')) {
    phoenix.position.x -= C.moveSpeed * 2;
  }
  if (isDown('ArrowRight')) {
    phoenix.position.x += C.moveSpeed * 2;
  }

  if (isDown('a') && time - lastShotTime > shotCooldown) {
    lastShotTime = time;
    const bulletDirection = new THREE.Vector3(1, 0, 0); // Change direction as needed
    const bullet = new Bullet(phoenix.position, bulletDirection, scene);
    bullets.push(bullet);
  }

  // Update bullets
  bullets.forEach(bullet => {
    bullet.update(dt);
  });

  if (phoenix?.mixerx) {
    phoenix.mixerx.update(dt * 0.1);
  }

  renderer.render(scene, camera);
}

animate();