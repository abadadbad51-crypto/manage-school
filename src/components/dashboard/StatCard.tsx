import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

// We assume Card is available from ui components
import { Card } from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  trend?: { value: string; positive: boolean };
}

export const StatCard = ({ title, value, icon: Icon, color, trend }: StatCardProps) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="h-full"
  >
    <Card className="relative h-full overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500 border-none bg-white dark:bg-[#141415] shadow-sm rounded-[1.5rem] p-6">
      {/* Decorative Gradient */}
      <div className={cn("absolute -top-20 -right-20 w-64 h-64 blur-3xl opacity-5 group-hover:opacity-10 transition-opacity duration-700 rounded-full", color)} />
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-4">
          <p className="text-slate-400 dark:text-zinc-500 text-xs font-black uppercase tracking-widest">{title}</p>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tighter tabular-nums">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {value}
              </motion.span>
            </h3>
            {trend && (
              <div className="flex items-center gap-1.5 pt-1">
                <span className={cn(
                  "text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1",
                  trend.positive ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" : "bg-rose-50 text-rose-600 dark:bg-rose-500/10"
                )}>
                  {trend.positive ? <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> : <div className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />}
                  {trend.value}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">مقارنة بالشهر الماضي</span>
              </div>
            )}
          </div>
        </div>
        <div className={cn("p-4 rounded-2xl shadow-2xl shadow-current/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500", color)}>
          <Icon size={24} className="text-white" />
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em]">معدل الإنجاز</span>
          <span className="text-[10px] font-black text-slate-700 dark:text-zinc-300">75%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-[#202022] rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "75%" }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className={cn("h-full rounded-full", color)}
          />
        </div>
      </div>
    </Card>
  </motion.div>
);
