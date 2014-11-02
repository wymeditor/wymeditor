/* jshint evil: true */
/* global
    test,
    wymEqual,
    prepareUnitTestModule,
    makeTextSelection,
    expect,
    equal
*/
"use strict";

/**
 * testUndoRedo
 * ============
 *
 * Tests Undo/Redo functionality.
 *
 * @param a An object, containing:
 *     `testName`
 *         A name for the test.
 *     `startHtml`
 *         HTML to start the test with. Required if `expectedStartHtml` is not
 *         used.
 *     `setCaretInSelector`
 *         Optional; jQuery selector for an element to set the caret in at the
 *         start of the test.
 *     `prepareFunc`
 *         Optional; A function to prepare the test. Receives one argument, the
 *         WYMeditor instance.
 *     `expectedStartHtml`
 *         The HTML that is expected to be the state of the document after the
 *         `prepareFunc` ran. If this is not provided, the value of `startHtml`
 *         will be used.
 *     `manipulationFunc`
 *         The manipulation function to be tested. Receives one argument, the
 *         WYMeditor instance.
 *     `expectedResultHtml`
 *         The HTML that is expected to be the state of the document after the
 *         `manipulationFunc` ran.
 *     `additionalAssertionsFunc`
 *         Optional; Additional assertions for after the `manipulationFunc`.
 */
function testUndoRedo(a) {
    test(a.testName, function () {
        var wymeditor = jQuery.wymeditors(0);
        if (a.startHtml) {
            wymeditor.html(a.startHtml);
        }
        if (a.setCaretInSelector) {
            wymeditor.setCaretIn(
                wymeditor.$body().find(a.setCaretInSelector)[0]
            );
        }
        if (a.prepareFunc) {
            a.prepareFunc(wymeditor);
        }
        wymeditor.undoRedo.reset();
        wymEqual(wymeditor, a.expectedStartHtml || a.startHtml);

        a.manipulationFunc(wymeditor);
        wymEqual(wymeditor, a.expectedResultHtml);
        if (a.additionalAssertionsFunc) {
            a.additionalAssertionsFunc(wymeditor);
        }

        wymeditor.undoRedo.undo();
        wymEqual(wymeditor, a.expectedStartHtml || a.startHtml);

        wymeditor.undoRedo.redo();
        wymEqual(wymeditor, a.expectedResultHtml);
        if (a.additionalAssertionsFunc) {
            a.additionalAssertionsFunc(wymeditor);
        }
    });
}

module("undo_redo", {setup: prepareUnitTestModule});

testUndoRedo({
    testName: "List; InsertOrderedList",
    startHtml: "<p>Foo</p>",
    setCaretInSelector: "p",
    manipulationFunc: function (wymeditor) {
        wymeditor.exec("InsertOrderedList");
    },
    expectedResultHtml: "<ol><li>Foo</li></ol>"
});

testUndoRedo({
    testName: "List; InsertUnorderedList",
    startHtml: "<p>Foo</p>",
    setCaretInSelector: "p",
    manipulationFunc: function (wymeditor) {
        wymeditor.exec("InsertUnorderedList");
    },
    expectedResultHtml: "<ul><li>Foo</li></ul>"
});

testUndoRedo({
    testName: "List; Indent",
    startHtml: "<ol><li>Foo</li></ol>",
    setCaretInSelector: "li",
    manipulationFunc: function (wymeditor) {
        wymeditor.exec("Indent");
    },
    expectedResultHtml:
        "<ol><li class=\"spacer_li\"><ol><li>Foo</li></ol></li></ol>"
});

testUndoRedo({
    testName: "List; Outdent",
    startHtml: "<ol><li class=\"spacer_li\"><ol><li>Foo</li></ol></li></ol>",
    setCaretInSelector: "li li",
    manipulationFunc: function (wymeditor) {
        wymeditor.exec("Outdent");
    },
    expectedResultHtml:
        "<ol><li>Foo</li></ol>"
});

var DAWN_OF_HISTORY = "<h1>Dawn of History</h1>";

testUndoRedo({
    testName: "No going back before dawn of history",
    startHtml: DAWN_OF_HISTORY,
    manipulationFunc: function () {},
    additionalAssertionsFunc: function (wymeditor) {
        wymEqual(wymeditor, DAWN_OF_HISTORY);
    },
    expectedResultHtml: DAWN_OF_HISTORY
});

testUndoRedo({
    testName: "Restores selection",
    startHtml: "<p>Foo</p><p>Bar</p>",
    prepareFunc: function (wymeditor) {
        makeTextSelection(
            wymeditor,
            wymeditor.$body().children('p')[0],
            wymeditor.$body().children('p')[1],
            0,
            3
        );
    },
    manipulationFunc: function () {},
    additionalAssertionsFunc: function (wymeditor) {
        equal(
            wymeditor.selection().toString(),
            "FooBar"
        );
    },
    expectedResultHtml: "<p>Foo</p><p>Bar</p>"
});

test("Redo when everything has been redone", function () {
    expect(5);

    var wymeditor = jQuery.wymeditors(0);

    wymeditor.html("<p>Foo</p>");
    wymeditor.undoRedo.reset();
    wymEqual(wymeditor, "<p>Foo</p>");

    wymeditor.$body().append("<p>Bar</p>");
    wymeditor.registerChange();
    wymEqual(wymeditor, "<p>Foo</p><p>Bar</p>");

    wymeditor.undoRedo.undo();
    wymEqual(wymeditor, "<p>Foo</p>");

    wymeditor.undoRedo.redo();
    wymEqual(wymeditor, "<p>Foo</p><p>Bar</p>");

    wymeditor.undoRedo.redo();
    // There are no more things to redo.
    wymEqual(wymeditor, "<p>Foo</p><p>Bar</p>");
});

test("Toolbar buttons", function () {
    expect(4);

    var wymeditor = jQuery.wymeditors(0),
        $buttons = wymeditor.get$Buttons(),
        $undoButton = $buttons.filter("[name=Undo]"),
        $redoButton = $buttons.filter("[name=Redo]");

    wymeditor.html("<p>Foo</p>");
    wymeditor.undoRedo.reset();
    wymEqual(wymeditor, "<p>Foo</p>");

    wymeditor.$body().append("<p>Bar</p>");
    wymeditor.registerChange();
    wymEqual(wymeditor, "<p>Foo</p><p>Bar</p>");

    $undoButton.click();
    wymEqual(wymeditor, "<p>Foo</p>");

    $redoButton.click();
    wymEqual(wymeditor, "<p>Foo</p><p>Bar</p>");
});

testUndoRedo({
    testName: "Italic",
    startHtml: "<p>Foo</p>",
    prepareFunc: function (wymeditor) {
        makeTextSelection(
            wymeditor,
            wymeditor.$body().children("p")[0],
            wymeditor.$body().children("p")[0],
            0,
            3
        );
    },
    manipulationFunc: function (wymeditor) {
        wymeditor.exec("Italic");
    },
    expectedResultHtml: "<p><em>Foo</em></p>"
});

testUndoRedo({
    testName: "Subscript",
    startHtml: "<p>Foo</p>",
    prepareFunc: function (wymeditor) {
        makeTextSelection(
            wymeditor,
            wymeditor.$body().children("p")[0],
            wymeditor.$body().children("p")[0],
            0,
            3
        );
    },
    manipulationFunc: function (wymeditor) {
        wymeditor.exec("Subscript");
    },
    expectedResultHtml: "<p><sub>Foo</sub></p>"
});

testUndoRedo({
    testName: "Superscript",
    startHtml: "<p>Foo</p>",
    prepareFunc: function (wymeditor) {
        makeTextSelection(
            wymeditor,
            wymeditor.$body().children("p")[0],
            wymeditor.$body().children("p")[0],
            0,
            3
        );
    },
    manipulationFunc: function (wymeditor) {
        wymeditor.exec("Superscript");
    },
    expectedResultHtml: "<p><sup>Foo</sup></p>"
});

testUndoRedo({
    testName: "Unlink",
    startHtml: "<p><a>Foo</a></p>",
    prepareFunc: function (wymeditor) {
        makeTextSelection(
            wymeditor,
            wymeditor.$body().find("a")[0],
            wymeditor.$body().find("a")[0],
            0,
            3
        );
    },
    manipulationFunc: function (wymeditor) {
        wymeditor.exec("Unlink");
    },
    expectedResultHtml: "<p>Foo</p>"
});

test("Nothing to redo after change", function () {
    expect(4);

    var wymeditor = jQuery.wymeditors(0);

    wymeditor.html("<p>Foo</p>");
    wymeditor.undoRedo.reset();
    wymEqual(wymeditor, "<p>Foo</p>");

    wymeditor.$body().append("<p>Bar</p>");
    wymeditor.registerChange();
    wymEqual(wymeditor, "<p>Foo</p><p>Bar</p>");

    wymeditor.undoRedo.undo();
    wymEqual(wymeditor, "<p>Foo</p>");

    wymeditor.$body().append("<p>Zad</p>");
    wymeditor.registerChange();
    wymeditor.undoRedo.redo();
    // Nothing was redone.
    wymEqual(wymeditor, "<p>Foo</p><p>Zad</p>");
});
