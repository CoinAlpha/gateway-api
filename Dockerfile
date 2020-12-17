FROM node:10.22.0-alpine

# Set labels
LABEL application="gateway-api"

# app directory
WORKDIR /usr/src/app

# install dependancies
COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

# copy pwd file to container
COPY . .

# create empty env file
RUN touch .env

EXPOSE 5000

CMD ["yarn", "run", "start"]