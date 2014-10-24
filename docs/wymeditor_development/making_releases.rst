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

Update version strings
----------------------

WYMeditor uses `Semantic Versioning`_ ``2.0``.

The project's version string is duplicated in several places, across
four
different files:

* ``package.json``
* ``bower.json``
* ``docs/conf.py`` in two lines

Throughout these instructions, when asked to modify the version string, it is
meant that the version strings be modified in all of these files.

Remove the ``dev`` build metadata from the version string.
Also, remove the ``+`` because there is no more build metadata.

While you're doing that, make sure that the version strings are otherwise correct.

If instructions here were followed,
They should be already the version that you mean to release.

Update the changelog
--------------------

#. If this release makes a transition from alpha to beta or from beta to stable,
   consolidate alpha/beta change–log entries in to a unified section
   for this release.

#. If this is a major release, highlight important changes.

#. Set the date for the release.

Update the web–site
-------------------

Instructions for updating the web–site are in the
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

#. Commit the changes in ``dist/``.

Ship it!
--------

#. Look joyously at the `current releases`.

#. Publish a new release from the master branch with:

   * The version string as the tag that will be created
   * The change–log for this release (not the entire contents of the change–log
     file) as the description
   * The WYMeditor build, ``wymeditor-<version>.tag.gz``, as an attached binary

#. `Activate the new version in Read the Docs`_
   and set it as the default version.

#. :ref:`Publish the website <publish-website>`.

#. Drench yourself in a feeling of attainment.

#. `Tweet`_.

Prepare for the next release
============================

#. Create a new version entry in the change–log.
#. Bump the version string and add the build
   metadata string, ``dev``, at the
   end (with a ``+`` between the PATCH version and it).

.. _Semantic Versioning: http://semver.org/
.. _current releases: https://github.com/wymeditor/wymeditor/releases
.. _Activate the new version in Read the Docs: https://readthedocs.org/
   dashboard/wymeditor/versions/
.. _Tweet: https://twitter.com/wymeditor
