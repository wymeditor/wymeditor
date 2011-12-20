/*jslint evil: true */

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
    } else if (jQuery.browser.safari) {
        WymClass = new WYMeditor.WymClassSafari(this);
    }

    if (WymClass === false) {
        return;
    }

    if (jQuery.isFunction(this._options.preInit)) {
        this._options.preInit(this);
    }

    SaxListener = new WYMeditor.XhtmlSaxListener();
    jQuery.extend(SaxListener, WymClass);
    this.parser = new WYMeditor.XhtmlParser(SaxListener);

    if (this._options.styles || this._options.stylesheet) {
        this.configureEditorUsingRawCss();
    }

    this.helper = new WYMeditor.XmlHelper();

    // Extend the editor object with the browser-specific version.
    // We're not using jQuery.extend because we *want* to copy properties via
    // the prototype chain
    for (prop in WymClass) {
        /*jslint forin: true */
        // Explicitly not using hasOwnProperty for the inheritance here
        // because we want to go up the prototype chain to get all of the
        // browser-specific editor methods. This is kind of a code smell,
        // but works just fine.
        this[prop] = WymClass[prop];
    }

    // Load wymbox
    this._box = jQuery(this._element).
        hide().
        after(this._options.boxHtml).
        next().
        addClass('wym_box_' + this._index);

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
    WYMeditor.editor.html
    =====================

    Get or set the wymbox html value.
*/
WYMeditor.editor.prototype.html = function (html) {
    if (typeof html === 'string') {
        jQuery(this._doc.body).html(html);
        this.update();
    } else {
        return jQuery(this._doc.body).html();
    }
};

/**
    WYMeditor.editor.xhtml
    ======================

    Take the current editor's DOM and apply strict xhtml nesting rules to
    enforce a valid, well-formed, semantic xhtml result.
*/
WYMeditor.editor.prototype.xhtml = function () {
    var html;

    // Remove any of the placeholder nodes we've created for start/end content
    // insertion
    jQuery(this._doc.body).children(WYMeditor.BR).remove();

    return this.parser.parse(this.html());
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
        node = sel.focusNode;

    if (node) {
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

    $.each(sel.getAllRanges(), function () {
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

    $.each(sel.getAllRanges(), function () {
        $.each(this.getNodes(), function () {
            if ($(this).is(selector)) {
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
    var $matches = $([]),
        $selected = $(this.selected());
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
            this.switchTo(container, sType);
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

    Switch the type of the given `node` to type `sType`
*/
WYMeditor.editor.prototype.switchTo = function (node, sType) {
    var newNode = this._doc.createElement(sType),
        html = jQuery(node).html();

    node.parentNode.replaceChild(newNode, node);
    jQuery(newNode).html(html);

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

    // Dirty fix to remove stray line breaks (#189)
    jQuery(this._doc.body).children(WYMeditor.BR).remove();

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
    this.fixDoubleBr();
    this.spaceBlockingElements();
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

        $body = $(this._doc).find('body.wym_iframe'),
        children = $body.children(),
        placeholderNode = '<br _moz_editor_bogus_node="TRUE" _moz_dirty="">',
        $firstChild,
        $lastChild,
        blockSepSelector;

    // Make sure that we still have a bogus node at both the begining and end
    if (children.length > 0) {
        $firstChild = $(children[0]);
        $lastChild = $(children[children.length - 1]);

        if ($firstChild.is(blockingSelector)) {
            $firstChild.before(placeholderNode);
        }

        if ($lastChild.is(blockingSelector)) {
            $lastChild.after(placeholderNode);
        }
    }

    blockSepSelector = this._getBlockSepSelector();

    // Put placeholder nodes between consecutive blocking elements and between
    // blocking elements and normal block-level elements
    $body.find(blockSepSelector).before(placeholderNode);
};

/**
    editor._buildBlockSepSelector
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
    $.each(WYMeditor.BLOCKING_ELEMENTS, function (indexO, elementO) {
        $.each(WYMeditor.BLOCKING_ELEMENTS, function (indexI, elementI) {
            blockCombo.push(elementO + ' + ' + elementI);
        });
    });

    // A blocking element either followed by or preceeded by a block elements
    // needs separators
    $.each(WYMeditor.BLOCKING_ELEMENTS, function (indexO, elementO) {
        $.each(WYMeditor.NON_BLOCKING_ELEMENTS, function (indexI, elementI) {
            blockCombo.push(elementO + ' + ' + elementI);
            blockCombo.push(elementI + ' + ' + elementO);
        });
    });
    this._blockSpacersSel = blockCombo.join(', ');
    return this._blockSpacersSel;
};

/**
    editor.fixDoubleBr
    ==================

    Remove the <br><br> elements that are inserted between
    paragraphs, usually after hitting enter from an existing paragraph.
*/
WYMeditor.editor.prototype.fixDoubleBr = function () {
    var $body = $(this._doc).find('body.wym_iframe'),
        $last_br;
    // Strip consecutive brs unless they're in a a pre tag
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
    $insertAfter = $(blockParent);

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
    $(blockParent).contents().each(function (index, element) {
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
        $(leftSide[i]).remove();
    }
    for (i = 0; i < rightSide.length; i++) {
        $(rightSide[i]).remove();
    }

    // Rebuild our split nodes and add the inserted content
    if (leftSide.length > 0) {
        // We have left-of-selection content
        // Put the content back inside our blockParent
        $(blockParent).prepend(leftSide);
    }
    if (rightSide.length > 0) {
        // We have right-of-selection content.
        // Split it off in to a node of the same type after our
        // blockParent
        $splitRightParagraph = $('<' + blockParentType + '>' +
            '</' + blockParentType + '>', wym._doc);
        $splitRightParagraph.insertAfter($(blockParent));
        $splitRightParagraph.append(rightSide);
    }

    // Insert the first paragraph in to the current node, and then
    // start appending subsequent paragraphs
    firstParagraphString = paragraphStrings.splice(
        0,
        1
    )[0];
    firstParagraphHtml = firstParagraphString.split(WYMeditor.NEWLINE).join('<br />');
    $(blockParent).html($(blockParent).html() + firstParagraphHtml);

    // Now append all subsequent paragraphs
    $insertAfter = $(blockParent);
    for (i = 0; i < paragraphStrings.length; i++) {
        html = '<' + blockSplitter + '>' +
            (paragraphStrings[i].split(WYMeditor.NEWLINE).join('<br />')) +
            '</' + blockSplitter + '>';
        $insertAfter = $(html, wym._doc).insertAfter($insertAfter);
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
        range;
    wym = this;
    sel = rangy.getIframeSelection(wym._iframe);
    range = sel.getRangeAt(0);
    $container = $(container);

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
                var insertionNodes = $(html, wym._doc);
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
                    range.insertNode($('<br />', wym._doc).get(0));
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

WYMeditor.editor.prototype._canIndent = function (focusNode, anchorNode) {
    // Ensure that we're indenting exactly one list item

    if (focusNode && focusNode === anchorNode &&
            focusNode.tagName.toLowerCase() === WYMeditor.LI) {
        // This is a single li tag

        var ancestor = focusNode.parentNode.parentNode;

        if (focusNode.parentNode.childNodes.length > 1 ||
                ancestor.tagName.toLowerCase() === WYMeditor.OL ||
                ancestor.tagName.toLowerCase() === WYMeditor.UL ||
                ancestor.tagName.toLowerCase() === WYMeditor.LI) {

            return true;
        }
    }

    return false;
};

WYMeditor.editor.prototype._canOutdent = function (focusNode, anchorNode) {
    // Ensure that we're indenting exactly one list item and it's already
    // indented at least one level

    if (focusNode && focusNode === anchorNode &&
            focusNode.tagName.toLowerCase() === WYMeditor.LI) {
        // This is a single li tag

        var ancestor = focusNode.parentNode.parentNode;

        if (focusNode.parentNode.childNodes.length > 1 ||
                ancestor.tagName.toLowerCase() === WYMeditor.OL ||
                ancestor.tagName.toLowerCase() === WYMeditor.UL ||
                ancestor.tagName.toLowerCase() === WYMeditor.LI) {

            // This is a nested list. Now ensure that's already indented
            // at least one level
            if ($(ancestor).parent().is('ol,ul,li')) {
                return true;
            }
        }
    }

    return false;
};

/**
    editor.indent
    =============

    Indent a list item via the dom, ensuring that the selected node moves in
    exactly one level and all other nodes stay at the same level.
 */
WYMeditor.editor.prototype.indent = function () {
    var focusNode = this.selected(),
        sel = rangy.getIframeSelection(this._iframe),
        startContainer = sel.getRangeAt(0).startContainer,
        startOffset = sel.getRangeAt(0).startOffset,
        anchorNode = sel.anchorNode,

        $spacerList,
        $prevList,
        $listContents,

        $focusNode,
        listType,
        itemContents,
        spacerHtml,

        $prevLi,
        $prevSubList,
        $children,

        $sublistContents,

        containerHtml,

        $contents,

        $maybeListSpacer,
        $maybePreviousSublist,

        $nextSublist,

        $spacer,
        $spacerContents,

        iframeWin,
        range;

    focusNode = this.findUp(focusNode, WYMeditor.BLOCKS);
    anchorNode = this.findUp(anchorNode, WYMeditor.BLOCKS);

    if (!this._canIndent(focusNode, anchorNode)) {
        return;
    }

    $focusNode = $(focusNode);
    listType = $focusNode.parent()[0].tagName.toLowerCase();

    // Extract any non-list children so they can be inserted
    // back in the list item after it is moved
    itemContents = $focusNode.contents().not('ol,ul');

    if ($focusNode.prev().length === 0 && $focusNode.parent().not('ul,ol,li')) {
        // First item at the root level of a list
        // Going to need a spacer list item
        spacerHtml = '<li class="spacer_li">' +
            '<' + listType + '></' + listType + '>' +
            '</li>';
        $focusNode.before(spacerHtml);
        $spacerList = $focusNode.prev().find(listType);
        $focusNode.children().unwrap();
        $spacerList.append($focusNode);

    } else if ($focusNode.prev().contents().last().is(listType)) {
        // We have a sublist at the appropriate level as a previous sibling.
        // Leave the children where they are and join the previous sublist
        $prevLi = $focusNode.prev();
        $prevSubList = $prevLi.contents().last();
        $children = $focusNode.children();
        $children.unwrap();
        // Join our node at the end of the target sublist
        $prevSubList.append($focusNode);

        // Stick all of the children at the end of the previous li
        $children.detach();
        $prevLi.append($children);
        // If the first child is of the same list type, join them
        if ($children.first().is(listType)) {
            $sublistContents = $children.first().children();
            $sublistContents.unwrap();
            $sublistContents.detach();
            $prevSubList.append($sublistContents);
        }
    } else if ($focusNode.children('ol,ul').length === 0) {
        // No sublist to join.
        // Leave the children where they are and join the previous list
        $prevList = $focusNode.prev().filter('li');
        $focusNode.children().unwrap();
        containerHtml = '<' + listType + '></' + listType + '>';
        $prevList.append(containerHtml);
        $prevList.children(listType).last().append($focusNode);
    } else {
        // We have a sublist to join, so just jump to the front there and leave
        // the children where they are
        $contents = $focusNode.contents().unwrap();
        $contents.wrapAll('<li class="spacer_li"></li>');
        $contents.filter('ol,ul').first().prepend($focusNode);
    }

    // Put the non-list content back inside the li
    $focusNode.prepend(itemContents);

    // If we just created lists next to eachother, join them
    $maybeListSpacer = $focusNode.parent().parent('li.spacer_li');
    if ($maybeListSpacer.length === 1) {
        $maybePreviousSublist = $maybeListSpacer.prev().filter('li').contents().last();
        if ($maybePreviousSublist.is(listType)) {
            // The last child (including text nodes) of the previous li is the
            // same type of list that we just had to wrap in a listSpacer.
            // Join them.
            $listContents = $focusNode.parent().contents();
            $maybeListSpacer.detach();
            $maybePreviousSublist.append($listContents);
        } else if ($maybeListSpacer.next('li').contents().first().is(listType)) {
            // The first child (including text nodes) of the next li is the same
            // type of list we just wrapped in a listSpacer. Join them.
            $nextSublist = $maybeListSpacer.next('li').children().first();
            $listContents = $focusNode.parent().contents();
            $maybeListSpacer.detach();
            $nextSublist.prepend($listContents);
        } else if ($maybeListSpacer.prev().is('li')) {
            // There is a normal li before our spacer, but it doesn't have
            // a proper sublist. Just join their contents
            $prevList = $maybeListSpacer.prev();
            $maybeListSpacer.detach();
            $prevList.append($maybeListSpacer.contents());
        }
    }

    // If we eliminated the need for a spacer_li, remove it
    if ($focusNode.next().is('.spacer_li')) {
        $spacer = $focusNode.next('.spacer_li');
        $spacerContents = $spacer.contents();
        $spacerContents.detach();
        $focusNode.append($spacerContents);
        $spacer.remove();
    }

    // Put the selection back on the li element
    iframeWin = this._iframe.contentWindow;
    sel = rangy.getSelection(iframeWin);

    range = rangy.createRange(this._doc);
    range.setStart(startContainer, startOffset);
    range.setEnd(startContainer, startOffset);
    range.collapse(false);

    sel.setSingleRange(range);

};

/**
    editor.outdent
    ==============

    Outdent a list item, accounting for firefox bugs to ensure consistent
    behavior and valid HTML.
*/
WYMeditor.editor.prototype.outdent = function () {
    var focusNode = this.selected(),
        sel = rangy.getIframeSelection(this._iframe),
        startContainer = sel.getRangeAt(0).startContainer,
        startOffset = sel.getRangeAt(0).startOffset,
        anchorNode = sel.anchorNode,
        $focusNode,
        $parentItem,
        listType,

        $subsequentItems,
        $childLists,

        $sublist,
        $maybeConsecutiveLists,

        iframeWin,
        range;

    focusNode = this.findUp(focusNode, WYMeditor.BLOCKS);
    anchorNode = this.findUp(anchorNode, WYMeditor.BLOCKS);

    if (!this._canOutdent(focusNode, anchorNode)) {
        return;
    }

    $focusNode = $(focusNode);
    // This item is in a sublist. Firefox doesn't properly dedent this
    // as it's own item, instead it just tacks its content to the end of
    // the parent item after the sublist

    $parentItem = $focusNode.parent().parent('li');
    listType = $focusNode.parent()[0].tagName.toLowerCase();

    // If this li has li's following, those will need to be moved as
    // sublist elements after the outdent
    $subsequentItems = $focusNode.nextAll('li');

    $focusNode.detach();
    $parentItem.after($focusNode);

    // If this node has one or more sublist, they will need to be indented
    // by one with a fake parent to hold their previous position
    $childLists = $focusNode.children('ol,ul');
    if ($childLists.length > 0) {
        $childLists.each(function (index, childList) {
            var $childList = $(childList),
                spacerListHtml;
            $childList.detach();

            spacerListHtml = '<' + listType + '>' +
                '<li class="spacer_li"></li>' +
                '</' + listType + '>';
            $focusNode.append(spacerListHtml);
            $focusNode.children(listType).last().children('li').append($childList);
        });
    }

    if ($subsequentItems.length > 0) {
        // Nest the previously-subsequent items inside the list to
        // retain order and their indent level
        $sublist = $subsequentItems;
        $sublist.detach();

        $focusNode.append("<" + listType + "></" + listType + ">");
        $focusNode.find(listType).last().append($subsequentItems);

        // If we just created lists next to eachother, join them
        $maybeConsecutiveLists = $focusNode
            .children(listType + ' + ' + listType);
        if ($maybeConsecutiveLists.length > 0) {
            // Join the same-type adjacent lists we found
            $maybeConsecutiveLists.each(function (index, list) {
                var $list = $(list),
                    $listContents = $list.contents(),
                    $prevList = $list.prev();

                $listContents.detach();
                $list.remove();
                $prevList.append($listContents);
            });
        }
    }

    // Remove any now-empty lists
    $parentItem.find('ul:empty,ol:empty').remove();

    // If we eliminated the need for a spacer_li, remove it
    // Comes after empty list removal so that we only remove
    // totally empty spacer li's
    if ($parentItem.is('.spacer_li') && $parentItem.is(':empty')) {
        $parentItem.remove();
    }

    // Put the selection back on the li element
    iframeWin = this._iframe.contentWindow;
    sel = rangy.getSelection(iframeWin);

    range = rangy.createRange(this._doc);
    range.setStart(startContainer, startOffset);
    range.setEnd(startContainer, startOffset);
    range.collapse(false);

    sel.setSingleRange(range);
};

/**
     editor.insertAnchor
     ===================

    Insert an anchor tag at the current selection with the given `href`,
    `title` and `rel` attributes.
*/
WYMeditor.editor.prototype.insertAnchor = function (href, title, rel) {
    var wym = this,
        selected,
        uniqueStamp,
        anchorToEdit;

    if (href.length === 0) {
        // href is required, so don't do anything
        return;
    }
    // ensure that we select the link to populate the fields
    selected = wym.selected();
    if (selected && selected.tagName &&
            selected.tagName.toLowerCase !== WYMeditor.A) {
        selected = jQuery(selected).parentsOrSelf(WYMeditor.A);
    }

    // fix MSIE selection if link image has been clicked
    if (!selected && wym._selected_image) {
        selected = jQuery(wym._selected_image).parentsOrSelf(WYMeditor.A);
    }

    if (selected[0] && selected[0].tagName.toLowerCase() === WYMeditor.A) {
        anchorToEdit = selected;
        console.log("existing anchor");
        console.log(anchorToEdit);
    } else {
        console.log("new anchor");
        uniqueStamp = wym.uniqueStamp();
        wym._exec(WYMeditor.CREATE_LINK, uniqueStamp);
        anchorToEdit = jQuery("a[href=" + uniqueStamp + "]", wym._doc.body);
    }

    anchorToEdit.attr(WYMeditor.HREF, inputHref);
    anchorToEdit.attr(WYMeditor.TITLE, inputTitle);
    anchorToEdit.attr(WYMeditor.REL, inputRel);

    return anchorToEdit;
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

        container;

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
        this.findUp(this.container(), WYMeditor.MAIN_CONTAINERS)
    ).get(0);

    if (!container || !container.parentNode) {
        // No valid selected container. Put the table at the end.
        jQuery(this._doc.body).append(table);
    } else {
        // Append the table after the currently-selected container
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
