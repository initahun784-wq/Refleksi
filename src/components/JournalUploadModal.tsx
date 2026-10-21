import React, { useState } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, FileText, BookOpen } from 'lucide-react';
import { JournalEntry, PancasilaSila, Student } from '../types';
import { REFLECTION_TOPIC_PRESETS } from '../data/initialData';

interface JournalUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { isTeacher: boolean; student?: Student };
  students?: Student[];
  onSaveJournal: (newJournal: JournalEntry) => void;
}

export const JournalUploadModal: React.FC<JournalUploadModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  students = [],
  onSaveJournal,
}) => {
  if (!isOpen) return null;

  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    return currentUser.student?.id || (students[0]?.id) || 'std-1';
  });
  const [weekNumber, setWeekNumber] = useState<number>(6);
  const [chapter, setChapter] = useState<'Bab 1' | 'Bab 2' | 'Bab 3' | 'Bab 4'>('Bab 2');
  const [activityRef, setActivityRef] = useState<string>('Aktivitas 2.8 (Buku hlm. 61-62)');
  const [topicTitle, setTopicTitle] = useState<string>('');
  const [facts, setFacts] = useState<string>('');
  const [feelings, setFeelings] = useState<string>('');
  const [findings, setFindings] = useState<string>('');
  const [future, setFuture] = useState<string>('');
  const [selectedSila, setSelectedSila] = useState<PancasilaSila[]>([4]);
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Draft recovery from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('ppkn_journal_draft_xib');
      if (saved) {
        const d = JSON.parse(saved);
        if (d.topicTitle) setTopicTitle(d.topicTitle);
        if (d.facts) setFacts(d.facts);
        if (d.feelings) setFeelings(d.feelings);
        if (d.findings) setFindings(d.findings);
        if (d.future) setFuture(d.future);
        if (d.weekNumber) setWeekNumber(d.weekNumber);
        if (d.chapter) setChapter(d.chapter);
        if (d.activityRef) setActivityRef(d.activityRef);
        if (d.selectedSila) setSelectedSila(d.selectedSila);
      }
    } catch (e) {}
  }, []);

  // Autosave draft while typing
  React.useEffect(() => {
    if (topicTitle || facts || feelings || findings || future) {
      try {
        localStorage.setItem(
          'ppkn_journal_draft_xib',
          JSON.stringify({
            topicTitle,
            facts,
            feelings,
            findings,
            future,
            weekNumber,
            chapter,
            activityRef,
            selectedSila,
          })
        );
      } catch (e) {}
    }
  }, [topicTitle, facts, feelings, findings, future, weekNumber, chapter, activityRef, selectedSila]);

  const toggleSila = (sila: PancasilaSila) => {
    if (selectedSila.includes(sila)) {
      if (selectedSila.length > 1) {
        setSelectedSila(selectedSila.filter((s) => s !== sila));
      }
    } else {
      setSelectedSila([...selectedSila, sila]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
    }
  };

  const handleSimulateAttachment = () => {
    setAttachmentName('dokumentasi_musyawarah_kelas_xi.jpg');
  };

  const handleSubmit = (status: 'draft' | 'submitted') => {
    if (!topicTitle.trim()) {
      setErrorMsg('Mohon isi judul topik atau materi pembelajaran.');
      return;
    }
    if (!facts.trim() || !feelings.trim() || !findings.trim() || !future.trim()) {
      setErrorMsg('Harap lengkapi keempat dimensi refleksi Model 4F (Peristiwa, Perasaan, Pembelajaran, dan Aksi Nyata).');
      return;
    }

    const today = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());

    const activeStudent = currentUser.isTeacher
      ? students.find((s) => s.id === selectedStudentId) || currentUser.student
      : currentUser.student;

    const newEntry: JournalEntry = {
      id: `jnl-${Date.now()}`,
      weekNumber,
      date: today,
      studentId: activeStudent?.id || 'std-1',
      studentName: activeStudent?.name || 'AL FATHIR FAHREZI PUTRA WIGUNA',
      classGroup: activeStudent?.classGroup || 'XI-B',
      chapter,
      activityRef: activityRef.trim() || undefined,
      topicTitle: topicTitle.trim(),
      reflection: {
        facts: facts.trim(),
        feelings: feelings.trim(),
        findings: findings.trim(),
        future: future.trim(),
      },
      relatedSila: selectedSila,
      attachmentName: attachmentName || undefined,
      status,
    };

    try {
      localStorage.removeItem('ppkn_journal_draft_xib');
    } catch (e) {}

    onSaveJournal(newEntry);
    onClose();
  };

  const silaList: { number: PancasilaSila; label: string }[] = [
    { number: 1, label: 'Sila 1: Ketuhanan Yang Maha Esa' },
    { number: 2, label: 'Sila 2: Kemanusiaan yang Adil dan Beradab' },
    { number: 3, label: 'Sila 3: Persatuan Indonesia' },
    { number: 4, label: 'Sila 4: Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan...' },
    { number: 5, label: 'Sila 5: Keadilan Sosial bagi Seluruh Rakyat Indonesia' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-3xl w-full overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Unggah Jurnal Refleksi Mingguan (Buku Teks Pendidikan Pancasila Kelas XI)
            </h3>
            <p className="text-xs text-slate-500">
              {currentUser.isTeacher ? (
                <span>Mode Guru PPKn: Menginputkan data refleksi peserta didik</span>
              ) : (
                <span>Peserta Didik: <strong className="text-slate-800">{currentUser.student?.name || 'AL FATHIR FAHREZI PUTRA WIGUNA'}</strong> ({currentUser.student?.classGroup || 'XI-B'})</span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {currentUser.isTeacher && students.length > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="block text-xs font-bold text-blue-900 mb-1">
                Pilih Nama Siswa Kelas XI-B:
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full text-xs sm:text-sm bg-white border border-blue-300 rounded-md px-3 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    #{s.absenNumber} - {s.name} ({s.classGroup})
                  </option>
                ))}
              </select>
              <p className="text-2xs text-blue-700 mt-1">
                Bapak Jamal dapat menginputkan jawaban langsung atas nama siswa yang belum terunggah dari HP.
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Week & Chapter Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pekan Ke-
              </label>
              <select
                value={weekNumber}
                onChange={(e) => setWeekNumber(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                {Array.from({ length: 16 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w}>
                    Pekan {w}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bab Buku Teks
              </label>
              <select
                value={chapter}
                onChange={(e) => setChapter(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="Bab 1">Bab 1: Menjiwai Pancasila</option>
                <option value="Bab 2">Bab 2: Demokrasi UUD 1945</option>
                <option value="Bab 3">Bab 3: Harmoni Keberagaman</option>
                <option value="Bab 4">Bab 4: Menjaga Keutuhan NKRI</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rujukan Aktivitas / Halaman Buku (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Aktivitas 2.8 (Halaman 61-62)"
                value={activityRef}
                onChange={(e) => setActivityRef(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Judul Refleksi / Materi PPKn
            </label>
            <input
              type="text"
              placeholder="Contoh: Perilaku Demokratis di Era Keterbukaan Informasi dan Etika Kritik Sosial"
              value={topicTitle}
              onChange={(e) => {
                setTopicTitle(e.target.value);
                setErrorMsg('');
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Quick preset selector directly from textbook */}
          <div>
            <span className="text-xs text-slate-500 block mb-1.5 font-medium">
              Pilihan Topik Pembelajaran dari Buku Teks (Klik untuk mengisi):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {REFLECTION_TOPIC_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTopicTitle(preset)}
                  className="text-left text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* 4F Framework Fields */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Dimensi Refleksi Model 4F (Panduan Kurikulum Merdeka)
              </h4>
              <span className="text-xs text-slate-500">Wajib lengkap 4 dimensi</span>
            </div>

            {/* 1. Facts */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <label className="block text-xs font-bold text-slate-900 mb-1">
                1. Peristiwa (Facts)
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Aktivitas kelas, materi buku, studi kasus (misal: EIU, meme/mural, amandemen), atau kejadian musyawarah apa yang kamu alami pekan ini?
              </p>
              <textarea
                rows={2}
                value={facts}
                onChange={(e) => setFacts(e.target.value)}
                placeholder="Ceritakan peristiwa atau fakta kegiatan belajar secara obyektif..."
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* 2. Feelings */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <label className="block text-xs font-bold text-slate-900 mb-1">
                2. Perasaan (Feelings)
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Bagaimana perasaan, respon emosional, atau perenungan batinmu saat mendalami materi ini atau menghadapi perbedaan pendapat?
              </p>
              <textarea
                rows={2}
                value={feelings}
                onChange={(e) => setFeelings(e.target.value)}
                placeholder="Deskripsikan perasaanmu (misal: antusias, tersadar, tertantang, prihatin, lega, dsb)..."
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* 3. Findings */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <label className="block text-xs font-bold text-slate-900 mb-1">
                3. Pembelajaran (Findings)
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Konsep konstitusi (UUD 1945), indikator demokrasi Affan Gaffar, atau nilai Pancasila apa yang kamu petik sebagai pelajaran berharga?
              </p>
              <textarea
                rows={2}
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                placeholder="Rumuskan pemahaman konsep demokrasi atau nilai konstitusional yang kamu dapatkan..."
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* 4. Future */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <label className="block text-xs font-bold text-slate-900 mb-1">
                4. Penerapan Nyata (Future)
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Aksi konkret apa yang akan kamu lakukan di kelas, keluarga, atau ruang digital? (Lihat daftar 10 perilaku demokratis Tabel 2.5)
              </p>
              <textarea
                rows={2}
                value={future}
                onChange={(e) => setFuture(e.target.value)}
                placeholder="Tuliskan komitmen aksi nyata dan sikap demokratis yang akan kamu terapkan..."
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Sila Pancasila Checklist */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Keterkaitan Sila Pancasila yang Dijiwai (Bab 1 Buku Teks)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {silaList.map((item) => (
                <label
                  key={item.number}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    selectedSila.includes(item.number)
                      ? 'bg-blue-50/70 border-blue-300 text-blue-900 font-medium'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSila.includes(item.number)}
                    onChange={() => toggleSila(item.number)}
                    className="rounded text-blue-700 focus:ring-blue-600"
                  />
                  <span className="truncate">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Unggah Dokumentasi / Lampiran (Sesuai Aktivitas 2.10 Buku Teks)
            </h4>
            <p className="text-xs text-slate-500">
              Lampirkan foto pengamatan kegiatan demokratis, mindmap infografik, atau hasil diskusi kelompok.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <label className="flex-1 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-lg p-4 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50/30">
                <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <span className="text-xs font-medium text-slate-700 block">
                  Pilih Berkas / Foto dari Komputer
                </span>
                <span className="text-2xs text-slate-400">JPG, PNG, atau PDF (Maks. 5MB)</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleSimulateAttachment}
                className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer"
                title="Gunakan contoh dokumen kegiatan kelas"
              >
                Gunakan Contoh Foto Kelas
              </button>
            </div>

            {attachmentName && (
              <div className="flex items-center justify-between p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-700" />
                  <span className="font-semibold">{attachmentName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachmentName('')}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 cursor-pointer"
          >
            Batal
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer"
            >
              Simpan sebagai Draf
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('submitted')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer"
            >
              Kirim Jurnal ke Guru PPKn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
