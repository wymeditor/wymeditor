####################
Setting up WYMeditor
####################

************************
Quick Start Instructions
************************

.. _Include jQuery:

Include jQuery
==============

WYMeditor requires a version of jQuery between 1.4.4 and 2.1.x.

Make sure that your page includes it.

.. note::

    With jQuery 2.x and newer, there is no support for IE8 and older.

Download a Pre-built Release of WYMeditor
=========================================

Download a pre-built WYMeditor release
from the `WYMeditor Releases Github Page`_.
Extract the contents of the archive
in to a folder in your project
(eg. ``media/js/wymeditor``).


.. _`WYMeditor Releases Github Page`: https://github.com/wymeditor/wymeditor/releases

Or install via Bower
====================

WYMeditor is available via `Bower`_.

jQuery 2.x does not support IE8 and older.

WYMeditor does support IE8.

WYMeditor's Bower manifest defines a range of jQuery versions as a
dependency.

The latest jQuery version in this range is the newest jQuery version that
still supports these browsers.

WYMeditor does support jQuery 2.x, with the acknowledgement that it will not
function in IE8.

If you decide to use jQuery 2.x, please feel free to override the top limit,
while making sure you supply a jQuery version that WYMeditor supports.

See :ref:`Include jQuery` for WYMeditor's range of supported jQuery versions.

.. _`Bower`: http://bower.io/

Source the WYMeditor Javascript
===============================

Include the dependencies (e.g. jQuery, ES5 shim and ES5 Sham)
and ``wymeditor/jquery.wymeditor.min.js`` file
on your page.

.. code-block:: html

    <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title>WYMeditor Quickstart</title>
            <script type="text/javascript" src="jquery/jquery.js"></script>
            <!-- for IE8, ES5 shims are required-->
            <!--[if IE 8]>
            <script type="text/javascript" src="es5-shim.js"></script>
            <script type="text/javascript" src="es5-sham.js"></script>
            <![endif]-->
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
* Whenever ``html()`` is called on the editor,
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
            <!-- for IE8, ES5 shims are required-->
            <!--[if IE 8]>
            <script type="text/javascript" src="es5-shim.js"></script>
            <script type="text/javascript" src="es5-sham.js"></script>
            <![endif]-->
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
    you'll need to call ``html()`` yourself.


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
            <!-- for IE8, ES5 shims are required-->
            <!--[if IE 8]>
            <script type="text/javascript" src="es5-shim.js"></script>
            <script type="text/javascript" src="es5-sham.js"></script>
            <![endif]-->
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
            <!-- for IE8, ES5 shims are required-->
            <!--[if IE 8]>
            <script type="text/javascript" src="es5-shim.js"></script>
            <script type="text/javascript" src="es5-sham.js"></script>
            <![endif]-->
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
