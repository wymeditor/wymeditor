/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (C) 2007 H.O.net - http:// www.honet.be/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *        http:// www.wymeditor.org/
 *
 * File Name:
 *        jquery.wymeditor.safari.js
 *        Safari specific class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne@wymeditor.org)
 *        Volker Mische (vmx@gmx.de)
 *        Bermi Ferrer (wymeditor a-t bermi dotorg)
 *        Frédéric Palluel-Lafleur (fpalluel@gmail.com)
 *        Scott Lewis (lewiscot@gmail.com)
 */

var WYM_UNLINK           = "Unlink";

function WymClassSafari(wym) {
    this._wym = wym;
    this._class = "class";
    this._newLine = "\n";
    wym._options.updateEvent = "mousedown";
};

WymClassSafari.prototype.initIframe = function(iframe) {

    this._iframe = iframe;
    this._doc = iframe.contentDocument;
    
    // this._doc.execCommand('useCSS', false);
    
    // add css rules from options
    
    var styles = this._doc.styleSheets[0];    
    var aCss = eval(this._options.editorStyles);
    
    this.addCssRules(this._doc, aCss);

    this._doc.title = this._wym._index;
    
    // init html value
    this.html(this._wym._html);
    
    // init designMode
    this.enableDesignMode();
    
    // pre-bind functions
    if($j.isFunction(this._options.preBind)) this._options.preBind(this);
    
    $j(this._doc).bind("dblclick", this.dblclick);
    
    // bind external events
    this._wym.bindEvents();
    
    // bind editor keydown events
    $j(this._doc).bind("keydown", this.keydown);
    
    // bind editor keyup events
    $j(this._doc).bind("keyup", this.keyup);
    
    // bind editor focus events (used to reset designmode - Gecko bug)
    $j(this._doc).bind("focus", this.enableDesignMode);
    
    // post-init functions
    if($j.isFunction(this._options.postInit)) this._options.postInit(this);
    
    // add event listeners to doc elements, e.g. images
    this.listen();
    
    _test(function() {alert(1);});
};

/* @name html
 * @description Get/Set the html value
 */
WymClassSafari.prototype.html = function(html) {

  if(html) {
  
    // disable designMode
    this._doc.designMode = "off";
    
    // replace em by i and strong by bold
    // (designMode issue)
    html = html.replace(/<em([^>]*)>/gi, "<i$1>")
      .replace(/<\/em>/gi, "</i>")
      .replace(/<strong([^>]*)>/gi, "<b$1>")
      .replace(/<\/strong>/gi, "</b>");
    
    // update the html body
    $j(this._doc.body).html(html);
    
    // re-init designMode
    this.enableDesignMode();
  }
  else return($j(this._doc.body).html());
};

WymClassSafari.prototype._exec = function(cmd, param) {

    var focusNode = this.selected();    
    var sel = this.selection.getSelection();

    if (sel.anchorNode)
    {
        var anchorNode = sel.anchorNode;
        if(anchorNode.nodeName == "#text") anchorNode = anchorNode.parentNode;
    }
    
    if (focusNode && focusNode.nodeName.toLowerCase() == WYM_BR)
    {
       var _newFocusNode = focusNode.parentNode;
       $j(focusNode).remove();
       focusNode = _newFocusNode;
    }

    switch(cmd) {
    
        case WYM_INDENT:
            this.Outdent(focusNode, param);
            break;
            
        case WYM_OUTDENT:
            this.Indent(focusNode, param);
        break;
        
        case WYM_OUTDENT:
            this.Indent(focusNode, param);
            break;
        
        case WYM_INDENT:
            this.Indent(focusNode, param);
            break;
        
        case WYM_CREATE_LINK:
            this.CreateLink(focusNode, param);
            break;
        
        case WYM_UNLINK:
            this.Unlink(focusNode, param);
            break;
        
        case WYM_INSERT_IMAGE:
            this.InsertImage(focusNode, param);
            break;
    
        default:
    
            if(param) this._doc.execCommand(cmd,'',param);
            else this._doc.execCommand(cmd,'',null);
    }
    
    // set to P if parent = BODY
    var container = this.selected();
    if(container && container.tagName.toLowerCase() == WYM_BODY)
        this._exec(WYM_FORMAT_BLOCK, WYM_P);
    
    // add event handlers on doc elements

    this.listen();
};

WymClassSafari.prototype.InsertImage = function(focusNode, param) {
    if (!focusNode)
    {
        focusNode = this.selection.newNode();
    }
    if (focusNode.nodeName.toLowerCase() == WYM_IMG)
    {
        $j(focusNode).attr({"src": param});
    }
    else
    {
        var opts = {src: param};
        $j(focusNode).append(
            this.helper.tag('img', opts)
        );
    }
}

/* @name selected
 * @description Returns the selected container
 */
WymClassSafari.prototype.selected = function() {
    
    var sel = this._iframe.contentWindow.getSelection();
    
    var node = false;
    if (sel.focusNode)
    {
        node = sel.focusNode;
    }
    if(node) {
        if(node.nodeName == "#text") return(node.parentNode);
        else return(node);
    } else return(null); // this._iframe.contentDocument.body);
};

WymClassSafari.prototype.addCssRule = function(styles, oCss) {

    styles.insertRule(oCss.name + " {" + oCss.css + "}",
        styles.cssRules.length);
};

// keydown handler, mainly used for keyboard shortcuts
WymClassSafari.prototype.keydown = function(evt) {
  
  // 'this' is the doc
  var wym = WYM_INSTANCES[this.title];
  
  //  "start" Selection API
  var sel = wym.selection.getSelection();

/*
    //  some small tests for the Selection API
    var containers = WYM_MAIN_CONTAINERS.join(",");
    if (sel.isAtStart(containers))
        alert("isAtStart: "+sel.startNode.parentNode.nodeName);
    if (sel.isAtEnd(containers))
        alert("isAtEnd: "+sel.endNode.parentNode.nodeName);
    if (evt.keyCode==WYM_KEY.DELETE) {
        //  if deleteIfExpanded wouldn't work, no selected text would be
        //  deleted if you press del-key
        if (sel.deleteIfExpanded())
            return false;
    }
    if (evt.keyCode==WYM_KEY.HOME) {
        //  if cursorToStart won't work, the cursor won't be set to start
        //  if you press home-key
        sel.cursorToStart(sel.container);
        return false;
    }
    if (evt.keyCode==WYM_KEY.END)
    {
        //  if cursorToEnd won't work, the cursor won't be set to the end
        //  if you press end-key
        sel.cursorToEnd(sel.container);
        return false;
    }
*/


  if(evt.ctrlKey){
    if(evt.keyCode == 66){
      // CTRL+b => STRONG
      wym._exec(WYM_BOLD);
      return false;
    }
    if(evt.keyCode == 73){
      // CTRL+i => EMPHASIS
      wym._exec(WYM_ITALIC);
      return false;
    }
  }
};

// keyup handler, mainly used for cleanups
WymClassSafari.prototype.keyup = function(evt) {

  // 'this' is the doc
  var wym = WYM_INSTANCES[this.title];
  
  wym._selected_image = null;

  if(evt.keyCode == 13 && !evt.shiftKey) {
  
    // RETURN key
    // cleanup <br><br> between paragraphs
    $j(wym._doc.body).children(WYM_BR).remove();
  }
  
  else if(evt.keyCode != 8
       && evt.keyCode != 17
       && evt.keyCode != 46
       && evt.keyCode != 224
       && !evt.metaKey
       && !evt.ctrlKey) {
      
    // NOT BACKSPACE, NOT DELETE, NOT CTRL, NOT COMMAND
    // text nodes replaced by P
    
    var container = wym.selected();
    var name = container.tagName.toLowerCase();

    // fix forbidden main containers
    if(
      name == "strong" ||
      name == "b" ||
      name == "em" ||
      name == "i" ||
      name == "sub" ||
      name == "sup" ||
      name == "a"

   ) name = container.parentNode.tagName.toLowerCase();

    if(name == WYM_BODY) wym._exec(WYM_FORMAT_BLOCK, WYM_P);
  }
};

WymClassSafari.prototype.enableDesignMode = function() {
    
    if(this._doc.designMode == "off") {
      try {
        this._doc.designMode = "on";
        this._doc.execCommand("styleWithCSS", '', false);
      } catch(e) { }
    }
};

WymClassSafari.prototype.setFocusToNode = function(node) {
    var range = document.createRange();
    range.selectNode(node);
    var selected = this._iframe.contentWindow.getSelection();
    selected.addRange(range);
    selected.collapse(node, node.childNodes.length);
    this._iframe.contentWindow.focus();
};

WymClassSafari.prototype.openBlockTag = function(tag, attributes)
{
  var attributes = this.validator.getValidTagAttributes(tag, attributes);

  //  Handle Safari styled spans
  if(tag == 'span' && attributes.style){
    var new_tag = this.getTagForStyle(attributes.style);
    if(new_tag){
      this._tag_stack.pop();
      var tag = new_tag;
      this._tag_stack.push(new_tag);
      attributes.style = '';
    }else{
      return;
    }
  }
  
  if(tag != 'li' && (tag == 'ul' || tag == 'ol') && this.last_tag && !this.last_tag_opened && this.last_tag == 'li'){
    this.output = this.output.replace(/<\/li>$/, '');
    this.insertContentAfterClosingTag(tag, '</li>');
  }
  
  this.output += this.helper.tag(tag, attributes, true);
};

WymClassSafari.prototype.closeBlockTag = function(tag)
{
  this.output = this.output.replace(/<br \/>$/, '')+this._getClosingTagContent('before', tag)+"</"+tag+">"+this._getClosingTagContent('after', tag);
};

WymClassSafari.prototype.getTagForStyle = function(style) {

  if(/bold/.test(style)) return 'strong';
  if(/italic/.test(style)) return 'em';
  if(/sub/.test(style)) return 'sub';
  if(/sub/.test(style)) return 'super';
  return false;
};


/********** SELECTION API **********/

function WymSelSafari(wym) {
    this._wym = wym;
};

WymClassSafari.prototype.dblclick = function(evt) {
   window.isDblClick = true;
};

WymSelSafari.prototype = {
    getSelection: function() {
        var _sel = this._wym._iframe.contentWindow.getSelection();
        var range = this._getRange();

        this.startNode   = this._startNode(_sel, range);
        this.endNode     = this._endNode(_sel, range);
        this.startOffset = range.startOffset;
        this.endOffset   = range.endOffset;
        this.length      = new String(_sel).length;
        
        this.isCollapsed = _sel.isCollapsed;
        this.original    = _sel;
        this.container   = $j(this.startNode).parentsOrSelf(WYM_MAIN_CONTAINERS.join(","))[0];
        
        return this;
    },
    
    newNode: function() {
        var _id = this._wym.uniqueStamp();
        $j(this._wym._iframe.contentDocument.body).append('<p id="' + _id + '"></p>');
        return this._wym._iframe.contentDocument.getElementById(_id);
    },
    
    _getRange: function()
    {
        return this._wym._iframe.contentDocument.createRange();
        return range;
    },
    
    _startNode: function(_sel, range) {
        var node;
        if (_sel.baseNode && _sel.basNode == "#text")
        {
            node = _sel.baseNode.parentNode;
        }
        if (_sel.baseNode)
        {
            node = _sel.baseNode;
        }
        else
        {
            node = range.startNode;
        }
        return node;
    },
    
    _endNode: function(_sel, range) {
        var node;
        if (_sel.focusNode && _sel.focusNode == "#text")
        {
            node = _sel.focusNode.parentNode;
        }
        if (_sel.focusNode)
        {
            node = _sel.focusNode;
        }
        else
        {
            node = range.endNode;
        }
        return node;
    },
    
    cursorToStart: function(jqexpr) {
        if (jqexpr.nodeType == WYM_NODE.TEXT)
            jqexpr = jqexpr.parentNode;

        var firstTextNode = $(jqexpr)[0];

        while (firstTextNode.nodeType!=WYM_NODE.TEXT) {
            if (!firstTextNode.hasChildNodes())
                break;
            firstTextNode = firstTextNode.firstChild;
        }

        if (isPhantomNode(firstTextNode))
            firstTextNode = firstTextNode.nextSibling;

        //  e.g. an <img/>
        if (firstTextNode.nodeType == WYM_NODE.ELEMENT)
            this.original.collapse(firstTextNode.parentNode, 0);
        else
            this.original.collapse(firstTextNode, 0);
    },

    cursorToEnd: function(jqexpr) {
        if (jqexpr.nodeType == WYM_NODE.TEXT)
            jqexpr = jqexpr.parentNode;

        var lastTextNode = $(jqexpr)[0];

        while (lastTextNode.nodeType!=WYM_NODE.TEXT) {
            if (!lastTextNode.hasChildNodes())
                break;
            lastTextNode = lastTextNode.lastChild;
        }

        if (isPhantomNode(lastTextNode))
            lastTextNode = lastTextNode.previousSibling;

        //  e.g. an <img/>
        if (lastTextNode.nodeType == WYM_NODE.ELEMENT)
            this.original.collapse(lastTextNode.parentNode,
                lastTextNode.parentNode.childNodes.length);
        else
            this.original.collapse(lastTextNode, lastTextNode.length);
    },

    deleteIfExpanded: function() {
        if(!this.original.isCollapsed) {
            this.original.deleteFromDocument();
            return true;
        }
        return false;
    }
};

WymClassSafari.prototype.bindEvents = function() {

  // copy the instance
  var wym = this;
  
  // handle click event on tools buttons
  $j(this._box).find(this._options.toolSelector).mousedown(function() {
    wym.exec($j(this).attr(WYM_NAME));
    return(false);
  });
  
  // handle click event on containers buttons
  $j(this._box).find(this._options.containerSelector).mousedown(function() {
    wym.container($j(this).attr(WYM_NAME));
    return(false);
  });
  
  // handle keyup event on html value: set the editor value
  $j(this._box).find(this._options.htmlValSelector).keyup(function() {
    $j(wym._doc.body).html($j(this).val());
    // $j(wym._doc.body).html(wym.addWymHacksForEditMode($j(this).val()));
  });
  
  // handle click event on classes buttons
  $j(this._box).find(this._options.classSelector).mousedown(function() {
  
    var aClasses = eval(wym._options.classesItems);
    var sName = $j(this).attr(WYM_NAME);
    
    var oClass = aClasses.findByName(sName);
    
    if(oClass) {
      jqexpr = oClass.expr;
      wym.toggleClass(sName, jqexpr);
    }
    return(false);
  });
  
  // handle event on update element
  $j(this._options.updateSelector)
    .bind(this._options.updateEvent, function() {
      wym.update();
  });
};

Wymeditor.prototype.toggleHtml = function() {
  var html = this.xhtml();
  $j(this._element).val(html);
  $j(this._box).find(this._options.htmlSelector).toggle();
  $j(this._box).find(this._options.htmlValSelector).val(html);
};

_debug = function(obj)
{
    win2 = window.open();
    win2.document.write("<pre>");
    for (key in obj)
    {
      win2.document.write(key + ": " + obj[key]);
    }
    win2.document.write("</pre>");
    win2.document.close();
};

_test = function(callback) {
    $j(document.body).append(
        "<p><a href=\"#\" id=\"btn-test\">Test</a></p>"
    );
    $j("#btn-test").click(callback);
};

var canExec = [
    'BackColor',
    'Bold',
    'Copy',
    'Cut',
    'Delete',
    'FontName',
    'FontSize',
    'FontSizeDelta',
    'ForeColor',
    'ForwardDelete',
    'InsertLineBreak',
    'InsertParagraph',
    'InsertText',
    'Italic',
    'JustifyCenter',
    'JustifyFull',
    'JustifyLeft',
    'JustifyNone',
    'JustifyRight',
    'Paste',
    'PasteAndMatchStyle',
    'Print',
    'Redo',
    'SelectAll',
    'Subscript',
    'Superscript',
    'Underline',
    'Undo',
    'Unselect'
];

WymClassSafari.prototype.isNative = function(cmd)
{
    for (i=0; i<canExec.length; i++)
    {
        if (cmd.toLowerCase() == canExec[i].toLowerCase())
        {
            return true;
        }
    }
    return false;
};


// Bermi's Functions

// This is a workarround for select iframe safari bug

WymClassSafari.prototype.addWymHacksForEditMode = function(xhtml) {
    return 
    '<span id="wym_safari_select_all_hack" ' 
    + 'style="height:0.01em;position:absolute;margin-top:-50px;">safari-hack</span>'+xhtml;
}

WymClassSafari.prototype.removeWymAttributesFromXhtml = function(xhtml) {
  return xhtml.replace(/<span id="wym_safari_select_all_hack"[^>]*>safari-hack<\/span>/, '');
}

WymClassSafari.prototype.removeSafarihacks = function(raw_html){
  if(true || $j.browser.version < 10000){
    raw_html = raw_html.replace(this.hackChar,'');
  }
  return raw_html;
}

WymClassSafari.prototype.beforeParsing = function(raw)
{
  this.output = '';
  return this.removeSafarihacks(raw).
  // Remove safari place holders
  replace(/([^>]*)<(\w+)><BR class\="khtml-block-placeholder"><\/\2>([^<]*)/g, "<$2>$1$3</$2>");
}

WymClassSafari.prototype.selectAll = function(param) {
  this.currentSelection.setBaseAndExtent(this._doc.body, 0, w._doc.body, w._doc.body.length);
}

WymClassSafari.prototype.update = function() {
  var html = this.xhtml();
  var _html = this.removeWymAttributesFromXhtml(html);
  $j(this._element).val(_html);
  $j(this._box).find(this._options.htmlValSelector).val(_html);
};

WymClassSafari.prototype.Indent = function(focusNode, param) {
    var focusNode = this.selected();    
    var sel = this._iframe.contentWindow.getSelection();
    
    if (sel.anchorNode)
    {
        var anchorNode = sel.anchorNode;
        if(anchorNode.nodeName == "#text") anchorNode = anchorNode.parentNode;
    }
    
    focusNode = this.findUp(focusNode, WYM_BLOCKS);
    anchorNode = this.findUp(anchorNode, WYM_BLOCKS);
    
    if(focusNode && focusNode == anchorNode
      && focusNode.tagName.toLowerCase() == WYM_LI) {

        var ancestor = focusNode.parentNode.parentNode;

        if(focusNode.parentNode.childNodes.length>1
          || ancestor.tagName.toLowerCase() == WYM_OL
          || ancestor.tagName.toLowerCase() == WYM_UL)
            this._doc.execCommand(cmd,'',null);
    }
}

WymClassSafari.prototype.Outdent = function(focusNode, param) {
    var focusNode = this.selected();    
    var sel = this._iframe.contentWindow.getSelection();
    
    if (sel.anchorNode)
    {
        var anchorNode = sel.anchorNode;
        if(anchorNode.nodeName == "#text") anchorNode = anchorNode.parentNode;
    }
    focusNode = this.findUp(focusNode, WYM_BLOCKS);
    anchorNode = this.findUp(anchorNode, WYM_BLOCKS);
    
    if(focusNode && focusNode == anchorNode
      && focusNode.tagName.toLowerCase() == WYM_LI) {

        var ancestor = focusNode.parentNode.parentNode;

        if(focusNode.parentNode.childNodes.length>1
          || ancestor.tagName.toLowerCase() == WYM_OL
          || ancestor.tagName.toLowerCase() == WYM_UL)
            this._doc.execCommand(cmd,'',null);
    }
}

WymClassSafari.prototype.Unlink = function(focusNode, param) {
    alert('Unlink');
}

WymClassSafari.prototype.CreateLink = function(focusNode, param) {
    alert('CreateLink');
}

WymClassSafari.prototype._InsertList = function(param, type) {
  var selected = this.selected();
  var contents = selected.innerHTML;
  
  // Last list item
  if(selected.tagName == 'LI' && selected.parentNode && selected.nextSibling == undefined) {
    this.insertTagAfter(this.deleteSelectedNode(), 'p', contents);
  
    // First list item
    } else if(selected.tagName == 'LI' && selected.parentNode && selected.previousSibling == undefined){
      var parent = selected.parentNode;
    this.deleteNode(selected);
    this.insertTagBefore(parent, 'p', contents);
    
    // inline list item
    } else if(selected.tagName == 'LI' && selected.parentNode){
      var parent = selected.parentNode;
      var before = '';
      var after = false;
      for(var i = 0; i < parent.childNodes.length; i++) {
        if(after === false){
          if(parent.childNodes[i] == selected){
            after = '';
          }else{
            before += parent.childNodes[i].outerHTML;
          }
        } else{
          after += parent.childNodes[i].outerHTML;
        }
      }
            
      $(parent).before(this.helper.contentTag(parent.tagName, before));
      var p_details = this.generateContentTagWithId('p', contents);
      $(parent).before(p_details.content);
      var p = this.getById(p_details.id);
      $(parent).before(this.helper.contentTag(parent.tagName, after));
      $(parent).remove();
      this.focusNode(p,1,1);
      
  // On a paragraph
  } else if(selected.tagName == 'P'){
    this.replaceTagWith(selected, type+'+li', contents);
  }
}

WymClassSafari.prototype.handleEnter = function(evt){
  var selected = this.selected();
  if(true || $j.browser.version < 10000){    
    
    if(evt.shiftKey){
      if(!this.selectedHtml && this.selectedText == selected.innerHTML){
        selected.innerHTML = this.emptyChar()+'<br />'+this.emptyChar();
      }
      return false;
    }
    this.handleEnterOnListItem(selected);
   
  }
  return true;
}

WymClassSafari.prototype.handleBackspace = function(){
  var selected = this.selected();
  if(true || $j.browser.version < 10000){
    if(selected.tagName == 'P' && selected.innerHTML == ''){
      // Todo: move caret to the end of previous sibling
      var parent = selected.parentNode;
      parent.removeChild(selected);
    }
  }
  return true;
}

WymClassSafari.prototype.handleEnterOnListItem = function(selected)
{
  if(selected.tagName == 'LI' && selected.parentNode){
    // If we access the text on the right of current carret a new list item will be added
    if((this.isCollapsed && selected.innerHTML && this.selectionCopy.d ? 
        selected.innerHTML.substring(this.selectionCopy.d) : '') == ''){
      // remove the last empty list item and insert a new paragraph
      if(selected.innerHTML.trim() == ''){
        this.insertTagAfter(this.deleteSelectedNode(), 'p', '');
      // New list item
      }else if (this.isCollapsed){
        this.insertTagAfter(selected, 'li', '');

      // we are selecting all the text in a list item
      }else if(this.selectedText == selected.innerHTML || selected.innerHTML == this.selectedHtml){

        if(selected.nextSibling == undefined){ // last item
          this.insertTagAfter(this.deleteSelectedNode(), 'p', '');
        }else{
          this.insertTagAfter(this.deleteContents(selected), 'li', '');
        }
      }else{
        // New list item
        var selectedText = this.selectedHtml || this.selectedText;
        // selecting text up to the end
        if(this.selectionCopy.b+selectedText.length == selected.innerHTML.length){
            this.removeSelection();
            // replace the HTML with the left of the selection
            selected.innerHTML = selected.innerHTML.substring(0,this.selectionCopy.b);
            this.insertTagAfter(selected, 'li', '');
        }

      }
    }
  }
}
