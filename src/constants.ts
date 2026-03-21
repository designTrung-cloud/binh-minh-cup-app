import { Team, Match } from './types';

export const TEAMS: Team[] = [
  {
    id: 1,
    name: "Mẩu",
    shortName: "Đội 1",
    players: [
      { name: "Mẩu", isCaptain: true },
      { name: "A Sơn" },
      { name: "Thiện" },
      { name: "Đức Còm" },
      { name: "Dương Minh Đức" },
      { name: "Thịnh" },
    ]
  },
  {
    id: 2,
    name: "Dương",
    shortName: "Đội 2",
    players: [
      { name: "Dương", isCaptain: true },
      { name: "Chung" },
      { name: "A Huy" },
      { name: "Thế Anh" },
      { name: "A Thắng" },
      { name: "Sự" },
    ]
  },
  {
    id: 3,
    name: "Nguyễn Đức",
    shortName: "Đội 3",
    players: [
      { name: "Nguyễn Đức", isCaptain: true },
      { name: "Trường" },
      { name: "Sang" },
      { name: "Ngọc" },
      { name: "Mạnh Hùng" },
      { name: "Gia Bảo" },
    ]
  },
  {
    id: 4,
    name: "Đức Cá Chim",
    shortName: "Đội 4",
    players: [
      { name: "Đức Cá Chim", isCaptain: true },
      { name: "Huy Ng" },
      { name: "Tuấn" },
      { name: "A Cường Mỗ" },
      { name: "A Lê" },
      { name: "Việt Anh" },
    ]
  },
  {
    id: 5,
    name: "Huy Hoàng",
    shortName: "Đội 5",
    players: [
      { name: "Huy Hoàng", isCaptain: true },
      { name: "Lâm Hùng" },
      { name: "Phú" },
      { name: "A Cường Vin" },
      { name: "Đức Anh" },
      { name: "Thân" },
    ]
  }
];

export const INITIAL_MATCHES: Match[] = [
  // Lượt đi
  { id: '1', date: '21-03', dayOfWeek: 'Bảy', homeTeamId: 1, awayTeamId: 2, isFinished: false, round: ' lượt đi', tai: 34 },
  { id: '2', date: '23-03', dayOfWeek: 'Hai', homeTeamId: 4, awayTeamId: 2, isFinished: false, round: ' lượt đi', tai: 15 },
  { id: '3', date: '24-03', dayOfWeek: 'Ba', homeTeamId: 5, awayTeamId: 3, isFinished: false, round: ' lượt đi', tai: 24 },
  { id: '4', date: '25-03', dayOfWeek: 'Tư', homeTeamId: 1, awayTeamId: 3, isFinished: false, round: ' lượt đi', tai: 25 },
  { id: '5', date: '26-03', dayOfWeek: 'Năm', homeTeamId: 4, awayTeamId: 5, isFinished: false, round: ' lượt đi', tai: 13 },
  { id: '6', date: '27-03', dayOfWeek: 'Sáu', homeTeamId: 2, awayTeamId: 3, isFinished: false, round: ' lượt đi', tai: 14 },
  { id: '7', date: '30-03', dayOfWeek: 'Hai', homeTeamId: 4, awayTeamId: 1, isFinished: false, round: ' lượt đi', tai: 23 },
  { id: '8', date: '01-04', dayOfWeek: 'Tư', homeTeamId: 2, awayTeamId: 5, isFinished: false, round: ' lượt đi', tai: 34 },
  { id: '9', date: '02-04', dayOfWeek: 'Năm', homeTeamId: 4, awayTeamId: 3, isFinished: false, round: ' lượt đi', tai: 12 },
  { id: '10', date: '04-04', dayOfWeek: 'Bảy', homeTeamId: 1, awayTeamId: 5, isFinished: false, round: ' lượt đi', tai: 25 },

  // Lượt về
  { id: '11', date: '06-04', dayOfWeek: 'Hai', homeTeamId: 2, awayTeamId: 4, isFinished: false, round: ' lượt về', tai: 15 },
  { id: '12', date: '07-04', dayOfWeek: 'Ba', homeTeamId: 1, awayTeamId: 5, isFinished: false, round: ' lượt về', tai: 25 },
  { id: '13', date: '09-04', dayOfWeek: 'Năm', homeTeamId: 4, awayTeamId: 3, isFinished: false, round: ' lượt về', tai: 12 },
  { id: '14', date: '11-04', dayOfWeek: 'Bảy', homeTeamId: 2, awayTeamId: 5, isFinished: false, round: ' lượt về', tai: 34 },
  { id: '15', date: '13-04', dayOfWeek: 'Hai', homeTeamId: 4, awayTeamId: 1, isFinished: false, round: ' lượt về', tai: 23 },
  { id: '16', date: '15-04', dayOfWeek: 'Tư', homeTeamId: 2, awayTeamId: 3, isFinished: false, round: ' lượt về', tai: 14 },
  { id: '17', date: '17-04', dayOfWeek: 'Sáu', homeTeamId: 4, awayTeamId: 5, isFinished: false, round: ' lượt về', tai: 13 },
  { id: '18', date: '18-04', dayOfWeek: 'Bảy', homeTeamId: 2, awayTeamId: 1, isFinished: false, round: ' lượt về', tai: 34 },
  { id: '19', date: '21-04', dayOfWeek: 'Ba', homeTeamId: 5, awayTeamId: 3, isFinished: false, round: ' lượt về', tai: 24 },
  { id: '20', date: '23-04', dayOfWeek: 'Năm', homeTeamId: 3, awayTeamId: 1, isFinished: false, round: ' lượt về', tai: 25 },
  
  // Vòng chung kết
  { id: '21', date: '25-04', dayOfWeek: 'Bảy', homeTeamId: 0, awayTeamId: 0, isFinished: false, round: 'play-off', tai: 0 },
  { id: '22', date: '26-04', dayOfWeek: 'CN', homeTeamId: 0, awayTeamId: 0, isFinished: false, round: 'chung kết', tai: 0 },
];
