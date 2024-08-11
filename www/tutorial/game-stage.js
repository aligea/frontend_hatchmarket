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
            var _backgroundContainer = new PIXI.Container();

            var _charContainer = new PIXI.Container();
            var _objectTargetContainer = new PIXI.Container();

            var _woodActionChar, _stoneActionChar, _goldActionChar;

            var progressBarContainer = new PIXI.Container();

            var callbackDecor;

            function ___createFountain(container) {
                var resources = $w.PIXI.loader.resources;
                var fountain = new PIXI.spine.Spine(resources.fountainAtea.spineData);
                fountain.skeleton.setToSetupPose();
                fountain.update(0);
                fountain.autoUpdate = true;
                fountain.state.setAnimation(0, 'Fountain', true);
                fountain.state.timeScale = 1;


                // create a container for the spine animation and add the animation to it
                var fountainCont = new PIXI.Container();
                fountainCont.addChild(fountain);
                fountainCont.position.set(230, 450);

                container.addChild(fountainCont);
            }
            ;

            function ___createCloud(container) {
                var cloud = new PIXI.spine.Spine(_resources.cloudSkeleton.spineData);
                cloud.skeleton.setToSetupPose();
                cloud.update(0);
                cloud.autoUpdate = true;
                cloud.state.setAnimation(0, 'Awan_1', true);
                cloud.state.timeScale = 1;

                var cloudContainer = new PIXI.Container();
                cloudContainer.addChild(cloud);
                cloudContainer.position.set(400, 100);


                container.addChild(cloudContainer);
            }
            ;

            function isDecorPathLocationAvailable(path) {
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
            }
            ;

            function __onSelectedPathDecorLocation(holder, path) {
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
                    holder: {x: holder.x, y: holder.y, height: holder.height, width: holder.width}
                }
                console.log(itemDecoration);
                //_activeWorld.decorationItems.push(itemDecoration);

                //IslandServices.saveDecorationInEnvirontment('Atea', Environtments.Atea.decorationItems);
                //$w.GameApp.IslandServices.saveDecorationInEnvirontment(_activeWorld.name, _activeWorld.decorationItems);

                function callbackSuccess() {
                    showDecorInEnvirontment();

                    //-- reset holder container 
                    _backgroundContainer.removeChild(_holderContainer);
                    _holderContainer = new PIXI.Container();
                }

                $w.GameApp.IslandBusiness.purchasingDecoration(_activeWorld.id, itemDecoration, callbackSuccess);
            }
            ;

            function onSelectedPathDecorLocation(holder, path) {
                //-- save decor to server with this path
                var itemDecoration = {
                    decorItem: _selectedDecorItem,
                    path: path,
                    holder: {x: holder.x, y: holder.y, height: holder.height, width: holder.width}
                }
                //console.log(itemDecoration);

                function callbackSuccess() {
                    window.GameApp.rootScope.reloadPlayerData(function () {
                        window.GameApp.IslandBusiness.fetchRegionData(_activeWorld.id, function () {
                            //var regiondata = window.GameApp.IslandBusiness.getRegionData();
                            //console.log(regiondata);
                            showDecorInEnvirontment();
                            //-- reset holder container 
                            _backgroundContainer.removeChild(_holderContainer);
                            _holderContainer = new PIXI.Container();
                        });
                    });

                }

                if (typeof (callbackDecor) == 'function') {
                    callbackDecor(itemDecoration, callbackSuccess);
                } else {
                    $w.GameApp.IslandBusiness.purchasingDecoration(_activeWorld.id, itemDecoration, callbackSuccess);
                }

            }
            ;

            function showDecorHolder() {
                var paths = _decorMapLocations;
                _holderContainer.destroy();
                _holderContainer = new $w.PIXI.Container();

                paths.forEach(function (path) {
                    if (!path.x)
                        return;
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

                _holderContainer.displayGroup = window.GameApp.GameStage.displayOrder.frontLayer;
                _backgroundContainer.addChild(_holderContainer);
            }
            ;

            function __showDecorInEnvirontment() {
                _backgroundContainer.removeChild(_decorContainer);
                _decorContainer = new PIXI.Container();

                //Environtments.Atea.decorationItems = IslandServices.fetchDecorationItems('Atea');
                var decorationItems = $w.GameApp.IslandBusiness.getDecorationData();
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

                    console.log(decorSprite);
                    _decorContainer.addChild(decorSprite);
                }
                ;

                _backgroundContainer.addChild(_decorContainer);
                $w.GameApp.IslandEnviAnim.draggingMode.off();
            }
            ;
            function showDecorInEnvirontment() {
                _backgroundContainer.removeChild(_decorContainer);
                _decorContainer = new PIXI.Container();
                //_decorContainer.displayGroup = $w.GameApp.GameStage.displayOrder.backLayer;
                //Environtments.Atea.decorationItems = IslandServices.fetchDecorationItems('Atea');
                var decorationItems = $w.GameApp.IslandBusiness.getDecorationData();

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
                    ;

                    var loader = new PIXI.loaders.Loader();
                    loader.add('decorItem-' + decorItem.id, imageUrl);
                    loader.load(renderDecoration);

                    //if (!window.PIXI.loader.resources['decorItem-' + decorItem.id]) {
                    //	$w.PIXI.loader.add('decorItem-' + decorItem.id, imageUrl).load(renderDecoration);
                    //} else {
                    //	renderDecoration(window.PIXI.loader, window.PIXI.loader.resources);
                    //}
                });

                _backgroundContainer.addChild(_decorContainer);

                $w.GameApp.IslandEnviAnim.draggingMode.off();
               
            }
            ;
            function createBlur(container) {
                function showDetailInsland() {
                    scopeEnvi.island = activeEnvi;
                    scopeEnvi.myPopup = myPopup.show({
                        title: activeEnvi.name,
                        subTitle: activeEnvi.description,
                        templateUrl: 'templates/popup-detail-environtment.html',
                        scope: scopeEnvi
                    });
                }
                ;

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
            }
            ;

            var isOpening = false;
            function onClickWalkingChar(event) {
                if (isOpening) {
                    return;
                }
                event.stopPropagation();
                isOpening = true;
                $w.GameApp.IslandEnviAnim.showDetailActiveChar(this.char.pcid);
                isOpening = false;
            }
            ;
            function showCharInEnvirontment() {
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

                //function _putCharToIsland(pchar) {
                //	var thisChar = Object(pchar);
                //	var _charID = thisChar.char_id;

                //	var sChr = Object(window.PIXI.loader.resources['char_' + _charID]);
                //	var temp = {};
                //	function renderChar(loader, resources) {
                //		//console.log(window.PIXI.loader.resources['char_' + _charID]);
                //		var spineData = resources['char_' + _charID].spineData;

                //		// instantiate the spine animation
                //		temp['pchr' + indexCharInWorld] = spineData;
                //		var spineChar = new PIXI.spine.Spine(temp['pchr' + indexCharInWorld]);
                //		spineChar.skeleton.setToSetupPose();
                //		spineChar.update(Math.random());
                //		spineChar.autoUpdate = true;

                //		// create a container for the spine animation and add the animation to it
                //		var spineCharCage = new PIXI.Container();
                //		spineCharCage.addChild(spineChar);

                //		// measure the spine animation and position it inside its container to align it to the origin
                //		var localRect = spineChar.getLocalBounds();
                //		spineChar.position.set(-localRect.x, -localRect.y);

                //		// now we can scale, position and rotate the container as any other display object
                //		var scale = Math.min(((_renderer.width) * 0.7) / spineCharCage.width, ((_renderer.height) * 0.7) / spineCharCage.height);
                //		scale = scale / $w.devicePixelRatio;

                //		/**-- inject scaling **/
                //		switch (Number(_charID)) {
                //			case 2:
                //				scale = 0.45;
                //				break;
                //			case 3:
                //				scale = 0.45;
                //				break;
                //			case 4:
                //				scale = 0.4;
                //				break;
                //			case 6:
                //				scale = 0.45;
                //				break;
                //			case 8:
                //				scale = 1;
                //				break;
                //			case 10:
                //				scale = 0.5;
                //				break;
                //			case 11:
                //				scale = 0.4;
                //				break;
                //			case 13:
                //				scale = 0.35;
                //				break;
                //			case 14:
                //				scale = 0.4;
                //				break;
                //			case 17:
                //				scale = 0.4;
                //				break;
                //			case 18:
                //				scale = 0.4;
                //				break;
                //			default:
                //				scale = 0.5;
                //		}
                //		//      console.log(_charID, scale);
                //		spineCharCage.scale.set(scale, scale);

                //		// once position and scaled, set the animation to play
                //		spineChar.state.setAnimation(0, spineData.animations[2].name, true);

                //		//-- inject untuk mempermudah testing
                //		spineCharCage.charName = thisChar.name;

                //		$w.GameApp.currentWalking = new $w.GameApp.Walking(spineCharCage, _activeWorld, indexCharInWorld);
                //		$w.GameApp.currentWalking.move();

                //		//new $w.GameApp.Walking(spineCharCage, _activeWorld, i).move();
                //		//array.push(walking);
                //		_charContainer.addChild(spineCharCage);
                //		indexCharInWorld++;
                //	};

                //	//if (!window.PIXI.loader.resources['char_' + _charID]) {
                //	//	var char = window.GameApp.CharServices.getChar(_charID);
                //	//	var iUrl = 'animation/characters/' + (String(char.name).toLowerCase()) + '/skeleton.json';
                //	//	//console.log('new char ' + _charID);
                //	//	//window.PIXI.loader.add('char_' + _charID, iUrl).load(renderChar);
                //	//	var a = window.PIXI.loader.add('char_' + _charID, iUrl);

                //	//} else {
                //	//	console.log(_charID + ' load from cache');
                //	//	renderChar();
                //	//}


                //	var char = window.GameApp.CharServices.getChar(_charID);
                //	var iUrl = 'animation/characters/' + (String(char.name).toLowerCase()) + '/skeleton.json';
                //	var loader = new PIXI.loaders.Loader();
                //	loader.add('char_' + _charID, iUrl);
                //	loader.load(renderChar);

                //};



                //var ctx = 0;
                function renderChar(loader, resources, char) {
                    //console.log(window.PIXI.loader.resources['char_' + _charID]);
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
                    //spineChar.interactiveChildren = false;
                    //spineChar.interactive = true;
                    //spineChar.on('tap', function () {
                    //    console.log(this);
                    //});


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
                ;

                //$.each(charsInEnvi, function (key, thisChar) {
                //	//-- inject, biar char yang lagi kerja gak masuk sini
                //	if (thisChar.id == regionData.wood.workingPlayerCharId && regionData.wood.isWorking == 1) {
                //		return true;
                //	}
                //	if (thisChar.id == regionData.stone.workingPlayerCharId && regionData.stone.isWorking == 1) {
                //		return true;
                //	}
                //	if (thisChar.id == regionData.gold.workingPlayerCharId && regionData.gold.isWorking == 1) {
                //		return true;
                //	}

                //	//_putCharToIsland(thisChar);
                //	var char = window.GameApp.CharServices.getChar(thisChar.char_id);
                //	var iUrl = 'animation/characters/' + (String(char.name).toLowerCase()) + '/skeleton.json';

                //	char.pcid = thisChar.id;
                //	if (!window.PIXI.loader.resources['char_' + char.id]) {
                //		window.PIXI.loader.add('char_' + char.id, iUrl).load(function (loader, resources) {
                //			renderChar(loader, resources, char);
                //		});
                //	} else {
                //		renderChar(window.PIXI.loader, window.PIXI.loader.resources, char);
                //	}
                //	//console.log('loading '+char.name);
                //	//xloader.add('char_'+char.id, iUrl);
                //	//xloader.charId = thisChar.char_id;
                //	//xloader.load(renderChar);
                //	//ctx++;

                //	gs.charContainer = _charContainer;
                //});

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

                    //_putCharToIsland(thisChar);
                    var char = window.GameApp.CharServices.getChar(thisChar.char_id);
                    var iUrl = 'animation/characters/' + (String(char.name).toLowerCase()) + '/skeleton.json';

                    char.pcid = thisChar.id;
                    if (!window.PIXI.loader.resources['char_' + char.id]) {
                        window.PIXI.loader.add('char_' + char.id, iUrl).load(function (loader, resources) {
                            renderChar(loader, resources, char);
                        });
                    } else {
                        renderChar(window.PIXI.loader, window.PIXI.loader.resources, char);
                    }
                    //console.log('loading '+char.name);
                    //xloader.add('char_'+char.id, iUrl);
                    //xloader.charId = thisChar.char_id;
                    //xloader.load(renderChar);
                    //ctx++;

                    gs.charContainer = _charContainer;
                }

                //for (var k = 0 ; k < charsInEnvi.length; k++) {
                //	var thisChar = Object(charsInEnvi[k]);

                //	//-- inject, biar char yang lagi kerja gak masuk sini
                //	if (thisChar.id == regionData.wood.workingPlayerCharId) {
                //		continue;
                //	}
                //	if (thisChar.id == regionData.stone.workingPlayerCharId) {
                //		continue;
                //	}
                //	if (thisChar.id == regionData.gold.workingPlayerCharId) {
                //		continue;
                //	}

                //	_putCharToIsland(charsInEnvi[k]);
                //}


                // add the container to the stage
                _charContainer.interactive = true;
                _backgroundContainer.addChild(_charContainer);
            }
            ;

            function showCharObjectTargetInEnvirontment() {
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
                ;

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
                ;

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
                ;

                function showRewardCoin(targetLocation) {
                    var _spineData = _resources.targetCoin.spineData;
                    var _spineObj = new PIXI.spine.Spine(_spineData);
                    var _containerSpine = new PIXI.Container();
                    ;
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
                    _containerSpine.interactive = true;
                    _containerSpine.on('tap', function () {
                        //console.log('do something with target ' + targetLocation);

                        $w.GameApp.IslandBusiness.collectFarmingReward(_activeWorld.id, targetLocation, function () {
                            showCharObjectTargetInEnvirontment();
                        });
                    });


                    _objectTargetContainer.addChild(_containerSpine);
                }
                ;
                function showRewardItem(targetLocation) {
                    var _spineData = _resources.targetCoin.spineData;
                    var _spineObj = new PIXI.spine.Spine(_spineData);
                    var _containerSpine = new PIXI.Container();
                    ;
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
                    _containerSpine.interactive = true;
                    _containerSpine.on('tap', function () {
                        //console.log('do something with target ' + targetLocation);

                        $w.GameApp.IslandBusiness.collectFarmingReward(_activeWorld.id, targetLocation, function () {
                            showCharObjectTargetInEnvirontment();
                        });
                    });


                    _objectTargetContainer.addChild(_containerSpine);
                }
                ;
                function showRewardDiamond(targetLocation) {
                    var _spineData = _resources.targetCoin.spineData;
                    var _spineObj = new PIXI.spine.Spine(_spineData);
                    var _containerSpine = new PIXI.Container();
                    ;
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
                    _containerSpine.interactive = true;
                    _containerSpine.on('tap', function () {
                        //console.log('do something with target ' + targetLocation);

                        $w.GameApp.IslandBusiness.collectFarmingReward(_activeWorld.id, targetLocation, function () {
                            showCharObjectTargetInEnvirontment();
                        });
                    });


                    _objectTargetContainer.addChild(_containerSpine);
                }
                ;

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
                    //console.log(regionData.wood.workingPlayerCharId);
                    if (workingchar.charId == 3 && workingchar.s_tc == 0) {
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
            }
            ;

            function createPlayerCharAction(charId, callback) {
                var _charID = charId;

                function renderChar(loader, resources, char) {
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
                    if (spineChar.state.hasAnimation('Action')) {
                        spineChar.state.setAnimation(0, 'Action', true);
                    } else {
                        spineChar.state.setAnimation(0, 'Idle', true);
                    }

                    spineCharCage.displayGroup = window.GameApp.GameStage.displayOrder.frontLayer;
                    callback(spineCharCage);
                }
                ;

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
            }
            ;

            function showPlayerCharFarming() {
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
                //console.log(regionData);
                if (regionData.wood.isWorking == 1) {
                    var wChar = $w.GameApp.CharServices.getPlayerCharById(regionData.wood.workingPlayerCharId);
                    _woodActionChar = new PIXI.Container();
                    function wCallback(wchspine) {
                        _woodActionChar.addChild(wchspine);

                        //console.log(farmingPosition[String(_activeWorld.name).toLowerCase()].wood.x);
                        _woodActionChar.position.x = farmingPosition[String(_activeWorld.name).toLowerCase()].wood.x - (wchspine.width);
                        _woodActionChar.position.y = farmingPosition[String(_activeWorld.name).toLowerCase()].wood.y - (wchspine.height);

                        //-- posisi progress bar center horizontal di antara char - pas di bawah char
                        createProgressBar(_woodActionChar, 'wood');
                    }
                    ;
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
                    function gCallback(gchspine) {
                        _goldActionChar.addChild(gchspine);

                        _goldActionChar.position.x = farmingPosition[String(_activeWorld.name).toLowerCase()].gold.x - (gchspine.width);
                        _goldActionChar.position.y = farmingPosition[String(_activeWorld.name).toLowerCase()].gold.y - (gchspine.height); // kaki si char ada di bawah pohon

                        //-- posisi progress bar center horizontal di antara char - pas di bawah char
                        createProgressBar(_goldActionChar, 'gold');
                    }
                    ;

                    if (regionData.gold.iwir) {
                        showExploringItem('gold', gCallback);

                    } else {
                        createPlayerCharAction(gChar.charId, gCallback);
                    }

                    // add the container to the stage
                    _backgroundContainer.addChild(_goldActionChar);
                }


            }
            ;

            function __createProgressBar(pointedChar, targetName) {
                var graphics = new PIXI.Graphics();
                var graphic = new PIXI.Graphics();

                var fullbar = 150;
                var barWidth = 160;
                var barHeight = 40;
                var percent = 50;
                var output = fullbar * percent / 100;
                var regionData = $w.GameApp.IslandBusiness.getRegionData();
                var container = new PIXI.Container();


                //-- inject text, make it center vertical-horizontal
                var durationText = String(regionData[targetName].workingSpan).replace('hours', 'HRS');
                var basicText = new PIXI.Text(durationText);
                basicText.x = (barWidth - basicText.width) / 2;
                basicText.y = (barHeight - basicText.height) / 2;


                //-- hitung percentase progress bar
                function hitungProgressBar() {
                    var a = Date.parse(regionData[targetName].startWorkingOn);
                    var b = Date.parse(regionData[targetName].finishWorkingOn);
                    var c = $w.GameApp.dateDiff(a, b);
                    var d = $w.GameApp.getTimeRemaining(b);
                    var totalfull = c.total;
                    var totalcurrent = d.total;

                    container.removeChild(graphic);
                    container.removeChild(basicText);

                    percent = (totalfull - totalcurrent) / totalfull * 100;
                    output = (fullbar - 2) * percent / 100;

                    graphic = new PIXI.Graphics();

                    // draw a rounded rectangle
                    graphic.lineStyle(2, 0xf7b81f, 1);
                    graphic.beginFill(0xf7b81f, 1);
                    graphic.drawRoundedRect(7, 7, output, 26, 25);
                    graphic.endFill();

                    container.addChild(graphic);
                    container.addChild(basicText);

                    //-- jika udah selesai kerja, maka otomatis cek data server lagi
                    if (d.total < 0) {
                        $w.GameApp.IslandBusiness.fetchRegionData(_activeWorld.id, function () {
                            displayAllAboutChar();
                            $w.removeEventListener('serverdatetick', hitungProgressBar);
                        });
                    }
                }
                ;
                $w.addEventListener('serverdatetick', hitungProgressBar);
                hitungProgressBar();

                //-- bg putih
                graphics.lineStyle(2, 0xffffff, 1);
                graphics.beginFill(0xffffff, 1);
                graphics.drawRoundedRect(0, 0, barWidth, barHeight, 25);
                graphics.endFill();

                //-- border hitam
                graphics.lineStyle(2, 0x000, 1);
                graphics.drawRoundedRect(5, 5, fullbar, 30, 25);

                //-- create tombol finish now
                var texture = PIXI.Texture.fromImage('asset/img/icons/FinishNow.png');
                var fnBtn = new PIXI.Sprite(texture);
                fnBtn.interactive = true;

                //-- posisi di tengah vertical = middle dari progress bar
                fnBtn.height = 60;
                fnBtn.width = 60;
                fnBtn.position.x = barWidth + 10;
                fnBtn.position.y = (barHeight - fnBtn.height) / 2;
                fnBtn.on('tap', function () {
                    $w.GameApp.IslandEnviAnim.finishNowFarmingChar(targetName);
                });

                container.addChild(fnBtn);
                container.addChild(graphics);


                //pointedChar = new PIXI.Container();

                //-- setelan bar di bawah char
                //container.position.x = (pointedChar.position.x) + ((pointedChar.width - barWidth) / 2);
                //container.position.y = (pointedChar.position.y + pointedChar.height) + 50;// tambahkan margin 

                //-- setelan bar di atas char
                container.position.x = (pointedChar.position.x) + ((pointedChar.width - barWidth) / 2);
                container.position.y = (pointedChar.position.y - container.height);

                progressBarContainer.addChild(container);
            }
            ;
            function createProgressBar(pointedChar, targetName) {
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


                var loader = new PIXI.loaders.Loader();
                loader.add('outerbar', 'asset/img/bar-outer.png');
                loader.add('innerbar', 'asset/img/bar-inner.png');
                loader.add('fnicon', 'asset/img/icons/FinishNow.png');
                loader.load(function (loader, resources) {
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
                    fnBtn.on('tap', function () {
                        $w.GameApp.IslandEnviAnim.finishNowFarmingChar(targetName);
                    });

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

                });

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
                }
                ;



            }
            ;
            function displayAllAboutChar() {
                showCharObjectTargetInEnvirontment();
                showCharInEnvirontment();
                showPlayerCharFarming();
            }
            ;
            function actionChar(_targetName, actionName) {
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
                ;

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
                            //console.log(value.charId, isCharAvailable, actionName);
                            if (isCharAvailable) {
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
                            //console.log(value.charId, isCharAvailable, actionName);
                            if (isCharAvailable) {
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
                ;

            }
            ;
            function showExploringItem(targetName, callback) {
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
                ;


                function renderObj(loader, resources) {
                    var eobj = new PIXI.Sprite(resources['equipm_' + equipm.id].texture);
                    var container1 = new PIXI.Container();

                    container1.addChild(eobj);
                    container1.scale.set(0.5, 0.5);

                    callback(container1);
                }
                ;

                if (!window.PIXI.loader.resources['equipm_' + equipm.id]) {
                    window.PIXI.loader.add('equipm_' + equipm.id, equipm.imageUrl[0]).load(function (loader, resources) {
                        renderObj(loader, resources);
                    });
                } else {
                    renderObj(window.PIXI.loader, window.PIXI.loader.resources);
                }
            }
            ;
            function newDisplayOrder() {
                _backgroundContainer.displayList = new PIXI.DisplayList();
                gs.displayOrder = {
                    backLayer: new PIXI.DisplayGroup(1, true),
                    middleLayer: new PIXI.DisplayGroup(2, false),
                    frontLayer: new PIXI.DisplayGroup(3, true),
                    topLayer: new PIXI.DisplayGroup(4, true)
                }
            }
            ;

            world.Atea = function (callbackFunction) {
                _decorMapLocations = [
                    {id: 1, x: 110, y: 1679, area: 'land', scale: 0.95},
                    {id: 2, x: 437, y: 885, area: 'land', scale: 0.75},
                    {id: 3, x: 75, y: 598, area: 'land', scale: 0.60},
                    {id: 4, x: 421, y: 426, area: 'land', scale: 0.55},
                    {id: 5, x: 406, y: 90, area: 'air', scale: 0.90}
                ];
                _backgroundContainer = new PIXI.Container();

                function rendering() {
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

                    callbackFunction();

                }
                ;

                if (!_resources.atea) {
                    var iUrl = 'animation/atea/skeleton.json';
                    window.PIXI.loader.add('atea', iUrl).load(rendering);
                } else {
                    rendering();
                }

            };
            world.Oidur = function (callbackFunction) {
                _decorMapLocations = [
                    {id: 1, x: 337, y: 1667, area: 'land', scale: 0.90},
                    {id: 2, x: 18, y: 1354, area: 'land', scale: 0.80},
                    {id: 3, x: 106, y: 862, area: 'land', scale: 0.70},
                    {id: 4, x: 494, y: 503, area: 'land', scale: 0.60},
                    {id: 5, x: 597, y: 66, area: 'air', scale: 0.9},
                ];
                _backgroundContainer = new PIXI.Container();

                function rendering() {
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
                }
                ;

                if (!_resources.oidur) {
                    var iUrl = 'animation/oidur/skeleton.json';
                    window.PIXI.loader.add('oidur', iUrl).load(rendering);
                } else {
                    rendering();
                }

            };
            world.Frusht = function (callbackFunction) {
                _decorMapLocations = [
                    {id: 1, x: 675, y: 1767, area: 'land', scale: 0.90},
                    {id: 2, x: 62, y: 1169, area: 'land', scale: 0.70},
                    {id: 3, x: 454, y: 505, area: 'land', scale: 0.60},
                    {id: 4, x: 8, y: 418, area: 'land', scale: 0.55},
                    {id: 5, x: 115, y: 114, area: 'air', scale: 0.5}
                ];
                _backgroundContainer = new PIXI.Container();

                function rendering() {
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
                }
                ;

                if (!_resources.frusht) {
                    var iUrl = 'animation/frusht/skeleton.json';
                    window.PIXI.loader.add('frusht', iUrl).load(rendering);
                } else {
                    rendering();
                }
            };
            world.Routh = function (callbackFunction) {
                _decorMapLocations = [
                    {id: 1, x: 133, y: 1768, area: 'land', scale: 0.95},
                    {id: 2, x: 696, y: 800, area: 'land', scale: 0.65},
                    {id: 3, x: 425, y: 578, area: 'land', scale: 0.60},
                    {id: 4, x: 66, y: 470, area: 'land', scale: 0.55},
                    {id: 5, x: 265, y: 109, area: 'air', scale: 0.90}
                ];
                _backgroundContainer = new PIXI.Container();

                function rendering() {
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
                }
                ;

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

                //-- searching data island yg dituju
                for (var i = 0; i < dataisland.length; i++) {
                    if (dataisland[i].name === name) {
                        _activeWorld = dataisland[i];
                        break;
                    }
                }

                world[_activeWorld.name](function () {
                    newDisplayOrder();
                    _backgroundContainer.addChild(progressBarContainer);
                    showDecorInEnvirontment();
                    displayAllAboutChar();
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

            /**-- for walking char business */
            gs.charContainer = _charContainer;
            gs.renderer = _renderer;
            /**-- */

            $w.GameApp.GameStage = gs;
        })(window);