/* jshint maxlen: 100 */
/* global
    manipulationTestHelper,
    prepareUnitTestModule,
    skipKeyboardShortcutTests,
    SKIP_THIS_TEST,
    test,
    expectOneMore,
    simulateKeyCombo,
    stop,
    start,
    strictEqual,
    ok,
    IMG_SRC
*/
'use strict';

module("images-resize_handle", {setup: prepareUnitTestModule});

test("Resize handle is prepended to body on image `mousemove`", function () {
    manipulationTestHelper({
        startHtml: '<p><img src="' + IMG_SRC + '" /></p>',
        manipulationFunc: function (wymeditor) {
            wymeditor.$body().find('img').mousemove();
        },
        additionalAssertionsFunc: function (wymeditor) {
            var $resizeHandle = wymeditor.$body().children().first();
            expectOneMore();
            ok($resizeHandle.hasClass('wym-resize-handle'));
        }
    });
});

test("image marker is immediately after image", function () {
    manipulationTestHelper({
        startHtml: '<p><img src="' + IMG_SRC + '" /></p>',
        manipulationFunc: function (wymeditor) {
            wymeditor.$body().find('img').mousemove();
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            var $imgMarker = wymeditor.$body().find('.wym-image-marker');
            ok($imgMarker.prev('img').length);
        }
    });
});

test("resize handle has editor-only class", function () {
    manipulationTestHelper({
        startHtml: '<p><img src="' + IMG_SRC + '" /></p>',
        manipulationFunc: function (wymeditor) {
            wymeditor.$body().find('img').mousemove();
        },
        additionalAssertionsFunc: function (wymeditor) {
            var $resizeHandle = wymeditor.$body().find('.wym-resize-handle');
            expectOneMore();
            ok($resizeHandle.hasClass('wym-editor-only'));
        }
    });
});

test("resize handle hidden on `mousemove` outside image and handle", function () {
    manipulationTestHelper({
        startHtml: '<p><img src="' + IMG_SRC + '" /></p>',
        manipulationFunc: function (wymeditor) {
            wymeditor.$body().find('img')
                .mousemove()
                .parent().mousemove();
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            strictEqual(wymeditor.$body().find('.wym-resize-handle').css('display'), 'none');
        }
    });
});

test("resize handle not hidden on `mousemove` over handle", function () {
    manipulationTestHelper({
        startHtml: '<p><img src="' + IMG_SRC + '" /></p>',
        manipulationFunc: function (wymeditor) {
            wymeditor.$body().find('img').mousemove();
            wymeditor.$body().find('.wym-resize-handle').mousemove();
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            strictEqual(wymeditor.$body().find('.wym-resize-handle').css('display'), 'block');
        }
    });
});

test("resize handle with no image is hidden async after 'keypress'", function () {
    manipulationTestHelper({
        startHtml: '<p><img src="' + IMG_SRC + '" /></p>',
        setCaretInSelector: 'p',
        manipulationFunc: function (wymeditor) {
            wymeditor.$body().find('img').mousemove().remove();
            simulateKeyCombo(wymeditor, 'a');
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            stop();
            setTimeout(function () {
                start();
                strictEqual(wymeditor.$body().find('.wym-resize-handle').css('display'), 'none');
            }, 0);
        },
        skipFunc: function () {
            if (skipKeyboardShortcutTests) {
                return SKIP_THIS_TEST;
            }
        }
    });
});

test("resize handle with no image is hidden on `mousemove`", function () {
    manipulationTestHelper({
        startHtml: '<p><img src="' + IMG_SRC + '" /></p>',
        manipulationFunc: function (wymeditor) {
            wymeditor.$body().find('img')
                .mousemove()
                .remove();
            wymeditor.$body().find('.wym-resize-handle').mousemove();
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            strictEqual(wymeditor.$body().find('.wym-resize-handle').css('display'), 'none');
        }
    });
});
