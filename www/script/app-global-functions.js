(function MergeObject(window) {
    /**
     * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
     * @param obj1
     * @param obj2
     * @returns obj3 a new object based on obj1 and obj2
     */
    function merge_options(obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
        return obj3;
    }


    window.mergeObjects = merge_options;
})(window);

(function GlobalFunctions($w) {
    'use strict';
    /**
    * Load / fetch localstorage
    * @param object name
    * @returns object service 
    */
    function izyObject(name) {
        var objectRoot = (globalVar.appName) ? globalVar.appName : 'db_';
        var setObjectName = function (name) {
            _objectName = objectRoot + '_' + name + '_';
            return _objectName;
        }
        var _objectName = setObjectName(name);

        return {
            objectName: function (name) {
                _objectName = objectRoot + '_' + name + '_';
                return _objectName;
            },
            getAll: function () {
                var objectData = [];
                for (var key in localStorage) {
                    if (key.indexOf(_objectName) == 0) {
                        objectData.push(JSON.parse(localStorage[key]));
                    }
                }
                //console.dir(objectData);
                return objectData;
            },
            get: function (objectId) {
                var i = objectId;
                if (localStorage[_objectName + i]) {
                    return JSON.parse(localStorage[_objectName + i]);
                }
            },
            getOne: function () {
                var obj = this.getAll();
                return (obj.length > 0) ? obj[0] : {};
            },
            delete: function (objectId) {
                localStorage.removeItem(_objectName + objectId);
            },
            store: function (obj) {
                if (!obj.hasOwnProperty('id')) {
                    var objectData = this.getAll();
                    var highest = 0;
                    for (var i = 0; i < objectData.length; i++) {
                        if (objectData[i].id > highest) {
                            highest = objectData[i].id;
                        }
                    }
                    obj.id = ++highest;
                }

                localStorage[_objectName + obj.id] = JSON.stringify(obj);
                return obj;
            },
            reset: function () {
                var objectData = this.getAll();
                for (var idx in objectData) {
                    var obj = objectData[idx];
                    this.delete(obj.id);
                }
            },
            findOne: function (field, value) {
                var objectData = this.getAll();
                var result;
                for (var index in objectData) {
                    var obj = objectData[index];
                    for (var propertyObj in obj) {
                        if (propertyObj == field) {
                            if (value == obj[propertyObj]) {
                                return obj;
                            }
                        }
                    }
                }
                return result;
            },
            storeAll: function (objectArray) {
                for (var index in objectArray) {
                    this.store(objectArray[index]);
                }
            }
        };
    };

    function clone(obj) {
        var copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    };

    function compare(a, b) {
        if (Number(a.id) < Number(b.id)) return -1;
        if (Number(a.id) > Number(b.id)) return 1;
        return 0;
    };

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false);
    };

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    $w.getQueryVariable = getQueryVariable;

    $w.globalVar = {
        appName: 'GamesApp',
        baseUrl: 'http://10multi.id/hatchmarket',
    };


    $w.randomInt = randomInt;
    $w.izyObject = izyObject;
    $w.clone = clone;
    $w.sortById = compare;
})(window);


(function (window) {
    "use strict";

    var p = window.Array.prototype;

    p.mergeSort = mergeSort;
    p.bubbleSort = bubbleSort;
    p.shuffle = shuffle;
    p.swap = swap;

    function shuffle() {
        var o = this;
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    function swap(a, b) {
        var o = this;
        var temp = o[a];
        o[a] = o[b];
        o[b] = temp;
        return o;
    }

    function bubbleSort(compare) {
        var a = this;
        var swapped;
        do {
            swapped = false;
            for (var i = 0; i < a.length - 1; i++) {
                if (compare(a[i], a[i + 1]) > 0) {
                    var temp = a[i];
                    a[i] = a[i + 1];
                    a[i + 1] = temp;
                    swapped = true;
                }
            }
        } while (swapped);
    }

    function mergeSort(compare) {
        var items = this;

        if (items.length < 2) {
            return items;
        }

        var middle = Math.floor(items.length / 2),
          left = items.slice(0, middle),
          right = items.slice(middle),
          params = merge(left.mergeSort(compare), right.mergeSort(compare), compare);

        // Add the arguments to replace everything between 0 and last item in the array
        params.unshift(0, items.length);
        items.splice.apply(items, params);
        return items;
    }

    function merge(left, right, compare) {
        var result = [],
          il = 0,
          ir = 0;

        while (il < left.length && ir < right.length) {
            if (compare(left[il], right[ir]) < 0) {
                result.push(left[il++]);
            } else {
                result.push(right[ir++]);
            }
        }

        return result.concat(left.slice(il)).concat(right.slice(ir));
    }
    //window.Array.prototype = p;
})(window);
