/* global
    prepareUnitTestModule,
    manipulationTestHelper,
    module,
    test,
    sinon,
    expect,
    ok,
    strictEqual,
    makeTextSelection
*/
"use strict";

/*
 * This file contains tests for dialogs.
 */

var sinonSpiesToRestore = [];

module("dialogs-opening_or_not", {
    setup: prepareUnitTestModule,
    teardown: function () {
        // Sinon spies are wrapped around functions during tests and added to
        // this array.
        // This unwraps the original functions from the spies after each test.
        while (sinonSpiesToRestore.length > 0) {
            sinonSpiesToRestore.pop().restore();
        }
    }
});

/*
 * This is a helper for testing whether a dialog window was opened or not.
 * It also tests whether the dialog has the correct title.
 *
 * Expects a single argument, an object, with the following properties:
 *
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
 *     Whether the dialog is expected to open or not. Either "opened" or "not".
 * `expectedTitle`
 *     The `document.title` that the dialog window is expected to have.
 */
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
        wymeditor.dialog = sinon.spy(wymeditor, "dialog");
        // Wrap the `window.open` native function with a spy
        if (sinonCantWrapWindowOpen !== true) {
            window.open = sinon.spy(window, "open");
            sinonSpiesToRestore.push(window.open);
        }
        sinonSpiesToRestore.push(wymeditor.dialog);

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

        // Its return value it either the dialog window or `false`.
        dialogWindowOrFalse = wymeditor.dialog.returnValues[0];

        if (args.expectedOpenedOrNot === "opened") {
            assertOpened(dialogWindowOrFalse);
        } else if (args.expectedOpenedOrNot === "not") {
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

function getDialogToolbarSelector(dialogName) {
    if (typeof dialogName !== "string") {
        throw "Expected a string";
    }
    return ".wym_section.wym_tools.wym_buttons li a[name=" + dialogName + "]";
}

function getDialogDocumentTitle(command) {
    if (typeof command !== "string") {
        throw "Expected a string";
    }

    var TITLES = {
        CreateLink: "Link",
        InsertImage: "Image",
        Paste: "Paste from Word",
        InsertTable: "Table",
        Preview: "Preview"
    };

    if (TITLES.hasOwnProperty(command) !== true) {
        throw "No such dialog";
    }
    return TITLES[command];
}

test("Link dialog doesn't open when no selection; by toolbar button click",
    function () {
    var command = WYMeditor.EXEC_COMMANDS.CREATE_LINK;
    dialogTestHelper({
        noChangeHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        dialogButtonSelector: getDialogToolbarSelector(command),
        expectedOpenedOrNot: "not",
        expectedTitle: getDialogDocumentTitle(command)
    });
});

test("Link dialog opens when selection is non-collapsed and " +
    "`selectedContainer` doesn't return false; by toolbar button click",
    function () {
    var command = WYMeditor.EXEC_COMMANDS.CREATE_LINK;
    dialogTestHelper({
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
        dialogButtonSelector: getDialogToolbarSelector(command),
        expectedOpenedOrNot: "opened",
        expectedTitle: getDialogDocumentTitle(command)
    });
});

test("Link dialog doesn't open when selection is collapsed and " +
    "`selectedContainer` doesn't return false; by toolbar button click",
    function () {
    var command = WYMeditor.EXEC_COMMANDS.CREATE_LINK;
    dialogTestHelper({
        noChangeHtml: "<p>Foo</p>",
        setCaretInSelector: "p",
        dialogButtonSelector: getDialogToolbarSelector(command),
        expectedOpenedOrNot: "not",
        expectedTitle: getDialogDocumentTitle(command)
    });
});

test("Link dialog doesn't open when selection is non-collapsed and " +
    "`selectedContainer` returns false; by toolbar button click",
    function () {
    var command = WYMeditor.EXEC_COMMANDS.CREATE_LINK;
    dialogTestHelper({
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
        dialogButtonSelector: getDialogToolbarSelector(command),
        expectedOpenedOrNot: "not",
        expectedTitle: getDialogDocumentTitle(command)
    });
});

test("Image dialog doesn't open when no selection; by toolbar " +
    "button click", function () {
    var command = WYMeditor.EXEC_COMMANDS.INSERT_IMAGE;
    dialogTestHelper({
        noChangeHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        dialogButtonSelector: getDialogToolbarSelector(command),
        expectedOpenedOrNot: "not",
        expectedTitle: getDialogDocumentTitle(command)
    });
});

test("Image dialog doesn't open when selection is non-collapsed; by toolbar " +
    "button", function () {
    var command = WYMeditor.EXEC_COMMANDS.INSERT_IMAGE;
    dialogTestHelper({
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
        dialogButtonSelector: getDialogToolbarSelector(command),
        expectedOpenedOrNot: "not",
        expectedTitle: getDialogDocumentTitle(command)
    });
});

test("Image dialog opens when selection is collapsed; by toolbar button",
    function () {
    var command = WYMeditor.EXEC_COMMANDS.INSERT_IMAGE;
    dialogTestHelper({
        noChangeHtml: "<p>Foo</p>",
        setCaretInSelector: "p",
        dialogButtonSelector: getDialogToolbarSelector(command),
        expectedOpenedOrNot: "opened",
        expectedTitle: getDialogDocumentTitle(command)
    });
});

test("Table dialog doesn't open when no selection; by toolbar button click",
    function () {
    var command = WYMeditor.EXEC_COMMANDS.INSERT_TABLE;
    dialogTestHelper({
        noChangeHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        dialogButtonSelector: getDialogToolbarSelector(command),
        expectedOpenedOrNot: "not",
        expectedTitle: getDialogDocumentTitle(command)
    });
});

test("Table dialog doesn't open when selection is non-collapsed; by toolbar " +
    "button", function () {
    var command = WYMeditor.EXEC_COMMANDS.INSERT_TABLE;
    dialogTestHelper({
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
        dialogButtonSelector: getDialogToolbarSelector(command),
        expectedOpenedOrNot: "not",
        expectedTitle: getDialogDocumentTitle(command)
    });
});

test("Table dialog opens when selection is collapsed and " +
    "`selectedContainer` doesn't return false; by toolbar button",
    function () {
    var command = WYMeditor.EXEC_COMMANDS.INSERT_TABLE;
    dialogTestHelper({
        noChangeHtml: "<p>Foo</p>",
        setCaretInSelector: "p",
        dialogButtonSelector: getDialogToolbarSelector(command),
        expectedOpenedOrNot: "opened",
        expectedTitle: getDialogDocumentTitle(command)
    });
});

test("Paste dialog doesn't open when no selection; by toolbar button click",
    function () {
    var command = WYMeditor.EXEC_COMMANDS.PASTE;
    dialogTestHelper({
        noChangeHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        dialogButtonSelector: getDialogToolbarSelector(command),
        expectedOpenedOrNot: "not",
        expectedTitle: getDialogDocumentTitle(command)
    });
});

test("Paste dialog doesn't open when selection is non-collapsed; by toolbar " +
    "button", function () {
    var command = WYMeditor.EXEC_COMMANDS.PASTE;
    dialogTestHelper({
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
        dialogButtonSelector: getDialogToolbarSelector(command),
        expectedOpenedOrNot: "not",
        expectedTitle: getDialogDocumentTitle(command)
    });
});

test("Paste dialog opens when selection is collapsed; by toolbar button",
    function () {
    var command = WYMeditor.EXEC_COMMANDS.PASTE;
    dialogTestHelper({
        noChangeHtml: "<p>Foo</p>",
        setCaretInSelector: "p",
        dialogButtonSelector: getDialogToolbarSelector(command),
        expectedOpenedOrNot: "opened",
        expectedTitle: getDialogDocumentTitle(command)
    });
});

test("Preview dialog opens when no selection; by toolbar button", function () {
    var command = WYMeditor.EXEC_COMMANDS.PREVIEW;
    dialogTestHelper({
        noChangeHtml: "<p>Foo</p>",
        dialogButtonSelector: getDialogToolbarSelector(command),
        expectedOpenedOrNot: "opened",
        expectedTitle: getDialogDocumentTitle(command)
    });
});

test("Preview dialog opens when selection is collapsed; by toolbar button",
    function () {
    var command = WYMeditor.EXEC_COMMANDS.PREVIEW;
    dialogTestHelper({
        noChangeHtml: "<p>Foo</p>",
        setCaretInSelector: "p",
        dialogButtonSelector: getDialogToolbarSelector(command),
        expectedOpenedOrNot: "opened",
        expectedTitle: getDialogDocumentTitle(command)
    });
});
