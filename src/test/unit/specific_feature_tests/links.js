/* jshint evil: true */
/* global
    manipulationTestHelper,
    prepareUnitTestModule,
    makeTextSelection,
    test
*/
"use strict";

module("links", {setup: prepareUnitTestModule});

test("Inserts link with attributes", function () {
    manipulationTestHelper({
        startHtml: "<p>Foobar</p>",
        prepareFunc: function (wymeditor) {
            var p = wymeditor.$body().children('p');
            // Select "bar".
            makeTextSelection(
                wymeditor,
                p,
                p,
                3,
                6
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.link({href: 'http://example.com/', title: 'Example'});
        },
        expectedResultHtml: "<p>Foo<a href=\"http://example.com/\" " +
            "title=\"Example\">bar</a></p>",
        testUndoRedo: true
    });
});
test("Modifies link attributes", function () {
    manipulationTestHelper({
        startHtml: "<p><a href=\"http://example.com/foo\">Bar</a></p>",
        setCaretInSelector: 'a',
        manipulationFunc: function (wymeditor) {
            wymeditor.link({href: "http://example.com/baz", target: "_blank"});
        },
        expectedResultHtml: "<p><a href=\"http://example.com/baz\"" +
            " target=\"_blank\">Bar</a></p>",
        testUndoRedo: true
    });
});
