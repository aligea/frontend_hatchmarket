/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function ($w) {
    'use strict';
    var $ = $w.jQuery;
    var to = {};
    var currentScene = 0;
    var scene = [];
    var eventClick;

    scene[0] = {
        text: 'Halo Selamat Datang di HATCH MARKET. AKU ORODOCUS AKAN MEMBANTUMU MENJADI HATCHER ! PERTAMA-TAMA AKU JELASIN MENU YANG ADA DI HATCH MARKET !',
        fn: function () {
            
        }
    };
    scene[1] = {
        text: 'Ini adalah menu Shop. Disini kamu bisa membeli diamond dan juga incubator untuk mengerami telur.',
        fn: function () {
            $w.GameApp.rootScope.setSlide(0);
            var allmenu = $('#t-bottomNavWrapper .bottomNav li');
            $(allmenu).removeClass('focus');
            $(allmenu[0]).addClass('focus');
        }
    };
    scene[2] = {
        text: 'Ini adalah menu Chars. Untuk mengenal lebih dekat monster-monster yang ada di hatchmarket.',
        fn: function () {
            $w.GameApp.rootScope.setSlide(1);
            var allmenu = $('#t-bottomNavWrapper .bottomNav li');
            $(allmenu).removeClass('focus');
            $(allmenu[1]).addClass('focus');
        }
    };
    scene[3] = {
        text: 'Ini adalah menu hatch, tempat kamu mendapatkan monster dengan mengerami telur.',
        fn: function () {
            $w.GameApp.rootScope.setSlide(2);
            var allmenu = $('#t-bottomNavWrapper .bottomNav li');
            $(allmenu).removeClass('focus');
            $(allmenu[2]).addClass('focus');
        }
    };
    scene[4] = {
        text: 'Ini adalah menu island. Tempat kamu dan monster-mu melakukan farming.',
        fn: function () {
            $w.GameApp.rootScope.setSlide(3);
            var allmenu = $('#t-bottomNavWrapper .bottomNav li');
            $(allmenu).removeClass('focus');
            $(allmenu[3]).addClass('focus');
        }
    };
    scene[5] = {
        text: 'Ini adalah menu spread, tempat kamu menyebar eggcode ke semua sosial media.',
        fn: function () {
            $w.GameApp.rootScope.setSlide(4);
            var allmenu = $('#t-bottomNavWrapper .bottomNav li');
            $(allmenu).removeClass('focus');
            $(allmenu[4]).addClass('focus');
        }
    };
    scene[6] = {
        text: 'Dan terakhir menu redeem. Disini kamu bisa menukarkan Coin yang kamu punya dengan berbagai jenis hadiah menarik.',
        fn: function () {
            $w.GameApp.rootScope.setSlide(5);
            var allmenu = $('#t-bottomNavWrapper .bottomNav li');
            $(allmenu).removeClass('focus');
            $(allmenu[5]).addClass('focus');
        }
    };
    scene[7] = {
        text: 'Sekarang ayo kita mulai hatching. Untuk dapat telur kamu butuh eggcode. Tapi sekarang, kamu cukup gunakan "Freecode" sebagai eggcode mu.',
        fn: function () {
            $w.GameApp.rootScope.setSlide(2);
            var allmenu = $('#t-bottomNavWrapper .bottomNav li');
            $(allmenu).removeClass('focus');
        }
    };
    scene[8] = {
        text: 'Selanjutnya tekan enter eggcode.',
        fn: function () {
            $w.GameApp.rootScope.setSlide(2);
            var allmenu = $('#t-bottomNavWrapper .bottomNav li');
            $(allmenu).removeClass('focus');
        }
    };
    scene[9] = {
        text: '',
        fn: function () {
            $('#tutorial-section').hide();
            $('#inputCodeButton').click($w.GameApp.rootScope.enterCode);
            $('#inputCodeButton').addClass('animated bounce');

            $('#t-header .inner').html('<p>Tekan Enter Code</p>');
            $('#t-header').show();
        }
    };
    scene[10] = {
        text: 'Nah telurnya sudah dapat. Ingat, jika kamu ingin eggcode kamu bisa mendapatkannya di sosial media dengan mencari #hatchmarket.',
        fn: function () {
            $('#tutorial-section').show();
            $('#t-header .inner').html('');
            $('#t-header').hide();
        }
    };
    scene[11] = {
        text: 'Sekarang kita gunakan incubator untuk mengeraminya.',
        fn: function () {
            $('#tutorial-section').show();

        }
    };
    scene[12] = {
        text: 'Jika incubator kamu masih seperti ini, berarti kamu belum memilikinya.',
        fn: function () {
            var t1 = '<img src="asset/img/egg-incubator/Incubator-Lv.1-outline.png" style="width:30vw;">';
            $('#t-content').html(t1);
        }
    };
    scene[13] = {
        text: 'Jika incubator kamu  seperti ini, berarti kamu sudah memilikinya. Ini adalah Mini Incubator, kamu bisa mendapatkannya secara gratis setiap 6 jam sekali.',
        fn: function () {
            var t1 = '<img src="asset/img/egg-incubator/Incubator-Lv.1.png" style="width:30vw;">';
            $('#t-content').html(t1);
        }
    };
    scene[14] = {
        text: 'Sedangkan empat lainnya bisa kamu beli di menu shop.',
        fn: function () {
            var t1 = '<table style="margin:auto;" id="t-active-incubator"><tr class="row1"><td class="col-left"><img src="asset/img/egg-incubator/Incubator-Lv.4.png" style="width:30vw;"></td><td class="col-right"><img src="asset/img/egg-incubator/Incubator-Lv.5.png" style="width:30vw;"></td></tr><tr class="row2"><td class="col-left"><img src="asset/img/egg-incubator/Incubator-Lv.2.png" style="width:25vw;"></td><td class="col-right"><img src="asset/img/egg-incubator/Incubator-Lv.3.png" style="width:25vw;"></td></tr></table>';
            $('#t-content').html(t1);
        }
    };
    scene[15] = {
        text: 'Ayo kita hatch telurnya.! Selanjutnya tekan mini incubator.',
        fn: function () {
            $('#t-content').html('');
        }
    };
    scene[16] = {
        text: '',
        fn: function () {
            $('#tutorial-section').hide();
            //$('#hatchingAreaHeader').hide();
            $('#t-header .inner').html('<p>Pilih Mini Incubator</p>');
            $('#t-header').show();
            $w.GameApp.rootScope.t_chooseIncubator();
        }
    };
    scene[17] = {
        text: 'Telur kamu sedang di hatching sekarang.',
        fn: function () {
            $('#tutorial-section').show();
            //$('#hatchingAreaHeader').show();
            $('#t-header .inner').html('');
            $('#t-header').hide();
            //$w.GameApp.rootScope.onScene17();
        }
    };
    scene[18] = {
        text: 'Ini indikator waktu hingga menetas.',
        fn: function () {
            eventClick = function () {
                var dr = $('#slot-1 .hatchingDuration').clone();
                $('#t-content').html(dr);
            };
            var dr = $('#slot-1 .hatchingDuration').clone();
            $('#t-content').html(dr)
            $w.addEventListener('serverdatetick', eventClick);
        }
    };
    scene[19] = {
        text: 'Tersedia tombol untuk menuntaskan hatching tanpa perlu menunggu lama. Tekan tombol finish now lalu buka telurnya.',
        fn: function () {
            $w.removeEventListener('serverdatetick', eventClick);
            $('#slot-1 .borderBox.actionButton').addClass('animated bounce');
            $('#t-content').html('');
        }
    };
    scene[20] = {
        text: '',
        fn: function () {
            $('#tutorial-section').hide();
            //$('#hatchingAreaHeader').hide();
            $('#t-header .inner').html('<p>Tekan tombol Finish Now</p>');
            $('#t-header').show();
            $('#slot-1 .borderBox.actionButton').removeClass('animated bounce');
            $('#slot-1 .borderBox.actionButton').addClass('animated bounceIn');
        }
    };
    scene[21] = {
        text: '',
        fn: function () {
            $('#tutorial-section').hide();
            //$('#hatchingAreaHeader').hide();
            $('#t-header .inner').html('<p>Tekan tombol Open Now</p>');
            $('#t-header').show();

            $('#slot-1 .borderBox.actionButton.done').addClass('animated bounce');
        }
    };
    scene[22] = {
        text: 'Wah kamu dapat monster yang keren. Selamat !',
        fn: function () {
            $('#tutorial-section').show();
            //$('#hatchingAreaHeader').show();
            $('#t-header').hide();
            //$w.GameApp.rootScope.onScene22();

            /*
            $w.setTimeout(function () {
                $w.tutorial.next();
            }, 2500);
            */
        }
    };
    scene[23] = {
        text: '',
        fn: function () {
            $('#tutorial-section').hide();
            $('#modalChar .tutorial-header-enter-egg').show();
        }
    };
    scene[24] = {
        text: 'Nah, setelah hatching, sekarang ayo kita menuju menu spread untuk membagikan eggcode mu!',
        fn: function () {
            $('#tutorial-section').show();

        }
    };
    scene[25] = {
        text: '',
        fn: function () {
            $('#tutorial-section').hide();
            $('#t-header .inner').html('<p>Pilih menu spread.</p>');
            $('#t-header').show();

            $('#menuspreading').click(function () {
                $w.GameApp.rootScope.setSlide(4);
                $w.tutorial.next();
            });
        }
    };
    scene[26] = {
        text: 'Ini adalah list eggcode dari monster yang kamu punya. Sekarang, ayo langsung kita spreading eggcode dengan memilih salah satu monster yang kamu punya saat ini.',
        fn: function () {
            $('#tutorial-section').show();
            $('#t-header').hide();
        }
    };
    scene[27] = {
        text: '.',
        fn: function () {
            var firstChar = $w.GameApp.rootScope.playerChars[0];
            //console.log(firstChar);
            $('#tutorial-section').hide();
            $('#t-header .inner').html('<p>Sekarang, Pilih "'+firstChar.nickname+'"</p>');
            $('#t-header').show();
        }
    };
    scene[28] = {
        text: 'Nah ini adalah eggcode dari monster kamu. Ada 2 jenis eggcode, yaitu "Golden" dan "Silver".',
        fn: function () {
            $('#tutorial-section').show();
            $('#t-header').hide();
        }
    };
    scene[29] = {
        text: 'Golden eggcode didapat jika telur di-hatch dengan "Premium incubator" (selain mini incubator). Setiap golden eggcode kepunyaanmu di-hatch oleh para "hatcher" lain dengan menggunakan premium incubator-nya, maka kamu mendapatkan "50 coin". ',
        fn: function () {
            

        }
    };
    scene[30] = {
        text: 'Sedangkan Silver Eggcode didapat jika telur di-hatch dengan "Mini Incubator". Setiap Silver eggcode kepunyaanmu di-hatch oleh 10 hatcher berbeda dengan menggunakan premium incubator-nya, maka kamu diberi hadiah Stone Incubator dan berlaku kelipatannya.',
        fn: function () {


        }
    };
    scene[31] = {
        text: ' Nah Sekarang, ayo sebar Eggcode kamu ke social media agar para hatcher lain bisa menggunakan eggcode kamu. Untuk mempermudah, tulislah #hatchmarket saat melakukan posting ke social media kamu.',
        fn: function () {


        }
    };
    scene[32] = {
        text: '',
        fn: function () {
            $('#tutorial-section').hide();
            $('#t-header .inner').html('<p>Pilih social media yang kamu punya</p><p>Tulis #hatchmarket saat kamu posting.</p>');
            $('#t-header').show();
        }
    };
    to.setScene = function (idx) {
        if (idx > (scene.length - 1)) {
            return;
        }
        var txt = scene[idx].text;
        var cbfunc = scene[idx].fn;
        currentScene = idx;
        $('#t-bottom-info-text').html(txt);
        cbfunc();
    };
    to.next = function () {
        var idx = currentScene + 1;
        to.setScene(idx);
    };

    //$w.addEventListener('gameappready', function () {
    //    $w.setTimeout(function () {
    //        to.setScene(0);
    //        $('#tutorial-section').show();
    //    }, 1000);
    //});

    window.tutorial = to;
})(window);
