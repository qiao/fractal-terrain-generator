var RandomPool = (function() {

  var origRandom = Math.random;
  var pool       = [];
  var counter    = 0;

  function next() {
    var rand;
    if (counter >= pool.length) {
      rand = origRandom();
      pool.push(rand);
    } else {
      rand = pool[counter];
    }
    counter++;
    return rand;
  };

  function seek(index) {
    counter = Math.min(index, pool.length);
  }

  function reset() {
    counter = 0;
    pool = [];
  }

  function hook() {
    Math.random = next;
  }

  function unhook() {
    Math.random = origRandom;
  }

  return {
    next         : next,
    seek         : seek,
    reset        : reset,
    hook         : hook,
    unhook       : unhook
  };

})();


var TerrainModel = (function() {

  var model;

  function update(opts) {
    var size       = opts.size || 32;
    var smoothness = opts.smoothness || 1.0;
    var zScale     = opts.zScale || 200;

    model = generateTerrain(size, size, smoothness);
    updateZ(zScale);
  }

  function updateZ(z) {
    var width   = model[0].length;
    var height  = model.length;
    var terrain = [];

    var i, j;
    var row;
    for (i = 0; i < height; ++i) {
      row = [];
      for (j = 0; j < width; ++j) {
        row.push(model[i][j] * z);
      }
      terrain.push(row);
    }

    $.publish('terrain-update', [terrain])
  }

  return {
    update  : update,
    updateZ : updateZ
  };

})();

var TerrainView = (function() {

  var renderer;
  var scene;
  var camera;

  var mesh;

  function init(container) {

    var $container = $(container);
    var width = $container.width();
    var height = $container.height();
    var ratio = width / height;
    var near = 1;
    var far = 5000;
    var fov = 45;

    // setup scene
    scene = new THREE.Scene();

    // set up camera
    camera = new THREE.PerspectiveCamera(fov, ratio, near, far);
    camera.y = 400;
    
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

    setupLights();

    // create graphic container and attach the renderer to it
    $container.append(renderer.domElement);

  }


  function setupLights() {
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    var mainLight = new THREE.SpotLight(0xffffff, 1.0);
    mainLight.position.set(500, 500, 500);
    mainLight.castShadow = true;
    scene.add(mainLight);

    var auxLight = new THREE.SpotLight(0xffffff, 1.0);
    auxLight.position.set(-300, 500, -400);
    auxLight.castShadow = true;
    scene.add(auxLight);
  }

  function getTerrainMesh(model) {
    
    var modelWidth  = model[0].length - 1; 
    var modelHeight = model.length - 1;

    var segLength = getOptimalSegLength(modelWidth, modelHeight);

    var height = (model.length - 1) * segLength;
    var width  = (model[0].length - 1) * segLength;

    //var texture = getTexture(model, width, height);

    var mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height, model.length - 1, model.length - 1),
      //new THREE.MeshBasicMaterial({
      //map: texture
      //})
      new THREE.MeshLambertMaterial({ 
        color: 0x777777, 
        wireframe: true,
      })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    var vertices = mesh.geometry.vertices;
    for (var i = 0; i < model.length; ++i) {
      for (var j = 0; j < model.length; ++j) {
        vertices[i * model.length + j].z = model[i][j];
      }
    }

    return mesh;
  }

  
  function getOptimalSegLength(width, height) {
    return ~~(640 / Math.max(width, height));
  }


  /**
   * @param {THREE.Vector3} center
   * @param {number} length
   */
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

  // TODO: use bitmap textures and texture blending
  function getTexture(model, width, height) {

    var modelWidth = model[0].length - 1;
    var modelHeight = model.length;

    var ratio = width / modelWidth;

    // generate canvas
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    // get context
    var context = canvas.getContext('2d');

    // coloring context according to height
    var imageData = context.getImageData(0, 0, width, height);
    var pixels = imageData.data;
    var i = 0;
    var xx = 0;
    var yy = 0;
    var rgba;
    for (var y = 0; y < height; ++y) {
      for (var x = 0; x < width; ++x) {
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

  function update(evt, model) {
    scene.remove(mesh);
    mesh = getTerrainMesh(model);
    scene.add(mesh);
  }
  
  function animate(interval) {
    var timer = new Date().getTime() * 0.0001;
    camera.position.x = Math.cos(timer) * 800;
    camera.position.z = Math.sin(timer) * 800;
    camera.lookAt(scene.position);

    requestAnimationFrame(animate, interval);
    renderer.render(scene, camera);
  }

  return {
    init           : init,
    update         : update,
    animate        : animate,
    drawCoordinate : drawCoordinate
  };

})();

var TerrainController = (function() {


  var model = TerrainModel;
  var view  = TerrainView;

  function init() {
    // replace the builtin Math.random method with the one provided by RandomPool
    RandomPool.hook();

    initUI();
    animate();
    bindEvents();

    update();
  }

  function initUI() {
    // create slider for the size selector
    fdSlider.createSlider({
      inp:document.getElementById("opt-size"),
      animation:"tween",
      hideInput:true,
      callbacks: {
        change: [update]
      }
    }); 

    view.init('#container');
  }

  function animate() {
    view.animate(30);
  }

  function bindEvents() {
    $.subscribe('terrain-update', view.update);

    $('#new').on('click', function() { reset(); return false; });
    $('#opt-size').on('change', update);
    $('#opt-smoothness').on('change', update);
    $('#opt-z').on('change', updateZ);
  }

  function reset() {
    RandomPool.reset();
    update();
  }

  function update() {
    RandomPool.seek(0);
    var opts = {
      size       : $('#opt-size').val(),
      smoothness : $('#opt-smoothness').val(),
      zScale     : $('#opt-z').val()
    };
    model.update(opts);
  }

  function updateZ() {
    var zScale = $('#opt-z').val();
    model.updateZ(zScale);
  }

  return { init: init };

})();
