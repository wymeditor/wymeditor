#####################
WYMeditor Development
#####################

.. toctree::
    :maxdepth: 2

    contributing
    contributing_documentation
    building_wymeditor
    testing_wymeditor
    coding_standard
    wymeditor_architecture
    cursor_behavior
    future_planning/index
    making_releases
    wymeditor_website

***************
Troubleshooting
***************

Error Running ``$ grunt server``
================================

On some linux systems,
(eg. Ubuntu 10.04),
you see something like:

.. code-block:: shell-session

    $ grunt server
    Running "express:all" (express) task

    Running "open:all" (open) task
    Web server started on port:9000, hostname: 0.0.0.0 [pid: 29903]

    Running "watch" task
    Waiting...Fatal error: watch ENOSPC

That ``ENOSPC`` thing is related to your ``inotify`` watchers.
Basically,
you're trying to watch more files than are allowed.

Just Fix It
-----------

To just up the number of ``inotify`` watchers allowed,
run:

.. code-block:: shell-session

    $ echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
    $ sudo sysctl -p

More Details
------------

For a more detailed explanation,
see the `guard/listen wiki <https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers>`_.
