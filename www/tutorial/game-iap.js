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

    function requestStoreListing() {
        var androidApplicationLicenseKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtrOQsWiUYfQ65MjUam2zu2DgoBkOsaoelFQHWzRkAT+KHr1xPIOF5JUeQs/XWtNjRI4pavBrRveB3xnoKE+WxvILh4N+3Kl11/i0r9B6/LBae8V8WZpArEIIvh3rgowDGTO0B6sfWO71iP9EStmwziBI4sDOMuPensBSmj8bxj3hhNEzyRJvQbybdNgAD2xoy55+S0kgLHE3PbZwqogJf1pPIGSmhC2SXSrMXoJzxeMxM8/hN7VoVj9VAJxzOE3zR9he9npiDWGLsPnAIXggUN9Ys0h80YjwRl7GHLP0P/itBo28w4+qOqz2E34SFFInAqX7evtrMu3AkfYcX+FPuQIDAQAB";
        var productIds = "470_diamond, 30_diamond";
        var product_info = {};

        window.iap.setUp(androidApplicationLicenseKey);
        window.iap.requestStoreListing(productIds, function (result) {
            for (var i = 0; i < result.length; ++i) {
                var p = result[i];

                product_info[p["productId"]] = {title: p["title"], price: p["price"]};

                alert("productId: " + p["productId"]);
                alert("title: " + p["title"]);
                alert("price: " + p["price"]);
            }
        }, function (error) {
            alert("error: " + error);
        });
    }
    function consumeProduct(_productId) {
        var productId = '470_diamond';

        //consume product id, throw away purchase product id info from server.
        window.iap.consumeProduct(productId, function (result) {
            alert("purchaseProduct");
        },
                function (error) {
                    alert("error: " + error);
                });
    }
    function saveReceipt(receipt) {
        data = receipt;
    }
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
    IAP.products = [];
    IAP.loadProducts = function () {
        if (typeof (store) == 'undefined') {
            return;
        }
        // Let's set a pretty high verbosity level, so that we see a lot of stuff
        // in the console (reassuring us that something is happening).
        store.verbosity = store.DEBUG;

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
    };
    IAP.buy = function (alias) {
        //-- cth : 10_diamonds, 20_diamonds ...
        var productId = findProductId(alias);
        var order = store.order(productId);
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
        var url = window.GameApp.serverURL + '/shop/buy';
        var params = {'platform': IAP.platform,
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