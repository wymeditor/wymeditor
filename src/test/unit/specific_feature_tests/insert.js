/* jshint evil: true */
/* global
    prepareUnitTestModule,
    manipulationTestHelper,
    test,
    makeTextSelection
*/
"use strict";

module("insert", {setup: prepareUnitTestModule});

test("Text into paragraph", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        setCaretInSelector: 'p',
        manipulationFunc: function (wymeditor) {
            wymeditor.insert('Bar, and ');
        },
        expectedResultHtml: "<p>Bar, and Foo</p>"
    });
});

test("Text into paragraph replacing selection", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            var p = wymeditor.$body().find('p');
            makeTextSelection(
                wymeditor,
                p,
                p,
                0,
                1
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.insert('B');
        },
        expectedResultHtml: '<p>Boo</p>'
    });
});

test("No insertion when no selection", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.insert('Do not let me get inserted');
        },
        expectedResultHtml: "<p>Foo</p>"
    });
});
