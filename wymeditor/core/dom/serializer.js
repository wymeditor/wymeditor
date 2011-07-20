/**
    Wymeditor.dom.serializer
    ========================
    Extends Wymeditor.Observable.

    Events
    ------
    - serialized

      Fires once a DOMNode has been serialized into the Array-format allowing 
      manipulation of the result. 

    Methods
    -------
*/
Wymeditor.ns('dom').serializer = (function(){
    function Serializer () {
        Wymeditor.Observable.call(this);
    };
    
    Serializer.prototype = Wymeditor.utils.extendPrototypeOf(Wymeditor.Observable, {

        /**
            - Array toArray(DOMNode)

              Serializes the DOM to a format similar to the one produced by node-htmparser.
        */
        toArray: function (node) {
            var result = [],
                childNodes = node.childNodes,
                child, i, j, o,
                attributes, attribute, attrName, attrValue;
            
            if (childNodes.length) {
                for (i=0; child = childNodes[i]; i++) {
                    if (child.nodeType === Wymeditor.TEXT_NODE) {
                        result.push({ 
                            type: Wymeditor.PARSER_TEXT_NODE, 
                            data: child.nodeValue.replace(/</g,'&lt;').replace(/>/g,'&gt;') 
                        });
                    } else if (child.nodeType === Wymeditor.COMMENT_NODE) {
                        result.push({ 
                            type: Wymeditor.PARSER_TEXT_NODE, 
                            data: child.nodeValue 
                        });
                    } else {
                        o = {
                            type: Wymeditor.PARSER_ELEMENT_NODE,
                            name: child.nodeName.toLowerCase()
                        };
                        attributes = {};

                        for (j=0; attribute = child.attributes[j]; j++) {
                            attrName = attribute.nodeName.toLowerCase();
                            attrValue = attribute.nodeValue;
                            
                            if (attrName === 'style' && child.style.cssText) {
                                attributes.style = child.style.cssText.toLowerCase();
                            } else if (attrValue && attrName !== 'contenteditable') {
                                attributes[attrName] = attrValue;
                            }
                        }
                        
                        if (!$.isEmptyObject(attributes)) {
                            o.attribs = attributes;
                        }

                        if (child.childNodes && child.childNodes.length) {
                            o.children = this.toArray(child);
                        }

                        result.push(o);
                    }
                }
            }
            
            this.fireEvent('serialized', { result: result });

            return result;        
        },

        /**
            - String arrayToHtml(Array)

              Takes an array formated like the node-htmlparser output and turns it in 
              to proper html.
        */
        arrayToHtml: function (nodes) {
            var html = '',
                child, i, j,
                attributes, attribute, attrName, attrValue;
            
            if (nodes.length) {
                for (i=0; child = nodes[i]; i++) {
                    if (child.type === Wymeditor.PARSER_TEXT_NODE) {
                        html += child.data;
                    } else if (child.type === Wymeditor.PARSER_COMMENT_NODE) {
                        html += '<!--'+child.data+'-->';
                    } else {
                        html += '<'+child.name;
                        attributes = child.attribs;
                        
                        for (attribute in attributes) {
                            if (attributes.hasOwnProperty(attribute)) {
                                html += ' '+attribute+'="'+attributes[attribute]+'"';                            
                            }
                        }
                        
                        if (child.children && child.children.length) {
                            html += '>'+this.arrayToHtml(child.children);
                            html += '</'+child.name+'>';
                        } else {
                            html += ' />';
                        }
                    }
                }
            }

            return html;
        },

        /**
            - String toHtml(DOMNode)

              Convenience method for serializing a DOMNode into a String.
        */
        toHtml: function (node) {
            return this.arrayToHtml(this.toArray(node));
        }
        
    });

    return new Serializer();
})();