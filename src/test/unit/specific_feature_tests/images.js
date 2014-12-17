/* jshint evil: true */
/* global
    manipulationTestHelper,
    prepareUnitTestModule,
    test,
    expect,
    strictEqual
    equal,
    IMG_SRC,
    deepEqual
*/
"use strict";

module("images", {setup: prepareUnitTestModule});

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
                , "<img alt=\"Pen\" src=\"http://goo.gl/N9nqUc\" />"
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
