WYMeditor.WymCssParser = function()
{
    this._in_style = false;
    this._has_title = false;
    this.only_wym_blocks = true;
    this.css_settings = {'classesItems':[], 'editorStyles':[], 'dialogStyles':[]};
    return this;
};

WYMeditor.WymCssParser.prototype.parse = function(raw, only_wym_blocks)
{
    only_wym_blocks = (typeof only_wym_blocks == 'undefined' ? this.only_wym_blocks : only_wym_blocks);
    this._Lexer = new WYMeditor.WymCssLexer(this, only_wym_blocks);
    this._Lexer.parse(raw);
};

WYMeditor.WymCssParser.prototype.Ignore = function(match, state)
{
    return true;
};

WYMeditor.WymCssParser.prototype.WymCssComment = function(text, status)
{
    if(text.match(/end[a-z0-9\s]*wym[a-z0-9\s]*/mi)){
        return false;
    }
    if(status == WYMeditor.LEXER_UNMATCHED){
        if(!this._in_style){
            this._has_title = true;
            this._current_item = {'title':WYMeditor.Helper.trim(text)};
        }else{
            if(this._current_item[this._current_element]){
                if(!this._current_item[this._current_element].expressions){
                    this._current_item[this._current_element].expressions = [text];
                }else{
                    this._current_item[this._current_element].expressions.push(text);
                }
            }
        }
        this._in_style = true;
    }
    return true;
};

WYMeditor.WymCssParser.prototype.WymCssStyle = function(match, status)
{
    if(status == WYMeditor.LEXER_UNMATCHED){
        match = WYMeditor.Helper.trim(match);
        if(match !== ''){
            this._current_item[this._current_element].style = match;
        }
    }else if (status == WYMeditor.LEXER_EXIT){
        this._in_style = false;
        this._has_title = false;
        this.addStyleSetting(this._current_item);
    }
    return true;
};

WYMeditor.WymCssParser.prototype.WymCssFeedbackStyle = function(match, status)
{
    if(status == WYMeditor.LEXER_UNMATCHED){
        this._current_item[this._current_element].feedback_style = match.replace(/^([\s\/\*]*)|([\s\/\*]*)$/gm,'');
    }
    return true;
};

WYMeditor.WymCssParser.prototype.WymCssStyleDeclaration = function(match)
{
    match = match.replace(/^([\s\.]*)|([\s\.*]*)$/gm, '');

    var tag = '';
    if(match.indexOf('.') > 0){
        var parts = match.split('.');
        this._current_element = parts[1];
        tag = parts[0];
    }else{
        this._current_element = match;
    }

    if(!this._has_title){
        this._current_item = {'title':(!tag?'':tag.toUpperCase()+': ')+this._current_element};
        this._has_title = true;
    }

    if(!this._current_item[this._current_element]){
        this._current_item[this._current_element] = {'name':this._current_element};
    }
    if(tag){
        if(!this._current_item[this._current_element].tags){
            this._current_item[this._current_element].tags = [tag];
        }else{
            this._current_item[this._current_element].tags.push(tag);
        }
    }
    return true;
};

WYMeditor.WymCssParser.prototype.addStyleSetting = function(style_details)
{
    for (var name in style_details){
        var details = style_details[name];
        if(typeof details == 'object' && name != 'title'){

    this.css_settings.classesItems.push({
        'name': WYMeditor.Helper.trim(details.name),
        'title': style_details.title,
        'expr' : WYMeditor.Helper.trim((details.expressions||details.tags).join(', '))
    });
    if(details.feedback_style){
        this.css_settings.editorStyles.push({
            'name': '.'+ WYMeditor.Helper.trim(details.name),
            'css': details.feedback_style
        });
    }
    if(details.style){
        this.css_settings.dialogStyles.push({
            'name': '.'+ WYMeditor.Helper.trim(details.name),
            'css': details.style
        });
    }
}
}
};


