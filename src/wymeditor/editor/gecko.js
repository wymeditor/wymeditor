/*jslint evil: true */
/* global -$ */
"use strict";

WYMeditor.WymClassGecko = function (wym) {
    this._wym = wym;
    this._class = "class";
};

// Placeholder cell to allow content in TD cells for FF 3.5+
WYMeditor.WymClassGecko.CELL_PLACEHOLDER = '<br _moz_dirty="" />';

// Firefox 3.5 and 3.6 require the CELL_PLACEHOLDER and 4.0 doesn't
WYMeditor.WymClassGecko.NEEDS_CELL_FIX = parseInt(
    jQuery.browser.version, 10) === 1 &&
    jQuery.browser.version >= '1.9.1' &&
    jQuery.browser.version < '2.0';

WYMeditor.WymClassGecko.prototype.initIframe = function (iframe) {
    var wym = this;

    this._iframe = iframe;
    this._doc = iframe.contentDocument;

    this._doc.title = this._wym._index;

    // Set the text direction
    jQuery('html', this._doc).attr('dir', this._options.direction);

    // Init html value
    if (this._wym._options.html) {
        this._html(this._wym._options.html);
    } else {
        this._html(this._element[0].value);
    }

    this.enableDesignMode();

    if (jQuery.isFunction(this._options.preBind)) {
        this._options.preBind(this);
    }

    // Bind external events
    this._wym.bindEvents();

    jQuery(this._doc).bind("keydown", this.keydown);
    jQuery(this._doc).bind("keyup", this.keyup);
    jQuery(this._doc).bind("click", this.click);
    // Bind editor focus events (used to reset designmode - Gecko bug)
    jQuery(this._doc).bind("focus", function () {
        // Fix scope
        wym.enableDesignMode.call(wym);
    });

    wym.iframeInitialized = true;

    wym.postIframeInit();
};

/** @name html
 * @description Get/Set the html value
 */
WYMeditor.WymClassGecko.prototype._html = function (html) {
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

WYMeditor.WymClassGecko.prototype._exec = function (cmd, param) {
    if (!this.selectedContainer()) {
        return false;
    }

    if (param) {
        this._doc.execCommand(cmd, '', param);
    } else {
        this._doc.execCommand(cmd, '', null);
    }

    //set to P if parent = BODY
    var container = this.selectedContainer();
    if (container && container.tagName.toLowerCase() === WYMeditor.BODY) {
        this._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);
        this.fixBodyHtml();
    }

    return true;
};

//keydown handler, mainly used for keyboard shortcuts
WYMeditor.WymClassGecko.prototype.keydown = function (evt) {
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
WYMeditor.WymClassGecko.prototype.keyup = function (evt) {
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
    wym._selectedImage = null;
    container = null;

    // If the inputted key cannont create a block element and is not a command,
    // check to make sure the selection is properly wrapped in a container
    if (!wym.keyCanCreateBlockElement(evt.which) &&
            evt.which !== WYMeditor.KEY.CTRL &&
            evt.which !== WYMeditor.KEY.COMMAND &&
            !evt.metaKey &&
            !evt.ctrlKey) {

        container = wym.selectedContainer();
        name = container.tagName.toLowerCase();
        if (container.parentNode) {
            parentName = container.parentNode.tagName.toLowerCase();
        }

        // Fix forbidden main containers
        if (wym.isForbiddenMainContainer(name)) {
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
    if (wym.keyCanCreateBlockElement(evt.which)) {
        // If the selected container is a root container, make sure it is not a
        // different possible default root container than the chosen one.
        container = wym.selectedContainer();
        name = container.tagName.toLowerCase();
        if (container.parentNode) {
            parentName = container.parentNode.tagName.toLowerCase();
        }
        if (jQuery.inArray(name, notValidRootContainers) > -1 &&
                parentName === WYMeditor.BODY) {
            wym._exec(WYMeditor.FORMAT_BLOCK, defaultRootContainer);
        }

        // Call for the check for--and possible correction of--issue #430.
        wym.handlePotentialEnterInEmptyNestedLi(evt.which, container);

        // Fix formatting if necessary
        wym.fixBodyHtml();
    }
};

WYMeditor.WymClassGecko.prototype.click = function () {
    var wym = WYMeditor.INSTANCES[this.title],
        container = wym.selectedContainer(),
        sel;

    if (WYMeditor.WymClassGecko.NEEDS_CELL_FIX === true) {
        if (container && container.tagName.toLowerCase() === WYMeditor.TR) {
            // Starting with FF 3.6, inserted tables need some content in their
            // cells before they're editable
            jQuery(WYMeditor.TD, wym._doc.body).append(
                WYMeditor.WymClassGecko.CELL_PLACEHOLDER);

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

WYMeditor.WymClassGecko.prototype.enableDesignMode = function () {
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
WYMeditor.WymClassGecko.prototype.afterInsertTable = function (table) {
    if (WYMeditor.WymClassGecko.NEEDS_CELL_FIX === true) {
        // In certain FF versions, inserted tables need some content in their
        // cells before they're editable, otherwise the user has to move focus
        // in and then out of a cell first, even with our click() hack
        jQuery(table).find('td').each(function (index, element) {
            jQuery(element).append(WYMeditor.WymClassGecko.CELL_PLACEHOLDER);
        });
    }
};
