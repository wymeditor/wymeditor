###############
Coding Standard
###############

The goal of this document is to define a set of general rules regarding the
formatting and structure of the WYMeditor code as well as defining some best
practices. It should also serve as a good starting point for developers that
want to contribute code to the WYMeditor project.

******
jshint
******

All Javascript source should pass the version of
`jshint <https://github.com/jshint/jshint>`_
that's defined via ``grunt-contrib-jshint``
in our ``packages.json``
with the options defined in our ``.jshintrc``.

Ideally,
you are running this in your text editor
on every file save.
At the very least,
you can perform this check via Grunt:

.. code-block:: shell-session

    $ grunt jshint

Making Files Pass
=================

``jshint`` against master should always pass,
all the time.
That means that before sending a pull request,
a feature branch should pass.
Generally,
there are a few techniques to make this happen.

Fix Your Code
-------------

Most of the time,
the errors are useful
and changing the code to pass results in cleaner,
easier to read,
more-consistent code.
If you're confused about an error,
a quick google usually results
in a Stack Overflow question with a good solution.

Define ``global`` and ``exported``
----------------------------------

The combination of the `unused <http://www.jshint.com/docs/options/#unused>`_
and `undef <http://www.jshint.com/docs/options/#undef>`_ options
is very useful for eliminating global leakage and dead code.
It does have a cost in that we must tell jshint
about which files rely on other files
and which files are used as libraries by other files.

We do this using `Inline configuration <http://www.jshint.com/docs/config/>`_.

Do **not** use single-line exceptions
to tell jshint to ignore global/exported problems.


``global``
^^^^^^^^^^

If you get a ``W117`` warning
about a variable not being defined
because it comes from another file,
you need to define a global.
For example,
the ``ok`` method comes from QUnit
so test files need the following at the top:

.. code-block:: javascript

    /* global ok */

``exported``
^^^^^^^^^^^^

For variables and functions defined in one file
but used in another,
you'll get a ``W098`` warning
about the variable being defined but never used.
You should fix this with an ``exported`` Inline configuration
at the top of the file.

For example,
if the file defines a ``usefulUtiityFunction``,
you would add the following
at the top of the file:

.. code-block:: javascript

    /* exported usefulUtilityFunction */

Make single-section jshint Exceptions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This should be used as little as possible.
There's almost always a way to fix the code
to match.
When WYMeditor started enforcing a passing jshint,
we added exceptions liberally
just to get to a stable starting point.
New code should almost never
come with new exceptions.

This `JSHint options documentation <http://www.jshint.com/docs/config/>`_
explains how to suppress a warning
and then re-enable the warning.
**Always** re-enable the warning
after you disable it,
even if there's currently no code after the block.
Otherwise,
new code added might accidentally
not be subject to the check.

For example,
if you're doing a ``for in`` loop that you know to be safe,
you could do:

.. code-block:: javascript

    var y = Object.create(null);

    /* jshint -W089 */
    for (var prop in y) {
        // ...
    }
    /* jshint +W089 */

Make file-wide jshint Exceptions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Any file-wide jshint exception is considered a bug,
but in the interests of getting a passing jshint,
some were used initially.
Do **not** add these,
despite the fact that some files currently use them.
Pull requests that remove a file-wide exception
and fix the resulting lint problems
are greatly appreciated.

Current vs Ideal
================

Some of our current `jshint options <http://www.jshint.com/docs/options/>`_
are a result of legacy code
and not an indication of where we'd like to be.
In the spirit of getting a 100% passing jshint run,
we made some initial sacrifices.
The goal is to get all of the code on the same standard.

Additionally,
there are several files listed in ``.jshintignore``
because they don't yet conform to our standards.
We would really all of our code to conform,
which means removing the ignores
for everything but the 3rd-party code.

*************************************
Crockford Javascript Code Conventions
*************************************

Please refer to the
`Crockford Javascript Code Conventions <http://javascript.crockford.com/code.html>`_
for our default code conventions.
The :ref:`development-coding-standard-formatting-and-style` section
describes some areas where we are more-strict.

Changes to Crockford Conventions
================================

We also have some choices that contradict Crockford's conventions.

#. We use one ``var`` statement per scope,
   versus another ``var`` for each variable.
#. We still use ``eval()`` in a couple of places.
   It is evil,
   though,
   and it's considered an implementation bug.

.. _development-coding-standard-formatting-and-style:

********************
Formatting and Style
********************

Naming Conventions
==================

Variables and Functions
-----------------------

* Give variables and function **meaningful names**.
  Naming is very important!
* Use mixedCase
  (lower CamelCase)
  for names spanning several words.
* `Constants` should be in all CAPITAL_LETTERS
  with underscores to separate words.
* Avoid the use of Hungarian Notation,
  instead make sure to `type` your variables
  by assigning default values and/or using comments.
* Use one ``var`` statement per scope,
  declaring all of your variables there
  on separate lines.

Example:

.. code-block:: javascript

    var elements = [],
        somethingElse = '',
        VERSION = 0.6;
    function parseHtml () {};

Constructors
------------

Constructors should be named using PascalCase (upper CamelCase) for easier
differentiation.

Example:

.. code-block:: javascript

    function MyObject () {}

    MyObject.prototype = {
        function myMethod () {}
    }

Namespacing
===========

All code should be placed under the WYMeditor namespace to avoid creating any
unnecessary global variables. If you're extending and/or modifying WYM, place
you code where you see fit (most likely WYMeditor.plugins).

WYMeditor.core contains the Editor object and the SAPI as well as HTML, CSS and
DOM parsers which make out the core parts of WYMeditor.

WYMeditor.ui contains the UI parts of WYM (i.e. the default Toolbar and
Dialogue objects).

WYMeditor.util contains any utility methods or objects, see :ref:`coding-style-natives`.

WYMeditor.plugins – place your plug-ins here.

Multi-Line Strings
==================

Choosing among syntaxes for multi-line strings is rough,
because they mostly all suck.
We've settled on this as the least-bad:

.. code-block:: javascript

    var bigString = [""
        , wym._options.containersSelector
        , wym._options.classesSelector
    ].join('');

Advantages:

* Passes ``jshint``
* Leading commas allows re-ordering without comma juggling
* A one-line addition is a one-line diff
* Can use other join characters like ``, `` or ``\n`` for flexibility
* Can indent lines in source to avoid >79 character lines
* Can indent lines in source to display HTML nesting for readability

HTML Strings
------------

Building HTML strings also kind of sucks.
Eventually,
we hope to using something like `JSX <http://facebook.github.io/react/docs/jsx-in-depth.html>`_.
For now,
just build a multi-line string with proper HTML indentation
and using ``'`` as the quote character
(so that it's easy to use proper ``"`` to quote HTML attributes).

.. code-block:: javascript

    var iframeHtml = [""
        , '<div class="wym_iframe wym_section">'
            , '<iframe src="' + WYMeditor.IFRAME_BASE_PATH + 'wymiframe.html" '
                , 'frameborder="0" '
                , 'scrolling="no" '
                , 'onload="this.contentWindow.parent.WYMeditor.INSTANCES['
                , WYMeditor.INDEX + '].initIframe(this)"'
                , '>'
            , '</iframe>'
        , '</div>'
    ].join(""),

Inheritance and "Classes"
=========================

There's a lot of different ways of doing inheritance in JavaScript. There have
been attempts to emulate Classes and several patterns trying enhance, hide or
modify the prototypal nature of JavaScript – some more successful than others.
But in order to keep things familiar for as many JavaScript developers as
possible we're sticking with the “Pseudo Classical” model (constructors and
prototypes).

It's not that the different variations of the “Pseudo Classical” model out
there are all bad, but there is no other “standard” way of doing inheritance.

Other Rules and Best Practices
==============================

.. _coding-style-natives:

Leave the Natives Alone
-----------------------

WYMeditor is used by a lot of people in a lot of different environments thus
modifying the prototypes for native objects (such as Array or String) can
result in unwanted and complicated conflicts.

The solution is simple – simply leave them alone. Place any kind of general
helper methods under WYMeditor.util.

Use Literals
------------

This is a basic one – but there's still a lot of developers that use the Array
and Object constructors.

http://yuiblog.com/blog/2006/11/13/javascript-we-hardly-new-ya/

Use the ``which`` Property of jQuery Event Objects
--------------------------------------------------

When watching for keyboard key input, use the ``event.which`` property to find
the inputted key instead of ``event.keyCode`` or ``event.charCode``. This
should be done for consistency across the project because the ``event.which``
property normalizes ``event.keyCode`` and ``event.charCode`` in jQuery. Using
``event.which`` is also the `recommended method by jQuery
<http://api.jquery.com/event.which/>`_ for watching keyboard key input.

.. _development-coding-standard-comments:

Comments should read as "why?" sentences
----------------------------------------

Wherever possible,
comments should read like a sentence.
Sentences evolved because they're good
at conveying information.
Fragments are often ambiguous
to those who need the comment most.
They should also mostly answer the question
"why?"
instead of what/how.

When tempted to write a comment
that describes what a block of code does,
instead,
write a function with a good name.
The exception is one-liners that are conceptually dense,
although those are usually the sign
of a need for a refactor
or utility function.

"What" comment example
^^^^^^^^^^^^^^^^^^^^^^
.. code-block:: javascript

    function MyPlugin(options, wym) {
        var defaults = {
            'optionFoo1': 'bar'
        };
        this._options = jQuery.extend(defaults, options);
        this._wym = wym;

        this.init();
    }

    MyPlugin.prototype.init = function() {
        var wym = this._wym,
            buttonFoo1,
            buttonFoo2,
            buttonsHtml,
            box = jQuery(wym._box);

        //construct the buttons' html
        buttonFoo1 = [""
            , "<li class='wym_tools_foo1'>"
            ,     "<a name='foo1' title='Foo 1' href='#'"
            ,         "{foo1}"
            ,     "</a>"
            , "</li>"
        ].join('');
        buttonFoo2 = [""
            , "<li class='wym_tools_foo2'>"
            ,     "<a name='foo2' title='Foo 2' href='#'"
            ,         "{foo2}"
            ,     "</a>"
            , "</li>"
        ].join('');

        buttonsHtml = buttonFoo1 + buttonFoo2;

        //add the button to the tools box
        box.find(wym._options.toolsSelector + wym._options.toolsListSelector)
            .append(buttonsHtml);

        //bind listeners
        box.find('li.wym_tools_foo1 a').click(function () {
            // Do foo1 things
        });
        box.find('li.wym_tools_foo2 a').click(function () {
            // Do foo2 things
        });
    };

Improved
^^^^^^^^

.. code-block:: javascript

    function MyPlugin(options, wym) {
        var defaults = {
            'optionFoo1': 'bar'
        };
        this._options = jQuery.extend(defaults, options);
        this._wym = wym;

        this.init();
    }

    MyPlugin.prototype.init = function() {
        var wym = this._wym,
            buttonsHtml,
            box = jQuery(wym._box);

        buttonsHtml = this._buildButtonsHtml();

        // Add the button to the tools box.
        // TODO: There should probably be a WYMeditor utility function for
        // doing this.
        box.find(wym._options.toolsSelector + wym._options.toolsListSelector)
            .append(buttonsHtml);

        this._bindEventListeners(box);
    };

    MyPlugin.prototype._buildButtonsHtml = function () {
        var buttonFoo1 = '',
            buttonFoo2 = '';

        buttonFoo1 = [""
            , "<li class='wym_tools_foo1'>"
            ,     "<a name='foo1' title='Foo 1' href='#'"
            ,         "{foo1}"
            ,     "</a>"
            , "</li>"
        ].join('');
        buttonFoo2 = [""
            , "<li class='wym_tools_foo2'>"
            ,     "<a name='foo2' title='Foo 2' href='#'"
            ,         "{foo2}"
            ,     "</a>"
            , "</li>"
        ].join('');

        return buttonFoo1 + buttonFoo2;
    };

    MyPlugin.prototype._bindEventListeners = function (box) {
        var myPlugin = this;

        box.find('li.wym_tools_foo1 a').click(function () {
            myPlugin._doFoo1Things();
        });
        box.find('li.wym_tools_foo2 a').click(function () {
            myPlugin._doFoo2Things();
        });
    };

    MyPlugin.prototype._doFoo1Things = function () {
        // Do foo1 things
    };

    MyPlugin.prototype._doFoo2Things = function () {
        // Do foo2 things
    };

Further Reading
---------------

Got any other links that you think can be of help for new WYM developers? Share
them here!

* http://dev.opera.com/articles/view/javascript-best-practices/
