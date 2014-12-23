/* exported
    manipulationTestHelper
*/
/* global
    expect,
    wymEqual,
    QUnit,
    simulateKeyCombo,
    skipKeyboardShortcutTests,
    SKIP_THIS_TEST
*/
"use strict";
/**
 * manipulationTestHelper
 * ======================
 *
 * Helper for testing editor manipulations. Don't leave home without it.
 *
 * @param a An object, containing:
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
 *         Optional; The manipulation function to be tested. Receives one
 *         argument, the WYMeditor instance.
 *     `manipulationKeyCombo`
 *         Optional; A key combination that is expected to trigger the
 *         manipulation. For example, "ctrl+b".
 *     `testUndoRedo`
 *         Optional; Whether to test undo/redo on this manipulation.
 *     `expectedResultHtml`
 *         The HTML that is expected to be the state of the document after the
 *         `manipulationFunc` ran.
 *     `additionalAssertionsFunc`
 *         Optional; Additional assertions for after the `manipulationFunc`.
 *     `parseHtml`
 *         Optional; Passed on to `wymEqual` as `options.parseHtml`. Defaults
 *         to `false`.
 *     `skipFunc`
 *         Optional; A function that will be called before anything else, whose
 *         return value, if it equals the constant `SKIP_THIS_TEST`, means
 *         this helper will immediately return and a warning will be printed
 *         at the console.
 *         For example:
 *         ```
 *         function(wymeditor) {
 *             if (
 *                 jQuery.browser.name === "msie" &&
 *                 jQuery.browser.versionNumber === 7
 *             ) {
 *                 return SKIP_THIS_TEST;
 *             }
 *         }
 *         ```
 *         This example uses the `jquery.browser` plugin
 *         https://github.com/gabceb/jquery-browser-plugin
 *
 *     `manipulationFunc` and `manipulationKeyCombo` are not exclusive of each
 *     other. The procedure will be performed once for each of them.
 */
function manipulationTestHelper(a) {
    if (typeof a.skipFunc === 'function') {
        if (a.skipFunc() === SKIP_THIS_TEST) {
            if (expect() === null) {
                // `expect()` returns null when it wasn't called before in the
                // current test. Tests fail when they make zero assertions
                // without calling `expect(0)`. This doesn't prevent `expect`
                // from being called again, later, in the case
                // `manipulationTestHelper` is not the last operation in the
                // test.
                expect(0);
            }
            WYMeditor.console.warn(
                "Assertions skipped in test \"" +
                QUnit.config.current.testName + "\" from module \"" +
                QUnit.config.currentModule + "\"."
            );
            return;
        }
    }
    var wymeditor = jQuery.wymeditors(0);
    function execute(functionOrKeyCombo) {
        if (typeof a.startHtml === 'string') {
            wymeditor.rawHtml(a.startHtml);
        }
        if (typeof a.setCaretInSelector === 'string') {
            wymeditor.setCaretIn(
                wymeditor.$body().find(a.setCaretInSelector)[0]
            );
        }
        if (typeof a.prepareFunc === 'function') {
            a.prepareFunc(wymeditor);
        }
        expect(expect() === null ? 1 : expect() + 1);
        wymEqual(
            wymeditor,
            a.expectedStartHtml || a.startHtml,
            {
                assertionString: "Start HTML",
                parseHtml: typeof a.parseHtml === 'undefined' ? false :
                    a.parseHtml
            }
        );

        if (a.testUndoRedo === true) {
            wymeditor.undoRedo.reset();
        }

        if (functionOrKeyCombo === "function") {
            a.manipulationFunc(wymeditor);
        } else if (functionOrKeyCombo === "keyCombo") {
            simulateKeyCombo(wymeditor, a.manipulationKeyCombo);
        } else {
            throw "Expected either a function or a key combo.";
        }

        if (typeof a.expectedResultHtml === 'string') {
            expect(expect() + 1);
            wymEqual(
                wymeditor,
                a.expectedResultHtml,
                {
                    assertionString: "Manipulation result HTML" +
                        (functionOrKeyCombo === "keyCombo" ?
                         "; using keyboard shortcut" : ""),
                    parseHtml: typeof a.parseHtml === 'undefined' ? false :
                        a.parseHtml
                }
            );
        }

        if (typeof a.additionalAssertionsFunc === 'function') {
            a.additionalAssertionsFunc(wymeditor);
        }

        if (a.testUndoRedo !== true) {
            return;
        }

        wymeditor.undoRedo.undo();
        expect(expect() + 1);
        wymEqual(
            wymeditor,
            a.expectedStartHtml || a.startHtml,
            {
                assertionString: "Back to start HTML after undo",
                parseHtml: typeof a.parseHtml === 'undefined' ? false :
                    a.parseHtml
            }
        );

        wymeditor.undoRedo.redo();
        if (typeof a.expectedResultHtml === 'string') {
            expect(expect() + 1);
            wymEqual(
                wymeditor,
                a.expectedResultHtml,
                {
                    assertionString: "Back to manipulation result HTML " +
                        "after redo",
                    parseHtml: typeof a.parseHtml === 'undefined' ? false :
                        a.parseHtml
                }
            );
        }

        if (typeof a.additionalAssertionsFunc === 'function') {
            a.additionalAssertionsFunc(wymeditor);
        }
    }

    if (typeof a.manipulationFunc === "function") {
        execute("function");
    }

    if (
        typeof a.manipulationKeyCombo === "string" &&
        skipKeyboardShortcutTests !== true
    ) {
        execute("keyCombo");
    }
}
