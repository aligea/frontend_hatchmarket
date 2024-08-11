(function (w) {
    'use strict';
    var $ = w.jQuery;
    var localnotif = {};
    var $http = {};
    var notifData = [];

    function addNotification(id, nText, nTime) {
        var androidObj = {
            id: id,
            text: nText,
            title: "Hatch Market",
            at: nTime,
            icon: "res://icon.png",
            smallIcon: "res://icon.png",
            badge : 1
        };
        var iosObj = {
            id: id,
            text: nText,
            title: "Hatch Market",
            at: nTime,
            badge :1
        };        
        if (window.cordova) {
            if(String(window.device.platform).toLowerCase() == 'ios'){
                window.cordova.plugins.notification.local.schedule(iosObj);
                console.log(iosObj);
            }else{
                window.cordova.plugins.notification.local.schedule(androidObj);
                console.log(androidObj);
            }
            
        }
        //console.log(obj);
    };
    function isIDExist(id) {
        for (var i = 0; i < notifData.length; i++) {
            if (id == notifData[i].id) {
                return true;
            }
        }
        return false;
    }
    function registerAllNotif() {
        $.each(notifData, function (key, value) {
            var notif = Object(value);
            var nTime = new Date(notif.notifTime);
            var id = Number(notif.id);
            addNotification(id, notif.text, nTime);
        });
    };

    function sendRequest(callback) {
        var url = window.GameApp.serverURL + '/notification';

        $http.post(url, {}).then(function onSuccess(response) {
            notifData = response.data.Notifications;

            callback();
        }, function onFailed(response) {

        }).finally(function onFinally() {


        });
    };

    localnotif.setup = function (http) {
        $http = http;
    };


    localnotif.reload = function () {
        console.log('reload notif');
        if (window.cordova) {
            w.cordova.plugins.notification.local.registerPermission(function (granted) {
                console.log('cek permission notif');
                if (granted) {
                    //w.cordova.plugins.notification.local.clearAll(function () {
                    //    w.cordova.plugins.notification.local.cancelAll(function () {
                    //        sendRequest(registerAllNotif);
                    //    });
                    //});
                    sendRequest(registerAllNotif);
                }
            });
        }

    };

    w.GameApp.LocalNotif = localnotif;
})(window);