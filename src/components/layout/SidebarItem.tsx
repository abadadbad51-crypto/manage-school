import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface SidebarItemProps {
  icon: any;
  label: string;
  active?: boolean;
  onClick: () => void;
}

export const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <motion.button 
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 font-medium group relative overflow-hidden",
      active 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/40" 
        : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
    )}
  >
    {active && (
      <motion.div 
        layoutId="sidebar-active"
        className="absolute inset-0 bg-blue-600 -z-10"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <Icon size={20} className={cn("transition-transform duration-300 group-hover:scale-110", active ? "text-white" : "text-slate-400 group-hover:text-blue-500")} />
    <span className="text-sm z-10">{label}</span>
    {active && (
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute left-3 w-1.5 h-1.5 rounded-full bg-white/40"
      />
    )}
  </motion.button>
);
