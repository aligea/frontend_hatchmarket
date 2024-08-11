/** Main Page Controller **/
(function MainClass(w) {
  var angular = w.angular;

  function MainCtrl(rootScope, scope, AppService, ionicSlideBoxDelegate) {
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

    w.addEventListener('gameappready', function () {
      scope.setSlide(scope.activePage);
    });
  }


  angular.module('gamesapp').controller('MainCtrl', ['$rootScope', '$scope', 'AppService', '$ionicSlideBoxDelegate', MainCtrl]);
})(this);