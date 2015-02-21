/* exported loadWymSrc */
/*jshint evil: true */
"use strict";

/**
    loadWymSrc
    ==========

    Load all of the required WYMeditor source files in parallel using the
    head.js library. Loads relative to the given path to the src/ directory.
*/
function loadWymSrc(srcPath, extraRequirements, jqueryVersion) {
    // Oldest supported version of jQuery is used by default
    var localJqueryVersion = "1.4.4",
        baseRequirements = [
            srcPath + '../../lib/es5-shim.js',
            srcPath + '../../lib/es5-sham.js',
            srcPath + 'wymeditor/rangy/rangy-core.js',
            srcPath + 'wymeditor/rangy/rangy-selectionsaverestore.js',
            srcPath + 'wymeditor/core.js',
            srcPath + 'wymeditor/editor/dialogs.js',
            srcPath + 'wymeditor/editor/base.js',
            srcPath + 'wymeditor/editor/document-structure-manager.js',
            srcPath + 'wymeditor/editor/gecko.js',
            srcPath + 'wymeditor/editor/trident-pre-7.js',
            srcPath + 'wymeditor/editor/trident-7.js',
            srcPath + 'wymeditor/editor/webkit.js',
            srcPath + 'wymeditor/editor/blink.js',
            srcPath + 'wymeditor/editor/safari.js',
            srcPath + 'lib/object-history.js',
            srcPath + 'lib/combokeys.js',
            srcPath + 'lib/edited.js',
            srcPath + 'wymeditor/editor/undo-redo.js',
            srcPath + 'wymeditor/editor/keyboard.js',
            srcPath + 'wymeditor/editor/native-edit-registration.js',
            srcPath + 'wymeditor/parser/xml-helper.js',
            srcPath + 'wymeditor/parser/xhtml-validator.js',
            srcPath + 'wymeditor/parser/parallel-regex.js',
            srcPath + 'wymeditor/parser/state-stack.js',
            srcPath + 'wymeditor/parser/lexer.js',
            srcPath + 'wymeditor/parser/xhtml-lexer.js',
            srcPath + 'wymeditor/parser/xhtml-parser.js',
            srcPath + 'wymeditor/parser/xhtml-sax-listener.js',
            srcPath + 'wymeditor/lang/en.js',
            srcPath + 'wymeditor/skins/default/skin.js'
        ],
        jqueryBrowserRequirement = [],
        jqueryRequirement = [],
        requirements = [],
        i;

    // Default to using local jquery
    if (typeof jqueryVersion  === 'undefined') {
        jqueryVersion = localJqueryVersion;
    }
    if (typeof extraRequirements === 'undefined') {
        extraRequirements = [];
    }

    if (jqueryVersion === localJqueryVersion) {
        jqueryRequirement = [srcPath + 'jquery/jquery.js'];
    } else {
        jqueryRequirement = [
            'https://ajax.googleapis.com/ajax/libs/jquery/' +
            jqueryVersion +
            '/jquery.min.js'
        ];
    }

    jqueryBrowserRequirement = [srcPath + 'lib/jquery.browser.js'];

    requirements = requirements.concat(
        jqueryRequirement,
        jqueryBrowserRequirement,
        baseRequirements,
        extraRequirements
    );
    for (i = 0; i < requirements.length; i++) {
        document.write(
            '<script type="text/javascript" src="' + requirements[i] + '">' +
                '<\/script>'
        );
    }
}


