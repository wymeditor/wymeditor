#################
WYMeditor Plugins
#################

.. toctree::
    :maxdepth: 2

    included_plugins/index
    third_party_plugins/index

Plugins
=======

The WYMeditor includes a simple plugin which demonstrates how easy it is to
write plugins for WYMeditor.

.. note::
    Next versions will use a more advanced events handling architecture which
    will allow a better interaction between plugins and the editor.

Using a Plugin
--------------

To use a plugin you need to include its script file using a ``<script>`` tag
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

For details on interacting with the editor,
including the selection,
see :doc:`/writing_plugins/api`.

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

Available Plugins
-----------------

See :doc:`/wymeditor_plugins/index` for a listing and descriptions
of the plugins included in the download
and available third party plugins.

