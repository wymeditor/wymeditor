Getting Started
===============

* :ref:`example`
* :ref:`setup`
* :ref:`customize`
* :ref:`api`
* :ref:`plugins`

.. _example:

Running the Examples Locally
----------------------------

Each release of WYMeditor comes bundled with a set of examples (available
online `here <http://wymeditor.no.de/wymeditor/examples/>`_). To run these
locally, they need to be served on a proper web server. If not, WYMeditor might
not work properly as most modern browsers block certain JavaScript
functionality for local files.

To test WYMeditor without setting up something like Apache, Nginx or uploading
the code to a remote server, open your wymeditor directory in a terminal and
run:

.. code-block:: terminal

    $ python -m http.server

.. note::
    On Windows: if the Python executable is not already on your PATH, replace
    "python" with the absolute path to your python.exe, usually something like
    "C:\Python2X\python.exe".

This will start a simple server in your current working directory on port 8000.
If you already have something else running on that port, an optional port number
can be provided as the last argument.

Now point your browser to ``http://localhost:8000/`` and browse to the examples
directory.

**Done!**


.. _setup:

Setting up WYMeditor
--------------------

1. WYMeditor requires a version of jQuery between 1.2.6 and 1.8.3. First ensure
   that your page includes jQuery.

2. Download the `Version 1.0.0b4
   <https://github.com/downloads/wymeditor/wymeditor/wymeditor-1.0.0b4.tar.gz>`_
   archive and extract the contents to a folder in your project.

3. Include the ``wymeditor/jquery.wymeditor.min.js`` file on your page. This
   file will pull in anything else that's required.

4. Now use the ``wymeditor()`` function to select one of your ``textarea``
   elements and turn it in to a WYMeditor instance. eg. if you have a
   ``textarea`` with the class ``my-wymeditor``:

    .. code-block:: javascript

        $('.my-wymeditor').wymeditor();

    .. note::
        You'll probably want to do this initialization inside a
        ``$(document).ready()`` block.

5. If you'd like to receive the valid HTML your editor produces on form
   submission, just add the class wymupdate to your submit button.

6. ???

7. Profit!

More examples with different plugins and configuration options can be found in
your ``examples`` directory.

.. _customize:

Customization Options
---------------------


.. _api:

API
---


.. _plugins:

Plugins
-------
