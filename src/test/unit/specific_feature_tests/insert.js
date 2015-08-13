/* jshint evil: true */
/* global
    prepareUnitTestModule,
    manipulationTestHelper,
    test
*/
"use strict";

module("insert", {setup: prepareUnitTestModule});

test("Text into paragraph using function", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        setCaretInSelector: 'p',
        manipulationFunc: function (wymeditor) {
            wymeditor.insert('Bar, and ');
        },
        expectedResultHtml: "<p>Bar, and Foo</p>"
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
