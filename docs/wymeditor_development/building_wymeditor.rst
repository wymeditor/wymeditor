Building WYMeditor
==================

We use ``grunt`` to build WYMeditor.
Assuming you've already followed the instructions for
:ref:`configuring-your-development-environment`,
it's pretty straight forward.

.. code-block:: shell-session

    $ grunt

That command runs the tests before the build.
For just a plain build:

.. code-block:: shell-session

    $ grunt build

The resulting compressed distribution will appear in your ``dist`` directory.
