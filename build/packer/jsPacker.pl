#!perl
#jsPacker (July 2005)
#
use strict;
use Pack;
use vars qw($PROGNAME $VERSION
            $opt_h $opt_q $opt_v $opt_i $opt_o $opt_e $opt_f $opt_s);
use Getopt::Std;

$PROGNAME    = $0;
$VERSION     = '1.00b';

my $Description = 'A JavaScript Compressor/Obfuscator';
my $Version    = "v$VERSION\[p$Pack::VERSION-pm$Pack::PM_VERSION\]";

# "English" versions of settings
my %ENCODINGS = (0=>'None', 10=>'Decimal', 36=>'Normal', 62=>'Normal', 95=>'High-ascii');
my %SETTINGS  = (0=>'No', 1=>'Yes');

exit(0) if &main();
exit(1);

################
# Sub-routines #
################
# Main program
sub main {
  # Get command line options
  &getopts('hqvfsi:o:e:');
  $opt_h ||= 0;   # $opt_h shows usage and exits
  $opt_q ||= 0;   # $opt_q sets quiet mode (no stdout output)
  $opt_v ||= 0;   # $opt_v shows version and exits
  $opt_i ||= '';  # $opt_i is input file. Required!
  $opt_o ||= '';  # $opt_o is output file. If not set, use standard output
  $opt_e ||= 0;   # $opt_e encoding level (0,10,36,62,95)
  $opt_f ||= 0;   # $opt_f use fast decoding
  $opt_s ||= 0;   # $opt_x use special characters

  # Display help or version if requested
  if ($opt_h) {&usage("help")}
  if ($opt_v) {&usage("version")}

  # Constrain encoding level, fastdecoding and specialcharacters to allowed limits
  $opt_e = ($opt_e > 0) ? ($opt_e > 10) ? ($opt_e > 36) ? ($opt_e > 62) ? 95 : 62 : 36 : 10 : 0;
  $opt_f = ($opt_f) ? 1 : 0;
  $opt_s = ($opt_s) ? 1 : 0;

  # Do the job if an input file is specified
  if ($opt_i) {
    # Read the source script
    my $script = &readInputFile($opt_i);
    # Pack the source script
    my $packedscript = &Pack::pack($script,$opt_e, $opt_f, $opt_s);
    # Show what happened (if not in quiet mode)
    if (!$opt_q) {showJobDetails($opt_i, $opt_o, $opt_e, $opt_f,$opt_s,\$script,\$packedscript)}
    # Output the packed script
    if ($opt_o) {&writeOutputFile($opt_o,\$packedscript)} # to output file if specifed
      else {print "$packedscript"}                        # otherwise to STDOUT
  }
  else { # If no input file is specified, display help
    &usage();
  }
  return(1);
}

######################
sub showJobDetails { #
######################
# Show details of input/output files, settings and compression ratio
  my ($inputfile, $outputfile,
      $encoding, $fastdecode, $specialchars,
      $instringref, $outstringref) = @_;
  print "$PROGNAME $Version\n";
  print "\tSource file : ";
  print "\"$inputfile\"\n";
  print (($outputfile) ? ("\tOutput file : \"$outputfile\"\n") : ''); # Print only if output is going to a file
  print "\tSettings    : encoding=$ENCODINGS{$encoding} fastdecode=$SETTINGS{$fastdecode} specialchars=$SETTINGS{$specialchars}\n";
  print "\tCompression : " . &compressionRatio($instringref, $outstringref). "\n\n";

}

#####################
sub readInputFile { #
#####################
# Read content (source script) from input file
  my $filename = shift;
  open(FH, $filename) || die "Error!!! Problem opening input file \"$filename\"!\n";
  my @content = <FH>;
  close(FH);
  return join('',@content);
}

#######################
sub writeOutputFile { #
#######################
# Write content (packed script) to output file
  my ($filename,$refcontent) = @_;
  open(FH, ">$filename") || die "Error!!! Problem opening output file \"$filename\"\n";
  print(FH $$refcontent);
  close(FH);
}

########################
sub compressionRatio { #
########################
# Calculate the ratio of output string to input string
  my ($sref1,$sref2) = @_;
  my $ratio = (length($$sref2) / (length($$sref1)||1));
  $ratio = sprintf "%.2f", $ratio;
  return $ratio;
}

#############
sub usage { #
#############
# Inform user about usage, version and exit
  my $showusage = 0;
  my $showversion = 0;
  my $params = shift;
  if (defined $params) {
    if ($params eq "help") {$showusage = 1;}
      elsif ($params eq "version") {$showversion = 1;}
    else {$showusage = 1;}
  }
  else {$showversion = 1;}
  if ($showversion) {
    print<<EOT;

$PROGNAME $Version
  $Description
\tBased on "Packer.js" by Dean Edwards <http://dean.edwards.name/>
\tPorted to Perl by Rob Seiler, ELR Software Pty Ltd <http://www.elr.com.au>
\tCopyright 2005. License <http://creativecommons.org/licenses/LGPL/2.1/>
  Use "$PROGNAME -h" for options
EOT
  exit(1);
  }
  if ($showusage) {
    print<<EOT;

$PROGNAME $Version
  $Description
  Usage:
\t$PROGNAME -i inputfile [-o outputfile] [-eX] [-f] [-s] [-qvh]\n
\t-i  <inputfile>  (eg -i myscript.js)
\t-o  <outputfile> (eg -o myscript-p.js)
\t-eN <encoding>   [0=None 10=Numeric 62=Normal(alphanumeric) 95=High-ascii]
\t-f  <fast decode>
\t-s  <special characters>
\t-q  quiet mode
\t-v  version
\t-h  help

  Examples:
\t$PROGNAME -i myscript.js
\t$PROGNAME -i myscript.js -o packed.js
\t$PROGNAME -i myscript.js -o packed.js -e10 -f -s
\t$PROGNAME -i myscript.js -e95 -fsq > packed.js

EOT
  exit(1);
  }
}
