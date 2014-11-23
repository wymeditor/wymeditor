"use strict";
window.noObjectDefinePropertyBrowser = jQuery.browser.msie &&
        jQuery.browser.versionNumber <= 8 ? true : false;

if (window.noObjectDefinePropertyBrowser !== true) {
    window.Keysim = require("keysim");
}
