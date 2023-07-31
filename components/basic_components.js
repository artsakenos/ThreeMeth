import * as THREE from 'three';


/**
 * scene.add(cube);
 * 
 * in animate():
 *   cube.rotation.x += 0.01;
 *   cube.rotation.y += 0.01;
 */
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
export const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

/**
 * Un ground plane per il background
 */
const groundGeometry = new THREE.PlaneGeometry(10, 10);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
export const ground = new THREE.Mesh(groundGeometry, groundMaterial);

/**
 * scene.add(sprite_x(1));
 * 
 * in animate():
 * sprite_x(1);, sprite_x(2);
 * cambia le sprite properties sulla stessa istanza.
 */
const textureLoader = new THREE.TextureLoader();
const spriteTexture = textureLoader.load('1.png');
const spriteMaterial = new THREE.SpriteMaterial({ map: spriteTexture });
const sprite = new THREE.Sprite(spriteMaterial);
const leftTexture = textureLoader.load('2.png');
const rightTexture = textureLoader.load('3.png');
export const sprite_x = (number) => {
    if (number == 0) {
        sprite.material.map = spriteTexture;
    }
    if (number == 1) {
        sprite.material.map = leftTexture;
    }
    if (number == 2) {
        sprite.material.map = rightTexture;
    }
    return sprite;
}
