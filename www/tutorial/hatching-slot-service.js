﻿(function (win) {
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
        //var slot = izyObject('HatchingSlot').get(slotId);
        //var countdown = this.getTimeRemaining(slot.hatchingEnd);
        //var remainingDiamond = Math.ceil(countdown.total / 60 / 60 / 1000);
        //var obj = {};
        //var playerInfo = izyObject('PlayerInfo').getOne();

        //playerInfo.diamondBalance -= remainingDiamond;
        //izyObject('PlayerInfo').store(playerInfo);

        //slot.isFinishWithDiamond = 1;
        //izyObject('HatchingSlot').store(slot);

        //obj.hatchingTransId = slot.transId;
        //obj.transOn = Date.parse($rootScope.serverDate);
        //obj.amountDiamond = remainingDiamond;
        //obj.hatchingStart = slot.hatchingStart;
        //obj.hatchingEnd = slot.hatchingEnd;
        //obj.hatchDiff = obj.hatchingEnd - obj.transOn;
        //izyObject('HatchingWithDiamond').store(obj);

        //$rootScope.playerInfo = playerInfo;

        //-- send data to server
        $ionicLoading.show();
        $w.izyObject('HatchingSlot').reset();
        $w.izyObject('PlayerInfo').reset();
        var url = $w.GameApp.serverURL + '/hatchingslot/finishnow';
        $http.post(url, { slotId: slotId }).then(function onSuccess(response) {
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
    }
    HatchingSlot.addIncubatorToSlot = function (incubatorId, eggCode, callbackFunc) {
      //var obj = {};
      //var hatchingSlot = new izyObject('HatchingSlot').get(this.getAvailableSlot());
      //var incubator = new izyObject('IncubatorBalance').get(incubatorId);
      //var playerInfo = new izyObject('PlayerInfo').getOne();

      ////-- # later this must be sent data to server, if connection error then restart app    



      ////-- insert an HatchingEgg
      //obj.playerId = playerInfo.playerId;
      //obj.incubatorId = incubator.id;
      //obj.slotId = hatchingSlot.id;
      //obj.hatchStart = Date.parse($rootScope.serverDate);
      //obj.hatchDuration = incubator.durationInMinute * 60 * 1000; //-- in miliseconds
      //obj.hatchEnd = obj.hatchStart + obj.hatchDuration;
      //obj.eggCode = eggCode;
      //obj.transId = md5(obj.playerId + '-' + obj.incubatorId + '-' + obj.slotId + '-' + obj.eggCode + '-' + obj.hatchStart);
      //izyObject('HatchingEgg').store(obj);


      ////-- update slot
      //hatchingSlot.isAvailable = 0;
      //hatchingSlot.isEmpty = 0;

      //hatchingSlot.activeIncubatorId = obj.incubatorId;
      //hatchingSlot.eggCode = eggCode;

      //hatchingSlot.hatchingStart = obj.hatchStart;
      //hatchingSlot.hatchingDuration = obj.hatchDuration;
      //hatchingSlot.hatchingEnd = obj.hatchEnd;
      //hatchingSlot.imageToShow = incubator.imageUrl[0];
      //hatchingSlot.isHatching = 1;
      //hatchingSlot.isFinishWithDiamond = 0;
      //izyObject('HatchingSlot').store(hatchingSlot);


      ////-- update incubator
      //incubator.playerHave -= 1;
      //izyObject('IncubatorBalance').store(incubator);



      //-- send data to server
      $ionicLoading.show();
      $w.izyObject('HatchingSlot').reset();
      $w.izyObject('IncubatorBalance').reset();
      var url = $w.GameApp.serverURL + '/hatchingslot/add';
      $http.post(url, { eggcode: eggCode, incubatorId: incubatorId }).then(function onSuccess(response) {
        var incubatorData = response.data.IncubatorBalance;
        var hatchingSlot = response.data.HatchingSlot;

        $w.jQuery.each(incubatorData, function (key, value) {
          var incubatorBalance = Object(value);
          $w.izyObject('IncubatorBalance').store(incubatorBalance);
        });

        $w.jQuery.each(hatchingSlot, function (key, value) {
          var objData = Object(value);

          $w.izyObject('HatchingSlot').store(objData);
        });

      }, function onFailed(response) {
        //-- on error ??


      }).finally(function onFinally() {
        callbackFunc();
        $ionicLoading.hide();

      });


      //-- after success doing all business, fire the callback function
      if (typeof callbackFunc == 'function') {
        callbackFunc();
      }



      //-- # add to local notification queue


    }
    HatchingSlot.purchaseSlot = function (slotId, callbackFunc) {
      //var slot = new izyObject('HatchingSlot').get(slotId);
      //var playerInfo = izyObject('PlayerInfo').getOne();
      //var obj = {};

      //obj.transOn = Date.parse($rootScope.serverDate);
      //obj.slotId = slot.id;
      //obj.price = slot.price;
      //izyObject('SlotPurchasing').store(obj);

      //slot.isPurchased = 1;
      //slot.isAvailable = 1;
      //slot.isEmpty = 1;
      //slot.activeIncubatorId = 0;
      //slot.hatchingStart = 0;
      //slot.hatchingDuration = 0;
      //slot.hatchingEnd = 0;
      //slot.imageToShow = '';
      //slot.isHatching = 0;
      //slot.isFinishWithDiamond = 0;
      //slot.purchaseOn = obj.transOn;
      //izyObject('HatchingSlot').store(slot);

      //playerInfo.diamondBalance -= slot.price;
      //izyObject('PlayerInfo').store(playerInfo);

      //$rootScope.playerInfo = playerInfo;

      var url = $w.GameApp.serverURL + '/hatchingslot/purchase';

      $ionicLoading.show();
      $w.izyObject('PlayerInfo').reset();
      $w.izyObject('HatchingSlot').reset();

      $http.post(url, { id: slotId }).then(function onSuccess(response) {
        var playerInfo = Object(response.data.PlayerInfo);
        var hatchingSlot = response.data.HatchingSlot;

        $w.jQuery.each(hatchingSlot, function (key, value) {
          var objData = Object(value);

          $w.izyObject('HatchingSlot').store(objData);
        });

        $w.izyObject('PlayerInfo').store(playerInfo);

        $rootScope.playerInfo = playerInfo;
      }, function onFailed(response) {
        //-- on failed


      }).finally(function onFinally() {
        $ionicLoading.hide();

        callbackFunc();
      });
    }
 
    HatchingSlot.openSlot = function (slotId, callbackFunc) {
      var url = $w.GameApp.serverURL + '/hatchingslot/open';

      $ionicLoading.show();
      $w.izyObject('PlayerInfo').reset();
      $w.izyObject('HatchingSlot').reset();
      $w.izyObject('PlayerChars').reset();

      $http.post(url, { id: slotId }).then(function onSuccess(response) {
        var playerInfo = Object(response.data.PlayerInfo);
        var hatchingSlot = response.data.HatchingSlot;
        var playerChars = response.data.PlayerChars;
        var hatchedChar = response.data.HatchedChar;

        $w.jQuery.each(hatchingSlot, function (key, value) {
          var objData = Object(value);

          $w.izyObject('HatchingSlot').store(objData);
        });
        $w.jQuery.each(playerChars, function (key, value) {
          var objData = Object(value);

          $w.izyObject('PlayerChars').store(objData);
        });

        $w.izyObject('PlayerInfo').store(playerInfo);

        $rootScope.playerInfo = playerInfo;
        callbackFunc(hatchedChar);
      }, function onFailed(response) {
        //-- on failed
          $w.GameApp.rootScope.reloadPlayerData(function () { });

      }).finally(function onFinally() {
        $ionicLoading.hide();

        
      });
    }
 
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

    izyObject('HatchingSlot').reset();

    return HatchingSlot;
  }


  win.angular.module('gamesapp').factory('HatchingSlot', ['$rootScope', '$http', '$ionicLoading', HacthingSlotService]);

})(window);