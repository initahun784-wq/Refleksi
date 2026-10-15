import React, { useState } from 'react';
import { X, UserCheck, GraduationCap, Plus, Check, Search, Hash } from 'lucide-react';
import { Student } from '../types';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  currentUser: { isTeacher: boolean; student?: Student };
  onSwitchUser: (isTeacher: boolean, student?: Student) => void;
  onAddStudent: (newStudent: Student) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  students,
  currentUser,
  onSwitchUser,
  onAddStudent,
}) => {
  if (!isOpen) return null;

  const [searchStudent, setSearchStudent] = useState<string>('');
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newNisn, setNewNisn] = useState<string>('');
  const [newAbsen, setNewAbsen] = useState<number>(students.length + 1);

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const student: Student = {
      id: `std-${Date.now()}`,
      name: newName.trim().toUpperCase(),
      absenNumber: newAbsen,
      nisn: newNisn.trim() || `00812300${newAbsen}`,
      classGroup: 'XI-B',
      avatarColor: 'bg-indigo-600',
      submittedCount: 0,
      averageScore: undefined,
    };

    onAddStudent(student);
    onSwitchUser(false, student);
    setIsAddingNew(false);
    onClose();
  };

  const sortedStudents = [...students].sort((a, b) => (a.absenNumber || 0) - (b.absenNumber || 0));

  const filteredStudents = sortedStudents.filter((std) => {
    if (!searchStudent.trim()) return true;
    const q = searchStudent.toLowerCase();
    const matchName = std.name.toLowerCase().includes(q);
    const matchAbsen = std.absenNumber ? std.absenNumber.toString() === q : false;
    return matchName || matchAbsen;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Pilih Profil Siswa / Mode Guru
            </h3>
            <p className="text-xs text-slate-500">
              Daftar 41 Siswa Kelas XI-B & Pendidik PPKn
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

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Mode Guru Switch */}
          <div>
            <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Peran Pendidik / Guru
            </span>
            <button
              onClick={() => {
                onSwitchUser(true);
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all cursor-pointer ${
                currentUser.isTeacher
                  ? 'bg-blue-50/80 border-blue-400 font-semibold text-blue-900 shadow-2xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Jamal Akmalludin,S.Pd</p>
                  <p className="text-2xs text-slate-500">Guru PPKn Kelas XI-B · Akses Rubrik Penilaian Portofolio</p>
                </div>
              </div>
              {currentUser.isTeacher && <Check className="w-4 h-4 text-blue-700 shrink-0" />}
            </button>
          </div>

          {/* Student Search and Count */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">
                Daftar Siswa Kelas XI-B ({students.length} Siswa)
              </span>
              <button
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Siswa</span>
              </button>
            </div>

            {/* Quick Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama atau nomor absen (1-41)..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Add Student Form */}
            {isAddingNew && (
              <form onSubmit={handleCreateStudent} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
                <p className="text-xs font-bold text-slate-800">Daftarkan Siswa Baru ke XI-B:</p>
                <input
                  type="text"
                  required
                  placeholder="NAMA LENGKAP SISWA"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    required
                    placeholder="Nomor Absen"
                    value={newAbsen}
                    onChange={(e) => setNewAbsen(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="NISN (Opsional)"
                    value={newNisn}
                    onChange={(e) => setNewNisn(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="px-2.5 py-1 text-2xs text-slate-600 hover:text-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-700 text-white rounded text-2xs font-semibold cursor-pointer"
                  >
                    Simpan & Pilih
                  </button>
                </div>
              </form>
            )}

            {/* Student List */}
            <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
              {filteredStudents.map((std) => {
                const isActive = !currentUser.isTeacher && currentUser.student?.id === std.id;
                return (
                  <button
                    key={std.id}
                    onClick={() => {
                      onSwitchUser(false, std);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-50/80 border-blue-400 font-semibold text-blue-900'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 font-mono flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                        {std.absenNumber}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{std.name}</p>
                        <p className="text-2xs text-slate-500">
                          Kelas {std.classGroup} · Absen #{std.absenNumber}
                        </p>
                      </div>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-blue-700 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
