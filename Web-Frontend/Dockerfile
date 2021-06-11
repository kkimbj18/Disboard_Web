FROM node:12.16.3-alpine as build

WORKDIR /var/jenkins_home/workspace/13-teamZoom-sc21/Web-Frontend
COPY package*.json ./

RUN npm install -g npm@7.6.3
RUN npm install

COPY . .


RUN npm link my_modules/zoomus/instantsdk

ENV NODE_ENV production

RUN npm run build

FROM nginx:latest

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /var/jenkins_home/workspace/13-teamZoom-sc21/Web-Frontend/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
