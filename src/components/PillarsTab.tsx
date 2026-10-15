import React, { useState } from 'react';
import { 
  DEMOCRACY_PILLARS, 
  AFFAN_GAFFAR_INDICATORS, 
  CONSTITUTION_PERIODS, 
  BOOK_SELF_ASSESSMENT_ITEMS 
} from '../data/initialData';
import { 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  Scale, 
  Clock, 
  RotateCcw,
  Check,
  Award,
  Sparkles
} from 'lucide-react';
import { SelfAssessmentItem } from '../types';

interface QuizQuestion {
  id: number;
  scenario: string;
  question: string;
  options: { text: string; isCorrect: boolean; explanation: string }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    scenario: 'Berdasarkan riset Economist Intelligence Unit (EIU) 2022 pada Halaman 56 Buku Teks, Indonesia meraih skor 6,71 (demokrasi lemah / flawed democracy) dengan penurunan terendah pada budaya politik (4,38).',
    question: 'Berdasarkan buku teks, apa faktor utama yang menyebabkan budaya politik demokratis masyarakat masih lemah di era keterbukaan informasi?',
    options: [
      {
        text: 'Kurangnya peraturan perundang-undangan baru tentang kepemilikan gawai.',
        isCorrect: false,
        explanation: 'Kurang tepat. Permasalahannya bukan pada ketiadaan aturan perangkat, melainkan pada perilaku dan budaya literasi pengguna.',
      },
      {
        text: 'Rendahnya budaya literasi dan kebiasaan membagikan informasi tanpa saring sehingga memicu konflik dan intoleransi.',
        isCorrect: true,
        explanation: 'Tepat! Halaman 63 buku teks menjelaskan bahwa rendahnya budaya literasi di tengah derasnya arus informasi memperparah polarisasi dan melemahkan budaya politik demokratis.',
      },
      {
        text: 'Terlalu banyaknya partai politik yang mengikuti pemilihan umum.',
        isCorrect: false,
        explanation: 'Multipartai adalah bagian dari indikator hak berserikat (Affan Gaffar), bukan faktor pelemah budaya politik jika diiringi kedewasaan berdemokrasi.',
      },
    ],
  },
  {
    id: 2,
    scenario: 'Dalam sejarah ketatanegaraan Indonesia (Halaman 34-35 Buku Teks), Mohammad Hatta menyebutkan bahwa demokrasi asli Indonesia berakar dari desa.',
    question: 'Tradisi manakah yang mencerminkan praktik musyawarah mufakat asli di Minangkabau (Sumatera Barat)?',
    options: [
      {
        text: 'Rembug desa',
        isCorrect: false,
        explanation: 'Rembug desa adalah tradisi musyawarah yang berasal dari masyarakat Jawa.',
      },
      {
        text: 'Tudang sipulung',
        isCorrect: false,
        explanation: 'Tudang sipulung adalah tradisi duduk bersama bermusyawarah di Sulawesi Selatan.',
      },
      {
        text: 'Kerapatan adat nagari',
        isCorrect: true,
        explanation: 'Benar! Buku teks hlm. 35 menegaskan: rembug desa di Jawa, kerapatan adat nagari di Sumatera Barat, riungan di Jawa Barat, dan tudang sipulung di Sulawesi Selatan.',
      },
    ],
  },
  {
    id: 3,
    scenario: 'Pada Sidang MPR yang melakukan amandemen UUD 1945 (Halaman 54 Buku Teks), disepakati lima kesepakatan dasar.',
    question: 'Mengapa Pembukaan UUD NRI 1945 disepakati untuk TIDAK BOLEH diubah selamanya?',
    options: [
      {
        text: 'Karena memuat dasar filosofis (staatsidee) berdirinya NKRI, tujuan negara, dan dasar negara Pancasila.',
        isCorrect: true,
        explanation: 'Sangat tepat! Hlm. 54 buku teks menyebutkan bahwa mengubah Pembukaan sama artinya dengan membubarkan negara proklamasi yang didirikan pada 17 Agustus 1945.',
      },
      {
        text: 'Karena jumlah kata dalam Pembukaan terlalu sedikit untuk diamandemen.',
        isCorrect: false,
        explanation: 'Alasannya bukan soal teknis jumlah kata, melainkan kedudukan fundamental Pembukaan sebagai norma dasar tertinggi (staatsfundamentalnorm).',
      },
      {
        text: 'Karena anggota MPR tidak memiliki hak mengajukan usul perubahan naskah.',
        isCorrect: false,
        explanation: 'MPR memiliki wewenang mengubah UUD menurut Pasal 3 dan Pasal 37, namun ada kesepakatan dasar untuk menjaga Pembukaan dan bentuk NKRI.',
      },
    ],
  },
];

export const PillarsTab: React.FC = () => {
  const [activeSubtab, setActiveSubtab] = useState<'periodisasi' | 'amandemen' | 'pillars' | 'penilaiandiri' | 'quiz'>('periodisasi');
  const [selectedPillar, setSelectedPillar] = useState<number>(1);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  
  // State for Tabel 2.5 Penilaian Diri Perilaku Demokratis
  const [selfAssessment, setSelfAssessment] = useState<Record<number, { freq: string; reason: string }>>({
    1: { freq: 'Sering', reason: 'Selalu mendengarkan pertimbangan orang tua dan saudara' },
    2: { freq: 'Selalu', reason: 'Mengerjakan giliran piket cuci piring dan membersihkan kamar' },
    3: { freq: 'Sering', reason: 'Belajar kompromi saat memilih menu makan atau acara TV' },
    4: { freq: 'Selalu', reason: 'Berteman akrab dengan teman berbeda suku dan latar belakang' },
    5: { freq: 'Sering', reason: 'Menerima hasil voting ketua kelas meskipun pilihan saya kalah' },
    6: { freq: 'Selalu', reason: 'Menolak tawaran provokasi atau saling ejek antarsekolah' },
    7: { freq: 'Sering', reason: 'Menyampaikan saran kegiatan 17 Agustus di karang taruna RT' },
    8: { freq: 'Selalu', reason: 'Hening dan mendengarkan ketika warga lain berbicara' },
    9: { freq: 'Sering', reason: 'Menahan diri tidak menyela saat teman sedang presentasi' },
    10: { freq: 'Selalu', reason: 'Mempersilakan teman yang pendiam mengutarakan idenya' },
  });

  const activePillarData = DEMOCRACY_PILLARS.find((p) => p.number === selectedPillar) || DEMOCRACY_PILLARS[0];

  const handleSelectOption = (qId: number, optIdx: number) => {
    setQuizAnswers({ ...quizAnswers, [qId]: optIdx });
  };

  const handleUpdateSelfAssessment = (id: number, freq: string, reason?: string) => {
    setSelfAssessment({
      ...selfAssessment,
      [id]: {
        freq,
        reason: reason !== undefined ? reason : selfAssessment[id]?.reason || '',
      },
    });
  };

  // Calculate self assessment democratic score
  const freqScores: Record<string, number> = {
    Selalu: 4,
    Sering: 3,
    'Kadang-Kadang': 2,
    'Tidak Pernah': 1,
  };

  const calculatedSelfScore = Math.round(
    (Object.values(selfAssessment).reduce(
      (acc, item) => acc + (freqScores[item.freq] || 0),
      0
    ) / 40) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header with textbook citation */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="text-xs font-semibold text-blue-800 tracking-wide mb-1">
          <span>MATERI & SUMBER RUJUKAN RESMI</span>
          <span className="mx-2" aria-hidden="true">·</span>
          <span>BUKU SISWA PENDIDIKAN PANCASILA KELAS XI (KEMENDIKBUDRISTEK & BPIP 2023)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Pusat Konsep Demokrasi & Konstitusi UUD NRI 1945
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
          Disusun berdasarkan karya Jamal Akmalludin,S.Pd. Memuat materi periodisasi konstitusi, 
          amandemen UUD 1945, 10 pilar demokrasi Prof. Ahmad Sanusi, serta instrumen penilaian diri sikap demokratis (Tabel 2.5).
        </p>

        {/* Subtab Segmented Control */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg mt-5 text-xs font-medium">
          <button
            onClick={() => setActiveSubtab('periodisasi')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeSubtab === 'periodisasi'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Periodisasi & 5 Indikator Demokrasi
          </button>

          <button
            onClick={() => setActiveSubtab('amandemen')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeSubtab === 'amandemen'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Amandemen UUD 1945 & Kesepakatan MPR
          </button>

          <button
            onClick={() => setActiveSubtab('pillars')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeSubtab === 'pillars'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. 10 Pilar Demokrasi Ahmad Sanusi
          </button>

          <button
            onClick={() => setActiveSubtab('penilaiandiri')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeSubtab === 'penilaiandiri'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            4. Penilaian Diri Sikap Demokratis (Tabel 2.5)
          </button>

          <button
            onClick={() => setActiveSubtab('quiz')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeSubtab === 'quiz'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            5. Uji Nalar Demokrasi
          </button>
        </div>
      </div>

      {/* SUBTAB 1: Periodisasi & 5 Indikator Affan Gaffar */}
      {activeSubtab === 'periodisasi' && (
        <div className="space-y-6">
          {/* 5 Indikator Affan Gaffar */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-700" />
              <h3 className="text-base font-bold text-slate-900">
                5 Indikator Negara Demokrasi menurut Affan Gaffar (Buku hlm. 36)
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              Apakah betul Indonesia telah menerapkan sistem yang demokratis? Affan Gaffar merumuskan lima indikator tolak ukur:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {AFFAN_GAFFAR_INDICATORS.map((ind, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{ind.name}</h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{ind.definition}</p>
                  <div className="pt-2 border-t border-slate-200 text-2xs text-blue-900 bg-blue-50/50 p-2 rounded">
                    <strong>Contoh di Sekolah:</strong> {ind.example}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Periodisasi Konstitusi */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-700" />
              <h3 className="text-base font-bold text-slate-900">
                Periodisasi Pemberlakuan Undang-Undang Dasar di Indonesia (Buku hlm. 37-54)
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              Pelaksanaan kehidupan demokrasi di Indonesia dari masa ke masa melalui pemberlakuan konstitusi:
            </p>

            <div className="space-y-3 pt-2">
              {CONSTITUTION_PERIODS.map((period, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs">
                    <span className="font-bold text-slate-900 text-sm">{period.name}</span>
                    <span className="font-mono text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {period.period}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{period.characteristics}</p>
                </div>
              ))}
            </div>

            {/* Demokrasi Asli Desa Box */}
            <div className="mt-4 p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs space-y-1 text-emerald-950">
              <span className="font-bold block">Demokrasi Asli Indonesia menurut Mohammad Hatta (Buku hlm. 34-35):</span>
              <p className="leading-relaxed">
                Indonesia sejak dahulu telah menjalankan demokrasi asli desa melalui budaya musyawarah mufakat, seperti:
                <strong> rembug desa</strong> di Jawa, <strong>kerapatan adat nagari</strong> di Sumatera Barat, 
                <strong> riungan</strong> di Jawa Barat, dan <strong>tudang sipulung</strong> di Sulawesi Selatan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Amandemen UUD 1945 */}
      {activeSubtab === 'amandemen' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
            <div>
              <span className="text-xs font-bold text-blue-800 block mb-1">
                BAB 2 SUBBAB B (BUKU HLMN 46-54)
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Latar Belakang, Prosedur Pasal 37, dan 5 Kesepakatan Dasar MPR
              </h3>
            </div>

            {/* Dasar Pemikiran */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase">
                5 Dasar Pemikiran Mengapa UUD 1945 Diamandemen (MPR RI, 2012: 9-11):
              </h4>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-5 leading-relaxed">
                <li>Struktur ketatanegaraan sebelumnya bertumpu pada kekuasaan tertinggi MPR sehingga tidak ada <em>checks and balances</em> antarlembaga negara.</li>
                <li>Memberikan kekuasaan yang terlalu besar kepada pemegang kekuasaan eksekutif (Presiden).</li>
                <li>Mengandung pasal-pasal yang multitafsir atau berpotensi arti ganda.</li>
                <li>Memberikan kewenangan sangat besar kepada Presiden untuk mengatur hal-hal penting dengan undang-undang.</li>
                <li>Rumusan tentang demokrasi, supremasi hukum, pemberdayaan rakyat, dan HAM belum cukup didukung ketentuan konstitusi.</li>
              </ul>
            </div>

            {/* 5 Kesepakatan Dasar MPR */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase">
                5 Kesepakatan Dasar MPR dalam Perubahan UUD 1945 (Buku hlm. 54):
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200">
                  <span className="font-bold text-blue-900 block mb-1">1. Tidak Mengubah Pembukaan</span>
                  <p className="text-slate-700">Karena memuat dasar filosofis (staatsidee), tujuan bernegara, dan dasar negara Pancasila.</p>
                </div>
                <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200">
                  <span className="font-bold text-blue-900 block mb-1">2. Mempertahankan NKRI</span>
                  <p className="text-slate-700">Bentuk kesatuan paling cocok untuk mewadahi persatuan bangsa yang majemuk.</p>
                </div>
                <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200">
                  <span className="font-bold text-blue-900 block mb-1">3. Mempertegas Sistem Presidensial</span>
                  <p className="text-slate-700">Memperkokoh sistem pemerintahan yang stabil, akuntabel, dan dipilih langsung rakyat.</p>
                </div>
                <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200">
                  <span className="font-bold text-blue-900 block mb-1">4. Menghapus Penjelasan UUD</span>
                  <p className="text-slate-700">Hal-hal normatif yang ada dalam Penjelasan dimasukkan ke dalam pasal-pasal batang tubuh.</p>
                </div>
                <div className="md:col-span-2 p-3 bg-blue-50/50 rounded-lg border border-blue-200">
                  <span className="font-bold text-blue-900 block mb-1">5. Perubahan Dilakukan Secara Adendum</span>
                  <p className="text-slate-700">Tetap mempertahankan naskah asli UUD 1945, di mana naskah perubahan diletakkan melekat pada naskah aslinya.</p>
                </div>
              </div>
            </div>

            {/* 4 Tahap Amandemen */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase">
                Hasil 4 Tahap Perubahan UUD NRI Tahun 1945 (1999-2002):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-900">Perubahan I (14-21 Okt 1999)</span>
                  <p className="text-slate-600 text-2xs mt-0.5">Membatasi kekuasaan Presiden dan pemberdayaan DPR (9 pasal, 13 ayat).</p>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-900">Perubahan II (Sidang MPR 2000)</span>
                  <p className="text-slate-600 text-2xs mt-0.5">Pemerintah daerah, HAM Pasal 28A-28J, wilayah negara, dan atribut negara.</p>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-900">Perubahan III (1-9 Nov 2001)</span>
                  <p className="text-slate-600 text-2xs mt-0.5">Pilpres langsung, pembentukan MK, Komisi Yudisial, DPD, dan BPK.</p>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-900">Perubahan IV (1-12 Agt 2002)</span>
                  <p className="text-slate-600 text-2xs mt-0.5">Penghapusan DPA, Dewan Pertimbangan Presiden, Bank Sentral, sistem jaminan sosial, pendidikan dasar.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: 10 Pilar Demokrasi Ahmad Sanusi */}
      {activeSubtab === 'pillars' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-3 space-y-1 shadow-2xs">
            <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              10 Pilar Demokrasi (Buku hlm. 63-64)
            </div>
            {DEMOCRACY_PILLARS.map((pillar) => {
              const isSelected = pillar.number === selectedPillar;
              return (
                <button
                  key={pillar.number}
                  onClick={() => setSelectedPillar(pillar.number)}
                  className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 text-blue-900 border border-blue-200 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {pillar.number}
                  </span>
                  <span className="text-xs sm:text-sm line-clamp-1">{pillar.title}</span>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="border-b border-slate-200 pb-5">
              <span className="text-xs font-bold text-blue-800 tracking-wide block mb-1">
                PILAR KE-{activePillarData.number} DARI 10
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {activePillarData.title}
              </h3>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="text-2xs font-bold text-slate-500 uppercase block mb-1">
                Kutipan Teori Konstitusi
              </span>
              <blockquote className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                "{activePillarData.founderQuote}"
              </blockquote>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Makna Konstitusional dalam Bernegara
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activePillarData.explanation}
              </p>
            </div>

            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-200 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-blue-700" />
                <span>Penerapan Nyata di Lingkungan Siswa & Sekolah</span>
              </div>
              <p className="text-xs sm:text-sm text-blue-950 leading-relaxed">
                {activePillarData.schoolApplication}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: Penilaian Diri Sikap Demokratis (Tabel 2.5 Buku hlm. 65-66) */}
      {activeSubtab === 'penilaiandiri' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-700" />
                <h3 className="text-lg font-bold text-slate-900">
                  Tabel 2.5 Daftar Perilaku Demokratis (Penilaian Diri Siswa)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Sumber: Buku Siswa Pendidikan Pancasila Kelas XI Halaman 65-66. Lakukan evaluasi jujur terhadap sikap harianmu.
              </p>
            </div>

            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200 text-center shrink-0">
              <span className="text-2xs text-blue-800 font-semibold uppercase block">Indeks Sikap Demokratis</span>
              <span className="text-xl font-bold text-blue-950 tabular-nums">{calculatedSelfScore} / 100</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Pilihlah frekuensi tindakan (Selalu, Sering, Kadang-Kadang, Tidak Pernah) dan sertakan alasan/refleksi nyata:
            </p>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
              {BOOK_SELF_ASSESSMENT_ITEMS.map((item) => {
                const currentData = selfAssessment[item.id] || { freq: 'Sering', reason: '' };

                return (
                  <div key={item.id} className="p-4 bg-white hover:bg-slate-50/50 transition-colors space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-2xs font-bold flex items-center justify-center shrink-0">
                          {item.id}
                        </span>
                        <span>{item.behavior}</span>
                      </div>

                      {/* Frequency buttons */}
                      <div className="flex items-center gap-1 shrink-0 text-2xs">
                        {(['Selalu', 'Sering', 'Kadang-Kadang', 'Tidak Pernah'] as const).map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleUpdateSelfAssessment(item.id, opt)}
                            className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                              currentData.freq === opt
                                ? 'bg-blue-700 text-white font-bold'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Reason input */}
                    <input
                      type="text"
                      placeholder="Tuliskan alasan / contoh nyata sikapmu..."
                      value={currentData.reason}
                      onChange={(e) => handleUpdateSelfAssessment(item.id, currentData.freq, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950">
              <span className="font-bold block mb-1">Catatan Pedagogis Buku Teks (hlm. 67):</span>
              <p>
                "Apabila jawaban kalian <em>Kadang-Kadang</em> atau <em>Tidak Pernah</em> pada kolom perilaku tersebut, 
                kalian harus mengubah perilaku agar lebih baik. Sebaliknya, apabila jawaban kalian <em>Selalu</em> atau 
                <em>Sering</em>, pertahankan dan wujudkan sikap tersebut dalam kehidupan sehari-hari."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: Quiz Bernalar Kritis */}
      {activeSubtab === 'quiz' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-700" />
                <h3 className="text-lg font-bold text-slate-900">
                  Uji Nalar Demokrasi Berdasarkan Studi Kasus Buku Teks
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Menguji alur bernalar kritis (Gambar 2.9) berdasarkan kasus aktual di Bab 2 Buku Pendidikan Pancasila.
              </p>
            </div>

            {Object.keys(quizAnswers).length > 0 && (
              <button
                onClick={() => setQuizAnswers({})}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Kuis</span>
              </button>
            )}
          </div>

          <div className="space-y-6">
            {QUIZ_QUESTIONS.map((q, qIndex) => {
              const selectedOpt = quizAnswers[q.id];
              const hasAnswered = selectedOpt !== undefined;

              return (
                <div key={q.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                  <div className="text-xs font-semibold text-blue-800">
                    SOAL {qIndex + 1} DARI {QUIZ_QUESTIONS.length}
                  </div>

                  <div className="p-3 bg-white rounded border border-slate-200 text-xs text-slate-600 italic">
                    <strong>Studi Kasus Buku Teks:</strong> "{q.scenario}"
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-slate-900">
                    {q.question}
                  </p>

                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      return (
                        <button
                          key={optIdx}
                          disabled={hasAnswered}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left p-3 rounded-lg border text-xs leading-relaxed transition-all cursor-pointer ${
                            hasAnswered
                              ? opt.isCorrect
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium'
                                : isSelected
                                ? 'bg-rose-50 border-rose-400 text-rose-950'
                                : 'bg-white border-slate-200 text-slate-500 opacity-70'
                              : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-slate-800'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="font-bold text-slate-500 shrink-0">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            <span>{opt.text}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {hasAnswered && (
                    <div
                      className={`p-3 rounded-lg text-xs leading-relaxed mt-2 ${
                        q.options[selectedOpt].isCorrect
                          ? 'bg-emerald-100/70 border border-emerald-300 text-emerald-950'
                          : 'bg-rose-100/70 border border-rose-300 text-rose-950'
                      }`}
                    >
                      <p className="font-bold mb-0.5">
                        {q.options[selectedOpt].isCorrect ? 'Jawaban Tepat!' : 'Perlu Diperbaiki:'}
                      </p>
                      <p>{q.options[selectedOpt].explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
