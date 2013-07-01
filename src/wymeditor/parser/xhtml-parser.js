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

    // These are used for removing blocks flagged for removal by the parser
    this._removeBlock = false;
    this._removeSelfClosing = false;
    this._tagIndexInStack = 0;
    this._tagIndexInOutput = 0;

    return this;
};

WYMeditor.XhtmlParser.prototype.parse = function(raw) {
    this._Lexer.parse(this.beforeParsing(raw));
    return this.afterParsing(this._Listener.getResult());
};

WYMeditor.XhtmlParser.prototype.beforeParsing = function(raw) {
    if (raw.match(/class="MsoNormal"/) || raw.match(/ns = "urn:schemas-microsoft-com/)) {
        // Usefull for cleaning up content pasted from other sources (MSWord)
        this._Listener.avoidStylingTagsAndAttributes();
    }

    // Reset variables used for removing blocks
    this._removeBlock = false;
    this._removeSelfClosing = false;
    this._tagIndexInStack = 0;
    this._tagIndexInOutput = 0;

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
    var classes,
        isInlineTag = this._Listener.isInlineTag(tag);

    attributes = attributes || {};
    this.autoCloseUnclosedBeforeNewOpening(tag);

    // If the tag is flagged as editor-only, mark its position in the tag stack
    // and the output so it can be removed once the parser reaches its closing
    // tag.
    if (attributes["class"]) {
        classes = attributes["class"].split(" ");
        if (jQuery.inArray(WYMeditor.EDITOR_ONLY_CLASS, classes) > -1) {
            if (!this._removeBlock && !isInlineTag) {
                this._removeBlock = true;
                this._tagIndexInStack = this._Listener._tag_stack.length;
                this._tagIndexInOutput = this._Listener.output.length;
            }

            // If the tag is a self-closing tag, have the parser remove it
            // before moving to the next tag.
            if (isInlineTag) {
                this._removeSelfClosing = true;
            }
        }
    }

    if (this._Listener.isBlockTag(tag)) {
        this._Listener._tag_stack.push(tag);
        this._Listener.fixNestingBeforeOpeningBlockTag(tag, attributes);
        this._Listener.openBlockTag(tag, attributes);
        this._increaseOpenTagCounter(tag);
    } else if (isInlineTag) {
        if (!this._removeSelfClosing) {
            this._Listener.inlineTag(tag, attributes);
        } else {
            // Reset _removeSelfClosing to false after avoiding adding the
            // self-closing tag to the output.
            this._removeSelfClosing = false;
        }
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
            } else if (expected_tag != tag) {
                tag = expected_tag;
            }
            this._Listener.closeBlockTag(tag);
        }
    } else {
        if(!this._Listener.isInlineTag(tag)) {
            this._Listener.closeUnopenedTag(tag);
        }
    }

    // If the parser has reached the closing tag of an element that was flagged
    // for removal, remove the element from the Listener output.
    if (this._removeBlock &&
        this._Listener._tag_stack.length === this._tagIndexInStack) {

        this._Listener.output = this._Listener.output.slice(0,
                                                    this._tagIndexInOutput);
        this._removeBlock = false;
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
            var counter = this._Listener._open_tags[tag];
            if (counter > 0 && this._Listener.shouldCloseTagAutomatically(tag, new_tag, closing)) {
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

