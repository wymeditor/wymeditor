#####################
Customizing WYMeditor
#####################

.. note::

    If you're more of a
    "Learning by Doing" person,
    there are tons of
    `hosted examples <http://wymeditor.github.io/wymeditor/dist/examples/>`_
    to try out if you're looking for ideas.
    You can use ``View Source`` from there
    or look in the ``examples/`` directory
    of your WYMeditor repository or distribution.

***********************
Basics of Customization
***********************

There are four primary methods of customizing WYMeditor.
All of them come down to
passing in options on editor initialization
and possibly including extra javascript and CSS
on your page.
The methods are:

1. Using WYMeditor Initialization Options
=========================================

:ref:`customization-using-options`
is the easiest method of customization
and the most common.
By changing the proper :ref:`wymeditor-options`,
you can change the user interface's skin,
choose from a wide range of plugins,
add or remove items from the toolbar,
include custom CSS classes for your users to choose
and lots more.

2. Using a WYMeditor "Skin"
===========================

We use :doc:`/using_wymeditor/using_skins`
to package up user interface tweaks and customizations.
There are many included options from which to choose
along with the ability to write your own.

3. Using WYMeditor Plugins
==========================

By :doc:`/using_wymeditor/using_plugins`
you can enable a broad range of extra behaviors.
If none of the :doc:`/wymeditor_plugins/included_plugins/index`
meet your needs,
there's a range of :doc:`/wymeditor_plugins/third_party_plugins/index`
available.

.. note::

    Still can't find what you need?
    No problem.
    We have documentation for :doc:`writing_plugins/index`
    too.

4. Using a Custom Iframe
========================

If you'd like to make tweaks
to the way that your content looks inside the editor
(the part with the blue background),
then you can also choose a custom iframe.
Check out the ``wymeditor/iframes`` directory
for some existing options,
or roll your own.

.. _customization-using-options:

***********************
Using WYMeditor Options
***********************

All :ref:`wymeditor-options` are set
by passing an options object
as the only parameter
to the WYMeditor initialization function.

.. code-block:: javascript

    $(".my-wymeditor-class").wymeditor(options)

Example: Start with Existing HTML and Alert on Load
===================================================

Let's say you want to edit some existing HTML
and then annoy your users with an alert box.
You've got a mean streak,
but we can absolutely do that.

The :ref:`option-postInit` option
lets us define a callback after initialization
and the editor is automatically initialized
with the contents of its ``textarea`` element.
Our options object should look like this:

.. code-block:: javascript

    var options = {
        postInit: function() {
            alert('OK');
        }
    };

Full HTML
---------

Our stripped-down full example
then looks like this:

.. code-block:: html

    <html>
    <head>
        <link rel="stylesheet" type="text/css" href="wymeditor/wymeditor.css" />
    </head>

    <body>
        <form method="post" action="">
            <textarea class="my-wymeditor-class">
                &lt;p&gt;Hello, World!&lt;/p&gt;
            </textarea>
            <input type="submit" class="wymupdate" />
        </form>

        <script type="text/javascript" src="jquery/jquery.js"></script>
        <script type="text/javascript" src="wymeditor/jquery.wymeditor.js"></script>
        <script type="text/javascript">
            $(function() {
                var options = {
                    postInit: function() {
                        alert('OK');
                    }
                };
                jQuery(".wymeditor").wymeditor(options);
        </script>
    </body>
    </html>


.. _wymeditor-options:

*****************
WYMeditor Options
*****************

.. note::

    All options and their defaults are located
    in ``wymeditor/core.js``
    in the ``jQuery.fn.wymeditor`` method.
    Though if they're not documented here,
    they're subject to change between releases
    without following our deprecation policy.

.. _options-common-options:

Common Options
==============

.. _option-html:

``html``
--------

Initializes the editor's HTML content.

Example
~~~~~~~

.. code-block:: javascript

  html: "<p>Hello, World!<\/p>"

As an alternative,
you can just fill the textarea WYMeditor is replacing
with the initial HTML.

.. _option-lang:

``lang``
--------

The language to use with WYMeditor.
Default is English (en).
Codes are in ISO-639-1 format.

Language packs are stored in the ``wymeditor/lang`` directory.

Example: Choosing the Polish Translation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To use the Polish translation instead,
use the value ``pl``.

.. code-block:: javascript

    $('.wymeditor').wymeditor({
        lang: 'pl'
    });

.. _option-toolsItems:

``toolsItems``
--------------

An array of tools buttons,
inserted in the tools panel,
in the form of:

.. code-block:: javascript

    [
        {
            'name': 'value',
            'title': 'value',
            'css': 'value'
        }
    ]

Example
~~~~~~~

.. code-block:: javascript

  toolsItems: [
    {'name': 'Bold', 'title': 'Strong', 'css': 'wym_tools_strong'},
    {'name': 'Italic', 'title': 'Emphasis', 'css': 'wym_tools_emphasis'}
  ]

Default value
~~~~~~~~~~~~~

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

``containersItems``
-------------------

An array of containers buttons,
inserted in the containers panel
in the form of:

.. code-block:: javascript

    [
        {
            'name': 'value',
            'title': 'value',
            'css': 'value'
        }
    ]

Example
~~~~~~~

.. code-block:: javascript

  containersItems: [
    {'name': 'P', 'title': 'Paragraph', 'css': 'wym_containers_p'},
    {'name': 'H1', 'title': 'Heading_1', 'css': 'wym_containers_h1'}
  ]

``classesItems``
----------------

An array of classes buttons,
inserted in the classes panel in the form of:

.. code-block:: javascript

    [
        {
            'name': 'value',
            'title': 'value',
            'expr': 'value'
        }
    ]

``expr`` is a jQuery selector that allows you
to control to which elements
the class defined by ``name`` can be applied.
Only elements matching the selector ``expr``
will be given the class
on a user's click.

Example
~~~~~~~

Let's support adding the class ``date`` to paragraphs,
and the class ``hidden-note`` to paragraphs
that don't already have the class ``important``.

.. code-block:: javascript

  classesItems: [
    {'name': 'date', 'title': 'PARA: Date', 'expr': 'p'},
    {'name': 'hidden-note', 'title': 'PARA: Hidden note', 'expr': 'p[@class!="important"]'}
  ]

``preInit``
-----------

A custom function which will be executed
directly before WYMeditor's initialization.

Parameters
~~~~~~~~~~

    * wym: the WYMeditor instance

``preBind``
-----------

A custom function which will be executed
directly before handlers are bound
on events
(e.g. buttons click).

Parameters
~~~~~~~~~~

    * wym: the WYMeditor instance

.. _option-postInit:

``postInit``
------------

A custom function which will be executed once, when WYMeditor is ready.

Parameters
~~~~~~~~~~

    * wym: the WYMeditor instance

Example
~~~~~~~

.. code-block:: javascript

    postInit: function(wym) {
      //activate the 'tidy' plugin, which cleans up the HTML
      //'wym' is the WYMeditor instance
      var wymtidy = wym.tidy();
      wymtidy.init();
    }

.. _options-uncommon-options:

Uncommon Options
================

Most of these options are only required in abnormal deployments,
or useful for deep customization.

.. note::

    Any options not documented are considered private
    and are subject to change between releases
    without following the deprecation policy.

.. _option-basePath:

``basePath``
------------

WYMeditor's relative/absolute base path
(including the trailing slash).

This value is automatically guessed by ``computeWymPath``,
which looks for the ``script`` element
loading ``jquery.wymeditor.js``.

Example
~~~~~~~

.. code-block:: javascript

  basePath: "/admin/edit/wymeditor/"

``wymPath``
-----------

WYMeditor's main JS file path.

Similarly to :ref:`option-basePath`,
this value is automatically guessed by ``computeBasePath``.

``iframeBasePath``
------------------

The path to the directory containing the iframe
that will be initialized inside the editor body itself.

This value is automatically guessed,
based on the ``basePath`` value.

``updateSelector`` and ``updateEvent``
--------------------------------------

.. note::

    Will be removed in 1.0.
    Instead,
    users should do their own event handling/registration
    and make a call to ``wym.update()``.

Allows you to update the value
of the element replaced by WYMeditor
(typically a ``textarea``)
with the editor's content
on .while e.g. clicking on a
button in your page.

``preInitDialog``
-----------------

A custom function which will be executed
directly before a dialog's initialization.

Parameters
~~~~~~~~~~

1. wym: the WYMeditor instance
2. wdw: the dialog's window object

``postInitDialog``
------------------

A custom function which will be executed
directly after a dialog is ready.

Parameters
~~~~~~~~~~

1. wym: the WYMeditor instance
2. wdw: the dialog's window object

.. _options-ui-customization-options:

UI Customization Options
========================

These options allow deep customization
of the structure of WYMeditor's user interface
by changing the HTML templates
used to generate various UI components.
Rather than using these,
most user's prefer :doc:`/using_wymeditor/using_skins`.

List of HTML Template Options
-----------------------------

* boxHtml
* logoHtml
* iframeHtml
* toolsHtml
* toolsItemHtml
* containersHtml
* containersItemHtml
* classesHtml
* classesItemHtml
* statusHtml
* htmlHtml
* dialogHtml
* dialogLinkHtml
* dialogFeatures
  The dialogs' default features. e.g.

    .. code-block:: javascript

        dialogFeatures: "menubar=no,titlebar=no,toolbar=no,resizable=no,width=560,height=300,top=0,left=0"

* dialogImageHtml
* dialogTableHtml
* dialogPasteHtml
* dialogPreviewHtml

.. _options-selectors-options:

UI Selectors Options
====================

These selectors are used internally by WYMeditor
to bind events and control the user interface.
You'll probably only want to modify them
if you've already changed
one of the :ref:`options-ui-customization-options`.

List of Selectors
-----------------

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

Example Selector Customization
------------------------------

.. code-block:: javascript

  classesSelector: ".wym_classes"

.. toctree::
    :maxdepth: 2

    examples/index
