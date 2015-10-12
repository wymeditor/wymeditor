/* jshint maxlen:100 */
"use strict";

WYMeditor.ImageResizer = function (wym) {
    var ir = this;
    ir._wym = wym;
    ir._onMousedown = ir._onMousedown.bind(ir);
    ir._onMousemove = ir._onMousemove.bind(ir);
    ir._onMouseup = ir._onMouseup.bind(ir);

    return ir;
};

WYMeditor.ImageResizer.prototype._handleClickedImage = function (image) {
    var ir = this;
    var wym = ir._wym;

    var imageIsContained = jQuery(image).parent().hasClass(WYMeditor.IMAGE_CONTAINER_CLASS);
    if (imageIsContained) {
        return;
    }

    ir._instrumentImage(image);

    wym._selectSingleNode(image);
    return false;
};

WYMeditor.ImageResizer.prototype._createHandle = function () {
    var style = {
        cursor: 'row-resize',

        // text style
        'text-align': 'center',
        'font-size': '1.2em',

        // don't be silly
        margin: '0',
        padding: '0',


        // for the background color to appear across the entire width of the image
        'background-color': 'yellow',
        width: '100%',

        // be at the bottom of the image that is above you
        position: 'absolute',
        'margin-top': '-1.2em',

        // override default iframe style which shows 'div' top left corner
        'background-image': 'none',

        // for when width of image gets really small
        'display': 'table', // do not get smaller in width than your text
        'white-space': 'nowrap'
    };

    var $handle = jQuery('<div>drag this to resize</div>')
        .addClass(WYMeditor.RESIZE_HANDLE_CLASS)
        .css(style);

    return $handle;
};

WYMeditor.ImageResizer.prototype._createContainer = function () {
    var style = {
        'background-image': 'none',
        display: 'inline-block',
        margin: '0',
        padding: '0',
        position: 'relative'
    };
    var $container = jQuery('<div></div>')
      .addClass(WYMeditor.EDITOR_ONLY_CLASS)
      .addClass(WYMeditor.IMAGE_CONTAINER_CLASS)
      .css(style);

    return $container;
};

WYMeditor.ImageResizer.prototype._instrumentImage = function (image) {
    var ir = this;

    ir._$container = ir._createContainer();
    ir._$handle = ir._createHandle();

    ir._$img = jQuery(image);
    ir._$img
        .replaceWith(ir._$container)
        .appendTo(ir._$container)
        .after(ir._$handle);

        if (jQuery.browser.msie) {
            ir._$img.bind('controlselect', function () {
                return false;
            });
        }

    ir._listen();
};

WYMeditor.ImageResizer.prototype._listen = function () {
    var ir = this;

    ir._$handle.bind('mousedown', ir._onMousedown);
    ir._$img.bind('cut', function () {
        console.log('test');
    });
    ir._$img.bind('dragstart', function () {
        console.log('dragstart');
    });
};

WYMeditor.ImageResizer.prototype._onMousedown = function (evt) {
    var ir = this;
    var $doc = jQuery(ir._wym._doc);

    ir._startX = evt.clientX;
    ir._startY = evt.clientY;
    ir._startWidth = ir._$img.attr('width');
    ir._startHeight = ir._$img.attr('height');
    ir._dimensionsRatio = ir._startWidth / ir._startHeight;

    $doc.bind('mousemove', ir._onMousemove);
    $doc.bind('mouseup', ir._onMouseup);

    return false;
};

WYMeditor.ImageResizer.prototype._onMousemove = function (evt) {
    var ir = this;

    ir._$img.attr('height', ir._startHeight - ir._startY + evt.clientY);
    ir._$img.attr('width', ir._$img.attr('height') * ir._dimensionsRatio);
    ir._$handle.unbind('mousedown', ir._onMousedown);

    return false;
};

WYMeditor.ImageResizer.prototype._onMouseup = function () {
    var ir = this;

    jQuery(ir._wym._doc)
        .unbind('mousemove', ir._onMousemove)
        .unbind('mouseup', ir._onMouseup);

    ir._deInstrumentImage();
    return false;
};

WYMeditor.ImageResizer.prototype._deInstrumentImage = function () {
    var ir = this;

    ir._$handle.remove();
    ir._$img.unwrap();
};
