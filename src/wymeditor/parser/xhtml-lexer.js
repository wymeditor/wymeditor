/**
* This are the rules for breaking the XHTML code into events
* handled by the provided parser.
*
*    @author Marcus Baker (http://lastcraft.com)
*    @author Bermi Ferrer (http://bermi.org)
*/
WYMeditor.XhtmlLexer = function(parser) {
    jQuery.extend(this, new WYMeditor.Lexer(parser, 'Text'));

    this.mapHandler('Text', 'Text');

    this.addTokens();

    this.init();

    return this;
};


WYMeditor.XhtmlLexer.prototype.init = function() {
};

WYMeditor.XhtmlLexer.prototype.addTokens = function() {
    this.addCommentTokens('Text');
    this.addScriptTokens('Text');
    this.addCssTokens('Text');
    this.addTagTokens('Text');
};

WYMeditor.XhtmlLexer.prototype.addCommentTokens = function(scope) {
    this.addEntryPattern("<!--", scope, 'Comment');
    this.addExitPattern("-->", 'Comment');
};

WYMeditor.XhtmlLexer.prototype.addScriptTokens = function(scope) {
    this.addEntryPattern("<script", scope, 'Script');
    this.addExitPattern("</script>", 'Script');
};

WYMeditor.XhtmlLexer.prototype.addCssTokens = function(scope) {
    this.addEntryPattern("<style", scope, 'Css');
    this.addExitPattern("</style>", 'Css');
};

WYMeditor.XhtmlLexer.prototype.addTagTokens = function(scope) {
    this.addSpecialPattern("<\\s*[a-z0-9:\-]+\\s*/>", scope, 'SelfClosingTag');
    this.addSpecialPattern("<\\s*[a-z0-9:\-]+\\s*>", scope, 'OpeningTag');
    this.addEntryPattern("<[a-z0-9:\-]+"+'[\\\/ \\\>]+', scope, 'OpeningTag');
    this.addInTagDeclarationTokens('OpeningTag');

    this.addSpecialPattern("</\\s*[a-z0-9:\-]+\\s*>", scope, 'ClosingTag');

};

WYMeditor.XhtmlLexer.prototype.addInTagDeclarationTokens = function(scope) {
    this.addSpecialPattern('\\s+', scope, 'Ignore');

    this.addAttributeTokens(scope);

    this.addExitPattern('/>', scope);
    this.addExitPattern('>', scope);

};

WYMeditor.XhtmlLexer.prototype.addAttributeTokens = function(scope) {
    this.addSpecialPattern("\\s*[a-z-_0-9]*:?[a-z-_0-9]+\\s*(?=\=)\\s*", scope, 'TagAttributes');

    this.addEntryPattern('=\\s*"', scope, 'DoubleQuotedAttribute');
    this.addPattern("\\\\\"", 'DoubleQuotedAttribute');
    this.addExitPattern('"', 'DoubleQuotedAttribute');

    this.addEntryPattern("=\\s*'", scope, 'SingleQuotedAttribute');
    this.addPattern("\\\\'", 'SingleQuotedAttribute');
    this.addExitPattern("'", 'SingleQuotedAttribute');

    this.addSpecialPattern('=\\s*[^>\\s]*', scope, 'UnquotedAttribute');
};

