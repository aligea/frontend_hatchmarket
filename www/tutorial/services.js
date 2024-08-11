(function ($w) {
  'use strict';

  var APP = $w.angular.module('gamesapp');

  APP.factory('Incubators', function ($rootScope, $http, $ionicLoading) {
    var Incubators = {};
    Incubators.masterData = [
        {
          id: 1,
          name: "Mini Incubator",
          level: 'asset/img/incubators/Star1.png',
          level_name: 'LV 1',
          image_Source: 'asset/img/incubators/Lv1.png',
          imageSource: "asset/img/incubators/Lv.1.png",
          imageUrl: ['asset/img/incubators/Lv1Telur.png'],
          priceInDiamond: 2,
          durationInMinute: 240,
          durationText: '4 Hours',
          durationDetails: '04:00:00',
          characterPosibility: 'Common (no eggcode)'
        },
        {
          id: 2,
          name: "Stone Incubator",
          level: 'asset/img/incubators/Star2.png',
          level_name: 'LV 2',
          image_Source: 'asset/img/incubators/Lv2.png',
          imageSource: "asset/img/incubators/Lv.2.png",
          imageUrl: ['asset/img/incubators/Lv2Telur.png'],
          priceInDiamond: 10,
          durationInMinute: 180,
          durationText: '3 Hours',
          durationDetails: '03:00:00',
          characterPosibility: 'Common'
        },
        {
          id: 3,
          name: "Lava Incubator",
          level: "asset/img/incubators/Star3.png",
          level_name: 'LV 3',
          image_Source: "asset/img/incubators/Lv3.png",
          imageSource: "asset/img/incubators/Lv.3.png",
          imageUrl: ['asset/img/incubators/Lv3Telur.png'],
          priceInDiamond: 20,
          durationInMinute: 120,
          durationText: '2 Hours',
          durationDetails: '02:00:00',
          characterPosibility: 'Common - Rare'
        },
        {
          id: 4,
          name: "Holy Incubator",
          level: "asset/img/incubators/Star4.png",
          level_name: 'LV 4',
          image_Source: "asset/img/incubators/Lv4.png",
          imageSource: "asset/img/incubators/Lv.4.png",
          imageUrl: ['asset/img/incubators/Lv4Telur.png'],
          priceInDiamond: 30,
          durationInMinute: 60,
          durationText: '1 Hours',
          durationDetails: '01:00:00',
          characterPosibility: 'Rare - Epic'
        },
        {
          id: 5,
          name: "Mighty Incubator",
          level: "asset/img/incubators/Star5.png",
          level_name: 'LV 5',
          image_Source: "asset/img/incubators/Lv5.png",
          imageSource: "asset/img/incubators/Lv.5.png",
          imageUrl: ['asset/img/incubators/Lv5Telur.png'],
          priceInDiamond: 50,
          durationInMinute: 15,
          durationText: '15 Minutes',
          durationDetails: '00:15:00',
          characterPosibility: 'Rare - Legend'

        }
    ];

    Incubators.getById = function (id) {
      var data = new izyObject('IncubatorBalance').getAll();
      for (var index in data) {
        var incubator = data[index];
        if (incubator.id == id) {
          return incubator;
        }
      }
      return false;
    };
    Incubators.purchaseIncubator = function (incubatorId, callbackFunction) {
      //var incubator = this.getById(incubatorId);
      //var playerInfo = izyObject('PlayerInfo').getOne();
      //var incubatorTrans = {};
      //var diamondTrans = {};

      //incubatorTrans.transOn = Date.parse($rootScope.serverDate);
      //incubatorTrans.transNo = md5(incubatorTrans.transOn);
      //incubatorTrans.transType = 'buy';
      //incubatorTrans.incubatorId = incubator.id;
      //incubatorTrans.priceInDiamond = incubator.priceInDiamond;
      //incubatorTrans.total = 1;
      //izyObject('IncubatorTrans').store(incubatorTrans);

      //diamondTrans.transOn = Date.parse($rootScope.serverDate);
      //diamondTrans.transType = 'consume';
      //diamondTrans.transTo = 'incubator';
      //diamondTrans.total = incubatorTrans.priceInDiamond;
      //diamondTrans.ref = incubatorTrans.transNo;
      ////izyObject('DiamondTrans').store(diamondTrans);

      //incubator.playerHave += incubatorTrans.total;
      //izyObject('IncubatorBalance').store(incubator);

      //playerInfo.diamondBalance -= diamondTrans.total;
      //izyObject('PlayerInfo').store(playerInfo);

      //$rootScope.playerInfo = playerInfo;



      //-- send data to server
      $ionicLoading.show();
      var url = $w.GameApp.serverURL + '/incubator/purchase';
      $http.post(url, { id: incubatorId }).then(function onSuccess(response) {

        //console.log(response);
        var playerInfo = Object(response.data.PlayerInfo);
        var freeIncubator = Object(response.data.FreeIncubator);
        var incubatorData = response.data.IncubatorBalance;

        //-- reset data in local
        $w.izyObject('PlayerInfo').reset();
        $w.izyObject('IncubatorBalance').reset();

        $w.jQuery.each(incubatorData, function (key, value) {
          var incubatorBalance = Object(value);

          $w.izyObject('IncubatorBalance').store(incubatorBalance);
        });

        $w.izyObject('PlayerInfo').store(playerInfo);

        $rootScope.playerInfo = playerInfo;

      }, function onFailed(response) {
        //-- on error ??


      }).finally(function onFinally() {
        $ionicLoading.hide();

        callbackFunction();

      });


      //-- after success doing all business, fire the callback function
      if (typeof onSuccessCallback == 'function') {
        onSuccessCallback();
      }
    };
    Incubators.getAll = function () {
      var listdata = window.izyObject('IncubatorBalance').getAll();
      for (var i in listdata) {
        if (Number(listdata[i].playerHave) > 0) {
          listdata[i].isAvailable = true;
        } else {
          listdata[i].isAvailable = false;
        }
      }
      return listdata.sort(window.sortById);
    };
    Incubators.___startCountdownFreeIncubator = function () {
      var oneminute = 60 * 1000;
      var oneDay = 1000 * 60 * 60 * 24;
      var playerInfo = izyObject('PlayerInfo').getOne();
      var freeIncubator = {};

      freeIncubator.transOn = Date.parse($rootScope.serverDate);
      freeIncubator.transNo = md5(playerInfo.playerId + freeIncubator.transOn);
      freeIncubator.startOn = freeIncubator.transOn;
      freeIncubator.finishOn = freeIncubator.startOn + oneminute;

      playerInfo.freeIncubator = JSON.stringify(freeIncubator);
      izyObject('PlayerInfo').store(playerInfo);

      return freeIncubator;
    };
    Incubators.openFreeIncubator = function (callbackFunction) {
      var playerInfo = $rootScope.playerInfo;
      var freeIncubator = window.izyObject('FreeIncubator').getOne();

      if (Number(freeIncubator.finishOn) < Date.parse($rootScope.serverdate)) {
        return;
      }

      //-- send data to server
      $ionicLoading.show();
      var url = $w.GameApp.serverURL + '/incubator/open';
      $http.post(url, {}).then(function onSuccess(response) {
        var freeIncubator = Object(response.data.FreeIncubator);
        var incubatorData = response.data.IncubatorBalance;

        $w.izyObject('FreeIncubator').reset();

        $w.jQuery.each(incubatorData, function (key, value) {
          var incubatorBalance = Object(value);

          $w.izyObject('IncubatorBalance').store(incubatorBalance);
        });

        $w.izyObject('FreeIncubator').store(freeIncubator);


      }, function onFailed(response) {

      }).finally(function onFinally() {
        $ionicLoading.hide();

        callbackFunction();

      });


    };
    Incubators.fetchFreeIncubator = function () {
      var playerInfo = $rootScope.playerInfo;
      var freeIncubator = window.izyObject('FreeIncubator').getOne();

      var finishOnNumber = Number(Date.parse(new Date(freeIncubator.finishOn)));
      var countdown = this.getTimeRemaining(finishOnNumber);

      if (finishOnNumber > Number(Date.parse($rootScope.serverDate))) {
        freeIncubator.isShowCountdown = true;
        freeIncubator.countdown = ('0' + countdown.hours).slice(-2) + ':' + ('0' + countdown.minutes).slice(-2) + ':' + ('0' + countdown.seconds).slice(-2);
      } else {
        freeIncubator.isShowCountdown = false;
        freeIncubator.countdown = '00:00:00';
      }

      // $rootScope.freeIncubator = freeIncubator;
      //console.log(freeIncubator);
      return freeIncubator;
    };
    Incubators.___setDummyData = function () {
      window.izyObject('IncubatorBalance').reset();

      for (var index in this.masterData) {
        var incubator = this.masterData[index];
        incubator.playerHave = 0;
        if (incubator.id == 1) {
          //incubator.playerHave = 2;
        }

        izyObject('IncubatorBalance').store(incubator);
      }
    };

    Incubators.getTimeRemaining = function (endtime) {
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
    }
    return Incubators;
  });

 

  APP.factory('Character', function ($rootScope) {
    var Character = {};
    var oneDay = 1000 * 60 * 60 * 24;
    Character.masterData = [{
      id: 1,
      name: 'Char-1',
      speciality: 'none',
      lifetime: 86400000,
      lifetimeText: '1 day',
      image: 'asset/char/1.png'
    }];
  });

})(this);

(function (ng, $w, izyObject) {
  'use strict';


  

  function PlayerInfo($rootScope, Incubators) {
    var PlayerInfo = {};

    PlayerInfo.setDummyData = function () {
      var obj = new izyObject('PlayerInfo').getOne();
      if (true) {
        obj.playerId = 'GM';
        obj.diamondBalance = 100000;
        obj.coinBalance = 100000;
        obj.currentEnvirontment = 4;
        obj.enviPoint = 0;
        obj.totalChars = 0;
        obj.maxPopulation = 10;

        izyObject('PlayerInfo').store(obj);

        //var diamondTrans = {};
        //diamondTrans.transOn = Date.parse($rootScope.serverDate);
        //diamondTrans.transType = 'collect';
        //diamondTrans.transTo = 'self';
        //diamondTrans.transFrom = 'none';
        //diamondTrans.total = 100000;
        //diamondTrans.ref = 'test';
        //izyObject('DiamondTrans').store(diamondTrans);

        //var coinTrans = {};
        //coinTrans.transOn = Date.parse($rootScope.serverDate);
        //coinTrans.transType = 'collect';
        //coinTrans.transTo = 'self';
        //coinTrans.transFrom = 'none';
        //coinTrans.total = 100000;
        //coinTrans.ref = 'test';
        //izyObject('CoinTrans').store(coinTrans);
      }


      $rootScope.playerInfo = obj;
      return obj;
    }

    return PlayerInfo;
  };

 
  ng.module('gamesapp').factory('PlayerInfo', ['$rootScope', 'Incubators', PlayerInfo]);
  

})(angular, this, this.izyObject);