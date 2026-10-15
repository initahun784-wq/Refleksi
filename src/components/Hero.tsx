import React from 'react';
import { PenLine, MessageCircle, CheckCircle2, Sparkles } from 'lucide-react';

interface HeroProps {
  totalJournals: number;
  totalComments: number;
  gradedCount: number;
  onOpenUpload: () => void;
  onNavigateToForum: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  totalJournals,
  totalComments,
  gradedCount,
  onOpenUpload,
  onNavigateToForum,
}) => {
  return (
    <div className="relative bg-white border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Pedagogical Narrative & Action */}
          <div className="lg:col-span-7 space-y-5">
            <div className="text-xs font-semibold text-blue-800 tracking-wide">
              <span>KURIKULUM MERDEKA & BPIP 2023</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>BUKU TEKS UTAMA PENDIDIKAN PANCASILA KELAS XI</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight text-balance leading-snug">
              Refleksi Mingguan & Budaya Demokrasi Pancasila
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Platform refleksi dan dialog kewarganegaraan berdasarkan <strong>Buku Teks Utama Pendidikan Pancasila Kelas XI</strong> karya 
              jamal Akmalludin,S. Pd. Memadukan refleksi mingguan Model 4F dengan mimbar musyawarah deliberatif 
              seputar dinamika UUD NRI Tahun 1945 di era keterbukaan informasi.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onOpenUpload}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <PenLine className="w-4 h-4" />
                <span>Tulis Jurnal Refleksi Pekan Ini</span>
              </button>

              <button
                onClick={onNavigateToForum}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-lg border border-slate-300 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-blue-700" />
                <span>Ikuti Diskusi Topik Demokrasi</span>
              </button>
            </div>

            {/* Pedagogical pillars reminder */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Model Refleksi 4F
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Rubrik Umpan Balik Guru
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Musyawarah Deliberatif
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual from generate_image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 group">
              <img
                src="/src/assets/images/hero_demokrasi_ppkn_1791937933502.jpg"
                alt="Siswa SMA berdiskusi dan bermusyawarah di kelas PPKn"
                referrerPolicy="no-referrer"
                className="w-full h-64 sm:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  // Fallback container in case image fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                <p className="text-xs font-semibold tracking-wide text-blue-200">
                  SMAN 2 Klari · Tahun Ajaran 2026/2027
                </p>
                <p className="text-sm font-medium leading-snug">
                  "Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-metric strip below hero split */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200">
          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
            <p className="text-xs font-medium text-slate-500">Jurnal Refleksi</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums mt-1">
              {totalJournals}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Model 4F (Bab 1 - 4 Buku Teks)</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
            <p className="text-xs font-medium text-slate-500">Telah Dinilai Guru</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-700 tabular-nums mt-1">
              {gradedCount}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Rubrik Bernalar Kritis Tabel 2.4</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
            <p className="text-xs font-medium text-slate-500">Argumen Musyawarah</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-700 tabular-nums mt-1">
              {totalComments}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Studi kasus EIU, mural & amandemen</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
            <p className="text-xs font-medium text-slate-500">Pilar & Indikator</p>
            <p className="text-xl sm:text-2xl font-bold text-indigo-700 tabular-nums mt-1">
              10 Pilar
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Ahmad Sanusi & Affan Gaffar</p>
          </div>
        </div>
      </div>
    </div>
  );
};
