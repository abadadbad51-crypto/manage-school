import React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white dark:bg-[#141415] rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm p-6 transition-colors", className)}>
    {children}
  </div>
);
