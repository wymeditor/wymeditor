WYMeditor.SKINS.seamless = {
    init: function (wym) {
        var This = WYMeditor.SKINS.seamless;

        This.initChrome(wym);

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
        jQuery(wym._doc).ready(function () {
            This.resizeIframe(wym);
        });

        // Detect possible Block creation so that we can always keep the iframe
        // properly resized and the current container in view
        jQuery(wym._element).bind(
            WYMeditor.EVENTS.postBlockMaybeCreated,
            This.resizeAndScrollIfNeeded
        );
    },
    initChrome: function (wym) {
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
            alert("containerLowestY: " + containerLowestY +
                    "\niframeOffsetTop: " + iframeOffsetTop +
                    "\ncontainerOffset.top: " + containerOffset.top +
                    "\nouterHeight: " + $container.outerHeight()
            );
            alert("--");
            alert("viewportLowestY: " + viewportLowestY +
                    "\nwindow scrollTop: " + $window.scrollTop() +
                    "\nwindow: " + $window.height()
            );
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
    },
    WYM_OPTS: {
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
    }
};
