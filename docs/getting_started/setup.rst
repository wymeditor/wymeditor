####################
Setting up WYMeditor
####################

************************
Quick Start Instructions
************************

Include jQuery
==============

WYMeditor requires a version of jQuery between 1.4.4 and 2.1.x
and :ref;`jquery.browser` version 0.0.6.

First ensure that your page includes these.

.. note::

    With jQUery 2.x and newer, there is no support for IE8 and older.

.. _`jquery.browser`: https://github.com/gabceb/jquery-browser-plugin

Download a Pre-built Release of WYMeditor
=========================================

Download a pre-built WYMeditor release
from the `WYMeditor Releases Github Page`_.
Extract the contents of the archive
in to a folder in your project
(eg. ``media/js/wymeditor``).


.. _`WYMeditor Releases Github Page`: https://github.com/wymeditor/wymeditor/releases

Source the WYMeditor Javascript
===============================

Include the ``wymeditor/jquery.wymeditor.min.js`` file
on your page.
This file will pull in anything else that's required.

.. code-block:: html

    <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title>WYMeditor Quickstart</title>
            <script type="text/javascript" src="jquery/jquery.js"></script>
            <script type="text/javascript" src="wymeditor/jquery.wymeditor.min.js"></script>
        </head>
        <body>
            ... SNIP
        </body>
    </html>

Create a ``textarea`` for the Editor
====================================

WYMeditor instances are tied to ``textarea`` inputs.

The ``textarea`` provides a few things:

* Its text is used
  as the initial HTML
  inside the editor.
* Whenever ``xhtml()`` is called on the editor,
  the resulting parsed html
  is placed inside the
  (hidden) ``textarea``.
* The editor UI appears in the same location
  previously occupied by the ``textarea``.

Let's create a ``textarea``
and give it a ``submit`` button
with the ``wymupdate`` class.
Let's also start with some existing content.

.. code-block:: html

    <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title>WYMeditor Quickstart</title>
            <script type="text/javascript" src="jquery/jquery.js"></script>
            <script type="text/javascript" src="wymeditor/jquery.wymeditor.min.js"></script>
        </head>
        <body>
            <form method="post" action="">
                <textarea id="my-wymeditor"><p>I'm initial content!</p></textarea>
                <input type="submit" class="wymupdate" />
            </form>
        </body>
    </html>

.. note::

    The ``wymupdate`` class is just a convenience
    so that your ``textarea``
    automatically receives the updated  HTML
    on form submit.
    Otherwise,
    you'll need to call ``xhtml()`` yourself.


Use ``wymeditor()`` to Create an Editor
=======================================

Creating a WYMeditor editor instance happens
via a jQuery plugin,
aptly named ``wymeditor``,
that you call on a ``textarea`` element.

Let's use the ``wymeditor()`` function
to select the ``my-wymeditor`` ``textarea`` element
and turn it in to a WYMeditor instance.

.. code-block:: javascript

    $(document).ready(function() {
        $('#my-wymeditor').wymeditor();
    });

.. note::

    We use the ``$(document).ready``
    to wait until the DOM is loaded.
    Most users will want to do this,
    but it's not strictly necessary.

See :ref:`anatomy-of-editor-initialization` for more details.

All Together Now
================

.. code-block:: html

    <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title>WYMeditor Quickstart</title>
            <script type="text/javascript" src="jquery/jquery.js"></script>
            <script type="text/javascript" src="wymeditor/jquery.wymeditor.min.js"></script>
        </head>
        <body>
            <form method="post" action="">
                <textarea id="my-wymeditor"><p>I'm initial content!</p></textarea>
                <input type="submit" class="wymupdate" />
            </form>
            <script type="text/javascript">
                $(document).ready(function() {
                    $('#my-wymeditor').wymeditor();
                });
            </script>
        </body>
    </html>

Troubleshooting
===============

If things aren't behaving as you'd expect,
the first step is to open your browser's development tools.
Chrome, Firefox and recent IE all have acceptable versions.
Look for error messages
and 404s retrieving files.

It's also a good idea
to compare your code
to some of the :doc:`/customizing_wymeditor/examples/index`.

Security Errors
---------------

Because WYMeditor is based on an iframe,
there are restrictions about loading files across domains.
That means that you need to serve the WYMeditor media
from your current domain.

404s Loading Files
------------------

WYMeditor automagically detects the paths
of required CSS and JS files.
You'll need to initialize ``basePath``,
``cssPath``
and ``jQueryPath``
if you don't use default file names.
Those are ``jquery.wymeditor.js``,
``wymeditor/skins/{skin name}/screen.css``,
and ``jquery.js``, respectively.

For details,
see :doc:`/customizing_wymeditor/index`.

*******
Example
*******

.. code-block:: html

    <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title>WYMeditor Quickstart</title>
            <script type="text/javascript" src="jquery/jquery.js"></script>
            <!-- Include jquery.browser **after** jQuery -->
            <script type="text/javascript" src="jquery/jquery-browser.min.js"></script>
            <!-- But before jquery.wymeditor -->
            <script type="text/javascript" src="wymeditor/jquery.wymeditor.min.js"></script>
        </head>
        <body>
            <form method="post" action="">
                <textarea id="my-wymeditor"><p>I'm initial content!</p></textarea>
                <input type="submit" class="wymupdate" />
            </form>
            <script type="text/javascript">
                $(document).ready(function() {
                    $('#my-wymeditor').wymeditor();
                });
            </script>
        </body>
    </html>
