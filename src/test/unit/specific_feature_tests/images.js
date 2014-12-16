/* jshint evil: true */
/* global
    manipulationTestHelper,
    prepareUnitTestModule,
    test,
    expect,
    strictEqual
*/
"use strict";

module("images", {setup: prepareUnitTestModule});

test("Inserts image into a paragraph", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        setCaretInSelector: 'p',
        manipulationFunc: function (wymeditor) {
            wymeditor.insertImage({
                src: "http://example.com/example.jpg",
                alt: "Example"
            });
        },
        expectedResultHtml: "<p><img alt=\"Example\" " +
            "src=\"http://example.com/example.jpg\" />Foo</p>",
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
                src: "http://example.com/example.jpg"
            });
        },
        expectedResultHtml: "<img alt=\"Example\" " +
            "src=\"http://example.com/example.jpg\" /><br />",
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
        prepareFunc: function (wymeditor) {
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
