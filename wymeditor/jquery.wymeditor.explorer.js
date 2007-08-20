/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (C) 2007 H.O.net - http://www.honet.be/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *        http://www.wymeditor.org/
 *
 * File Name:
 *        jquery.wymeditor.explorer.js
 *        MSIE specific class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne@wymeditor.org)
 *        Bermi Ferrer (wymeditor a-t bermi dotorg)
 *        Frédéric Palluel-Lafleur (fpalluel@gmail.com)
 *        Volker Mische (vmx@gmx.de)
 */

function WymClassExplorer(wym) {
    
    this._wym = wym;
    this._class = "className";
    this._newLine = "\r\n";
};

WymClassExplorer.prototype.initIframe = function(iframe) {

    //This function is executed twice, though it is called once!
    //But MSIE needs that, otherwise designMode won't work.
    //Weird.
    
    this._iframe = iframe;
    this._doc = iframe.contentWindow.document;
    
    //add css rules from options
    var styles = this._doc.styleSheets[0];
    var aCss = eval(this._options.editorStyles);

    this.addCssRules(this._doc, aCss);

    this._doc.title = this._wym._index;
    
    //init html value
    $j(this._doc.body).html(this._wym._html);
    
    //handle events
    var wym = this;
    
    this._doc.body.onfocus = function()
      {wym._doc.designMode = "on"; wym._doc = iframe.contentWindow.document;};
    this._doc.onbeforedeactivate = function() {wym.saveCaret();};
    this._doc.onkeyup = function() {
      wym.saveCaret();
      wym.keyup();
    };
    this._doc.onclick = function() {wym.saveCaret();};
    
    this._doc.body.onbeforepaste = function() {
      wym._iframe.contentWindow.event.returnValue = false;
    };
    
    this._doc.body.onpaste = function() {
      wym._iframe.contentWindow.event.returnValue = false;
      wym.paste(window.clipboardData.getData("Text"));
    };
    
    //callback can't be executed twice, so we check
    if(this._initialized) {
      
      //pre-bind functions
      if($j.isFunction(this._options.preBind)) this._options.preBind(this);
      
      //bind external events
      this._wym.bindEvents();
      
      // NOTE v.mische this part will be changed on event-hacking
      $j(this._doc).bind("keydown", this.handleKeydown);
    

      //post-init functions
      if($j.isFunction(this._options.postInit)) this._options.postInit(this);
      
      //add event listeners to doc elements, e.g. images
      this.listen();
    }
    
    this._initialized = true;
    
    //init designMode
    this._doc.designMode="on";
    this._doc = iframe.contentWindow.document;
};

WymClassExplorer.prototype._exec = function(cmd,param) {

    switch(cmd) {
    
    case WYM_INDENT: case WYM_OUTDENT:
    
        var container = this.findUp(this.container(), WYM_LI);
        if(container)
            this._doc.execCommand(cmd);
    break;
    default:
        if(param) this._doc.execCommand(cmd,false,param);
        else this._doc.execCommand(cmd);
    break;
	}
    
    this.listen();
};

WymClassExplorer.prototype.selected = function() {

    var caretPos = this._iframe.contentWindow.document.caretPos;
        if(caretPos!=null) {
            if(caretPos.parentElement!=undefined)
              return(caretPos.parentElement());
        }
};

WymClassExplorer.prototype.saveCaret = function() {

    this._doc.caretPos = this._doc.selection.createRange();
};

WymClassExplorer.prototype.addCssRule = function(styles, oCss) {

    styles.addRule(oCss.name, oCss.css);
};

//keyup handler
WymClassExplorer.prototype.keyup = function() {
  this._selected_image = null;
};


WymClassExplorer.prototype.setFocusToNode = function(node) {
    var range = this._doc.selection.createRange();
    range.moveToElementText(node);
    range.collapse(false);
    range.move('character',-1);
    range.select();
    node.focus();
};
WymClassExplorer.prototype.handleKeydown = function(evt) {
  
  //'this' is the doc
  var wym = WYM_INSTANCES[this.title];
  
  // "start" Selection API
  var sel = wym.selection.getSelection();

/*
    // some small tests for the Selection API
    var containers = WYM_MAIN_CONTAINERS.join(",");
    if (sel.isAtStart(containers))
        alert("isAtStart: "+sel.startNode.parentNode.nodeName);
    if (sel.isAtEnd(containers))
        alert("isAtEnd: "+sel.endNode.parentNode.nodeName);
    if (evt.keyCode==WYM_KEY.DELETE) {
        // if deleteIfExpanded wouldn't work, no selected text would be
        // deleted if you press del-key
        if (sel.deleteIfExpanded())
            return false;
    }
    if (evt.keyCode==WYM_KEY.HOME) {
        // if cursorToStart won't work, the cursor won't be set to start
        // if you press home-key
        sel.cursorToStart(sel.container);
        return false;
    }
    if (evt.keyCode==WYM_KEY.END)
    {
        // if cursorToEnd won't work, the cursor won't be set to the end
        // if you press end-key
        sel.cursorToEnd(sel.container);
        return false;
    }
*/
};

/********** SELECTION API **********/
/*
Class: WymSelExplorer
    Implementation of the Selection API for Microsoft Internet Explorer

Properties:
    original    - (object) Selection Object
    isCollapsed - (boolean) True if selection is collapsed to single position
    startNode   - (DOM node) Node where the selection starts
    startOffset - (integer) Offset of the position in startNode
    endNode     - (DOM node) Node where the selection ends
    endOffset   - (integer) Offset of the position in endNode
    container   - (DOM node) Node which includes the whole selection

Example:
    "|" marks the start and the end of the selection.
    (start code)
    <p>A <b>sm|all</b> examp|le.</p>
    (end code)

    isCollapsed - false
    startNode   - "small"
    startOffset - 2
    endNode     - " example"
    endOffset   - 6
    container   - <p>...</p>
*/
var WymSelExplorer = function(wym) {
    this._wym = wym;
};


WymSelExplorer.prototype = {
    /*
    Property: getSelection
        Return a Selection API object

    Example:
        (start code)
        var sel = wym.selection.getSelection();
        (end code)

    Returns:
        (object) Selection API object
    */
    getSelection: function() {
        var sel = this._wym._iframe.contentWindow.document.selection;
        var range = sel.createRange();

        this.original = sel;

        if (sel.type == "None")
            this.isCollapsed = true;
        else
            this.isCollapsed = false;

        // get start of the selection (resp. cursor position if collapsed)
        var selStart = this._getNodeAndOffset(range.duplicate(), true);
        this.startNode = selStart.node;
        this.startOffset = selStart.offset;

        if (this.isCollapsed) {
            this.endNode = this.startNode;
            this.endOffset = this.startOffset;
        }
        else {
            var selEnd = this._getNodeAndOffset(range.duplicate(), false);
            this.endNode = selEnd.node;
            this.endOffset = selEnd.offset;
        }

        this.container = $j(range.parentElement()).parentsOrSelf(
                WYM_MAIN_CONTAINERS.join(","))[0];

        return this;
    },


    _getNodeAndOffset: function(range, collapseToStart) {
        var parentElement = range.parentElement();

        // range from the beginning of parentElement to cursor position
        var parentRange = range.duplicate();

        // length of parentElement's text
        var parentLength;

        // offset from the beginning of parentElements to the cursor position
        var parentOffset = 0;

        // offset of the position to its node
        var offset = 0;

        // collapse to start or end
        range.collapse(collapseToStart);
        // select parent node and set range from the beginning of that node to
        // the cursor position
        parentRange.moveToElementText(parentElement);
        parentLength = parentRange.text.length;

        parentRange.setEndPoint("EndToStart", range);
        parentOffset = parentRange.text.length;

        // direction to search
        //  1 = forward
        // -1 = backward
        var direction = 1;

        // where to start to find the position
        var childPosition = 0;

        // ratio of the cursor position to the total parentElement text length
        var offsetRatio = parentOffset/parentLength;

        // position of the cursor within its node
        var offset = 0;

        var childNodes = parentElement.childNodes;

        // try to find a better start position for searching
        if (childNodes.length>20 && offsetRatio>0.1) {
            // range around the appropriate node 
            var childRange = parentRange.duplicate();
            // length from start to the beginning of a node near the node
            // of the position we are looking for
            var childOffsetRange = parentRange.duplicate();

            childPosition = Math.round(offsetRatio * childNodes.length-1);

            // moveToElementText doesn't work with text nodes
            if (childNodes[childPosition].nodeType == WYM_NODE.TEXT)
                childPosition--;

            childRange.moveToElementText(childNodes[childPosition]);
            childOffsetRange.setEndPoint("EndToStart", childRange);

            // search forward
            if (parentOffset >= childOffsetRange.text.length) {
                direction = 1;
                offset = childOffsetRange.text.length;
            }
            // search backwards
            else {
                direction = -1;
                offset = parentLength - (childOffsetRange.text.length + 
                        this._getTextLength(childNodes[childPosition]));
            }
        }

        var node=parentElement.childNodes[childPosition];
        if (direction==1) {
            // text length of the current node
            var nodeLength = 0;
            var prevNode = node;
			// count <br>s
            var br = 0;

            while (offset < parentOffset) {
                nodeLength = this._getTextLength(node);

                offset += nodeLength;
                if (prevNode.nodeName == "BR") {
                    br++;
                    // <br>s are 2 characters "long"
                    offset +=2;
                    //nodeLength += 2;
                }
                prevNode = node;

                if (node.nextSibling)
                    node = node.nextSibling
                else
                    break;

            }
            offset = parentOffset - (offset - nodeLength);

            // with range.text.legth we can't determine if the cursor is in
            // front or behind a (several) <br>, as they have length==0.
            // The range.htmlText.length value needs to be used
            if (node.nodeName == "BR") {
                var tmpRange = parentRange.duplicate();
                tmpRange.collapse(true);
                tmpRange.moveEnd("character", parentOffset-br);
                // previous node was a <br> (or some <br>s)
                if (tmpRange.htmlText.length<parentRange.htmlText.length) {
                    prevNode = node.nextSibling;
                    while (prevNode.nodeName == "BR" && prevNode.nextSibling)
                        prevNode = prevNode.nextSibling;
                    offset = 0;
                }
            }

            node = prevNode;
        }
        // go backwards
        else {
            while(parentLength - offset > parentOffset && node) {
                offset += this._getTextLength(node);
                node=node.previousSibling;
            }

            // calculate the offset from start to the "end" of the previous node
            // node is the previousSibling o of the cursor position node
            if (node.nodeType == WYM_NODE.TEXT) {
                var nextNode = node.nextSibling;
                if (nextNode) {
                    childRange.moveToElementText(nextNode);
                    childOffsetRange.setEndPoint("EndToStart", childRange);
                }
                else 
                    childOffsetRange.collapse(true);
            }
            else {
                childRange.moveToElementText(node);
                childOffsetRange.setEndPoint("EndToEnd", childRange);
            }

            offset = parentOffset - childOffsetRange.text.length;
            node = node.previousSibling;
        }

        return {'node': node, 'offset': offset};
    },

    /*
    Property: _getTextLength
        Get the length of the text of a DOM node.

    Arguments:
        node - (DOM node) [required] The node you what to know the length of.

    Example:
        (start code)
        var node = document.createTextNode("foo");
        _getTextLength(node) // returns 3
        (end code)

    Returns:
        (int) Length of a DOM node.
    */
    _getTextLength: function(node) {
        if (node.nodeType == WYM_NODE.ELEMENT)
            return node.innerText.length;
        else if (node.nodeType == WYM_NODE.TEXT)
            return node.data.length;
    }
};


