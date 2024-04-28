import * as dat from "dat.gui";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

camera.position.set(-10, 30, 30);
orbit.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00aa00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xaaaaaa,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshBasicMaterial({
  color: 0x00aa00,
  wireframe: true,
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
plane2.position.set(10, 10, 15);
scene.add(plane2);

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x0aa0000,
  wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;
const sphereId = sphere.id;

const sphere2Geometry = new THREE.SphereGeometry(4);

const vShader = `
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fShader = `
    void main() {
        gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
    }
`;

const sphere2Material = new THREE.ShaderMaterial({
  vertexShader: vShader,
  fragmentShader: fShader,
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(dLightShadowHelper);

const spotlight = new THREE.SpotLight(0xffffff, 12000);
scene.add(spotlight);
spotlight.position.set(-100, 100, 0);
spotlight.castShadow = true;
spotlight.angle = 0.2;

const sLightHelper = new THREE.SpotLightHelper(spotlight);
scene.add(sLightHelper);

// scene.fog = new THREE.Fog(0xffffff, 0, 200);
// scene.fog = new THREE.FogExp2(0xffffff, 0.01);

// renderer.setClearColor(0x000033);
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader
  .setPath("assets/")
  .load([
    "nebula.jpg",
    "nebula.jpg",
    "stars.jpg",
    "stars.jpg",
    "stars.jpg",
    "stars.jpg",
  ]);
// scene.background = textureLoader.setPath("assets/").load("nebula.jpg");

const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({
  //   map: textureLoader.load("./assets/nebula.jpg"),
});
const box2MultiMaterial = [
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("./assets/nebula.jpg"),
  }),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("./assets/nebula.jpg"),
  }),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("./assets/stars.jpg"),
  }),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("./assets/stars.jpg"),
  }),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("./assets/stars.jpg"),
  }),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("./assets/stars.jpg"),
  }),
];
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
scene.add(box2);
box2.position.set(0, 5, 10);
// box2.material.map = textureLoader.load("./assets/nebula.jpg");
box2.name = "The Box";

const gui = new dat.GUI();

const options = {
  sphereColor: "#ffea00",
  wireframe: false,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0,
  intensity: 10000,
};

gui.addColor(options, "sphereColor").onChange((e) => {
  sphere.material.color.set(e);
});

gui.add(options, "wireframe").onChange((e) => {
  sphere.material.wireframe = e;
});

gui.add(options, "speed", 0, 0.1);

gui.add(options, "angle", 0, 1);
gui.add(options, "penumbra", 0, 1);
gui.add(options, "intensity", 0, 20000);

let step = 0;

const gltfLoader = new GLTFLoader();

gltfLoader.load(
  "./assets/dva/scene.gltf",
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    model.scale(2, 1);
  },
  undefined,
  (err) => {
    console.log(err);
  }
);

const mousePosition = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();

function animate(time) {
  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;

  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));

  spotlight.angle = options.angle;
  spotlight.penumbra = options.penumbra;
  spotlight.intensity = options.intensity;
  sLightHelper.update();

  rayCaster.setFromCamera(mousePosition, camera);
  const intersects = rayCaster.intersectObjects(scene.children);

  for (let intersect of intersects) {
    if (intersect.object.id === sphereId) {
      intersect.object.material.color.set(0xff0000);
    }

    if (intersect.object.id === box2.id) {
      console.log("touched box");
      box2.rotation.x = time / 1000;
      box2.rotation.y = time / 1000;
    }
  }

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
