/**
* XHTML Parser.
*
* This XHTML parser will trigger the events available on on
* current SaxListener
*
*    @author Bermi Ferrer (http://bermi.org)
*/
WYMeditor.XhtmlParser = function(Listener, mode) {
    mode = mode || 'Text';
    this._Lexer = new WYMeditor.XhtmlLexer(this);
    this._Listener = Listener;
    this._mode = mode;
    this._matches = [];
    this._last_match = '';
    this._current_match = '';

    return this;
};

WYMeditor.XhtmlParser.prototype.parse = function(raw) {
    this._Lexer.parse(this.beforeParsing(raw));
    return this.afterParsing(this._Listener.getResult());
};

WYMeditor.XhtmlParser.prototype.beforeParsing = function(raw) {
    if (raw.match(/class="MsoNormal"/) || raw.match(/ns = "urn:schemas-microsoft-com/)) {
        // Useful for cleaning up content pasted from other sources (MSWord)
        this._Listener.avoidStylingTagsAndAttributes();
    }

    return this._Listener.beforeParsing(raw);
};

WYMeditor.XhtmlParser.prototype.afterParsing = function(parsed) {
    if (this._Listener._avoiding_tags_implicitly) {
        this._Listener.allowStylingTagsAndAttributes();
    }
    return this._Listener.afterParsing(parsed);
};


WYMeditor.XhtmlParser.prototype.Ignore = function(match, state) {
    return true;
};

WYMeditor.XhtmlParser.prototype.Text = function(text) {
    this._Listener.addContent(text);
    return true;
};

WYMeditor.XhtmlParser.prototype.Comment = function(match, status) {
    return this._addNonTagBlock(match, status, 'addComment');
};

WYMeditor.XhtmlParser.prototype.Script = function(match, status) {
    return this._addNonTagBlock(match, status, 'addScript');
};

WYMeditor.XhtmlParser.prototype.Css = function(match, status) {
    return this._addNonTagBlock(match, status, 'addCss');
};

WYMeditor.XhtmlParser.prototype._addNonTagBlock = function(match, state, type) {
    switch (state) {
        case WYMeditor.LEXER_ENTER:
            this._non_tag = match;
            break;
        case WYMeditor.LEXER_UNMATCHED:
            this._non_tag += match;
            break;
        case WYMeditor.LEXER_EXIT:
            switch(type) {
                case 'addComment':
                    this._Listener.addComment(this._non_tag+match);
                    break;
                case 'addScript':
                    this._Listener.addScript(this._non_tag+match);
                    break;
                case 'addCss':
                    this._Listener.addCss(this._non_tag+match);
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return true;
};

WYMeditor.XhtmlParser.prototype.SelfClosingTag = function(match, state) {
    var result = this.OpeningTag(match, state);
    var tag = this.normalizeTag(match);
    return this.ClosingTag(match, state);
};

WYMeditor.XhtmlParser.prototype.OpeningTag = function(match, state) {
    switch (state){
        case WYMeditor.LEXER_ENTER:
            this._tag = this.normalizeTag(match);
            this._tag_attributes = {};
            break;
        case WYMeditor.LEXER_SPECIAL:
            this._callOpenTagListener(this.normalizeTag(match));
            break;
        case WYMeditor.LEXER_EXIT:
            this._callOpenTagListener(this._tag, this._tag_attributes);
            break;
        default:
            break;
    }
    return true;
};

WYMeditor.XhtmlParser.prototype.ClosingTag = function(match, state) {
    this._callCloseTagListener(this.normalizeTag(match));
    return true;
};

WYMeditor.XhtmlParser.prototype._callOpenTagListener = function(tag, attributes) {
    attributes = attributes || {};
    this.autoCloseUnclosedBeforeNewOpening(tag);

    if (this._Listener.isBlockTag(tag)) {
        this._Listener._tag_stack.push(tag);
        this._Listener.fixNestingBeforeOpeningBlockTag(tag, attributes);
        this._Listener.openBlockTag(tag, attributes);
        this._increaseOpenTagCounter(tag);
    } else if (this._Listener.isInlineTag(tag)) {
        this._Listener.inlineTag(tag, attributes);
    } else {
        this._Listener.openUnknownTag(tag, attributes);
        this._increaseOpenTagCounter(tag);
    }
    this._Listener.last_tag = tag;
    this._Listener.last_tag_opened = true;
    this._Listener.last_tag_attributes = attributes;
};

WYMeditor.XhtmlParser.prototype._callCloseTagListener = function(tag) {
    if (this._decreaseOpenTagCounter(tag)) {
        this.autoCloseUnclosedBeforeTagClosing(tag);

        if (this._Listener.isBlockTag(tag)) {
            var expected_tag = this._Listener._tag_stack.pop();
            if (expected_tag === false) {
                return;
            } else if (expected_tag !== tag) {
                // If we are expecting extra block closing tags, put the
                // expected tag back on the tag stack.
                if (this._Listener._extraBlockClosingTags) {
                    this._Listener._tag_stack.push(expected_tag);
                    this._Listener.removedExtraBlockClosingTag();
                    return;
                }

                tag = expected_tag;
            }
            this._Listener.closeBlockTag(tag);
        }
    } else {
        if(!this._Listener.isInlineTag(tag)) {
            this._Listener.closeUnopenedTag(tag);
        }
    }

    this._Listener.last_tag = tag;
    this._Listener.last_tag_opened = false;
};

WYMeditor.XhtmlParser.prototype._increaseOpenTagCounter = function(tag) {
    this._Listener._open_tags[tag] = this._Listener._open_tags[tag] || 0;
    this._Listener._open_tags[tag]++;
};

WYMeditor.XhtmlParser.prototype._decreaseOpenTagCounter = function(tag) {
    if (this._Listener._open_tags[tag]) {
        this._Listener._open_tags[tag]--;
        if (this._Listener._open_tags[tag] === 0) {
            this._Listener._open_tags[tag] = undefined;
        }
        return true;
    }
    return false;
};

WYMeditor.XhtmlParser.prototype.autoCloseUnclosedBeforeNewOpening = function(new_tag) {
    this._autoCloseUnclosed(new_tag, false);
};

WYMeditor.XhtmlParser.prototype.autoCloseUnclosedBeforeTagClosing = function(tag) {
    this._autoCloseUnclosed(tag, true);
};

WYMeditor.XhtmlParser.prototype._autoCloseUnclosed = function(new_tag, closing) {
    closing = closing || false;
    if (this._Listener._open_tags) {
        for (var tag in this._Listener._open_tags) {
            if (this._Listener.shouldCloseTagAutomatically(tag, new_tag, closing)) {
                this._callCloseTagListener(tag, true);
            }
        }
    }
};

WYMeditor.XhtmlParser.prototype.getTagReplacements = function() {
    return this._Listener.getTagReplacements();
};

WYMeditor.XhtmlParser.prototype.normalizeTag = function(tag) {
    tag = tag.replace(/^([\s<\/>]*)|([\s<\/>]*)$/gm,'').toLowerCase();
    var tags = this._Listener.getTagReplacements();
    if (tags[tag]) {
        return tags[tag];
    }
    return tag;
};

WYMeditor.XhtmlParser.prototype.TagAttributes = function(match, state) {
    if (WYMeditor.LEXER_SPECIAL == state) {
        this._current_attribute = match;
    }
    return true;
};

WYMeditor.XhtmlParser.prototype.DoubleQuotedAttribute = function(match, state) {
    if (WYMeditor.LEXER_UNMATCHED == state) {
        this._tag_attributes[this._current_attribute] = match;
    }
    return true;
};

WYMeditor.XhtmlParser.prototype.SingleQuotedAttribute = function(match, state) {
    if (WYMeditor.LEXER_UNMATCHED == state) {
        this._tag_attributes[this._current_attribute] = match;
    }
    return true;
};

WYMeditor.XhtmlParser.prototype.UnquotedAttribute = function(match, state) {
    this._tag_attributes[this._current_attribute] = match.replace(/^=/,'');
    return true;
};

