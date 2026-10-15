import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface TeacherAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TEACHER_SECRET_CODE = '11a1b13c';

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim();

    if (cleanCode === TEACHER_SECRET_CODE) {
      setError(null);
      setCode('');
      onSuccess();
    } else {
      setError('Kode khusus salah! Akses ini dilindungi dan hanya diketahui oleh Bapak Jamal Akmalludin,S.Pd.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="teacher-auth-title"
      >
        <button
          onClick={() => {
            setError(null);
            setCode('');
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xs font-bold text-blue-700 uppercase tracking-wider block">
              Otorisasi Guru PPKn
            </span>
            <h3 id="teacher-auth-title" className="text-lg font-bold text-slate-900 leading-tight">
              Akses Khusus Dashboard Guru
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-5">
          Halaman rekapitulasi penilaian portofolio dan rubrik siswa Kelas XI-B 
          dilindungi kode khusus guru. Silakan masukkan kode rahasia pengampu 
          (<strong>Jamal Akmalludin,S.Pd</strong>) untuk melanjutkan.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kode Khusus Guru:
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Masukkan kode rahasia guru..."
                className={`w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border rounded-xl font-mono tracking-wider focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  error
                    ? 'border-rose-400 focus:ring-rose-200 text-rose-900 bg-rose-50/50'
                    : 'border-slate-300 focus:ring-blue-600 focus:border-blue-600 text-slate-900'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showPassword ? 'Sembunyikan kode' : 'Lihat kode'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <div className="flex items-start gap-1.5 mt-2 text-rose-600 text-xs font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setCode('');
                onClose();
              }}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Buka Akses Guru</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
