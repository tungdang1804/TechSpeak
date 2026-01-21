
import React from 'react';
import { Mail, Lock, User, ArrowRight, Loader2, LogIn, UserPlus } from 'lucide-react';
import { useAuthForm } from '../../hooks/useAuthForm';

interface AuthModuleProps {
  onSubmit: (data: any) => Promise<void>;
}

const AuthModule: React.FC<AuthModuleProps> = ({ onSubmit }) => {
  const { mode, setMode, formData, updateField, error, loading, submit } = useAuthForm(onSubmit);

  return (
    <div className="bg-white rounded-[40px] p-8 soft-shadow border border-slate-100 animate-fade-in">
      <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
        <button onClick={() => setMode('login')} className={`flex-1 py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'login' ? 'bg-white text-app-primary shadow-sm' : 'text-slate-400'}`}>
          <LogIn size={14} /> Đăng nhập
        </button>
        <button onClick={() => setMode('register')} className={`flex-1 py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'register' ? 'bg-white text-app-primary shadow-sm' : 'text-slate-400'}`}>
          <UserPlus size={14} /> Đăng ký
        </button>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {mode === 'register' && (
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" placeholder="Tên của bạn" value={formData.name} onChange={e => updateField('name', e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-app-primary/20 outline-none transition-all"
            />
          </div>
        )}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="email" placeholder="Email chuyên ngành" value={formData.email} onChange={e => updateField('email', e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-app-primary/20 outline-none transition-all"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="password" placeholder="Mật khẩu" value={formData.password} onChange={e => updateField('password', e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-app-primary/20 outline-none transition-all"
          />
        </div>

        {error && <p className="text-[10px] font-black text-red-500 uppercase text-center px-2">{error}</p>}

        <button 
          disabled={loading}
          className="w-full py-5 bg-app-primary text-white rounded-2xl font-black shadow-xl shadow-app-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all mt-4 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : (mode === 'login' ? 'ĐĂNG NHẬP NGAY' : 'NÂNG CẤP TÀI KHOẢN')}
          {!loading && <ArrowRight size={18} />}
        </button>
      </form>
    </div>
  );
};

export default AuthModule;
