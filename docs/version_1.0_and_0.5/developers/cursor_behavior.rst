Expected Cross-browser behavior of the Cursor in Reaction to Keystrokes
=======================================================================

For usability, it's very important that the common navigation keys
(up/down/enter/backspace) should behave as a the user expects. This means that
whenever possible, any cross-browser behavioral differences should be
corrected. 

General Guidelines
------------------

* The Enter and Backspace keys should be compliments with regards to
  navigation. Doing one and then the other should return to the same state.
* The Up and Down keys should be compliments. 
* The Up and Down keys should *not* create new blocks. Only move the cursor
  between them.
* When navigating to "blue space" (areas without blocks) via the nav keys or
  the mouse, a paragraph block should be created on first content keystroke.
* Backspace at the start of a block joins the contents of the current block
  with the contents of the previous.
* Enter when in a block creates a new block after the current, with the content
  after the cursor in the new block.
* Tables, Images, Blockquotes and Pre areas are "special".

Guide
-----

The ``|`` character represents the cursor.

Paragraph at Start
^^^^^^^^^^^^^^^^^^

.. code-block:: html

    <p>|text</p>

**Up**

No Change

**Down**

No Change

**Enter**

.. code-block:: html

    <p></p>
    <p>|text</p>

**backspace**

No Change
