/** Share Page Controller **/
(function ShareClass(w) {
  'use strict'
  var $w = w,
    ng = w.angular,
    $ = w.jQuery,
    kjua = w.kjua;

  function createQRCode(_char) {
    //var playerChar = $w.GameApp.CharServices.getPlayerCharById(playerCharId);
    var char = Object(_char);
    var qrColor = {};

    if (char.eggclass == 'golden') {
      qrColor = {
        // code color
        fill: '#f8931f',
        // background color
        back: '#ffffe3'
      };
    } else {
      qrColor = {
        // code color
        fill: '#b3b3b3',
        // background color
        back: '#ffffff'
      };
    }



    var qrcode = kjua({
      // render method: 'canvas' or 'image'
      render: 'canvas',
      // render pixel-perfect lines
      crisp: false,
      // minimum version: 1..40
      minVersion: 1,
      // error correction level: 'L', 'M', 'Q' or 'H'
      ecLevel: 'L',
      // size in pixel
      size: 100,
      // pixel-ratio, null for devicePixelRatio
      ratio: $w.devicePixelRatio,
      // code color
      fill: qrColor.fill,
      // background color
      back: qrColor.back,
      // content
      text: char.code,
      // roundend corners in pc: 0..100
      rounded: 0,
      // quiet zone in modules
      quiet: 0,
      // modes: 'plain', 'label' or 'image'
      mode: 'plain',
      // label/image size and pos in pc: 0..100
      mSize: 20,
      mPosX: 50,
      mPosY: 50,
      // label
      label: char.code,
      fontname: 'sans',
      fontcolor: '#000',
      // image element
      image: null
    });
    return qrcode;
  }

  function ShareCtrl($scope, $rootScope) {
    var renderer;
    renderer = new PIXI.autoDetectRenderer(250, 250, {
      antialiasing: false,
      transparent: true,
      resolution: window.devicePixelRatio,
      autoResize: true,
    }, true);
    $('#shareRenderer').html(renderer.view);
    renderer.view.addEventListener('tap', $scope.showCharList);

    function fetchPlayerChars() {
      //$('#shareCharList').fadeOut('fast');
      var data = $w.GameApp.CharServices.getEnviPlayerChar($scope.selectedIsland.id);
      var shareChars = [];
      for (var i = 0; i < 10; i++) {
        var _char = data[i] || { nickname: '-' };
        shareChars.push(_char);
      }
      $scope.shareChars = shareChars;
      //$('#shareCharList').fadeIn('fast');
    }


    function renderQRCode(_char) {
      var char = Object(_char);
      var textCode = 'NO CODE';
      var stage = new PIXI.Container();
      var bg = {};
      var textColor = 0xef5725;

      if (char.eggclass == 'golden') {
        bg = new PIXI.Sprite(PIXI.loader.resources.goldEgg.texture);
        textColor = 0xef5725;
      } else {
        bg = new PIXI.Sprite(PIXI.loader.resources.silverEgg.texture);
        textColor = 0x4d4d4d;
      }

      var qrcode = createQRCode(char);
      var texture = PIXI.Texture.fromCanvas(qrcode);
      var spriteQRCode = new PIXI.Sprite(texture);

      spriteQRCode.position.set(200, 195);
      bg.addChild(spriteQRCode);

      textCode = String(char.code).trim();

      var textSpriteCode = new PIXI.Text(textCode, {
        fontSize: '28px',
        fill: 0xffffff,
        align: 'center',
        fontWeight: 'bolder'
      });
      textSpriteCode.position.set(((bg.width - textSpriteCode.width) / 2), 469);
      bg.addChild(textSpriteCode);

      var expired = new Date(char.lifeEnd),
              day = expired.getDate(),
              month = expired.getMonth() + 1,
              year = expired.getFullYear(),
              hour = expired.getHours(),
              minute = expired.getMinutes();

      day = (String(day).length == 1) ? '0' + day : day;
      month = (String(month).length == 1) ? '0' + month : month,
              minute = (String(minute).length == 1) ? '0' + minute : minute,
              hour = (String(hour).length == 1) ? '0' + hour : hour;


      //var textExpired = 'Expired : ' + day + ' ' + month + ' ' + year;

      var expiredDateText = new PIXI.Text(day + '.' + month + '.' + year,
              { fontSize: '16px', fill: textColor, align: 'center', fontWeight: 'bolder' });
      expiredDateText.position.x = ((bg.width - expiredDateText.width) / 2);
      expiredDateText.position.y = 534;
      bg.addChild(expiredDateText);

      var expiredTimeText = new PIXI.Text(hour + ' : ' + minute,
              { fontSize: '16px', fill: textColor, align: 'center', fontWeight: 'bolder' });
      expiredTimeText.position.x = 305;
      expiredTimeText.position.y = 512;
      bg.addChild(expiredTimeText);


      bg.width = 250;
      bg.height = 250;
      stage.addChild(bg);

      renderer.render(stage);


      //var imgEncoded = renderer.view.toDataURL("image/png", 1);
      //var a = document.createElement('img');
      //a.src = imgEncoded;
      //document.getElementById('socmedIconWrapper').appendChild(a);
    }

    $scope.selectedIsland = {};
    $scope.shareChars = [];
    $scope.changeIsland = function () {
      $scope.isDisplayCode = false;

      var nextID = $scope.selectedIsland.id + 1;
      if (nextID > $w.GameApp.JsonData.island.length) {
        nextID = 1;
      }
      $scope.selectedIsland = $w.GameApp.IslandServices.getIsland(nextID);
      fetchPlayerChars();

    };

    $rootScope.refreshSharePlayerChars = fetchPlayerChars;

    $scope.isDisplayCode = false;
    $scope.setPage = function (index) {

      if ($("#shareTab-" + index).hasClass('active')) {
        return;
      }
      $('.sharePageContent').hide();
      $('#sharePage-' + index).fadeIn('fast');

      $('#sharePageNav li').removeClass('active');
      $("#shareTab-" + index).addClass('active');
    };

    $scope.showEggCode = function (charCode) {
      if (typeof (charCode) == 'undefined') {
        return;
      }
      var char = (function () {
        var data = $w.GameApp.CharServices.getPlayerChars();
        for (var i = 0; i < data.length; i++) {
          if (String(data[i].code).toUpperCase() === String(charCode).toUpperCase()) {
            return data[i];
          }
        }
      })();

      renderQRCode(char);

      $scope.isDisplayCode = true;
    };

    $scope.isDisplayReward = false;
    $scope.showReward = function () {
      $scope.isDisplayReward = true;
    };
    $scope.showCharList = function () {
      $scope.isDisplayCode = false;
      $scope.isDisplayReward = false;
    };

    $scope.sharetoFb = function () {
      function successCallback() { }
      ;
      function errorCallback() {
        alert('Cannot share with facebook app');
      }
      ;
      function fileOrFileArray() {
        var imgEncoded = renderer.view.toDataURL("image/png", 1);
        return imgEncoded;
      }
      ;
      function url() {
        return 'http://hatchmarket.id';
      }
      ;
      function message() {
        return 'Hello hatcher';
      }
      ;
      if (window.plugins && window.plugins.socialsharing && $scope.isDisplayCode) {
        window.plugins.socialsharing.shareViaFacebook(message(), fileOrFileArray(), url(), successCallback, errorCallback);
      }

    };
    $scope.sharetoIg = function () {
      function successCallback() { }
      ;
      function errorCallback() {
        alert('cannot share');
      }
      ;
      function fileOrFileArray() {
        var imgEncoded = renderer.view.toDataURL("image/png", 1);
        return imgEncoded;
      }
      ;
      function message() {
        return 'Hello hatcher';
      }
      ;
      if (window.plugins && window.plugins.socialsharing && $scope.isDisplayCode) {
        window.plugins.socialsharing.shareViaInstagram(message(), fileOrFileArray(), successCallback, errorCallback);
      }
    };
    $scope.sharetoTwit = function () {
      function successCallback() { }
      ;
      function errorCallback() {
        alert('cannot share');
      }
      ;
      function fileOrFileArray() {
        var imgEncoded = renderer.view.toDataURL("image/png", 1);
        return imgEncoded;
      }
      ;
      function message() {
        return 'Hello hatcher';
      }
      ;
      if (window.plugins && window.plugins.socialsharing && $scope.isDisplayCode) {
        window.plugins.socialsharing.shareViaTwitter(message(), fileOrFileArray(), successCallback, errorCallback);
      }
    };
    $scope.sharetoWa = function () {
      function successCallback() { }
      ;
      function errorCallback() {
        alert('cannot share');
      }
      ;
      function fileOrFileArray() {
        var imgEncoded = renderer.view.toDataURL("image/png", 1);
        return imgEncoded;
      }
      ;
      function url() {
        return 'http://hatchmarket.id';
      }
      ;
      function message() {
        return 'Hello hatcher';
      }
      ;
      if (window.plugins && window.plugins.socialsharing && $scope.isDisplayCode) {
        window.plugins.socialsharing.shareViaWhatsApp(message(), fileOrFileArray(), url(), successCallback, errorCallback);
      }
    };
    $scope.sharetoPath = function () {
      function successCallback() { }
      ;
      function errorCallback(e) {
        alert('Cannot share');
      }
      ;
      function fileOrFileArray() {
        var imgEncoded = renderer.view.toDataURL("image/png", 1);
        return imgEncoded;
      }
      ;
      function url() {
        return 'http://hatchmarket.id';
      }
      ;
      function message() {
        return 'Hello hatcher';
      }
      ;
      function subject() {
        return 'Hatch Market ID'
      }
      ;
      if (window.plugins && window.plugins.socialsharing && $scope.isDisplayCode) {
        window.plugins.socialsharing.share(message(), subject(), fileOrFileArray(), url(), successCallback, errorCallback);
      }

    };
    $scope.saveThis = function () {
      /** Process the type1 base64 string **/
      var myBaseString = renderer.view.toDataURL("image/png", 1);

      // Split the base64 string in data and contentType
      var block = myBaseString.split(";");
      // Get the content type
      var dataType = block[0].split(":")[1];// In this case "image/png"
      // get the real base64 content of the file
      var realData = block[1].split(",")[1];// In this case "iVBORw0KGg...."

      // The path where the file will be created
      var folderpath = cordova.file.dataDirectory || "file:///storage/emulated/0/";
      // The name of your file, note that you need to know if is .png,.jpeg etc
      var filename = Date.parse(new Date()) + ".png";

      if ($scope.isDisplayCode) {
        $w.savebase64AsImageFile(folderpath, filename, realData, dataType);
      }
    };

    //-- run once
    $w.addEventListener('gameappready', function () {
      $scope.selectedIsland = $w.GameApp.IslandServices.getIsland(1);
      fetchPlayerChars();

      //renderQRCode({ code: '12345678', isWithCode: 1, lifeEnd: Date.parse(new Date()) });
      //$scope.isDisplayCode = true;

    });

  }
  angular.module('gamesapp').controller('ShareCtrl', ['$scope', '$rootScope', ShareCtrl]);

})(window);

(function SaveImageFile(window) {
  /**
   * Convert a base64 string in a Blob according to the data and contentType.
   * 
   * @param b64Data {String} Pure base64 string without contentType
   * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
   * @param sliceSize {Int} SliceSize to process the byteCharacters
   * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
   * @return Blob
   */
  function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  /**
   * Create a Image file according to its database64 content only.
   * 
   * @param folderpath {String} The folder where the file will be created
   * @param filename {String} The name of the file that will be created
   * @param content {Base64 String} Important : The content can't contain the following string (data:image/png[or any other format];base64,). Only the base64 string is expected.
   */
  function savebase64AsImageFile(folderpath, filename, content, contentType) {
    // Convert the base64 string in a Blob
    var DataBlob = b64toBlob(content, contentType);
    console.log("Starting to write the file :3");
    window.resolveLocalFileSystemURL(folderpath, function (dir) {
      console.log("Access to the directory granted succesfully");
      dir.getFile(filename, { create: true }, function (file) {
        console.log("File created succesfully.");
        file.createWriter(function (fileWriter) {
          console.log("Writing content to file");
          fileWriter.write(DataBlob);
        }, function () {
          alert('Unable to save file in path ' + folderpath);
        });
      });
    });
  }



  window.b64toBlob = window.b64toBlob || b64toBlob;
  window.savebase64AsImageFile = window.savebase64AsImageFile || savebase64AsImageFile;
})(window);