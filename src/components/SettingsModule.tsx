import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Globe, 
  Layers, 
  Cloud, 
  Plus, 
  Smartphone, 
  ShieldCheck, 
  Database,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  PlusCircle,
  Info
} from 'lucide-react';
import { Card } from './ui/Card';
import { cn } from '../lib/utils';
import { AppConfig } from '../types';

interface SettingsModuleProps {
  appConfig: AppConfig;
  toggleModule: (key: keyof AppConfig['modules']) => void;
  toggleLanguage: () => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({ appConfig, toggleModule, toggleLanguage }) => {
  const [activeSubTab, setActiveSubTab] = useState<'modules' | 'international' | 'customFields' | 'cloud'>('modules');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
          <Settings className="text-slate-600 dark:text-slate-400" size={32} />
          إعدادات النظام المتقدمة
        </h2>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          {[
            { id: 'modules', label: 'الموديولات', icon: Layers },
            { id: 'international', label: 'اللغة والتقارير', icon: Globe },
            { id: 'customFields', label: 'الحقول المخصصة', icon: PlusCircle },
            { id: 'cloud', label: 'الربط السحابي', icon: Cloud }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                activeSubTab === tab.id 
                  ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeSubTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(appConfig.modules).map(([key, enabled]) => (
            <Card key={key} className={cn(
              "p-6 transition-all duration-300 border-2",
              enabled ? "border-blue-500 shadow-lg shadow-blue-100 dark:shadow-none" : "border-slate-100 dark:border-slate-800 opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
            )}>
              <div className="flex justify-between items-start mb-4">
                <div className={cn(
                  "p-3 rounded-2xl",
                  enabled ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                )}>
                  {key === 'accounting' && <Database size={24} />}
                  {key === 'inventory' && <Layers size={24} />}
                  {key === 'busTracking' && <ShieldCheck size={24} />}
                  {key === 'scheduler' && <Globe size={24} />}
                  {key === 'examManagement' && <Database size={24} />}
                  {key === 'applicantPortal' && <Plus size={24} />}
                  {key === 'crm' && <Globe size={24} />}
                </div>
                <button 
                  onClick={() => toggleModule(key as any)}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-all duration-500 p-1",
                    enabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                  )}
                >
                  <motion.div 
                    animate={{ x: enabled ? 24 : 0 }}
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>
              <h5 className="font-bold text-slate-800 dark:text-white mb-2 uppercase text-xs tracking-widest">
                {key.replace(/([A-Z])/g, ' $1')}
              </h5>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                تفعيل/تعطيل ميزات {key} بالكامل من واجهة المستخدم والوصول للبيانات.
              </p>
            </Card>
          ))}
        </div>
      )}

      {activeSubTab === 'international' && (
        <Card className="p-8">
           <div className="max-w-2xl mx-auto space-y-8">
             <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
               <div>
                 <h4 className="font-bold text-slate-800 dark:text-white mb-1">لغة النظام (i18n)</h4>
                 <p className="text-xs text-slate-500 italic">تغيير واجهة البرنامج بالكامل</p>
               </div>
               <button 
                onClick={toggleLanguage}
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100 dark:border-slate-700 hover:scale-105 transition-transform"
               >
                 <Globe size={24} className="text-blue-600" />
                 <span className="font-black text-slate-800 dark:text-white">{appConfig.language === 'ar' ? 'العربية' : 'English'}</span>
                 <ArrowRightLeft size={16} className="text-slate-400" />
               </button>
             </div>

             <div>
               <h4 className="font-bold text-slate-800 dark:text-white mb-4">خيارات التقارير الرقمية</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-4">
                    <CheckCircle2 className="text-emerald-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">الأرقام الهندية (English numerals)</p>
                      <p className="text-[10px] text-slate-400">مثال: 1, 2, 3</p>
                    </div>
                  </div>
                  <div className="p-4 border-2 border-blue-100 dark:border-blue-900/30 rounded-2xl flex items-center gap-4 bg-blue-50/20">
                    <CheckCircle2 className="text-blue-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">الأرقام العربية (Arabic numerals)</p>
                      <p className="text-[10px] text-slate-400">مثال: ١, ٢, ٣</p>
                    </div>
                  </div>
               </div>
             </div>
           </div>
        </Card>
      )}

      {activeSubTab === 'customFields' && (
        <div className="space-y-6">
          <Card className="p-6">
             <div className="flex justify-between items-center mb-6">
                <div>
                   <h4 className="font-bold text-slate-800 dark:text-white">إدارة الحقول المخصصة (Custom Fields)</h4>
                   <p className="text-[10px] text-slate-500">أضف حقولاً جديدة لملفات الطلاب أو المعلمين دون تعديل الكود</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Plus size={16} />
                  إضافة حقل جديد
                </button>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-right">
                   <thead className="text-[10px] uppercase text-slate-400 bg-slate-50 dark:bg-slate-800/50 font-bold">
                      <tr>
                         <th className="px-6 py-4">اسم الحقل</th>
                         <th className="px-6 py-4">نوع البيانات</th>
                         <th className="px-6 py-4">الكيان المرتبط</th>
                         <th className="px-6 py-4">خيارات</th>
                         <th className="px-6 py-4">الإجراءات</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {[
                        { name: 'فصيلة الدم', type: 'نص', entity: 'الطالب', options: '-' },
                        { name: 'حالة طبية خاصة', type: 'نص طويل', entity: 'الطالب', options: '-' },
                        { name: 'مستوى اللغة', type: 'قائمة منسدلة', entity: 'المعلم', options: 'A1, A2, B1, B2' },
                      ].map((field, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">{field.name}</td>
                           <td className="px-6 py-4 text-xs text-slate-500">{field.type}</td>
                           <td className="px-6 py-4 text-xs text-slate-500">{field.entity}</td>
                           <td className="px-6 py-4 text-[10px] text-slate-400">{field.options}</td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                                <button className="p-1.5 text-slate-300 hover:text-blue-500 transition-colors"><Eye size={16} /></button>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </Card>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-2xl flex items-start gap-4">
             <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
             <p className="text-xs text-blue-600 leading-relaxed font-medium">
               ملاحظة: عند إضافة حقل جديد، سيظهر تلقائياً في خانة "الإضافات" في نموذج إضافة/تعديل السجل المختار.
             </p>
          </div>
        </div>
      )}

      {activeSubTab === 'cloud' && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-8 border-2 border-slate-100 dark:border-slate-800 hover:border-blue-500 transition-all group">
             <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <Cloud size={32} />
             </div>
             <h4 className="text-xl font-black text-slate-800 dark:text-white mb-2">Google Drive</h4>
             <p className="text-xs text-slate-500 leading-relaxed mb-8">ربط النظام مباشرة بحساب المؤسسة على جوجل درايف لرفع وحفظ ملفات الطلاب والواجبات تلقائياً.</p>
             <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100">ربط الحساب الآن</button>
          </Card>

          <Card className="p-8 border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-500 transition-all group">
             <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <Smartphone size={32} />
             </div>
             <h4 className="text-xl font-black text-slate-800 dark:text-white mb-2">Microsoft 365</h4>
             <p className="text-xs text-slate-500 leading-relaxed mb-8">المزامنة مع تقويم آوتلوك وون درايف لربط المواعيد والملفات بسحابة مايكروسوفت الرسمية.</p>
             <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100">ربط الحساب الآن</button>
          </Card>
        </div>
      )}
    </div>
  );
};

const ArrowRightLeft = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>
  </svg>
);
