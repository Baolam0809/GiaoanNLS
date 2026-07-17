import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (adminData: any) => void;
  onClose: () => void;
}

export default function AdminLogin({ onLoginSuccess, onClose }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 1000);
      } else {
        setError(data.message || 'Đăng nhập không thành công!');
      }
    } catch (err) {
      setError('Lỗi kết nối đến máy chủ!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-8 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-red-500 font-bold cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center mb-8">
          <div className="bg-pink-50 p-3 rounded-2xl w-max mx-auto mb-4 border border-pink-100">
            <Lock className="text-[#D82B71]" size={28} />
          </div>
          <h3 className="text-2xl font-black text-slate-800">Đăng nhập Quản trị</h3>
          <p className="text-slate-400 text-sm mt-1">Sử dụng tài khoản admin để quản lý giáo án mẫu và cơ sở dữ liệu năng lực số</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 p-3.5 rounded-xl text-sm mb-6 flex items-center gap-2">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-100 text-green-700 p-3.5 rounded-xl text-sm mb-6 flex items-center gap-2">
            <CheckCircle2 size={18} className="flex-shrink-0" />
            <span>Đăng nhập thành công! Đang chuyển hướng...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tên đăng nhập</label>
            <div className="relative">
              <input 
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-pink-500 outline-none text-slate-700 transition-colors font-medium text-sm"
                placeholder="admin"
              />
              <User className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mật khẩu</label>
            <div className="relative">
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-pink-500 outline-none text-slate-700 transition-colors font-medium text-sm"
                placeholder="••••••••"
              />
              <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-3 text-amber-800 text-xs flex gap-2 border border-amber-200/50">
            <ShieldAlert size={16} className="flex-shrink-0 mt-0.5 text-amber-600" />
            <div>
              <span className="font-bold">Ghi chú kiểm thử:</span> Sử dụng tài khoản mặc định <code className="font-mono bg-amber-100 px-1 py-0.5 rounded font-bold">admin/admin</code> để truy cập.
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || success}
            className={`w-full py-3.5 rounded-xl font-bold text-white transition-all transform flex items-center justify-center cursor-pointer ${
              loading || success
              ? 'bg-slate-300 shadow-none cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:shadow-lg shadow-pink-100 hover:scale-[1.01]'
            }`}
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
