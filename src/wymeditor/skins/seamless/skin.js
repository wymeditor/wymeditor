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

        this.$window.bind(
            'scroll.affix.data-api',
            $.proxy(this.checkPosition, this)
        );
        this.$window.bind(
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
        var $elements = this;
        return $elements.each(function () {
            var element = this,
                $element = $(element)
                , data = $element.data('affix')
                , options = typeof option === 'object' && option;

            if (!data) {
                $element.data(
                    'affix',
                    (data = new Affix(element, options))
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
                , 'border="0" '
                , 'scrolling="no" '
                , 'marginheight="0px" '
                , 'marginwidth="0px" '
                , '>'
            , '</iframe>'
        , '</div>'
        ].join(""),
        // After Iframe initialization, check if we're ready to perform the
        // first resize every this many ms
        initIframeCheckFrequency: 50,
        // After load or after images are inserted, check every this many ms to
        // see if they've properly set their height.
        imagesLoadedCheckFrequency: 300,
        // After this many ms, give up on images finishing loading. Some images
        // might never load due to network connectivity or bad links.
        imagesLoadedCheckTimeout: 5000
    },
    init: function (wym) {
        var This = WYMeditor.SKINS.seamless;

        // TODO: Find a unified strategy for dealing with loading polyfills
        // This is a polyfill for old IE
        if (!Date.now) {
            Date.now = function now() {
                return new Date().getTime();
            };
        }

        wym.seamlessSkinOpts = jQuery.extend(
            This.OPTS,
            {
                initialIframeResizeTimer: null,
                resizeAfterImagesLoadTimer: null,
                _imagesLoadedCheckStartedTime: 0,
                minimumHeight: jQuery(wym.element).height()
            }
        );
        This.initUIChrome(wym);

        // The Iframe isn't initialized at this point, so we'll need to wait
        // until it is before attempting to use it.
        jQuery(wym.element).bind(
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
        jQuery(wym.element).bind(
            WYMeditor.EVENTS.postBlockMaybeCreated,
            function () {
                This.resizeAndScrollIfNeeded(wym);
            }
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
        // Make dropdowns also work on click, for mobile devices
        jQuery(".wym_dropdown", wym._box).click(
            function () {
                var dropDown = this;
                jQuery(dropDown).toggleClass("hover");
            }
        );

        // The toolbar uses buttons
        $toolbar = jQuery(wym._options.toolsSelector, wym._box);
        $toolbar.addClass("wym_buttons");

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
        This.resizeIframeOnceImagesLoaded(wym);
    },
    resizeIframeOnceImagesLoaded: function (wym) {
        // Even though the body may be "loaded" from a DOM even standpoint,
        // that doesn't mean that images have yet been retrieved or that their
        // heights have been determined. If an image's height pops in after
        // we've calculated the iframe height, the iframe will be too short.
        var This = WYMeditor.SKINS.seamless,
            images,
            imagesLength,
            i = 0,
            allImagesLoaded = true,
            skinOpts = wym.seamlessSkinOpts,
            timeWaited;

        if (typeof skinOpts._imagesLoadedCheckStartedTime === "undefined" ||
                skinOpts._imagesLoadedCheckStartedTime === 0) {
            skinOpts._imagesLoadedCheckStartedTime = Date.now();
        }

        if (skinOpts.resizeAfterImagesLoadTimer !== null) {
            // We're handling a timer, clear it
            window.clearTimeout(
                skinOpts.resizeAfterImagesLoadTimer
            );
            skinOpts.resizeAfterImagesLoadTimer = null;
        }

        images = wym.$body().find('img');
        imagesLength = images.length;

        if (imagesLength === 0) {
            // No images. No need to worry about resizing based on them.
            return;
        }

        for (i = 0; i < imagesLength; i += 1) {
            if (!This._imageIsLoaded(images[i])) {
                // If any image isn't loaded, we're not done
                allImagesLoaded = false;
                break;
            }
        }
        // Even if all of the images haven't loaded, we can still be more
        // correct by accounting for any that have.
        This.resizeAndScrollIfNeeded(wym);

        if (allImagesLoaded === true) {
            // Clean up the timeout timer for subsequent calls
            skinOpts._imagesLoadedCheckStartedTime = 0;
            return;
        }

        timeWaited = Date.now() - skinOpts._imagesLoadedCheckStartedTime;
        if (timeWaited > skinOpts.imagesLoadedCheckTimeout) {
            // Clean up the timeout timer for subsequent calls
            skinOpts._imagesLoadedCheckStartedTime = 0;
            // We've waited long enough. The images might never load.
            // Don't set another timer.
            return;
        }

        // Let's check again in after a delay
        skinOpts.resizeAfterImagesLoadTimer = window.setTimeout(
            function () {
                This.resizeIframeOnceImagesLoaded(wym);
            },
            skinOpts.imagesLoadedCheckFrequency
        );
    },
    _imageIsLoaded: function (img) {
        if (img.complete !== true) {
            return false;
        }

        if (typeof img.naturalWidth !== "undefined" &&
                img.naturalWidth === 0) {
            return false;
        }

        return true;
    },
    _getIframeHeightStrategy: function (wym) {
        // For some browsers (IE8+ and FF), the scrollHeight of the body
        // doesn't seem to include the top and bottom margins of the body
        // relative to the HTML. This leaves the editing "window" smaller
        // than required, which results in weird overlaps at the start/end.
        // For those browsers, the HTML element's scrollHeight is more
        // reliable.
        // Let's detect which kind of browser we're dealing with one time
        // so we can just do the right thing in the future.
        var bodyScrollHeight,
            $htmlElement,
            htmlElementHeight,
            htmlElementScrollHeight,
            heightStrategy;

        $htmlElement = jQuery(wym._doc).children().eq(0);

        bodyScrollHeight = wym._doc.body.scrollHeight;
        htmlElementHeight = $htmlElement.height();
        htmlElementScrollHeight = $htmlElement[0].scrollHeight;

        if (WYMeditor.isInternetExplorerPre11()) {
            // The htmlElementScrollHeight is fairly reliable,
            // but doesn't shrink when content is removed.
            heightStrategy = function (wym) {
                var $htmlElement = jQuery(wym._doc).children().eq(0),
                    htmlElementScrollHeight = $htmlElement[0].scrollHeight;

                // Without the 10px reduction in height, every possible action
                // adds 10 pixels of height.
                // TODO: Figure out why this happens and if we can make the
                // 10px number not magic (actually derived from a
                // margin/padding etc).
                return htmlElementScrollHeight - 10;
            };

            return heightStrategy;
        } else if (htmlElementHeight >= bodyScrollHeight) {
            // Well-behaving browsers like FF and Chrome let us rely on the
            // HTML element's jQuery height() in every case. Hooray!
            heightStrategy = function (wym) {
                var $htmlElement = jQuery(wym._doc).children().eq(0),
                    htmlElementHeight = $htmlElement.height();

                return htmlElementHeight;
            };

            return heightStrategy;
        } else if (bodyScrollHeight > htmlElementScrollHeight) {
            // This is probably IE7, where the only thing reliable is the
            // bodyScrollHeight
            heightStrategy = function (wym) {
                return wym._doc.body.scrollHeight;
            };

            return heightStrategy;
        } else {
            throw new Error('unsupported browser');
        }
    },
    resizeIframe: function (wym) {
        var This = WYMeditor.SKINS.seamless,
            desiredHeight,
            $iframe = jQuery(wym._iframe),
            currentHeight = $iframe.height();

        if (typeof WYMeditor.IFRAME_HEIGHT_GETTER === "undefined") {
            WYMeditor.IFRAME_HEIGHT_GETTER = This._getIframeHeightStrategy(
                wym
            );
        }

        desiredHeight = WYMeditor.IFRAME_HEIGHT_GETTER(wym);

        // Don't let the height drop below the WYMeditor textarea. This allows
        // folks to use their favorite height-setting method on the textarea,
        // without needing to pass options on to WYMeditor.
        if (desiredHeight < wym.seamlessSkinOpts.minimumHeight) {
            desiredHeight = wym.seamlessSkinOpts.minimumHeight;
        }

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
            $container = jQuery(wym.selectedContainer()),
            containerOffset = $container.offset(),
            viewportLowestY,
            containerLowestY,
            newScrollTop,
            extraScroll = 20,
            scrollDiff,
            $window = jQuery(window),
            $body = jQuery(document.body);

        if ($container.length === 0) {
            // With nothing selected, there's no need to scroll
            return;
        }
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
    resizeAndScrollIfNeeded: function (wym) {
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
