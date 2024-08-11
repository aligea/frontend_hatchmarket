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
                { x: 4, y: 10, clockwiseDirection: 'left', reverseDirection: 'up' },
                { x: 2.5, y: 10, clockwiseDirection: 'right', reverseDirection: 'right' }
            ],
            F: [
                    { x: 4, y: 8, clockwiseDirection: 'down', reverseDirection: 'down' },
                    { x: 4, y: 10, clockwiseDirection: 'left', reverseDirection: 'up' },
                    { x: 3, y: 10, clockwiseDirection: 'down', reverseDirection: 'right' },
                    { x: 3, y: 12, clockwiseDirection: 'up', reverseDirection: 'up' }
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
            ],
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

            switch (indexCharInWorld) {
                case 0:
                    if (routeInWorld.stageId == 1) {
                        _setup.moveDirection = routeInWorld.path.A;
                        _setup._isClockWiseDirection = true;
                    } else if (routeInWorld.stageId == 2) {
                        _setup.moveDirection = routeInWorld.path.A;
                        _setup._isClockWiseDirection = true;
                    } else if (routeInWorld.stageId == 3) {
                        _setup.moveDirection = routeInWorld.path.A;
                        _setup._isClockWiseDirection = true;
                    } else {
                        _setup.moveDirection = routeInWorld.path.A;
                        _setup._isClockWiseDirection = true;
                    }
                    break;
                case 1:
                    if (routeInWorld.stageId == 1) {
                        _setup.moveDirection = routeInWorld.path.B;
                        _setup._isClockWiseDirection = true;
                    } else if (routeInWorld.stageId == 2) {
                        _setup.moveDirection = routeInWorld.path.B;
                        _setup._isClockWiseDirection = true;
                    } else if (routeInWorld.stageId == 3) {
                        _setup.moveDirection = routeInWorld.path.B;
                        _setup._isClockWiseDirection = true;
                    } else {
                        _setup.moveDirection = routeInWorld.path.B;
                        _setup._isClockWiseDirection = true;
                    }
                    break;
                case 2:
                    if (routeInWorld.stageId == 1) {
                        _setup.moveDirection = routeInWorld.path.C;
                        _setup._isClockWiseDirection = true;
                    } else if (routeInWorld.stageId == 2) {
                        _setup.moveDirection = routeInWorld.path.C;
                        _setup._isClockWiseDirection = true;
                    } else if (routeInWorld.stageId == 3) {
                        _setup.moveDirection = routeInWorld.path.C;
                        _setup._isClockWiseDirection = true;
                    } else {
                        _setup.moveDirection = routeInWorld.path.C;
                        _setup._isClockWiseDirection = true;
                    }
                    break;
                case 3:
                    if (routeInWorld.stageId == 1) {
                        _setup.moveDirection = routeInWorld.path.D;
                        _setup._isClockWiseDirection = true;
                    } else if (routeInWorld.stageId == 2) {
                        _setup.moveDirection = routeInWorld.path.D;
                        _setup._isClockWiseDirection = true;
                    } else if (routeInWorld.stageId == 3) {
                        _setup.moveDirection = routeInWorld.path.D;
                        _setup._isClockWiseDirection = true;
                    } else {
                        _setup.moveDirection = routeInWorld.path.D;
                        _setup._isClockWiseDirection = true;
                    }
                    break;
                case 4:
                    if (routeInWorld.stageId == 1) {
                        _setup.moveDirection = routeInWorld.path.E;
                        _setup._isClockWiseDirection = true;
                    } else if (routeInWorld.stageId == 2) {
                        _setup.moveDirection = routeInWorld.path.E;
                        _setup._isClockWiseDirection = false;
                    } else if (routeInWorld.stageId == 3) {
                        _setup.moveDirection = routeInWorld.path.A;
                        _setup._isClockWiseDirection = false;
                    } else {
                        _setup.moveDirection = routeInWorld.path.E;
                        _setup._isClockWiseDirection = true;
                    }
                    break;
                case 5:
                    if (routeInWorld.stageId == 1) {
                        _setup.moveDirection = routeInWorld.path.F;
                        _setup._isClockWiseDirection = true;
                    } else if (routeInWorld.stageId == 2) {
                        _setup.moveDirection = routeInWorld.path.F;
                        _setup._isClockWiseDirection = false;
                    } else if (routeInWorld.stageId == 3) {
                        _setup.moveDirection = routeInWorld.path.B;
                        _setup._isClockWiseDirection = false;
                    } else {
                        _setup.moveDirection = routeInWorld.path.A;
                        _setup._isClockWiseDirection = false;
                    }
                    break;
                case 6:
                    if (routeInWorld.stageId == 1) {
                        _setup.moveDirection = routeInWorld.path.A;
                        _setup._isClockWiseDirection = false;
                    } else if (routeInWorld.stageId == 2) {
                        _setup.moveDirection = routeInWorld.path.G;
                        _setup._isClockWiseDirection = true;
                    } else if (routeInWorld.stageId == 3) {
                        _setup.moveDirection = routeInWorld.path.C;
                        _setup._isClockWiseDirection = false;
                    } else {
                        _setup.moveDirection = routeInWorld.path.B;
                        _setup._isClockWiseDirection = false;
                    }
                    break;
                case 7:
                    if (routeInWorld.stageId == 1) {
                        _setup.moveDirection = routeInWorld.path.C;
                        _setup._isClockWiseDirection = false;
                    } else if (routeInWorld.stageId == 2) {
                        _setup.moveDirection = routeInWorld.path.A;
                        _setup._isClockWiseDirection = false;
                    } else if (routeInWorld.stageId == 3) {
                        _setup.moveDirection = routeInWorld.path.A;
                        _setup._isClockWiseDirection = false;
                    } else {
                        _setup.moveDirection = routeInWorld.path.D;
                        _setup._isClockWiseDirection = false;
                    }
                    break;
                case 8:
                    if (routeInWorld.stageId == 1) {
                        _setup.moveDirection = routeInWorld.path.E;
                        _setup._isClockWiseDirection = false;
                    } else if (routeInWorld.stageId == 2) {
                        _setup.moveDirection = routeInWorld.path.C;
                        _setup._isClockWiseDirection = false;
                    } else if (routeInWorld.stageId == 3) {
                        _setup.moveDirection = routeInWorld.path.B;
                        _setup._isClockWiseDirection = true;
                    } else {
                        _setup.moveDirection = routeInWorld.path.E;
                        _setup._isClockWiseDirection = false;
                    }
                    break;
                case 9:
                    if (routeInWorld.stageId == 1) {
                        _setup.moveDirection = routeInWorld.path.F;
                        _setup._isClockWiseDirection = false;
                    } else if (routeInWorld.stageId == 2) {
                        _setup.moveDirection = routeInWorld.path.F;
                        _setup._isClockWiseDirection = false;
                    } else if (routeInWorld.stageId == 3) {
                        _setup.moveDirection = routeInWorld.path.A;
                        _setup._isClockWiseDirection = true;
                    } else {
                        _setup.moveDirection = routeInWorld.path.A;
                        _setup._isClockWiseDirection = true;
                    }
                    break;
            }

            setStartDirection();
        };

        function setStartDirection() {
            var tempPos = [],
                randomNumber = 0;

            randomNumber = Math.floor(Math.random() * _setup.moveDirection.length);
            //console.log(randomNumber);
            if (randomNumber == 0) {
                ++randomNumber;
            }
            if (randomNumber == _setup.moveDirection.length - 1) {
                --randomNumber;
            }
            //console.log(randomNumber, _setup.moveDirection.length);
            tempPos = _setup.moveDirection[randomNumber];
            //console.log(charCage.charName, tempPos );

            //var searching = true;
            //var counter = 1;
            //do {
            //    var isExist = false;
            //    for (var i = 0; i < global.GameApp.reservedArea.length; i++) {
            //        if (global.GameApp.reservedArea[i].x == tempPos.x && global.GameApp.reservedArea[i].y == tempPos.y) {
            //            isExist = true;
            //        }
            //    }

            //    if (isExist) {
            //        randomNumber = i + counter;
            //        if (randomNumber >= _setup.moveDirection.length) {
            //            randomNumber = 0;
            //            counter++;
            //        }
            //        tempPos = _setup.moveDirection[randomNumber];
            //    } else {
            //        searching = false;
            //    }
            //} while (searching);


            //-- fix bug posisi awal char
            var isExist = false;
            for (var i = 0; i < global.GameApp.reservedArea.length; i++) {
                if (global.GameApp.reservedArea[i].x == tempPos.x && global.GameApp.reservedArea[i].y == tempPos.y) {
                    isExist = true;
                }
            }
            var counter = 1;
            if (isExist) {
                randomNumber = i + counter;
                if (randomNumber >= _setup.moveDirection.length) {
                    randomNumber = 0;
                    counter++;
                }
                tempPos = _setup.moveDirection[randomNumber];
            } else {
                //searching = false;
            }

            _setup._currentMove = tempPos;
            _setup._startPosition = tempPos;
            _setup._moveIndex = randomNumber;

            //console.log(charCage.charName, tempPos, _setup.moveDirection.length);

            _setup._char.position.x = _oneblock.w * _setup._startPosition.x;
            _setup._char.position.y = _oneblock.h * _setup._startPosition.y;

            global.GameApp.reservedArea.push(tempPos);
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

        //this._spineChar.autoUpdate = false;
        this.move = function () {
            function changeDirection() {
                //global.clearInterval(_setup.moveTicker);
                window.cancelAnimationFrame(_setup.moveTicker);

                function gotoDirection() {
                    var direction = (_setup._isClockWiseDirection) ? _setup._currentMove.clockwiseDirection : _setup._currentMove.reverseDirection;
                    //var localRect = _setup._spineChar.getLocalBounds();

                    _setup._spineChar.skeleton.setToSetupPose();
                    //_setup._spineChar.update(0.01666666666667);
                    //_setup._spineChar.position.set(-localRect.x, -localRect.y);

                    var isUpDown = false;
                    switch (direction) {
                        case 'right':
                            _setup._spineChar.state.setAnimation(0, 'Move_Right', true);
                            break;
                        case 'left':
                            _setup._spineChar.state.setAnimation(0, 'Move_Left', true);
                            break;
                        case 'up':
                            _setup._spineChar.state.setAnimation(0, 'Move_Left', true);
                            isUpDown = true;
                            break;
                        case 'down':
                            _setup._spineChar.state.setAnimation(0, 'Move_Right', true);
                            isUpDown = true;
                            break;
                    };


                    if (isUpDown) {
                        if (_setup._char.position.x > (5 * _setup._char.width)) {
                            //_setup._spineChar.state.addAnimation(0, 'Move_Right', true, 0);
                            _setup._spineChar.state.setAnimation(0, 'Move_Right', true);
                        } else {
                            // _setup._spineChar.state.addAnimation(0, 'Move_Left', true, 0);
                            _setup._spineChar.state.setAnimation(0, 'Move_Left', true);
                        }
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
                var idleAnim = _setup._spineChar.state.setAnimation(0, 'Idle', true);

                //var a = new PIXI.spine.Spine(data);

                var durationIdle = idleAnim.endTime * 1000;
                console.log
                global.setTimeout(gotoDirection, durationIdle);

            };

            function moveToDirection() {
                var destination = _setup._currentMove;
                var nextIndex = 0;

                switch (_setup._direction) {
                    case 'right':
                        _setup._char.position.x += 0.5;
                        break;
                    case 'left':
                        _setup._char.position.x -= 0.5;
                        break;
                    case 'up':
                        _setup._char.position.y -= 0.5;
                        break;
                    case 'down':
                        _setup._char.position.y += 0.5;
                        break;
                };

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

                //-- if moving char already at destination
                if (destinationX === _setup._char.position.x && destinationY === _setup._char.position.y) {
                    _setup._currentMove = destination;
                    _setup._moveIndex = nextIndex;

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
                    return changeDirection();
                }


                //-- stop running walking process
                if (!isWalking) {
                    //return global.clearInterval(_setup.moveTicker);
                    return cancelAnimationFrame(_setup.moveTicker);
                }
                _setup.moveTicker = requestAnimationFrame(moveToDirection);
                queue.push(_setup.moveTicker);
                //console.log('running walking process');
            };


            changeDirection();
        };



        setRouteDirection();
        isWalking = true;
        // this.move();
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
    }
    global.GameApp.ContinueWalking = isWalking;
    global.GameApp.Walking = setup;
    global.GameApp.reservedArea = []; //-- must be reset every open new envi/world
})(window);