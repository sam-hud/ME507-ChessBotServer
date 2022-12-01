import { Chessboard } from "react-chessboard";
import { useState, useEffect } from "react";

export default function Home() {
  /* useState variables for dynamically updating the page */
  const [fen, setFen] = useState(
    // FEN string to change the board element
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [feedback, setFeedback] = useState("White's turn"); //Feedback header
  const [status, setStatus] = useState("Move in progress, please wait."); //Feedback header
  const [side, setSide] = useState<"white" | "black">("white"); //Side displayed on the board
  const [game, setGame] = useState<apiData>({
    fen: "",
    turn: "w",
    acceptMoves: true,
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
    acceptMoves: boolean;
    lastMove: move;
  }

  /* Fetch current game data on page load */
  useEffect(() => {
    fetch("http://localhost:3001/")
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
        setFen(data.fen);
      });
  }, []);

  /* Fetch current game data every 2s */
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:3001/")
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
    if (game.acceptMoves) {
      setStatus("Make a move!");
    } else {
      setStatus("Move in progress, please wait.");
    }
  }, [game]);

  /* Send move to api */
  function sendMove(move: move) {
    fetch("http://localhost:3001/move", {
      method: "POST",
      body: JSON.stringify(move),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
        setFen(data.fen);
      });
  }

  /* Create new game on api and reset board */
  function newGame() {
    fetch("http://localhost:3001/new", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
        setFen(data.fen);
      });
  }

  /* Handle user input (when piece is dropped) */
  function onDrop(sourceSquare: string, targetSquare: string) {
    if (sourceSquare === targetSquare) {
      return true; //If the piece is dropped on the same square, do nothing
    } else if (game.acceptMoves) {
      setStatus("Move sent.");
      sendMove({ from: sourceSquare, to: targetSquare });
    } else {
      setStatus("Move in progress, please wait.");
    }
    return true;
  }

  /* Render board dynamically */
  return (
    <div className="flex-container">
      <div className="flex-content">
        <h2>{feedback}</h2>
        <h3>{status}</h3>
        <Chessboard
          position={fen}
          onPieceDrop={onDrop}
          boardWidth={350}
          boardOrientation={side}
        />
        <button
          onClick={() => {
            newGame();
          }}
        >
          New Game
        </button>
        <button
          onClick={() => {
            if (side === "white") {
              setSide("black");
            } else {
              setSide("white");
            }
          }}
        >
          Flip board
        </button>
      </div>
    </div>
  );
}
