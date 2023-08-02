import * as THREE from 'three';
import ParticleSystem from './particle_system.js'

const particles = true;

export default class Bullet {
  constructor(position, direction, scene) {
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );

    this.mesh.position.copy(position);
    this.direction = direction.normalize();
    this.speed = 0.01; // Adjust the bullet speed as needed

    this.scene = scene;
    this.initial_position = position;

    if (particles)
      this.particleSystem = new ParticleSystem(scene, position);

    scene.add(this.mesh);
  }

  update(dt) {
    // Move the bullet in the specified direction
    const displacement = this.direction.clone().multiplyScalar(this.speed * dt);
    this.mesh.position.add(displacement);

    if (particles)
    // this.particleSystem.updatePosition(this.mesh.position);
    this.particleSystem.updateExpansion(this.mesh.position);

    // Remove the bullet when it goes out of the scene
    const maxDistance = 50; // Adjust as needed based on your scene size
    if (this.mesh.position.distanceTo(this.initial_position) > maxDistance) {
      this.remove();
      this.particleSystem.remove();
    }
  }

  remove() {
    this.scene.remove(this.mesh);
  }
}
