FROM node:lts

RUN apt-get update && apt-get install -qq -y --no-install-recommends

ENV INSTALL_PATH /javascript_note_api

RUN mkdir -p $INSTALL_PATH

WORKDIR $INSTALL_PATH

COPY package*.json ./

RUN npm install

COPY . .