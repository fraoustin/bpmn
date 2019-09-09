FROM alpine:3.4 as builder
LABEL maintainer="Frederic Aoustin <fraoustin@gmail.com>"
RUN apk add --no-cache --virtual .nodejs nodejs

RUN mkdir /code
WORKDIR /code

# Setup PATH to prioritize local npm bin ahead of system PATH.
ENV PATH node_modules/.bin:$PATH
COPY app /code/
COPY resources /code/
COPY package.json /code/
COPY webpack.config.js /code/

RUN npm install
RUN npm run build

FROM nginx:1.17
COPY --from=builder /code/* /usr/share/nginx/html