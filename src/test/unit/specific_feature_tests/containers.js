var replaceMeHtml = String() +
        '<p>Some text before the replaced container</p>' +
        '<p id="replaceMe">Replace me</p>' +
        '<p>Some text after the replaced container</p>';
var replacementDivHtml = '<div>replaced</div>';

var rootP_replaceMeHtml = String() +
        '<p>Some text before the replaced container</p>' +
        '<p>replaced</p>' +
        '<p>Some text after the replaced container</p>';
var rootDiv_replaceMeHtml = String() +
        '<p>Some text before the replaced container</p>' +
        '<div>replaced</div>' +
        '<p>Some text after the replaced container</p>';

module("structure-defaultRoot", {setup: setupWym});

test("DIV element is correctly converted to p", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body,
        elementToReplace;

    wymeditor._html(replaceMeHtml);
    $body = jQuery(wymeditor._doc).find('body.wym_iframe');
    elementToReplace = $body.find('#replaceMe')[0];
    makeTextSelection(wymeditor, elementToReplace, elementToReplace);

    wymeditor._exec(WYMeditor.INSERT_HTML, replacementDivHtml);
    htmlEquals(wymeditor, rootP_replaceMeHtml);
});

module("structure-defaultRoot_div", {setup: setupDefaultRootContainerDivWym});

test("DIV element is correctly inserted", function () {
    expect(1);
    var wymeditor = jQuery.wymeditors(0),
        $body,
        elementToReplace;

    wymeditor._html(replaceMeHtml);
    $body = jQuery(wymeditor._doc).find('body.wym_iframe');
    elementToReplace = $body.find('#replaceMe')[0];
    makeTextSelection(wymeditor, elementToReplace, elementToReplace);

    wymeditor._exec(WYMeditor.INSERT_HTML, replacementDivHtml);
    htmlEquals(wymeditor, rootDiv_replaceMeHtml);
});

