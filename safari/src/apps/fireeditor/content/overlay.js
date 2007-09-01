/* ***** BEGIN LICENSE BLOCK *****
 *   Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 * 
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is FireEditor.
 *
 * The Initial Developer of the Original Code is
 * David Wees.
 * Portions created by the Initial Developer are Copyright (C) 2007
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 * 
 * ***** END LICENSE BLOCK ***** */

var fireeditor = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
    this.strings = document.getElementById("fireeditor-strings");
    document.getElementById("contentAreaContextMenu")
            .addEventListener("popupshowing", function(e) { this.showContextMenu(e); }, false);
  },

  showContextMenu: function(event) {
    // show or hide the menuitem based on what the context menu is on
    // see http://kb.mozillazine.org/Adding_items_to_menus
    document.getElementById("context-fireeditor").hidden = gContextMenu.onImage;
  },
  onMenuItemCommand: function(e) {
    /*var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                  .getService(Components.interfaces.nsIPromptService);
    promptService.alert(window, this.strings.getString("helloMessageTitle"),
                                this.strings.getString("helloMessage"));*/
		var prefService    = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		var prefSvc        = prefService.getBranch(null);
	
		var loadInTab      = false;
		try {
			loadInTab        = prefSvc.getIntPref("extensions.fireeditor.openInTab");
		} catch (ex) {
			loadInTab = true;
		}
	
		if (loadInTab) {
			var theTab          = gBrowser.addTab('chrome://fireeditor/content/fireeditor.xul');
			theTab.label        = "Fire Editor";
			gBrowser.selectedTab = theTab;
			var func = function () { gBrowser.setIcon(theTab, "chrome://fireeditor/content/fireeditor.png"); };
			setTimeout(func, 500);
		} else {
			toOpenWindowByType('mozilla:fireeditor', 'chrome://fireeditor/content/fireeditor.xul');
		}
  },
  onToolbarButtonCommand: function(e) {
    // just reuse the function above.  you can change this, obviously!
    fireeditor.onMenuItemCommand(e);
  }

};

window.addEventListener("load", function(e) { fireeditor.onLoad(e); }, false);
