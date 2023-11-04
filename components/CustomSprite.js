import * as THREE from 'three';

export default class CustomSprite {

  /**
   * @param {*} scene The scene
   * @param {*} imagePath The image path
   * @param {*} initialPosition null, or new THREE.Vector3(0, 0, 0);
   */
  constructor(scene, imagePath, initialPosition) {
    if (initialPosition == null) initialPosition = new THREE.Vector3(0, 0, 0);

    const texture = new THREE.TextureLoader().load(imagePath);
    const material = new THREE.SpriteMaterial({ map: texture });
    this.sprite = new THREE.Sprite(material);
    this.sprite.position.copy(initialPosition);
    scene.add(this.sprite);
  }

  move(newPosition) {
    if (newPosition instanceof THREE.Vector3) {
      this.sprite.position.copy(newPosition);
    } else if (typeof newPosition === 'number' && arguments.length >= 3) {
      this.sprite.position.set(arguments[0], arguments[1], arguments[2]);
    }
  }

  moveBy(delta) {
    if (delta instanceof THREE.Vector3) {
      this.sprite.position.add(delta);
    } else if (typeof delta === 'number' && arguments.length >= 3) {
      this.sprite.position.x += arguments[0];
      this.sprite.position.y += arguments[1];
      this.sprite.position.z += arguments[2];
    }
  }

  destroy() {
    scene.remove(this.sprite);
  }
}
