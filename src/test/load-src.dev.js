/* exported loadWymSrc */
/*jshint evil: true */
"use strict";

function versionToInt(major, minor, build) {
    major = major * 100 * 100;
    minor = minor * 100;

    return major + minor + build;
}

function parseVersionString(str) {
    var components = str.split('.'),
        major = parseInt(components[0], 10) || 0,
        minor = parseInt(components[1], 10) || 0,
        build = parseInt(components[2], 10) || 0;

    return versionToInt(major, minor, build);
}

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
            srcPath + 'wymeditor/rangy/rangy-core.js',
            srcPath + 'wymeditor/rangy/rangy-selectionsaverestore.js',
            srcPath + 'wymeditor/core.js',
            srcPath + 'wymeditor/editor/base.js',
            srcPath + 'wymeditor/editor/document-structure-manager.js',
            srcPath + 'wymeditor/editor/gecko.js',
            srcPath + 'wymeditor/editor/trident.js',
            srcPath + 'wymeditor/editor/webkit.js',
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
        jqueryMigrateRequirement = [],
        jqueryRequirement = [],
        requirements = [],
        i,
        jqVersionInt,
        jqMigrateMinInt,
        jqueryMigrateMin = {major: 1, minor: 8, build: 0};

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

    // Include jquery-migrate, if the jQuery version requires it
    jqVersionInt = parseVersionString(jqueryVersion);
    jqMigrateMinInt = versionToInt(
        jqueryMigrateMin.major,
        jqueryMigrateMin.minor,
        jqueryMigrateMin.build
    );
    if (jqVersionInt >= jqMigrateMinInt) {
        jqueryMigrateRequirement = [srcPath + 'jquery/jquery-migrate.min.js'];
    }

    requirements = requirements.concat(
        jqueryRequirement,
        jqueryMigrateRequirement,
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


