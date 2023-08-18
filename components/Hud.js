import * as THREE from 'three';

class Hud {
    
    constructor(scene, camera) {
        this.container = document.createElement('div');
        this.container.id = 'hud';
        document.body.appendChild(this.container);

        this.hudObject = new THREE.Object3D();
        this.hudObject.position.set(0, 0, 5);
        this.hudObject.quaternion.setFromEuler(new THREE.Euler(0, 90, 0));
        this.hudObject.scale.set(0.5, 0.5, 0.5);
        scene.add(this.hudObject);

        this.scoreElement = document.createElement('div');
        this.scoreElement.id = 'score';
        this.container.appendChild(this.scoreElement);

        this.livesElement = document.createElement('div');
        this.livesElement.id = 'lives';
        this.container.appendChild(this.livesElement);

        this.camera = camera;
    }

    update(score, lives, verbose) {
        this.scoreElement.innerHTML = `Punteggio: ${score}`;
        if (lives) {
            this.livesElement.innerHTML = `${verbose}`;
        } else {
            this.livesElement.innerHTML = '';
        }

        this.hudObject.lookAt(this.camera.position); // Keep HUD facing camera
    }
}

export default Hud;
