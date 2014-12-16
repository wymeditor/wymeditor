/* global
    prepareUnitTestModule,
    manipulationTestHelper,
    module,
    test,
    sinon,
    expect,
    ok,
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
        // Sinon spies are wrapped around function during tests and added to
        // this array.
        // This unwraps the original functions from the spies after each test.
        while (sinonSpiesToRestore.length > 0) {
            sinonSpiesToRestore.pop().restore();
        }
    }
});

/*
 * This is a helper for testing whether a dialog window was opened or not.
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
 * `clickSelector`
 *     jQuery.click() will be used on the element(s) selected by
 *     this selector.
 * `expectedOpenedOrNot`
 *     Whether the dialog is expected to open or not. Either "opened" or "not".
 */
function dialogTestHelper(args) {
    // Sinon doesn't allow wrapping of `window.open` with a spy because `open`
    // doesn't look like a function in these browsers.
    var sinonCantWrapWindowOpen = jQuery.browser.msie &&
        jQuery.browser.versionNumber <= 8;

    manipulationTestHelper({
        startHtml: args.noChangeHtml,
        setCaretInSelector: args.setCaretInSelector,
        prepareFunc: function (wymeditor) {
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
        },
        manipulationFunc: function () {
            jQuery(args.clickSelector).click();
        },
        expectedResultHtml: args.noChangeHtml,
        additionalAssertionsFunc: function (wymeditor) {
            var dialogWindowOrFalse;
            expect(expect() + 2);

            ok(
                // The dialog function is called anyway. It has the code that
                // determines whether the dialog will be opened or not.
                wymeditor.dialog.calledOnce,
                "Dialog function called once"
            );

            // Its return value it either the dialog window or `false`.
            dialogWindowOrFalse = wymeditor.dialog.returnValues[0];

            if (args.expectedOpenedOrNot === "opened") {
                if (sinonCantWrapWindowOpen !== true) {
                    expect(expect() + 1);
                    ok(
                        window.open.calledOnce,
                        "`window.open` was called"
                    );
                }
                ok(
                    dialogWindowOrFalse.window === dialogWindowOrFalse,
                    "Dialog window seems to exist"
                );

            } else if (args.expectedOpenedOrNot === "not") {
                if (sinonCantWrapWindowOpen !== true) {
                    expect(expect() + 1);
                    ok(
                        window.open.callCount === 0,
                        "`window.open` was not called"
                    );
                }
                ok(
                    dialogWindowOrFalse === false,
                    "Dialog function returned `false`"
                );
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
    });
}

function getDialogToolbarSelector(dialogName) {
    if (typeof dialogName !== "string") {
        throw "Expected a string";
    }
    return ".wym_section.wym_tools.wym_buttons li a[name=" + dialogName + "]";
}

test("Link dialog doesn't open when no selection; by toolbar button click",
    function () {
    dialogTestHelper({
        noChangeHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        clickSelector: getDialogToolbarSelector(WYMeditor.EXEC_COMMANDS
           .CREATE_LINK),
        expectedOpenedOrNot: "not"
    });
});

test("Link dialog opens when selection is non-collapsed and " +
    "`selectedContainer` doesn't return false; by toolbar button click",
    function () {
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
        clickSelector: getDialogToolbarSelector(WYMeditor.EXEC_COMMANDS
           .CREATE_LINK),
        expectedOpenedOrNot: "opened"
    });
});

test("Link dialog doesn't open when selection is collapsed and " +
    "`selectedContainer` doesn't return false; by toolbar button click",
    function () {
    dialogTestHelper({
        noChangeHtml: "<p>Foo</p>",
        setCaretInSelector: "p",
        clickSelector: getDialogToolbarSelector(WYMeditor.EXEC_COMMANDS
           .CREATE_LINK),
        expectedOpenedOrNot: "not"
    });
});

test("Link dialog doesn't open when selection is non-collapsed and " +
    "`selectedContainer` returns false; by toolbar button click",
    function () {
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
        clickSelector: getDialogToolbarSelector(WYMeditor.EXEC_COMMANDS
           .CREATE_LINK),
        expectedOpenedOrNot: "not"
    });
});

test("Image dialog doesn't open when no selection; by toolbar " +
    "button click", function () {
    dialogTestHelper({
        noChangeHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        clickSelector: getDialogToolbarSelector(WYMeditor.EXEC_COMMANDS
            .INSERT_IMAGE),
        expectedOpenedOrNot: "not"
    });
});

test("Image dialog doesn't open when selection is non-collapsed; by toolbar " +
    "button", function () {
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
        clickSelector: getDialogToolbarSelector(WYMeditor.EXEC_COMMANDS
            .INSERT_IMAGE),
        expectedOpenedOrNot: "not"
    });
});

test("Image dialog opens when selection is collapsed; by toolbar button",
    function () {
    dialogTestHelper({
        noChangeHtml: "<p>Foo</p>",
        setCaretInSelector: "p",
        clickSelector: getDialogToolbarSelector(WYMeditor.EXEC_COMMANDS
            .INSERT_IMAGE),
        expectedOpenedOrNot: "opened"
    });
});

test("Table dialog doesn't open when no selection; by toolbar button click",
    function () {
    dialogTestHelper({
        noChangeHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        clickSelector: getDialogToolbarSelector(WYMeditor.EXEC_COMMANDS
            .INSERT_TABLE),
        expectedOpenedOrNot: "not"
    });
});

test("Table dialog doesn't open when selection is non-collapsed; by toolbar " +
    "button", function () {
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
        clickSelector: getDialogToolbarSelector(WYMeditor.EXEC_COMMANDS
            .INSERT_TABLE),
        expectedOpenedOrNot: "not"
    });
});

test("Table dialog opens when selection is collapsed and " +
    "`selectedContainer` doesn't return false; by toolbar button",
    function () {
    dialogTestHelper({
        noChangeHtml: "<p>Foo</p>",
        setCaretInSelector: "p",
        clickSelector: getDialogToolbarSelector(WYMeditor.EXEC_COMMANDS
            .INSERT_TABLE),
        expectedOpenedOrNot: "opened"
    });
});

test("Paste dialog doesn't open when no selection; by toolbar button click",
    function () {
    dialogTestHelper({
        noChangeHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        clickSelector: getDialogToolbarSelector(WYMeditor.EXEC_COMMANDS
           .PASTE),
        expectedOpenedOrNot: "not"
    });
});

test("Paste dialog doesn't open when selection is non-collapsed; by toolbar " +
    "button", function () {
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
        clickSelector: getDialogToolbarSelector(WYMeditor.EXEC_COMMANDS
            .PASTE),
        expectedOpenedOrNot: "not"
    });
});

test("Paste dialog opens when selection is collapsed; by toolbar button",
    function () {
    dialogTestHelper({
        noChangeHtml: "<p>Foo</p>",
        setCaretInSelector: "p",
        clickSelector: getDialogToolbarSelector(WYMeditor.EXEC_COMMANDS
            .PASTE),
        expectedOpenedOrNot: "opened"
    });
});

test("Preview dialog opens when no selection; by toolbar button", function () {
    dialogTestHelper({
        noChangeHtml: "<p>Foo</p>",
        clickSelector: getDialogToolbarSelector(WYMeditor.EXEC_COMMANDS
            .PREVIEW),
        expectedOpenedOrNot: "opened"
    });
});

test("Preview dialog opens when selection is collapsed; by toolbar button",
    function () {
    dialogTestHelper({
        noChangeHtml: "<p>Foo</p>",
        setCaretInSelector: "p",
        clickSelector: getDialogToolbarSelector(WYMeditor.EXEC_COMMANDS
            .PREVIEW),
        expectedOpenedOrNot: "opened"
    });
});

test("Link dialog opens when selection is non-collapsed; by toolbar button",
    function () {
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
        clickSelector: getDialogToolbarSelector(WYMeditor.EXEC_COMMANDS
           .PREVIEW),
        expectedOpenedOrNot: "opened"
    });
});
