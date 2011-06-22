jQuery(function($){
    module('structureManager');
    var SM = Wymeditor.dom.structureManager;

    test('load', function() {
        SM.load({
            elements: {
                'u': { remove: true },
                'a': { attributes: { href: true, rel: false } },
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

        ok(true, 'Loaded ruleSet');
    });

    test('getElement', function() {
        deepEqual(SM.getElement('u'), {
            "attributes": {
                "class": false,
                "id": false
            },
            "nestSelf": false,
            "remove": true
        }, 'Single element without collection');

        deepEqual(SM.getElement('a'), {
            "attributes": {
                "class": false,
                "id": false,
                "href": true,
                "rel": false
            },
            "nestSelf": false,
            "validChildren": [
                "strong",
                "#text"
            ],
            "validParents": []
        }, 'Single element without collection');

    });
});