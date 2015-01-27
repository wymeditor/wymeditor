/* jshint evil: true */
"use strict";

WYMeditor.WymClassSafari = function (wym) {
    var wymClassSafari = this;
    wymClassSafari._wym = wym;
};

jQuery.extend(
    WYMeditor.WymClassSafari.prototype,
    WYMeditor.WymClassWebKit.prototype
);
