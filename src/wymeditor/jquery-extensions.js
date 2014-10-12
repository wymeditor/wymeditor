/* jshint evil: true */
"use strict";

/*
 * In this file are jQuery extensions.
 */

jQuery.extend({
    /**
     * Return true if 'arr' array contains 'item', or false
     */
    arrayContains: function (arr, item) {
        var i;
        for (i = 0; i < arr.length; i += 1) {
            if (arr[i] === item) {
                return true;
            }
        }
        return false;
    },

    /**
     * Return 'item' object in 'arr' array, checking its 'name' property.
     * No such item returns null.
     */
    getFromArrayByName: function (arr, name) {
        var i, item;
        for (i = 0; i < arr.length; i += 1) {
            item = arr[i];
            if (item.name === name) {
                return item;
            }
        }
        return null;
    },

    /**
     * Replace all instances of 'old' by 'rep' in 'str' string.
     */
    replaceAllInStr: function (str, old, rep) {
        var rExp = new RegExp(old, "g");
        return str.replace(rExp, rep);
    }
});
