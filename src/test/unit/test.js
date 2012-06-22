
// Whether or not we want to skip the tests that are known to be failing.
// Ideally, there would be no tests in this category, but right now there are
// a lot of table-related bugs that need to be fixed that aren't the number
// one priority. Having a test suite with failing tests is a bad thing though,
// because new contributors don't know which tests are "supposed to be failing."
// That lack of knowing makes the test suite much less useful than a test suite
// that should always be passing in all supported browsers.
var SKIP_KNOWN_FAILING_TESTS = true;

function setupWym(extraPostInit) {
    if (WYMeditor.INSTANCES.length === 0) {
        stop(5000); // Stop test running until the editor is initialized
        jQuery('.wymeditor').wymeditor({
            stylesheet: 'styles.css',
            postInit: function (wym) {
                var listPlugin = new ListPlugin({}, wym),
                    tableEditor = wym.table(),
                    /**
                    * Determine if attempting to select a cell with a non-text inner node (a span)
                    * actually selects the inner node or selects the cell itself. FF for example,
                    * selects the cell while webkit selects the inner.
                    */
                    initialHtml = String() +
                        '<table>' +
                            '<tbody>' +
                                '<tr>' +
                                    '<td id="td_1_1"><span id="span_1_1">span_1_1</span></td>' +
                                '</tr>' +
                            '</tbody>' +
                        '</table>',
                    spanSelector = '#span_1_1',
                    tdSelector = '#td_1_1',
                    $body,
                    td,
                    span;

                wym.html(initialHtml);

                $body = $(wym._doc).find('body.wym_iframe');

                td = $body.find(tdSelector)[0];
                span = $body.find(spanSelector)[0];
                wym.tableEditor.selectElement($body.find(tdSelector)[0]);

                if (wym.selected() === span) {
                    WYMeditor._isInnerSelector = true;
                } else {
                    WYMeditor._isInnerSelector = false;
                }


                start(); // Re-start test running now that we're finished initializing
            }
        });
    }
}
module("Core", {setup: setupWym});

test("Instantiate", function () {
    expect(2);
    equals(WYMeditor.INSTANCES.length, 1, "WYMeditor.INSTANCES length");
    equals(typeof jQuery.wymeditors(0), 'object',
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
    equals(jQuery('div.wym_html:visible', wymeditor._box).length, 1);
    wymeditor.toggleHtml();
    equals(jQuery('div.wym_html:visible', wymeditor._box).length, 0);
});

module("CssParser", {setup: setupWym});

test("Configure classes items using CSS", function () {
    expect(2);
    ok(
        jQuery('div.wym_classes ul', jQuery.wymeditors(0)._box).length > 0,
        "Classes loaded"
    );
    equals(
        jQuery(
            'div.wym_classes a:first-child',
            jQuery.wymeditors(0)._box
        ).attr('name'),
        'date',
        "First loaded class name"
    );
});

module("XmlHelper", {setup: setupWym});

test("Should escape URL's only once #69.1", function () {
    expect(2);
    var original = "index.php?module=x&func=view&id=1",
        expected = "index.php?module=x&amp;func=view&amp;id=1";
    equals(jQuery.wymeditors(0).helper.escapeOnce(original), expected,
            "Escape entities");
    equals(jQuery.wymeditors(0).helper.escapeOnce(expected), expected,
            "Avoids double entity escaping");
});

module("XmlParser", {setup: setupWym});

test("Should correct orphaned sublists", function () {
    expect(2);
    var expected = String() +
            '<ul>' +
                '<li>a' +
                    '<ul>' +
                        '<li>a.1<\/li>' +
                    '<\/ul>' +
                '<\/li>' +
                '<li>b<\/li>' +
            '<\/ul>',
        // FF
        design_mode_pseudo_html = String() +
            '<ul>' +
                '<li>a<\/li>' +
                '<ul>' +
                    '<li>a.1<\/li>' +
                '<\/ul>' +
                '<li>b<br><\/li>' +
            '<\/ul>',
        wymeditor = jQuery.wymeditors(0);
    equals(wymeditor.parser.parse(design_mode_pseudo_html), expected,
            "on Firefox");
    // IE
    // IE has invalid sublist nesting
    /*jslint white:false */
    expected = String() +
            "<ul>\r\n" +
                '<li>a' +
                    '<ul>\r\n' +
                        '<li>a.1<\/li>' +
                    '<\/ul>' +
                '<\/li>\r\n' +
                '<li>b<\/li>' +
            '<\/ul>';
    design_mode_pseudo_html = String() +
            '<UL>\r\n' +
                '<LI>a<\/LI>\r\n' +
                '<UL>\r\n' +
                    '<LI>a.1<\/LI>' +
                '<\/UL>\r\n' +
                '<LI>b<\/LI>' +
            '<\/UL>';
    /*jslint white:true */
    equals(
        wymeditor.parser.parse(design_mode_pseudo_html),
        expected,
        "on IE"
    );
});

test("Should correct under-closed lists", function () {
    expect(1);
    // Taken from a mistake made during development that uncovered a
    // parsing issue where if an LI tag was left unclosed, IE did lots of
    // over-closing to compensate which completey broke list structure
    var missingClosingLiHtml = String() +
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
                '<li id="li_5">5' +
                    '<ol>' +
                        '<li id="li_5_1">5_1</li>' +
                        '<li id="li_5_2">5_2</li>' +
                    '</ol>' +
                // </li> Ommitted closing tag
                '<li id="li_5_3">5_3' +
                    '<ol>' +
                        '<li class="spacer_li">' +
                            '<ul>' +
                                '<li id="li_5_3_1">5_3_1</li>' +
                            '</ul>' +
                        '</li>' +
                        '<li id="li_5_4">5_4</li>' +
                    '</ol>' +
                '</li>' +
                '<li id="li_6">6</li>' +
                '<li id="li_7">7</li>' +
                '<li id="li_8">8</li>' +
            '</ol>',
        fixedHtml = String() +
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
                '<li id="li_5">5' +
                    '<ol>' +
                        '<li id="li_5_1">5_1</li>' +
                        '<li id="li_5_2">5_2</li>' +
                    '</ol>' +
                '</li>' +
                '<li id="li_5_3">5_3' +
                    '<ol>' +
                        '<li class="spacer_li">' +
                            '<ul>' +
                                '<li id="li_5_3_1">5_3_1</li>' +
                            '</ul>' +
                        '</li>' +
                        '<li id="li_5_4">5_4</li>' +
                    '</ol>' +
                '</li>' +
                '<li id="li_6">6</li>' +
                '<li id="li_7">7</li>' +
                '<li id="li_8">8</li>' +
            '</ol>';

    equals(jQuery.wymeditors(0).parser.parse(missingClosingLiHtml), fixedHtml);
});

test("Don't over-close lists", function () {
    expect(6);
    var orphanedLiHtml = String() +
        '<ol id="ol_1">' +
            '<li id="li_1">li_1' +
                '<ol>' +
                    '<li id="li_1_1">li_1_1</li>' +
                '</ol>' +
            '</li>' +
        '</ol>' +
        '<li id="li_2">li_2' +
            '<ol id="ol_2_1">' +
                '<li id="li_2_1">li_2_1' +
                    '<ol>' +
                        '<li id="li_2_1_1">li_2_1_1</li>' +
                    '</ol>' +
                '</li>' +
            '</ol>' +
        '</li>' +
        '<li id="li_3">li_3</li>' +
        '<p>stop</p>' +
        '<li id="li_new">li_new</li>' +
        'text' +
        '<li id="li_text_sep">li_text_sep</li>',
        simpleOrphanedLiHtml = String() +
        '<ol id="ol_1">' +
            '<li id="li_1">li_1' +
                '<ol>' +
                    '<li id="li_1_1">li_1_1</li>' +
                '</ol>' +
            '</li>' +
        '</ol>' +
        '<li id="li_2">li_2</li>',
        listAfterText = String() +
        '<ol id="ol_1">' +
            '<li id="li_1">li_1' +
                '<ol>' +
                    '<li id="li_1_1">li_1_1</li>' +
                '</ol>' +
            '</li>' +
        '</ol>' +
        '<li id="li_2">li_2' +
            '<ol id="ol_2_1">' +
                '<li id="li_2_1">li_2_1' +
                    '<ol>' +
                        '<li id="li_2_1_1">li_2_1_1</li>' +
                    '</ol>' +
                '</li>' +
            '</ol>' +
        '</li>' +
        '<li id="li_3">li_3</li>' +
        '<p>stop</p>' +
        '<li id="li_new">li_new</li>' +
        'text' +
        '<ol>' +
            '<li id="li_text_sep">li_text_sep</li>' +
        '</ol>',
        wymeditor = jQuery.wymeditors(0);

    equals(
        wymeditor.parser.parse(orphanedLiHtml),
        orphanedLiHtml
    );
    equals(
        wymeditor.parser.parse(simpleOrphanedLiHtml),
        simpleOrphanedLiHtml
    );
    equals(
        wymeditor.parser.parse(listAfterText),
        listAfterText
    );

    // Now throw the browser/dom in the mix
    wymeditor.html(orphanedLiHtml);
    htmlEquals(wymeditor, orphanedLiHtml);

    wymeditor.html(simpleOrphanedLiHtml);
    htmlEquals(wymeditor, simpleOrphanedLiHtml);

    wymeditor.html(listAfterText);
    htmlEquals(wymeditor, listAfterText);
});

test("Shouldn't remove empty td elements", function () {
    expect(1);
    var expected = '<table><tr><td>Cell1</td><td></td></tr></table>',
        empty_cell = '<table><tr><td>Cell1</td><td></td></tr></table>';
    equals(jQuery.wymeditors(0).parser.parse(empty_cell), expected);
});

test("Should remove PRE line breaks (BR)", function () {
    expect(1);
    var original = String() +
            '<pre>One<br>Two<br>Three</pre>' +
            '<p>Test</p>' +
            '<pre>Three<br>Four<br>Five</pre>',
        expected = String() +
            '<pre>One\r\nTwo\r\nThree</pre>' +
            '<p>Test</p>' +
            '<pre>Three\r\nFour\r\nFive</pre>';
    equals(
        jQuery.wymeditors(0).parser.parse(original),
        expected,
        "Remove BR in PRE"
    );
});

test("Shouldn't strip colSpan attributes", function () {
    // http://trac.wymeditor.org/trac/ticket/223
    // IE8 uses colSpan for the colspan attribute. WYMeditor shouldn't strip it
    // just because of the camelCase
    expect(1);
    var original = String() +
            '<table>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1" colSpan="2">1_1</td>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1">2_1</td>' +
                    '<td id="td_2_2">2_2</td>' +
                '</tr>' +
            '</table>',
        expected = String() +
            '<table>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1" colspan="2">1_1</td>' +
                '</tr>' +
                '<tr id="tr_2">' +
                    '<td id="td_2_1">2_1</td>' +
                    '<td id="td_2_2">2_2</td>' +
                '</tr>' +
            '</table>';
    equals(
        jQuery.wymeditors(0).parser.parse(original),
        expected,
        "Don't strip colSpan"
    );
});

test("no-op on table with colgroup generates valid XHTML", function () {
    expect(1);

    var tableWithColXHtml = String() +
        '<table>' +
            '<colgroup>' +
                '<col width="20%" />' +
                '<col width="30%" />' +
                '<col width="50%" />' +
            '</colgroup>' +
            '<tbody>' +
                '<tr id="tr_1">' +
                    '<td id="td_1_1">1_1</td>' +
                    '<td id="td_1_2">1_2</td>' +
                    '<td id="td_1_3">1_3</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>';

    equals(jQuery.wymeditors(0).parser.parse(tableWithColXHtml), tableWithColXHtml);
});

test("Should allow arbitrary rel values", function () {
    var exampleRels = [
        'alternate',
        'appendix',
        'bookmark',
        'chapter',
        'contents',
        'copyright',
        'glossary',
        'help',
        'home',
        'index',
        'next',
        'prev',
        'section',
        'start',
        'stylesheet',
        'subsection',
        ' ',
        'shortcut',
        'nofollow',
        'moodalbox',
        'lightbox',
        'icon'
    ],
        expected,
        i;
    expect(exampleRels.length);

    for (i = 0; i < exampleRels.length; i++) {
        expected = '<p><a rel="' + exampleRels[i] + '">foo</a></p>';
        equals(jQuery.wymeditors(0).parser.parse(expected), expected);
    }
});

module("Post Init", {setup: setupWym});

test("Sanity check: html()", function () {
    expect(1);
    var testText1 = '<p>This is some text with which to test.<\/p>',
        wymeditor = jQuery.wymeditors(0);

    wymeditor.html(testText1);
    htmlEquals(wymeditor, testText1);
});

if (!$.browser.msie || !SKIP_KNOWN_FAILING_TESTS) {
    test("Adding combined CSS selectors", function () {
        expect(1);

        var wymeditor = jQuery.wymeditors(0),
            doc = wymeditor._doc,
            styles = doc.styleSheets[0];

        wymeditor.addCssRule(
            styles,
            {name: 'p,h1,h2', css: 'font-style:italic'}
        );
        equals(jQuery('p', doc).css('fontStyle'), 'italic', 'Font-style');
    });
}


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
if ($.browser !== 'msie') {
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

    @param pasteStartSelector String jquery selector for the item to select for the paste target
    @param startHtml
    @param textToPaste
    @param elmntStartHtml
    @param elmntExpectedHtml
    @param pasteStartIndex
    @param pasteEndSelector String jquery selector for the end item in the paste target selection
    @param pasteEndIndex
*/
function testPaste(pasteStartSelector, startHtml, textToPaste, elmntStartHtml, elmntExpectedHtml,
                   pasteStartIndex, pasteEndSelector, pasteEndIndex) {
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
    wymeditor.html(startHtml);

    // Escape slashes for the regexp
    elmntRegex = new RegExp(elmntStartHtml.replace('/', '\\/'), 'g');
    expectedHtml = startHtml.replace(
        elmntRegex,
        elmntExpectedHtml
    );

    $body = $(wymeditor._doc).find('body.wym_iframe');

    wymeditor._doc.body.focus();
    if (pasteStartSelector === '') {
        // Attempting to select the body
        moveSelector(wymeditor, $body[0]);
    } else {
        startElmnt = $body.find(pasteStartSelector).get(0);
        endElmnt = $body.find(pasteEndSelector).get(0);
        makeTextSelection(wymeditor, startElmnt, endElmnt, pasteStartIndex, pasteEndIndex);
        equals(wymeditor.selected(), startElmnt, "moveSelector");
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

module("Table Insertion", {setup: setupWym});

test("Table is editable after insertion", function () {
    expect(7);

    var wymeditor = jQuery.wymeditors(0),
        $body,
        dm;
    wymeditor.html('');

    $body = $(wymeditor._doc).find('body.wym_iframe');
    wymeditor.insertTable(3, 2, '', '');

    $body.find('td').each(function (index, td) {
        equals(isContentEditable(td), true);
    });

    dm = wymeditor._doc.designMode;
    ok(dm === 'on' || dm === 'On');
});

// Only FF >= 3.5 seems to require content in <td> for them to be editable
if ($.browser.mozilla) {
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
        wymeditor.html('');

        $body = $(wymeditor._doc).find('body.wym_iframe');
        wymeditor.insertTable(3, 2, '', '');

        $body.find('td').each(function (index, td) {
            if ($.browser.version >= '1.9.1' && $.browser.version < '2.0') {
                equals(td.childNodes.length, 1);
            } else {
                equals(td.childNodes.length, 0);
            }
            equals(isContentEditable(td), true);
        });

    });

    test("Table cells are editable in FF > 3.5: html() insert", function () {
        expect(12);

        var wymeditor = jQuery.wymeditors(0),
            $body = $(wymeditor._doc).find('body.wym_iframe');

        wymeditor.html('');
        wymeditor.html(table_3_2_html);
        $body.find('td').each(function (index, td) {
            // Both FF 3.6 and 4.0 add spacer brs with design mode
            equals(td.childNodes.length, 1);
            equals(isContentEditable(td), true);
        });
    });

    if (!SKIP_KNOWN_FAILING_TESTS) {
        test("Table cells are editable in FF > 3.5: via inner_html", function () {
            // This is currently broken. Doing a raw insert in to the editor
            // body doesn't let us use our fixBodyHtml() fix to add the
            // appropriate placeholder nodes inside the table cells
            // Need to figure out another way to detect this and correct
            // the HTML
            expect(12);

            var wymeditor = jQuery.wymeditors(0),
                $body = $(wymeditor._doc).find('body.wym_iframe');

            $body.html(table_3_2_html);
            $body.find('td').each(function (index, td) {
                if ($.browser.version >= '1.9.1' && $.browser.version < '2.0') {
                    equals(td.childNodes.length, 1);
                } else {
                    equals(td.childNodes.length, 0);
                }
                equals(isContentEditable(td), true);
            });
        });
    }
}

module("preformatted text", {setup: setupWym});

test("Preformatted text retains spacing", function () {
    var wymeditor = jQuery.wymeditors(0),
        preHtml = String() +
            '<pre>pre1\r\n' +
            'spaced\r\n\r\n' +
            'double  spaced' +
            '</pre>',
        $body,
        preChildren;

    // Only ie and firefox 3.x use \r\n newlines
    if ($.browser.webkit || $.browser.safari || ($.browser.mozilla && $.browser.version > '2.0')) {
        preHtml = preHtml.replace(/\r/g, '');
    }

    wymeditor.html(preHtml);

    expect(1);

    if ($.browser.mozilla && $.browser.version < '2.0') {
        // Firefox 3.x converts the text inside pre to DOM nodes, where as other
        // browsers just use plain text
        $body = $(wymeditor._doc).find('body.wym_iframe');
        preChildren = $body.children('pre').contents();

        expect(8);
        equals(preChildren.length, 6,
                "Should have text, br, text, br, br, text");
        if (preChildren.length === 6) {
            equals(preChildren[0].nodeName.toLowerCase(), '#text');
            equals(preChildren[1].nodeName.toLowerCase(), 'br');
            equals(preChildren[2].nodeName.toLowerCase(), '#text');
            equals(preChildren[3].nodeName.toLowerCase(), 'br');
            equals(preChildren[4].nodeName.toLowerCase(), 'br');
            equals(preChildren[5].nodeName.toLowerCase(), '#text');
        }
    }

    equals(wymeditor.xhtml(), preHtml);
});

module("soft return", {setup: setupWym});

test("Double soft returns are allowed", function () {
    var initHtml = String() +
            '<ul>' +
                '<li>li_1<br /><br />stuff</li>' +
            '</ul>',
        wymeditor = jQuery.wymeditors(0);
    wymeditor.html(initHtml);

    wymeditor.fixBodyHtml();

    expect(1);
    htmlEquals(wymeditor, initHtml);
});

module("image styling", {setup: setupWym});

test("_selected image is saved on mousedown", function () {
    var initHtml = String() +
            '<p id="noimage">Images? We dont need no stinkin images</p>' +
            '<p>' +
                '<img id="google" src="http://www.google.com/intl/en_com/images/srpr/logo3w.png" />' +
            '</p>',
        wymeditor = jQuery.wymeditors(0),
        $body,
        $noimage,
        $google;

    expect(3);

    wymeditor.html(initHtml);
    $body = $(wymeditor._doc).find('body.wym_iframe');

    // Editor starts with no selected image
    equals(wymeditor._selected_image, null);

    // Clicking on a non-image doesn't change that
    $noimage = $body.find('#noimage');
    $noimage.mousedown();
    equals(wymeditor._selected_image, null);


    // Clicking an image does update the selected image
    $google = $body.find('#google');
    $google.mousedown();
    equals(wymeditor._selected_image, $google[0]);
});

if ($.browser.webkit || $.browser.safari) {
    module("gh-319", {setup: setupWym});

    var gh_319_divInsertionHtml = String() +
            '<p>Some text before the div container</p>' +
            '<div>Anything</div>' +
            '<p>Some text after the div container</p>';

    test("DIV element is correctly inserted", function () {
        var initHtml = String() +
                '<p>Some text before the div container</p>' +
                '<p id="replaceMe">Replace me</p>' +
                '<p>Some text after the div container</p>',
            divHtml = String() +
                '<div>Anything</div>',
            wymeditor = jQuery.wymeditors(0),
            $body, selectedElmnt;

        expect(1);

        wymeditor.html(initHtml);
        $body = jQuery(wymeditor._doc).find('body.wym_iframe');
        wymeditor._doc.body.focus();

        selectedElmnt = $body.find('#replaceMe').get(0);
        makeTextSelection(wymeditor, selectedElmnt, selectedElmnt, 0, selectedElmnt.innerText.length);

        wymeditor._exec(WYMeditor.INSERT_HTML, divHtml);
        equals($body.html(), gh_319_divInsertionHtml);
    });
}
