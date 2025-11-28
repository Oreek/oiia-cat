import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

function initBox1() {
  const container = document.getElementById('box1');
  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0.1);
  container.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));

  let model = null;

  const gltfLoader = new GLTFLoader();
  gltfLoader.load('/assets/scene.gltf', (gltfScene) => {
    model = gltfScene.scene;
    model.scale.set(5, 5, 5);
    model.position.set(0, -0.5, 0);
    scene.add(model);
  });

  function animate() {
    requestAnimationFrame(animate);
    if (model) {
      model.rotation.x += 0.01;
      model.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
}

function initBox2() {
  const container = document.getElementById('box2');
  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0.1);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  const colors = [0xffa500, 0xffd700, 0xff69b4, 0xff1493, 0x00ff00, 0x00ffff];
  let colorIndex = 0;
  
  let material = new THREE.MeshPhongMaterial({
    color: colors[colorIndex],
    emissive: colors[colorIndex],
    shininess: 100
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.userData.velocity = {
    x: (Math.random() - 0.5) * 0.08,
    y: (Math.random() - 0.5) * 0.08
  };

  cube.scale.set(1.5, 1.5, 1.5);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  function animate() {
    requestAnimationFrame(animate);
    
    cube.position.x += cube.userData.velocity.x;
    cube.position.y += cube.userData.velocity.y;
    
    cube.rotation.x += 0.02;
    cube.rotation.y += 0.02;
    
    const boundary = 2.5;
    if (Math.abs(cube.position.x) > boundary) {
      cube.userData.velocity.x *= -1;
      colorIndex = (colorIndex + 1) % colors.length;
      material.color.setHex(colors[colorIndex]);
      material.emissive.setHex(colors[colorIndex]);
    }
    if (Math.abs(cube.position.y) > boundary) {
      cube.userData.velocity.y *= -1;
      colorIndex = (colorIndex + 1) % colors.length;
      material.color.setHex(colors[colorIndex]);
      material.emissive.setHex(colors[colorIndex]);
    }
    
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
}

function initBox3() {
  const container = document.getElementById('box3');
  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 2.5;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0.1);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.ConeGeometry(0.8, 1.5, 4);
  
  const textureLoader = new THREE.TextureLoader();
  let material = new THREE.MeshPhongMaterial({
    color: 0x438c5c,
    shininess: 100
  });
  
  textureLoader.load('/assets/eye.png', (texture) => {
    texture.repeat.set(2, 2);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    material.map = texture;
    material.needsUpdate = true;
  });
  
  const pyramid = new THREE.Mesh(geometry, material);
  scene.add(pyramid);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  function animate() {
    requestAnimationFrame(animate);
    pyramid.rotation.x += 0.005;
    pyramid.rotation.y += 0.01;
    pyramid.position.y = Math.sin(Date.now() * 0.001) * 0.3;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
}

window.addEventListener('load', () => {
  initBox1();
  initBox2();
  initBox3();
});
