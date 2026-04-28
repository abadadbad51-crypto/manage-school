import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface QuickActionProps {
  icon: any;
  label: string;
  onClick: () => void;
  color: string;
}

export const QuickAction = ({ icon: Icon, label, onClick, color }: QuickActionProps) => (
  <motion.button 
    whileHover={{ y: -8, scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="group relative flex flex-col items-center gap-3 md:gap-4 p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl md:rounded-[3rem] border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] transition-all duration-500 text-center overflow-hidden h-full justify-center"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/30 dark:to-slate-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    {/* Background Glow */}
    <div className={cn("absolute -top-10 -right-10 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full", color)} />

    <div className={cn("p-4 md:p-6 rounded-xl md:rounded-2xl transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110 shadow-xl md:shadow-2xl shadow-current/20 relative z-10", color)}>
      <Icon size={24} className="text-white md:size-[28px]" />
    </div>
    
    <div className="space-y-1 relative z-10">
      <span className="block text-xs md:text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors whitespace-nowrap">{label}</span>
    </div>
  </motion.button>
);
