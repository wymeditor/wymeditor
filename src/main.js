require.config({
    paths: {
        'rangy-core': 'wymeditor/rangy/rangy-core',
        'rangy-selectionsaverestore':
            'wymeditor/rangy/rangy-selectionsaverestore',
        'wymeditor.core': 'wymeditor/core',
        'editor.base': 'wymeditor/editor/base',
        'editor.document-structure-manager':
            'wymeditor/editor/document-structure-manager',
        'editor.gecko': 'wymeditor/editor/gecko',
        'editor.trident-pre-7': 'wymeditor/editor/trident-pre-7',
        'editor.trident-7': 'wymeditor/editor/trident-7',
        'editor.webkit': 'wymeditor/editor/webkit',
        'parser.xml-helper': 'wymeditor/parser/xml-helper',
        'parser.xhtml-validator': 'wymeditor/parser/xhtml-validator',
        'parser.parallel-regex': 'wymeditor/parser/parallel-regex',
        'parser.state-stack': 'wymeditor/parser/state-stack',
        'parser.lexer': 'wymeditor/parser/lexer',
        'parser.xhtml-lexer': 'wymeditor/parser/xhtml-lexer',
        'parser.xhtml-parser': 'wymeditor/parser/xhtml-parser',
        'parser.xhtml-sax-listener': 'wymeditor/parser/xhtml-sax-listener'
    },
    shim: {
        // Rangy
        'rangy-core': {},
        'rangy-selectionsaverestore': {
            deps: ['rangy-core']
        },
        // Core
        'wymeditor.core': {
            deps: [
                'rangy-selectionsaverestore',
                'rangy-core'
            ]
        },
        // Editor
        'editor.base': {
            deps: ['wymeditor.core']
        },
        'editor.document-structure-manager': {
            deps: ['wymeditor.core']
        },
        'editor.gecko': {
            deps: ['editor.base']
        },
        'editor.trident-pre-7': {
            deps: ['editor.base']
        },
        'editor.trident-7': {
            deps: ['editor.base']
        },
        'editor.webkit': {
            deps: ['editor.base']
        },
        // Parser
        'parser.xml-helper': {
            deps: ['wymeditor.core']
        },
        'parser.parallel-regex': {
            deps: ['wymeditor.core']
        },
        'parser.state-stack': {
            deps: ['wymeditor.core']
        },
        'parser.xhtml-validator': {
            deps: ['wymeditor.core']
        },
        'parser.xhtml-sax-listener': {
            deps: ['parser.xml-helper']
        },
        'parser.lexer': {
            deps: [
                'parser.state-stack',
                'parser.parallel-regex'
            ]
        },
        'parser.xhtml-lexer': {
            deps: ['parser.lexer']
        },
        'parser.xhtml-parser': {
            deps: ['parser.xhtml-lexer']
        }
    }
});

define([
    'wymeditor.core',
    'editor.base',
    'editor.document-structure-manager',
    'editor.gecko',
    'editor.trident-pre-7',
    'editor.trident-7',
    'editor.webkit',
    'parser.xhtml-sax-listener',
    'parser.xhtml-parser',
    'parser.xml-helper',
    'parser.xhtml-validator'
], function () {
    'use strict';
    console.log('main.js WYM version: %s', WYMeditor.VERSION);
    return WYMeditor;
});
