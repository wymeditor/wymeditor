Dev Process Improvements
========================

This page is where I get to brain-dump ideas for improving the
development/testing/packaging/documentation/etc process because making Issues
for speculation feels dirty.

Standardize the Build Process on Grunt.js
-----------------------------------------

It's a Javascript project, so let's use Javascript tools. Via grunt, folks should be able to:
* Make a build
* Run the qunit tests in a headless PhantomJS thing
* Run the selenium tests
* Check code for style problems

This is started here: https://github.com/wymeditor/wymeditor/tree/issue_360

Documentation
-------------

* Convert all of the existing docs from the old wiki to RST for hosting on
  `Read The Docs <https://readthedocs.org/>`_
* Take a pass to remove all of the obvious errors and new stuff
* Move most of the good info from the readme to a good sphinx structure
* Move the stuff that's unique on the wiki to the sphinx structure

Run the Unit Tests in Every Browser on Every Build
--------------------------------------------------

`Testling-CI <http://ci.testling.com/>`_ seems like the way to go for running
our unit tests across our supported browsers. It won't work for our Selenium
tests, but it will at least make it easy to catch regressions and the like when
lazy developers \*cough\*me\*cough\* don't test in all of the IE's.

Use travis-CI to run Selenium Tests in Chrome
---------------------------------------------

It would be nice to run our Selenium tests in every supported browser on every
commit, but it's at least easy to run them using Phantomjs inside travis-ci:
http://about.travis-ci.org/docs/user/gui-and-headless-browsers/

Find Something to run Selenium Tests in Other Supported Browsers
----------------------------------------------------------------

There has to be a thing. Find that thing, and then use it.

Find a Better Way of Hosting the Demos
--------------------------------------

Joyent has discontinued their no.de node PaaS that we previously used to host
the demos. Either move to their `Nodejitsu <http://www.nodejitsu.com/>`_
replacement, or find something else.

Automate Taking Demo Screenshots for the Docs
---------------------------------------------

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
