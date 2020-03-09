FROM node:12 as builder
LABEL maintainer="Frederic Aoustin <fraoustin@gmail.com>"

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.17
# COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

ENV SET_CONTAINER_TIMEZONE false 
ENV CONTAINER_TIMEZONE "" 

# manage user www-data
RUN usermod -u 1000 www-data

# manage start container
COPY ./platform/src/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN mkdir /usr/share/docker-entrypoint.pre
RUN mkdir /usr/share/docker-entrypoint.post
COPY ./platform/src/00_init.sh /usr/share/docker-entrypoint.pre/00_init.sh
RUN chmod +x -R /usr/share/docker-entrypoint.pre

# install extra nginx
RUN apt-get update && apt-get install -y \
        apache2-utils \
        nginx-extras \
    && rm -rf /var/lib/apt/lists/* 

COPY ./platform/src/default.conf /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/sites-enabled/default

# add cmd nginx
COPY ./platform/src/cmd/addauth.sh /usr/bin/addauth
COPY ./platform/src/cmd/rmauth.sh /usr/bin/rmauth
RUN chmod +x /usr/bin/addauth
RUN chmod +x /usr/bin/rmauth

# add theme
RUN mkdir /theme
RUN mkdir /theme/minimal
WORKDIR /theme/minimal
COPY ./platform/minimal/ /theme/minimal/

# add bpm
RUN mkdir /bpmn
WORKDIR /bpmn
COPY --from=builder /usr/src/app/dist /bpmn

RUN mkdir /login
RUN mkdir /share
VOLUME /share

ENV DAVUSER user
ENV DAVPASSWORD pass

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
CMD ["app"]
