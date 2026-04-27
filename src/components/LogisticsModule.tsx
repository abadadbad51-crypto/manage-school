import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Truck, 
  MapPin, 
  Users, 
  Phone, 
  ShieldCheck, 
  Plus, 
  Search,
  Bell,
  Clock,
  ArrowRightLeft,
  Navigation,
  Smartphone
} from 'lucide-react';
import { Card } from './ui/Card';
import { cn } from '../lib/utils';

interface LogisticsModuleProps {
  initialTab?: 'buses' | 'subscriptions' | 'tracking';
  onTabChange?: (tab: 'buses' | 'subscriptions' | 'tracking') => void;
}

export const LogisticsModule: React.FC<LogisticsModuleProps> = ({ initialTab = 'buses', onTabChange }) => {
  const [activeSubTab, setActiveSubTab] = useState<'buses' | 'subscriptions' | 'tracking'>(initialTab);

  React.useEffect(() => {
    setActiveSubTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (tab: 'buses' | 'subscriptions' | 'tracking') => {
    setActiveSubTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
          <Truck className="text-orange-600" size={32} />
          إدارة الحافلات والخدمات
        </h2>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl overflow-x-auto scrollbar-hide max-w-full">
          <div className="flex min-w-max">
            {[
              { id: 'buses', label: 'الحافلات', icon: Truck },
              { id: 'subscriptions', label: 'المشتركون', icon: Users },
              { id: 'tracking', label: 'التتبع المباشر', icon: MapPin }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap",
                  activeSubTab === tab.id 
                    ? "bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                <tab.icon size={16} className="md:size-[18px]" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeSubTab === 'buses' && <BusesSection />}
      {activeSubTab === 'subscriptions' && <SubscriptionsSection />}
      {activeSubTab === 'tracking' && <TrackingSection />}
    </div>
  );
};

const BusesSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'حافلة شمال الرياض', driver: 'أحمد صالح', phone: '0501234567', supervisor: 'منيرة ناصر', capacity: 30, students: 28 },
          { name: 'حافلة شرق الرياض', driver: 'محمد العتيبي', phone: '0507654321', supervisor: 'سارة محمد', capacity: 30, students: 15 },
          { name: 'حافلة حي النرجس', driver: 'خالد العمري', phone: '0551212121', supervisor: 'هند علي', capacity: 25, students: 22 }
        ].map((bus, i) => (
          <Card key={i} className="group hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl">
                  <Truck size={24} />
                </div>
                <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-full uppercase tracking-wider">نشط الآن</span>
              </div>
              
              <h4 className="text-xl font-black text-slate-800 dark:text-white mb-4">{bus.name}</h4>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Navigation size={16} className="text-slate-400" />
                  <span className="text-slate-500">السائق:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{bus.driver}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <ShieldCheck size={16} className="text-slate-400" />
                  <span className="text-slate-500">المشرفة:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{bus.supervisor}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-slate-400" />
                  <span className="text-slate-500">رقم التواصل:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{bus.phone}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-500">سعة الركوب</span>
                  <span className="text-slate-800 dark:text-white">{bus.students}/{bus.capacity} طالباً</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(bus.students / bus.capacity) * 100}%` }}
                    className={cn(
                      "h-full rounded-full transition-all",
                      (bus.students / bus.capacity) > 0.9 ? "bg-rose-500" : "bg-orange-500"
                    )}
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-800/30 flex gap-2">
              <button className="flex-1 text-xs font-bold text-blue-600 hover:underline">تعديل المسار</button>
              <button className="flex-1 text-xs font-bold text-orange-600 hover:underline">تتبع الآن</button>
            </div>
          </Card>
        ))}
        
        <button className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all group min-h-[300px]">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 transition-all">
            <Plus size={32} />
          </div>
          <span className="font-bold">إضافة حافلة جديدة</span>
        </button>
      </div>
    </div>
  );
};

const SubscriptionsSection = () => {
  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h4 className="font-black text-slate-800 dark:text-white">الطلاب المشتركين في النقل</h4>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="البحث عن طالب..."
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 pr-10 pl-4 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
            />
          </div>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-orange-100 dark:shadow-none">
            إضافة مشترك
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto hidden sm:block">
        <table className="w-full text-right">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
            <tr>
              <th className="px-6 py-4">الطالب</th>
              <th className="px-6 py-4">الحافلة</th>
              <th className="px-6 py-4">نقطة التوقف</th>
              <th className="px-6 py-4">الحالة</th>
              <th className="px-6 py-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">ط</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">طالب مشترك {i}</p>
                      <p className="text-[10px] text-slate-400">#STD-00{i}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">حافلة شمال الرياض</span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">شارع التخصصي - تقاطع الملك فهد</td>
                <td className="px-6 py-4">
                  <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">مشترك نشط</span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-slate-400 hover:text-rose-600 transition-colors">
                    <ArrowRightLeft size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-600 dark:text-slate-400">ط</div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">طالب مشترك {i}</p>
                  <p className="text-[10px] text-slate-400">#STD-00{i}</p>
                </div>
              </div>
              <button className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <ArrowRightLeft size={18} />
              </button>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">الحافلة:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">حافلة شمال الرياض</span>
              </div>
              <div className="flex justify-between items-start text-xs gap-4">
                <span className="text-slate-400 whitespace-nowrap">التوقف:</span>
                <span className="text-slate-500 dark:text-slate-400 text-left">شارع التخصصي - تقاطع الملك فهد</span>
              </div>
            </div>
            
            <div className="flex justify-start">
               <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800/20">مشترك نشط</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const TrackingSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:h-[600px]">
      <Card className="lg:col-span-3 p-0 relative overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center border-none h-[300px] md:h-[400px] lg:h-auto">
        {/* Placeholder for real map integration */}
        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/46.6753,24.7136,12,0/800x600?access_token=none')] bg-cover bg-center opacity-50"></div>
        <div className="relative text-center p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/50">
          <MapPin size={48} className="text-orange-600 mx-auto mb-4 animate-bounce" />
          <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">خارطة التتبع المباشر</h4>
          <p className="text-slate-500 mb-6 text-sm">سيتم الربط مع خدمة خرائط جوجل أو Mapbox لعرض مواقع الحافلات لحظياً.</p>
          <div className="flex gap-2 justify-center">
            <span className="bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold">3 حافلات نشطة</span>
            <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white px-4 py-2 rounded-xl text-xs font-bold">آخر تحديث: الآن</span>
          </div>
        </div>
      </Card>
      
      <div className="space-y-4 overflow-y-auto">
        <h4 className="font-bold text-slate-800 dark:text-white mb-2">الحافلات النشطة الآن</h4>
        {[
          { id: '1', name: 'حافلة شمال الرياض', status: 'في الطريق', arrival: '10 دقائق', pos: 'حي الملقا' },
          { id: '2', name: 'حافلة شرق الرياض', status: 'توقف مؤقت', arrival: '25 دقيقة', pos: 'حي الروابي' },
          { id: '3', name: 'حافلة حي النرجس', status: 'في الطريق', arrival: '5 دقائق', pos: 'طريق الملك عبدالعزيز' }
        ].map((bus) => (
          <motion.div 
            key={bus.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-white">{bus.name}</span>
              <span className={cn(
                "text-[8px] font-black uppercase px-2 py-0.5 rounded-full",
                bus.status === 'في الطريق' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              )}>
                {bus.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <Clock size={12} />
              <span>الوصول المتوقع: {bus.arrival}</span>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs text-blue-600 font-bold">
                <MapPin size={14} />
                <span>{bus.pos}</span>
              </div>
              <button className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 hover:text-orange-600 transition-colors">
                <Bell size={14} />
              </button>
            </div>
          </motion.div>
        ))}
        
        <Card className="p-4 bg-orange-600 text-white border-none">
          <div className="flex items-center gap-3 mb-2">
            <Smartphone size={20} />
            <h5 className="font-bold text-sm">تطبيق أولياء الأمور</h5>
          </div>
          <p className="text-[10px] text-white/80 leading-relaxed">
            يصل تنبيه لولي الأمر تلقائياً عند اقتراب الحافلة من نقطة التوقف بمسافة 500 متر.
          </p>
        </Card>
      </div>
    </div>
  );
};
