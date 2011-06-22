Wymeditor.ns('dom').structureManager = (function(undefined){
    
    var _rawRuleSet,
        _ruleSet;
    
    function loadRuleSet (ruleSet) {
        _rawRuleSet = ruleSet;

        // Copy collections, elements will be added later
        _ruleSet = { 
            elements: {},
            collections: $.extend(true, {}, _rawRuleSet.collections),
            collectionsByWeight: _sortCollections()
        };

        _expandElements();
    };
    
    function _sortCollections () {
        var collections = _ruleSet.collections,
            result = [],
            key;

        for (key in collections) {
            if (collections.hasOwnProperty(key)) {
                result.push(collections[key]);
            }
        }

        result.sort(function(a, b) {
            return (a.weight || 1) - (b.weight || 1);
        });

        return result;
    };

    function _expandElements () {
        var child,
            collections = _ruleSet.collections,
            collection, 
            elements = _ruleSet.elements,
            element,
            members,
            tagName,
            i, j;

        // Merge all collection per element
        for (i = 0; collection = collections[i]; i++) {
            for (j = 0; tagName = collection.members[j]; j++) {
                elements[tagName] = $.extend((elements[tagName] || {}), collection.properties);
            }
        }

        // Add element specific overrides/extensions
        for (tagName in _rawRuleSet.elements) {
            if (_rawRuleSet.elements.hasOwnProperty(tagName)) {
                elements[tagName] = $.extend((elements[tagName] || {}), _rawRuleSet.elements[tagName]);
            }
        }

        // Expand collection $references and create corresponding validParents for validChildren
        for (tagName in elements) {
            if (_rawRuleSet.elements.hasOwnProperty(tagName)) {

                // Add the properties from the "all" collection
                element = elements[tagName] = $.extend({}, collections.all.properties, elements[tagName]);

                // Lets find those $references
                for (i = 0; child = element.validChildren[i]; i++) {
                    if (child.substr(0,1) === '$') {
                        members = getCollection(child.substr(1));
                        // Remove reference and add collection members
                        element.validChildren.splice.apply(element.validChildren, [i, 1].concat(members));

                        // Update child to match the new value at index i
                        child = element.validChildren[i];
                    }
                    
                    // Add element as a validParent to its validChild
                    elements[child].validParents = elements[child].validParents || [];
                    elements[child].validParents.push(tagName);
                }
            }
        }
    };
    
    function getElement (name) {
        // Return a copy not a reference
        return $.extend(true, {}, _ruleSet.elements[name]); 
    };

    function getCollection(name) {
        // FIXME: Returns a reference, which is bad...
        return name in _ruleSet.collections ? _ruleSet.collections[name] : {};
    };
    
    function getCollectionSelector (name) {
        var collection = getCollection(name);
        return 'members' in collection ? collection.members.join(', ') : '';
    };
    
    return {
        load: loadRuleSet,
        getElement: getElement,
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
 *     validChildren: ['tagName1', ... 'tagNameN'],
 *     validParents: ['otherTagName1', ... 'otherTagNameN'],
 *     nestSelf: true || false (decides if element is allowed inside itself, might be redundant?)
 * }
 * 
 * Collections
 * By grouping the elements properties can be applied all at once. Some
 * collections (inline and block) are used extensively inside the editor. Any
 * references to collections (written like `$name`) will be expanded.
 * 
 * Weight
 * Element > Collection (weight: n) > Collection (weight: n-1) > Collection (all)
 * 
 */
Wymeditor.dom.structureManager.load({
    elements: {
        'b': { replaceWith: 'strong' },
        'i': { replaceWith: 'em' },
        'u': { remove: true },
        'a': { attributes: { href: true, rel: false } },
        'img': { attributes: { src: true, alt: true, width: false, height: false } }
    },
    collections: {
        all: {
            properties: { 
                attributes: { 'class': false, 'id': false },
                nestSelf: false 
            },
            weight: 0
        },
        block: {
            members: ['div', 'blockquote', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'dl', 'li', 'dd'],
            properties: {
                validChildren: ['$inline'],
                next: 'p'
            }
        },
        inline: {
            members: ['a', 'span', 'strong', 'em', 'br', '#text'],
            properties: {
                validChildren: ['$inline']
            }
        },
        structuralBlocks: {
            members: ['div', 'blockquote'], // 'article', 'section', 'aside', etc
            properties: {
                validChildren: ['$block'],
                forceChild: 'p'
            },
            weight: 2
        },
        lists: {
            members: ['ol', 'ul'],
            properties: {
                validChildren: ['li'],
                forceChild: 'li'
            },
            weight: 2
        },
        nestable: {
            members: ['div', 'ol', 'ul', 'li'],
            properties: {
                nestSelf: true
            }
        }
    }
});