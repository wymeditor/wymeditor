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
 *        jquery.wymeditor.explorer.js
 *        MSIE specific class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne a-t wymeditor dotorg)
 *        Bermi Ferrer (wymeditor a-t bermi dotorg)
 *        Frédéric Palluel-Lafleur (fpalluel a-t gmail dotcom)
 *        Jonatan Lundin (jonatan.lundin a-t gmail dotcom)
 */

WYMeditor.WymClassExplorer = function(wym) {
    this._wym = wym;
    this._class = "className";
    this._newLine = "\r\n";
};

WYMeditor.WymClassExplorer.PLACEHOLDER_NODE = '<br>';

WYMeditor.WymClassExplorer.prototype.initIframe = function(iframe) {
    //This function is executed twice, though it is called once!
    //But MSIE needs that, otherwise designMode won't work.
    //Weird.
    this._iframe = iframe;
    this._doc = iframe.contentWindow.document;

    //add css rules from options
    var styles = this._doc.styleSheets[0];
    var aCss = eval(this._options.editorStyles);

    this.addCssRules(this._doc, aCss);

    this._doc.title = this._wym._index;

    //set the text direction
    jQuery('html', this._doc).attr('dir', this._options.direction);

    //init html value
    jQuery(this._doc.body).html(this._wym._html);

    //handle events
    var wym = this;

    this._doc.body.onfocus = function() {
        wym._doc.designMode = "on";
        wym._doc = iframe.contentWindow.document;
    };
    this._doc.onbeforedeactivate = function() {
        wym.saveCaret();
    };
    $(this._doc).bind('keyup', wym.keyup);
    this._doc.onkeyup = function() {
        wym.saveCaret();
    };
    this._doc.onclick = function() {
        wym.saveCaret();
    };

    this._doc.body.onbeforepaste = function() {
        wym._iframe.contentWindow.event.returnValue = false;
    };

    this._doc.body.onpaste = function() {
        wym._iframe.contentWindow.event.returnValue = false;
        wym.paste(window.clipboardData.getData("Text"));
    };

    //callback can't be executed twice, so we check
    if (this._initialized) {

        //pre-bind functions
        if (jQuery.isFunction(this._options.preBind)) {
            this._options.preBind(this);
        }


        //bind external events
        this._wym.bindEvents();

        //post-init functions
        if (jQuery.isFunction(this._options.postInit)) {
            this._options.postInit(this);
        }

        //add event listeners to doc elements, e.g. images
        this.listen();
    }

    this._initialized = true;

    //init designMode
    this._doc.designMode="on";
    try {
        // (bermi's note) noticed when running unit tests on IE6
        // Is this really needed, it trigger an unexisting property on IE6
        this._doc = iframe.contentWindow.document;
    } catch(e) {}
};

(function(editorLoadSkin) {
    WYMeditor.WymClassExplorer.prototype.loadSkin = function() {
        // Mark container items as unselectable (#203)
        // Fix for issue explained:
        // http://stackoverflow.com/questions/1470932/ie8-iframe-designmode-loses-selection
        jQuery(this._box).find(this._options.containerSelector).attr('unselectable', 'on');

        editorLoadSkin.call(this);
    };
})(WYMeditor.editor.prototype.loadSkin);

WYMeditor.WymClassExplorer.prototype._exec = function(cmd,param) {

    switch(cmd) {

    case WYMeditor.INDENT: case WYMeditor.OUTDENT:

        var container = this.findUp(this.container(), WYMeditor.LI);
        if (container) {
            var ancestor = container.parentNode.parentNode;
            if (container.parentNode.childNodes.length>1 ||
                ancestor.tagName.toLowerCase() == WYMeditor.OL ||
                ancestor.tagName.toLowerCase() == WYMeditor.UL) {

                this._doc.execCommand(cmd);
            }
        }
        break;
    default:
        if (param) {
            this._doc.execCommand(cmd, false, param);
        } else {
            this._doc.execCommand(cmd);
        }
        break;
    }

};

WYMeditor.WymClassExplorer.prototype.selected = function() {
    var caretPos = this._iframe.contentWindow.document.caretPos;
    if (caretPos) {
        if (caretPos.parentElement) {
          return caretPos.parentElement();
        }
    }
};

WYMeditor.WymClassExplorer.prototype.saveCaret = function() {
    this._doc.caretPos = this._doc.selection.createRange();
};

WYMeditor.WymClassExplorer.prototype.addCssRule = function(styles, oCss) {
    // IE doesn't handle combined selectors (#196)
    var selectors = oCss.name.split(',');
    for (var i=0; i < selectors.length; i++) {
        styles.addRule(selectors[i], oCss.css);
    }
};

WYMeditor.WymClassExplorer.prototype.insert = function(html) {

    // Get the current selection
    var range = this._doc.selection.createRange();

    // Check if the current selection is inside the editor
    if (jQuery(range.parentElement()).parents().is(this._options.iframeBodySelector)){
        try {
            // Overwrite selection with provided html
            range.pasteHTML(html);
        } catch (e) {}
    } else {
        // Fall back to the internal paste function if there's no selection
        this.paste(html);
    }
};

WYMeditor.WymClassExplorer.prototype.wrap = function(left, right) {
    // Get the current selection
    var range = this._doc.selection.createRange();

    // Check if the current selection is inside the editor
    if (jQuery(range.parentElement()).parents().is(this._options.iframeBodySelector)) {
        try {
            // Overwrite selection with provided html
            range.pasteHTML(left + range.text + right);
        } catch (e) {}
    }
};

WYMeditor.WymClassExplorer.prototype.unwrap = function() {
    // Get the current selection
    var range = this._doc.selection.createRange();

    // Check if the current selection is inside the editor
    if (jQuery(range.parentElement()).parents().is(this._options.iframeBodySelector)) {
        try {
            // Unwrap selection
            var text = range.text;
            this._exec('Cut');
            range.pasteHTML(text);
        } catch (e) {}
    }
};

WYMeditor.WymClassExplorer.prototype.keyup = function(evt) {
    //'this' is the doc
    var wym = WYMeditor.INSTANCES[this.title];

    this._selected_image = null;

    var container = null;

    if (evt.keyCode != WYMeditor.KEY.BACKSPACE &&
        evt.keyCode != WYMeditor.KEY.CTRL &&
        evt.keyCode != WYMeditor.KEY.DELETE &&
        evt.keyCode != WYMeditor.KEY.COMMAND &&
        evt.keyCode != WYMeditor.KEY.UP &&
        evt.keyCode != WYMeditor.KEY.DOWN &&
        evt.keyCode != WYMeditor.KEY.ENTER &&
        !evt.metaKey &&
        !evt.ctrlKey) { // Not BACKSPACE, DELETE, CTRL, or COMMAND key

        container = wym.selected();
        var name = '';
        if (container !== null) {
            name = container.tagName.toLowerCase();
        }

        // Fix forbidden main containers
        if (name == "strong" ||
            name == "b" ||
            name == "em" ||
            name == "i" ||
            name == "sub" ||
            name == "sup" ||
            name == "a") {

            name = container.parentNode.tagName.toLowerCase();
        }

        if (name == WYMeditor.BODY) {
            // Replace text nodes with <p> tags
            wym._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);
            wym.fixBodyHtml();
        }
    }

    // If we potentially created a new block level element or moved to a new one
    // then we should ensure that they're in the proper format
    if (evt.keyCode == WYMeditor.KEY.UP ||
        evt.keyCode == WYMeditor.KEY.DOWN ||
        evt.keyCode == WYMeditor.KEY.BACKSPACE ||
        evt.keyCode == WYMeditor.KEY.ENTER) {

        wym.fixBodyHtml();
    }
};

WYMeditor.WymClassExplorer.prototype.setFocusToNode = function(node, toStart) {
    var range = this._doc.selection.createRange();
    toStart = toStart ? true : false;

    range.moveToElementText(node);
    range.collapse(toStart);
    range.select();
    node.focus();
};

/* @name spaceBlockingElements
 * @description Insert <br> elements between adjacent blocking elements and
 * p elements, between block elements or blocking elements and after blocking
 * elements.
 */
WYMeditor.WymClassExplorer.prototype.spaceBlockingElements = function() {
    var blockingSelector = WYMeditor.BLOCKING_ELEMENTS.join(', ');

    var $body = $(this._doc).find('body.wym_iframe');
    var children = $body.children();
    var placeholderNode = '<br>';

    // Make sure we have the appropriate placeholder nodes
    if (children.length > 0) {
        var $firstChild = $(children[0]);
        var $lastChild = $(children[children.length - 1]);

        // Ensure begining placeholder
        if ($firstChild.is(blockingSelector)) {
            $firstChild.before(placeholderNode);
        }
        if ($.browser.version >= "7.0" && $lastChild.is(blockingSelector)) {
            $lastChild.after(placeholderNode);
        }
    }

    var blockSepSelector = this._getBlockSepSelector();

    // Put placeholder nodes between consecutive blocking elements and between
    // blocking elements and normal block-level elements
    $body.find(blockSepSelector).before(placeholderNode);
};

/* @name paste
 * @description         Paste text into the editor below the carret,
 *                      used for "Paste from Word".
 * @param String str    String to insert, two or more newlines separates
 *                      paragraphs. May contain inline HTML.
 */
WYMeditor.WymClassExplorer.prototype.paste = function(str) {
    var container = this.selected(),
        html = '',
        paragraphs,
        focusNode;

    // Insert where appropriate
    if (container && container.tagName.toLowerCase() != WYMeditor.BODY) {
        // No .last() pre jQuery 1.4
        //focusNode = jQuery(html).insertAfter(container).last()[0];
        paragraphs = jQuery(container).append(str);
        focusNode = paragraphs[paragraphs.length - 1];
    } else {
        // Split string into paragraphs by two or more newlines
        paragraphs = str.split(new RegExp(this._newLine + '{2,}', 'g'));

        // Build html
        for (var i=0, l=paragraphs.length; i < l; i++) {
            html += '<p>' +
                ( paragraphs[i].split(this._newLine).join('<br />') ) +
                '</p>';
        }

        paragraphs = jQuery(html, this._doc).appendTo(this._doc.body);
        focusNode = paragraphs[paragraphs.length - 1];
    }

    // And remove br (if editor was empty)
    jQuery('body > br', this._doc).remove();

    // Restore focus
    this.setFocusToNode(focusNode);
};
