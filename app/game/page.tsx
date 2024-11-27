'use client';

import dynamic from 'next/dynamic'
import { Suspense } from 'react';

// Create a loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-2xl">Loading game...</div>
  </div>
);

// Create a separate client component for the game
const GameComponent = dynamic(() => import('@/components/GameComponent'), {
  ssr: false,
  loading: () => <Loading />
});

// Main page component
export default function GamePage() {
  return (
    <Suspense fallback={<Loading />}>
      <GameComponent />
    </Suspense>
  );
}