FROM alekzonder/puppeteer:1.3.0

WORKDIR /app

USER pptruser

COPY package*.json ./

RUN yarn install

COPY . /app

EXPOSE 8080
