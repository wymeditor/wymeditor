/* global
    QUnit,
    prepareUnitTestModule,
    skipKeyboardShortcutTests,
    simulateKeyCombo
*/

"use strict";

module("native_edits_registeration", {setup: prepareUnitTestModule});

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

QUnit.test("'edited' modification callbacks are firing on" +
    "keystrokes", function () {
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

        wymeditor.undoRedo.reset();
        simulateKeyCombo(wymeditor, 'a'); // no callback
        simulateKeyCombo(wymeditor, '3'); // no callback
        simulateKeyCombo(wymeditor, ' '); // 1st callback
        simulateKeyCombo(wymeditor, ' '); // no callback
        simulateKeyCombo(wymeditor, '.'); // 2nd callback

        callCount = wymeditor.registerModification.callCount;
        QUnit.strictEqual(
            callCount,
            2,
            "`registerModification` called twice"
        );

        wymeditor.registerModification.restore();
    }
);
