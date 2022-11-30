import express, { Request, Response, Router } from "express";
import { Chess } from "chess.js";

const router: Router = express.Router();
let chess = new Chess();
let acceptMoves: boolean = true;

// reset board
router.post("/new", async (req: Request, res: Response) => {
  chess = new Chess();
  acceptMoves = true;
  res.send({
    fen: chess.fen(),
    turn: chess.turn(),
    acceptMoves: acceptMoves,
    lastMove: chess.history({ verbose: true }).pop(),
  });
});

// get board positions
router.get("/", async (req: Request, res: Response) => {
  res.send({
    fen: chess.fen(),
    turn: chess.turn(),
    acceptMoves: acceptMoves,
    lastMove: chess.history({ verbose: true }).pop(),
  });
});

// get board positions in ascii
router.get("/ascii", async (req: Request, res: Response) => {
  res.send({ ascii: chess.ascii() });
});

// post move
router.post("/move", async (req: Request, res: Response) => {
  const newMove = { from: req.body.from, to: req.body.to };
  if (newMove === chess.move(newMove)) {
    //Check if move is invalid
    acceptMoves = true; // If move is invalid, keep accepting moves
  } else {
    // Stop accepting moves if move is valid
    acceptMoves = false;
  }

  res.send({
    fen: chess.fen(),
    turn: chess.turn(),
    acceptMoves: acceptMoves,
    lastMove: chess.history({ verbose: true }).pop(),
  });
});

// get board status
router.get("/status", async (req: Request, res: Response) => {
  res.send({ status: chess.isGameOver() });
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
  res.send({ lastMove: chess.history({ verbose: true }).pop() });
});

export default router;
