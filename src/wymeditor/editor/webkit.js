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
 *        jquery.wymeditor.safari.js
 *        Safari specific class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne a-t wymeditor dotorg)
 *        Scott Lewis (lewiscot a-t gmail dotcom)
 */

WYMeditor.WymClassSafari = function (wym) {
    this._wym = wym;
    this._class = "class";
};

WYMeditor.WymClassSafari.prototype.initIframe = function (iframe) {
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

    //init designMode
    this._doc.designMode = "on";

    //init html value
    this._html(this._wym._options.html);

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

    //post-init functions
    if (jQuery.isFunction(this._options.postInit)) {
        this._options.postInit(this);
    }

    //add event listeners to doc elements, e.g. images
    this.listen();
};

WYMeditor.WymClassSafari.prototype._exec = function (cmd, param) {
    if (!this.selected()) {
        return false;
    }

    var container,
        $container,
        tagName;

    if (param) {
        this._doc.execCommand(cmd, '', param);
    } else {
        this._doc.execCommand(cmd, '', null);
    }

    container = this.selected();
    if (container) {
        $container = jQuery(container);
        tagName = container.tagName.toLowerCase();

        // Wrap this content in the default root container if we're in the body
        if (tagName === WYMeditor.BODY) {
            this._exec(WYMeditor.FORMAT_BLOCK,
                       this.documentStructureManager.structureRules.defaultRootContainer);
            this.fixBodyHtml();
        }

        // If the cmd was FORMAT_BLOCK, check if the block was moved outside
        // the body after running the command. If it was moved outside, move it
        // back inside the body. This was added because running FORMAT_BLOCK on
        // an image inserted outside of a container was causing it to be moved
        // outside the body (See issue #400).
        if (cmd === WYMeditor.FORMAT_BLOCK &&
            $container.siblings('body.wym_iframe').length) {

            $container.siblings('body.wym_iframe').append(container);
        }

        // If the container is a span, strip it out if it doesn't have a class
        // but has an inline style of 'font-weight: normal;'.
        if (tagName === 'span' &&
            (!$container.attr('class') ||
                $container.attr('class').toLowerCase() === 'apple-style-span') &&
            $container.attr('style') === 'font-weight: normal;') {

            $container.contents().unwrap();
        }
    }

    return true;
};

WYMeditor.WymClassSafari.prototype.addCssRule = function (styles, oCss) {
    styles.insertRule(oCss.name + " {" + oCss.css + "}",
        styles.cssRules.length);
};


//keydown handler, mainly used for keyboard shortcuts
WYMeditor.WymClassSafari.prototype.keydown = function (e) {
    //'this' is the doc
    var wym = WYMeditor.INSTANCES[this.title];

    if (e.ctrlKey) {
        if (e.which === WYMeditor.KEY.B) {
            //CTRL+b => STRONG
            wym._exec(WYMeditor.BOLD);
            e.preventDefault();
        }
        if (e.which === WYMeditor.KEY.I) {
            //CTRL+i => EMPHASIS
            wym._exec(WYMeditor.ITALIC);
            e.preventDefault();
        }
    } else if (e.shiftKey && e.which === WYMeditor.KEY.ENTER) {
        // Safari 4 and earlier would show a proper linebreak in the editor and
        // then strip it upon save with the default action in the case of inserting
        // a new line after bold text
        wym._exec('InsertLineBreak');
        e.preventDefault();
    }
};

// Keyup handler, mainly used for cleanups
WYMeditor.WymClassSafari.prototype.keyup = function (evt) {
    //'this' is the doc
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

    // Fix to allow shift + return to insert a line break in older safari
    if (jQuery.browser.version < 534.1) {
        // Not needed in AT MAX chrome 6.0. Probably safe earlier
        if (evt.which === WYMeditor.KEY.ENTER && evt.shiftKey) {
            wym._exec('InsertLineBreak');
        }
    }

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
            !evt.ctrlKey) {// Not BACKSPACE, DELETE, CTRL, or COMMAND key

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
            // Webkit tries to use spans as a main container

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

