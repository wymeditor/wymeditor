/* jshint evil: true */
"use strict";

/*
 * In this file are jQuery extensions.
 */

jQuery.extend({
    /**
     * Replace all instances of 'old' by 'rep' in 'str' string.
     */
    replaceAllInStr: function (str, old, rep) {
        var rExp = new RegExp(old, "g");
        return str.replace(rExp, rep);
    }
});
