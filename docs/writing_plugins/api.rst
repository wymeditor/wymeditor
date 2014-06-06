###
API
###

.. note:: 
    In the code examples below, ``wym`` is a variable which refers to the
    WYMeditor instance, and which must be initialized.

****
Core
****

``html(sHtml)``
===============

Get or set the editor's HTML value.

Example:

.. code-block:: javascript

  wym.html("<p>Hello, World.</p>");

``xhtml()``
===========

Get the cleaned up editor's HTML value.

``update()``
============

Update the value of the element replaced by WYMeditor and the value of
the HTML source textarea.

``iframeInitialized``
=====================

A boolean. After an editor's ``iframe`` initialization, this is set to
``true``.

During the execution of :ref:`option-postinit`, for example, this can be
expected to be ``true``, if the editor initialized succesfully.

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

``nodeAfterSel()``
==================

Get the node that is immediately after the selection, whether it is collapsed
or not.

``selectedContainer()``
=======================

Get the selected container.

This is currently supposed to be used with a collapsed selection only.

``mainContainer(sType)``
========================

Get or set the main container in which the selection is entirely in.

A main container is a root element in the document. For example, a paragraph
or a 'div'. It is only allowed inside the root of the document and inside a
blockquote element.

Example: switch the main container to Heading 1.

.. code-block:: javascript

    wym.mainContainer('H1');

Example: get the selected main container.

.. code-block:: javascript

    wym.status(wym.mainContainer().tagName);

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

********************
Content Manipulation
********************

``exec(cmd)``
=============

Execute a command.

*Supported command identifiers*

*   Bold: set/unset ``strong`` on the selection
*   Italic: set/unset ``em`` on the selection
*   Superscript: set/unset ``sup`` on the selection
*   Subscript: set/unset ``sub`` on the selection
*   InsertOrderedList: create/remove an ordered list, based on the
    selection
*   InsertUnorderedList: create/remove an unordered list, based on the
    selection
*   Indent: `indent` the list element
*   Outdent: `outdent` the list element
*   Undo: undo an action
*   Redo: redo an action
*   CreateLink: open the link dialog and create/update a link on the
    selection
*   Unlink: remove a link, based on the selection
*   InsertImage: open the image dialog and insert/update an image
*   InsertTable: open the table dialog and insert a table
*   Paste: opens the paste dialog and paste raw paragraphs from an
    external application, e.g. Word
*   ToggleHtml: show/hide the HTML value
*   Preview: open the preview dialog

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

``wrap(left, right)``
=====================

*Parameters*

* left: XHTML string
* right: XHTML string

*Description*

    Wrap the inline selection with XHTML.

Example:

.. code-block:: javascript

    wym.wrap('<span class="city">', '</span>');

``unwrap()``
============

Unwrap the selection, by removing inline elements but keeping the selected
text.

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

**************
User Interface
**************

``status(sMessage)``
====================

Update the HTML value of WYMeditor' status bar.

Example:

.. code-block:: javascript

    wym.status("This is the status bar.");

``dialog(sType)``
=================

Open a dialog of type ``sType``.

Supported values: Link, Image, Table, Paste_From_Word.

Example:

.. code-block:: javascript

    wym.dialog('Link');

``toggleHtml()``
================

Show/hide the HTML source.

********************
Internationalization
********************

``replaceStrings(sVal)``
========================

Localize the strings included in ``sVal``.

``encloseString(sVal)``
=======================

Enclose a string in string delimiters.

Utilities
---------

``box``
=======

The WYMeditor container.

``jQuery.wymeditors(i)``
========================

Returns the WYMeditor instance with index i (zero-based).

Example:

.. code-block:: javascript

    jQuery.wymeditors(0).toggleHtml();

``isInlineNode(node)``
======================

Returns true if the provided node is an inline type node. False, otherwise.

.. _issue: https://github.com/wymeditor/wymeditor/issues
