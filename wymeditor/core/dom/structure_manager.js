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
        return name in _ruleSet.collections ? _ruleSet.collections[name].members : [];
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

/**
 * Elements
 * The element will be expanded with properties from the collections.
 *
 * When expanded:
 * 'p': {
 *     attributes: {
 *         'attributeName': true (required) || false (optional) || RegEx
 *     },
 *     children: {
 *         'nodeName': { attributes: {}, children: {} }
 *     },
 *     nestSelf: true || false (decides if element is allowed inside itself)
 * }
 * 
 * Collections
 * By grouping the elements properties can be applied all at once. Some
 * collections (inline and block) are used extensively inside the editor. Any
 * references to collections (written like `$name`) will be expanded.
 * 
 * Weight
 * Element > Collection (weight: n) > Collection (weight: n-1)
 * 
 */
Wymeditor.dom.structureManager.load({
    elements: {
        'b': { replaceWith: 'strong' },
        'i': { replaceWith: 'em' },
        'u': { remove: true },
        'a': { attributes: { href: true } },
        'div': { children: ['$block'] }
    },
    collections: {
        all: {
            attributes: { 'class': false, 'id': false },
            nestSelf: false,
            weight: 0
        },
        block: {
            members: ['div', 'blockquote', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'dl', 'li', 'dd'],
            children: ['$inline'],
            next: 'p'
        },
        inline: {
            members: ['a', 'span', 'strong', 'em', 'br', '#text'],
            children: ['$inline']
        },
        structuralBlocks: {
            members: ['div', 'blockquote'], // 'article', 'section', 'aside', etc
            children: ['$block'],
            weight: 2
        },
        lists: {
            members: ['ol', 'ul'],
            children: ['li'],
            weight: 2
        },
        nestable: {
            members: ['div', 'ol', 'ul', 'li'],
            nestSelf: true
        }
    }
});