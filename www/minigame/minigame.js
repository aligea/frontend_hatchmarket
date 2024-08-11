(function FirstRun($w) {
    var $ionicPlatform;

    function onIonicReady() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
            StatusBar.hide();
        }

        /** Handling back button to exit **/
        $ionicPlatform.registerBackButtonAction(function () {
            if (window.cordova && window.cordova.plugins.Keyboard && window.cordova.plugins.Keyboard.isVisible) {
                cordova.plugins.Keyboard.close();
                return;
            }

            //if ($w.document.getElementById('gameLayout').style.display == 'none') {
            //    var confirm = $w.confirm('Exit app ?');
            //    if (confirm) {
            //        $w.navigator.app.exitApp();
            //    }
            //}

            //-- back to home
            if (window.plugins && window.plugins.NativeAudio) {
                window.plugins.NativeAudio.stop('island');
            }
            //window.location.href = 'app.html';
        }, 100);

        function keyBoardHandler(e) {
            if (window.StatusBar) {
                StatusBar.hide();
                window.focus();
            }
        }

        window.addEventListener('native.keyboardshow', function () {
            $('.popup-container').css({
                'position': 'relative',
                'padding-top': '15%'
            });

            $('#inputNicknameForm').addClass('onKeyboardShow');
            keyBoardHandler();
        });
        window.addEventListener('native.keyboardhide', function () {
            $('.popup-container').css({
                'position': 'absolute',
                'padding-top': 'initial'
            });
            $('#inputNicknameForm').removeClass('onKeyboardShow');
            keyBoardHandler();
        });


        var waitingT;
        window.addEventListener('pause', function () {
            window.GameApp.Sounds.bgm1().pause();

            waitingT = window.setTimeout(function () {
                $w.navigator.app.exitApp();
            }, 60000);
        });
        window.addEventListener('resume', function () {
            window.clearTimeout(waitingT);
            window.GameApp.Sounds.bgm1().play();
            //window.open('index.html', '_self');
        });
    }

    function InitializeModule(ionicPlatform, $rootScope, $http, $ionicLoading) {
        $ionicPlatform = ionicPlatform;
        $w.GameApp.http = $http;
        $w.GameApp.ionicLoading = $ionicLoading;
        $w.GameApp.rootScope = $rootScope;

        $w.GameApp.rootScope.reloadPlayerData = function () { };
        $ionicPlatform.ready(function () {
            onIonicReady();
            $w.runMiniGame(function () { });
        });

        $http.defaults.transformRequest = function (_data) {
            if (_data === undefined) {
                return _data;
            }

            var data = Object(_data);
            data.sessid = $w.GameApp.getSess();
            return $.param(data);
        }
    }
    function ConfigurationModule($httpProvider) {
        $httpProvider.defaults.transformRequest = function (_data) {
            if (_data === undefined) {
                return _data;
            }

            var data = Object(data);
            data.sessid = $w.GameApp.getSess();
            //console.log($w.GameApp.getSess());
            return $.param(data);
        }
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8;';
    }

    $w.angular.module('gamesapp', ['ionic']).run(['$ionicPlatform', '$rootScope', '$http', '$ionicLoading', InitializeModule]);
    $w.angular.module('gamesapp').config(['$httpProvider', ConfigurationModule]);
})(window);

(function ($w) {
    var $ = $w.jQuery;
    var serverURL = $w.GameApp.serverURL;
    var rendererOptions = {
        antialiasing: false,
        transparent: true,
        resolution: window.devicePixelRatio,
        autoResize: true
    };

    function initializeDataIsland(cbFn) {
        var jsonData = $w.GameApp.JsonData;
        var assets = [
            { name: "enableHolder", url: 'asset/img/island/bulat-01.png' },
            { name: "disableHolder", url: 'asset/img/island/bulat-02.png' },
            { name: "blurbg", url: 'asset/img/island/bg-blur.jpg' },
            { name: "targetGold", url: 'animation/targets/gold/skeleton.json' },
            { name: "targetStone", url: 'animation/targets/stone/skeleton.json' },
            { name: "targetWood", url: 'animation/targets/wood/skeleton.json' },
            { name: "targetCoin", url: 'animation/targets/coin/skeleton.json' },
            { name: "goldEgg", url: 'asset/img/gold-egg.jpg' },
            { name: "silverEgg", url: 'asset/img/silver-egg.png' },
            { name: 'outerbar', url: 'asset/img/bar-outer.png' },
            { name: 'innerbar', url: 'asset/img/bar-inner.png' },
            { name: 'fnicon', url: 'asset/img/icons/FinishNow.png' },
            { name: "locked", url: 'asset/img/island/Locked.png' }

        ];
        var jsonAssets = [
            { name: "json_island", url: baseurl + '/data/island' },
            { name: "json_decoration", url: baseurl + '/data/decoration' },
            { name: "json_equipment", url: baseurl + '/data/equipment' },
            { name: "json_characters", url: baseurl + '/data/characters' },
            { name: "json_redeem", url: baseurl + '/data/redeemmaster' }
        ];

        validateJsonData();

        function fetchPixiAsset() {
            //for (var i = 0; i < jsonData.decoration.length; i++) {
            //  var item = jsonData.decoration[i];
            //  assets.push({ name: 'decorItem-' + item.id, url: item.imageUrl[1] });

            //  if (Number(item.id) === 9) {
            //    assets.push({ name: 'decorItem-' + item.id + '-2', url: item.imageUrl[2] });
            //  }
            //};

            $w.GameApp.JsonData = jsonData;

            var datachar = window.izyObject('PlayerChars').getAll();
            var uchid = [];
            for (var i = 0; i < datachar.length; i++) {
                var char = window.GameApp.CharServices.getChar(datachar[i].char_id);
                if (uchid.indexOf(char) < 0) {
                    uchid.push(char);
                }
            }
            for (var i = 0; i < uchid.length; i++) {
                var char = Object(uchid[i]);
                //console.log(char);
                assets.push({
                    name: 'char_' + char.id,
                    url: 'animation/characters/' + (String(char.name).toLowerCase()) + '/skeleton.json'
                });
            }
            ;

            $w.PIXI.loader.add(assets).load(onPixiAssetLoaded);

            $w.dispatchEvent(new CustomEvent('gamedataready', { bubble: true, cancelable: true }));
        }

        function onJsonLoaded(loader, res) {
            jsonData.decoration = window.jQuery.parseJSON(res.json_decoration.data).sort($w.sortById);
            jsonData.equipment = window.jQuery.parseJSON(res.json_equipment.data).sort($w.sortById);
            jsonData.island = window.jQuery.parseJSON(res.json_island.data).sort($w.sortById);
            jsonData.characters = window.jQuery.parseJSON(res.json_characters.data).sort($w.sortById);
            jsonData.redeem = window.jQuery.parseJSON(res.json_redeem.data);

            window.izyObject('json_decoration').store(jsonData.decoration);
            window.izyObject('json_equipment').store(jsonData.equipment);
            window.izyObject('json_island').store(jsonData.island);
            window.izyObject('json_characters').store(jsonData.characters);
            window.izyObject('json_redeem').store(jsonData.redeem);

            console.log('fetch masterdata from server');
            fetchPixiAsset();
        }
        ;

        function onPixiAssetLoaded(loader, res) {
            if (typeof (cbFn) === 'function') {
                cbFn();
            }
        }
        ;

        function fetchJsonData() {

        }

        function validateJsonData() {
            var isExist = true;
            for (var i = 0; i < jsonAssets.length; i++) {
                var dataName = jsonAssets[i].name;
                var data = window.izyObject(dataName).getOne();
                var name = dataName.replace('json_', '');

                if (data.length > 0) {
                    jsonData[name] = window.izyObject(dataName).getOne();
                } else {
                    return $w.PIXI.loader.add(jsonAssets).load(onJsonLoaded);
                }
            }

            console.log('fetch masterdata from local');
            fetchPixiAsset();
        }
    }

    function initMiniGame(cb) {
        var InitAppCallback = cb;
        var waitingT;

        $w.GameApp.isInitialized = true;

        var progress = {};
        progress.firstStep = function () {
            /** Progress 20%  */

            //-- loadIslandImage will be called twice to make sure the image map can be click
            //$w.GameApp.IslandServices.loadIslandImage();
            $w.GameApp.InitializeDataIsland(progress.onAfterDataLoaded);

        };
        progress.onAfterDataLoaded = function () {
            /** Progress 50% **/
            //$('#bar2').animate({ 'width': (pbW * 50 / 100) + 'px' }, 1000, 'swing', function () {
            //    $w.GameApp.IslandServices.PlayerIsland = $w.GameApp.JsonData.island;
            //    $w.GameApp.IslandServices.loadIslandImage();

            //    $w.GameApp.Animations.stop();
            //    $w.GameApp.Animations.reload(progress.finalStep);
            //});
            $w.GameApp.IslandServices.PlayerIsland = $w.GameApp.JsonData.island;
            progress.finalStep();
        };
        progress.finalStep = function () {
            /** Progress  100% **/

            //normalizeEventListener();
            //$('#bar2').animate({ 'width': (pbW * 100 / 100) + 'px' }, 500, 'swing', showMainLayout);

            //console.log('am i here ');
            var tWidth = 1080;
            var tHeight = 1920;

            var a = $w.innerWidth / 1080;
            var b = $w.innerHeight / 1920;
            var scl = Math.min(a, b);
            if (scl === b) {
                tHeight = $w.innerHeight;
                tWidth = tHeight / 1920 * 1080;
            } else {
                tWidth = $w.innerWidth;
                tHeight = tWidth / 1080 * 1920;
            }

            console.log(tWidth, tHeight, $w.devicePixelRatio);

            //window.GameApp.renderer = new $w.PIXI.autoDetectRenderer(tWidth, tHeight, rendererOptions, true);
            window.GameApp.renderer.view.style.margin = 'auto';
            //window.GameApp.renderer.view.style.border = '1px solid red';

            $('#gameLayout').html(window.GameApp.renderer.view);
            showMainLayout();
            $w.dispatchEvent(new CustomEvent('gameappready', { bubble: true, cancelable: true }));
        };

        function checkVersion() {
            if ($w.cordova) {
                $w.GameApp.uuid = device.uuid;
                cordova.getAppVersion.getVersionNumber(function (version) {
                    $w.GameApp.version = version;
                    checkServer();
                });
            } else {
                checkServer();
            }
        }

        function initializeGameAccount() {
            if (!console) {
                //window.GameApp.Account.init();
            }
            window.GameApp.Account.init();
        }

        function checkServer() {
            var oData = {};
            var pref = $w.izyObject('preference').get(1);
            if ($w.device) {
                oData = {
                    uuid: $w.GameApp.uuid,
                    platform: $w.device.platform,
                    connectedAccountId: pref.connectedAccountId,
                    device: JSON.stringify($w.device),
                    version: $w.GameApp.version
                }
            } else {
                //-- run gm account
                oData = {
                    uuid: 'hatchmarket',
                    platform: 'none',
                    connectedAccountId: 'hatchmarket'
                }
            }
            //console.log(oData);

            //$.ajax({
            //  url: serverURL,
            //  success: responCheckServer,
            //  crossDomain : false,
            //  dataType: 'json',
            //  data: oData,
            //  type: 'get',
            //  //headers: {'X-Requested-With': 'XMLHttpRequest'},
            //  error: function (response) {
            //    console.log(response);
            //    if ($w.device) {
            //      alert('Unable connect to server !');
            //      window.location.href = 'index.html';
            //    }

            //    //$w.open('index.html', '_self');
            //  }
            //});

            $.get(serverURL, oData, responCheckServer).error(function (response) {
                console.log(response, oData);
                if ($w.device) {
                    //alert('Unable connect to server !');
                    return navigator.notification.alert('Unable connect to server !', function () {
                        window.location = 'index.html';
                    });

                }
            });

            console.log('running to server');
        }

        function responCheckServer(response) {
            if (response) {
                var _response = response;

                /** Save Sess id **/
                $w.GameApp.sessid = response.sessid;
                $w.izyObject('sessid').store({ id: 1, sessid: $w.GameApp.sessid });

                /** running server time **/
                $w.GameApp.serverDate = new Date(_response.serverdate);

                /** validate version **/
                if ($w.GameApp.version !== _response.version) {
                    //alert('Update available, please install the new version.');
                    //$w.open(_response.updateurl, '_system');
                    //return;
                    return navigator.notification.alert('Update available, please install the new version.', function () {
                        $w.open(_response.updateurl, '_system');
                    });
                }

                /** validate server status **/
                if (_response.serverstatus !== 'active') {
                    //alert(_response.servermsg);
                    //$w.open('index.html', '_self');
                    //return;
                    return navigator.notification.alert(_response.servermsg, function () {
                        window.location = 'index.html';
                    });
                }
            }

            window.GameApp.loadSound('island');

            var regionId = $w.getQueryVariable('regionId');
            window.GameApp.MiniGame.setup(regionId);

        }

        function showMainLayout() {
            //window.GameApp.bgm = new Audio('asset/audio/Music_di_Environment_Pasir.mp3');
            //window.GameApp.bgm.play();
            //window.GameApp.bgm.loop = true;
            window.GameApp.loadSound('island');

            var regionId = $w.getQueryVariable('regionId');
            window.GameApp.MiniGame.setup(regionId);

            console.log('showMainLayout')
        }

        $w.addEventListener('minigameready', function () {
            $('#loadertrans').fadeOut();
        });
        $w.GameApp.initializePreference(checkVersion);
        console.log('begin run');
    }

    $w.GameApp = $w.GameApp || {};
    $w.GameApp.serverURL = serverURL;
    $w.GameApp.rendererOptions = rendererOptions;
    $w.runMiniGame = initMiniGame;
})(window);

(function ($w) {
    'use strict';

    var mg = { regionId: 0 };
    var MapLocations = (function () {
        var mloc = {
            atea: [],
            oidur: [],
            frusht: [],
            routh: []
        };
        mloc.atea[0] = { x: 367, y: 1679 };
        mloc.atea[1] = { x: 187, y: 1519 };
        mloc.atea[2] = { x: 547, y: 1519 };
        mloc.atea[3] = { x: 363, y: 1367 };
        mloc.atea[4] = { x: 727, y: 1367 };
        mloc.atea[5] = { x: 191, y: 1199 };
        mloc.atea[6] = { x: 547, y: 1195 };
        mloc.atea[7] = { x: 371, y: 1035 };
        mloc.atea[8] = { x: 547, y: 883 };
        mloc.atea[9] = { x: 371, y: 727 };
        mloc.atea[10] = { x: 723, y: 727 };
        mloc.oidur[0] = { x: 323, y: 1607 };
        mloc.oidur[1] = { x: 708, y: 1501 };
        mloc.oidur[2] = { x: 441, y: 1422 };
        mloc.oidur[3] = { x: 170, y: 1343 };
        mloc.oidur[4] = { x: 344, y: 1185 };
        mloc.oidur[5] = { x: 166, y: 1023 };
        mloc.oidur[6] = { x: 709, y: 1023 };
        mloc.oidur[7] = { x: 709, y: 863 };
        mloc.oidur[8] = { x: 346, y: 863 };
        mloc.oidur[9] = { x: 698, y: 701 };
        mloc.oidur[10] = { x: 364, y: 667 };
        mloc.frusht[0] = { x: 528, y: 1662 };
        mloc.frusht[1] = { x: 347, y: 1504 };
        mloc.frusht[2] = { x: 705, y: 1504 };
        mloc.frusht[3] = { x: 527, y: 1343 };
        mloc.frusht[4] = { x: 169, y: 1343 };
        mloc.frusht[5] = { x: 347, y: 1186 };
        mloc.frusht[6] = { x: 167, y: 1025 };
        mloc.frusht[7] = { x: 525, y: 1025 };
        mloc.frusht[8] = { x: 347, y: 865 };
        mloc.frusht[9] = { x: 705, y: 865 };
        mloc.frusht[10] = { x: 527, y: 705 };
        mloc.routh[0] = { x: 366, y: 1685 };
        mloc.routh[1] = { x: 365, y: 1525 };
        mloc.routh[2] = { x: 185, y: 1365 };
        mloc.routh[3] = { x: 726, y: 1525 };
        mloc.routh[4] = { x: 546, y: 1365 };
        mloc.routh[5] = { x: 367, y: 1207 };
        mloc.routh[6] = { x: 726, y: 1207 };
        mloc.routh[7] = { x: 546, y: 1047 };
        mloc.routh[8] = { x: 726, y: 887 };
        mloc.routh[9] = { x: 546, y: 728 };
        mloc.routh[10] = { x: 188, y: 727 };
        return mloc;
    })();
    var targetMaster = (function (regionId) {
        var tregion = [];
        //-- atea
        tregion[0] = [
            { t: 12, r: 9 },
            { t: 2, r: 7 },
            { t: 3, r: 11 },
            { t: 4, r: 6 },
            { t: 8, r: 1 }
        ];
        //-- oidur
        tregion[1] = [
            { t: 17, r: 10 },
            { t: 4, r: 8 },
            { t: 14, r: 9 },
            { t: 5, r: 12 },
            { t: 13, r: 6 }
        ];
        //-- frusht
        tregion[2] = [
            { t: 1, r: 8 },
            { t: 10, r: 12 },
            { t: 14, r: 9 },
            { t: 4, r: 6 },
            { t: 10, r: 9 }
        ];
        //-- routh
        tregion[3] = [
            { t: 3, r: 8 },
            { t: 14, r: 11 },
            { t: 17, r: 10 },
            { t: 15, r: 6 },
            { t: 2, r: 7 }
        ];
        //-- shuffling
        (function shuffling(tregion) {
            for (var i = 0; i < tregion.length; i++) {
                tregion[i] = tregion[i].shuffle();
                tregion[i] = tregion[i].shuffle();
                tregion[i] = tregion[i].shuffle();
            }
        })(tregion);
        return tregion;
    })(mg.regionId);
    var scale = $w.devicePixelRatio;
    var speedGame, productsPrice;

    var energyBusiness = (function () {
        var eb = {};
        eb.totalEnergy = 0;
        eb.container = new $w.PIXI.Container();
        eb.tikcer = function () {



        };
        eb.showEnergy = function () {
            var parent = eb.container.parent;
            eb.container.removeChildren(0, eb.container.children.length);
            eb.container.position.x = 35;
            eb.container.position.y = 60;
            for (var i = 0; i < eb.totalEnergy; i++) {
                var energy = new $w.PIXI.Sprite($w.PIXI.loader.resources.energyFill.texture);
                energy.position.x += i * (energy.width + 7);
                eb.container.addChild(energy);
            }
            //console.info(eb.totalEnergy)
        };
        return eb;
    })();
    var gameTimer = (function () {
        var gticker = {};
        //--
        var oneSecond = PIXI.timerManager.createTimer(1000);
        oneSecond.loop = true;
        //oneSecond.addListener('start', function (elapsed) {
        //    console.log('one second timer start');
        //});

        //oneSecond.on('repeat', function (time, counter) {

        //    if (gticker.container.children.length > 0) {
        //        gticker.container.removeChild(gticker.container.children[0]);
        //    }
        //    var text = new $w.PIXI.Text(time + ' ' + counter + ' ' + this.delay);
        //    gticker.container.addChild(text);
        //});
        gticker.container = new $w.PIXI.Container();
        //-- inject timer
        var timer1 = {};
        timer1.id = 0;
        timer1.isStop = false;
        timer1.interval = null;
        timer1.callback = function () { };
        timer1.start = function () {
            var startTimer = function () {
                $w.GameApp.ionicLoading.show();
                timer1.interval = $w.cordova.plugins.TimerPlugin.addInterval(function () {
                    mg.wave.timeBusiness.ticker();
                    console.debug('im here');
                }, 1000, function (id) {
                    timer1.id = id;
                    //$w.cordova.plugins.TimerPlugin.setCallback(id, mg.wave.timeBusiness.ticker);
                    $w.GameApp.ionicLoading.hide();
                    //-- inject counter tambahan
                    oneSecond.start();
                    //$w.navigator.notification.alert('Good luck !');
                }, function (a) {
                    console.debug('error ', a);
                    startTimer();
                });
            };
            startTimer();
        };
        timer1.stop = function () {
            var stoptimer = function (id) {
                $w.GameApp.ionicLoading.show();
                $w.cordova.plugins.TimerPlugin.deleteTimer(id, function () {
                    $w.cordova.plugins.TimerPlugin.setCallback(id, function () { });
                    $w.GameApp.ionicLoading.hide();
                });
                //-- inject counter tambahan
                oneSecond.stop();
            };
            stoptimer(timer1.interval);
            stoptimer(timer1.id);
        };
        timer1.on = function (evt, callback) {
            timer1.callback = callback;
            //-- inject counter tambahan
            oneSecond.on('repeat', function () {

                gticker.runCounter();
            });
        };

        gticker.timer1 = oneSecond;
        gticker.temp = timer1;
        gticker.counter = 0;
        gticker.runCounter = function () {
            gticker.counter += 1;
            console.debug(mg.wave.timeBusiness.countdown, gticker.counter);
            //-- inject counter tambahan
            var selisih = Math.abs(mg.wave.timeBusiness.counter - gticker.counter);
            if (selisih > 10) {
                // $w.navigator.notification.alert('You suspected cheating !!!');
                //globalEvent.onRestart();
            }



            if (gticker.container.children.length > 0) {
                gticker.container.removeChild(gticker.container.children[0]);
            }
            var text = new $w.PIXI.Text(mg.wave.timeBusiness.countdown + ' ' + gticker.counter);
            gticker.container.addChild(text);



        };
        return gticker;
    })();
    var globalEvent = (function () {
        var evt = {};
        evt.onRestart = function () {
            var popupScene = (function () {
                var result = new $w.PIXI.Container();
                for (var i = 0; i < mg.root.children.length; i++) {
                    if (mg.root.children[i].name == 'popupScene') {
                        result = mg.root.children[i];
                        break;
                    }
                }
                return result;
            })();
            var callback = function () {
                popupScene.visible = false;
                popupScene.removeAllListeners();
                popupScene.removeChild(popupScene.children[0]);

                containers.charContainer.visible = true;

                mg.wave.timeBusiness.countdown = speedGame.duration;
                mg.wave.currentStage = new mg.wave.createWaveStage(1);
                mg.wave.currentStage.setup();

                //-- inject counter tambahan
                gameTimer.counter = mg.wave.timeBusiness.countdown;
            };

            //-- validasi cukup gak energynya
            if (energyBusiness.totalEnergy <= 0) {
                //-- gak boleh restart
                return $w.navigator.notification.alert("You don't have enough energy.");
            }

            if (window.navigator.notification && window.navigator.notification.confirm) {
                window.navigator.notification.confirm('Restart to wave 1 ?', function (confirm) {
                    if (confirm == 1) {
                        gameTimer.timer1.stop();
                        evt.consumeEnergy(callback);
                    }
                }, 'Confirmation', ['Restart', 'Cancel']);
            } else {
                var konfirm = window.confirm('Restart to wave 1 ?');
                if (konfirm) {
                    gameTimer.timer1.stop();
                    evt.consumeEnergy(callback);
                }
            }
        };
        evt.continueWave = function () {
            var callback = function () {
                var popupScene = (function () {
                    var result = new $w.PIXI.Container();
                    for (var i = 0; i < mg.root.children.length; i++) {
                        if (mg.root.children[i].name == 'popupScene') {
                            result = mg.root.children[i];
                            break;
                        }
                    }
                    return result;
                })();
                //var timeLeft = mg.wave.timeBusiness.countdown;
                var waveNo = mg.wave.waveNo;

                containers.charContainer.visible = true;

                //mg.wave.timeBusiness.countdown += Number(speedGame.continueWave);
                mg.wave.timeBusiness.showTime();

                evt.showCoutdownTransition(function () {
                    containers.charContainer.visible = true;
                    gameTimer.timer1.start();
                });

                //-- inject counter tambahan
                gameTimer.counter = mg.wave.timeBusiness.countdown;
            };
            var xurl = $w.GameApp.serverURL + '/minigame/continue';
            var params = {
                regionId: mg.regionId,
                targetLeft: mg.wave.targetLeft,
                waveNo: mg.wave.waveNo
            };
            var request = $w.GameApp.http.post(xurl, params);
            $w.GameApp.ionicLoading.show();
            request.success(function (data) {
                mg.MinigameData = data.MinigameData;
                mg.PlayerInfo = data.PlayerInfo;

                energyBusiness.totalEnergy = Number(mg.MinigameData.totalEnergy);
                energyBusiness.showEnergy();

                mg.wave.timeBusiness.countdown = Number(data.countdown);
                mg.wave.timeBusiness.start = 0;
                mg.wave.timeBusiness.counter = Number(data.counter);

                evt.renderDiamond();
                if (typeof callback == 'function') {
                    callback()
                }
            });
            request.finally(function () {
                $w.GameApp.ionicLoading.hide();
            });
            request.error(function () {
                evt.fetchServerData(callback);
            });
        };
        evt.consumeEnergy = function (callback) {
            var xurl = $w.GameApp.serverURL + '/minigame/play';
            var request = $w.GameApp.http.post(xurl, { regionId: mg.regionId });

            $w.GameApp.ionicLoading.show();

            request.success(function (data) {
                mg.MinigameData = data.MinigameData;
                mg.PlayerInfo = data.PlayerInfo;
                energyBusiness.totalEnergy = Number(mg.MinigameData.totalEnergy);
                energyBusiness.showEnergy();
                if (typeof callback == 'function') {
                    callback()
                }
            });
            request.finally(function () {
                $w.GameApp.ionicLoading.hide();
            });
            request.error(function () {
                evt.consumeEnergy(callback);
            });
        };
        evt.winGame = function (callback) {
            var errorCount = 0;
            var sendToServer = function () {
                var xurl = $w.GameApp.serverURL + '/minigame/score';
                var params = {
                    regionId: mg.regionId,
                    totalTime: mg.wave.timeBusiness.counter,
                    sess: mg.MinigameData.sess
                };
                var request = $w.GameApp.http.post(xurl, params);

                //-- inject error handler
                if (errorCount > maxErrorPermited) {
                    $w.navigator.notification.alert('Disconnected to server');
                    $w.GameApp.ionicLoading.hide();
                    return callback();
                }

                $w.GameApp.ionicLoading.show({ template: 'Submitting to server...' });
                request.success(function (data) {
                    mg.MinigameData = data.MinigameData;
                    mg.PlayerInfo = data.PlayerInfo;
                    energyBusiness.totalEnergy = Number(mg.MinigameData.totalEnergy);
                    energyBusiness.showEnergy();
                    evt.renderDiamond();

                    if (typeof callback == 'function') {
                        callback()
                    }
                });
                request.finally(function () {
                    $w.GameApp.ionicLoading.hide();
                });
                request.error(function () {
                    errorCount++;
                    evt.winGame(callback);
                });

            };

            if ($w.device && String($w.device.platform).toLowerCase() == 'android') {
                $w.hacktools.check(sendToServer);
            } else {
                sendToServer();
            }

        };
        evt.onPlay = function () {
            var callback = function () {
                //--inject testing
                mg.wave.currentStage = new mg.wave.createWaveStage(1);
                mg.wave.currentStage.setup();
            };
            evt.consumeEnergy(callback);
        };
        evt.fetchServerData = function (callback) {
            var xurl = $w.GameApp.serverURL + '/minigame/fetchdata';
            var request = $w.GameApp.http.post(xurl, { regionId: mg.regionId });
            $w.GameApp.ionicLoading.show();
            request.success(function (data) {
                mg.MinigameData = data.MinigameData;
                mg.PlayerInfo = data.PlayerInfo;
                mg.GoldenHelper = Number(data.GoldenHelper);
                //-- inject settings
                speedGame = data.Settings.speedGame;
                productsPrice = data.Settings.productsPrice;
                mg.wave.timeBusiness.countdown = speedGame.duration;
                energyBusiness.totalEnergy = Number(mg.MinigameData.totalEnergy);
                energyBusiness.showEnergy();
                evt.renderDiamond();
                if (typeof callback == 'function') {
                    callback()
                }
            });
            request.finally(function () {
                $w.GameApp.ionicLoading.hide();
            });
            request.error(function () {
                evt.fetchServerData(callback);
            });
        };
        evt.refillEnergy = function (callback) {
            var xurl = $w.GameApp.serverURL + '/minigame/refill';
            var request = $w.GameApp.http.post(xurl, { regionId: mg.regionId });
            $w.GameApp.ionicLoading.show();
            request.success(function (data) {
                mg.MinigameData = data.MinigameData;
                mg.MinigameData = data.MinigameData;
                mg.PlayerInfo = data.PlayerInfo;
                energyBusiness.totalEnergy = Number(mg.MinigameData.totalEnergy);
                energyBusiness.showEnergy();
                evt.renderDiamond();
                if (typeof callback == 'function') {
                    callback()
                }
            });
            request.finally(function () {
                $w.GameApp.ionicLoading.hide();
            });
            request.error(function () {
                evt.refillEnergy(callback);
            });
        };
        evt.createCountdownContainer = function () {
            var res = $w.PIXI.loader.resources;
            var container = (function () {
                var size = { w: 1080, h: 1920 };
                var wrapper = new $w.PIXI.Container();
                var text1 = (function (container) {
                    var sprite = new $w.PIXI.Sprite(res.countdownText_1.texture);
                    sprite.position.x = (size.w - sprite.width) / 2;
                    sprite.position.y = (size.h - sprite.height) / 2;
                    sprite.alpha = 0;
                    return sprite;
                })(wrapper);
                var text2 = (function (container) {
                    var sprite = new $w.PIXI.Sprite(res.countdownText_2.texture);
                    sprite.position.x = (size.w - sprite.width) / 2;
                    sprite.position.y = (size.h - sprite.height) / 2;
                    sprite.alpha = 0;
                    return sprite;
                })(wrapper);
                var text3 = (function (container) {
                    var sprite = new $w.PIXI.Sprite(res.countdownText_3.texture);
                    sprite.position.x = (size.w - sprite.width) / 2;
                    sprite.position.y = (size.h - sprite.height) / 2;
                    sprite.alpha = 0;
                    return sprite;
                })(wrapper);
                wrapper.addChild(text1);
                wrapper.addChild(text2);
                wrapper.addChild(text3);
                return wrapper;
            })();
            return container;
        };
        evt.showCoutdownTransition = function (callback) {
            var popupScene = (function () {
                var result = new $w.PIXI.Container();
                for (var i = 0; i < mg.root.children.length; i++) {
                    if (mg.root.children[i].name == 'popupScene') {
                        result = mg.root.children[i];
                        break;
                    }
                }
                return result;
            })();
            var countdownContainer = evt.createCountdownContainer();
            popupScene.visible = true;
            popupScene.interactive = true;
            containers.charContainer.visible = false;
            if (popupScene.children.length > 0) {
                popupScene.removeChild(popupScene.children[0]);
            }
            if (mg.wave.waveBox && mg.wave.waveBox.destroy) {
                mg.wave.waveBox.visible = false;
                mg.wave.waveBox.removeAllListeners();
            }
            popupScene.addChild(countdownContainer);
            var order = 0;
            var showin = function () {
                var a = pixiCharm.fadeIn(countdownContainer.children[order], 20);
                a.onComplete = showout;
            };
            var showout = function () {
                var b = pixiCharm.fadeOut(countdownContainer.children[order], 20);
                b.onComplete = function () {
                    if (order == 2) {
                        callback();
                        popupScene.visible = false;
                    } else {
                        order++;
                        showin();
                    }
                };
            };
            showin();
            gameSounds.countdown();
        };
        evt.getDurationPlay = function () {
            var t = mg.wave.timeBusiness.counter * 1000;
            var seconds = Math.floor((t / 1000) % 60);
            var minutes = Math.floor((t / 1000 / 60) % 60);
            var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            var days = Math.floor(t / (1000 * 60 * 60 * 24));
            return ('0' + hours).slice(-2) + ' : ' + ('0' + minutes).slice(-2) + ' : ' + ('0' + seconds).slice(-2);
        };
        evt.renderDiamond = function () {
            var text = new $w.PIXI.Text(mg.PlayerInfo.diamondBalance, {
                font: 'normal 40px DKCoolCrayon', fill: '#fff', align: 'center'
            });
            containers.diamondWrapper.removeChildAt(0);
            containers.diamondWrapper.addChild(text);
        };
        return evt;
    })();
    var pauseBusiness = (function () {
        var pauseEvt = {};
        pauseEvt.container = null;
        pauseEvt.createPauseBox = function () {
            var res = $w.PIXI.loader.resources;
            var boxContainer = new window.PIXI.Container();
            var popupBox = new $w.PIXI.Sprite(res.popupBox.texture);

            popupBox.scale.set(1.5, 1.5);
            boxContainer.addChild(popupBox);
            boxContainer.height = popupBox.height;
            boxContainer.width = popupBox.width;
            boxContainer.position.x = (1080 - boxContainer.width) / 2;
            boxContainer.position.y = (1920 - boxContainer.height) / 2;

            var textPause = (function (boxContainer) {
                var text = new $w.PIXI.Sprite(res.textPause.texture);
                text.position.y = 100;
                text.position.x = (boxContainer.width - text.width) / 2;
                return text;
            })(boxContainer);
            var resumetBtn = (function (boxContainer) {
                var btn = new $w.PIXI.Sprite(res.buttonBg.texture);
                var textBtn = new $w.PIXI.Text('Resume', { font: 'normal 24px DKCoolCrayon', fill: '#fff', align: 'center' });
                textBtn.scale.set(2, 2);
                textBtn.position.x = (btn.width - textBtn.width) / 2;
                textBtn.position.y = (btn.height - textBtn.height) / 2;
                btn.addChild(textBtn);
                btn.position.y = 200;
                btn.position.x = (boxContainer.width - btn.width) / 2;
                btn = new buttonBusiness.setup(btn);
                btn.callback = pauseEvt.onResume;
                return btn;
            })(boxContainer);
            var restartBtn = (function (boxContainer) {
                var btn = new $w.PIXI.Sprite(res.buttonBg.texture);
                var textBtn = new $w.PIXI.Text('Restart', { font: 'normal 24px DKCoolCrayon', fill: '#fff', align: 'center' });
                textBtn.scale.set(2, 2);
                textBtn.position.x = (btn.width - textBtn.width) / 2;
                textBtn.position.y = (btn.height - textBtn.height) / 2;

                btn.addChild(textBtn);

                btn.position.y = 100;
                btn.position.x = (boxContainer.width - btn.width) / 2;
                btn = new buttonBusiness.setup(btn);
                btn.callback = function () { };
                if (energyBusiness.totalEnergy <= 0) {
                    btn.alpha = 0.5;
                    btn.interactive = false;
                    btn.callback = function () { };
                } else {
                    btn.callback = pauseEvt.onRestart;
                }

                return btn;
            })(boxContainer);
            var exitBtn = (function (boxContainer) {
                var exitBtn = new $w.PIXI.Sprite(res.buttonBg.texture);
                var exitText = new $w.PIXI.Text('Exit', { font: 'normal 24px DKCoolCrayon', fill: '#fff', align: 'center' });

                exitText.scale.set(2, 2);
                exitText.position.x = (exitBtn.width - exitText.width) / 2;
                exitText.position.y = (exitBtn.height - exitText.height) / 2;
                exitBtn.addChild(exitText);
                exitBtn.position.y = 500;
                exitBtn.position.x = (boxContainer.width - exitBtn.width) / 2;
                exitBtn = new buttonBusiness.setup(exitBtn);
                exitBtn.callback = buttonBusiness.exit;

                return exitBtn;
            })(boxContainer);

            resumetBtn.position.y = textPause.position.y + textPause.height + 70;
            restartBtn.position.y = resumetBtn.position.y + resumetBtn.height + 20;
            exitBtn.position.y = restartBtn.position.y + restartBtn.height + 20;

            boxContainer.addChild(resumetBtn);
            boxContainer.addChild(restartBtn);
            boxContainer.addChild(exitBtn);
            boxContainer.addChild(textPause);
            pauseEvt.container = boxContainer;

            return boxContainer;
        };
        pauseEvt.showScene = function () {
            var popupScene = (function () {
                var result = new $w.PIXI.Container();
                for (var i = 0; i < mg.root.children.length; i++) {
                    if (mg.root.children[i].name == 'popupScene') {
                        result = mg.root.children[i];
                        break;
                    }
                }
                return result;
            })();
            var oldBox = popupScene.children[0];
            popupScene.visible = true;
            popupScene.interactive = true;
            popupScene.removeChild(oldBox);

            if (!pauseEvt.container) {
                pauseEvt.container = pauseEvt.createPauseBox();
            }

            pauseEvt.container.visible = true;
            popupScene.addChild(pauseEvt.container);
            containers.charContainer.visible = false;

            gameTimer.timer1.stop();
        };
        pauseEvt.onResume = function () {
            var popupScene = (function () {
                var result = new $w.PIXI.Container();
                for (var i = 0; i < mg.root.children.length; i++) {
                    if (mg.root.children[i].name == 'popupScene') {
                        result = mg.root.children[i];
                        break;
                    }
                }
                return result;
            })();
            popupScene.visible = false;
            gameTimer.timer1.start();
            containers.charContainer.visible = true;
        };
        pauseEvt.onRestart = globalEvent.onRestart;
        return pauseEvt;
    })();
    var buttonBusiness = (function () {
        var onButtonDown = function () {
            this.alpha = 0.8;
            if (!this.noButtonSound) {
                gameSounds.button();
            }
            console.info('button down')
        };
        var onButtonUp = function () {
            this.alpha = 1;
            console.info('button up')
        };
        var noop = function () {
            if (typeof this.callback == 'function') {
                this.callback();
            } else {
                console.log(callback)
            }
            console.info('button click/tap')
        };
        return {
            setup: function (btn) {
                btn.interactive = true;
                // set the mousedown and touchstart callback...
                btn.on('mousedown', onButtonDown);
                btn.on('touchstart', onButtonDown);
                // set the mouseup and touchend callback...
                btn.on('mouseup', onButtonUp);
                btn.on('touchend', onButtonUp);
                btn.on('mouseupoutside', onButtonUp);
                btn.on('touchendoutside', onButtonUp);
                btn.tap = noop;
                btn.click = noop;
                return btn;
            },
            exit: function () {
                if (window.navigator.notification && window.navigator.notification.confirm) {
                    window.navigator.notification.confirm('Quit the game then back to island ?', function (confirm) {
                        if (confirm == 1) {
                            window.location = 'island.html?regionId=' + mg.regionId;
                        }
                    }, 'Confirmation', ['Back to island', 'Cancel']);
                } else {
                    var konfirm = window.confirm('Quit the game then back to island ?');
                    if (konfirm) {
                        window.location = 'island.html?regionId=' + mg.regionId;
                    }
                }
            }
        };
    })();

    var gameSounds = (function () {
        var assets = {
            click: 'minigame/assets/sounds/Button_Sound.mp3',
            win: 'minigame/assets/sounds/yipeee-win.mp3',
            tapTarget: 'minigame/assets/sounds/Fairy-Wee-Voice.mp3',
            tapRival: 'minigame/assets/sounds/Loser.mp3',
            tapAdd: 'minigame/assets/sounds/cartoon-croaky-yell.mp3',
            timeout: 'minigame/assets/sounds/Loser.mp3',
            countdown: 'minigame/assets/sounds/Ready-Steady-Go.mp3'
        };
        var cb = { success: function () { }, error: function () { } };
        //-- preload sound
        window.document.addEventListener('deviceready', function () {
            if (window.plugins && window.plugins.NativeAudio) {
                window.plugins.NativeAudio.preloadSimple('click', assets.click, cb.success, cb.error);
                window.plugins.NativeAudio.preloadSimple('win', assets.win, cb.success, cb.error);
                window.plugins.NativeAudio.preloadSimple('tapTarget', assets.tapTarget, cb.success, cb.error);
                window.plugins.NativeAudio.preloadSimple('tapRival', assets.tapRival, cb.success, cb.error);
                window.plugins.NativeAudio.preloadSimple('tapAdd', assets.tapAdd, cb.success, cb.error);
                window.plugins.NativeAudio.preloadSimple('countdown', assets.countdown, cb.success, cb.error);
                window.plugins.NativeAudio.preloadSimple('timeout', assets.timeout, cb.success, cb.error);
            }
        });
        return {
            rival: function () {
                //The explosion sound
                (function explosionSound() {
                    soundEffect(
                            16, //frequency
                            0, //attack
                            1, //decay
                            "sawtooth", //waveform
                            1, //volume
                            0, //pan
                            0, //wait before playing
                            0, //pitch bend amount
                            false, //reverse
                            0, //random pitch range
                            50, //dissonance
                            undefined, //echo: [delay, feedback, filter]
                            undefined    //reverb: [duration, decay, reverse?]
                            );
                });
                try {
                    window.plugins.NativeAudio.play('tapRival');
                } catch (e) {

                }

            },
            target: function () {
                //The bonus points sound
                (function bonusSound() {
                    //D
                    soundEffect(587.33, 0, 0.2, "square", 1, 0, 0);
                    //A
                    soundEffect(880, 0, 0.2, "square", 1, 0, 0.1);
                    //High D
                    soundEffect(1174.66, 0, 0.3, "square", 1, 0, 0.2);
                });
                try {
                    window.plugins.NativeAudio.play('tapTarget');
                } catch (e) {

                }
            },
            additional: function () {
                //The jump sound
                (function jumpSound() {
                    soundEffect(
                            23.25, //frequency
                            0.05, //attack
                            0.2, //decay
                            "triangle", //waveform
                            3, //volume
                            0.8, //pan
                            0, //wait before playing
                            600, //pitch bend amount
                            true, //reverse
                            100, //random pitch range
                            0, //dissonance
                            undefined, //echo: [delay, feedback, filter]
                            undefined     //reverb: [duration, decay, reverse?]
                            );
                });
                try {
                    window.plugins.NativeAudio.play('tapAdd');
                } catch (e) {

                }

            },
            timeout: function () {
                try {
                    window.plugins.NativeAudio.play('timeout');
                } catch (e) {

                }
            },
            button: function () {
                try {
                    window.plugins.NativeAudio.play('click');
                } catch (e) {

                }
            },
            win: function () {
                try {
                    window.plugins.NativeAudio.play('win');
                } catch (e) {

                }
            },
            countdown: function () {
                try {
                    window.plugins.NativeAudio.play('countdown');
                } catch (e) {

                }
            }
        };
    })();
    var pixiCharm = new $w.Charm($w.PIXI);
    var containers = {
        popupScene: new $w.PIXI.Container(),
        gameScene: new $w.PIXI.Container(),
        mainScene: new $w.PIXI.Container(),
        timeBar: new $w.PIXI.Container(),
        waveBar: new $w.PIXI.Container(),
        pauseBtn: new $w.PIXI.Container(),
        restartBtn: new $w.PIXI.Container(),
        charContainer: new $w.PIXI.Container(),
        timeContainer: new $w.PIXI.Container(),
        diamondWrapper: new $w.PIXI.Container(),
        groupCharHolder: { g1: [], g2: [], g3: [] },
        targetLeft: {}
    };
    var holeSize = { width: 167, height: 39 };
    var charSize = { width: 120, height: 85 };

    var positions = { targetObj: { x: 0, y: 0 } };
    var checkIsDeviceRooted = function () {
        var successCallback = function (result) {
            var isDevicesRooted = result == 1;
            if (isDevicesRooted) {
                gameTimer.timer1 = gameTimer.temp;
                $w.navigator.notification.alert('This device is rooted. Use at your own risks.');
            }
            sendToServer(Number(isDevicesRooted));
        };
        var errorCallback = function (error) {
            console.error(error);
        };
        var sendToServer = function (isDeviceRooted) {
            var xurl = $w.GameApp.serverURL + '/minigame/rooted';
            var request = $w.GameApp.http.post(xurl, { rooted: isDeviceRooted });
            request.error(function () {
                sendToServer(isDeviceRooted);
            });
        };
        rootdetection.isDeviceRooted(successCallback, errorCallback);
    };
    var maxErrorPermited = 120;

    mg.wave = (function () {
        var _this = {};
        var res = $w.PIXI.loader.resources;
        var targets = [];
        var WaveStage = function (stageId) {
            (function choosingTargetChar() {
                containers.waveBar.visible = true;
                //-- set target char sesuai dengan region id
                if (targets.length == 0) {
                    _this.setTargetWave();
                }

                var randomizedTarget = targets;
                var waveBarContainer = (function () {
                    (function normalisasi() {
                        var oldChildren = [];
                        for (var i = 0; i < containers.waveBar.children.length; i++) {
                            var child = containers.waveBar.children[i];
                            if (child.name == 'temp') {
                                oldChildren.push(child);
                                child.visible = false;
                            }
                        }
                        for (var i = 0; i < oldChildren.length; i++) {
                            containers.waveBar.removeChild(oldChildren[i]);
                            oldChildren[i].destroy();
                        }
                        oldChildren.splice(0, oldChildren.length);
                    })();
                    var target = randomizedTarget[stageId - 1];
                    //-- tampilkan judul wave kotak tengah
                    var waveContainer = containers.waveBar;
                    var textWave = (function () {
                        var wave1 = new $w.PIXI.Sprite(res['textWave' + stageId].texture);
                        wave1.scale.set(0.6, 0.6);
                        wave1.position.x = (waveContainer.width - wave1.width) / 2;
                        wave1.position.y = 25;
                        return wave1;
                    })();
                    //-- munculkan monster target
                    var rowTarget = (function () {
                        var helperObj = (function () {
                            var src = (mg.GoldenHelper > 0) ? res['char_' + mg.GoldenHelper].texture : res.goldenhelper.texture;
                            var spr = new $w.PIXI.Sprite(src);
                            return spr;
                        })();
                        var targetObj = (function () {
                            var targetObj = new $w.PIXI.Sprite(res['char_' + target.t].texture);
                            targetObj.position.x = targetObj.width + 65;
                            targetObj.name = 'targetObj';
                            return targetObj;
                        })();
                        var rowTarget = new $w.PIXI.Container();
                        var textTarget = new $w.PIXI.Text('10', { font: 'normal 60px DKCoolCrayon', fill: 0x000, align: 'center' });
                        var targetLeftContainer = (function (sibling) {
                            var targetLeftContainer = new $w.PIXI.Container();
                            targetLeftContainer.addChild(textTarget);
                            targetLeftContainer.name = 'targetCounter';
                            targetLeftContainer.position.x = sibling.position.x + sibling.width + 30;
                            targetLeftContainer.position.y = (sibling.height - targetLeftContainer.height) / 2;
                            //-- inject shortcut
                            containers.targetLeft = targetLeftContainer;
                            return targetLeftContainer;
                        })(targetObj);
                        rowTarget.addChild(helperObj);
                        rowTarget.addChild(targetObj);
                        rowTarget.addChild(targetLeftContainer);
                        rowTarget.position.x = (waveContainer.width - rowTarget.width) / 2;
                        rowTarget.position.y = 100;
                        return rowTarget;
                    })();
                    var rowRival = (function (sibling) {
                        var rowRival = new $w.PIXI.Container();
                        var rivalObj = new $w.PIXI.Sprite(res['char_' + target.r].texture);
                        var textRival = new $w.PIXI.Text('X', { font: 'normal 60px DKCoolCrayon', fill: 'red', align: 'center' });
                        rowRival.addChild(rivalObj);
                        rowRival.addChild(textRival);
                        textRival.position.x = rivalObj.position.x + rivalObj.width + 30;
                        textRival.position.y = (rivalObj.height - textRival.height) / 2;
                        rowRival.position.y = sibling.position.y + rivalObj.height + 20;
                        rowRival.position.x = (waveContainer.width - rowRival.width) / 2;
                        return rowRival;
                    })(rowTarget);
                    textWave.name = 'temp';
                    rowTarget.name = 'temp';
                    rowRival.name = 'temp';
                    waveContainer.addChild(textWave);
                    waveContainer.addChild(rowTarget);
                    waveContainer.addChild(rowRival);
                })();
                var charInHoles = (function () {
                    /**
                     * acak char
                     */
                    var result = [];
                    var actors = (function () {
                        var ac = [];
                        ac = randomizedTarget[stageId - 1];
                        if (ac.r == mg.GoldenHelper) {
                            var nidx = stageId;
                            if (nidx > 4) {
                                nidx = 1;
                            }
                            ac = randomizedTarget[nidx];
                        }
                        return ac;
                    })();
                    var targetChar = (function () {
                        var tchar = [actors.t];
                        if (mg.GoldenHelper > 0) {
                            tchar.push(mg.GoldenHelper);
                        }
                        return tchar;
                    })();
                    var additionalChars = (function () {
                        var temp = [];
                        var result = [];
                        for (var i = 1; i <= 20; i++) {
                            if (i != actors.r && i != actors.t && i != mg.GoldenHelper) {
                                temp.push(i);
                                temp.shuffle();
                            }
                        }
                        for (var i = 0; i < 6; i++) {
                            var rnum = $w.randomInt(0, temp.length - 1);
                            result.push(temp[rnum]);
                            temp.splice(rnum, 1)
                        }

                        //-- jika ada golden helper maka kurangi 1 additional
                        if (mg.GoldenHelper > 0) {
                            result.splice(0, 1);
                            result.shuffle();
                        }


                        return result;
                    })();
                    var rivalChars = (function () {
                        var result = [];
                        for (var i = 0; i < 4; i++) {
                            result.push(actors.r);
                        }
                        return result;
                    })();
                    result = result.concat(targetChar);
                    result = result.concat(additionalChars);
                    result = result.concat(rivalChars);
                    for (var i = 0; i < (result.length / 2) ; i++) {
                        result.shuffle();
                    }

                    return result;
                })();
                var groups = (function (charInHoles) {
                    var result = {
                        g1: [],
                        g2: [],
                        g3: []
                    };
                    var availables = (function () {
                        var temp = [];
                        for (var i = 0; i < charInHoles.length; i++) {
                            temp.push(i);
                        }

                        //temp.shuffle();
                        return temp;
                    })();
                    var gidx = 1;
                    for (var i = 0; i < charInHoles.length; i++) {
                        if (result['g' + gidx].length === 4) {
                            gidx++;
                        }
                        var ridx = $w.randomInt(0, availables.length - 1);
                        result['g' + gidx].push(availables[ridx]);
                        availables.splice(ridx, 1);
                    }

                    return result;
                })(charInHoles);
                var charContainer = (function () {
                    var holeSize = { width: 167, height: 39 };
                    var charSize = { width: 120, height: 85 };
                    var tContainer = (function () {
                        var tContainer = new $w.PIXI.Container();
                        tContainer.width = 1080;
                        tContainer.height = 1920;
                        (function normalisasiChar() {
                            var oldChildren = [];
                            //-- reset isi group sebelumnya
                            for (var i = 1; i <= 3; i++) {
                                var tempGroup = containers.groupCharHolder['g' + i];
                                for (var k = 0; k < tempGroup.length; k++) {
                                    var childGroup = tempGroup[k];
                                    oldChildren.push(childGroup);
                                }
                                tempGroup.splice(0, tempGroup.length);
                            }


                            //-- hapus char sebelumnya
                            for (var idx = 0; idx < oldChildren.length; idx++) {
                                var child = oldChildren[idx];
                                if (child.destroy) {
                                    //child.destroy();
                                    child.stop = true;
                                }
                            }
                        })();
                        for (var i = 1; i <= 3; i++) {
                            var group = groups['g' + i];
                            for (var j = 0; j < group.length; j++) {
                                var idx = group[j];
                                var holeLocation = mg.holeLocation[group[j]];
                                var charHolder = (function () {
                                    var charHolder = new $w.PIXI.Container();
                                    charHolder.width = charSize.width;
                                    charHolder.height = charSize.height;
                                    charHolder.name = j;
                                    charHolder.groupName = i;
                                    var charId = charInHoles[group[j]];
                                    var charSprite = (function () {
                                        var charSprite = new $w.PIXI.Sprite(res['char_' + charId].texture);
                                        var callback = function () {
                                            if (this.charType == 'rival') {
                                                gameSounds.rival();
                                            } else if (this.charType == 'target') {
                                                gameSounds.target();
                                            } else {
                                                gameSounds.additional();
                                            }
                                        };
                                        charSprite.interactive = true;
                                        charSprite.charId = charId;
                                        charSprite.charType = (function () {
                                            if (charId == randomizedTarget[stageId - 1].r) {
                                                return 'rival';
                                            }
                                            if (charId == randomizedTarget[stageId - 1].t || charId == mg.GoldenHelper) {
                                                return 'target';
                                            }
                                            return 'additional';
                                        })();
                                        charSprite.noButtonSound = true;
                                        charSprite.isGoldenHelper = (mg.GoldenHelper == charId) ? true : false;
                                        charSprite.on('touchstart', callback);
                                        return charSprite;
                                    })();
                                    charHolder.addChild(charSprite);
                                    return charHolder;
                                })();
                                tContainer.addChild(charHolder);
                                charHolder.position.x = holeLocation.x + ((holeSize.width - charSize.width) / 2);
                                charHolder.position.y = (holeLocation.y - charHolder.height) + (holeSize.height / 2);
                                //-- inject shortcut
                                containers.groupCharHolder['g' + i].push(charHolder);
                            }
                        }

                        tContainer.groups = groups;
                        tContainer.charInHoles = charInHoles;
                        return tContainer;
                    })();
                    tContainer.name = 'gamecharContainer';
                    //-- inject shortcut
                    //for (var i = 0; i < containers.charContainer.children.length; i++) {
                    //    var oldChild = containers.charContainer.children[i];
                    //    containers.charContainer.removeChild(oldChild);
                    //    if (oldChild.destroy) {
                    //        oldChild.destroy();
                    //    }
                    //}
                    containers.charContainer.visible = false;
                    containers.charContainer = tContainer;
                    containers.gameScene.addChild(tContainer);
                    return tContainer;
                })();
            })();

            var popupScene = (function () {
                var result = new $w.PIXI.Container();
                for (var i = 0; i < mg.root.children.length; i++) {
                    if (mg.root.children[i].name == 'popupScene') {
                        result = mg.root.children[i];
                        break;
                    }
                }
                return result;
            })();
            var oldBox = (function () {
                var boxContainer = popupScene.children[0];
                return boxContainer;
            })();
            var createStageDialog = function () {
                var popupBox = (function () {
                    var popupBox = new $w.PIXI.Sprite(res.popupBox.texture);
                    popupBox.scale.set(1.5, 1.7);
                    return popupBox;
                })();
                var boxContainer = (function () {
                    var boxContainer = new window.PIXI.Container();
                    boxContainer.addChild(popupBox);
                    boxContainer.height = popupBox.height;
                    boxContainer.width = popupBox.width;
                    boxContainer.position.x = (popupScene.width - boxContainer.width) / 2;
                    boxContainer.position.y = (popupScene.height - boxContainer.height) / 2;
                    return boxContainer;
                })();
                var waveTitle = (function () {
                    var wave1 = new $w.PIXI.Sprite(res['textWave' + stageId].texture);
                    // wave1.scale.set(2.5, 2.5);
                    wave1.position.x = (boxContainer.width - wave1.width) / 2;
                    wave1.position.y = 80;
                    return wave1;
                })();
                var subTitle = (function (waveTitle) {
                    var subTitle = new $w.PIXI.Text('Complete 5 waves  to get ' + productsPrice.reward + ' diamonds.', { font: 'normal 30px DKCoolCrayon', fill: 0x000, align: 'center' });
                    //subTitle.scale.set(1.5, 1.5);
                    subTitle.position.x = (boxContainer.width - subTitle.width) / 2;
                    subTitle.position.y = waveTitle.position.y + waveTitle.height + 20;
                    return subTitle;
                })(waveTitle);
                var target = targets[stageId - 1];
                var rowTarget = (function (sibling) {
                    var textTarget = new $w.PIXI.Text('Target', { font: 'normal 60px DKCoolCrayon', fill: 0x000, align: 'center' });
                    var rowTarget = new $w.PIXI.Container();
                    var targetObj = new $w.PIXI.Sprite(res['char_' + target.t].texture);
                    rowTarget.width = targetObj.width * 4;
                    rowTarget.height = targetObj.height;
                    textTarget.position.x = targetObj.width * 2;
                    rowTarget.addChild(targetObj);
                    rowTarget.addChild(textTarget);
                    rowTarget.position.y = sibling.position.y + sibling.height + 30;
                    rowTarget.position.x = (boxContainer.width - rowTarget.width) / 2;
                    rowTarget.position.x = targetObj.width * 1.5;
                    return rowTarget;
                })(subTitle);
                var rowHelper = (function (sibling) {
                    var textRival = new $w.PIXI.Text('Golden Helper', { font: 'normal 40px DKCoolCrayon', fill: '#000', align: 'center' });
                    var rivalObj = (function () {
                        var src = (mg.GoldenHelper > 0) ? res['char_' + mg.GoldenHelper].texture : res.goldenhelper.texture;
                        var spr = new $w.PIXI.Sprite(src);
                        return spr;
                    })();
                    var rowRival = new $w.PIXI.Container();
                    rowRival.width = rowTarget.width;
                    rowRival.height = rowTarget.height;
                    textRival.position.x = rivalObj.width * 2;
                    textRival.position.y = rivalObj.position.y + ((rivalObj.height - textRival.height) / 2);
                    rowRival.addChild(rivalObj);
                    rowRival.addChild(textRival);
                    rowRival.position.y = sibling.position.y + sibling.height + 30;
                    rowRival.position.x = sibling.position.x;
                    return rowRival;
                })(rowTarget);
                var rowRival = (function (sibling) {
                    var textRival = new $w.PIXI.Text('X', { font: 'normal 60px DKCoolCrayon', fill: 'red', align: 'center' });
                    var rivalObj = new $w.PIXI.Sprite(res['char_' + target.r].texture);
                    var rowRival = new $w.PIXI.Container();
                    rowRival.width = rowTarget.width;
                    rowRival.height = rowTarget.height;
                    textRival.position.x = rivalObj.width * 2;
                    rowRival.addChild(rivalObj);
                    rowRival.addChild(textRival);
                    rowRival.position.y = sibling.position.y + sibling.height + 30;
                    rowRival.position.x = sibling.position.x;
                    return rowRival;
                })(rowHelper);
                var textFooter = (function (sibling) {
                    var textFooter = new $w.PIXI.Text('Your mission : \n Tap 10 targets in each wave', { font: 'normal 35px DKCoolCrayon', fill: 0x000, align: 'center' });
                    textFooter.position.y = sibling.position.y + sibling.height + 20;
                    textFooter.position.x = (boxContainer.width - textFooter.width) / 2;
                    return textFooter;
                })(rowRival);
                var startButton = (function () {
                    var startButton = new $w.PIXI.Sprite(res.buttonBg.texture);
                    startButton.position.x = (boxContainer.width - startButton.width) / 2;
                    startButton.position.y = textFooter.position.y + textFooter.height + 20;
                    var startText = new $w.PIXI.Text('Start', { font: 'normal 40px DKCoolCrayon', fill: '#fff', align: 'center' });
                    startText.position.x = (startButton.width - startText.width) / 2;
                    startText.position.y = (startButton.height - startText.height) / 2;
                    startButton.addChild(startText);
                    startButton = new buttonBusiness.setup(startButton);
                    startButton.callback = function () {
                        globalEvent.showCoutdownTransition(_this.startGame);
                    };
                    return startButton;
                })();
                boxContainer.addChild(rowTarget);
                boxContainer.addChild(rowRival);
                boxContainer.addChild(rowHelper);
                boxContainer.addChild(waveTitle);
                boxContainer.addChild(subTitle);
                boxContainer.addChild(textFooter);
                boxContainer.addChild(startButton);
                return boxContainer;
            };

            popupScene.interactive = true;

            this.setup = function () {
                var dialogContainer = createStageDialog();
                var popupScene = (function () {
                    var result = new $w.PIXI.Container();
                    for (var i = 0; i < mg.root.children.length; i++) {
                        if (mg.root.children[i].name == 'popupScene') {
                            result = mg.root.children[i];
                            break;
                        }
                    }
                    return result;
                })();

                containers.pauseBtn.visible = true;
                containers.timeBar.visible = true;

                if (popupScene.children.length > 0) {
                    popupScene.children[0].visible = false;
                    popupScene.removeAllListeners();
                    popupScene.removeChild(popupScene.children[0]);
                }

                popupScene.visible = true;
                popupScene.interactive = true;

                if (stageId > 1) {
                    gameSounds.win();
                }

                _this.waveBox = dialogContainer;
                popupScene.addChild(dialogContainer);
            };
            this.target = targets[stageId - 1];

            //-- reset counter main
            if (stageId == 1) {
                _this.timeBusiness.counter = 0;

                _this.timeBusiness.start = 0;

                //-- inject counter tambahan
                gameTimer.counter = 0;
            }

            _this.timeBusiness.showTime();
            _this.waveNo = stageId;
        };

        _this.targetWaves = [];
        _this.setTargetWave = function () {
            var tmaster = [
                { t: 12, r: 9 },
                { t: 2, r: 7 },
                { t: 3, r: 11 },
                { t: 4, r: 6 },
                { t: 8, r: 1 },
                { t: 17, r: 10 },
                { t: 4, r: 8 },
                { t: 14, r: 9 },
                { t: 5, r: 12 },
                { t: 13, r: 6 },
                { t: 1, r: 8 },
                { t: 10, r: 12 },
                { t: 14, r: 9 },
                { t: 4, r: 6 },
                { t: 10, r: 9 },
                { t: 3, r: 8 },
                { t: 14, r: 11 },
                { t: 17, r: 10 },
                { t: 13, r: 6 },
                { t: 2, r: 7 }

            ];
            _this.targetWaves = [];
            tmaster.shuffle();
            for (var i = 0; i < tmaster.length; i++) {
                if (tmaster[i].r == mg.GoldenHelper) {
                    continue;
                }
                _this.targetWaves.push(tmaster[i]);
                if (_this.targetWaves.length == 5) {
                    break;
                }
            }
            targets = _this.targetWaves;
        };
        _this.currentStage = {};
        _this.targetLeft = 10;
        _this.waveBox = new $w.PIXI.Container();
        _this.waveNo = 0;
        _this.failed = function () {
            var errorCount = 0;
            var callback = function (data) {
                var rivalCharId = _this.currentStage.target.r;
                var popupScene = (function () {
                    var result = new $w.PIXI.Container();
                    for (var i = 0; i < mg.root.children.length; i++) {
                        if (mg.root.children[i].name == 'popupScene') {
                            result = mg.root.children[i];
                            break;
                        }
                    }
                    return result;
                })();
                var oldBox = popupScene.children[0];
                var boxContainer = (function () {
                    var popupBox = (function () {
                        var popupBox = new $w.PIXI.Sprite(res.popupBox.texture);
                        popupBox.scale.set(1.5, 2);
                        return popupBox;
                    })();
                    var boxContainer = (function () {
                        var boxContainer = new window.PIXI.Container();
                        boxContainer.addChild(popupBox);
                        boxContainer.height = popupBox.height;
                        boxContainer.width = popupBox.width;
                        boxContainer.position.x = (1080 - boxContainer.width) / 2;
                        boxContainer.position.y = (1920 - boxContainer.height) / 2;
                        return boxContainer;
                    })();
                    var charSprite = (function () {
                        var charSprite = new $w.PIXI.Sprite(res['failRival_' + rivalCharId].texture);
                        charSprite.position.y = 100;
                        charSprite.position.x = (boxContainer.width - charSprite.width) / 2;
                        return charSprite;
                    })();
                    var textFailed = (function () {
                        var text = new $w.PIXI.Sprite(res.textFailed.texture);
                        text.position.y = charSprite.position.y + charSprite.height + 30;
                        text.position.x = (boxContainer.width - text.width) / 2;
                        return text;
                    })();
                    var continueBtn = (function (sibling) {
                        var continueBtn = new $w.PIXI.Sprite(res.buttonBg.texture);
                        var continueText = new $w.PIXI.Text('Continue, 5', { font: 'normal 30px DKCoolCrayon', fill: '#fff', align: 'center' });
                        var diamond = new $w.PIXI.Sprite(res['diamond'].texture);
                        var cont = new $w.PIXI.Container();
                        cont.addChild(diamond);
                        cont.addChild(continueText);
                        diamond.position.x = continueText.position.x + continueText.width;
                        diamond.position.y = continueText.position.y + ((continueText.height - diamond.height) / 2);
                        continueBtn.addChild(cont);
                        cont.position.x = (continueBtn.width - cont.width) / 2;
                        cont.position.y = (continueBtn.height - cont.height) / 2;
                        continueBtn.scale.set(1.2, 1.2)

                        continueBtn.position.y = sibling.position.y + sibling.height + 50;
                        continueBtn.position.x = (boxContainer.width - continueBtn.width) / 2;
                        continueBtn = new buttonBusiness.setup(continueBtn);
                        continueBtn.callback = globalEvent.continueWave;
                        //-- inject validasi diamond
                        (function validateDiamond(btn) {
                            if (Number(mg.PlayerInfo.diamondBalance) < 5) {
                                btn.alpha = 0.5;
                                btn.interactive = false;
                                btn.callback = function () { };
                            }
                        })(continueBtn);
                        return continueBtn;
                    })(textFailed);
                    var retryBtn = (function (sibling) {
                        var btnRetry = (function () {
                            var btn = new $w.PIXI.Sprite(res.buttonBg.texture);
                            var retryText = new $w.PIXI.Text('Retry', { font: 'normal 40px DKCoolCrayon', fill: '#fff', align: 'center' });
                            retryText.position.x = (btn.width - retryText.width) / 2;
                            retryText.position.y = (btn.height - retryText.height) / 2;
                            btn.addChild(retryText);
                            btn.position.y = sibling.position.y + sibling.height + 10;
                            btn.position.x = (boxContainer.width - btn.width) / 2;
                            btn = new buttonBusiness.setup(btn);
                            btn.callback = globalEvent.onRestart;
                            return btn;
                        })();
                        var btnRefill = (function () {
                            var btn = new $w.PIXI.Sprite(res.buttonBg.texture);
                            var btnText = new $w.PIXI.Text('Refill energy, 5', { font: 'normal 30px DKCoolCrayon', fill: '#fff', align: 'center' });
                            var diamond = new $w.PIXI.Sprite(res['diamond'].texture);
                            var cont = new $w.PIXI.Container();
                            cont.addChild(diamond);
                            cont.addChild(btnText);
                            diamond.position.x = btnText.position.x + btnText.width;
                            diamond.position.y = btnText.position.y + ((btnText.height - diamond.height) / 2);
                            btn.addChild(cont);
                            cont.position.x = (btn.width - cont.width) / 2;
                            cont.position.y = (btn.height - cont.height) / 2;
                            btn.scale.set(1.2, 1.2)

                            btn.position.y = sibling.position.y + sibling.height + 10;
                            btn.position.x = (boxContainer.width - btn.width) / 2;
                            btn = new buttonBusiness.setup(btn);
                            btn.callback = function () {
                                globalEvent.refillEnergy(_this.failed);
                            };
                            //-- inject validasi diamond
                            (function validateDiamond(btn) {
                                if (Number(mg.PlayerInfo.diamondBalance) < 5) {
                                    btn.alpha = 0.5;
                                    btn.interactive = false;
                                    btn.callback = function () { };
                                }
                            })(btn);
                            return btn;
                        })();
                        if (energyBusiness.totalEnergy > 0) {
                            return btnRetry;
                        } else {
                            return btnRefill;
                        }
                    })(continueBtn);
                    var exitBtn = (function (sibling) {
                        var exitBtn = new $w.PIXI.Sprite(res.buttonBg.texture);
                        var exitText = new $w.PIXI.Text('Exit', { font: 'normal 40px DKCoolCrayon', fill: '#fff', align: 'center' });
                        exitText.position.x = (exitBtn.width - exitText.width) / 2;
                        exitText.position.y = (exitBtn.height - exitText.height) / 2;
                        exitBtn.addChild(exitText);
                        exitBtn.position.y = sibling.position.y + sibling.height + 10;
                        exitBtn.position.x = (boxContainer.width - exitBtn.width) / 2;
                        exitBtn = new buttonBusiness.setup(exitBtn);
                        exitBtn.callback = buttonBusiness.exit;
                        return exitBtn;
                    })(retryBtn);
                    //-- inject diamond
                    var balanceContainer = (function () {
                        var diamond = new $w.PIXI.Sprite(res['diamond'].texture);
                        var container = new $w.PIXI.Container();
                        var txt = new $w.PIXI.Text(mg.PlayerInfo.diamondBalance, { font: 'normal 30px DKCoolCrayon', fill: 0x000, align: 'center' });
                        txt.position.x = diamond.position.x + diamond.width + 10;
                        diamond.position.y = (txt.height - diamond.height) / 2;
                        container.position.x = boxContainer.width * 15 / 100;
                        container.position.y = boxContainer.height * 10 / 100;
                        container.addChild(diamond);
                        container.addChild(txt);
                        return container;
                    })();
                    boxContainer.addChild(balanceContainer);
                    //-- inject text notif
                    var textEnergy = (function (sibling) {
                        var txt = new $w.PIXI.Text("You're out of energy.",
                                { font: 'normal 40px DKCoolCrayon', fill: 'red', align: 'center' });
                        txt.position.y = sibling.position.y + sibling.height + 20;
                        txt.position.x = (boxContainer.width - txt.width) / 2;
                        if (energyBusiness.totalEnergy > 0) {
                            txt.alpha = 0;
                        }
                        return txt;
                    })(exitBtn);
                    boxContainer.addChild(textEnergy);
                    boxContainer.addChild(textFailed);
                    boxContainer.addChild(continueBtn);
                    boxContainer.addChild(retryBtn);
                    boxContainer.addChild(charSprite);
                    boxContainer.addChild(exitBtn);
                    return boxContainer;
                })();

                popupScene.visible = true;
                popupScene.interactive = true;
                popupScene.removeChild(oldBox);
                popupScene.addChild(boxContainer);

                (function () {
                    _this.timeBusiness.start = 0;
                    _this.timeBusiness.end = 0;
                    _this.timeBusiness.countdown = Number(data.countdown);
                    _this.timeBusiness.counter = Number(data.counter);
                })();
            };
            var sendToServer = function () {
                var xurl = $w.GameApp.serverURL + '/minigame/finish-wave';
                var params = {
                    regionId: mg.regionId,
                    start: _this.timeBusiness.start,
                    end: _this.timeBusiness.end,
                    waveNo: _this.waveNo,
                    sess: mg.MinigameData.sess,
                    targetLeft: _this.targetLeft,
                    isCompleted: 0
                };
                var request = $w.GameApp.http.post(xurl, params);

                //-- error handler
                if (errorCount > maxErrorPermited) {
                    if ($w.navigator.notification && $w.navigator.notification.alert) {
                        return $w.navigator.notification.alert('Disconnected to server', function () {
                            $w.location.reload();
                        });
                    } else {
                        $w.alert('Disconnected to server');
                        $w.location.reload();
                        return;
                    }
                }

                $w.GameApp.ionicLoading.show();

                request.success(callback);
                request.finally(function () {
                    $w.GameApp.ionicLoading.hide();
                });
                request.error(function () {
                    errorCount++;
                    sendToServer();
                });
            };

            containers.charContainer.visible = false;
            gameTimer.timer1.stop();
            sendToServer(callback);
        };
        _this.timeout = function () {
            var errorCount = 0;
            var callback = function (data) {
                var targetCharId = _this.currentStage.target.t;
                var popupScene = (function () {
                    var result = new $w.PIXI.Container();
                    for (var i = 0; i < mg.root.children.length; i++) {
                        if (mg.root.children[i].name == 'popupScene') {
                            result = mg.root.children[i];
                            break;
                        }
                    }
                    return result;
                })();
                var oldBox = popupScene.children[0];
                var boxContainer = (function () {
                    var popupBox = (function () {
                        var popupBox = new $w.PIXI.Sprite(res.popupBox.texture);
                        popupBox.scale.set(1.5, 2);
                        return popupBox;
                    })();
                    var boxContainer = (function () {
                        var boxContainer = new window.PIXI.Container();
                        boxContainer.addChild(popupBox);
                        boxContainer.height = popupBox.height;
                        boxContainer.width = popupBox.width;
                        boxContainer.position.x = (1080 - boxContainer.width) / 2;
                        boxContainer.position.y = (1920 - boxContainer.height) / 2;
                        return boxContainer;
                    })();
                    var charSprite = (function () {
                        var charSprite = new $w.PIXI.Sprite(res['failTarget_' + targetCharId].texture);
                        charSprite.position.y = 100;
                        charSprite.position.x = (boxContainer.width - charSprite.width) / 2;
                        return charSprite;
                    })();
                    var textTimeout = (function () {
                        var text = new $w.PIXI.Sprite(res.textTimeout.texture);
                        text.position.y = charSprite.position.y + charSprite.height + 30;
                        text.position.x = (boxContainer.width - text.width) / 2;
                        return text;
                    })();
                    var continueBtn = (function (sibling) {
                        var continueBtn = new $w.PIXI.Sprite(res.buttonBg.texture);
                        var continueText = new $w.PIXI.Text('Continue with 5', { font: 'normal 30px DKCoolCrayon', fill: '#fff', align: 'center' });
                        var diamond = new $w.PIXI.Sprite(res['diamond'].texture);
                        var cont = new $w.PIXI.Container();
                        cont.addChild(diamond);
                        cont.addChild(continueText);
                        diamond.position.x = continueText.position.x + continueText.width;
                        diamond.position.y = continueText.position.y + ((continueText.height - diamond.height) / 2);
                        continueBtn.addChild(cont);
                        cont.position.x = (continueBtn.width - cont.width) / 2;
                        cont.position.y = (continueBtn.height - cont.height) / 2;
                        continueBtn.scale.set(1.2, 1.2)

                        continueBtn.position.y = sibling.position.y + sibling.height + 50;
                        continueBtn.position.x = (boxContainer.width - continueBtn.width) / 2;
                        continueBtn = new buttonBusiness.setup(continueBtn);
                        continueBtn.callback = globalEvent.continueWave;
                        //-- inject validasi diamond
                        (function validateDiamond(btn) {
                            if (Number(mg.PlayerInfo.diamondBalance) < 5) {
                                btn.alpha = 0.5;
                                btn.interactive = false;
                                btn.callback = function () { };
                            }
                        })(continueBtn);
                        return continueBtn;
                    })(textTimeout);
                    var retryBtn = (function (sibling) {
                        var btnRetry = (function () {
                            var btn = new $w.PIXI.Sprite(res.buttonBg.texture);
                            var retryText = new $w.PIXI.Text('Retry', { font: 'normal 40px DKCoolCrayon', fill: '#fff', align: 'center' });
                            retryText.position.x = (btn.width - retryText.width) / 2;
                            retryText.position.y = (btn.height - retryText.height) / 2;
                            btn.addChild(retryText);
                            btn.position.y = sibling.position.y + sibling.height + 10;
                            btn.position.x = (boxContainer.width - btn.width) / 2;
                            btn = new buttonBusiness.setup(btn);
                            btn.callback = globalEvent.onRestart;
                            return btn;
                        })();
                        var btnRefill = (function () {
                            var btn = new $w.PIXI.Sprite(res.buttonBg.texture);
                            var btnText = new $w.PIXI.Text('Refill energy, 5', { font: 'normal 30px DKCoolCrayon', fill: '#fff', align: 'center' });
                            var diamond = new $w.PIXI.Sprite(res['diamond'].texture);
                            var cont = new $w.PIXI.Container();
                            cont.addChild(diamond);
                            cont.addChild(btnText);
                            diamond.position.x = btnText.position.x + btnText.width;
                            diamond.position.y = btnText.position.y + ((btnText.height - diamond.height) / 2);
                            btn.addChild(cont);
                            cont.position.x = (btn.width - cont.width) / 2;
                            cont.position.y = (btn.height - cont.height) / 2;
                            btn.scale.set(1.2, 1.2)

                            btn.position.y = sibling.position.y + sibling.height + 10;
                            btn.position.x = (boxContainer.width - btn.width) / 2;
                            btn = new buttonBusiness.setup(btn);
                            btn.callback = function () {
                                globalEvent.refillEnergy(_this.failed);
                            };
                            //-- inject validasi diamond
                            (function validateDiamond(btn) {
                                if (Number(mg.PlayerInfo.diamondBalance) < 5) {
                                    btn.alpha = 0.5;
                                    btn.interactive = false;
                                    btn.callback = function () { };
                                }
                            })(btn);
                            return btn;
                        })();
                        if (energyBusiness.totalEnergy > 0) {
                            return btnRetry;
                        } else {
                            return btnRefill;
                        }
                    })(continueBtn);
                    var exitBtn = (function (sibling) {
                        var exitBtn = new $w.PIXI.Sprite(res.buttonBg.texture);
                        var exitText = new $w.PIXI.Text('Exit', { font: 'normal 40px DKCoolCrayon', fill: '#fff', align: 'center' });
                        exitText.position.x = (exitBtn.width - exitText.width) / 2;
                        exitText.position.y = (exitBtn.height - exitText.height) / 2;
                        exitBtn.addChild(exitText);
                        exitBtn.position.y = sibling.position.y + sibling.height + 10;
                        exitBtn.position.x = (boxContainer.width - exitBtn.width) / 2;
                        exitBtn = new buttonBusiness.setup(exitBtn);
                        exitBtn.callback = buttonBusiness.exit;
                        return exitBtn;
                    })(retryBtn);
                    //-- inject diamond
                    var balanceContainer = (function () {
                        var diamond = new $w.PIXI.Sprite(res['diamond'].texture);
                        var container = new $w.PIXI.Container();
                        var txt = new $w.PIXI.Text(mg.PlayerInfo.diamondBalance, { font: 'normal 30px DKCoolCrayon', fill: 0x000, align: 'center' });
                        txt.position.x = diamond.position.x + diamond.width + 10;
                        diamond.position.y = (txt.height - diamond.height) / 2;
                        container.position.x = boxContainer.width * 15 / 100;
                        container.position.y = boxContainer.height * 10 / 100;
                        container.addChild(diamond);
                        container.addChild(txt);
                        return container;
                    })();
                    boxContainer.addChild(balanceContainer);
                    //-- inject text notif
                    var textEnergy = (function (sibling) {
                        var txt = new $w.PIXI.Text("You're out of energy.",
                                { font: 'normal 40px DKCoolCrayon', fill: 'red', align: 'center' });
                        txt.position.y = sibling.position.y + sibling.height + 20;
                        txt.position.x = (boxContainer.width - txt.width) / 2;
                        if (energyBusiness.totalEnergy > 0) {
                            txt.alpha = 0;
                        }
                        return txt;
                    })(exitBtn);
                    boxContainer.addChild(textTimeout);
                    boxContainer.addChild(continueBtn);
                    boxContainer.addChild(retryBtn);
                    boxContainer.addChild(charSprite);
                    boxContainer.addChild(exitBtn);
                    return boxContainer;
                })();

                gameSounds.timeout();
                popupScene.visible = true;
                popupScene.interactive = true;

                if (oldBox && oldBox.destroy) {
                    popupScene.removeChild(oldBox);
                    oldBox.destroy();
                }

                popupScene.addChild(boxContainer);


                (function () {
                    _this.timeBusiness.start = 0;
                    _this.timeBusiness.end = 0;
                    _this.timeBusiness.countdown = Number(data.countdown);
                    _this.timeBusiness.counter = Number(data.counter);
                })();
            };
            var sendToServer = function () {

                var xurl = $w.GameApp.serverURL + '/minigame/finish-wave';
                var params = {
                    regionId: mg.regionId,
                    start: _this.timeBusiness.start,
                    end: _this.timeBusiness.end,
                    waveNo: _this.waveNo,
                    sess: mg.MinigameData.sess,
                    targetLeft: _this.targetLeft,
                    isCompleted: 0
                };
                var request = $w.GameApp.http.post(xurl, params);


                //-- error handler
                if (errorCount > maxErrorPermited) {
                    if ($w.navigator.notification && $w.navigator.notification.alert) {
                        return $w.navigator.notification.alert('Disconnected to server', function () {
                            $w.location.reload();
                        });
                    } else {
                        $w.alert('Disconnected to server');
                        $w.location.reload();
                        return;
                    }
                }

                $w.GameApp.ionicLoading.show();

                request.success(callback);
                request.finally(function () {
                    $w.GameApp.ionicLoading.hide();
                });
                request.error(function () {
                    errorCount++;
                    sendToServer(callback);
                });
            };

            containers.charContainer.visible = false;
            gameTimer.timer1.stop();
            sendToServer();
        };
        _this.winGame = function () {
            var popupScene = (function () {
                var result = new $w.PIXI.Container();
                for (var i = 0; i < mg.root.children.length; i++) {
                    if (mg.root.children[i].name == 'popupScene') {
                        result = mg.root.children[i];
                        break;
                    }
                }
                return result;
            })();
            var oldBox = popupScene.children[0];
            var duration = globalEvent.getDurationPlay();
            var boxContainer = (function () {
                var popupBox = (function () {
                    var popupBox = new $w.PIXI.Sprite(res.popupBox.texture);
                    popupBox.scale.set(1.5, 1.5);
                    return popupBox;
                })();
                var boxContainer = (function () {
                    var boxContainer = new window.PIXI.Container();
                    boxContainer.addChild(popupBox);
                    boxContainer.height = popupBox.height;
                    boxContainer.width = popupBox.width;
                    boxContainer.position.x = (1080 - boxContainer.width) / 2;
                    boxContainer.position.y = (1920 - boxContainer.height) / 2;
                    return boxContainer;
                })();
                var textYouwin = (function (sibling) {
                    var text = new $w.PIXI.Sprite(res.textYouwin.texture);
                    text.position.y = 100;
                    text.position.x = (boxContainer.width - text.width) / 2;
                    return text;
                })();
                var textInfo = (function (sibling) {
                    var textInfo = new $w.PIXI.Text('Congratulations.! \n You get ' + productsPrice.reward + ' diamonds',
                            {
                                font: 'normal 40px DKCoolCrayon', fill: 'green', align: 'center'
                            });
                    textInfo.position.x = (boxContainer.width - textInfo.width) / 2;
                    textInfo.position.y = sibling.position.y + sibling.height + 30;
                    return textInfo;
                })(textYouwin);
                var textDuration = (function (sibling) {
                    var textInfo = new $w.PIXI.Text('Your time \n' + duration,
                            {
                                font: 'normal 40px DKCoolCrayon', fill: 0x000, align: 'center'
                            });
                    textInfo.position.x = (boxContainer.width - textInfo.width) / 2;
                    textInfo.position.y = sibling.position.y + sibling.height + 30;
                    return textInfo;
                })(textInfo);
                var playBtn = (function (sibling) {
                    var btn = new $w.PIXI.Sprite(res.buttonBg.texture);
                    var btnText = new $w.PIXI.Text('Play Again', { font: 'normal 40px DKCoolCrayon', fill: '#fff', align: 'center' });
                    btnText.position.x = (btn.width - btnText.width) / 2;
                    btnText.position.y = (btn.height - btnText.height) / 2;
                    btn.addChild(btnText);
                    btn.position.y = sibling.position.y + sibling.height + 30;
                    btn.position.x = (boxContainer.width - btn.width) / 2;
                    btn = new buttonBusiness.setup(btn);
                    btn.callback = globalEvent.onRestart;
                    if (energyBusiness.totalEnergy <= 0) {
                        btn.alpha = 0.5;
                        btn.interactive = false;
                        btn.callback = function () { };
                    }
                    return btn;
                })(textDuration);
                var exitBtn = (function (sibling) {
                    var exitBtn = new $w.PIXI.Sprite(res.buttonBg.texture);
                    var exitText = new $w.PIXI.Text('Exit', { font: 'normal 40px DKCoolCrayon', fill: '#fff', align: 'center' });
                    exitText.position.x = (exitBtn.width - exitText.width) / 2;
                    exitText.position.y = (exitBtn.height - exitText.height) / 2;
                    exitBtn.addChild(exitText);
                    exitBtn.position.y = sibling.position.y + sibling.height + 10;
                    exitBtn.position.x = (boxContainer.width - exitBtn.width) / 2;
                    exitBtn = new buttonBusiness.setup(exitBtn);
                    exitBtn.callback = buttonBusiness.exit;
                    return exitBtn;
                })(playBtn);

                boxContainer.addChild(textYouwin);
                boxContainer.addChild(textDuration);
                boxContainer.addChild(textInfo);
                boxContainer.addChild(playBtn);
                boxContainer.addChild(exitBtn);
                return boxContainer;
            })();
            var callback = function () {
                gameSounds.win();
                popupScene.visible = true;
                popupScene.interactive = true;
                popupScene.removeChild(oldBox);
                popupScene.addChild(boxContainer);
            };

            globalEvent.winGame(callback);
            containers.charContainer.visible = false;
            gameTimer.timer1.stop();
        };
        _this.startGame = function () {
            var targetLeft = 10;
            var waveNo = Number(mg.wave.waveNo);
            var calculateTargetLeft = function () {
                targetLeft--;
                _this.targetLeft = targetLeft;

                if (targetLeft == 0) {
                    var errorCount = 0;
                    var callback = function (data) {
                        targetLeft = 10;

                        _this.timeBusiness.countdown = Number(data.countdown);
                        _this.timeBusiness.counter = Number(data.counter);

                        var nextWave = waveNo + 1;

                        if (nextWave > 5) {
                            _this.winGame();
                            nextWave = 1;
                        } else {
                            _this.timeBusiness.start = 0;
                            _this.timeBusiness.end = 0;
                            mg.wave.currentStage = new mg.wave.createWaveStage(nextWave);
                            mg.wave.currentStage.setup();
                        }

                    };
                    var sendToServer = function () {
                        var xurl = $w.GameApp.serverURL + '/minigame/finish-wave';
                        var params = {
                            regionId: mg.regionId,
                            start: _this.timeBusiness.start,
                            end: _this.timeBusiness.end,
                            waveNo: _this.waveNo,
                            sess: mg.MinigameData.sess,
                            targetLeft: _this.targetLeft,
                            isCompleted: 1
                        };
                        var request = $w.GameApp.http.post(xurl, params);

                        //-- error handler
                        if (errorCount > maxErrorPermited) {
                            if ($w.navigator.notification && $w.navigator.notification.alert) {
                                return $w.navigator.notification.alert('Disconnected to server', function () {
                                    $w.GameApp.ionicLoading.hide();
                                    mg.wave.currentStage = new mg.wave.createWaveStage(_this.waveNo);
                                    mg.wave.currentStage.setup();
                                });
                            } else {
                                $w.alert('Disconnected to server');
                                return;
                            }
                        }

                        $w.GameApp.ionicLoading.show();

                        request.success(callback);
                        request.finally(function () {
                            $w.GameApp.ionicLoading.hide();
                        });
                        request.error(function () {
                            errorCount++;
                            sendToServer(callback);
                        });
                    };

                    gameTimer.timer1.stop();
                    sendToServer(callback);
                }

                var oldText = containers.targetLeft.children[0];
                var newText = new $w.PIXI.Text(targetLeft, { font: 'normal 60px DKCoolCrayon', fill: 0x000, align: 'center' });

                containers.targetLeft.removeChild(oldText);
                containers.targetLeft.addChild(newText);
                oldText.destroy();
            };
            var temp = [];
            var holders = [];
            var sprites = [];
            var acak = function () { };
            var getTickInterval = function (showPerSecond) {
                var result = parseInt(1000 / showPerSecond);
                return result;
            };
            var action = {};
            var popupScene = (function () {
                var result = new $w.PIXI.Container();
                for (var i = 0; i < mg.root.children.length; i++) {
                    if (mg.root.children[i].name == 'popupScene') {
                        result = mg.root.children[i];
                        break;
                    }
                }
                return result;
            })();

            popupScene.visible = false;
            containers.charContainer.visible = true;

            action.slidingDown = function (_charHolder) {
                var charHolder = _charHolder;
                var charSprite = charHolder.children[charHolder.children.length - 1];
                var interval = getTickInterval(charHolder.showPerSecond) / 2;
                var timer = PIXI.timerManager.createTimer(interval);
                var movingSpeed = speedGame['stage' + _this.waveNo].moving;
                var slideDown = pixiCharm.slide(charSprite, 0, holeSize.height / 2, movingSpeed);
                timer.on('end', function () {
                    action.acakMonster(charHolder);
                });
                slideDown.holder = charHolder;
                slideDown.onComplete = function () {
                    var charHolder = this.holder;
                    var charSprite = charHolder.children[charHolder.children.length - 1];
                    temp.push(charSprite);
                    charHolder.removeChild(charSprite);
                    charHolder.visible = false;
                    // action.acakMonster(charHolder);
                    //console.log('down')
                    timer.start();
                };
            };
            action.acakMonster = function (_charHolder) {
                var charHolder = _charHolder;
                var ridx = $w.randomInt(0, temp.length - 1);
                var charSprite = temp[ridx];
                if (charHolder.stop) {
                    if (charHolder.timer && charHolder.timer.remove) {
                        charHolder.timer.remove();
                        charHolder.destroy();
                    }

                    return;
                }
                if (!charSprite) {
                    action.acakMonster(charHolder);
                }
                //console.log(ridx);
                charHolder.addChild(charSprite);
                charHolder.visible = true;
                charHolder.timer = PIXI.timerManager.createTimer(100);
                charHolder.action.slidingUp(charHolder);
                temp.splice(ridx, 1);
            };
            action.slidingUp = function (_charHolder) {
                var charHolder = _charHolder;
                var charSprite = charHolder.children[charHolder.children.length - 1];
                var movingSpeed = speedGame['stage' + _this.waveNo].moving;
                charHolder.interval = getTickInterval(charHolder.showPerSecond) / 2;
                charHolder.timer1 = PIXI.timerManager.createTimer(charHolder.interval);
                charHolder.slideUp = pixiCharm.slide(charSprite, 0, 0, movingSpeed);
                charHolder.visible = true;
                charSprite.alpha = 1;
                charHolder.slideUp.onComplete = function () {
                    charHolder.timer1.start();
                };
                charHolder.timer1.on('end', function () {
                    charHolder.action.slidingDown(charHolder);
                });
            };

            //-- inisiasi awalW
            for (var i = 1; i <= 3; i++) {
                var gCont = containers.groupCharHolder['g' + i];
                for (var idx = 0; idx < gCont.length; idx++) {
                    var charHolder = gCont[idx];
                    var charSprite = charHolder.children[0];
                    charSprite.position.y += holeSize.height / 2;
                    charSprite.touchstart = function () {
                        if (this.charType == 'target') {
                            var _that = this;
                            var charId = _that.charId;
                            var targetShadow = new $w.PIXI.Sprite(res['char_' + charId].texture);
                            var startPos = _that.parent.position.clone();
                            containers.gameScene.addChild(targetShadow);
                            targetShadow.position.set(startPos.x, startPos.y);
                            var qpos = { x: 651, y: 171 };
                            if (this.isGoldenHelper) {
                                qpos = { x: 513, y: 171 };
                            }

                            var slide = pixiCharm.slide(targetShadow, qpos.x, qpos.y, 16);
                            slide.onComplete = function () {
                                containers.gameScene.removeChild(targetShadow);
                                targetShadow.destroy();
                            };
                            calculateTargetLeft();
                        }
                        if (this.charType == 'additional') {
                            var _that = this;
                            var charId = _that.charId;
                            var targetShadow = new $w.PIXI.Sprite(res['char_' + charId].texture);
                            var startPos = _that.parent.position.clone();
                            containers.gameScene.addChild(targetShadow);
                            targetShadow.position.set(startPos.x, startPos.y);
                            var slide = pixiCharm.slide(targetShadow, startPos.x, 1920, 16);
                            slide.onComplete = function () {
                                containers.gameScene.removeChild(targetShadow);
                                targetShadow.destroy();
                            };
                        }
                        if (this.charType == 'rival') {
                            var _that = this;
                            var charId = _that.charId;
                            var targetShadow = new $w.PIXI.Sprite(res['char_' + charId].texture);
                            var startPos = _that.parent.position.clone();
                            containers.gameScene.addChild(targetShadow);
                            targetShadow.position.set(startPos.x, startPos.y);
                            var slide = pixiCharm.slide(targetShadow, 579, 273, 16);
                            slide.onComplete = function () {
                                containers.gameScene.removeChild(targetShadow);
                                targetShadow.destroy();
                            };
                            _this.failed(charId);
                        }
                        this.parent.visible = false;
                        //temp.push(this);
                    };

                    switch (i) {
                        case 1:
                            charHolder.showPerSecond = speedGame['stage' + _this.waveNo].group1;
                            break;
                        case 2:
                            charHolder.showPerSecond = charHolder.showPerSecond = speedGame['stage' + _this.waveNo].group2;
                            break;
                        case 3:
                            charHolder.showPerSecond = charHolder.showPerSecond = speedGame['stage' + _this.waveNo].group3;
                            break;
                    }

                    charHolder.visible = false;
                    holders.push(charHolder);
                    sprites.push(charSprite);
                    charHolder.removeChildren(0, 1);
                }
            }

            //-- acak char tahap awal
            for (var x = 0; x < sprites.length; x++) {
                sprites.shuffle();
            }

            //-- binding char ke hole setelah di acak
            for (var i = 0; i < holders.length; i++) {
                var charHolder = holders[i];
                var charSprite = sprites[i];
                charHolder.visible = true;
                charHolder.addChild(charSprite);
                charHolder.action = action;
                charHolder.action.slidingUp(charHolder);
            }

            //-- start game mulai dari sliding down
            for (var i = 0; i < holders.length; i++) {
                var charHolder = holders[i];
            }


            _this.timeBusiness.startTime();
        };
        _this.timeBusiness = (function () {
            var tb = {};
            tb.container = new $w.PIXI.Container();
            tb.countdown = 0;
            tb.counter = 0;
            tb.start = 0;
            tb.end = 0;
            tb.ticker = function () {
                var callback = function (data) {
                    tb.countdown = Number(data.countdown);
                    tb.counter = Number(data.counter);
                    tb.end = Number(data.end);
                    tb.start = Number(data.start);

                    if (tb.countdown <= 0) {
                        _this.timeout();
                        tb.countdown = 0;
                        //_this.winGame();
                    }

                    tb.showTime();
                };
                var xurl = $w.GameApp.serverURL + '/minigame/timer';
                var params = {
                    regionId: mg.regionId,
                    start: tb.start,
                    counter: tb.counter
                };
                var request = $w.GameApp.http.post(xurl, params);

                request.success(callback);
            };
            tb.showTime = function () {
                var width = (tb.countdown / speedGame.duration) * 348;
                if (width > 348) {
                    width = 348;
                }
                tb.container.width = width;
            };
            tb.startTime = function () {
                //-- start time per wave
                gameTimer.timer1.start();
            };
            gameTimer.timer1.on('repeat', tb.ticker);
            return tb;
        })();

        //_this.stages = {};
        _this.createWaveStage = WaveStage;
        return _this;
    })();
    mg.initRenderer = function () {
        var tWidth = 1080;
        var tHeight = 1920;
        var a = $w.innerWidth / 1080;
        var b = $w.innerHeight / 1920;
        var scl = Math.min(a, b);
        if (scl === b) {
            tHeight = $w.innerHeight;
            tWidth = tHeight / 1920 * 1080;
        } else {
            tWidth = $w.innerWidth;
            tHeight = tWidth / 1080 * 1920;
        }

        //console.log(tWidth, tHeight, $w.devicePixelRatio);

        window.GameApp.renderer = new $w.PIXI.autoDetectRenderer(tWidth, tHeight, $w.GameApp.rendererOptions, true);
        //window.GameApp.renderer = new $w.PIXI.WebGLRenderer(tWidth, tHeight, $w.GameApp.rendererOptions);
        window.GameApp.renderer.view.style.margin = 'auto';
        //window.GameApp.renderer.view.style.border = '1px solid red';
        //window.GameApp.renderer.view.style.postion = 'relative';
        // window.GameApp.renderer.plugins.interaction.destroy();

        scale = Math.min(($w.GameApp.renderer.width) / 1080, ($w.GameApp.renderer.height) / 1920);
        scale = scale / $w.devicePixelRatio;
        $('#gameLayout').html(window.GameApp.renderer.view);
    };
    mg.MinigameData = {};
    mg.PlayerInfo = {};
    mg.GoldenHelper = 0;
    mg.root = new $w.PIXI.Container();
    mg.initializeAssets = function () {
        var assets = (function () {
            var assets = [];
            var worldAssetUrl = '';
            switch (mg.regionId) {
                case 1:
                    worldAssetUrl = 'minigame/assets/bg-atea.png';
                    mg.holeLocation = MapLocations.atea;
                    //for (var i = 0; i < mg.holeLocation.length; i++) {
                    //    mg.holeLocation[i].y = Number(mg.holeLocation[i].y) - 150;
                    //}
                    break;
                case 2:
                    worldAssetUrl = 'minigame/assets/bg-oidur.png';
                    mg.holeLocation = MapLocations.oidur;
                    break;
                case 3:
                    worldAssetUrl = 'minigame/assets/bg-frusht.png';
                    mg.holeLocation = MapLocations.frusht;
                    break;
                case 4:
                    worldAssetUrl = 'minigame/assets/bg-routh.png';
                    mg.holeLocation = MapLocations.routh;
                    break;
            }

            assets.push({ name: 'world', url: worldAssetUrl });
            assets.push({ name: 'hole', url: 'minigame/assets/hole.png' });
            assets.push({ name: 'energyBar', url: 'minigame/assets/energy-bar.png' });
            assets.push({ name: 'energyFill', url: 'minigame/assets/energy-fill.png' });
            assets.push({ name: 'borderLeftTime', url: 'minigame/assets/border-left-time.png' });
            assets.push({ name: 'diamond', url: 'minigame/assets/diamond.png' });
            assets.push({ name: 'timeBar', url: 'minigame/assets/time-bar.png' });
            assets.push({ name: 'timeFill', url: 'minigame/assets/time-indicator.png' });
            assets.push({ name: 'waveBar', url: 'minigame/assets/Kotak_new.png' });
            assets.push({ name: 'buttonBg', url: 'minigame/assets/button-bg.png' });
            assets.push({ name: 'diamondWrapper', url: 'minigame/assets/diamond_wrapper.png' });
            assets.push({ name: 'goldenhelper', url: 'minigame/assets/goldenhelper.png' });
            assets.push({ name: 'helpBtn', url: 'minigame/assets/help.png' });

            assets.push({ name: 'pauseBtn', url: 'minigame/assets/pause-button.png' });
            assets.push({ name: 'exitIcon', url: 'minigame/assets/new_exiiit.png' });
            assets.push({ name: 'restartIcon', url: 'minigame/assets/new_restart.png' });

            assets.push({ name: 'popupBox', url: 'minigame/assets/popup-box.png' });
            assets.push({ name: 'popupBg', url: 'minigame/assets/bg-popup.png' });
            assets.push({ name: 'countdownText_1', url: 'minigame/assets/Countdown_1.png' });
            assets.push({ name: 'countdownText_2', url: 'minigame/assets/Countdown_2.png' });
            assets.push({ name: 'countdownText_3', url: 'minigame/assets/Countdown_3.png' });
            assets.push({ name: 'textWelcome', url: 'minigame/assets/text-welcome.png' });
            assets.push({ name: 'textFailed', url: 'minigame/assets/text-failed.png' });
            assets.push({ name: 'textPause', url: 'minigame/assets/text-pause.png' });
            assets.push({ name: 'textTimeout', url: 'minigame/assets/text-timeout.png' });
            assets.push({ name: 'textYouwin', url: 'minigame/assets/text-youwin.png' });
            assets.push({ name: 'textWave1', url: 'minigame/assets/text-wave-ukuran-besar-1.png' });
            assets.push({ name: 'textWave2', url: 'minigame/assets/text-wave-ukuran-besar-2.png' });
            assets.push({ name: 'textWave3', url: 'minigame/assets/text-wave-ukuran-besar-3.png' });
            assets.push({ name: 'textWave4', url: 'minigame/assets/text-wave-ukuran-besar-4.png' });
            assets.push({ name: 'textWave5', url: 'minigame/assets/text-wave-ukuran-besar-5.png' });
            return assets;
        })();
        for (var i = 1; i <= 20; i++) {
            assets.push({ name: 'char_' + i, url: 'minigame/assets/char_' + i + '.png' });
            assets.push({ name: 'failTarget_' + i, url: 'minigame/assets/fail-target/char_' + i + '.png' });
            assets.push({ name: 'failRival_' + i, url: 'minigame/assets/fail-rival/char_' + i + '.png' });
        }

        $w.WebFontConfig = {
            custom: {
                families: ['DKCoolCrayon'],
                urls: ['minigame/assets/DKCoolCrayon/styles.css']
            }, active: function () {
                $w.PIXI.loader.add(assets).load(mg.createWorld);
            }
        };
        // include the web-font loader script
        /* jshint ignore:start */
        (function () {
            var wf = document.createElement('script');
            //wf.src = ('https:' === document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
            wf.src = 'asset/js/webfontloader.js';
            wf.type = 'text/javascript';
            wf.async = 'true';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(wf, s);
        })();
        /* jshint ignore:end */


    };
    mg.createWorld = function () {
        var res = $w.PIXI.loader.resources;
        // var waves = mg.wave.init();
        var mainScene = (function () {
            var margin = 10;
            var background = new $w.PIXI.Sprite(res.world.texture);
            var containerGame = new $w.PIXI.Container();
            containerGame.addChild(background);
            //containerGame.width = background.width;
            //containerGame.height = background.height;
            //containerGame.scale.set(scale, scale);

            //-- time
            var timebarContainer = (function () {
                var timebarContainer = new $w.PIXI.Container();
                var timebar = new $w.PIXI.Sprite(res.timeBar.texture);
                var indicator = new $w.PIXI.Sprite(res.timeFill.texture);
                var borderLeft = new $w.PIXI.Sprite(res.borderLeftTime.texture);
                mg.wave.timeBusiness.container.position.x = 16.5;
                mg.wave.timeBusiness.container.position.y = 50;
                mg.wave.timeBusiness.container.addChild(indicator);
                timebarContainer.name = 'time';
                timebarContainer.addChild(timebar);
                timebarContainer.addChild(mg.wave.timeBusiness.container);
                timebarContainer.addChild(borderLeft);
                borderLeft.position.y = timebarContainer.position.y + (timebarContainer.height - borderLeft.height);
                timebarContainer.position.y = 57;
                timebarContainer.position.x = margin;
                return timebarContainer;
            })();
            //timebarContainer.visible = false;

            //-- energy
            var energybarContainer = (function (sibling) {
                var energybarContainer = new $w.PIXI.Container();
                var energybar = new $w.PIXI.Sprite(res.energyBar.texture);
                energybarContainer.name = 'energy';
                energybarContainer.addChild(energybar);
                energybarContainer.addChild(energyBusiness.container);
                energybarContainer.position.y = sibling.position.y + sibling.height + 10;
                energybarContainer.position.x = sibling.position.x;
                energyBusiness.showEnergy();
                return energybarContainer;
            })(timebarContainer);

            //-- wave
            var waveContainer = (function () {
                var waveContainer = new $w.PIXI.Container();
                var wavebar = new $w.PIXI.Sprite(res.waveBar.texture);
                var padding = 10;
                waveContainer.name = 'wave';
                waveContainer.addChild(wavebar);
                waveContainer.position.y = 57;
                waveContainer.position.x = timebarContainer.position.x + timebarContainer.width + (padding);
                return waveContainer;
            })();
            //waveContainer.visible = false;

            var helpContainer = (function (sibling) {
                var container = new $w.PIXI.Container();
                for (var i = 0; i < 3; i++) {
                    var spr = new $w.PIXI.Sprite(res.helpBtn.texture);
                    spr.position.y = i * (spr.height + 10);
                    spr = new buttonBusiness.setup(spr);
                    spr.callback = function () { };
                    container.addChild(spr);
                }

                container.position.y = sibling.position.y;
                container.position.x = 939;
                return container;
            })(waveContainer);

            //-- create button  - pause 
            var pauseBtn = (function () {
                var pauseBtn = new $w.PIXI.Sprite(res.pauseBtn.texture);
                pauseBtn.position.x = (1080 - pauseBtn.width) / 2;
                pauseBtn.position.y = 1755;
                //pauseBtn.visible = false;
                pauseBtn = new buttonBusiness.setup(pauseBtn);
                pauseBtn.callback = pauseBusiness.showScene;
                return pauseBtn;
            })();

            var footerButtons = (function () {
                var container = new $w.PIXI.Container();
                var exitIcon = (function () {
                    var icon = new $w.PIXI.Sprite(res.exitIcon.texture);
                    icon = new buttonBusiness.setup(icon);
                    icon.position.x = icon.width + 35;
                    icon.callback = buttonBusiness.exit;
                    return icon;
                })();
                var restartIcon = (function () {
                    var icon = new $w.PIXI.Sprite(res.restartIcon.texture);
                    icon = new buttonBusiness.setup(icon);

                    icon.callback = globalEvent.onRestart;

                    //-- inject shortcut
                    containers.restartBtn = icon;

                    return icon;
                })();

                container.addChild(restartIcon);
                container.addChild(exitIcon);

                container.position.y = 1755;
                container.position.x = (1080 - container.width) / 2;

                return container;
            })();

            var diamondWrapper = (function (sibling) {
                var container = new $w.PIXI.Sprite(res.diamondWrapper.texture);
                var textWrapper = (function () {
                    var wrapper = new $w.PIXI.Container();
                    var text = new $w.PIXI.Text('-', {
                        font: 'normal 40px DKCoolCrayon', fill: '#fff', align: 'center'
                    });
                    wrapper.position.x = 48;
                    wrapper.position.y = 40;
                    wrapper.rotation -= 0.15;
                    wrapper.addChild(text);
                    return wrapper;
                })();
                container.addChild(textWrapper);
                container.position.x = sibling.position.x + ((sibling.width - container.width) / 2);
                container.position.y = sibling.position.y + sibling.height;
                //-- inject shortcut
                containers.diamondWrapper = textWrapper;
                return container;
            })(energybarContainer);

            containerGame.addChild(diamondWrapper);
            containerGame.addChild(energybarContainer);
            containerGame.addChild(timebarContainer);
            containerGame.addChild(waveContainer);
            containerGame.addChild(footerButtons);
            containerGame.addChild(helpContainer);

            //--inject shortcut
            containers.timeBar = timebarContainer;
            containers.waveBar = waveContainer;
            containers.pauseBtn = pauseBtn;
            containerGame.name = 'mainScene';
            return containerGame;
        })();
        var popupScene = (function () {
            //-- create popup scene
            var popupScene = new $w.PIXI.Sprite(res.popupBg.texture);
            var boxContainer = (function () {
                var popupBox = new $w.PIXI.Sprite(res.popupBox.texture);
                var boxContainer = new $w.PIXI.Container();
                //   popupBox.scale.set(1.5, 1.5);

                boxContainer.addChild(popupBox);
                boxContainer.height = popupBox.height;
                boxContainer.width = popupBox.width;
                boxContainer.position.x = (popupScene.width - boxContainer.width) / 2;
                boxContainer.position.y = (popupScene.height - boxContainer.height) / 2;
                return boxContainer;
            })();
            //-- welcome
            var welcomeText = (function () {
                var welcomeText = new $w.PIXI.Sprite(res.textWelcome.texture);
                welcomeText.position.x = (boxContainer.width - welcomeText.width) / 2;
                welcomeText.position.y = 100;
                return welcomeText;
            })();
            //-- button
            var playBtn = (function (boxContainer) {
                var playBtn = new $w.PIXI.Sprite(res.buttonBg.texture);
                var playText = new $w.PIXI.Text('Play', { font: 'normal 40px DKCoolCrayon', fill: '#fff', align: 'center' });
                //playText.scale.set(1.5, 1.5);
                playText.position.x = (playBtn.width - playText.width) / 2;
                playText.position.y = (playBtn.height - playText.height) / 2;
                //playBtn.scale.set(1.5, 1.5);
                playBtn.addChild(playText);
                playBtn.position.y = 220;
                playBtn.position.x = (boxContainer.width - playBtn.width) / 2;
                playBtn = new buttonBusiness.setup(playBtn);
                playBtn.callback = globalEvent.onPlay;
                return playBtn;
            })(boxContainer);
            var exitBtn = (function () {
                var exitBtn = new $w.PIXI.Sprite(res.buttonBg.texture);
                var exitText = new $w.PIXI.Text('Exit', { font: 'normal 40px DKCoolCrayon', fill: '#fff', align: 'center' });
                //exitText.scale.set(2, 2);
                exitText.position.x = (exitBtn.width - exitText.width) / 2;
                exitText.position.y = (exitBtn.height - exitText.height) / 2;
                exitBtn.addChild(exitText);
                exitBtn.position.y = playBtn.position.y + playBtn.height + 20;
                exitBtn.position.x = (boxContainer.width - exitBtn.width) / 2;
                exitBtn = new buttonBusiness.setup(exitBtn);
                exitBtn.callback = buttonBusiness.exit;
                return exitBtn;
            })();
            //-- inject validasi diamond
            (function validateDiamond(btn) {
                if (Number(mg.PlayerInfo.diamondBalance) < 5) {
                    btn.alpha = 0;
                    btn.interactive = false;
                    btn.callback = function () { };
                }
            })(playBtn);
            boxContainer.addChild(welcomeText);
            boxContainer.addChild(playBtn);
            boxContainer.addChild(exitBtn);
            popupScene.addChild(boxContainer);
            boxContainer.name = 'boxContainer';
            popupScene.name = 'popupScene';
            return popupScene;
        })();
        var gameScene = (function () {
            var gameContainer = new $w.PIXI.Container();
            var holeContainer = new $w.PIXI.Container();
            gameContainer.width = holeContainer.width = 1080;
            gameContainer.height = holeContainer.width = 1920;
            //-- holes
            for (var i = 0; i < 11; i++) {
                var hole = new $w.PIXI.Sprite(res.hole.texture);
                var holeEvent = function () {
                    console.log(this.name);
                }
                holeContainer.addChild(hole);
                hole.name = i;
                hole.position.set(mg.holeLocation[i].x, mg.holeLocation[i].y);
            }
            gameContainer.addChild(holeContainer);
            gameContainer.name = 'gameScene';
            //-- inject shortcut
            containers.gameScene = gameContainer;
            containers.gameScene.addChild(containers.charContainer);
            return gameContainer;
        })();

        mg.root.addChild(mainScene);
        mg.root.addChild(gameScene);
        mg.root.addChild(popupScene);
        mg.root.addChild(gameTimer.container);
        mg.root.scale.set(scale, scale);
        mg.gameLoop(0);
        $w.dispatchEvent(new CustomEvent('minigameready', { bubble: true, cancelable: true }));
        $w.dispatchEvent(new CustomEvent('gameappready', { bubble: true, cancelable: true }));
    };
    mg.holeLocation = [];
    mg.renderEnergy = function () {
        var timer = 0;
        var thisTickerEvent = function () {
            timer++;
            if (timer % 5 == 0) {
                totalEnergy += 1;
                if (totalEnergy > 5) {
                    totalEnergy = 0;
                }
                renderEnergy();
            }
        };
    };
    mg.gameLoop = function (time) {
        $w.requestAnimationFrame(mg.gameLoop);
        $w.GameApp.renderer.render(mg.root);
        $w.PIXI.timerManager.update();
        pixiCharm.update();
        //if (gameTimer.container.children.length > 0) {
        //    gameTimer.container.removeChild(gameTimer.container.children[0]);
        //}
        //var text = new $w.PIXI.Text(time + ' ' + $w.performance.timing + ' ' + $w.performance.now());
        //gameTimer.container.addChild(text);
        //console.debug($w.performance.timing);
    };
    mg.setup = function (_regionId) {
        mg.regionId = Number(_regionId);
        mg.initRenderer();
        mg.initializeAssets();
    };

    $w.addEventListener('minigameready', function () {
        $w.console.clear();
        window.console['info'] = function () { };
        globalEvent.fetchServerData();

        checkIsDeviceRooted();
    });
    window.GameApp.MiniGame = mg;
})(window);

