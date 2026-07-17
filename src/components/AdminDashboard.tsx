import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  BookOpen, 
  FileText, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  FolderOpen,
  Award,
  LogOut,
  Save
} from 'lucide-react';
import { Template, LessonPlan } from '../types.js';

interface AdminDashboardProps {
  onLogout: () => void;
  setLessonPlan: React.Dispatch<React.SetStateAction<LessonPlan>>;
  setIsSettingUp: React.Dispatch<React.SetStateAction<boolean>>;
  onNavigate: (tab: string) => void;
}

export default function AdminDashboard({ onLogout, setLessonPlan, setIsSettingUp, onNavigate }: AdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'templates' | 'lessons'>('templates');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [lessons, setLessons] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form for creating a new template
  const [newTemplateForm, setNewTemplateForm] = useState({
    title: '',
    subject: 'Tin học',
    grade: '6',
    author: 'Quản trị viên',
    lessonNumber: 'Bài 1',
    generalObjectives: '',
    materials: '',
    activitiesText: '' // simple format: Activity name | content, separated by double newline
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const tRes = await fetch('/api/templates');
      if (tRes.ok) {
        const tData = await tRes.json();
        setTemplates(tData);
      }
      
      const lRes = await fetch('/api/lessons');
      if (lRes.ok) {
        const lData = await lRes.json();
        setLessons(lData);
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      // Parse activitiesText to structured activities array
      const rawActivities = newTemplateForm.activitiesText.split('\n\n').filter(Boolean);
      const activities = rawActivities.map((actText, idx) => {
        const parts = actText.split('|');
        const name = parts[0]?.trim() || `Hoạt động ${idx + 1}`;
        const content = parts[1]?.trim() || '';
        return {
          id: Date.now() + idx,
          name,
          content
        };
      });

      const structuredPlan: LessonPlan = {
        id: `tpl-plan-${Date.now()}`,
        lessonNumber: newTemplateForm.lessonNumber,
        title: newTemplateForm.title,
        subject: newTemplateForm.subject,
        grade: newTemplateForm.grade,
        numberOfPeriods: "1 tiết",
        generalObjectives: newTemplateForm.generalObjectives,
        materials: newTemplateForm.materials,
        activities: activities.length > 0 ? activities : [{ id: Date.now(), name: 'Hoạt động 1', content: 'Mô tả...' }],
        competencies: [] // Admin can map it later or use default matching
      };

      const payload: Template = {
        id: `tpl-${Date.now()}`,
        title: newTemplateForm.title,
        subject: newTemplateForm.subject,
        grade: newTemplateForm.grade,
        author: newTemplateForm.author,
        lessonPlan: structuredPlan
      };

      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSuccessMsg("Đã tạo và thêm mẫu giáo án vào kho lưu trữ thành công!");
        setNewTemplateForm({
          title: '',
          subject: 'Tin học',
          grade: '6',
          author: 'Quản trị viên',
          lessonNumber: 'Bài 1',
          generalObjectives: '',
          materials: '',
          activitiesText: ''
        });
        fetchData();
      } else {
        setErrorMsg("Lỗi khi gửi mẫu giáo án mới!");
      }
    } catch (err) {
      setErrorMsg("Không thể lưu mẫu giáo án mới!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Xác nhận xóa mẫu này?")) return;
    try {
      const res = await fetch(`/api/templates/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMsg("Đã xóa mẫu giáo án.");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm("Xác nhận xóa giáo án này khỏi dữ liệu giáo viên?")) return;
    try {
      const res = await fetch(`/api/lessons/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMsg("Đã xóa giáo án thành công.");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoadLessonIntoEditor = (plan: LessonPlan) => {
    setLessonPlan(plan);
    setIsSettingUp(false);
    onNavigate('builder');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-6xl mx-auto pb-16 px-4"
    >
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-tr from-pink-600 to-purple-600 p-3.5 rounded-2xl">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">Khu Vực Quản Trị Hệ Thống</h2>
            <p className="text-slate-400 text-sm mt-1">Quản lý cơ sở dữ liệu kho giáo án mẫu, hoạt động của giáo viên và chỉ báo năng lực</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <LogOut size={16} /> Đăng xuất quản trị
        </button>
      </div>

      <div className="flex bg-white border border-slate-200 p-1 rounded-2xl shadow-sm mb-8 w-max">
        <button 
          onClick={() => setActiveSubTab('templates')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${activeSubTab === 'templates' ? 'bg-[#D82B71] text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <BookOpen size={16} /> Quản lý Kho Giáo án Mẫu ({templates.length})
        </button>
        <button 
          onClick={() => setActiveSubTab('lessons')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${activeSubTab === 'lessons' ? 'bg-[#D82B71] text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <FileText size={16} /> Giáo án giáo viên đã tạo ({lessons.length})
        </button>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl mb-6 flex items-center gap-2 shadow-sm">
          <CheckCircle2 size={20} className="flex-shrink-0" />
          <span className="font-medium text-sm">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 flex items-center gap-2 shadow-sm">
          <AlertCircle size={20} className="flex-shrink-0" />
          <span className="font-medium text-sm">{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 text-slate-400 bg-white rounded-3xl border border-slate-100">
          <Loader2 size={36} className="animate-spin mb-3 text-pink-600" />
          Đang tải dữ liệu quản trị...
        </div>
      ) : activeSubTab === 'templates' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* CỘT TRÁI: DANH SÁCH MẪU GIÁO ÁN */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-black text-lg text-slate-800 flex items-center gap-2 mb-4">
              <Award className="text-[#D82B71]" size={20} /> Danh sách mẫu giáo án hiện tại
            </h3>
            {templates.length === 0 ? (
              <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-3xl">
                Không có mẫu giáo án nào. Hãy tạo một mẫu mới.
              </div>
            ) : (
              templates.map((tpl) => (
                <div key={tpl.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="bg-pink-50 text-[#D82B71] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Lớp {tpl.grade} • {tpl.subject}
                      </span>
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-medium px-2 py-0.5 rounded-full">
                        Tác giả: {tpl.author}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-md truncate">{tpl.title}</h4>
                    <p className="text-slate-500 text-xs mt-2 line-clamp-2">{tpl.lessonPlan?.generalObjectives}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button 
                      onClick={() => handleLoadLessonIntoEditor(tpl.lessonPlan)}
                      className="p-2 text-slate-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg cursor-pointer transition-colors"
                      title="Sửa bản kế hoạch trong Editor"
                    >
                      <FileText size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteTemplate(tpl.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                      title="Xóa mẫu"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* CỘT PHẢI: FORM THÊM MẪU MỚI */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="font-black text-lg text-slate-800 flex items-center gap-2 mb-6">
              <Plus className="text-[#D82B71]" size={20} /> Tạo mẫu giáo án tích hợp mới
            </h3>
            
            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên bài học / Chủ đề</label>
                <input 
                  type="text" required
                  value={newTemplateForm.title}
                  onChange={e => setNewTemplateForm({ ...newTemplateForm, title: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 outline-none text-slate-700 font-medium text-sm focus:border-pink-500"
                  placeholder="Khai thác phần mềm thiết kế 3D cơ bản"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Môn học</label>
                  <input 
                    type="text" required
                    value={newTemplateForm.subject}
                    onChange={e => setNewTemplateForm({ ...newTemplateForm, subject: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 outline-none text-slate-700 font-medium text-sm focus:border-pink-500"
                    placeholder="Tin học"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Khối lớp</label>
                  <input 
                    type="text" required
                    value={newTemplateForm.grade}
                    onChange={e => setNewTemplateForm({ ...newTemplateForm, grade: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 outline-none text-slate-700 font-medium text-sm focus:border-pink-500"
                    placeholder="11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tác giả</label>
                  <input 
                    type="text" required
                    value={newTemplateForm.author}
                    onChange={e => setNewTemplateForm({ ...newTemplateForm, author: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 outline-none text-slate-700 font-medium text-sm focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Thứ tự bài</label>
                  <input 
                    type="text" required
                    value={newTemplateForm.lessonNumber}
                    onChange={e => setNewTemplateForm({ ...newTemplateForm, lessonNumber: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 outline-none text-slate-700 font-medium text-sm focus:border-pink-500"
                    placeholder="Bài 4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mục tiêu chung</label>
                <textarea 
                  required
                  value={newTemplateForm.generalObjectives}
                  onChange={e => setNewTemplateForm({ ...newTemplateForm, generalObjectives: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 outline-none text-slate-700 font-medium text-sm focus:border-pink-500 h-24 resize-none"
                  placeholder="Kiến thức, phẩm chất và năng lực hướng tới..."
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Thiết bị & Học liệu</label>
                <textarea 
                  required
                  value={newTemplateForm.materials}
                  onChange={e => setNewTemplateForm({ ...newTemplateForm, materials: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 outline-none text-slate-700 font-medium text-sm focus:border-pink-500 h-20 resize-none"
                  placeholder="Phòng Lab máy tính, tài liệu HD..."
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hoạt động tiến trình học tập (Định dạng: Tên | Mô tả)</label>
                <textarea 
                  value={newTemplateForm.activitiesText}
                  onChange={e => setNewTemplateForm({ ...newTemplateForm, activitiesText: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 outline-none text-slate-700 font-medium text-xs focus:border-pink-500 h-28 font-mono leading-relaxed"
                  placeholder="Hoạt động 1: Khởi động | Giáo viên nêu vấn đề...&#10;&#10;Hoạt động 2: Thảo luận | Học sinh chia nhóm..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className={`w-full py-3.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold text-sm shadow flex items-center justify-center gap-2 cursor-pointer ${submitting ? 'opacity-50' : ''}`}
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Lưu và Công bố Mẫu giáo án
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* SAVED LESSONS LIST */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="font-black text-lg text-slate-800 flex items-center gap-2 mb-6">
            <FolderOpen className="text-[#D82B71]" size={20} /> Giáo án người dùng/giáo viên đã lưu trong phiên
          </h3>
          {lessons.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              Không có giáo án nào được tạo bởi người dùng và lưu trên hệ thống.
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((plan) => (
                <div key={plan.id} className="border border-slate-150 p-5 rounded-2xl flex justify-between items-center hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="flex gap-2 items-center mb-1">
                      <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Lớp {plan.grade} • {plan.subject}</span>
                      <span className="text-slate-400 text-xs">Mã ID: {plan.id}</span>
                    </div>
                    <h4 className="font-bold text-slate-800">{plan.lessonNumber ? `${plan.lessonNumber}: ` : ''}{plan.title || "Không có tên"}</h4>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleLoadLessonIntoEditor(plan)}
                      className="px-4 py-2 bg-pink-50 text-[#D82B71] hover:bg-pink-100 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <FileText size={14} /> Mở chỉnh sửa
                    </button>
                    <button 
                      onClick={() => handleDeleteLesson(plan.id)}
                      className="p-2 text-slate-300 hover:text-red-600 rounded-xl cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
