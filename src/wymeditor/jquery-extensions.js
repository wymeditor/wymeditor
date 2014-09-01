/* jshint evil: true, camelcase: false, maxlen: 100 */
"use strict";

/*
 * In this file are jQuery extensions.
 */

jQuery.extend({
    /**
     * Return 'item' position in 'arr' array, or -1.
     * This is similar but probably not identical to ES5
     * Array.prorotype.indexOf.
     * For example, there seems to be no handling of negative indices.
     */
    arrayIndexOf: function (arr, item) {
        var ret = -1, i;
        for (i = 0; i < arr.length; i += 1) {
            if (arr[i] === item) {
                ret = i;
                break;
            }
        }
        return ret;
    }
});
