/* jshint evil: true, maxlen: 100 */
/* global
    manipulationTestHelper,
    test,
    prepareUnitTestModule,
    makeTextSelection,
    OS_MOD_KEY,
    SKIP_THIS_TEST
*/
"use strict";
module("exec-toggles", {setup: prepareUnitTestModule});

// Different browsers create wrappers with different tagNames for the same
// execCommand commands.
function getBrowserTagname(command) {
    var TAGNAMES = {
            Bold: {
                common: "b",
                msie8: "strong",
                msie9: "strong",
                msie10: "strong",
                msie11: "strong"
            },
            Italic: {
                common: "i",
                msie8: "em",
                msie9: "em",
                msie10: "em",
                msie11: "em"
            },
            Superscript: {
                common: "sup"
            },
            Subscript: {
                common: "sub"
            }
        },
        browserName = jQuery.browser.name,
        browserVersion = jQuery.browser.versionNumber,
        tagName = TAGNAMES[command][browserName + browserVersion];

    if (typeof tagName !== "string") {
        return TAGNAMES[command].common;
    }
    return tagName;
}

// Provided an EXEC_COMMAND, returns the keyboard shortcut combo for that
// command.
function getExecKeyboardShortcut(command) {
    var EXEC_KEYBOARD_SHORTCUTS = {};

    EXEC_KEYBOARD_SHORTCUTS[WYMeditor.EXEC_COMMANDS.BOLD] = OS_MOD_KEY +
        "+b";
    EXEC_KEYBOARD_SHORTCUTS[WYMeditor.EXEC_COMMANDS.ITALIC] = OS_MOD_KEY +
        "+i";

    if (EXEC_KEYBOARD_SHORTCUTS.hasOwnProperty(command) === true) {
        return EXEC_KEYBOARD_SHORTCUTS[command];
    }
}

function wrapNonWrappedSelection(command) {
    var tagName = getBrowserTagname(command);
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            var p = wymeditor.$body().children("p")[0];
            makeTextSelection(
                wymeditor,
                p,
                p,
                0,
                3
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.exec(command);
        },
        expectedResultHtml: "<p><" + tagName + ">Foo</" + tagName + "></p>",
        manipulationKeyCombo: getExecKeyboardShortcut(command),
        testUndoRedo: true
    });
}

test("Wrap non-bold selection with bold", function () {
    wrapNonWrappedSelection(WYMeditor.EXEC_COMMANDS.BOLD);
});

test("Wrap non-italic selection with italic", function () {
    wrapNonWrappedSelection(WYMeditor.EXEC_COMMANDS.ITALIC);
});

test("Wrap non-superscript selection with superscript", function () {
    wrapNonWrappedSelection(WYMeditor.EXEC_COMMANDS.SUPERSCRIPT);
});

test("Wrap non-subscript selection with subscript", function () {
    wrapNonWrappedSelection(WYMeditor.EXEC_COMMANDS.SUBSCRIPT);
});

function unwrapWrappedSelection(command) {
    var tagName = getBrowserTagname(command);
    manipulationTestHelper({
        startHtml: "<p><" + tagName + ">Foo</" + tagName + "></p>",
        prepareFunc: function (wymeditor) {
            var wrapper = wymeditor.body().childNodes[0].childNodes[0];
            makeTextSelection(
                wymeditor,
                wrapper,
                wrapper,
                0,
                3
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.exec(command);
        },
        expectedResultHtml: "<p>Foo</p>",
        manipulationKeyCombo: getExecKeyboardShortcut(command),
        testUndoRedo: true
    });
}

test("Unwrap bold entirely", function () {
    unwrapWrappedSelection(WYMeditor.EXEC_COMMANDS.BOLD);
});

test("Unwrap italic entirely", function () {
    unwrapWrappedSelection(WYMeditor.EXEC_COMMANDS.ITALIC);
});

test("Unwrap superscript entirely", function () {
    unwrapWrappedSelection(WYMeditor.EXEC_COMMANDS.SUPERSCRIPT);
});

test("Unwrap subscript entirely", function () {
    unwrapWrappedSelection(WYMeditor.EXEC_COMMANDS.SUBSCRIPT);
});

function unwrapWrappedSelectionPartially(command) {
    var tagName = getBrowserTagname(command);
    manipulationTestHelper({
        startHtml: "<p><" + tagName + ">Foo</" + tagName + "></p>",
        prepareFunc: function (wymeditor) {
            var wrapper = wymeditor.body().childNodes[0].childNodes[0];
            makeTextSelection(
                wymeditor,
                wrapper,
                wrapper,
                2,
                3
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.exec(command);
        },
        expectedResultHtml: "<p><" + tagName + ">Fo</" + tagName + ">o</p>",
        manipulationKeyCombo: getExecKeyboardShortcut(command),
        testUndoRedo: true
    });
}

test("Unwrap bold partially", function () {
    unwrapWrappedSelectionPartially(WYMeditor.EXEC_COMMANDS.BOLD);
});

test("Unwrap italic partially", function () {
    unwrapWrappedSelectionPartially(WYMeditor.EXEC_COMMANDS.ITALIC);
});

test("Unwrap superscript partially", function () {
    unwrapWrappedSelectionPartially(WYMeditor.EXEC_COMMANDS.SUPERSCRIPT);
});

test("Unwrap subscript partially", function () {
    unwrapWrappedSelectionPartially(WYMeditor.EXEC_COMMANDS.SUBSCRIPT);
});

function wrapPartiallyWrappedSelection(command, skipFunc) {
    var tagName = getBrowserTagname(command);
    manipulationTestHelper({
        startHtml: "<p><" + tagName + ">Fo</" + tagName + ">o</p>",
        prepareFunc: function (wymeditor) {
            var p = wymeditor.body().childNodes[0],
                wrapper = p.childNodes[0];
            makeTextSelection(
                wymeditor,
                wrapper,
                p,
                0,
                2
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.exec(command);
        },
        expectedResultHtml: "<p><" + tagName + ">Foo</" + tagName + "></p>",
        manipulationKeyCombo: getExecKeyboardShortcut(command),
        testUndoRedo: true,
        skipFunc: skipFunc
    });
}

test("Non-IE browsers wrap partially bold selection with bold", function () {
    wrapPartiallyWrappedSelection(
        WYMeditor.EXEC_COMMANDS.BOLD,
        function () {
            if (jQuery.browser.name === "msie") {
                return SKIP_THIS_TEST;
            }
        }
    );
});

test("Non-IE browsers wrap partially italic selection with " +
     "italic", function () {
    wrapPartiallyWrappedSelection(
        WYMeditor.EXEC_COMMANDS.ITALIC,
        function () {
            if (jQuery.browser.name === "msie") {
                return SKIP_THIS_TEST;
            }
        }
    );
});

test("Non-IE browsers wrap partially superscript selection with " +
     "superscript", function () {
    wrapPartiallyWrappedSelection(
        WYMeditor.EXEC_COMMANDS.SUPERSCRIPT,
        function () {
            if (jQuery.browser.name === "msie") {
                return SKIP_THIS_TEST;
            }
        }
    );
});

test("Non-IE browsers wrap partially subscript selection with " +
     "subscript", function () {
    wrapPartiallyWrappedSelection(
        WYMeditor.EXEC_COMMANDS.SUBSCRIPT,
        function () {
            if (jQuery.browser.name === "msie") {
                return SKIP_THIS_TEST;
            }
        }
    );
});

function unwrapPartiallyWrappedSelection(command, skipFunc) {
    var tagName = getBrowserTagname(command);
    manipulationTestHelper({
        startHtml: "<p><" + tagName + ">Fo</" + tagName + ">o</p>",
        prepareFunc: function (wymeditor) {
            var p = wymeditor.body().childNodes[0],
                wrapper = p.childNodes[0];
            makeTextSelection(
                wymeditor,
                wrapper,
                p,
                0,
                2
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.exec(command);
        },
        expectedResultHtml: "<p>Foo</p>",
        manipulationKeyCombo: getExecKeyboardShortcut(command),
        testUndoRedo: true,
        skipFunc: skipFunc
    });
}

test("IE unwraps partially bold selection", function () {
    unwrapPartiallyWrappedSelection(
        WYMeditor.EXEC_COMMANDS.BOLD,
        function () {
            if (jQuery.browser.name !== "msie") {
                return SKIP_THIS_TEST;
            }
        }
    );
});

test("IE unwraps partially italic selection", function () {
    unwrapPartiallyWrappedSelection(
        WYMeditor.EXEC_COMMANDS.ITALIC,
        function () {
            if (jQuery.browser.name !== "msie") {
                return SKIP_THIS_TEST;
            }
        }
    );
});

test("IE unwraps partially superscript selection", function () {
    unwrapPartiallyWrappedSelection(
        WYMeditor.EXEC_COMMANDS.SUPERSCRIPT,
        function () {
            if (jQuery.browser.name !== "msie") {
                return SKIP_THIS_TEST;
            }
        }
    );
});

test("IE unwraps partially subscript selection", function () {
    unwrapPartiallyWrappedSelection(
        WYMeditor.EXEC_COMMANDS.SUBSCRIPT,
        function () {
            if (jQuery.browser.name !== "msie") {
                return SKIP_THIS_TEST;
            }
        }
    );
});

function wrapsAcrossRootContainers(command) {
    var tagName = getBrowserTagname(command);
    manipulationTestHelper({
        startHtml: "<p>Foo</p><p>Bar</p>",
        prepareFunc: function (wymeditor) {
            var body = wymeditor.body(),
                firstP = body.childNodes[0],
                secondP = body.childNodes[1];

            makeTextSelection(
                wymeditor,
                firstP,
                secondP,
                1,
                2
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.exec(command);
        },
        expectedResultHtml: [
            "<p>F<" + tagName + ">oo</" + tagName + "></p>",
            "<p><" + tagName + ">Ba</" + tagName + ">r</p>"
        ].join(''),
        manipulationKeyCombo: getExecKeyboardShortcut(command),
        testUndoRedo: true
    });
}

test("Bolds across root containers", function () {
    wrapsAcrossRootContainers(WYMeditor.EXEC_COMMANDS.BOLD);
});

test("Italics across root containers", function () {
    wrapsAcrossRootContainers(WYMeditor.EXEC_COMMANDS.ITALIC);
});

test("Superscripts across root containers", function () {
    wrapsAcrossRootContainers(WYMeditor.EXEC_COMMANDS.SUPERSCRIPT);
});

test("Suberscripts across root containers", function () {
    wrapsAcrossRootContainers(WYMeditor.EXEC_COMMANDS.SUBSCRIPT);
});

function unwrapsAcrossRootContainers(command) {
    var tagName = getBrowserTagname(command);
    manipulationTestHelper({
        startHtml: [
            "<p>F<" + tagName + ">oo</" + tagName + "></p>",
            "<p><" + tagName + ">Ba</" + tagName + ">r</p>"
        ].join(''),
        prepareFunc: function (wymeditor) {
            var body = wymeditor.body(),
                firstWrapper = body.childNodes[0].childNodes[1],
                secondWrapper = body.childNodes[1].childNodes[0];
            makeTextSelection(
                wymeditor,
                firstWrapper,
                secondWrapper,
                0,
                2
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.exec(command);
        },
        expectedResultHtml: "<p>Foo</p><p>Bar</p>",
        manipulationKeyCombo: getExecKeyboardShortcut(command),
        testUndoRedo: true
    });
}

test("Unwraps bold across root containers", function () {
    unwrapsAcrossRootContainers(WYMeditor.EXEC_COMMANDS.BOLD);
});

test("Unwraps italic across root containers", function () {
    unwrapsAcrossRootContainers(WYMeditor.EXEC_COMMANDS.ITALIC);
});

test("Unwraps superscript across root containers", function () {
    unwrapsAcrossRootContainers(WYMeditor.EXEC_COMMANDS.SUPERSCRIPT);
});

test("Unwraps subscript across root containers", function () {
    unwrapsAcrossRootContainers(WYMeditor.EXEC_COMMANDS.SUPERSCRIPT);
});

// this and the next function are for testing that wrapping occurs
// when selection is from an element to some other element
// that is in a different place in the hierarchy of the document,
// not necessarily "from inside a li to a child of a sibling li".
function wrapsFromInsideLiToChildOfSiblingLi(command) {
    var tagName = getBrowserTagname(command),
        openTag = "<" + tagName + ">",
        closeTag = "</" + tagName + ">";
    manipulationTestHelper({
        startHtml: [""
            , "<ul>"
                , "<li>Foo</li>"
                , "<li>Another sibling</li>"
                , "<li>This:<br /><span id=\"span\">bar</span></li>"
            , "</ul>"
        ].join(''),
        prepareFunc: function (wymeditor) {
            var $body = wymeditor.$body(),
                firstLi = $body.find('li').first()[0],
                span = $body.find('span')[0];
            makeTextSelection(
                wymeditor,
                firstLi,
                span,
                1,
                2
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.exec(command);
        },
        expectedResultHtml: [""
            , "<ul>"
                , "<li>F" + openTag + "oo" + closeTag + "</li>"
                , "<li>" + openTag + "Another sibling" + closeTag + "</li>"
                , "<li>" + openTag + "This:<br />" +
                    closeTag + "<span id=\"span\">" + openTag + "ba" + closeTag + "r</span></li>"
            , "</ul>"
        ].join(''),
        manipulationKeyCombo: getExecKeyboardShortcut(command),
        testUndoRedo: true
    });
}

function unwrapsFromInsideLiToChildOfSiblingLi(command) {
    var tagName = getBrowserTagname(command),
        openTag = "<" + tagName + ">",
        closeTag = "</" + tagName + ">";
    manipulationTestHelper({
        startHtml: [""
            , "<ul>"
                , "<li>F" + openTag + "oo" + closeTag + "</li>"
                , "<li>" + openTag + "Another sibling" + closeTag + "</li>"
                , "<li>" + openTag + "This:<br />" +
                    closeTag + "<span>" + openTag + "ba" + closeTag + "r</span></li>"
            , "</ul>"
        ].join(''),
        prepareFunc: function (wymeditor) {
            var $body = wymeditor.$body(),
                firstWrapper = $body.find(tagName).first()[0],
                lastWrapper = $body.find(tagName).last()[0];
            makeTextSelection(
                wymeditor,
                firstWrapper,
                lastWrapper,
                0,
                2
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.exec(command);
        },
        expectedResultHtml: [""
            , "<ul>"
                , "<li>Foo</li>"
                , "<li>Another sibling</li>"
                , "<li>This:<br /><span>bar</span></li>"
            , "</ul>"
        ].join(''),
        manipulationKeyCombo: getExecKeyboardShortcut(command),
        testUndoRedo: true
    });
}

test("Bolds from inside `li` to child of sibling `li`", function () {
    wrapsFromInsideLiToChildOfSiblingLi(WYMeditor.EXEC_COMMANDS.BOLD);
});

test("Italics from inside `li` to child of sibling `li`", function () {
    wrapsFromInsideLiToChildOfSiblingLi(WYMeditor.EXEC_COMMANDS.ITALIC);
});

test("Superscripts from inside `li` to child of sibling `li`", function () {
    wrapsFromInsideLiToChildOfSiblingLi(WYMeditor.EXEC_COMMANDS.SUPERSCRIPT);
});

test("Subscripts from inside `li` to child of sibling `li`", function () {
    wrapsFromInsideLiToChildOfSiblingLi(WYMeditor.EXEC_COMMANDS.SUBSCRIPT);
});

test("Unwraps bold from inside `li` to child of sibling `li`", function () {
    unwrapsFromInsideLiToChildOfSiblingLi(WYMeditor.EXEC_COMMANDS.BOLD);
});

test("Unwraps italic from inside `li` to child of sibling `li`", function () {
    unwrapsFromInsideLiToChildOfSiblingLi(WYMeditor.EXEC_COMMANDS.ITALIC);
});

test("Unwraps superscript from inside `li` to child of sibling `li`", function () {
    unwrapsFromInsideLiToChildOfSiblingLi(WYMeditor.EXEC_COMMANDS.SUPERSCRIPT);
});

test("Unwraps subscript from inside `li` to child of sibling `li`", function () {
    unwrapsFromInsideLiToChildOfSiblingLi(WYMeditor.EXEC_COMMANDS.SUBSCRIPT);
});
