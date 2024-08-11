'use strict';
(function ($w) {
    var ng = $w.angular;
    var $ = $w.jQuery;
    var io = $w.io;

    var ChatCtrl = function (scope, $ionicPopup, EggService) {
        scope.chat = (function () {
            var self = {};
            self.history = [];
            self.eggcodeFilter = function (ctext) {
                var output = ctext;
                var text = String(ctext);
                var arr = text.split(' ');
                for (var j = 0; j < arr.length; j++) {
                    var chars = arr[j];
                    if (chars.toString().substring(0, 1) === '#') {
                        var eggcode = chars.toString().substring(1);
                        if (eggcode.length === 8) {
                            var result = '<span class="eggcode energized" ng-click="checkCode(\'' + eggcode + '\')">' + eggcode + '</span>';
                            output = String(ctext).replace(arr[j], result);
                        }
                    }
                }
                return output;
            };
            self.transformEggcode = function () {
                for (var i = 0; i < scope.chat.history.length; i++) {
                    var chat = scope.chat.history[i];

                    chat.ctext = self.eggcodeFilter(chat.ctext);
                }
                $('span.eggcode').click(function () {
                    var $this = $(this);
                    alert($this.html());
                });
            };
            self.isHaveNewMessage = true;
            return self;
        })();

        scope.form = {};
        scope.rtc = (function () {
            var rtc = {};

            rtc.pid = 0;
            rtc.socket = {};
            rtc.init = function () {
                var uri = (function () {
                    var s = 'http://hatchmarket.southeastasia.cloudapp.azure.com:8080';
                    if (!$w.cordova) {
                        s = 'http://localhost:8080';
                    }
                    return s;
                })();
                rtc.socket = io(uri);
                rtc.socket.on('message', function (msg) {
                    var chat = Object(msg);
                    chat.ctext = scope.chat.eggcodeFilter(chat.ctext);
                    scope.chat.history.unshift(chat);
                    
                    if(!scope.sliding.isShow){
                        scope.chat.isHaveNewMessage = true;
                    }
                });
                rtc.socket.on('history', function (data) {
                    if (scope.chat.history.length === 0) {
                        scope.chat.history = data;

                        scope.chat.transformEggcode();
                    }

                });

                rtc.pid = $w.GameApp.sessid.toString().split('-')[0];
            };

            return rtc;
        })();
        scope.sliding = (function () {
            var sliding = {};
            sliding.isShow = false;
            sliding.show = function () {
                $('#side-chat').css({'left': '0'});
                $('#menu-backdrop').addClass('active');
                sliding.isShow = true;
                scope.chat.isHaveNewMessage = false;
            };
            sliding.hide = function () {
                var lebar = $('#chat-wrapper').width();
                $('#side-chat').css({'left': '-' + lebar + 'px'});
                $('#menu-backdrop').removeClass('active');
                sliding.isShow = false;
            };
            sliding.toggle = function () {
                if (sliding.isShow) {
                    sliding.hide();
                } else {
                    sliding.show();
                }
            };
            return sliding;
        })();
        scope.submitChat = function () {
            if (!scope.form.text) {
                return;
            }
            var chat = {
                pid: scope.rtc.pid,
                cuser: $w.GameApp.rootScope.playerInfo.playerId,
                ctext: scope.form.text
            };
            scope.form.text = null;
            scope.rtc.socket.emit('message', chat);
        };

        scope.checkCode = function (code) {
            var onSuccess = function () {
                var nextUrl = 'app.html?eggcode=' + code;
                $w.GameApp.ionicLoading.hide();
                $ionicPopup.confirm({
                    title: 'Confirmation',
                    template: 'Are you sure want to use ' + code + ' ?'
                }).then(function (res) {
                    if (res) {
                        $w.location = nextUrl;
                    }
                });
            };
            var onFail = function () {

            };
            scope.sliding.hide();
            EggService.validateCodeOnServer(code, onSuccess, onFail);
        };

        $w.addEventListener('gameappready', function () {
            scope.rtc.init();
            scope.sliding.hide();
            $('#menu-backdrop').click(scope.sliding.hide);
            $w.setTimeout(function () {
                $('#side-chat').css({'opacity': 1, 'height': window.innerHeight + 'px'});

                var sisa = Number($w.innerHeight) - Number($('#chat-form').height());

                $('#chat-history').css({'height': (sisa - 10) + 'px'});

            }, 2000);
        });

        $w.GameApp.RTC = scope.rtc;
    };
    ng.module('gamesapp').directive('compile', ['$compile', function ($compile) {
            return function (scope, element, attrs) {
                scope.$watch(
                        function (scope) {
                            // watch the 'compile' expression for changes
                            return scope.$eval(attrs.compile);
                        },
                        function (value) {
                            // when the 'compile' expression changes
                            // assign it into the current DOM
                            element.html(value);

                            // compile the new DOM and link it to the current
                            // scope.
                            // NOTE: we only compile .childNodes so that
                            // we don't get into infinite loop compiling ourselves
                            $compile(element.contents())(scope);
                        }
                );
            };
        }]);
    ng.module('gamesapp').controller('ChatCtrl', ['$scope', '$ionicPopup', 'EggService', ChatCtrl]);
})(this);


