Wymeditor.prototype.hovertools = function() {
  
  var wym = this;
  
  //bind events on buttons
  $(this._box).find('.wym_tools a').hover(
    function() {
      wym.status($(this).html());
    },
    function() {
      wym.status('&nbsp;');
    }
  );

  //classes: add/remove a style attr to matching elems
  //while mouseover/mouseout
  $(this._box).find('.wym_classes a').hover(
    function() {
      var aClasses = eval(wym._options.aClassesItems);
      var sName = $j(this).attr(sWYM_NAME);
      var oClass = aClasses.findByName(sName);

      if(oClass){
        jqexpr = oClass.expr;
        $(wym._doc).find(jqexpr).css('background-color','#cfc');
      }
    },
    function() {
      $(wym._doc).find('*').removeAttr('style');
    }
  );

};
