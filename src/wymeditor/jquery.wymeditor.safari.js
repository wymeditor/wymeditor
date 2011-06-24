/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (c) 2005 - 2009 Jean-Francois Hovinne, http://www.wymeditor.org/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *        http://www.wymeditor.org/
 *
 * File Name:
 *        jquery.wymeditor.safari.js
 *        Safari specific class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne a-t wymeditor dotorg)
 *        Scott Lewis (lewiscot a-t gmail dotcom)
 */

WYMeditor.WymClassSafari = function(wym) {

    this._wym = wym;
    this._class = "class";
    this._newLine = "\n";
};

// Holds a top-level spot for inserting content
WYMeditor.WymClassSafari.PLACEHOLDER_NODE = '<br>';

WYMeditor.WymClassSafari.prototype.initIframe = function(iframe) {

    this._iframe = iframe;
    this._doc = iframe.contentDocument;

    //add css rules from options

    var styles = this._doc.styleSheets[0];
    var aCss = eval(this._options.editorStyles);

    this.addCssRules(this._doc, aCss);

    this._doc.title = this._wym._index;

    //set the text direction
    jQuery('html', this._doc).attr('dir', this._options.direction);

    //init designMode
    this._doc.designMode = "on";

    //init html value
    this.html(this._wym._html);

    //pre-bind functions
    if(jQuery.isFunction(this._options.preBind)) this._options.preBind(this);

    //bind external events
    this._wym.bindEvents();

    //bind editor keydown events
    jQuery(this._doc).bind("keydown", this.keydown);

    //bind editor keyup events
    jQuery(this._doc).bind("keyup", this.keyup);

    //post-init functions
    if(jQuery.isFunction(this._options.postInit)) this._options.postInit(this);

    //add event listeners to doc elements, e.g. images
    this.listen();
};

WYMeditor.WymClassSafari.prototype._exec = function(cmd,param) {

    if(!this.selected()) return(false);

    var focusNode = this.selected();

    switch(cmd) {

    case WYMeditor.INDENT: case WYMeditor.OUTDENT:

        var sel = this._iframe.contentWindow.getSelection();
        var anchorNode = sel.anchorNode;
        if(anchorNode.nodeName == "#text") anchorNode = anchorNode.parentNode;

        focusNode = this.findUp(focusNode, WYMeditor.BLOCKS);
        anchorNode = this.findUp(anchorNode, WYMeditor.BLOCKS);

        if(focusNode && focusNode == anchorNode &&
          focusNode.tagName.toLowerCase() == WYMeditor.LI) {

            var ancestor = focusNode.parentNode.parentNode;

            if(focusNode.parentNode.childNodes.length>1 ||
              ancestor.tagName.toLowerCase() == WYMeditor.OL ||
              ancestor.tagName.toLowerCase() == WYMeditor.UL)
                this._doc.execCommand(cmd,'',null);
        }

    break;

    case WYMeditor.INSERT_ORDEREDLIST: case WYMeditor.INSERT_UNORDEREDLIST:

        this._doc.execCommand(cmd,'',null);

        //Safari creates lists in e.g. paragraphs.
        //Find the container, and remove it.
        var container = this.findUp(focusNode, WYMeditor.MAIN_CONTAINERS);
        if(container) jQuery(container).replaceWith(jQuery(container).html());

    break;

    default:

        if(param) this._doc.execCommand(cmd,'',param);
        else this._doc.execCommand(cmd,'',null);

    break;
    }

    //set to P if parent = BODY
    container = this.selected();
    if(container && container.tagName.toLowerCase() == WYMeditor.BODY)
        this._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);

    return true;

};

/* @name selected
 * @description Returns the selected container
 */
WYMeditor.WymClassSafari.prototype.selected = function() {

    var sel = this._iframe.contentWindow.getSelection();
    var node = sel.focusNode;
    if (node) {
        if (node.nodeName == "#text") {
            return node.parentNode;
        } else {
            return node;
        }
    } else {
        return null;
    }
};

WYMeditor.WymClassSafari.prototype.addCssRule = function(styles, oCss) {

    styles.insertRule(oCss.name + " {" + oCss.css + "}",
        styles.cssRules.length);
};


//keydown handler, mainly used for keyboard shortcuts
WYMeditor.WymClassSafari.prototype.keydown = function(e) {
    //'this' is the doc
    var wym = WYMeditor.INSTANCES[this.title];

    if (e.ctrlKey) {
        if (e.keyCode == WYMeditor.KEY.B) {
            //CTRL+b => STRONG
            wym._exec(WYMeditor.BOLD);
            e.preventDefault();
        }
        if (e.keyCode == WYMeditor.KEY.I) {
          //CTRL+i => EMPHASIS
          wym._exec(WYMeditor.ITALIC);
          e.preventDefault();
        }
    } else if (e.shiftKey && e.keyCode == WYMeditor.KEY.ENTER) {
        // Safari 4 and earlier would show a proper linebreak in the editor and
        // then strip it upon save with the default action in the case of inserting
        // a new line after bold text
        wym._exec('InsertLineBreak');
        e.preventDefault();
    }
};

// Keyup handler, mainly used for cleanups
WYMeditor.WymClassSafari.prototype.keyup = function(evt) {
    //'this' is the doc
    var wym = WYMeditor.INSTANCES[this.title];

    wym._selected_image = null;
    var container = null;

    // Fix to allow shift + return to insert a line break in older safari
    if ($.browser.version < 534.1) {
        // Not needed in AT MAX chrome 6.0. Probably safe earlier
        if (evt.keyCode == WYMeditor.KEY.ENTER && evt.shiftKey) {
            wym._exec('InsertLineBreak');
        }
    }

    if (evt.keyCode != WYMeditor.KEY.BACKSPACE
        && evt.keyCode != WYMeditor.KEY.CTRL
        && evt.keyCode != WYMeditor.KEY.DELETE
        && evt.keyCode != WYMeditor.KEY.COMMAND
        && evt.keyCode != WYMeditor.KEY.UP
        && evt.keyCode != WYMeditor.KEY.DOWN
        && evt.keyCode != WYMeditor.KEY.LEFT
        && evt.keyCode != WYMeditor.KEY.RIGHT
        && evt.keyCode != WYMeditor.KEY.ENTER
        && !evt.metaKey
        && !evt.ctrlKey) {
        // Not BACKSPACE, DELETE, CTRL, or COMMAND key

        container = wym.selected();
        var name = container.tagName.toLowerCase();

        // Fix forbidden main containers
        if (name == "strong"
            || name == "b"
            || name == "em"
            || name == "i"
            || name == "sub"
            || name == "sup"
            || name == "a"
            || name == "span") {
            // Webkit also tries to use spans as a main container

            name = container.parentNode.tagName.toLowerCase();
        }

        if (name == WYMeditor.BODY || name == WYMeditor.DIV) {
            // Replace text nodes with <p> tags
            wym._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);
            wym.fixBodyHtml();
        }
    }

    // If we potentially created a new block level element or moved to a new one
    // then we should ensure that they're in the proper format
    if (evt.keyCode == WYMeditor.KEY.UP
        || evt.keyCode == WYMeditor.KEY.DOWN
        || evt.keyCode == WYMeditor.KEY.LEFT
        || evt.keyCode == WYMeditor.KEY.RIGHT
        || evt.keyCode == WYMeditor.KEY.BACKSPACE
        || evt.keyCode == WYMeditor.KEY.ENTER) {

        wym.fixBodyHtml();
    }
};

WYMeditor.WymClassSafari.prototype.openBlockTag = function(tag, attributes)
{
    attributes = this.validator.getValidTagAttributes(tag, attributes);

    // Handle Safari styled spans
    if (tag == 'span' && attributes.style) {
        var new_tag = this.getTagForStyle(attributes.style);
        if (new_tag) {
            tag = new_tag;
            this._tag_stack.pop();
            this._tag_stack.push(tag);
            attributes.style = '';

            // Should fix #125 - also removed the xhtml() override
            if(typeof attributes['class'] == 'string') {
                attributes['class'] = attributes['class'].replace(/apple-style-span/gi, '');
            }
        }
    }

    this.output += this.helper.tag(tag, attributes, true);
};

WYMeditor.WymClassSafari.prototype.getTagForStyle = function(style) {

  if(/bold/.test(style)) return 'strong';
  if(/italic/.test(style)) return 'em';
  if(/sub/.test(style)) return 'sub';
  if(/super/.test(style)) return 'sup';
  return false;
};
