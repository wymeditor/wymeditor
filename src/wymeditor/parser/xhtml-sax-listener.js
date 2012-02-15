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
        "h3", "h4", "h5", "h6", "html", "i", "ins",
        "kbd", "label", "legend", "li", "map", "noscript",
        "object", "ol", "optgroup", "option", "p", "param", "pre", "q",
        "samp", "script", "select", "small", "span", "strong", "style",
        "sub", "sup", "table", "tbody", "td", "textarea", "tfoot", "th",
        "thead", "title", "tr", "tt", "ul", "var", "extends"];


    this.inline_tags = ["br", "col", "hr", "img", "input"];

    return this;
};

WYMeditor.XhtmlSaxListener.prototype.shouldCloseTagAutomatically = function(tag, now_on_tag, closing) {
    closing = closing || false;
    if (tag == 'td') {
        if ((closing && now_on_tag == 'tr') || (!closing && now_on_tag == 'td')) {
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

WYMeditor.XhtmlSaxListener.prototype.addContent = function(text) {
    if (this.last_tag && this.last_tag == 'li') {
        // We should strip trailing newlines from text inside li tags because
        // IE adds random significant newlines inside nested lists
        text = text.replace(/\n/, '');
        text = text.replace(/\r/, '');
    }
    this.output += text;
};

WYMeditor.XhtmlSaxListener.prototype.addComment = function(text) {
    if (this.remove_comments) {
        this.output += text;
    }
};

WYMeditor.XhtmlSaxListener.prototype.addScript = function(text) {
    if (!this.remove_scripts) {
        this.output += text;
    }
};

WYMeditor.XhtmlSaxListener.prototype.addCss = function(text) {
    if (!this.remove_embeded_styles) {
        this.output += text;
    }
};

WYMeditor.XhtmlSaxListener.prototype.openBlockTag = function(tag, attributes) {
    this.output += this.helper.tag(
        tag,
        this.validator.getValidTagAttributes(tag, attributes),
        true);
};

WYMeditor.XhtmlSaxListener.prototype.inlineTag = function(tag, attributes) {
    this.output += this.helper.tag(
        tag,
        this.validator.getValidTagAttributes(tag, attributes));
};

WYMeditor.XhtmlSaxListener.prototype.openUnknownTag = function(tag, attributes) {
    //this.output += this.helper.tag(tag, attributes, true);
};

WYMeditor.XhtmlSaxListener.prototype.closeBlockTag = function(tag) {
    this.output = this.output.replace(/<br \/>$/, '') +
        this._getClosingTagContent('before', tag) +
        "</"+tag+">" +
        this._getClosingTagContent('after', tag);
};

WYMeditor.XhtmlSaxListener.prototype.closeUnknownTag = function(tag) {
    //this.output += "</"+tag+">";
};

WYMeditor.XhtmlSaxListener.prototype.closeUnopenedTag = function(tag) {
    this.output += "</" + tag + ">";
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
    return !WYMeditor.Helper.contains(this.avoided_tags, tag) &&
            WYMeditor.Helper.contains(this.block_tags, tag);
};

WYMeditor.XhtmlSaxListener.prototype.isInlineTag = function(tag) {
    return !WYMeditor.Helper.contains(this.avoided_tags, tag) &&
            WYMeditor.Helper.contains(this.inline_tags, tag);
};

WYMeditor.XhtmlSaxListener.prototype.insertContentAfterClosingTag = function(tag, content) {
    this._insertContentWhenClosingTag('after', tag, content);
};

WYMeditor.XhtmlSaxListener.prototype.insertContentBeforeClosingTag = function(tag, content) {
    this._insertContentWhenClosingTag('before', tag, content);
};

WYMeditor.XhtmlSaxListener.prototype.fixNestingBeforeOpeningBlockTag = function(tag, attributes) {
    if ((tag == 'ul' || tag == 'ol') && this.last_tag &&
            !this.last_tag_opened && this.last_tag == 'li') {
        // We have a <li></li><ol>... situation. The new list should be a
        // child of the li tag. Not a sibling.

        // Remove the last closing li tag
        this.output = this.output.replace(/<\/li>\s*$/, '');
        this.insertContentAfterClosingTag(tag, '</li>');
    } else if ((tag == 'ul' || tag == 'ol') && this.last_tag &&
            this.last_tag_opened && (this.last_tag == 'ul' || this.last_tag == 'ol')) {
        // We have a <ol|ul><ol|ul>... situation. The new list should be have
        // a li tag parent and shouldn't be directly nested.

        // Add an opening li tag before and after this tag
        this.output += this.helper.tag('li', {}, true);
        this.insertContentAfterClosingTag(tag, '</li>');
    } else if (tag == 'li' && !this.last_tag_opened) {
        // Closest open tag that's not this tag
        if (this._tag_stack.length >= 2) {
            var closestOpenTag = this._tag_stack[this._tag_stack.length - 2];
            if (closestOpenTag == 'li'){
                // Pop the tag off of the stack to indicate we closed it
                this._open_tags.li -= 1;
                if (this._open_tags.li === 0) {
                    this._open_tags.li = undefined;
                }
                this._tag_stack.pop(this._tag_stack.length - 2);
                this.output += '</li>';
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

