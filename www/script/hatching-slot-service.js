(function (win) {
    'use strict';

    var $w = win;


    function HacthingSlotService($rootScope, $http, $ionicLoading) {
        var HatchingSlot = {};

        HatchingSlot.total = 6;
        HatchingSlot.emptyImageUrl = 'asset/img/incubators/emptyslot.png';
        HatchingSlot.lockedImageUrl = 'asset/img/incubators/lockedslot.png';

        HatchingSlot.getAvailableSlot = function () {
            var data = new izyObject('HatchingSlot').getAll();
            for (var index in data) {
                var obj = data[index];
                if (obj.isAvailable == 1) {
                    return obj.id;
                }
            }
            return false;
        }
        HatchingSlot.getAll = function () {
            var listdata = [];
            var slotData = izyObject('HatchingSlot').getAll().sort(window.sortById);


            for (var index = 0; index < slotData.length; index++) {
                var obj = slotData[index];

                if (obj.isHatching == 1) {
                    var hatchingEnd = Date.parse(obj.hatchEnd);
                    //var countdown = this.getTimeRemaining(hatchingEnd);
                    var countdown = window.GameApp.getTimeRemaining(hatchingEnd);
                    
                    if (countdown.total >= 0) {
                        var remainingDiamond = Math.ceil(countdown.total / 60 / 60 / 1000);

                        obj.countDown = ('0' + countdown.hours).slice(-2) + ':' + ('0' + countdown.minutes).slice(-2) + ':' + ('0' + countdown.seconds).slice(-2);
                        obj.countDown = '<i class="fill-round">' + ('0' + countdown.hours).slice(-2) + '</i> : <i class="fill-round">' + ('0' + countdown.minutes).slice(-2) + '</i> : <i class="fill-round" id="second">' + ('0' + countdown.seconds).slice(-2) + '</i>';
                        obj.buttonText = 'Finish Now ' + remainingDiamond + ' <i class="icon-diamond"><img src="asset/img/icon-diamond.png"></i>';
                        obj.buttonAction = 'finishNow';
                        obj.progress = -(284 / 60) * (Number(countdown.seconds) - 60);
                        obj.isComplete = 0;
                    } else {
                        obj.countDown = 'COMPLETE';
                        obj.buttonText = 'Open Now !';
                        obj.buttonAction = 'openNow';
                        obj.isComplete = 1;
                    }

                    if (obj.isFinishWithDiamond == 1) {
                        obj.countDown = 'COMPLETE';
                        obj.buttonText = 'Open Now !';
                        obj.buttonAction = 'openNow';
                        obj.isComplete = 1;
                    }

                } else {
                    if (obj.isFree == 1 || obj.isPurchased == 1) {
                        obj.imageToShow = this.emptyImageUrl;
                        obj.countDown = '&nbsp;';
                        obj.buttonText = 'Empty Slot';
                        obj.buttonAction = 'setPage';
                        obj.isComplete = 0;
                    } else {
                        obj.imageToShow = this.lockedImageUrl;
                        obj.countDown = '&nbsp;';
                        obj.buttonText = 'Add Slot ' + obj.price + ' <i class="icon-diamond"><img src="asset/img/icon-diamond.png"></i>';
                        obj.buttonAction = 'expandSlot';
                        obj.isComplete = 0;
                    }
                }
                listdata.push(obj);
            }


            return listdata;
        }
        HatchingSlot.finishingSlot = function (slotId, callback) {

            //-- send data to server
            $ionicLoading.show();

            var url = $w.GameApp.serverURL + '/hatchingslot/finishnow';
            $http.post(url, { slotId: slotId }).then(function onSuccess(response) {
                $w.izyObject('HatchingSlot').reset();
                $w.izyObject('PlayerInfo').reset();

                var playerInfo = Object(response.data.PlayerInfo);
                var hatchingSlot = response.data.HatchingSlot;

                $w.jQuery.each(hatchingSlot, function (key, value) {
                    var objData = Object(value);
                    $w.izyObject('HatchingSlot').store(objData);
                });

                $w.izyObject('PlayerInfo').store(playerInfo);
                $rootScope.playerInfo = playerInfo;

                callback();
            }, function onFailed(response) {
                //-- on error ??
                window.GameApp.rootScope.reloadPlayerData();

            }).finally(function onFinally() {
                // callbackFunc();
                $ionicLoading.hide();

            });
        };
        HatchingSlot.getById = function (id) {
            var listdata = this.getAll();
            for (var index in listdata) {
                var obj = listdata[index];
                if (obj.id == id) {
                    return obj;
                }
            }
            return false;
        };
        HatchingSlot.addIncubatorToSlot = function (incubatorId, eggCode, callbackFunc) {
            //-- send data to server
            $ionicLoading.show();

            var url = $w.GameApp.serverURL + '/hatchingslot/add';
            $http.post(url, { eggcode: eggCode, incubatorId: incubatorId }).then(function onSuccess(response) {

                $w.izyObject('HatchingSlot').reset();
                $w.izyObject('IncubatorBalance').reset();

                var incubatorData = response.data.IncubatorBalance;
                var hatchingSlot = response.data.HatchingSlot;

                for (var i = 0; i < incubatorData.length; i++) {
                    var incubatorBalance = Object(incubatorData[i]);
                    $w.izyObject('IncubatorBalance').store(incubatorBalance);
                }

                var latest = 0;
                for (var i = 0; i < hatchingSlot.length; i++) {
                    var objData = Object(hatchingSlot[i]);
                    $w.izyObject('HatchingSlot').store(objData);
                    //console.log(objData.hatchStart);
                    var thisTime = Date.parse(objData.hatchStart);
                    if (thisTime > latest) {
                        latest = thisTime;
                    }
                }

                //window.GameApp.interval.cancel(window.GameApp.intervalTimer);
                window.removeEventListener('serverdatetick', window.GameApp.EggBusiness.interval);
                window.GameApp.startServerDateTimer(new Date(latest));
                window.addEventListener('serverdatetick', window.GameApp.EggBusiness.interval);
                callbackFunc();
            }, function onFailed(response) {
                //-- on error ??
                window.GameApp.rootScope.reloadPlayerData();
            }).finally(function onFinally() {
                $ionicLoading.hide();
            });


            //-- after success doing all business, fire the callback function
            if (typeof callbackFunc == 'function') {
                callbackFunc();
            }



            //-- # add to local notification queue


        };
        HatchingSlot.purchaseSlot = function (slotId, callbackFunc) {
            var url = $w.GameApp.serverURL + '/hatchingslot/purchase';

            $ionicLoading.show();
            $http.post(url, { id: slotId }).then(function onSuccess(response) {
                $w.izyObject('PlayerInfo').reset();
                $w.izyObject('HatchingSlot').reset();
                var playerInfo = Object(response.data.PlayerInfo);
                var hatchingSlot = response.data.HatchingSlot;

                for (var i = 0; i < hatchingSlot.length; i++) {
                    var objData = Object(hatchingSlot[i]);
                    $w.izyObject('HatchingSlot').store(objData);
                }

                $w.izyObject('PlayerInfo').store(playerInfo);

                $rootScope.playerInfo = playerInfo;
                callbackFunc();
            }, function onFailed(response) {
                //-- on failed
                window.GameApp.rootScope.reloadPlayerData();
            }).finally(function onFinally() {
                $ionicLoading.hide();


            });
        };
        HatchingSlot.openSlot = function (slotId, callbackFunc) {
            var url = $w.GameApp.serverURL + '/hatchingslot/open';

            $ionicLoading.show();
            $http.post(url, { id: slotId }).then(function onSuccess(response) {
                $w.izyObject('PlayerInfo').reset();
                $w.izyObject('HatchingSlot').reset();
                $w.izyObject('PlayerChars').reset();

                var playerInfo = Object(response.data.PlayerInfo);
                var hatchingSlot = response.data.HatchingSlot;
                var playerChars = response.data.PlayerChars;
                var hatchedChar = response.data.HatchedChar;

                //-- foreach hatchingSlot
                for (var i = 0; i < hatchingSlot.length; i++) {
                    var objData = Object(hatchingSlot[i]);
                    $w.izyObject('HatchingSlot').store(objData);
                }

                //-- foreach playerchar
                for (var i = 0; i < playerChars.length; i++) {
                    var objData = Object(playerChars[i]);
                    $w.izyObject('PlayerChars').store(objData);
                }
                
                $w.izyObject('PlayerInfo').store(playerInfo);

                $rootScope.playerInfo = playerInfo;
                callbackFunc(hatchedChar);
            }, function onFailed(response) {
                //-- on failed
                window.GameApp.rootScope.reloadPlayerData();
            }).finally(function onFinally() {
                $ionicLoading.hide();
            });
        };
        HatchingSlot.getTimeRemaining = function (endtime) {
            if ($rootScope.serverDate == 'undefined') {
                return;
            }
            var t = Date.parse(new Date(Number(endtime))) - Date.parse($rootScope.serverDate);
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
        };

        //izyObject('HatchingSlot').reset();

        return HatchingSlot;
    }


    win.angular.module('gamesapp').factory('HatchingSlot', ['$rootScope', '$http', '$ionicLoading', HacthingSlotService]);

})(window);