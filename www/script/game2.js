/** invoke first run game - animation */
(function run($w) {
  var serverURL = 'http://hm-api.azurewebsites.net/';
  $w.GameApp = $w.GameApp || {};
  $w.GameApp.serverURL = serverURL;
  $w.GameApp.version = '0.0.4';
  $w.GameApp.uuid = 'hatchmarketdevice';
  $w.GameApp.serverDate = new Date();

  $ = $w.jQuery;

 
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
  };

  function run(cb) {
    var pbW = $('#bar1').width();
    var callback = cb;

    function verifiedVersion() {
      if ($w.cordova) {
        $w.GameApp.uuid = device.uuid;
        cordova.getAppVersion.getVersionNumber(function (version) {
          $w.GameApp.version = version;
          checkServer();
        });
      } else {
        checkServer();
      }
    };
    function checkServer() {
      $.ajax({
        url: serverURL,
        success: responCheckServer,
        dataType: 'json',
        data: {
          uuid: $w.GameApp.uuid,
        },
        error: function () {
          alert('Unable connect to server !');
          $w.open('index.html', '_self');
        }
      });
    };
    function responCheckServer(response) {
      if (response) {
        var _response = response;
        $w.GameApp.serverDate = new Date(_response.serverdate);

        /** validate version **/
        if ($w.GameApp.version !== _response.version) {
          alert('Update available, please install the new version.');
          $w.open(_response.updateurl, '_system');
          return;
        }

        /** validate server status **/
        if (_response.serverstatus !== 'active') {
          alert(_response.servermsg);
          $w.open('index.html', '_self');
          return;
        }
      }


      $w.GameApp.Sounds.bgm1().play();
      callback();
      $('#bar2').animate({ 'width': (pbW * 20 / 100) + 'px' }, 500, 'swing', function () {
        //-- loadIslandImage will be called twice to make sure the image map can be click
        $w.GameApp.IslandServices.loadIslandImage();
        $w.GameApp.InitializeData(onAfterDataLoaded);

        if ($w.device) {
          //$w.GameApp.IAP.loadProducts();
        }
      });
    };
    function showMainLayout() {
      normalizeEventListener();
      $('#bar2').animate({ 'width': (pbW * 100 / 100) + 'px' }, 500, 'swing', function () {
        $w.setTimeout(function () {
          $('#startup-loader').slideUp();
        }, 750);
      });

      $w.dispatchEvent(new CustomEvent('gameappready', { bubble: true, cancelable: true }));
    };
    function onAfterDataLoaded() {
      $('#bar2').animate({ 'width': (pbW * 50 / 100) + 'px' }, 1000, 'swing', function () {
        $w.GameApp.IslandServices.PlayerIsland = $w.GameApp.JsonData.island;
        $w.GameApp.IslandServices.loadIslandImage();

        $w.GameApp.Animations.stop();
        $w.GameApp.Animations.reload(showMainLayout);
      });


      //-- play
    };
 
 
    //verifiedVersion();
    responCheckServer(false);
  };

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
  };


  $w.izyObject('PlayerChars').reset();
  $w.izyObject('IncubatorTrans').reset();


  $w.GameApp.serverDate = new Date();
  $w.GameApp.getTimeRemaining = getTimeRemaining;
  $w.GameApp.Run = run;
})(this);

/** InitializeData */
(function InitializeData($w) {
  var assets = [
    { name: "Incubator_1", url: 'animation/incubator1/skeleton.json' },
    { name: "Incubator_2", url: 'animation/incubator2/skeleton.json' },
    { name: "Incubator_3", url: 'animation/incubator3/skeleton.json' },
    { name: "Incubator_4", url: 'animation/incubator4/skeleton.json' },
    { name: "Incubator_5", url: 'animation/incubator5/skeleton.json' },
    { name: "cloudSkeleton", url: 'animation/clouds/skeleton.json' },
    { name: "waveSkeleton", url: 'animation/waves/skeleton.json' },

    { name: "fountainAtea", url: 'animation/atea/fountain/skeleton.json' },
    { name: "goldAtea", url: 'animation/atea/gold/skeleton.json' },

    { name: "enableHolder", url: 'asset/img/island/bulat-01.png' },
    { name: "disableHolder", url: 'asset/img/island/bulat-02.png' },

    { name: "atea", url: 'animation/atea/skeleton.json' },
    { name: "routh", url: 'animation/routh/skeleton.json' },
    { name: "oidur", url: 'animation/oidur/skeleton.json' },
    { name: "frusht", url: 'animation/frusht/skeleton.json' },

    { name: "blurbg", url: 'asset/img/island/bg-blur.jpg' },

    { name: "goldEgg", url: 'asset/img/gold-egg.jpg' },
    { name: "silverEgg", url: 'asset/img/silver-egg.png' },

    { name: "swipeDownAnim", url: 'animation/SwipeDown.gif' },
    { name: "locked", url: 'asset/img/island/Locked.png' }
  ];
  var jsonAssets = [
    { name: "json_island", url: 'data/island.json' },
    { name: "json_decoration", url: 'data/decoration.json' },
    { name: "json_equipment", url: 'data/equipment.json' },
    { name: "json_char", url: 'data/char.json' },
    { name: "json_redeem", url: 'data/redeemmaster.json' }
  ];

  function initializeData(cbFn) {
    var jsonData = $w.GameApp.JsonData;

    function onJsonLoaded(loader, res) {
      jsonData.decoration = (res.json_decoration.data).sort($w.sortById);
      jsonData.equipment = (res.json_equipment.data).sort($w.sortById);
      jsonData.island = (res.json_island.data).sort($w.sortById);
      jsonData.characters = (res.json_char.data).sort($w.sortById);
      jsonData.redeem = res.json_redeem.data;

      for (var i = 0; i < jsonData.decoration.length; i++) {
        var item = jsonData.decoration[i]; 
        assets.push({ name: 'decorItem-' + item.id, url: item.imageUrl[1] });

        if (Number(item.id) === 9) {
          assets.push({ name: 'decorItem-' + item.id + '-2', url: item.imageUrl[2] });
        }
      }

      for (var i = 0; i < jsonData.characters.length; i++) {
        var char = jsonData.characters[i];
        assets.push({
          name: 'char_' + char.id,
          url: 'animation/characters/' + (String(char.name).toLowerCase()) + '/skeleton.json'
        });
      }

      $w.GameApp.JsonData = jsonData;
      $w.PIXI.loader.add(assets).load(onPixiAssetLoaded);

      $w.dispatchEvent(new CustomEvent('gamedataready', { bubble: true, cancelable: true }));
    };

    function onPixiAssetLoaded(loader, res) {
      if (typeof (cbFn) === 'function') {
        cbFn();
      }


    };

    $w.PIXI.loader.add(jsonAssets).load(onJsonLoaded);
  };

  $w.GameApp.InitializeData = initializeData;
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

/** IslandServices - Island Game Services */
(function IslandServices($w) {
  var gm = $w.GameApp;
  var $ = $w.jQuery;

  function loadIslandImage() {
    var image = $w.document.getElementById('imgIsland');
    var downloadingImage = new Image();
    var _playerInfo = $w.izyObject('PlayerInfo').getOne();

    loadEPImage();
    downloadingImage.onload = function () {
      image.src = this.src;
      $('map').imageMapResize();
    };
    downloadingImage.src = "asset/img/island/mode_" + _playerInfo.currentEnvirontment + ".png";
  };

  function loadEPImage() {
    var _playerInfo = $w.izyObject('PlayerInfo').getOne();
    $('#epInfo').css({ width: ((window.innerWidth / 2) - 10) + 'px' });
    $('#epImage').attr('src', 'asset/img/island/EP/ep_' + _playerInfo.enviPoint + '.png');
  };

  function _IslandServices() {
    var _this = {};
    _this.PlayerIsland = {};
    _this.increaseEnviPoint = function () {
      var playerInfo = $w.izyObject('PlayerInfo').getOne(),
        pts = 50;
      //_activeEnvi = activeEnvi;
      playerInfo.enviPoint = Number(playerInfo.enviPoint) + pts;
      $w.izyObject('PlayerInfo').store(playerInfo);

      loadEPImage();

      return playerInfo;
    };
    _this.saveDecorationInEnvirontment = function (islandName, decorationItems, cbfn) {
      var _this = [];
      var _playerIsland = (function () {
        return gm.IslandServices.PlayerIsland;
      })();
      for (var i = 0; i < _playerIsland.length; i++) {
        if (_playerIsland[i].name === islandName) {
          _playerIsland[i].decorationItems = decorationItems;
          _this = decorationItems;
          break;
        }
      }
      if (cbfn == 'function') {
        cbfn();
      }

      return _this;
    };
    _this.fetchDecorationItems = function (islandName) {
      var _this = [];
      var _playerIsland = this.PlayerIsland;
      for (var i = 0; i < _playerIsland.length; i++) {
        if (_playerIsland[i].name === islandName) {
          _this = (_playerIsland[i].decorationItems) ? _playerIsland[i].decorationItems : _this;
          break;
        }
      }
      return _this;
    };
    _this.getIsland = function (islandId) {
      var islandData = $w.GameApp.JsonData.island;
      var island = {};
      for (var i = 0; i < islandData.length; i++) {
        if (islandData[i].id == islandId) {
          return island = islandData[i];
        }
      }
      return island;
    };
    _this.getWelcomeTemplateIsland = function (activeEnvi) {
      var playerInfo = $w.izyObject('PlayerInfo').getOne(),
        top = '',
        middle = '',
        bottom = '',
        nextIsland = this.getIsland(Number(activeEnvi.id) + 1),
        prevIsland = this.getIsland(Number(activeEnvi.id) - 1);
      if (nextIsland.name) {
        top = '<div >Swipe Down to ' + nextIsland.name + '</div> <img src="animation/SwipeDown.gif" style="width:20vw;height:auto;">';
      }
      if (prevIsland.name) {
        bottom = '<img src="animation/SwipeUp.gif" style="width:20vw;height:auto;"><div>Swipe Up to ' + prevIsland.name + '</div>';
      }

      if (Number(playerInfo.currentEnvirontment) < Number(activeEnvi.id)) {
        middle = '<div style="font-size:20px;margin:50% 0;opacity:0;">Welcome to  ' + activeEnvi.name + ' &nbsp;</div>';
      } else {
        middle = '<div style="font-size:20px;margin:50% 0;">Welcome to ' + activeEnvi.name + '</div>';
      }


      return ('<div style="height:20vh;position:relative;display:block;"><div style="position:absolute;bottom:0;display:block;width:100%;">' + top + '</div></div>' + middle + '<div style="height:20vh;">' + bottom + '</div>');
    };
    _this.loadIslandImage = loadIslandImage;
    _this.getEquipItem = function (id) {
      var data = $w.GameApp.JsonData.equipment;
      for (var i in data) {
        if (data[i].id == id) {
          return data[i];
        }
      }
    };
    _this.getDecorItem = function (id) {
      var data = $w.GameApp.JsonData.decoration;
      for (var i in data) {
        if (data[i].id == id) {
          return data[i];
        }
      }
    };


    return _this;
  };

  $w.GameApp.IslandServices = _IslandServices();
})(this);

/** CharServices **/
(function CharServices(a) {
  /** 
    ######## Dont forget to put parent code of hatched char
  **/
  var cs = {};
  var is = {};
  var masterdata = [],
    _listdata = [];

  function randomize(array) {
    var currentIndex = array.length,
      temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  function createRandomCode() {
    var a = md5(new Date().getTime());
    return a.substr(0, 8).toUpperCase();
  };

  function getFromMiniAndStone() {
    /** 
      posibility : all common; destroyer + explorer {
        6 = 1 x 6;
        90 = 15 x 6;
      }
    **/
    var shuffledata = []; //-- total must be 96 data
    var qDestroyer = 15;
    var qExplorer = 1;

    var commonChars = cs.getCharByGrade('D');

    //-- classify common chars
    var commonChars_destroyer = [];
    var commonChars_explorer = [];
    for (var i = 0; i < commonChars.length; i++) {
      if (String(commonChars[i].stats.job).toLowerCase() === 'destroyer') {
        commonChars_destroyer.push(commonChars[i]);
      }
      if (String(commonChars[i].stats.job).toLowerCase() === 'explorer') {
        commonChars_explorer.push(commonChars[i]);
      }
    };


    //-- inject orodocus 
    var oroducus = cs.searchCharByProperty('name', 'ORODOCUS')[0];
    for (var i = 0; i < 4; i++) {
      shuffledata.push(oroducus);
    }

    //-- put common - destroyer char to shuffle data
    for (var i = 0; i < commonChars_destroyer.length; i++) {
      for (var j = 0; j < qDestroyer; j++) {
        shuffledata.push(commonChars_destroyer[i]);
      }
    };

    //-- put common - explorer char to shuffle data
    for (var i = 0; i < commonChars_explorer.length; i++) {
      for (var j = 0; j < qExplorer; j++) {
        shuffledata.push(commonChars_explorer[i]);
      }
    };

    //-- shuffling
    shuffledata = randomize(shuffledata);

    //-- pick one
    var randomNumber = Math.floor(Math.random() * shuffledata.length);
    var char = shuffledata[randomNumber];

    return char;
  };

  function getEnvirontment(id) {
    var data = a.GameApp.IslandServices.PlayerIsland;
    var output = {};
    for (var idx = 0; idx < data.length; idx++) {
      if (data[idx].id == id) {
        output = data[idx];
        break;
      }
    }
    return output;
  }

  function createNickname(charname) {
    var nickname = charname;
    var highest = 0;
    var _playerChars = a.GameApp.CharServices.addPlayerChars();
    for (var i = 0; i < _playerChars.length; i++) {
      if (_playerChars[i].id > highest) {
        highest = _playerChars[i].id;
      }
    }
    nickname = nickname + (highest + 1);
    if (nickname.length < 10) {
      nickname = nickname.substr(0, 10);
    }

    return nickname.toUpperCase().trim();
  };

  is.incubator5 = function () {
    /** 
      possibility : epic(98 %) - legend (2%)
    **/
    var qLegend = 2;
    var qEpic = 98;

    var legendChars = cs.getCharByGrade('A');
    var epicChars = cs.getCharByGrade('B');

    var shuffledata = []; //-- total must be 100 data

    //-- put char to shuffle data
    for (var i = 0; i < epicChars.length; i++) {
      var limitOfThisChar = Math.ceil(qEpic / epicChars.length);
      for (var j = 0; j < limitOfThisChar; j++) {
        shuffledata.push(epicChars[i]);
      }
    };
    for (var i = 0; i < legendChars.length; i++) {
      var limitOfThisChar = Math.ceil(qLegend / legendChars.length);
      for (var j = 0; j < limitOfThisChar; j++) {
        shuffledata.push(legendChars[i]);
      }
    };

    //-- shuffling ..
    for (var i = 0; i < 100; i++) {
      shuffledata = randomize(shuffledata);
    }

    var randomNumber = Math.floor(Math.random() * shuffledata.length);
    var char = shuffledata[randomNumber];

    char.code = createRandomCode();
    char.hatched = Date.parse(a.GameApp.serverDate);
    char.hatchby = 5;
    char.parent = 'psmi2016';

    return char;
  };
  is.incubator4 = function () {
    /** 
      epic 10 %
      rare 90 %
    **/
    var qEpic = 10;
    var qRare = 90;

    var rareChars = cs.getCharByGrade('C');
    var epicChars = cs.getCharByGrade('B');

    var shuffledata = []; //-- total must be 100 data

    //-- put char to shuffle data
    for (var i = 0; i < epicChars.length; i++) {
      var limitOfThisChar = Math.ceil(qEpic / epicChars.length);
      for (var j = 0; j < limitOfThisChar; j++) {
        shuffledata.push(epicChars[i]);
      }
    };
    for (var i = 0; i < rareChars.length; i++) {
      var limitOfThisChar = Math.ceil(qRare / rareChars.length);
      for (var j = 0; j < limitOfThisChar; j++) {
        shuffledata.push(rareChars[i]);
      }
    };

    //-- shuffling ..
    for (var i = 0; i < 100; i++) {
      shuffledata = randomize(shuffledata);
    }

    var randomNumber = Math.floor(Math.random() * shuffledata.length);
    var char = shuffledata[randomNumber];

    char.code = createRandomCode();
    char.hatched = Date.parse(a.GameApp.serverDate);
    char.hatchby = 4;
    char.parent = 'psmi2016';

    return char;
  };
  is.incubator3 = function () {
    /** 
     posibility : rare 10 % ; common 90 %
      rare { 10 = 2 x 5 } 
     common {
       90 = explorer + destroyer
       90 = (1 x 6) + (12 x 6)
     }
   **/
    var qCommon = 90;
    var qRare = 10;

    var rareChars = cs.getCharByGrade('C');
    var commonChars = cs.getCharByGrade('D');

    var shuffledata = []; //-- total must be 100 data

    //-- classify common chars
    var commonChars_destroyer = [];
    var commonChars_explorer = [];
    for (var i = 0; i < commonChars.length; i++) {
      if (String(commonChars[i].stats.job).toLowerCase() === 'destroyer') {
        commonChars_destroyer.push(commonChars[i]);
      }
      if (String(commonChars[i].stats.job).toLowerCase() === 'explorer') {
        commonChars_explorer.push(commonChars[i]);
      }
    };

    //-- put common - destroyer @14 to shuffle data
    var limitOfThisChar = 14;
    for (var i = 0; i < commonChars_destroyer.length; i++) {
      for (var j = 0; j < limitOfThisChar; j++) {
        shuffledata.push(commonChars_destroyer[i]);
      }
    };


    //-- for common explorer @1 to shuffle data
    var limitOfThisChar = 1;
    for (var i = 0; i < commonChars_explorer.length; i++) {
      for (var j = 0; j < limitOfThisChar; j++) {
        shuffledata.push(commonChars_explorer[i]);
      }
    };


    //-- put rare to shuffle data; for rare 10%
    var limitOfThisChar = Math.ceil(qRare / rareChars.length);
    for (var i = 0; i < rareChars.length; i++) {
      for (var j = 0; j < limitOfThisChar; j++) {
        shuffledata.push(rareChars[i]);
      }
    };


    //-- shuffling ..
    for (var i = 0; i < 100; i++) {
      shuffledata = randomize(shuffledata);
    }

    var randomNumber = Math.floor(Math.random() * shuffledata.length);

    var char = shuffledata[randomNumber];
    char.code = createRandomCode();
    char.hatched = Date.parse(a.GameApp.serverDate);
    char.hatchby = 3;
    char.parent = 'psmi2016';

    return char;
  };
  is.incubator2 = function () {
    var char = getFromMiniAndStone();
    char.code = createRandomCode();
    char.hatched = Date.parse(a.GameApp.serverDate);
    char.hatchby = 2;
    char.parent = 'psmi2016';

    return char;
  };
  is.incubator1 = function () {
    var char = getFromMiniAndStone();

    //-- 2016-09-17
    char.code =  String('00' + createRandomCode()).substr(0,8);
    char.hatched = Date.parse(a.GameApp.serverDate);
    char.hatchby = 1;
    char.parent = 'psmi2016';

    return char;
  };

  cs.PlayerChars = [];
  cs.getAllData = function () {
    masterdata = a.clone( a.GameApp.JsonData.characters);
    return masterdata;
  };
  cs.getCharByGrade = function (grade) {
    masterdata = this.getAllData();
    _listdata = [];
    for (var idx = 0; idx < masterdata.length; idx++) {
      var a = String(masterdata[idx].stats.grade).toLowerCase();
      var b = String(grade).toLowerCase();
      if (a === b) {
        _listdata.push(masterdata[idx]);
      }
    };
    return _listdata;
  };
  cs.searchCharByProperty = function (param, value) {
    masterdata = this.getAllData();
    var _param = String(param).toLowerCase();
    _listdata = [];
    for (var idx = 0; idx < masterdata.length; idx++) {
      var a = String(masterdata[idx][_param]).toLowerCase();
      var b = String(value).toLowerCase();
      if (a === b) {
        _listdata.push(masterdata[idx]);
      }
    };
    return _listdata;
  };
  cs.searchCharByStats = function (param, value) {
    masterdata = this.getAllData();
    var _param = String(param).toLowerCase();
    _listdata = [];
    for (var idx = 0; idx < masterdata.length; idx++) {
      var a = String(masterdata[idx].stats[_param]).toLowerCase();
      var b = String(value).toLowerCase();
      if (a === b) {
        _listdata.push(masterdata[idx]);
      }
    };
    return _listdata;
  };
  cs.getCharFromIncubator = function (incubatorId, parentCode) {
    var hatchedChar = is['incubator' + incubatorId]();
    var oneDay = 1000 * 60 * 60 * 24;

    if (incubatorId === 1) {
      hatchedChar.shareImg = 'asset/img/icons/no_eggcode.png';
      hatchedChar.isWithCode = 0;
    } else {
      hatchedChar.shareImg = 'asset/img/icons/share_eggcode.png';
      hatchedChar.isWithCode = 1;
    };

    hatchedChar.lifeEnd = Number(hatchedChar.hatched) + (oneDay * Number(hatchedChar.stats.lifespanday));
    hatchedChar.parent = parentCode;

    //-- already have environtmentId property
    hatchedChar = a.GameApp.CharServices.addPlayerChars(hatchedChar);


    return hatchedChar;
  };
  cs.getPlayerChars = function () {
    var data = a.izyObject('PlayerChars').getAll();

    //-- validate char is still alive or not
    this.PlayerChars = data;


    return this.PlayerChars;
  };
  cs.addPlayerChars = function (char) {
    var _char = Object(char);
    var _playerInfo = Object(a.izyObject("PlayerInfo").getOne());

    if (_playerInfo.maxPopulation < this.PlayerChars.length + 1) {
      //throw "Oh god, total population must not bigger than total player chars";
      return false;
    };

    //-- create nickname'
    var nickname = char.name;
    var _pc = a.GameApp.CharServices.PlayerChars;
    var highest = 0;
    for (var i = 0; i < _pc.length; i++) {
      if (_pc[i].id > highest) {
        highest = _pc[i].id;
      }
    };
    nickname = nickname + (highest + 1);
    if (nickname.length > 10) {
      nickname = nickname.substr(0, 10);
    }
    _char.nickname = nickname.toUpperCase();
    _char.charId = char.id;
    delete _char.id;

    /** -- choose where char will be put in island **/
    //-- get latest island, if full change to previous island
    var limitCharsEachEnvi = 10;
    var currentEnvi = _playerInfo.currentEnvirontment;
    var _thisEnvi = {};
    var _charsInEnvi = [];
    for (var id = parseInt(currentEnvi) ; id > 0; id--) {
      _thisEnvi = getEnvirontment(id);
      _charsInEnvi = _thisEnvi.chars;

      //-- if this environtment is available, put char to this
      if (_charsInEnvi.length < limitCharsEachEnvi) {
        _char.environtmentId = id;
        break;
      };
    }
    /** -- **/


    //-- put char in global variable to access, after have environtmentId property  
    _playerInfo.totalChars += 1;
    a.izyObject('PlayerInfo').store(_playerInfo);
    a.izyObject('PlayerChars').store(_char);


    return _char;
  };
  cs.updatePlayerCharNickname = function (char, newNickname) {
    var _char = Object(char);
    var _newNickname = String(newNickname).toUpperCase();
    var _playerChars = this.PlayerChars;

    //-- update in global player char
    for (var idx = 0; idx < _playerChars.length; idx++) {
      var thisChar = {};
      if (_playerChars[idx].id == _char.id && _playerChars[idx].code == _char.code) {
        thisChar = _playerChars[idx];
        thisChar.nickname = _newNickname;
        break;
      }
    };

    //-- update in environtment char
    var envi = getEnvirontment(_char.environtmentId);
    for (var idx = 0; idx < envi.chars.length; idx++) {
      if (envi.chars[idx].id == _char.id && envi.chars[idx].code == _char.code) {
        envi.chars[idx].nickname = _newNickname;
        break;
      }
    };


    _char.nickname = newNickname;
    return _char;
  };
  cs.getPlayerCharById = function (charId) {
    var _char = {};
    var data = this.getPlayerChars();
    for (var i = 0; i < data.length; i++) {
      if (data[i].id == charId) {
        _char = data[i];
        break;
      }
    }
    return _char;
  };
  cs.getEnviPlayerChar = function (enviID) {
    var envi = getEnvirontment(enviID);
    var data = a.izyObject('PlayerChars').getAll();
    var _list = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].environtmentId == enviID) {
        _list.push(data[i]);
      }
    }
    envi.chars = _list;

    return envi.chars;
  };

  a.GameApp.CharServices = cs;
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
  };
  var sfx = initializeSounds();
  //sfx.bgm1().play();
  //console.log('playing sound');
  $w.GameApp.Sounds = sfx;
})(this);

/** JsonData */
(function JsonData($w) {
  var jsonData = {
    decoration: [],
    equipment: [],
    island: [],
    characters: [],
    redeem:[]
  };
  $w.GameApp.JsonData = jsonData;
})(window);

/** GameApp - Animations */
(function Animations($w) {
  "use strict";
  var $ = $w.jQuery;
  var rendererList = [];
  var anim = {
    res: $w.PIXI.loader.resources,
    run: function (callback) {
      var that = this;
      if (callback == 'function') {
        callback();
      }

    },
    incubator: function () {

      this.createIncubator(1);
      this.createIncubator(2);
      this.createIncubator(3);
      this.createIncubator(4);
      this.createIncubator(5);

    },
    cloud: function () {
      var _this = this;
      $.each($('.islandAnimation'), function () {
        _this.createCloud({
          cloudHolder: $(this).attr('id'),
          perc: 1,
          posX: 0,
          posY: 0,
          timeScale: 1
        });
      });
    },
    wave: function () {
      var _this = this;
      $.each($('.islandWave'), function (key, value) {
        _this.createWave(value.id);
      });
    },
    createIncubator: function (id) {
      //-- inject this to increase preformance, if player have incubator, dont render animation
      //console.log($('#incubator-lv-' + id + '-wrapper').attr('is-available'));
      if ($('#incubator-lv-' + id + '-wrapper').hasClass('true')) {
        var img = '<img class="fill" src="animation/incubators/assets/Lv.' + id + '.png" />';
        $('#incubator-lv-' + id + '-wrapper').html(img);
        //console.log('not create incuator ' + id);
        return;
      };

      var rendererOptions = {
        antialiasing: false,
        transparent: true,
        resolution: window.devicePixelRatio,
        autoResize: true,
      }


      var incubatorTagHolder = $('#incubator-lv-' + id + '-wrapper');
      var gameWidth = $(incubatorTagHolder).width();
      var gameHeight = $(incubatorTagHolder).height();

      var renderer = new PIXI.autoDetectRenderer(gameWidth, gameHeight, rendererOptions);
      $(incubatorTagHolder).html(renderer.view);
      renderer.plugins.interaction.destroy();
      rendererList.push(renderer);

      // create the root of the scene graph
      var stage = new PIXI.Container();
      //console.log(this.res['Incubator_1']);

      // instantiate the spine animation
      var spineData = this.res['Incubator_' + id].spineData;
      var incubator1 = new PIXI.spine.Spine(spineData);
      incubator1.skeleton.setToSetupPose();
      incubator1.update(0);
      incubator1.autoUpdate = true;

      // create a container for the spine animation and add the animation to it
      var incubatorWrapper = new PIXI.Container();
      incubatorWrapper.addChild(incubator1);

      // measure the spine animation and position it inside its container to align it to the origin
      var localRect = incubator1.getLocalBounds();
      incubator1.position.set(-localRect.x, -localRect.y);

      // now we can scale, position and rotate the container as any other display object
      //var scale = Math.min((renderer.width * 0.7) / incubatorWrapper.width, (renderer.height * 0.7) / incubatorWrapper.height);
      var scale = Math.min((renderer.width) / incubatorWrapper.width, (renderer.height) / incubatorWrapper.height);
      scale = scale / window.devicePixelRatio;
      incubatorWrapper.scale.set(scale, scale);
      //incubatorWrapper.position.set((renderer.width - incubatorWrapper.width) * 0.5, (renderer.height - incubatorWrapper.height) * 0.5);

      // add the container to the stage
      stage.addChild(incubatorWrapper);

      // once position and scaled, set the animation to play
      incubator1.state.setAnimationByName(0, 'animation', true);
      incubator1.state.timeScale = 0.5;
      //incubator1.state.timeScale = Math.random();

      animate();
      renderer.plugins.interaction.destroy();

      function animate() {
        if ($w.GameApp.Animations.isStop) {
          return;
        }
        requestAnimationFrame(animate);


        // update the spine animation, only needed if dragon.autoupdate is set to false
        //incubator1.update(0.01666666666667); // HARDCODED FRAMERATE!
        renderer.render(stage);
      }

      //var intervalId = window.setInterval(function () {
      //    renderer.render(stage);
      //}, 1000 / 60);
      // MyAnimations.rendererList.push(renderer);
      //MyAnimations.stageList.push(stage);
    },
    createCloud: function (cloudParams) {
      var rendererOptions = {
        antialiasing: false,
        transparent: true,
        resolution: window.devicePixelRatio,
        autoResize: true,
      }

      var cloudHolder = $w.document.getElementById(cloudParams.cloudHolder);
      var gameWidth = $(cloudHolder).width();
      var gameHeight = $(cloudHolder).height();

      //var parent = document.getElementById('islandView');
      //var topPercent = parent.offsetHeight * 10 / 100;
      //console.log(cloudHolder.offsetTop, topPercent);

      var renderer = new PIXI.autoDetectRenderer(gameWidth, gameHeight, rendererOptions, true);
      cloudHolder.appendChild(renderer.view);
      renderer.plugins.interaction.destroy();
      rendererList.push(renderer);


      // create the root of the scene graph
      var stage = new PIXI.Container();

      // instantiate the spine animation
      var spineData = this.res.cloudSkeleton.spineData;
      //var spineData = this.res[cloudParams.cloudHolder].spineData;

      var cloud = new PIXI.spine.Spine(spineData);

      cloud.skeleton.setToSetupPose();
      cloud.update(0);
      cloud.autoUpdate = true;

      // once position and scaled, set the animation to play
      cloud.state.setAnimationByName(0, cloudHolder.getAttribute('cloudtype'), true);
      cloud.state.timeScale = 2;

      // measure the spine animation and position it inside its container to align it to the origin
      var localRect = cloud.getLocalBounds();
      cloud.position.y = -localRect.y + cloudParams.posY;
      cloud.position.x = -localRect.x + cloudParams.posX;

      // create a container for the spine animation and add the animation to it
      var cloudContainer = new PIXI.Container();
      cloudContainer.addChild(cloud);

      // now we can scale, position and rotate the container as any other display object
      //var scale = Math.min((renderer.width * 0.7) / incubatorWrapper.width, (renderer.height * 0.7) / incubatorWrapper.height);
      var scale = Math.min((renderer.width) / cloudContainer.width, (renderer.height) / cloudContainer.height);
      scale = scale / window.devicePixelRatio;
      cloudContainer.scale.set(scale, scale);

      // add the container to the stage
      stage.addChild(cloudContainer);

      animate();
      renderer.plugins.interaction.destroy();

      function animate() {
        if ($w.GameApp.Animations.isStop) {
          return;
        }
        //requestAnimationFrame(animate);
        renderer.render(stage);
      }

      //var intervalId = window.setInterval(function () {
      //    renderer.render(stage);
      //}, 1000 / 60);
      //console.log(intervalId);
    },
    createWave: function (waveId) {
      var rendererOptions = {
        antialiasing: false,
        transparent: true,
        resolution: window.devicePixelRatio,
        autoResize: true,
      }

      var waveHolder = document.getElementById(waveId);
      var gameWidth = $(waveHolder).width();
      var gameHeight = $(waveHolder).height();

      var renderer = new PIXI.autoDetectRenderer(gameWidth, gameHeight, rendererOptions, true);
      waveHolder.appendChild(renderer.view);
      renderer.plugins.interaction.destroy();
      rendererList.push(renderer);


      // create the root of the scene graph
      var stage = new PIXI.Container();

      // instantiate the spine animation
      var spineData = this.res.waveSkeleton.spineData;
      var wave = new PIXI.spine.Spine(spineData);

      wave.skeleton.setToSetupPose();
      wave.update(0);
      wave.autoUpdate = true;

      // once position and scaled, set the animation to play
      wave.state.setAnimationByName(0, 'animation', true);
      wave.state.timeScale = 2;

      // measure the spine animation and position it inside its container to align it to the origin
      var localRect = wave.getLocalBounds();
      wave.position.y = -localRect.y;
      wave.position.x = -localRect.x;

      // create a container for the spine animation and add the animation to it
      var waveContainer = new PIXI.Container();
      waveContainer.addChild(wave);

      // now we can scale, position and rotate the container as any other display object
      //var scale = Math.min((renderer.width * 0.7) / incubatorWrapper.width, (renderer.height * 0.7) / incubatorWrapper.height);
      var scale = Math.min((renderer.width) / waveContainer.width, (renderer.height) / waveContainer.height);
      scale = scale / window.devicePixelRatio;
      waveContainer.scale.set(scale, scale);

      // add the container to the stage
      stage.addChild(waveContainer);
      renderer.plugins.interaction.destroy();
      animate();

      function animate() {
        if ($w.GameApp.Animations.isStop) {
          return;
        }
        //requestAnimationFrame(animate);
        renderer.render(stage);
      }
      //var intervalId = window.setInterval(function () {
      //    renderer.render(stage);
      //}, 1000 / 60);
      //console.log(intervalId);
    }
  };

  function clearRenderer() {
    for (var idx = 0; idx < rendererList.length; idx++) {
      var rn = rendererList[idx];
      rn.destroy();
      rendererList.splice(idx, 1);
      rn = null;
    }

  }

  anim.isStop = false;
  anim.stop = function () {
    this.isStop = true;
    clearRenderer();
    (function clearCloud() {
      $.each($('.islandAnimation canvas'), function (key, value) {
        $(value).remove();
      });
    })();
    (function clearWave() {
      $.each($('.islandWave canvas'), function (key, value) {
        $(value).remove();
      });
    })();
    (function clearWave() {
      $.each($('.incubators canvas'), function (key, value) {
        $(value).remove();
      });
    })();


  };
  anim.reload = function (callbackFunction) {
    this.res = $w.PIXI.loader.resources;
    this.isStop = false;

    this.wave();
    this.cloud();
    this.incubator();

    callbackFunction();
  };

  $w.GameApp.Animations = anim;
})(this);

/** GameApp - GameStage */
(function GameStage($w) {
  'use strict';

  var _renderer,
    _containerStage,
    _decorContainer = new PIXI.Container(),
    _holderContainer;
  var decorChildContainer, holderChildContainer;
  var _decorMapLocations = [];
  var _resources = $w.PIXI.loader.resources;
  var _selectedDecorItem = {};
  var gs = {};
  var world = {};
  var _AppService;
  var _activeWorld;
  var _backgroundContainer;

  var _charContainer = new PIXI.Container();
  var _pathCharInEnvi = [];
  var _oneblock = { w: 120, h: 128 };

  function createFountain(container) {
    var resources = $w.PIXI.loader.resources;
    var fountain = new PIXI.spine.Spine(resources.fountainAtea.spineData);
    fountain.skeleton.setToSetupPose();
    fountain.update(0);
    fountain.autoUpdate = true;
    fountain.state.setAnimationByName(0, 'Fountain', true);
    fountain.state.timeScale = 1;


    // create a container for the spine animation and add the animation to it
    var fountainCont = new PIXI.Container();
    fountainCont.addChild(fountain);
    fountainCont.position.set(230, 450);

    container.addChild(fountainCont);
  };

  function createGold(container) {
    var gold = new PIXI.spine.Spine(_resources.goldAtea.spineData);
    gold.skeleton.setToSetupPose();
    //gold.update(0);
    // gold.autoUpdate = true;
    gold.state.setAnimationByName(0, 'Bling', true);
    //gold.state.timeScale = 0.5;


    gold.position.set(900, 700);

    //var goldContainer = new PIXI.Container();
    //goldContainer.addChild(gold);
    //goldContainer.position.set(700, 700);



    container.addChild(gold);
  };

  function createCloud(container) {
    var cloud = new PIXI.spine.Spine(_resources.cloudSkeleton.spineData);
    cloud.skeleton.setToSetupPose();
    cloud.update(0);
    cloud.autoUpdate = true;
    cloud.state.setAnimationByName(0, 'Awan_1', true);
    cloud.state.timeScale = 1;

    var cloudContainer = new PIXI.Container();
    cloudContainer.addChild(cloud);
    cloudContainer.position.set(400, 100);


    container.addChild(cloudContainer);
  };

  function isDecorPathLocationAvailable(path) {
    var totalAvailableSlot = _AppService.inventorySlot.getTotalAvailableSlot(),
      totalItemInSlot = _AppService.inventorySlot.getTotalItemInSlot();

    if (!_activeWorld.decorationItems) return true;

    var isPathContainsItem = false;
    for (var idx in _activeWorld.decorationItems) {
      var decorationItem = _activeWorld.decorationItems[idx];
      if (decorationItem.path.id === path.id) {
        isPathContainsItem = true;
        break;
      }
    }

    if (totalAvailableSlot === totalItemInSlot && isPathContainsItem) {
      return false;
    }

    return true;
  };

  function onSelectedPathDecorLocation(holder, path) {
    //-- swap item from island to inventory slot if player choose path that contains decor item
    var isPathContainsItem = false;
    for (var idx in _activeWorld.decorationItems) {
      var decorationItem = _activeWorld.decorationItems[idx];
      if (decorationItem.path.id === path.id) {
        isPathContainsItem = true;
        //-- add this decor to inventory slot 
        _AppService.inventorySlot.addItem(decorationItem.decorItem.id);

        //-- remove this decor in this array
        _activeWorld.decorationItems.splice(idx, 1);

        break;
      }
    }

    //-- make sure _activeWorld.decorationItems is array
    if (!_activeWorld.decorationItems) {
      _activeWorld.decorationItems = [];
    }

    //-- increaseEnviPoint
    if (!isPathContainsItem) {
      //IslandServices.increaseEnviPoint();
      $w.GameApp.IslandServices.increaseEnviPoint();
    }

    //-- save decor to server with this path
    var itemDecoration = {
      decorItem: _selectedDecorItem,
      path: path,
      holder: { x: holder.x, y: holder.y, height: holder.height, width: holder.width }
    }
    _activeWorld.decorationItems.push(itemDecoration);

    //IslandServices.saveDecorationInEnvirontment('Atea', Environtments.Atea.decorationItems);
    $w.GameApp.IslandServices.saveDecorationInEnvirontment(_activeWorld.name, _activeWorld.decorationItems);

    showDecorInEnvirontment();

    //-- reset holder container 
    _backgroundContainer.removeChild(_holderContainer);
    _holderContainer = new PIXI.Container();

  };

  function showDecorHolder() {
    var paths = _decorMapLocations;
    holderChildContainer = new $w.PIXI.Container();
    
    paths.forEach(function (path) {
      if (!path.x) return;
      var activeHolder;
      var isAvailable = isDecorPathLocationAvailable(path);

      if (path.area == _selectedDecorItem.area && isAvailable) {
        activeHolder = new PIXI.Sprite(_resources.enableHolder.texture);
        activeHolder.interactive = true;
        activeHolder.on('tap', function () {
          onSelectedPathDecorLocation(this, path);
        });
      } else {
        activeHolder = new PIXI.Sprite(_resources.disableHolder.texture);
      }

      activeHolder.scale.set(_backgroundContainer.scale.x / 1.5, _backgroundContainer.scale.y / 1.5);
      activeHolder.position.set(path.x, path.y);

      _holderContainer.addChild(activeHolder);
    });

    _backgroundContainer.addChild(_holderContainer);
  };

  function showDecorInEnvirontment() {
    _backgroundContainer.removeChild(_decorContainer);
    _decorContainer = new PIXI.Container();

    //Environtments.Atea.decorationItems = IslandServices.fetchDecorationItems('Atea');
    var decorationItems = $w.GameApp.IslandServices.fetchDecorationItems(_activeWorld.name);
    var decorSprite = {};

    for (var i = 0; i < decorationItems.length; i++) {
      var decorItem = decorationItems[i].decorItem;
      var holder = decorationItems[i].holder;
      var path = decorationItems[i].path;

      //-- load decor
      if (Number(_activeWorld.id) === 2 && Number(decorItem.id) === 9) {
        decorSprite = new PIXI.Sprite(_resources['decorItem-' + decorItem.id + '-2'].texture);
      } else {
        decorSprite = new PIXI.Sprite(_resources['decorItem-' + decorItem.id].texture);
      }
      

      var scale = Number(path.scale);
      decorSprite.scale.set(scale, scale);

      //-- to make center point same as holder
      decorSprite.x = holder.x - (decorSprite.width / 2) + (holder.width / 2);

      //-- to make item landing same as holder
      decorSprite.y = holder.y - decorSprite.height + holder.height;
      if (path.area == 'air') {
        //decorSprite.y = holder.y;
        decorSprite.y = holder.y - (decorSprite.height / 2) + (holder.height / 2);
      }


      _decorContainer.addChild(decorSprite);
    };

    _backgroundContainer.addChild(_decorContainer);
    $w.GameApp.IslandEnviAnim.draggingMode.off();
  };

  function createBlur(container) {
    function showDetailInsland() {
      scopeEnvi.island = activeEnvi;
      scopeEnvi.myPopup = myPopup.show({
        title: activeEnvi.name,
        subTitle: activeEnvi.description,
        templateUrl: 'templates/popup-detail-environtment.html',
        scope: scopeEnvi
      });
    };

    var playerInfo = $w.izyObject('PlayerInfo').getOne();

    if (Number(playerInfo.currentEnvirontment) >= Number(_activeWorld.id)) {
      return;
    }
    var sprite = new PIXI.Sprite(_resources.blurbg.texture);
    sprite.alpha = 0.8;
    container.addChild(sprite);

    var locked = new PIXI.Sprite(_resources.locked.texture);
    locked.x = (sprite.width * 50 / 100) - (locked.width / 2);
    locked.y = (sprite.height * 50 / 100) - (locked.height / 1.5);

    locked.interactive = true;

    locked.on('tap', function () {
      $w.GameApp.IslandEnviAnim.openDetailEnvirontment(_activeWorld.id);
    });

    container.addChild(locked);
  };
 
  function showCharInEnvirontment() {
    var array = [], charsInEnvi = [];

    _backgroundContainer.removeChild(_charContainer);
    _charContainer = new PIXI.Container();

    //-- reset counter char
    $w.GameApp.reservedArea = [];

    if ($w.GameApp.isTestingChar) {
      charsInEnvi = $w.GameApp.testingChar;
    } else {
      charsInEnvi = $w.GameApp.CharServices.getEnviPlayerChar(_activeWorld.id);
    }
    
    for (var i = 0; i < charsInEnvi.length; i++) {
      var _charID = charsInEnvi[i].charId;
      var spineData = _resources['char_' + _charID].spineData;

      // instantiate the spine animation
      var spineChar = new PIXI.spine.Spine(spineData);
      spineChar.skeleton.setToSetupPose();
      spineChar.update(Math.random());
      spineChar.autoUpdate = true;

      // create a container for the spine animation and add the animation to it
      var spineCharCage = new PIXI.Container();
      spineCharCage.addChild(spineChar);

      // measure the spine animation and position it inside its container to align it to the origin
      var localRect = spineChar.getLocalBounds();
      spineChar.position.set(-localRect.x, -localRect.y);

      // now we can scale, position and rotate the container as any other display object
      var scale = Math.min(((_renderer.width) * 0.7) / spineCharCage.width, ((_renderer.height) * 0.7) / spineCharCage.height);
      scale = scale / $w.devicePixelRatio;

      /**-- inject scaling **/
      switch (_charID) {
        case 2:
          scale = 0.45;
          break;
        case 3:
          scale = 0.45;
          break;
        case 4:
          scale = 0.4;
          break;
        case 6:
          scale = 0.45;
          break;
        case 8:
          scale = 1;
          break;
        case 10:
          scale = 0.5;
          break;
        case 11:
          scale = 0.4;
          break;
        case 13:
          scale = 0.35;
          break;
        case 14:
          scale = 0.4;
          break;
        case 17:
          scale = 0.4;
          break;
        case 18:
          scale = 0.4;
          break;
        default:
          scale = 0.5;
      }

      spineCharCage.scale.set(scale, scale);
     
     
      // once position and scaled, set the animation to play
      spineChar.state.setAnimationByName(0, spineData.animations[2].name, true);
     

      new $w.GameApp.Walking(spineCharCage, _activeWorld, i).move();
      //array.push(walking);
      _backgroundContainer.addChild(spineCharCage);
    }


    // add the container to the stage
    _backgroundContainer.addChild(_charContainer);




  };

  world.Atea = function (callbackFunction) {
    _decorMapLocations = [
      { id: 1, x: 110, y: 1679, area: 'land', scale: 0.95 },
      { id: 2, x: 437, y: 885, area: 'land', scale: 0.75 },
      { id: 3, x: 75, y: 598, area: 'land', scale: 0.60 },
      { id: 4, x: 421, y: 426, area: 'land', scale: 0.55 },
      { id: 5, x: 406, y: 90, area: 'air', scale: 0.90 }
    ];
    _pathCharInEnvi = [
      {
        startPoint: [
          { x: 0, y: 1155 }
        ]

      },
      { startPoint: [] },
    ];
    _backgroundContainer = new PIXI.Container();

    var spinebg = new PIXI.spine.Spine(_resources.atea.spineData);
    spinebg.skeleton.setToSetupPose();
    spinebg.update(0);
    spinebg.autoUpdate = true;
    spinebg.state.setAnimationByName(0, _resources.atea.spineData.animations[0].name, true);
    //spinebg.state.timeScale = 0.1;

    _backgroundContainer.addChild(spinebg);

    var localRect = spinebg.getLocalBounds();
    spinebg.position.set(-localRect.x, -localRect.y);

    var scale = Math.min((_renderer.width) / _backgroundContainer.width, (_renderer.height) / _backgroundContainer.height);
    scale = scale / $w.devicePixelRatio;
    _backgroundContainer.scale.set(scale, scale);


    _backgroundContainer.addChild(_decorContainer);
    _containerStage.addChild(_backgroundContainer);

    callbackFunction();
  };
  world.Oidur = function (callbackFunction) {
    _decorMapLocations = [
      { id: 1, x: 337, y: 1667, area: 'land', scale: 0.90 },
      { id: 2, x: 18, y: 1354, area: 'land', scale: 0.80 },
      { id: 3, x: 106, y: 862, area: 'land', scale: 0.70 },
      { id: 4, x: 494, y: 503, area: 'land', scale: 0.60 },
      { id: 5, x: 597, y: 66, area: 'air', scale: 0.9 },
    ];
    _backgroundContainer = new PIXI.Container();

    var spinebg = new PIXI.spine.Spine(_resources.oidur.spineData);
    spinebg.skeleton.setToSetupPose();
    spinebg.update(0);
    spinebg.autoUpdate = true;
    spinebg.state.setAnimationByName(0, _resources.oidur.spineData.animations[0].name, true);
    //spinebg.state.timeScale = 0.1;

    _backgroundContainer.addChild(spinebg);

    var localRect = spinebg.getLocalBounds();
    spinebg.position.set(-localRect.x, -localRect.y);

    var scale = Math.min((_renderer.width) / _backgroundContainer.width, (_renderer.height) / _backgroundContainer.height);
    scale = scale / $w.devicePixelRatio;
    _backgroundContainer.scale.set(scale, scale);


    _backgroundContainer.addChild(_decorContainer);
    _containerStage.addChild(_backgroundContainer);

    createBlur(_backgroundContainer);

    callbackFunction();
  };
  world.Frusht = function (callbackFunction) {
    _decorMapLocations = [
      { id: 1, x: 675, y: 1767, area: 'land', scale: 0.90 },
      { id: 2, x: 62, y: 1169, area: 'land', scale: 0.70 },
      { id: 3, x: 454, y: 505, area: 'land', scale: 0.60 },
      { id: 4, x: 8, y: 418, area: 'land', scale: 0.55 },
      { id: 5, x: 115, y: 114, area: 'air', scale: 0.5 }
    ];
    _backgroundContainer = new PIXI.Container();

    var spinebg = new PIXI.spine.Spine(_resources.frusht.spineData);
    spinebg.skeleton.setToSetupPose();
    spinebg.update(0);
    spinebg.autoUpdate = true;
    spinebg.state.setAnimationByName(0, _resources.frusht.spineData.animations[0].name, true);
    //spinebg.state.timeScale = 0.1;

    _backgroundContainer.addChild(spinebg);

    var localRect = spinebg.getLocalBounds();
    spinebg.position.set(-localRect.x, -localRect.y);

    var scale = Math.min((_renderer.width) / _backgroundContainer.width, (_renderer.height) / _backgroundContainer.height);
    scale = scale / $w.devicePixelRatio;
    _backgroundContainer.scale.set(scale, scale);


    _backgroundContainer.addChild(_decorContainer);
    _containerStage.addChild(_backgroundContainer);

    createBlur(_backgroundContainer);

    callbackFunction();
  };
  world.Routh = function (callbackFunction) {
    _decorMapLocations = [
      { id: 1, x: 133, y: 1768, area: 'land', scale: 0.95},
      { id: 2, x: 696, y: 800, area: 'land', scale: 0.65 },
      { id: 3, x: 425, y: 578, area: 'land', scale: 0.60 },
      { id: 4, x: 66, y: 470, area: 'land', scale: 0.55 },
      { id: 5, x: 265, y: 109, area: 'air', scale: 0.90 }
    ];
    _backgroundContainer = new PIXI.Container();

    var spinebg = new PIXI.spine.Spine(_resources.routh.spineData);
    spinebg.skeleton.setToSetupPose();
    spinebg.update(0);
    spinebg.autoUpdate = true;
    spinebg.state.setAnimationByName(0, _resources.routh.spineData.animations[0].name, true);
    //spinebg.state.timeScale = 0.1;

    _backgroundContainer.addChild(spinebg);

    var localRect = spinebg.getLocalBounds();
    spinebg.position.set(-localRect.x, -localRect.y);

    var scale = Math.min((_renderer.width) / _backgroundContainer.width, (_renderer.height) / _backgroundContainer.height);
    scale = scale / $w.devicePixelRatio;
    _backgroundContainer.scale.set(scale, scale);


    _backgroundContainer.addChild(_decorContainer);
    _containerStage.addChild(_backgroundContainer);

    createBlur(_backgroundContainer);

    callbackFunction();
  };

  gs.setup = function (containerStage, renderer, AppService) {
    _containerStage = containerStage;
    _renderer = renderer;
    _AppService = AppService;

    _holderContainer = new $w.PIXI.Container();
    _decorContainer = new $w.PIXI.Container();
    _charContainer = new $w.PIXI.Container();
  };
  gs.run = function (name) {
    var dataisland = $w.GameApp.IslandServices.PlayerIsland;
    for (var i in dataisland) {
      if (dataisland[i].name === name) {
        _activeWorld = dataisland[i];
        break;
      }
    }

    world[_activeWorld.name](function () {
      showCharInEnvirontment();
      showDecorInEnvirontment();
    });

    gs.backgroundContainer = _backgroundContainer;
    gs.charContainer = _charContainer;
    gs.renderer = _renderer;
  };
  gs.putDecorItemToEnvirontment = function (decorId) {
    _selectedDecorItem = $w.GameApp.IslandServices.getDecorItem(decorId);
    $w.GameApp.IslandEnviAnim.draggingMode.on();

    showDecorHolder();
  };
  gs.backgroundContainer = _backgroundContainer;
  gs.charContainer = _charContainer;
  gs.renderer = _renderer;

  $w.GameApp.GameStage = gs;
})(this);

/** GameApp - IslandEnviAnim */
(function IslandEnviAnim($w, PIXI, $) {
  'use strict';
  var _this = $w.GameApp.islandEnviAnim || {};
  var gm = $w.GameApp;

  var renderer,
    stage,
    decorContainer,
    holderContainer,
    backgroundContainer;

  var _playerIsland = [],
    activeEnvi,
    resources = PIXI.loader.resources,
    myLoader = {},
    InventorySlotService = {},
    rendererOptions = {
      antialiasing: false,
      transparent: true,
      resolution: window.devicePixelRatio,
      autoResize: true
    },
    scopeEnvi = {},
    myPopup = {};

  var IslandServices = {};
  var aPopup = {};
  var _playerInfo = $w.izyObject('PlayerInfo').getOne();
  var AppService;

  function createCoundown() {
    var cData = scopeEnvi.charsInEnvi; 
    for (var i = 0; i < cData.length; i++) {
      var countdown = $w.GameApp.getTimeRemaining(cData[i].lifeEnd);
      var countdownText = '2 days 07:02:01';

      countdownText = '<div>' + countdown.days + ' days </div><div>' + countdown.hours + ':' + countdown.minutes + ':' + countdown.seconds + '</div>';
      cData[i].lifespanCountdownText = countdownText;
    }
  
    //console.log('countdown');
  };

  function createEnvirontment(islandId, callbackFn) {
    _this.isStop = false;

    $w.gmLoading.show();

    scopeEnvi.island = $w.GameApp.IslandServices.getIsland(islandId);
    activeEnvi = scopeEnvi.island;
    _playerInfo = $w.izyObject('PlayerInfo').getOne();

    if (Number(_playerInfo.currentEnvirontment) < Number(activeEnvi.id)) {
      $w.GameApp.IslandEnviAnim.draggingMode.atUnAvailableIsland();
    } else {
      $w.GameApp.IslandEnviAnim.draggingMode.atAvailableIsland();
    }


    renderer = new $w.PIXI.autoDetectRenderer($w.innerWidth, $w.innerHeight, rendererOptions, true);
    $('#environtment-1').html(renderer.view);
    //renderer.plugins.interaction.destroy();

    // create the root of the scene graph
    stage = new PIXI.Container();
    decorContainer = new PIXI.Container();
    holderContainer = new PIXI.Container();
    backgroundContainer = new PIXI.Container();

    $w.GameApp.GameStage.setup(backgroundContainer, renderer, AppService);
    $w.GameApp.GameStage.run(activeEnvi.name);



    stage.addChild(backgroundContainer);


    //stage.addChild(decorContainer);
    //stage.addChild(holderContainer);


    function animate() {
      if (_this.isStop) return;

      $w.requestAnimationFrame(animate);
      renderer.render(stage);
    };

    animate();
    callbackFn();
    runLifespanCharsCountdown();
  };

  function runLifespanCharsCountdown() {
    console.log(scopeEnvi.charsInEnvi);

    scopeEnvi.charsInEnvi = $w.GameApp.CharServices.getEnviPlayerChar(activeEnvi.id);
    $w.removeEventListener('serverdatetick', createCoundown);
    $w.addEventListener('serverdatetick', createCoundown);

    
  };

  function stopLifespanCharCountDown() {
    $w.removeEventListener('serverdatetick', createCoundown);
  };

  _this.isStop = false;
  _this.setup = function ($ionicLoading, $ionicPopup, $scope, _AppService) {
    myPopup = $ionicPopup;
    myLoader = $ionicLoading;
    scopeEnvi = $scope;
    AppService = _AppService;
  };
  _this.draggingMode = {
    on: function () {
      $('#bottonMenu').hide();
      //$('#toggleLifetime').hide();
      $('#backtoHome').hide();
    },
    off: function () {
      $('#bottonMenu').show();
      //$('#toggleLifetime').show();
      $('#backtoHome').show();
    },
    atAvailableIsland: function () {
      $('#bottonMenu').show();
      //$('#toggleLifetime').show();
      $('#backtoHome').show();

      $w.document.getElementById('bottonMenu').style.visibility = 'visible';
      //$w.document.getElementById('toggleLifetime').style.visibility = 'visible';
      //console.log('atAvailableIsland');
    },
    atUnAvailableIsland: function () {
      $('#bottonMenu').hide();
      //$('#toggleLifetime').hide();
      $('#backtoHome').show();

      $w.document.getElementById('bottonMenu').style.visibility = 'hidden';
      //$w.document.getElementById('toggleLifetime').style.visibility = 'hidden';

      //console.log('atAvailableIsland');
    }
  };
  _this.openDetailEnvirontment = function (id) {
    scopeEnvi.island = $w.GameApp.IslandServices.getIsland(id);
    scopeEnvi.myPopup = myPopup.show({
      title: scopeEnvi.island.name,
      subTitle: scopeEnvi.island.description,
      templateUrl: 'templates/popup-detail-environtment.html',
      scope: scopeEnvi
    });
  };
  _this.enterEnvirontment = function (id) {
    $w.gmLoading.show({ duration: 3000 });
   
    // -- change sfx
    $('#gameLayout').fadeIn('fast');
    $('#appLayout').hide();
    var sfx = gm.Sounds.bgm2();
    gm.Sounds.bgm1().pause();
    sfx.play();

    function callback() {
      $w.enviLoading.show({
        template: $w.GameApp.IslandServices.getWelcomeTemplateIsland(activeEnvi),
        duration: 3000
      });
    };
   
    createEnvirontment(id, callback);
   
    // console.log($w.GameApp.IslandServices.getIsland(1));

    $w.GameApp.Animations.isStop = true;
    $w.GameApp.Animations.stop();

  };
  _this.leaveEnvirontment = function () {
    $('#appLayout').show();

    //$w.gmLoading.show({ duration: 3000 });
    myLoader.show({ duration: 3000 });
    scopeEnvi.reloadPlayerInfo();

    $w.GameApp.Animations.stop();
    $w.GameApp.Animations.isStop = false;
    $w.GameApp.Animations.reload(function () {
      $('#gameLayout').hide();
      $('map').imageMapResize();
    });



    stopLifespanCharCountDown();

    // -- change sfx
    $w.GameApp.Sounds.bgm2().pause();
    $w.GameApp.Sounds.bgm1().play();

    _this.destroyEnvirontment();
  };
  _this.PurchasingIsland = function (environtId) {
    var playerInfo = $w.izyObject('PlayerInfo').getOne();
    var islandToBuy = $w.GameApp.IslandServices.getIsland(environtId);

    function onReadyBuyIsland() {
      //-- update player info
      playerInfo.currentEnvirontment = islandToBuy.id;
      playerInfo.diamondBalance -= islandToBuy.price.value;
      playerInfo.maxPopulation = islandToBuy.population.value;
      $w.izyObject('PlayerInfo').store(playerInfo);

      $w.GameApp.IslandServices.loadIslandImage();
      //if ($w.document.getElementById('gameLayout').style.display != 'none') {
      //  $w.GameApp.IslandEnviAnim.leaveEnvirontment();

      //}

      myPopup.alert({ title: 'Notifications', template: 'Success to expand ' + islandToBuy.name });
      scopeEnvi.myPopup.close();
      _this.enterEnvirontment(islandToBuy.id);
    };

    //-- validate diamond
    if (Number(playerInfo.diamondBalance) < Number(islandToBuy.price.value)) {
      //aPopup.alert("You don't have enough diamond.");
      myPopup.alert({ title: 'Alert', template: "You don't have enough diamond." });
      return;
    }

    //-- validate EP
    if (parseInt(playerInfo.enviPoint) < parseInt(islandToBuy.requiredEP)) {
      myPopup.alert({ title: 'Alert', template: 'Required ' + islandToBuy.requiredEP + ' EP to expand ' + islandToBuy.name });
      return;
    }



    myPopup.confirm({ template: 'Expand to ' + islandToBuy.name + ' ?', title: 'Confirmation' })
      .then(onReadyBuyIsland);

  };
  _this.purchaseDecoration = function (decorId) {
    var decor = $w.GameApp.IslandServices.getDecorItem(decorId);
    var playerInfo = $w.izyObject('PlayerInfo').getOne();
    var envi = activeEnvi;

    //-- validate diamond
    if (playerInfo.diamondBalance < decor.price) {

      myPopup.alert({
        title: 'Alert',
        template: 'You dont have enough diamond.'
      });

      //aPopup.alert("You dont have enough diamond.");
      return;
    }


    //-- validate decor can put in island or not, and then inventory slot full or not
    var maxLand = 4,
      maxAir = 1,
      totalDecorInLand = 0,
      totalDecorInAir = 0,
      totalItem = 0,
      maxItem = 0;

    var decorationItems = $w.GameApp.IslandServices.fetchDecorationItems(envi.name);

    for (var i in decorationItems) {
      var path = decorationItems[i].path;
      if (String(path.area).toLowerCase() == 'air') {
        totalDecorInAir += 1;
      }
      if (String(path.area).toLowerCase() == 'land') {
        totalDecorInLand += 1;
      }
    }

    if (decor.area == 'land') {
      maxItem = maxLand;
      totalItem = totalDecorInLand;
    } else {
      maxItem = maxAir;
      totalItem = totalDecorInAir;
    };

    scopeEnvi.totalAvailableSlot = AppService.inventorySlot.getTotalAvailableSlot();
    scopeEnvi.totalItemInSlot = AppService.inventorySlot.getTotalItemInSlot();

    if (totalItem == maxItem && scopeEnvi.totalAvailableSlot == scopeEnvi.totalItemInSlot) {
      myPopup.alert({
        title: 'Alert',
        template: 'You dont have any slot to save this item !'
      });
      //aPopup.alert('You dont have any slot to save this item !');
      return;
    }



    myPopup.confirm({
      title: 'Confirmation',
      template: 'Buy this decoration ?'
    }).then(function (res) {
      if (res) {
        scopeEnvi.closeMenu();
        $w.GameApp.GameStage.putDecorItemToEnvirontment(decorId);
        scopeEnvi.refresData();
        // envi.draggingItem(decor);
        //refresData();
      }
    });


    //aPopup.confirm('Buy this decoration ?', 'Confirmation', ['OK', 'Try Later'])
    //  .then(function (btnIndex) {
    //    if (btnIndex == 1) {
    //      $scope.closeMenu();
    //      envi.draggingItem(decor);
    //      refresData();
    //    }
    //  });
  };
  _this.purchaseFiveInventorySlot = function () {
    var price = 20;
    var playerInfo = izyObject('PlayerInfo').getOne();

    if (scopeEnvi.totalAvailableSlot === 25) return;

    //-- validate diamond
    if (playerInfo.diamondBalance < price) {
      myPopup.alert({
        title: 'Alert',
        template: 'You dont have enough diamond.'
      });
      return;
    }

    function onAfterConfirmation(result) {
      if (!result) return;

      playerInfo.diamondBalance -= 20;
      $w.izyObject('PlayerInfo').store(playerInfo);
      AppService.inventorySlot.purchaseFiveSlot();
      scopeEnvi.refresData();
    };

    ////-- confirmation dialog
    //$cordovaDialogs.confirm('Buy 5 slots ?', 'Confirmation', ['OK', 'Try Later'])
    //  .then(function (buttonIndex) {
    //    // no button = 0, 'OK' = 1, 'Cancel' = 2
    //    var btnIndex = buttonIndex;
    //    if (buttonIndex !== 1) return;

    //    playerInfo.diamondBalance -= 20;
    //    izyObject('PlayerInfo').store(playerInfo);
    //    AppService.inventorySlot.purchaseFiveSlot();
    //    refresData();
    //  });
    myPopup.confirm({ title: 'Confirmation', template: 'Buy 5 slots ?' }).then(onAfterConfirmation);



  };
  _this.destroyEnvirontment = function () {
    if (renderer) {
      renderer.destroy();
      this.isStop = true;
      console.log('envi destroyed');
    };
  };
  _this.moveIteminInventorySlotToEnvirontment = function (slotId) {
    /** 
      - this run every user click one of displayed inventory slot
      - leave - cancel if slot not cointain decoration item
    **/
    var slot = AppService.inventorySlot.getSlot(slotId);
    if (slot.isEmpty) {
      return;
    }

    var decor = $w.GameApp.IslandServices.getDecorItem(slot.activeDecorId);

    $w.GameApp.GameStage.putDecorItemToEnvirontment(decor.id)



    scopeEnvi.closeMenu();
    scopeEnvi.refresData();


    //-- remove decor item in this inventory slot
    slot.activeDecorId = 0;
    slot.isEmpty = 1;
    AppService.inventorySlot.save(slot);
  };
  _this.onSwipingInEnvirontment = function (nextOrPrev) {
    var changedId, gm = $w.GameApp;
    if (nextOrPrev === 'next') {
      //console.log('on swipe down');
      changedId = Number(activeEnvi.id) + 1;
      if (changedId > gm.JsonData.island.length) return;
    };
    if (nextOrPrev === 'prev') {
      //console.log('on swipe up');
      changedId = Number(activeEnvi.id) - 1;
      if (changedId <= 0) return;
    };

    //$ionicLoading.show();

    activeEnvi = $w.GameApp.IslandServices.getIsland(changedId);
    createEnvirontment(changedId, function () {
      $w.enviLoading.show({
        template: $w.GameApp.IslandServices.getWelcomeTemplateIsland(activeEnvi),
        duration: 3000
      });

    });
    //swithActiveEnvi();

    /*
    $ionicLoading.show({
      template: getWelcomeTemplateIsland(),
      duration: 50000,
      noBackdrop: true
    });
    */
    //$w.enviLoading.show({ template: getWelcomeTemplateIsland(), duration: 2500 });
  };


  $w.GameApp.IslandEnviAnim = _this;
})(this, this.PIXI, this.jQuery);

(function IAP(w) {
  var IAP = {};
  var store = w.store || {};
  var productIds = [
      {
        id: "10_diamond",
        alias: "10_diamond",
        type: "consumable"
      },
      {
        id: "30_diamond",
        alias: "30_diamond",
        type: "consumable"
      },
      {
        id: "50_diamond",
        alias: "50_diamond",
        type: "consumable"
      },
      {
        id: "70_diamond",
        alias: "70_diamond",
        type: "consumable"
      },
      {
        id: "150_diamond",
        alias: "150_diamond",
        type: "consumable"
      },
      {
        id: "310_diamond",
        alias: "310_diamond",
        type: "consumable"
      },
      {
        id: "470_diamond",
        alias: "470_diamond",
        type: "consumable"
      },
      {
        id: "650_diamond",
        alias: "650_diamond",
        type: "consumable"
      }
  ];

  function requestStoreListing() {
    var androidApplicationLicenseKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtrOQsWiUYfQ65MjUam2zu2DgoBkOsaoelFQHWzRkAT+KHr1xPIOF5JUeQs/XWtNjRI4pavBrRveB3xnoKE+WxvILh4N+3Kl11/i0r9B6/LBae8V8WZpArEIIvh3rgowDGTO0B6sfWO71iP9EStmwziBI4sDOMuPensBSmj8bxj3hhNEzyRJvQbybdNgAD2xoy55+S0kgLHE3PbZwqogJf1pPIGSmhC2SXSrMXoJzxeMxM8/hN7VoVj9VAJxzOE3zR9he9npiDWGLsPnAIXggUN9Ys0h80YjwRl7GHLP0P/itBo28w4+qOqz2E34SFFInAqX7evtrMu3AkfYcX+FPuQIDAQAB";
    var productIds = "470_diamond, 30_diamond";
    var product_info = {};

    window.iap.setUp(androidApplicationLicenseKey);
    window.iap.requestStoreListing(productIds, function (result) {
      for (var i = 0 ; i < result.length; ++i) {
        var p = result[i];

        product_info[p["productId"]] = { title: p["title"], price: p["price"] };

        alert("productId: " + p["productId"]);
        alert("title: " + p["title"]);
        alert("price: " + p["price"]);
      }
    }, function (error) {
      alert("error: " + error);
    });
  };
  function consumeProduct(_productId) {
    var productId = '470_diamond';

    //consume product id, throw away purchase product id info from server.
    window.iap.consumeProduct(productId, function (result) {
      alert("purchaseProduct");
    },
    function (error) {
      alert("error: " + error);
    });
  }

  IAP.products = productIds;

  IAP.loadProducts = function () {
    // Let's set a pretty high verbosity level, so that we see a lot of stuff
    // in the console (reassuring us that something is happening).
    store.verbosity = store.DEBUG;

    // We register a dummy product. It's ok, it shouldn't
    // prevent the store "ready" event from firing.

    for (var i = 0; i < IAP.products.length; i++) {
      store.register(IAP.products[i]);
    }


    // When every goes as expected, it's time to celebrate!
    // The "ready" event should be welcomed with music and fireworks,
    // go ask your boss about it! (just in case)
    store.ready(function () {
      console.log("\\o/ STORE READY \\o/");
      //alert('Store is ready');
    });

    // After we've done our setup, we tell the store to do
    // it's first refresh. Nothing will happen if we do not call store.refresh()
    store.refresh();

    // Log all errors
    store.error(function (error) {
      log('ERROR ' + error.code + ': ' + error.message);
    });
  };
  IAP.buy = function (productId) {
    console.log(productId);
    var a = store.order(productId);

    a.then(function () {
      console.log('yes');
    });

    a.error(function (e) {
      console.log('no');
      console.log(e);
    });

    store.when(productId).requested(IAP.makeRequest);
    store.when(productId).approved(IAP.readyToGo);
  };
  IAP.makeRequest = function (product) {
    //-- send request with token available
  }

  IAP.readyToGo = function (product) {
    /* if anyone can hack this, but make sure diamond balance of player on the server not effected */


    //-- send to server - validate token ; after that on the server increase diamond balance of this player


    //-- reload player info that consist of player diamond 


    product.finish();
  }

  w.GameApp.IAP = IAP;
})(this);