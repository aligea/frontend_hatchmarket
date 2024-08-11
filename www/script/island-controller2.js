(function IslandController(ng, $, $w, PIXI, Swiper) {
  'use strict';
  ng.module('gamesapp').controller('IslandCtrl',
    ['$scope', '$rootScope', '$ionicLoading', '$ionicPopup', 'AppService',
    function ($scope, $rootScope, $ionicLoading, $ionicPopup, AppService) {
      //-- declare variables
      var swiperDecoration, swiperEquipment;

      $scope.limitCharsEachEnvi = 10;
      //$scope.charsInEnvi = {};
      $scope.refresData = refresData;
      $scope.totalAvailableSlot = AppService.inventorySlot.getTotalAvailableSlot();
      $scope.totalItemInSlot = AppService.inventorySlot.getTotalItemInSlot();
      $scope.inventorySlot = AppService.inventorySlot.fetchAll();

      $w.GameApp.IslandEnviAnim.setup($ionicLoading, $ionicPopup, $scope, AppService);

      /**-- testing char **/
      var objtest = {
        ability: "LOGGING",
        charId: 15,
        code: "26F22FFB",
        environtmentId: 1,
        hatchby: 4,
        hatched: 1474443491000,
        id: 1,
        infoImage: "asset/img/char/details/15.gif",
        isWithCode: 1,
        level: "asset/img/char/level/Lv.2.png",
        lifeEnd: 1475134691000,
        lifespan: "8 DAYS",
        lifespanCountdownText: "<div>7 days </div><div>23:59:48</div>",
        name: "RHADON",
        nickname: "RHADON1",
        parent: "ssssssss",
        shareImg: "asset/img/icons/share_eggcode.png",
        speciality: "Get 2 Items Decorations",
        speed: "SLOW",
        stats: {

        },
        target: "WOOD",
        type: "RARE"
      };

      $scope.testingChar = [];
      $scope.charMasterData = [];
      $scope.dataform = {};
      function testingProcess() {
        $w.GameApp.testingChar = [];
        $w.GameApp.isTestingChar = false;
        if (Number($scope.dataform.previewCharId) > 0) {
          var chid = Number($scope.dataform.previewCharId);

          objtest.id = 0;
          objtest.charId = chid;
          
          $w.GameApp.testingChar.push(objtest);
          $w.GameApp.isTestingChar = true;
        } 
      }

      $w.addEventListener('gamedataready', function () {
        $scope.charMasterData = $w.GameApp.JsonData.characters;

      });
    
      /**-- **/

      $scope.openEnvirontment = function (environtmentId) {
       // testingProcess();
        var playerInfo = $w.izyObject('PlayerInfo').getOne();
        var IslandEnviAnim = $w.GameApp.IslandEnviAnim;
        if (Number(playerInfo.currentEnvirontment) < Number(environtmentId)) {
          IslandEnviAnim.openDetailEnvirontment(environtmentId);
        } else {
          IslandEnviAnim.enterEnvirontment(environtmentId);
        }
       
      };

      $scope.reloadPlayerInfo = function () {
        $rootScope.playerInfo = $w.izyObject('PlayerInfo').getOne();
      };
      $scope.swapToEnvi = $w.GameApp.IslandEnviAnim.moveIteminInventorySlotToEnvirontment;
      $scope.setTabMenu = function (tabId) {
        if ($('#gameTabMenu #tab' + tabId).hasClass('active')) {
          //return;
        }
        $('#gameTabMenu .col').removeClass('active');
        $('#gameTabMenu #tab' + tabId).addClass('active');

        $('.tab-content').hide();
        $('#tabcontent_' + tabId).show();
      };
      $scope.backtoHome = $w.GameApp.IslandEnviAnim.leaveEnvirontment;
      $scope.openMenu = function () {
        refresData();

        $('#menu-backdrop').addClass('active');
        $('#bottonMenu').hide();
        $('#gameMenu').show();
        //$('#gameMenu').css({ 'opacity': 1, 'visibility': 'visible' });

        $scope.setTabMenu(1);
        $w.setTimeout(function () {
          fixLayoutContent();
          initializeSwiper();

        }, 500);
       
      };
      $scope.closeMenu = function () {
        $('#bottonMenu').show();
        $('#gameMenu').hide();
        //$('#gameMenu').css({ 'opacity': 0, 'visibility': 'hidden' });
        $('#menu-backdrop').removeClass('active');

      };
      $scope.purchaseDecoration = $w.GameApp.IslandEnviAnim.purchaseDecoration;
      $scope.purchaseEquipment = function (equipId) {
        var item = getEquipItem(equipId);
        console.log(item);
      };
      $scope.buyInventorySlot = $w.GameApp.IslandEnviAnim.purchaseFiveInventorySlot;
      $scope.onSwipeInActiveEnvi = $w.GameApp.IslandEnviAnim.onSwipingInEnvirontment;
      $scope.PurchasingIsland = $w.GameApp.IslandEnviAnim.PurchasingIsland;


      function fixLayoutContent() {
        var tabContentHeight = ($('#tabcontent_2').height());
        var marginTop = 50;
        $('#tabcontent_2 .inner, #tabcontent_3 ion-scroll').css({
          'height': (tabContentHeight - marginTop) + 'px'
        });
      };
      function initializeSwiper() {
        var h = $('#swiper-decoration-parent').height();
        var w = $('#swiper-decoration-parent').width();
        var h2 = $('#tabcontent_1').height() / 2;


        h = h2 - 30;
        w = w * 85 / 100;
        $('#swiper-decoration, .swiper-slider, #swiper-equipment').css({
          height: h + 'px',
          width: w + 'px'
        });
        $('#swiper-decoration img, #swiper-equipment img').css({ 'height': h + 'px' });

        if (!swiperDecoration) {
          swiperDecoration = new Swiper('#swiper-decoration', {
            // Navigation arrows
            nextButton: '#swiper-decoration-next',
            prevButton: '#swiper-decoration-prev',
            width: w,
            height: h,
            freeMode: false,
            freeModeMomentum: false,
            buttonDisabledClass: 'not-available',
            loop: true
          });

          swiperEquipment = new Swiper('#swiper-equipment', {
            // Navigation arrows
            nextButton: '#swiper-equipment-next',
            prevButton: '#swiper-equipment-prev',
            width: w,
            height: h,
            freeMode: false,
            freeModeMomentum: false,
            buttonDisabledClass: 'not-available',
            loop: true
          });
        }
      };
      function refresData() {
        $scope.totalAvailableSlot = AppService.inventorySlot.getTotalAvailableSlot();
        $scope.totalItemInSlot = AppService.inventorySlot.getTotalItemInSlot();
        $scope.inventorySlot = AppService.inventorySlot.fetchAll();

        $scope.isCanBuySlot = ($scope.totalAvailableSlot >= $scope.inventorySlot.length) ? false : true;
               

        //$scope.charsInEnvi = [];
        //$scope.charsInEnvi = $w.GameApp.CharServices.getEnviPlayerChar($scope.island.id);
        //console.log($scope.charsInEnvi);
      };

      $w.addEventListener('gameappready', function () {
        $('#menu-backdrop.active').click(function () {
          $scope.closeMenu();
        });
        $scope.setTabMenu(1);

        $scope.decorationData = $w.GameApp.JsonData.decoration;
        $scope.equipmentData = $w.GameApp.JsonData.equipment;
      });

    }
    ]);

  var spineCharCage = new PIXI.Container();
  function CharInStage(charId) {
    var _charID = charId;
    var spineData = window.PIXI.loader.resources['char_' + _charID].spineData;

    var _backgroundContainer = window.GameApp.GameStage.backgroundContainer;
    var _renderer = window.GameApp.GameStage.renderer;

    _backgroundContainer.removeChild(spineCharCage);

    // instantiate the spine animation
    var spineChar = new PIXI.spine.Spine(spineData);
    spineChar.skeleton.setToSetupPose();
    spineChar.update(Math.random());
    spineChar.autoUpdate = true;

    // create a container for the spine animation and add the animation to it
    spineCharCage = new PIXI.Container();
    spineCharCage.addChild(spineChar);

    // measure the spine animation and position it inside its container to align it to the origin
    var localRect = spineChar.getLocalBounds();
    spineChar.position.set(-localRect.x, -localRect.y);

    // now we can scale, position and rotate the container as any other display object
    var scale = Math.min(((_renderer.width) * 0.7) / spineCharCage.width, ((_renderer.height) * 0.7) / spineCharCage.height);
    scale = scale / $w.devicePixelRatio;

    scale = scale / 0.9;

    scale = 0.5;
    spineCharCage.scale.set(scale, scale);


    // once position and scaled, set the animation to play
    spineChar.state.setAnimationByName(0, spineData.animations[2].name, true);


    //new $w.GameApp.Walking(spineCharCage, _activeWorld, i).move();
    //array.push(walking);
    //_backgroundContainer.addChild(spineCharCage);
    _backgroundContainer.addChild(spineCharCage);
    console.log(spineCharCage.position);
  }


})(this.angular, this.jQuery, window, this.PIXI, this.Swiper);