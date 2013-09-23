WYMeditor.SKINS.seamless = {
    OPTS: {
        iframeHtml: String() +
            '<div class="wym_iframe wym_section">' +
                '<iframe src="' + WYMeditor.IFRAME_BASE_PATH + 'wymiframe.html" ' +
                    'frameborder="0" ' +
                    'scrolling="no" ' +
                    'onload="this.contentWindow.parent.WYMeditor.INSTANCES[' +
                    WYMeditor.INDEX + '].initIframe(this)"' +
                    '>' +
                '</iframe>' +
            "</div>",
        // After Iframe initialization, check if we're ready to perform the
        // first resize every this many ms
        initIframeCheckFrequency: 50
    },
    init: function (wym) {
        var This = WYMeditor.SKINS.seamless;

        wym.seamlessSkinOpts = {
            initIframeCheckFrequency: This.initIframeCheckFrequency,
            initialIframeResizeTimer: null
        };
        This.initUIChrome(wym);

        // The Iframe isn't initialized at this point, so we'll need to wait
        // until it is before attempting to use it.
        jQuery(wym._element).bind(
            WYMeditor.EVENTS.postIframeInitialization,
            This.postIframeInit
        );
    },
    postIframeInit: function (e, wym) {
        var This = WYMeditor.SKINS.seamless;

        // Perform an initial resize, if necessary
        This.resizeIframeOnceBodyExists(wym);

        // Detect possible Block creation so that we can always keep the iframe
        // properly resized and the current container in view
        jQuery(wym._element).bind(
            WYMeditor.EVENTS.postBlockMaybeCreated,
            This.resizeAndScrollIfNeeded
        );
    },
    initUIChrome: function (wym) {
        // Initialize the toolbar and classes/containers selectors

        // The classes and containers sections are dropdowns to the right of
        // the toolbar at the top
        jQuery(
            wym._options.containersSelector + ', ' +
            wym._options.classesSelector,
            wym._box
        ).appendTo(
            jQuery("div.wym_area_top", wym._box)
        ).addClass("wym_dropdown")
          .css(
            {
                "margin-right": "10px",
                "width": "120px",
                "float": "left"
            }
          );

        // The toolbar uses buttons
        jQuery(wym._options.toolsSelector, wym._box)
          .addClass("wym_buttons")
          .css({"margin-right": "10px", "float": "left"});
    },
    resizeIframeOnceBodyExists: function (wym) {
        // In IE, the wym._doc DOMLoaded event doesn't mean the iframe will
        // actually have a body. We need to wait until the body actually exists
        // before trying to set the initial hight of the iframe, so we hack
        // this together with setTimeout.
        var This = WYMeditor.SKINS.seamless,
            scrollHeightCalcFix;

        if (wym.seamlessSkinOpts.initialIframeResizeTimer) {
            // We're handling a timer, clear it
            window.clearTimeout(
                wym.seamlessSkinOpts.initialIframeResizeTimer
            );
            wym.seamlessSkinOpts.initialIframeResizeTimer = null;
        }

        if (typeof wym._doc.body === "undefined" || wym._doc.body === null) {
            // Body isn't ready
            wym.seamlessSkinOpts.initialIframeResizeTimer = window.setTimeout(
                function () {
                    This.resizeIframeOnceBodyExists(wym);
                },
                wym.seamlessSkinOpts.initIframeCheckFrequency
            );
            return;
        }
        // The body is ready, so let's get to resizing
        // For some reason, at least IE7 requires at least one access to the
        // scrollHeight before it gives a real value. I was unable to find any
        // kind of feature detection that would work here and the fix of adding
        // an extra access here doesn't have any real negative impact on the
        // other browsers, but does fix IE7's behavior.
        scrollHeightCalcFix = wym._doc.body.scrollHeight;
        This.resizeIframe(wym);
    },
    resizeIframe: function (wym) {
        var desiredHeight = wym._doc.body.scrollHeight,
            $iframe = jQuery(wym._iframe),
            currentHeight = $iframe.height();

        if (currentHeight !== desiredHeight) {
            $iframe.height(desiredHeight);
            return true;
        }
        return false;
    },
    scrollIfNeeded: function (wym) {
        var iframeOffset = jQuery(wym._iframe).offset(),
            iframeOffsetTop = iframeOffset.top,
            $container = jQuery(wym.selected()),
            containerOffset = $container.offset(),
            viewportLowestY,
            containerLowestY,
            newScrollTop,
            extraScroll = 20,
            scrollDiff,
            $window = jQuery(window),
            $body = jQuery(document.body);

        containerLowestY = iframeOffsetTop + containerOffset.top + $container.outerHeight();
        viewportLowestY = $window.scrollTop() + $window.height();
        scrollDiff = containerLowestY - viewportLowestY;
        if (scrollDiff > 0) {
            // Part of our selected container isn't
            // visible, so we need to scroll down.
            newScrollTop = $body.scrollTop() + scrollDiff + extraScroll;
            $body.scrollTop(newScrollTop);
        }
    },
    resizeAndScrollIfNeeded: function (e, wym) {
        // Scroll the page so that our current selection
        // within the iframe is actually in view.
        var This = WYMeditor.SKINS.seamless,
            resizeOccurred = This.resizeIframe(wym);
        if (resizeOccurred !== true) {
            return;
        }
        This.scrollIfNeeded(wym);
    }
};
