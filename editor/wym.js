/*
 * WYM editor : what you see is What You Mean web-based editor
 * Copyright (c) 1997-2006, H.O.net - http://www.honet.be/
 * Use of WYM editor is granted by the terms of the MIT License (http://www.opensource.org/licenses/mit-license.php).
 *
 * For further information visit:
 * 		http://www.wym-editor.org/
 * 
 * File Name:
 *		wym.js
 *		Main javascript functions.
 *		See the documentation for more info.
 * 
 * File Authors:
 * 		Jean-Francois Hovinne (jf.hovinne@wym-editor.org)
 *
 * File Revision:
 *		$Id: wym.js,v 1.14 2006/01/31 08:45:45 jf_hovinne Exp $
*/

//global vars
var selectedElement=null;
var bCleanPaste=true;

//called at body.onload
function init()
{
	getHTML();
	setImgEvent();
	displayPasteCleanup(true);
}

//these functions return base objects
function editor()
{
	return(document.getElementById('editor'));
}
function txthtml()
{
	return(document.getElementById('txthtml'));
}
function container()
{
	return(getSelectedContainer());
}
function classespanel()
{
	return(document.getElementById('m_class'));
}
//returns selected image
function selected()
{
  return(selectedElement);
}
function selectedId()
{
	if(selectedElement!=null)return(selectedElement.id);
	else return(null);
}

//we 'release' the image selection
function release()
{
	selectedElement=null;
}

//used to get the cursor position
function saveCaret()
{
    editor().caretPos=document.selection.createRange();
}

//little hack to get the current cursor position
function getCaretPos()
{
    var bookmark="~caret~pos~";
    var orig=editor().innerHTML;
    var caretPos=editor().caretPos;
    if(caretPos!=null)
    {
    	caretPos.text=bookmark;
    	var i=editor().innerHTML.search(bookmark);
    	editor().innerHTML=orig;

    	var hid=document.getElementById('caretpos');
    	hid.value=i;
    }
    return(i);
}

//insert HTML at cursor pos
function insertAtCursor(sHtml)
{
	var pos=getCaretPos();
	if(pos>-1)
	{
		var html=editor().innerHTML;
		editor().innerHTML=insertAt(html,sHtml,pos);
	}
}

//insert an HTML element *after* the current one
function insertAfter(elem,currentElem)
{
	if(currentElem.nextSibling!=null)editor().insertBefore(elem,currentElem.nextSibling);
	else editor().appendChild(elem);
}

//put editor value in txthtml
function getHTML()
{
	txthtml().innerText="";
	txthtml().innerText=editor().innerHTML;
}

//put cleaned editor value in txthtml
function getCleanHTML()
{
	txthtml().innerText="";
	txthtml().innerText=cleanupHTML(editor().innerHTML);
}

//put txthtml value in editor
function setHTML()
{
  editor().innerHTML=txthtml().innerText;
}

//set txthtml (in)visible
function htmlVisible()
{
  if(txthtml().style.display!="none")txthtml().style.display="none";
  else txthtml().style.display="inline";
}

//main function to get the current selected container
function getSelectedContainer()
{
	if(selectedElement==null)
	{
		var caretPos=editor().caretPos;
    	if(caretPos!=null)
    	{
    		if(caretPos.parentElement!=undefined)return(caretPos.parentElement());
    	}
    }
	else return(selectedElement);
}

//get the top container (the first editor's child which contains the element)
function getMainContainer(elem)
{
	nodes=editor().children;
	for(var x=0;x<nodes.length;x++)
	{
		if(nodes.item(x).contains(elem))
		{
			container=nodes.item(x);
			break;
		}
	}
	return(container);
}

//recursive function which returns the element's parent having a particular type

//we get the element's parent
//if it's type (tagname) isn't sContainerType, we get its parent
//and so on ...
function getContainerOfType(elem,sContainerType)
{
	if(elem!=null && elem.id!="editor")
	{
		if(elem.tagName!=sContainerType)
		{
			elem=elem.parentNode;
			return(getContainerOfType(elem,sContainerType));
		}
		else return(elem);
	}
	else return(null);
}

//the same as getContainerOfType, but we use an array of possible types
function getContainerOfTypeArray(elem,aContainerTypes)
{
	var bFound=false;
	if(elem!=null && elem.id!="editor")
	{
		for(i=0;i<aContainerTypes.length;i++)
		{
			if(elem.tagName==aContainerTypes[i])
			{
				bFound=true;
				break;
			}
		}
		if(!bFound)
		{
			elem=elem.parentNode;
			return(getContainerOfTypeArray(elem,aContainerTypes));
		}
		else return(elem);
	}
	else return(null);
}

//check if we can apply the class to the container
// '*' = all containers allowed
function getAllowedContainer(container,aAllowedContainers)
{
	if(container.id!="editor")
	{
		var bAllowed=false;
		for(i=0;i<aAllowedContainers.length;i++)
		{
			if(aAllowedContainers[i]==container.tagName || aAllowedContainers[i]=="*")
			{
				bAllowed=true;
				break;
			}
		}
		if(bAllowed)return(container);
		else return(getAllowedContainer(container.parentNode,aAllowedContainers));
	}
	else return(null);
}

//switch the container to a new one with another type
function setContainer(sType)
{
	container=getSelectedContainer();
	if(container!=null)
	{
		switch(container.tagName)
		{
			case "P":
			case "H1":
			case "H2":
			case "H3":
			case "H4":
			case "H5":
			case "H6":
			case "PRE":
			case "BLOCKQUOTE":
				break;
			default:
				var aTypes=new Array("P","H1","H2","H3","H4","H5","H6","PRE","BLOCKQUOTE");
				container=getContainerOfTypeArray(container,aTypes);
				break;
		}

		if(container!=null)
		{
			var html=container.innerHTML;
			var newNode=document.createElement(sType);
			container.replaceNode(newNode);
			newNode.innerHTML=html;
		}
	}
}

//set the class the container
function setClass(sValue,sAllowedContainers,sConflictingClasses)
{
	var bConflictFound=false;
	var container=null;

	//sAllowedContainers : string e.g. "P,DIV,SPAN"
	// '*' = all containers allowed
	var aCt=sAllowedContainers.split(",");

	//find the container (from cursor pos or selected element)
	container=getSelectedContainer();

	//find allowed container
	//if current container isn't allowed, take the parent, and so on ...
	if(container!=null)container=getAllowedContainer(container,aCt);

	if(container!=null)
	{
		//check if there isn't a conflict with existent classes
		var aClE=container.className.split(" "); 		//array of classes already applied to the container
		var aClC=sConflictingClasses.split(",");		//array of conflicting classes

		for(var i=0;i<aClE.length;i++)
		{
			for(var j=0;j<aClC.length;j++)
			{
				if((aClC[j]==aClE[i] && aClC[j]!="") || (aClC[j]=="*" && aClE[i]!="" && aClE[i]!=sValue))
				{
					bConflictFound=true;
					break;
				}
			}
			if(bConflictFound)break;
		}

		//apply or remove it if no conflict
		if(!bConflictFound)
		{
			var sClass=container.className;

			if(sClass==sValue || sClass.indexOf(sValue+" ")>-1 || sClass.indexOf(" "+sValue)>-1)
			{
				sClass=sClass.replace(sValue,"");
				sClass=sClass.replace("  "," ");
				sValue=sClass;
			}
			else
			{
				if(sClass=="")sClass=sValue;
				else sValue=sClass+" "+sValue;
			}

			sValue=sTrim(sValue);
			if(sValue=="")container.removeAttribute("className");
			else container.setAttribute("className",sValue,0);
			displayClasses();
		}
	}
}

//highlight the container's classes
function displayClasses()
{
	var container=getSelectedContainer();
	var nodes=document.getElementById('m_class').getElementsByTagName("A"); //get the buttons from the panel
	for(var i=0;i<nodes.length;i++){nodes.item(i).setAttribute("className","",0);} //clearing
	
	if(container==null)container=selected(); //an image ?
	if(container!=null)
	{
		var aClE=container.className.split(" "); //get the classes names
		for(i=0;i<aClE.length;i++)
		{
			if(aClE[i]!="")
			{
				for(var j=0;j<nodes.length;j++)
				{
					if(nodes.item(j).name==aClE[i])
					{
						nodes.item(j).setAttribute("className","active",0); //set the 'active' class
						break;
					}
				}
			}
		}
	}
}

//remove the class attribute
function removeClassAttr()
{
	var container=getSelectedContainer();
	if(container!=null)
	{
		container.removeAttribute("className",false);
	}
}

// !! remove all attributes
function removeAttrs()
{
var container=getSelectedContainer();
	if(container!=null)
	{
		container.clearAttributes();
	}
}

//open a dialog
function openDialog(sDialogType)
{
	var sUrl=dialogs["base"]+dialogs[sDialogType];
	var dialog=window.open(sUrl,"dialog",dialogs_features);
}

//open the preview
function openPreview()
{
	var dialog=window.open(preview_url,"preview",preview_features);
}

//set a unique id to images (when needed)
function setImgIds()
{
	var img=editor().getElementsByTagName("img");
	for(var i=0;i<img.length;i++)
	{
		if(img.id==undefined || img.id==null || img.id=="")img.id=window.document.uniqueID;
	}
}

//handles click events on images
//so we can modify images
function setImgEvent()
{
	var img=editor().getElementsByTagName("img");
	for(var i=0;i<img.length;i++)
	{
		img[i].onmousedown=function()
		{
			img_mousedown_handler(this);
		}
		img[i].ondblclick=function()
		{
			img_dblclick_handler(this);
		}
	}
}

function img_mousedown_handler(img)
{
	if(img.id==undefined || img.id==null || img.id=="")img.id=window.document.uniqueID;
	selectedElement=img;
	displayClasses();
}

function img_dblclick_handler(img)
{
	if(img.id==undefined || img.id==null || img.id=="")img.id=window.document.uniqueID;
	selectedElement=img;
	openDialog("image");
}

//insert a row or column
//sObjectType values : "ROW","COL"
//bBefore : boolean (true : inserts before selected, false : inserts after selected object)
function table_insertObject(sObjectType,bBefore)
{
	var pos=0;
	if(!bBefore)pos=1;

	var container=getSelectedContainer();
	if(container!=null)
	{
		//find the table element
		var table=getContainerOfType(container,"TABLE");
		if(table!=null)
		{
			//find the selected td / tr
			var td=getContainerOfType(container,"TD");
			var tr=getContainerOfType(container,"TR");

			if(tr!=null && td!=null)
			{
				var tdindex=td.cellIndex;
				switch(sObjectType)
				{
					//insert a new row and create cols in it
					case "ROW":
						var newRow=table.insertRow(tr.rowIndex+pos);
						for(x=0;x<tr.cells.length;x++)
						{
							newRow.insertCell();
						}
						break;
					//insert a new column in each row
					case "COL":
						for(x=0;x<table.rows.length;x++)
						{
							table.rows[x].insertCell(tdindex+pos);
						}
						break;
					default:
						break;
				}
			}
		}
	}
}

//delete a row or column
//sObjectType values : "ROW","COL"
function table_deleteObject(sObjectType)
{
	var container=getSelectedContainer();
	if(container!=null)
	{
		var table=getContainerOfType(container,"TABLE");
		if(table!=null)
		{
			var td=getContainerOfType(container,"TD");
			var tr=getContainerOfType(container,"TR");

			if(tr!=null && td!=null)
			{
				var tdindex=td.cellIndex;
				switch(sObjectType)
				{
					//delete the row
					case "ROW":
						if(table.rows.length>1)table.deleteRow(tr.rowIndex);
						break;
					//delete each coll at tdindex
					case "COL":
						if(tr.cells.length>1)
						{
							for(x=0;x<table.rows.length;x++)
							{
								table.rows[x].deleteCell(tdindex);
							}
						}
						break;
					default:
						break;
				}
			}
		}
	}
}

//display a visual feedback while copying-cutting-pasting
function displayPasteCleanup(bln)
{
	var elem_on=document.getElementById('m_paste_cleanup_flag_on');
	var elem_off=document.getElementById('m_paste_cleanup_flag_off');
	
	if(bln)
	{
		elem_on.style.display="inline";
		elem_off.style.display="none";
	}
	else
	{
		elem_on.style.display="none";
		elem_off.style.display="inline";
	}
}

//paste data from any application
//onbeforepaste and onpaste events
function pasteData()
{
	if(!bCleanPaste)
	{
		//cancel the default behavior
		event.returnValue=false;
		
		var parent;
		var newNode;
		var sTmp;
		var tmpContainer=null;
		
		var container=getSelectedContainer();
		
		//get the data as raw text (no markup)
		var sPasted=window.clipboardData.getData("Text");
		
		//if we are in a P,heading,..., we get the parentNode
		//if we are in a TD, we add a temporary P, to keep the following code simple
		//(it will be eventually removed)
		switch(container.tagName)
		{
			case "P":
			case "H1":
			case "H2":
			case "H3":
			case "H4":
			case "H5":
			case "H6":
			case "PRE":
			case "BLOCKQUOTE":
				parent=container.parentNode;
				break;
			case "TD":
				parent=container;
				tmpContainer=document.createElement("P");
				container.appendChild(tmpContainer);
				container=tmpContainer;
				break;
			default:
				break;
		}
		
		//we have the parent node
		//let's add the data
		if(parent!=null)
		{
			//split the data, using double newlines as the separator
			var aP=sPasted.split("\r\n\r\n");
	
			//add a P for each item
			for(x=0;x<aP.length;x++)
			{
				newNode=document.createElement("P");
				
				if(container.nextSibling!=null)parent.insertBefore(newNode,container.nextSibling);
				else parent.appendChild(newNode);
	
				sTmp=aP[x];
				
				//simple newlines are replaced by a break
				//maybe we need a trim("\r\n")
				sTmp=sTmp.replace(/\r\n/g,"<br />");
				newNode.innerHTML=sTmp;
				
				//switch the container to add the next P at the good position
				container=newNode;
			}
			
			//remove the temp container (if in a TD)
			if(tmpContainer!=null)tmpContainer.removeNode();
			
			getCleanHTML();
		}
	}
}