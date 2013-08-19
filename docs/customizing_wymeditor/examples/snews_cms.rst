Integrate WYMeditor into sNews CMS
==================================

This page explains step by step how to integrate WYMeditor version 0.4 into
sNews version 1.6. sNews is a light and open source Content Management System.
All information about sNews is available on its `official site <http://www.snewscms.com/>`_.

Since sNews already includes an editor, some hacks are mandatory in order to
replace the default editor with WYMeditor. These hacks are all listed below.
Fortunately, in order to avoid you these tedious code modifications, a
ready-to-run `archive file
<http://trac.wymeditor.org/trac/raw-attachment/wiki/Contrib/IntegrateIntosNews/sNews16-WYMeditor04.tar.tar>`_
has been prepared.  Unarchive this file and install sNews according to
readme.html before to run it. Hacks made inside sNews have all been enclosed
between tags [WYMeditor Hack] for allowing you to easily retreive them.

Install sNews
-------------

**Download** archive file `sNews16.zip
<http://www.snewscms.com/download/sNews16.zip>`_

**Unarchive** sNews16.zip under your Web space and follow the install
instructions contained into readme.html.

Install WYMeditor
-----------------

**Download** archive file `wymeditor-0.4.tar.gz
<http://sourceforge.net/project/showfiles.php?group_id=148869>`_

**Unarchive** wymeditor-0.4.tar.gz into a temporary directory and move
directories 'jquery' and 'wymeditor' into 'sNews' root directory

Integrate WYMeditor
-------------------

All the following code modifications must be made in **snews.php**.

**Replace** line 325

.. code-block:: php

    if ($_SESSION[db('website').'Logged_In'] == token()) {js();}

with

.. code-block:: php

        if ($_SESSION[db('website').'Logged_In'] == token()) {js();
            echo
    '   <link rel="stylesheet" type="text/css" media="screen" href="wymeditor/skins/default/screen.css" />
        <script type="text/javascript" src="jquery/jquery.js"></script>
        <script type="text/javascript" src="wymeditor/jquery.wymeditor.js"></script>
        <script type="text/javascript">
            jQuery(function() {
                jQuery(".wymeditor").wymeditor({
                    cssPath: "'.db('website').'wymeditor/skins/default/screen.css",
                    jQueryPath: "'.db('website').'jquery/jquery.js",
                    wymPath: "'.db('website').'wymeditor/jquery.wymeditor.js"
                });
            });
        </script>';
        }

This code loads WYMeditor with its default skin and initializes WYMeditor with
correct paths.

**Replace** line 1048

.. code-block:: php

    case 'textarea': $output = '<p>'.$lbl.':<br /><textarea name="'.$name.'" rows="'.$rows.'" cols="'.$cols.'"'.$attribs.'>'.$value.'</textarea></p>'; break;

with

.. code-block:: php

    case 'textarea':
        if ($_SESSION[db('website').'Logged_In'] == token()) {
            $output = '<p>'.$lbl.':<br /><textarea class="wymeditor" name="'.$name.'" rows="'.$rows.'" cols="'.$cols.'"'.$attribs.'>'.$value.'</textarea></p>'; break;
        } else {
            $output = '<p>'.$lbl.':<br /><textarea name="'.$name.'" rows="'.$rows.'" cols="'.$cols.'"'.$attribs.'>'.$value.'</textarea></p>'; break;
        }
        break;

This code allows WYMeditor to replace the 'textarea' block with a WYMeditor
instance.

**Comment** from line 1312

.. code-block:: php

    /*  echo '<p>';

to line 1322

.. code-block:: php

    echo '</p>';*/[/code]

This code disables the default editor toolbar.

**Replace** line 1327

.. code-block:: php

    echo html_input('fieldset', '', '', '', '', '', '', '', '', '', '', '', '', '', '<a title="'.l('customize').'" onclick="toggle(\'preview\')" style="cursor: pointer;">'.l('preview').'</a>');

with

.. code-block:: php

    if ($_SESSION[db('website').'Logged_In'] == token()) {
        echo html_input('fieldset', '', '', '', '', '', '', '', '', '', '', '', '', '', '<a title="'.l('customize').'" class="wymupdate" onclick="toggle(\'preview\')" style="cursor: pointer;">'.l('preview').'</a>');
    } else {
        echo html_input('fieldset', '', '', '', '', '', '', '', '', '', '', '', '', '', '<a title="'.l('customize').'" onclick="toggle(\'preview\')" style="cursor: pointer;">'.l('preview').'</a>');
    }

This code allows the edited article to be correctly previewed by sNews each
time the sNews preview button is clicked.

**Replace** line 1393

.. code-block:: php

    echo html_input('submit', $frm_task, $frm_task, $frm_submit, '', 'button', '', '', '', '', '', '', '', '', '');

with

.. code-block:: php

    echo html_input('submit', $frm_task, $frm_task, $frm_submit, '', 'wymupdate', '', '', '', '', '', '', '', '', '');

This code allows the edited article to be correctly saved when the sNews save
button is clicked.

That's all, sNews should now run WYMeditor instead of its default editor. If
you experiment problems in running or using WYMeditor inside sNews, you are
invited to read `this topic
<http://forum.wymeditor.org/forum/viewtopic.php?t=175>`_ on the WYMeditor forum
or `this one <http://snewscms.com/forum/index.php?topic=5865.0>`_ on the sNews
forum. If you don't find the answer to your problem, feel free to post a new
message.
