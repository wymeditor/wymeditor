/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (C) 2007 H.O.net - http://www.honet.be/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *        http://www.wymeditor.org/
 *
 * File Name:
 *        jquery.wymeditor.tidy.js
 *        HTML Tidy plugin for WYMeditor
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne@wymeditor.org)
 */

//Extend WYMeditor
Wymeditor.prototype.tidy = function(options) {
  var tidy = new WymTidy(options);
  tidy.init(this);
};

//WymTidy constructor
function WymTidy(options) {

  options = $j.extend({

    sUrl:          "wymeditor/plugins/tidy/tidy.php",
    sButtonHtml:   "<li class='wym_tools_tidy'>"
                 + "<a name='CleanUp' href='#'"
                 + " style='background-image:"
                 + " url(wymeditor/plugins/tidy/wand.png)'>"
                 + "Clean up HTML"
                 + "</a></li>",
    sToolsListSelector: " ul",
    sButtonSelector: "li.wym_tools_tidy a"
    
  }, options);
  
  this._options = options;

};

//WymTidy initialization
WymTidy.prototype.init = function(wym) {

  var tidy = this;
            
  $j(wym._box).find(
    wym._options.sToolsSelector + this._options.sToolsListSelector)
    .append(this._options.sButtonHtml);
  
  //handle click event
  $j(wym._box).find(this._options.sButtonSelector).click(function() {
    tidy.cleanup(wym);
    return(false);
  });

};

//WymTidy cleanup
WymTidy.prototype.cleanup = function(wym) {

    var sHtml = "<html><body>" + wym.xhtml() + "</body></html>";

    $j.post(this._options.sUrl, { html: sHtml}, function(data) {

        if(data.length > 0 && data != '0') {
          wym.html(data);
          wym.status("HTML has been cleaned up.");
        } else {
          wym.status("An error occurred.");
        }
    });
};
