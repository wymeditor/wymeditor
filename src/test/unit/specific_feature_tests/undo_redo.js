/* jshint evil: true */
/* global
    wymEqual,
    prepareUnitTestModule,
    makeTextSelection,
    makeSelection,
    expect,
    equal,
    ok,
    testWym
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
 *     `skipParser`
 *         Optional; Passed on to `testWym`. Defaults to `true`.
 */
function testUndoRedo(a) {
    testWym({
        testName: a.testName,
        startHtml: a.startHtml,
        setCaretInSelector: a.setCaretInSelector,
        prepareFunc: a.prepareFunc,
        expectedStartHtml: a.expectedStartHtml,
        manipulationFunc: function (wymeditor) {
            wymeditor.undoRedo.reset();

            a.manipulationFunc(wymeditor);
            if (typeof a.expectedResultHtml === 'string') {
                expect(expect() + 1);
                wymEqual(
                    wymeditor,
                    a.expectedResultHtml,
                    {
                        assertionString: "Manipulation result HTML.",
                        skipParser: typeof a.skipParser === 'undefined' ?
                            true : a.skipParser
                    }
                );
            }
            if (typeof a.additionalAssertionsFunc === 'function') {
                a.additionalAssertionsFunc(wymeditor);
            }

            wymeditor.undoRedo.undo();
            expect(expect() + 1);
            wymEqual(
                wymeditor,
                a.expectedStartHtml || a.startHtml,
                {
                    assertionString: "After undo HTML.",
                    skipParser: typeof a.skipParser === 'undefined' ?
                        true : a.skipParser
                }
            );

            wymeditor.undoRedo.redo();

        },
        expectedResultHtml: a.expectedResultHtml,
        additionalAssertionsFunc: a.additionalAssertionsFunc,
        skipParser: a.skipParser
    });
}

module("undo_redo", {setup: prepareUnitTestModule});

testUndoRedo({
    testName: "Bold",
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
        wymeditor.exec("Bold");
    },
    expectedResultHtml: "<p><strong>Foo</strong></p>",
    skipParser: false
});

testUndoRedo({
    testName: "Italic",
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
        wymeditor.exec("Italic");
    },
    additionalAssertionsFunc: function (
        // `wymeditor` seems to be unused because of the ignore, below.
        /* jshint ignore:start */
        wymeditor
        /* jshint ignore:end */
    ) {
        expect(expect() + 1);
        ok(
            jQuery.inArray(
                // JSHint does not approve of this indentation.
                /* jshint ignore:start */
                wymeditor.rawHtml().toLowerCase(),
                [
                    "<p><i>foo</i></p>",
                    "<p><em>foo</em></p>"
                ]
                /* jshint ignore:end */
            ) > -1,
            "Either `i` or `em`."
        );
    }
});

testUndoRedo({
    testName: "Superscript",
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
        wymeditor.exec("Superscript");
    },
    expectedResultHtml: "<p><sup>Foo</sup></p>"
});

testUndoRedo({
    testName: "Subscript",
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
        wymeditor.exec("Subscript");
    },
    expectedResultHtml: "<p><sub>Foo</sub></p>"
});

testUndoRedo({
    testName: "Insert ordered list",
    startHtml: "<p>Foo</p>",
    setCaretInSelector: "p",
    manipulationFunc: function (wymeditor) {
        wymeditor.exec("InsertOrderedList");
    },
    expectedResultHtml: "<ol><li>Foo</li></ol>",
    skipParser: false
});

testUndoRedo({
    testName: "Insert unordered list",
    startHtml: "<p>Foo</p>",
    setCaretInSelector: "p",
    manipulationFunc: function (wymeditor) {
        wymeditor.exec("InsertUnorderedList");
    },
    expectedResultHtml: "<ul><li>Foo</li></ul>",
    skipParser: false
});

testUndoRedo({
    testName: "List; indent",
    startHtml: "<ol><li>Foo</li></ol>",
    setCaretInSelector: "li",
    manipulationFunc: function (wymeditor) {
        wymeditor.exec("Indent");
    },
    expectedResultHtml:
        "<ol><li class=\"spacer_li\"><ol><li>Foo</li></ol></li></ol>"
});

testUndoRedo({
    testName: "List; outdent",
    startHtml: "<ol><li class=\"spacer_li\"><ol><li>Foo</li></ol></li></ol>",
    setCaretInSelector: "li li",
    manipulationFunc: function (wymeditor) {
        wymeditor.exec("Outdent");
    },
    expectedResultHtml:
        "<ol><li>Foo</li></ol>"
});

testUndoRedo({
    testName: "Link",
    startHtml: "<p>Foobar</p>",
    prepareFunc: function (wymeditor) {
        var p = wymeditor.$body().children('p')[0];
        makeTextSelection(
            wymeditor,
            p,
            p,
            3,
            6
        );
    },
    manipulationFunc: function (wymeditor) {
        wymeditor.link({href: "http://example.com/"});
    },
    expectedResultHtml: "<p>Foo<a href=\"http://example.com/\">bar</a></p>"
});

testUndoRedo({
    testName: "Unlink",
    startHtml: "<p><a href=\"http://example.com/\">Foo</a></p>",
    prepareFunc: function (wymeditor) {
        var a = wymeditor.$body().find("a")[0];
        makeTextSelection(
            wymeditor,
            a,
            a,
            0,
            3
        );
    },
    manipulationFunc: function (wymeditor) {
        wymeditor.exec("Unlink");
    },
    expectedResultHtml: "<p>Foo</p>"
});

testUndoRedo({
    testName: "Image",
    startHtml: "<p>Foo</p>",
    setCaretInSelector: "p",
    manipulationFunc: function (wymeditor) {
        wymeditor.insertImage({src: "http://example.com/example.jpg"});
    },
    expectedResultHtml: "<p><img src=\"http://example.com/example.jpg\" " +
        "/>Foo</p>"
});

testUndoRedo({
    testName: "Insert table",
    startHtml: "",
    prepareFunc: function (wymeditor) {
        wymeditor.setCaretIn(wymeditor.body());
    },
    manipulationFunc: function (wymeditor) {
        wymeditor.insertTable(1, 1, "foo", "bar");
    },
    expectedResultHtml: "<table summary=\"bar\"><caption>foo</caption>" +
        "<tbody><tr><td></td></tr></tbody></table>",
    skipParser: false
});

testUndoRedo({
    testName: "`editor.paste`",
    startHtml: "<br />",
    prepareFunc: function (wymeditor) {
        wymeditor.setCaretIn(wymeditor.body());
    },
    manipulationFunc: function (wymeditor) {
        wymeditor.paste("Foo");
    },
    expectedResultHtml: "<br /><p>Foo</p>"
});

var DAWN_OF_HISTORY = "<h1>Dawn of History</h1>";

testUndoRedo({
    testName: "No going back before dawn of history",
    startHtml: DAWN_OF_HISTORY,
    manipulationFunc: function () {},
    additionalAssertionsFunc: function (wymeditor) {
        expect(expect() + 1);
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
            wymeditor.$body().children("p")[0],
            wymeditor.$body().children("p")[1],
            0,
            3
        );
    },
    manipulationFunc: function () {},
    additionalAssertionsFunc: function (wymeditor) {
        expect(expect() + 1);
        equal(
            wymeditor.selection().toString(),
            "FooBar"
        );
    },
    expectedResultHtml: "<p>Foo</p><p>Bar</p>"
});

testWym({
    testName: "Redo when everything has been redone",
    startHtml: "<p>Foo</p>",
    prepareFunc: function (wymeditor) {
        wymeditor.undoRedo.reset();
    },
    manipulationFunc: function (wymeditor) {
        expect(expect() + 3);
        wymeditor.$body().append("<p>Bar</p>");
        wymeditor.registerChange();
        wymEqual(
            wymeditor,
            "<p>Foo</p><p>Bar</p>",
            {
                assertionString: "Performed and registered a change.",
                skipParser: true
            }
        );

        wymeditor.undoRedo.undo();
        wymEqual(
            wymeditor,
            "<p>Foo</p>",
            {
                assertionString: "Undid change.",
                skipParser: true
            }
        );

        wymeditor.undoRedo.redo();
        wymEqual(
            wymeditor,
            "<p>Foo</p><p>Bar</p>",
            {
                assertionString: "Redid change.",
                skipParser: true
            }
        );

        wymeditor.undoRedo.redo();
    },
    // There are no more changes to redo.
    expectedResultHtml: "<p>Foo</p><p>Bar</p>"
});

testWym({
    testName: "Toolbar buttons",
    startHtml: "<p>Foo</p>",
    prepareFunc: function (wymeditor) {
        wymeditor.undoRedo.reset();
    },
    manipulationFunc: function (wymeditor) {
        expect(expect() + 3);
        var $buttons = wymeditor.get$Buttons(),
            $undoButton = $buttons.filter("[name=Undo]"),
            $redoButton = $buttons.filter("[name=Redo]");

        wymeditor.$body().append("<p>Bar</p>");
        wymeditor.registerChange();
        wymEqual(
            wymeditor,
            "<p>Foo</p><p>Bar</p>",
            {
                assertionString: "Made change and registered it.",
                skipParser: true
            }
        );

        $undoButton.click();
        wymEqual(
            wymeditor,
            "<p>Foo</p>",
            {
                assertionString: "Undo by button click.",
                skipParser: true
            }
        );

        $redoButton.click();
        wymEqual(
            wymeditor,
            "<p>Foo</p><p>Bar</p>",
            {
                assertionString: "Redo by button click.",
                skipParser: true
            }
        );
    }
});

testWym({
    testName: "Nothing to redo after change",
    startHtml: "<p>Foo</p>",
    prepareFunc: function (wymeditor) {
        wymeditor.undoRedo.reset();
    },
    manipulationFunc: function (wymeditor) {
        expect(expect() + 2);

        wymeditor.$body().append("<p>Bar</p>");
        wymeditor.registerChange();
        wymEqual(
            wymeditor,
            "<p>Foo</p><p>Bar</p>",
            {
                assertionString: "Made change and registered it.",
                skipParser: true
            }
        );

        wymeditor.undoRedo.undo();
        wymEqual(
            wymeditor,
            "<p>Foo</p>",
            {
                assertionString: "Undid.",
                skipParser: true
            }
        );

        wymeditor.$body().append("<p>Zad</p>");
        wymeditor.registerChange();
        wymeditor.undoRedo.redo();
    },
    // Nothing was redone.
    expectedResultHtml: "<p>Foo</p><p>Zad</p>"
});

testUndoRedo({
    testName: "Table; merge cells",
    startHtml: [""
        , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
        , "<table>"
            , "<tbody>"
                , "<tr><td>Foo</td><td>Bar</td></tr>"
            , "</tbody>"
        , "</table>"
        , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
    ].join(''),
    prepareFunc: function (wymeditor) {
        var $cells = wymeditor.$body().find('td');
        makeSelection(
            wymeditor,
            $cells[0],
            $cells[1]
        );
    },
    manipulationFunc: function (wymeditor) {
        wymeditor.tableEditor.mergeRow(wymeditor.selection());
    },
    expectedResultHtml: [""
        , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
        , "<table>"
            , "<tbody>"
                , "<tr><td colspan=\"2\">FooBar</td></tr>"
            , "</tbody>"
        , "</table>"
        , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
    ].join('')
});

testUndoRedo({
    testName: "Table; add row",
    startHtml: [""
        , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
        , "<table>"
            , "<tbody>"
                , "<tr><td>Foo</td></tr>"
            , "</tbody>"
        , "</table>"
        , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
    ].join(''),
    prepareFunc: function (wymeditor) {
        var cell = wymeditor.$body().find('td')[0];
        makeSelection(
            wymeditor,
            cell,
            cell
        );
    },
    manipulationFunc: function (wymeditor) {
        wymeditor.tableEditor.addRow(wymeditor.selectedContainer());
    },
    expectedResultHtml: [""
        , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
        , "<table>"
            , "<tbody>"
                , "<tr><td>Foo</td></tr>"
                , "<tr><td>\xA0</td></tr>"
            , "</tbody>"
        , "</table>"
        , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
    ].join('')
});

testUndoRedo({
    testName: "Table; remove row",
    startHtml: [""
        , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
        , "<table>"
            , "<tbody>"
                , "<tr><td>Foo</td></tr>"
                , "<tr><td>Bar</td></tr>"
            , "</tbody>"
        , "</table>"
        , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
    ].join(''),
    prepareFunc: function (wymeditor) {
        var cell = wymeditor.$body().find('td')[1];
        makeSelection(
            wymeditor,
            cell,
            cell
        );
    },
    manipulationFunc: function (wymeditor) {
        wymeditor.tableEditor.removeRow(wymeditor.selectedContainer());
    },
    expectedResultHtml: [""
        , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
        , "<table>"
            , "<tbody>"
                , "<tr><td>Foo</td></tr>"
            , "</tbody>"
        , "</table>"
        , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
    ].join('')
});

testUndoRedo({
    testName: "Table; add column",
    startHtml: [""
        , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
        , "<table>"
            , "<tbody>"
                , "<tr><td>Foo</td></tr>"
            , "</tbody>"
        , "</table>"
        , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
    ].join(''),
    prepareFunc: function (wymeditor) {
        var cell = wymeditor.$body().find('td')[0];
        makeSelection(
            wymeditor,
            cell,
            cell
        );
    },
    manipulationFunc: function (wymeditor) {
        wymeditor.tableEditor.addColumn(wymeditor.selectedContainer());
    },
    expectedResultHtml: [""
        , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
        , "<table>"
            , "<tbody>"
                , "<tr><td>Foo</td><td>\xA0</td></tr>"
            , "</tbody>"
        , "</table>"
        , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
    ].join('')
});

testUndoRedo({
    testName: "Table; remove column",
    startHtml: [""
        , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
        , "<table>"
            , "<tbody>"
                , "<tr><td>Foo</td><td>Bar</td></tr>"
            , "</tbody>"
        , "</table>"
        , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
    ].join(''),
    prepareFunc: function (wymeditor) {
        var cell = wymeditor.$body().find('td')[1];
        makeSelection(
            wymeditor,
            cell,
            cell
        );
    },
    manipulationFunc: function (wymeditor) {
        wymeditor.tableEditor.removeColumn(wymeditor.selectedContainer());
    },
    expectedResultHtml: [""
        , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
        , "<table>"
            , "<tbody>"
                , "<tr><td>Foo</td></tr>"
            , "</tbody>"
        , "</table>"
        , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
    ].join('')
});
