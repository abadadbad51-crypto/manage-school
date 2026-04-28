import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MessageCircle, 
  UserPlus, 
  Smartphone, 
  Plus, 
  Search,
  PhoneCall,
  History,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Download,
  Info,
  Calendar,
  Layers,
  Send
} from 'lucide-react';
import { Card } from './ui/Card';
import { cn } from '../lib/utils';

interface CommunicationModuleProps {
  initialTab?: 'applicants' | 'crm' | 'whatsapp';
  onTabChange?: (tab: 'applicants' | 'crm' | 'whatsapp') => void;
}

export const CommunicationModule: React.FC<CommunicationModuleProps> = ({ initialTab = 'applicants', onTabChange }) => {
  const [activeSubTab, setActiveSubTab] = useState<'applicants' | 'crm' | 'whatsapp'>(initialTab);

  React.useEffect(() => {
    setActiveSubTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (tab: 'applicants' | 'crm' | 'whatsapp') => {
    setActiveSubTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
          <MessageCircle className="text-emerald-600" size={32} />
          التواصل والقبول (CRM)
        </h2>
        
        <div className="flex bg-slate-100 dark:bg-[#202022] p-1 rounded-2xl overflow-x-auto scrollbar-hide max-w-full">
          <div className="flex min-w-max">
            {[
              { id: 'applicants', label: 'طلبات الالتحاق', icon: UserPlus },
              { id: 'crm', label: 'إدارة علاقات العملاء', icon: Layers },
              { id: 'whatsapp', label: 'تواصل واتساب', icon: Smartphone }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap",
                  activeSubTab === tab.id 
                    ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" 
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

      {activeSubTab === 'applicants' && <ApplicantPortalSection />}
      {activeSubTab === 'crm' && <CRMSection />}
      {activeSubTab === 'whatsapp' && <WhatsAppIntegrationSection />}
    </div>
  );
};

const ApplicantPortalSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-emerald-600 text-white border-none shadow-xl shadow-emerald-200">
           <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-white/20 rounded-2xl">
               <UserPlus size={24} />
             </div>
             <button className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all">
               <ExternalLink size={16} />
             </button>
           </div>
           <h4 className="text-xl font-black mb-1">رابط التقديم الخارجي</h4>
           <p className="text-white/80 text-xs mb-6">رابط مباشر لأولياء الأمور للتقديم الذاتي</p>
           <code className="block bg-black/20 p-3 rounded-xl text-[10px] font-mono break-all mb-4">
             https://school-portal.app/apply/demo-school
           </code>
           <button className="w-full bg-white text-emerald-600 font-bold py-3 rounded-xl shadow-lg">نسخ رابط التقديم</button>
        </Card>

        <Card className="p-6">
           <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-slate-100 dark:bg-[#202022] text-slate-500 rounded-2xl">
               <FileText size={24} />
             </div>
             <div>
               <h5 className="text-slate-400 text-xs font-bold uppercase tracking-wider">طلبات جديدة اليوم</h5>
               <p className="text-2xl font-black text-slate-800 dark:text-white">12 طلب</p>
             </div>
           </div>
           <div className="flex gap-1">
             {[1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 6 ? 'bg-emerald-500' : 'bg-slate-100 dark:bg-[#202022]'}`}></div>)}
           </div>
        </Card>

        <Card className="p-6">
           <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-2xl">
               <Clock size={24} />
             </div>
             <div>
               <h5 className="text-slate-400 text-xs font-bold uppercase tracking-wider">في انتظار المراجعة</h5>
               <p className="text-2xl font-black text-slate-800 dark:text-white">45 طلب</p>
             </div>
           </div>
           <button className="text-xs font-bold text-amber-600 hover:underline">عرض المجلد المعلق ←</button>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-[#202022]/30">
          <h4 className="font-black text-slate-800 dark:text-white">قائمة المتقدمين الجدد</h4>
          <select className="bg-white dark:bg-[#202022] border-slate-200 dark:border-white/10 text-xs font-bold px-4 py-2 rounded-xl">
            <option>كل الحالات</option>
            <option>بانتظار المستندات</option>
            <option>جاهز للمقابلة</option>
          </select>
        </div>
        <div className="overflow-x-auto hidden sm:block">
          <table className="w-full text-right">
            <thead className="bg-slate-50 dark:bg-[#202022] text-slate-400 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">اسم الطالب</th>
                <th className="px-6 py-4">الصف المستهدف</th>
                <th className="px-6 py-4">تاريخ التقديم</th>
                <th className="px-6 py-4">المستندات</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {[1, 2, 3, 4].map(i => (
                <tr key={i} className="hover:bg-indigo-50/10 dark:hover:bg-emerald-900/10 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">طالب متقدم {i}</p>
                    <p className="text-[10px] text-slate-400">ولي الأمر: محمد علي</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-zinc-400">الصف الأول الابتدائي</td>
                  <td className="px-6 py-4 text-[10px] text-slate-400">2026-04-10</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <div className="p-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg"><CheckCircle2 size={12} /></div>
                      <div className="p-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg"><CheckCircle2 size={12} /></div>
                      <div className="p-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 rounded-lg"><Info size={12} /></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full">مراجعة البيانات</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                      <Send size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-sm">طالب متقدم {i}</p>
                  <p className="text-[10px] text-slate-500">ولي الأمر: محمد علي</p>
                </div>
                <button className="p-2.5 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                  <Send size={18} />
                </button>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold tracking-wider mb-0.5 uppercase">الصف المستهدف</p>
                  <p className="text-xs text-slate-700 dark:text-zinc-300">الأول الابتدائي</p>
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-bold tracking-wider mb-0.5 uppercase text-right">الحالة</p>
                  <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-black px-2 py-0.5 rounded-full">مراجعة البيانات</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-white/5">
                <span className="text-[10px] text-slate-400">2026-04-10</span>
                <div className="flex gap-2">
                  <div className="flex gap-1.5 p-1 bg-slate-50 dark:bg-[#202022] rounded-lg border border-slate-100 dark:border-white/10">
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    <Info size={12} className="text-rose-500" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const CRMSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="البحث في سجل المحادثات..." className="w-full bg-white dark:bg-[#141415] border border-slate-200 dark:border-white/5 rounded-2xl py-3 pr-12 pl-4 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" />
          </div>
          <button className="bg-emerald-600 text-white px-6 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100">
            <PhoneCall size={18} />
            إضافة استفسار
          </button>
        </div>

        <Card className="overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
            <h4 className="font-black text-slate-800 dark:text-white">سجل المتابعة (Leads Tracking)</h4>
            <div className="flex bg-slate-100 p-1 rounded-xl text-[10px] font-bold">
              <button className="bg-white px-3 py-1 rounded-lg text-emerald-600 shadow-sm">الكل</button>
              <button className="px-3 py-1 rounded-lg text-slate-500">مكالمات</button>
              <button className="px-3 py-1 rounded-lg text-slate-500">زيارات</button>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-6 relative group">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold relative z-10">
                    <PhoneCall size={20} />
                  </div>
                  {i < 3 && <div className="w-0.5 flex-1 bg-slate-100 dark:bg-[#202022] my-2"></div>}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-bold text-slate-800 dark:text-white">استفسار هاتفي - م. فهد</h5>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">قبل ساعتين</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed bg-slate-50 dark:bg-[#202022]/50 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                    استفسر ولي الأمر عن توفر مقعد في الصف العاشر وموعد اختبار القبول. تم إرسال رابط التقديم وسيتم المتابعة غداً.
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">مهتم جداً</span>
                    <button className="text-[10px] text-blue-600 font-bold hover:underline">إضافة ملاحظة</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h4 className="font-bold text-slate-800 dark:text-white mb-6">مخطط التحويل الدراسي</h4>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2">
                <span>زائر (Visitor)</span>
                <span>450 شحص</span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-[#202022] rounded-full overflow-hidden">
                <div className="h-full w-full bg-slate-300"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2">
                <span>مهتم (Inquiry)</span>
                <span>120 شحص</span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-[#202022] rounded-full overflow-hidden">
                <div className="h-full w-[60%] bg-blue-400"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2">
                <span>متقدم (Applied)</span>
                <span>54 شحص</span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-[#202022] rounded-full overflow-hidden">
                <div className="h-full w-[40%] bg-indigo-500"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2">
                <span>مسجل (Enrolled)</span>
                <span>28 شحص</span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-[#202022] rounded-full overflow-hidden">
                <div className="h-full w-[25%] bg-emerald-500"></div>
              </div>
            </div>
          </div>
          <p className="mt-8 text-[10px] text-center text-slate-400">معدل التحويل الكلي: <span className="font-bold text-slate-800 dark:text-white">6.2%</span></p>
        </Card>

        <Card className="p-6 bg-slate-900 border-none shadow-2xl relative overflow-hidden">
          <div className="absolute left-0 bottom-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <div className="relative">
            <h5 className="text-white font-black mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-emerald-500" />
              المواعيد القادمة
            </h5>
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                  <p className="text-xs font-bold text-white mb-1">مقابلة عائلة فهد الراجحي</p>
                  <p className="text-[10px] text-slate-400">غداً - 11:00 AM</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const WhatsAppIntegrationSection = () => {
  return (
    <Card className="p-8 border-none bg-emerald-50/50 dark:bg-emerald-900/10 shadow-sm items-center text-center">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="w-20 h-20 bg-emerald-600 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-emerald-200">
          <Smartphone size={40} />
        </div>
        <h3 className="text-2xl font-black text-slate-800 dark:text-white">بوابة تواصل واتساب الذكية</h3>
        <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
          اربط نظامك مباشرة مع حساب واتساب الرسمي للمدرسة (WhatsApp Business API) لإرسال الإشعارات، النتائج، وتنبيهات الغياب بنقرة واحدة.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-right">
          <div className="p-4 bg-white dark:bg-[#141415] rounded-2xl border border-emerald-100 dark:border-emerald-500/20/40">
             <h6 className="font-bold text-emerald-600 text-xs mb-2">تنبيهات الغياب</h6>
             <p className="text-[10px] text-slate-400">إرسال رسالة آلية لولي الأمر فور رصد غياب الطالب في الطابور الصباحي.</p>
          </div>
          <div className="p-4 bg-white dark:bg-[#141415] rounded-2xl border border-emerald-100 dark:border-emerald-500/20/40">
             <h6 className="font-bold text-emerald-600 text-xs mb-2">تقارير الدرجات</h6>
             <p className="text-[10px] text-slate-400">إرسال رابط الشهادة الرقمية مباشرة إلى هاتف ولي الأمر فور اعتمادها.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 pt-4">
          <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3">
             <Smartphone size={20} />
             ربط حساب واتساب الآن
          </button>
          <button className="flex-1 bg-white dark:bg-[#202022] text-slate-700 dark:text-white border border-slate-200 dark:border-white/10 font-bold py-4 rounded-2xl transition-all">
             عرض سجل المراسلات
          </button>
        </div>
      </div>
    </Card>
  );
};
