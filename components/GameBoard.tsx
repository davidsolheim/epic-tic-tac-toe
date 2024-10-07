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
  // Implementation remains the same
  // ...
}