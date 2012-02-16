Random fractal terrain generator
================================

Online demo: http://qiao.github.com/fractal-terrain-generator/demo/

![](http://qiao.github.com/fractal-terrain-generator/screenshot.png)

This program is based on the Diamond-Square algorithm.  
You may check out http://gameprogrammer.com/fractal.html for a detailed description.

Usage
-----

Download http://qiao.github.com/fractal-terrain-generator/lib/terrain.js and include it in your html.

```html
<script type="text/javascript" src="./terrain.js"></script>
```

Then, in your script:

```js
var terrain = generateTerrain(32, 32, 1.0);
```

`generateTerrain` receives three parameters:

* `width`: width of the terrain.
* `height`: height of the terrain.
* `smoothness`: smoothness of the terrain. Higher this value, smoother the terrain. default value is 1.

The result `terrain` will be a (width + 1) &times; (height + 1) two-dimensional array containing the elevation of each vertex.

License
-------

[MIT License](http://www.opensource.org/licenses/mit-license.php)

&copy; 2011-2012 Xueqiao Xu &lt;xueqiaoxu@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
