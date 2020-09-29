FROM node:14.4.0

# app directory
WORKDIR /usr/src/app

# install dependancies
COPY package*.json ./

RUN yarn install

# copy pwd file to container
COPY . .

EXPOSE 5000

CMD [ "node", "index.js" ]
