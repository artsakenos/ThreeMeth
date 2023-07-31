import * as THREE from 'three';

/**
 * Nel costruttore:
 *  this.particleSystem = new ParticleSystem(scene, position);
 * Nell'update:
 *  this.particleSystem.updatePosition(this.mesh.position);
 * E per la rimozione:
 *  this.particleSystem.remove();
 */
export default class ParticleSystem {
  constructor(scene, position) {
    this.geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(100 * 3); // Adjust the number of particles as needed
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));

    this.material = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.05, sizeAttenuation: true });
    this.particles = new THREE.Points(this.geometry, this.material);

    this.scene = scene;
    scene.add(this.particles);
    this.particles.position.copy(position);

    // Le posizioni di ogni particle si trovano agli indirizzi:
    for (let i = 0; i < this.positions.length; i += 3) {
      // Esempio per Randomize particle positions around the bullet
      // this.positions[i] = (Math.random() - 0.5) * 10.2; // Adjust spread along the x-axis
      // this.positions[i + 1] = (Math.random() - 0.5) * 10.2; // Adjust spread along the y-axis
      // this.positions[i + 2] = (Math.random() - 0.5) * 10.2; // Adjust spread along the z-axis
    }
  }

  updatePosition(position) {
    // Update particle positions with the current bullet position
    const positions = this.geometry.attributes.position.array;
    this.geometry.attributes.position.needsUpdate = true;

    for (let i = 0; i < this.positions.length; i += 3) {
      positions[i+0] = (Math.random() - 0.5) * 2.2 + position.x; // Adjust spread along the x-axis
      positions[i+1] = (Math.random() - 0.5) * 2.2 + position.y; // Adjust spread along the y-axis
      positions[i+2] = (Math.random() - 0.5) * 2.2 + position.z; // Adjust spread along the z-axis
    }
  }

  remove() {
    this.scene.remove(this.particles);
  }
}
