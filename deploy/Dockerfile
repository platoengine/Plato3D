FROM httpd:2.4

## to build, from the Plato3D directory:
# 1. npm run build
# 2. mv dist deploy; cd deploy
# 2. docker build -t plato3d/plato-frontend .

## to run locally:
#$ docker run -dit --name plato3d-app -p 8080:80 plato-frontend

COPY ./dist/ /usr/local/apache2/htdocs/
