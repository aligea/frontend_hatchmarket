/** GameApp - IslandEnviAnim */
(function IslandEnviAnim(win) {
    'use strict';
    var _this = {};
    var $w = win, PIXI = win.PIXI, $ = win.jQuery;
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
            scopeEnvi = {},
            myPopup = {};

    var IslandServices = {};
    var aPopup = {};
    var _playerInfo = $w.izyObject('PlayerInfo').getOne();
    var AppService;

    var createCountdown = function () {
        var cData = scopeEnvi.charsInEnvi;
        var regionData = $w.GameApp.IslandBusiness.getRegionData();

        for (var i = 0; i < cData.length; i++) {

            var countdown = $w.GameApp.getTimeRemaining(cData[i].lifeEnd);
            var countdownText = '2 days 07:02:01';

            countdownText = '<div>' + ('0' + countdown.days).slice(-2) + ' days </div><div>' + ('0' + countdown.hours).slice(-2) + ':' + ('0' + countdown.minutes).slice(-2) + ':' + ('0' + countdown.seconds).slice(-2) + '</div>';
            cData[i].lifespanCountdownText = countdownText;

            var jobName = 'Free';
            var jobCountdown = '-';
            var isWorking = false;

            if (regionData.wood.isWorking == 1 && cData[i].id == regionData.wood.workingPlayerCharId) {
                if (regionData.wood.farmingStatus == 2) {
                    jobName = 'Planting';
                }
                if (regionData.wood.farmingStatus == 4) {
                    jobName = 'Logging';
                }

                //-- hitung countdown
                var endtimeJob = Date.parse(regionData.wood.finishWorkingOn);
                var countdownJob = $w.GameApp.getTimeRemaining(endtimeJob);
                jobCountdown = '<div>' + ('0' + countdownJob.hours).slice(-2) + ':' + ('0' + countdownJob.minutes).slice(-2) + ':' + ('0' + countdownJob.seconds).slice(-2) + '</div>';
                isWorking = true;
            }

            if (regionData.stone.isWorking == 1 && cData[i].id == regionData.stone.workingPlayerCharId) {
                if (regionData.stone.farmingStatus == 2) {
                    jobName = 'Exploring';
                }
                if (regionData.stone.farmingStatus == 4) {
                    jobName = 'Mining';
                }

                //-- hitung countdown
                var endtimeJob = Date.parse(regionData.stone.finishWorkingOn);
                var countdownJob = $w.GameApp.getTimeRemaining(endtimeJob);
                jobCountdown = '<div>' + ('0' + countdownJob.hours).slice(-2) + ':' + ('0' + countdownJob.minutes).slice(-2) + ':' + ('0' + countdownJob.seconds).slice(-2) + '</div>';
                isWorking = true;
            }

            if (regionData.gold.isWorking == 1 && cData[i].id == regionData.gold.workingPlayerCharId) {
                if (regionData.gold.farmingStatus == 2) {
                    jobName = 'Exploring';
                }
                if (regionData.gold.farmingStatus == 4) {
                    jobName = 'Mining';
                }

                //-- hitung countdown
                var endtimeJob = Date.parse(regionData.gold.finishWorkingOn);
                var countdownJob = $w.GameApp.getTimeRemaining(endtimeJob);
                jobCountdown = '<div>' + ('0' + countdownJob.hours).slice(-2) + ':' + ('0' + countdownJob.minutes).slice(-2) + ':' + ('0' + countdownJob.seconds).slice(-2) + '</div>';
                isWorking = true;
            }

            cData[i].isWorking = isWorking;
            cData[i].jobName = jobName;
            cData[i].jobCountdown = jobCountdown;
        }

        //console.log('countdown');
    };

    var createEnvirontment = function (islandId, callbackFn) {

        myLoader.show();

        scopeEnvi.island = $w.GameApp.IslandServices.getIsland(islandId);
        activeEnvi = scopeEnvi.island;
        _playerInfo = $w.izyObject('PlayerInfo').getOne();

        if (Number(_playerInfo.currentEnvirontment) < Number(activeEnvi.id)) {
            $w.GameApp.IslandEnviAnim.draggingMode.atUnAvailableIsland();
        } else {
            $w.GameApp.IslandEnviAnim.draggingMode.atAvailableIsland();
        }


        //Set the game's current state to `play`:
        var state = play;
        function setup() {
            renderer = window.GameApp.renderer;

            // create the root of the scene graph
            stage = new PIXI.Container();
            decorContainer = new PIXI.Container();
            holderContainer = new PIXI.Container();
            backgroundContainer = new PIXI.Container();


            $w.GameApp.GameStage.setup(backgroundContainer, renderer, AppService);
            $w.GameApp.GameStage.run(activeEnvi.name);
            stage.addChild(backgroundContainer);
            gameLoop();

            //-- callback to show welcoming text in island;
            console.log('callback show welcoming island');
            callbackFn();

            runLifespanCharsCountdown();

        }

        var isResized = false;
        function gameLoop() {

            //Loop this function at 60 frames per second
            requestAnimationFrame(gameLoop);

            //Update the current game state:
            //state();

            //Render the stage to see the animation
            renderer.render(stage);

        }

        function play() {
            var a = window.GameApp.GameStage.charContainer;

            for (var i = 0; i < a.children.length; i++) {
                var container1 = a.children[i];
                var spine1 = container1.children[0];
                //console.log(container1);
                //changeDirection(spine1);

                var b = new PIXI.Container();

            }


            //Move the cat 1 pixel to the right each frame
            //cat.x += 1;
        }

        setup();
    }

    var runLifespanCharsCountdown = function () {
        scopeEnvi.charsInEnvi = $w.GameApp.CharServices.getEnviPlayerChar(activeEnvi.id);

        $w.removeEventListener('serverdatetick', createCountdown);
        $w.addEventListener('serverdatetick', createCountdown);
    }

    var stopLifespanCharCountDown = function () {
        $w.removeEventListener('serverdatetick', createCountdown);
    };


    _this.isStop = false;
    _this.setup = function ($ionicLoading, $ionicPopup, $scope, _AppService) {
        myPopup = $ionicPopup;
        myLoader = $ionicLoading;
        scopeEnvi = $scope;
        AppService = _AppService;

        //-- inject setup of islandbusiness
        $w.GameApp.IslandBusiness.setup($ionicLoading, _AppService.http, scopeEnvi);

    };
    _this.draggingMode = {
        on: function () {
            $('#bottonMenu').hide();
            $('#backtoHome').hide();
            $('#actionMenu').hide();
            console.log('drag on');
        },
        off: function () {
            $('#backtoHome').show();
            if (Number(window.GameApp.rootScope.playerInfo.currentEnvirontment) >= Number(activeEnvi.id)) {
                $('#bottonMenu').show();
                $('#actionMenu').show();
            } else {
                $('#bottonMenu').hide();
                $('#actionMenu').hide();
            }
            console.log('drag off');
        },
        atAvailableIsland: function () {
            $('#backtoHome').show();
            $('#bottonMenu').show();
            $('#actionMenu').show();
            //console.log('atAvailableIsland');
        },
        atUnAvailableIsland: function () {
            $('#backtoHome').show();
            $('#bottonMenu').hide();
            $('#actionMenu').hide();
            //console.log('atUnAvailableIsland');
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
        //$w.gmLoading.show({ duration: 3000 });

        function callbackAfterRegionDataLoaded() {
            // -- change sfx
            //$('#gameLayout').fadeIn('fast');
            //$('#appLayout').hide();
            //var sfx = gm.Sounds.bgm2();
            //gm.Sounds.bgm1().pause();
            //sfx.play();

            createEnvirontment(id, callbackToShowWelcomingIsland);
        }

        function callbackToShowWelcomingIsland() {
            $('#loadertrans').fadeOut('slow', function () {
                $w.enviLoading.show({
                    template: $w.GameApp.IslandServices.getWelcomeTemplateIsland(activeEnvi),
                    duration: 3000
                });
            });

            // var regionData = $w.GameApp.IslandBusiness.getRegionData();
            //console.log(regionData);
        }


        $w.GameApp.IslandBusiness.fetchRegionData(id, callbackAfterRegionDataLoaded);

        //window.GameApp.StopWalkingProcess();

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
            ////-- update player info
            //playerInfo.currentEnvirontment = islandToBuy.id;
            //playerInfo.diamondBalance -= islandToBuy.price.value;
            //playerInfo.maxPopulation = islandToBuy.population.value;
            //$w.izyObject('PlayerInfo').store(playerInfo);

            $w.GameApp.IslandServices.loadIslandImage();
            //if ($w.document.getElementById('gameLayout').style.display != 'none') {
            //  $w.GameApp.IslandEnviAnim.leaveEnvirontment();

            //}

            myPopup.alert({ title: 'Notifications', template: 'Success to expand ' + islandToBuy.name })
                    .then(function () {
                        window.location = 'island.html?regionId=' + environtId;
                    });
            scopeEnvi.myPopup.close();
            // _this.enterEnvirontment(islandToBuy.id);
        }
        ;

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
                .then(function (res) {
                    if (!res) { return; }
                    $w.GameApp.IslandBusiness.purchasingIsland(islandToBuy.id, onReadyBuyIsland);
                });

    };
    _this.purchaseDecoration = function (decorId) {
        var decor = $w.GameApp.IslandServices.getDecorItem(decorId);
        var playerInfo = $w.izyObject('PlayerInfo').getOne();
        var envi = activeEnvi;
        var price = 5;

        //console.log(playerInfo.diamondBalance, decor);

        //-- validate diamond
        if (Number(playerInfo.diamondBalance) < 5) {

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

        //var decorationItems = $w.GameApp.IslandServices.fetchDecorationItems(envi.name);
        var decorationItems = $w.GameApp.IslandBusiness.getDecorationData();

        for (var i = 0; i < decorationItems.length; i++) {
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
        }


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
                $w.GameApp.GameStage.putDecorItemToEnvirontment(decorId, true);
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

        if (scopeEnvi.totalAvailableSlot === 25)
            return;

        //-- validate diamond
        if (playerInfo.diamondBalance < price) {
            myPopup.alert({
                title: 'Alert',
                template: 'You dont have enough diamond.'
            });
            return;
        }

        function onAfterConfirmation(result) {
            if (!result)
                return;

            //playerInfo.diamondBalance -= 20;
            //$w.izyObject('PlayerInfo').store(playerInfo);
            AppService.inventorySlot.purchaseFiveSlot(function () {
                scopeEnvi.refresData();
            });

        }
        ;

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
        }
        ;
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
            if (changedId > gm.JsonData.island.length)
                return;
        }
        ;
        if (nextOrPrev === 'prev') {
            //console.log('on swipe up');
            changedId = Number(activeEnvi.id) - 1;
            if (changedId <= 0)
                return;
        }
        ;

        //$ionicLoading.show();

        activeEnvi = $w.GameApp.IslandServices.getIsland(changedId);

        function callbackAfterRegionDataLoaded() {
            createEnvirontment(changedId, function () {
                $w.enviLoading.show({
                    template: $w.GameApp.IslandServices.getWelcomeTemplateIsland(activeEnvi),
                    duration: 3000
                });
            });
        }
        ;
        $w.GameApp.IslandBusiness.fetchRegionData(changedId, callbackAfterRegionDataLoaded);


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
    _this.purchaseEquipment = function (eId) {
        //-- ambil data equipment
        var equipm = {};
        for (var i = 0; i < $w.GameApp.JsonData.equipment.length; i++) {
            var thisObj = $w.GameApp.JsonData.equipment[i];
            if (thisObj.id == eId) {
                equipm = Object(thisObj);
            }
        }


        //-- validasi saldo player cukup gak
        var playerInfo = window.GameApp.rootScope.playerInfo;
        if (Number(playerInfo.diamondBalance) < Number(equipm.price)) {
            myPopup.alert({
                title: 'Alert',
                template: 'You dont have enough diamond.'
            });

            //aPopup.alert("You dont have enough diamond.");
            return false;
        }


        //-- validasi ada tempat di inventory
        scopeEnvi.totalAvailableSlot = AppService.inventorySlot.getTotalAvailableSlot();
        scopeEnvi.totalItemInSlot = AppService.inventorySlot.getTotalItemInSlot();
        //console.log(scopeEnvi.totalAvailableSlot, scopeEnvi.totalItemInSlot);
        if (scopeEnvi.totalAvailableSlot <= scopeEnvi.totalItemInSlot) {
            myPopup.alert({
                title: 'Alert',
                template: 'You dont have any slot to save this item !'
            });
            return false;
        }

        //-- munculkan konfirmasi, jika ok lalu di proses
        myPopup.confirm({
            title: 'Confirmation',
            template: 'Purchase ' + equipm.name + ' ?'
        }).then(function (res) {
            if (res) {
                $w.GameApp.IslandBusiness.purchasingEquipment(eId, function () {
                    myLoader.show({
                        template: 'The item is ready in your inventory.',
                        duration: 2000,
                        noBackdrop: true
                    });
                    scopeEnvi.setTabMenu(2);
                    scopeEnvi.refresData();
                });
            }
        });

    };

    /**
     * Popup Detail Char
     * When click tab meenu charatcter in Environtment
     */
    _this.showDetailActiveChar = function (aCharId) {
        var chardata = scopeEnvi.charsInEnvi;
        var activeTarget = '';
        var regionData = $w.GameApp.IslandBusiness.getRegionData();
        var openPopup = function () {
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
            };

        };
        var charTimerTick = function () {
            //scopeEnvi.selectedChar;
            var countdown = $w.GameApp.getTimeRemaining(scopeEnvi.selectedChar.lifeEnd);
            var countdownText = '';
            //console.log(scopeEnvi.selectedChar);
            countdownText = '<div>' + ('0' + countdown.days).slice(-2) + ' days </div><div>' + ('0' + countdown.hours).slice(-2) + ':' + ('0' + countdown.minutes).slice(-2) + ':' + ('0' + countdown.seconds).slice(-2) + '</div>';
            scopeEnvi.selectedChar.lifespanCountdownText = countdownText;

            var endtimeJob = 0;
            var countdownJob = countdownJob = $w.GameApp.getTimeRemaining(endtimeJob);
            var jobCountdown = '-';

            if (regionData.wood.isWorking == 1 &&
                    regionData.wood.workingPlayerCharId == scopeEnvi.selectedChar.id) {
                //-- hitung countdown
                endtimeJob = Date.parse(regionData.wood.finishWorkingOn);
                countdownJob = $w.GameApp.getTimeRemaining(endtimeJob);
                jobCountdown = '<div>' + ('0' + countdownJob.hours).slice(-2) + ':' + ('0' + countdownJob.minutes).slice(-2) + ':' + ('0' + countdownJob.seconds).slice(-2) + '</div>';
                //console.log(regionData.wood.finishWorkingOn);
            }

            if (regionData.stone.isWorking == 1 &&
                    regionData.stone.workingPlayerCharId == scopeEnvi.selectedChar.id) {
                //-- hitung countdown
                endtimeJob = Date.parse(regionData.stone.finishWorkingOn);
                countdownJob = $w.GameApp.getTimeRemaining(endtimeJob);
                jobCountdown = '<div>' + ('0' + countdownJob.hours).slice(-2) + ':' + ('0' + countdownJob.minutes).slice(-2) + ':' + ('0' + countdownJob.seconds).slice(-2) + '</div>';

            }

            if (regionData.gold.isWorking == 1 &&
                    regionData.gold.workingPlayerCharId == scopeEnvi.selectedChar.id) {
                //-- hitung countdown
                endtimeJob = Date.parse(regionData.gold.finishWorkingOn);
                countdownJob = $w.GameApp.getTimeRemaining(endtimeJob);
                jobCountdown = '<div>' + ('0' + countdownJob.hours).slice(-2) + ':' + ('0' + countdownJob.minutes).slice(-2) + ':' + ('0' + countdownJob.seconds).slice(-2) + '</div>';

            }

            scopeEnvi.selectedChar.jobCountdown = jobCountdown;
        };
        var isRunningSpecialityProcess = false;

        scopeEnvi.selectedChar = {};
        scopeEnvi.spcData = [];
        scopeEnvi.shareTo = function (socname) {
            window.GameApp.SpreadCode.showQRCode(scopeEnvi.selectedChar.code, function () {
                window.GameApp.SpreadCode.shareToSocialMedia(socname);
            });
        }
        scopeEnvi.claimSpeciality = function (eggcode, specialityName, isAvailable) {
            if (isAvailable == 0 || isRunningSpecialityProcess) {
                return;
            }

            isRunningSpecialityProcess = true;

            //-- code ini harus nya langsung di eksekusi, jangan nunggu callback
            scopeEnvi.closeMenu();
            scopeEnvi.closeThisPopup();

            var it = 0;

            var callback = function (info) {
                var text = (info) ? info : '-';
                $w.enviLoading.show({
                    template: text,
                    duration: 3000
                });
                if (specialityName == 'lifeinjection') {
                    window.GameApp.rootScope.reloadPlayerData(function () {
                        runLifespanCharsCountdown();
                    });
                }

                if (specialityName == 'getdecoration') {
                    window.GameApp.rootScope.reloadPlayerData();
                }

                isRunningSpecialityProcess = false;

                scopeEnvi.closeMenu();
                scopeEnvi.closeThisPopup();

            };
            var lifeinjection = function () {
                //var cdata = [];
                //for (var a = 0; a < 10; a++) {
                //    cdata.push({ id: a + 1, nickname: 'test' + a + 1, lifespanCountdownText: '2 days 00:00:00' });
                //}

                var cRi = window.GameApp.rootScope.playerInfo.currentEnvirontment;
                var charInSelectedEnvi = window.GameApp.CharServices.getEnviPlayerChar(cRi);

                var bindingdata = function () {
                    var cdata = charInSelectedEnvi.filter(function (value) {
                        //var a = (value.id == scopeEnvi.selectedChar.id);
                        //console.log(value.id, scopeEnvi.selectedChar.id);
                        return !(value.id === scopeEnvi.selectedChar.id);
                    });
                    scopeEnvi.enableToInject = [];

                    for (var key = 0; key < 10; key++) {
                        var char = Object(cdata[key]);
                        //if (char.id != scopeEnvi.selectedChar.id) {
                        //    char = {};
                        //}
                        scopeEnvi.enableToInject.push(char);
                    }


                    $w.removeEventListener('serverdatetick', createCountdownLifespan);
                    $w.addEventListener('serverdatetick', createCountdownLifespan);
                };

                var createCountdownLifespan = function () {
                    var cData = scopeEnvi.enableToInject;

                    for (var i = 0; i < cData.length; i++) {
                        var countdown = $w.GameApp.getTimeRemaining(cData[i].lifeEnd);
                        var countdownText = '';

                        if (!cData[i].lifeEnd) {
                            continue;
                        }
                        countdownText = ('0' + countdown.days).slice(-2) + ' days ' + ('0' + countdown.hours).slice(-2) + ':' + ('0' + countdown.minutes).slice(-2) + ':' + ('0' + countdown.seconds).slice(-2);
                        cData[i].lifespanCountdownText = countdownText;
                    }

                    //console.log('countdown');
                };

                scopeEnvi.changeIsland = function () {
                    var cId = scopeEnvi.selectedIsland.id + 1;
                    if (cId > 4) {
                        cId = 1;
                    }
                    scopeEnvi.selectedIsland = window.GameApp.IslandServices.getIsland(cId);
                    charInSelectedEnvi = [];
                    charInSelectedEnvi = window.GameApp.CharServices.getEnviPlayerChar(scopeEnvi.selectedIsland.id);

                    bindingdata();
                };
                scopeEnvi.enableToInject = [];
                scopeEnvi.selectedIsland = window.GameApp.IslandServices.getIsland(cRi);
                scopeEnvi.chooseChar = function (char) {
                    if (!char.id) {
                        return false;
                    }
                    myPopup.confirm({
                        title: 'Confirmation ',
                        template: 'give additional life to ' + char.nickname + '?'
                    }).then(function (res) {
                        if (res) {
                            console.log('doing injecting');
                            scopeEnvi.closeItPopup();
                            it = char.code;
                            window.GameApp.IslandBusiness.claimingSpeciality(eggcode, specialityName, it, callback);
                            window.removeEventListener('serverdatetick', createCountdown);
                        }
                    });
                };
                scopeEnvi.openItPopup = myPopup.show({
                    title: 'Choose character',
                    templateUrl: 'templates/popup-char-injection.html',
                    scope: scopeEnvi
                });
                scopeEnvi.closeItPopup = function () {
                    scopeEnvi.openItPopup.close();
                };

                bindingdata();
            };

            switch (specialityName) {
                case 'lifeinjection':
                    lifeinjection();
                    break;
                default:
                    window.GameApp.IslandBusiness.claimingSpeciality(eggcode, specialityName, it, callback);
                    break;
            }

        };


        for (var i = 0; i < chardata.length; i++) {
            var value = Object(chardata[i]);
            if (value.id == aCharId) {
                scopeEnvi.selectedChar = window.clone(value);
                scopeEnvi.selectedChar.actionTarget = [];
                scopeEnvi.selectedChar.actionAbility = [];
                for (var i = 0; i < scopeEnvi.selectedChar.action.target.length; i++) {
                    var actionTarget = {};
                    actionTarget.name = scopeEnvi.selectedChar.action.target[i];
                    if (i == 0) {
                        actionTarget.isActiveTarget = 'activeTarget';
                        activeTarget = String(actionTarget.name).toLowerCase();
                    } else {
                        actionTarget.isActiveTarget = '';
                    }

                    scopeEnvi.selectedChar.actionTarget.push(actionTarget);
                }

                for (var i = 0; i < scopeEnvi.selectedChar.action.ability.length; i++) {
                    var actionAbility = {};
                    actionAbility.type = String(scopeEnvi.selectedChar.action.ability[i]).toLowerCase();

                    //-- giving name of ability name each target
                    if (activeTarget == 'wood') {
                        if (String(scopeEnvi.selectedChar.action.ability[i]).toLowerCase() == 'explorer') {
                            actionAbility.name = 'Planting';
                        } else {
                            actionAbility.name = 'Logging';
                        }
                    } else {
                        if (String(scopeEnvi.selectedChar.action.ability[i]).toLowerCase() == 'explorer') {
                            actionAbility.name = 'Exploring';
                        } else {
                            actionAbility.name = 'Mining';
                        }
                    }
                    actionAbility.isAvailable = $w.GameApp.IslandBusiness.isTargetAbilityAvailable(activeTarget, String(scopeEnvi.selectedChar.action.ability[i]).toLowerCase());

                    scopeEnvi.selectedChar.actionAbility.push(actionAbility);
                }


                window.GameApp.IslandBusiness.fetchSpecialityInfo(value.code, function (sdata) {
                    scopeEnvi.spcData = [];
                    $.each(sdata, function (key, spc) {
                        if (spc.isAvailable == 1) {
                            spc.tagClass = 'block-info clickable blink_me';
                        } else {
                            spc.tagClass = 'block-info';
                        }
                        scopeEnvi.spcData.push(spc);
                        //console.log(spc);
                    });

                    openPopup();
                });
                window.addEventListener('serverdatetick', charTimerTick);
                break;
            }
        }

    };
    _this.letCharDoingFarming = function (abilityName, playerCharId) {
        scopeEnvi.closeThisPopup();
        $w.GameApp.ionicLoading.show();
        //-- identify var parameter
        var regionId = Object(activeEnvi).id;

        var targetName = '';// wood, stone, gold
        // var targetAbility = '';//-- explorer, destroyer
        var charId = '';
        var listdata = $('#availableActionCharTarget .col');
        var isLifespanEnough = _this.validateIsLifespanCharCanWorking(playerCharId);

        //-- inject validasi nyawa char
        if (!isLifespanEnough) {
            var thisChar = $w.GameApp.CharServices.getPlayerCharById(playerCharId);
            var text = thisChar.nickname + "'s lifespan less than " + String(thisChar.action.duration).toLowerCase() + ". Cannot " + String(thisChar.ability).toLowerCase();
            //console.log(text);
            return window.navigator.notification.alert(text);
        }


        $.each(listdata, function (key, value) {
            targetName = $(value).attr('value');
            if ($(value).hasClass('activeTarget')) {
                console.log(regionId, playerCharId, targetName, abilityName);
                return $w.GameApp.IslandBusiness.setupFarming(regionId, playerCharId, targetName, abilityName, onAfterSendingRequestToServer);
            }
        });

        function onAfterSendingRequestToServer() {
            $w.GameApp.GameStage.reloadChar();
            //scopeEnvi.closeThisPopup();

            //-- inject notifications
            window.GameApp.LocalNotif.reload();
        }

    };

    /**
     * @param targetName ; string wood / stone / gold
     */
    _this.finishNowFarmingChar = function (targetName) {
        var stageid = activeEnvi.id;
        var regionData = $w.GameApp.IslandBusiness.getRegionData();

        //-- validasi itu diamond cukup gak
        var endtime = Date.parse(regionData[targetName].finishWorkingOn);
        var countdown = $w.GameApp.getTimeRemaining(endtime);
        var remainingDiamond = Math.ceil(countdown.total / 60 / 60 / 1000);
        var playerInfo = new izyObject('PlayerInfo').getOne();
        if (playerInfo.diamondBalance < remainingDiamond) {
            myPopup.alert({
                title: 'Alert',
                template: 'You dont have enough diamond.'
            });
            return;
        }

        //-- munculkan popup konfirmasi berisi info berapa diamond lagi yg harus dibayar
        if (Number(remainingDiamond) <= 0) {
            return;
        }
        myPopup.confirm({
            title: 'Confirmation ',
            template: 'Are you sure to Finish Now with ' + remainingDiamond + ' diamonds ?'
        })
                .then(function (res) {
                    if (res) {
                        $w.GameApp.IslandBusiness.finishNowFarming(stageid, targetName, function callback() {
                            $w.GameApp.GameStage.reloadChar();

                            //-- inject notifications
                            window.GameApp.LocalNotif.reload();
                        });
                    }
                });


    };
    _this.useItemInInventory = function (invSlotId) {
        var service = AppService.inventorySlot;
        var slot = Object(service.getSlot(invSlotId));
        var totalChar = window.GameApp.CharServices.getPlayerChars().length;

        function runEquipmentModule(eqitem) {
            var _eqitem = Object(eqitem);
            var eqFunc = {};
            var funcName = 'obj' + _eqitem.id;
            var lifeAmount = 0;
            var playerInfo = window.GameApp.rootScope.playerInfo;

            //var a = window.GameApp.IslandBusiness.getRegionData();
            //console.log(a);

            var useLifeInjection = function () {
                var cRi = window.GameApp.rootScope.playerInfo.currentEnvirontment;
                var charInSelectedEnvi = window.GameApp.CharServices.getEnviPlayerChar(cRi);
                var _slot = Object(slot);

                function bindingdata() {
                    var cdata = charInSelectedEnvi;
                    scopeEnvi.enableToInject = [];

                    for (var key = 0; key < 10; key++) {
                        var char = Object(cdata[key]);
                        //if (char.id != scopeEnvi.selectedChar.id) {
                        //    char = {};
                        //}
                        scopeEnvi.enableToInject.push(char);
                    }


                    $w.removeEventListener('serverdatetick', createCountdownLifespan);
                    $w.addEventListener('serverdatetick', createCountdownLifespan);
                }

                function createCountdownLifespan() {
                    var cData = scopeEnvi.enableToInject;

                    for (var i = 0; i < cData.length; i++) {
                        var countdown = $w.GameApp.getTimeRemaining(cData[i].lifeEnd);
                        var countdownText = '';

                        if (!cData[i].lifeEnd) {
                            continue;
                        }
                        countdownText = ('0' + countdown.days).slice(-2) + ' days ' + ('0' + countdown.hours).slice(-2) + ':' + ('0' + countdown.minutes).slice(-2) + ':' + ('0' + countdown.seconds).slice(-2);
                        cData[i].lifespanCountdownText = countdownText;
                    }

                    //console.log('countdown');
                }

                function callback(info) {
                    var text = (info) ? info : '-';

                    window.GameApp.rootScope.reloadPlayerData(function () {
                        runLifespanCharsCountdown();
                        window.GameApp.ionicLoading.show({
                            template: text,
                            duration: 3000
                        });
                    });
                    scopeEnvi.closeMenu();
                }

                if (totalChar <= 0) {
                    return;
                }

                scopeEnvi.changeIsland = function () {
                    var cId = scopeEnvi.selectedIsland.id + 1;
                    if (cId > 4) {
                        cId = 1;
                    }
                    scopeEnvi.selectedIsland = window.GameApp.IslandServices.getIsland(cId);
                    charInSelectedEnvi = [];
                    charInSelectedEnvi = window.GameApp.CharServices.getEnviPlayerChar(scopeEnvi.selectedIsland.id);

                    bindingdata();
                };
                scopeEnvi.enableToInject = [];
                scopeEnvi.selectedIsland = window.GameApp.IslandServices.getIsland(cRi);
                scopeEnvi.chooseChar = function (char) {
                    if (!char.id) {
                        return false;
                    }
                    myPopup.confirm({
                        title: 'Confirmation ',
                        template: 'give ' + lifeAmount + ' day additional life to ' + char.nickname + '?'
                    }).then(function (res) {
                        if (res) {
                            console.log('doing injecting');
                            scopeEnvi.closeItPopup();

                            window.GameApp.IslandBusiness.useItemLifeInjection(_slot.id, char.code, callback);
                            window.removeEventListener('serverdatetick', createCountdown);
                        }
                    });
                };
                scopeEnvi.openItPopup = myPopup.show({
                    title: 'Choose character',
                    templateUrl: 'templates/popup-char-injection.html',
                    scope: scopeEnvi
                });
                scopeEnvi.closeItPopup = function () {
                    scopeEnvi.openItPopup.close();
                };

                scopeEnvi.closeThisPopup = function () {
                    scopeEnvi.thisPopup.close();
                };
                scopeEnvi.closeMenu();
                bindingdata();
            };

            var usePortal = function () {
                var cRi = window.GameApp.rootScope.playerInfo.currentEnvirontment;
                var charInSelectedEnvi = window.GameApp.CharServices.getEnviPlayerChar(cRi);
                var _slot = Object(slot);
                var selectedChar = {};

                var bindingdata = function () {
                    var cdata = charInSelectedEnvi;
                    scopeEnvi.enableToInject = [];

                    for (var key = 0; key < 10; key++) {
                        var char = Object(cdata[key]);
                        //if (char.id != scopeEnvi.selectedChar.id) {
                        //    char = {};
                        //}
                        scopeEnvi.enableToInject.push(char);
                    }


                    $w.removeEventListener('serverdatetick', createCountdownLifespan);
                    $w.addEventListener('serverdatetick', createCountdownLifespan);
                };

                var createCountdownLifespan = function () {
                    var cData = scopeEnvi.enableToInject;

                    for (var i = 0; i < cData.length; i++) {
                        var countdown = $w.GameApp.getTimeRemaining(cData[i].lifeEnd);
                        var countdownText = '';

                        if (!cData[i].lifeEnd) {
                            continue;
                        }
                        countdownText = ('0' + countdown.days).slice(-2) + ' days ' + ('0' + countdown.hours).slice(-2) + ':' + ('0' + countdown.minutes).slice(-2) + ':' + ('0' + countdown.seconds).slice(-2);
                        cData[i].lifespanCountdownText = countdownText;
                    }

                    //console.log('countdown');
                };

                var showAvailableRegion = function () {
                    //-- cek apakah ada region yang available untuk char ini
                    var availableRegionCounter = 0;
                    var regionList = [];
                    for (var i = 1; i <= Number(playerInfo.currentEnvirontment) ; i++) {
                        if (i == selectedChar.stage) {
                            regionList.push({ id: i, isAvailable: false });
                            //console.log(i);
                            continue;
                        }


                        //-- cek total char di region ini
                        var thisRegion = window.GameApp.CharServices.getEnviPlayerChar(i);
                        if (thisRegion.length < 10) {
                            regionList.push({ id: i, isAvailable: true });
                            availableRegionCounter++;
                        } else {
                            regionList.push({ id: i, isAvailable: false });
                        }
                    }
                    //console.log(selectedChar.stage);

                    if (availableRegionCounter <= 0) {
                        window.GameApp.ionicLoading.show({
                            template: "You don't have any available region. Cannot use this item.",
                            duration: 3000
                        });
                        return false;
                    }

                    //console.log(regionList);

                    //-- munculkan popup region target
                    scopeEnvi.regionList = regionList;
                    scopeEnvi.chooseRegion = function (rId) {
                        scopeEnvi.openRtPopup.close();
                        scopeEnvi.closeMenu();
                        window.GameApp.IslandBusiness.useItemPortal(_slot.id, selectedChar.code, rId, function (info) {
                            //console.log(rId);
                            //scopeEnvi.openRtPopup.close();
                            var text = (info) ? info : '-';
                            window.GameApp.ionicLoading.show({
                                template: text,
                                duration: 3000
                            });
                            window.GameApp.rootScope.reloadPlayerData(function () {
                                scopeEnvi.closeMenu();
                                window.GameApp.IslandEnviAnim.enterEnvirontment(rId);
                            });
                        });

                    };
                    scopeEnvi.openRtPopup = myPopup.show({
                        title: 'Choose Region',
                        templateUrl: 'templates/popup-region-selection.html',
                        scope: scopeEnvi
                    });

                };


                if (totalChar <= 0) {
                    return;
                }

                scopeEnvi.changeIsland = function () {
                    var cId = scopeEnvi.selectedIsland.id + 1;
                    if (cId > 4) {
                        cId = 1;
                    }
                    scopeEnvi.selectedIsland = window.GameApp.IslandServices.getIsland(cId);
                    charInSelectedEnvi = [];
                    charInSelectedEnvi = window.GameApp.CharServices.getEnviPlayerChar(scopeEnvi.selectedIsland.id);

                    bindingdata();
                };
                scopeEnvi.enableToInject = [];
                scopeEnvi.selectedIsland = window.GameApp.IslandServices.getIsland(cRi);
                scopeEnvi.chooseChar = function (char) {
                    if (!char.id) {
                        return false;
                    }
                    myPopup.confirm({
                        title: 'Confirmation ',
                        template: 'Move ' + char.nickname + '?'
                    }).then(function (res) {

                        if (res) {
                            console.log('doing move');
                            selectedChar = char;
                            scopeEnvi.closeItPopup();
                            window.removeEventListener('serverdatetick', createCountdown);
                            showAvailableRegion();
                        }

                    });
                };
                scopeEnvi.openItPopup = myPopup.show({
                    title: 'Choose character',
                    templateUrl: 'templates/popup-char-injection.html',
                    scope: scopeEnvi
                });
                scopeEnvi.closeItPopup = function () {
                    scopeEnvi.openItPopup.close();
                };

                scopeEnvi.closeThisPopup = function () {
                    scopeEnvi.thisPopup.close();
                };
                scopeEnvi.closeMenu();
                bindingdata();
            };

            var useItemExplorer = function () {
                scopeEnvi.closeMenu();
                $w.GameApp.IslandBusiness.useItemExplorer(slot.id, activeEnvi.id, function (info) {
                    $w.GameApp.rootScope.reloadPlayerData(function () {
                        $w.GameApp.IslandBusiness.fetchRegionData(activeEnvi.id, function () {
                            $w.GameApp.GameStage.reloadChar();

                            //-- inject notifications
                            window.GameApp.LocalNotif.reload();
                        });
                    });


                });
            };


            /** 
             * Mystical Potion
             * give extra 2 days of life to monster.
             */
            eqFunc.obj1 = function () {
                //-- validasi ada char gak
                if (totalChar <= 0) {
                    window.GameApp.ionicLoading.show({
                        template: "You don't have any character. Cannot use this item.",
                        duration: 3000
                    });
                    return false;
                }
                var konfirm = myPopup.confirm({
                    title: 'Confirmation',
                    template: 'Use  ' + _eqitem.name + ' to a character?'
                });
                lifeAmount = 3;

                konfirm.then(function (isOk) {
                    if (isOk)
                        useLifeInjection();
                });
            };

            /** 
             * Special Syringe
             * give extra 2 days of life to monster.
             */
            eqFunc.obj2 = function () {
                //-- validasi ada char gak
                if (totalChar <= 0) {
                    window.GameApp.ionicLoading.show({
                        template: "You don't have any character. Cannot use this item.",
                        duration: 3000
                    });
                    return false;
                }
                var konfirm = myPopup.confirm({
                    title: 'Confirmation',
                    template: 'Use  ' + _eqitem.name + ' to a character?'
                });
                lifeAmount = 2;

                konfirm.then(function (isOk) {
                    if (isOk)
                        useLifeInjection();
                });
            };

            /** 
             * Normal Pellet
             * give an extra day of life to monster.
             */
            eqFunc.obj3 = function () {
                //-- validasi ada char gak
                if (totalChar <= 0) {
                    window.GameApp.ionicLoading.show({
                        template: "You don't have any character. Cannot use this item.",
                        duration: 3000
                    });
                    return false;
                }
                var konfirm = myPopup.confirm({
                    title: 'Confirmation',
                    template: 'Use  ' + _eqitem.name + ' to a character?'
                });
                lifeAmount = 1;

                konfirm.then(function (isOk) {
                    if (isOk)
                        useLifeInjection();
                });
            };

            /** 
             * Vortex Portal
             * a portal that transports monsters from one region to the other
             */
            eqFunc.obj4 = function () {
                //-- validasi ada char gak
                //-- eliminasi char yg lagi kerja gak boleh ikut2an di pindahin
                if (totalChar <= 0) {
                    window.GameApp.ionicLoading.show({
                        template: "You don't have any character. Cannot use this item.",
                        duration: 3000
                    });
                    return false;
                }

                //-- validasi region yang terbuka
                if (Number(playerInfo.currentEnvirontment) <= 1) {
                    window.GameApp.ionicLoading.show({
                        template: "You don't have any available region. Cannot use this item.",
                        duration: 3000
                    });
                    return false;
                }



                var konfirm = myPopup.confirm({
                    title: 'Confirmation',
                    template: 'Use  ' + _eqitem.name + ' to a character?'
                });
                lifeAmount = 3;

                konfirm.then(function (isOk) {
                    if (isOk)
                        usePortal();
                });
            };

            /**
             * Lucky Seed
             * will grow into tree. Period : 4 hours.
             */
            eqFunc.obj5 = function () {
                //-- validasi region aktif perlu explorer item gak
                var regionData = $w.GameApp.IslandBusiness.getRegionData();
                if (regionData.wood.farmingStatus != 1) {
                    window.GameApp.ionicLoading.show({
                        template: "You can't use this item for this region status.",
                        duration: 3000
                    });
                    return false;
                }

                var konfirm = myPopup.confirm({
                    title: 'Confirmation',
                    template: 'Use  ' + _eqitem.name + ' to planting wood?'
                });


                konfirm.then(function (isOk) {
                    if (isOk)
                        useItemExplorer();
                });
            };

            /**
             * Gold Radar
             * detect nearby gold material. Period : 4 hours.
             */
            eqFunc.obj6 = function () {
                //-- validasi region aktif perlu explorer item gak
                var regionData = $w.GameApp.IslandBusiness.getRegionData();
                if (regionData.gold.farmingStatus != 1) {
                    window.GameApp.ionicLoading.show({
                        template: "You can't use this item for this region status.",
                        duration: 3000
                    });
                    return false;
                }

                var konfirm = myPopup.confirm({
                    title: 'Confirmation',
                    template: 'Use  ' + _eqitem.name + ' to exploring gold?'
                });


                konfirm.then(function (isOk) {
                    if (isOk)
                        useItemExplorer();
                });
            };

            /**
             * Stone Radar
             * detect nearby stone material. Period : 4 hours.
             */
            eqFunc.obj7 = function () {
                //-- validasi region aktif perlu explorer item gak
                var regionData = $w.GameApp.IslandBusiness.getRegionData();
                if (regionData.stone.farmingStatus != 1) {
                    window.GameApp.ionicLoading.show({
                        template: "You can't use this item for this region status.",
                        duration: 3000
                    });
                    return false;
                }

                var konfirm = myPopup.confirm({
                    title: 'Confirmation',
                    template: 'Use  ' + _eqitem.name + ' to exploring stone?'
                });

                konfirm.then(function (isOk) {
                    if (isOk)
                        useItemExplorer();
                });
            };

            eqFunc[funcName]();

        }


        function runDecorModule(decorItem) {
            scopeEnvi.closeMenu();
            $w.GameApp.GameStage.putDecorItemToEnvirontment(decorItem.id, function (decorinregion, callbackFn) {

                $w.GameApp.IslandBusiness.useItemDecoration(slot.id, activeEnvi.id, decorinregion, function () {
                    scopeEnvi.refresData();
                    callbackFn();
                });
            });

        }


        if (slot.contentType == 'equipment') {
            var eqitem = $w.GameApp.IslandServices.getEquipItem(slot.eqId);
            if (!eqitem.hasOwnProperty('id')) {
                return false;
            }
            runEquipmentModule(eqitem);
        }

        if (slot.contentType == 'decoration') {
            var decor = $w.GameApp.IslandServices.getDecorItem(slot.activeDecorId);
            if (!decor.hasOwnProperty('id')) {
                return false;
            }

            var konfirm = myPopup.confirm({
                title: 'Confirmation',
                template: 'Put  ' + decor.name + ' to ' + activeEnvi.name + '?'
            });
            konfirm.then(function (isOk) {
                if (isOk)
                    runDecorModule(decor);
            });
        }
    };

    //-- untuk fix bug speciality thorod;
    _this.refreshDataInMenuIsland = function () {
        scopeEnvi.refresData();
    };

    //-- inject validasi char gak boleh kerja kalau umur char gak mencukupi;
    _this.validateIsLifespanCharCanWorking = function (playerCharId) {
        var char = $w.GameApp.CharServices.getPlayerCharById(playerCharId);
        var lifeRemaining = $w.GameApp.getTimeRemaining(char.lifeEnd);
        var duration = (function () {
            var result = 0;
            var hour = Number(String(char.action.duration).substr(0, 1));

            //-- konversi ke milisecond
            result = hour * (60 * 60 * 1000);

            return result;
        })();

        if (lifeRemaining.total > duration) {
            return true;
        } else {
            return false;
        }

        //-- slow=4, medium=2, rapid=1
        //console.log(char, lifeRemaining, duration);
    };


    //-- inject minigame
    _this.minigame = (function () {
        var mg = {};
        mg.enterGame = function () {
            var totalEnergy = Number($w.GameApp.MinigameData.totalEnergy);
            var charInRegion = $w.GameApp.CharServices.getEnviPlayerChar($w.GameApp.MinigameData.id);
           
            if (charInRegion.length == 0) {
                $w.enviLoading.show({
                    template: 'You must have a character to play.',
                    duration: 3000
                });

                return;
            }

            if (totalEnergy > 0) {
                window.location = 'minigame.html?regionId=' + $w.GameApp.MinigameData.id;
            } else {
                $w.enviLoading.show({
                    template: 'You dont have enough energy.',
                    duration: 3000
                });
            }
        };
        mg.fnEnergy = function (callback) {
            var playerInfo = $w.izyObject('PlayerInfo').getOne();
            var price = Number($w.GameApp.MinigameSettings.productsPrice.refill);
            var cnf = 'Are you sure want to fill energy for '+price+' diamonds ?';
            myPopup.confirm({ template: cnf, title: 'Confirmation' })
                  .then(function (res) {
                      if (!res) { return; }

                      //-- validate diamond
                      if (Number(playerInfo.diamondBalance) < price) {
                          myPopup.alert({ title: 'Alert', template: "You don't have enough diamond." });
                          return;
                      }
                      mg.refillEnergy(callback);
                  });
            
        };
        mg.refillEnergy = function (callback) {
            var xurl = $w.GameApp.serverURL + '/minigame/refill';
            var request = $w.GameApp.http.post(xurl, { regionId: $w.GameApp.MinigameData.id });

            $w.GameApp.ionicLoading.show();
            request.success(function (data) {
                $w.GameApp.MinigameData = data.MinigameData;

                $w.GameApp.rootScope.reloadPlayerData(callback)

            });
            request.finally(function () {
                $w.GameApp.ionicLoading.hide();
            });
            request.error(function () {
                evt.refillEnergy(callback);
            });
        };
        return mg;
    })();

    
    $w.GameApp.IslandEnviAnim = _this;
})(window);