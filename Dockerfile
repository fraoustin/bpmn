FROM node:12 as builder
LABEL maintainer="Frederic Aoustin <fraoustin@gmail.com>"
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.17
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html