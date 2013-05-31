Coding Standard
===============

The goal of this document is to define a set of general rules regarding the
formatting and structure of the WYMeditor code as well as defining some best
practices. It should also serve as a god starting point for developers that
want to contribute code to the WYMeditor project.


jslint
------

All Javascript source should pass the latest stable version of
`JSlint <https://github.com/reid/node-jslint>`_ using the options:

.. code-block:: shell-session

    jslint --es5 false --white --indent 4


Crockford Javascript Code Conventions
-------------------------------------

Please refer to the `Crockford Javascript Code
Conventions <http://javascript.crockford.com/code.html>`_ for a set of general
rules. The points listed below are not included in Crockford Conventions and/or
specific to the WYMeditor project.


Formatting and Style
--------------------

Naming Conventions
^^^^^^^^^^^^^^^^^^

Variables and Functions
"""""""""""""""""""""""

Give variables and function **meaningful names**. Use mixedCase (lower
CamelCase) for names spanning several words. “Constants” should be in all
CAPITAL_LETTERS with underscores to separate words.  Avoid the use of Hungarian
Notation, instead make sure to “type” your variables by assigning default
values and/or using comments.

Example:

.. code-block:: javascript

    var elements = [];
    var VERSION = 0.6;
    function parseHtml () {};

Constructors
""""""""""""

Constructors should be named using PascalCase (upper CamelCase) for easier
differentiation.

Example:

.. code-block:: javascript

    function MyObject () {}
    MyObject.prototype = {
    function myMethod () {}
    }

Event Handlers
""""""""""""""

Prepend “on” to the event handler name for easier differentiation.

Example:

.. code-block:: javascript

    function onEventName (event) {}

Namespacing
^^^^^^^^^^^

All code should be placed under the WYMeditor namespace to avoid creating any
unnecessary global variables. If you're extending and/or modifying WYM, place
you code where you see fit (most likely WYMeditor.plugins).

WYMeditor.core contains the Editor object and the SAPI as well as HTML, CSS and
DOM parsers which make out the core parts of WYMeditor.

WYMeditor.ui contains the UI parts of WYM (i.e. the default Toolbar and
Dialogue objects).

WYMeditor.util contains any utility methods or objects, see :ref:`natives`.

WYMeditor.plugins – place your plug-ins here.


Inheritance and "Classes"
-------------------------

There's a lot of different ways of doing inheritance in JavaScript. There have
been attempts to emulate Classes and several patterns trying enhance, hide or
modify the prototypal nature of JavaScript – some more successful than others.
But in order to keep things familiar for as many JavaScript developers as
possible we're sticking with the “Pseudo Classical” model (constructors and
prototypes).

It's not that the different variations of the “Pseudo Classical” model out
there are all bad, but there is no other “standard” way of doing inheritance.

Private members
^^^^^^^^^^^^^^^
Add description

Events
^^^^^^

Add description

Other Rules and Best Practices
------------------------------

.. _natives:

Leave the Natives Alone
^^^^^^^^^^^^^^^^^^^^^^^

WYMeditor is used by a lot of people in a lot of different environments thus
modifying the prototypes for native objects (such as Array or String) can
result in unwanted and complicated conflicts.

The solution is simple – simply leave them alone. Place any kind of general
helper methods under WYMeditor.util.

Use Literals
^^^^^^^^^^^^

This is a basic one – but there's still a lot of developers that use the Array
and Object constructors.

http://yuiblog.com/blog/2006/11/13/javascript-we-hardly-new-ya/

Further Reading
^^^^^^^^^^^^^^^

Got any other links that you think can be of help for new WYM developers? Share
them here!

* http://dev.opera.com/articles/view/javascript-best-practices/
