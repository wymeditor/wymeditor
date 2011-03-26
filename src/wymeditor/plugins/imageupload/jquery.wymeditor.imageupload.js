/*
 This is a simple-to-use image upload plugin for WYMeditor. It allows uploading the iamges and floating them 
 to the left or right (inside a single block container).

 To make this plugin work, you must:
 1) include <script type="text/javascript" src="plugins/imageupload/jquery.wymeditor.imageupload.js"></script>
 2) in postInit(), call: wym.imageupload_init('/path/to/your/upload/script.php', 'uploadedimage');
    (the uploaded file will then be available to your script.php in $_FILES['uploadedimage'])
 3) make an upload script (not necessarily PHP), which should:
     1) validate (extensions, size,...), resize, watermark, save the image
     2) return this HTML:
	<html>
	<head><title></title></head>
	<body>
	<script language="JavaScript" type="text/javascript">
		<!-- <![CDATA[
		
		var wym_instance=0; // get it from $_REQUEST['wymindex']!
		var url='http://www.example.org/path/to/newly/uploaded/image.png';
		
		window.opener.WYMeditor.INSTANCES[wym_instance].imageinsert(url);
		window.close();
		// ]]> -->
	</script>
	</body>
	</html>
  (if the upload has failed for some reason you could put a link to some error image in "url" variable)
  
  4) include these CSS rules in the page where you want to display the entered html:
div.wym p:after, div.wym h1:after, div.wym h2:after, div.wym h3:after { content: "."; display: block; height: 0; clear: both; visibility: hidden;}
div.wym p, div.wym h1, div.wym h2, div.wym h3 { clear: both; margin-bottom: 10px; margin-top: 0px;}
div.wym img.floatleft { float: left; margin: 3px 10px 5px 0px; }
div.wym img.floatright { float: right !important; margin: 3px 0px 5px 10px; }

  (assumption is that all the text is included inside <div class="wym">...</div> - make them fit your needs!)
  
  These CSS rules make sure that:
  - images are floated to the left/right (note: every image has 'floatleft' CSS class, but only those that have 'floatright' too are floated to the right)
  - text in block containers that follow the images doesn't flow around them

  

 */


window.jQuery && (function($) {

       $.extend(WYMeditor.editor.prototype, {
          // Function to be called for initialisation in the skin init, or in postInit
           imageupload_init: function(imageUploadUrl, imageFormName) {

		   var html =  '<body><div class="wym_dialog_not">'
                        + '<form action="'+imageUploadUrl+'" method="post" enctype="multipart/form-data">'
						+ "<fieldset>"
						+ "<legend>{Upload_Image}</legend>"
						+ '<input type="hidden" name="wymindex" value="'+WYMeditor.INDEX+'"/>'

						+ "<div class='row'>"
						+ "<label>{Image}</label><br />"
						+ '<input type="file" name="'+imageFormName+'"/>'
						+ "</div>"

						+ "<div class='row'>"
						+ "<label>{Alignment}</label><br />"
						+ '<input type="radio" name="align" value="left" checked="checked" />{Align_Left}<br />'
						+ '<input type="radio" name="align" value="right" />{Align_Right}<br /><br />'
						+ "</div>"

						+ '<input type="submit" value="OK"/>'
						+ "</fieldset>"
						+ '</form>'
						+ '</div></body>';

             var dialog = (function(wym) {
                return function() {
                   wym.dialog('Upload_Image', '', html);
                   return false;
                };
             })(this);

             // Insert a button for uploading images:
             jQuery(this._box)
                .find('.wym_tools ul')
                   .append(
                      jQuery(
                            "<li class='wym_tools_imageupload'>"
                              + "<a name='Image' title='Image' href='#'"
                              + ' style="background: transparent url(' + this._options.skinPath +'icons.png) no-repeat scroll 0 -121px; margin-left: 20px;">'
                              + "Image"
                              + "</a></li>"
                      )
                      .click(dialog)
                   );
             // Insert the buttons for aligning images left and right:
             var alignImageLeft = (function(wym) {
                return function() {
   			       if (wym._selected_image)
			       {
					  var container = wym._selected_image;
					  // css class 'floatleft' is always set. We just toggle 'floatright'
					  jQuery(container).removeClass('floatright');
				   }
				   return false;
				}
             })(this);
             var alignImageRight = (function(wym) {
                return function() {
   			       if (wym._selected_image)
			       {
					  var container = wym._selected_image;
					  // css class 'floatleft' is always set. We just toggle 'floatright'
					  jQuery(container).addClass('floatright');
				   }
				   return false;
				}
             })(this);

             jQuery(this._box)
                .find('.wym_tools ul')
                   .append(
                      jQuery(
                            "<li class='wym_tools_imagealign'>"
                              + "<a name='ImageLeft' title='Image align left' href='#'"
//                              + ' style="background: transparent url(' + this._options.skinPath +'icons.png) no-repeat scroll 0 -121px">'
                              + ' style="background: transparent url(' + this._options.basePath +'plugins/imageupload/icons.png) no-repeat scroll 0 0px">'
                              + "Image align left"
                              + "</a></li>"
                      )
                      .click(alignImageLeft)
                   ).append(
                      jQuery(
                            "<li class='wym_tools_imagealign'>"
                              + "<a name='ImageLeft' title='Image align left' href='#'"
//                              + ' style="background: transparent url(' + this._options.skinPath +'icons.png) no-repeat scroll 0 -121px">'
                              + ' style="background: transparent url(' + this._options.basePath +'plugins/imageupload/icons.png) no-repeat scroll 0 -24px">'
                              + "Image align left"
                              + "</a></li>"
                      )
                      .click(function(ev) {
						  ev.preventDefault();
						  alignImageRight();
					  })
                   );

		    // now take care of all the CSS styles we need:
			var css= // clear floats in modern browsers:
			    'p:after, h1:after, h2:after, h3:after { content: "."; display: block; height: 0; clear: both; visibility: hidden;}\n'+
			    // clear floats in IE too:
			    'p, h1, h2, h3 { clear: both; }\n'+
			    // every image should float to left by default:
			    'img { float: left; width: auto !important; height: auto !important;}\n'+
			    // .floatright should float to right:
			    'img.floatright { float: right !important; width: auto !important; height: auto !important; }';
			$(this._doc).find('head').append($("<style type='text/css'> "+css+" </style>"));
	      },
		  imageinsert: function(url, align) {
		    var container = this.selected();
			var sData='<img src="'+url+'" alt="" class="floatleft'+((align=='right')?(' floatright'):(''))+'" />';

			if(container && container.tagName.toLowerCase() != WYMeditor.BODY) {
				// inside <p>:
				jQuery(container).prepend(sData);
			} else {
		        jQuery(w._doc.body).append('<p>'+sData+'  </p>');
			}
		  }

       });
    })(window.jQuery);
