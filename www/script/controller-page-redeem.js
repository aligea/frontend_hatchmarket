(function RedeemClass(w) {
    'use strict';
    var $w = w,
            angular = w.angular,
            $ = w.jQuery;

    function RedeemCtrl(scope, ionicPopup, http, $rootScope, $ionicLoading) {
        var redeemData = [];

        function getRedeemData(rId) {
            for (var i = 0; i < redeemData.length; i++) {
                if (redeemData[i].id == rId) {
                    return redeemData[i];
                }
            }

        }
        function fetchProviderData() {
            var url = $w.GameApp.serverURL + '/redeem/provider';
            http.get(url).success(function (data) {
                var result = data.sort(function (a, b) {
                    if (a.provider < b.provider)
                        return -1;
                    if (a.provider > b.provider)
                        return 1;
                    return 0;
                });
                scope.providers = result;
                //console.log(result);
            }).error(function () {
                //scope.providers = "error in fetching data";
                fetchProviderData();
            });
        }
        function findProviderItem(pid) {
            for (var i = 0; i < scope.providers.length; i++) {
                if (pid == scope.providers[i].id) {
                    return scope.providers[i];
                }

            }
            return;
        }

        scope.providers = [];
        scope.dataUserGold = [];
        scope.redeemGold = function (rid) {
            scope.selecteddata = getRedeemData(rid);
            //console.log($rootScope.playerInfo.coinBalance, scope.selecteddata.price);
            if (Number($rootScope.playerInfo.coinBalance) >= Number(scope.selecteddata.price)) {
                scope.PopupGold = ionicPopup.show({
                    title: 'Fine Gold ' + scope.selecteddata.name,
                    templateUrl: 'templates/popup-detail-finegold.html',
                    scope: scope
                });
                scope.resetGold();
                scope.PopupGold.then(function (result) {
                    if (result) {
                        scope.showPopupDataGold();
                    }
                });
            } else {
                var alertPopup = ionicPopup.alert({
                    title: 'Alert!',
                    template: 'Not Enough Coin Balance'
                });
                alertPopup.then(function (res) {

                });
            }
        };

        scope.showPopupDataGold = function () {
            scope.PopupGold.close();
            scope.PopupUserGold = ionicPopup.show({
                title: 'Fine Gold ' + scope.selecteddata.name,
                templateUrl: 'templates/popup-detail-datagold.html',
                scope: scope
            });

            //scope.dataUserGold.prov = scope.provs[0].prov_id;
            scope.citiesOfProv = [];
            scope.changeCityOfProv = function () {

                scope.citiesOfProv = scope.provs[scope.dataUserGold.prov].kab_kota;
            };
            scope.PopupUserGold.then(function (result) {
                if (result) {
                    scope.showPopupConfirmGold();
                }
            });
        };

        scope.showPopupConfirmGold = function () {
            scope.PopupUserGold.close();
            scope.ConfirmDataGold = ionicPopup.show({
                title: 'Fine Gold ' + scope.selecteddata.name,
                templateUrl: 'templates/popup-confirm-datagold.html',
                scope: scope
            });
            scope.ConfirmDataGold.then(function (result) {
                if (result) {
                    scope.showPopupSuccessGold();
                }
            });
        };

        scope.insertRGold = function () {
            $ionicLoading.show();
            var url = $w.GameApp.serverURL + '/redeem/redeem';
            $w.izyObject('PlayerInfo').reset();
            http.post(url, {
                name: scope.dataUserGold.name,
                email: scope.dataUserGold.email,
                phone: scope.dataUserGold.phone,
                address: scope.dataUserGold.address,
                state: scope.getProvName(scope.dataUserGold.prov),
                city: scope.dataUserGold.kota,
                zip: scope.dataUserGold.zipcode,
                itemid: scope.selecteddata.id
            }).then(function onSuccess(response) {
                var playerInfo = Object(response.data.PlayerInfo);

                $w.izyObject('PlayerInfo').store(playerInfo);

                $rootScope.playerInfo = playerInfo;
            }).finally(function onFinally() {
                $ionicLoading.hide();
                scope.ConfirmDataGold.close();
                scope.showPopupSuccessGold();
            });
        };

        scope.showPopupSuccessGold = function () {
            $w.izyObject('PlayerInfo').reset();
            scope.SuccessGold = ionicPopup.show({
                title: 'Redeem Success',
                templateUrl: 'templates/popup-success-gold.html',
                scope: scope,
                onTap: function (e) {

                    scope.SuccessGold.close();
                }
            });
        };

        scope.dataUserPhone = [];
        scope.redeemPhoneBalance = function (rid) {

            scope.selecteddata = getRedeemData(rid);
            console.log($rootScope.playerInfo.coinBalance, scope.selecteddata.price);
            if ($rootScope.playerInfo.coinBalance >= scope.selecteddata.price) {
                scope.PopupPulsa = ionicPopup.show({
                    title: 'Phone Balance ' + scope.selecteddata.name,
                    templateUrl: 'templates/popup-detail-pulsa.html',
                    scope: scope
                });
                scope.resetPhone();
                scope.PopupPulsa.then(function (result) {
                    if (result) {
                        scope.showPopupDataPulsa();
                    }
                });
            } else {
                var alertPopup = ionicPopup.alert({
                    title: 'Alert!',
                    template: 'Not Enough Coin Balance'
                });
                alertPopup.then(function (res) {

                });
            }
        };

        scope.showPopupDataPulsa = function () {
            scope.PopupPulsa.close();
            scope.PopupDataPulsa = ionicPopup.show({
                title: 'Phone Balance ' + scope.selecteddata.name,
                templateUrl: 'templates/popup-detail-datapulsa.html',
                scope: scope
            });
            scope.dataUserPhone.provider = scope.providers[0].id;
        };

        scope.validateNumber = function () {
            if (scope.dataUserPhone.phone1 !== scope.dataUserPhone.phone2) {
                scope.PopupDataPulsa.close();
                scope.showPopupDataPulsa();
                scope.copo = "Number doesn't match";
            }
            if (scope.dataUserPhone.phone1 === scope.dataUserPhone.phone2) {
                scope.insertRPhone();
                scope.resetPhone();
            }
        };

        scope.insertRPhone = function () {
            var sendRedeemToServer = function () {
                var url = $w.GameApp.serverURL + '/redeem/phone';
                $ionicLoading.show();
                http.post(url, {
                    provider: scope.dataUserPhone.provider,
                    phone: scope.dataUserPhone.phone1,
                    itemid: scope.selecteddata.id
                }).then(function onSuccess(response) {
                    var playerInfo = Object(response.data.PlayerInfo);
                    $w.izyObject('PlayerInfo').reset();
                    $w.izyObject('PlayerInfo').store(playerInfo);

                    $rootScope.playerInfo = playerInfo;

                }).finally(function onFinally() {
                    $ionicLoading.hide();
                    scope.PopupDataPulsa.close();
                    scope.showPopupSuccessPulsa();
                });
            };

            /*var data = {
             name: scope.dataUserGold.name,
             email: scope.dataUserGold.email,
             phone: scope.dataUserGold.phone,
             address: scope.dataUserGold.address,
             state: scope.getProvName(scope.dataUserGold.prov),
             city: scope.dataUserGold.kota,
             zip: scope.dataUserGold.zipcode,
             itemid: scope.selecteddata.id
             };*/

            var provitem = findProviderItem(scope.dataUserPhone.provider);

            var ctext = 'Redeem ' + scope.selecteddata.name + ' with ' + scope.selecteddata.price + ' coins. ';
            ctext += provitem.provider + ' : ' + scope.dataUserPhone.phone1;

            //console.log(ctext);
            window.navigator.notification.confirm(ctext, function (confirm) {
                if (confirm == 1) {
                    sendRedeemToServer();
                }
            }, 'Confirmation', ['OK', 'Cancel']);


        };
        scope.showPopupSuccessPulsa = function () {
            scope.SuccessPulsa = ionicPopup.show({
                title: 'Redeem Success',
                templateUrl: 'templates/popup-success-pulsa.html',
                scope: scope
            });
        };

        scope.dataUserMerchandise = [];
        scope.redeemMerchandise = function (rid) {
            scope.selecteddata = getRedeemData(rid);
            console.log($rootScope.playerInfo.coinBalance, scope.selecteddata.price);
            if ($rootScope.playerInfo.coinBalance >= scope.selecteddata.price) {
                scope.PopupMerchandise = ionicPopup.show({
                    title: scope.selecteddata.name,
                    templateUrl: 'templates/popup-detail-merchant.html',
                    scope: scope
                });
                scope.resetMerchandise();
                scope.PopupMerchandise.then(function (result) {
                    if (result) {
                        scope.showPopupDataMerchandise();
                    }
                });
            } else {
                var alertPopup = ionicPopup.alert({
                    title: 'Alert!',
                    template: 'Not Enough Coin Balance'
                });
                alertPopup.then(function (res) {

                });
            }
        };

        scope.showPopupDataMerchandise = function () {
            scope.PopupMerchandise.close();
            scope.PopupUserMerchandise = ionicPopup.show({
                title: scope.selecteddata.name,
                templateUrl: 'templates/popup-detail-datamerchant.html',
                scope: scope
            });

            scope.PopupUserMerchandise.then(function (result) {
                if (result) {
                    scope.showConfirmDataMerchandise();
                }
            });
        };

        scope.showConfirmDataMerchandise = function () {
            scope.PopupUserMerchandise.close();
            scope.ConfirmDataMerchandise = ionicPopup.show({
                title: scope.selecteddata.name,
                templateUrl: 'templates/popup-confirm-datamerchant.html',
                scope: scope
            });
            scope.ConfirmDataMerchandise.then(function (result) {
                if (result) {
                    scope.showSuccessMerchandise();
                }
            });
        };

        scope.insertRMerchant = function () {
            $ionicLoading.show();
            var url = $w.GameApp.serverURL + '/redeem/redeem';
            /*var data = {
             name: scope.dataUserGold.name,
             email: scope.dataUserGold.email,
             phone: scope.dataUserGold.phone,
             address: scope.dataUserGold.address,
             state: scope.getProvName(scope.dataUserGold.prov),
             city: scope.dataUserGold.kota,
             zip: scope.dataUserGold.zipcode,
             itemid: scope.selecteddata.id
             };*/
            $w.izyObject('PlayerInfo').reset();
            http.post(url, {
                name: scope.dataUserMerchandise.name,
                email: scope.dataUserMerchandise.email,
                phone: scope.dataUserMerchandise.phone,
                address: scope.dataUserMerchandise.address,
                state: scope.getProvName(scope.dataUserMerchandise.prov),
                city: scope.dataUserMerchandise.kota,
                zip: scope.dataUserMerchandise.zipcode,
                itemid: scope.selecteddata.id
            }).then(function onSuccess(response) {
                var playerInfo = Object(response.data.PlayerInfo);

                $w.izyObject('PlayerInfo').store(playerInfo);
                $rootScope.playerInfo = playerInfo;

            }).finally(function onFinally() {
                $ionicLoading.hide();
                scope.ConfirmDataMerchandise.close();
                scope.showSuccessMerchandise();
            });
        };

        scope.showSuccessMerchandise = function () {
            scope.ConfirmDataMerchandise.close();
            scope.SuccessMerchant = ionicPopup.show({
                title: 'Redeem Success',
                templateUrl: 'templates/popup-success-merchant.html',
                scope: scope
            });
        };

        scope.resetGold = function () {
            scope.dataUserGold = [];
            /*scope.myForm.$setPristine();
             scope.myForm.$setUntouched();*/
        };

        scope.resetPhone = function () {
            scope.dataUserPhone = [];
            /*scope.copo = "";
             scope.myForm.$setPristine();
             scope.myForm.$setUntouched();*/
        };

        scope.resetMerchandise = function () {
            scope.dataUserMerchandise = [];
            /*scope.myForm.$setPristine();
             scope.myForm.$setUntouched();*/
        };

        scope.provs = [
            {
                "prov_id": "0",
                "prov_name": "ACEH",
                "kab_kota": ["ACEH BARAT", "ACEH BARAT DAYA", "ACEH BESAR", "ACEH JAYA", "ACEH SELATAN", "ACEH SINGKIL", "ACEH TAMIANG", "ACEH TENGAH", "ACEH TENGGARA", "ACEH TIMUR", "ACEH UTARA", "BENER MERIAH", "BIREUEN", "GAYO LUES", "KOTA BANDA ACEH", "KOTA LANGSA", "KOTA LHOKSEUMAWE", "KOTA SABANG", "KOTA SUBULUSSALAM", "NAGAN RAYA", "PIDIE", "PIDIE JAYA", "SIMEULUE"]
            },
            {
                "prov_id": "1",
                "prov_name": "BALI",
                "kab_kota": ["BADUNG", "BANGLI", "BULELENG", "GIANYAR", "JEMBRANA", "KARANGASEM", "KLUNGKUNG", "KOTA DENPASAR", "TABANAN"]
            },
            {
                "prov_id": "2",
                "prov_name": "BANTEN",
                "kab_kota": ["KOTA CILEGON", "KOTA SERANG", "KOTA TANGERANG", "KOTA TANGERANG SELATAN", "LEBAK", "PANDEGLANG", "SERANG", "TANGERANG"]
            },
            {
                "prov_id": "3",
                "prov_name": "BENGKULU",
                "kab_kota": ["BENGKULU SELATAN", "BENGKULU TENGAH", "BENGKULU UTARA", "KAUR", "KEPAHIANG", "KOTA BENGKULU", "LEBONG", "MUKOMUKO", "REJANG LEBONG", "SELUMA"]
            },
            {
                "prov_id": "4",
                "prov_name": "DI YOGYAKARTA",
                "kab_kota": ["BANTUL", "GUNUNGKIDUL", "KOTA YOGYAKARTA", "KULON PROGO", "SLEMAN"]
            },
            {
                "prov_id": "5",
                "prov_name": "DKI JAKARTA",
                "kab_kota": ["JAKARTA BARAT", "JAKARTA PUSAT", "JAKARTA SELATAN", "JAKARTA TIMUR", "JAKARTA UTARA", "KEPULAUAN SERIBU"]
            },
            {
                "prov_id": "6",
                "prov_name": "GORONTALO",
                "kab_kota": ["BOALEMO", "BONE BOLANGO", "GORONTALO", "GORONTALO UTARA", "KOTA GORONTALO", "PAHUWATO"]
            },
            {
                "prov_id": "7",
                "prov_name": "JAWA BARAT",
                "kab_kota": ["BANDUNG", "BANDUNG BARAT", "BEKASI", "BOGOR", "CIAMIS", "CIANJUR", "CIREBON", "GARUT", "INDRAMAYU", "KARAWANG", "KOTA BANDUNG", "KOTA BANJAR", "KOTA BEKASI", "KOTA BOGOR", "KOTA CIMAHI", "KOTA CIREBON", "KOTA DEPOK", "KOTA SUKABUMI", "KOTA TASIKMALAYA", "KUNINGAN", "MAJALENGKA", "PURWAKARTA", "SUBANG", "SUKABUMI", "SUMEDANG", "TASIKMALAYA"]
            },
            {
                "prov_id": "8",
                "prov_name": "JAMBI",
                "kab_kota": ["BATANGHARI", "BUNGO", "KERINCI", "KOTA JAMBI", "KOTA SUNGAI PENUH", "MERANGIN", "MUARO JAMBI", "SAROLANGUN", "TANJUNG JABUNG BARAT", "TANJUNG JABUNG TIMUR", "TEBO"]
            },
            {
                "prov_id": "9",
                "prov_name": "JAWA TENGAH",
                "kab_kota": ["BANJARNEGARA", "BANYUMAS", "BATANG", "BLORA", "BOYOLALI", "BREBES", "CILACAP", "DEMAK", "GROBOGAN", "JEPARA", "KARANGANYAR", "KEBUMEN", "KENDAL", "KLATEN", "KOTA MAGELANG", "KOTA PEKALONGAN", "KOTA SALATIGA", "KOTA SEMARANG", "KOTA SURAKARTA", "KOTA TEGAL", "KUDUS", "MAGELANG", "PATI", "PEKALONGAN", "PEMALANG", "PURBALINGGA", "PURWOREJO", "REMBANG", "SEMARANG", "SRAGEN", "SUKOHARJO", "TEGAL", "TEMANGGUNG", "WONOGIRI", "WONOSOBO"]
            },
            {
                "prov_id": "10",
                "prov_name": "JAWA TIMUR",
                "kab_kota": ["BANGKALAN", "BANYUWANGI", "BLITAR", "BOJONEGORO", "BONDOWOSO", "GRESIK", "JEMBER", "JOMBANG", "KEDIRI", "KOTA BATU", "KOTA BLITAR", "KOTA KEDIRI", "KOTA MADIUN", "KOTA MALANG", "KOTA MOJOKERTO", "KOTA PASURUAN", "KOTA PROBOLINGGO", "KOTA SURABAYA", "LAMONGAN", "LUMAJANG", "MADIUN", "MAGETAN", "MALANG", "MOJOKERTO", "NGANJUK", "NGAWI", "PACITAN", "PAMEKASAN", "PASURUAN", "PONOROGO", "PROBOLINGGO", "SAMPANG", "SIDOARJO", "SITUBONDO", "SUMENEP", "TRENGGALEK", "TUBAN", "TULUNGAGUNG"]
            },
            {
                "prov_id": "11",
                "prov_name": "KALIMANTAN BARAT",
                "kab_kota": ["BENGKAYANG", "KAPUAS HULU", "KAYONG UTARA", "KETAPANG", "KOTA PONTIANAK", "KOTA SINGKAWANG", "KUBU RAYA", "LANDAK", "MELAWI", "PONTIANAK", "SAMBAS", "SANGGAU", "SEKADAU", "SINTANG"]
            },
            {
                "prov_id": "12",
                "prov_name": "KALIMANTAN SELATAN",
                "kab_kota": ["BALANGAN", "BANJAR", "BARITO KUALA", " HULU SUNGAI SELATAN", "HULU SUNGAI TENGAH", " HULU SUNGAI UTARA", "KOTA BANJARBARU", "KOTA BANJARMASIN", "KOTABARU", "TABALONG", "TANAH BUMBU", "TANAH LAUT", "TAPIN"]
            },
            {
                "prov_id": "13",
                "prov_name": "KALIMANTAN TENGAH",
                "kab_kota": ["BARITO SELATAN", "BARITO TIMUR", "BARITO UTARA", "GUNUNG MAS", "KAPUAS", "KATINGAN", "KOTA PALANGKARAYA", "KOTAWARINGIN BARAT", "KOTAWARINGIN TIMUR", "LAMANDAU", "MURUNG RAYA", "PULANG PISAU", "SERUYAN", "SUKAMARA"]
            },
            {
                "prov_id": "14",
                "prov_name": "KALIMANTAN TIMUR",
                "kab_kota": ["BERAU", "BULUNGAN", "KOTA BALIKPAPAN", "KOTA BONTANG", "KOTA SAMARINDA", "KOTA TARAKAN", "KUTAI BARAT", "KUTAI KARTANEGARA", "KUTAI TIMUR", "MALINAU", "NUNUKAN", "PASER", "PENAJAM PASER UTARA", "TANA TIDUNG"]
            },
            {
                "prov_id": "15",
                "prov_name": "KEP. BANGKA BELITUNG",
                "kab_kota": ["BANGKA", "BANGKA BARAT", "BANGKA SELATAN", "BANGKA TENGAH", "BELITUNG", "BELITUNG TIMUR", "KOTA PANGKALPINANG"]
            },
            {
                "prov_id": "16",
                "prov_name": "KEP. RIAU",
                "kab_kota": ["BINTAN", "KARIMUN", "KEPULAUAN ANAMBAS", "KOTA BATAM", "KOTA TANJUNGPINANG", "LINGGA", "NATUNA"]
            },
            {
                "prov_id": "17",
                "prov_name": "LAMPUNG",
                "kab_kota": ["KOTA BANDAR LAMPUNG", "KOTA METRO", "LAMPUNG BARAT", "LAMPUNG SELATAN", "LAMPUNG TENGAH", "LAMPUNG TIMUR", "LAMPUNG UTARA", "MESUJI", "PESAWARAN", "PRINGSEWU", "TANGGAMUS", "TULANG BAWANG", "TULANG BAWANG BARAT", "WAY KANAN"]
            },
            {
                "prov_id": "18",
                "prov_name": "MALUKU",
                "kab_kota": ["BURU", "BURU SELATAN", "KEPULAUAN ARU", "KOTA AMBON", "KOTA TUAL", "MALUKU BARAT DAYA", "MALUKU TENGAH", "MALUKU TENGGARA", "MALUKU TENGGARA BARAT", "SERAM BAGIAN BARAT", "SERAM BAGIAN TIMUR"]
            },
            {
                "prov_id": "19",
                "prov_name": "MALUKU UTARA",
                "kab_kota": ["HALMAHERA BARAT", "HALMAHERA SELATAN", "HALMAHERA TENGAH", "HALMAHERA TIMUR", "HALMAHERA UTARA", "KEPULAUAN SULA", "KOTA TERNATE", "KOTA TIDORE KEPULAUAN", "PULAU MOROTAI"]
            },
            {
                "prov_id": "20",
                "prov_name": "NUSA TENGGARA BARAT",
                "kab_kota": ["BIMA", "DOMPU", "KOTA BIMA", "KOTA MATARAM", "LOMBOK BARAT", "LOMBOK TENGAH", "LOMBOK TIMUR", "LOMBOK UTARA", "SUMBAWA", "SUMBAWA BARAT"]
            },
            {
                "prov_id": "21",
                "prov_name": "NUSA TENGGARA TIMUR",
                "kab_kota": ["ALOR", "BELU", "ENDE", "FLORES TIMUR", "KOTA KUPANG", "KUPANG", "LEMBATA", "MANGGARAI", "MANGGARAI BARAT", "MANGGARAI TIMUR", "NAGEKEO", "NGADA", "ROTE NDAO", "SABU RAIJUA", "SIKKA", "SUMBA BARAT", "SUMBA BARAT DAYA", "SUMBA TENGAH", "SUMBA TIMUR", "TIMOR TENGAH SELATAN", "TIMOR TENGAH UTARA"]
            },
            {
                "prov_id": "22",
                "prov_name": "PAPUA",
                "kab_kota": ["ASMAT", "BIAK NUMFOR", "BOVEN DIGOEL", "DEIYAI", "DOGIYAI", "INTAN JAYA", "JAYAPURA", "JAYAWIJAYA", "KEEROM", "KEPULAUAN YAPEN", "KOTA JAYAPURA", "LANNY JAYA", "MAMBERAMO RAYA", "MAMBERAMO TENGAH", "MAPPI", "MERAUKE", "MIMIKA", "NABIRE", "NDUGA", "PANIAI", "PEGUNUNGAN BINTANG", "PUNCAK", "PUNCAK JAYA", "SARMI", "SUPIORI", "TOLIKARA", "WAROPEN", "YAHUKIMO", "YALIMO"]
            },
            {
                "prov_id": "23",
                "prov_name": "PAPA BARAT",
                "kab_kota": ["FAKFAK", "KAIMANA", "KOTA SORONG", "MANOKWARI", "MAYBRAT", "RAJA AMPAT", "SORONG", "SORONG SELATAN", "TAMBRAUW", "TELUK BINTUNI", "TELUK WONDAMA"]
            },
            {
                "prov_id": "24",
                "prov_name": "RIAU",
                "kab_kota": ["BENGKALIS", "INDRAGIRI HILIR", "INDRAGIRI HULU", "KAMPAR", "KEPULAUAN MERANTI", "KOTA DUMAI", "KOTA PEKANBARU", "KUANTAN SINGINGI", "PELALAWAN", "ROKAN HILIR", "ROKAN HULU", "SIAK"]
            },
            {
                "prov_id": "25",
                "prov_name": "SULAWESI BARAT",
                "kab_kota": ["MAJENE", "MAMASA", "MAMUJU", "MAMUJU UTARA", "POLEWALI MANDAR"]
            },
            {
                "prov_id": "26",
                "prov_name": "SULAWESI SELATAN",
                "kab_kota": ["BANTAENG", "BARRU", "BONE", "BULUKUMBA", "ENREKANG", "GOWA", "JENEPONTO", "KEPULAUAN SELAYAR", "KOTA MAKASSAR", "KOTA PALOPO", "KOTA PARE PARE", "LUWU", "LUWU TIMUR", "LUWU UTARA", "MAROS", "PANGKAJENE DAN KEPULAUAN", "PINRANG", "SIDENRENG RAPPANG", "SINJAI", "SOPPENG", "TAKALAR", "TANA TORAJA", "TORAJA UTARA", "WAJO"]
            },
            {
                "prov_id": "27",
                "prov_name": "SULAWESI TENGAH",
                "kab_kota": ["BANGGAI", "BANGGAI KEPULAUAN", "BUOL", "DONGGALA", "KOTA PALU", "MOROWALI", "PARIGI MOUTONG", "POSO", "SIGI", "TOJO UNA-UNA", "TOLITOLI"]
            },
            {
                "prov_id": "28",
                "prov_name": "SULAWESI TENGGARA",
                "kab_kota": ["BOMBANA", "BUTON", "BUTON UTARA", "KOLAKA", "KOLAKA UTARA", "KONAWE", "KONAWE SELATAN", "KONAWE UTARA", "KOTA BAU BAU", "KOTA KENDARI", "MUNA", "WAKATOBI"]
            },
            {
                "prov_id": "29",
                "prov_name": "SULAWESI UTARA",
                "kab_kota": ["BOLAANG MONGONDOW", "BOLAANG MONGONDOW SELATAN", "BOLAANG MONGONDOW TIMUR", "BOLAANG MONGONDOW UTARA", "KEP. SIAU TAGULANDANG BIARO", "KEPULAUAN SANGIHE", "KEPULAUAN TALAUD", "KOTA BITUNG", "KOTA KOTAMOBAGU", "KOTA MANADO", "KOTA TOMOHON", "MINAHASA", "MINAHASA SELATAN", "MINAHASA TENGGARA", "MINAHASA UTARA"]
            },
            {
                "prov_id": "30",
                "prov_name": "SUMATERA BARAT",
                "kab_kota": ["AGAM", "DHARMASRAYA", "KEPULAUAN MENTAWAI", "KOTA BUKITTINGGI", "KOTA PADANG", "KOTA PADANG PANJANG", "KOTA PARIAMAN", "KOTA PAYAKUMBUH", "KOTA SAWAHLUNTO", "KOTA SOLOK", "LIMA PULUH KOTA", " PADANG PARIAMAN", "PASAMAN", "PASAMAN BARAT", "PESISIR SELATAN", "SIJUNJUNG", "SOLOK", "SOLOK SELATAN", "TANAH DATAR"]
            },
            {
                "prov_id": "31",
                "prov_name": "SUMATERA SELATAN",
                "kab_kota": ["BANYUASIN", "EMPAT LAWANG", "KOTA LUBUKLINGGAU", "KOTA PAGAR ALAM", "KOTA PALEMBANG", "KOTA PRABUMULIH", "LAHAT", "MUARA ENIM", "MUSI BANYUASIN", "MUSI RAWAS", "OGAN ILIR", "OGAN KOMERING ILIR", "OGAN KOMERING ULU", "OGAN KOMERING ULU SELATAN", "OGAN KOMERING ULU TIMUR"]
            },
            {
                "prov_id": "32",
                "prov_name": "SUMATERA UTARA",
                "kab_kota": ["ASAHAN", "BATU BARA", "DAIRI", "DELI SERDANG", "HUMBANG HASUNDUTAN", "KARO", "KOTA BINJAI", "KOTA GUNUNGSITOLI", "KOTA MEDAN", "KOTA PADANG SIDIMPUAN", "KOTA PEMATANGSIANTAR", "KOTA SIBOLGA", "KOTA TANJUNG BALAI", "KOTA TEBING TINGGI", "LABUHANBATU", "LABUHANBATU SELATAN", "LABUHANBATU UTARA", "LANGKAT", "MANDAILING NATAL", "NIAS", "NIAS BARAT", "NIAS SELATAN", "NIAS UTARA", "PADANG LAWAS", "PADANG LAWAS UTARA", "PAKPAK BHARAT", "SAMOSIR", "SERDANG BEDAGAI", "SIMALUNGUN", "TAPANULI SELATAN", "TAPANULI TENGAH", "TAPANULI UTARA", "TOBA SAMOSIR"]
            }
        ];

        //scope.service_prov = scope.provs[0];
        scope.getCities = function (id) {
            return scope.provs[id].kab_kota;
        }

        scope.getProvName = function (id) {
            return scope.provs[id].prov_name;
        }

        w.addEventListener('gamedataready', function () {
            redeemData = w.GameApp.JsonData.redeem;

            //-- load data provider
            fetchProviderData();

        });
    }

    var compareTo = function () {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    };

    angular.module('gamesapp').directive("compareTo", compareTo);
    angular.module('gamesapp').controller('RedeemCtrl', ['$scope', '$ionicPopup', '$http', '$rootScope', '$ionicLoading', RedeemCtrl]);
})(this);