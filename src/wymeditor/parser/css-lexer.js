WYMeditor.WymCssLexer = function(parser, only_wym_blocks)
{
    only_wym_blocks = (typeof only_wym_blocks == 'undefined' ? true : only_wym_blocks);

    jQuery.extend(this, new WYMeditor.Lexer(parser, (only_wym_blocks?'Ignore':'WymCss')));

    this.mapHandler('WymCss', 'Ignore');

    if(only_wym_blocks === true){
        this.addEntryPattern("/\\\x2a[<\\s]*WYMeditor[>\\s]*\\\x2a/", 'Ignore', 'WymCss');
        this.addExitPattern("/\\\x2a[<\/\\s]*WYMeditor[>\\s]*\\\x2a/", 'WymCss');
    }

    this.addSpecialPattern("[\\sa-z1-6]*\\\x2e[a-z-_0-9]+", 'WymCss', 'WymCssStyleDeclaration');

    this.addEntryPattern("/\\\x2a", 'WymCss', 'WymCssComment');
    this.addExitPattern("\\\x2a/", 'WymCssComment');

    this.addEntryPattern("\x7b", 'WymCss', 'WymCssStyle');
    this.addExitPattern("\x7d", 'WymCssStyle');

    this.addEntryPattern("/\\\x2a", 'WymCssStyle', 'WymCssFeedbackStyle');
    this.addExitPattern("\\\x2a/", 'WymCssFeedbackStyle');

    return this;
};

