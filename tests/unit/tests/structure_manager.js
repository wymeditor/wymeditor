jQuery(function($){
    module('StructureManager');
    test('load', function() {
        var SM = new Wymeditor.dom.StructureManager({
            elements: {
                'cunstomElement': { customProp: true }
            },
            collections: {
                all: {
                    properties: { 
                        attributes: { 'class': false, 'id': false },
                        nestSelf: false 
                    }
                },
                block: {
                    members: ['div', 'p'],
                    properties: {
                        validChildren: ['$inline'],
                        next: 'p'
                    }
                },
                inline: {
                    members: ['a', 'strong', '#text'],
                    properties: {
                        validChildren: ['$inline']
                    }
                }
            }
        });
        ok(true, "Pass custom ruleSet to Consructor. We didn't die, so lets say we made it.");

        deepEqual(SM.getElement('cunstomElement'), {
            "attributes": {
                "class": false,
                "id": false
            },
            "nestSelf": false,
            "customProp": true
        }, 'Get customElement');

        // Restore defaults
        SM.load(Wymeditor.dom.StructureManager.DEFAULT_RULESET);

        ok(true, "Load ruleSet using the load method. We didn't die, so lets say we made it.");
    });

    test('getElement', function() {
        var SM = new Wymeditor.dom.StructureManager();
        
        deepEqual(SM.getElement('u'), {
            "attributes": {
                "class": false,
                "id": false
            },
            "nestSelf": false,
            "remove": true
        }, 'Single element without collection (u)');

        deepEqual(SM.getElement('a'), {
            "attributes": {
                "class": false,
                "id": false,
                "href": true,
                "rel": false
            },
            "nestSelf": false,
            "validChildren": [
                "span",
                "strong",
                "em",
                "br",
                "#text"
            ],
            "validParents": [
                "p",
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "dl",
                "li",
                "dd",
                "span",
                "strong",
                "em",
                "#text"
            ]
        }, 'Inline element with custom properties (a)');

        deepEqual(SM.getElement('div'), {
            "attributes": {
                "class": false,
                "id": false
            },
            "nestSelf": true,
            "validChildren": [
                "div",
                "blockquote",
                "p",
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "ul",
                "ol",
                "dl",
                "li",
                "dd"
            ],
            "next": "p",
            "forceChild": "p",
            "validParents": [
                "div",
                "blockquote"
            ]
        }, 'Block element (div)');
    });
});
