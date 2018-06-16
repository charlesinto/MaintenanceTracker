'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//expects the object and array of the object key, returns the object with white spaces removed
var trimSpace = function trimSpace(obj) {
    //performs valiation and ensure it is an object
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== undefined && obj !== '' && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj.length === undefined) {
        //Object.keys gets the key of the object in arrays and foreach loops through each property of the array
        Object.keys(obj).forEach(function (key) {
            obj[key] = obj[key].trim();
        });
        return obj;
    } else {
        return '';
    }
};

exports.default = trimSpace;