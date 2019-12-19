FROM node:lts-alpine3.10 as builder
#use "production" instead to install only production dependencies
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
#needed to install bcrypt
RUN apk --no-cache add python make g++
COPY package*.json ./
RUN npm install --silent --progress=false
FROM node:lts-alpine3.10
WORKDIR /usr/src/app
COPY --from=builder node_modules node_modules
COPY . .
#development mode
EXPOSE 8000
CMD ["npm", "start"]
#production mode
#CMD ["npm", "run", "start:prod"]
