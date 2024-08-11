(function (global) {
    'use strict';
    var account = {};

    account.data = '';
    account.init = function (callback) {
        global.game.setUp();

        if (!window.game.isLoggedIn()) {
            window.game.login();
        }

        //callback
        window.game.onLoginSucceeded = function (result) {
            var playerDetail = result;
            var pref = global.izyObject('preference').get(1);
            
            pref.connectedAccountId = playerDetail['playerId'];
            window.izyObject('preference').store(pref);
            window.GameApp.preference = pref;
            if(typeof callback === 'function'){
                console.log(window.GameApp.preference);
                callback();
            }
            
            console.log('success login to game center', result);
            //alert('onLoginSucceeded: ' + playerDetail['playerId'] + ' ' + playerDetail['playerDisplayName']);
            //console.log(result);
        };

        window.game.onLoginFailed = function () {
            console.log('failed login to game center');
            if(typeof callback === 'function'){
                callback();
            }
        };
    };

    global.GameApp.Account = account;
})(this);