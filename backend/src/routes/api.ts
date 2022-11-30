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
  if (chess.moves({ square: req.body.from }).includes(req.body.to)) {
    chess.move(req.body);
    acceptMoves = false; // Don't accept input (wait for move to complete)
  } else {
    //If move is invalid, continue accepting moves
    acceptMoves = true; // Accept input
  }
  res.send({
    fen: chess.fen(),
    turn: chess.turn(),
    acceptMoves: acceptMoves,
    lastMove: chess.history({ verbose: true }).pop(),
  });
});

router.post("/move2", async (req: Request, res: Response) => {
  res.send(chess.moves({ square: req.body.from }).includes(req.body.to));
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
  acceptMoves = req.body.moveComplete;
  res.send({ acceptMoves: acceptMoves });
});

// get last move
router.get("/lastMove", async (req: Request, res: Response) => {
  res.send({ lastMove: chess.history({ verbose: true }).pop() });
});

export default router;
