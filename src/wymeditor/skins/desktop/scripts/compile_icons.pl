#
# Helper script associated with Desktop skin for WYMeditor
# Copyright (c) 2011  Calvin Schwenzfeier
# Dual licensed under the MIT (MIT-license.txt)
# and GPL (GPL-license.txt) licenses.
#
# File Authors:
#      Calvin Schwenzfeier (calvin DOT schwenzfeier A~T gmail dotCOM)
#

use Gimp::ScriptFu::Client;
{
  use Getopt::Long qw(GetOptions);
  use File::Spec;
  use File::Path qw(make_path);
  use File::Copy qw(copy);

  my $base_dir = undef;
  our $icon_width = 24;
  our $icon_height = 24;
  my $all_icons = 0;
  my $only_files = 0;
  my $only_css = 0;
  my $show_help = 0;
  my $success = GetOptions(
        # Base directory to use (defaults to one directory up from where
        # the script resides).
        "base=s" => \$base_dir,
        
        # Icon width (default 24).
        "width=i" => \$icon_width,
        
        # Icon height (default 24).
        "height=i" => \$icon_height,
        
        # Do not process icons as grouped, process all icons together.
        "all-icons-together!" => \$all_icons,
        
        # Oly copy the icon files to the .../groups/ directory structure.
        "only-files!" => \$only_files,
        
        # Only generates the CSS based on the images already in the
        # .../groups/ directory structure; bail before image generation.
        "only-css!" => \$only_css,
        
        # Display the command-line help, then exit.
        "help!" => \$show_help,
      );
  if( (not defined $base_dir) ||
      (not -e $base_dir) || (not -d $base_dir) ||
      (not -r $base_dir) || (not -w $base_dir) ) {
    $base_dir = File::Spec->rel2abs('..');
  }
  else {
    $base_dir = File::Spec->rel2abs($base_dir);
  }
  if( (not defined $base_dir) ||
      (not -e $base_dir) || (not -d $base_dir) ||
      (not -r $base_dir) || (not -w $base_dir) ) {
    $base_dir = File::Spec->rel2abs('..');
  }
  if($icon_width <= 0) {
    $icon_width = 24;
  }
  if($icon_height <= 0) {
    $icon_height = 24;
  }
  # Gimp requires all paths to use the '/' char (this is also why we are not
  # bothering with the full expressive power of File::Spec).
  $base_dir =~ s{[\\\/]}{/}g;
  if( (-e "${base_dir}/${icon_width}x${icon_height}") &&
      (-r "${base_dir}/${icon_width}x${icon_height}") ) {
    push @dirs, "${base_dir}/${icon_width}x${icon_height}";
  }
  if( (-e "${base_dir}/custom${icon_width}x${icon_height}") &&
      (-r "${base_dir}/custom${icon_width}x${icon_height}") ) {
    push @dirs, "${base_dir}/custom${icon_width}x${icon_height}";
  }
  if((not $success) || $show_help) {
    if(not $success) {
      print "\n" .
            "  Base Dir: '${base_dir}'\n" .
            "  Width: $icon_width\n" .
            "  Height: $icon_height\n" .
            "  Process all icons togeter: " . (($all_icons) ? "TRUE" : "FALSE") . "\n" .
            "  Only copy files: " . (($only_files) ? "TRUE" : "FALSE") . "\n" .
            "  Only generate CSS: " . (($only_css) ? "TRUE" : "FALSE") . "\n" .
            "  Show help: " . (($show_help) ? "TRUE" : "FALSE") . "\n" .
            "\n";
    }
    die "\n\n" .
        "  SYNTAX:  perl compile_icons.pl  [--base=\"{base_dir}\"]\n" .
        "                                  [--width={icon_pixel_width}]\n" .
        "                                  [--height={icon_pixel_height}]\n" .
        "                                  [--all-icons-together]\n" .
        "                                  [--only-files]\n" .
        "                                  [--only-css]\n" .
        "                                  [--help]\n" .
        "\n";
  }
  if(scalar(@dirs) < 1) {
    die "  ERROR: Neither the directory '.../${icon_width}x${icon_height}' nor" .
        " the directory '.../custom${icon_width}x${icon_height}' exists in the" .
        " base direcory '${base_dir}'! \n";
  }

  my @files = ();
  foreach my $dir (@dirs) {
    my $status = opendir(my $DIR_FH, $dir);
    next  if(not $status);
    my @temp = map { $dir . '/' . $_ }
               grep { $_ =~ m/\.png\s*\z/i }
               grep { $_ !~ m/\A\s*\.+/ } readdir($DIR_FH);
    push @files, @temp;
    closedir($DIR_FH);
  }

  @files = map { $_->[2] }
           # By sorting like this, it ensures custom icons will override
           # standard icons (because they are processed after the standard
           # icons).
           sort { ($a->[0] cmp $b->[0]) ||
                  ($a->[1] cmp $b->[1]) ||
                  ($a->[2] cmp $b->[2]) }
           map {$_ =~ m/[\\\/]((?:custom)?24x24)[\\\/]([^\\\/]+?\.png)\s*\z/i; [$1, $2, $_]; } @files;
  foreach my $file (@files) {
    my ($name) = ($file =~ m/[\\\/]([^\\\/]+?\.png)\s*\z/i);
    my ($type) = ($name =~ m/(.+)[\-][^\-]+?\.png\s*\z/i);
    if(not defined($type)) { $type = 'misc'; }
    if($type =~ m/\A\s*x-office(?:\b)/i) { $type = 'x-office'; }
    elsif($type =~ m/[\-]/) { $type = (split(/[\-]/, $type, 2))[0]; }
    if(($only_files) || (not $only_css)) {
      if($all_icons) {
        if((not -e "${base_dir}/groups/all_icons") || ((not -d "${base_dir}/groups/all_icons"))) {
          make_path("${base_dir}/groups/all_icons/");
        }
        copy($file, "${base_dir}/groups/all_icons/${name}");
      }
      else {
        if((not -e "${base_dir}/groups/${type}") || (not -d "${base_dir}/groups/${type}")) {
          make_path("${base_dir}/groups/${type}/");
        }
        copy($file, "${base_dir}/groups/${type}/${name}");
      }
    }
  }

  if($only_files && (not $only_css)) {
    die "  Done copying icon files to .../groups/ directory. \n";
  }

  my %tree = ();
  my @group_dirs = ( "${base_dir}/groups", );
  foreach my $dir (@group_dirs) {
    my $status = opendir(my $DIR_FH, $dir);
    next  if(not $status);
    my @temp = map { $dir . '/' . $_ }
               grep { $_ !~ m/\A\s*\.+/ } readdir($DIR_FH);
    my @f = ();
    if($all_icons) {
      @f = grep { (-f $_) && ($_ =~ m/\.png\s*\z/i) &&
                  ($_ =~ m/[\\\/]groups[\\\/]all_icons[\\\/]/i) } @temp;
    }
    else {
      @f = grep { (-f $_) && ($_ =~ m/\.png\s*\z/i) &&
                  ($_ !~ m/[\\\/]groups[\\\/]all_icons[\\\/]/i) } @temp;
    }
    my @d = grep { (-r $_) && (-d $_) } @temp;
    foreach (@f) {
      my ($type, $name) = ($_ =~ m/[\\\/]([^\\\/]+?)[\\\/]([^\\\/]+?\.png)\s*\z/i);
      if((not exists $tree{$type}) || (not defined $tree{$type})) { $tree{$type} = []; }
      push @{$tree{$type}}, $_;
    }
    push @group_dirs, @d;
  }

  @ARGV = ();
  foreach my $key (sort keys %tree) {
    my $clean_key = $key;
    $clean_key =~ s/\W/_/g;
    
    # Woo exciting stuff here... Build the CSS file.
    my $status = open(my $FILE_FH, '>', "${base_dir}/groups/${clean_key}_skin.css");
    if($status) {
      my $skin_name = "desktop_${clean_key}";
      my $header =
              "/*\n" .
              " * Desktop skin for WYMeditor : what you see is What You Mean web-based editor\n" .
              " * Copyright (c) 2011  Calvin Schwenzfeier\n" .
              " * Dual licensed under the MIT (MIT-license.txt)\n" .
              " * and GPL (GPL-license.txt) licenses.\n" .
              " *\n" .
              " * File Name:\n" .
              " *      ${clean_key}_skin.css\n" .
              " *      Stylesheet for the '${clean_key}' group of the Desktop WYMeditor skin.\n" .
              " *      See the documentation for more info.\n" .
              " *\n" .
              " *################################## WARNING ###################################\n" .
              " *##                                                                          ##\n" .
              " *##  This file is auto-generated by the .../scripts/compile.pl Perl script!  ##\n" .
              " *##                                                                          ##\n" .
              " *##############################################################################\n" .
              " *\n" .
              " * File Authors:\n" .
              " *      Calvin Schwenzfeier (calvin DOT schwenzfeier A~T gmail dotCOM)\n" .
              " */\n" .
              "\n";
      my $css_before =
              '/*TRYING TO RESET STYLES THAT MAY INTERFERE WITH WYMEDITOR*/' . "\n" .
              '        .wym_skin_[~SkinName~] p, .wym_skin_[~SkinName~] h2, .wym_skin_[~SkinName~] h3,' . "\n" .
              '        .wym_skin_[~SkinName~] ul, .wym_skin_[~SkinName~] li { background: transparent url(); margin: 0; padding: 0; border-width:0; list-style: none; }' . "\n" .
              "\n\n" .
              '/*HIDDEN BY DEFAULT*/' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_area_left     { display: none; }' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_area_right    { display: block; }' . "\n" .
              "\n\n" .
              '/*TYPO*/    ' . "\n" .
              '        .wym_skin_[~SkinName~]       { font-size: 62.5%; font-family: Verdana, Arial, sans-serif; }' . "\n" .
              '        .wym_skin_[~SkinName~] h2    { font-size: 110%; /* = 11px */}' . "\n" .
              '        .wym_skin_[~SkinName~] h3    { font-size: 100%; /* = 10px */}' . "\n" .
              '        .wym_skin_[~SkinName~] li    { font-size: 100%; /* = 10px */}' . "\n" .
              "\n\n" .
              '/*WYM_BOX*/' . "\n" .
              '        .wym_skin_[~SkinName~]          { border: 1px solid gray; background: #f2f2f2; padding: 5px}' . "\n" .
              '' . "\n" .
              '    /*auto-clear the wym_box*/' . "\n" .
              '        .wym_skin_[~SkinName~]:after    { content: "."; display: block; height: 0; clear: both; visibility: hidden; }' . "\n" .
              ' * html .wym_skin_[~SkinName~]          { height: 1%;}' . "\n" .
              '' . "\n" .
              '' . "\n" .
              '/*WYM_HTML*/' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_html             { width: 98%;}' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_html textarea    { width: 100%; height: 200px; border: 1px solid gray; background: white;  }' . "\n" .
              '' . "\n" .
              '' . "\n" .
              '/*WYM_IFRAME*/' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_iframe           { width: 98%;}' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_iframe iframe    { width: 100%; height: 200px; border: 1px solid gray; background: white }' . "\n" .
              '' . "\n" .
              '' . "\n" .
              '/*AREAS*/' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_area_left      { width: 150px; float: left;}' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_area_right     { width: 150px; float: right;}' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_area_bottom    { height: 1%; clear: both;}' . "\n" .
              ' * html .wym_skin_[~SkinName~] .wym_area_main      { height: 1%;}' . "\n" .
              ' * html .wym_skin_[~SkinName~] .wym_area_top       { height: 1%;}' . "\n" .
              ' *+html .wym_skin_[~SkinName~] .wym_area_top       { height: 1%;}' . "\n" .
              '' . "\n" .
              '/*SECTIONS SYSTEM*/' . "\n" .
              '' . "\n" .
              '    /*common defaults for all sections*/' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_section            { margin-bottom: 5px; }' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_section h2,' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_section h3         { padding: 1px 3px; margin: 0; }' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_section a          { padding: 0 3px; display: block; text-decoration: none; color: black; }' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_section a:hover    { background-color: yellow; }' . "\n" .
              '      /*hide section titles by default*/' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_section h2         { display: none; }' . "\n" .
              '      /*disable any margin-collapse*/' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_section            { padding-top: 1px; padding-bottom: 1px; }    ' . "\n" .
              '      /*auto-clear sections*/' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_section ul:after   { content: "."; display: block; height: 0; clear: both; visibility: hidden; }' . "\n" .
              ' * html .wym_skin_[~SkinName~] .wym_section ul         { height: 1%;}' . "\n" .
              '' . "\n" .
              '    /*option: add this class to a section to make it render as a panel*/' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_panel       { }' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_panel h2    { display: block; }' . "\n" .
              '' . "\n" .
              '    /*option: add this class to a section to make it render as a dropdown menu*/' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_dropdown h2    { display: block; }' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_dropdown ul    { display: none; position: absolute; background: white; }' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_dropdown:hover ul,' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_dropdown.hover ul  { display: block; }' . "\n";
      $css_before =~ s/\[~SkinName~\]/$skin_name/g;

      my $css_button =
              "    /*option: add this class to a section to make its elements render buttons (icons are only available for the wym_tools section for now)*/\n" .
              "        .wym_skin_[~SkinName~] .wym_buttons li      { float:left;}\n" .
              "        .wym_skin_[~SkinName~] .wym_buttons a       { width: 20px; height: 20px; overflow: hidden; padding: 2px }\n" .
              "      /*image replacements*/\n" .
              "        .wym_skin_[~SkinName~] .wym_buttons li a    { background: url(${clean_key}_icons.png) no-repeat; text-indent: -9999px;}\n";
      $css_button =~ s/\[~SkinName~\]/$skin_name/g;

      my $button_line = "        .wym_skin_[~SkinName~] .wym_buttons li.wym_tools_[~ToolName~] a    { background-position: 0 [~ToolPos~]px;}\n";
      $button_line =~ s/\[~SkinName~\]/$skin_name/g;
      my $counter = 0;
      foreach my $tool (@{$tree{$key}}) {
        my ($clean_tool) = ($tool =~ m/[\\\/]([^\\\/]+?)\.png\s*\z/i);
        $clean_tool =~ s/\W/_/g;
        my $tool_pos = 0 - ($counter * $icon_height);
        my $new_button_line = $button_line;
        $new_button_line =~ s/\[~ToolName~\]/$clean_tool/g;
        $new_button_line =~ s/\[~ToolPos~\]/$tool_pos/g;
        $css_button .= $new_button_line;
        $counter++;
      }
      $css_button .= "        \n";

      my $css_after =
              '/*DECORATION*/' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_section h2         { background: #ddd; border: solid gray; border-width: 0 0 1px;}' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_section h2 span    { color: gray;}' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_panel       { padding: 0; border: solid gray; border-width: 1px; background: white;}    ' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_panel ul    { margin: 2px 0 5px; }        ' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_dropdown       { padding: 0; border: solid gray; border-width: 1px 1px 0 1px; }' . "\n" .
              '        .wym_skin_[~SkinName~] .wym_dropdown ul    { border: solid gray; border-width: 0 1px 1px 1px; margin-left: -1px; padding: 5px 10px 5px 3px;}' . "\n" .
              '        ' . "\n" .
              '/*DIALOGS*/' . "\n" .
              '        .wym_dialog div.row         { margin-bottom: 5px;}' . "\n" .
              '        .wym_dialog div.row input   { margin-right: 5px;}' . "\n" .
              '        .wym_dialog div.row label   { float: left; width: 120px; display: block; text-align: right; margin-right: 10px; }' . "\n" .
              '        .wym_dialog div.row-indent  { padding-left: 160px; }' . "\n" .
              '        /*autoclearing*/        ' . "\n" .
              '        .wym_dialog div.row:after         { content: "."; display: block; height: 0; clear: both; visibility: hidden; }' . "\n" .
              '        .wym_dialog div.row               { display: inline-block; }' . "\n" .
              '            /* Hides from IE-mac \*/' . "\n" .
              '            * html .wym_dialog div.row    { height: 1%; }' . "\n" .
              '            .wym_dialog div.row           { display: block; }' . "\n" .
              '            /* End hide from IE-mac */                ' . "\n" .
              '            ' . "\n" .
              '/*WYMEDITOR_LINK*/' . "\n" .
              '        a.wym_wymeditor_link    { text-indent: -9999px; float: right; display: block; width: 50px; height: 15px; background: url(../wymeditor_icon.png); overflow: hidden; text-decoration: none; }' . "\n" .
              '        a.wym_desktop_link    { text-indent: -9999px; float: right; display: block; width: 24px; height: 24px; background: url(desktop_logo.png); overflow: hidden; text-decoration: none; }' . "\n" .
              "\n";
      $css_after =~ s/\[~SkinName~\]/$skin_name/g;
      print $FILE_FH $header . $css_before . $css_button . $css_after;
      close($FILE_FH);
    }
    unshift(@{$tree{$key}}, [$icon_width, $icon_height * scalar(@{$tree{$key}})]);
    unshift(@{$tree{$key}}, "${base_dir}/groups/${clean_key}_icons.png");
    push @ARGV, $tree{$key};
  }

  if($only_css) {
    die "  Done processing CSS. \n";
  }

  '';
}

(begin
  (let ( (argv '()) (argc 0) )
    (set! argv '{sexp_from_list(@ARGV)})  ; get the structured list of icons from the Perl section
    (set! argc {scalar(@ARGV)})
    ; The icons parameter to the icon-strip function should be in the format:
    ;       (outFile (outWidth outHeight) file1 file2 file3 ...)
    (define (icon-strip icons)
      (let* ( (outFile (car icons))
              (icons (cdr icons))
              (size (car icons))
              (iconFiles (cdr icons))
              (outWidth (car size))
              (outHeight (cdr size))
              (outHeight (car outHeight))
              (outImage (car (gimp-image-new outWidth outHeight RGB)))
              (outImageDrawable 0)  ; this value only exists for outImage after we add a layer to the image
              (outImageLayer (car (gimp-layer-new outImage outWidth outHeight RGBA-IMAGE "Layer 1" 100 NORMAL-MODE)))
              (outImageDisplay 0)  ; this value only exists for outImage after we call gimp-display-new
            )
        (gimp-image-add-layer outImage outImageLayer 0)
        (set! outImageDrawable (car (gimp-image-get-active-drawable outImage)))
        (set! outImageDisplay (car (gimp-display-new outImage)))
        (gimp-context-set-background '(255 255 255))  ; set background to white
        (gimp-context-set-foreground '(0 0 0))  ; set foreground to black
        (gimp-drawable-fill outImageLayer BACKGROUND-FILL)
        (gimp-drawable-fill outImageLayer TRANSPARENT-FILL)
        (gimp-displays-flush)
        (let* ( (count (/ outHeight {$icon_height}))
                (yOffset 0)
              )
          (while (> count 0)
            (let* ( (inFile (car iconFiles))
                    (inImage (car (file-png-load FALSE inFile inFile)))
                    (inImageDrawable (car (gimp-image-get-active-drawable inImage)))
                    (inImageDisplay (car (gimp-display-new inImage)))
                  )
              ; select where we want to place the current icon in this icon strip
              (gimp-rect-select outImage 0 yOffset {$icon_width} {$icon_height} CHANNEL-OP-REPLACE FALSE 0)
              (gimp-selection-all inImage)  ; copy the current icon
              (gimp-displays-flush)
              (gimp-edit-copy inImageDrawable)
              (gimp-edit-paste outImageDrawable TRUE)  ; paste the current icon into this icon strip
              (gimp-displays-flush)
              (gimp-floating-sel-anchor (car (gimp-image-get-floating-sel outImage)))
              (gimp-selection-none inImage)
              (gimp-displays-flush)
              (gimp-display-delete inImageDisplay)  ; close the current icon
              (gimp-selection-none outImage)  ; reset for next icon
              (gimp-displays-flush)
            )
            ;
            (set! yOffset (+ yOffset {$icon_height}))
            (set! iconFiles (cdr iconFiles))
            (set! count (- count 1))
          )
          (gimp-displays-flush)
          (file-png-save2 TRUE  ; run-mode (TRUE=Interactive; FALSE=Non-interactive)
                          outImage  ; image
                          outImageDrawable  ; drawable
                          outFile  ; filename
                          outFile  ; raw-filename
                          TRUE     ; interlace (Use Adam7 interlacing?)
                          9        ; compression (Deflate compression factor, 0 to 9)
                          TRUE     ; bkgd (Save background color?)
                          TRUE     ; gama (Save gamma?)
                          FALSE    ; offs (Save layer offset?)
                          TRUE     ; phys (Save resolution?)
                          FALSE    ; time (Save creation time?)
                          FALSE    ; comment (Save comment?)
                          TRUE )   ; svtrans (Save color values from transparent pixels?)
        )
        (gimp-display-delete outImageDisplay)  ; close the current icon strip
        (gimp-displays-flush)
      )
    )
    ; loop through the structured list of icons we created in the Perl section
    (while (> argc 0)
      (let* ( (setOfIcons (car argv))
            )
        (icon-strip setOfIcons)
      )
      (set! argv (cdr argv))
      (set! argc (- argc 1))
    )
  )
)

