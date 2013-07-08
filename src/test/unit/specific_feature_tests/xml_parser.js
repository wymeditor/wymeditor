// Tests for the XML parser

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
    wymeditor._html(orphanedLiHtml);
    htmlEquals(wymeditor, orphanedLiHtml);

    wymeditor._html(simpleOrphanedLiHtml);
    htmlEquals(wymeditor, simpleOrphanedLiHtml);

    wymeditor._html(listAfterText);
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

test("Self closing button tags should be expanded and removed", function () {
    var html = '<p><button /></p>';
    var expected = '<p></p>';
    equals(jQuery.wymeditors(0).parser.parse(html), expected);
});

test("Iframe should not be self closing", function () {
    var html = '<iframe width="480" height="390" src="asd.html" frameborder="0" /></iframe>';
    var expected = '<iframe width="480" height="390" src="asd.html" frameborder="0"></iframe>';
    equals(jQuery.wymeditors(0).parser.parse(html), expected);
});

test("Allow HR inside strong tags", function () {
    var html = '<strong>hello<hr /></strong>';
    equals(jQuery.wymeditors(0).parser.parse(html), html);
});

test("Allow line breaks inside em tags", function() {
    var html = '<em>hello<br />world</em>';
    wymeditor = jQuery.wymeditors(0);
    equals(wymeditor.parser.parse(html), html);
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
                    '<li id="li_1_1"><strong>li_1_1</strong><br>more text</li>' +
                '</ol>' +
            '</li>' +
        '</ol>',
        wymeditor = jQuery.wymeditors(0);

    equals(
        wymeditor.parser.parse(listHtml),
        listHtml
    );
    equals(
        wymeditor.parser.parse(listHtmlUnclosedBr),
        listHtml
    );

    // Now throw the browser/dom in the mix
    wymeditor._html(listHtml);
    htmlEquals(wymeditor, listHtml);

    wymeditor._html(listHtmlUnclosedBr);
    htmlEquals(wymeditor, listHtml);
});

module("XmlParser-editor_only_elements", {setup: setupWym});

var TEXT_CONTAINER_ELEMENTS = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                               'pre', 'blockquote', 'div'];
var TEXT_INLINE_ELEMENTS = ['a', 'span', 'strong', 'em'];
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
        $element = jQuery('<' + tagName + '>editor-only</' + tagName + '>');
        $element.attr("id", "editor-only-" + tagName);
        $element.addClass(WYMeditor.EDITOR_ONLY_CLASS);
        $body.find('#before-editor-only-element').after($element);

        htmlEquals(wymeditor, editorOnlyContainerStartHtml,
                   "Remove editor-only `" + tagName + "` element");
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
        $element = jQuery('<' + tagName + '> editor-only</' + tagName + '>');
        $element.attr("id", "editor-only-" + tagName);
        $element.addClass(WYMeditor.EDITOR_ONLY_CLASS);
        $body.find('#test-container').append($element);

        htmlEquals(wymeditor, editorOnlyInlineStartHtml,
                   "Remove editor-only `" + tagName + "` inline element");
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

    htmlEquals(wymeditor, editorOnlyContainerStartHtml,
               "Remove editor-only `table`");
});

test("Remove editor-only lists", function() {
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

        htmlEquals(wymeditor, editorOnlyContainerStartHtml,
                   "Remove editor-only `" + listType + "` list");
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
        $element = jQuery('<' + tagName + '/>');
        $element.attr("id", "editor-only-" + tagName);
        $element.addClass(WYMeditor.EDITOR_ONLY_CLASS);
        $body.find('#before-editor-only-element').after($element);

        htmlEquals(wymeditor, editorOnlyContainerStartHtml,
                   "Remove editor-only `" + tagName + "` element");
    }
});

test("Remove editor-only element with multiple classes", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        $element;

    wymeditor._html(editorOnlyContainerStartHtml);
    $element = jQuery('<p>Test</p>');
    $element.attr("id", "editor-only-multiclass");
    $element.addClass("foo");
    $element.addClass("bar");
    $element.addClass(WYMeditor.EDITOR_ONLY_CLASS);
    $element.addClass("baz");
    $body.find('#before-editor-only-element').after($element);

    htmlEquals(wymeditor, editorOnlyContainerStartHtml,
               "Remove editor-only `p` element with multiple classes");
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
    $img = jQuery('<img/>');
    $img.attr("id", "editor-only-img");
    $img.attr("src", "http://www.google.com/intl/en_com/images/srpr/logo3w.png");
    $img.addClass(WYMeditor.EDITOR_ONLY_CLASS);

    // Create an editor-only strong element
    $strong = jQuery('<strong>editor-only</strong>');
    $strong.attr("id", "editor-only-strong");
    $strong.addClass(WYMeditor.EDITOR_ONLY_CLASS);

    // Nest the strong and img inside an editor-only span element
    $span = jQuery('<span>editor-only </span>');
    $span.attr("id", "editor-only-span");
    $span.addClass(WYMeditor.EDITOR_ONLY_CLASS);
    $span.append($strong);
    $span.append($img);

    // Nest the span inside an editor-only p element
    $container = jQuery('<p>editor-only </p>');
    $container.attr("id", "remove-container");
    $container.addClass(WYMeditor.EDITOR_ONLY_CLASS);
    $container.append($span);

    $body.find('#before-editor-only-element').after($container);
    htmlEquals(wymeditor, editorOnlyContainerStartHtml,
               "Remove nested editor-only elements");
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
        '<li id="li_2">2'+
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
    htmlEquals(wymeditor, expectedHtml,
               "Remove editor-only invalid UL with LI sibling before it");
});

test("Remove editor-only invalid UL that's the first child of a UL", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        expectedHtml;

    wymeditor._html(invalidULStartNesting);
    $body.find('#ul_1').addClass(WYMeditor.EDITOR_ONLY_CLASS);

    expectedHtml = invalidULStartNesting.replace(/<ul id="ul\_1".*?<\/ul>/, '');
    htmlEquals(wymeditor, expectedHtml,
               "Remove editor-only UL that's the first child of a UL");
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
    htmlEquals(wymeditor, expectedHtml,
               "Remove editor-only LI with invalid UL sibling after it");
});

test("Remove editor-only LI with invalid UL sibling before it", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        expectedHtml;

    wymeditor._html(invalidULStartNesting);
    $body.find('#li_2').addClass(WYMeditor.EDITOR_ONLY_CLASS);

    expectedHtml = validULStartNesting.replace(/<li id="li\_2".*?<\/li>/, '');
    htmlEquals(wymeditor, expectedHtml,
               "Remove editor-only LI with invalid UL sibling before it");
});

test("Remove editor-only invalid LI nested within an LI", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        expectedHtml;

    wymeditor._html(invalidLINesting);
    $body.find('#li_2').addClass(WYMeditor.EDITOR_ONLY_CLASS);

    expectedHtml = validLINesting.replace(/<li id="li\_2".*?<\/li>/, '');
    htmlEquals(wymeditor, expectedHtml,
               "Remove editor-only LI with invalid UL sibling before it");
});

test("Remove editor-only LI with an invalid LI nested within it", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        expectedHtml;

    wymeditor._html(invalidLINesting);
    $body.find('#li_1').addClass(WYMeditor.EDITOR_ONLY_CLASS);

    expectedHtml = validLINesting.replace(/<li id="li\_1".*?<\/li>/, '');
    htmlEquals(wymeditor, expectedHtml,
               "Remove editor-only LI with an invalid LI nested within it");
});

test("Remove editor-only UL with invalid LI nesting within it", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        expectedHtml;

    wymeditor._html(invalidLINesting);
    $body.find('#ul_top').addClass(WYMeditor.EDITOR_ONLY_CLASS);

    expectedHtml = "";
    htmlEquals(wymeditor, expectedHtml,
               "Remove editor-only UL with invalid LI nesting within it");
});

