import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/** Da caricare con:
* let phoenix;
* loadPhoenix_2(scene).then((model) => {
* phoenix = model;
* });
*/
export function loadPhoenix(scene) {
  return new Promise((resolve) => {

    new GLTFLoader().load('./phoenix/scene.gltf', function (gltf) {
      let phoenix = gltf.scene;
      const scale = 0.005;
      phoenix.scale.set(scale, scale, scale);
      phoenix.position.set(0, 0, -0);
      phoenix.mixerx = new THREE.AnimationMixer(phoenix);

      const clip = gltf.animations[0];
      let clipAction = phoenix.mixerx.clipAction(clip);
      clipAction.play();
      // clipAction.play().setEffectiveTimeScale(0.1);
      phoenix.mixerx.timeScale = 0.005;

      scene.add(phoenix);
      resolve(phoenix);
      return phoenix;
    }, undefined, function (error) {
      console.error(error);
      return null;
    });

  });
}
