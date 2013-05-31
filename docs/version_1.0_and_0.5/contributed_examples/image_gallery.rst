Image Gallery Implementation Example
====================================

The purpose of this page is to explain how an image gallery built with jQuery's
jCarousel plugin and based on data loaded via AJAX can be integrated into
WYMEditor. The example is built using `CodeIgniter
<http://www.codeigniter.com/>`_ (CI) for structure and queries. It uses a
series of JS includes in the image dialog, a CI controller function called via
AJAX, and a CI model function containing an active record query on an images
database. This example presupposes that you have a functioning install of
WYMEditor v0.4 and you are relatively familiar with hacking it. It also assumes
that you have the source files for and know how to implement an image gallery
based on jCarousel.  More information and source downloads for jCarousel can be
found here: http://sorgalla.com/jcarousel/

1. Including Plugin Code
------------------------

You will need to include 3 js files and 2 css files into the dialogs' HTML.
This is done by using the ``dialogHtml`` option, which makes up the outer shell
of the dialog boxes that are opened by the top buttons in WYMeditor. You will
need to change the paths here to match up with whatever your setup is:

.. code-block:: javascript

    $('.wymeditor').wymeditor({

      //options

      dialogHtml: "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN'"
        + " 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>"
        + "<html><head>"
        + "<link rel='stylesheet' type='text/css' media='screen'"
        + " href='"
        + WYM_CSS_PATH
        + "' />"
        + "<title>"
        + WYM_DIALOG_TITLE
        + "</title>"
        + "<script type='text/javascript'"
        + " src='"
        + WYM_JQUERY_PATH
        + "'></script>"
        + "<script type='text/javascript'"
        + " src='"
        + WYM_BASE_PATH
        + "jquery.wymeditor.js'></script>"
        + "<script type='text/javascript' src='/scripts/jquery.imager.js'></script>"
        + "<script type='text/javascript' src='/scripts/easing.js'></script>"
        + "<script type='text/javascript' src='/scripts/jquery.jcarousel.js'></script>"
        + "<link rel='stylesheet' type='text/css' href='/css/jquery.jcarousel.css' />"
        + "<link rel='stylesheet' type='text/css' href='/css/skins/tango/skin.css' />"
        + "<style type='text/css'>"
        + ".jcarousel-skin-tango.jcarousel-container-horizontal { width: 85%; }"
        + ".jcarousel-skin-tango .jcarousel-clip-horizontal { width: 100%; }"
        + "</style>"
        + "</head>"
        + WYM_DIALOG_BODY
        + "</html>",

      dialogImageHtml:  "<body class='wym_dialog wym_dialog_image'"
        + " onload='WYM_INIT_DIALOG(" + WYM_INDEX + ")'"
        + ">"
        + "<form>"
        + "<fieldset>"
        + "<legend>{Image}</legend>"
        + "<div class='row'>"
        + "<label>{URL}</label>"
        + "<input type='text' class='wym_src' value='' size='40' />"
        + "</div>"
        + "<div class='row'>"
        + "<label>{Alternative_Text}</label>"
        + "<input type='text' class='wym_alt' value='' size='40' />"
        + "</div>"
        + "<div class='row'>"
        + "<label>{Title}</label>"
        + "<input type='text' class='wym_title' value='' size='40' />"
        + "</div>"
        + "<div class='row row-indent'>"
        + "<input class='wym_submit' type='button'"
        + " value='{Submit}' />"
        + "<input class='wym_cancel' type='button'" 
        + "value='{Cancel}' />"
        + "</div>"
        + "</fieldset>"
        + "</form>"
        + "<div id='gallery'><h2>Loading images, please wait...</h2></div>"
        + "</body>"

      //other options

    });

.. note::
    Options specified when calling a new WYMEditor instance must be separated
    by commas. If you add in some other options to the example shown above, you
    will need to add a comma to the end of the dialogImageHtml assignment as
    well as all the rest of the new options except the last one.

jquery.js, easing.js, and jquery.jcarousel.js are all pre-built components that
can be downloaded from various sites - see the jCarousel link above.
jquery.imager.js is a custom script that will be built below.
jquery.jcarousel.css and skins/tango/skin.css are parts of jCarousel, please
refer to the jCarousel link above for more information. The header styles are
used to make jCarousel expand / contract based on the width of the dialog
window.

2. Adding Injection Target to Dialog Body
-----------------------------------------

OK, now all of our scripts should be in place. Upload the file, refresh your
WYMEditor install and open the image dialog; you should see all that stuff in
the head of the document. It's usually a good idea to copy the paths out of the
source here, paste them into another browser window, and make sure they open;
this is just to make sure you have the paths correct and all the files are in
the right place.

The next step is to add a target ``div`` to the image dialog body HTML. This
gives us a place to inject our dynamic image list a bit later once we have
built it with AJAX and PHP. In the ``dialogImageHtml`` string (around line 619)
add the following line:

.. code-block:: javascript

    + "<div id='gallery'><h2>Loading images, please wait...</h2></div>"

This line should go after the form but before the close body tag, like so:

.. code-block:: javascript

    + "</div>"
    + "</fieldset>"
    + "</form>"
    + "<div id='gallery'><h2>Loading images, please wait...</h2></div>"
    + "</body>",

Once this is in place, upload and refresh WYMEditor again, then re-open the
image dialog. You should now see a big fat "Loading images, please wait..."
message underneath the form. OK now its time for the slick stuff.

3. AJAX Call from Javascript
----------------------------

Make a new javascript file and save it as jquery.imager.js or whatever else you
want to call it; just make sure it's included in the dialog HTML. Paste the
following code into the js file:

.. code-block:: javascript

    // JavaScript Document

    var $j = jQuery.noConflict();

    $j(function() {
        //set up your AJAX call
        $.ajax({ 
          type: "POST", 
          url: "http://www.your-domain.com/controller/ajaxer", //path to your PHP function
          data: "img=test&stamp=now", 					//not required for this example, but you can POST data to your PHP function like this
          success: function(msg){ 						//trigger this code if the PHP function successfully returns data
            /*
                The PHP function needs to return an image UL with the following prototype:
                <ul id="mycarousel" class="jcarousel-skin-tango">
                    <li><img src='http://www.test.com/upload/titan.jpg' width='68' height='60' alt='Tennessee Titans Running Back Taken Christmas Eve 2006 At Ralph Wilson Stadium In Buffalo Ny - added  04:05 PM, 07/02/2007' title='titan' /></li>
                    <li><img src='http://www.test.com/upload/canyon.jpg' width='68' height='60' alt='Grand Canyon With Storm Clouds Viewed From South Western Edge - added  04:03 PM, 07/02/2007' title='nosebleed' /></li>
                    <li><img src='http://www.test.com/upload/img_2_big.jpg' width='68' height='60' alt='Another Chair From Fidm Museum - added  06:19 AM, 06/30/2007' title='chair' /></li>
                </ul>

                The returning HTML is contained in the msg variable.
            */

            //inject the image list into the target div with ID of "gallery"
            $("div#gallery").html(msg);

             //Once the list is in place we can create a new instance of jCarousel and point it at the image list
             //which has an ID of 'mycarousel'. For more information on these options see http://sorgalla.com/jcarousel/
            jQuery('#mycarousel').jcarousel({
                easing: 'backinout',
                visible: 5,
                animation: 500

            });

            //assign behaviors to the jCarousel thumbnails, triggered when they are clicked upon.
            $(".jcarousel-skin-tango img").click(function() {
                //$(this) is a reference to the thumbnail that got clicked
                $("input.wym_src").val($(this).attr('src'));		//inject the thumb's src attribute into the wym_src input
                $("input.wym_alt").val($(this).attr('alt'));		//inject the thumb's alt attribute into the wym_alt input
                $("input.wym_title").val($(this).attr('title'));	//inject the thumb's title attribute into the wym_title input

                //loop through all the images and remove their "on" states if it exists		
                $(".jcarousel-skin-tango img").each(function(i){
                  $(this).removeClass("on");
                });
                //add "on" state to the selected image
                $(this).addClass("on").fadeIn('slow');
            })
          }
        });
    });

Now you have a structure and behaviors for inserting your image code into the
dialog. Now all you need is some images!

4. Database Structure
---------------------

I have an images mySQL table with the following structure:

.. code-block:: mysql

    img_id  	    int(11)
    img_upload_date int(11)
    img_upload_by   int(11)
    img_name        varchar(64)
    img_file_name   varchar(64)
    img_size 	    float
    img_width 	    int(11)
    img_height 	    int(11)
    img_string 	    varchar(64)
    img_alt 	    varchar(255)

5. PHP / CodeIgniter Functions
------------------------------

Basically you can make an AJAX call to any PHP page that will return a list of
the images you want to display in the gallery. It can be connect to a database
or not; that's up to you. For my particular setup, I have a CI function in my
Content model called ``get_images()`` that returns either a list of all images
in the DB or a specific image if you send a valid ID. The model function goes
like this:

.. code-block:: php

    //ARGS: image ID (int) or -1 to get all images
    function get_images($img_id)
    {
        if($img_id != -1){ $this->db->where('img_id', $img_id); }
        $this->db->orderby('img_upload_date desc');
        $query = $this->db->get('tq_images');

        if($query->num_rows() > 0)
        {
            return $query->result_array();
        } else {
            return NULL;
        }
    }

This will return either one or many rows of the database, ordered by the date
the image was added, descending. If you send -1 as ``$img_id`` it will return
all images; if you send it a number it will return a specific row if it's a
valid ID. If the function can't find any rows based on what you sent it, it
will return NULL. If you need more information about codeigniter or model
functions see http://codeigniter.com/user_guide/.

6. Put it all Together
----------------------

Now you will make a controller function that is actually accessible via a
browser or AJAX call. Open a CI controller and insert the following function:

.. code-block:: php

    function ajaxer()
    {
        //pull in data from javascript AJAX call (not used for now)
        $img = $_POST['img'];
        $stamp = $_POST['stamp'];

        //call your model function
        $img = $this->Content->get_images(-1);
        //create a the return string. This is the structure for your jCarousel list.
        $lst = "<ul id='mycarousel' class='jcarousel-skin-tango'>\n";
        //loop through the images record set. This should be a list of all the images you want to display.
        foreach($img as $i)
        {
            //call a custom function in another model to format the date...you probly don't need this
            $date = $this->Page->get_date($i['img_upload_date']);
            //Build a list item for each image in the database. Insert values as needed.
            //This will produce an unordered list with the prototype specified in jquery.imager.js
            $lst .= "<li><img src='". base_url() . "upload/" . $i['img_file_name'] ."' width='68' height='60' alt='" . $i['img_alt'] . " - added " . $date . "'  title='" . $i['img_name'] . "'/></li>\n"; //$i['img_string']

        }
        //close the list
        $lst .= "</ul>\n";
        //return the list to the dialog
        echo $lst;
    }

And that's pretty much it. When you are setting up your AJAX call, its URL
attribute should be pointed at this controller function. ``ajaxer()`` will call
the model function outlined above then process the returned recordset into an
HTML list. Echoing out the list will return it to your Javascript code as the
``msg`` variable I mentioned above. You should already have code in place in
jquery.imager.js to handle the incoming data and inject it where it needs to
go. In that same script you have already specified click behaviors for each
thumbnail in the list. If you need more information about codeigniter or
controller functions see http://codeigniter.com/user_guide/.

7. Using it
-----------

Now upload everything and refresh WYMEditor. If you set everything up
correctly, you should see your jCarousel load in underneath the dialog form. If
you click on an image, you should see its values pop into the input boxes above
the carousel. Once you have the correct information in the boxes, hit "submit"
on the dialog as usual and WYMEditor should plop it into your piece. Repeat as
needed.

If you have any questions about specific technologies used above, see their
respective websites. If you have questions about my code, hit me up at
rhinocerous at gmail dot com.
