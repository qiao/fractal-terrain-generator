var renderer, scene, camera,
    SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight,
    
    PI = Math.PI;

function init() {

    // set up camera
    camera = new THREE.OrthographicCamera(45,                     
                              SCREEN_WIDTH / SCREEN_HEIGHT, 
                              1,
                              5000);
    camera.position.set(500, 100, 400);
    camera.translate(200, new THREE.Vector3(0, 1, 0));

    // setup scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 500, 1500);

    // setup renderer
    renderer = new THREE.WebGLRenderer({ 
        clearColor: 0x000000, 
        clearAlpha: 1, 
        antialias: true 
    });
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    renderer.setClearColor(scene.fog.color, 1);
    renderer.autoClear = false;

    renderer.shadowCameraNear = 3;
    renderer.shadowCameraFar = camera.far;
    renderer.shadowCameraFov = 50;

    renderer.shadowMapBias = 0.0039;
    renderer.shadowMapDarkness = 0.5;

    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;

    // create graphic container and attach the renderer to it
    container = document.createElement("div");
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);
}

function setupLights() {
    var ambient_light, main_light;

    ambient_light = new THREE.AmbientLight(0x555555);
    scene.add(ambient_light);

    main_light = new THREE.SpotLight(0xffffff);
    main_light.position.set(0, 1000, 1000);
    main_light.castShadow = true;
    scene.add(main_light);
}


function drawGround() {
    var ground = new THREE.Mesh(
        new THREE.PlaneGeometry(500, 500),
        new THREE.MeshLambertMaterial({ color: 0x777777, wireframe: true })
    );
    ground.rotation.x = - PI / 2;
    ground.scale.set(100, 100, 100);

    ground.castShadow = false;
    ground.receiveShadow = true;

    scene.add(ground);
}


function animate(update) {
    // continue the animation if there are branches not drawn
    requestAnimationFrame(animate);
    renderer.clear();
    renderer.render(scene, camera);
}


window.onload = function () {

    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
        return;
    }

    init();

    setupLights();
    drawGround();
    animate();
};
