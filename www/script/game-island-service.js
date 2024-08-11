/** IslandServices - Island Game Services */
(function IslandServices($w) {
    var gm = $w.GameApp;

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
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    return data[i];
                }
            }
            return {};
        };
        _this.getDecorItem = function (id) {
            var data = $w.GameApp.JsonData.decoration;
            var obj = {};

            //for (var i in data) {
            //  if (data[i].id == id) {
            //    return data[i];
            //  }
            //}
            $.each(data, function (key, value) {
                if (value.id == id) {
                    obj = value;
                    return true;
                }
            });


            return obj;
        };


        return _this;
    };

    $w.GameApp.IslandServices = _IslandServices();
})(window);