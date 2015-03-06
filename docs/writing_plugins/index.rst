#########################
Writing WYMeditor Plugins
#########################

.. toctree::
    :maxdepth: 2

    api
    custom_events

*************************
Plugin-Writing Mini Guide
*************************

1. Create an example in ``examples/``
=====================================

Make sure and provide a description on the example page
and ideally,
initialize the editor with content
that makes playing with your plugin easy.

.. note::

    Please avoid adding a file in ``test``
    other than for unit tests.
    The ``.html`` files in ``test`` rot quickly
    (other than unit tests)
    because users don't see them.

Serving Examples
----------------

You can load your example via:

.. code-block:: shell-session

    $ grunt server
    $ google-chrome http://localhost:9000/examples/

Serving Examples from ``dist/``
-------------------------------

To make sure your examples
also works from the built distribution,
we can tell ``grunt`` to build first:

.. code-block:: shell-session

    $ grunt server:dist
    $ google-chrome http://localhost:9000/examples/

2. Create your plugin folder
============================

* Your folder will live at ``src/wymeditor/plugins/<pluginName>``.
* Your main javascript file should be
  ``jquery.wymeditor.<pluginName>.js``.
* Any images or CSS should live in that folder.

3. Build your awesome thing
===========================

Now get cracking!

See the :ref:`development-contribution-example-process` guide
for general contribution advice.

If you get stuck,
join us in the ``#wymeditor`` IRC channel
on freenode.

4. Document your awesome plugin
===============================

Create a ``docs/wymeditor_plugins/included_plugins/<your_plugin>.rst`` file
and tell your future users:

#. What your plugin does.
#. How to enable it (a link to the example is good).
#. How to customize it,
   if you have customization options.
#. Anything else they need to know about browser compatibility, etc.

**********************
Plugin Do's and Don'ts
**********************

Don't enable your plugin on file load
=====================================

Your plugin should not activate itself
just by loading your plugin's javascript.
To use your plugin,
the user must add some kind of initialization
in the wymeditor ``postInit``.
For example:

.. code-block:: javascript

    jQuery('.wymeditor').wymeditor({
        postInit: function(wym) {
            wym.yourPlugin = new YourPlugin({optionFoo: 'bar'}, wym);
        }
    });

.. note::

    The ``embed`` plugin currently violates this,
    which is a bug.

Mark your dialog-opening buttons
================================

If your plugin includes buttons that open dialog windows, mark the list item
with the class ``wym_opens_dialog``. This will prevent your dialog window from
opening in the background.

Handle focus
============

When UI interactions steal focus from the document, consider using
``editor.focusOnDocument``.

For example, right before a dialog window closes.
