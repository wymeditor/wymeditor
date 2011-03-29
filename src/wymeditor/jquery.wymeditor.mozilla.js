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
 *        jquery.wymeditor.mozilla.js
 *        Gecko specific class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne a-t wymeditor dotorg)
 *        Volker Mische (vmx a-t gmx dotde)
 *        Bermi Ferrer (wymeditor a-t bermi dotorg)
 *        Frédéric Palluel-Lafleur (fpalluel a-t gmail dotcom)
 *        Jonatan Lundin (jonatan.lundin a-t gmail dotcom)
 */

WYMeditor.WymClassMozilla = function(wym) {

    this._wym = wym;
    this._class = "class";
    this._newLine = "\n";
};

// Placeholder cell to allow content in TD cells for FF 3.5+
WYMeditor.WymClassMozilla.CELL_PLACEHOLDER = '<br _moz_dirty="">';

// Firefox 3.5 and 3.6 require the CELL_PLACEHOLDER and 4.0 doesn't
WYMeditor.WymClassMozilla.NEEDS_CELL_FIX = $.browser.version >= '1.9.1'
    && $.browser.version < '2.0';

WYMeditor.WymClassMozilla.prototype.initIframe = function(iframe) {
    var wym = this;

    this._iframe = iframe;
    this._doc = iframe.contentDocument;

    //add css rules from options
    var styles = this._doc.styleSheets[0];

    var aCss = eval(this._options.editorStyles);

    this.addCssRules(this._doc, aCss);

    this._doc.title = this._wym._index;

    //set the text direction
    jQuery('html', this._doc).attr('dir', this._options.direction);

    //init html value
    this.html(this._wym._html);

    //init designMode
    this.enableDesignMode();

    //pre-bind functions
    if(jQuery.isFunction(this._options.preBind)) this._options.preBind(this);

    //bind external events
    this._wym.bindEvents();

    //bind editor keydown events
    jQuery(this._doc).bind("keydown", this.keydown);

    //bind editor keyup events
    jQuery(this._doc).bind("keyup", this.keyup);

    //bind editor click events
    jQuery(this._doc).bind("click", this.click);

    //bind editor focus events (used to reset designmode - Gecko bug)
    jQuery(this._doc).bind("focus", function () {
        // Fix scope
        wym.enableDesignMode.call(wym);
    });

    //post-init functions
    if(jQuery.isFunction(this._options.postInit)) this._options.postInit(this);

    //add event listeners to doc elements, e.g. images
    this.listen();
};

/* @name html
 * @description Get/Set the html value
 */
WYMeditor.WymClassMozilla.prototype.html = function(html) {

    if(typeof html === 'string') {
        //disable designMode
        try { this._doc.designMode = "off"; } catch(e) {
            //do nothing
        }

        //replace em by i and strong by bold
        //(designMode issue)
        html = html.replace(/<em(\b[^>]*)>/gi, "<i$1>");
        html = html.replace(/<\/em>/gi, "</i>");
        html = html.replace(/<strong(\b[^>]*)>/gi, "<b$1>");
        html = html.replace(/<\/strong>/gi, "</b>");

        //update the html body
        jQuery(this._doc.body).html(html);

        //re-init designMode
        this.enableDesignMode();
    }
    else {
        return jQuery(this._doc.body).html();
    }
    return false;
};

WYMeditor.WymClassMozilla.prototype._exec = function(cmd,param) {

    if(!this.selected()) {
        return false;
    }

    switch(cmd) {

    case WYMeditor.INDENT: case WYMeditor.OUTDENT:

        var focusNode = this.selected();
        var sel = this._iframe.contentWindow.getSelection();
        var anchorNode = sel.anchorNode;
        if (anchorNode.nodeName == "#text") {
            anchorNode = anchorNode.parentNode;
        }

        focusNode = this.findUp(focusNode, WYMeditor.BLOCKS);
        anchorNode = this.findUp(anchorNode, WYMeditor.BLOCKS);

        if (focusNode && focusNode == anchorNode
            && focusNode.tagName.toLowerCase() == WYMeditor.LI) {

            var ancestor = focusNode.parentNode.parentNode;

            if (focusNode.parentNode.childNodes.length > 1
                || ancestor.tagName.toLowerCase() == WYMeditor.OL
                || ancestor.tagName.toLowerCase() == WYMeditor.UL) {

                this._doc.execCommand(cmd, '', null);
            }
        }

        break;

    default:

        if (param) {
            this._doc.execCommand(cmd, '', param);
        } else {
            this._doc.execCommand(cmd, '', null);
        }
        break;
    }

    //set to P if parent = BODY
    var container = this.selected();
    if (container.tagName.toLowerCase() == WYMeditor.BODY) {
        this._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);
    }

    return true;
};

/* @name selected
    * @description Returns the selected container
    */
WYMeditor.WymClassMozilla.prototype.selected = function() {

    var sel = this._iframe.contentWindow.getSelection();
    var node = sel.focusNode;
    if (node) {
        if(node.nodeName == "#text") {
            return(node.parentNode);
        } else {
            return node;
        }
    } else {
        return null;
    }
};

WYMeditor.WymClassMozilla.prototype.addCssRule = function(styles, oCss) {

    styles.insertRule(oCss.name + " {" + oCss.css + "}",
        styles.cssRules.length);
};


//keydown handler, mainly used for keyboard shortcuts
WYMeditor.WymClassMozilla.prototype.keydown = function(evt) {

    //'this' is the doc
    var wym = WYMeditor.INSTANCES[this.title];
    var container = null;

    if (evt.ctrlKey) {
        if (evt.keyCode == 66) {
            //CTRL+b => STRONG
            wym._exec(WYMeditor.BOLD);
            return false;
        }
        if (evt.keyCode == 73) {
            //CTRL+i => EMPHASIS
            wym._exec(WYMeditor.ITALIC);
            return false;
        }
    }

    else if (evt.keyCode == 13) {
        if (!evt.shiftKey) {
            //fix PRE bug #73
            container = wym.selected();
            if (container && container.tagName.toLowerCase() == WYMeditor.PRE) {
                evt.preventDefault();
                wym.insert('<p></p>');
            }
        }
    }

    return true;
};

//keyup handler, mainly used for cleanups
WYMeditor.WymClassMozilla.prototype.keyup = function(evt) {

    //'this' is the doc
    var wym = WYMeditor.INSTANCES[this.title];

    wym._selected_image = null;
    var container = null;

    if (evt.keyCode == 13 && !evt.shiftKey) {
        //RETURN key
        //cleanup <br><br> between paragraphs
        jQuery(wym._doc.body).children(WYMeditor.BR).remove();
    }

    if (evt.keyCode != 8 && evt.keyCode != 17 && evt.keyCode != 46
        && evt.keyCode != 224 && !evt.metaKey && !evt.ctrlKey) {

        //NOT BACKSPACE, NOT DELETE, NOT CTRL, NOT COMMAND
        //text nodes replaced by P

        container = wym.selected();
        var name = container.tagName.toLowerCase();

        //fix forbidden main containers
        if (name == "strong" ||
            name == "b" ||
            name == "em" ||
            name == "i" ||
            name == "sub" ||
            name == "sup" ||
            name == "a" ) {

            name = container.parentNode.tagName.toLowerCase();
        }

        if (name == WYMeditor.BODY) {
            wym._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);
        }
    }
};

WYMeditor.WymClassMozilla.prototype.click = function(evt) {

    var wym = WYMeditor.INSTANCES[this.title];
    var container = wym.selected();

    if (WYMeditor.WymClassMozilla.NEEDS_CELL_FIX === true) {
        if (container && container.tagName.toLowerCase() == WYMeditor.TR) {
            // Starting with FF 3.6, inserted tables need some content in their
            // cells before they're editable
            jQuery(WYMeditor.TD, wym._doc.body)
                .append(WYMeditor.WymClassMozilla.CELL_PLACEHOLDER);

            // The user is still going to need to move out of and then back in
            // to this cell if the table was inserted via an inner_html call
            // (like via the manual HTML editor).
            // TODO: Use rangy or some other selection library to consistently
            // put the users selection out of and then back in this cell
            // so that it appears to be instantly editable
            // Once accomplished, can remove the afterInsertTable handling
        }
    }

    if (container && container.tagName.toLowerCase() == WYMeditor.BODY) {
        // A click in the body means there is no content at all, so we
        // should automatically create a starter paragraph
        wym._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);
    }
};

WYMeditor.WymClassMozilla.prototype.enableDesignMode = function() {
    if (this._doc.designMode == "off") {
        try {
            this._doc.designMode = "on";
            this._doc.execCommand("styleWithCSS", '', false);
            this._doc.execCommand("enableObjectResizing", false, false);
        } catch(e) { }
    }
};

WYMeditor.WymClassMozilla.prototype.openBlockTag = function(tag, attributes)
{
    attributes = this.validator.getValidTagAttributes(tag, attributes);

    // Handle Mozilla styled spans
    if (tag == 'span' && attributes.style) {
        var new_tag = this.getTagForStyle(attributes.style);
        if (new_tag) {
            tag = new_tag;
            this._tag_stack.pop();
            this._tag_stack.push(tag);
            attributes.style = '';
        }
    }

    this.output += this.helper.tag(tag, attributes, true);
};

WYMeditor.WymClassMozilla.prototype.getTagForStyle = function(style) {
    if (/bold/.test(style)) {
        return 'strong';
    } else if (/italic/.test(style)) {
        return 'em';
    } else if (/sub/.test(style)) {
        return 'sub';
    } else if (/super/.test(style)) {
        return 'sup';
    }

    return false;
};

/*
 * Fix new cell contents.
 */
WYMeditor.WymClassMozilla.prototype.afterInsertTable = function(table) {
    if (WYMeditor.WymClassMozilla.NEEDS_CELL_FIX === true) {
        // With FF 3.5+, inserted tables need some content in their
        // cells before they're editable, otherwise the user has to move focus
        // in and then out of a cell first, even with our click() hack
        $(table).find('td').each(function (index, element) {
            $(element).append(WYMeditor.WymClassMozilla.CELL_PLACEHOLDER);
        });
    }
};