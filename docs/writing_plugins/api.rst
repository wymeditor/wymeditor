API
===

.. note:: 
    In the code examples below, ``wym`` is a variable which refers to the
    WYMeditor instance, and which must be initialized.

**box**

Return the WYMeditor container.

**html(sHtml)**

Get or set the editor's HTML value.

Example:

.. code-block:: javascript

  wym.html("<p>Hello, World.</p>");

**xhtml**

Get the cleaned up editor's HTML value.

**exec(cmd)**

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

**paste(data)**

*Parameters*

* data: string

*Description*

    Paste raw text, inserting new paragraphs.

**insert(data)**

*Parameters*

* data: XHTML string

*Description*

    Insert XHTML string at the cursor position. If there's a selection, it is
    replaced by ``data``.

Example:

.. code-block:: javascript

    wym.insert('<strong>Hello, World.</strong>');

**wrap(left, right)**

*Parameters*

* left: XHTML string
* right: XHTML string

*Description*

    Wrap the inline selection with XHTML.

Example:

.. code-block:: javascript

    wym.wrap('<span class="city">', '</span>');

**unwrap()**

Unwrap the selection, by removing inline elements but keeping the selected
text.

**container(sType)**

Get or set the selected container.

Example: switch the container to Heading 1.

.. code-block:: javascript

    wym.container('H1');

Example: get the selected container.

.. code-block:: javascript

    wym.status(wym.container().tagName);

**toggleClass(sClass, jqexpr)**

Set or remove the class ``sClass`` on the selected container/parent
matching the jQuery expression ``jqexpr``.

Example: set the class ``my-class`` on the selected paragraph with the
class ``my-other-class``.

.. code-block:: javascript

    wym.toggleClass('.my-class', 'P.my-other-class')

**status(sMessage)**

Update the HTML value of WYMeditor' status bar.

Example:

.. code-block:: javascript

    wym.status("This is the status bar.");

**update**

Update the value of the element replaced by WYMeditor and the value of
the HTML source textarea.

**dialog(sType)**

Open a dialog of type ``sType``.

Supported values: Link, Image, Table, Paste_From_Word.

Example:

.. code-block:: javascript

    wym.dialog('Link');

**toggleHtml**

Show/hide the HTML source.

**replaceStrings(sVal)**

Localize the strings included in ``sVal``.

**encloseString(sVal)**

Enclose a string in string delimiters.

Custom jQuery properties
------------------------

**jQuery.wymeditors(i)**

Returns the WYMeditor instance with index i (zero-based).

Example:

.. code-block:: javascript

    jQuery.wymeditors(0).toggleHtml();
