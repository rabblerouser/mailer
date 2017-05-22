FROM node:6.10-alpine

RUN mkdir -p /app
WORKDIR /app
COPY . /app

ENV NODE_ENV production
RUN npm install

EXPOSE 3001
CMD npm start
