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

    var $handle = jQuery('<div>drag to resize</div>')
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

    var $container = ir._createContainer();
    var $handle = ir._createHandle();

    var $image = jQuery(image);
    $image
        .replaceWith($container)
        .appendTo($container)
        .after($handle);

        if (jQuery.browser.msie) {
            $image.bind('controlselect', function () {
                return false;
            });
        }

    ir._listen($handle);
};

WYMeditor.ImageResizer.prototype._listen = function ($handle) {
    var ir = this;

    $handle.bind('mousedown', ir._onMousedown);
};

WYMeditor.ImageResizer.prototype._onMousedown = function (e) {
    var ir = this;
    var $doc = jQuery(ir._wym._doc);

    ir.$img = jQuery(e.target).siblings('img');
    ir.startX = e.clientX;
    ir.startY = e.clientY;
    ir.startWidth = ir.$img.attr('width');
    ir.startHeight = ir.$img.attr('height');
    ir.dimensionsRatio = ir.startWidth / ir.startHeight;
    ir.$handle = ir.$img.siblings(WYMeditor.RESIZE_HANDLE_CLASS);

    $doc.bind('mousemove', ir._onMousemove);
    $doc.bind('mouseup', ir._onMouseup);

    return false;
};

WYMeditor.ImageResizer.prototype._onMousemove = function (e) {
    var ir = this;

    ir.$img.attr('height', ir.startHeight - ir.startY + e.clientY);
    ir.$img.attr('width', ir.$img.attr('height') * ir.dimensionsRatio);
    ir.$handle.unbind('mousedown', ir._onMousedown);

    return false;
};

WYMeditor.ImageResizer.prototype._onMouseup = function () {
    var ir = this;

    jQuery(ir._wym._doc)
        .unbind('mousemove', ir._onMousemove)
        .unbind('mouseup', ir._onMouseup);

  return false;
};

WYMeditor.ImageResizer.prototype._decontainImage = function (image) {
    jQuery(image)
        .next()
        .unwrap()
        .remove();
};
