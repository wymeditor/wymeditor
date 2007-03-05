function ShowObj( objName, obj )
{
    if ( typeof obj == "string" )
    {
        var win = window.open( null );
            win.document.write( '<pre>' + obj + '</pre>' );
            win.document.close();
            return;
    }
    var str = objName + ':' + "\n";
    try {
    for ( var key in obj )
    {
        if ( typeof( obj[key] ) != 'undefined' )
        {
            try {
                var objVal = obj[key];
            } catch(e) {
                showErrorAlert( e, 
                    'Error in ShowObj. Could not set objVal = obj[key]' );
            }
        }
        else
        {
            try {
                var objVal = 'undefined';
            } catch(e) {
                showErrorAlert( e, 
                    'Error in ShowObj. Could not set objVal = undefined' );
            }
        }
        str += '[' + key + ']=>' + objVal + "\n";
    }
    } catch(e) {
        alert( e + "\nError in for loop in ShowObj()" );
    }
    try {
        var win = window.open( null );
            win.document.write( '<pre>' + str + '</pre>' );
            win.document.close();
    } catch(e) {
       showErrorAlert( e,
           'Could not open ShowObj() window' );
    }
}

function ShowHTML(_ID,HTML)
{
    ShowDOMTree(_ID,HTML,window.open(null));
}

// F. Permadi 2005.
// (C) F. Permadi
// Print DOM tree
////////////////////////////////////////////////////////////////////////////
// This function traverses the DOM tree of an element and prints the tree.  
// This function called recursively until the DOM tree is fully traversed.
// 
// Parameters:
// - targetDocument is where the tree will be printed into
// - currentElement is the element that we want to print
// - depth is the depth of the current element 
//   (it should be 1 for the initial element)
/////////////////////////////////////////////////////////////////////////////

function str_repeat(ent,n)
{
    var str = "";
    for ( i=0; i<n; i++)
    {
        str += ent;
    }
    return str;
}

function ClimbDOMTree(DOC,ELMNT,depth)
{
  if (ELMNT)
  {
    var j;
    var TAG;
    if (TAG = ELMNT.tagName)
    {
        TAG = TAG.toLowerCase();
        var html = "<br />" + str_repeat("&nbsp;&nbsp;&#166;",depth-2) + 
                   "&nbsp;&nbsp;+--&lt;" + TAG;
        var ATTRS;
        if (ATTRS = ELMNT.attributes)
        {
			for (var a=0; a<ATTRS.length; a++)
			{
				var ind = "";
				if (a>0)
				{
					var ind = "<br />" + str_repeat("&nbsp;&nbsp;&#166;",depth-1) + 
		            str_repeat("&nbsp;",TAG.length+4);
				}
				html += ' ' + ind + ATTRS[a].nodeName.toLowerCase() +
						'="' + ATTRS[a].nodeValue + '"';
			}
		}
        if (TAG == "input" || TAG == "img")
        {
		    html += "<br />" + str_repeat("&nbsp;&nbsp;&#166;",depth-1) + 
		            str_repeat("&nbsp;",TAG.length+4) + "/&gt;";
		    DOC.write(html); 
		    return;
		}
		else
		{
		    DOC.write(html += "&gt;");
		}
	}
    else
    {
        if (ELMNT.nodeName == "#text" && !empty(ELMNT.nodeValue))
        {
            DOC.write("<br />"+str_repeat("&nbsp;&nbsp;&#166;",depth-2));
            DOC.write(str_repeat("&nbsp;&nbsp;",2));
            DOC.write(ELMNT.nodeValue);
            return;
        }
        else
        {
            return;
        }
    }
    // Traverse the tree
    var i=0;
    var CHILD = ELMNT.childNodes[i];
    while (CHILD)
    {
      // DOC.write("<br />" + str_repeat("&nbsp;&nbsp;&#166;",depth));
      ClimbDOMTree(DOC,CHILD,depth+1);
      i++;
      CHILD=ELMNT.childNodes[i];
    }
    // The remaining code is mostly for formatting the tree
    // DOC.writeln("<br />" + str_repeat("&nbsp;&nbsp;&#166;",depth));
    if (TAG)
    {
        DOC.write("<br />"+str_repeat("&nbsp;&nbsp;&#166;",depth-1));
        DOC.write(str_repeat("&nbsp;&nbsp;",2));
        var ind = "<br />" + str_repeat("&nbsp;&nbsp;&#166;",depth-2)
        DOC.write(ind + "&nbsp;&nbsp;+--&lt;/" + TAG + "&gt;");
    }
  }
}

function empty(str)
{
    if (str.charCodeAt(0) == 10) return true;
    if (str.charCodeAt(0) == 13) return true;
    if (str.charCodeAt(0) == 32) return true;
    return false;
}

////////////////////////////////////////////
// This function accepts a DOM element as parameter and prints
// out the DOM tree structure of the element.
////////////////////////////////////////////
function ShowDOMTree(_ID,domElement,WIN)
{
	if (!WIN) WIN=window.open();
	WIN.document.open("text/html", "replace");
	WIN.document.write("<html>\n");
	WIN.document.write("<head>\n");
	WIN.document.write("<title>");
	WIN.document.write(domElement.nodeName + ": #" + _ID);
	WIN.document.write("</title>\n");
	WIN.document.write("</head>\n");
	WIN.document.write("<body>\n");
	WIN.document.write("<code>\n");
	WIN.document.write(domElement.nodeName + ": #" + _ID + "<br /><br />");
	ClimbDOMTree(WIN.document, domElement, 1);
	WIN.document.write("</code>\n");
	WIN.document.write("</body>\n");
	WIN.document.write("</html>\n");
	WIN.document.close();
}