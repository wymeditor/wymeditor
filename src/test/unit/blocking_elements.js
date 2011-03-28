/**
* Tests for special-casing certain block elements that make it impossible to
* add content before/after them when followed by another blocking element or by
* the start/end of the document.
*/

function runBlockingElementTests() {
	// Should be able to add content before/after/between block elements
	module("Blocking Elements");

	var is_double_br_browser = $.browser.mozilla || $.browser.webkit || $.browser.safari;

	var tableHtml = '' +
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
	'</table>';
	var pTableHtml = '' +
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
	'</table>';
	var pTablePHtml = '' +
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
	'<p>p2</p>';
	var pTableTablePHtml = '' +
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
	'<p>p2</p>';
	var h1BlockquotePreHtml = '' +
	'<h1>h1</h1>' +
	'<blockquote>bq1</blockquote>' +
	'<pre>pre1\r\n' +
	'spaced\r\n\r\n' +
	'double  spaced' +
	'</pre>';

	// Webkit doesn't use \r\n newlines
	if( $.browser.webkit || $.browser.safari ) {
		h1BlockquotePreHtml = h1BlockquotePreHtml.replace(/\r/g, '');
	}

	// If there is no element in front of a table in FF or ie, it's not possible
	// to put content in front of that table.
	test("table has br spacers via .html()", function() {
		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html(tableHtml);

		var $body = $(wymeditor._doc).find('body.wym_iframe');
		var children = $body.children();

		if ( is_double_br_browser ) {
			expect(5);
			equals( children.length, 3 );
			if ( children.length == 3 ) {
				equals( children[0].tagName.toLowerCase(), 'br' );
				equals( children[1].tagName.toLowerCase(), 'table' );
				equals( children[2].tagName.toLowerCase(), 'br' );
			}
		} else {
			expect(4);
			equals( children.length, 2 );
			if ( children.length == 2 ) {
				equals( children[0].tagName.toLowerCase(), 'br' );
				equals( children[1].tagName.toLowerCase(), 'table' );
			}
		}

		equals( wymeditor.xhtml(), tableHtml );
	});

	test("table has br spacers via table insertion", function() {
		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html('');
		wymeditor.insertTable( 2, 3, '', '' );

		var $body = $(wymeditor._doc).find('body.wym_iframe');
		var children = $body.children();

		if ( is_double_br_browser ) {
			expect(5);
			equals( children.length, 3 );
			if ( children.length == 3 ) {
				equals( children[0].tagName.toLowerCase(), 'br' );
				equals( children[1].tagName.toLowerCase(), 'table' );
				equals( children[2].tagName.toLowerCase(), 'br' );
			}
		} else {
			expect(4);
			equals( children.length, 2 );
			if ( children.length == 2 ) {
				equals( children[0].tagName.toLowerCase(), 'br' );
				equals( children[1].tagName.toLowerCase(), 'table' );
			}
		}

		equals( wymeditor.xhtml(), tableHtml );
	});

	test("p + table has br spacers via .html()", function() {
		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html(pTableHtml);

		var $body = $(wymeditor._doc).find('body.wym_iframe');
		var children = $body.children();

		if ( is_double_br_browser ) {
			expect(6);
			equals( children.length, 4 );
			if ( children.length == 4 ) {
				equals( children[0].tagName.toLowerCase(), 'p' );
				equals( children[1].tagName.toLowerCase(), 'br' );
				equals( children[2].tagName.toLowerCase(), 'table' );
				equals( children[3].tagName.toLowerCase(), 'br' );
			}
		} else {
			expect(5);
			equals( children.length, 3 );
			if ( children.length == 3 ) {
				equals( children[0].tagName.toLowerCase(), 'p' );
				equals( children[1].tagName.toLowerCase(), 'br' );
				equals( children[2].tagName.toLowerCase(), 'table' );
			}
		}

		equals( wymeditor.xhtml(), pTableHtml );
	});

	test("p + table has br spacers via table insertion", function() {
		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html('<p>p1</p>');

		var $body = $(wymeditor._doc).find('body.wym_iframe');

		// Move the selector to the first paragraph
		var first_p = $body.find('p')[0];
		moveSelector(wymeditor, first_p);

		wymeditor.insertTable( 2, 3, '', '' );

		var children = $body.children();

		if ( is_double_br_browser ) {
			expect(6);
			equals( children.length, 4 );
			if ( children.length == 4 ) {
				equals( children[0].tagName.toLowerCase(), 'p' );
				equals( children[1].tagName.toLowerCase(), 'br' );
				equals( children[2].tagName.toLowerCase(), 'table' );
				equals( children[3].tagName.toLowerCase(), 'br' );
			}
		} else {
			expect(5);
			equals( children.length, 3 );
			if ( children.length == 3 ) {
				equals( children[0].tagName.toLowerCase(), 'p' );
				equals( children[1].tagName.toLowerCase(), 'br' );
				equals( children[2].tagName.toLowerCase(), 'table' );
			}
		}

		equals( wymeditor.xhtml(), pTableHtml );
	});

	test("p + table + p has br spacers via .html()", function() {
		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html(pTablePHtml);

		var $body = $(wymeditor._doc).find('body.wym_iframe');
		var children = $body.children();

		expect(7);
		equals( children.length, 5 );
		if ( children.length == 5 ) {
			equals( children[0].tagName.toLowerCase(), 'p' );
			equals( children[1].tagName.toLowerCase(), 'br' );
			equals( children[2].tagName.toLowerCase(), 'table' );
			equals( children[3].tagName.toLowerCase(), 'br' );
			equals( children[4].tagName.toLowerCase(), 'p' );
		}

		equals( wymeditor.xhtml(), pTablePHtml );
	});

	test("p + table + p has br spacers via table insertion", function() {
		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html('<p>p1</p><p>p2</p>');

		var $body = $(wymeditor._doc).find('body.wym_iframe');

		// Move the selector to the first paragraph
		var first_p = $body.find('p')[0];
		moveSelector(wymeditor, first_p);

		wymeditor.insertTable( 2, 3, '', '' );

		var children = $body.children();

		expect(7);
		equals( children.length, 5 );
		if ( children.length == 5 ) {
			equals( children[0].tagName.toLowerCase(), 'p' );
			equals( children[1].tagName.toLowerCase(), 'br' );
			equals( children[2].tagName.toLowerCase(), 'table' );
			equals( children[3].tagName.toLowerCase(), 'br' );
			equals( children[4].tagName.toLowerCase(), 'p' );
		}

		equals( wymeditor.xhtml(), pTablePHtml );
	});

	test("p + table + table + p has br spacers via .html()", function() {
		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html(pTableTablePHtml);

		var $body = $(wymeditor._doc).find('body.wym_iframe');
		var children = $body.children();

		expect(9);
		equals( children.length, 7 );
		if ( children.length == 7 ) {
			equals( children[0].tagName.toLowerCase(), 'p' );
			equals( children[1].tagName.toLowerCase(), 'br' );
			equals( children[2].tagName.toLowerCase(), 'table' );
			equals( children[3].tagName.toLowerCase(), 'br' );
			equals( children[4].tagName.toLowerCase(), 'table' );
			equals( children[5].tagName.toLowerCase(), 'br' );
			equals( children[6].tagName.toLowerCase(), 'p' );
		}

		equals( wymeditor.xhtml(), pTableTablePHtml );
	});

	test("p + table + table + p has br spacers via table insertion", function() {
		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html('<p>p1</p><p>p2</p>');

		var $body = $(wymeditor._doc).find('body.wym_iframe');

		// Move the selector to the first paragraph
		var first_p = $body.find('p')[0];
		moveSelector(wymeditor, first_p);

		wymeditor.insertTable( 2, 3, '', '' );
		wymeditor.insertTable( 2, 3, '', '' );

		var children = $body.children();

		expect(9);
		equals( children.length, 7 );
		if ( children.length == 7 ) {
			equals( children[0].tagName.toLowerCase(), 'p' );
			equals( children[1].tagName.toLowerCase(), 'br' );
			equals( children[2].tagName.toLowerCase(), 'table' );
			equals( children[3].tagName.toLowerCase(), 'br' );
			equals( children[4].tagName.toLowerCase(), 'table' );
			equals( children[5].tagName.toLowerCase(), 'br' );
			equals( children[6].tagName.toLowerCase(), 'p' );
		}

		equals( wymeditor.xhtml(), pTableTablePHtml );
	});

	test("h1 + blockquote + pre has br spacers via .html()", function() {
		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html( h1BlockquotePreHtml );

		var $body = $(wymeditor._doc).find('body.wym_iframe');
		var children = $body.children();

		expect(8);
		equals( children.length, 6 );
		if ( children.length == 6 ) {
			equals( children[0].tagName.toLowerCase(), 'h1' );
			equals( children[1].tagName.toLowerCase(), 'br' );
			equals( children[2].tagName.toLowerCase(), 'blockquote' );
			equals( children[3].tagName.toLowerCase(), 'br' );
			equals( children[4].tagName.toLowerCase(), 'pre' );
			equals( children[5].tagName.toLowerCase(), 'br' );
		}

		equals( wymeditor.xhtml(), h1BlockquotePreHtml );
	});

	test("br spacers aren't deleted when arrowing through them", function() {
		// the spacer <br> shouldn't be turned in to a <p> when it gets cursor
		// focus
		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html(pTablePHtml);

		var $body = $(wymeditor._doc).find('body.wym_iframe');

		function checkLayout ( $body ) {
			var children = $body.children();
			equals( children.length, 5 );
			if ( children.length == 5 ) {
				equals( children[0].tagName.toLowerCase(), 'p' );
				equals( children[1].tagName.toLowerCase(), 'br' );
				equals( children[2].tagName.toLowerCase(), 'table' );
				equals( children[3].tagName.toLowerCase(), 'br' );
				equals( children[4].tagName.toLowerCase(), 'p' );
			}
		}

		// Go through each top-level element and hit the DOWN key
		$body.children().each( function (index, element) {
			moveSelector(wymeditor, element);
			simulateKey( 40, wymeditor._doc ); // Send DOWN

			checkLayout($body);

			if( element.nodeName.toLowerCase() == 'br' ) {
				// When the user has their cursor in the "blank" space
				// represented by a br, the selection object is actually in the
				// block level element (usually the body.wym_iframe) above it.
				// To represent where on the block level element, the anchor
				// offset is used. Offsets are 0-indexed based on the direct
				// children
				var sel = wymeditor._iframe.contentWindow.getSelection();
				var range = wymeditor._doc.createRange();
				range.setStart( element.parentNode, index );
				range.setEnd( element.parentNode, index );

				sel.removeAllRanges();
				sel.addRange( range );

				simulateKey( 40, wymeditor._doc ); // Send DOWN
			}

			checkLayout($body);
		});

		// Reset the HTML
		wymeditor.html(pTablePHtml);
		wymeditor.fixBodyHtml();

		// Go through each top-level element and hit the UP key
		$body.children().each( function (index, element) {
			moveSelector(wymeditor, element);

			simulateKey( 38, wymeditor._doc ); // Send UP

			checkLayout($body);
		});
	});

	test("br spacers don't cause lots of blank p's when arrowing down", function() {
		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html(pTableHtml);

		var $body = $(wymeditor._doc).find('body.wym_iframe');

		// Move the selector to the br before the table
		var sel = wymeditor._iframe.contentWindow.getSelection();
		var range = wymeditor._doc.createRange();
		range.setStart( $body[0], 1 );
		range.setEnd( $body[0], 1 );

		sel.removeAllRanges();
		sel.addRange( range );

		simulateKey( 38, wymeditor._doc ); // DOWN key

		var children = $body.children();

		equals( children.length, 4 , "Should have p, br, table, br");
		if ( children.length == 4 ) {
			equals( children[0].tagName.toLowerCase(), 'p' );
			equals( children[1].tagName.toLowerCase(), 'br' );
			equals( children[2].tagName.toLowerCase(), 'table' );
			equals( children[3].tagName.toLowerCase(), 'br' );
		}

		equals( wymeditor.xhtml(), pTableHtml );
	});

	test("br spacers don't cause lots of blank p's when arrowing up", function() {
		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html(pTablePHtml);

		var $body = $(wymeditor._doc).find('body.wym_iframe');

		// Move the selector to the br after the table
		var sel = wymeditor._iframe.contentWindow.getSelection();
		var range = wymeditor._doc.createRange();
		range.setStart( $body[0], 3 );
		range.setEnd( $body[0], 3 );

		sel.removeAllRanges();
		sel.addRange( range );

		simulateKey( 40, wymeditor._doc ); // UP key

		var children = $body.children();

		equals( children.length, 5 , "Should have p, br, table, br, p");
		if ( children.length == 5 ) {
			equals( children[0].tagName.toLowerCase(), 'p' );
			equals( children[1].tagName.toLowerCase(), 'br' );
			equals( children[2].tagName.toLowerCase(), 'table' );
			equals( children[3].tagName.toLowerCase(), 'br' );
			equals( children[4].tagName.toLowerCase(), 'p' );
		}

		equals( wymeditor.xhtml(), pTablePHtml );
	});

	test("br spacers stay in place when content is inserted- post-br", function() {
		// A new paragraph after a table should keep a br after the table and
		// shouldn't keep the br after that paragraph
		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html(tableHtml);

		var $body = $(wymeditor._doc).find('body.wym_iframe');

		// Move the selector to the 2nd br (index 2)
		var sel = wymeditor._iframe.contentWindow.getSelection();
		var range = wymeditor._doc.createRange();
		range.setStart( $body[0], 2 );
		range.setEnd( $body[0], 2 );

		// Insert a paragraph after the table
		$body.children('table').after('<p>yo</p>');

		// Simulate and send the keystroke event to trigger fixing the dom
		simulateKey( 40, wymeditor._doc ); // DOWN key

		var children = $body.children();

		equals( children.length, 4, "Should have br, table, br, p");
		if ( children.length == 4 ) {
			equals( children[0].tagName.toLowerCase(), 'br' );
			equals( children[1].tagName.toLowerCase(), 'table' );
			equals( children[2].tagName.toLowerCase(), 'br' );
			equals( children[3].tagName.toLowerCase(), 'p' );
		}

		equals( wymeditor.xhtml(), tableHtml + '<p>yo</p>');
	});

	test("br spacers stay in place when content is inserted- pre-br", function() {
		// A br should remain in necessary spots even after content is inserted
		// there. Duplicate brs should also not be created when inserting that
		// content.
		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html(tableHtml);

		var $body = $(wymeditor._doc).find('body.wym_iframe');

		// Move the selector to the start
		moveSelector(wymeditor, $body[0]);

		// Simulate and send the keyup event
		simulateKey( 65, wymeditor._doc ); // `a` key

		var children = $body.children();

		equals( children.length, 4 , "Should have p, br, table, br");
		if ( children.length == 4 ) {
			equals( children[0].tagName.toLowerCase(), 'p' );
			equals( children[1].tagName.toLowerCase(), 'br' );
			equals( children[2].tagName.toLowerCase(), 'table' );
			equals( children[3].tagName.toLowerCase(), 'br' );
		}

		equals( wymeditor.xhtml(), tableHtml );
	});
}