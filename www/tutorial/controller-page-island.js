(function IslandClass(ng, $, $w, PIXI, Swiper) {
    'use strict';

    function IslandCtrl($scope, $rootScope, $ionicLoading, $ionicPopup, AppService) {
        $scope.limitCharsEachEnvi = 10;
        $scope.charsInEnvi = {};

        $scope.openpopup = function () {
            var scopeEnvi = $scope;
            var renderer;


            console.log(objtest);
            scopeEnvi.selectedChar = objtest;
            scopeEnvi.runSelectedCharAnimation = function () {
                var rendererOptions = {
                    antialiasing: false,
                    transparent: true,
                    resolution: window.devicePixelRatio,
                    autoResize: true,
                }
                var gameWidth = 100;
                var gameHeight = 100;

                if (renderer) {
                    renderer.destroy();
                }
                renderer = new PIXI.autoDetectRenderer(gameWidth, gameHeight, rendererOptions);
                renderer.view.style.border = 'none';
                $('#selectedCharAnimatonWrapper').html(renderer.view);

                var stage = new PIXI.Container();
                var container = new PIXI.Container();
                var plateSprite = new PIXI.Sprite(PIXI.loader.resources.charPlate.texture);
                var scalePlate = 0.3;

                stage.addChild(container);
                container.addChild(plateSprite);

                plateSprite.scale.set(scalePlate, scalePlate);

                var xpos = (gameWidth - plateSprite.width) / 2;
                var ypos = gameHeight - plateSprite.height;
                plateSprite.position.set(xpos, ypos);


                var _charID = scopeEnvi.selectedChar.charId;
                _charID = 8;
                var spineData = PIXI.loader.resources['char_' + _charID].spineData;

                // instantiate the spine animation
                var spineChar = new PIXI.spine.Spine(spineData);
                spineChar.skeleton.setToSetupPose();
                spineChar.update(Math.random());
                spineChar.autoUpdate = true;

                // create a container for the spine animation and add the animation to it
                var spineCharCage = new PIXI.Container();
                spineCharCage.addChild(spineChar);

                // measure the spine animation and position it inside its container to align it to the origin
                var localRect = spineChar.getLocalBounds();
                var scaleChar = 0;
                var charPosX = (gameWidth - spineCharCage.width) / 2;
                var charPosY = ((plateSprite.height / 2));

                scaleAndRepositioning();
                spineChar.position.set(-localRect.x, -localRect.y);


                // once position and scaled, set the animation to play
                spineChar.state.setAnimationByName(0, 'Idle', true);

                scaleAndRepositioning();



                container.addChild(spineCharCage);

                animate();

                function animate() {
                    if (!renderer) {
                        return;
                    }
                    renderer.render(stage);
                    requestAnimationFrame(animate);
                    console.log('animating char');
                }
                function scaleAndRepositioning() {
                    var scale = scaleChar;

                    /**-- inject scaling **/
                    switch (_charID) {
                        case 1:
                            scale = 0.2;
                            charPosX = (gameWidth - spineCharCage.width) / 2;
                            charPosY = ((plateSprite.height / 2) - (10 / 100 * gameHeight));
                            break;
                        case 2:
                            scale = 0.2;
                            charPosX = (gameWidth - spineCharCage.width) / 2;
                            charPosY = ((plateSprite.height / 2) - (0 / 100 * gameHeight));
                            break;
                        case 3:
                            scale = 0.2;
                            charPosX = (gameWidth - spineCharCage.width) / 2;
                            charPosY = ((plateSprite.height / 2) - (0 / 100 * gameHeight));
                            break;
                        case 4:
                            scale = 0.2;
                            charPosX = (gameWidth - spineCharCage.width) / 2;
                            charPosY = ((plateSprite.height / 2) + (5 / 100 * gameHeight));
                            break;
                        case 5:
                            scale = 0.2;
                            charPosX = (gameWidth - spineCharCage.width) / 2;
                            charPosY = ((plateSprite.height / 2) + (5 / 100 * gameHeight));
                            break;
                        case 6:
                            scale = 0.25;
                            charPosX = (gameWidth - spineCharCage.width) / 2;
                            charPosY = ((plateSprite.height / 2) + (0 / 100 * gameHeight));
                            break;
                        case 7:
                            scale = 0.25;
                            charPosX = (gameWidth - spineCharCage.width) / 2;
                            charPosY = ((plateSprite.height / 2) + (0 / 100 * gameHeight));
                            break;
                        case 8:
                            scale = 0.7;
                            charPosX = (gameWidth - spineCharCage.width) / 2;
                            charPosY = ((plateSprite.height / 2) + (0 / 100 * gameHeight));
                            break;
                        case 10:
                            scale = 0.5;
                            break;
                        case 11:
                            scale = 0.4;
                            break;
                        case 13:
                            scale = 0.35;
                            break;
                        case 14:
                            scale = 0.4;
                            break;
                        case 17:
                            scale = 0.4;
                            break;
                        case 18:
                            scale = 0.4;
                            break;
                        default:
                            scale = 0.5;
                    }
                    spineCharCage.scale.set(scale, scale);
                    spineCharCage.position.set(charPosX, charPosY);
                };

            };

            (function openPopup() {
                var subtitle = '<img src="' + scopeEnvi.selectedChar.level + '" style="width:100%;" />';
                subtitle += '<div>' + scopeEnvi.selectedChar.type + '</div>';
                scopeEnvi.thisPopup = {};
                scopeEnvi.thisPopup.close = function () {
                    scopeEnvi.myPopup.close();
                    renderer.destroy();
                    renderer = null;
                };
                scopeEnvi.myPopup = $ionicPopup.show({
                    title: scopeEnvi.selectedChar.nickname,
                    subTitle: subtitle,
                    templateUrl: 'templates/popup-detail-player-character.html',
                    scope: scopeEnvi
                });

                // window.setTimeout(scopeEnvi.runSelectedCharAnimation, 500);
            })();

        };
        $scope.openEnvirontment = function (environtmentId) {
            //testingProcess();
            var playerInfo = $w.izyObject('PlayerInfo').getOne();
            var IslandEnviAnim = $w.GameApp.IslandEnviAnim;
            if (Number(playerInfo.currentEnvirontment) < Number(environtmentId)) {
                $w.GameApp.IslandEnviAnim.setup($ionicLoading, $ionicPopup, $scope, AppService);
                IslandEnviAnim.openDetailEnvirontment(environtmentId);
            } else {
                //IslandEnviAnim.enterEnvirontment(environtmentId);
                if (window.GameApp.bgm) {
                    window.GameApp.bgm.pause();
                }
                window.location = 'island.html?regionId=' + environtmentId;
                //window.open('island.html?regionId=' + environtmentId, '_self');
                //window.open('file:///android_asset/www/island.html?regionId=' + environtmentId);
            }
        };

        $scope.reloadPlayerInfo = function () {
            $rootScope.playerInfo = $w.izyObject('PlayerInfo').getOne();
        };
        $scope.PurchasingIsland = $w.GameApp.IslandEnviAnim.PurchasingIsland;
    }

    function EnvirontmentCtrl($scope, $rootScope, $ionicLoading, $ionicPopup, AppService) {
        //-- declare variables
        var swiperDecoration, swiperEquipment;

        $w.GameApp.IslandEnviAnim.setup($ionicLoading, $ionicPopup, $scope, AppService);

        $scope.limitCharsEachEnvi = 10;
        $scope.charsInEnvi = {};
        $scope.refresData = refresData;
        $scope.totalAvailableSlot = 0;
        $scope.totalItemInSlot = 0;
        $scope.inventorySlot = [];
        $scope.isOpenStatusInfo = false;
        $scope.statusInfo = {};

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
        //$scope.backtoHome = $w.GameApp.IslandEnviAnim.leaveEnvirontment;
        $scope.backtoHome = function () {
            if (window.plugins && window.plugins.NativeAudio) {
                window.plugins.NativeAudio.stop('island');
            }
            window.location.href = 'app.html';
        };

        $scope.openMenu = function () {
            refresData();

            $('#menu-backdrop').addClass('active');
            $('#bottonMenu').hide();
            $('#gameMenu').show();
            //$('#gameMenu').css({ 'opacity': 1, 'visibility': 'visible' });

            $scope.setTabMenu(1);

            window.requestAnimationFrame(function () {
                fixLayoutContent();
                initializeSwiper();
                //console.log('open menu');
            });
            //$w.setTimeout(function () {
            //    fixLayoutContent();
            //    initializeSwiper();

            //}, 500);

        };
        $scope.closeMenu = function () {
            $('#bottonMenu').show();
            $('#gameMenu').hide();
            //$('#gameMenu').css({ 'opacity': 0, 'visibility': 'hidden' });
            $('#menu-backdrop').removeClass('active');

            $scope.isOpenStatusInfo = false;


        };
        $scope.purchaseDecoration = $w.GameApp.IslandEnviAnim.purchaseDecoration;
        $scope.purchaseEquipment = $w.GameApp.IslandEnviAnim.purchaseEquipment;
        $scope.buyInventorySlot = $w.GameApp.IslandEnviAnim.purchaseFiveInventorySlot;
        $scope.onSwipeInActiveEnvi = $w.GameApp.IslandEnviAnim.onSwipingInEnvirontment;
        $scope.PurchasingIsland = $w.GameApp.IslandEnviAnim.PurchasingIsland;
        $scope.showDetailActiveChar = $w.GameApp.IslandEnviAnim.showDetailActiveChar;

        //-- fire when available target list clicked
        $scope.changeTargetChar = function (targetName) {
            var obj = $('#availableActionCharTarget .col');
            obj.removeClass('activeTarget');
            $.each(obj, function (key, value) {
                if ($(value).attr('value') == targetName) {
                    $(value).addClass('activeTarget');
                }
            });

            //-- fetch new ability
            $scope.selectedChar.actionAbility = [];
            for (var i = 0 ; i < $scope.selectedChar.action.ability.length; i++) {
                var actionAbility = {};

                actionAbility.type = String($scope.selectedChar.action.ability[i]).toLowerCase();

                //-- giving name of ability each target
                if (targetName == 'wood') {
                    if (String($scope.selectedChar.action.ability[i]).toLowerCase() == 'explorer') {
                        actionAbility.name = 'Planting';
                    } else {
                        actionAbility.name = 'Logging';
                    }
                } else {
                    if (String($scope.selectedChar.action.ability[i]).toLowerCase() == 'explorer') {
                        actionAbility.name = 'Exploring';
                    } else {
                        actionAbility.name = 'Mining';
                    }
                }
                actionAbility.isAvailable = $w.GameApp.IslandBusiness.isTargetAbilityAvailable(targetName, String($scope.selectedChar.action.ability[i]).toLowerCase());

                $scope.selectedChar.actionAbility.push(actionAbility);
            }

        };

        //$scope.infoStatusAction = $w.GameApp.GameStage.actionChar;
        $scope.infoStatusAction = function (targetName, actionName) {
            $scope.closeMenu();
            // console.log(targetName, actionName);
            $w.GameApp.GameStage.actionChar(targetName, actionName);
        };

        //-- fired when infoStatus clicked
        $scope.toggleOpenStatusInfo = function () {
            if ($scope.isOpenStatusInfo) {
                $scope.closeMenu();
            } else {
                $scope.isOpenStatusInfo = true;
                $('#menu-backdrop').addClass('active');

                //-- do fetching data ...
                $scope.statusInfo = $w.GameApp.IslandBusiness.fetchStatusInfo();
            }

        };

        //-- when click action button in pop up detail player char
        $scope.startFarming = window.GameApp.IslandEnviAnim.letCharDoingFarming;
        $scope.killChar = function (playerCharId) {
            //-- validasi kalo char lagi action gak boleh di bunuh
            $ionicPopup.confirm({ title: 'Confirmation', template: 'Are sure you to kill that char ?' })
              .then(function (res) {
                  if (res) {
                      window.GameApp.IslandBusiness.sendCharToHeaven(playerCharId, callback);
                  }

              });
            //-- proses
            //console.log(playerCharId);
            function callback() {
                window.GameApp.rootScope.reloadPlayerData(function () {
                    window.GameApp.GameStage.reloadChar();
                    $scope.closeMenu();
                });
            }

        };

        //-- untuk pake fungsi item di inventory
        $scope.useItemInInventory = $w.GameApp.IslandEnviAnim.useItemInInventory;

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

    ng.module('gamesapp').controller('IslandCtrl', ['$scope', '$rootScope', '$ionicLoading', '$ionicPopup', 'AppService', IslandCtrl]);
    ng.module('gamesapp').controller('EnvirontmentCtrl', ['$scope', '$rootScope', '$ionicLoading', '$ionicPopup', 'AppService', EnvirontmentCtrl]);
})(this.angular, this.jQuery, window, this.PIXI, this.Swiper);