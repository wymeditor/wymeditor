Wymeditor.ns('dom').structureManager = (function(){
    
    var _rawRuleSet,
        _ruleSet;
    
    function loadRuleSet (ruleSet) {
        // Should work some magic here, but for now this will do
        _rawRuleSet = _ruleSet = ruleSet;
    };
    
    function expandElement () {
        // Insert magic here
    };
    
    function getCollection(name) {
        // FIXME: Returns a reference, which is bad...
        return name in _ruleSet.collections ? _ruleSet.collections[name] : [];
    }
    
    function getCollectionSelector (name) {
        return getCollection(name).join(', ');
    }
    
    return {
        load: loadRuleSet,
        getCollection: getCollection,
        getCollectionSelector: getCollectionSelector
    };
})();

Wymeditor.dom.structureManager.load({
    nodes: {
        '*': {
            attributes: ['class', 'id'],
            next: 'p'
        }
    },
    collections: {
        block: ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'dl'],
        inline: ['a', 'span', 'strong', 'em', '#text'],
        special: []
    }
});