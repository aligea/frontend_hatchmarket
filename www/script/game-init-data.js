/** JsonData */
(function JsonData($w) {
    var jsonData = {
        decoration: [],
        equipment: [],
        island: [],
        characters: [],
        redeem: []
    };
    $w.GameApp.JsonData = jsonData;
})(window);

/** InitializeData */
(function InitializeData($w) {
    var baseurl = $w.GameApp.serverURL;


    function initializeData(cbFn) {
        var jsonData = $w.GameApp.JsonData;

        var assets = [
     { name: "Incubator_1", url: 'animation/incubator1/skeleton.json' },
     { name: "Incubator_2", url: 'animation/incubator2/skeleton.json' },
     { name: "Incubator_3", url: 'animation/incubator3/skeleton.json' },
     { name: "Incubator_4", url: 'animation/incubator4/skeleton.json' },
     { name: "Incubator_5", url: 'animation/incubator5/skeleton.json' },
     { name: "cloudSkeleton", url: 'animation/clouds/skeleton.json' },
     { name: "waveSkeleton", url: 'animation/waves/skeleton.json' },

     { name: "goldEgg", url: 'asset/img/gold-egg.jpg' },
     { name: "silverEgg", url: 'asset/img/silver-egg.png' },
     //{ name: "bgReward", url: 'asset/img/bg-reward.jpg' },
     //{ name: "coin", url: 'asset/img/Coin.png' }

        ];
        var jsonAssets = [
          { name: "json_island", url: baseurl + '/data/island' },
          { name: "json_decoration", url: baseurl + '/data/decoration' },
          { name: "json_equipment", url: baseurl + '/data/equipment' },
          { name: "json_characters", url: baseurl + '/data/characters' },
          { name: "json_redeem", url: baseurl + '/data/redeemmaster' }
        ];

        validateJsonData();

        function fetchPixiAsset() {
            //for (var i = 0; i < jsonData.decoration.length; i++) {
            //  var item = jsonData.decoration[i];
            //  assets.push({ name: 'decorItem-' + item.id, url: item.imageUrl[1] });

            //  if (Number(item.id) === 9) {
            //    assets.push({ name: 'decorItem-' + item.id + '-2', url: item.imageUrl[2] });
            //  }
            //};

            //for (var i = 0; i < jsonData.characters.length; i++) {
            //  var char = jsonData.characters[i];
            //  assets.push({
            //    name: 'char_' + char.id,
            //    url: 'animation/characters/' + (String(char.name).toLowerCase()) + '/skeleton.json'
            //  });
            //};

            $w.GameApp.JsonData = jsonData;
            $w.PIXI.loader.add(assets).load(onPixiAssetLoaded);

            $w.dispatchEvent(new CustomEvent('gamedataready', { bubble: true, cancelable: true }));
        }

        function onJsonLoaded(loader, res) {
            jsonData.decoration = window.jQuery.parseJSON(res.json_decoration.data).sort($w.sortById);
            jsonData.equipment = window.jQuery.parseJSON(res.json_equipment.data).sort($w.sortById);
            jsonData.island = window.jQuery.parseJSON(res.json_island.data).sort($w.sortById);
            jsonData.characters = window.jQuery.parseJSON(res.json_characters.data).sort($w.sortById);
            jsonData.redeem = window.jQuery.parseJSON(res.json_redeem.data);

            window.izyObject('json_decoration').store(jsonData.decoration);
            window.izyObject('json_equipment').store(jsonData.equipment);
            window.izyObject('json_island').store(jsonData.island);
            window.izyObject('json_characters').store(jsonData.characters);
            window.izyObject('json_redeem').store(jsonData.redeem);

            console.log('fetch masterdata from server');
            fetchPixiAsset();
        };

        function onPixiAssetLoaded(loader, res) {
            if (typeof (cbFn) === 'function') {
                cbFn();
            }
        };

        function fetchJsonData() {

        }

        function validateJsonData() {
            var isExist = true;
            for (var i = 0; i < jsonAssets.length; i++) {
                var dataName = jsonAssets[i].name;
                var data = window.izyObject(dataName).getOne();
                var name = dataName.replace('json_', '');

                if (data.length > 0) {
                    jsonData[name] = window.izyObject(dataName).getOne();
                } else {
                    return $w.PIXI.loader.add(jsonAssets).load(onJsonLoaded);
                }
            }

            console.log('fetch masterdata from local');
            fetchPixiAsset();
        }
    };
    function initializeDataIsland(cbFn) {
        var jsonData = $w.GameApp.JsonData;
        var assets = [

             { name: "enableHolder", url: 'asset/img/island/bulat-01.png' },
             { name: "disableHolder", url: 'asset/img/island/bulat-02.png' },
             { name: "blurbg", url: 'asset/img/island/bg-blur.jpg' },

             { name: "targetGold", url: 'animation/targets/gold/skeleton.json' },
             { name: "targetStone", url: 'animation/targets/stone/skeleton.json' },
             { name: "targetWood", url: 'animation/targets/wood/skeleton.json' },
             { name: "targetCoin", url: 'animation/targets/coin/skeleton.json' },

             { name: "goldEgg", url: 'asset/img/gold-egg.jpg' },
             { name: "silverEgg", url: 'asset/img/silver-egg.png' },
             { name: 'outerbar', url: 'asset/img/bar-outer.png' },
             { name: 'innerbar', url: 'asset/img/bar-inner.png' },
             { name: 'fnicon', url: 'asset/img/icons/FinishNow.png' },
             { name: "locked", url: 'asset/img/island/Locked.png' }

        ];
        console.log('im here ?');
        var jsonAssets = [
          { name: "json_island", url: baseurl + '/data/island' },
          { name: "json_decoration", url: baseurl + '/data/decoration' },
          { name: "json_equipment", url: baseurl + '/data/equipment' },
          { name: "json_characters", url: baseurl + '/data/characters' },
           { name: "json_redeem", url: baseurl + '/data/redeemmaster' }
        ];

        validateJsonData();

        function fetchPixiAsset() {
            //for (var i = 0; i < jsonData.decoration.length; i++) {
            //  var item = jsonData.decoration[i];
            //  assets.push({ name: 'decorItem-' + item.id, url: item.imageUrl[1] });

            //  if (Number(item.id) === 9) {
            //    assets.push({ name: 'decorItem-' + item.id + '-2', url: item.imageUrl[2] });
            //  }
            //};

            $w.GameApp.JsonData = jsonData;

            var datachar = window.izyObject('PlayerChars').getAll();
            var uchid = [];
            for (var i = 0; i < datachar.length; i++) {
                var char = window.GameApp.CharServices.getChar(datachar[i].char_id);
                if (uchid.indexOf(char) < 0) {
                    uchid.push(char);
                }
            }
            for (var i = 0; i < uchid.length; i++) {
                var char = Object(uchid[i]);
                //console.log(char);
                assets.push({
                    name: 'char_' + char.id,
                    url: 'animation/characters/' + (String(char.name).toLowerCase()) + '/skeleton.json'
                });
            };

            $w.PIXI.loader.add(assets).load(onPixiAssetLoaded);

            $w.dispatchEvent(new CustomEvent('gamedataready', { bubble: true, cancelable: true }));
        }

        function onJsonLoaded(loader, res) {
            jsonData.decoration = window.jQuery.parseJSON(res.json_decoration.data).sort($w.sortById);
            jsonData.equipment = window.jQuery.parseJSON(res.json_equipment.data).sort($w.sortById);
            jsonData.island = window.jQuery.parseJSON(res.json_island.data).sort($w.sortById);
            jsonData.characters = window.jQuery.parseJSON(res.json_characters.data).sort($w.sortById);
            jsonData.redeem = window.jQuery.parseJSON(res.json_redeem.data);

            window.izyObject('json_decoration').store(jsonData.decoration);
            window.izyObject('json_equipment').store(jsonData.equipment);
            window.izyObject('json_island').store(jsonData.island);
            window.izyObject('json_characters').store(jsonData.characters);
            window.izyObject('json_redeem').store(jsonData.redeem);

            console.log('fetch masterdata from server');
            fetchPixiAsset();
        };

        function onPixiAssetLoaded(loader, res) {
            if (typeof (cbFn) === 'function') {
                cbFn();
            }
        };

        function fetchJsonData() {

        }

        function validateJsonData() {
            var isExist = true;
            for (var i = 0; i < jsonAssets.length; i++) {
                var dataName = jsonAssets[i].name;
                var data = window.izyObject(dataName).getOne();
                var name = dataName.replace('json_', '');

                if (data.length > 0) {
                    jsonData[name] = window.izyObject(dataName).getOne();
                } else {
                    return $w.PIXI.loader.add(jsonAssets).load(onJsonLoaded);
                }
            }

            console.log('fetch masterdata from local');
            fetchPixiAsset();
        }
    };

    $w.GameApp.InitializeData = initializeData;
    $w.GameApp.InitializeDataIsland = initializeDataIsland;
})(this);