/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Calendar, Smile, Send, X } from 'lucide-react';

interface Entry {
  id: string;
  date: string;
  emoji: string;
  text: string;
  timestamp: number;
}

const EMOJIS = ['😊', '🤩', '😐', '😔', '😡'];

export default function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentEmoji, setCurrentEmoji] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  // Load entries from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mood_diary_entries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing entries from localStorage', e);
      }
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mood_diary_entries', JSON.stringify(entries));
  }, [entries]);

  const handleSave = () => {
    if (!text.trim() || !currentEmoji) return;

    const newEntry: Entry = {
      id: crypto.randomUUID(),
      date,
      emoji: currentEmoji,
      text: text.trim(),
      timestamp: Date.now(),
    };

    setEntries([newEntry, ...entries]);
    setText('');
    setCurrentEmoji(null);
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#212529] font-sans antialiased overflow-x-hidden">
      <div className="max-w-[1024px] mx-auto p-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-[32px] font-bold text-[#212529] leading-tight">Mood Diary</h1>
          <p className="text-[#868E96] mt-1 text-base">Как ты чувствуешь себя сегодня?</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 flex-1">
          {/* Input Section */}
          <section>
            <div className="bg-white rounded-[20px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] p-6 border border-[#EDEDED]">
              <div className="space-y-5">
                <div>
                  <label className="block text-[12px] font-bold text-[#495057] uppercase tracking-[0.5px] mb-2 leading-none">
                    Дата
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white border border-[#DEE2E6] rounded-xl px-3 py-3 text-sm focus:border-[#A5D8FF] outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#495057] uppercase tracking-[0.5px] mb-2 leading-none">
                    Эмоция
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setCurrentEmoji(emoji)}
                        className={`aspect-square flex items-center justify-center text-2xl rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                          currentEmoji === emoji
                            ? 'bg-[#E7F5FF] border-[#339AF0] scale-[1.05] opacity-100 shadow-sm'
                            : currentEmoji
                              ? 'bg-[#F1F3F5] border-transparent opacity-40'
                              : 'bg-[#F1F3F5] border-transparent opacity-100'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#495057] uppercase tracking-[0.5px] mb-2 leading-none">
                    Заметки
                  </label>
                  <textarea
                    placeholder="Что произошло сегодня?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full bg-white border border-[#DEE2E6] rounded-xl px-3 py-3 text-sm focus:border-[#A5D8FF] outline-none transition-colors resize-none h-[120px]"
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={!text.trim() || !currentEmoji}
                  className="w-full bg-[#339AF0] hover:bg-[#228BE6] text-white font-semibold py-[14px] rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Сохранить запись
                </button>
              </div>
            </div>
          </section>

          {/* List Section */}
          <section className="flex flex-col min-h-0">
            <h2 className="text-[14px] font-bold text-[#adb5bd] uppercase tracking-[1px] mb-4">
              Последние записи
            </h2>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-10">
              <AnimatePresence initial={false}>
                {entries.length === 0 ? (
                  <div className="text-center py-20 bg-white/50 rounded-2xl border border-dashed border-[#DEE2E6] text-[#adb5bd] italic">
                    Записей пока нет...
                  </div>
                ) : (
                  entries.map((entry) => (
                    <motion.div
                      layout
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      className="group relative bg-white p-6 rounded-[20px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-[#EDEDED] transition-all flex items-center"
                    >
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="absolute top-3 right-3 bg-[#FFF0F0] text-[#FF6B6B] w-6 h-6 rounded-md flex items-center justify-center text-lg leading-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#FFE3E3]"
                        title="Удалить"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                      
                      <div className="w-10 h-10 bg-[#F8F9FA] rounded-full flex items-center justify-center text-xl mr-4 shrink-0">
                        {entry.emoji}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-[#868E96] font-medium leading-none mb-1">
                          {entry.date}
                        </div>
                        <div className="text-base text-[#212529] font-normal leading-normal whitespace-pre-wrap">
                          {entry.text}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
