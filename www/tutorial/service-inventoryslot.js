(function ($w) {
    'use strict';
    var ng = $w.angular;

    function InventorySlot($rootScope, $ionicLoading, $http) {
        var name = 'InventorySlot';
        var obj = this;

        function getDecor(id) {
            return $w.GameApp.IslandServices.getDecorItem(id);
        };

        obj.__setDummyData = function () {
            izyObject('InventorySlot').reset();

            for (var i = 1; i <= 10; i++) {
                var invslot = {
                    id: i,
                    isEmpty: 1,
                    isAvailable: 1,
                    activeDecorId: 0,
                    imageUrl: ['asset/img/icons/inventory_slot_empty.png', 'asset/img/icons/Locked.png']
                };
                izyObject('InventorySlot').store(invslot);
            }
            for (var j = 11; j <= 25; j++) {
                var invslot = {
                    id: j,
                    isEmpty: 1,
                    isAvailable: 0,
                    activeDecorId: 0,
                    imageUrl: ['asset/img/icons/inventory_slot_empty.png', 'asset/img/icons/Locked.png']
                };
                izyObject('InventorySlot').store(invslot);
            }
        };
        obj.getAvailableSlot = function () {
            var list = obj.fetchAll();
            for (var idx in list) {
                var item = list[idx];
                if (item.isAvailable && item.isEmpty) {
                    return item;
                }
            };
            return;
        };
        obj.addItem = function (decorId) {
            var slot = obj.getAvailableSlot();
            if (!slot) return;
            slot.isEmpty = 0;
            slot.activeDecorId = decorId;

            return izyObject(name).store(slot);
        };
        obj.fetchAll = function () {
            var list = izyObject('InventorySlot').getAll();
            var data = [];
            //list.forEach(function (item) {
            //  //console.log(item);
            //  if (item.isAvailable) {
            //    item.image = item.imageUrl[0];
            //  } else {
            //    item.image = item.imageUrl[1];
            //  }
            //  if (!item.isEmpty) {
            //    var decor = $w.GameApp.IslandServices.getDecorItem(item.activeDecorId);
            //    item.image = decor.imageUrl[0];
            //  }
            //});

            for (var i = 0; i < list.length; i++) {
                var item = list[i];
               //console.log(item);
                //-- jika kosong
                if (item.isAvailable) {
                    item.image = item.imageUrl[0];
                } else {
                    item.image = item.imageUrl[1];
                }

                //-- jika berisi
                if (!item.isEmpty) {
                    if (item.contentType == 'decoration') {
                        var decor = $w.GameApp.IslandServices.getDecorItem(item.activeDecorId);
                        item.image = decor.imageUrl[0];
                    }
                    if (item.contentType == 'equipment') {
                        var eqm = $w.GameApp.IslandServices.getEquipItem(item.eqId);
                        item.image = eqm.imageUrl[0];
                    }
                    
                }
                data.push(item);
            }
            var output = (data).sort(sortById);


            return output;
        };
        obj.getSlot = function (id) {
            return izyObject(name).get(id);
        };
        obj.getTotalAvailableSlot = function () {
            var counter = 0;
            var list = izyObject('InventorySlot').getAll();
            for (var i = 0; i < list.length; i++) {
                if (list[i].isAvailable) {
                    counter += 1;
                }
            }
            return counter;

        };
        obj.save = function (slot) {
            return izyObject(name).store(slot);
        };
        obj.getTotalItemInSlot = function () {
            var counter = 0;
            var list = izyObject('InventorySlot').getAll();
            for (var i = 0; i < list.length; i++) {
                if (!list[i].isEmpty) {
                    counter += 1;
                }
            }
            return counter;
        };
        obj.__purchaseFiveSlot = function (callbackFn) {
            var list = izyObject('InventorySlot').getAll(),
                totalAvailableSlot = obj.getTotalAvailableSlot(),
                fiveItemToPurchase = [],
                counter = 0;

            if (totalAvailableSlot >= list.length) return;

            for (var i = 0; i < list.length; i++) {
                if (counter === 5) break;

                if (!list[i].isAvailable) {
                    list[i].isAvailable = 1;
                    fiveItemToPurchase.push(list[i]);
                    counter += 1;
                }
            }

            izyObject(name).storeAll(fiveItemToPurchase);

            if (typeof (callbackFn) === 'function') {
                callbackFn();
            }

            console.log('purchasing 5 slots');
        };
        obj.purchaseFiveSlot = function (callbackFn) {
            //-- send data to server
            $ionicLoading.show();
            $w.izyObject('InventorySlot').reset();
            $w.izyObject('PlayerInfo').reset();
            var url = $w.GameApp.serverURL + '/island/purchasefiveslot';
            $http.post(url, {}).then(function onSuccess(response) {
                var playerInfo = Object(response.data.PlayerInfo);
                var inventorySlot = response.data.InventorySlot;

                $w.jQuery.each(inventorySlot, function (key, value) {
                    var objData = Object(value);
                    $w.izyObject('InventorySlot').store(objData);
                });

                $w.izyObject('PlayerInfo').store(playerInfo);
                $rootScope.playerInfo = playerInfo;

                callbackFn();
            }, function onFailed(response) {
                //-- on error ??


            }).finally(function onFinally() {
                // callbackFunc();
                $ionicLoading.hide();

            });
        };

        return obj;
    };
    ng.module('gamesapp').factory('InventorySlot', ['$rootScope', '$ionicLoading', '$http', InventorySlot]);
})(window);