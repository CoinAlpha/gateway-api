FROM node:12.13.0

# Set labels
LABEL application="gateway-api"
LABEL branch=${BRANCH}
LABEL commit=${COMMIT}
LABEL date=${BUILD_DATE}

# Set ENV variables
ENV COMMIT_BRANCH=${BRANCH}
ENV COMMIT_SHA=${COMMIT}
ENV BUILD_DATE=${DATE}

# app directory
WORKDIR /usr/src/app

# install dependancies
COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

# copy pwd file to container
COPY . .

EXPOSE 5000

RUN yarn build

CMD ["yarn", "run", "start"]
