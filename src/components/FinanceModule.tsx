import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Wallet, 
  CreditCard as PaymentIcon, 
  FileCheck,
  History, 
  TrendingDown, 
  TrendingUp, 
  Plus, 
  Box, 
  ShoppingBag, 
  FileText,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card } from './ui/Card';
import { InventoryItem, Transaction, Installment } from '../types';
import { cn } from '../lib/utils';

interface FinanceModuleProps {
  initialTab?: 'accounting' | 'inventory' | 'transactions';
  onTabChange?: (tab: 'accounting' | 'inventory' | 'transactions') => void;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({ initialTab = 'accounting', onTabChange }) => {
  const [activeSubTab, setActiveSubTab] = useState<'accounting' | 'inventory' | 'transactions'>(initialTab);

  React.useEffect(() => {
    setActiveSubTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (tab: 'accounting' | 'inventory' | 'transactions') => {
    setActiveSubTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
          <Wallet className="text-blue-600" size={32} />
          النظام المالي والمحاسبي
        </h2>
        
        <div className="flex bg-slate-100 dark:bg-[#202022] p-1 rounded-2xl overflow-x-auto scrollbar-hide max-w-full">
          <div className="flex min-w-max">
            {[
              { id: 'accounting', label: 'الأقساط', icon: PaymentIcon },
              { id: 'inventory', label: 'المخزن والمبيعات', icon: Box },
              { id: 'transactions', label: 'السجل المالي', icon: History }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap",
                  activeSubTab === tab.id 
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" 
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

      {activeSubTab === 'accounting' && <AccountingSection />}
      {activeSubTab === 'inventory' && <InventorySection />}
      {activeSubTab === 'transactions' && <TransactionsSection />}
    </div>
  );
};

const AccountingSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/20 rounded-2xl">
                <TrendingUp size={24} />
              </div>
              <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider">هذا الشهر</span>
            </div>
            <p className="text-white/80 text-sm font-bold">إجمالي المحصل</p>
            <h3 className="text-3xl font-black mt-1">45,200 ر.س</h3>
            <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
              <span className="text-emerald-400 font-bold">+12%</span>
              <span>مقارنة بالشهر الماضي</span>
            </div>
          </Card>
          
          <Card className="p-6 bg-white dark:bg-[#141415] border-slate-100 dark:border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 rounded-2xl">
                <AlertCircle size={24} />
              </div>
              <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-full uppercase tracking-wider">متأخر</span>
            </div>
            <p className="text-slate-500 dark:text-zinc-400 text-sm font-bold">أقساط متأخرة</p>
            <h3 className="text-3xl font-black mt-1 text-slate-800 dark:text-white">12,500 ر.س</h3>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <span>8 طلاب لم يسددوا بعد</span>
            </div>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
            <h4 className="font-black text-slate-800 dark:text-white">الأقساط القادمة</h4>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-1 hover:underline">
              <Plus size={16} />
              إضافة قسط جديد
            </button>
          </div>
          <div className="overflow-x-auto hidden sm:block">
            <table className="w-full text-right">
              <thead className="bg-slate-50 dark:bg-[#202022] text-slate-400 dark:text-zinc-500 text-[10px] uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">الطالب</th>
                  <th className="px-6 py-4">المبلغ</th>
                  <th className="px-6 py-4">تاريخ الاستحقاق</th>
                  <th className="px-6 py-4">الحالة</th>
                  <th className="px-6 py-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-zinc-400">
                          {i === 1 ? 'أ' : i === 2 ? 'م' : 'س'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white">طالب تجريبي {i}</p>
                          <p className="text-[10px] text-slate-500">الصف العاشر - أ</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700 dark:text-zinc-300">1,500 ر.س</td>
                    <td className="px-6 py-4 text-xs text-slate-500">2026-05-{10+i}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center gap-1 w-fit">
                        <Clock size={12} />
                        قيد الانتظار
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#202022] flex items-center justify-center font-bold text-sm text-slate-600 dark:text-zinc-400">
                      {i === 1 ? 'أ' : i === 2 ? 'م' : 'س'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white text-sm">طالب تجريبي {i}</p>
                      <p className="text-[10px] text-slate-500">الصف العاشر - أ</p>
                    </div>
                  </div>
                  <button className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                    <Download size={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">المبلغ</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">1,500 ر.س</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">تاريخ الاستحقاق</p>
                    <p className="text-xs text-slate-600 dark:text-zinc-300">2026-05-{10+i}</p>
                  </div>
                  <span className="px-2 py-1 rounded-lg text-[9px] font-black bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Clock size={10} />
                    قيد الانتظار
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h4 className="font-bold text-slate-800 dark:text-white mb-4">إرسال تنبيهات جماعية</h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mb-6 leading-relaxed">
            يمكنك إرسال تنبيهات آلية لجميع أولياء الأمور الذين لديهم أقساط مستحقة خلال الأسبوع القادم.
          </p>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2">
              <Download size={18} />
              إرسال عبر واتساب
            </button>
            <button className="w-full bg-slate-100 dark:bg-[#202022] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              <FileCheck size={18} />
              إرسال إشعار للنظام
            </button>
          </div>
        </Card>
        
        <Card className="p-6 bg-slate-50 dark:bg-[#202022]/50 border-dashed border-2 border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 rounded-lg">
              <PaymentIcon size={20} />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white">بوابة الدفع</h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">تكامل مع Stripe و Fawry مفعل</p>
          <button className="text-xs font-bold text-blue-600 hover:underline">إعدادات الدفع الإلكتروني ←</button>
        </Card>
      </div>
    </div>
  );
};

const InventorySection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h5 className="text-slate-400 text-xs font-bold uppercase tracking-wider">مبيعات اليوم</h5>
              <p className="text-2xl font-black text-slate-800 dark:text-white">3,450 ر.س</p>
            </div>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-[#202022] rounded-full">
            <div className="h-full w-2/3 bg-indigo-500 rounded-full shadow-sm shadow-indigo-200"></div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-2xl">
              <Box size={24} />
            </div>
            <div>
              <h5 className="text-slate-400 text-xs font-bold uppercase tracking-wider">الأصناف المتوفرة</h5>
              <p className="text-2xl font-black text-slate-800 dark:text-white">124 صنف</p>
            </div>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-[#202022] rounded-full">
            <div className="h-full w-full bg-amber-500 rounded-full shadow-sm shadow-amber-200"></div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <TrendingDown size={24} />
            </div>
            <div>
              <h5 className="text-slate-400 text-xs font-bold uppercase tracking-wider">نقص في المخزون</h5>
              <p className="text-2xl font-black text-slate-800 dark:text-white">5 أصناف</p>
            </div>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-[#202022] rounded-full">
            <div className="h-full w-1/4 bg-rose-500 rounded-full shadow-sm shadow-rose-200"></div>
          </div>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="البحث عن كتاب، زي مدرسي، أو أداة..."
            className="w-full bg-white dark:bg-[#141415] border border-slate-200 dark:border-white/5 rounded-2xl py-3 pr-12 pl-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <button className="bg-slate-800 dark:bg-slate-700 text-white px-6 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-900 transition-colors">
          <Plus size={20} />
          إضافة صنف
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: 'كتاب العلوم - الصف 10', price: 120, stock: 45, type: 'كتاب' },
          { name: 'زي مدرسي صيفي - M', price: 250, stock: 12, type: 'زي مدرسي' },
          { name: 'مجموعة أدوات هندسية', price: 45, stock: 0, type: 'أدوات' },
          { name: 'كتاب الرياضيات - الصف 10', price: 140, stock: 89, type: 'كتاب' }
        ].map((item, i) => (
          <Card key={i} className="group hover:shadow-xl transition-all duration-300 border-slate-100 dark:border-white/5">
            <div className="aspect-square bg-slate-50 dark:bg-[#202022] flex items-center justify-center p-8 transition-colors">
              <Box className="text-slate-200 dark:text-slate-700 group-hover:scale-110 transition-transform duration-500" size={64} />
            </div>
            <div className="p-4">
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded uppercase">{item.type}</span>
              <h5 className="font-bold text-slate-800 dark:text-white mt-2 line-clamp-1">{item.name}</h5>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-lg font-black text-slate-900 dark:text-white">{item.price} ر.س</p>
                <span className={cn(
                  "text-[10px] font-bold p-1 rounded",
                  item.stock > 0 ? "text-emerald-600" : "text-rose-600 bg-rose-50 dark:bg-rose-500/10"
                )}>
                  {item.stock > 0 ? `${item.stock} في المخزن` : 'نفذ الكمية'}
                </span>
              </div>
              <button className="w-full mt-4 bg-slate-50 dark:bg-[#202022] hover:bg-blue-600 hover:text-white text-slate-600 dark:text-zinc-400 py-2 rounded-xl text-xs font-bold transition-all">
                بيع الآن (فاتورة إلكترونية)
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const TransactionsSection = () => {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-[#202022]/30">
        <h4 className="font-black text-slate-800 dark:text-white">سجل العمليات المالية</h4>
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-white dark:bg-[#202022] rounded-lg shadow-sm">
            <Filter size={18} />
          </button>
          <button className="bg-white dark:bg-[#202022] text-slate-700 dark:text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-slate-50 transition-colors border border-slate-100 dark:border-white/10">
            <Download size={16} />
            تصدير تقرير ضريبي
          </button>
        </div>
      </div>
      <div className="overflow-x-auto hidden sm:block">
        <table className="w-full text-right">
          <thead className="bg-slate-50 dark:bg-[#202022] text-slate-400 text-[10px] uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">الرقم المرجعي</th>
              <th className="px-6 py-4">البيان</th>
              <th className="px-6 py-4">المبلغ</th>
              <th className="px-6 py-4">طريقة الدفع</th>
              <th className="px-6 py-4">التاريخ</th>
              <th className="px-6 py-4">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-slate-400">#INV-2026-00{i}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{i % 2 === 0 ? 'سداد قسط دراسي' : 'شراء زي مدرسي'}</p>
                  <p className="text-[10px] text-slate-400">بواسطة: ولي أمر الطالب أ</p>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{i * 450} ر.س</td>
                <td className="px-6 py-4 text-xs text-slate-500">بطاقة مدى</td>
                <td className="px-6 py-4 text-xs text-slate-400">2026-04-12 10:30</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600">
                    <CheckCircle2 size={12} />
                    تم الدفع
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-slate-800 dark:text-white">{i % 2 === 0 ? 'سداد قسط دراسي' : 'شراء زي مدرسي'}</p>
                <p className="text-[10px] text-slate-500 font-medium">بواسطة: ولي أمر الطالب أ</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 size={10} />
                تم الدفع
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 font-bold">
              <div>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-0.5">المبلغ</p>
                <p className="text-sm text-slate-900 dark:text-white">{i * 450} ر.س</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-0.5">التاريخ</p>
                <p className="text-xs text-slate-500 dark:text-zinc-400">04-12 10:30</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] bg-slate-50 dark:bg-[#202022]/50 p-2 rounded-lg text-slate-400">
               <span>#INV-2026-00{i}</span>
               <span>بطاقة مدى</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
