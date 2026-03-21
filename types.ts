export interface Player {
  name: string;
  isCaptain?: boolean;
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  players: Player[];
  logo?: string;
}

export interface Match {
  id: string;
  date: string;
  dayOfWeek: string;
  homeTeamId: number;
  awayTeamId: number;
  homeScore?: number;
  awayScore?: number;
  isFinished: boolean;
  round: ' lượt đi' | ' lượt về' | 'chung kết' | 'play-off';
  tai?: number;
}

export interface TeamStats {
  teamId: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}
