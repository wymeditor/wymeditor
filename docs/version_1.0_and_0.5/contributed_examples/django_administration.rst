Integrate WYMeditor in Django Administration
============================================

I have managed to easily integrate WYMeditor into Django's administrative
interface.

Here is how I did it...

First I copied the wymeditor to my project's static-served files directory,
which in my case had an URL prefix of ``/site/media/``

There I put the ``wymeditor``, ``jquery`` and a special file
``admin_textarea.js``, that I have written myself consisting of:

.. code-block:: javascript

    $(document).ready(function() {
        $('head', document).append('<link rel="stylesheet" type="text/css" media="screen" href="/site/media/wymeditor/skins/default/screen.css" />');
        $("textarea").wymeditor({
            updateSelector: "input:submit",
            updateEvent:    "click"
        });
    });

This file instructs the browser to load an additional WYMeditor's CSS and to
convert each ``<textarea>`` HTML tag into a WYMeditor.

In each of the Django models that I whished to set WYMeditor for, I have added
the following ``js`` setting to the Admin section:

.. code-block:: python

    class ExampleModel(models.Model):
        text = models.TextField()     # each TextField will have WYM editing enabled
        class Admin:
             js = ('/site/media/jquery.js',
                   '/site/media/wymeditor/jquery.wymeditor.js',
                   '/site/media/admin_textarea.js')

That is it. If you wish to use WYM in your own Django app, just follow the
steps and replace the ``/site/media/...`` with whatever your static media
prefix is.

Using the filebrowser Application
---------------------------------

To integrate Wymeditor with the `Django filebrowser
<http://code.google.com/p/django-filebrowser/>`_, put the code below in a file,
set the ``fb_url`` variable to point to your filebrowser instance and add the
file to your Javascript headers:

.. code-block:: html

  <script type="text/javascript" src="/media/wymeditor/plugins/jquery.wymeditor.filebrowser.js"></script>

or in your admin.py:

.. code-block:: python

   class Media:
       js = ('/media/wymeditor/plugins/jquery.wymeditor.filebrowser.js',)

Add the ``postInitDialog`` parameter to the Wymeditor initialization:

.. code-block:: javascript

  $('textarea').wymeditor({
    postInitDialog: wymeditor_filebrowser
  });

If you already have a ``postInitDialog`` function, you need to put a call to
``wymeditor_filebrowser`` inside that function:

.. code-block:: javascript

  $('textarea').wymeditor({
    postInitDialog: function (wym, wdw) {
        // Your code here...

        // Filebrowser callback
        wymeditor_filebrowser(wym, wdw);
    }
  });

Then you should be able to click on the Filebrowser link to select an image.

Code:

.. code-block:: javascript

    wymeditor_filebrowser = function(wym, wdw) {
      // the URL to the Django filebrowser, depends on your URLconf
      var fb_url = '/admin/filebrowser/';

      var dlg = jQuery(wdw.document.body);
      if (dlg.hasClass('wym_dialog_image')) {
        // this is an image dialog
        dlg.find('.wym_src').css('width', '200px').attr('id', 'filebrowser')
          .after('<a id="fb_link" title="Filebrowser" href="#">Filebrowser</a>');
        dlg.find('fieldset')
          .append('<a id="link_filebrowser"><img id="image_filebrowser" /></a>' +
                  '<br /><span id="help_filebrowser"></span>');
        dlg.find('#fb_link')
          .click(function() {
            fb_window = wdw.open(fb_url + '?pop=1', 'filebrowser', 'height=600,width=840,resizable=yes,scrollbars=yes');
            fb_window.focus();
            return false;
          });
      }
    }
