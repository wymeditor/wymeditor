Setting up WYMeditor
====================

#. WYMeditor requires a version of jQuery between 1.2.6 and 1.8.3. First ensure
   that your page includes jQuery.

#. Download the `Version 1.0.0b4
   <https://github.com/downloads/wymeditor/wymeditor/wymeditor-1.0.0b4.tar.gz>`_
   archive and extract the contents to a folder in your project.

#. Include the ``wymeditor/jquery.wymeditor.min.js`` file on your page. This
   file will pull in anything else that's required.

    .. code-block:: html

        <script type="text/javascript" src="/wymeditor/jquery.wymeditor.min.js"></script>

#. Now use the ``wymeditor()`` function to select one of your ``textarea``
   elements and turn it in to a WYMeditor instance. eg. if you have a
   ``textarea`` with the class ``my-wymeditor``:

    .. code-block:: javascript

        $('.my-wymeditor').wymeditor();

    .. note::
        You'll probably want to do this initialization inside a
        ``$(document).ready()`` block.

#. If you'd like to receive the valid HTML your editor produces on form
   submission, just add the class wymupdate to your submit button.

    .. code-block:: html

         <input type="submit" class="wymupdate" />

#. ???

#. Profit!


Sample Minimal Page Integration
-------------------------------

.. code-block:: html

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html>
    <head>
    <title>WYMeditor</title>
    <script type="text/javascript" src="jquery/jquery.js"></script>
    <script type="text/javascript" src="wymeditor/jquery.wymeditor.pack.js"></script>
    <script type="text/javascript">

    jQuery(function() {
        jQuery(".wymeditor").wymeditor();
    });

    </script>
    </head>

    <body>
    <form method="post" action="">
    <textarea class="wymeditor"></textarea>
    <input type="submit" class="wymupdate" />
    </form>
    </body>

    </html>

**Explanation**

* ``jQuery(function() {});`` is a shorthand for
  ``jQuery(document).ready()``, allowing you to bind a function to be
  executed when the DOM document has finished loading. If you prefer, you
  can use the jQuery '$' shortcut.
* ``jQuery(".wymeditor").wymeditor();`` will replace every element with the
  class ``wymeditor`` by a WYMeditor instance.
* The value of the element replaced by WYMeditor will be updated by e.g.
  clicking on the element with the class ``wymupdate``. See
  :doc:`customize`.

.. note::
    WYMeditor automagically detects the paths of required CSS and JS files.
    You'll need to initialize ``basePath``, ``cssPath`` and ``jQueryPath``
    if you don't use default file names (i.e. ``jquery.wymeditor.js``,
    ``wymeditor/skins/{skin name}/screen.css``, ``jquery.js``).  See
    :doc:`customize`.

More examples with different plugins and configuration options can be found in
your ``examples`` directory.
