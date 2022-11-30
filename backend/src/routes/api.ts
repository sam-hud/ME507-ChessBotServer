import express, { Request, Response, Router } from "express";
import { Chess } from "chess.js";

const router: Router = express.Router();
let chess = new Chess();
let moveComplete: boolean = true;

// reset board
router.post("/new", async (req: Request, res: Response) => {
  chess = new Chess();
  moveComplete=true;
  res.send({
    fen: chess.fen(),
    turn: chess.turn(),
    moveComplete: moveComplete,
    lastMove: chess.history({ verbose: true }).pop(),
  });
});

// get board positions
router.get("/", async (req: Request, res: Response) => {
  res.send({
    fen: chess.fen(),
    turn: chess.turn(),
    moveComplete: moveComplete,
    lastMove: chess.history({ verbose: true }).pop(),
  });
});

// get board positions in ascii
router.get("/ascii", async (req: Request, res: Response) => {
  res.send({ ascii: chess.ascii() });
});

// post move
router.post("/move", async (req: Request, res: Response) => {
  chess.move(req.body);
  moveComplete=false;
  res.send({
    fen: chess.fen(),
    turn: chess.turn(),
    moveComplete: moveComplete,
    lastMove: chess.history({ verbose: true }).pop(),
  });
});

// get board status
router.get("/status", async (req: Request, res: Response) => {
  res.send({ status: chess.isGameOver() });
});

// get move status
router.get("/moveComplete", async (req: Request, res: Response) => {
  res.send({ moveComplete: moveComplete });
});

// set move status
router.post("/moveComplete", async (req: Request, res: Response) => {
  moveComplete = req.body.moveComplete;
  res.send(moveComplete);
});

// get last move
router.get("/lastMove", async (req: Request, res: Response) => {
  res.send({ lastMove: chess.history({ verbose: true }).pop() });
});

// get last move
router.post("/undo", async (req: Request, res: Response) => {
  chess.undo();
  res.send({
    fen: chess.fen(),
    turn: chess.turn(),
    moveComplete: moveComplete,
    lastMove: chess.history({ verbose: true }).pop(),
  });
});

export default router;
