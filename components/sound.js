import * as THREE from 'three';

export default class Sound {

    constructor(camera, sound_file) {
        // create an AudioListener and add it to the camera
        const listener = new THREE.AudioListener();
        camera.add(listener);

        // create a global audio source
        const sound = new THREE.Audio(listener);

        // load a sound and set it as the Audio object's buffer
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load(sound_file,  (buffer) => {
            sound.setBuffer(buffer);
            sound.setLoop(false);
            sound.setVolume(0.5);
            this.sound = sound;
        });

    }

    play() {
        this.sound.play();
    }
}