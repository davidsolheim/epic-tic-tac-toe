type Player = 'X' | 'O';
type Difficulty = 'easy' | 'medium' | 'hard';

export function checkWinner(board: (Player | null)[], size: number): Player | null {
  // Check rows
  for (let row = 0; row < size; row++) {
    for (let col = 0; col <= size - 3; col++) {
      const index = row * size + col;
      if (board[index] && 
          board[index] === board[index + 1] && 
          board[index] === board[index + 2]) {
        return board[index];
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
        return board[index];
      }
    }
  }

  // Check all possible diagonals (top-left to bottom-right)
  for (let row = 0; row <= size - 3; row++) {
    for (let col = 0; col <= size - 3; col++) {
      const index = row * size + col;
      if (board[index] && 
          board[index] === board[index + size + 1] && 
          board[index] === board[index + 2 * (size + 1)]) {
        return board[index];
      }
    }
  }

  // Check all possible diagonals (top-right to bottom-left)
  for (let row = 0; row <= size - 3; row++) {
    for (let col = 2; col < size; col++) {
      const index = row * size + col;
      if (board[index] && 
          board[index] === board[index + size - 1] && 
          board[index] === board[index + 2 * (size - 1)]) {
        return board[index];
      }
    }
  }

  return null;
}

// ... (rest of the file remains unchanged)