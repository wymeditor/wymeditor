/* jshint evil: true */
"use strict";

WYMeditor.WymClassBlink = function (wym) {
    var wymClassBlink = this;
    wymClassBlink._wym = wym;
};

jQuery.extend(
    WYMeditor.WymClassBlink.prototype,
    WYMeditor.WymClassWebKit.prototype
);
