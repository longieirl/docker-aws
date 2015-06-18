#
# NodeJS Dockerfile
#

# Base
FROM longieirl/build-base

MAINTAINER Build Team

# Bundle host app source to docker
ADD src /var/app/build

# Sharing volumes
RUN mkdir -p /var/app/current/build
RUN echo "hello world from inside container" > /var/app/current/build/greeting.txt

VOLUME /var/app/current/build

# Bundle app source
COPY . /src

# Use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD src/package.json /tmp/package.json

RUN cd /tmp && \
	npm install && \
	cp -a /tmp/node_modules /var/app/build

EXPOSE 9000

CMD ["node", "/var/app/build/index.js"]