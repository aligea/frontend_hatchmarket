/** Main Page Controller **/
(function MainClass(w) {
    var angular = w.angular;

    function MainCtrl(rootScope, scope, AppService, ionicSlideBoxDelegate, ionicPopup) {
        rootScope.playerChars = [];

        scope.activePage = 2;
        rootScope.setSlide = function (index) {
            ionicSlideBoxDelegate.slide(index);
            scope.setActivePage(index);
        };
        scope.slideChanged = function (index) {
            //ionicTabsDelegate.select(index);
            scope.setActivePage(index);

        };
        scope.setActivePage = function (index) {
            if ($(".bottomNav li").eq(index).hasClass('active')) {
                return;
            }

            $('.iconmenu.noActive').show();
            $('.iconmenu.onActive').hide();
            $(".bottomNav li").removeClass('active');
            $(".bottomNav li").eq(index).addClass('active');
            $(".bottomNav li.active .iconmenu.noActive").hide();
            $(".bottomNav li.active .iconmenu.onActive").show();

            if (index === 2) {
                $('.incubators.animated').show();
            } else {
                $('.incubators.animated').hide();
            }
            ;

            if (index === 4) {
                rootScope.refreshSharePlayerChars();
            }

        };
        scope.deleteAccount = AppService.deleteAccount;

        //--inject untuk tutorial
        scope.formdata = {};
        scope.startTutorial = function () {
            scope.formdata.username = '';
            thisPopup = ionicPopup.show({
                title: 'Enter Username :',
                templateUrl: 'tutorial/popup-setting.html',
                scope: scope
            });


        };
        scope.saveSetting = function () {
            window.GameApp.ionicLoading.show();
            var iurl = window.GameApp.serverURL + '/update-username';
            var request = window.GameApp.http.post(iurl, { username: scope.formdata.username });
            request.success(function () {
                window.GameApp.rootScope.reloadPlayerData();
            });
            request.finally(function () {
                window.GameApp.ionicLoading.hide();
                thisPopup.close();

                window.tutorial.setScene(0);
                $('#tutorial-section').show();
            });
        };

        w.addEventListener('gameappready', function () {
            scope.setSlide(scope.activePage);
            ionicSlideBoxDelegate.enableSlide(false);
            ionicSlideBoxDelegate.stop();

            scope.startTutorial();
        });
    }

    angular.module('gamesapp').controller('MainCtrl', ['$rootScope', '$scope', 'AppService', '$ionicSlideBoxDelegate', '$ionicPopup', MainCtrl]);
})(this);