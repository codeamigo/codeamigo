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
1. ssh root@104.236.11.118
2. docker pull plondon/codeamigo:latest
3. docker tag plondon/codeamigo:latest dokku/api:latest
4. dokku tags:deploy api latest
```

### Migrations
```
1. https://medium.com/better-programming/typeorm-migrations-explained-fdb4f27cb1b3
```

### Deploying Frontend

```
1. cd client
2. vercel --prod
```

### Model

https://youtu.be/I6ypD7qv3Z8?t=14231
