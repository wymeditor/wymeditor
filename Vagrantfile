Vagrant.require_plugin "vagrant-omnibus"
Vagrant.require_plugin "vagrant-librarian-chef"

Vagrant.configure("2") do |config|
  # All Vagrant configuration is done here. For a detailed explanation
  # and listing of configuration options, please view the documentation
  # online.

  # Every Vagrant virtual environment requires a box to build off of.
  config.vm.box = "precise32"
  config.vm.box_url = "http://files.vagrantup.com/precise32.box"
  config.ssh.forward_agent = true

  config.omnibus.chef_version = "10.14.2"

  config.vm.provider "virtualbox" do |v|
    max_cpus = `grep -c processor /proc/cpuinfo`.to_i.to_s
    cpus = max_cpus
    if ENV['VAGRANT_VBOX_CPU_MAX'].nil?
        cpus = ENV['VAGRANT_VBOX_CPU']
    end
    v.customize [
        "modifyvm", :id,
        "--memory", ENV['VAGRANT_VBOX_MEMORY'] || "2048",
        "--cpus", cpus || "2",
        "--vram", "32",
    ]
  end

  config.vm.synced_folder "", "/home/vagrant/wym", :nfs => true
  # For the test server
  config.vm.network :forwarded_port, guest: 9000, host: 9000
  # For live reload
  config.vm.network :forwarded_port, guest: 35729, host: 35729
  config.vm.network :private_network, ip: "10.10.10.132"

  config.librarian_chef.cheffile_dir = "chef"

  config.vm.provision :chef_solo do |chef|
    chef.cookbooks_path = "chef/cookbooks"
    chef.add_recipe "build-essential"
    chef.add_recipe "git"
    chef.add_recipe "nodejs::install_from_package"
  end
  config.vm.provision :shell do |s|
    s.path = "vagrant_provision.sh"
  end



end

