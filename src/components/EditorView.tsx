import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  FileEdit, 
  FolderOpen, 
  Save, 
  ClipboardCopy, 
  CheckCircle2, 
  Printer, 
  FileText, 
  Plus, 
  Trash2, 
  X, 
  Sparkles, 
  Paperclip, 
  Loader2, 
  Search, 
  PlusCircle,
  ClipboardPaste,
  CloudLightning,
  AlertCircle
} from 'lucide-react';
import { SUBJECTS, competencyDataLookup } from '../data/competencyDb.js';
import { LessonPlan, Competency, Activity } from '../types.js';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType, 
  PageBreak 
} from 'docx';

interface EditorViewProps {
  lessonPlan: LessonPlan;
  setLessonPlan: React.Dispatch<React.SetStateAction<LessonPlan>>;
  projectLessons: LessonPlan[];
  setProjectLessons: React.Dispatch<React.SetStateAction<LessonPlan[]>>;
  onBackToSetup: () => void;
}

export default function EditorView({ lessonPlan, setLessonPlan, projectLessons, setProjectLessons, onBackToSetup }: EditorViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedContent, setPastedContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Trigger browser print
  const handlePrint = () => window.print();

  // Export fully integrated plan to standard DOCX using docx package
  const handleExportDocx = async () => {
    try {
      const lessonsToExport = projectLessons.length > 0 ? projectLessons : [lessonPlan];
      const docChildren: any[] = [];

      const createMultilineParagraph = (text: string, options: { bold?: boolean; italic?: boolean; size?: number; align?: any; before?: number; after?: number } = {}) => {
        const lines = text ? text.split('\n') : [''];
        const children: any[] = [];
        lines.forEach((line, i) => {
          children.push(new TextRun({
            text: line,
            bold: options.bold || false,
            italic: options.italic || false,
            size: (options.size || 14) * 2,
            font: "Times New Roman",
          }));
          if (i < lines.length - 1) {
            children.push(new TextRun({
              text: "",
              break: 1
            }));
          }
        });

        return new Paragraph({
          alignment: options.align || AlignmentType.LEFT,
          spacing: {
            before: (options.before !== undefined ? options.before : 0) * 20,
            after: (options.after !== undefined ? options.after : 6) * 20,
            line: 240,
          },
          children: children
        });
      };

      lessonsToExport.forEach((plan, index) => {
        // Add page break if not first lesson
        if (index > 0) {
          docChildren.push(new Paragraph({ children: [new PageBreak()] }));
        }

        // Title header
        docChildren.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 12 * 20, after: 12 * 20 },
          children: [
            new TextRun({
              text: "KẾ HOẠCH BÀI DẠY TÍCH HỢP NĂNG LỰC SỐ",
              bold: true,
              size: 15 * 2,
              font: "Times New Roman",
            })
          ]
        }));

        // Lesson Title
        const lessonNum = plan.lessonNumber ? `${plan.lessonNumber.toUpperCase()}: ` : '';
        docChildren.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 18 * 20 },
          children: [
            new TextRun({
              text: `${lessonNum}${plan.title.toUpperCase() || `CHỦ ĐỀ ${index + 1}`}`,
              bold: true,
              size: 13 * 2,
              font: "Times New Roman",
            })
          ]
        }));

        // Metadata details
        docChildren.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 24 * 20 },
          children: [
            new TextRun({
              text: `Môn học: `,
              bold: true,
              font: "Times New Roman",
              size: 12 * 2,
            }),
            new TextRun({
              text: `${plan.subject}   |   `,
              font: "Times New Roman",
              size: 12 * 2,
            }),
            new TextRun({
              text: `Khối lớp: `,
              bold: true,
              font: "Times New Roman",
              size: 12 * 2,
            }),
            new TextRun({
              text: `${plan.grade}   |   `,
              font: "Times New Roman",
              size: 12 * 2,
            }),
            new TextRun({
              text: `Thời lượng: `,
              bold: true,
              font: "Times New Roman",
              size: 12 * 2,
            }),
            new TextRun({
              text: `${plan.numberOfPeriods || plan.duration || '1 tiết'}`,
              font: "Times New Roman",
              size: 12 * 2,
            }),
          ]
        }));

        // Horizontal separator line
        docChildren.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 24 * 20 },
          children: [
            new TextRun({
              text: "--------------------------------------------------------------------------------",
              font: "Times New Roman",
              size: 11 * 2,
              italic: true,
            })
          ]
        }));

        // I. MỤC TIÊU BÀI HỌC
        docChildren.push(new Paragraph({
          spacing: { before: 18 * 20, after: 12 * 20 },
          children: [
            new TextRun({
              text: "I. MỤC TIÊU BÀI HỌC",
              bold: true,
              size: 13 * 2,
              font: "Times New Roman",
            })
          ]
        }));

        // 1. Mục tiêu chung
        docChildren.push(new Paragraph({
          spacing: { before: 8 * 20, after: 8 * 20 },
          children: [
            new TextRun({
              text: "1. Mục tiêu chung (Kiến thức, Kỹ năng, Phẩm chất):",
              bold: true,
              size: 12 * 2,
              font: "Times New Roman",
            })
          ]
        }));

        docChildren.push(createMultilineParagraph(plan.generalObjectives || "Chưa nhập mục tiêu chung.", { size: 12, before: 0, after: 12 }));

        // 2. Mục tiêu Năng lực số tích hợp
        docChildren.push(new Paragraph({
          spacing: { before: 12 * 20, after: 8 * 20 },
          children: [
            new TextRun({
              text: "2. Mục tiêu Năng lực số tích hợp (Khung năng lực số GDPT):",
              bold: true,
              size: 12 * 2,
              font: "Times New Roman",
            })
          ]
        }));

        if (plan.competencies.length === 0) {
          docChildren.push(new Paragraph({
            spacing: { before: 0, after: 12 * 20 },
            children: [
              new TextRun({
                text: "Chưa tích hợp mục tiêu năng lực số.",
                italic: true,
                size: 12 * 2,
                font: "Times New Roman",
              })
            ]
          }));
        } else {
          plan.competencies.forEach(c => {
            docChildren.push(new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 4 * 20, after: 4 * 20 },
              children: [
                new TextRun({
                  text: `[${c.level}] `,
                  bold: true,
                  size: 12 * 2,
                  font: "Times New Roman",
                }),
                new TextRun({
                  text: c.desc,
                  size: 12 * 2,
                  font: "Times New Roman",
                })
              ]
            }));
          });
        }

        // II. THIẾT BỊ DẠY HỌC & HỌC LIỆU
        docChildren.push(new Paragraph({
          spacing: { before: 18 * 20, after: 12 * 20 },
          children: [
            new TextRun({
              text: "II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU",
              bold: true,
              size: 13 * 2,
              font: "Times New Roman",
            })
          ]
        }));

        docChildren.push(createMultilineParagraph(plan.materials || "Chưa chuẩn bị thiết bị dạy học.", { size: 12, before: 0, after: 12 }));

        // III. TIẾN TRÌNH DẠY HỌC
        docChildren.push(new Paragraph({
          spacing: { before: 18 * 20, after: 12 * 20 },
          children: [
            new TextRun({
              text: "III. TIẾN TRÌNH DẠY HỌC",
              bold: true,
              size: 13 * 2,
              font: "Times New Roman",
            })
          ]
        }));

        if (!plan.activities || plan.activities.length === 0) {
          docChildren.push(new Paragraph({
            spacing: { before: 0, after: 12 * 20 },
            children: [
              new TextRun({
                text: "Chưa có hoạt động tiến trình nào.",
                italic: true,
                size: 12 * 2,
                font: "Times New Roman",
              })
            ]
          }));
        } else {
          plan.activities.forEach((act) => {
            docChildren.push(new Paragraph({
              spacing: { before: 12 * 20, after: 6 * 20 },
              children: [
                new TextRun({
                  text: `${act.name}`,
                  bold: true,
                  size: 12 * 2,
                  font: "Times New Roman",
                })
              ]
            }));

            docChildren.push(createMultilineParagraph(act.content || "Chưa nhập nội dung hoạt động.", { size: 12, before: 0, after: 12 }));
          });
        }
      });

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: docChildren
          }
        ]
      });

      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `GiaoAn_TichHop_NLS_${lessonPlan.title || 'Luu'}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Lỗi khi xuất tệp DOCX:", error);
      alert("Có lỗi xảy ra khi tạo tệp .docx chuẩn định dạng. Vui lòng thử lại!");
    }
  };

  const exportToWord = handleExportDocx;

  // Save lesson plan to persistent Express database
  const handleSaveToDatabase = async () => {
    setSaveStatus('saving');
    try {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonPlan)
      });
      if (response.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      setSaveStatus('error');
    }
  };

  const handleSaveProjectLocal = () => {
    let finalProject = [...projectLessons];
    if (finalProject.length === 0) {
      finalProject = [lessonPlan];
    } else {
      finalProject = finalProject.map(l => l.id === lessonPlan.id ? lessonPlan : l);
    }
    const dataToSave = { type: 'project_multi_lessons', lessons: finalProject };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToSave));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `DuAn_NangLucSo_${lessonPlan.title || 'GiaoAn'}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const switchLesson = (targetId: string) => {
      let updatedProject = [...projectLessons];
      if (updatedProject.length === 0) updatedProject = [lessonPlan];
      else updatedProject = updatedProject.map(l => l.id === lessonPlan.id ? lessonPlan : l);
      setProjectLessons(updatedProject);
      const targetLesson = updatedProject.find(l => l.id === targetId);
      if (targetLesson) setLessonPlan(targetLesson);
  };

  const addNewBlankLesson = () => {
      const newId = `lesson-${Date.now()}`;
      const newLesson: LessonPlan = { 
        id: newId, 
        lessonNumber: `Bài ${projectLessons.length + 1}`, 
        title: `Chủ đề mới`, 
        subject: lessonPlan.subject, 
        grade: lessonPlan.grade, 
        numberOfPeriods: '1 tiết', 
        generalObjectives: '', 
        competencies: [], 
        materials: '', 
        activities: [{ id: Date.now(), name: 'Hoạt động 1: Khởi động', content: '' }], 
        attachments: [] 
      };
      const updatedProject = projectLessons.length > 0 
        ? [...projectLessons.map(l => l.id === lessonPlan.id ? lessonPlan : l), newLesson] 
        : [lessonPlan, newLesson];
      setProjectLessons(updatedProject);
      setLessonPlan(newLesson);
  };

  const addActivity = () => setLessonPlan(prev => ({ 
    ...prev, 
    activities: [...prev.activities, { id: Date.now(), name: `Hoạt động ${prev.activities.length + 1}`, content: '' }] 
  }));

  const updateActivity = (id: number, field: keyof Activity, value: string) => setLessonPlan(prev => ({ 
    ...prev, 
    activities: prev.activities.map(act => act.id === id ? { ...act, [field]: value } : act) 
  }));

  const removeActivity = (id: number) => setLessonPlan(prev => ({ 
    ...prev, 
    activities: prev.activities.filter(act => act.id !== id) 
  }));

  const handleCopyToClipboard = () => {
    let allContent = '';
    const lessonsToExport = projectLessons.length > 0 ? projectLessons : [lessonPlan];
    
    lessonsToExport.forEach((plan, index) => {
        const activitiesList = plan.activities?.map(act => `${act.name}\n${act.content}\n\n`).join('') || 'Chưa có hoạt động nào.';
        const compsList = plan.competencies.map(c => `- [${c.level}] ${c.desc}`).join('\n');

        allContent += `KẾ HOẠCH BÀI DẠY (TÍCH HỢP NĂNG LỰC SỐ)\n`;
        allContent += `Bài: ${plan.lessonNumber ? plan.lessonNumber + ': ' : ''}${plan.title || `Chủ đề ${index + 1}`}\n`;
        allContent += `Môn học: ${plan.subject} | Khối lớp: ${plan.grade} | Số tiết: ${plan.numberOfPeriods || plan.duration || '1 tiết'}\n\n`;
        allContent += `I. MỤC TIÊU BÀI HỌC\n1. Mục tiêu chung:\n${plan.generalObjectives}\n\n`;
        allContent += `2. Mục tiêu Năng lực số:\n${compsList}\n\n`;
        allContent += `II. THIẾT BỊ DẠY HỌC & HỌC LIỆU\n${plan.materials}\n\n`;
        allContent += `III. TIẾN TRÌNH DẠY HỌC\n${activitiesList}\n`;
        if (index < lessonsToExport.length - 1) allContent += `\n--------------------------------------------------\n\n`;
    });

    navigator.clipboard.writeText(allContent).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleLoadProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (e.target?.result) {
          const parsedData = JSON.parse(e.target.result as string);
          if (parsedData.type === 'project_multi_lessons' && parsedData.lessons?.length > 0) {
            setProjectLessons(parsedData.lessons);
            setLessonPlan(parsedData.lessons[0]);
          } else {
             const defaultPlan: LessonPlan = { id: 'default-1', title: '', subject: '', grade: '', numberOfPeriods: '', generalObjectives: '', competencies: [], materials: '', activities: [] };
             const merged = { ...defaultPlan, ...parsedData };
             setLessonPlan(merged);
             setProjectLessons([merged]);
          }
        }
      } catch (error) { 
        alert("Lỗi: File JSON lưu trữ không hợp lệ."); 
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // Re-sync pasted text inside Editor using Gemini API
  const handleSyncFromPastedText = async () => {
    if (!pastedContent.trim()) return;
    setIsSyncing(true);
    try {
      const response = await fetch('/api/analyze-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pastedText: pastedContent,
          grade: lessonPlan.grade,
          subject: lessonPlan.subject
        })
      });

      if (response.ok) {
        const structuredPlan = await response.json();
        setLessonPlan(prev => ({
          ...prev,
          ...structuredPlan,
          competencies: [
            ...prev.competencies,
            ...structuredPlan.competencies.filter((c: Competency) => !prev.competencies.some(existing => existing.level === c.level))
          ]
        }));
        setShowPasteModal(false);
        setPastedContent('');
      } else {
        alert("Có lỗi xảy ra khi phân tích bằng AI!");
      }
    } catch (err) {
      alert("Không thể kết nối dịch vụ AI!");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAttachFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(event.target.files || []);
    if (!files.length) return;
    
    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setLessonPlan(prev => ({ 
            ...prev, 
            attachments: [
              ...(prev.attachments || []), 
              { name: file.name, type: file.type, dataUrl: e.target.result as string }
            ] 
          }));
        }
      };
      reader.readAsDataURL(file);
    });
    event.target.value = '';
  };

  const handleSyncOriginalWithAI = async (file: any) => {
    setIsSyncing(true);
    try {
      const base64Data = file.dataUrl.split(',')[1];
      const response = await fetch('/api/analyze-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: base64Data,
          mimeType: file.type,
          grade: lessonPlan.grade,
          subject: lessonPlan.subject
        })
      });

      if (response.ok) {
        const structuredPlan = await response.json();
        setLessonPlan(prev => ({
          ...prev,
          ...structuredPlan,
          competencies: [
            ...prev.competencies,
            ...structuredPlan.competencies.filter((c: Competency) => !prev.competencies.some(existing => existing.level === c.level))
          ]
        }));
      } else {
        alert("Lỗi AI khi phân tích tệp đính kèm!");
      }
    } catch (err) {
      alert("Không thể kết nối đến máy chủ AI!");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* 🚀 SUCCESS BANNER */}
      {showSuccessBanner && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 rounded-3xl p-8 text-center relative overflow-hidden shadow-xl print:hidden"
        >
          <button 
            onClick={() => setShowSuccessBanner(false)} 
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors cursor-pointer font-bold"
          >
            ✕
          </button>
          <div className="bg-white/15 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-inner">
            <Sparkles className="text-yellow-300" size={28} />
          </div>
          <h2 className="text-3xl font-black text-white mb-2 leading-tight">Phân Tích AI & Tích Hợp Thành Công!</h2>
          <p className="text-white/95 text-md mb-6 max-w-2xl mx-auto">Giáo án của bạn đã được tối ưu cấu trúc sư phạm và tự động ghép mục tiêu Năng lực số phù hợp.</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <button 
              onClick={handleExportDocx}
              className="w-full sm:w-auto bg-white text-pink-700 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors shadow-lg flex items-center justify-center cursor-pointer text-sm"
            >
              <FileText size={18} className="mr-2" /> Tải về tệp WORD (.docx)
            </button>
            <button 
              onClick={onBackToSetup}
              className="w-full sm:w-auto bg-black/20 text-white font-bold px-6 py-3 rounded-xl hover:bg-black/30 transition-all flex items-center justify-center border border-white/10 cursor-pointer text-sm"
            >
              Tạo/Phân tích giáo án khác
            </button>
          </div>
        </motion.div>
      )}

      {/* WRAPPER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CỘT TRÁI: FORM BIÊN SOẠN */}
        <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden print:w-full print:shadow-none print:border-none print:h-auto print:block">
          
          {/* Tool bar */}
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3 print:hidden">
            <div className="flex items-center">
              <button onClick={onBackToSetup} className="mr-3 p-2 hover:bg-slate-200 rounded-xl text-slate-500 transition-colors cursor-pointer" title="Quay lại thiết lập">
                <ArrowLeft size={18} />
              </button>
              <h2 className="font-bold text-slate-700 flex items-center whitespace-nowrap">
                <FileEdit className="mr-2 h-5 w-5 text-pink-600"/> Trình biên soạn giáo án
              </h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <input type="file" accept=".json" ref={fileInputRef} onChange={handleLoadProject} className="hidden" />
              
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="flex items-center px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer shadow-sm"
              >
                <FolderOpen size={14} className="mr-1.5" /> Mở dự án JSON
              </button>
              
              <button 
                onClick={handleSaveProjectLocal} 
                className="flex items-center px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer shadow-sm"
              >
                <Save size={14} className="mr-1.5" /> Lưu JSON
              </button>
              
              <button 
                onClick={handleSaveToDatabase}
                disabled={saveStatus === 'saving'}
                className={`flex items-center px-3 py-2 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm transition-all ${
                  saveStatus === 'saved' ? 'bg-emerald-600' : saveStatus === 'error' ? 'bg-red-600' : 'bg-pink-600 hover:bg-pink-700'
                }`}
              >
                {saveStatus === 'saving' ? (
                  <Loader2 size={14} className="animate-spin mr-1.5" />
                ) : saveStatus === 'saved' ? (
                  <CheckCircle2 size={14} className="mr-1.5" />
                ) : (
                  <CloudLightning size={14} className="mr-1.5" />
                )}
                {saveStatus === 'saving' ? 'Đang lưu...' : saveStatus === 'saved' ? 'Đã lưu hệ thống!' : saveStatus === 'error' ? 'Lỗi lưu!' : 'Lưu vào hệ thống'}
              </button>

              <button 
                onClick={handleCopyToClipboard} 
                className="flex items-center px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer shadow-sm"
              >
                {isCopied ? <CheckCircle2 size={14} className="mr-1.5 text-green-600" /> : <ClipboardCopy size={14} className="mr-1.5" />} 
                {isCopied ? 'Đã Copy!' : 'Copy Text'}
              </button>
              
              <div className="w-px bg-slate-300 h-6 mx-1 hidden sm:block"></div>
              
              <button 
                onClick={handlePrint} 
                className="flex items-center px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer shadow-sm"
              >
                <Printer size={14} className="mr-1.5" /> In / PDF
              </button>
              
              <button 
                onClick={handleExportDocx} 
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold hover:shadow-md cursor-pointer transition-all"
              >
                <FileText size={14} className="mr-1.5" /> Xuất Word (.docx)
              </button>
            </div>
          </div>

          {/* Thanh Tabs danh sách bài */}
          {projectLessons.length > 0 && (
            <div className="bg-slate-100 border-b border-slate-200 p-2.5 flex space-x-2 overflow-x-auto print:hidden items-center">
              {projectLessons.map((l, index) => (
                <button 
                  key={l.id}
                  onClick={() => switchLesson(l.id)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${l.id === lessonPlan.id ? 'bg-[#D82B71] text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                  Bài học {index + 1}: {l.title || "Chủ đề"}
                </button>
              ))}
              <button 
                onClick={addNewBlankLesson} 
                className="px-3.5 py-2 rounded-xl font-bold text-xs text-[#D82B71] bg-pink-50 border border-pink-200 hover:bg-pink-100 cursor-pointer flex items-center"
              >
                <Plus size={14} className="mr-1" /> Thêm Bài Mới
              </button>
            </div>
          )}

          {/* Khung nhập liệu Giáo Án */}
          <div className="p-8 overflow-y-auto print:p-0 bg-white">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black uppercase text-slate-900 print:text-black">Kế Hoạch Bài Dạy Tích Hợp Năng Lực Số</h1>
              <p className="text-slate-400 text-xs mt-1 print:hidden">Xây dựng tiến trình giảng dạy chuẩn quy định tích hợp các mã chỉ báo NLS GDPT 2018</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 border border-slate-200 p-4 rounded-2xl bg-slate-50/50 print:bg-transparent print:border-none print:p-0">
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">Bài số</label>
                <input 
                  type="text" 
                  value={lessonPlan.lessonNumber || ''} 
                  onChange={e => setLessonPlan({...lessonPlan, lessonNumber: e.target.value})} 
                  className="w-full border border-slate-200 bg-white rounded-xl p-2.5 font-bold text-slate-800 focus:border-pink-500 outline-none print:border-none print:p-0 print:bg-transparent" 
                  placeholder="Ví dụ: Bài 1..."
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">Tên bài học / Chủ đề</label>
                <input 
                  type="text" 
                  value={lessonPlan.title || ''} 
                  onChange={e => setLessonPlan({...lessonPlan, title: e.target.value})} 
                  className="w-full border border-slate-200 bg-white rounded-xl p-2.5 font-bold text-slate-800 focus:border-pink-500 outline-none print:border-none print:p-0 print:bg-transparent" 
                  placeholder="Nhập tên kế hoạch bài dạy..."
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8 border border-slate-200 p-4 rounded-2xl bg-slate-50/50 print:bg-transparent print:border-none print:p-0">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">Môn học</label>
                <input 
                  list="subject-list-editor" 
                  type="text" 
                  value={lessonPlan.subject || ''} 
                  onChange={e => setLessonPlan({...lessonPlan, subject: e.target.value})} 
                  className="w-full border border-slate-200 bg-white rounded-xl p-2.5 text-sm focus:border-pink-500 outline-none print:border-none print:p-0 print:bg-transparent" 
                  placeholder="Chọn tên môn..."
                />
                <datalist id="subject-list-editor">
                  {SUBJECTS.map((sub, idx) => <option key={idx} value={sub} />)}
                </datalist>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">Khối lớp</label>
                <input 
                  type="text" 
                  value={lessonPlan.grade || ''} 
                  onChange={e => setLessonPlan({...lessonPlan, grade: e.target.value})} 
                  className="w-full border border-slate-200 bg-white rounded-xl p-2.5 text-sm focus:border-pink-500 outline-none print:border-none print:p-0 print:bg-transparent" 
                  placeholder="Lớp 11"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 print:text-black">Thời lượng (Số tiết)</label>
                <input 
                  type="text" 
                  value={lessonPlan.numberOfPeriods || lessonPlan.duration || ''} 
                  onChange={e => setLessonPlan({...lessonPlan, numberOfPeriods: e.target.value, duration: e.target.value})} 
                  className="w-full border border-slate-200 bg-white rounded-xl p-2.5 text-sm focus:border-pink-500 outline-none print:border-none print:p-0 print:bg-transparent" 
                  placeholder="1 tiết"
                />
              </div>
            </div>

            {/* PHẦN I: MỤC TIÊU BÀI HỌC */}
            <div className="mb-8">
              <h3 className="font-bold text-lg border-b border-slate-200 pb-2 mb-4 text-slate-800 print:text-black">I. Mục tiêu bài học</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2 print:text-black">1. Mục tiêu chung (Kiến thức, Kỹ năng, Phẩm chất)</label>
                <textarea 
                  value={lessonPlan.generalObjectives} 
                  onChange={e => setLessonPlan({...lessonPlan, generalObjectives: e.target.value})} 
                  placeholder="Mô tả mục tiêu dạy học cốt lõi của bài học tại đây..." 
                  className="w-full h-32 border border-slate-200 rounded-2xl p-4 focus:border-pink-500 outline-none resize-y bg-transparent text-sm leading-relaxed"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 print:text-black">2. Mục tiêu Năng lực số tích hợp</label>
                {lessonPlan.competencies.length === 0 ? (
                  <div className="text-center p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl print:hidden">
                    <p className="text-slate-400 text-sm">Chưa có mục tiêu năng lực số nào. Hãy chọn từ Danh sách chỉ báo ở cột bên phải để tích hợp nhanh!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lessonPlan.competencies.map((comp, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start group bg-pink-50/40 p-3 rounded-xl border border-pink-100 print:bg-transparent print:border-none print:p-0"
                      >
                        <span className="inline-block bg-[#D82B71] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md mr-3 mt-0.5 print:bg-transparent print:border print:border-black print:text-black">
                          {comp.level}
                        </span>
                        <div className="flex-1 min-w-0">
                          {comp.componentTitle && (
                            <p className="text-xs font-bold text-slate-500 mb-0.5 print:hidden">{comp.componentTitle}</p>
                          )}
                          <span className="text-slate-700 text-sm font-semibold leading-relaxed print:text-black print:font-normal">{comp.desc}</span>
                        </div>
                        <button 
                          onClick={() => setLessonPlan(prev => ({...prev, competencies: prev.competencies.filter((_, i) => i !== idx)}))} 
                          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 ml-2 print:hidden cursor-pointer transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* PHẦN II: THIẾT BỊ DẠY HỌC */}
            <div className="mb-8">
              <h3 className="font-bold text-lg border-b border-slate-200 pb-2 mb-4 text-slate-800 print:text-black">II. Thiết bị dạy học và Học liệu</h3>
              <textarea 
                value={lessonPlan.materials} 
                onChange={e => setLessonPlan({...lessonPlan, materials: e.target.value})} 
                placeholder="Chuẩn bị thiết bị (máy chiếu, mạng internet, phiếu học tập)..." 
                className="w-full h-24 border border-slate-200 rounded-2xl p-4 focus:border-pink-500 outline-none resize-y bg-transparent text-sm leading-relaxed"
              ></textarea>
            </div>

            {/* PHẦN III: TIẾN TRÌNH DẠY HỌC */}
            <div className="mb-8">
              <h3 className="font-bold text-lg border-b border-slate-200 pb-2 mb-4 text-slate-800 print:text-black">III. Tiến trình dạy học</h3>
              
              <div className="space-y-6">
                {lessonPlan.activities.map((act) => (
                  <div key={act.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 print:bg-transparent print:border-none print:p-0 relative group">
                    <div className="flex justify-between items-center mb-3">
                      <input 
                        type="text" 
                        value={act.name} 
                        onChange={e => updateActivity(act.id, 'name', e.target.value)} 
                        className="font-bold text-slate-800 text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-pink-500 outline-none w-full print:text-black print:border-none" 
                      />
                      <button 
                        onClick={() => removeActivity(act.id)} 
                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity print:hidden cursor-pointer p-1"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                    <textarea 
                      value={act.content} 
                      onChange={e => updateActivity(act.id, 'content', e.target.value)} 
                      placeholder="Mô tả cụ thể mục tiêu hoạt động, nội dung thực hiện, sản phẩm đạt được và phương pháp tổ chức chi tiết..." 
                      className="w-full min-h-[140px] border border-slate-200 rounded-xl p-3 focus:border-pink-500 outline-none resize-y bg-white text-xs leading-relaxed"
                    ></textarea>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={addActivity} 
                className="mt-4 flex items-center justify-center w-full py-3.5 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 hover:text-pink-600 hover:border-pink-300 transition-colors cursor-pointer print:hidden"
              >
                <Plus size={18} className="mr-2" /> Thêm hoạt động tiến trình mới
              </button>
            </div>
            
            {/* TÀI LIỆU ĐÍNH KÈM & ĐỒNG BỘ AI BÊN DƯỚI EDITOR */}
            <div className="mt-12 border-t border-slate-200 pt-8 print:hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
                <h3 className="font-bold text-lg text-slate-800">IV. Phân tích tài liệu & Đồng bộ AI</h3>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setShowPasteModal(true)} 
                    className="flex items-center px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors border border-amber-200 cursor-pointer shadow-sm"
                  >
                    <ClipboardPaste size={14} className="mr-1.5" /> Dán Văn Bản KHBD
                  </button>
                  <input type="file" multiple accept=".pdf,image/*" ref={attachmentInputRef} onChange={handleAttachFiles} className="hidden" />
                  <button 
                    onClick={() => attachmentInputRef.current?.click()} 
                    className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors border border-indigo-200 cursor-pointer shadow-sm"
                  >
                    <Paperclip size={14} className="mr-1.5" /> Tải tệp lên
                  </button>
                </div>
              </div>

              {(!lessonPlan.attachments || lessonPlan.attachments.length === 0) ? (
                <p className="text-xs text-slate-400 italic">Tải lên tệp tài liệu PDF/hình ảnh học liệu hoặc dán văn bản để AI trích xuất nội dung tự động gán Năng lực số.</p>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {lessonPlan.attachments.map((file, idx) => {
                    const isImage = file.type.startsWith('image/');
                    return (
                      <div key={idx} className="flex justify-between items-center p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm group">
                        <div className="flex items-center overflow-hidden gap-3">
                          <div className="h-10 w-10 flex-shrink-0 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-150">
                            {isImage ? <img src={file.dataUrl} alt={file.name} className="h-full w-full object-cover" /> : <FileText className="text-slate-400" size={20} />}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-slate-700 truncate">{file.name}</p>
                            <p className="text-[10px] text-slate-400">{isImage ? 'Tệp Ảnh' : 'Tài liệu PDF'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleSyncOriginalWithAI(file)} 
                            disabled={isSyncing} 
                            className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                              isSyncing 
                              ? 'bg-slate-50 text-slate-400 border-slate-200' 
                              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent hover:shadow-md'
                            }`}
                          >
                            {isSyncing ? <Loader2 size={12} className="animate-spin mr-1.5" /> : <Sparkles size={12} className="mr-1.5" />}
                            AI phân tích & ghép NLS
                          </button>
                          <button 
                            onClick={() => setLessonPlan(prev => ({...prev, attachments: prev.attachments?.filter((_, i) => i !== idx)}))} 
                            className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* PASTE MODAL */}
            <AnimatePresence>
              {showPasteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:hidden">
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-100"
                  >
                    <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
                      <h3 className="font-bold text-lg text-slate-800 flex items-center">
                        <ClipboardPaste size={20} className="mr-2 text-amber-500" /> Phân tích Văn Bản KHBD bằng AI
                      </h3>
                      <button 
                        onClick={() => setShowPasteModal(false)} 
                        className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer font-bold text-lg"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="p-6 overflow-y-auto flex-1">
                      <p className="text-xs text-slate-500 mb-3 leading-relaxed">Hãy sao chép toàn bộ nội dung giáo án từ Microsoft Word hoặc website và dán trực tiếp vào đây. Trình phân tích AI sẽ giúp chuẩn hóa lại bài giảng của bạn và tích hợp các mục tiêu năng lực số liên quan.</p>
                      <textarea 
                        value={pastedContent} 
                        onChange={(e) => setPastedContent(e.target.value)} 
                        placeholder="Dán nội dung giáo án thô tại đây..." 
                        className="w-full h-80 border border-slate-200 rounded-2xl p-4 focus:border-amber-500 outline-none resize-none text-xs leading-relaxed text-slate-700 bg-slate-50/50 focus:bg-white transition-all"
                      ></textarea>
                    </div>
                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2.5">
                      <button 
                        onClick={() => setShowPasteModal(false)} 
                        className="px-5 py-2 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl font-bold transition-colors cursor-pointer text-sm"
                      >
                        Hủy bỏ
                      </button>
                      <button 
                        onClick={handleSyncFromPastedText} 
                        disabled={isSyncing || !pastedContent.trim()} 
                        className={`px-5 py-2 rounded-xl font-bold transition-all flex items-center cursor-pointer text-sm ${
                          isSyncing ? 'bg-slate-300 text-slate-500' : 'bg-pink-600 hover:bg-pink-700 text-white shadow'
                        }`}
                      >
                        {isSyncing ? <Loader2 size={16} className="animate-spin mr-1.5" /> : <Sparkles size={16} className="mr-1.5" />}
                        Bắt đầu phân tích AI
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* CỘT PHẢI: BẢNG TRA CỨU */}
        <div className="lg:col-span-4 bg-slate-100 rounded-3xl border border-slate-200 flex flex-col overflow-hidden print:hidden shadow-inner h-[calc(100vh-14rem)] sticky top-24">
          <div className="bg-slate-200/50 p-4 border-b border-slate-200">
            <h2 className="font-black text-slate-700 text-xs flex items-center uppercase tracking-wider">
              <Search className="mr-2 h-4 w-4 text-[#D82B71]"/> Nhấp để tích hợp Năng lực số
            </h2>
          </div>
          <div className="overflow-y-auto p-4 flex-1 space-y-4">
            {competencyDataLookup.map((domain) => (
              <div key={domain.id} className="bg-white/60 p-3 rounded-2xl border border-slate-200/50 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-2 text-xs">{domain.title}</h4>
                {domain.criteria.map((crit) => (
                  <div key={crit.id} className="mb-3 last:mb-0">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-2 pl-2 border-l-2 border-blue-500">{crit.id}. {crit.name}</h5>
                    <div className="space-y-1.5">
                      {crit.levels.map((lvl, idx) => (
                        <button 
                          key={idx}
                          onClick={() => {
                            const levelCode = lvl.level.split(' ')[1].replace(/[()]/g, '');
                            const fullCode = `${crit.id}.${levelCode}a`; // Map accurately to database key
                            
                            if (!lessonPlan.competencies.some(c => c.level === fullCode)) {
                              setLessonPlan(prev => ({ 
                                ...prev, 
                                competencies: [...prev.competencies, {
                                  componentTitle: `${crit.id}. ${crit.name}`,
                                  level: fullCode, 
                                  desc: lvl.desc
                                }] 
                              }))
                            }
                          }}
                          className="w-full text-left bg-white p-3 rounded-xl border border-slate-200 hover:border-pink-500 hover:shadow transition-all group flex flex-col cursor-pointer"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-extrabold text-[#D82B71] bg-pink-50 px-1.5 py-0.5 rounded">{lvl.level}</span>
                            <PlusCircle size={14} className="text-slate-300 group-hover:text-pink-500 transition-colors" />
                          </div>
                          <span className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{lvl.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION IN ẤN CHUẨN ĐỊNH DẠNG PDF */}
      <div id="print-section" className="hidden print:block text-black p-8 font-serif leading-relaxed" style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "14pt" }}>
        {projectLessons.length > 0 ? (
          projectLessons.map((plan, idx) => (
            <div key={plan.id} className={idx > 0 ? "page-break-before mb-12" : "mb-12"}>
              <h1 className="text-center font-bold text-2xl uppercase mb-2" style={{ textDecoration: "underline" }}>KẾ HOẠCH BÀI DẠY TÍCH HỢP NĂNG LỰC SỐ</h1>
              <h2 className="text-center font-bold text-xl uppercase mb-4">{plan.lessonNumber ? `${plan.lessonNumber}: ` : ''}{plan.title || `Chủ đề ${idx + 1}`}</h2>
              <p className="text-center italic mb-6">
                <strong>Môn học:</strong> {plan.subject} &nbsp;|&nbsp; 
                <strong>Khối lớp:</strong> {plan.grade} &nbsp;|&nbsp; 
                <strong>Thời lượng:</strong> {plan.numberOfPeriods || plan.duration || '1 tiết'}
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">I. MỤC TIÊU BÀI HỌC</h3>
                  <div className="pl-4">
                    <p className="font-bold mb-1">1. Mục tiêu chung:</p>
                    <p className="whitespace-pre-line text-justify mb-4">{plan.generalObjectives || "Chưa nhập mục tiêu chung"}</p>
                    
                    <p className="font-bold mb-1">2. Mục tiêu Năng lực số tích hợp:</p>
                    {plan.competencies.length === 0 ? (
                      <p className="italic pl-4 text-slate-500">Chưa tích hợp năng lực số</p>
                    ) : (
                      <ul className="list-disc pl-6 space-y-1">
                        {plan.competencies.map((c, cIdx) => (
                          <li key={cIdx} className="text-justify">
                            <strong>[{c.level}]</strong> {c.desc}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</h3>
                  <p className="whitespace-pre-line text-justify pl-4">{plan.materials || "Chưa chuẩn bị thiết bị dạy học"}</p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">III. TIẾN TRÌNH DẠY HỌC</h3>
                  <div className="space-y-6 pl-4">
                    {plan.activities && plan.activities.length > 0 ? (
                      plan.activities.map((act) => (
                        <div key={act.id} className="mb-4">
                          <h4 className="font-bold mb-1">{act.name}</h4>
                          <p className="whitespace-pre-line text-justify pl-4">{act.content || "Chưa nhập nội dung hoạt động"}</p>
                        </div>
                      ))
                    ) : (
                      <p className="italic text-slate-500">Chưa có hoạt động tiến trình nào.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>
            <h1 className="text-center font-bold text-2xl uppercase mb-2" style={{ textDecoration: "underline" }}>KẾ HOẠCH BÀI DẠY TÍCH HỢP NĂNG LỰC SỐ</h1>
            <h2 className="text-center font-bold text-xl uppercase mb-4">{lessonPlan.lessonNumber ? `${lessonPlan.lessonNumber}: ` : ''}{lessonPlan.title}</h2>
            <p className="text-center italic mb-6">
              <strong>Môn học:</strong> {lessonPlan.subject} &nbsp;|&nbsp; 
              <strong>Khối lớp:</strong> {lessonPlan.grade} &nbsp;|&nbsp; 
              <strong>Thời lượng:</strong> {lessonPlan.numberOfPeriods || lessonPlan.duration || '1 tiết'}
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2">I. MỤC TIÊU BÀI HỌC</h3>
                <div className="pl-4">
                  <p className="font-bold mb-1">1. Mục tiêu chung:</p>
                  <p className="whitespace-pre-line text-justify mb-4">{lessonPlan.generalObjectives || "Chưa nhập mục tiêu chung"}</p>
                  
                  <p className="font-bold mb-1">2. Mục tiêu Năng lực số tích hợp:</p>
                  {lessonPlan.competencies.length === 0 ? (
                    <p className="italic pl-4 text-slate-500">Chưa tích hợp năng lực số</p>
                  ) : (
                    <ul className="list-disc pl-6 space-y-1">
                      {lessonPlan.competencies.map((c, cIdx) => (
                        <li key={cIdx} className="text-justify">
                          <strong>[{c.level}]</strong> {c.desc}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2">II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</h3>
                <p className="whitespace-pre-line text-justify pl-4">{lessonPlan.materials || "Chưa chuẩn bị thiết bị dạy học"}</p>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2">III. TIẾN TRÌNH DẠY HỌC</h3>
                <div className="space-y-6 pl-4">
                  {lessonPlan.activities && lessonPlan.activities.length > 0 ? (
                    lessonPlan.activities.map((act) => (
                      <div key={act.id} className="mb-4">
                        <h4 className="font-bold mb-1">{act.name}</h4>
                        <p className="whitespace-pre-line text-justify pl-4">{act.content || "Chưa nhập nội dung hoạt động"}</p>
                      </div>
                    ))
                  ) : (
                    <p className="italic text-slate-500">Chưa có hoạt động tiến trình nào.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
