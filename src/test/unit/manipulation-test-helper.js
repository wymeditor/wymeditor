/* exported
    manipulationTestHelper
*/
/* global
    wymEqual,
    QUnit,
    simulateKeyCombo,
    skipKeyboardShortcutTests,
    expectOneMore,
    expectedCount,
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
 *     `manipulationClickSelector`
 *         Optional; A jQuery selector that will be used to select exactly
 *         one element, that will be `jQuery.fn.click()`ed.
 *         It is expected that this results in the manipulation, same as
 *         `manipulationFunc`.
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
 *     `async`
 *         Optional; If this is `true` then after the manipulation is
 *         performed, assertions regarding the results are not synchronously
 *         executed. Instead, a function is returned. Calling this function
 *         resumes these assertions. This can only be used when a single
 *         manipulation cause is provided (for example, only
 *         `manipulationFunc`). For example:
 *         ```
 *         test("Test something asynchronous", function () {
 *             var wymeditor = jQuery.wymeditors(0),
 *                 somethingAsync,
 *                 resumeManipulationTestHelper;
 *
 *             somethingAsync = wymeditor.somethingAsync;
 *             wymeditor.somethingAsync = function () {
 *                 somethingAsync.call(wymeditor);
 *                 resumeManipulationTestHelper();
 *             };
 *
 *             resumeManipulationTestHelper = manipulationTestHelper({
 *                 startHtml: "</p>Foo</p>",
 *                 async: true,
 *                 manipulationClickSelector: ".asyncActionButton",
 *                 expectedResultHtml: "</p>Bar</p>"
 *             });
 *         });
 *         ```
 *
 *     `manipulationFunc`, `manipulationKeyCombo` and
 *     `manipulationClickSelector` are not exclusive of each other. The
 *     procedure will be performed once for each of them.
 */
/* jshint latedef: nofunc */
function manipulationTestHelper(a) {
    var executions = [],
        wymeditor,
        EXECUTE,
        asyncResumeFunc;

    if (skipThisTest() === true) {
        return;
    }

    wymeditor = jQuery.wymeditors(0);

    EXECUTE = {
        FUNCTION: "function",
        UI_CLICK: "UI click",
        KEY_COMBO: "keyboard shortcut",
        NO_MANIPULATION: "no manipulation"
    };

    if (typeof a.manipulationFunc === "function") {
        executions.push(EXECUTE.FUNCTION);
    }

    if (
        typeof a.manipulationClickSelector === "string"
    ) {
        executions.push(EXECUTE.UI_CLICK);
    }

    if (typeof a.manipulationKeyCombo === "string") {
        executions.push(EXECUTE.KEY_COMBO);
    }

    if (executions.length === 0) {
        manipulateAndAssert(EXECUTE.NO_MANIPULATION);
    }

    if (
        a.async === true &&
        executions.length > 1
    ) {
        throw "The `async` option is only allowed with one manipulation cause";
    }

    while (executions.length > 0) {
        asyncResumeFunc = manipulateAndAssert(executions.pop());
    }

    if (a.async === true) {
        return asyncResumeFunc;
    }

    function manipulateAndAssert(manipulationCause) {

        if (
            skipKeyboardShortcutTests &&
            manipulationCause === EXECUTE.KEY_COMBO
        ) {
            if (!expectedCount()) {
                QUnit.expect(0);
            }
            return false;
        }

        initialize();
        assertStartHtml();
        resetHistory();

        performManipulation(manipulationCause);
        // Expectancy incremented here in order to fail tests that specify
        // `async` but do not call the `asyncResumeFunc`.
        expectOneMore();
        if (a.async === true) {
            return assertResultUndoAndAdditional;
        } else {
            assertResultUndoAndAdditional();
        }

        function assertResultUndoAndAdditional() {
            // Return expectancy to real value.
            QUnit.expect(expectedCount() - 1);
            assertResultHtml();
            additionalAssertions();

            if (a.testUndoRedo !== true) {
                return;
            }
            wymeditor.undoRedo.undo();
            assertStartHtml("Back to start HTML after undo");

            wymeditor.undoRedo.redo();
            assertResultHtml("Back to result HTML after redo");
            additionalAssertions();
        }

        function initialize() {
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
        }

        function assertStartHtml(assertionString) {
            expectOneMore();
            wymEqual(
                wymeditor,
                a.expectedStartHtml || a.startHtml,
                {
                    assertionString: assertionString ? assertionString :
                        "Start HTML",
                    parseHtml: typeof a.parseHtml === 'undefined' ? false :
                        a.parseHtml
                }
            );
        }

        function resetHistory() {
            if (a.testUndoRedo === true) {
                wymeditor.undoRedo.reset();
            }
        }

        function performManipulation(manipulationCause) {
            var $clickElement;

            switch (manipulationCause) {
                case EXECUTE.FUNCTION:
                    a.manipulationFunc(wymeditor);
                    break;
                case EXECUTE.UI_CLICK:
                    $clickElement = jQuery(a.manipulationClickSelector);
                    if ($clickElement.length !== 1) {
                        throw "Expected one element";
                    }
                    $clickElement.click();
                    break;
                case EXECUTE.KEY_COMBO:
                    simulateKeyCombo(wymeditor, a.manipulationKeyCombo);
                    break;
                case EXECUTE.NO_MANIPULATION:
                    return;
                default:
                    throw "Expected a means of manipulation";
            }
        }

        function assertResultHtml(assertionString) {
            if (typeof a.expectedResultHtml === 'string') {
                expectOneMore();
                wymEqual(
                    wymeditor,
                    a.expectedResultHtml,
                    {
                        assertionString: (assertionString ? assertionString :
                            "Result HTML") + " via " + manipulationCause,
                        parseHtml: typeof a.parseHtml === 'undefined' ? false :
                            a.parseHtml
                    }
                );
            }
        }

        function additionalAssertions() {
            if (typeof a.additionalAssertionsFunc === 'function') {
                a.additionalAssertionsFunc(wymeditor);
            }
        }
    }

    function skipThisTest() {
        if (typeof a.skipFunc === 'function') {
            if (a.skipFunc() === SKIP_THIS_TEST) {
                if (expectedCount() === null) {
                    // Tests fail when they make zero
                    // assertions without calling `expect(0)`. This doesn't
                    // prevent `expect` from being called again, later, in the
                    // case `manipulationTestHelper` is not the last operation
                    // in th test.
                    QUnit.expect(0);
                }
                WYMeditor.console.warn(
                    "Assertions skipped in test \"" +
                    QUnit.config.current.testName + "\" from module \"" +
                    QUnit.config.currentModule + "\"."
                );
                return true;
            }
        }
    }
}
/* jshint latedef: true */
