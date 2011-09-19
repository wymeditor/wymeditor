
// Whether or not we want to skip the tests that are known to be failing.
// Ideally, there would be no tests in this category, but right now there are
// a lot of table-related bugs that need to be fixed that aren't the number
// one priority. Having a test suite with failing tests is a bad thing though,
// because new contributors don't know which tests are "supposed to be failing."
// That lack of knowing makes the test suite much less useful than a test suite
// that should always be passing in all supported browsers.
var SKIP_KNOWN_FAILING_TESTS = true;

function setupWym() {
    if (WYMeditor.INSTANCES.length === 0) {
        stop(5000); // Stop test running until the editor is initialized
        jQuery('.wymeditor').wymeditor({
            stylesheet: 'styles.css',
            postInit: function(wym) {
                var listPlugin = new ListPlugin({}, wym);
                var tableEditor = wym.table();
                start(); // Re-start test running now that we're finished initializing
            }
        });
    }
}
module("Core", {setup: setupWym});

test("Instantiate", function() {
    expect(2);
    equals(WYMeditor.INSTANCES.length, 1, "WYMeditor.INSTANCES length");
    equals(typeof(jQuery.wymeditors(0)), 'object',
            "Type of first WYMeditor instance, using jQuery.wymeditors(0)");
});
/*
    Tests that require the WYMeditor instance to already be initialized.
    Calling this funtion as a postInit argument ensures they can pass.
*/
module("API", {setup: setupWym});

test("Commands", function() {
    expect(2);
    jQuery.wymeditors(0).toggleHtml();
    equals(jQuery('div.wym_html:visible', jQuery.wymeditors(0)._box).length, 1);
    jQuery.wymeditors(0).toggleHtml();
    equals(jQuery('div.wym_html:visible', jQuery.wymeditors(0)._box).length, 0);
});

module("CssParser", {setup: setupWym});

test("Configure classes items using CSS", function() {
    expect(2);
    ok(jQuery('div.wym_classes ul', jQuery.wymeditors(0)._box).length > 0,
            "Classes loaded" );
    equals(
            jQuery('div.wym_classes a:first-child', jQuery.wymeditors(0)._box).
                attr('name'),
            'date',
            "First loaded class name" );
});

module("XmlHelper", {setup: setupWym});

test("Should escape URL's only once #69.1", function() {
    expect(2);
    var original = "index.php?module=x&func=view&id=1";
    var expected = "index.php?module=x&amp;func=view&amp;id=1";
    equals(jQuery.wymeditors(0).helper.escapeOnce(original), expected,
            "Escape entities");
    equals(jQuery.wymeditors(0).helper.escapeOnce(expected), expected,
            "Avoids double entity escaping");
});

module("XmlParser", {setup: setupWym});

test("Should correct invalid lists", function() {
    expect(2);
    var expected = '' +
    '<ul>' +
        '<li>a' +
            '<ul>' +
                '<li>a.1<\/li>' +
            '<\/ul>' +
        '<\/li>' +
        '<li>b<\/li>' +
    '<\/ul>';
    // FF
    var design_mode_pseudo_html = '' +
    '<ul>' +
        '<li>a<\/li>' +
        '<ul>' +
            '<li>a.1<\/li>' +
        '<\/ul>' +
        '<li>b<br><\/li>' +
    '<\/ul>';
    equals(jQuery.wymeditors(0).parser.parse(design_mode_pseudo_html), expected,
            "on Firefox");
    // IE
    // IE has invalid sublist nesting
    expected = '' +
    '<ul>\r\n' +
        '<li>a' +
            '<ul>\r\n' +
                '<li>a.1<\/li>' +
            '<\/ul>' +
        '<\/li>\r\n' +
        '<li>b<\/li>' +
    '<\/ul>';
    design_mode_pseudo_html = '' +
    '<UL>\r\n' +
        '<LI>a<\/LI>\r\n' +
        '<UL>\r\n' +
            '<LI>a.1<\/LI>' +
        '<\/UL>\r\n' +
        '<LI>b<\/LI>' +
    '<\/UL>';
    equals(jQuery.wymeditors(0).parser.parse(design_mode_pseudo_html), expected,
            "on IE");
});

test("Should correct under-closed lists", function() {
    expect(1);
    // Taken from a mistake made during development that uncovered a
    // parsing issue where if an LI tag was left unclosed, IE did lots of
    // over-closing to compensate which completey broke list structure
    var missingClosingLiHtml = '' +
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
    '</ol>';

    var fixedHtml = '' +
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

test("Shouldn't remove empty td elements", function() {
    expect(1);
    var expected = '<table><tr><td>Cell1</td><td></td></tr></table>';
    var empty_cell = '<table><tr><td>Cell1</td><td></td></tr></table>';
    equals(jQuery.wymeditors(0).parser.parse(empty_cell), expected);
});

test("Should remove PRE line breaks (BR)", function() {
    expect(1);
    var original = '' +
    '<pre>One<br>Two<br>Three</pre>' +
    '<p>Test</p>' +
    '<pre>Three<br>Four<br>Five</pre>';
    var expected = '' +
    '<pre>One\r\nTwo\r\nThree</pre>' +
    '<p>Test</p>' +
    '<pre>Three\r\nFour\r\nFive</pre>';
    equals(jQuery.wymeditors(0).parser.parse(original), expected,
            "Remove BR in PRE");
});

test("Shouldn't strip colSpan attributes", function() {
    // http://trac.wymeditor.org/trac/ticket/223
    // IE8 uses colSpan for the colspan attribute. WYMeditor shouldn't strip it
    // just because of the camelCase
    expect(1);
    var original = '' +
    '<table>' +
        '<tr id="tr_1">' +
            '<td id="td_1_1" colSpan="2">1_1</td>' +
        '</tr>' +
        '<tr id="tr_2">' +
            '<td id="td_2_1">2_1</td>' +
            '<td id="td_2_2">2_2</td>' +
        '</tr>' +
    '</table>';
    var expected = '' +
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
            "Don't strip colSpan");
});

module("Post Init", {setup: setupWym});

test("Commands: html(), paste()", function() {
    expect(2);
    var testText1 = '<p>This is some text with which to test.<\/p>';
    jQuery.wymeditors(0).html(testText1);
    equals(jQuery.trim(jQuery.wymeditors(0).xhtml()), testText1);

    var testText2 = 'Some <strong>other text<\/strong> with which to test.';
    jQuery.wymeditors(0)._doc.body.focus();
    jQuery.wymeditors(0).paste(testText2);
    equals(jQuery.trim(jQuery.wymeditors(0).xhtml()),
    testText1 + '<p>' + testText2 + '<\/p>' );
});

test("Adding combined CSS selectors", function () {
    expect(1);

    var doc = jQuery.wymeditors(0)._doc,
    styles = doc.styleSheets[0];

    jQuery.wymeditors(0).addCssRule(
            styles, {name:'p,h1,h2', css:'font-style:italic'});
    equals(jQuery('p', doc).css('fontStyle'), 'italic', 'Font-style');
});

module("Table Insertion", {setup: setupWym});

test("Table is editable after insertion", function() {
    expect(7);

    var wymeditor = jQuery.wymeditors(0);
    wymeditor.html('');

    var $body = $(wymeditor._doc).find('body.wym_iframe');
    wymeditor.insertTable(3, 2, '', '');

    $body.find('td').each(function(index, td) {
        equals(isContentEditable(td), true);
    });

    var dm = wymeditor._doc.designMode;
    ok(dm == 'on' || dm == 'On');
});

// Only FF >= 3.5 seems to require content in <td> for them to be editable
if ($.browser.mozilla) {
    var table_3_2_html = "<table><tbody>" +
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
    test("Table cells are editable in FF > 3.5: table insert", function() {
        expect(12);

        var wymeditor = jQuery.wymeditors(0);
        wymeditor.html('');

        var $body = $(wymeditor._doc).find('body.wym_iframe');
        wymeditor.insertTable(3, 2, '', '');

        $body.find('td').each(function(index, td) {
            if ($.browser.version >= '1.9.1' && $.browser.version < '2.0') {
                equals(td.childNodes.length, 1);
            } else {
                equals(td.childNodes.length, 0);
            }
            equals(isContentEditable(td), true);
        });

    });

    test("Table cells are editable in FF > 3.5: html() insert", function() {
        expect(12);

        var wymeditor = jQuery.wymeditors(0);
        var $body = $(wymeditor._doc).find('body.wym_iframe');

        wymeditor.html('');
        wymeditor.html(table_3_2_html);
        $body.find('td').each(function(index, td) {
            // Both FF 3.6 and 4.0 add spacer brs with design mode
            equals(td.childNodes.length, 1);
            equals(isContentEditable(td), true);
        });
    });

    if (!SKIP_KNOWN_FAILING_TESTS) {
    test("Table cells are editable in FF > 3.5: via inner_html", function() {
        // This is currently broken. Doing a raw insert in to the editor
        // body doesn't let us use our fixBodyHtml() fix to add the
        // appropriate placeholder nodes inside the table cells
        // Need to figure out another way to detect this and correct
        // the HTML
        expect(12);

        var wymeditor = jQuery.wymeditors(0);
        var $body = $(wymeditor._doc).find('body.wym_iframe');

        $body.html(table_3_2_html);
        $body.find('td').each(function(index, td) {
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

test("Preformatted text retains spacing", function() {
    var preHtml = '' +
        '<pre>pre1\r\n' +
        'spaced\r\n\r\n' +
        'double  spaced' +
        '</pre>';

    // Webkit doesn't use \r\n newlines
    if ($.browser.webkit || $.browser.safari) {
        preHtml = preHtml.replace(/\r/g, '');
    }

    var wymeditor = jQuery.wymeditors(0);
    wymeditor.html(preHtml);

    var $body = $(wymeditor._doc).find('body.wym_iframe');
    var pre_children = $body.children('pre').contents();

    expect(8);
    equals(pre_children.length, 6,
            "Should have text, br, text, br, br, text");
    if (pre_children.length == 6) {
        equals(pre_children[0].nodeName.toLowerCase(), '#text');
        equals(pre_children[1].nodeName.toLowerCase(), 'br');
        equals(pre_children[2].nodeName.toLowerCase(), '#text');
        equals(pre_children[3].nodeName.toLowerCase(), 'br');
        equals(pre_children[4].nodeName.toLowerCase(), 'br');
        equals(pre_children[5].nodeName.toLowerCase(), '#text');
    }

    equals(wymeditor.xhtml(), preHtml);
});

module("soft return", {setup: setupWym});

test("Double soft returns are allowed", function() {
    var initHtml = '' +
        '<ul>' +
            '<li>li_1<br /><br />stuff</li>' +
        '</ul>';

    var wymeditor = jQuery.wymeditors(0);
    wymeditor.html(initHtml);

    wymeditor.fixBodyHtml();

    expect(1);
    equals(wymeditor.xhtml(), initHtml);
});
