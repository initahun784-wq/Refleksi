import React, { useState } from 'react';
import { Search, Filter, Plus, BookOpen, User, Calendar, CheckCircle2, ChevronRight, FileText, Sparkles } from 'lucide-react';
import { JournalEntry, Student } from '../types';

interface JournalTabProps {
  journals: JournalEntry[];
  currentUser: { isTeacher: boolean; student?: Student };
  onSelectJournal: (journal: JournalEntry) => void;
  onOpenUpload: () => void;
}

export const JournalTab: React.FC<JournalTabProps> = ({
  journals,
  currentUser,
  onSelectJournal,
  onOpenUpload,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<'all' | 'Bab 1' | 'Bab 2' | 'Bab 3' | 'Bab 4'>('all');
  const [selectedClass, setSelectedClass] = useState<'all' | 'XI-B'>('all');
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'graded' | 'submitted'>('all');
  const [viewScope, setViewScope] = useState<'all' | 'my'>('all');

  const filteredJournals = journals.filter((item) => {
    // View scope filter
    if (viewScope === 'my' && !currentUser.isTeacher) {
      if (item.studentId !== currentUser.student?.id) return false;
    }

    // Chapter filter
    if (selectedChapter !== 'all' && (item.chapter || 'Bab 2') !== selectedChapter) {
      return false;
    }

    // Class filter
    if (selectedClass !== 'all' && item.classGroup !== selectedClass) {
      return false;
    }

    // Week filter
    if (selectedWeek !== 'all' && item.weekNumber !== selectedWeek) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.topicTitle.toLowerCase().includes(q);
      const matchAuthor = item.studentName.toLowerCase().includes(q);
      const matchFacts = item.reflection.facts.toLowerCase().includes(q);
      const matchFindings = item.reflection.findings.toLowerCase().includes(q);
      const matchRef = item.activityRef?.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchAuthor && !matchFacts && !matchFindings && !matchRef) return false;
    }

    return true;
  });

  // Extract available weeks
  const availableWeeks = Array.from(new Set(journals.map((j) => j.weekNumber))).sort(
    (a, b) => b - a
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-2xs font-bold text-blue-800 tracking-wide uppercase mb-1">
            BUKU PENDIDIKAN PANCASILA KELAS XI (KEMENDIKBUDRISTEK & BPIP 2023)
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Arsip Jurnal Refleksi Mingguan Siswa
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Refleksi terstruktur Model 4F (Peristiwa, Perasaan, Pembelajaran, Aksi Nyata) berlandaskan nilai-nilai Pancasila & UUD NRI 1945.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tulis / Unggah Jurnal Pekan Ini</span>
        </button>
      </div>

      {/* Control Filter Deck */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari topik, nama siswa, aktivitas buku..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-colors"
            />
          </div>

          {/* Scope Segmented Control & Dropdowns */}
          <div className="lg:col-span-7 flex flex-wrap items-center justify-start lg:justify-end gap-2">
            {!currentUser.isTeacher && (
              <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setViewScope('all')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    viewScope === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setViewScope('my')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    viewScope === 'my'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Jurnalku
                </button>
              </div>
            )}

            {/* Chapter Filter */}
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer font-medium"
            >
              <option value="all">Semua Bab</option>
              <option value="Bab 1">Bab 1: Menjiwai Pancasila</option>
              <option value="Bab 2">Bab 2: Demokrasi UUD 1945</option>
              <option value="Bab 3">Bab 3: Harmoni Keberagaman</option>
              <option value="Bab 4">Bab 4: Menjaga Keutuhan NKRI</option>
            </select>

            {/* Class Filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
            >
              <option value="all">Semua Rombel</option>
              <option value="XI-B">Kelas XI-B (41 Siswa)</option>
            </select>

            {/* Week Filter */}
            <select
              value={selectedWeek}
              onChange={(e) =>
                setSelectedWeek(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
            >
              <option value="all">Semua Pekan</option>
              {availableWeeks.map((wk) => (
                <option key={wk} value={wk}>
                  Pekan {wk}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="graded">Sudah Dinilai</option>
              <option value="submitted">Menunggu Nilai</option>
            </select>
          </div>
        </div>
      </div>

      {/* Journal Cards List */}
      {filteredJournals.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">
            Tidak ada jurnal yang sesuai
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Coba sesuaikan filter bab atau kata kunci pencarian.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJournals.map((journal) => (
            <article
              key={journal.id}
              onClick={() => onSelectJournal(journal)}
              className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 hover:border-slate-300 transition-all hover:shadow-xs cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-3 flex-1">
                  {/* Clean unboxed metadata with typographic separators (Zero-Pill discipline) */}
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500">
                    <span className="font-semibold text-blue-900">
                      {journal.chapter || 'Bab 2'} · Pekan {journal.weekNumber}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{journal.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-700">
                      {journal.studentName} ({journal.classGroup})
                    </span>
                    {journal.activityRef && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-blue-800">{journal.activityRef}</span>
                      </>
                    )}
                    <span aria-hidden="true">·</span>
                    <span>
                      {journal.status === 'graded' ? (
                        <span className="font-bold text-emerald-700">
                          Nilai {journal.score}/100
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium">Menunggu Nilai</span>
                      )}
                    </span>
                  </div>

                  {/* Journal Title */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {journal.topicTitle}
                  </h3>

                  {/* 4F Excerpt */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50/70 p-3.5 rounded-lg border border-slate-100">
                    <div>
                      <span className="font-semibold text-slate-800 block mb-0.5">
                        Peristiwa (Facts):
                      </span>
                      <p className="line-clamp-2 leading-relaxed">{journal.reflection.facts}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800 block mb-0.5">
                        Aksi Nyata (Future):
                      </span>
                      <p className="line-clamp-2 leading-relaxed">{journal.reflection.future}</p>
                    </div>
                  </div>

                  {/* Bottom info: Pancasila Sila & Attachment */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-700">Keterkaitan Sila:</span>
                      <span>
                        {journal.relatedSila.map((s) => `Sila ke-${s}`).join(', ')}
                      </span>
                    </div>

                    {journal.attachmentName && (
                      <div className="flex items-center gap-1 text-slate-500">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span className="truncate max-w-[180px]">{journal.attachmentName}</span>
                      </div>
                    )}
                  </div>

                  {/* Teacher Feedback Quote if graded */}
                  {journal.teacherFeedback && (
                    <div className="bg-blue-50/50 border border-blue-100 rounded-md p-2.5 text-xs text-blue-950 mt-1">
                      <span className="font-semibold text-blue-900 block mb-0.5">
                        Ulasan Guru PPKn:
                      </span>
                      <p className="italic line-clamp-1">"{journal.teacherFeedback}"</p>
                    </div>
                  )}
                </div>

                <div className="sm:self-center shrink-0 flex sm:flex-col items-center justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 group-hover:translate-x-1 transition-transform">
                    <span>Lihat Rubrik & Detail</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
