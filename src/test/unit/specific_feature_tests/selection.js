/* global
    testWymManipulation,
    test,
    module,
    expect,
    deepEqual,
    strictEqual,
    ok,
    prepareUnitTestModule,
    rangy
*/
"use strict";
module("selection", {setup: prepareUnitTestModule});

testWymManipulation({
    testName: "There is no selection (`editor.deselect()`).",
    startHtml: "<p>foo</p>",
    prepareFunc: function (wymeditor) {
        wymeditor.setCaretIn(wymeditor.body().childNodes[0]);
        wymeditor.deselect();
    },
    additionalAssertionsFunc: function (wymeditor) {
        expect(expect() + 1);
        ok(wymeditor.hasSelection() === false);
    }
});

testWymManipulation({
    testName: "There is a selection.",
    startHtml: "<p>foo</p>",
    prepareFunc: function (wymeditor) {
        wymeditor.setCaretIn(wymeditor.body().childNodes[0]);
    },
    additionalAssertionsFunc: function (wymeditor) {
        expect(expect() + 1);
        ok(wymeditor.hasSelection() === true);
    }
});

var selTest = {};

// HTML for the following test.
selTest.setCollapsedHtml = [""
    , '<p id="0">'
        , '0.0'
        , '<br id="0.1" />'
        , '0.2'
        , '<br id="0.3" />'
        , '<span id="0.4">'
        , '</span>'
    , '</p>'
    , '<p id="1">'
        , '1.0'
        , '<span id="1.1">'
            , '1.1.0'
            , '<br id="1.1.1" />'
            , '1.1.2'
        , '</span>'
        , '1.2'
    , '</p>'
    , '<ul id="2">'
        , '<li id="2.0">'
            , '2.0.0'
            , '<br id="2.0.1" />'
            , '2.0.3'
        , '</li>'
        , '<li id="2.1">'
            , '<br id="2.1.0" />'
            , '2.1.1'
        , '</li>'
        , '<li id="2.2">'
            , '<br id="2.2.0" />'
            , '<ul id="2.2.1">'
                , '<li id="2.2.1.0">'
                , '</li>'
            , '</ul>'
            , '<br id="2.2.2" />'
        , '</li>'
    , '</ul>'
    , '<p id="3">'
    , '</p>'
    , '<blockquote id="4">'
        , '<p id="4.0">'
            , '4.0.1'
        , '</p>'
    , '</blockquote>'
    , '<table id="5">'
        , '<caption id="5.0">'
            , '5.0.0'
        , '</caption>'
        , '<colgroup id="5.1">'
            , '<col id="5.1.0">'
            , '<col id="5.1.1">'
        , '</colgroup>'
        , '<thead id="5.2">'
            , '<tr id="5.2.0">'
                , '<th id="5.2.0.0">'
                    , '5.2.0.0.0'
                , '</th>'
                , '<th id="5.2.0.1">'
                    , '5.2.0.1.0'
                , '</th>'
            , '</tr>'
        , '</thead>'
        , '<tfoot id="5.3">'
            , '<tr id="5.3.0">'
                , '<th id="5.3.0.0">'
                    , '5.3.0.0.0'
                , '</th>'
                , '<th id="5.3.0.1">'
                    , '5.3.0.1.0'
                , '</th>'
            , '</tr>'
        , '</tfoot>'
        , '<tbody id="5.4">'
            , '<tr id="5.4.0">'
                , '<th id="5.4.0.0">'
                    , '5.4.0.0.0'
                , '</th>'
                , '<th id="5.4.0.1">'
                    , '5.4.0.1.0'
                , '</th>'
            , '</tr>'
        , '</tbody>'
    , '</table>'
    , '<p id="6">'
        , '6.0'
        , '<strong id="6.1">'
            , '6.1.0'
        , '</strong>'
        , '6.2'
    , '</p>'
    , '<p id="7">'
        , '7.0'
        , '<strong id="7.1">'
            , '7.1.0'
            , '<br id="7.1.1" />'
            , '7.1.2'
        , '</strong>'
        , '7.2'
        , '<i id="7.3">'
            , '7.3.0'
        , '</i>'
        , '7.4'
        , '<strong id="7.5">'
        , '</strong>'
        , '7.6'
        , '<i id="7.7">'
        , '</i>'
        , '7.8'
        , '<b id="7.9">'
        , '</b>'
        , '7.10'
        , '<b id="7.11">'
            , '7.11.0'
        , '</b>'
        , '7.12'
        , '<span id="7.13">'
            , '7.13.0'
        , '</span>'
        , '<span id="7.14">'
            , '7.14.0'
        , '</span>'
        , '<br id="7.15" />'
        , '<span id="7.16">'
            , '7.16.0'
        , '</span>'
        , '<span id="7.17">'
            , '7.17.0'
        , '</span>'
    , '</p>'
].join('');

// This is a data-driven test for setting and getting collapsed selections.
// Collapsed selections are practically the caret position.
test("Set and get collapsed selection", function () {
    var
        wymeditor = jQuery.wymeditors(0),
        $allNodes,
        i,
        curNode,
        assertStrCount,
        assertStrPre;

    wymeditor.rawHtml(selTest.setCollapsedHtml);

    // Save a jQuery of all of the nodes in the WYMeditor's body.
    $allNodes = wymeditor.$body().find('*')
        // excluding the WYMeditor utility elements.
        .not('.wym-editor-only');

    for (i = 0; i < $allNodes.length; i++) {
        curNode = $allNodes[i];

        // Set an assertion count string prefix.
        assertStrCount = 'node ' + (i + 1) + ' of ' +
            $allNodes.length + '; ';

        if (
            wymeditor.canSetCaretIn(curNode)
        ) {
            // Set an assertion string prefix.
            assertStrPre = "select inside element; ";

            wymeditor.setCaretIn(curNode);

            if (
                curNode.childNodes.length > 0 &&

                // Rangy issue #209
                !wymeditor.isInlineNode(curNode)
            ) {
                expect(expect() + 1);

                strictEqual(
                    wymeditor.nodeAfterSel(),
                    curNode.childNodes[0],
                    assertStrCount + assertStrPre +
                        "first child is immediately after selection."
                );
            }
            expect(expect() + 1);

            strictEqual(
                wymeditor.selectedContainer(),
                curNode,
                assertStrCount + assertStrPre + "node contains selection.");
        }

        if (
            wymeditor.canSetCaretBefore(curNode)
        ) {
            // Set an assertion string prefix.
            assertStrPre = "select before node; ";

            wymeditor.setCaretBefore(curNode);

            expect(expect() + 2);

            // Assert: Node is immediately after selection
            strictEqual(
                wymeditor.nodeAfterSel(),
                curNode,
                assertStrCount + assertStrPre +
                    "node is immediately after selection."
            );

            // Assert: Node's parent contains selection.
            strictEqual(
                wymeditor.selectedContainer(),
                curNode.parentNode,
                assertStrCount + assertStrPre +
                    "node's parent contains selection."
            );
        }
    }
});

module("selection-_getSelectedNodes", {setup: prepareUnitTestModule});
// `_getSelectedNodes` should be tested much more comprehensively than these 6
// texts.
// See https://github.com/wymeditor/wymeditor/issues/618.

testWymManipulation({
    testName: "No selection",
    startHtml: "<p>Foo</p>",
    prepareFunc: function (wymeditor) {
        wymeditor.deselect();
    },
    additionalAssertionsFunc: function (wymeditor) {
        expect(expect() + 1);
        ok(wymeditor._getSelectedNodes() === false);
    }
});

testWymManipulation({
    testName: "Collapsed selection",
    startHtml: "<p>Foo</p>",
    prepareFunc: function (wymeditor) {
        wymeditor.setCaretIn(wymeditor.body().childNodes[0]);
    },
    additionalAssertionsFunc: function (wymeditor) {
        expect(expect() + 1);
        deepEqual(
            wymeditor._getSelectedNodes(),
            []
        );
    }
});

testWymManipulation({
    testName: "Single text node",
    startHtml: "<p>Foo</p>",
    prepareFunc: function (wymeditor) {
        var range = rangy.createRange(wymeditor._doc),
            foo = wymeditor.body().childNodes[0].childNodes[0];

        range.selectNode(foo);
        wymeditor.selection().setSingleRange(range);
    },
    additionalAssertionsFunc: function (wymeditor) {
        expect(expect() + 1);
        deepEqual(
            wymeditor.selection().getRangeAt(0).getNodes(),
            [wymeditor.body().childNodes[0].childNodes[0]]
        );
    }
});

testWymManipulation({
    testName: "Partially selected text node",
    startHtml: "<p>Foo</p>",
    prepareFunc: function (wymeditor) {
        var range = rangy.createRange(wymeditor._doc),
            foo = wymeditor.body().childNodes[0].childNodes[0];

        range.setStart(foo, 0);
        range.setEnd(foo, 1);
        wymeditor.selection().setSingleRange(range);
    },
    additionalAssertionsFunc: function (wymeditor) {
        expect(expect() + 1);
        deepEqual(
            wymeditor.selection().getRangeAt(0).getNodes(),
            [wymeditor.body().childNodes[0].childNodes[0]]
        );
    }
});

testWymManipulation({
    testName: "Two wholly selected text nodes",
    startHtml: "<p>Foo</p><p>Bar</p>",
    prepareFunc: function (wymeditor) {
        var body = wymeditor.body(),
            range = rangy.createRange(wymeditor._doc),
            foo = body.childNodes[0].childNodes[0],
            bar = body.childNodes[1].childNodes[0];

        range.setStart(foo, 0);
        range.setEnd(bar, 3);
        wymeditor.selection().setSingleRange(range);
    },
    additionalAssertionsFunc: function (wymeditor) {
        expect(expect() + 5);
        var selectedNodes = wymeditor._getSelectedNodes();
        strictEqual(
            selectedNodes.length,
            4
        );
        strictEqual(
            selectedNodes[0].tagName.toLowerCase(),
            "p"
        );
        strictEqual(
            selectedNodes[1].data,
            "Foo"
        );
        strictEqual(
            selectedNodes[2].tagName.toLowerCase(),
            "p"
        );
        strictEqual(
            selectedNodes[3].data,
            "Bar"
        );
    }
});

testWymManipulation({
    testName: "Two partially selected text nodes",
    startHtml: "<p>Foo</p><p>Bar</p>",
    prepareFunc: function (wymeditor) {
        var body = wymeditor.body(),
            range = rangy.createRange(wymeditor._doc);

        range.setStart(body.childNodes[0].childNodes[0], 1);
        range.setEnd(body.childNodes[1].childNodes[0], 1);
        wymeditor.selection().setSingleRange(range);
    },
    additionalAssertionsFunc: function (wymeditor) {
        expect(expect() + 5);
        var selectedNodes = wymeditor._getSelectedNodes();
        strictEqual(
            selectedNodes.length,
            4
        );
        strictEqual(
            selectedNodes[0].tagName.toLowerCase(),
            "p"
        );
        strictEqual(
            selectedNodes[1].data,
            "Foo"
        );
        strictEqual(
            selectedNodes[2].tagName.toLowerCase(),
            "p"
        );
        strictEqual(
            selectedNodes[3].data,
            "Bar"
        );
    }
});
