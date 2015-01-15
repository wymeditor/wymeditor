/* global
    prepareUnitTestModule,
    manipulationTestHelper,
    module,
    test,
    expect,
    ok,
    strictEqual,
    makeTextSelection
*/
"use strict";

/*
 * This file contains tests for dialogs.
 */

module("dialogs-opening_or_not", {setup: prepareUnitTestModule});

/*
 * This is a helper for testing whether a dialog window was opened or not.
 * It also tests whether the dialog has the correct title.
 *
 * Expects a single argument, an object, with the following properties:
 *
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
 * `dialogButtonSelector`
 *     A jQuery selector of the dialog button. It will be `jQuery.click()`ed.
 * `expectedOpenedOrNot`
 *     Whether the dialog is expected to open or not. Either
 *     `dialogTestHelper.EXPECT_OPENED` or `dialogTestHelper.EXPECT_NOT` (These
 *     are constants).
 * `expectedTitle`
 *     The `document.title` that the dialog window is expected to have.
 */
/* jshint latedef: nofunc */
function dialogTestHelper(args) {
    // Sinon doesn't allow wrapping of `window.open` with a spy because `open`
    // doesn't look like a function in these browsers.
    var sinonCantWrapWindowOpen = jQuery.browser.msie &&
        jQuery.browser.versionNumber <= 8;

    manipulationTestHelper({
        startHtml: args.noChangeHtml,
        setCaretInSelector: args.setCaretInSelector,
        prepareFunc: prepareFunc,
        manipulationClickSelector: args.dialogButtonSelector,
        expectedResultHtml: args.noChangeHtml,
        additionalAssertionsFunc: additionalAssertionsFunc
    });

    function prepareFunc(wymeditor) {
        // Wrap the dialog function with a spy
        args.currentTest.spy(wymeditor, "dialog");
        if (sinonCantWrapWindowOpen !== true) {
            // Wrap the `window.open` native function with a spy
            args.currentTest.spy(window, "open");
        }

        if (typeof args.prepareFunc === "function") {
            // Call the provided `prepareFunc`
            args.prepareFunc(wymeditor);
        }
    }

    function additionalAssertionsFunc(wymeditor) {
        var dialogWindowOrFalse;
        expect(expect() + 1);

        ok(
            // The dialog function is called, whether the dialog is to be
            // opened or not. It has the code that determines that.
            wymeditor.dialog.calledOnce,
            "Dialog function called once"
        );

        // Its return value is either the dialog window or `false`.
        dialogWindowOrFalse = wymeditor.dialog.returnValues[0];

        if (args.expectedOpenedOrNot === dialogTestHelper.EXPECT_OPENED) {
            assertOpened(dialogWindowOrFalse);
        } else if (args.expectedOpenedOrNot === dialogTestHelper.EXPECT_NOT) {
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
        expect(expect() + 2);
        if (sinonCantWrapWindowOpen !== true) {
            expect(expect() + 1);
            ok(
                window.open.calledOnce,
                "`window.open` was called"
            );
        }
        ok(
            dialogWindow.window === dialogWindow,
            "Dialog window seems to exist"
        );

        strictEqual(
            dialogWindow.document.title,
            args.expectedTitle,
            "Dialog title"
        );
    }
    function assertNotOpened(returnedFalse) {
        expect(expect() + 1);
        if (sinonCantWrapWindowOpen !== true) {
            expect(expect() + 1);
            ok(
                window.open.callCount === 0,
                "`window.open` was not called"
            );
        }
        ok(
            returnedFalse === false,
            "Dialog function returned `false`"
        );
    }
}
/* jshint latedef: true */

dialogTestHelper.EXPECT_OPENED = "Expect this dialog to have been opened. " +
    "Expect it with all of your heart.";
dialogTestHelper.EXPECT_NOT = "Nope. The dialog should not have opened.";

// Provided a dialog name, returns a jQuery selector for that dialog's button.
function getDialogToolbarSelector(dialogName) {
    if (typeof dialogName !== "string") {
        throw "Expected a string";
    }
    return ".wym_section.wym_tools.wym_buttons li a[name=" + dialogName + "]";
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

test("Link dialog doesn't open when no selection; by toolbar button click",
    function () {
        var dialogName = "CreateLink";
        dialogTestHelper({
            currentTest: this,
            noChangeHtml: "<p>Foo</p>",
            prepareFunc: function (wymeditor) {
                wymeditor.deselect();
            },
            dialogButtonSelector: getDialogToolbarSelector(dialogName),
            expectedOpenedOrNot: dialogTestHelper.EXPECT_NOT,
            expectedTitle: getDialogDocumentTitle(dialogName)
        });
    }
);

test("Link dialog opens when selection is non-collapsed and " +
    "`selectedContainer` doesn't return false; by toolbar button click",
    function () {
        var dialogName = "CreateLink";
        dialogTestHelper({
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
            dialogButtonSelector: getDialogToolbarSelector(dialogName),
            expectedOpenedOrNot: dialogTestHelper.EXPECT_OPENED,
            expectedTitle: getDialogDocumentTitle(dialogName)
        });
    }
);

test(
    "Link dialog doesn't open when selection is collapsed and " +
    "`selectedContainer` doesn't return false; by toolbar button click",
    function () {
        var dialogName = "CreateLink";
        dialogTestHelper({
            currentTest: this,
            noChangeHtml: "<p>Foo</p>",
            setCaretInSelector: "p",
            dialogButtonSelector: getDialogToolbarSelector(dialogName),
            expectedOpenedOrNot: dialogTestHelper.EXPECT_NOT,
            expectedTitle: getDialogDocumentTitle(dialogName)
        });
    }
);

test("Link dialog opens when selection is collapsed and " +
    "`selectedContainer` returns an `a` element; by toolbar button click",
    function () {
        var dialogName = "CreateLink";
        dialogTestHelper({
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
            dialogButtonSelector: getDialogToolbarSelector(dialogName),
            expectedOpenedOrNot: dialogTestHelper.EXPECT_OPENED,
            expectedTitle: getDialogDocumentTitle(dialogName)
        });
    }
);

test("Link dialog doesn't open when selection is non-collapsed and " +
    "`selectedContainer` returns false; by toolbar button click",
    function () {
        var dialogName = "CreateLink";
        dialogTestHelper({
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
            dialogButtonSelector: getDialogToolbarSelector(dialogName),
            expectedOpenedOrNot: dialogTestHelper.EXPECT_NOT,
            expectedTitle: getDialogDocumentTitle(dialogName)
        });
    }
);

test("Image dialog doesn't open when no selection; by toolbar " +
    "button click", function () {
        var dialogName = "InsertImage";
        dialogTestHelper({
            currentTest: this,
            noChangeHtml: "<p>Foo</p>",
            prepareFunc: function (wymeditor) {
                wymeditor.deselect();
            },
            dialogButtonSelector: getDialogToolbarSelector(dialogName),
            expectedOpenedOrNot: dialogTestHelper.EXPECT_NOT,
            expectedTitle: getDialogDocumentTitle(dialogName)
        });
    }
);

test("Image dialog doesn't open when selection is non-collapsed; by toolbar " +
    "button", function () {
        var dialogName = "InsertImage";
        dialogTestHelper({
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
            dialogButtonSelector: getDialogToolbarSelector(dialogName),
            expectedOpenedOrNot: dialogTestHelper.EXPECT_NOT,
            expectedTitle: getDialogDocumentTitle(dialogName)
        });
    }
);

test("Image dialog opens when selection is collapsed; by toolbar button",
    function () {
        var dialogName = "InsertImage";
        dialogTestHelper({
            currentTest: this,
            noChangeHtml: "<p>Foo</p>",
            setCaretInSelector: "p",
            dialogButtonSelector: getDialogToolbarSelector(dialogName),
            expectedOpenedOrNot: dialogTestHelper.EXPECT_OPENED,
            expectedTitle: getDialogDocumentTitle(dialogName)
        });
    }
);

test("Table dialog doesn't open when no selection; by toolbar button click",
    function () {
        var dialogName = "InsertTable";
        dialogTestHelper({
            currentTest: this,
            noChangeHtml: "<p>Foo</p>",
            prepareFunc: function (wymeditor) {
                wymeditor.deselect();
            },
            dialogButtonSelector: getDialogToolbarSelector(dialogName),
            expectedOpenedOrNot: dialogTestHelper.EXPECT_NOT,
            expectedTitle: getDialogDocumentTitle(dialogName)
        });
    }
);

test("Table dialog doesn't open when selection is non-collapsed; by toolbar " +
    "button", function () {
        var dialogName = "InsertTable";
        dialogTestHelper({
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
            dialogButtonSelector: getDialogToolbarSelector(dialogName),
            expectedOpenedOrNot: dialogTestHelper.EXPECT_NOT,
            expectedTitle: getDialogDocumentTitle(dialogName)
        });
    }
);

test("Table dialog opens when selection is collapsed and " +
    "`selectedContainer` doesn't return false; by toolbar button",
    function () {
        var dialogName = "InsertTable";
        dialogTestHelper({
            currentTest: this,
            noChangeHtml: "<p>Foo</p>",
            setCaretInSelector: "p",
            dialogButtonSelector: getDialogToolbarSelector(dialogName),
            expectedOpenedOrNot: dialogTestHelper.EXPECT_OPENED,
            expectedTitle: getDialogDocumentTitle(dialogName)
        });
    }
);

test("Paste dialog doesn't open when no selection; by toolbar button click",
    function () {
        var dialogName = "Paste";
        dialogTestHelper({
            currentTest: this,
            noChangeHtml: "<p>Foo</p>",
            prepareFunc: function (wymeditor) {
                wymeditor.deselect();
            },
            dialogButtonSelector: getDialogToolbarSelector(dialogName),
            expectedOpenedOrNot: dialogTestHelper.EXPECT_NOT,
            expectedTitle: getDialogDocumentTitle(dialogName)
        });
    }
);

test("Paste dialog doesn't open when selection is non-collapsed; by toolbar " +
    "button", function () {
        var dialogName = "Paste";
        dialogTestHelper({
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
            dialogButtonSelector: getDialogToolbarSelector(dialogName),
            expectedOpenedOrNot: dialogTestHelper.EXPECT_NOT,
            expectedTitle: getDialogDocumentTitle(dialogName)
        });
    }
);

test("Paste dialog opens when selection is collapsed; by toolbar button",
    function () {
        var dialogName = "Paste";
        dialogTestHelper({
            currentTest: this,
            noChangeHtml: "<p>Foo</p>",
            setCaretInSelector: "p",
            dialogButtonSelector: getDialogToolbarSelector(dialogName),
            expectedOpenedOrNot: dialogTestHelper.EXPECT_OPENED,
            expectedTitle: getDialogDocumentTitle(dialogName)
        });
    }
);

test("Preview dialog opens when no selection; by toolbar button", function () {
    var dialogName = "Preview";
    dialogTestHelper({
        currentTest: this,
        noChangeHtml: "<p>Foo</p>",
        dialogButtonSelector: getDialogToolbarSelector(dialogName),
        expectedOpenedOrNot: dialogTestHelper.EXPECT_OPENED,
        expectedTitle: getDialogDocumentTitle(dialogName)
    });
});

test("Preview dialog opens when selection is collapsed; by toolbar button",
    function () {
        var dialogName = "Preview";
        dialogTestHelper({
            currentTest: this,
            noChangeHtml: "<p>Foo</p>",
            setCaretInSelector: "p",
            dialogButtonSelector: getDialogToolbarSelector(dialogName),
            expectedOpenedOrNot: dialogTestHelper.EXPECT_OPENED,
            expectedTitle: getDialogDocumentTitle(dialogName)
        });
    }
);
