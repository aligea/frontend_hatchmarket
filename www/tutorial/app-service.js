(function (win) {
    'use strict';

    var ng = win.angular,
      $w = win,
      izyObject = $w.izyObject;

    var $ = win.jQuery;


    function AppService($ionicLoading, $interval, $http, $rootScope, Incubators, HatchingSlot, PlayerInfo, InventorySlot) {
        var AppService = {};
        var dateProcesInterval;
        var backgroundProcessInterval;
        var settings = new izyObject('settings').getOne();
        var callbackFunc;

        AppService.incubators = Incubators;
        AppService.hatchingSlot = HatchingSlot;
        AppService.playerInfo = PlayerInfo;
        AppService.inventorySlot = InventorySlot;

        AppService.serverDate = new Date();
        AppService.http = $http;
        AppService.initApp = function (listenerFunc) {
            callbackFunc = listenerFunc;
            var timeOfServer = Date.parse($w.GameApp.serverDate);

            /** running time ticker of server time **/
            dateProcesInterval = $interval(function () {
                timeOfServer += 1000;
                AppService.serverdate = new Date(timeOfServer);
                $rootScope.serverDate = AppService.serverdate;
                $rootScope.$broadcast('serverdate-tick', AppService.serverdate);

                window.GameApp.serverDate = $rootScope.serverDate;

                var event = new CustomEvent('serverdatetick', {
                    detail: function () {
                        return $w.GameApp.serverDate;
                    },
                    bubbles: true,
                    cancelable: true
                });
                $w.dispatchEvent(event);

            }, 1000);


            // PlayerInfo.setDummyData();
            //HatchingSlot.setDummyData();
            //Incubators.setDummyData();
            //InventorySlot.setDummyData();


            var url = $w.GameApp.serverURL + '/playerdata';


            $ionicLoading.show();
            $w.izyObject('PlayerInfo').reset();
            $w.izyObject('FreeIncubator').reset();
            $w.izyObject('HatchingSlot').reset();
            $w.izyObject('IncubatorBalance').reset();
            $w.izyObject('PlayerChars').reset();
            $w.izyObject('InventorySlot').reset();

            $http.post(url, {}).then(function onSuccess(response) {
                //var playerInfo = izyObject('PlayerInfo').getOne();
                var playerInfo = Object(response.data.PlayerInfo);
                var freeIncubator = Object(response.data.FreeIncubator);
                var incubatorData = response.data.IncubatorBalance;
                var hatchingSlot = response.data.HatchingSlot;
                var playerChars = response.data.PlayerChars;
                var inventorySlot = response.data.InventorySlot;

                $w.jQuery.each(incubatorData, function (key, value) {
                    var incubatorBalance = Object(value);
                    $w.izyObject('IncubatorBalance').store(incubatorBalance);
                });

                $w.jQuery.each(hatchingSlot, function (key, value) {
                    var objData = Object(value);
                    $w.izyObject('HatchingSlot').store(objData);
                });
                $w.jQuery.each(playerChars, function (key, value) {
                    var objData = Object(value);
                    $w.izyObject('PlayerChars').store(objData);
                });

                $w.jQuery.each(inventorySlot, function (key, value) {
                    var objData = Object(value);
                    $w.izyObject('InventorySlot').store(objData);
                });

                $w.izyObject('PlayerInfo').store(playerInfo);
                $w.izyObject('FreeIncubator').store(freeIncubator);


                //-- inject notification
                $w.GameApp.LocalNotif.setup($http);
                $w.GameApp.LocalNotif.reload();

                $rootScope.playerInfo = playerInfo;
            }, function onFailed(response) {

            }).finally(function onFinally() {
                $ionicLoading.hide();

                callbackFunc();
                console.log('init app fired!');
            });
        };
        AppService.deleteAccount = function () {
            var confirm1 = confirm('Are you sure delete this account ?');
            if (!confirm1) {
                return;
            }
            var url = $w.GameApp.serverURL + '/delete-account';


            $ionicLoading.show();


            $http.post(url, {}).then(function onSuccess(response) {


            }, function onFailed(response) {

            }).finally(function onFinally() {
                $ionicLoading.hide();
                $w.open('index.html', '_self');


            });
        };

        
        $rootScope.reloadPlayerData = function (callback) {
            var url = $w.GameApp.serverURL + '/playerdata';


            $ionicLoading.show();
            $w.izyObject('PlayerInfo').reset();
            $w.izyObject('FreeIncubator').reset();
            $w.izyObject('HatchingSlot').reset();
            $w.izyObject('IncubatorBalance').reset();
            $w.izyObject('PlayerChars').reset();
            $w.izyObject('InventorySlot').reset();

            $http.post(url, {}).then(function onSuccess(response) {
                //var playerInfo = izyObject('PlayerInfo').getOne();
                var playerInfo = Object(response.data.PlayerInfo);
                var freeIncubator = Object(response.data.FreeIncubator);
                var incubatorData = response.data.IncubatorBalance;
                var hatchingSlot = response.data.HatchingSlot;
                var playerChars = response.data.PlayerChars;
                var inventorySlot = response.data.InventorySlot;

                $w.jQuery.each(incubatorData, function (key, value) {
                    var incubatorBalance = Object(value);
                    $w.izyObject('IncubatorBalance').store(incubatorBalance);
                });

                $w.jQuery.each(hatchingSlot, function (key, value) {
                    var objData = Object(value);
                    $w.izyObject('HatchingSlot').store(objData);
                });
                $w.jQuery.each(playerChars, function (key, value) {
                    var objData = Object(value);
                    $w.izyObject('PlayerChars').store(objData);
                });

                $w.jQuery.each(inventorySlot, function (key, value) {
                    var objData = Object(value);
                    $w.izyObject('InventorySlot').store(objData);
                });

                $w.izyObject('PlayerInfo').store(playerInfo);
                $w.izyObject('FreeIncubator').store(freeIncubator);

                $rootScope.playerInfo = playerInfo;
                $rootScope.playerChars = playerChars;
                $ionicLoading.hide();
            }, function onFailed(response) {

            }).finally(function onFinally() {
                

                if (typeof (callback) == 'function') {
                    callback();
                }
            });
        };

        return AppService;
    };

    ng.module('gamesapp').factory('AppService', ['$ionicLoading', '$interval', '$http', '$rootScope', 'Incubators',
        'HatchingSlot', 'PlayerInfo', 'InventorySlot', AppService
    ]);
})(window);