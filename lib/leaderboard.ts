export type LeaderboardEntry = {
  initials: string;
  wins: number;
  lastWin: string; // ISO date string
};

export function getLeaderboard(): LeaderboardEntry[] {
  const leaderboard = localStorage.getItem('leaderboard');
  return leaderboard ? JSON.parse(leaderboard) : [];
}

export function updateLeaderboard(initials: string): void {
  const leaderboard = getLeaderboard();
  const existingEntry = leaderboard.find(entry => entry.initials === initials);

  if (existingEntry) {
    existingEntry.wins += 1;
    existingEntry.lastWin = new Date().toISOString();
  } else {
    leaderboard.push({ initials, wins: 1, lastWin: new Date().toISOString() });
  }

  leaderboard.sort((a, b) => b.wins - a.wins);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
}