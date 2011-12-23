/**
* Tests for special-casing certain block elements that make it impossible to
* add content before/after them when followed by another blocking element or by
* the start/end of the document.
*/

// Should be able to add content before/after/between block elements
module("Blocking Elements", {setup: setupWym});

// Can't move the selection to a <br> element
var no_br_selection_browser = $.browser.webkit || $.browser.msie,
    // Can't move the selection to a <table> element
    no_table_selection_browser = $.browser.webkit || $.browser.msie,
    // keyup/keydown can't be used to fix textnode wrapping
    no_keypress_textnode_wrap_browser = $.browser.msie,
    // Double-br browsers need placeholders both before and after blocking
    // elements. Others just need placeholders before
    is_double_br_browser = ($.browser.mozilla ||
        $.browser.webkit ||
        $.browser.safari ||
        ($.browser.msie && $.browser.version >= "7.0")),

    tableHtml = String() +
        '<table>' +
            '<tbody>' +
                '<tr>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                '</tr>' +
                '<tr>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                '</tr>' +
            '</tbody>' +
        '</table>',
    pTableHtml = String() +
        '<p>p1</p>' +
        '<table>' +
            '<tbody>' +
                '<tr>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                '</tr>' +
                '<tr>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                '</tr>' +
            '</tbody>' +
        '</table>',
    pTablePHtml = String() +
        '<p>p1</p>' +
        '<table>' +
            '<tbody>' +
                '<tr>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                '</tr>' +
                '<tr>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<p>p2</p>',
    pTableTablePHtml = String() +
        '<p>p1</p>' +
        '<table>' +
            '<tbody>' +
                '<tr>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                '</tr>' +
                '<tr>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<table>' +
            '<tbody>' +
                '<tr>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                '</tr>' +
                '<tr>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                '</tr>' +
            '</tbody>' +
        '</table>' +
        '<p>p2</p>',
    h1BlockquotePreHtml = String() +
        '<h1>h1</h1>' +
        '<blockquote>bq1</blockquote>' +
        '<pre>pre1\r\n' +
        'spaced\r\n\r\n' +
        'double  spaced' +
        '</pre>';

// Webkit doesn't use \r\n newlines
if ($.browser.webkit || $.browser.safari) {
    h1BlockquotePreHtml = h1BlockquotePreHtml.replace(/\r/g, '');
}

// If there is no element in front of a table in FF or ie, it's not possible
// to put content in front of that table.
test("table has br spacers via .html()", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        children;
    wymeditor.html(tableHtml);

    $body = $(wymeditor._doc).find('body.wym_iframe');
    children = $body.children();

    if (is_double_br_browser) {
        expect(5);
        equals(children.length, 3);
        if (children.length === 3) {
            equals(children[0].tagName.toLowerCase(), 'br');
            equals(children[1].tagName.toLowerCase(), 'table');
            equals(children[2].tagName.toLowerCase(), 'br');
        }
    } else {
        expect(4);
        equals(children.length, 2);
        if (children.length === 2) {
            equals(children[0].tagName.toLowerCase(), 'br');
            equals(children[1].tagName.toLowerCase(), 'table');
        }
    }

    htmlEquals(wymeditor, tableHtml);
});

test("table has br spacers via table insertion", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        children;
    wymeditor.html('');
    wymeditor.insertTable(2, 3, '', '');

    $body = $(wymeditor._doc).find('body.wym_iframe');
    children = $body.children();

    if (is_double_br_browser) {
        expect(5);
        equals(children.length, 3);
        if (children.length === 3) {
            equals(children[0].tagName.toLowerCase(), 'br');
            equals(children[1].tagName.toLowerCase(), 'table');
            equals(children[2].tagName.toLowerCase(), 'br');
        }
    } else {
        expect(4);
        equals(children.length, 2);
        if (children.length === 2) {
            equals(children[0].tagName.toLowerCase(), 'br');
            equals(children[1].tagName.toLowerCase(), 'table');
        }
    }

    htmlEquals(wymeditor, tableHtml);
});

test("p + table has br spacers via .html()", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        children;
    wymeditor.html(pTableHtml);

    $body = $(wymeditor._doc).find('body.wym_iframe');
    children = $body.children();

    if (is_double_br_browser) {
        expect(6);
        equals(children.length, 4);
        if (children.length === 4) {
            equals(children[0].tagName.toLowerCase(), 'p');
            equals(children[1].tagName.toLowerCase(), 'br');
            equals(children[2].tagName.toLowerCase(), 'table');
            equals(children[3].tagName.toLowerCase(), 'br');
        }
    } else {
        expect(5);
        equals(children.length, 3);
        if (children.length === 3) {
            equals(children[0].tagName.toLowerCase(), 'p');
            equals(children[1].tagName.toLowerCase(), 'br');
            equals(children[2].tagName.toLowerCase(), 'table');
        }
    }

    htmlEquals(wymeditor, pTableHtml);
});

test("p + table has br spacers via table insertion", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        first_p,
        children;
    wymeditor.html('<p>p1</p>');

    $body = $(wymeditor._doc).find('body.wym_iframe');

    // Move the selector to the first paragraph
    first_p = $body.find('p')[0];
    moveSelector(wymeditor, first_p);

    wymeditor.insertTable(2, 3, '', '');

    children = $body.children();

    if (is_double_br_browser) {
        expect(7);
        equals(children.length, 4);
        if (children.length === 4) {
            equals(children[0].tagName.toLowerCase(), 'p');
            equals(children[1].tagName.toLowerCase(), 'br');
            equals(children[2].tagName.toLowerCase(), 'table');
            equals(children[3].tagName.toLowerCase(), 'br');
        }
    } else {
        expect(6);
        equals(children.length, 3);
        if (children.length === 3) {
            equals(children[0].tagName.toLowerCase(), 'p');
            equals(children[1].tagName.toLowerCase(), 'br');
            equals(children[2].tagName.toLowerCase(), 'table');
        }
    }

    htmlEquals(wymeditor, pTableHtml);
});

test("p + table + p has br spacers via .html()", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        children;
    wymeditor.html(pTablePHtml);

    $body = $(wymeditor._doc).find('body.wym_iframe');
    children = $body.children();

    expect(7);
    equals(children.length, 5);
    if (children.length === 5) {
        equals(children[0].tagName.toLowerCase(), 'p');
        equals(children[1].tagName.toLowerCase(), 'br');
        equals(children[2].tagName.toLowerCase(), 'table');
        equals(children[3].tagName.toLowerCase(), 'br');
        equals(children[4].tagName.toLowerCase(), 'p');
    }

    htmlEquals(wymeditor, pTablePHtml);
});

test("p + table + p has br spacers via table insertion", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        first_p,
        children;
    wymeditor.html('<p>p1</p><p>p2</p>');

    $body = $(wymeditor._doc).find('body.wym_iframe');

    // Move the selector to the first paragraph
    first_p = $body.find('p')[0];
    moveSelector(wymeditor, first_p);

    wymeditor.insertTable(2, 3, '', '');

    children = $body.children();

    expect(8);
    equals(children.length, 5);
    if (children.length === 5) {
        equals(children[0].tagName.toLowerCase(), 'p');
        equals(children[1].tagName.toLowerCase(), 'br');
        equals(children[2].tagName.toLowerCase(), 'table');
        equals(children[3].tagName.toLowerCase(), 'br');
        equals(children[4].tagName.toLowerCase(), 'p');
    }

    htmlEquals(wymeditor, pTablePHtml);
});

test("p + table + table + p has br spacers via .html()", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        children;
    wymeditor.html(pTableTablePHtml);

    $body = $(wymeditor._doc).find('body.wym_iframe');
    children = $body.children();

    expect(9);
    equals(children.length, 7);
    if (children.length === 7) {
        equals(children[0].tagName.toLowerCase(), 'p');
        equals(children[1].tagName.toLowerCase(), 'br');
        equals(children[2].tagName.toLowerCase(), 'table');
        equals(children[3].tagName.toLowerCase(), 'br');
        equals(children[4].tagName.toLowerCase(), 'table');
        equals(children[5].tagName.toLowerCase(), 'br');
        equals(children[6].tagName.toLowerCase(), 'p');
    }

    htmlEquals(wymeditor, pTableTablePHtml);
});

test("p + table + table + p has br spacers via table insertion", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        first_p,
        children;
    wymeditor.html('<p>p1</p><p>p2</p>');

    $body = $(wymeditor._doc).find('body.wym_iframe');

    // Move the selector to the first paragraph
    first_p = $body.find('p')[0];
    moveSelector(wymeditor, first_p);

    wymeditor.insertTable(2, 3, '', '');
    wymeditor.insertTable(2, 3, '', '');

    children = $body.children();

    expect(10);
    equals(children.length, 7);
    if (children.length === 7) {
        equals(children[0].tagName.toLowerCase(), 'p');
        equals(children[1].tagName.toLowerCase(), 'br');
        equals(children[2].tagName.toLowerCase(), 'table');
        equals(children[3].tagName.toLowerCase(), 'br');
        equals(children[4].tagName.toLowerCase(), 'table');
        equals(children[5].tagName.toLowerCase(), 'br');
        equals(children[6].tagName.toLowerCase(), 'p');
    }

    htmlEquals(wymeditor, pTableTablePHtml);
});

test("h1 + blockquote + pre has br spacers via .html()", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        children;
    wymeditor.html(h1BlockquotePreHtml);

    $body = $(wymeditor._doc).find('body.wym_iframe');
    children = $body.children();

    if (is_double_br_browser) {
        expect(8);
        equals(children.length, 6);
        if (children.length === 6) {
            equals(children[0].tagName.toLowerCase(), 'h1');
            equals(children[1].tagName.toLowerCase(), 'br');
            equals(children[2].tagName.toLowerCase(), 'blockquote');
            equals(children[3].tagName.toLowerCase(), 'br');
            equals(children[4].tagName.toLowerCase(), 'pre');
            equals(children[5].tagName.toLowerCase(), 'br');
        }
    } else {
        expect(7);
        equals(children.length, 5);
        if (children.length === 5) {
            equals(children[0].tagName.toLowerCase(), 'h1');
            equals(children[1].tagName.toLowerCase(), 'br');
            equals(children[2].tagName.toLowerCase(), 'blockquote');
            equals(children[3].tagName.toLowerCase(), 'br');
            equals(children[4].tagName.toLowerCase(), 'pre');
        }
    }

    htmlEquals(wymeditor, h1BlockquotePreHtml);
});

test("br spacers aren't deleted when arrowing through them", function () {
    // the spacer <br> shouldn't be turned in to a <p> when it gets cursor
    // focus
    var wymeditor = jQuery.wymeditors(0),
        $body,
        children;
    wymeditor.html(pTablePHtml);

    $body = $(wymeditor._doc).find('body.wym_iframe');

    function checkLayout($body) {
        children = $body.children();
        equals(children.length, 5);
        if (children.length === 5) {
            equals(children[0].tagName.toLowerCase(), 'p');
            equals(children[1].tagName.toLowerCase(), 'br');
            equals(children[2].tagName.toLowerCase(), 'table');
            equals(children[3].tagName.toLowerCase(), 'br');
            equals(children[4].tagName.toLowerCase(), 'p');
        }
    }

    // Go through each top-level element and hit the DOWN key
    $body.children().each(function (index, element) {
        if (no_br_selection_browser && element.nodeName.toLowerCase() === 'br') {
            // We can't actually reliably select the br element with
            // javascript in this browser, so we can't test this
            return;
        } else if (no_table_selection_browser &&
                element.nodeName.toLowerCase() === 'table') {
            // Move to a td element within the table instead
            element = $(element).find('td')[0];
        }

        moveSelector(wymeditor, element);
        simulateKey(WYMeditor.KEY.DOWN, wymeditor._doc); // Send DOWN

        checkLayout($body);
    });

    // Reset the HTML
    wymeditor.html(pTablePHtml);
    wymeditor.fixBodyHtml();

    // Go through each top-level element and hit the UP key
    $body.children().each(function (index, element) {
        if (no_br_selection_browser && element.nodeName.toLowerCase() === 'br') {
            // We can't actually reliably select the br element with
            // javascript in this browser, so we can't test this
            return;
        } else if (no_table_selection_browser &&
                element.nodeName.toLowerCase() === 'table') {
            // Move to a td element within the table instead
            element = $(element).find('td')[0];
        }

        moveSelector(wymeditor, element);

        simulateKey(WYMeditor.KEY.UP, wymeditor._doc);

        checkLayout($body);
    });
});

test("br spacers don't cause lots of blank p's when arrowing down", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        children;
    wymeditor.html(pTableHtml);

    $body = $(wymeditor._doc).find('body.wym_iframe');

    // Move the selector to the br before the table
    makeSelection(wymeditor, $body[0], $body[0], 1, 1);

    simulateKey(WYMeditor.KEY.UP, wymeditor._doc);

    children = $body.children();

    if (is_double_br_browser) {
        expect(6);
        equals(children.length, 4, "Should have p, br, table, br");
        if (children.length === 4) {
            equals(children[0].tagName.toLowerCase(), 'p');
            equals(children[1].tagName.toLowerCase(), 'br');
            equals(children[2].tagName.toLowerCase(), 'table');
            equals(children[3].tagName.toLowerCase(), 'br');
        }
    } else {
        expect(5);
        equals(children.length, 3, "Should have p, br, table");
        if (children.length === 3) {
            equals(children[0].tagName.toLowerCase(), 'p');
            equals(children[1].tagName.toLowerCase(), 'br');
            equals(children[2].tagName.toLowerCase(), 'table');
        }
    }

    htmlEquals(wymeditor, pTableHtml);
});

test("br spacers don't cause lots of blank p's when arrowing up", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        children;
    wymeditor.html(pTablePHtml);

    $body = $(wymeditor._doc).find('body.wym_iframe');

    // Move the selector to the br after the table
    makeSelection(wymeditor, $body[0], $body[0], 3, 3);

    simulateKey(WYMeditor.KEY.DOWN, wymeditor._doc);

    children = $body.children();

    equals(children.length, 5, "Should have p, br, table, br, p");
    if (children.length === 5) {
        equals(children[0].tagName.toLowerCase(), 'p');
        equals(children[1].tagName.toLowerCase(), 'br');
        equals(children[2].tagName.toLowerCase(), 'table');
        equals(children[3].tagName.toLowerCase(), 'br');
        equals(children[4].tagName.toLowerCase(), 'p');
    }

    htmlEquals(wymeditor, pTablePHtml);
});

test("br spacers stay in place when content is inserted- post-br", function () {
    // A new paragraph after a table should keep a br after the table and
    // shouldn't keep the br after that paragraph
    var wymeditor = jQuery.wymeditors(0),
        $body,
        children;
    wymeditor.html(tableHtml);

    $body = $(wymeditor._doc).find('body.wym_iframe');

    // Move the selector to the 2nd br (index 2)
    makeSelection(wymeditor, $body[0], $body[0], 2, 2);

    // Insert a paragraph after the table
    $body.children('table').after('<p>yo</p>');

    // Simulate and send the keystroke event to trigger fixing the dom
    simulateKey(WYMeditor.KEY.DOWN, wymeditor._doc);

    children = $body.children();

    equals(children.length, 4, "Should have br, table, br, p");
    if (children.length === 4) {
        equals(children[0].tagName.toLowerCase(), 'br');
        equals(children[1].tagName.toLowerCase(), 'table');
        equals(children[2].tagName.toLowerCase(), 'br');
        equals(children[3].tagName.toLowerCase(), 'p');
    }

    htmlEquals(wymeditor, tableHtml + '<p>yo</p>');
});

test("br spacers stay in place when content is inserted- pre-br", function () {
    // A br should remain in necessary spots even after content is inserted
    // there. Duplicate brs should also not be created when inserting that
    // content.
    if (no_keypress_textnode_wrap_browser) {
        return;
    }
    var wymeditor = jQuery.wymeditors(0),
        $body,
        children;
    wymeditor.html(tableHtml);

    $body = $(wymeditor._doc).find('body.wym_iframe');

    // Move the selector to the start
    moveSelector(wymeditor, $body[0]);

    // Simulate and send the keyup event
    simulateKey(WYMeditor.KEY.B, wymeditor._doc);

    children = $body.children();

    equals(children.length, 4, "Should have p, br, table, br");
    if (children.length === 4) {
        equals(children[0].tagName.toLowerCase(), 'p');
        equals(children[1].tagName.toLowerCase(), 'br');
        equals(children[2].tagName.toLowerCase(), 'table');
        equals(children[3].tagName.toLowerCase(), 'br');
    }

    htmlEquals(wymeditor, tableHtml);
});
