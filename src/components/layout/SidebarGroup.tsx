import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarGroupProps {
  icon: any;
  label: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export const SidebarGroup = ({ icon: Icon, label, children, isOpen, onToggle }: SidebarGroupProps) => (
  <div className="space-y-1">
    <button
      onClick={onToggle}
      className={cn(
        "flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} />
        <span className="font-medium text-sm">{label}</span>
      </div>
      <ChevronDown size={16} className={cn("transition-transform duration-300", isOpen && "rotate-180")} />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden pr-4 space-y-1"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
