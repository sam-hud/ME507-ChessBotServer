import express, { Request, Response, Router } from "express";
import { Chess } from "chess.js";
import e from "express";

const router: Router = express.Router();
let chess = new Chess();
let acceptMoves: boolean = true;

function boardState() {
  return {
    fen: chess.fen(),
    turn: chess.turn(),
    acceptMoves: acceptMoves,
    lastMove: chess.history({ verbose: true }).pop(),
    isNewGame: chess.history().length === 0,
  };
}

// reset board
router.post("/new", async (req: Request, res: Response) => {
  chess = new Chess();
  acceptMoves = true;
  res.send();
});

// get board positions
router.get("/", async (req: Request, res: Response) => {
  res.send(boardState());
});

// get board positions in ascii
router.get("/ascii", async (req: Request, res: Response) => {
  res.send({ ascii: chess.ascii() });
});

// post move
router.post("/move", async (req: Request, res: Response) => {
  const newMove = { from: req.body.from, to: req.body.to };
  if (chess.move(newMove) !== null) {
    //If move is valid, submit move and stop accepting moves
    chess.move(newMove);
    acceptMoves = false;
  } else {
    acceptMoves = true; // If move is invalid , keep accepting moves
  }

  res.send(boardState());
});

// get move status
router.get("/acceptMoves", async (req: Request, res: Response) => {
  res.send({ acceptMoves: acceptMoves });
});

// set move status
router.post("/acceptMoves", async (req: Request, res: Response) => {
  acceptMoves = req.body.acceptMoves;
  res.send({ acceptMoves: acceptMoves });
});

// get last move
router.get("/lastMove", async (req: Request, res: Response) => {
  res.send(chess.history({ verbose: true }).pop());
});

router.get("/isNewGame", async (req: Request, res: Response) => {
  res.send({ isNewGame: chess.history().length === 0 });
});

export default router;
