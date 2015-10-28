/* global
    expectOneMore,
    expectMore,
    prepareUnitTestModule,
    manipulationTestHelper,
    module,
    test,
    ok,
    strictEqual,
    makeTextSelection
*/
"use strict";

/*
 * This file contains tests for dialogs.
 */

module("dialogs-opening_or_not", {setup: prepareUnitTestModule});

var DIALOG_EXPECT_OPENED = "Expect this dialog to have been opened. " +
    "Expect it with all of your heart.";
var DIALOG_EXPECT_NOT_OPENED = "Nope. The dialog should not have opened.";

/*
 * This is a helper for testing whether a dialog window was opened or not.
 * It also tests whether the dialog has the correct title.
 *
 * If the dialog window can be opened using a keyboard shortcut, add that to
 * `getDialogKeyCombo` in this file, and that will be tested as well.
 *
 * Expects a single argument, an object, with the following properties:
 *
 * `dialogName`
 *     The name of the dialog
 * `currentTest`
 *     The current test
 * `noChangeHtml`
 *     The HTML to load at start and to expect at end.
 * `setCaretInSelector`
 *     Optional; jQuery selector for an element to set the caret in at the
 *     start of the test.
 * `prepareFunc`
 *     Optional; A function to prepare the test. Receives one argument, the
 *     WYMeditor instance.
 * `expectedOpenedOrNot`
 *     Whether the dialog is expected to open or not. Either
 *     DIALOG_EXPECT_OPENED` or
 *     DIALOG_EXPECT_NOT_OPENED` (These
 *     are constants).
 */
/* jshint latedef: nofunc */
function tryDialogWithClickAndKeyboardThenAssert(args) {
    var wymeditor = jQuery.wymeditors(0);

    // Wrap the dialog function with a spy
    args.currentTest.spy(wymeditor, "dialog");

    manipulationTestHelper({
        startHtml: args.noChangeHtml,
        setCaretInSelector: args.setCaretInSelector,
        prepareFunc: args.prepareFunc,
        manipulationClickSelector:
            getDialogToolbarSelector(args.dialogName),
        manipulationKeyCombo:
            getDialogKeyCombo(args.dialogName),
        expectedResultHtml: args.noChangeHtml,
        additionalAssertionsFunc: additionalAssertionsFunc
    });

    function additionalAssertionsFunc(wymeditor) {
        // Its return value is either the dialog window or `false`.
        var dialogReturns = wymeditor.dialog.returnValues,
            dialogWindowOrFalse = dialogReturns[dialogReturns.length - 1];

        if (args.expectedOpenedOrNot === DIALOG_EXPECT_OPENED) {
            assertOpened(dialogWindowOrFalse);
        } else if (args.expectedOpenedOrNot === DIALOG_EXPECT_NOT_OPENED) {
            assertNotOpened(dialogWindowOrFalse);
        } else {
            throw "Expected either `opened` or `not`";
        }
        // This is a convenience. During development, even if this test
        // fails because the dialog opened when it wasn't supposed to, then
        // close it
        if (
            dialogWindowOrFalse && (
                typeof dialogWindowOrFalse.close === "function" ||
                // IE
                typeof dialogWindowOrFalse.close === "object"
            )
        ) {
            dialogWindowOrFalse.close();
        }
    }

    function assertOpened(dialogWindow) {
        expectMore(2);
        ok(
            dialogWindow.window === dialogWindow,
            "Dialog window seems to exist"
        );

        strictEqual(
            dialogWindow.document.title,
            getDialogDocumentTitle(args.dialogName),
            "Dialog title"
        );
    }
    function assertNotOpened(returnedFalse) {
        expectOneMore();
        ok(
            returnedFalse === false,
            "Dialog function returned `false`"
        );
    }
}
/* jshint latedef: true */

// Provided a dialog name, returns a jQuery selector for that dialog's button.
function getDialogToolbarSelector(dialogName) {
    if (typeof dialogName !== "string") {
        throw "Expected a string";
    }
    return ".wym_section.wym_tools.wym_buttons li a[name=" + dialogName + "]";
}

function getDialogKeyCombo(dialogName) {
    return {
        CreateLink: "ctrl+k"
    }[dialogName] || null;
}

function getDialogDocumentTitle(dialogName) {
    if (typeof dialogName !== "string") {
        throw "Expected a string";
    }

    var TITLES = {
        CreateLink: "Link",
        InsertImage: "Image",
        Paste: "Paste from Word",
        InsertTable: "Table",
        Preview: "Preview"
    };

    if (TITLES.hasOwnProperty(dialogName) !== true) {
        throw "No such dialog";
    }
    return TITLES[dialogName];
}

test("Link dialog doesn't open when no selection", function () {
    tryDialogWithClickAndKeyboardThenAssert({
        dialogName: "CreateLink",
        currentTest: this,
        noChangeHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        expectedOpenedOrNot: DIALOG_EXPECT_NOT_OPENED
    });
});

test("Link dialog opens when selection is non-collapsed and " +
    "`selectedContainer` is a non-anchor element", function () {
    tryDialogWithClickAndKeyboardThenAssert({
        dialogName: "CreateLink",
        currentTest: this,
        noChangeHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            var p = wymeditor.body().childNodes[0];
            makeTextSelection(
                wymeditor,
                p,
                p,
                0,
                3
            );
        },
        expectedOpenedOrNot: DIALOG_EXPECT_OPENED
    });
});

test("Link dialog doesn't open when selection is collapsed and " +
    "`selectedContainer` doesn't return false", function () {
    tryDialogWithClickAndKeyboardThenAssert({
        dialogName: "CreateLink",
        currentTest: this,
        noChangeHtml: "<p>Foo</p>",
        setCaretInSelector: "p",
        expectedOpenedOrNot: DIALOG_EXPECT_NOT_OPENED
    });
});

test("Link dialog opens when selection is collapsed and " +
    "`selectedContainer` returns an `a` element", function () {
    tryDialogWithClickAndKeyboardThenAssert({
        dialogName: "CreateLink",
        currentTest: this,
        noChangeHtml: "<p><a href=\"http://example.com/\">Foo</a></p>",
        prepareFunc: function (wymeditor) {
            var a = wymeditor.$body().find("a")[0];
            makeTextSelection(
                wymeditor,
                a,
                a,
                1,
                1
            );
        },
        expectedOpenedOrNot: DIALOG_EXPECT_OPENED
    });
});

test("Link dialog opens when selection is non-collapsed and " +
    "`selectedContainer` returns an `a` element", function () {
    tryDialogWithClickAndKeyboardThenAssert({
        dialogName: "CreateLink",
        currentTest: this,
        noChangeHtml: "<p><a href=\"http://example.com/\">Foo</a></p>",
        prepareFunc: function (wymeditor) {
            var a = wymeditor.$body().find("a")[0];
            makeTextSelection(
                wymeditor,
                a,
                a,
                1,
                2
            );
        },
        expectedOpenedOrNot: DIALOG_EXPECT_OPENED
    });
});

test("Link dialog doesn't open when selection is non-collapsed and " +
    "`selectedContainer` returns false", function () {
    tryDialogWithClickAndKeyboardThenAssert({
        dialogName: "CreateLink",
        currentTest: this,
        noChangeHtml: "<p>Foo</p><p>Bar</p>",
        prepareFunc: function (wymeditor) {
            var firstP = wymeditor.body().childNodes[0],
                secondP = wymeditor.body().childNodes[1];
            makeTextSelection(
                wymeditor,
                firstP,
                secondP,
                0,
                3
            );
        },
        expectedOpenedOrNot: DIALOG_EXPECT_NOT_OPENED
    });
});

test("Image dialog doesn't open when no selection", function () {
    tryDialogWithClickAndKeyboardThenAssert({
        dialogName: "InsertImage",
        currentTest: this,
        noChangeHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        expectedOpenedOrNot: DIALOG_EXPECT_NOT_OPENED
    });
});

test("Image dialog opens when selection is non-collapsed", function () {
    tryDialogWithClickAndKeyboardThenAssert({
        dialogName: "InsertImage",
        currentTest: this,
        noChangeHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            var p = wymeditor.body().childNodes[0];
            makeTextSelection(
                wymeditor,
                p,
                p,
                0,
                3
            );
        },
        expectedOpenedOrNot: DIALOG_EXPECT_OPENED
    });
});

test("Image dialog opens when selection is collapsed", function () {
    tryDialogWithClickAndKeyboardThenAssert({
        dialogName: "InsertImage",
        currentTest: this,
        noChangeHtml: "<p>Foo</p>",
        setCaretInSelector: "p",
        expectedOpenedOrNot: DIALOG_EXPECT_OPENED
    });
});

test("Table dialog doesn't open when no selection", function () {
    tryDialogWithClickAndKeyboardThenAssert({
        dialogName: "InsertTable",
        currentTest: this,
        noChangeHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        expectedOpenedOrNot: DIALOG_EXPECT_NOT_OPENED
    });
});

test("Table dialog doesn't open when selection is non-collapsed", function () {
    tryDialogWithClickAndKeyboardThenAssert({
        dialogName: "InsertTable",
        currentTest: this,
        noChangeHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            var p = wymeditor.body().childNodes[0];
            makeTextSelection(
                wymeditor,
                p,
                p,
                0,
                3
            );
        },
        expectedOpenedOrNot: DIALOG_EXPECT_NOT_OPENED
    });
});

test("Table dialog opens when selection is collapsed and " +
    "`selectedContainer` doesn't return false", function () {
    tryDialogWithClickAndKeyboardThenAssert({
        dialogName: "InsertTable",
        currentTest: this,
        noChangeHtml: "<p>Foo</p>",
        setCaretInSelector: "p",
        expectedOpenedOrNot: DIALOG_EXPECT_OPENED
    });
});

test("Paste dialog doesn't open when no selection", function () {
    tryDialogWithClickAndKeyboardThenAssert({
        dialogName: "Paste",
        currentTest: this,
        noChangeHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        expectedOpenedOrNot: DIALOG_EXPECT_NOT_OPENED
    });
});

test("Paste dialog opens when selection is non-collapsed", function () {
    tryDialogWithClickAndKeyboardThenAssert({
        dialogName: "Paste",
        currentTest: this,
        noChangeHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            var p = wymeditor.body().childNodes[0];
            makeTextSelection(
                wymeditor,
                p,
                p,
                0,
                3
            );
        },
        expectedOpenedOrNot: DIALOG_EXPECT_OPENED
    });
});

test("Paste dialog opens when selection is collapsed", function () {
    tryDialogWithClickAndKeyboardThenAssert({
        dialogName: "Paste",
        currentTest: this,
        noChangeHtml: "<p>Foo</p>",
        setCaretInSelector: "p",
        expectedOpenedOrNot: DIALOG_EXPECT_OPENED
    });
});

test("Preview dialog opens when no selection", function () {
    tryDialogWithClickAndKeyboardThenAssert({
        dialogName: "Preview",
        currentTest: this,
        noChangeHtml: "<p>Foo</p>",
        expectedOpenedOrNot: DIALOG_EXPECT_OPENED
    });
});

test("Preview dialog opens when selection is collapsed", function () {
    tryDialogWithClickAndKeyboardThenAssert({
        dialogName: "Preview",
        currentTest: this,
        noChangeHtml: "<p>Foo</p>",
        setCaretInSelector: "p",
        expectedOpenedOrNot: DIALOG_EXPECT_OPENED
    });
});
