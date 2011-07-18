Wymeditor.ns('dom').StructureManager = function (ruleSet) {
    
    var _rawRuleSet,
        _ruleSet;
    
    function loadRuleSet (ruleSet) {
        _rawRuleSet = ruleSet;

        // Copy collections, nodes will be added later
        _ruleSet = { 
            nodes: {},
            collections: $.extend(true, {}, _rawRuleSet.collections)
        };

        _ruleSet.collectionsByWeight = _sortCollections();

        _expandNodes();
    };
    
    function _sortCollections () {
        var collections = _ruleSet.collections,
            result = [],
            key;

        for (key in collections) {
            if (collections.hasOwnProperty(key) && key !== 'all') {
                result.push(collections[key]);
            }
        }

        result.sort(function(a, b) {
            return (a.weight || 1) - (b.weight || 1);
        });

        return result;
    };

    function _expandNodes () {
        var child,
            collections = _ruleSet.collections,
            collectionsByWeight = _ruleSet.collectionsByWeight,
            collection, 
            nodes = _ruleSet.nodes,
            node,
            members,
            nodeName,
            i, j;

        // Merge all collection per node
        for (i = 0; collection = collectionsByWeight[i]; i++) {
            for (j = 0; nodeName = collection.members[j]; j++) {
                nodes[nodeName] = $.extend(true, (nodes[nodeName] || {}), collection.properties);
            }
        }

        // Add node specific overrides/extensions
        for (nodeName in _rawRuleSet.nodes) {
            if (_rawRuleSet.nodes.hasOwnProperty(nodeName)) {
                nodes[nodeName] = $.extend(true, (nodes[nodeName] || {}), _rawRuleSet.nodes[nodeName]);
            }
        }

        // Expand collection $references and create corresponding validParents for validChildren
        for (nodeName in nodes) {
            if (nodes.hasOwnProperty(nodeName)) {

                // Add the properties from the "all" collection
                node = nodes[nodeName] = $.extend(true, {}, collections.all.properties, nodes[nodeName]);

                if (node.validChildren) {
                    // Lets find those $references
                    i = 0;
                    while (child = node.validChildren[i]) {
                        if (child.substr(0,1) === '$') {
                            members = getCollection(child.substr(1)).members;
                            // Remove reference and add collection members
                            node.validChildren.splice.apply(node.validChildren, [i, 1].concat(members));

                            // Start over at current index
                            continue;
                        }
                        
                        if (child === nodeName && !node.nestSelf) {
                            node.validChildren.splice(i, 1);
                            
                            // Start over at current index
                            continue;
                        }

                        // Add node as a validParent to its validChild
                        nodes[child].validParents = nodes[child].validParents || [];
                        nodes[child].validParents.push(nodeName);

                        i++;
                    }
                }
            }
        }
    };
    
    function getNode (name) {
        // Return a copy not a reference
        return $.extend(true, {}, _ruleSet.nodes[name]); 
    };

    function getCollection(name) {
        // FIXME: Returns a reference, which is bad...
        return name in _ruleSet.collections ? _ruleSet.collections[name] : {};
    };
    
    function getCollectionSelector (name) {
        var collection = getCollection(name);
        return 'members' in collection ? collection.members.join(', ') : '';
    };
    

    loadRuleSet(ruleSet || Wymeditor.dom.StructureManager.DEFAULT_RULESET);

    return {
        load: loadRuleSet,
        getNodeRules: getNode,
        getCollectionRules: getCollection,
        getCollectionSelector: getCollectionSelector
    };
};

/**
 * Nodes
 * The node will be expanded with properties from the collections.
 *
 * When expanded:
 * 'p': {
 *     attributes: {
 *         'attributeName': true (required) || false (optional) || RegEx
 *     },
 *     validChildren: ['nodeName1', ... 'nodeNameN'],
 *     validParents: ['otherNodeName1', ... 'otherNodeNameN'],
 *     nestSelf: true || false (decides if node is allowed inside itself, might be redundant?)
 * }
 * 
 * Collections
 * By grouping the nodes properties can be applied all at once. Some
 * collections (inline and block) are used extensively inside the editor. Any
 * references to collections (written like `$name`) will be expanded.
 * 
 * Weight
 * Node > Collection (weight: n) > Collection (weight: n-1) > Collection (all)
 * 
 */
Wymeditor.dom.StructureManager.DEFAULT_RULESET = {
    nodes: {
        'b': { replaceWith: 'strong' },
        'i': { replaceWith: 'em' },
        'u': { remove: true },
        'a': { attributes: { href: true, rel: false } },
        'img': { attributes: { src: true, alt: true, width: false, height: false } },
        'br': { validChildren: false } 
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
};