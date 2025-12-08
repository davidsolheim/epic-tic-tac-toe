'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

type Player = 'X' | 'O';

interface GameBoard3DWrapperProps {
  board: (Player | null)[];
  size: number;
  onMove: (index: number) => void;
  winner: Player | 'draw' | null;
}

// Only import GameBoard3D on the client side
const GameBoard3D = dynamic(() => import('@/components/GameBoard3D'), {
  ssr: false,
});

export default function GameBoard3DWrapper({ board, size, onMove, winner }: GameBoard3DWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center" style={{ width: '100%', height: '400px' }}>
        <div className="text-lg">Loading 3D board...</div>
      </div>
    );
  }

  return <GameBoard3D board={board} size={size} onMove={onMove} winner={winner} />;
}

