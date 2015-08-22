*************************
Making WYMeditor Releases
*************************

WYMeditor's release procedure aims to produce high–quality and easy–to–use
releases.

In order to ensure its consistency, the release procedure is described here.

Prerequesites for a release
===========================

Subjects under this are prerequesites for making a release.

No Regression Bugs
------------------

We shouldn't break things that used to work between releases. That undermines
user confidence and makes it hard to build momentum of positive improvement
since it becomes an equation with both positive and negatives which will be
weighted differently for different people. That doesn't mean we can't make
backwards-incompatible changes, but it does mean that anything that might be
backwards incompatible needs to be very explicitly planned for.

This can generally be verified by running through the issue tracker and making
sure no new bugs have been reported that didn't exist in prior versions. If
there has been, that issue needs to be addressed before a new release should be
cut. Bugs that are a result of running WYM in a new browser (new Chrome or
Firefox release, for example) don't count as regression bugs for this purpose,
but should be given high priority otherwise.

`This report`_ should be empty.

.. _This report: https://github.com/wymeditor/wymeditor/labels/type.bug.regression

Passing Tests
-------------

All releases should have 100% passing unit tests in 100% of supported
browsers for all of the supported versions of jQuery.

The person doing the release is responsible for running the unit tests in all
supported browsers.

Documentation is up–to–date
---------------------------

It's important that users can be confident that the documentation distributed
with WYMeditor is up to date so that it can be trusted.

Please be aware that this prerequesite is not completely met, currently.

Change–log is up–to–date
------------------------

Change–log entries for changes should be merged in with the changes themselves
or immediately following them.

Since we're probably still human, some change–log entries might not have been
written.

We should ensure that noteworthy changes since the last version are included
in the ``CHANGELOG.md`` file.

An overlook on the change–log may inspire rephrasing some of the entries. This
is an opportunity for that.

The format of this file includes various sections for each release.

It should be easy to mimic this same format for the release being made.

The change log is intended for users of WYMeditor.

Any change that may affect them should be included.

Read–me is up–to–date
---------------------

Similar to the change–log, the contents of the ``README.rst`` are supposed to be
up–to–date already.

A good review of it, especially after reviewing the change–log, may inspire
some updates.

Website is up–to–date
---------------------

What is written regarding the read–me above is applicable regarding the
website, as well.

Currently, the website's content is generated from the ``README.rst``, mostly.

Making the release
==================

After the above prerequesites are met, the following actions are in order.

Prepare
-------

#. Make sure your working directory is clean.
#. Checkout ``master``.
#. Pull from origin.

Update version strings
----------------------

WYMeditor uses `Semantic Versioning`_ ``2.0``.

The project's version string is duplicated in several places, across
four
different files:

* ``package.json``
* ``bower.json``
* ``docs/conf.py`` in two lines
* ``CHANGELOG.md`` (the latest entry)

According to `Semantic Versioning`_,
come up with a version for this release
and update the version strings.

Build the web–site
------------------

Instructions for building the web–site are in the
:doc:`web–site documentation page<wymeditor_website>`.


Build WYMeditor
---------------

.. note::

  Users should be able to make their own archive by following the instructions
  in the read–me.
  Nonetheless, including an archive in a known place is important, for ease
  of use.

#. :doc:`Build WYMeditor <building_wymeditor>`.

   This will make the checked–in build at ``dist/`` representitive of the
   source code.

#. Check that examples work when served from ``dist/`` by using ``grunt
   server:dist``.

Commit the changes
------------------

#. Set the date for the release.
#. Commit all the changes you've made
   ,plus the changes in ``dist/``
   to branch ``master``
   and push.

Ship it!
--------

#. Look joyously at the `current releases`_.

#. Publish a new release from the master branch with:

   * The tag is the version string with ``v`` prefixed.
   * The title is the version string as is.
   * The description is the change–log section for this release
     , excluding its title.
   * The WYMeditor build, ``wymeditor-<version>.tag.gz``, as an attached binary

#. `Activate the new version in Read the Docs`_
   and set it as the default version.

#. :ref:`Publish the website <publish-website>`.

#. Drench yourself in a feeling of attainment.

#. `Tweet`_.

Prepare for the next release
============================

You may be unsure what the next version is going to be,
but you must change the version string.
So bump the patch version by one.

#. Bump the version.
#. Create a new entry in the change–log.

.. _Semantic Versioning: http://semver.org/
.. _current releases: https://github.com/wymeditor/wymeditor/releases
.. _Activate the new version in Read the Docs: https://readthedocs.org/
   dashboard/wymeditor/versions/
.. _Tweet: https://twitter.com/wymeditor
