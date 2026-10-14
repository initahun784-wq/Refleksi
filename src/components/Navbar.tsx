import React from 'react';
import { BookOpen, MessageSquare, ShieldCheck, Award, UserCheck, Plus, GraduationCap } from 'lucide-react';
import { Student } from '../types';

interface NavbarProps {
  activeTab: 'journals' | 'forum' | 'pillars' | 'teacher';
  setActiveTab: (tab: 'journals' | 'forum' | 'pillars' | 'teacher') => void;
  currentUser: { isTeacher: boolean; student?: Student };
  onOpenUploadModal: () => void;
  onOpenProfileModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenUploadModal,
  onOpenProfileModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <span className="tracking-tighter">XI</span>
            </div>
            <button 
              onClick={() => setActiveTab('journals')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors whitespace-nowrap block">
                Refleksi PPKn XI
              </span>
              <span className="text-xs text-slate-500 hidden sm:block whitespace-nowrap">
                Ruang Jurnal & Demokrasi Siswa
              </span>
            </button>
          </div>

          {/* Zone 2: 4-5 Navigation Links (Clean single-line text with active state) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('journals')}
              className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'journals'
                  ? 'text-blue-700 font-semibold border-b-2 border-blue-700'
                  : 'hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Jurnal Mingguan</span>
            </button>

            <button
              onClick={() => setActiveTab('forum')}
              className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'forum'
                  ? 'text-blue-700 font-semibold border-b-2 border-blue-700'
                  : 'hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Forum Demokrasi</span>
            </button>

            <button
              onClick={() => setActiveTab('pillars')}
              className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'pillars'
                  ? 'text-blue-700 font-semibold border-b-2 border-blue-700'
                  : 'hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Materi & Konsep Buku</span>
            </button>

            <button
              onClick={() => setActiveTab('teacher')}
              className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'teacher'
                  ? 'text-blue-700 font-semibold border-b-2 border-blue-700'
                  : 'hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Rekap Penilaian</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action & Profile Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Role / User Button */}
            <button
              onClick={onOpenProfileModal}
              title="Ganti Profil Siswa / Mode Guru"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer border border-slate-200"
            >
              {currentUser.isTeacher ? (
                <>
                  <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
                  <span className="font-semibold text-blue-900 truncate max-w-[110px] sm:max-w-none">
                    Drs. Supriyanto (Guru)
                  </span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate max-w-[120px] sm:max-w-none font-semibold">
                    {currentUser.student?.name.split(' ').slice(0, 2).join(' ')} (#{currentUser.student?.absenNumber} · {currentUser.student?.classGroup})
                  </span>
                </>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenUploadModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
            >
              <Plus className="w-4 h-4" />
              <span>Unggah Jurnal</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs text-slate-600">
          <button
            onClick={() => setActiveTab('journals')}
            className={`py-1 px-2 font-medium ${activeTab === 'journals' ? 'text-blue-700 font-bold' : ''}`}
          >
            Jurnal
          </button>
          <button
            onClick={() => setActiveTab('forum')}
            className={`py-1 px-2 font-medium ${activeTab === 'forum' ? 'text-blue-700 font-bold' : ''}`}
          >
            Forum
          </button>
          <button
            onClick={() => setActiveTab('pillars')}
            className={`py-1 px-2 font-medium ${activeTab === 'pillars' ? 'text-blue-700 font-bold' : ''}`}
          >
            Materi Buku
          </button>
          <button
            onClick={() => setActiveTab('teacher')}
            className={`py-1 px-2 font-medium ${activeTab === 'teacher' ? 'text-blue-700 font-bold' : ''}`}
          >
            Penilaian
          </button>
        </div>
      </div>
    </header>
  );
};
