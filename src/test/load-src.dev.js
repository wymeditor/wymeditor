/**
    loadWymSrc
    ==========

    Load all of the required WYMeditor source files in parallel using the
    head.js library. Loads relative to the given path to the src/ directory.
*/
function loadWymSrc(srcPath) {
    head.js(
        srcPath + 'jquery/jquery.js',
        srcPath + 'wymeditor/rangy/rangy-core.js',
        srcPath + 'wymeditor/core.js',
        srcPath + 'wymeditor/editor/base.js',
        srcPath + 'wymeditor/editor/ie.js',
        srcPath + 'wymeditor/editor/firefox.js',
        srcPath + 'wymeditor/editor/opera.js',
        srcPath + 'wymeditor/editor/webkit.js',
        srcPath + 'wymeditor/parser/xml-helper.js',
        srcPath + 'wymeditor/parser/xhtml-validator.js',
        srcPath + 'wymeditor/parser/parallel-regex.js',
        srcPath + 'wymeditor/parser/state-stack.js',
        srcPath + 'wymeditor/parser/lexer.js',
        srcPath + 'wymeditor/parser/xhtml-lexer.js',
        srcPath + 'wymeditor/parser/xhtml-parser.js',
        srcPath + 'wymeditor/parser/xhtml-sax-listener.js',
        srcPath + 'wymeditor/parser/css-lexer.js',
        srcPath + 'wymeditor/parser/css-parser.js'
    );
}

