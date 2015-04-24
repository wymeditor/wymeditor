/* jshint maxlen: 100 */
/* global -$,
    equal,
    test,
    module,
    QUnit,
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
    QUnit.expect(1);

    equal(wym._options.iframeHtml, WYMeditor.SKINS.basic.UI_COMPONENTS.iframeHtml);
});
