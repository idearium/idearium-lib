# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

require "json"

def fail_with_message(msg)
    fail Vagrant::Errors::VagrantError.new, msg
end

# Make sure we have the vagrant-hostmanager plugin. No point in going forward with out it.
if !(Vagrant.has_plugin?('vagrant-hostmanager'))
    fail_with_message "vagrant-hostmanager missing, please install the plugin with this command:\nvagrant plugin install vagrant-hostmanager\n"
end

# Load in external config
CONFIG_PATH = __dir__
config_file = File.join(CONFIG_PATH, 'vagrant.json')

if File.exists?(config_file)
  custom_config = JSON.parse(File.read(config_file))
else
  fail_with_message "#{config_file} was not found. Please set `CONFIG_PATH` in your Vagrantfile."
end

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

    # Dynamically determine the IP address of the VM.
    config.hostmanager.ip_resolver = proc do |vm|
        ip = ''
        if (vm.ssh_info && vm.ssh_info[:host])
            vm.communicate.execute("/bin/hostname -I | cut -d ' ' -f 2") do |_type, contents|
                ip = contents.split()[0]
            end
        end
        ip
    end

    # Every Vagrant virtual environment requires a box to build off of.
    config.vm.box = custom_config['box_path']
    config.vm.box_version = custom_config['box_version']

    # VM configuration for vmware_fusion
    config.vm.provider "vmware_fusion" do |v|
        v.vmx["memsize"] = custom_config["memory"]
        v.vmx["numvcpus"] = custom_config["cpus"]
        v.gui = false
    end

    # VM configuration for virtualbox
    config.vm.provider "virtualbox" do |v|

        v.memory = custom_config["memory"]
        v.cpus = custom_config["cpus"]
        v.gui = false

        # Make VirtualBox work like VMware and use the host's resolving as a DNS proxy in NAT mode
        # https://www.virtualbox.org/manual/ch09.html#nat_host_resolver_proxy
        v.customize ["modifyvm", :id, "--natdnshostresolver1", "on" ]

    end

    # define the hostname
    config.vm.hostname = custom_config["hostname"]

    # Setup hostmanager plugin.
    config.hostmanager.enabled = true
    config.hostmanager.manage_host = true
    config.hostmanager.aliases = %W(#{custom_config['hostAliases']})

    # Create a private network, which allows host-only access to the machine
    # using a specific IP.
    config.vm.network 'private_network', type: 'dhcp'

    # Create a public network, which generally matched to bridged network.
    # Bridged networks make the machine appear as another physical device on
    # your network.
    # config.vm.network "public_network"

    # If true, then any SSH connections made will enable agent forwarding.
    config.ssh.forward_agent = true

    # Share the folder between host and VM
    config.vm.synced_folder ".", "/vagrant"
    # config.vm.synced_folder ".", "/vagrant", type: 'nfs'

    # configuration step 1: setup environment variables
    config.vm.provision "shell", path: "vagrant/env.sh"

    # configuration step 2: install development dependencies
    config.vm.provision "shell", path: "vagrant/dependencies.sh"

end
