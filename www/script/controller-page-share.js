/** Share Page Controller **/
(function ShareClass(w) {
    'use strict'
    var $w = w,
            ng = w.angular,
            $ = w.jQuery,
            kjua = w.kjua;
    function createQRCode(_char) {
        //var playerChar = $w.GameApp.CharServices.getPlayerCharById(playerCharId);
        var char = Object(_char);
        var qrColor = {};
        if (char.eggclass == 'golden') {
            qrColor = {
                // code color
                fill: '#f8931f',
                // background color
                back: '#ffffe3'
            };
        } else {
            qrColor = {
                // code color
                fill: '#b3b3b3',
                // background color
                back: '#ffffff'
            };
        }



        var qrcode = kjua({
            // render method: 'canvas' or 'image'
            render: 'canvas',
            // render pixel-perfect lines
            crisp: false,
            // minimum version: 1..40
            minVersion: 1,
            // error correction level: 'L', 'M', 'Q' or 'H'
            ecLevel: 'L',
            // size in pixel
            size: 100,
            // pixel-ratio, null for devicePixelRatio
            ratio: $w.devicePixelRatio,
            // code color
            fill: qrColor.fill,
            // background color
            back: qrColor.back,
            // content
            text: char.code,
            // roundend corners in pc: 0..100
            rounded: 0,
            // quiet zone in modules
            quiet: 0,
            // modes: 'plain', 'label' or 'image'
            mode: 'plain',
            // label/image size and pos in pc: 0..100
            mSize: 20,
            mPosX: 50,
            mPosY: 50,
            // label
            label: char.code,
            fontname: 'sans',
            fontcolor: '#000',
            // image element
            image: null
        });
        return qrcode;
    }

    function ShareCtrl($scope, $rootScope, $http, $ionicLoading, $ionicPopup) {
        var renderer;
        var renderer2;
        //renderer = new PIXI.autoDetectRenderer(250, 250, {
        //    antialiasing: false,
        //    transparent: true,
        //    resolution: window.devicePixelRatio,
        //    autoResize: true,
        //}, true);
        //$('#shareRenderer').html(renderer.view);
        //renderer.view.addEventListener('tap', $scope.showCharList);

        function fetchPlayerChars() {
            //$('#shareCharList').fadeOut('fast');
            var data = $w.GameApp.CharServices.getEnviPlayerChar($scope.selectedIsland.id);
            var shareChars = [];
            for (var i = 0; i < 10; i++) {
                var _char = data[i] || { nickname: '-' };
                shareChars.push(_char);
            }
            $scope.shareChars = shareChars;
            //$('#shareCharList').fadeIn('fast');
        }


        function renderQRCode(_char) {
            var char = Object(_char);
            var textCode = 'NO CODE';
            var stage = new PIXI.Container();
            var bg = {};
            var textColor = 0xef5725;
            if (char.eggclass == 'golden') {
                bg = new PIXI.Sprite(PIXI.loader.resources.goldEgg.texture);
                textColor = 0xef5725;
            } else {
                bg = new PIXI.Sprite(PIXI.loader.resources.silverEgg.texture);
                textColor = 0x4d4d4d;
            }

            var qrcode = createQRCode(char);
            var texture = PIXI.Texture.fromCanvas(qrcode);
            var spriteQRCode = new PIXI.Sprite(texture);
            spriteQRCode.position.set(200, 195);
            bg.addChild(spriteQRCode);
            textCode = String(char.code).trim();
            var textSpriteCode = new PIXI.Text(textCode, {
                fontFamily: 'Quicksand-Bold',
                fontSize: '28px',
                fill: 0xffffff,
                align: 'center',
                fontWeight: 'bolder'
            });
            textSpriteCode.position.set(((bg.width - textSpriteCode.width) / 2), 469);
            bg.addChild(textSpriteCode);
            var expired = new Date(char.lifeEnd),
                    day = expired.getDate(),
                    month = expired.getMonth() + 1,
                    year = expired.getFullYear(),
                    hour = expired.getHours(),
                    minute = expired.getMinutes();
            day = (String(day).length == 1) ? '0' + day : day;
            month = (String(month).length == 1) ? '0' + month : month,
                    minute = (String(minute).length == 1) ? '0' + minute : minute,
                    hour = (String(hour).length == 1) ? '0' + hour : hour;
            //var textExpired = 'Expired : ' + day + ' ' + month + ' ' + year;

            var expiredDateText = new PIXI.Text(day + '.' + month + '.' + year,
                    { fontFamily: 'Quicksand-Bold', fontSize: '16px', fill: textColor, align: 'center', fontWeight: 'bolder' });
            expiredDateText.position.x = ((bg.width - expiredDateText.width) / 2);
            expiredDateText.position.y = 534;
            bg.addChild(expiredDateText);
            var expiredTimeText = new PIXI.Text(hour + ' : ' + minute,
                    { fontFamily: 'Quicksand-Bold', fontSize: '16px', fill: textColor, align: 'center', fontWeight: 'bolder' });
            expiredTimeText.position.x = 305;
            expiredTimeText.position.y = 512;
            bg.addChild(expiredTimeText);
            bg.width = 250;
            bg.height = 250;
            stage.addChild(bg);
            renderer.render(stage);
            //var imgEncoded = renderer.view.toDataURL("image/png", 1);
            //var a = document.createElement('img');
            //a.src = imgEncoded;
            //document.getElementById('socmedIconWrapper').appendChild(a);
        }

        $scope.selectedIsland = {};
        $rootScope.refreshSharePlayerChars = fetchPlayerChars;

        $scope.shareChars = [];
        $scope.changeIsland = function () {
            $scope.isDisplayCode = false;
            var nextID = $scope.selectedIsland.id + 1;
            if (nextID > $w.GameApp.JsonData.island.length) {
                nextID = 1;
            }
            $scope.selectedIsland = $w.GameApp.IslandServices.getIsland(nextID);
            fetchPlayerChars();
        };

        $scope.isDisplayCode = false;
        $scope.setPage = function (index) {

            if ($("#shareTab-" + index).hasClass('active')) {
                return;
            }
            $('.sharePageContent').hide();
            $('#sharePage-' + index).fadeIn('fast');
            $('#sharePageNav li').removeClass('active');
            $("#shareTab-" + index).addClass('active');
        };
        $scope.showEggCode = function (charCode) {
            //console.log(charCode);
            if (typeof (charCode) == 'undefined') {
                return;
            }
            //var char = (function () {
            //    var data = $w.GameApp.CharServices.getPlayerChars();
            //    for (var i = 0; i < data.length; i++) {
            //        if (String(data[i].code).toUpperCase() === String(charCode).toUpperCase()) {
            //            return data[i];
            //        }
            //    }
            //})();
            //renderQRCode(char);
            window.GameApp.SpreadCode.showQRCode(charCode, function () {
                $scope.isDisplayCode = true;
                window.GameApp.SpreadCode.renderer.view.addEventListener('tap', $scope.showCharList);
            });

        };

        $scope.isDisplayReward = false;

        $scope.showReward = function (charCode) {

            if (typeof (charCode) == 'undefined') {
                return;
            }
            window.GameApp.SpreadReward.showRewardImage(charCode, function () {
                $scope.isDisplayReward = true;
                window.GameApp.SpreadReward.renderer.view.addEventListener('tap', $scope.showCharList2);
            });
        };
        $scope.showCharList = function () {
            $scope.isDisplayCode = false;
        };
        $scope.showCharList2 = function () {
            $scope.isDisplayReward = false;
            //clicked = false;
            //$scope.imagecharachter = "";
            //$("#shareReward-1").show();
            //$("#shareReward-2").hide();
        };

        $scope.sharetoFb = function () {
            if ($scope.isDisplayCode) {
                w.GameApp.SpreadCode.shareToFb(renderer);
            }
            /*function successCallback() { }
             ;
             function errorCallback() {
             alert('Cannot share with facebook app');
             }
             ;
             function fileOrFileArray() {
             var imgEncoded = renderer.view.toDataURL("image/png", 1);
             return imgEncoded;
             }
             ;
             function url() {
             return 'http://hatchmarket.id';
             }
             ;
             function message() {
             return 'Hello hatcher';
             }
             ;
             if (window.plugins && window.plugins.socialsharing && $scope.isDisplayCode) {
             window.plugins.socialsharing.shareViaFacebook(message(), fileOrFileArray(), url(), successCallback, errorCallback);
             }*/
        };
        $scope.sharetoIg = function () {
            if ($scope.isDisplayCode) {
                w.GameApp.SpreadCode.shareToIg(renderer);
            }
            /*function successCallback() { }
             ;
             function errorCallback() {
             alert('cannot share');
             }
             ;
             function fileOrFileArray() {
             var imgEncoded = renderer.view.toDataURL("image/png", 1);
             return imgEncoded;
             }
             ;
             function message() {
             return 'Hello hatcher';
             }
             ;
             if (window.plugins && window.plugins.socialsharing && $scope.isDisplayCode) {
             window.plugins.socialsharing.shareViaInstagram(message(), fileOrFileArray(), successCallback, errorCallback);
             }*/
        };
        $scope.sharetoTwit = function () {
            if ($scope.isDisplayCode) {
                w.GameApp.SpreadCode.shareToTwit(renderer);
            }
            /*
             function successCallback() { }
             ;
             function errorCallback() {
             alert('cannot share');
             }
             ;
             function fileOrFileArray() {
             var imgEncoded = renderer.view.toDataURL("image/png", 1);
             return imgEncoded;
             }
             ;
             function message() {
             return 'Hello hatcher';
             }
             ;
             if (window.plugins && window.plugins.socialsharing && $scope.isDisplayCode) {
             window.plugins.socialsharing.shareViaTwitter(message(), fileOrFileArray(), successCallback, errorCallback);
             }*/
        };
        $scope.sharetoWa = function () {
            if ($scope.isDisplayCode) {
                w.GameApp.SpreadCode.shareToWa(renderer);
            }
            /*
             function successCallback() { }
             ;
             function errorCallback() {
             alert('cannot share');
             }
             ;
             function fileOrFileArray() {
             var imgEncoded = renderer.view.toDataURL("image/png", 1);
             return imgEncoded;
             }
             ;
             function url() {
             return 'http://hatchmarket.id';
             }
             ;
             function message() {
             return 'Hello hatcher';
             }
             ;
             if (window.plugins && window.plugins.socialsharing && $scope.isDisplayCode) {
             window.plugins.socialsharing.shareViaWhatsApp(message(), fileOrFileArray(), url(), successCallback, errorCallback);
             }*/
        };
        $scope.sharetoPath = function () {
            function successCallback() { }
            ;
            function errorCallback(e) {
                alert('Cannot share');
            }
            ;
            function fileOrFileArray() {
                var imgEncoded = renderer.view.toDataURL("image/png", 1);
                return imgEncoded;
            }
            ;
            function url() {
                return 'http://hatchmarket.id';
            }
            ;
            function message() {
                return 'Hello hatcher';
            }
            ;
            function subject() {
                return 'Hatch Market ID'
            }
            ;
            if (window.plugins && window.plugins.socialsharing && $scope.isDisplayCode) {
                window.plugins.socialsharing.share(message(), subject(), fileOrFileArray(), url(), successCallback, errorCallback);
            }

        };
        $scope.spreadingSocmed = function (socmedname) {
            if (!$scope.isDisplayCode) {
                $ionicLoading.show({
                    template: '<div style="">Choose a character then click again</div>',
                    duration: 2000
                });
                return;
            } else {
                window.GameApp.SpreadCode.shareToSocialMedia(socmedname);
            }
        };
        $scope.spreadRewardTo = function (socmedname) {
            if (!$scope.isDisplayReward) {
                $ionicLoading.show({
                    template: '<div style="">Choose a character then click again</div>',
                    duration: 2000
                });
                return;
            } else {
                window.GameApp.SpreadReward.shareToSocialMedia(socmedname);
            }
        };
        $scope.saveThis = function () {
            /** Process the type1 base64 string **/
            var myBaseString = window.GameApp.SpreadCode.renderer.view.toDataURL("image/png", 1);
            // Split the base64 string in data and contentType
            var block = myBaseString.split(";");
            // Get the content type
            var dataType = block[0].split(":")[1]; // In this case "image/png"
            // get the real base64 content of the file
            var realData = block[1].split(",")[1]; // In this case "iVBORw0KGg...."

            // The path where the file will be created
            var folderpath = cordova.file.dataDirectory || "file:///storage/emulated/0/";
            // The name of your file, note that you need to know if is .png,.jpeg etc
            var filename = Date.parse(new Date()) + ".png";
            if ($scope.isDisplayCode) {
                $w.savebase64AsImageFile(folderpath, filename, realData, dataType);
            }
        };

        (function ranking() {
            var rankingData = [];
            $scope.ranking = {};
            $scope.showRanking = function () {
                var getServerData = function (callback) {
                    var xurl = $w.GameApp.serverURL + '/reward/ranking';
                    var request = $w.GameApp.http.post(xurl, {});

                    $w.GameApp.ionicLoading.show();
                    request.success(showData);
                    request.finally($w.GameApp.ionicLoading.hide);
                };
                var showData = function (result) {
                    rankingData = result;

                    $scope.page.show(0);
                    $scope.popup = $ionicPopup.show({
                        title: 'Ranking',
                        templateUrl: 'templates/popup-ranking.html',
                        scope: $scope
                    });

                };

                getServerData();

            };
            $scope.page = (function () {
                var page = {};
                var no = 0;
                page.next = function () {
                    console.info('next');
                    no++;
                    if (no >= rankingData.length) {
                        no = 0;
                    }
                    page.show(no);
                };
                page.prev = function () {
                    console.info('prev');
                    no--;
                    if (no < 0) {
                        no = rankingData.length - 1;
                    }

                    page.show(no);
                };
                page.show = function (pageNo) {
                    var tdata = rankingData[pageNo];
                    $scope.ranking.title = tdata.judul;
                    $scope.ranking.data = (function () {
                        var table = '<table class="ranking-data" cellpadding="1" cellspacing="1">';
                        var thead = (function () {
                            var thead = '<thead><tr>';
                            for (var i = 0; i < tdata.header.length; i++) {
                                var o = tdata.header[i];
                                thead += '<th>' + o.alias + '</th>';
                            }
                            thead += '</tr></thead>';
                            return thead;
                        })();
                        var tbody = (function () {
                            var tbody = '<tbody>';
                            for (var j = 0; j < tdata.data.length; j++) {
                                var p = tdata.data[j];
                                tbody += '<tr>';
                                for (var i = 0; i < tdata.header.length; i++) {
                                    var field = tdata.header[i].field;
                                    tbody += '<td>' + p[field] + '</td>';
                                }
                                tbody += '</tr>';
                            }
                            tbody += '</tbody>';
                            return tbody;
                        })();

                        table += thead + tbody;
                        table += '</table>';

                        return table;
                    })();


                    //console.debug(tdata);
                    console.info('show ' + pageNo)
                }

                return page;
            })();
        })();



        //-- run once
        $w.addEventListener('gameappready', function () {
            $scope.selectedIsland = $w.GameApp.IslandServices.getIsland(1);
            fetchPlayerChars();

            //window.console.clear();
            //window.console['log'] = function () { };
            //window.console['info'] = function () { };
        });
    };

    angular.module('gamesapp').controller('ShareCtrl', ['$scope', '$rootScope', '$http', '$ionicLoading', '$ionicPopup', ShareCtrl]);
})(window);

(function SaveImageFile(window) {
    /**
     * Convert a base64 string in a Blob according to the data and contentType.
     * 
     * @param b64Data {String} Pure base64 string without contentType
     * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
     * @param sliceSize {Int} SliceSize to process the byteCharacters
     * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
     * @return Blob
     */
    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    /**
     * Create a Image file according to its database64 content only.
     * 
     * @param folderpath {String} The folder where the file will be created
     * @param filename {String} The name of the file that will be created
     * @param content {Base64 String} Important : The content can't contain the following string (data:image/png[or any other format];base64,). Only the base64 string is expected.
     */
    function savebase64AsImageFile(folderpath, filename, content, contentType) {
        // Convert the base64 string in a Blob
        var DataBlob = b64toBlob(content, contentType);
        console.log("Starting to write the file :3");
        window.resolveLocalFileSystemURL(folderpath, function (dir) {
            console.log("Access to the directory granted succesfully");
            dir.getFile(filename, { create: true }, function (file) {
                console.log("File created succesfully.");
                file.createWriter(function (fileWriter) {
                    console.log("Writing content to file");
                    fileWriter.onwriteend = function () {
                        console.log("Successful file write...");
                        var nativePathToJpegImage = folderpath + '/' + filename;
                        cordova.plugins.imagesaver.saveImageToGallery(nativePathToJpegImage, function () {
                            console.log('--------------success');
                            window.navigator.notification.alert('The image saved on the gallery.');
                        }, function () {
                            console.log('--------------error: ' + error);
                        });
                    };
                    fileWriter.onerror = function (e) {
                        console.log("Failed file write: " + e.toString());
                    };

                    fileWriter.write(DataBlob);
                }, function () {
                    alert('Unable to save file in path ' + folderpath);
                });
            });
        });
    }

    window.b64toBlob = b64toBlob;
    window.savebase64AsImageFile = savebase64AsImageFile;
})(window);

(function SpreadingReward(win) {
    'use strict';
    var $ = win.jQuery;
    var PIXI = win.PIXI;
    var size = 250;
    var renderer = new PIXI.autoDetectRenderer(size, size, {
        antialiasing: false,
        backgroundColor: 0xf5eec4,
        resolution: win.devicePixelRatio,
        autoResize: true,
    }, true);

    var rewardInfo = {};
    rewardInfo.imagecharachter = 'asset/img/char/with-egg/Orodocus.png';
    rewardInfo.nickname = 'KRYTENITES1';
    rewardInfo.codechar = 'BK1212QR';
    rewardInfo.numberofhatch = 1000;
    rewardInfo.coinearned = 125000;
    rewardInfo.specialitybonus = 2350;
    rewardInfo.totalcoins = 175000;
    rewardInfo.raritystar = 'asset/img/char/level/Lv.1.png';
    rewardInfo.raritylevel = 'COMMON';

    function successCallback() { };
    function errorCallback(e) {
        console.log(e);
        window.GameApp.SpreadCode.shareToSocialMedia('default');
    };
    function fileOrFileArray() {
        var imgEncoded = renderer.view.toDataURL("image/png", 1);
        return imgEncoded;
    };

    function url() {
        return 'http://www.hatchmarket.id';
    };
    function message() {
        return 'This is my rewards.';
    };
    function subject() { return 'Hatch Market ID' };

    function renderRewardImage(callback) {
        var stage = new PIXI.Container();

        var style = {
            fontFamily: 'Arial',
            fontSize: '36px',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: '#F7EDCA',
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440
        };
        var scale = size / 600;
        var loader = new PIXI.loaders.Loader();
        loader.add('bgReward', 'asset/img/bg-reward.png');
        loader.add('monster', rewardInfo.imagecharachter);
        loader.add('coin', 'asset/img/Coin.png');
        loader.add('star', rewardInfo.raritystar);
        loader.load(function (loader, resources) {
            var bg = new PIXI.Sprite(resources.bgReward.texture);
            bg.width = 600;
            bg.height = 600;

            var rarityContainer = new PIXI.Container();
            var rarityText = new PIXI.Text('RARITY', {
                fontFamily: 'Quicksand-Bold', fontSize: '16px', fill: 0x2e2a0f, align: 'center', fontWeight: 'normal',
                letterSpacing: 3
            });
            var rarityStar = new PIXI.Sprite(resources.star.texture);
            var levelText = new PIXI.Text(rewardInfo.raritylevel, {
                fontFamily: 'Quicksand-Bold', fontSize: '16px', fill: 0x2e2a0f, align: 'center', fontWeight: 'normal',
                letterSpacing: 1
            });
            rarityStar.scale.set(0.7, 0.7);
            rarityContainer.addChild(rarityText);
            rarityContainer.addChild(rarityStar);
            rarityContainer.addChild(levelText);

            rarityText.position.set((rarityContainer.width - rarityText.width) / 2, 0);
            rarityStar.position.set(0, rarityText.height + rarityText.y + 10);
            levelText.position.set((rarityContainer.width - levelText.width) / 2, rarityStar.height + rarityStar.y + 10);
            bg.addChild(rarityContainer);
            rarityContainer.position.set((bg.width - rarityContainer.width - 30), 20);

            var bar1 = new PIXI.Container();
            var graphics = new PIXI.Graphics();
            graphics.beginFill(0xf7b81f, 1);
            graphics.drawRoundedRect(0, 0, 200, 55, 55);
            graphics.endFill();
            bar1.addChild(graphics);

            var border = new PIXI.Graphics();
            border.lineStyle(2, 0xffffff, 1);
            border.drawRoundedRect(0, 0, 200, 55, 55);
            bar1.addChild(border);

            bar1.position.set((bg.width - bar1.width) / 2, 40);
            bar1.height = 35;
            bg.addChild(bar1);

            var charcodeText = new PIXI.Text(rewardInfo.codechar, {
                fontFamily: 'Quicksand-Bold', fontSize: '20px', fill: 0xffffff, align: 'center', fontWeight: 'normal',
                letterSpacing: 2
            });
            charcodeText.position.x = bar1.position.x + ((bar1.width - charcodeText.width) / 2);
            charcodeText.position.y = bar1.position.y + ((bar1.height - charcodeText.height) / 2);
            bg.addChild(charcodeText);

            var nicknameText = new PIXI.Text(rewardInfo.nickname, {
                fontFamily: 'Quicksand-Bold', fontSize: '20px', fill: 0x2e2a0f, align: 'center', fontWeight: 'normal',
                letterSpacing: 3
            });
            nicknameText.position.set(30, (bar1.position.y + bar1.height) + 5);
            bg.addChild(nicknameText);

            var monster = new PIXI.Sprite(resources.monster.texture);
            var scaleMonster = 0.40;
            monster.scale.set(scaleMonster, scaleMonster);
            monster.position.set((bg.width - monster.width) / 2, bar1.position.y + bar1.height);
            bg.addChild(monster);

            function Rowbartext(ctl, ctr, isShowCoin) {
                var height = 55;
                var width = 400;
                var pRadius = (100 / 100) * height;
                var root = new PIXI.Container();
                root.width = 500;
                root.height = 35;

                var container1 = new PIXI.Container();
                var container2 = new PIXI.Container();
                var border = new PIXI.Graphics();
                border.lineStyle(2, 0xfebb2f, 1);
                border.drawRoundedRect(0, 0, width, height, pRadius);
                container1.addChild(border);

                var graphic1 = new PIXI.Graphics();
                graphic1.beginFill(0xfebb2f, 1);
                graphic1.drawRoundedRect(0, 0, width, height, pRadius);
                graphic1.endFill();
                container1.addChild(graphic1);

                var graphic2 = new PIXI.Graphics();
                graphic2.beginFill(0xf5eec4, 1);
                graphic2.drawRoundedRect(0, 0, (0.375 * width), height, pRadius);
                graphic2.endFill();
                graphic2.position.x = graphic1.width - graphic2.width;
                container1.addChild(graphic2);

                var graphic3 = new PIXI.Graphics();
                graphic3.beginFill(0xf5eec4, 1);
                graphic3.drawRect(0, 0, height, height);
                graphic3.endFill();
                graphic3.position.x = graphic2.position.x;
                container1.addChild(graphic3);
                container1.height = 30;

                root.addChild(container1);

                var text1 = new PIXI.Text(ctl, {
                    fontFamily: 'Quicksand-Bold', fontSize: '16px', fill: '#000000', align: 'center', fontWeight: 'normal'
                });
                text1.position.set(20, (root.height - text1.height) / 2);
                root.addChild(text1);

                var text2 = new PIXI.Text(ctr, {
                    fontFamily: 'Quicksand-Bold', fontSize: '16px', fill: '#000000', align: 'center', fontWeight: 'normal',
                    letterSpacing: 1
                });

                root.addChild(text2);

                var coin = new PIXI.Sprite(resources.coin.texture);
                var coinSize = root.height - (root.height * 50 / 100);
                coin.width = coinSize;
                coin.height = coinSize;
                coin.position.set((width - coinSize - 20), (root.height - coin.height) / 2);

                //-- text-align right text  
                text2.position.set(coin.position.x - text2.width - 5, (root.height - text1.height) / 2);

                root.addChild(coin);

                if (!isShowCoin) {
                    coin.visible = false;
                };


                return root;
            }

            var rowbar1 = new Rowbartext('TOTAL REWARD', rewardInfo.totalcoins, true);
            rowbar1.position.set((bg.width - rowbar1.width) / 2, (monster.height + monster.y) + 20);
            bg.addChild(rowbar1);

            var summaryText = new PIXI.Text("EGGCODE SUMMARY", {
                fontFamily: 'Quicksand-Bold', fontSize: '20px', fill: 0x000, align: 'center', fontWeight: 'normal',
            });
            summaryText.position.x = (bg.width - summaryText.width) / 2;
            summaryText.position.y = (rowbar1.height + rowbar1.position.y + 10);
            bg.addChild(summaryText);

            var rowbar2 = new Rowbartext('NUMBER OF HATCHER', rewardInfo.numberofhatch, false);
            rowbar2.position.set((bg.width - rowbar2.width) / 2, (summaryText.position.y + summaryText.height) + 5);
            bg.addChild(rowbar2);

            var rowbar3 = new Rowbartext('COIN EARNED', rewardInfo.coinearned, true);
            rowbar3.position.set((bg.width - rowbar3.width) / 2, (rowbar2.position.y + rowbar2.height) + 5);
            bg.addChild(rowbar3);

            var rowbar4 = new Rowbartext('SPECIALITY BONUS', rewardInfo.specialitybonus, true);
            rowbar4.position.set((bg.width - rowbar4.width) / 2, (rowbar3.position.y + rowbar3.height) + 5);
            bg.addChild(rowbar4);


            var footerText1 = new PIXI.Text('FOR MORE INFO ABOUT YOUR EGGCODE DETAILS', {
                fontFamily: 'Quicksand-Bold', fontSize: '16px', fill: '#caa16d', align: 'center', fontWeight: 'normal'
            });
            var footerText2 = new PIXI.Text('PLEASE VISIT WWW.HATCHMARKET.ID', {
                fontFamily: 'Quicksand-Bold', fontSize: '16px', fill: '#caa16d', align: 'center', fontWeight: 'normal',
                letterSpacing: 1
            });

            footerText2.position.set((bg.width - footerText2.width) / 2, bg.height - footerText2.height - 10);
            footerText1.position.set((bg.width - footerText1.width) / 2, footerText2.position.y - footerText1.height - 5);
            bg.addChild(footerText1);
            bg.addChild(footerText2);

            bg.scale.set(scale, scale);
            stage.addChild(bg);
            renderer.render(stage);
            callback();
        });

        $('#shareRenderer2').html(renderer.view);
    };

    var sr = {};
    sr.renderer = renderer;
    sr.showRewardImage = function (charcode, callback) {
        window.gmLoading.show();
        var tourl = window.GameApp.serverURL + '/reward/fetchdata';
        var request = window.GameApp.http.post(tourl, { eggcode: charcode });
        request.success(function (response) {
            console.log(response);
            rewardInfo = response.Reward;
            //console.log(response);
            renderRewardImage(function () {
                callback();
                window.gmLoading.hide();
            });
        });
        request.finally(function () {
            //window.gmLoading.hide();
        });

    };
    sr.shareToSocialMedia = function (socmedname) {
        if (window.plugins && window.plugins.socialsharing) {
            switch (socmedname) {
                case 'facebook':
                    window.plugins.socialsharing.shareViaFacebook(message(), fileOrFileArray(), url(), successCallback, errorCallback);
                    break;
                case 'whatsapp':
                    window.plugins.socialsharing.shareViaWhatsApp(message(), fileOrFileArray(), url(), successCallback, errorCallback);
                    break;
                case 'twitter':
                    window.plugins.socialsharing.shareViaTwitter(message(), fileOrFileArray(), successCallback, errorCallback);
                    break;
                case 'instagram':
                    window.plugins.socialsharing.shareViaInstagram(message(), fileOrFileArray(), successCallback, errorCallback);
                    break;
                case 'savetodevice':
                    window.GameApp.SpreadReward.savePhoto();
                    break;
                case 'path':
                    //window.plugins.socialsharing.shareViaInstagram(message(), fileOrFileArray(), successCallback, errorCallback);
                    //window.plugins.socialsharing.shareVia('com.path', message(), subject(), fileOrFileArray(), url(), successCallback, errorCallback);

                    var pathName = 'com.path';
                    if (String(device.platform).toLowerCase() == 'ios') {
                        pathName = 'com.path.Path';
                    }

                    window.plugins.socialsharing.canShareVia(pathName, message(), subject(), fileOrFileArray(), url(), function () {
                        window.plugins.socialsharing.shareVia(pathName, message(), subject(), fileOrFileArray(), url(), successCallback, errorCallback);
                    }, errorCallback);
                    break;
                default:
                    //window.plugins.socialsharing.share(message(), subject(), fileOrFileArray(), url(), successCallback, errorCallback);
                    // this is the complete list of currently supported params you can pass to the plugin (all optional)
                    var options = {
                        message: message(), // not supported on some apps (Facebook, Instagram)
                        subject: 'Hatch Market ID', // fi. for email
                        files: fileOrFileArray(), // an array of filenames either locally or remotely
                        url: url(),
                        chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
                    }
                    //window.plugins.socialsharing.shareWithOptions(options, successCallback, function () { });
                    window.plugins.socialsharing.share(options.message, options.subject, options.files, options.url, function success() { }, function error() { });
                    break;
            }
        };
    };
    sr.savePhoto = function () {
        var base64Data = fileOrFileArray();

        /** Process the type1 base64 string **/
        var myBaseString = window.GameApp.SpreadReward.renderer.view.toDataURL("image/jpeg", 1);
        // Split the base64 string in data and contentType
        var block = myBaseString.split(";");
        // Get the content type
        var dataType = block[0].split(":")[1]; // In this case "image/png"
        // get the real base64 content of the file
        var realData = block[1].split(",")[1]; // In this case "iVBORw0KGg...."

        //window.GameApp.saveImage(realData, dataType, selectedCharInfo.code);
        window.savebase64AsImageFile(cordova.file.cacheDirectory, rewardInfo.codechar + '.jpg', realData, dataType);
    };

    //window.addEventListener('gameappready', function () {
    //    renderRewardImage(function () {
    //        $('#eggPage-1').html(sr.renderer.view);
    //    });
    //});
    win.GameApp.SpreadReward = sr;
})(window);

(function SpreadingEggcode(win) {
    'use strict';
    var kjua = win.kjua;
    var PIXI = win.PIXI;
    var renderer = new PIXI.autoDetectRenderer(250, 250, {
        antialiasing: false,
        transparent: true,
        resolution: window.devicePixelRatio,
        autoResize: true,
    }, true);
    var selectedCharInfo = {};

    function successCallback() { };
    function errorCallback(e) {
        console.log(e);
        window.GameApp.SpreadCode.shareToSocialMedia('default');
    };
    function fileOrFileArray() {
        var imgEncoded = renderer.view.toDataURL("image/png", 1);
        return imgEncoded;
    };

    function url() {
        return selectedCharInfo.hyperlink;
    };
    function message() {
        return selectedCharInfo.pesan;
    };
    function subject() { return 'Hatch Market ID' };
    function createQRCode(charcode, eggclass) {
        var qrColor = {};
        if (eggclass == 'golden') {
            qrColor = {
                // code color
                fill: '#f8931f',
                // background color
                back: '#ffffe3'
            };
        } else {
            qrColor = {
                // code color
                fill: '#b3b3b3',
                // background color
                back: '#ffffff'
            };
        }

        var qrcode = kjua({
            // render method: 'canvas' or 'image'
            render: 'canvas',
            // render pixel-perfect lines
            crisp: false,
            // minimum version: 1..40
            minVersion: 1,
            // error correction level: 'L', 'M', 'Q' or 'H'
            ecLevel: 'L',
            // size in pixel
            size: 100,
            // pixel-ratio, null for devicePixelRatio
            ratio: window.devicePixelRatio,
            // code color
            fill: qrColor.fill,
            // background color
            back: qrColor.back,
            // content
            text: charcode,
            // roundend corners in pc: 0..100
            rounded: 0,
            // quiet zone in modules
            quiet: 0,
            // modes: 'plain', 'label' or 'image'
            mode: 'plain',
            // label/image size and pos in pc: 0..100
            mSize: 20,
            mPosX: 50,
            mPosY: 50,
            // label
            label: charcode,
            fontname: 'sans',
            fontcolor: '#000',
            // image element
            image: null
        });
        return qrcode;
    };
    function renderQRCode(callback) {
        var char = Object(selectedCharInfo);
        var textCode = 'NO CODE';
        var stage = new PIXI.Container();
        var bg = {};
        var textColor = 0xef5725;
        if (char.eggclass == 'golden') {
            bg = new PIXI.Sprite(PIXI.loader.resources.goldEgg.texture);
            textColor = 0xef5725;
        } else {
            bg = new PIXI.Sprite(PIXI.loader.resources.silverEgg.texture);
            textColor = 0x4d4d4d;
        }

        var qrcode = createQRCode(char.code, char.eggclass);
        var texture = PIXI.Texture.fromCanvas(qrcode);
        var spriteQRCode = new PIXI.Sprite(texture);
        var spriteContainer = new PIXI.Container();

        spriteContainer.addChild(spriteQRCode);
        spriteContainer.position.set(200, 195);
        spriteContainer.width = 200;
        spriteContainer.height = 200;

        bg.addChild(spriteContainer);
        textCode = String(char.code).trim();
        var textSpriteCode = new PIXI.Text(textCode, {
            fontFamily: 'Quicksand-Bold',
            fontSize: '28px',
            fill: 0xffffff,
            align: 'center',
            fontWeight: 'bolder'
        });
        textSpriteCode.position.set(((bg.width - textSpriteCode.width) / 2), 469);
        bg.addChild(textSpriteCode);

        var expiredDateText = new PIXI.Text(selectedCharInfo.tanggal,
                { fontFamily: 'Quicksand-Bold', fontSize: '16px', fill: textColor, align: 'center', fontWeight: 'bolder' });

        expiredDateText.position.x = ((bg.width - expiredDateText.width) / 2);
        expiredDateText.position.y = 534;

        bg.addChild(expiredDateText);

        var expiredTimeText = new PIXI.Text(selectedCharInfo.jam,
                { fontFamily: 'Quicksand-Bold', fontSize: '16px', fill: textColor, align: 'center', fontWeight: 'bolder' });
        expiredTimeText.position.x = 305;
        expiredTimeText.position.y = 512;
        bg.addChild(expiredTimeText);
        // bg.width = 250;
        // bg.height = 250;

        var scale = 250 / 600;
        bg.scale.set(scale, scale);

        stage.addChild(bg);
        renderer.render(stage);

        callback();
        window.requestAnimationFrame(function () {

            renderer.render(stage);
        });


        $('#shareRenderer').html(renderer.view);

        //var imgEncoded = renderer.view.toDataURL("image/png", 1);
        //var a = document.createElement('img');
        //a.src = imgEncoded;
        //document.getElementById('socmedIconWrapper').appendChild(a);
    };

    var sc = {};
    sc.renderer = renderer;
    sc.spreadInfo = selectedCharInfo;
    sc.showQRCode = function (charcode, callback) {
        window.gmLoading.show({ noBackdrop: true });
        var tourl = window.GameApp.serverURL + '/character/info';

        var request = window.GameApp.http.post(tourl, { charcode: charcode });
        request.success(function (response) {
            console.log(response);
            selectedCharInfo = response.SpreadInfo;
            renderQRCode(callback);
        });
        request.finally(function () {
            window.gmLoading.hide();
        });

    };
    sc.saveQRCode = function () {
        /** Process the type1 base64 string **/
        var myBaseString = window.GameApp.SpreadCode.renderer.view.toDataURL("image/png", 1);
        // Split the base64 string in data and contentType
        var block = myBaseString.split(";");
        // Get the content type
        var dataType = block[0].split(":")[1]; // In this case "image/png"
        // get the real base64 content of the file
        var realData = block[1].split(",")[1]; // In this case "iVBORw0KGg...."

        // The path where the file will be created
        var folderpath = cordova.file.dataDirectory || "file:///storage/emulated/0/";
        // The name of your file, note that you need to know if is .png,.jpeg etc
        var filename = Date.parse(new Date()) + ".png";

        window.savebase64AsImageFile(folderpath, filename, realData, dataType);

    };
    sc.savePhoto = function () {
        var base64Data = fileOrFileArray();

        /** Process the type1 base64 string **/
        var myBaseString = window.GameApp.SpreadCode.renderer.view.toDataURL("image/jpeg", 1);
        // Split the base64 string in data and contentType
        var block = myBaseString.split(";");
        // Get the content type
        var dataType = block[0].split(":")[1]; // In this case "image/png"
        // get the real base64 content of the file
        var realData = block[1].split(",")[1]; // In this case "iVBORw0KGg...."

        //window.GameApp.saveImage(realData, dataType, selectedCharInfo.code);
        window.savebase64AsImageFile(cordova.file.cacheDirectory, selectedCharInfo.code + '.jpg', realData, dataType);
    };
    sc.shareToSocialMedia = function (socmedname) {
        if (window.plugins && window.plugins.socialsharing) {
            switch (socmedname) {
                case 'facebook':
                    window.plugins.socialsharing.shareViaFacebook(message(), fileOrFileArray(), url(), successCallback, errorCallback);
                    break;
                case 'whatsapp':
                    window.plugins.socialsharing.shareViaWhatsApp(message(), fileOrFileArray(), url(), successCallback, errorCallback);
                    break;
                case 'twitter':
                    window.plugins.socialsharing.shareViaTwitter(message(), fileOrFileArray(), successCallback, errorCallback);
                    break;
                case 'instagram':
                    window.plugins.socialsharing.shareViaInstagram(message(), fileOrFileArray(), successCallback, errorCallback);
                    break;
                case 'savetodevice':
                    window.GameApp.SpreadCode.savePhoto();
                    break;
                case 'path':
                    //window.plugins.socialsharing.shareViaInstagram(message(), fileOrFileArray(), successCallback, errorCallback);
                    //window.plugins.socialsharing.shareVia('com.path', message(), subject(), fileOrFileArray(), url(), successCallback, errorCallback);
                    var pathName = 'com.path';
                    if (String(device.platform).toLowerCase() == 'ios') {
                        pathName = 'com.path.Path';
                    }

                    window.plugins.socialsharing.canShareVia(pathName, message(), subject(), fileOrFileArray(), url(), function () {
                        window.plugins.socialsharing.shareVia(pathName, message(), subject(), fileOrFileArray(), url(), successCallback, errorCallback);
                    }, errorCallback);

                    break;
                default:
                    //window.plugins.socialsharing.share(message(), subject(), fileOrFileArray(), url(), successCallback, errorCallback);
                    // this is the complete list of currently supported params you can pass to the plugin (all optional)
                    var options = {
                        message: selectedCharInfo.pesan, // not supported on some apps (Facebook, Instagram)
                        subject: 'Hatch Market ID', // fi. for email
                        files: fileOrFileArray(), // an array of filenames either locally or remotely
                        url: selectedCharInfo.hyperlink,
                        chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
                    }
                    //window.plugins.socialsharing.shareWithOptions(options, successCallback, function () { });
                    window.plugins.socialsharing.share(options.message, options.subject, options.files, options.url, function success() { }, function error() { });
                    break;
            }
        };
    };

    window.GameApp.SpreadCode = sc;
})(window);

(function (window) {
    'use strict';

    /**
    * 
    */
    function saveImage(base64Data, contentType, filename) {
        function base64toBlob(base64Data, contentType) {
            contentType = contentType || '';
            var sliceSize = 1024;
            var byteCharacters = atob(base64Data);
            var bytesLength = byteCharacters.length;
            var slicesCount = Math.ceil(bytesLength / sliceSize);
            var byteArrays = new Array(slicesCount);

            for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                var begin = sliceIndex * sliceSize;
                var end = Math.min(begin + sliceSize, bytesLength);

                var bytes = new Array(end - begin);
                for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
                    bytes[i] = byteCharacters[offset].charCodeAt(0);
                }
                byteArrays[sliceIndex] = new Uint8Array(bytes);
            }
            return new Blob(byteArrays, { type: contentType });
        }

        var base64Blob = base64toBlob(base64Data, contentType);


        cordova.file.writeFile(cordova.file.dataDirectory, filename + '.jpg', base64Blob, true).then(
          function (success) {
              console.log('success')
              console.log(success)
          },
          function (error) {
              console.log(error)
          }
        )
    };
    window.GameApp.saveImage = saveImage;
})(window);
