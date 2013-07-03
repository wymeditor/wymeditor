/*jshint evil: true */

/**
    WYMeditor.editor.init
    =====================

    Initialize a wymeditor instance, including detecting the
    current browser and enabling the browser-specific subclass.
*/
WYMeditor.editor.prototype.init = function () {
    // Load the browser-specific subclass
    // If this browser isn't supported, do nothing
    var WymClass = false,
        SaxListener,
        prop,
        h,
        iframeHtml,
        boxHtml,
        aTools,
        sTools,
        oTool,
        sTool,
        i,
        aClasses,
        sClasses,
        oClass,
        sClass,
        aContainers,
        sContainers,
        sContainer,
        oContainer;

    if (jQuery.browser.msie) {
        WymClass = new WYMeditor.WymClassExplorer(this);
    } else if (jQuery.browser.mozilla) {
        WymClass = new WYMeditor.WymClassMozilla(this);
    } else if (jQuery.browser.opera) {
        WymClass = new WYMeditor.WymClassOpera(this);
    } else if (jQuery.browser.safari || jQuery.browser.webkit ||
               jQuery.browser.chrome) {
        WymClass = new WYMeditor.WymClassSafari(this);
    }

    if (WymClass === false) {
        return;
    }

    if (jQuery.isFunction(this._options.preInit)) {
        this._options.preInit(this);
    }

    SaxListener = new WYMeditor.XhtmlSaxListener();
    //jQuery.extend(SaxListener, WymClass);
    this.parser = new WYMeditor.XhtmlParser(SaxListener);

    if (this._options.styles || this._options.stylesheet) {
        this.configureEditorUsingRawCss();
    }

    this.helper = new WYMeditor.XmlHelper();

    // Extend the editor object with the browser-specific version.
    // We're not using jQuery.extend because we *want* to copy properties via
    // the prototype chain
    for (prop in WymClass) {
        /*jslint forin: false*/
        // Explicitly not using hasOwnProperty for the inheritance here
        // because we want to go up the prototype chain to get all of the
        // browser-specific editor methods. This is kind of a code smell,
        // but works just fine.
        this[prop] = WymClass[prop];
    }

    // Load wymbox
    this._box = jQuery(this._element).hide().after(this._options.boxHtml).next().addClass('wym_box_' + this._index);

    // Store the instance index and replaced element in wymbox
    // but keep it compatible with jQuery < 1.2.3, see #122
    if (jQuery.isFunction(jQuery.fn.data)) {
        jQuery.data(this._box.get(0), WYMeditor.WYM_INDEX, this._index);
        jQuery.data(this._element.get(0), WYMeditor.WYM_INDEX, this._index);
    }

    h = WYMeditor.Helper;

    // Construct the iframe
    iframeHtml = this._options.iframeHtml;
    iframeHtml = h.replaceAll(iframeHtml, WYMeditor.INDEX, this._index);
    iframeHtml = h.replaceAll(
        iframeHtml,
        WYMeditor.IFRAME_BASE_PATH,
        this._options.iframeBasePath
    );

    // Construct wymbox
    boxHtml = jQuery(this._box).html();

    boxHtml = h.replaceAll(boxHtml, WYMeditor.LOGO, this._options.logoHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.TOOLS, this._options.toolsHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.CONTAINERS, this._options.containersHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.CLASSES, this._options.classesHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.HTML, this._options.htmlHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.IFRAME, iframeHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.STATUS, this._options.statusHtml);

    // Construct the tools list
    aTools = eval(this._options.toolsItems);
    sTools = "";

    for (i = 0; i < aTools.length; i += 1) {
        oTool = aTools[i];
        sTool = '';
        if (oTool.name && oTool.title) {
            sTool = this._options.toolsItemHtml;
        }
        sTool = h.replaceAll(sTool, WYMeditor.TOOL_NAME, oTool.name);
        sTool = h.replaceAll(
            sTool,
            WYMeditor.TOOL_TITLE,
            this._options.stringDelimiterLeft + oTool.title + this._options.stringDelimiterRight
        );
        sTool = h.replaceAll(sTool, WYMeditor.TOOL_CLASS, oTool.css);
        sTools += sTool;
    }

    boxHtml = h.replaceAll(boxHtml, WYMeditor.TOOLS_ITEMS, sTools);

    // Construct the classes list
    aClasses = eval(this._options.classesItems);
    sClasses = "";

    for (i = 0; i < aClasses.length; i += 1) {
        oClass = aClasses[i];
        sClass = '';
        if (oClass.name && oClass.title) {
            sClass = this._options.classesItemHtml;
        }
        sClass = h.replaceAll(sClass, WYMeditor.CLASS_NAME, oClass.name);
        sClass = h.replaceAll(sClass, WYMeditor.CLASS_TITLE, oClass.title);
        sClasses += sClass;
    }

    boxHtml = h.replaceAll(boxHtml, WYMeditor.CLASSES_ITEMS, sClasses);

    // Construct the containers list
    aContainers = eval(this._options.containersItems);
    sContainers = "";

    for (i = 0; i < aContainers.length; i += 1) {
        oContainer = aContainers[i];
        sContainer = '';
        if (oContainer.name && oContainer.title) {
            sContainer = this._options.containersItemHtml;
        }
        sContainer = h.replaceAll(
            sContainer,
            WYMeditor.CONTAINER_NAME,
            oContainer.name
        );
        sContainer = h.replaceAll(sContainer, WYMeditor.CONTAINER_TITLE,
            this._options.stringDelimiterLeft +
            oContainer.title +
            this._options.stringDelimiterRight);
        sContainer = h.replaceAll(
            sContainer,
            WYMeditor.CONTAINER_CLASS,
            oContainer.css
        );
        sContainers += sContainer;
    }

    boxHtml = h.replaceAll(boxHtml, WYMeditor.CONTAINERS_ITEMS, sContainers);

    // I10n
    boxHtml = this.replaceStrings(boxHtml);

    // Load the html in wymbox
    jQuery(this._box).html(boxHtml);

    // Hide the html value
    jQuery(this._box).find(this._options.htmlSelector).hide();

    this.loadSkin();
};

/**
    WYMeditor.editor.bindEvents
    ===========================

    Bind all event handlers including tool/container clicks, focus events
    and change events.
*/
WYMeditor.editor.prototype.bindEvents = function () {
    var wym = this,
        $html_val;

    // Handle click events on tools buttons
    jQuery(this._box).find(this._options.toolSelector).click(function () {
        wym._iframe.contentWindow.focus(); //See #154
        wym.exec(jQuery(this).attr(WYMeditor.NAME));
        return false;
    });

    // Handle click events on containers buttons
    jQuery(this._box).find(this._options.containerSelector).click(function () {
        wym.container(jQuery(this).attr(WYMeditor.NAME));
        return false;
    });

    // Handle keyup event on html value: set the editor value
    // Handle focus/blur events to check if the element has focus, see #147
    $html_val = jQuery(this._box).find(this._options.htmlValSelector);
    $html_val.keyup(function () {
        jQuery(wym._doc.body).html(jQuery(this).val());
    });
    $html_val.focus(function () {
        jQuery(this).toggleClass('hasfocus');
    });
    $html_val.blur(function () {
        jQuery(this).toggleClass('hasfocus');
    });

    // Handle click events on classes buttons
    jQuery(this._box).find(this._options.classSelector).click(function () {
        var aClasses = eval(wym._options.classesItems),
            sName = jQuery(this).attr(WYMeditor.NAME),

            oClass = WYMeditor.Helper.findByName(aClasses, sName),
            jqexpr;

        if (oClass) {
            jqexpr = oClass.expr;
            wym.toggleClass(sName, jqexpr);
        }
        wym._iframe.contentWindow.focus(); //See #154
        return false;
    });

    // Handle update event on update element
    jQuery(this._options.updateSelector).bind(this._options.updateEvent, function () {
        wym.update();
    });
};

WYMeditor.editor.prototype.ready = function () {
    return this._doc !== null;
};

/**
    WYMeditor.editor.box
    ====================

    Get the wymbox container.
*/
WYMeditor.editor.prototype.box = function () {
    return this._box;
};

/**
    WYMeditor.editor._html
    ======================

    Get or set the wymbox html value. If you want to get the wymbox html, you
    should use WYMeditor.editor.xhtml() instead of this so that the html is
    parsed and receives cross-browser cleanup. Only use this if you have a
    specific reason not to use WYMeditor.editor.xhtml().
*/
WYMeditor.editor.prototype._html = function (html) {
    if (typeof html === 'string') {
        jQuery(this._doc.body).html(html);
        this.update();
    } else {
        return jQuery(this._doc.body).html();
    }
};

/**
    WYMeditor.editor.html
    =====================

    Deprecated. Use WYMeditor.editor.xhtml or WYMeditor.editor._html instead.
    Calling this function will give a console warning.
*/
WYMeditor.editor.prototype.html = function (html) {
    WYMeditor.console.warn("The function WYMeditor.editor.html() is deprecated. " +
                           "Use either WYMeditor.editor.xhtml() or " +
                           "WYMeditor.editor._html() instead.");
    if (typeof html === 'string') {
        this._html(html);
    } else {
        return this._html();
    }
};

/**
    WYMeditor.editor.xhtml
    ======================

    Take the current editor's DOM and apply strict xhtml nesting rules to
    enforce a valid, well-formed, semantic xhtml result.
*/
WYMeditor.editor.prototype.xhtml = function () {
    return this.parser.parse(this._html());
};

/**
    WYMeditor.editor.exec
    =====================

    Execute a button command on the currently-selected container. The command
    can be anything from "indent this element" to "open a dialog to create a
    table."

    `cmd` is a string corresponding to the command that should be run, roughly
    matching the designMode execCommand strategy (and falling through to
    execCommand in some cases).
*/
WYMeditor.editor.prototype.exec = function (cmd) {
    var container, custom_run, _this = this;
    switch (cmd) {

    case WYMeditor.CREATE_LINK:
        container = this.container();
        if (container || this._selected_image) {
            this.dialog(WYMeditor.DIALOG_LINK);
        }
        break;

    case WYMeditor.INSERT_IMAGE:
        this.dialog(WYMeditor.DIALOG_IMAGE);
        break;

    case WYMeditor.INSERT_TABLE:
        this.dialog(WYMeditor.DIALOG_TABLE);
        break;

    case WYMeditor.PASTE:
        this.dialog(WYMeditor.DIALOG_PASTE);
        break;

    case WYMeditor.TOGGLE_HTML:
        this.update();
        this.toggleHtml();
        break;

    case WYMeditor.PREVIEW:
        this.dialog(WYMeditor.PREVIEW, this._options.dialogFeaturesPreview);
        break;

    case WYMeditor.INSERT_ORDEREDLIST:
        this.insertOrderedlist();
        break;

    case WYMeditor.INSERT_UNORDEREDLIST:
        this.insertUnorderedlist();
        break;

    case WYMeditor.INDENT:
        this.indent();
        break;

    case WYMeditor.OUTDENT:
        this.outdent();
        break;


    default:
        custom_run = false;
        jQuery.each(this._options.customCommands, function () {
            if (cmd === this.name) {
                custom_run = true;
                this.run.apply(_this);
                return false;
            }
        });
        if (!custom_run) {
            this._exec(cmd);
        }
        break;
    }
};

/**
    WYMeditor.editor.selection
    ==========================

    Override the default selection function to use rangy.
*/
WYMeditor.editor.prototype.selection = function () {
    if (window.rangy && !rangy.initialized) {
        rangy.init();
    }

    var iframe = this._iframe,
        sel = rangy.getIframeSelection(iframe);

    return sel;
};

/**
    WYMeditor.editor.selection
    ==========================

    Return the selected node.
*/
WYMeditor.editor.prototype.selected = function () {
    var sel = this.selection(),
        node = sel.focusNode,
        caretPos;

    if (node) {
        if (jQuery.browser.msie) {
            // For collapsed selections, we have to use the ghetto "caretPos"
            // hack to find the selection, otherwise it always says that the
            // body element is selected
            var isBodyTag = node.tagName && node.tagName.toLowerCase() === "body";
            var isTextNode = node.nodeName === "#text";

            if (sel.isCollapsed && (isBodyTag || isTextNode)) {
                caretPos = this._iframe.contentWindow.document.caretPos;
                if (caretPos && caretPos.parentElement) {
                    node = caretPos.parentElement();
                }
            }
        }
        if (node.nodeName === "#text") {
            return node.parentNode;
        } else {
            return node;
        }
    } else {
        return null;
    }
};

/**
    WYMeditor.editor.selection_collapsed
    ====================================

    Return true if all selections are collapsed, false otherwise.
*/
WYMeditor.editor.prototype.selection_collapsed = function () {
    var sel = this.selection(),
        collapsed = false;

    jQuery.each(sel.getAllRanges(), function () {
        if (this.collapsed) {
            collapsed = true;
            //break
            return false;
        }
    });

    return collapsed;
};

/**
    WYMeditor.editor.selected_contains
    ==================================

    Return an array of nodes that match a jQuery selector
    within the current selection.
*/
WYMeditor.editor.prototype.selected_contains = function (selector) {
    var sel = this.selection(),
        matches = [];

    jQuery.each(sel.getAllRanges(), function () {
        jQuery.each(this.getNodes(), function () {
            if (jQuery(this).is(selector)) {
                matches.push(this);
            }
        });
    });

    return matches;
};

/**
    WYMeditor.editor.selected_parents_contains
    ==================================

    Return an array of nodes that match the selector within
    the selection's parents.
*/
WYMeditor.editor.prototype.selected_parents_contains = function (selector) {
    var $matches = jQuery([]),
        $selected = jQuery(this.selected());
    if ($selected.is(selector)) {
        $matches = $matches.add($selected);
    }
    $matches = $matches.add($selected.parents(selector));
    return $matches;
};

/**
    WYMeditor.editor.container
    ==========================

    Get or set the selected container.
*/
WYMeditor.editor.prototype.container = function (sType) {
    if (typeof (sType) === 'undefined') {
        return this.selected();
    }

    var container = null,
        aTypes = null,
        newNode = null,
        blockquote,
        nodes,
        lgt,
        firstNode = null,
        x;

    if (sType.toLowerCase() === WYMeditor.TH) {
        container = this.container();

        // Find the TD or TH container
        switch (container.tagName.toLowerCase()) {

        case WYMeditor.TD:
        case WYMeditor.TH:
            break;
        default:
            aTypes = [WYMeditor.TD, WYMeditor.TH];
            container = this.findUp(this.container(), aTypes);
            break;
        }

        // If it exists, switch
        if (container !== null) {
            sType = WYMeditor.TD;
            if (container.tagName.toLowerCase() === WYMeditor.TD) {
                sType = WYMeditor.TH;
            }
            this.switchTo(container, sType, false);
            this.update();
        }
    } else {
        // Set the container type
        aTypes = [
            WYMeditor.P,
            WYMeditor.H1,
            WYMeditor.H2,
            WYMeditor.H3,
            WYMeditor.H4,
            WYMeditor.H5,
            WYMeditor.H6,
            WYMeditor.PRE,
            WYMeditor.BLOCKQUOTE
        ];
        container = this.findUp(this.container(), aTypes);

        if (container) {
            if (sType.toLowerCase() === WYMeditor.BLOCKQUOTE) {
                // Blockquotes must contain a block level element
                blockquote = this.findUp(
                    this.container(),
                    WYMeditor.BLOCKQUOTE
                );
                if (blockquote === null) {
                    newNode = this._doc.createElement(sType);
                    container.parentNode.insertBefore(newNode, container);
                    newNode.appendChild(container);
                    this.setFocusToNode(newNode.firstChild);
                } else {
                    nodes = blockquote.childNodes;
                    lgt = nodes.length;

                    if (lgt > 0) {
                        firstNode = nodes.item(0);
                    }
                    for (x = 0; x < lgt; x += 1) {
                        blockquote.parentNode.insertBefore(
                            nodes.item(0),
                            blockquote
                        );
                    }
                    blockquote.parentNode.removeChild(blockquote);
                    if (firstNode) {
                        this.setFocusToNode(firstNode);
                    }
                }
            } else {
                // Not a blockquote
                this.switchTo(container, sType);
            }

            this.update();
        }
    }

    return false;
};

/**
    WYMeditor.editor.toggleClass
    ============================

    Toggle a class on the selected element or one of its parents
*/
WYMeditor.editor.prototype.toggleClass = function (sClass, jqexpr) {
    var container = null;
    if (this._selected_image) {
        container = this._selected_image;
    } else {
        container = jQuery(this.selected());
    }
    container = jQuery(container).parentsOrSelf(jqexpr);
    jQuery(container).toggleClass(sClass);

    if (!jQuery(container).attr(WYMeditor.CLASS)) {
        jQuery(container).removeAttr(this._class);
    }
};

/**
    WYMeditor.editor.findUp
    =======================

    Return the first parent or self container, based on its type

    `filter` is a string or an array of strings on which to filter the container
*/
WYMeditor.editor.prototype.findUp = function (node, filter) {
    if (typeof (node) === 'undefined' || node === null) {
        return null;
    }

    if (node.nodeName === "#text") {
        // For text nodes, we need to look from the nodes container object
        node = node.parentNode;
    }
    var tagname = node.tagName.toLowerCase(),
        bFound,
        i;
    if (typeof (filter) === WYMeditor.STRING) {
        while (tagname !== filter && tagname !== WYMeditor.BODY) {
            node = node.parentNode;
            tagname = node.tagName.toLowerCase();
        }
    } else {
        bFound = false;
        while (!bFound && tagname !== WYMeditor.BODY) {
            for (i = 0; i < filter.length; i += 1) {
                if (tagname === filter[i]) {
                    bFound = true;
                    break;
                }
            }
            if (!bFound) {
                node = node.parentNode;
                if (node === null) {
                    // No parentNode, so we're not going to find anything
                    // up the ancestry chain that matches
                    return null;
                }
                tagname = node.tagName.toLowerCase();
            }
        }
    }

    if (tagname === WYMeditor.BODY) {
        return null;
    }

    return node;
};

/**
    WYMeditor.editor.switchTo
    =========================

    Switch the type of the given `node` to type `sType`. If stripAttrs is true,
    the attributes of node will not be included in the the new type. If
    stripAttrs is false (or undefined), the attributes of node will be
    preserved through the switch.
*/
WYMeditor.editor.prototype.switchTo = function (node, sType, stripAttrs) {
    var newNode = this._doc.createElement(sType),
        html = jQuery(node).html(),
        attrs = node.attributes,
        i;

    if (!stripAttrs) {
        for (i = 0; i < attrs.length; ++i) {
            newNode.setAttribute(attrs.item(i).nodeName,
                                 attrs.item(i).nodeValue);
        }
    }
    newNode.innerHTML = html;
    node.parentNode.replaceChild(newNode, node);

    this.setFocusToNode(newNode);
};

WYMeditor.editor.prototype.replaceStrings = function (sVal) {
    var key;
    // Check if the language file has already been loaded
    // if not, get it via a synchronous ajax call
    if (!WYMeditor.STRINGS[this._options.lang]) {
        try {
            eval(jQuery.ajax({url: this._options.langPath +
                this._options.lang + '.js', async: false}).responseText);
        } catch (e) {
            WYMeditor.console.error(
                "WYMeditor: error while parsing language file."
            );
            return sVal;
        }
    }

    // Replace all the strings in sVal and return it
    for (key in WYMeditor.STRINGS[this._options.lang]) {
        if (WYMeditor.STRINGS[this._options.lang].hasOwnProperty(key)) {
            sVal = WYMeditor.Helper.replaceAll(
                sVal,
                this._options.stringDelimiterLeft + key + this._options.stringDelimiterRight,
                WYMeditor.STRINGS[this._options.lang][key]
            );
        }
    }
    return sVal;
};

WYMeditor.editor.prototype.encloseString = function (sVal) {
    return this._options.stringDelimiterLeft +
        sVal +
        this._options.stringDelimiterRight;
};

/**
    editor.status
    =============

    Print the given string as a status message.
*/
WYMeditor.editor.prototype.status = function (sMessage) {
    // Print status message
    jQuery(this._box).find(this._options.statusSelector).html(sMessage);
};

/**
    editor.update
    =============

    Update the element and textarea values.
*/
WYMeditor.editor.prototype.update = function () {
    var html;

    html = this.xhtml();
    jQuery(this._element).val(html);
    jQuery(this._box).find(this._options.htmlValSelector).not('.hasfocus').val(html); //#147
    this.fixBodyHtml();
};

/**
    editor.fixBodyHtml
    ==================

    Adjust the editor body html to account for editing changes where
    perfect HTML is not optimal. For instance, <br> elements are useful between
    certain block elements.
*/
WYMeditor.editor.prototype.fixBodyHtml = function () {
    this.spaceBlockingElements();
    this.fixDoubleBr();
};

/**
    editor.spaceBlockingElements
    ============================

    Insert <br> elements between adjacent blocking elements and
    p elements, between block elements or blocking elements and the
    start/end of the document.
*/
WYMeditor.editor.prototype.spaceBlockingElements = function () {
    var blockingSelector = WYMeditor.BLOCKING_ELEMENTS.join(', '),

        $body = jQuery(this._doc).find('body.wym_iframe'),
        children = $body.children(),

        placeholderNode,
        $firstChild,
        $lastChild,
        blockSepSelector,
        blockInListSepSelector,
        $blockInList;

    if (jQuery.browser.mozilla) {
        placeholderNode = '<br ' +
                            'class="' +
                            WYMeditor.EDITOR_ONLY_CLASS + '" ' +
                            '_moz_editor_bogus_node="TRUE" ' +
                            '_moz_dirty=""' +
                          '/>';
    } else {
        placeholderNode = '<br ' +
                            'class="' + WYMeditor.EDITOR_ONLY_CLASS + '"/>';
    }

    // Make sure that we still have a bogus node at both the begining and end
    if (children.length > 0) {
        $firstChild = jQuery(children[0]);
        $lastChild = jQuery(children[children.length - 1]);

        if ($firstChild.is(blockingSelector)) {
            $firstChild.before(placeholderNode);
        }

        if ($lastChild.is(blockingSelector) &&
            !(jQuery.browser.msie && jQuery.browser.version < "7.0")) {

            $lastChild.after(placeholderNode);
        }
    }

    blockSepSelector = this._getBlockSepSelector();

    // Put placeholder nodes between consecutive blocking elements and between
    // blocking elements and normal block-level elements
    $body.find(blockSepSelector).before(placeholderNode);

    blockInListSepSelector = this._getBlockInListSepSelector();
    $blockInList = $body.find(blockInListSepSelector);

    // The $blockInList selection must be iterated over to only add placeholder
    // nodes after blocking elements at the end of a list item rather than all
    // blocking elements in a list. No jQuery selection that is supported on
    // all browsers can do this check, so that is why it must be done by using
    // `each` to iterate over the selection. Note that the handling of the
    // spacing of other blocking elements in a list besides after the last
    // blocking element in a list item is already handled by the
    // blockSepSelector used before this.
    $blockInList.each(function () {
        var $block = jQuery(this);

        if(!$block.next(blockingSelector).length &&
           !$block.next(WYMeditor.BR).length) {

            $block.after(placeholderNode);
        }
    });
};

/**
    editor._getBlockSepSelector
    =============================

    Build a string representing a jquery selector that will find all
    elements which need a spacer <br> before them. This includes all consecutive
    blocking elements and between blocking elements and normal non-blocking
    elements.
*/
WYMeditor.editor.prototype._getBlockSepSelector = function () {
    if (typeof (this._blockSpacersSel) !== 'undefined') {
        return this._blockSpacersSel;
    }

    var blockCombo = [];
    // Consecutive blocking elements need separators
    jQuery.each(WYMeditor.BLOCKING_ELEMENTS, function (indexO, elementO) {
        jQuery.each(WYMeditor.BLOCKING_ELEMENTS, function (indexI, elementI) {
            blockCombo.push(elementO + ' + ' + elementI);
        });
    });

    // A blocking element either followed by or preceeded by a block elements
    // needs separators
    jQuery.each(WYMeditor.BLOCKING_ELEMENTS, function (indexO, elementO) {
        jQuery.each(WYMeditor.NON_BLOCKING_ELEMENTS, function (indexI, elementI) {
            blockCombo.push(elementO + ' + ' + elementI);
            blockCombo.push(elementI + ' + ' + elementO);
        });
    });

    this._blockSpacersSel = blockCombo.join(', ');
    return this._blockSpacersSel;
};

/*
    editor._getBlockInListSepSelector
    ==================================

    Returns a selector for getting all of the block elements in lists
    or sublists. The block elements at the end of lists or sublists should have
    a spacer line break after them in the editor at all times.
*/
WYMeditor.editor.prototype._getBlockInListSepSelector = function () {
    if (typeof (this._blockInListSpacersSel) !== 'undefined') {
        return this._blockInListSpacersSel;
    }

    var blockCombo = [];

    jQuery.each(WYMeditor.LIST_TYPE_ELEMENTS, function (indexO, elementO) {
        jQuery.each(WYMeditor.BLOCKING_ELEMENTS, function (indexI, elementI) {
            blockCombo.push(elementO + ' ' + elementI);
        });
    });

    this._blockInListSpacersSel = blockCombo.join(', ');
    return this._blockInListSpacersSel;
};

/**
    editor.fixDoubleBr
    ==================

    Remove the <br><br> elements that are inserted between
    paragraphs, usually after hitting enter from an existing paragraph.
*/
WYMeditor.editor.prototype.fixDoubleBr = function () {
    var $body = jQuery(this._doc).find('body.wym_iframe'),
        $last_br,

        blockingSelector = WYMeditor.BLOCKING_ELEMENTS.join(', ');

    // Strip consecutive brs unless they're in a pre tag
    $body.children('br + br').filter(':not(pre br)').remove();

    // Also remove any brs between two p's
    $body.find('p + br').next('p').prev('br').remove();

    // Remove brs floating at the end after a p
    $last_br = $body.find('p + br').slice(-1);
    if ($last_br.length > 0) {
        if ($last_br.next().length === 0) {
            $last_br.remove();
        }
    }
};

/**
    editor.dialog
    =============

    Open a dialog box
*/
WYMeditor.editor.prototype.dialog = function (dialogType, dialogFeatures, bodyHtml) {
    var features = dialogFeatures || this._wym._options.dialogFeatures,
        wDialog = window.open('', 'dialog', features),
        sBodyHtml,
        h = WYMeditor.Helper,
        dialogHtml,
        doc;

    if (wDialog) {
        sBodyHtml = "";

        switch (dialogType) {

        case (WYMeditor.DIALOG_LINK):
            sBodyHtml = this._options.dialogLinkHtml;
            break;
        case (WYMeditor.DIALOG_IMAGE):
            sBodyHtml = this._options.dialogImageHtml;
            break;
        case (WYMeditor.DIALOG_TABLE):
            sBodyHtml = this._options.dialogTableHtml;
            break;
        case (WYMeditor.DIALOG_PASTE):
            sBodyHtml = this._options.dialogPasteHtml;
            break;
        case (WYMeditor.PREVIEW):
            sBodyHtml = this._options.dialogPreviewHtml;
            break;
        default:
            sBodyHtml = bodyHtml;
            break;
        }

        // Construct the dialog
        dialogHtml = this._options.dialogHtml;
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.BASE_PATH,
            this._options.basePath
        );
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.DIRECTION,
            this._options.direction
        );
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.CSS_PATH,
            this._options.skinPath + WYMeditor.SKINS_DEFAULT_CSS
        );
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.WYM_PATH,
            this._options.wymPath
        );
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.JQUERY_PATH,
            this._options.jQueryPath
        );
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.DIALOG_TITLE,
            this.encloseString(dialogType)
        );
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.DIALOG_BODY,
            sBodyHtml
        );
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.INDEX,
            this._index
        );

        dialogHtml = this.replaceStrings(dialogHtml);

        doc = wDialog.document;
        doc.write(dialogHtml);
        doc.close();
    }
};

/**
    editor.toggleHtml
    =================

    Show/Hide the HTML textarea.
*/
WYMeditor.editor.prototype.toggleHtml = function () {
    jQuery(this._box).find(this._options.htmlSelector).toggle();
};

WYMeditor.editor.prototype.uniqueStamp = function () {
    var now = new Date();
    return "wym-" + now.getTime();
};

/**
    Paste the given array of paragraph-items at the given range inside the given $container.

    It has already been determined that the paragraph has multiple lines and
    that the container we're pasting to is a block container capable of accepting
    further nested blocks.
*/
WYMeditor.editor.prototype._handleMultilineBlockContainerPaste = function (wym, $container, range, paragraphStrings) {

    var i,
        blockSplitter,
        leftSide,
        rightSide,
        rangeNodeComparison,
        $splitRightParagraph,
        firstParagraphString,
        firstParagraphHtml,
        blockParent,
        blockParentType;


    // Now append all subsequent paragraphs
    $insertAfter = jQuery(blockParent);

    // Just need to split the current container and put new block elements
    // in between
    blockSplitter = 'p';
    if ($container.is('li')) {
        // Instead of creating paragraphs on line breaks, we'll need to create li's
        blockSplitter = 'li';
    }
    // Split the selected element then build and insert the appropriate html
    // This accounts for cases where the start selection is at the
    // start of a node or in the middle of a text node by splitting the
    // text nodes using rangy's splitBoundaries()
    range.splitBoundaries(); // Split any partially-select text nodes
    blockParent = wym.findUp(
        range.startContainer,
        ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li']
    );
    blockParentType = blockParent.tagName;
    leftSide = [];
    rightSide = [];
    jQuery(blockParent).contents().each(function (index, element) {
        // Capture all of the dom nodes to the left and right of our
        // range. We can't remove them in the same step because that
        // loses the selection in webkit

        rangeNodeComparison = range.compareNode(element);
        if (rangeNodeComparison === range.NODE_BEFORE ||
                (rangeNodeComparison === range.NODE_BEFORE_AND_AFTER &&
                 range.startOffset === range.startContainer.length)) {
            // Because of the way splitBoundaries() works, the
            // collapsed selection might appear in the right-most index
            // of the border node, which means it will show up as
            //
            // eg. | is the selection and <> are text node boundaries
            // <foo|><bar>
            //
            // We detect that case by counting any
            // NODE_BEFORE_AND_AFTER result where the offset is at the
            // very end of the node as a member of the left side
            leftSide.push(element);
        } else {
            rightSide.push(element);
        }
    });
    // Now remove all of the left and right nodes
    for (i = 0; i < leftSide.length; i++) {
        jQuery(leftSide[i]).remove();
    }
    for (i = 0; i < rightSide.length; i++) {
        jQuery(rightSide[i]).remove();
    }

    // Rebuild our split nodes and add the inserted content
    if (leftSide.length > 0) {
        // We have left-of-selection content
        // Put the content back inside our blockParent
        jQuery(blockParent).prepend(leftSide);
    }
    if (rightSide.length > 0) {
        // We have right-of-selection content.
        // Split it off in to a node of the same type after our
        // blockParent
        $splitRightParagraph = jQuery('<' + blockParentType + '>' +
            '</' + blockParentType + '>', wym._doc);
        $splitRightParagraph.insertAfter(jQuery(blockParent));
        $splitRightParagraph.append(rightSide);
    }

    // Insert the first paragraph in to the current node, and then
    // start appending subsequent paragraphs
    firstParagraphString = paragraphStrings.splice(
        0,
        1
    )[0];
    firstParagraphHtml = firstParagraphString.split(WYMeditor.NEWLINE).join('<br />');
    jQuery(blockParent).html(jQuery(blockParent).html() + firstParagraphHtml);

    // Now append all subsequent paragraphs
    $insertAfter = jQuery(blockParent);
    for (i = 0; i < paragraphStrings.length; i++) {
        html = '<' + blockSplitter + '>' +
            (paragraphStrings[i].split(WYMeditor.NEWLINE).join('<br />')) +
            '</' + blockSplitter + '>';
        $insertAfter = jQuery(html, wym._doc).insertAfter($insertAfter);
    }
};

/**
    editor.paste
    ============

    Paste text into the editor below the carret, used for "Paste from Word".

    Takes the string to insert as an argument. Two or more newlines separates
    paragraphs. May contain inline HTML.
*/
WYMeditor.editor.prototype.paste = function (str) {
    var container = this.selected(),
        $container,
        html = '',
        paragraphs,
        focusNode,
        i,
        l,
        isSingleLine = false,
        sel,
        textNode,
        wym,
        range,
        insertionNodes;
    wym = this;
    sel = rangy.getIframeSelection(wym._iframe);
    range = sel.getRangeAt(0);
    $container = jQuery(container);

    // Start by collapsing the range to the start of the selection. We're
    // punting on implementing a paste that also replaces existing content for
    // now,
    range.collapse(true); // Collapse to the the begining of the selection

    // Split string into paragraphs by two or more newlines
    paragraphStrings = str.split(new RegExp(WYMeditor.NEWLINE + '{2,}', 'g'));

    if (paragraphStrings.length === 1) {
        // This is a one-line paste, which is an easy case.
        // We try not to wrap these in paragraphs
        isSingleLine = true;
    }

    if (typeof container === 'undefined' ||
            (container && container.tagName.toLowerCase() === WYMeditor.BODY)) {
        // No selection, or body selection. Paste at the end of the document

        if (isSingleLine) {
            // Easy case. Wrap the string in p tags
            paragraphs = jQuery(
                '<p>' + paragraphStrings[0] + '</p>',
                this._doc
            ).appendTo(this._doc.body);
        } else {
            // Need to build paragraphs and insert them at the end
            blockSplitter = 'p';
            for (i = paragraphStrings.length - 1; i >= 0; i -= 1) {
                // Going backwards because rangy.insertNode leaves the
                // selection in front of the inserted node
                html = '<' + blockSplitter + '>' +
                    (paragraphStrings[i].split(WYMeditor.NEWLINE).join('<br />')) +
                    '</' + blockSplitter + '>';
                // Build multiple nodes from the HTML because ie6 chokes
                // creating multiple nodes implicitly via jquery
                insertionNodes = jQuery(html, wym._doc);
                for (j = insertionNodes.length - 1; j >= 0; j--) {
                    // Loop backwards through all of the nodes because
                    // insertNode moves that direction
                    range.insertNode(insertionNodes[j]);
                }
            }
        }
    } else {
        // Pasting inside an existing element
        if (isSingleLine || $container.is('pre')) {
            // Easy case. Insert a text node at the current selection
            textNode = this._doc.createTextNode(str);
            range.insertNode(textNode);
        } else if ($container.is('p,h1,h2,h3,h4,h5,h6,li')) {
            wym._handleMultilineBlockContainerPaste(wym, $container, range, paragraphStrings);
        } else {
            // We're in a container that doesn't accept nested paragraphs (eg. td). Use
            // <br> separators everywhere instead
            textNodesToInsert = str.split(WYMeditor.NEWLINE);
            for (i = textNodesToInsert.length - 1; i >= 0; i -= 1) {
                // Going backwards because rangy.insertNode leaves the
                // selection in front of the inserted node
                textNode = this._doc.createTextNode(textNodesToInsert[i]);
                range.insertNode(textNode);
                if (i > 0) {
                    // Don't insert an opening br
                    range.insertNode(jQuery('<br />', wym._doc).get(0));
                }
            }
        }
    }
};

WYMeditor.editor.prototype.insert = function (html) {
    // Do we have a selection?
    var selection = this._iframe.contentWindow.getSelection(),
        range,
        node;
    if (selection.focusNode !== null) {
        // Overwrite selection with provided html
        range = selection.getRangeAt(0);
        node = range.createContextualFragment(html);
        range.deleteContents();
        range.insertNode(node);
    } else {
        // Fall back to the internal paste function if there's no selection
        this.paste(html);
    }
};

WYMeditor.editor.prototype.wrap = function (left, right) {
    this.insert(
        left + this._iframe.contentWindow.getSelection().toString() + right
    );
};

WYMeditor.editor.prototype.unwrap = function () {
    this.insert(this._iframe.contentWindow.getSelection().toString());
};

WYMeditor.editor.prototype.setFocusToNode = function (node, toStart) {
    var range = this._doc.createRange(),
        selection = this._iframe.contentWindow.getSelection();
    toStart = toStart ? 0 : 1;

    range.selectNodeContents(node);
    selection.addRange(range);
    selection.collapse(node, toStart);
    this._iframe.contentWindow.focus();
};

WYMeditor.editor.prototype.addCssRules = function (doc, aCss) {
    var styles = doc.styleSheets[0],
        i,
        oCss;
    if (styles) {
        for (i = 0; i < aCss.length; i += 1) {
            oCss = aCss[i];
            if (oCss.name && oCss.css) {
                this.addCssRule(styles, oCss);
            }
        }
    }
};

/**
    editor.splitListItemContents
    =============================

    Utility

    Splits a list item into the content that should stay with the li as it is
    indented/outdent and the things that should stay at their current indent level.

    `itemContents` are what a user would consider that list's contents
    `sublistContents` are the sub-items that are nested inside the li
    (basically everything after the first ol/ul inclusive).

    The returned object has `itemContents` and `sublistContents` properties.
*/
WYMeditor.editor.prototype.splitListItemContents = function ($listItem) {
    var $allContents,
        i,
        elmnt,
        hitSublist = false,
        splitObject = {itemContents: [], sublistContents: []};

    $allContents = $listItem.contents();

    for (i = 0; i < $allContents.length; i++) {
        elmnt = $allContents.get(i);
        if (hitSublist || jQuery(elmnt).is('ol,ul')) {
            // We've hit the first sublist. Everything from this point on is
            // considered `sublistContents`
            hitSublist = true;
            splitObject.sublistContents.push(elmnt);
        } else {
            splitObject.itemContents.push(elmnt);
        }
    }

    return splitObject;
};

/**
    editor.joinAdjacentLists
    ========================

    Utility

    Joins two lists if they are adjacent and are of the same type.

    The end result will be `listTwo`s contents being appended to `listOne`
*/
WYMeditor.editor.prototype.joinAdjacentLists = function (listOne, listTwo) {
    var $listTwoContents;

    if (typeof listOne === 'undefined' ||
            typeof listTwo === 'undefined') {
        // Invalid arguments
        return;
    }
    if (listOne.nextSibling !== listTwo ||
            listOne.tagName.toLowerCase() !== listTwo.tagName.toLowerCase()) {
        return;
    }

    $listTwoContents = jQuery(listTwo).contents();
    $listTwoContents.unwrap(); // Kill listTwo
    $listTwoContents.detach();
    jQuery(listOne).append($listTwoContents);
};

/**
    editor._indentSingleItem
    ========================

    Indent a single list item via the dom, ensuring that the selected node moves in
    exactly one level and all other nodes stay at the same level.
 */
WYMeditor.editor.prototype._indentSingleItem = function (listItem) {
    var wym = this,
        $liToIndent,
        listType,
        spacerHtml,
        containerHtml,

        splitContent,
        $itemContents,
        $sublistContents,

        $prevLi,
        $prevSublist,
        $firstSublist,

        $spacer,
        $spacerContents;

    // The algorithm used here is generally:
    // 1. Ensure there's a previous li to put the `liToIndent`.
    // 2. Move the `liToIndent` into a sublist in the previous li.
    // 3. If we added a spacer_li after `liToIndent` remove it and move its
    // contents inside `liToIndent`.

    // For step 2, the sublist to use can either be:
    // 1. An existing sublist of the correct type at the end of the previous li.
    // 2. An existing sublist inside `liToIndent`.
    // 3. A new sublist that we create.

    $liToIndent = jQuery(listItem);
    listType = $liToIndent.parent()[0].tagName.toLowerCase();

    // Separate out the contents into things that should stay with the li as it
    // moves and things that should stay at their current level
    splitContent = wym.splitListItemContents($liToIndent);
    $sublistContents = jQuery(splitContent.sublistContents);
    $itemContents = jQuery(splitContent.itemContents);

    $prevLi = $liToIndent.prev().filter('li');
    // Ensure we actually have a previous li in which to put the `liToIndent`
    if ($prevLi.length === 0) {
        spacerHtml = '<li class="spacer_li"></li>';
        $liToIndent.before(spacerHtml);
        $prevLi = $liToIndent.prev();
    }

    // Move `liToIndent` to a sublist inside its previous sibling li
    $prevSublist = $prevLi.contents().last().filter('ol,ul');
    if ($prevSublist.length > 0) {
        // Case 1: We have a sublist at the appropriate level as a previous
        // sibling. Leave the sublist contents where they are and join the
        // previous sublist

        // Join our node at the end of the target sublist
        $prevSublist.append($liToIndent);

        // Stick all of the sublist contents at the end of the previous li
        $sublistContents.detach();
        $prevLi.append($sublistContents);

        // If we just moved two lists of the same type next to eachother, join
        // them
        $firstSublist = $sublistContents.first();
        wym.joinAdjacentLists($prevSublist.get(0), $firstSublist.get(0));
    } else {
        if ($sublistContents.length > 0) {
            // Case 2: We need to move our existing sublist to the previous li
            $sublistContents.detach();
            $prevLi.append($sublistContents);
            $prevSublist = $sublistContents.first();
        } else {
            // Case 3: Create a spacer sublist in the previous li in which to
            // place `liToIndent`
            containerHtml = '<' + listType + '></' + listType + '>';
            $prevLi.append(containerHtml);
            $prevSublist = $prevLi.contents().last();
        }

        // Move our li to the start of the sublist
        $prevSublist.prepend($liToIndent);
    }

    // If we eliminated the need for a spacer_li, remove it
    if ($liToIndent.next().is('.spacer_li')) {
        $spacer = $liToIndent.next('.spacer_li');
        $spacerContents = $spacer.contents();
        $spacerContents.detach();
        $liToIndent.append($spacerContents);
        $spacer.remove();
    }

};

/**
    editor._outdentSingleItem
    ========================

    Outdent a single list item via the dom, ensuring that the selected node moves in
    exactly one level and all other nodes stay at the same level.
 */
WYMeditor.editor.prototype._outdentSingleItem = function (listItem) {
    var wym = this,
        $liToOutdent,
        listType,
        spacerListHtml,

        splitContent,
        $itemContents,
        $sublistContents,

        $parentLi,
        $parentList,

        $subsequentSiblingContent,
        $subsequentParentListSiblingContent,

        $sublist;

    // The algorithm used here is generally:
    // 1. Gather all subsequent sibling content in `liToIndent`s list along
    // with all subsequent sibling content in `liToIndent`s parent list.
    // 2. Move `liToIndent` after the li whose sublist it's in.
    // 3. Create a sublist of the same type of `liToIndent`s parent list inside
    // `liToIndent`.
    // 4. If `liToIndent` has a sublist, use a spacer_li and list to hold its
    // position inside the new sublist.
    // 5. Append all original subsequent siblings inside the created sublist.
    // 6. Append all of `liToIndent`s original parent list subsequent sibling
    // content after the created sublist.
    // 7. Remove `liToOutdent`'s original parent list and parent li if either
    // are now empty

    $liToOutdent = jQuery(listItem);
    listType = $liToOutdent.parent()[0].tagName.toLowerCase();

    // If this list item isn't already indented at least one level, don't allow
    // outdenting
    if (!$liToOutdent.parent().parent().is('ol,ul,li')) {
        return;
    }
    if (!$liToOutdent.parent().parent().is('li')) {
        // We have invalid list nesting and we need to fix that
        WYMeditor.console.log(
            'Attempting to fix invalid list nesting before outdenting.'
        );
        wym.correctInvalidListNesting(listItem);
    }

    // Separate out the contents into things that should stay with the li as it
    // moves and things that should stay at their current level
    splitContent = wym.splitListItemContents($liToOutdent);
    $sublistContents = jQuery(splitContent.sublistContents);
    $itemContents = jQuery(splitContent.itemContents);

    // Gather subsequent sibling and parent sibling content
    $parentLi = $liToOutdent.parent().parent('li');
    // Invalid HTML could cause this selector to fail, which breaks our logic.
    // Bail out rather than possibly losing content
    if ($parentLi.length === 0) {
        WYMeditor.console.error('Invalid list. No parentLi found, so aborting outdent');
        return;
    }
    $parentList = $liToOutdent.parent();
    $subsequentSiblingContent = $liToOutdent.nextAllContents();
    $subsequentParentListSiblingContent = $parentList.nextAllContents();

    // Move the li to after the parent li
    $liToOutdent.detach();
    $parentLi.after($liToOutdent);

    // If this node has one or more sublists, they will need to be indented
    // by one with a fake parent to hold their previous position
    if ($sublistContents.length > 0) {
        spacerListHtml = '<' + listType + '>' +
            '<li class="spacer_li"></li>' +
            '</' + listType + '>';
        $liToOutdent.append(spacerListHtml);
        $sublist = $liToOutdent.children().last();
        // Add all of the sublistContents inside our new spacer li
        $sublistContents.detach();
        $sublist.children('li').append($sublistContents);
    }

    if ($subsequentSiblingContent.length > 0) {
        // Nest the previously-subsequent items inside the list to
        // retain order and their indent level
        if (typeof $sublist === 'undefined') {
            // Insert a sublist if we don't already have one
            spacerListHtml = '<' + listType + '></' + listType + '>';
            $liToOutdent.append(spacerListHtml);
            $sublist = $liToOutdent.children().last();
        }
        $subsequentSiblingContent.detach();
        $sublist.append($subsequentSiblingContent);
    }

    // If we have a parentItem with content after our parent list
    // eg. <ol>
    //       <li>one
    //         <ul ...>
    //         two
    //         <ul ...>
    //         three
    //       </li>
    //     </ol>
    // we'll need to split that parentItem to retain proper content ordering
    if ($subsequentParentListSiblingContent.length > 0) {
        // Move the subsequent content in to a new list item after our parent li
        $subsequentParentListSiblingContent.detach();

        // If our last content and the first content in the subsequent content
        // are both text nodes, insert a <br /> spacer to avoid crunching the
        // text together visually. This maintains the same "visual" structure.
        if ($liToOutdent.contents().length > 0 &&
                $liToOutdent.contents().last()[0].nodeType === WYMeditor.NODE.TEXT &&
                $subsequentParentListSiblingContent[0].nodeType === WYMeditor.NODE.TEXT) {
            $liToOutdent.append('<br />');
        }

        $liToOutdent.append($subsequentParentListSiblingContent);
    }

    // Remove our parentList if it's empty and if we just removed that, the
    // parentLi is likely to be empty also
    if ($parentList.contents().length === 0) {
        $parentList.remove();
    }
    if ($parentLi.contents().length === 0) {
        $parentLi.remove();
    }
};

/**
    editor.correctInvalidListNesting
    ================================

    Take an li/ol/ul and correct any list nesting issues in the entire list
    tree.

    Corrected lists have the following properties:
    1. ol and ul nodes *only* allow li children.
    2. All li nodes have either an ol or ul parent.

    The `alreadyCorrected` argument is used to indicate if a correction has
    already been made, which means we need to return true even if no further
    corrections are made.

    Returns true if any nodes were corrected.
 */
WYMeditor.editor.prototype.correctInvalidListNesting = function (listItem, alreadyCorrected) {
    // Travel up the dom until we're at the root ol/ul/li
    var currentNode = listItem,
        parentNode,
        tagName;
    if (typeof alreadyCorrected === 'undefined') {
        alreadyCorrected = false;
    }
    if (!currentNode) {
        return alreadyCorrected;
    }
    while (currentNode.parentNode) {
        parentNode = currentNode.parentNode;
        if (parentNode.nodeType !== WYMeditor.NODE.ELEMENT) {
            // Our parent is outside a valid list structure. Stop at this node.
            break;
        }
        tagName = parentNode.tagName.toLowerCase();
        if (tagName !== 'ol' && tagName !== 'ul' && tagName !== 'li') {
            // Our parent is outside a valid list structure. Stop at this node.
            break;

        }
        // We're still traversing up a list structure. Keep going
        currentNode = parentNode;
    }
    // We have the root node. Make sure it's legit
    if (jQuery(currentNode).is('li')) {
        // We have an li as the "root" because its missing a parent list.
        // Correct this problem and then try again to correct the nesting.
        WYMeditor.console.log("Correcting orphaned root li before correcting invalid list nesting.");
        this._correctOrphanedListItem(currentNode);
        return this.correctInvalidListNesting(currentNode, true);
    }
    if (!jQuery(currentNode).is('ol,ul')) {
        WYMeditor.console.error("Can't correct invalid list nesting. No root list found");
        return alreadyCorrected;
    }
    return this._correctInvalidListNesting(currentNode, alreadyCorrected);
};
/**
    editor._correctOrphanedListItem
    ===============================

    Ensure that the given ophaned list item has a proper list parent.

    Uses the sibling nodes to determine what kind of list should be used. Also
    wraps sibling adjacent orphaned li nodes in the same list.
 */
WYMeditor.editor.prototype._correctOrphanedListItem = function (listNode) {
    var prevAdjacentLis,
        nextAdjacentLis,
        $adjacentLis = jQuery(),
        prevList,
        prevNode;

    prevAdjacentLis = jQuery(listNode).prevContentsUntil(':not(li)');
    nextAdjacentLis = jQuery(listNode).nextContentsUntil(':not(li)');

    // Merge the collections together
    $adjacentLis = $adjacentLis.add(prevAdjacentLis);
    $adjacentLis = $adjacentLis.add(listNode);
    $adjacentLis = $adjacentLis.add(nextAdjacentLis);

    // Determine if we have a list node in which to insert all of our orphaned
    // li's
    prevNode = $adjacentLis[0].previousSibling;
    if (prevNode && jQuery(prevNode).is('ol,ul')) {
        prevList = prevNode;
    } else {
        // No previous existing list to use. Need to create one
        $adjacentLis.before('<ol></ol>');
        prevList = $adjacentLis.prev()[0];
    }

    // Insert all of the adjacent orphaned lists inside the new parent
    jQuery(prevList).append($adjacentLis);
};

/**
    editor._correctInvalidListNesting
    ================================

    This is the function that actually does the list correction.
    correctInvalidListNesting is just a helper function that first finds the root
    of the list.

    Returns true if any correction was made.

    We use a reverse preorder traversal to navigate the DOM because we might be:

    * Making nodes children of their previous sibling (in the <ol><li></li><ol>...</ol></ol> case)
    * Adding nodes at the current level (wrapping any non-li node inside a ul/ol in a new li node)

    Adapted from code at: Tavs Dokkedahl from
    http://www.jslab.dk/articles/non.recursive.preorder.traversal.part3
 */
WYMeditor.editor.prototype._correctInvalidListNesting = function (listNode, alreadyCorrected) {
    var rootNode = listNode,
        currentNode = listNode,
        wasCorrected = false,
        previousSibling,
        previousLi,
        $currentNode,
        tagName,
        ancestorNode,
        nodesToMove,
        targetLi,
        lastContentNode,
        spacerHtml = '<li class="spacer_li"></li>';
    if (typeof alreadyCorrected !== 'undefined') {
        wasCorrected = alreadyCorrected;
    }

    while (currentNode) {
        if (currentNode._wym_visited) {
            // This node has already been visited.
            // Remove mark for visited nodes
            currentNode._wym_visited = false;
            // Once we reach the root element again traversal
            // is done and we can break
            if (currentNode === rootNode) {
                break;
            }
            if (currentNode.previousSibling) {
                currentNode = currentNode.previousSibling;
            } else {
                currentNode = currentNode.parentNode;
            }
        } else {
            // This is the first visit for this node

            // All non-li nodes must have an
            // ancestor li node that's closer than any ol/ul ancestor node.
            // Basically, everything needs to be inside an li node.
            if (currentNode !== rootNode && !jQuery(currentNode).is('li')) {
                // We have a non-li node.
                // Ensure that we have an li ancestor before we have any ol/ul
                // ancestors

                ancestorNode = currentNode;
                while (ancestorNode.parentNode) {
                    ancestorNode = ancestorNode.parentNode;
                    if (jQuery(ancestorNode).is('li')) {
                        // Everything is ok. Hit an li before a ol/ul
                        break;
                    }

                    if (ancestorNode.nodeType !== WYMeditor.NODE.ELEMENT) {
                        // Our parent is outside a valid list structure. Stop at this node.
                        break;
                    }
                    tagName = ancestorNode.tagName.toLowerCase();
                    if (tagName === 'ol' || tagName === 'ul') {
                        // We've hit a list container before any list item.
                        // This isn't valid html and causes editing problems.
                        //
                        // Convert the list to a valid structure that closely
                        // mimics the layout and behavior of invalidly nested
                        // content inside a list. The browser treats the
                        // content similar to how it would treat that same
                        // content separated by a <br /> within its previous
                        // sibling list item, so recreate that structure.
                        //
                        // The algorithm for performing this is basically:
                        // 1. Gather this and any previous siblings up until the
                        // previous li (if one exists) as content to move.
                        // 2. If we don't have any previous or subsequent li
                        // sibling, create a spacer li in which to insert all
                        // the gathered content.
                        // 3. Move all of the content to the previous li or the
                        // subsequent li (in that priority).
                        WYMeditor.console.log("Fixing orphaned list content");
                        wasCorrected = true;

                        // Gather this and previous sibling until the previous li
                        nodesToMove = [currentNode];
                        previousSibling = currentNode;
                        targetLi = null;
                        while (previousSibling.previousSibling) {
                            previousSibling = previousSibling.previousSibling;
                            if (jQuery(previousSibling).is('li')) {
                                targetLi = previousSibling;
                                // We hit an li. Store it as the target in
                                // which to move the nodes
                                break;
                            }
                            nodesToMove.push(previousSibling);
                        }

                        // We have our nodes ordered right to left and we need
                        // them left to right
                        nodesToMove.reverse();

                        // If there are no previous siblings, we can join the next li instead
                        if (!targetLi && nodesToMove.length === 1) {
                            if (jQuery(currentNode.nextSibling).is('li')) {
                                targetLi = currentNode.nextSibling;
                            }
                        }

                        // If we still don't have an li in which to move, we
                        // need to create a spacer li
                        if (!targetLi) {
                            jQuery(nodesToMove[0]).before(spacerHtml);
                            targetLi = jQuery(nodesToMove[0]).prev()[0];
                        }

                        // Move all of our content inside the li we've chosen
                        // If the last content node inside the target li is
                        // text and so is the first content node to move, separate them
                        // with a <br /> to preserve the visual layout of them
                        // being on separate lines
                        lastContentNode = jQuery(targetLi).contents().last();
                        if (lastContentNode.length === 1 && lastContentNode[0].nodeType === WYMeditor.NODE.TEXT) {
                            if (nodesToMove[0].nodeType === WYMeditor.NODE.TEXT) {
                                jQuery(targetLi).append('<br />');
                            }
                        }
                        jQuery(targetLi).append(jQuery(nodesToMove));

                        break;

                    }
                    // We're still traversing up a list structure. Keep going
                }
            }

            if (currentNode.lastChild) {
                // Since we have childnodes, mark this as visited because
                // we'll return later
                currentNode._wym_visited = true;
                currentNode = currentNode.lastChild;
            } else if (currentNode.previousSibling) {
                currentNode = currentNode.previousSibling;
            } else {
                currentNode = currentNode.parentNode;
            }
        }
    }

    return wasCorrected;
};

/**
 * Get the common parent ol/ul for the given li nodes. If the closest parent
 * ol/ul for each cell isn't the same, returns null.
 */
WYMeditor.editor.prototype.getCommonParentList = function (listItems) {
    var firstLi,
        parentList,
        rootList;

    listItems = jQuery(listItems).filter('li');
    if (listItems.length === 0) {
        return null;
    }
    firstLi = listItems[0];
    parentList = jQuery(firstLi).parent('ol,ul');

    if (parentList.length === 0) {
        return null;
    }
    rootList = parentList[0];

    // Ensure that all of the li's have the same parent list
    jQuery(listItems).each(function (index, elmnt) {
        parentList = jQuery(elmnt).parent('ol,ul');
        if (parentList.length === 0 || parentList[0] !== rootList) {
            return null;
        }
    });

    return rootList;
};

/**
    editor._getSelectedListItems
    ============================

    Based on the given selection, determine which li nodes are "selected" from
    the user's standpoint. These are the li nodes that they would expect to be
    affected by an action with the given selection.

    Generally, this means any li which has at least some of its text content
    highlighted will be returned.
*/
WYMeditor.editor.prototype._getSelectedListItems = function (sel) {
    var wym = this,
        i,
        range,
        selectedLi,
        nodes = [],
        liNodes = [],
        containsNodeTextFilter,
        parentsToAdd,
        node,
        $node,
        $maybeParentLi;

    // Filter function to remove undesired nodes from what rangy.getNodes()
    // gives
    containsNodeTextFilter = function (testNode) {
        var fullyContainsNodeText;

        // Include any partially-selected textNodes
        if (rangy.dom.isCharacterDataNode(testNode)) {
            return testNode;
        }

        try {
            fullyContainsNodeText = range.containsNodeText(testNode);
        } catch (e) {
            // Rangy throws an exception on an internal
            // intersection call on the last node that's
            // actually in the selection
            return true;
        }

        if (fullyContainsNodeText === true) {
            // If we fully contain any text in this node, it's definitely
            // selected
            return true;
        }
    };

    // Iterate through all of the selection ranges and include any li nodes
    // that are user-selected in each range
    for (i = 0; i < sel.rangeCount; i++) {
        range = sel.getRangeAt(i);
        if (range.collapsed === true) {
            // Collapsed ranges don't return the range they're in as part of
            // getNodes, so let's find the next list item up
            selectedLi = wym.findUp(range.startContainer, 'li');
            if (selectedLi) {
                nodes = nodes.concat([selectedLi]);
            }
        } else {
            // getNodes includes the parent list item whenever we have our
            // selection in a sublist. We need to make a distinction between
            // when the parent list item is actually selected and when it's
            // only sort of selected because we're selecting a sub-item
            // (meaning it's partially selected).
            // In the following case, we don't want `2` as one of our nodes:
            // 1
            // 2
            //   2.1
            //   2|.2
            // 3|
            nodes = nodes.concat(
                range.getNodes(
                    [],
                    containsNodeTextFilter
                )
            );

            // We also need to include the parent li if we selected a non-li, non-list node.
            // eg. if we select text inside an li, the user is actually
            // selecting that entire li
            parentsToAdd = [];
            for (j = 0; j < nodes.length; j++) {
                node = nodes[j];
                if (!jQuery(node).is('li,ol,ul')) {
                    // Crawl up the dom until we find an li
                    while (node.parentNode) {
                        node = node.parentNode;
                        if (jQuery(node).is('li')) {
                            parentsToAdd.push(node);
                            break;
                        }
                    }
                }
            }
            // Add in all of the new parents if they're not already included
            // (no duplicates)
            for (j = 0; j < parentsToAdd.length; j++) {
                if (jQuery.inArray(parentsToAdd[j], nodes) === -1) {
                    nodes.push(parentsToAdd[j]);
                }
            }


        }
    }

    // Filter out the non-li nodes
    for (i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType === WYMeditor.NODE.ELEMENT &&
                nodes[i].tagName.toLowerCase() === WYMeditor.LI) {
            liNodes.push(nodes[i]);
        }
    }

    return liNodes;
};


/**
    editor.indent
    =============

    Indent the selected list items via the dom.

    Only list items that have a common list will be indented.
 */
WYMeditor.editor.prototype.indent = function () {
    var wym = this._wym,
        sel = rangy.getIframeSelection(this._iframe),
        listItems,
        rootList,
        manipulationFunc;

    // First, make sure this list is properly structured
    manipulationFunc = function () {
        var selectedBlock = wym.selected(),
            potentialListBlock = wym.findUp(
                selectedBlock,
                ['ol', 'ul', 'li']
            );
        return wym.correctInvalidListNesting(potentialListBlock);
    };
    if (wym.restoreSelectionAfterManipulation(manipulationFunc)) {
        // We actually made some list correction
        // Don't actually perform the action if we've potentially just changed
        // the list, and maybe the list appearance as a result.
        return true;
    }

    // We just changed and restored the selection when possibly correcting the
    // lists
    sel = rangy.getIframeSelection(this._iframe);

    // Gather the li nodes the user means to affect based on their current
    // selection
    listItems = wym._getSelectedListItems(sel);

    if (listItems.length === 0) {
        return false;
    }

    // If the selection is across paragraphs and other items at the root level,
    // don't indent
    rootList = wym.getCommonParentList(listItems);
    if (rootList === null) {
        return false;
    }

    manipulationFunc = function () {
        var domChanged = false;

        for (i = 0; i < listItems.length; i++) {
            wym._indentSingleItem(listItems[i]);
            domChanged = true;
        }

        return domChanged;
    };
    return wym.restoreSelectionAfterManipulation(manipulationFunc);
};

/**
    editor.outdent
    ==============

    Outdent a list item, accounting for firefox bugs to ensure consistent
    behavior and valid HTML.
*/
WYMeditor.editor.prototype.outdent = function () {
    var wym = this._wym,
        sel = rangy.getIframeSelection(this._iframe),
        listItems,
        rootList,
        manipulationFunc;

    // First, make sure this list is properly structured
    manipulationFunc = function () {
        var selectedBlock = wym.selected(),
            potentialListBlock = wym.findUp(
                selectedBlock,
                ['ol', 'ul', 'li']
            );
        return wym.correctInvalidListNesting(potentialListBlock);
    };
    if (wym.restoreSelectionAfterManipulation(manipulationFunc)) {
        // We actually made some list correction
        // Don't actually perform the action if we've potentially just changed
        // the list, and maybe the list appearance as a result.
        return true;
    }

    // We just changed and restored the selection when possibly correcting the
    // lists
    sel = rangy.getIframeSelection(this._iframe);

    // Gather the li nodes the user means to affect based on their current
    // selection
    listItems = wym._getSelectedListItems(sel);

    if (listItems.length === 0) {
        return false;
    }

    // If the selection is across paragraphs and other items at the root level,
    // don't indent
    rootList = wym.getCommonParentList(listItems);
    if (rootList === null) {
        return false;
    }

    manipulationFunc = function () {
        var domChanged = false;

        for (i = 0; i < listItems.length; i++) {
            wym._outdentSingleItem(listItems[i]);
            domChanged = true;
        }

        return domChanged;
    };
    return wym.restoreSelectionAfterManipulation(manipulationFunc);
};

/**
    editor.restoreSelectionAfterManipulation
    ========================================

    A helper function to ensure that the selection is restored to the same
    location after a potentially-complicated dom manipulation is performed. This
    also handles the case where the dom manipulation throws and error by cleaning
    up any selection markers that were added to the dom.

    `manipulationFunc` is a function that takes no arguments and performs the
    manipulation. It should return `true` if changes were made that could have
    potentially destroyed the selection.
*/
WYMeditor.editor.prototype.restoreSelectionAfterManipulation = function (manipulationFunc) {
    var sel = rangy.getIframeSelection(this._iframe),
        savedSelection = rangy.saveSelection(rangy.dom.getIframeWindow(this._iframe)),
        changesMade = true;

    // If something goes wrong, we don't want to leave selection markers
    // floating around
    try {
        changesMade = manipulationFunc();
        if (changesMade) {
            rangy.restoreSelection(savedSelection);
        } else {
            rangy.removeMarkers(savedSelection);
        }
    } catch (e) {
        WYMeditor.console.error("Error during manipulation");
        WYMeditor.console.error(e);
        rangy.removeMarkers(savedSelection);
    }

    return changesMade;
};

/**
    editor.insertOrderedlist
    =========================

    Convert the selected block in to an ordered list.

    If the selection is already inside a list, switch the type of the nearest
    parent list to an `<ol>`. If the selection is in a block element that can be a
    valid list, place that block element's contents inside an ordered list.

    Pure dom implementation consistently cross-browser implementation of
    `execCommand(InsertOrderedList)`.
 */
WYMeditor.editor.prototype.insertOrderedlist = function () {
    var wym = this,
        manipulationFunc;

    // First, make sure this list is properly structured
    manipulationFunc = function () {
        var selectedBlock = wym.selected(),
            potentialListBlock = wym.findUp(
                selectedBlock,
                ['ol', 'ul', 'li']
            );
        return wym.correctInvalidListNesting(potentialListBlock);
    };
    if (wym.restoreSelectionAfterManipulation(manipulationFunc)) {
        // We actually made some list correction
        // Don't actually perform the action if we've potentially just changed
        // the list, and maybe the list appearance as a result.
        return true;
    }

    // Actually perform the list insertion
    manipulationFunc = function () {
        return wym._insertList('ol');
    };

    return wym.restoreSelectionAfterManipulation(manipulationFunc);
};

/**
    editor.insertUnorderedlist
    =========================

    Convert the selected block in to an unordered list.

    Exactly the same as `editor.insert_orderedlist` except with `<ol>` instead.

    Pure dom implementation consistently cross-browser implementation of
    `execCommand(InsertUnorderedList)`.
 */
WYMeditor.editor.prototype.insertUnorderedlist = function () {
    var wym = this,
        manipulationFunc;

    // First, make sure this list is properly structured
    manipulationFunc = function () {
        var selectedBlock = wym.selected(),
            potentialListBlock = wym.findUp(
                selectedBlock,
                ['ol', 'ul', 'li']
            );
        return wym.correctInvalidListNesting(potentialListBlock);
    };
    if (wym.restoreSelectionAfterManipulation(manipulationFunc)) {
        // We actually made some list correction
        // Don't actually perform the action if we've potentially just changed
        // the list, and maybe the list appearance as a result.
        return true;
    }

    // Actually perform the list insertion
    manipulationFunc = function () {
        return wym._insertList('ul');
    };

    return wym.restoreSelectionAfterManipulation(manipulationFunc);
};

/**
    editor._insertList
    =========================

    Convert the selected block in to the specified type of list.

    If the selection is already inside a list, switch the type of the nearest
    parent list to an `<ol>`. If the selection is in a block element that can be a
    valid list, place that block element's contents inside an ordered list.

    Returns `true` if a change was made, `false` otherwise.
 */
WYMeditor.editor.prototype._insertList = function (listType) {
    var wym = this._wym,
        sel = rangy.getIframeSelection(this._iframe),
        listItems,
        rootList,
        selectedBlock,
        potentialListBlock;

    listItems = wym._getSelectedListItems(sel);

    // If we've selected some list items all in the same list, we want to
    // change the type of that list.
    if (listItems.length !== 0) {
        // If the selection is across paragraphs and other items at the root level,
        // don't indent
        rootList = wym.getCommonParentList(listItems);
        if (rootList) {
            this._changeListType(rootList, listType);
            return true;
        } else {
            // We have a selection across multiple root-level lists. Punt on
            // this case for now.
            // TODO: Handle multiple root-level lists properly
            return false;
        }

    }

    // If we've selected a block-level item that's appropriate to convert in to a list,
    // convert it.
    selectedBlock = this.selected();
    potentialListBlock = this.findUp(selectedBlock, WYMeditor.POTENTIAL_LIST_ELEMENTS);
    if (potentialListBlock) {
        this._convertToList(potentialListBlock, listType);
        return true;
    }

    // The user has something selected that wouldn't be a valid list
    return false;
};

WYMeditor.editor.prototype._changeListType = function (list, listType) {
    // Wrap the contents in a new list of `listType` and remove the old list
    // container.
    return WYMeditor.changeNodeType(list, listType);
};

WYMeditor.editor.prototype._convertToList = function (blockElement, listType) {
    var $blockElement = jQuery(blockElement),
        newListHtml,
        $newList;

    // ie6 doesn't support calling wrapInner with a dom node. Build html
    newListHtml = '<' + listType + '><li></li></' + listType + '>';

    if (this.findUp(blockElement, WYMeditor.MAIN_CONTAINERS) === blockElement) {
        // This is a main container block, so we can just replace it with the
        // list structure
        $blockElement.wrapInner(newListHtml);
        $newList = $blockElement.children();
        $newList.unwrap();

        return $newList.get(0);
    }
    // We're converting a block that's not a main container, so we need to nest
    // this list around its contents and NOT remove the container (eg. a td
    // node).
    $blockElement.wrapInner(newListHtml);
    $newList = $blockElement.children();

    return $newList.get(0);
};

/**
     editor.insertTable
     ==================

     Insert a table at the current selection with the given number of rows
     and columns and with the given caption and summary text.
*/
WYMeditor.editor.prototype.insertTable = function (rows, columns, caption, summary) {
    if ((rows <= 0) || (columns <= 0)) {
        // We need rows and columns to make a table

        // TODO: It seems to me we should warn the user when zero columns and/or
        // rows were entered.
        return;
    }

    var table = this._doc.createElement(WYMeditor.TABLE),
        newRow = null,
        newCol = null,
        newCaption,

        x,
        y,
        container,
        selectedNode;

    // Create the table caption
    newCaption = table.createCaption();
    newCaption.innerHTML = caption;

    // Create the rows and cells
    for (x = 0; x < rows; x += 1) {
        newRow = table.insertRow(x);
        for (y = 0; y < columns; y += 1) {
            newRow.insertCell(y);
        }
    }

    if (summary !== "") {
        // Only need to set the summary if we actually have a summary
        jQuery(table).attr('summary', summary);
    }

    // Find the currently-selected container
    container = jQuery(
        this.findUp(this.container(), WYMeditor.POTENTIAL_TABLE_INSERT_ELEMENTS)
    ).get(0);

    if (!container || !container.parentNode) {
        // No valid selected container. Put the table at the end.
        jQuery(this._doc.body).append(table);

    } else if (jQuery.inArray(container.nodeName.toLowerCase(),
                       WYMeditor.INLINE_TABLE_INSERTION_ELEMENTS) > -1) {
        // Insert table after selection if container is allowed to have tables
        // inserted inline.
        selectedNode = this.selection().focusNode;

        // If the selection is within a table, move the selection to the parent
        // table to avoid nesting the tables.
        if (jQuery.inArray(selectedNode.nodeName.toLowerCase(),
                           WYMeditor.SELECTABLE_TABLE_ELEMENTS) > -1 ||
            jQuery.inArray(selectedNode.parentNode.nodeName.toLowerCase(),
                           WYMeditor.SELECTABLE_TABLE_ELEMENTS) > -1) {

            while (selectedNode.nodeName.toLowerCase() !== WYMeditor.TABLE) {
                selectedNode = selectedNode.parentNode;
            }
        }

        // If the list item itself is selected, append the table to it. If the
        // selection is within the list item, put the table after it. Either
        // way, this ensures the table will always be inserted within the list
        // item.
        if (selectedNode.nodeName.toLowerCase() === WYMeditor.LI) {
            jQuery(selectedNode).append(table);
        } else {
            jQuery(selectedNode).after(table);
        }

    } else {
        // If the table is not allowed to be inserted inline with the
        // container, insert it after the container.
        jQuery(container).after(table);
    }

    // Handle any browser-specific cleanup
    this.afterInsertTable(table);
    this.fixBodyHtml();

    return table;
};

/**
    editor.afterInsertTable
    =======================

    Handle cleanup/normalization after inserting a table. Different browsers
    need slightly different tweaks.
*/
WYMeditor.editor.prototype.afterInsertTable = function (table) {};

WYMeditor.editor.prototype.configureEditorUsingRawCss = function () {
    var CssParser = new WYMeditor.WymCssParser();
    if (this._options.stylesheet) {
        CssParser.parse(
            jQuery.ajax({
                url: this._options.stylesheet,
                async: false
            }).responseText
        );
    } else {
        CssParser.parse(this._options.styles, false);
    }

    if (this._options.classesItems.length === 0) {
        this._options.classesItems = CssParser.css_settings.classesItems;
    }
    if (this._options.editorStyles.length === 0) {
        this._options.editorStyles = CssParser.css_settings.editorStyles;
    }
    if (this._options.dialogStyles.length === 0) {
        this._options.dialogStyles = CssParser.css_settings.dialogStyles;
    }
};

WYMeditor.editor.prototype.listen = function () {
    var wym = this;

    // Don't use jQuery.find() on the iframe body
    // because of MSIE + jQuery + expando issue (#JQ1143)

    jQuery(this._doc.body).bind("mousedown", function (e) {
        wym.mousedown(e);
    });
};

WYMeditor.editor.prototype.mousedown = function (evt) {
    // Store the selected image if we clicked an <img> tag
    this._selected_image = null;
    if (evt.target.tagName.toLowerCase() === WYMeditor.IMG) {
        this._selected_image = evt.target;
    }
};

/**
    WYMeditor.loadCss
    =================

    Load a stylesheet in the document.

    href - The CSS path.
*/
WYMeditor.loadCss = function (href) {
    var link = document.createElement('link'),
        head;
    link.rel = 'stylesheet';
    link.href = href;

    head = jQuery('head').get(0);
    head.appendChild(link);
};

/**
    WYMeditor.editor.loadSkin
    =========================

    Load the skin CSS and initialization script (if needed).
*/
WYMeditor.editor.prototype.loadSkin = function () {
    // Does the user want to automatically load the CSS (default: yes)?
    // We also test if it hasn't been already loaded by another instance
    // see below for a better (second) test
    if (this._options.loadSkin && !WYMeditor.SKINS[this._options.skin]) {
        // Check if it hasn't been already loaded so we don't load it more
        // than once (we check the existing <link> elements)
        var found = false,
            rExp = new RegExp(this._options.skin +
                '\/' + WYMeditor.SKINS_DEFAULT_CSS + '$');

        jQuery('link').each(function () {
            if (this.href.match(rExp)) {
                found = true;
            }
        });

        // Load it, using the skin path
        if (!found) {
            WYMeditor.loadCss(
                this._options.skinPath + WYMeditor.SKINS_DEFAULT_CSS
            );
        }
    }

    // Put the classname (ex. wym_skin_default) on wym_box
    jQuery(this._box).addClass("wym_skin_" + this._options.skin);

    // Does the user want to use some JS to initialize the skin (default: yes)?
    // Also check if it hasn't already been loaded by another instance
    if (this._options.initSkin && !WYMeditor.SKINS[this._options.skin]) {
        eval(jQuery.ajax({url: this._options.skinPath +
            WYMeditor.SKINS_DEFAULT_JS, async: false}).responseText);
    }

    // Init the skin, if needed
    if (WYMeditor.SKINS[this._options.skin] && WYMeditor.SKINS[this._options.skin].init) {
        WYMeditor.SKINS[this._options.skin].init(this);
    }
};
