/* jshint evil: true */
/* global
    wymEqual,
    prepareUnitTestModule,
    makeTextSelection,
    makeSelection,
    expect,
    equal,
    testWymManipulation
*/
"use strict";

module("undo_redo", {setup: prepareUnitTestModule});

testWymManipulation({
    testName: "Insert ordered list",
    testUndoRedo: true,
    startHtml: "<p>Foo</p>",
    setCaretInSelector: "p",
    manipulationFunc: function (wymeditor) {
        wymeditor.exec("InsertOrderedList");
    },
    expectedResultHtml: "<ol><li>Foo</li></ol>"
});

testWymManipulation({
    testName: "Insert unordered list",
    testUndoRedo: true,
    startHtml: "<p>Foo</p>",
    setCaretInSelector: "p",
    manipulationFunc: function (wymeditor) {
        wymeditor.exec("InsertUnorderedList");
    },
    expectedResultHtml: "<ul><li>Foo</li></ul>"
});

testWymManipulation({
    testName: "List; indent",
    testUndoRedo: true,
    startHtml: "<ol><li>Foo</li></ol>",
    setCaretInSelector: "li",
    manipulationFunc: function (wymeditor) {
        wymeditor.exec("Indent");
    },
    expectedResultHtml:
        "<ol><li class=\"spacer_li\"><ol><li>Foo</li></ol></li></ol>"
});

testWymManipulation({
    testName: "List; outdent",
    testUndoRedo: true,
    startHtml: "<ol><li class=\"spacer_li\"><ol><li>Foo</li></ol></li></ol>",
    setCaretInSelector: "li li",
    manipulationFunc: function (wymeditor) {
        wymeditor.exec("Outdent");
    },
    expectedResultHtml:
        "<ol><li>Foo</li></ol>"
});

testWymManipulation({
    testName: "Unlink",
    testUndoRedo: true,
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

testWymManipulation({
    testName: "Insert table",
    testUndoRedo: true,
    startHtml: "<br />",
    prepareFunc: function (wymeditor) {
        wymeditor.setCaretIn(wymeditor.body());
    },
    manipulationFunc: function (wymeditor) {
        wymeditor.insertTable(1, 1, "foo", "bar");
    },
    expectedResultHtml: [""
        , "<br />"
        , "<table summary=\"bar\">"
            , "<caption>foo</caption>"
            , "<tbody>"
                , "<tr>"
                    , "<td></td>"
                , "</tr>"
            , "</tbody>"
        , "</table>"
        , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
    ].join("")
});

testWymManipulation({
    testName: "`editor.paste`",
    testUndoRedo: true,
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

testWymManipulation({
    testName: "No going back before dawn of history",
    testUndoRedo: true,
    startHtml: DAWN_OF_HISTORY,
    manipulationFunc: function () {},
    additionalAssertionsFunc: function (wymeditor) {
        expect(expect() + 1);
        wymEqual(wymeditor, DAWN_OF_HISTORY);
    },
    expectedResultHtml: DAWN_OF_HISTORY
});

testWymManipulation({
    testName: "Restores selection",
    testUndoRedo: true,
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

testWymManipulation({
    testName: "Redo when everything has been redone",
    testUndoRedo: true,
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
                assertionString: "Performed and registered a change."
            }
        );

        wymeditor.undoRedo.undo();
        wymEqual(
            wymeditor,
            "<p>Foo</p>",
            {
                assertionString: "Undid change."
            }
        );

        wymeditor.undoRedo.redo();
        wymEqual(
            wymeditor,
            "<p>Foo</p><p>Bar</p>",
            {
                assertionString: "Redid change."
            }
        );

        wymeditor.undoRedo.redo();
    },
    // There are no more changes to redo.
    expectedResultHtml: "<p>Foo</p><p>Bar</p>"
});

testWymManipulation({
    testName: "Toolbar buttons",
    testUndoRedo: true,
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
                assertionString: "Made change and registered it."
            }
        );

        $undoButton.click();
        wymEqual(
            wymeditor,
            "<p>Foo</p>",
            {
                assertionString: "Undo by button click."
            }
        );

        $redoButton.click();
        wymEqual(
            wymeditor,
            "<p>Foo</p><p>Bar</p>",
            {
                assertionString: "Redo by button click."
            }
        );
    }
});

testWymManipulation({
    testName: "Nothing to redo after change",
    testUndoRedo: true,
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
                assertionString: "Made change and registered it."
            }
        );

        wymeditor.undoRedo.undo();
        wymEqual(
            wymeditor,
            "<p>Foo</p>",
            {
                assertionString: "Undid."
            }
        );

        wymeditor.$body().append("<p>Zad</p>");
        wymeditor.registerChange();
        wymeditor.undoRedo.redo();
    },
    // Nothing was redone.
    expectedResultHtml: "<p>Foo</p><p>Zad</p>"
});

testWymManipulation({
    testName: "Table; merge cells",
    testUndoRedo: true,
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

testWymManipulation({
    testName: "Table; add row",
    testUndoRedo: true,
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

testWymManipulation({
    testName: "Table; remove row",
    testUndoRedo: true,
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

testWymManipulation({
    testName: "Table; add column",
    testUndoRedo: true,
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

testWymManipulation({
    testName: "Table; remove column",
    testUndoRedo: true,
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
