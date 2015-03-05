/* jshint camelcase: false, maxlen: 105 */
/* global
    SKIP_KNOWN_FAILING_TESTS,
    prepareUnitTestModule,
    wymEqual,
    makeTextSelection,
    moveSelector,
    simulateKey,
    strictEqual,
    makeSelection,
    ok,
    test,
    manipulationTestHelper,
    QUnit,
    deepEqual
*/
"use strict";

module("list-_getSelectedListItems", {setup: prepareUnitTestModule});

var getSelectedListItemsHtml = [""
    , '<ul id="0">'
        , '<li id="0-0">'
            , '0-0-0'
        , '</li>'
        , '<li id="0-1">'
            , '0-1-0'
            , '<br id="0-1-1" />'
            , '0-1-2'
        , '</li>'
        , '<li id="0-2">'
            , '0-2-0'
        , '</li>'
        , '<li id="0-3">'
            , '<ol id="0-3-0">'
                , '<li id="0-3-0-0">'
                    , '0-3-0-0-0'
                , '</li>'
                , '<li id="0-3-0-1">'
                    , '0-3-0-1-0'
                    , '<ol id="0-3-0-1-1">'
                        , '<li id="0-3-0-1-1-0">'
                            , '<span id="0-3-0-1-1-0-0">'
                                , '0-3-0-1-1-0-0-0'
                                , '<br id="0-3-0-1-1-0-0-1">'
                                , '0-3-0-1-1-0-0-2'
                            , '</span>'
                        , '</li>'
                    , '</ol>'
                , '</li>'
            , '</ol>'
        , '</li>'
    , '</ul>'
    , '<ol id="1">'
        , '<li id="1-1">'
            , '1-1-0'
        , '</li>'
        , '<li id="1-2">'
            , '1-2-0'
            , '<ul id="1-2-1">'
                , '<li id="1-2-1-1">'
                    , '1-2-1-1-0'
                , '</li>'
            , '</ul>'
            , '1-2-1'
        , '</li>'
        , '<li id="1-3">'
            , '1-3-0'
        , '</li>'
        , '<li id="1-4">'
            , '1-4-0'
        , '</li>'
    , '</ol>'
    , '<ol id="2">'
        , '<li id="2-0">'
            , '2-0-0'
        , '</li>'
        , '<li id="2-1">'
            , '2-1-0'
        , '</li>'
        , '<li id="2-2">'
        , '</li>'
        , '<li id="2-3">'
            , '2-3-0'
            , '<ol id="2-3-1">'
                , '<li id="2-3-1-0">'
                    , '2-3-1-0-0'
                , '</li>'
                , '<li id="2-3-1-1">'
                , '</li>'
            , '</ol>'
            , '2-3-2'
        , '</li>'
        , '<li id="2-4">'
            , '2-4-0'
            , '<table id="2-4-1">'
                , '<tbody id="2-4-1-0">'
                    , '<tr id="2-4-1-0-0">'
                        , '<td id="2-4-1-0-0-0">'
                            , '2-4-1-0-0-0-0'
                        , '</td>'
                        , '<td id="2-4-1-0-0-1">'
                            , '2-4-1-0-0-1-0'
                            , '<ul id="2-4-1-0-0-1-1">'
                                , '<li id="2-4-1-0-0-1-1-0">'
                                    , '2-4-1-0-0-1-1-0-0'
                                , '</li>'
                                , '<li id="2-4-1-0-0-1-1-1">'
                                    , '2-4-1-0-0-1-1-1-0'
                                , '</li>'
                            , '</ul>'
                        , '</td>'
                    , '</tr>'
                , '</tbody>'
            , '</table>'
        , '</li>'
        , '<li id="2-5">'
            , '2-5-0'
        , '</li>'
    , '</ol>'
].join('');

/**
    testGetSelectedListItems

    This is a helper function for testing the
    WYMeditor.editor._getSelectedListItems method.

    It works by being provided a description of a selection to perform and a
    list ids of of list items which are expected to be returned by the tested
    method.

    @param startElementId The `id` of the element in which the selection will
                              start.
    @param startIndex Index of node inside the above list item, with which
                      the selection will start.
    @param endElementId Opposite of startLiId.
    @param endIndex Opposite of startLiIndex.
    @param expectedLisIds0 Array of `id`s of list items which are expected to
                           be returned from `_getSelectedListItems`.
    @param expectedLisIds1 An acceptable variation.
    @param expectedLisIds2 Another acceptable variation.
*/
function testGetSelectedListItems(
    startElementId,
    startIndex,
    endElementId,
    endIndex,
    expectedLisIds0,
    expectedLisIds1,
    expectedLisIds2
) {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        startElement,
        endElement,
        assertStrSelection;

    function getSelectedLisIds() {
        var sel = wymeditor.selection();

        return jQuery.makeArray(
            jQuery(wymeditor._getSelectedListItems(sel)).map(function () {
                var element = this;
                return element.getAttribute('id');
            })
        );
    }

    wymeditor.rawHtml(getSelectedListItemsHtml);
    $body = wymeditor.$body();
    QUnit.expect(1);

    startElement = $body.find('#' + startElementId)[0];
    endElement = $body.find('#' + endElementId)[0];
    assertStrSelection =
        'from li#' + startElementId + '@' + startIndex +
        ' to li#' + endElementId + '@' + endIndex;

    makeSelection(
        wymeditor,
        startElement,
        endElement,
        startIndex,
        endIndex
    );
    ok(
        getSelectedLisIds().toString() === expectedLisIds0.toString() ||
        getSelectedLisIds().toString() === expectedLisIds1.toString() ||
        getSelectedLisIds().toString() === expectedLisIds2.toString(),
        assertStrSelection
    );
}

test("Single, top level, caret at start", function () {
    testGetSelectedListItems(
        '0-0', 0,
        '0-0', 0,
        ['0-0']
    );
});

test("Single, top level, caret at end", function () {
    testGetSelectedListItems(
        '0-0', 1,
        '0-0', 1,
        ['0-0']
    );
});

test("Single, top level, whole selection", function () {
    testGetSelectedListItems(
        '0-0', 0,
        '0-0', 1,
        ['0-0']
    );
});

test("Single, top level, partial selection at start", function () {
    testGetSelectedListItems(
        '0-1', 0,
        '0-1', 1,
        ['0-1']
    );
});

test("Single, top level, partial selection at end", function () {
    testGetSelectedListItems(
        '0-1', 2,
        '0-1', 3,
        ['0-1']
    );
});

test("Single, second level, caret at start", function () {
    testGetSelectedListItems(
        '0-3-0-0', 0,
        '0-3-0-0', 0,
        ['0-3-0-0']
    );
});

test("Single, third level, caret at start", function () {
    testGetSelectedListItems(
        '0-3-0-0', 0,
        '0-3-0-0', 0,
        ['0-3-0-0']
    );
});

test("Single, third level, caret at start, inside child", function () {
    testGetSelectedListItems(
        '0-3-0-1-1-0-0', 0,
        '0-3-0-1-1-0-0', 0,
        ['0-3-0-1-1-0']
    );
});

test("Single, third level, partial selection at start, inside child",
    function () {
    testGetSelectedListItems(
        '0-3-0-1-1-0-0', 0,
        '0-3-0-1-1-0-0', 1,
        ['0-3-0-1-1-0']
    );
});

test("Single, third level, partial selection at end, inside child",
    function () {
    testGetSelectedListItems(
        '0-3-0-1-1-0-0', 2,
        '0-3-0-1-1-0-0', 3,
        ['0-3-0-1-1-0']
    );
});

test("Single, third level, caret at end, inside child", function () {
    testGetSelectedListItems(
        '0-3-0-1-1-0-0', 3,
        '0-3-0-1-1-0-0', 3,
        ['0-3-0-1-1-0']
    );
});

test("Across two, top level, selection from start to end", function () {
    testGetSelectedListItems(
        '0-0', 0,
        '0-1', 3,
        ['0-0', '0-1']
    );
});

test("Across two, top level, selection from end to end", function () {
    testGetSelectedListItems(
        '0-0', 1,
        '0-1', 3,
        ['0-0', '0-1'],
        ['0-1']
    );
});

test("Across three, top level, selection from start to end", function () {
    testGetSelectedListItems(
        '0-0', 0,
        '0-2', 1,
        ['0-0', '0-1', '0-2']
    );
});

test("Across three, top level, selection from end to end", function () {
    testGetSelectedListItems(
        '0-0', 1,
        '0-2', 1,
        ['0-0', '0-1', '0-2'],
        ['0-1', '0-2']
    );
});

test("In range selections, don't select items in which, directly, there is " +
    "no text selection", function () {
    testGetSelectedListItems(
        '0-2', 0,
        '0-3-0-0', 1,
        ['0-2', '0-3-0-0']
    );
});

test("Across five, across levels, selection from start to start", function () {
    testGetSelectedListItems(
        '0-2', 0,
        '0-3-0-1-1-0', 0,
        ['0-2', '0-3-0-0', '0-3-0-1']
    );
});

test("Across five, across levels, selection from start to end", function () {
    testGetSelectedListItems(
        '0-2', 0,
        '0-3-0-1-1-0', 1,
        ['0-2', '0-3-0-0', '0-3-0-1', '0-3-0-1-1-0']
    );
});

test("Across five, across levels, selection from end to start", function () {
    testGetSelectedListItems(
        '0-2', 1,
        '0-3-0-1-1-0', 0,
        ['0-2', '0-3-0-0', '0-3-0-1'],
        ['0-3-0-0', '0-3-0-1']
    );
});

test("Across five, across levels, selection from start to start, inside child",
    function () {
    testGetSelectedListItems(
        '0-2', 0,
        '0-3-0-1-1-0-0', 0,
        ['0-2', '0-3-0-0', '0-3-0-1'],
        ['0-2', '0-3-0-0', '0-3-0-1', '0-3-0-1-1-0']
    );
});

test("Across five, across levels, selection from start to somewhere, inside " +
    "child", function () {
    testGetSelectedListItems(
        '0-2', 0,
        '0-3-0-1-1-0-0', 1,
        ['0-2', '0-3-0-0', '0-3-0-1', '0-3-0-1-1-0']
    );
});

test("Across five, across levels, selection from start to end, inside child",
    function () {
    testGetSelectedListItems(
        '0-2', 0,
        '0-3-0-1-1-0-0', 3,
        ['0-2', '0-3-0-0', '0-3-0-1', '0-3-0-1-1-0']
    );
});

test("Across two, across levels, nested list is first child, selection from " +
    "start to end", function () {
    testGetSelectedListItems(
        '0-3', 0,
        '0-3-0-0', 1,
        ['0-3-0-0']
    );
});

test("Across two, across levels, selection from start to end", function () {
    testGetSelectedListItems(
        '1-2', 0,
        '1-2-1-1', 1,
        ['1-2', '1-2-1-1']
    );
});

test("Across two, across levels, selection from before nested to start",
    function () {
    testGetSelectedListItems(
        '1-2', 1,
        '1-2-1-1', 0,
        ['1-2', '1-2-1-1'],
        ['1-2'],
        []
    );
});

test("Across two, across levels, selection from before nested to end",
    function () {
    testGetSelectedListItems(
        '1-2', 1,
        '1-2-1-1', 1,
        ['1-2', '1-2-1-1'],
        ['1-2-1-1']
    );
});

test("Across two, across levels, selection from start to start", function () {
    testGetSelectedListItems(
        '1-2', 0,
        '1-2-1-1', 0,
        ['1-2', '1-2-1-1'],
        ['1-2']
    );
});

test("Across two, across levels, selection from start to end", function () {
    testGetSelectedListItems(
        '1-2', 0,
        '1-2-1-1', 1,
        ['1-2', '1-2-1-1']
    );
});

test("Empty list item is included when selected across", function () {
    testGetSelectedListItems(
        '2-1', 0,
        '2-3', 1,
        ['2-1', '2-2', '2-3']
    );
});

test("Empty list item is included when selection starts at it", function () {
    testGetSelectedListItems(
        '2-2', 0,
        '2-3', 1,
        ['2-2', '2-3']
    );
});

test("Empty list item may be included when selection ends at it", function () {
    testGetSelectedListItems(
        '2-1', 0,
        '2-2', 0,
        ['2-1', '2-2'],
        ['2-1']
    );
});

test("Empty list item is selected when caret is inside of it", function () {
    testGetSelectedListItems(
        '2-2', 0,
        '2-2', 0,
        ['2-2']
    );
});

test("Across separate lists", function () {
    testGetSelectedListItems(
        '1-3', 0,
        '2-1', 1,
        ['1-3', '1-4', '2-0', '2-1']
    );
});

test("Across nesting descent", function () {
    testGetSelectedListItems(
        '1-2-1-1', 0,
        '1-2', 3,
        ['1-2', '1-2-1-1']
    );
});

test("A whole journey", function () {
    testGetSelectedListItems(
        '0-0', 0,
        '1-4', 1,
        ['0-0', '0-1', '0-2', '0-3-0-0', '0-3-0-1', '0-3-0-1-1-0',
         '1-1', '1-2', '1-2-1-1', '1-3', '1-4']
    );
});

test("Partially inside a table", function () {
    testGetSelectedListItems(
        '2-4', 0,
        '2-4-1-0-0-0', 1,
        ['2-4']
    );
});

test("Collapsed, single, inside table", function () {
    testGetSelectedListItems(
        '2-4-1-0-0-1-1-0', 0,
        '2-4-1-0-0-1-1-0', 0,
        ['2-4-1-0-0-1-1-0']
    );
});

test("Text, single, inside table", function () {
    testGetSelectedListItems(
        '2-4-1-0-0-1-1-0', 0,
        '2-4-1-0-0-1-1-0', 1,
        ['2-4-1-0-0-1-1-0']
    );
});

test("Two items, inside table", function () {
    testGetSelectedListItems(
        '2-4-1-0-0-1-1-0', 0,
        '2-4-1-0-0-1-1-1', 1,
        ['2-4-1-0-0-1-1-0', '2-4-1-0-0-1-1-1']
    );
});

test("Across table", function () {
    testGetSelectedListItems(
        '2-4', 0,
        '2-5', 1,
        ['2-4', '2-5']
    );
});

module("list-indent_outdent", {setup: prepareUnitTestModule});
/**
* Run a list manipulation and verify the results.
*
* @param elmntId An id for the li that will be modified
* @param action A string with either 'indent' or 'outdent'
* @param startHtml The starting HTML
* @param expectedHtml The expected HTML result.
* @param isText Should this be considered a text selection (as opposed to a DOM
  selection). Default is false.
* @param doSelection Whether to start by changing the selection. Defaults to true.
*/
function testList(elmntId, action, startHtml, expectedHtml, isText, doSelection) {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        actionLi,
        buttonSelector,
        actionButton;

    if (typeof doSelection === 'undefined') {
        doSelection = true;
    }

    if (doSelection) {
        wymeditor.rawHtml(startHtml);
        $body = wymeditor.$body();
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

    wymEqual(wymeditor, expectedHtml);
}

/*
    testListRoundTrip
    =================

    Run a list manipulation one direction and then the opposite direction and
    ensure that they're exact opposites of eachother. Generally, this is used to
    ensure that the selection at the end of the action is in a sane place.

    `elmntId` An id for the li that will be modified

    `action` One of `indent`, `outdent`, `ordered` or `unordered`. The opposite
    action will be performed afterwards.

    `startHtml` The starting HTML

    `expectedHtml` The expected HTML result.

    `isText` Should this be considered a text selection (as opposed to a DOM
    selection). Default is false.
*/
function testListRoundTrip(elmntId, action, startHtml, expectedHtml, isText) {
    var oppositeAction;

    if (typeof isText === 'undefined') {
        isText = false;
    }

    if (action === 'outdent') {
        oppositeAction = 'indent';
    } else if (action === 'indent') {
        oppositeAction = 'outdent';
    } else if (action === 'unordered') {
        oppositeAction = 'ordered';
    } else if (action === 'ordered') {
        oppositeAction = 'unordered';
    } else {
        ok(
            false,
            'Improper call to testList. Action must be either "indent", ' +
                '"outdent", "ordered" or "unordered"'
        );
    }

    testList(elmntId, action, startHtml, expectedHtml, isText, true);
    // Run it again the other direction without changing the selection or
    // initial HTML
    testList(elmntId, oppositeAction, expectedHtml, startHtml, isText, false);
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
function testListMulti(
    startElmntId, endElmntId, action, startHtml, expectedHtml, isText
) {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        startLi,
        endLi,
        buttonSelector,
        actionButton;
    wymeditor.rawHtml(startHtml);

    $body = wymeditor.$body();
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

    wymEqual(wymeditor, expectedHtml);
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


test("No change outside list", function () {
    QUnit.expect(4);
    var notList = '<p id="p_1">1</p>';

    testList('p_1', 'indent', notList, notList);
    testList('p_1', 'outdent', notList, notList);

    // Text selection instead
    testList('p_1', 'indent', notList, notList, true);
    testList('p_1', 'outdent', notList, notList, true);
});

test("First-level w/sublist", function () {
    QUnit.expect(8);

    testListRoundTrip('li_2', 'indent', nestedListHtml, li_2_indentedHtml);
    testListRoundTrip('li_2', 'outdent', li_2_indentedHtml, nestedListHtml);
    // Text selection instead
    testListRoundTrip('li_2', 'indent', nestedListHtml, li_2_indentedHtml, true);
    testListRoundTrip('li_2', 'outdent', li_2_indentedHtml, nestedListHtml, true);
});

test("First-level previous sublist joins lists", function () {
    QUnit.expect(8);

    testListRoundTrip('li_3', 'indent', nestedListHtml, li_3_indentedHtml);
    testListRoundTrip('li_3', 'outdent', li_3_indentedHtml, nestedListHtml);
    // Via Text selection
    testListRoundTrip('li_3', 'indent', nestedListHtml, li_3_indentedHtml, true);
    testListRoundTrip('li_3', 'outdent', li_3_indentedHtml, nestedListHtml, true);
});

test("Outdent joining list with longer content", function () {
    QUnit.expect(2);

    testList('li_5_3_1', 'outdent', nestedListHtml, li_5_3_1_outdentedHtml);
    // Can't go the other way because we've turned a ul to an ol

    // Via Text selection
    testList('li_5_3_1', 'outdent', nestedListHtml, li_5_3_1_outdentedHtml, true);
});

test("Outdent w/sublist", function () {
    QUnit.expect(8);

    testListRoundTrip('li_5_3', 'outdent', nestedListHtml, li_5_3_outdentedHtml);
    testListRoundTrip('li_5_3', 'indent', li_5_3_outdentedHtml, nestedListHtml);

    // Via Text selection
    testListRoundTrip('li_5_3', 'outdent', nestedListHtml, li_5_3_outdentedHtml, true);
    testListRoundTrip('li_5_3', 'indent', li_5_3_outdentedHtml, nestedListHtml, true);
});

test("Outdent last element in list", function () {
    QUnit.expect(8);

    testListRoundTrip('li_3_1', 'outdent', nestedListHtml, li_3_1_outdentedHtml);
    testListRoundTrip('li_3_1', 'indent', li_3_1_outdentedHtml, nestedListHtml);

    // Via Text selection
    testListRoundTrip('li_3_1', 'outdent', nestedListHtml, li_3_1_outdentedHtml, true);
    testListRoundTrip('li_3_1', 'indent', li_3_1_outdentedHtml, nestedListHtml, true);
});

test("Second-level w/sublist", function () {
    QUnit.expect(8);

    testListRoundTrip('li_5_3', 'indent', nestedListHtml, li_5_3_indentedHtml);
    testListRoundTrip('li_5_3', 'outdent', li_5_3_indentedHtml, nestedListHtml);

    // Via Text selection
    testListRoundTrip('li_5_3', 'indent', nestedListHtml, li_5_3_indentedHtml, true);
    testListRoundTrip('li_5_3', 'outdent', li_5_3_indentedHtml, nestedListHtml, true);
});

test("First-level no-sublist", function () {
    QUnit.expect(8);

    testListRoundTrip('li_7', 'indent', nestedListHtml, li_7_indentedHtml);
    testListRoundTrip('li_7', 'outdent', li_7_indentedHtml, nestedListHtml);

    // Via Text selection
    testListRoundTrip('li_7', 'indent', nestedListHtml, li_7_indentedHtml, true);
    testListRoundTrip('li_7', 'outdent', li_7_indentedHtml, nestedListHtml, true);
});

test("Second-level no-sublist", function () {
    QUnit.expect(8);

    testListRoundTrip('li_2_2', 'indent', nestedListHtml, li_2_2_indentedHtml);
    testListRoundTrip('li_2_2', 'outdent', li_2_2_indentedHtml, nestedListHtml);

    // Via Text selection
    testListRoundTrip('li_2_2', 'indent', nestedListHtml, li_2_2_indentedHtml, true);
    testListRoundTrip('li_2_2', 'outdent', li_2_2_indentedHtml, nestedListHtml, true);
});

test("First-level no-sublist first-item", function () {
    QUnit.expect(8);

    testListRoundTrip('li_1', 'indent', nestedListHtml, li_1_indentedHtml);
    testListRoundTrip('li_1', 'outdent', li_1_indentedHtml, nestedListHtml);

    // Via Text selection
    testListRoundTrip('li_1', 'indent', nestedListHtml, li_1_indentedHtml, true);
    testListRoundTrip('li_1', 'outdent', li_1_indentedHtml, nestedListHtml, true);
});

test("First-level no-sublist previous-sublist", function () {
    QUnit.expect(8);

    testListRoundTrip('li_4', 'indent', nestedListHtml, li_4_indentedHtml);
    testListRoundTrip('li_4', 'outdent', li_4_indentedHtml, nestedListHtml);

    // Via Text selection
    testListRoundTrip('li_4', 'indent', nestedListHtml, li_4_indentedHtml, true);
    testListRoundTrip('li_4', 'outdent', li_4_indentedHtml, nestedListHtml, true);
});

test("Can't dedent first-level", function () {
    QUnit.expect(10);

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
    QUnit.expect(8);

    testListRoundTrip('li_1', 'indent', nestedFirstItemHtml, li_1_indentedNestedFirstItemHtml);
    testListRoundTrip('li_1', 'outdent', li_1_indentedNestedFirstItemHtml, nestedFirstItemHtml);

    // Via Text selection
    testListRoundTrip('li_1', 'indent', nestedFirstItemHtml, li_1_indentedNestedFirstItemHtml, true);
    testListRoundTrip('li_1', 'outdent', li_1_indentedNestedFirstItemHtml, nestedFirstItemHtml, true);
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
    QUnit.expect(8);

    testListRoundTrip('li_3', 'indent', overhungListHtml, li_3_overhungHtml);
    testListRoundTrip('li_3', 'outdent', li_3_overhungHtml, overhungListHtml);

    // Via Text selection
    testListRoundTrip('li_3', 'indent', overhungListHtml, li_3_overhungHtml, true);
    testListRoundTrip('li_3', 'outdent', li_3_overhungHtml, overhungListHtml, true);
});

var textContentAfterSublistHtml = String() +
        '<ol>' +
            '<li id="li_1">1' +
                '<ul>' +
                    '<li id="li_1_1">1_1</li>' +
                    '<li id="li_1_2">1_2</li>' +
                '</ul>' +
                '1_3_content' +
            '</li>' +
            '<li id="li_2">2</li>' +
        '</ol>';
var li_1_2_outdentedTextContentAfterSublistHtml = String() +
        '<ol>' +
            '<li id="li_1">1' +
                '<ul>' +
                    '<li id="li_1_1">1_1</li>' +
                '</ul>' +
            '</li>' +
            '<li id="li_1_2">1_2<br />' +
                '1_3_content' +
            '</li>' +
            '<li id="li_2">2</li>' +
        '</ol>';
test("Content after sublist text indent/outdent", function () {
    QUnit.expect(2);

    // Not round-trippable
    testList(
        'li_1_2',
        'outdent',
        textContentAfterSublistHtml,
        li_1_2_outdentedTextContentAfterSublistHtml
    );

    // Via Text selection
    testList(
        'li_1_2',
        'outdent',
        textContentAfterSublistHtml,
        li_1_2_outdentedTextContentAfterSublistHtml,
        true
    );
});
var nodeContentAfterSublistHtml = String() +
        '<ol>' +
            '<li id="li_1">1' +
                '<ul>' +
                    '<li id="li_1_1">1_1</li>' +
                    '<li id="li_1_2">1_2</li>' +
                '</ul>' +
                '<br class="wym-blocking-element-spacer wym-editor-only" />' +
                '<table><tbody><tr><td>td_1_3</td></tr></tbody></table>' +
                '<br class="wym-blocking-element-spacer wym-editor-only" />' +
            '</li>' +
            '<li id="li_2">2</li>' +
        '</ol>';
var li_1_2_outdentedNodeContentAfterSublistHtml = String() +
        '<ol>' +
            '<li id="li_1">1' +
                '<ul>' +
                    '<li id="li_1_1">1_1</li>' +
                '</ul>' +
            '</li>' +
            '<li id="li_1_2">1_2' +
                '<br class="wym-blocking-element-spacer wym-editor-only" />' +
                '<table><tbody><tr><td>td_1_3</td></tr></tbody></table>' +
                '<br class="wym-blocking-element-spacer wym-editor-only" />' +
            '</li>' +
            '<li id="li_2">2</li>' +
        '</ol>';

// This test doesn't pass in older versions of IE because they add an extra
// space onto the end of an `li` element's text content. The functionality
// tested still works in those older IE versions.
if (!WYMeditor.isInternetExplorerPre11() || !SKIP_KNOWN_FAILING_TESTS) {
    test("Content after sublist node indent/outdent", function () {
        QUnit.expect(2);

        // Not round-trippable
        testList(
            'li_1_2',
            'outdent',
            nodeContentAfterSublistHtml,
            li_1_2_outdentedNodeContentAfterSublistHtml
        );

        // Via Text selection
        testList(
            'li_1_2',
            'outdent',
            nodeContentAfterSublistHtml,
            li_1_2_outdentedNodeContentAfterSublistHtml,
            true
        );
    });
}

var spanInSublistHtml = String() +
        '<ol>' +
            '<li id="li_1">1' +
                '<ul>' +
                    '<li id="li_1_1">1_1' +
                        '<ul>' +
                            '<li id="li_1_1_2">1_1_2</li>' +
                        '</ul>' +
                    '</li>' +
                    '<li id="li_1_2">1_2</li>' +
                '</ul>' +
                'text_2 ' + // IE really likes this space
            '</li>' +
            '<li id="li_3">3<br />' +
                'text_3_1<span id="span_3_2">3_2</span>text_3_3' +
            '</li>' +
        '</ol>';

var span_3_2_indentedSpanInSublistHtml = String() +
        '<ol>' +
            '<li id="li_1">1' +
                '<ul>' +
                    '<li id="li_1_1">1_1' +
                        '<ul>' +
                            '<li id="li_1_1_2">1_1_2</li>' +
                        '</ul>' +
                    '</li>' +
                    '<li id="li_1_2">1_2</li>' +
                '</ul>' +
                'text_2 ' +
                '<ol>' +
                    '<li id="li_3">3<br />' +
                        'text_3_1<span id="span_3_2">3_2</span>text_3_3' +
                    '</li>' +
                '</ol>' +
            '</li>' +
        '</ol>';
test("Span in sublist indent/outdent", function () {
    QUnit.expect(8);

    testListRoundTrip(
        'span_3_2',
        'indent',
        spanInSublistHtml,
        span_3_2_indentedSpanInSublistHtml
    );
    testListRoundTrip(
        'span_3_2',
        'outdent',
        span_3_2_indentedSpanInSublistHtml,
        spanInSublistHtml
    );

    // Via Text selection
    testListRoundTrip(
        'span_3_2',
        'indent',
        spanInSublistHtml,
        span_3_2_indentedSpanInSublistHtml,
        true
    );
    testListRoundTrip(
        'span_3_2',
        'outdent',
        span_3_2_indentedSpanInSublistHtml,
        spanInSublistHtml,
        true
    );
});


module("list-content_reordering", {setup: prepareUnitTestModule});

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
    QUnit.expect(8);

    testListRoundTrip('li_1_5', 'outdent', doubleSublistHtml, li_1_5_doubleSublistOutdentedHtml);
    testListRoundTrip('li_1_5', 'indent', li_1_5_doubleSublistOutdentedHtml, doubleSublistHtml);

    // Via Text selection
    testListRoundTrip('li_1_5', 'outdent', doubleSublistHtml, li_1_5_doubleSublistOutdentedHtml, true);
    testListRoundTrip('li_1_5', 'indent', li_1_5_doubleSublistOutdentedHtml, doubleSublistHtml, true);
});

test("Two same-level sublist last outdent", function () {
    QUnit.expect(8);

    testListRoundTrip('li_1_6', 'outdent', doubleSublistHtml, li_1_6_doubleSublistOutdentedHtml);
    testListRoundTrip('li_1_6', 'indent', li_1_6_doubleSublistOutdentedHtml, doubleSublistHtml);

    // Via Text selection
    testListRoundTrip('li_1_6', 'outdent', doubleSublistHtml, li_1_6_doubleSublistOutdentedHtml, true);
    testListRoundTrip('li_1_6', 'indent', li_1_6_doubleSublistOutdentedHtml, doubleSublistHtml, true);
});

module("list-invalid_nesting", {setup: prepareUnitTestModule});

var invalidNestingNoPreviousHtml = String() +
        '<ol>' +
            '<table id="table_1"><tbody><tr><td>td_1_1</td></tr></tbody></table>' +
            '<ul>' +
                '<li id="li_2_1">2_1' +
                    '<ul>' +
                        '<li id="li_2_1_2">2_1_2</li>' +
                    '</ul>' +
                    'after2_1' +
                '</li>' +
                '<li id="li_2_2">2_2</li>' +
                'after2_2' +
            '</ul>' +
            'text_3' +
            '<li id="li_4">4</li>' +
            'text_5_1<span id="span_5_2">5_2</span>text_5_3' +
            '<li id="li_6">6</li>' +
            '<table id="table_7"><tbody><tr><td>td_7_1</td></tr></tbody></table>' +
            '<ol>' +
                '<li id="li_8">8</li>' +
            '</ol>' +
        '</ol>';
var invalidNestingNoPreviousCorrectedHtml = String() +
        '<ol>' +
            '<li class="spacer_li">' +
                '<table id="table_1"><tbody><tr><td>td_1_1</td></tr></tbody></table>' +
                '<br class="wym-blocking-element-spacer wym-editor-only" />' +
                '<ul>' +
                    '<li id="li_2_1">2_1' +
                        '<ul>' +
                            '<li id="li_2_1_2">2_1_2</li>' +
                        '</ul>' +
                        'after2_1' +
                    '</li>' +
                    '<li id="li_2_2">2_2<br />' +
                        'after2_2' +
                    '</li>' +
                '</ul>' +
                'text_3' +
            '</li>' +
            '<li id="li_4">4<br />' +
                'text_5_1<span id="span_5_2">5_2</span>text_5_3' +
            '</li>' +
            '<li id="li_6">6' +
                '<table id="table_7"><tbody><tr><td>td_7_1</td></tr></tbody></table>' +
                '<br class="wym-blocking-element-spacer wym-editor-only" />' +
                '<ol>' +
                    '<li id="li_8">8</li>' +
                '</ol>' +
            '</li>' +
        '</ol>';

var invalidNestingHtml = String() +
        '<ol>' +
            '<li id="li_2">2</li>' +
            '<ul>' +
                '<li id="li_2_1">2_1' +
                    '<ul>' +
                        '<li id="li_2_1_2">2_1_2</li>' +
                    '</ul>' +
                '</li>' +
                '<li id="li_2_2">2_2</li>' +
            '</ul>' +
            'text_3 ' +
            '<li id="li_4">4</li>' +
            'text_5_1<span id="span_5_2">5_2</span>text_5_3' +
        '</ol>';
var invalidNestingCorrectedHtml = String() +
        '<ol>' +
            '<li id="li_2">2' +
                '<ul>' +
                    '<li id="li_2_1">2_1' +
                        '<ul>' +
                            '<li id="li_2_1_2">2_1_2</li>' +
                        '</ul>' +
                    '</li>' +
                    '<li id="li_2_2">2_2</li>' +
                '</ul>' +
                'text_3 ' +
            '</li>' +
            '<li id="li_4">4<br />' +
                'text_5_1<span id="span_5_2">5_2</span>text_5_3' +
            '</li>' +
        '</ol>';
var li_2_2_outdentInvalidNestingHtml = String() +
        '<ol>' +
            '<li id="li_2">2' +
                '<ul>' +
                    '<li id="li_2_1">2_1' +
                        '<ul>' +
                            '<li id="li_2_1_2">2_1_2</li>' +
                        '</ul>' +
                    '</li>' +
                '</ul>' +
            '</li>' +
            '<li id="li_2_2">2_2<br />' +
                'text_3 ' +
            '</li>' +
            '<li id="li_4">4<br />' +
                'text_5_1<span id="span_5_2">5_2</span>text_5_3' +
            '</li>' +
        '</ol>';

var span_5_2_indentedInvalidNestingHtml = String() +
        '<ol>' +
            '<li id="li_2">2' +
                '<ul>' +
                    '<li id="li_2_1">2_1' +
                        '<ul>' +
                            '<li id="li_2_1_2">2_1_2</li>' +
                        '</ul>' +
                    '</li>' +
                    '<li id="li_2_2">2_2</li>' +
                '</ul>' +
                'text_3 ' +
                '<ol>' +
                    '<li id="li_4">4<br />' +
                        'text_5_1<span id="span_5_2">5_2</span>text_5_3' +
                    '</li>' +
                '</ol>' +
            '</li>' +
        '</ol>';

test("Invalid nesting correction no spacer", function () {
    QUnit.expect(1);

    var wymeditor = jQuery.wymeditors(0),
        $body,
        actionLi,
        startHtml = invalidNestingHtml,
        expectedHtml = invalidNestingCorrectedHtml;

    wymeditor.rawHtml(startHtml);
    $body = wymeditor.$body();
    actionLi = $body.find('#li_4')[0];

    wymeditor._fixInvalidListNesting(actionLi);
    wymEqual(wymeditor, expectedHtml);
});
test("Invalid nesting correction requiring spacer", function () {
    QUnit.expect(1);

    var wymeditor = jQuery.wymeditors(0),
        $body,
        actionLi,
        startHtml = invalidNestingNoPreviousHtml,
        expectedHtml = invalidNestingNoPreviousCorrectedHtml;

    wymeditor.rawHtml(startHtml);
    wymeditor.prepareDocForEditing();
    $body = wymeditor.$body();
    actionLi = $body.find('#li_2_2')[0];

    wymeditor._fixInvalidListNesting(actionLi);
    wymEqual(wymeditor, expectedHtml);
});
test("Invalid nesting outdent", function () {
    QUnit.expect(4);

    // First outdent just corrects things and the second actually makes the change
    testList('li_2_2', 'outdent', invalidNestingHtml, invalidNestingCorrectedHtml);
    testList(
        'li_2_2',
        'outdent',
        null,
        li_2_2_outdentInvalidNestingHtml,
        false,
        false
    );
    // Can't go the other way because of the <br /> business

    // Via Text selection
    testList('li_2_2', 'outdent', invalidNestingHtml, invalidNestingCorrectedHtml, true);
    testList(
        'li_2_2',
        'outdent',
        null,
        li_2_2_outdentInvalidNestingHtml,
        true,
        false
    );
});
test("Invalid unwrapped text indent", function () {
    QUnit.expect(6);

    // First outdent just corrects things and the second actually makes the change
    testList('span_5_2', 'indent', invalidNestingHtml, invalidNestingCorrectedHtml);
    testList(
        'span_5_2',
        'indent',
        null,
        span_5_2_indentedInvalidNestingHtml,
        false,
        false
    );
    testList(
        'span_5_2',
        'outdent',
        null,
        invalidNestingCorrectedHtml,
        false,
        false
    );

    // Via Text selection
    // Not round-trippable because of initial invalid nesting
    testList('span_5_2', 'indent', invalidNestingHtml, invalidNestingCorrectedHtml, true);
    testList(
        'span_5_2',
        'indent',
        null,
        span_5_2_indentedInvalidNestingHtml,
        true,
        false
    );
    testList(
        'span_5_2',
        'outdent',
        null,
        invalidNestingCorrectedHtml,
        true,
        false
    );
});

module("list-invalid_orphaned_listitem", {setup: prepareUnitTestModule});

// Lists that have been "over-closed" and thus have li elements that don't have
// parent lists
var orphanedLiHtml = {};
orphanedLiHtml.base = String() +
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
        '<li id="li_text_sep">li_text_sep</li>';
orphanedLiHtml.unordered = {};
orphanedLiHtml.ordered = {};
orphanedLiHtml.unordered.li_2 = String() +
        '<ol id="ol_1">' +
            '<li id="li_1">li_1' +
                '<ol>' +
                    '<li id="li_1_1">li_1_1</li>' +
                '</ol>' +
            '</li>' +
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
        '</ol>' +
        '<p>stop</p>' +
        '<li id="li_new">li_new</li>' +
        'text' +
        '<li id="li_text_sep">li_text_sep</li>';
orphanedLiHtml.unordered.li_2_1 = orphanedLiHtml.unordered.li_2;
orphanedLiHtml.unordered.li_2_1_1 = orphanedLiHtml.unordered.li_2;
orphanedLiHtml.unordered.li_3 = orphanedLiHtml.unordered.li_2;
test("Unordered corrects orphans", function () {
    QUnit.expect(8);
    var testData = orphanedLiHtml,
        testItems = ['li_2', 'li_2_1', 'li_2_1_1', 'li_3'],
        i,
        itemId;

    for (i = 0; i < testItems.length; i++) {
        itemId = testItems[i];
        testList(itemId, 'unordered', testData.base, testData.unordered[itemId]);

        // Via Text selection
        testList(itemId, 'unordered', testData.base, testData.unordered[itemId], true);
    }
});

orphanedLiHtml.unordered.li_1_1_to_li_3 = orphanedLiHtml.unordered.li_2;
orphanedLiHtml.unordered.li_2_to_li_2_1_1 = orphanedLiHtml.unordered.li_2;
test("Unordered corrects with multiselect", function () {
    QUnit.expect(4);
    var testData = orphanedLiHtml,
        testItems = [['li_1_1', 'li_3'], ['li_2', 'li_2_1_1']],
        i,
        startItemId,
        endItemId,
        resultKey;

    for (i = 0; i < testItems.length; i++) {
        startItemId = testItems[i][0];
        endItemId = testItems[i][1];
        resultKey = startItemId + '_to_' + endItemId;
        testListMulti(startItemId, endItemId, 'unordered', testData.base, testData.unordered[resultKey]);

        // Via Text selection
        testListMulti(
            startItemId,
            endItemId,
            'unordered',
            testData.base,
            testData.unordered[resultKey],
            true
        );
    }
});

orphanedLiHtml.unordered.li_new = String() +
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
        '<ul>' +
            '<li id="li_new">li_new</li>' +
        '</ul>' +
        'text' +
        '<li id="li_text_sep">li_text_sep</li>';
orphanedLiHtml.ordered.li_new = String() +
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
        '<ol>' +
            '<li id="li_new">li_new</li>' +
        '</ol>' +
        'text' +
        '<li id="li_text_sep">li_text_sep</li>';

test("Correction breaks on paragraphs", function () {
    QUnit.expect(6);
    var testData = orphanedLiHtml,
        testItem = 'li_new';

    // First action just fixes the list
    testList(testItem, 'unordered', testData.base, testData.ordered[testItem]);
    testList(testItem, 'unordered', null, testData.unordered[testItem], false, false);
    testList(testItem, 'ordered', null, testData.ordered[testItem], false, false);

    // Via Text selection
    testList(testItem, 'unordered', testData.base, testData.ordered[testItem], true);
    testList(testItem, 'unordered', null, testData.unordered[testItem], false, false);
    testList(testItem, 'ordered', null, testData.ordered[testItem], false, false);
});
orphanedLiHtml.unordered.li_text_sep = String() +
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
        '<ul>' +
            '<li id="li_text_sep">li_text_sep</li>' +
        '</ul>';
orphanedLiHtml.ordered.li_text_sep = String() +
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
        '</ol>';
test("Correction breaks on text", function () {
    QUnit.expect(6);
    var testData = orphanedLiHtml,
        testItem = 'li_text_sep';

    // Default action on the first click
    testList(testItem, 'unordered', testData.base, testData.ordered[testItem]);
    testList(testItem, 'unordered', null, testData.unordered[testItem], false, false);
    testList(testItem, 'ordered', null, testData.ordered[testItem], false, false);

    // Via Text selection
    testList(testItem, 'unordered', testData.base, testData.ordered[testItem], true);
    testList(testItem, 'unordered', null, testData.unordered[testItem], false, false);
    testList(testItem, 'ordered', null, testData.ordered[testItem], false, false);
});


module("list-multi_selection", {setup: prepareUnitTestModule});

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

var listsWithContentBetweenHtml = String() +
    '<ol>' +
        '<li id="li_1">1</li>' +
        '<li id="li_2">2</li>' +
        '<li id="li_3">3</li>' +
    '</ol>' +
    '<p>Content</p>' +
    '<ul>' +
        '<li id="li_4">4</li>' +
        '<li id="li_5">5</li>' +
        '<li id="li_6">6</li>' +
    '</ul>';

test("Second-level with sub-node", function () {
    QUnit.expect(4);

    testListMulti('li_2', 'li_3', 'indent', subnodeHtml, li_2_to_li_3_subnodeIndentedHtml);
    testListMulti('li_2', 'li_3', 'outdent', li_2_to_li_3_subnodeIndentedHtml, subnodeHtml);

    // Via text selection
    testListMulti('li_2', 'li_3', 'indent', subnodeHtml, li_2_to_li_3_subnodeIndentedHtml, true);
    testListMulti('li_2', 'li_3', 'outdent', li_2_to_li_3_subnodeIndentedHtml, subnodeHtml, true);
});

test("Second-level same sublist indent/outdent", function () {
    QUnit.expect(4);

    testListMulti('li_2_1', 'li_2_2', 'indent', nestedListHtml, li_2_1_to_li_2_2_indentedHtml);
    testListMulti('li_2_1', 'li_2_2', 'outdent', li_2_1_to_li_2_2_indentedHtml, nestedListHtml);

    // Via text selection
    testListMulti('li_2_1', 'li_2_2', 'indent', nestedListHtml, li_2_1_to_li_2_2_indentedHtml, true);
    testListMulti('li_2_1', 'li_2_2', 'outdent', li_2_1_to_li_2_2_indentedHtml, nestedListHtml, true);
});

test("First-level joins prev sublist indent/outdent", function () {
    QUnit.expect(4);

    testListMulti('li_6', 'li_8', 'indent', nestedListHtml, li_6_to_li_8_indentedHtml);
    testListMulti('li_6', 'li_8', 'outdent', li_6_to_li_8_indentedHtml, nestedListHtml);

    // Via text selection
    testListMulti('li_6', 'li_8', 'indent', nestedListHtml, li_6_to_li_8_indentedHtml, true);
    testListMulti('li_6', 'li_8', 'outdent', li_6_to_li_8_indentedHtml, nestedListHtml, true);
});

test("First-level creates and joins prev list indent/outdent", function () {
    QUnit.expect(4);

    testListMulti('li_7', 'li_8', 'indent', nestedListHtml, li_7_to_li_8_indentedHtml);
    testListMulti('li_7', 'li_8', 'outdent', li_7_to_li_8_indentedHtml, nestedListHtml);

    // Via text selection
    testListMulti('li_7', 'li_8', 'indent', nestedListHtml, li_7_to_li_8_indentedHtml, true);
    testListMulti('li_7', 'li_8', 'outdent', li_7_to_li_8_indentedHtml, nestedListHtml, true);
});

test("Second-level and down a level", function () {
    QUnit.expect(2);

    // Via text selection
    testListMulti('li_2_2', 'li_3', 'indent', nestedListHtml, li_2_2_to_li_3_indentedHtml, true);
    testListMulti('li_2_2', 'li_3', 'outdent', li_2_2_to_li_3_indentedHtml, nestedListHtml, true);
});

test("Second-level with mixed lists and down a level", function () {
    QUnit.expect(2);

    // Via text selection
    testListMulti('li_5_3', 'li_5_4', 'indent', nestedListHtml, li_5_3_to_li_5_4_indentedHtml, true);
    testListMulti('li_5_3', 'li_5_4', 'outdent', li_5_3_to_li_5_4_indentedHtml, nestedListHtml, true);
});

test("Selecting multiple lists with content between prevents indent/outdent", function () {
    QUnit.expect(2);

    testListMulti('li_2', 'li_5', 'indent', listsWithContentBetweenHtml,
                  listsWithContentBetweenHtml, true);
    testListMulti('li_2', 'li_5', 'outdent', listsWithContentBetweenHtml,
                  listsWithContentBetweenHtml, true);
});

module("list-broken_html", {setup: prepareUnitTestModule});

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
    QUnit.expect(6);

    testListRoundTrip('li_1_1_1_4', 'outdent', doubleIndentHtml, diFirstOutdentHtml);
    testListRoundTrip(
        'li_1_1_1_4',
        'outdent',
        diFirstOutdentHtml,
        diSecondOutdentHtml
    );
    testListRoundTrip(
        'li_1_1_1_4',
        'outdent',
        diSecondOutdentHtml,
        diThirdOutdentHtml
    );
});

module("list-conversion_type", {setup: prepareUnitTestModule});

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

test("Ordered to unordered second item", function () {
    QUnit.expect(8);

    // Round trip tests (for selection restoration)
    testListRoundTrip('li_2', 'unordered', orderedHtml, li_2_unorderedHtml);
    testListRoundTrip('li_2', 'ordered', li_2_unorderedHtml, orderedHtml);
    // With text selection
    testListRoundTrip('li_2', 'unordered', orderedHtml, li_2_unorderedHtml, true);
    testListRoundTrip('li_2', 'ordered', li_2_unorderedHtml, orderedHtml, true);
});

test("Ordered to unordered nested", function () {
    QUnit.expect(8);

    testListRoundTrip('li_1_1_1', 'unordered', orderedHtml, li_1_1_1_unorderedHtml);
    testListRoundTrip('li_1_1_1', 'ordered', li_1_1_1_unorderedHtml, orderedHtml);

    // With text selection
    testListRoundTrip('li_1_1_1', 'unordered', orderedHtml, li_1_1_1_unorderedHtml, true);
    testListRoundTrip('li_1_1_1', 'ordered', li_1_1_1_unorderedHtml, orderedHtml, true);
});
test("Ordered to unordered one item", function () {
    QUnit.expect(8);

    testListRoundTrip('li_1_1_1_1', 'unordered', orderedHtml, li_1_1_1_1_unorderedHtml);
    testListRoundTrip('li_1_1_1_1', 'ordered', li_1_1_1_1_unorderedHtml, orderedHtml);

    // With text selection
    testListRoundTrip('li_1_1_1_1', 'unordered', orderedHtml, li_1_1_1_1_unorderedHtml, true);
    testListRoundTrip('li_1_1_1_1', 'ordered', li_1_1_1_1_unorderedHtml, orderedHtml, true);
});

test("Prevent converting type with selection over multiple levels", function () {
    QUnit.expect(4);

    testListMulti('li_1_1_1', 'li_1_1_1_1', 'unordered',
                  li_1_1_1_1_unorderedHtml, li_1_1_1_1_unorderedHtml);
    testListMulti('li_1_1_1', 'li_1_1_1_1', 'ordered',
                  li_1_1_1_unorderedHtml, li_1_1_1_unorderedHtml);

    // With text selection
    testListMulti('li_1_1_1', 'li_1_1_1_1', 'unordered',
                  li_1_1_1_1_unorderedHtml, li_1_1_1_1_unorderedHtml, true);
    testListMulti('li_1_1_1', 'li_1_1_1_1', 'ordered',
                  li_1_1_1_unorderedHtml, li_1_1_1_unorderedHtml, true);
});

module("list-conversion_blocks", {setup: prepareUnitTestModule});
var pHtml = String() +
        '<p id="p_1">content 1</p>' +
        '<p id="p_2"><strong id="strong_2">content</strong> 2</p>' +
        '<h1 id="h1_3">content 3</h1>';
var p_1_orderedHtml = String() +
        '<ol>' +
            '<li>content 1</li>' +
        '</ol>' +
        '<p id="p_2"><strong id="strong_2">content</strong> 2</p>' +
        '<h1 id="h1_3">content 3</h1>';
var p_1_unorderedHtml = String() +
        '<ul>' +
            '<li>content 1</li>' +
        '</ul>' +
        '<p id="p_2"><strong id="strong_2">content</strong> 2</p>' +
        '<h1 id="h1_3">content 3</h1>';
var p_2_orderedHtml = String() +
        '<p id="p_1">content 1</p>' +
        '<ol>' +
            '<li><strong id="strong_2">content</strong> 2</li>' +
        '</ol>' +
        '<h1 id="h1_3">content 3</h1>';
var p_2_unorderedHtml = String() +
        '<p id="p_1">content 1</p>' +
        '<ul>' +
            '<li><strong id="strong_2">content</strong> 2</li>' +
        '</ul>' +
        '<h1 id="h1_3">content 3</h1>';
var h1_3_orderedHtml = String() +
        '<p id="p_1">content 1</p>' +
        '<p id="p_2"><strong id="strong_2">content</strong> 2</p>' +
        '<ol>' +
            '<li>content 3</li>' +
        '</ol>';
var h1_3_unorderedHtml = String() +
        '<p id="p_1">content 1</p>' +
        '<p id="p_2"><strong id="strong_2">content</strong> 2</p>' +
        '<ul>' +
            '<li>content 3</li>' +
        '</ul>';
// Multiples
var p_1_ordered_p_2_ordered_pHtml = String() +
        '<ol>' +
            '<li>content 1</li>' +
        '</ol>' +
        '<ol>' +
            '<li><strong id="strong_2">content</strong> 2</li>' +
        '</ol>' +
        '<h1 id="h1_3">content 3</h1>';
var p_1_ordered_p_2_unordered_pHtml = String() +
        '<ol>' +
            '<li>content 1</li>' +
        '</ol>' +
        '<ul>' +
            '<li><strong id="strong_2">content</strong> 2</li>' +
        '</ul>' +
        '<h1 id="h1_3">content 3</h1>';
var p_1_unordered_p_2_ordered_pHtml = String() +
        '<ul>' +
            '<li>content 1</li>' +
        '</ul>' +
        '<ol>' +
            '<li><strong id="strong_2">content</strong> 2</li>' +
        '</ol>' +
        '<h1 id="h1_3">content 3</h1>';

test("Paragraph", function () {
    QUnit.expect(4);

    testList('p_1', 'ordered', pHtml, p_1_orderedHtml);
    testList('p_1', 'unordered', pHtml, p_1_unorderedHtml);

    // Using text selection
    testList('p_1', 'unordered', pHtml, p_1_unorderedHtml, true);
    testList('p_1', 'ordered', pHtml, p_1_orderedHtml, true);
});
test("Paragraph with inline tags", function () {
    QUnit.expect(4);

    testList('strong_2', 'ordered', pHtml, p_2_orderedHtml);
    testList('strong_2', 'unordered', pHtml, p_2_unorderedHtml);

    // Using text selection
    testList('p_2', 'ordered', pHtml, p_2_orderedHtml, true);
    testList('p_2', 'unordered', pHtml, p_2_unorderedHtml, true);
});
test("h1", function () {
    QUnit.expect(4);

    testList('h1_3', 'ordered', pHtml, h1_3_orderedHtml);
    testList('h1_3', 'unordered', pHtml, h1_3_unorderedHtml);

    // Using text selection
    testList('h1_3', 'ordered', pHtml, h1_3_orderedHtml, true);
    testList('h1_3', 'unordered', pHtml, h1_3_unorderedHtml, true);
});
test("Paragraph shouldn't join", function () {
    QUnit.expect(4);

    testList('strong_2', 'ordered', p_1_orderedHtml, p_1_ordered_p_2_ordered_pHtml);
    testList('p_1', 'ordered', p_2_orderedHtml, p_1_ordered_p_2_ordered_pHtml);

    // Using text selection
    testList('p_2', 'ordered', p_1_orderedHtml, p_1_ordered_p_2_ordered_pHtml, true);
    testList('p_1', 'ordered', p_2_orderedHtml, p_1_ordered_p_2_ordered_pHtml, true);
});
test("Not joining different types", function () {
    QUnit.expect(4);

    testList('strong_2', 'unordered', p_1_orderedHtml, p_1_ordered_p_2_unordered_pHtml);
    testList('p_1', 'unordered', p_2_orderedHtml, p_1_unordered_p_2_ordered_pHtml);

    // Using text selection
    testList('p_2', 'unordered', p_1_orderedHtml, p_1_ordered_p_2_unordered_pHtml, true);
    testList('p_1', 'unordered', p_2_orderedHtml, p_1_unordered_p_2_ordered_pHtml, true);
});

module("list-in_table", {setup: prepareUnitTestModule});

var listWithTableHtml = [""
    , '<ul id="0">'
        , '<li id="0_0">'
            , '0_0_0'
            , '<table id="0_0_1">'
                , '<tbody id="0_0_1_0">'
                    , '<tr id="0_0_1_0_0">'
                        , '<td id="0_0_1_0_0_0">'
                            , '0_0_1_0_0_0_0'
                        , '</td>'
                        , '<td id="0_0_1_0_0_1">'
                            , '<ul id="0_0_1_0_0_1_0">'
                                , '<li id="0_0_1_0_0_1_0_0">'
                                    , '0_0_1_0_0_1_0_0_0'
                                , '</li>'
                            , '</ul>'
                        , '</td>'
                    , '</tr>'
                , '</tbody>'
            , '</table>'
            , '<br class="wym-blocking-element-spacer wym-editor-only" />'
        , '</li>'
    , '</ul>'
].join('');
var listWithTableHtml_make_list_inside = [""
    , '<ul id="0">'
        , '<li id="0_0">'
            , '0_0_0'
            , '<table id="0_0_1">'
                , '<tbody id="0_0_1_0">'
                    , '<tr id="0_0_1_0_0">'
                        , '<td id="0_0_1_0_0_0">'
                            , '<ul>'
                                , '<li>'
                                    , '0_0_1_0_0_0_0'
                                , '</li>'
                            , '</ul>'
                        , '</td>'
                        , '<td id="0_0_1_0_0_1">'
                            , '<ul id="0_0_1_0_0_1_0">'
                                , '<li id="0_0_1_0_0_1_0_0">'
                                    , '0_0_1_0_0_1_0_0_0'
                                , '</li>'
                            , '</ul>'
                        , '</td>'
                    , '</tr>'
                , '</tbody>'
            , '</table>'
            , '<br class="wym-blocking-element-spacer wym-editor-only" />'
        , '</li>'
    , '</ul>'
].join('');
test("Make list inside table that is inside list.", function () {
    QUnit.expect(2);
    testList(
        '0_0_1_0_0_0',
        'unordered',
        listWithTableHtml,
        listWithTableHtml_make_list_inside
    );

    // Using text selection
    testList(
        '0_0_1_0_0_0',
        'unordered',
        listWithTableHtml,
        listWithTableHtml_make_list_inside,
        true
    );
});

module("list-correction", {setup: prepareUnitTestModule});

test("Should correct invalid list nesting", function () {
    QUnit.expect(2);

    var wymeditor = jQuery.wymeditors(0),
        expected = "<ul><li>a<ul><li>a.1<\/li><\/ul><\/li><li>b<br /><\/li><\/ul>",
    // FF
        invalid_ff_html = "<ul><li>a<\/li><ul><li>a.1<\/li><\/ul><li>b<br /><\/li><\/ul>",
        invalid_ie_html = "<UL><LI>a<\/LI><UL><LI>a.1<\/LI><\/UL><LI>b<\/LI><\/UL>";
    wymeditor.rawHtml(invalid_ff_html);
    wymEqual(wymeditor, expected, {parseHtml: true});
    // IE
    // IE has invalid sublist nesting
    expected = "<ul><li>a<ul><li>a.1<\/li><\/ul><\/li><li>b<\/li><\/ul>";
    wymeditor.rawHtml(invalid_ie_html);
    wymEqual(wymeditor, expected, {parseHtml: true});
});

var listWithOrphanedTextAfterLastLi = [""
    , '<ul>'
        , '<li>a</li>'
        , 'b'
    , '</ul>'
    ].join(""),
    fixedListWithOrphanedTextAfterLastLi = [""
    , '<ul>'
        , '<li>a<br />b</li>'
    , '</ul>'
    ].join("");

test("Orphaned text at end of list should be inserted into the last li\
        by _fixInvalidListNesting", function () {
    QUnit.expect(1);

    var wymeditor = jQuery.wymeditors(0),
        $body,
        invalidHtml = listWithOrphanedTextAfterLastLi,
        expected = fixedListWithOrphanedTextAfterLastLi,
        caretLocation;

    jQuery(wymeditor._doc.body).html(invalidHtml);
    $body = wymeditor.$body();
    caretLocation = $body.find('ul')[0];
    makeTextSelection(wymeditor, caretLocation, caretLocation, 1, 1);
    wymeditor._fixInvalidListNesting($body.find('li')[0]);
    wymEqual(wymeditor, expected);
});

// IE8 bug https://github.com/wymeditor/wymeditor/issues/446
if (jQuery.browser.msie && jQuery.browser.version === "8.0") {
    test("Should correct IE8 pulling content into end of ul on backspace",
        function () {
        QUnit.expect(1);

        var wymeditor = jQuery.wymeditors(0),
            $body,
            invalidHtml = listWithOrphanedTextAfterLastLi,
            expected = fixedListWithOrphanedTextAfterLastLi,
            caretLocation;

        jQuery(wymeditor._doc.body).html(invalidHtml);
        $body = wymeditor.$body();
        caretLocation = $body.find('ul')[0];
        makeTextSelection(wymeditor, caretLocation, caretLocation, 1, 1);
        simulateKey(WYMeditor.KEY_CODE.BACKSPACE, wymeditor._doc);
        wymEqual(wymeditor, expected);
    });
}

test("Double indent correction", function () {
    QUnit.expect(1);

    var wymeditor = jQuery.wymeditors(0),
        brokenHtml = String() +
            '<ol>' +
                '<li id="li_1">1' +
                    '<ol>' +
                        '<ol>' +
                            '<li id="li_1_1_1">1_1_1</li>' +
                        '</ol>' +
                    '</ol>' +
                '</li>' +
            '</ol>',
        repairedHtml = String() +
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

    wymeditor.rawHtml(brokenHtml);
    wymEqual(wymeditor, repairedHtml, {parseHtml: true});
});

module("list-tabbing", {setup: prepareUnitTestModule});

test("Tab key indents", function () {
    manipulationTestHelper({
        startHtml: nestedListHtml,
        setCaretInSelector: "#li_7",
        manipulationKeyCombo: "tab",
        expectedResultHtml: li_7_indentedHtml,
        testUndoRedo: true
    });
});

test("Shift+Tab outdents", function () {
    manipulationTestHelper({
        startHtml: [""
            , "<ol>"
                , "<li>"
                    , "<ol>"
                        , "<li id=\"li_1_1\">1_1</li>"
                    , "</ol>"
                , "</li>"
                , "<li id=\"li_2\">2</li>"
            , "</ol>"
        ].join(""),
        setCaretInSelector: "#li_1_1",
        manipulationKeyCombo: "shift+tab",
        expectedResultHtml: [""
            , "<ol>"
                , "<li id=\"li_1_1\">1_1</li>"
                , "<li id=\"li_2\">2</li>"
            , "</ol>"
        ].join(""),
        testUndoRedo: true
    });
});

test("Tab has no effect outside lists", function () {
    var noChangeHtml = "<p id=\"p_1\">test</p>";
    manipulationTestHelper({
        startHtml: noChangeHtml,
        setCaretInSelector: "#p_1",
        manipulationKeyCombo: "tab",
        expectedResultHtml: noChangeHtml,
        testUndoRedo: true
    });
});

module("list-newline_normalization", {setup: prepareUnitTestModule});

test("Shouldn't eat newline text spacing in li", function () {
    QUnit.expect(1);

    var initHtml = String() +
            '<ul>' +
                '<li>' +
                    'Lorem ipsum dolor' + "\n" +
                    'sit amet, consectetur' + "\n\n" +
                    'adipiscing elit. Integer' + "\n\n\n" +
                    'sagittis porta dapibus.' +
                '</li>' +
            '</ul>',

        expectedHtml = String() +
            '<ul>' +
                '<li>' +
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
                    ' Integer sagittis porta dapibus.' +
                '</li>' +
            '</ul>',
        wymeditor = jQuery.wymeditors(0);

    wymeditor.rawHtml(initHtml);
    wymeditor.update();
    wymEqual(wymeditor, expectedHtml, {parseHtml: true});
});

/**
    changeIndent
    ============

    Puts the html in the body of the wymeditor and applies either the indent or
    outdent command to the selection ranging from the element with id selStart
    to the element with id selEnd. selStart and selEnd should be strings in the
    form '#<element_id>' where <element_id> is the id attribute of the element
    to be selected. inOrOur should be the string 'indent' if the indent command
    should be applied to the selection, or it should be the string 'outdent' if
    the outdent command should be applied to the selection.
*/
function changeIndent(wymeditor, html, selStart, selEnd, inOrOut) {
    var $body;

    wymeditor.rawHtml(html);
    $body = wymeditor.$body();
    makeTextSelection(wymeditor, $body.find(selStart)[0],
                      $body.find(selEnd)[0], 0, 1);
    if (inOrOut === "indent") {
        wymeditor.indent();
    } else if (inOrOut === "outdent") {
        wymeditor.outdent();
    }
}

// These test fail in IE8:
// https://github.com/wymeditor/wymeditor/issues/498
if (!(// Browser is IE and
      jQuery.browser.msie &&
      jQuery.browser.versionNumber === 8
     // or
     ) ||
    // we are executing known failing tests:
    !SKIP_KNOWN_FAILING_TESTS) {
    module("list-indent_outdent_with_table", {setup: prepareUnitTestModule});

    var TEST_LINEBREAK_SPACER = '<br class="' +
                                    WYMeditor.BLOCKING_ELEMENT_SPACER_CLASS + ' ' +
                                    WYMeditor.EDITOR_ONLY_CLASS + '" />';

    var expectedMiddleIn = String() +
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
                    '</li>' +
                    '<li id="li_3">3</li>' +
                '</ol>' +
            '</li>' +
        '</ol>';

    var expectedMiddleOutPartial = String() +
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
                '<ol>' +
                    '<li id="li_3">3</li>' +
                '</ol>' +
            '</li>' +
        '</ol>';

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

    test("Indent with table in the middle of a list", function () {
        QUnit.expect(1);
        var wymeditor = jQuery.wymeditors(0);

        changeIndent(wymeditor, expectedMiddleOutFull, '#li_2', '#li_3', 'indent');
        wymEqual(
            wymeditor,
            expectedMiddleIn,
            {assertionString: "Table indented in the middle of a list"}
        );
    });

    test("Indent with table at the end of a list", function () {
        QUnit.expect(1);
        var wymeditor = jQuery.wymeditors(0);

        changeIndent(wymeditor, expectedEndOut, '#li_3', '#li_3', 'indent');
        wymEqual(
            wymeditor,
            expectedEndIn,
            {assertionString: "Table indented at the end of a list"}
        );
    });

    test("Outdent with table in the middle of a list", function () {
        QUnit.expect(1);
        var wymeditor = jQuery.wymeditors(0);

        changeIndent(wymeditor, expectedMiddleIn, '#li_2', '#li_2', 'outdent');
        wymEqual(
            wymeditor,
            expectedMiddleOutPartial,
            {assertionString: "Table outdented in the middle of a list"}
        );
    });

    test("Outdent with table at the end of a list", function () {
        QUnit.expect(2);
        var wymeditor = jQuery.wymeditors(0);

        changeIndent(wymeditor, expectedEndIn, '#li_3', '#li_3', 'outdent');
        wymEqual(
            wymeditor,
            expectedEndOut,
            {assertionString: "Table outdented at the end of a list"}
        );

        changeIndent(wymeditor, expectedEndOut, '#li_3', '#li_3', 'outdent');
        wymEqual(
            wymeditor,
            expectedEndOut,
            {assertionString: "Table outdented at the end of a list with no" +
                " line break"}
        );
    });
}

// Issue #430
module("list-correction_after_enter_in_empty_li", {setup: prepareUnitTestModule});

// Issue #430 case 1 of 3: a `p` or a `div` is created inside the parent `li`:

// Following objects are pairs of:
//
//  * String of corrected HTML.
//  * Array of known broken HTML strings.
var enterInEmptyLiOnlyLi = {
    fixed: [""
        , '<ul>'
            , '<li>0'
                , '<br />'
                , '<br />'
            , '</li>'
        , '</ul>'
    ].join(''),
    broken: [
        [""
            , '<ul>'
                , '<li>0'
                    , '<p>'
                        , '<br />'
                    , '</p>'
                , '</li>'
            , '</ul>'
        ].join('')
    ]
};
var enterInEmptyLiOnlyLiTextAfterList = {
    fixed: [""
        , '<ul>'
            , '<li>0'
                , '<br />'
                , '<br />'
                , 'foo'
            , '</li>'
        , '</ul>'
    ].join(''),
    broken: [
        [""
            , '<ul>'
                , '<li>0'
                    , '<p>'
                        , '<br />'
                    , '</p>'
                    , 'foo'
                , '</li>'
            , '</ul>'
        ].join(''),
        [""
            , '<ul>'
                , '<li>0'
                    , '<div>'
                        , '<br />'
                    , '</div>'
                    , 'foo'
                , '</li>'
            , '</ul>'
        ].join(''),
        [""
            , '<ul>'
                , '<li>0'
                    , '<p>'
                        , WYMeditor.NBSP
                    , '</p>'
                    , 'foo'
                , '</li>'
            , '</ul>'
        ].join('')
    ]
};
var enterInEmptyLiLastLi = {
    fixed: [""
        , '<ul>'
            , '<li>0'
                , '<ul>'
                    , '<li>0.0</li>'
                , '</ul>'
                , '<br />'
            , '</li>'
        , '</ul>'
    ].join(''),
    broken: [
        [""
            , '<ul>'
                , '<li>0'
                    , '<ul>'
                        , '<li>0.0</li>'
                    , '</ul>'
                    , '<p>'
                        , '<br />'
                    , '</p>'
                , '</li>'
            , '</ul>'
        ].join('')
    ]
};

var enterInEmptyLiLastLiTextAfterList = {
    fixed: [""
        , '<ul>'
            , '<li>0'
                , '<ul>'
                    , '<li>0.0</li>'
                , '</ul>'
                , '<br />'
                , 'foo'
            , '</li>'
        , '</ul>'
    ].join(''),
    broken: [
        [""
            , '<ul>'
                , '<li>0'
                    , '<ul>'
                        , '<li>0.0</li>'
                    , '</ul>'
                    , '<p>'
                        , '<br />'
                    , '</p>'
                    , 'foo'
                , '</li>'
            , '</ul>'
        ].join(''),
        [""
        , '<ul>'
            , '<li>0'
                , '<ul>'
                    , '<li>0.0</li>'
                , '</ul>'
                , '<div>'
                    , '<br />'
                , '</div>'
                , 'foo'
            , '</li>'
        , '</ul>'
        ].join(''),
        [""
            , '<ul>'
                , '<li>0'
                    , '<ul>'
                        , '<li>0.0</li>'
                    , '</ul>'
                    , '<p>' + WYMeditor.NBSP + '</p>'
                    , 'foo'
                , '</li>'
            , '</ul>'
        ].join('')
    ]
};
var enterInEmptyLiNotLast = {
    fixed: [""
        , '<ul>'
            , '<li>0'
                , '<ul>'
                    , '<li>0.0</li>'
                , '</ul>'
                , '<br />'
                , '<ul>'
                    , '<li>0.2</li>'
                , '</ul>'
            , '</li>'
        , '</ul>'
    ].join(''),
    broken: [
        [""
            , '<ul>'
                , '<li>0'
                    , '<ul>'
                        , '<li>0.0</li>'
                    , '</ul>'
                    , '<p>'
                        , '<br />'
                    , '</p>'
                    , '<ul>'
                        , '<li>0.2</li>'
                    , '</ul>'
                , '</li>'
            , '</ul>'
        ].join(''),
        [""
            , '<ul>'
                , '<li>0'
                    , '<ul>'
                        , '<li>0.0</li>'
                    , '</ul>'
                    , '<p></p>'
                    , '<ul>'
                        , '<li>0.2</li>'
                    , '</ul>'
                , '</li>'
            , '</ul>'
        ].join('')
    ]
};

// The following is a helper function for performing tests on the above pairs.
//
// `testNameSuff` is the suffix of the name of the test that will be run.
// `expectedHtml` is the former from each of the pairs above.
// `brokenHtmls` is the latter from each of the pairs above.
function enterInEmptyLiTest(testNameSuff, expectedHtml, brokenHtmls) {
    var wymeditor,
        $body,
        i,
        assertStr,
        testName = '`p` or `div`: ' + testNameSuff,
        assertStrCallAppend = '; by calling repairing function',
        assertStrKeyAppend = '; by key simulation';

    test(testName, function () {
        QUnit.expect(brokenHtmls.length * 4);
        wymeditor = jQuery.wymeditors(0);
        $body = wymeditor.$body();

        for (i = 0; i < brokenHtmls.length; i++) {
            assertStr = 'Broken HTML variation ' + (i + 1) + ' of ' +
                brokenHtmls.length;

            wymeditor.rawHtml(brokenHtmls[i]);
            wymeditor._replaceNodeWithBrAndSetCaret(
                $body.find('p, div')[0]
            );
            wymEqual(
                wymeditor,
                expectedHtml,
                {assertionString: assertStr + assertStrCallAppend}
            );

            wymeditor.rawHtml(brokenHtmls[i]);
            wymeditor.setCaretIn($body.find('p, div')[0]);
            simulateKey(WYMeditor.KEY_CODE.ENTER, wymeditor._doc);

            wymEqual(
                wymeditor,
                expectedHtml,
                {assertionString: assertStr + assertStrKeyAppend}
            );
            ok(
                wymeditor.selection().isCollapsed,
                assertStr + assertStrKeyAppend + '; selection is collapsed'
            );
            strictEqual(
                wymeditor.nodeAfterSel().tagName.toLowerCase(),
                'br',
                assertStr + assertStrKeyAppend + '; caret position'
            );
        }
    });
}

// At this stage the helper function of this module is called for the tests to
// be performed with each of the variations, represented by the pairs.
enterInEmptyLiTest(
    'Only `li` in its list',
    enterInEmptyLiOnlyLi.fixed,
    enterInEmptyLiOnlyLi.broken
);
enterInEmptyLiTest(
    'Only `li` and text node after list',
    enterInEmptyLiOnlyLiTextAfterList.fixed,
    enterInEmptyLiOnlyLiTextAfterList.broken
);
enterInEmptyLiTest(
    'Last `li`',
    enterInEmptyLiLastLi.fixed,
    enterInEmptyLiLastLi.broken
);
enterInEmptyLiTest(
    'Last `li` and text node after list',
    enterInEmptyLiLastLiTextAfterList.fixed,
    enterInEmptyLiLastLiTextAfterList.broken
);
enterInEmptyLiTest(
    'Not last `li`',
    enterInEmptyLiNotLast.fixed,
    enterInEmptyLiNotLast.broken
);

// All of the following broken HTML strings represent real-world browser
// results. There is no point imagining more cases without confirming that they
// actually occurring in the browser. Especially because this kind of invalid
// list nesting occurs under quite specific conditions, it seems.
var invalidNestingAfterEnterInEmptyLi = [
    {
        broken: [""
            , '<ul>'
                , '<li>0'
                , '</li>'
                , '<ul>'
                    , '<li>0.0</li>'
                    , '<li>0.1</li>'
                , '</ul>'
                , '<li id="new">'
                    , '<br />'
                , '</li>'
            , '</ul>'
        ].join(''),
        fixed: [""
            , '<ul>'
                , '<li>0'
                    , '<ul>'
                        , '<li>0.0</li>'
                        , '<li>0.1</li>'
                    , '</ul>'
                    , '<br />'
                , '</li>'
            , '</ul>'
        ].join('')
    },
    {
        broken: [""
            , '<ul>'
                , '<li>0'
                , '</li>'
                , '<ul>'
                    , '<li>0.0</li>'
                , '</ul>'
                , '<li id="new">'
                    , '<br />'
                , '</li>'
            , '</ul>'
        ].join(''),
        fixed: [""
            , '<ul>'
                , '<li>0'
                    , '<ul>'
                        , '<li>0.0</li>'
                    , '</ul>'
                    , '<br />'
                , '</li>'
            , '</ul>'
        ].join('')
    },
    {
        broken: [""
            , '<ul>'
                , '<li>0'
                , '</li>'
                , '<ul>'
                    , '<li>0.0</li>'
                , '</ul>'
                , '<li id="new">'
                    , '<br />'
                , '</li>'
                , '<li>1</li>'
            , '</ul>'
        ].join(''),
        fixed: [""
            , '<ul>'
                , '<li>0'
                    , '<ul>'
                        , '<li>0.0</li>'
                    , '</ul>'
                    , '<br />'
                , '</li>'
                , '<li>1</li>'
            , '</ul>'
        ].join('')
    },
    {
        broken: [""
            , '<ul>'
                , '<li>0<br /><br />'
                , '</li>'
                , '<ul>'
                    , '<li>0.0</li>'
                , '</ul>'
                , '<li id="new">'
                    , '<br />'
                , '</li>'
            , '</ul>'
        ].join(''),
        fixed: [""
            , '<ul>'
                , '<li>0<br /><br />'
                    , '<ul>'
                        , '<li>0.0</li>'
                    , '</ul>'
                    , '<br />'
                , '</li>'
            , '</ul>'
        ].join('')
    },
    {
        broken: [""
            , '<ul>'
                , '<li>0'
                , '</li>'
                , '<ul>'
                    , '<li>0.0</li>'
                , '</ul>'
                , '<li id="new">'
                    , '<br />'
                , '</li>'
                , '<ul>'
                    , '<li>0.2</li>'
                , '</ul>'
            , '</ul>'
        ].join(''),
        fixed: [""
            , '<ul>'
                , '<li>0'
                    , '<ul>'
                        , '<li>0.0</li>'
                    , '</ul>'
                    , '<br />'
                    , '<ul>'
                        , '<li>0.2</li>'
                    , '</ul>'
                , '</li>'
            , '</ul>'
        ].join('')
    },
    {
        broken: [""
            , '<ul>'
                , '<li>0'
                , '</li>'
                , '<ul>'
                    , '<li>0.0</li>'
                , '</ul>'
                , '<li id="new">'
                    , '<br />'
                , '</li>'
                , '<ul>'
                    , '<li>0.2</li>'
                , '</ul>'
                , '<li>1</li>'
            , '</ul>'
        ].join(''),
        fixed: [""
            , '<ul>'
                , '<li>0'
                    , '<ul>'
                        , '<li>0.0</li>'
                    , '</ul>'
                    , '<br />'
                    , '<ul>'
                        , '<li>0.2</li>'
                    , '</ul>'
                , '</li>'
                , '<li>1</li>'
            , '</ul>'
        ].join('')
    }
];

test("Invalid list nesting", function () {
    var i,
        assertCountStr,
        wymeditor = jQuery.wymeditors(0),
        newLi;

    QUnit.expect(invalidNestingAfterEnterInEmptyLi.length * 2);

    for (i = 0; i < invalidNestingAfterEnterInEmptyLi.length; i++) {
        assertCountStr = 'Variation ' + (i + 1) + ' of ' +
            (invalidNestingAfterEnterInEmptyLi.length) + '; ';

        wymeditor.rawHtml(invalidNestingAfterEnterInEmptyLi[i].broken);
        newLi = wymeditor.$body().find('#new')[0];
        wymeditor.setCaretIn(newLi);
        simulateKey(WYMeditor.KEY_CODE.ENTER, wymeditor._doc);

        wymEqual(
            wymeditor,
            invalidNestingAfterEnterInEmptyLi[i].fixed,
            {assertionString: assertCountStr + 'HTML'}
        );
        strictEqual(
            wymeditor.nodeAfterSel().tagName.toLowerCase(),
            'br',
            assertCountStr + 'caret'
        );
    }
});

module("list-correction_li_in_li_after_enter", {setup: prepareUnitTestModule});

var liInLiAfterEnterHtmls = {
    beforeTextThenNothing: {
        broken: [""
            , '<ul id="0">'
                , '<li id="0-0">'
                    , '0-0-0'
                    , '<ul id="0-0-1">'
                        , '<li id="0-0-1-0">'
                            , '0-0-1-0-0'
                        , '</li>'
                    , '</ul>'
                    , '<li id="new-0-0">'
                        , '<br />'
                    , '</li>'
                    , '0-0-2'
                , '</li>'
            , '</ul>'
        ].join(''),
        startHtml: [""
            , '<ul id="0">'
                , '<li id="0-0">'
                    , '0-0-0'
                    , '<ul id="0-0-1">'
                        , '<li id="0-0-1-0">'
                            , '0-0-1-0-0'
                        , '</li>'
                    , '</ul>'
                    , '0-0-2'
                , '</li>'
            , '</ul>'
        ].join(''),
        fixed: [""
            , '<ul id="0">'
                , '<li id="0-0">'
                    , '0-0-0'
                    , '<ul id="0-0-1">'
                        , '<li id="0-0-1-0">'
                            , '0-0-1-0-0'
                        , '</li>'
                    , '</ul>'
                , '</li>'
                , '<li>'
                    , '<br />'
                    , '0-0-2'
                , '</li>'
            , '</ul>'
        ].join('')
    },
    beforeTextThenList: {
        broken: [""
            , '<ul id="0">'
                , '<li id="0-0">'
                    , '0-0-0'
                    , '<ul id="0-0-1">'
                        , '<li id="0-0-1-0">'
                            , '0-0-1-0-0'
                        , '</li>'
                    , '</ul>'
                    , '<li id="new-0-0">'
                        , '<br />'
                    , '</li>'
                    , '0-0-2'
                    , '<ul id="0-0-3">'
                        , '<li id="0-0-3-0">'
                            , '0-0-3-0-0'
                        , '</li>'
                    , '</ul>'
                , '</li>'
            , '</ul>'
        ].join(''),
        startHtml: [""
            , '<ul id="0">'
                , '<li id="0-0">'
                    , '0-0-0'
                    , '<ul id="0-0-1">'
                        , '<li id="0-0-1-0">'
                            , '0-0-1-0-0'
                        , '</li>'
                    , '</ul>'
                    , '0-0-2'
                    , '<ul id="0-0-3">'
                        , '<li id="0-0-3-0">'
                            , '0-0-3-0-0'
                        , '</li>'
                    , '</ul>'
                , '</li>'
            , '</ul>'
        ].join(''),
        fixed: [""
            , '<ul id="0">'
                , '<li id="0-0">'
                    , '0-0-0'
                    , '<ul id="0-0-1">'
                        , '<li id="0-0-1-0">'
                            , '0-0-1-0-0'
                        , '</li>'
                    , '</ul>'
                , '</li>'
                , '<li>'
                    , '<br />'
                    , '0-0-2'
                    , '<ul id="0-0-3">'
                        , '<li id="0-0-3-0">'
                            , '0-0-3-0-0'
                        , '</li>'
                    , '</ul>'
                , '</li>'
            , '</ul>'
        ].join('')
    },
    beforeBrThenList: {
        broken: [""
            , '<ul id="0">'
                , '<li id="0-0">'
                    , '0-0-0'
                    , '<ul id="0-0-1">'
                        , '<li id="0-0-1-0">'
                            , '0-0-1-0-0'
                        , '</li>'
                    , '</ul>'
                    , '<li id="new-0-0">'
                        , '<br />'
                    , '</li>'
                    , '<br id="0-0-2" />'
                    , '<ul id="0-0-3">'
                        , '<li id="0-0-3-0">'
                            , '0-0-3-0-0'
                        , '</li>'
                    , '</ul>'
                , '</li>'
            , '</ul>'
        ].join(''),
        startHtml: [""
            , '<ul id="0">'
                , '<li id="0-0">'
                    , '0-0-0'
                    , '<ul id="0-0-1">'
                        , '<li id="0-0-1-0">'
                            , '0-0-1-0-0'
                        , '</li>'
                    , '</ul>'
                    , '<br id="0-0-2"/>'
                    , '<ul id="0-0-3">'
                        , '<li id="0-0-3-0">'
                            , '0-0-3-0-0'
                        , '</li>'
                    , '</ul>'
                , '</li>'
            , '</ul>'
        ].join(''),
        fixed: [""
            , '<ul id="0">'
                , '<li id="0-0">'
                    , '0-0-0'
                    , '<ul id="0-0-1">'
                        , '<li id="0-0-1-0">'
                            , '0-0-1-0-0'
                        , '</li>'
                    , '</ul>'
                , '</li>'
                , '<li>'
                    , '<br />'
                    , '<br id="0-0-2" />'
                    , '<ul id="0-0-3">'
                        , '<li id="0-0-3-0">'
                            , '0-0-3-0-0'
                        , '</li>'
                    , '</ul>'
                , '</li>'
            , '</ul>'
        ].join('')
    },
    makeDomLikeWeActuallyRequire: function ($body) {
        $body.find('#0-0-1').after('<li id="new-0-0"><br /></li>');
    }
};

function testLiInLiAfterEnter(htmls) {
    var wymeditor = jQuery.wymeditors(0),
        broken,
        startHtml,
        fixed,
        $body,
        originLi,
        errorLi,
        splitLi;

    if (jQuery.browser.webkit !== true) {
        QUnit.expect(1);
        ok(true, "TEST SKIPPED: This test is only relevant in Blink/WebKit.");
        return;
    }

    QUnit.expect(3);

    broken = htmls.broken;
    startHtml = htmls.startHtml;
    fixed = htmls.fixed;
    $body = wymeditor.$body();

    // `broken` is the HTML that we want to start with. When we tried inserting
    // that into the editor, the resulting DOM wasn't as expected.
    // Thus we get to our desired DOM in two steps. This is the first step.
    wymeditor.rawHtml(startHtml);
    // This is the second step. It gets us the DOM we want, that is identical
    // to `broken`.
    liInLiAfterEnterHtmls.makeDomLikeWeActuallyRequire($body);
    // Now, we check that we indeed got this DOM, so that we could go on with
    // the actual test.
    wymEqual(
        wymeditor,
        broken,
        {assertionString: "We achieved our desired broken DOM."}
    );

    originLi = $body.find('#0-0')[0];
    errorLi = $body.find('#new-0-0')[0];
    wymeditor.setCaretBefore(errorLi.nextSibling);
    simulateKey(WYMeditor.KEY_CODE.ENTER, wymeditor._doc);

    wymEqual(
        wymeditor,
        fixed,
        {assertionString: 'HTML'}
    );

    splitLi = $body.find('li:not([id])')[0];

    deepEqual(
        wymeditor.selectedContainer(),
        splitLi,
        'Selection'
    );
}

test("Caret before text, nothing follows", function () {
    testLiInLiAfterEnter(liInLiAfterEnterHtmls.beforeTextThenNothing);
});
test("Caret before text, list follows", function () {
    testLiInLiAfterEnter(liInLiAfterEnterHtmls.beforeTextThenList);
});
test("`br` before text, list follows", function () {
    testLiInLiAfterEnter(liInLiAfterEnterHtmls.beforeBrThenList);
});

module("list-delisting", {setup: prepareUnitTestModule});

var delistHtml = {};

delistHtml.base = [""
    , '<ol>'
        , '<li id="li_1">1</li>'
        , '<li id="li_2">2'
            , '<ol>'
                , '<li id="li_2_1">2_1</li>'
                , '<li id="li_2_2">2_2</li>'
            , '</ol>'
        , '</li>'
        , '<li id="li_3">3'
            , '<ol>'
                , '<li id="li_3_1">3_1</li>'
            , '</ol>'
        , '</li>'
        , '<li id="li_4">4</li>'
        , '<li id="li_5">5'
            , '<ol>'
                , '<li id="li_5_1">5_1</li>'
                , '<li id="li_5_2">5_2</li>'
                , '<li id="li_5_3">5_3'
                    , '<ul>'
                        , '<li id="li_5_3_1">5_3_1</li>'
                    , '</ul>'
                , '</li>'
                , '<li id="li_5_4">5_4</li>'
            , '</ol>'
        , '</li>'
        , '<li id="li_6">6</li>'
        , '<li id="li_7">7</li>'
        , '<li id="li_8">8</li>'
    , '</ol>'
].join('');

delistHtml.li_1__li_1 = [""
    , '<p id="li_1">1</p>'
    , '<ol>'
        , '<li id="li_2">2'
            , '<ol>'
                , '<li id="li_2_1">2_1</li>'
                , '<li id="li_2_2">2_2</li>'
            , '</ol>'
        , '</li>'
        , '<li id="li_3">3'
            , '<ol>'
                , '<li id="li_3_1">3_1</li>'
            , '</ol>'
        , '</li>'
        , '<li id="li_4">4</li>'
        , '<li id="li_5">5'
            , '<ol>'
                , '<li id="li_5_1">5_1</li>'
                , '<li id="li_5_2">5_2</li>'
                , '<li id="li_5_3">5_3'
                    , '<ul>'
                        , '<li id="li_5_3_1">5_3_1</li>'
                    , '</ul>'
                , '</li>'
                , '<li id="li_5_4">5_4</li>'
            , '</ol>'
        , '</li>'
        , '<li id="li_6">6</li>'
        , '<li id="li_7">7</li>'
        , '<li id="li_8">8</li>'
    , '</ol>'
].join('');
test("Move to before parent list. Transform into default root container.", function () {
    QUnit.expect(2);
    var startItemId = 'li_1',
        endItemId = 'li_1';

    testListMulti(
        startItemId,
        endItemId,
        'ordered',
        delistHtml.base,
        delistHtml.li_1__li_1
    );
    // Via text selection
    testListMulti(
        startItemId,
        endItemId,
        'ordered',
        delistHtml.base,
        delistHtml.li_1__li_1,
        true
    );
});

delistHtml.withBrs = [""
    , '<ul id="0">'
        , '<li id="0_0">'
            , '0_0_0'
            , '<ul id="0_0_1">'
                , '<li id="0_0_1_0">'
                    , '0_0_1_0_0'
                    , '<br id="0_0_1_0_1" />'
                    , '0_0_1_0_2'
                , '</li>'
            , '</ul>'
            , '0_0_2'
            , '<br id="0_0_3" />'
            , '0_0_4'
            , '<br id="0_0_5" />'
        , '</li>'
        , '<li id="0_1">'
            , '0_1_0'
            , '<br id="0_1_1" />'
        , '</li>'
    , '</ul>'
].join('');
delistHtml.withBrs_li_0_0__li_0_1 = [""
    , '<p id="0_0">'
        , '0_0_0'
    , '</p>'
    , '<p id="0_0_1_0">'
        , '0_0_1_0_0'
        , '<br id="0_0_1_0_1" />'
        , '0_0_1_0_2'
    , '</p>'
    , '<p>'
        , '0_0_2'
    , '</p>'
    , '<p>'
        , '0_0_4'
    , '</p>'
    , '<p id="0_1">'
        , '0_1_0'
        , '<br id="0_1_1" />'
    , '</p>'
].join('');
test("De-list two items, one nested in other.", function () {
    QUnit.expect(2);
    var startItemId = '0_0',
        endItemId = '0_1';

    testListMulti(
        startItemId,
        endItemId,
        'unordered',
        delistHtml.withBrs,
        delistHtml.withBrs_li_0_0__li_0_1
    );
    // Via text selection
    testListMulti(
        startItemId,
        endItemId,
        'unordered',
        delistHtml.withBrs,
        delistHtml.withBrs_li_0_0__li_0_1,
        true
    );
});

delistHtml.li_8__li_8 = [""
    , '<ol>'
        , '<li id="li_1">1</li>'
        , '<li id="li_2">2'
            , '<ol>'
                , '<li id="li_2_1">2_1</li>'
                , '<li id="li_2_2">2_2</li>'
            , '</ol>'
        , '</li>'
        , '<li id="li_3">3'
            , '<ol>'
                , '<li id="li_3_1">3_1</li>'
            , '</ol>'
        , '</li>'
        , '<li id="li_4">4</li>'
        , '<li id="li_5">5'
            , '<ol>'
                , '<li id="li_5_1">5_1</li>'
                , '<li id="li_5_2">5_2</li>'
                , '<li id="li_5_3">5_3'
                    , '<ul>'
                        , '<li id="li_5_3_1">5_3_1</li>'
                    , '</ul>'
                , '</li>'
                , '<li id="li_5_4">5_4</li>'
            , '</ol>'
        , '</li>'
        , '<li id="li_6">6</li>'
        , '<li id="li_7">7</li>'
    , '</ol>'
    , '<p id="li_8">8</p>'
].join('');

test("Move to after parent list.", function () {
    QUnit.expect(2);
    var startItemId = 'li_8',
        endItemId = 'li_8';

    testListMulti(
        startItemId,
        endItemId,
        'ordered',
        delistHtml.base,
        delistHtml.li_8__li_8
    );
    // Via text selection
    testListMulti(
        startItemId,
        endItemId,
        'ordered',
        delistHtml.base,
        delistHtml.li_8__li_8,
        true
    );
});

delistHtml.li_1__li_3 = [""
    , '<p id="li_1">1</p>'
    , '<p id="li_2">2</p>'
    , '<p id="li_2_1">2_1</p>'
    , '<p id="li_2_2">2_2</p>'
    , '<p id="li_3">3</p>'
    , '<ol>'
        , '<li id="li_3_1">3_1</li>'
    , '</ol>'
    , '<ol>'
        , '<li id="li_4">4</li>'
        , '<li id="li_5">5'
            , '<ol>'
                , '<li id="li_5_1">5_1</li>'
                , '<li id="li_5_2">5_2</li>'
                , '<li id="li_5_3">5_3'
                    , '<ul>'
                        , '<li id="li_5_3_1">5_3_1</li>'
                    , '</ul>'
                , '</li>'
                , '<li id="li_5_4">5_4</li>'
            , '</ol>'
        , '</li>'
        , '<li id="li_6">6</li>'
        , '<li id="li_7">7</li>'
        , '<li id="li_8">8</li>'
    , '</ol>'
].join('');
test("De-list across sublist", function () {
    QUnit.expect(2);
    var startItemId = 'li_1',
        endItemId = 'li_3';

    testListMulti(
        startItemId,
        endItemId,
        'ordered',
        delistHtml.base,
        delistHtml.li_1__li_3
    );
    testListMulti(
        startItemId,
        endItemId,
        'ordered',
        delistHtml.base,
        delistHtml.li_1__li_3,
        true
    );

});

var delistOverindentHtml = {};
delistOverindentHtml.base = [""
    , '<ol>'
        , '<li id="li_1">1</li>'
        , '<li id="li_2">2'
            , '<ol>'
                , '<li>'
                    , '<ol>'
                        , '<li id="li_2_1_1">2_1_1</li>'
                        , '<li id="li_2_1_2">2_1_2</li>'
                    , '</ol>'
                , '</li>'
                , '<li id="li_2_2">2_2</li>'
            , '</ol>'
        , '</li>'
        , '<li id="li_3">3</li>'
    , '</ol>'
].join('');
delistOverindentHtml.li_1__li_2 = [""
    , '<p id="li_1">1</p>'
    , '<p id="li_2">2</p>'
    , '<ol>'
        , '<li>'
            , '<ol>'
                , '<li id="li_2_1_1">2_1_1</li>'
                , '<li id="li_2_1_2">2_1_2</li>'
            , '</ol>'
        , '</li>'
        , '<li id="li_2_2">2_2</li>'
    , '</ol>'
    , '<ol>'
        , '<li id="li_3">3</li>'
    , '</ol>'
].join('');
test("Over-indented not invalid", function () {
    QUnit.expect(2);
    var startItemId = 'li_1',
        endItemId = 'li_2';

    testListMulti(
        startItemId,
        endItemId,
        'ordered',
        delistOverindentHtml.base,
        delistOverindentHtml.li_1__li_2
    );
    testListMulti(
        startItemId,
        endItemId,
        'ordered',
        delistOverindentHtml.base,
        delistOverindentHtml.li_1__li_2,
        true
    );
    // This one can't be reversed
});

delistOverindentHtml.li_1__li_3 = [""
    , '<p id="li_1">1</p>'
    , '<p id="li_2">2</p>'
    , '<ol>'
        , '<li>'
            , '<span id="li_2_1_1">2_1_1</span>'
            , '<br />'
            , '<span id="li_2_1_2">2_1_2</span>'
        , '</li>'
    , '</ol>'
    , '<p id="li_2_2">2_2</p>'
    , '<p id="li_3">3</p>'
].join('');

test("Across indentation levels", function () {
    QUnit.expect(2);
    var startItemId = 'li_1',
        endItemId = 'li_3';

    testListMulti(
        startItemId,
        endItemId,
        'ordered',
        delistOverindentHtml.base,
        delistOverindentHtml.li_1__li_3
    );
    testListMulti(
        startItemId,
        endItemId,
        'ordered',
        delistOverindentHtml.base,
        delistOverindentHtml.li_1__li_3,
        true
    );
});
delistHtml.twoListsHtml = [delistHtml.base
    , '<ol>'
        , '<li id="li2_1">1</li>'
    , '</ol>'
].join('');
delistHtml.li_5_4__li2_1 = [""
    , '<ol>'
        , '<li id="li_1">1</li>'
        , '<li id="li_2">2'
            , '<ol>'
                , '<li id="li_2_1">2_1</li>'
                , '<li id="li_2_2">2_2</li>'
            , '</ol>'
        , '</li>'
        , '<li id="li_3">3'
            , '<ol>'
                , '<li id="li_3_1">3_1</li>'
            , '</ol>'
        , '</li>'
        , '<li id="li_4">4</li>'
        , '<li id="li_5">5'
            , '<ol>'
                , '<li id="li_5_1">5_1</li>'
                , '<li id="li_5_2">5_2</li>'
                , '<li id="li_5_3">5_3'
                    , '<ul>'
                        , '<li id="li_5_3_1">5_3_1</li>'
                    , '</ul>'
                , '</li>'
            , '</ol>'
            , '<span id="li_5_4">5_4</span>'
        , '</li>'
    , '</ol>'
    , '<p id="li_6">6</p>'
    , '<p id="li_7">7</p>'
    , '<p id="li_8">8</p>'
    , '<p id="li2_1">1</p>'
].join('');
test("Across lists", function () {
    QUnit.expect(2);
    var startItemId = 'li_5_4',
        endItemId = 'li2_1';

    testListMulti(
        startItemId,
        endItemId,
        'ordered',
        delistHtml.twoListsHtml,
        delistHtml.li_5_4__li2_1
    );
    testListMulti(
        startItemId,
        endItemId,
        'ordered',
        delistHtml.twoListsHtml,
        delistHtml.li_5_4__li2_1,
        true
    );
});
delistHtml.li_2_1__li_5_1 = [""
    , '<ol>'
        , '<li id="li_1">1</li>'
        , '<li id="li_2">2'
            , '<br /><span id="li_2_1">2_1</span>'
            , '<br /><span id="li_2_2">2_2</span>'
        , '</li>'
    , '</ol>'
    , '<p id="li_3">3</p>'
    , '<p id="li_3_1">3_1</p>'
    , '<p id="li_4">4</p>'
    , '<p id="li_5">5</p>'
    , '<p id="li_5_1">5_1</p>'
    , '<ol>'
        , '<li id="li_5_2">5_2</li>'
        , '<li id="li_5_3">5_3'
            , '<ul>'
                , '<li id="li_5_3_1">5_3_1</li>'
            , '</ul>'
        , '</li>'
        , '<li id="li_5_4">5_4</li>'
    , '</ol>'
    , '<ol>'
        , '<li id="li_6">6</li>'
        , '<li id="li_7">7</li>'
        , '<li id="li_8">8</li>'
    , '</ol>'
].join('');
test("Across different sub-lists at same level", function () {
    QUnit.expect(2);
    var startItemId = 'li_2_1',
        endItemId = 'li_5_1';

    testListMulti(
        startItemId,
        endItemId,
        'ordered',
        delistHtml.base,
        delistHtml.li_2_1__li_5_1
    );
    // Via text selection
    testListMulti(
        startItemId,
        endItemId,
        'ordered',
        delistHtml.base,
        delistHtml.li_2_1__li_5_1,
        true
    );
});

delistHtml.li_2_1__li_2_2 = [""
    , '<ol>'
        , '<li id="li_1">1</li>'
        , '<li id="li_2">2<br />'
            , '<span id="li_2_1">2_1</span><br />'
            , '<span id="li_2_2">2_2</span>'
        , '</li>'
        , '<li id="li_3">3'
            , '<ol>'
                , '<li id="li_3_1">3_1</li>'
            , '</ol>'
        , '</li>'
        , '<li id="li_4">4</li>'
        , '<li id="li_5">5'
            , '<ol>'
                , '<li id="li_5_1">5_1</li>'
                , '<li id="li_5_2">5_2</li>'
                , '<li id="li_5_3">5_3'
                    , '<ul>'
                        , '<li id="li_5_3_1">5_3_1</li>'
                    , '</ul>'
                , '</li>'
                , '<li id="li_5_4">5_4</li>'
            , '</ol>'
        , '</li>'
        , '<li id="li_6">6</li>'
        , '<li id="li_7">7</li>'
        , '<li id="li_8">8</li>'
    , '</ol>'
].join('');
test("Transform into spans. De-list entire list.", function () {
    QUnit.expect(2);
    var startItemId = 'li_2_1',
        endItemId = 'li_2_2';

    testListMulti(
        startItemId,
        endItemId,
        'ordered',
        delistHtml.base,
        delistHtml.li_2_1__li_2_2
    );
    // Via text selection
    testListMulti(
        startItemId,
        endItemId,
        'ordered',
        delistHtml.base,
        delistHtml.li_2_1__li_2_2,
        true
    );
});

delistHtml.li_6__li_7 = [""
    , '<ol>'
        , '<li id="li_1">1</li>'
        , '<li id="li_2">2'
            , '<ol>'
                , '<li id="li_2_1">2_1</li>'
                , '<li id="li_2_2">2_2</li>'
            , '</ol>'
        , '</li>'
        , '<li id="li_3">3'
            , '<ol>'
                , '<li id="li_3_1">3_1</li>'
            , '</ol>'
        , '</li>'
        , '<li id="li_4">4</li>'
        , '<li id="li_5">5'
            , '<ol>'
                , '<li id="li_5_1">5_1</li>'
                , '<li id="li_5_2">5_2</li>'
                , '<li id="li_5_3">5_3'
                    , '<ul>'
                        , '<li id="li_5_3_1">5_3_1</li>'
                    , '</ul>'
                , '</li>'
                , '<li id="li_5_4">5_4</li>'
            , '</ol>'
        , '</li>'
    , '</ol>'
    , '<p id="li_6">6</p>'
    , '<p id="li_7">7</p>'
    , '<ol>'
        , '<li id="li_8">8</li>'
    , '</ol>'
].join('');
test("Split lists", function () {
    QUnit.expect(2);
    var startItemId = 'li_6',
        endItemId = 'li_7';

    testListMulti(
        startItemId,
        endItemId,
        'ordered',
        delistHtml.base,
        delistHtml.li_6__li_7
    );
    // Via text selection
    testListMulti(
        startItemId,
        endItemId,
        'ordered',
        delistHtml.base,
        delistHtml.li_6__li_7,
        true
    );
});
delistHtml.withNodesAfterSubList = [""
    , '<ol>'
        , '<li id="li_1">1</li>'
        , '<li id="li_2">2'
            , '<ol>'
                , '<li id="li_2_1">2_1</li>'
                , '<li>I have no attributes!</li>'
                , '<li id="li_2_3">2_3</li>'
            , '</ol>'
            , 'foo'
            , '<br />'
            , '<span id="select_me">I am after a nested list.</span><br />'
            , 'Me, too!'
        , '</li>'
    , '</ol>'
].join('');
delistHtml.withNodesAfterSubList_li_2 = [""
    , '<ol>'
        , '<li id="li_1">1</li>'
    , '</ol>'
    , '<p id="li_2">2</p>'
    , '<ol>'
        , '<li id="li_2_1">2_1</li>'
        , '<li>I have no attributes!</li>'
        , '<li id="li_2_3">2_3</li>'
    , '</ol>'
    , '<p>foo</p>'
    , '<p id="select_me">I am after a nested list.</p>'
    , '<p>Me, too!</p>'
].join('');
test("textNode & inline element after block element. Transform `li`'s' contents to root containers.",
    function () {
        QUnit.expect(2);
        var startItemId = 'li_2',
            endItemId = 'li_2';

        testListMulti(
            startItemId,
            endItemId,
            'ordered',
            delistHtml.withNodesAfterSubList,
            delistHtml.withNodesAfterSubList_li_2
        );
        // Via text selection
        testListMulti(
            startItemId,
            endItemId,
            'ordered',
            delistHtml.withNodesAfterSubList,
            delistHtml.withNodesAfterSubList_li_2,
            true
        );
    }
);
delistHtml.withNodesAfterSubList_li_2_1__2_3 = [""
    , '<ol>'
        , '<li id="li_1">1</li>'
        , '<li id="li_2">2'
            , '<br /><span id="li_2_1">2_1</span>'
            , '<br />I have no attributes!'
            , '<br /><span id="li_2_3">2_3</span><br />'
            , 'foo'
            , '<br />'
            , '<span id="select_me">I am after a nested list.</span><br />'
            , 'Me, too!'
        , '</li>'
    , '</ol>'
].join('');
test("Add `br` elements after transforming `li` to `span`. Unwrap span if no attributes.",
    function () {
        QUnit.expect(2);
        var startItemId = 'li_2_1',
            endItemId = 'li_2_3';

        testListMulti(
            startItemId,
            endItemId,
            'ordered',
            delistHtml.withNodesAfterSubList,
            delistHtml.withNodesAfterSubList_li_2_1__2_3
        );
        // Via text selection
        testListMulti(
            startItemId,
            endItemId,
            'ordered',
            delistHtml.withNodesAfterSubList,
            delistHtml.withNodesAfterSubList_li_2_1__2_3,
            true
        );
    }
);
delistHtml.withEmptyNestedLi = [""
    , '<ul id="0">'
        , '<li id="0_0">'
            , '<ul id="0_0_0">'
                , '<li id="0_0_0_0">'
                , '</li>'
                , '<li id="0_0_0_1">'
                    , '<br id="0_0_0_1_0" />'
                , '</li>'
                , '<li id="0_0_0_2">'
                    , '0_0_0_2_0'
                , '</li>'
            , '</ul>'
        , '</li>'
    , '</ul>'
].join('');
delistHtml.withEmptyNestedLi_deListed = [""
    , '<ul id="0">'
        , '<li id="0_0">'
            , '<span id="0_0_0_2">'
                , '0_0_0_2_0'
            , '</span>'
        , '</li>'
    , '</ul>'
].join('');
test("Don't make empty spans", function () {
    QUnit.expect(2);
    var startItemId = '0_0_0_0',
        endItemId = '0_0_0_2';

    testListMulti(
        startItemId,
        endItemId,
        'unordered',
        delistHtml.withEmptyNestedLi,
        delistHtml.withEmptyNestedLi_deListed
    );
    // Via text selection
    testListMulti(
        startItemId,
        endItemId,
        'unordered',
        delistHtml.withEmptyNestedLi,
        delistHtml.withEmptyNestedLi_deListed,
        true
    );
});
delistHtml.withTable = [""
    , '<ul id="0">'
        , '<li id="0_0">'
            , '0_0_0'
            , '<table id="0_0_1">'
                , '<tbody id="0_0_1_0">'
                    , '<tr id="0_0_1_0_0">'
                        , '<td id="0_0_1_0_0_0">'
                            , '0_0_1_0_0_0_0'
                        , '</td>'
                        , '<td id="0_0_1_0_0_1">'
                            , '<ul id="0_0_1_0_0_1_0">'
                                , '<li id="0_0_1_0_0_1_0_0">'
                                    , '0_0_1_0_0_1_0_0_0'
                                , '</li>'
                            , '</ul>'
                        , '</td>'
                    , '</tr>'
                , '</tbody>'
            , '</table>'
        , '</li>'
    , '</ul>'
].join('');
delistHtml.withTable_deListedInside = [""
    , '<ul id="0">'
        , '<li id="0_0">'
            , '0_0_0'
            , '<table id="0_0_1">'
                , '<tbody id="0_0_1_0">'
                    , '<tr id="0_0_1_0_0">'
                        , '<td id="0_0_1_0_0_0">'
                            , '0_0_1_0_0_0_0'
                        , '</td>'
                        , '<td id="0_0_1_0_0_1">'
                            , '<span id="0_0_1_0_0_1_0_0">'
                                , '0_0_1_0_0_1_0_0_0'
                            , '</span>'
                        , '</td>'
                    , '</tr>'
                , '</tbody>'
            , '</table>'
            , '<br class="wym-blocking-element-spacer wym-editor-only" />'
        , '</li>'
    , '</ul>'
].join('');
test("De-list inside table.", function () {
    QUnit.expect(2);
    var startItemId = '0_0_1_0_0_1_0_0',
        endItemId = '0_0_1_0_0_1_0_0';

    testListMulti(
        startItemId,
        endItemId,
        'unordered',
        delistHtml.withTable,
        delistHtml.withTable_deListedInside
    );
    // Via text selection
    testListMulti(
        startItemId,
        endItemId,
        'unordered',
        delistHtml.withTable,
        delistHtml.withTable_deListedInside,
        true
    );
});
delistHtml.withTable_parentDeListed = [""
    , '<p id="0_0">'
        , '0_0_0'
    , '</p>'
    , '<br class="wym-blocking-element-spacer wym-editor-only" />'
    , '<table id="0_0_1">'
        , '<tbody id="0_0_1_0">'
            , '<tr id="0_0_1_0_0">'
                , '<td id="0_0_1_0_0_0">'
                    , '0_0_1_0_0_0_0'
                , '</td>'
                , '<td id="0_0_1_0_0_1">'
                    , '<ul id="0_0_1_0_0_1_0">'
                        , '<li id="0_0_1_0_0_1_0_0">'
                            , '0_0_1_0_0_1_0_0_0'
                        , '</li>'
                    , '</ul>'
                , '</td>'
            , '</tr>'
        , '</tbody>'
    , '</table>'
    , '<br class="wym-blocking-element-spacer wym-editor-only" />'
].join('');
test("De-list parent of table.", function () {
    QUnit.expect(2);
    var startItemId = '0_0',
        endItemId = '0_0';

    testListMulti(
        startItemId,
        endItemId,
        'unordered',
        delistHtml.withTable,
        delistHtml.withTable_parentDeListed
    );
    // Via text selection
    testListMulti(
        startItemId,
        endItemId,
        'unordered',
        delistHtml.withTable,
        delistHtml.withTable_parentDeListed,
        true
    );
});

var consecutiveTablesDelist = {};
consecutiveTablesDelist.base = [""
    , '<ol>'
        , '<li id="li_0">'
            , '0'
            , '<table id="t_0">'
                , '<tbody id="tbody_0">'
                    , '<tr id="tr_0_0">'
                        , '<td id="td_0_0_0">'
                            , '0_0_0'
                        , '</td>'
                    , '</tr>'
                , '</tbody>'
            , '</table>'
        , '</li>'
    , '</ol>'
    , '<table id="t_1">'
        , '<tbody id="tbody_1">'
            , '<tr id="tr_1_0">'
                , '<td id="td_1_0_0">'
                    , '1_0_0'
                , '</td>'
            , '</tr>'
        , '</tbody>'
    , '</table>'
].join('');
consecutiveTablesDelist.li_0 = [""
    , '<p id="li_0">0</p>'
    , '<br class="wym-blocking-element-spacer wym-editor-only" />'
    , '<table id="t_0">'
        , '<tbody id="tbody_0">'
            , '<tr id="tr_0_0">'
                , '<td id="td_0_0_0">'
                    , '0_0_0'
                , '</td>'
            , '</tr>'
        , '</tbody>'
    , '</table>'
    , '<br class="wym-blocking-element-spacer wym-editor-only" />'
    , '<table id="t_1">'
        , '<tbody id="tbody_1">'
            , '<tr id="tr_1_0">'
                , '<td id="td_1_0_0">'
                    , '1_0_0'
                , '</td>'
            , '</tr>'
        , '</tbody>'
    , '</table>'
    , '<br class="wym-blocking-element-spacer wym-editor-only" />'
].join('');
test("De-listing keeps spacer brs for blocking_elements", function () {
    QUnit.expect(2);
    var startItemId = 'li_0',
        $body,
        children,
        wymeditor = jQuery.wymeditors(0);

    testList(
        startItemId,
        'ordered',
        consecutiveTablesDelist.base,
        consecutiveTablesDelist.li_0
    );
    // Now we need to verify that the spacer brs still exist in the DOM
    $body = wymeditor.$body();
    children = $body.children();

    QUnit.expect(9);
    deepEqual(children.length, 6);
    if (children.length === 6) {
        deepEqual(children[0].tagName.toLowerCase(), 'p');
        deepEqual(children[1].tagName.toLowerCase(), 'br');
        deepEqual(children[2].tagName.toLowerCase(), 'table');
        deepEqual(children[3].tagName.toLowerCase(), 'br');
        deepEqual(children[4].tagName.toLowerCase(), 'table');
        deepEqual(children[5].tagName.toLowerCase(), 'br');
    }
});
