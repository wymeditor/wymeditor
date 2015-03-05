/* jshint camelcase: false, maxlen: 100 */
/* global -$,
    ok,
    start,
    test,
    QUnit,
    expectMore,
    deepEqual,
    sinon,
    strictEqual,
    wymEqual,
    moveSelector,
    makeTextSelection,
    isContentEditable,
    normalizeHtml,
    asyncTest,
    SKIP_THIS_TEST,
    manipulationTestHelper,
    inPhantomjs,
    prepareUnitTestModule,
    vanishAllWyms,
    IMG_SRC,
    QUnit,
    allWymIframesInitialized
*/
/* exported
    no_br_selection_browser
*/
"use strict";

// We need to be able to operate in a noConflict context. Doing this during our
// tests ensures that remains the case.
jQuery.noConflict();

// `sinon-qunit` sets this to true. We require the real `setTimeout` because
// we test things that have to do with the browser's DOM API. Removing this
// or setting it to `true` will almost certainly cause all tests of
// asynchronous things to fail or the test runner to stop and not continue.
sinon.config.useFakeTimers = false;

// Whether or not we want to skip the tests that are known to be failing.
// Ideally, there would be no tests in this category, but right now there are
// a lot of table-related bugs that need to be fixed that aren't the number
// one priority. Having a test suite with failing tests is a bad thing though,
// because new contributors don't know which tests are "supposed to be
// failing." That lack of knowing makes the test suite much less useful than a
// test suite that should always be passing in all supported browsers.
var SKIP_KNOWN_FAILING_TESTS = true,
    // Can't move the selection to a <br /> element
    no_br_selection_browser = jQuery.browser.webkit ||
        WYMeditor.isInternetExplorerPre11();

module("Core", {setup: prepareUnitTestModule});

test("Instantiate", function () {
    QUnit.expect(2);
    deepEqual(WYMeditor.INSTANCES.length, 1, "WYMeditor.INSTANCES length");
    deepEqual(typeof jQuery.wymeditors(0), 'object',
              "Type of first WYMeditor instance, using jQuery.wymeditors(0)");
});

test("Empty document is a single `br`.", function () {
    manipulationTestHelper({
        startHtml: "",
        prepareFunc: function (wymeditor) {
            wymeditor.prepareDocForEditing();
        },
        expectedStartHtml: "<br />",
        expectedResultHtml: "<br />"
    });
});

test("Focusing on document that has designMode off, turns it on", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            wymeditor._doc.designMode = "Off";
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.$body().focus();
        },
        expectedResultHtml: "<p>Foo</p>",
        skipFunc: function () {
            if (
                // In IE <= 10 after turning off `designMode` the document has no
                // `body`.
                jQuery.browser.msie &&
                jQuery.browser.versionNumber <= 10
            ) {
                return SKIP_THIS_TEST;
            }
        }
    });
});

test("WebKit's shift+enter inserts a line break and prevents default " +
    "action", function () {
    if (!jQuery.browser.webkit) {
        QUnit.expect(0);
        return;
    }

    var thisTest = this,
        wymeditor = jQuery.wymeditors(0),
        enterCallBacks = wymeditor.keyboard.combokeys.callbacks.enter,
        spy;

    // Wrap the shift+enter handler with a spy
    enterCallBacks.forEach(function (cb) {
        if (cb.combo === "shift+enter") {
            spy = thisTest.spy(cb, "callback");
        }
    });

    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            var p = wymeditor.body().childNodes[0];
            makeTextSelection(
                wymeditor,
                p,
                p,
                2,
                2
            );
        },
        manipulationKeyCombo: "shift+enter",
        expectedResultHtml: "<p>Fo<br />o</p>",
        additionalAssertionsFunc: function () {
            expectMore(2);
            ok(
                spy.calledOnce,
                "Callback was called"
            );
            strictEqual(
                spy.returned(),
                false,
                "Callback returned false, preventing default action"
            );
        }
    });
});

module("API", {setup: prepareUnitTestModule});

test("Commands", function () {
    QUnit.expect(2);
    var wymeditor = jQuery.wymeditors(0);

    wymeditor.toggleHtml();
    deepEqual(jQuery('div.wym_html:visible', wymeditor._box).length, 1);
    wymeditor.toggleHtml();
    deepEqual(jQuery('div.wym_html:visible', wymeditor._box).length, 0);
});

module("XmlHelper", {setup: prepareUnitTestModule});

test("Should escape URL's only once #69.1", function () {
    QUnit.expect(2);
    var original = "index.php?module=x&func=view&id=1",
        expected = "index.php?module=x&amp;func=view&amp;id=1";
    deepEqual(jQuery.wymeditors(0).helper.escapeOnce(original), expected,
            "Escape entities");
    deepEqual(jQuery.wymeditors(0).helper.escapeOnce(expected), expected,
            "Avoids double entity escaping");
});

module("Post Init", {setup: prepareUnitTestModule});

test("Sanity check: rawHtml()", function () {
    QUnit.expect(1);
    var testText1 = '<p>This is some text with which to test.<\/p>',
        wymeditor = jQuery.wymeditors(0);

    wymeditor.rawHtml(testText1);
    wymEqual(wymeditor, testText1);
});

module("copy-paste", {setup: prepareUnitTestModule});

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

var complexCopyText = String() +
        'sentence\r\n' +
        'sentence2\r\n' +
        '1.list1\r\n' +
        '2.list2\r\n' +
        '3.list3\r\n' +
        'sentence3\r\n\r\n' +
        'gap\r\n\r\n' +
        'gap2';
//if (jQuery.browser !== 'msie') {
    // This was always true so commented out. Probably a human error.
complexCopyText = complexCopyText.replace(/\r/g, '');
//}

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
        '</p>' +
        '<br />';

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
    wymeditor.rawHtml(startHtml);

    // Escape slashes for the regexp
    elmntRegex = new RegExp(elmntStartHtml.replace('/', '\\/'), 'g');
    expectedHtml = startHtml.replace(
        elmntRegex,
        elmntExpectedHtml
    );

    $body = wymeditor.$body();

    wymeditor._doc.body.focus();
    if (pasteStartSelector === '') {
        // Attempting to select the body
        moveSelector(wymeditor, $body[0]);
    } else {
        startElmnt = $body.find(pasteStartSelector).get(0);
        endElmnt = $body.find(pasteEndSelector).get(0);
        makeTextSelection(
            wymeditor, startElmnt, endElmnt, pasteStartIndex, pasteEndIndex);
        deepEqual(wymeditor.selectedContainer(), startElmnt, "moveSelector");
    }
    wymeditor.paste(textToPaste);

    wymEqual(wymeditor, expectedHtml);
}

test("Body- Direct Paste", function () {
    QUnit.expect(1);
    testPaste(
        '', // No selector. Just the body
        '<br />', // An empty document to start
        complexCopyText,
        '<br />', // Replace everything with our expected HTML
        body_complexInsertionHtml
    );
});

test("Paragraphs- Inside h2_1", function () {
    QUnit.expect(2);
    testPaste(
        '#h2_1',
        basicParagraphsHtml,
        complexCopyText,
        '<h2 id="h2_1">h2_1</h2>',
        h2_1_complexInsertionHtml
    );
});

test("Paragraphs- Inside middle of h2_1", function () {
    QUnit.expect(2);
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
    QUnit.expect(2);
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
    QUnit.expect(2);
    testPaste(
        '#p_2',
        basicParagraphsHtml,
        complexCopyText,
        '<p id="p_2"></p>',
        p_2_complexInsertionHtml
    );
});

test("Table- simple row td_1_1", function () {
    QUnit.expect(2);
    testPaste(
        '#td_1_1',
        basicTableHtml,
        complexCopyText,
        '<td id="td_1_1">1_1</td>',
        td_1_1_complexInsertionHtml
    );
});

test("Table- inside a span span_2_1", function () {
    QUnit.expect(2);
    testPaste(
        '#span_2_1',
        basicTableHtml,
        complexCopyText,
        '<td id="td_2_1"><span id="span_2_1">2_1</span></td>',
        span_2_1_complexInsertionHtml
    );
});

test("List- top level li li_1", function () {
    QUnit.expect(2);
    testPaste(
        '#li_1',
        nestedListHtml,
        complexCopyText,
        '<li id="li_1">1</li>',
        li_1_complexInsertionHtml
    );
});

test("List- 2nd level li li_2_2", function () {
    QUnit.expect(2);
    testPaste(
        '#li_2_2',
        nestedListHtml,
        complexCopyText,
        '<li id="li_2_2">2_2</li>',
        li_2_2_complexInsertionHtml
    );
});

module("table-insertion", {setup: prepareUnitTestModule});

test("Table is editable after insertion", function () {
    manipulationTestHelper({
        startHtml: "<br />",
        prepareFunc: function (wymeditor) {
            wymeditor.setCaretIn(wymeditor.body());
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.insertTable(3, 2, "", "");
        },
        expectedResultHtml: [""
            , "<br />"
            , "<table>"
                , "<caption></caption>"
                , "<tbody>"
                    , "<tr><td></td><td></td></tr>"
                    , "<tr><td></td><td></td></tr>"
                    , "<tr><td></td><td></td></tr>"
                , "</tbody>"
            , "</table>"
            , "<br class=\"wym-blocking-element-spacer wym-editor-only\" />"
        ].join(""),
        additionalAssertionsFunc: function (wymeditor) {
            var $tds = wymeditor.$body().find("td");
            expectMore($tds.length + 1);
            $tds.each(function (index, td) {
                strictEqual(isContentEditable(td), true);
            });
            strictEqual(wymeditor._isDesignModeOn(), true);
        },
        skipFunc: function () {
            // This fails in PhantomJS and we don't care.
            if (inPhantomjs) {
                return SKIP_THIS_TEST;
            }
        }
    });
});

// Only FF >= 3.5 seems to require content in <td> for them to be editable
if (
    jQuery.browser.mozilla &&
    inPhantomjs !== true
) {
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
        QUnit.expect(12);

        var wymeditor = jQuery.wymeditors(0),
            $body;
        wymeditor.rawHtml('');

        $body = wymeditor.$body();
        wymeditor.insertTable(3, 2, '', '');

        $body.find('td').each(function (index, td) {
            strictEqual(td.childNodes.length, 0);
            strictEqual(isContentEditable(td), true);
        });

    });

    test("Table cells are editable in FF > 3.5: rawHtml() insert", function () {
        QUnit.expect(6);

        var wymeditor = jQuery.wymeditors(0),
            $body = wymeditor.$body();

        wymeditor.rawHtml('');
        wymeditor.rawHtml(table_3_2_html);
        $body.find('td').each(function (index, td) {
            strictEqual(isContentEditable(td), true);
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

    wymeditor.rawHtml(html);
    $body = wymeditor.$body();
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
                                WYMeditor.EDITOR_ONLY_CLASS + '" />';

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

module("table-insert_in_list", {setup: prepareUnitTestModule});

// These test fail in IE8:
// TODO url
if (jQuery.browser.msie && jQuery.browser.versionNumber === 8 &&
    !SKIP_KNOWN_FAILING_TESTS) {
    test("Table insertion in the middle of a list with text selection", function () {
        QUnit.expect(1);
        var wymeditor = jQuery.wymeditors(0);

        setupTable(wymeditor, listForTableInsertion, '#li_2', 'text',
                   1, 1, 'test_1');
        wymEqual(wymeditor, expectedMiddleOutFull, {
            assertionString: "Table insertion in the middle of a list with text selection"
        });
    });

    test("Table insertion at the end of a list with text selection", function () {
        QUnit.expect(1);
        var wymeditor = jQuery.wymeditors(0);

        setupTable(
            wymeditor, listForTableInsertion, '#li_3', 'text', 1, 1, 'test_1');
        wymEqual(wymeditor, expectedEndOut, {
                assertionString: "Table insertion at the end of a list with text selection"
            });
    });

    test("Table insertion in the middle of a list with collapsed selection", function () {
        QUnit.expect(1);
        var wymeditor = jQuery.wymeditors(0);

        setupTable(wymeditor, listForTableInsertion, '#li_2', 'collapsed',
                   1, 1, 'test_1');
        wymEqual(wymeditor, expectedMiddleOutFull, {
            assertionString: "Table insertion in the middle of a list with collapsed selection"
        });
    });

    test("Table insertion at the end of a list with collapsed selection", function () {
        QUnit.expect(1);
        var wymeditor = jQuery.wymeditors(0);

        setupTable(wymeditor, listForTableInsertion, '#li_3', 'collapsed',
                   1, 1, 'test_1');
        wymEqual(wymeditor, expectedEndOut, {
            assertionString: "Table insertion at the end of a list with collapsed selection"
        });
    });

    // This test mimics the behavior that caused issue #406 which would
    // unexpectedly nest an inserted table into another table within a list.
    test("Table insertion with selection inside another table in a list", function () {
        QUnit.expect(3);
        var wymeditor = jQuery.wymeditors(0);

        // Try insert in td element
        setupTable(wymeditor, expectedListOneTable, '#t1_1_1', 'collapsed',
                   1, 1, 'test_2');
        wymEqual(wymeditor, expectedListTwoTables, {
            assertionString: "Table insertion with selection inside a td element in a list"
        });

        // Try insert in th element
        setupTable(wymeditor, expectedListOneTable, '#t1_h_1', 'collapsed',
                   1, 1, 'test_2');
        wymEqual(wymeditor, expectedListTwoTables, {
            assertionString: "Table insertion with selection inside a th element in a list"
        });

        // Try insert in caption element
        setupTable(wymeditor, expectedListOneTable, '#t1_cap', 'collapsed',
                   1, 1, 'test_2');
        wymEqual(wymeditor, expectedListTwoTables, {
            assertionString: "Table insertion with selection inside a caption element " +
               "in a list"
        });
    });

    test("Table insertion with direct selection of list item node", function () {
        QUnit.expect(1);
        var wymeditor = jQuery.wymeditors(0);

        setupTable(wymeditor, expectedListOneTable, '#li_3', 'node',
                   1, 1, 'test_2');
        wymEqual(wymeditor, expectedListTwoTables, {
            assertionString: "Table insertion with direct selection of list item node"
        });
    });
}

module("table-insert_in_sublist", {setup: prepareUnitTestModule});

test("Single table insertion into a sublist", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0);

    setupTable(wymeditor, sublistForTableInsertion, '#li_2', 'text',
               1, 1, 'test_1');
    wymEqual(wymeditor, expectedSublistOneTable, {
        assertionString: "Single table insertion within a sublist"
    });
});

test("Double table insertion into a sublist", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0);

    setupTable(wymeditor, expectedSublistOneTable, '#li_2', 'text',
               2, 1, 'test_2');
    wymEqual(wymeditor, expectedSublistTwoTables, {
        assertionString: "Double table insertion within a sublist"
    });
});

test("Triple table insertion into a sublist", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0);

    setupTable(wymeditor, expectedSublistTwoTables, '#li_2', 'text',
               3, 1, 'test_3');
    wymEqual(wymeditor, expectedSublistThreeTables, {
        assertionString: "Triple table insertion within a sublist"
    });
});

module("table-parse_spacers_in_list", {setup: prepareUnitTestModule});
// The tests in this module use the wymEqual function from utils.js to parse
// the resulting html from tables being inserted into a list or sublist using
// the parser to ensure that the line break spacers are properly removed.

test("Parse list with a table at the end", function () {
    var wymeditor = jQuery.wymeditors(0);

    wymeditor.rawHtml(expectedEndOut);
    wymEqual(wymeditor, startEndOutNoBR, {parseHtml: true});
});

test("Parse list with a table at the end in a sublist", function () {
    var wymeditor = jQuery.wymeditors(0);

    wymeditor.rawHtml(expectedEndIn);
    wymEqual(wymeditor, startEndInNoBR, {parseHtml: true});
});

test("Parse list with multiple tables in a sublist", function () {
    var wymeditor = jQuery.wymeditors(0);

    wymeditor.rawHtml(expectedSublistThreeTables);
    wymEqual(wymeditor, sublistThreeTablesNoBR, {parseHtml: true});
});

module("table-td_th_switching", {setup: prepareUnitTestModule});

var tableWithColspanTD = String() +
    '<br class="wym-blocking-element-spacer wym-editor-only" />' +
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
    '</table>' +
    '<br class="wym-blocking-element-spacer wym-editor-only" />';

var tableWithColspanTH = String() +
    '<br class="wym-blocking-element-spacer wym-editor-only" />' +
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
    '</table>' +
    '<br class="wym-blocking-element-spacer wym-editor-only" />';

test("Colspan preserved when switching from td to th", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $thContainerLink = jQuery(wymeditor._box)
            .find(wymeditor._options.containersSelector + ' a[name="TH"]'),
        $body = wymeditor.$body(),
        $tableCell;

    wymeditor.rawHtml(tableWithColspanTD);
    $tableCell = $body.find('td[colspan="2"]');
    makeTextSelection(wymeditor, $tableCell[0], $tableCell[0], 0, 1);

    // Click "Table Header" option in the containers panel
    $thContainerLink.trigger('click');
    wymEqual(wymeditor, tableWithColspanTH);
});

test("Colspan preserved when switching from th to td", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $thContainerLink = jQuery(wymeditor._box)
            .find(wymeditor._options.containersSelector + ' a[name="TH"]'),
        $body = wymeditor.$body(),
        $tableCell;

    wymeditor.rawHtml(tableWithColspanTH);
    $tableCell = $body.find('th[colspan="2"]');
    makeTextSelection(wymeditor, $tableCell[0], $tableCell[0], 0, 1);

    // Click "Table Header" option in the containers panel
    $thContainerLink.trigger('click');
    wymEqual(wymeditor, tableWithColspanTD);
});

module("preformatted-text", {setup: prepareUnitTestModule});

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

    wymeditor.rawHtml(preHtml);

    QUnit.expect(1);
    deepEqual(wymeditor.html(), preHtml);
});

module("soft-return", {setup: prepareUnitTestModule});

test("Double soft returns are allowed", function () {
    var initHtml = String() +
            '<ul>' +
                '<li>li_1<br /><br />stuff</li>' +
            '</ul>',
        wymeditor = jQuery.wymeditors(0);
    wymeditor.rawHtml(initHtml);

    wymeditor.prepareDocForEditing();

    QUnit.expect(1);
    wymEqual(wymeditor, initHtml);
});

module("header-no_span", {setup: prepareUnitTestModule});

/**
    checkTagInContainer
    ===================

    Checks if using the given command on a container of type containerType in
    wymeditor creates a tagName element within the container. Returns true if a
    tagName element was created within the container, and returns false if no
    tagName element was created within the container.
*/
function checkTagInContainer(wymeditor, containerType, tagName, command) {
    var $body = wymeditor.$body(),
        $container,

        initHtml = String() +
        '<' + containerType + '>' +
            'Test' +
        '</' + containerType + '>';

    wymeditor.rawHtml(initHtml);
    $container = $body.find(containerType);
    makeTextSelection(wymeditor, $container, $container, 0, 4);

    wymeditor.exec(command);
    return $container.find(tagName).length;
}

test("No span added to header after bolding", function () {
    QUnit.expect(6);
    var wymeditor = jQuery.wymeditors(0),
        header,
        i;

    for (i = 1; i < 7; i++) {
        header = 'h' + i;
        ok(!checkTagInContainer(wymeditor, header, 'span', 'Bold'),
           "No span added to " + header + " on bold");
    }
});


module("html_from_editor-html_function", {setup: prepareUnitTestModule});

test("Can set and get html with the html() function", function () {
    var wymeditor = jQuery.wymeditors(0),
        testHtml = "<p>Test</p>",
        stub,
        htmlNode;

    // Disable console warnings so that the deprecation warning added in issue
    // #364 isn't displayed. This warning is not necessary because this test is
    // explicitly trying to test that the deprecated function still works, so
    // it should not make the user think that the test is malfunctioning by
    // outputting a console warning.
    if (typeof WYMeditor.console.warn === 'function') {
        stub = sinon.stub(WYMeditor.console, "warn", function () {});
    }

    wymeditor.html(testHtml);
    htmlNode = jQuery(wymeditor.html(), wymeditor._doc);
    if (stub) { stub.restore(); }
    deepEqual(normalizeHtml(htmlNode[0]), testHtml,
              "Set and get with html() function");
});

module("switchTo", {setup: prepareUnitTestModule});

test("Refuses 'img' elements.", function () {
    var
        wymeditor = jQuery.wymeditors(0),

        html = '<p><img alt="" src="' + IMG_SRC + '" /></p>';

    wymeditor.rawHtml(html);

    try {
        // `.switchTo` on the `img`.
        wymeditor.switchTo(
            wymeditor.$body().find('img')[0],
            'span'
        );
    }
    catch (err) {
        strictEqual(
            err,
            "Will not change the type of an 'img' element."
        );
    }

});

var MULTIPLE_INSTANCES_AMOUNT = 3;
module(
    "multiple-instances",
    {
        setup: function () {
            prepareUnitTestModule({
                editorCount: MULTIPLE_INSTANCES_AMOUNT,
                initialized: false
            });
        },
        teardown: vanishAllWyms
    }
);

test("We have multiple instances", function () {
    QUnit.expect(2);
    jQuery('#wym-form > .wym').wymeditor();
    strictEqual(
        WYMeditor.INSTANCES.length,
        MULTIPLE_INSTANCES_AMOUNT,
        "Instances"
    );
    strictEqual(
        jQuery('#wym-form > .wym_box').length,
        MULTIPLE_INSTANCES_AMOUNT,
        "Boxes"
    );

});

asyncTest("Load textarea value by default", function () {
    var $textareas = jQuery('#wym-form > textarea.wym'),
        assertAndStart,
        i;

    QUnit.expect($textareas.length);

    // This function is here so as to not create functions within a loop.
    assertAndStart = function (wym) {
        wymEqual(
            wym,
            // The index is the same as the textarea's index because it gets
            // determined in the synchronous stage of the editor's
            // initialization.
            '<p>textarea ' + wym._index + '</p>'
        );
        if (allWymIframesInitialized()) {
            start();
        }
    };

    for (i = 0; i < $textareas.length; i++) {
        $textareas.eq(i).val('<p>textarea ' + i + '</p>');
        $textareas.eq(i).wymeditor({postInit: assertAndStart});
    }
});

asyncTest("Prefer explicit initial html option over textarea value", function () {
    var $textareas = jQuery('#wym-form > textarea.wym'),
        assertAndStart,
        i,
        initHtml = '<p>foo</p>';

    QUnit.expect($textareas.length);

    // This function is here so as to not create functions within a loop.
    assertAndStart = function (wym) {
        wymEqual(
            wym,
            initHtml
        );
        if (allWymIframesInitialized()) {
            start();
        }
    };

    for (i = 0; i < $textareas.length; i++) {
        $textareas.eq(i).val('<p>textarea ' + i + '</p>');
        $textareas.eq(i).wymeditor({
            html: initHtml,
            postInit: assertAndStart
        });
    }

});

asyncTest("Load textarea values by default in batch-initializations", function () {
    var $textareas = jQuery('#wym-form > textarea.wym'),
        assertAndStart,
        i;

    QUnit.expect($textareas.length);

    // This function is here so as to not create functions within a loop.
    assertAndStart = function (wym) {
        wymEqual(
            wym,
            // The index is the same as the textarea's index because it gets
            // determined in the synchronous stage of the editor's
            // initialization.
            '<p>textarea ' + wym._index + '</p>'
        );
        if (allWymIframesInitialized()) {
            start();
        }
    };

    for (i = 0; i < $textareas.length; i++) {
        $textareas.eq(i).val('<p>textarea ' + i + '</p>');
    }

    $textareas.wymeditor({postInit: assertAndStart});
});
