import * as THREE from 'three';

/**
 * const background = new Background(scene, '/images/background_creepy.png');
 */
export default class Background {
  constructor(scene, imageSource) {
    this.scene = scene;
    this.imageSource = imageSource;

    var plane_loader = new THREE.TextureLoader();
    var texture = plane_loader.load(this.imageSource);

    var geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
    var material = new THREE.MeshBasicMaterial({
      map: texture,
    });
    var plane = new THREE.Mesh(geometry, material);
    plane.position.set(0, 0, -120);
    this.scene.add(plane);

    // Scale the plane
    plane.scale.set(0.3, 0.3, 0.3);

    return plane;
  }

  update(dt){
    // put the code here
  }
}