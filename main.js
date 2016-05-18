var ocean;
var scene;
var camera;

init();
animate();

function init() {
  // Create scene
  scene = new THREE.Scene();
  window.addEventListener('resize', onWindowResize, false);
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
  light.position.set(60, 50, 50);
  scene.add(light);
  var ambientLight = new THREE.AmbientLight(0x111111);
  scene.add(ambientLight);

  // Add Objects
  var cubeGeometry = new THREE.CubeGeometry(100, 100, 100, 1, 1, 1);
  var cubeMaterial = new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture('images/allspark.jpg')
  });

  var face1 = [new THREE.Vector2(0.666, 0.5), new THREE.Vector2(1, 0.5), new THREE
    .Vector2(1, 0.75), new THREE.Vector2(0.666, 0.75)
  ];
  var face2 = [new THREE.Vector2(0.333, 0.75), new THREE.Vector2(0, 0.75), new THREE
    .Vector2(0, 0.501), new THREE.Vector2(0.333, 0.501)
  ];
  var face3 = [new THREE.Vector2(0.333, 0.75), new THREE.Vector2(0.333, 0.5),
    new THREE.Vector2(0.666, 0.5), new THREE.Vector2(0.666, 0.75)
  ];
  var face4 = [new THREE.Vector2(0.333, 0.25), new THREE.Vector2(0.333, 0), new THREE
    .Vector2(0.666, 0), new THREE.Vector2(0.666, 0.25)
  ];
  var face5 = [new THREE.Vector2(0.333, 0.5), new THREE.Vector2(0.333, 0.25),
    new THREE.Vector2(0.666, 0.25), new THREE.Vector2(0.666, 0.5)
  ];
  var face6 = [new THREE.Vector2(0.666, 0.75), new THREE.Vector2(0.666, 1), new THREE
    .Vector2(0.333, 1), new THREE.Vector2(0.333, 0.75)
  ];
  cubeGeometry.faceVertexUvs[0] = [];

  // Right
  cubeGeometry.faceVertexUvs[0][0] = [face1[0], face1[1], face1[3]];
  cubeGeometry.faceVertexUvs[0][1] = [face1[1], face1[2], face1[3]];

  // Left
  cubeGeometry.faceVertexUvs[0][2] = [face2[0], face2[1], face2[3]];
  cubeGeometry.faceVertexUvs[0][3] = [face2[1], face2[2], face2[3]];

  // Top
  cubeGeometry.faceVertexUvs[0][4] = [face3[0], face3[1], face3[3]];
  cubeGeometry.faceVertexUvs[0][5] = [face3[1], face3[2], face3[3]];

  // Bot
  cubeGeometry.faceVertexUvs[0][6] = [face4[0], face4[1], face4[3]];
  cubeGeometry.faceVertexUvs[0][7] = [face4[1], face4[2], face4[3]];

  // Front
  cubeGeometry.faceVertexUvs[0][8] = [face5[0], face5[1], face5[3]];
  cubeGeometry.faceVertexUvs[0][9] = [face5[1], face5[2], face5[3]];

  // Back
  cubeGeometry.faceVertexUvs[0][10] = [face6[0], face6[1], face6[3]];
  cubeGeometry.faceVertexUvs[0][11] = [face6[1], face6[2], face6[3]];


  cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(-100, 50, -50);
  scene.add(cube);

  var phongCubeMaterial = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('images/crate.jpg')
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

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
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
