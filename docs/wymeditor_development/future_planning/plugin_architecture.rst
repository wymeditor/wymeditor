Plugin System Architecture
==========================

A proper plugin system should provide one obvious way to perform all of the
common things that plugins do. It should still be possible, however, to use
plain Javascript to do uncommon things.

Goals
-----

* Plugins should read such that someone who understands Javascript should be
  able to follow along without knowing all of the details of the plugin API.
  This means that a little more "boilerplate" is better than magic and explicit
  is better than implicit. An example of explicit:

    .. code-block:: javascript

        function TableEditor(name, wymeditor, options) {
            this.name = name;
            this.wymeditor = wymeditor;
            this.options = options;
        }

        TableEditor.prototype.init = function() {
            this.wymeditor.buttons.addButton({'name': 'AddRow', 'title': 'Add Row', 'cssClass': 'wym_tools_addrow'});
        }

        TableEditor.prototype.bindEvents = function() {
            var tableEditor = this;
            var wym = this.wymeditor;

            wym.buttons.getButton('AddRow').find().click(function(evt) {
                return tableEditor.handleAddRowClick(evt);
            });
        }

  An implicit way to do things would be to set up some magically-named class
  attribute that is automatically used by WYMeditor at some point during
  initialization to create these things.

* Very little method replacing and attribute mangling of the wymeditor object
  itself should be necessary.
* Most/all of a plugins UI actions (creating dialogs, adding buttons etc)
  should be done through API calls, allowing editor-wide standardization and
  theming.
* Plugins should have strong hooks into actions so that they're able to
  clean up the DOM to fix cross-browser problems.
* All currently-core WYMeditor actions should be migrated to being stand-alone
  plugins.
* The plugin API shouldn't be responsible for automatically locating Javascript
  files. The only way to efficiently handle that is on the server side and in
  the HTML file itself.

Enabling a Plugin
-----------------

All well-behaving plugins should be explicitly enabled through the ``plugins``
configuration option on editor initialization. Plugins that alter WYMeditor
behavior without being explicitly enabled (like the 0.5.x embed plugin) are
considered misbehaving.

The ``WYMeditor`` ``plugins`` configuration option is where plugin
configuration occurs. This object is an array of objects with the plugin's
``name``, ``func``, and ``options``. For example:

.. code-block:: javascript

    jQuery('.wymeditor').wymeditor({
        plugins: [
            {
                name: 'table',
                func: TableEditor,
                options: {enableCellTabbing: false}
            }
        ]
    });

API
---

WYMeditor.plugins.addPlugin(<pluginName>, <pluginFunction>, <configurationObject>);

WYMeditor.plugins.getPlugin(<pluginName>);

WYMeditor.buttons.addButton(<options>);

WYMeditor.buttons.getButton(<buttonName>);

WYMeditor.buttons.removeButton(<buttonName>);

WYMeditor.dialogs.createDialog(<dialogName>, <options>, <callback>);

WYMeditor.dialogs.destroyDialog(<dialogName>, <options>, <callback>);

WYMeditor.addXhtmlCleanup(<cleanupName>, <cleanupFunction>);

WYMeditor.removeXhtmlCleanup(<cleanupName>);

WYMeditor.addDomCleanup(<cleanupName>, <cleanupFunction>);

WYMeditor.removeDomCleanup(<cleanupName>);

.. note::
    The following methods already exist:

    WYMeditor.editor.findUp();
    WYMeditor.editor.container();
    WYMeditor.editor.update();
    WYMeditor.editor.html();
    WYMeditor.editor.switchTo();
    WYMeditor.editor.wrap();
    WYMeditor.editor.unwrap();
    WYMeditor.editor.setFocusToNode();
    WYMeditor.editor.exec(<commandName>);
