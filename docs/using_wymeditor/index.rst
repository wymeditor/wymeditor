###############
Using WYMeditor
###############

.. toctree::
    :maxdepth: 2

    using_skins
    using_plugins
    common_options
    getting_help


.. _anatomy-of-editor-initialization:

***********************************
Anatomy of an Editor Initialization
***********************************

So what actually happens when you call
``$('#my-textarea').wymeditor()``?

1. Your existing ``textarea`` is hidden.
2. An iframe is created in that location.
3. The WYMeditor toolbars and interface load.
4. The iframe is initialized
   with the content from your ``textarea``.
