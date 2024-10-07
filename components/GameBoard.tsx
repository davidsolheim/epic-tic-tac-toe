import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

type Player = 'X' | 'O';

interface GameBoardProps {
  board: (Player | null)[];
  size: number;
  onMove: (index: number) => void;
  winner: Player | 'draw' | null;
}

export default function GameBoard({ board, size, onMove, winner }: GameBoardProps) {
  const winningCombination = winner && winner !== 'draw' ? getWinningCombination(board, size) : null;

  return (
    <div
      className="grid gap-2 p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg perspective-1000"
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        width: `${size * 80}px`,
        height: `${size * 80}px`,
      }}
    >
      {board.map((cell, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative"
        >
          <Button
            onClick={() => onMove(index)}
            className={`w-full h-full text-4xl font-bold transition-all duration-500 ease-out transform hover:rotate-y-180 ${
              winningCombination && winningCombination.includes(index)
                ? 'bg-green-500 text-white'
                : ''
            }`}
            variant="outline"
            style={{
              perspective: '1000px',
              transformStyle: 'preserve-3d',
            }}
          >
            <span
              className={`absolute inset-0 flex items-center justify-center backface-hidden ${
                cell === 'X' ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-yellow-900' :
                cell === 'O' ? 'bg-gradient-to-br from-gray-300 to-gray-600 text-gray-900' :
                'bg-transparent'
              }`}
              style={{
                transform: cell ? 'rotateY(0deg)' : 'rotateY(180deg)',
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: 'transform',
              }}
            >
              {cell}
            </span>
            <span
              className="absolute inset-0 flex items-center justify-center backface-hidden bg-opacity-50 bg-gray-700"
              style={{
                transform: cell ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: 'transform',
              }}
            ></span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

function getWinningCombination(board: (Player | null)[], size: number): number[] | null {
  // Check rows
  for (let row = 0; row < size; row++) {
    for (let col = 0; col <= size - 3; col++) {
      const index = row * size + col;
      if (board[index] && 
          board[index] === board[index + 1] && 
          board[index] === board[index + 2]) {
        return [index, index + 1, index + 2];
      }
    }
  }

  // Check columns
  for (let col = 0; col < size; col++) {
    for (let row = 0; row <= size - 3; row++) {
      const index = row * size + col;
      if (board[index] && 
          board[index] === board[index + size] && 
          board[index] === board[index + 2 * size]) {
        return [index, index + size, index + 2 * size];
      }
    }
  }

  // Check diagonals (top-left to bottom-right)
  for (let row = 0; row <= size - 3; row++) {
    for (let col = 0; col <= size - 3; col++) {
      const index = row * size + col;
      if (board[index] && 
          board[index] === board[index + size + 1] && 
          board[index] === board[index + 2 * (size + 1)]) {
        return [index, index + size + 1, index + 2 * (size + 1)];
      }
    }
  }

  // Check diagonals (top-right to bottom-left)
  for (let row = 0; row <= size - 3; row++) {
    for (let col = 2; col < size; col++) {
      const index = row * size + col;
      if (board[index] && 
          board[index] === board[index + size - 1] && 
          board[index] === board[index + 2 * (size - 1)]) {
        return [index, index + size - 1, index + 2 * (size - 1)];
      }
    }
  }

  return null;
}