(function LocalNotificationClass(w) {
    'use strict';

    var $w = w,
            ng = w.angular,
            $ = w.jQuery;


    function LocalNotificationService($cordovaLocalNotification, $ionicPlatform) {
        var LocalNotificationService = {};

        $ionicPlatform.ready(function () {
            /*LocalNotificationService.checkIdHatch = function () {
                $w.cordova.plugins.notification.local.cancelAll(function () {
                 alert("done");
                 }, this);
                //var isPresent = false;
                var id = 2;
                $w.cordova.plugins.notification.local.isScheduled(id, function (present) {
                    if (present === true) {
                        id++;
                    }
                    else {
                        HatchId = id;
                    }
                });
            }
            ;*/

            LocalNotificationService.freeIncNotif = function (time, title, message) {
                console.log(time);
                $w.cordova.plugins.notification.local.schedule({
                    id: 1,
                    text: message,
                    title: title,
                    at: time
                });
            };

            LocalNotificationService.setFreeIncNotif = function () {
                var test = {
                    id: 1,
                    text: "Your free incubator is ready.",
                    title: "Hatch Market",
                    at: time
                };
                $w.cordova.plugins.notification.local.schedule(obj);
            };

            LocalNotificationService.hatchNotif = function (time, id) {
                $w.cordova.plugins.notification.local.isPresent(id, function (present) {
                    if (!present) {
                        /*var now = new Date().getTime();
                         var wait = new Date(now + time);
                         console.log(wait);
                         console.log(title);*/
                        console.log(time);
                        $w.cordova.plugins.notification.local.schedule({
                            id: 2,
                            text: "message",
                            title: "test",
                            at: time
                        });
                    }
                    else {
                        this.checkIdHatch();
                    }
                });
            };

            LocalNotificationService.hatchNotif2 = function (time, title, message) {
                $w.cordova.plugins.notification.local.isPresent(3, function (present) {
                    if (!present) {
                        var now = new Date().getTime();
                        var wait = new Date(now + time);
                        $w.cordova.plugins.notification.local.schedule({
                            id: 3,
                            text: 'Message',
                            title: 'Hatch',
                            at: wait
                        });
                    }
                });
            };

            LocalNotificationService.hatchNotif3 = function (time) {
                $w.cordova.plugins.notification.local.isPresent(4, function (present) {
                    if (!present) {
                        $w.cordova.plugins.notification.local.schedule({
                            id: 4,
                            text: 'Message',
                            title: 'Hatch',
                            at: time
                        });
                    }
                });
            };

            LocalNotificationService.hatchNotif4 = function (time) {
                $w.cordova.plugins.notification.local.isPresent(5, function (present) {
                    if (!present) {
                        $w.cordova.plugins.notification.local.schedule({
                            id: 5,
                            text: 'Message',
                            title: 'Hatch',
                            at: time
                        });
                    }
                });

            };

            LocalNotificationService.hatchNotif5 = function (time) {
                $w.cordova.plugins.notification.local.isPresent(6, function (present) {
                    if (!present) {
                        $w.cordova.plugins.notification.local.schedule({
                            id: 6,
                            text: 'Message',
                            title: 'Hatch',
                            at: time
                        });
                    }
                });
            };

            LocalNotificationService.hatchNotif6 = function (time) {
                $w.cordova.plugins.notification.local.isPresent(7, function (present) {
                    if (!present) {
                        $w.cordova.plugins.notification.local.schedule({
                            id: 7,
                            text: 'Message',
                            title: 'Hatch',
                            at: time
                        });
                    }
                });
            };

            LocalNotificationService.sixBeforeDie = function (time) {
                //var now = new Date().getTime();
                //var wait = time - 6jam;
                $w.cordova.plugins.notification.local.update({
                    id: 1,
                    text: 'Free Incubator',
                    title: 'Free Incubator',
                    at: time
                });
            };

            LocalNotificationService.actionNotif = function (time) {
                $w.cordova.plugins.notification.local.schedule({
                    id: 3,
                    text: 'Message',
                    title: 'Title',
                    at: time
                });
            };
        });

        return LocalNotificationService;
    };




    $w.angular.module('gamesapp').factory('LocalNotification', ['$cordovaLocalNotification', '$ionicPlatform', LocalNotificationService]);
})(window);

(function (w) {
    'use strict';
    var $ = w.jQuery;
    var ln = {};

    var oneHour = 60 * 60 * 1000;

    ln.setFreeIncubator = function (ntime) {
        var obj = {
            id: 1,
            text: "Your free incubator is ready.",
            title: "Hatch Market",
            at: ntime
        };

        if (window.cordova) {
            window.cordova.plugins.notification.local.schedule(obj);
            console.log('free incubator notif ', obj);
        }

    };

    ln.addHatchingNotif = function (ntime, incubatorId) {
        var obj = {
            text: "Your hatching egg is done.",
            title: "Hatch Market",
            at: ntime
        };
        if (window.cordova) {
            window.cordova.plugins.notification.local.schedule(obj);
            console.log('hatching selesai ', obj);
        }

    };
    ln.addCharDeadNotif = function (charname, ntime) {
        var obj = {
            text: charname + " is remaining 6 hours left.",
            title: "Hatch Market",
            at: ntime
        };

        if (window.cordova) {
            window.cordova.plugins.notification.local.schedule(obj);
            console.log('char mati ', obj);
        }

    };

    ln.twoDaysNotif = function () {
        //-- game 2 hari gak di buka
        var twodays = oneHour * 24 * 2;
        var sekarang = Date.parse(new Date());
        var ntime = new Date(sekarang + twodays);

        var obj = {
            text: "You look not open the app, many rewards waiting you. Come on Hatcher ! ",
            title: "Hatch Market",
            at: ntime
        };
        if (window.cordova) {
            window.cordova.plugins.notification.local.schedule(obj);
            console.log('2 hari gak buka ', obj);
        }
    };

    ln.addActionCharNotif = function (nText, nTime) {
        var obj = {
            text: nText,
            title: "Hatch Market",
            at: ntime
        };

        if (window.cordova) {
            window.cordova.plugins.notification.local.schedule(obj);
            console.log('action selesai ', obj);
        }
    };

    function registerAppNotif() {
        //-- free incubator
        var freeIncubator = window.izyObject('FreeIncubator').getOne();
        var ntime = new Date(freeIncubator.finishOn);
        ln.setFreeIncubator(ntime);

        //-- hatching selesai
        var hatchingslotData = izyObject('HatchingSlot').getAll();
        $.each(hatchingslotData, function (key, value) {
            if (value.isHatching == 1) {
                var ntime = new Date(value.hatchEnd);
                ln.addHatchingNotif(ntime, value.activeIncubatorId);
                //console.log(value);
            }
        });

        //-- umur char tinggal 6 jam lagi
        var pchars = izyObject('PlayerChars').getAll();
        $.each(pchars, function (key, value) {
            console.log(value);
            var n = Date.parse(new Date());
            var endt = new Date(value.dead_on);


            var t = Date.parse(endt) - (6 * oneHour);
            var ntime = new Date(t);
            //console.log(ntime, endt);

            ln.addCharDeadNotif(value.nickname, ntime);
        });

        //-- game 2 hari gak di buka
        ln.twoDaysNotif();
        
        //-- action char
        $.each(window.GameApp.notifications, function (key, value) {
            var notif = Object(value);
            var ntime = new Date(notif.notifTime);
            ln.addActionCharNotif(notif.text, ntime);
        });
    };
    
    window.addEventListener('gameappready', function () {
        cordova.plugins.notification.local.registerPermission(function (granted) {
            if (granted) {
                cordova.plugins.notification.local.clearAll(function () {
                    console.log('clear done');
                    registerAppNotif();
                }, window);
            }
        });
    });


    
})(window);