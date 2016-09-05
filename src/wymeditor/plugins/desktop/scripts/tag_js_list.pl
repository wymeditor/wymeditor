#
# Helper script associated with Desktop plugin for WYMeditor
# Copyright (c) 2011  Calvin Schwenzfeier
# Dual licensed under the MIT (MIT-license.txt)
# and GPL (GPL-license.txt) licenses.
#
# File Authors:
#      Calvin Schwenzfeier (calvin DOT schwenzfeier A~T gmail dotCOM)
#

use strict;
use warnings;

# Only load the needed sections of the Desktop JavaScript file.
open(my $FILE_FH, '<', '../jquery.wymeditor.desktop.js');
my @tags = ();
{
  my %in = ( tools => 0, );
  my $section_done = 0;
  while(my $line = <$FILE_FH>) {
    # Find the beginning of the .availableTools() method.
    if($line =~ m/\A\s*WYMeditor\..*?\.desktop\.availableTools\s*[=].*?\s*\z/i) {
      $in{tools} = 1;
    }
    # Find the end of any section.
    if($line =~ m/\A\s*return\s+available\w+\s*;\s*\z/i) {
      if($in{tools}) {
        $in{tools} = 0;
        $section_done++;
      }
    }
    # Bail if we have read all sections.
    if($section_done >= scalar(keys(%in))) { last; }
    # Parse out the tool name data we need.
    if($in{tools} && ($line =~ m/\A\s*(?:\/\*\s*\*\/)?\s*(([A-Z][a-z]+)[A-Za-z]*?)[:]\s*/)) {
      push @tags, [lc($2), $1];
    }
  }
}
close($FILE_FH);

open($FILE_FH, '>', 'tags.txt');
my %tag_data = ();
for(my $x = 0; $x < scalar(@tags); $x++) {
  my $name = $tags[$x][0];
  if((not exists $tag_data{$name}) || (not defined $tag_data{$name})) {
    $tag_data{$name} = [];
    print $FILE_FH "':${name}', ";  # Write out the data for the .validTags() method.
  }
  push @{$tag_data{$name}}, $tags[$x][1];
}
print $FILE_FH "\n\n";

# Write out the data for the .expandTag() method.
foreach my $tag (sort keys %tag_data) {
  print $FILE_FH "      case ':${tag}':\n" .
                 "          tagToolList = ['" . join("', '", @{$tag_data{$tag}}) . "'];\n" .
                 "          break;\n";
}
print $FILE_FH "\n";
close($FILE_FH);

# Copy the top section of the tags.txt file into the validTagStrings array of the
# Desktop .validTags() method.  Copy the bottom section into the switch()
# structure within the Desktop .expandTag() method.  Specifically: copy and
# paste into the section between the ':all' case and the default case
# (endpoint exclusive).

__END__

