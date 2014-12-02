/* jshint evil: true */
/* global
    manipulationTestHelper,
    test,
    prepareUnitTestModule,
    makeTextSelection,
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
                msie7: "strong",
                msie8: "strong",
                msie9: "strong",
                msie10: "strong",
                msie11: "strong"
            },
            Italic: {
                common: "i",
                msie7: "em",
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
        expectedResultHtml: "<p><" + tagName + ">Foo</" + tagName + "></p>"
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
        expectedResultHtml: "<p>Foo</p>"
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
        expectedResultHtml: "<p><" + tagName + ">Fo</" + tagName + ">o</p>"
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

test("Unwrap italic partially", function () {
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
        skipFunc: skipFunc
    });
}

test("Most browsers wrap partially bold selection with bold", function () {
    wrapPartiallyWrappedSelection(
        WYMeditor.EXEC_COMMANDS.BOLD,
        function () {
            if (jQuery.browser.name === "msie") {
                return SKIP_THIS_TEST;
            }
        }
    );
});

test("Most browsers wrap partially italic selection with italic", function () {
    wrapPartiallyWrappedSelection(
        WYMeditor.EXEC_COMMANDS.ITALIC,
        function () {
            if (jQuery.browser.name === "msie") {
                return SKIP_THIS_TEST;
            }
        }
    );
});

test("Most browsers wrap partially superscript selection with " +
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

test("Most browsers wrap partially subscript selection with " +
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

function doesntWrapAcrossRootContainers(command) {
    var noChangeHtml = "<p>Foo</p><p>Bar</p>";
    manipulationTestHelper({
        startHtml: noChangeHtml,
        prepareFunf: function (wymeditor) {
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
        expectedResultHtml: noChangeHtml
    });
}

test("Doesn't bold across root containers", function () {
    doesntWrapAcrossRootContainers(WYMeditor.EXEC_COMMANDS.BOLD);
});

test("Doesn't italic across root containers", function () {
    doesntWrapAcrossRootContainers(WYMeditor.EXEC_COMMANDS.ITALIC);
});

test("Doesn't superscript across root containers", function () {
    doesntWrapAcrossRootContainers(WYMeditor.EXEC_COMMANDS.SUPERSCRIPT);
});

test("Doesn't suberscript across root containers", function () {
    doesntWrapAcrossRootContainers(WYMeditor.EXEC_COMMANDS.SUBSCRIPT);
});

function doesntUnwrapAcrossRootContainers(command) {
    var tagName = getBrowserTagname(command),
        noChangeHtml = "<p><" + tagName + ">Foo</" + tagName + "></p>" +
            "<p><" + tagName + ">Bar</" + tagName + "></p>";
    manipulationTestHelper({
        startHtml: noChangeHtml,
        prepareFunc: function (wymeditor) {
            var body = wymeditor.body(),
                firstWrapper = body.childNodes[0].childNodes[0],
                secondWrapper = body.childNodes[1].childNodes[0];
            makeTextSelection(
                wymeditor,
                firstWrapper,
                secondWrapper,
                0,
                3
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.exec(command);
        },
        expectedResultHtml: noChangeHtml
    });
}

test("Doesn't unwrap bold across root containers", function () {
    doesntUnwrapAcrossRootContainers(WYMeditor.EXEC_COMMANDS.BOLD);
});

test("Doesn't unwrap italic across root containers", function () {
    doesntUnwrapAcrossRootContainers(WYMeditor.EXEC_COMMANDS.ITALIC);
});

test("Doesn't unwrap superscript across root containers", function () {
    doesntUnwrapAcrossRootContainers(WYMeditor.EXEC_COMMANDS.SUPERSCRIPT);
});

test("Doesn't unwrap subscript across root containers", function () {
    doesntUnwrapAcrossRootContainers(WYMeditor.EXEC_COMMANDS.SUPERSCRIPT);
});
