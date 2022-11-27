import { Chessboard } from "react-chessboard";
import { useState, useEffect } from "react";

export default function Home() {
  /* useState variables for dynamically updating the page */
  const [fen, setFen] = useState(
    // FEN string to change the board element
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [feedback, setFeedback] = useState("White's turn"); //Feedback header
  const [turn, setTurn] = useState("w"); //Turn indicator

  interface move {
    from: string;
    to: string;
    promotion?: string;
  }
  /* Fetch current board on page load */
  useEffect(() => {
    fetch("https://chessbotapi.onrender.com/fen")
      .then((res) => res.json())
      .then((data) => {
        setFen(data.fen);
        setTurn(data.turn);
      });
    if (turn === "w") {
      setFeedback("White's turn");
    } else {
      setFeedback("Black's turn");
    }
  }, [turn]); //Refetch on load and when turn changes

  /* Fetch current board every 2s */
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://chessbotapi.onrender.com/fen")
        .then((res) => res.json())
        .then((data) => {
          setFen(data.fen);
          setTurn(data.turn);
        });
      if (turn === "w") {
        setFeedback("White's turn");
      } else {
        setFeedback("Black's turn");
      }
    }, 2000); //Fetch board status every 2s

    return () => clearInterval(interval);
  }, [turn]); //Refetch every 2s or when turn changes

  /* Send move to api */
  function sendMove(move: move) {
    fetch("https://chessbotapi.onrender.com/move", {
      method: "POST",
      body: JSON.stringify(move),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFen(data.fen); // Update board
        setTurn(data.turn); // Update turn
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
        setFen(data.fen); //Update board
        setTurn(data.turn);
      });
  }

  /* Handle user input (when piece is dropped) */
  function onDrop(sourceSquare: string, targetSquare: string) {
    let move = { from: sourceSquare, to: targetSquare };
    if (turn === "w") {
      // Only send move if it is white's turn
      sendMove(move);
    } else setFeedback("Not your turn!");
    return true;
  }

  /* Render board dynamically */
  return (
    <div className="flex-container">
      <div className="flex-content">
        <h2>{feedback}</h2>
        <Chessboard position={fen} onPieceDrop={onDrop} boardWidth={350} />
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
