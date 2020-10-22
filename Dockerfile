FROM node:10.22.0-alpine

# app directory
WORKDIR /usr/src/app

# install dependancies
COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

# copy pwd file to container
COPY . .

EXPOSE 5000

CMD ["yarn", "run", "dev"]