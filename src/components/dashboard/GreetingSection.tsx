import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface GreetingSectionProps {
  user: any;
}

export const GreetingSection = ({ user }: GreetingSectionProps) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'صباح الخير' : hour < 18 ? 'مرحباً مجدداً' : 'مساء الخير';
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-6 relative overflow-hidden p-4 md:p-5 bg-white dark:bg-[#141415] rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm transition-all duration-300"
    >
      {/* Dynamic Background Elements - Smaller & Subtler */}
      <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-blue-50/30 dark:from-blue-950/20 to-transparent pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/5 dark:bg-blue-400/5 blur-[30px] rounded-full animate-pulse" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-indigo-500/5 dark:bg-indigo-400/5 blur-[30px] rounded-full animate-pulse " style={{ animationDelay: '1s' }} />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-[0.1em] border border-blue-100/50 dark:border-blue-500/20">
            <Sparkles size={10} className="animate-pulse" />
            نظام إدارة المدرسة
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black text-slate-800 dark:text-white leading-[1.2] tracking-tight">
              {greeting}، <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-300">
                {user?.email?.split('@')[0]}
              </span> 👋
            </h1>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 font-medium text-xs max-w-lg">
            إليك ملخص اليوم السريع، ليكون يومك رائعاً ومثمراً.
          </p>
        </div>

        <div className="flex flex-row gap-2.5">
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#202022]/50 rounded-xl border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center min-w-[80px] group transition-all duration-300 hover:bg-white dark:hover:bg-slate-800">
             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Clock size={10} /> الوقت</p>
             <p className="text-lg font-black text-slate-800 dark:text-white tabular-nums">{format(new Date(), 'HH:mm')}</p>
          </div>
          <div className="px-4 py-2.5 bg-blue-600 rounded-xl shadow-sm text-white flex flex-col items-center justify-center min-w-[80px] group hover:scale-[1.02] transition-all duration-300">
             <p className="text-[8px] font-black text-blue-100 uppercase tracking-widest mb-1 flex items-center gap-1"><Calendar size={10} /> التاريخ</p>
             <p className="text-lg font-black tabular-nums">{format(new Date(), 'dd MMM', { locale: ar })}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
