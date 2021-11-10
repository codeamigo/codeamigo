# 🐶 codeamigo

### What is codeamigo?
codeamigo is a platform for building byte-sized interactive coding tutorials, which can be taken, for free, without signup, by anyone.
### Stack/Requirements

```
1. postgresql
2. redis
3. express
4. apollo-server
5. next.js
6. tailwindcss
```

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
