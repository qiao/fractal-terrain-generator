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
            clearColor: 0x222222,
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
    auxLight.position.set(-300, 500, -400);
    auxLight.castShadow = true;
    scene.add(auxLight);
}


function getTerrainMesh(model, maxHeight) {
    var modelWidth, modelHeight, segLength, 
        size, vertices, texture, i, j;
    
    modelWidth = model[0].length - 1; 
    modelHeight = model.length - 1;

    segLength = getOptimalSegLength(Math.max(modelWidth, modelHeight));

    height = (model.length - 1) * segLength;
    width = (model[0].length - 1) * segLength;

    texture = getTexture(model, width, height);

    mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height, model.length - 1, model.length - 1),
        //new THREE.MeshBasicMaterial({
            //map: texture
        //})
        new THREE.MeshLambertMaterial({ 
            color: 0x777777, 
            wireframe: true,
        })
    );
    mesh.rotation.x = -PI / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    vertices = mesh.geometry.vertices;
    for (i = 0; i < model.length; ++i) {
        for (j = 0; j < model.length; ++j) {
            vertices[i * model.length + j].position.z = model[i][j] * maxHeight;
        }
    }

    return mesh;
}


// TODO: use bitmap textures and texture blending
function getTexture(model, width, height) {
    var canvas, context, 
        modelWidth, modelHeight,
        ratio,
        texture, imageData, pixels, 
        rgba,
        i, j, y, x, yy, xx;

    modelWidth = model[0].length - 1;
    modelHeight = model.length;

    ratio = width / modelWidth;

    // generate canvas
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    console.log(width / modelWidth)

    // get context
    context = canvas.getContext('2d');

    // coloring context according to height
    imageData = context.getImageData(0, 0, width, height);
    pixels = imageData.data;
    i = 0;
    xx = yy = 0;
    for (y = 0; y < height; ++y) {
        for (x = 0; x < width; ++x) {
            yy = ~~(y / ratio);
            xx = ~~(x / ratio);
            rgba = elevation2RGBA(model[yy][xx]);
            pixels[i++] = rgba[0];
            pixels[i++] = rgba[1];
            pixels[i++] = rgba[2];
            pixels[i++] = rgba[3];
        }
    }
    context.putImageData(imageData, 0, 0);

    texture = new THREE.Texture(
        canvas,
        new THREE.UVMapping(), 
        THREE.ClampToEdgeWrapping, 
        THREE.ClampToEdgeWrapping 
    );
    texture.needsUpdate = true;

    return texture;
}


function elevation2RGBA(elevation) {
    if (elevation > 0.5) {
        return [255, 255, 255, 255];
    } else if (elevation > 0){
        return [104, 53, 20, 255]; // brown
    } else {
        return [58, 131, 21, 255]; // green
    }
}


function drawTerrain(width, height, smoothness, maxHeight) {
    var mesh, vertices, model;

    model = generateTerrain(width, height, smoothness);
    mesh = getTerrainMesh(model, maxHeight);

    scene.add(mesh);
}

function getOptimalSegLength(terrainSize) {
    console.log(~~(600 / terrainSize));
    return ~~(600 / terrainSize);
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

    //drawCoordinate(new THREE.Vector3(0, 0, 0), 300);

    var terrainWidth = 64,
        terrainHeight = 64,
        smoothness = 1,
        maxHeight = 200;

    drawTerrain(terrainWidth, terrainHeight, smoothness, maxHeight);

    animate(30);
});
