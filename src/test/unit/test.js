module("Core");

test("Instantiate", function() {
	expect(2);
	jQuery('.wymeditor').wymeditor({
		stylesheet: 'styles.css',
		postInit: function() { runPostInitTests() }
	});
	equals( WYMeditor.INSTANCES.length, 1, "WYMeditor.INSTANCES length" );
	equals( typeof(jQuery.wymeditors(0)), 'object', "Type of first WYMeditor instance, using jQuery.wymeditors(0)" );
});

module("API");

test("Commands", function() {
	expect(2);
	jQuery.wymeditors(0).toggleHtml();
	equals( jQuery('div.wym_html:visible', jQuery.wymeditors(0)._box).length, 1 );
	jQuery.wymeditors(0).toggleHtml();
	equals( jQuery('div.wym_html:visible', jQuery.wymeditors(0)._box).length, 0 );
});

module("CssParser");

test("Configure classes items using CSS", function() {
	expect(2);
	ok( jQuery('div.wym_classes ul', jQuery.wymeditors(0)._box).length > 0, "Classes loaded" );
	equals( jQuery('div.wym_classes a:first-child', jQuery.wymeditors(0)._box).attr('name'), 'date', "First loaded class name" );
});

module("XmlHelper");

test("Should escape URL's only once #69.1", function() {
	expect(2);
	var original = "index.php?module=x&func=view&id=1";
	var expected = "index.php?module=x&amp;func=view&amp;id=1";
	equals( jQuery.wymeditors(0).helper.escapeOnce( original ), expected, "Escape entities");
	equals( jQuery.wymeditors(0).helper.escapeOnce( expected ), expected, "Avoids double entity escaping");
});

module("XmlParser");

test("Should correct invalid lists", function() {
	expect(2);
	var expected = "<ul><li>a<ul><li>a.1<\/li><\/ul><\/li><li>b<\/li><\/ul>";
	// FF
	var design_mode_pseudo_html = "<ul><li>a<\/li><ul><li>a.1<\/li><\/ul><li>b<br><\/li><\/ul>";
	equals( jQuery.wymeditors(0).parser.parse(design_mode_pseudo_html), expected, "on Firefox");
	// IE
	// IE has invalid sublist nesting
	var expected = "<ul>\r\n<li>a<ul>\r\n<li>a.1<\/li><\/ul><\/li>\r\n<li>b<\/li><\/ul>";
	var design_mode_pseudo_html = "<UL>\r\n<LI>a<\/LI>\r\n<UL>\r\n<LI>a.1<\/LI><\/UL>\r\n<LI>b<\/LI><\/UL>";
	equals( jQuery.wymeditors(0).parser.parse(design_mode_pseudo_html), expected, "on IE");
});

test("Shouldn't remove empty td elements", function() {
	expect(1);
	var expected = '<table><tr><td>Cell1</td><td></td></tr></table>';
	var empty_cell = '<table><tr><td>Cell1</td><td></td></tr></table>';
	equals( jQuery.wymeditors(0).parser.parse(empty_cell), expected);
});

test("Should remove PRE line breaks (BR)", function() {
	expect(1);
	var original = "<pre>One<br>Two<br>Three</pre><p>Test</p><pre>Three<br>Four<br>Five</pre>";
	var expected = "<pre>One\r\nTwo\r\nThree</pre><p>Test</p><pre>Three\r\nFour\r\nFive</pre>";
	equals( jQuery.wymeditors(0).parser.parse(original), expected, "Remove BR in PRE" );
});



function runPostInitTests() {
	module("Post Init");

	test("Commands: html(), paste()", function() {
		expect(2);
		var testText1 = '<p>This is some text with which to test.<\/p>';
		jQuery.wymeditors(0).html( testText1 );
		equals( jQuery.trim( jQuery.wymeditors(0).xhtml() ), testText1 );

		var testText2 = 'Some <strong>other text<\/strong> with which to test.';
		jQuery.wymeditors(0)._doc.body.focus();
		jQuery.wymeditors(0).paste( testText2 );
		equals( jQuery.trim( jQuery.wymeditors(0).xhtml() ), testText1 + '<p>' + testText2 + '<\/p>' );
	});

	test("Adding combined CSS selectors", function () {
		expect(1);

		var doc = jQuery.wymeditors(0)._doc,
		styles = doc.styleSheets[0];

		jQuery.wymeditors(0).addCssRule(styles, {name:'p,h1,h2', css:'font-style:italic'});
		equals( jQuery('p', doc).css('fontStyle'), 'italic', 'Font-style' );
	});

	runListTests();
	runBlockingElementTests();

	module("Table Insertion");

	test("Table is editable after insertion", function() {
		expect(7);

		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html('');

		var $body = $(wymeditor._doc).find('body.wym_iframe');
		wymeditor.insertTable( 3, 2, '', '' );

		$body.find('td').each(function(index, td) {
			equals( isContentEditable(td), true );
		});

		var dm = wymeditor._doc.designMode
		ok( dm == 'on' || dm == 'On' );
	});

		// Only FF >= 3.5 seems to require content in <td> for them to be editable
	if($.browser.mozilla) {
		test("Table cells have content in FF > 3.5", function() {
			expect(7);

			var wymeditor = jQuery.wymeditors(0);
			wymeditor.html('');

			var $body = $(wymeditor._doc).find('body.wym_iframe');
			wymeditor.insertTable( 3, 2, '', '' );

			$body.find('td').each(function(index, td) {
				if( $.browser.version >= '1.9.1' ) {
					equals( td.childNodes.length, 1 );
				} else {
					equals( td.childNodes.length, 0 );
				}
			});

			wymeditor.html('');
			wymeditor.html('<table><tbody><tr><td></td></tr></tbody></table>');
			$body.find('td').each(function(index, td) {
				if( $.browser.version >= '1.9.1' ) {
					equals( td.childNodes.length, 1 );
				} else {
					equals( td.childNodes.length, 0 );
				}
			});
		});
	}

	module("preformatted text");

	test("Preformatted text retains spacing", function() {
		var preHtml = '' +
			'<pre>pre1\r\n' +
			'spaced\r\n\r\n' +
			'double  spaced' +
			'</pre>';

		// Webkit doesn't use \r\n newlines
		if( $.browser.webkit || $.browser.safari ) {
			preHtml = preHtml.replace(/\r/g, '');
		}

		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html( preHtml );

		var $body = $(wymeditor._doc).find('body.wym_iframe');
		var pre_children = $body.children('pre').contents();

		expect(8);
		equals( pre_children.length, 6, "Should have text, br, text, br, br, text");
		if ( pre_children.length == 6 ) {
			equals( pre_children[0].nodeName.toLowerCase(), '#text' );
			equals( pre_children[1].nodeName.toLowerCase(), 'br' );
			equals( pre_children[2].nodeName.toLowerCase(), '#text' );
			equals( pre_children[3].nodeName.toLowerCase(), 'br' );
			equals( pre_children[4].nodeName.toLowerCase(), 'br' );
			equals( pre_children[5].nodeName.toLowerCase(), '#text' );
		}

		equals( wymeditor.xhtml(), preHtml);
	});

	module("soft return");

	test("Double soft returns are allowed", function() {
		var initHtml = '' +
			'<ul>' +
				'<li>li_1<br /><br />stuff</li>' +
			'</ul>';

		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html( initHtml );

		wymeditor.fixBodyHtml();

		expect(1);
		equals( wymeditor.xhtml(), initHtml);
	});
};