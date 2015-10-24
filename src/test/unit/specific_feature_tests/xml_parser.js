/* jshint camelcase: false, maxlen: 100 */
/* global
    wymEqual,
    prepareUnitTestModule,
    manipulationTestHelper,
    IMG_SRC,
    testNoChangeInHtmlArray,
    test,
    QUnit,
    strictEqual,
    deepEqual
*/
"use strict";
// Tests for the XML parser

module("XmlParser", {setup: prepareUnitTestModule});

test("Empty is empty", function () {
    var wymeditor = jQuery.wymeditors(0);
    QUnit.expect(2);

    wymeditor.rawHtml('');
    wymEqual(wymeditor, '', {parseHtml: true});

    wymeditor.rawHtml('');
    // Placing the caret inside shouldn't create any content.
    wymeditor.setCaretIn(wymeditor.body());
    wymEqual(wymeditor, '', {parseHtml: true});
});

test("Should correct orphaned sublists", function () {
    QUnit.expect(2);
    var expected = String() +
            '<ul>' +
                '<li>a' +
                    '<ul>' +
                        '<li>a.1<\/li>' +
                    '<\/ul>' +
                '<\/li>' +
                '<li>b<br /><\/li>' +
            '<\/ul>',
        // FF
        design_mode_pseudo_html = String() +
            '<ul>' +
                '<li>a<\/li>' +
                '<ul>' +
                    '<li>a.1<\/li>' +
                '<\/ul>' +
                '<li>b<br /><\/li>' +
            '<\/ul>',
        wymeditor = jQuery.wymeditors(0);
    deepEqual(wymeditor.parser.parse(design_mode_pseudo_html), expected,
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
    deepEqual(
        wymeditor.parser.parse(design_mode_pseudo_html),
        expected,
        "on IE"
    );
});

test("Should correct under-closed lists", function () {
    QUnit.expect(1);
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

    deepEqual(jQuery.wymeditors(0).parser.parse(missingClosingLiHtml), fixedHtml);
});

test("Don't over-close lists", function () {
    QUnit.expect(6);
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

    deepEqual(
        wymeditor.parser.parse(orphanedLiHtml),
        orphanedLiHtml
    );
    deepEqual(
        wymeditor.parser.parse(simpleOrphanedLiHtml),
        simpleOrphanedLiHtml
    );
    deepEqual(
        wymeditor.parser.parse(listAfterText),
        listAfterText
    );

    // Now throw the browser/dom in the mix
    wymeditor.rawHtml(orphanedLiHtml);
    wymEqual(wymeditor, orphanedLiHtml, {parseHtml: true});

    wymeditor.rawHtml(simpleOrphanedLiHtml);
    wymEqual(wymeditor, simpleOrphanedLiHtml, {parseHtml: true});

    wymeditor.rawHtml(listAfterText);
    wymEqual(wymeditor, listAfterText, {parseHtml: true});
});

test("Shouldn't remove empty td elements", function () {
    QUnit.expect(1);
    var expected = '<table><tr><td>Cell1</td><td></td></tr></table>',
        empty_cell = '<table><tr><td>Cell1</td><td></td></tr></table>';
    deepEqual(jQuery.wymeditors(0).parser.parse(empty_cell), expected);
});

test("Should remove PRE line breaks (BR)", function () {
    QUnit.expect(1);
    var original = String() +
            '<pre>One<br />Two<br />Three</pre>' +
            '<p>Test</p>' +
            '<pre>Three<br />Four<br />Five</pre>',
        expected = String() +
            '<pre>One\r\nTwo\r\nThree</pre>' +
            '<p>Test</p>' +
            '<pre>Three\r\nFour\r\nFive</pre>';
    deepEqual(
        jQuery.wymeditors(0).parser.parse(original),
        expected,
        "Remove BR in PRE"
    );
});

test("Shouldn't strip colSpan attributes", function () {
    // http://trac.wymeditor.org/trac/ticket/223
    // IE8 uses colSpan for the colspan attribute. WYMeditor shouldn't strip it
    // just because of the camelCase
    QUnit.expect(1);
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
    deepEqual(
        jQuery.wymeditors(0).parser.parse(original),
        expected,
        "Don't strip colSpan"
    );
});

test("no-op on table with colgroup generates valid XHTML", function () {
    QUnit.expect(1);

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

    deepEqual(jQuery.wymeditors(0).parser.parse(tableWithColXHtml), tableWithColXHtml);
});

test("Self closing button tags should be expanded and removed", function () {
    var html = '<p><button /></p>',
        expected = '<p></p>';
    deepEqual(jQuery.wymeditors(0).parser.parse(html), expected);
});

test("Iframe should not be self closing", function () {
    var html = '<iframe width="480" height="390" src="asd.html" frameborder="0" /></iframe>',
        expected = '<iframe width="480" height="390" src="asd.html" frameborder="0"></iframe>';
    deepEqual(jQuery.wymeditors(0).parser.parse(html), expected);
});

test("Allow HR inside strong tags", function () {
    var html = '<strong>hello<hr /></strong>';
    deepEqual(jQuery.wymeditors(0).parser.parse(html), html);
});

test("Allow line breaks inside em tags", function () {
    var html = '<em>hello<br />world</em>',
        wymeditor = jQuery.wymeditors(0);
    deepEqual(wymeditor.parser.parse(html), html);
});

test("Allow line breaks after strong in lists", function () {
    QUnit.expect(4);
    var listHtml = String() +
        '<ol id="ol_1">' +
            '<li id="li_1">li_1' +
                '<ol>' +
                    '<li id="li_1_1"><strong>li_1_1</strong><br />more text</li>' +
                '</ol>' +
            '</li>' +
        '</ol>',
        listHtmlUnclosedBr = String() +
        '<ol id="ol_1">' +
            '<li id="li_1">li_1' +
                '<ol>' +
                    '<li id="li_1_1"><strong>li_1_1</strong><br />more text</li>' +
                '</ol>' +
            '</li>' +
        '</ol>',
        wymeditor = jQuery.wymeditors(0);

    deepEqual(
        wymeditor.parser.parse(listHtml),
        listHtml
    );
    deepEqual(
        wymeditor.parser.parse(listHtmlUnclosedBr),
        listHtml
    );

    // Now throw the browser/dom in the mix
    wymeditor.rawHtml(listHtml);
    wymEqual(wymeditor, listHtml, {parseHtml: true});

    wymeditor.rawHtml(listHtmlUnclosedBr);
    wymEqual(wymeditor, listHtml, {parseHtml: true});
});

module("XmlParser-editor_only_elements", {setup: prepareUnitTestModule});

var TEXT_CONTAINER_ELEMENTS = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                               'pre', 'blockquote', 'div'];
var TEXT_INLINE_ELEMENTS = ['a', 'span', 'strong', 'em', 'sub', 'sup'];
var SELF_CLOSING_ELEMENTS = ['br', 'hr', 'img'];

var editorOnlyContainerStartHtml = String() +
    '<p id="before-editor-only-element">Not editor-only</p>' +
    '<p id="after-editor-only-element">Not editor-only</p>';

var editorOnlyInlineStartHtml = String() +
    '<p id="before-editor-only-element">Not editor-only</p>' +
    '<p id="test-container">Not editor-only</p>' +
    '<p id="after-editor-only-element">Not editor-only</p>';

test("Remove editor-only text container elements", function () {
    QUnit.expect(TEXT_CONTAINER_ELEMENTS.length);
    var wymeditor = jQuery.wymeditors(0),
        $body = wymeditor.$body(),
        $element,
        tagName,
        i;

    for (i = 0; i < TEXT_CONTAINER_ELEMENTS.length; ++i) {
        wymeditor.rawHtml(editorOnlyContainerStartHtml);
        tagName = TEXT_CONTAINER_ELEMENTS[i];
        $element = jQuery('<' + tagName + '>editor-only</' + tagName + '>',
                          wymeditor._doc);
        $element.attr("id", "editor-only-" + tagName);
        $element.addClass(WYMeditor.EDITOR_ONLY_CLASS);
        $body.find('#before-editor-only-element').after($element);

        wymEqual(
            wymeditor,
            editorOnlyContainerStartHtml,
            {
                assertionString: "Remove editor-only `" + tagName + "` element",
                parseHtml: true
            }
        );
    }
});

test("Remove editor-only text inline elements", function () {
    QUnit.expect(TEXT_INLINE_ELEMENTS.length);
    var wymeditor = jQuery.wymeditors(0),
        $body = wymeditor.$body(),
        $element,
        tagName,
        i;

    for (i = 0; i < TEXT_INLINE_ELEMENTS.length; ++i) {
        wymeditor.rawHtml(editorOnlyInlineStartHtml);
        tagName = TEXT_INLINE_ELEMENTS[i];
        $element = jQuery('<' + tagName + '> editor-only</' + tagName + '>',
                          wymeditor._doc);
        $element.attr("id", "editor-only-" + tagName);
        $element.addClass(WYMeditor.EDITOR_ONLY_CLASS);
        $body.find('#test-container').append($element);

        wymEqual(
            wymeditor,
            editorOnlyInlineStartHtml,
            {
                assertionString: "Remove editor-only `" + tagName +
                    "` inline element",
                parseHtml: true
            }
        );
    }
});

test("Remove editor-only table", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = wymeditor.$body(),
        table,
        i;

    wymeditor.rawHtml(editorOnlyContainerStartHtml);
    table = '<table id="editor-only-table" class="' +
                WYMeditor.EDITOR_ONLY_CLASS + '">';
    table += '<caption>editor-only</caption>';
    for (i = 0; i < 3; ++i) {
        table += '<tr><td>editor-only</td></tr>';
    }
    table += '</table>';
    $body.find('#before-editor-only-element').after(table);

    wymEqual(
        wymeditor,
        editorOnlyContainerStartHtml,
        {
            assertionString: "Remove editor-only `table`",
            parseHtml: true
        }
    );
});

test("Remove editor-only lists", function () {
    QUnit.expect(WYMeditor.LIST_TYPE_ELEMENTS.length);
    var wymeditor = jQuery.wymeditors(0),
        $body = wymeditor.$body(),
        listType,
        list,
        i,
        j;

    for (i = 0; i < WYMeditor.LIST_TYPE_ELEMENTS.length; ++i) {
        wymeditor.rawHtml(editorOnlyContainerStartHtml);
        listType = WYMeditor.LIST_TYPE_ELEMENTS[i];
        list = '<' + listType + ' id="editor-only-list" class="' +
                    WYMeditor.EDITOR_ONLY_CLASS + '">';
        for (j = 0; j < 3; ++j) {
            list += '<li>editor-only</li>';
        }
        list += '</' + listType + '>';
        $body.find('#before-editor-only-element').after(list);

        wymEqual(
            wymeditor,
            editorOnlyContainerStartHtml,
            {
                assertionString: "Remove editor-only `" + listType + "` list",
                parseHtml: true
            }
        );
    }
});

test("Remove editor-only self-closing elements", function () {
    QUnit.expect(SELF_CLOSING_ELEMENTS.length);
    var wymeditor = jQuery.wymeditors(0),
        $body = wymeditor.$body(),
        $element,
        tagName,
        i;

    for (i = 0; i < SELF_CLOSING_ELEMENTS.length; ++i) {
        wymeditor.rawHtml(editorOnlyContainerStartHtml);
        tagName = SELF_CLOSING_ELEMENTS[i];
        $element = jQuery('<' + tagName + '/>', wymeditor._doc);
        $element.attr("id", "editor-only-" + tagName);
        $element.addClass(WYMeditor.EDITOR_ONLY_CLASS);
        $body.find('#before-editor-only-element').after($element);

        wymEqual(
            wymeditor,
            editorOnlyContainerStartHtml,
            {
                assertionString: "Remove editor-only `" + tagName + "` element",
                parseHtml: true
            }
        );
    }
});

test("Remove editor-only element with multiple classes", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = wymeditor.$body(),
        $element;

    wymeditor.rawHtml(editorOnlyContainerStartHtml);
    $element = jQuery('<p>Test</p>', wymeditor._doc);
    $element.attr("id", "editor-only-multiclass");
    $element.addClass("foo");
    $element.addClass("bar");
    $element.addClass(WYMeditor.EDITOR_ONLY_CLASS);
    $element.addClass("baz");
    $body.find('#before-editor-only-element').after($element);

    wymEqual(
        wymeditor,
        editorOnlyContainerStartHtml,
        {
            assertionString: "Remove editor-only `p` element with multiple " +
                "classes",
            parseHtml: true
        }
    );
});

test("Remove nested editor-only elements", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = wymeditor.$body(),
        $container,
        $span,
        $strong,
        $img;

    wymeditor.rawHtml(editorOnlyContainerStartHtml);

    // Create an editor-only img element
    $img = jQuery('<img/>', wymeditor._doc);
    $img.attr("id", "editor-only-img");
    $img.attr("src", "http://www.google.com/intl/en_com/images/srpr/logo3w.png");
    $img.addClass(WYMeditor.EDITOR_ONLY_CLASS);

    // Create an editor-only strong element
    $strong = jQuery('<strong>editor-only</strong>', wymeditor._doc);
    $strong.attr("id", "editor-only-strong");
    $strong.addClass(WYMeditor.EDITOR_ONLY_CLASS);

    // Nest the strong and img inside an editor-only span element
    $span = jQuery('<span>editor-only </span>', wymeditor._doc);
    $span.attr("id", "editor-only-span");
    $span.addClass(WYMeditor.EDITOR_ONLY_CLASS);
    $span.append($strong);
    $span.append($img);

    // Nest the span inside an editor-only p element
    $container = jQuery('<p>editor-only </p>', wymeditor._doc);
    $container.attr("id", "remove-container");
    $container.addClass(WYMeditor.EDITOR_ONLY_CLASS);
    $container.append($span);

    $body.find('#before-editor-only-element').after($container);
    wymEqual(
        wymeditor,
        editorOnlyContainerStartHtml,
        {
            assertionString: "Remove nested editor-only elements",
            parseHtml: true
        }
    );
});

module("XmlParser-editor_only_invalid_lists", {setup: prepareUnitTestModule});

var invalidULEndNesting = String() +
    '<ul id="ul_top">' +
        '<li id="li_1">1</li>' +
        '<li id="li_2">2</li>' +
        '<ul id="ul_2">' +
            '<li id="li_2_1">2_1</li>' +
            '<li id="li_2_2">2_2</li>' +
        '</ul>' +
    '</ul>';

var validULEndNesting = String() +
    '<ul id="ul_top">' +
        '<li id="li_1">1</li>' +
        '<li id="li_2">2' +
            '<ul id="ul_2">' +
                '<li id="li_2_1">2_1</li>' +
                '<li id="li_2_2">2_2</li>' +
            '</ul>' +
        '</li>' +
    '</ul>';

var invalidULStartNesting = String() +
    '<ul id="ul_top">' +
        '<ul id="ul_1">' +
            '<li id="li_1_1">1_1</li>' +
            '<li id="li_1_2">1_2</li>' +
        '</ul>' +
        '<li id="li_2">2</li>' +
        '<li id="li_3">3</li>' +
    '</ul>';

var validULStartNesting = String() +
    '<ul id="ul_top">' +
        '<li>' +
            '<ul id="ul_1">' +
                '<li id="li_1_1">1_1</li>' +
                '<li id="li_1_2">1_2</li>' +
            '</ul>' +
        '</li>' +
        '<li id="li_2">2</li>' +
        '<li id="li_3">3</li>' +
    '</ul>';

var invalidLINesting = String() +
    '<ul id="ul_top">' +
        '<li id="li_1">1' +
            '<li id="li_2">2</li>' +
        '</li>' +
        '<li id="li_3">3</li>' +
    '</ul>';

var validLINesting = String() +
    '<ul id="ul_top">' +
        '<li id="li_1">1</li>' +
        '<li id="li_2">2</li>' +
        '<li id="li_3">3</li>' +
    '</ul>';

test("Remove editor-only invalid UL with LI sibling before it", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = wymeditor.$body(),
        expectedHtml;

    wymeditor.rawHtml(invalidULEndNesting);
    $body.find('#ul_2').addClass(WYMeditor.EDITOR_ONLY_CLASS);

    expectedHtml = validULEndNesting.replace(/<ul id="ul\_2".*?<\/ul>/, '');
    wymEqual(
        wymeditor,
        expectedHtml,
        {
            assertionString: "Remove editor-only invalid UL with LI sibling " +
                "before it",
            parseHtml: true
        }
    );
});

test("Remove editor-only invalid UL that's the first child of a UL", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = wymeditor.$body(),
        expectedHtml;

    wymeditor.rawHtml(invalidULStartNesting);
    $body.find('#ul_1').addClass(WYMeditor.EDITOR_ONLY_CLASS);

    expectedHtml = invalidULStartNesting.replace(/<ul id="ul\_1".*?<\/ul>/, '');
    wymEqual(
        wymeditor,
        expectedHtml,
        {
            assertionString: "Remove editor-only UL that's the first child " +
                "of a UL",
            parseHtml: true
        }
    );
});

test("Remove editor-only LI with invalid UL sibling after it", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = wymeditor.$body(),
        expectedHtml;

    wymeditor.rawHtml(invalidULEndNesting);
    $body.find('#li_2').addClass(WYMeditor.EDITOR_ONLY_CLASS);

    expectedHtml = validULEndNesting.replace(/<ul id="ul\_2".*?<\/ul>/, '');
    expectedHtml = expectedHtml.replace(/<li id="li\_2".*?<\/li>/, '');
    wymEqual(
        wymeditor,
        expectedHtml,
        {
            assertionString: "Remove editor-only LI with invalid UL sibling " +
                "after it",
            parseHtml: true
        }
    );
});

test("Remove editor-only LI with invalid UL sibling before it", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = wymeditor.$body(),
        expectedHtml;

    wymeditor.rawHtml(invalidULStartNesting);
    $body.find('#li_2').addClass(WYMeditor.EDITOR_ONLY_CLASS);

    expectedHtml = validULStartNesting.replace(/<li id="li\_2".*?<\/li>/, '');
    wymEqual(
        wymeditor,
        expectedHtml,
        {
            assertionString: "Remove editor-only LI with invalid UL sibling " +
                "before it",
            parseHtml: true
        }
    );
});

test("Remove editor-only invalid LI nested within an LI", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = wymeditor.$body(),
        expectedHtml;

    wymeditor.rawHtml(invalidLINesting);
    $body.find('#li_2').addClass(WYMeditor.EDITOR_ONLY_CLASS);

    expectedHtml = validLINesting.replace(/<li id="li\_2".*?<\/li>/, '');
    wymEqual(
        wymeditor,
        expectedHtml,
        {
            assertionString: "Remove editor-only LI with invalid UL sibling " +
                "before it",
            parseHtml: true
        }
    );
});

test("Remove editor-only LI with an invalid LI nested within it", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = wymeditor.$body(),
        expectedHtml;

    wymeditor.rawHtml(invalidLINesting);
    $body.find('#li_1').addClass(WYMeditor.EDITOR_ONLY_CLASS);

    expectedHtml = validLINesting.replace(/<li id="li\_1".*?<\/li>/, '');
    wymEqual(
        wymeditor,
        expectedHtml,
        {
            assertionString: "Remove editor-only LI with an invalid LI " +
                "nested within it",
            parseHtml: true
        }
    );
});

test("Remove editor-only UL with invalid LI nesting within it", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = wymeditor.$body(),
        expectedHtml;

    wymeditor.rawHtml(invalidLINesting);
    $body.find('#ul_top').addClass(WYMeditor.EDITOR_ONLY_CLASS);

    expectedHtml = "";
    wymEqual(
        wymeditor,
        expectedHtml,
        {
            assertionString: "Remove editor-only UL with invalid LI nesting " +
                "within it",
            parseHtml: true
        }
    );
});


module("XmlParser-fix_style_spans", {setup: prepareUnitTestModule});

var startSpan = '<p>Test<span>Test</span></p>';

function testStyleSpan(newTag, spanStyle, assertionString) {
    var wymeditor = jQuery.wymeditors(0),
        $body = wymeditor.$body(),
        expectedHtml = startSpan.replace(/span/g, newTag);

    wymeditor.rawHtml(startSpan);
    $body.find('span').attr('style', spanStyle);

    wymEqual(
        wymeditor,
        expectedHtml,
        {
            assertionString: assertionString,
            parseHtml: true
        }
    );
}

test("Fix bold style span", function () {
    QUnit.expect(1);
    testStyleSpan("strong", "font-weight:bold;", "Fix bold style span");
});

test("Fix italic style span", function () {
    QUnit.expect(1);
    testStyleSpan("em", "font-style:italic;", "Fix italic style span");
});

test("Fix superscript style span", function () {
    QUnit.expect(1);
    testStyleSpan("sup", "vertical-align:super;", "Fix superscript style span");
});

test("Fix subscript style span", function () {
    QUnit.expect(1);
    testStyleSpan("sub", "vertical-align:sub;", "Fix subscript style span");
});

module("XmlParser-remove_unwanted_classes", {setup: prepareUnitTestModule});

test("Remove 'apple-style-span' class", function () {
    QUnit.expect(2);
    var wymeditor = jQuery.wymeditors(0),

        startHtmlSingleClass = String() +
            '<span id="span_1" class="apple-style-span">' +
                'Test' +
            '</span>',
        expectedHtmlSingleClass = String() +
            '<span id="span_1">' +
                'Test' +
            '</span>',
        startHtmlMultiClass = String() +
            '<span id="span_1" class="foo bar apple-style-span baz">' +
                'Test' +
            '</span>',
        expectedHtmlMultiClass = String() +
            '<span class="foo bar baz" id="span_1">' +
                'Test' +
            '</span>';

    wymeditor.rawHtml(startHtmlSingleClass);
    wymEqual(
        wymeditor,
        expectedHtmlSingleClass,
        {
            assertionString: "'apple-style-span' removed from span with one " +
                "class",
            parseHtml: true
        }
    );

    wymeditor.rawHtml(startHtmlMultiClass);
    wymEqual(
        wymeditor,
        expectedHtmlMultiClass,
        {
            assertionString: "'apple-style-span' removed from span with " +
                "multiple classes",
            parseHtml: true
        }
    );
});

test("Class removal is case insensitive", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0),
        defaultClassesRemovedByParser = WYMeditor.CLASSES_REMOVED_BY_PARSER,

        startHtml = String() +
            '<p class="FOO BaR baZ qUx" id="p_1">' +
                'Test' +
            '</p>',
        expectedHtml = String() +
            '<p class="baZ" id="p_1">' +
                'Test' +
            '</p>';

    WYMeditor.CLASSES_REMOVED_BY_PARSER = ["Bar", "quX", "foo"];

    wymeditor.rawHtml(startHtml);
    wymEqual(
        wymeditor,
        expectedHtml,
        {
            assertionString: "Class removal is case insensitive",
            parseHtml: true
        }
    );

    // Restore default
    WYMeditor.CLASSES_REMOVED_BY_PARSER = defaultClassesRemovedByParser;
});

module("XmlParser-remove_style_attribute", {setup: prepareUnitTestModule});

test("Style attribute is removed from images", function () {
    var expectedResultHtml = '<p><img src="' + IMG_SRC + '" /></p>';
    manipulationTestHelper({
        startHtml: '<p><img src="' + IMG_SRC + '" style="padding: 1em" /></p>',
        expectedStartHtml: expectedResultHtml,
        parseHtml: true,
        expectedResultHtml: expectedResultHtml
    });
});

module("XmlParser-unwrap_single_tag_in_list_item", {setup: prepareUnitTestModule});

var tagsToUnwrapInLists =
    WYMeditor.DocumentStructureManager.VALID_DEFAULT_ROOT_CONTAINERS;

/**
    testUnwrapSingleContentInLI
    ===========================

    Tests for every element in tagsToUnwrapInLists that the startHtml is
    properly parsed to being equivalent to the startHtml with the labeled
    blockTags removed within the wymeditor. For each test, replaces the string
    "{blockTag}" within the startHtml with the tag name for the tested element.

    @param wymeditor A wymeditor instance to use for testing
    @param startHtml An html string to insert into the editor at the start of
                     each test. The string "{blockTag}" in the html will be
                     replaced with the tag name of the tested element for each
                     test.
    @param assertionString A string to use with each test assertion. The string
                           "{blockTag}" within the string will be replaced by
                           the tested element.
*/
function testUnwrapSingleContentInLI(
    wymeditor, startHtml, assertionString
) {
    var correctHtml = startHtml.replace(/<\/?\{blockTag\}>/g, ''),
        iterStartHtml,
        iterString,
        i;

    for (i = 0; i < tagsToUnwrapInLists.length; ++i) {
        iterStartHtml = startHtml.replace(/\{blockTag\}/g,
                                          tagsToUnwrapInLists[i]);
        iterString = assertionString.replace(/\{blockTag\}/g,
                                             tagsToUnwrapInLists[i]);
        wymeditor.rawHtml(iterStartHtml);
        wymEqual(
            wymeditor,
            correctHtml,
            {
                assertionString: iterString,
                fixListSpacing: true,
                parseHtml: true
            }
        );
    }
}

var unwrapSingleInListHtml = String() +
    '<ul>' +
        '<li>Test</li>' +
        '<li><{blockTag}>Test</{blockTag}></li>' +
        '<li>Test</li>' +
    '</ul>';

test("Unwrap root container content in simple list", function () {
    QUnit.expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapSingleContentInLI(
        wymeditor,
        unwrapSingleInListHtml,
        "Unwrap `{blockTag}` content in simple list"
    );
});

var unwrapSingleInSublistHtml = String() +
    '<ol>' +
        '<li>Test</li>' +
        '<li>' +
            '<ul>' +
                '<li>Test</li>' +
                '<li><{blockTag}>Test</{blockTag}></li>' +
                '<li>Test</li>' +
            '</ul>' +
        '</li>' +
        '<li><{blockTag}>Test</{blockTag}></li>' +
    '</ol>';

test("Unwrap root container content in simple sublist", function () {
    QUnit.expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapSingleContentInLI(
        wymeditor,
        unwrapSingleInSublistHtml,
        "Unwrap `{blockTag}` content in simple sublist"
    );
});

var unwrapSingleInNestedListHtml = String() +
    '<ol>' +
        '<li>Test</li>' +
        '<li><{blockTag}>Test</{blockTag}>' +
            '<ul>' +
                '<li><{blockTag}>Test</{blockTag}></li>' +
                '<li>Test</li>' +
                '<li><{blockTag}>Test</{blockTag}>' +
                    '<ol>' +
                        '<li>Test</li>' +
                        '<li>Test</li>' +
                        '<li><{blockTag}>Test</{blockTag}></li>' +
                    '</ol>' +
                '</li>' +
            '</ul>' +
        '</li>' +
        '<li><{blockTag}>Test</{blockTag}></li>' +
    '</ol>';

test("Unwrap root container content in nested lists", function () {
    QUnit.expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapSingleContentInLI(
        wymeditor,
        unwrapSingleInNestedListHtml,
        "Unwrap `{blockTag}` content in nested lists"
    );
});


var inlineTagsToTestInLists = ['strong', 'em', 'sup', 'sub', 'a', 'span'];

/**
    testUnwrapMultiContentInLI
    ==========================

    Tests every combination of tags in tagsToUnwrapInLists with the type of
    content specified by otherContentType to check that the startHtml is
    properly parsed to being equivalent to the startHtml with the labeled
    blockTags removed and with line breaks properly inserted within the
    wymeditor. For each test, replaces the string "{blockTag}" within the
    startHtml with the tag name for the tested element, and replaces the string
    "{otherContent}" within the startHtml with the other tested content.

    @param wymeditor A wymeditor instance to use for testing
    @param startHtml An html string to insert into the editor at the start of
                     each test with proper "{blockTag}" and "{otherContent}"
                     labels for replacement.
    @param otherContentType A string specifing the type of content to test with
                            the tags to be unwrapped. Can be either 'block',
                            'inline', 'text', 'table'.
    @param assertionString A string to use with each test assertion. The string
                           "{blockTag}" within the string will be replaced by
                           the tested element, and the string "{otherContent}"
                           withing the string will be replaced by the other
                           tested content.
*/
function testUnwrapMultiContentInLI(
    wymeditor, startHtml, otherContentType, assertionString
) {
    var correctHtml,
        iterStartHtml,
        iterCorrectHtml,
        iterString,
        iterContent,
        otherContentText = 'Test',
        otherContentTag = '<{tag}>Test</{tag}>',
        otherContentTable = String() +
            '<table>' +
                '<caption>Test</caption>' +
                '<tbody>' +
                    '<tr>' +
                        '<td>1</td>' +
                        '<td>2</td>' +
                        '<td>3</td>' +
                    '</tr>' +
                '</tbody>' +
            '</table>',
        otherContentTags,
        i,
        j;

    if (otherContentType === 'block') {
        otherContentTags = tagsToUnwrapInLists;
    } else if (otherContentType === 'inline') {
        otherContentTags = inlineTagsToTestInLists;
    } else if (otherContentType === 'text') {
        otherContentTags = ['text'];
    } else if (otherContentType === 'table') {
        otherContentTags = ['table'];
    }

    // Insert line breaks in the correctHtml where needed
    correctHtml =
        startHtml.replace(/(\{blockTag\}>)(\{otherContent\})/g, '$1<br />$2')
                 .replace(/(\{otherContent\})(<\{blockTag\})/g, '$1<br />$2');

    // Strip the block tags from the correctHtml
    correctHtml = correctHtml.replace(/<\/?\{blockTag\}>/g, '');

    for (i = 0; i < tagsToUnwrapInLists.length; ++i) {
        for (j = 0; j < otherContentTags.length; ++j) {
            // Create the other content to test with the block that will have
            // its content unwrapped
            if (otherContentType === 'text') {
                iterContent = otherContentText;
            } else if (otherContentType === 'table') {
                iterContent = otherContentTable;
            } else {
                iterContent = otherContentTag
                    .replace(/\{tag\}/g, otherContentTags[j]);
            }

            // Insert the block tag and other content into the start html
            iterStartHtml = startHtml
                .replace(/\{blockTag\}/g, tagsToUnwrapInLists[i])
                .replace(/\{otherContent\}/g, iterContent);

            // Insert the other content into the correct html
            if (otherContentType === 'block') {
                iterCorrectHtml = correctHtml
                    .replace(/\{otherContent\}/g, otherContentText);
            } else {
                iterCorrectHtml = correctHtml
                    .replace(/\{otherContent\}/g, iterContent);
            }

            // Create assertion string for the test
            iterString = assertionString
                .replace(/\{blockTag\}/g, tagsToUnwrapInLists[i])
                .replace(/\{otherContent\}/g, otherContentTags[j]);

            wymeditor.rawHtml(iterStartHtml);
            wymEqual(
                wymeditor,
                iterCorrectHtml,
                {
                    assertionString: iterString,
                    fixListSpacing: true,
                    parseHtml: true
                }
            );
        }
    }
}

module("XmlParser-unwrap_multiple_tags_in_list", {setup: prepareUnitTestModule});

var unwrapMultiInListHtml = String() +
    '<ul>' +
        '<li>Test</li>' +
        '<li><{blockTag}>Test</{blockTag}></li>' +
        '<li>Test</li>' +
    '</ul>';

var unwrapMultiAfterInListHtml = unwrapMultiInListHtml.replace(
    /(<\{blockTag\}>)/g, '{otherContent}$1'
);
var unwrapMultiBeforeInListHtml = unwrapMultiInListHtml.replace(
    /(<\/\{blockTag\}>)/g, '$1{otherContent}'
);
var unwrapMultiBothInListHtml = unwrapMultiInListHtml.replace(
    /(<\{blockTag\}>)/g, '{otherContent}$1'
).replace(
    /(<\/\{blockTag\}>)/g, '$1{otherContent}'
);

test("Unwrap root container content after block elements in simple list",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length * tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiAfterInListHtml,
        'block',
        "Unwrap `{blockTag}` content after `{otherContent}` content in " +
            "simple list"
    );
});

test("Unwrap root container content before block elements in simple list",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length * tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBeforeInListHtml,
        'block',
        "Unwrap `{blockTag}` content before `{otherContent}` content in " +
            "simple list"
    );
});

test("Unwrap root container content surrounded by block elements in simple " +
     "list", function () {
    QUnit.expect(tagsToUnwrapInLists.length * tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBothInListHtml,
        'block',
        "Unwrap `{blockTag}` content surrounded by `{otherContent}` content in " +
            "simple list"
    );
});

test("Unwrap root container content after inline elements in simple list",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length * inlineTagsToTestInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiAfterInListHtml,
        'inline',
        "Unwrap `{blockTag}` content after `{otherContent}` content in " +
            "simple list"
    );
});

test("Unwrap root container content before inline elements in simple list",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length * inlineTagsToTestInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBeforeInListHtml,
        'inline',
        "Unwrap `{blockTag}` content before `{otherContent}` content in " +
            "simple list"
    );
});

test("Unwrap root container content surrounded by inline elements in simple " +
     "list", function () {
    QUnit.expect(tagsToUnwrapInLists.length * inlineTagsToTestInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBothInListHtml,
        'inline',
        "Unwrap `{blockTag}` content surrounded by `{otherContent}` content in " +
            "simple list"
    );
});

test("Unwrap root container content after text node in simple list",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiAfterInListHtml,
        'text',
        "Unwrap `{blockTag}` content after `{otherContent}` content in " +
            "simple list"
    );
});

test("Unwrap root container content before text node in simple list",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBeforeInListHtml,
        'text',
        "Unwrap `{blockTag}` content before `{otherContent}` content in " +
            "simple list"
    );
});

test("Unwrap root container content surrounded by text nodes in simple " +
     "list", function () {
    QUnit.expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBothInListHtml,
        'text',
        "Unwrap `{blockTag}` content surrounded by `{otherContent}` content in " +
            "simple list"
    );
});

test("Unwrap root container content after table element in simple list",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiAfterInListHtml,
        'table',
        "Unwrap `{blockTag}` content after `{otherContent}` content in " +
            "simple list"
    );
});

test("Unwrap root container content before table element in simple list",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBeforeInListHtml,
        'table',
        "Unwrap `{blockTag}` content before `{otherContent}` content in " +
            "simple list"
    );
});

test("Unwrap root container content surrounded by table elements in simple " +
     "list", function () {
    QUnit.expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBothInListHtml,
        'table',
        "Unwrap `{blockTag}` content surrounded by `{otherContent}` content in " +
            "simple list"
    );
});


module("XmlParser-unwrap_multiple_tags_in_sublist", {setup: prepareUnitTestModule});

var unwrapMultiInSublistHtml = String() +
    '<ol>' +
        '<li>Test</li>' +
        '<li>' +
            '<ul>' +
                '<li>Test</li>' +
                '<li><{blockTag}>Test</{blockTag}></li>' +
                '<li>Test</li>' +
            '</ul>' +
        '</li>' +
        '<li><{blockTag}>Test</{blockTag}></li>' +
    '</ol>';

var unwrapMultiAfterInSublistHtml = unwrapMultiInSublistHtml.replace(
    /(<\{blockTag\}>)/g, '{otherContent}$1'
);
var unwrapMultiBeforeInSublistHtml = unwrapMultiInSublistHtml.replace(
    /(<\/\{blockTag\}>)/g, '$1{otherContent}'
);
var unwrapMultiBothInSublistHtml = unwrapMultiInSublistHtml.replace(
    /(<\{blockTag\}>)/g, '{otherContent}$1'
).replace(
    /(<\/\{blockTag\}>)/g, '$1{otherContent}'
);

test("Unwrap root container content after block elements in simple sublist",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length * tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiAfterInSublistHtml,
        'block',
        "Unwrap `{blockTag}` content after `{otherContent}` content in " +
            "simple sublist"
    );
});

test("Unwrap root container content before block elements in simple sublist",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length * tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBeforeInSublistHtml,
        'block',
        "Unwrap `{blockTag}` content before `{otherContent}` content in " +
            "simple sublist"
    );
});

test("Unwrap root container content surrounded by block elements in simple " +
     "sublist", function () {
    QUnit.expect(tagsToUnwrapInLists.length * tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBothInSublistHtml,
        'block',
        "Unwrap `{blockTag}` content surrounded by `{otherContent}` content in " +
            "simple sublist"
    );
});

test("Unwrap root container content after inline elements in simple sublist",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length * inlineTagsToTestInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiAfterInSublistHtml,
        'inline',
        "Unwrap `{blockTag}` content after `{otherContent}` content in " +
            "simple sublist"
    );
});

test("Unwrap root container content before inline elements in simple sublist",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length * inlineTagsToTestInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBeforeInSublistHtml,
        'inline',
        "Unwrap `{blockTag}` content before `{otherContent}` content in " +
            "simple sublist",
        true
    );
});

test("Unwrap root container content surrounded by inline elements in simple " +
     "sublist", function () {
    QUnit.expect(tagsToUnwrapInLists.length * inlineTagsToTestInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBothInSublistHtml,
        'inline',
        "Unwrap `{blockTag}` content surrounded by `{otherContent}` content in " +
            "simple sublist"
    );
});

test("Unwrap root container content after text node in simple sublist",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiAfterInSublistHtml,
        'text',
        "Unwrap `{blockTag}` content after `{otherContent}` content in " +
            "simple sublist"
    );
});

test("Unwrap root container content before text node in simple sublist",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBeforeInSublistHtml,
        'text',
        "Unwrap `{blockTag}` content before `{otherContent}` content in " +
            "simple sublist"
    );
});

test("Unwrap root container content surrounded by text nodes in simple " +
     "sublist", function () {
    QUnit.expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBothInSublistHtml,
        'text',
        "Unwrap `{blockTag}` content surrounded by `{otherContent}` content in " +
            "simple sublist"
    );
});

test("Unwrap root container content after table element in simple sublist",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiAfterInSublistHtml,
        'table',
        "Unwrap `{blockTag}` content after `{otherContent}` content in " +
            "simple sublist"
    );
});

test("Unwrap root container content before table element in simple sublist",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBeforeInSublistHtml,
        'table',
        "Unwrap `{blockTag}` content before `{otherContent}` content in " +
            "simple sublist"
    );
});

test("Unwrap root container content surrounded by table elements in simple " +
     "sublist", function () {
    QUnit.expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBothInSublistHtml,
        'table',
        "Unwrap `{blockTag}` content surrounded by `{otherContent}` content in " +
            "simple sublist"
    );
});

module("XmlParser-unwrap_multiple_tags_in_nested_list", {setup: prepareUnitTestModule});

var unwrapMultiInNestedListHtml = String() +
    '<ol>' +
        '<li>Test</li>' +
        '<li><{blockTag}>Test</{blockTag}>' +
            '<ul>' +
                '<li><{blockTag}>Test</{blockTag}></li>' +
                '<li>Test</li>' +
                '<li><{blockTag}>Test</{blockTag}>' +
                    '<ol>' +
                        '<li>Test</li>' +
                        '<li>Test</li>' +
                        '<li><{blockTag}>Test</{blockTag}></li>' +
                    '</ol>' +
                '</li>' +
            '</ul>' +
        '</li>' +
        '<li><{blockTag}>Test</{blockTag}></li>' +
    '</ol>';

var unwrapMultiAfterInNestedListHtml = unwrapMultiInNestedListHtml.replace(
    /(<\{blockTag\}>)/g, '{otherContent}$1'
);
var unwrapMultiBeforeInNestedListHtml = unwrapMultiInSublistHtml.replace(
    /(<\/\{blockTag\}>)/g, '$1{otherContent}'
);
var unwrapMultiBothInNestedListHtml = unwrapMultiInNestedListHtml.replace(
    /(<\{blockTag\}>)/g, '{otherContent}$1'
).replace(
    /(<\/\{blockTag\}>)/g, '$1{otherContent}'
);

test("Unwrap root container content after block elements in nested lists",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length * tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiAfterInNestedListHtml,
        'block',
        "Unwrap `{blockTag}` content after `{otherContent}` content in " +
            "nested lists"
    );
});

test("Unwrap root container content before block elements in nested lists",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length * tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBeforeInNestedListHtml,
        'block',
        "Unwrap `{blockTag}` content before `{otherContent}` content in " +
            "nested lists"
    );
});

test("Unwrap root container content surrounded by block elements in nested " +
     "sublist", function () {
    QUnit.expect(tagsToUnwrapInLists.length * tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBothInNestedListHtml,
        'block',
        "Unwrap `{blockTag}` content surrounded by `{otherContent}` content in " +
            "nested lists"
    );
});

test("Unwrap root container content after inline elements in nested lists",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length * inlineTagsToTestInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiAfterInNestedListHtml,
        'inline',
        "Unwrap `{blockTag}` content after `{otherContent}` content in " +
            "nested lists"
    );
});

test("Unwrap root container content before inline elements in nested lists",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length * inlineTagsToTestInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBeforeInNestedListHtml,
        'inline',
        "Unwrap `{blockTag}` content before `{otherContent}` content in " +
            "nested lists"
    );
});

test("Unwrap root container content surrounded by inline elements in nested " +
     "sublist", function () {
    QUnit.expect(tagsToUnwrapInLists.length * inlineTagsToTestInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBothInNestedListHtml,
        'inline',
        "Unwrap `{blockTag}` content surrounded by `{otherContent}` content in " +
            "nested lists"
    );
});

test("Unwrap root container content after text node in nested lists",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiAfterInNestedListHtml,
        'text',
        "Unwrap `{blockTag}` content after `{otherContent}` content in " +
            "nested lists"
    );
});

test("Unwrap root container content before text node in nested lists",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBeforeInNestedListHtml,
        'text',
        "Unwrap `{blockTag}` content before `{otherContent}` content in " +
            "nested lists"
    );
});

test("Unwrap root container content surrounded by text nodes in nested " +
     "sublist", function () {
    QUnit.expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBothInNestedListHtml,
        'text',
        "Unwrap `{blockTag}` content surrounded by `{otherContent}` content in " +
            "nested lists"
    );
});

test("Unwrap root container content after table element in nested lists",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiAfterInNestedListHtml,
        'table',
        "Unwrap `{blockTag}` content after `{otherContent}` content in " +
            "nested lists"
    );
});

test("Unwrap root container content before table element in nested lists",
     function () {
    QUnit.expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBeforeInNestedListHtml,
        'table',
        "Unwrap `{blockTag}` content before `{otherContent}` content in " +
            "nested lists"
    );
});

test("Unwrap root container content surrounded by table elements in nested " +
     "sublist", function () {
    QUnit.expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBothInNestedListHtml,
        'table',
        "Unwrap `{blockTag}` content surrounded by `{otherContent}` content in " +
            "nested lists"
    );
});

module("XmlParser-unwrap_nested_tags_in_list", {setup: prepareUnitTestModule});

var unwrapNestedDivStartHtml = String() +
    '<ul>' +
        '<li>Before</li>' +
        '<li>' +
            'Plain text top' +
            '<div>' +
                '<p>Paragraph top</p>' +
                '<div>' +
                    '<strong>Strong top</strong>' +
                    '<div>' +
                        '<em>Emphasis top</em>' +
                        '<div>' +
                            'Middle text' +
                        '</div>' +
                        '<em>Emphasis bottom</em>' +
                    '</div>' +
                    '<strong>Strong bottom</strong>' +
                '</div>' +
                '<p>Paragraph bottom</p>' +
            '</div>' +
            'Plain text bottom' +
        '</li>' +
        '<li>After</li>' +
    '</ul>';

var unwrapNestedDivCorrectHtml = String() +
    '<ul>' +
        '<li>Before</li>' +
        '<li>' +
            'Plain text top' +
            '<br />' +
            'Paragraph top' +
            '<br />' +
            '<strong>Strong top</strong>' +
            '<br />' +
            '<em>Emphasis top</em>' +
            '<br />' +
            'Middle text' +
            '<br />' +
            '<em>Emphasis bottom</em>' +
            '<br />' +
            '<strong>Strong bottom</strong>' +
            '<br />' +
            'Paragraph bottom' +
            '<br />' +
            'Plain text bottom' +
        '</li>' +
        '<li>After</li>' +
    '</ul>';


test("Unwrap content of nested DIV elements in list item", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0);

    wymeditor.rawHtml(unwrapNestedDivStartHtml);
    wymEqual(
        wymeditor,
        unwrapNestedDivCorrectHtml,
        {
            assertionString: "Unwrap content of nested `div` elements in a list item",
            fixListSpacing: true,
            parseHtml: true
        }
    );
});

module("XmlParser-allowed_block_elements", {setup: prepareUnitTestModule});

var blockElementsHtml = {};
blockElementsHtml.expected = [""
    , '<p>p1</p>'
    , '<p>p2</p>'
].join('');
blockElementsHtml.brInRoot = [""
    , '<br />'
    , '<p>p1</p>'
    , '<br />'
    , '<p>p2</p>'
    , '<br />'
].join('');

test("BR isn't allowed at the root", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0);

    wymeditor.rawHtml(blockElementsHtml.brInRoot);
    wymEqual(
        wymeditor,
        blockElementsHtml.expected,
        {
            assertionString: "BR removed from root",
            parseHtml: true
        }
    );
});

module("XmlParser-two_consecutive_br_limit", {setup: prepareUnitTestModule});

var oneBrVariationsWithId = [
    [""
        , '<ul id="0">'
            , '<li id="0.0">'
                , '<strong id="0.0.0">'
                    , '0.0.0.0'
                , '</strong>'
                , '<br id="0.0.1" />'
            , '</li>'
        , '</ul>'
    ].join(''),
    [""
        , '<ul id="0">'
            , '<li id="0.0">'
                , '<strong id="0.0.0">'
                    , '0.0.0.0'
                    , '<br id="0.0.0.1" />'
                , '</strong>'
            , '</li>'
        , '</ul>'
    ].join(''),
    [""
        , '<p id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
                , '<br id="0.0.1" />'
            , '</strong>'
        , '</p>'
    ].join(''),
    [""
        , '<p id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
            , '</strong>'
            , '<br id="0.1" />'
        , '</p>'
    ].join(''),
    [""
        , '<h1 id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
                , '<br id="0.0.1" />'
            , '</strong>'
        , '</h1>'
    ].join(''),
    [""
        , '<h1 id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
            , '</strong>'
            , '<br id="0.1" />'
        , '</h1>'
    ].join(''),
    [""
        , '<table id="0">'
            , '<tbody id="0.0">'
                , '<tr id="0.0.0">'
                    , '<td id="0.0.0.0">'
                        , '<strong id="0.0">'
                            , '0.0.0'
                            , '<br id="0.0.1" />'
                        , '</strong>'
                    , '</td>'
                , '</tr>'
            , '</tbody>'
        , '</table>'
    ].join(''),
    [""
        , '<table id="0">'
            , '<tbody id="0.0">'
                , '<tr id="0.0.0">'
                    , '<td id="0.0.0.0">'
                        , '<strong id="0.0">'
                            , '0.0.0'
                        , '</strong>'
                        , '<br id="0.1" />'
                    , '</td>'
                , '</tr>'
            , '</tbody>'
        , '</table>'
    ].join('')
];

var oneBrVariationsNoId = [
    [""
        , '<ul id="0">'
            , '<li id="0.0">'
                , '<strong id="0.0.0">'
                    , '0.0.0.0'
                , '</strong>'
                , '<br />'
            , '</li>'
        , '</ul>'
    ].join(''),
    [""
        , '<ul id="0">'
            , '<li id="0.0">'
                , '<strong id="0.0.0">'
                    , '0.0.0.0'
                    , '<br />'
                , '</strong>'
            , '</li>'
        , '</ul>'
    ].join(''),
    [""
        , '<p id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
                , '<br />'
            , '</strong>'
        , '</p>'
    ].join(''),
    [""
        , '<p id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
            , '</strong>'
            , '<br />'
        , '</p>'
    ].join(''),
    [""
        , '<h1 id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
                , '<br />'
            , '</strong>'
        , '</h1>'
    ].join(''),
    [""
        , '<h1 id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
            , '</strong>'
            , '<br />'
        , '</h1>'
    ].join(''),
    [""
        , '<table id="0">'
            , '<tbody id="0.0">'
                , '<tr id="0.0.0">'
                    , '<td id="0.0.0.0">'
                        , '<strong id="0.0">'
                            , '0.0.0'
                            , '<br />'
                        , '</strong>'
                    , '</td>'
                , '</tr>'
            , '</tbody>'
        , '</table>'
    ].join(''),
    [""
        , '<table id="0">'
            , '<tbody id="0.0">'
                , '<tr id="0.0.0">'
                    , '<td id="0.0.0.0">'
                        , '<strong id="0.0">'
                            , '0.0.0'
                        , '</strong>'
                        , '<br />'
                    , '</td>'
                , '</tr>'
            , '</tbody>'
        , '</table>'
    ].join('')
];

var twoBrVariationsWithId = [
    [""
        , '<ul id="0">'
            , '<li id="0.0">'
                , '<strong id="0.0.0">'
                    , '0.0.0.0'
                , '</strong>'
                , '<br id="0.0.1" />'
                , '<br id="0.0.2" />'
            , '</li>'
        , '</ul>'
    ].join(''),
    [""
        , '<ul id="0">'
            , '<li id="0.0">'
                , '<strong id="0.0.0">'
                    , '0.0.0.0'
                    , '<br id="0.0.0.1" />'
                    , '<br id="0.0.0.2" />'
                , '</strong>'
            , '</li>'
        , '</ul>'
    ].join(''),
    [""
        , '<p id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
            , '</strong>'
            , '<br id="0.1" />'
            , '<br id="0.2" />'
        , '</p>'
    ].join(''),
    [""
        , '<p id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
                , '<br id="0.0.1" />'
                , '<br id="0.0.2" />'
            , '</strong>'
        , '</p>'
    ].join(''),
    [""
        , '<h1 id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
                , '<br id="0.0.1" />'
                , '<br id="0.0.2" />'
            , '</strong>'
        , '</h1>'
    ].join(''),
    [""
        , '<h1 id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
            , '</strong>'
            , '<br id="0.1" />'
            , '<br id="0.2" />'
        , '</h1>'
    ].join(''),
    [""
        , '<table id="0">'
            , '<tbody id="0.0">'
                , '<tr id="0.0.0">'
                    , '<td id="0.0.0.0">'
                        , '<strong id="0.0">'
                            , '0.0.0'
                        , '</strong>'
                        , '<br id="0.1" />'
                        , '<br id="0.2" />'
                    , '</td>'
                , '</tr>'
            , '</tbody>'
        , '</table>'
    ].join(''),
    [""
        , '<table id="0">'
            , '<tbody id="0.0">'
                , '<tr id="0.0.0">'
                    , '<td id="0.0.0.0">'
                        , '<strong id="0.0">'
                            , '0.0.0'
                            , '<br id="0.0.1" />'
                            , '<br id="0.0.2" />'
                        , '</strong>'
                    , '</td>'
                , '</tr>'
            , '</tbody>'
        , '</table>'
    ].join('')
];

var twoBrVariationsNoId = [
    [""
        , '<ul id="0">'
            , '<li id="0.0">'
                , '<strong id="0.0.0">'
                    , '0.0.0.0'
                , '</strong>'
                , '<br />'
                , '<br />'
            , '</li>'
        , '</ul>'
    ].join(''),
    [""
        , '<ul id="0">'
            , '<li id="0.0">'
                , '<strong id="0.0.0">'
                    , '0.0.0.0'
                    , '<br />'
                    , '<br />'
                , '</strong>'
            , '</li>'
        , '</ul>'
    ].join(''),
    [""
        , '<p id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
                , '<br />'
                , '<br />'
            , '</strong>'
        , '</p>'
    ].join(''),
    [""
        , '<p id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
            , '</strong>'
            , '<br />'
            , '<br />'
        , '</p>'
    ].join(''),
    [""
        , '<h1 id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
                , '<br />'
                , '<br />'
            , '</strong>'
        , '</h1>'
    ].join(''),
    [""
        , '<h1 id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
            , '</strong>'
            , '<br />'
            , '<br />'
        , '</h1>'
    ].join(''),
    [""
        , '<table id="0">'
            , '<tbody id="0.0">'
                , '<tr id="0.0.0">'
                    , '<td id="0.0.0.0">'
                        , '<strong id="0.0">'
                            , '0.0.0'
                            , '<br />'
                            , '<br />'
                        , '</strong>'
                    , '</td>'
                , '</tr>'
            , '</tbody>'
        , '</table>'
    ].join(''),
    [""
        , '<table id="0">'
            , '<tbody id="0.0">'
                , '<tr id="0.0.0">'
                    , '<td id="0.0.0.0">'
                        , '<strong id="0.0">'
                            , '0.0.0'
                        , '</strong>'
                        , '<br />'
                        , '<br />'
                    , '</td>'
                , '</tr>'
            , '</tbody>'
        , '</table>'
    ].join('')
];

var threeBrVariationsWithId = [
    [""
        , '<ul id="0">'
            , '<li id="0.0">'
                , '<strong id="0.0.0">'
                    , '0.0.0.0'
                , '</strong>'
                , '<br id="0.0.1" />'
                , '<br id="0.0.2" />'
                , '<br id="0.0.3" />'
            , '</li>'
        , '</ul>'
    ].join(''),
    [""
        , '<ul id="0">'
            , '<li id="0.0">'
                , '<strong id="0.0.0">'
                    , '0.0.0.0'
                    , '<br id="0.0.0.1" />'
                    , '<br id="0.0.0.2" />'
                    , '<br id="0.0.0.3" />'
                , '</strong>'
            , '</li>'
        , '</ul>'
    ].join(''),
    [""
        , '<p id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
                , '<br id="0.0.1" />'
                , '<br id="0.0.2" />'
                , '<br id="0.0.3" />'
            , '</strong>'
        , '</p>'
    ].join(''),
    [""
        , '<p id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
            , '</strong>'
            , '<br id="0.1" />'
            , '<br id="0.2" />'
            , '<br id="0.3" />'
        , '</p>'
    ].join(''),
    [""
        , '<h1 id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
                , '<br id="0.0.1" />'
                , '<br id="0.0.2" />'
                , '<br id="0.0.3" />'
            , '</strong>'
        , '</h1>'
    ].join(''),
    [""
        , '<h1 id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
            , '</strong>'
            , '<br id="0.1" />'
            , '<br id="0.2" />'
            , '<br id="0.3" />'
        , '</h1>'
    ].join(''),
    [""
        , '<table id="0">'
            , '<tbody id="0.0">'
                , '<tr id="0.0.0">'
                    , '<td id="0.0.0.0">'
                        , '<strong id="0.0">'
                            , '0.0.0'
                            , '<br id="0.0.1" />'
                            , '<br id="0.0.2" />'
                            , '<br id="0.0.3" />'
                        , '</strong>'
                    , '</td>'
                , '</tr>'
            , '</tbody>'
        , '</table>'
    ].join(''),
    [""
        , '<table id="0">'
            , '<tbody id="0.0">'
                , '<tr id="0.0.0">'
                    , '<td id="0.0.0.0">'
                        , '<strong id="0.0">'
                            , '0.0.0'
                        , '</strong>'
                        , '<br id="0.1" />'
                        , '<br id="0.2" />'
                        , '<br id="0.3" />'
                    , '</td>'
                , '</tr>'
            , '</tbody>'
        , '</table>'
    ].join('')
];

var threeBrVariationsNoId = [
    [""
        , '<ul id="0">'
            , '<li id="0.0">'
                , '<strong id="0.0.0">'
                    , '0.0.0.0'
                , '</strong>'
                , '<br />'
                , '<br />'
                , '<br />'
            , '</li>'
        , '</ul>'
    ].join(''),
    [""
        , '<ul id="0">'
            , '<li id="0.0">'
                , '<strong id="0.0.0">'
                    , '0.0.0.0'
                    , '<br />'
                    , '<br />'
                    , '<br />'
                , '</strong>'
            , '</li>'
        , '</ul>'
    ].join(''),
    [""
        , '<p id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
                , '<br />'
                , '<br />'
                , '<br />'
            , '</strong>'
        , '</p>'
    ].join(''),
    [""
        , '<p id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
            , '</strong>'
            , '<br />'
            , '<br />'
            , '<br />'
        , '</p>'
    ].join(''),
    [""
        , '<h1 id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
                , '<br />'
                , '<br />'
                , '<br />'
            , '</strong>'
        , '</h1>'
    ].join(''),
    [""
        , '<h1 id="0">'
            , '<strong id="0.0">'
                , '0.0.0'
            , '</strong>'
            , '<br />'
            , '<br />'
            , '<br />'
        , '</h1>'
    ].join(''),
    [""
        , '<table id="0">'
            , '<tbody id="0.0">'
                , '<tr id="0.0.0">'
                    , '<td id="0.0.0.0">'
                        , '<strong id="0.0">'
                            , '0.0.0'
                            , '<br />'
                            , '<br />'
                            , '<br />'
                        , '</strong>'
                    , '</td>'
                , '</tr>'
            , '</tbody>'
        , '</table>'
    ].join(''),
    [""
        , '<table id="0">'
            , '<tbody id="0.0">'
                , '<tr id="0.0.0">'
                    , '<td id="0.0.0.0">'
                        , '<strong id="0.0">'
                            , '0.0.0'
                        , '</strong>'
                        , '<br />'
                        , '<br />'
                        , '<br />'
                    , '</td>'
                , '</tr>'
            , '</tbody>'
        , '</table>'
    ].join('')
];

test("One `br` variations with `id`s", function () {
    testNoChangeInHtmlArray(oneBrVariationsWithId, true);
});

test("One `br` variations without `id`s", function () {
    testNoChangeInHtmlArray(oneBrVariationsNoId, true);
});

test("Two `br` variations with `id`s", function () {
    testNoChangeInHtmlArray(twoBrVariationsWithId, true);
});

test("Two `br` variations without `id`s", function () {
    testNoChangeInHtmlArray(twoBrVariationsNoId, true);
});

test("Three `br` variations with `id`s", function () {
    testNoChangeInHtmlArray(threeBrVariationsWithId, true);
});

test("Three `br` variations without `id`s", function () {
    var wymeditor = jQuery.wymeditors(0),
        i;

    QUnit.expect(threeBrVariationsNoId.length);

    for (i = 0; i < threeBrVariationsNoId.length; i++) {
        wymeditor.rawHtml(threeBrVariationsNoId[i]);
        wymEqual(
            wymeditor,
            twoBrVariationsNoId[i],
            {
                assertionString: 'Variation ' + (i + 1) + ' of ' +
                    threeBrVariationsNoId.length,
                parseHtml: true
            }
        );
    }
});

var attributeWithRegexCharHTML = String() + '<a href="http://www.example.com)">Foo</a>';

test("Attributes with REGEX chars do not break parsing", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0);

    deepEqual(wymeditor.parser.parse(attributeWithRegexCharHTML), attributeWithRegexCharHTML);
});

module("XmlParser-auto_close_tags", {setup: prepareUnitTestModule});

var nestedTableHtml = String() +
        '<table>' +
            '<tbody>' +
                '<tr>' +
                    '<td>' +
                        '<table>' +
                            '<tbody>' +
                                '<tr>' +
                                    '<td>AAA</td>' +
                                '</tr>' +
                            '</tbody>' +
                        '</table>' +
                        '<strong>BBB</strong>' +
                        '<ul>' +
                            '<li>CCC</li>' +
                        '</ul>' +
                        'DDD' +
                    '</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>',
    unclosedOption = String() +
        '<select>' +
            '<option>AAA' +
            '<option>BBB</option>' +
        '</select>',
    closedOption = String() +
        '<select>' +
            '<option>AAA</option>' +
            '<option>BBB</option>' +
        '</select>',
    unclosedTable = String() +
        '<table>' +
            '<tbody>' +
                '<tr>' +
                    '<td>AAA' +
                    '<td>BBB</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>',
    closedTable = String() +
        '<table>' +
            '<tbody>' +
                '<tr>' +
                    '<td>AAA</td>' +
                    '<td>BBB</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>',
    unclosedTableLastInRow = String() +
        '<table>' +
            '<tbody>' +
                '<tr>' +
                    '<td>AAA</td>' +
                    '<td>BBB' +
                '</tr>' +
            '</tbody>' +
        '</table>',
    closedNestedTableHtml = String() +
        '<table>' +
            '<tbody>' +
                '<tr>' +
                    '<td>' +
                        '<table>' +
                            '<tbody>' +
                                '<tr>' +
                                    '<td>AAA</td>' +
                                    '<td>BBB</td>' +
                                '</tr>' +
                            '</tbody>' +
                        '</table>' +
                    '</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>',
    unclosedNestedTableHtml = String() +
        '<table>' +
            '<tbody>' +
                '<tr>' +
                    '<td>' +
                        '<table>' +
                            '<tbody>' +
                                '<tr>' +
                                    '<td>AAA' +
                                    '<td>BBB</td>' +
                                '</tr>' +
                            '</tbody>' +
                        '</table>' +
                    '</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>',
    unclosedNestedTableLastInRowHtml = String() +
        '<table>' +
            '<tbody>' +
                '<tr>' +
                    '<td>' +
                        '<table>' +
                            '<tbody>' +
                                '<tr>' +
                                    '<td>AAA</td>' +
                                    '<td>BBB' +
                                '</tr>' +
                            '</tbody>' +
                        '</table>' +
                    '</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>';

test("Test nested table html not reordered", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0);

    strictEqual(wymeditor.parser.parse(nestedTableHtml), nestedTableHtml);
});

test("Test unclosed option tag is closed", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0);

    strictEqual(wymeditor.parser.parse(unclosedOption), closedOption);
});

test("Test unclosed td tag is closed", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0);

    strictEqual(wymeditor.parser.parse(unclosedTable), closedTable);
});

test("Test unclosed last td tag is closed", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0);

    strictEqual(wymeditor.parser.parse(unclosedTableLastInRow), closedTable);
});

test("Test closed nested td tag is closed", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0);

    strictEqual(wymeditor.parser.parse(closedNestedTableHtml), closedNestedTableHtml);
});

test("Test unclosed nested td tag is closed", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0);

    strictEqual(wymeditor.parser.parse(unclosedNestedTableHtml), closedNestedTableHtml);
});

test("Test unclosed nested last in row td tag is closed", function () {
    QUnit.expect(1);
    var wymeditor = jQuery.wymeditors(0);

    strictEqual(wymeditor.parser.parse(unclosedNestedTableLastInRowHtml), closedNestedTableHtml);
});
