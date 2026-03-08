import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplets,
  Wind,
  CheckCircle2,
  Circle,
  Plus,
  Coffee,
  Heart,
  Sparkles,
  Calendar,
  ChevronRight
} from 'lucide-react';

// --- Types ---
interface Ritual {
  id: string;
  title: string;
  description: string;
  iconId: string; // Changed from ReactNode to string for serialization
  category: 'Morning' | 'Day' | 'Evening';
  done: boolean;
}

const INITIAL_RITUALS: Ritual[] = [
  { id: '1', title: 'Start with Water', description: 'Rehydrate your body after sleep.', iconId: 'droplets', category: 'Morning', done: false },
  { id: '2', title: '5-min Meditation', description: 'Center your thoughts for the day.', iconId: 'wind', category: 'Morning', done: false },
  { id: '3', title: 'Mindful Coffee', description: 'No phone, just the aroma and taste.', iconId: 'coffee', category: 'Day', done: false },
  { id: '4', title: 'Gratitude Scan', description: 'Note 3 things you are grateful for.', iconId: 'heart', category: 'Evening', done: false },
  { id: '5', title: 'Evening Stretch', description: 'Release muscle tension from work.', iconId: 'sparkles', category: 'Evening', done: false },
];

const getIcon = (id: string) => {
  switch (id) {
    case 'droplets': return <Droplets size={24} />;
    case 'wind': return <Wind size={24} />;
    case 'coffee': return <Coffee size={24} />;
    case 'heart': return <Heart size={24} />;
    case 'sparkles': return <Sparkles size={24} />;
    default: return <Sparkles size={24} />;
  }
};

// --- Animation Variants ---
const containerVar = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVar = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// --- Main App ---

export default function App() {
  // Load from localStorage or use defaults
  const [rituals, setRituals] = useState<Ritual[]>(() => {
    try {
      const saved = localStorage.getItem('mindful-rituals');
      return saved ? JSON.parse(saved) : INITIAL_RITUALS;
    } catch (e) {
      console.error("Failed to parse rituals", e);
      return INITIAL_RITUALS;
    }
  });

  const [mood, setMood] = useState<string>(() => {
    return localStorage.getItem('mindful-mood') || '';
  });

  const [newRitualTitle, setNewRitualTitle] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [greet, setGreet] = useState('');

  // Save to localStorage whenever rituals change
  useEffect(() => {
    localStorage.setItem('mindful-rituals', JSON.stringify(rituals));
  }, [rituals]);

  // Save mood
  useEffect(() => {
    if (mood) localStorage.setItem('mindful-mood', mood);
  }, [mood]);

  useEffect(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) setGreet('Chào buổi sáng');
    else if (hrs < 18) setGreet('Chào buổi chiều');
    else setGreet('Chào buổi tối');
  }, []);

  const toggleRitual = (id: string) => {
    setRituals(prev => prev.map(r =>
      r.id === id ? { ...r, done: !r.done } : r
    ));
  };

  const addRitual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRitualTitle.trim()) return;

    const newRitual: Ritual = {
      id: Date.now().toString(),
      title: newRitualTitle,
      description: 'Thói quen mới của bạn.',
      iconId: 'sparkles',
      category: 'Day',
      done: false
    };

    setRituals(prev => [newRitual, ...prev]);
    setNewRitualTitle('');
    setShowAddModal(false);
  };

  const deleteRitual = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRituals(prev => prev.filter(r => r.id !== id));
  };

  const progress = rituals.length > 0
    ? Math.round((rituals.filter(r => r.done).length / rituals.length) * 100)
    : 0;

  return (
    <div className="min-h-screen py-8 px-4 md:px-12 max-w-5xl mx-auto flex flex-col gap-10">

      {/* Header section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-1"
        >
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
            <Calendar size={14} />
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <h1 className="text-4xl">
            {greet}, <span className="text-gradient">Bạn</span> 🌿
          </h1>
          <p className="text-text-dim text-sm">Dữ liệu của bạn được lưu cục bộ trên trình duyệt.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-5 flex items-center gap-4 border-primary-light"
        >
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32" cy="32" r="28"
                stroke="var(--secondary)"
                strokeWidth="6"
                fill="transparent"
              />
              <motion.circle
                cx="32" cy="32" r="28"
                stroke="var(--primary)"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={175}
                animate={{ strokeDashoffset: 175 - (175 * progress) / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <span className="absolute text-xs font-bold text-primary">{progress}%</span>
          </div>
          <div>
            <h3 className="text-sm font-bold">Tiến độ hôm nay</h3>
            <p className="text-[10px] text-text-dim uppercase tracking-wider">{rituals.filter(r => r.done).length}/{rituals.length} hoàn thành</p>
          </div>
        </motion.div>
      </header>

      {/* Main content */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Stats & Motivation */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20"
          >
            <h3 className="flex items-center gap-2 mb-4 text-primary">
              <Sparkles size={18} /> Gợi ý nhỏ
            </h3>
            <p className="text-sm italic text-text-dim">
              "Hãy bắt đầu từ những việc nhỏ nhất để tạo nên thay đổi lớn."
            </p>
            <div className="mt-6 flex justify-between items-end">
              <div>
                <span className="block text-2xl font-bold">Local</span>
                <span className="text-[10px] text-text-dim uppercase">Storage Active</span>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="button-primary scale-90"
              >
                Thêm mới <Plus size={14} />
              </button>
            </div>
          </motion.div>

          {/* New Ritual Modal (Simplified Overlay) */}
          <AnimatePresence>
            {showAddModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowAddModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  onClick={e => e.stopPropagation()}
                  className="glass p-8 w-full max-w-sm"
                >
                  <h3 className="text-xl mb-4 text-center">Tạo thói quen mới</h3>
                  <form onSubmit={addRitual} className="flex flex-col gap-4">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Tên thói quen..."
                      value={newRitualTitle}
                      onChange={e => setNewRitualTitle(e.target.value)}
                      className="w-full p-4 rounded-2xl bg-secondary/50 border-none focus:ring-2 focus:ring-primary outline-none text-sm"
                    />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 p-3 rounded-2xl font-bold text-xs uppercase tracking-widest bg-secondary text-text-dim">Hủy</button>
                      <button type="submit" className="flex-1 button-primary justify-center text-xs uppercase tracking-widest">Lưu</button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Filter or Mood */}
          <div className="glass p-6">
            <h3 className="text-sm mb-4">Hôm nay bạn thấy: <span className="text-primary font-bold">{mood}</span></h3>
            <div className="flex justify-between gap-2">
              {['😌', '😊', '🤔', '😴', '💪'].map(emoji => (
                <motion.button
                  key={emoji}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMood(emoji)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-colors ${mood === emoji ? 'bg-primary/20 shadow-inner' : 'bg-secondary/50'}`}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Rituals List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl">Canh tác Hào Quang 2</h2>
            <button
              onClick={() => {
                if (confirm('Bạn có muốn reset về mặc định?')) {
                  setRituals(INITIAL_RITUALS);
                  localStorage.removeItem('mindful-rituals');
                }
              }}
              className="text-[10px] text-accent font-bold uppercase tracking-wider hover:underline"
            >
              Reset Data
            </button>
          </div>

          <motion.div
            variants={containerVar}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-3"
          >
            <AnimatePresence mode="popLayout">
              {rituals.map((ritual) => (
                <motion.div
                  layout
                  key={ritual.id}
                  variants={itemVar}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => toggleRitual(ritual.id)}
                  className={`glass card-hover p-4 flex items-center gap-4 cursor-pointer group relative ${ritual.done ? 'bg-secondary/30 opacity-70' : ''}`}
                >
                  <div className={`p-3 rounded-2xl transition-colors ${ritual.done ? 'bg-primary/20 text-primary' : 'bg-white text-text-dim group-hover:bg-primary/10'}`}>
                    {getIcon(ritual.iconId)}
                  </div>

                  <div className="flex-1">
                    <h4 className={`text-sm tracking-tight ${ritual.done ? 'line-through text-text-dim' : ''}`}>
                      {ritual.title}
                    </h4>
                    <p className="text-[11px] text-text-dim line-clamp-1">{ritual.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => deleteRitual(ritual.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-accent hover:bg-accent/10 rounded-lg transition-all"
                    >
                      <Plus size={16} className="rotate-45" />
                    </button>
                    {ritual.done ? (
                      <CheckCircle2 className="text-primary" size={24} />
                    ) : (
                      <Circle className="text-secondary group-hover:text-primary-light" size={24} />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {rituals.length === 0 && (
              <div className="py-20 flex flex-col items-center text-text-dim gap-4 border-2 border-dashed border-secondary rounded-3xl">
                <Sparkles size={40} className="opacity-20" />
                <p className="text-sm font-medium">Chưa có thói quen nào. Hãy thêm mới nhé!</p>
              </div>
            )}
          </motion.div>

          <motion.button
            whileHover={{ x: 5 }}
            className="flex items-center gap-2 text-sm text-primary font-bold self-start mt-4 group"
          >
            Xem thêm lịch trình <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

      </main>

      {/* Footer Branding */}
      <footer className="mt-auto py-12 border-t border-secondary flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-dim font-medium">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
            <Sparkles size={14} />
          </div>
          <span className="font-bold tracking-tight text-text-main">MindfulRitual</span>
        </div>
        <p>&copy; 2026 Crafted with Care • Sống chậm lại, yêu thương nhiều hơn</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary transition-colors">Về chúng tôi</a>
          <a href="#" className="hover:text-primary transition-colors">Hướng dẫn</a>
        </div>
      </footer>
    </div>
  );
}
