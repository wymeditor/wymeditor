#
# Helper script associated with Desktop skin for WYMeditor
# Copyright (c) 2011  Calvin Schwenzfeier
# Dual licensed under the MIT (MIT-license.txt)
# and GPL (GPL-license.txt) licenses.
#
# File Authors:
#      Calvin Schwenzfeier (calvin DOT schwenzfeier A~T gmail dotCOM)
#

use strict;
use warnings;

open(my $FILE_FH, '<', '../skin.css');
my @data = <$FILE_FH>;
close($FILE_FH);

# Grab the button class data from the CSS file.
@data = map { s/\A\s*.*?\s+li\.wym_tools_([A-Za-z0-9_]+)\s+a\s+.*?\s*\z/$1/i; $_; }
        grep { $_ =~ m/\A\s*.*?\s+li\.wym_tools_(?:[A-Za-z0-9_]+)\s+a\s+.*?\s*\z/i }
        map { s/\A\s+//; s/\s+\z//; $_; } @data;

# Define our boundary conditions.
my $bounds_RE = qr/(?:^[Xx][_]+|[_]+[Xx][_]+|[_]+)/;

# Break up, mangle, and reform our data into something approximating
# vaild JavaScript.
@data = map { my $css = 'wym_tools_' . $_;
              my @t = split(/$bounds_RE/, $_);
              if(scalar(@t) >= 2) { shift(@t); }
              if((scalar(@t) >= 2) && ($t[0] =~ m/\A\s*Office\s*\z/i)) { shift(@t); }
              if((scalar(@t) == 1) && ($t[0] =~ m/\A\s*Blank\s*\z/i)) { $t[0] = ''; }
              my $title = join('_', map { ucfirst($_); } @t);
              $_ = join('', map { ucfirst($_); } split(/$bounds_RE/, $_));
              '        ' . $_ . ': { title: \'' . $title . '\', css: \'' . $css . '\' },';
            } @data;
$data[$#data] =~ s/,\s*\z//;

open($FILE_FH, '>', 'tools.txt');
print $FILE_FH join("\n", @data) . "\n\n";
close($FILE_FH);

# Copy the contents of tools.txt into the availableToolsHash variable within the
# Desktop .availableTools() method.  BE CAREFUL TO MARK ("/* */") THE TOOLS
# WHICH HAVE HAND-WRITTEN DEFAULT CODE.

__END__

