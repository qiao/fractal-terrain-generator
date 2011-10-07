var renderer, scene, camera,
    terrain,
    SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight,
    
    PI = Math.PI;

function init() {

    // set up camera
    camera = new THREE.PerspectiveCamera(45,                     
                              SCREEN_WIDTH / SCREEN_HEIGHT, 
                              1,
                              5000);
    camera.position.set(500, 100, 400);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.translate(100, new THREE.Vector3(0, 1, 0));

    // setup scene
    scene = new THREE.Scene();
    
    // setup renderer
    renderer = new THREE.WebGLRenderer({ 
        clearColor: 0x000000, 
        clearAlpha: 1, 
        antialias: true 
    });
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

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


function getTerrainMesh(params) {
    var size = params.size || 500,
        numSegs = params.numSegs || 25;

    terrain = new THREE.Mesh(
        new THREE.PlaneGeometry(size, size, size / numSegs, size / numSegs),
        new THREE.MeshLambertMaterial({ 
            color: 0xaaaaaa, 
            wireframe: true,
            wireframeLinewidth: 1,
        })
    );
    terrain.rotation.x = -PI / 2;
    return terrain;
}


function animate(update) {
    // continue the animation if there are branches not drawn
    requestAnimationFrame(animate, 30);
    renderer.clear();
    renderer.render(scene, camera);
}


function setTerrainModel(terrainModel) {
    var i, j;
    window.vertices = vertices;
}

window.onload = function () {

    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
        return;
    }

    init();

    setupLights();



    var i, j;

    mesh = getTerrainMesh({
        size: 640,
        numSegs: 20,
    });
    vertices = terrain.geometry.vertices;

    terrainModel = generateTerrain(5);
    window.terrainModel = terrainModel;
    for (i = 0; i < terrainModel.length; ++i) {
        for (j = 0; j < terrainModel.length; ++j) {
            vertices[i * terrainModel.length + j].position.z = terrainModel[i][j] * 200;
        }
    }

    scene.add(terrain);

    animate();
};
