# Suggested various boxes http://www.vagrantbox.es/

$setup = <<SCRIPT
echo "Stopping and removing existing containers"
# Stop and remove any existing containers
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

echo "Building from Dockerfiles"
# Build containers from Dockerfiles
docker build -t longieirl/mongodb /var/local/build/mongo

echo "Running & linking containers"
# Run and link the containers
docker run -itd -p 27017:27017 --name mongodb -v /var/app/mongodb/:/data/db --detach --publish-all longieirl/mongodb

SCRIPT

# Commands required to ensure correct docker containers are started when the vm is rebooted.
$start = <<SCRIPT
docker start mongodb
SCRIPT

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure("2") do |config|

# Require a recent version of vagrant otherwise some have reported errors setting host names on boxes
Vagrant.require_version ">= 1.7.2"

	# Expose Mongodb database settings
    config.vm.network "forwarded_port", guest: 27017, host: 27017
    config.vm.network "forwarded_port", guest: 28017, host: 28017

    # Ubuntu
    config.vm.box = "ubuntu-14.04-amd64"
    config.vm.box_url = "https://github.com/jose-lpa/packer-ubuntu_14.04/releases/download/v2.0/ubuntu-14.04.box"
    config.vm.synced_folder ".", "/var/local/build" #, type: "nfs"

    # Install latest docker
    config.vm.provision "docker"

    # Setup the containers when the VM is first created
    # Note: Windows OS complains about resolving host files, add 'run: "always"' to this line rather than destroying the VM image
    config.vm.provision "shell", inline: $setup

    # Make sure the correct containers are running
    # every time we start the VM.
    config.vm.provision "shell", run: "always", inline: $start

end