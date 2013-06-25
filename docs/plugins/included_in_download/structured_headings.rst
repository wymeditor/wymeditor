Structured Headings
===================

This plugin modifies the styling and function of headings in the editor to make
them easier to use to structure documents. Currently in development.

Features
--------

* Automatic numbering of headings to better outline a document.
* More features to come on further development.

Applying Structured Headings Styling outside of the Editor
----------------------------------------------------------

The numbering added to headings in the editor is not parsed with the content of
the document, but rather, it is added as styling using CSS.

To apply the heading numbering to a document outside of the editor, follow
these steps:

#. Get the CSS for the structured headings. This can be done by entering the
   ``WYMeditor.printStructuredHeadingsCSS()`` command in the browser console on
   the page of the editor using the structured headings plugin. This command
   will print the CSS to the console.
#. Either copy this CSS to an existing stylesheet or make a new stylesheet with
   this CSS.
#. Apply the stylesheet with the CSS to all of the pages that contain documents
   that had heading numbering added to them in the editor.

Browser Support
---------------

Currently, the plugin only supports IE8+, Chrome, and Firefox. There is a
polyfill in development to add support for IE7.

