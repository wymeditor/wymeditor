/**
*    Breas XHTML into SAX events.
*    @package Parser
*    @subpackage WebTester
*
*    Sets up the lexer with case insensitive matching
*    and adds the HTML handlers.
*    @param SaxParser parser  Handling strategy by
*                                    reference.
*    @access public
*/
function XhtmlLexer(parser) {
  this.extends(new Lexer(parser, 'text'));
  this.mapHandler('text', 'acceptTextToken');
  this._addSkipping();
  var parsed_tags = this._getParsedTags();
  for (i = 0, count = parsed_tags.length; i < count; i++) {
    this._addTag(parsed_tags[i]);
  }
  this._addInTagTokens();
}

/**
*    List of parsed tags. Others are ignored.
*    @return array        List of searched for tags.
*    @access private
*/
XhtmlLexer.prototype._getParsedTags =  function () {
  return ["a", "abbr", "acronym", "address", "area", "b", 
  "base", "bdo", "big", "blockquote", "body", "br", "button", 
  "caption", "cite", "code", "col", "colgroup", "dd", "del", "div", 
  "dfn", "dl", "dt", "em", "fieldset", "form", "head", "h1", "h2", 
  "h3", "h4", "h5", "h6", "hr", "html", "i", "img", "input", "ins", 
  "kbd", "label", "legend", "li", "link", "map", "meta", "noscript", 
  "object", "ol", "optgroup", "option", "p", "param", "pre", "q", 
  "samp", "script", "select", "small", "span", "strong", "style", 
  "sub", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", 
  "thead", "title", "tr", "tt", "ul", "var", "extends"];
}

/**
*    The lexer has to skip certain sections such
*    as server code, client code and styles.
*    @access private
*/
XhtmlLexer.prototype._addSkipping = function() {
  this.mapHandler('css', 'ignore');
  this.addEntryPattern('<style', 'text', 'css');
  this.addExitPattern('</style>', 'css');
  this.mapHandler('js', 'ignore');
  this.addEntryPattern('<script', 'text', 'js');
  this.addExitPattern('</script>', 'js');
  this.mapHandler('comment', 'ignore');
  this.addEntryPattern('<!--', 'text', 'comment');
  this.addExitPattern('-->', 'comment');
}

/**
*    Pattern matches to start and end a tag.
*    @param string tag          Name of tag to scan for.
*    @access private
*/
XhtmlLexer.prototype._addTag = function(tag) {
  this.addSpecialPattern('</'+tag+'>', 'text', 'acceptEndToken');
  this.addEntryPattern('<'+tag, 'text', 'tag');
}

/**
*    Pattern matches to parse the inside of a tag
*    including the attributes and their quoting.
*    @access private
*/
XhtmlLexer.prototype._addInTagTokens = function() {
  this.mapHandler('tag', 'acceptStartToken');
  this.addSpecialPattern('\\s+', 'tag', 'ignore');
  this._addAttributeTokens();
  this.addExitPattern('/>', 'tag');
  this.addExitPattern('>', 'tag');
}

/**
*    Matches attributes that are either single quoted,
*    double quoted or unquoted.
*    @access private
*/
XhtmlLexer.prototype._addAttributeTokens = function() {
  this.mapHandler('dq_attribute', 'acceptAttributeToken');
  this.addEntryPattern('=\\s*"', 'tag', 'dq_attribute');
  this.addPattern("\\\\\"", 'dq_attribute');
  this.addExitPattern('"', 'dq_attribute');
  this.mapHandler('sq_attribute', 'acceptAttributeToken');
  this.addEntryPattern("=\\s*'", 'tag', 'sq_attribute');
  this.addPattern("\\\\'", 'sq_attribute');
  this.addExitPattern("'", 'sq_attribute');
  this.mapHandler('uq_attribute', 'acceptAttributeToken');
  this.addSpecialPattern('=\\s*[^>\\s]*', 'tag', 'uq_attribute');
}


/**
*    Converts HTML tokens into selected SAX evnts.
*    @package Parser
*    @subpackage WebTester
*
*    Sets the listener.
*    @param SaxListener listener    SAX evnt handler.
*    @access public
*/
function XhtmlSaxParser(listener) {
  this._listener = listener;
  this._lexer = this.createLexer(this);
  this._tag = '';
  this._attributes = {};
  this._current_attribute = '';
}

/**
*    Runs the content through the lexer which
*    should call back to the acceptors.
*    @param string $raw      Page text to parse.
*    @return boolean         False if parse error.
*    @access public
*/
XhtmlSaxParser.prototype.parse = function (raw) {
  return this._lexer.parse(raw);
}

/**
*    Sets up the matching lexer. Starts in 'text' mode.
*    @param SaxParser $parser    evnt generator, usually $self.
*    @return Lexer               Lexer suitable for this parser.
*    @access public
*    @static
*/
XhtmlSaxParser.prototype.createLexer = function (parser) {
  return new XhtmlLexer(parser);
}

/**
*    Accepts a token from the tag mode. If the
*    starting element completes then the element
*    is dispatched and the current attributes
*    set back to empty. The element or attribute
*    name is converted to lower case.
*    @param string token     Incoming characters.
*    @param integer evnt    Lexer evnt type.
*    @return boolean          False if parse error.
*    @access public
*/
XhtmlSaxParser.prototype.acceptStartToken = function (token, evnt) {
  if (evnt == LEXER_ENTER) {
    this._tag = token.toLowerCase().substring(1);
    return true;
  }
  if (evnt == LEXER_EXIT) {
    success = this._listener.startElement(this._tag, this._attributes);
    this._tag = '';
    this._attributes = {};
    return success;
  }
  if (token != '=') {
    this._current_attribute = this.decodeHtml(token).toLowerCase();
    this._attributes[this._current_attribute] = '';
  }
  return true;
}

/**
*    Accepts a token from the end tag mode.
*    The element name is converted to lower case.
*    @param string token     Incoming characters.
*    @param integer evnt    Lexer evnt type.
*    @return boolean          False if parse error.
*    @access public
*/
XhtmlSaxParser.prototype.acceptEndToken = function (token, evnt) {
  matches = token.match(/<\/(.*)>/);
  if (matches.length == 0) {
    return false;
  }
  return this._listener.endElement(matches[1].toLowerCase());
}

/**
*    Part of the tag data.
*    @param string token     Incoming characters.
*    @param integer evnt    Lexer evnt type.
*    @return boolean          False if parse error.
*    @access public
*/
XhtmlSaxParser.prototype.acceptAttributeToken = function (token, evnt) {
  if (evnt == LEXER_UNMATCHED) {
    this._attributes[this._current_attribute] += this.decodeHtml(token);    
  }
  if (evnt == LEXER_SPECIAL) {
    this._attributes[this._current_attribute] += this.decodeHtml(token).replace(/^=\s*/ , '');
  }
  return true;
}

/**
*    A character entity.
*    @param string token    Incoming characters.
*    @param integer evnt   Lexer evnt type.
*    @return boolean         False if parse error.
*    @access public
*/
XhtmlSaxParser.prototype.acceptEntityToken = function (token, evnt) {
}

/**
*    Character data between tags regarded as
*    important.
*    @param string $token     Incoming characters.
*    @param integer $evnt    Lexer evnt type.
*    @return boolean          False if parse error.
*    @access public
*/
XhtmlSaxParser.prototype.acceptTextToken = function (token, evnt) {
  return this._listener.addContent(token);
}

/**
*    Incoming data to be ignored.
*    @param string $token     Incoming characters.
*    @param integer $evnt    Lexer evnt type.
*    @return boolean          False if parse error.
*    @access public
*/
XhtmlSaxParser.prototype.ignore = function (token, evnt) {
  return true;
}

/**
*    Decodes any HTML entities.
*    @param string $html    Incoming HTML.
*    @return string         Outgoing plain text.
*    @access public
*    @static
*/
XhtmlSaxParser.prototype.decodeHtml = function (html) {
  var entities = ['&nbsp;','&iexcl;','&cent;','&pound;','&curren;','&yen;','&brvbar;','&sect;',
  '&uml;','&copy;','&ordf;','&laquo;','&not;','&shy;','&reg;',
  '&macr;','&deg;','&plusmn;','&sup2;','&sup3;','&acute;','&micro;',
  '&para;','&middot;','&cedil;','&sup1;','&ordm;','&raquo;','&frac14;',
  '&frac12;','&frac34;','&iquest;','&Agrave;','&Aacute;','&Acirc;','&Atilde;',
  '&Auml;','&Aring;','&AElig;','&Ccedil;','&Egrave;','&Eacute;','&Ecirc;',
  '&Euml;','&Igrave;','&Iacute;','&Icirc;','&Iuml;','&ETH;','&Ntilde;',
  '&Ograve;','&Oacute;','&Ocirc;','&Otilde;','&Ouml;','&times;','&Oslash;',
  '&Ugrave;','&Uacute;','&Ucirc;','&Uuml;','&Yacute;','&THORN;','&szlig;',
  '&agrave;','&aacute;','&acirc;','&atilde;','&auml;','&aring;','&aelig;',
  '&ccedil;','&egrave;','&eacute;','&ecirc;','&euml;','&igrave;','&iacute;',
  '&icirc;','&iuml;','&eth;','&ntilde;','&ograve;','&oacute;','&ocirc;',
  '&otilde;','&ouml;','&divide;','&oslash;','&ugrave;','&uacute;','&ucirc;',
  '&uuml;','&yacute;','&thorn;','&yuml;','&quot;','&lt;','&gt;',
  '&amp;'];

  var chars = ["\xa0","\xa1","\xa2","\xa3","\xa4","\xa5","\xa6","\xa7","\xa8","\xa9","\xaa",
  "\xab","\xac","\xad","\xae","\xaf","\xb0","\xb1","\xb2","\xb3","\xb4",
  "\xb5","\xb6","\xb7","\xb8","\xb9","\xba","\xbb","\xbc","\xbd","\xbe",
  "\xbf","\xc0","\xc1","\xc2","\xc3","\xc4","\xc5","\xc6","\xc7","\xc8",
  "\xc9","\xca","\xcb","\xcc","\xcd","\xce","\xcf","\xd0","\xd1","\xd2",
  "\xd3","\xd4","\xd5","\xd6","\xd7","\xd8","\xd9","\xda","\xdb","\xdc",
  "\xdd","\xde","\xdf","\xe0","\xe1","\xe2","\xe3","\xe4","\xe5","\xe6",
  "\xe7","\xe8","\xe9","\xea","\xeb","\xec","\xed","\xee","\xef","\xf0",
  "\xf1","\xf2","\xf3","\xf4","\xf5","\xf6","\xf7","\xf8","\xf9","\xfa",
  "\xfb","\xfc","\xfd","\xfe","\xff","\x22","\x3c","\x3e","\x26"];

  for(var i = 0; i < entities.length; i++){
    html = html.replace(entities[i], chars[i]);
  }
  return html;
}

/**
*    Turns HTML into text browser visible text. Images
*    are converted to their alt text and tags are supressed.
*    Entities are converted to their visible representation.
*    @param string $html        HTML to convert.
*    @return string             Plain text.
*    @access public
*    @static
*/
XhtmlSaxParser.prototype.normalise = function (html) {
  return this.decodeHtml(
    html.replace(/<!--.*?-./, '').
    replace(/<img.*?alt\s*=\s*"(.*?)".*?>/, ' \$1 ').
    replace(/<img.*?alt\s*=\s*\'(.*?)\'.*?>/, ' \$1 ').
    replace(/<img.*?alt\s*=\s*([a-zA-Z_]+).*?>/, ' \$1 ').
    replace(/<.*?>/, '')
  ).
  replace(/\s+/, ' ').trim();;
}

/**
*    SAX evnt handler.
*    @package Parser
*    @subpackage WebTester
*    @abstract
*
*    Sets the document to write to.
*    @access public
*/
function SaxListener() {
}

/**
*    Start of element evnt.
*    @param string $name        Element name.
*    @param hash $attributes    Name value pairs.
*                               Attributes without content
*                               are marked as true.
*    @return boolean            False on parse error.
*    @access public
*/
SaxListener.prototype.startElement = function (name, attributes) {
console.log('start '+name);
console.log(attributes);
}

/**
*    End of element evnt.
*    @param string $name        Element name.
*    @return boolean            False on parse error.
*    @access public
*/
SaxListener.prototype.endElement = function (name) {
console.log('end '+name);
}

/**
*    Unparsed, but relevant data.
*    @param string $text        May include unparsed tags.
*    @return boolean            False on parse error.
*    @access public
*/
SaxListener.prototype.addContent = function (text) {
}

//var Parser = new XhtmlSaxParser(new SaxListener());
//Parser.parse(html);