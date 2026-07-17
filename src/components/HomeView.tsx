import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  PlusCircle, 
  Search, 
  Sparkles, 
  Wand2, 
  Download 
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center mt-12 mb-20 px-4"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 flex items-center shadow-sm"
      >
        <CheckCircle2 size={16} className="mr-2" /> Nền tảng chuẩn hóa năng lực số đầu tiên theo GDPT 2018
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight max-w-3xl"
      >
        Số hóa bài giảng, <br/> Nâng tầm <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">năng lực học sinh</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-lg text-slate-600 mb-10 max-w-2xl leading-relaxed"
      >
        Hệ thống giúp giáo viên tra cứu bảng mã chỉ báo, nhúng trực tiếp vào giáo án và xuất bản tài liệu chuyên nghiệp chỉ trong vài phút sử dụng AI. Đảm bảo giữ nguyên 100% bản sắc sư phạm gốc của bạn.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto"
      >
        <button 
          onClick={() => onNavigate('builder')} 
          className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg shadow-pink-200 hover:shadow-xl transition-all flex items-center justify-center text-lg transform hover:-translate-y-0.5 cursor-pointer"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Tạo giáo án mới ngay
        </button>
        <button 
          onClick={() => onNavigate('lookup')} 
          className="px-8 py-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-bold transition-all flex items-center justify-center text-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Search className="mr-2 h-5 w-5" /> Tra cứu chỉ báo
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left w-full"
      >
        <FeatureCard 
          icon={<Sparkles className="text-indigo-500" size={28}/>} 
          title="Giữ nguyên 100% bản gốc" 
          desc="AI tôn trọng ý đồ sư phạm. Không thêm bớt vô lý, không cắt xén, không làm đảo lộn trình tự hoạt động của Kế hoạch bài dạy (KHBD) tải lên." 
        />
        <FeatureCard 
          icon={<Wand2 className="text-emerald-500" size={28}/>} 
          title="Tự động hóa phân tích NLS" 
          desc="Hệ thống hiểu sâu ngữ cảnh sư phạm để tự động chọn và nhúng chính xác các chỉ báo Năng lực số GDPT 2018 logic nhất vào từng hoạt động." 
        />
        <FeatureCard 
          icon={<Download className="text-orange-500" size={28}/>} 
          title="Xuất đa dạng định dạng" 
          desc="Hỗ trợ in ấn trực quan, xuất tệp PDF đẹp mắt hoặc xuất trực tiếp ra file Word (.doc/.docx) đúng chuẩn quy định của Bộ Giáo dục." 
        />
      </motion.div>
    </motion.div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all duration-300"
    >
      <div className="mb-4 bg-slate-50 w-14 h-14 rounded-xl flex items-center justify-center shadow-inner">{icon}</div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
    </motion.div>
  );
}
