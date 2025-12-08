'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import EndGameModal from '@/components/EndGameModal';
import GameBoard3DWrapper from '@/components/GameBoard3DWrapper';
import { checkWinner, getAIMove } from '@/lib/gameLogic';
import { updateLeaderboard } from '@/lib/leaderboard';
import { useTheme } from 'next-themes';
import { Moon, Sun, Volume2, VolumeX, Home, RotateCcw } from 'lucide-react';

type GameMode = 'friend' | 'ai';
type Difficulty = 'easy' | 'medium' | 'hard';
type Player = 'X' | 'O';

const GameComponent = () => {
  const searchParams = useSearchParams();
  const [gameMode, setGameMode] = useState<GameMode>('friend');
  const [gameDifficulty, setGameDifficulty] = useState<Difficulty>('easy');
  const [gameSize, setGameSize] = useState<number>(3);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [board, setBoard] = useState<(Player | null)[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [gameStatus, setGameStatus] = useState<string>("Player X's turn");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Initialize game from URL parameters
  useEffect(() => {
    setMounted(true);
    
    const mode = searchParams.get('mode') as GameMode;
    const size = parseInt(searchParams.get('size') || '3', 10);
    const difficulty = searchParams.get('difficulty') as Difficulty;

    if (mode === 'friend' || mode === 'ai') {
      setGameMode(mode);
    }
    if (size >= 3 && size <= 5) {
      setGameSize(size);
    }
    if (difficulty === 'easy' || difficulty === 'medium' || difficulty === 'hard') {
      setGameDifficulty(difficulty);
    }

    // Initialize empty board
    const boardSize = size >= 3 && size <= 5 ? size : 3;
    const initialBoard = Array(boardSize * boardSize).fill(null) as (Player | null)[];
    
    setBoard(initialBoard);
    setCurrentPlayer('X');
    setWinner(null);
    setGameStatus("Player X's turn");
  }, [searchParams]);

  // Check for draw
  const checkDraw = useCallback((currentBoard: (Player | null)[]): boolean => {
    return currentBoard.every(cell => cell !== null);
  }, []);

  // Handle player move
  const handleMove = useCallback((index: number) => {
    // Don't allow moves if game is over, cell is already occupied, or it's AI's turn
    if (winner || board[index] !== null || (gameMode === 'ai' && currentPlayer === 'O')) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    // Check for winner
    const gameWinner = checkWinner(newBoard, gameSize);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameStatus(`${gameWinner} wins!`);
      setIsModalOpen(true);
      return;
    }

    // Check for draw
    if (checkDraw(newBoard)) {
      setWinner('draw');
      setGameStatus("It's a draw!");
      setIsModalOpen(true);
      return;
    }

    // Switch player for friend mode
    if (gameMode === 'friend') {
      const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
      setCurrentPlayer(nextPlayer);
      setGameStatus(`Player ${nextPlayer}'s turn`);
    } else {
      // AI mode - switch to AI player and trigger AI move
      setCurrentPlayer('O');
      setGameStatus("AI is thinking...");
    }
  }, [board, currentPlayer, winner, gameMode, gameSize, checkDraw]);

  // Handle AI move
  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 'O' && !winner) {
      const emptyCells = board.reduce((acc, cell, index) => {
        if (cell === null) acc.push(index);
        return acc;
      }, [] as number[]);

      // Only make AI move if there are empty cells
      if (emptyCells.length > 0) {
        const aiMoveIndex = getAIMove(board, gameDifficulty, gameSize);
        
        if (aiMoveIndex >= 0 && board[aiMoveIndex] === null) {
          setTimeout(() => {
            const newBoard = [...board];
            newBoard[aiMoveIndex] = 'O';
            setBoard(newBoard);

            // Check for winner
            const gameWinner = checkWinner(newBoard, gameSize);
            if (gameWinner) {
              setWinner(gameWinner);
              setGameStatus(`${gameWinner} wins!`);
              setIsModalOpen(true);
              return;
            }

            // Check for draw
            if (checkDraw(newBoard)) {
              setWinner('draw');
              setGameStatus("It's a draw!");
              setIsModalOpen(true);
              return;
            }

            // Switch back to player
            setCurrentPlayer('X');
            setGameStatus("Player X's turn");
          }, 500); // Small delay for better UX
        }
      }
    }
  }, [board, currentPlayer, gameMode, winner, gameDifficulty, gameSize, checkDraw]);

  // Reset game
  const resetGame = useCallback(() => {
    const initialBoard = Array(gameSize * gameSize).fill(null) as (Player | null)[];
    
    setBoard(initialBoard);
    setCurrentPlayer('X');
    setWinner(null);
    setGameStatus("Player X's turn");
    setIsModalOpen(false);
  }, [gameSize]);

  // Handle modal save
  const handleSaveToLeaderboard = useCallback((initials: string) => {
    if (winner && winner !== 'draw') {
      updateLeaderboard(initials);
      toast({
        title: "Saved!",
        description: "Your win has been added to the leaderboard.",
      });
    }
    setIsModalOpen(false);
  }, [winner, toast]);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
    // Add logic to enable/disable sound effects
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background text-foreground">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold mb-2">Epic Tic Tac Toe</h1>
        <p className="text-lg text-muted-foreground">{gameStatus}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {gameMode === 'friend' ? 'Playing with a friend' : `Playing vs AI (${gameDifficulty})`} • {gameSize}x{gameSize}
        </p>
      </div>

      <div className="mb-6">
        <GameBoard3DWrapper 
          board={board} 
          size={gameSize} 
          onMove={handleMove} 
          winner={winner}
        />
      </div>

      <div className="flex gap-4 mt-6">
        <Button onClick={resetGame} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset Game
        </Button>
        <Link href="/">
          <Button variant="outline">
            <Home className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12"
          onClick={toggleSound}
        >
          {soundEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
        </Button>
      </div>

      <EndGameModal
        isOpen={isModalOpen}
        winner={winner}
        onClose={handleModalClose}
        onSave={handleSaveToLeaderboard}
      />
    </div>
  );
};

export default GameComponent; 