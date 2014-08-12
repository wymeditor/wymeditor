/* jshint evil: true, camelcase: false, maxlen: 100 */
/* global -$ */
"use strict";

// This file contains the WYMeditor initializer.

/**
    WYMeditor._init
    ===============

    WYMeditor's initializer.

    @param wym A WYMeditor instance to assign to this initializer.
*/
WYMeditor._init = function (wym) {
    var init = this;

    init._wym = wym;

    return this;
};

/**
    WYMeditor._init._start
    ======================

    Start the initialization procedure of a WYMeditor editor instance.
*/
WYMeditor._init.prototype._start = function () {
    var init = this,
        wym = init._wym,
        SaxListener,
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

    if (jQuery.isFunction(wym._options.preInit)) {
        wym._options.preInit(wym);
    }

    wym.parser = null;
    wym.helper = null;

    SaxListener = new WYMeditor.XhtmlSaxListener();
    wym.parser = new WYMeditor.XhtmlParser(SaxListener);

    wym.helper = new WYMeditor.XmlHelper();

    // Load wymbox
    wym._box = jQuery(wym._element).hide().after(
        wym._options.boxHtml
    ).next().addClass(
        'wym_box_' + wym._index
    );

    // Store the instance index and replaced element in wymbox
    // but keep it compatible with jQuery < 1.2.3, see #122
    if (jQuery.isFunction(jQuery.fn.data)) {
        jQuery.data(wym._box.get(0), WYMeditor.WYM_INDEX, wym._index);
        jQuery.data(wym._element.get(0), WYMeditor.WYM_INDEX, wym._index);
    }

    h = WYMeditor.Helper;

    // Construct the iframe
    iframeHtml = wym._options.iframeHtml;
    iframeHtml = h.replaceAll(iframeHtml, WYMeditor.INDEX, wym._index);
    iframeHtml = h.replaceAll(
        iframeHtml,
        WYMeditor.IFRAME_BASE_PATH,
        wym._options.iframeBasePath
    );

    // Construct wymbox
    boxHtml = jQuery(wym._box).html();

    boxHtml = h.replaceAll(boxHtml, WYMeditor.LOGO, wym._options.logoHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.TOOLS, wym._options.toolsHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.CONTAINERS, wym._options.containersHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.CLASSES, wym._options.classesHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.HTML, wym._options.htmlHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.IFRAME, iframeHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.STATUS, wym._options.statusHtml);

    // Construct the tools list
    aTools = eval(wym._options.toolsItems);
    sTools = "";

    for (i = 0; i < aTools.length; i += 1) {
        oTool = aTools[i];
        sTool = '';
        if (oTool.name && oTool.title) {
            sTool = wym._options.toolsItemHtml;
        }
        sTool = h.replaceAll(sTool, WYMeditor.TOOL_NAME, oTool.name);
        sTool = h.replaceAll(
            sTool,
            WYMeditor.TOOL_TITLE,
            wym._options.stringDelimiterLeft + oTool.title + wym._options.stringDelimiterRight
        );
        sTool = h.replaceAll(sTool, WYMeditor.TOOL_CLASS, oTool.css);
        sTools += sTool;
    }

    boxHtml = h.replaceAll(boxHtml, WYMeditor.TOOLS_ITEMS, sTools);

    // Construct the classes list
    aClasses = eval(wym._options.classesItems);
    sClasses = "";

    for (i = 0; i < aClasses.length; i += 1) {
        oClass = aClasses[i];
        sClass = '';
        if (oClass.name && oClass.title) {
            sClass = wym._options.classesItemHtml;
        }
        sClass = h.replaceAll(sClass, WYMeditor.CLASS_NAME, oClass.name);
        sClass = h.replaceAll(sClass, WYMeditor.CLASS_TITLE, oClass.title);
        sClasses += sClass;
    }

    boxHtml = h.replaceAll(boxHtml, WYMeditor.CLASSES_ITEMS, sClasses);

    // Construct the containers list
    aContainers = eval(wym._options.containersItems);
    sContainers = "";

    for (i = 0; i < aContainers.length; i += 1) {
        oContainer = aContainers[i];
        sContainer = '';
        if (oContainer.name && oContainer.title) {
            sContainer = wym._options.containersItemHtml;
        }
        sContainer = h.replaceAll(
            sContainer,
            WYMeditor.CONTAINER_NAME,
            oContainer.name
        );
        sContainer = h.replaceAll(sContainer, WYMeditor.CONTAINER_TITLE,
            wym._options.stringDelimiterLeft +
            oContainer.title +
            wym._options.stringDelimiterRight);
        sContainer = h.replaceAll(
            sContainer,
            WYMeditor.CONTAINER_CLASS,
            oContainer.css
        );
        sContainers += sContainer;
    }

    boxHtml = h.replaceAll(boxHtml, WYMeditor.CONTAINERS_ITEMS, sContainers);

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
        wym._init._onEditorIframeLoad();
    });

    wym._element.attr('data-wym-initialized', 'yes');

    init._initSkin();
};

/**
    WYMeditor._init._assignWymDoc
    =============================

    Assigns an editor's document to the `_doc` property.
*/
WYMeditor._init.prototype._assignWymDoc = function () {
    var init = this,
        wym = init._wym;

    wym._doc = wym._iframe.contentDocument;
};

/**
    WYMeditor._init._isDesignModeOn
    ===============================

    Returns true if the designMode property of the editor's document is "On".
    Returns false, otherwise.
*/
WYMeditor._init.prototype._isDesignModeOn = function () {
    var init = this,
        wym = init._wym;

    if (wym._doc.designMode === "On") {
        return true;
    }
    return false;
};

/**
    WYMeditor._init._onEditorIframeLoad
    ===================================

    This is a part of the initialization of an editor.

    The initialization procedure of an editor turns asynchronous because part of
    it must occur after the loading of the editor's Iframe.

    This function is suppposed to be the event handler of the loading of the
    editor's Iframe. Therefore, it is the first step since the initialization
    procedure gets asynchronous.

    @param wym The editor instance that's being initialized.
*/
WYMeditor._init.prototype._onEditorIframeLoad = function () {
    var init = this,
        wym = init._wym;

    init._assignWymDoc();
    wym._doc.designMode = "On";
    init._afterDesignModeOn();
};

/**
    WYMeditor._init._UiQuirks
    =========================

    Hook for quirks regarding fixing stuff in the UI.

    Conveniently called after plugins had a chance to modify the UI.
*/
WYMeditor._init.prototype._UiQuirks = function () {
    return;
};

/**
    WYMeditor._init._afterDesignModeOn
    ==================================

    This is part of the initialization of an editor, designed to be called
    after the editor's document is in designMode.
*/
WYMeditor._init.prototype._afterDesignModeOn = function () {
    var init = this,
        wym = init._wym;

    init._assignWymDoc();

    wym._doc.title = wym._index;

    // Set the text direction.
    jQuery('html', wym._doc).attr('dir', wym._options.direction);

    init._docEventQuirks();

    init._initializeDocumentContent();

    if (jQuery.isFunction(wym._options.preBind)) {
        wym._options.preBind(wym);
    }

    init._bindUIEvents();

    wym.iframeInitialized = true;

    if (jQuery.isFunction(wym._options.postInit)) {
        wym._options.postInit(wym);
    }

    // Must be called after `postInit` because that is plugin's chance to alter
    // the UI.
    init._UiQuirks();

    // Add event listeners to doc elements, e.g. images
    init._listen();

    jQuery(wym._element).trigger(
        WYMeditor.EVENTS.postIframeInitialization,
        wym
    );
};

/**
    WYMeditor._init._initializeDocumentContent
    ==========================================

    Populates the editor's document with the initial content, according to the
    configuration and/or the textarea element's value.
*/
WYMeditor._init.prototype._initializeDocumentContent = function () {
    var init = this,
        wym = init._wym;

    if (wym._options.html) {
        // Populate from the configuration option
        wym._html(wym._options.html);
    } else {
        // Populate from the textarea element
        wym._html(wym._element[0].value);
    }
};

/**
    WYMeditor._init._docEventQuirks
    ===============================

    Misc. event bindings on the editor's document, that may be required.
*/
WYMeditor._init.prototype._docEventQuirks = function () {
    return;
};

/**
    WYMeditor._init._bindUIEvents
    =============================

    Binds event handlers for the UI elements.
*/
WYMeditor._init.prototype._bindUIEvents = function () {
    var init = this,
        wym = init._wym,
        $html_val;

    // Tools buttons
    jQuery(wym._box).find(wym._options.toolSelector).click(function () {
        wym.exec(jQuery(this).attr(WYMeditor.NAME));
        return false;
    });

    // Containers buttons
    jQuery(wym._box).find(wym._options.containerSelector).click(function () {
        wym.mainContainer(jQuery(this).attr(WYMeditor.NAME));
        return false;
    });

    // Handle keyup event on the HTML value textarea: set the editor value
    // Handle focus/blur events to check if the element has focus, see #147
    $html_val = jQuery(wym._box).find(wym._options.htmlValSelector);
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
    jQuery(wym._box).find(wym._options.classSelector).click(function () {
        var aClasses = eval(wym._options.classesItems),
            sName = jQuery(this).attr(WYMeditor.NAME),

            oClass = WYMeditor.Helper.findByName(aClasses, sName),
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
};

/**
    WYMeditor._init._initSkin
    =========================

    Apply the appropriate CSS class to "activate" that skin's CSS and call the
    skin's javascript `init` method.
*/
WYMeditor._init.prototype._initSkin = function () {
    var init = this,
        wym = init._wym;

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

WYMeditor._init.prototype._listen = function () {
    var init = this,
        wym = init._wym;

    // Don't use jQuery.find() on the iframe body
    // because of MSIE + jQuery + expando issue (#JQ1143)

    jQuery(wym._doc.body).bind("mousedown", function (e) {
        wym.mousedown(e);
    });

    jQuery(wym._doc).bind('paste', function () {
        wym.handlePasteEvent();
    });
};
