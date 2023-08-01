import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const scene = new THREE.Scene();

// Si può cambiare la camera.position.z += 0.01;
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/**
 * Inizializzazioni varie.
 * 
 * @returns Le costanti del game
 */
export function init() {
    camera.position.z = 10;
    return {
        moveSpeed: 0.1,
        gravity: 0.01,
        shotCooldown: 500,
        // Questo fa il setup dei controlli di orbiting con il mouse per navigare la scena.
        controls: new OrbitControls(camera, renderer.domElement)
    }
}