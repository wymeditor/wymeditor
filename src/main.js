require.config({
    paths: {
        'rangy-core': 'wymeditor/rangy/rangy-core',
        'rangy-selectionsaverestore':
            'wymeditor/rangy/rangy-selectionsaverestore',
        'wymeditor.core': 'wymeditor/core',
        'editor.editor._init': 'wymeditor/editor/editor.init',
        'editor.editor': 'wymeditor/editor/editor',
        'editor.document-structure-manager':
            'wymeditor/editor/document-structure-manager',
        'editor.quirks.gecko': 'wymeditor/editor/quirks/gecko',
        'editor.quirks.trident-pre-7': 'wymeditor/editor/quirks/trident-pre-7',
        'editor.quirks.trident-7': 'wymeditor/editor/quirks/trident-7',
        'editor.quirks.webkit': 'wymeditor/editor/quirks/webkit',
        'editor.quirks.applyQuirks': 'wymeditor/editor/quirks/applyQuirks',
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
        'editor.document-structure-manager': {
            deps: ['wymeditor.core']
        },
        // Editor initializer
        'editor.init': {
            deps: ['wymeditor.core']
        },
        // Editor
        'editor.editor': {
            deps: ['wymeditor.init']
        },
        'editor.quirks.gecko': {
            deps: ['editor.editor']
        },
        'editor.quirks.trident-pre-7': {
            deps: ['editor.editor']
        },
        'editor.quirks.trident-7': {
            deps: ['editor.editor']
        },
        'editor.quirks.webkit': {
            deps: ['editor.editor']
        },
        'editor.quirks.applyQuirks': {
            deps: [
                'editor.quirks.gecko',
                'editor.quirks.trident-pre-7',
                'editor.quirks.trident-7',
                'editor.quirks.webkit'
            ]
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
    'editor.editor',
    'editor.editor.init',
    'editor.document-structure-manager',
    'editor.quirks.gecko',
    'editor.quirks.trident-pre-7',
    'editor.quirks.trident-7',
    'editor.quirks.webkit',
    'editor.quirks.applyQuirks',
    'parser.xhtml-sax-listener',
    'parser.xhtml-parser',
    'parser.xml-helper',
    'parser.xhtml-validator'
], function () {
    'use strict';
    console.log('main.js WYM version: %s', WYMeditor.VERSION);
    return WYMeditor;
});
