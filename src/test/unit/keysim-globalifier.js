"use strict";

if (
    jQuery.browser.name === "msie" &&
    jQuery.browser.versionNumber <= 8
   ) {
    // This browser does not properly implement
    // `Object.prototype.defineProperty`.
    // This is required by the external keyboard event simulation module,
    // `keysim`.
    window.skipKeyboardShortcutTests = true;
} else {
    window.Keysim = require("keysim");
    window.skipKeyboardShortcutTests = false;
}
