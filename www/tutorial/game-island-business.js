(function IslandBusiness(win) {
    'use strict';
    var _this = {},
      $ionicLoading = {},
      $http = {},
    $w = win;
    var $ = win.jQuery;

    var $rootScope = {};
    var scopeEnvi = {};
    var regionData = {};
    var decorationData = [];

    function checkAvailabilityChar(playerChar, targetName, jobName) {
        var availability = false;
        var targets = playerChar.action.target;
        var abilities = playerChar.action.ability;
        var isCharCanDoTheJob = false;
        var isCharDoingJob = false;

        //-- cek si char tsb punya ability sesuai parameter gak
        if (targets.indexOf(targetName) >= 0
                && abilities.indexOf(jobName) >= 0
                && regionData[targetName].isWorking == 0) {
            isCharCanDoTheJob = true;
        }

        //-- cek apakah si char tsb lagi nge job gak
        for (var tname in regionData) {
            if (regionData[tname].farmingStatus == 2 || regionData[tname].farmingStatus == 4) {
                if (regionData[tname].workingPlayerCharId == playerChar.id && regionData[tname].isWorking == 1) {
                    isCharDoingJob = true;
                }
            }
        }

        //-- validasi result disni
        if (isCharCanDoTheJob && !isCharDoingJob) {
            availability = true;
        }
        //console.log(jobName);
        return availability;
    };

    _this.setup = function (ionicLoading, http, scope) {
        $ionicLoading = ionicLoading;
        $http = http;
        scopeEnvi = scope;
    };
    _this.getRegionData = function () {
        return regionData;
    };
    _this.getDecorationData = function () {
        return decorationData;
    };

    /**
    * @param integer regionId
    * @param function callback function
    */
    _this.fetchRegionData = function (regionId, callback) {
        var url = $w.GameApp.serverURL + '/island/region-data';

      
        window.GameApp.ionicLoading.show();

        $http.post(url, { regionId: regionId }).then(function onSuccess(response) {
            regionData = response.data.RegionData;
            //console.log(regionData);

            decorationData = response.data.DecorationData;

            callback();
         
        }, function onFailed(response) {
            //-- on failed


        }).finally(function onFinally() {
            //$ionicLoading.hide();
            window.GameApp.ionicLoading.hide();
            //callbackFunc();
        });

    };
    _this.sendCharToHeaven = function (playerCharId, callback) {
        var url = $w.GameApp.serverURL + '/island/kill-char';

        $ionicLoading.show();

        $w.izyObject('PlayerChars').reset();
        $http.post(url, { playerCharId: playerCharId }).then(function onSuccess(response) {
            var playerChars = response.data.PlayerChars;
            $w.jQuery.each(playerChars, function (key, value) {
                var objData = Object(value);

                $w.izyObject('PlayerChars').store(objData);
            });
            callback();
            $ionicLoading.hide();
        }, function onFailed(response) {
            //-- on failed


        }).finally(function onFinally() {
            //$ionicLoading.hide();

            //callbackFunc();
        });

    };
    _this.setupFarming = function (regionId, charId, targetName, targetAbility, callback) {
        var url = $w.GameApp.serverURL + '/island/do-farming';

        $ionicLoading.show();
        //console.log(regionId, charId, targetName, targetAbility);
        $http.post(url,
          {
              regionId: regionId,
              charId: charId,
              target: targetName,
              farmingType: targetAbility
          }).then(function onSuccess(response) {
              regionData = response.data.RegionData;

              callback();
              $ionicLoading.hide();
          }, function onFailed(response) {
              //-- on failed


          }).finally(function onFinally() {
              //$ionicLoading.hide();

              //callbackFunc();
          });
    };
    _this.fetchStatusInfo = function () {
        var obj = {
            wood: {
                infoText: 'Keep hatching to get monster with planting ability.',
                isCanExploring: false,
                isCanDestroying: false,
                availableAction: 'none',
                explorerActionName: 'Planting',
                destroyerActionName: 'Logging'
            },
            stone: {
                infoText: 'Keep hatching to get monster with planting ability.',
                isCanExploring: false,
                isCanDestroying: false,
                availableAction: 'none',
                explorerActionName: 'Exploring',
                destroyerActionName: 'Mining'
            },
            gold: {
                infoText: 'Keep hatching to get monster with planting ability.',
                isCanExploring: false,
                isCanDestroying: false,
                availableAction: 'none',
                explorerActionName: 'Exploring',
                destroyerActionName: 'Mining'
            }
        };
        var regionData = $w.GameApp.IslandBusiness.getRegionData();
        var charsInEnvi = scopeEnvi.charsInEnvi;

        $.each(regionData, function (targetName, targetNameValue) {
            //-- normalisasi nama dulu
            var exploringName = 'exploring';
            var destroyingName = 'mining';
            if (targetName == 'wood') {
                exploringName = 'planting';
                destroyingName = 'logging';
            }

            switch (targetNameValue.farmingStatus) {
                case 1:
                    obj[targetName].infoText = 'Keep hatching to get monster with ' + exploringName + ' ability.';
                    //-- cek apakah char punya si player ada yg target wood  dan explorer gak
                    $.each(charsInEnvi, function (index, value) {
                        var isCharCanExploring = checkAvailabilityChar(value, targetName, 'explorer');

                        if (isCharCanExploring) {
                            obj[targetName].infoText = 'You need to do ' + exploringName;
                            obj[targetName].isCanDestroying = false;
                            obj[targetName].isCanExploring = true;
                            obj[targetName].availableAction = 'exploring';
                        }
                    });
                    break;
                case 2:
                    //-- hitung countdown char kerja dan remaining diamond
                    var endtimeJob = Date.parse(targetNameValue.finishWorkingOn);
                    var countdownJob = $w.GameApp.getTimeRemaining(endtimeJob);
                    var jobCountdown = ('0' + countdownJob.hours).slice(-2) + ':' + ('0' + countdownJob.minutes).slice(-2) + ':' + ('0' + countdownJob.seconds).slice(-2);
                    var remainingDiamond = Math.ceil(countdownJob.total / 60 / 60 / 1000);

                    $w.addEventListener('serverdatetick', function () {
                        endtimeJob = Date.parse(targetNameValue.finishWorkingOn);
                        countdownJob = $w.GameApp.getTimeRemaining(endtimeJob);
                        jobCountdown = ('0' + countdownJob.hours).slice(-2) + ':' + ('0' + countdownJob.minutes).slice(-2) + ':' + ('0' + countdownJob.seconds).slice(-2);
                        remainingDiamond = Math.ceil(countdownJob.total / 60 / 60 / 1000);

                        obj[targetName].infoText = exploringName + ' done in ' + jobCountdown;
                        obj[targetName].explorerActionName = 'Finish Now ' + remainingDiamond + ' <i class="icon-diamond"></i>';
                    });

                    obj[targetName].infoText = 'Planting done in ' + jobCountdown;
                    obj[targetName].isCanDestroying = false;
                    obj[targetName].isCanExploring = true;
                    obj[targetName].availableAction = 'finishnow';
                    obj[targetName].explorerActionName = 'Finish Now ' + remainingDiamond + ' <i class="icon-diamond"></i>';
                    break;
                case 3:
                    obj[targetName].infoText = 'Keep hatching to get monster with logging ability.';
                    //-- cek apakah char punya si player ada yg target wood  dan explorer gak
                    $.each(charsInEnvi, function (index, value) {
                        var isCharCanDestroying = checkAvailabilityChar(value, targetName, 'destroyer');

                        if (isCharCanDestroying) {
                            obj[targetName].infoText = 'You need to do ' + destroyingName;
                            obj[targetName].isCanDestroying = true;
                            obj[targetName].isCanExploring = false;
                            obj[targetName].availableAction = 'destroying';
                        }
                    });
                    break;
                case 4:
                    //-- hitung countdown char kerja dan remaining diamond
                    var endtimeJob = Date.parse(targetNameValue.finishWorkingOn);
                    var countdownJob = $w.GameApp.getTimeRemaining(endtimeJob);
                    var jobCountdown = ('0' + countdownJob.hours).slice(-2) + ':' + ('0' + countdownJob.minutes).slice(-2) + ':' + ('0' + countdownJob.seconds).slice(-2);
                    var remainingDiamond = Math.ceil(countdownJob.total / 60 / 60 / 1000);

                    $w.addEventListener('serverdatetick', function () {
                        endtimeJob = Date.parse(targetNameValue.finishWorkingOn);
                        countdownJob = $w.GameApp.getTimeRemaining(endtimeJob);
                        jobCountdown = ('0' + countdownJob.hours).slice(-2) + ':' + ('0' + countdownJob.minutes).slice(-2) + ':' + ('0' + countdownJob.seconds).slice(-2);
                        remainingDiamond = Math.ceil(countdownJob.total / 60 / 60 / 1000);

                        obj[targetName].infoText = 'Logging done in ' + jobCountdown;
                        obj[targetName].destroyerActionName = 'Finish Now ' + remainingDiamond + ' <i class="icon-diamond"></i>';
                    });


                    obj[targetName].infoText = destroyingName +' done in ' + jobCountdown;
                    obj[targetName].isCanDestroying = true;
                    obj[targetName].isCanExploring = false;
                    obj[targetName].availableAction = 'finishnow';
                    obj[targetName].destroyerActionName = 'Finish Now 4 <i class="icon-diamond"></i>';
                    break;
                case 5:
                    obj[targetName].infoText = 'Now collect the rewards.';
                    obj[targetName].isCanDestroying = false;
                    obj[targetName].isCanExploring = false;
                    obj[targetName].availableAction = 'collectreward';
            };
        });
        
        return obj;
    };
    _this.finishNowFarming = function (regionId, targetName, callback) {
        var url = $w.GameApp.serverURL + '/island/finishnow-farming';

        $ionicLoading.show();

        $w.izyObject('PlayerInfo').reset();
        $http.post(url,
          {
              regionId: regionId,
              target: targetName
          }).then(function onSuccess(response) {
              regionData = response.data.RegionData;
              var playerInfo = Object(response.data.PlayerInfo);

              $w.izyObject('PlayerInfo').store(playerInfo);
              $w.GameApp.rootScope.playerInfo = playerInfo;

              callback();
              $ionicLoading.hide();
          }, function onFailed(response) {
              //-- on failed


          }).finally(function onFinally() {
              //$ionicLoading.hide();

              //callbackFunc();
          });
    };
    _this.collectFarmingReward = function (regionId, target, callback) {
        var url = $w.GameApp.serverURL + '/island/collect-farming-reward';

        $ionicLoading.show();

        $w.izyObject('PlayerInfo').reset();
        $http.post(url,
          {
              regionId: regionId,
              target: target
          }).then(function onSuccess(response) {
              regionData = response.data.RegionData;
              var playerInfo = Object(response.data.PlayerInfo);

              $w.GameApp.rootScope.playerInfo = playerInfo;
              $w.izyObject('PlayerInfo').store(playerInfo);
              callback();
              $ionicLoading.hide();
              $ionicLoading.show({
                  template: response.data.Info,
                  duration: 2000,
                  noBackdrop: true
              });

          }, function onFailed(response) {
              //-- on failed


          }).finally(function onFinally() {
              //$ionicLoading.hide();

              //callbackFunc();
          });
    };
    _this.isTargetAbilityAvailable = function (targetName, targetAbility) {
        var regionData = _this.getRegionData();
        var available = 'explorer';
        //console.log(targetAbility);
        //console.log(regionData[targetName].farmingStatus);
        switch (regionData[targetName].farmingStatus) {
            case 1:
                available = 'explorer';
                break;
            case 2:
                available = 'none';
                break;
            case 3:
                available = 'destroyer';
                break;
            case 4:
                available = 'none';
                break;
            case 5:
                available = 'none';
                break;
        }

        if (available == targetAbility) {
            return true;
        } else {
            return false;
        }


    };

    _this.purchasingDecoration = function (regionId, decorItem, callback) {
        var url = $w.GameApp.serverURL + '/island/purchase-decoration';

        $ionicLoading.show();

        $w.izyObject('PlayerInfo').reset();
        $http.post(url,
          {
              regionId: regionId,
              decorItem: decorItem
          }).then(function onSuccess(response) {
              decorationData = response.data.DecorationData;

              // console.log(decorationData);
              var playerInfo = Object(response.data.PlayerInfo);

              $w.GameApp.rootScope.playerInfo = playerInfo;
              $w.izyObject('PlayerInfo').store(playerInfo);

              callback();
          }, function onFailed(response) {
              //-- on failed


          }).finally(function onFinally() {
              $ionicLoading.hide();

              //callbackFunc();
          });
    };
    _this.purchasingEquipment = function (eqId, callbackFn) {
        //-- send data to server

        $ionicLoading.show();
        $w.izyObject('InventorySlot').reset();
        $w.izyObject('PlayerInfo').reset();

        var url = $w.GameApp.serverURL + '/island/purchase-equipment';
        var request = $w.GameApp.http.post(url, { eqId: eqId });
        request.success(function (data, status, header, config) {
            //-- setelah dapat respon, lalu lakukan normalisasi data di client
            var playerInfo = Object(data.PlayerInfo);
            var inventorySlot = data.InventorySlot;

            $w.jQuery.each(inventorySlot, function (key, value) {
                var objData = Object(value);
                $w.izyObject('InventorySlot').store(objData);
            });

            $w.izyObject('PlayerInfo').store(playerInfo);
            $rootScope.playerInfo = playerInfo;

            callbackFn();
        });
        request.error($w.GameApp.sendingErrorHandler);
        request.finally(function () {
            $ionicLoading.hide();
        });


    };

    _this.purchasingIsland = function (regionId, callback) {
        var url = $w.GameApp.serverURL + '/island/purchase-island';

        $ionicLoading.show();

        $w.izyObject('PlayerInfo').reset();
        $http.post(url,
          {
              regionId: regionId
          }).then(function onSuccess(response) {
              var playerInfo = Object(response.data.PlayerInfo);

              $w.GameApp.rootScope.playerInfo = playerInfo;
              $w.izyObject('PlayerInfo').store(playerInfo);
              callback();
              $ionicLoading.hide();


          }, function onFailed(response) {
              //-- on failed


          }).finally(function onFinally() {
              //$ionicLoading.hide();

              //callbackFunc();
          });
    };
    _this.claimingSpeciality = function (eggcode, specialityName, it, callback) {
        var url = $w.GameApp.serverURL + '/island/claim-speciality';

        $ionicLoading.show();

        $w.izyObject('PlayerInfo').reset();
        $http.post(url,
          {
              cd: eggcode,
              sn: specialityName,
              it: it
          }).then(function onSuccess(response) {
              var playerInfo = Object(response.data.PlayerInfo);

              $w.GameApp.rootScope.playerInfo = playerInfo;
              $w.izyObject('PlayerInfo').store(playerInfo);


              callback(response.data.Info);
          }, function onFailed(response) {
              //-- on failed


          }).finally(function onFinally() {

              $ionicLoading.hide();
          });
    };
    _this.fetchSpecialityInfo = function (eggcode, callback) {
        var url = $w.GameApp.serverURL + '/island/fetch-speciality-char';

        $ionicLoading.show();

        $http.post(url, { eggcode: eggcode }).then(function onSuccess(response) {
            // regionData = response.data.RegionData;
            //console.log(regionData);

            //decorationData = response.data.DecorationData;

            callback(response.data.SpecialityData);

        }, function onFailed(response) {
            //-- on failed


        }).finally(function onFinally() {
            //$ionicLoading.hide();
            $ionicLoading.hide();
            //callbackFunc();
        });

    };

    _this.useItemLifeInjection = function (invslotId, it, callback) {
        $ionicLoading.show();

        var url = $w.GameApp.serverURL + '/island/use-item-lifeinjection';
        var request = $w.GameApp.http.post(url, { invslotId: invslotId, it: it });
        request.success(function (data, status, header, config) {

            callback(data.Info);
        });
        request.error($w.GameApp.sendingErrorHandler);
        request.finally(function () {
            $ionicLoading.hide();
        });

    };
    _this.useItemPortal = function (invslotId, it, rId, callback) {
        $ionicLoading.show();

        var url = $w.GameApp.serverURL + '/island/use-item-portal';
        var request = $w.GameApp.http.post(url, { invslotId: invslotId, it: it, rId: rId });
        request.success(function (data, status, header, config) {
            callback(data.Info);
        });
        request.error($w.GameApp.sendingErrorHandler);
        request.finally(function () {
            $ionicLoading.hide();
        });

    };
    _this.useItemExplorer = function (invslotId, rId, callback) {
        $ionicLoading.show();

        var url = $w.GameApp.serverURL + '/island/use-item-explorer';
        var request = $w.GameApp.http.post(url, { invslotId: invslotId, rId: rId });
        request.success(function (data, status, header, config) {
            callback();
        });
        request.error($w.GameApp.sendingErrorHandler);
        request.finally(function () {
            $ionicLoading.hide();
        });

    };
    _this.useItemDecoration = function (invslotId, rId, dt, callback) {
        var url = $w.GameApp.serverURL + '/island/use-item-decoration';
        var request = $w.GameApp.http.post(url, { invslotId: invslotId, rId: rId, dt: dt });

        $w.izyObject('InventorySlot').reset();
        $w.izyObject('PlayerInfo').reset();
        $ionicLoading.show();
        request.success(function (data, status, header, config) {
            var playerInfo = data.PlayerInfo;
            var inventorySlot = data.InventorySlot;

            decorationData = data.DecorationData;
            $w.jQuery.each(inventorySlot, function (key, value) {
                var objData = Object(value);
                $w.izyObject('InventorySlot').store(objData);
            });

            $w.GameApp.rootScope.playerInfo = playerInfo;
            $w.izyObject('PlayerInfo').store(playerInfo);
            callback();
        });
        request.error($w.GameApp.sendingErrorHandler);
        request.finally(function () {
            $ionicLoading.hide();
        });

    };

    _this.checkAvailabilityChar = checkAvailabilityChar;
    win.GameApp.IslandBusiness = _this;
})(window);