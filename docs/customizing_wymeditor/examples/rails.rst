Integrate WYMeditor into Rails
==============================

WYM Editor Helper is a plugin that makes it dead easy to incorporate the WYM
editor into your Rails views.

Follow these steps to use:

#. From your project's root, run:

    .. code-block:: shell-session

        $ ruby script/plugin install svn://zuurstof.openminds.be/home/kaizer/svn/rails_stuff/plugins/wym_editor_helper
        $ rake wym:install

#. Put ``<%= wym_editor_initialize %>`` in the view that will host the text
   editing form. Prefereably this goes into your html's HEAD, to keep our html
   W3C valid. Use ``<% content_for :head do %> <%= wym_editor_initialize %> <%
   end %>`` in the view that needs the editor, and ``<%= yield :head %>`` in
   the layout. This means the editor will only load when it is truly called
   for.

#. In your form, instead of i.e. ``<%= text_area :article, :content %>``, use
   ``<%= wym_editor :article, :content %>`` OR add a ``wymeditor`` class to the
   ``textarea``.

#. Add a ``wymupdate`` class to the submit button.

Extra Info
----------

This plugin uses an ``svn:external`` to automatically get the latest version of
WYMeditor. If for some reason the checked out version is not working, you can
install a different version like so:

.. code-block:: shell-session

    $ svn export svn://svn.wymeditor.org/wymeditor/tags/0.4 vendor/plugins/wym_editor_helper/assets/wymeditor

To see what versions are available, check the repository browser at
http://files.wymeditor.org/wymeditor/. Keep in mind that if you check out a
newer version of WYM, you need to re-run the ``wym:install`` rake command to
actually copy the wym files to the public dir. If you do so, be sure to first
back up your configuration file (/javascripts/boot_wym.js) if you made any
changes to it.

Updates on this plugin will appear on
http://www.gorilla-webdesign.be/artikel/42-WYM+on+Rails
