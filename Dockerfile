FROM node:10.22.0

# app directory
WORKDIR /usr/src/app

# copy package files
COPY package*.json ./
COPY yarn.lock ./

# install dependancies
RUN yarn install

# copy pwd file to container
COPY . .

# set port
EXPOSE 5000

# execute command
CMD ["yarn", "run", "dev"]