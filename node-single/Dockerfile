#
# NodeJS Dockerfile
#

# Base
FROM longieirl/build-base

# Install Node.js and npm
RUN wget --quiet http://nodejs.org/dist/v0.10.38/node-v0.10.38-linux-x64.tar.gz && \
	tar -C /usr/local --strip-components 1 -xzf node-v0.10.38-linux-x64.tar.gz && \
    rm -rf node-v0.10.38-linux-x64.tar.gz && \
	node -v && \
	npm -v && \
	npm install -g grunt-cli

# Bundle app source
ADD src /src

# Bundle app source
COPY . /src

# Use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD src/package.json /tmp/package.json

RUN cd /tmp && npm install && \
	cp -a /tmp/node_modules /src

EXPOSE  9000

CMD ["nodejs", "/src/index.js"]