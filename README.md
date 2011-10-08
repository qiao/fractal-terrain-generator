Random fractal terrain generator
================================

online demo: http://qiao.github.com/fractal-terrain-generator/demo/

This program is based on the Diamond-Square algorithm. Check out http://gameprogrammer.com/fractal.html for a detailed description.

## Usage ##

```javascript
var terrain = generateTerrain(32, 1.0);
```

`generateTerrain` receives two parameters:

* `size`: The number of segments for each side of the terrain. The value MUST be a power of 2.
* `smoothness`: Smoothness of the terrain. Higher this value, smoother the terrain will be. Recommended value is 1.

The result `terrain` will be a (size + 1) x (size + 1) square matrix containing the heights of each vertex. And each height will be between 0 and 1.
