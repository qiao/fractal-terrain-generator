var renderer, scene, camera,
    terrain, mesh,
    SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight,
    
    PI = Math.PI;

function init() {

    // set up camera
    camera = new THREE.PerspectiveCamera(45,                     
                              SCREEN_WIDTH / SCREEN_HEIGHT, 
                              1,
                              5000);
    camera.position.y = 400;

    // setup scene
    scene = new THREE.Scene();
    
    
    // setup renderer
    if (!Detector.webgl) {
        renderer = new THREE.CanvasRenderer();
    } else {
        renderer = new THREE.WebGLRenderer({ 
            clearColor: 0x000000, 
            clearAlpha: 1, 
            antialias: true 
        });
    }
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    // create graphic container and attach the renderer to it
    container = document.createElement("div");
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);
}

/*
function setupLights() {
    var ambient_light, main_light;

    ambient_light = new THREE.AmbientLight(0x555555);
    scene.add(ambient_light);

    main_light = new THREE.SpotLight(0xffffff);
    main_light.position.set(0, 1000, 1000);
    main_light.castShadow = true;
    scene.add(main_light);
}
*/


function getTerrainMesh(model, maxHeight) {
    var segLength, size, vertices, i, j;
    
    segLength = 20;
    size = (model.length - 1) * segLength;

    terrain = new THREE.Mesh(
        new THREE.PlaneGeometry(size, size, model.length - 1, model.length - 1),
        new THREE.MeshLambertMaterial({ 
            color: 0xaaaaaa, 
            wireframe: true,
            wireframeLinewidth: 1,
        })
    );
    terrain.rotation.x = -PI / 2;

    vertices = terrain.geometry.vertices;
    for (i = 0; i < model.length; ++i) {
        for (j = 0; j < model.length; ++j) {
            vertices[i * model.length + j].position.z = model[i][j] * maxHeight;
        }
    }

    return terrain;
}


// NOTE: Size must be power of 2
function drawTerrain(size, maxHeight, scale) {
    var mesh, vertices, model;

    model = generateTerrain(size);
    mesh = getTerrainMesh(model, maxHeight);
    mesh.scale = new THREE.Vector3(scale, scale, scale);

    scene.add(terrain);
}

function animate(update) {
    var timer = new Date().getTime() * 0.0001;
    camera.position.x = Math.cos(timer) * 800;
    camera.position.z = Math.sin(timer) * 800;
    camera.lookAt(scene.position);
    
    requestAnimationFrame(animate, 30);
    renderer.render(scene, camera);
}


function setTerrainModel(terrainModel) {
    var i, j;
}


window.onload = function () {


    init();
    //setupLights();
    drawTerrain(32, 200, 1.0);

    animate();
};
