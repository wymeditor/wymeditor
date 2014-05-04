/* jshint camelcase: false, maxlen: 85 */
/* global setupWym,
wymEqual, makeTextSelection,
ok, test, expect */
"use strict";

var insertPStartHtml = String() +
    '<p>Some text before the replaced container</p>' +
    '<div id="replaceMe">Replace me</div>' +
    '<p>Some text after the replaced container</p>';
var insertDivStartHtml = String() +
    '<p>Some text before the replaced container</p>' +
    '<p id="replaceMe">Replace me</p>' +
    '<p>Some text after the replaced container</p>';

var rootPCorrectHtml = String() +
    '<p>Some text before the replaced container</p>' +
    '<p id="replaceMe">Replace me</p>' +
    '<p>Some text after the replaced container</p>';
var rootDivCorrectHtml = String() +
    '<p>Some text before the replaced container</p>' +
    '<div id="replaceMe">Replace me</div>' +
    '<p>Some text after the replaced container</p>';

function setupDefaultRootContainerDivWym() {
    setupWym(function (wym) {
        wym.documentStructureManager.setDefaultRootContainer('div');
    });
}

module("structure-default_root_p", {setup: setupWym});

test("DIV element is correctly converted to P", function () {
    expect(2);
    var wymeditor = jQuery.wymeditors(0),
        $pContainerLink = jQuery(wymeditor._box).find(
            wymeditor._options.containerSelector + '[name="P"]'),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        divToReplace;

    ok($pContainerLink.length,
       "Paragraph container link exists in containers panel");

    wymeditor._html(insertPStartHtml);
    divToReplace = $body.find('#replaceMe')[0];
    makeTextSelection(wymeditor, divToReplace, divToReplace);
    if ($pContainerLink.length) {
        $pContainerLink.click();
    }

    wymEqual(wymeditor, rootPCorrectHtml, {
            assertionString: "DIV element is correctly converted to P"
        });
});

module("structure-default_root_div", {setup: setupDefaultRootContainerDivWym});

test("P element is correctly converted to DIV", function () {
    expect(2);
    var wymeditor = jQuery.wymeditors(0),
        $divContainerLink = jQuery(wymeditor._box).find(
            wymeditor._options.containerSelector + '[name="DIV"]'),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        pToReplace;

    ok($divContainerLink.length,
       "Div container link exists in containers panel");

    wymeditor._html(insertDivStartHtml);
    pToReplace = $body.find('#replaceMe')[0];
    makeTextSelection(wymeditor, pToReplace, pToReplace);
    if ($divContainerLink.length) {
        $divContainerLink.click();
    }

    wymEqual(wymeditor, rootDivCorrectHtml, {
            assertionString: "P element is correctly converted to DIV"
        });
});


module("structure-wrap_root_inline_elements", {setup: setupWym});

var inlineElementsToTest = ['strong', 'em', 'a', 'sub', 'sup', 'span'],
    startRootInlineElementHtml = [],
    correctRootInlineElementHtml = [],
    i;

// Generic html for testing the wrapping of inline elements in the root of the
// document. "{inline_element}" should be replaced by the tag name of the
// specific inline element being tested.
var startTemplateRootInlineElementHtml = String() +
    '<p id="before">Before inline element in the document root</p>' +
    '<{inline_element} id="inline-in-root">Test</{inline_element}>' +
    '<p id="after">After inline element in the document root</p>';
var correctTemplateRootInlineElementHtml = String() +
    '<p id="before">Before inline element in the document root</p>' +
    '<p><{inline_element} id="inline-in-root">Test</{inline_element}></p>' +
    '<p id="after">After inline element in the document root</p>';

// Html for testing the wrapping of text directly inserted into the root of the
// document.
var startRootTextNodeHtml = startTemplateRootInlineElementHtml.replace(
    /<\{inline_element\}.*?<\/\{inline_element\}>/g, 'Test'
);
var correctRootTextNodeHtml = correctTemplateRootInlineElementHtml.replace(
    /<\{inline_element\}.*?<\/\{inline_element\}>/g, 'Test'
);

// Html for testing the wrapping of the different inline elements listed in
// inlineElementsToTest when they are in the root of the document.
for (i = 0; i < inlineElementsToTest.length; ++i) {
    startRootInlineElementHtml.push(startTemplateRootInlineElementHtml.replace(
        /\{inline_element\}/g, inlineElementsToTest[i]
    ));
    correctRootInlineElementHtml.push(correctTemplateRootInlineElementHtml.replace(
        /\{inline_element\}/g, inlineElementsToTest[i]
    ));
}

test("Text node in the document root is wrapped in default container", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
        keyup_event,
        textNode;

    // Set up keyup event with a letter key to trigger wrapping of the element
    keyup_event = jQuery.Event('keyup');
    keyup_event.which = WYMeditor.KEY.R;

    wymeditor._html(startRootTextNodeHtml);
    textNode = $body.contents()[1];
    makeTextSelection(wymeditor, textNode, textNode, 1, 1);
    $body.trigger(keyup_event);
    wymEqual(wymeditor, correctRootTextNodeHtml, {
            assertionString: "Text node in the document root is wrapped in " +
                "default container"
        });
});

test(
    "Inline element in the document root is wrapped in default container",
    function () {
        expect(inlineElementsToTest.length);
        var wymeditor = jQuery.wymeditors(0),
            $body = jQuery(wymeditor._doc).find('body.wym_iframe'),
            keyup_event,
            inlineElement,
            i;

        // Set up keyup event with a letter key to trigger wrapping of the element
        keyup_event = jQuery.Event('keyup');
        keyup_event.which = WYMeditor.KEY.R;

        for (i = 0; i < inlineElementsToTest.length; ++i) {
            wymeditor._html(startRootInlineElementHtml[i]);
            inlineElement = $body.find('#inline-in-root');
            makeTextSelection(wymeditor, inlineElement, inlineElement, 1, 1);
            $body.trigger(keyup_event);
            wymEqual(wymeditor, correctRootInlineElementHtml[i], {
                assertionString: [""
                    , "`"
                    , inlineElementsToTest[i]
                    , "` element in the document "
                    , "root is wrapped in default container"
                ].join('')
            });
        }
    }
);

