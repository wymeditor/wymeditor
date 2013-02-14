
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
    var wymeditor = jQuery.wymeditors(0),
        $body,
        selectedElmnt;

    expect(1);

    wymeditor.html(replaceMeHtml);
    $body = jQuery(wymeditor._doc).find('body.wym_iframe');
    wymeditor._doc.body.focus();

    selectedElmnt = $body.find('#replaceMe').get(0);
    makeTextSelection(wymeditor, selectedElmnt, selectedElmnt, 0, selectedElmnt.innerText.length);

    wymeditor._exec(WYMeditor.INSERT_HTML, replacementDivHtml);
    htmlEquals(wymeditor, rootP_replaceMeHtml);
});

module("structure-defaultRoot-div", {setup: setupDefaultRootContainerDivWym});

test("DIV element is correctly inserted", function () {
    var wymeditor = jQuery.wymeditors(0),
        $body,
        selectedElmnt;

    expect(1);

    wymeditor.html(replaceMeHtml);
    $body = jQuery(wymeditor._doc).find('body.wym_iframe');
    wymeditor._doc.body.focus();

    selectedElmnt = $body.find('#replaceMe').get(0);
    makeTextSelection(wymeditor, selectedElmnt, selectedElmnt, 0, selectedElmnt.innerText.length);

    wymeditor._exec(WYMeditor.INSERT_HTML, replacementDivHtml);
    htmlEquals(wymeditor, rootDiv_replaceMeHtml);
});
