##################################
Contributed Examples and Cookbooks
##################################

****************************
Running the Examples Locally
****************************

Each release of WYMeditor comes bundled with a set of examples (available
online `here <http://wymeditor.no.de/wymeditor/examples/>`_). To run these
locally, they need to be served on a proper web server. If not, WYMeditor might
not work properly as most modern browsers block certain JavaScript
functionality for local files.

To test WYMeditor without setting up something like Apache, Nginx or uploading
the code to a remote server, open your wymeditor directory in a terminal and
run:

.. code-block:: shell-session

    $ python -m SimpleHTTPServer

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

**************************
Examples Table of Contents
**************************

.. toctree::
    :maxdepth: 2

    django_administration
    image_gallery
    snews_cms
    rails

