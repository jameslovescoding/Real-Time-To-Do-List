# Real Time To Do List App

This is done only to help understand how we can handle real time app using React and Redux

This article explains:

- How to create socket.io express server

- How to consume the data received from the server in React-Redux app

# Design

Redux Store:

- Using middleware and thunk action to  to handle socket communication.

Client Side:

- After the React component initializes, socket io initialize and add listening channels.

- Before the React component unmount, disconnect the socket.

- When changes happen (add or mark completion), use thunk action to dispatch the socket communication.

Server Side:

- When the client first connected, set up disconnect, addItem, markItem channel.

- When the client first connected, get all record of the to do list database and set it back to client.

- When addItem or markItem is triggered, write to the MongoDB database.

# How to run this app

Install dependencies using the following command

```
npm install
```

Install MongoDB using Homebrew

```
brew tap mongodb/brew

brew install mongodb-community
```

Start the MongoDB service by using 'brew services' command

```
brew services start mongodb/brew/mongodb-community
```

Verify installation and status:
```
brew services list
```

Finally start the server in debug mode using nodemon by running the following command
```
npm run server2
```

Or, run the server using webpack-dev-server by running the following command
```
yarn start
```
