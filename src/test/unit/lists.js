module("list-indent_outdent", {setup: setupWym});

/**
* Run a list manipulation and verify the results.
*
* @param elmntId An id for the li that will be modified
* @param action A string with either 'indent' or 'outdent'
* @param startHtml The starting HTML
* @param expectedHtml The expected HTML result.
* @param isText Should this be considered a text selection (as opposed to a DOM
  selection). Default is false.
*/
function testList(elmntId, action, startHtml, expectedHtml, isText) {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        actionLi,
        buttonSelector,
        actionButton;

    wymeditor.html(startHtml);

    $body = $(wymeditor._doc).find('body.wym_iframe');
    actionLi = $body.find('#' + elmntId)[0];

    if (isText === true) {
        // Make a text selection inside the target element instead of selecting
        // the element itself
        // Selecting from 0 to 1 means we'll select the whole text on
        // one-character text nodes and we'll partially-select longer nodes.
        // This allows us to test both without juggling this through all of our
        // test-cases
        makeTextSelection(wymeditor, actionLi, actionLi, 0, 1);
    } else {
        moveSelector(wymeditor, actionLi);
    }

    buttonSelector = '';
    if (action === 'outdent') {
        buttonSelector = '.wym_tools_outdent a';
    } else if (action === 'indent') {
        buttonSelector = '.wym_tools_indent a';
    } else if (action === 'unordered') {
        buttonSelector = '.wym_tools_unordered_list a';
    } else if (action === 'ordered') {
        buttonSelector = '.wym_tools_ordered_list a';
    } else {
        ok(
            false,
            'Improper call to testList. Action must be either "indent", ' +
                '"outdent", "ordered" or "unordered"'
        );
    }

    actionButton = jQuery(wymeditor._box)
        .find(wymeditor._options.toolsSelector)
        .find(buttonSelector);
    actionButton.click();

    htmlEquals(wymeditor, expectedHtml);
}

/**
    testListMulti
    =============

    Run a list indent or outdent manpulation with a selection across multiple list
    items and verify the results.

    `startElmntId` Element id for the start of the selection
    `endElmntId` Element id for the end of the selection
    `action` A string with either 'indent' or 'outdent'
    `startHtml` The starting HTML
    `expectedHtml` The expected HTML result.
    `isText` Is this a Text selection (as opposed to a DOM selection). Defaults to false.
*/
function testListMulti(startElmntId, endElmntId, action, startHtml, expectedHtml, isText) {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        startLi,
        endLi,
        buttonSelector,
        actionButton;
    wymeditor.html(startHtml);

    $body = $(wymeditor._doc).find('body.wym_iframe');
    startLi = $body.find('#' + startElmntId)[0];
    endLi = $body.find('#' + endElmntId)[0];

    if (isText === true) {
        // Make a text selection inside the target element instead of selecting
        // the element itself
        makeTextSelection(wymeditor, startLi, endLi, 0, 1);
    } else {
        makeSelection(wymeditor, startLi, endLi);
    }

    buttonSelector = '';
    if (action === 'outdent') {
        buttonSelector = '.wym_tools_outdent a';
    } else if (action === 'indent') {
        buttonSelector = '.wym_tools_indent a';
    } else if (action === 'unordered') {
        buttonSelector = '.wym_tools_unordered_list a';
    } else if (action === 'ordered') {
        buttonSelector = '.wym_tools_ordered_list a';
    } else {
        ok(
            false,
            'Improper call to testList. Action must be either "indent", ' +
                '"outdent", "ordered" or "unordered"'
        );
    }

    actionButton = jQuery(wymeditor._box)
        .find(wymeditor._options.toolsSelector)
        .find(buttonSelector);
    actionButton.click();

    htmlEquals(wymeditor, expectedHtml);
}

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

var li_1_indentedHtml = String() +
        '<ol>' +
            '<li class="spacer_li">' +
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

var li_2_indentedHtml = String() +
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

var li_2_2_indentedHtml = String() +
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

var li_3_indentedHtml = String() +
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

var li_3_1_outdentedHtml = String() +
        '<ol>' +
            '<li id="li_1">1</li>' +
            '<li id="li_2">2' +
                '<ol>' +
                    '<li id="li_2_1">2_1</li>' +
                    '<li id="li_2_2">2_2</li>' +
                '</ol>' +
            '</li>' +
            '<li id="li_3">3</li>' +
            '<li id="li_3_1">3_1</li>' +
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

var li_4_indentedHtml = String() +
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

var li_5_3_indentedHtml = String() +
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

var li_5_3_1_outdentedHtml = String() +
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
                    '<li id="li_5_3">5_3</li>' +
                    '<li id="li_5_3_1">5_3_1</li>' +
                    '<li id="li_5_4">5_4</li>' +
                '</ol>' +
            '</li>' +
            '<li id="li_6">6</li>' +
            '<li id="li_7">7</li>' +
            '<li id="li_8">8</li>' +
        '</ol>';

var li_5_3_outdentedHtml = String() +
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

var li_7_indentedHtml = String() +
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



test("First-level w/sublist", function () {
    expect(6);

    testList('li_2', 'indent', nestedListHtml, li_2_indentedHtml);
    testList('li_2', 'outdent', li_2_indentedHtml, nestedListHtml);
    // Text selection instead
    testList('li_2', 'indent', nestedListHtml, li_2_indentedHtml, true);
    testList('li_2', 'outdent', li_2_indentedHtml, nestedListHtml, true);
});

test("First-level w/sublist joins lists", function () {
    expect(6);

    testList('li_3', 'indent', nestedListHtml, li_3_indentedHtml);
    testList('li_3', 'outdent', li_3_indentedHtml, nestedListHtml);
    // Via Text selection
    testList('li_3', 'indent', nestedListHtml, li_3_indentedHtml, true);
    testList('li_3', 'outdent', li_3_indentedHtml, nestedListHtml, true);
});

test("Outdent joining list with longer content", function () {
    expect(3);

    testList('li_5_3_1', 'outdent', nestedListHtml, li_5_3_1_outdentedHtml);
    // Can't go the other way because we've turned a ul to an ol

    // Via Text selection
    testList('li_5_3_1', 'outdent', nestedListHtml, li_5_3_1_outdentedHtml, true);
});

test("Outdent w/sublist", function () {
    expect(6);

    testList('li_5_3', 'outdent', nestedListHtml, li_5_3_outdentedHtml);
    testList('li_5_3', 'indent', li_5_3_outdentedHtml, nestedListHtml);

    // Via Text selection
    testList('li_5_3', 'outdent', nestedListHtml, li_5_3_outdentedHtml, true);
    testList('li_5_3', 'indent', li_5_3_outdentedHtml, nestedListHtml, true);
});

test("Outdent last element in list", function () {
    expect(6);

    testList('li_3_1', 'outdent', nestedListHtml, li_3_1_outdentedHtml);
    testList('li_3_1', 'indent', li_3_1_outdentedHtml, nestedListHtml);

    // Via Text selection
    testList('li_3_1', 'outdent', nestedListHtml, li_3_1_outdentedHtml, true);
    testList('li_3_1', 'indent', li_3_1_outdentedHtml, nestedListHtml, true);
});

test("Second-level w/sublist", function () {
    expect(6);

    testList('li_5_3', 'indent', nestedListHtml, li_5_3_indentedHtml);
    testList('li_5_3', 'outdent', li_5_3_indentedHtml, nestedListHtml);

    // Via Text selection
    testList('li_5_3', 'indent', nestedListHtml, li_5_3_indentedHtml, true);
    testList('li_5_3', 'outdent', li_5_3_indentedHtml, nestedListHtml, true);
});

test("First-level no-sublist", function () {
    expect(6);

    testList('li_7', 'indent', nestedListHtml, li_7_indentedHtml);
    testList('li_7', 'outdent', li_7_indentedHtml, nestedListHtml);

    // Via Text selection
    testList('li_7', 'indent', nestedListHtml, li_7_indentedHtml, true);
    testList('li_7', 'outdent', li_7_indentedHtml, nestedListHtml, true);
});

test("Second-level no-sublist", function () {
    expect(6);

    testList('li_2_2', 'indent', nestedListHtml, li_2_2_indentedHtml);
    testList('li_2_2', 'outdent', li_2_2_indentedHtml, nestedListHtml);

    // Via Text selection
    testList('li_2_2', 'indent', nestedListHtml, li_2_2_indentedHtml, true);
    testList('li_2_2', 'outdent', li_2_2_indentedHtml, nestedListHtml, true);
});

test("First-level no-sublist first-item", function () {
    expect(6);

    testList('li_1', 'indent', nestedListHtml, li_1_indentedHtml);
    testList('li_1', 'outdent', li_1_indentedHtml, nestedListHtml);

    // Via Text selection
    testList('li_1', 'indent', nestedListHtml, li_1_indentedHtml, true);
    testList('li_1', 'outdent', li_1_indentedHtml, nestedListHtml, true);
});

test("First-level no-sublist previous-sublist", function () {
    expect(6);

    testList('li_4', 'indent', nestedListHtml, li_4_indentedHtml);
    testList('li_4', 'outdent', li_4_indentedHtml, nestedListHtml);

    // Via Text selection
    testList('li_4', 'indent', nestedListHtml, li_4_indentedHtml, true);
    testList('li_4', 'outdent', li_4_indentedHtml, nestedListHtml, true);
});

test("Can't dedent first-level", function () {
    expect(15);

    testList('li_1', 'outdent', nestedListHtml, nestedListHtml);
    testList('li_2', 'outdent', nestedListHtml, nestedListHtml);
    testList('li_6', 'outdent', nestedListHtml, nestedListHtml);
    testList('li_7', 'outdent', nestedListHtml, nestedListHtml);
    testList('li_8', 'outdent', nestedListHtml, nestedListHtml);

    // Via Text selection
    testList('li_1', 'outdent', nestedListHtml, nestedListHtml, true);
    testList('li_2', 'outdent', nestedListHtml, nestedListHtml, true);
    testList('li_6', 'outdent', nestedListHtml, nestedListHtml, true);
    testList('li_7', 'outdent', nestedListHtml, nestedListHtml, true);
    testList('li_8', 'outdent', nestedListHtml, nestedListHtml, true);
});

var nestedFirstItemHtml = String() +
        '<ol>' +
            '<li id="li_1">1' +
                '<ol>' +
                    '<li id="li_1_1">1_1</li>' +
                    '<li id="li_1_2">1_2</li>' +
                '</ol>' +
                'endcontent' +
            '</li>' +
            '<li id="li_2">2</li>' +
        '</ol>';
var li_1_indentedNestedFirstItemHtml = String() +
        '<ol>' +
            '<li class="spacer_li">' +
                '<ol>' +
                    '<li id="li_1">1</li>' +
                    '<li id="li_1_1">1_1</li>' +
                    '<li id="li_1_2">1_2</li>' +
                '</ol>' +
                'endcontent' +
            '</li>' +
            '<li id="li_2">2</li>' +
        '</ol>';

test("Nested first item", function () {
    expect(6);

    testList('li_1', 'indent', nestedFirstItemHtml, li_1_indentedNestedFirstItemHtml);
    testList('li_1', 'outdent', li_1_indentedNestedFirstItemHtml, nestedFirstItemHtml);

    // Via Text selection
    testList('li_1', 'indent', nestedFirstItemHtml, li_1_indentedNestedFirstItemHtml, true);
    testList('li_1', 'outdent', li_1_indentedNestedFirstItemHtml, nestedFirstItemHtml, true);
});

var overhungListHtml = String() +
        '<ol>' +
            '<li id="li_2">2' +
                '<ul>' +
                    '<li id="li_2_1">2_1' +
                        '<ul>' +
                            '<li id="li_2_2">2_2</li>' +
                        '</ul>' +
                    '</li>' +
                '</ul>' +
            '</li>' +
            '<li id="li_3">3</li>' +
        '</ol>';
var li_3_overhungHtml = String() +
        '<ol>' +
            '<li id="li_2">2' +
                '<ul>' +
                    '<li id="li_2_1">2_1' +
                        '<ul>' +
                            '<li id="li_2_2">2_2</li>' +
                        '</ul>' +
                    '</li>' +
                    '<li id="li_3">3</li>' +
                '</ul>' +
            '</li>' +
        '</ol>';

test("Double overhang with different list type indent/outdent", function () {
    expect(6);

    testList('li_3', 'indent', overhungListHtml, li_3_overhungHtml);
    testList('li_3', 'outdent', li_3_overhungHtml, overhungListHtml);

    // Via Text selection
    testList('li_3', 'indent', overhungListHtml, li_3_overhungHtml, true);
    testList('li_3', 'outdent', li_3_overhungHtml, overhungListHtml, true);
});

module("list-content_reordering", {setup: setupWym});

var doubleSublistHtml = String() +
        '<ol>' +
            '<li id="li_1">1' +
                '<ol>' +
                    '<li id="li_1_1">1_1</li>' +
                    '<li id="li_1_2">1_2</li>' +
                    '<li id="li_1_3">1_3</li>' +
                '</ol>' +
                '<ol>' +
                    '<li id="li_1_4">1_4</li>' +
                    '<li id="li_1_5">1_5</li>' +
                    '<li id="li_1_6">1_6</li>' +
                '</ol>' +
                '<ul>' +
                    '<li id="li_1_7">1_7</li>' +
                '</ul>' +
                'endContent' +
            '</li>' +
        '</ol>';
var li_1_5_doubleSublistOutdentedHtml = String() +
        '<ol>' +
            '<li id="li_1">1' +
                '<ol>' +
                    '<li id="li_1_1">1_1</li>' +
                    '<li id="li_1_2">1_2</li>' +
                    '<li id="li_1_3">1_3</li>' +
                '</ol>' +
                '<ol>' +
                    '<li id="li_1_4">1_4</li>' +
                '</ol>' +
            '</li>' +
            '<li id="li_1_5">1_5' +
                '<ol>' +
                    '<li id="li_1_6">1_6</li>' +
                '</ol>' +
                '<ul>' +
                    '<li id="li_1_7">1_7</li>' +
                '</ul>' +
                'endContent' +
            '</li>' +
        '</ol>';
var li_1_6_doubleSublistOutdentedHtml = String() +
        '<ol>' +
            '<li id="li_1">1' +
                '<ol>' +
                    '<li id="li_1_1">1_1</li>' +
                    '<li id="li_1_2">1_2</li>' +
                    '<li id="li_1_3">1_3</li>' +
                '</ol>' +
                '<ol>' +
                    '<li id="li_1_4">1_4</li>' +
                    '<li id="li_1_5">1_5</li>' +
                '</ol>' +
            '</li>' +
            '<li id="li_1_6">1_6' +
                '<ul>' +
                    '<li id="li_1_7">1_7</li>' +
                '</ul>' +
                'endContent' +
            '</li>' +
        '</ol>';

test("Two same-level sublist middle outdent", function () {
    // Shouldn't re-order content when outdent with two sublists
    expect(6);

    testList('li_1_5', 'outdent', doubleSublistHtml, li_1_5_doubleSublistOutdentedHtml);
    testList('li_1_5', 'indent', li_1_5_doubleSublistOutdentedHtml, doubleSublistHtml);

    // Via Text selection
    testList('li_1_5', 'outdent', doubleSublistHtml, li_1_5_doubleSublistOutdentedHtml, true);
    testList('li_1_5', 'indent', li_1_5_doubleSublistOutdentedHtml, doubleSublistHtml, true);
});

test("Two same-level sublist last outdent", function () {
    expect(6);

    testList('li_1_6', 'outdent', doubleSublistHtml, li_1_6_doubleSublistOutdentedHtml);
    testList('li_1_6', 'indent', li_1_6_doubleSublistOutdentedHtml, doubleSublistHtml);

    // Via Text selection
    testList('li_1_6', 'outdent', doubleSublistHtml, li_1_6_doubleSublistOutdentedHtml, true);
    testList('li_1_6', 'indent', li_1_6_doubleSublistOutdentedHtml, doubleSublistHtml, true);
});

var li_2_1_to_li_2_2_indentedHtml = String() +
        '<ol>' +
            '<li id="li_1">1</li>' +
            '<li id="li_2">2' +
                '<ol>' +
                    '<li class="spacer_li">' +
                        '<ol>' +
                            '<li id="li_2_1">2_1</li>' +
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

var li_6_to_li_8_indentedHtml = String() +
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
                    '<li id="li_6">6</li>' +
                    '<li id="li_7">7</li>' +
                    '<li id="li_8">8</li>' +
                '</ol>' +
            '</li>' +
        '</ol>';

var li_2_2_to_li_3_indentedHtml = String() +
        '<ol>' +
            '<li id="li_1">1</li>' +
            '<li id="li_2">2' +
                '<ol>' +
                    '<li id="li_2_1">2_1' +
                        '<ol>' +
                            '<li id="li_2_2">2_2</li>' +
                        '</ol>' +
                    '</li>' +
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

var li_7_to_li_8_indentedHtml = String() +
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
                    '<li id="li_8">8</li>' +
                '</ol>' +
            '</li>' +
        '</ol>';

var li_5_3_to_li_5_4_indentedHtml = String() +
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
                            '<li id="li_5_3">5_3' +
                                '<ul>' +
                                    '<li id="li_5_3_1">5_3_1</li>' +
                                '</ul>' +
                            '</li>' +
                            '<li id="li_5_4">5_4</li>' +
                        '</ul>' +
                    '</li>' +
                '</ol>' +
            '</li>' +
            '<li id="li_6">6</li>' +
            '<li id="li_7">7</li>' +
            '<li id="li_8">8</li>' +
        '</ol>';

var subnodeHtml = String() +
        '<ol>' +
            '<li id="li_1">item 1</li>' +
            '<li id="li_2"><strong>item</strong> 2</li>' +
            '<li id="li_3">item 3</li>' +
        '</ol>';

var li_2_to_li_3_subnodeIndentedHtml = String() +
        '<ol>' +
            '<li id="li_1">item 1' +
                '<ol>' +
                    '<li id="li_2"><strong>item</strong> 2</li>' +
                    '<li id="li_3">item 3</li>' +
                '</ol>' +
            '</li>' +
        '</ol>';


module("list-multi_selection", {setup: setupWym});

test("Second-level with sub-node", function () {
    expect(4);

    testListMulti('li_2', 'li_3', 'indent', subnodeHtml, li_2_to_li_3_subnodeIndentedHtml);
    testListMulti('li_2', 'li_3', 'outdent', li_2_to_li_3_subnodeIndentedHtml, subnodeHtml);

    // Via text selection
    testListMulti('li_2', 'li_3', 'indent', subnodeHtml, li_2_to_li_3_subnodeIndentedHtml, true);
    testListMulti('li_2', 'li_3', 'outdent', li_2_to_li_3_subnodeIndentedHtml, subnodeHtml, true);
});

test("Second-level with sub-node", function () {
    expect(4);

    testListMulti('li_2', 'li_3', 'indent', subnodeHtml, li_2_to_li_3_subnodeIndentedHtml);
    testListMulti('li_2', 'li_3', 'outdent', li_2_to_li_3_subnodeIndentedHtml, subnodeHtml);

    // Via text selection
    testListMulti('li_2', 'li_3', 'indent', subnodeHtml, li_2_to_li_3_subnodeIndentedHtml, true);
    testListMulti('li_2', 'li_3', 'outdent', li_2_to_li_3_subnodeIndentedHtml, subnodeHtml, true);
});

test("Second-level same sublist indent/outdent", function () {
    expect(4);

    testListMulti('li_2_1', 'li_2_2', 'indent', nestedListHtml, li_2_1_to_li_2_2_indentedHtml);
    testListMulti('li_2_1', 'li_2_2', 'outdent', li_2_1_to_li_2_2_indentedHtml, nestedListHtml);

    // Via text selection
    testListMulti('li_2_1', 'li_2_2', 'indent', nestedListHtml, li_2_1_to_li_2_2_indentedHtml, true);
    testListMulti('li_2_1', 'li_2_2', 'outdent', li_2_1_to_li_2_2_indentedHtml, nestedListHtml, true);
});

test("First-level joins prev sublist indent/outdent", function () {
    expect(4);

    testListMulti('li_6', 'li_8', 'indent', nestedListHtml, li_6_to_li_8_indentedHtml);
    testListMulti('li_6', 'li_8', 'outdent', li_6_to_li_8_indentedHtml, nestedListHtml);

    // Via text selection
    testListMulti('li_6', 'li_8', 'indent', nestedListHtml, li_6_to_li_8_indentedHtml, true);
    testListMulti('li_6', 'li_8', 'outdent', li_6_to_li_8_indentedHtml, nestedListHtml, true);
});

test("First-level creates and joins prev list indent/outdent", function () {
    expect(4);

    testListMulti('li_7', 'li_8', 'indent', nestedListHtml, li_7_to_li_8_indentedHtml);
    testListMulti('li_7', 'li_8', 'outdent', li_7_to_li_8_indentedHtml, nestedListHtml);

    // Via text selection
    testListMulti('li_7', 'li_8', 'indent', nestedListHtml, li_7_to_li_8_indentedHtml, true);
    testListMulti('li_7', 'li_8', 'outdent', li_7_to_li_8_indentedHtml, nestedListHtml, true);
});

test("Second-level and down a level", function () {
    expect(2);

    // Via text selection
    testListMulti('li_2_2', 'li_3', 'indent', nestedListHtml, li_2_2_to_li_3_indentedHtml, true);
    testListMulti('li_2_2', 'li_3', 'outdent', li_2_2_to_li_3_indentedHtml, nestedListHtml, true);
});

test("Second-level with mixed lists and down a level", function () {
    expect(2);

    // Via text selection
    testListMulti('li_5_3', 'li_5_4', 'indent', nestedListHtml, li_5_3_to_li_5_4_indentedHtml, true);
    testListMulti('li_5_3', 'li_5_4', 'outdent', li_5_3_to_li_5_4_indentedHtml, nestedListHtml, true);
});

module("list-broken_html", {setup: setupWym});

var doubleIndentHtml = String() +
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
var diFirstOutdentHtml = String() +
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
var diSecondOutdentHtml = String() +
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
var diThirdOutdentHtml = String() +
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

test("Triple outdent doesn't break HTML", function () {
    expect(6);

    testList('li_1_1_1_4', 'outdent', doubleIndentHtml, diFirstOutdentHtml);
    testList(
        'li_1_1_1_4',
        'outdent',
        diFirstOutdentHtml,
        diSecondOutdentHtml
    );
    testList(
        'li_1_1_1_4',
        'outdent',
        diSecondOutdentHtml,
        diThirdOutdentHtml
    );
});

var orderedHtml = String() +
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
var li_2_unorderedHtml = String() +
        '<ul>' +
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
        '</ul>';
var li_1_1_1_unorderedHtml = String() +
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
var li_1_1_1_1_unorderedHtml = String() +
        '<ol>' +
            '<li id="li_1">1' +
                '<ol>' +
                    '<li id="li_1_1">1_1' +
                        '<ol>' +
                            '<li id="li_1_1_1">1_1_1' +
                                '<ul>' +
                                    '<li id="li_1_1_1_1">1_1_1_1</li>' +
                                '</ul>' +
                            '</li>' +
                        '</ol>' +
                    '</li>' +
                '</ol>' +
            '</li>' +
            '<li id="li_2">2</li>' +
        '</ol>';

module("list-order_unordered_conversion", {setup: setupWym});
if (!SKIP_KNOWN_FAILING_TESTS) {
    test("Ordered to unordered second item", function () {
        expect(4);

        testList('li_2', 'unordered', orderedHtml, li_2_unorderedHtml);
        testList('li_2', 'ordered', li_2_unorderedHtml, orderedHtml);
    });
}

if (!SKIP_KNOWN_FAILING_TESTS) {
    test("Ordered to unordered nested", function () {
        expect(4);

        testList('li_1_1_1', 'unordered', orderedHtml, li_1_1_1_unorderedHtml);
        testList('li_1_1_1', 'ordered', li_1_1_1_unorderedHtml, orderedHtml);
    });
}
if ($.browser.safari && !SKIP_KNOWN_FAILING_TESTS) {
    test("Ordered to unordered one item", function () {
        expect(4);

        testList('li_1_1_1_1', 'unordered', orderedHtml, li_1_1_1_1_unorderedHtml);
        testList('li_1_1_1_1', 'ordered', li_1_1_1_1_unorderedHtml, orderedHtml);
    });
}

module("list-correction", {setup: setupWym});

test("Should correct invalid list nesting", function () {
    expect(2);

    var wymeditor = jQuery.wymeditors(0);

    var expected = "<ul><li>a<ul><li>a.1<\/li><\/ul><\/li><li>b<\/li><\/ul>";
    // FF
    var invalid_ff_html = "<ul><li>a<\/li><ul><li>a.1<\/li><\/ul><li>b<br><\/li><\/ul>";
    wymeditor.html(invalid_ff_html);
    htmlEquals(wymeditor, expected);
    // IE
    // IE has invalid sublist nesting
    expected = "<ul>\r\n<li>a<ul>\r\n<li>a.1<\/li><\/ul><\/li>\r\n<li>b<\/li><\/ul>";
    var invalid_ie_html = "<UL>\r\n<LI>a<\/LI>\r\n<UL>\r\n<LI>a.1<\/LI><\/UL>\r\n<LI>b<\/LI><\/UL>";
    wymeditor.html(invalid_ie_html);
    htmlEquals(wymeditor, expected);
});

test("Double indent correction", function () {
    expect(1);

    var wymeditor = jQuery.wymeditors(0);

    var brokenHtml = String() +
            '<ol>' +
                '<li id="li_1">1' +
                    '<ol>' +
                        '<ol>' +
                            '<li id="li_1_1_1">1_1_1</li>' +
                        '</ol>' +
                    '</ol>' +
                '</li>' +
            '</ol>';
    var repairedHtml = String() +
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

module("list-tabbing", {setup: setupWym});

test("Tab key indents", function () {
    expect(2);

    var initHtml = nestedListHtml;
    var expectedHtml = li_7_indentedHtml;
    var elmntId = "li_7";

    var wymeditor = jQuery.wymeditors(0);
    wymeditor.html(initHtml);

    var $body = $(wymeditor._doc).find('body.wym_iframe');
    var actionElement = $body.find('#' + elmntId)[0];

    moveSelector(wymeditor, actionElement);

    simulateKey(WYMeditor.KEY.TAB, actionElement);
    htmlEquals(wymeditor, expectedHtml);
});

test("Shift+Tab outdents", function () {
    expect(2);

    var initHtml = String() +
            '<ol>' +
                '<li>' +
                    '<ol>' +
                        '<li id="li_1_1">1_1</li>' +
                    '</ol>' +
                '</li>' +
                '<li id="li_2">2</li>' +
            '</ol>';
    var expectedHtml = String() +
            '<ol>' +
                '<li id="li_1_1">1_1</li>' +
                '<li id="li_2">2</li>' +
            '</ol>';

    var elmntId = "li_1_1";

    var wymeditor = jQuery.wymeditors(0);
    wymeditor.html(initHtml);

    var $body = $(wymeditor._doc).find('body.wym_iframe');
    var actionElement = $body.find('#' + elmntId)[0];

    moveSelector(wymeditor, actionElement);

    simulateKey(WYMeditor.KEY.TAB, actionElement, {'shiftKey': true});
    htmlEquals(wymeditor, expectedHtml);
});

test("Tab has no effect outside lists", function () {
    expect(2);

    var initHtml = '<p id="p_1">test</p>';
    var expectedHtml = initHtml;
    var elmntId = "p_1";

    var wymeditor = jQuery.wymeditors(0);
    wymeditor.html(initHtml);

    var $body = $(wymeditor._doc).find('body.wym_iframe');
    var actionElement = $body.find('#' + elmntId)[0];

    moveSelector(wymeditor, actionElement);

    simulateKey(WYMeditor.KEY.TAB, actionElement);
    htmlEquals(wymeditor, expectedHtml);
});
