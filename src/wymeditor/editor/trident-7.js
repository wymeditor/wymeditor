/* jshint evil: true */
/* global -$ */
"use strict";

/* This file is the custom code for Trident 7 and newer. At the time of writing
 * this, it is only IE11.
 */

WYMeditor.WymClassTrident7 = function (wym) {
    var wymClassTrident7 =  this;
    wymClassTrident7._wym = wym;
    wymClassTrident7._class = "class";
};

jQuery.extend(
    WYMeditor.WymClassTrident7.prototype,
    WYMeditor.WymClassGecko.prototype
);

jQuery.copyPropsFromObjectToObject(
    WYMeditor.WymClassTridentPre7.prototype,
    WYMeditor.WymClassTrident7.prototype,
    [
        '_exec',
        '_keyup',
        '_wrapWithContainer'
    ]
);
