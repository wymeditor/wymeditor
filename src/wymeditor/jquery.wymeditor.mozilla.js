/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (c) 2005 - 2009 Jean-Francois Hovinne, http://www.wymeditor.org/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *        http://www.wymeditor.org/
 *
 * File Name:
 *        jquery.wymeditor.mozilla.js
 *        Gecko specific class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne a-t wymeditor dotorg)
 *        Volker Mische (vmx a-t gmx dotde)
 *        Bermi Ferrer (wymeditor a-t bermi dotorg)
 *        Frédéric Palluel-Lafleur (fpalluel a-t gmail dotcom)
 *        Jonatan Lundin (jonatan.lundin a-t gmail dotcom)
 */

WYMeditor.WymClassMozilla = function(wym) {

    this._wym = wym;
    this._class = "class";
    this._newLine = "\n";
};

// Placeholder cell to allow content in TD cells for FF 3.5+
WYMeditor.WymClassMozilla.CELL_PLACEHOLDER = '<br _moz_dirty="">';
// Holds a top-level spot for inserting content
WYMeditor.WymClassExplorer.PLACEHOLDER_NODE = '<br _moz_editor_bogus_node="TRUE" _moz_dirty="">';

// Firefox 3.5 and 3.6 require the CELL_PLACEHOLDER and 4.0 doesn't
WYMeditor.WymClassMozilla.NEEDS_CELL_FIX = $.browser.version >= '1.9.1'
    && $.browser.version < '2.0';

WYMeditor.WymClassMozilla.prototype.initIframe = function(iframe) {
    var wym = this;

    this._iframe = iframe;
    this._doc = iframe.contentDocument;

    //add css rules from options
    var styles = this._doc.styleSheets[0];

    var aCss = eval(this._options.editorStyles);

    this.addCssRules(this._doc, aCss);

    this._doc.title = this._wym._index;

    //set the text direction
    jQuery('html', this._doc).attr('dir', this._options.direction);

    //init html value
    this.html(this._wym._html);

    //init designMode
    this.enableDesignMode();

    //pre-bind functions
    if(jQuery.isFunction(this._options.preBind)) this._options.preBind(this);

    //bind external events
    this._wym.bindEvents();

    //bind editor keydown events
    jQuery(this._doc).bind("keydown", this.keydown);

    //bind editor keyup events
    jQuery(this._doc).bind("keyup", this.keyup);

    //bind editor click events
    jQuery(this._doc).bind("click", this.click);

    //bind editor focus events (used to reset designmode - Gecko bug)
    jQuery(this._doc).bind("focus", function () {
        // Fix scope
        wym.enableDesignMode.call(wym);
    });

    //post-init functions
    if(jQuery.isFunction(this._options.postInit)) this._options.postInit(this);

    //add event listeners to doc elements, e.g. images
    this.listen();
};

/* @name html
 * @description Get/Set the html value
 */
WYMeditor.WymClassMozilla.prototype.html = function(html) {
    if (typeof html === 'string') {
        //disable designMode
        try {
            this._doc.designMode = "off";
        } catch(e) {
            //do nothing
        }

        //replace em by i and strong by bold
        //(designMode issue)
        html = html.replace(/<em(\b[^>]*)>/gi, "<i$1>");
        html = html.replace(/<\/em>/gi, "</i>");
        html = html.replace(/<strong(\b[^>]*)>/gi, "<b$1>");
        html = html.replace(/<\/strong>/gi, "</b>");

        //update the html body
        jQuery(this._doc.body).html(html);
        this._wym.fixBodyHtml();

        //re-init designMode
        this.enableDesignMode();
    }
    else {
        return jQuery(this._doc.body).html();
    }
    return false;
};

WYMeditor.WymClassMozilla.prototype._exec = function(cmd,param) {

    if(!this.selected()) {
        return false;
    }

    switch(cmd) {

    case WYMeditor.INDENT:
        this.indent();
        break;

    case WYMeditor.OUTDENT:
        this.outdent();
        break;

    default:

        if (param) {
            this._doc.execCommand(cmd, '', param);
        } else {
            this._doc.execCommand(cmd, '', null);
        }
        break;
    }

    //set to P if parent = BODY
    var container = this.selected();
    if (container.tagName.toLowerCase() == WYMeditor.BODY) {
        this._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);
    }

    return true;
};

/* @name selected
    * @description Returns the selected container
    */
WYMeditor.WymClassMozilla.prototype.selected = function() {

    var sel = this._iframe.contentWindow.getSelection();
    var node = sel.focusNode;
    if (node) {
        if (node.nodeName == "#text") {
            return(node.parentNode);
        } else {
            return node;
        }
    } else {
        return null;
    }
};

WYMeditor.WymClassMozilla.prototype.addCssRule = function(styles, oCss) {

    styles.insertRule(oCss.name + " {" + oCss.css + "}",
        styles.cssRules.length);
};


//keydown handler, mainly used for keyboard shortcuts
WYMeditor.WymClassMozilla.prototype.keydown = function(evt) {

    //'this' is the doc
    var wym = WYMeditor.INSTANCES[this.title];

    if (evt.ctrlKey) {
        if (evt.keyCode == 66) {
            //CTRL+b => STRONG
            wym._exec(WYMeditor.BOLD);
            return false;
        }
        if (evt.keyCode == 73) {
            //CTRL+i => EMPHASIS
            wym._exec(WYMeditor.ITALIC);
            return false;
        }
    }

    return true;
};

// Keyup handler, mainly used for cleanups
WYMeditor.WymClassMozilla.prototype.keyup = function(evt) {
    // 'this' is the doc
    var wym = WYMeditor.INSTANCES[this.title];

    wym._selected_image = null;
    var container = null;

    if (evt.keyCode != WYMeditor.KEY.BACKSPACE
        && evt.keyCode != WYMeditor.KEY.CTRL
        && evt.keyCode != WYMeditor.KEY.DELETE
        && evt.keyCode != WYMeditor.KEY.COMMAND
        && evt.keyCode != WYMeditor.KEY.UP
        && evt.keyCode != WYMeditor.KEY.DOWN
        && evt.keyCode != WYMeditor.KEY.LEFT
        && evt.keyCode != WYMeditor.KEY.RIGHT
        && evt.keyCode != WYMeditor.KEY.ENTER
        && !evt.metaKey
        && !evt.ctrlKey) {
        // Not BACKSPACE, DELETE, CTRL, or COMMAND key

        container = wym.selected();
        var name = container.tagName.toLowerCase();

        //fix forbidden main containers
        if (name == "strong"
            || name == "b"
            || name == "em"
            || name == "i"
            || name == "sub"
            || name == "sup"
            || name == "a") {

            name = container.parentNode.tagName.toLowerCase();
        }

        if (name == WYMeditor.BODY) {
            // Replace text nodes with <p> tags
            wym._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);
            wym.fixBodyHtml();
        }
    }

    // If we potentially created a new block level element or moved to a new one
    // then we should ensure that they're in the proper format
    if (evt.keyCode == WYMeditor.KEY.UP
        || evt.keyCode == WYMeditor.KEY.DOWN
        || evt.keyCode == WYMeditor.KEY.LEFT
        || evt.keyCode == WYMeditor.KEY.RIGHT
        || evt.keyCode == WYMeditor.KEY.BACKSPACE
        || evt.keyCode == WYMeditor.KEY.ENTER) {

        wym.fixBodyHtml();
    }
};

WYMeditor.WymClassMozilla.prototype.click = function(evt) {

    var wym = WYMeditor.INSTANCES[this.title];
    var container = wym.selected();

    if (WYMeditor.WymClassMozilla.NEEDS_CELL_FIX === true) {
        if (container && container.tagName.toLowerCase() == WYMeditor.TR) {
            // Starting with FF 3.6, inserted tables need some content in their
            // cells before they're editable
            jQuery(WYMeditor.TD, wym._doc.body)
                .append(WYMeditor.WymClassMozilla.CELL_PLACEHOLDER);

            // The user is still going to need to move out of and then back in
            // to this cell if the table was inserted via an inner_html call
            // (like via the manual HTML editor).
            // TODO: Use rangy or some other selection library to consistently
            // put the users selection out of and then back in this cell
            // so that it appears to be instantly editable
            // Once accomplished, can remove the afterInsertTable handling
        }
    }

    if (container && container.tagName.toLowerCase() == WYMeditor.BODY) {
        // A click in the body means there is no content at all, so we
        // should automatically create a starter paragraph
        wym._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);
    }
};

WYMeditor.WymClassMozilla.prototype.enableDesignMode = function() {
    if (this._doc.designMode == "off") {
        try {
            this._doc.designMode = "on";
            this._doc.execCommand("styleWithCSS", '', false);
            this._doc.execCommand("enableObjectResizing", false, false);
        } catch(e) { }
    }
};

WYMeditor.WymClassMozilla.prototype.openBlockTag = function(tag, attributes)
{
    attributes = this.validator.getValidTagAttributes(tag, attributes);

    // Handle Mozilla styled spans
    if (tag == 'span' && attributes.style) {
        var new_tag = this.getTagForStyle(attributes.style);
        if (new_tag) {
            tag = new_tag;
            this._tag_stack.pop();
            this._tag_stack.push(tag);
            attributes.style = '';
        }
    }

    this.output += this.helper.tag(tag, attributes, true);
};

WYMeditor.WymClassMozilla.prototype.getTagForStyle = function(style) {
    if (/bold/.test(style)) {
        return 'strong';
    } else if (/italic/.test(style)) {
        return 'em';
    } else if (/sub/.test(style)) {
        return 'sub';
    } else if (/super/.test(style)) {
        return 'sup';
    }

    return false;
};

WYMeditor.WymClassMozilla.prototype._canIndent = function(
        focusNode, anchorNode) {
    // Ensure that we're indenting exactly one list item

    if (focusNode && focusNode == anchorNode
        && focusNode.tagName.toLowerCase() == WYMeditor.LI) {
        // This is a single li tag

        var ancestor = focusNode.parentNode.parentNode;

        if (focusNode.parentNode.childNodes.length > 1
            || ancestor.tagName.toLowerCase() == WYMeditor.OL
            || ancestor.tagName.toLowerCase() == WYMeditor.UL
            || ancestor.tagName.toLowerCase() == WYMeditor.LI) {

            return true;
        }
    }

    return false
};

WYMeditor.WymClassMozilla.prototype._canOutdent = function(
        focusNode, anchorNode) {
    // Ensure that we're indenting exactly one list item and it's already
    // indented at least one level

    if (focusNode && focusNode == anchorNode
        && focusNode.tagName.toLowerCase() == WYMeditor.LI) {
        // This is a single li tag

        var ancestor = focusNode.parentNode.parentNode;

        if (focusNode.parentNode.childNodes.length > 1
            || ancestor.tagName.toLowerCase() == WYMeditor.OL
            || ancestor.tagName.toLowerCase() == WYMeditor.UL
            || ancestor.tagName.toLowerCase() == WYMeditor.LI) {

            // This is a nested list. Now ensure that's already indented
            // at least one level
            if ($(ancestor).parent().is('ol,ul,li')) {
                return true;
            }
        }
    }

    return false
};

/**
 * Indent a list item, accounting for firefox bugs to ensure consistent
 * behavior and valid HTML.
 */
WYMeditor.WymClassMozilla.prototype.indent = function() {
    var focusNode = this.selected();
    var sel = this._iframe.contentWindow.getSelection();
    var startOffset = sel.getRangeAt(0).startOffset;
    var anchorNode = sel.anchorNode;

    focusNode = this.findUp(focusNode, WYMeditor.BLOCKS);
    anchorNode = this.findUp(anchorNode, WYMeditor.BLOCKS);

    if (!this._canIndent(focusNode, anchorNode)) {
        return;
    }

    var $focusNode = $(focusNode);
    var listType = $focusNode.parent()[0].tagName.toLowerCase();

    // Extract any non-list children so they can be inserted
    // back in the list item after it is moved
    var itemContents = $focusNode.contents().not('ol,ul');

    if ($focusNode.prev().length == 0 && $focusNode.parent().not('ul,ol,li')) {
        // First item at the root level of a list
        // Going to need a spacer list item
        var $spacerList = $('' +
            '<li class="spacer_li">' +
                '<' + listType + '></' + listType + '>' +
            '</li>');
        $focusNode.before($spacerList);
        $focusNode.children().unwrap();
        $spacerList.find(listType).append($focusNode);

    } else if ($focusNode.prev().contents().last().is(listType)) {
        // We have a sublist at the appropriate level as a previous sibling.
        // Leave the children where they are and join the previous sublist
        var $prevLi = $focusNode.prev();
        var $prevSubList = $prevLi.contents().last();
        var $children = $focusNode.children();
        $children.unwrap();
        // Join our node at the end of the target sublist
        $prevSubList.append($focusNode);

        // Stick all of the children at the end of the previous li
        $children.detach();
        $prevLi.append($children);
        // If the first child is of the same list type, join them
        if ($children.first().is(listType)) {
            var $sublistContents = $children.first().children();
            $sublistContents.unwrap();
            $sublistContents.detach();
            $prevSubList.append($sublistContents);
        }
    } else if ($focusNode.children('ol,ul').length == 0) {
        // No sublist to join.
        // Leave the children where they are and join the previous list
        var $prevList = $focusNode.prev().filter('li');
        $focusNode.children().unwrap();
        var $containerList = $('<' + listType + '></' + listType + '>');
        $containerList.append($focusNode);
        $prevList.append($containerList);
    } else {
        // We have a sublist to join, so just jump to the front there and leave
        // the children where they are
        var $contents = $focusNode.contents().unwrap();
        var $spacerList = $('<li class="spacer_li"></li>');
        $contents.wrapAll($spacerList);
        $contents.filter('ol,ul').first().prepend($focusNode);
    }

    // Put the non-list content back inside the li
    $focusNode.prepend(itemContents);

    // If we just created lists next to eachother, join them
    var $maybeListSpacer = $focusNode.parent().parent('li.spacer_li');
    if ($maybeListSpacer.length == 1) {
        var $maybePreviousSublist = $maybeListSpacer.prev().filter('li').contents().last();
        if ($maybePreviousSublist.is(listType)) {
            // The last child (including text nodes) of the previous li is the
            // same type of list that we just had to wrap in a listSpacer.
            // Join them.
            var $listContents = $focusNode.parent().contents();
            $maybeListSpacer.detach();
            $maybePreviousSublist.append($listContents);
        } else if ($maybeListSpacer.next('li').contents().first().is(listType)) {
            // The first child (including text nodes) of the next li is the same
            // type of list we just wrapped in a listSpacer. Join them.
            var $nextSublist = $maybeListSpacer.next('li').children().first();
            var $listContents = $focusNode.parent().contents();
            $maybeListSpacer.detach();
            $nextSublist.prepend($listContents);
        } else if ($maybeListSpacer.prev().is('li')) {
            // There is a normal li before our spacer, but it doesn't have
            // a proper sublist. Just join their contents
            $prevList = $maybeListSpacer.prev();
            $maybeListSpacer.detach();
            $prevList.append($maybeListSpacer.contents());
        }
    }

    // If we eliminated the need for a spacer_li, remove it
    if ($focusNode.next().is('.spacer_li')) {
        var $spacer = $focusNode.next('.spacer_li');
        var $spacerContents = $spacer.contents();
        $spacerContents.detach();
        $focusNode.append($spacerContents);
        $spacer.remove();
    }

    // Put the selection back on the li element
    var iframeWin = this._iframe.contentWindow;
    var sel = rangy.getSelection(iframeWin);

    var range = rangy.createRange(this._doc);
    range.setStart(focusNode, startOffset);
    range.setEnd(focusNode, startOffset);
    range.collapse(false);

    sel.setSingleRange(range);

};

/**
 * Outdent a list item, accounting for firefox bugs to ensure consistent
 * behavior and valid HTML.
 */
WYMeditor.WymClassMozilla.prototype.outdent = function() {
    var focusNode = this.selected();
    var sel = this._iframe.contentWindow.getSelection();
    var startOffset = sel.getRangeAt(0).startOffset;
    var anchorNode = sel.anchorNode;

    focusNode = this.findUp(focusNode, WYMeditor.BLOCKS);
    anchorNode = this.findUp(anchorNode, WYMeditor.BLOCKS);

    if (!this._canOutdent(focusNode, anchorNode)) {
        return;
    }

    var $focusNode = $(focusNode);
    // This item is in a sublist. Firefox doesn't properly dedent this
    // as it's own item, instead it just tacks its content to the end of
    // the parent item after the sublist

    var $parentItem = $focusNode.parent().parent('li');
    var listType = $focusNode.parent()[0].tagName.toLowerCase();

    // If this li has li's following, those will need to be moved as
    // sublist elements after the outdent
    var $subsequentItems = $focusNode.nextAll('li');

    $focusNode.detach();
    $parentItem.after($focusNode);

    // If this node one or more sublist, they will need to be indented
    // by one with a fake parent to hold their previous position
    var $childLists = $focusNode.children('ol,ul');
    if ($childLists.length > 0) {
        $childLists.each(function(index, childList) {
            var $childList = $(childList);
            $childList.detach();

            $spacerList = $('' +
            '<' + listType + '>' +
                '<li class="spacer_li"></li>' +
            '</' + listType + '>');
            $focusNode.append($spacerList);
            $spacerList.append($childList);
        });
    }

    if ($subsequentItems.length > 0) {
        // Nest the previously-subsequent items inside the list to
        // retain order and their indent level
        var $sublist = $subsequentItems
        $sublist.detach();

        var $sublistWrapper = $("<"+listType+"></"+listType+">");
        $focusNode.append($sublistWrapper);
        $sublistWrapper.append($subsequentItems);

        // If we just created lists next to eachother, join them
        var $maybeConsecutiveLists = $focusNode
            .children(listType + ' + ' + listType);
        if ($maybeConsecutiveLists.length > 0) {
            // Join the same-type adjacent lists we found
            $maybeConsecutiveLists.each(function(index, list) {
                var $list = $(list);
                var $listContents = $list.contents();
                var $prevList = $list.prev();

                $listContents.detach();
                $list.remove();
                $prevList.append($listContents);
            });
        }
    }

    // Remove any now-empty lists
    $parentItem.find('ul:empty,ol:empty').remove();

    // If we eliminated the need for a spacer_li, remove it
    // Comes after empty list removal so that we only remove
    // totally empty spacer li's
    if ($parentItem.is('.spacer_li') && $parentItem.is(':empty')) {
        $parentItem.remove();
    }

    // Put the selection back on the li element
    var iframeWin = this._iframe.contentWindow;
    var sel = rangy.getSelection(iframeWin);

    var range = rangy.createRange(this._doc);
    range.setStart($focusNode[0], startOffset);
    range.setEnd($focusNode[0], startOffset);
    range.collapse(false);

    sel.setSingleRange(range);
};

/*
 * Fix new cell contents and ability to insert content at the front and end of
 * the contents.
 */
WYMeditor.WymClassMozilla.prototype.afterInsertTable = function(table) {
    if (WYMeditor.WymClassMozilla.NEEDS_CELL_FIX === true) {
        // In certain FF versions, inserted tables need some content in their
        // cells before they're editable, otherwise the user has to move focus
        // in and then out of a cell first, even with our click() hack
        $(table).find('td').each(function (index, element) {
            $(element).append(WYMeditor.WymClassMozilla.CELL_PLACEHOLDER);
        });
    }
};