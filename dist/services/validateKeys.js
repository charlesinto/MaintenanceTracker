"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

//takes in 2 parameter the obj to validate its keys and the array of expected keys in the object

var validateKey = function validateKey(obj, keys) {
    //validate the obj and confirm its is an object
    if (typeof obj === "undefined" && typeof obj.length === "undefined") {
        return false;
    } else {
        var objetctKey = Object.keys(obj);
        if (objetctKey.length !== keys.length) {
            return false;
        } else {
            var same = void 0;
            for (var i = 0; i < keys.length; i++) {
                same = false;
                for (var j = 0; j < objetctKey.length; j++) {
                    if (keys[i] === objetctKey[j]) {
                        same = true;
                    }
                }
                if (!same) {
                    return false;
                }
            }
            if (same) {
                return true;
            } else {
                return false;
            }
        }
    }
};

exports.default = validateKey;