function runListTests() {
	module("list-indent_outdent");

	/**
	* Run a list manipulation and verify the results.
	*
	* @param elmntId An id for the li that will be modified
	* @param action A string with either 'indent' or 'outdent'
	* @param startHtml The starting HTML
	* @param expectedHtml The expected HTML result.
	*/
	function testList(elmntId, action, startHtml, expectedHtml) {
		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html(startHtml);

		var $body = $(wymeditor._doc).find('body.wym_iframe');
		var actionLi = $body.find('#'+elmntId)[0];

		moveSelector(wymeditor, actionLi);

		var buttonSelector = ''
		if (action === 'outdent') {
			buttonSelector = '.wym_tools_outdent a';
		} else if (action === 'indent') {
			buttonSelector = '.wym_tools_indent a';
		} else if (action === 'bullet') {
			buttonSelector = '.wym_tools_unordered_list a';
		} else {
			ok(
				false,
				'Improper call to testList. Action must be either "indent", ' +
				'"outdent" or "bullet"');
		}

		var actionButton = jQuery(wymeditor._box)
			.find(wymeditor._options.toolsSelector)
			.find(buttonSelector);
		actionButton.click();

		htmlEquals(wymeditor, expectedHtml)
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

	var li_3_indentedHtml = '' +
	'<ol>' +
		'<li id="li_1">1</li>' +
		'<li id="li_2">2' +
			'<ol>' +
				'<li id="li_2_1">2_1</li>' +
				'<li id="li_2_2">2_2</li>' +
				'<li id="li_3">3</li>' +
				'<li id="li_3_1">3_1</li>' +
			'</ol>' +
		'</li>' +
		'<li id="li_4">4</li>' +
		'<li id="li_5">5' +
			'<ol>' +
				'<li id="li_5_1">5_1</li>' +
				'<li id="li_5_2">5_2</li>' +
				'<li id="li_5_3">5_3' +
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
					'<ul>' +
						'<li id="li_5_3">5_3</li>' +
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

	var li_5_3_outdentedHtml = '' +
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
					'<ul>' +
						'<li id="li_5_3_1">5_3_1</li>' +
					'</ul>' +
				'</li>' +
				'<li id="li_5_4">5_4</li>' +
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
		expect(4);

		testList('li_2', 'indent', nestedListHtml, li_2_indentedHtml);
		testList('li_2', 'outdent', li_2_indentedHtml, nestedListHtml);
	});

	test("First-level w/sublist joins lists indent/outdent", function() {
		expect(4);

		testList('li_3', 'indent', nestedListHtml, li_3_indentedHtml);
		testList('li_3', 'outdent', li_3_indentedHtml, nestedListHtml);
	});

	test("Outdent w/sublist outdent/indent", function() {
		expect(4);

		testList('li_5_3', 'outdent', nestedListHtml, li_5_3_outdentedHtml);
		testList('li_5_3', 'indent', li_5_3_outdentedHtml, nestedListHtml);
	});

	test("Second-level w/sublist indent/outdent", function() {
		expect(4);

		testList('li_5_3', 'indent', nestedListHtml, li_5_3_indentedHtml);
		testList('li_5_3', 'outdent', li_5_3_indentedHtml, nestedListHtml);
	});

	test("First-level no-sublist indent/outdent", function() {
		expect(4);

		testList('li_7', 'indent', nestedListHtml, li_7_indentedHtml);
		testList('li_7', 'outdent', li_7_indentedHtml, nestedListHtml);
	});

	test("Second-level no-sublist indent/outdent", function() {
		expect(4);

		testList('li_2_2', 'indent', nestedListHtml, li_2_2_indentedHtml);
		testList('li_2_2', 'outdent', li_2_2_indentedHtml, nestedListHtml);
	});

	test("First-level no-sublist first-item indent/outdent", function() {
		expect(4);

		testList('li_1', 'indent', nestedListHtml, li_1_indentedHtml);
		testList('li_1', 'outdent', li_1_indentedHtml, nestedListHtml);
	});

	test("First-level no-sublist previous-sublist indent/outdent", function() {
		expect(4);

		testList('li_4', 'indent', nestedListHtml, li_4_indentedHtml);
		testList('li_4', 'outdent', li_4_indentedHtml, nestedListHtml);
	});

	module("list-broken_html");

	var doubleIndentHtml = '' +
	'<ol>' +
		'<li id="li_1">1' +
			'<ol>' +
				'<li>' +
					'<ol>' +
						'<li id="li_1_1_1">1_1_1' +
							'<ol>' +
								'<li id="li_1_1_1_1">1_1_1_1</li>' +
								'<li id="li_1_1_1_2">1_1_1_2</li>' +
								'<li id="li_1_1_1_3">1_1_1_3</li>' +
								'<li id="li_1_1_1_4">1_1_1_4</li>' +
							'</ol>' +
						'</li>' +
					'</ol>' +
				'</li>' +
			'</ol>' +
		'</li>' +
	'</ol>';
	var diFirstOutdentHtml = '' +
	'<ol>' +
		'<li id="li_1">1' +
			'<ol>' +
				'<li>' +
					'<ol>' +
						'<li id="li_1_1_1">1_1_1' +
							'<ol>' +
								'<li id="li_1_1_1_1">1_1_1_1</li>' +
								'<li id="li_1_1_1_2">1_1_1_2</li>' +
								'<li id="li_1_1_1_3">1_1_1_3</li>' +
							'</ol>' +
						'</li>' +
						'<li id="li_1_1_1_4">1_1_1_4</li>' +
					'</ol>' +
				'</li>' +
			'</ol>' +
		'</li>' +
	'</ol>';
	var diSecondOutdentHtml = '' +
	'<ol>' +
		'<li id="li_1">1' +
			'<ol>' +
				'<li>' +
					'<ol>' +
						'<li id="li_1_1_1">1_1_1' +
							'<ol>' +
								'<li id="li_1_1_1_1">1_1_1_1</li>' +
								'<li id="li_1_1_1_2">1_1_1_2</li>' +
								'<li id="li_1_1_1_3">1_1_1_3</li>' +
							'</ol>' +
						'</li>' +
					'</ol>' +
				'</li>' +
				'<li id="li_1_1_1_4">1_1_1_4</li>' +
			'</ol>' +
		'</li>' +
	'</ol>';
	var diThirdOutdentHtml = '' +
	'<ol>' +
		'<li id="li_1">1' +
			'<ol>' +
				'<li>' +
					'<ol>' +
						'<li id="li_1_1_1">1_1_1' +
							'<ol>' +
								'<li id="li_1_1_1_1">1_1_1_1</li>' +
								'<li id="li_1_1_1_2">1_1_1_2</li>' +
								'<li id="li_1_1_1_3">1_1_1_3</li>' +
							'</ol>' +
						'</li>' +
					'</ol>' +
				'</li>' +
			'</ol>' +
		'</li>' +
		'<li id="li_1_1_1_4">1_1_1_4</li>' +
	'</ol>';

	test("Triple outdent doesn't break HTML", function() {
		expect(6);

		testList('li_1_1_1_4', 'outdent', doubleIndentHtml, diFirstOutdentHtml);
		testList(
			'li_1_1_1_4', 'outdent', diFirstOutdentHtml, diSecondOutdentHtml);
		testList(
			'li_1_1_1_4', 'outdent', diSecondOutdentHtml, diThirdOutdentHtml);
	});

	var orderedHtml = '' +
	'<ol>' +
		'<li id="li_1">1' +
			'<ol>' +
				'<li id="li_1_1">1_1' +
					'<ol>' +
						'<li id="li_1_1_1">1_1_1' +
							'<ol>' +
								'<li id="li_1_1_1_1">1_1_1_1</li>' +
							'</ol>' +
						'</li>' +
					'</ol>' +
				'</li>' +
			'</ol>' +
		'</li>' +
		'<li id="li_2">2</li>' +
	'</ol>';
	var orderedToBulletHtml = '' +
	'<ol>' +
		'<li id="li_1">1' +
			'<ol>' +
				'<li id="li_1_1">1_1' +
					'<ul>' +
						'<li id="li_1_1_1">1_1_1' +
							'<ol>' +
								'<li id="li_1_1_1_1">1_1_1_1</li>' +
							'</ol>' +
						'</li>' +
					'</ul>' +
				'</li>' +
			'</ol>' +
		'</li>' +
		'<li id="li_2">2</li>' +
	'</ol>';
	test("Ordered to unordered doesn't break HTML", function() {
		expect(2);

		testList('li_1_1_1', 'bullet', orderedHtml, orderedToBulletHtml);
	});

	module("list-correction");

	test("Should correct invalid list nesting", function() {
		expect(2);

		var wymeditor = jQuery.wymeditors(0);

		var expected = "<ul><li>a<ul><li>a.1<\/li><\/ul><\/li><li>b<\/li><\/ul>";
		// FF
		var invalid_ff_html = "<ul><li>a<\/li><ul><li>a.1<\/li><\/ul><li>b<br><\/li><\/ul>";
		wymeditor.html(invalid_ff_html);
		htmlEquals(wymeditor, expected);
		// IE
		// IE has invalid sublist nesting
		var expected = "<ul>\r\n<li>a<ul>\r\n<li>a.1<\/li><\/ul><\/li>\r\n<li>b<\/li><\/ul>";
		var invalid_ie_html = "<UL>\r\n<LI>a<\/LI>\r\n<UL>\r\n<LI>a.1<\/LI><\/UL>\r\n<LI>b<\/LI><\/UL>";
		wymeditor.html(invalid_ie_html);
		htmlEquals(wymeditor, expected);
	});

	test("Double indent correction", function() {
		expect(1);

		var wymeditor = jQuery.wymeditors(0);

		var brokenHtml = '' +
		'<ol>' +
			'<li id="li_1">1' +
				'<ol>' +
					'<ol>' +
						'<li id="li_1_1_1">1_1_1</li>' +
					'</ol>' +
				'</ol>' +
			'</li>' +
		'</ol>';
		var repairedHtml = '' +
		'<ol>' +
			'<li id="li_1">1' +
				'<ol>' +
					'<li>' +
						'<ol>' +
							'<li id="li_1_1_1">1_1_1</li>' +
						'</ol>' +
					'</li>' +
				'</ol>' +
			'</li>' +
		'</ol>';

		wymeditor.html(brokenHtml);
		htmlEquals(wymeditor, repairedHtml);
	});

	module("list-tabbing");

	test("Tab key indents", function() {
		expect(2);

		var initHtml = nestedListHtml;
		var expectedHtml = li_7_indentedHtml;
		var elmntId = "li_7";

		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html(initHtml);

		var $body = $(wymeditor._doc).find('body.wym_iframe');
		var actionElement = $body.find('#'+elmntId)[0];

		moveSelector(wymeditor, actionElement);

		simulateKey(WYMeditor.KEY.TAB, actionElement);
		htmlEquals(wymeditor, expectedHtml)
	});

	test("Shift+Tab outdents", function() {
		expect(2);

		var initHtml = '' +
		'<ol>' +
			'<ol>' +
				'<li id="li_1_1">1_1</li>' +
			'</ol>' +
			'<li id="li_2">2</li>' +
		'</ol>';
		var expectedHtml = '' +
		'<ol>' +
			'<li id="li_1_1">1_1</li>' +
			'<li id="li_2">2</li>' +
		'</ol>';

		var elmntId = "li_1_1";

		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html(initHtml);

		var $body = $(wymeditor._doc).find('body.wym_iframe');
		var actionElement = $body.find('#'+elmntId)[0];

		moveSelector(wymeditor, actionElement);

		simulateKey(WYMeditor.KEY.TAB, actionElement, {'shiftKey': true});
		htmlEquals(wymeditor, expectedHtml)
	});

	test("Tab has no effect outside lists", function() {
		expect(2);

		var initHtml = '<p id="p_1">test</p>';
		var expectedHtml = initHtml;
		var elmntId = "p_1";

		var wymeditor = jQuery.wymeditors(0);
		wymeditor.html(initHtml);

		var $body = $(wymeditor._doc).find('body.wym_iframe');
		var actionElement = $body.find('#'+elmntId)[0];

		moveSelector(wymeditor, actionElement);

		simulateKey(WYMeditor.KEY.TAB, actionElement);
		htmlEquals(wymeditor, expectedHtml)
	});
}