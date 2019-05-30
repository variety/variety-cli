FROM debian/eol:wheezy
MAINTAINER Dave Wittman <dave@objectrocket.com>

ENV MONGODB_VERSION debian71-3.2.0
ENV DEBIAN_FRONTEND noninteractive
ENV PATH /opt/mongodb/bin:${PATH}

RUN apt-get update && apt-get install -y --no-install-recommends apt-utils && \
    apt-get install -y curl && \
    apt-get install -y git && \
    curl -sL https://deb.nodesource.com/setup_5.x | bash - && \
    apt-get install -y nodejs && \
    mkdir -p /opt/mongodb && \
    curl -sL https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-${MONGODB_VERSION}.tgz | tar xz -C /opt/mongodb --strip-components=1 && \
    npm install -g variety-cli && \
    npm cache clear && \
    apt-get remove -y curl && \
    rm /opt/mongodb/bin/mongo?* /opt/mongodb/bin/bson* && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["/usr/bin/variety"]
