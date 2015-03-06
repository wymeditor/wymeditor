##################################
Contributed Examples and Cookbooks
##################################

****************************
Running the Examples Locally
****************************

Each release of WYMeditor comes bundled with a set of examples (available
online `here <http://wymeditor.github.io/wymeditor/dist/examples/>`_).
To run these locally,
they need to be served on a proper web server.
If not,
WYMeditor might not work properly as most modern browsers block certain JavaScript
functionality for local files.

If you've finished :ref:`configuring-your-development-environment`,
then serving the examples is easy:

.. code-block:: shell-session

    $ grunt server:dist
    $ google-chrome "http://localhost:9000/examples/"

**************************
Examples Table of Contents
**************************

.. toctree::
    :maxdepth: 2

    django_administration
    image_gallery
    snews_cms
    rails

