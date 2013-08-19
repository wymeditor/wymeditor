Building WYMeditor
==================

#. Get a copy of the source using git:

    .. code-block:: shell-session

        $ git clone git://github.com/wymeditor/wymeditor.git

#. Install ``make``, Node.js and `UglifyJS
   <https://github.com/mishoo/UglifyJS/>`__.  To install UglifyJS using `NPM
   <http://npmjs.org/>`_ run the following:

    .. code-block:: shell-session

        $ npm install -g uglify-js

#. Run ``make`` from your git clone:

    .. code-block:: shell-session

        $ cd wymeditor
        $ make

The resulting compressed distribution will appear in your ``dist`` directory.

Building with Google's Closure Compiler (Java)
----------------------------------------------

The default WYMeditor distribution is built with `UglifyJS
<https://github.com/mishoo/UglifyJS>`__, which requires the installation of
Node.js. If you prefer Java and/or Google's Closure Compiler, you can follow
these instructions instead.

#. Get a copy of the source using git:

    .. code-block:: shell-session

        $ git clone git://github.com/wymeditor/wymeditor.git

#. Install ``make`` and Java.

#. Download `Closure Compiler application
   <https://developers.google.com/closure/compiler/>`_, extracting
   ``compiler.jar`` into your ``wymeditor`` directory.

#. Run ``make`` from your git clone:

    .. code-block:: shell-session

        $ cd wymeditor
        $ make min_closure archive
