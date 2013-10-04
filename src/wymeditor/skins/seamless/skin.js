/* globals -$ */
"use strict";

// Add classes to an element based on its current location relative to top and
// or bottom offsets.
// Useful for affixing an element on the page within a certain vertical range.
// Based largely off of the bootstrap affix plugin
// https://github.com/twbs/bootstrap/blob/master/js/affix.js
(function ($) {
    var Affix = function (element, options) {
        this.options = $.extend({}, $.fn.wymAffix.defaults, options);
        this.$window = $(window);

        this.$window.on(
            'scroll.affix.data-api',
            $.proxy(this.checkPosition, this)
        );
        this.$window.on(
            'click.affix.data-api',
            $.proxy(
                function () {
                    setTimeout(
                        $.proxy(this.checkPosition, this),
                        1
                    );
                },
                this
            )
        );
        this.$element = $(element);
        this.checkPosition();
    };

    Affix.prototype.checkPosition = function () {
        if (!this.$element.is(':visible')) {
            return;
        }

        var scrollTop = this.$window.scrollTop()
          , offset = this.options.offset
          , offsetBottom = offset.bottom
          , offsetTop = offset.top
          , reset = 'affix affix-top affix-bottom'
          , desiredAffixType
          , isBelowTop = true
          , isAboveBottom = true;

        if (typeof offset !== 'object') {
            offsetBottom = offsetTop = offset;
        }
        if (typeof offsetTop === 'function') {
            offsetTop = offset.top();
        }
        if (typeof offsetBottom === 'function') {
            offsetBottom = offset.bottom();
        }

        if (offsetTop !== null) {
            isBelowTop = scrollTop > offsetTop;
        }
        if (offsetBottom !== null) {
            isAboveBottom = scrollTop + this.$element.height() < offsetBottom;
        }

        if (isBelowTop && isAboveBottom) {
            desiredAffixType = 'affix';
        } else if (isAboveBottom === false) {
            // We're below the bottom offset
            desiredAffixType = 'affix-bottom';
        } else {
            desiredAffixType = 'affix-top';
        }

        if (this.currentAffixType === desiredAffixType) {
            // We're already properly-affixed. No changes required.
            return;
        }

        this.$element.removeClass(reset).addClass(desiredAffixType);

        this.currentAffixType = desiredAffixType;
    };


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

    $.fn.wymAffix = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('affix')
                , options = typeof option === 'object' && option;

            if (!data) {
                $this.data(
                    'affix',
                    (data = new Affix(this, options))
                );
            }
            if (typeof option === 'string') {
                data[option]();
            }
        });
    };

    $.fn.wymAffix.Constructor = Affix;

    $.fn.wymAffix.defaults = {
        offset: 0
    };
}(jQuery));

WYMeditor.SKINS.seamless = {
    OPTS: {
        iframeHtml: [""
        , '<div class="wym_iframe wym_section">'
            , '<iframe src="' + WYMeditor.IFRAME_BASE_PATH + 'wymiframe.html" '
                , 'frameborder="0" '
                , 'scrolling="no" '
                , 'onload="this.contentWindow.parent.WYMeditor.INSTANCES['
                , WYMeditor.INDEX + '].initIframe(this)"'
                , '>'
            , '</iframe>'
        , '</div>'
        ].join(""),
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
        var This = WYMeditor.SKINS.seamless,
            $dropdowns = jQuery(
            [
                wym._options.containersSelector
                , wym._options.classesSelector
            ].join(', '),
            wym._box
        ),
            $toolbar,
            $areaTop;

        $areaTop = jQuery("div.wym_area_top", wym._box);

        $dropdowns.appendTo($areaTop);
        $dropdowns.addClass("wym_dropdown");
        $dropdowns.css({
            "margin-right": "10px",
            "width": "120px",
            "float": "left"
        });
        // Make dropdowns also work on click, for mobile devices
        jQuery(".wym_dropdown", wym._box).click(
            function () {
                jQuery(this).toggleClass("hover");
            }
        );

        // The toolbar uses buttons
        $toolbar = jQuery(wym._options.toolsSelector, wym._box);
        $toolbar.addClass("wym_buttons");
        $toolbar.css({"margin-right": "10px", "float": "left"});

        This.affixTopControls(wym);

    },
    affixTopControls: function (wym) {
        // Affix the top area, which contains the toolbar and containers, to
        // the top of the screen so that we can see it, even if we're scrolled
        // down.
        var $areaTop,
            $offsetWrapper,
            earlyScrollPixels = 5,
            usePlaceholderWidth,
            $placeholder;

        $areaTop = jQuery("div.wym_area_top", wym._box);

        // Use a wrapper so we can keep the toolbar styling consistent
        $offsetWrapper = jQuery(
            '<div class="wym_skin_seamless wym_area_top_wrapper">'
        );
        $areaTop.wrap($offsetWrapper);
        $offsetWrapper = $areaTop.parent();

        // Add another, non-affixed wrapper to stick around and hold vertical
        // space. This avoids the "jump" when the toolbar switches to being
        // affixed
        $offsetWrapper.wrap('<div class="wym_area_top_affix_placeholder">');
        $placeholder = $offsetWrapper.parent();
        $placeholder.height($areaTop.height());

        usePlaceholderWidth = function () {
            // Hard-code the offsetWrapper width so that when this floats to
            // the top, it doesn't expand to take up all of the room to the
            // right
            $offsetWrapper.width($placeholder.width());
        };
        usePlaceholderWidth();
        jQuery(window).resize(usePlaceholderWidth);

        $offsetWrapper.wymAffix({
            offset: {
                top: function () {
                    return $placeholder.offset().top - earlyScrollPixels;
                },
                bottom: function () {
                    return $placeholder.offset().top +
                        wym.seamlessSkinIframeHeight;
                }
            }
        });
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
            wym.seamlessSkinIframeHeight = desiredHeight;
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

        containerLowestY = iframeOffsetTop + containerOffset.top;
        containerLowestY += $container.outerHeight();
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
