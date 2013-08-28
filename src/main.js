require.config({
    paths: {
        'jquery': 'jquery/jquery',
        'jquery.migrate': 'jquery/jquery-migrate.min.js',
        'jquery.rdfquery': 'jquery/jquery.rdfquery.rdfa.min-1.0.js',
        'jquery.ui': 'jquery/jquery-ui-1.8.11.custom.min.js',
        'wymeditor.core': 'wymeditor/core',
        'wymeditor.editor.document-structure-manager': 'wymeditor/editor/document-structure-manager',
        'wymeditor.editor.base': 'wymeditor/editor/base',
        'wymeditor.editor.firefox': 'wymeditor/editor/firefox',
        'wymeditor.editor.ie': 'wymeditor/editor/ie',
        'wymeditor.editor.opera': 'wymeditor/editor/opera',
        'wymeditor.editor.webkit': 'wymeditor/editor/webkit',
    },
    shim: {
        'jquery.migrate': {
            deps: ['jquery']
        },
        'jquery.rdfquery': {
            deps: ['jquery']
        },
        'jquery.ui': {
            deps: ['jquery']
        },
    }
});

require(['jquery'], function ($) {
    'use strict';
    console.log('Running jQuery %s', $().jquery);
});

