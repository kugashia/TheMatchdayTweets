FROM node:8
LABEL 'author'='kaish' 
WORKDIR /myapp
COPY package*.json ./
RUN npm install
COPY . /myapp
EXPOSE 3200
CMD [ "npm", "start" ]