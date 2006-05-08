/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (C) 2006 Jean-François Hovinne - Daniel Reszka
 * Use of WYMeditor is granted by the terms of the MIT License (http://www.opensource.org/licenses/mit-license.php).
 *
 * For further information visit:
 * 		http://www.wymeditor.org/
 * 
 * File Name:
 *		gecko-util.js
 *		Javascript utilities for Gecko browsers.
 *		See the documentation for more info.
 * 
 * File Authors:
 * 		Jean-François Hovinne (jf.hovinne@wymeditor.org)
*/

/*
HTML cleanup
- replaces 'b' by 'strong', 'i' by 'em' (not done by string.replace for further cleanings)
*/
function cleanupHTML(sHtml)
{
	var flagTag=false,begTag=false;
	var tag="",ret="",attr="";
	
	for(var x=0;x<sHtml.length;x++)
	{
		c=sHtml.charAt(x);
		
		if(begTag)
		{
			if(c==" " || c==">")
			{
				switch(tag)
				{
					case "b":
						tag="strong";
						break;
					case "/b":
						tag="/strong";
						break;
					case "i":
						tag="em";
						break;
					case "/i":
						tag="/em";
						break;
					default:
						break;
				}
				begTag=false;
			}
			else tag+=c;
		}
		
		if(c=="<"){begTag=true;flagTag=true;}
		
		if(flagTag)
		{
			if(c==">")
			{
				flagTag=false;
				ret+="<"+tag+attr+">";
				tag="";
				attr="";
			}
			else if(!begTag)
			{
				attr+=c;
			}
		}
		else ret+=c;	
	}
	return(ret);
}