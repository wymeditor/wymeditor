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
 *        jquery.wymeditor.explorer.js
 *        MSIE specific class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne@wymeditor.org)
 */

function WymClassExplorer(wym) {
    
    this._wym = wym;
    this._class = "className";
    this._newLine = "\r\n";
};

WymClassExplorer.prototype.initIframe = function(iframe) {

    //This function is executed twice, though it is called once!
    //But MSIE needs that, otherwise designMode won't work.
    //Weird.
    
    this._iframe = iframe;
    this._doc = iframe.contentWindow.document;
    
    //add css rules from options
    var styles = this._doc.styleSheets[0];
    var aCss = eval(this._options.aEditorCss);

    this.addCssRules(this._doc, aCss);

    this._doc.title = this._wym._index;
    
    //init html value
    $j(this._doc.body).html(this._wym._html);
    
    //handle events
    var wym = this;
    this._doc.onbeforedeactivate = function() {wym.saveCaret();};
    this._doc.onkeyup = function() {
      wym.saveCaret();
      wym.keyup();
    };
    this._doc.onclick = function() {wym.saveCaret();};
    
    this._doc.body.onbeforepaste = function() {
      wym._iframe.contentWindow.event.returnValue = false;
    };
    
    this._doc.body.onpaste = function() {
      wym._iframe.contentWindow.event.returnValue = false;
      wym.paste(window.clipboardData.getData("Text"));
    };
    
    //callback can't be executed twice, so we check
    if(this._initialized) {
      
      //pre-bind functions
      if($j.isFunction(this._options.fPreBind)) this._options.fPreBind(this);
      
      //bind external events
      this._wym.bindEvents();
      
      //post-init functions
      if($j.isFunction(this._options.fPostInit)) this._options.fPostInit(this);
      
      //add event listeners to doc elements, e.g. images
      this.listen();
    }
    
    this._initialized = true;
    
    //init designMode
    this._doc.designMode="on";
    this._doc = iframe.contentWindow.document;
};

WymClassExplorer.prototype._exec = function(cmd,param) {

    if(param) this._doc.execCommand(cmd,false,param);
    else this._doc.execCommand(cmd);
    
    this.listen();
};

WymClassExplorer.prototype.selected = function() {

    var caretPos = this._iframe.contentWindow.document.caretPos;
        if(caretPos!=null) {
            if(caretPos.parentElement!=undefined)
              return(caretPos.parentElement());
        }
};

WymClassExplorer.prototype.saveCaret = function() {

    this._doc.caretPos = this._doc.selection.createRange();
};

WymClassExplorer.prototype.addCssRule = function(styles, oCss) {

    styles.addRule(oCss.name, oCss.css);
};

WymClassExplorer.prototype.xhtml = function() {

    var sHtml = this._wym.html();

    var entities = ['nbsp','iexcl','cent', 'pound','curren','yen','brvbar',
    'sect','uml','copy', 'ordf','laquo','not','shy','reg','macr','deg',
    'plusmn','sup2','sup3','acute','micro','para','middot','cedil','sup1',
    'ordm','raquo','frac14','frac12','frac34', 'iquest','Agrave','Aacute',
    'Acirc','Atilde','Auml','Aring', 'AElig','Ccedil','Egrave','Eacute',
    'Ecirc','Euml','Igrave', 'Iacute','Icirc','Iuml','ETH','Ntilde','Ograve',
    'Oacute', 'Ocirc','Otilde','Ouml','times','Oslash','Ugrave','Uacute',
    'Ucirc','Uuml','Yacute','THORN','szlig','agrave','aacute', 'acirc',
    'atilde','auml','aring','aelig','ccedil','egrave', 'eacute','ecirc',
    'euml','igrave','iacute','icirc','iuml', 'eth','ntilde','ograve','oacute',
    'ocirc','otilde','ouml', 'divide','oslash','ugrave','uacute','ucirc',
    'uuml','yacute','thorn','yuml','OElig','oelig','Scaron','scaron','Yuml',
    'fnof','circ','tilde','Alpha','Beta','Gamma','Delta', 'Epsilon','Zeta',
    'Eta','Theta','Iota','Kappa','Lambda', 'Mu','Nu','Xi','Omicron','Pi',
    'Rho','Sigma', 'Tau','Upsilon','Phi','Chi','Psi','Omega','alpha', 'beta',
    'gamma','delta','epsilon','zeta','eta','theta', 'iota','kappa','lambda',
    'mu','nu','xi','omicron', 'pi','rho','sigmaf','sigma','tau','upsilon',
    'phi', 'chi','psi','omega','thetasym','upsih','piv','ensp', 'emsp',
    'thinsp','zwnj','zwj','lrm','rlm','ndash', 'mdash','lsquo','rsquo',
    'sbquo','ldquo','rdquo','bdquo', 'dagger','Dagger','bull','hellip',
    'permil','prime','Prime', 'lsaquo','rsaquo','oline','frasl','euro',
    'image','weierp', 'real','trade','alefsym','larr','uarr','rarr','darr',
    'harr','crarr','lArr','uArr','rArr','dArr','hArr', 'forall','part',
    'exist','empty','nabla','isin','notin', 'ni','prod','sum','minus',
    'lowast','radic','prop', 'infin','ang','and','or','cap','cup','int',
    'there4','sim','cong','asymp','ne','equiv','le', 'ge','sub','sup','nsub',
    'sube','supe','oplus', 'otimes','perp','sdot','lceil','rceil','lfloor',
    'rfloor', 'lang','rang','loz','spades','clubs','hearts','diams'];

    var numEntities = ['160','161','162','163','164','165','166','167','168',
    '169','170','171','172','173','174','175','176','177','178','179','180',
    '181','182','183','184','185','186','187','188','189','190','191','192',
    '193','194','195','196','197','198','199','200','201','202','203','204',
    '205','206','207','208','209','210','211','212','213','214','215','216',
    '217','218','219','220','221','222','223','224','225','226','227','228',
    '229','230','231','232','233','234','235','236','237','238','239','240',
    '241','242','243','244','245','246','247','248','249','250','251','252',
    '253','254','255','338','339','352','353','376','402','710','732','913',
    '914','915','916','917','918','919','920','921','922','923','924','925',
    '926','927','928','929','931','932','933','934','935','936','937','945',
    '946','947','948','949','950','951','952','953','954','955','956','957',
    '958','959','960','961','962','963','964','965','966','967','968','969',
    '977','978','982','8194','8195','8201','8204','8205','8206','8207','8211',
    '8212','8216','8217','8218','8220','8221','8222','8224','8225','8226',
    '8230','8240','8242','8243','8249','8250','8254','8260','8364','8465',
    '8472','8476','8482','8501','8592','8593','8594','8595','8596','8629',
    '8656','8657','8658','8659','8660','8704','8706','8707','8709','8711',
    '8712','8713','8715','8719','8721','8722','8727','8730','8733','8734',
    '8736','8743','8744','8745','8746','8747','8756','8764','8773','8776',
    '8800','8801','8804','8805','8834','8835','8836','8838','8839','8853',
    '8855','8869','8901','8968','8969','8970','8971','9001','9002','9674',
    '9824','9827','9829','9830'];

    var iEnt=-1;
    var flagTag=false,begTag=false,flagAttr=false,begAttr=false,
    flagEntity=false,begEntity=false,flagLi=false,dropTag=false;
    var empty=false,unclosed=false,unquoted=false,unopened=false,
    unclosedList=false;
    var tag="",lastTag="",ret="",entity="",attr="";
    
    for(var x=0;x<sHtml.length;x++)
    {
        c=sHtml.charAt(x);
        
        if(begEntity)
        {
            if(c==";")
            {
                begEntity=false;
                iEnt=entities.indexOf(entity);
                if(iEnt>-1)flagEntity=true;
            }
            else if(c==" " || c=="#")
              {begEntity=false;flagEntity=false;entity="";}
            else entity+=c;
        }
        
        if(c=="&")begEntity=true;
        if(begTag)
        {
            if(c==" " || c==">")
            {
                switch(tag.toLowerCase())
                {
                    case "br":
                    case "img":
                    case "hr":
                    case "input":
                    case "link":
                    case "base":
                    case "basefont":
                    case "col":
                    case "frame":
                    case "isindex":
                    case "meta":
                    case "param":
                        empty=true;
                        break;
                    case "li":
                        if(flagLi && lastTag!="ul"
                          && lastTag!="ol" && lastTag!="/li")unclosed=true;
                        flagLi=true;
                        empty=false;
                        break;
                    case "ol":
                    case "ul":
                        if(lastTag=="/li" || lastTag=="ol"
                          || lastTag=="ul")unopened=true;
                        empty=false;
                        break;
                    case "/ol":
                    case "/ul":
                        if(lastTag=="/ol" || lastTag=="/ul")unclosedList=true;
                        empty=false;
                        break;
                    case "font":case "/font":
                    case "b":case "/b":
                    case "i":case "/i":
                    case "u":case "/u":
                    case "center":case "/center":
                    case "marquee":case "/marquee":
                    case "blink":case "/blink":
                    case "big":case "/big":
                    case "small":case "/small":
                    
                        dropTag=true;
                        empty=false;
                        break;
                    default:
                        empty=false;
                        break;    
                }
                lastTag=tag.toLowerCase();
                tag="";
                begTag=false;
            }
            else tag+=c;
        }
        
        if(c=="<"){begTag=true;flagTag=true;}
        if(c==">" && empty){c=" />";}
        
        if(begTag)ret+=c.toLowerCase();
        
        else if(flagTag)
        {
            if(flagAttr)
            {
                if(begAttr)
                {
                    if(c!="\""){ret+="\""+c;unquoted=true;begAttr=false;}
                    else{ret+=c;unquoted=false;begAttr=false;}
                } 
                else if(c==" " || c==">" || c==" />")
                {
                    if(unquoted)
                    {
                        if(sHtml.charAt(x-1)!="\"")
                          {ret+="\""+c;flagAttr=false;}
                        else ret+=c;
                    }
                    else ret+=c;
                }
                else if(c=="\""){ret+=c;flagAttr=false;}
                else ret+=c;
                
                if(!flagAttr)
                {
                    switch(attr.toLowerCase())
                    {
                        case "align":
                        case "background":
                        case "bgcolor":
                        case "style":
                            ret=ret.substr(0,ret.lastIndexOf(attr+"=\""));
                            if(c==">" || c==" />")ret+=c;
                            break;
                        default:
                            break;
                    }    
                }
            }
            else if(c=="=")
            {
                begAttr=true;flagAttr=true;ret+=c;
                attr=ret.substr(ret.lastIndexOf(" ")+1,
                  ret.length-(ret.lastIndexOf(" ")+2));
            }
            else ret+=c.toLowerCase();
            
            if(c==">" || c==" />")
            {
                flagTag=false;
                flagAttr=false;
                if(unclosed){ret=ret.insertAt("</"+lastTag+">",
                  ret.lastIndexOf("<"));unclosed=false;}
                if(unopened){ret=ret.substr(0,ret.lastIndexOf("</li>"))
                  + "<"+lastTag+">";unopened=false;}
                if(unclosedList){ret=ret.insertAt("</li>",
                  ret.lastIndexOf("<"));unclosedList=false;}
                if(dropTag){ret=ret.substr(0,
                  ret.lastIndexOf("<"));dropTag=false;}
            }
        }    
        else ret+=c;
        
        if(flagEntity)
        {
            ret=ret.substr(0,ret.lastIndexOf("&"))+"&#"
              +numEntities[iEnt]+ret.substr(ret.lastIndexOf(";"));
            entity="";
            flagEntity=false;
        }
    }
    
    //various cleanups
    
    //replacing '> <' by '><'
    var rExp=/> </gi;
    ret=ret.replace(rExp,"><");
    
    return(ret);
};

//keyup handler
WymClassExplorer.prototype.keyup = function() {
  this._selected_image = null;
};


WymClassExplorer.prototype.setFocusToNode = function(node) {
    var range = this._doc.selection.createRange();
    range.moveToElementText(node);
    range.collapse(false);
    range.move('character',-1);
    range.select();
    node.focus();
};
