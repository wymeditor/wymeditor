module('Editable Area');
jQuery(function($){
    var element = $('.editable'),
        editableArea = new Wymeditor.core.EditableArea(element);
    
    test('init', 6, function() {
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
        strictEqual(editableArea.html(), testHtml, 'Setting and getting HTML');
        
        editableArea.html('');
        ok(editableArea.isEmpty(), 'Emptying the editor');
    });
    
    test('splitBlock', 4, function() {
        function setup () {
            var text = document.createTextNode('Text to break'),
                node = document.createElement('p');
            node.appendChild(text);
            editableArea.html('');
            editableArea.element.append(node);
            return text;
        }
        
        editableArea.splitBlock(setup(), 0);
        strictEqual(editableArea.html(), '<p><br _wym_placeholder="true" /></p><p>Text to break</p>', 'Splitting block elements (index 0)');
        
        editableArea.splitBlock(setup(), 2);
        strictEqual(editableArea.html(), '<p>Te</p><p>xt to break</p>', 'Splitting block elements (index 2)');
        
        var textNode = setup();
        
        editableArea.splitBlock(textNode, textNode.length);
        strictEqual(editableArea.html(), '<p>Text to break</p><p><br _wym_placeholder="true" /></p>', 'Splitting block elements (index 2)');
        
        editableArea.html('');
        
        var nestedElement = $('<strong>').appendTo($('<p>Nested </p>').appendTo(editableArea.element));
        textNode = document.createTextNode('test');
        nestedElement.append(textNode);
        
        editableArea.splitBlock(textNode, 2);
        strictEqual(editableArea.html(), '<p>Nested <strong>te</strong></p><p><strong>st</strong></p>', 'Splitting nested elements (index 2)');
        
        editableArea.html('');
        
    });
});