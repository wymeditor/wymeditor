###
API
###

.. note::
    In the code examples below, ``wym`` is a variable which refers to the
    WYMeditor instance, and which must be initialized.

****
Core
****

``html(html)``
==============

Get or set the editor's HTML value.

When the `html` argument is provided,
that HTML will be parsed and loaded into the editor.
The document will be ready for editing.

When called without an argument,
it will provide an HTML representation of the document
that is in the editor.

Example:

.. code-block:: javascript

    wym.html("<p>Hello, World.</p>");

    wym.html();// "<p>Hello, World.</p>"

``rawHtml(html)``
=================

Get or set raw HTML value.
Value is not parsed.
After HTML insertion, document is not prepared for editing
(``prepareDocForEditing()`` is not called).

If you are not sure which one to use, ``html()`` will most likely be the answer.

``update()``
============

Update the value of the element replaced by WYMeditor and the value of
the HTML source textarea.

``getCurrentState()``
=====================

Returns an object with the current state of the editor.

The state includes:

``html``
    The return value of ``editor.rawHtml()``.
``savedSelection``
    A Rangy saved selection, if anything is selected.
    The ``win`` and the ``doc``  properties are deleted,
    instead of referencing the window object and the document object,
    respectively.
    In order to provide this as an argument to Rangy's ``restoreSelection``,
    these must be reassigned.

It may include more things in the future.

``WYMeditor.instances``
=======================

Array consisting of WYMeditor instances. When a WYMeditor is initialized it is
appended to this array.

``WYMeditor.version``
=====================

WYMeditor's version string.

``iframeInitialized``
=====================

A boolean. After an editor's ``iframe`` initialization, this is set to
``true``.

During the execution of :ref:`option-postinit`, for example, this can be
expected to be ``true``, if the editor initialized succesfully.

``vanish()``
============

Removes the WYMeditor instance from existence and replaces the
'data-wym-initialized' attribute of its textarea with 'data-wym-vanished'.

.. code-block:: javascript

    wym.vanish();

``jQuery.getWymeditorByTextarea()``
===================================

Get the WYMeditor instance of a textarea element. If an editor is not
initialized for the textarea, returns false.

.. code-block:: javascript

    var myWym,
        myDocument;

    myWym = jQuery.getWymeditorByTextarea(jQuery('textarea#myDocument'));

    if (myWym) {
        myDocument = myWym.html();
    }

``element``
===========

The editor's textarea element.

``EVENTS``
==========

An object, containing event names, which are triggered by the editor in various
circumstances. jQuery can be used to add handlers to these events.

Available events:

``postBlockMaybeCreated``
    Triggered after a block type element may have been
    created.
``postIframeInitialization``
    Triggered after the editor's Iframe has been
    initialized.
``postModification``
    Triggered after a change was registered with ``registerModification()``.
``postUndo``
    Triggered after undo.
``postRedo``
    Triggered after redo.

Example of adding a handler to one of the events:

.. code-block:: javascript

    jQuery(wym.element).bind(
        WYMeditor.EVENTS.postBlockMaybeCreated,
        myHandlerFunction
    );

``documentStructureManager.setDefaultRootContainer(tagName)``
=============================================================

Sets the default root container to ``tagName``.

Example:
.. code-block:: javascript

    wym.documentStructureManager.setDefaultRootContainer("div");

*****************************
Selection Setting and Getting
*****************************

.. note::
    For selection setting and selection getting, WYMeditor uses the Rangy library
    internally.

    The Rangy library doesn't seem to provide a consistent interface for
    selection getting. Instead, the selection could be in many cases described
    differently in different browsers.

    Additionally, erroneous selections are performed by some browsers under
    certain conditions.

    In light of this, an effort has been made to provide reliable methods in
    WYMeditor for selection setting an getting.

    Core contributors, as well as plugin authors, are encouraged to use these
    methods and to avoid using the Rangy API directly.

    If you find these methods lack a feature that you require, then please file an
    issue_ describing your requirement so that we could look into answering it in
    a consistent and reliable way.

    Pull requests regarding this or any other issue are warmly welcomed. For
    detailed pull request recommendations, please see our documentation on
    :doc:`../wymeditor_development/contributing`.

``hasSelection()``
==================

Returns ``true`` if there is any selection in the document.
Returns ``false`` otherwise.

``deselect()``
==============

Removes selection.

``nodeAfterSel()``
==================

Get the node that is immediately after the selection, whether it is collapsed
or not.

``doesElementContainSelection(element)``
========================================

Returns ``true`` if the provided element contains at least part of the
selection.
Otherwise returns ``false``.

``selectedContainer()``
=======================

Get the selected container.

* If no selection, returns ``false``.
* If selection starts and ends in the same element, returns that element.
* If an element that contains one end of the selection is ancestor to the
  element that contains the other end, return that ancestor element.
* Otherwise, returns ``false``.

For example (``|`` marks selection ends):
.. code-block:: html

    <p>|Foo <i>bar|</i></p>

The ``p`` is returned.

.. code-block:: html

    <p>Foo <i>|bar|</i></p>

The ``i`` is returned.

``getRootContainer()``
======================

Returns the root container, in which the selection is entirely in.

Example: get the selected root container.

.. code-block:: javascript

    wym.status(wym.mainContainer().tagName);

``getSelectedImage()``
======================

If selection encompasses exactly a single image, returns that image.
Otherwise returns ``false``.

``canSetCaretBefore(node)``
===========================

Check whether it is possible to set a collapsed selection immediately before
provided node.

For an example see the test named 'selection: Set and get collapsed selection'.

Returns true if yes and false if no.

``setCaretBefore(node)``
========================

This sets a collapsed selection before the specified node.

.. note::
    Due to browser and/or Rangy bugs it has been decided that ``node`` could be
    either a text node or a ``br`` element and if it is a ``br`` element it must
    either have no ``previousSibling`` or its ``previousSibling`` must be a text
    node, a ``br`` element or any block element.

It checks whether this is possible, before doing so, using
``canSetCaretBefore``.

``canSetCaretIn(node)``
=======================

Check whether it is possible to set a collapsed selection at the start inside
a provided node. This is useful for the same reason as ``canSetCaretBefore``.

``setCaretIn(element)``
=======================

Sets a collapsed selection at the start inside a provided element.

.. note::
    Due to what seems like browser bugs, setting the caret inside an inline element
    results in a selection across the contents of that element.

    For this reason it might not be useful for implementation of features.

    It can, however, be useful in tests.

It checks whether this is possible, before doing so, using
``canSetCaretIn``.

``restoreSelectionAfterManipulation(manipulationFunc)``
=======================================================

A helper function to ensure that the selection is restored to the same
location after a potentially complicated DOM manipulation is performed. This
also handles the case where the DOM manipulation throws an error by cleaning
up any selection markers that were added to the DOM.

``manipulationFunc`` is a function that takes no arguments and performs the
manipulation. It should return true if changes were made that could have
potentially destroyed the selection.

``selection()``
===============

Returns the Rangy selection.

********************
Content Manipulation
********************

``body()``
==========

Returns the document's ``body`` element.

Example; get the root-level nodes in the document:

.. code-block:: javascript

    var rootNodes = wym.body().childNodes;

``$body()``
===========

Returns a jQuery object of the document's body element.

Example; find first paragraph in the document:

.. code-block:: javascript

    var $firstP = wym.$body().children('p').first();

``exec(cmd)``
=============

Execute a command. Supported ``cmd`` values:

Italic
    set/unset ``em`` on the selection.
Superscript
    set/unset ``sup`` on the selection.
Subscript
    set/unset ``sub`` on the selection.
InsertOrderedList
    create/remove an ordered list, based on the selection.
InsertUnorderedList
    create/remove an unordered list, based on the selection.
Indent
    `indent` the list element.
Outdent
    `outdent` the list element.
Undo
    undo an action.
Redo
    redo an action.
Unlink
    remove a link, based on the selection.
ToggleHtml
    show/hide the HTML value.

``link(attrs)``
===============

Turns the selected text into an ``a`` element with the provided attributes.

If an ``a`` element is already selected, modifies its attributes.

Attributes are provided as key-value pairs, in ``attrs``.

Example:

.. code-block:: javascript

    // Perform some selection and then:
    wym.link({
        href: "http://example.com",
        title: "Example"
    });

``insertImage(attrs)``
===============

Inserts an ``img`` element with the provided attributes.

Attributes are provided as key-value pairs, in ``attrs``.

Example:

.. code-block:: javascript

    // Perform some selection and then:
    wym.insertImage({
        src: "example.jpg",
        alt: "Example"
    });

``paste(data)``
===============

*Parameters*

* data: string

*Description*

Paste raw text, inserting new paragraphs.

``insert(data)``
================

*Parameters*

* data: XHTML string

*Description*

    Insert XHTML string at the cursor position. If there's a selection, it is
    replaced by ``data``.

Example:

.. code-block:: javascript

    wym.insert('<strong>Hello, World.</strong>');

``setRootContainer(sType)``
===========================

Set the root container in which the selection is entirely in.

A root container is a root element in the document. For example, a paragraph
or a 'div'. It is only allowed inside the root of the document and inside a
blockquote element.

Example: switch the root container to Heading 1.

.. code-block:: javascript

    wym.mainContainer('H1');

``registerModification()``
====================

Registers a change in the document. This should be called after changes
are made in the document.

Triggers the ``postModification`` event afterwards.

``switchTo(node, sType, stripAttrs)``
=====================================

Switch the type of the given ``node`` to type ``sType``.

If ``stripAttrs`` is true, the attributes of node will not be included in the new
type. If ``stripAttrs`` is false (or undefined), the attributes of node will be
preserved through the switch.

``toggleClass(sClass, jqexpr)``
===============================

Set or remove the class ``sClass`` on the selected container/parent
matching the jQuery expression ``jqexpr``.

Example: set the class ``my-class`` on the selected paragraph with the
class ``my-other-class``.

.. code-block:: javascript

    wym.toggleClass('.my-class', 'P.my-other-class')

``isBlockNode(node)``
=====================

Returns true if the provided node is a block type element.

``isForbiddenRootContainer(tagName)``
=====================================

Returns true if provided ``tagName`` is disallowed as a root container.
Returns false if it is allowed.

``isInlineNode(node)``
======================

Returns true if the provided ``node`` is an inline type node. Otherwise
returns false.

``keyCanCreateBlockElement(keyCode)``
=====================================

Determines whether the key represented by the passed ``keyCode`` can create a
block element within the editor when pressed. Returns true if the key can
create a block element when pressed, and returns false if otherwise.

``prepareDocForEditing()``
==========================

Makes some editor-only modifications to the body of the document, which are necessary
for the user interface. For example, inserts ``br`` elements in certain places.
These modifications will not show up in the HTML output.

``findUp(node, filter)``
========================

Return the closest parent or self container, based on its type.

``filter`` is a string or an array of strings on which to filter the container.

``unwrapIfMeaninglessSpan(node)``
====================================

If the given node is a span with no useful attributes, unwrap it.

For certain editing actions (mostly list indent/outdent), it's necessary to
wrap content in a span element to retain grouping because it's not obvious that
the content will stay together without grouping. This method detects that
specific situation and then unwraps the content if the span is in fact not
necessary.

*********
Undo/Redo
*********

``undoRedo.undo()``
===================

Undoes the last change.

Triggers the ``postUndo`` event afterwards.

example: ``wym.undoRedo.undo();``

``undoRedo.redo()``
===================

Redoes the last undone change.

Triggers the ``postRedo`` event afterwards.

example: ``wym.undoRedo.redo();``

``undoRedo.reset()``
====================

Forgets all changes.

example: ``wym.undoRedo.reset();``

*****************
List manipulation
*****************

``isListNode(node)``
====================

Returns true if the provided node is a list element. Otherwise
returns false.

``indent()``
============

Indent the selected list items. Only list items that have a common list will be
indented.

``outdent()``
=============

Outdent the selected list items.

``insertList(listType)``
========================

This either manipulates existing lists or creates a new one.

The action that will be performed depends on the contents of the
selection and their context.

This can result in one of:

1. Changing the type of lists.
2. Removing items from list.
3. Creating a list.
4. Nothing.

If existing list items are selected this means either changing list type
or de-listing. Changing list type occurs when selected list items all share
a list of a different type than the requested. Removing items from lists
occurs when selected list items are all of the same type as the requested.

If no list items are selected, then, if possible, a list will be created.
If not possible, no change is made.

Returns true if a change was made, false otherwise.

``changeListType(list, listType)``
==================================

Changes the type of a provided ``list`` element to the desired ``listType``.

``convertToList(blockElement, listType)``
=========================================

Converts the provided ``blockElement`` into a list of ``listType``. Returns the
list.

**************
User Interface
**************

``status(sMessage)``
====================

Update the HTML value of WYMeditor' status bar.

Example:

.. code-block:: javascript

    wym.status("This is the status bar.");

``toggleHtml()``
================

Show/hide the HTML source.

``keyboard.combokeys``
======================

For keyboard shortcuts, the `Combokeys`_ library is used.

For each instance of the editor, a Combokeys instance is instantiated, attached
to the document and assigned as ``wym.keyboard.combokeys``.

This Combokeys instance can be used to attach keyboard shortcuts.

Please refer to `Combokeys`_' documentation.

.. _Combokeys: http://github.com/mightyiam/combokeys

``focusOnDocument()``
=====================

Set the browser's focus on the document.

This may be useful for returning focus to the document, for a smooth user
experience, after some UI interaction.

For example, you may want to bind it as a handler for a dialog's window
``beforeunload`` event. For example:

.. code-block:: javascript

    jQuery(window).bind('beforeunload', function () {
        wym.focusOnDocument();
    });

``get$Buttons()``
=================

Returns a jQuery object, containing all the UI buttons.

Example:

.. code-block:: javascript

    var $buttons = wym.get$Buttons();

*******
Dialogs
*******

``dialog(dialogObject)``
=================

Opens a dialog.

``dialogObject`` is a plain object.

The included dialogs are in the ``WYMeditor.DIALOGS`` object, under the
property names:

``CreateLink``
    Link insertion and editing
``InsertImage``
    Image insertion and editing
``InsertTable``
    Table insertion
``Paste``
    Paste HTML. HTML will be cleaned up before insertion.
``Preview``
    Provides a preview of the document

Example:

.. code-block:: javascript

    wym.dialog(WYMeditor.DIALOGS.Link);

You can provide your own dialog object. It looks like this:

String ``title```
    Dialog window title.
Function ``shouldOpen``
    Its return value determines whether the dialog should be opened or not.
    Is called with the editor as ``this``.
Function ``getBodyHtml``
    Used to provide the dialog's body's HTML. Is called with the editor as
    ``this``.
Function ``getBodyClass``
    Optional. Returns a class that will be added to the body of the dialog
    window's document.
Function ``getWindowFeatures``
    Optional. Used to provide the dialog's window features, for passing to
    ``window.open``. Is called with the editor as ``this``.
function ``initialize``
    Optional. Can be used to initialize the dialog (e.g. prepopulate input
    fields). Is called with the editor as ``this`` and receives a single
    argument-the dialog window.
function ``SubmitHandler``
    Optional. Handles a submit button press in the dialog. Is called with
    the editor instance as ``this``. Receives a single argument-the dialog
    window.

*******
Helpers
*******

``WYMeditor.console``
=====================

A wrapper for the various browser consoles. Use it instead of
``window.console``, ``console``, etc.. Handles the situation where in some IEs
the console doesn't always exist.

``wym.uniqueStamp()``
=====================

Returns a globally unique string.

``jQuery.fn.nextContentsUntil()`` and ``jQuery.fn.prevContentsUntil()``
=======================================================================

Acts like ``.nextUntil()`` but includes text nodes and comments and only
works on the first element in the given jQuery collection.

``jQuery.fn.nextAllContents()`` and ``jQuery.fn.prevAllContents()``
===================================================================

Acts like ``.nextAll()`` but includes text nodes and comments and only
works on the first element in the given jQuery collection.

``jQuery.fn.parentsOrSelf()``
=============================

Returns the parents or the node itself, according to jQuery selector.

example:

.. code-block:: javascript

    var parentLis = $someNode.parentsOrSelf("li")

``jQuery.fn.isPhantomNode()`` and ``WYMeditor.isPhantomNode()``
=============================================================

Returns true if the node is a text node with whitespaces only.
The jQuery extension checks the first node.

``WYMeditor.isPhantomString()``
===============================

Returns true if the provided string consists only of whitespaces.

``WYMeditor.arrayContains(array, thing)``
=========================================

Returns true if ``array`` contains ``thing``. Uses ``===`` for comparison of
provided ``thing`` with contents of provided ``array``.

``WYMeditor.replaceAllInStr(str, old, new)``
============================================

Returns a string based on ``str``, where all instances of ``old`` were replaced
by ``new``.

``WYMeditor.editor.get$CommonParent(one, two)``
===============================================

Returns a jQuery of the common parent of two document elements.

*********
Constants
*********

Elements
========

``BLOCKING_ELEMENT_SPACER_CLASS``
    Class for marking ``br`` elements used to space apart blocking elements in
    the editor.
``BLOCKING_ELEMENTS``
    The subset of the ``ROOT_CONTAINERS`` that prevent the user from using
    up/down/enter/backspace from moving above or below them. They
    effectively block the creation of new blocks.
``BLOCKS``
    All blocks (as opposed to inline) tags.
``EDITOR_ONLY_CLASS``
    Class used to flag an element for removal by the xhtml parser so that
    the element is removed from the output and only shows up internally
    within the editor.
``FORBIDDEN_ROOT_CONTAINERS``
    Containers that we explicitly do not allow at the root of the document.
    These containers must be wrapped in a valid root container.
``HEADING_ELEMENTS``
    ``h1`` through ``h6``.
``INLINE_ELEMENTS``
    Inline elements.
``LIST_TYPE_ELEMENTS``
    ``ol`` and ``ul``.
``ROOT_CONTAINERS``
    Containers that we allow at the root of the document (as direct children
    of the body tag).

Key codes
=========

The following are all under ``WYMeditor.KEY_CODE``. For example,
``WYMeditor.KEY_CODE.ENTER`` is ``13``.

* ``B``
* ``BACKSPACE``
* ``COMMAND``
* ``CTRL``
* ``CURSOR``
* ``DELETE``
* ``DOWN``
* ``END``
* ``ENTER``
* ``HOME``
* ``I``
* ``LEFT``
* ``R``
* ``RIGHT``
* ``TAB``
* ``UP``

Node types
==========

As in https://developer.mozilla.org/en-US/docs/Web/API/Node.nodeType.

* ``WYMeditor.NODE_TYPE.ATTRIBUTE``
* ``WYMeditor.NODE_TYPE.ELEMENT``
* ``WYMeditor.NODE_TYPE.TEXT``


********************
Internationalization
********************

``replaceStrings(sVal)``
========================

Localize the strings included in ``sVal``.

``encloseString(sVal)``
=======================

Enclose a string in string delimiters.

*********
Utilities
*********

``box``
=======

The WYMeditor container.

``jQuery.wymeditors(i)``
========================

Returns the WYMeditor instance with index i (zero-based).

Example:

.. code-block:: javascript

    jQuery.wymeditors(0).toggleHtml();

``jQuery.copyPropsFromObjectToObject(origin, target, props)``
=============================================================

General helper function that copies specified list of properties from a
specified origin object to a specified target object.

Example:

.. code-block:: javascript

    var foo = {A: 'a', B: 'b', C: 'c'},
        bar = {Y: 'y'};
    jQuery.copyPropsFromObjectToObject(foo, bar, ['A', 'B']);

``bar`` will then be ``{A: 'a', B: 'b', Y: 'y'}``.

``isInlineNode(node)``
======================

Returns true if the provided node is an inline type node. False, otherwise.

.. _issue: https://github.com/wymeditor/wymeditor/issues

``WYMeditor.isInternetExplorer*()``
===================================

``WYMeditor.isInternetExplorerPre11()`` and
``WYMeditor.isInternetExplorer11OrNewer()``.

Internet Explorer's engine, Trident, had changed considerably in version 7,
which is the version that IE11 has, and now behaves very similarly to Mozilla.

These two functions help detect whether the running browser is IE before 11 or
IE11-or-newer, by returning a boolean.
