/* jshint evil: true */
/* global -$ */
"use strict";

// This file contains the quirks for Trident 7.

WYMeditor._quirks._trident7 = {};

// Based on Gecko
jQuery.extend(
    true,
    WYMeditor._quirks._trident7,
    WYMeditor._quirks._gecko
);

// A few behaviors taken from pre-7 Trident
jQuery.copyPropsFromObjectToObject(
    WYMeditor._quirks._tridentPre7.editor,
    WYMeditor._quirks._trident7.editor,
    [
        '_exec',
        'keyup',
        'wrapWithContainer'
    ]
);
