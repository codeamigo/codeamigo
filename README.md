# codeamigo

### Installation

```
cd server
yarn

cd client
yarn
```

### Dev/Server

```
cd server
sudo redis-server /usr/local/etc/redis.conf // start redis
brew services start postgresql // start our db
yarn watch // ts => js
yarn dev // run index.js
```

Visit http://localhost:4000/graphql

### Dev/Client

```
cd client
yarn dev
```

Visit http://localhost:3000

### Stack/Requirements

```
1. postgresql
2. redis
3. express
4. apollo-server
5. next.js
6. tailwindcss
```

### Deploying Backend

```
1. push to codeamigo master
2. ssh into digital ocean droplet
3. docker pull plondon/codeamigo:latest
4. docker tag plondon/codeamigo:latest dokku/api:latest
5. dokku tags:deploy api latest
```

http://dokku.viewdocs.io/dokku~v0.21.4/deployment/methods/images/#image-workflows

### Deploying Frontend

```
1. vercel --prod
```

### Model

https://youtu.be/I6ypD7qv3Z8?t=14231
