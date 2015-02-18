/* global
    QUnit,
    prepareUnitTestModule,
    skipKeyboardShortcutTests,
    simulateKeyCombo
*/

"use strict";

module("native-edits-registering", {setup: prepareUnitTestModule});

// Registration of native edits is almost entirely external module code.
// Specifically, the 'edited' module.
// The following tests are not meant to fully cover 'edited'.
// They are meant to test that 'edited' seems to be working.

QUnit.test("edited is instantiated", function () {
    QUnit.expect(1);

    var wymeditor = jQuery.wymeditors(0),
        edited = wymeditor.nativeEditRegistration.edited,
        Edited = WYMeditor.EXTERNAL_MODULES.Edited;
    QUnit.ok(edited instanceof Edited, "instanceof");
});

QUnit.test("'edited' seems to be working", function () {
    if (skipKeyboardShortcutTests) {
        QUnit.expect(0);
        return;
    }
    QUnit.expect(1);

    var wymeditor = jQuery.wymeditors(0),
        thisTest = this,
        callCount,
        p;

    thisTest.spy(wymeditor, 'registerModification');

    // on some keyboard events the editor expects real selection
    wymeditor.html("<p>foo</p>");
    p = wymeditor.$body().find("p")[0];
    wymeditor.setCaretIn(p);

    simulateKeyCombo(wymeditor, 'a'); // 1st callback
    simulateKeyCombo(wymeditor, '3'); // no callback
    simulateKeyCombo(wymeditor, ' '); // 2nd callback
    simulateKeyCombo(wymeditor, ' '); // no callback
    simulateKeyCombo(wymeditor, '.'); // 3rd callback

    callCount = wymeditor.registerModification.callCount;
    QUnit.strictEqual(callCount, 3, "`registerModification` called 3 times");

    wymeditor.registerModification.restore();
});
