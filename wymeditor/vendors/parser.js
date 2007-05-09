
Object.prototype.extends = function (oSuper) {
       for (sProperty in oSuper) {
               this[sProperty] = oSuper[sProperty];
       }
}

/**
*    Constructor. Starts with no patterns.
*    @param boolean case    True for case sensitive, false
*                            for insensitive.
*    @access public
*/
function ParallelRegex(case_sensitive) {
  this._case = case_sensitive;
  this._patterns = [];
  this._labels = [];
  this._regex = null;
}

/**
*    Compounded regular expression. Any of
*    the contained patterns could match and
*    when one does, it's label is returned.
*    @package Test
*    @subpackage WebTester
*/

/**
*    Adds a pattern with an optional label.
*    @param string pattern      Perl style regex, but ( and )
*                                lose the usual meaning.
*    @param string label        Label of regex to be returned
*                                on a match.
*    @access public
*/
ParallelRegex.prototype.addPattern = function(pattern, label) {
  label = label || true;
  var count = this._patterns.length;
  this._patterns[count] = pattern;
  this._labels[count] = label;
  this._regex = null;
}

/**
*    Attempts to match all patterns at once against
*    a string.
*    @param string subject      String to match against.
*    
*    @return boolean             True on success.
*    @return string match         First matched portion of
*                                subject.
*    @access public
*/
ParallelRegex.prototype.match = function(subject) {

  if (this._patterns.length == 0) {
    return [false, ''];
  }
  matches = subject.match(this._getCompoundedRegex());
  if(!matches){
    return [false, ''];
  }
  var match = matches[0];
  for (i = 1; i < matches.length; i++) {
    if (matches[i]) {
      return [this._labels[i-1], match];
    }
  }
  return [true, matches[0]];
}

/**
*    Compounds the patterns into a single
*    regular expression separated with the
*    "or" operator. Caches the regex.
*    Will automatically escape (, ) and / tokens.
*    @param array patterns    List of patterns in order.
*    @access private
*/
ParallelRegex.prototype._getCompoundedRegex = function() {
  
  if (this._regex == null) {
      for (i = 0, count = this._patterns.length; i < count; i++) {
      this._patterns[i] = '(' + this._patterns[i].replace(/([\/\(\)])/g,'\\$1') + ')';
    }
    this._regex = new RegExp("/" + this._patterns.join("|") + "/" ,this._getPerlMatchingFlags());
  }

  return this._regex;
}

/**
*    Accessor for perl regex mode flags to use.
*    @return string       Perl regex flags.
*    @access private
*/
ParallelRegex.prototype._getPerlMatchingFlags = function() {
  return (this._case ? "m" : "mi");
}



/**
*    States for a stack machine.
*    @subpackage WebTester
*
*    Constructor. Starts in named state.
*    @param string start        Starting state name.
*    @access public
*/
function StateStack( start) {
  this._stack = [start];
}

/**
*    Accessor for current state.
*    @return string       State.
*    @access public
*/
StateStack.prototype.getCurrent = function () {
  return this._stack[this._stack.length - 1];
}

/**
*    Adds a state to the stack and sets it
*    to be the current state.
*    @param string state        New state.
*    @access public
*/
StateStack.prototype.enter = function (state) {
    this._stack.push(state);    
}

/**
*    Leaves the current state and reverts
*    to the previous one.
*    @return boolean    False if we drop off
*                       the bottom of the list.
*    @access public
*/
StateStack.prototype.leave = function () {
  if (this._stack.length == 1) {
    return false;
  }
  this._stack.pop();
  return true;
}



var LEXER_ENTER = 1;
var LEXER_MATCHED = 2;
var LEXER_UNMATCHED = 3;
var LEXER_EXIT = 4;
var LEXER_SPECIAL = 5;


/**
*    Accepts text and breaks it into tokens.
*    Some optimisation to make the sure the
*    content is only scanned by the PHP regex
*    parser once. Lexer modes must not start
*    with leading underscores.
*    @package Parser
*    @subpackage WebTester
*
*    Sets up the lexer in case insensitive matching
*    by default.
*    @param SaxParser parser  Handling strategy by
*                                    reference.
*    @param string start            Starting handler.
*    @param boolean case            True for case sensitive.
*    @access public
*/
function Lexer(parser, start, case_sensitive) {
  start = start || 'accept';
  this._case = case_sensitive || false;
  this._regexes = {};
  this._parser = parser;
  this._mode = new StateStack(start);
  this._mode_handlers = {};
  this._mode_handlers[start] = start;
}

/**
*    Adds a token search pattern for a particular
*    parsing mode. The pattern does not change the
*    current mode.
*    @param string pattern      Perl style regex, but ( and )
*                                lose the usual meaning.
*    @param string mode         Should only apply this
*                                pattern when dealing with
*                                this type of input.
*    @access public
*/
Lexer.prototype.addPattern = function (pattern, mode) {
  var mode = mode || "accept";
  if (this._regexes[mode] == undefined) {
    this._regexes[mode] = new ParallelRegex(this._case);
  }
  this._regexes[mode].addPattern(pattern);
  if (this._mode_handlers[mode] == undefined) {
    this._mode_handlers[mode] = mode;
  }
}

/**
*    Adds a pattern that will enter a new parsing
*    mode. Useful for entering parenthesis, strings,
*    tags, etc.
*    @param string pattern      Perl style regex, but ( and )
*                                lose the usual meaning.
*    @param string mode         Should only apply this
*                                pattern when dealing with
*                                this type of input.
*    @param string new_mode     Change parsing to this new
*                                nested mode.
*    @access public
*/
Lexer.prototype.addEntryPattern = function (pattern, mode, new_mode) {
  if (this._regexes[mode] == undefined) {
    this._regexes[mode] = new ParallelRegex(this._case);
  }
  this._regexes[mode].addPattern(pattern, new_mode);
  if (this._mode_handlers[new_mode] == undefined) {
    this._mode_handlers[new_mode] = new_mode;
  }
}

/**
*    Adds a pattern that will exit the current mode
*    and re-enter the previous one.
*    @param string pattern      Perl style regex, but ( and )
*                                lose the usual meaning.
*    @param string mode         Mode to leave.
*    @access public
*/
Lexer.prototype.addExitPattern = function (pattern, mode) {
  if (this._regexes[mode] == undefined) {
    this._regexes[mode] = new ParallelRegex(this._case);
  }
  this._regexes[mode].addPattern(pattern, "__exit");
  if (this._mode_handlers[mode] == undefined) {
    this._mode_handlers[mode] = mode;
  }
}

/**
*    Adds a pattern that has a special mode. Acts as an entry
*    and exit pattern in one go, effectively calling a special
*    parser handler for this token only.
*    @param string pattern      Perl style regex, but ( and )
*                                lose the usual meaning.
*    @param string mode         Should only apply this
*                                pattern when dealing with
*                                this type of input.
*    @param string special      Use this mode for this one token.
*    @access public
*/
Lexer.prototype.addSpecialPattern =  function (pattern, mode, special) {
  if (this._regexes[mode] == undefined) {
    this._regexes[mode] = new ParallelRegex(this._case);
  }
  this._regexes[mode].addPattern(pattern, '_'+special);
  if (this._mode_handlers[special] == undefined) {
    this._mode_handlers[special] = special;
  }
}

/**
*    Adds a mapping from a mode to another handler.
*    @param string mode        Mode to be remapped.
*    @param string handler     New target handler.
*    @access public
*/
Lexer.prototype.mapHandler = function (mode, handler) {
  this._mode_handlers[mode] = handler;
}

/**
*    Splits the page text into tokens. Will fail
*    if the handlers report an error or if no
*    content is consumed. If successful then each
*    unparsed and parsed token invokes a call to the
*    held listener.
*    @param string raw        Raw HTML text.
*    @return boolean           True on success, else false.
*    @access public
*/
Lexer.prototype.parse = function (raw) {
  if (this._parser == undefined) {
    return false;
  }
  length = raw.length;
  parsed = this._reduce(raw);
  while (typeof parsed == 'object') {    
    var raw = parsed[0];
    var unmatched = parsed[1];
    var matched = parsed[2];
    var mode = parsed[3];    
    parsed = this._reduce(raw)
    
    if (! this._dispatchTokens(unmatched, matched, mode)) {
      return false;
    }
    if (raw == '') {
      return true;
    }
    if (raw.length == length) {
      return false;
    }
    length = raw.length;    
  }
  if (! parsed ) {
    return false;
  }
  return this._invokeParser(raw, LEXER_UNMATCHED);
}

/**
*    Sends the matched token and any leading unmatched
*    text to the parser changing the lexer to a new
*    mode if one is listed.
*    @param string unmatched    Unmatched leading portion.
*    @param string matched      Actual token match.
*    @param string mode         Mode after match. A boolean
*                                false mode causes no change.
*    @return boolean             False if there was any error
*                                from the parser.
*    @access private
*/
Lexer.prototype._dispatchTokens = function (unmatched, matched, mode) {
  mode = mode || false;
  if (! this._invokeParser(unmatched, LEXER_UNMATCHED)) {
    return false;
  }
  if (typeof mode == 'boolean') {
    return this._invokeParser(matched, LEXER_MATCHED);
  }
  if (this._isModeEnd(mode)) {
    if (! this._invokeParser(matched, LEXER_EXIT)) {
      return false;
    }
    return this._mode.leave();
  }
  if (this._isSpecialMode(mode)) {
    this._mode.enter(this._decodeSpecial(mode));
    if (! this._invokeParser(matched, LEXER_SPECIAL)) {
      return false;
    }
    return this._mode.leave();
  }
  this._mode.enter(mode);
  return this._invokeParser(matched, LEXER_ENTER);
}

/**
*    Tests to see if the new mode is actually to leave
*    the current mode and pop an item from the matching
*    mode stack.
*    @param string mode    Mode to test.
*    @return boolean        True if this is the exit mode.
*    @access private
*/
Lexer.prototype._isModeEnd = function (mode) {
  return (mode === "__exit");
}

/**
*    Test to see if the mode is one where this mode
*    is entered for this token only and automatically
*    leaves immediately afterwoods.
*    @param string mode    Mode to test.
*    @return boolean        True if this is the exit mode.
*    @access private
*/
Lexer.prototype._isSpecialMode = function (mode) {
  return (mode[0] == "_");
}

/**
*    Strips the magic underscore marking single token
*    modes.
*    @param string mode    Mode to decode.
*    @return string         Underlying mode name.
*    @access private
*/
Lexer.prototype._decodeSpecial = function (mode) {
  return mode.substring(1);
}

/**
*    Calls the parser method named after the current
*    mode. Empty content will be ignored. The lexer
*    has a parser handler for each mode in the lexer.
*    @param string content        Text parsed.
*    @param boolean is_match      Token is recognised rather
*                                  than unparsed data.
*    @access private
*/
Lexer.prototype._invokeParser = function (content, is_match) {

  if ((content === '') || (content == false)) {    
    return true;
  }
  var current = this._mode.getCurrent();
  var handler = this._mode_handlers[current];
  var result;
   eval('result = this._parser.' + handler + '(content, is_match);')
  return result;
}

/**
*    Tries to match a chunk of text and if successful
*    removes the recognised chunk and any leading
*    unparsed data. Empty strings will not be matched.
*    @param string raw         The subject to parse. This is the
*                               content that will be eaten.
*    @return array/boolean      Three item list of unparsed
*                               content followed by the
*                               recognised token and finally the
*                               action the parser is to take.
*                               True if no match, false if there
*                               is a parsing error.
*    @access private
*/
Lexer.prototype._reduce = function (raw) {
  var matched = this._regexes[this._mode.getCurrent()].match(raw);  
  if (matched[0]) { 
    unparsed_character_count = raw.indexOf(matched[1]);
    unparsed = raw.substr(0, unparsed_character_count);
    raw = raw.substring(unparsed_character_count + matched[1].length);
    return [raw, unparsed, matched[1], matched[0]];
  }
  return true;
}



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
  return ['a', 'title', 'form', 'input', 'button', 'textarea', 'select',
  'option', 'frameset', 'frame', 'label'];
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
  this._attributes = [];
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
    this._attributes = [];
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
  replace(/\s+/, ' ').
  replace(/^(\s*)|(\s*)$/gm,'');
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
//console.log(Parser);
//Parser.parse(document.body.innerHTML);