/** Show Page Controller **/
(function ShopClass(window, ng, $) {
    'use strict';
    var $w = window,
    ng = window.angular,
    $ = window.jQuery;
    

    function ShopCtrl($scope, $rootScope, $ionicModal, $ionicPopup, AppService) {
        // pengaturan untuk shop: diamonds, incubator, dan best deal.
        //-- declaration default object
        $scope.clickedIncubator = {};
        $scope.detailIncubatorShopPopupCoin = {};
        $scope.detailIncubatorShopPopup = {};
        $scope.shopItem = [
            '10_diamonds',
            '20_diamonds',
            '40_diamonds',
            '60_diamonds',
            '85_diamonds',
            '130_diamonds',
            '180_diamonds',
            '370_diamonds'
        ];
        $scope.activeIncubator = {};
        $scope.myPopup = {};
        $scope.setPage = function (index) {
            if ($("#shopTab-" + index).hasClass('active')) {
                return;
            }
            $('.shopPageContent').hide();
            $('#shopPage-' + index).fadeIn('fast');

            $('#shopPageNav li').removeClass('active')
            $("#shopTab-" + index).addClass('active');
        };
        $scope.incubatorData = [];

        function fetchIncubatorData() {
            var output = [];
            var arrayData = $w.izyObject('IncubatorBalance').getAll();
            arrayData = arrayData.sort($w.sortById);

            var _data = [];
            var outputArray = [];
            var totalColumnPerRow = 3;
            var rowIdx = 0;

            _data = arrayData;

            var row = [];
            for (var i = 0; i < _data.length; i++) {
                if (i % totalColumnPerRow === 0 && i !== 0) {
                    rowIdx++;
                }
                if (!outputArray[rowIdx]) {
                    outputArray[rowIdx] = {};
                    outputArray[rowIdx].dataColumn = [];
                }
                outputArray[rowIdx].dataColumn.push(_data[i]);
            }
            ;

            //-- normalisasi data
            //for (var j = 0; j < outputArray.length; j++) {
            //  var dataRow = outputArray[j];
            //  var numberOfColumn = dataRow.dataColumn.length;

            //  if (numberOfColumn < totalColumnPerRow) {
            //    for (var k = numberOfColumn; k < totalColumnPerRow; k++) {
            //      var obj = {};
            //      dataRow.dataColumn.push(obj);
            //    }
            //  }
            //}

            return outputArray;
        };

        $scope.actionButtonDiamondShop = $w.GameApp.IAP.buy;
        $scope.AppendText = function () {
            var myEl = ng.element(document.querySelector('#divID'));
            myEl.append($w.GameApp.IAP.loadReceipt);
        };

        $scope.onPurchaseIncubators = function (incID) {
            var _incID = Object(incID);
            $w.GameApp.EggBusiness.onPurchaseIncubators(_incID);
            $scope.myPopup.close();
        };

        $scope.openDetailIncubatorShopPopup = function (incubatorShopId) {
            $scope.activeIncubator = new izyObject('IncubatorBalance').get(incubatorShopId);

            $scope.myPopup = $ionicPopup.show({
                title: $scope.activeIncubator.name,
                subTitle: "<div> <img src='" + $scope.activeIncubator.level + "'</div><div>" + $scope.activeIncubator.level_name + "</div>",
                templateUrl: 'templates/popup-detail-incubatorshop.html',
                scope: $scope
            });
        };

        $rootScope.goToShopBuyDiamond = function () {
            $rootScope.setSlide(0);
            $scope.setPage(1);
        };

        $w.addEventListener('gameappready', function () {
            $scope.incubatorData = fetchIncubatorData();
        });
    }

    ng.module('gamesapp').controller('ShopCtrl', ShopCtrl);
})(window);