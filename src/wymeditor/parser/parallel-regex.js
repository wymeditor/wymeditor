/**
*    Compounded regular expression. Any of
*    the contained patterns could match and
*    when one does, it's label is returned.
*
*    Constructor. Starts with no patterns.
*    @param boolean case    True for case sensitive, false
*                            for insensitive.
*    @access public
*    @author Marcus Baker (http://lastcraft.com)
*    @author Bermi Ferrer (http://bermi.org)
*/
WYMeditor.ParallelRegex = function(case_sensitive)
{
    this._case = case_sensitive;
    this._patterns = [];
    this._labels = [];
    this._regex = null;
    return this;
};


/**
*    Adds a pattern with an optional label.
*    @param string pattern      Perl style regex, but ( and )
*                                lose the usual meaning.
*    @param string label        Label of regex to be returned
*                                on a match.
*    @access public
*/
WYMeditor.ParallelRegex.prototype.addPattern = function(pattern, label)
{
    label = label || true;
    var count = this._patterns.length;
    this._patterns[count] = pattern;
    this._labels[count] = label;
    this._regex = null;
};

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
WYMeditor.ParallelRegex.prototype.match = function(subject)
{
    if (this._patterns.length === 0) {
        return [false, ''];
    }
    var matches = subject.match(this._getCompoundedRegex());

    if(!matches){
        return [false, ''];
    }
    var match = matches[0];
    for (var i = 1; i < matches.length; i++) {
        if (matches[i]) {
            return [this._labels[i-1], match];
        }
    }
    return [true, matches[0]];
};

/**
*    Compounds the patterns into a single
*    regular expression separated with the
*    "or" operator. Caches the regex.
*    Will automatically escape (, ) and / tokens.
*    @param array patterns    List of patterns in order.
*    @access private
*/
WYMeditor.ParallelRegex.prototype._getCompoundedRegex = function()
{
    if (this._regex === null) {
        for (var i = 0, count = this._patterns.length; i < count; i++) {
            this._patterns[i] = '(' + this._untokenizeRegex(this._tokenizeRegex(this._patterns[i]).replace(/([\/\(\)])/g,'\\$1')) + ')';
        }
        this._regex = new RegExp(this._patterns.join("|") ,this._getPerlMatchingFlags());
    }
    return this._regex;
};

/**
* Escape lookahead/lookbehind blocks
*/
WYMeditor.ParallelRegex.prototype._tokenizeRegex = function(regex)
{
    return regex.
    replace(/\(\?(i|m|s|x|U)\)/,     '~~~~~~Tk1\$1~~~~~~').
    replace(/\(\?(\-[i|m|s|x|U])\)/, '~~~~~~Tk2\$1~~~~~~').
    replace(/\(\?\=(.*)\)/,          '~~~~~~Tk3\$1~~~~~~').
    replace(/\(\?\!(.*)\)/,          '~~~~~~Tk4\$1~~~~~~').
    replace(/\(\?\<\=(.*)\)/,        '~~~~~~Tk5\$1~~~~~~').
    replace(/\(\?\<\!(.*)\)/,        '~~~~~~Tk6\$1~~~~~~').
    replace(/\(\?\:(.*)\)/,          '~~~~~~Tk7\$1~~~~~~');
};

/**
* Unscape lookahead/lookbehind blocks
*/
WYMeditor.ParallelRegex.prototype._untokenizeRegex = function(regex)
{
    return regex.
    replace(/~~~~~~Tk1(.{1})~~~~~~/,    "(?\$1)").
    replace(/~~~~~~Tk2(.{2})~~~~~~/,    "(?\$1)").
    replace(/~~~~~~Tk3(.*)~~~~~~/,      "(?=\$1)").
    replace(/~~~~~~Tk4(.*)~~~~~~/,      "(?!\$1)").
    replace(/~~~~~~Tk5(.*)~~~~~~/,      "(?<=\$1)").
    replace(/~~~~~~Tk6(.*)~~~~~~/,      "(?<!\$1)").
    replace(/~~~~~~Tk7(.*)~~~~~~/,      "(?:\$1)");
};


/**
*    Accessor for perl regex mode flags to use.
*    @return string       Perl regex flags.
*    @access private
*/
WYMeditor.ParallelRegex.prototype._getPerlMatchingFlags = function()
{
    return (this._case ? "m" : "mi");
};

