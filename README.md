Random fractal terrain generator
================================

online demo: http://qiao.github.com/fractal-terrain-generator/demo/

This program is based on the Diamond-Square algorithm. Check out http://gameprogrammer.com/fractal.html for a detailed description.

## Usage ##

```javascript
var terrain = generateTerrain(32, 32, 1.0);
```

`generateTerrain` receives three parameters:

* `width`: Segments of the width of the terrain.
* `height`: Segments of the height of the terrain.
* `smoothness`: Smoothness of the terrain. Higher this value, smoother the terrain will be. Recommended value is 1.

The result `terrain` will be a (width + 1) x (height + 1) 2-dimensional array containing the elevations of each vertex. And each elevation will be between -1 and 1.
