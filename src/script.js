import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
function createTulip() {
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, -1);     
    petalShape.bezierCurveTo(1.5, -1, 1.5, 1, 0, 1.5);  
    petalShape.bezierCurveTo(-1.5, 1, -1.5, -1, 0, -1); 
    const extrudeSettings = { 
        depth: 0.1,  // Thicker petals
        bevelEnabled: true, 
        bevelThickness: 0.1, 
        bevelSize: 0.1,  
        bevelSegments: 5   
    };
    const petalGeometry = new THREE.ExtrudeGeometry(petalShape, extrudeSettings);
    const petalMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0xffc0cb,   // Lighter pink
        metalness: 0.2,     // Less metalness
        roughness: 0.05,   // smooth
        clearcoat: 1.0,      // bright
        clearcoatRoughness: 0.1 
    });
    const petals = [];
    for (let i = 0; i < 3; i++) { // 3 petals 
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        petal.rotation.y = (i * 2 * Math.PI) / 3;
        petals.push(petal);
    }
    // Stem 
    const stemGeometry = new THREE.CylinderGeometry(0.15, 0.15, 4, 16); 
    const stemMaterial = new THREE.MeshPhysicalMaterial({ color: 0x90ee90, roughness: 0.5 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.set(0, -1.25, 0);
    const leafShape = new THREE.Shape();
    leafShape.moveTo(-0.5, 0);     
    leafShape.bezierCurveTo(-0.5, 1, 0.5, 1, 0.5, 0); 
    leafShape.lineTo(0, -1); 

    const leafGeometry = new THREE.ExtrudeGeometry(leafShape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 });
    const leafMaterial = stemMaterial; 

    const leaves = []; //two leaves
    for (let i = 0; i < 2; i++) {
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf.position.set(0, -2.4, i === 0 ? -0.2 : 0.2); 
        leaf.rotation.z = i === 0 ? -Math.PI / 1.5 : Math.PI / 1.5;
        leaves.push(leaf);
    }

    const group = new THREE.Group();
    petals.forEach(petal => group.add(petal));
    leaves.forEach(leaf => group.add(leaf));
    group.add(stem);

    return group;
}
const tulip = createTulip();
scene.add(tulip);
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 10;
scene.add(camera);
// lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1); 
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); 
directionalLight.position.set(1, 1, 1); 
scene.add(directionalLight);
// Mouse move event handler 
let targetSwing = 0;
const swingSpeed = 0.005;
const maxSwingAngle = 0.2; 

window.addEventListener('mousemove', (event) => {
    const mouseX = (event.clientX / sizes.width) * 2 - 1; // mouse position (-1 to 1)
    targetSwing = mouseX * 0.1; // sensitivity
});
// Controls rotation
// const controls = new OrbitControls(camera, canvas);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});
const tick = () => {
    const elapsedTime = clock.getElapsedTime();

     // Smooth swinging for the tulip
     const currentSwing = tulip.rotation.z;
     const swingDirection = Math.sign(targetSwing - currentSwing); // 1 or -1
     const swingAmount = Math.min(Math.abs(targetSwing - currentSwing), maxSwingAngle);
     tulip.rotation.z += swingDirection * swingAmount * swingSpeed; 
 
     // Update controls rotation 
    //  controls.update()
     // Render
     renderer.render(scene, camera)
     // Call tick again on the next frame
     window.requestAnimationFrame(tick)
};

tick();