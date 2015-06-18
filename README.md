# Deploying Docker VM's to AWS using Elastic Beanstalk
# Corporate proxy is not configured as part of these configurations - as these VM's are being pushed to docker.io to be consumed by the AWS

### Notes 
* AWS Console
https://eu-west-1.console.aws.amazon.com/console/home?region=eu-west-1

* AWS Docker Tutorial
http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_docker_ecstutorial.html

* Understanding Elastic Beanstalk
http://aws.amazon.com/documentation/elastic-beanstalk/

* Adding security to docker profile
http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_docker_ecstutorial.html#create_deploy_docker_ecstutorial_role

* EB and Docker, show casing CLI with a step by step guide
https://gist.github.com/evandbrown/327a288ac719e69254ff
https://www.youtube.com/watch?v=OzLXj2W2Rss

### Common Docker Commands
These commands are available to mange your local Docker vms
```sh
boot2docker ip
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker rmi $(docker images -q)
docker logs IMAGE_NAME
```

### Common AWS Commands
These commands are available once connected to the EC2 instance.

Check the status of the EC2 container
```sh
curl http://localhost:51678/v1/metadata
```
More detailed information of the EC2 container
```sh
curl http://localhost:51678/v1/metadata
```
### Build Base Volume [cd base]
Create a base image, used for other docker containers 'build-base'.
```sh
docker build -t longieirl/build-base .
```

### Build Data Volume [cd data]
Create a data volume, pulled down from git, with an alias of 'build-data'.
```sh
docker build -t longieirl/build-data .
docker run -itd --name build-data longieirl/build-data
```

### Single Node App [cd node-single]
Create a single Node JS instance, with an alias of 'node-single'.
```sh
docker build -t longieirl/node-single .
docker run -itd -p 9000:9000 --name node-single longieirl/node-single
```

### Running mongodb [cd mongo]
Create a mongo instance exposing port 27017 with an alias of 'mongodb'.
```sh
docker build -t longieirl/mongodb .
docker run -itd -p 27017:27017 --name mongodb -v /var/app/mongodb/:/data/db --detach --publish-all longieirl/mongodb
```

### Running Node and MongoDB [cd node-mongo]
Create a running Node instance talking to the mongodb docker instance exposing a data volume from the host VM, with an alias of 'build-data'.
The 2nd and 3rd commands allows you to manage the volumes in different ways. 2nd option loads it from the host system, while the seconds loads from another Docker VM.
```sh
docker build -t longieirl/build .
docker run -itd -p 9000:9000 --name build -v /Users/johnlong/Dropbox/Docker/docker-mongo/files:/var/app/current/build --link mongodb:mongodb longieirl/build
docker run -itd -p 80:9000 --name build --volumes-from build-data --link mongodb:mongodb longieirl/build
```
  
### Docker.io public repository
In order to expose the docker VM's in a multi-container environment, the Dockerrun.aws.json needs to pull the images from a public/private repository. The Dockerrun.aws.js contains customised settings for AWS i.e. memeory, space etc...
```sh
docker login
docker push longieirl/build-base
docker push longieirl/mongodb
docker push longieirl/build
docker push longieirl/build-data
docker pull longieirl/build-base
docker pull longieirl/mongodb
docker pull longieirl/build
docker pull longieirl/build-data
```

### Setup Docker Compose
Docker compose works similarly to how Dockerrun.aws.json works, if this works locally then the same settings should work on AWS
```sh
git clone https://github.com/mjhea0/node-docker-workflow.git
curl -L https://github.com/docker/compose/releases/download/1.2.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
docker-compose up -d
docker-compose ps
docker-compose stop
```

### Lessons Learnt
* Deploying a new version of the Dockerrun.aws.json file causes the app servers to not restart. Requires an environment restart
* Initial setup i.e. to deploy a new Dockerrun.aws.json takes up to 10-15 minutes. Once created, very fast to stop/restart
* Docker compose is a good way to validate the VM's pushed to docker.io, will validate your setup before pushing remotely, 'eb local' is another way to validate your AWS settings
* CLI seems to be the preferred way of deploying VM's, allowing configuration settings to be applied from the CLI. Havent had a chance to use this yet
*

### TODO Tasks
* Validating scaling based on certain thresholds being met i.e. CPU, load etc...different to running a predefined amount of instances


