/* jshint evil: true */
/* global -$ */
"use strict";

/* This file is the custom code for Trident 7 and newer. At the time of writing
 * this, it is only IE11.
 */

WYMeditor.WymClassTrident7 = function (wym) {
    this._wym = wym;
    this._class = "class";
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
        'keyup',
        'wrapWithContainer'
    ]
);
