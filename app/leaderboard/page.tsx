'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getLeaderboard, LeaderboardEntry } from '@/lib/leaderboard';
import { useTheme } from 'next-themes';
import { Moon, Sun, Volume2, VolumeX } from 'lucide-react';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setLeaderboard(getLeaderboard());
    setMounted(true);
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
      <h1 className="text-4xl font-bold mb-8">Leaderboard</h1>
      <div className="w-full max-w-4xl bg-card rounded-lg shadow-lg p-6">
        <Table>
          <TableCaption>Top 10 players</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Rank</TableHead>
              <TableHead>Initials</TableHead>
              <TableHead className="text-right">Wins</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((entry, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{entry.initials}</TableCell>
                <TableCell className="text-right">{entry.wins}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-8 space-x-4">
        <Link href="/">
          <Button variant="secondary" className="w-36 h-12 text-lg px-6">Back to Home</Button>
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
    </div>
  );
}