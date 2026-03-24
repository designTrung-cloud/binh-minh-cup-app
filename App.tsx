import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Calendar, 
  Users, 
  Table as TableIcon, 
  ChevronRight, 
  Edit3, 
  Save, 
  X,
  TrendingUp,
  Award,
  Info
} from 'lucide-react';
import { TEAMS, INITIAL_MATCHES } from './constants';
import { Team, Match, TeamStats } from './types';

// --- KẾT NỐI FIREBASE ---
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCvca5GvIr_eXZONeR8RixeYajqNzD4QDY",
  authDomain: "binhminhcup-5e15d.firebaseapp.com",
  databaseURL: "https://binhminhcup-5e15d-default-rtdb.firebaseio.com",
  projectId: "binhminhcup-5e15d",
  storageBucket: "binhminhcup-5e15d.firebasestorage.app",
  messagingSenderId: "342911646003",
  appId: "1:342911646003:web:8e54f0706ac434d5746646"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// -------------------------

export default function App() {
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [activeTab, setActiveTab] = useState<'standings' | 'matches' | 'teams'>('standings');
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [homeScore, setHomeScore] = useState<string>('');
  const [awayScore, setAwayScore] = useState<string>('');

  // Lấy dữ liệu từ Firebase ngay khi tải trang
  useEffect(() => {
    const matchesRef = ref(db, 'matches');
    onValue(matchesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMatches(data);
      } else {
        // Nếu database trống, đẩy dữ liệu mặc định lên
        set(ref(db, 'matches'), INITIAL_MATCHES);
      }
    });
  }, []);

  const standings = useMemo(() => {
    const stats: Record<number, TeamStats> = {};
    TEAMS.forEach(team => {
      stats[team.id] = {
        teamId: team.id,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      };
    });

    matches.forEach(match => {
      if (match.isFinished && match.homeScore !== undefined && match.awayScore !== undefined) {
        const home = stats[match.homeTeamId];
        const away = stats[match.awayTeamId];

        if (home && away) {
          home.played += 1;
          away.played += 1;
          home.goalsFor += match.homeScore;
          home.goalsAgainst += match.awayScore;
          away.goalsFor += match.awayScore;
          away.goalsAgainst += match.homeScore;

          if (match.homeScore > match.awayScore) {
            home.won += 1; home.points += 3;
            away.lost += 1;
          } else if (match.homeScore < match.awayScore) {
            away.won += 1; away.points += 3;
            home.lost += 1;
          } else {
            home.drawn += 1; home.points += 1;
            away.drawn += 1; away.points += 1;
          }
        }
      }
    });

    return Object.values(stats)
      .map(s => ({ ...s, goalDifference: s.goalsFor - s.goalsAgainst }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      });
  }, [matches]);

  const handleSaveScore = () => {
    if (!editingMatch) return;
    
    const hScore = parseInt(homeScore);
    const aScore = parseInt(awayScore);

    if (isNaN(hScore) || isNaN(aScore)) return;

    const updatedMatches = matches.map(m => 
      m.id === editingMatch.id 
        ? { ...m, homeScore: hScore, awayScore: aScore, isFinished: true }
        : m
    );

    // CẬP NHẬT LÊN FIREBASE - AI VÀO CŨNG THẤY
    set(ref(db, 'matches'), updatedMatches);

    setEditingMatch(null);
    setHomeScore('');
    setAwayScore('');
  };

  const getTeamName = (id: number) => {
    if (id === 0) return 'TBD';
    return TEAMS.find(t => t.id === id)?.name || 'Unknown';
  };

  const getTeamDisplay = (id: number, match: Match) => {
    if (id !== 0) return getTeamName(id);
    if (match.round === 'play-off') return 'Nhì vs Ba';
    if (match.round === 'chung kết') return 'Chung kết';
    return 'TBD';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30">
      {/* Hero Section */}
      <header className="relative h-64 md:h-80 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-40 grayscale"
            alt="Stadium"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Award size={14} />
              Bình Minh Cup 2024
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
              Bình Minh Cup <span className="text-emerald-500">LEAGUE</span>
            </h1>
            <p className="mt-2 text-zinc-400 text-sm md:text-base max-w-md mx-auto font-medium">
              Hệ thống quản lý giải đấu chuyên nghiệp. Theo dõi điểm số, lịch thi đấu và bảng xếp hạng thời gian thực.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-center gap-8 h-16">
            <button 
              onClick={() => setActiveTab('standings')}
              className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'standings' ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <TableIcon size={18} />
              Bảng xếp hạng
            </button>
            <button 
              onClick={() => setActiveTab('matches')}
              className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'matches' ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Calendar size={18} />
              Lịch thi đấu
            </button>
            <button 
              onClick={() => setActiveTab('teams')}
              className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'teams' ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Users size={18} />
              Đội bóng
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'standings' && (
            <motion.div
              key="standings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Trophy className="text-emerald-500" />
                  Bảng Xếp Hạng
                </h2>
                <div className="text-xs text-zinc-500 font-mono">
                  Cập nhật: {new Date().toLocaleDateString('vi-VN')}
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                      <th className="px-6 py-4 w-16 text-center">Hạng</th>
                      <th className="px-6 py-4">Đội bóng</th>
                      <th className="px-4 py-4 text-center">Trận</th>
                      <th className="px-4 py-4 text-center">T</th>
                      <th className="px-4 py-4 text-center">H</th>
                      <th className="px-4 py-4 text-center">B</th>
                      <th className="px-4 py-4 text-center hidden md:table-cell">BT</th>
                      <th className="px-4 py-4 text-center hidden md:table-cell">BB</th>
                      <th className="px-4 py-4 text-center">HS</th>
                      <th className="px-6 py-4 text-center text-emerald-500">Điểm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {standings.map((stat, index) => {
                      const team = TEAMS.find(t => t.id === stat.teamId)!;
                      return (
                        <tr key={stat.teamId} className="group hover:bg-emerald-500/5 transition-colors">
                          <td className="px-6 py-5 text-center">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-black text-sm ${
                              index === 0 ? 'bg-emerald-500 text-black' : 
                              index === 1 ? 'bg-zinc-300 text-black' :
                              index === 2 ? 'bg-amber-600 text-white' : 'text-zinc-400'
                            }`}>
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center font-black text-emerald-500 border border-zinc-700">
                                {team.id}
                              </div>
                              <div>
                                <div className="font-bold text-zinc-100">{team.name}</div>
                                <div className="text-[10px] text-zinc-500 uppercase tracking-tighter font-medium">{team.shortName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-5 text-center font-mono text-zinc-300">{stat.played}</td>
                          <td className="px-4 py-5 text-center font-mono text-zinc-300">{stat.won}</td>
                          <td className="px-4 py-5 text-center font-mono text-zinc-300">{stat.drawn}</td>
                          <td className="px-4 py-5 text-center font-mono text-zinc-300">{stat.lost}</td>
                          <td className="px-4 py-5 text-center font-mono text-zinc-500 hidden md:table-cell">{stat.goalsFor}</td>
                          <td className="px-4 py-5 text-center font-mono text-zinc-500 hidden md:table-cell">{stat.goalsAgainst}</td>
                          <td className="px-4 py-5 text-center font-mono font-bold text-zinc-100">{stat.goalDifference > 0 ? `+${stat.goalDifference}` : stat.goalDifference}</td>
                          <td className="px-6 py-5 text-center">
                            <span className="text-xl font-black text-emerald-500">{stat.points}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'matches' && (
            <motion.div
              key="matches"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Calendar className="text-emerald-500" />
                  Lịch Thi Đấu & Kết Quả
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {matches.map((match) => (
                  <div 
                    key={match.id}
                    className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800/40 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                      <div className="flex flex-col items-center justify-center min-w-[100px] border-r border-zinc-800 pr-6">
                        <div className="text-2xl font-black text-zinc-100">{match.date}</div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Thứ {match.dayOfWeek}</div>
                        <div className="mt-2 px-2 py-0.5 rounded bg-zinc-800 text-[9px] font-bold text-zinc-400 uppercase">
                          {match.round}
                        </div>
                      </div>

                      <div className="flex-1 flex items-center justify-between w-full">
                        <div className="flex-1 flex flex-col items-end text-right gap-2">
                          <div className="text-lg font-bold text-zinc-100">{getTeamDisplay(match.homeTeamId, match)}</div>
                          <div className="text-[10px] text-zinc-500 uppercase font-medium">Chủ nhà</div>
                        </div>

                        <div className="mx-8 flex flex-col items-center gap-2">
                          {match.isFinished ? (
                            <div className="flex items-center gap-4">
                              <span className="text-4xl font-black text-emerald-500">{match.homeScore}</span>
                              <span className="text-zinc-700 font-black text-2xl">:</span>
                              <span className="text-4xl font-black text-emerald-500">{match.awayScore}</span>
                            </div>
                          ) : (
                            <div className="px-6 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 font-black text-xl tracking-tighter uppercase italic">
                              VS
                            </div>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col items-start text-left gap-2">
                          <div className="text-lg font-bold text-zinc-100">{getTeamDisplay(match.awayTeamId, match)}</div>
                          <div className="text-[10px] text-zinc-500 uppercase font-medium">Khách</div>
                        </div>
                      </div>

                      <div className="pl-6 border-l border-zinc-800 flex items-center">
                        <button 
                          onClick={() => {
                            setEditingMatch(match);
                            setHomeScore(match.homeScore?.toString() || '');
                            setAwayScore(match.awayScore?.toString() || '');
                          }}
                          className="p-3 rounded-xl bg-zinc-800 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all"
                        >
                          <Edit3 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'teams' && (
            <motion.div
              key="teams"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {TEAMS.map((team) => (
                <div key={team.id} className="p-8 rounded-3xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-black text-3xl font-black italic">
                      {team.id}
                    </div>
                    <div>
                      <h3 className="text-3xl font-black tracking-tighter uppercase italic">{team.name}</h3>
                      <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">{team.shortName}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {team.players.map((player, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-800/50">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-bold text-zinc-200">{player.name}</span>
                        </div>
                        {player.isCaptain && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase border border-emerald-500/20">
                            Captain
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Edit Score Modal */}
      <AnimatePresence>
        {editingMatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingMatch(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">Cập nhật tỉ số</h3>
                  <button onClick={() => setEditingMatch(null)} className="text-zinc-500 hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 mb-8">
                  <div className="flex-1 text-center">
                    <div className="text-xs font-bold text-zinc-500 uppercase mb-2 truncate">{getTeamName(editingMatch.homeTeamId)}</div>
                    <input 
                      type="number" 
                      value={homeScore}
                      onChange={(e) => setHomeScore(e.target.value)}
                      className="w-full bg-zinc-800 border-2 border-zinc-700 rounded-2xl p-4 text-center text-4xl font-black text-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="0"
                    />
                  </div>
                  <div className="text-2xl font-black text-zinc-700 pt-6">:</div>
                  <div className="flex-1 text-center">
                    <div className="text-xs font-bold text-zinc-500 uppercase mb-2 truncate">{getTeamName(editingMatch.awayTeamId)}</div>
                    <input 
                      type="number" 
                      value={awayScore}
                      onChange={(e) => setAwayScore(e.target.value)}
                      className="w-full bg-zinc-800 border-2 border-zinc-700 rounded-2xl p-4 text-center text-4xl font-black text-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setEditingMatch(null)}
                    className="flex-1 py-4 rounded-2xl bg-zinc-800 text-zinc-400 font-bold hover:bg-zinc-700 transition-all"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={handleSaveScore}
                    className="flex-2 py-4 rounded-2xl bg-emerald-500 text-black font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all"
                  >
                    <Save size={20} />
                    Lưu kết quả
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="max-w-5xl mx-auto px-4 py-12 border-t border-zinc-800/50 text-center">
        <div className="text-2xl font-black tracking-tighter uppercase italic mb-2">
          Bình Minh Cup <span className="text-emerald-500">LEAGUE</span>
        </div>
        <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">
          &copy; 2024 - All Rights Reserved. Designed for Champions.
        </p>
      </footer>
    </div>
  );
}
