/*jslint evil: true */
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

WYMeditor.WymClassMozilla = function (wym) {
    this._wym = wym;
    this._class = "class";
};

// Placeholder cell to allow content in TD cells for FF 3.5+
WYMeditor.WymClassMozilla.CELL_PLACEHOLDER = '<br _moz_dirty="" />';

// Firefox 3.5 and 3.6 require the CELL_PLACEHOLDER and 4.0 doesn't
WYMeditor.WymClassMozilla.NEEDS_CELL_FIX = parseInt(
    jQuery.browser.version, 10) === 1 &&
    jQuery.browser.version >= '1.9.1' &&
    jQuery.browser.version < '2.0';

WYMeditor.WymClassMozilla.prototype.initIframe = function (iframe) {
    var wym = this,
        styles,
        aCss;

    this._iframe = iframe;
    this._doc = iframe.contentDocument;

    //add css rules from options
    styles = this._doc.styleSheets[0];

    aCss = eval(this._options.editorStyles);

    this.addCssRules(this._doc, aCss);

    this._doc.title = this._wym._index;

    //set the text direction
    jQuery('html', this._doc).attr('dir', this._options.direction);

    //init html value
    this._html(this._wym._options.html);

    //init designMode
    this.enableDesignMode();

    //pre-bind functions
    if (jQuery.isFunction(this._options.preBind)) {
        this._options.preBind(this);
    }

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
    if (jQuery.isFunction(this._options.postInit)) {
        this._options.postInit(this);
    }

    //add event listeners to doc elements, e.g. images
    this.listen();
};

/** @name html
 * @description Get/Set the html value
 */
WYMeditor.WymClassMozilla.prototype._html = function (html) {
    if (typeof html === 'string') {
        //disable designMode
        try {
            this._doc.designMode = "off";
        } catch (e) {
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
        this._wym.fixBodyHtml();

        //re-init designMode
        this.enableDesignMode();
    } else {
        return jQuery(this._doc.body).html();
    }
    return false;
};

WYMeditor.WymClassMozilla.prototype._exec = function (cmd, param) {
    if (!this.selected()) {
        return false;
    }

    if (param) {
        this._doc.execCommand(cmd, '', param);
    } else {
        this._doc.execCommand(cmd, '', null);
    }

    //set to P if parent = BODY
    var container = this.selected();
    if (container && container.tagName.toLowerCase() === WYMeditor.BODY) {
        this._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);
        this.fixBodyHtml();
    }

    return true;
};

WYMeditor.WymClassMozilla.prototype.addCssRule = function (styles, oCss) {

    styles.insertRule(oCss.name + " {" + oCss.css + "}",
        styles.cssRules.length);
};

//keydown handler, mainly used for keyboard shortcuts
WYMeditor.WymClassMozilla.prototype.keydown = function (evt) {
    //'this' is the doc
    var wym = WYMeditor.INSTANCES[this.title];

    if (evt.ctrlKey) {
        if (evt.which === 66) {
            //CTRL+b => STRONG
            wym._exec(WYMeditor.BOLD);
            return false;
        }
        if (evt.which === 73) {
            //CTRL+i => EMPHASIS
            wym._exec(WYMeditor.ITALIC);
            return false;
        }
    }

    return true;
};

// Keyup handler, mainly used for cleanups
WYMeditor.WymClassMozilla.prototype.keyup = function (evt) {
    // 'this' is the doc
    var wym = WYMeditor.INSTANCES[this.title],
        container,
        defaultRootContainer,
        notValidRootContainers,
        name,
        parentName;

    notValidRootContainers =
        wym.documentStructureManager.structureRules.notValidRootContainers;
    defaultRootContainer =
        wym.documentStructureManager.structureRules.defaultRootContainer;
    wym._selected_image = null;
    container = null;

    if (evt.which !== WYMeditor.KEY.BACKSPACE &&
            evt.which !== WYMeditor.KEY.CTRL &&
            evt.which !== WYMeditor.KEY.DELETE &&
            evt.which !== WYMeditor.KEY.COMMAND &&
            evt.which !== WYMeditor.KEY.UP &&
            evt.which !== WYMeditor.KEY.DOWN &&
            evt.which !== WYMeditor.KEY.LEFT &&
            evt.which !== WYMeditor.KEY.RIGHT &&
            evt.which !== WYMeditor.KEY.ENTER &&
            !evt.metaKey &&
            !evt.ctrlKey) { // Not BACKSPACE, DELETE, CTRL, or COMMAND key

        container = wym.selected();
        name = container.tagName.toLowerCase();
        if (container.parentNode) {
            parentName = container.parentNode.tagName.toLowerCase();
        }

        // Fix forbidden main containers
        if (name === "strong" ||
                name === "b" ||
                name === "em" ||
                name === "i" ||
                name === "sub" ||
                name === "sup" ||
                name === "a" ||
                name === "span") {

            name = parentName;
        }

        // Replace text nodes with default root tags and make sure the
        // container is valid if it is a root container
        if (name === WYMeditor.BODY ||
                (jQuery.inArray(name, notValidRootContainers) > -1 &&
                parentName === WYMeditor.BODY)) {

            wym._exec(WYMeditor.FORMAT_BLOCK, defaultRootContainer);
            wym.fixBodyHtml();
        }
    }

    // If we potentially created a new block level element or moved to a new
    // one, then we should ensure the container is valid and the formatting is
    // proper.
    if (evt.which === WYMeditor.KEY.UP ||
            evt.which === WYMeditor.KEY.DOWN ||
            evt.which === WYMeditor.KEY.LEFT ||
            evt.which === WYMeditor.KEY.RIGHT ||
            evt.which === WYMeditor.KEY.BACKSPACE ||
            evt.which === WYMeditor.KEY.ENTER) {

        // If the selected container is a root container, make sure it is not a
        // different possible default root container than the chosen one.
        container = wym.selected();
        name = container.tagName.toLowerCase();
        if (container.parentNode) {
            parentName = container.parentNode.tagName.toLowerCase();
        }
        if (jQuery.inArray(name, notValidRootContainers) > -1 &&
                parentName === WYMeditor.BODY) {
            wym._exec(WYMeditor.FORMAT_BLOCK, defaultRootContainer);
        }

        // Fix formatting if necessary
        wym.fixBodyHtml();
    }
};

WYMeditor.WymClassMozilla.prototype.click = function (evt) {
    var wym = WYMeditor.INSTANCES[this.title],
        container = wym.selected(),
        sel;

    if (WYMeditor.WymClassMozilla.NEEDS_CELL_FIX === true) {
        if (container && container.tagName.toLowerCase() === WYMeditor.TR) {
            // Starting with FF 3.6, inserted tables need some content in their
            // cells before they're editable
            jQuery(WYMeditor.TD, wym._doc.body).
                append(WYMeditor.WymClassMozilla.CELL_PLACEHOLDER);

            // The user is still going to need to move out of and then back in
            // to this cell if the table was inserted via an inner_html call
            // (like via the manual HTML editor).
            // TODO: Use rangy or some other selection library to consistently
            // put the users selection out of and then back in this cell
            // so that it appears to be instantly editable
            // Once accomplished, can remove the afterInsertTable handling
        }
    }

    if (container && container.tagName.toLowerCase() === WYMeditor.BODY) {
        // A click in the body means there is no content at all, so we
        // should automatically create a starter paragraph
        sel = wym._iframe.contentWindow.getSelection();
        if (sel.isCollapsed === true) {
            // If the selection isn't collapsed, we might have a selection that
            // drags over the body, but we shouldn't turn everything in to a
            // paragraph tag. Otherwise, double-clicking in the space to the
            // right of an h2 tag would turn it in to a paragraph
            wym._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);
        }
    }
};

WYMeditor.WymClassMozilla.prototype.enableDesignMode = function () {
    if (this._doc.designMode === "off") {
        try {
            this._doc.designMode = "on";
            this._doc.execCommand("styleWithCSS", '', false);
            this._doc.execCommand("enableObjectResizing", false, true);
        } catch (e) {}
    }
};

/*
 * Fix new cell contents and ability to insert content at the front and end of
 * the contents.
 */
WYMeditor.WymClassMozilla.prototype.afterInsertTable = function (table) {
    if (WYMeditor.WymClassMozilla.NEEDS_CELL_FIX === true) {
        // In certain FF versions, inserted tables need some content in their
        // cells before they're editable, otherwise the user has to move focus
        // in and then out of a cell first, even with our click() hack
        jQuery(table).find('td').each(function (index, element) {
            jQuery(element).append(WYMeditor.WymClassMozilla.CELL_PLACEHOLDER);
        });
    }
};

