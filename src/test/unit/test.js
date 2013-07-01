
// We need to be able to operate in a noConflict context. Doing this during our
// tests ensures that remains the case.
jQuery.noConflict();

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

                $body = jQuery(wym._doc).find('body.wym_iframe');

                td = $body.find(tdSelector)[0];
                span = $body.find(spanSelector)[0];
                wym.tableEditor.selectElement($body.find(tdSelector)[0]);

                if (wym.selected() === span) {
                    WYMeditor._isInnerSelector = true;
                } else {
                    WYMeditor._isInnerSelector = false;
                }

                wym.structuredHeadings();

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
    wymeditor.html(listHtml);
    htmlEquals(wymeditor, listHtml);

    wymeditor.html(listHtmlUnclosedBr);
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
        wymeditor.html(editorOnlyContainerStartHtml);
        tagName = TEXT_CONTAINER_ELEMENTS[i];
        $element = jQuery('<' + tagName + '>editor-only</' + tagName + '>');
        $element.attr("id", "editor-only-" + tagName);
        $element.addClass(WYMeditor.EDITOR_ONLY_CLASS);
        $body.find('#before-editor-only-element').after($element);

        htmlEquals(wymeditor, editorOnlyContainerStartHtml,
                   "Remove editor only `" + tagName + "` element");
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
        wymeditor.html(editorOnlyInlineStartHtml);
        tagName = TEXT_INLINE_ELEMENTS[i];
        $element = jQuery('<' + tagName + '> editor-only</' + tagName + '>');
        $element.attr("id", "editor-only-" + tagName);
        $element.addClass(WYMeditor.EDITOR_ONLY_CLASS);
        $body.find('#test-container').append($element);

        htmlEquals(wymeditor, editorOnlyInlineStartHtml,
                   "Remove editor only `" + tagName + "` inline element");
    }
});

test("Remove editor-only table", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        table,
        i;

    wymeditor.html(editorOnlyContainerStartHtml);
    table = '<table id="editor-only-table" class="' +
                WYMeditor.EDITOR_ONLY_CLASS + '">';
    table += '<caption>editor-only</caption>';
    for (i = 0; i < 3; ++i) {
        table += '<tr><td>editor-only</td></tr>';
    }
    table += '</table>';
    $body.find('#before-editor-only-element').after(table);

    htmlEquals(wymeditor, editorOnlyContainerStartHtml,
               "Remove editor only `table`");
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
        wymeditor.html(editorOnlyContainerStartHtml);
        listType = WYMeditor.LIST_TYPE_ELEMENTS[i];
        list = '<' + listType + ' id="editor-only-list" class="' +
                    WYMeditor.EDITOR_ONLY_CLASS + '">';
        for (j = 0; j < 3; ++j) {
            list += '<li>editor-only</li>';
        }
        list += '</' + listType + '>';
        $body.find('#before-editor-only-element').after(list);

        htmlEquals(wymeditor, editorOnlyContainerStartHtml,
                   "Remove editor only `" + listType + "` list");
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
        wymeditor.html(editorOnlyContainerStartHtml);
        tagName = SELF_CLOSING_ELEMENTS[i];
        $element = jQuery('<' + tagName + '/>');
        $element.attr("id", "editor-only-" + tagName);
        $element.addClass(WYMeditor.EDITOR_ONLY_CLASS);
        $body.find('#before-editor-only-element').after($element);

        htmlEquals(wymeditor, editorOnlyContainerStartHtml,
                   "Remove editor only `" + tagName + "` element");
    }
});

test("Remove editor-only element with multiple classes", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        $element;

    wymeditor.html(editorOnlyContainerStartHtml);
    $element = jQuery('<p>Test</p>');
    $element.attr("id", "editor-only-multiclass");
    $element.addClass("foo");
    $element.addClass("bar");
    $element.addClass(WYMeditor.EDITOR_ONLY_CLASS);
    $element.addClass("baz");
    $body.find('#before-editor-only-element').after($element);

    htmlEquals(wymeditor, editorOnlyContainerStartHtml,
               "Remove editor only `p` element with multiple classes");
});

test("Remove nested editor-only elements", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        $container,
        $span,
        $strong,
        $img;

    wymeditor.html(editorOnlyContainerStartHtml);

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

module("Post Init", {setup: setupWym});

test("Sanity check: html()", function () {
    expect(1);
    var testText1 = '<p>This is some text with which to test.<\/p>',
        wymeditor = jQuery.wymeditors(0);

    wymeditor.html(testText1);
    htmlEquals(wymeditor, testText1);
});

if (!jQuery.browser.msie || !SKIP_KNOWN_FAILING_TESTS) {
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

    $body = jQuery(wymeditor._doc).find('body.wym_iframe');

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

module("table-insertion", {setup: setupWym});

test("Table is editable after insertion", function () {
    expect(7);

    var wymeditor = jQuery.wymeditors(0),
        $body,
        dm;
    wymeditor.html('');

    $body = jQuery(wymeditor._doc).find('body.wym_iframe');
    wymeditor.insertTable(3, 2, '', '');

    $body.find('td').each(function (index, td) {
        equals(isContentEditable(td), true);
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
        wymeditor.html('');

        $body = jQuery(wymeditor._doc).find('body.wym_iframe');
        wymeditor.insertTable(3, 2, '', '');

        $body.find('td').each(function (index, td) {
            if (parseInt(jQuery.browser.version, 10) == 1 &&
                jQuery.browser.version >= '1.9.1' && jQuery.browser.version < '2.0') {
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
            $body = jQuery(wymeditor._doc).find('body.wym_iframe');

        wymeditor.html('');
        wymeditor.html(table_3_2_html);
        $body.find('td').each(function (index, td) {
            // Both FF 3.6 and 4.0 add spacer brs with design mode
            equals(td.childNodes.length, 1);
            equals(isContentEditable(td), true);
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
        $table,
        i,
        j,
        selectionNum,
        stub,
        cellStr,
        idStr = 't' + caption.slice(-1);

    wymeditor.html(html);
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
            cellStr = (i+1) + '_' + (j+1);
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
                                WYMeditor.BLOCKING_ELEMENT_SPACER_CLASS +
                            '"/>';

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
            RegExp(TEST_LINEBREAK_SPACER, 'g'), '');

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

module("table-insert_in_list", {setup: setupWym});

test("Table insertion in the middle of a list with text selection", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe');

    setupTable(wymeditor, listForTableInsertion, '#li_2', 'text',
               1, 1, 'test_1');
    equals(normalizeHtml($body.get(0).firstChild), expectedMiddleOutFull,
           "Table insertion in the middle of a list with text selection");
});

test("Table insertion at the end of a list with text selection", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe');

        setupTable(wymeditor, listForTableInsertion, '#li_3', 'text',
                   1, 1, 'test_1');
        equals(normalizeHtml($body.get(0).firstChild), expectedEndOut,
               "Table insertion at the end of a list with text selection");
});

test("Table insertion in the middle of a list with collapsed selection", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe');

    setupTable(wymeditor, listForTableInsertion, '#li_2', 'collapsed',
               1, 1, 'test_1');
    equals(normalizeHtml($body.get(0).firstChild), expectedMiddleOutFull,
           "Table insertion in the middle of a list with collapsed selection");
});

test("Table insertion at the end of a list with collapsed selection", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe');

        setupTable(wymeditor, listForTableInsertion, '#li_3', 'collapsed',
                   1, 1, 'test_1');
        equals(normalizeHtml($body.get(0).firstChild), expectedEndOut,
               "Table insertion at the end of a list with collapsed selection");
});

// This test mimics the behavior that caused issue #406 which would
// unexpectedly nest an inserted table into another table within a list.
test("Table insertion with selection inside another table in a list", function () {
    expect(3);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe');

        // Try insert in td element
        setupTable(wymeditor, expectedListOneTable, '#t1_1_1', 'collapsed',
                   1, 1, 'test_2');
        equals(normalizeHtml($body.get(0).firstChild), expectedListTwoTables,
               "Table insertion with selection inside a td element in a list");

        // Try insert in th element
        setupTable(wymeditor, expectedListOneTable, '#t1_h_1', 'collapsed',
                   1, 1, 'test_2');
        equals(normalizeHtml($body.get(0).firstChild), expectedListTwoTables,
               "Table insertion with selection inside a th element in a list");

        // Try insert in caption element
        setupTable(wymeditor, expectedListOneTable, '#t1_cap', 'collapsed',
                   1, 1, 'test_2');
        equals(normalizeHtml($body.get(0).firstChild), expectedListTwoTables,
               "Table insertion with selection inside a caption element " +
               "in a list");
});

test("Table insertion with direct selection of list item node", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe');

    setupTable(wymeditor, expectedListOneTable, '#li_3', 'node',
               1, 1, 'test_2');
    equals(normalizeHtml($body.get(0).firstChild), expectedListTwoTables,
           "Table insertion with direct selection of list item node");
});

module("table-insert_in_sublist", {setup: setupWym});

test("Single table insertion into a sublist", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe');

    setupTable(wymeditor, sublistForTableInsertion, '#li_2', 'text',
               1, 1, 'test_1');
    equals(normalizeHtml($body.get(0).firstChild), expectedSublistOneTable,
           "Single table insertion within a sublist");
});

test("Double table insertion into a sublist", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe');

    setupTable(wymeditor, expectedSublistOneTable, '#li_2', 'text',
               2, 1, 'test_2');
    equals(normalizeHtml($body.get(0).firstChild), expectedSublistTwoTables,
           "Double table insertion within a sublist");
});

test("Triple table insertion into a sublist", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe');

    setupTable(wymeditor, expectedSublistTwoTables, '#li_2', 'text',
               3, 1, 'test_3');
    equals(normalizeHtml($body.get(0).firstChild),
           expectedSublistThreeTables,
           "Triple table insertion within a sublist");
});

module("table-parse_spacers_in_list", {setup: setupWym});
// The tests in this module use the htmlEquals function from utils.js to parse
// the resulting html from tables being inserted into a list or sublist using
// the parser to ensure that the line break spacers are properly removed.

test("Parse list with a table at the end", function () {
    var wymeditor = jQuery.wymeditors(0);

    wymeditor.html(expectedEndOut);
    htmlEquals(wymeditor, startEndOutNoBR);
});

test("Parse list with a table at the end in a sublist", function () {
    var wymeditor = jQuery.wymeditors(0);

    wymeditor.html(expectedEndIn);
    htmlEquals(wymeditor, startEndInNoBR);
});

test("Parse list with multiple tables in a sublist", function () {
    var wymeditor = jQuery.wymeditors(0);

    wymeditor.html(expectedSublistThreeTables);
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

        wymeditor.html(tableWithColspanTD);
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

        wymeditor.html(tableWithColspanTH);
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

    // Only ie and unsupported old firefox use \r\n newlines
    if (!jQuery.browser.msie) {
        preHtml = preHtml.replace(/\r/g, '');
    }

    wymeditor.html(preHtml);

    expect(1);
    equals(wymeditor.xhtml(), preHtml);
});

module("soft-return", {setup: setupWym});

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

module("image-styling", {setup: setupWym});

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
    $body = jQuery(wymeditor._doc).find('body.wym_iframe');

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
            '</p>';
        expectedHtmlIE = expectedHtml.replace(/<\/?p>/g, '');

    // Mimic the way images are inserted by the insert image tool by first
    // inserting the image with its src set to a unique stamp for
    // identification rather than its actual src.
    wymeditor.html('');
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

        initHtml = String () +
        '<' + containerType + '>' +
            'Test' +
        '</' + containerType + '>';

    wymeditor.html(initHtml);
    $container = $body.find(containerType);
    makeTextSelection(wymeditor, $container, $container, 0, 4);

    wymeditor.exec(command);
    return $container.find(tagName).length;
}

test("No span added to header after bolding", function () {
    expect(6);
    var wymeditor = jQuery.wymeditors(0),
        i;

    for (i = 1; i < 7; i++) {
        header = 'h' + i;
        ok(!checkTagInContainer(wymeditor, header, 'span', 'Bold'),
           "No span added to " + header + " on bold");
    }
});

