/* jshint evil: true */
/* global
    test,
    wymEqual,
    prepareUnitTestModule,
    makeTextSelection,
    expect,
    equal
*/
"use strict";

module("undo_redo", {setup: prepareUnitTestModule});

test("Can undo and redo all the things", function () {
    // This tests:
    //
    // #. Insertion of ordered list.
    // #. Insertion of unordered list.
    // #. Indenting.
    // #. Outdenting.
    // #. Native `execCommand` commands.
    // #. That selection is restored.
    //
    // This does not test dialog window actions:
    //
    // #. Link
    // #. Image
    // #. Table
    // #. Paste
    expect(17);
    var wymeditor = jQuery.wymeditors(0),
        $body = wymeditor.$body(),
        $buttons = wymeditor.get$Buttons(),
        $undoButton = $buttons.filter('[name=Undo]'),
        $redoButton = $buttons.filter('[name=Redo]'),
        undo = function () {wymeditor.undoRedo.undo(); },
        redo = function () {wymeditor.undoRedo.redo(); },
        selection;

    wymeditor.html("<p>Foo</p>");
    wymeditor.undoRedo._add();
    wymeditor.setCaretIn($body.children('p')[0]);
    wymeditor.exec('InsertOrderedList');
    wymEqual(
        wymeditor,
        "<ol><li>Foo</li></ol>"
    );
    wymeditor.exec('InsertUnorderedList');
    wymEqual(
        wymeditor,
        "<ul><li>Foo</li></ul>"
    );
    // Use the button once.
    $undoButton.click();
    wymEqual(
        wymeditor,
        "<ol><li>Foo</li></ol>"
    );
    // Use the function from now on for performance.
    undo();
    wymEqual(
        wymeditor,
        "<p>Foo</p>"
    );
    undo();
    wymEqual(
        wymeditor,
        ""
    );
    $redoButton.click();
    wymEqual(
        wymeditor,
        "<p>Foo</p>"
    );
    redo();
    wymEqual(
        wymeditor,
        "<ol><li>Foo</li></ol>"
    );
    redo();
    wymEqual(
        wymeditor,
        "<ul><li>Foo</li></ul>"
    );
    makeTextSelection(
        wymeditor,
        $body.find("li")[0],
        $body.find("li")[0],
        0,
        3
    );
    wymeditor.exec('Indent');
    wymEqual(
        wymeditor,
        "<ul><li class=\"spacer_li\"><ul><li>Foo</li></ul></li></ul>"
    );
    $body.children('ul').after('<p>Bar</p>');
    wymeditor.setCaretIn($body.children('p')[0]);
    wymeditor.undoRedo._add();
    undo();
    wymEqual(
        wymeditor,
        "<ul><li class=\"spacer_li\"><ul><li>Foo</li></ul></li></ul>"
    );
    selection = wymeditor.selection();
    equal(
        selection.anchorNode,
        $body.find('li li')[0]
    );
    equal(
        selection.focusNode,
        $body.find('li li')[0]
    );
    equal(
        wymeditor.selection().anchorOffset,
        0
    );
    equal(
        wymeditor.selection().focusOffset,
        1
    );
    wymeditor.exec('OutDent');
    undo();
    wymEqual(
        wymeditor,
        "<ul><li class=\"spacer_li\"><ul><li>Foo</li></ul></li></ul>"
    );
    // This is passed through to native `execCommand` so it should cover
    // `Subscript`, `Superscript` and `Unlink`, as well.
    wymeditor.exec("Italic");
    wymEqual(
        wymeditor,
        "<ul><li class=\"spacer_li\"><ul><li><em>Foo</em></li></ul></li></ul>"
    );
    undo();
    wymEqual(
        wymeditor,
        "<ul><li class=\"spacer_li\"><ul><li>Foo</li></ul></li></ul>"
    );
});
