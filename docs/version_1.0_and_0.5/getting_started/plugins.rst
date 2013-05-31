Plugins
=======

The WYMeditor includes a simple plugin which demonstrates how easy it is to
write plugins for WYMeditor. See :doc:`../developers/plugin_architecture` for
more details.

.. note::
    Next versions will use a more advanced events handling architecture which
    will allow a better interaction between plugins and the editor.

Using a Plugin
--------------

To use a plugin you need to include it's script file using a ``<script>`` tag
and then initialize it (passing an instance of wym) in the ``postInit``
function, passed as an option when you call ``$().wymeditor()``.

.. code-block:: javascript

    postInit: function(wym) {
        //activate the 'tidy' plugin, which cleans up the HTML
        //'wym' is the WYMeditor instance
        var wymtidy = wym.tidy();
        // You may also need to run some init functions on the plugin, however this depends on the plugin.
        wymtidy.init(wym);
    }

Writing Plugins
---------------

Writing a plugin for WYMeditor is quite easy, if you have a basic knowledge of
jQuery and Object Oriented Programming in Javascript.

Once you decide the name for your plugin you should create a folder of that
name in the plugins folder and then a file called
jquery.wymeditor.__plugin_name__.js. You need to include this file in your HTML
using a ``<script>`` tag.

For details on interacting with the editor, including the selection, see
:doc:`api`.

Example Plugin
^^^^^^^^^^^^^^

.. code-block:: javascript

    // wymeditor/plugins/hovertools/jquery.wymeditor.hovertools.js
    // Extend WYM
    Wymeditor.prototype.hovertools = function() {
        var wym = this;

        //bind events on buttons
        $j(this._box).find(this._options.toolSelector).hover(
            function() {
            wym.status($j(this).html());
            },
            function() {
            wym.status('&nbsp;');
            }
        );
    };

This example extends WYMeditor with a new method ``hovertools``, and uses
jQuery to execute a function while the mouse hovers over WYMeditor tools.

``this._box`` is the WYMeditor container, ``this._options.toolSelector`` is the
jQuery selector, ``wym.status()`` displays a message in the status bar.

Adding a Button to the Tool Bar
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: javascript

    // Find the editor box
    var wym = this,
        $box = jQuery(this._box);

    //construct the button's html
    var html = '' +
        "<li class='wym_tools_fullscreen'>" +
            "<a name='Fullscreen' href='#' " +
                "style='background-image: url(" +
                    wym._options.basePath +
                    "plugins/fullscreen/icon_fullscreen.gif)'>" +
                "Fullscreen" +
            "</a>" +
        "</li>";
    //add the button to the tools box
    $box.find(wym._options.toolsSelector + wym._options.toolsListSelector)
        .append(html);

(work in progress)

Plugins Included in the Download
--------------------------------

**embed**

Add Description

**fullscreen**

Add Description

**hovertools**

This plugin improves visual feedback by:

* displaying a tool's title in the status bar while the mouse hovers over it.
* changing background color of elements which match a condition, i.e. on which
  a class can be applied.

**list**

Add Description

**rdfa**

Add Description

**resizable**

Add Description

**table**

Add Description

**tidy**

Add Description

List of Third Party Plugins
---------------------------

**modal_dialog (by samuelcole)**

https://github.com/samuelcole/modal_dialog

Replaces the default dialog behaiour (new window) with a modal dialog. Known
bug in IE, more information `here
<https://github.com/wymeditor/wymeditor/issues/67>`_.

**alignment (by Patabugen)**

https://bitbucket.org/Patabugen/wymeditor-plugins/src

Set Text Alignment with classes.

**site_links (by Patabugen)**

https://bitbucket.org/Patabugen/wymeditor-plugins/src

A plugin to add a dropdown of links to the Links dialog, especially for making
it easier to link to your own site (or any other predefined set).

Can also add a File Upload form to let you upload files right from the Link dialog.

**image_float (by Patabugen)**

https://bitbucket.org/Patabugen/wymeditor-plugins/src

Float images with classes.

**image_upload (by Patabugen)**

https://bitbucket.org/Patabugen/wymeditor-plugins/src

Adds an Image Upload form to the Insert Image dialog.

**Catch Paste**

Force automatic "Paste From Word" usage so that all pasted content is properly
cleaned.

http://forum.wymeditor.org/forum/viewtopic.php?f=2&t=676
