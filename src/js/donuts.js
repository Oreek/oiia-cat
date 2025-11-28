import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

camera.position.z = 50;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffd700, 1);
pointLight.position.set(30, 30, 30);
pointLight.castShadow = true;
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xff69b4, 0.8);
pointLight2.position.set(-30, -30, 30);
scene.add(pointLight2);

const donutGeometry = new THREE.TorusGeometry(1, 0.4, 32, 100);


const donutMaterial = new THREE.MeshStandardMaterial({
  color: 0xffd700,
  metalness: 0.2,
  roughness: 0.6,
  emissive: 0xffd700,
  emissiveIntensity: 0.3
});

const donut = new THREE.Mesh(donutGeometry, donutMaterial);
donut.castShadow = true;
donut.receiveShadow = true;

donut.scale.set(6, 6, 6);

scene.add(donut);

const particleGroup = new THREE.Group();
scene.add(particleGroup);
let particles = [];

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function createParticles(position) {
  const particleCount = 20;
  
  for (let i = 0; i < particleCount; i++) {
    const particleGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const particleMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.6
    });
    
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.copy(position);
    
    const angle = Math.random() * Math.PI * 2;
    const elevation = Math.random() * Math.PI - Math.PI / 2;
    const speed = 2 + Math.random() * 4;
    
    particle.userData.velocity = new THREE.Vector3(
      Math.cos(elevation) * Math.cos(angle) * speed,
      Math.sin(elevation) * speed,
      Math.cos(elevation) * Math.sin(angle) * speed
    );
    particle.userData.lifetime = 1.5;
    
    particleGroup.add(particle);
    particles.push(particle);
  }
}

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(donut);
  
  if (intersects.length > 0) {
    const intersection = intersects[0];
    createParticles(intersection.point);
  }
});

function animate() {
  requestAnimationFrame(animate);
  
  const time = Date.now() * 0.001;
  donut.position.x = Math.sin(time) * 5;
  donut.position.y = Math.cos(time * 0.7) * 5;
  donut.position.z = Math.sin(time * 0.5) * 5;
  
  particles = particles.filter((particle) => {
    particle.position.add(particle.userData.velocity);
    particle.userData.velocity.multiplyScalar(0.98);
    particle.userData.lifetime -= 0.016;
    particle.material.opacity = particle.userData.lifetime;
    
    if (particle.userData.lifetime <= 0) {
      particleGroup.remove(particle);
      return false;
    }
    return true;
  });
  
  const time2 = Date.now() * 0.0001;
  camera.position.x = Math.cos(time2) * 60;
  camera.position.z = Math.sin(time2) * 60;
  camera.lookAt(scene.position);
  
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
