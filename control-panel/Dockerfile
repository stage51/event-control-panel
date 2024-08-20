FROM node AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM httpd:alpine

COPY ./public/.htaccess /usr/local/apache2/htdocs/.htaccess

COPY --from=build /app/build /usr/local/apache2/htdocs/

EXPOSE 80

CMD ["httpd-foreground"]
