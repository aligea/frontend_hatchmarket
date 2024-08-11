(function IAP(window) {
    var w = window,
            $ = window.jQuery;

    var IAP = {};
    //var store = {};
    var productIds = [
        {
            id: "10_diamonds",
            alias: "10_diamonds",
            type: "consumable"
        },
        {
            id: "20_diamonds",
            alias: "20_diamonds",
            type: "consumable"
        },
        {
            id: "40_diamonds",
            alias: "40_diamonds",
            type: "consumable"
        },
        {
            id: "60_diamonds",
            alias: "60_diamonds",
            type: "consumable"
        },
        {
            id: "85_diamonds",
            alias: "85_diamonds",
            type: "consumable"
        },
        {
            id: "130_diamonds",
            alias: "130_diamonds",
            type: "consumable"
        },
        {
            id: "180_diamonds",
            alias: "180_diamonds",
            type: "consumable"
        },
        {
            id: "370_diamonds",
            alias: "370_diamonds",
            type: "consumable"
        }
    ];
    var data = {};
    var selectedProductId = '';
    var lastTrans = '';
    var productInStore = [];

    function findProductId(alias) {
        for (var i = 0; i < IAP.products.length; i++) {
            var text = String(IAP.products[i].id);
            var res = text.split('.');
            if (res[res.length - 1] == alias) {
                return IAP.products[i].id;
            }
        }
        return false;
    }

    IAP.platform = 'android';
    IAP.products = productIds;
    IAP.loadProducts = function () {
        if (IAP.platform == 'ios') {
            if (typeof (inAppPurchase) == 'undefined') {
                return;
            }
            var thisProductIds = [];
            for (var i = 0; i < IAP.products.length; i++) {
                thisProductIds.push(IAP.products[i].id);
            }
            
            console.log(thisProductIds);
            inAppPurchase.getProducts(thisProductIds).then(function (products) {
                productInStore = products;
                console.log(products);
            }).catch(function (err) {
                console.log(err);
            });

        } else if (IAP.platform === 'android') {
            if (typeof (store) == 'undefined') {
                return;
            }
            // Let's set a pretty high verbosity level, so that we see a lot of stuff
            // in the console (reassuring us that something is happening).
            store.verbosity = store.QUIET;

            console.log('loading product in store');

            // We register a dummy product. It's ok, it shouldn't
            // prevent the store "ready" event from firing.

            for (var i = 0; i < IAP.products.length; i++) {
                store.register(IAP.products[i]);
                //store.when(IAP.products[i].id).approved(IAP.readyToGo);
            }

            store.sandbox = true;

            // When every goes as expected, it's time to celebrate!
            // The "ready" event should be welcomed with music and fireworks,
            // go ask your boss about it! (just in case)
            store.ready(function () {
                console.log("\\o/ STORE READY \\o/");
                //alert('Store is ready');
            });

            // After we've done our setup, we tell the store to do
            // it's first refresh. Nothing will happen if we do not call store.refresh()
            store.refresh();

            // Log all errors
            store.error(function (error) {
                log('ERROR ', error);
            });
        }


    };
    IAP.buy = function (alias) {
        //-- cth : 10_diamonds, 20_diamonds ...
        var productId = findProductId(alias);

        if (IAP.platform == 'android') {
            var order = store.order(productId);

            lastTrans = null;

            //window.GameApp.ionicLoading.show();
            order.then(function (what) {
                console.log(what);
                console.log('success order');
                //window.GameApp.ionicLoading.hide();
            });
            order.error(function (e) {
                console.log('fail error');
                console.log(e);
                //window.GameApp.ionicLoading.hide();
            });

            console.log('purchasing ' + productId);
            selectedProductId = alias;
            store.when(productId).approved(IAP.readyToGo);
        } else if (IAP.platform == 'ios') {
            var thisTransaction = {};
            selectedProductId = alias;
            inAppPurchase.buy(productId).then(function (data) {
                console.log(JSON.stringify(data));
                // The consume() function should only be called after purchasing consumable products
                // otherwise, you should skip this step
                thisTransaction = data;
                return inAppPurchase.consume(data.type, data.receipt, data.signature);
            }).then(function () {
                console.log('consume done!');

                var receipt = thisTransaction.receipt || '';
                var signature = thisTransaction.signature || '';
                //alert(receipt);

                var transaction = thisTransaction;
                var url = window.GameApp.serverURL + '/shop/buy';
                var params = {
                    'platform': IAP.platform,
                    'product': selectedProductId,
                    'transaction': transaction,
                    'signature': signature,
                    'receipt': receipt
                };
                var request = window.GameApp.http.post(url, params);
                window.GameApp.ionicLoading.show();
                request.success(function (data, status, header, config) {
                    if (data.status == 'OK') {
                        window.izyObject('PlayerInfo').reset();
                        window.izyObject('PlayerInfo').store(data.PlayerInfo);
                        window.GameApp.rootScope.playerInfo = data.PlayerInfo;
                        //product.finish();
                        //store.refresh();
                        window.navigator.notification.alert('Success purchased diamonds');
                    }
                });
                request.finally(function () {
                    w.GameApp.ionicLoading.hide();
                });

            }).catch(function (err) {
                console.log(err);
                //window.navigator.notification.alert('Error when purchasing in store.');
            });
        }

    };
    IAP.makeRequest = function (product) {
        //-- send request with token available
    };
    IAP.readyToGo = function (product) {
        /* if anyone can hack this, but make sure diamond balance of player on the server not effected */
        //product.verify();
        console.log('im here ', product);
        var receipt = product.transaction.receipt || '';
        var signature = product.transaction.signature || '';
        //alert(receipt);

        var transaction = product.transaction;

        if (lastTrans === transaction.purchaseToken) {
            return;
        }
        lastTrans = transaction.purchaseToken;

        var url = window.GameApp.serverURL + '/shop/buy';
        var params = {
            'platform': IAP.platform,
            'product': selectedProductId,
            'transaction': transaction,
            'signature': signature,
            'receipt': receipt
        };
        var request = window.GameApp.http.post(url, params);
        window.GameApp.ionicLoading.show();
        request.success(function (data, status, header, config) {
            if (data.status == 'OK') {
                window.izyObject('PlayerInfo').reset();
                window.izyObject('PlayerInfo').store(data.PlayerInfo);
                window.GameApp.rootScope.playerInfo = data.PlayerInfo;
                product.finish();
                store.refresh();
                window.navigator.notification.alert('Success purchased diamonds');
            }
        });
        request.finally(function () {
            w.GameApp.ionicLoading.hide();
        });
    };
    IAP.loadReceipt = function () {
        return data;
    };

    //-- sisip inject deklarasi produk
    w.document.addEventListener('deviceready', function () {
        IAP.platform = String(window.device.platform).toLowerCase();
        IAP.products = [];
        for (var i = 0; i < productIds.length; i++) {
            var item = productIds[i];
            if (IAP.platform == 'ios') {
                item.id = 'com.10multindo.hatchmarket.' + productIds[i].id;
                item.alias = item.id;
            }
            IAP.products.push(item);
        }
        IAP.loadProducts();
    });
    w.GameApp.IAP = IAP;
})(window);