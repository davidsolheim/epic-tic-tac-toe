'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import GameBoard3D from '@/components/GameBoard3D';
import EndGameModal from '@/components/EndGameModal';
import { checkWinner, getAIMove } from '@/lib/gameLogic';
import { updateLeaderboard } from '@/lib/leaderboard';
import { useTheme } from 'next-themes';
import { Moon, Sun, Volume2, VolumeX } from 'lucide-react';

type GameMode = 'friend' | 'ai';
type Difficulty = 'easy' | 'medium' | 'hard';
type Player = 'X' | 'O';

export default function Game() {
  const searchParams = useSearchParams();
  const mode: GameMode = (searchParams.get('mode') as GameMode) || 'friend';
  const difficulty: Difficulty = (searchParams.get('difficulty') as Difficulty) || 'easy';
  const size: number = parseInt(searchParams.get('size') || '3', 10);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [board, setBoard] = useState<(Player | null)[]>(Array(size * size).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [gameStatus, setGameStatus] = useState<string>("Player X's turn");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (mode === 'ai' && currentPlayer === 'O') {
      const aiMove = getAIMove(board, difficulty, size);
      handleMove(aiMove);
    }
  }, [currentPlayer, mode, board, difficulty, size]);

  const getGameTitle = (): string => {
    if (mode === 'friend') {
      return `${size}x${size} Tic Tac Toe - vs Friend`;
    } else {
      return `${size}x${size} Tic Tac Toe - vs AI (${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)})`;
    }
  };

  const handleMove = (index: number): void => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard, size);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameStatus(`Player ${gameWinner} wins!`);
      setIsModalOpen(true);
    } else if (newBoard.every((cell) => cell !== null)) {
      setWinner('draw');
      setGameStatus("It's a draw!");
      setIsModalOpen(true);
    } else {
      const nextPlayer: Player = currentPlayer === 'X' ? 'O' : 'X';
      setCurrentPlayer(nextPlayer);
      setGameStatus(`Player ${nextPlayer}'s turn`);
    }
  };

  const resetGame = (): void => {
    setBoard(Array(size * size).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setGameStatus("Player X's turn");
  };

  const handleSaveToLeaderboard = (initials: string): void => {
    updateLeaderboard(initials);
    toast({
      title: 'Leaderboard Updated',
      description: `${initials} has been added to the leaderboard!`,
    });
  };

  const toggleSound = (): void => {
    setSoundEnabled((prev) => !prev);
    // Add logic to enable/disable sound effects
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-6">
        {getGameTitle()}
      </h1>
      <div className="text-2xl font-semibold mb-6">{gameStatus}</div>
      <GameBoard3D board={board} size={size} onMove={handleMove} winner={winner} />
      <div className="mt-8 space-x-4">
        <Button onClick={resetGame} className="w-36 h-12 text-lg px-6">
          Reset Game
        </Button>
        <Link href="/">
          <Button variant="secondary" className="w-36 h-12 text-lg px-6">
            Back to Home
          </Button>
        </Link>
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 p-2"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 p-2"
          onClick={toggleSound}
        >
          {soundEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
        </Button>
      </div>
      <EndGameModal
        isOpen={isModalOpen}
        winner={winner}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveToLeaderboard}
      />
    </div>
  );
}