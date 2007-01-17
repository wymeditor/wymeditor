/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (C) 2006 H.O.net - http://www.honet.be/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 * 		http://www.wymeditor.org/
 * 
 * File Name:
 *		wym.js
 *		Main javascript functions.
 *		See the documentation for more info.
 * 
 * File Authors:
 * 		Jean-François Hovinne (jf.hovinne@wymeditor.org)
*/

//global vars
var selectedElement=null;
var bCleanPaste=true;

//called at body.onload
function init()
{
	getHTML(); //populate the textarea
	setImgEvent(); //add mouse events on images
	displayPasteCleanup(true); //paste cleanup is on or off
	
	if(moz)
	{
		//get the content from parent
		ed=iframe().contentWindow.parent.document.getElementById('editor');
		if(ed!=null)iframe().contentDocument.body.innerHTML=ed.innerHTML;

		getHTML();
		
		//editable
		iframe().contentDocument.designMode="on";
		
		//handles (un)necessary nodes
		handleNodes(editor());
		
		//add key and mouse events listeners
		iframe().contentDocument.addEventListener('keydown',iframe_keydown_handler,false);
		iframe().contentDocument.addEventListener('keyup',iframe_keyup_handler,false);
		iframe().contentDocument.addEventListener('mouseup',iframe_mouseup_handler,false);
		iframe().contentDocument.addEventListener('blur',function(evt){bCleanPaste=false;displayPasteCleanup(true);},false);
		
		//disable inline styles
		execCom("styleWithCSS",false);
	}
}

//these functions return base objects
function editor()
{
	if(ie) return(document.getElementById('editor'));
	else if(moz) return(iframe().contentDocument.body);
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

function iframe()
{
	return(document.getElementById('iframe_editor'));
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
	if(ie)
	{
		var pos=getCaretPos();
		if(pos>-1)
		{
			var html=editor().innerHTML;
			editor().innerHTML=insertAt(html,sHtml,pos);
		}
	}
	else if(moz)
	{
		execCom("inserthtml",sHtml);
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
	if(ie)
	{
		txthtml().innerText="";
		txthtml().innerText=editor().innerHTML;
	}
	else if(moz)
	{
		txthtml().value="";
		txthtml().value=editor().innerHTML;
	}
}

//put cleaned editor value in txthtml
function getCleanHTML()
{
	if(ie)
	{
		txthtml().innerText="";
		txthtml().innerText=cleanupHTML_ie(editor().innerHTML);
	}
	else if(moz)
	{
		txthtml().value="";
		
		//various cleanups, see util.js
		handleNodes(editor());
		txthtml().value=cleanupHTML_moz(editor().innerHTML);
	}
}

//put txthtml value in editor
function setHTML()
{
	if(ie) editor().innerHTML=txthtml().innerText;
	else if(moz)editor().innerHTML=txthtml().value;
}

//set txthtml (in)visible
function htmlVisible()
{
	if(txthtml().style.display!="none")txthtml().style.display="none";
	else txthtml().style.display="inline";
}

//buttons events
function execCom(cmd,opt)
{
	if(moz)
	{
		//well, moz sets <b><strong>#text</strong></b> or <i><em>#text</em></i>
		//in this case, we don't use execCommand: we replace the <strong> or <em> nodes by a textNode
		switch(cmd.toLowerCase())
		{
			case "bold":
				container=getSelectedContainer();
				if(container.tagName.toLowerCase()=="strong")
				{
					ntext=iframe().contentDocument.createTextNode(container.innerHTML);
					container.parentNode.replaceChild(ntext,container);
				}
				else iframe().contentDocument.execCommand(cmd,'',opt);
				break;
			case "italic":
				container=getSelectedContainer();
				if(container.tagName.toLowerCase()=="em")
				{
					ntext=iframe().contentDocument.createTextNode(container.innerHTML);
					container.parentNode.replaceChild(ntext,container);
				}
				else iframe().contentDocument.execCommand(cmd,'',opt);
				break;
			case "indent": case "outdent":
				var focusNode=getSelectedNode("focus");
				var anchorNode=getSelectedNode("anchor");
				
				focusNode=getFirstBlockParent(focusNode);
				anchorNode=getFirstBlockParent(anchorNode);
								
				if(focusNode==anchorNode && focusNode.tagName.toLowerCase()=="li")
					iframe().contentDocument.execCommand(cmd,'',opt);
				break;
			default:
				iframe().contentDocument.execCommand(cmd,'',opt);
				break;
		}
	}
	else if(ie)
	{
		switch(cmd.toLowerCase())
		{
			case "indent": case "outdent":
				container=getSelectedContainer();
				if(container.tagName.toLowerCase()=="li") document.execCommand(cmd);
				break;
			default:
				document.execCommand(cmd);
				break;
		}
	}
}

//main function to get the current selected container
function getSelectedContainer()
{
	if(selectedElement==null)
	{
		if(ie)
		{
			var caretPos=editor().caretPos;
    			if(caretPos!=null)
    			{
    				if(caretPos.parentElement!=undefined)return(caretPos.parentElement());
    			}
    		}
    		else if(moz)
    		{
			var sel=iframe().contentWindow.getSelection();
			var node=sel.focusNode;
			if(node.nodeName=="#text")return(node.parentNode);
			else return(node);
    		}
    	}
	else return(selectedElement);
}

//returns the selected anchor or focus node
function getSelectedNode(sType)
{
	if(moz)
	{
		var sel=iframe().contentWindow.getSelection();
		if(sType=="focus") node=sel.focusNode;
		else if(sType=="anchor") node=sel.anchorNode;
		if(node.nodeName=="#text")return(node.parentNode);
		else return(node);
	}
}
//get the top container (the first editor's child which contains the element)
function getMainContainer(elem)
{
	if(ie)
	{
		nodes=editor().children;
		for(var x=0;x<nodes.length;x++)
		{
			if(nodes.item(x).contains(elem)) //not supported by Mozilla
			{
				container=nodes.item(x);
				break;
			}
		}
		return(container);
	}
	else if(moz)
	{
		nodes=editor().childNodes;
		for(var y=0;y<nodes.length;y++)
		{
			if(nodeContains(nodes.item(y),elem) || nodes.item(y)==elem)
			{
				container=nodes.item(y);
				break;
			}
		}
		return(container);
	}
}

//Moz only: Mozilla doesn't support node.contains()
function nodeContains(node,elem)
{
	parent=elem.parentNode;
	if(parent.tagName.toLowerCase()=="body" || parent.tagName.toLowerCase()=="html")return(false);
	else if(parent==node)return(true);
	else return(nodeContains(node,parent));
}

//recursive function which returns the first block-level element's parent
function getFirstBlockParent(elem)
{
	if(elem!=null && elem.id!="editor")
	{
		var tagName=elem.tagName.toLowerCase();
		switch(tagName)
		{
			case "address":
			case "blockquote":
			case "div":
			case "dl":
			case "fieldset":
			case "form":
			case "h1": case "h2": case "h3": case "h4": case "h5": case "h6":
			case "hr":
			case "noscript":
			case "ol":
			case "p":
			case "pre":
			case "table":
			case "ul":
			case "dd":
			case "dt":
			case "li":
			case "tbody":
			case "td":
			case "tfoot":
			case "th":
			case "thead":
			case "tr":
				return(elem);
				break;
			default:
				elem=elem.parentNode;
				return(getFirstBlockParent(elem));
				break;
		}
	}
	else return(null);	
}

//recursive function which returns the element's parent having a particular type

//we get the element's parent
//if its type (tagname) isn't sContainerType, we get its parent
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
	if(container!=null && container.id!="editor")
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
			if(ie)container.replaceNode(newNode);
			else if(moz)container.parentNode.replaceChild(newNode,container);
			newNode.innerHTML=html;
		}
	}
}

//set the class to the container
function setClass(sValue,sAllowedContainers,sConflictingClasses,sAllowedClasses)
{
	var bConflictFound=false;
	var bAllowedFound=(sAllowedClasses=="" || sAllowedClasses==null);
	var container=null;
	var attrClass;
	var sClasses="";
	
	if(sConflictingClasses==null)sConflictingClasses="";
	if(sAllowedClasses==null)sAllowedClasses="";

	//sAllowedContainers : string e.g. "P,DIV,SPAN"
	// '*' = all containers allowed
	var aCt=sAllowedContainers.split(",");

	//find the container (from cursor pos or selected element)
	container=getSelectedContainer();
	
	if(ie) sClasses=container.className;
	if(moz) attrClass=container.attributes.getNamedItem("class");
	if(attrClass!=null) sClasses=attrClass.value;

	//find allowed container
	//if current container isn't allowed, take the parent, and so on ...
	if(container!=null)container=getAllowedContainer(container,aCt);
	
	if(container!=null)
	{
		//check if there isn't a conflict with existent classes
		var aClE=sClasses.split(" "); 							//array of classes already applied to the container
		var aClC=sConflictingClasses.split(",");					//array of conflicting classes
		var aClA=sAllowedClasses.split(",");						//array of compatible classes
		
		if(sClasses=="")bAllowedFound=true;						//if no classes already applied, every class is allowed

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
			
			if(!bAllowedFound)
			{
				for(var k=0;k<aClA.length;k++)
				{
					if((aClA[k]==aClE[i] && aClA[k]!="") || (aClA[k]=="*" && aClE[i]!="") || (aClE[i]==sValue))
					{
						bAllowedFound=true;
						break;	
					}
				}
				if(bAllowedFound)break;
			}
		}

		//apply or remove it if no conflict
		if(!bConflictFound && bAllowedFound)
		{
			if(sClasses==sValue || sClasses.indexOf(sValue+" ")>-1 || sClasses.indexOf(" "+sValue)>-1)
			{
				sClasses=sClasses.replace(sValue,"");
				sClasses=sClasses.replace("  "," ");
				sValue=sClasses;
			}
			else
			{
				if(sClasses=="")sClasses=sValue;
				else sValue=sClasses+" "+sValue;
			}

			sValue=sTrim(sValue);
			if(sValue=="")
			{
				if(ie)container.removeAttribute("className");
				else if(moz)container.attributes.removeNamedItem("class");
			}
			else
			{
				if(ie)container.setAttribute("className",sValue,0);
				else if(moz)container.setAttribute("class",sValue);
			}
			displayClasses();
		}
	}
}

//highlight the container's classes
function displayClasses()
{
	var container=getSelectedContainer();
	var nodes=document.getElementById('m_class').getElementsByTagName("A"); //get the buttons from the panel
	for(var i=0;i<nodes.length;i++)
	{
		//clearing
		if(ie)nodes.item(i).setAttribute("className","",0);
		else if(moz)
		{
			if(nodes.item(i).attributes.getNamedItem("class")!=null)
				nodes.item(i).attributes.removeNamedItem("class");
		}
	} 
	
	if(container==null)container=selected(); //an image ?
	if(container!=null)
	{
		var sClasses="";
		var attrClass=container.attributes.getNamedItem("class");
		if(attrClass!=null)sClasses=attrClass.value;
		
		var aClE=sClasses.split(" "); //get the classes names
		for(i=0;i<aClE.length;i++)
		{
			if(aClE[i]!="")
			{
				for(var j=0;j<nodes.length;j++)
				{
					if(nodes.item(j).name==aClE[i])
					{
						if(ie)nodes.item(j).setAttribute("className","active",0); //set the 'active' class
						else if(moz)nodes.item(j).setAttribute("class","active",0);
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
		if(ie) container.removeAttribute("className",false);
		else if(moz) container.removeAttribute("class",false);
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
		if(img.id==undefined || img.id==null || img.id=="")img.id=getUniqueId();
	}
}

//handles click events on images
//so we can modify images
function setImgEvent()
{
	var img=editor().getElementsByTagName("img");
	for(var i=0;i<img.length;i++)
	{
		if(ie)
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
		else if(moz)
		{
			img.item(i).addEventListener("mousedown",img_mousedown_handler_moz,false);
			img.item(i).addEventListener("dblclick",img_dblclick_handler_moz,false);
		}
	}
}

function img_mousedown_handler(img)
{
	if(img.id==undefined || img.id==null || img.id=="")img.id=getUniqueId();
	selectedElement=img;
	displayClasses();
}

function img_mousedown_handler_moz()
{
	if(this.id==undefined || this.id==null || this.id=="")this.id=getUniqueId();
	selectedElement=this;
	displayClasses();
}

function img_dblclick_handler(img)
{
	if(img.id==undefined || img.id==null || img.id=="")img.id=getUniqueId();
	selectedElement=img;
	openDialog("image");
}

function img_dblclick_handler_moz()
{
	if(this.id==undefined || this.id==null || this.id=="")this.id=getUniqueId();
	selectedElement=this;
	openDialog("image");
}

//IE specific - Gecko has nested buttons for row and cells creation/removing
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
function pasteData(sData)
{
	if(!bCleanPaste || sData!=null)
	{
		//cancel the default behavior
		if(ie) event.returnValue=false;

		var parent;
		var newNode;
		var sTmp;
		var tmpContainer=null;
		var sPasted=sData;
		
		var container=getSelectedContainer();
		
		//get the data as raw text (no markup)
		if(ie) sPasted=window.clipboardData.getData("Text");
		
		//if we are in a P,heading,..., we get the parentNode
		//if we are in a TD, we add a temporary P, to keep the following code simple
		//(it will be eventually removed)
		switch(container.tagName)
		{
			case "BODY":
				parent=container;
				break;
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
				parent=getMainContainer(container).parentNode;
				break;
		}
		
		//we have the parent node
		//let's add the data
		if(parent!=null)
		{
			//split the data, using double newlines as the separator
			var aP;
			if(ie) aP=sPasted.split("\r\n\r\n");
			else if(moz) aP=sPasted.split("\n\n");
	
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

			//remove remaining BR (moz only)
			if(moz && editor().childNodes[1]!=null && editor().childNodes[1].tagName=="BR")
				editor().removeChild(editor().childNodes[1]);
			
			getCleanHTML();
		}
	}
}


//GECKO

//keydown & keyup handlers, mainly used for cleanups

function iframe_keydown_handler(evt)
{
	if(evt.keyCode==86 && evt.ctrlKey) //CTRL+V -> PASTE
	{	
		//prevent CTRL+V
		if(moz_prevent_copy) evt.preventDefault();
	}
}

function iframe_keyup_handler(evt)
{	
	if(evt.keyCode==13 && !evt.shiftKey) //RETURN key
	{
		//cleanup <br><br> between paragraphs
		
		nodes=editor().childNodes;

		for(var x=0;x<nodes.length;x++)
		{
			if(nodes.item(x).nodeName.toLowerCase()=="br") editor().removeChild(nodes.item(x));
		}
	}
	
	else if(evt.keyCode!=8 && evt.keyCode!=46 && evt.keyCode!=17 && !evt.ctrlKey) //NOT BACKSPACE, NOT DELETE, NOT CTRL
	{
		//text nodes replaced by P
		container=getSelectedContainer();
		name=container.tagName.toLowerCase();

		//fix forbidden main containers
		if(
			name=="strong" ||
			name=="b" ||
			name=="em" ||
			name=="i" ||
			name=="sub" ||
			name=="sup" ||
			name=="a"

		) name=container.parentNode.tagName.toLowerCase();

		if(name=="body") execCom("formatblock","P");
	}
	
	displayClasses();
}

function iframe_mouseup_handler(evt)
{
	if(evt.target.nodeName.toLowerCase()!="img")
	{
		setImgEvent();
		release();
	}
	displayClasses();
}
