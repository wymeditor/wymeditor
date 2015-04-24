/* jshint maxlen: 100 */
/* global -$,
    QUnit,
    equal,
    module,
    notEqual,
    test,
    prepareUnitTestModule
*/
"use strict";

module(
    "skin-ui-overrides",
    {
        setup: function () {
            prepareUnitTestModule({
                options: {skin: 'basic'}
            });
        }
    }
);

test("skin's iframeHtml is used preferentially", function () {
    var wym = jQuery.wymeditors(0);
    QUnit.expect(2);

    // Ensure that the basic skin has a non-default iframeHtml, so that this
    // test is meaningful
    notEqual(
        WYMeditor.DEFAULT_OPTIONS.iframeHtml,
        WYMeditor.SKINS.basic.UI_COMPONENTS.iframeHtml
    );

    // Ensure that non-default attribute propagates
    equal(wym._options.iframeHtml, WYMeditor.SKINS.basic.UI_COMPONENTS.iframeHtml);
});
