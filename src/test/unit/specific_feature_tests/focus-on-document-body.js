/* global
    QUnit,
    prepareUnitTestModule,
    manipulationTestHelper
*/

"use strict";

/*
 * `wym.focusOnDocumentBody` method
 */

QUnit.module("focusOnDocumentBody", {setup: function () {
    // pass an empty object to setup brand newly initialized editor
    prepareUnitTestModule({});
}});

QUnit.test("Sets the body as the `activeElement`", function () {
    manipulationTestHelper({
        startHtml: "<p>foo</p>",
        setCaretInSelector: "p",
        additionalAssertionsFunc: function (wymeditor) {
            QUnit.expect(2);
            var doc = wymeditor._doc,
                body = wymeditor.body();
            // In some browsers the body will already be the `activeElement`
            wymeditor.focusOnDocumentBody();
            QUnit.strictEqual(
                doc.activeElement,
                body,
                "active element is the body"
            );
        }
    });
});
