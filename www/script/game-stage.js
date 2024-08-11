/** GameApp - GameStage */
(function GameStage($w) {
    'use strict';

    var _renderer,
            _containerStage,
            _decorContainer = new PIXI.Container(),
            _holderContainer;
    //var decorChildContainer, holderChildContainer;
    var _decorMapLocations = [];
    var _resources = $w.PIXI.loader.resources;
    var _selectedDecorItem = {};
    var gs = {};
    var world = {};
    var _AppService;
    var _activeWorld;
    var _backgroundContainer = new PIXI.Container();

    var _charContainer = new PIXI.Container();
    var _objectTargetContainer = new PIXI.Container();

    var _woodActionChar, _stoneActionChar, _goldActionChar;

    var progressBarContainer = new PIXI.Container();

    var callbackDecor;

    var isDecorPathLocationAvailable = function (path) {
        var totalAvailableSlot = _AppService.inventorySlot.getTotalAvailableSlot(),
                totalItemInSlot = _AppService.inventorySlot.getTotalItemInSlot();

        var decorationItems = window.GameApp.IslandBusiness.getDecorationData();
        if (!decorationItems || decorationItems.length == 0)
            return true;

        var isPathContainsItem = false;
        for (var idx = 0; idx < decorationItems.length; idx++) {
            var decorationItem = decorationItems[idx];
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

    var onSelectedPathDecorLocation = function (holder, path) {
        //-- save decor to server with this path
        var itemDecoration = {
            decorItem: _selectedDecorItem,
            path: path,
            holder: { x: holder.x, y: holder.y, height: holder.height, width: holder.width }
        }
        //console.log(itemDecoration);

        function callbackSuccess() {
            window.GameApp.rootScope.reloadPlayerData(function () {
                window.GameApp.IslandBusiness.fetchRegionData(_activeWorld.id, function () {

                    showDecorInEnvirontment();

                    //-- reset holder container
                    _holderContainer.destroy();
                    _backgroundContainer.removeChild(_holderContainer);
                    // _holderContainer = new PIXI.Container();
                });
            });

        }

        if (typeof (callbackDecor) == 'function') {
            callbackDecor(itemDecoration, callbackSuccess);
        } else {
            $w.GameApp.IslandBusiness.purchasingDecoration(_activeWorld.id, itemDecoration, callbackSuccess);
        }

    };

    var showDecorHolder = function () {
        var paths = _decorMapLocations;
        _holderContainer.destroy();
        _holderContainer = new $w.PIXI.Container();

        paths.forEach(function (path) {
            if (!path.x)
                return;
            var activeHolder;
            var isAvailable = isDecorPathLocationAvailable(path);


            if (path.area == _selectedDecorItem.area && isAvailable) {
                var onAcHolderClick = function () {
                    onSelectedPathDecorLocation(this, path);
                };
                activeHolder = new PIXI.Sprite(_resources.enableHolder.texture);
                activeHolder.interactive = true;
                activeHolder.on('mousedown', onAcHolderClick);
                activeHolder.on('touchstart', onAcHolderClick);
            } else {
                activeHolder = new PIXI.Sprite(_resources.disableHolder.texture);
            }

            activeHolder.scale.set(_backgroundContainer.scale.x / 1.5, _backgroundContainer.scale.y / 1.5);
            activeHolder.position.set(path.x, path.y);


            _holderContainer.addChild(activeHolder);
        });

        _holderContainer.displayGroup = window.GameApp.GameStage.displayOrder.frontLayer;
        _backgroundContainer.addChild(_holderContainer);
    };

    var showDecorInEnvirontment = function () {
        _backgroundContainer.removeChild(_decorContainer);
        _decorContainer = new PIXI.Container();
        //_decorContainer.displayGroup = $w.GameApp.GameStage.displayOrder.backLayer;
        //Environtments.Atea.decorationItems = IslandServices.fetchDecorationItems('Atea');
        var decorationItems = $w.GameApp.IslandBusiness.getDecorationData();
        var renderingAssetDecoration = function (loader, resources) {
            decorationItems = $w.GameApp.IslandBusiness.getDecorationData();
            for (var i = 0; i < decorationItems.length; i++) {
                var value = Object(decorationItems[i]);
                var decorItem = Object(value.decorItem);
                var holder = Object(value.holder);
                var path = Object(value.path);

                var texture = resources['decorItem-' + decorItem.id];
                var decorSprite = new PIXI.Sprite(texture.texture);
                //decorSprite.anchor.x = 0.5;
                //decorSprite.anchor.y = 0.5;

                var scale = Number(path.scale);
                decorSprite.scale.set(scale, scale);

                //-- to make center point same as holder
                decorSprite.x = Number(holder.x) - (Number(decorSprite.width) / 2) + (Number(holder.width) / 2);

                //-- to make item landing same as holder
                decorSprite.y = Number(holder.y) - Number(decorSprite.height) + Number(holder.height);

                if (path.area == 'air') {
                    //decorSprite.y = holder.y;
                    decorSprite.y = holder.y - (decorSprite.height / 2) + (holder.height / 2);
                }
                _decorContainer.addChild(decorSprite);

                decorSprite.displayGroup = window.GameApp.GameStage.displayOrder.middleLayer;
                //_decorContainer.displayGroup = window.GameApp.GameStage.displayOrder.middleLayer;
                gs.decorContainer = _decorContainer;
            }
        };
        var assettoload = [];
        var indexAsset = [];

        //-- cek texture apa saja yang belum ada
        for (var i = 0; i < decorationItems.length; i++) {
            var value = Object(decorationItems[i]);
            var decorItem = Object(value.decorItem);
            var imageUrl = decorItem.imageUrl[1];
            //-- sisip inject image url untuk enghild hold
            if (Number(_activeWorld.id) === 2 && Number(decorItem.id) === 9) {
                imageUrl = decorItem.imageUrl[2];
            }
            if (!$w.PIXI.loader.resources['decorItem-' + decorItem.id] || !$w.PIXI.loader.resources['decorItem-' + decorItem.id].texture) {
                delete $w.PIXI.loader.resources['decorItem-' + decorItem.id];
                var aObj = { name: 'decorItem-' + decorItem.id, url: imageUrl };
                var checkIndex = indexAsset.indexOf(decorItem.id);
                if (checkIndex < 0) {
                    indexAsset.push(decorItem.id);
                    assettoload.push(aObj);
                }
            }

        }

        if (assettoload.length > 0) {
            $w.PIXI.loader.add(assettoload).load(renderingAssetDecoration);
        } else {
            renderingAssetDecoration(window.PIXI.loader, window.PIXI.loader.resources);
        }


        /*
         $.each(decorationItems, function (key, value) {
         var decorItem = Object(value.decorItem);
         var holder = Object(value.holder);
         var path = Object(value.path);
         
         var imageUrl = decorItem.imageUrl[1];
         
         //-- sisip inject image url untuk enghild hold
         if (Number(_activeWorld.id) === 2 && Number(decorItem.id) === 9) {
         imageUrl = decorItem.imageUrl[2];
         }
         
         var texture = PIXI.loader.resources['decorItem-' + decorItem.id];
         
         function renderDecoration(loader, resources) {
         var texture = resources['decorItem-' + decorItem.id];
         var decorSprite = new PIXI.Sprite(texture.texture);
         //decorSprite.anchor.x = 0.5;
         //decorSprite.anchor.y = 0.5;
         
         var scale = Number(path.scale);
         decorSprite.scale.set(scale, scale);
         
         //-- to make center point same as holder
         decorSprite.x = Number(holder.x) - (Number(decorSprite.width) / 2) + (Number(holder.width) / 2);
         
         //-- to make item landing same as holder
         decorSprite.y = Number(holder.y) - Number(decorSprite.height) + Number(holder.height);
         
         if (path.area == 'air') {
         //decorSprite.y = holder.y;
         decorSprite.y = holder.y - (decorSprite.height / 2) + (holder.height / 2);
         }
         _decorContainer.addChild(decorSprite);
         
         decorSprite.displayGroup = window.GameApp.GameStage.displayOrder.middleLayer;
         //_decorContainer.displayGroup = window.GameApp.GameStage.displayOrder.middleLayer;
         gs.decorContainer = _decorContainer;
         //console.log(decorSprite);
         }
         
         
         // var loader = new PIXI.loaders.Loader();
         //loader.add('decorItem-' + decorItem.id, imageUrl);
         //loader.load(renderDecoration);
         
         
         //if (!window.PIXI.loader.resources['decorItem-' + decorItem.id]) {
         //	$w.PIXI.loader.add('decorItem-' + decorItem.id, imageUrl).load(renderDecoration);
         //} else {
         //	renderDecoration(window.PIXI.loader, window.PIXI.loader.resources);
         //}
         });
         */
        _backgroundContainer.addChild(_decorContainer);
        $w.GameApp.IslandEnviAnim.draggingMode.off();
    };

    var createBlur = function (container) {
        /*
         function showDetailInsland() {
         scopeEnvi.island = activeEnvi;
         scopeEnvi.myPopup = myPopup.show({
         title: activeEnvi.name,
         subTitle: activeEnvi.description,
         templateUrl: 'templates/popup-detail-environtment.html',
         scope: scopeEnvi
         });
         }
         */

        var playerInfo = $w.izyObject('PlayerInfo').getOne();

        if (Number(playerInfo.currentEnvirontment) >= Number(_activeWorld.id)) {
            return;
        }
        var sprite = new PIXI.Sprite(_resources.blurbg.texture);
        sprite.alpha = 0.8;
        container.addChild(sprite);

        var onLockedClick = function () {
            $w.GameApp.IslandEnviAnim.openDetailEnvirontment(_activeWorld.id);
        };
        var locked = new PIXI.Sprite(_resources.locked.texture);
        locked.x = (sprite.width * 50 / 100) - (locked.width / 2);
        locked.y = (sprite.height * 50 / 100) - (locked.height / 1.5);
        locked.interactive = true;
        locked.on('mousedown', onLockedClick);
        locked.on('touchstart', onLockedClick);


        /*
         locked.on('tap', function () {
         $w.GameApp.IslandEnviAnim.openDetailEnvirontment(_activeWorld.id);
         });
         */


        container.addChild(locked);
    };

    var registerEventClickWalkingChar = function () {
        var cbfn = function () {
            window.GameApp.isOpeningCharDetail = false;
            var onWalkingCharClicked = function () {
                window.GameApp.ionicLoading.show();
                if (window.GameApp.isOpeningCharDetail) {
                    return;
                }
                window.GameApp.isOpeningCharDetail = true;
                //$w.GameApp.IslandEnviAnim.showDetailActiveChar(this.char.pcid);
                console.log(this.char);
                window.GameApp.ionicLoading.hide();
                window.GameApp.isOpeningCharDetail = false;
            };
            spineChar.interactive = true;
            spineChar.on('mousedown', onWalkingCharClicked);
            spineChar.on('touchstart', onWalkingCharClicked);
        };

    };

    var showCharInEnvirontment = function () {
        var array = [],
                charsInEnvi = [];
        _backgroundContainer.removeChild(_charContainer);
        //_charContainer.destroy();
        _charContainer = new PIXI.Container();

        //-- reset counter char
        $w.GameApp.reservedArea = [];

        charsInEnvi = $w.GameApp.CharServices.getEnviPlayerChar(_activeWorld.id);
        var regionData = $w.GameApp.IslandBusiness.getRegionData();
        var indexCharInWorld = 0;
        //window.GameApp.StopWalkingProcess();

        //-- inisiasikan dulu asset char apa saja yg perlu di load
        var assetToLoad = [];
        var assetIndex = [];
        var charToDisplay = [];
        for (var i = 0; i < charsInEnvi.length; i++) {
            var thisChar = Object(charsInEnvi[i]);
            //-- inject, biar char yang lagi kerja gak masuk sini
            if (thisChar.id == regionData.wood.workingPlayerCharId && regionData.wood.isWorking == 1) {
                continue;
            }
            if (thisChar.id == regionData.stone.workingPlayerCharId && regionData.stone.isWorking == 1) {
                continue;
            }
            if (thisChar.id == regionData.gold.workingPlayerCharId && regionData.gold.isWorking == 1) {
                continue;
            }

            var char = window.GameApp.CharServices.getChar(thisChar.char_id);
            var iUrl = 'animation/characters/' + (String(char.name).toLowerCase()) + '/skeleton.json';
            var resName = 'char_' + char.id;
            var asObj = { name: resName, url: iUrl };
            var xres = window.PIXI.loader.resources;

            char.pcid = thisChar.id;
            charToDisplay.push(char);

            if (!xres[resName] || !xres[resName].spineData) {
                //-- validasi biar asset gak double/gak boleh ada yg kembar
                delete window.PIXI.loader.resources[resName]
                var checkIndex = assetIndex.indexOf(char.id);
                if (checkIndex < 0) {
                    assetIndex.push(char.id);
                    assetToLoad.push(asObj);
                }
            }
        }
        var renderingChar = function (loader, resources) {
            for (var i = 0; i < charToDisplay.length; i++) {
                var char = charToDisplay[i];
                var spineData = resources['char_' + char.id].spineData;

                // instantiate the spine animation
                //temp['pchr' + indexCharInWorld] = spineData;
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
                switch (Number(char.id)) {
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
                        scale = 0.6;
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
                // console.log(_charID, scale);
                spineCharCage.scale.set(scale, scale);

                // once position and scaled, set the animation to play
                spineChar.state.setAnimation(0, spineData.animations[2].name, true);

                spineChar.char = char;

                /*
                 var onWalkingCharClicked = function () {
                 window.GameApp.ionicLoading.show();
                 if (window.GameApp.isOpeningCharDetail) {
                 return;
                 }
                 window.GameApp.isOpeningCharDetail = true;
                 //$w.GameApp.IslandEnviAnim.showDetailActiveChar(this.char.pcid);
                 console.log(this.char);
                 window.GameApp.ionicLoading.hide();
                 window.GameApp.isOpeningCharDetail = false;
                 };
                 
                 spineCharCage.interactive = true;
                 spineCharCage.on('mousedown', onWalkingCharClicked);
                 spineCharCage.on('touchstart', onWalkingCharClicked);
                */



                //-- inject untuk mempermudah testing
                spineCharCage.charName = char.name;
                spineCharCage.charObj = char;

                $w.GameApp.currentWalking = new $w.GameApp.Walking(spineCharCage, _activeWorld, indexCharInWorld);
                $w.GameApp.currentWalking.move();

                //new $w.GameApp.Walking(spineCharCage, _activeWorld, i).move();
                //array.push(walking);
                _charContainer.addChild(spineCharCage);
                indexCharInWorld++;
            }
        };
        if (assetToLoad.length > 0) {
            window.PIXI.loader.add(assetToLoad).load(renderingChar);
        } else {
            renderingChar(window.PIXI.loader, window.PIXI.loader.resources);
        }

        _backgroundContainer.addChild(_charContainer);
    };

    var showCharObjectTargetInEnvirontment = function () {
        var stageName = String(_activeWorld.name);

        var mapTargets = {
            Atea: {
                gold: {
                    x: 600,
                    y: 410,
                    coin: {
                        x: 600 + 210,
                        y: 410 + 170
                    }
                },
                stone: {
                    x: 177,
                    y: 1050,
                    coin: {
                        x: 177 + 53,
                        y: 1050 + 80
                    }
                },
                wood: {
                    x: 717,
                    y: 961,
                    coin: {
                        x: 717 + 33,
                        y: 961 + 189
                    }
                }
            },
            Oidur: {
                gold: {
                    x: 570,
                    y: 1150,
                    coin: {
                        x: 570 + 210,
                        y: 1150 + 170
                    }
                },
                stone: {
                    x: 714,
                    y: 750,
                    coin: {
                        x: 714 + 53,
                        y: 750 + 80
                    }
                },
                wood: {
                    x: 390,
                    y: 903,
                    coin: {
                        x: 390 + 33,
                        y: 903 + 189
                    }
                }
            },
            Frusht: {
                gold: {
                    x: 0,
                    y: 530,
                    coin: {
                        x: 0 + 210,
                        y: 530 + 170
                    }
                },
                stone: {
                    x: 286,
                    y: 1390,
                    coin: {
                        x: 286 + 53,
                        y: 1390 + 80
                    }
                },
                wood: {
                    x: 723,
                    y: 579,
                    coin: {
                        x: 723 + 33,
                        y: 579 + 189
                    }
                }
            },
            Routh: {
                gold: {
                    x: 0,
                    y: 791,
                    coin: {
                        x: 0 + 210,
                        y: 791 + 170
                    }
                },
                stone: {
                    x: 406,
                    y: 1350,
                    coin: {
                        x: 406 + 53,
                        y: 1350 + 80
                    }
                },
                wood: {
                    x: 751,
                    y: 1020,
                    coin: {
                        x: 751 + 33,
                        y: 1020 + 189
                    }
                }
            }
        };

        _backgroundContainer.removeChild(_objectTargetContainer);
        //_objectTargetContainer.destroy();
        _objectTargetContainer = new PIXI.Container();

        function showTargetGold() {
            var _spineData = _resources.targetGold.spineData;
            var _spineObj = new PIXI.spine.Spine(_spineData);
            var _containerSpine = new PIXI.Container();
            ;
            var localRect = _spineObj.getLocalBounds();

            _spineObj.skeleton.setToSetupPose();
            _spineObj.update(0);
            _spineObj.autoUpdate = true;
            _spineObj.state.timeScale = 0.5;

            _containerSpine.addChild(_spineObj);
            _spineObj.position.set(-localRect.x, -localRect.y);

            var animstage = '';
            var regionData = $w.GameApp.IslandBusiness.getRegionData();
            if (regionData.gold.farmingStatus == 3) {
                animstage = stageName + '_Mining';
            } else {
                animstage = stageName;
            }

            _spineObj.state.setAnimation(0, animstage, true);
            _containerSpine.position.set(mapTargets[stageName].gold.x, mapTargets[stageName].gold.y);

            _objectTargetContainer.addChild(_containerSpine);
        }

        function showTargetStone() {
            var _spineData = _resources.targetStone.spineData;
            var _spineObj = new PIXI.spine.Spine(_spineData);
            var _containerSpine = new PIXI.Container();
            ;
            var localRect = _spineObj.getLocalBounds();

            _spineObj.skeleton.setToSetupPose();
            _spineObj.update(0);
            _spineObj.autoUpdate = true;
            _spineObj.state.timeScale = 0.5;

            _containerSpine.addChild(_spineObj);
            _spineObj.position.set(-localRect.x, -localRect.y);

            _spineObj.state.setAnimation(0, stageName, true);
            _containerSpine.position.set(mapTargets[stageName].stone.x, mapTargets[stageName].stone.y);

            _objectTargetContainer.addChild(_containerSpine);
        }

        function showTargetWood() {
            var _spineData = _resources.targetWood.spineData;
            var _spineObj = new PIXI.spine.Spine(_spineData);
            var _containerSpine = new PIXI.Container();
            ;
            var localRect = _spineObj.getLocalBounds();

            _spineObj.skeleton.setToSetupPose();
            _spineObj.update(0);
            _spineObj.autoUpdate = true;
            _spineObj.state.timeScale = 0.5;

            _containerSpine.addChild(_spineObj);
            _spineObj.position.set(-localRect.x, -localRect.y);

            _spineObj.state.setAnimation(0, stageName, true);

            _containerSpine.position.set(mapTargets[stageName].wood.x, mapTargets[stageName].wood.y);

            _objectTargetContainer.addChild(_containerSpine);
        }

        function showRewardCoin(targetLocation) {
            var _spineData = _resources.targetCoin.spineData;
            var _spineObj = new PIXI.spine.Spine(_spineData);
            var _containerSpine = new PIXI.Container();

            var localRect = _spineObj.getLocalBounds();

            _spineObj.skeleton.setToSetupPose();
            _spineObj.update(0);
            _spineObj.autoUpdate = true;
            _spineObj.state.timeScale = 1;

            _containerSpine.addChild(_spineObj);
            _spineObj.position.set(-localRect.x, -localRect.y);

            _spineObj.state.setAnimation(0, _spineData.animations[0].name, true);

            _containerSpine.scale.set(0.25, 0.25);
            _containerSpine.position.set(
                    mapTargets[stageName][targetLocation].coin.x,
                    mapTargets[stageName][targetLocation].coin.y
                    );

            //-- inject claim reward
            var onThisObjClicked = function () {
                $w.GameApp.IslandBusiness.collectFarmingReward(_activeWorld.id, targetLocation, function () {
                    showCharObjectTargetInEnvirontment();
                });
            };
            _containerSpine.interactive = true;
            _containerSpine.on('mousedown', onThisObjClicked);
            _containerSpine.on('touchstart', onThisObjClicked);

            _objectTargetContainer.addChild(_containerSpine);
        }

        function showRewardItem(targetLocation) {
            var _spineData = _resources.targetCoin.spineData;
            var _spineObj = new PIXI.spine.Spine(_spineData);
            var _containerSpine = new PIXI.Container();

            var localRect = _spineObj.getLocalBounds();

            _spineObj.skeleton.setToSetupPose();
            _spineObj.update(0);
            _spineObj.autoUpdate = true;
            _spineObj.state.timeScale = 1;

            _containerSpine.addChild(_spineObj);
            _spineObj.position.set(-localRect.x, -localRect.y);

            _spineObj.state.setAnimation(0, 'Item', true);

            _containerSpine.scale.set(0.2, 0.2);
            _containerSpine.position.set(
                    mapTargets[stageName][targetLocation].coin.x + 100,
                    mapTargets[stageName][targetLocation].coin.y
                    );

            //-- inject claim reward
            var onThisObjClicked = function () {
                $w.GameApp.IslandBusiness.collectFarmingReward(_activeWorld.id, targetLocation, function () {
                    showCharObjectTargetInEnvirontment();

                    //-- refresh item di inventory
                    window.GameApp.rootScope.reloadPlayerData(function () {
                        $w.GameApp.IslandEnviAnim.refreshDataInMenuIsland();
                    });
                });
            };
            _containerSpine.interactive = true;
            _containerSpine.on('mousedown', onThisObjClicked);
            _containerSpine.on('touchstart', onThisObjClicked);

            _objectTargetContainer.addChild(_containerSpine);
        }

        function showRewardDiamond(targetLocation) {
            var _spineData = _resources.targetCoin.spineData;
            var _spineObj = new PIXI.spine.Spine(_spineData);
            var _containerSpine = new PIXI.Container();

            var localRect = _spineObj.getLocalBounds();

            _spineObj.skeleton.setToSetupPose();
            _spineObj.update(0);
            _spineObj.autoUpdate = true;
            _spineObj.state.timeScale = 1;

            _containerSpine.addChild(_spineObj);
            _spineObj.position.set(-localRect.x, -localRect.y);

            _spineObj.state.setAnimation(0, 'Diamond', true);

            _containerSpine.scale.set(0.25, 0.25);
            _containerSpine.position.set(
                    mapTargets[stageName][targetLocation].coin.x + 100,
                    mapTargets[stageName][targetLocation].coin.y
                    );

            //-- inject claim reward
            var onThisObjClicked = function () {
                $w.GameApp.IslandBusiness.collectFarmingReward(_activeWorld.id, targetLocation, function () {
                    showCharObjectTargetInEnvirontment();
                });
            };
            _containerSpine.interactive = true;
            _containerSpine.on('mousedown', onThisObjClicked);
            _containerSpine.on('touchstart', onThisObjClicked);

            _objectTargetContainer.addChild(_containerSpine);
        }


        //-- validasi island yang terbuka
        var playerInfo = $w.GameApp.rootScope.playerInfo;
        if (Number(playerInfo.currentEnvirontment) >= Number(_activeWorld.id)) {
            showTargetGold();
        }


        var regionData = $w.GameApp.IslandBusiness.getRegionData();

        if (regionData.wood.farmingStatus != 1 && regionData.wood.farmingStatus != 2) {
            showTargetWood();
        }
        if (regionData.stone.farmingStatus != 1 && regionData.stone.farmingStatus != 2) {
            showTargetStone();
        }

        //-- munculin coin
        if (regionData.wood.farmingStatus == 5) {
            showRewardCoin('wood');
            var workingchar = window.GameApp.CharServices.getPlayerCharById(regionData.wood.workingPlayerCharId);
            //console.log(workingchar);
            if (Number(workingchar.charId) === 3 && Number(workingchar.s_tc) === 0) {
                showRewardItem('wood');
            }
        }
        if (regionData.stone.farmingStatus == 5) {
            showRewardCoin('stone');
            var workingchar = window.GameApp.CharServices.getPlayerCharById(regionData.stone.workingPlayerCharId);
            if (workingchar.charId == 10) {
                showRewardDiamond('stone');
            }
        }
        if (regionData.gold.farmingStatus == 5) {
            showRewardCoin('gold');
            //showRewardDiamond('gold');
            var workingchar = window.GameApp.CharServices.getPlayerCharById(regionData.gold.workingPlayerCharId);
            //console.log(workingchar);
            if (workingchar.charId == 5) {
                showRewardDiamond('gold');
            }
        }

        _backgroundContainer.addChild(_objectTargetContainer);
    };

    var createPlayerCharAction = function (charId, callback) {
        var _charID = charId;

        var renderChar = function (loader, resources, char) {
            console.log(char.name + ' doing action ');
            var spineCharCage = new PIXI.Container();
            var spineData = resources['char_' + _charID].spineData;
            // instantiate the spine animation
            var spineChar = new PIXI.spine.Spine(spineData);
            spineChar.skeleton.setToSetupPose();
            spineChar.update(Math.random());
            spineChar.autoUpdate = true;

            // create a container for the spine animation and add the animation to it

            spineCharCage.addChild(spineChar);

            // measure the spine animation and position it inside its container to align it to the origin
            var localRect = spineChar.getLocalBounds();
            spineChar.position.set(-localRect.x, -localRect.y);

            // now we can scale, position and rotate the container as any other display object
            var scale = Math.min(((_renderer.width) * 0.7) / spineCharCage.width, ((_renderer.height) * 0.7) / spineCharCage.height);
            scale = scale / $w.devicePixelRatio;

            /**-- inject scaling **/
            switch (Number(_charID)) {
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
            //      console.log(_charID, scale);
            spineCharCage.scale.set(scale, scale);

            // once position and scaled, set the animation to play
            spineChar.state.setAnimation(0, 'Action', true);

            spineCharCage.displayGroup = window.GameApp.GameStage.displayOrder.frontLayer;
            callback(spineCharCage);
        };

        //if (!window.PIXI.loader.resources['char_' + _charID]) {
        //	var char = window.GameApp.CharServices.getChar(_charID);
        //	var iUrl = 'animation/characters/' + (String(char.name).toLowerCase()) + '/skeleton.json';

        //	console.log('load farming char from cache ' + charId);
        //	window.PIXI.loader.add('char_' + _charID, iUrl).load(renderChar);
        //} else {
        //	console.log(charId+' load farming char from cache');
        //	renderChar();
        //}


        var char = window.GameApp.CharServices.getChar(_charID);
        var iUrl = 'animation/characters/' + (String(char.name).toLowerCase()) + '/skeleton.json';

        //var loader = new PIXI.loaders.Loader();
        //loader.add('char_' + _charID, iUrl);
        //loader.load(renderChar);

        if (!window.PIXI.loader.resources['char_' + char.id]) {
            window.PIXI.loader.add('char_' + char.id, iUrl).load(function (loader, resources) {
                renderChar(loader, resources, char);
            });
        } else {

            renderChar(window.PIXI.loader, window.PIXI.loader.resources, char);
        }

        //return spineCharCage;
    };

    var showPlayerCharFarming = function () {
        var regionData = $w.GameApp.IslandBusiness.getRegionData();
        var farmingPosition = {
            atea: {
                wood: {
                    x: 875,
                    y: 1267
                },
                stone: {
                    x: 320,
                    y: 1235
                },
                gold: {
                    x: 950,
                    y: 643
                }
            },
            oidur: {
                wood: {
                    x: 500,
                    y: 1210
                },
                stone: {
                    x: 920,
                    y: 926
                },
                gold: {
                    x: 900,
                    y: 1423
                }
            },
            frusht: {
                wood: {
                    x: 847,
                    y: 871
                },
                stone: {
                    x: 451,
                    y: 1560
                },
                gold: {
                    x: 335,
                    y: 815
                }
            },
            routh: {
                wood: {
                    x: 875,
                    y: 1335
                },
                stone: {
                    x: 547,
                    y: 1515
                },
                gold: {
                    x: 271,
                    y: 1083
                }
            }
        };

        //-- reload - restart data
        _backgroundContainer.removeChild(_woodActionChar);
        _backgroundContainer.removeChild(_stoneActionChar);
        _backgroundContainer.removeChild(_goldActionChar);
        progressBarContainer.destroy();
        //_backgroundContainer.removeChild(progressBarContainer);
        progressBarContainer = new PIXI.Container();
        _backgroundContainer.addChild(progressBarContainer);

        //-- sebelum render char , normalisasikan dulu progress bar sebelumnya
        if ($w.GameApp.GameStage.progressbarEvent.length > 0) {
            for (var i = 0; i < $w.GameApp.GameStage.progressbarEvent.length; i++) {
                $w.removeEventListener('serverdatetick', $w.GameApp.GameStage.progressbarEvent[i]);
                delete $w.GameApp.GameStage.progressbarEvent[i];
            }
            $w.GameApp.GameStage.progressbarEvent = [];
        }



        if (regionData.wood.isWorking == 1) {
            var wChar = $w.GameApp.CharServices.getPlayerCharById(regionData.wood.workingPlayerCharId);
            _woodActionChar = new PIXI.Container(); console.log(regionData.wood.workingPlayerCharId);
            function wCallback(wchspine) {
                _woodActionChar.addChild(wchspine);

                //console.log(farmingPosition[String(_activeWorld.name).toLowerCase()].wood.x);
                _woodActionChar.position.x = farmingPosition[String(_activeWorld.name).toLowerCase()].wood.x - (wchspine.width);
                _woodActionChar.position.y = farmingPosition[String(_activeWorld.name).toLowerCase()].wood.y - (wchspine.height);

                //-- posisi progress bar center horizontal di antara char - pas di bawah char
                createProgressBar(_woodActionChar, 'wood');
            }

            if (regionData.wood.iwir) {
                showExploringItem('wood', wCallback);
            } else {
                createPlayerCharAction(wChar.charId, wCallback);
            }

            // add the container to the stage
            _backgroundContainer.addChild(_woodActionChar);
        }

        if (regionData.stone.isWorking == 1) {
            var sChar = $w.GameApp.CharServices.getPlayerCharById(regionData.stone.workingPlayerCharId);
            _stoneActionChar = new PIXI.Container();
            function sCallback(schspine) {
                _stoneActionChar.addChild(schspine);

                _stoneActionChar.position.x = farmingPosition[String(_activeWorld.name).toLowerCase()].stone.x - (schspine.width);
                _stoneActionChar.position.y = farmingPosition[String(_activeWorld.name).toLowerCase()].stone.y - (schspine.height);

                //-- posisi progress bar center horizontal di antara char - pas di bawah char
                createProgressBar(_stoneActionChar, 'stone');
            }
            ;

            if (regionData.stone.iwir) {
                showExploringItem('stone', sCallback);
            } else {
                createPlayerCharAction(sChar.charId, sCallback);
            }



            // add the container to the stage
            _backgroundContainer.addChild(_stoneActionChar);
        }

        if (regionData.gold.isWorking == 1) {
            var gChar = $w.GameApp.CharServices.getPlayerCharById(regionData.gold.workingPlayerCharId);
            _goldActionChar = new PIXI.Container();
            var gCallback = function (gchspine) {
                _goldActionChar.addChild(gchspine);

                _goldActionChar.position.x = farmingPosition[String(_activeWorld.name).toLowerCase()].gold.x - (gchspine.width);
                _goldActionChar.position.y = farmingPosition[String(_activeWorld.name).toLowerCase()].gold.y - (gchspine.height); // kaki si char ada di bawah pohon

                //-- posisi progress bar center horizontal di antara char - pas di bawah char
                createProgressBar(_goldActionChar, 'gold');
            };

            if (regionData.gold.iwir) {
                showExploringItem('gold', gCallback);

            } else {
                createPlayerCharAction(gChar.charId, gCallback);
            }
            console.log(regionData.gold.workingPlayerCharId);

            // add the container to the stage
            _backgroundContainer.addChild(_goldActionChar);
        }


    };

    var createProgressBar = function (pointedChar, targetName) {
        var fullbar = 150;
        var barWidth = 160;
        var barHeight = 38;
        var percent = 50;
        var output = fullbar * percent / 100;
        var regionData = $w.GameApp.IslandBusiness.getRegionData();
        var container = new PIXI.Container();
        var outerbar, innerbar;

        //-- inject text, make it center vertical-horizontal
        var durationText = String(regionData[targetName].workingSpan).replace('hours', 'HRS');
        var basicText = new PIXI.Text(durationText);
        basicText.x = (barWidth - basicText.width) / 2;
        basicText.y = (barHeight - basicText.height) / 2;

        var onThisAssetLoaded = function (loader, resources) {
            outerbar = new PIXI.Sprite(resources.outerbar.texture);
            innerbar = new PIXI.Sprite(resources.innerbar.texture);

            outerbar.height = barHeight;
            outerbar.width = barWidth;

            innerbar.width = fullbar;
            innerbar.height = 22;

            var posx = (outerbar.width - innerbar.width) / 2;
            innerbar.position.y = (outerbar.height - innerbar.height) / 2;
            innerbar.position.x = posx;
            innerbar.visible = false;

            //-- create tombol finish now
            var texture = PIXI.Texture.fromImage('asset/img/icons/FinishNow.png');
            var fnBtn = new PIXI.Sprite(texture);
            fnBtn.interactive = true;

            //-- posisi di tengah vertical = middle dari progress bar
            fnBtn.height = 60;
            fnBtn.width = 60;
            fnBtn.position.x = barWidth + 10;
            fnBtn.position.y = (barHeight - fnBtn.height) / 2;

            var onFnBtnClicked = function () {
                $w.GameApp.IslandEnviAnim.finishNowFarmingChar(targetName);
            };
            fnBtn.on('mousedown', onFnBtnClicked);
            fnBtn.on('touchstart', onFnBtnClicked);

            container.addChild(outerbar);
            container.addChild(innerbar);
            container.addChild(basicText);

            container.displayGroup = window.GameApp.GameStage.displayOrder.frontLayer;
            container.addChild(fnBtn);

            //container.scale.set(1.2, 1.2);

            //-- setelan bar di atas char
            container.position.x = (pointedChar.position.x) + ((pointedChar.width - barWidth) / 2);
            container.position.y = (pointedChar.position.y - container.height);

            progressBarContainer.addChild(container);
            $w.addEventListener('serverdatetick', hitungProgressBar);
            $w.GameApp.GameStage.progressbarEvent.push(hitungProgressBar);
        };
        var assetToLoad = [];
        var xres = window.PIXI.loader.resources;
        if (!xres['outerbar'] || !xres['outerbar'].texture) {
            delete xres['outerbar'];
            assetToLoad.push({ name: 'outerbar', url: 'asset/img/bar-outer.png' });
        }
        if (!xres['innerbar'] || !xres['innerbar'].texture) {
            delete xres['innerbar'];
            assetToLoad.push({ name: 'innerbar', url: 'asset/img/bar-inner.png' });
        }
        if (!xres['fnicon'] || !xres['fnicon'].texture) {
            delete xres['fnicon'];
            assetToLoad.push({ name: 'fnicon', url: 'asset/img/icons/FinishNow.png' });
        }

        if (assetToLoad.length > 0) {
            window.PIXI.loader.add(assetToLoad).load(onThisAssetLoaded);
        } else {
            onThisAssetLoaded(window.PIXI.loader, window.PIXI.loader.resources);
        }
        /*
         var loader = new PIXI.loaders.Loader();
         loader.add('outerbar', 'asset/img/bar-outer.png');
         loader.add('innerbar', 'asset/img/bar-inner.png');
         loader.add('fnicon', 'asset/img/icons/FinishNow.png');
         loader.load(onThisAssetLoaded);
         */

        //-- hitung percentase progress bar
        function hitungProgressBar() {
            var a = Date.parse(regionData[targetName].startWorkingOn);
            var b = Date.parse(regionData[targetName].finishWorkingOn);
            var c = $w.GameApp.dateDiff(a, b);
            var d = $w.GameApp.getTimeRemaining(b);
            var totalfull = c.total;
            var totalcurrent = d.total;

            percent = (totalfull - totalcurrent) / totalfull * 100;
            output = (fullbar - 2) * percent / 100;

            innerbar.width = output;
            innerbar.visible = true;

            //-- jika udah selesai kerja, maka otomatis cek data server lagi
            if (d.total < 0) {
                $w.GameApp.IslandBusiness.fetchRegionData(_activeWorld.id, function () {
                    displayAllAboutChar();
                    $w.removeEventListener('serverdatetick', hitungProgressBar);
                });
            }
            //console.log('progressbar tick');
        }

    };

    var displayAllAboutChar = function () {
        showCharObjectTargetInEnvirontment();
        showCharInEnvirontment();
        showPlayerCharFarming();
    };

    var actionChar = function (_targetName, actionName) {
        if (actionName == 'none') {
            return;
        }

        var regionData = $w.GameApp.IslandBusiness.getRegionData();
        var ratingSpeed = {
            slow: 1,
            medium: 2,
            rapid: 3
        };
        var targetName = _targetName;

        function isCharWorking(charId) {
            if (regionData.wood.workingPlayerCharId == value.id && regionData.wood.isWorking == 1) {
                return true;
            }
        }
        function onAfterSendingRequestToServer() {
            $w.GameApp.GameStage.reloadChar();
        }


        switch (actionName) {
            case 'exploring':
                var regionId = _activeWorld.id;
                var abilityName = 'explorer';
                var availableChars = [];
                var theBestChar = {};

                //-- cari the best char untuk exploring
                var eChars = $w.GameApp.CharServices.getEnviPlayerChar(_activeWorld.id);
                var idx = 0;
                $.each(eChars, function (index, value) {
                    var targets = value.action.target;
                    var abilities = value.action.ability;
                    var isCharWorking = false;

                    //-- pastikan char yang di pilih bukan yang lagi kerja juga
                    //if (regionData.wood.workingPlayerCharId == value.id
                    //  || regionData.stone.workingPlayerCharId == value.id
                    //  || regionData.gold.workingPlayerCharId == value.id) {
                    //	isCharWorking = true;
                    //}


                    //-- cek target dan ability yang sesuai
                    //if (abilities.indexOf('explorer') >= 0
                    //	&& targets.indexOf(targetName) >= 0 && !isCharWorking) {
                    //	availableChars.push(value);

                    //	if (availableChars.length > 1) {
                    //		var rating1 = Number(ratingSpeed[String(value.speed).toLowerCase()]);
                    //		var rating2 = Number(ratingSpeed[String(theBestChar.speed).toLowerCase()]);
                    //		if (rating1 > rating2) {
                    //			theBestChar = value;
                    //		}
                    //	} else {
                    //		theBestChar = value;
                    //	}
                    //}

                    var isCharAvailable = window.GameApp.IslandBusiness.checkAvailabilityChar(value, targetName, abilityName);
                    //-- inject validasi nyawa char
                    var isLifespanEnough = $w.GameApp.IslandEnviAnim.validateIsLifespanCharCanWorking(value.id);
                    if (isCharAvailable && isLifespanEnough) {
                        availableChars.push(value);
                        if (availableChars.length > 1) {
                            var rating1 = Number(ratingSpeed[String(value.speed).toLowerCase()]);
                            var rating2 = Number(ratingSpeed[String(theBestChar.speed).toLowerCase()]);
                            if (rating1 > rating2) {
                                theBestChar = value;
                            }
                        } else {
                            theBestChar = value;
                        }
                    }

                    //-- identifikasi jika char sudah selesai di cek semua
                    idx = index + 1;
                    if (idx >= eChars.length) {
                        $w.GameApp.IslandBusiness.setupFarming(regionId, theBestChar.id, targetName, abilityName, onAfterSendingRequestToServer);
                    }
                });

                break;
            case 'destroying':
                var regionId = _activeWorld.id;
                var abilityName = 'destroyer';
                var availableChars = [];
                var theBestChar = {};

                //console.log(_targetName, actionName);

                //-- cari the best char untuk destroying
                var eChars = $w.GameApp.CharServices.getEnviPlayerChar(_activeWorld.id);
                var idx = 0;
                $.each(eChars, function (index, value) {
                    var targets = value.action.target;
                    var abilities = value.action.ability;
                    var isCharWorking = false;

                    //-- pastikan char yang di pilih bukan yang lagi kerja juga
                    //if (regionData.wood.workingPlayerCharId == value.id
                    //  || regionData.stone.workingPlayerCharId == value.id
                    //  || regionData.gold.workingPlayerCharId == value.id) {
                    //	isCharWorking = true;
                    //}


                    //-- cek target dan ability yang sesuai
                    //if (abilities.indexOf('destroyer') >= 0
                    //	&& targets.indexOf(targetName) >= 0 && !isCharWorking) {
                    //	availableChars.push(value);

                    //	if (availableChars.length > 1) {
                    //		var rating1 = Number(ratingSpeed[String(value.speed).toLowerCase()]);
                    //		var rating2 = Number(ratingSpeed[String(theBestChar.speed).toLowerCase()]);
                    //		if (rating1 > rating2) {
                    //			theBestChar = value;
                    //		}
                    //	} else {
                    //		theBestChar = value;
                    //	}
                    //}


                    var isCharAvailable = window.GameApp.IslandBusiness.checkAvailabilityChar(value, targetName, abilityName);
                    //-- inject validasi nyawa char
                    var isLifespanEnough = $w.GameApp.IslandEnviAnim.validateIsLifespanCharCanWorking(value.id);
                    if (isCharAvailable && isLifespanEnough) {
                        availableChars.push(value);
                        if (availableChars.length > 1) {
                            var rating1 = Number(ratingSpeed[String(value.speed).toLowerCase()]);
                            var rating2 = Number(ratingSpeed[String(theBestChar.speed).toLowerCase()]);
                            if (rating1 > rating2) {
                                theBestChar = value;
                            }
                        } else {
                            theBestChar = value;
                        }
                    }

                    //-- identifikasi jika char sudah selesai di cek semua
                    idx = index + 1;
                    if (idx >= eChars.length) {
                        //-- validasi dulu umur char cukup gak melakukan farming
                        $w.GameApp.IslandBusiness.setupFarming(regionId, theBestChar.id, targetName, abilityName, onAfterSendingRequestToServer);
                    }
                });

                break;
            case 'finishnow':
                $w.GameApp.IslandEnviAnim.finishNowFarmingChar(targetName);
                break;
            case 'collecreward':
                console.log('collect reward');
                break;
        }


    };

    var showExploringItem = function (targetName, callback) {
        var equipm = {};
        switch (targetName) {
            case 'wood':
                equipm = $w.GameApp.IslandServices.getEquipItem(5);
                break;
            case 'stone':
                equipm = $w.GameApp.IslandServices.getEquipItem(7);
                break;
            case 'gold':
                equipm = $w.GameApp.IslandServices.getEquipItem(6);
                break;
        }

        function renderObj(loader, resources) {
            var eobj = new PIXI.Sprite(resources['equipm_' + equipm.id].texture);
            var container1 = new PIXI.Container();

            container1.addChild(eobj);
            container1.scale.set(0.5, 0.5);

            callback(container1);
        }


        if (!window.PIXI.loader.resources['equipm_' + equipm.id]) {
            window.PIXI.loader.add('equipm_' + equipm.id, equipm.imageUrl[0]).load(function (loader, resources) {
                renderObj(loader, resources);
            });
        } else {
            renderObj(window.PIXI.loader, window.PIXI.loader.resources);
        }
    };

    var newDisplayOrder = function () {
        _backgroundContainer.displayList = new PIXI.DisplayList();
        gs.displayOrder = {
            backLayer: new PIXI.DisplayGroup(1, true),
            middleLayer: new PIXI.DisplayGroup(2, false),
            frontLayer: new PIXI.DisplayGroup(3, true),
            topLayer: new PIXI.DisplayGroup(4, true)
        }
    };

    var createMiniGameIcon = function (regionId) {
        var locationInMap = (function () {
            var loc = [];

            //-- atea
            loc[0] = { x: 636, y: 1363 };

            //-- oidur
            loc[1] = { x: 671, y: 1670 };

            //-- frusht
            loc[2] = { x: 333, y: 231 };

            //-- routh
            loc[3] = { x: 709, y: 425 };

            return loc[regionId - 1];
        })();
        var res = $w.PIXI.loader.resources;
        var wrapper = new window.PIXI.Container();
        var containerEnergy = new window.PIXI.Container();
        var assets = [
            { name: 'minigamePlay', url: 'minigame/assets/playme_' + regionId + '.png' },
            { name: 'minigameEnergy', url: 'minigame/assets/energy-playbutton.png' },
            { name: 'minigameFn', url: 'minigame/assets/fn-button.png' },
            { name: 'minigameFillEnergy', url: 'minigame/assets/energy-fill-playbottun.png' }
        ];
        var assetToload = [];
        var renderEnergy = function () {
            var playButton = wrapper.children[0];
            var containerTop = wrapper.children[1];
            var fn = containerTop.children[1];
            var totalEnergy = Number($w.GameApp.MinigameData.totalEnergy);

            if (totalEnergy == 5) {
                fn.visible = false;
            } else {
                fn.visible = true;
            }

            containerEnergy.removeChildren(0, containerEnergy.children.length);
            for (var i = 0; i < totalEnergy; i++) {
                var textureFill = new PIXI.Sprite($w.PIXI.loader.resources.minigameFillEnergy.texture);
                containerEnergy.addChild(textureFill);
                textureFill.position.y += 10;
                textureFill.position.x = 12 + (i * (textureFill.width + 1.5));
            }
        };
        var onAssetLoaded = function (loader, resources) {
            var texturePlay = (function () {
                var texturePlay = new PIXI.Sprite(resources.minigamePlay.texture);
                texturePlay.interactive = true;
                texturePlay.on('tap', $w.GameApp.IslandEnviAnim.minigame.enterGame);
                texturePlay.on('click', $w.GameApp.IslandEnviAnim.minigame.enterGame);
                return texturePlay;
            })();
            var containerTop = (function () {
                var containerTop = new $w.PIXI.Container();
                var containerBar = (function () {
                    //-- energy
                    var containerBar = new $w.PIXI.Container();
                    var textureBar = (function () {
                        var textureBar = new PIXI.Sprite(resources.minigameEnergy.texture);

                        return textureBar;
                    })();


                    containerBar.addChild(textureBar);
                    containerBar.addChild(containerEnergy);

                    return containerBar;
                })();
                var textureFn = (function () {
                    var textureFn = new PIXI.Sprite(resources.minigameFn.texture);
                    var fnEvent = function () {
                        $w.GameApp.IslandEnviAnim.minigame.fnEnergy(renderEnergy);
                    };
                    textureFn.interactive = true;
                    textureFn.on('tap', fnEvent);
                    textureFn.on('click', fnEvent);

                    textureFn.position.x = containerBar.position.x + containerBar.width + 10;
                    textureFn.position.y = containerBar.position.y + ((containerBar.height - textureFn.height) / 2);

                    return textureFn;
                })();

                containerTop.addChild(containerBar);
                containerTop.addChild(textureFn);

                //containerTop.position.x = texturePlay.position.x + ((texturePlay.width - containerTop.width) / 2);
                containerTop.position.y = texturePlay.position.y - (containerBar.height + 10);

                return containerTop;
            })();
            //texturePlay.name = 'playButton';


            wrapper.addChild(texturePlay);
            wrapper.addChild(containerTop);

            wrapper.position.x = locationInMap.x;
            wrapper.position.y = locationInMap.y + (texturePlay.position.y);

            renderEnergy();
            /*
            var timer = 0;
            var thisTickerEvent = function () {
                timer++;
                if (timer % 5 == 0) {
                    totalEnergy += 1;
                    if (totalEnergy > 5) {
                        totalEnergy = 0;
                    }
                    renderEnergy();
                }
            };
            $w.addEventListener('serverdatetick', thisTickerEvent);
            $w.GameApp.GameStage.energyEvent.push(thisTickerEvent);
            */
        };

        var playerInfo = $w.izyObject('PlayerInfo').getOne();

        //-- validasi jika region belum terbuka, maka gak ada mini game
        if (Number(playerInfo.currentEnvirontment) < Number(_activeWorld.id)) {
            return;
        }

        //-- reset playme txture
        $w.PIXI.loader.resources['minigamePlay'] = null;
        for (var i = 0; i < assets.length; i++) {
            if (!$w.PIXI.loader.resources[assets[i].name] || !$w.PIXI.loader.resources[assets[i].name].texture) {
                delete $w.PIXI.loader.resources[assets[i].name];
                assetToload.push(assets[i]);
            }
        }

        var initAsset = function () {
            if (assetToload.length > 0) {
                $w.PIXI.loader.add(assetToload).load(onAssetLoaded);
                console.log('download minigame asset');
            } else {
                onAssetLoaded($w.PIXI.loader, $w.PIXI.loader.resources);
                console.log('directly render minigame asset');
            }
        };
        var fetchServerData = function () {
            var req = $w.GameApp.http.post($w.GameApp.serverURL + '/minigame/fetchdata', { regionId: _activeWorld.id });
            req.success(function (res) {
                $w.GameApp.MinigameData = Object(res.MinigameData);
                $w.GameApp.MinigameSettings = Object(res.Settings);
                initAsset();
            });
        };

        fetchServerData();
        newDisplayOrder();
        wrapper.displayGroup = gs.displayOrder.frontLayer;
        _backgroundContainer.addChild(wrapper);
    };

    world.Atea = function (callbackFunction) {
        _decorMapLocations = [
            { id: 1, x: 110, y: 1679, area: 'land', scale: 0.95 },
            { id: 2, x: 437, y: 885, area: 'land', scale: 0.75 },
            { id: 3, x: 75, y: 598, area: 'land', scale: 0.60 },
            { id: 4, x: 421, y: 426, area: 'land', scale: 0.55 },
            { id: 5, x: 406, y: 90, area: 'air', scale: 0.90 }
        ];
        _backgroundContainer = new PIXI.Container();

        var rendering = function () {
            var spinebg = new PIXI.spine.Spine(_resources.atea.spineData);
            spinebg.skeleton.setToSetupPose();
            spinebg.update(0);
            spinebg.autoUpdate = true;
            spinebg.state.setAnimation(0, _resources.atea.spineData.animations[0].name, true);
            //spinebg.state.timeScale = 0.1;

            _backgroundContainer.addChild(spinebg);

            var localRect = spinebg.getLocalBounds();
            spinebg.position.set(-localRect.x, -localRect.y);

            var scale = Math.min((_renderer.width) / _backgroundContainer.width, (_renderer.height) / _backgroundContainer.height);
            scale = scale / $w.devicePixelRatio;
            _backgroundContainer.scale.set(scale, scale);


            //_backgroundContainer.addChild(_decorContainer);
            _containerStage.addChild(_backgroundContainer);

            (function () {
                var iconContainer = new $w.PIXI.Container();
                var showMinigameCb = function () {
                    var playicon = new createMiniGameIcon();
                    //playicon.position.set(687, 1363);
                    playicon.position.set(687, 500);
                    playicon.scale.set(scale, scale);
                    iconContainer.addChild(playicon);
                };
                var errorCount = 0;
                var maxErrorPermited = 120;
                var sendToServer = function () {
                    var req = $w.GameApp.http.post($w.GameApp.serverURL + '/minigame/fetchdata', { regionId: _activeWorld.id });
                    req.success(function (res) {
                        $w.GameApp.MinigameData = Object(res.MinigameData);
                        showMinigameCb();
                    });
                    req.error(function () {
                        errorCount++;
                        $w.navigator.notification.alert('Failed to load Mini Game.');
                    });
                };
                _backgroundContainer.addChild(iconContainer);
            });
            
            callbackFunction();
        }

        if (!_resources.atea) {
            var iUrl = 'animation/atea/skeleton.json';
            window.PIXI.loader.add('atea', iUrl).load(rendering);
        } else {
            rendering();
        }

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

        var rendering = function () {
            var spinebg = new PIXI.spine.Spine(_resources.oidur.spineData);
            spinebg.skeleton.setToSetupPose();
            spinebg.update(0);
            spinebg.autoUpdate = true;
            spinebg.state.setAnimation(0, _resources.oidur.spineData.animations[0].name, true);
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

        if (!_resources.oidur) {
            var iUrl = 'animation/oidur/skeleton.json';
            window.PIXI.loader.add('oidur', iUrl).load(rendering);
        } else {
            rendering();
        }

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

        var rendering = function () {
            var spinebg = new PIXI.spine.Spine(_resources.frusht.spineData);
            spinebg.skeleton.setToSetupPose();
            spinebg.update(0);
            spinebg.autoUpdate = true;
            spinebg.state.setAnimation(0, _resources.frusht.spineData.animations[0].name, false);
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


        if (!_resources.frusht) {
            var iUrl = 'animation/frusht/skeleton.json';
            window.PIXI.loader.add('frusht', iUrl).load(rendering);
        } else {
            rendering();
        }
    };
    world.Routh = function (callbackFunction) {
        _decorMapLocations = [
            { id: 1, x: 133, y: 1768, area: 'land', scale: 0.95 },
            { id: 2, x: 696, y: 800, area: 'land', scale: 0.65 },
            { id: 3, x: 425, y: 578, area: 'land', scale: 0.60 },
            { id: 4, x: 66, y: 470, area: 'land', scale: 0.55 },
            { id: 5, x: 265, y: 109, area: 'air', scale: 0.90 }
        ];
        _backgroundContainer = new PIXI.Container();

        var rendering = function () {
            var spinebg = new PIXI.spine.Spine(_resources.routh.spineData);
            spinebg.skeleton.setToSetupPose();
            spinebg.update(0);
            spinebg.autoUpdate = true;
            spinebg.state.setAnimation(0, _resources.routh.spineData.animations[0].name, true);
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


        if (!_resources.routh) {
            var iUrl = 'animation/routh/skeleton.json';
            window.PIXI.loader.add('routh', iUrl).load(rendering);
        } else {
            rendering();
        }

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

        //-- normalisasi event timer energy
        for (var i = 0; i < $w.GameApp.GameStage.energyEvent.length; i++) {
            $w.removeEventListener('serverdatetick', $w.GameApp.GameStage.energyEvent[i]);
            delete $w.GameApp.GameStage.energyEvent[i];
        }
        $w.GameApp.GameStage.energyEvent = [];

        //-- searching data island yg dituju
        for (var i = 0; i < dataisland.length; i++) {
            if (dataisland[i].name === name) {
                _activeWorld = dataisland[i];
                break;
            }
        }

        if (_backgroundContainer.destroy) {
            _backgroundContainer.destroy();
        }
        world[_activeWorld.name](function () {
            newDisplayOrder();
            _backgroundContainer.addChild(progressBarContainer);
            showDecorInEnvirontment();
            displayAllAboutChar();
            createMiniGameIcon(Number(_activeWorld.id));
        });

        gs.backgroundContainer = _backgroundContainer;
        gs.charContainer = _charContainer;
        gs.renderer = _renderer;
    };
    gs.refreshChar = function () {
        showCharInEnvirontment();
    };
    gs.putDecorItemToEnvirontment = function (decorId, callback) {
        callbackDecor = callback;
        _selectedDecorItem = $w.GameApp.IslandServices.getDecorItem(decorId);
        $w.GameApp.IslandEnviAnim.draggingMode.on();

        showDecorHolder();
    };
    gs.backgroundContainer = _backgroundContainer;
    gs.reloadChar = displayAllAboutChar;
    gs.actionChar = actionChar;
    gs.decorContainer = _decorContainer;
    gs.displayOrder = {
        backLayer: {},
        middleLayer: {},
        frontLayer: {},
        topLayer: {}
    };
    gs.progressbarEvent = [];
    gs.energyEvent = [];

    /**-- for walking char business */
    gs.charContainer = _charContainer;
    gs.renderer = _renderer;
    /**-- */

    $w.GameApp.GameStage = gs;
})(window);