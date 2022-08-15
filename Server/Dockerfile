FROM node:16-alpine
# Creating application directory
WORKDIR /app
# Copying necessary files to workdir.
COPY package*.json ./
COPY tsconfig.json ./
COPY gulpfile.js ./
COPY ./src ./src
# Installing dependencies
RUN yarn install
# Building application
RUN yarn build
# Starting application
EXPOSE $PORT
ENTRYPOINT [ "yarn", "start" ]