/* jshint evil: true */
/* global
    testWymManipulation,
    prepareUnitTestModule,
    makeTextSelection,
    expect,
    ok
*/
"use strict";
module("exec_manipulations", {setup: prepareUnitTestModule});

testWymManipulation({
    testName: "Bold",
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
    expectedResultHtml: "<p><strong>Foo</strong></p>",
    parseHtml: true,
    testUndoRedo: true
});

testWymManipulation({
    testName: "Italic",
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

testWymManipulation({
    testName: "Superscript",
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

testWymManipulation({
    testName: "Subscript",
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
