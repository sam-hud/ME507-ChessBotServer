import { Chessboard } from "react-chessboard";
import { useState, useEffect, useRef } from "react";
import e from "express";

export default function Home() {
  /* useState variables for dynamically updating the page */
  const [fen, setFen] = useState(
    // FEN string to change the board element
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [feedback, setFeedback] = useState("White's turn"); //Feedback header
  const [status, setStatus] = useState("Waiting for input"); //Feedback header
  const [game, setGame] = useState<apiData>({
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    turn: "w",
    moveComplete: true,
    lastMove: { from: "", to: "", promotion: "" },
  }); //Data from the API

  interface move {
    from: string;
    to: string;
    promotion?: string;
  }
  interface apiData {
    fen: string;
    turn: string;
    moveComplete: boolean;
    lastMove: move;
  }

  /* Fetch current game data on page load */
  useEffect(() => {
    fetch("https://chessbotapi.onrender.com")
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
      });
  }, []);

  /* Fetch current game data every 2s */
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://chessbotapi.onrender.com")
        .then((res) => res.json())
        .then((data) => {
          setGame(data);
        });
    }, 2000); //Fetch board status every 2s

    return () => clearInterval(interval);
  }, []);

  /* Update the feedback header when the turn changes */
  useEffect(() => {
    if (game.turn === "w") {
      setFeedback("White's turn");
    } else if (game.turn === "b") {
      setFeedback("Black's turn");
    }
  }, [game.turn]);

  /* Update the status header when the move is complete */
  useEffect(() => {
    if (game.moveComplete) {
      setStatus("Move complete. Waiting for input");
    } else {
      setStatus("Move in progress, please wait");
    }
  }, [game.moveComplete]);

  /* Send move to api */
  function sendMove(move: move | undefined) {
    fetch("https://chessbotapi.onrender.com/move", {
      method: "POST",
      body: JSON.stringify(move),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
      });
    return true;
  }

  /* Create new game on api and reset board */
  function newGame() {
    fetch("https://chessbotapi.onrender.com/new", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
      });
  }

  /* Handle user input (when piece is dropped) */
  function onDrop(sourceSquare: string, targetSquare: string) {
    if (game.moveComplete) {
      sendMove({ from: sourceSquare, to: targetSquare });
      setStatus("Move sent");
    } else {
      setStatus("Move in progress. Please wait.");
    }
    return true;
  }

  /* Render board dynamically */
  return (
    <div className="flex-container">
      <div className="flex-content">
        <h2>{feedback}</h2>
        <h3>{status}</h3>
        <Chessboard position={game.fen} onPieceDrop={onDrop} boardWidth={350} />
        <button
          onClick={() => {
            newGame();
          }}
        >
          New Game
        </button>
      </div>
    </div>
  );
}
