import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, Square, ClipboardList, ChevronDown, 
  PlusCircle, Plus, AlarmClock, X, Trash2 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card } from '../ui/Card';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  reminderTime?: string;
  reminded?: boolean;
}

interface TodoWidgetProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  newTodoText: string;
  setNewTodoText: React.Dispatch<React.SetStateAction<string>>;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const TodoWidget = ({ 
  todos, setTodos, newTodoText, setNewTodoText, collapsed, onToggleCollapse 
}: TodoWidgetProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [reminderTime, setReminderTime] = useState('');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    const newTodo = {
      id: Date.now().toString(),
      text: newTodoText,
      completed: false,
      reminderTime: reminderTime || undefined,
      reminded: false
    };
    setTodos([newTodo, ...todos]); // Add to top
    setNewTodoText('');
    setReminderTime('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(t => !t.completed));
  };

  return (
    <Card className={cn("flex flex-col transition-all duration-300", collapsed ? "h-auto min-h-0" : "h-full min-h-[400px]")}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <ClipboardList size={18} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">قائمة المهام</h3>
        </div>
        <div className="flex items-center gap-2">
          {onToggleCollapse && (
            <button 
              onClick={onToggleCollapse}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-all"
            >
              <ChevronDown size={20} className={cn("transition-transform duration-300", collapsed && "rotate-180")} />
            </button>
          )}
          {!collapsed && todos.some(t => t.completed) && (
            <button 
              onClick={clearCompleted}
              className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-wider"
            >
              مسح المكتمل
            </button>
          )}
          {!collapsed && (
            <button 
              onClick={() => inputRef.current?.focus()}
              className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1.5 rounded-lg transition-all"
            >
              <PlusCircle size={20} />
            </button>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden flex flex-col flex-1"
          >
            <form onSubmit={addTodo} className="space-y-3 mb-6">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  placeholder="أضف مهمة جديدة..."
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#202022] text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <button 
                  type="submit" 
                  disabled={!newTodoText.trim()}
                  className="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-50 disabled:shadow-none"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex items-center gap-2 px-1">
                <div className="flex items-center gap-2 text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-[#202022]/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-white/10 transition-all">
                  <AlarmClock size={14} />
                  <span className="text-[10px] font-bold">وقت التذكير:</span>
                  <input 
                    type="time" 
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-bold text-slate-600 dark:text-zinc-300 focus:ring-0 p-0 w-20"
                  />
                </div>
                {reminderTime && (
                  <button 
                    type="button"
                    onClick={() => setReminderTime('')}
                    className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 p-1 rounded-md transition-all"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </form>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {todos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-[#202022]/50 flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} className="opacity-20" />
                  </div>
                  <p className="text-sm font-medium">لا توجد مهام حالية</p>
                  <p className="text-[10px] mt-1">ابدأ بإضافة مهامك اليومية هنا</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {todos.map(todo => (
                    <motion.div 
                      key={todo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl border transition-all group",
                        todo.completed 
                          ? "bg-slate-50/50 dark:bg-[#202022]/30 border-transparent opacity-60" 
                          : "bg-white dark:bg-[#202022] border-slate-100 dark:border-white/10 shadow-sm hover:border-blue-200 dark:hover:border-blue-800"
                      )}
                    >
                      <button 
                        onClick={() => toggleTodo(todo.id)} 
                        className={cn(
                          "transition-colors",
                          todo.completed ? "text-emerald-500" : "text-slate-300 dark:text-slate-600 hover:text-blue-500"
                        )}
                      >
                        {todo.completed ? <CheckCircle2 size={22} /> : <Square size={22} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <span className={cn(
                          "block text-sm font-bold transition-all truncate",
                          todo.completed ? "text-slate-400 line-through" : "text-slate-700 dark:text-zinc-200"
                        )}>
                          {todo.text}
                        </span>
                        {todo.reminderTime && (
                          <div className={cn(
                            "flex items-center gap-1 mt-1",
                            todo.reminded ? "text-rose-500" : "text-blue-500"
                          )}>
                            <AlarmClock size={10} />
                            <span className="text-[9px] font-black">{todo.reminderTime}</span>
                            {todo.reminded && <span className="text-[8px] font-bold">(تم التذكير)</span>}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => deleteTodo(todo.id)} 
                        className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-50 dark:border-white/5 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {todos.filter(t => !t.completed).length} مهام متبقية
              </span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
