#
# Data volume Dockerfile
#

# Base
FROM longieirl/base

MAINTAINER Build Team

RUN mkdir -p /var/app/current/build

# Get latest release of Project X
RUN git clone --depth=1 https://github.com/longieirl/aws-docker.git /var/app/current/build
# see https://github.com/longieirl/aws-docker/tags for release tags

RUN echo "This is the content for file1.html" > /var/app/current/build/file1.html

VOLUME /var/app/current/build/

# In order to run the VM as a daemon so other VM's can use it
ENTRYPOINT /usr/bin/tail -f /dev/null

# Define default command
CMD ["--quiet"]