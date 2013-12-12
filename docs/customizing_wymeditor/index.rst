#####################
Customizing WYMeditor
#####################

*********************
Customization Options
*********************

.. note::

    Getting started examples are located
    in the distributed ``examples/`` directory.

.. code-block:: javascript

    $(jqexpr).wymeditor(options)

This function will be applied to elements matching a jQuery expression
``jqexpr``.

**Example**: Replaces each ``textarea`` having the class ``wymeditor`` by a
WYMeditor instance:

.. code-block:: javascript

    $("textarea.wymeditor").wymeditor();


Options Format
==============

All WYMeditor options are passed
via the WYMeditor initialization function
as an options object.

Example
-------

Initializes WYMeditor HTML content
and displays an alert box when ready:

.. code-block:: javascript

    $(".wymeditor").wymeditor({

      //options
      html: "<p>test<\/p>",
      postInit: function() {
        alert('OK');
      }
    });


List of Options
===============

Check the file jquery.wymeditor.js, function ``$j.fn.wymeditor``, for the
complete list of options and their default values.

**html**

Initializes the editor's HTML content.

Example:

.. code-block:: javascript

  html: "<p>Hello, World!<\/p>"

.. note::
    In Javascript, it's a good habit to escape forward slashes, like this: ``<\/p>``.

**basePath**

WYMeditor's relative/absolute base path (including the trailing slash),
used while loading the iframe and the dialogs.

Example:

.. code-block:: javascript

  basePath: "/admin/edit/wymeditor/"

This value is automatically guessed by ``computeBasePath``, which looks for the
``script`` element loading jquery.wymeditor.js.

**skinPath**

WYMeditor skin (theme) path, used to load the skin.

Example:

.. code-block:: javascript

  skinPath: "wymeditor/skins/default/"

This value is automatically guessed, based on the ``basePath`` value.

**wymPath**

WYMeditor main JS file path.

This value is automatically guessed by ``computeWymPath``, which looks for the
``script`` element loading jquery.wymeditor.js.

**iframeBasePath**

WYMeditor iframe base path.

This value is automatically guessed, based on the ``basePath`` value.

**jQueryPath**

jQuery JS file path.

Example:

.. code-block:: javascript

  jQueryPath: "/js/jquery.js"

This value is automatically guessed by ``computeJqueryPath``, which looks for
the ``script`` element loading jquery.js.

**lang**

The language to use with WYMeditor. Default is English (en). Codes are
in ISO-639-1 format.

Language packs are stored in the ``wymeditor/lang`` directory.

Example: How to use a Custom Language

Just initialize the option:

.. code-block:: javascript

    $('.wymeditor').wymeditor({ lang: 'pl' });


**boxHtml**

The editor container's HTML. This option allows you to customize the HTML
containing a WYMeditor instance.

**logoHtml**

The WYMeditor logo HTML. This option allows you to customize the HTML which
displays the WYMeditor logo.

If you prefer to hide the WYMeditor logo, use an empty string:

.. code-block:: javascript

    $('.wymeditor').wymeditor({ logoHtml: '' });

In such a case, please consider making a donation to the project.

**iframeHtml**

The iframe (used for editing) container's HTML.

**styles & stylesheet**

Allows you to easily configure the editor's styles. Advantageously replaces
``editorStyles``, ``dialogStyles`` and ``classesItems``.

Define the styles using the ``styles`` option OR point to an external
stylesheet, using the ``stylesheet`` option.

Example, using ``styles``:

.. code-block:: javascript

    styles:
          '/* PARA: Date */                                                    '+
          '.date p{                                                            '+
          '  color: #ccf;                                                      '+
          '  /* background-color: #ff9; border: 2px solid #ee9; */             '+
          '}                                                                   '+
          '                                                                    '+
          '/* PARA: Hidden note */                                             '+
          '.hidden-note p /* p[@class!="important"] */ {                       '+
          '     display: none;                                                 '+
          '    /* color: #999; border: 2px solid #ccc; */                      '+
          '}                                                                   '

Example, using ``stylesheet``:

.. code-block:: javascript

    $('.wymeditor').wymeditor({ stylesheet: 'stylesheet.css' });

Use `this example stylesheet
<https://github.com/wymeditor/wymeditor/blob/master/src/examples/styles.css>`_
as a reference.

**editorStyles**

An array of classes, applied on the editor's content, in the form of:
``{'name': 'value', 'css': 'value'}``

Example:

.. code-block:: javascript

  editorStyles: [
    {'name': '.hidden-note', 'css': 'color: #999; border: 2px solid #ccc;'},
    {'name': '.border', 'css': 'border: 4px solid #ccc;'}
  ]

**toolsHtml**

The tools panel's HTML.

**toolsItemHtml**

The tools buttons' HTML template.

**toolsItems**

An array of tools buttons, inserted in the tools panel, in the form of:
``{'name': 'value', 'title': 'value', 'css': 'value'}``

Example:

.. code-block:: javascript

  toolsItems: [
    {'name': 'Bold', 'title': 'Strong', 'css': 'wym_tools_strong'},
    {'name': 'Italic', 'title': 'Emphasis', 'css': 'wym_tools_emphasis'}
  ]

Default value:

.. code-block:: javascript

  toolsItems: [
    {'name': 'Bold', 'title': 'Strong', 'css': 'wym_tools_strong'},
    {'name': 'Italic', 'title': 'Emphasis', 'css': 'wym_tools_emphasis'},
    {'name': 'Superscript', 'title': 'Superscript', 'css': 'wym_tools_superscript'},
    {'name': 'Subscript', 'title': 'Subscript', 'css': 'wym_tools_subscript'},
    {'name': 'InsertOrderedList', 'title': 'Ordered_List', 'css': 'wym_tools_ordered_list'},
    {'name': 'InsertUnorderedList', 'title': 'Unordered_List', 'css': 'wym_tools_unordered_list'},
    {'name': 'Indent', 'title': 'Indent', 'css': 'wym_tools_indent'},
    {'name': 'Outdent', 'title': 'Outdent', 'css': 'wym_tools_outdent'},
    {'name': 'Undo', 'title': 'Undo', 'css': 'wym_tools_undo'},
    {'name': 'Redo', 'title': 'Redo', 'css': 'wym_tools_redo'},
    {'name': 'CreateLink', 'title': 'Link', 'css': 'wym_tools_link'},
    {'name': 'Unlink', 'title': 'Unlink', 'css': 'wym_tools_unlink'},
    {'name': 'InsertImage', 'title': 'Image', 'css': 'wym_tools_image'},
    {'name': 'InsertTable', 'title': 'Table', 'css': 'wym_tools_table'},
    {'name': 'Paste', 'title': 'Paste_From_Word', 'css': 'wym_tools_paste'},
    {'name': 'ToggleHtml', 'title': 'HTML', 'css': 'wym_tools_html'},
    {'name': 'Preview', 'title': 'Preview', 'css': 'wym_tools_preview'}
  ]

**containersHtml**

The containers panel's HTML.

**containersItemHtml**

The containers buttons' HTML template.

**containersItems**

An array of containers buttons, inserted in the containers panel, in the form
of: ``{'name': 'value', 'title': 'value', 'css': 'value'}``

Example:

.. code-block:: javascript

  containersItems: [
    {'name': 'P', 'title': 'Paragraph', 'css': 'wym_containers_p'},
    {'name': 'H1', 'title': 'Heading_1', 'css': 'wym_containers_h1'}
  ]

**classesHtml**

The classes panel's HTML.

**classesItemHtml**

The classes buttons' HTML template.

**classesItems**

An array of classes buttons, inserted in the classes panel, in the form of:
``{'name': 'value', 'title': 'value', 'expr': 'value'}``, where ``expr`` is a
jQuery expression.

Example:

.. code-block:: javascript

  classesItems: [
    {'name': 'date', 'title': 'PARA: Date', 'expr': 'p'},
    {'name': 'hidden-note', 'title': 'PARA: Hidden note', 'expr': 'p[@class!="important"]'}
  ]

In this example, the class ``date`` can be applied on paragraphs, while the
class ``hidden-note`` can be applied on paragraphs without the class
``important``.

**statusHtml**

The status bar's HTML.

**htmlHtml**

The HTML box's HTML.

**Selectors**

WYMeditor uses jQuery to select elements of the interface. You'll need these
options if you e.g. customize the panels' HTML.

*   boxSelector
*   toolsSelector
*   toolsListSelector
*   containersSelector
*   classesSelector
*   htmlSelector
*   iframeSelector
*   statusSelector
*   toolSelector
*   containerSelector
*   classSelector
*   htmlValSelector
*   hrefSelector
*   srcSelector
*   titleSelector
*   altSelector
*   textSelector
*   rowsSelector
*   colsSelector
*   captionSelector
*   submitSelector
*   cancelSelector
*   previewSelector
*   dialogLinkSelector
*   dialogImageSelector
*   dialogTableSelector
*   dialogPasteSelector
*   dialogPreviewSelector
*   updateSelector

Example:

.. code-block:: javascript

  classesSelector: ".wym_classes"

**updateSelector & updateEvent**

Allows you to update the value of the element replaced by WYMeditor
(typically a ``textarea``) with the editor's content while e.g. clicking on a
button in your page.

updateSelector is a jQuery expression, updateEvent is a `jQuery
event <http://docs.jquery.com/Events>`_.

Example:

.. code-block:: javascript

  updateSelector: ".my-submit-button",
  updateEvent:    "click"

**dialogFeatures**

The dialogs' features.

Example:

.. code-block:: javascript

  dialogFeatures: "menubar=no,titlebar=no,toolbar=no,resizable=no,width=560,height=300,top=0,left=0"

**dialogHtml**

The dialogs' HTML template.

**dialogLinkHtml**

The link dialog's HTML template.

**dialogImageHtml**

The image dialog's HTML template.

**dialogTableHtml**

The table dialog's HTML template.

**dialogPasteHtml**

The 'Paste from Word' dialog's HTML template.

**dialogPreviewHtml**

The preview dialog's HTML template.

**dialogStyles**

An array of classes, applied to the dialogs, in the form of: ``{'name':
'value', 'css': 'value'}``

**skin**

The skin you want to use.

Example:

.. code-block:: javascript

    skin: 'custom'

**stringDelimiterLeft & stringDelimiterRight**

WYMeditor uses a simple function to replace strings delimited by these two
strings for e.g. the l10n system.

**preInit(wym)**

A custom function which will be executed once, before WYMeditor's
initialization.

Parameters:
    * wym: the WYMeditor instance

**preBind(wym)**

A custom function which will be executed once, before binding handlers on
events (e.g. buttons click).

Parameters:
    * wym: the WYMeditor instance

**postInit(wym)**

A custom function which will be executed once, when WYMeditor is ready.

Parameters:
    * wym: the WYMeditor instance

Example:

.. code-block:: javascript

    postInit: function(wym) {
      //activate the 'tidy' plugin, which cleans up the HTML
      //'wym' is the WYMeditor instance
      var wymtidy = wym.tidy();
      wymtidy.init();
    }

**preInitDialog(wym,wdw)**

A custom function which will be executed before a dialog's initialization.

Parameters:
    * wym: the WYMeditor instance
    * wdw: the dialog's window object

**postInitDialog(wym,wdw)**

A custom function which will be executed when a dialog is ready.

Parameters:
    * wym: the WYMeditor instance
    * wdw: the dialog's window object

***************************
Basic Customization Example
***************************

.. code-block:: html

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html>
    <head>
    <title>WYMeditor</title>
    <script type="text/javascript" src="jquery/jquery.js"></script>
    <script type="text/javascript" src="wymeditor/jquery.wymeditor.pack.js"></script>
    <script type="text/javascript">

    jQuery(function() {
        jQuery(".wymeditor").wymeditor({
           html: '<p>Hello, World!<\/p>',
           stylesheet: 'styles.css'
        });
    });

    </script>
    </head>

    <body>
    <form method="post" action="">
    <textarea class="wymeditor"></textarea>
    <input type="submit" class="wymupdate" />
    </form>
    </body>

    </html>

**Explanation**

* The ``html`` option will initialize the editor's content.
* The ``stylesheet`` option will automagically parse your CSS file to
  populate the Classes panel and to initialize the visual feedback.

**********************
Upgrading to Version 1
**********************

Using the Legacy Skin and Editor Styles
=======================================

WYMeditor version 1.0 made some significant changes to the default skin
and editor styles.
For folks who need the old UI,
we've included a skin and iframe to meet their needs.

These are both labeled as ``legacy``.
To use them,
choose those options on editor initialization:

.. code-block:: javascript

    $(function() {
        $('.wymeditor').wymeditor({
            iframeBasePath: "../wymeditor/iframe/legacy/",
            skin: "legacy"
        });
    });


See `Example 21-legacy <http://wymeditor.github.io/wymeditor/dist/examples/21-legacy.html>`_
for a demonstration of the Pre-1.0 user interface.

Deprecation
-----------

It's easy to provide
your own skin and iframe, though,
so these will be removed
according to WYMeditor's deprecation policy.

.. toctree::
    :maxdepth: 2

    examples/index
