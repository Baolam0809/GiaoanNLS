import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Layers, 
  BookOpen, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  FileUp, 
  Target, 
  Plus, 
  Trash2, 
  Download, 
  Printer, 
  Table, 
  Zap, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { SUBJECTS, NLS_LEVELS_MAP, NLS_DOMAINS, NLS_COMPONENTS_BY_DOMAIN, EXACT_COMPETENCY_DB } from '../data/competencyDb.js';
import { LessonPlan, Competency } from '../types.js';

interface SetupWizardViewProps {
  lessonPlan: LessonPlan;
  setLessonPlan: React.Dispatch<React.SetStateAction<LessonPlan>>;
  onComplete: () => void;
}

export default function SetupWizardView({ lessonPlan, setLessonPlan, onComplete }: SetupWizardViewProps) {
  const [generationMode, setGenerationMode] = useState<'edit_original' | 'auto_sgk'>('edit_original');
  const [requireNLS, setRequireNLS] = useState(true);
  const [isEnglish, setIsEnglish] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedOriginalFile, setSelectedOriginalFile] = useState<File | null>(null);
  const [selectedOriginalBase64, setSelectedOriginalBase64] = useState<string>('');
  const [pastedText, setPastedText] = useState('');

  // NLS Selector States
  const defaultKhoiLop = 'Lớp 6-7 (TC1)';
  const defaultDomain = NLS_DOMAINS[0];
  const defaultComponent = NLS_COMPONENTS_BY_DOMAIN[defaultDomain][0];
  const defaultPrefix = defaultComponent.match(/^(\d\.\d)/)?.[1] || "1.1";
  const defaultLevelCode = NLS_LEVELS_MAP[defaultKhoiLop];
  const defaultSearchPrefix = `${defaultPrefix}.${defaultLevelCode}`;
  
  const getMatchingKeys = (prefix: string) => {
    return Object.keys(EXACT_COMPETENCY_DB).filter(k => k.startsWith(prefix));
  };

  const initialAvailableMaHoa = getMatchingKeys(defaultSearchPrefix).length > 0 
    ? getMatchingKeys(defaultSearchPrefix) 
    : [`${defaultSearchPrefix}a`];

  const [availableMaHoa, setAvailableMaHoa] = useState(initialAvailableMaHoa);
  const [nlsInput, setNlsInput] = useState({
    khoiLop: defaultKhoiLop,
    nangLucSo: defaultDomain,
    nangLucThanhPhan: defaultComponent,
    maHoa: initialAvailableMaHoa[0],
    chiBao: EXACT_COMPETENCY_DB[initialAvailableMaHoa[0]] || ""
  });

  const updateDependencies = (khoiLop: string, nangLucSo: string, nangLucThanhPhan: string, selectedMaHoa: string | null) => {
    const levelCode = NLS_LEVELS_MAP[khoiLop] || "TC1";
    const prefixMatch = nangLucThanhPhan.match(/^(\d\.\d)/);
    const prefix = prefixMatch ? prefixMatch[1] : '1.1';
    const searchPrefix = `${prefix}.${levelCode}`;
    
    const matchingKeys = getMatchingKeys(searchPrefix);
    let newAvailableKeys = matchingKeys.length > 0 ? matchingKeys : [`${searchPrefix}a`];
    let newMaHoa = (selectedMaHoa && newAvailableKeys.includes(selectedMaHoa)) ? selectedMaHoa : newAvailableKeys[0];
    const newChiBao = EXACT_COMPETENCY_DB[newMaHoa] || `[Chưa cập nhật dữ liệu] Hãy nhập tay chỉ báo...`;

    setAvailableMaHoa(newAvailableKeys);
    setNlsInput({
      khoiLop,
      nangLucSo,
      nangLucThanhPhan,
      maHoa: newMaHoa,
      chiBao: newChiBao
    });
  };

  const handleKhoiLopChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateDependencies(e.target.value, nlsInput.nangLucSo, nlsInput.nangLucThanhPhan, null);
  };

  const handleNangLucSoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDomain = e.target.value;
    const newComponent = NLS_COMPONENTS_BY_DOMAIN[newDomain][0]; 
    updateDependencies(nlsInput.khoiLop, newDomain, newComponent, null);
  };

  const handleNangLucThanhPhanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateDependencies(nlsInput.khoiLop, nlsInput.nangLucSo, e.target.value, null);
  };

  const handleMaHoaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateDependencies(nlsInput.khoiLop, nlsInput.nangLucSo, nlsInput.nangLucThanhPhan, e.target.value);
  };

  const handleChiBaoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNlsInput({ ...nlsInput, chiBao: e.target.value });
  };

  const handleAddNLS = () => {
    if (!nlsInput.maHoa || !nlsInput.chiBao) return;
    const newComp: Competency = { 
      componentTitle: nlsInput.nangLucThanhPhan, 
      level: nlsInput.maHoa, 
      desc: nlsInput.chiBao 
    };
    // check if exists
    if (lessonPlan.competencies.some(c => c.level === newComp.level)) return;

    setLessonPlan(prev => ({
      ...prev,
      competencies: [...prev.competencies, newComp]
    }));
  };

  const [isDragging, setIsDragging] = useState(false);
  const [fileStatus, setFileStatus] = useState<{ type: 'success' | 'error' | 'loading' | ''; message: string }>({ type: '', message: '' });

  const processUploadedFile = async (file: File) => {
    setSelectedOriginalFile(file);
    setFileStatus({ type: 'loading', message: `Đang xử lý tệp "${file.name}"...` });
    setErrorMessage('');

    const fileNameLower = file.name.toLowerCase();

    // 1. JSON File (Import Lesson Plan directly)
    if (fileNameLower.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonText = event.target?.result as string;
          const importedPlan = JSON.parse(jsonText);
          if (importedPlan && (importedPlan.title || importedPlan.generalObjectives)) {
            setLessonPlan(prev => ({
              ...prev,
              ...importedPlan
            }));
            setFileStatus({ 
              type: 'success', 
              message: `Đã nhập trực tiếp giáo án từ file JSON "${file.name}"!` 
            });
          } else {
            setFileStatus({ 
              type: 'error', 
              message: "File JSON không đúng cấu trúc giáo án chuẩn." 
            });
          }
        } catch (err) {
          setFileStatus({ 
            type: 'error', 
            message: "Lỗi khi đọc hoặc phân tích file JSON." 
          });
        }
      };
      reader.readAsText(file);
    }
    // 2. Text File (.txt)
    else if (fileNameLower.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          setPastedText(text);
          setFileStatus({ 
            type: 'success', 
            message: `Đã trích xuất thành công ${text.length} ký tự từ file văn bản "${file.name}"!` 
          });
          // Switch to paste mode so user can see it
          setGenerationMode('auto_sgk');
        } catch (err) {
          setFileStatus({ 
            type: 'error', 
            message: "Lỗi khi đọc file text." 
          });
        }
      };
      reader.readAsText(file);
    }
    // 3. Word Document (.docx)
    else if (fileNameLower.endsWith('.docx')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const mammoth = await import('mammoth');
          const result = await mammoth.extractRawText({ arrayBuffer });
          const text = result.value;
          
          if (text && text.trim().length > 0) {
            setPastedText(text);
            setFileStatus({ 
              type: 'success', 
              message: `Đã trích xuất thành công ${text.length} ký tự từ file Word (.docx) "${file.name}"!` 
            });
            // Automatically switch to text pasting mode to let user view/edit the content
            setGenerationMode('auto_sgk');
          } else {
            setFileStatus({ 
              type: 'error', 
              message: "Tệp Word (.docx) rỗng hoặc không trích xuất được văn bản." 
            });
          }
        } catch (err: any) {
          console.error(err);
          setFileStatus({ 
            type: 'error', 
            message: `Không thể đọc file Word (.docx): ${err.message || err}` 
          });
        }
      };
      reader.readAsArrayBuffer(file);
    }
    // 4. PDFs or Images (Forward base64 to Gemini)
    else if (fileNameLower.endsWith('.pdf') || file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64String = (event.target.result as string).split(',')[1];
          setSelectedOriginalBase64(base64String);
          setFileStatus({ 
            type: 'success', 
            message: `Tệp "${file.name}" đã được tải lên và sẵn sàng phân tích trực tiếp bằng AI!` 
          });
        } else {
          setFileStatus({ 
            type: 'error', 
            message: "Không thể đọc dữ liệu tệp." 
          });
        }
      };
      reader.onerror = () => {
        setFileStatus({ type: 'error', message: "Lỗi khi đọc tệp tin." });
      };
      reader.readAsDataURL(file);
    }
    // 5. Unsupported files
    else {
      setFileStatus({ 
        type: 'error', 
        message: `Định dạng tệp "${file.name}" chưa được hỗ trợ. Vui lòng tải file .docx, .txt, .pdf, .json hoặc file Ảnh.` 
      });
    }
  };

  const handleOriginalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  // Connect Setup Wizard directly to server backend
  const handleActivate = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Build request parameters
      const payload = {
        originalPlan: generationMode === 'edit_original' ? {
          title: lessonPlan.title,
          subject: lessonPlan.subject,
          grade: lessonPlan.grade,
          numberOfPeriods: lessonPlan.numberOfPeriods,
          competencies: lessonPlan.competencies
        } : null,
        pastedText: pastedText,
        fileData: selectedOriginalBase64 || null,
        mimeType: selectedOriginalFile?.type || null,
        requireNLS,
        grade: lessonPlan.grade,
        subject: lessonPlan.subject,
        isEnglish
      };

      const response = await fetch('/api/analyze-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server error during AI processing');
      }

      const structuredPlan = await response.json();
      
      // Update state with parsed lesson plan
      setLessonPlan(prev => ({
        ...prev,
        ...structuredPlan,
        // merge manually added competencies if any
        competencies: [
          ...prev.competencies,
          ...structuredPlan.competencies.filter((c: Competency) => !prev.competencies.some(existing => existing.level === c.level))
        ],
        // keep attachments
        attachments: selectedOriginalFile ? [
          ...(prev.attachments || []),
          {
            name: selectedOriginalFile.name,
            type: selectedOriginalFile.type,
            dataUrl: `data:${selectedOriginalFile.type};base64,${selectedOriginalBase64}`
          }
        ] : prev.attachments
      }));

      setIsProcessing(false);
      onComplete();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Lỗi xảy ra trong quá trình xử lý AI. Vui lòng thử lại!');
      setIsProcessing(false);
    }
  };

  const exportNLSForm = (format: string, competencies: Competency[], title: string) => {
    if (!competencies || competencies.length === 0) return;
    
    // Dynamic export trigger
    import('../App.js').then((module) => {
      // we can delegate or write inline
    });

    // Inline implementation of Export NLS
    const competenciesData = competencies.map(comp => {
      const prefix = comp.componentTitle ? comp.componentTitle.split('.')[0] : '';
      const domain = NLS_DOMAINS.find(d => d.startsWith(prefix)) || '';
      return {
        domain,
        component: comp.componentTitle || '',
        code: comp.level || '',
        desc: comp.desc || ''
      };
    });

    const fileNameBase = `Bieu_Mau_NLS_${title || 'Giao_An'}`;

    if (format === 'excel') {
      let csvContent = "\ufeffNăng lực số,Năng lực thành phần,Mã hóa,Chỉ báo\n";
      competenciesData.forEach(row => {
        csvContent += `"${row.domain}","${row.component}","${row.code}","${row.desc.replace(/"/g, '""')}"\n`;
      });
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileNameBase}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'word') {
      const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Biểu mẫu NLS</title><style>table {border-collapse: collapse; width: 100%;} th, td {border: 1px solid black; padding: 8px; text-align: left; vertical-align: top;}</style></head><body>";
      const footer = "</body></html>";
      let content = `<h2 style="text-align: center;">BIỂU MẪU YÊU CẦU NĂNG LỰC SỐ</h2>`;
      content += `<table><thead><tr><th>Năng lực số</th><th>Năng lực thành phần</th><th>Mã hóa</th><th>Chỉ báo</th></tr></thead><tbody>`;
      competenciesData.forEach(row => {
        content += `<tr><td>${row.domain}</td><td>${row.component}</td><td><strong>${row.code}</strong></td><td>${row.desc}</td></tr>`;
      });
      content += `</tbody></table>`;
      
      const sourceHTML = header + content + footer;
      const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
      const fileDownload = document.createElement("a");
      document.body.appendChild(fileDownload);
      fileDownload.href = source;
      fileDownload.download = `${fileNameBase}.doc`;
      fileDownload.click();
      document.body.removeChild(fileDownload);
    } else if (format === 'pdf') {
      const printWindow = window.open('', '', 'height=800,width=1000');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Biểu mẫu Năng lực số</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h2 { text-align: center; color: #333; margin-bottom: 20px; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; vertical-align: top; }
                th { background-color: #f8f9fa; font-weight: bold; }
                @media print {
                  @page { margin: 1cm; }
                  body { padding: 0; }
                }
              </style>
            </head>
            <body>
              <h2>BIỂU MẪU YÊU CẦU NĂNG LỰC SỐ</h2>
              <table>
                <thead>
                  <tr>
                    <th style="width: 20%;">Năng lực số</th>
                    <th style="width: 30%;">Năng lực thành phần</th>
                    <th style="width: 10%;">Mã hóa</th>
                    <th style="width: 40%;">Chỉ báo</th>
                  </tr>
                </thead>
                <tbody>
                  ${competenciesData.map(row => `
                    <tr>
                      <td>${row.domain}</td>
                      <td>${row.component}</td>
                      <td><strong>${row.code}</strong></td>
                      <td>${row.desc}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 px-4">
      
      {/* ERROR MESSAGE IF ANY */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3 shadow-sm animate-in fade-in duration-300">
          <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold text-sm">Lỗi xử lý AI</h4>
            <p className="text-sm mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* BOX 1: THÔNG TIN BÀI DẠY */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mt-6">
        <h2 className="flex items-center text-lg font-bold text-slate-800 mb-6">
          <Layers className="mr-2 text-purple-500" size={20} /> Thông tin bài dạy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Khối lớp (Grade)</label>
            <div className="relative">
              <input 
                type="text" 
                value={lessonPlan.grade} 
                onChange={e => setLessonPlan({...lessonPlan, grade: e.target.value})} 
                className="w-full border border-slate-200 bg-white rounded-xl p-3 pr-10 focus:border-pink-500 outline-none text-slate-700 font-medium" 
                placeholder="Ví dụ: Lớp 6, Lớp 10..."
              />
              <Layers className="absolute right-3 top-3.5 text-pink-500" size={18} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Môn học (Subject)</label>
            <div className="relative">
              <input 
                list="subject-list" 
                type="text" 
                value={lessonPlan.subject} 
                onChange={e => setLessonPlan({...lessonPlan, subject: e.target.value})} 
                className="w-full border border-slate-200 bg-white rounded-xl p-3 pr-10 focus:border-purple-500 outline-none text-slate-700 font-medium" 
                placeholder="Ví dụ: Tin học, Toán, Ngoại ngữ..."
              />
              <div className="absolute right-4 top-4.5 w-2 h-2 rounded-full bg-purple-500"></div>
              <datalist id="subject-list">
                {SUBJECTS.map((sub, idx) => <option key={idx} value={sub} />)}
              </datalist>
            </div>
          </div>
        </div>
      </div>

      {/* TABS CHUYỂN ĐỔI CHẾ ĐỘ */}
      <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
        <button 
          onClick={() => { setGenerationMode('edit_original'); setPastedText(''); }}
          className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center transition-all cursor-pointer ${generationMode === 'edit_original' ? 'bg-[#D82B71] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <FileText size={18} className="mr-2" /> CHỈNH SỬA GIÁO ÁN GỐC / FILE PDF
        </button>
        <button 
          onClick={() => { setGenerationMode('auto_sgk'); setSelectedOriginalFile(null); setSelectedOriginalBase64(''); }}
          className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center transition-all cursor-pointer ${generationMode === 'auto_sgk' ? 'bg-[#D82B71] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <BookOpen size={18} className="mr-2" /> DÁN TEXT KHBD / SGK CƠ SỞ
        </button>
      </div>

      {/* KHỐI HIỂN THỊ TÙY THEO CHẾ ĐỘ */}
      {generationMode === 'edit_original' && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in duration-300">
          <h2 className="flex items-center text-lg font-bold text-slate-800 mb-6">
            <UploadCloud className="mr-2 text-pink-500" size={20} /> Tài liệu đầu vào (Tải lên từ máy tính)
          </h2>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
                <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('original-upload')?.click()}
                    className={`border-2 border-dashed rounded-2xl h-56 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        isDragging 
                        ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' 
                        : selectedOriginalFile 
                        ? 'border-pink-300 bg-pink-50/30' 
                        : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                    }`}
                >
                    <input 
                        id="original-upload" type="file" className="hidden" accept=".pdf,image/*,.docx,.txt,.json"
                        onChange={handleOriginalFileSelect}
                    />
                    {fileStatus.type === 'loading' ? (
                        <>
                            <Loader2 className="animate-spin text-indigo-500 mb-3" size={36} />
                            <p className="font-bold text-slate-700 text-sm animate-pulse px-4 text-center">{fileStatus.message}</p>
                        </>
                    ) : selectedOriginalFile ? (
                        <>
                            <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                              <CheckCircle2 size={32} className="text-[#D82B71]" />
                            </div>
                            <p className="font-bold text-[#D82B71] text-base mb-1 line-clamp-1 px-4 text-center">{selectedOriginalFile.name}</p>
                            {fileStatus.type === 'success' && (
                              <p className="text-xs text-green-600 font-medium px-4 text-center mt-1">{fileStatus.message}</p>
                            )}
                            <span className="bg-pink-100 text-[#D82B71] text-xs font-bold px-3 py-1 rounded-full mt-2">Sẵn sàng phân tích</span>
                        </>
                    ) : (
                        <>
                            <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                              <FileUp size={32} className="text-slate-400" />
                            </div>
                            <p className="font-bold text-slate-700 mb-1 text-center">Kéo thả hoặc Click để tải tệp lên</p>
                            <p className="text-slate-400 text-xs text-center px-4 mt-1 leading-relaxed">
                              Hỗ trợ: Word (.docx), PDF, Text (.txt), JSON giáo án cũ, hoặc Ảnh chụp SGK
                            </p>
                        </>
                    )}
                </div>

                {/* File Parsing Alert Message */}
                {fileStatus.type === 'error' && (
                  <div className="mt-3 bg-red-50 border border-red-100 text-red-600 text-xs p-3 rounded-xl flex items-center gap-2">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    <span>{fileStatus.message}</span>
                  </div>
                )}
            </div>
            <div className="w-full md:w-64">
               <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl h-56 flex flex-col items-center justify-center text-slate-500 p-4">
                  <div className="bg-white p-3 rounded-full shadow-sm mb-2">
                    <Zap className="text-pink-500" size={24} />
                  </div>
                  <p className="font-bold text-slate-800 mb-1 text-center text-sm">Hỗ trợ trích xuất thông minh</p>
                  <p className="text-xs text-slate-500 text-center leading-relaxed">
                    Tải file Word/Text để trích xuất văn bản thô tức thì, hoặc tải file PDF/Ảnh để AI đọc trực tiếp bằng thị giác máy tính.
                  </p>
               </div>
            </div>
          </div>
        </div>
      )}

      {generationMode === 'auto_sgk' && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in duration-300">
            <h2 className="flex items-center text-lg font-bold text-slate-800 mb-4">
              <FileText className="mr-2 text-purple-500" size={20} /> Dán văn bản giáo án / sách giáo khoa
            </h2>
            <p className="text-slate-500 text-sm mb-4">
              Dán nội dung giáo án hiện tại hoặc tài liệu học liệu thô từ SGK để AI xử lý, tái cấu trúc và đồng bộ năng lực số.
            </p>
            <textarea 
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Dán toàn bộ nội dung giáo án thô hoặc nội dung bài học SGK tại đây..."
              className="w-full min-h-[180px] border border-slate-200 rounded-2xl p-4 focus:border-pink-500 outline-none text-slate-700 font-medium leading-relaxed bg-slate-50/50 focus:bg-white resize-y"
            ></textarea>
        </div>
      )}

      {/* BOX CHUNG: YÊU CẦU NĂNG LỰC SỐ CỤ THỂ */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center mb-6">
          <div className="relative flex items-center justify-center mr-3">
            <input 
              type="checkbox" 
              id="reqNLS" 
              checked={requireNLS} 
              onChange={() => setRequireNLS(!requireNLS)}
              className="w-6 h-6 rounded cursor-pointer accent-[#D82B71]"
            />
          </div>
          <div className="bg-pink-50 p-1.5 rounded-lg mr-3">
            <Target size={20} className="text-[#D82B71]" />
          </div>
          <div>
            <label htmlFor="reqNLS" className="text-lg font-bold text-slate-800 cursor-pointer select-none">Chỉ định Năng lực số trọng tâm (Khuyên dùng)</label>
            <p className="text-sm text-slate-400">Chọn chính xác thành phần và mức độ để AI căn chỉnh bài học theo mong muốn của bạn</p>
          </div>
        </div>

        {requireNLS && (
          <div className="animate-in fade-in duration-300 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2 uppercase">Khối / Cấp</label>
                  <select 
                    value={nlsInput.khoiLop} 
                    onChange={handleKhoiLopChange}
                    className="w-full border border-slate-200 rounded-xl p-3 outline-none text-slate-700 bg-slate-50 appearance-none focus:border-pink-500 font-medium"
                  >
                    {Object.keys(NLS_LEVELS_MAP).map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
              </div>
              <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2 uppercase">Lĩnh vực Năng lực số</label>
                  <select 
                    value={nlsInput.nangLucSo} 
                    onChange={handleNangLucSoChange}
                    className="w-full border border-slate-200 rounded-xl p-3 outline-none text-slate-700 bg-slate-50 appearance-none focus:border-pink-500 font-medium truncate"
                  >
                    {NLS_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8">
                  <label className="block text-xs font-bold text-slate-600 mb-2 uppercase">Năng lực thành phần</label>
                  <select 
                    value={nlsInput.nangLucThanhPhan} 
                    onChange={handleNangLucThanhPhanChange}
                    className="w-full border border-slate-200 rounded-xl p-3 outline-none text-slate-700 bg-slate-50 appearance-none focus:border-pink-500 font-medium truncate"
                  >
                    {(NLS_COMPONENTS_BY_DOMAIN[nlsInput.nangLucSo] || []).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
              </div>
              <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-slate-600 mb-2 uppercase">Mã chỉ báo (Mã hóa)</label>
                  <select 
                    value={nlsInput.maHoa} 
                    onChange={handleMaHoaChange}
                    className="w-full border border-slate-200 rounded-xl p-3 outline-none text-slate-700 bg-slate-50 appearance-none focus:border-pink-500 font-bold text-pink-700"
                  >
                    {availableMaHoa.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
              </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase">Nội dung chỉ báo tương ứng</label>
                <textarea 
                  value={nlsInput.chiBao} 
                  onChange={handleChiBaoChange}
                  className="w-full border border-slate-200 rounded-xl p-4 outline-none text-slate-700 bg-slate-50 focus:border-pink-500 resize-y min-h-[80px] leading-relaxed font-medium"
                  placeholder="Mô tả chỉ báo..."
                ></textarea>
            </div>

            <div className="flex justify-end">
                <button 
                  onClick={handleAddNLS}
                  className="bg-[#D82B71] hover:bg-[#C02462] text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center shadow-md shadow-pink-200 cursor-pointer"
                >
                  <Plus size={18} className="mr-2" /> Thêm vào Giáo án
                </button>
            </div>

            {/* DANH SÁCH ĐÃ CHỌN KÈM NÚT XUẤT BIỂU MẪU */}
            {lessonPlan.competencies.length > 0 && (
              <div className="mt-8 border-t border-slate-100 pt-6">
                <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase">DANH SÁCH NĂNG LỰC SỐ ĐÃ CHỌN ({lessonPlan.competencies.length})</h4>
                <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-4">
                  {lessonPlan.competencies.map((comp, idx) => {
                    const prefix = comp.componentTitle ? comp.componentTitle.split(' ')[0] : '';
                    const titleText = comp.componentTitle ? comp.componentTitle.substring(prefix.length).trim() : '';

                    return (
                      <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 relative mb-3 last:mb-0 shadow-sm flex flex-col group">
                        <div className="flex items-center mb-2 pr-8">
                          <span className="bg-pink-100 text-[#D82B71] text-xs font-bold px-2 py-1 rounded mr-3 whitespace-nowrap">
                            {comp.level}
                          </span>
                          <span className="text-slate-600 text-sm font-semibold truncate flex-1" title={titleText}>
                            {titleText}
                          </span>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed">{comp.desc}</p>
                        <button 
                          onClick={() => setLessonPlan(prev => ({...prev, competencies: prev.competencies.filter((_, i) => i !== idx)}))} 
                          className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    );
                  })}
                  
                  {/* BỘ NÚT TẢI BIỂU MẪU ĐỘC LẬP */}
                  <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between">
                    <span className="text-sm font-bold text-slate-600 mb-3 sm:mb-0 flex items-center">
                      <Download size={16} className="mr-2 text-pink-600" /> Xuất biểu mẫu yêu cầu Năng lực số:
                    </span>
                    <div className="flex space-x-2 w-full sm:w-auto">
                      <button onClick={() => exportNLSForm('word', lessonPlan.competencies, lessonPlan.title)} className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-semibold text-sm transition-colors border border-blue-200 cursor-pointer">
                        <FileText size={16} className="mr-1.5" /> Word
                      </button>
                      <button onClick={() => exportNLSForm('excel', lessonPlan.competencies, lessonPlan.title)} className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-semibold text-sm transition-colors border border-emerald-200 cursor-pointer">
                        <Table size={16} className="mr-1.5" /> Excel
                      </button>
                      <button onClick={() => exportNLSForm('pdf', lessonPlan.competencies, lessonPlan.title)} className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-semibold text-sm transition-colors border border-rose-200 cursor-pointer">
                        <Printer size={16} className="mr-1.5" /> PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOX CHUNG 2: ENGLISH & SUBMIT */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center">
        <input 
          type="checkbox" 
          id="isEnglish" 
          checked={isEnglish} 
          onChange={() => setIsEnglish(!isEnglish)}
          className="w-5 h-5 rounded border-slate-300 mr-3 accent-[#D82B71] cursor-pointer" 
        />
        <label htmlFor="isEnglish" className="text-slate-700 cursor-pointer font-bold select-none text-sm">Viết/Xuất bản Giáo án bằng Tiếng Anh (English Version)</label>
      </div>

      <button 
        onClick={handleActivate}
        disabled={isProcessing || (generationMode === 'edit_original' && !selectedOriginalFile && !pastedText && lessonPlan.grade === '')}
        className={`w-full font-bold text-lg py-5 rounded-2xl shadow-lg flex items-center justify-center uppercase tracking-wide transition-all transform cursor-pointer ${
          isProcessing
          ? 'bg-slate-300 text-slate-500 shadow-none cursor-not-allowed'
          : 'bg-gradient-to-r from-pink-600 to-red-500 hover:from-pink-700 hover:to-red-600 text-white hover:scale-[1.01] shadow-pink-200'
        }`}
      >
        {isProcessing ? <Loader2 size={24} className="animate-spin mr-3" /> : <Zap size={24} className="mr-3" />}
        {isProcessing ? 'ĐANG PHÂN TÍCH VÀ ĐỒNG BỘ NLS...' : 'KÍCH HOẠT PHÂN TÍCH AI & GHÉP NLS'}
      </button>
    </div>
  );
}
