/* jshint maxlen: 90 */
/* global
    expectOneMore,
    SKIP_KNOWN_FAILING_TESTS,
    prepareUnitTestModule,
    wymEqual,
    moveSelector,
    simulateKey,
    makeSelection,
    makeTextSelection,
    normalizeHtml,
    ok,
    test,
    QUnit,
    deepEqual,
    manipulationTestHelper,
    strictEqual
*/
"use strict";

function testTableTab(startHtml, startSelector, endSelector) {
    manipulationTestHelper({
        startHtml: startHtml,
        manipulationFunc: function (wymeditor) {
            var startElement = wymeditor.$body().find(startSelector)[0];
            expectOneMore();
            ok(startElement !== null, "Selection start element exists");
            moveSelector(wymeditor, startElement);
            simulateKey(WYMeditor.KEY_CODE.TAB, startElement);
        },
        expectedResultHtml: startHtml,
        additionalAssertionsFunc: function (wymeditor) {
            var actualSelectedContainer = wymeditor.selectedContainer(),
                expectedSelectedContainer;
            expectOneMore();
            if (endSelector === null) {
                strictEqual(actualSelectedContainer, null);
                return;
            }
            // In some browsers the selection will be in a child span. That seems ok.
            if (actualSelectedContainer.tagName.toLowerCase() === "span") {
                actualSelectedContainer = actualSelectedContainer.parentNode;
            }
            expectedSelectedContainer = wymeditor.$body().find(endSelector)[0];
            strictEqual(actualSelectedContainer, expectedSelectedContainer);
        }
    });
}

/**
* Perform a row merge from the startSelector to the endSelector and verify
* that the resulting HTML is as expected and our selection ends where expected.
*
* @param initialHtml Starting WYMeditor HTML.
* @param expectedHtml Expected resulting HTML after the merge.
* @param startSelector JQuery selector string for the start of the merge
* selection.
* @param endSelector JQuery selector string for the end of the merge selection.
* @param expectedFinalSelector JQuery selector string matching the node which
* should have selection after completion of the merge. If null, then having any
* selection will fail.
*/
function testRowMerge(
    initialHtml, expectedHtml, startSelector, endSelector, expectedFinalSelector
) {

    var wymeditor = jQuery.wymeditors(0),
        $body,
        startElmnt,
        endElmnt,
        sel,
        changesMade,
        actualSelection,
        expectedSelection;

    wymeditor.rawHtml(initialHtml);

    // Verify that the proposed selection range exists, and then make that
    // selection
    $body = wymeditor.$body();
    startElmnt = $body.find(startSelector)[0];
    ok(startElmnt !== null, "Selection start element exists");
    endElmnt = $body.find(endSelector)[0];
    ok(endElmnt !== null, "Selection end element exists");
    makeSelection(wymeditor, startElmnt, endElmnt);

    // Use rangy to get a cross-browser selection object and perform the actual
    // merge
    sel = wymeditor.selection();
    changesMade = wymeditor.tableEditor.mergeRow(sel);
    deepEqual(changesMade, true);

    // Verify that the resulting HTML matches the expected HTML
    wymEqual(wymeditor, expectedHtml);

    // Verify that our now-current selection matches the expected final
    // selection.
    actualSelection = wymeditor.selectedContainer();
    // In some browsers the selection will be in a child span. That seems ok.
    if (actualSelection.tagName.toLowerCase() === 'span') {
        actualSelection = actualSelection.parentNode;
    }
    if (expectedFinalSelector === null) {
        deepEqual(actualSelection, null);
    } else {
        expectedSelection = $body.find(expectedFinalSelector);
        if (expectedSelection.length !== 0) {
            expectedSelection = expectedSelection[0];
        }

        deepEqual(actualSelection, expectedSelection, "Ending selection matches");
    }
}

function testGetCellXIndex(initialHtml, cellSelector, expectedIndex) {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        cell,
        actual;
    wymeditor.rawHtml(initialHtml);

    $body = wymeditor.$body();
    cell = $body.find(cellSelector)[0];

    actual = wymeditor.tableEditor.getCellXIndex(cell);
    deepEqual(actual, expectedIndex);
}

module("Table Modification", {setup: prepareUnitTestModule});

var basicTableHtml = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1">1_1</td>' +
                    '<td id="td_1_2">1_2</td>' +
                    '<td id="td_1_3">1_3</td>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3">2_3</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td id="td_3_3">3_3</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

// Table with colspan and rowspan
var fancyTableHtml = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1">1_1</td>' +
                    '<td colspan="2" id="td_1_2">1_2</td>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3" rowspan="2">2_3</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

// Table with th elements
var thTableHtml = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<th id="th_1_1">1_1</th>' +
                    '<th id="th_1_2">1_2</th>' +
                    '<th id="th_1_3">1_3</th>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3">2_3</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td id="td_3_3">3_3</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var basicWithPHtml = '<p id="p1">1</p>' + basicTableHtml;

var addRowTd32Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1">1_1</td>' +
                    '<td id="td_1_2">1_2</td>' +
                    '<td id="td_1_3">1_3</td>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3">2_3</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td id="td_3_3">3_3</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var addColumnTd32Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1">1_1</td>' +
                    '<td id="td_1_2">1_2</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td id="td_1_3">1_3</td>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td id="td_2_3">2_3</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td id="td_3_3">3_3</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var addRowSpan21Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1">1_1</td>' +
                    '<td id="td_1_2">1_2</td>' +
                    '<td id="td_1_3">1_3</td>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3">2_3</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td id="td_3_3">3_3</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var addColumnSpan21Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1">1_1</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td id="td_1_2">1_2</td>' +
                    '<td id="td_1_3">1_3</td>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3">2_3</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td id="td_3_3">3_3</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var addRowFancyTd12 = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1">1_1</td>' +
                    '<td colspan="2" id="td_1_2">1_2</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3" rowspan="2">2_3</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var addRowFancyTd22 = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1">1_1</td>' +
                    '<td colspan="2" id="td_1_2">1_2</td>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3" rowspan="3">2_3</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var addRowFancyTd32 = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1">1_1</td>' +
                    '<td colspan="2" id="td_1_2">1_2</td>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3" rowspan="2">2_3</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var addColumnFancyTd12 = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1">1_1</td>' +
                    '<td colspan="2" id="td_1_2">1_2</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3" rowspan="2">2_3</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var addColumnFancyTd23 = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1">1_1</td>' +
                    '<td colspan="2" id="td_1_2">1_2</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3" rowspan="2">2_3</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var addColumnFancyTd32 = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1">1_1</td>' +
                    '<td colspan="2" id="td_1_2">1_2</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3" rowspan="2">2_3</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var addColumnFancyTd11 = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1">1_1</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td colspan="2" id="td_1_2">1_2</td>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3" rowspan="2">2_3</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td id="td_3_2">3_2</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var addColumnFancyTd21 = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1">1_1</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td colspan="2" id="td_1_2">1_2</td>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3" rowspan="2">2_3</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td id="td_3_2">3_2</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var addColumnFancyTd22 = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1">1_1</td>' +
                    '<td colspan="3" id="td_1_2">1_2</td>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td id="td_2_3" rowspan="2">2_3</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var addRowThTh13Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<th id="th_1_1">1_1</th>' +
                    '<th id="th_1_2">1_2</th>' +
                    '<th id="th_1_3">1_3</th>' +
                '</tr>' +
                '<tr>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3">2_3</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td id="td_3_3">3_3</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var addRowThTd32Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<th id="th_1_1">1_1</th>' +
                    '<th id="th_1_2">1_2</th>' +
                    '<th id="th_1_3">1_3</th>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3">2_3</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td id="td_3_3">3_3</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var addColumnThTh13Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<th id="th_1_1">1_1</th>' +
                    '<th id="th_1_2">1_2</th>' +
                    '<th id="th_1_3">1_3</th>' +
                    '<th>' + WYMeditor.NBSP + '</th>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3">2_3</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td id="td_3_3">3_3</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var addColumnThTd32Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<th id="th_1_1">1_1</th>' +
                    '<th id="th_1_2">1_2</th>' +
                    '<th>' + WYMeditor.NBSP + '</th>' +
                    '<th id="th_1_3">1_3</th>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td id="td_2_3">2_3</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td>' + WYMeditor.NBSP + '</td>' +
                    '<td id="td_3_3">3_3</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var removedRow3Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1">1_1</td>' +
                    '<td id="td_1_2">1_2</td>' +
                    '<td id="td_1_3">1_3</td>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3">2_3</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var removedRow2And3Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1">1_1</td>' +
                    '<td id="td_1_2">1_2</td>' +
                    '<td id="td_1_3">1_3</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var removedColumn3Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1">1_1</td>' +
                    '<td id="td_1_2">1_2</td>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var removedColumn3And2Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1">1_1</td>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

module("table- add/remove", {setup: prepareUnitTestModule});
test("no-op on non-table elements", function () {

    manipulationTestHelper({
        startHtml: basicWithPHtml,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#p_1')[0];
            wymeditor.tableEditor.addColumn(actionElement);
        },
        expectedResultHtml: basicWithPHtml,
        testUndoRedo: true
    });

    manipulationTestHelper({
        startHtml: basicWithPHtml,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#p_1')[0];
            wymeditor.tableEditor.removeColumn(actionElement);
        },
        expectedResultHtml: basicWithPHtml,
        testUndoRedo: true
    });

    manipulationTestHelper({
        startHtml: basicWithPHtml,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#p_1')[0];
            wymeditor.tableEditor.addRow(actionElement);
        },
        expectedResultHtml: basicWithPHtml,
        testUndoRedo: true
    });

    manipulationTestHelper({
        startHtml: basicWithPHtml,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#p_1')[0];
            wymeditor.tableEditor.removeRow(actionElement);
        },
        expectedResultHtml: basicWithPHtml,
        testUndoRedo: true
    });
});

test("Column mid column", function () {

    manipulationTestHelper({
        startHtml: basicTableHtml,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#td_3_2')[0];
            wymeditor.tableEditor.addColumn(actionElement);
        },
        expectedResultHtml: addColumnTd32Html,
        testUndoRedo: true
    });

    manipulationTestHelper({
        startHtml: addColumnTd32Html,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#td_3_2 + td')[0];
            wymeditor.tableEditor.removeColumn(actionElement);
        },
        expectedResultHtml: basicTableHtml,
        testUndoRedo: true
    });
});

test("Column from span", function () {

    manipulationTestHelper({
        startHtml: basicTableHtml,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#span_2_1')[0];
            wymeditor.tableEditor.addColumn(actionElement);
        },
        expectedResultHtml: addColumnSpan21Html,
        testUndoRedo: true
    });

    manipulationTestHelper({
        startHtml: addColumnSpan21Html,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#td_2_1 + td')[0];
            wymeditor.tableEditor.removeColumn(actionElement);
        },
        expectedResultHtml: basicTableHtml,
        testUndoRedo: true
    });
});

test("Row end row", function () {

    manipulationTestHelper({
        startHtml: basicTableHtml,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#td_3_2')[0];
            wymeditor.tableEditor.addRow(actionElement);
        },
        expectedResultHtml: addRowTd32Html,
        testUndoRedo: true
    });

    manipulationTestHelper({
        startHtml: addRowTd32Html,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#tr_3 + tr td').eq(1)[0];
            wymeditor.tableEditor.removeRow(actionElement);
        },
        expectedResultHtml: basicTableHtml,
        testUndoRedo: true
    });
});

test("Row from span", function () {

    manipulationTestHelper({
        startHtml: basicTableHtml,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#span_2_1')[0];
            wymeditor.tableEditor.addRow(actionElement);
        },
        expectedResultHtml: addRowSpan21Html,
        testUndoRedo: true
    });

    manipulationTestHelper({
        startHtml: addRowSpan21Html,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#tr_2 + tr td')[0];
            wymeditor.tableEditor.removeRow(actionElement);
        },
        expectedResultHtml: basicTableHtml,
        testUndoRedo: true
    });
});

test("Deleting all rows removes table", function () {

    manipulationTestHelper({
        startHtml: basicTableHtml,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#td_3_1')[0];
            wymeditor.tableEditor.removeRow(actionElement);
        },
        expectedResultHtml: removedRow3Html,
        testUndoRedo: true
    });

    manipulationTestHelper({
        startHtml: removedRow3Html,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#td_2_1')[0];
            wymeditor.tableEditor.removeRow(actionElement);
        },
        expectedResultHtml: removedRow2And3Html,
        testUndoRedo: true
    });

    manipulationTestHelper({
        startHtml: removedRow2And3Html,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#td_1_1')[0];
            wymeditor.tableEditor.removeRow(actionElement);
        },
        expectedResultHtml: '<br />',
        testUndoRedo: true
    });
});

test("Deleting all columns removes table", function () {

    manipulationTestHelper({
        startHtml: basicTableHtml,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#td_3_3')[0];
            wymeditor.tableEditor.removeColumn(actionElement);
        },
        expectedResultHtml: removedColumn3Html,
        testUndoRedo: true
    });

    manipulationTestHelper({
        startHtml: removedColumn3Html,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#td_2_2')[0];
            wymeditor.tableEditor.removeColumn(actionElement);
        },
        expectedResultHtml: removedColumn3And2Html,
        testUndoRedo: true
    });

    manipulationTestHelper({
        startHtml: removedColumn3And2Html,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#span_2_1')[0];
            wymeditor.tableEditor.removeColumn(actionElement);
        },
        expectedResultHtml: '<br />',
        testUndoRedo: true
    });
});

test("Deselects before removing row that contains collapsed selection",
     function () {
    manipulationTestHelper({
        startHtml: basicTableHtml,
        setCaretInSelector: "#td_3_1",
        manipulationFunc: function (wymeditor) {
            var tr = wymeditor.$body().find("#tr_3")[0];
            wymeditor.tableEditor.removeRow(tr);
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            // This doesn't really test that .deselect() was called. We'd need
            // a spy for that. Good enough.
            strictEqual(
                wymeditor.hasSelection(),
                false,
                "No selection"
            );
        },
        expectedResultHtml: removedRow3Html
    });
});

test("Deselects before removing row that fully contains non-collapsed " +
     "selection", function () {
    manipulationTestHelper({
        startHtml: basicTableHtml,
        prepareFunc: function (wymeditor) {
            var td32 = wymeditor.$body().find("#td_3_2")[0],
                td33 = wymeditor.$body().find("#td_3_3")[0];
            makeTextSelection(
                wymeditor,
                td32,
                td33,
                0,
                3
            );
        },
        manipulationFunc: function (wymeditor) {
            var tr = wymeditor.$body().find("#tr_3")[0];
            wymeditor.tableEditor.removeRow(tr);
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            // This doesn't really test that .deselect() was called. We'd need
            // a spy for that. Good enough.
            strictEqual(
                wymeditor.hasSelection(),
                false,
                "No selection"
            );
        },
        expectedResultHtml: removedRow3Html
    });
});

test("Deselects before removing row that partially contains non-collapsed " +
     "selection", function () {
    manipulationTestHelper({
        startHtml: basicTableHtml,
        prepareFunc: function (wymeditor) {
            var td22 = wymeditor.$body().find("#td_2_2")[0],
                td33 = wymeditor.$body().find("#td_3_3")[0];
            makeTextSelection(
                wymeditor,
                td22,
                td33,
                0,
                3
            );
        },
        manipulationFunc: function (wymeditor) {
            var tr = wymeditor.$body().find("#tr_3")[0];
            wymeditor.tableEditor.removeRow(tr);
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            // This doesn't really test that .deselect() was called. We'd need
            // a spy for that. Good enough.
            strictEqual(
                wymeditor.hasSelection(),
                false,
                "No selection"
            );
        },
        expectedResultHtml: removedRow3Html
    });
});

test("Deselects before removing column that contains collapsed selection",
     function () {
    manipulationTestHelper({
        startHtml: basicTableHtml,
        setCaretInSelector: "#td_3_3",
        manipulationFunc: function (wymeditor) {
            var td13 = wymeditor.$body().find("#td_1_3")[0];
            wymeditor.tableEditor.removeColumn(td13);
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            // This doesn't really test that .deselect() was called. We'd need
            // a spy for that. Good enough.
            strictEqual(
                wymeditor.hasSelection(),
                false,
                "No selection"
            );
        },
        expectedResultHtml: removedColumn3Html
    });
});

test("Deselects before removing column that fully contains non-collapsed " +
     "selection", function () {
    manipulationTestHelper({
        startHtml: basicTableHtml,
        prepareFunc: function (wymeditor) {
            var td33 = wymeditor.$body().find("#td_3_3")[0];
            makeTextSelection(
                wymeditor,
                td33,
                td33,
                0,
                3
            );
        },
        manipulationFunc: function (wymeditor) {
            var td13 = wymeditor.$body().find("#td_1_3")[0];
            wymeditor.tableEditor.removeColumn(td13);
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            // This doesn't really test that .deselect() was called. We'd need
            // a spy for that. Good enough.
            strictEqual(
                wymeditor.hasSelection(),
                false,
                "No selection"
            );
        },
        expectedResultHtml: removedColumn3Html
    });
});

test("Deselects before removing column that partially contains non-collapsed " +
     "selection", function () {
    manipulationTestHelper({
        startHtml: basicTableHtml,
        prepareFunc: function (wymeditor) {
            var td13 = wymeditor.$body().find("#td_1_3")[0],
                td33 = wymeditor.$body().find("#td_3_3")[0];
            makeTextSelection(
                wymeditor,
                td13,
                td33,
                0,
                3
            );
        },
        manipulationFunc: function (wymeditor) {
            var td13 = wymeditor.$body().find("#td_1_3")[0];
            wymeditor.tableEditor.removeColumn(td13);
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            // This doesn't really test that .deselect() was called. We'd need
            // a spy for that. Good enough.
            strictEqual(
                wymeditor.hasSelection(),
                false,
                "No selection"
            );
        },
        expectedResultHtml: removedColumn3Html
    });
});

module("table- colspan/rowspan add/remove", {setup: prepareUnitTestModule});
test("Row", function () {

    manipulationTestHelper({
        startHtml: fancyTableHtml,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#td_3_2')[0];
            wymeditor.tableEditor.addRow(actionElement);
        },
        expectedResultHtml: addRowFancyTd32,
        testUndoRedo: true
    });

    manipulationTestHelper({
        startHtml: addRowFancyTd32,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#tr_3 + tr td')[0];
            wymeditor.tableEditor.removeRow(actionElement);
        },
        expectedResultHtml: fancyTableHtml,
        testUndoRedo: true
    });
});

test("Row in colspan", function () {

    manipulationTestHelper({
        startHtml: fancyTableHtml,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#td_1_2')[0];
            wymeditor.tableEditor.addRow(actionElement);
        },
        expectedResultHtml: addRowFancyTd12,
        testUndoRedo: true
    });

    manipulationTestHelper({
        startHtml: addRowFancyTd12,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#tr_1 + tr td')[0];
            wymeditor.tableEditor.removeRow(actionElement);
        },
        expectedResultHtml: fancyTableHtml,
        testUndoRedo: true
    });
});

if (!SKIP_KNOWN_FAILING_TESTS) {
    test("Row in rowspan", function () {

        manipulationTestHelper({
            startHtml: fancyTableHtml,
            manipulationFunc: function (wymeditor) {
                var actionElement = wymeditor.$body().find('#td_2_2')[0];
                wymeditor.tableEditor.addRow(actionElement);
            },
            expectedResultHtml: addRowFancyTd22,
            testUndoRedo: true
        });

        manipulationTestHelper({
            startHtml: addRowFancyTd22,
            manipulationFunc: function (wymeditor) {
                var actionElement = wymeditor.$body().find('#tr_2 + tr td')[0];
                wymeditor.tableEditor.removeRow(actionElement);
            },
            expectedResultHtml: fancyTableHtml,
            testUndoRedo: true
        });
    });
}

if (!SKIP_KNOWN_FAILING_TESTS) {
    test("Column in colspan", function () {

        manipulationTestHelper({
            startHtml: fancyTableHtml,
            manipulationFunc: function (wymeditor) {
                var actionElement = wymeditor.$body().find('#td_1_2')[0];
                wymeditor.tableEditor.addColumn(actionElement);
            },
            expectedResultHtml: addColumnFancyTd12,
            testUndoRedo: true
        });

        manipulationTestHelper({
            startHtml: addColumnFancyTd12,
            manipulationFunc: function (wymeditor) {
                var actionElement = wymeditor.$body().find('#td_1_2 + td')[0];
                wymeditor.tableEditor.removeColumn(actionElement);
            },
            expectedResultHtml: fancyTableHtml,
            testUndoRedo: true
        });
    });
}

if (!SKIP_KNOWN_FAILING_TESTS) {
    test("Column in rowspan", function () {

        manipulationTestHelper({
            startHtml: fancyTableHtml,
            manipulationFunc: function (wymeditor) {
                var actionElement = wymeditor.$body().find('#td_2_3')[0];
                wymeditor.tableEditor.addColumn(actionElement);
            },
            expectedResultHtml: addColumnFancyTd23,
            testUndoRedo: true
        });

        manipulationTestHelper({
            startHtml: addColumnFancyTd23,
            manipulationFunc: function (wymeditor) {
                var actionElement = wymeditor.$body().find('#td_2_3 + td')[0];
                wymeditor.tableEditor.removeColumn(actionElement);
            },
            expectedResultHtml: fancyTableHtml,
            testUndoRedo: true
        });
    });
}

if (!SKIP_KNOWN_FAILING_TESTS) {
    test("Column before rowspan", function () {

        manipulationTestHelper({
            startHtml: fancyTableHtml,
            manipulationFunc: function (wymeditor) {
                var actionElement = wymeditor.$body().find('#td_3_2')[0];
                wymeditor.tableEditor.addColumn(actionElement);
            },
            expectedResultHtml: addColumnFancyTd32,
            testUndoRedo: true
        });

        manipulationTestHelper({
            startHtml: addColumnFancyTd32,
            manipulationFunc: function (wymeditor) {
                var actionElement = wymeditor.$body().find('#td_3_2 + td')[0];
                wymeditor.tableEditor.removeColumn(actionElement);
            },
            expectedResultHtml: fancyTableHtml,
            testUndoRedo: true
        });
    });
}

test("Column before colspan", function () {

    manipulationTestHelper({
        startHtml: fancyTableHtml,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#td_1_1')[0];
            wymeditor.tableEditor.addColumn(actionElement);
        },
        expectedResultHtml: addColumnFancyTd11,
        testUndoRedo: true
    });

    manipulationTestHelper({
        startHtml: addColumnFancyTd11,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#td_1_1 + td')[0];
            wymeditor.tableEditor.removeColumn(actionElement);
        },
        expectedResultHtml: fancyTableHtml,
        testUndoRedo: true
    });
});

test("Column in span", function () {

    manipulationTestHelper({
        startHtml: fancyTableHtml,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#span_2_1')[0];
            wymeditor.tableEditor.addColumn(actionElement);
        },
        expectedResultHtml: addColumnFancyTd21,
        testUndoRedo: true
    });

    manipulationTestHelper({
        startHtml: addColumnFancyTd21,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#td_2_1 + td')[0];
            wymeditor.tableEditor.removeColumn(actionElement);
        },
        expectedResultHtml: fancyTableHtml,
        testUndoRedo: true
    });
});

if (!SKIP_KNOWN_FAILING_TESTS) {
    test("Column affecting colspan", function () {

        manipulationTestHelper({
            startHtml: fancyTableHtml,
            manipulationFunc: function (wymeditor) {
                var actionElement = wymeditor.$body().find('#td_2_2')[0];
                wymeditor.tableEditor.addColumn(actionElement);
            },
            expectedResultHtml: addColumnFancyTd22,
            testUndoRedo: true
        });

        manipulationTestHelper({
            startHtml: addColumnFancyTd22,
            manipulationFunc: function (wymeditor) {
                var actionElement = wymeditor.$body().find('#td_2_2 + td')[0];
                wymeditor.tableEditor.removeColumn(actionElement);
            },
            expectedResultHtml: fancyTableHtml,
            testUndoRedo: true
        });
    });
}

test("Column with TH mid column", function () {

    manipulationTestHelper({
        startHtml: thTableHtml,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#td_3_2')[0];
            wymeditor.tableEditor.addColumn(actionElement);
        },
        expectedResultHtml: addColumnThTd32Html,
        testUndoRedo: true
    });

    manipulationTestHelper({
        startHtml: addColumnThTd32Html,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#td_3_2 + td')[0];
            wymeditor.tableEditor.removeColumn(actionElement);
        },
        expectedResultHtml: thTableHtml,
        testUndoRedo: true
    });
});

test("Column with TH in th", function () {

    manipulationTestHelper({
        startHtml: thTableHtml,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#th_1_3')[0];
            wymeditor.tableEditor.addColumn(actionElement);
        },
        expectedResultHtml: addColumnThTh13Html,
        testUndoRedo: true
    });

    manipulationTestHelper({
        startHtml: addColumnThTh13Html,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#th_1_3 + th')[0];
            wymeditor.tableEditor.removeColumn(actionElement);
        },
        expectedResultHtml: thTableHtml,
        testUndoRedo: true
    });
});

test("Row with TH end row", function () {

    manipulationTestHelper({
        startHtml: thTableHtml,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#td_3_2')[0];
            wymeditor.tableEditor.addRow(actionElement);
        },
        expectedResultHtml: addRowThTd32Html,
        testUndoRedo: true
    });

    manipulationTestHelper({
        startHtml: addRowThTd32Html,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#tr_3 + tr td').eq(1)[0];
            wymeditor.tableEditor.removeRow(actionElement);
        },
        expectedResultHtml: thTableHtml,
        testUndoRedo: true
    });
});

test("Row with TH first th row", function () {

    manipulationTestHelper({
        startHtml: thTableHtml,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#th_1_3')[0];
            wymeditor.tableEditor.addRow(actionElement);
        },
        expectedResultHtml: addRowThTh13Html,
        testUndoRedo: true
    });

    manipulationTestHelper({
        startHtml: addRowThTh13Html,
        manipulationFunc: function (wymeditor) {
            var actionElement = wymeditor.$body().find('#tr_1 + tr td').eq(2)[0];
            wymeditor.tableEditor.removeRow(actionElement);
        },
        expectedResultHtml: thTableHtml,
        testUndoRedo: true
    });
});

module("table- tab movement", {setup: prepareUnitTestModule});
test("Tab to cell right", function () {
    testTableTab(basicTableHtml, '#td_1_1', '#td_1_2');
});

test("Tab from th to cell right", function () {
    testTableTab(thTableHtml, '#th_1_1', '#th_1_2');
});

test("Tab to next row", function () {
    var expectedSelector = '#td_2_1';
    testTableTab(basicTableHtml, '#td_1_3', expectedSelector);
});

test("Tab from th to next row", function () {
    var expectedSelector = '#td_2_1';
    testTableTab(thTableHtml, '#th_1_3', expectedSelector);
});

test("Tab end of table", function () {
    // The real tab action doesn't trigger. Just make sure we're not moving
    // around
    testTableTab(basicTableHtml, '#td_3_3', '#td_3_3');
});

test("Tab nested inside table", function () {
    testTableTab(basicTableHtml, '#span_2_1', '#td_2_2');
});

test("Tab outside of table", function () {
    // The real tab action doesn't trigger. Just make sure we're not moving
    // around
    testTableTab(basicTableHtml + '<p id="p_1">p1</p>', '#p_1', '#p_1');
});

module("table-row_merge", {setup: prepareUnitTestModule});

var mergeTableHtml = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<th id="th_1_1">1_1</th>' +
                    '<th colspan="2" id="th_1_2">1_2</th>' +
                    '<th id="th_1_4">1_4</th>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3" rowspan="2">2_3</td>' +
                    '<td id="td_2_4">2_4</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td id="td_3_4">3_4</td>' +
                '</tr>' +
                '<tr id="tr_4">' +
                    '<td id="td_4_1">4_1</td>' +
                    '<td id="td_4_2">4_2</td>' +
                    '<td id="td_4_3">4_3</td>' +
                    '<td id="td_4_4">4_4</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var mergeTableLongRowspanHtml = String() +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<th id="th_1_1">1_1</th>' +
                    '<th colspan="2" id="th_1_2">1_2</th>' +
                    '<th id="th_1_4">1_4</th>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3" rowspan="3">2_3</td>' +
                    '<td id="td_2_4">2_4</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td id="td_3_4">3_4</td>' +
                '</tr>' +
                '<tr id="tr_4">' +
                    '<td id="td_4_1">4_1</td>' +
                    '<td id="td_4_2">4_2</td>' +
                    '<td id="td_4_4">4_4</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>';

var mergeTd41Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<th id="th_1_1">1_1</th>' +
                    '<th colspan="2" id="th_1_2">1_2</th>' +
                    '<th id="th_1_4">1_4</th>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3" rowspan="2">2_3</td>' +
                    '<td id="td_2_4">2_4</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td id="td_3_4">3_4</td>' +
                '</tr>' +
                '<tr id="tr_4">' +
                    '<td colspan="2" id="td_4_1">4_14_2</td>' +
                    '<td id="td_4_3">4_3</td>' +
                    '<td id="td_4_4">4_4</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var mergeTd41To44Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<th id="th_1_1">1_1</th>' +
                    '<th colspan="2" id="th_1_2">1_2</th>' +
                    '<th id="th_1_4">1_4</th>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3" rowspan="2">2_3</td>' +
                    '<td id="td_2_4">2_4</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td id="td_3_4">3_4</td>' +
                '</tr>' +
                '<tr id="tr_4">' +
                    '<td colspan="4" id="td_4_1">4_14_24_34_4</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var mergeTh12Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<th id="th_1_1">1_1</th>' +
                    '<th colspan="3" id="th_1_2">1_21_4</th>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3" rowspan="2">2_3</td>' +
                    '<td id="td_2_4">2_4</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td id="td_3_4">3_4</td>' +
                '</tr>' +
                '<tr id="tr_4">' +
                    '<td id="td_4_1">4_1</td>' +
                    '<td id="td_4_2">4_2</td>' +
                    '<td id="td_4_3">4_3</td>' +
                    '<td id="td_4_4">4_4</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var mergeTh11To12Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<th colspan="3" id="th_1_1">1_11_2</th>' +
                    '<th id="th_1_4">1_4</th>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3" rowspan="2">2_3</td>' +
                    '<td id="td_2_4">2_4</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td id="td_3_4">3_4</td>' +
                '</tr>' +
                '<tr id="tr_4">' +
                    '<td id="td_4_1">4_1</td>' +
                    '<td id="td_4_2">4_2</td>' +
                    '<td id="td_4_3">4_3</td>' +
                    '<td id="td_4_4">4_4</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var mergeTh11To14Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<th colspan="4" id="th_1_1">1_11_21_4</th>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3" rowspan="2">2_3</td>' +
                    '<td id="td_2_4">2_4</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td id="td_3_4">3_4</td>' +
                '</tr>' +
                '<tr id="tr_4">' +
                    '<td id="td_4_1">4_1</td>' +
                    '<td id="td_4_2">4_2</td>' +
                    '<td id="td_4_3">4_3</td>' +
                    '<td id="td_4_4">4_4</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var mergeSpan21Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<th id="th_1_1">1_1</th>' +
                    '<th colspan="2" id="th_1_2">1_2</th>' +
                    '<th id="th_1_4">1_4</th>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td colspan="2" id="td_2_1"><span id="span_2_1">2_1</span>2_2</td>' +
                    '<td id="td_2_3" rowspan="2">2_3</td>' +
                    '<td id="td_2_4">2_4</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td id="td_3_4">3_4</td>' +
                '</tr>' +
                '<tr id="tr_4">' +
                    '<td id="td_4_1">4_1</td>' +
                    '<td id="td_4_2">4_2</td>' +
                    '<td id="td_4_3">4_3</td>' +
                    '<td id="td_4_4">4_4</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

// Rowspan merges
var mergeTd23Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<th id="th_1_1">1_1</th>' +
                    '<th colspan="2" id="th_1_2">1_2</th>' +
                    '<th id="th_1_4">1_4</th>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td colspan="2" id="td_2_3">2_4</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td>2_3</td>' +
                    '<td id="td_3_4">3_4</td>' +
                '</tr>' +
                '<tr id="tr_4">' +
                    '<td id="td_4_1">4_1</td>' +
                    '<td id="td_4_2">4_2</td>' +
                    '<td id="td_4_3">4_3</td>' +
                    '<td id="td_4_4">4_4</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var mergeTd22Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<th id="th_1_1">1_1</th>' +
                    '<th colspan="2" id="th_1_2">1_2</th>' +
                    '<th id="th_1_4">1_4</th>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td colspan="2" id="td_2_2">2_2</td>' +
                    '<td id="td_2_4">2_4</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td>2_3</td>' +
                    '<td id="td_3_4">3_4</td>' +
                '</tr>' +
                '<tr id="tr_4">' +
                    '<td id="td_4_1">4_1</td>' +
                    '<td id="td_4_2">4_2</td>' +
                    '<td id="td_4_3">4_3</td>' +
                    '<td id="td_4_4">4_4</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var mergeTd31Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<th id="th_1_1">1_1</th>' +
                    '<th colspan="2" id="th_1_2">1_2</th>' +
                    '<th id="th_1_4">1_4</th>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3" rowspan="2">2_3</td>' +
                    '<td id="td_2_4">2_4</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td colspan="2" id="td_3_1">3_13_2</td>' +
                    '<td id="td_3_4">3_4</td>' +
                '</tr>' +
                '<tr id="tr_4">' +
                    '<td id="td_4_1">4_1</td>' +
                    '<td id="td_4_2">4_2</td>' +
                    '<td id="td_4_3">4_3</td>' +
                    '<td id="td_4_4">4_4</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var mergeTd31Td23Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<th id="th_1_1">1_1</th>' +
                    '<th colspan="2" id="th_1_2">1_2</th>' +
                    '<th id="th_1_4">1_4</th>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3">2_3</td>' +
                    '<td id="td_2_4">2_4</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td colspan="3" id="td_3_1">3_13_2</td>' +
                    '<td id="td_3_4">3_4</td>' +
                '</tr>' +
                '<tr id="tr_4">' +
                    '<td id="td_4_1">4_1</td>' +
                    '<td id="td_4_2">4_2</td>' +
                    '<td id="td_4_3">4_3</td>' +
                    '<td id="td_4_4">4_4</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var mergeTd23Td34Html = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<th id="th_1_1">1_1</th>' +
                    '<th colspan="2" id="th_1_2">1_2</th>' +
                    '<th id="th_1_4">1_4</th>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3">2_3</td>' +
                    '<td id="td_2_4">2_4</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td colspan="2">3_4</td>' +
                '</tr>' +
                '<tr id="tr_4">' +
                    '<td id="td_4_1">4_1</td>' +
                    '<td id="td_4_2">4_2</td>' +
                    '<td id="td_4_3">4_3</td>' +
                    '<td id="td_4_4">4_4</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var mergeTd42Td23LongRowspanHtml = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<th id="th_1_1">1_1</th>' +
                    '<th colspan="2" id="th_1_2">1_2</th>' +
                    '<th id="th_1_4">1_4</th>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3" rowspan="2">2_3</td>' +
                    '<td id="td_2_4">2_4</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td id="td_3_4">3_4</td>' +
                '</tr>' +
                '<tr id="tr_4">' +
                    '<td id="td_4_1">4_1</td>' +
                    '<td colspan="2" id="td_4_2">4_2</td>' +
                    '<td id="td_4_4">4_4</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var mergeTd23Td44LongRowspanHtml = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<th id="th_1_1">1_1</th>' +
                    '<th colspan="2" id="th_1_2">1_2</th>' +
                    '<th id="th_1_4">1_4</th>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3" rowspan="2">2_3</td>' +
                    '<td id="td_2_4">2_4</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td id="td_3_4">3_4</td>' +
                '</tr>' +
                '<tr id="tr_4">' +
                    '<td id="td_4_1">4_1</td>' +
                    '<td id="td_4_2">4_2</td>' +
                    '<td colspan="2">4_4</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

var mergeTd32Td23LongRowspanHtml = String() +
        '<br class="wym-blocking-element-spacer wym-editor-only" />' +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<th id="th_1_1">1_1</th>' +
                    '<th colspan="2" id="th_1_2">1_2</th>' +
                    '<th id="th_1_4">1_4</th>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1"><span id="span_2_1">2_1</span></td>' +
                    '<td id="td_2_2">2_2</td>' +
                    '<td id="td_2_3" rowspan="3">2_3</td>' +
                    '<td id="td_2_4">2_4</td>' +
                '</tr>' +
                '<tr id="tr_3">' +
                    '<td id="td_3_1">3_1</td>' +
                    '<td id="td_3_2">3_2</td>' +
                    '<td id="td_3_4">3_4</td>' +
                '</tr>' +
                '<tr id="tr_4">' +
                    '<td id="td_4_1">4_1</td>' +
                    '<td id="td_4_2">4_2</td>' +
                    '<td id="td_4_4">4_4</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<br class="wym-blocking-element-spacer wym-editor-only" />';

test("Merge simple first cell", function () {
    QUnit.expect(5);

    testRowMerge(mergeTableHtml, mergeTd41Html, '#td_4_1', '#td_4_2', '#td_4_1');
});

test("Merge simple multiple cells", function () {
    QUnit.expect(5);

    testRowMerge(mergeTableHtml, mergeTd41To44Html, '#td_4_1', '#td_4_4', '#td_4_1');
});

test("Expand existing colspan", function () {
    QUnit.expect(5);

    testRowMerge(mergeTableHtml, mergeTh12Html, '#th_1_2', '#th_1_4', '#th_1_2');
});

test("Expand into existing colspan", function () {
    QUnit.expect(5);

    testRowMerge(mergeTableHtml, mergeTh11To12Html, '#th_1_1', '#th_1_2', '#th_1_1');
});

test("Surround existing colspan", function () {
    QUnit.expect(5);

    testRowMerge(mergeTableHtml, mergeTh11To14Html, '#th_1_1', '#th_1_4', '#th_1_1');
});

test("With span", function () {
    QUnit.expect(5);

    var endSelection = '#td_2_1';
    testRowMerge(mergeTableHtml, mergeSpan21Html, '#span_2_1', '#td_2_2', endSelection);
});

module("table-row_merge_rowspan", {setup: prepareUnitTestModule});
if (!WYMeditor.isInternetExplorerPre11() || !SKIP_KNOWN_FAILING_TESTS) {
    test("Across rowspan", function () {
        QUnit.expect(5);

        testRowMerge(mergeTableHtml, mergeTd23Html, '#td_2_3', '#td_2_4', '#td_2_3');
    });
}

if (!WYMeditor.isInternetExplorerPre11() || !SKIP_KNOWN_FAILING_TESTS) {
    test("Into rowspan", function () {
        QUnit.expect(5);

        testRowMerge(mergeTableHtml, mergeTd22Html, '#td_2_2', '#td_2_3', '#td_2_2');
    });
}

test("Below and beside rowspan", function () {
    QUnit.expect(5);

    testRowMerge(mergeTableHtml, mergeTd31Html, '#td_3_1', '#td_3_2', '#td_3_1');
});

if (!SKIP_KNOWN_FAILING_TESTS) {
    test("Below and including rowspan", function () {
        QUnit.expect(5);

        testRowMerge(mergeTableHtml, mergeTd31Td23Html, '#td_3_1', '#td_2_3', '#td_3_1');
    });
}

if (!SKIP_KNOWN_FAILING_TESTS) {
    test("From rowspan to below", function () {
        QUnit.expect(5);

        testRowMerge(
            mergeTableHtml,
            mergeTd23Td34Html,
            '#td_2_3',
            '#td_3_4',
            '#td_3_2 + td'
        );
    });
}

if (!SKIP_KNOWN_FAILING_TESTS) {
    test("Below and bottom of long rowspan", function () {
        QUnit.expect(5);

        testRowMerge(
            mergeTableLongRowspanHtml,
            mergeTd42Td23LongRowspanHtml,
            '#td_4_2',
            '#td_2_3',
            '#td_4_2'
        );
    });
}

if (!SKIP_KNOWN_FAILING_TESTS) {
    test("Below and after bottom of long rowspan", function () {
        QUnit.expect(5);

        testRowMerge(
            mergeTableLongRowspanHtml,
            mergeTd23Td44LongRowspanHtml,
            '#td_2_3',
            '#td_4_4',
            '#td_4_2 + td'
        );
    });
}

if (!SKIP_KNOWN_FAILING_TESTS) {
    test("Middle of rowspan doesn't merge", function () {
        QUnit.expect(5);

        testRowMerge(
            mergeTableLongRowspanHtml,
            mergeTd32Td23LongRowspanHtml,
            '#td_3_2',
            '#td_2_3',
            '#td_3_2'
        );
    });
}

test("getCellXIndex test", function () {
    QUnit.expect(5);

    testGetCellXIndex(mergeTableHtml, '#th_1_1', 0);
    testGetCellXIndex(mergeTableHtml, '#th_1_4', 3);
    testGetCellXIndex(mergeTableHtml, '#td_2_3', 2);
    testGetCellXIndex(mergeTableHtml, '#td_3_4', 3);
    testGetCellXIndex(mergeTableLongRowspanHtml, '#td_4_4', 3);
});

module("utils", {setup: prepareUnitTestModule});
function testNormalize(testHtml) {
    var $nodes = jQuery(testHtml),
        normed = '';
    $nodes.each(function (i, node) {
        normed += normalizeHtml(node);
    });
    deepEqual(normed, testHtml);
}

test("Test Normalize", function () {
    QUnit.expect(2);

    testNormalize(mergeTableHtml);
    testNormalize(mergeTd41Html);
});
