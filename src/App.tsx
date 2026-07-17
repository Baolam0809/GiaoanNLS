import React, { useState, useEffect } from 'react';
import { 
  Home, 
  BookOpen, 
  Search, 
  FileEdit, 
  User, 
  ShieldCheck, 
  LogOut,
  Sparkles,
  FileBadge
} from 'lucide-react';
import { LessonPlan } from './types.js';

// Import Modular Sub-views
import HomeView from './components/HomeView.js';
import LookupView from './components/LookupView.js';
import TemplatesView from './components/TemplatesView.js';
import SetupWizardView from './components/SetupWizardView.js';
import EditorView from './components/EditorView.js';
import AdminLogin from './components/AdminLogin.js';
import AdminDashboard from './components/AdminDashboard.js';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isSettingUp, setIsSettingUp] = useState<boolean>(true);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [projectLessons, setProjectLessons] = useState<LessonPlan[]>([]);
  
  // Administrator state management
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);

  // Core Lesson Plan state
  const [lessonPlan, setLessonPlan] = useState<LessonPlan>({
    id: 'default-lesson-1',
    lessonNumber: 'Bài 1',
    title: '',
    subject: '',
    grade: '',
    numberOfPeriods: '1 tiết',
    generalObjectives: '',
    competencies: [],
    materials: '',
    activities: [
      { id: Date.now(), name: 'Hoạt động 1: Khởi động', content: '' }
    ],
    attachments: []
  });

  // Verify stored session on boot
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedUser = localStorage.getItem('adminUser');
    if (storedToken && storedUser) {
      setIsAdminLoggedIn(true);
      setAdminUser(JSON.parse(storedUser));
    }
  }, []);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'builder') {
      setIsSettingUp(true);
    }
    setShowProfileMenu(false);
  };

  const handleAdminLoginSuccess = (user: any) => {
    setIsAdminLoggedIn(true);
    setAdminUser(user);
    setShowAdminLogin(false);
    setActiveTab('admin');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800">
      
      {/* HEADER NAVIGATION BAR */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => handleNavClick('home')}>
              <div className="bg-gradient-to-br from-pink-600 to-purple-600 p-2 rounded-xl mr-3 flex items-center justify-center shadow-md shadow-pink-100">
                <FileBadge className="h-5 w-5 text-white" />
              </div>
              <span className="font-black text-xl text-slate-800 tracking-tight">GiáoÁn<span className="text-pink-600">Số</span></span>
            </div>
            
            <div className="hidden md:flex space-x-2 items-center">
              <NavButton icon={<Home size={16}/>} label="Trang chủ" isActive={activeTab === 'home'} onClick={() => handleNavClick('home')} />
              <NavButton icon={<Search size={16}/>} label="Tra cứu năng lực" isActive={activeTab === 'lookup'} onClick={() => handleNavClick('lookup')} />
              <NavButton icon={<BookOpen size={16}/>} label="Kho mẫu" isActive={activeTab === 'templates'} onClick={() => handleNavClick('templates')} />
              <NavButton icon={<FileEdit size={16}/>} label="Tạo giáo án" isActive={activeTab === 'builder'} onClick={() => handleNavClick('builder')} />
              {isAdminLoggedIn && (
                <NavButton icon={<ShieldCheck size={16}/>} label="Admin" isActive={activeTab === 'admin'} onClick={() => handleNavClick('admin')} />
              )}
            </div>

            <div className="flex items-center relative gap-2">
              {isAdminLoggedIn ? (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleNavClick('admin')}
                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white shadow-md cursor-pointer`}
                  >
                    <ShieldCheck size={14} className="text-pink-500" />
                    <span>Admin</span>
                  </button>
                  <button 
                    onClick={handleAdminLogout}
                    className="p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors cursor-pointer text-slate-400"
                    title="Đăng xuất Admin"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all border text-xs font-bold cursor-pointer ${showProfileMenu ? 'bg-pink-50 text-pink-700 border-pink-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                >
                  <User size={14} className={showProfileMenu ? 'text-pink-600' : 'text-slate-500'} />
                  <span>Giáo viên</span>
                </button>
              )}
              
              {showProfileMenu && !isAdminLoggedIn && (
                <div className="absolute top-12 right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 overflow-hidden">
                  <button 
                    onClick={() => { handleNavClick('builder'); setShowProfileMenu(false); }} 
                    className="w-full text-left px-4 py-3 text-xs text-slate-700 hover:bg-pink-50 hover:text-pink-600 transition-colors font-bold cursor-pointer"
                  >
                    Giáo án của tôi
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button 
                    onClick={() => { setShowAdminLogin(true); setShowProfileMenu(false); }}
                    className="w-full text-left px-4 py-3 text-xs text-indigo-600 hover:bg-indigo-50 transition-colors font-bold cursor-pointer flex items-center gap-1"
                  >
                    <ShieldCheck size={14} /> Đăng nhập quản trị
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* CORE VIEWPORT CAROUSEL / ROUTING */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && <HomeView onNavigate={handleNavClick} />}
        {activeTab === 'lookup' && <LookupView />}
        
        {activeTab === 'builder' && (
          <div className="animate-in fade-in duration-300">
            {isSettingUp ? (
              <SetupWizardView 
                lessonPlan={lessonPlan} 
                setLessonPlan={setLessonPlan} 
                onComplete={() => setIsSettingUp(false)} 
              />
            ) : (
              <EditorView 
                lessonPlan={lessonPlan} 
                setLessonPlan={setLessonPlan} 
                projectLessons={projectLessons}
                setProjectLessons={setProjectLessons}
                onBackToSetup={() => setIsSettingUp(true)}
              />
            )}
          </div>
        )}
        
        {activeTab === 'templates' && (
          <TemplatesView 
            onNavigate={handleNavClick} 
            setLessonPlan={setLessonPlan} 
            setIsSettingUp={setIsSettingUp}
            isAdmin={isAdminLoggedIn}
          />
        )}

        {activeTab === 'admin' && isAdminLoggedIn && (
          <AdminDashboard 
            onLogout={handleAdminLogout} 
            setLessonPlan={setLessonPlan}
            setIsSettingUp={setIsSettingUp}
            onNavigate={handleNavClick}
          />
        )}
      </main>

      {/* ADMIN LOGIN MODAL PORTAL */}
      {showAdminLogin && (
        <AdminLogin 
          onLoginSuccess={handleAdminLoginSuccess}
          onClose={() => setShowAdminLogin(false)}
        />
      )}
    </div>
  );
}

// NavButton subcomponent
interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <button 
      onClick={onClick} 
      className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive ? 'bg-pink-50 text-pink-700 shadow-sm border border-pink-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
