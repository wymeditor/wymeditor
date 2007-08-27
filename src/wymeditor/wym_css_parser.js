
function WymCssLexer(parser, only_wym_blocks)
{
  var only_wym_blocks = (only_wym_blocks == undefined ? true : only_wym_blocks);

  jQuery.extend(this, new Lexer(parser, (only_wym_blocks?'Ignore':'WymCss')));

  this.mapHandler('WymCss', 'Ignore');

  if(only_wym_blocks == true){    
    this.addEntryPattern("/\\\x2a[<\\s]*WYMeditor[>\\s]*\\\x2a/", 'Ignore', 'WymCss');
    this.addExitPattern("/\\\x2a[<\/\\s]*WYMeditor[>\\s]*\\\x2a/", 'WymCss');
  }

  this.addSpecialPattern("\\\x2e[a-z-_0-9]+[\\sa-z]*", 'WymCss', 'WymCssStyleDeclaration');

  this.addEntryPattern("/\\\x2a", 'WymCss', 'WymCssComment');
  this.addExitPattern("\\\x2a/", 'WymCssComment');

  this.addEntryPattern("\x7b", 'WymCss', 'WymCssStyle');
  this.addExitPattern("\x7d", 'WymCssStyle');

  this.addEntryPattern("/\\\x2a", 'WymCssStyle', 'WymCssFeddbackStyle');
  this.addExitPattern("\\\x2a/", 'WymCssFeddbackStyle');

  return this;
};

function WymCssParser()
{
  this._in_style = false;
  this._has_title = false;
  this.only_wym_blocks = true;
  this.css_settings = {'classesItems':[], 'editorStyles':[], 'dialogStyles':[]};
  return this;
};

WymCssParser.prototype.parse = function(raw, only_wym_blocks)
{
  var only_wym_blocks = (only_wym_blocks == undefined ? this.only_wym_blocks : only_wym_blocks);
  this._Lexer = new WymCssLexer(this, only_wym_blocks);  
  this._Lexer.parse(raw);  
};

WymCssParser.prototype.Ignore = function(match, state)
{
  return true;
};

WymCssParser.prototype.WymCssComment = function(text, status)
{ 
  if(text.match(/end[a-z0-9\s]*wym[a-z0-9\s]*/mi)){
    return false;
  }
  if(status == LEXER_UNMATCHED){
    if(!this._in_style){
      this._has_title = true;
      this._current_item = {'title':text.trim()};      
    }else{
      if(this._current_item[this._current_element]){
        if(!this._current_item[this._current_element].expressions){
          this._current_item[this._current_element].expressions = [text];
        }else{
          this._current_item[this._current_element].expressions.push(text);
        }
      }
    }
    this._in_style = true;
  }
  return true;
};

WymCssParser.prototype.WymCssStyle = function(match, status)
{
  if(status == LEXER_UNMATCHED){    
    match = match.trim();
    if(match != ''){
      this._current_item[this._current_element].style = match;
    }
  }else if (status == LEXER_EXIT){    
    this._in_style = false;
    this._has_title = false;
    this.addStyleSetting(this._current_item);
  }
  return true;
};

WymCssParser.prototype.WymCssFeddbackStyle = function(match, status)
{ 
  if(status == LEXER_UNMATCHED){
    this._current_item[this._current_element].feedback_style = match.replace(/^([\s\/\*]*)|([\s\/\*]*)$/gm,'');
  }
  return true;
};

WymCssParser.prototype.WymCssStyleDeclaration = function(match)
{
  match = match.replace(/^([\s\.]*)|([\s\.*]*)$/gm, '');

  var tag = '';
  if(match.indexOf(' ') > 0){
    var parts = match.split(' ');
    this._current_element = parts[0];
    var tag = parts[1];
  }else{
    this._current_element = match;    
  }

  if(!this._has_title){
    this._current_item = {'title':(!tag?'':tag.toUpperCase()+': ')+this._current_element};    
    this._has_title = true;
  }

  if(!this._current_item[this._current_element]){
    this._current_item[this._current_element] = {'name':this._current_element};
  }
  if(tag){
    if(!this._current_item[this._current_element].tags){
      this._current_item[this._current_element].tags = [tag];
    }else{
      this._current_item[this._current_element].tags.push(tag);      
    }
  }
  return true;
};

WymCssParser.prototype.addStyleSetting = function(style_details)
{
  for (var name in style_details){
    var details = style_details[name];
    if(typeof details == 'object' && name != 'title'){
      
      this.css_settings.classesItems.push({
        'name': details.name.trim(),
        'title': style_details.title,
        'expr' : (details.expressions||details.tags).join(', ').trim()
      });
      if(details.feedback_style){
        this.css_settings.editorStyles.push({
          'name': '.'+details.name.trim(),
          'css': details.feedback_style
        });        
      }
      if(details.style){
        this.css_settings.dialogStyles.push({
          'name': '.'+details.name.trim(),
          'css': details.style
        });
      }
    }
  }
};

