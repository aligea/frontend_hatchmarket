(function FirstRun($w) {
	var templateModules = [
	  'templates/page-main.html',
	  'templates/page-shop.html',
	  'templates/page-egg.html',
	  'templates/page-share.html',
	  'templates/page-redeem.html',
	  'templates/page-island.html',
	  'templates/page-char.html'
	  //'templates/template.html'
	];
	var totalTemplateToLoad = templateModules.length;
	var mainSwiper = {};
	var $ionicPlatform;

	function onIonicReady() {
		if (window.cordova && window.cordova.plugins.Keyboard) {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

			// Don't remove this line unless you know what you are doing. It stops the viewport
			// from snapping when text inputs are focused. Ionic handles this internally for
			// a much nicer keyboard experience.
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
			StatusBar.hide();
		}

		/** Handling back button to exit **/
		$ionicPlatform.registerBackButtonAction(function () {
			if (window.cordova && window.cordova.plugins.Keyboard && window.cordova.plugins.Keyboard.isVisible) {
				cordova.plugins.Keyboard.close();
				return;
			}

			//if ($w.document.getElementById('gameLayout').style.display == 'none') {
			//    var confirm = $w.confirm('Exit app ?');
			//    if (confirm) {
			//        $w.navigator.app.exitApp();
			//    }
			//}

			//-- jika ada di main layout, tekan tombol back maka konfirmasi mau exit gak
			navigator.notification.confirm('Exit App ?', function (confirm) {
				if (confirm == 1) {
					window.navigator.app.exitApp();
				}
			}, 'Confirmation', ['Exit', 'Cancel']);
			
		}, 100);

		function keyBoardHandler(e) {
			if (window.StatusBar) {
				StatusBar.hide();
				window.focus();
			}
		}

		window.addEventListener('native.keyboardshow', function () {
			$('.popup-container').css({
				'position': 'relative',
				'padding-top': '15%'
			});

			$('#inputNicknameForm').addClass('onKeyboardShow');
			keyBoardHandler();
		});
		window.addEventListener('native.keyboardhide', function () {
			$('.popup-container').css({
				'position': 'absolute',
				'padding-top': 'initial'
			});
			$('#inputNicknameForm').removeClass('onKeyboardShow');
			keyBoardHandler();
		});


		var waitingT;
		window.addEventListener('pause', function () {
		   // window.GameApp.Sounds.bgm1().pause();

			waitingT = window.setTimeout(function () {
				$w.navigator.app.exitApp();
			}, 60000);
		});
		window.addEventListener('resume', function () {
			window.clearTimeout(waitingT);
			//window.GameApp.Sounds.bgm1().play();
			//window.open('index.html', '_self');
		});
	};

	function onModuleLoaded($rootScope, AppService) {
		$rootScope.playerChars = [];
		$rootScope.playerInfo = {};

		var loadedTemplate = 0;
		$rootScope.$on("$includeContentLoaded", function (event, templateName) {
			//console.log(templateName);
			loadedTemplate += 1;
			//console.log(loadedTemplate, templateName, totalTemplateToLoad);

			if (loadedTemplate === totalTemplateToLoad) {
				// initializeSwiper();
				//$w.GameApp.Run(AppService.initApp);

			}
		});

		$w.GameApp.rootScope = $rootScope;
		//AppService.initApp();
	};

	function InitializeModule(a, l, i, $http, $ionicLoading) {
		$ionicPlatform = a;
		$w.GameApp.Services = i;
		$w.GameApp.http = $http;
		$w.GameApp.ionicLoading = $ionicLoading;
	
		a.ready(function () {
			onIonicReady();
			//window.setTimeout(function () { $w.GameApp.Run(i.initApp); }, 1000);
			$w.GameApp.Run(i.initApp);
			l.playerChars = [];
			$w.GameApp.rootScope = l;
		});


		$http.defaults.transformRequest = function (_data) {
			if (_data === undefined) {
				return _data;
			}

			var data = Object(_data);
			data.sessid = $w.GameApp.getSess();
			//console.log($w.GameApp.getSess());
			return $.param(data);
		}
	};
	function ConfigurationModule($httpProvider) {
		$httpProvider.defaults.transformRequest = function (_data) {
			if (_data === undefined) {
				return _data;
			}

			var data = Object(data);
			data.sessid = $w.GameApp.getSess();
			console.log($w.GameApp.getSess());
			return $.param(data);
		}
		$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8;';
	};


	$w.angular.module('gamesapp', ['ionic', 'ngCordova']).run(['$ionicPlatform', '$rootScope', 'AppService', '$http', '$ionicLoading', InitializeModule]);
	$w.angular.module('gamesapp').config(['$httpProvider', ConfigurationModule]);
})(window);




(function xmiLoading($w, $) {
	var gmPopup = {};

	var gmLoading = {
		show: function (options) {
			$w.document.getElementById('gmLoader').style.visibility = 'visible';

			if (options) {
				if (options.duration) {
					$w.setTimeout(gmLoading.hide, options.duration);
				}

			}
		},
		hide: function (callbackFunction) {
			$w.document.getElementById('gmLoader').style.visibility = 'hidden';
			if (callbackFunction && typeof (callbackFunction) == 'function') {
				callbackFunction();
			}
		}
	};


	var enviLoading = {
		show: function (options) {
			if (options.template) {
				$('#enviLoader .loading').html(options.template);
			}
			if (options.duration) {
				$w.setTimeout(enviLoading.hide, options.duration);
			}
			gmLoading.hide();
			$w.document.getElementById('enviLoader').style.visibility = 'visible';
		},
		hide: function (callbackFunction) {
			$w.document.getElementById('enviLoader').style.visibility = 'hidden';
			if (callbackFunction && typeof (callbackFunction) == 'function') {
				callbackFunction();
			}
		}
	};


	$w.gmLoading = gmLoading;
	$w.gmPopup = gmLoading;
	$w.enviLoading = enviLoading;

	// $w.setTimeout(function() {
	//   $w.gmLoading.show({ duration: 500 });
	// }, 500);
})(this, this.jQuery);


//(function xmiSwipeDetect($w) {

//  function swipedetect(el, callback) {

//    var touchsurface = el,
//      swipedir,
//      startX,
//      startY,
//      distX,
//      distY,
//      threshold = 150, //required min distance traveled to be considered swipe
//      restraint = 100, // maximum distance allowed at the same time in perpendicular direction
//      allowedTime = 300, // maximum time allowed to travel that distance
//      elapsedTime,
//      startTime,
//      handleswipe = callback || function (swipedir) { }

//    touchsurface.addEventListener('touchstart', function (e) {
//      var touchobj = e.changedTouches[0]
//      swipedir = 'none'
//      dist = 0
//      startX = touchobj.pageX
//      startY = touchobj.pageY
//      startTime = new Date().getTime() // record time when finger first makes contact with surface
//      e.preventDefault()
//    }, false)

//    touchsurface.addEventListener('touchmove', function (e) {
//      e.preventDefault() // prevent scrolling when inside DIV
//    }, false)

//    touchsurface.addEventListener('touchend', function (e) {
//      var touchobj = e.changedTouches[0]
//      distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
//      distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
//      elapsedTime = new Date().getTime() - startTime // get time elapsed
//      if (elapsedTime <= allowedTime) { // first condition for awipe met
//        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
//          swipedir = (distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
//        } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
//          swipedir = (distY < 0) ? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
//        }
//      }
//      handleswipe(swipedir)
//      e.preventDefault()
//    }, false)
//  }

//  $w.swipeDetector = swipedetect;

//  $w.load = function () {
//    var el = $w.document.getElementById('environtment-1');
//    swipeDetector(el, function (swipedir) {
//      console.log(swipedir);
//    });
//  }
//})(this);

//(function xmiRefresh($w) {
//  function clear() {
//    var els = document.getElementsByTagName('canvas');
//    for (var i in els) {
//      var old_element = els[i];
//      var new_element = old_element.cloneNode(true);
//      old_element.parentNode.replaceChild(new_element, old_element);
//    }

//  }
//  $w.refreshCanvas = clear;
//  $w.refreshListener = function () {
//    var els = document.getElementsByTagName('div');
//    for (var i in els) {
//      var old_element = els[i];
//      var new_element = old_element.cloneNode(true);
//      //old_element.parentNode.replaceChild(new_element, old_element);
//    }
//  }
//})(this);

