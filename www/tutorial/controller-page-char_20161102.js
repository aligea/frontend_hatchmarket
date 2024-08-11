/** Char Page Controller **/
(function CharClass(w, angular) {
    'use strict';

    var renderer, stage, spineData, spineChar;
    var resources = w.PIXI.loader.resources;
    var activeIndexAnimation = 0;
    var animationList = ['Idle', 'Action', 'Move_Left', 'Move_Right'];

    function initializeAnimation() {
        var canvas = w.document.getElementById('rendererActiveChar');
        var gameWidth = $(canvas).width();
        var gameHeight = $(canvas).height();
        var posX = $(canvas).width();
        var posY = $(canvas).height();
        var rendererOptions = {
            antialiasing: false,
            transparent: true,
            resolution: w.devicePixelRatio,
            autoResize: true,
            view: canvas
        };
        //console.log(gameHeight, gameWidth);

        renderer = new PIXI.autoDetectRenderer(gameWidth, gameHeight, rendererOptions, posX, posY);
        //renderer.width = gameWidth;
        //renderer.height = gameHeight;
        renderer.posX = posX;
        renderer.posY = posY;

        renderer.plugins.interaction.destroy();

        stage = new PIXI.Container();



        function animate() {
            requestAnimationFrame(animate);

            renderer.render(stage);
        }
        animate();
    };

    function changeAnimationStyle() {
        
        activeIndexAnimation++;
        if (activeIndexAnimation > (animationList.length - 1)) {
            activeIndexAnimation = 0;
        }

        spineChar.skeleton.setToSetupPose();
        spineChar.update(Math.random());
        spineChar.autoUpdate = true;
        spineChar.state.setAnimation(0, animationList[activeIndexAnimation], true);
        console.log('playing animation ' + animationList[activeIndexAnimation]);

    };

    function renderActiveCharAnimation(charID) {
        var _charID = charID;
        var pos = [];
        pos[0] = {};
        pos[1] = { x: renderer.posX / 4, y: renderer.posY / 9 };
        pos[2] = { x: renderer.posX / 3.5, y: renderer.posY / 6 };
        pos[3] = { x: renderer.posX / 5, y: renderer.posY / 6 };
        pos[4] = { x: renderer.posX / 5, y: renderer.posY / 6 };
        pos[5] = { x: renderer.posX / 5, y: renderer.posY / 7 };
        pos[6] = { x: renderer.posX / 4, y: renderer.posY / 7 };
        pos[7] = { x: renderer.posX / 5, y: renderer.posY / 7 };
        pos[8] = { x: renderer.posX / 5, y: renderer.posY / 7 };
        pos[9] = { x: renderer.posX / 5, y: renderer.posY / 7 };
        pos[10] = { x: renderer.posX / 4, y: renderer.posY / 7 };
        pos[11] = { x: renderer.posX / 5, y: renderer.posY / 7 };
        pos[12] = { x: renderer.posX / 5, y: renderer.posY / 7 };
        pos[13] = { x: renderer.posX / 5, y: renderer.posY / 3 };
        pos[14] = { x: renderer.posX / 4, y: renderer.posY / 7 };
        pos[15] = { x: renderer.posX / 6, y: renderer.posY / 7 };
        pos[16] = { x: renderer.posX / 6, y: renderer.posY / 7 };
        pos[17] = { x: renderer.posX / 4, y: renderer.posY / 7 };
        pos[18] = { x: renderer.posX / 4, y: renderer.posY / 7 };
        pos[19] = { x: renderer.posX / 4, y: renderer.posY / 7 };
        pos[20] = { x: renderer.posX / 4, y: renderer.posY / 7 };

        stage.destroy();
        stage = new PIXI.Container();

        function renderChar() {
            spineData = resources['char_' + _charID].spineData;

            // instantiate the spine animation
            spineChar = new PIXI.spine.Spine(spineData);
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
            var scale = Math.min(((renderer.width) * 0.7) / spineCharCage.width, ((renderer.height) * 0.7) / spineCharCage.height);
            scale = scale / w.devicePixelRatio;
            spineCharCage.scale.set(scale, scale);
            spineCharCage.position.x = pos[_charID].x;
            spineCharCage.position.y = pos[_charID].y;

            // add the container to the stage
            stage.addChild(spineCharCage);

            // once position and scaled, set the animation to play
            activeIndexAnimation = window.randomInt(0, animationList.length - 1);
            spineChar.state.setAnimationByName(0, animationList[activeIndexAnimation], true);

            activeIndexAnimation = 0;
        };

        function loadChar(){
        
        }

        if (!resources['char_' + _charID]) {
            var char = window.GameApp.CharServices.getChar(_charID);
            var iUrl = 'animation/characters/' + (String(char.name).toLowerCase()) + '/skeleton.json';
            window.PIXI.loader.add('char_' + _charID, iUrl).load(renderChar);
        } else {
            renderChar();
        }



    };

    function CharCtrl($scope) {
        $scope.activeChar = {};
        $scope.charData = [];
        $scope.dataToView = [];
        $scope.changeAnimationStyle = changeAnimationStyle;

        function getCharByClass(classType) {
            var data = $scope.charData;
            var outputList = [];
            for (var i in data) {
                var char = data[i];
                if (char.type == classType) {
                    outputList.push(char);
                }
            }
            return outputList.sort(w.sortById);
        }
        ;
        function getChar(charId) {
            for (var i in $scope.charData) {
                if ($scope.charData[i].id == charId) {
                    return $scope.charData[i];
                }
            }
            return {};
        }
        ;
        function bindingDataToView(arrayData) {
            var _data = [];
            var outputArray = [];
            var totalColumnPerRow = 5;
            var rowIdx = 0;

            _data = arrayData;

            var row = [];
            for (var i = 0; i < _data.length; i++) {
                if (i % totalColumnPerRow === 0 && i !== 0) {
                    rowIdx++;
                }
                if (!outputArray[rowIdx]) {
                    outputArray[rowIdx] = {};
                    outputArray[rowIdx].dataColumn = [];
                }
                outputArray[rowIdx].dataColumn.push(_data[i]);
            }
            ;

            //-- normalisasi data
            for (var j = 0; j < outputArray.length; j++) {
                var dataRow = outputArray[j];
                var numberOfColumn = dataRow.dataColumn.length;

                if (numberOfColumn < totalColumnPerRow) {
                    for (var k = numberOfColumn; k < totalColumnPerRow; k++) {
                        var obj = {};
                        dataRow.dataColumn.push(obj);
                    }
                }
            }

            return outputArray;
        };

        $scope.fetchChar = function (classChar) {
            $scope.dataToView = [];
            var _classChar = String(classChar).toUpperCase();
            var dataToView = [];

            if (_classChar === 'ALL') {
                dataToView = $scope.charData;
            } else {
                dataToView = getCharByClass(_classChar);
            }

            $scope.setActiveChar(dataToView[0].id);
            $scope.dataToView = bindingDataToView(dataToView);

            $('#charPageNav li').removeClass('active')
            $("#charTab-" + classChar).addClass('active');
        };
        $scope.setActiveChar = function (charId) {
            renderActiveCharAnimation(charId);
            $scope.activeChar = getChar(charId);

            $('.charWrapper').removeClass('blinking');
            $('#charWrapper' + charId).addClass('blinking');
            w.setTimeout(function () {
                $('#charWrapper' + charId).addClass('blinking');
            }, 250);
        };

        //-- fire when everthing is ready, like $(document).ready();
        w.addEventListener('gameappready', function () {
            $scope.charData = w.GameApp.JsonData.characters;
            $scope.fetchChar('ALL');
        });
    }
    

    angular.module('gamesapp').controller('CharCtrl', ['$scope', CharCtrl]);

    //-- fire once when ready
    w.addEventListener('gameappready', function () {
        initializeAnimation();
        // renderActiveCharAnimation(1);
        //$('.playSound').on('touchstart', function () {
        //  w.GameApp.Sounds.select().play();
        //});
    });
})(this, angular);

