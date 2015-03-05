/**
* XHTML Sax parser.
*
*    @author Bermi Ferrer (http://bermi.org)
*/
WYMeditor.XhtmlSaxListener = function() {
    this.output = '';
    this.helper = new WYMeditor.XmlHelper();
    this._open_tags = {};
    this.validator = WYMeditor.XhtmlValidator;
    this._tag_stack = [];
    this.avoided_tags = [];
    this._insert_before_closing = [];
    this._insert_after_closing = [];
    this._last_node_was_text = false;
    this._consecutive_brs = 0;

    // A string of the tag name of the last open tag added to the output.
    this._lastAddedOpenTag = '';

    // A boolean that should be set to true when the parser is within a list
    // item and that should be set to false when the parser is no longer
    // withing a list item.
    this._insideLI = false;

    // An array of tags that should have their contents unwrapped if the tag is
    // within a list item.
    this.tagsToUnwrapInLists =
        WYMeditor.DocumentStructureManager.VALID_DEFAULT_ROOT_CONTAINERS;

    // If any of these inline tags is found in the root, just remove them.
    this._rootInlineTagsToRemove = ['br'];

    // A counter to keep track of the number of extra block closing tags that
    // should be expected by the parser because of the removal of that
    // element's opening tag.
    this._extraBlockClosingTags = 0;

    this._insideTagToRemove = false;
    // A boolean that indicates if a spacer line break should be added before
    // the next element in a list item to preserve spacing because of the
    // unwrapping of a block tag before the element.
    this._addSpacerBeforeElementInLI = false;

    // This flag is set to true if the parser is currently inside a tag flagged
    // for removal. Nothing will be added to the output while this flag is set
    // to true.
    this._insideTagToRemove = false;

    // If the last tag was not added to the output, this flag is set to true.
    // This is needed because if we are trying to fix an invalid tag by nesting
    // it in the last outputted tag as in the case of some invalid lists, if
    // the last tag was removed, the invalid tag should just be removed as well
    // instead of trying to fix it by nesting it in a tag that was already
    // removed from the output.
    this._lastTagRemoved = false;

    // When correcting invalid list nesting, situations can occur that will
    // result in an extra closing LI tags coming up later in the parser. When
    // one of these situations occurs, this counter is incremented so that it
    // can be referenced to find how many extra LI closing tags to expect. This
    // counter should be decremented everytime one of these extra LI closing
    // tags is removed.
    this._extraLIClosingTags = 0;

    // This is for storage of a tag's index in the tag stack so that the
    // Listener can use it to check for when the tag has been closed (i.e. when
    // the top of the tag stack is at the stored index again).
    this._removedTagStackIndex = 0;

    this.entities = {
        '&nbsp;':'&#160;','&iexcl;':'&#161;','&cent;':'&#162;',
        '&pound;':'&#163;','&curren;':'&#164;','&yen;':'&#165;',
        '&brvbar;':'&#166;','&sect;':'&#167;','&uml;':'&#168;',
        '&copy;':'&#169;','&ordf;':'&#170;','&laquo;':'&#171;',
        '&not;':'&#172;','&shy;':'&#173;','&reg;':'&#174;',
        '&macr;':'&#175;','&deg;':'&#176;','&plusmn;':'&#177;',
        '&sup2;':'&#178;','&sup3;':'&#179;','&acute;':'&#180;',
        '&micro;':'&#181;','&para;':'&#182;','&middot;':'&#183;',
        '&cedil;':'&#184;','&sup1;':'&#185;','&ordm;':'&#186;',
        '&raquo;':'&#187;','&frac14;':'&#188;','&frac12;':'&#189;',
        '&frac34;':'&#190;','&iquest;':'&#191;','&Agrave;':'&#192;',
        '&Aacute;':'&#193;','&Acirc;':'&#194;','&Atilde;':'&#195;',
        '&Auml;':'&#196;','&Aring;':'&#197;','&AElig;':'&#198;',
        '&Ccedil;':'&#199;','&Egrave;':'&#200;','&Eacute;':'&#201;',
        '&Ecirc;':'&#202;','&Euml;':'&#203;','&Igrave;':'&#204;',
        '&Iacute;':'&#205;','&Icirc;':'&#206;','&Iuml;':'&#207;',
        '&ETH;':'&#208;','&Ntilde;':'&#209;','&Ograve;':'&#210;',
        '&Oacute;':'&#211;','&Ocirc;':'&#212;','&Otilde;':'&#213;',
        '&Ouml;':'&#214;','&times;':'&#215;','&Oslash;':'&#216;',
        '&Ugrave;':'&#217;','&Uacute;':'&#218;','&Ucirc;':'&#219;',
        '&Uuml;':'&#220;','&Yacute;':'&#221;','&THORN;':'&#222;',
        '&szlig;':'&#223;','&agrave;':'&#224;','&aacute;':'&#225;',
        '&acirc;':'&#226;','&atilde;':'&#227;','&auml;':'&#228;',
        '&aring;':'&#229;','&aelig;':'&#230;','&ccedil;':'&#231;',
        '&egrave;':'&#232;','&eacute;':'&#233;','&ecirc;':'&#234;',
        '&euml;':'&#235;','&igrave;':'&#236;','&iacute;':'&#237;',
        '&icirc;':'&#238;','&iuml;':'&#239;','&eth;':'&#240;',
        '&ntilde;':'&#241;','&ograve;':'&#242;','&oacute;':'&#243;',
        '&ocirc;':'&#244;','&otilde;':'&#245;','&ouml;':'&#246;',
        '&divide;':'&#247;','&oslash;':'&#248;','&ugrave;':'&#249;',
        '&uacute;':'&#250;','&ucirc;':'&#251;','&uuml;':'&#252;',
        '&yacute;':'&#253;','&thorn;':'&#254;','&yuml;':'&#255;',
        '&OElig;':'&#338;','&oelig;':'&#339;','&Scaron;':'&#352;',
        '&scaron;':'&#353;','&Yuml;':'&#376;','&fnof;':'&#402;',
        '&circ;':'&#710;','&tilde;':'&#732;','&Alpha;':'&#913;',
        '&Beta;':'&#914;','&Gamma;':'&#915;','&Delta;':'&#916;',
        '&Epsilon;':'&#917;','&Zeta;':'&#918;','&Eta;':'&#919;',
        '&Theta;':'&#920;','&Iota;':'&#921;','&Kappa;':'&#922;',
        '&Lambda;':'&#923;','&Mu;':'&#924;','&Nu;':'&#925;',
        '&Xi;':'&#926;','&Omicron;':'&#927;','&Pi;':'&#928;',
        '&Rho;':'&#929;','&Sigma;':'&#931;','&Tau;':'&#932;',
        '&Upsilon;':'&#933;','&Phi;':'&#934;','&Chi;':'&#935;',
        '&Psi;':'&#936;','&Omega;':'&#937;','&alpha;':'&#945;',
        '&beta;':'&#946;','&gamma;':'&#947;','&delta;':'&#948;',
        '&epsilon;':'&#949;','&zeta;':'&#950;','&eta;':'&#951;',
        '&theta;':'&#952;','&iota;':'&#953;','&kappa;':'&#954;',
        '&lambda;':'&#955;','&mu;':'&#956;','&nu;':'&#957;',
        '&xi;':'&#958;','&omicron;':'&#959;','&pi;':'&#960;',
        '&rho;':'&#961;','&sigmaf;':'&#962;','&sigma;':'&#963;',
        '&tau;':'&#964;','&upsilon;':'&#965;','&phi;':'&#966;',
        '&chi;':'&#967;','&psi;':'&#968;','&omega;':'&#969;',
        '&thetasym;':'&#977;','&upsih;':'&#978;','&piv;':'&#982;',
        '&ensp;':'&#8194;','&emsp;':'&#8195;','&thinsp;':'&#8201;',
        '&zwnj;':'&#8204;','&zwj;':'&#8205;','&lrm;':'&#8206;',
        '&rlm;':'&#8207;','&ndash;':'&#8211;','&mdash;':'&#8212;',
        '&lsquo;':'&#8216;','&rsquo;':'&#8217;','&sbquo;':'&#8218;',
        '&ldquo;':'&#8220;','&rdquo;':'&#8221;','&bdquo;':'&#8222;',
        '&dagger;':'&#8224;','&Dagger;':'&#8225;','&bull;':'&#8226;',
        '&hellip;':'&#8230;','&permil;':'&#8240;','&prime;':'&#8242;',
        '&Prime;':'&#8243;','&lsaquo;':'&#8249;','&rsaquo;':'&#8250;',
        '&oline;':'&#8254;','&frasl;':'&#8260;','&euro;':'&#8364;',
        '&image;':'&#8465;','&weierp;':'&#8472;','&real;':'&#8476;',
        '&trade;':'&#8482;','&alefsym;':'&#8501;','&larr;':'&#8592;',
        '&uarr;':'&#8593;','&rarr;':'&#8594;','&darr;':'&#8595;',
        '&harr;':'&#8596;','&crarr;':'&#8629;','&lArr;':'&#8656;',
        '&uArr;':'&#8657;','&rArr;':'&#8658;','&dArr;':'&#8659;',
        '&hArr;':'&#8660;','&forall;':'&#8704;','&part;':'&#8706;',
        '&exist;':'&#8707;','&empty;':'&#8709;','&nabla;':'&#8711;',
        '&isin;':'&#8712;','&notin;':'&#8713;','&ni;':'&#8715;',
        '&prod;':'&#8719;','&sum;':'&#8721;','&minus;':'&#8722;',
        '&lowast;':'&#8727;','&radic;':'&#8730;','&prop;':'&#8733;',
        '&infin;':'&#8734;','&ang;':'&#8736;','&and;':'&#8743;',
        '&or;':'&#8744;','&cap;':'&#8745;','&cup;':'&#8746;',
        '&int;':'&#8747;','&there4;':'&#8756;','&sim;':'&#8764;',
        '&cong;':'&#8773;','&asymp;':'&#8776;','&ne;':'&#8800;',
        '&equiv;':'&#8801;','&le;':'&#8804;','&ge;':'&#8805;',
        '&sub;':'&#8834;','&sup;':'&#8835;','&nsub;':'&#8836;',
        '&sube;':'&#8838;','&supe;':'&#8839;','&oplus;':'&#8853;',
        '&otimes;':'&#8855;','&perp;':'&#8869;','&sdot;':'&#8901;',
        '&lceil;':'&#8968;','&rceil;':'&#8969;','&lfloor;':'&#8970;',
        '&rfloor;':'&#8971;','&lang;':'&#9001;','&rang;':'&#9002;',
        '&loz;':'&#9674;','&spades;':'&#9824;','&clubs;':'&#9827;',
        '&hearts;':'&#9829;','&diams;':'&#9830;'};

    this.block_tags = [
        "a", "abbr", "acronym", "address", "area", "b",
        "base", "bdo", "big", "blockquote", "body", "button",
        "caption", "cite", "code", "colgroup", "dd", "del", "div",
        "dfn", "dl", "dt", "em", "fieldset", "form", "head", "h1", "h2",
        "h3", "h4", "h5", "h6", "html", "i", "iframe", "ins",
        "kbd", "label", "legend", "li", "map", "noscript",
        "object", "ol", "optgroup", "option", "p", "param", "pre", "q",
        "samp", "script", "select", "small", "span", "strong", "style",
        "sub", "sup", "table", "tbody", "td", "textarea", "tfoot", "th",
        "thead", "title", "tr", "tt", "ul", "var", "extends"];


    this.inline_tags = ["br", "col", "hr", "img", "input"];

    return this;
};

WYMeditor.XhtmlSaxListener.prototype.shouldCloseTagAutomatically = function(tag, now_on_tag, closing) {
    if (tag != 'td' && tag != 'option') {
        // We only attempt auto-closing for these tags
        return false;
    }
    var openCount = this._open_tags[tag];
    if (!openCount) {
        /// If there are no open tags, it would be pretty silly to try and close the tag
        return false;
    }

    if (tag == 'td') {
        var openTrCount = this._open_tags['tr'] || 0;
        // We use count instead of existence to handle nested tables/rows
        if (!closing && now_on_tag === 'td' && openCount >= openTrCount) {
            return true;
        }
        if (closing && now_on_tag == 'tr' && openCount > openTrCount) {
            return true;
        }
    } else if (tag == 'option') {
        if ((closing && now_on_tag == 'select') || (!closing && now_on_tag == 'option')) {
            return true;
        }
    }
    return false;
};

WYMeditor.XhtmlSaxListener.prototype.beforeParsing = function(raw) {
    this.output = '';

    // Reset attributes that might bleed over between parsing
    this._insert_before_closing = [];
    this._insert_after_closing = [];
    this._open_tags = {};
    this._tag_stack = [];
    this._last_node_was_text = false;
    this._lastTagRemoved = false;
    this._insideTagToRemove = false;
    this.last_tag = null;

    return raw;
};

WYMeditor.XhtmlSaxListener.prototype.afterParsing = function(xhtml) {
    xhtml = this.replaceNamedEntities(xhtml);
    xhtml = this.joinRepeatedEntities(xhtml);
    xhtml = this.removeEmptyTags(xhtml);
    xhtml = this.removeBrInPre(xhtml);

    return xhtml;
};

WYMeditor.XhtmlSaxListener.prototype.replaceNamedEntities = function(xhtml) {
    for (var entity in this.entities) {
        xhtml = xhtml.replace(new RegExp(entity, 'g'), this.entities[entity]);
    }
    return xhtml;
};

WYMeditor.XhtmlSaxListener.prototype.joinRepeatedEntities = function(xhtml) {
    var tags = 'em|strong|sub|sup|acronym|pre|del|address';
    return xhtml.replace(new RegExp('<\/('+tags+')><\\1>' ,''), '').
            replace(
                new RegExp('(\s*<('+tags+')>\s*){2}(.*)(\s*<\/\\2>\s*){2}' ,''),
                '<\$2>\$3<\$2>');
};

WYMeditor.XhtmlSaxListener.prototype.removeEmptyTags = function(xhtml) {
    return xhtml.replace(
            new RegExp(
                '<('+this.block_tags.join("|").
                    replace(/\|td/,'').
                    replace(/\|th/, '') +
                ')>(<br \/>|&#160;|&nbsp;|\\s)*<\/\\1>' ,'g'),
            '');
};

WYMeditor.XhtmlSaxListener.prototype.removeBrInPre = function(xhtml) {
    var matches = xhtml.match(new RegExp('<pre[^>]*>(.*?)<\/pre>','gmi'));
    if (matches) {
        for (var i=0; i<matches.length; i++) {
            xhtml = xhtml.replace(
                matches[i],
                matches[i].replace(new RegExp('<br \/>', 'g'), String.fromCharCode(13,10)));
        }
    }
    return xhtml;
};

WYMeditor.XhtmlSaxListener.prototype.getResult = function() {
    return this.output;
};

WYMeditor.XhtmlSaxListener.prototype.getTagReplacements = function() {
    return {'b':'strong', 'i':'em'};
};

WYMeditor.XhtmlSaxListener.prototype.getTagForStyle = function (style) {
    if (/sub/.test(style)) {
        return 'sub';
    } else if (/super/.test(style)) {
        return 'sup';
    } else if (/bold/.test(style)) {
        return 'strong';
    } else if (/italic/.test(style)) {
        return 'em';
    }

    return false;
};

WYMeditor.XhtmlSaxListener.prototype.addContent = function(text) {
    if (this.last_tag && this.last_tag == 'li') {
        // We should strip trailing newlines from text inside li tags because
        // IE adds random significant newlines inside nested lists
        text = text.replace(/(\r|\n|\r\n)+$/g, '');

        // Let's also normalize multiple newlines down to a single space
        text = text.replace(/(\r|\n|\r\n)+/g, ' ');
    }
    if (text.replace(/^\s+|\s+$/g, '').length > 0) {
        // Don't count it as text if it's empty
        this._last_node_was_text = true;
        if (this._addSpacerBeforeElementInLI) {
            this.output += '<br />';
            this._addSpacerBeforeElementInLI = false;
        }
    }
    if (!this._insideTagToRemove) {
        this.output += text;
    }
};

WYMeditor.XhtmlSaxListener.prototype.addComment = function(text) {
    if (this.remove_comments || this._insideTagToRemove) {
        return;
    }
    this.output += text;
};

WYMeditor.XhtmlSaxListener.prototype.addScript = function(text) {
    if (this.remove_scripts || this._insideTagToRemove) {
        return;
    }
    this.output += text;
};

WYMeditor.XhtmlSaxListener.prototype.addCss = function(text) {
    if (this.remove_embeded_styles || this._insideTagToRemove) {
        return;
    }
    this.output += text;
};

WYMeditor.XhtmlSaxListener.prototype.openBlockTag = function(tag, attributes) {
    var lastNodeWasText = this._last_node_was_text;
    this._last_node_was_text = false;

    if (this._insideTagToRemove) {
        // If we're currently in a block marked for removal, don't add it to
        // the output.
        return;
    }
    if (this._shouldRemoveTag(tag, attributes)) {
        // If this tag is marked for removal, set a flag signifying that
        // we're in a tag to remove and mark the position in the tag stack
        // of this tag so that we know when we've reached the end of it.
        this._insideTagToRemove = true;
        this._removedTagStackIndex = this._tag_stack.length - 1;
        return;
    }

    // If we're currently inside an LI and this tag is not allowed inside
    // an LI, unwrap the tag by not adding it to the output.
    if (this._insideLI && jQuery.inArray(tag, this.tagsToUnwrapInLists) > -1) {
        if (this._lastAddedOpenTag !== 'li' || lastNodeWasText) {
            // If there was content inside the LI before this unwrapped block,
            // insert a line break so that the content retains its spacing.
            this.output += '<br />';
            this._addSpacerBeforeElementInLI = false;
        }
        this._tag_stack.pop();
        this._extraBlockClosingTags++;
        return;
    }

    // Add a line break spacer before adding the open block tag if necessary
    // and if the tag is not a list element.
    if (this._addSpacerBeforeElementInLI &&
            tag !== 'li' &&
            jQuery.inArray(tag, WYMeditor.LIST_TYPE_ELEMENTS) === -1) {
        this.output += '<br />';
        this._addSpacerBeforeElementInLI = false;
    }

    attributes = this.validator.getValidTagAttributes(tag, attributes);
    attributes = this.removeUnwantedClasses(attributes);

    // Handle Mozilla and Safari styled spans
    if (tag === 'span' && attributes.style) {
        var new_tag = this.getTagForStyle(attributes.style);
        if (new_tag) {
            tag = new_tag;
            this._tag_stack.pop();
            this._tag_stack.push(tag);
            attributes.style = '';
        }
    }

    if (tag === 'li') {
        this._insideLI = true;
        this._addSpacerBeforeElementInLI = false;
    }

    this.output += this.helper.tag(tag, attributes, true);
    this._lastAddedOpenTag = tag;
    this._lastTagRemoved = false;
};

WYMeditor.XhtmlSaxListener.prototype.inlineTag = function(tag, attributes) {
    if (this._insideTagToRemove || this._shouldRemoveTag(tag, attributes)) {
        // If we're currently in a block marked for removal or if this tag is
        // marked for removal, don't add it to the output.
        return;
    }
    this._last_node_was_text = false;

    attributes = this.validator.getValidTagAttributes(tag, attributes);
    attributes = this.removeUnwantedClasses(attributes);
    this.output += this.helper.tag(tag, attributes);
    this._lastTagRemoved = false;
};

WYMeditor.XhtmlSaxListener.prototype.openUnknownTag = function(tag, attributes) {
    //this.output += this.helper.tag(tag, attributes, true);
};

WYMeditor.XhtmlSaxListener.prototype.closeBlockTag = function(tag) {
    this._last_node_was_text = false;
    if (this._insideTagToRemove) {
        if (this._tag_stack.length === this._removedTagStackIndex) {
            // If we've reached the index in the tag stack were the tag to be
            // removed started, we're no longer inside that tag and can turn
            // the insideTagToRemove flag off.
            this._insideTagToRemove = false;
        }
        this._lastTagRemoved = true;
        return;
    }

    if (tag === 'li') {
        this._insideLI = false;
        this._addSpacerBeforeElementInLI = false;
    }
    if (jQuery.inArray(tag, WYMeditor.LIST_TYPE_ELEMENTS) > -1) {
        this._insideLI = false;
    }

    this.output = this.output +
        this._getClosingTagContent('before', tag) +
        "</"+tag+">" +
        this._getClosingTagContent('after', tag);
};

WYMeditor.XhtmlSaxListener.prototype.removedExtraBlockClosingTag = function () {
    this._extraBlockClosingTags--;
    this._addSpacerBeforeElementInLI = true;
    this._last_node_was_text = false;
};

WYMeditor.XhtmlSaxListener.prototype.closeUnknownTag = function(tag) {
    //this.output += "</"+tag+">";
};

WYMeditor.XhtmlSaxListener.prototype.closeUnopenedTag = function(tag) {
    this._last_node_was_text = false;
    if (this._insideTagToRemove) {
        return;
    }

    if (tag === 'li' && this._extraLIClosingTags) {
        this._extraLIClosingTags--;
    } else {
        this.output += "</" + tag + ">";
    }
};

WYMeditor.XhtmlSaxListener.prototype.avoidStylingTagsAndAttributes = function() {
    this.avoided_tags = ['div','span'];
    this.validator.skiped_attributes = ['style'];
    this.validator.skiped_attribute_values = ['MsoNormal','main1']; // MS Word attributes for class
    this._avoiding_tags_implicitly = true;
};

WYMeditor.XhtmlSaxListener.prototype.allowStylingTagsAndAttributes = function() {
    this.avoided_tags = [];
    this.validator.skiped_attributes = [];
    this.validator.skiped_attribute_values = [];
    this._avoiding_tags_implicitly = false;
};

WYMeditor.XhtmlSaxListener.prototype.isBlockTag = function(tag) {
    return !WYMeditor.Helper.arrayContains(this.avoided_tags, tag) &&
            WYMeditor.Helper.arrayContains(this.block_tags, tag);
};

WYMeditor.XhtmlSaxListener.prototype.isInlineTag = function(tag) {
    return !WYMeditor.Helper.arrayContains(this.avoided_tags, tag) &&
            WYMeditor.Helper.arrayContains(this.inline_tags, tag);
};

WYMeditor.XhtmlSaxListener.prototype.insertContentAfterClosingTag = function(tag, content) {
    this._insertContentWhenClosingTag('after', tag, content);
};

WYMeditor.XhtmlSaxListener.prototype.insertContentBeforeClosingTag = function(tag, content) {
    this._insertContentWhenClosingTag('before', tag, content);
};

/*
    removeUnwantedClasses
    =====================

    Removes the unwanted classes specified in the
    WYMeditor.CLASSES_REMOVED_BY_PARSER constant from the passed attributes
    object and returns the attributes object after the removals. The passed
    attributes object should be in a format with attribute names as properties
    and those attributes' values as those properties' values. The class
    matching for removal is case insensitive.
*/
WYMeditor.XhtmlSaxListener.prototype.removeUnwantedClasses = function(attributes) {
    var pattern,
        i;

    if (!attributes["class"]) {
        return attributes;
    }

    for (i = 0; i < WYMeditor.CLASSES_REMOVED_BY_PARSER.length; ++i) {
        pattern = new RegExp('(^|\\s)' + WYMeditor.CLASSES_REMOVED_BY_PARSER[i] +
                             '($|\\s)', 'gi');
        attributes["class"] = attributes["class"].replace(pattern, '$1');
    }

    // Remove possible trailing space that could have been left over if the
    // last class was removed
    attributes["class"] = attributes["class"].replace(/\s$/, '');
    return attributes;
};

WYMeditor.XhtmlSaxListener.prototype.fixNestingBeforeOpeningBlockTag = function(tag, attributes) {
    if (!this._last_node_was_text && (tag == 'ul' || tag == 'ol') && this.last_tag &&
            !this.last_tag_opened && this.last_tag == 'li') {
        // We have a <li></li><ol>... situation. The new list should be a
        // child of the li tag. Not a sibling.

        if (this._lastTagRemoved) {
            // If the previous li tag was removed, the new list should be
            // removed with it.
            this._insideTagToRemove = true;
            this._removedTagStackIndex = this._tag_stack.length - 1;
        } else if (!this._shouldRemoveTag(tag, attributes)){
            // If this tag is not going to be removed, remove the last closing
            // li tag
            this.output = this.output.replace(/<\/li>\s*$/, '');
            this.insertContentAfterClosingTag(tag, '</li>');
        }
    } else if ((tag == 'ul' || tag == 'ol') && this.last_tag &&
            this.last_tag_opened && (this.last_tag == 'ul' || this.last_tag == 'ol')) {
        // We have a <ol|ul><ol|ul>... situation. The new list should be have
        // a li tag parent and shouldn't be directly nested.

        // If this tag is not going to be removed, add an opening li tag before
        // and after this tag
        if (!this._shouldRemoveTag(tag, attributes)) {
            this.output += this.helper.tag('li', {}, true);
            this.insertContentAfterClosingTag(tag, '</li>');
        }
        this._last_node_was_text = false;
    } else if (tag == 'li') {
        // Closest open tag that's not this tag
        if (this._tag_stack.length >= 2) {
            var closestOpenTag = this._tag_stack[this._tag_stack.length - 2];
            if (closestOpenTag == 'li' && !this._shouldRemoveTag(tag, attributes)){
                // Pop the tag off of the stack to indicate we closed it
                this._open_tags.li -= 1;
                if (this._open_tags.li === 0) {
                    this._open_tags.li = undefined;
                }
                this._tag_stack.splice(this._tag_stack.length - 2, 1);
                this._last_node_was_text = false;

                if (!this._insideTagToRemove) {
                    // If not inside a tag to remove, close the outer LI now
                    // before adding the LI that was nested within it to the
                    // output.
                    this.output += '</li>';
                } else if (this._tag_stack.length - 1 ===
                           this._removedTagStackIndex) {
                    // If the outer LI was the start of a block to be removed,
                    // reset the flag for removing a tag.
                    this._insideTagToRemove = false;
                    this._lastTagRemoved = true;
                    this._extraLIClosingTags++;
                }
            }
        }
        // Opening a new li tag while another li tag is still open.
        // LI tags aren't allowed to be nested within eachother
        // It probably means we forgot to close the last LI tag
        //return true;
    }
};

WYMeditor.XhtmlSaxListener.prototype._insertContentWhenClosingTag = function(position, tag, content) {
    if (!this['_insert_'+position+'_closing']) {
        this['_insert_'+position+'_closing'] = [];
    }
    if (!this['_insert_'+position+'_closing'][tag]) {
        this['_insert_'+position+'_closing'][tag] = [];
    }
    this['_insert_'+position+'_closing'][tag].push(content);
};

WYMeditor.XhtmlSaxListener.prototype._getClosingTagContent = function(position, tag) {
    if (this['_insert_'+position+'_closing'] &&
            this['_insert_'+position+'_closing'][tag] &&
            this['_insert_'+position+'_closing'][tag].length > 0) {
        return this['_insert_'+position+'_closing'][tag].pop();
    }
    return '';
};

/*
    _shouldRemoveTag
    ================

    Specifies if the passed tag with the passed attributes should be removed
    from the output or not, based on the current state.
*/
WYMeditor.XhtmlSaxListener.prototype._shouldRemoveTag = function(tag, attributes) {
    if (this._isEditorOnlyTag(tag, attributes)) {
        return true;
    }
    if (this._isRootInlineTagToRemove(tag, attributes, this._tag_stack)) {
        return true;
    }
    if (this._isThirdConsecutiveBrWithNoAttributes(tag, attributes)) {
        return true;
    }

    return false;
};

/*
    _isEditorOnlyTag
    ================

    Is the passed-in tag, as evaluated in the current state, a tag that should
    only exist in the editor, but not in the final output. Editor-only tags
    exist to aid with manipulation and browser-bug workarounds, but aren't
    actual content that should be kept in the authoritative HTML.
*/
WYMeditor.XhtmlSaxListener.prototype._isEditorOnlyTag = function(tag, attributes) {
    var classes;

    if (!attributes["class"]) {
        return false;
    }

    classes = attributes["class"].split(" ");
    if (WYMeditor.Helper.arrayContains(classes, WYMeditor.EDITOR_ONLY_CLASS)) {
        return true;
    }
    return false;
};

/*
    Is this tag one of the tags that should be removed if found at the root.
*/
WYMeditor.XhtmlSaxListener.prototype._isRootInlineTagToRemove = function(
    tag, attributes, currentTagStack
) {
    if (!this.isInlineTag(tag)) {
        return false;
    }
    if (currentTagStack.length > 0) {
        // We're not at the root
        return false;
    }

    if (WYMeditor.Helper.arrayContains(this._rootInlineTagsToRemove, tag)) {
        return true;
    }
    return false;
};

/*
    Is this tag a third consecutive `br` element that has no attributes.
*/
WYMeditor.XhtmlSaxListener.prototype
    ._isThirdConsecutiveBrWithNoAttributes = function (tag, attributes) {
    var key;
    if (tag !== 'br') {
        this._consecutive_brs = 0;
        return false;
    }
    if (
        this._consecutive_brs !== 0 &&
        this._last_node_was_text
    ) {
        this._consecutive_brs = 0;
        return false;
    }
    for (key in attributes) {
        if (attributes.hasOwnProperty(key)) {
            this._consecutive_brs = 0;
            return false;
        }
    }
    this._consecutive_brs ++;
    if (this._consecutive_brs > 2) {
        return true;
    }
    return false;
};
