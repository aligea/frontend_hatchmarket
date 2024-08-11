/** GameApp - IslandEnviAnim */
(function IslandEnviAnim($w, PIXI, $) {
  'use strict';
  var _this = {};
  var gm = $w.GameApp;

  var renderer,
    stage,
    decorContainer,
    holderContainer,
    backgroundContainer;

  var _playerIsland = [],
    activeEnvi,
    resources = PIXI.loader.resources,
    myLoader = {},
    InventorySlotService = {},
    rendererOptions = {
      antialiasing: false,
      transparent: true,
      resolution: window.devicePixelRatio,
      autoResize: true
    },
    scopeEnvi = {},
    myPopup = {};

  var IslandServices = {};
  var aPopup = {};
  var _playerInfo = $w.izyObject('PlayerInfo').getOne();
  var AppService;

  function createCoundown() {
    var cData = scopeEnvi.charsInEnvi;
    for (var i = 0; i < cData.length; i++) {
      var countdown = $w.GameApp.getTimeRemaining(cData[i].lifeEnd);
      var countdownText = '2 days 07:02:01';

      countdownText = '<div>' + countdown.days + ' days </div><div>' + countdown.hours + ':' + countdown.minutes + ':' + countdown.seconds + '</div>';
      cData[i].lifespanCountdownText = countdownText;
    }

    //console.log('countdown');
  };

  function createEnvirontment(islandId, callbackFn) {
    _this.isStop = false;

    $w.gmLoading.show();

    scopeEnvi.island = $w.GameApp.IslandServices.getIsland(islandId);
    activeEnvi = scopeEnvi.island;
    _playerInfo = $w.izyObject('PlayerInfo').getOne();

    if (Number(_playerInfo.currentEnvirontment) < Number(activeEnvi.id)) {
      $w.GameApp.IslandEnviAnim.draggingMode.atUnAvailableIsland();
    } else {
      $w.GameApp.IslandEnviAnim.draggingMode.atAvailableIsland();
    }


    renderer = new $w.PIXI.autoDetectRenderer($w.innerWidth, $w.innerHeight, rendererOptions, true);
    $('#environtment-1').html(renderer.view);
    //renderer.plugins.interaction.destroy();

    // create the root of the scene graph
    stage = new PIXI.Container();
    decorContainer = new PIXI.Container();
    holderContainer = new PIXI.Container();
    backgroundContainer = new PIXI.Container();

    $w.GameApp.GameStage.setup(backgroundContainer, renderer, AppService);
    $w.GameApp.GameStage.run(activeEnvi.name);



    stage.addChild(backgroundContainer);



    //stage.addChild(decorContainer);
    //stage.addChild(holderContainer);


    function animate() {
      if (_this.isStop) return;

      $w.requestAnimationFrame(animate);
      renderer.render(stage);
    };

    animate();
    callbackFn();
    runLifespanCharsCountdown();
  };

  function runLifespanCharsCountdown() {
    scopeEnvi.charsInEnvi = $w.GameApp.CharServices.getEnviPlayerChar(activeEnvi.id);

    $w.removeEventListener('serverdatetick', createCoundown);
    $w.addEventListener('serverdatetick', createCoundown);
  };

  function stopLifespanCharCountDown() {
    $w.removeEventListener('serverdatetick', createCoundown);
  };

  _this.isStop = false;
  _this.setup = function ($ionicLoading, $ionicPopup, $scope, _AppService) {
    myPopup = $ionicPopup;
    myLoader = $ionicLoading;
    scopeEnvi = $scope;
    AppService = _AppService;
  };
  _this.draggingMode = {
    on: function () {
      $('#bottonMenu').hide();
      //$('#toggleLifetime').hide();
      $('#backtoHome').hide();
    },
    off: function () {
      $('#bottonMenu').show();
      //$('#toggleLifetime').show();
      $('#backtoHome').show();
    },
    atAvailableIsland: function () {
      $('#bottonMenu').show();
      //$('#toggleLifetime').show();
      $('#backtoHome').show();

      $w.document.getElementById('bottonMenu').style.visibility = 'visible';
      //$w.document.getElementById('toggleLifetime').style.visibility = 'visible';
      //console.log('atAvailableIsland');
    },
    atUnAvailableIsland: function () {
      $('#bottonMenu').hide();
      //$('#toggleLifetime').hide();
      $('#backtoHome').show();

      $w.document.getElementById('bottonMenu').style.visibility = 'hidden';
      //$w.document.getElementById('toggleLifetime').style.visibility = 'hidden';

      //console.log('atAvailableIsland');
    }
  };
  _this.openDetailEnvirontment = function (id) {
    scopeEnvi.island = $w.GameApp.IslandServices.getIsland(id);
    scopeEnvi.myPopup = myPopup.show({
      title: scopeEnvi.island.name,
      subTitle: scopeEnvi.island.description,
      templateUrl: 'templates/popup-detail-environtment.html',
      scope: scopeEnvi
    });
  };
  _this.enterEnvirontment = function (id) {
    $w.gmLoading.show({ duration: 3000 });


    // -- change sfx
    $('#gameLayout').fadeIn('fast');
    $('#appLayout').hide();
    var sfx = gm.Sounds.bgm2();
    gm.Sounds.bgm1().pause();
    sfx.play();


    function callback() {
      $w.enviLoading.show({
        template: $w.GameApp.IslandServices.getWelcomeTemplateIsland(activeEnvi),
        duration: 3000
      });
    };

    createEnvirontment(id, callback);

    // console.log($w.GameApp.IslandServices.getIsland(1));

    $w.GameApp.Animations.isStop = true;
    $w.GameApp.Animations.stop();
  };
  _this.leaveEnvirontment = function () {
    $('#appLayout').show();

    //$w.gmLoading.show({ duration: 3000 });
    myLoader.show({ duration: 3000 });
    scopeEnvi.reloadPlayerInfo();

    $w.GameApp.Animations.stop();
    $w.GameApp.Animations.isStop = false;
    $w.GameApp.Animations.reload(function () {
      $('#gameLayout').hide();
      $('map').imageMapResize();
    });

    $w.GameApp.StopWalkingProcess();

    stopLifespanCharCountDown();

    // -- change sfx
    $w.GameApp.Sounds.bgm2().pause();
    $w.GameApp.Sounds.bgm1().play();

    _this.destroyEnvirontment();
  };
  _this.PurchasingIsland = function (environtId) {
    var playerInfo = $w.izyObject('PlayerInfo').getOne();
    var islandToBuy = $w.GameApp.IslandServices.getIsland(environtId);

    function onReadyBuyIsland() {
      //-- update player info
      playerInfo.currentEnvirontment = islandToBuy.id;
      playerInfo.diamondBalance -= islandToBuy.price.value;
      playerInfo.maxPopulation = islandToBuy.population.value;
      $w.izyObject('PlayerInfo').store(playerInfo);

      $w.GameApp.IslandServices.loadIslandImage();
      //if ($w.document.getElementById('gameLayout').style.display != 'none') {
      //  $w.GameApp.IslandEnviAnim.leaveEnvirontment();

      //}

      myPopup.alert({ title: 'Notifications', template: 'Success to expand ' + islandToBuy.name });
      scopeEnvi.myPopup.close();
      _this.enterEnvirontment(islandToBuy.id);
    };

    //-- validate diamond
    if (Number(playerInfo.diamondBalance) < Number(islandToBuy.price.value)) {
      //aPopup.alert("You don't have enough diamond.");
      myPopup.alert({ title: 'Alert', template: "You don't have enough diamond." });
      return;
    }

    //-- validate EP
    if (parseInt(playerInfo.enviPoint) < parseInt(islandToBuy.requiredEP)) {
      myPopup.alert({ title: 'Alert', template: 'Required ' + islandToBuy.requiredEP + ' EP to expand ' + islandToBuy.name });
      return;
    }



    myPopup.confirm({ template: 'Expand to ' + islandToBuy.name + ' ?', title: 'Confirmation' })
      .then(onReadyBuyIsland);

  };
  _this.purchaseDecoration = function (decorId) {
    var decor = $w.GameApp.IslandServices.getDecorItem(decorId);
    var playerInfo = $w.izyObject('PlayerInfo').getOne();
    var envi = activeEnvi;

    //-- validate diamond
    if (playerInfo.diamondBalance < decor.price) {

      myPopup.alert({
        title: 'Alert',
        template: 'You dont have enough diamond.'
      });

      //aPopup.alert("You dont have enough diamond.");
      return;
    }


    //-- validate decor can put in island or not, and then inventory slot full or not
    var maxLand = 4,
      maxAir = 1,
      totalDecorInLand = 0,
      totalDecorInAir = 0,
      totalItem = 0,
      maxItem = 0;

    var decorationItems = $w.GameApp.IslandServices.fetchDecorationItems(envi.name);

    for (var i in decorationItems) {
      var path = decorationItems[i].path;
      if (String(path.area).toLowerCase() == 'air') {
        totalDecorInAir += 1;
      }
      if (String(path.area).toLowerCase() == 'land') {
        totalDecorInLand += 1;
      }
    }

    if (decor.area == 'land') {
      maxItem = maxLand;
      totalItem = totalDecorInLand;
    } else {
      maxItem = maxAir;
      totalItem = totalDecorInAir;
    };

    scopeEnvi.totalAvailableSlot = AppService.inventorySlot.getTotalAvailableSlot();
    scopeEnvi.totalItemInSlot = AppService.inventorySlot.getTotalItemInSlot();

    if (totalItem == maxItem && scopeEnvi.totalAvailableSlot == scopeEnvi.totalItemInSlot) {
      myPopup.alert({
        title: 'Alert',
        template: 'You dont have any slot to save this item !'
      });
      //aPopup.alert('You dont have any slot to save this item !');
      return;
    }



    myPopup.confirm({
      title: 'Confirmation',
      template: 'Buy this decoration ?'
    }).then(function (res) {
      if (res) {
        scopeEnvi.closeMenu();
        $w.GameApp.GameStage.putDecorItemToEnvirontment(decorId);
        scopeEnvi.refresData();
        // envi.draggingItem(decor);
        //refresData();
      }
    });


    //aPopup.confirm('Buy this decoration ?', 'Confirmation', ['OK', 'Try Later'])
    //  .then(function (btnIndex) {
    //    if (btnIndex == 1) {
    //      $scope.closeMenu();
    //      envi.draggingItem(decor);
    //      refresData();
    //    }
    //  });
  };
  _this.purchaseFiveInventorySlot = function () {
    var price = 20;
    var playerInfo = izyObject('PlayerInfo').getOne();

    if (scopeEnvi.totalAvailableSlot === 25) return;

    //-- validate diamond
    if (playerInfo.diamondBalance < price) {
      myPopup.alert({
        title: 'Alert',
        template: 'You dont have enough diamond.'
      });
      return;
    }

    function onAfterConfirmation(result) {
      if (!result) return;

      playerInfo.diamondBalance -= 20;
      $w.izyObject('PlayerInfo').store(playerInfo);
      AppService.inventorySlot.purchaseFiveSlot();
      scopeEnvi.refresData();
    };

    ////-- confirmation dialog
    //$cordovaDialogs.confirm('Buy 5 slots ?', 'Confirmation', ['OK', 'Try Later'])
    //  .then(function (buttonIndex) {
    //    // no button = 0, 'OK' = 1, 'Cancel' = 2
    //    var btnIndex = buttonIndex;
    //    if (buttonIndex !== 1) return;

    //    playerInfo.diamondBalance -= 20;
    //    izyObject('PlayerInfo').store(playerInfo);
    //    AppService.inventorySlot.purchaseFiveSlot();
    //    refresData();
    //  });
    myPopup.confirm({ title: 'Confirmation', template: 'Buy 5 slots ?' }).then(onAfterConfirmation);



  };
  _this.destroyEnvirontment = function () {
    if (renderer) {
      renderer.destroy();
      this.isStop = true;
      console.log('envi destroyed');
    };
  };
  _this.moveIteminInventorySlotToEnvirontment = function (slotId) {
    /** 
      - this run every user click one of displayed inventory slot
      - leave - cancel if slot not cointain decoration item
    **/
    var slot = AppService.inventorySlot.getSlot(slotId);
    if (slot.isEmpty) {
      return;
    }

    var decor = $w.GameApp.IslandServices.getDecorItem(slot.activeDecorId);

    $w.GameApp.GameStage.putDecorItemToEnvirontment(decor.id)



    scopeEnvi.closeMenu();
    scopeEnvi.refresData();


    //-- remove decor item in this inventory slot
    slot.activeDecorId = 0;
    slot.isEmpty = 1;
    AppService.inventorySlot.save(slot);
  };
  _this.onSwipingInEnvirontment = function (nextOrPrev) {
    var changedId, gm = $w.GameApp;
    if (nextOrPrev === 'next') {
      //console.log('on swipe down');
      changedId = Number(activeEnvi.id) + 1;
      if (changedId > gm.JsonData.island.length) return;
    };
    if (nextOrPrev === 'prev') {
      //console.log('on swipe up');
      changedId = Number(activeEnvi.id) - 1;
      if (changedId <= 0) return;
    };

    //$ionicLoading.show();

    activeEnvi = $w.GameApp.IslandServices.getIsland(changedId);
    createEnvirontment(changedId, function () {
      $w.enviLoading.show({
        template: $w.GameApp.IslandServices.getWelcomeTemplateIsland(activeEnvi),
        duration: 3000
      });

    });
    //swithActiveEnvi();

    /*
    $ionicLoading.show({
      template: getWelcomeTemplateIsland(),
      duration: 50000,
      noBackdrop: true
    });
    */
    //$w.enviLoading.show({ template: getWelcomeTemplateIsland(), duration: 2500 });
  };

  _this.showDetailActiveChar = function (aCharId) {
    var chardata = scopeEnvi.charsInEnvi,
      tm = 0;
    scopeEnvi.selectedChar = {};

    function openPopup() {
      var subtitle = '<img src="' + scopeEnvi.selectedChar.level + '" style="width:100%;" />';
      subtitle += '<div>' + scopeEnvi.selectedChar.type + '</div>';

      scopeEnvi.thisPopup = myPopup.show({
        title: scopeEnvi.selectedChar.nickname,
        subTitle: subtitle,
        templateUrl: 'templates/popup-detail-player-character.html',
        scope: scopeEnvi
      });

      scopeEnvi.closeThisPopup = function () {
        window.removeEventListener('serverdatetick', charTimerTick);
        scopeEnvi.thisPopup.close();
        console.log('removed listener serverdatetick');
      }

    };

    function charTimerTick() {
      //scopeEnvi.selectedChar;
      var countdown = $w.GameApp.getTimeRemaining(scopeEnvi.selectedChar.lifeEnd);
      var countdownText = '2 days 07:02:01';

      countdownText = '<div>' + countdown.days + ' days </div><div>' + countdown.hours + ':' + countdown.minutes + ':' + countdown.seconds + '</div>';
      scopeEnvi.selectedChar.lifespanCountdownText = countdownText;
    }

    chardata.forEach(function (value, index) {
      if (value.id == aCharId) {
        scopeEnvi.selectedChar = window.clone(value);
        openPopup();
        window.addEventListener('serverdatetick', charTimerTick);
        return;
      }
    });


  }


  $w.GameApp.IslandEnviAnim = _this;
})(this, this.PIXI, this.jQuery);