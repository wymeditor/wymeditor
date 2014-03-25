# There are some packages that phantomjs requires and I'm currently too lazy to
# script this via Chef
sudo apt-get install --yes --force-yes libfontconfig1 fontconfig libfontconfig1-dev libfreetype6-dev

# Set some environment variables so that the npm install works
export NODE_PATH=/usr/lib/nodejs:/usr/lib/node_modules:/usr/share/javascript;
export HOME=/home/vagrant;

# Clean up any failed phantomjs installs
rm -rf /tmp/phantomjs;

# Let's install the NPM requirements

# Install grunt-cli and bower as root so the commands are available everywhere
# Do this from the /tmp directory so we don't break file ownerships
sudo npm install -g grunt-cli@~0.1.9;
# Clean up the tmp directory we just created as root
sudo rm -rf /home/vagrant/tmp;

# Now install the actual WYMeditor requirements
cd /home/vagrant/wym;
npm install;

# Install the bower components
sudo -u vagrant node_modules/bower/bin/bower install;

# Add grunt-cli autocompletion
grep -q 'eval "$(grunt --completion=bash)"' /home/vagrant/.bashrc || echo 'eval "$(grunt --completion=bash)"' >> /home/vagrant/.bashrc

# Add bower autocompletion
grep -q 'source ~/.bower_autocomplete.sh' /home/vagrant/.bashrc || echo 'source ~/.bower_autocomplete.sh' >> /home/vagrant/.bashrc 
bower completion --allow-root > /home/vagrant/.bower_autocomplete.sh
