"use strict";

if (
    jQuery.browser.name === "msie" &&
    jQuery.browser.versionNumber <= 8
   ) {
    // Keysim.js is our external keyboard event simulation module.
    // Keysim.js doesn't support this browser, yet.
    // https://github.com/wymeditor/wymeditor/issues/663
    window.skipKeyboardShortcutTests = true;
} else {
    window.Keysim = require("keysim");
    window.skipKeyboardShortcutTests = false;
}
