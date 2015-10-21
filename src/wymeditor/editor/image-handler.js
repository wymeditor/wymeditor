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
 * ## IE11 Shenanigans
 *
 * Mouse interaction with the resize handle
 * results in the native resize handles on it
 * (eight small squares around it)
 * as if the user is invited to resize it.
 * Trying to resize the resize handle
 * using these native handles
 * fails quite gracefully,
 * as if they did not exist.
 * The reason that it fails is
 * most likely due to prevented native actions
 * in one of our event handlers
 * (`return false` or `evt.preventDefault()`).
 *
 * Dragging and dropping of images is disabled.
 * See the `_onImgMousedown` method.
 *
 * ## Firefox Shenanigans
 *
 * Dragging and dropping of images is disabled.
 * See the `_onImgMousedown` method.
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
 * This whole module is not covered by any tests
 * so any change must be meticulously manually tested
 * in all the supported browsers
 * by psychologically stable individuals.
 *
 * Dragging and dropping of images may or may not work.
 * It may work and then stop working.
 * It may produce undesired results on drop.
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

    // only this single image resize handle exists always.
    // at this point it is still detached
    ih._$resizeHandle = ih._createResizeHandle();

    // references the image which
    // currently has the resize handle placed on it
    ih._$currentImg = null;

    // flags whether a resize operation is
    // occurring at this moment
    ih._resizingNow = false;

    ih._addEventListeners();

    return ih;
};

WYMeditor.ImageHandler._RESIZE_HANDLE_INNER_HTML = [
    'drag this to resize',
    'click on image to select'
].join(',<br/>');

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
        'background-color': 'yellow',
        width: '100%',

        // override default iframe stylesheet
        // so that a 'div' does not appear
        'background-image': 'none',

        // so that the text inside the resize handle
        // fits in one line.
        // in the theoretical future
        // the more appropriate value would be
        // `min-content`
        'min-width': '10em'
    });

    return $handle;
};

WYMeditor.ImageHandler.prototype._addEventListeners = function () {
    var ih = this;
    var $doc = jQuery(ih._wym._doc);

    $doc.delegate(
        'img', 'click',
        ih._onImgClick.bind(ih)
    );
    $doc.delegate(
        'img', 'mouseover',
        ih._onImgMouseover.bind(ih)
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

WYMeditor.ImageHandler.prototype._onImgClick = function (evt) {
    var ih = this;

    // in IE8, by this point
    // the image is always deselected,
    // even if it was selected just before the click,
    // because the mouse event itself
    // causes the deselection of the image
    // (see the `_selectImage` method).
    // one might think that
    // this indication should be triggered
    // only when the image is being selected
    // (as opposed to on every image click).
    // while that may or may not be
    // a more correct behavior,
    // in IE8 it does not seem possible
    // because, as was just explained,
    // the image is deselected and then reselected
    // on every image click,
    // so in IE8, this indication
    // would always be triggered on image click
    ih._indicateOnResizeHandleThatImageIsSelected();

    if (ih._wym.getSelectedImage() === evt.target) {
        return false;
    }
    ih._selectCurrentImage();
    return false;
};

WYMeditor.ImageHandler.prototype._selectCurrentImage = function () {
    var ih = this;
    ih._selectImage(ih._$currentImg[0]);
};

WYMeditor.ImageHandler.prototype._selectImage = function (img) {
    var ih = this;

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
};

WYMeditor.ImageHandler.prototype._indicateOnResizeHandleThatImageIsSelected = function () {
    var ih = this;

    var indication = 'image is selected';

    if (!(
        // dragging and dropping of images is disabled in:
        jQuery.browser.mozilla || // firefox
        jQuery.browser.msie && jQuery.browser.versionNumber === 11 // IE11
    )) {
        indication = indication + ',<br/>drag image to move it';
    }

    ih._$resizeHandle
        .css('font-weight', 'bold')
        .html(indication);

    setTimeout(function () {
        ih._$resizeHandle
          .css('font-weight', 'normal')
          .html(WYMeditor.ImageHandler._RESIZE_HANDLE_INNER_HTML);
    }, 1000);
};

WYMeditor.ImageHandler.prototype._onImgMouseover = function (evt) {
    var ih = this;
    if (ih._resizingNow) {
        return false;
    }

    var $img = jQuery(evt.target);

    if (ih._imgHasResizeHandle($img)) {
        return false;
    }
    ih._placeResizeHandleOnImg($img);
    return false;
};

WYMeditor.ImageHandler.prototype._imgHasResizeHandle = function ($img) {
    var ih = this;

    if (
        ih._$currentImg &&
        $img[0] === ih._$currentImg[0]
    ) {
        return true;
    }
    return false;
};

WYMeditor.ImageHandler.prototype._placeResizeHandleOnImg = function ($img) {
    var ih = this;
    var IMAGE_PADDING = '0.8em';

    ih._$currentImg = $img;

    // because the resize handle is absolutely positioned
    // it does not necessarily have to be placed immediately after the image.
    // the reason it is placed immediately after the image
    // is to provide a marker for where the image was
    // when the handle was placed on it.
    // see `_handlePossibleModification`
    ih._$resizeHandle.insertAfter($img);

    // colored padding around the image and the handle.
    // used for marking the image
    // that currently has the resize handle placed on it.
    // also, makes it possible
    // to resize very small images
    // (see the `_detachResizeHandle` method)
    $img.css({
      'background-color': 'yellow',
      'padding-top': IMAGE_PADDING,
      'padding-right': IMAGE_PADDING,
      'padding-bottom': '0',
      'padding-left': IMAGE_PADDING
    });

    // it is important that the resize handle's offset
    // is updated after the above style modification
    // add top padding to the image
    // because that alters the image's outside height
    ih._correctResizeHandleOffsetAndWidth();
};

WYMeditor.ImageHandler.prototype._correctResizeHandleOffsetAndWidth = function () {
    var ih = this;

    ih._$resizeHandle.css('max-width', ih._$currentImg.outerWidth());

    // for the following operations,
    // keep in mind that the image
    // is positioned absolutely

    // refrain from calling `offset` twice
    var offset = ih._$currentImg.offset();

    ih._$resizeHandle.css('left', offset.left);

    // the Y position of the first pixel after the image's outer Y dimension.
    // in other words, just below the image's margin (if it had a margin)
    var yAfterImg = offset.top + ih._$currentImg.outerHeight();

    if (jQuery.browser.msie && jQuery.browser.versionNumber === 8) {
        // in IE8, slowly moving the mouse from the image to the resize handle
        // resulted in a detachment of the resize handle.
        // subtracting one here means that
        // the resize handle will be positioned one pixel higher
        // and seems to workaround this issue
        // while possibly covering one row of pixels
        // from the bottom of the image
        // (*sigh*, the sacrifices we make for you, IE8...)
        yAfterImg--;
    }

    ih._$resizeHandle.css('top', yAfterImg);
};

WYMeditor.ImageHandler.prototype._onResizeHandleMousedown = function (evt) {
    var ih = this;

    if (ih._resizingNow) {
      return false;
    }

    ih._startResize(evt.clientY);
    return false;

};

WYMeditor.ImageHandler.prototype._startResize = function (startMouseY) {
    var ih = this;

    ih._startMouseY = startMouseY;
    ih._$currentImg.data('StartHeight', ih._$currentImg.attr('height'));
    ih._resizingNow = true;
};

WYMeditor.ImageHandler.prototype._onMousemove = function (evt) {
    var ih = this;

    if (ih._resizingNow) {
        ih._resizeImage(evt.clientY);
        return false;
    }

    // binding this handler using `jQuery.fn.delegate`
    // in a way that does not trigger on `img` elements
    // could have replaced the following conditional statement
    // if it had only actually worked.
    // the `:not()` selector seems to have no effect in `.delegate`
    if (evt.target.tagName.toLowerCase() === 'img') {
        return; // returning false here would disable image dragging
    }

    if (
        ih._isResizeHandleAttached() &&
        !ih._isResizeHandle(evt.target)
    ) {
        ih._detachResizeHandle();
    }

    return false;
};

WYMeditor.ImageHandler.prototype._isResizeHandle = function (elem) {
    return jQuery(elem).hasClass(WYMeditor.RESIZE_HANDLE_CLASS);
};

WYMeditor.ImageHandler.prototype._resizeImage = function (currentMouseY) {
    var ih = this;
    var $img = ih._$currentImg;

    var dimensionsRatio = $img.data('DimensionsRatio');

    if (!dimensionsRatio) {
        // in order to prevent dimensions ratio corruption
        var originalHeight = $img.attr('height');
        var originalWidth = $img.attr('width');
        dimensionsRatio =  originalWidth / originalHeight;
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
    var ih = this;

    if (ih._resizingNow) {
        ih._stopResize();
    }
    return false;
};

WYMeditor.ImageHandler.prototype._stopResize = function () {
    var ih = this;

    ih._resizingNow = false;
    ih._startMouseY = null;
};

WYMeditor.ImageHandler.prototype._onImgMousedown = function () {
    if (jQuery.browser.mozilla) {
        // firefox seems to natively select the image on mousedown
        // this means that by the time the `_onImgClick` handler
        // executes, the image is already selected.
        // this means that the image ends up
        // being selected exactly as desired.
        // it also means that the visual indication
        // in `_selectImage` is not triggered.
        // also, the other browsers, in Firefox,
        // the text selection of images
        // does not result in any highlight of the image.
        // no highlight and no visual indication
        // means that the user might not understand
        // that the image is selected after it was clicked.
        // this works around the issue by
        // preventing the native action of `mousedown`,
        // which is selecting the image
        // so the image will be selected by our code
        // and while it will not be highlighted,
        // there will be a visual indication
        // that it was indeed selected
        //
        // preventing default here also means,
        // not allowing dragging and dropping
        // of images in Firefox.
        // if ever dragging is enabled in Firefox,
        // modify the `_indicateOnResizeHandleThatImageIsSelected` method
        // accordingly
        return false;
    }

    if (jQuery.browser.msie && jQuery.browser.versionNumber === 11) {
        // IE11 on image mousedown
        // places native resize handles
        // around the image.
        // preventing default here prevents it
        //
        // this also prevents dragging and dropping
        // of images.
        // if ever dragging is enabled in IE11,
        // modify the `_indicateOnResizeHandleThatImageIsSelected` method
        // accordingly
        return false;
    }

    return; // returning false here would disable image dragging
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

    var $handle = ih._$resizeHandle;
    if (
        !$handle.prev('img').length ||
        $handle.prev()[0] !== ih._$currentImg
    ) {
        // this happens when:
        //
        // * the image was selected and
        //   * replaced by pasted content
        //   * replace by character insertion from key presses
        //   * removed with backspace/delete
        // * the image was dragged and dropped somewhere
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
    return jQuery.contains(ih._wym._doc.documentElement, ih._$resizeHandle[0]);
};

WYMeditor.ImageHandler.prototype._detachResizeHandle = function () {
    var ih = this;

    ih._$resizeHandle.detach();
    if (
        // the size of the image might be so small,
        // that it would be hard to mouse over it
        // in order to make the resize handle appear.
        // in that case (an arbitrary number of pixels)
        // leave the padding on, as it will allow
        // easy mouse over the image,
        // even when the image is 0 in size
        ih._$currentImg.attr('height') >= 16 &&
        ih._$currentImg.attr('width') >= 16
    ) {
        ih._$currentImg.css({padding: 0});
    }
    ih._$currentImg = null;
};

WYMeditor.ImageHandler.prototype._onResizeHandleClickDblclick = function () {
    // prevents entering edit mode in the handle
    return false;
};

// useful for debugging
WYMeditor.ImageHandler.prototype._isAnImgSelected = function (message) {
    var ih = this;
    message = message.toUpperCase();

    function check (prefix) {
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
