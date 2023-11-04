import * as THREE from 'three';

class Hud {

    verbose = '';

    /**
     * Inserisce un hud div all'interno del container.
     *  const hud = new Hud(scene, camera);
     *  hud.update("Buona Fortuna!");
     *  hud.verbose = "Score: ";
     * 
     *  Se verbose è settato è un prefix alla linea 01.
     *  
     * @param {*} scene The Scene
     * @param {*} camera  The Camera
     */
    constructor(scene, camera) {
        this.container = document.createElement('div');
        this.container.id = 'hud';
        document.body.appendChild(this.container);

        this.hudObject = new THREE.Object3D();
        this.hudObject.position.set(0, 0, 5); // Posiziona l'HUD a 5 unità di distanza dalla camera
        this.hudObject.quaternion.setFromEuler(new THREE.Euler(0, 90, 0)); // Orientamento dell'HUD
        this.hudObject.scale.set(0.5, 0.5, 0.5); // Scala dell'HUD
        scene.add(this.hudObject);

        this.line01Element = document.createElement('div');
        this.line01Element.id = 'line01';
        this.container.appendChild(this.line01Element);

        this.line02Element = document.createElement('div');
        this.line02Element.id = 'line02';
        this.container.appendChild(this.line02Element);

        this.camera = camera;
    }

    update(line01, line02) {
        this.line01Element.innerHTML = `${this.verbose}${line01}`;
        if (line02) {
            this.line02Element.innerHTML = `${line02}`;
        } else {
            this.line02Element.innerHTML = '';
        }

        this.hudObject.lookAt(this.camera.position); // Keep HUD facing camera
    }
}

export default Hud;
