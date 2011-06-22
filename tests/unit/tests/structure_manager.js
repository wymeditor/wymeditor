jQuery(function($){
    module('StructureManager');

    var SM = new Wymeditor.dom.StructureManager()
    /*
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
    }); */

    test('getElement', function() {
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
        }, 'Inline element with custom properties (a)');
    });
});
