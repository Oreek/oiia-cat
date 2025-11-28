import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000011);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// particles!!!
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 2000;
const positions = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount * 3; i += 3) {
  positions[i] = (Math.random() - 0.5) * 200;     // x
  positions[i + 1] = (Math.random() - 0.5) * 200; // y
  positions[i + 2] = (Math.random() - 0.5) * 200; // z
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const starsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.3,
  sizeAttenuation: true,
  transparent: true,
  opacity: 0.8
});
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);


camera.position.z = 5;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const gltfLoader = new GLTFLoader();
let loadedModel = null;
let isExploding = false;
let clickCount = 0;
const maxClicks = 5;
const scaleIncrement = 1.5;

gltfLoader.load('/assets/scene.gltf', (gltfScene) => {
  console.log('Model loaded:', gltfScene);
  gltfScene.scene.position.set(0, -1, 0);
  gltfScene.scene.scale.set(5, 5, 5);
  scene.add(gltfScene.scene);
  loadedModel = gltfScene.scene;
  
  renderer.domElement.addEventListener('click', (e) => {
    if (loadedModel && !isExploding) {
      clickCount++;
      console.log(`Click ${clickCount}/${maxClicks}`);
      
      loadedModel.scale.multiplyScalar(scaleIncrement);
      
      if (clickCount >= maxClicks) {
        isExploding = true;
        explodeModel(loadedModel);
        transitionToExplosion();
      }
    }
  });
  
  function rotateModel() {
    if (!isExploding) {
      gltfScene.scene.rotation.y += 0.01;
    }
  }
  renderer.setAnimationLoop(() => {
    rotateModel();
    animate();
  });
}, (progress) => {
  console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
}, (error) => {
  console.error('Error loading model:', error);
});

// Explosion is a man's love!!!
const explosionBtn = document.getElementById('explosion');
const resetBtn = document.getElementById('reset');
const prayBtn = document.getElementById('pray');

prayBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = '/pray.html';
});

explosionBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (loadedModel && !isExploding) {
    isExploding = true;
    explodeModel(loadedModel);
    transitionToExplosion();
  }
});

resetBtn.addEventListener('click', (e) => {
  e.preventDefault();
  resetExplosion();
});

function transitionToExplosion() {
  document.getElementById('mainText').textContent = 'YOU DEMON!';
  document.getElementById('subText').textContent = 'Even satan feels disgusted by your behaviour.';
  
  scene.background = new THREE.Color(0xff0000);
  document.body.style.backgroundColor = '#ff0000';
  
  explosionBtn.style.display = 'none';
  resetBtn.style.display = 'block';
}

function resetExplosion() {
  location.reload();
}

function explodeModel(model) {
  const meshesToExplode = [];
  
  model.traverse((child) => {
    if (child.isMesh) {
      const fragmentedMeshes = fragmentMesh(child);
      meshesToExplode.push(...fragmentedMeshes);
    }
  });
  
  meshesToExplode.forEach((mesh) => {
    scene.add(mesh);
    
    mesh.userData.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4
    );
    mesh.userData.rotationVelocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.15,
      (Math.random() - 0.5) * 0.15,
      (Math.random() - 0.5) * 0.15
    );
    mesh.userData.isExploded = true;
  });
  
  model.visible = false;
}

function fragmentMesh(mesh) {
  const fragments = [];
  const geometry = mesh.geometry;
  const material = mesh.material;
  
  if (!geometry) return fragments;
  
  const box = new THREE.Box3().setFromObject(mesh);
  const size = box.getSize(new THREE.Vector3());
  
  const gridSize = 3;
  const fragmentSize = size.clone().divideScalar(gridSize);
  
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        const fragGeometry = new THREE.BoxGeometry(
          fragmentSize.x * 0.9,
          fragmentSize.y * 0.9,
          fragmentSize.z * 0.9
        );
        
        const fragMaterial = Array.isArray(material) ? material[0].clone() : material.clone();
        
        const fragment = new THREE.Mesh(fragGeometry, fragMaterial);
        
        const worldPos = new THREE.Vector3();
        mesh.getWorldPosition(worldPos);
        
        fragment.position.copy(worldPos);
        fragment.position.x += (x - gridSize/2 + 0.5) * fragmentSize.x;
        fragment.position.y += (y - gridSize/2 + 0.5) * fragmentSize.y;
        fragment.position.z += (z - gridSize/2 + 0.5) * fragmentSize.z;
        
        fragment.rotation.copy(mesh.rotation);
        
        fragments.push(fragment);
      }
    }
  }
  
  return fragments;
}





function animate() {
  stars.rotation.x += 0.00005;
  stars.rotation.y += 0.00008;

  scene.traverse((child) => {
    if (child.isMesh && child.userData.isExploded && child.userData.velocity) {
      child.position.add(child.userData.velocity);
      
      child.rotation.x += child.userData.rotationVelocity.x;
      child.rotation.y += child.userData.rotationVelocity.y;
      child.rotation.z += child.userData.rotationVelocity.z;
      
      child.userData.velocity.y -= 0.02;
      child.userData.velocity.multiplyScalar(0.99);
    }
  });

  if (loadedModel && !isExploding) {
    loadedModel.rotation.y += 0.01;
  }

  renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );