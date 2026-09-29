# Chat Application

This is a real-time chat application built with React, Vite, Node.js, Express, and Socket.io.

## Workflow

The project is divided into two main parts:
- **Client**: A React application built with Vite and styled with Tailwind CSS. It connects to the server using `socket.io-client` to send and receive real-time messages.
- **Server**: A Node.js backend using Express and `socket.io`. It handles WebSocket connections, broadcasting messages to all connected clients.

When a user types a message in the client, it emits a socket event to the server. The server then broadcasts this message to all connected clients, ensuring everyone sees the chat update in real-time.

## How to Run the Project

You will need to start both the server and the client to run the application fully.

### 1. Run the Server
Open a terminal and navigate to the `server` directory, install dependencies, and start the development server:

```bash
cd server
npm install
npm run dev
```
The server will start running (checking `server.js` for the exact port, usually 3000 or 5000).

### 2. Run the Client
Open a separate terminal window, navigate to the `client` directory, install dependencies, and start the Vite development server:

```bash
cd client
npm install
npm run dev
```
The client will start (usually on http://localhost:5173). Open the provided local URL in your browser to start chatting!
