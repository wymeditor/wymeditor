/*
 Serializer module for Rangy.
 Serializes Ranges and Selections. An example use would be to store a user's selection on a particular page in a
 cookie or local storage and restore it on the user's next visit to the same page.

 Part of Rangy, a cross-browser JavaScript range and selection library
 http://code.google.com/p/rangy/

 Depends on Rangy core.

 Copyright 2011, Tim Down
 Licensed under the MIT license.
 Version: 1.1.2
 Build date: 30 May 2011
*/
rangy.createModule("Serializer",function(h,n){function o(c,a){a=a||[];var b=c.nodeType,e=c.childNodes,d=e.length,f=[b,c.nodeName,d].join(":"),g="",k="";switch(b){case 3:g=c.nodeValue.replace(/</g,"&lt;").replace(/>/g,"&gt;");break;case 8:g="<!--"+c.nodeValue.replace(/</g,"&lt;").replace(/>/g,"&gt;")+"--\>";break;default:g="<"+f+">";k="</>";break}g&&a.push(g);for(b=0;b<d;++b)o(e[b],a);k&&a.push(k);return a}function j(c){c=o(c).join("");return u(c).toString(16)}function l(c,a,b){var e=[],d=c;for(b=
b||i.getDocument(c).documentElement;d&&d!=b;){e.push(i.getNodeIndex(d,true));d=d.parentNode}return e.join("/")+":"+a}function m(c,a,b){if(a)b||i.getDocument(a);else{b=b||document;a=b.documentElement}c=c.split(":");a=a;b=c[0]?c[0].split("/"):[];for(var e=b.length,d;e--;){d=parseInt(b[e],10);if(d<a.childNodes.length)a=a.childNodes[parseInt(b[e],10)];else throw n.createError("deserializePosition failed: node "+i.inspectNode(a)+" has no child with index "+d+", "+e);}return new i.DomPosition(a,parseInt(c[1],
10))}function p(c,a,b){b=b||h.DomRange.getRangeDocument(c).documentElement;if(!i.isAncestorOf(b,c.commonAncestorContainer,true))throw Error("serializeRange: range is not wholly contained within specified root node");c=l(c.startContainer,c.startOffset,b)+","+l(c.endContainer,c.endOffset,b);a||(c+="{"+j(b)+"}");return c}function q(c,a,b){if(a)b=b||i.getDocument(a);else{b=b||document;a=b.documentElement}c=/^([^,]+),([^,\{]+)({([^}]+)})?$/.exec(c);var e=c[4],d=j(a);if(e&&e!==j(a))throw Error("deserializeRange: checksums of serialized range root node ("+
e+") and target root node ("+d+") do not match");e=m(c[1],a,b);a=m(c[2],a,b);b=h.createRange(b);b.setStart(e.node,e.offset);b.setEnd(a.node,a.offset);return b}function r(c,a,b){if(a)b||i.getDocument(a);else{b=b||document;a=b.documentElement}c=/^([^,]+),([^,]+)({([^}]+)})?$/.exec(c)[3];return!c||c===j(a)}function s(c,a,b){c=c||rangy.getSelection();c=c.getAllRanges();for(var e=[],d=0,f=c.length;d<f;++d)e[d]=p(c[d],a,b);return e.join("|")}function t(c,a,b){if(a)b=b||i.getWindow(a);else{b=b||window;a=
b.document.documentElement}c=c.split("|");for(var e=h.getSelection(b),d=[],f=0,g=c.length;f<g;++f)d[f]=q(c[f],a,b.document);e.setRanges(d);return e}h.requireModules(["WrappedSelection","WrappedRange"]);if(typeof encodeURIComponent=="undefined"||typeof decodeURIComponent=="undefined")n.fail("Global object is missing encodeURIComponent and/or decodeURIComponent method");var u=function(){var c=null;return function(a){for(var b=[],e=0,d=a.length,f;e<d;++e){f=a.charCodeAt(e);if(f<128)b.push(f);else f<
2048?b.push(f>>6|192,f&63|128):b.push(f>>12|224,f>>6&63|128,f&63|128)}a=-1;if(!c){e=[];d=0;for(var g;d<256;++d){g=d;for(f=8;f--;)if((g&1)==1)g=g>>>1^3988292384;else g>>>=1;e[d]=g>>>0}c=e}e=c;d=0;for(f=b.length;d<f;++d){g=(a^b[d])&255;a=a>>>8^e[g]}return(a^-1)>>>0}}(),i=h.dom;h.serializePosition=l;h.deserializePosition=m;h.serializeRange=p;h.deserializeRange=q;h.canDeserializeRange=r;h.serializeSelection=s;h.deserializeSelection=t;h.canDeserializeSelection=function(c,a,b){var e;if(a)e=b?b.document:
i.getDocument(a);else{b=b||window;a=b.document.documentElement}c=c.split("|");b=0;for(var d=c.length;b<d;++b)if(!r(c[b],a,e))return false;return true};h.restoreSelectionFromCookie=function(c){c=c||window;var a;a:{a=c.document.cookie.split(/[;,]/);for(var b=0,e=a.length,d;b<e;++b){d=a[b].split("=");if(d[0].replace(/^\s+/,"")=="rangySerializedSelection")if(d=d[1]){a=decodeURIComponent(d.replace(/\s+$/,""));break a}}a=null}a&&t(a,c.doc)};h.saveSelectionCookie=function(c,a){c=c||window;a=typeof a=="object"?
a:{};var b=a.expires?";expires="+a.expires.toUTCString():"",e=a.path?";path="+a.path:"",d=a.domain?";domain="+a.domain:"",f=a.secure?";secure":"",g=s(rangy.getSelection(c));c.document.cookie=encodeURIComponent("rangySerializedSelection")+"="+encodeURIComponent(g)+b+e+d+f};h.getElementChecksum=j});