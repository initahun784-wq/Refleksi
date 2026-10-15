import React, { useState } from 'react';
import { Award, Download, CheckCircle2, AlertCircle, FileSpreadsheet, Eye, Printer, Users, Search, Hash, Lock } from 'lucide-react';
import { Student, JournalEntry } from '../types';

interface TeacherDashboardTabProps {
  students: Student[];
  journals: JournalEntry[];
  onSelectJournal: (journal: JournalEntry) => void;
  onLockTeacher?: () => void;
}

export const TeacherDashboardTab: React.FC<TeacherDashboardTabProps> = ({
  students,
  journals,
  onSelectJournal,
  onLockTeacher,
}) => {
  const [selectedClass, setSelectedClass] = useState<'all' | 'XI-B'>('XI-B');
  const [searchStudent, setSearchStudent] = useState<string>('');

  const sortedStudents = [...students].sort(
    (a, b) => (a.absenNumber || 0) - (b.absenNumber || 0)
  );

  const filteredStudents = sortedStudents.filter((s) => {
    if (selectedClass !== 'all' && s.classGroup !== selectedClass) return false;
    if (searchStudent.trim()) {
      const q = searchStudent.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchAbsen = s.absenNumber ? s.absenNumber.toString() === q : false;
      if (!matchName && !matchAbsen) return false;
    }
    return true;
  });

  const filteredJournals = journals.filter(
    (j) => selectedClass === 'all' || j.classGroup === selectedClass
  );

  const gradedJournals = filteredJournals.filter((j) => j.status === 'graded' && j.score !== undefined);
  const pendingJournals = filteredJournals.filter((j) => j.status === 'submitted');

  const averageClassScore =
    gradedJournals.length > 0
      ? Math.round(
          gradedJournals.reduce((acc, curr) => acc + (curr.score || 0), 0) / gradedJournals.length
        )
      : 0;

  const kkmPassingCount = gradedJournals.filter((j) => (j.score || 0) >= 75).length;
  const kkmRate =
    gradedJournals.length > 0 ? Math.round((kkmPassingCount / gradedJournals.length) * 100) : 0;

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = [
      'No. Absen',
      'Nama Siswa',
      'NISN',
      'Kelas',
      'Pekan',
      'Bab',
      'Rujukan Aktivitas',
      'Topik Refleksi',
      'Status',
      'Nilai (Tabel 2.4)',
      'Feedback Guru (Jamal Akmalludin,S.Pd)',
    ];
    const rows = filteredJournals.map((j) => {
      const studentObj = students.find((s) => s.id === j.studentId);
      return [
        studentObj?.absenNumber || '-',
        `"${j.studentName}"`,
        `"${studentObj?.nisn || j.studentId}"`,
        `"${j.classGroup}"`,
        j.weekNumber,
        `"${j.chapter || 'Bab 2'}"`,
        `"${j.activityRef || '-'}"`,
        `"${j.topicTitle.replace(/"/g, '""')}"`,
        j.status === 'graded' ? 'Dinilai' : 'Menunggu Nilai',
        j.score || 0,
        `"${(j.teacherFeedback || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_refleksi_pendidikan_pancasila_kelas_${selectedClass}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const weeks = [1, 2, 3, 4, 5, 6];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-800 tracking-wide mb-1">
            <span>ASESMEN PORTOFOLIO KELAS XI-B</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>GURU PENGAMPU: JAMAL AKMALLUDIN,S.PD</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard Penilaian Portofolio Guru PPKn
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Guru: <strong className="text-slate-800">Jamal Akmalludin,S.Pd</strong> · Daftar 41 Peserta Didik Kelas XI-B, pemantauan pengunggahan jurnal model 4F, dan rubrik bernalar kritis (Tabel 2.4).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {onLockTeacher && (
            <button
              onClick={onLockTeacher}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer border border-slate-300"
              title="Kunci kembali akses Dashboard Guru"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Kunci Akses</span>
            </button>
          )}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Rekap CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer no-print"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Rata-rata Nilai Kelas XI-B</p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
            {averageClassScore || '-'} / 100
          </p>
          <p className="text-2xs text-slate-400 mt-0.5">KKM Satuan Pendidikan: 75</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Ketuntasan KKM</p>
          <p className="text-2xl font-bold text-emerald-700 tabular-nums mt-1">
            {kkmRate}%
          </p>
          <p className="text-2xs text-slate-400 mt-0.5">{kkmPassingCount} dari {gradedJournals.length} tuntas</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Menunggu Penilaian</p>
          <p className="text-2xl font-bold text-amber-700 tabular-nums mt-1">
            {pendingJournals.length}
          </p>
          <p className="text-2xs text-slate-400 mt-0.5">Perlu diverifikasi guru</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Jumlah Siswa XI-B</p>
          <p className="text-2xl font-bold text-blue-800 tabular-nums mt-1">
            {students.length} Siswa
          </p>
          <p className="text-2xs text-slate-400 mt-0.5">Nomor Absen 1 s.d. 41</p>
        </div>
      </div>

      {/* Class & Student Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Rombel:</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-900 font-bold text-xs rounded-md">
              Kelas XI-B
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari siswa atau absen..."
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 w-56"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
            <span>Dinilai (&ge; KKM)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-400"></span>
            <span>Menunggu Nilai</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-slate-200"></span>
            <span>Belum Kumpul</span>
          </div>
        </div>
      </div>

      {/* Progress Matrix Table with All 41 Students of XI-B */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Matriks Pengumpulan & Nilai Portofolio Siswa Kelas XI-B (Absen 1 - 41)
            </h3>
            <p className="text-2xs text-slate-500">
              Skor dinilai berdasar Rubrik Bernalar Kritis Sikap Demokratis (Tabel 2.4 Buku hlm. 62)
            </p>
          </div>
          <span className="text-xs text-slate-500 hidden sm:block">
            {filteredStudents.length} siswa ditampilkan
          </span>
        </div>

        <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-100 shadow-2xs">
              <tr className="border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-3 text-center w-12">No</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-3">Kelas</th>
                {weeks.map((w) => (
                  <th key={w} className="py-3 px-3 text-center">
                    Pekan {w}
                  </th>
                ))}
                <th className="py-3 px-4 text-right">Rerata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.map((std) => {
                const studentJournals = journals.filter((j) => j.studentId === std.id);
                const scores = studentJournals
                  .map((j) => j.score)
                  .filter((s): s is number => s !== undefined);
                const avg =
                  scores.length > 0
                    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
                    : 0;

                return (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-500">
                      {std.absenNumber}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {std.name}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 font-medium">
                      {std.classGroup}
                    </td>

                    {weeks.map((w) => {
                      const journalForWeek = studentJournals.find((j) => j.weekNumber === w);

                      if (!journalForWeek) {
                        return (
                          <td key={w} className="py-2.5 px-3 text-center">
                            <span className="inline-block w-8 py-1 rounded bg-slate-100 text-slate-400 font-mono text-2xs">
                              -
                            </span>
                          </td>
                        );
                      }

                      if (journalForWeek.status === 'graded') {
                        return (
                          <td key={w} className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => onSelectJournal(journalForWeek)}
                              className="w-8 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold tabular-nums cursor-pointer transition-colors"
                              title={`Pekan ${w}: ${journalForWeek.score}/100. Klik untuk lihat ulasan & rubrik.`}
                            >
                              {journalForWeek.score}
                            </button>
                          </td>
                        );
                      }

                      return (
                        <td key={w} className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => onSelectJournal(journalForWeek)}
                            className="w-8 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-2xs cursor-pointer transition-colors"
                            title={`Pekan ${w}: Menunggu penilaian guru. Klik untuk beri nilai.`}
                          >
                            Wait
                          </button>
                        </td>
                      );
                    })}

                    <td className="py-2.5 px-4 text-right font-bold tabular-nums text-slate-900">
                      {avg ? `${avg}/100` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Reviews Queue */}
      {pendingJournals.length > 0 && (
        <div className="bg-amber-50/70 rounded-xl border border-amber-200 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-800" />
            <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
              Antrean Jurnal Menunggu Penilaian Guru ({pendingJournals.length})
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingJournals.map((j) => (
              <div
                key={j.id}
                onClick={() => onSelectJournal(j)}
                className="bg-white p-3.5 rounded-lg border border-amber-200 hover:border-amber-400 cursor-pointer transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{j.studentName} ({j.classGroup})</span>
                  <span className="text-slate-500">Pekan ke-{j.weekNumber} · {j.chapter || 'Bab 2'}</span>
                </div>
                <p className="text-xs text-slate-700 font-medium line-clamp-1">{j.topicTitle}</p>
                <div className="flex items-center justify-between pt-1 text-2xs text-blue-700 font-semibold">
                  <span>Buka Rubrik & Beri Nilai Segera &rarr;</span>
                  <span className="text-slate-400 font-normal">{j.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
