(function (win) {
    'use strict';

    var logger = [];
    var $ = win.jQuery;
    var container = win.document.createElement('section');
    container.style.position = 'fixed';
    container.style.display = 'none';
    container.style.zIndex = 20;
    container.style.width = '100vw';
    container.style.height = '100vh';


    
    /**
    * Debugging business, harus di binding ke data object
    * @param object
    */
    win.GameApp.debug = function (whatever) {
        if (typeof (whatever) == 'object') {
          //  logger.push(whatever);
        }
        
        $(container).append('<div>'+JSON.stringify(whatever)+'</div>');

        win.console.log(whatever);
    }
    
    win.addEventListener('gameappready', function () {
        $('#playerCoin .icon-coin').click(function () {
           
        });
        $('body').append(container);
       // win.console.log = win.GameApp.debug;
    });
})(window);