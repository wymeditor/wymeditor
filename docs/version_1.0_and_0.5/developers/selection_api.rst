Selection API
=============

The Selection API will be used to ease the interaction with selected text and
the current cursor position. If you want to handle an event yourself (and stop
the default one), it's important to know where the cursor currently is.  But
often you only need to know the position relative to a container element and
the container itself. There some problems that arise, such as nested tags.  In
this document, ``|`` will be used to indicate the current cursor position:

.. code-block:: html

    <p>Some <em>nice|</em> text</p>

Of course you don't want ``<em>`` returned as container element, but the
``<p>``.

Here's my proposal of some basic functionality. That was all I needed for my
prototype. The following code is Javascript pseudocode:

.. code-block:: javascript

    selection = {
        // properties

        // the original DOM Selection object
        //(http://developer.mozilla.org/en/docs/DOM:Selection)
        original:

        // the node the selection starts. "start" is the most left position of the
        // selection, not where the user started to select (the user couls also
        // select from right to left)
        startNode:

        // the node the selection ends
        endNode:

        // the offset the cursor/beginning of the selection has to it's parent nodenode
        startOffset:

        // the offset the cursor/end of the selection has to it's parent nodenode
        endOffset:

        // whether the selection is collapsed ot not
        isCollapsed:


        // That one don't need to be implemented at the moment. It's diffcult as
        // one need to define what length is in this context. Is it the number of
        // selected characters? Or the number of nodes? I'd say it's the number of
        // selected characters of the normalized (no whitespaces at end or beginning,
        // multiple inner whitepsaces collapsed to a single one) selected text.
        length:

        // methods

        // Returns true if selection starts at the beginning of a (nested) tag
        // @param String jqexpr The container the check should be performed in
        // @example element = <p><b>|here</b></p>, element.isAtStart("p") would
        // return true
        isAtStart: function(jqexpr)

        // Returns true if selection ends at the end of a (nested) tag
        // @param String jqexpr The container the check should be performed in
        // @example element = <p><b>here|</b></p>, element.isAtEnd("p") would
        // return true
        isAtEnd: function(jqexpr)

        // set the cursor to the first character (it can be nested),
        // @param String jqexpr The cursor will be set to the first character
        //     of this element
        // @example elements = <p><b>test</b></p>, element.cursorToStart("p")
        //     will set the cursor in front of test: <p><b>|test</b></p>
        cursorToStart: function(jqexpr)

        // set the cursor to the last character (it can be nested),
        // @param String jqexpr The cursor will be set to the last character
        //     of this element
        // @example elements = <p><b>test</b></p>, element.cursorToEnd("p")
        //     will set the cursor behind test: <p><b>test|</b></p>
        cursorToEnd: function(jqexpr)

        // removes the current selection from document tree if the cursor isn't
        // collapsed.
        // NOTE Use the native function from DOM Selection API:
        // http://developer.mozilla.org/en/docs/DOM:Selection:deleteFromDocument
        // NOTE First I had also "deleteFromDocument()" in the Selection API, but
        // it isn't needed as a "sel.deleteIfExpanded()" would do exactly the same
        // as "sel.deleteFromDocument()" with the only difference that this one
        // has a return value
        // @returns true:  if selection was expanded and therefore deleted
        //          false: if selection was already collapsed
        // @example // do what delete key normally does
        //          if (!sel.isCollapsed)
        //          {
        //              sel.original.deleteFromDocument();
        //              return true;
        //          }
        //          will be now:
        //          if (sel.deleteIfExpanded())
        //              return true;
        deleteIfExpanded: function()
    };

**Todo**

* save selection (and current cursor position)
