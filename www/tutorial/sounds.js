(function (window) {
    'use strict';
    //window.GameApp.bgm = new Audio('asset/audio/Music_di_Environment_Pasir.mp3');
    //window.GameApp.bgm.play();
    //window.GameApp.bgm.loop = true;
    var $ = window.jQuery;

    var sbgm = null;
    var bgm = {
        android: {
            play: function (bgmId) {
                var bgmUrl = '';
                if (window.plugins && window.plugins.NativeAudio) {
                    if (bgmId == 'main') {
                        bgmUrl = 'asset/audio/Monkey-Island-Band_Looping.mp3';
                        window.plugins.NativeAudio.stop('island');
                        window.plugins.NativeAudio.unload('island');
                    } else {
                        bgmUrl = 'asset/audio/199_loop4_jolly-polly_0018.mp3';
                        window.plugins.NativeAudio.stop('main');
                        window.plugins.NativeAudio.unload('main');
                    }


                    window.plugins.NativeAudio.loop(bgmId, function () {
                        console.log('success loop');
                    }, function onerror() {
                        console.log('am i here ?');
                        //-- jika error maka load bgm music nya
                        window.plugins.NativeAudio.preloadComplex(bgmId, bgmUrl, 1, 1, 0, function (msg) {
                            //-- jika sukses mainkan lah
                            window.plugins.NativeAudio.loop(bgmId);

                        }, function (msg) {
                            console.log('error: ' + msg);
                        });

                    });

                    console.log('playing sound');
                }
            },
            stop: function () {
                if (window.plugins && window.plugins.NativeAudio) {
                    window.plugins.NativeAudio.stop('main');
                    window.plugins.NativeAudio.unload('main');
                }
                console.log('stopBGM');
            }
        },
        ios: {
            play: function (bgmId) {
                var bgmUrl = '';
                if (bgmId == 'main') {
                    bgmUrl = 'asset/audio/Monkey-Island-Band_Looping.mp3';
                } else {
                    bgmUrl = 'asset/audio/199_loop4_jolly-polly_0018.mp3';
                }

                sbgm = new Audio(bgmUrl);
                sbgm.loop = true;
                sbgm.play();
            },
            stop: function () {
                sbgm.pause();
            }
        }
    };

    function loadSound(bgmId) {
        //-- sound bunyi ketika berada di function run / runIsland
        var pref = window.izyObject('preference').get(1);
        if (pref.music == 'on') {
            if (window.device) {
                if (String(window.device.platform).toLowerCase() == 'android') {
                    bgm.android.play(bgmId);
                } else {
                    bgm.ios.play(bgmId);
                }
            }
        }

    }

    window.GameApp.stopBGM = function () {
        if (window.device) {
            if (String(window.device.platform).toLowerCase() == 'android') {
                bgm.android.stop();
            } else {
                bgm.ios.stop();
            }
        }
    };
    window.GameApp.loadSound = loadSound;

    var a = 'user1478258873';//14

})(window);
