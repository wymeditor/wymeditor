/* jshint evil: true */
/* global
    manipulationTestHelper,
    prepareUnitTestModule,
    test,
    expect,
    strictEqual,
    makeSelection,
    inPhantomjs,
    SKIP_THIS_TEST,
    stop,
    start,
    IMG_SRC
*/
"use strict";

module("images-insertion", {setup: prepareUnitTestModule});

test("Inserts image into a paragraph", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        setCaretInSelector: 'p',
        manipulationFunc: function (wymeditor) {
            wymeditor.insertImage({
                src: IMG_SRC,
                alt: "Example"
            });
        },
        expectedResultHtml: "<p><img alt=\"Example\" " +
            "src=\"" + IMG_SRC + "\" />Foo</p>",
        testUndoRedo: true
    });
});

test("Inserts image into the body", function () {
    manipulationTestHelper({
        startHtml: "<br />",
        prepareFunc: function (wymeditor) {
            wymeditor.setCaretIn(wymeditor.body());
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.insertImage({
                alt: "Example",
                src: IMG_SRC
            });
        },
        expectedResultHtml: "<img alt=\"Example\" " +
            "src=\"" + IMG_SRC + "\" /><br />",
        testUndoRedo: true
    });
});

module("images-getSelectedImage", {setup: prepareUnitTestModule});

var getSelectedImageHtml = [""
    , "<p>"
        , "Foo and "
        , "<img alt=\"bar\" src=\"" + IMG_SRC + "\" />"
    , "</p>"
].join("");

test("Returns false when no selection", function () {
    manipulationTestHelper({
        startHtml: getSelectedImageHtml,
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        expectedResultHtml: getSelectedImageHtml,
        additionalAssertionsFunc: function (wymeditor) {
            expect(expect() + 1);
            strictEqual(
                wymeditor.getSelectedImage(),
                false
            );
        }
    });
});

test("Returns false when selection is collapsed", function () {
    manipulationTestHelper({
        startHtml: getSelectedImageHtml,
        setCaretInSelector: "p",
        expectedResultHtml: getSelectedImageHtml,
        additionalAssertionsFunc: function (wymeditor) {
            expect(expect() + 1);
            strictEqual(
                wymeditor.getSelectedImage(),
                false
            );
        }
    });
});

test("Returns false when more than one node is selected, even if one of" +
    " them is an image", function () {
    manipulationTestHelper({
        startHtml: getSelectedImageHtml,
        prepareFunc: function (wymeditor) {
            var p = wymeditor.body().childNodes[0];
            makeSelection(
                wymeditor,
                p,
                p,
                0,
                2
            );
            expect(expect() + 1);
            strictEqual(
                wymeditor._getSelectedNodes()[1].tagName.toLowerCase(),
                "img"
            );
        },
        expectedResultHtml: getSelectedImageHtml,
        additionalAssertionsFunc: function (wymeditor) {
            expect(expect() + 1);
            strictEqual(
                wymeditor.getSelectedImage(),
                false
            );
        }
    });
});

test("Returns false when single text node is selected", function () {
    manipulationTestHelper({
        startHtml: getSelectedImageHtml,
        prepareFunc: function (wymeditor) {
            var p = wymeditor.body().childNodes[0];
            makeSelection(
                wymeditor,
                p,
                p,
                0,
                1
            );
            expect(expect() + 2);
            strictEqual(
                wymeditor._getSelectedNodes().length,
                1
            );
            strictEqual(
                wymeditor._getSelectedNodes()[0].nodeType,
                WYMeditor.NODE_TYPE.TEXT
            );
        },
        expectedResultHtml: getSelectedImageHtml,
        additionalAssertionsFunc: function (wymeditor) {
            expect(expect() + 1);
            strictEqual(
                wymeditor.getSelectedImage(),
                false
            );
        }
    });
});

test("Returns an image when it is exclusively selected", function () {
    manipulationTestHelper({
        startHtml: getSelectedImageHtml,
        prepareFunc: function (wymeditor) {
            var p = wymeditor.body().childNodes[0];
            makeSelection(
                wymeditor,
                p,
                p,
                1,
                2
            );
            expect(expect() + 1);
            strictEqual(
                wymeditor._getSelectedNodes()[0].tagName.toLowerCase(),
                "img"
            );
        },
        expectedResultHtml: getSelectedImageHtml,
        additionalAssertionsFunc: function (wymeditor) {
            var img = wymeditor.$body().find("img")[0];
            expect(expect() + 1);
            strictEqual(
                wymeditor.getSelectedImage(),
                img
            );
        }
    });
});

module("images-selection", {setup: prepareUnitTestModule});

test("Image is selected via `mouseup` in non pre-7 Trident", function () {
    manipulationTestHelper({
        async: true,
        startHtml: getSelectedImageHtml,
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.$body().find("img").mouseup();
        },
        expectedResultHtml: getSelectedImageHtml,
        additionalAssertionsFunc: function (wymeditor) {
            var img = wymeditor.$body().find("img")[0];
            expect(expect() + 1);
            strictEqual(
                wymeditor.getSelectedImage(),
                img
            );
        },
        skipFunc: function () {
            if (inPhantomjs) {
                return SKIP_THIS_TEST;
            }
            if (jQuery.browser.msie && jQuery.browser.versionNumber <= 10) {
                return SKIP_THIS_TEST;
            }
        }
    });
});

test("Image is selected via `mouseup` in pre-7 trident", function () {
    var wymeditor,
        _selectSingleNode,
        resume;

    if (
        jQuery.browser.msie !== true ||
        jQuery.browser.versionNumber > 10
    ) {
        expect(0);
        return;
    }

    wymeditor = jQuery.wymeditors(0);

    // Stop QUnit from running the next test
    stop();
    // Save the original
    _selectSingleNode = wymeditor._selectSingleNode;
    // Replace it with a wrapper
    wymeditor._selectSingleNode = function (node) {
        // Call the original
        _selectSingleNode.call(wymeditor, node);
        // Unwrap
        wymeditor._selectSingleNode = _selectSingleNode;
        // Resume `manipulationTestHelper`
        resume();
        // Allow QUnit to run the next test
        start();
    };

    resume = manipulationTestHelper({
        async: true,
        startHtml: getSelectedImageHtml,
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.$body().find("img").mouseup();
        },
        expectedResultHtml: getSelectedImageHtml,
        additionalAssertionsFunc: function (wymeditor) {
            var img = wymeditor.$body().find("img")[0];
            expect(expect() + 1);
            strictEqual(
                wymeditor.getSelectedImage(),
                img
            );
        }
    });
});

test("Image is selected via `dragend` in IE", function () {
    manipulationTestHelper({
        startHtml: getSelectedImageHtml,
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.$body().find("img").trigger("dragend");
        },
        expectedResultHtml: getSelectedImageHtml,
        skipFunc: function () {
            return jQuery.browser.msie ? false : SKIP_THIS_TEST;
        }
    });
});
