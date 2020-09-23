FROM node:9

# Create app directory
RUN mkdir /app
WORKDIR /app

# Install app dependencies
COPY package.json ./
# COPY yarn.lock ./

# Install libraries
RUN yarn && yarn global add typescript ts-node

# Bundle app source
COPY . .

# Build dist folder
RUN yarn build

EXPOSE 3003
CMD [ "yarn", "start" ]