import { useState } from "react";

// Square component represents a clickable square on the tictactoe board
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Board component represents the entire tictactoe board
function Board({ xIsNext, squares, onPlay }) {
  // handleClick function handles when a user clicks on a square
  function handleClick(i) {
    // If there is already a winner or square is already filled return
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // Create a copy of the current squares array and fill it with 'X'
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    onPlay(nextSquares);

    // AI makes its move using the minimax algorithm
    setTimeout(() => { // Delay AI making move 
      const bestMove = findBestMove(nextSquares);
      if (bestMove !== -1 && !calculateWinner(nextSquares)) {
        nextSquares[bestMove] = "O";
        onPlay(nextSquares);
      }
    }, 500);
  }

  // Render the 3x3 board
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// Game component manages the game state and logic
export default function Game() {
  // useState hooks for managing the game history and current move
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // handlePlay function updates the history with the next move
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // handleNewGame function resets the game state for a new game
  function handleNewGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  // Determine the winner or if it's a draw
  const winner = calculateWinner(currentSquares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (currentSquares.every((square) => square !== null)) {
    status = "Draw: No Winner";
  }

  // Render the game board and information
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <button onClick={handleNewGame}>New Game</button>
      </div>
    </div>
  );
}

// calculateWinner function checks if there is a winner based on the current board state
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// minimax function implements the minimax algorithm to calculate the best move for the AI
function minimax(squares, depth, isMaximizing) {
  const winner = calculateWinner(squares);
  if (winner === "X") return -10 + depth; // X wins
  if (winner === "O") return 10 - depth; // O wins
  if (squares.every((square) => square !== null)) return 0; // Draw

  // If the AI is maximizing its score
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = "O";
        const score = minimax(squares, depth + 1, false);
        squares[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    // If the AI is minimizing the players score
    let bestScore = Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = "X";
        const score = minimax(squares, depth + 1, true);
        squares[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// findBestMove function finds the best move for the AI to play
function findBestMove(squares) {
  let bestMove = -1;
  let bestScore = -Infinity;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      squares[i] = "O";
      const score = minimax(squares, 0, false);
      squares[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}
