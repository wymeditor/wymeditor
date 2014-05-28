/* jshint maxlen: 90 */
/* global rangy,
setupWym, SKIP_KNOWN_FAILING_TESTS,
wymEqual, moveSelector, simulateKey, makeSelection, normalizeHtml,
ok, test, expect, deepEqual */
"use strict";

/**
 * Run a table modification and verify the results.
 *
 * @param selector jQuery selector for the element to modify (the first match
 *                 is used by default)
 * @param action A string with either 'add' or 'remove'
 * @param type A string with either 'row' or 'column'
 * @param initialHtml The starting HTML
 * @param expectedHtml The expected HTML result
 * @param indexInSelector The eq index of the desired match to use within the
 *                        passed selector (0 by default)
 */
function testTable(
    selector, action, type, initialHtml, expectedHtml, indexInSelector
) {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        actionElmnt;

    wymeditor._html(initialHtml);

    $body = jQuery(wymeditor._doc).find('body.wym_iframe');
    indexInSelector = indexInSelector || 0;
    actionElmnt = $body.find(selector)[indexInSelector];

    if (action === 'add') {
        if (type === 'row') {
            wymeditor.tableEditor.addRow(actionElmnt);
        } else {
            wymeditor.tableEditor.addColumn(actionElmnt);
        }
    } else if (action === 'remove') {
        if (type === 'row') {
            wymeditor.tableEditor.removeRow(actionElmnt);
        } else {
            wymeditor.tableEditor.removeColumn(actionElmnt);
        }
    }

    wymEqual(wymeditor, expectedHtml);
}

function testTableTab(initialHtml, startSelector, endSelector) {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        startElmnt,
        actualSelection,
        expectedSelection;
    wymeditor._html(initialHtml);

    $body = jQuery(wymeditor._doc).find('body.wym_iframe');
    startElmnt = $body.find(startSelector)[0];
    ok(startElmnt !== null, "Selection start element exists");
    moveSelector(wymeditor, startElmnt);

    simulateKey(WYMeditor.KEY.TAB, startElmnt);

    actualSelection = wymeditor.selectedContainer();
    if (endSelector === null) {
        deepEqual(actualSelection, null);
    } else {
        expectedSelection = $body.find(endSelector);
        if (expectedSelection.length !== 0) {
            expectedSelection = expectedSelection[0];
        }

        deepEqual(actualSelection, expectedSelection);
    }
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

    wymeditor._html(initialHtml);

    // Verify that the proposed selection range exists, and then make that
    // selection
    $body = jQuery(wymeditor._doc).find('body.wym_iframe');
    startElmnt = $body.find(startSelector)[0];
    ok(startElmnt !== null, "Selection start element exists");
    endElmnt = $body.find(endSelector)[0];
    ok(endElmnt !== null, "Selection end element exists");
    makeSelection(wymeditor, startElmnt, endElmnt);

    // Use rangy to get a cross-browser selection object and perform the actual
    // merge
    sel = rangy.getIframeSelection(wymeditor._iframe);
    changesMade = wymeditor.tableEditor.mergeRow(sel);
    deepEqual(changesMade, true);

    // Verify that the resulting HTML matches the expected HTML
    wymEqual(wymeditor, expectedHtml);

    // Verify that our now-current selection matches the expected final
    // selection.
    actualSelection = wymeditor.selectedContainer();
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
    wymeditor._html(initialHtml);

    $body = jQuery(wymeditor._doc).find('body.wym_iframe');
    cell = $body.find(cellSelector)[0];

    actual = wymeditor.tableEditor.getCellXIndex(cell);
    deepEqual(actual, expectedIndex);
}

module("Table Modification", {setup: setupWym});

var basicTableHtml = String() +
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
        '</table>';

// Table with colspan and rowspan
var fancyTableHtml = String() +
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
        '</table>';

// Table with th elements
var thTableHtml = String() +
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
        '</table>';

var basicWithPHtml = '<p id="p1">1</p>' + basicTableHtml;

var addRowTd32Html = String() +
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
        '</table>';

var addColumnTd32Html = String() +
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
        '</table>';

var addRowSpan21Html = String() +
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
        '</table>';

var addColumnSpan21Html = String() +
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
        '</table>';

var addRowFancyTd12 = String() +
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
        '</table>';

var addRowFancyTd22 = String() +
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
        '</table>';

var addRowFancyTd32 = String() +
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
        '</table>';

var addColumnFancyTd12 = String() +
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
        '</table>';

var addColumnFancyTd23 = String() +
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
        '</table>';

var addColumnFancyTd32 = String() +
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
        '</table>';

var addColumnFancyTd11 = String() +
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
        '</table>';

var addColumnFancyTd21 = String() +
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
        '</table>';

var addColumnFancyTd22 = String() +
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
        '</table>';

var addRowThTh13Html = String() +
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
        '</table>';

var addRowThTd32Html = String() +
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
        '</table>';

var addColumnThTh13Html = String() +
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
        '</table>';

var addColumnThTd32Html = String() +
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
        '</table>';

var removedRow3Html = String() +
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
        '</table>';

var removedRow2And3Html = String() +
        '<table>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1">1_1</td>' +
                    '<td id="td_1_2">1_2</td>' +
                    '<td id="td_1_3">1_3</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>';

var removedColumn3Html = String() +
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
        '</table>';

var removedColumn3And2Html = String() +
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
        '</table>';

module("table- add/remove", {setup: setupWym});
test("no-op on non-table elements", function () {
    expect(4);

    testTable('#p_1', 'add', 'column', basicWithPHtml, basicWithPHtml);
    testTable('#p_1', 'remove', 'column', basicWithPHtml, basicWithPHtml);
    testTable('#p_1', 'add', 'row', basicWithPHtml, basicWithPHtml);
    testTable('#p_1', 'remove', 'row', basicWithPHtml, basicWithPHtml);
});

test("Column mid column", function () {
    expect(2);

    testTable('#td_3_2', 'add', 'column', basicTableHtml, addColumnTd32Html);
    testTable('#td_3_2 + td', 'remove', 'column', addColumnTd32Html, basicTableHtml);
});

test("Column from span", function () {
    expect(2);

    testTable('#span_2_1', 'add', 'column', basicTableHtml, addColumnSpan21Html);
    testTable('#td_2_1 + td', 'remove', 'column', addColumnSpan21Html, basicTableHtml);
});

test("Row end row", function () {
    expect(2);

    testTable('#td_3_2', 'add', 'row', basicTableHtml, addRowTd32Html);
    testTable('#tr_3 + tr td', 'remove', 'row', addRowTd32Html, basicTableHtml, 1);
});

test("Row from span", function () {
    expect(2);

    testTable('#span_2_1', 'add', 'row', basicTableHtml, addRowSpan21Html);
    testTable('#tr_2 + tr td', 'remove', 'row', addRowSpan21Html, basicTableHtml);
});

test("Deleting all rows removes table", function () {
    expect(3);

    testTable('#td_3_1', 'remove', 'row', basicTableHtml, removedRow3Html);
    testTable('#td_2_1', 'remove', 'row', removedRow3Html, removedRow2And3Html);
    testTable('#td_1_1', 'remove', 'row', removedRow2And3Html, '');
});

test("Deleting all columns removes table", function () {
    expect(3);

    testTable('#td_3_3', 'remove', 'column', basicTableHtml, removedColumn3Html);
    testTable('#td_2_2', 'remove', 'column', removedColumn3Html, removedColumn3And2Html);
    testTable('#span_2_1', 'remove', 'column', removedColumn3And2Html, '');
});

module("table- colspan/rowspan add/remove", {setup: setupWym});
test("Row", function () {
    expect(2);

    testTable('#td_3_2', 'add', 'row', fancyTableHtml, addRowFancyTd32);
    testTable('#tr_3 + tr td', 'remove', 'row', addRowFancyTd32, fancyTableHtml);
});

test("Row in colspan", function () {
    expect(2);

    testTable('#td_1_2', 'add', 'row', fancyTableHtml, addRowFancyTd12);
    testTable('#tr_1 + tr td', 'remove', 'row', addRowFancyTd12, fancyTableHtml);
});

if (!SKIP_KNOWN_FAILING_TESTS) {
    test("Row in rowspan", function () {
        expect(2);

        testTable('#td_2_2', 'add', 'row', fancyTableHtml, addRowFancyTd22);
        testTable('#tr_2 + tr td', 'remove', 'row', addRowFancyTd22, fancyTableHtml);
    });
}

if (!SKIP_KNOWN_FAILING_TESTS) {
    test("Column in colspan", function () {
        expect(2);

        testTable('#td_1_2', 'add', 'column', fancyTableHtml, addColumnFancyTd12);
        testTable('#td_1_2 + td', 'remove', 'column', addColumnFancyTd12, fancyTableHtml);
    });
}

if (!SKIP_KNOWN_FAILING_TESTS) {
    test("Column in rowspan", function () {
        expect(2);

        testTable('#td_2_3', 'add', 'column', fancyTableHtml, addColumnFancyTd23);
        testTable('#td_2_3 + td', 'remove', 'column', addColumnFancyTd23, fancyTableHtml);
    });
}

if (!SKIP_KNOWN_FAILING_TESTS) {
    test("Column before rowspan", function () {
        expect(2);

        testTable('#td_3_2', 'add', 'column', fancyTableHtml, addColumnFancyTd32);
        testTable('#td_3_2 + td', 'remove', 'column', addColumnFancyTd32, fancyTableHtml);
    });
}

test("Column before colspan", function () {
    expect(2);

    testTable('#td_1_1', 'add', 'column', fancyTableHtml, addColumnFancyTd11);
    testTable('#td_1_1 + td', 'remove', 'column', addColumnFancyTd11, fancyTableHtml);
});

test("Column in span", function () {
    expect(2);

    testTable('#span_2_1', 'add', 'column', fancyTableHtml, addColumnFancyTd21);
    testTable('#td_2_1 + td', 'remove', 'column', addColumnFancyTd21, fancyTableHtml);
});

if (!SKIP_KNOWN_FAILING_TESTS) {
    test("Column affecting colspan", function () {
        expect(2);

        testTable('#td_2_2', 'add', 'column', fancyTableHtml, addColumnFancyTd22);
        testTable('#td_2_2 + td', 'remove', 'column', addColumnFancyTd22, fancyTableHtml);
    });
}

test("Column with TH mid column", function () {
    expect(2);

    testTable('#td_3_2', 'add', 'column', thTableHtml, addColumnThTd32Html);
    testTable('#td_3_2 + td', 'remove', 'column', addColumnThTd32Html, thTableHtml);
});

test("Column with TH in th", function () {
    expect(2);

    testTable('#th_1_3', 'add', 'column', thTableHtml, addColumnThTh13Html);
    testTable('#th_1_3 + th', 'remove', 'column', addColumnThTh13Html, thTableHtml);
});

test("Row with TH end row", function () {
    expect(2);

    testTable('#td_3_2', 'add', 'row', thTableHtml, addRowThTd32Html);
    testTable('#tr_3 + tr td', 'remove', 'row', addRowThTd32Html, thTableHtml, 1);
});

test("Row with TH first th row", function () {
    expect(2);

    testTable('#th_1_3', 'add', 'row', thTableHtml, addRowThTh13Html);
    testTable('#tr_1 + tr td', 'remove', 'row', addRowThTh13Html, thTableHtml, 2);
});

module("table- tab movement", {setup: setupWym});
test("Tab to cell right", function () {
    expect(3);
    testTableTab(basicTableHtml, '#td_1_1', '#td_1_2');
});

test("Tab from th to cell right", function () {
    expect(3);
    testTableTab(thTableHtml, '#th_1_1', '#th_1_2');
});

test("Tab to next row", function () {
    expect(3);
    var expectedSelector = '#td_2_1';
    if (WYMeditor._isInnerSelector) {
        expectedSelector = '#span_2_1';
    }
    testTableTab(basicTableHtml, '#td_1_3', expectedSelector);
});

test("Tab from th to next row", function () {
    expect(3);
    var expectedSelector = '#span_2_1';
    if (jQuery.browser.mozilla ||
        (jQuery.browser.msie && parseInt(jQuery.browser.version, 10) >= 9.0))
    {
        expectedSelector = '#td_2_1';
    }
    testTableTab(thTableHtml, '#th_1_3', expectedSelector);
});

test("Tab end of table", function () {
    // The real tab action doesn't trigger. Just make sure we're not moving
    // around
    expect(3);
    testTableTab(basicTableHtml, '#td_3_3', '#td_3_3');
});

test("Tab nested inside table", function () {
    expect(3);
    testTableTab(basicTableHtml, '#span_2_1', '#td_2_2');
});

test("Tab outside of table", function () {
    // The real tab action doesn't trigger. Just make sure we're not moving
    // around
    expect(3);
    testTableTab(basicTableHtml + '<p id="p_1">p1</p>', '#p_1', '#p_1');
});

module("table-row_merge", {setup: setupWym});

var mergeTableHtml = String() +
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
        '</table>';

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
        '</table>';

var mergeTd41To44Html = String() +
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
        '</table>';

var mergeTh12Html = String() +
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
        '</table>';

var mergeTh11To12Html = String() +
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
        '</table>';

var mergeTh11To14Html = String() +
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
        '</table>';

var mergeSpan21Html = String() +
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
        '</table>';

// Rowspan merges
var mergeTd23Html = String() +
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
        '</table>';

var mergeTd22Html = String() +
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
        '</table>';

var mergeTd31Html = String() +
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
        '</table>';

var mergeTd31Td23Html = String() +
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
        '</table>';

var mergeTd23Td34Html = String() +
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
        '</table>';

var mergeTd42Td23LongRowspanHtml = String() +
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
        '</table>';

var mergeTd23Td44LongRowspanHtml = String() +
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
        '</table>';

var mergeTd32Td23LongRowspanHtml = String() +
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

test("Merge simple first cell", function () {
    expect(5);

    testRowMerge(mergeTableHtml, mergeTd41Html, '#td_4_1', '#td_4_2', '#td_4_1');
});

test("Merge simple multiple cells", function () {
    expect(5);

    testRowMerge(mergeTableHtml, mergeTd41To44Html, '#td_4_1', '#td_4_4', '#td_4_1');
});

test("Expand existing colspan", function () {
    expect(5);

    testRowMerge(mergeTableHtml, mergeTh12Html, '#th_1_2', '#th_1_4', '#th_1_2');
});

test("Expand into existing colspan", function () {
    expect(5);

    testRowMerge(mergeTableHtml, mergeTh11To12Html, '#th_1_1', '#th_1_2', '#th_1_1');
});

test("Surround existing colspan", function () {
    expect(5);

    testRowMerge(mergeTableHtml, mergeTh11To14Html, '#th_1_1', '#th_1_4', '#th_1_1');
});

test("With span", function () {
    expect(5);

    var endSelection = '#td_2_1';
    if (WYMeditor._isInnerSelector) {
        endSelection = '#span_2_1';
    }
    testRowMerge(mergeTableHtml, mergeSpan21Html, '#span_2_1', '#td_2_2', endSelection);
});

module("table-row_merge_rowspan", {setup: setupWym});
if (!jQuery.browser.msie || !SKIP_KNOWN_FAILING_TESTS) {
    test("Across rowspan", function () {
        expect(5);

        testRowMerge(mergeTableHtml, mergeTd23Html, '#td_2_3', '#td_2_4', '#td_2_3');
    });
}

if (!jQuery.browser.msie || !SKIP_KNOWN_FAILING_TESTS) {
    test("Into rowspan", function () {
        expect(5);

        testRowMerge(mergeTableHtml, mergeTd22Html, '#td_2_2', '#td_2_3', '#td_2_2');
    });
}

test("Below and beside rowspan", function () {
    expect(5);

    testRowMerge(mergeTableHtml, mergeTd31Html, '#td_3_1', '#td_3_2', '#td_3_1');
});

if (!SKIP_KNOWN_FAILING_TESTS) {
    test("Below and including rowspan", function () {
        expect(5);

        testRowMerge(mergeTableHtml, mergeTd31Td23Html, '#td_3_1', '#td_2_3', '#td_3_1');
    });
}

if (!SKIP_KNOWN_FAILING_TESTS) {
    test("From rowspan to below", function () {
        expect(5);

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
        expect(5);

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
        expect(5);

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
        expect(5);

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
    expect(5);

    testGetCellXIndex(mergeTableHtml, '#th_1_1', 0);
    testGetCellXIndex(mergeTableHtml, '#th_1_4', 3);
    testGetCellXIndex(mergeTableHtml, '#td_2_3', 2);
    testGetCellXIndex(mergeTableHtml, '#td_3_4', 3);
    testGetCellXIndex(mergeTableLongRowspanHtml, '#td_4_4', 3);
});

module("utils", {setup: setupWym});
function testNormalize(testHtml) {
    var normed = normalizeHtml(jQuery(testHtml)[0]);
    deepEqual(normed, testHtml);
}

test("Test Normalize", function () {
    expect(2);

    testNormalize(mergeTableHtml);
    testNormalize(mergeTd41Html);
});
