// GLOBALS
WYMeditor.LEXER_ENTER = 1;
WYMeditor.LEXER_MATCHED = 2;
WYMeditor.LEXER_UNMATCHED = 3;
WYMeditor.LEXER_EXIT = 4;
WYMeditor.LEXER_SPECIAL = 5;


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
*    @author Marcus Baker (http://lastcraft.com)
*    @author Bermi Ferrer (http://bermi.org)
*/
WYMeditor.Lexer = function(parser, start, case_sensitive)
{
    start = start || 'accept';
    this._case = case_sensitive || false;
    this._regexes = {};
    this._parser = parser;
    this._mode = new WYMeditor.StateStack(start);
    this._mode_handlers = {};
    this._mode_handlers[start] = start;
    return this;
};

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
WYMeditor.Lexer.prototype.addPattern = function(pattern, mode)
{
    mode = mode || "accept";
    if (typeof this._regexes[mode] == 'undefined') {
        this._regexes[mode] = new WYMeditor.ParallelRegex(this._case);
    }
    this._regexes[mode].addPattern(pattern);
    if (typeof this._mode_handlers[mode] == 'undefined') {
        this._mode_handlers[mode] = mode;
    }
};

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
WYMeditor.Lexer.prototype.addEntryPattern = function(pattern, mode, new_mode)
{
    if (typeof this._regexes[mode] == 'undefined') {
        this._regexes[mode] = new WYMeditor.ParallelRegex(this._case);
    }
    this._regexes[mode].addPattern(pattern, new_mode);
    if (typeof this._mode_handlers[new_mode] == 'undefined') {
        this._mode_handlers[new_mode] = new_mode;
    }
};

/**
*    Adds a pattern that will exit the current mode
*    and re-enter the previous one.
*    @param string pattern      Perl style regex, but ( and )
*                                lose the usual meaning.
*    @param string mode         Mode to leave.
*    @access public
*/
WYMeditor.Lexer.prototype.addExitPattern = function(pattern, mode)
{
    if (typeof this._regexes[mode] == 'undefined') {
        this._regexes[mode] = new WYMeditor.ParallelRegex(this._case);
    }
    this._regexes[mode].addPattern(pattern, "__exit");
    if (typeof this._mode_handlers[mode] == 'undefined') {
        this._mode_handlers[mode] = mode;
    }
};

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
WYMeditor.Lexer.prototype.addSpecialPattern =  function(pattern, mode, special)
{
    if (typeof this._regexes[mode] == 'undefined') {
        this._regexes[mode] = new WYMeditor.ParallelRegex(this._case);
    }
    this._regexes[mode].addPattern(pattern, '_'+special);
    if (typeof this._mode_handlers[special] == 'undefined') {
        this._mode_handlers[special] = special;
    }
};

/**
*    Adds a mapping from a mode to another handler.
*    @param string mode        Mode to be remapped.
*    @param string handler     New target handler.
*    @access public
*/
WYMeditor.Lexer.prototype.mapHandler = function(mode, handler)
{
    this._mode_handlers[mode] = handler;
};

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
WYMeditor.Lexer.prototype.parse = function(raw) {
    if (typeof this._parser == 'undefined') {
        return false;
    }

    var length = raw.length;
    var parsed;
    while (typeof (parsed = this._reduce(raw)) == 'object') {
        raw = parsed[0];
        var unmatched = parsed[1];
        var matched = parsed[2];
        var mode = parsed[3];

        if (! this._dispatchTokens(unmatched, matched, mode)) {
            return false;
        }

        if (raw === '') {
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

    return this._invokeParser(raw, WYMeditor.LEXER_UNMATCHED);
};

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
WYMeditor.Lexer.prototype._dispatchTokens = function(unmatched, matched, mode) {
    mode = mode || false;

    if (! this._invokeParser(unmatched, WYMeditor.LEXER_UNMATCHED)) {
        return false;
    }

    if (typeof mode == 'boolean') {
        return this._invokeParser(matched, WYMeditor.LEXER_MATCHED);
    }
    if (this._isModeEnd(mode)) {
        if (! this._invokeParser(matched, WYMeditor.LEXER_EXIT)) {
            return false;
        }
        return this._mode.leave();
    }
    if (this._isSpecialMode(mode)) {
        this._mode.enter(this._decodeSpecial(mode));
        if (! this._invokeParser(matched, WYMeditor.LEXER_SPECIAL)) {
            return false;
        }
        return this._mode.leave();
    }
    this._mode.enter(mode);

    return this._invokeParser(matched, WYMeditor.LEXER_ENTER);
};

/**
*    Tests to see if the new mode is actually to leave
*    the current mode and pop an item from the matching
*    mode stack.
*    @param string mode    Mode to test.
*    @return boolean        True if this is the exit mode.
*    @access private
*/
WYMeditor.Lexer.prototype._isModeEnd = function(mode) {
    return (mode === "__exit");
};

/**
*    Test to see if the mode is one where this mode
*    is entered for this token only and automatically
*    leaves immediately afterwoods.
*    @param string mode    Mode to test.
*    @return boolean        True if this is the exit mode.
*    @access private
*/
WYMeditor.Lexer.prototype._isSpecialMode = function(mode) {
    return (mode.substring(0,1) == "_");
};

/**
*    Strips the magic underscore marking single token
*    modes.
*    @param string mode    Mode to decode.
*    @return string         Underlying mode name.
*    @access private
*/
WYMeditor.Lexer.prototype._decodeSpecial = function(mode) {
    return mode.substring(1);
};

/**
*    Calls the parser method named after the current
*    mode. Empty content will be ignored. The lexer
*    has a parser handler for each mode in the lexer.
*    @param string content        Text parsed.
*    @param boolean is_match      Token is recognised rather
*                                  than unparsed data.
*    @access private
*/
WYMeditor.Lexer.prototype._invokeParser = function(content, is_match) {
    if (content === '') {
        return true;
    }
    var current = this._mode.getCurrent();
    var handler = this._mode_handlers[current];
    var result = this._parser[handler](content, is_match);
    return result;
};

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
WYMeditor.Lexer.prototype._reduce = function(raw) {
    var matched = this._regexes[this._mode.getCurrent()].match(raw);
    var match = matched[1];
    var action = matched[0];
    if (action) {
        var unparsed_character_count = raw.indexOf(match);
        var unparsed = raw.substr(0, unparsed_character_count);
        raw = raw.substring(unparsed_character_count + match.length);
        return [raw, unparsed, match, action];
    }
    return true;
};

