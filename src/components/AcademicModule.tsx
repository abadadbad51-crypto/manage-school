import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  BrainCircuit, 
  FileCheck, 
  Trophy, 
  Plus, 
  Search,
  Calendar,
  Clock,
  LayoutGrid,
  ClipboardList,
  AlertCircle,
  FileSpreadsheet,
  Download,
  GraduationCap,
  X,
  UserCircle,
  Save,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { Card } from './ui/Card';
import { cn } from '../lib/utils';

interface AcademicModuleProps {
  initialTab?: 'scheduler' | 'exams' | 'performance';
  onTabChange?: (tab: 'scheduler' | 'exams' | 'performance') => void;
  teachers?: any[];
  subjects?: any[];
  classes?: any[];
  schedules?: any[];
  onGenerate?: (classIds?: string[]) => Promise<void>;
  onSaveSchedule?: (classId: string, day: string, slot: string, data: any) => Promise<void>;
}

export const AcademicModule: React.FC<AcademicModuleProps> = ({ 
  initialTab = 'scheduler', 
  onTabChange,
  teachers = [],
  subjects = [],
  classes = [],
  schedules = [],
  onGenerate,
  onSaveSchedule
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'scheduler' | 'exams' | 'performance'>(initialTab);

  // Sync internal state if initialTab changes (useful if clicking different sidebar items)
  React.useEffect(() => {
    setActiveSubTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (tab: 'scheduler' | 'exams' | 'performance') => {
    setActiveSubTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
          <BookOpen className="text-indigo-600" size={32} />
          الشؤون الأكاديمية والجدولة
        </h2>
        
        <div className="flex bg-slate-100 dark:bg-[#202022] p-1 rounded-2xl overflow-x-auto scrollbar-hide max-w-full">
          <div className="flex min-w-max">
            {[
              { id: 'scheduler', label: 'الجدولة الذكية', icon: BrainCircuit },
              { id: 'exams', label: 'إدارة الكنترول', icon: ClipboardList },
              { id: 'performance', label: 'تحليل الأداء', icon: Trophy }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap",
                  activeSubTab === tab.id 
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                <tab.icon size={16} className="md:size-[18px]" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeSubTab === 'scheduler' && (
        <MasterSchedulerSection 
          teachers={teachers} 
          subjects={subjects} 
          classes={classes} 
          schedules={schedules}
          onGenerate={onGenerate}
          onSaveSchedule={onSaveSchedule}
        />
      )}
      {activeSubTab === 'exams' && <ExamManagementSection />}
      {activeSubTab === 'performance' && <PerformanceAnalyticsSection />}
    </div>
  );
};

const MasterSchedulerSection = ({ 
  teachers = [], 
  subjects = [], 
  classes = [], 
  schedules = [],
  onGenerate,
  onSaveSchedule
}: {
  teachers: any[],
  subjects: any[],
  classes: any[],
  schedules: any[],
  onGenerate?: (classIds?: string[], customSlots?: any[]) => Promise<void>,
  onSaveSchedule?: (classId: string, day: string, slot: string, data: any) => Promise<void>
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');

  const [timeSlots, setTimeSlots] = useState([
    { start: '08:00', end: '09:00' },
    { start: '09:00', end: '10:00' },
    { id: 'break', label: 'استراحة', type: 'break' },
    { start: '10:30', end: '11:30' },
    { start: '11:30', end: '12:30' }
  ]);

  // Effect to select first class if none selected
  React.useEffect(() => {
    if (!selectedClassId && classes.length > 0) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes]);

  const startAutoGenerate = async () => {
    if (!onGenerate) return;
    setIsGenerating(true);
    try {
      await onGenerate(undefined, timeSlots.filter(s => s.start));
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء توليد الجدول.");
    } finally {
      setIsGenerating(false);
    }
  };

  const daysAr = [
    { id: 'Sunday', label: 'الأحد' },
    { id: 'Monday', label: 'الاثنين' },
    { id: 'Tuesday', label: 'الثلاثاء' },
    { id: 'Wednesday', label: 'الأربعاء' },
    { id: 'Thursday', label: 'الخميس' }
  ];

  const getSlotContent = (dayId: string, start: string, end: string) => {
    return schedules.find(s => s.classId === selectedClassId && s.day === dayId && s.startTime === start);
  };

  const [isManageSlotsOpen, setIsManageSlotsOpen] = useState(false);
  const [editingSlots, setEditingSlots] = useState<any[]>([]);

  const openManageSlots = () => {
    setEditingSlots([...timeSlots]);
    setIsManageSlotsOpen(true);
  };

  const handleSaveManageSlots = () => {
    setTimeSlots(editingSlots);
    setIsManageSlotsOpen(false);
  };

  const handleUpdateEditingSlot = (idx: number, key: string, val: string) => {
    const newSlots = [...editingSlots];
    newSlots[idx] = { ...newSlots[idx], [key]: val };
    setEditingSlots(newSlots);
  };

  const handleRemoveEditingSlot = (idx: number) => {
    setEditingSlots(editingSlots.filter((_, i) => i !== idx));
  };

  const handleAddEditingBreak = () => {
    setEditingSlots([...editingSlots, { id: `break-${Date.now()}`, label: 'استراحة', type: 'break' }]);
  };

  const handleAddEditingSlot = () => {
    const lastSlot = [...editingSlots].reverse().find(s => s.start);
    if (!lastSlot) {
      setEditingSlots([...editingSlots, { start: '08:00', end: '09:00' }]);
      return;
    }
    const [h, m] = lastSlot.end.split(':').map(Number);
    const newStart = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const newEnd = `${String(h + 1).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    setEditingSlots([...editingSlots, { start: newStart, end: newEnd }]);
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<any>(null);

  const openEditSlot = (dayId: string, slot: any, currentContent: any) => {
    setEditingSlot({
      dayId,
      startTime: slot.start,
      endTime: slot.end,
      content: currentContent || {
        subject: '',
        teacherId: '',
        room: ''
      }
    });
    setIsEditModalOpen(true);
  };

  const handleSaveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSaveSchedule) return;
    
    setIsGenerating(true);
    try {
      await onSaveSchedule(
        selectedClassId, 
        editingSlot.dayId, 
        `${editingSlot.startTime}-${editingSlot.endTime}`, 
        editingSlot.content
      );
      setIsEditModalOpen(false);
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء حفظ الحصة.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Manage Slots Modal */}
      <AnimatePresence>
        {isManageSlotsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsManageSlotsOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#141415] rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 dark:border-white/5 max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-800 dark:text-white">إدارة الأوقات والاستراحات</h3>
                <button onClick={() => setIsManageSlotsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2">
                {editingSlots.map((slot, idx) => (
                  <div key={idx} className="flex gap-3 items-center bg-slate-50 dark:bg-[#202022] p-3 rounded-2xl border border-slate-100 dark:border-white/10">
                    <span className="text-xs font-black text-slate-400 w-4">{idx + 1}</span>
                    {slot.type === 'break' ? (
                      <div className="flex-1 flex items-center gap-3">
                        <span className="text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest">نوع الحصة: استراحة</span>
                        <input 
                          type="text" 
                          value={slot.label} 
                          onChange={(e) => handleUpdateEditingSlot(idx, 'label', e.target.value)}
                          className="flex-1 bg-white dark:bg-[#141415] border-none rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                          placeholder="اسم الاستراحة..."
                        />
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center gap-3">
                        <div className="flex-1">
                          <input 
                            type="time" 
                            value={slot.start} 
                            onChange={(e) => handleUpdateEditingSlot(idx, 'start', e.target.value)}
                            className="w-full bg-white dark:bg-[#141415] border-none rounded-xl px-4 py-2 text-sm font-black outline-none focus:ring-2 focus:ring-indigo-500/20 text-center"
                          />
                        </div>
                        <span className="text-slate-400 font-bold">-</span>
                        <div className="flex-1">
                          <input 
                            type="time" 
                            value={slot.end} 
                            onChange={(e) => handleUpdateEditingSlot(idx, 'end', e.target.value)}
                            className="w-full bg-white dark:bg-[#141415] border-none rounded-xl px-4 py-2 text-sm font-black outline-none focus:ring-2 focus:ring-indigo-500/20 text-center"
                          />
                        </div>
                      </div>
                    )}
                    <button 
                      onClick={() => handleRemoveEditingSlot(idx)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button 
                  onClick={handleAddEditingSlot}
                  className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors shadow-sm"
                >
                  <Plus size={16} />
                  إضافة حصة
                </button>
                <button 
                  onClick={handleAddEditingBreak}
                  className="bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors shadow-sm"
                >
                  <Plus size={16} />
                  إضافة استراحة
                </button>
              </div>

              <button 
                onClick={handleSaveManageSlots}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <Save size={18} />
                حفظ الأوقات واعتمادها
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-[#141415] rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 dark:border-white/5"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-800 dark:text-white">تعديل حصة دراسية</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveSlot} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 mr-1">المادة الدراسية</label>
                  <select 
                    value={editingSlot.content.subjectId || subjects.find(s => s.name === editingSlot.content.subject)?.id || ''}
                    onChange={(e) => {
                      const sub = subjects.find(s => s.id === e.target.value);
                      setEditingSlot({
                        ...editingSlot,
                        content: { ...editingSlot.content, subject: sub?.name || '', subjectId: sub?.id }
                      });
                    }}
                    className="w-full bg-slate-50 dark:bg-[#202022] border-none rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  >
                    <option value="">اختر المادة</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 mr-1">المعلم</label>
                  <select 
                    value={editingSlot.content.teacherId || ''}
                    onChange={(e) => setEditingSlot({
                      ...editingSlot,
                      content: { ...editingSlot.content, teacherId: e.target.value, teacherName: teachers.find(t => t.id === e.target.value)?.name }
                    })}
                    className="w-full bg-slate-50 dark:bg-[#202022] border-none rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  >
                    <option value="">اختر المعلم</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 mr-1">القاعة / الغرفة</label>
                  <input 
                    type="text"
                    value={editingSlot.content.room || ''}
                    onChange={(e) => setEditingSlot({
                      ...editingSlot,
                      content: { ...editingSlot.content, room: e.target.value }
                    })}
                    placeholder="مثال: قاعة 102"
                    className="w-full bg-slate-50 dark:bg-[#202022] border-none rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    حفظ التغييرات
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 p-6 space-y-6 flex flex-col">
          <div className="flex-1 space-y-6">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white mb-4">أدوات التحكم والذكاء</h4>
              <div className="space-y-3">
                <button 
                  onClick={startAutoGenerate}
                  disabled={isGenerating}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-3 group"
                >
                  {isGenerating ? (
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
                      className="w-5 h-5 border-3 border-white border-t-transparent rounded-full" 
                    />
                  ) : <BrainCircuit className="group-hover:scale-110 transition-transform" size={20} />}
                  <span className="text-sm">{isGenerating ? 'جاري التحليل والربط...' : 'توليد ذكي (AI)'}</span>
                </button>

                <button 
                  onClick={openManageSlots}
                  className="w-full bg-slate-100 dark:bg-[#202022] text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-white/10 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 hover:bg-slate-200 dark:hover:bg-slate-700 shadow-sm"
                >
                  <Clock size={18} className="text-indigo-600" />
                  <span className="text-sm">إدارة الأوقات والاستراحات</span>
                </button>
                
                <button className="w-full bg-white dark:bg-[#202022] text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-white/10 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700">
                  <Download size={18} />
                  <span className="text-sm">تصدير PDF للفصول</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-widest">إحصائيات الجدول</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20/20 text-center">
                  <p className="text-[8px] font-black text-blue-400 uppercase mb-1">نسبة الإنجاز</p>
                  <p className="text-lg font-black text-blue-700 dark:text-blue-400">92%</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20/20 text-center">
                  <p className="text-[8px] font-black text-emerald-400 uppercase mb-1">التضاربات</p>
                  <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">0</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-500/20/20 rounded-3xl">
            <h5 className="text-amber-700 dark:text-amber-400 font-black text-xs flex items-center gap-2 mb-3">
              <AlertCircle size={14} />
              رؤى ذكية (AI Analysis)
            </h5>
            <p className="text-[10px] text-amber-600 dark:text-amber-500 leading-relaxed font-medium">
              تم اكتشاف أن معظم حصص "الرياضيات" تقع في نهاية اليوم الدراسي. يوصى بنقلها للصباح الباكر لزيادة تركيز الطلاب بنسبة 20%.
            </p>
          </div>
        </Card>

        <Card className="lg:col-span-3 overflow-hidden flex flex-col min-h-[600px]">
          <div className="p-6 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50 dark:bg-[#141415]/50 backdrop-blur-sm">
            <div>
              <h4 className="font-black text-slate-800 dark:text-white text-xl">لوحة الجدولة الأكاديمية</h4>
              <p className="text-xs text-slate-500 mt-1">إدارة وضبط الحصص الأسبوعية للفصول</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-400 uppercase">عرض الفصل:</span>
              <select 
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="bg-slate-100 dark:bg-[#202022] border-none rounded-xl text-xs font-black px-5 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} - الصف {c.grade}{c.section}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex-1 overflow-x-auto p-6 bg-slate-50/30 dark:bg-[#0a0a0b]/20">
            {/* Desktop View */}
            <div className="hidden lg:grid min-w-[900px] grid-cols-6 border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#141415] shadow-xl shadow-slate-200/20 dark:shadow-none">
              <div className="bg-slate-50 dark:bg-[#202022]/80 p-5 font-black text-slate-400 text-center text-[10px] uppercase tracking-widest flex items-center justify-center border-b border-l border-slate-200 dark:border-white/5">الوقت / اليوم</div>
              {daysAr.map(day => (
                <div key={day.id} className="bg-slate-50 dark:bg-[#202022]/80 p-5 font-black text-slate-700 dark:text-zinc-200 text-center text-sm border-b border-l last:border-l-0 border-slate-200 dark:border-white/5">{day.label}</div>
              ))}
              
              {timeSlots.map((slot, idx) => (
                <React.Fragment key={idx}>
                  <div className="p-4 bg-slate-50/50 dark:bg-[#202022]/30 text-[10px] font-black text-slate-400 flex flex-col items-center justify-center border-b border-l border-slate-100 dark:border-white/5 tabular-nums">
                    {slot.type === 'break' ? (
                      <span className="rotate-90 md:rotate-0 tracking-widest text-slate-300">-----</span>
                    ) : (
                      <>
                        <span className="text-slate-600 dark:text-zinc-300">{slot.start}</span>
                        <div className="w-px h-2 bg-slate-200 dark:bg-slate-700 my-1" />
                        <span>{slot.end}</span>
                      </>
                    )}
                  </div>
                  
                  {slot.type === 'break' ? (
                    <div className="col-span-5 p-2 bg-slate-100/30 dark:bg-[#202022]/50 flex items-center justify-center border-b border-slate-100 dark:border-white/5">
                       <div className="flex items-center gap-4">
                         <div className="h-px w-20 bg-gradient-to-r from-transparent to-slate-200 dark:to-slate-700" />
                         <span className="text-[10px] font-black tracking-[0.5em] text-slate-300 dark:text-slate-600 uppercase">الاستراحة</span>
                         <div className="h-px w-20 bg-gradient-to-l from-transparent to-slate-200 dark:to-slate-700" />
                       </div>
                    </div>
                  ) : (
                    daysAr.map(day => {
                      const content = getSlotContent(day.id, slot.start!, slot.end!);
                      const subColor = subjects.find(s => s.name === content?.subject)?.color || 'blue';
                      
                      const colorClasses: Record<string, string> = {
                        blue: "bg-blue-50 dark:bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-400",
                        emerald: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400",
                        amber: "bg-amber-50 dark:bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400",
                        rose: "bg-rose-50 dark:bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-400",
                        indigo: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-700 dark:text-indigo-400",
                        orange: "bg-orange-50 dark:bg-orange-500/10 border-orange-500 text-orange-700 dark:text-orange-400",
                        cyan: "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-500 text-cyan-700 dark:text-cyan-400",
                        purple: "bg-purple-50 dark:bg-purple-900/20 border-purple-500 text-purple-700 dark:text-purple-400",
                        pink: "bg-pink-50 dark:bg-pink-900/20 border-pink-500 text-pink-700 dark:text-pink-400",
                        slate: "bg-slate-50 dark:bg-[#202022]/50 border-slate-400 text-slate-700 dark:text-zinc-300"
                      };

                      return (
                        <div key={day.id} className="p-2 border-b border-l last:border-l-0 border-slate-100 dark:border-white/5 min-h-[100px] group relative">
                          <AnimatePresence mode="wait">
                            {content ? (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => openEditSlot(day.id, slot, content)}
                                className={cn(
                                  "h-full rounded-2xl p-3 border-r-4 transition-all group-hover:shadow-md cursor-pointer",
                                  colorClasses[subColor] || colorClasses.blue
                                )}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <p className="text-[11px] font-black truncate max-w-[80%]">{content.subject}</p>
                                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded">
                                    <Plus size={10} />
                                  </button>
                                </div>
                                <p className="text-[9px] font-bold opacity-80 mb-2 truncate">{content.teacherName}</p>
                                <div className="flex items-center gap-1 opacity-60">
                                  <LayoutGrid size={10} />
                                  <span className="text-[8px] font-bold uppercase">{content.room}</span>
                                </div>
                              </motion.div>
                            ) : (
                              <div 
                                onClick={() => openEditSlot(day.id, slot, null)}
                                className="h-full w-full border-2 border-dashed border-slate-100 dark:border-white/5/50 rounded-2xl flex items-center justify-center group-hover:border-indigo-200 dark:group-hover:border-indigo-900 transition-all cursor-pointer"
                              >
                                <Plus size={16} className="text-slate-100 dark:text-slate-800 group-hover:text-indigo-400 transition-colors" />
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Mobile View */}
            <div className="lg:hidden space-y-6 pb-8">
              {daysAr.map(day => (
                <div key={day.id} className="space-y-3">
                  <h5 className="font-black text-slate-800 dark:text-white flex items-center gap-2 text-sm sticky top-0 bg-white/80 dark:bg-[#141415]/80 backdrop-blur-md py-2 z-10">
                    <Calendar size={14} className="text-indigo-600" />
                    {day.label}
                  </h5>
                  <div className="grid grid-cols-1 gap-3">
                    {timeSlots.map((slot, idx) => {
                      if (slot.type === 'break') return (
                        <div key={idx} className="bg-slate-100/50 dark:bg-[#202022]/50 rounded-xl p-2 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          الاستراحة
                        </div>
                      );
                      const content = getSlotContent(day.id, slot.start!, slot.end!);
                      const subColor = subjects.find(s => s.name === content?.subject)?.color || 'blue';
                      const colorClasses: Record<string, string> = {
                        blue: "bg-blue-50 dark:bg-blue-500/10 border-blue-500",
                        emerald: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500",
                        amber: "bg-amber-50 dark:bg-amber-500/10 border-amber-500",
                        rose: "bg-rose-50 dark:bg-rose-500/10 border-rose-500",
                        indigo: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500",
                        orange: "bg-orange-50 dark:bg-orange-500/10 border-orange-500",
                        cyan: "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-500",
                        purple: "bg-purple-50 dark:bg-purple-900/20 border-purple-500",
                        pink: "bg-pink-50 dark:bg-pink-900/20 border-pink-500",
                        slate: "bg-slate-50 dark:bg-[#202022]/50 border-slate-400"
                      };

                      return (
                        <div 
                          key={idx} 
                          onClick={() => openEditSlot(day.id, slot, content)}
                          className={cn(
                            "flex items-center gap-4 p-3 rounded-2xl border-r-4 bg-white dark:bg-[#202022] shadow-sm border border-slate-100 dark:border-white/5",
                            content ? colorClasses[subColor] : "border-dashed"
                          )}
                        >
                          <div className="text-[10px] font-black text-slate-400 w-16 tabular-nums">
                            {slot.start} - {slot.end}
                          </div>
                          {content ? (
                            <div className="flex-1">
                              <p className="text-sm font-black text-slate-800 dark:text-white leading-none mb-1">{content.subject}</p>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-500">{content.teacherName}</span>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">{content.room}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1 text-[10px] font-bold text-slate-300 italic">فارغ - اضغط للإضافة</div>
                          )}
                          <Plus size={14} className="text-slate-300" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const ExamManagementSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-white dark:bg-[#141415] border-none shadow-xl">
           <div className="flex items-center gap-4 mb-6">
             <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
               <ClipboardList size={24} />
             </div>
             <div>
               <h4 className="text-xl font-black text-slate-800 dark:text-white">الامتحانات القادمة</h4>
               <p className="text-xs text-slate-500">جدول الامتحانات الورقية</p>
             </div>
           </div>
           
           <div className="space-y-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-[#202022]/50 rounded-2xl group hover:bg-indigo-50 transition-all cursor-pointer">
                 <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex flex-col items-center justify-center font-bold text-slate-700 dark:text-zinc-300">
                   <span className="text-xs">MAY</span>
                   <span className="text-lg leading-none">{15+i}</span>
                 </div>
                 <div className="flex-1">
                   <p className="text-sm font-bold text-slate-800 dark:text-white">مادة الفيزياء - نهائي</p>
                   <p className="text-[10px] text-slate-500">الصف الثاني عشر</p>
                 </div>
                 <div className="text-right">
                   <p className="text-xs font-bold text-indigo-600 uppercase">09:00 AM</p>
                   <p className="text-[8px] text-slate-400 uppercase">ساعة واحدة</p>
                 </div>
               </div>
             ))}
           </div>
           
           <button className="w-full mt-6 bg-slate-50 dark:bg-[#202022] text-slate-600 dark:text-zinc-400 font-bold py-3 rounded-xl text-sm border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-indigo-500 hover:text-indigo-600 transition-all">
             + إضافة امتحان للجدول
           </button>
        </Card>

        <Card className="lg:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
            <h4 className="font-black text-slate-800 dark:text-white">رصد الدرجات والشهادات</h4>
            <div className="flex gap-2">
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-100">
                إصدار النتائج للكل
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-4 mb-6">
              <select className="flex-1 min-w-[150px] bg-slate-50 dark:bg-[#202022] border-none rounded-xl text-xs font-bold px-4 py-2">
                <option>الفصل الدراسي الأول</option>
                <option>الفصل الدراسي الثاني</option>
              </select>
              <select className="flex-1 min-w-[150px] bg-slate-50 dark:bg-[#202022] border-none rounded-xl text-xs font-bold px-4 py-2">
                <option>الصف العاشر - أ</option>
              </select>
              <div className="relative flex-1 min-w-[200px]">
                <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="بحث عن طالب..." className="w-full bg-slate-50 dark:bg-[#202022] border-none rounded-xl text-xs font-bold px-10 py-2" />
              </div>
            </div>

            <div className="overflow-x-auto hidden sm:block">
              <table className="w-full text-right border-collapse">
                <thead className="bg-slate-50/50 dark:bg-[#202022]/50 text-slate-400 text-[10px] uppercase font-bold">
                  <tr>
                    <th className="px-4 py-3 border-b border-slate-100 dark:border-white/5">الطالب</th>
                    <th className="px-4 py-3 border-b border-slate-100 dark:border-white/5">العربية</th>
                    <th className="px-4 py-3 border-b border-slate-100 dark:border-white/5">الرياضيات</th>
                    <th className="px-4 py-3 border-b border-slate-100 dark:border-white/5">العلوم</th>
                    <th className="px-4 py-3 border-b border-slate-100 dark:border-white/5">المتوسط</th>
                    <th className="px-4 py-3 border-b border-slate-100 dark:border-white/5">الشهادة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {[1, 2, 3, 4, 5].map(i => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-bold text-slate-700 dark:text-zinc-300">سلطان محمد {i}</td>
                      <td className="px-4 py-3"><input type="number" defaultValue={85 + i} className="w-12 bg-transparent text-center text-xs font-bold text-blue-600 focus:outline-none" /></td>
                      <td className="px-4 py-3"><input type="number" defaultValue={70 + i * 2} className="w-12 bg-transparent text-center text-xs font-bold text-blue-600 focus:outline-none" /></td>
                      <td className="px-4 py-3"><input type="number" defaultValue={92 - i} className="w-12 bg-transparent text-center text-xs font-bold text-blue-600 focus:outline-none" /></td>
                      <td className="px-4 py-3 text-xs font-black text-slate-800 dark:text-white">{(85+70+92)/3}%</td>
                      <td className="px-4 py-3">
                        <button className="text-indigo-600 hover:text-indigo-800 transition-colors">
                          <Download size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-white text-sm">سلطان محمد {i}</span>
                    <button className="p-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <Download size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-50 dark:bg-[#202022]/50 p-2 rounded-xl text-center">
                      <p className="text-[8px] text-slate-400 uppercase mb-1">العربية</p>
                      <input type="number" defaultValue={85+i} className="w-full bg-transparent text-center text-xs font-black text-blue-600 outline-none" />
                    </div>
                    <div className="bg-slate-50 dark:bg-[#202022]/50 p-2 rounded-xl text-center">
                      <p className="text-[8px] text-slate-400 uppercase mb-1">الرياضيات</p>
                      <input type="number" defaultValue={70+i*2} className="w-full bg-transparent text-center text-xs font-black text-blue-600 outline-none" />
                    </div>
                    <div className="bg-slate-50 dark:bg-[#202022]/50 p-2 rounded-xl text-center">
                      <p className="text-[8px] text-slate-400 uppercase mb-1">العلوم</p>
                      <input type="number" defaultValue={92-i} className="w-full bg-transparent text-center text-xs font-black text-blue-600 outline-none" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-xl">
                    <span className="text-[10px] font-bold text-indigo-600">المعدل العام:</span>
                    <span className="text-xs font-black text-indigo-700 dark:text-indigo-400">{(85+70+92)/3}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const PerformanceAnalyticsSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
           <h4 className="font-bold text-slate-800 dark:text-white mb-6">تحليل مؤشر الرضا</h4>
           <div className="flex items-end gap-2 h-40">
             {[45, 60, 40, 80, 55, 90, 75].map((h, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-2">
                 <motion.div 
                   initial={{ height: 0 }}
                   animate={{ height: `${h}%` }}
                   className={cn(
                     "w-full rounded-t-lg transition-all",
                     h > 70 ? "bg-indigo-500" : h > 50 ? "bg-blue-400" : "bg-slate-200"
                   )}
                 />
                 <span className="text-[8px] text-slate-400 font-bold uppercase">WK{i+1}</span>
               </div>
             ))}
           </div>
           <p className="mt-4 text-[10px] text-slate-500 leading-relaxed">
             هذا المؤشر يوضح استقرار الدرجات عبر الزوجي والأسابيع الدراسية. الارتفاع الأخير بنسبة 15% يعود لزيادة الأنشطة اللاصفية.
           </p>
        </Card>

        <Card className="lg:col-span-2 p-6">
           <div className="flex justify-between items-center mb-6">
             <h4 className="font-bold text-slate-800 dark:text-white">الطلاب الأكثر تطوراً</h4>
             <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
               <Trophy size={20} />
             </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="flex items-center gap-4 p-4 border border-slate-100 dark:border-white/5 rounded-2xl relative overflow-hidden group hover:border-indigo-200 transition-all">
                 <div className="absolute top-0 right-0 p-1 bg-emerald-500 text-white rounded-bl-xl text-[8px] font-black uppercase">+12%</div>
                 <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-xs uppercase">ST</div>
                 <div>
                   <p className="text-xs font-black text-slate-800 dark:text-white">طالب متميز {i}</p>
                   <div className="flex items-center gap-2 mt-1">
                     <div className="w-16 h-1 bg-slate-100 dark:bg-[#202022] rounded-full">
                       <div className="h-full w-4/5 bg-emerald-500 rounded-full"></div>
                     </div>
                     <span className="text-[8px] font-bold text-emerald-600">جديد: 94%</span>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </Card>
      </div>

      <Card className="p-8 border-none bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="p-4 bg-white/20 rounded-[2rem] backdrop-blur-md">
            <GraduationCap size={48} className="text-white" />
          </div>
          <div className="flex-1 text-center md:text-right">
            <h4 className="text-2xl font-black mb-2">محرك التنبؤ بالذكاء الاصطناعي</h4>
            <p className="text-white/80 text-sm leading-relaxed max-w-xl">
              بناءً على البيانات الحالية، يُتوقع أن يحقق 85% من طلاب الصف العاشر درجات "امتياز" في اختبارات نهاية الفصل. نوصي بالتركيز على 5 طلاب أظهروا تراجعاً طفيفاً لتفادي الانخفاض.
            </p>
          </div>
          <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform">
            عرض القائمة المستهدفة
          </button>
        </div>
      </Card>
    </div>
  );
};
