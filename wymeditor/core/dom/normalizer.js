Wymeditor.ns('dom').normalizer = (function(){

    function elementsAreEqual (first, second) {
        var attributes = {}, 
            equal = true,
            name, 
            value,
            i;
        
        if (first.attributes.length === second.attributes.length) {
            for (i=0; attribute = first.attributes[i]; i++) {
                name = attribute.nodeName.toLowerCase();
                value = attribute.nodeValue;
                
                if (name === 'style' && first.style.cssText) {
                    attributes[name] = first.style.cssText;
                } else if (name !== 'contenteditable' && value !== '') {
                    attributes[name] = value;
                }
            }
            for (i=0; attribute = second.attributes[i]; i++) {
                name = attribute.nodeName.toLowerCase();
                value = attribute.nodeValue;

                if (
                    !(name in attributes) ||
                    (name !== 'contenteditable' && value !== '' && attributes[name] !== value) ||
                    (name === 'style' && second.style.cssText && attributes[name] !== first.style.cssText)
                ) {
                    return false;
                }
            }
            // We're still here, so the elements are equal
            return true;
        }
        return false;
    }
	
    function normalizeElement (node, next) {
        // Merge elements only if they share the same attributes
        if (elementsAreEqual(node, next)) {
            // Merge nodes
            for (i = 0; child = next.childNodes[i]; i++) {
                node.appendChild(next.removeChild(child));
            }
            return node;
        }
        return next;
	}
    
    function normalizeNode (node) {
        var next;
        node = $(node)[0] && $(node)[0].childNodes[0];

        while (node) {
            next = node.nextSibling;
            
            // Do we have two nodes of the same type?
            if (next && next.nodeName === node.nodeName) {
                
                // Merge text nodes
                if (node.nodeType === Wymeditor.TEXT_NODE) {
                    node.appendData(next.data);
                    next.parentNode.removeChild(next);

                } else if (node.nodeType === Wymeditor.ELEMENT_NODE) {
                    // Recursion: normalize children
                    normalizeNode(node);
                    node = normalizeElement(node, next);
                }

            // We have two different nodes
            } else {
                // Remove empty elements
                if (node.nodeType === Wymeditor.ELEMENT_NODE && !node.childNodes.length) {
                    node.parentNode.removeChild(node);
                }
                node = next;
            }
        }
    }

    function normalizeNodes (nodes) {
        for (var i = 0, node; node = nodes[i]; i++) {
            normalizeNode(node);
        }
    }

    return {
        normalizeNode: normalizeNode,
        normalizeNodes: normalizeNodes
    }
})();