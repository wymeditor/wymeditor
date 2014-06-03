/* jshint camelcase: false, maxlen: 100 */
/* global setupWym, wymEqual,
test, expect, deepEqual */
"use strict";
// Tests for the XML parser

module("XmlParser", {setup: setupWym});

test("Empty is empty", function () {
    var wymeditor = jQuery.wymeditors(0);
    expect(2);

    wymeditor._html('');
    wymEqual(wymeditor, '');

    wymeditor._html('');
    // Placing the caret inside shouldn't create any content.
    wymeditor.setCaretIn(jQuery(wymeditor._doc).find('body.wym_iframe')[0]);
    wymEqual(wymeditor, '');
});

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

    deepEqual(jQuery.wymeditors(0).parser.parse(missingClosingLiHtml), fixedHtml);
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
    wymeditor._html(orphanedLiHtml);
    wymEqual(wymeditor, orphanedLiHtml);

    wymeditor._html(simpleOrphanedLiHtml);
    wymEqual(wymeditor, simpleOrphanedLiHtml);

    wymeditor._html(listAfterText);
    wymEqual(wymeditor, listAfterText);
});

test("Shouldn't remove empty td elements", function () {
    expect(1);
    var expected = '<table><tr><td>Cell1</td><td></td></tr></table>',
        empty_cell = '<table><tr><td>Cell1</td><td></td></tr></table>';
    deepEqual(jQuery.wymeditors(0).parser.parse(empty_cell), expected);
});

test("Should remove PRE line breaks (BR)", function () {
    expect(1);
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
    deepEqual(
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
    expect(4);
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
    wymeditor._html(listHtml);
    wymEqual(wymeditor, listHtml);

    wymeditor._html(listHtmlUnclosedBr);
    wymEqual(wymeditor, listHtml);
});

module("XmlParser-editor_only_elements", {setup: setupWym});

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
    expect(TEXT_CONTAINER_ELEMENTS.length);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        $element,
        tagName,
        i;

    for (i = 0; i < TEXT_CONTAINER_ELEMENTS.length; ++i) {
        wymeditor._html(editorOnlyContainerStartHtml);
        tagName = TEXT_CONTAINER_ELEMENTS[i];
        $element = jQuery('<' + tagName + '>editor-only</' + tagName + '>',
                          wymeditor._doc);
        $element.attr("id", "editor-only-" + tagName);
        $element.addClass(WYMeditor.EDITOR_ONLY_CLASS);
        $body.find('#before-editor-only-element').after($element);

        wymEqual(wymeditor, editorOnlyContainerStartHtml, {
            assertionString: "Remove editor-only `" + tagName + "` element"
        });
    }
});

test("Remove editor-only text inline elements", function () {
    expect(TEXT_INLINE_ELEMENTS.length);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        $element,
        tagName,
        i;

    for (i = 0; i < TEXT_INLINE_ELEMENTS.length; ++i) {
        wymeditor._html(editorOnlyInlineStartHtml);
        tagName = TEXT_INLINE_ELEMENTS[i];
        $element = jQuery('<' + tagName + '> editor-only</' + tagName + '>',
                          wymeditor._doc);
        $element.attr("id", "editor-only-" + tagName);
        $element.addClass(WYMeditor.EDITOR_ONLY_CLASS);
        $body.find('#test-container').append($element);

        wymEqual(wymeditor, editorOnlyInlineStartHtml, {
                assertionString: "Remove editor-only `" + tagName + "` inline element"
            });
    }
});

test("Remove editor-only table", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        table,
        i;

    wymeditor._html(editorOnlyContainerStartHtml);
    table = '<table id="editor-only-table" class="' +
                WYMeditor.EDITOR_ONLY_CLASS + '">';
    table += '<caption>editor-only</caption>';
    for (i = 0; i < 3; ++i) {
        table += '<tr><td>editor-only</td></tr>';
    }
    table += '</table>';
    $body.find('#before-editor-only-element').after(table);

    wymEqual(wymeditor, editorOnlyContainerStartHtml, {
        assertionString: "Remove editor-only `table`"
    });
});

test("Remove editor-only lists", function () {
    expect(WYMeditor.LIST_TYPE_ELEMENTS.length);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        listType,
        list,
        i,
        j;

    for (i = 0; i < WYMeditor.LIST_TYPE_ELEMENTS.length; ++i) {
        wymeditor._html(editorOnlyContainerStartHtml);
        listType = WYMeditor.LIST_TYPE_ELEMENTS[i];
        list = '<' + listType + ' id="editor-only-list" class="' +
                    WYMeditor.EDITOR_ONLY_CLASS + '">';
        for (j = 0; j < 3; ++j) {
            list += '<li>editor-only</li>';
        }
        list += '</' + listType + '>';
        $body.find('#before-editor-only-element').after(list);

        wymEqual(wymeditor, editorOnlyContainerStartHtml, {
            assertionString: "Remove editor-only `" + listType + "` list"
        });
    }
});

test("Remove editor-only self-closing elements", function () {
    expect(SELF_CLOSING_ELEMENTS.length);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        $element,
        tagName,
        i;

    for (i = 0; i < SELF_CLOSING_ELEMENTS.length; ++i) {
        wymeditor._html(editorOnlyContainerStartHtml);
        tagName = SELF_CLOSING_ELEMENTS[i];
        $element = jQuery('<' + tagName + '/>', wymeditor._doc);
        $element.attr("id", "editor-only-" + tagName);
        $element.addClass(WYMeditor.EDITOR_ONLY_CLASS);
        $body.find('#before-editor-only-element').after($element);

        wymEqual(wymeditor, editorOnlyContainerStartHtml, {
            assertionString: "Remove editor-only `" + tagName + "` element"
        });
    }
});

test("Remove editor-only element with multiple classes", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        $element;

    wymeditor._html(editorOnlyContainerStartHtml);
    $element = jQuery('<p>Test</p>', wymeditor._doc);
    $element.attr("id", "editor-only-multiclass");
    $element.addClass("foo");
    $element.addClass("bar");
    $element.addClass(WYMeditor.EDITOR_ONLY_CLASS);
    $element.addClass("baz");
    $body.find('#before-editor-only-element').after($element);

    wymEqual(wymeditor, editorOnlyContainerStartHtml, {
        assertionString: "Remove editor-only `p` element with multiple classes"
    });
});

test("Remove nested editor-only elements", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        $container,
        $span,
        $strong,
        $img;

    wymeditor._html(editorOnlyContainerStartHtml);

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
    wymEqual(wymeditor, editorOnlyContainerStartHtml, {
            assertionString: "Remove nested editor-only elements"
        });
});

module("XmlParser-editor_only_invalid_lists", {setup: setupWym});

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
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        expectedHtml;

    wymeditor._html(invalidULEndNesting);
    $body.find('#ul_2').addClass(WYMeditor.EDITOR_ONLY_CLASS);

    expectedHtml = validULEndNesting.replace(/<ul id="ul\_2".*?<\/ul>/, '');
    wymEqual(wymeditor, expectedHtml, {
            assertionString: "Remove editor-only invalid UL with LI sibling before it"
        });
});

test("Remove editor-only invalid UL that's the first child of a UL", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        expectedHtml;

    wymeditor._html(invalidULStartNesting);
    $body.find('#ul_1').addClass(WYMeditor.EDITOR_ONLY_CLASS);

    expectedHtml = invalidULStartNesting.replace(/<ul id="ul\_1".*?<\/ul>/, '');
    wymEqual(wymeditor, expectedHtml, {
            assertionString: "Remove editor-only UL that's the first child of a UL"
        });
});

test("Remove editor-only LI with invalid UL sibling after it", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        expectedHtml;

    wymeditor._html(invalidULEndNesting);
    $body.find('#li_2').addClass(WYMeditor.EDITOR_ONLY_CLASS);

    expectedHtml = validULEndNesting.replace(/<ul id="ul\_2".*?<\/ul>/, '');
    expectedHtml = expectedHtml.replace(/<li id="li\_2".*?<\/li>/, '');
    wymEqual(wymeditor, expectedHtml, {
            assertionString: "Remove editor-only LI with invalid UL sibling after it"
        });
});

test("Remove editor-only LI with invalid UL sibling before it", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        expectedHtml;

    wymeditor._html(invalidULStartNesting);
    $body.find('#li_2').addClass(WYMeditor.EDITOR_ONLY_CLASS);

    expectedHtml = validULStartNesting.replace(/<li id="li\_2".*?<\/li>/, '');
    wymEqual(wymeditor, expectedHtml, {
            assertionString: "Remove editor-only LI with invalid UL sibling before it"
        });
});

test("Remove editor-only invalid LI nested within an LI", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        expectedHtml;

    wymeditor._html(invalidLINesting);
    $body.find('#li_2').addClass(WYMeditor.EDITOR_ONLY_CLASS);

    expectedHtml = validLINesting.replace(/<li id="li\_2".*?<\/li>/, '');
    wymEqual(wymeditor, expectedHtml, {
            assertionString: "Remove editor-only LI with invalid UL sibling before it"
        });
});

test("Remove editor-only LI with an invalid LI nested within it", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        expectedHtml;

    wymeditor._html(invalidLINesting);
    $body.find('#li_1').addClass(WYMeditor.EDITOR_ONLY_CLASS);

    expectedHtml = validLINesting.replace(/<li id="li\_1".*?<\/li>/, '');
    wymEqual(wymeditor, expectedHtml, {
            assertionString: "Remove editor-only LI with an invalid LI nested within it"
        });
});

test("Remove editor-only UL with invalid LI nesting within it", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        expectedHtml;

    wymeditor._html(invalidLINesting);
    $body.find('#ul_top').addClass(WYMeditor.EDITOR_ONLY_CLASS);

    expectedHtml = "";
    wymEqual(wymeditor, expectedHtml, {
            assertionString: "Remove editor-only UL with invalid LI nesting within it"
        });
});


module("XmlParser-fix_style_spans", {setup: setupWym});

var startSpan = '<p>Test<span>Test</span></p>';

function testStyleSpan(newTag, spanStyle, assertionString) {
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        expectedHtml = startSpan.replace(/span/g, newTag);

    wymeditor._html(startSpan);
    $body.find('span').attr('style', spanStyle);

    wymEqual(wymeditor, expectedHtml, {
            assertionString: assertionString
        });
}

test("Fix bold style span", function () {
    expect(1);
    testStyleSpan("strong", "font-weight:bold;", "Fix bold style span");
});

test("Fix italic style span", function () {
    expect(1);
    testStyleSpan("em", "font-style:italic;", "Fix italic style span");
});

test("Fix superscript style span", function () {
    expect(1);
    testStyleSpan("sup", "vertical-align:super;", "Fix superscript style span");
});

test("Fix subscript style span", function () {
    expect(1);
    testStyleSpan("sub", "vertical-align:sub;", "Fix subscript style span");
});

module("XmlParser-remove_unwanted_classes", {setup: setupWym});

test("Remove 'apple-style-span' class", function () {
    expect(2);
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

    wymeditor._html(startHtmlSingleClass);
    wymEqual(wymeditor, expectedHtmlSingleClass, {
            assertionString: "'apple-style-span' removed from span with one class"
        });

    wymeditor._html(startHtmlMultiClass);
    wymEqual(wymeditor, expectedHtmlMultiClass, {
            assertionString: "'apple-style-span' removed from span with multiple classes"
        });
});

test("Class removal is case insensitive", function () {
    expect(1);
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

    wymeditor._html(startHtml);
    wymEqual(wymeditor, expectedHtml, {
            assertionString: "Class removal is case insensitive"
        });

    // Restore default
    WYMeditor.CLASSES_REMOVED_BY_PARSER = defaultClassesRemovedByParser;
});

module("XmlParser-unwrap_single_tag_in_list_item", {setup: setupWym});

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
        wymeditor._html(iterStartHtml);
        wymEqual(wymeditor, correctHtml, {
            assertionString: iterString,
            fixListSpacing: true
        });
    }
}

var unwrapSingleInListHtml = String() +
    '<ul>' +
        '<li>Test</li>' +
        '<li><{blockTag}>Test</{blockTag}></li>' +
        '<li>Test</li>' +
    '</ul>';

test("Unwrap root container content in simple list", function () {
    expect(tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length);
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

            wymeditor._html(iterStartHtml);
            wymEqual(wymeditor, iterCorrectHtml, {
                assertionString: iterString,
                fixListSpacing: true
            });
        }
    }
}

module("XmlParser-unwrap_multiple_tags_in_list", {setup: setupWym});

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
    expect(tagsToUnwrapInLists.length * tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length * tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length * tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length * inlineTagsToTestInLists.length);
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
    expect(tagsToUnwrapInLists.length * inlineTagsToTestInLists.length);
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
    expect(tagsToUnwrapInLists.length * inlineTagsToTestInLists.length);
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
    expect(tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBothInListHtml,
        'table',
        "Unwrap `{blockTag}` content surrounded by `{otherContent}` content in " +
            "simple list"
    );
});


module("XmlParser-unwrap_multiple_tags_in_sublist", {setup: setupWym});

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
    expect(tagsToUnwrapInLists.length * tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length * tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length * tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length * inlineTagsToTestInLists.length);
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
    expect(tagsToUnwrapInLists.length * inlineTagsToTestInLists.length);
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
    expect(tagsToUnwrapInLists.length * inlineTagsToTestInLists.length);
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
    expect(tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBothInSublistHtml,
        'table',
        "Unwrap `{blockTag}` content surrounded by `{otherContent}` content in " +
            "simple sublist"
    );
});

module("XmlParser-unwrap_multiple_tags_in_nested_list", {setup: setupWym});

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
    expect(tagsToUnwrapInLists.length * tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length * tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length * tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length * inlineTagsToTestInLists.length);
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
    expect(tagsToUnwrapInLists.length * inlineTagsToTestInLists.length);
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
    expect(tagsToUnwrapInLists.length * inlineTagsToTestInLists.length);
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
    expect(tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length);
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
    expect(tagsToUnwrapInLists.length);
    var wymeditor = jQuery.wymeditors(0);

    testUnwrapMultiContentInLI(wymeditor,
        unwrapMultiBothInNestedListHtml,
        'table',
        "Unwrap `{blockTag}` content surrounded by `{otherContent}` content in " +
            "nested lists"
    );
});

module("XmlParser-unwrap_nested_tags_in_list", {setup: setupWym});

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
    expect(1);
    var wymeditor = jQuery.wymeditors(0);

    wymeditor._html(unwrapNestedDivStartHtml);
    wymEqual(wymeditor, unwrapNestedDivCorrectHtml, {
        assertionString: "Unwrap content of nested `div` elements in a list item",
        fixListSpacing: true
    });
});

module("XmlParser-allowed_block_elements", {setup: setupWym});

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
    expect(1);
    var wymeditor = jQuery.wymeditors(0);

    wymeditor._html(blockElementsHtml.brInRoot);
    wymEqual(wymeditor, blockElementsHtml.expected, {
            assertionString: "BR removed from root"
        });
});
