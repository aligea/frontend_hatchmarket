var APP = angular.module('gamesapp', ['ionic']);
var globalVar = {
    appName : 'GamesApp',
    baseUrl : 'http://izywebhost.com/wiraland-attendance',
    sql : "",
    karyawan : {},
    imagelog : "",
    waktuServer : {
        sqlFormat : "2015-12-23 16:13:15",
        value : '',
        datestring : '',
        timestring : ''
    },
    dbOptions : {
        name : 'GamesApp.db',
        location : 1
    },
    dbError : function(SQLError){
        alert('Error : ' + SQLError.message);
    },
    dbSuccess : function(){
        console.log('DB Ready to use');
    },
    querySuccess : function(){

    }
};
var db = (window.sqlitePlugin) ? window.sqlitePlugin.openDatabase(globalVar.dbOptions, globalVar.dbSuccess, globalVar.dbError) : window.openDatabase(globalVar.dbOptions.name, '1.0', globalVar.appName, 10 * 1024 * 1024);

//-- konfigurasi umum /  router aplikasi
APP.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider){
    $stateProvider.state('main', {
        url: '/main',
        abstract: false,
        templateUrl: 'templates/main.html',
        controller: MainCtrl
    });
   

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/main');
    $ionicConfigProvider.views.maxCache(0);
});

APP.run(function($ionicPlatform){
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
          // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
          // for form inputs)
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

          // Don't remove this line unless you know what you are doing. It stops the viewport
          // from snapping when text inputs are focused. Ionic handles this internally for
          // a much nicer keyboard experience.
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
    });
});

function izyObject(name) {
    var objectRoot = (globalVar.appName) ? globalVar.appName : 'db_';
    var setObjectName = function (name) {
        _objectName = objectRoot + '_' + name + '_';
        return _objectName;
    }
    var _objectName = setObjectName(name);

    return {
        objectName: function (name) {
            _objectName = objectRoot + '_' + name + '_';
            return _objectName;
        },
        getAll: function () {
            var objectData = [];
            for (var key in localStorage) {
                if (key.indexOf(_objectName) == 0) {
                    objectData.push(JSON.parse(localStorage[key]));
                }
            }
            //console.dir(objectData);
            return objectData;
        },
        get: function (objectId) {
            if (localStorage[_objectName + i]) {
                return JSON.parse(localStorage[_objectName + i]);
            }
        },
        getOne : function(){
            var obj = this.getAll();
            return (obj.length > 0) ? obj[0] : {};
        },
        delete: function (objectId) {
            localStorage.removeItem(_objectName + objectId);
        }, 
        store: function (obj) {
            if (!obj.hasOwnProperty('id')) {
                var objectData = this.getAll();
                var highest = 0;
                for (var i = 0; i < objectData.length; i++) {
                    if (objectData[i].id > highest) {
                        highest = objectData[i].id;
                    }
                }
                obj.id = ++highest;
            }

            localStorage[_objectName + obj.id] = JSON.stringify(obj);
        },
        reset: function () {
            var objectData = this.getAll();
            for (var idx in objectData) {
                var obj = objectData[idx];
                this.delete(obj.id);
            }
        }, 
        findOne: function (field, value) {
            var objectData = this.getAll();
            var result;
            for (var index in objectData) {
                var obj = objectData[index];
                for (var propertyObj in obj) {
                    if (propertyObj == field) {
                        if (value == obj[propertyObj]) {
                            return obj;
                        }
                    }
                }
            }
            return result;
        }, 
        storeAll: function (objectArray) {
            for (var index in objectArray) {
                this.store(objectArray[index]);
            }
        }
    };
}