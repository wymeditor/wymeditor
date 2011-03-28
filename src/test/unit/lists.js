function runListTests() {
	module("Lists");

	/**
	* Run a list manipulation and verify the results.
	*
	* @param elmntId An id for the li that will be modified
	* @param action A string with either 'indent' or 'outdent'
	* @param startHtml The starting HTML
	* @param expectedHtml The expected HTML result.
	*/
	function testList( elmntId, action, startHtml, expectedHtml ) {
		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html( startHtml );

		var $body = $(wymeditor._doc).find('body.wym_iframe');
		var actionLi = $body.find('#'+elmntId)[0];

		moveSelector( wymeditor, actionLi);

		var buttonSelector = ''
		if ( action === 'outdent' ) {
			buttonSelector = '.wym_tools_outdent a';
		} else if ( action === 'indent' ) {
			buttonSelector = '.wym_tools_indent a';
		} else {
			ok( false, 'Improper call to testList. Action must be either "indent" or "outdent"' );
		}

		var actionButton = jQuery(wymeditor._box)
			.find(wymeditor._options.toolsSelector)
			.find(buttonSelector);
		actionButton.click();

		htmlEquals( wymeditor, expectedHtml )
	}

	var nestedListHtml = '' +
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
				'<li id="li_5_3">5_3' +
					'<ol>' +
						'<li id="li_5_3_1">5_3_1</li>' +
					'</ol>' +
				'</li>' +
			'</ol>' +
		'</li>' +
		'<li id="li_6">6</li>' +
		'<li id="li_7">7</li>' +
		'<li id="li_8">8</li>' +
	'</ol>';

	var li_1_indentedHtml = '' +
	'<ol>' +
		'<li>' +
			'<ol>' +
				'<li id="li_1">1</li>' +
			'</ol>' +
		'</li>' +
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
				'<li id="li_5_3">5_3' +
					'<ol>' +
						'<li id="li_5_3_1">5_3_1</li>' +
					'</ol>' +
				'</li>' +
			'</ol>' +
		'</li>' +
		'<li id="li_6">6</li>' +
		'<li id="li_7">7</li>' +
		'<li id="li_8">8</li>' +
	'</ol>';

	var li_2_indentedHtml = '' +
	'<ol>' +
		'<li id="li_1">1' +
			'<ol>' +
				'<li id="li_2">2</li>' +
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
				'<li id="li_5_3">5_3' +
					'<ol>' +
						'<li id="li_5_3_1">5_3_1</li>' +
					'</ol>' +
				'</li>' +
			'</ol>' +
		'</li>' +
		'<li id="li_6">6</li>' +
		'<li id="li_7">7</li>' +
		'<li id="li_8">8</li>' +
	'</ol>';

	var li_2_2_indentedHtml = '' +
	'<ol>' +
		'<li id="li_1">1</li>' +
		'<li id="li_2">2' +
			'<ol>' +
				'<li id="li_2_1">2_1' +
					'<ol>' +
						'<li id="li_2_2">2_2</li>' +
					'</ol>' +
				'</li>' +
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
				'<li id="li_5_3">5_3' +
					'<ol>' +
						'<li id="li_5_3_1">5_3_1</li>' +
					'</ol>' +
				'</li>' +
			'</ol>' +
		'</li>' +
		'<li id="li_6">6</li>' +
		'<li id="li_7">7</li>' +
		'<li id="li_8">8</li>' +
	'</ol>';

	var li_4_indentedHtml = '' +
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
				'<li id="li_4">4</li>' +
			'</ol>' +
		'</li>' +
		'<li id="li_5">5' +
			'<ol>' +
				'<li id="li_5_1">5_1</li>' +
				'<li id="li_5_2">5_2</li>' +
				'<li id="li_5_3">5_3' +
					'<ol>' +
						'<li id="li_5_3_1">5_3_1</li>' +
					'</ol>' +
				'</li>' +
			'</ol>' +
		'</li>' +
		'<li id="li_6">6</li>' +
		'<li id="li_7">7</li>' +
		'<li id="li_8">8</li>' +
	'</ol>';

	var li_5_3_indentedHtml = '' +
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
				'<li id="li_5_2">5_2' +
					'<ol>' +
						'<li id="li_5_3">5_3</li>' +
						'<li id="li_5_3_1">5_3_1</li>' +
					'</ol>' +
				'</li>' +
			'</ol>' +
		'</li>' +
		'<li id="li_6">6</li>' +
		'<li id="li_7">7</li>' +
		'<li id="li_8">8</li>' +
	'</ol>';

	var li_7_indentedHtml = '' +
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
				'<li id="li_5_3">5_3' +
					'<ol>' +
						'<li id="li_5_3_1">5_3_1</li>' +
					'</ol>' +
				'</li>' +
			'</ol>' +
		'</li>' +
		'<li id="li_6">6' +
			'<ol>' +
				'<li id="li_7">7</li>' +
			'</ol>' +
		'</li>' +
		'<li id="li_8">8</li>' +
	'</ol>';

	test("First-level w/sublist indent/outdent", function() {
		expect(2);

		testList( 'li_2', 'indent', nestedListHtml, li_2_indentedHtml );
		testList( 'li_2', 'outdent', li_2_indentedHtml, nestedListHtml );
	});

	test("Second-level w/sublist indent/outdent", function() {
		expect(2);

		testList( 'li_5_3', 'indent', nestedListHtml, li_5_3_indentedHtml );
		testList( 'li_5_3', 'outdent', li_5_3_indentedHtml, nestedListHtml );
	});

	test("First-level no-sublist indent/outdent", function() {
		expect(2);

		testList( 'li_7', 'indent', nestedListHtml, li_7_indentedHtml );
		testList( 'li_7', 'outdent', li_7_indentedHtml, nestedListHtml );
	});

	test("Second-level no-sublist indent/outdent", function() {
		expect(2);

		testList( 'li_2_2', 'indent', nestedListHtml, li_2_2_indentedHtml );
		testList( 'li_2_2', 'outdent', li_2_2_indentedHtml, nestedListHtml );
	});

	test("First-level no-sublist first-item indent/outdent", function() {
		expect(2);

		testList( 'li_1', 'indent', nestedListHtml, li_1_indentedHtml );
		testList( 'li_1', 'outdent', li_1_indentedHtml, nestedListHtml );
	});

	test("First-level no-sublist previous-sublist indent/outdent", function() {
		expect(2);

		testList( 'li_4', 'indent', nestedListHtml, li_4_indentedHtml );
		testList( 'li_4', 'outdent', li_4_indentedHtml, nestedListHtml );
	});
}