import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const text_geometry = (font, text_string) => new TextGeometry(text_string, {
  font: font,
  size: 0.5,
  height: 0.1,
  curveSegments: 12,
  bevelEnabled: false,
  bevelThickness: 0.5,
  bevelSize: 0.3,
  bevelOffset: 0,
  bevelSegments: 5,
});

const fontMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

/**
 * let t_coords = new Text(scene, "0, 0, 0", new THREE.Vector3( 0, 0, 0 ));
 */
export default class Text {

  moveSpeed = 0.001;

  constructor(scene, text_string, position_vector) {
    new FontLoader().load('fonts/helvetiker_regular.typeface.json', (font) => {
      const geometry = text_geometry(font, text_string);
      const mesh = new THREE.Mesh(geometry, fontMaterial);
      mesh.name = text_string;
      if (position_vector) {
        mesh.position.copy(position_vector);
      }
      scene.add(mesh);
      this.mesh = mesh;
      this.scene = scene;
      this.destination = new THREE.Vector3(0, 0, 0);
      this.text = text_string;
    });
  }

  position_string() {
    const pos = this.mesh.position;
    return pos.x.toFixed(2) + "," + pos.y.toFixed(2) + "," + pos.z.toFixed(2);
  }

  setPosition(x_v, y, z) {
    if (arguments.length === 3)
      this.mesh.position.set(x_v, y, z);
    if (arguments.length === 1)
      this.mesh?.position?.copy(x_v);
  }

  setDestination(x_v, y, z) {
    if (arguments.length === 3)
      this.destination.set(x_v, y, z);
    if (arguments.length === 1) 
      this.destination?.copy(x_v);
  }

  move(x, y, z) {
    this.mesh.position.set(this.mesh.position.x + x, this.mesh.position.y + y, this.mesh.position.z + z);
  }

  update(dt) {
    if (!this.mesh?.position) return;
    const distanceToDestination = this.mesh.position.distanceTo(this.destination);
    if (distanceToDestination > 0.1) {
      const direction = this.destination.clone().sub(this.mesh.position).normalize();
      const distanceToMove = this.moveSpeed * dt;
      if (distanceToMove < distanceToDestination) {
        this.mesh.position.add(direction.multiplyScalar(distanceToMove));
      } else {
        this.mesh.position.copy(this.destination);
      }
    } else {
      //this.scene.remove(this.mesh);
    }
  }

  updateText(newText) {
    this.mesh.geometry.dispose();

    const fontLoader = new FontLoader();
    fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => {
      const geometry = text_geometry(font, newText);
      this.mesh.geometry = geometry;
    });
    this.text = newText;
  }
}

