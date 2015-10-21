/* jshint evil: true */
/* global
    manipulationTestHelper,
    prepareUnitTestModule,
    test,
    expectOneMore,
    expectMore,
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
            expectOneMore();
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
            expectOneMore();
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
            expectOneMore();
            strictEqual(
                wymeditor._getSelectedNodes()[1].tagName.toLowerCase(),
                "img"
            );
        },
        expectedResultHtml: getSelectedImageHtml,
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
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
            expectMore(2);
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
            expectOneMore();
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
            expectOneMore();
            strictEqual(
                wymeditor._getSelectedNodes()[0].tagName.toLowerCase(),
                "img"
            );
        },
        expectedResultHtml: getSelectedImageHtml,
        additionalAssertionsFunc: function (wymeditor) {
            var img = wymeditor.$body().find("img")[0];
            expectOneMore();
            strictEqual(
                wymeditor.getSelectedImage(),
                img
            );
        }
    });
});

module("images-selection", {setup: prepareUnitTestModule});

test("Image is selected via `click`", function () {
    manipulationTestHelper({
        startHtml: getSelectedImageHtml,
        manipulationFunc: function (wymeditor) {
            wymeditor.$body().find("img").mouseover().click();
        },
        additionalAssertionsFunc: function (wymeditor) {
            var img = wymeditor.$body().find("img")[0];
            expectOneMore();
            strictEqual(
                wymeditor.getSelectedImage(),
                img
            );
        }
    });
});
