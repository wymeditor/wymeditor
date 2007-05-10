Object.prototype.extends = function (oSuper) {
       for (sProperty in oSuper) {
               this[sProperty] = oSuper[sProperty];
       }
}

String.prototype.trim = function () {
  return this.replace(/^(\s*)|(\s*)$/gm,'');
}

/**
*    Compounded regular expression. Any of
*    the contained patterns could match and
*    when one does, it's label is returned.
* 
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
    this._regex = new RegExp(this._patterns.join("|") ,this._getPerlMatchingFlags());
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
*
*    Sets up the lexer in case insensitive matching
*    by default.
*    @param Parser parser  Handling strategy by reference.
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
  //parsed = this._reduce(raw);
  while (typeof (parsed = this._reduce(raw)) == 'object') {    
    var raw = parsed[0];
    var unmatched = parsed[1];
    var matched = parsed[2];
    var mode = parsed[3];    
    
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

  if (!/ +/.test(content) && ((content === '') || (content == false))) { 
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
  var match = matched[1];
  var action = matched[0];
  if (action) { 
    unparsed_character_count = raw.indexOf(match);
    unparsed = raw.substr(0, unparsed_character_count);
    raw = raw.substring(unparsed_character_count + match.length);
    return [raw, unparsed, match, action];
  }
  return true;
}
