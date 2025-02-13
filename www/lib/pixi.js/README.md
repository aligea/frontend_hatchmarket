Pixi.js — A 2D JavaScript Renderer
=============

![pixi.js logo](http://www.goodboydigital.com/pixijs/pixiV4_wide_full.jpg)




[![Inline docs](http://inch-ci.org/github/GoodBoyDigital/pixi.js.svg?branch=dev)](http://inch-ci.org/github/GoodBoyDigital/pixi.js)
[![Build Status](https://travis-ci.org/pixijs/pixi.js.svg?branch=dev)](https://travis-ci.org/pixijs/pixi.js)

The aim of this project is to provide a fast lightweight 2D library that works
across all devices. The Pixi renderer allows everyone to enjoy the power of
hardware acceleration without prior knowledge of WebGL. Also, it's fast. Really fast.

If you want to keep up to date with the latest pixi.js news then feel free to follow us on twitter
([@doormat23](https://twitter.com/doormat23), and [@rolnaaba](https://twitter.com/rolnaaba))
and we will keep you posted! You can also check back on [our site](http://www.goodboydigital.com/blog)
as any breakthroughs will be posted up there too!

**Your support helps us make Pixi.js even better. Make your pledge on [Patreon](https://www.patreon.com/user?u=2384552&ty=h&u=2384552) and we'll love you forever!**

[![gallery](http://www.pixijs.com/wp-content/uploads/2013/05/headerPanel_projects-898x342.jpg)](http://www.pixijs.com/gallery/)

### What to Use Pixi.js for and When to Use It

Pixi.js is a rendering library that will allow you to create rich, interactive graphics, cross platform applications, and games without having to dive into the WebGL API or deal with browser and device compatibility.

Pixi.js has full [WebGL](https://en.wikipedia.org/wiki/WebGL) support and seamlessly falls back to HTML5's [canvas](https://en.wikipedia.org/wiki/Canvas_element) if needed. As a framework, Pixi.js is a fantastic tool for authoring interactive content, *especially with the move away from Adobe Flash in recent years*. Use it for your graphics rich, interactive websites, applications, and HTML5 games.  Out of the box cross-platform compatibility and graceful degredation mean you have less work to do and have more fun doing it! If you want to create polished and refined experiences relatively quickly, without delving into dense, low level code, all while avoiding the headaches of browser inconsistencies, then sprinkle your next project with some Pixi.js magic!

**Boost your development and feel free to use your imagination!**

### Installation ###

Pixi.js can be installed with [Bower](https://bower.io/#getting-started), [NPM](https://docs.npmjs.com/getting-started/what-is-npm) or simply using a content delivery network (CDN) URL to embed Pixi.js directly on your HTML page. 

#### Bower Install

```
$> bower install pixi.js
```

#### NPM Install

```
$> npm install pixi.js
```

#### CDN Install (via cdnjs)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.0.0/pixi.min.js"></script>
```

_Note: `4.0.0` can be replaced by any [released](https://github.com/pixijs/pixi.js/releases) version._


### Demos ###

- [WebGL Filters!](http://www.goodboydigital.com/pixijs/examples/15/indexAll.html)
- [Run pixie run](http://www.goodboydigital.com/runpixierun)
- [Fight for Everyone](http://www.goodboydigital.com/casestudies/fightforeveryone)
- [Flash vs HTML](http://flashvhtml.com)
- [Bunny Demo](http://www.goodboydigital.com/pixijs/bunnymark)
- [Storm Brewing](http://www.goodboydigital.com/pixijs/storm)
- [Filters Demo](http://www.goodboydigital.com/pixijs/examples/15/indexAll.html)
- [Render Texture Demo](http://www.goodboydigital.com/pixijs/examples/11)
- [Primitives Demo](http://www.goodboydigital.com/pixijs/examples/13)
- [Masking Demo](http://www.goodboydigital.com/pixijs/examples/14)
- [Interaction Demo](http://www.goodboydigital.com/pixijs/examples/6)
- [photonstorm's Balls Demo](http://gametest.mobi/pixi/balls)
- [photonstorm's Morph Demo](http://gametest.mobi/pixi/morph)

Thanks to [@photonstorm](https://twitter.com/photonstorm) for providing
those last 2 examples and allowing us to share the source code :)

### Resources ###

- Learning Pixi - a brilliant guide [here](https://github.com/kittykatattack/learningPixi)
- API Documentation is [here](http://pixijs.github.io/docs).
- Feature Examples are [here](https://pixijs.github.io/examples).
- The Pixi.js Forum is [here](http://www.html5gamedevs.com/forum/15-pixijs).
- Other misc tutorials and resources are [on the Wiki](https://github.com/pixijs/pixi.js/wiki/Resources).

### Contribute ###

Want to be part of the pixi.js project? Great! All are welcome! We will get there quicker
together :) Whether you find a bug, have a great feature request or you fancy owning a task
from the road map above feel free to get in touch.

Make sure to read the [Contributing Guide](https://github.com/pixijs/pixi.js/blob/master/CONTRIBUTING.md)
before submitting changes.

### Current features ###

- WebGL renderer (with automatic smart batching allowing for REALLY fast performance)
- Canvas renderer (Fastest in town!)
- Full scene graph
- Super easy to use API (similar to the flash display list API)
- Support for texture atlases
- Asset loader / sprite sheet loader
- Auto-detect which renderer should be used
- Full Mouse and Multi-touch Interaction
- Text
- BitmapFont text
- Multiline Text
- Render Texture
- Primitive Drawing
- Masking
- Filters
- [User Plugins](https://github.com/pixijs/pixi.js/wiki/Pixi-v3-Plugins)

### Basic Usage Example ###

```js
// You can use either `new PIXI.WebGLRenderer`, `new PIXI.CanvasRenderer`, or `PIXI.autoDetectRenderer`
// which will try to choose the best renderer for the environment you are in.
var renderer = new PIXI.WebGLRenderer(800, 600);

// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view);

// You need to create a root container that will hold the scene you want to draw.
var stage = new PIXI.Container();

// Declare a global variable for our sprite so that the animate function can access it.
var bunny = null;

// load the texture we need
PIXI.loader.add('bunny', 'bunny.png').load(function (loader, resources) {
    // This creates a texture from a 'bunny.png' image.
    bunny = new PIXI.Sprite(resources.bunny.texture);

    // Setup the position and scale of the bunny
    bunny.position.x = 400;
    bunny.position.y = 300;

    bunny.scale.x = 2;
    bunny.scale.y = 2;

    // Add the bunny to the scene we are building.
    stage.addChild(bunny);

    // kick off the animation loop (defined below)
    animate();
});

function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);

    // each frame we spin the bunny around a bit
    bunny.rotation += 0.01;

    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(stage);
}
```

### How to build ###

Note that for most users you don't need to build this project. If all you want is to use pixi, then
just download one of our [prebuilt releases](https://github.com/pixijs/pixi.js/releases). Really
the only time you should need to build pixi.js is if you are developing it.

If you don't already have Node.js and NPM, go install them. Then, in the folder where you have cloned 
the repository, install the build dependencies using npm:

```
$> npm install
```

Then, to build the source, run:

```
$> npm run build
```

This will create a minified version at `bin/pixi.min.js` and a non-minified version at `bin/pixi.js`
with all the plugins in the pixi.js project.

If there are specific plugins you don't want, say "interaction" or "extras", you can exclude those:

```
$> npm run build -- --exclude extras --exclude interaction
```

You can also use the short-form `-e`:

```
$> npm run build -- -e extras -e interaction -e filters
```

### How to generate the documentation ###

The docs can be generated using npm:

```
$> npm run docs
```

The documentation uses [Jaguar.js](https://github.com/davidshimjs/jaguarjs-jsdoc) and the jsdoc format, the configuration file can be found at [scripts/jsdoc.conf.json](scripts/jsdoc.conf.json)

### License ###

This content is released under the (http://opensource.org/licenses/MIT) MIT License.

[![Analytics](https://ga-beacon.appspot.com/UA-39213431-2/pixi.js/index)](https://github.com/igrigorik/ga-beacon)
