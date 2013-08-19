Roadmap for WYMeditor 2.0 (Draft)
=================================

Version 2.0 of WYMeditor will be a complete rewrite fixing a lot of the issues
with the current stable version.

Version 2.0 can be grouped in to four major components: the Selection API or
SAPI, the Editor core, the HTML, DOM and CSS parsers and the UI. These four
components also make up the four steps we'll need to complete before we release
version 2.0. Of course these steps overlap somewhat, and it's possible to work
on several of these things in parallel.

General Goals
-------------
* Separating the different areas of WYMeditor from each other, making it more
  modular
* Implementing a solid event system
* Documenting the WYMeditor source more thoroughly
* A more consistent source code (through the :doc:`/wymeditor_development/coding_standard`)

The Roadmap
-----------

Step 1: The HTML, DOM and CSS Parsers
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In the current stable version there's a HTML parser and a CSS parser. In 2.0,
we'll also be introducing a DOM parser, as we can not rely on the innerHtml
property due to a couple of issues and lack of flexibility.

**Goals**

* Document the HTML and CSS parsers
* Get rid of the innerHtml dependency

**New Features**

* Inline controls
* Place holders for forms/flash/dynamic content

**Issues to Fix**

* innerHtml: Problems with links and urls (#69)
* innerHtml: Insertion of script elements doesn't work

**Resources**

* http://ejohn.org/blog/pure-javascript-html-parser/
* http://www.stevetucker.co.uk/page-innerxhtml.php

Step 2: the Selection API
^^^^^^^^^^^^^^^^^^^^^^^^^

The SAPI in the current stable version is rather incomplete. To make things
easier, the excellent IERange library will be used for Internet Explorer
compatibility.

The SAPI could also be released as a standalone jQuery plug-in, as it could be
useful to a lot of other people and projects.

**Goals**

* Define a general jQuery plugin for selections and ranges, and integrate the
  plugin with WYMeditor
* Creating a consistent API that can be used for manipulating content

**New Features**

* Save and restore selections, allowing support for modal dialogues and the like
* A more solid API

**Resources**

* http://code.google.com/p/ierange/
* https://developer.mozilla.org/en/DOM/Selection
* https://developer.mozilla.org/en/DOM:range


Step 3: The Editor Core
^^^^^^^^^^^^^^^^^^^^^^^

In 2.0 we'll be moving away from designMode in favour of contentEditable. This
will not only reduce the complexity a lot, it will also open up a lot of new
interesting possibilities. Through easier interaction with external scripts
things such as drag an drop, placeholders and the like are a lot easier to
achieve.

**Goals**

* Move away from designMode in favour of contentEditable
* Solid event handling
* New features
* onChange/isDirty functionality (#138)

**Issues to Fix**

* Support for different block level elements (#152, #178)


Step 4: The UI
^^^^^^^^^^^^^^

The goal is to create a new clean looking, extendable and skinnable UI that's
completely separated the WYMeditor core. This would allow the developer to
completely replace the default UI with another one, opening up a lot of
different integration possibilities.

**Goals**

* Create a new clean looking and consistent UI
* Separate the UI from the editor core
* Make it extendable and skinnable
* Make it more user friendly through on-screen help and well thought out
  layout, features and  (visual) feedback

**New features**

* One toolbar for several editor instances (#97)
* Modal dialogues (#63)

**Issues to Fix**

* Link editing (#69)
* Block level elements inside list items (#135)
