/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (C) 2006 Jean-François Hovinne - Daniel Reszka
 * Use of WYMeditor is granted by the terms of the MIT License (http://www.opensource.org/licenses/mit-license.php).
 *
 * For further information visit:
 * 		http://www.wymeditor.org/
 * 
 * File Name:
 *		dialog.js
 *		Main dialogs javascript functions.
 *		See the documentation for more info.
 * 
 * File Authors:
 * 		Jean-François Hovinne (jf.hovinne@wymeditor.org)
*/

//oSelected and oSelectedId : defined if an image has been dblclicked
var oSelected=window.opener.selected();
var oSelectedId=null;

//container and mainContainer : we are in a container and we want to insert a new object
var container, mainContainer;

container=window.opener.getSelectedContainer();
mainContainer=window.opener.getMainContainer(container);

//init dialog values
function init(sDialog)
{
	var elem=null;
	switch(sDialog)
	{
		case "image":
			if(oSelected!=null)
			{
	    		//we need selection id for sendValue()
	    		oSelectedId=oSelected.id;
	    		switch(oSelected.tagName.toLowerCase())
	    		{
	    	  		//an image has been dblclicked
	    	  		case "img":
	    	    		if(getValue("image_src")=="")setValue("image_src",oSelected.src)
	    	    		if(getValue("image_alt")=="")setValue("image_alt",oSelected.alt)
	    	    		if(getValue("image_title")=="")setValue("image_title",oSelected.title)
	    	    		if(getValue("image_width")=="")setValue("image_width",oSelected.width)
	    	    		if(getValue("image_height")=="")setValue("image_height",oSelected.height)
	    	    		if(getValue("image_id")=="")setValue("image_id",oSelected.id)
	    	    		image_preview();
	    	    		break;
	    	    }
			}
			else
			{
				//not an image, or new image
				image_preview();
				image_unique_id();
			}
			break;
			
		case "link":
			if(container!=null)
			{
				var link_href="";
				var link_title="";
				
				switch(container.tagName.toLowerCase())
				{
					case "a":
						link_href=container.href;
						link_title=container.title;
						break;
						
					default:
						elem=container.parentNode;
						if(elem!=null)
						{
							if(elem.tagName.toLowerCase()=="a")
							{
								link_href=elem.href;
								link_title=elem.title;
							}
						}
				}
				
				if(getValue("link_href")=="")setValue("link_href",link_href);
				if(getValue("link_title")=="")setValue("link_title",link_title);
			}
			break;

	}
}

//get and set dialog values
function getValue(sName)
{
	return(document.getElementById(sName).value);
}
function setValue(sName,sValue)
{
	document.getElementById(sName).value=sValue;
}

//link
function link_sendValue()
{
	var elem=null;
	var marker=getUniqueId();
	
	//create the link, or overwrite it
	if(ie) window.opener.document.execCommand("CreateLink",false,getValue("link_href"));
	
	//well, not sure the marker is the best way to do it, but it works (see below, moz section)
	else if(moz) window.opener.iframe().contentDocument.execCommand("CreateLink","",marker);
	
	//now we need to set the other attributes
	
	if(ie)
	{
		//is it an image ?
		if(oSelected!=null)
		{
			elem=oSelected.parentNode;
			if(elem!=null)
			{
				//elem is the link
				if(elem.tagName.toLowerCase()=="a")
				{
					elem.title=getValue("link_title");	
				}	
			}	
		}
		
		//not an image
		if(container!=null)
		{
			switch(container.tagName.toLowerCase())
			{
				//an updated link
				case "a":
					container.title=getValue("link_title");
					break;
				//everything else
				default:
					elem=container.parentNode;
					if(elem!=null)
					{
						//is elem the link ?
						if(elem.tagName.toLowerCase()=="a")
						{
							elem.title=getValue("link_title");
						}
						else
						{
							//this is a new link
							
							//get the selected text
							var sel=window.opener.document.selection.createRange();
							//parentNode is undefined :(
							//get the new link
							elem=sel.parentElement();
							if(elem!=null)
							{
								if(elem.tagName.toLowerCase()=="a")
								{
									elem.title=getValue("link_title");
								}
							}
						}
					}
					break;
			}
		}
	}
	
	else if(moz)
	{
		var nodes=window.opener.iframe().contentDocument.body.getElementsByTagName("a");
		for(var x=0;x<nodes.length;x++)
		{
			node=nodes.item(x);
			attr=node.attributes.getNamedItem("href");
			if(attr.value==marker)
			{
				//wow, we got it
				node.setAttribute("href",getValue("link_href"));
				node.setAttribute("title",getValue("link_title"));
			}
		}
	}
	
	//update txthtml value
	window.opener.getCleanHTML();
}

//update the preview
//we don't display it if src is empty
function image_preview()
{
	var img=document.getElementById("image_preview");
	if(img!=null)
	{
		img.src=getValue("image_src");
		if(img.src.length==0)img.style.display="none";
		else img.style.display="inline";
	}
}

//generate a new unique id and set the value
function image_unique_id()
{
	var elem=document.getElementById("image_id");
	if(elem!=null)elem.value=getUniqueId();
}

//update preview width an height
function image_sizes()
{
	var img=document.getElementById("image_preview");
	if(img!=null)
	{
		setValue("image_width",img.width);
		setValue("image_height",img.height);
	}		
}


//send the image to the editor
function image_sendValue()
{
	//get the preview dimensions
	image_sizes();
	
	if(ie)
	{
		//where was the cursor ?
		var pos=window.opener.getCaretPos();
		if(pos>-1 && oSelected==null)
		{
		  //not on an image > insert new image
			var html=window.opener.editor().innerHTML;
			var img=window.opener.document.createElement("IMG");
			
			img.src=getValue("image_src");
      			img.title=getValue("image_title");
      			img.alt=getValue("image_alt");
      			img.width=getValue("image_width");
      			img.height=getValue("image_height");
      			img.id=getValue("image_id");
      		
			window.opener.editor().innerHTML=insertAt(html,img.outerHTML,pos);
		}
		else
		{
			if(oSelected!=null)
			{
      				//an image has been dblclicked > get it by id
      				img=window.opener.document.getElementById(oSelectedId);
      				if(img!=null)
      				{
      					//set new values
      					img.src=getValue("image_src");
      					img.title=getValue("image_title");
      					img.alt=getValue("image_alt");
      					img.width=getValue("image_width");
      					img.height=getValue("image_height");
      				}
      			}
		}
	}
	else if(moz)
	{
		var marker=getUniqueId();
		window.opener.iframe().contentDocument.execCommand("InsertImage","",marker);
		
		var nodes=window.opener.iframe().contentDocument.body.getElementsByTagName("img");
		for(var x=0;x<nodes.length;x++)
		{
			node=nodes.item(x);
			attr=node.attributes.getNamedItem("src");
			if(attr.value==marker)
			{
				node.setAttribute("id",getValue("image_id"));
				node.setAttribute("src",getValue("image_src"));
      				node.setAttribute("title",getValue("image_title"));
      				node.setAttribute("alt",getValue("image_alt"));
      				node.setAttribute("width",getValue("image_width"));
      				node.setAttribute("height",getValue("image_height"));
			}
		}
		
	}
	//'release' the selection
	window.opener.release();
	//handle click events on images
	window.opener.setImgEvent();
	//update txthtml value
	window.opener.getCleanHTML();
}


//send the table to the editor
function table_sendValue()
{
	if(mainContainer!=null)
	{
		//we construct the new table
		var table=window.opener.document.createElement("TABLE");
		var newRow=null;
		var newCol=null;
		
		var rows=getValue("table_rows");
		var cols=getValue("table_cols");
		
		for(x=0;x<rows;x++)
		{
			newRow=table.insertRow();
			for(y=0;y<cols;y++)
			{
				newRow.insertCell();
			}
		}
		
		//we add the new table after the mainContainer
		if(mainContainer.nextSibling!=null)window.opener.editor().insertBefore(table,mainContainer.nextSibling);
		else window.opener.editor().appendChild(table);
		
		//update txthtml value
		window.opener.getCleanHTML();
	}
}

//send the template+content to the editor, after the current container
function template_sendValue()
{
	if(mainContainer!=null)
	{
		var elem=document.getElementById("template_template");
		if(elem!=null)
		{
			var html=elem.innerHTML; //get the template
			
			var bln=true;
			var i=1;
			var ct="";
			
			//get the contents
			while(bln)
			{
				if(document.getElementById("template_content_"+i)!=null)
				{
					ct=getValue("template_content_"+i);
					ct=ct.replace(/\n/gi,"<br />"); //replacing newlines by <br />
					
					reg=new RegExp("#"+i+"#","gi"); //replacing flags by contents
					html=html.replace(reg,ct);
					i++;
				}
				else bln=false;
			}
			
			mainContainer.insertAdjacentHTML("afterEnd",html); //inserting
			
			//update txthtml value
			window.opener.getCleanHTML();
		}
	}
}
