FROM node:12.16.3-alpine

WORKDIR /var/jenkins_home/workspace/13-teamZoom-sc21/Backend
COPY package*.json ./

RUN npm install -g npm@7.17.0
RUN npm install node-gyp
RUN npm install
RUN npm install -g pm2

ENV NODE_ENV production
ENV SESSION_SECRET capstone_project_t13
ENV DB mongo
ENV IP 3.36.52.136
ENV ACCESSKEY AKIAQZXIFS4YVOJJPZOT
ENV SECRETKEY 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
ENV BUCKET_NAME disboard-capstone

COPY . .

CMD ["pm2-runtime", "start", "./bin/www"]
