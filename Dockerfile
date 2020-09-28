FROM node:14.4.0

# app directory
WORKDIR /usr/src/app

# install dependancies
COPY package*.json ./

# RUN npm install yarn@1.22.5

RUN npm install
# to building code for production
# RUN npm ci --only=production

# copy pwd file to container
COPY . .

EXPOSE 5000

CMD [ "node", "index.js" ]
# CMD ["node", "run", "start"]

