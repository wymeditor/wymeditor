/* jshint evil: true, camelcase: false, maxlen: 100 */
/* global -$, rangy */
"use strict";

/**
    WYMeditor.editor._init
    ======================

    Initialize a wymeditor instance, including detecting the
    current browser and enabling the browser-specific subclass.
*/
WYMeditor.editor.prototype._init = function () {
    // Load the browser-specific subclass
    // If this browser isn't supported, do nothing
    var wym = this,
        WymClass,
        browserInstance,
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

    // Get the constructor for the browser-specific instance
    WymClass = WYMeditor._getWymClassForBrowser();

    if (!WymClass) {
        // We don't support this browser. Don't initialize.
        return;
    }

    // Initialize the browser-specific instance
    browserInstance = new WymClass(wym);

    if (jQuery.isFunction(wym._options.preInit)) {
        wym._options.preInit(wym);
    }

    wym.parser = null;
    wym.helper = null;

    SaxListener = new WYMeditor.XhtmlSaxListener();
    wym.parser = new WYMeditor.XhtmlParser(SaxListener);

    wym.helper = new WYMeditor.XmlHelper();

    // Extend the editor object with the browser-specific version.
    // We're not using jQuery.extend because we *want* to copy properties via
    // the prototype chain
    for (prop in browserInstance) {
        /*jshint forin: false*/
        // Explicitly not using hasOwnProperty for the inheritance here
        // because we want to go up the prototype chain to get all of the
        // browser-specific editor methods. This is kind of a code smell,
        // but works just fine.
        wym[prop] = browserInstance[prop];
    }

    // Load wymbox
    wym._box = jQuery(wym.element).hide().after(
        wym._options.boxHtml
    ).next().addClass(
        'wym_box_' + wym._index
    );

    // Store the instance index and replaced element in wymbox
    // but keep it compatible with jQuery < 1.2.3, see #122
    if (jQuery.isFunction(jQuery.fn.data)) {
        jQuery.data(wym._box.get(0), WYMeditor.WYM_INDEX, wym._index);
        jQuery.data(wym.element.get(0), WYMeditor.WYM_INDEX, wym._index);
    }

    h = WYMeditor.Helper;

    // Construct the iframe
    iframeHtml = wym._options.iframeHtml;
    iframeHtml = h.replaceAllInStr(
        iframeHtml,
        WYMeditor.IFRAME_BASE_PATH,
        wym._options.iframeBasePath
    );

    // Construct wymbox
    boxHtml = jQuery(wym._box).html();

    boxHtml = h.replaceAllInStr(boxHtml, WYMeditor.LOGO, wym._options.logoHtml);
    boxHtml = h.replaceAllInStr(boxHtml, WYMeditor.TOOLS, wym._options.toolsHtml);
    boxHtml = h.replaceAllInStr(boxHtml, WYMeditor.CONTAINERS, wym._options.containersHtml);
    boxHtml = h.replaceAllInStr(boxHtml, WYMeditor.CLASSES, wym._options.classesHtml);
    boxHtml = h.replaceAllInStr(boxHtml, WYMeditor.HTML, wym._options.htmlHtml);
    boxHtml = h.replaceAllInStr(boxHtml, WYMeditor.IFRAME, iframeHtml);
    boxHtml = h.replaceAllInStr(boxHtml, WYMeditor.STATUS, wym._options.statusHtml);

    // Construct the tools list
    aTools = eval(wym._options.toolsItems);
    sTools = "";

    for (i = 0; i < aTools.length; i += 1) {
        oTool = aTools[i];
        sTool = '';
        if (oTool.name && oTool.title) {
            sTool = wym._options.toolsItemHtml;
        }
        sTool = h.replaceAllInStr(sTool, WYMeditor.TOOL_NAME, oTool.name);
        sTool = h.replaceAllInStr(
            sTool,
            WYMeditor.TOOL_TITLE,
            wym._options.stringDelimiterLeft + oTool.title + wym._options.stringDelimiterRight
        );
        sTool = h.replaceAllInStr(sTool, WYMeditor.TOOL_CLASS, oTool.css);
        sTools += sTool;
    }

    boxHtml = h.replaceAllInStr(boxHtml, WYMeditor.TOOLS_ITEMS, sTools);

    // Construct the classes list
    aClasses = eval(wym._options.classesItems);
    sClasses = "";

    for (i = 0; i < aClasses.length; i += 1) {
        oClass = aClasses[i];
        sClass = '';
        if (oClass.name && oClass.title) {
            sClass = wym._options.classesItemHtml;
        }
        sClass = h.replaceAllInStr(sClass, WYMeditor.CLASS_NAME, oClass.name);
        sClass = h.replaceAllInStr(sClass, WYMeditor.CLASS_TITLE, oClass.title);
        sClasses += sClass;
    }

    boxHtml = h.replaceAllInStr(boxHtml, WYMeditor.CLASSES_ITEMS, sClasses);

    // Construct the containers list
    aContainers = eval(wym._options.containersItems);
    sContainers = "";

    for (i = 0; i < aContainers.length; i += 1) {
        oContainer = aContainers[i];
        sContainer = '';
        if (oContainer.name && oContainer.title) {
            sContainer = wym._options.containersItemHtml;
        }
        sContainer = h.replaceAllInStr(
            sContainer,
            WYMeditor.CONTAINER_NAME,
            oContainer.name
        );
        sContainer = h.replaceAllInStr(sContainer, WYMeditor.CONTAINER_TITLE,
            wym._options.stringDelimiterLeft +
            oContainer.title +
            wym._options.stringDelimiterRight);
        sContainer = h.replaceAllInStr(
            sContainer,
            WYMeditor.CONTAINER_CLASS,
            oContainer.css
        );
        sContainers += sContainer;
    }

    boxHtml = h.replaceAllInStr(boxHtml, WYMeditor.CONTAINERS_ITEMS, sContainers);

    // I10n
    boxHtml = wym.replaceStrings(boxHtml);

    // Load the html in wymbox
    jQuery(wym._box).html(boxHtml);

    // Hide the html value
    jQuery(wym._box).find(wym._options.htmlSelector).hide();

    wym.documentStructureManager = new WYMeditor.DocumentStructureManager(
        wym,
        wym._options.structureRules.defaultRootContainer
    );

    // Some browsers like to trigger an iframe's load event multiple times
    // depending on all sorts of small, annoying details. Instead of attempting
    // to work-around old ones and predict new ones, let's just ensure the
    // initialization only happens once. All methods of detecting load are
    // unreliable.
    wym.iframeInitialized = false;

    wym._iframe = jQuery(wym._box).find('iframe')[0];

    jQuery(wym._iframe).load(function () {
        wym._onEditorIframeLoad(wym);
    });

    wym.element.attr('data-wym-initialized', 'yes');

    wym._initSkin();
};

/**
    WYMeditor.editor._assignWymDoc
    ==============================

    Assigns an editor's document to the `_doc` property.
*/
WYMeditor.editor.prototype._assignWymDoc = function () {
    var wym = this;

    wym._doc = wym._iframe.contentDocument;
};

/**
    WYMeditor.editor._isDesignModeOn
    ================================

    Returns true if the designMode property of the editor's document is "On".
    Returns false, otherwise.
*/
WYMeditor.editor.prototype._isDesignModeOn = function () {
    var wym = this;

    if (
        typeof wym._doc.designMode === "string" &&
        wym._doc.designMode.toLowerCase() === "on"
    ) {
        return true;
    }
    return false;
};

/**
    WYMeditor.editor._onEditorIframeLoad
    ====================================

    This is a part of the initialization of an editor.

    The initialization procedure of an editor turns asynchronous because part of
    it must occur after the loading of the editor's Iframe.

    This function is supposed to be the event handler of the loading of the
    editor's Iframe. Therefore, it is the first step since the initialization
    procedure gets asynchronous.

    @param wym The editor instance that's being initialized.
*/
WYMeditor.editor.prototype._onEditorIframeLoad = function (wym) {
    wym._assignWymDoc();
    wym._enableDesignModeOnDocument();
    wym._afterDesignModeOn();
};

/**
    WYMeditor.editor.get$Buttons
    ============================

    Returns a jQuery object, containing all the UI buttons.
*/
WYMeditor.editor.prototype.get$Buttons = function () {
    var wym = this,
        buttonsSelector,
        $buttons;

    buttonsSelector = [
        wym._options.toolSelector,
        wym._options.containerSelector,
        wym._options.classSelector
    ].join(', ');
    $buttons = jQuery(wym._box).find(buttonsSelector);

    return $buttons;
};

/**
    WYMeditor.editor.focusOnDocument
    ================================

    Sets focus on the document.
*/
WYMeditor.editor.prototype.focusOnDocument = function () {
    var wym = this,
        doc = wym._iframe.contentWindow;

    doc.focus();
};

/**
    WYMeditor.editor.registerModification
    =====================================

    Registers a change in the document. This should be called after changes
    are made in the document.

    Triggers the `postModification` event afterwards.
*/
WYMeditor.editor.prototype.registerModification = function (isNativeEdit) {
    var wym = this;

    wym.undoRedo._add();

    if (!isNativeEdit) {
        // A non-native-edit modification is registered. Reset Edited.
        wym.nativeEditRegistration.edited.reset();
    }

    jQuery(wym.element).trigger(WYMeditor.EVENTS.postModification);
};

/**
    WYMeditor.editor._bindFocusOnDocumentToButtons
    ==============================================

    Binds a handler to clicks on the UI buttons, that sets focus back to the
    document.

    Doesn't bind to dialog-opening buttons, because that would cause them to
    fall behind the opening window, in some browsers.
*/
WYMeditor.editor.prototype._bindFocusOnDocumentToButtons = function () {
    var wym = this,
        $buttons = wym.get$Buttons();

    $buttons = $buttons.parent().not('.wym_opens_dialog').children('a');
    $buttons.click(function () {
        wym.focusOnDocument();
    });
};

/**
    WYMeditor.editor._uiQuirks
    ==========================

    A hook for browser quirks that work on the UI.

    To be run after plugins had a chance to modify the UI.
*/
WYMeditor.editor.prototype._uiQuirks = function () {
    return;
};


/**
    WYMeditor.editor._afterDesignModeOn
    ===================================

    This is part of the initialization of an editor, designed to be called
    after the editor's document is in designMode.
*/
WYMeditor.editor.prototype._afterDesignModeOn = function () {
    var wym = this;

    if (wym.iframeInitialized === true) {
        return;
    }

    wym._assignWymDoc();
    wym.$body().addClass("wym_iframe combokeys");

    wym._doc.title = wym._index;

    // Set the text direction.
    jQuery('html', wym._doc).attr('dir', wym._options.direction);

    wym.keyboard = new WYMeditor.Keyboard(wym);
    wym.keyboard._attachDefaultKeyboardShortcuts();

    wym._docEventQuirks();

    wym._initializeDocumentContent();

    if (jQuery.isFunction(wym._options.preBind)) {
        wym._options.preBind(wym);
    }

    wym._bindUIEvents();

    wym.iframeInitialized = true;

    if (jQuery.isFunction(wym._options.postInit)) {
        wym._options.postInit(wym);
    }

    // Importantly, these two are  after `postInit`, where plugins had a chance
    // to modify the UI (add buttons, etc.).
    wym._bindFocusOnDocumentToButtons();
    wym._uiQuirks();

    // Add event listeners to doc elements, e.g. images
    wym._listen();

    wym.undoRedo = new WYMeditor.UndoRedo(wym);

    wym.nativeEditRegistration = new WYMeditor.NativeEditRegistration(wym);

    wym.ih = new WYMeditor.ImageHandler(wym);

    jQuery(wym.element).trigger(
        WYMeditor.EVENTS.postIframeInitialization,
        wym
    );
};

/**
    WYMeditor.editor._initializeDocumentContent
    ===========================================

    Populates the editor's document with the initial content, according to the
    configuration and/or the textarea element's value.
*/
WYMeditor.editor.prototype._initializeDocumentContent = function () {
    var wym = this;

    if (wym._options.html) {
        // Populate from the configuration option
        wym.html(wym._options.html);
    } else {
        // Populate from the textarea element
        wym.html(wym.element[0].value);
    }
};

/**
    WYMeditor.editor._docEventQuirks
    ================================

    Misc. event bindings on the editor's document, that may be required.
*/
WYMeditor.editor.prototype._docEventQuirks = function () {
    return;
};

/**
    WYMeditor.editor._bindUIEvents
    ==============================

    Binds event handlers for the UI elements.
*/
WYMeditor.editor.prototype._bindUIEvents = function () {
    var wym = this,
        $toolbarButtons = jQuery(wym._box).find(wym._options.toolSelector),
        dialogButtonSelector = WYMeditor.DIALOG_BUTTON_SELECTOR,
        $html_val;

    // Action buttons
    $toolbarButtons.not(dialogButtonSelector).click(function () {
        var button = this;
        wym.exec(jQuery(button).attr(WYMeditor.NAME));
        return false;
    });

    // Dialog buttons
    $toolbarButtons.filter(dialogButtonSelector).click(function () {
        var button = this,
            dialogName = jQuery(button).attr(WYMeditor.NAME),
            dialog = WYMeditor.DIALOGS[dialogName];

        // The following would also work, but is deprecated:
        // wym.dialog(dialogName);
        wym.dialog(dialog);
        return false;
    });

    // Containers buttons
    jQuery(wym._box).find(wym._options.containerSelector).click(function () {
        var containerButton = this;
        wym.setRootContainer(jQuery(containerButton).attr(WYMeditor.NAME));
        return false;
    });

    // Handle keyup event on the HTML value textarea: set the editor value
    // Handle focus/blur events to check if the element has focus, see #147
    $html_val = jQuery(wym._box).find(wym._options.htmlValSelector);
    $html_val.keyup(function () {
        var valTextarea = this;
        wym.$body().html(jQuery(valTextarea).val());
    });
    $html_val.focus(function () {
        var valTextarea = this;
        jQuery(valTextarea).toggleClass('hasfocus');
    });
    $html_val.blur(function () {
        var valTextarea = this;
        jQuery(valTextarea).toggleClass('hasfocus');
    });

    // Handle click events on classes buttons
    jQuery(wym._box).find(wym._options.classSelector).click(function () {
        var classButton = this,
            aClasses = eval(wym._options.classesItems),
            sName = jQuery(classButton).attr(WYMeditor.NAME),

            oClass = WYMeditor.Helper._getFromArrayByName(aClasses, sName),
            jqexpr;

        if (oClass) {
            jqexpr = oClass.expr;
            wym.toggleClass(sName, jqexpr);
        }
        return false;
    });

    // Handle update event on update element
    jQuery(wym._options.updateSelector).bind(
        wym._options.updateEvent,
        function () {
            wym.update();
        }
    );

    // This may recover an unexpected shut down of `designMode`.
    wym.$body().bind("focus", function () {
        if (wym._isDesignModeOn() !== true) {
            wym._enableDesignModeOnDocument();
        }
    });
};

/**
    WYMeditor.editor._enableDesignModeOnDocument
    ============================================

    Enables `designMode` on the document, if it is not already enabled.
*/
WYMeditor.editor.prototype._enableDesignModeOnDocument = function () {
    var wym = this;

    if (wym._isDesignModeOn()) {
        throw "Expected `designMode` to be off.";
    }

    try {
        wym._doc.designMode = "On";
    } catch (e) {
        // Bail out gracefully if this went wrong.
    }
    if (typeof wym._designModeQuirks === "function") {
        wym._designModeQuirks();
    }
};

/**
    WYMeditor.editor.get$WymBox
    ===========================

    Get a jQuery containing the WYMeditor box.
*/
WYMeditor.editor.prototype.get$WymBox = function () {
    var wym = this;
    return wym._box;
};

/**
    WYMeditor.editor.vanish
    =========================

    Removes the WYMeditor instance from existence and replaces the
    'data-wym-initialized' attirbute of its textarea with 'data-wym-vanished'.
*/
WYMeditor.editor.prototype.vanish = function () {
    var wym = this,
        instances = WYMeditor.INSTANCES,
        i;

    wym._box.remove();
    wym.element
        .removeAttr('data-wym-initialized')
        .attr('data-wym-vanished', '')
        .show();
    instances.splice(wym._index, 1);

    // Refresh each editor's _index value
    for (i = 0; i < instances.length; i++) {
        instances[i]._index = i;
    }
};

WYMeditor.editor.prototype._exec = function (cmd, param) {
    var wym = this,
        $span;

    if (typeof cmd !== "string") {
        throw "`_exec` expected a String `cmd`";
    }

    if (param && typeof param !== "string") {
        throw "`_exec` expected a String `param`";
    }

    if (
        wym.selectedContainer() === wym.body() &&
        // These are the two commands that are allowed directly in the body.
        cmd !== WYMeditor.EXEC_COMMANDS.INSERT_IMAGE &&
        cmd !== WYMeditor.EXEC_COMMANDS.FORMAT_BLOCK
    ) {
        return false;
    }

    wym._doc.execCommand(cmd, false, param);

    $span = jQuery(wym.selectedContainer()).filter("span").not("[id]");
    if ($span.length === 0) {
        return true;
    }
    if (
        $span.attr("class") === "" &&
        $span.attr("style") === "font-weight: normal;" ||
        $span.attr("class").toLowerCase() === "apple-style-span"
    ) {
        // An undesireable `span` was created. WebKit & Blink do this.
        $span.contents().unwrap();
    }

    return true;
};

/**
    WYMeditor.editor.rawHtml
    =====================

    Get or set the wymbox html value. HTML is NOT parsed when either set/get.
    Use html() if you are unsure what this function does.
*/
WYMeditor.editor.prototype.rawHtml = function (html) {
    var wym = this;
    if (typeof html === 'string') {
        wym.$body().html(html);
        wym.update();
    } else {
        return wym.$body().html();
    }
};

/**
    WYMeditor.editor.html
    =====================

    Get or set the wymbox html value. HTML is parsed before it is inserted and
    parsed before it is return. Use rawHtml() if parsing is not wanted/needed.
*/
WYMeditor.editor.prototype.html = function (html) {
    var wym = this;
    if (typeof html === 'string') {
        wym.rawHtml(wym.parser.parse(html));
        wym.prepareDocForEditing();
    } else {
        return wym.parser.parse(wym.rawHtml());
    }
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
    var wym = this,
        custom_run;
    switch (cmd) {

    case WYMeditor.EXEC_COMMANDS.TOGGLE_HTML:
        wym.update();
        wym.toggleHtml();
        break;

    case WYMeditor.EXEC_COMMANDS.INSERT_ORDEREDLIST:
        wym._insertOrderedList();
        break;

    case WYMeditor.EXEC_COMMANDS.INSERT_UNORDEREDLIST:
        wym._insertUnorderedList();
        break;

    case WYMeditor.EXEC_COMMANDS.INDENT:
        wym.indent();
        break;

    case WYMeditor.EXEC_COMMANDS.OUTDENT:
        wym.outdent();
        break;

    case WYMeditor.EXEC_COMMANDS.UNDO:
        wym.undoRedo.undo();
        break;

    case WYMeditor.EXEC_COMMANDS.REDO:
        wym.undoRedo.redo();
        break;


    default:
        custom_run = false;
        jQuery.each(wym._options.customCommands, function () {
            var customCommand = this;
            if (cmd === customCommand.name) {
                custom_run = true;
                customCommand.run.apply(wym);
                return false;
            }
        });
        if (!custom_run) {
            if (
                // Deligate all other commands to `_exec`
                wym._exec(cmd) === true
            ) {
                wym.registerModification();
            }
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
    var wym = this,
        iframe = wym._iframe,
        sel;

    if (window.rangy && !rangy.initialized) {
        rangy.init();
    }

    sel = rangy.getIframeSelection(iframe);

    return sel;
};

/**
    WYMeditor.editor.nodeAfterSel
    =============================

    Returns the node that is immediately after the selection.
*/
WYMeditor.editor.prototype.nodeAfterSel = function () {
    var wym = this,
       sel = wym.selection();

    // Different browsers describe selection differently. Here be dragons.
    if (
        sel.anchorNode.tagName &&
        jQuery.inArray(
            sel.anchorNode.tagName.toLowerCase(),
            WYMeditor.NON_CONTAINING_ELEMENTS
        ) === -1
    ) {
        if (sel.anchorNode.childNodes.length === 0) {
            return;
        }
        return sel.anchorNode.childNodes[sel.anchorOffset];
    }

    if (
        sel.focusNode.nodeType === WYMeditor.NODE_TYPE.TEXT &&
        sel.focusNode.data.length === sel.focusOffset
    ) {
        if (!sel.focusNode.nextSibling) {
            return;
        }
        return sel.focusNode.nextSibling;
    }

    return sel.focusNode;
};

/**
    WYMeditor.editor.get$CommonParent
    =================================

    Returns a jQuery of the common parent of two nodes.
*/
WYMeditor.editor.prototype.get$CommonParent = function (one, two) {
    if (
        typeof one !== 'object' ||
        typeof one.nodeType !== 'number' ||
        typeof two !== 'object' ||
        typeof two.nodeType !== 'number'
    ) {
        throw "`one` and `two` must be DOM nodes.";
    }

    if (one.nodeType === WYMeditor.NODE_TYPE.TEXT) {
        // These checks seem to be required for our tests to pass in PhantomJS.
        one = one.parentNode;
    }
    if (two.nodeType === WYMeditor.NODE_TYPE.TEXT) {
        // These checks seem to be required for our tests to pass in PhantomJS.
        two = two.parentNode;
    }

    if (one === two) {
        // This is just an optimisation.
        return jQuery(one);
    }

    var $one = jQuery(one),
        $two = jQuery(two),
        $commonParent;

    $commonParent = $one.parents().addBack().has($two).last();

    if ($commonParent.length === 0) {
        throw "Couldn't find common parent. This shouldn't happen.";
    }

    return $commonParent;
};

/**
    WYMeditor.editor.selectedContainer
    ==================================

    Get the selected container.

    * If no selection, returns `false`.
    * If selection starts and ends in the same element, returns that element.
    * If an element that contains one end of the selection is ancestor to the
      element that contains the other end, return that ancestor element.
    * Otherwise, returns `false`.

    For example (``|`` marks selection ends):

        <p>|Foo <i>bar|</i></p>

    The ``p`` is returned.

        <p>Foo <i>|bar|</i></p>

    The ``i`` is returned.
*/
WYMeditor.editor.prototype.selectedContainer = function () {
    var wym = this,
        selection,
        $anchor,
        $focus,
        $selectedContainer;

    if (wym.hasSelection() !== true) {
        return false;
    }

    selection = wym.selection();
    $anchor = jQuery(selection.anchorNode);
    $focus = jQuery(selection.focusNode);

    if ($anchor[0].nodeType === WYMeditor.NODE_TYPE.TEXT) {
        $anchor = $anchor.parent();
    }

    if ($focus[0].nodeType === WYMeditor.NODE_TYPE.TEXT) {
        $focus = $focus.parent();
    }

    if ($anchor[0] === $focus[0]) {
        return $anchor[0];
    }

    $selectedContainer = $anchor.has($focus);
    if ($selectedContainer.length === 0) {
        $selectedContainer = $focus.has($anchor);
    }

    if ($selectedContainer.length === 0) {
        return false;
    }

    return $selectedContainer[0];
};

// Deprecated in favor of `WYMeditor.editor.selectedContainer`.
WYMeditor.editor.prototype.selected = function () {
    var wym = this;

    WYMeditor.console.warn(
        "The function WYMeditor.editor.selected() is " +
        "deprecated. Use WYMeditor.editor.selectedContainer"
    );

    return wym.selectedContainer();
};

/**
    WYMeditor.editor.isBlockNode
    =============================

    Returns true if the provided node is a block type node. Otherwise
    returns false.

    @param node The node to check.
*/

WYMeditor.editor.prototype.isBlockNode = function (node) {
    if (
        node.tagName &&
        jQuery.inArray(
            node.tagName.toLowerCase(),
            WYMeditor.BLOCKS
        ) > -1
    ) {
        return true;
    }
    return false;
};

/**
    WYMeditor.editor.isInlineNode
    =============================

    Returns true if the provided node is an inline type node. Otherwise
    returns false.

    @param node The node to check.
*/

WYMeditor.editor.prototype.isInlineNode = function (node) {
    if (
        node.nodeType === WYMeditor.NODE_TYPE.TEXT ||
        jQuery.inArray(
            node.tagName.toLowerCase(),
            WYMeditor.INLINE_ELEMENTS
        ) > -1
    ) {
        return true;
    }
    return false;
};

/**
    WYMeditor.editor.isListNode
    ===========================

    Returns true if the provided node is a list element. Otherwise
    returns false.

    @param node The node to check.
*/

WYMeditor.editor.prototype.isListNode = function (node) {
    if (
        node.tagName &&
        jQuery.inArray(
            node.tagName.toLowerCase(),
            WYMeditor.LIST_TYPE_ELEMENTS
        ) > -1
    ) {
        return true;
    }
    return false;
};

/**
   WYMeditor.editor.unwrapIfMeaninglessSpan

   If the given node is a span with no useful attributes, unwrap it.

   For certain editing actions (mostly list indent/outdent), it's necessary to
   wrap content in a span element to retain grouping because it's not obvious that
   the content will stay together without grouping. This method detects that
   specific situation and then unwraps the content if the span is in fact not
   necessary.

   @param element The element.
*/
WYMeditor.editor.prototype.unwrapIfMeaninglessSpan = function (element) {
    var $element = jQuery(element),
        i = 0,
        attrName,
        meaninglessAttrNames = [
            '_wym_visited',
            'length',
            'ie8_length'
        ];

    if (!element || typeof (element.tagName) === 'undefined' ||
        element.tagName.toLowerCase() !== 'span') {
        return false;
    }

    while (i < element.attributes.length) {
        attrName = element.attributes[i].nodeName;
        if (jQuery.inArray(attrName, meaninglessAttrNames) === -1) {
            return false;
        }
        i++;
    }

    $element.before($element.contents());
    $element.remove();
    return true;
};

/**
    WYMeditor.editor.getRootContainer
    =================================

    Get the selected root container.
*/
WYMeditor.editor.prototype.getRootContainer = function () {
    var wym = this;

    return jQuery(wym.selectedContainer())
        .parentsOrSelf()
        .not('html, body, blockquote')
        .last()[0];
};

/**
    WYMeditor.editor.setRootContainer
    =================================

    Set the selected root container.
*/
WYMeditor.editor.prototype.setRootContainer = function (sType) {
    var wym = this,
        container = null,
        aTypes,
        newNode,
        blockquote,
        nodes,
        lgt,
        firstNode,
        x;

    if (sType.toLowerCase() === WYMeditor.TH) {
        container = wym.selectedContainer();

        // Find the TD or TH container
        switch (container.tagName.toLowerCase()) {

        case WYMeditor.TD:
        case WYMeditor.TH:
            break;
        default:
            aTypes = [WYMeditor.TD, WYMeditor.TH];
            container = wym.findUp(wym.selectedContainer(), aTypes);
            break;
        }

        // If it exists, switch
        if (container !== null) {
            sType = WYMeditor.TD;
            if (container.tagName.toLowerCase() === WYMeditor.TD) {
                sType = WYMeditor.TH;
            }
            wym.restoreSelectionAfterManipulation(function () {
                wym.switchTo(container, sType, false);
                return true;
            });
            wym.update();
            wym.registerModification();
        }
    } else {
        // Set the container type
        aTypes = [
            WYMeditor.P,
            WYMeditor.DIV,
            WYMeditor.H1,
            WYMeditor.H2,
            WYMeditor.H3,
            WYMeditor.H4,
            WYMeditor.H5,
            WYMeditor.H6,
            WYMeditor.PRE,
            WYMeditor.BLOCKQUOTE
        ];
        container = wym.findUp(wym.selectedContainer(), aTypes);

        if (container) {
            if (sType.toLowerCase() === WYMeditor.BLOCKQUOTE) {
                // Blockquotes must contain a block level element
                blockquote = wym.findUp(
                    wym.selectedContainer(),
                    WYMeditor.BLOCKQUOTE
                );
                if (blockquote === null) {
                    newNode = wym._doc.createElement(sType);
                    container.parentNode.insertBefore(newNode, container);
                    newNode.appendChild(container);
                    wym.setCaretIn(newNode.firstChild);
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
                        wym.setCaretIn(firstNode);
                    }
                }
            } else {
                // Not a blockquote
                wym.restoreSelectionAfterManipulation(function () {
                    wym.switchTo(container, sType, false);
                    return true;
                });
            }

            wym.update();
            wym.registerModification();
        }
    }

    return false;
};

/**
    WYMeditor.editor.isForbiddenRootContainer
    =========================================

    Returns true if provided `tagName` is disallowed as a root container.
    Returns false if it is allowed.

    @param tagName A string of the tag name.
*/
WYMeditor.editor.prototype.isForbiddenRootContainer = function (tagName) {
    return jQuery.inArray(tagName.toLowerCase(),
                          WYMeditor.FORBIDDEN_ROOT_CONTAINERS) > -1;
};

/**
    WYMeditor.editor.keyCanCreateBlockElement
    =========================================

    Determines whether the key represented by the passed keyCode can create a
    block element within the editor when pressed. Returns true if the key can
    create a block element when pressed, and returns false if otherwise.

    @param keyCode A numberic key code representing a key
*/
WYMeditor.editor.prototype.keyCanCreateBlockElement = function (keyCode) {
    return jQuery.inArray(keyCode,
                    WYMeditor.POTENTIAL_BLOCK_ELEMENT_CREATION_KEYS) > -1;
};

/**
    WYMeditor.editor.toggleClass
    ============================

    Toggle a class on the selected element or one of its parents
*/
WYMeditor.editor.prototype.toggleClass = function (sClass, jqexpr) {
    var wym = this,
        $element;

    $element = jQuery(wym.getSelectedImage());
    if ($element.length !== 1) {
        $element = jQuery(wym.selectedContainer())
            // `.last()` is used here because the `.addBack()` from
            // `.parentsOrSelf` reverses the array.
            .parentsOrSelf(jqexpr).last();
    }
    $element.toggleClass(sClass);

    if (!$element.attr(WYMeditor.CLASS)) {
        $element.removeAttr(wym._class);
    }
    wym.registerModification();
};

/**
    WYMeditor.editor.getSelectedImage
    =================================

    If selection encompasses exactly a single image, returns that image.
    Otherwise returns `false`.
*/
WYMeditor.editor.prototype.getSelectedImage = function () {
    var wym = this,
        selectedNodes,
        selectedNode;

    if (wym.hasSelection() !== true) {
        return false;
    }
    if (wym.selection().isCollapsed !== false) {
        return false;
    }

    selectedNodes = wym._getSelectedNodes();

    if (selectedNodes.length !== 1) {
        return false;
    }

    selectedNode = selectedNodes[0];

    if (
        !selectedNode.tagName ||
        selectedNode.tagName.toLowerCase() !== "img"
    ) {
        return false;
    }

    return selectedNode;
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

    Switch the type of an element.

    @param element The element.
    @param sType A string of the desired type. For example, 'p'.
    @param stripAttrs a boolean that determines whether the attributes of
                      the element will be stripped or preserved.

*/
WYMeditor.editor.prototype.switchTo = function (
    element,
    sType,
    stripAttrs
) {
    var wym = this,
        $element = jQuery(element),
        newElement,
        i,
        attrs = element.attributes;

    if (!element.tagName) {
        throw "This must be an element.";
    }

    if (element.tagName.toLowerCase() === 'img') {
        throw "Will not change the type of an 'img' element.";
    }

    newElement = wym._doc.createElement(sType);
    jQuery(newElement).append(element.childNodes);
    $element.replaceWith(newElement);

    if (!stripAttrs) {
        for (i = 0; i < attrs.length; ++i) {
            newElement.setAttribute(
                attrs.item(i).nodeName,
                attrs.item(i).value
            );
        }
    }

    return newElement;
};

WYMeditor.editor.prototype.replaceStrings = function (sVal) {
    var wym = this,
        key;
    // Check if the language file has already been loaded
    // if not, get it via a synchronous ajax call
    if (!WYMeditor.STRINGS[wym._options.lang]) {
        WYMeditor.console.error(
            "WYMeditor: language '" + wym._options.lang + "' not found."
        );
        WYMeditor.console.error(
            "Unable to perform i10n."
        );
        return sVal;
    }

    // Replace all the strings in sVal and return it
    for (key in WYMeditor.STRINGS[wym._options.lang]) {
        if (WYMeditor.STRINGS[wym._options.lang].hasOwnProperty(key)) {
            sVal = WYMeditor.Helper.replaceAllInStr(
                sVal,
                wym._options.stringDelimiterLeft + key + wym._options.stringDelimiterRight,
                WYMeditor.STRINGS[wym._options.lang][key]
            );
        }
    }
    return sVal;
};

WYMeditor.editor.prototype._encloseString = function (sVal) {
    var wym = this;
    return wym._options.stringDelimiterLeft +
        sVal +
        wym._options.stringDelimiterRight;
};

/**
    editor.getCurrentState
    ======================

    Returns an object with the current state of the editor.

    The state includes:

    ``html``
        The return value of ``editor.rawHtml()``.
    ``savedSelection``
        A Rangy saved selection, if anything is selected.
        The ``win`` and the ``doc``  properties are deleted,
        instead of referencing the window object and the document object,
        respectively.
        In order to provide this as an argument to Rangy's ``restoreSelection``,
        these must be reassigned.

    It may include more things in the future.
*/
WYMeditor.editor.prototype.getCurrentState = function () {
    var wym = this,
        state = {},
        selection,
        wymIframeWindow = wym._iframe.contentWindow;

    if (wym.hasSelection()) {
        selection = wym.selection();
    }

    if (
        selection &&
        selection.anchorNode === wym.body() &&
        selection.anchorOffset === 0 &&
        selection.isCollapsed
    ) {
        // meaningless selection
        selection = false;
    }

    if (selection) {
        state.savedSelection = rangy.saveSelection(wymIframeWindow);
    }

    state.html = wym.rawHtml();

    if (state.savedSelection) {
        // Selection was saved. This means that in the document, DOM elements,
        // which are markers for the selection, were placed, and that references
        // to these markers were saved in `state.savedselection`. The markers
        // were saved in `state.html`, along with the whole document, as HTML.
        // Restoring the selection removes the markers and restores the
        // selection to almost exactly as it was before it was saved.
        rangy.restoreSelection(state.savedSelection);
        // This is for time-travel, so selection is considered not to be
        // restored. The markers may be created again from the saved HTML. In
        // that case, leaving this value at `true` would mean that
        // `rangy.restoreSelection` will refuse to restore this selection.
        state.savedSelection.restored = false;
        // These refer to the window and the document and can't be processed by
        // the `object-history` module that is used by the `UndoRedo` module.
        delete state.savedSelection.win;
        delete state.savedSelection.doc;
    }

    return state;
};

/**
    editor.hasSelection
    ===================

    Returns true if there is a selection. Returns false otherwise.
*/
WYMeditor.editor.prototype.hasSelection = function () {
    var wym = this;

    if (
        // `isSelectionValid` is undocumented in current Rangy (`1.2.2`).
        // It seems to be required because the `rangeCount` in `IE <= 8` seems
        // to be misleading.
        rangy.isSelectionValid(wym._iframe.contentWindow) !== true
    ) {
        return false;
    }

    if (wym.selection().rangeCount === 0) {
        return false;
    }

    return true;
};

/**
    editor._setSingleSelectionRange
    ===============================

    Sets the selection to the single provided Rangy range.

    @param range A Rangy range.
*/
WYMeditor.editor.prototype._setSingleSelectionRange = function (range) {
    var wym = this,
        selection;

    selection = wym.selection();

    selection.setSingleRange(range);
};

/**
    editor.status
    =============

    Print the given string as a status message.
*/
WYMeditor.editor.prototype.status = function (sMessage) {
    var wym = this;
    // Print status message
    jQuery(wym._box).find(wym._options.statusSelector).html(sMessage);
};

/**
    editor.update
    =============

    Update the element and textarea values.
*/
WYMeditor.editor.prototype.update = function () {
    var wym = this,
        html;

    html = wym.html();
    jQuery(wym.element).val(html);
    jQuery(wym._box).find(wym._options.htmlValSelector).not('.hasfocus').val(html); //#147
};

/**
    editor.prepareDocForEditing
    ===========================

    Makes some editor-only modifications to the body of the document, which are necessary
    for the user interface. For example, inserts `br` elements in certain places.
    These modifications will not show up in the HTML output.

*/
WYMeditor.editor.prototype.prepareDocForEditing = function () {
    var wym = this,
        $body;

    wym._spaceBlockingElements();
    wym._fixDoubleBr();

    $body = wym.$body();
    if ($body.children().length === 0) {
        wym.$body().append('<br />');
    }

    jQuery(wym.element).trigger(WYMeditor.EVENTS.postBlockMaybeCreated, wym);
};

/**
    editor._spaceBlockingElements
    =============================

    Insert <br> elements between adjacent blocking elements and
    p elements, between block elements or blocking elements and the
    start/end of the document.
*/
WYMeditor.editor.prototype._spaceBlockingElements = function () {
    var wym = this,
        blockingSelector =
            WYMeditor.DocumentStructureManager.CONTAINERS_BLOCKING_NAVIGATION.join(', '),
        $body = wym.$body(),
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
                            WYMeditor.BLOCKING_ELEMENT_SPACER_CLASS + ' ' +
                            WYMeditor.EDITOR_ONLY_CLASS + '" ' +
                            '_moz_editor_bogus_node="TRUE" ' +
                            '_moz_dirty=""' +
                          '/>';
    } else {
        placeholderNode = '<br ' +
                            'class="' +
                            WYMeditor.BLOCKING_ELEMENT_SPACER_CLASS + ' ' +
                            WYMeditor.EDITOR_ONLY_CLASS + '"' +
                          '/>';
    }

    // Make sure that we still have a placeholder node at both the begining and
    // end
    if (children.length > 0) {
        $firstChild = jQuery(children[0]);
        $lastChild = jQuery(children[children.length - 1]);

        if ($firstChild.is(blockingSelector)) {
            $firstChild.before(placeholderNode);
        }

        if ($lastChild.is(blockingSelector)) {
            $lastChild.after(placeholderNode);
        }
    }

    blockSepSelector = wym._getBlockSepSelector();

    // Put placeholder nodes between consecutive blocking elements and between
    // blocking elements and normal block-level elements
    $body.find(blockSepSelector).before(placeholderNode);

    blockInListSepSelector = wym._getBlockInListSepSelector();
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
        var block = this,
            $block = jQuery(block);

        if (!$block.next(blockingSelector).length &&
           !$block.next('br').length) {

            $block.after(placeholderNode);
        }
    });
};

/**
    editor._getBlockSepSelector
    ===========================

    Build a string representing a jquery selector that will find all
    elements which need a spacer <br> before them. This includes all consecutive
    blocking elements and between blocking elements and normal non-blocking
    elements.
*/
WYMeditor.editor.prototype._getBlockSepSelector = function () {
    var wym = this,
        blockCombo = [],
        containersBlockingNav =
            WYMeditor.DocumentStructureManager.CONTAINERS_BLOCKING_NAVIGATION,
        containersNotBlockingNav;

    if (typeof (wym._blockSpacersSel) !== 'undefined') {
        return wym._blockSpacersSel;
    }

    // Generate the list of non-blocking elements by removing the blocking
    // elements from the list of validRootContainers
    containersNotBlockingNav = jQuery.grep(
        wym.documentStructureManager.structureRules.validRootContainers,
        function (item) {
            return jQuery.inArray(item, containersBlockingNav) === -1;
        }
    );

    // Consecutive blocking elements need separators
    jQuery.each(
        containersBlockingNav,
        function (indexO, elementO) {
            jQuery.each(
                containersBlockingNav,
                function (indexI, elementI) {
                    blockCombo.push(elementO + ' + ' + elementI);
                }
            );
        }
    );

    // A blocking element either followed by or preceeded by a not blocking
    // element needs separators
    jQuery.each(
        containersBlockingNav,
        function (indexO, elementO) {
            jQuery.each(
                containersNotBlockingNav,
                function (indexI, elementI) {
                    blockCombo.push(elementO + ' + ' + elementI);
                    blockCombo.push(elementI + ' + ' + elementO);
                }
            );
        }
    );
    wym._blockSpacersSel = blockCombo.join(', ');
    return wym._blockSpacersSel;
};

/*
    editor._getBlockInListSepSelector
    =================================

    Returns a selector for getting all of the block elements in lists
    or sublists. The block elements at the end of lists or sublists should have
    a spacer line break after them in the editor at all times.
*/
WYMeditor.editor.prototype._getBlockInListSepSelector = function () {
    var wym = this,
        blockCombo = [];

    if (typeof (wym._blockInListSpacersSel) !== 'undefined') {
        return wym._blockInListSpacersSel;
    }

    jQuery.each(WYMeditor.LIST_TYPE_ELEMENTS, function (indexO, elementO) {
        jQuery.each(WYMeditor.BLOCKING_ELEMENTS, function (indexI, elementI) {
            blockCombo.push(elementO + ' ' + elementI);
        });
    });

    wym._blockInListSpacersSel = blockCombo.join(', ');
    return wym._blockInListSpacersSel;
};

/**
    editor._fixDoubleBr
    ===================

    Remove the <br><br> elements that are inserted between
    paragraphs, usually after hitting enter from an existing paragraph.
*/
WYMeditor.editor.prototype._fixDoubleBr = function () {
    var wym = this,
        $body = wym.$body(),
        $last_br;

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
    WYMeditor.editor.link
    ======================

    Creates a link, or changes attributes of an `a`, at selection.

    @param attrs Object with key-value pairs of attributes for the `a`.
*/
WYMeditor.editor.prototype.link = function (attrs) {
    var wym = this,
        $selected,
        uniqueStamp,
        $a;

    if (jQuery.isPlainObject(attrs) !== true) {
        throw "Expected a plain object.";
    }

    if (
        attrs.hasOwnProperty('href') !== true ||
        typeof attrs.href !== 'string' ||
        attrs.href.length === 0
    ) {
        // Would probably be best to throw here, but...
        // This is used by a dialog that doesn't check input.
        // The dialog is created by `WYMeditor.INIT_DIALOG`.
        return;
    }

    $selected = jQuery(wym.selectedContainer());
    if ($selected.is('a')) {
        $a = $selected;
    } else {
        uniqueStamp = wym.uniqueStamp();
        wym._exec(WYMeditor.EXEC_COMMANDS.CREATE_LINK, uniqueStamp);
        $a = jQuery("a[href=" + uniqueStamp + "]", wym.body());
    }

    if ($a.length === 0) {
        // This occurs when a link wasn't created, because, for example
        // the selection didn't allow it.
        return;
    }
    $a.attr(attrs);

    wym.registerModification();
};

/**
    WYMeditor.editor.insertImage
    ============================

    Inserts an image at selection.

    @param attrs Object with key-value pairs of attributes for the `img`.
*/
WYMeditor.editor.prototype.insertImage = function (attrs) {
    var wym = this,
        uniqueStamp,
        $img;

    if (jQuery.isPlainObject(attrs) !== true) {
        throw "Expected a plain object.";
    }

    if (
        attrs.hasOwnProperty('src') !== true ||
        typeof attrs.src !== 'string' ||
        attrs.src.length === 0
    ) {
        // Would probably be best to throw here, but...
        // This is used by a dialog that doesn't check input.
        // The dialog is created by `WYMeditor.INIT_DIALOG`.
        return;
    }

    uniqueStamp = wym.uniqueStamp();
    wym._exec(WYMeditor.EXEC_COMMANDS.INSERT_IMAGE, uniqueStamp);
    $img = jQuery("img[src=" + uniqueStamp + "]", wym.body());

    if ($img.length === 0) {
        // This occurs when a link wasn't created, because, for example
        // the selection didn't allow it.
        return;
    }
    $img.attr(attrs);

    // PhantomJS seems to add strange spans around images.
    wym.$body().find('.Apple-style-span').children().unwrap();

    wym.registerModification();
};

/**
    editor._updateImageAttrs
    ========================

    Updates provided `img`'s attributes with provided `attrs`.
*/
WYMeditor.editor.prototype._updateImageAttrs = function (img, attrs) {
    var $img = jQuery(img);
    if (attrs.src !== $img.attr('src')) {
        // this data is used in the ImageHandler.
        // height/width ratio is now most likely invalid
        $img.data('DimensionsRatio', null);

        // since the height/width ration is most likely different
        // these proportions are most likely wrong.
        // easiest solution is to remove them
        // and let the user deal with
        // the real size of the source image
        // and he'll be able to resize it
        $img.removeAttr('height').removeAttr('width');
    }
    $img.attr(attrs);
};

/**
    editor.toggleHtml
    =================

    Show/Hide the HTML textarea.
*/
WYMeditor.editor.prototype.toggleHtml = function () {
    var wym = this;
    jQuery(wym._box).find(wym._options.htmlSelector).toggle();
};

WYMeditor.editor.prototype.uniqueStamp = function () {
    var now = new Date();
    return "wym" + now.getTime();
};

/**
    Paste the given array of paragraph-items at the given range inside the given $container.

    It has already been determined that the paragraph has multiple lines and
    that the container we're pasting to is a block container capable of accepting
    further nested blocks.
*/
WYMeditor.editor.prototype._handleMultilineBlockContainerPaste = function (
    wym, $container, range, paragraphStrings
) {

    var i,
        $insertAfter,
        html,
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
    var wym = this,
        container = wym.selectedContainer(),
        paragraphStrings,
        j,
        textNodesToInsert,
        blockSplitter,
        $container = jQuery(container),
        html = '',
        paragraphs,
        i,
        isSingleLine = false,
        sel = wym.selection(),
        textNode,
        range = sel.getRangeAt(0),
        insertionNodes;

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
                wym._doc
            ).appendTo(wym._doc.body);
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
            textNode = wym._doc.createTextNode(str);
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
                textNode = wym._doc.createTextNode(textNodesToInsert[i]);
                range.insertNode(textNode);
                if (i > 0) {
                    // Don't insert an opening br
                    range.insertNode(jQuery('<br />', wym._doc).get(0));
                }
            }
        }
    }
    wym.registerModification();
};

WYMeditor.editor.prototype.insert = function (html) {
    // Do we have a selection?
    var wym = this,
        selection = wym.hasSelection() ? wym.selection() : false,
        range,
        node;
    if (selection) {
        // Overwrite selection with provided html
        range = selection.getRangeAt(0);
        node = range.createContextualFragment(html);
        range.deleteContents();
        range.insertNode(node);
    }
};

/**
    editor.canSetCaretBefore
    ========================

    Returns true if it is OK to set a collapsed selection immediately before
    a node. Otherwise returns false.

    @param node A node to check about.
 */
WYMeditor.editor.prototype.canSetCaretBefore = function (node) {
    var wym = this;
    if (node.nodeType === WYMeditor.NODE_TYPE.TEXT) {
        return true;
    }
    if (
        node.tagName &&
        node.tagName.toLowerCase() === 'br'
    ) {
        if (
            !node.previousSibling
        ) {
            return true;

        } else if (
            node.previousSibling.tagName &&
            node.previousSibling.tagName.toLowerCase() === 'br'
        ) {
            return true;

        } else if (wym.isBlockNode(node.previousSibling)) {
            return true;

        } else if (node.previousSibling.nodeType === WYMeditor.NODE_TYPE.TEXT) {
            return true;
        }
    }
    return false;
};

/**
    editor.setCaretBefore
    =====================

    Sets a collapsed selection to immediately before a provided node.

    Not to be confused with `editor.setCaretIn`, which sets a collapsed
    selection inside a container node, at the start.

    @param node A node to set the selection to immediately before of.
 */
WYMeditor.editor.prototype.setCaretBefore = function (node) {
    var wym = this,
        range = rangy.createRange(wym._doc),
        selection = wym.selection();

    if (!wym.canSetCaretBefore(node)) {
        throw "Can't set caret before this node.";
    }

    range.selectNode(node);
    range.collapse(true);

    selection.setSingleRange(range);
};

/**
    editor.canSetCaretIn
    ====================

    Returns true if it is OK to set a collapsed selection inside a node.
    Otherwise returns false.

    @param node A node to check about.
 */
WYMeditor.editor.prototype.canSetCaretIn = function (node) {
    var wym = this;
    if (
        node.nodeType === WYMeditor.NODE_TYPE.TEXT ||
        (
            node.tagName &&
            jQuery.inArray(
                node.tagName.toLowerCase(),
                WYMeditor.NO_CARET_ELEMENTS
            ) > -1
        )
    ) {
        return false;
    }
    // Rangy issue #209.
    if (wym.isInlineNode(node)) {

        if (node.childNodes.length === 0) {
            // Not possible to work-around this issue.
            return false;
        }
        // It is possible to work-around this issue by setting a non-collapsed
        // selection. Warn about this.
        WYMeditor.console.warn("Can set a non-collapsed selection. Rangy issue #209.");
    }
    return true;
};

/**
    editor.setCaretIn
    =================

    Sets a collapsed selection to inside provided container element, at the start.

    Not to be confused with `editor.setCaretBefore`, which sets a collapsed
    selection immediately before a node.

    @param element An element to set the selection inside of, at the start.
 */
WYMeditor.editor.prototype.setCaretIn = function (element) {
    var wym = this,
        range = rangy.createRange(wym._doc),
        selection = wym.selection();

    if (
        !wym.canSetCaretIn(element)
    ) {
        throw "The element must be able to contain other elements. Perhaps " +
            " you would like to use `setCaretBefore`, instead.";
    }

    range.selectNodeContents(element);

    // Rangy issue #209.
    if (wym.isInlineNode(element)) {

        // Don't collapse the range. As long as
        // this occurs only in tests it is probably OK. Warn.
        WYMeditor.console.warn("Can't set a collapsed selection. Setting " +
           "a non-collapsed selection, instead. Rangy issue #209.");
    } else {
        range.collapse(true);
    }

    selection.setSingleRange(range);
};

/**
    editor._splitListItemContents
    =============================

    Utility

    Splits a list item into the content that should stay with the li as it is
    indented/outdent and the things that should stay at their current indent level.

    `itemContents` are what a user would consider that list's contents
    `sublistContents` are the sub-items that are nested inside the li
    (basically everything after the first ol/ul inclusive).

    The returned object has `itemContents` and `sublistContents` properties.
*/
WYMeditor.editor.prototype._splitListItemContents = function ($listItem) {
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
    editor._joinAdjacentLists
    =========================

    Utility

    Joins two lists if they are adjacent and are of the same type.

    The end result will be `listTwo`s contents being appended to `listOne`
*/
WYMeditor.editor.prototype._joinAdjacentLists = function (listOne, listTwo) {
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
    splitContent = wym._splitListItemContents($liToIndent);
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
        wym._joinAdjacentLists($prevSublist.get(0), $firstSublist.get(0));
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
    =========================

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
        wym._fixInvalidListNesting(listItem);
    }

    // Separate out the contents into things that should stay with the li as it
    // moves and things that should stay at their current level
    splitContent = wym._splitListItemContents($liToOutdent);
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
                $liToOutdent.contents().last()[0].nodeType === WYMeditor.NODE_TYPE.TEXT &&
                $subsequentParentListSiblingContent[0].nodeType === WYMeditor.NODE_TYPE.TEXT) {
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
    editor._fixInvalidListNesting
    =============================

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
WYMeditor.editor.prototype._fixInvalidListNesting = function (listItem, alreadyCorrected) {
    // Travel up the dom until we're at the root ol/ul/li
    var wym = this,
        currentNode = listItem,
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
        if (parentNode.nodeType !== WYMeditor.NODE_TYPE.ELEMENT) {
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
        WYMeditor.console.log(
            "Correcting orphaned root li before correcting invalid list nesting."
        );
        wym._correctOrphanedListItem(currentNode);
        return wym._fixInvalidListNesting(currentNode, true);
    }
    if (!jQuery(currentNode).is('ol,ul')) {
        WYMeditor.console.error("Can't correct invalid list nesting. No root list found");
        return alreadyCorrected;
    }
    return wym._fixInvalidlyNestedList(currentNode, alreadyCorrected);
};

/**
    editor._isPOrDivAfterEnterInEmptyNestedLi(container)
    ====================================================

    Detects one of the types of resulting DOM in issue #430.

    The case is when a 'p' or a 'div' are introduced into the parent 'li'.
    Since we don't allow a 'p' or a 'div' directly within 'li's it is replaced
    with a 'br'.

    Returns true if detected positively and false otherwise.

    @param container An element to check this about.
 */

WYMeditor.editor.prototype._isPOrDivAfterEnterInEmptyNestedLi = function
(container) {
    if (
        jQuery.inArray(
            container.tagName.toLowerCase(),
            WYMeditor.DocumentStructureManager.VALID_DEFAULT_ROOT_CONTAINERS
        ) > -1 &&
        container.parentNode.tagName.toLowerCase() === 'li'
    ) {
        switch (container.childNodes.length) {
        case 0:
            return true;
        case 1:
            if (
                container.childNodes[0].tagName &&
                container.childNodes[0].tagName.toLowerCase() === 'br'
            ) {
                return true;
            } else if (
                container.childNodes[0].nodeType === WYMeditor.NODE_TYPE.TEXT &&
                container.childNodes[0].data === WYMeditor.NBSP
            ) {
                return true;
            }
        }
    }
    return false;
};

/**
    editor._isSpilledListAfterEnterInEmptyLi
    ========================================

    Detects one of the types of resulting DOM in issue #430.

    In this type of resulting DOM, the contents of a `li` have been
    "spilled" after that `li`.

    Returns true if detected positively and false otherwise.

    @param container An element to check this about.
 */

WYMeditor.editor.prototype._isSpilledListAfterEnterInEmptyLi = function
    (container) {
    var wym = this;
    if (
        container.tagName.toLowerCase() === 'li' &&
        container.previousSibling &&
        wym.isListNode(container.previousSibling) &&
        container.previousSibling.previousSibling &&
        container.previousSibling.previousSibling.tagName
            .toLowerCase() === 'li' &&
        wym.isListNode(container.parentNode)
    ) {
        return true;
    }
    return false;
};

/**
    editor._handlePotentialEnterInEmptyNestedLi
    ===========================================

    Issue #430. When the caret is in an empty nested `li` and the enter key is
    pressed, browsers perform DOM manipulations that are different than what
    we desire.

    This detects two out of three types of the DOM manipulations and calls for
    their correction.

    The third type of DOM manipulation is harder to detect, but, luckily, it
    is tolerable, so it goes undetected. This results in a difference in UX
    across browsers.

    For detailed information on this please see the issue #430's description.

    @param keyPressed The code of the key that was pressed, to check whether
                      it is an enter.
    @param container The currently selected container.
 */

WYMeditor.editor.prototype._handlePotentialEnterInEmptyNestedLi = function (
    keyPressed, container) {

    if (keyPressed !== WYMeditor.KEY_CODE.ENTER) {
        // Only an enter key press can result a p/div in an empty nested list.
        return null;
    }

    var wym = this;

    if (wym._isPOrDivAfterEnterInEmptyNestedLi(container)) {
        wym._replaceNodeWithBrAndSetCaret(container);
    } else if (wym._isSpilledListAfterEnterInEmptyLi(container)) {
        wym._appendSiblingsUntilNextLiToPreviousLi(container);
        wym._replaceNodeWithBrAndSetCaret(container);
    }
};

/**
    editor._replaceNodeWithBrAndSetCaret
    ====================================

    Replaces a node with a `br` element and sets caret before it.

    If the previousSibling is inline (except for a `br`) then another `br`
    is added before.

    @param node This is the node to be replaced.
*/
WYMeditor.editor.prototype._replaceNodeWithBrAndSetCaret = function (node) {
    var wym = this,
        $node = jQuery(node);

    if (
        node.previousSibling &&
        !node.previousSibling.tagName ||
        node.previousSibling.tagName.toLowerCase() !== 'br' &&
        wym.isInlineNode(node.previousSibling)
    ) {
        $node.before('<br />');
    }

    $node.before('<br />');
    wym.setCaretBefore(node.previousSibling);
    $node.remove();
};

/**
    editor._appendSiblingsUntilNextLiToPreviousLi
    =============================================

    This corrects the type of resulting DOM from issue #430 where the
    contents of a `li` have been spilled to after that `li`.

    It only corrects the spillage itself and doesn't modify the new `li`.

    @param newLi This is the new 'li' that was created. It is supposed to
                 contain the caret.
*/

WYMeditor.editor.prototype._appendSiblingsUntilNextLiToPreviousLi =
    function (newLi) {

    var $newLi = jQuery(newLi),
        // The spilled nodes are a subset of these.
        $parentContents = $newLi.parent().contents(),
        // This is the `li` that spilled its contents.
        $sadLi = $newLi.prevAll('li').first(),
        // This is the next `li` after the newLi. If it exists, it marks the
        // end of the spill.
        $nextLi = $newLi.nextAll('li').first(),
        // The spill start index is after the source `li`.
        spillStart = $sadLi.index() + 1,
        $spilled;

    if ($nextLi.length === 1) {
        $spilled = $parentContents.slice(spillStart, $nextLi.index());
    } else {
        // There are no `li` elements after our newLi. The spill ends at the
        // end of its parent.
        $spilled = $parentContents.slice(spillStart);
    }
    $sadLi.append($spilled);
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
    editor._fixInvalidlyNestedList
    ==============================

    This is the function that actually does the list correction.
    _fixInvalidListNesting is just a helper function that first finds the root
    of the list.

    Returns true if any correction was made.

    We use a reverse preorder traversal to navigate the DOM because we might be:

    * Making nodes children of their previous sibling (in the <ol><li></li><ol>...</ol></ol> case)
    * Adding nodes at the current level (wrapping any non-li node inside a ul/ol in a new li node)

    Adapted from code at: Tavs Dokkedahl from
    http://www.jslab.dk/articles/non.recursive.preorder.traversal.part3
 */
WYMeditor.editor.prototype._fixInvalidlyNestedList = function (listNode, alreadyCorrected) {
    var rootNode = listNode,
        currentNode = listNode,
        wasCorrected = false,
        previousSibling,
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

                    if (ancestorNode.nodeType !== WYMeditor.NODE_TYPE.ELEMENT) {
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
                        if (lastContentNode.length === 1 &&
                                lastContentNode[0].nodeType === WYMeditor.NODE_TYPE.TEXT) {
                            if (nodesToMove[0].nodeType === WYMeditor.NODE_TYPE.TEXT) {
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
    editor._getCommonParentList
    ===========================

    Get the common parent ol/ul for the given li nodes. If the parent ol/ul for
    each cell isn't the same, returns null.

    @param listItems An array of list item nodes to check for a common parent
    @param getClosest If true, checks if the closest list parent to each list
                      node is the same. If false, checks if the furthest list
                      parent to each list node is the same.
 */
WYMeditor.editor.prototype._getCommonParentList = function (listItems, getClosest) {
    var firstLi,
        parentList,
        rootList,
        haveCommonParent = true;

    listItems = jQuery(listItems).filter('li');
    if (listItems.length === 0) {
        return null;
    }
    firstLi = listItems[0];
    parentList = jQuery(firstLi).parents('ol,ul');
    parentList = (getClosest ? parentList.first() : parentList.last());

    if (parentList.length === 0) {
        return null;
    }
    rootList = parentList[0];

    // Ensure that all of the li's have the same parent list
    jQuery(listItems).each(function (index, elmnt) {
        parentList = jQuery(elmnt).parents('ol,ul');
        parentList = (getClosest ? parentList.first() : parentList.last());
        if (parentList.length === 0 || parentList[0] !== rootList) {
            haveCommonParent = false;
        }
    });

    if (!haveCommonParent) {
        return null;
    }
    return rootList;
};

/**
    editor.deselect
    ===============

    Removes seletion.
*/
WYMeditor.editor.prototype.deselect = function () {
    var wym = this;

    wym.selection().removeAllRanges();
    // Blur seems to be required for IE8.
    wym.body().blur();
};

/**
    editor._getSelectedNodes
    ========================

    Returns an array of the selected and partially selected nodes.

    Returns false if there is not selection.

Returns false if there is no selection.
*/
WYMeditor.editor.prototype._getSelectedNodes = function () {
    var wym = this,
        selection = wym.selection(),
        selectedNodes;

    if (wym.hasSelection() !== true) {
        return false;
    }

    selectedNodes = selection.getAllRanges()
        .reduce(function (nodes, range) {
            return nodes.concat(range.getNodes());
        }, []);
    return selectedNodes;
};

/**
    editor._getSelectedListItems
    ============================

    Determine which `li` nodes are "selected" from the user's standpoint.

    These are the `li` nodes that they would expect to be affected by an action
    with the given selection.

    For a better understanding, comments are provided inside.

    @param selection A Rangy Selection object.
*/
WYMeditor.editor.prototype._getSelectedListItems = function (selection) {
    var wym = this,
        $selectedContainer,
        $selectedNodes,
        $selectedLis;

    if (selection.isCollapsed) {
        $selectedContainer = jQuery(wym.selectedContainer());

        if ($selectedContainer.closest('li, table').is('table')) {
            // Inside a table and not inside a list inside it. This prevents
            // the inclusion of the list item that might be an ancestor of the
            // table.
            return [];
        }
        return $selectedContainer.closest('li');
    }

    // All the selected nodes in the selection's first range.
    $selectedNodes = jQuery(wym._getSelectedNodes());

    if ($selectedNodes.closest('li, table').filter('li').length === 0) {
        // Selection is in a table before it is in a list. This prevents
        // inclusion of the list item that the table may be contained
        // in.
        return [];
    }

    // The technique is to get selected contents of the list items and then
    // get their closest parent list items. So we don't want the list elements.
    // Some list items may be empty and we do want those so we'll add them back
    // later.
    $selectedLis = $selectedNodes.not('li, ol, ul')

    // IE doesn't include the Rangy selection boundary `span` in the above
    // `.getNodes`. This effects an edge case, where a `li` contains only
    // that `span`.
    .add($selectedNodes.find('.rangySelectionBoundary'))

    // Add back the text nodes because jQuery.not always excludes them.
    .add(
        $selectedNodes.filter(
            function () {
                return wym.nodeType === WYMeditor.NODE_TYPE.TEXT;
            }
        )
    )
    .closest('li')

    // Add `li`s that are selected and are empty. Because they didn't
    // get found by `.closest`. We can safely add them because they don't
    // contain other list items so surely if they are in the selection it is
    // because the user wants to manipulate them.
    .add($selectedNodes.filter('li:empty'))

    // Exclude list items that are children of table elements that are in the
    // selection.
    .not($selectedNodes.filter('table').find('li'));

    return jQuery.unique($selectedLis.get());
};

/**
    editor._selectionOnlyInList
    ===========================

    Tests if all of the nodes within the passed selection are contained in one
    list. Returns true if all of the nodes are within one list, and returns
    false if otherwise.

    @param sel A selection to test for being entirely contained within one
               list.
*/
WYMeditor.editor.prototype._selectionOnlyInList = function (sel) {
    var wym = this,
        selStartNode,
        selEndNode,
        i;

    for (i = 0; i < sel.rangeCount; ++i) {
        selStartNode = wym.findUp(sel.getRangeAt(i).startContainer, ['li']);
        selEndNode = wym.findUp(sel.getRangeAt(i).endContainer, ['li']);

        // If the start or end node is not contained within a list item, return
        // false.
        if (!selStartNode || !selEndNode) {
            return false;
        }

        // If the two list items do not have a common parent list, return
        // false.
        if (!wym._getCommonParentList([selStartNode, selEndNode], false)) {
            return false;
        }
    }

    return true;
};

/**
    editor.indent
    =============

    Indent the selected list items via the dom.

    Only list items that have a common list will be indented.
 */
WYMeditor.editor.prototype.indent = function () {
    var wym = this,
        sel = wym.selection(),
        listItems,
        manipulationFunc,
        i;

    // First, make sure this list is properly structured
    manipulationFunc = function () {
        var selection = wym.selection(),
            selectedBlock = wym.get$CommonParent(
                selection.anchorNode,
                selection.focusNode
            )[0],
            potentialListBlock = wym.findUp(
                selectedBlock,
                ['ol', 'ul', 'li']
            );
        return wym._fixInvalidListNesting(potentialListBlock);
    };
    if (wym.restoreSelectionAfterManipulation(manipulationFunc)) {
        // We actually made some list correction
        // Don't actually perform the action if we've potentially just changed
        // the list, and maybe the list appearance as a result.
        wym.registerModification();
        return true;
    }

    // We just changed and restored the selection when possibly correcting the
    // lists
    sel = wym.selection();

    // If all of the selected nodes are not contained within one list, don't
    // perform the action.
    if (!wym._selectionOnlyInList(sel)) {
        return false;
    }

    // Gather the li nodes the user means to affect based on their current
    // selection
    listItems = wym._getSelectedListItems(sel);
    if (listItems.length === 0) {
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
    return wym.restoreSelectionAfterManipulation(manipulationFunc) &&
        wym.registerModification();
};

/**
    editor.outdent
    ==============

    Outdent a list item, accounting for firefox bugs to ensure consistent
    behavior and valid HTML.
*/
WYMeditor.editor.prototype.outdent = function () {
    var wym = this,
        sel = wym.selection(),
        listItems,
        manipulationFunc,
        i;

    // First, make sure this list is properly structured
    manipulationFunc = function () {
        var selection = wym.selection(),
            selectedBlock = wym.get$CommonParent(
                selection.anchorNode,
                selection.focusNode
            )[0],
            potentialListBlock = wym.findUp(
                selectedBlock,
                ['ol', 'ul', 'li']
            );
        return wym._fixInvalidListNesting(potentialListBlock);
    };
    if (wym.restoreSelectionAfterManipulation(manipulationFunc)) {
        // We actually made some list correction
        // Don't actually perform the action if we've potentially just changed
        // the list, and maybe the list appearance as a result.
        wym.registerModification();
        return true;
    }

    // We just changed and restored the selection when possibly correcting the
    // lists
    sel = wym.selection();

    // If all of the selected nodes are not contained within one list, don't
    // perform the action.
    if (!wym._selectionOnlyInList(sel)) {
        return false;
    }

    // Gather the li nodes the user means to affect based on their current
    // selection
    listItems = wym._getSelectedListItems(sel);

    if (listItems.length === 0) {
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
    return wym.restoreSelectionAfterManipulation(manipulationFunc) &&
        wym.registerModification();
};

/**
    editor.restoreSelectionAfterManipulation
    ========================================

    A helper function to ensure that the selection is restored to the same
    location after a potentially complicated DOM manipulation is performed. This
    also handles the case where the DOM manipulation throws an error by cleaning
    up any selection markers that were added to the DOM.

    `manipulationFunc` is a function that takes no arguments and performs the
    manipulation. It should return `true` if changes were made that could have
    potentially destroyed the selection.
*/
WYMeditor.editor.prototype.restoreSelectionAfterManipulation = function (manipulationFunc) {
    var wym = this,
        savedSelection = rangy.saveSelection(
            rangy.dom.getIframeWindow(wym._iframe)
        ),
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
    editor._insertOrderedList
    =========================

    Convert the selected block in to an ordered list.

    If the selection is already inside a list, switch the type of the nearest
    parent list to an `<ol>`. If the selection is in a block element that can be a
    valid list, place that block element's contents inside an ordered list.

    Pure dom implementation consistently cross-browser implementation of
    `execCommand(InsertOrderedList)`.
 */
WYMeditor.editor.prototype._insertOrderedList = function () {
    var wym = this,
        manipulationFunc;

    // First, make sure this list is properly structured
    manipulationFunc = function () {
        // There is a design flaw here. Especially in the case where we may
        // have multiple root-level lists or even `li` items (which shouldn't
        // happen) selected. This code seems to make our tests pass but this
        // should be considered broken.
        var potentialListBlock = jQuery(wym._getSelectedNodes())
                .parents().addBack().filter('ol, ul, li').last()[0];
        potentialListBlock = potentialListBlock || wym.selectedContainer();
        return wym._fixInvalidListNesting(potentialListBlock);
    };
    if (wym.restoreSelectionAfterManipulation(manipulationFunc)) {
        // We actually made some list correction
        // Don't actually perform the action if we've potentially just changed
        // the list, and maybe the list appearance as a result.
        wym.registerModification();
        return true;
    }

    // Actually perform the list insertion
    manipulationFunc = function () {
        return wym.insertList('ol');
    };

    return wym.restoreSelectionAfterManipulation(manipulationFunc) &&
        wym.registerModification();
};

/**
    editor._insertUnorderedList
    ===========================

    Convert the selected block in to an unordered list.

    Exactly the same as `editor.insert_orderedlist` except with `<ol>` instead.

    Pure dom implementation consistently cross-browser implementation of
    `execCommand(InsertUnorderedList)`.
 */
WYMeditor.editor.prototype._insertUnorderedList = function () {
    var wym = this,
        manipulationFunc;

    // First, make sure this list is properly structured
    manipulationFunc = function () {
        // There is a design flaw here. Especially in the case where we may
        // have multiple root-level lists or even `li` items (which shouldn't
        // happen) selected. This code seems to make our tests pass but this
        // should be considered broken.
        var potentialListBlock = jQuery(wym._getSelectedNodes())
                .parents().addBack().filter('ol, ul, li').last()[0];
        potentialListBlock = potentialListBlock || wym.selectedContainer();
        return wym._fixInvalidListNesting(potentialListBlock);
    };
    if (wym.restoreSelectionAfterManipulation(manipulationFunc)) {
        // We actually made some list correction
        // Don't actually perform the action if we've potentially just changed
        // the list, and maybe the list appearance as a result.
        wym.registerModification();
        return true;
    }

    // Actually perform the list insertion
    manipulationFunc = function () {
        return wym.insertList('ul');
    };

    return wym.restoreSelectionAfterManipulation(manipulationFunc) &&
        wym.registerModification();
};

/**
    editor.insertList
    =================

    This either manipulates existing lists or creates a new one.

    The action that will be performed depends on the contents of the
    selection and their context.

    This can result in one of:

     1. Changing the type of lists.
     2. Removing items from list.
     3. Creating a list.
     4. Nothing.

    If existing list items are selected this means either changing list type
    or de-listing. Changing list type occurs when selected list items all share
    a list of a different type than the requested. Removing items from lists
    occurs when selected list items are all of the same type as the requested.

    If no list items are selected, then, if possible, a list will be created.
    If not possible, no change is made.

    Returns `true` if a change was made, `false` otherwise.

    @param listType A string, representing the user's action, either 'ul'
                    or 'ol'.
 */
WYMeditor.editor.prototype.insertList = function (listType) {
    var wym = this,
        sel = wym.selection(),
        listItems,
        $listItems,
        $parentListsOfDifferentType,
        commonParentList,
        potentialListBlock;

    listItems = wym._getSelectedListItems(sel);
    if (listItems.length > 0) {
        // We have existing list items selected. This means either changing
        // their parent lists' types or de-listing.

        $listItems = jQuery(listItems);

        $parentListsOfDifferentType = $listItems
            .parent(':not(' + listType + ')');
        if ($parentListsOfDifferentType.length > 0) {
            // Some of the lists are of a different type than that which was
            // requested.

            // Change list type only if selected list items share a common parent
            // list. TODO: Change types over several lists:
            // https://github.com/wymeditor/wymeditor/issues/541
            commonParentList = wym._getCommonParentList(listItems, true);
            if (commonParentList) {
                wym.changeListType(commonParentList, listType);
                return true;
            }
        } else {
            // List types are the same as requested. De-list.
            wym._removeItemsFromList($listItems);
            return true;
        }
    }
    // Get a potential block element from selection that could be converted
    // into a list:
    // TODO: Use `_containerRules['root']` minus the ol/ul and
    // `_containerRules['contentsCanConvertToList']
    potentialListBlock = wym.findUp(
        wym.selectedContainer(),
        WYMeditor.POTENTIAL_LIST_ELEMENTS
    );
    if (potentialListBlock) {
        wym.convertToList(potentialListBlock, listType);
        return true;
    }
    // The user has something selected that wouldn't be a valid list
    return false;
};

WYMeditor.editor.prototype.changeListType = function (list, listType) {
    var wym = this;
    // Wrap the contents in a new list of `listType` and remove the old list
    // container.
    return wym.switchTo(list, listType);
};

WYMeditor.editor.prototype.convertToList = function (blockElement, listType) {
    var wym = this,
        $blockElement = jQuery(blockElement),
        newListHtml,
        $newList;

    // ie6 doesn't support calling wrapInner with a dom node. Build html
    newListHtml = '<' + listType + '><li></li></' + listType + '>';

    if (wym.findUp(blockElement, WYMeditor.ROOT_CONTAINERS) === blockElement) {
        // TODO: Handle ol/ul elements, since these are now in the `root`
        // containers list

        // This is a root container block, so we can just replace it with the
        // list structure
        $blockElement.wrapInner(newListHtml);
        $newList = $blockElement.children();
        $newList.unwrap();

        return $newList.get(0);
    }
    // We're converting a block that's not a root container, so we need to nest
    // this list around its contents and NOT remove the container (eg. a td
    // node).
    $blockElement.wrapInner(newListHtml);
    $newList = $blockElement.children();

    return $newList.get(0);
};

/**
    editor._removeItemsFromList
    ===========================

    De-list the provided list items.

    @param listItems A jQuery object of list items.
*/
WYMeditor.editor.prototype._removeItemsFromList = function ($listItems) {
    var wym = this,
        $listItem,
        i,
        j,
        listItemChild,
        $childNodesToTransfer,
        k,
        $childNodeToTransfer,
        rootContainer = wym.documentStructureManager.structureRules
            .defaultRootContainer,
        attributes;

    // This is left here for future reference because it may or may not be a
    // better behavior:
    // It is reasonable to de-list only a subset of the provided list items.
    // The subset are the list items which are not ancestors of any other list
    // items.
    //$listItems = $listItems.not($listItems.find('li'));

    for (i = 0; i < $listItems.length; i++) {
        $listItem = $listItems.eq(i);

        // Determine the type of element this list item will be transformed
        // into and call for this transformation.
        if ($listItem.parent().parent('li, th, td').length === 1) {
            // The list item will end up inside another list item or inside a
            // table cell. Turn it into a `span`.
            $listItem = jQuery(
                wym.switchTo(
                    $listItem[0],
                    'span',
                    false
                )
            );
        } else {
            // The list item will end up in the root of the document. Turn it
            // into a default root container.
            $listItem = jQuery(
                wym.switchTo(
                    $listItem[0],
                    rootContainer,
                    false
                )
            );
        }
        // The transformation should be complete and the element is no longer
        // a list item, hence we call it 'the de-listed element'.

        // Move the de-listed element according to its relation to its
        // sibling nodes.
        if ($listItem.parent().children().length === 1) {
            // It is the only child in the list.

            $listItem.parent().before($listItem);
            // Remove the list because it is empty.
            $listItem.next().remove();

        } else if ($listItem[0] === $listItem.parent().children().first()[0]) {
            // It is not the only child. It is the first child.

            $listItem.parent().before($listItem);
        } else if (
            $listItem[0] !== $listItem.parent().children().first()[0] &&
            $listItem[0] !== $listItem.parent().children().last()[0]
        ) {
            // It is not the first and not the last child.
            $listItem.parent().before(
                '<' + $listItem.parent()[0].tagName + '/>'
            );
            jQuery($listItem.prevAll().toArray().reverse())
                .appendTo($listItem.parent().prev());
            $listItem.parent().before($listItem);

        } else if ($listItem[0] === $listItem.parent().children().last()[0]) {
            // It is not the only child. It is the last child.
            $listItem.parent().after($listItem);
        }
        // The de-listed element should now be at it's final destination.
        // Now, deal with its contents.
        for (j = 0; j < $listItem.contents().length; j++) {
            listItemChild = $listItem.contents()[j];
            if (
                wym.isBlockNode(listItemChild) &&
                // Prevents a rangy selection boundary element from interfering.
                listItemChild.className !== 'rangySelectionBoundary' &&
                listItemChild.tagName.toLowerCase() !== 'br'
            ) {
                // We have hit the first block child. From this child onward,
                // the contents will be moved to after the de-listed element.
                $childNodesToTransfer = $listItem.contents().slice(j);
                if (
                    $listItem[0].tagName.toLowerCase() ===
                        rootContainer
                ) {
                    // The destination of these nodes is the root element.
                    // Prepare them as such.
                    for (k = 0; k < $childNodesToTransfer.length; k++) {
                        $childNodeToTransfer = $childNodesToTransfer.eq(k);
                        if (
                            $childNodeToTransfer[0]
                                .nodeType === WYMeditor.NODE_TYPE.TEXT
                        ) {
                            $childNodeToTransfer.wrap(
                                '<' + rootContainer + ' />'
                            );
                        } else if (
                            $childNodeToTransfer[0].tagName &&
                            !(wym.isBlockNode($childNodeToTransfer[0])) &&
                            $childNodeToTransfer[0].tagName
                                .toLowerCase() !== 'br'
                        ) {
                            wym.switchTo(
                                $childNodesToTransfer[k],
                                rootContainer,
                                false
                            );
                        }
                    }
                }
                // The contents should be ready now.
                $listItem.after($listItem.contents().slice(j));
                // The loop was for finding the first block element.
                break;
            }
        }
        // `br`s may have been transferred to the root container. They don't
        // belong there.
        wym.$body().children('br').remove();

        if ($listItem[0].tagName.toLowerCase() === 'span') {
            // Get rid of empty `span`s and ones that contain only `br`s.
            if (
                $listItem.contents(':not(.rangySelectionBoundary)')
                    .length === 0 ||
                $listItem.contents(':not(.rangySelectionBoundary)').length ===
                    $listItem.contents('br').length
            ) {
                // The Rangy selection boundary `span` may be inside.
                $listItem.before($listItem.contents('.rangySelectionBoundary'));
                $listItem.remove();
            } else {
                // The `span` wasn't removed.

                // Add `br` elements that may be necessary because by turning
                // a `li` element into a `span` element we turn a block
                // type element into an inline type element.
                if (
                    $listItem[0].previousSibling &&
                    $listItem[0].previousSibling.nodeType === WYMeditor
                        .NODE_TYPE.TEXT ||

                    $listItem.prevAll(':not(.rangySelectionBoundary)')
                        .length > 0 &&
                    wym.isBlockNode(
                        $listItem.prevAll(':not(.rangySelectionBoundary)')[0]
                    ) === false
                ) {
                    $listItem.before('<br />');
                }
                if (
                    $listItem[0].nextSibling &&
                    $listItem[0].nextSibling.nodeType === WYMeditor
                        .NODE_TYPE.TEXT ||

                    $listItem.nextAll(':not(.rangySelectionBoundary)')
                        .length > 0 &&
                    wym.isBlockNode(
                        $listItem.nextAll(':not(.rangySelectionBoundary)')[0]
                    ) === false
                ) {
                    $listItem.after('<br />');
                }

                // If the de-listed element has no meaningful attributes, there is
                // no use for it being a span.
                attributes = $listItem[0].attributes;
                wym.unwrapIfMeaninglessSpan($listItem[0]);
            }
        }
    }

    // Reintroduce any necessary DOM-level corrections for editing purposes
    wym.prepareDocForEditing();
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

    var wym = this,
        table = wym._doc.createElement(WYMeditor.TABLE),
        newRow = null,
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
        wym.findUp(wym.selectedContainer(), WYMeditor.POTENTIAL_TABLE_INSERT_ELEMENTS)
    ).get(0);

    if (!container || !container.parentNode) {
        // No valid selected container. Put the table at the end.
        wym.$body().append(table);

    } else if (jQuery.inArray(container.nodeName.toLowerCase(),
                       WYMeditor.INLINE_TABLE_INSERTION_ELEMENTS) > -1) {
        // Insert table after selection if container is allowed to have tables
        // inserted inline.
        selectedNode = wym.selection().focusNode;

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
    wym._afterInsertTable(table);
    wym.prepareDocForEditing();

    wym.registerModification();
    return table;
};

/**
    editor._afterInsertTable
    ========================

    Handle cleanup/normalization after inserting a table. Different browsers
    need slightly different tweaks.
*/
WYMeditor.editor.prototype._afterInsertTable = function () {
};

WYMeditor.editor.prototype._listen = function () {
    var wym = this;

    jQuery(wym._doc).bind('paste', function () {
        wym._handlePasteEvent();
    });
};

WYMeditor.editor.prototype._handlePasteEvent = function () {
    var wym = this;

    // The paste event happens *before* the paste actually occurs.
    // Use a timer to delay execution until after whatever is being pasted has
    // actually been added.
    window.setTimeout(
        function () {
            jQuery(wym.element).trigger(
                WYMeditor.EVENTS.postBlockMaybeCreated,
                wym
            );
        },
        20
    );
};

/**
    WYMeditor.editor._selectSingleNode
    ==================================

    Sets selection to a single node, exclusively.
    Not public API because not tested enough.
    For example, what happens when selecting containing element, this way?
*/
WYMeditor.editor.prototype._selectSingleNode = function (node) {
    var wym = this,
        selection,
        nodeRange;

    if (!node) {
        throw "Expected a node";
    }
    selection = wym.selection();
    nodeRange = rangy.createRangyRange();
    nodeRange.selectNode(node);

    selection.setSingleRange(nodeRange);
};

/**
    WYMeditor.editor._initSkin
    ==========================

    Apply the appropriate CSS class to "activate" that skin's CSS and call the
    skin's javascript `init` method.
*/
WYMeditor.editor.prototype._initSkin = function () {
    var wym = this;
    // Put the classname (ex. wym_skin_default) on wym_box
    jQuery(wym._box).addClass("wym_skin_" + wym._options.skin);

    // Init the skin, if needed
    if (typeof WYMeditor.SKINS[wym._options.skin] !== "undefined") {
        if (typeof WYMeditor.SKINS[wym._options.skin].init === "function") {
            WYMeditor.SKINS[wym._options.skin].init(wym);
        }
    } else {
        WYMeditor.console.warn(
            "Chosen skin _" + wym.options.skin + "_ not found."
        );
    }
};

/**
    WYMeditor.editor.body
    =====================

    Returns the document's body element.
*/
WYMeditor.editor.prototype.body = function () {
    var wym = this,
        body;

    if (!wym._doc.body) {
        throw "The document seems to have no body element.";
    }

    body = wym._doc.body;

    if (
        !body.tagName ||
        body.tagName.toLowerCase() !== 'body'
    ) {
        throw "The document's body doesn't seem to be a `body` element.";
    }

    return body;
};

/**
    WYMEditor.editor.$body
    ======================

    Returns a jQuery object of the document's body element.
*/
WYMeditor.editor.prototype.$body = function () {
    var wym = this,
        body;

    body = wym.body();
    return jQuery(body);
};

/**
    WYMeditor.editor.doesElementContainSelection
    ============================================

    Returns ``true`` if the supplied element contains at least part of the
    selection.
    Otherwise returns ``false``.
*/
WYMeditor.editor.prototype.doesElementContainSelection = function (element) {
    var wym = this,
        $element,
        selectedContainer,
        $selectedNodes,
        i,
        $selectedNodeAncestors,
        j;

    if (wym.hasSelection() !== true) {
        return false;
    }
    $element = jQuery(element);

    if (wym.selection().isCollapsed === true) {
        selectedContainer = wym.selectedContainer();

        if (element === selectedContainer) {
            return true;
        }
        if ($element.has(selectedContainer).length > 0) {
            return true;
        }
        return false;
    }

    // For non-collapsed selections.
    // We could have used the following, but it
    // doesn't work in IE8.
    // if ($element.has(wym._getSelectedNodes()).length > 0) {
    //     return true;
    // }
    $selectedNodes = jQuery(wym._getSelectedNodes());
    for (i = 0; i < $selectedNodes.length; i++) {
        $selectedNodeAncestors = $selectedNodes.eq(i).parents();
        for (j = 0; j < $selectedNodeAncestors.length; j++) {
            if ($selectedNodeAncestors[j] === element) {
                return true;
            }
        }
    }

    return false;
};
