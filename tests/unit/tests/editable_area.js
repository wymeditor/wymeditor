module('Editable Area');
test('init', 6, function() {
    var element = $('.editable'),
        editableArea = new Wymeditor.core.EditableArea(element);
    ok(editableArea instanceof Wymeditor.core.EditableArea, 'Create instace');
    
    ok(editableArea.addListener('disable', function () {
        ok(true, 'Received disable event');
    }), 'Add event listener');
    
    editableArea.disable();
    
    editableArea.addListener('enable', function () {
        ok(true, 'Received enable event');
    });
    
    editableArea.enable();
    
    var testHtml = '<p>Test</p>';
    
    editableArea.html(testHtml);
    ok(editableArea.html() === testHtml, 'Setting and getting HTML');
    
    editableArea.html('');
    ok(editableArea.isEmpty(), 'Emptying the editor');
});