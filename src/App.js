import { useEffect, useState } from 'react';
import Board from './components/Board';
import Square from './components/Square';
import './style/app.css';

const defaultSquares = () => new Array(9).fill(null);

function App() {
  const [squares, setSquares] = useState(defaultSquares());
  const [winner, setWinner] = useState(null);
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
  const handlePlayAgain = () => {
    setSquares(defaultSquares());
    setWinner(null);
  };

  useEffect(() => {
    const isComputerTurn = squares.filter((square) => square !== null).length % 2 === 1;
    const linesThatAre = (a, b, c) => {
      return lines.filter((squareIndexes) => {
        const squareValues = squareIndexes.map((index) => squares[index]);
        return JSON.stringify([a, b, c].sort()) === JSON.stringify(squareValues.sort());
      });
    };
    const emptyIndexes = squares
      .map((square, index) => (square === null ? index : null))
      .filter((val) => val !== null);
    const playerWon = linesThatAre('x', 'x', 'x').length > 0;
    const computerWon = linesThatAre('o', 'o', 'o').length > 0;
    const nobodyWon = squares.filter((square) => square === null).length === 0;
    if (playerWon) {
      setWinner('x');
    }
    if (computerWon) {
      setWinner('o');
    }
    if (nobodyWon) {
      setWinner('nobody win');
    }
    const putComputerAt = (index) => {
      let newSquares = squares;
      newSquares[index] = 'o';
      setSquares([...newSquares]);
    };
    if (!nobodyWon) {
      if (isComputerTurn) {
        const winningLines = linesThatAre('o', 'o', null);
        const linesToBlock = linesThatAre('x', 'x', null);

        if (winningLines.length > 0) {
          const winIndex = winningLines[0].filter((index) => squares[index] === null)[0];
          putComputerAt(winIndex);
          return;
        }
        if (linesToBlock.length > 0) {
          const blockIndex = linesToBlock[0].filter((index) => squares[index] === null)[0];
          putComputerAt(blockIndex);
          return;
        }
        const linesToContinue = linesThatAre('o', null, null);
        if (linesToContinue.length > 0) {
          putComputerAt(linesToContinue[0].filter((index) => squares[index] === null)[0]);
          return;
        }
        const randomIndex = emptyIndexes[Math.ceil(Math.random() * emptyIndexes.length)];
        putComputerAt(randomIndex);
      }
    }
  }, [squares]);

  function handleSquareClick(index) {
    const isPlaterTurn = squares.filter((square) => square !== null).length % 2 === 0;
    if (isPlaterTurn) {
      let newSquares = squares;
      newSquares[index] = 'x';
      setSquares([...newSquares]);
    }
  }

  return (
    <main>
      <div>
        <h1>Player : X</h1>
        <h1>Computer : O</h1>
      </div>
      <Board>
        {squares.map((square, index) => (
          <Square
            x={square === 'x' ? 1 : 0}
            o={square === 'o' ? 1 : 0}
            key={Math.random()}
            onClick={() => handleSquareClick(index)}
          />
        ))}
      </Board>
      {winner && winner === 'x' && (
        <div className='result green'>
          <h1>You WON</h1>
          <button className='button' onClick={handlePlayAgain}>
            play again
          </button>
        </div>
      )}
      {winner && winner === 'o' && (
        <div className='result red'>
          <h1>You LOST</h1>
          <button className='button' onClick={handlePlayAgain}>
            play again
          </button>
        </div>
      )}
      {winner && winner === 'nobody win' && (
        <div className='result grey'>
          <h1>nobody win</h1>
          <button className='button' onClick={handlePlayAgain}>
            play again
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
