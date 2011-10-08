var renderer, scene, camera,
    PI = Math.PI;

function init() {
    var $container = $("#container"),
        width = $container.width(),
        height = $container.height();

    // set up camera
    camera = new THREE.PerspectiveCamera(45,                     
                              width / height, 
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
    renderer.setSize(width, height);
    
    renderer.shadowCameraNear = 3;
    renderer.shadowCameraFar = camera.far;
    renderer.shadowCameraFov = 50;

    renderer.shadowMapBias = 0.0039;
    renderer.shadowMapDarkness = 0.5;

    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;


    // create graphic container and attach the renderer to it
    $container.append(renderer.domElement);
}

function setupLights() {
    var ambientLight, mainLight, auxLight;
    ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    mainLight = new THREE.SpotLight(0xffffff, 0.5);
    mainLight.position.set(500, 500, 500);
    mainLight.castShadow = true;
    scene.add(mainLight);

    auxLight = new THREE.SpotLight(0xffffff, 0.3);
    auxLight.position.set(-500, 500, -500);
    auxLight.castShadow = true;
    scene.add(auxLight);
}


function getTerrainMesh(model, maxHeight) {
    var segLength, size, vertices, i, j;
    
    segLength = 20;
    size = (model.length - 1) * segLength;

    terrain = new THREE.Mesh(
        new THREE.PlaneGeometry(size, size, model.length - 1, model.length - 1),
        new THREE.MeshLambertMaterial({ 
            color: 0x333333, 
            wireframe: false,
        })
    );
    terrain.rotation.x = -PI / 2;
    terrain.castShadow = true;
    terrain.receiveShadow = true;

    vertices = terrain.geometry.vertices;
    for (i = 0; i < model.length; ++i) {
        for (j = 0; j < model.length; ++j) {
            vertices[i * model.length + j].position.z = model[i][j] * maxHeight;
        }
    }

    return terrain;
}


// NOTE: Size must be power of 2
function drawTerrain(width, height, smoothness, maxHeight, scale) {
    var mesh, vertices, model;

    model = generateTerrain(width, height, smoothness);
    mesh = getTerrainMesh(model, maxHeight);
    mesh.scale = new THREE.Vector3(scale, scale, scale);

    scene.add(terrain);
}

function getOptimalScale(terrainSize) {
    return 30 / terrainSize;
}

function getOptimalHeight(terrainSize) {
    return terrainSize / 32 * 200;
}

function animate(interval) {
    var timer = new Date().getTime() * 0.0001;
    camera.position.x = Math.cos(timer) * 800;
    camera.position.z = Math.sin(timer) * 800;
    camera.lookAt(scene.position);
    
    requestAnimationFrame(animate, interval);
    renderer.render(scene, camera);
}


function drawCoordinate(center, length) {
    var othorgonals = [
        [new THREE.Vector3(length, 0, 0), 0xff0000],
        [new THREE.Vector3(0, length, 0), 0x00ff00],
        [new THREE.Vector3(0, 0, length), 0x0000ff]
    ];

    for (var i = 0; i < othorgonals.length; ++i) {
        var v = othorgonals[i][0],
            color = othorgonals[i][1];

        var geometry = new THREE.Geometry();

        geometry.vertices.push(new THREE.Vertex(center));
        geometry.vertices.push(new THREE.Vertex(center.clone().addSelf(v)));

        var line = new THREE.Line(
            geometry, 

            new THREE.LineBasicMaterial({
                color: color, 
                opacity: 1, 
                linewidth: 3
            })
        );

        scene.add(line);
    }
}




$(function() {
    init();
    setupLights();

    drawCoordinate(new THREE.Vector3(0, 0, 0), 300);

    var terrainWidth = 64,
        terrainHeight = 64,
        smoothness = 1,
        maxHeight = getOptimalHeight(Math.max(terrainWidth, terrainHeight)),
        scale = getOptimalScale(Math.max(terrainWidth, terrainHeight));

    drawTerrain(terrainWidth, terrainHeight, smoothness, maxHeight, scale);

    animate(30);
});
