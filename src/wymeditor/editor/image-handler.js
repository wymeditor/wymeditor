/* jshint maxlen:100 */
"use strict";

/*
 * # The Image Handler
 *
 * Give it an editor instance and it will make
 * most of your image resizing dreams come true.
 *
 * ## IE8 Shenanigans
 *
 * When IE8 is not longer supported,
 * `rem` could be used for more accurate UI element dimensions
 *
 * Dragging and dropping of images is not suggested in the UI.
 * See the `_isImgDragDropAllowed` function
 * and the `_onImgMousedown` function.
 *
 * ## IE9 Shenanigans
 *
 * Dragging and dropping of images is disabled.
 * See the `_isImgDragDropAllowed` function.
 *
 * ## IE8-11 Shenanigans
 *
 * SVG images are not scaled.
 * They are cropped. That's right.
 * And applying style to them does not help,
 * as well. Ideas are welcome.
 *
 * ## General Shenanigans (http://i.imgur.com/wbQ6U5C.jpg)
 *
 * This module is covered by only a few basic tests
 * so any change must be meticulously manually tested
 * in all the supported browsers
 * by psychologically stable individuals.
 *
 * Dragging and dropping of images
 * might produce undesired results on drop.
 * Uncharted territory.
 *
 * In event handlers of events that
 * are not expected to perform useful default actions
 * `return false` is used to prevent any bad feelings
 * towards unexpected browser behavior.
 */

// the image handler class.
WYMeditor.ImageHandler = function (wym) {
    var ih = this;
    ih._wym = wym;

    ih._$resizeHandle = ih._createResizeHandle();

    ih._$currentImageMarker = null;

    // references the image that
    // has the resize handle placed on it
    ih._$currentImg = null;

    // flags whether a resize operation is
    // occurring at this moment
    ih._resizingNow = false;

    ih._imgDragDropAllowed = WYMeditor.ImageHandler._isImgDragDropAllowed();

    ih._addEventListeners();

    return ih;
};

WYMeditor.ImageHandler._isImgDragDropAllowed = function () {
    var browser = jQuery.browser;
    if (browser.msie) {
        if (browser.versionNumber <= 9) {
            // dragging and dropping seems to not consistently work.
            // the image would only some times get picked up by the mouse drag attempt.
            // to prevent confusion
            return false;
        }
    }
    return true;
};

WYMeditor.ImageHandler._RESIZE_HANDLE_HR_HTML = jQuery('<hr>')
    .addClass(WYMeditor.EDITOR_ONLY_CLASS)
    .css({margin: 0, padding: 0})
    .attr('outerHTML');

WYMeditor.ImageHandler._RESIZE_HANDLE_INNER_HTML = [
    'drag this to resize',
    'click on image to select'
].join(WYMeditor.ImageHandler._RESIZE_HANDLE_HR_HTML);

WYMeditor.ImageHandler._IMAGE_HIGHLIGHT_COLOR = 'yellow';

// creates and returns
// a yet detached UI resize handle element
// in a jQuery object
WYMeditor.ImageHandler.prototype._createResizeHandle = function () {
    var $handle = jQuery('<div/>');

    // In IE11 it was very easy to
    // accidentally enter into editing mode
    // in the resize handle.
    // This seamlessly prevents it.
    $handle.attr('contentEditable', 'false');

    $handle.html(WYMeditor.ImageHandler._RESIZE_HANDLE_INNER_HTML);

    $handle
        .addClass(WYMeditor.RESIZE_HANDLE_CLASS)
        .addClass(WYMeditor.EDITOR_ONLY_CLASS);

    $handle.css({
        margin: '0',
        padding: '0',

        // when IE9 is no longer supported
        // this could be `ns-resize`
        cursor: 'row-resize',

        'text-align': 'center',

        // this means that
        // elements after the resize handle
        // will not be pushed down because of its presence.
        // we later use the `left` and `top` properties
        // to keep the resize handle exactly
        // below its current image
        position: 'absolute',

        'background-color': WYMeditor.ImageHandler._IMAGE_HIGHLIGHT_COLOR,

        // override default iframe stylesheet
        // so that a 'div' does not appear
        'background-image': 'none',

        // so that the text inside the resize handle
        // fits in one line.
        // in the theoretical future
        // the more appropriate value would be
        // `min-content`
        'min-width': '13em',

        width: '100%'
    });

    return $handle;
};

WYMeditor.ImageHandler.prototype._getCurrentImageMarker = function () {
    var ih = this;
    if (
        // a marker was not yet created
        !ih._$currentImageMarker ||
        // a marker was destroyed via native edit
        !ih._$currentImageMarker.length
    ) {
        ih._$currentImageMarker = ih._createCurrentImageMarker();
    }
    return ih._$currentImageMarker;
};

WYMeditor.ImageHandler._IMAGE_MARKER_CLASS = 'wym-image-marker';

WYMeditor.ImageHandler.prototype._createCurrentImageMarker = function () {
    return jQuery('<div/>')
        .addClass(WYMeditor.EDITOR_ONLY_CLASS)
        .addClass(WYMeditor.ImageHandler._IMAGE_MARKER_CLASS)
        .hide();
};

WYMeditor.ImageHandler.prototype._addEventListeners = function () {
    var ih = this;
    var $doc = jQuery(ih._wym._doc);

    $doc.delegate(
        'img', 'mouseover',
        ih._onImgMouseover.bind(ih)
    );
    $doc.delegate(
        'img', 'click',
        ih._onImgClick.bind(ih)
    );
    $doc.delegate(
        '.' + WYMeditor.RESIZE_HANDLE_CLASS, 'mousedown',
        ih._onResizeHandleMousedown.bind(ih)
    );
    $doc.delegate(
        'img',
        'mousedown',
        ih._onImgMousedown.bind(ih)
    );
    $doc.delegate(
        'img',
        'dragstart',
        ih._onImgDragstart.bind(ih)
    );
    $doc.bind(
        'mousemove',
        ih._onMousemove.bind(ih)
    );
    $doc.bind(
        'mouseup',
        ih._onMouseup.bind(ih)
    );
    ih._edited = new WYMeditor.EXTERNAL_MODULES.Edited(
        $doc[0],
        function () {}, // do not do anything with strictly sensible edits
        ih._onAnyNativeEdit.bind(ih) // handle all edits
    );
    $doc.delegate(
        '.' + WYMeditor.RESIZE_HANDLE_CLASS,
        'click dblclick',
        ih._onResizeHandleClickDblclick.bind(ih)
    );
    // useful for debugging
    if (false) {
        ih._wym.$body().delegate(
            '*',
            WYMeditor.Helper.getAllEventTypes(ih._wym.$body()[0]),
            ih._onAllEvents.bind(ih)
        );
    }
};

WYMeditor.ImageHandler.prototype._onImgMouseover = function (evt) {
    var ih = this;
    var $img = jQuery(evt.target);
    if (
        !$img.data('cE disabled') &&
        jQuery.browser.msie
    ) {
        // in IE8-11 it seems that the default cursor for images
        // (in `designMode`) is 'move' (4 directions arrow)
        // and simply setting a different cursor
        // does not change that default.
        // this works around the issue.
        // the result is still not just any cursor we'd like,
        // but only the 'default' cursor,
        // which is better than the default 'move' cursor.
        // this workaround does not seem to have obvious side effects
        $img.attr('contentEditable', 'false');
        $img.data('cE disabled', true);
    }
    ih._setImgCursor($img);
};

WYMeditor.ImageHandler.prototype._setImgCursor = function ($img) {
    var ih = this;
    if (ih._wym.getSelectedImage() !== $img[0]) {
        // hint that image is selectable by click
        $img.css('cursor', 'pointer');
        return;
    }
    // image is selected
    if (ih._imgDragDropAllowed) {
        // in IE8-11 this does not work
        // and the cursor remains 'default'.
        // see the `_onImgMouseover` handler
        $img.css('cursor', 'move');
    } else {
        $img.css('cursor', 'default');
    }
};

WYMeditor.ImageHandler.prototype._onImgClick = function (evt) {
    var ih = this;

    // firefox seems to natively select the image on mousedown
    // this means that by the time this handler executes,
    // the image is already selected.
    //
    // in IE8, by this point
    // the image is always deselected,
    // even if it was selected just before the click,
    // because the mouse event itself
    // causes the deselection of the image
    // (see the `_selectImage` method).
    //
    // because of the above browser limitations,
    // it is more simple to always select the image here,
    // regardless of whether it is selected already or not

    ih._selectImage(evt.target);
    ih._indicateOnResizeHandleThatImageIsSelected();
    return false;
};

WYMeditor.ImageHandler.prototype._selectImage = function (img) {
    var ih = this;
    var $img = jQuery(img);

    if (jQuery.browser.msie && jQuery.browser.versionNumber === 8) {
        // in IE8 when the right side of an img is clicked
        // (you can't make this up),
        // any selection that was set on click is discarded.
        // scheduling the image selection
        // for after synchronous execution
        // works around the issue
        setTimeout(function () {
             //ih._isAnImgSelected('IE8 ASYNC `_selectImage` (before select)'); // for debugging
            ih._wym._selectSingleNode(img);
             //ih._isAnImgSelected('IE8 ASYNC `_selectImage` (after select)'); // for debugging
        }, 0);
    } else {
         //ih._isAnImgSelected('`_selectImage` (before select)'); // for debugging
        ih._wym._selectSingleNode(img);
         //ih._isAnImgSelected('`_selectImage` (after select)'); // for debugging
    }

    ih._setImgCursor($img);
};

WYMeditor.ImageHandler.prototype._indicateOnResizeHandleThatImageIsSelected = function () {
    var ih = this;

    var indication = 'image is selected';
    if (ih._imgDragDropAllowed) {
        indication = [
            indication,
            'drag image to move it'
        ].join(WYMeditor.ImageHandler._RESIZE_HANDLE_HR_HTML);
    }

    ih._$resizeHandle
        .css('font-weight', 'bold')
        .html(indication);

    // ideally, the above indication text would remain
    // until the image is no longer selected.
    // since it is not easy to detect when that happens,
    // the indication text is replaced with the initial text
    // after a short moment.
    setTimeout(function () {
        ih._$resizeHandle
          .css('font-weight', 'normal')
          .html(WYMeditor.ImageHandler._RESIZE_HANDLE_INNER_HTML);
    }, 1000);
};

WYMeditor.ImageHandler.prototype._placeResizeHandleOnImg = function (img) {
    var ih = this;
    var IMAGE_PADDING = '0.8em';
    var $img = jQuery(img);

    ih._$currentImg = $img;

    ih._getCurrentImageMarker().insertAfter($img);

    // colored padding around the image and the handle
    // visually marks the image
    // that currently has the resize handle placed on it.
    // it also makes it possible to resize very small images
    // (see the `_detachResizeHandle` method)
    $img.css({
        'background-color': WYMeditor.ImageHandler._IMAGE_HIGHLIGHT_COLOR,

        'padding-top': IMAGE_PADDING,
        'padding-right': IMAGE_PADDING,
        'padding-bottom': '0',
        'padding-left': IMAGE_PADDING,
        'margin-top': '-' + IMAGE_PADDING,
        'margin-right': '-' + IMAGE_PADDING,
        'margin-bottom': '0',
        'margin-left': '-' + IMAGE_PADDING
    });

    // the resize handle, prepended to the body in this way,
    // can be removed from the body using DOM manipulation
    // such as setting the content with the `html` method.
    // so we place it there in case that occurred.
    // this could be done conditionally
    // but there is practically no performance hit so keeping it simple
    ih._$resizeHandle.prependTo(ih._wym.$body());

    // it is important that the resize handle's offset
    // is updated after the above style modification
    // adds top padding to the image
    // because that alters the image's outside height
    ih._correctResizeHandleOffsetAndWidth();

    ih._$resizeHandle.show();
};

WYMeditor.ImageHandler.prototype._correctResizeHandleOffsetAndWidth = function () {
    var ih = this;

    ih._$resizeHandle.css('max-width', ih._$currentImg.outerWidth());

    var offset = ih._$currentImg.offset();

    ih._$resizeHandle.css('left', offset.left);

    // the Y position of the first pixel after the image's outer Y dimension.
    // in other words, just below the image's margin (if it had a margin)
    var yAfterImg = offset.top + ih._$currentImg.outerHeight();

    if (jQuery.browser.msie) {
        // in IE8-11 there might be a visible 1 pixes gap
        // between the image and the resize handle
        // possibly this issue:
        // https://github.com/jquery/jquery/issues/1724
        yAfterImg--;
    }

    ih._$resizeHandle.css('top', yAfterImg);
};

WYMeditor.ImageHandler.prototype._onResizeHandleMousedown = function (evt) {
    var ih = this;

    if (!ih._resizingNow) {
        ih._startResize(evt.clientY);
    }
    return false;
};

WYMeditor.ImageHandler.prototype._startResize = function (startMouseY) {
    var ih = this;

    ih._startMouseY = startMouseY;
    ih._$currentImg.data('StartHeight', ih._$currentImg.height());
    ih._resizingNow = true;
};

WYMeditor.ImageHandler.prototype._onMousemove = function (evt) {
    var ih = this;

    // default action for this event may be a `mousedown` and `mousemove`
    // with the intention to select text
    // or to drag (for later dropping of) content
    // so be careful about preventing default

    if (!evt.target.tagName) {
        // IE8 may fire such an event.
        // what element was it fired on?
        return;
    }

    if (ih._resizingNow) {
        // this is up high in this method for performance
        ih._resizeImage(evt.clientY);
        return false;
    }

    if (
        evt.target.tagName.toLowerCase() === 'img' &&
        !ih._isResizeHandleAttached()
    ) {
        ih._placeResizeHandleOnImg(evt.target);
        return false;
    }

    if (!ih._isResizeHandleAttached()) {
        return;
    }

    // from this point on, this event handler is all about
    // checking whether the resize handle should be detached

    if (
        !jQuery(evt.target).hasClass(WYMeditor.EDITOR_ONLY_CLASS) &&
        !ih._isCurrentImg(evt.target)
    ) {
        // this must be after the above check for whether resizing now
        // because, while the resize operation does begin
        // with the mouse pointing on the resize handle,
        // the mouse might leave the resize handle during the resize operation.
        // in that case, we would like the operation to continue
        ih._detachResizeHandle();
        return;
    }

    if (!ih._isCurrentImgAtMarker()) {
        ih._detachResizeHandle();
        return;
    }
};

WYMeditor.ImageHandler.prototype._isCurrentImgAtMarker = function () {
    var ih = this;
    var $marker = ih._$currentImageMarker;
    if (!$marker.length) {
        // the marker was removed by some DOM manipulation
        return false;
    }
    var $img = ih._$currentImg;
    var $imgPrevToMarker = $marker.prev('img');
    if (
        $img.length &&
        $imgPrevToMarker.length &&
        $imgPrevToMarker[0] === $img[0]
    ) {
        return true;
    }
    // this happens when:
    //
    // * the image was selected and
    //   * replaced by pasted content
    //   * replaced by character insertion from key press
    //   * removed with backspace/delete
    // * caret was before/after image and delete/backspace pressed
    // * the image was dragged and dropped somewhere
    return false;
};

WYMeditor.ImageHandler.prototype._isResizeHandle = function (elem) {
    return jQuery(elem).hasClass(WYMeditor.RESIZE_HANDLE_CLASS);
};

WYMeditor.ImageHandler.prototype._isCurrentImg = function (img) {
    var ih = this;
    return img === ih._$currentImg[0];
};

WYMeditor.ImageHandler.prototype._resizeImage = function (currentMouseY) {
    var ih = this;
    var $img = ih._$currentImg;

    var dimensionsRatio = $img.data('DimensionsRatio');

    if (!dimensionsRatio) {
        // in order to prevent dimensions ratio corruption
        var originalHeight = $img.height();
        var originalWidth = $img.width();
        dimensionsRatio = originalWidth / originalHeight;
        $img.data('DimensionsRatio', dimensionsRatio);
    }

    // calculate the new dimensions
    var startHeight = $img.data('StartHeight');
    var newHeight = startHeight - ih._startMouseY + currentMouseY;
    newHeight = newHeight > 0 ? newHeight : 0;
    var newWidth = newHeight * dimensionsRatio;

    // update the dimensions
    $img.attr('height', newHeight);
    $img.attr('width', newWidth);

    ih._correctResizeHandleOffsetAndWidth();
};

WYMeditor.ImageHandler.prototype._onMouseup = function () {
    // this could be a case where
    // there was a `mousedown` on a selection
    // and then a `mouseup` without having moved the mouse.
    // the default action would be
    // to collapse the selection to a caret where the pointer is.
    // we'd not like to prevent that

    var ih = this;

    if (ih._resizingNow) {
        ih._stopResize();
    }
};

WYMeditor.ImageHandler.prototype._stopResize = function () {
    var ih = this;

    ih._resizingNow = false;
    ih._startMouseY = null;
    ih._wym.registerModification();
};

WYMeditor.ImageHandler.prototype._onImgMousedown = function (evt) {
    var ih = this;

    if (jQuery.browser.msie && jQuery.browser.versionNumber === 11) {
        // IE11 on image mousedown places native resize handles around the image.
        // selecting the image both here and on `click` refrains from those handles
        // completely and seemingly without side effects.
        ih._selectImage(evt.target);
        // another way to refrain from the handles is preventing default.
        // but that would have an undesired side effect
        // of not allowing dragging and dropping of images.
    }

    // returning false here prevents drag of image
    // except for in IE8
    return ih._imgDragDropAllowed;
};

WYMeditor.ImageHandler.prototype._onAnyNativeEdit = function () {
    var ih = this;
    // modifications possibly not have occurred yet.
    // schedule immediate async in order to execute
    // after the possible modifications may have occurred
    setTimeout(ih._handlePossibleModification.bind(ih), 0);
};

WYMeditor.ImageHandler.prototype._handlePossibleModification = function () {
    var ih = this;

    if (!ih._isResizeHandleAttached()) {
        return;
    }

    if (!ih._isCurrentImgAtMarker()) {
        ih._detachResizeHandle();
        return;
    }

    // any edit to the document might result
    // in the image ending up in a different position than before.
    // for example, inserting a character before the image
    // pushes it to the right.
    ih._correctResizeHandleOffsetAndWidth();
};

WYMeditor.ImageHandler.prototype._isResizeHandleAttached = function () {
    var ih = this;
    var $handle = ih._getResizeHandle();
    return $handle && $handle.css('display') !== 'none';
};

WYMeditor.ImageHandler.prototype._getResizeHandle = function () {
    var ih = this;
    var $handle = ih._wym.$body().find('.' + WYMeditor.RESIZE_HANDLE_CLASS);
    return $handle.length ? $handle : false;
};

WYMeditor.ImageHandler.prototype._detachResizeHandle = function () {
    var ih = this;

    ih._$currentImageMarker.detach();
    if (
        // the size of the image might be so small,
        // that it would be hard to mouse over it
        // in order to make the resize handle appear.
        // in that case (an arbitrary number of pixels)
        // leave the padding on, as it will allow
        // easy mouse over the image,
        // even when the image is 0 in size
        ih._$currentImg.height() >= 16 &&
        ih._$currentImg.width() >= 16
    ) {
        ih._$currentImg.css({padding: 0, margin: 0});
    }
    ih._$currentImg = null;
    ih._$resizeHandle.hide();
};

WYMeditor.ImageHandler.prototype._onImgDragstart = function () {
    var ih = this;
    ih._detachResizeHandle();
};

WYMeditor.ImageHandler.prototype._onResizeHandleClickDblclick = function () {
    var ih = this;

    if (jQuery.browser.msie && jQuery.browser.versionNumber === 11) {
        // in IE11 some mouse events on the resize handle
        // result in native resize handles on it (eight small squares around it).
        // trying to resize the resize handle using these native handles
        // fails quite gracefully, as they seem to have no effect at all.
        // it fails most likely due to prevented native actions
        // in one of our event handlers.
        // however, deselecting here completely prevents these handles
        ih._wym.deselect();
    }
    // prevents entering edit mode in the handle
    return false;
};

// useful for debugging
WYMeditor.ImageHandler.prototype._isAnImgSelected = function (message) {
    var ih = this;
    message = message.toUpperCase();

    function check(prefix) {
        var result = ih._wym.getSelectedImage() ? '***YES***' : '';
        prefix = prefix ? prefix + ' ' : '';
        WYMeditor.console.log(prefix + message + ' ' + result);
    }

    check('sync');

    setTimeout(function () {
        check('async');
    }, 0);
};

// for debugging
WYMeditor.ImageHandler._onAllEvents = function (evt) {
    var ih = this;

    ih._isAnImgSelected([
        evt.type,
        evt.target.tagName,
        jQuery(evt.target).attr('className')
    ].join(' '));
};
