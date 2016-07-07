# install node 4
FROM node:4-wheezy

# create project structure
RUN mkdir /JWT-auth-api-seed
WORKDIR /JWT-auth-api-seed

# create config and copy
RUN mkdir config
COPY config config

# copy eslint
COPY .eslintrc .eslintrc

# Copy application files
COPY app.js app.js
RUN mkdir public
COPY public public
RUN mkdir src
COPY src src

# copy package.json
COPY package.json package.json
RUN npm install

# copy and run tests
RUN mkdir test
COPY test test
RUN npm run test


# remove these commands and use them in jenkins
# Expose port 3000
EXPOSE 3000

RUN NODE_ENV=default

CMD ["npm", "start"]
