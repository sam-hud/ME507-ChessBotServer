# Webserver for ME507 Chessbot project

This webserver acts as the controller for the chessbot. The backend runs a Chess engine which is controlled via a REST API. The ESP32 and the frontend submit requests to the backend to control the chess engine.

The frontend website can be found [here](https://me507-chessbot.netlify.app).

The backend api server is accessed [here](https://chessbotapi.onrender.com).

## Technology

### Frontend

- Node.js
- React.js
- TypeScript
- Chess.js
- react-chessboard

### Backend

- Node.js
- Express.js
- TypeScript
- Chess.js
- CORS

## Deployment

- Frontend: deployed using netlify [netlify](https://www.netlify.com).
- Backend: deployed using [render](https://render.com).
