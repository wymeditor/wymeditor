.. _Upgrading to v1:

###############
Upgrading to v1
###############

.. include:: /attention_version_agnostic.txt

This page describes the backwards incompatible changes in v1.

******************************************
High Impact Backwards Incompatible Changes
******************************************

Semantic Versioning
===================

From this release onwards,
versioning is according to
`Semantic Versioning <http://semver.org/>`__ 2.

Internet Explorer 7 Not Supported
=================================

    "It’s faster, easier, and more secure than Internet Explorer 6"

This 8 year old browser was a *pain to maintain*
(pun intended) for.
It is no longer supported.
`#679 <https://github.com/wymeditor/wymeditor/pull/679>`__.

Internet Explorer 8 Requires Shims
==================================

Some shimmable ES5 features are now used in the code.
So for IE8, some shims are required.
We use, test with, and recommend
`es5-shim <https://github.com/es-shims/es5-shim>`__
(both shims and shams)
(`#680 <https://github.com/wymeditor/wymeditor/pull/680>`__).

No jQuery-migrate
=================

jQuery-migrate is no longer required
(and no longer included, of course).

New Document Getters and Setters
================================

-  `#546 <https://github.com/wymeditor/wymeditor/pull/546>`__
   Buttons that cause dialog windows to open
   should now be marked with the class
   ``wym_opens_dialog``.
   Without this ``className``
   they will pop up in the background instead of in the foreground.
   Notice that the class must be on the list item.
-  `#576 <https://github.com/wymeditor/wymeditor/pull/576>`__
-  ``editor._html``,
   the document content setter,
   was completely removed.
-  ``editor.xhtml``,
   the document content getter,
   was also completely removed.
-  ``editor.html``,
   which was deprecated,
   is now the official document
   content getter, as well as setter.
-  `#576 <https://github.com/wymeditor/wymeditor/pull/576>`__
   ``editor.rawHtml``
   is a new document content setter and getter.
   With ``editor.rawHtml``, contrary to ``editor.html``,
   the contents are not passed through the parser
   for cleanups and corrections.
   Instead, they are set or got, exactly as they are.

Test Your Dialogs
=================

The ``wym.dialog`` method has a new signature.
It is supposed to be backwards compatible
but it is strongly recommended
that existing implementations
will be modified to use the new signature
or, at least, tested.

Also, dialogs cannot be opened using the ``exec`` method.
Use the ``wym.dialog`` method, instead.

Plugins Should Register Modifications
=====================================

There is a new undo/redo mechanism in place.
In order for document modifications
to be considered "a modification"
and thus allowing them
to be specifically undone/redone by the user,
``editor.registerModification()``
must be called after each modification
(`#512 <https://github.com/wymeditor/wymeditor/pull/512>`__).

Object Re-sizing is Gone
========================

Re-sizing of document elements
such as images and tables
is no longer available
(`#647 <https://github.com/wymeditor/wymeditor/pull/647>`__,
`#648 <https://github.com/wymeditor/wymeditor/pull/647>`__,
`#641 <https://github.com/wymeditor/wymeditor/pull/641>`__)

Using the Legacy Skin and Editor Styles
=======================================

WYMeditor version 1.0
made some significant changes
to the default skin and editor styles.
For folks who need the old UI,
we've included a skin and iframe to meet their needs.

These are both labeled as ``legacy``.
To use them,
first load the legacy skins CSS and JavaScript,
then choose the following options on editor initialization:

.. code:: js

    $(function() {
        $('.wymeditor').wymeditor({
            iframeBasePath: "../wymeditor/iframe/legacy/",
            skin: "legacy"
        });
    });

See
`Example 21-legacy <http://wymeditor.github.io/wymeditor/dist/examples/21-legacy.html>`__
for a demonstration of the pre-1.0 user interface.

Deprecation
-----------

It's easy to provide your own skin and iframe, though,
so these will be removed
according to WYMeditor's deprecation policy.

No More Skin Auto-loading
=========================

Versions of WYMeditor prior to 1.0
would use JavaScript to automatically load your chosen skin's JavaScript and CSS.
While this was a small first-usage usability improvement,
it created some "magic"
that quickly became confusing
when it came time for an optimized, production-ready deployment.
In production,
you should be looking to reduce the number of HTTP requests
as much as possible,
which means
including the skin's assets
along with your other combined/minified/compressed assets.

The default WYMeditor distribution
now includes all skin JavaScript and CSS
as part of the bundle.
They're only activated
based on your choice of ``skin`` option, though.
For enhanced optimization,
you can create your own WYMeditor bundle
only containing the skin that you will load,
but that will be
a very low-impact optimization for most users,
as the amount of CSS/Javascript in a skin
is very small relative to the impact of WYMeditor itself.

For more details, see
`the documentation <http://wymeditor.readthedocs.org/en/latest/using_wymeditor/using_skins.html#loading-a-skin>`__.

Options Removed
---------------

-  ``skinPath``

No More CSS Configuration Options
=================================

Versions prior to 1.0
had various options
that supported the ability
to set CSS rules on various editor and dialog components.
In the spirit of
"no more skin auto-loading" (see above),
and moving WYMeditor closer to
just an idiomatic collection of JavaScript/CSS/HTML,
we're no longer supporting those options.
All of the things that were previously accomplished with them
can be better-accomplished by
actually including those rules in stylesheets.

If you're having difficulty determining the best strategy for migration
please open an issue
and we'll be happy to
document your use case
and help you with a plan.

Options Removed
---------------

-  ``styles``
-  ``stylesheet``
-  ``editorStyles``
-  ``dialogStyles``

Methods Removed
---------------

-  ``addCssRules()``
-  ``addCssRule()``

No More Language Automatic Loading
==================================

Instead of doing an additional HTTP request to load a language file,
the default WYMeditor distribution
comes bundled with all of the translation files.
If you're creating your own bundle,
you'll need to include those files on the page
before the editor is initialized.

Options Removed
---------------

-  ``langPath``

*****************************************
Low Impact Backwards Incompatible Changes
*****************************************


-  ``WYMeditor.editor.switchTo``
   no longer sets the caret
   into the switched element
   by default.
   `#540 <https://github.com/wymeditor/wymeditor/pull/540>`__
-  `#588 <https://github.com/wymeditor/wymeditor/pull/588>`__
   Bower packaging was fixed and documented.
   Might be backwards-incompatible. Just in case.
-  The jQuery.browser plugin,
   a new dependency,
   is included in the distribution.
   It is required for all jQuery versions;
   even the older ones,
   which still had a ``jQuery.browser`` object included.
   It matters because
   the ``jQuery.browser`` that is in old jQuery versions
   thinks that IE11 is Mozilla (can’t blame it, really).
-  [#605] Removed deprecated ``WYMeditor.editor.container``.
-  [#605] ``WYMeditor.editor.mainContainer``
   was split into
   ``WYMeditor.editor.getRootContainer`` and
   ``WYMeditor.editor.setRootContainer``.
-  `#613 <https://github.com/wymeditor/wymeditor/pull/613>`__
   ``editor.setSingleSelectionRange``
   is no longer public API.
-  `#620 <https://github.com/wymeditor/wymeditor/pull/620>`__
   ``editor.rawHtml``
   no longer calls
   ``editor.prepareDocForEditing``.
-  `#639 <https://github.com/wymeditor/wymeditor/pull/639>`__
   The ``jQueryPath`` option was removed.
-  The ``wym._index`` editor instance property is removed.
-  Removed ``wym.wrap`` and ``wym.unwrap`` editor methods.
