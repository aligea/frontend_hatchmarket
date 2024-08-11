/** GameApp - Animations */
(function Animations($w) {
  "use strict";
  var $ = $w.jQuery;
  var rendererList = [];
  var anim = {
    res: $w.PIXI.loader.resources,
    run: function (callback) {
      var that = this;
      if (callback == 'function') {
        callback();
      }

    },
    incubator: function () {

      this.createIncubator(1);
      this.createIncubator(2);
      this.createIncubator(3);
      this.createIncubator(4);
      this.createIncubator(5);

    },
    cloud: function () {
      var _this = this;
      $.each($('.islandAnimation'), function () {
        _this.createCloud({
          cloudHolder: $(this).attr('id'),
          perc: 1,
          posX: 0,
          posY: 0,
          timeScale: 1
        });
      });
    },
    wave: function () {
      var _this = this;
      $.each($('.islandWave'), function (key, value) {
        _this.createWave(value.id);
      });
    },
    createIncubator: function (id) {
      //-- inject this to increase preformance, if player have incubator, dont render animation
      //console.log($('#incubator-lv-' + id + '-wrapper').attr('is-available'));
      if ($('#incubator-lv-' + id + '-wrapper').hasClass('true')) {
        var img = '<img class="fill" src="animation/incubators/assets/Lv.' + id + '.png" />';
        $('#incubator-lv-' + id + '-wrapper').html(img);
        //console.log('not create incuator ' + id);
        return;
      };

      var rendererOptions = {
        antialiasing: false,
        transparent: true,
        resolution: window.devicePixelRatio,
        autoResize: true,
      }


      var incubatorTagHolder = $('#incubator-lv-' + id + '-wrapper');
      var gameWidth = $(incubatorTagHolder).width();
      var gameHeight = $(incubatorTagHolder).height();

      var renderer = new PIXI.autoDetectRenderer(gameWidth, gameHeight, rendererOptions);
      $(incubatorTagHolder).html(renderer.view);
      renderer.plugins.interaction.destroy();
      rendererList.push(renderer);

      // create the root of the scene graph
      var stage = new PIXI.Container();
      //console.log(this.res['Incubator_1']);

      // instantiate the spine animation
      var spineData = this.res['Incubator_' + id].spineData;
      var incubator1 = new PIXI.spine.Spine(spineData);
      incubator1.skeleton.setToSetupPose();
      incubator1.update(0);
      incubator1.autoUpdate = true;

      // create a container for the spine animation and add the animation to it
      var incubatorWrapper = new PIXI.Container();
      incubatorWrapper.addChild(incubator1);

      // measure the spine animation and position it inside its container to align it to the origin
      var localRect = incubator1.getLocalBounds();
      incubator1.position.set(-localRect.x, -localRect.y);

      // now we can scale, position and rotate the container as any other display object
      //var scale = Math.min((renderer.width * 0.7) / incubatorWrapper.width, (renderer.height * 0.7) / incubatorWrapper.height);
      var scale = Math.min((renderer.width) / incubatorWrapper.width, (renderer.height) / incubatorWrapper.height);
      scale = scale / window.devicePixelRatio;
      incubatorWrapper.scale.set(scale, scale);
      //incubatorWrapper.position.set((renderer.width - incubatorWrapper.width) * 0.5, (renderer.height - incubatorWrapper.height) * 0.5);

      // add the container to the stage
      stage.addChild(incubatorWrapper);

      // once position and scaled, set the animation to play
      incubator1.state.setAnimation(0, 'animation', true);
      incubator1.state.timeScale = 0.5;
      //incubator1.state.timeScale = Math.random();

      animate();
      renderer.plugins.interaction.destroy();

      function animate() {
        if ($w.GameApp.Animations.isStop) {
          return;
        }
        requestAnimationFrame(animate);


        // update the spine animation, only needed if dragon.autoupdate is set to false
        //incubator1.update(0.01666666666667); // HARDCODED FRAMERATE!
        renderer.render(stage);
      }

      //var intervalId = window.setInterval(function () {
      //    renderer.render(stage);
      //}, 1000 / 60);
      // MyAnimations.rendererList.push(renderer);
      //MyAnimations.stageList.push(stage);
    },
    createCloud: function (cloudParams) {
      var rendererOptions = {
        antialiasing: false,
        transparent: true,
        resolution: window.devicePixelRatio,
        autoResize: true,
      }

      var cloudHolder = $w.document.getElementById(cloudParams.cloudHolder);
      var gameWidth = $(cloudHolder).width();
      var gameHeight = $(cloudHolder).height();

      //var parent = document.getElementById('islandView');
      //var topPercent = parent.offsetHeight * 10 / 100;
      //console.log(cloudHolder.offsetTop, topPercent);

      var renderer = new PIXI.autoDetectRenderer(gameWidth, gameHeight, rendererOptions, true);
      cloudHolder.appendChild(renderer.view);
      renderer.plugins.interaction.destroy();
      rendererList.push(renderer);


      // create the root of the scene graph
      var stage = new PIXI.Container();

      // instantiate the spine animation
      var spineData = this.res.cloudSkeleton.spineData;
      //var spineData = this.res[cloudParams.cloudHolder].spineData;

      var cloud = new PIXI.spine.Spine(spineData);

      cloud.skeleton.setToSetupPose();
      cloud.update(0);
      cloud.autoUpdate = true;

      // once position and scaled, set the animation to play
      cloud.state.setAnimation(0, cloudHolder.getAttribute('cloudtype'), true);
      cloud.state.timeScale = 2;

      // measure the spine animation and position it inside its container to align it to the origin
      var localRect = cloud.getLocalBounds();
      cloud.position.y = -localRect.y + cloudParams.posY;
      cloud.position.x = -localRect.x + cloudParams.posX;

      // create a container for the spine animation and add the animation to it
      var cloudContainer = new PIXI.Container();
      cloudContainer.addChild(cloud);

      // now we can scale, position and rotate the container as any other display object
      //var scale = Math.min((renderer.width * 0.7) / incubatorWrapper.width, (renderer.height * 0.7) / incubatorWrapper.height);
      var scale = Math.min((renderer.width) / cloudContainer.width, (renderer.height) / cloudContainer.height);
      scale = scale / window.devicePixelRatio;
      cloudContainer.scale.set(scale, scale);

      // add the container to the stage
      stage.addChild(cloudContainer);

      animate();
      renderer.plugins.interaction.destroy();

      function animate() {
        if ($w.GameApp.Animations.isStop) {
          return;
        }
        //requestAnimationFrame(animate);
        renderer.render(stage);
      }

      //var intervalId = window.setInterval(function () {
      //    renderer.render(stage);
      //}, 1000 / 60);
      //console.log(intervalId);
    },
    createWave: function (waveId) {
      var rendererOptions = {
        antialiasing: false,
        transparent: true,
        resolution: window.devicePixelRatio,
        autoResize: true,
      }

      var waveHolder = document.getElementById(waveId);
      var gameWidth = $(waveHolder).width();
      var gameHeight = $(waveHolder).height();

      var renderer = new PIXI.autoDetectRenderer(gameWidth, gameHeight, rendererOptions, true);
      waveHolder.appendChild(renderer.view);
      renderer.plugins.interaction.destroy();
      rendererList.push(renderer);


      // create the root of the scene graph
      var stage = new PIXI.Container();

      // instantiate the spine animation
      var spineData = this.res.waveSkeleton.spineData;
      var wave = new PIXI.spine.Spine(spineData);

      wave.skeleton.setToSetupPose();
      wave.update(0);
      wave.autoUpdate = true;

      // once position and scaled, set the animation to play
      wave.state.setAnimation(0, 'animation', true);
      wave.state.timeScale = 2;

      // measure the spine animation and position it inside its container to align it to the origin
      var localRect = wave.getLocalBounds();
      wave.position.y = -localRect.y;
      wave.position.x = -localRect.x;

      // create a container for the spine animation and add the animation to it
      var waveContainer = new PIXI.Container();
      waveContainer.addChild(wave);

      // now we can scale, position and rotate the container as any other display object
      //var scale = Math.min((renderer.width * 0.7) / incubatorWrapper.width, (renderer.height * 0.7) / incubatorWrapper.height);
      var scale = Math.min((renderer.width) / waveContainer.width, (renderer.height) / waveContainer.height);
      scale = scale / window.devicePixelRatio;
      waveContainer.scale.set(scale, scale);

      // add the container to the stage
      stage.addChild(waveContainer);
      renderer.plugins.interaction.destroy();
      animate();

      function animate() {
        if ($w.GameApp.Animations.isStop) {
          return;
        }
        //requestAnimationFrame(animate);
        renderer.render(stage);
      }
      //var intervalId = window.setInterval(function () {
      //    renderer.render(stage);
      //}, 1000 / 60);
      //console.log(intervalId);
    }
  };

  function clearRenderer() {
    for (var idx = 0; idx < rendererList.length; idx++) {
      var rn = rendererList[idx];
      rn.destroy();
      rendererList.splice(idx, 1);
      rn = null;
    }

  }

  anim.isStop = false;
  anim.stop = function () {
    this.isStop = true;
    clearRenderer();
    (function clearCloud() {
      $.each($('.islandAnimation canvas'), function (key, value) {
        $(value).remove();
      });
    })();
    (function clearWave() {
      $.each($('.islandWave canvas'), function (key, value) {
        $(value).remove();
      });
    })();
    (function clearWave() {
      $.each($('.incubators canvas'), function (key, value) {
        $(value).remove();
      });
    })();


  };
  anim.reload = function (callbackFunction) {
    this.res = $w.PIXI.loader.resources;
    this.isStop = false;

    this.wave();
    this.cloud();
    this.incubator();

    callbackFunction();
  };

  $w.GameApp.Animations = anim;
})(this);