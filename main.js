var ocean;
var scene;
var camera;

init();
animate();

function init() {
  // Create scene
  scene = new THREE.Scene();

  // Setup camera
  var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 45,
    ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
    NEAR = 0.1,
    FAR = 1000000;
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  // add the camera to the scene
  scene.add(camera);
  camera.position.set(450, 250, 800);
  camera.lookAt(scene.position);

  // Renderer
  renderer = true ? new THREE.WebGLRenderer({
    antialias: true
  }) : new THREE.CanvasRenderer();

  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

  // Generate container
  container = document.createElement('div');
  document.body.appendChild(container);
  container.appendChild(renderer.domElement);

  // Events

  // Mouse controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Stats
  stats = new Stats();
  container.appendChild(stats.domElement);

  // Lighting
  var directionalLight = new THREE.DirectionalLight(0xffff55, 1);
  directionalLight.position.set(-60, 30, 60);
  scene.add(directionalLight);
  var light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(100, 50, 50);
  scene.add(light);
  var ambientLight = new THREE.AmbientLight(0x111111);
  scene.add(ambientLight);

  // Add Objects
  var cubeGeometry = new THREE.CubeGeometry(100, 100, 100, 1, 1, 1);
  var cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0x8888ff
  });
  cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(-100, 50, -50);
  scene.add(cube);

  var phongCubeMaterial = new THREE.MeshPhongMaterial({
    ambient: 0x050505,
    color: 0x0033ff,
    specular: 0x555555,
    shininess: 90
  });
  phongCube = new THREE.Mesh(cubeGeometry, phongCubeMaterial);
  phongCube.position.set(100, 50, -50);
  scene.add(phongCube);

  loadOcean(renderer, camera, scene, directionalLight);
  loadSkyBox(scene);
  //initMap(scene);

  var axes = new THREE.AxisHelper(100);
  scene.add(axes);
}

function animate() {
  requestAnimationFrame(animate);
  render();
  update();
}

function update() {
  ocean.material.uniforms.time.value += 1.0 / 60.0;
  controls.update();
  stats.update();
}

function render() {
  ocean.render()
  renderer.render(scene, camera);
}

function loadOcean(renderer, camera, scene, directionalLight) {
  var waterNormals = new THREE.ImageUtils.loadTexture(
    'images/waternormals.jpg');
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  // Create the water effect
  ocean = new THREE.Water(renderer, camera, scene, {
    textureWidth: 256,
    textureHeight: 256,
    waterNormals: waterNormals,
    alpha: 1.0,
    sunDirection: directionalLight.position.normalize(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    betaVersion: 0,
    side: THREE.DoubleSide
  });
  var aMeshMirror = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(200000, 200000, 10, 10),
    ocean.material
  );
  aMeshMirror.add(ocean);
  aMeshMirror.rotation.x = -Math.PI * 0.5;

  scene.add(aMeshMirror);
}

function loadSkyBox(scene) {
  var aCubeMap = THREE.ImageUtils.loadTextureCube([
    'images/px.jpg',
    'images/nx.jpg',
    'images/py.jpg',
    'images/ny.jpg',
    'images/pz.jpg',
    'images/nz.jpg'
  ]);
  aCubeMap.format = THREE.RGBFormat;

  var aShader = THREE.ShaderLib['cube'];
  aShader.uniforms['tCube'].value = aCubeMap;

  var aSkyBoxMaterial = new THREE.ShaderMaterial({
    fragmentShader: aShader.fragmentShader,
    vertexShader: aShader.vertexShader,
    uniforms: aShader.uniforms,
    depthWrite: false,
    side: THREE.BackSide
  });

  var aSkybox = new THREE.Mesh(
    new THREE.BoxGeometry(210000, 210000, 210000),
    aSkyBoxMaterial
  );

  scene.add(aSkybox);
}
