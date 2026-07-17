import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileEdit, 
  Trash2, 
  BookOpen, 
  Eye, 
  User, 
  Layers,
  Sparkles,
  Search,
  CheckCircle2
} from 'lucide-react';
import { Template, LessonPlan } from '../types.js';

interface TemplatesViewProps {
  onNavigate: (tab: string) => void;
  setLessonPlan: React.Dispatch<React.SetStateAction<LessonPlan>>;
  setIsSettingUp: React.Dispatch<React.SetStateAction<boolean>>;
  isAdmin?: boolean;
}

export default function TemplatesView({ onNavigate, setLessonPlan, setIsSettingUp, isAdmin = false }: TemplatesViewProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewPlan, setPreviewPlan] = useState<LessonPlan | null>(null);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (err) {
      console.error("Error fetching templates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleUseTemplate = (tpl: Template) => {
    setLessonPlan({
      ...tpl.lessonPlan,
      id: `lesson-${Date.now()}` // fresh lesson ID
    });
    setIsSettingUp(false);
    onNavigate('builder');
  };

  const handleDeleteTemplate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Bạn có chắc chắn muốn xóa mẫu giáo án này khỏi hệ thống?")) return;
    
    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchTemplates();
      }
    } catch (err) {
      console.error("Error deleting template:", err);
    }
  };

  const filteredTemplates = templates.filter(tpl => 
    tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tpl.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tpl.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tpl.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center">
            <BookOpen className="mr-3 text-pink-600" size={32} /> Kho Giáo án Mẫu (Templates)
          </h2>
          <p className="text-slate-500 mt-2">Tham khảo, sao chép cấu trúc giáo án tích hợp Năng lực số chuẩn hóa.</p>
        </div>
        <button 
          onClick={() => {
            setLessonPlan({
              id: `lesson-${Date.now()}`,
              title: '',
              subject: '',
              grade: '',
              numberOfPeriods: '1 tiết',
              generalObjectives: '',
              competencies: [],
              materials: '',
              activities: [{ id: Date.now(), name: 'Hoạt động 1: Khởi động', content: '' }]
            });
            setIsSettingUp(true);
            onNavigate('builder');
          }} 
          className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all cursor-pointer shadow-pink-100 flex items-center"
        >
          <FileEdit size={18} className="mr-2" /> Tạo giáo án mới
        </button>
      </div>

      {/* Search and Filters */}
      <div className="relative mb-8">
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm mẫu giáo án theo tên bài, môn học, khối lớp, tác giả..."
          className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-2xl bg-white shadow-sm focus:border-pink-500 outline-none text-slate-700 transition-all font-medium"
        />
        <Search className="absolute left-4 top-4 text-slate-400" size={18} />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 text-slate-400">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          Đang tải kho mẫu giáo án...
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
          <BookOpen size={40} className="mx-auto mb-3 text-slate-300" />
          Không tìm thấy mẫu giáo án nào khớp với từ khóa tìm kiếm.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tpl) => (
            <motion.div 
              key={tpl.id} 
              whileHover={{ y: -4, shadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
              className="bg-white border border-slate-200 rounded-2xl p-6 transition-all cursor-pointer flex flex-col h-full hover:border-pink-300 relative group"
            >
              <div className="flex-1">
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-block bg-pink-50 text-pink-700 text-xs px-2.5 py-1 rounded-full font-bold">
                    Lớp {tpl.grade} • {tpl.subject}
                  </span>
                  {isAdmin && (
                    <button 
                      onClick={(e) => handleDeleteTemplate(tpl.id, e)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Xóa mẫu"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2 leading-snug group-hover:text-pink-700 transition-colors">{tpl.title}</h3>
                
                <div className="flex items-center text-slate-400 text-xs mt-3 gap-1">
                  <User size={14} />
                  <span className="truncate">Tác giả: {tpl.author}</span>
                </div>

                {tpl.lessonPlan.competencies && tpl.lessonPlan.competencies.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Chỉ báo tích hợp</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tpl.lessonPlan.competencies.map((comp, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded" title={comp.desc}>
                          {comp.level}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                 <button 
                   onClick={() => setPreviewPlan(tpl.lessonPlan)}
                   className="text-slate-500 hover:text-pink-600 font-semibold text-sm flex items-center transition-colors cursor-pointer"
                 >
                   <Eye size={14} className="mr-1" /> Xem trước
                 </button>
                 <button 
                   onClick={() => handleUseTemplate(tpl)} 
                   className="flex items-center text-[#D82B71] bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                 >
                   <FileEdit size={14} className="mr-1.5" /> Dùng mẫu
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center">
                <Sparkles size={20} className="mr-2 text-pink-600" /> Xem trước Kế hoạch bài dạy
              </h3>
              <button 
                onClick={() => setPreviewPlan(null)} 
                className="text-slate-400 hover:text-red-500 transition-colors font-bold text-lg px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-1 space-y-6">
              <div className="text-center">
                <span className="text-xs font-bold text-pink-600 bg-pink-100 px-2.5 py-1 rounded-full uppercase">Lớp {previewPlan.grade} • {previewPlan.subject}</span>
                <h4 className="text-2xl font-bold mt-2 uppercase text-slate-900">{previewPlan.title}</h4>
                <p className="text-sm text-slate-400 mt-1">Thời lượng: {previewPlan.numberOfPeriods || previewPlan.duration || '1 tiết'}</p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h5 className="font-bold text-slate-800 mb-2">I. Mục tiêu bài học</h5>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{previewPlan.generalObjectives}</p>
              </div>

              {previewPlan.competencies && previewPlan.competencies.length > 0 && (
                <div className="pt-2">
                  <h6 className="font-semibold text-sm text-slate-700 mb-2">Mục tiêu Năng lực số tích hợp:</h6>
                  <ul className="space-y-2">
                    {previewPlan.competencies.map((comp, idx) => (
                      <li key={idx} className="bg-pink-50/50 border border-pink-100 rounded-xl p-3 flex items-start gap-3">
                        <span className="bg-[#D82B71] text-white text-xs font-mono font-bold px-2 py-0.5 rounded mt-0.5">{comp.level}</span>
                        <div className="text-xs">
                          <p className="font-bold text-slate-700">{comp.componentTitle}</p>
                          <p className="text-slate-600 mt-0.5 leading-relaxed">{comp.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t border-slate-100 pt-4">
                <h5 className="font-bold text-slate-800 mb-2">II. Thiết bị dạy học và học liệu</h5>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{previewPlan.materials}</p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h5 className="font-bold text-slate-800 mb-3">III. Tiến trình dạy học</h5>
                <div className="space-y-4">
                  {previewPlan.activities.map((act, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                      <p className="font-bold text-slate-800 text-sm">{act.name}</p>
                      <p className="text-slate-600 text-xs mt-2 whitespace-pre-wrap leading-relaxed">{act.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setPreviewPlan(null)} 
                className="px-5 py-2.5 text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl font-bold transition-colors cursor-pointer"
              >
                Đóng lại
              </button>
              <button 
                onClick={() => {
                  const p = previewPlan;
                  setPreviewPlan(null);
                  handleUseTemplate({ id: `tpl-use-${Date.now()}`, title: p.title, subject: p.subject, grade: p.grade, author: "Mẫu hệ thống", lessonPlan: p });
                }} 
                className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-pink-100 cursor-pointer"
              >
                Sử dụng mẫu này
              </button>
            </div>
          </div>
        </div>
      )}

    </motion.div>
  );
}
