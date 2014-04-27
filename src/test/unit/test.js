/* jshint camelcase: false, maxlen: 100 */
/* global -$,
ok, start, stop, test, expect, equal, deepEqual, sinon,
htmlEquals, domEquals, moveSelector, makeTextSelection, isContentEditable,
inPhantomjs, ListPlugin, strictEqual, multiline */
"use strict";

// We need to be able to operate in a noConflict context. Doing this during our
// tests ensures that remains the case.
jQuery.noConflict();

// Whether or not we want to skip the tests that are known to be failing.
// Ideally, there would be no tests in this category, but right now there are
// a lot of table-related bugs that need to be fixed that aren't the number
// one priority. Having a test suite with failing tests is a bad thing though,
// because new contributors don't know which tests are "supposed to be
// failing." That lack of knowing makes the test suite much less useful than a
// test suite that should always be passing in all supported browsers.
var SKIP_KNOWN_FAILING_TESTS = true;

function setupWym(modificationCallback) {
    if (WYMeditor.INSTANCES.length === 0) {
        stop(); // Stop test running until the editor is initialized
        jQuery('.wymeditor').wymeditor({
            postInit: function (wym) {
                // Determine if attempting to select a cell with a non-text
                // inner node (a span) actually selects the inner node or
                // selects the cell itself. FF for example, selects the cell
                // while webkit selects the inner.
                var initialHtml = [""
                    , '<table>'
                        , '<tbody>'
                            , '<tr>'
                                , '<td id="td_1_1">'
                                    , '<span id="span_1_1">span_1_1</span>'
                                , '</td>'
                            , '</tr>'
                        , '</tbody>'
                    , '</table>'
                    ].join(''),
                    spanSelector = '#span_1_1',
                    tdSelector = '#td_1_1',
                    $body,
                    td,
                    span;

                wym.listPlugin = new ListPlugin({}, wym);
                wym.tableEditor = wym.table();

                wym.structuredHeadings();

                wym._html(initialHtml);

                $body = jQuery(wym._doc).find('body.wym_iframe');
                td = $body.find(tdSelector)[0];
                span = $body.find(spanSelector)[0];
                wym.tableEditor.selectElement($body.find(tdSelector)[0]);

                if (wym.selected() === span) {
                    WYMeditor._isInnerSelector = true;
                } else {
                    WYMeditor._isInnerSelector = false;
                }

                if (typeof modificationCallback === 'function') {
                    modificationCallback(wym);
                }

                // Re-start test running now that we're finished initializing
                start();
            }
        });
    } else {
        var wym;
        wym = WYMeditor.INSTANCES[0];
        wym.documentStructureManager.setDefaultRootContainer('p');

        if (typeof modificationCallback === 'function') {
            stop();
            modificationCallback(wym);
            start();
        }
    }
}

module("Core", {setup: setupWym});

test("Instantiate", function () {
    expect(2);
    deepEqual(WYMeditor.INSTANCES.length, 1, "WYMeditor.INSTANCES length");
    deepEqual(typeof jQuery.wymeditors(0), 'object',
              "Type of first WYMeditor instance, using jQuery.wymeditors(0)");
});
/*
    Tests that require the WYMeditor instance to already be initialized.
    Calling this funtion as a postInit argument ensures they can pass.
*/

module("API", {setup: setupWym});

test("Commands", function () {
    expect(2);
    var wymeditor = jQuery.wymeditors(0);

    wymeditor.toggleHtml();
    deepEqual(jQuery('div.wym_html:visible', wymeditor._box).length, 1);
    wymeditor.toggleHtml();
    deepEqual(jQuery('div.wym_html:visible', wymeditor._box).length, 0);
});

module("XmlHelper", {setup: setupWym});

test("Should escape URL's only once #69.1", function () {
    expect(2);
    var original = "index.php?module=x&func=view&id=1",
        expected = "index.php?module=x&amp;func=view&amp;id=1";
    deepEqual(jQuery.wymeditors(0).helper.escapeOnce(original), expected,
            "Escape entities");
    deepEqual(jQuery.wymeditors(0).helper.escapeOnce(expected), expected,
            "Avoids double entity escaping");
});

module("Post Init", {setup: setupWym});

test("Sanity check: _html()", function () {
    expect(1);
    var testText1 = '<p>This is some text with which to test.<\/p>',
        wymeditor = jQuery.wymeditors(0);

    wymeditor._html(testText1);
    htmlEquals(wymeditor, testText1);
});

module("copy-paste", {setup: setupWym});

var basicParagraphsHtml = String() +
        '<h2 id="h2_1">h2_1</h2>' +
        '<p id="p_1">p_1</p>' +
        '<p id="p_2"></p>';

var nestedListHtml = String() +
        '<ol>' +
            '<li id="li_1">1</li>' +
            '<li id="li_2">2' +
                '<ol>' +
                    '<li id="li_2_1">2_1</li>' +
                    '<li id="li_2_2">2_2</li>' +
                '</ol>' +
            '</li>' +
            '<li id="li_3">3' +
                '<ol>' +
                    '<li id="li_3_1">3_1</li>' +
                '</ol>' +
            '</li>' +
            '<li id="li_4">4</li>' +
        '</ol>';

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

var complexCopyText = String() +
        'sentence\r\n' +
        'sentence2\r\n' +
        '1.list1\r\n' +
        '2.list2\r\n' +
        '3.list3\r\n' +
        'sentence3\r\n\r\n' +
        'gap\r\n\r\n' +
        'gap2';
if (jQuery.browser !== 'msie') {
    complexCopyText = complexCopyText.replace(/\r/g, '');
}

var body_complexInsertionHtml = String() +
        '<p>' +
            'sentence<br />' +
            'sentence2<br />' +
            '1.list1<br />' +
            '2.list2<br />' +
            '3.list3<br />' +
            'sentence3' +
        '</p>' +
        '<p>' +
            'gap' +
        '</p>' +
        '<p>' +
            'gap2' +
        '</p>';

var h2_1_complexInsertionHtml = String() +
        '<h2 id="h2_1">' +
            'sentence<br />' +
            'sentence2<br />' +
            '1.list1<br />' +
            '2.list2<br />' +
            '3.list3<br />' +
            'sentence3' +
        '</h2>' +
        '<p>' +
            'gap' +
        '</p>' +
        '<p>' +
            'gap2' +
        '</p>' +
        '<h2>h2_1</h2>';

var h2_1_middle_complexInsertionHtml = String() +
        '<h2 id="h2_1">' +
            'h2sentence<br />' +
            'sentence2<br />' +
            '1.list1<br />' +
            '2.list2<br />' +
            '3.list3<br />' +
            'sentence3' +
        '</h2>' +
        '<p>' +
            'gap' +
        '</p>' +
        '<p>' +
            'gap2' +
        '</p>' +
        '<h2>_1</h2>';

var h2_1_end_complexInsertionHtml = String() +
        '<h2 id="h2_1">' +
            'h2_1sentence<br />' +
            'sentence2<br />' +
            '1.list1<br />' +
            '2.list2<br />' +
            '3.list3<br />' +
            'sentence3' +
        '</h2>' +
        '<p>' +
            'gap' +
        '</p>' +
        '<p>' +
            'gap2' +
        '</p>';

var p_2_complexInsertionHtml = String() +
        '<p id="p_2">' +
            'sentence<br />' +
            'sentence2<br />' +
            '1.list1<br />' +
            '2.list2<br />' +
            '3.list3<br />' +
            'sentence3' +
        '</p>' +
        '<p>' +
            'gap' +
        '</p>' +
        '<p>' +
            'gap2' +
        '</p>';

var td_1_1_complexInsertionHtml = String() +
        '<td id="td_1_1">' +
            'sentence<br />' +
            'sentence2<br />' +
            '1.list1<br />' +
            '2.list2<br />' +
            '3.list3<br />' +
            'sentence3<br /><br />' +
            'gap<br /><br />' +
            'gap21_1' +
        '</td>';

var span_2_1_complexInsertionHtml = String() +
        '<td id="td_2_1">' +
            '<span id="span_2_1">' +
                'sentence<br />' +
                'sentence2<br />' +
                '1.list1<br />' +
                '2.list2<br />' +
                '3.list3<br />' +
                'sentence3<br /><br />' +
                'gap<br /><br />' +
                'gap22_1' +
            '</span>' +
        '</td>';

var li_1_complexInsertionHtml = String() +
        '<li id="li_1">' +
            'sentence<br />' +
            'sentence2<br />' +
            '1.list1<br />' +
            '2.list2<br />' +
            '3.list3<br />' +
            'sentence3' +
        '</li>' +
        '<li>' +
            'gap' +
        '</li>' +
        '<li>' +
            'gap2' +
        '</li>' +
        '<li>' +
            '1' +
        '</li>';

var li_2_2_complexInsertionHtml = String() +
        '<li id="li_2_2">' +
            'sentence<br />' +
            'sentence2<br />' +
            '1.list1<br />' +
            '2.list2<br />' +
            '3.list3<br />' +
            'sentence3' +
        '</li>' +
        '<li>' +
            'gap' +
        '</li>' +
        '<li>' +
            'gap2' +
        '</li>' +
        '<li>' +
            '2_2' +
        '</li>';

/**
    Paste some copied content in to the given element and verify the results.

    @param pasteStartSelector String jquery selector for the item to select
    for the paste target
    @param startHtml
    @param textToPaste
    @param elmntStartHtml
    @param elmntExpectedHtml
    @param pasteStartIndex
    @param pasteEndSelector String jquery selector for the end item
    in the paste target selection
    @param pasteEndIndex
*/
function testPaste(
    pasteStartSelector,
    startHtml,
    textToPaste,
    elmntStartHtml,
    elmntExpectedHtml,
    pasteStartIndex,
    pasteEndSelector,
    pasteEndIndex
) {
    var $body,
        startElmnt,
        endElmnt,
        wymeditor,
        expectedHtml,
        elmntRegex;

    // Optional arguments
    if (typeof pasteStartIndex === 'undefined') {
        pasteStartIndex = 0;
    }
    if (typeof pasteEndSelector === 'undefined') {
        pasteEndSelector = pasteStartSelector;
    }
    if (typeof pasteEndIndex === 'undefined') {
        if (pasteStartSelector === pasteEndSelector) {
            pasteEndIndex = pasteStartIndex;
        } else {
            pasteEndIndex = 0;
        }
    }

    wymeditor = jQuery.wymeditors(0);
    wymeditor._html(startHtml);

    // Escape slashes for the regexp
    elmntRegex = new RegExp(elmntStartHtml.replace('/', '\\/'), 'g');
    expectedHtml = startHtml.replace(
        elmntRegex,
        elmntExpectedHtml
    );

    $body = jQuery(wymeditor._doc).find('body.wym_iframe');

    wymeditor._doc.body.focus();
    if (pasteStartSelector === '') {
        // Attempting to select the body
        moveSelector(wymeditor, $body[0]);
    } else {
        startElmnt = $body.find(pasteStartSelector).get(0);
        endElmnt = $body.find(pasteEndSelector).get(0);
        makeTextSelection(
            wymeditor, startElmnt, endElmnt, pasteStartIndex, pasteEndIndex);
        deepEqual(wymeditor.selected(), startElmnt, "moveSelector");
    }
    wymeditor.paste(textToPaste);

    htmlEquals(wymeditor, expectedHtml);
}

test("Body- Direct Paste", function () {
    expect(2);
    testPaste(
        '', // No selector. Just the body
        '', // No HTML to start
        complexCopyText,
        '.*', // Replace everything with our expected HTML
        body_complexInsertionHtml
    );
});

test("Paragraphs- Inside h2_1", function () {
    expect(2);
    testPaste(
        '#h2_1',
        basicParagraphsHtml,
        complexCopyText,
        '<h2 id="h2_1">h2_1</h2>',
        h2_1_complexInsertionHtml
    );
});

test("Paragraphs- Inside middle of h2_1", function () {
    expect(2);
    testPaste(
        '#h2_1',
        basicParagraphsHtml,
        complexCopyText,
        '<h2 id="h2_1">h2_1</h2>',
        h2_1_middle_complexInsertionHtml,
        2 // cursor at: h2|_1
    );
});

test("Paragraphs- End of h2_1", function () {
    expect(2);
    testPaste(
        '#h2_1',
        basicParagraphsHtml,
        complexCopyText,
        '<h2 id="h2_1">h2_1</h2>',
        h2_1_end_complexInsertionHtml,
        4 // cursor at: h2_1|
    );
});

test("Paragraphs- Empty p_2", function () {
    expect(2);
    testPaste(
        '#p_2',
        basicParagraphsHtml,
        complexCopyText,
        '<p id="p_2"></p>',
        p_2_complexInsertionHtml
    );
});

test("Table- simple row td_1_1", function () {
    expect(2);
    testPaste(
        '#td_1_1',
        basicTableHtml,
        complexCopyText,
        '<td id="td_1_1">1_1</td>',
        td_1_1_complexInsertionHtml
    );
});

test("Table- inside a span span_2_1", function () {
    expect(2);
    testPaste(
        '#span_2_1',
        basicTableHtml,
        complexCopyText,
        '<td id="td_2_1"><span id="span_2_1">2_1</span></td>',
        span_2_1_complexInsertionHtml
    );
});

test("List- top level li li_1", function () {
    expect(2);
    testPaste(
        '#li_1',
        nestedListHtml,
        complexCopyText,
        '<li id="li_1">1</li>',
        li_1_complexInsertionHtml
    );
});

test("List- 2nd level li li_2_2", function () {
    expect(2);
    testPaste(
        '#li_2_2',
        nestedListHtml,
        complexCopyText,
        '<li id="li_2_2">2_2</li>',
        li_2_2_complexInsertionHtml
    );
});

module("table-insertion", {setup: setupWym});

test("Table is editable after insertion", function () {
    expect(7);

    var wymeditor = jQuery.wymeditors(0),
        $body,
        dm;
    wymeditor._html('');

    $body = jQuery(wymeditor._doc).find('body.wym_iframe');
    wymeditor.insertTable(3, 2, '', '');

    $body.find('td').each(function (index, td) {
        deepEqual(isContentEditable(td), true);
    });

    dm = wymeditor._doc.designMode;
    ok(dm === 'on' || dm === 'On');
});

// Only FF >= 3.5 seems to require content in <td> for them to be editable
if (jQuery.browser.mozilla) {
    var table_3_2_html = String() +
            "<table><tbody>" +
                "<tr>" +
                    "<td></td>" +
                    "<td></td>" +
                "</tr>" +
                "<tr>" +
                    "<td></td>" +
                    "<td></td>" +
                "</tr>" +
                "<tr>" +
                    "<td></td>" +
                    "<td></td>" +
                "</tr>" +
            "</tbody></table>";
    test("Table cells are editable in FF > 3.5: table insert", function () {
        expect(12);

        var wymeditor = jQuery.wymeditors(0),
            $body;
        wymeditor._html('');

        $body = jQuery(wymeditor._doc).find('body.wym_iframe');
        wymeditor.insertTable(3, 2, '', '');

        $body.find('td').each(function (index, td) {
            if (parseInt(jQuery.browser.version, 10) === 1 &&
                jQuery.browser.version >= '1.9.1' && jQuery.browser.version < '2.0') {
                deepEqual(td.childNodes.length, 1);
            } else {
                deepEqual(td.childNodes.length, 0);
            }
            deepEqual(isContentEditable(td), true);
        });

    });

    test("Table cells are editable in FF > 3.5: _html() insert", function () {
        expect(12);

        var wymeditor = jQuery.wymeditors(0),
            $body = jQuery(wymeditor._doc).find('body.wym_iframe');

        wymeditor._html('');
        wymeditor._html(table_3_2_html);
        $body.find('td').each(function (index, td) {
            // Both FF 3.6 and 4.0 add spacer brs with design mode
            deepEqual(td.childNodes.length, 1);
            deepEqual(isContentEditable(td), true);
        });
    });
}

// Functions and html strings for table in list modules

/**
    setupTable
    ==========

    Puts the html in the body of the wymeditor and creates a rowsXcols-sized
    table at the selection (using the specified selectionType which can be
    'text','collapsed', or 'node'). The table's cells each have an id attribute
    of the form "t<table_id_character>_<x>_<y>" where <table_id_character> is
    the last character of the caption, <x> is the x-coordinate of the cell in
    the table, and <y> is the y-coordinate of the cell in the table. Each cell
    then has text of the form "<x>_<y>" where <x> and <y> are the same as
    described for the id attribute. Here is a small example:

    setupTable(wymeditor, html, selection, selectionType, 2, 1, 'test_1')
    inserts the following html at the selection:

        <table>
            <caption>test_1</caption>
            <tbody>
                <tr>
                    <td id="t1_1_1">1_1</td>
                </tr>
                <tr>
                    <td id="t1_2_1">2_1</td>
                </tr>
            </tbody>
        </table>
*/
function setupTable(wymeditor, html, selection, selectionType,
                    rows, cols, caption) {
    var $body,
        $element,
        $tableCells,
        i,
        j,
        selectionNum,
        stub,
        cellStr,
        idStr = 't' + caption.slice(-1);

    wymeditor._html(html);
    $body = jQuery(wymeditor._doc).find('body.wym_iframe');
    $element = $body.find(selection);

    if (selectionType === 'node') {
        // Force wymeditor.selection() to return the node as the selection
        stub = sinon.stub(wymeditor, 'selection');
        stub.returns({focusNode: $body.find(selection)[0]});
    } else {
        selectionNum = (selectionType === 'text') ? 1 : 0;
        makeTextSelection(wymeditor, $element, $element, 0, selectionNum);
    }

    wymeditor.insertTable(rows, cols, caption, '');
    $tableCells = $body.find('caption:contains(' + caption + ')')
                       .parent()
                       .find('td');

    for (i = 0; i < rows; i++) {
        for (j = 0; j < cols; j++) {
            cellStr = (i + 1) + '_' + (j + 1);
            $tableCells.eq(i + j)
                       .attr('id', idStr + '_' + cellStr)
                       .text(cellStr);
        }
    }

    if (selectionType === 'node') {
        // Restore the wymeditor.selection() function back to its original
        // functionality by removing the stub that was wrapped around it.
        stub.restore();
    }
}

var TEST_LINEBREAK_SPACER = '<br class="' +
                                WYMeditor.BLOCKING_ELEMENT_SPACER_CLASS + ' ' +
                                WYMeditor.EDITOR_ONLY_CLASS + '">';

var listForTableInsertion = String() +
    '<ol>' +
        '<li id="li_1">1</li>' +
        '<li id="li_2">2</li>' +
        '<li id="li_3">3</li>' +
    '</ol>';

var sublistForTableInsertion = String() +
    '<ol>' +
        '<li id="li_1">1' +
            '<ol>' +
                '<li id="li_2">2' +
                    '<ol>' +
                        '<li id="li_3">3</li>' +
                    '</ol>' +
                '</li>' +
            '</ol>' +
        '</li>' +
    '</ol>';

var expectedListOneTable = String() +
    '<ol>' +
        '<li id="li_1">1</li>' +
        '<li id="li_2">2</li>' +
        '<li id="li_3">3' +
            '<table>' +
                '<caption id="t1_cap">test_1</caption>' +
                '<thead>' +
                    '<tr>' +
                        '<th id="t1_h_1">h_1</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>' +
                    '<tr>' +
                        '<td id="t1_1_1">1_1</td>' +
                    '</tr>' +
                '</tbody>' +
            '</table>' +
            TEST_LINEBREAK_SPACER +
        '</li>' +
    '</ol>';

var expectedListTwoTables = String() +
    '<ol>' +
        '<li id="li_1">1</li>' +
        '<li id="li_2">2</li>' +
        '<li id="li_3">3' +
            '<table>' +
                '<caption id="t1_cap">test_1</caption>' +
                '<thead>' +
                    '<tr>' +
                        '<th id="t1_h_1">h_1</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>' +
                    '<tr>' +
                        '<td id="t1_1_1">1_1</td>' +
                    '</tr>' +
                '</tbody>' +
            '</table>' +
            TEST_LINEBREAK_SPACER +
            '<table>' +
                '<caption>test_2</caption>' +
                '<tbody>' +
                    '<tr>' +
                        '<td id="t2_1_1">1_1</td>' +
                    '</tr>' +
                '</tbody>' +
            '</table>' +
            TEST_LINEBREAK_SPACER +
        '</li>' +
    '</ol>';

var expectedSublistOneTable = String() +
    '<ol>' +
        '<li id="li_1">1' +
            '<ol>' +
                '<li id="li_2">2' +
                    '<table>' +
                        '<caption>test_1</caption>' +
                        '<tbody>' +
                            '<tr>' +
                                '<td id="t1_1_1">1_1</td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>' +
                    TEST_LINEBREAK_SPACER +
                    '<ol>' +
                        '<li id="li_3">3</li>' +
                    '</ol>' +
                '</li>' +
            '</ol>' +
        '</li>' +
    '</ol>';

var expectedSublistTwoTables = String() +
    '<ol>' +
        '<li id="li_1">1' +
            '<ol>' +
                '<li id="li_2">2' +
                    '<table>' +
                        '<caption>test_2</caption>' +
                        '<tbody>' +
                            '<tr>' +
                                '<td id="t2_1_1">1_1</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td id="t2_2_1">2_1</td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>' +
                    TEST_LINEBREAK_SPACER +
                    '<table>' +
                        '<caption>test_1</caption>' +
                        '<tbody>' +
                            '<tr>' +
                                '<td id="t1_1_1">1_1</td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>' +
                    TEST_LINEBREAK_SPACER +
                    '<ol>' +
                        '<li id="li_3">3</li>' +
                    '</ol>' +
                '</li>' +
            '</ol>' +
        '</li>' +
    '</ol>';

var expectedSublistThreeTables = String() +
    '<ol>' +
        '<li id="li_1">1' +
            '<ol>' +
                '<li id="li_2">2' +
                    '<table>' +
                        '<caption>test_3</caption>' +
                        '<tbody>' +
                            '<tr>' +
                                '<td id="t3_1_1">1_1</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td id="t3_2_1">2_1</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td id="t3_3_1">3_1</td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>' +
                    TEST_LINEBREAK_SPACER +
                    '<table>' +
                        '<caption>test_2</caption>' +
                        '<tbody>' +
                            '<tr>' +
                                '<td id="t2_1_1">1_1</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td id="t2_2_1">2_1</td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>' +
                    TEST_LINEBREAK_SPACER +
                    '<table>' +
                        '<caption>test_1</caption>' +
                        '<tbody>' +
                            '<tr>' +
                                '<td id="t1_1_1">1_1</td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>' +
                    TEST_LINEBREAK_SPACER +
                    '<ol>' +
                        '<li id="li_3">3</li>' +
                    '</ol>' +
                '</li>' +
            '</ol>' +
        '</li>' +
    '</ol>';

var sublistThreeTablesNoBR =
        expectedSublistThreeTables.replace(
            new RegExp(TEST_LINEBREAK_SPACER, 'g'), '');

var expectedMiddleOutFull = String() +
    '<ol>' +
        '<li id="li_1">1</li>' +
        '<li id="li_2">2' +
            '<table>' +
                '<caption>test_1</caption>' +
                '<tbody>' +
                    '<tr>' +
                        '<td id="t1_1_1">1_1</td>' +
                    '</tr>' +
                '</tbody>' +
            '</table>' +
            TEST_LINEBREAK_SPACER +
        '</li>' +
        '<li id="li_3">3</li>' +
    '</ol>';

var expectedEndOut = String() +
        '<ol>' +
            '<li id="li_1">1</li>' +
            '<li id="li_2">2</li>' +
            '<li id="li_3">3' +
                '<table>' +
                    '<caption>test_1</caption>' +
                    '<tbody>' +
                        '<tr>' +
                            '<td id="t1_1_1">1_1</td>' +
                        '</tr>' +
                    '</tbody>' +
                '</table>' +
                TEST_LINEBREAK_SPACER +
            '</li>' +
        '</ol>';

var expectedEndIn = String() +
    '<ol>' +
        '<li id="li_1">1</li>' +
        '<li id="li_2">2' +
            '<ol>' +
                '<li id="li_3">3' +
                    '<table>' +
                        '<caption>test_1</caption>' +
                        '<tbody>' +
                            '<tr>' +
                                '<td id="t1_1_1">1_1</td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>' +
                    TEST_LINEBREAK_SPACER +
                '</li>' +
            '</ol>' +
        '</li>' +
    '</ol>';

var expectedEndOut = String() +
        '<ol>' +
            '<li id="li_1">1</li>' +
            '<li id="li_2">2</li>' +
            '<li id="li_3">3' +
                '<table>' +
                    '<caption>test_1</caption>' +
                    '<tbody>' +
                        '<tr>' +
                            '<td id="t1_1_1">1_1</td>' +
                        '</tr>' +
                    '</tbody>' +
                '</table>' +
                TEST_LINEBREAK_SPACER +
            '</li>' +
        '</ol>';

var startEndInNoBR = expectedEndIn.replace(TEST_LINEBREAK_SPACER, '');

var startEndOutNoBR = expectedEndOut.replace(TEST_LINEBREAK_SPACER, '');

module("table-insert_in_list", {setup: setupWym});

test("Table insertion in the middle of a list with text selection", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0);

    setupTable(wymeditor, listForTableInsertion, '#li_2', 'text',
               1, 1, 'test_1');
    domEquals(wymeditor, expectedMiddleOutFull);
});

test("Table insertion at the end of a list with text selection", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0);

    setupTable(
        wymeditor, listForTableInsertion, '#li_3', 'text', 1, 1, 'test_1');
    domEquals(wymeditor, expectedEndOut);
});

test("Table insertion in the middle of a list with collapsed selection", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0);

    setupTable(wymeditor, listForTableInsertion, '#li_2', 'collapsed',
               1, 1, 'test_1');
    domEquals(wymeditor, expectedMiddleOutFull);
});

test("Table insertion at the end of a list with collapsed selection", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0);

    setupTable(wymeditor, listForTableInsertion, '#li_3', 'collapsed',
               1, 1, 'test_1');
    domEquals(wymeditor, expectedEndOut);
});

// This test mimics the behavior that caused issue #406 which would
// unexpectedly nest an inserted table into another table within a list.
test("Table insertion with selection inside another table in a list", function () {
    expect(3);
    var wymeditor = jQuery.wymeditors(0);

    // Try insert in td element
    setupTable(wymeditor, expectedListOneTable, '#t1_1_1', 'collapsed',
               1, 1, 'test_2');
    domEquals(wymeditor, expectedListTwoTables);

    // Try insert in th element
    setupTable(wymeditor, expectedListOneTable, '#t1_h_1', 'collapsed',
               1, 1, 'test_2');
    domEquals(wymeditor, expectedListTwoTables);

    // Try insert in caption element
    setupTable(wymeditor, expectedListOneTable, '#t1_cap', 'collapsed',
               1, 1, 'test_2');
    domEquals(wymeditor, expectedListTwoTables);
});

test("Table insertion with direct selection of list item node", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0);

    setupTable(wymeditor, expectedListOneTable, '#li_3', 'node',
               1, 1, 'test_2');
    domEquals(wymeditor, expectedListTwoTables);
});

module("table-insert_in_sublist", {setup: setupWym});

test("Single table insertion into a sublist", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0);

    setupTable(wymeditor, sublistForTableInsertion, '#li_2', 'text',
               1, 1, 'test_1');
    domEquals(wymeditor, expectedSublistOneTable);
});

test("Double table insertion into a sublist", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0);

    setupTable(wymeditor, expectedSublistOneTable, '#li_2', 'text',
               2, 1, 'test_2');
    domEquals(wymeditor, expectedSublistTwoTables);
});

test("Triple table insertion into a sublist", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0);

    setupTable(wymeditor, expectedSublistTwoTables, '#li_2', 'text',
               3, 1, 'test_3');
    domEquals(wymeditor, expectedSublistThreeTables);
});

module("table-parse_spacers_in_list", {setup: setupWym});
// The tests in this module use the htmlEquals function from utils.js to parse
// the resulting html from tables being inserted into a list or sublist using
// the parser to ensure that the line break spacers are properly removed.

test("Parse list with a table at the end", function () {
    var wymeditor = jQuery.wymeditors(0);

    wymeditor._html(expectedEndOut);
    htmlEquals(wymeditor, startEndOutNoBR);
});

test("Parse list with a table at the end in a sublist", function () {
    var wymeditor = jQuery.wymeditors(0);

    wymeditor._html(expectedEndIn);
    htmlEquals(wymeditor, startEndInNoBR);
});

test("Parse list with multiple tables in a sublist", function () {
    var wymeditor = jQuery.wymeditors(0);

    wymeditor._html(expectedSublistThreeTables);
    htmlEquals(wymeditor, sublistThreeTablesNoBR);
});

module("table-td_th_switching", {setup: setupWym});

var tableWithColspanTD = String() +
    '<table>' +
        '<caption>test_1</caption>' +
        '<tbody>' +
            '<tr>' +
                '<td colspan="2">1</td>' +
            '</tr>' +
            '<tr>' +
                '<td>2_1</td>' +
                '<td>2_2</td>' +
            '</tr>' +
        '</tbody>' +
    '</table>';

var tableWithColspanTH = String() +
    '<table>' +
        '<caption>test_1</caption>' +
        '<tbody>' +
            '<tr>' +
                '<th colspan="2">1</th>' +
            '</tr>' +
            '<tr>' +
                '<td>2_1</td>' +
                '<td>2_2</td>' +
            '</tr>' +
        '</tbody>' +
    '</table>';

test("Colspan preserved when switching from td to th", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $thContainerLink = jQuery(wymeditor._box)
            .find(wymeditor._options.containersSelector + ' a[name="TH"]'),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        $tableCell;

    wymeditor._html(tableWithColspanTD);
    $tableCell = $body.find('td[colspan="2"]');
    makeTextSelection(wymeditor, $tableCell[0], $tableCell[0], 0, 1);

    // Click "Table Header" option in the containers panel
    $thContainerLink.trigger('click');
    htmlEquals(wymeditor, tableWithColspanTH);
});

test("Colspan preserved when switching from th to td", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $thContainerLink = jQuery(wymeditor._box)
            .find(wymeditor._options.containersSelector + ' a[name="TH"]'),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        $tableCell;

    wymeditor._html(tableWithColspanTH);
    $tableCell = $body.find('th[colspan="2"]');
    makeTextSelection(wymeditor, $tableCell[0], $tableCell[0], 0, 1);

    // Click "Table Header" option in the containers panel
    $thContainerLink.trigger('click');
    htmlEquals(wymeditor, tableWithColspanTD);
});

module("preformatted-text", {setup: setupWym});

test("Preformatted text retains spacing", function () {
    var wymeditor = jQuery.wymeditors(0),
        preHtml = String() +
            '<pre>pre1\r\n' +
            'spaced\r\n\r\n' +
            'double  spaced' +
            '</pre>';

    // Only older IE versions and unsupported old firefox use \r\n newlines
    if (!(jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 9.0)) {
        preHtml = preHtml.replace(/\r/g, '');
    }

    wymeditor._html(preHtml);

    expect(1);
    deepEqual(wymeditor.xhtml(), preHtml);
});

module("soft-return", {setup: setupWym});

test("Double soft returns are allowed", function () {
    var initHtml = String() +
            '<ul>' +
                '<li>li_1<br /><br />stuff</li>' +
            '</ul>',
        wymeditor = jQuery.wymeditors(0);
    wymeditor._html(initHtml);

    wymeditor.fixBodyHtml();

    expect(1);
    htmlEquals(wymeditor, initHtml);
});

module("image-styling", {setup: setupWym});

test("_selected image is saved on mousedown", function () {
    var initHtml = [""
        , '<p id="noimage">Images? We dont need no stinkin images</p>'
        , '<p>'
            , '<img id="google" src="http://www.google.com/intl/en_com/images/srpr/logo3w.png" />'
        , '</p>'
        ].join(''),
        wymeditor = jQuery.wymeditors(0),
        $body,
        $noimage,
        $google;

    expect(3);

    wymeditor._html(initHtml);
    $body = jQuery(wymeditor._doc).find('body.wym_iframe');

    // Editor starts with no selected image. Use equal instead of deepEqual
    // because wymeditor._selectedImage intermittently changes between being
    // undefined and null, but either value should be acceptable for this test.
    equal(wymeditor._selectedImage, undefined);

    // Clicking on a non-image doesn't change that
    $noimage = $body.find('#noimage');
    $noimage.mousedown();
    deepEqual(wymeditor._selectedImage, null);


    // Clicking an image does update the selected image
    $google = $body.find('#google');
    $google.mousedown();
    deepEqual(wymeditor._selectedImage, $google[0]);
});

// The following test doesn't work in Phantom.js because the `InsertImage`
// command for the browser execCommand function would not insert an image into
// the editor in Phantom.js. This test still works fine in all other supported
// browsers.
if (!inPhantomjs || !SKIP_KNOWN_FAILING_TESTS) {
    module("image-insertion", {setup: setupWym});

    test("Image insertion outside of a container", function () {
        expect(3);
        var wymeditor = jQuery.wymeditors(0),
            $body = jQuery(wymeditor._doc).find('body.wym_iframe'),

            imageURL = 'http://www.google.com/intl/en_com/images/srpr/logo3w.png',
            imageStamp = wymeditor.uniqueStamp(),
            imageSelector = 'img[src$="' + imageStamp + '"]',

            expectedHtml = String() +
                '<p>' +
                    '<img src="' + imageURL + '"/>' +
                '</p>',
            expectedHtmlIE = expectedHtml.replace(/<\/?p>/g, '');

        // Mimic the way images are inserted by the insert image tool by first
        // inserting the image with its src set to a unique stamp for
        // identification rather than its actual src.
        wymeditor._html('');
        wymeditor._exec(WYMeditor.INSERT_IMAGE, imageStamp);

        ok(!$body.siblings(imageSelector).length,
           "Image is not a sibling of the wymeditor body");
        ok(!$body.siblings().children(imageSelector).length,
           "Image is not a child of a sibling of the wymeditor body");

        $body.find(imageSelector).attr(WYMeditor.SRC, imageURL);
        if (jQuery.browser.msie) {
            // IE doesn't wrap the image in a paragraph
            htmlEquals(wymeditor, expectedHtmlIE);
        } else {
            htmlEquals(wymeditor, expectedHtml);
        }
    });
}

module("header-no_span", {setup: setupWym});

/**
    checkTagInContainer
    ===================

    Checks if using the given command on a container of type containerType in
    wymeditor creates a tagName element within the container. Returns true if a
    tagName element was created within the container, and returns false if no
    tagName element was created within the container.
*/
function checkTagInContainer(wymeditor, containerType, tagName, command) {
    var $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        $container,

        initHtml = String() +
        '<' + containerType + '>' +
            'Test' +
        '</' + containerType + '>';

    wymeditor._html(initHtml);
    $container = $body.find(containerType);
    makeTextSelection(wymeditor, $container, $container, 0, 4);

    wymeditor.exec(command);
    return $container.find(tagName).length;
}

test("No span added to header after bolding", function () {
    expect(6);
    var wymeditor = jQuery.wymeditors(0),
        header,
        i;

    for (i = 1; i < 7; i++) {
        header = 'h' + i;
        ok(!checkTagInContainer(wymeditor, header, 'span', 'Bold'),
           "No span added to " + header + " on bold");
    }
});


module("html_from_editor-html_function", {setup: setupWym});

test("Can set and get html with the html() function", function () {
    var wymeditor = jQuery.wymeditors(0),
        testHtml = "<p>Test</p>",
        stub;

    // Disable console warnings so that the deprecation warning added in issue
    // #364 isn't displayed. This warning is not necessary because this test is
    // explicitly trying to test that the deprecated function still works, so
    // it should not make the user think that the test is malfunctioning by
    // outputting a console warning.
    if (typeof WYMeditor.console.warn === 'function') {
        stub = sinon.stub(WYMeditor.console, "warn", function () {});
    }

    wymeditor.html(testHtml);
    if (stub) { stub.restore(); }
    domEquals(wymeditor, testHtml,
              "Set and get with html() function");
});

module("helper_functions", {setup: setupWym});

test("multi-line strings with `multiline`", function () {
    expect(2);
    var multilineString,
        multilineIndentedString,
        expected = [""
            , 'Hi, Wes!\n'
            , 'Great news!\n'
            , '`multiline` is the new `.join()`!'
        ].join('');

    multilineString = multiline(function () {/*
Hi, Wes!
Great news!
`multiline` is the new `.join()`!
*/
    });

    strictEqual(multilineString, expected,
        'Muti-line string created.'
    );

    multilineIndentedString = multiline(function () {/*
        Hi, Wes!
        Great news!
        `multiline` is the new `.join()`!
        */
    });

    strictEqual(multilineIndentedString, expected,
        'Multi-line Indented string created.'
    );
});
