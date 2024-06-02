### Estagio 1 - Obter o source e gerar build ###
# trabalhar com imagem do node #
FROM node:latest AS ng-builder
# cria diretorio app #
RUN mkdir -p /app
# path de trabalho #
WORKDIR /app
# permite rodar npm install #
COPY package.json /app
RUN npm install
# copia todos os elementos desde a raiz #
COPY . /app
RUN $(npm bin)/ng build --prod


### Estagio 2 - Subir o source para o servidor NGINX com a app Angular ###
FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=ng-builder /app/dist/front-end /usr/share/nginx/html

EXPOSE 80
