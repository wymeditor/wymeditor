Plan for Insertion Functions
============================

Current plan for a clean API around inserting inline and block elements and text.

Deprecate ``insert`` and alias it to ``insertInline``.

``insertInline``
----------------

Basically the same as the current ``insert`` function with a few exceptions.

* Inserts the contents where the current selector is inside the current block
  element.
* If the selector is in the body, it creates a paragraph to wrap the contents
  inside, if needed.
* If ``insertInline`` is called with HTML representing a non-nestable block
  level element, an exception is raised instead of attempting to guess the
  proper behavior.

``insertBlockAfter``
--------------------

(This is @samuelcole's insert_next, effectively)

Used to insert block-level elements after the currently-selected block-level
element.

* If given a string representing a text node, wraps the text in the appropriate
  container (``p`` or ``li`` tag, depending).
* No matter the current selection, does *not* split the current block.

``insertBlock``
---------------

Used to insert a block-level element and split the current block-level element
on the selection boundary.

* If given a string representing a text node, wraps the text in the appropriate
  container (``p`` or ``li`` tag, depending)

Examples
^^^^^^^^

Inserting ``<p>inserted</p>`` with ``|`` representing current cursor.

**Middle of Node**

.. code-block:: html

    <p>before| after</p>
    <p>before</p><p>inserted</p><p>| after</p>

**Start of Node**

.. code-block:: html

    <p>|before after</p>
    <p>|before after</p><p>inserted</p>

**End of Node**

.. code-block:: html

    <p>before after|</p>
    <p>before after|</p><p>inserted</p>
