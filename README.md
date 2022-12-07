# Webserver for ME507 Chessbot project

This webserver acts as the controller for the chessbot. The backend runs a Chess engine which is controlled via a REST API, implemented using Express. The ESP32 and the frontend submit requests to the backend to control the chess engine.

The frontend website can be accessed [here](https://me507-chessbot.netlify.app).

The backend api server can be accessed [here](https://chessbotapi.onrender.com).

## Technology

### Frontend

- [Node.js](https://nodejs.org/en/)
- [React](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [react-chessboard](https://github.com/Clariity/react-chessboard)

### Backend

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com)
- [TypeScript](https://www.typescriptlang.org)
- [Chess.js](https://github.com/jhlywa/chess.js/blob/master/README.md)

## Deployment

- Frontend: deployed using [netlify](https://www.netlify.com).
- Backend: deployed using [render](https://render.com).
