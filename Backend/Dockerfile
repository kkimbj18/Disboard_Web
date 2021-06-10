FROM node:12.16.3-alpine

WORKDIR /var/jenkins_home/workspace/13-teamZoom-sc21/Backend
COPY package*.json ./

RUN npm install -g npm@7.6.3
RUN npm install
RUN npm install -g pm2

ENV NODE_ENV production
ENV SESSION_SECRET capstone_project_t13
ENV DB mongo
ENV IP 3.36.52.136
ENV ACCESSKEY AKIAQZXIFS4YV5TNM77O
ENV SECRETKEY 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
ENV BUCKET_NAME disboard-capstone


COPY . .

CMD ["pm2-runtime", "start", "./bin/www"]
