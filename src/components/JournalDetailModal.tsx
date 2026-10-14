import React, { useState } from 'react';
import { X, Printer, CheckCircle2, FileText, User, Calendar, Award, Send, BookOpen } from 'lucide-react';
import { JournalEntry, RubricCriteria, Student } from '../types';

interface JournalDetailModalProps {
  journal: JournalEntry | null;
  onClose: () => void;
  currentUser: { isTeacher: boolean; student?: Student };
  onSaveTeacherFeedback: (journalId: string, rubric: RubricCriteria, feedback: string) => void;
}

export const JournalDetailModal: React.FC<JournalDetailModalProps> = ({
  journal,
  onClose,
  currentUser,
  onSaveTeacherFeedback,
}) => {
  if (!journal) return null;

  // Rubrik Bernalar Kritis tentang Sikap Demokratis (Tabel 2.4 Buku hlm. 62)
  const [memprosesInformasi, setMemprosesInformasi] = useState<number>(
    journal.rubric?.memprosesInformasi || 4
  );
  const [menganalisisInformasi, setMenganalisisInformasi] = useState<number>(
    journal.rubric?.menganalisisInformasi || 4
  );
  const [refleksiPemikiran, setRefleksiPemikiran] = useState<number>(
    journal.rubric?.refleksiPemikiran || 4
  );
  const [mengambilKesimpulan, setMengambilKesimpulan] = useState<number>(
    journal.rubric?.mengambilKesimpulan || 4
  );
  const [feedbackText, setFeedbackText] = useState<string>(
    journal.teacherFeedback || ''
  );
  const [isEditingGrade, setIsEditingGrade] = useState<boolean>(false);

  // Perhitungan Nilai Akhir sesuai Tabel 2.4 Buku teks: Nilai = Jumlah (v) x 25 / total
  const totalCriteriaScore = memprosesInformasi + menganalisisInformasi + refleksiPemikiran + mengambilKesimpulan;
  const calculatedGrade = Math.round((totalCriteriaScore / 16) * 100);

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTeacherFeedback(
      journal.id,
      {
        memprosesInformasi,
        menganalisisInformasi,
        refleksiPemikiran,
        mengambilKesimpulan,
      },
      feedbackText
    );
    setIsEditingGrade(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const silaNames: Record<number, string> = {
    1: 'Sila 1: Ketuhanan Yang Maha Esa',
    2: 'Sila 2: Kemanusiaan yang Adil dan Beradab',
    3: 'Sila 3: Persatuan Indonesia',
    4: 'Sila 4: Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan',
    5: 'Sila 5: Keadilan Sosial bagi Seluruh Rakyat Indonesia',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 print:p-0">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-3xl w-full overflow-hidden my-6 print:border-none print:shadow-none print:my-0">
        {/* Header bar (no-print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 no-print">
          <div className="text-xs font-semibold text-slate-500">
            <span>LEMBAR PORTOFOLIO REFLEKSI SISWA</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>BUKU PENDIDIKAN PANCASILA KELAS XI (KEMENDIKBUDRISTEK 2023)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer"
              title="Cetak lembar refleksi resmi"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Printable Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[82vh] overflow-y-auto print:max-h-none print:p-6">
          {/* Document Header for Print */}
          <div className="border-b border-slate-300 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500 mb-2">
              <span className="font-semibold text-blue-900">
                PENDIDIKAN PANCASILA FASE F KELAS XI · KURIKULUM MERDEKA
              </span>
              <span>TAHUN AJARAN 2026/2027</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              {journal.topicTitle}
            </h2>

            {/* Unboxed Metadata row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-900">{journal.studentName}</span>
                <span>({journal.classGroup})</span>
              </div>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Pekan {journal.weekNumber} · {journal.date}</span>
              </div>
              <span aria-hidden="true" className="text-slate-300">·</span>
              {journal.activityRef && (
                <>
                  <div className="flex items-center gap-1.5 text-blue-800 font-medium">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{journal.activityRef}</span>
                  </div>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                </>
              )}
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Status:{' '}
                  {journal.status === 'graded' ? (
                    <strong className="text-emerald-700 font-bold">Telah Dinilai ({journal.score}/100)</strong>
                  ) : (
                    <span className="text-amber-700 font-medium">Menunggu Verifikasi Guru</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Sila Pancasila Affiliation */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Keterkaitan Nilai Pancasila (Bab 1 & Bab 2)
            </h4>
            <div className="space-y-1">
              {journal.relatedSila.map((silaNum) => (
                <div key={silaNum} className="text-xs text-slate-700 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 mt-0.5 shrink-0" />
                  <span>{silaNames[silaNum]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4F Reflection Model Sections */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Uraian Refleksi Pembelajaran Siswa (Model 4F)
            </h4>

            {/* 1. Facts */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h5 className="text-sm font-bold text-slate-900">
                  Peristiwa (Facts)
                </h5>
                <span className="text-xs text-slate-500">— Fakta materi & aktivitas yang dipelajari</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed pl-7">
                {journal.reflection.facts}
              </p>
            </div>

            {/* 2. Feelings */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h5 className="text-sm font-bold text-slate-900">
                  Perasaan (Feelings)
                </h5>
                <span className="text-xs text-slate-500">— Respon emosional & perenungan diri</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed pl-7">
                {journal.reflection.feelings}
              </p>
            </div>

            {/* 3. Findings */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h5 className="text-sm font-bold text-slate-900">
                  Pembelajaran (Findings)
                </h5>
                <span className="text-xs text-slate-500">— Konsep konstitusi & nilai demokratis</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed pl-7">
                {journal.reflection.findings}
              </p>
            </div>

            {/* 4. Future */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <h5 className="text-sm font-bold text-slate-900">
                  Penerapan Nyata (Future)
                </h5>
                <span className="text-xs text-slate-500">— Komitmen perilaku demokratis sehari-hari</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed pl-7">
                {journal.reflection.future}
              </p>
            </div>
          </div>

          {/* Lampiran Dokumentasi */}
          {journal.attachmentName && (
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Lampiran Bukti Pengamatan / Dokumen Belajar
              </h4>
              <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-lg border border-blue-200 text-xs text-blue-900">
                <FileText className="w-5 h-5 text-blue-700 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{journal.attachmentName}</p>
                  <p className="text-slate-500">Tersimpan dalam arsip portofolio digital</p>
                </div>
              </div>
            </div>
          )}

          {/* Rubrik Penilaian Bernalar Kritis tentang Sikap Demokratis (Tabel 2.4 Buku hlm. 62) */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Evaluasi Rubrik Bernalar Kritis tentang Sikap Demokratis
                </h4>
                <p className="text-2xs text-slate-500">
                  Mengacu pada Tabel 2.4 Buku Siswa Pendidikan Pancasila Kelas XI Halaman 62
                </p>
              </div>
              {currentUser.isTeacher && !isEditingGrade && (
                <button
                  onClick={() => setIsEditingGrade(true)}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900 cursor-pointer no-print"
                >
                  {journal.status === 'graded' ? 'Ubah Nilai & Catatan' : 'Beri Nilai Sekarang'}
                </button>
              )}
            </div>

            {/* Read-only Rubrik View */}
            {!isEditingGrade ? (
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-2.5 bg-white rounded border border-slate-200">
                    <p className="text-xs text-slate-500">Memproses Informasi</p>
                    <p className="text-lg font-bold text-slate-900 tabular-nums">
                      {journal.rubric?.memprosesInformasi ?? '-'} / 4
                    </p>
                  </div>
                  <div className="p-2.5 bg-white rounded border border-slate-200">
                    <p className="text-xs text-slate-500">Menganalisis Informasi</p>
                    <p className="text-lg font-bold text-slate-900 tabular-nums">
                      {journal.rubric?.menganalisisInformasi ?? '-'} / 4
                    </p>
                  </div>
                  <div className="p-2.5 bg-white rounded border border-slate-200">
                    <p className="text-xs text-slate-500">Refleksi Pemikiran</p>
                    <p className="text-lg font-bold text-slate-900 tabular-nums">
                      {journal.rubric?.refleksiPemikiran ?? '-'} / 4
                    </p>
                  </div>
                  <div className="p-2.5 bg-white rounded border border-slate-200">
                    <p className="text-xs text-slate-500">Mengambil Kesimpulan</p>
                    <p className="text-lg font-bold text-slate-900 tabular-nums">
                      {journal.rubric?.mengambilKesimpulan ?? '-'} / 4
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span className="font-semibold">Skor Akhir (Rumus Tabel 2.4: Jumlah Skor x 25):</span>
                    <span className="text-base font-bold text-blue-800 tabular-nums">
                      {journal.score ? `${journal.score} / 100` : 'Belum Dinilai'}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 mt-2">Catatan Masukan Guru:</p>
                  <p className="text-sm text-slate-700 mt-1 italic bg-white p-3 rounded border border-slate-200">
                    "{journal.teacherFeedback || 'Belum ada catatan tertulis dari guru.'}"
                  </p>
                  {journal.teacherFeedbackDate && (
                    <p className="text-xs text-slate-400 mt-1">
                      Dinilai pada: {journal.teacherFeedbackDate}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Teacher Grading Interactive Form */
              <form onSubmit={handleSaveGrade} className="bg-blue-50/60 rounded-lg p-5 border border-blue-200 space-y-4 no-print">
                <p className="text-xs font-semibold text-blue-900">
                  Formulir Penilaian Rubrik Buku Teks (Skala 1-4 tiap indikator):
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">
                      1. Memproses Informasi
                    </label>
                    <select
                      value={memprosesInformasi}
                      onChange={(e) => setMemprosesInformasi(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800"
                    >
                      <option value={4}>4 - Memproses data kualitatif/kuantitatif secara sangat objektif</option>
                      <option value={3}>3 - Memproses informasi dengan baik & runtut</option>
                      <option value={2}>2 - Pemrosesan informasi masih terbatas</option>
                      <option value={1}>1 - Informasi belum diproses secara akurat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">
                      2. Menganalisis Informasi
                    </label>
                    <select
                      value={menganalisisInformasi}
                      onChange={(e) => setMenganalisisInformasi(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800"
                    >
                      <option value={4}>4 - Mampu mengevaluasi penalaran & pasal UUD secara tajam</option>
                      <option value={3}>3 - Analisis relevan dan runtut</option>
                      <option value={2}>2 - Analisis masih bersifat deskriptif umum</option>
                      <option value={1}>1 - Belum melakukan analisis penalaran</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">
                      3. Refleksi Pemikiran & Proses Berpikir
                    </label>
                    <select
                      value={refleksiPemikiran}
                      onChange={(e) => setRefleksiPemikiran(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800"
                    >
                      <option value={4}>4 - Perenungan diri mendalam & jujur mengenali bias</option>
                      <option value={3}>3 - Refleksi pemikiran cukup mendalam</option>
                      <option value={2}>2 - Refleksi masih berupa narasi ringkas</option>
                      <option value={1}>1 - Belum memuat perenungan diri</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">
                      4. Mengambil Kesimpulan & Tindakan Solutif
                    </label>
                    <select
                      value={mengambilKesimpulan}
                      onChange={(e) => setMengambilKesimpulan(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800"
                    >
                      <option value={4}>4 - Kesimpulan solutif, santun, & komitmen nyata terukur</option>
                      <option value={3}>3 - Kesimpulan jelas dan solutif</option>
                      <option value={2}>2 - Kesimpulan masih terlalu abstrak</option>
                      <option value={1}>1 - Belum merumuskan kesimpulan akhir</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-blue-200 text-xs">
                  <span className="font-semibold text-slate-700">Skor Akhir (Skala 100):</span>
                  <span className="text-base font-bold text-blue-900 tabular-nums">
                    {calculatedGrade} / 100
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Catatan Masukan / Umpan Balik Guru PPKn:
                  </label>
                  <textarea
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tuliskan apresiasi, masukan penguatan materi, atau saran tindakan nyata bagi siswa..."
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingGrade(false)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Simpan Nilai & Masukan</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer info (no-print) */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 no-print">
          <span>Buku Teks Utama Pendidikan Pancasila SMA Kelas XI · Halaman 62</span>
          <button
            onClick={onClose}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
