/* jshint evil: true */
/* global
    manipulationTestHelper,
    test,
    prepareUnitTestModule,
    makeTextSelection,
    expect,
    ok
*/
"use strict";
module("exec_manipulations", {setup: prepareUnitTestModule});

test("Bold", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            var p = wymeditor.$body().children("p")[0];
            makeTextSelection(
                wymeditor,
                p,
                p,
                0,
                3
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.exec("Bold");
        },
        manipulationKeyCombo: "ctrl+b",
        expectedResultHtml: "<p><strong>Foo</strong></p>",
        parseHtml: true,
        testUndoRedo: true
    });
});

test("Italic", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            var p = wymeditor.$body().children("p")[0];
            makeTextSelection(
                wymeditor,
                p,
                p,
                0,
                3
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.exec("Italic");
        },
        manipulationKeyCombo: "ctrl+i",
        additionalAssertionsFunc: function (
            // `wymeditor` seems to be unused because of the ignore, below.
            /* jshint ignore:start */
            wymeditor
            /* jshint ignore:end */
        ) {
            expect(expect() + 1);
            ok(
                jQuery.inArray(
                    // JSHint does not approve of this indentation.
                    /* jshint ignore:start */
                    wymeditor.rawHtml().toLowerCase(),
                    [
                        "<p><i>foo</i></p>",
                        "<p><em>foo</em></p>"
                    ]
                    /* jshint ignore:end */
                ) > -1,
                "Either `i` or `em`."
            );
        },
        testUndoRedo: true
    });
});

test("Superscript", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            var p = wymeditor.$body().children("p")[0];
            makeTextSelection(
                wymeditor,
                p,
                p,
                0,
                3
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.exec("Superscript");
        },
        expectedResultHtml: "<p><sup>Foo</sup></p>",
        testUndoRedo: true
    });
});

test("Subscript", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            var p = wymeditor.$body().children("p")[0];
            makeTextSelection(
                wymeditor,
                p,
                p,
                0,
                3
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.exec("Subscript");
        },
        expectedResultHtml: "<p><sub>Foo</sub></p>",
        testUndoRedo: true
    });
});
