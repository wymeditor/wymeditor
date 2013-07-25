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

module("structure-defaultRoot_p", {setup: setupWym});

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

    htmlEquals(wymeditor, rootPCorrectHtml,
               "DIV element is correctly converted to P");
});

module("structure-defaultRoot_div", {setup: setupDefaultRootContainerDivWym});

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

    htmlEquals(wymeditor, rootDivCorrectHtml,
               "P element is correctly converted to DIV");
});

