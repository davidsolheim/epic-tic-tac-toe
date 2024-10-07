import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Player = 'X' | 'O';

type EndGameModalProps = {
  isOpen: boolean;
  winner: Player | 'draw' | null;
  onClose: () => void;
  onSave: (initials: string) => void;
};

export default function EndGameModal({ isOpen, winner, onClose, onSave }: EndGameModalProps) {
  const [initials, setInitials] = useState('');

  const handleSave = () => {
    onSave(initials);
    setInitials('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{winner === 'draw' ? "It's a Draw!" : `${winner} Wins!`}</DialogTitle>
          <DialogDescription>
            {winner === 'draw'
              ? "Great game! It ended in a draw."
              : `Congratulations to ${winner} for winning the game!`}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <label htmlFor="initials" className="block text-sm font-medium text-gray-700">
            Enter your initials:
          </label>
          <Input
            id="initials"
            value={initials}
            onChange={(e) => setInitials(e.target.value.toUpperCase().slice(0, 3))}
            maxLength={3}
            className="mt-1"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save to Leaderboard</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}