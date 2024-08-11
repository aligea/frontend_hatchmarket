(function (global) {
    'use strict';

    var _oneblock = { w: 108, h: 128 };
    var isWalking = true;
    var _routes = [{
        stageId: 1,
        path: {
            A: [
                { x: 2, y: 5, clockwiseDirection: 'right', reverseDirection: 'right' },
                { x: 6, y: 5, clockwiseDirection: 'down', reverseDirection: 'left' },
                { x: 6, y: 7, clockwiseDirection: 'left', reverseDirection: 'up' },
                { x: 2, y: 7, clockwiseDirection: 'up', reverseDirection: 'right' },
                { x: 2, y: 6, clockwiseDirection: 'down', reverseDirection: 'down' }
            ],
            B: [
                { x: 2, y: 6, clockwiseDirection: 'right', reverseDirection: 'right' },
                { x: 4, y: 6, clockwiseDirection: 'right', reverseDirection: 'left' },
                { x: 7, y: 6, clockwiseDirection: 'left', reverseDirection: 'left' }
            ],
            C: [
                { x: 4, y: 8, clockwiseDirection: 'down', reverseDirection: 'down' },
                { x: 4, y: 10, clockwiseDirection: 'right', reverseDirection: 'up' },
                { x: 7.5, y: 10, clockwiseDirection: 'left', reverseDirection: 'left' }
            ],
            D: [
                { x: 2.5, y: 10, clockwiseDirection: 'right', reverseDirection: 'right' },
                { x: 7.5, y: 10, clockwiseDirection: 'left', reverseDirection: 'left' }
            ],
            E: [
                { x: 4, y: 8, clockwiseDirection: 'down', reverseDirection: 'down' },
                { x: 4, y: 9, clockwiseDirection: 'down', reverseDirection: 'up' },
                { x: 4, y: 10, clockwiseDirection: 'left', reverseDirection: 'up' },
                { x: 2.5, y: 10, clockwiseDirection: 'right', reverseDirection: 'right' }
            ],
            F: [
                { x: 4, y: 8, clockwiseDirection: 'down', reverseDirection: 'down' },
                { x: 4, y: 10, clockwiseDirection: 'left', reverseDirection: 'up' },
                { x: 3, y: 10, clockwiseDirection: 'down', reverseDirection: 'right' },
                { x: 3, y: 11, clockwiseDirection: 'up', reverseDirection: 'up' }
            ]
            /*A: [
             {x: 7, y: 11, clockwiseDirection: 'left', reverseDirection: 'left'},
             {x: 4, y: 11, clockwiseDirection: 'up', reverseDirection: 'right'},
             {x: 4, y: 9, clockwiseDirection: 'left', reverseDirection: 'down'},
             {x: 1, y: 9, clockwiseDirection: 'up', reverseDirection: 'right'},
             {x: 1, y: 7, clockwiseDirection: 'right', reverseDirection: 'down'},
             {x: 2, y: 7, clockwiseDirection: 'up', reverseDirection: 'left'},
             {x: 2, y: 5, clockwiseDirection: 'right', reverseDirection: 'down'},
             {x: 8, y: 5, clockwiseDirection: 'left', reverseDirection: 'left'}
             ],
             B: [
             {x: 3, y: 5, clockwiseDirection: 'up', reverseDirection: 'up'},
             {x: 3, y: 4, clockwiseDirection: 'right', reverseDirection: 'down'},
             {x: 7, y: 4, clockwiseDirection: 'down', reverseDirection: 'left'},
             {x: 7, y: 6, clockwiseDirection: 'left', reverseDirection: 'up'},
             {x: 3, y: 6, clockwiseDirection: 'down', reverseDirection: 'right'},
             {x: 3, y: 8, clockwiseDirection: 'right', reverseDirection: 'up'},
             {x: 6, y: 8, clockwiseDirection: 'down', reverseDirection: 'left'},
             {x: 6, y: 10, clockwiseDirection: 'right', reverseDirection: 'up'},
             {x: 8, y: 10, clockwiseDirection: 'down', reverseDirection: 'left'},
             {x: 8, y: 13, clockwiseDirection: 'left', reverseDirection: 'up'},
             {x: 3, y: 13, clockwiseDirection: 'up', reverseDirection: 'right'},
             {x: 3, y: 10, clockwiseDirection: 'right', reverseDirection: 'down'},
             {x: 5, y: 10, clockwiseDirection: 'left', reverseDirection: 'left'}
             ]*/
        }
    }, {
        stageId: 2,
        path: {
            A: [
                { x: 2.5, y: 11, clockwiseDirection: 'right', reverseDirection: 'right' },
                { x: 6, y: 11, clockwiseDirection: 'down', reverseDirection: 'left' },
                { x: 6, y: 13, clockwiseDirection: 'up', reverseDirection: 'up' }
            ],
            B: [
                { x: 8, y: 11, clockwiseDirection: 'left', reverseDirection: 'left' },
                { x: 6, y: 11, clockwiseDirection: 'down', reverseDirection: 'right' },
                { x: 6, y: 13, clockwiseDirection: 'up', reverseDirection: 'up' }
            ],
            C: [
                { x: 3.5, y: 3, clockwiseDirection: 'right', reverseDirection: 'right' },
                { x: 7, y: 3, clockwiseDirection: 'down', reverseDirection: 'left' },
                { x: 7, y: 5, clockwiseDirection: 'left', reverseDirection: 'up' },
                { x: 3.5, y: 5, clockwiseDirection: 'right', reverseDirection: 'right' }
            ],
            D: [
                { x: 5.5, y: 8, clockwiseDirection: 'right', reverseDirection: 'right' },
                { x: 8, y: 8, clockwiseDirection: 'left', reverseDirection: 'left' }
            ],
            E: [
                { x: 2.5, y: 10, clockwiseDirection: 'right', reverseDirection: 'right' },
                { x: 4.5, y: 10, clockwiseDirection: 'down', reverseDirection: 'left' },
                { x: 4.5, y: 11, clockwiseDirection: 'left', reverseDirection: 'up' },
                { x: 2.5, y: 11, clockwiseDirection: 'right', reverseDirection: 'right' }
            ],
            F: [
                { x: 2, y: 4, clockwiseDirection: 'right', reverseDirection: 'right' },
                { x: 3.5, y: 4, clockwiseDirection: 'down', reverseDirection: 'left' },
                { x: 3.5, y: 5.5, clockwiseDirection: 'right', reverseDirection: 'up' },
                { x: 4.5, y: 5.5, clockwiseDirection: 'down', reverseDirection: 'left' },
                { x: 4.5, y: 6, clockwiseDirection: 'right', reverseDirection: 'up' },
                { x: 5.5, y: 6, clockwiseDirection: 'left', reverseDirection: 'left' }
            ],
            G: [
                { x: 2, y: 4, clockwiseDirection: 'right', reverseDirection: 'right' },
                { x: 3.5, y: 4, clockwiseDirection: 'up', reverseDirection: 'left' },
                { x: 3.5, y: 3, clockwiseDirection: 'right', reverseDirection: 'down' },
                { x: 7, y: 3, clockwiseDirection: 'left', reverseDirection: 'left' }
            ]
            /*A: [
             {x: 4, y: 4, clockwiseDirection: 'up', reverseDirection: 'up'},
             {x: 4, y: 3, clockwiseDirection: 'right', reverseDirection: 'down'},
             {x: 7, y: 3, clockwiseDirection: 'down', reverseDirection: 'left'},
             {x: 7, y: 5, clockwiseDirection: 'left', reverseDirection: 'up'},
             {x: 3, y: 5, clockwiseDirection: 'down', reverseDirection: 'right'},
             {x: 3, y: 8, clockwiseDirection: 'left', reverseDirection: 'up'},
             {x: 1, y: 8, clockwiseDirection: 'up', reverseDirection: 'right'},
             {x: 1, y: 6, clockwiseDirection: 'right', reverseDirection: 'down'},
             {x: 2, y: 6, clockwiseDirection: 'left', reverseDirection: 'left'}
             ],
             B: [
             {x: 2, y: 4, clockwiseDirection: 'right', reverseDirection: 'right'},
             {x: 4, y: 4, clockwiseDirection: 'down', reverseDirection: 'left'},
             {x: 4, y: 6, clockwiseDirection: 'right', reverseDirection: 'up'},
             {x: 6, y: 6, clockwiseDirection: 'down', reverseDirection: 'left'},
             {x: 6, y: 8, clockwiseDirection: 'right', reverseDirection: 'up'},
             {x: 8, y: 8, clockwiseDirection: 'left', reverseDirection: 'left'}
             ],
             C: [
             {x: 8, y: 8, clockwiseDirection: 'left', reverseDirection: 'left'},
             {x: 5, y: 8, clockwiseDirection: 'down', reverseDirection: 'right'},
             {x: 5, y: 12, clockwiseDirection: 'left', reverseDirection: 'up'},
             {x: 2, y: 12, clockwiseDirection: 'up', reverseDirection: 'right'},
             {x: 2, y: 10, clockwiseDirection: 'right', reverseDirection: 'down'},
             {x: 4, y: 10, clockwiseDirection: 'left', reverseDirection: 'left'}
             ],
             D: [
             {x: 1, y: 11, clockwiseDirection: 'right', reverseDirection: 'right'},
             {x: 8, y: 11, clockwiseDirection: 'left', reverseDirection: 'left'},
             {x: 6, y: 11, clockwiseDirection: 'down', reverseDirection: 'right'},
             {x: 6, y: 13, clockwiseDirection: 'left', reverseDirection: 'up'},
             {x: 3, y: 13, clockwiseDirection: 'up', reverseDirection: 'right'},
             {x: 3, y: 11, clockwiseDirection: 'left', reverseDirection: 'down'},
             {x: 1, y: 11, clockwiseDirection: 'right', reverseDirection: 'right'}
             ]*/
        }

    }, {
        stageId: 3,
        path: {
            A: [
                { x: 5, y: 6, clockwiseDirection: 'down', reverseDirection: 'down' },
                { x: 5, y: 12, clockwiseDirection: 'right', reverseDirection: 'up' },
                { x: 8, y: 12, clockwiseDirection: 'up', reverseDirection: 'left' },
                { x: 8, y: 11, clockwiseDirection: 'left', reverseDirection: 'down' },
                { x: 6, y: 11, clockwiseDirection: 'right', reverseDirection: 'right' }
            ],
            B: [
                { x: 5, y: 6, clockwiseDirection: 'down', reverseDirection: 'down' },
                { x: 5, y: 12.5, clockwiseDirection: 'left', reverseDirection: 'up' },
                { x: 4, y: 12.5, clockwiseDirection: 'down', reverseDirection: 'right' },
                { x: 4, y: 13.5, clockwiseDirection: 'left', reverseDirection: 'up' },
                { x: 3, y: 13.5, clockwiseDirection: 'right', reverseDirection: 'right' }
            ],
            C: [
                { x: 5, y: 6, clockwiseDirection: 'down', reverseDirection: 'down' },
                { x: 5, y: 9.75, clockwiseDirection: 'left', reverseDirection: 'up' },
                { x: 2.5, y: 9.75, clockwiseDirection: 'right', reverseDirection: 'right' }
            ],
            D: [
                { x: 2.75, y: 6.75, clockwiseDirection: 'right', reverseDirection: 'right' },
                { x: 5.75, y: 6.75, clockwiseDirection: 'left', reverseDirection: 'left' }
            ]
            /*A: [
             {x: 3, y: 3, clockwiseDirection: 'right', reverseDirection: 'right'},
             {x: 7, y: 3, clockwiseDirection: 'down', reverseDirection: 'left'},
             {x: 7, y: 5, clockwiseDirection: 'left', reverseDirection: 'up'},
             {x: 3, y: 5, clockwiseDirection: 'up', reverseDirection: 'right'},
             {x: 3, y: 4, clockwiseDirection: 'down', reverseDirection: 'down'}
             ],
             B: [
             {x: 4, y: 9, clockwiseDirection: 'left', reverseDirection: 'left'},
             {x: 2, y: 9, clockwiseDirection: 'up', reverseDirection: 'right'},
             {x: 2, y: 6, clockwiseDirection: 'right', reverseDirection: 'down'},
             {x: 5, y: 6, clockwiseDirection: 'down', reverseDirection: 'left'},
             {x: 5, y: 11, clockwiseDirection: 'right', reverseDirection: 'up'},
             {x: 8, y: 11, clockwiseDirection: 'down', reverseDirection: 'left'},
             {x: 8, y: 13, clockwiseDirection: 'left', reverseDirection: 'up'},
             {x: 5, y: 13, clockwiseDirection: 'up', reverseDirection: 'right'},
             {x: 5, y: 12, clockwiseDirection: 'down', reverseDirection: 'down'}
             ],
             C: [
             {x: 1, y: 8, clockwiseDirection: 'right', reverseDirection: 'right'},
             {x: 4, y: 8, clockwiseDirection: 'down', reverseDirection: 'left'},
             {x: 4, y: 10, clockwiseDirection: 'left', reverseDirection: 'up'},
             {x: 1, y: 10, clockwiseDirection: 'up', reverseDirection: 'right'},
             {x: 1, y: 9, clockwiseDirection: 'down', reverseDirection: 'down'}
             ],
             D: [
             {x: 2, y: 12, clockwiseDirection: 'right', reverseDirection: 'right'},
             {x: 8, y: 12, clockwiseDirection: 'down', reverseDirection: 'left'},
             {x: 8, y: 13, clockwiseDirection: 'left', reverseDirection: 'up'},
             {x: 2, y: 13, clockwiseDirection: 'right', reverseDirection: 'right'}
             ]*/
        }
    }, {
        stageId: 4,
        path: {
            A: [
                { x: 2, y: 12, clockwiseDirection: 'up', reverseDirection: 'up' },
                { x: 2, y: 9, clockwiseDirection: 'right', reverseDirection: 'down' },
                { x: 5, y: 9, clockwiseDirection: 'up', reverseDirection: 'left' },
                { x: 5, y: 5, clockwiseDirection: 'right', reverseDirection: 'down' },
                { x: 8, y: 5, clockwiseDirection: 'left', reverseDirection: 'left' }
            ],
            B: [
                { x: 3, y: 9, clockwiseDirection: 'right', reverseDirection: 'right' },
                { x: 5.5, y: 9, clockwiseDirection: 'down', reverseDirection: 'left' },
                { x: 5.5, y: 12, clockwiseDirection: 'left', reverseDirection: 'up' },
                { x: 3, y: 12, clockwiseDirection: 'up', reverseDirection: 'right' },
                { x: 3, y: 10, clockwiseDirection: 'down', reverseDirection: 'down' }
            ],
            C: [
                { x: 3, y: 8.5, clockwiseDirection: 'right', reverseDirection: 'right' },
                { x: 6, y: 8.5, clockwiseDirection: 'left', reverseDirection: 'left' }
            ],
            D: [
                { x: 3, y: 9, clockwiseDirection: 'right', reverseDirection: 'right' },
                { x: 6, y: 9, clockwiseDirection: 'down', reverseDirection: 'left' },
                { x: 6, y: 11, clockwiseDirection: 'right', reverseDirection: 'up' },
                { x: 7, y: 11, clockwiseDirection: 'left', reverseDirection: 'left' }
            ],
            E: [
                { x: 3, y: 5, clockwiseDirection: 'right', reverseDirection: 'right' },
                { x: 5, y: 5, clockwiseDirection: 'down', reverseDirection: 'left' },
                { x: 5, y: 9, clockwiseDirection: 'up', reverseDirection: 'up' }
            ]
            /*A: [
             {x: 1, y: 3, clockwiseDirection: 'right', reverseDirection: 'right'},
             {x: 5, y: 3, clockwiseDirection: 'down', reverseDirection: 'left'},
             {x: 5, y: 4, clockwiseDirection: 'right', reverseDirection: 'up'},
             {x: 8, y: 4, clockwiseDirection: 'down', reverseDirection: 'left'},
             {x: 8, y: 6, clockwiseDirection: 'left', reverseDirection: 'up'},
             {x: 3, y: 6, clockwiseDirection: 'up', reverseDirection: 'right'},
             {x: 3, y: 5, clockwiseDirection: 'left', reverseDirection: 'down'},
             {x: 1, y: 5, clockwiseDirection: 'up', reverseDirection: 'right'},
             {x: 1, y: 4, clockwiseDirection: 'down', reverseDirection: 'down'}
             ],
             B: [
             {x: 5, y: 6, clockwiseDirection: 'up', reverseDirection: 'up'},
             {x: 5, y: 5, clockwiseDirection: 'right', reverseDirection: 'down'},
             {x: 8, y: 5, clockwiseDirection: 'down', reverseDirection: 'left'},
             {x: 8, y: 7, clockwiseDirection: 'left', reverseDirection: 'up'},
             {x: 5, y: 7, clockwiseDirection: 'down', reverseDirection: 'right'},
             {x: 5, y: 9, clockwiseDirection: 'right', reverseDirection: 'up'},
             {x: 6, y: 9, clockwiseDirection: 'down', reverseDirection: 'left'},
             {x: 6, y: 12, clockwiseDirection: 'left', reverseDirection: 'up'},
             {x: 5, y: 12, clockwiseDirection: 'down', reverseDirection: 'right'},
             {x: 5, y: 13, clockwiseDirection: 'left', reverseDirection: 'up'},
             {x: 2, y: 13, clockwiseDirection: 'up', reverseDirection: 'right'},
             {x: 2, y: 9, clockwiseDirection: 'right', reverseDirection: 'down'},
             {x: 4, y: 9, clockwiseDirection: 'left', reverseDirection: 'left'}
             ],
             C: [
             {x: 3, y: 8, clockwiseDirection: 'right', reverseDirection: 'right'},
             {x: 6, y: 8, clockwiseDirection: 'down', reverseDirection: 'left'},
             {x: 6, y: 10, clockwiseDirection: 'right', reverseDirection: 'up'},
             {x: 7, y: 10, clockwiseDirection: 'down', reverseDirection: 'left'},
             {x: 7, y: 12, clockwiseDirection: 'left', reverseDirection: 'up'},
             {x: 3, y: 12, clockwiseDirection: 'up', reverseDirection: 'right'},
             {x: 3, y: 9, clockwiseDirection: 'down', reverseDirection: 'down'}
             ]*/
        }
    }];

    /*var moveDirection2 = [
     {x: 0, y: 3, direction: 'right', destination: {x: 3, y: 3}},
     {x: 3, y: 3, direction: 'down', destination: {x: 3, y: 4}},
     {x: 3, y: 4, direction: 'right', destination: {x: 4, y: 4}},
     {x: 4, y: 4, direction: 'down', destination: {x: 4, y: 7}},
     {x: 4, y: 7, direction: 'right', destination: {x: 8, y: 7}},
     {x: 8, y: 7, direction: 'down', destination: {x: 8, y: 13}},
     {x: 8, y: 13, direction: 'left', destination: {x: 4, y: 13}},
     {x: 4, y: 13, direction: 'up', destination: {x: 4, y: 9}},
     {x: 4, y: 9, direction: 'left', destination: {x: 0, y: 9}},
     {x: 0, y: 9, direction: 'up', destination: {x: 0, y: 3}}
     ];
     var startPosition2 = {x: 0, y: 3, direction: 'left'};
     var currentMove2 = {x: 0, y: 3, direction: 'left'};*/

    var queue = [];
    function setup(charCage, activeWorld, indexCharInWorld) {
        var _setup = this;

        function setRouteDirection() {
            var routeInWorld = {};
            for (var i = 0; i < _routes.length; i++) {
                if (activeWorld.id == _routes[i].stageId) {
                    routeInWorld = _routes[i];
                    break;
                }
            };
            var jumlahRute = Object.keys(routeInWorld.path).length;
            var maxRandom = window.randomInt(0, jumlahRute - 1);
            var randomIndexRute = window.randomInt(0, jumlahRute - 1);

            var randomRute = Object.keys(routeInWorld.path)[randomIndexRute];
            var cwd = Boolean(window.randomInt(0, 1));

            _setup.moveDirection = routeInWorld.path[randomRute];
            _setup._isClockWiseDirection = cwd;
            setStartDirection(0);


            //switch (indexCharInWorld) {
            //    case 0:
            //        if (routeInWorld.stageId === 1) {
            //            _setup.moveDirection = routeInWorld.path.A;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(0);
            //        } else if (routeInWorld.stageId === 2) {
            //            _setup.moveDirection = routeInWorld.path.A;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(0);
            //        } else if (routeInWorld.stageId === 3) {
            //            _setup.moveDirection = routeInWorld.path.A;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(0);
            //        } else {
            //            _setup.moveDirection = routeInWorld.path.A;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(0);
            //        }
            //        break;
            //    case 1:
            //        if (routeInWorld.stageId === 1) {
            //            _setup.moveDirection = routeInWorld.path.B;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(0);
            //        } else if (routeInWorld.stageId === 2) {
            //            _setup.moveDirection = routeInWorld.path.B;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(1);
            //        } else if (routeInWorld.stageId === 3) {
            //            _setup.moveDirection = routeInWorld.path.B;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(3);
            //        } else {
            //            _setup.moveDirection = routeInWorld.path.B;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(2);
            //        }
            //        break;
            //    case 2:
            //        if (routeInWorld.stageId === 1) {
            //            _setup.moveDirection = routeInWorld.path.C;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(1);
            //        } else if (routeInWorld.stageId === 2) {
            //            _setup.moveDirection = routeInWorld.path.C;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(1);
            //        } else if (routeInWorld.stageId === 3) {
            //            _setup.moveDirection = routeInWorld.path.C;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(1);
            //        } else {
            //            _setup.moveDirection = routeInWorld.path.C;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(0);
            //        }
            //        break;
            //    case 3:
            //        if (routeInWorld.stageId === 1) {
            //            _setup.moveDirection = routeInWorld.path.D;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(0);
            //        } else if (routeInWorld.stageId === 2) {
            //            _setup.moveDirection = routeInWorld.path.D;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(0);
            //        } else if (routeInWorld.stageId === 3) {
            //            _setup.moveDirection = routeInWorld.path.D;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(0);
            //        } else {
            //            _setup.moveDirection = routeInWorld.path.D;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(2);
            //        }
            //        break;
            //    case 4:
            //        if (routeInWorld.stageId === 1) {
            //            _setup.moveDirection = routeInWorld.path.E;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(1);
            //        } else if (routeInWorld.stageId === 2) {
            //            _setup.moveDirection = routeInWorld.path.E;
            //            _setup._isClockWiseDirection = false;
            //            setStartDirection(2);
            //        } else if (routeInWorld.stageId === 3) {
            //            _setup.moveDirection = routeInWorld.path.A;
            //            _setup._isClockWiseDirection = false;
            //            setStartDirection(4);
            //        } else {
            //            _setup.moveDirection = routeInWorld.path.E;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(0);
            //        }
            //        break;
            //    case 5:
            //        if (routeInWorld.stageId === 1) {
            //            _setup.moveDirection = routeInWorld.path.F;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(0);
            //        } else if (routeInWorld.stageId === 2) {
            //            _setup.moveDirection = routeInWorld.path.F;
            //            _setup._isClockWiseDirection = false;
            //            setStartDirection(5);
            //        } else if (routeInWorld.stageId === 3) {
            //            _setup.moveDirection = routeInWorld.path.B;
            //            _setup._isClockWiseDirection = false;
            //            setStartDirection(4);
            //        } else {
            //            _setup.moveDirection = routeInWorld.path.A;
            //            _setup._isClockWiseDirection = false;
            //            setStartDirection(4);
            //        }
            //        break;
            //    case 6:
            //        if (routeInWorld.stageId === 1) {
            //            _setup.moveDirection = routeInWorld.path.A;
            //            _setup._isClockWiseDirection = false;
            //            setStartDirection(2);
            //        } else if (routeInWorld.stageId === 2) {
            //            _setup.moveDirection = routeInWorld.path.G;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(0);
            //        } else if (routeInWorld.stageId === 3) {
            //            _setup.moveDirection = routeInWorld.path.C;
            //            _setup._isClockWiseDirection = false;
            //            setStartDirection(2);
            //        } else {
            //            _setup.moveDirection = routeInWorld.path.B;
            //            _setup._isClockWiseDirection = false;
            //            setStartDirection(4);
            //        }
            //        break;
            //    case 7:
            //        if (routeInWorld.stageId === 1) {
            //            _setup.moveDirection = routeInWorld.path.C;
            //            _setup._isClockWiseDirection = false;
            //            setStartDirection(2);
            //        } else if (routeInWorld.stageId === 2) {
            //            _setup.moveDirection = routeInWorld.path.A;
            //            _setup._isClockWiseDirection = false;
            //            setStartDirection(2);
            //        } else if (routeInWorld.stageId === 3) {
            //            _setup.moveDirection = routeInWorld.path.A;
            //            _setup._isClockWiseDirection = false;
            //            setStartDirection(1);
            //        } else {
            //            _setup.moveDirection = routeInWorld.path.D;
            //            _setup._isClockWiseDirection = false;
            //            setStartDirection(3);
            //        }
            //        break;
            //    case 8:
            //        if (routeInWorld.stageId === 1) {
            //            _setup.moveDirection = routeInWorld.path.E;
            //            _setup._isClockWiseDirection = false;
            //            setStartDirection(2);
            //        } else if (routeInWorld.stageId === 2) {
            //            _setup.moveDirection = routeInWorld.path.C;
            //            _setup._isClockWiseDirection = false;
            //            setStartDirection(3);
            //        } else if (routeInWorld.stageId === 3) {
            //            _setup.moveDirection = routeInWorld.path.B;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(2);
            //        } else {
            //            _setup.moveDirection = routeInWorld.path.E;
            //            _setup._isClockWiseDirection = false;
            //            setStartDirection(1);
            //        }
            //        break;
            //    case 9:
            //        if (routeInWorld.stageId === 1) {
            //            _setup.moveDirection = routeInWorld.path.F;
            //            _setup._isClockWiseDirection = false;
            //            setStartDirection(3);
            //        } else if (routeInWorld.stageId === 2) {
            //            _setup.moveDirection = routeInWorld.path.F;
            //            _setup._isClockWiseDirection = false;
            //            setStartDirection(1);
            //        } else if (routeInWorld.stageId === 3) {
            //            _setup.moveDirection = routeInWorld.path.A;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(2);
            //        } else {
            //            _setup.moveDirection = routeInWorld.path.A;
            //            _setup._isClockWiseDirection = true;
            //            setStartDirection(2);
            //        }
            //        break;
            //};
        };

        function setStartDirection(number) {
            var tempPos = [],
                    randomNumber = 0;
            number = Math.floor(Math.random() * _setup.moveDirection.length);

            /*randomNumber = Math.floor(Math.random() * _setup.moveDirection.length);
            console.log(randomNumber);
            if (randomNumber === 0) {
                ++randomNumber;
            }
            if (randomNumber === _setup.moveDirection.length - 1) {
                --randomNumber;
            }*/
            //console.log(randomNumber, _setup.moveDirection.length);
            //tempPos = _setup.moveDirection[randomNumber];
            tempPos = _setup.moveDirection[number];
            //console.log(number);
            //console.log(_setup.moveDirection);
            //console.log(charCage.charName, tempPos);
            /*var searching = true;
            var counter = 1;
            do {
                var isExist = false;
                for (var i = 0; i < global.GameApp.reservedArea.length; i++) {
                    if (global.GameApp.reservedArea[i].x == tempPos.x && global.GameApp.reservedArea[i].y == tempPos.y) {
                        isExist = true;
                    }
                }

                if (isExist) {
                    number = i + counter;
                    if (number >= _setup.moveDirection.length) {
                        number = 0;
                        counter++;
                    }
                    tempPos = _setup.moveDirection[number];
                } else {
                    searching = false;
                }
            } while (searching);*/

            _setup._currentMove = tempPos;
            _setup._startPosition = tempPos;
            _setup._moveIndex = number;

            //console.log(charCage.charName, tempPos, _setup.moveDirection.length);

            _setup._char.position.x = _oneblock.w * _setup._startPosition.x;
            _setup._char.position.y = _oneblock.h * _setup._startPosition.y;

            global.GameApp.reservedArea.push(tempPos);

            _setup._char.moveDirection = _setup.moveDirection;
            _setup._char.startPosition = _setup._startPosition;
            _setup._char.moveIndex = number;
        };


        this.moveDirection = [];
        this.moveTicker = {};
        this._direction = '';
        this._currentMove = {};
        this._moveIndex = 0;
        this._char = charCage;
        this._activeWorld = activeWorld;
        this._index = indexCharInWorld;
        this._spineChar = this._char.getChildAt(0);
        this._startPosition = {};
        this._isClockWiseDirection = true;

        this.receivedEvent = false;
        this.bindEvent = function () {
            if (_setup.receivedEvent) {
                return;
            }
            var onWalkingCharClicked = function () {
                window.GameApp.ionicLoading.show();
                if (window.GameApp.isOpeningCharDetail) {
                    return;
                }
                window.GameApp.isOpeningCharDetail = true;
                //$w.GameApp.IslandEnviAnim.showDetailActiveChar(this.char.pcid);
                console.log(this);
                window.GameApp.ionicLoading.hide();
                window.GameApp.isOpeningCharDetail = false;
            };
            var spineChar = _setup._char.children[0];
            spineChar.interactive = true;
            spineChar.mousedown = onWalkingCharClicked;
            spineChar.touchstart = onWalkingCharClicked;

            //spineChar.on('mousedown', onWalkingCharClicked);
            //spineChar.on('touchstart', ç);
            _setup.receivedEvent = true;
        };


        //this._spineChar.autoUpdate = false;
        this.move = function () {
            var activeAnimName = '';
            function changeDirection() {
                //global.clearInterval(_setup.moveTicker);
                window.cancelAnimationFrame(_setup.moveTicker);

                function gotoDirection() {
                    var direction = (_setup._isClockWiseDirection) ? _setup._currentMove.clockwiseDirection : _setup._currentMove.reverseDirection;
                    //var localRect = _setup._spineChar.getLocalBounds();
                    var animName = 'Idle';
                    window.cancelAnimationFrame(_setup.moveTicker);

                    //_setup._spineChar.skeleton.setToSetupPose();
                    //_setup._spineChar.update(0.01666666666667);
                    //_setup._spineChar.position.set(-localRect.x, -localRect.y);

                    var isUpDown = false;
                    switch (direction) {
                        case 'right':
                            //console.log(_setup._char.charObj.name + ' ' + direction, ' right');
                            //_setup._spineChar.state.setAnimation(0, 'Move_Right', false);
                            animName = 'Move_Right';
                            break;
                        case 'left':
                            // _setup._spineChar.state.setAnimation(0, 'Move_Left', false);
                            //console.log(_setup._char.charObj.name + ' ' + direction, ' right');
                            animName = 'Move_Left';
                            break;
                        case 'up':
                            //_setup._spineChar.state.setAnimation(0, 'Move_Left', true);
                            isUpDown = true;
                            break;
                        case 'down':
                            //_setup._spineChar.state.setAnimation(0, 'Move_Right', true);
                            isUpDown = true;
                            break;
                    };

                    //-- jika jalan ke bawah atau keatas maka pilih muka char hadap kiri atau kanan
                    if (isUpDown) {
                        var pos1 = _setup._char.position.x;
                        var central = 1080 / 2;
                        if (pos1 > central) {
                            //_setup._spineChar.state.setAnimation(0, 'Move_Left', true);
                            // console.log(_setup._char.charObj.name + ' ' + direction, ' left');
                            animName = 'Move_Left';
                        } else {
                            //_setup._spineChar.state.setAnimation(0, 'Move_Right', true);
                            // console.log(_setup._char.charObj.name + ' ' + direction, ' right');
                            animName = 'Move_Left';
                        }

                        //if ((_setup._char.position.x + _setup._char.width) > (5 * _setup._char.width)) {
                        //    //_setup._spineChar.state.addAnimation(0, 'Move_Right', true, 0);
                        //    _setup._spineChar.state.setAnimation(0, 'Move_Right', true);
                        //} else {
                        //    // _setup._spineChar.state.addAnimation(0, 'Move_Left', true, 0);
                        //    _setup._spineChar.state.setAnimation(0, 'Move_Left', true);
                        //}
                    }


                    //-- cegah biar jangan berulang kali setup inisiasi animasinya
                    if (animName !== activeAnimName) {
                        _setup._spineChar.skeleton.setToSetupPose();
                        _setup._spineChar.state.setAnimation(0, animName, true);
                        activeAnimName = animName;
                    }


                    _setup._direction = direction;

                    //_setup.moveTicker = global.setInterval(moveToDirection, 200);
                    _setup.moveTicker = requestAnimationFrame(moveToDirection);
                };

                //-- play idle

                _setup._spineChar.skeleton.setToSetupPose();
                //_setup._spineChar.update(0.01666666666667);
                //var localRect = _setup._spineChar.getLocalBounds();
                // _setup._spineChar.position.set(-localRect.x, -localRect.y);

                //var a = new PIXI.spine.Spine(data);
                if (activeAnimName != 'Idle') {
                    _setup._spineChar.state.setAnimation(0, 'Idle', false);
                    activeAnimName = 'Idle';
                    var onAnimComplete = function (entry) {
                        //console.log(_setup._char.charObj.name + ' continue walk after idle');
                        window.cancelAnimationFrame(_setup.moveTicker);
                        gotoDirection();
                        //isWalking = true;
                    };
                    _setup._spineChar.state.addListener({ complete: onAnimComplete });
                }



            };

            function moveToDirection() {
                var destination = _setup._currentMove;
                var nextIndex = 0;

                var velocity = Math.random();

                //-- stop running walking process
                if (!isWalking) {
                    //return global.clearInterval(_setup.moveTicker);
                    return cancelAnimationFrame(_setup.moveTicker);
                }
                _setup.moveTicker = requestAnimationFrame(moveToDirection);
                queue.push(_setup.moveTicker);
                //console.log('running walking process');

                switch (_setup._direction) {
                    case 'right':
                        _setup._char.position.x += velocity;
                        break;
                    case 'left':
                        _setup._char.position.x -= velocity;
                        break;
                    case 'up':
                        _setup._char.position.y -= velocity;
                        break;
                    case 'down':
                        _setup._char.position.y += velocity;
                        break;
                };

                //-- setelah pergerakan posisi char cek tabrakan gak sama decor
                collisionDetection(_setup._char);

                if (_setup._isClockWiseDirection) {
                    nextIndex = _setup._moveIndex + 1;
                    if (nextIndex > _setup.moveDirection.length - 1) {
                        nextIndex--;
                    }
                } else {
                    nextIndex = _setup._moveIndex - 1;
                    if (nextIndex < 0) {
                        nextIndex++;
                    }
                }
                destination = _setup.moveDirection[nextIndex];

                var destinationX = destination.x * _oneblock.w,
                    destinationY = destination.y * _oneblock.h;

                function nextDirection() {
                    _setup._currentMove = destination;
                    _setup._moveIndex = nextIndex;
                    //cancelAnimationFrame(_setup.moveTicker);
                    if (_setup._moveIndex == _setup.moveDirection.length - 1) {
                        if (_setup._isClockWiseDirection === true) {
                            _setup._isClockWiseDirection = false;
                        } else {
                            _setup._isClockWiseDirection = true;
                        }
                    }
                    if (_setup._moveIndex == 0) {
                        if (_setup._isClockWiseDirection === true) {
                            _setup._isClockWiseDirection = false;
                        } else {
                            _setup._isClockWiseDirection = true;
                        }
                    }

                    //isWalking = false;
                    return changeDirection();
                };

                //-- if moving char already at destination
                if (destinationX === _setup._char.position.x && destinationY === _setup._char.position.y) {
                    return nextDirection();
                }

                if (_setup._direction == 'right'
                    && (_setup._char.position.x + _setup._char.width) > (destinationX + _oneblock.w)) {
                    //console.log(_setup._char.charObj.name + ' lost at right');
                    //cancelAnimationFrame(_setup.moveTicker);
                    return nextDirection();
                };
                if (_setup._direction == 'left'
                    && _setup._char.position.x < (destinationX + _oneblock.w)) {
                    //console.log(_setup._char.charObj.name + ' lost at left');
                    //cancelAnimationFrame(_setup.moveTicker);
                    return nextDirection();
                };
                if (_setup._direction == 'down'
                    && (_setup._char.position.y + _setup._char.height) > (destinationY + _oneblock.h)) {
                    //console.log(_setup._char.charObj.name + ' lost at down');
                    //cancelAnimationFrame(_setup.moveTicker);
                    return nextDirection();
                };
                if (_setup._direction == 'up'
                    && (_setup._char.position.y) < (destinationY)) {
                    //console.log(_setup._char.charObj.name + ' lost at up');
                    //cancelAnimationFrame(_setup.moveTicker);
                    return nextDirection();
                };

                // _setup.bindEvent();
            };

            function collisionDetection(monster) {
                // obj.displayGroup = window.GameApp.GameStage.displayOrder.frontLayer;
                var decorcon = window.GameApp.GameStage.decorContainer;
                //monster.displayGroup = window.GameApp.GameStage.displayOrder.middleLayer;
                for (var i = 0; i < decorcon.children.length; i++) {
                    var decor = decorcon.getChildAt(i);
                    var isCollision = window.GameApp.isCollision(monster, decor);

                    if (isCollision) {
                        var posdecor = (decor.position.x + decor.height);
                        var posmonster = (monster.position.x + monster.height);

                        // console.log(posdecor, posmonster);
                        if (posdecor < posmonster) {
                            decor.displayGroup = window.GameApp.GameStage.displayOrder.frontLayer;
                        }

                    }
                }


            };

            changeDirection();
        };

        //console.log(window.GameApp.GameStage.backgroundContainer.width);
        setRouteDirection();
        isWalking = true;
        // this.move();
    };

    global.GameApp.isCollision = function (r1, r2) {
        //Define the variables we'll need to calculate
        var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

        //hit will determine whether there's a collision
        hit = false;

        //Find the center points of each sprite
        r1.centerX = r1.x + r1.width / 2;
        r1.centerY = r1.y + r1.height / 2;
        r2.centerX = r2.x + r2.width / 2;
        r2.centerY = r2.y + r2.height / 2;

        //Find the half-widths and half-heights of each sprite
        r1.halfWidth = r1.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfWidth = r2.width / 2;
        r2.halfHeight = r2.height / 2;

        //Calculate the distance vector between the sprites
        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;

        //Figure out the combined half-widths and half-heights
        combinedHalfWidths = r1.halfWidth + r2.halfWidth;
        combinedHalfHeights = r1.halfHeight + r2.halfHeight;

        //Check for a collision on the x axis
        if (Math.abs(vx) < combinedHalfWidths) {

            //A collision might be occuring. Check for a collision on the y axis
            if (Math.abs(vy) < combinedHalfHeights) {

                //There's definitely a collision happening
                hit = true;
            } else {

                //There's no collision on the y axis
                hit = false;
            }
        } else {

            //There's no collision on the x axis
            hit = false;
        }

        //`hit` will be either `true` or `false`
        return hit;

    };
    global.GameApp.StopWalkingProcess = function () {
        isWalking = false;
        global.GameApp.currentWalking = null;

        $.each(queue, function (k, v) {
            cancelAnimationFrame(v);

            if (k + 1 == queue.length) {
                queue = [];
            }
        });
    };
    global.GameApp.ContinueWalking = isWalking;
    global.GameApp.Walking = setup;
    global.GameApp.reservedArea = []; //-- must be reset every open new envi/world
})(window);