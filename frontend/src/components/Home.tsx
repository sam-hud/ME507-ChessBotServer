import { Chessboard } from "react-chessboard";
import { useState, useEffect } from "react";

export default function Home() {
  /* useState variables for dynamically updating the page */
  const [turnHeader, setTurnHeader] = useState("White's turn"); //Feedback header
  const [statusHeader, setStatusHeader] = useState(
    "Move in progress, please wait."
  ); //Feedback header
  const [side, setSide] = useState<"white" | "black">("white"); //Side displayed on the board
  const [game, setGame] = useState<apiData>({
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    turn: "w",
    acceptMoves: true,
  }); //Data from the API
  const [fen, setFen] = useState(""); //FEN string for the board

  interface move {
    from: string;
    to: string;
    promotion?: string;
  }
  interface apiData {
    fen: string;
    turn: string;
    acceptMoves: boolean;
  }

  /* Fetch current game data on page load */
  useEffect(() => {
    fetch("https://chessbotapi.onrender.com/")
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
        setFen(data.fen);
      });
  }, []);

  /* Fetch current game data every 2s */
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://chessbotapi.onrender.com/")
        .then((res) => res.json())
        .then((data) => {
          setGame(data);
          setFen(data.fen);
          console.log(data);
        });
    }, 2000); //Fetch board status every 2s

    return () => clearInterval(interval);
  }, []);

  /* Update the turn header when the turn changes */
  useEffect(() => {
    {
      if (game.turn === "w") {
        setTurnHeader("White's turn");
      } else if (game.turn === "b") {
        setTurnHeader("Black's turn");
      }
    }
  }, [game.turn, side]);

  /* Update the status header when the move is complete */
  useEffect(() => {
    if (game.acceptMoves && game.turn === side.charAt(0)) {
      setStatusHeader("It's your turn!");
    } else if (game.acceptMoves) {
      setStatusHeader("It's your opponent's turn.");
    } else {
      setStatusHeader("Move in progress, please wait.");
    }
  }, [game]);

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
        setGame(data);
      });
  }

  /* Force move confirm */
  function moveConfirm() {
    fetch("https://chessbotapi.onrender.com/move", {
      method: "POST",
      body: JSON.stringify({ acceptMove: true }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
      });
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
    if (sourceSquare === targetSquare) {
      return true; //If the piece is dropped on the same square, do nothing
    } else if (game.acceptMoves && game.turn === side.charAt(0)) {
      setStatusHeader("Move sent.");
      sendMove({ from: sourceSquare, to: targetSquare });
    } else {
      setStatusHeader("Not your turn, please wait.");
    }
    return true;
  }

  /* Render board dynamically */
  return (
    <div className="flex-container">
      <div className="flex-content">
        <h2>{turnHeader}</h2>
        <h3>{statusHeader}</h3>
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
      <div>
        <button onClick={() => moveConfirm()}>Force move done</button>
      </div>
    </div>
  );
}
