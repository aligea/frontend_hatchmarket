/** Help Char Page Controller **/
(function HelpCharClass(w) {
    'use strict';
    var angular = w.angular,
            $ = w.jQuery;
    function HelpCharCtrl(scope, ionicPopup) {
        scope.helpChar = function () {
            scope.char = ionicPopup.show({
                title: 'CHARACTERS',
                templateUrl: 'templates/popup-help-character.html',
                scope: scope
            });
        }
    }

    angular.module('gamesapp').controller('HelpCharCtrl', ['$scope', '$ionicPopup', HelpCharCtrl]);
})(this);

(function HelpEggClass(w) {
    'use strict';
    var angular = w.angular,
            $ = w.jQuery;

    function HelpEggCtrl(scope, ionicPopup) {
        scope.helpEgg = function () {
            scope.egg = ionicPopup.show({
                title: 'EGGCODE',
                templateUrl: 'templates/popup-help-eggcode.html',
                scope: scope
            });
        }
    }
    angular.module('gamesapp').controller('HelpEggCtrl', ['$scope', '$ionicPopup', HelpEggCtrl]);
})(this);

(function HelpIslClass(w) {
    'use strict';
    var angular = w.angular,
            $ = w.jQuery;

    function HelpIslCtrl(scope, ionicPopup) {
        scope.helpIsl = function () {
            scope.isl = ionicPopup.show({
                title: 'ISLAND',
                templateUrl: 'templates/popup-help-island.html',
                scope: scope
            });
        }

    }
    ;

    angular.module('gamesapp').controller('HelpIslCtrl', ['$scope', '$ionicPopup', HelpIslCtrl]);
})(this);

(function SettingClass(w) {
    'use strict';
    var angular = w.angular,
            $ = w.jQuery;
    var thisPopup = {};

    function SettingCtrl(scope, ionicPopup, rootScope, $ionicModal, $ionicSlideBoxDelegate) {
        scope.showSetting = function () {
            scope.isSetting = true;
        };
        scope.closeSetting = function () {
            scope.isSetting = false;
            thisPopup.close();
        };

        scope.isMusicOn = true;
        scope.imageMusic1 = "asset/img/icons/Music_ON.png";
        scope.imageMusic2 = "asset/img/icons/Music_OFF.png";
        scope.musicChange = function () {
            if (scope.isMusicOn === true) {
                scope.isMusicOn = false;
            } else {
                scope.isMusicOn = true;
            }
        };

        scope.isLanguage = true;
        scope.imageLanguage1 = "asset/img/icons/Language_ENG.png";
        scope.imageLanguage2 = "asset/img/icons/Language_IND.png";
        scope.languageChange = function () {
            if (scope.isLanguage === true) {
                scope.isLanguage = false;
            } else {
                scope.isLanguage = true;
            }
        };

        scope.formdata = {};
        scope.version = window.GameApp.version;
        scope.openSetting = function () {
            var pref = window.izyObject('preference').get(1);
            scope.formdata.username = rootScope.playerInfo.playerId;
            scope.isLanguage = (pref.lang == 'en') ? true : false;
            scope.isMusicOn = (pref.music == 'on') ? true : false;
            scope.gameAccount = pref.connectedAccountId;
            thisPopup = ionicPopup.show({
                title: 'Settings',
                templateUrl: 'templates/popup-setting.html',
                scope: scope
            });
        };
        scope.saveSetting = function () {
            var preferenceOld = window.clone(window.izyObject('preference').get(1));
            var preference = window.clone(preferenceOld);

            preference.username = scope.formdata.username;
            preference.music = (scope.isMusicOn) ? 'on' : 'off';
            preference.lang = (scope.isLanguage) ? 'en' : 'id';
            window.izyObject('preference').store(preference);

            if (String(preference.username).toLowerCase() != String(window.GameApp.rootScope.playerInfo.playerId).toLowerCase()) {
                //-- update nama username baru ke database server
                window.GameApp.ionicLoading.show();
                var iurl = window.GameApp.serverURL + '/update-username';
                var request = window.GameApp.http.post(iurl, {username: preference.username});
                request.success(function () {
                    window.GameApp.rootScope.reloadPlayerData();
                });
                request.finally(function () {
                    window.GameApp.ionicLoading.hide();
                });
            }


            if (preference.music != preferenceOld.music) {
                if (preference.music == 'on') {
                    window.GameApp.loadSound('main');
                } else {
                    window.GameApp.stopBGM();
                }
            }

            window.GameApp.preference = preference;
            thisPopup.close();
            console.log(preference);
        };

        //--# popup business
        (function PopupIonicBusiness($scope) {
            $scope.tutorialAssets = [];
            for (var i = 1; i <= 20; i++) {
                //-- inject penyesuaian karna ada gambar yg sama
                if (i === 12) {
                    continue;
                }
                $scope.tutorialAssets.push('tutorial/tutorial-island/tutorial-island-' + i + '.png');
            }
            $ionicModal.fromTemplateUrl('tutorial/tutorial-island/island-tutorial.html', {
                scope: $scope,
                animation: 'slide-in-up',
                backdropClickToClose: false,
                hardwareBackButtonClose: false
            }).then(function (modal) { 
                $scope.tutorialPopup = modal;
            });
            $scope.openTutorialPopup = function () {
                $scope.closeSetting();
                $scope.tutorialPopup.show();
                $ionicSlideBoxDelegate.$getByHandle('islandTutorial').slide(0);
            };
            $scope.closeTutorialPopup = function () {
                $scope.tutorialPopup.hide();
            };
                        
        })(scope);
        //--#
    }


    angular.module('gamesapp')
    .controller('SettingCtrl', 
    ['$scope', '$ionicPopup', '$rootScope', '$ionicModal', '$ionicSlideBoxDelegate', SettingCtrl]);
})(this);

(function MusicClass(w) {
    'use strict';
    var angular = w.angular,
            $ = w.jQuery;


    function MusicCtrl(scope) {
        scope.MusicOn = function () {
            scope.isSetting = true;
        };
        scope.CloseSetting = function () {
            scope.isSetting = false;
        };
    }
    angular.module('gamesapp').controller('MusicCtrl', ['$scope', MusicCtrl]);
})(this);
