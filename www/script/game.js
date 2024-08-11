/** Custom Event Listener 
 serverdatetick
 gameappready
 gamedataready
 gamedataupdated
 */


/** init first run game - animation */
(function run($w) {
    var serverURL = 'http://10multi.azurewebsites.net/_dev/API/index.php';
    //var serverURL = 'http://10multindo:8080';
    //var serverURL = 'http://hatchmarket.southeastasia.cloudapp.azure.com:8080';
    //var serverURL = 'http://hatchmarket.southeastasia.cloudapp.azure.com/API';
    //var serverURL = 'http://127.0.0.1';
    var rendererOptions = {
        antialiasing: false,
        transparent: true,
        resolution: window.devicePixelRatio,
        autoResize: true
    };
    //var serverURL = (function () {
    //    var endpoint = {
    //        local: 'http://10multindo:8080/_API',
    //        server: 'http://10multi.azurewebsites.net/_dev/API/index.php'
    //    };

    //    window.document.addEventListener('deviceready', function () {
    //        serverURL = endpoint.server;
    //    });
    //    return endpoint.local;
    //})();

    $w.GameApp = $w.GameApp || {};
    $w.GameApp.serverURL = serverURL;
    $w.GameApp.version = '1.0.5';
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
    $w.GameApp.showMinigame = true;
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

        //-- inject ini biar ticker server date stabil
        window.document.addEventListener('resume', window.GameApp.rootScope.reloadPlayerData);

        //-- inject ini agar matikan console
        window.console.clear();
        window.console['log'] = function () { };
        window.console['info'] = function () { };
        window.console['error'] = function () { };
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
            $('#bar2').animate({'width': (pbW * 50 / 100) + 'px'}, 1000, 'swing', function () {
                $w.GameApp.IslandServices.PlayerIsland = $w.GameApp.JsonData.island;
                $w.GameApp.IslandServices.loadIslandImage();

                $w.GameApp.Animations.stop();
                $w.GameApp.Animations.reload(progress.finalStep);
            });

        };
        progress.finalStep = function () {
            /** Progress  100% **/

            normalizeEventListener();
            $('#bar2').animate({'width': (pbW * 100 / 100) + 'px'}, 500, 'swing', showMainLayout);

            $w.dispatchEvent(new CustomEvent('gameappready', {bubble: true, cancelable: true}));
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
                var _response = Object(response);


                /** Save Sess id **/
                $w.GameApp.sessid = response.sessid;
                $w.izyObject('sessid').store({id: 1, sessid: $w.GameApp.sessid});

                /** running server time **/
                $w.GameApp.serverDate = new Date(_response.serverdate);
                //$w.GameApp.startServerDateTimer(new Date(_response.serverdate));
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

                    // return navigator.notification.alert('Update available, please install the new version.', function () {
                    //$w.open(_response.updateurl, '_self');
                    //window.location = 'app.html';
                    //});
                    if (window.navigator.notification && navigator.notification.alert) {
                        navigator.notification.alert('Update available, please install the new version.');
                    } else {
                        //window.alert('Update available, please install the new version.');
                    }
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
                    var path = window.location.pathname;
                    var page = path.split("/").pop();
                    if (page != 'tutorial.html') {
                        window.location = 'tutorial.html';
                    }
                }
            }

            //window.GameApp.bgm = new Audio('asset/audio/Monkey-Island-Band_Looping.mp3');
            //window.GameApp.bgm.play();
            //window.GameApp.bgm.loop = true;


            InitAppCallback(function () {
                /** first step **/
                $('#bar2').animate({'width': (pbW * 20 / 100) + 'px'}, 500, 'swing', progress.firstStep);
            });
        }

        function showMainLayout() {
            //-- give time to show progress already 100%
            $w.setTimeout(function () {
                $('#startup-loader').slideUp();

            }, 750);

        }

        $w.loadFont(function () {
            initializePreference(function () {
                //-- check emulator atau device
                if (window.cordova) {
                    initializeGameAccount();
                } else {
                    checkVersion();
                }

            });
        });

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

            window.GameApp.renderer = new $w.PIXI.autoDetectRenderer(tWidth, tHeight, rendererOptions, true);
            window.GameApp.renderer.view.style.margin = 'auto';
            //window.GameApp.renderer.view.style.border = '1px solid red';

            $('#environtment-1').html(window.GameApp.renderer.view);
            showMainLayout();
            $w.dispatchEvent(new CustomEvent('gameappready', {bubble: true, cancelable: true}));
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
                $w.izyObject('sessid').store({id: 1, sessid: $w.GameApp.sessid});

                /** running server time **/
                $w.GameApp.serverDate = new Date(_response.serverdate);
                //$w.GameApp.startServerDateTimer(new Date(_response.serverdate));

                /** validate version **/
                if ($w.GameApp.version !== _response.version) {
                    //alert('Update available, please install the new version.');
                    //$w.open(_response.updateurl, '_system');
                    //return;

                    //return navigator.notification.alert('Update available, please install the new version.', function () {
                    //    $w.open(_response.updateurl, '_system');
                    //});

                    if (window.navigator.notification && navigator.notification.alert) {
                        navigator.notification.alert('Update available, please install the new version.');
                    } else {
                        //  window.alert('Update available, please install the new version.');
                    }
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


        $w.loadFont(function () {
            initializePreference(checkVersion);
        });

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
        var serverDate = serverDate;
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
    $w.GameApp.initializePreference = initializePreference;
    $w.GameApp.Run = run;
    $w.GameApp.RunIsland = runIsland;
    $w.GameApp.RaiseUpdatedEvent = function (whatever) {
        var evt = new CustomEvent('gamedataupdated', {detail: whatever});
        window.dispatchEvent(evt);
    };
    $w.GameApp.intervalTimer = function () {
        var timeOfServer = Date.parse($w.GameApp.serverDate);
        var newDate = new Date(timeOfServer + 1000);
        $w.GameApp.serverDate = newDate;
        $w.GameApp.rootScope.serverDate = newDate;

        var event = new CustomEvent('serverdatetick', {
            detail: $w.GameApp.serverDate,
            bubbles: true,
            cancelable: true
        });
        $w.dispatchEvent(event);
        // console.log($w.GameApp.serverDate)
    };
    $w.GameApp.startServerDateTimer = function (newDate) {
        $w.GameApp.interval.cancel($w.GameApp.intervalTimer);
        $w.GameApp.serverDate = newDate;
        /*$w.clearInterval($w.GameApp.intervalTimer);
         $w.setInterval($w.GameApp.intervalTimer, 1000);*/

        function runningTimerFunc() {
            var timeOfServer = Date.parse($w.GameApp.serverDate);
            var newDate = new Date(timeOfServer + 1000);
            $w.GameApp.serverDate = newDate;
            //$w.GameApp.rootScope.serverDate = newDate;
            var event = new CustomEvent('serverdatetick', {
                detail: $w.GameApp.serverDate,
                bubbles: true,
                cancelable: true
            });
            $w.dispatchEvent(event);
        }
        //-- di deklarasikan di app-service.js
        $w.GameApp.interval.cancel($w.GameApp.intervalTimer);
        $w.GameApp.intervalTimer = $w.GameApp.interval(runningTimerFunc, 1000);
    }
})(this);

/** Font */
(function ($w) {
    function loadFont(callbackFunc) {
        $w.WebFontConfig = {
            custom: {
                families: ['Quicksand-Bold'],
                urls: ['asset/fonts/Quicksand-Bold/styles.css']
            }, active: function () {
                callbackFunc();
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
    }
    ;
    $w.loadFont = loadFont;
})(this);

/** Promo */
(function ($w) {
    'use strict';
    var $ = $w.jQuery;
    var promo = {};
    promo.data = {};
    promo.load = function () {
        var req = $.getJSON(window.GameApp.serverURL + '/data/promo');
        req.success(function (res) {
            var enddate = Date.parse(res.header.enddate);
            var remaining = $w.GameApp.getTimeRemaining(enddate);

            promo.data = Object(res.data);
            if (remaining.total > 0 || res.header == 1) {
                promo.show();
            }

        });
    };
    promo.show = function () {
        var opts = {};

        opts.scope = (function () {
            var scope = $w.GameApp.rootScope.$new();
            scope.data = promo.data;
            scope.closeBanner = function () {
                $w.GameApp.ionicLoading.hide();
            };
            scope.action = function (type, param) {
                console.debug(type, param);
                if (type == 'shop') {
                    $w.GameApp.IAP.buy(param);
                }
            };
            scope.$apply();
            return scope;
        })();
        ;
        opts.templateUrl = 'templates/promo-banner.html';

        $w.GameApp.ionicLoading.show(opts);
    };

    window.addEventListener('gameappready', function () {
        var path = window.location.pathname;
        var page = path.split("/").pop();

        if (page == 'main.html') {
            $w.setTimeout(promo.load, 2500);
        }

    });
})(window);

/** Hack Tools 
 * add event nohackingtools to window
 */
(function ($w) {
    var $ = $w.jQuery;
    var ht = {};

    ht.list = [];
    ht.showAlert = function (appname) {
        var textError = 'Please uninstall "' + appname + '" then you can play Hatch Market.';
        $w.navigator.notification.alert(textError, function () {
            window.navigator.app.exitApp();
        });
    };
    ht.load = function () {
        var fetch = function () {
            var req = $.getJSON($w.GameApp.serverURL + '/data/hackingtools');
            req.success(function (res) {
                ht.list = Object(res);
                ht.check();
                console.debug(res);
            });
            req.error(fetch);
            console.info('fetch hacking tools');
        };
        if ($w.device && String($w.device.platform).toLowerCase() == 'android') {
            fetch();
        }

    };
    ht.check = function (cbFunc) {
        var counter = 0;
        var sendToServer = function (appname) {
            var xurl = $w.GameApp.serverURL + '/minigame/hackingtools';
            var request = $w.GameApp.http.post(xurl, {name: appname});
            request.error(function () {
                sendToServer(appname);
            });
        };
        $.each(ht.list, function (key, value) {
            var sApp = startApp.set({
                "package": value.apk
            });
            console.debug(sApp);
            //console.debug(value.apk);
            sApp.check(function sc(values) {
                ht.showAlert(value.name);
                sendToServer(value.name);
            }, function err() {
                counter++;
                if (counter == ht.list.length) {
                    $w.dispatchEvent(new CustomEvent('nohackingtools', {bubble: true, cancelable: true}));

                    if (typeof (cbFunc) == 'function') {
                        cbFunc();
                    }
                }
            });
        });
    };

    $w.hacktools = ht;

    $w.addEventListener('nohackingtools', function () {
        console.debug('nohackingtools')
    });
    $w.addEventListener('gameappready', ht.load);
})(window);