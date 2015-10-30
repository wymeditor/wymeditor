/* jshint evil: true */
/* global
    manipulationTestHelper,
    stop,
    start,
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

module("images-_updateImageAttrs", {setup: prepareUnitTestModule});

test("Updates image attributes", function () {
    manipulationTestHelper({
        startHtml: '<p><img alt="fooalt" src="foosrc" title="footitle" /></p>',
        manipulationFunc: function (wymeditor) {
            var img = wymeditor.body().childNodes[0].childNodes[0];
            wymeditor._updateImageAttrs(img, {
                src: 'barsrc',
                alt: 'baralt',
                title: 'bartitle'
            });
        },
        expectedResultHtml: [''
            , '<p>'
                , '<img alt="baralt" src="barsrc" title="bartitle" />'
            , '</p>'
        ].join('')
    });
});

test("on `src` attr change, remove `height` & `width` attrs", function () {
    manipulationTestHelper({
        startHtml: '<p><img height="10" src="foo" width="10" /></p>',
        manipulationFunc: function (wymeditor) {
            var img = wymeditor.body().childNodes[0].childNodes[0];
            wymeditor._updateImageAttrs(img, {src: 'bar'});
        },
        expectedResultHtml: '<p><img src="bar" /></p>'
    });
});

test("on `src` attr change, nullify `DimensionsRatio` data", function () {
    var PHI = 0.618;
    manipulationTestHelper({
        startHtml: '<p><img src="foo" /></p>',
        prepareFunc: function (wymeditor) {
            expectOneMore();
            var $img = wymeditor.$body().find('img');
            $img.data('DimensionsRatio', PHI);
            strictEqual($img.data('DimensionsRatio'), PHI);
        },
        manipulationFunc: function (wymeditor) {
            var img = wymeditor.body().childNodes[0].childNodes[0];
            wymeditor._updateImageAttrs(img, {src: 'bar'});
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            var $img = wymeditor.$body().find('img');
            strictEqual($img.data('DimensionsRatio'), null);
        }
    });
});

test("no `src` attr change, not changing `DimensionsRatio` data", function () {
    var PHI = 0.618;
    manipulationTestHelper({
        startHtml: '<p><img src="foo" /></p>',
        prepareFunc: function (wymeditor) {
            expectOneMore();
            var $img = wymeditor.$body().find('img');
            $img.data('DimensionsRatio', PHI);
            strictEqual($img.data('DimensionsRatio'), PHI);
        },
        manipulationFunc: function (wymeditor) {
            var img = wymeditor.body().childNodes[0].childNodes[0];
            wymeditor._updateImageAttrs(img, {src: 'foo'});
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            var $img = wymeditor.$body().find('img');
            strictEqual($img.data('DimensionsRatio'), PHI);
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
            wymeditor.$body().find("img")
                .click();
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            var img = wymeditor.$body().find("img")[0];
            var assertImageIsSelected = function () {
                strictEqual(
                    wymeditor.getSelectedImage(),
                    img
                );
            };
            if (jQuery.browser.msie && jQuery.browser.versionNumber === 8) {
                // image is selected async
                stop();
                setTimeout(function () {
                    start();
                    assertImageIsSelected();
                });
                return;
            }
            assertImageIsSelected();
        }
    });
});
