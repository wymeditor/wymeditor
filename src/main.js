require.config({
    paths: {
        'jquery': 'jquery/jquery',
        'jquery.migrate': 'jquery/jquery-migrate.min',
        'jquery.rdfquery': 'jquery/jquery.rdfquery.rdfa.min-1.0',
        'jquery.ui': 'jquery/jquery-ui-1.8.11.custom.min',
        'rangy-core': 'wymeditor/rangy/rangy-core',
        'rangy-selectionsaverestore': 'wymeditor/rangy/rangy-selectionsaverestore',
        'wymeditor.core': 'wymeditor/core',
        'editor.base': 'wymeditor/editor/base',
        'editor.document-structure-manager': 'wymeditor/editor/document-structure-manager',
        'editor.firefox': 'wymeditor/editor/firefox',
        'editor.ie': 'wymeditor/editor/ie',
        'editor.opera': 'wymeditor/editor/opera',
        'editor.webkit': 'wymeditor/editor/webkit',
        'parser.xml-helper': 'wymeditor/parser/xml-helper',
        'parser.xhtml-validator': 'wymeditor/parser/xhtml-validator',
        'parser.parallel-regex': 'wymeditor/parser/parallel-regex',
        'parser.state-stack': 'wymeditor/parser/state-stack',
        'parser.lexer': 'wymeditor/parser/lexer',
        'parser.xhtml-lexer': 'wymeditor/parser/xhtml-lexer',
        'parser.xhtml-parser': 'wymeditor/parser/xhtml-parser',
        'parser.xhtml-sax-listener': 'wymeditor/parser/xhtml-sax-listener',
        'parser.css-lexer': 'wymeditor/parser/css-lexer',
        'parser.css-parser': 'wymeditor/parser/css-parser'
    },
    shim: {
        jquery: {
            exports: 'jQuery'
        },
        // Rangy
        'rangy-core': {},
        'rangy-selectionsaverestore': {
            deps: ['rangy-core']
        },
        // Core
        'wymeditor.core': {
            deps: [
                'jquery',
                'rangy-selectionsaverestore',
                'rangy-core'
            ]
        },
        // Editor
        'editor.base': {
            deps: ['jquery', 'wymeditor.core']
        },
        'editor.document-structure-manager': {
            deps: ['jquery', 'wymeditor.core']
        },
        'editor.firefox': {
            deps: ['jquery', 'editor.base']
        },
        'editor.ie': {
            deps: ['jquery', 'editor.base']
        },
        'editor.opera': {
            deps: ['jquery', 'editor.base']
        },
        'editor.webkit': {
            deps: ['jquery', 'editor.base']
        },
        // Parser
        'parser.xml-helper': {
            deps: ['wymeditor.core'],
        },
        'parser.parallel-regex': {
            deps: ['wymeditor.core'],
        },
        'parser.state-stack': {
            deps: ['wymeditor.core'],
        },
        'parser.xhtml-validator': {
            deps: ['wymeditor.core'],
        },
        'parser.xhtml-sax-listener': {
            deps: ['parser.xml-helper'],
        },
        'parser.lexer': {
            deps: [
                'parser.state-stack',
                'parser.parallel-regex'
            ],
        },
        'parser.xhtml-lexer': {
            deps: ['parser.lexer'],
        },
        'parser.css-lexer': {
            deps: ['parser.lexer'],
        },
        'parser.xhtml-parser': {
            deps: ['parser.xhtml-lexer'],
        },
        'parser.css-parser': {
            deps: [
                'parser.css-lexer'
            ],
        }
    }
});

define([
    'jquery',
    'wymeditor.core',
    'editor.base',
    'editor.document-structure-manager',
    'editor.firefox',
    'editor.ie',
    'editor.opera',
    'editor.webkit',
    'parser.xhtml-sax-listener',
    'parser.xhtml-parser',
    'parser.xml-helper',
    'parser.css-parser',
    'parser.xhtml-validator'
], function () {
    'use strict';
    console.log('main.js WYM version: %s', WYMeditor.VERSION);
    return WYMeditor;
});
