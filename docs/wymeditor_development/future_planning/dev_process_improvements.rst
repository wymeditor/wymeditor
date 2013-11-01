########################
Dev Process Improvements
########################

This page is where we brain-dump ideas for improving the
development/testing/packaging/documentation/etc process because making Issues
for speculation feels dirty.

*************
Documentation
*************

Automate Taking Demo Screenshots for the Docs
=============================================

Screenshots are worth a thousand words.
Use `grunt-autoshoot <https://github.com/Ferrari/grunt-autoshot>`_
to take screenshots of the examples
and update the docs to embed them.

*******
Testing
*******

Eliminate the Selenium tests
============================

There are some bugs that can only be tested with native events,
so we wrote Selenium tests for them.
This kind of sucks,
though,
since it's a very separate concern.

Instead,
use one of the Java Applet-based real user event simulators.

Candidates
----------

* Dojo's `DOHRobot <https://github.com/dojo/util/tree/master/doh/robot>`_.
* Ephox `JSRobot <https://github.com/ephox/JSRobot>`_.

Of the two,
``DOHRobot`` seems to have more of an active community.
``JSRobot`` is used to test TinyMCE, though.

Run the Unit Tests in Every Browser on Every Build
==================================================

`Testling-CI <http://ci.testling.com/>`_ seems like the way to go for running
our unit tests across our supported browsers. It won't work for our Selenium
tests, but it will at least make it easy to catch regressions and the like when
lazy developers \*cough\*me\*cough\* don't test in all of the IE's.
