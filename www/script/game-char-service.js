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
        char.code = String('00' + createRandomCode()).substr(0, 8);
        char.hatched = Date.parse(a.GameApp.serverDate);
        char.hatchby = 1;
        char.parent = 'psmi2016';

        return char;
    };

    cs.PlayerChars = [];
    cs.getAllData = function () {
        masterdata = a.clone(a.GameApp.JsonData.characters);
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
        var PlayerChars = [];

        for (var i = 0; i < data.length; i++) {
            var pChar = Object(data[i]);

            // console.log(pChar);
            var mChar = window.clone(this.getChar(pChar.char_id));
            delete mChar.id;

            //console.log(pChar.dead_on_clientFormat);

            pChar.charId = pChar.char_id;
            pChar.lifeEnd = Date.parse(pChar.dead_on_clientFormat);

            var char = window.mergeObjects(pChar, mChar);

            // console.log(char);
            PlayerChars.push(char);


        }

        //-- validate char is still alive or not
        this.PlayerChars = PlayerChars;

        window.GameApp.rootScope.playerChars = PlayerChars;

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
    cs.__updatePlayerCharNickname = function (char, newNickname) {
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
        var data = this.getPlayerChars();
        var _list = [];

        //window.jQuery.each(data, function (key, value) {
        //    var pChar = Object(value);
        //    if (pChar.stage == enviID) {

        //        _list.push(pChar);
        //    }
        //});
       
        for (var idx = 0; idx < data.length; idx++) {
            var pChar = Object(data[idx]);
            if (pChar.stage == enviID) {
                _list.push(pChar);
            }
        }


        envi.chars = _list;

        return envi.chars;
    };
    cs.getChar = function (charId) {
        for (var i = 0; i < window.GameApp.JsonData.characters.length; i++) {
            var char = Object(window.GameApp.JsonData.characters[i]);
            if (char.id == charId) {
                return char;
            }
        }
    };

    a.GameApp.CharServices = cs;
})(this);