/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (c) 2005 - 2011 Jean-Francois Hovinne, http://www.wymeditor.org/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *        http://www.wymeditor.org/
 *
 * File Name:
 *        jquery.wymeditor.rdfa.js
 *        RDFa plugin for WYMeditor
 *
 * File Authors:
 *        Jean-Francois Hovinne (@jfhovinne)
 */

//Extend WYMeditor
WYMeditor.editor.prototype.rdfa = function(options) {
    var rdfa = new WYMeditor.RDFa(options, this);
    return(rdfa);
};

//RDFa constructor
WYMeditor.RDFa = function(options, wym) {
    options = jQuery.extend({
        addNameSpaces: true,
        extendXHTMLParser: true,
        buttons: {}
    }, options);

    this._options = options;
    this._wym = wym;
    this.init();
};

//RDFa plugin init
WYMeditor.RDFa.prototype.init = function() {
    if(this._options.addNameSpaces) this.addNameSpaces();
    if(this._options.extendXHTMLParser) this.extendXHTMLParser();
    this.setButtons();
};

//Adding the namespaces to the document
WYMeditor.RDFa.prototype.addNameSpaces = function() {
    jQuery('html', this._wym._doc)
        .attr('xmlns', 'http://www.w3.org/1999/xhtml')
        .attr('version', 'XHTML+RDFa 1.0');
};

WYMeditor.RDFa.prototype.extendXHTMLParser = function() {
    //Add the RDFa attributes
    WYMeditor.XhtmlValidator._attributes['core']['attributes'].push(
        'rel',
        'rev',
        'content',
        'href',
        'src',
        'about',
        'property',
        'resource',
        'datatype',
        'typeof');

    //Add the 'standard' vocabularies
    WYMeditor.XhtmlValidator._attributes['core']['attributes'].push(
        'xmlns:biblio',
        'xmlns:cc',
        'xmlns:dbp',
        'xmlns:dbr',
        'xmlns:dc',
        'xmlns:ex',
        'xmlns:foaf',
        'xmlns:rdf',
        'xmlns:rdfs',
        'xmlns:taxo',
        'xmlns:xhv',
        'xmlns:xsd');

    //Overwrite the <a> attributes 'rel' and 'rev'
    WYMeditor.XhtmlValidator._tags['a'] = {
        "attributes": {
            "0":"charset",
            "1":"coords",
            "2":"href",
            "3":"hreflang",
            "4":"name",
            "5":"rel",
            "6":"rev",
            "shape":/^(rect|rectangle|circ|circle|poly|polygon)$/,
            "7":"type"
        }
    };
};

WYMeditor.RDFa.prototype.setButtons = function() {
    var _this = this;
    var list = jQuery(this._wym._box).find('div.wym_classes ul');
    jQuery.each(this._options.buttons, function(index, ns) {
        jQuery.each(ns, function(attr, arr) {
            var attr = attr;
            jQuery.each(arr, function(i, value) {
                list
                  .append('<li></li>')
                  .children(':last')
                  .append('<a></a>')
                  .children(':last')
                  .attr('href', '#')
                  .text(attr + ' ' + value)
                  .bind('click', {instance: _this._wym, button: $(this), ns: index, attr: attr, value: value}, _this.clickButtonHandler);
            });
        });
    });
};

WYMeditor.RDFa.prototype.clickButtonHandler = function(evt) {
    var wym = evt.data.instance,
        selected  = wym.selected();

    //the attribute already exists, remove it
    if( jQuery(selected).attr(evt.data.attr) != undefined && jQuery(selected).attr(evt.data.attr) != '') {
        WYMeditor.console.log('attribute already exists, remove it:', evt.data.attr, jQuery(selected).attr(evt.data.attr));
        jQuery(selected).removeAttr(evt.data.attr);

    //else, add it
    } else {
        WYMeditor.console.log('attribute does not exist, add it:', evt.data.attr, evt.data.value);
        if(evt.data.value) { //value available
            jQuery(selected).attr(evt.data.attr, evt.data.ns + ':' + evt.data.value);
        } else { //value not available
            evt.data.value = prompt('Value', '');
            if(evt.data.value != null) jQuery(selected).attr(evt.data.attr, evt.data.value);
        }
    }
};
