FROM node:current-alpine3.11
WORKDIR /app
COPY package*.json  ./
RUN yarn install
COPY . .
CMD ["npm", "start"]