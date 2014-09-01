/* jshint evil: true */
"use strict";

/*
 * In this file are jQuery extensions.
 */

jQuery.extend({
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
    }
});
