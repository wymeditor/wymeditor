module("native-edits-registering", {setup: prepareUnitTestModule});

// Registration of native edits is almost entirely external module code.
// Specifically, the 'edited' module.
// The following tests are not meant to fully cover 'edited'.
// They are meant to make sure that 'edited' is instantiated and seems to be working.

test("edited is instantiated", function () {
    QUnit.expect(1);

    var wymeditor = jQuery.wymeditors(0);
    ok(wymeditor.nativeEdits.edited instanceof WYMeditor.EXTERNAL_MODULES.Edited, "instanceof");
});

test("'edited' seems to be working", function () {
    QUnit.expect(1);

    var wymeditor = jQuery.wymeditors(0);
    var thisTest = this;
    thisTest.spy(wymeditor, 'registerModification');

    simulateKeyCombo(wymeditor, 'a'); // 1st callback
    simulateKeyCombo(wymeditor, '3'); // no callback
    simulateKeyCombo(wymeditor, ' '); // 2nd callback
    simulateKeyCombo(wymeditor, ' '); // no callback
    simulateKeyCombo(wymeditor, '.'); // 3rd callback
    strictEqual(wymeditor.registerModification.callCount, 3, "`registerModification` called 3 times");
    wymeditor.registerModification.restore();
});
