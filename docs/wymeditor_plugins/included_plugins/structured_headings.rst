Structured Headings
===================

This plugin modifies the styling and function of headings in the editor to make
them easier to use to structure documents. Currently in development.

Features
--------

* Simplifies the process of adding headings to a document. Instead of having to
  choose between a heading 1-6 in the containers panel, those options are
  replaced with one single "Heading" option that inserts a heading at the same
  level as the preceding heading in the document.
* Makes it easier to adjust heading levels properly. In order to change the
  level of a heading, the indent and outdent tools can be used to lower and
  raise the level of the heading respectively. The indent tool will also
  prevent a user from indenting a heading more than one level below its
  preceding heading.
* Automatically numbers headings to better outline a document.
* Provides an optional tool that can be used to automatically fix improper
  heading structure in a document (although it's still in development).
* More features to come on further development.

Applying Structured Headings Styling outside of the Editor
----------------------------------------------------------

The numbering added to headings in the editor is not parsed with the content of
the document, but rather, it is added as styling using CSS.

To apply the heading numbering to a document outside of the editor, follow
these steps:

#. Get the CSS for the structured headings. If you are using IE8+, Chrome,
   or Firefox, enter the ``WYMeditor.printStructuredHeadingsCSS()``
   command in the browser console on the page of the editor using the
   structured headings plugin to print the CSS to the console.
#. Either copy this CSS to an existing stylesheet or make a new stylesheet with
   this CSS.
#. Apply the stylesheet with the CSS to all of the pages that contain documents
   that had heading numbering added to them in the editor.
