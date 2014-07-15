/* jshint evil: true */
/* global -$ */
"use strict";

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
    []
);
