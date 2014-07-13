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

#. Your existing ``textarea`` is hidden.
#. An iframe is created in that location.
#. The attribute ``data-wym-initialized`` is added to the ``textarea``.
#. The WYMeditor toolbars and interface load.
#. The iframe is initialized with the content from your ``textarea``.
