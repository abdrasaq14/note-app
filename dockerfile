FROM node:20-alpine

#create a app directory

WORKDIR /app

#Install app dependencies

COPY package.json ./

#Run yarn 

RUN yarn

RUN yarn tsc --init

#Bundle app source

COPY  ./ ./

#Expose the port

EXPOSE 3000


CMD [ "yarn", "start" ]