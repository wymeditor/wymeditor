/* jshint evil: true */
/* global
    manipulationTestHelper,
    prepareUnitTestModule,
    test,
    expect,
    strictEqual,
    makeSelection,
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

module("images-selection", {setup: prepareUnitTestModule});

test("Image is selected on mousedown", function () {
    var noChangeHtml = [""
            , "<p>"
                , "A "
                , "<img alt=\"Pen\" src=\"" + IMG_SRC + "\" />"
            , "</p>"
        ].join("");

    manipulationTestHelper({
        startHtml: noChangeHtml,
        manipulationFunc: function (wymeditor) {
            wymeditor.$body().find("img").mousedown();
        },
        expectedResultHtml: noChangeHtml,
        additionalAssertionsFunc: function (wymeditor) {
            expect(expect() + 2);
            strictEqual(
                wymeditor._getSelectedNodes().length,
                1,
                "Only one node is selected"
            );
            strictEqual(
                wymeditor._getSelectedNodes()[0].tagName.toLowerCase(),
                "img",
                "Image is the only selected node"
            );
        }
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

test("Returns an image after it was `mousedown`ed", function () {
    manipulationTestHelper({
        startHtml: getSelectedImageHtml,
        prepareFunc: function (wymeditor) {
            wymeditor.$body().find("img").mousedown();
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
