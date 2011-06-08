/**
 * Desktop plugin for WYMeditor : what you see is What You Mean web-based editor
 * Copyright (c) 2011  Calvin Schwenzfeier
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * <p><b>File Name:</b>  <tt>jquery.wymeditor.desktop.js</tt></p>
 * <p><b>File Info:</b><br/>
 * Desktop plugin for WYMeditor.  To be used in conjunction with the Desktop
 * skin.  See the .../docs/ConfigAndUse.html file for instructions on how to
 * configure and use the Desktop plugin.</p>
 *
 * @author  Calvin Schwenzfeier <calvin DOT schwenzfeier a~t gmail dotCOM>
 * @version  0.1&alpha;
 *
 * For further information visit:
 * {@link http://www.wymeditor.org/}
 * {@link http://wymeditor.github.com/}
 * {@link http://github.com/wymeditor/wymeditor}
 * {@link docs/ConfigAndUse.html}
 */

WYMeditor.editor.prototype.desktop = new Object();

/*
 * Holds the dynamically loaded (happens in the ._init() method) JavaScript
 * code associated with each tool.  The code for each tool should reside in
 * the following path:
 *     '{WYMeditor_Base_Path}/' +
 *     'plugins/desktop/desktop.toolFunctions/' +
 *     'desktop.{ToolName}.js'
 * Where {ToolName} is the name of the tool as defined by the .availableTools()
 * method below.
 */
WYMeditor.editor.prototype.desktop.toolFunctions = new Object();

/*
 * Holds various utilities to make DOM manipulation a little bit easier.
 */
WYMeditor.editor.prototype.desktop.domUtils = new Object();

/**
 * Compares two nodes and returns a boolean indicating if the two nodes are
 * equivalent.
 * 
 * @param nodeOne  The first node to compare.
 * @param nodeTwo  The second node to compare.
 * @return  True if the two nodes are equivalent, false otherwise.
 */
WYMeditor.editor.prototype.desktop.domUtils.sameNode = function(nodeOne, nodeTwo) {
    // I'm sure there is a pathological case where nodeOne and nodeTwo pass the
    // following tests, but are not actually the same node.  However, I do not
    // foresee a situation where such a case could be a real usage case.
    // Then again, maybe I am just shortsighted...  :-P
    var isEquivNode = (nodeOne == nodeTwo) &&
                      ( ((nodeOne == null) && (nodeTwo == null)) ||
                        (nodeOne != null) && (nodeTwo != null) );
    if((nodeOne != null) && (nodeTwo != null)) {
        isEquivNode = isEquivNode &&
                      (nodeOne.nodeName == nodeTwo.nodeName) &&
                      (nodeOne.childNodes.length == nodeTwo.childNodes.length);
        if(nodeOne.childNodes.length == nodeTwo.childNodes.length) {
            if(nodeOne.childNodes.length > 0) {
                isEquivNode = isEquivNode &&
                              (nodeOne.innerHTML == nodeTwo.innerHTML);
            }
            else if(nodeOne.childNodes.length == 0) {
                isEquivNode = isEquivNode &&
                              (nodeOne.nodeValue == nodeTwo.nodeValue);
            }
        }
    }
    var isEquivParents = (nodeOne.parentNode == nodeTwo.parentNode) &&
                         ( ( (nodeOne.parentNode == null) &&
                             (nodeTwo.parentNode == null) ) ||
                           ( (nodeOne.parentNode != null) &&
                             (nodeTwo.parentNode != null) ) );
    if((nodeOne.parentNode != null) && (nodeTwo.parentNode != null)) {
        isEquivParents = isEquivParents &&
                         ( nodeOne.parentNode.innerHTML ==
                           nodeTwo.parentNode.innerHTML );
        var isEquivGrandparents = ( nodeOne.parentNode.parentNode ==
                                    nodeTwo.parentNode.parentNode ) &&
                                  ( ( (nodeOne.parentNode.parentNode == null) &&
                                      (nodeTwo.parentNode.parentNode == null) ) ||
                                    ( (nodeOne.parentNode.parentNode != null) &&
                                      (nodeTwo.parentNode.parentNode != null) ) );
        if( (nodeOne.parentNode.parentNode != null) &&
            (nodeTwo.parentNode.parentNode != null) ) {
            isEquivGrandparents = isEquivGrandparents &&
                                  ( nodeOne.parentNode.parentNode.innerHTML ==
                                    nodeTwo.parentNode.parentNode.innerHTML );
        }
        isEquivParents = isEquivParents && isEquivGrandparents;
    }
    var isEquivPrev = (nodeOne.previousSibling == nodeTwo.previousSibling) &&
                      ( ( (nodeOne.previousSibling == null) &&
                          (nodeTwo.previousSibling == null) ) ||
                        ( (nodeOne.previousSibling != null) &&
                          (nodeTwo.previousSibling != null) ) );
    if((nodeOne.previousSibling != null) && (nodeTwo.previousSibling != null)) {
        isEquivPrev = isEquivPrev &&
                      ( nodeOne.previousSibling.innerHTML ==
                        nodeTwo.previousSibling.innerHTML );
    }
    var isEquivNext = (nodeOne.nextSibling == nodeTwo.nextSibling) &&
                      ( ( (nodeOne.nextSibling == null) &&
                          (nodeTwo.nextSibling == null) ) ||
                        ( (nodeOne.nextSibling != null) &&
                          (nodeTwo.nextSibling != null) ) );
    if((nodeOne.nextSibling != null) && (nodeTwo.nextSibling != null)) {
        isEquivNext = isEquivNext &&
                      ( nodeOne.nextSibling.innerHTML ==
                        nodeTwo.nextSibling.innerHTML );
    }
    var isSameNode = isEquivNode && isEquivParents && isEquivPrev && isEquivNext;
    return isSameNode;
};

/**
 * Set the parent object for this Desktop object (typically the parent object is
 * a WYMeditor object).
 * 
 * @param parentObj  A reference to the parent object of this Desktop object.
 */
WYMeditor.editor.prototype.desktop.setParent = function(parentObj) {
    this.parent = parentObj;
};

/**
 * Turn debugging console output on or off.
 * 
 * @param boolValue  A true turns debugging on while a false value turns
 *                   debugging off.
 */
WYMeditor.editor.prototype.desktop.setDebug = function(boolValue) {
    this.DEBUG = boolValue;
};

/**
 * Defines and initializes the .selectedTools array in the Desktop object.
 */
WYMeditor.editor.prototype.desktop.defineSelectedTools = function() {
    this.selectedTools = new Array();
};

/**
 * Provides the list of all available event names recognized by Desktop.
 * 
 * @return  An array of all available event names.
 */
WYMeditor.editor.prototype.desktop.availableEventNames = function() {
    var availableEvents = [
        'blur', 'change', 'click', 'dblclick', 'error', 'focus', 'focusin',
        'focusout', 'hover', 'keydown', 'keypress', 'keyup', 'load',
        'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout',
        'mouseover', 'mouseup', 'ready', 'resize', 'scroll', 'select',
        'submit', 'toggle', 'unload'
    ];
    return availableEvents;
};

/**
 * Provides the list of all available Desktop tools and their defaults.
 * 
 * @return  An object listing all available tools.
 */
WYMeditor.editor.prototype.desktop.availableTools = function() {
    var baseDir = this.parent.computeBasePath() +
                  "plugins/desktop/desktop.toolFunctions";
    var baseFile = "desktop";

    // Each entry in the "hash" below must minimally contain:
    //     ~{ToolName}~ : { title: '~{Tool_Title}~', css: '~{tool_css_class}~' }
    // Both the 'name:' and 'file:' are autogenerated from the '~{ToolName}~'.
    // Optional configuration includes the use of '~{event}~:' keys (said key
    // vaules may either be a boolean value or an anonymous function and must be
    // one of the event types returned by the .availableEventNames() method);
    // for example: "click: true" or "hover: function(ev) { console.log(ev); }".
    //
    // EACH TOOL, AND ALL OF SAID TOOL'S CONFIG, MUST BE ON ONE LINE; AND ONLY
    // ONE TOOL PER LINE.
    // If you see a "/* */" mark in front of a line, it signifies that tool has
    // hand-written default code in its associated dynamically loaded
    // JavaScript; this also allows the code generator in the .../scripts/
    // directory to skip code generation for the marked tools.
    var availableToolsHash = {
        AccessoriesCalculator: { title: 'Calculator', css: 'wym_tools_accessories_calculator' },
        AccessoriesCharacterMap: { title: 'Character_Map', css: 'wym_tools_accessories_character_map' },
        AccessoriesDictionary: { title: 'Dictionary', css: 'wym_tools_accessories_dictionary' },
        AccessoriesTextEditor: { title: 'Text_Editor', css: 'wym_tools_accessories_text_editor' },
        ApplicationsAccessories: { title: 'Accessories', css: 'wym_tools_applications_accessories' },
        ApplicationsCertificate: { title: 'Certificate', css: 'wym_tools_applications_certificate' },
        ApplicationsDevelopment: { title: 'Development', css: 'wym_tools_applications_development' },
        ApplicationsEngineering: { title: 'Engineering', css: 'wym_tools_applications_engineering' },
        ApplicationsExit: { title: 'Exit', css: 'wym_tools_applications_exit' },
        ApplicationsGames: { title: 'Games', css: 'wym_tools_applications_games' },
        ApplicationsGraphics: { title: 'Graphics', css: 'wym_tools_applications_graphics' },
        ApplicationsInternet: { title: 'Internet', css: 'wym_tools_applications_internet' },
        ApplicationsLogviewer: { title: 'Logviewer', css: 'wym_tools_applications_logviewer' },
        ApplicationsMultimedia: { title: 'Multimedia', css: 'wym_tools_applications_multimedia' },
        ApplicationsOffice: { title: 'Office', css: 'wym_tools_applications_office' },
        ApplicationsOther: { title: 'Other', css: 'wym_tools_applications_other' },
        ApplicationsScience: { title: 'Science', css: 'wym_tools_applications_science' },
        ApplicationsScreenCapture: { title: 'Screen_Capture', css: 'wym_tools_applications_screen_capture' },
        ApplicationsSystemMonitor: { title: 'System_Monitor', css: 'wym_tools_applications_system_monitor' },
        ApplicationsSystem: { title: 'System', css: 'wym_tools_applications_system' },
        ApplicationsTerminal: { title: 'Terminal', css: 'wym_tools_applications_terminal' },
        ApplicationsUtilities: { title: 'Utilities', css: 'wym_tools_applications_utilities' },
        ApplicationsWebBrowser: { title: 'Web_Browser', css: 'wym_tools_applications_web_browser' },
        ApplicationsExecutable: { title: 'Executable', css: 'wym_tools_applications_x_executable' },
        AudioCard: { title: 'Card', css: 'wym_tools_audio_card' },
        AudioInputMicrophone: { title: 'Input_Microphone', css: 'wym_tools_audio_input_microphone' },
        AudioVolumeHigh: { title: 'Volume_High', css: 'wym_tools_audio_volume_high' },
        AudioVolumeLow: { title: 'Volume_Low', css: 'wym_tools_audio_volume_low' },
        AudioVolumeMedium: { title: 'Volume_Medium', css: 'wym_tools_audio_volume_medium' },
        AudioVolumeMuted: { title: 'Volume_Muted', css: 'wym_tools_audio_volume_muted' },
        BatteryAcAdapter: { title: 'Ac_Adapter', css: 'wym_tools_battery_ac_adapter' },
        BatteryCautionCharging: { title: 'Caution_Charging', css: 'wym_tools_battery_caution_charging' },
        BatteryCaution: { title: 'Caution', css: 'wym_tools_battery_caution' },
        BatteryDefault: { title: 'Default', css: 'wym_tools_battery_default' },
        BatteryEmpty: { title: 'Empty', css: 'wym_tools_battery_empty' },
        BatteryFullCharged: { title: 'Full_Charged', css: 'wym_tools_battery_full_charged' },
        BatteryFullCharging: { title: 'Full_Charging', css: 'wym_tools_battery_full_charging' },
        BatteryFull: { title: 'Full', css: 'wym_tools_battery_full' },
        BatteryGoodCharging: { title: 'Good_Charging', css: 'wym_tools_battery_good_charging' },
        BatteryGood: { title: 'Good', css: 'wym_tools_battery_good' },
        BatteryLowCharging: { title: 'Low_Charging', css: 'wym_tools_battery_low_charging' },
        BatteryLow: { title: 'Low', css: 'wym_tools_battery_low' },
        BatteryMissing: { title: 'Missing', css: 'wym_tools_battery_missing' },
        Blank: { title: '', css: 'wym_tools_blank' },
        CameraPhoto: { title: 'Photo', css: 'wym_tools_camera_photo' },
        CameraVideo: { title: 'Video', css: 'wym_tools_camera_video' },
        CameraWeb: { title: 'Web', css: 'wym_tools_camera_web' },
        DataInsertHorizontalLine: { title: 'Insert_Horizontal_Line', css: 'wym_tools_data_insert_horizontal_line' },
        DataInsertImage: { title: 'Insert_Image', css: 'wym_tools_data_insert_image' },
        DataInsertLink: { title: 'Insert_Link', css: 'wym_tools_data_insert_link' },
        DataInsertObject: { title: 'Insert_Object', css: 'wym_tools_data_insert_object' },
        DataInsertTableColumnLeft: { title: 'Insert_Table_Column_Left', css: 'wym_tools_data_insert_table_column_left' },
        DataInsertTableColumnRight: { title: 'Insert_Table_Column_Right', css: 'wym_tools_data_insert_table_column_right' },
        DataInsertTableRowAbove: { title: 'Insert_Table_Row_Above', css: 'wym_tools_data_insert_table_row_above' },
        DataInsertTableRowBelow: { title: 'Insert_Table_Row_Below', css: 'wym_tools_data_insert_table_row_below' },
        DataInsertTable: { title: 'Insert_Table', css: 'wym_tools_data_insert_table' },
        DataInsertText: { title: 'Insert_Text', css: 'wym_tools_data_insert_text' },
        DataRemoveLink: { title: 'Remove_Link', css: 'wym_tools_data_remove_link' },
        DataRemoveTableColumn: { title: 'Remove_Table_Column', css: 'wym_tools_data_remove_table_column' },
        DataRemoveTableRow: { title: 'Remove_Table_Row', css: 'wym_tools_data_remove_table_row' },
        DialogError: { title: 'Error', css: 'wym_tools_dialog_error' },
        DialogInformation: { title: 'Information', css: 'wym_tools_dialog_information' },
        DialogPassword: { title: 'Password', css: 'wym_tools_dialog_password' },
        DialogQuestion: { title: 'Question', css: 'wym_tools_dialog_question' },
        DialogWarning: { title: 'Warning', css: 'wym_tools_dialog_warning' },
        DocumentDefault: { title: 'Default', css: 'wym_tools_document_default' },
        DocumentNew: { title: 'New', css: 'wym_tools_document_new' },
        DocumentOpenRecent: { title: 'Open_Recent', css: 'wym_tools_document_open_recent' },
        DocumentOpen: { title: 'Open', css: 'wym_tools_document_open' },
        DocumentPageSetup: { title: 'Page_Setup', css: 'wym_tools_document_page_setup' },
        DocumentPrintPreview: { title: 'Print_Preview', css: 'wym_tools_document_print_preview' },
        DocumentPrint: { title: 'Print', css: 'wym_tools_document_print' },
        DocumentProperties: { title: 'Properties', css: 'wym_tools_document_properties' },
        DocumentRevert: { title: 'Revert', css: 'wym_tools_document_revert' },
        DocumentSaveAs: { title: 'Save_As', css: 'wym_tools_document_save_as' },
        DocumentSave: { title: 'Save', css: 'wym_tools_document_save' },
        DocumentSend: { title: 'Send', css: 'wym_tools_document_send' },
        DriveHarddisk: { title: 'Harddisk', css: 'wym_tools_drive_harddisk' },
        DriveOptical: { title: 'Optical', css: 'wym_tools_drive_optical' },
        DriveRemovableMedia: { title: 'Removable_Media', css: 'wym_tools_drive_removable_media' },
        EditClear: { title: 'Clear', css: 'wym_tools_edit_clear' },
        EditCopy: { title: 'Copy', css: 'wym_tools_edit_copy' },
        EditCut: { title: 'Cut', css: 'wym_tools_edit_cut' },
        EditDelete: { title: 'Delete', css: 'wym_tools_edit_delete' },
        EditFindReplace: { title: 'Find_Replace', css: 'wym_tools_edit_find_replace' },
        EditFind: { title: 'Find', css: 'wym_tools_edit_find' },
        EditPaste: { title: 'Paste', css: 'wym_tools_edit_paste' },
        EditRedo: { title: 'Redo', css: 'wym_tools_edit_redo' },
        EditSelectAll: { title: 'Select_All', css: 'wym_tools_edit_select_all' },
        EditUndo: { title: 'Undo', css: 'wym_tools_edit_undo' },
        EmblemAddressBookNew: { title: 'Address_Book_New', css: 'wym_tools_emblem_address_book_new' },
        EmblemBookmarkNew: { title: 'Bookmark_New', css: 'wym_tools_emblem_bookmark_new' },
        EmblemCheckSpelling: { title: 'Check_Spelling', css: 'wym_tools_emblem_check_spelling' },
        EmblemContactNew: { title: 'Contact_New', css: 'wym_tools_emblem_contact_new' },
        EmblemDefault: { title: 'Default', css: 'wym_tools_emblem_default' },
        EmblemDocuments: { title: 'Documents', css: 'wym_tools_emblem_documents' },
        EmblemDownloads: { title: 'Downloads', css: 'wym_tools_emblem_downloads' },
        EmblemFavorite: { title: 'Favorite', css: 'wym_tools_emblem_favorite' },
        EmblemGeneric: { title: 'Generic', css: 'wym_tools_emblem_generic' },
        EmblemImportant: { title: 'Important', css: 'wym_tools_emblem_important' },
        EmblemMail: { title: 'Mail', css: 'wym_tools_emblem_mail' },
        EmblemNew: { title: 'New', css: 'wym_tools_emblem_new' },
        EmblemPackage: { title: 'Package', css: 'wym_tools_emblem_package' },
        EmblemPhotos: { title: 'Photos', css: 'wym_tools_emblem_photos' },
        EmblemReadonly: { title: 'Readonly', css: 'wym_tools_emblem_readonly' },
        EmblemShared: { title: 'Shared', css: 'wym_tools_emblem_shared' },
        EmblemSymbolicLink: { title: 'Symbolic_Link', css: 'wym_tools_emblem_symbolic_link' },
        EmblemSystem: { title: 'System', css: 'wym_tools_emblem_system' },
        EmblemTabNew: { title: 'Tab_New', css: 'wym_tools_emblem_tab_new' },
        EmblemUnreadable: { title: 'Unreadable', css: 'wym_tools_emblem_unreadable' },
        EmblemUrgent: { title: 'Urgent', css: 'wym_tools_emblem_urgent' },
        EmblemWeb: { title: 'Web', css: 'wym_tools_emblem_web' },
        EmblemWindowClose: { title: 'Window_Close', css: 'wym_tools_emblem_window_close' },
        EmblemWindowNew: { title: 'Window_New', css: 'wym_tools_emblem_window_new' },
        FaceAngel: { title: 'Angel', css: 'wym_tools_face_angel' },
        FaceAngry: { title: 'Angry', css: 'wym_tools_face_angry' },
        FaceCool: { title: 'Cool', css: 'wym_tools_face_cool' },
        FaceCrying: { title: 'Crying', css: 'wym_tools_face_crying' },
        FaceDevilish: { title: 'Devilish', css: 'wym_tools_face_devilish' },
        FaceEmbarrassed: { title: 'Embarrassed', css: 'wym_tools_face_embarrassed' },
        FaceGlasses: { title: 'Glasses', css: 'wym_tools_face_glasses' },
        FaceKiss: { title: 'Kiss', css: 'wym_tools_face_kiss' },
        FaceLaugh: { title: 'Laugh', css: 'wym_tools_face_laugh' },
        FaceMonkey: { title: 'Monkey', css: 'wym_tools_face_monkey' },
        FacePlain: { title: 'Plain', css: 'wym_tools_face_plain' },
        FaceRaspberry: { title: 'Raspberry', css: 'wym_tools_face_raspberry' },
        FaceSad: { title: 'Sad', css: 'wym_tools_face_sad' },
        FaceSick: { title: 'Sick', css: 'wym_tools_face_sick' },
        FaceSmileBig: { title: 'Smile_Big', css: 'wym_tools_face_smile_big' },
        FaceSmile: { title: 'Smile', css: 'wym_tools_face_smile' },
        FaceSmirk: { title: 'Smirk', css: 'wym_tools_face_smirk' },
        FaceSurprise: { title: 'Surprise', css: 'wym_tools_face_surprise' },
        FaceTired: { title: 'Tired', css: 'wym_tools_face_tired' },
        FaceUncertain: { title: 'Uncertain', css: 'wym_tools_face_uncertain' },
        FaceWink: { title: 'Wink', css: 'wym_tools_face_wink' },
        FaceWorried: { title: 'Worried', css: 'wym_tools_face_worried' },
        FileAudioGeneric: { title: 'Audio_Generic', css: 'wym_tools_file_audio_x_generic' },
        FileFontGeneric: { title: 'Font_Generic', css: 'wym_tools_file_font_x_generic' },
        FileImageLoading: { title: 'Image_Loading', css: 'wym_tools_file_image_loading' },
        FileImageMissing: { title: 'Image_Missing', css: 'wym_tools_file_image_missing' },
        FileImageGeneric: { title: 'Image_Generic', css: 'wym_tools_file_image_x_generic' },
        FilePackageGeneric: { title: 'Package_Generic', css: 'wym_tools_file_package_x_generic' },
        FileSaveAs: { title: 'Save_As', css: 'wym_tools_file_save_as' },
        FileSave: { title: 'Save', css: 'wym_tools_file_save' },
        FileTextHtml: { title: 'Text_Html', css: 'wym_tools_file_text_html' },
        FileTextGenericTemplate: { title: 'Text_Generic_Template', css: 'wym_tools_file_text_x_generic_template' },
        FileTextGeneric: { title: 'Text_Generic', css: 'wym_tools_file_text_x_generic' },
        FileTextPreview: { title: 'Text_Preview', css: 'wym_tools_file_text_x_preview' },
        FileTextScript: { title: 'Text_Script', css: 'wym_tools_file_text_x_script' },
        FileTextXml: { title: 'Text_Xml', css: 'wym_tools_file_text_xml' },
        FileVideoGeneric: { title: 'Video_Generic', css: 'wym_tools_file_video_x_generic' },
        FileZip: { title: 'Zip', css: 'wym_tools_file_zip' },
        FolderDefault: { title: 'Default', css: 'wym_tools_folder_default' },
        FolderDocuments: { title: 'Documents', css: 'wym_tools_folder_documents' },
        FolderDownload: { title: 'Download', css: 'wym_tools_folder_download' },
        FolderDragAccept: { title: 'Drag_Accept', css: 'wym_tools_folder_drag_accept' },
        FolderMusic: { title: 'Music', css: 'wym_tools_folder_music' },
        FolderNew: { title: 'New', css: 'wym_tools_folder_new' },
        FolderOpen: { title: 'Open', css: 'wym_tools_folder_open' },
        FolderPictures: { title: 'Pictures', css: 'wym_tools_folder_pictures' },
        FolderPublicshare: { title: 'Publicshare', css: 'wym_tools_folder_publicshare' },
        FolderRemote: { title: 'Remote', css: 'wym_tools_folder_remote' },
        FolderSavedSearch: { title: 'Saved_Search', css: 'wym_tools_folder_saved_search' },
        FolderTemplates: { title: 'Templates', css: 'wym_tools_folder_templates' },
        FolderVideos: { title: 'Videos', css: 'wym_tools_folder_videos' },
        FolderVisiting: { title: 'Visiting', css: 'wym_tools_folder_visiting' },
        FormatIndentLess: { title: 'Indent_Less', css: 'wym_tools_format_indent_less' },
        FormatIndentMore: { title: 'Indent_More', css: 'wym_tools_format_indent_more' },
  /* */ FormatJustifyCenter: { title: 'Justify_Center', css: 'wym_tools_format_justify_center' },
  /* */ FormatJustifyFill: { title: 'Justify_Fill', css: 'wym_tools_format_justify_fill' },
  /* */ FormatJustifyLeft: { title: 'Justify_Left', css: 'wym_tools_format_justify_left' },
  /* */ FormatJustifyRight: { title: 'Justify_Right', css: 'wym_tools_format_justify_right' },
  /* */ FormatSubscript: { title: 'Subscript', css: 'wym_tools_format_subscript' },
  /* */ FormatSuperscript: { title: 'Superscript', css: 'wym_tools_format_superscript' },
  /* */ FormatTextBold: { title: 'Text_Bold', css: 'wym_tools_format_text_bold' },
  /* */ FormatTextDirectionLtr: { title: 'Text_Direction_Ltr', css: 'wym_tools_format_text_direction_ltr' },
  /* */ FormatTextDirectionRtl: { title: 'Text_Direction_Rtl', css: 'wym_tools_format_text_direction_rtl' },
  /* */ FormatTextItalic: { title: 'Text_Italic', css: 'wym_tools_format_text_italic' },
  /* */ FormatTextStrikethrough: { title: 'Text_Strikethrough', css: 'wym_tools_format_text_strikethrough' },
  /* */ FormatTextUnderline: { title: 'Text_Underline', css: 'wym_tools_format_text_underline' },
        HelpAbout: { title: 'About', css: 'wym_tools_help_about' },
        HelpBrowser: { title: 'Browser', css: 'wym_tools_help_browser' },
        HelpContents: { title: 'Contents', css: 'wym_tools_help_contents' },
        HelpFaq: { title: 'Faq', css: 'wym_tools_help_faq' },
        InputGaming: { title: 'Gaming', css: 'wym_tools_input_gaming' },
        InputKeyboard: { title: 'Keyboard', css: 'wym_tools_input_keyboard' },
        InputMouse: { title: 'Mouse', css: 'wym_tools_input_mouse' },
        InputTablet: { title: 'Tablet', css: 'wym_tools_input_tablet' },
        InputTouchpad: { title: 'Touchpad', css: 'wym_tools_input_touchpad' },
        ListAdd: { title: 'Add', css: 'wym_tools_list_add' },
        ListBullet: { title: 'Bullet', css: 'wym_tools_list_bullet' },
        ListEnum: { title: 'Enum', css: 'wym_tools_list_enum' },
        ListRemove: { title: 'Remove', css: 'wym_tools_list_remove' },
        ListSortAscending: { title: 'Sort_Ascending', css: 'wym_tools_list_sort_ascending' },
        ListSortDescending: { title: 'Sort_Descending', css: 'wym_tools_list_sort_descending' },
        MailAttachment: { title: 'Attachment', css: 'wym_tools_mail_attachment' },
        MailForward: { title: 'Forward', css: 'wym_tools_mail_forward' },
        MailMarkImportant: { title: 'Mark_Important', css: 'wym_tools_mail_mark_important' },
        MailMarkJunk: { title: 'Mark_Junk', css: 'wym_tools_mail_mark_junk' },
        MailMarkNotjunk: { title: 'Mark_Notjunk', css: 'wym_tools_mail_mark_notjunk' },
        MailMarkRead: { title: 'Mark_Read', css: 'wym_tools_mail_mark_read' },
        MailMarkUnread: { title: 'Mark_Unread', css: 'wym_tools_mail_mark_unread' },
        MailMessageNew: { title: 'Message_New', css: 'wym_tools_mail_message_new' },
        MailRead: { title: 'Read', css: 'wym_tools_mail_read' },
        MailReplied: { title: 'Replied', css: 'wym_tools_mail_replied' },
        MailReplyAll: { title: 'Reply_All', css: 'wym_tools_mail_reply_all' },
        MailReplySender: { title: 'Reply_Sender', css: 'wym_tools_mail_reply_sender' },
        MailSendReceive: { title: 'Send_Receive', css: 'wym_tools_mail_send_receive' },
        MailSend: { title: 'Send', css: 'wym_tools_mail_send' },
        MailSignedVerified: { title: 'Signed_Verified', css: 'wym_tools_mail_signed_verified' },
        MailSigned: { title: 'Signed', css: 'wym_tools_mail_signed' },
        MailUnread: { title: 'Unread', css: 'wym_tools_mail_unread' },
        MediaCallStart: { title: 'Call_Start', css: 'wym_tools_media_call_start' },
        MediaCallStop: { title: 'Call_Stop', css: 'wym_tools_media_call_stop' },
        MediaEject: { title: 'Eject', css: 'wym_tools_media_eject' },
        MediaFlash: { title: 'Flash', css: 'wym_tools_media_flash' },
        MediaFloppy: { title: 'Floppy', css: 'wym_tools_media_floppy' },
        MediaGoBottom: { title: 'Go_Bottom', css: 'wym_tools_media_go_bottom' },
        MediaGoDown: { title: 'Go_Down', css: 'wym_tools_media_go_down' },
        MediaGoFirst: { title: 'Go_First', css: 'wym_tools_media_go_first' },
        MediaGoHome: { title: 'Go_Home', css: 'wym_tools_media_go_home' },
        MediaGoJump: { title: 'Go_Jump', css: 'wym_tools_media_go_jump' },
        MediaGoLast: { title: 'Go_Last', css: 'wym_tools_media_go_last' },
        MediaGoNext: { title: 'Go_Next', css: 'wym_tools_media_go_next' },
        MediaGoPrevious: { title: 'Go_Previous', css: 'wym_tools_media_go_previous' },
        MediaGoTop: { title: 'Go_Top', css: 'wym_tools_media_go_top' },
        MediaGoUp: { title: 'Go_Up', css: 'wym_tools_media_go_up' },
        MediaOptical: { title: 'Optical', css: 'wym_tools_media_optical' },
        MediaPlaybackPause: { title: 'Playback_Pause', css: 'wym_tools_media_playback_pause' },
        MediaPlaybackStart: { title: 'Playback_Start', css: 'wym_tools_media_playback_start' },
        MediaPlaybackStop: { title: 'Playback_Stop', css: 'wym_tools_media_playback_stop' },
        MediaPlayer: { title: 'Player', css: 'wym_tools_media_player' },
        MediaPlaylistRepeat: { title: 'Playlist_Repeat', css: 'wym_tools_media_playlist_repeat' },
        MediaPlaylistShuffle: { title: 'Playlist_Shuffle', css: 'wym_tools_media_playlist_shuffle' },
        MediaRecord: { title: 'Record', css: 'wym_tools_media_record' },
        MediaSeekBackward: { title: 'Seek_Backward', css: 'wym_tools_media_seek_backward' },
        MediaSeekForward: { title: 'Seek_Forward', css: 'wym_tools_media_seek_forward' },
        MediaSkipBackward: { title: 'Skip_Backward', css: 'wym_tools_media_skip_backward' },
        MediaSkipForward: { title: 'Skip_Forward', css: 'wym_tools_media_skip_forward' },
        MediaTape: { title: 'Tape', css: 'wym_tools_media_tape' },
        MediaVolumeControl: { title: 'Volume_Control', css: 'wym_tools_media_volume_control' },
        MiscChangesAllow: { title: 'Changes_Allow', css: 'wym_tools_misc_changes_allow' },
        MiscChangesPrevent: { title: 'Changes_Prevent', css: 'wym_tools_misc_changes_prevent' },
        MiscComputer: { title: 'Computer', css: 'wym_tools_misc_computer' },
        MiscPda: { title: 'Pda', css: 'wym_tools_misc_pda' },
        MiscPhone: { title: 'Phone', css: 'wym_tools_misc_phone' },
        MiscProcessStop: { title: 'Process_Stop', css: 'wym_tools_misc_process_stop' },
        MiscScanner: { title: 'Scanner', css: 'wym_tools_misc_scanner' },
        MiscStartHere: { title: 'Start_Here', css: 'wym_tools_misc_start_here' },
        MiscVideoDisplay: { title: 'Video_Display', css: 'wym_tools_misc_video_display' },
        NetworkError: { title: 'Error', css: 'wym_tools_network_error' },
        NetworkIdle: { title: 'Idle', css: 'wym_tools_network_idle' },
        NetworkModem: { title: 'Modem', css: 'wym_tools_network_modem' },
        NetworkOffline: { title: 'Offline', css: 'wym_tools_network_offline' },
        NetworkReceive: { title: 'Receive', css: 'wym_tools_network_receive' },
        NetworkServer: { title: 'Server', css: 'wym_tools_network_server' },
        NetworkTransmitReceive: { title: 'Transmit_Receive', css: 'wym_tools_network_transmit_receive' },
        NetworkTransmit: { title: 'Transmit', css: 'wym_tools_network_transmit' },
        NetworkWired: { title: 'Wired', css: 'wym_tools_network_wired' },
        NetworkWirelessEncrypted: { title: 'Wireless_Encrypted', css: 'wym_tools_network_wireless_encrypted' },
        NetworkWireless: { title: 'Wireless', css: 'wym_tools_network_wireless' },
        NetworkWorkgroup: { title: 'Workgroup', css: 'wym_tools_network_workgroup' },
        ObjectFlipHorizontal: { title: 'Flip_Horizontal', css: 'wym_tools_object_flip_horizontal' },
        ObjectFlipVertical: { title: 'Flip_Vertical', css: 'wym_tools_object_flip_vertical' },
        ObjectRotateLeft: { title: 'Rotate_Left', css: 'wym_tools_object_rotate_left' },
        ObjectRotateRight: { title: 'Rotate_Right', css: 'wym_tools_object_rotate_right' },
        PreferencesDesktopAccessibility: { title: 'Desktop_Accessibility', css: 'wym_tools_preferences_desktop_accessibility' },
        PreferencesDesktopDisplay: { title: 'Desktop_Display', css: 'wym_tools_preferences_desktop_display' },
        PreferencesDesktopFont: { title: 'Desktop_Font', css: 'wym_tools_preferences_desktop_font' },
        PreferencesDesktopKeyboardShortcuts: { title: 'Desktop_Keyboard_Shortcuts', css: 'wym_tools_preferences_desktop_keyboard_shortcuts' },
        PreferencesDesktopKeyboard: { title: 'Desktop_Keyboard', css: 'wym_tools_preferences_desktop_keyboard' },
        PreferencesDesktopLocale: { title: 'Desktop_Locale', css: 'wym_tools_preferences_desktop_locale' },
        PreferencesDesktopPeripherals: { title: 'Desktop_Peripherals', css: 'wym_tools_preferences_desktop_peripherals' },
        PreferencesDesktopPersonal: { title: 'Desktop_Personal', css: 'wym_tools_preferences_desktop_personal' },
        PreferencesDesktopRemoteDesktop: { title: 'Desktop_Remote_Desktop', css: 'wym_tools_preferences_desktop_remote_desktop' },
        PreferencesDesktopScreensaver: { title: 'Desktop_Screensaver', css: 'wym_tools_preferences_desktop_screensaver' },
        PreferencesDesktopTheme: { title: 'Desktop_Theme', css: 'wym_tools_preferences_desktop_theme' },
        PreferencesDesktopWallpaper: { title: 'Desktop_Wallpaper', css: 'wym_tools_preferences_desktop_wallpaper' },
        PreferencesDesktop: { title: 'Desktop', css: 'wym_tools_preferences_desktop' },
        PreferencesOther: { title: 'Other', css: 'wym_tools_preferences_other' },
        PreferencesSystemNetwork: { title: 'System_Network', css: 'wym_tools_preferences_system_network' },
        PreferencesSystemWindows: { title: 'System_Windows', css: 'wym_tools_preferences_system_windows' },
        PreferencesSystem: { title: 'System', css: 'wym_tools_preferences_system' },
        PrinterDefault: { title: 'Default', css: 'wym_tools_printer_default' },
        PrinterError: { title: 'Error', css: 'wym_tools_printer_error' },
        PrinterPrinting: { title: 'Printing', css: 'wym_tools_printer_printing' },
        ReminderAppointmentMissed: { title: 'Appointment_Missed', css: 'wym_tools_reminder_appointment_missed' },
        ReminderAppointmentNew: { title: 'Appointment_New', css: 'wym_tools_reminder_appointment_new' },
        ReminderAppointmentSoon: { title: 'Appointment_Soon', css: 'wym_tools_reminder_appointment_soon' },
        ReminderTaskDue: { title: 'Task_Due', css: 'wym_tools_reminder_task_due' },
        ReminderTaskPastDue: { title: 'Task_Past_Due', css: 'wym_tools_reminder_task_past_due' },
        SecurityHigh: { title: 'High', css: 'wym_tools_security_high' },
        SecurityLow: { title: 'Low', css: 'wym_tools_security_low' },
        SecurityMedium: { title: 'Medium', css: 'wym_tools_security_medium' },
        SecuritySoftwareUpdateAvailable: { title: 'Software_Update_Available', css: 'wym_tools_security_software_update_available' },
        SecuritySoftwareUpdateUrgent: { title: 'Software_Update_Urgent', css: 'wym_tools_security_software_update_urgent' },
        SystemFileManager: { title: 'File_Manager', css: 'wym_tools_system_file_manager' },
        SystemFontDefault: { title: 'Font_Default', css: 'wym_tools_system_font_default' },
        SystemFonts: { title: 'Fonts', css: 'wym_tools_system_fonts' },
        SystemHelp: { title: 'Help', css: 'wym_tools_system_help' },
        SystemLockScreen: { title: 'Lock_Screen', css: 'wym_tools_system_lock_screen' },
        SystemLogOut: { title: 'Log_Out', css: 'wym_tools_system_log_out' },
        SystemRun: { title: 'Run', css: 'wym_tools_system_run' },
        SystemSearch: { title: 'Search', css: 'wym_tools_system_search' },
        SystemShutdown: { title: 'Shutdown', css: 'wym_tools_system_shutdown' },
        SystemSoftwareInstall: { title: 'Software_Install', css: 'wym_tools_system_software_install' },
        SystemSoftwareUpdate: { title: 'Software_Update', css: 'wym_tools_system_software_update' },
        SystemUsers: { title: 'Users', css: 'wym_tools_system_users' },
        UserAvailable: { title: 'Available', css: 'wym_tools_user_available' },
        UserAvatarDefault: { title: 'Avatar_Default', css: 'wym_tools_user_avatar_default' },
        UserAway: { title: 'Away', css: 'wym_tools_user_away' },
        UserBookmarks: { title: 'Bookmarks', css: 'wym_tools_user_bookmarks' },
        UserBusy: { title: 'Busy', css: 'wym_tools_user_busy' },
        UserDesktop: { title: 'Desktop', css: 'wym_tools_user_desktop' },
        UserHome: { title: 'Home', css: 'wym_tools_user_home' },
        UserIdle: { title: 'Idle', css: 'wym_tools_user_idle' },
        UserInfo: { title: 'Info', css: 'wym_tools_user_info' },
        UserInvisible: { title: 'Invisible', css: 'wym_tools_user_invisible' },
        UserOffline: { title: 'Offline', css: 'wym_tools_user_offline' },
        UserTrashFull: { title: 'Trash_Full', css: 'wym_tools_user_trash_full' },
        UserTrash: { title: 'Trash', css: 'wym_tools_user_trash' },
        ViewFullscreen: { title: 'Fullscreen', css: 'wym_tools_view_fullscreen' },
        ViewRefresh: { title: 'Refresh', css: 'wym_tools_view_refresh' },
        ViewRestore: { title: 'Restore', css: 'wym_tools_view_restore' },
        WeatherClearNight: { title: 'Clear_Night', css: 'wym_tools_weather_clear_night' },
        WeatherClear: { title: 'Clear', css: 'wym_tools_weather_clear' },
        WeatherFewCloudsNight: { title: 'Few_Clouds_Night', css: 'wym_tools_weather_few_clouds_night' },
        WeatherFewClouds: { title: 'Few_Clouds', css: 'wym_tools_weather_few_clouds' },
        WeatherFog: { title: 'Fog', css: 'wym_tools_weather_fog' },
        WeatherOvercast: { title: 'Overcast', css: 'wym_tools_weather_overcast' },
        WeatherSevereAlert: { title: 'Severe_Alert', css: 'wym_tools_weather_severe_alert' },
        WeatherShowersScattered: { title: 'Showers_Scattered', css: 'wym_tools_weather_showers_scattered' },
        WeatherShowers: { title: 'Showers', css: 'wym_tools_weather_showers' },
        WeatherSnow: { title: 'Snow', css: 'wym_tools_weather_snow' },
        WeatherStorm: { title: 'Storm', css: 'wym_tools_weather_storm' },
        OfficeAddressBook: { title: 'Address_Book', css: 'wym_tools_x_office_address_book' },
        OfficeCalendar: { title: 'Calendar', css: 'wym_tools_x_office_calendar' },
        OfficeDocumentTemplate: { title: 'Document_Template', css: 'wym_tools_x_office_document_template' },
        OfficeDocument: { title: 'Document', css: 'wym_tools_x_office_document' },
        OfficeDrawingTemplate: { title: 'Drawing_Template', css: 'wym_tools_x_office_drawing_template' },
        OfficeDrawing: { title: 'Drawing', css: 'wym_tools_x_office_drawing' },
        OfficePresentationTemplate: { title: 'Presentation_Template', css: 'wym_tools_x_office_presentation_template' },
        OfficePresentation: { title: 'Presentation', css: 'wym_tools_x_office_presentation' },
        OfficeSpreadsheetTemplate: { title: 'Spreadsheet_Template', css: 'wym_tools_x_office_spreadsheet_template' },
        OfficeSpreadsheet: { title: 'Spreadsheet', css: 'wym_tools_x_office_spreadsheet' },
        ZoomFitBest: { title: 'Fit_Best', css: 'wym_tools_zoom_fit_best' },
        ZoomIn: { title: 'In', css: 'wym_tools_zoom_in' },
        ZoomOriginal: { title: 'Original', css: 'wym_tools_zoom_original' },
        ZoomOut: { title: 'Out', css: 'wym_tools_zoom_out' }
    };
    for(var n in availableToolsHash) {
      availableToolsHash[n].name = n;
      availableToolsHash[n].file = baseDir + '/' + baseFile + '.' + n + '.js';
    }
    return availableToolsHash;
};

/**
 * Provides the list of all available tool names.
 * 
 * @return  An array of all available tool names.
 */
WYMeditor.editor.prototype.desktop.availableToolNames = function() {
    var availableNames = new Array();
    var available = this.availableTools();
    for(var n in available) {
        availableNames.push(n);
    }
    return availableNames;
};

/**
 * Provides the list of default tool names.
 * 
 * @return  An array of default tool names.
 */
WYMeditor.editor.prototype.desktop.defaultToolNames = function() {
    // These are the tools provided by the default skin.
    var defaultNames = [
        'FormatTextBold', 'FormatTextItalic', 'FormatSuperscript',
        'FormatSubscript', 'InsertOrderedList', 'InsertUnorderedList',
        'FormatIndentMore', 'FormatIndentLess', 'EditUndo', 'EditRedo',
        'DataInsertLink', 'DataRemoveLink', 'DataInsertImage',
        'DataInsertTable', 'EditPaste', 'FileTextXml', 'ApplicationsLogviewer'
    ];
    return defaultNames;
};

/**
 * Provides the list of valid tag strings.
 * 
 * @return  An array of valid tag strings.
 */
WYMeditor.editor.prototype.desktop.validTags = function() {
    var validTagStrings = [
        ':accessories', ':applications', ':audio', ':battery', ':blank',
        ':camera', ':data', ':dialog', ':document', ':drive', ':edit',
        ':emblem', ':face', ':file', ':folder', ':format', ':help', ':input',
        ':list', ':mail', ':media', ':misc', ':network', ':object',
        ':preferences', ':printer', ':reminder', ':security', ':system',
        ':user', ':view', ':weather', ':office', ':zoom'
    ];
    return validTagStrings;
};

/**
 * Convert a tag string into a list of tool names.  The recognized tags are:
 *     ':default', ':all', and any string from the array returned by the
 *     .validTags() method.
 * 
 * @param tagString  The tag string to expand.
 * @return  An array of strings, where each string is the name of a tool.
 */
WYMeditor.editor.prototype.desktop.expandTag = function(tagString) {
  var tagToolList;
  switch(tagString) {
      case ':default':
          tagToolList = this.defaultToolNames();
          break;
      case ':all':
          tagToolList = this.availableToolNames();
          break;
      case ':accessories':
          tagToolList = ['AccessoriesCalculator', 'AccessoriesCharacterMap', 'AccessoriesDictionary', 'AccessoriesTextEditor'];
          break;
      case ':applications':
          tagToolList = ['ApplicationsAccessories', 'ApplicationsCertificate', 'ApplicationsDevelopment', 'ApplicationsEngineering', 'ApplicationsExit', 'ApplicationsGames', 'ApplicationsGraphics', 'ApplicationsInternet', 'ApplicationsLogviewer', 'ApplicationsMultimedia', 'ApplicationsOffice', 'ApplicationsOther', 'ApplicationsScience', 'ApplicationsScreenCapture', 'ApplicationsSystemMonitor', 'ApplicationsSystem', 'ApplicationsTerminal', 'ApplicationsUtilities', 'ApplicationsWebBrowser', 'ApplicationsExecutable'];
          break;
      case ':audio':
          tagToolList = ['AudioCard', 'AudioInputMicrophone', 'AudioVolumeHigh', 'AudioVolumeLow', 'AudioVolumeMedium', 'AudioVolumeMuted'];
          break;
      case ':battery':
          tagToolList = ['BatteryAcAdapter', 'BatteryCautionCharging', 'BatteryCaution', 'BatteryDefault', 'BatteryEmpty', 'BatteryFullCharged', 'BatteryFullCharging', 'BatteryFull', 'BatteryGoodCharging', 'BatteryGood', 'BatteryLowCharging', 'BatteryLow', 'BatteryMissing'];
          break;
      case ':blank':
          tagToolList = ['Blank'];
          break;
      case ':camera':
          tagToolList = ['CameraPhoto', 'CameraVideo', 'CameraWeb'];
          break;
      case ':data':
          tagToolList = ['DataInsertHorizontalLine', 'DataInsertImage', 'DataInsertLink', 'DataInsertObject', 'DataInsertTableColumnLeft', 'DataInsertTableColumnRight', 'DataInsertTableRowAbove', 'DataInsertTableRowBelow', 'DataInsertTable', 'DataInsertText', 'DataRemoveLink', 'DataRemoveTableColumn', 'DataRemoveTableRow'];
          break;
      case ':dialog':
          tagToolList = ['DialogError', 'DialogInformation', 'DialogPassword', 'DialogQuestion', 'DialogWarning'];
          break;
      case ':document':
          tagToolList = ['DocumentDefault', 'DocumentNew', 'DocumentOpenRecent', 'DocumentOpen', 'DocumentPageSetup', 'DocumentPrintPreview', 'DocumentPrint', 'DocumentProperties', 'DocumentRevert', 'DocumentSaveAs', 'DocumentSave', 'DocumentSend'];
          break;
      case ':drive':
          tagToolList = ['DriveHarddisk', 'DriveOptical', 'DriveRemovableMedia'];
          break;
      case ':edit':
          tagToolList = ['EditClear', 'EditCopy', 'EditCut', 'EditDelete', 'EditFindReplace', 'EditFind', 'EditPaste', 'EditRedo', 'EditSelectAll', 'EditUndo'];
          break;
      case ':emblem':
          tagToolList = ['EmblemAddressBookNew', 'EmblemBookmarkNew', 'EmblemCheckSpelling', 'EmblemContactNew', 'EmblemDefault', 'EmblemDocuments', 'EmblemDownloads', 'EmblemFavorite', 'EmblemGeneric', 'EmblemImportant', 'EmblemMail', 'EmblemNew', 'EmblemPackage', 'EmblemPhotos', 'EmblemReadonly', 'EmblemShared', 'EmblemSymbolicLink', 'EmblemSystem', 'EmblemTabNew', 'EmblemUnreadable', 'EmblemUrgent', 'EmblemWeb', 'EmblemWindowClose', 'EmblemWindowNew'];
          break;
      case ':face':
          tagToolList = ['FaceAngel', 'FaceAngry', 'FaceCool', 'FaceCrying', 'FaceDevilish', 'FaceEmbarrassed', 'FaceGlasses', 'FaceKiss', 'FaceLaugh', 'FaceMonkey', 'FacePlain', 'FaceRaspberry', 'FaceSad', 'FaceSick', 'FaceSmileBig', 'FaceSmile', 'FaceSmirk', 'FaceSurprise', 'FaceTired', 'FaceUncertain', 'FaceWink', 'FaceWorried'];
          break;
      case ':file':
          tagToolList = ['FileAudioGeneric', 'FileFontGeneric', 'FileImageLoading', 'FileImageMissing', 'FileImageGeneric', 'FilePackageGeneric', 'FileSaveAs', 'FileSave', 'FileTextHtml', 'FileTextGenericTemplate', 'FileTextGeneric', 'FileTextPreview', 'FileTextScript', 'FileTextXml', 'FileVideoGeneric', 'FileZip'];
          break;
      case ':folder':
          tagToolList = ['FolderDefault', 'FolderDocuments', 'FolderDownload', 'FolderDragAccept', 'FolderMusic', 'FolderNew', 'FolderOpen', 'FolderPictures', 'FolderPublicshare', 'FolderRemote', 'FolderSavedSearch', 'FolderTemplates', 'FolderVideos', 'FolderVisiting'];
          break;
      case ':format':
          tagToolList = ['FormatIndentLess', 'FormatIndentMore', 'FormatJustifyCenter', 'FormatJustifyFill', 'FormatJustifyLeft', 'FormatJustifyRight', 'FormatSubscript', 'FormatSuperscript', 'FormatTextBold', 'FormatTextDirectionLtr', 'FormatTextDirectionRtl', 'FormatTextItalic', 'FormatTextStrikethrough', 'FormatTextUnderline'];
          break;
      case ':help':
          tagToolList = ['HelpAbout', 'HelpBrowser', 'HelpContents', 'HelpFaq'];
          break;
      case ':input':
          tagToolList = ['InputGaming', 'InputKeyboard', 'InputMouse', 'InputTablet', 'InputTouchpad'];
          break;
      case ':list':
          tagToolList = ['ListAdd', 'ListBullet', 'ListEnum', 'ListRemove', 'ListSortAscending', 'ListSortDescending'];
          break;
      case ':mail':
          tagToolList = ['MailAttachment', 'MailForward', 'MailMarkImportant', 'MailMarkJunk', 'MailMarkNotjunk', 'MailMarkRead', 'MailMarkUnread', 'MailMessageNew', 'MailRead', 'MailReplied', 'MailReplyAll', 'MailReplySender', 'MailSendReceive', 'MailSend', 'MailSignedVerified', 'MailSigned', 'MailUnread'];
          break;
      case ':media':
          tagToolList = ['MediaCallStart', 'MediaCallStop', 'MediaEject', 'MediaFlash', 'MediaFloppy', 'MediaGoBottom', 'MediaGoDown', 'MediaGoFirst', 'MediaGoHome', 'MediaGoJump', 'MediaGoLast', 'MediaGoNext', 'MediaGoPrevious', 'MediaGoTop', 'MediaGoUp', 'MediaOptical', 'MediaPlaybackPause', 'MediaPlaybackStart', 'MediaPlaybackStop', 'MediaPlayer', 'MediaPlaylistRepeat', 'MediaPlaylistShuffle', 'MediaRecord', 'MediaSeekBackward', 'MediaSeekForward', 'MediaSkipBackward', 'MediaSkipForward', 'MediaTape', 'MediaVolumeControl'];
          break;
      case ':misc':
          tagToolList = ['MiscChangesAllow', 'MiscChangesPrevent', 'MiscComputer', 'MiscPda', 'MiscPhone', 'MiscProcessStop', 'MiscScanner', 'MiscStartHere', 'MiscVideoDisplay'];
          break;
      case ':network':
          tagToolList = ['NetworkError', 'NetworkIdle', 'NetworkModem', 'NetworkOffline', 'NetworkReceive', 'NetworkServer', 'NetworkTransmitReceive', 'NetworkTransmit', 'NetworkWired', 'NetworkWirelessEncrypted', 'NetworkWireless', 'NetworkWorkgroup'];
          break;
      case ':object':
          tagToolList = ['ObjectFlipHorizontal', 'ObjectFlipVertical', 'ObjectRotateLeft', 'ObjectRotateRight'];
          break;
      case ':office':
          tagToolList = ['OfficeAddressBook', 'OfficeCalendar', 'OfficeDocumentTemplate', 'OfficeDocument', 'OfficeDrawingTemplate', 'OfficeDrawing', 'OfficePresentationTemplate', 'OfficePresentation', 'OfficeSpreadsheetTemplate', 'OfficeSpreadsheet'];
          break;
      case ':preferences':
          tagToolList = ['PreferencesDesktopAccessibility', 'PreferencesDesktopDisplay', 'PreferencesDesktopFont', 'PreferencesDesktopKeyboardShortcuts', 'PreferencesDesktopKeyboard', 'PreferencesDesktopLocale', 'PreferencesDesktopPeripherals', 'PreferencesDesktopPersonal', 'PreferencesDesktopRemoteDesktop', 'PreferencesDesktopScreensaver', 'PreferencesDesktopTheme', 'PreferencesDesktopWallpaper', 'PreferencesDesktop', 'PreferencesOther', 'PreferencesSystemNetwork', 'PreferencesSystemWindows', 'PreferencesSystem'];
          break;
      case ':printer':
          tagToolList = ['PrinterDefault', 'PrinterError', 'PrinterPrinting'];
          break;
      case ':reminder':
          tagToolList = ['ReminderAppointmentMissed', 'ReminderAppointmentNew', 'ReminderAppointmentSoon', 'ReminderTaskDue', 'ReminderTaskPastDue'];
          break;
      case ':security':
          tagToolList = ['SecurityHigh', 'SecurityLow', 'SecurityMedium', 'SecuritySoftwareUpdateAvailable', 'SecuritySoftwareUpdateUrgent'];
          break;
      case ':system':
          tagToolList = ['SystemFileManager', 'SystemFontDefault', 'SystemFonts', 'SystemHelp', 'SystemLockScreen', 'SystemLogOut', 'SystemRun', 'SystemSearch', 'SystemShutdown', 'SystemSoftwareInstall', 'SystemSoftwareUpdate', 'SystemUsers'];
          break;
      case ':user':
          tagToolList = ['UserAvailable', 'UserAvatarDefault', 'UserAway', 'UserBookmarks', 'UserBusy', 'UserDesktop', 'UserHome', 'UserIdle', 'UserInfo', 'UserInvisible', 'UserOffline', 'UserTrashFull', 'UserTrash'];
          break;
      case ':view':
          tagToolList = ['ViewFullscreen', 'ViewRefresh', 'ViewRestore'];
          break;
      case ':weather':
          tagToolList = ['WeatherClearNight', 'WeatherClear', 'WeatherFewCloudsNight', 'WeatherFewClouds', 'WeatherFog', 'WeatherOvercast', 'WeatherSevereAlert', 'WeatherShowersScattered', 'WeatherShowers', 'WeatherSnow', 'WeatherStorm'];
          break;
      case ':zoom':
          tagToolList = ['ZoomFitBest', 'ZoomIn', 'ZoomOriginal', 'ZoomOut'];
          break;
      default:
          tagToolList = "";
          break;
  }
  return tagToolList;
};

/**
 * Normalizes the requestedTools variable to what is internally expected.
 * 
 * @param requestedTools  The variable to normalize.
 * @return  The normalized variable.
 */
WYMeditor.editor.prototype.desktop.cleanupRequestedTools = function(requestedTools) {
    // Check for the existence of a tag string.
    if( (requestedTools != undefined) &&
        (typeof(requestedTools) == "string") &&
        requestedTools.match(/^[:][A-Za-z]+$/) ) {
        requestedTools = this.expandTag(requestedTools);
    }

    // Load the defaults if requestedTools is not what we expect.
    if((requestedTools != undefined) && (typeof(requestedTools) == "string")) {
        requestedTools = [requestedTools];
    }
    if(requestedTools == undefined) {
        requestedTools = this.defaultToolNames();
    }
    else if(!( (typeof(requestedTools) == "object") &&
               (requestedTools instanceof Array) )) {
        requestedTools = this.defaultToolNames();
    }

    return requestedTools;
}
 
/**
 * Generate an array of objects (which contain the default configuration) from
 * the given list of requested tools.
 * 
 * @param requestedTools  An array of strings (each is the name of a tool).
 * @return  The generated list of tools with their default configurations.
 */
WYMeditor.editor.prototype.desktop.generateToolList = function(requestedTools) {
    requestedTools = this.cleanupRequestedTools(requestedTools);

    var toolList = new Array();
    var toolData = this.availableTools();
    for(var i = 0; i < requestedTools.length; i++) {
        for(var x in toolData) {
            if(typeof(requestedTools[i]) == "string") {
                if( requestedTools[i].match(/^[:][A-Za-z]+$/) ) {
                    var tempList = this.expandTag(requestedTools[i]);
                    if( (typeof(tempList) == "object") &&
                        (tempList instanceof Array) ) {
                        for(var n = 0; n < tempList.length; n++) {
                            if(toolData[tempList[n]] != undefined) {
                                toolList.push(toolData[tempList[n]]);
                            }
                        }
                        break;
                    }
                }
                else {
                    var regex = new RegExp( "^\\s*(?:\\b)" +
                                            toolData[x].name +
                                            "(?:\\b)\\s*$", "i" );
                    if(requestedTools[i].match(regex)) {
                        toolList.push(toolData[x]);
                        break;
                    }
                }
            }
        }
    }

    return toolList;
};

/**
 * Initialize the Desktop plugin for the WYMeditor.
 * 
 * @param requestedTools  Either an array of strings (each string can be one of
 *                        the names of which tools you want or a "tag" string)
 *                        or an array of objects (each object must have at least
 *                        'name', 'title', and 'css').
 *                        Valid keys are:
 *                          'name'  The tool name.
 *                          'title'  The tool title.
 *                          'css'  The tool CSS class name.
 *                          'file'  The JavaScript file associated with this
 *                                  tool.
 *                          '{event}'  Any event name returned by the
 *                                     .availableEventNames() method; can be set
 *                                     to either a boolean value or an anonymous
 *                                     function.  If boolean, sets the event
 *                                     handler according to the code in the file
 *                                     referenced by 'file'.
 *                        Valid tags are:  ':default', ':all',  and any string
 *                                         from the array returned by the
 *                                         .validTags() method.
 * @param parentObj  A reference to the WYMeditor object.  [Optional; to use the
 *                   default value, pass in the null value.]
 * @param isDebug  A boolean value which turns debugging console output on or
 *                 off.  [Optional; to use the default value, pass in the null
 *                 value.]
 * @param dependList  A list of JavaScript dependencies to be loaded (they will
 *                    be loaded in the order given).
 */
WYMeditor.editor.prototype.desktop.init = function(requestedTools, parentObj, isDebug, dependList) {
    if((parentObj === null) && (this.parent != undefined)) {
        parentObj = this.parent;
    }
    if( (parentObj != undefined) && (typeof(parentObj) == "object") &&
        (parentObj._wym != undefined) && (typeof(parentObj._wym) == "object") &&
        (parentObj._box != undefined) ) {
        this.setParent(parentObj);
    }
    if((isDebug === null) && (this.DEBUG != undefined)) {
        isDebug = this.DEBUG;
    }
    if((isDebug != undefined) && (typeof(isDebug) == "boolean")) {
        this.setDebug(isDebug);
    }
    if(this.dependency == undefined) {
        this.dependency = new Object();
        this.dependency.isDone = "new";
    }
    var desktop = this;

    if(dependList == undefined) {
        var baseDir = this.parent.computeBasePath() + "plugins/rangy";
        dependList = [ baseDir + '/rangy-core.js',
                       baseDir + '/rangy-cssclassapplier.js',
                       baseDir + '/rangy-selectionsaverestore.js',
                       baseDir + '/jquery.wymeditor.rangy.js' ];
    }

    if( (dependList != undefined) &&
        (typeof(dependList) == "object") &&
        (dependList instanceof Array) &&
        (dependList.length >= 1) ) {
        /*
         * Generate a closure to handle the successful retrieval of the JavaScript
         * dependencies.
         */
        function generateSuccessHandler(dependFile, reqTools, dependArray, desk) {
            // We need to generate a closure or else the toolName, toolFile, and
            // toolIndex variables will contain the values of the last tool queued.
            var closure = function() {
                              desk.dependency.isDone = "success";
                              if( (desk.DEBUG != undefined) &&
                                  (typeof(desk.DEBUG) == "boolean") &&
                                  desk.DEBUG ) {
                                  console.log( "Successfully loaded Desktop dependency: " +
                                               dependFile );
                              }
                              desk.init(reqTools, desk.parent, desk.DEBUG, dependArray);
                          };
            return closure;
        }

        /*
         * Generate a closure to handle the failed retrieval of the JavaScript
         * dependencies.
         */
        function generateErrorHandler(dependFile, dependArray, desk) {
            // We need to generate a closure or else the toolName, toolFile, and
            // toolIndex variables will contain the values of the last tool queued.
            var closure = function(eventObj) {
                              desk.dependency.isDone = "error";
                              if( (desk.DEBUG != undefined) &&
                                  (typeof(desk.DEBUG) == "boolean") &&
                                  desk.DEBUG ) {
                                  console.log( "Could not load Desktop dependency: " +
                                               dependFile );
                                  console.log(eventObj);
                              }
                          };
            return closure;
        }

        if( (desktop.dependency.isDone == "new") ||
            (desktop.dependency.isDone == "success") ) {
            var depend = dependList.shift();
            if( (desktop.DEBUG != undefined) &&
                (typeof(desktop.DEBUG) == "boolean") &&
                desktop.DEBUG ) {
                console.log("Attempting to load Desktop dependency: " + depend);
            }
            desktop.dependency.isDone = "waiting";
            jQuery.getScript( depend,
                              generateSuccessHandler( depend, requestedTools,
                                                      dependList, desktop ) )
                  .error( generateErrorHandler( depend, dependList, desktop ) );
        }
        else if(desktop.dependency.isDone == "error") {
            if( (desktop.DEBUG != undefined) &&
                (typeof(desktop.DEBUG) == "boolean") &&
                desktop.DEBUG ) {
                console.log( "There was an error loading a previous dependency.  " +
                             "As the dependency loading chain is broken, no more " +
                             "dependencies will be loaded." );
            }
        }
        else {
            if( (desktop.DEBUG != undefined) &&
                (typeof(desktop.DEBUG) == "boolean") &&
                desktop.DEBUG ) {
                console.log( "Unknown dependency 'isDone' flag: " +
                             desktop.dependency.isDone );
            }
        }
    }
    else {
        desktop._init(requestedTools);
    }
};

/*
 * Internal method for generating the individual list elements.
 */
WYMeditor.editor.prototype.desktop._getListElem = function(name, title, css) {
    var elem = '<li class="'+css+'" id="'+css+'">' +
               '<a href="#" name="'+name+'" title="'+title+'">'+title+'</a>' +
               '</li>';
    return elem;
}

/*
 * Internal init code called after all dependencies have been loaded.
 */
WYMeditor.editor.prototype.desktop._init = function(requestedTools) {
    this.defineSelectedTools();
    var desktop = this;
    requestedTools = this.cleanupRequestedTools(requestedTools);

    /*
     * Generate a closure to handle the successful retrieval of the JavaScript
     * associated with the given tool.
     */
    function generateSuccessHandler(toolName, toolFile, toolIndex, desk, jQueryObj, htmlDoc) {
        // We need to generate a closure or else the toolName, toolFile, and
        // toolIndex variables will contain the values of the last tool queued.
        var closure =
                function() {
                    desk.selectedTools[toolIndex].isDone = "success";
                    if( (desk.DEBUG != undefined) &&
                        (typeof(desk.DEBUG) == "boolean") &&
                        desk.DEBUG ) {
                        console.log( "Successfully loaded Desktop tool '" + toolName +
                                     "' from '" + toolFile + "'." );
                    }
                    // Set the parent object to be the Desktop object.
                    desk.toolFunctions[desk.selectedTools[toolIndex].name].setParent(desk);
                    // Register the desired event handlers for this tool.
                    var eventNames = desk.availableEventNames();
                    for(var n = 0; n < eventNames.length; n++) {
                        if(eventNames[n] == 'toggle') {  // The toggle event has a different parameter list.
                            continue;
                        }
                        if( (desk.selectedTools[toolIndex][eventNames[n]] != undefined) &&
                            (typeof(desk.selectedTools[toolIndex][eventNames[n]]) == "boolean") &&
                            desk.selectedTools[toolIndex][eventNames[n]] ) {
                            desk.selectedTools[toolIndex][eventNames[n]] =
                                    desk.toolFunctions[desk.selectedTools[toolIndex].name][eventNames[n]];
                        }
                        if( (desk.selectedTools[toolIndex][eventNames[n]] != undefined) &&
                            (typeof(desk.selectedTools[toolIndex][eventNames[n]]) == "function") ) {
                            eval( 'jQueryObj("#' +
                                  desk.selectedTools[toolIndex].css +
                                  '", htmlDoc).' + eventNames[n] +
                                  '(desk.selectedTools[toolIndex].' +
                                  eventNames[n] +
                                  ');' );
                            var elemNodes = eval( 'jQueryObj("#' +
                                                  desk.selectedTools[toolIndex].css +
                                                  '", htmlDoc);' );
                            // Give ourselves a way to access our Desktop Tool object
                            // from inside the event handler (and from whence we can
                            // access the Desktop object (and the WYMeditor object)).
                            elemNodes[0].selfObject =
                                    desk.toolFunctions[desk.selectedTools[toolIndex].name];
                        }
                    }
                    if( (desk.selectedTools[toolIndex].toggle != undefined) &&
                        (typeof(desk.selectedTools[toolIndex].toggle) == "boolean") &&
                        desk.selectedTools[toolIndex].toggle ) {
                        desk.selectedTools[toolIndex].toggle =
                                desk.toolFunctions[desk.selectedTools[toolIndex].name].toggle;
                    }
                    if( (desk.selectedTools[toolIndex].toggle != undefined) &&
                        (typeof(desk.selectedTools[toolIndex].toggle) == "object") &&
                        (desk.selectedTools[toolIndex].toggle instanceof Array) ) {
                        var validEntries = true;
                        var scriptString = 'jQueryObj("#' +
                                           desk.selectedTools[toolIndex].css +
                                           '", htmlDoc).toggle(';
                        for(var x = 0; x < desk.selectedTools[toolIndex].toggle.length; x++) {
                            if( (desk.selectedTools[toolIndex].toggle[i] == undefined) ||
                                (typeof(desk.selectedTools[toolIndex].toggle[x]) != "function") ) {
                                validEntries = false;
                                break;
                            }
                            else {
                                scriptString += 'desk.selectedTools[toolIndex].toggle[' +
                                                x + ']';
                                if(x != (desk.selectedTools[toolIndex].toggle.length - 1)) {
                                    scriptString += ',';
                                }
                            }
                        }
                        scriptString += ');';
                        if(validEntries) {
                            eval(scriptString);
                        }
                    }
                };
        return closure;
    }

    /*
     * Generate a closure to handle the failed retrieval of the JavaScript
     * associated with the given tool.
     */
    function generateErrorHandler(toolName, toolFile, toolIndex, desk) {
        // We need to generate a closure or else the toolName, toolFile, and
        // toolIndex variables will contain the values of the last tool queued.
        var closure =
                function(eventObj) {
                    desk.selectedTools[toolIndex].isDone = "error";
                    if( (desk.DEBUG != undefined) &&
                        (typeof(desk.DEBUG) == "boolean") &&
                        desk.DEBUG ) {
                        console.log( "Could not load Desktop tool '" + toolName +
                                     "' from '" + toolFile + "'." );
                        console.log(eventObj);
                    }
                    // Remove all boolean events for this tool on file load failure.
                    var eventNames = desk.availableEventNames();
                    for(var n = 0; n < eventNames.length; n++) {
                        if( (desk.selectedTools[toolIndex][eventNames[n]] != undefined) &&
                            (typeof(desk.selectedTools[toolIndex][eventNames[n]]) == "boolean") ){
                            delete desk.selectedTools[toolIndex][eventNames[n]];
                        }
                    }
                };
        return closure;
    }

    // Queue up the requested tools if they match the available tools and
    // generate the HTML for "free" (we are already paying the looping cost).
    var toolData = desktop.availableTools();
    var generatedHTML = "";
    for(var i = 0; i < requestedTools.length; i++) {
        for(var x in toolData) {
            var regex = new RegExp( "^\\s*(?:\\b)" +
                                    toolData[x].name +
                                    "(?:\\b)\\s*$", "i" );
            // User supplied strings processed here.
            if(typeof(requestedTools[i]) == "string") {
                if( requestedTools[i].match(/^[:][A-Za-z]+$/) ) {
                    var tempList = this.expandTag(requestedTools[i]);
                    if( (typeof(tempList) == "object") &&
                        (tempList instanceof Array) ) {
                        for(var n = 0; n < tempList.length; n++) {
                            if(toolData[tempList[n]] != undefined) {
                                desktop.selectedTools.push(toolData[tempList[n]]);
                                var selectedIndex = desktop.selectedTools.length - 1;
                                var toolCss = toolData[tempList[n]].css;
                                var toolName = toolData[tempList[n]].name;
                                var toolTitle = toolData[tempList[n]].title;
                                toolTitle = toolTitle.replace(/[_]+/g, " ");
                                var toolFile = toolData[tempList[n]].file;
                                generatedHTML += desktop._getListElem(toolName, toolTitle, toolCss);
                                desktop.selectedTools[selectedIndex].isDone = "waiting";
                                jQuery.getScript( toolData[tempList[n]].file,
                                                  generateSuccessHandler( toolName, toolFile,
                                                                          selectedIndex, desktop,
                                                                          jQuery, document ) )
                                      .error( generateErrorHandler( toolName, toolFile,
                                                                    selectedIndex, desktop ) );
                            }
                        }
                        break;
                    }
                }
                else {
                    if(requestedTools[i].match(regex)) {
                        desktop.selectedTools.push(toolData[x]);
                        var selectedIndex = desktop.selectedTools.length - 1;
                        var toolCss = toolData[x].css;
                        var toolName = toolData[x].name;
                        var toolTitle = toolData[x].title;
                        toolTitle = toolTitle.replace(/[_]+/g, " ");
                        var toolFile = toolData[x].file;
                        generatedHTML += desktop._getListElem(toolName, toolTitle, toolCss);
                        desktop.selectedTools[selectedIndex].isDone = "waiting";
                        jQuery.getScript( toolData[x].file,
                                          generateSuccessHandler( toolName, toolFile,
                                                                  selectedIndex, desktop,
                                                                  jQuery, document ) )
                              .error( generateErrorHandler( toolName, toolFile,
                                                            selectedIndex, desktop ) );
                        break;
                    }
                }
            }
            // User supplied objects processed here.
            else if( (typeof(requestedTools[i]) == "object") &&
                     (requestedTools[i].name != undefined) &&
                     (requestedTools[i].title != undefined) &&
                     (requestedTools[i].css != undefined) ) {
                if(requestedTools[i].name.match(regex)) {
                    desktop.selectedTools.push(requestedTools[i]);
                    var selectedIndex = desktop.selectedTools.length - 1;
                    var toolCss = requestedTools[i].css;
                    var toolName = requestedTools[i].name;
                    var toolTitle = requestedTools[i].title;
                    toolTitle = toolTitle.replace(/[_]+/g, " ");
                    generatedHTML += desktop._getListElem(toolName, toolTitle, toolCss);
                    // If the user supplied a 'file' key, attempt to load said file.
                    if(requestedTools[i].file != undefined) {
                        var toolFile = requestedTools[i].file;
                        desktop.selectedTools[selectedIndex].isDone = "waiting";
                        jQuery.getScript( requestedTools[i].file,
                                          generateSuccessHandler( toolName, toolFile,
                                                                  selectedIndex, desktop,
                                                                  jQuery, document ) )
                              .error( generateErrorHandler( toolName, toolFile,
                                                            selectedIndex, desktop ) );
                    }
                    // Otherwise, load the default 'file' key.
                    else {
                        var toolFile = toolData[x].file;
                        desktop.selectedTools[selectedIndex].isDone = "waiting";
                        jQuery.getScript( toolData[x].file,
                                          generateSuccessHandler( toolName, toolFile,
                                                                  selectedIndex, desktop,
                                                                  jQuery, document ) )
                              .error( generateErrorHandler( toolName, toolFile,
                                                            selectedIndex, desktop ) );
                    }
                    break;
                }
            }
        }
    }

    // Set the contents of the tools container to our generated list of
    // Desktop tools.
    $(desktop.parent._box).find( desktop.parent._options.toolsSelector +
                                 desktop.parent._options.toolsListSelector )
                          .html(generatedHTML);

    // And... we are done!
};

