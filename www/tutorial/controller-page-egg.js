(function EggBusiness(w) {
    var eb = {};
    var $scope = {},
      $ionicPopup, AppService, $ionicLoading;

    eb.setup = function (_scope, _ionicPopup, _AppService, _ionicLoading) {
        $scope = _scope;
        $ionicPopup = _ionicPopup;
        AppService = _AppService;
        $ionicLoading = _ionicLoading;
    };
    eb.onPurchaseIncubators = function (incID) {
        //-- validation if diamond enough of not
        var incubator = w.izyObject('IncubatorBalance').get(incID);
        var playerInfo = w.izyObject('PlayerInfo').getOne();

        if (incubator.priceInDiamond > playerInfo.diamondBalance) {
            $ionicPopup.alert({
                title: 'Alert',
                template: 'You dont have enough diamonds.'
            });
            return;
        }
        //AppService.incubators.purchaseIncubator(incID);
        //$scope.activateAvailableIncubator();
        //$ionicLoading.show({
        //    template: "You get " + incubator.name,
        //    duration: 2000,
        //    noBackdrop: true
        //});


        function callback() {
            $scope.activateAvailableIncubator();
            $ionicLoading.show({
                template: "You get " + incubator.name,
                duration: 2000,
                noBackdrop: true
            });
        }

        AppService.incubators.purchaseIncubator(incID, callback);
    };

   
    w.GameApp.EggBusiness = eb;
})(window);

(function EggClass(win) {
    'use strict';

    var $w = win,
      ng = win.angular,
      $ = win.jQuery;
    
    function EggService($http, $ionicLoading, $ionicPopup) {
        var svc = {};

        svc.validateCodeOnServer = function (code, successCallback, failCallback) {

            //-- send data to server
            $ionicLoading.show();
            var url = $w.GameApp.serverURL + '/checkcode';
            $http.post(url, { eggcode: code }).then(function onSuccess(response) {
                var result = response.data;

                if (result.availability == 'yes') {
                    successCallback();

                } else {
                    failCallback();
                    $ionicPopup.alert({
                        title: 'Alert',
                        template: result.message
                    });
                    $ionicLoading.hide();
                }

            }, function onFailed(response) {
                //-- on error ??


            }).finally(function onFinally() {
                // $ionicLoading.hide();
                $ionicLoading.hide();

            });
        }
        svc.updatePlayerChar = function (params, callback) {
            //-- send data to server
            $ionicLoading.show();
            var url = $w.GameApp.serverURL + '/character/update';

            $w.izyObject('PlayerChars').reset();

            $http.post(url, params).then(function onSuccess(response) {
                var playerChars = response.data.PlayerChars;
                $w.jQuery.each(playerChars, function (key, value) {
                    var objData = Object(value);

                    $w.izyObject('PlayerChars').store(objData);
                });


                callback();
            }, function onFailed(response) {
                //-- on error ??


            }).finally(function onFinally() {
                $ionicLoading.hide();


            });
        };

        return svc;
    };

    function EggController($scope, $ionicLoading, $ionicModal, $ionicPopup, $rootScope, AppService, Incubators, HatchingSlot, EggService) {

        $w.GameApp.EggBusiness.setup($scope, $ionicPopup, AppService, $ionicLoading);

        //-- declaration default object
        $scope.data = {};
        $scope.eggCode = null;
        $scope.incubators = [];
        $scope.numberOfSlot = 2;
        $scope.activeIncubatorId = 0;
        $scope.activeIncubator = {};
        $scope.detailIncubatorPopup = {};
        $scope.hatchingSlot = [];
        $scope.freeIncubator = {};
        $scope.myPopup = {};
        $scope.isCanHatching = false;


        function callbackSuccessValidation() {
            $scope.processCode();
            $scope.myPopup.close();
        };
        function callbackFailValidation() {
            $scope.eggCode = null;

        }


        (function PageTabBusiness() {
            $scope.setPage = function (index) {
                if ($("#eggTab-" + index).hasClass('active')) {
                    return;
                }
                $('.eggPageContent').hide();
                $('#eggPage-' + index).fadeIn('fast');

                $('#eggPageNav li').removeClass('active');
                $("#eggTab-" + index).addClass('active');

            };
        })();

        (function TabEggIncubator() {
            $scope.onSubmitEggInput = function () {
                $scope.eggCode = $scope.data.eggCode;
                if ($w.cordova) {
                    cordova.plugins.Keyboard.close();
                }
                
                EggService.validateCodeOnServer($scope.eggCode, callbackSuccessValidation, callbackFailValidation);
            };

            $scope.enterCode = function () {
                $scope.onCancelCode();
                $scope.data.eggCode = null;

                $scope.myPopup = $ionicPopup.show({
                    title: 'Enter Code',
                    templateUrl: 'tutorial/popup-input-code.html?',
                    scope: $scope
                });

                // $scope.myPopup.then(function(result) {
                //   if (result) {
                //     $scope.eggCode = result;
                //     $ionicLoading.show();
                //     window.setTimeout(function() {
                //       $ionicLoading.hide();
                //       $scope.processCode();
                //     }, 1000);
                //   }

                //});
            };
            $scope.scanning = function () {
                var options = {
                    "preferFrontCamera": false, // iOS and Android
                    "showFlipCameraButton": false, // iOS and Android
                    "prompt": "Place a barcode inside the scan area", // supported on Android only
                    "formats": "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                    "orientation": "portrait" // Android only (portrait|landscape), default unset so it rotates with the device
                };

                function onError(error) {
                    //alert("Scanning failed: " + error);
                };

                function onSuccess(result) {
                    /*alert("We got a barcode\n" +
                     "Result: " + result.text + "\n" +
                     "Format: " + result.format + "\n" +
                     "Cancelled: " + result.cancelled);*/
                    if (result.cancelled) {

                        return;
                    }

                    $scope.eggCode = result.text;
                    EggService.validateCodeOnServer($scope.eggCode, callbackSuccessValidation, callbackFailValidation);

                };
                $w.cordova.plugins.barcodeScanner.scan(onSuccess, onError, options);

            };
            $scope.processCode = function () {
                if (window.cordova && window.cordova.plugins.Keyboard && window.cordova.plugins.Keyboard.isVisible) {
                    cordova.plugins.Keyboard.close();
                }
                $('#egg-fill').slideDown();
                $('#inputCodeButton').hide();
                $('#cancelCodeButton').show();

                $ionicLoading.show({
                    template: '<div style="">Choose your incubator ...</div>',
                    noBackdrop: true
                });
                window.setTimeout(function () {
                    $scope.activateAvailableIncubator();
                    $ionicLoading.hide();

                    $w.tutorial.next();
                }, 2000);

                //-- inject tutorial
                $('#hatchingAreaHeader').show();
                $('#tutorial-header-enter-egg').hide();
            };
            $scope.onCancelCode = function () {
                $('#egg-fill').slideUp();
                $('#inputCodeButton').show();
                $('#cancelCodeButton').hide();

                //-- reset the input text
                $scope.eggCode = null;
                $('.incubators').removeClass('blinking animated');
                window.setTimeout(function () {
                    $('.incubators').addClass('animated');
                }, 1000);

            };
            $scope.resetProcessEggIncubator = function () {
                $('#egg-fill').slideUp();
                $('#inputCodeButton').show();
                $('#cancelCodeButton').hide();

                $scope.incubators = Incubators.getAll();

                $scope.eggCode = null;
                $scope.isCanHatching = false;
                $('.incubators').removeClass('blinking');
            };
            $scope.onHatchingEgg = function () {
                if ($scope.validateSlot() === false) {
                    return;
                }

                if ($scope.validateBalanceOfIncubator() === false) {
                    return;
                }

                HatchingSlot.addIncubatorToSlot($scope.activeIncubator.id, $scope.eggCode, function () {
                    $scope.incubators = Incubators.getAll();
                    $scope.resetProcessEggIncubator();
                    $scope.hatchingSlot = AppService.hatchingSlot.getAll();

                    $scope.setPage(2);
                    $scope.myPopup.close();

                    //-- inject notifications
                    window.GameApp.LocalNotif.reload();

                    //-- inject tutorial
                    $w.tutorial.setScene(17);
                });


               
            };
            $scope.playEggAnimation = function () {
                $('#egg-fill').removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $(this).removeClass();
                });
            };
            $scope.validateBalanceOfIncubator = function () {
                var incubator = new izyObject('IncubatorBalance').get($scope.activeIncubator.id);

                if (parseInt(incubator.playerHave) <= 0) {
                    $ionicPopup.alert({
                        title: 'Alert',
                        template: 'You dont have enough incubutor, try another or buy more.'
                    });
                    return false;
                }
                return true;
            }
            $scope.activateAvailableIncubator = function () {
                $scope.incubators = Incubators.getAll();
                $('.incubators').removeClass('blinking');

                //-- inject this to increase performance
                $ionicLoading.show();
                window.setTimeout(function () {
                    $w.GameApp.Animations.stop();
                    $w.GameApp.Animations.reload(function () { $ionicLoading.hide() });
                }, 1000);


                if ($scope.eggCode === null) {
                    return;
                }
                var activeList = [],
                  i, obj;
                $scope.incubators.forEach(function (obj) {
                    if (obj.isAvailable === true) {
                        activeList.push(obj.id);
                        $('#incubator-lv-' + obj.id + '-wrapper').addClass('blinking');
                    }
                });

                if (activeList.length > 0) {
                    //for (var i in activeList) {
                    //    window.setTimeout(function () {
                    //        //console.log(obj.id); 
                    //        $('#incubator-lv-' + activeList[i] + '-wrapper').addClass('blinking');
                    //    }, 1000);
                    //}

                    for (var i = 0; i < activeList.length; i++) {
                        requestAnimationFrame(function () {
                            $('#incubator-lv-' + activeList[i] + '-wrapper').addClass('blinking');
                        });
                    }
                }


                // console.log(activeList);
            }

            $scope.closeOpenPopup = function () {
                $scope.eggCode = null;
                $scope.myPopup.close();

                //$('#tutorial-header-enter-egg').hide();
                //$('#t-header').hide();
                $('#t-header .inner').html('<p>Tekan Enter Code</p>');
                $('#t-header').show();
            }

            $scope.openDetailIncubatorPopup = function (incubatorId) {
                $scope.activeIncubator = new izyObject('IncubatorBalance').get(incubatorId);

                if (Number($scope.activeIncubator.playerHave) > 0 && $scope.eggCode != null) {
                    $scope.isCanHatching = true;
                } else {
                    $scope.isCanHatching = false;
                }
                $scope.myPopup = $ionicPopup.show({
                    title: $scope.activeIncubator.name,
                    subTitle: "<div> <img src='" + $scope.activeIncubator.level + "'</div><div>" + $scope.activeIncubator.level_name + "</div>",
                    templateUrl: 'tutorial/popup-detail-incubator.html',
                    scope: $scope,
                    onTap: function (e) {
                        return true;
                    }
                });
                $scope.myPopup.tutup = function () {
                    $('#tutorial-header-enter-egg .inner').html('<p>Pilih Mini Incubator</p>');
                    $scope.myPopup.close();
                };
                //-- buy incubator
                $scope.myPopup.then(function (result) {
                    if (result) {
                        $scope.onPurchaseIncubator();
                    }
                });
            };

            $scope.onPurchaseIncubator = function () {
                //-- validation if diamond enough of not
                var incubator = new izyObject('IncubatorBalance').get($scope.activeIncubator.id);
                var playerInfo = new izyObject('PlayerInfo').getOne();
                $rootScope.playerInfo = playerInfo;
                if (incubator.priceInDiamond > playerInfo.diamondBalance) {
                    $ionicPopup.alert({
                        title: 'Alert',
                        template: 'You dont have enough diamonds.'
                    });
                    return;
                }


                function callback() {
                    $scope.activateAvailableIncubator();
                    $ionicLoading.show({
                        template: "You get " + incubator.name,
                        duration: 2000,
                        noBackdrop: true
                    });
                }

                AppService.incubators.purchaseIncubator($scope.activeIncubator.id, callback);

            };

            //-- inject untuk tutorial
            $rootScope.enterCode = function () {
                $scope.enterCode();
                //$('#hatchingAreaHeader').hide();
                //$('#tutorial-header-enter-egg').show();
                $('#t-header').show();
                $('#t-header .inner').html('<p>Ketik "Freecode" sebagai eggcode</p><p>Lalu tekan confirm</p>');
            }
            $rootScope.t_chooseIncubator = function () { 
                $('#incubator-lv-1-wrapper').click(function () {
                    $scope.openDetailIncubatorPopup(1);
                    $('#t-header .inner').html('<p>Tekan Use It</p>');
                });
            };
            $rootScope.onScene17 = function () {
                $scope.setPage(2);
            };
        })();

        (function TabSlotBusiness() {
            function successCallback(_hatchedChar) {
                $scope.hatchedChar = {}; //-- for normalize data
                $scope.resetProcessEggIncubator();

                // var text = '{"id":"2","code":"P42KGS50","parent":"FREECODE","stage":"1","nickname":"GLAUCA1","char_id":"9","dead_on":"2016-10-04 14:23:15","hatched_on":"2016-10-01 14:23:15","hatched_by":"1","eggclass":"silver","player_id":"19","is_still_alive":"1"}';
                var objChar = _hatchedChar;
                var masterChar = window.clone(window.GameApp.CharServices.getChar(objChar.char_id));
                delete masterChar.id;

                var hatchedChar = window.mergeObjects(objChar, masterChar);

                hatchedChar.expiredDate = objChar.dead_on;

                $scope.availableRegion = [];
                var playerInfo = window.izyObject('PlayerInfo').getOne();
                var currentStage = Number(playerInfo.currentEnvirontment);
                /*for (var idx = currentStage; idx > 0; idx--) {
                    var obj = window.GameApp.IslandServices.getIsland(idx);
                    $scope.availableRegion.push(obj);
                }*/
                for (var idx = 0; idx < window.GameApp.JsonData.island.length; idx++) {
                    var thisObj = {
                        id: window.GameApp.JsonData.island[idx].id,
                        name: window.GameApp.JsonData.island[idx].name,
                        isCanChoose: 'cantChoose',
                        isActiveRegion: ''
                    };
                    if (Number(thisObj.id) <= currentStage) {
                        thisObj.isCanChoose = '';
                    }
                    if (Number(thisObj.id) === Number(_hatchedChar.stage)) {
                        thisObj.isActiveRegion = 'activeRegion';
                    }
                    $scope.availableRegion.push(thisObj);
                }

                $scope.data.playerCharId = hatchedChar.id;
                $scope.data.stage = hatchedChar.stage;
                $scope.selected = hatchedChar.stage;
                $scope.openDetailChar(hatchedChar, function () {
                    //-- inject tutorial
                    window.tutorial.next();
                });
            }

            $scope.validateSlot = function () {
                if (HatchingSlot.getAvailableSlot() == false) {
                    $ionicPopup.alert({
                        title: 'Alert',
                        template: 'There is no availble slot.'
                    });
                    return false;
                }

                return true;
            }

            $scope.finishNowIncubatorSlot = function (slotId) {
                //-- # validate the player's diamond enough or not
                var listdata = AppService.hatchingSlot.getAll();
                var slot = {};
                for (var i in listdata) {
                    if (slotId == listdata[i].id) {
                        slot = listdata[i];
                    }
                }
                var hatchingEnd = Date.parse(slot.hatchEnd);
                var countdown = AppService.hatchingSlot.getTimeRemaining(hatchingEnd);
                var remainingDiamond = Math.ceil(countdown.total / 60 / 60 / 1000);

                var playerInfo = new izyObject('PlayerInfo').getOne();
                if (playerInfo.diamondBalance < remainingDiamond) {
                    $ionicPopup.alert({
                        title: 'Alert',
                        template: 'You dont have enough diamond.'
                    });
                    return;
                }

                $ionicPopup.confirm({
                    title: 'Confirmation',
                    template: 'Are you sure want to finish this incubator with ' + remainingDiamond + ' diamonds ?'
                }).then(function (res) {
                    function callback() {
                        $scope.hatchingSlot = AppService.hatchingSlot.getAll();

                        //-- inject tutorial
                        $w.tutorial.next();
                    }
                    if (res) {
                        AppService.hatchingSlot.finishingSlot(slotId, callback);
                    }
                });
            };

            $scope.openFinishedIncubator = function (slotId) {
                //-- validate if population full cannot open incubator
                var _playerInfo = window.izyObject('PlayerInfo').getOne();
                var _playerChars = window.GameApp.CharServices.getPlayerChars();
                if (_playerInfo.maxPopulation < _playerChars.length + 1) {
                    $ionicPopup.alert({ title: 'Alert', template: 'You already reach max population. Please expand your island.' });
                    return false;
                }

                AppService.hatchingSlot.openSlot(slotId, successCallback);
            };

            $scope.expandSlot = function (slotId) {
                var slot = new izyObject('HatchingSlot').get(slotId);
                var playerInfo = new izyObject('PlayerInfo').getOne();
                if (playerInfo.diamondBalance < slot.price) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Alert',
                        template: 'You dont have enough diamond to buy this slot.'
                    });
                    return;
                }

                $scope.myPopup = $ionicPopup.confirm({
                    title: 'Confirmation',
                    template: 'Are you sure want to expand this slot ?'
                }).then(function (res) {
                    function callback() {
                        $scope.hatchingSlot = AppService.hatchingSlot.getAll();
                    }
                    if (res) {
                        AppService.hatchingSlot.purchaseSlot(slotId, callback);
                    }
                });
            };
            $scope.actionButtonIncubatorSlot = function (slotId) {
                var listdata = AppService.hatchingSlot.getAll();
                var slot = {};
                for (var i in listdata) {
                    if (slotId == listdata[i].id) {
                        slot = listdata[i];
                    }
                }

                switch (slot.buttonAction) {
                    case 'finishNow':
                        $scope.finishNowIncubatorSlot(slotId);
                        break;
                    case 'openNow':
                        $scope.openFinishedIncubator(slotId);
                        break;
                    case 'expandSlot':
                        $scope.expandSlot(slotId);
                        break;
                    case 'setPage':
                        $scope.setPage(1);
                        break;
                }
            };

            //-- inject tutorial
            $rootScope.onScene22 = function (fn) {
                var ch = $w.GameApp.rootScope.playerChars[0];
                successCallback(ch);
            };
        })();

        $scope.submitUpdateChar = function () {
            function callback() {
                $scope.closeDetailChar();
                window.GameApp.rootScope.playerChars = window.GameApp.CharServices.getPlayerChars();

                //-- inject notifications
                window.GameApp.LocalNotif.reload();

                //-- inject tutorial
                //$w.tutorial.next();
                $w.tutorial.setScene(24);
            }

            //-- validasi dulu ..


            var params = $scope.data;
            EggService.updatePlayerChar(params, callback);
        };

        $scope.openFreeIncubator = function () {
            $ionicLoading.show();

            function callback() {
                $scope.activateAvailableIncubator();
                $scope.freeIncubator = AppService.incubators.fetchFreeIncubator();
                window.setTimeout(function () {
                    $ionicLoading.hide();
                    $ionicLoading.show({
                        template: "You get one mini incubator.",
                        duration: 2000,
                        noBackdrop: true
                    });
                }, 1000);

                //-- inject notifications
                window.GameApp.LocalNotif.reload();
            }

            AppService.incubators.openFreeIncubator(callback);

        };

        //--# popup business
        (function PopupIonicBusiness($scope) {
            $ionicModal.fromTemplateUrl('tutorial/popup-detail-character.html', {
                scope: $scope,
                animation: 'slide-in-up',
                backdropClickToClose: false,
                hardwareBackButtonClose: false
            }).then(function (modal) {
                $scope.detailCharPopup = modal;
                //$scope.detailCharPopup.show();
            });

            $scope.openDetailChar = function (hatchedChar, callback) {
                //-- fetch data by incubatorId
                $scope.hatchedChar = hatchedChar;
                //console.log(hatchedChar);
                $scope.data.nickname = hatchedChar.nickname;
                //var downloadingImage = new Image();
                //downloadingImage.onload = function () {
                //    var imgSrc = this.src;
                //    $('#hatchedCharImg').attr('src', imgSrc);
                //    $scope.detailCharPopup.show();
                //    callback();
                //};
                //downloadingImage.src = hatchedChar.infoImage;

                $ionicLoading.show();
                window.setTimeout(function () {
                    $scope.detailCharPopup.show();
                    callback();
                    $ionicLoading.hide();
                    $('#shadow-root').remove();
                }, 350);

            };

            $scope.closeDetailChar = function () {
                $scope.detailCharPopup.hide();
            };

            $scope.shareTo = function (socname) {
                window.GameApp.SpreadCode.showQRCode($scope.hatchedChar.code, function () {
                    window.GameApp.SpreadCode.shareToSocialMedia(socname);
                });
            };

        })($scope);
        //--#


        //-- fire once at startup
        window.addEventListener('gameappready', function () {
            $scope.incubators = Incubators.getAll();
            $scope.hatchingSlot = AppService.hatchingSlot.getAll();

            //$('#main-egg-wrapper').click(function () {
            //    if ($scope.isCanHatching == false) {
            //        $scope.enterCode();
            //    }
            //});

            $scope.activateAvailableIncubator();
        });

        window.addEventListener('serverdatetick', function () {
                $scope.freeIncubator = AppService.incubators.fetchFreeIncubator();
                $scope.hatchingSlot = AppService.hatchingSlot.getAll();
            })
    };

    ng.module('gamesapp').factory('EggService', ['$http', '$ionicLoading', '$ionicPopup', EggService]);
    ng.module('gamesapp').controller('EggCtrl', ['$scope', '$ionicLoading', '$ionicModal', '$ionicPopup', '$rootScope',
      'AppService', 'Incubators', 'HatchingSlot', 'EggService', EggController
    ]);

})(window);