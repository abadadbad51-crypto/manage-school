import * as XLSX from 'xlsx';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  auth, db, handleFirestoreError, OperationType, type FirestoreErrorInfo 
} from './firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  onSnapshot, 
  query, 
  where, 
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  CreditCard, 
  Bell, 
  LogOut, 
  Plus, 
  Search,
  Clock,
  Menu,
  X,
  UserCircle,
  FileText,
  Trophy,
  Book,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  MessageSquare,
  Info,
  Send,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ArrowLeftRight,
  Phone,
  Mail,
  Edit,
  Trash2,
  LayoutGrid,
  Lock,
  Eye,
  EyeOff,
  User,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  Moon, 
  Sun, 
  Check, 
  Square, 
  PlusCircle,
  AlarmClock,
  Palette,
  Layout as LayoutIcon,
  ShoppingBag,
  Truck,
  FileSpreadsheet,
  Settings,
  Database,
  Globe,
  Wallet,
  Building2,
  Box,
  BrainCircuit,
  MessageCircle,
  CreditCard as FinanceIcon,
  CreditCard as PaymentIcon,
  FileCheck,
  TrendingDown,
  Activity,
  History,
  ShieldCheck,
  ShoppingCart,
  MapPin,
  ClipboardCheck,
  Languages,
  UserPlus,
  Cloud,
  Layers,
  PhoneCall,
  Smartphone
} from 'lucide-react';
import { UserRole, UserProfile, AvailabilitySlot, TeacherAvailability, AppConfig, InventoryItem, Transaction, BusRoute, BusSubscription } from './types';
import { cn } from './lib/utils';
import { Card } from './components/ui/Card';
import { FinanceModule } from './components/FinanceModule';
import { AcademicModule } from './components/AcademicModule';
import { LogisticsModule } from './components/LogisticsModule';
import { CommunicationModule } from './components/CommunicationModule';
import { SettingsModule } from './components/SettingsModule';

import { generateSmartSchedule } from './services/geminiService';

// --- Error Handling ---
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "حدث خطأ غير متوقع. يرجى إعادة تحميل الصفحة.";
      let details = "";

      try {
        const parsedError = JSON.parse(this.state.error?.message || "{}");
        if (parsedError.error) {
          if (parsedError.error.includes("Missing or insufficient permissions")) {
            errorMessage = "عذراً، ليس لديك الصلاحيات الكافية للقيام بهذه العملية أو الوصول إلى هذه البيانات.";
          } else if (parsedError.error.includes("Quota exceeded")) {
            errorMessage = "تم تجاوز حصة الاستخدام المتاحة لليوم. يرجى المحاولة مرة أخرى غداً.";
          }
          details = parsedError.error;
        }
      } catch (e) {
        details = this.state.error?.message || "";
      }

      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 text-center transition-colors" dir="rtl">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-10 border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{errorMessage}</h2>
            {details && (
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-xs text-slate-500 dark:text-slate-400 font-mono mb-6 break-all text-left dir-ltr border border-slate-100 dark:border-slate-700">
                {details}
              </div>
            )}
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/20"
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <motion.button 
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 font-medium group relative overflow-hidden",
      active 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/40" 
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
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

const SidebarGroup = ({ icon: Icon, label, children, isOpen, onToggle }: { icon: any, label: string, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) => (
  <div className="space-y-1">
    <button
      onClick={onToggle}
      className={cn(
        "flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
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

const GreetingSection = ({ user }: { user: any }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'صباح الخير والتميز' : hour < 18 ? 'مرحباً بك مجدداً' : 'مساء الخير والإنتاجية';
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-12 relative overflow-hidden p-8 md:p-12 bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-[0_20px_60px_-15px_rgba(37,99,235,0.05)] transition-all duration-500"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 dark:from-blue-950/20 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/5 dark:bg-blue-400/5 blur-[100px] rounded-full animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/5 dark:bg-indigo-400/5 blur-[100px] rounded-full animate-pulse " style={{ animationDelay: '1s' }} />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div className="space-y-4 md:space-y-6">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 md:px-4 md:py-2 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em] border border-blue-100/50 dark:border-blue-800/30 shadow-sm">
            <Sparkles size={12} className="animate-pulse" />
            نظام إدارة المدرسة المتكامل
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter">
              {greeting}، <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-300">
                {user?.email?.split('@')[0]}
              </span> 👋
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-base md:text-xl max-w-xl leading-relaxed">
            نتمنى لك يوماً دراسياً موفقاً. لقد قمنا بتجهيز ملخص اليوم لمساعدتك على اتخاذ القرارات الصحيحة.
          </p>
        </div>

        <div className="flex flex-row md:flex-row gap-3 md:gap-4 shrink-0 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <div className="p-4 md:p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl md:rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 text-center flex flex-col items-center justify-center min-w-[110px] md:min-w-[160px] group hover:bg-white dark:hover:bg-slate-800 transition-all duration-300">
             <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-white dark:bg-slate-700 shadow-sm mb-2 md:mb-3 group-hover:scale-110 transition-transform">
               <Clock size={20} className="text-blue-600 dark:text-blue-400" />
             </div>
             <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">الوقت الحالي</p>
             <p className="text-xl md:text-3xl font-black text-slate-800 dark:text-white tabular-nums">{format(new Date(), 'HH:mm')}</p>
          </div>
          <div className="p-4 md:p-8 bg-blue-600 rounded-3xl md:rounded-[2.5rem] shadow-xl md:shadow-2xl shadow-blue-500/20 text-center flex flex-col items-center justify-center min-w-[110px] md:min-w-[160px] group hover:scale-[1.02] transition-all duration-300 text-white">
             <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-md mb-2 md:mb-3 group-hover:rotate-6 transition-transform">
               <Calendar size={20} />
             </div>
             <p className="text-[8px] md:text-[10px] font-black text-blue-100 uppercase tracking-widest mb-0.5 md:mb-1">تاريخ اليوم</p>
             <p className="text-xl md:text-3xl font-black tabular-nums">{format(new Date(), 'dd MMM', { locale: ar })}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const QuickAction = ({ icon: Icon, label, onClick, color }: { icon: any, label: string, onClick: () => void, color: string }) => (
  <motion.button 
    whileHover={{ y: -8, scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="group relative flex flex-col items-center gap-3 md:gap-4 p-4 md:p-8 bg-white dark:bg-slate-900 rounded-3xl md:rounded-[3rem] border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] transition-all duration-500 text-center overflow-hidden h-full justify-center"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/30 dark:to-slate-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    {/* Background Glow */}
    <div className={cn("absolute -top-10 -right-10 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full", color)} />

    <div className={cn("p-4 md:p-6 rounded-xl md:rounded-2xl transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110 shadow-xl md:shadow-2xl shadow-current/20 relative z-10", color)}>
      <Icon size={24} className="text-white md:size-[28px]" />
    </div>
    
    <div className="space-y-1 relative z-10">
      <span className="block text-xs md:text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors whitespace-nowrap">{label}</span>
      <div className="w-0 group-hover:w-full h-0.5 bg-blue-500/50 dark:bg-blue-400/50 mx-auto transition-all duration-500 rounded-full" />
    </div>
  </motion.button>
);

const StatCard = ({ title, value, icon: Icon, color, trend }: { title: string, value: string | number, icon: any, color: string, trend?: { value: string, positive: boolean } }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="h-full"
  >
    <Card className="relative h-full overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500 border-none bg-white dark:bg-slate-900 shadow-sm rounded-[2.5rem] p-8">
      {/* Decorative Gradient */}
      <div className={cn("absolute -top-20 -right-20 w-64 h-64 blur-3xl opacity-5 group-hover:opacity-10 transition-opacity duration-700 rounded-full", color)} />
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-4">
          <p className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest">{title}</p>
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tighter tabular-nums">
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
                  trend.positive ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" : "bg-rose-50 text-rose-600 dark:bg-rose-900/20"
                )}>
                  {trend.positive ? <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> : <div className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />}
                  {trend.value}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">مقارنة بالشهر الماضي</span>
              </div>
            )}
          </div>
        </div>
        <div className={cn("p-5 rounded-[1.5rem] shadow-2xl shadow-current/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500", color)}>
          <Icon size={26} className="text-white" />
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">معدل الإنجاز</span>
          <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">75%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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

const SortableWidget = ({ id, children }: { id: string, children: React.ReactNode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group h-full">
      <div 
        {...attributes} 
        {...listeners}
        className="absolute top-4 right-4 z-10 p-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={16} className="text-slate-400" />
      </div>
      {children}
    </div>
  );
};

const TodoWidget = ({ todos, setTodos, newTodoText, setNewTodoText, collapsed, onToggleCollapse }: { 
  todos: { id: string; text: string; completed: boolean; reminderTime?: string; reminded?: boolean }[], 
  setTodos: React.Dispatch<React.SetStateAction<{ id: string; text: string; completed: boolean; reminderTime?: string; reminded?: boolean }[]>>,
  newTodoText: string,
  setNewTodoText: React.Dispatch<React.SetStateAction<string>>,
  collapsed?: boolean,
  onToggleCollapse?: () => void
}) => {
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
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
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
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 transition-all">
                  <AlarmClock size={14} />
                  <span className="text-[10px] font-bold">وقت التذكير:</span>
                  <input 
                    type="time" 
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-bold text-slate-600 dark:text-slate-300 focus:ring-0 p-0 w-20"
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
                  <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-4">
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
                          ? "bg-slate-50/50 dark:bg-slate-800/30 border-transparent opacity-60" 
                          : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-sm hover:border-blue-200 dark:hover:border-blue-800"
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
                          todo.completed ? "text-slate-400 line-through" : "text-slate-700 dark:text-slate-200"
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
            
            <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
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

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [userName, setUserName] = useState('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState<string | undefined>(undefined);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isAddStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [isAddClassModalOpen, setAddClassModalOpen] = useState(false);
  const [isAddTeacherModalOpen, setAddTeacherModalOpen] = useState(false);
  const [isClassScheduleModalOpen, setClassScheduleModalOpen] = useState(false);
  const [selectedClassForSchedule, setSelectedClassForSchedule] = useState<any>(null);
  const [classSchedule, setClassSchedule] = useState<any[]>([]);
  const [isStudentProfileModalOpen, setStudentProfileModalOpen] = useState(false);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<any>(null);
  const [isTeacherProfileModalOpen, setTeacherProfileModalOpen] = useState(false);
  const [selectedTeacherForProfile, setSelectedTeacherForProfile] = useState<any>(null);
  const [studentGrades, setStudentGrades] = useState<any[]>([]);
  const [studentSchedule, setStudentSchedule] = useState<any[]>([]);
  const [studentAssignments, setStudentAssignments] = useState<any[]>([]);
  const [studentAttendance, setStudentAttendance] = useState<any[]>([]);
  const [studentResources, setStudentResources] = useState<any[]>([]);
  const [studentNotifications, setStudentNotifications] = useState<any[]>([]);
  const [studentMessages, setStudentMessages] = useState<any[]>([]);
  const [profileTab, setProfileTab] = useState('overview');
  const [teacherProfileTab, setTeacherProfileTab] = useState('overview');
  const [subjectProfileTab, setSubjectProfileTab] = useState('overview');
  const [newGrade, setNewGrade] = useState({ subject: '', score: '', term: '' });
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', classId: '', section: '', parentName: '', parentPhone: '' });
  const [newClass, setNewClass] = useState({ name: '', gradeId: '', section: '', teacherId: '' });
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '', subjects: [] as string[], phone: '' });
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isAddSubjectModalOpen, setAddSubjectModalOpen] = useState(false);
  const [isSubjectProfileModalOpen, setSubjectProfileModalOpen] = useState(false);
  const [selectedSubjectForProfile, setSelectedSubjectForProfile] = useState<any>(null);
  const [newSubject, setNewSubject] = useState({ name: '', code: '', color: 'blue', description: '', totalMarks: 100 });

  const getGradeName = (id: string) => {
    const names: Record<string, string> = {
      '1': 'الصف الأول',
      '2': 'الصف الثاني',
      '3': 'الصف الثالث',
      '4': 'الصف الرابع',
      '5': 'الصف الخامس'
    };
    return names[id] || `الصف ${id}`;
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isEditScheduleModalOpen, setEditScheduleModalOpen] = useState(false);
  const [isEditSlotModalOpen, setEditSlotModalOpen] = useState(false);
  const [selectedSlotForEdit, setSelectedSlotForEdit] = useState<any>(null);
  const [selectedClassForEdit, setSelectedClassForEdit] = useState<string>('');
  const [editingScheduleEntries, setEditingScheduleEntries] = useState<any[]>([]);
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);
  const [teacherAvailability, setTeacherAvailability] = useState<AvailabilitySlot[]>([]);
  const [isSavingAvailability, setIsSavingAvailability] = useState(false);
  const [selectedTeacherIdForAvailability, setSelectedTeacherIdForAvailability] = useState<string | null>(null);
  const [isGenerateScheduleDropdownOpen, setIsGenerateScheduleDropdownOpen] = useState(false);
  const [collapsedWidgets, setCollapsedWidgets] = useState<Record<string, boolean>>({});
  const [appConfig, setAppConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('appConfig');
    return saved ? JSON.parse(saved) : {
      modules: {
        accounting: true,
        inventory: true,
        busTracking: true,
        scheduler: true,
        examManagement: true,
        applicantPortal: true,
        crm: true
      },
      language: 'ar'
    };
  });

  const [openSidebarGroups, setOpenSidebarGroups] = useState<Record<string, boolean>>({
    'management': true,
    'financial': true,
    'logistics': false,
    'academic': false,
    'others': false
  });

  useEffect(() => {
    localStorage.setItem('appConfig', JSON.stringify(appConfig));
  }, [appConfig]);

  const toggleModule = (moduleKey: keyof AppConfig['modules']) => {
    setAppConfig(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [moduleKey]: !prev.modules[moduleKey]
      }
    }));
  };

  const toggleLanguage = () => {
    setAppConfig(prev => ({
      ...prev,
      language: prev.language === 'ar' ? 'en' : 'ar'
    }));
  };

  const toggleSidebarGroup = (id: string) => {
    setOpenSidebarGroups(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSidebarItemClick = (tab: string, subTab?: string) => {
    setActiveTab(tab);
    setActiveSubTab(subTab);
    if (window.innerWidth < 1024) { // lg breakpoint
      setSidebarOpen(false);
    }
  };

  const syncSubTab = (subTab: string) => {
    setActiveSubTab(subTab);
  };

  const toggleWidgetCollapse = (id: string) => {
    setCollapsedWidgets(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Attendance Reporting State
  const [allSchedules, setAllSchedules] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [attendanceFilters, setAttendanceFilters] = useState({
    startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    studentId: '',
    classId: ''
  });
  const [attendanceViewMode, setAttendanceViewMode] = useState<'list' | 'grouped'>('list');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  const [todos, setTodos] = useState<{ id: string; text: string; completed: boolean; reminderTime?: string; reminded?: boolean }[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adminTodos');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [newTodoText, setNewTodoText] = useState('');
  const [dashboardWidgets, setDashboardWidgets] = useState<string[]>(() => {
    const defaults = ['greeting', 'quick_actions', 'stats', 'performance', 'studentDist', 'fees', 'todos'];
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboardWidgets');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Add greeting and quick_actions if they don't exist
        const missing = defaults.filter(w => (w === 'greeting' || w === 'quick_actions') && !parsed.includes(w));
        if (missing.length > 0) return [...missing, ...parsed];
        return parsed;
      }
      return defaults;
    }
    return defaults;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('adminTodos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(dashboardWidgets));
  }, [dashboardWidgets]);

  // Reminder Check Logic
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = format(now, 'HH:mm');
      
      setTodos(prevTodos => {
        let changed = false;
        const newTodos = prevTodos.map(todo => {
          if (todo.reminderTime === currentTime && !todo.reminded && !todo.completed) {
            changed = true;
            // Add notification
            const newNotif = {
              title: 'تذكير بمهمة',
              message: `حان وقت تنفيذ المهمة: ${todo.text}`,
              date: Timestamp.now(),
              read: false,
              type: 'reminder'
            };
            addDoc(collection(db, 'notifications'), newNotif);
            
            return { ...todo, reminded: true };
          }
          return todo;
        });
        return changed ? newTodos : prevTodos;
      });
    };

    const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Ensure 'todos' widget is present for existing users
  useEffect(() => {
    if (!dashboardWidgets.includes('todos')) {
      setDashboardWidgets(prev => [...prev, 'todos']);
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setDashboardWidgets((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const [expandedGrades, setExpandedGrades] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isMoveStudentModalOpen, setMoveStudentModalOpen] = useState(false);
  const [studentToMove, setStudentToMove] = useState<any>(null);
  const [moveData, setMoveData] = useState({ classId: '', section: '' });

  // Data States
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (isEditScheduleModalOpen && selectedClassForEdit) {
      const q = query(collection(db, 'schedules'), where('classId', '==', selectedClassForEdit));
      const unsubscribe = onSnapshot(q, (snap) => {
        setEditingScheduleEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
      return () => unsubscribe();
    } else {
      setEditingScheduleEntries([]);
    }
  }, [isEditScheduleModalOpen, selectedClassForEdit]);

  useEffect(() => {
    // Handle redirect result
    getRedirectResult(auth).catch((error) => {
      handleLoginError(error);
    });

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthError(null);
      try {
        if (u) {
          let userDoc;
          try {
            userDoc = await getDoc(doc(db, 'users', u.uid));
          } catch (e: any) {
            handleFirestoreError(e, OperationType.GET, `users/${u.uid}`);
            return;
          }

          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            const isAdminEmail = u.email === "abadadbad51@gmail.com";
            const newProfile: UserProfile = {
              uid: u.uid,
              name: u.displayName || 'User',
              email: u.email || '',
              role: isAdminEmail ? 'admin' : 'student',
              createdAt: Timestamp.now()
            };
            try {
              await setDoc(doc(db, 'users', u.uid), newProfile);
              setProfile(newProfile);
            } catch (e: any) {
              handleFirestoreError(e, OperationType.WRITE, `users/${u.uid}`);
            }
          }
        } else {
          setProfile(null);
        }
      } catch (error: any) {
        console.error("Auth state change error:", error);
        setAuthError(error.message || "حدث خطأ أثناء تحميل بيانات الملف الشخصي.");
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if ((activeTab === 'availability' || (isTeacherProfileModalOpen && teacherProfileTab === 'availability')) && profile) {
      const targetId = (profile.role === 'admin' && selectedTeacherIdForAvailability) 
        ? selectedTeacherIdForAvailability 
        : (profile.role === 'teacher' ? profile.uid : null);
      
      if (targetId) {
        const fetchAvailability = async () => {
          try {
            const docRef = doc(db, 'teacherAvailability', targetId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setTeacherAvailability((docSnap.data() as TeacherAvailability).availability);
            } else {
              setTeacherAvailability([]);
            }
          } catch (error) {
            handleFirestoreError(error, OperationType.GET, `teacherAvailability/${targetId}`);
          }
        };
        fetchAvailability();
      }
    }
  }, [activeTab, profile, selectedTeacherIdForAvailability, isTeacherProfileModalOpen, teacherProfileTab]);

  // Real-time Listeners
  useEffect(() => {
    if (!user || !profile) return;

    const listeners: (() => void)[] = [];

    // Notifications
    const qNotif = query(
      collection(db, 'notifications'), 
      where('recipientId', '==', user.uid),
      orderBy('date', 'desc')
    );
    listeners.push(onSnapshot(qNotif, (snap) => {
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'notifications')));

    // Role-specific data
    if (profile.role === 'admin') {
      listeners.push(onSnapshot(collection(db, 'users'), (snap) => {
        const allUsers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setStudents(allUsers.filter((u: any) => u.role === 'student'));
        setTeachers(allUsers.filter((u: any) => u.role === 'teacher'));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'users')));
      listeners.push(onSnapshot(collection(db, 'classes'), (snap) => {
        setClasses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'classes')));
      listeners.push(onSnapshot(collection(db, 'attendance'), (snap) => {
        setAttendanceRecords(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'attendance')));
      listeners.push(onSnapshot(collection(db, 'subjects'), (snap) => {
        setSubjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'subjects')));
      listeners.push(onSnapshot(collection(db, 'schedules'), (snap) => {
        setAllSchedules(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'schedules')));
    }

    return () => listeners.forEach(l => l());
  }, [user, profile]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoggingIn(true);

    try {
      if (isRegistering) {
        if (!userName) {
          setAuthError("يرجى إدخال الاسم الكامل.");
          setIsLoggingIn(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: userName });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error("Email auth failed", error);
      const errorCode = error.code || '';
      
      if (errorCode === 'auth/email-already-in-use') {
        setAuthError("هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول بدلاً من التسجيل.");
      } else if (errorCode === 'auth/invalid-email') {
        setAuthError("البريد الإلكتروني غير صالح. يرجى التأكد من كتابة البريد بشكل صحيح.");
      } else if (errorCode === 'auth/weak-password') {
        setAuthError("كلمة المرور ضعيفة جداً. يرجى استخدام 6 أحرف على الأقل.");
      } else if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
        setAuthError("خطأ في البريد الإلكتروني أو كلمة المرور. يرجى المحاولة مرة أخرى.");
      } else if (errorCode === 'auth/operation-not-allowed') {
        setAuthError("تسجيل الدخول بالبريد الإلكتروني غير مفعل. يرجى التواصل مع الدعم الفني.");
      } else if (errorCode === 'auth/too-many-requests') {
        setAuthError("تم حظر الطلبات مؤقتاً بسبب كثرة المحاولات الفاشلة. يرجى المحاولة لاحقاً.");
      } else {
        setAuthError(error.message || "حدث خطأ غير متوقع أثناء عملية المصادقة.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loginWithPopup = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    setAuthError(null);
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      handleLoginError(error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loginWithRedirect = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    setAuthError(null);
    setIsLoggingIn(true);
    try {
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      handleLoginError(error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLoginError = (error: any) => {
    console.error("Login failed", error);
    const errorCode = error.code || '';

    if (errorCode === 'auth/network-request-failed') {
      setAuthError("فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.");
    } else if (errorCode === 'auth/popup-closed-by-user') {
      setAuthError("تم إغلاق نافذة تسجيل الدخول قبل إتمام العملية.");
    } else if (errorCode === 'auth/cancelled-popup-request') {
      setAuthError("تم إلغاء طلب تسجيل الدخول.");
    } else if (errorCode === 'auth/internal-error') {
      setAuthError("حدث خطأ داخلي في نظام المصادقة.");
    } else if (errorCode === 'auth/popup-blocked') {
      setAuthError("تم حظر النافذة المنبثقة من قبل المتصفح. يرجى السماح بالنوافذ المنبثقة.");
    } else if (errorCode === 'auth/operation-not-allowed') {
      setAuthError("طريقة تسجيل الدخول هذه غير مفعلة في إعدادات Firebase.");
    } else if (errorCode === 'auth/unauthorized-domain') {
      setAuthError("هذا النطاق غير مصرح به في إعدادات Firebase Authentication.");
    } else if (errorCode === 'auth/account-exists-with-different-credential') {
      setAuthError("هذا الحساب موجود بالفعل باستخدام وسيلة دخول مختلفة.");
    } else if (errorCode === 'auth/invalid-credential') {
      setAuthError("بيانات الاعتماد غير صالحة أو منتهية الصلاحية.");
    } else if (errorCode === 'auth/email-already-in-use') {
      setAuthError("هذا البريد الإلكتروني مسجل بالفعل.");
    } else {
      setAuthError(error.message || "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.");
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email) return;

    setIsSubmitting(true);
    try {
      if (editingStudent) {
        // Update existing student
        await updateDoc(doc(db, 'users', editingStudent.id), {
          ...newStudent
        });
        
        await addDoc(collection(db, 'notifications'), {
          recipientId: user?.uid,
          title: 'تحديث بيانات',
          message: `تم تحديث بيانات الطالب ${newStudent.name} بنجاح.`,
          date: Timestamp.now(),
          read: false
        });
      } else {
        // Create new student
        const tempId = doc(collection(db, 'users')).id;
        await setDoc(doc(db, 'users', tempId), {
          uid: tempId,
          ...newStudent,
          role: 'student',
          createdAt: Timestamp.now()
        });
        
        await addDoc(collection(db, 'notifications'), {
          recipientId: user?.uid,
          title: 'طالب جديد',
          message: `تم إضافة الطالب ${newStudent.name} بنجاح.`,
          date: Timestamp.now(),
          read: false
        });
      }
      
      setAddStudentModalOpen(false);
      setEditingStudent(null);
      setNewStudent({ name: '', email: '', classId: '', section: '', parentName: '', parentPhone: '' });
    } catch (error) {
      handleFirestoreError(error, editingStudent ? OperationType.UPDATE : OperationType.CREATE, 'users');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        let importedCount = 0;
        for (const row of data) {
          // Expected columns: Name, Email, ClassId, Section, ParentName, ParentPhone
          // We'll try to map common names
          const name = row.Name || row['الاسم'] || row['اسم الطالب'];
          const email = row.Email || row['البريد الإلكتروني'] || row['الايميل'];
          
          if (name && email) {
            const tempId = doc(collection(db, 'users')).id;
            await setDoc(doc(db, 'users', tempId), {
              uid: tempId,
              name: String(name),
              email: String(email),
              classId: String(row.ClassId || row['رقم الصف'] || row['الصف'] || ''),
              section: String(row.Section || row['الشعبة'] || ''),
              parentName: String(row.ParentName || row['اسم ولي الأمر'] || ''),
              parentPhone: String(row.ParentPhone || row['هاتف ولي الأمر'] || ''),
              role: 'student',
              createdAt: Timestamp.now()
            });
            importedCount++;
          }
        }

        await addDoc(collection(db, 'notifications'), {
          recipientId: user?.uid,
          title: 'استيراد طلاب',
          message: `تم استيراد ${importedCount} طالب بنجاح من ملف Excel.`,
          date: Timestamp.now(),
          read: false
        });

        alert(`تم استيراد ${importedCount} طالب بنجاح.`);
      } catch (error) {
        console.error("Excel import failed", error);
        alert("فشل استيراد الملف. يرجى التأكد من تنسيق الملف.");
      } finally {
        setIsImporting(false);
        e.target.value = ''; // Reset input
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleMoveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentToMove || !moveData.classId) return;

    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, 'users', studentToMove.id), {
        classId: moveData.classId,
        section: moveData.section
      });

      await addDoc(collection(db, 'notifications'), {
        recipientId: user?.uid,
        title: 'نقل طالب',
        message: `تم نقل الطالب ${studentToMove.name} إلى الصف ${moveData.classId} شعبة ${moveData.section || 'عام'}.`,
        date: Timestamp.now(),
        read: false
      });

      setMoveStudentModalOpen(false);
      setStudentToMove(null);
      setMoveData({ classId: '', section: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف الطالب ${studentName}؟`)) return;

    try {
      await setDoc(doc(db, 'users', studentId), { role: 'deleted' }, { merge: true });
      
      await addDoc(collection(db, 'notifications'), {
        recipientId: user?.uid,
        title: 'حذف طالب',
        message: `تم حذف الطالب ${studentName} من النظام.`,
        date: Timestamp.now(),
        read: false
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${studentId}`);
    }
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.name || !newClass.gradeId) return;

    setIsSubmitting(true);
    try {
      if (editingClass) {
        await updateDoc(doc(db, 'classes', editingClass.id), {
          ...newClass,
          updatedAt: Timestamp.now()
        });
        
        await addDoc(collection(db, 'notifications'), {
          recipientId: user?.uid,
          title: 'تحديث فصل',
          message: `تم تحديث بيانات الفصل ${newClass.name} بنجاح.`,
          date: Timestamp.now(),
          read: false
        });
      } else {
        await addDoc(collection(db, 'classes'), {
          ...newClass,
          createdAt: Timestamp.now(),
          studentsCount: 0
        });
        
        await addDoc(collection(db, 'notifications'), {
          recipientId: user?.uid,
          title: 'فصل جديد',
          message: `تم إضافة الفصل ${newClass.name} بنجاح.`,
          date: Timestamp.now(),
          read: false
        });
      }
      
      setAddClassModalOpen(false);
      setEditingClass(null);
      setNewClass({ name: '', gradeId: '', section: '', teacherId: '' });
    } catch (error) {
      handleFirestoreError(error, editingClass ? OperationType.UPDATE : OperationType.CREATE, 'classes');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClass = async (classId: string, className: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف الفصل ${className}؟`)) return;

    try {
      await setDoc(doc(db, 'classes', classId), { status: 'deleted' }, { merge: true });
      
      await addDoc(collection(db, 'notifications'), {
        recipientId: user?.uid,
        title: 'حذف فصل',
        message: `تم حذف الفصل ${className} من النظام.`,
        date: Timestamp.now(),
        read: false
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `classes/${classId}`);
    }
  };

  const openEditClassModal = (cls: any) => {
    setEditingClass(cls);
    setNewClass({ 
      name: cls.name, 
      gradeId: cls.gradeId || cls.grade || '', 
      section: cls.section || '',
      teacherId: cls.teacherId || ''
    });
    setAddClassModalOpen(true);
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.email) return;

    setIsSubmitting(true);
    try {
      if (editingTeacher) {
        await updateDoc(doc(db, 'users', editingTeacher.id), {
          ...newTeacher
        });
        
        await addDoc(collection(db, 'notifications'), {
          recipientId: user?.uid,
          title: 'تحديث بيانات معلم',
          message: `تم تحديث بيانات المعلم ${newTeacher.name} بنجاح.`,
          date: Timestamp.now(),
          read: false
        });
      } else {
        const tempId = doc(collection(db, 'users')).id;
        await setDoc(doc(db, 'users', tempId), {
          uid: tempId,
          ...newTeacher,
          role: 'teacher',
          createdAt: Timestamp.now()
        });
        
        await addDoc(collection(db, 'notifications'), {
          recipientId: user?.uid,
          title: 'معلم جديد',
          message: `تم إضافة المعلم ${newTeacher.name} بنجاح.`,
          date: Timestamp.now(),
          read: false
        });
      }
      
      setAddTeacherModalOpen(false);
      setEditingTeacher(null);
      setNewTeacher({ name: '', email: '', subjects: [], phone: '' });
    } catch (error) {
      handleFirestoreError(error, editingTeacher ? OperationType.UPDATE : OperationType.CREATE, 'users');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditTeacherModal = (teacher: any) => {
    setEditingTeacher(teacher);
    setNewTeacher({
      name: teacher.name,
      email: teacher.email,
      subjects: teacher.subjects || (teacher.subject ? [teacher.subject] : []),
      phone: teacher.phone || ''
    });
    setAddTeacherModalOpen(true);
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name) return;

    setIsSubmitting(true);
    try {
      if (editingSubject) {
        await updateDoc(doc(db, 'subjects', editingSubject.id), {
          ...newSubject,
          updatedAt: Timestamp.now()
        });
      } else {
        await addDoc(collection(db, 'subjects'), {
          ...newSubject,
          createdAt: Timestamp.now()
        });
      }
      setAddSubjectModalOpen(false);
      setEditingSubject(null);
      setNewSubject({ name: '', code: '', color: 'blue', description: '', totalMarks: 100 });
    } catch (error) {
      handleFirestoreError(error, editingSubject ? OperationType.UPDATE : OperationType.CREATE, 'subjects');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المادة؟')) return;
    try {
      await deleteDoc(doc(db, 'subjects', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'subjects');
    }
  };

  const handleDeleteTeacher = async (teacherId: string, teacherName: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف المعلم ${teacherName}؟`)) return;

    try {
      await setDoc(doc(db, 'users', teacherId), { role: 'deleted' }, { merge: true });
      
      await addDoc(collection(db, 'notifications'), {
        recipientId: user?.uid,
        title: 'حذف معلم',
        message: `تم حذف المعلم ${teacherName} من النظام.`,
        date: Timestamp.now(),
        read: false
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${teacherId}`);
    }
  };

  const openStudentProfile = (student: any) => {
    setSelectedStudentForProfile(student);
    setStudentProfileModalOpen(true);
    setProfileTab('overview');
    
    // Listen for grades
    const qGrades = query(collection(db, 'grades'), where('studentId', '==', student.id), orderBy('date', 'desc'));
    const unsubGrades = onSnapshot(qGrades, (snap) => {
      setStudentGrades(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Listen for schedule (based on classId)
    const qSchedule = query(collection(db, 'schedules'), where('classId', '==', student.classId));
    const unsubSchedule = onSnapshot(qSchedule, (snap) => {
      setStudentSchedule(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Listen for assignments
    const qAssignments = query(collection(db, 'assignments'), where('classId', '==', student.classId));
    const unsubAssignments = onSnapshot(qAssignments, (snap) => {
      setStudentAssignments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Listen for attendance
    const qAttendance = query(collection(db, 'attendance'), where('studentId', '==', student.id), orderBy('date', 'desc'));
    const unsubAttendance = onSnapshot(qAttendance, (snap) => {
      setStudentAttendance(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Listen for resources
    const qResources = query(collection(db, 'resources'), where('classId', '==', student.classId));
    const unsubResources = onSnapshot(qResources, (snap) => {
      setStudentResources(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Listen for notifications
    const qNotifications = query(collection(db, 'notifications'), where('recipientId', '==', student.id), orderBy('date', 'desc'));
    const unsubNotifications = onSnapshot(qNotifications, (snap) => {
      setStudentNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Listen for messages
    const qMessages = query(collection(db, 'messages'), 
      where('receiverId', 'in', [student.id, user?.uid]),
      orderBy('timestamp', 'asc')
    );
    const unsubMessages = onSnapshot(qMessages, (snap) => {
      setStudentMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubGrades();
      unsubSchedule();
      unsubAssignments();
      unsubAttendance();
      unsubResources();
      unsubNotifications();
      unsubMessages();
    };
  };

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForProfile || !newGrade.subject || !newGrade.score) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'grades'), {
        studentId: selectedStudentForProfile.id,
        subject: newGrade.subject,
        score: Number(newGrade.score),
        term: newGrade.term || 'الفصل الأول',
        date: Timestamp.now()
      });
      setNewGrade({ subject: '', score: '', term: '' });
      
      // Add notification for the student (if they were a real user)
      await addDoc(collection(db, 'notifications'), {
        recipientId: selectedStudentForProfile.id,
        title: 'تمت إضافة درجة جديدة',
        message: `تمت إضافة درجة في مادة ${newGrade.subject}`,
        date: Timestamp.now(),
        read: false
      });
    } catch (error) {
      console.error("Error adding grade:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGrade = async (gradeId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الدرجة؟')) return;
    try {
      await deleteDoc(doc(db, 'grades', gradeId));
    } catch (error) {
      console.error("Error deleting grade:", error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!selectedStudentForProfile || !content.trim()) return;
    try {
      await addDoc(collection(db, 'messages'), {
        senderId: user?.uid,
        receiverId: selectedStudentForProfile.id,
        content,
        timestamp: Timestamp.now(),
        read: false
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleUpdateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotForEdit || !selectedClassForEdit) return;

    setIsSavingSchedule(true);
    try {
      const teacher = teachers.find(t => t.id === selectedSlotForEdit.teacherId);
      const subject = subjects.find(s => s.id === selectedSlotForEdit.subjectId);
      
      const slotData = {
        ...selectedSlotForEdit,
        teacherName: teacher?.name || '',
        subject: subject?.name || '',
        updatedAt: Timestamp.now()
      };

      if (selectedSlotForEdit.id) {
        await updateDoc(doc(db, 'schedules', selectedSlotForEdit.id), slotData);
      } else {
        await addDoc(collection(db, 'schedules'), {
          ...slotData,
          classId: selectedClassForEdit
        });
      }
      setEditSlotModalOpen(false);
      setSelectedSlotForEdit(null);
    } catch (error) {
      console.error("Error updating slot:", error);
    } finally {
      setIsSavingSchedule(false);
    }
  };

  const renderEditScheduleModal = () => (
    <AnimatePresence>
      {isEditScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-white/20 flex flex-col"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-200">
                  <Edit size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">تعديل الجدول الدراسي</h3>
                  <p className="text-slate-500 text-sm">قم باختيار الفصل لتعديل حصصه الدراسية يدوياً</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setEditScheduleModalOpen(false);
                  setSelectedClassForEdit('');
                }} 
                className="bg-white text-slate-400 hover:text-slate-600 p-2 rounded-xl shadow-sm border border-slate-100 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 bg-slate-50 border-b border-slate-100">
              <div className="max-w-xs">
                <label className="block text-sm font-bold text-slate-700 mb-2">اختر الفصل</label>
                <select 
                  value={selectedClassForEdit}
                  onChange={(e) => setSelectedClassForEdit(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white font-bold"
                >
                  <option value="">-- اختر الفصل --</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} (الصف {c.grade})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {!selectedClassForEdit ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
                  <Calendar size={64} className="mb-4 opacity-20" />
                  <p className="text-lg font-bold">يرجى اختيار فصل لعرض جدوله</p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="p-6 font-black text-slate-500 text-sm border-b border-slate-100">اليوم / الوقت</th>
                          {['08:00', '09:00', '10:00', '11:00', '12:00'].map(time => (
                            <th key={time} className="p-6 font-black text-slate-500 text-sm border-b border-slate-100">{time} - {parseInt(time)+1}:00</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].map((day) => (
                          <tr key={day}>
                            <td className="p-6 font-black text-slate-700 bg-slate-50/50">
                              {day === 'Sunday' ? 'الأحد' : day === 'Monday' ? 'الاثنين' : day === 'Tuesday' ? 'الثلاثاء' : day === 'Wednesday' ? 'الأربعاء' : 'الخميس'}
                            </td>
                            {['08:00', '09:00', '10:00', '11:00', '12:00'].map(startTime => {
                              const entry = editingScheduleEntries.find(s => s.day === day && s.startTime === startTime);
                              return (
                                <td key={startTime} className="p-2">
                                  <button
                                    onClick={() => {
                                      setSelectedSlotForEdit(entry || { 
                                        day, 
                                        startTime, 
                                        endTime: `${parseInt(startTime)+1}:00`,
                                        subjectId: '',
                                        teacherId: '',
                                        room: ''
                                      });
                                      setEditSlotModalOpen(true);
                                    }}
                                    className={cn(
                                      "w-full h-24 p-3 rounded-2xl border transition-all text-right flex flex-col justify-between group",
                                      entry 
                                        ? "bg-blue-50 border-blue-100 hover:border-blue-300" 
                                        : "bg-slate-50 border-dashed border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                                    )}
                                  >
                                    {entry ? (
                                      <>
                                        <div>
                                          <p className="font-black text-blue-700 text-xs">{entry.subject}</p>
                                          <p className="text-[10px] text-blue-500 mt-0.5">{entry.teacherName}</p>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                          <span className="text-[9px] text-blue-400">{entry.room}</span>
                                          <Edit size={12} className="text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                      </>
                                    ) : (
                                      <div className="h-full flex items-center justify-center">
                                        <Plus size={16} className="text-slate-300 group-hover:text-slate-400" />
                                      </div>
                                    )}
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Slot Modal */}
      {isEditSlotModalOpen && selectedSlotForEdit && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">تعديل الحصة الدراسية</h3>
              <button onClick={() => setEditSlotModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateSlot} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">المادة الدراسية</label>
                <select 
                  required
                  value={selectedSlotForEdit.subjectId}
                  onChange={(e) => setSelectedSlotForEdit({...selectedSlotForEdit, subjectId: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="">اختر المادة</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">المعلم</label>
                <select 
                  required
                  value={selectedSlotForEdit.teacherId}
                  onChange={(e) => setSelectedSlotForEdit({...selectedSlotForEdit, teacherId: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="">اختر المعلم</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">القاعة / الغرفة</label>
                <input 
                  type="text" 
                  value={selectedSlotForEdit.room}
                  onChange={(e) => setSelectedSlotForEdit({...selectedSlotForEdit, room: e.target.value})}
                  placeholder="مثال: قاعة 101"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="submit" 
                  disabled={isSavingSchedule}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  {isSavingSchedule ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
                {selectedSlotForEdit.id && (
                  <button 
                    type="button"
                    onClick={async () => {
                      if (window.confirm('هل أنت متأكد من حذف هذه الحصة؟')) {
                        await deleteDoc(doc(db, 'schedules', selectedSlotForEdit.id));
                        setEditSlotModalOpen(false);
                      }
                    }}
                    className="bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold px-4 py-3 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const generateSchedule = async (targetClassIds?: string[], customSlots?: any[]) => {
    if (!profile || profile.role !== 'admin') return;
    
    setIsGeneratingSchedule(true);
    setIsGenerateScheduleDropdownOpen(false);
    try {
      // 1. Get data
      const availabilitySnap = await getDocs(collection(db, 'teacherAvailability'));
      const allAvailability = availabilitySnap.docs.reduce((acc: any, d) => {
        acc[d.id] = d.data().availability;
        return acc;
      }, {});

      const targetClasses = targetClassIds && targetClassIds.length > 0 
        ? classes.filter(c => targetClassIds.includes(c.id))
        : classes;

      // 2. Clear existing schedules for target classes
      for (const cls of targetClasses) {
        const q = query(collection(db, 'schedules'), where('classId', '==', cls.id));
        const snap = await getDocs(q);
        for (const d of snap.docs) {
          await deleteDoc(doc(db, 'schedules', d.id));
        }
      }

      // 3. Call Gemini
      const generatedData = await generateSmartSchedule({
        classes: targetClasses,
        teachers,
        subjects,
        availability: allAvailability,
        slots: customSlots || [
          { start: '08:00', end: '09:00' },
          { start: '09:00', end: '10:00' },
          { start: '10:30', end: '11:30' },
          { start: '11:30', end: '12:30' }
        ]
      });

      // 4. Save to Firestore
      if (Array.isArray(generatedData)) {
        for (const entry of generatedData) {
          const teacher = teachers.find(t => t.id === entry.teacherId);
          await addDoc(collection(db, 'schedules'), {
            ...entry,
            teacherName: teacher?.name || 'Unknown',
            createdAt: Timestamp.now()
          });
        }
      }

      await addDoc(collection(db, 'notifications'), {
        recipientId: user?.uid,
        title: 'تم إنشاء الجدول الذكي',
        message: 'تم توليد الجدول الدراسي باستخدام الذكاء الاصطناعي بنجاح.',
        date: Timestamp.now(),
        read: false
      });

    } catch (error) {
      console.error("AI Schedule Generation Error:", error);
      alert("فشل توليد الجدول الذكي. سيتم الانتقال للوضع التلقائي البسيط.");
      // Fallback to simple random generator if needed or just show error
    } finally {
      setIsGeneratingSchedule(false);
    }
  };

  const seedData = async () => {
    if (!profile || profile.role !== 'admin') return;
    
    console.log("Seed data started...");
    setIsSubmitting(true);
    try {
      const subjectNames = ['الرياضيات', 'العلوم', 'اللغة العربية', 'اللغة الإنجليزية', 'التاريخ', 'الجغرافيا', 'التربية الإسلامية', 'الفنية', 'الرياضة', 'الحاسب الآلي'];
      const subjectColors = ['blue', 'emerald', 'amber', 'rose', 'indigo', 'orange', 'cyan', 'purple', 'pink', 'slate'];
      const subjectIds: string[] = [];

      // Seed Subjects collection
      for (let i = 0; i < subjectNames.length; i++) {
        const subRef = await addDoc(collection(db, 'subjects'), {
          name: subjectNames[i],
          code: `SUB${100 + i}`,
          color: subjectColors[i],
          description: `منهج مادة ${subjectNames[i]} المطور`,
          createdAt: Timestamp.now()
        });
        subjectIds.push(subRef.id);
      }

      const teacherNames = [
        'أحمد محمد', 'سارة علي', 'خالد محمود', 'ليلى حسن', 'عمر فاروق',
        'مريم إبراهيم', 'يوسف عبدالله', 'نورة السعيد', 'فيصل الحربي', 'ريم القحطاني'
      ];
      
      const teacherIds: string[] = [];
      for (let i = 0; i < 10; i++) {
        const id = doc(collection(db, 'users')).id;
        await setDoc(doc(db, 'users', id), {
          uid: id,
          name: teacherNames[i],
          email: `teacher${i+1}@school.com`,
          subjects: [subjectIds[i % subjectIds.length]],
          phone: `05000000${i+1}`,
          role: 'teacher',
          createdAt: Timestamp.now()
        });
        teacherIds.push(id);

        // Seed Teacher Availability
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
        const slots = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00'];
        const availability = [];
        for (const day of days) {
          for (const slot of slots) {
            if (Math.random() > 0.3) {
              availability.push({
                day,
                slot,
                type: Math.random() > 0.7 ? 'preferred' : (Math.random() > 0.5 ? 'suitable' : 'unsuitable')
              });
            }
          }
        }
        await setDoc(doc(db, 'teacherAvailability', id), {
          teacherId: id,
          availability,
          updatedAt: Timestamp.now()
        });
      }

      const classNames = ['فصل النخبة', 'فصل المبدعين', 'فصل الأمل', 'فصل المستقبل', 'فصل النجاح'];
      const grades = ['1', '2', '3', '4', '5'];
      const sections = ['أ', 'ب', 'ج', 'د', 'هـ'];
      const classIds: string[] = [];

      for (let i = 0; i < 5; i++) {
        const classRef = await addDoc(collection(db, 'classes'), {
          name: classNames[i],
          grade: grades[i],
          section: sections[i],
          teacherId: teacherIds[i],
          createdAt: Timestamp.now()
        });
        classIds.push(classRef.id);

        // Seed Schedule for each class
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
        for (const day of days) {
          for (let h = 0; h < 4; h++) {
            await addDoc(collection(db, 'schedules'), {
              classId: grades[i],
              day,
              subject: subjectNames[h],
              teacherName: teacherNames[h],
              startTime: `${8 + h}:00`,
              endTime: `${9 + h}:00`,
              room: `قاعة ${100 + h}`
            });
          }
        }

        // Seed Assignments
        for (let a = 0; a < 3; a++) {
          await addDoc(collection(db, 'assignments'), {
            classId: grades[i],
            title: `واجب ${subjectNames[a]} - الوحدة ${a+1}`,
            description: `يرجى حل التمارين من صفحة ${10 * (a+1)} إلى ${10 * (a+1) + 5}`,
            dueDate: Timestamp.fromDate(new Date(Date.now() + (a + 1) * 86400000)),
            status: 'pending',
            subject: subjectNames[a]
          });
        }

        // Seed Resources
        for (let r = 0; r < 2; r++) {
          await addDoc(collection(db, 'resources'), {
            classId: grades[i],
            subject: subjectNames[r],
            title: `كتاب ${subjectNames[r]} - الفصل الدراسي الأول`,
            url: 'https://example.com/book.pdf',
            type: 'pdf'
          });
        }
      }

      const firstNames = ['محمد', 'أحمد', 'علي', 'عمر', 'يوسف', 'إبراهيم', 'عبدالله', 'خالد', 'فهد', 'سلمان'];
      const lastNames = ['العتيبي', 'القحطاني', 'الشهري', 'الغامدي', 'الزهراني', 'الدوسري', 'المطيري', 'العنزي', 'الشمري', 'الرشيدي'];
      const specializations = ['علمي', 'أدبي', 'عام', 'تقني'];

      for (let i = 0; i < 20; i++) {
        const id = doc(collection(db, 'users')).id;
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const grade = grades[Math.floor(Math.random() * grades.length)];
        const section = sections[Math.floor(Math.random() * sections.length)];
        const spec = specializations[Math.floor(Math.random() * specializations.length)];

        await setDoc(doc(db, 'users', id), {
          uid: id,
          name: `${firstName} ${lastName}`,
          email: `student${i+1}@school.com`,
          classId: grade,
          section: section,
          specialization: spec,
          role: 'student',
          createdAt: Timestamp.now()
        });

        // Seed some grades for each student
        for (let g = 0; g < 3; g++) {
          await addDoc(collection(db, 'grades'), {
            studentId: id,
            subject: subjectNames[g],
            score: Math.floor(Math.random() * 30) + 70,
            term: 'الفصل الأول',
            date: Timestamp.now()
          });
        }

        // Seed some attendance
        for (let att = 0; att < 5; att++) {
          await addDoc(collection(db, 'attendance'), {
            studentId: id,
            classId: grade,
            date: format(new Date(Date.now() - att * 86400000), 'yyyy-MM-dd'),
            status: Math.random() > 0.1 ? 'present' : 'absent'
          });
        }

        // Seed some notifications
        await addDoc(collection(db, 'notifications'), {
          recipientId: id,
          title: 'مرحباً بك في النظام',
          message: 'تم تفعيل حسابك بنجاح في منصة مدرستي الرقمية.',
          type: 'success',
          date: Timestamp.now(),
          read: false
        });
      }

      console.log("Seed data completed successfully!");
      alert("تمت إضافة البيانات التجريبية بنجاح!");
    } catch (error) {
      console.error("Error seeding data:", error);
      alert("حدث خطأ أثناء إضافة البيانات التجريبية.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (student: any) => {
    setEditingStudent(student);
    setNewStudent({ 
      name: student.name, 
      email: student.email, 
      classId: student.classId || '',
      section: student.section || '',
      parentName: student.parentName || '',
      parentPhone: student.parentPhone || ''
    });
    setAddStudentModalOpen(true);
  };

  const logout = () => signOut(auth);

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  // Auto-expand search results
  useEffect(() => {
    if (searchTerm) {
      const gradesToExpand = new Set<string>();
      const sectionsToExpand = new Set<string>();
      filteredStudents.forEach(s => {
        if (s.classId) gradesToExpand.add(s.classId);
        if (s.classId && s.section) sectionsToExpand.add(`${s.classId}-${s.section}`);
      });
      setExpandedGrades(Array.from(gradesToExpand));
      setExpandedSections(Array.from(sectionsToExpand));
    }
  }, [searchTerm, filteredStudents]);

  const filteredClasses = useMemo(() => {
    return classes.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.section.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(c => c.status !== 'deleted');
  }, [classes, searchTerm]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => {
      const searchLower = searchTerm.toLowerCase();
      const matchesName = t.name.toLowerCase().includes(searchLower);
      const matchesEmail = t.email.toLowerCase().includes(searchLower);
      const matchesSubject = t.subjects?.some((subId: string) => {
        const sub = subjects.find(s => s.id === subId);
        return sub?.name.toLowerCase().includes(searchLower);
      });
      const matchesOldSubject = t.subject && t.subject.toLowerCase().includes(searchLower);
      
      return matchesName || matchesEmail || matchesSubject || matchesOldSubject;
    }).filter(t => t.role !== 'deleted');
  }, [teachers, searchTerm, subjects]);

  const studentStats = useMemo(() => {
    const gpa = studentGrades.length > 0 
      ? (studentGrades.reduce((acc, curr) => acc + curr.score, 0) / studentGrades.length).toFixed(1)
      : '0';
    const attendanceRate = studentAttendance.length > 0
      ? ((studentAttendance.filter(a => a.status === 'present').length / studentAttendance.length) * 100).toFixed(0)
      : '0';
    const completedTasks = studentAssignments.filter(a => a.status === 'submitted' || a.status === 'graded').length;
    
    return { gpa, attendanceRate, completedTasks, totalTasks: studentAssignments.length };
  }, [studentGrades, studentAttendance, studentAssignments]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user || authError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-slate-100 dark:border-slate-800 transition-colors"
        >
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-blue-200 dark:shadow-none">
              <GraduationCap size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white text-center mb-2">إدارة المدرسة الذكية</h2>
            <p className="text-slate-500 dark:text-slate-400 text-center font-medium">سجل دخولك للمتابعة</p>
          </div>

          {authError && (
            <div className="mb-8 space-y-4">
              <div className="bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-100 dark:border-rose-800 p-5 rounded-2xl text-rose-600 dark:text-rose-400 text-sm flex items-start gap-4 text-right animate-shake">
                <AlertCircle size={24} className="shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-lg mb-1">خطأ في تسجيل الدخول</p>
                  <p className="opacity-90">{authError}</p>
                  
                  {authError.includes("إغلاق نافذة") && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button 
                        onClick={loginWithRedirect}
                        className="bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200 dark:shadow-none"
                      >
                        تجربة "التحويل المباشر"
                      </button>
                      <button 
                        onClick={() => window.open(window.location.href, '_blank')}
                        className="bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-rose-200 dark:border-slate-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                      >
                        فتح في نافذة مستقلة
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-5 rounded-2xl text-[12px] text-right border border-blue-100 dark:border-blue-800/30 shadow-sm">
                <p className="font-bold mb-3 flex items-center gap-2 text-sm">
                  <Info size={16} />
                  دليل حل مشكلات تسجيل الدخول:
                </p>
                <ul className="list-decimal list-inside space-y-2 opacity-90 leading-relaxed pr-1">
                  <li>السماح بالنوافذ المنبثقة من إعدادات المتصفح.</li>
                  <li>إضافة النطاق المعتمد (Authorized Domain) في Firebase.</li>
                  <li>تأكد من تفعيل Google Sign-In في مزودي الخدمة.</li>
                </ul>
                
                <div className="mt-4 p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-blue-200/50 dark:border-blue-700/30">
                  <p className="text-[10px] text-slate-500 mb-1">النطاق الحالي:</p>
                  <code className="block bg-slate-100 dark:bg-slate-900 p-2 rounded text-blue-600 dark:text-blue-400 font-mono text-[10px] break-all">
                    {window.location.hostname}
                  </code>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.hostname);
                      alert("تم نسخ النطاق");
                    }}
                    className="w-full mt-2 text-[10px] bg-blue-600 text-white px-3 py-2 rounded-lg font-bold"
                  >
                    نسخ النطاق
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-5 mb-8 text-right">
            {isRegistering && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 pr-1">الاسم الكامل</label>
                <div className="relative">
                  <UserCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-3 pr-12 pl-4 focus:border-blue-600 focus:outline-none transition-all dark:text-white"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 pr-1">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-3 pr-12 pl-4 focus:border-blue-600 focus:outline-none transition-all dark:text-white"
                  placeholder="name@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 pr-1">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-3 pr-12 pl-12 focus:border-blue-600 focus:outline-none transition-all dark:text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/20 disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {isLoggingIn && (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              )}
              {isLoggingIn ? 'جاري التحميل...' : (isRegistering ? 'إنشاء حساب جديد' : 'تسجيل الدخول')}
            </button>
          </form>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-900 text-slate-500 font-bold">أو</span>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <button 
              onClick={loginWithPopup}
              disabled={isLoggingIn}
              className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 border-2 border-slate-100 dark:border-slate-700 shadow-sm disabled:opacity-70"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
              الدخول عبر جوجل (نافذة منبثقة)
            </button>
            <button 
              onClick={loginWithRedirect}
              disabled={isLoggingIn}
              className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 border-2 border-transparent shadow-sm disabled:opacity-70"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
              الدخول عبر جوجل (تحويل مباشر)
            </button>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setAuthError(null);
                setShowPassword(false);
              }}
              className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline"
            >
              {isRegistering ? 'لديك حساب بالفعل؟ سجل دخولك' : 'لا تملك حساباً؟ أنشئ حساباً جديداً'}
            </button>

            {authError && (
              <button 
                onClick={() => { setUser(null); setProfile(null); setAuthError(null); setLoading(false); signOut(auth); }}
                className="text-slate-400 hover:text-rose-500 text-xs font-medium transition-colors"
              >
                العودة لصفحة الدخول
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  const renderAttendance = () => {
    const filteredAttendance = attendanceRecords.filter(record => {
      const dateMatch = record.date >= attendanceFilters.startDate && record.date <= attendanceFilters.endDate;
      const studentMatch = !attendanceFilters.studentId || record.studentId === attendanceFilters.studentId;
      const classMatch = !attendanceFilters.classId || record.classId === attendanceFilters.classId;
      return dateMatch && studentMatch && classMatch;
    }).sort((a, b) => b.date.localeCompare(a.date));

    const exportToCSV = () => {
      const headers = ['Student Name', 'Class', 'Date', 'Status'];
      const rows = filteredAttendance.map(record => {
        const student = students.find(s => s.id === record.studentId);
        const cls = classes.find(c => c.id === record.classId);
        return [
          student?.name || 'Unknown',
          cls?.name || record.classId || '-',
          record.date,
          record.status === 'present' ? 'Present' : 'Absent'
        ];
      });

      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `attendance_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const exportToPDF = () => {
      // ... existing PDF export logic
    };

    const groupedAttendance = filteredAttendance.reduce((acc: any, record) => {
      const cls = classes.find(c => c.id === record.classId);
      const grade = cls?.grade || 'غير محدد';
      const section = cls?.section || 'غير محدد';
      
      if (!acc[grade]) acc[grade] = {};
      if (!acc[grade][section]) acc[grade][section] = [];
      
      acc[grade][section].push(record);
      return acc;
    }, {});

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">تقارير الحضور والغياب</h2>
          <div className="flex flex-wrap gap-3">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button 
                onClick={() => setAttendanceViewMode('list')}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                  attendanceViewMode === 'list' ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                قائمة مسطحة
              </button>
              <button 
                onClick={() => setAttendanceViewMode('grouped')}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                  attendanceViewMode === 'grouped' ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                حسب الصفوف
              </button>
            </div>
            <button 
              onClick={exportToCSV}
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20"
            >
              <Download size={18} />
              تصدير CSV
            </button>
            <button 
              onClick={exportToPDF}
              className="bg-rose-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200 dark:shadow-rose-900/20"
            >
              <FileText size={18} />
              تصدير PDF
            </button>
          </div>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">من تاريخ</label>
              <input 
                type="date" 
                value={attendanceFilters.startDate}
                onChange={(e) => setAttendanceFilters({...attendanceFilters, startDate: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">إلى تاريخ</label>
              <input 
                type="date" 
                value={attendanceFilters.endDate}
                onChange={(e) => setAttendanceFilters({...attendanceFilters, endDate: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الفصل</label>
              <select 
                value={attendanceFilters.classId}
                onChange={(e) => setAttendanceFilters({...attendanceFilters, classId: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="">كل الفصول</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الطالب</label>
              <select 
                value={attendanceFilters.studentId}
                onChange={(e) => setAttendanceFilters({...attendanceFilters, studentId: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="">كل الطلاب</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto hidden sm:block">
            {attendanceViewMode === 'list' ? (
              <table className="w-full text-right">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4 font-semibold">الطالب</th>
                    <th className="px-6 py-4 font-semibold">الفصل</th>
                    <th className="px-6 py-4 font-semibold">التاريخ</th>
                    <th className="px-6 py-4 font-semibold">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAttendance.map((record: any) => {
                    const student = students.find(s => s.id === record.studentId);
                    const cls = classes.find(c => c.id === record.classId);
                    return (
                      <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                              {student?.name?.charAt(0) || '?'}
                            </div>
                            <button 
                              onClick={() => student && openStudentProfile(student)}
                              className="font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors text-right"
                            >
                              {student?.name || 'Unknown'}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">{cls?.name || record.classId || '-'}</td>
                        <td className="px-6 py-4 text-slate-400 dark:text-slate-500 text-xs">{record.date}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold",
                            record.status === 'present' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                          )}>
                            {record.status === 'present' ? 'حاضر' : 'غائب'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredAttendance.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">لا توجد سجلات تطابق الفلاتر المختارة</td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <div className="space-y-8">
                {Object.keys(groupedAttendance).sort().map(grade => (
                  <div key={grade} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                      <h3 className="text-lg font-black text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 px-4 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                        الصف: {grade}
                      </h3>
                      <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.keys(groupedAttendance[grade]).sort().map(section => (
                        <div key={section} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                          <div className="bg-slate-50 dark:bg-slate-800 px-6 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <span className="font-bold text-slate-700 dark:text-slate-300">شعبة: {section}</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">{groupedAttendance[grade][section].length} سجل</span>
                          </div>
                          <div className="p-4">
                            <table className="w-full text-right text-sm">
                              <thead>
                                <tr className="text-slate-400 dark:text-slate-500 border-b border-slate-50 dark:border-slate-800">
                                  <th className="pb-2 font-medium">الطالب</th>
                                  <th className="pb-2 font-medium">التاريخ</th>
                                  <th className="pb-2 font-medium">الحالة</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {groupedAttendance[grade][section].map((record: any) => {
                                  const student = students.find(s => s.id === record.studentId);
                                  return (
                                    <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                      <td className="py-2 font-medium text-slate-700 dark:text-slate-300">{student?.name || 'Unknown'}</td>
                                      <td className="py-2 text-slate-400 dark:text-slate-500 text-[10px]">{record.date}</td>
                                      <td className="py-2">
                                        <span className={cn(
                                          "px-2 py-0.5 rounded-full text-[10px] font-bold",
                                          record.status === 'present' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
                                        )}>
                                          {record.status === 'present' ? 'حاضر' : 'غائب'}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {Object.keys(groupedAttendance).length === 0 && (
                  <div className="py-12 text-center text-slate-400">لا توجد سجلات تطابق الفلاتر المختارة</div>
                )}
              </div>
            )}
          </div>

          <div className="sm:hidden space-y-4">
            {attendanceViewMode === 'list' ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAttendance.map((record: any) => {
                  const student = students.find(s => s.id === record.studentId);
                  const cls = classes.find(c => c.id === record.classId);
                  return (
                    <div key={record.id} className="py-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <button 
                          onClick={() => student && openStudentProfile(student)}
                          className="font-bold text-slate-800 dark:text-white text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {student?.name || 'Unknown'}
                        </button>
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase",
                          record.status === 'present' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
                        )}>
                          {record.status === 'present' ? 'حاضر' : 'غائب'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <LayoutGrid size={12} className="text-slate-400" />
                          <span>{cls?.name || record.classId || '-'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-slate-400" />
                          <span>{record.date}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                {Object.keys(groupedAttendance).sort().map(grade => (
                  <div key={grade} className="space-y-3">
                    <h3 className="text-sm font-black text-slate-400 flex items-center gap-2">
                       <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                       الصف: {grade}
                    </h3>
                    <div className="space-y-3">
                      {Object.keys(groupedAttendance[grade]).sort().map(section => (
                        <div key={section} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <p className="text-xs font-bold text-slate-800 dark:text-white mb-3">شعبة: {section}</p>
                          <div className="space-y-2">
                            {groupedAttendance[grade][section].map((record: any) => {
                              const student = students.find(s => s.id === record.studentId);
                              return (
                                <div key={record.id} className="flex items-center justify-between py-1 border-b border-white/5 dark:border-slate-800 last:border-0">
                                  <span className="text-xs text-slate-600 dark:text-slate-400">{student?.name || 'Unknown'}</span>
                                  <span className={cn(
                                    "text-[9px] font-black px-2 py-0.5 rounded",
                                    record.status === 'present' ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20" : "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20"
                                  )}>
                                    {record.status === 'present' ? 'حاضر' : 'غائب'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  const saveAvailability = async () => {
    if (!profile) return;
    const targetId = (profile.role === 'admin' && selectedTeacherIdForAvailability) 
      ? selectedTeacherIdForAvailability 
      : (profile.role === 'teacher' ? profile.uid : null);
    
    if (!targetId) return;

    setIsSavingAvailability(true);
    try {
      await setDoc(doc(db, 'teacherAvailability', targetId), {
        teacherId: targetId,
        availability: teacherAvailability,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `teacherAvailability/${targetId}`);
    } finally {
      setIsSavingAvailability(false);
    }
  };


  const saveSchedule = async (classId: string, day: string, slot: string, data: any) => {
    if (!profile || profile.role !== 'admin') return;
    
    // slot is "startTime-endTime"
    const [startTime, endTime] = slot.split('-');
    
    try {
      // Check if slot exists
      const q = query(
        collection(db, 'schedules'),
        where('classId', '==', classId),
        where('day', '==', day),
        where('startTime', '==', startTime)
      );
      const snap = await getDocs(q);
      
      const payload = {
        classId,
        day,
        startTime,
        endTime,
        subject: data.subject,
        subjectId: data.subjectId || '',
        teacherId: data.teacherId,
        teacherName: data.teacherName,
        room: data.room,
        updatedAt: Timestamp.now()
      };

      if (!snap.empty) {
        // Update
        const docId = snap.docs[0].id;
        await updateDoc(doc(db, 'schedules', docId), payload);
      } else {
        // Create
        await addDoc(collection(db, 'schedules'), {
          ...payload,
          createdAt: Timestamp.now()
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'schedules');
    }
  };

  const renderDashboard = () => {
    // These are fixed elements that should always be at the top
    const fixedWidgets = ['greeting', 'quick_actions', 'stats'];
    // These are data widgets that can be sorted
    const sortableWidgets = dashboardWidgets.filter(id => !fixedWidgets.includes(id));

    const renderWidget = (id: string) => {
      switch (id) {
        case 'greeting':
          return <GreetingSection user={user} key="greeting" />;
        case 'quick_actions':
          return (
            <div key="quick_actions" className="mb-10">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 pr-1">إجراءات سريعة ومختصرة</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <QuickAction icon={UserPlus} label="إضافة طالب" onClick={() => setAddStudentModalOpen(true)} color="bg-blue-600" />
                <QuickAction icon={Plus} label="فصل جديد" onClick={() => setAddClassModalOpen(true)} color="bg-emerald-600" />
                <QuickAction icon={MessageCircle} label="إرسال إشعار" onClick={() => setActiveTab('notifications')} color="bg-amber-600" />
                <QuickAction icon={FileSpreadsheet} label="التقرير المالي" onClick={() => setActiveTab('finance')} color="bg-rose-600" />
                <QuickAction icon={BrainCircuit} label="الجدولة الذكية" onClick={() => setActiveTab('academic')} color="bg-indigo-600" />
                <QuickAction icon={Settings} label="الإعدادات" onClick={() => setActiveTab('settings')} color="bg-slate-700" />
              </div>
            </div>
          );
        case 'stats':
          return (
            <div key="stats" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard title="إجمالي الطلاب" value={students.length} icon={Users} color="bg-blue-600" trend={{ value: '+12%', positive: true }} />
              <StatCard title="كادر المعلمين" value={teachers.length} icon={UserCircle} color="bg-emerald-600" trend={{ value: '+2', positive: true }} />
              <StatCard title="الفصول الدراسية" value={classes.length} icon={BookOpen} color="bg-orange-600" />
              <StatCard title="إشعارات جديدة" value={notifications.filter(n => !n.read).length} icon={Bell} color="bg-rose-600" trend={{ value: '-5%', positive: false }} />
            </div>
          );
        case 'performance':
          return (
            <Card key="performance" className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">مؤشر الأداء الأكاديمي</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">متوسط درجات الطلاب حسب المادة</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">المتوسط</span>
                  </div>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    layout="vertical"
                    data={[
                      { subject: 'اللغة العربية', score: 88 },
                      { subject: 'الرياضيات', score: 72 },
                      { subject: 'العلوم', score: 85 },
                      { subject: 'اللغة الإنجليزية', score: 78 },
                      { subject: 'التاريخ', score: 92 },
                      { subject: 'الجغرافيا', score: 80 },
                    ].sort((a, b) => a.score - b.score)}
                    margin={{ left: 40, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={darkMode ? "#1e293b" : "#f1f5f9"} />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis 
                      dataKey="subject" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip 
                      cursor={{ fill: darkMode ? '#1e293b' : '#f8fafc', opacity: 0.4 }}
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                        color: darkMode ? '#f8fafc' : '#1e293b'
                      }}
                      formatter={(value: number) => [`${value}%`, 'المتوسط']}
                    />
                    <Bar 
                      dataKey="score" 
                      radius={[0, 6, 6, 0]}
                      barSize={20}
                    >
                      {
                        [88, 72, 85, 78, 92, 80].map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry < 75 ? '#f43f5e' : entry < 85 ? '#f59e0b' : '#3b82f6'} 
                          />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                    <AlertCircle size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">توصية الإدارة</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      مادة <span className="font-bold text-rose-500">الرياضيات</span> تظهر متوسطاً أقل من المستهدف (72%). يُنصح بمراجعة خطة التدريس أو تكثيف حصص المراجعة.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          );
        case 'studentDist':
          return (
            <Card key="studentDist">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">توزيع الطلاب حسب الصف</h3>
                <button 
                  onClick={() => toggleWidgetCollapse('studentDist')}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-all"
                >
                  <ChevronDown size={20} className={cn("transition-transform duration-300", collapsedWidgets['studentDist'] && "rotate-180")} />
                </button>
              </div>
              <AnimatePresence>
                {!collapsedWidgets['studentDist'] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'الصف 1', count: 45 },
                          { name: 'الصف 2', count: 52 },
                          { name: 'الصف 3', count: 48 },
                          { name: 'الصف 4', count: 61 },
                          { name: 'الصف 5', count: 55 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#1e293b" : "#f1f5f9"} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                          <Tooltip 
                            contentStyle={{ 
                              borderRadius: '12px', 
                              border: 'none', 
                              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                              backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                              color: darkMode ? '#f8fafc' : '#1e293b'
                            }}
                          />
                          <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        case 'fees':
          return (
            <Card key="fees">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">حالة الرسوم الدراسية</h3>
                <button 
                  onClick={() => toggleWidgetCollapse('fees')}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-all"
                >
                  <ChevronDown size={20} className={cn("transition-transform duration-300", collapsedWidgets['fees'] && "rotate-180")} />
                </button>
              </div>
              <AnimatePresence>
                {!collapsedWidgets['fees'] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'مدفوع', value: 75 },
                              { name: 'قيد الانتظار', value: 20 },
                              { name: 'متأخر', value: 5 },
                            ]}
                            innerRadius={80}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            <Cell fill="#10b981" />
                            <Cell fill="#f59e0b" />
                            <Cell fill="#ef4444" />
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              borderRadius: '12px', 
                              border: 'none', 
                              backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                              color: darkMode ? '#f8fafc' : '#1e293b'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        case 'todos':
          return (
            <TodoWidget 
              key="todos"
              todos={todos} 
              setTodos={setTodos} 
              newTodoText={newTodoText} 
              setNewTodoText={setNewTodoText} 
              collapsed={collapsedWidgets['todos']}
              onToggleCollapse={() => toggleWidgetCollapse('todos')}
            />
          );
        default:
          return null;
      }
    };

    return (
      <div className="space-y-0">
        {renderWidget('greeting')}
        {renderWidget('stats')}
        {renderWidget('quick_actions')}

        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={sortableWidgets}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {sortableWidgets.map((id) => (
                <div key={id} className="min-w-0">
                  <SortableWidget id={id}>
                    {renderWidget(id)}
                  </SortableWidget>
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {renderEditScheduleModal()}
      </div>
    );
  };

  const renderAddStudentModal = () => (
    <AnimatePresence>
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-800"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {editingStudent ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}
              </h3>
              <button onClick={() => setAddStudentModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddStudent} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">اسم الطالب</label>
                <input 
                  required
                  type="text" 
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  placeholder="أدخل الاسم الكامل"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">البريد الإلكتروني</label>
                <input 
                  required
                  type="email" 
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  placeholder="example@school.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الصف</label>
                  <select 
                    required
                    value={newStudent.classId}
                    onChange={(e) => setNewStudent({...newStudent, classId: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  >
                    <option value="">اختر الصف</option>
                    <option value="1">الصف الأول</option>
                    <option value="2">الصف الثاني</option>
                    <option value="3">الصف الثالث</option>
                    <option value="4">الصف الرابع</option>
                    <option value="5">الصف الخامس</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الشعبة</label>
                  <input 
                    type="text" 
                    value={newStudent.section}
                    onChange={(e) => setNewStudent({...newStudent, section: e.target.value})}
                    placeholder="أ، ب، جـ..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">اسم ولي الأمر</label>
                  <input 
                    required
                    type="text" 
                    value={newStudent.parentName}
                    onChange={(e) => setNewStudent({...newStudent, parentName: e.target.value})}
                    placeholder="الاسم الثلاثي"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">رقم الهاتف</label>
                  <input 
                    required
                    type="tel" 
                    value={newStudent.parentPhone}
                    onChange={(e) => setNewStudent({...newStudent, parentPhone: e.target.value})}
                    placeholder="0123456789"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-200 dark:shadow-blue-900/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري الحفظ...' : 'حفظ البيانات'}
                </button>
                <button 
                  type="button"
                  onClick={() => setAddStudentModalOpen(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-4 rounded-2xl transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderAddClassModal = () => (
    <AnimatePresence>
      {isAddClassModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-800"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {editingClass ? 'تعديل بيانات الفصل' : 'إضافة فصل جديد'}
              </h3>
              <button onClick={() => setAddClassModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddClass} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">اسم الفصل</label>
                <input 
                  required
                  type="text" 
                  value={newClass.name}
                  onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                  placeholder="مثال: فصل المبدعين"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الصف</label>
                  <select 
                    required
                    value={newClass.gradeId}
                    onChange={(e) => setNewClass({...newClass, gradeId: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="">اختر الصف</option>
                    <option value="1">الصف الأول</option>
                    <option value="2">الصف الثاني</option>
                    <option value="3">الصف الثالث</option>
                    <option value="4">الصف الرابع</option>
                    <option value="5">الصف الخامس</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الشعبة</label>
                  <input 
                    type="text" 
                    value={newClass.section}
                    onChange={(e) => setNewClass({...newClass, section: e.target.value})}
                    placeholder="أ، ب، جـ..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-200 dark:shadow-blue-900/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري الحفظ...' : 'حفظ الفصل'}
                </button>
                <button 
                  type="button"
                  onClick={() => setAddClassModalOpen(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-4 rounded-2xl transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderAddTeacherModal = () => (
    <AnimatePresence>
      {isAddTeacherModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-800"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {editingTeacher ? 'تعديل بيانات المعلم' : 'إضافة معلم جديد'}
              </h3>
              <button onClick={() => setAddTeacherModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddTeacher} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">اسم المعلم</label>
                  <input 
                    required
                    type="text" 
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                    placeholder="أدخل الاسم الكامل"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">البريد الإلكتروني</label>
                  <input 
                    required
                    type="email" 
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                    placeholder="teacher@school.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">المواد الدراسية</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {newTeacher.subjects.map(subId => {
                    const sub = subjects.find(s => s.id === subId);
                    return (
                      <span key={subId} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold flex items-center gap-2">
                        {sub?.name || subId}
                        <button 
                          type="button"
                          onClick={() => setNewTeacher({...newTeacher, subjects: newTeacher.subjects.filter(id => id !== subId)})}
                          className="hover:text-blue-800 dark:hover:text-blue-200"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    );
                  })}
                </div>
                <select 
                  onChange={(e) => {
                    if (e.target.value && !newTeacher.subjects.includes(e.target.value)) {
                      setNewTeacher({...newTeacher, subjects: [...newTeacher.subjects, e.target.value]});
                    }
                    e.target.value = '';
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="">اختر مادة لإضافتها...</option>
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-6 flex gap-3">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-200 dark:shadow-blue-900/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري الحفظ...' : 'حفظ بيانات المعلم'}
                </button>
                <button 
                  type="button"
                  onClick={() => setAddTeacherModalOpen(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-4 rounded-2xl transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderMoveStudentModal = () => (
    <AnimatePresence>
      {isMoveStudentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-800"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">نقل الطالب</h3>
              <button onClick={() => setMoveStudentModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleMoveStudent} className="p-8 space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">نقل الطالب: <span className="font-bold">{studentToMove?.name}</span></p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">الصف الحالي: {getGradeName(studentToMove?.classId)} - شعبة {studentToMove?.section || 'عام'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الصف الجديد</label>
                  <select 
                    required
                    value={moveData.classId}
                    onChange={(e) => setMoveData({...moveData, classId: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  >
                    <option value="">اختر الصف</option>
                    <option value="1">الصف الأول</option>
                    <option value="2">الصف الثاني</option>
                    <option value="3">الصف الثالث</option>
                    <option value="4">الصف الرابع</option>
                    <option value="5">الصف الخامس</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الشعبة الجديدة</label>
                  <input 
                    type="text" 
                    value={moveData.section}
                    onChange={(e) => setMoveData({...moveData, section: e.target.value})}
                    placeholder="مثال: أ، ب، 1"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-amber-200 dark:shadow-amber-900/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري النقل...' : 'تأكيد النقل'}
                </button>
                <button 
                  type="button"
                  onClick={() => setMoveStudentModalOpen(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-4 rounded-2xl transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderAddSubjectModal = () => (
    <AnimatePresence>
      {isAddSubjectModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-800"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">إضافة مادة جديدة</h3>
              <button onClick={() => setAddSubjectModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddSubject} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">اسم المادة</label>
                <input 
                  required
                  type="text" 
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                  placeholder="مثال: الرياضيات"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الدرجة النهائية</label>
                <input 
                  required
                  type="number" 
                  value={newSubject.totalMarks}
                  onChange={(e) => setNewSubject({...newSubject, totalMarks: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-200 dark:shadow-blue-900/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري الحفظ...' : 'حفظ المادة'}
                </button>
                <button 
                  type="button"
                  onClick={() => setAddSubjectModalOpen(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-4 rounded-2xl transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderTeachers = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">إدارة المعلمين</h2>
        <button 
          onClick={() => {
            setEditingTeacher(null);
            setNewTeacher({ name: '', email: '', subjects: [], phone: '' });
            setAddTeacherModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-blue-900/20 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          إضافة معلم
        </button>
      </div>



      <Card className="overflow-hidden p-0">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="البحث عن معلم (الاسم أو المادة)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto hidden sm:block">
          <table className="w-full text-right">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm uppercase transition-colors">
              <tr>
                <th className="px-6 py-4 font-semibold">المعلم</th>
                <th className="px-6 py-4 font-semibold">المواد</th>
                <th className="px-6 py-4 font-semibold">البريد الإلكتروني</th>
                <th className="px-6 py-4 font-semibold">رقم الهاتف</th>
                <th className="px-6 py-4 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
              {filteredTeachers.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => {
                        setSelectedTeacherForProfile(t);
                        setSelectedTeacherIdForAvailability(t.id);
                        setTeacherProfileTab('overview');
                        setTeacherProfileModalOpen(true);
                      }}
                      className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-right group"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {t.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{t.name}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {t.subjects && t.subjects.length > 0 ? (
                        t.subjects.map((subId: string) => {
                          const sub = subjects.find(s => s.id === subId);
                          return (
                            <span key={subId} className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
                              {sub?.name || subId}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 text-xs italic">لا توجد مواد</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm font-medium">{t.email}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm font-medium">{t.phone || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => openEditTeacherModal(t)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all"
                        title="تعديل"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTeacher(t.id, t.name)}
                        className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all"
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTeachers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                    {searchTerm ? 'لا توجد نتائج تطابق بحثك' : 'لا يوجد معلمون مسجلون حالياً'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
          {filteredTeachers.map((t: any) => (
            <div key={t.id} className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => {
                    setSelectedTeacherForProfile(t);
                    setSelectedTeacherIdForAvailability(t.id);
                    setTeacherProfileTab('overview');
                    setTeacherProfileModalOpen(true);
                  }}
                  className="flex items-center gap-3 text-right group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-base">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-white block group-hover:text-blue-600 transition-colors">{t.name}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest">{t.phone || 'بدون هاتف'}</span>
                  </div>
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditTeacherModal(t)}
                    className="p-2.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-xl transition-all"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteTeacher(t.id, t.name)}
                    className="p-2.5 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5 pt-1">
                {t.subjects?.map((subId: string) => {
                  const sub = subjects.find(s => s.id === subId);
                  return (
                    <span key={subId} className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase border border-emerald-100 dark:border-emerald-800/30">
                      {sub?.name || subId}
                    </span>
                  );
                })}
              </div>
              
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                <span className="font-bold opacity-70">البريد:</span>
                <span className="truncate">{t.email}</span>
              </div>
            </div>
          ))}
          {filteredTeachers.length === 0 && (
            <div className="p-12 text-center text-slate-400 dark:text-slate-500 transition-colors">
              {searchTerm ? 'لا توجد نتائج تطابق بحثك' : 'لا يوجد معلمون مسجلون حالياً'}
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  const openEditSubjectModal = (sub: any) => {
    setEditingSubject(sub);
    setNewSubject({ 
      name: sub.name, 
      code: sub.code || '', 
      color: sub.color || 'blue', 
      description: sub.description || '',
      totalMarks: sub.totalMarks || 100
    });
    setAddSubjectModalOpen(true);
  };

  const renderSubjectProfile = () => {
    const tabs = [
      { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
      { id: 'teachers', label: 'المعلمون', icon: Users },
      { id: 'classes', label: 'الفصول', icon: LayoutGrid },
      { id: 'resources', label: 'المصادر', icon: Book },
    ];

    return (
      <AnimatePresence>
        {isSubjectProfileModalOpen && selectedSubjectForProfile && (() => {
          const subjectTeachers = teachers.filter(t => t.subjects?.includes(selectedSubjectForProfile.id));
          const subjectClasses = classes.filter(c => subjectTeachers.some(t => t.id === c.teacherId));
          const colorClass = selectedSubjectForProfile.color || 'blue';

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-white/20 dark:border-slate-800 flex flex-col transition-colors"
              >
                {/* Header */}
                <div className="bg-white dark:bg-slate-900 p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-3xl bg-${colorClass}-100 dark:bg-${colorClass}-900/30 text-${colorClass}-600 dark:text-${colorClass}-400 flex items-center justify-center font-bold text-3xl shadow-xl shadow-${colorClass}-100 dark:shadow-none`}>
                      <BookOpen size={40} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white">{selectedSubjectForProfile.name}</h3>
                        <span className={`px-3 py-1 rounded-full bg-${colorClass}-50 dark:bg-${colorClass}-900/20 text-${colorClass}-600 dark:text-${colorClass}-400 text-xs font-black uppercase`}>
                          {selectedSubjectForProfile.code || 'N/A'}
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 mt-1">{selectedSubjectForProfile.description || 'لا يوجد وصف متاح لهذه المادة'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        openEditSubjectModal(selectedSubjectForProfile);
                        setSubjectProfileModalOpen(false);
                        setSelectedSubjectForProfile(null);
                      }}
                      className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all flex items-center gap-2 border border-blue-100 dark:border-blue-800"
                    >
                      <Edit size={18} />
                      تعديل المادة
                    </button>
                    <button 
                      onClick={() => {
                        setSubjectProfileModalOpen(false);
                        setSelectedSubjectForProfile(null);
                      }}
                      className="bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-3 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white dark:bg-slate-900 px-8 border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar shrink-0 transition-colors">
                  <div className="flex gap-8 min-w-max">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setSubjectProfileTab(tab.id)}
                        className={`py-5 px-1 relative font-bold text-sm transition-all flex items-center gap-2 ${
                          subjectProfileTab === tab.id ? `text-${colorClass}-600 dark:text-${colorClass}-400` : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                        }`}
                      >
                        <tab.icon size={18} />
                        {tab.label}
                        {subjectProfileTab === tab.id && (
                          <motion.div 
                            layoutId="activeSubjectTab"
                            className={`absolute bottom-0 left-0 right-0 h-1 bg-${colorClass}-600 dark:bg-${colorClass}-400 rounded-t-full`}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8">
                  <AnimatePresence mode="wait">
                    {subjectProfileTab === 'overview' && (
                      <motion.div 
                        key="overview"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                      >
                        <div className="md:col-span-2 space-y-8">
                          {/* Stats Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl bg-${colorClass}-50 text-${colorClass}-600 flex items-center justify-center`}>
                                  <Users size={24} />
                                </div>
                                <div>
                                  <p className="text-slate-400 text-xs font-bold">إجمالي المعلمين</p>
                                  <h4 className="text-2xl font-black text-slate-800">{subjectTeachers.length}</h4>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                  <LayoutGrid size={24} />
                                </div>
                                <div>
                                  <p className="text-slate-400 text-xs font-bold">إجمالي الفصول</p>
                                  <h4 className="text-2xl font-black text-slate-800">{subjectClasses.length}</h4>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h4 className="text-lg font-black text-slate-800 mb-4">وصف المادة</h4>
                            <p className="text-slate-600 leading-relaxed">
                              {selectedSubjectForProfile.description || 'لم يتم إضافة وصف تفصيلي لهذه المادة بعد. يمكنك إضافة وصف يوضح الأهداف التعليمية والمواضيع الرئيسية التي تغطيها المادة.'}
                            </p>
                          </div>

                          {/* Teachers Preview */}
                          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                              <h4 className="text-lg font-black text-slate-800">المعلمون</h4>
                              <button onClick={() => setSubjectProfileTab('teachers')} className={`text-${colorClass}-600 text-xs font-bold`}>عرض الكل</button>
                            </div>
                            <div className="flex flex-wrap gap-4">
                              {subjectTeachers.slice(0, 4).map((t: any) => (
                                <div key={t.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                  <div className={`w-8 h-8 rounded-xl bg-${colorClass}-100 text-${colorClass}-600 flex items-center justify-center font-bold text-xs`}>
                                    {t.name.charAt(0)}
                                  </div>
                                  <span className="text-sm font-bold text-slate-700">{t.name}</span>
                                </div>
                              ))}
                              {subjectTeachers.length === 0 && (
                                <p className="text-slate-400 text-sm italic">لا يوجد معلمون مسندون</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-8">
                          <div className={`bg-gradient-to-br from-${colorClass}-600 to-${colorClass}-700 rounded-[2rem] p-8 text-white shadow-xl shadow-${colorClass}-100`}>
                            <h4 className="font-bold mb-4 flex items-center gap-2">
                              <Book size={18} />
                              المنهج الدراسي
                            </h4>
                            <p className="text-white/80 text-xs leading-relaxed mb-6">
                              المنهج الدراسي المحدث متاح للتحميل. تأكد من مراجعة التحديثات الدورية.
                            </p>
                            <button className="w-full bg-white/20 hover:bg-white/30 py-3 rounded-xl font-bold text-sm transition-all backdrop-blur-sm border border-white/10 flex items-center justify-center gap-2">
                              <Download size={18} />
                              تحميل الخطة السنوية
                            </button>
                          </div>

                          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                            <h4 className="font-black text-slate-800 mb-4">تنبيهات المادة</h4>
                            <div className="space-y-4">
                              <div className="flex gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
                                <AlertCircle size={18} className="text-orange-500 shrink-0" />
                                <p className="text-xs text-orange-700 leading-relaxed">تحديث المنهج للفصل الدراسي الثاني متاح الآن.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {subjectProfileTab === 'teachers' && (
                      <motion.div 
                        key="teachers"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {subjectTeachers.map((t: any) => (
                            <div key={t.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                              <div className={`w-14 h-14 rounded-2xl bg-${colorClass}-50 text-${colorClass}-600 flex items-center justify-center font-bold text-xl`}>
                                {t.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-black text-slate-800 truncate">{t.name}</h5>
                                <p className="text-xs text-slate-400 truncate">{t.email}</p>
                                <button 
                                  onClick={() => {
                                    setSelectedTeacherForProfile(t);
                                    setTeacherProfileModalOpen(true);
                                    setSubjectProfileModalOpen(false);
                                  }}
                                  className={`text-${colorClass}-600 text-[10px] font-bold mt-2 hover:underline`}
                                >
                                  عرض الملف الشخصي
                                </button>
                              </div>
                            </div>
                          ))}
                          {subjectTeachers.length === 0 && (
                            <div className="col-span-full py-20 text-center text-slate-400 italic">
                              لا يوجد معلمون مسندون لهذه المادة
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {subjectProfileTab === 'classes' && (
                      <motion.div 
                        key="classes"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      >
                        {subjectClasses.map((c: any) => (
                          <div key={c.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Users size={24} />
                              </div>
                              <div>
                                <h5 className="font-black text-slate-800">{c.name}</h5>
                                <p className="text-xs text-slate-400">الصف {c.grade} - الشعبة {c.section}</p>
                              </div>
                            </div>
                            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                              <span className="text-[10px] font-bold text-slate-400">المعلم المسؤول:</span>
                              <span className="text-[10px] font-bold text-slate-700">{teachers.find(t => t.id === c.teacherId)?.name || 'غير محدد'}</span>
                            </div>
                          </div>
                        ))}
                        {subjectClasses.length === 0 && (
                          <div className="col-span-full py-20 text-center text-slate-400 italic">
                            لا توجد فصول مرتبطة بهذه المادة
                          </div>
                        )}
                      </motion.div>
                    )}

                    {subjectProfileTab === 'resources' && (
                      <motion.div 
                        key="resources"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                          <div className="flex justify-between items-center mb-8">
                            <h4 className="text-lg font-black text-slate-800">المصادر والمناهج</h4>
                            <button className={`bg-${colorClass}-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2`}>
                              <Plus size={16} />
                              إضافة مصدر جديد
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-4 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all flex items-center gap-4 group cursor-pointer">
                              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <FileText size={24} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-slate-700">الخطة الدراسية السنوية</p>
                                <p className="text-[10px] text-slate-400">PDF • 2.4 MB</p>
                              </div>
                              <Download size={18} className="text-slate-300 group-hover:text-blue-600" />
                            </div>
                            <div className="p-4 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all flex items-center gap-4 group cursor-pointer">
                              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all">
                                <Book size={24} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-slate-700">الكتاب المدرسي الرقمي</p>
                                <p className="text-[10px] text-slate-400">PDF • 15.8 MB</p>
                              </div>
                              <Download size={18} className="text-slate-300 group-hover:text-blue-600" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="bg-white p-6 border-t border-slate-100 flex justify-center shrink-0">
                  <p className="text-slate-400 text-xs font-bold">نظام إدارة المناهج الرقمي • الإصدار 2.0</p>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    );
  };

  const renderSubjects = () => {
    const filteredSubjects = subjects.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (s.code && s.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">إدارة المواد الدراسية</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">إدارة المناهج، المعلمين، والخطط الدراسية</p>
          </div>
          <button 
            onClick={() => {
              setEditingSubject(null);
              setNewSubject({ name: '', code: '', color: 'blue', description: '', totalMarks: 100 });
              setAddSubjectModalOpen(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/20 font-bold"
          >
            <Plus size={20} />
            إضافة مادة جديدة
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex gap-4 transition-colors">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="البحث عن مادة دراسية..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <AnimatePresence>
          {isAddSubjectModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors"
              >
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    {editingSubject ? 'تعديل بيانات المادة' : 'إضافة مادة جديدة'}
                  </h3>
                  <button onClick={() => {
                    setAddSubjectModalOpen(false);
                    setEditingSubject(null);
                  }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleAddSubject} className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">اسم المادة</label>
                      <input 
                        required
                        type="text" 
                        value={newSubject.name}
                        onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                        placeholder="مثال: الرياضيات"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">رمز المادة</label>
                      <input 
                        type="text" 
                        value={newSubject.code}
                        onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                        placeholder="مثال: MATH101"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">وصف المادة</label>
                    <textarea 
                      value={newSubject.description}
                      onChange={(e) => setNewSubject({...newSubject, description: e.target.value})}
                      placeholder="أدخل وصفاً موجزاً للمادة..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">لون المادة</label>
                    <div className="flex flex-wrap gap-3">
                      {['blue', 'emerald', 'rose', 'orange', 'purple', 'indigo', 'amber', 'cyan'].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewSubject({...newSubject, color})}
                          className={`w-10 h-10 rounded-xl transition-all border-4 ${
                            newSubject.color === color ? `border-${color}-500 scale-110` : 'border-transparent'
                          } bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-${color}-500 dark:bg-${color}-400`}></div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/20 disabled:opacity-50"
                    >
                      {isSubmitting ? 'جاري الحفظ...' : 'حفظ المادة'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setAddSubjectModalOpen(false)}
                      className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl transition-all"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((sub) => {
            const subjectTeachers = teachers.filter(t => t.subjects?.includes(sub.id));
            const subjectClasses = classes.filter(c => subjectTeachers.some(t => t.id === c.teacherId));
            const colorClass = sub.color || 'blue';

            return (
              <motion.div
                layout
                key={sub.id}
                onClick={() => {
                  setSelectedSubjectForProfile(sub);
                  setSubjectProfileModalOpen(true);
                }}
                className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-950/50 transition-all cursor-pointer group overflow-hidden"
              >
                <div className={`h-2 bg-${colorClass}-500`}></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-${colorClass}-50 dark:bg-${colorClass}-900/20 text-${colorClass}-600 dark:text-${colorClass}-400 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <BookOpen size={28} />
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditSubjectModal(sub);
                        }}
                        className="text-slate-200 hover:text-blue-600 transition-colors p-2 rounded-xl hover:bg-blue-50"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSubject(sub.id);
                        }}
                        className="text-slate-200 hover:text-rose-600 transition-colors p-2 rounded-xl hover:bg-rose-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-800 mb-1">{sub.name}</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-6">{sub.code || 'بدون رمز'}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold mb-1">المعلمون</p>
                      <div className="flex items-center gap-2">
                        <Users size={14} className={`text-${colorClass}-500`} />
                        <span className="font-black text-slate-700 text-sm">{subjectTeachers.length}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold mb-1">الفصول</p>
                      <div className="flex items-center gap-2">
                        <LayoutGrid size={14} className={`text-${colorClass}-500`} />
                        <span className="font-black text-slate-700 text-sm">{subjectClasses.length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex -space-x-2 rtl:space-x-reverse">
                      {subjectTeachers.slice(0, 3).map((t, i) => (
                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-${colorClass}-100 flex items-center justify-center text-[10px] font-black text-${colorClass}-600`} title={t.name}>
                          {t.name.charAt(0)}
                        </div>
                      ))}
                      {subjectTeachers.length > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          +{subjectTeachers.length - 3}
                        </div>
                      )}
                    </div>
                    <span className={`text-xs font-bold text-${colorClass}-600 flex items-center gap-1`}>
                      عرض التفاصيل
                      <ChevronRight size={14} className="rtl:rotate-180" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
          
          {filteredSubjects.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 text-slate-400">
              <BookOpen size={48} className="mx-auto mb-4 opacity-10" />
              <p className="font-bold">
                {searchTerm ? 'لا توجد مواد تطابق بحثك' : 'لا توجد مواد دراسية مضافة حالياً'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStudentProfile = () => {
    const tabs = [
      { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
      { id: 'schedule', label: 'الجدول الدراسي', icon: Calendar },
      { id: 'grades', label: 'الأداء الأكاديمي', icon: Trophy },
      { id: 'tasks', label: 'المهام والواجبات', icon: ClipboardList },
      { id: 'attendance', label: 'الحضور والغياب', icon: Clock },
      { id: 'resources', label: 'الموارد التعليمية', icon: Book },
      { id: 'notifications', label: 'الإشعارات', icon: Bell },
      { id: 'messages', label: 'الرسائل', icon: MessageSquare },
    ];

    const stats = studentStats;

    return (
      <AnimatePresence>
        {isStudentProfileModalOpen && selectedStudentForProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-50 dark:bg-slate-950 rounded-2xl md:rounded-[2.5rem] shadow-2xl w-full max-w-6xl max-h-[95vh] md:max-h-[90vh] overflow-hidden border border-white/20 dark:border-slate-800 flex flex-col transition-colors"
            >
              {/* Header - Fixed */}
              <div className="bg-white dark:bg-slate-900 p-4 md:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 shrink-0 transition-colors">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-2xl md:text-3xl shadow-xl shadow-blue-200 dark:shadow-none">
                      {selectedStudentForProfile.name?.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-emerald-500 border-2 md:border-4 border-white dark:border-slate-900 rounded-full shadow-sm" title="متصل الآن"></div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white truncate">{selectedStudentForProfile.name}</h3>
                      <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] md:text-xs font-black">طالب</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 md:mt-2 text-slate-500 dark:text-slate-400 text-[11px] md:text-sm">
                      <span className="flex items-center gap-1.5"><Info size={12} className="md:w-[14px]" /> الرقم: {selectedStudentForProfile.id?.slice(0, 8).toUpperCase()}</span>
                      <span className="flex items-center gap-1.5"><GraduationCap size={12} className="md:w-[14px]" /> {selectedStudentForProfile.classId ? `الصف ${selectedStudentForProfile.classId}` : 'غير محدد'}</span>
                      <span className="flex items-center gap-1.5"><Users size={12} className="md:w-[14px]" /> الشعبة: {selectedStudentForProfile.section || 'أ'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => setProfileTab('messages')}
                    className="flex-1 md:flex-none bg-blue-600 text-white px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 dark:shadow-blue-900/20"
                  >
                    <MessageSquare size={18} />
                    <span className="hidden xs:inline">تواصل الآن</span>
                  </button>
                  <button 
                    onClick={() => {
                      setStudentProfileModalOpen(false);
                      setSelectedStudentForProfile(null);
                    }} 
                    className="bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-2.5 md:p-3 rounded-xl md:rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs - Fixed */}
              <div className="bg-white dark:bg-slate-900 px-4 md:px-8 border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar shrink-0 transition-colors">
                <div className="flex gap-4 md:gap-8 min-w-max">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setProfileTab(tab.id)}
                      className={`py-4 md:py-5 px-1 relative font-bold text-sm transition-all flex items-center gap-2 ${
                        profileTab === tab.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                      }`}
                    >
                      <tab.icon size={18} />
                      <span className={profileTab === tab.id ? 'block' : 'hidden md:block'}>{tab.label}</span>
                      {profileTab === tab.id && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400 rounded-t-full"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Area - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 min-h-0 bg-slate-50/50 dark:bg-slate-950/50">
                <AnimatePresence mode="wait">
                  {profileTab === 'overview' && (
                    <motion.div 
                      key="overview"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                      <div className="lg:col-span-2 space-y-6 md:space-y-8">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                          <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl md:rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                            <p className="text-slate-400 dark:text-slate-500 text-[10px] md:text-xs font-bold mb-2 uppercase tracking-wider">المعدل التراكمي</p>
                            <h4 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white transition-colors">{stats.gpa}%</h4>
                            <div className="mt-4 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                              <div className="h-full bg-emerald-500" style={{ width: `${stats.gpa}%` }}></div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl md:rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                            <p className="text-slate-400 dark:text-slate-500 text-[10px] md:text-xs font-bold mb-2 uppercase tracking-wider">نسبة الحضور</p>
                            <h4 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white transition-colors">{stats.attendanceRate}%</h4>
                            <div className="mt-4 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                              <div className="h-full bg-blue-500" style={{ width: `${stats.attendanceRate}%` }}></div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl md:rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                            <p className="text-slate-400 dark:text-slate-500 text-[10px] md:text-xs font-bold mb-2 uppercase tracking-wider">المهام المكتملة</p>
                            <h4 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white transition-colors">{stats.completedTasks}/{stats.totalTasks}</h4>
                            <div className="mt-4 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                              <div className="h-full bg-orange-500" style={{ width: `${(stats.completedTasks / (stats.totalTasks || 1)) * 100}%` }}></div>
                            </div>
                          </div>
                        </div>

                        {/* Parent Information */}
                        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                          <h4 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                            <Users size={20} className="text-blue-600" />
                            بيانات ولي الأمر
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors">
                              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-blue-600 shadow-sm transition-colors">
                                <UserCircle size={24} />
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">اسم ولي الأمر</p>
                                <p className="text-slate-800 dark:text-white font-bold transition-colors">{selectedStudentForProfile.parentName || 'غير مسجل'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors">
                              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-emerald-600 shadow-sm transition-colors">
                                <Phone size={24} />
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">رقم الهاتف</p>
                                <p className="text-slate-800 dark:text-white font-bold transition-colors" dir="ltr">{selectedStudentForProfile.parentPhone || 'غير مسجل'}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                          <div className="p-5 md:p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center transition-colors">
                            <h4 className="font-black text-slate-800 dark:text-white">آخر التحديثات</h4>
                            <button className="text-blue-600 dark:text-blue-400 text-xs font-bold">عرض الكل</button>
                          </div>
                          <div className="p-5 md:p-6 space-y-6">
                            {studentGrades.slice(0, 3).map((g, i) => (
                              <div key={i} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-colors">
                                  <Trophy size={20} />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors">تم رصد درجة مادة {g.subject}</p>
                                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 transition-colors">{g.date?.toDate ? format(g.date.toDate(), 'd MMMM yyyy', { locale: ar }) : '-'}</p>
                                </div>
                                <span className="font-black text-emerald-600 dark:text-emerald-400 transition-colors">{g.score}%</span>
                              </div>
                            ))}
                            {studentGrades.length === 0 && (
                              <p className="text-center text-slate-400 dark:text-slate-500 py-4 italic text-sm transition-colors">لا توجد تحديثات أخيرة</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Sidebar */}
                      <div className="space-y-8">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-200">
                          <h4 className="font-bold mb-4 flex items-center gap-2 text-blue-100">
                            <Calendar size={18} />
                            الحصة القادمة
                          </h4>
                          <h5 className="text-2xl font-black mb-1">اللغة العربية</h5>
                          <p className="text-blue-100 text-sm opacity-80">مع أ. أحمد محمد</p>
                          <div className="mt-8 flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                            <Clock size={20} />
                            <span className="font-bold">09:00 ص - 10:00 ص</span>
                          </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                          <h4 className="font-black text-slate-800 mb-6 flex items-center gap-2">
                            <ClipboardList size={18} className="text-orange-500" />
                            مهام عاجلة
                          </h4>
                          <div className="space-y-4">
                            {studentAssignments.filter(a => a.status === 'pending').slice(0, 3).map((a, i) => (
                              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-700">{a.title}</p>
                                  <p className="text-[10px] text-orange-500 font-bold">
                                    {a.dueDate?.toDate ? format(a.dueDate.toDate(), 'd MMMM', { locale: ar }) : '-'}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {studentAssignments.filter(a => a.status === 'pending').length === 0 && (
                              <p className="text-center text-slate-400 py-4 text-xs italic">لا توجد مهام عاجلة</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {profileTab === 'schedule' && (
                    <motion.div 
                      key="schedule"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-right border-collapse">
                            <thead>
                              <tr className="bg-slate-50">
                                <th className="p-6 font-black text-slate-500 text-sm border-b border-slate-100">اليوم / الوقت</th>
                                <th className="p-6 font-black text-slate-500 text-sm border-b border-slate-100">08:00 - 09:00</th>
                                <th className="p-6 font-black text-slate-500 text-sm border-b border-slate-100">09:00 - 10:00</th>
                                <th className="p-6 font-black text-slate-500 text-sm border-b border-slate-100">10:00 - 11:00</th>
                                <th className="p-6 font-black text-slate-500 text-sm border-b border-slate-100">11:00 - 12:00</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].map((day) => (
                                <tr key={day}>
                                  <td className="p-6 font-black text-slate-700 bg-slate-50/50">
                                    {day === 'Sunday' ? 'الأحد' : day === 'Monday' ? 'الاثنين' : day === 'Tuesday' ? 'الثلاثاء' : day === 'Wednesday' ? 'الأربعاء' : 'الخميس'}
                                  </td>
                                  {[0, 1, 2, 3].map(h => {
                                    const entry = studentSchedule.find(s => s.day === day && s.startTime === `${8+h}:00`);
                                    return (
                                      <td key={h} className="p-4">
                                        {entry ? (
                                          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                                            <p className="font-black text-blue-700 text-sm">{entry.subject}</p>
                                            <p className="text-[10px] text-blue-500 mt-1">{entry.teacherName}</p>
                                            <p className="text-[9px] text-blue-400 mt-0.5">{entry.room}</p>
                                          </div>
                                        ) : (
                                          <div className="h-16 border-2 border-dashed border-slate-100 rounded-2xl"></div>
                                        )}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {profileTab === 'grades' && (
                    <motion.div 
                      key="grades"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                            <table className="w-full text-right">
                              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                                <tr>
                                  <th className="px-6 py-4 font-black">المادة</th>
                                  <th className="px-6 py-4 font-black">الفصل الدراسي</th>
                                  <th className="px-6 py-4 font-black">الدرجة</th>
                                  <th className="px-6 py-4 font-black">الحالة</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {studentGrades.map((g) => (
                                  <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-black text-slate-700">{g.subject}</td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">{g.term}</td>
                                    <td className="px-6 py-4">
                                      <span className="font-black text-lg text-slate-800">{g.score}%</span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                                        g.score >= 90 ? 'bg-emerald-100 text-emerald-600' :
                                        g.score >= 75 ? 'bg-blue-100 text-blue-600' :
                                        'bg-orange-100 text-orange-600'
                                      }`}>
                                        {g.score >= 90 ? 'ممتاز' : g.score >= 75 ? 'جيد جداً' : 'جيد'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                                {studentGrades.length === 0 && (
                                  <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">لا توجد درجات مسجلة بعد</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-8">
                          <h4 className="font-black text-slate-800">إحصائيات الأداء</h4>
                          <div className="space-y-6">
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500 font-bold">المواد العلمية</span>
                                <span className="text-blue-600 font-black">92%</span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[92%]"></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500 font-bold">المواد الأدبية</span>
                                <span className="text-emerald-600 font-black">96%</span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[96%]"></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500 font-bold">اللغات</span>
                                <span className="text-orange-600 font-black">88%</span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 w-[88%]"></div>
                              </div>
                            </div>
                          </div>
                          <div className="pt-8 border-t border-slate-50">
                            <div className="bg-blue-50 rounded-2xl p-4 text-center">
                              <p className="text-blue-600 text-xs font-bold mb-1">الترتيب على الصف</p>
                              <h5 className="text-2xl font-black text-blue-800">الخامس</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {profileTab === 'tasks' && (
                    <motion.div 
                      key="tasks"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {studentAssignments.map((task, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                          <div className="flex justify-between items-start mb-4">
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black ${
                              task.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                              task.status === 'submitted' ? 'bg-blue-50 text-blue-600' :
                              'bg-emerald-50 text-emerald-600'
                            }`}>
                              {task.status === 'pending' ? 'قيد الانتظار' : task.status === 'submitted' ? 'تم التسليم' : 'تم التصحيح'}
                            </div>
                            <button className="text-slate-300 group-hover:text-blue-600 transition-colors">
                              <CheckCircle2 size={20} />
                            </button>
                          </div>
                          <h5 className="font-black text-slate-800 mb-1">{task.title}</h5>
                          <p className="text-slate-400 text-xs mb-4">{task.subject}</p>
                          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold">
                            <Clock size={12} />
                            موعد التسليم: {task.dueDate?.toDate ? format(task.dueDate.toDate(), 'PP', { locale: ar }) : '-'}
                          </div>
                        </div>
                      ))}
                      {studentAssignments.length === 0 && (
                        <div className="col-span-full text-center py-20 text-slate-400 italic">لا توجد مهام مسجلة</div>
                      )}
                    </motion.div>
                  )}

                  {profileTab === 'attendance' && (
                    <motion.div 
                      key="attendance"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                          <p className="text-slate-400 text-xs font-bold mb-1">أيام الحضور</p>
                          <h4 className="text-3xl font-black text-emerald-600">{studentAttendance.filter(a => a.status === 'present').length}</h4>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                          <p className="text-slate-400 text-xs font-bold mb-1">أيام الغياب</p>
                          <h4 className="text-3xl font-black text-rose-600">{studentAttendance.filter(a => a.status === 'absent').length}</h4>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                          <p className="text-slate-400 text-xs font-bold mb-1">تأخيرات</p>
                          <h4 className="text-3xl font-black text-orange-600">{studentAttendance.filter(a => a.status === 'late').length}</h4>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                          <p className="text-slate-400 text-xs font-bold mb-1">إجمالي السجلات</p>
                          <h4 className="text-3xl font-black text-blue-600">{studentAttendance.length}</h4>
                        </div>
                      </div>

                      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50">
                          <h4 className="font-black text-slate-800">سجل الحضور التفصيلي</h4>
                        </div>
                        <table className="w-full text-right">
                          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                            <tr>
                              <th className="px-6 py-4 font-black">التاريخ</th>
                              <th className="px-6 py-4 font-black">الحالة</th>
                              <th className="px-6 py-4 font-black">ملاحظات</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {studentAttendance.map((row, i) => (
                              <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-bold text-slate-700">{row.date}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                                    row.status === 'present' ? 'bg-emerald-50 text-emerald-600' :
                                    row.status === 'absent' ? 'bg-rose-50 text-rose-600' :
                                    'bg-orange-50 text-orange-600'
                                  }`}>
                                    {row.status === 'present' ? 'حاضر' : row.status === 'absent' ? 'غائب' : 'متأخر'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-xs">{row.note || '-'}</td>
                              </tr>
                            ))}
                            {studentAttendance.length === 0 && (
                              <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">لا توجد سجلات حضور</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {profileTab === 'resources' && (
                    <motion.div 
                      key="resources"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                      {studentResources.map((res, i) => (
                        <div key={i} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex items-center justify-between p-6 hover:border-blue-100 transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                              {res.type === 'pdf' ? <FileText size={24} /> : res.type === 'video' ? <Book size={24} /> : <Download size={24} />}
                            </div>
                            <div>
                              <h5 className="font-black text-slate-800">{res.title}</h5>
                              <p className="text-xs text-slate-400 font-bold uppercase">{res.subject} • {res.type}</p>
                            </div>
                          </div>
                          <a href={res.url} target="_blank" rel="noopener noreferrer" className="p-3 text-slate-300 hover:text-blue-600 transition-colors">
                            <Download size={24} />
                          </a>
                        </div>
                      ))}
                      {studentResources.length === 0 && (
                        <div className="col-span-full text-center py-20 text-slate-400 italic">لا توجد موارد تعليمية متاحة</div>
                      )}
                    </motion.div>
                  )}

                  {profileTab === 'notifications' && (
                    <motion.div 
                      key="notifications"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      {studentNotifications.map((n, i) => (
                        <div key={i} className={cn("bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex gap-4 items-start", !n.read && "border-blue-200 bg-blue-50/30")}>
                          <div className={cn("p-2 rounded-xl", n.type === 'urgent' ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600")}>
                            <Bell size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <h5 className="font-black text-slate-800">{n.title}</h5>
                              <span className="text-[10px] text-slate-400 font-bold">{n.date?.toDate ? format(n.date.toDate(), 'PPp', { locale: ar }) : ''}</span>
                            </div>
                            <p className="text-sm text-slate-600">{n.message}</p>
                          </div>
                        </div>
                      ))}
                      {studentNotifications.length === 0 && (
                        <div className="text-center py-20 text-slate-400 italic">لا توجد إشعارات خاصة</div>
                      )}
                    </motion.div>
                  )}

                  {profileTab === 'messages' && (
                    <motion.div 
                      key="messages"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-white rounded-[2rem] border border-slate-100 shadow-sm h-[500px] flex flex-col overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                          {selectedStudentForProfile.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm">{selectedStudentForProfile.name}</p>
                          <p className="text-[10px] text-emerald-500 font-bold">نشط الآن</p>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {studentMessages.map((m, i) => (
                          <div key={i} className={cn("flex", m.senderId === user?.uid ? "justify-start" : "justify-end")}>
                            <div className={cn(
                              "max-w-[80%] p-4 rounded-2xl text-sm font-medium shadow-sm",
                              m.senderId === user?.uid 
                                ? "bg-blue-600 text-white rounded-tr-none" 
                                : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none transition-colors"
                            )}>
                              {m.content}
                              <p className={cn("text-[9px] mt-1 opacity-60", m.senderId === user?.uid ? "text-blue-100" : "text-slate-400 dark:text-slate-500")}>
                                {m.timestamp?.toDate ? format(m.timestamp.toDate(), 'p', { locale: ar }) : ''}
                              </p>
                            </div>
                          </div>
                        ))}
                        {studentMessages.length === 0 && (
                          <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs italic">ابدأ المحادثة مع {selectedStudentForProfile.name}</div>
                        )}
                      </div>
                      <div className="p-4 border-t border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
                          if (input.value.trim()) {
                            sendMessage(input.value);
                            input.value = '';
                          }
                        }} className="flex gap-2">
                          <input 
                            name="message"
                            placeholder="اكتب رسالتك هنا..."
                            className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                          />
                          <button type="submit" className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-100 dark:shadow-none">
                            <Send size={20} />
                          </button>
                        </form>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer / Quick Actions */}
              <div className="bg-white dark:bg-slate-900 p-6 border-t border-slate-100 dark:border-slate-800 flex justify-center gap-4 transition-colors">
                <p className="text-slate-400 dark:text-slate-500 text-xs font-bold">نظام إدارة المدرسة الذكي • الإصدار 2.0</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  const renderTeacherProfile = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const slots = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00'];
    
    const toggleSlot = (day: string, slot: string) => {
      const existing = teacherAvailability.find(a => a.day === day && a.slot === slot);
      let next: AvailabilitySlot['type'] = 'suitable';
      
      if (existing) {
        if (existing.type === 'suitable') next = 'preferred';
        else if (existing.type === 'preferred') next = 'unsuitable';
        else {
          setTeacherAvailability(prev => prev.filter(a => !(a.day === day && a.slot === slot)));
          return;
        }
        setTeacherAvailability(prev => prev.map(a => (a.day === day && a.slot === slot) ? { ...a, type: next } : a));
      } else {
        setTeacherAvailability(prev => [...prev, { day, slot, type: 'suitable' }]);
      }
    };

    const getSlotType = (day: string, slot: string) => {
      return teacherAvailability.find(a => a.day === day && a.slot === slot)?.type;
    };

    const dayLabels: Record<string, string> = {
      'Sunday': 'الأحد',
      'Monday': 'الاثنين',
      'Tuesday': 'الثلاثاء',
      'Wednesday': 'الأربعاء',
      'Thursday': 'الخميس'
    };

    return (
      <AnimatePresence>
        {isTeacherProfileModalOpen && selectedTeacherForProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-white/20 dark:border-slate-800 flex flex-col transition-colors"
            >
              {/* Header */}
              <div className="bg-white dark:bg-slate-900 p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-3xl shadow-xl shadow-blue-200 dark:shadow-none">
                    {selectedTeacherForProfile.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-black text-slate-800 dark:text-white">{selectedTeacherForProfile.name}</h3>
                      <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-black">معلم</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-slate-500 dark:text-slate-400 text-sm">
                      <span className="flex items-center gap-1.5"><Mail size={14} /> {selectedTeacherForProfile.email}</span>
                      <span className="flex items-center gap-1.5"><Phone size={14} /> {selectedTeacherForProfile.phone || 'غير مسجل'}</span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} /> 
                        تاريخ الانضمام: {selectedTeacherForProfile.createdAt?.toDate ? format(selectedTeacherForProfile.createdAt.toDate(), 'PP', { locale: ar }) : 'غير متوفر'}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setTeacherProfileModalOpen(false);
                    setSelectedTeacherForProfile(null);
                  }}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-3 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="bg-white dark:bg-slate-900 px-8 border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar shrink-0 transition-colors">
                <div className="flex gap-8 min-w-max">
                  <button
                    onClick={() => setTeacherProfileTab('overview')}
                    className={`py-5 px-1 relative font-bold text-sm transition-all flex items-center gap-2 ${
                      teacherProfileTab === 'overview' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    <LayoutDashboard size={18} />
                    نظرة عامة
                    {teacherProfileTab === 'overview' && (
                      <motion.div layoutId="activeTeacherTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
                    )}
                  </button>
                  <button
                    onClick={() => setTeacherProfileTab('availability')}
                    className={`py-5 px-1 relative font-bold text-sm transition-all flex items-center gap-2 ${
                      teacherProfileTab === 'availability' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    <Clock size={18} />
                    تفضيلات الجدول
                    {teacherProfileTab === 'availability' && (
                      <motion.div layoutId="activeTeacherTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
                    )}
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-8 min-h-0">
                <AnimatePresence mode="wait">
                  {teacherProfileTab === 'overview' && (
                    <motion.div 
                      key="overview"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                      <div className="md:col-span-2 space-y-8">
                        {/* Subjects Section */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                          <h4 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                            <BookOpen size={20} className="text-blue-600 dark:text-blue-400" />
                            المواد الدراسية المسندة
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedTeacherForProfile.subjects && selectedTeacherForProfile.subjects.length > 0 ? (
                              selectedTeacherForProfile.subjects.map((subId: string) => {
                                const sub = subjects.find(s => s.id === subId);
                                return (
                                  <div key={subId} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                                      <Book size={20} />
                                    </div>
                                    <div>
                                      <p className="text-slate-800 dark:text-white font-bold">{sub?.name || subId}</p>
                                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{sub?.code || 'بدون رمز'}</p>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="col-span-2 text-center py-10 text-slate-400 dark:text-slate-500 italic">لا توجد مواد مسندة حالياً</div>
                            )}
                          </div>
                        </div>

                        {/* Schedule Placeholder */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                          <h4 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                            <Calendar size={20} className="text-emerald-600 dark:text-emerald-400" />
                            الجدول الأسبوعي
                          </h4>
                          <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm italic">
                            سيتم عرض الجدول الدراسي للمعلم قريباً
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        {/* Quick Stats */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                          <h4 className="text-lg font-black text-slate-800 dark:text-white mb-6">إحصائيات سريعة</h4>
                          <div className="space-y-6">
                            <div>
                              <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-slate-400 dark:text-slate-500">عدد الفصول</span>
                                <span className="text-blue-600 dark:text-blue-400">4 فصول</span>
                              </div>
                              <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 dark:bg-blue-400" style={{ width: '60%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-slate-400 dark:text-slate-500">عدد الطلاب</span>
                                <span className="text-emerald-600 dark:text-emerald-400">120 طالب</span>
                              </div>
                              <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-600 dark:bg-emerald-400" style={{ width: '80%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black rounded-[2rem] p-8 text-white shadow-xl">
                          <h4 className="font-bold mb-6 flex items-center gap-2 text-slate-300 dark:text-slate-400">
                            <Info size={18} />
                            معلومات التواصل
                          </h4>
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <Mail size={18} className="text-blue-400" />
                              <span className="text-sm">{selectedTeacherForProfile.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Phone size={18} className="text-emerald-400" />
                              <span className="text-sm" dir="ltr">{selectedTeacherForProfile.phone || 'غير متوفر'}</span>
                            </div>
                            <div className="flex items-center gap-3 border-t border-white/10 pt-4 mt-2">
                              <Calendar size={18} className="text-orange-400" />
                              <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">تاريخ الانضمام</span>
                                <span className="text-sm font-bold">
                                  {selectedTeacherForProfile.createdAt?.toDate 
                                    ? format(selectedTeacherForProfile.createdAt.toDate(), 'PP', { locale: ar }) 
                                    : 'غير متوفر'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {teacherProfileTab === 'availability' && (
                    <motion.div 
                      key="availability"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                        <div>
                          <h4 className="text-lg font-black text-slate-800 dark:text-white">تفضيلات الجدول الدراسي</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">حدد الأوقات المناسبة والمفضلة وغير المناسبة للتدريس</p>
                        </div>
                        <button 
                          onClick={saveAvailability}
                          disabled={isSavingAvailability}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-50"
                        >
                          {isSavingAvailability ? <Clock className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                          <span>حفظ التفضيلات</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl transition-colors">
                          <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                          <span className="text-sm font-bold text-emerald-800 dark:text-emerald-400">وقت مفضل</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl transition-colors">
                          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                          <span className="text-sm font-bold text-blue-800 dark:text-blue-400">وقت مناسب</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl transition-colors">
                          <div className="w-4 h-4 rounded-full bg-rose-500"></div>
                          <span className="text-sm font-bold text-rose-800 dark:text-rose-400">وقت غير مناسب</span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm overflow-x-auto transition-colors">
                        <table className="w-full text-right border-collapse min-w-[600px]">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 transition-colors">
                              <th className="px-6 py-4 text-slate-500 dark:text-slate-400 font-bold text-sm">الوقت / اليوم</th>
                              {days.map(day => (
                                <th key={day} className="px-6 py-4 text-slate-800 dark:text-white font-bold text-sm text-center">{dayLabels[day]}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {slots.map(slot => (
                              <tr key={slot} className="border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">{slot}</td>
                                {days.map(day => {
                                  const type = getSlotType(day, slot);
                                  return (
                                    <td key={`${day}-${slot}`} className="p-1">
                                      <button
                                        onClick={() => toggleSlot(day, slot)}
                                        className={cn(
                                          "w-full h-16 rounded-xl transition-all border-2 flex items-center justify-center",
                                          type === 'preferred' ? "bg-emerald-500 border-emerald-600 text-white shadow-inner" :
                                          type === 'suitable' ? "bg-blue-500 border-blue-600 text-white shadow-inner" :
                                          type === 'unsuitable' ? "bg-rose-500 border-rose-600 text-white shadow-inner" :
                                          "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 text-slate-300 dark:text-slate-600"
                                        )}
                                      >
                                        {type === 'preferred' && <Trophy size={20} />}
                                        {type === 'suitable' && <CheckCircle2 size={20} />}
                                        {type === 'unsuitable' && <X size={20} />}
                                        {!type && <Plus size={16} />}
                                      </button>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-6 rounded-3xl flex items-start gap-4 transition-colors">
                        <Info className="text-amber-600 dark:text-amber-400 shrink-0" size={24} />
                        <div className="text-sm text-amber-800 dark:text-amber-200">
                          <p className="font-bold mb-1">كيفية الاستخدام:</p>
                          <ul className="list-disc list-inside space-y-1 opacity-80">
                            <li>اضغط مرة واحدة لتحديد الوقت كـ <span className="font-bold">مناسب</span> (أزرق)</li>
                            <li>اضغط مرتين لتحديد الوقت كـ <span className="font-bold">مفضل</span> (أخضر)</li>
                            <li>اضغط ثلاث مرات لتحديد الوقت كـ <span className="font-bold">غير مناسب</span> (أحمر)</li>
                            <li>اضغط مرة أخرى لإلغاء التحديد</li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="bg-white dark:bg-slate-900 p-6 border-t border-slate-100 dark:border-slate-800 flex justify-center transition-colors">
                <p className="text-slate-400 dark:text-slate-500 text-xs font-bold">ملف المعلم الرقمي • مدرسة المبدعين</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  const openClassSchedule = async (cls: any) => {
    setSelectedClassForSchedule(cls);
    setClassScheduleModalOpen(true);
    try {
      const q = query(collection(db, 'schedules'), where('classId', '==', cls.id));
      const snap = await getDocs(q);
      setClassSchedule(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching class schedule:", error);
    }
  };

  const renderClassScheduleModal = () => (
    <AnimatePresence>
      {isClassScheduleModalOpen && selectedClassForSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/20 dark:border-slate-800 flex flex-col transition-colors"
          >
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white">الجدول الدراسي: {selectedClassForSchedule.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">الصف {selectedClassForSchedule.grade} - شعبة {selectedClassForSchedule.section}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setClassScheduleModalOpen(false);
                  setSelectedClassForSchedule(null);
                  setClassSchedule([]);
                }} 
                className="bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50">
                        <th className="p-6 font-black text-slate-500 dark:text-slate-400 text-sm border-b border-slate-100 dark:border-slate-800">اليوم / الوقت</th>
                        <th className="p-6 font-black text-slate-500 dark:text-slate-400 text-sm border-b border-slate-100 dark:border-slate-800">08:00 - 09:00</th>
                        <th className="p-6 font-black text-slate-500 dark:text-slate-400 text-sm border-b border-slate-100 dark:border-slate-800">09:00 - 10:00</th>
                        <th className="p-6 font-black text-slate-500 dark:text-slate-400 text-sm border-b border-slate-100 dark:border-slate-800">10:00 - 11:00</th>
                        <th className="p-6 font-black text-slate-500 dark:text-slate-400 text-sm border-b border-slate-100 dark:border-slate-800">11:00 - 12:00</th>
                        <th className="p-6 font-black text-slate-500 dark:text-slate-400 text-sm border-b border-slate-100 dark:border-slate-800">12:00 - 13:00</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].map((day) => (
                        <tr key={day}>
                          <td className="p-6 font-black text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/20">
                            {day === 'Sunday' ? 'الأحد' : day === 'Monday' ? 'الاثنين' : day === 'Tuesday' ? 'الثلاثاء' : day === 'Wednesday' ? 'الأربعاء' : 'الخميس'}
                          </td>
                          {['08:00', '09:00', '10:00', '11:00', '12:00'].map(startTime => {
                            const entry = classSchedule.find(s => s.day === day && s.startTime === startTime);
                            return (
                              <td key={startTime} className="p-4">
                                {entry ? (
                                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 min-w-[120px] transition-colors">
                                    <p className="font-black text-blue-700 dark:text-blue-400 text-sm">{entry.subject}</p>
                                    <p className="text-[10px] text-blue-500 dark:text-blue-500 mt-1">{entry.teacherName}</p>
                                    <p className="text-[9px] text-blue-400 dark:text-blue-600 mt-0.5">{entry.room}</p>
                                  </div>
                                ) : (
                                  <div className="h-16 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl"></div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderClasses = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">إدارة الفصول الدراسية</h2>
        <button 
          onClick={() => {
            setEditingClass(null);
            setNewClass({ name: '', gradeId: '', section: '', teacherId: '' });
            setAddClassModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-blue-900/20 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          إضافة فصل
        </button>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="البحث عن فصل (الاسم أو الصف)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto hidden sm:block">
          <table className="w-full text-right">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm uppercase transition-colors">
              <tr>
                <th className="px-6 py-4 font-semibold">اسم الفصل</th>
                <th className="px-6 py-4 font-semibold">الصف / الشعبة</th>
                <th className="px-6 py-4 font-semibold">المعلم</th>
                <th className="px-6 py-4 font-semibold">عدد الطلاب</th>
                <th className="px-6 py-4 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
              {filteredClasses.map((c: any) => {
                const teacher = teachers.find(t => t.id === c.teacherId);
                const studentsInClass = students.filter(s => s.classId === c.grade && s.section === c.section).length;
                
                return (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xs">
                          {c.name.charAt(0)}
                        </div>
                        <button 
                          onClick={() => openClassSchedule(c)}
                          className="font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-right"
                        >
                          {c.name}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
                          الصف {c.grade}
                        </span>
                        {c.section && (
                          <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold">
                            شعبة {c.section}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">
                      {teacher ? teacher.name : 'غير محدد'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{studentsInClass} طالب</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => openEditClassModal(c)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium text-sm transition-colors"
                        >
                          تعديل
                        </button>
                        <button 
                          onClick={() => handleDeleteClass(c.id, c.name)}
                          className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 font-medium text-sm transition-colors"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredClasses.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 transition-colors">
                    {searchTerm ? 'لا توجد نتائج تطابق بحثك' : 'لا توجد فصول مسجلة حالياً'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
          {filteredClasses.map((c: any) => {
            const teacher = teachers.find(t => t.id === c.teacherId);
            const studentsInClass = students.filter(s => s.classId === c.grade && s.section === c.section).length;
            
            return (
              <div key={c.id} className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-base">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <button 
                        onClick={() => openClassSchedule(c)}
                        className="font-black text-slate-800 dark:text-white block text-sm"
                      >
                        {c.name}
                      </button>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">
                          الصف {c.grade}
                        </span>
                        {c.section && (
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            شعبة {c.section}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditClassModal(c)}
                      className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClass(c.id, c.name)}
                      className="p-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 rounded-xl"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <User size={14} className="opacity-70" />
                    <span className="font-medium truncate max-w-[120px]">{teacher ? teacher.name : 'غير محدد'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Users size={14} className="opacity-70" />
                    <span className="font-bold text-slate-700 dark:text-slate-200">{studentsInClass} طالب</span>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredClasses.length === 0 && (
            <div className="p-12 text-center text-slate-400 dark:text-slate-500 transition-colors">
              {searchTerm ? 'لا توجد نتائج تطابق بحثك' : 'لا توجد فصول مسجلة حالياً'}
            </div>
          )}
        </div>
      </Card>
      {renderClassScheduleModal()}
    </div>
  );

  const renderStudents = () => {
    const groupedStudents = filteredStudents.reduce((acc: any, s: any) => {
      const cid = s.classId || 'unassigned';
      const sec = s.section || 'عام';
      if (!acc[cid]) acc[cid] = {};
      if (!acc[cid][sec]) acc[cid][sec] = [];
      acc[cid][sec].push(s);
      return acc;
    }, {});

    const sortedGrades = Object.keys(groupedStudents).sort();

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">إدارة الطلاب</h2>
          <div className="flex flex-wrap gap-3">
            <label className="cursor-pointer bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20">
              {isImporting ? <Clock className="animate-spin" size={20} /> : <FileText size={20} />}
              {isImporting ? 'جاري الاستيراد...' : 'استيراد من Excel'}
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                className="hidden" 
                onChange={handleImportExcel}
                disabled={isImporting}
              />
            </label>
            <button 
              onClick={() => {
                setEditingStudent(null);
                setNewStudent({ name: '', email: '', classId: '', section: '', parentName: '', parentPhone: '' });
                setAddStudentModalOpen(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              <Plus size={20} />
              إضافة طالب
            </button>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="البحث عن طالب (الاسم أو البريد)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-4">
          {sortedGrades.map((gradeId) => (
            <div key={gradeId} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
              <button 
                onClick={() => setExpandedGrades(prev => prev.includes(gradeId) ? prev.filter(id => id !== gradeId) : [...prev, gradeId])}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <BookOpen size={20} />
                  </div>
                  <div className="text-right">
                    <h3 className="font-bold text-slate-800 dark:text-white">{getGradeName(gradeId)}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {(Object.values(groupedStudents[gradeId]) as any[]).reduce((sum: number, students: any) => sum + students.length, 0)} طالب
                    </p>
                  </div>
                </div>
                {expandedGrades.includes(gradeId) ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronLeft size={20} className="text-slate-400" />}
              </button>

              <AnimatePresence>
                {expandedGrades.includes(gradeId) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20"
                  >
                    <div className="p-4 space-y-3">
                      {Object.keys(groupedStudents[gradeId]).sort().map((sectionName) => {
                        const sectionKey = `${gradeId}-${sectionName}`;
                        const sectionStudents = groupedStudents[gradeId][sectionName];
                        
                        return (
                          <div key={sectionKey} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
                            <button 
                              onClick={() => setExpandedSections(prev => prev.includes(sectionKey) ? prev.filter(id => id !== sectionKey) : [...prev, sectionKey])}
                              className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                  <Users size={16} />
                                </div>
                                <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">شعبة: {sectionName}</span>
                                <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{sectionStudents.length} طلاب</span>
                              </div>
                              {expandedSections.includes(sectionKey) ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronLeft size={16} className="text-slate-400" />}
                            </button>

                            <AnimatePresence>
                              {expandedSections.includes(sectionKey) && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="border-t border-slate-50 dark:border-slate-800"
                                >
                                  <div className="p-2">
                                    {/* Desktop Table View */}
                                    <div className="hidden sm:block overflow-x-auto">
                                      <table className="w-full text-right text-sm">
                                        <thead className="text-slate-400 dark:text-slate-500 text-xs uppercase">
                                          <tr>
                                            <th className="px-4 py-2 font-semibold">الاسم</th>
                                            <th className="px-4 py-2 font-semibold">البريد</th>
                                            <th className="px-4 py-2 font-semibold">الإجراءات</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                          {sectionStudents.map((s: any) => (
                                            <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                              <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10px]">
                                                    {s.name.charAt(0)}
                                                  </div>
                                                  <button 
                                                    onClick={() => openStudentProfile(s)}
                                                    className="font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors text-right"
                                                  >
                                                    {s.name}
                                                  </button>
                                                </div>
                                              </td>
                                              <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{s.email}</td>
                                              <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                  <button onClick={() => openStudentProfile(s)} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 transition-colors" title="الملف الشخصي">
                                                    <ExternalLink size={14} />
                                                  </button>
                                                  <button onClick={() => openEditModal(s)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors" title="تعديل">
                                                    <FileText size={14} />
                                                  </button>
                                                  <button 
                                                    onClick={() => {
                                                      setStudentToMove(s);
                                                      setMoveData({ classId: s.classId || '', section: s.section || '' });
                                                      setMoveStudentModalOpen(true);
                                                    }} 
                                                    className="text-amber-600 dark:text-amber-400 hover:text-amber-800 transition-colors"
                                                    title="نقل الطالب"
                                                  >
                                                    <ArrowLeftRight size={14} />
                                                  </button>
                                                  <button onClick={() => handleDeleteStudent(s.id, s.name)} className="text-rose-600 dark:text-rose-400 hover:text-rose-800 transition-colors" title="حذف">
                                                    <Trash2 size={14} />
                                                  </button>
                                                </div>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>

                                    {/* Mobile Card View */}
                                    <div className="sm:hidden space-y-3">
                                      {sectionStudents.map((s: any) => (
                                        <div key={s.id} className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                                          <div className="flex items-center justify-between gap-4 mb-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                                                {s.name.charAt(0)}
                                              </div>
                                              <div className="min-w-0">
                                                <button 
                                                  onClick={() => openStudentProfile(s)}
                                                  className="font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 transition-colors text-sm truncate block w-full text-right"
                                                >
                                                  {s.name}
                                                </button>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{s.email}</p>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
                                            <div className="flex gap-4">
                                              <button onClick={() => openStudentProfile(s)} className="text-emerald-600 dark:text-emerald-400 p-1">
                                                <ExternalLink size={18} />
                                              </button>
                                              <button onClick={() => openEditModal(s)} className="text-blue-600 dark:text-blue-400 p-1">
                                                <FileText size={18} />
                                              </button>
                                              <button 
                                                onClick={() => {
                                                  setStudentToMove(s);
                                                  setMoveData({ classId: s.classId || '', section: s.section || '' });
                                                  setMoveStudentModalOpen(true);
                                                }} 
                                                className="text-amber-600 dark:text-amber-400 p-1"
                                              >
                                                <ArrowLeftRight size={18} />
                                              </button>
                                            </div>
                                            <button onClick={() => handleDeleteStudent(s.id, s.name)} className="text-rose-600 dark:text-rose-400 p-1">
                                              <Trash2 size={18} />
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          {sortedGrades.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 transition-colors">
              {searchTerm ? 'لا توجد نتائج تطابق بحثك' : 'لا يوجد طلاب مسجلين حالياً'}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className={cn(
        "min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors", 
        darkMode && "dark"
      )} dir="rtl">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 280 : 0, 
          opacity: isSidebarOpen ? 1 : 0,
          x: isSidebarOpen ? 0 : 280 
        }}
        className={cn(
          "bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-screen sticky top-0 overflow-hidden z-50 transition-colors",
          "fixed lg:sticky lg:translate-x-0"
        )}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
              <GraduationCap size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">EduManage</span>
          </div>

          <nav className="space-y-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <SidebarItem icon={LayoutDashboard} label="لوحة التحكم" active={activeTab === 'dashboard'} onClick={() => handleSidebarItemClick('dashboard')} />
            
            <SidebarGroup 
              icon={BookOpen} 
              label="الشؤون الأكاديمية" 
              isOpen={openSidebarGroups['academic']} 
              onToggle={() => toggleSidebarGroup('academic')}
            >
              <SidebarItem icon={BookOpen} label="المواد الدراسية" active={activeTab === 'subjects'} onClick={() => handleSidebarItemClick('subjects')} />
              <SidebarItem icon={LayoutGrid} label="الفصول" active={activeTab === 'classes'} onClick={() => handleSidebarItemClick('classes')} />
              <SidebarItem icon={Calendar} label="الحضور" active={activeTab === 'attendance'} onClick={() => handleSidebarItemClick('attendance')} />
              {appConfig.modules.scheduler && <SidebarItem icon={BrainCircuit} label="الجدولة الذكية" active={activeTab === 'academic' && (activeSubTab === 'scheduler' || !activeSubTab)} onClick={() => handleSidebarItemClick('academic', 'scheduler')} />}
              {appConfig.modules.examManagement && <SidebarItem icon={FileCheck} label="الامتحانات والنتائج" active={activeTab === 'academic' && activeSubTab === 'exams'} onClick={() => handleSidebarItemClick('academic', 'exams')} />}
            </SidebarGroup>

            <SidebarGroup 
              icon={Users} 
              label="إدارة المستخدمين" 
              isOpen={openSidebarGroups['management']} 
              onToggle={() => toggleSidebarGroup('management')}
            >
              <SidebarItem icon={Users} label="الطلاب" active={activeTab === 'students'} onClick={() => handleSidebarItemClick('students')} />
              <SidebarItem icon={UserCircle} label="المعلمون" active={activeTab === 'teachers'} onClick={() => handleSidebarItemClick('teachers')} />
            </SidebarGroup>

            <SidebarGroup 
              icon={Truck} 
              label="الخدمات واللوجستيات" 
              isOpen={openSidebarGroups['logistics']} 
              onToggle={() => toggleSidebarGroup('logistics')}
            >
              {appConfig.modules.busTracking && <SidebarItem icon={MapPin} label="تتبع الحافلات" active={activeTab === 'logistics' && activeSubTab === 'tracking'} onClick={() => handleSidebarItemClick('logistics', 'tracking')} />}
            </SidebarGroup>

            <SidebarGroup 
              icon={FinanceIcon} 
              label="المالية والمخازن" 
              isOpen={openSidebarGroups['financial']} 
              onToggle={() => toggleSidebarGroup('financial')}
            >
              {appConfig.modules.accounting && <SidebarItem icon={Wallet} label="الحسابات والأقساط" active={activeTab === 'finance' && (activeSubTab === 'accounting' || !activeSubTab)} onClick={() => handleSidebarItemClick('finance', 'accounting')} />}
              {appConfig.modules.inventory && <SidebarItem icon={ShoppingBag} label="المبيعات والمخزن" active={activeTab === 'finance' && activeSubTab === 'inventory'} onClick={() => handleSidebarItemClick('finance', 'inventory')} />}
            </SidebarGroup>

            <SidebarGroup 
              icon={MessageCircle} 
              label="التواصل والقبول" 
              isOpen={openSidebarGroups['others']} 
              onToggle={() => toggleSidebarGroup('others')}
            >
              {appConfig.modules.applicantPortal && <SidebarItem icon={UserPlus} label="طلبات الالتحاق" active={activeTab === 'communication' && (activeSubTab === 'applicants' || !activeSubTab)} onClick={() => handleSidebarItemClick('communication', 'applicants')} />}
              {appConfig.modules.crm && <SidebarItem icon={Layers} label="CRM والمتابعة" active={activeTab === 'communication' && activeSubTab === 'crm'} onClick={() => handleSidebarItemClick('communication', 'crm')} />}
              <SidebarItem icon={Bell} label="الإشعارات" active={activeTab === 'notifications'} onClick={() => handleSidebarItemClick('notifications')} />
            </SidebarGroup>

            <SidebarItem icon={Settings} label="إعدادات النظام" active={activeTab === 'settings'} onClick={() => handleSidebarItemClick('settings')} />
          </nav>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all font-medium"
            >
              <LogOut size={20} />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden relative">
        {/* Header */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-40 px-6 md:px-10 py-6 border-b border-slate-100/50 dark:border-slate-800/50 flex justify-between items-center transition-all duration-500">
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm rounded-[1rem] text-slate-500 dark:text-slate-400 transition-all"
            >
              {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)] hidden md:block" />
              <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tighter truncate max-w-[200px] md:max-w-none">
                {activeTab === 'dashboard' && 'لوحة المعلومات المركزية'}
                {activeTab === 'students' && 'إدارة بيانات الطلاب'}
                {activeTab === 'teachers' && 'شؤون المعلمين'}
                {activeTab === 'subjects' && 'المناهج الدراسية'}
                {activeTab === 'classes' && 'الفصول الدراسية'}
                {activeTab === 'attendance' && 'سجل الحضور الذكي'}
                {activeTab === 'finance' && (
                  activeSubTab === 'inventory' ? 'المستودع والمبيعات' : 
                  activeSubTab === 'transactions' ? 'التحليلات المالية' : 
                  'التحصيل المدرسي'
                )}
                {activeTab === 'academic' && (
                  activeSubTab === 'exams' ? 'إدارة الاختبارات' : 
                  activeSubTab === 'performance' ? 'تتبع الأداء' : 
                  'الجدولة الزمنية'
                )}
                {activeTab === 'logistics' && (
                  activeSubTab === 'tracking' ? 'تتبع الحوارة' : 
                  activeSubTab === 'subscriptions' ? 'النقل المدرسي' : 
                  'إدارة الأسطول'
                )}
                {activeTab === 'communication' && (
                  activeSubTab === 'crm' ? 'خدمة العملاء' : 
                  activeSubTab === 'whatsapp' ? 'الرسائل الفورية' : 
                  'طلبات التسجيل'
                )}
                {activeTab === 'notifications' && 'مركز التنبيهات'}
                {activeTab === 'settings' && 'تخصيص النظام'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-8">
            <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm transition-all"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
              <button className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden lg:block text-left">
                <p className="text-sm font-black text-slate-800 dark:text-white leading-tight">{profile?.name}</p>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{profile?.role}</p>
              </div>
              <div className="relative group cursor-pointer">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-[1.25rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5 shadow-xl shadow-blue-500/20 group-hover:rotate-6 transition-all duration-500">
                  <div className="w-full h-full rounded-[1.1rem] bg-white dark:bg-slate-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-base md:text-lg">
                    {profile?.name?.charAt(0)}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950 shadow-sm" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-6 lg:p-10 max-w-[1600px] mx-auto w-full transition-all duration-500">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (activeSubTab || '')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'students' && (
                <>
                  {renderStudents()}
                  {renderStudentProfile()}
                </>
              )}
              {activeTab === 'teachers' && (
                <>
                  {renderTeachers()}
                  {renderTeacherProfile()}
                </>
              )}
              {activeTab === 'subjects' && (
                <>
                  {renderSubjects()}
                  {renderSubjectProfile()}
                </>
              )}
              {activeTab === 'classes' && renderClasses()}
              {activeTab === 'attendance' && renderAttendance()}
              {activeTab === 'finance' && <FinanceModule key={`fin-${activeSubTab}`} initialTab={activeSubTab as any} onTabChange={syncSubTab} />}
              {activeTab === 'academic' && (
                <AcademicModule 
                  key={`acad-${activeSubTab}`} 
                  initialTab={activeSubTab as any} 
                  onTabChange={syncSubTab}
                  teachers={teachers}
                  subjects={subjects}
                  classes={classes}
                  schedules={allSchedules}
                  onGenerate={generateSchedule}
                  onSaveSchedule={saveSchedule}
                />
              )}
              {activeTab === 'logistics' && <LogisticsModule key={`log-${activeSubTab}`} initialTab={activeSubTab as any} onTabChange={syncSubTab} />}
              {activeTab === 'communication' && <CommunicationModule key={`comm-${activeSubTab}`} initialTab={activeSubTab as any} onTabChange={syncSubTab} />}
              {activeTab === 'settings' && <SettingsModule appConfig={appConfig} toggleModule={toggleModule} toggleLanguage={toggleLanguage} />}
              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">الإشعارات</h2>
                  {notifications.map((n: any) => (
                    <Card key={n.id} className={cn("flex gap-4 items-start", !n.read && "border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/20")}>
                      <div className={cn("p-2 rounded-lg", !n.read ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500")}>
                        <Bell size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-slate-800 dark:text-white">{n.title}</h4>
                          <span className="text-xs text-slate-400 dark:text-slate-500">{n.date?.toDate ? format(n.date.toDate(), 'PPp', { locale: ar }) : ''}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">{n.message}</p>
                      </div>
                    </Card>
                  ))}
                  {notifications.length === 0 && (
                    <div className="text-center py-20 text-slate-400 dark:text-slate-500">لا توجد إشعارات حالياً</div>
                  )}
                </div>
              )}
              {/* Other tabs would be implemented similarly */}
              {!['dashboard', 'students', 'notifications', 'teachers', 'classes', 'attendance', 'finance', 'academic', 'logistics', 'communication', 'settings'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center py-32 text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 shadow-inner">
                  <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-8 animate-pulse text-slate-300">
                    <Clock size={48} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">هذه الصفحة قيد التطوير</h2>
                  <p className="text-slate-500 dark:text-slate-400">نحن نعمل بجد لإطلاق ميزات {activeTab} في أقرب وقت.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          {renderAddStudentModal()}
          {renderAddClassModal()}
          {renderAddTeacherModal()}
          {renderMoveStudentModal()}
          {renderAddSubjectModal()}
        </div>
      </main>
    </div>
    </ErrorBoundary>
  );
}
