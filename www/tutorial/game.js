/** Custom Event Listener 
 serverdatetick
 gameappready
 gamedataready
 */


/** init first run game - animation */
(function run($w) {
    //var serverURL = 'http://10multi.azurewebsites.net';
    var serverURL = 'http://10multindo:8080';
    //var serverURL = 'http://hatchmarket.southeastasia.cloudapp.azure.com:8080';
    //var serverURL = 'http://hatchmarket.southeastasia.cloudapp.azure.com/API';
    var rendererOptions = {
        antialiasing: false,
        transparent: true,
        resolution: window.devicePixelRatio,
        autoResize: true
    };

    $w.GameApp = $w.GameApp || {};
    $w.GameApp.serverURL = serverURL;
    $w.GameApp.version = '0.0.8';
    $w.GameApp.uuid = 'hatchmarketdevice';
    $w.GameApp.serverDate = new Date();
    $w.GameApp.sessid = 'a' || md5($w.GameApp.uuid + Date.parse($w.GameApp.serverDate));
    $w.GameApp.http = {};
    $w.GameApp.isInitialized = false;
    $w.GameApp.rendererOptions = rendererOptions;
    $w.GameApp.sendingErrorHandler = function (data, header, status, config) {
        console.log(data, header, status, config);
        //alert('Error while connecting to server.');
        //$w.location = 'index.html';
        return navigator.notification.alert('Error while connecting to server.', function () {
            $w.location = 'main.html';
        });
    };
    $w.GameApp.preference = {
        id: 1,
        music: 'on',
        lang: 'en',
        version: $w.GameApp.version,
        connectedAccountId: ''
    };
    $w.GameApp.isNewGame = true;

    $ = $w.jQuery;

    //-- 
    var checkTicker = window.setTimeout(function () {
        //alert('Something wrong, the app is not running. Click ok to restart the app');
        return navigator.notification.alert('Something wrong, the app is not running. Click ok to restart the app', function () {
            window.location = 'index.html';
        });

    }, 60000 * 2);
    window.addEventListener('gameappready', function () {
        window.clearTimeout(checkTicker);
    });

    function normalizeEventListener() {
        $w.removeEventListener('keydown', function () {
            console.log('removed');
        }, false);
        $w.removeEventListener('keydown', function () { }, false);
        $w.removeEventListener('touchstart', function () { }, false);
        $w.removeEventListener('touchend', function () { }, false);

        $w.document.removeEventListener('touchstart', function (e) {
            console.log('removed?');
        });

        // document.addEventListener('touchmove', function (event) {

        //   event.preventDefault();
        //   event.stopImmediatePropagation();
        //   event.stopPropagation();
        //   return false;
        // });
        // document.addEventListener('touchend', function(event) {
        //   event.preventDefault();      
        //   event.stopImmediatePropagation();
        //   event.stopPropagation();
        //   return false;
        // });
        // document.addEventListener('touchstart', function(event) {
        //   event.preventDefault();
        //   event.stopImmediatePropagation();
        //   event.stopPropagation();
        //   return false;
        // });


        Window = null;
    }

    function initializePreference(callback) {
        var pref = $w.izyObject('preference').get(1);

        if (!pref) {
            pref = $w.clone($w.GameApp.preference);
            var newPref = $w.izyObject('preference').store(pref);
            $w.GameApp.preference = newPref;
            console.log('new pref');
        } else {
            $w.GameApp.isNewGame = false;
        }

        if (typeof (callback) === 'function') {
            callback();
        }
    }

    function run(cb) {
        var pbW = $('#bar1').width();
        var InitAppCallback = cb;
        var waitingT;

        $w.GameApp.isInitialized = true;

        var progress = {};
        progress.firstStep = function () {
            /** Progress 20%  */

            //-- loadIslandImage will be called twice to make sure the image map can be click
            //$w.GameApp.IslandServices.loadIslandImage();
            $w.GameApp.InitializeData(progress.onAfterDataLoaded);
            window.GameApp.loadSound('main');
        };
        progress.onAfterDataLoaded = function () {
            /** Progress 50% **/
            $('#bar2').animate({ 'width': (pbW * 50 / 100) + 'px' }, 1000, 'swing', function () {
                $w.GameApp.IslandServices.PlayerIsland = $w.GameApp.JsonData.island;
                $w.GameApp.IslandServices.loadIslandImage();

                $w.GameApp.Animations.stop();
                $w.GameApp.Animations.reload(progress.finalStep);
            });

        };
        progress.finalStep = function () {
            /** Progress  100% **/

            normalizeEventListener();
            $('#bar2').animate({ 'width': (pbW * 100 / 100) + 'px' }, 500, 'swing', showMainLayout);

            $w.dispatchEvent(new CustomEvent('gameappready', { bubble: true, cancelable: true }));
        };

        function checkVersion() {
            if ($w.cordova) {
                $w.GameApp.uuid = device.uuid;
                cordova.getAppVersion.getVersionNumber(function (version) {
                    $w.GameApp.version = version;
                    checkServer();
                    console.log('checking version');
                });
            } else {
                checkServer();
                console.log('use default version');
            }
        }

        /*function initializeShop() {
         if ($w.device && String($w.device.platform).toLowerCase() == 'android') {
         $w.GameApp.IAP.loadProducts();
         }
         };*/
        function initializeGameAccount() {
            //var hal = window.location.pathname;
            var path = window.location.pathname;
            var page = path.split("/").pop();

            if (page == 'main.html') {
                //-- jika new game, maka harus tunggu dulu setelah user login game accountnya
                if ($w.GameApp.isNewGame) {
                    window.GameApp.Account.init(checkVersion);
                } else {
                    checkVersion();
                    //window.GameApp.Account.init();
                }
            } else {
                checkVersion();
            }
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
            console.log(oData);

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

            $.post(serverURL, oData, responCheckServer).error(function (response) {
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
                var _response = Object(response);


                /** Save Sess id **/
                $w.GameApp.sessid = response.sessid;
                $w.izyObject('sessid').store({ id: 1, sessid: $w.GameApp.sessid });

                /** running server time **/
                $w.GameApp.serverDate = new Date(_response.serverdate);
                if (!_response.serverdate) {
                    //alert('Sorry, something wrong with our server.');
                    //window.location = 'index.html';
                    //return false;
                    return navigator.notification.alert('Sorry, something wrong with our server.', function () {
                        window.location = 'index.html';
                    });
                }

                /** validate version **/
                if ($w.GameApp.version !== _response.version) {
                    //alert('Update available, please install the new version.');
                    //$w.open(_response.updateurl, '_self');
                    //return;
                    return navigator.notification.alert('Update available, please install the new version.', function () {
                        //$w.open(_response.updateurl, '_self');
                        window.location = 'app.html';
                    });
                }

                /** validate server status **/
                if (_response.serverstatus !== 'active') {
                    //alert(_response.servermsg);
                    //$w.open('index.html', '_self');
                    //return;
                    return navigator.notification.alert(_response.servermsg, function () {
                        window.location = 'app.html';
                    });
                }

                if (Number(_response.ft) === 0) {
                    window.location = 'tutorial.html';
                }
            }

            //window.GameApp.bgm = new Audio('asset/audio/Monkey-Island-Band_Looping.mp3');
            //window.GameApp.bgm.play();
            //window.GameApp.bgm.loop = true;


            InitAppCallback(function () {
                /** first step **/
                $('#bar2').animate({ 'width': (pbW * 20 / 100) + 'px' }, 500, 'swing', progress.firstStep);
            });
        }

        function showMainLayout() {
            //-- give time to show progress already 100%
            $w.setTimeout(function () {
                $('#startup-loader').slideUp();

            }, 750);

        }

        initializePreference(function () {
            //-- check emulator atau device
            if (window.cordova) {
                initializeGameAccount();
            } else {
                checkVersion();
            }

        });
        //checkVersion();

        /*window.addEventListener('gameappready', function () {
         initializeShop();
         });*/
        //if (!window.device) {
        //    checkVersion();
        //    console.log('im here');
        //}
        console.log('begin run');


        //waitingT = window.setTimeout(function () {
        //  //responCheckServer(false);
        //  //checkVersion();
        //}, 3000);

    }

    function runIsland(cb) {
        var pbW = $('#bar1').width();
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
            window.GameApp.renderer = new $w.PIXI.autoDetectRenderer($w.innerWidth, $w.innerHeight, rendererOptions, true);
            $('#environtment-1').html(window.GameApp.renderer.view);
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

        /*function initializeShop() {
         if ($w.device && String($w.device.platform).toLowerCase() == 'android') {
         $w.GameApp.IAP.loadProducts();
         }
         
         };*/
        function initializeGameAccount() {
            if (!console) {
                //window.GameApp.Account.init();
            }
            window.GameApp.Account.init();
        }

        function checkServer() {
            var oData = {};

            if ($w.device) {
                oData = {
                    uuid: $w.GameApp.uuid,
                    platform: $w.device.platform,
                    connectedAccountId: $w.GameApp.preference.connectedAccountId
                }
            } else {
                //-- run gm account
                oData = {
                    uuid: 'hatchmarket',
                    platform: 'none',
                    connectedAccountId: 'hatchmarket'
                }
            }

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
                    //window.location = 'index.html';
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



            InitAppCallback(function () {
                progress.firstStep();
            });
        }

        function showMainLayout() {
            //window.GameApp.bgm = new Audio('asset/audio/Music_di_Environment_Pasir.mp3');
            //window.GameApp.bgm.play();
            //window.GameApp.bgm.loop = true;
            window.GameApp.loadSound('island');

            var regionId = $w.getQueryVariable('regionId');
            $w.GameApp.IslandEnviAnim.enterEnvirontment(regionId);
        }


        //document.addEventListener('deviceready', function () {
        //   // window.clearTimeout(waitingT);

        //    initializeGameAccount();
        //    checkVersion();
        //    console.log('begin here');
        //});

        initializePreference(checkVersion);
        //checkVersion();

        //window.addEventListener('gameappready', function () {
        //	initializeShop();
        //});

        //if (!window.device) {
        //    //checkVersion();
        //    console.log('im here');
        //}
        console.log('begin run');
    }

    /**
     * @param endtime ; number time in milisecond
     */
    function getTimeRemaining(endtime) {
        var serverDate = (function () {
            return $w.GameApp.serverDate;
        })();
        var t = Date.parse(new Date(Number(endtime))) - Date.parse(serverDate);
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    /**
     * @param starttime ; number time in milisecond
     * @param endtime ; number time in milisecond
     */
    function dateDiff(starttime, endtime) {
        var t = endtime - starttime;
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    $w.GameApp.getSess = function () {
        var a = $w.izyObject('sessid').getOne();

        //$w.GameApp.sessid = a.sessid;
        //console.log(a.sessid, $w.GameApp.sessid);
        return $w.GameApp.sessid;
    };
    $w.GameApp.serverDate = new Date();
    $w.GameApp.getTimeRemaining = getTimeRemaining;
    $w.GameApp.dateDiff = dateDiff;
    $w.GameApp.Run = run;
    $w.GameApp.RunIsland = runIsland;
})(this);

/** syncronize server data */
(function (w) {
    /** 
     TODO : 
     - check app version, prevent older version. 
     - register this device to create token
     - validate if this is new player or not
     - if new player, he must input username
     
     
     
     **/

})(this);

/** Settings */
(function Settings($w) {
    'use strict';
    var settings = {
        isBGM: true
    };

    //var localSettings = $w.izyObject('GameSettings').getOne();
    //if (localSettings.id) {
    //  settings = localSettings;
    //} else {
    //  $w.izyObject('GameSettings').store(settings);
    //}


    $w.GameApp.Settings = settings;
})(this);

/** Sounds */
(function Sounds($w) {
    function initializeSounds() {
        var sfx = {},
                _bgm1 = new Audio('asset/audio/Monkey-Island-Band_Looping.mp3'),
                _bgm2 = new Audio('asset/audio/Music_di_Environment_Pasir.mp3'),
                _selectSn = new Audio('asset/audio/Button_Sound.mp3'),
                _clickSn = new Audio('asset/audio/CharacterSelectSound.mp3');

        sfx.bgm1 = function () {
            _bgm1.load();
            _bgm1.loop = true;
            _bgm1.volume = ($w.GameApp.Settings.isBGM) ? 1 : 0;
            return _bgm1;
        };
        sfx.bgm2 = function () {
            _bgm2.load();
            _bgm2.loop = true;
            _bgm2.volume = ($w.GameApp.Settings.isBGM) ? 0.4 : 0;
            return _bgm2;
        };
        sfx.selectSn = function () {
            _selectSn.load();
            _selectSn.loop = true;
            _selectSn.volume = 1;
            return _selectSn;
        }
        sfx.select = function () {
            _selectSn.load();
            _selectSn.volume = 1;
            return _selectSn;
        }
        return sfx;
    }
    ;
    //var sfx = initializeSounds();
    //sfx.bgm1().play();
    //console.log('playing sound');
    //$w.GameApp.Sounds = sfx;
})(this);