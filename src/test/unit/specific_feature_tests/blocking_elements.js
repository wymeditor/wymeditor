/* jshint camelcase: false, maxlen: 85 */
/* global
    no_br_selection_browser,
    prepareUnitTestModule,
    QUnit,
    wymEqual,
    moveSelector,
    simulateKey,
    makeSelection,
    test,
    deepEqual
*/
"use strict";

/**
* Tests for special-casing certain block elements that make it impossible to
* add content before/after them when followed by another blocking element or by
* the start/end of the document.
*/

// Should be able to add content before/after/between block elements
module("Blocking Elements", {setup: prepareUnitTestModule});

// Can't move the selection to a <table> element
var no_table_selection_browser = jQuery.browser.webkit ||
    WYMeditor.isInternetExplorerPre11(),
    // keyup/keydown can't be used to fix textnode wrapping
    no_keypress_textnode_wrap_browser = jQuery.browser.msie,

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
        '<pre>pre1\n' +
        'spaced\n\n' +
        'double  spaced' +
        '</pre>';

// Webkit doesn't use \r\n newlines
if (jQuery.browser.webkit || jQuery.browser.safari) {
    h1BlockquotePreHtml = h1BlockquotePreHtml.replace(/\r/g, '');
}

// If there is no element in front of a table in FF or ie, it's not possible
// to put content in front of that table.
test("table has br spacers via .prepareDocForEditing()", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        children;
    wymeditor.rawHtml(tableHtml);
    wymeditor.prepareDocForEditing();

    $body = wymeditor.$body();
    children = $body.children();

    QUnit.expect(5);
    deepEqual(children.length, 3);
    if (children.length === 3) {
        deepEqual(children[0].tagName.toLowerCase(), 'br');
        deepEqual(children[1].tagName.toLowerCase(), 'table');
        deepEqual(children[2].tagName.toLowerCase(), 'br');
    }

    wymEqual(wymeditor, tableHtml, {parseHtml: true});
});

test("table has br spacers via table insertion", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        children;

    wymeditor.rawHtml('');
    $body = wymeditor.$body();
    wymeditor.setCaretIn($body[0]);
    wymeditor.insertTable(2, 3, '', '');

    children = $body.children();

    QUnit.expect(5);
    deepEqual(children.length, 3);
    if (children.length === 3) {
        deepEqual(children[0].tagName.toLowerCase(), 'br');
        deepEqual(children[1].tagName.toLowerCase(), 'table');
        deepEqual(children[2].tagName.toLowerCase(), 'br');
    }

    wymEqual(wymeditor, tableHtml, {parseHtml: true});
});

test("p + table has br spacers via .prepareDocForEditing()", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        children;
    wymeditor.rawHtml(pTableHtml);
    wymeditor.prepareDocForEditing();

    $body = wymeditor.$body();
    children = $body.children();

    QUnit.expect(6);
    deepEqual(children.length, 4);
    if (children.length === 4) {
        deepEqual(children[0].tagName.toLowerCase(), 'p');
        deepEqual(children[1].tagName.toLowerCase(), 'br');
        deepEqual(children[2].tagName.toLowerCase(), 'table');
        deepEqual(children[3].tagName.toLowerCase(), 'br');
    }

    wymEqual(wymeditor, pTableHtml, {parseHtml: true});
});

test("p + table has br spacers via table insertion", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        first_p,
        children;
    wymeditor.rawHtml('<p>p1</p>');

    $body = wymeditor.$body();

    // Move the selector to the first paragraph
    first_p = $body.find('p')[0];
    moveSelector(wymeditor, first_p);

    wymeditor.insertTable(2, 3, '', '');

    children = $body.children();

    QUnit.expect(7);
    deepEqual(children.length, 4);
    if (children.length === 4) {
        deepEqual(children[0].tagName.toLowerCase(), 'p');
        deepEqual(children[1].tagName.toLowerCase(), 'br');
        deepEqual(children[2].tagName.toLowerCase(), 'table');
        deepEqual(children[3].tagName.toLowerCase(), 'br');
    }

    wymEqual(wymeditor, pTableHtml, {parseHtml: true});
});

test("p + table + p has br spacers via .prepareDocForEditing()", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        children;
    wymeditor.rawHtml(pTablePHtml);
    wymeditor.prepareDocForEditing();

    $body = wymeditor.$body();
    children = $body.children();

    QUnit.expect(7);
    deepEqual(children.length, 5);
    if (children.length === 5) {
        deepEqual(children[0].tagName.toLowerCase(), 'p');
        deepEqual(children[1].tagName.toLowerCase(), 'br');
        deepEqual(children[2].tagName.toLowerCase(), 'table');
        deepEqual(children[3].tagName.toLowerCase(), 'br');
        deepEqual(children[4].tagName.toLowerCase(), 'p');
    }

    wymEqual(wymeditor, pTablePHtml, {parseHtml: true});
});

test("p + table + p has br spacers via table insertion", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        first_p,
        children;
    wymeditor.rawHtml('<p>p1</p><p>p2</p>');

    $body = wymeditor.$body();

    // Move the selector to the first paragraph
    first_p = $body.find('p')[0];
    moveSelector(wymeditor, first_p);

    wymeditor.insertTable(2, 3, '', '');

    children = $body.children();

    QUnit.expect(8);
    deepEqual(children.length, 5);
    if (children.length === 5) {
        deepEqual(children[0].tagName.toLowerCase(), 'p');
        deepEqual(children[1].tagName.toLowerCase(), 'br');
        deepEqual(children[2].tagName.toLowerCase(), 'table');
        deepEqual(children[3].tagName.toLowerCase(), 'br');
        deepEqual(children[4].tagName.toLowerCase(), 'p');
    }

    wymEqual(wymeditor, pTablePHtml, {parseHtml: true});
});

test("p + table + table + p has br spacers via " +
    ".prepareDocForEditing()", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        children;
    wymeditor.rawHtml(pTableTablePHtml);
    wymeditor.prepareDocForEditing();

    $body = wymeditor.$body();
    children = $body.children();

    QUnit.expect(9);
    deepEqual(children.length, 7);
    if (children.length === 7) {
        deepEqual(children[0].tagName.toLowerCase(), 'p');
        deepEqual(children[1].tagName.toLowerCase(), 'br');
        deepEqual(children[2].tagName.toLowerCase(), 'table');
        deepEqual(children[3].tagName.toLowerCase(), 'br');
        deepEqual(children[4].tagName.toLowerCase(), 'table');
        deepEqual(children[5].tagName.toLowerCase(), 'br');
        deepEqual(children[6].tagName.toLowerCase(), 'p');
    }

    wymEqual(wymeditor, pTableTablePHtml, {parseHtml: true});
});

test("p + table + table + p has br spacers via table insertion", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        first_p,
        children;
    wymeditor.rawHtml('<p>p1</p><p>p2</p>');

    $body = wymeditor.$body();

    // Move the selector to the first paragraph
    first_p = $body.find('p')[0];
    moveSelector(wymeditor, first_p);

    wymeditor.insertTable(2, 3, '', '');
    wymeditor.insertTable(2, 3, '', '');

    children = $body.children();

    QUnit.expect(10);
    deepEqual(children.length, 7);
    if (children.length === 7) {
        deepEqual(children[0].tagName.toLowerCase(), 'p');
        deepEqual(children[1].tagName.toLowerCase(), 'br');
        deepEqual(children[2].tagName.toLowerCase(), 'table');
        deepEqual(children[3].tagName.toLowerCase(), 'br');
        deepEqual(children[4].tagName.toLowerCase(), 'table');
        deepEqual(children[5].tagName.toLowerCase(), 'br');
        deepEqual(children[6].tagName.toLowerCase(), 'p');
    }

    wymEqual(wymeditor, pTableTablePHtml, {parseHtml: true});
});

test("h1 + blockquote + pre has br spacers via " +
    ".prepareDocForEditing()", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        children;
    wymeditor.rawHtml(h1BlockquotePreHtml);
    wymeditor.prepareDocForEditing();

    $body = wymeditor.$body();
    children = $body.children();

    QUnit.expect(8);
    deepEqual(children.length, 6);
    if (children.length === 6) {
        deepEqual(children[0].tagName.toLowerCase(), 'h1');
        deepEqual(children[1].tagName.toLowerCase(), 'br');
        deepEqual(children[2].tagName.toLowerCase(), 'blockquote');
        deepEqual(children[3].tagName.toLowerCase(), 'br');
        deepEqual(children[4].tagName.toLowerCase(), 'pre');
        deepEqual(children[5].tagName.toLowerCase(), 'br');
    }

    wymEqual(wymeditor, h1BlockquotePreHtml, {parseHtml: true});
});

test("br spacers aren't deleted when arrowing through them", function () {
    // the spacer <br /> shouldn't be turned in to a <p> when it gets cursor
    // focus
    var wymeditor = jQuery.wymeditors(0),
        $body,
        children;
    wymeditor.rawHtml(pTablePHtml);

    $body = wymeditor.$body();

    function checkLayout($body) {
        children = $body.children();
        deepEqual(children.length, 5);
        if (children.length === 5) {
            deepEqual(children[0].tagName.toLowerCase(), 'p');
            deepEqual(children[1].tagName.toLowerCase(), 'br');
            deepEqual(children[2].tagName.toLowerCase(), 'table');
            deepEqual(children[3].tagName.toLowerCase(), 'br');
            deepEqual(children[4].tagName.toLowerCase(), 'p');
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
            element = jQuery(element).find('td')[0];
        }

        moveSelector(wymeditor, element);
        simulateKey(WYMeditor.KEY_CODE.DOWN, wymeditor._doc); // Send DOWN

        checkLayout($body);
    });

    // Reset the HTML
    wymeditor.rawHtml(pTablePHtml);
    wymeditor.prepareDocForEditing();

    // Go through each top-level element and hit the UP key
    $body.children().each(function (index, element) {
        if (no_br_selection_browser && element.nodeName.toLowerCase() === 'br') {
            // We can't actually reliably select the br element with
            // javascript in this browser, so we can't test this
            return;
        } else if (no_table_selection_browser &&
                element.nodeName.toLowerCase() === 'table') {
            // Move to a td element within the table instead
            element = jQuery(element).find('td')[0];
        }

        moveSelector(wymeditor, element);

        simulateKey(WYMeditor.KEY_CODE.UP, wymeditor._doc);

        checkLayout($body);
    });
});

test("br spacers don't cause lots of blank p's when arrowing down", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        children;
    wymeditor.rawHtml(pTableHtml);

    $body = wymeditor.$body();

    // Move the selector to the br before the table
    makeSelection(wymeditor, $body[0], $body[0], 1, 1);

    simulateKey(WYMeditor.KEY_CODE.UP, wymeditor._doc);

    children = $body.children();

    QUnit.expect(6);
    deepEqual(children.length, 4, "Should have p, br, table, br");
    if (children.length === 4) {
        deepEqual(children[0].tagName.toLowerCase(), 'p');
        deepEqual(children[1].tagName.toLowerCase(), 'br');
        deepEqual(children[2].tagName.toLowerCase(), 'table');
        deepEqual(children[3].tagName.toLowerCase(), 'br');
    }

    wymEqual(wymeditor, pTableHtml, {parseHtml: true});
});

test("br spacers don't cause lots of blank p's when arrowing up", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        children;
    wymeditor.rawHtml(pTablePHtml);

    $body = wymeditor.$body();

    // Move the selector to the br after the table
    makeSelection(wymeditor, $body[0], $body[0], 3, 3);

    simulateKey(WYMeditor.KEY_CODE.DOWN, wymeditor._doc);

    children = $body.children();

    deepEqual(children.length, 5, "Should have p, br, table, br, p");
    if (children.length === 5) {
        deepEqual(children[0].tagName.toLowerCase(), 'p');
        deepEqual(children[1].tagName.toLowerCase(), 'br');
        deepEqual(children[2].tagName.toLowerCase(), 'table');
        deepEqual(children[3].tagName.toLowerCase(), 'br');
        deepEqual(children[4].tagName.toLowerCase(), 'p');
    }

    wymEqual(wymeditor, pTablePHtml, {parseHtml: true});
});

test("br spacers stay in place when content is inserted- post-br", function () {
    // A new paragraph after a table should keep a br after the table and
    // shouldn't keep the br after that paragraph
    var wymeditor = jQuery.wymeditors(0),
        $body,
        children;
    wymeditor.rawHtml(tableHtml);
    wymeditor.prepareDocForEditing();

    $body = wymeditor.$body();

    // Move the selector to the 2nd br (index 2)
    makeSelection(wymeditor, $body[0], $body[0], 2, 2);

    // Insert a paragraph after the table
    $body.children('table').after('<p>yo</p>');

    // Simulate and send the keystroke event to trigger fixing the dom
    simulateKey(WYMeditor.KEY_CODE.DOWN, wymeditor._doc);

    children = $body.children();

    deepEqual(children.length, 4, "Should have br, table, br, p");
    if (children.length === 4) {
        deepEqual(children[0].tagName.toLowerCase(), 'br');
        deepEqual(children[1].tagName.toLowerCase(), 'table');
        deepEqual(children[2].tagName.toLowerCase(), 'br');
        deepEqual(children[3].tagName.toLowerCase(), 'p');
    }

    wymEqual(wymeditor, tableHtml + '<p>yo</p>', {parseHtml: true});
});

if (!no_keypress_textnode_wrap_browser) {
    test("br spacers stay in place when content is inserted- pre-br", function () {
        // A br should remain in necessary spots even after content is inserted
        // there. Duplicate brs should also not be created when inserting that
        // content.
        var wymeditor = jQuery.wymeditors(0),
            $body,
            children;
        wymeditor.rawHtml(tableHtml);
        wymeditor.prepareDocForEditing();

        $body = wymeditor.$body();

        // Move the selector to the start
        moveSelector(wymeditor, $body[0]);

        // Simulate and send the keyup event
        simulateKey(WYMeditor.KEY_CODE.B, wymeditor._doc);

        children = $body.children();

        deepEqual(children.length, 4, "Should have p, br, table, br");
        if (children.length === 4) {
            deepEqual(children[0].tagName.toLowerCase(), 'p');
            deepEqual(children[1].tagName.toLowerCase(), 'br');
            deepEqual(children[2].tagName.toLowerCase(), 'table');
            deepEqual(children[3].tagName.toLowerCase(), 'br');
        }

        wymEqual(wymeditor, tableHtml, {parseHtml: true});
    });
}
