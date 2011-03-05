Wymeditor.ns('dom').serialize = function serialize (node) {
    var html = '',
        childNodes = node.childNodes,
        child, i, j,
        attributes, attribute, attrName, attrValue;
    
    if (childNodes.length) {
        for (i=0; child = childNodes[i]; i++) {
            if (child.nodeType === Wymeditor.TEXT_NODE) {
                html += child.nodeValue.replace(/</g,'&lt;').replace(/>/g,'&gt;');
            } else if (child.nodeType === Wymeditor.COMMENT_NODE) {
                html += '<!--'+child.nodeValue+'-->';
            } else {
                html += '<'+child.nodeName.toLowerCase();
                attributes = child.attributes;
                
                for (j=0; attribute = attributes[j]; j++) {
                    attrName = attribute.nodeName.toLowerCase();
                    attrValue = attribute.nodeValue;
                    
                    if (attrName === 'style' && child.style.cssText) {
                        html += ' style="'+child.style.cssText.toLowerCase()+'"';
                    } else if (attrValue && attrName !== 'contenteditable') {
                        html += ' '+attrName+'="'+attrValue+'"';
                    }
                }
                
                if (child.childNodes && child.childNodes.length) {
                    html += '>'+serialize(child);
                    html += '</'+child.nodeName.toLowerCase()+'>';
                } else {
                    html += ' />';
                }
            }
        }
    }
};