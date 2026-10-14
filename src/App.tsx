import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { JournalTab } from './components/JournalTab';
import { JournalDetailModal } from './components/JournalDetailModal';
import { JournalUploadModal } from './components/JournalUploadModal';
import { ForumTab } from './components/ForumTab';
import { PillarsTab } from './components/PillarsTab';
import { TeacherDashboardTab } from './components/TeacherDashboardTab';
import { StudentProfileModal } from './components/StudentProfileModal';

import {
  INITIAL_STUDENTS,
  INITIAL_JOURNALS,
  INITIAL_TOPICS,
} from './data/initialData';
import {
  Student,
  JournalEntry,
  ForumTopic,
  ArgumentStance,
  RubricCriteria,
  ForumComment,
  ForumReply,
} from './types';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

export default function App() {
  // Persistence state
  // Persistence state for XI-B students
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('ppkn_students_xib_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 41 && parsed[0]?.absenNumber === 1) {
          return parsed;
        }
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_STUDENTS;
  });

  const [journals, setJournals] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('ppkn_journals_xib_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_JOURNALS;
  });

  const [topics, setTopics] = useState<ForumTopic[]>(() => {
    const saved = localStorage.getItem('ppkn_topics_xib_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_TOPICS;
  });

  // Current User Session
  const [currentUser, setCurrentUser] = useState<{ isTeacher: boolean; student?: Student }>(() => {
    return { isTeacher: false, student: INITIAL_STUDENTS[0] };
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'journals' | 'forum' | 'pillars' | 'teacher'>('journals');
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ppkn_students_xib_v3', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('ppkn_journals_xib_v3', JSON.stringify(journals));
  }, [journals]);

  useEffect(() => {
    localStorage.setItem('ppkn_topics_xib_v3', JSON.stringify(topics));
  }, [topics]);

  // Toast auto-clear
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Actions: Journal Save
  const handleSaveJournal = (newEntry: JournalEntry) => {
    setJournals([newEntry, ...journals]);
    // update student submission count
    if (currentUser.student) {
      setStudents(
        students.map((s) =>
          s.id === currentUser.student?.id
            ? { ...s, submittedCount: s.submittedCount + 1 }
            : s
        )
      );
    }
    showToast(`Jurnal Pekan ke-${newEntry.weekNumber} berhasil diunggah!`);
  };

  // Actions: Teacher Grading
  const handleSaveTeacherFeedback = (
    journalId: string,
    rubric: RubricCriteria,
    feedback: string
  ) => {
    const totalScore = Math.round(
      ((rubric.memprosesInformasi +
        rubric.menganalisisInformasi +
        rubric.refleksiPemikiran +
        rubric.mengambilKesimpulan) /
        16) *
        100
    );

    const today = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());

    const updatedJournals = journals.map((j) => {
      if (j.id === journalId) {
        return {
          ...j,
          status: 'graded' as const,
          rubric,
          score: totalScore,
          teacherFeedback: feedback,
          teacherFeedbackDate: today,
        };
      }
      return j;
    });

    setJournals(updatedJournals);
    if (selectedJournal && selectedJournal.id === journalId) {
      setSelectedJournal({
        ...selectedJournal,
        status: 'graded',
        rubric,
        score: totalScore,
        teacherFeedback: feedback,
        teacherFeedbackDate: today,
      });
    }
    showToast(`Penilaian dan rubrik untuk jurnal berhasil disimpan (Skor: ${totalScore}/100)!`);
  };

  // Actions: Forum Poll Vote
  const handleVotePoll = (topicId: string, optionId: string) => {
    const voterId = currentUser.isTeacher ? 'teacher-id' : currentUser.student?.id || 'std-1';

    const updatedTopics = topics.map((tpc) => {
      if (tpc.id === topicId && tpc.poll) {
        if (tpc.poll.voterIds.includes(voterId)) return tpc; // already voted

        const updatedOptions = tpc.poll.options.map((opt) => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        });

        return {
          ...tpc,
          poll: {
            ...tpc.poll,
            options: updatedOptions,
            totalVotes: tpc.poll.totalVotes + 1,
            voterIds: [...tpc.poll.voterIds, voterId],
          },
        };
      }
      return tpc;
    });

    setTopics(updatedTopics);
    showToast('Suara polling Anda berhasil dicatat.');
  };

  // Actions: Forum Comment
  const handleAddComment = (topicId: string, stance: ArgumentStance, content: string) => {
    const authorId = currentUser.isTeacher ? 'teacher-id' : currentUser.student?.id || 'std-1';
    const authorName = currentUser.isTeacher
      ? 'Drs. Supriyanto, M.Pd (Guru PPKn)'
      : currentUser.student?.name || 'Siswa Kelas XI';
    const classGroup = currentUser.isTeacher ? undefined : currentUser.student?.classGroup;

    const today = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());

    const newComment: ForumComment = {
      id: `cmt-${Date.now()}`,
      authorId,
      authorName,
      authorRole: currentUser.isTeacher ? 'guru' : 'siswa',
      classGroup,
      stance,
      content,
      createdAt: today,
      likes: 0,
      likedBy: [],
      replies: [],
    };

    const updatedTopics = topics.map((tpc) => {
      if (tpc.id === topicId) {
        return {
          ...tpc,
          comments: [newComment, ...tpc.comments],
        };
      }
      return tpc;
    });

    setTopics(updatedTopics);
    showToast('Argumen Anda berhasil dipublikasikan di forum diskusi.');
  };

  // Actions: Forum Reply
  const handleAddReply = (topicId: string, commentId: string, content: string) => {
    const authorId = currentUser.isTeacher ? 'teacher-id' : currentUser.student?.id || 'std-1';
    const authorName = currentUser.isTeacher
      ? 'Drs. Supriyanto, M.Pd (Guru PPKn)'
      : currentUser.student?.name || 'Siswa Kelas XI';

    const today = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());

    const newReply: ForumReply = {
      id: `rpl-${Date.now()}`,
      authorId,
      authorName,
      authorRole: currentUser.isTeacher ? 'guru' : 'siswa',
      classGroup: currentUser.isTeacher ? undefined : currentUser.student?.classGroup,
      content,
      createdAt: today,
      likes: 0,
      likedBy: [],
    };

    const updatedTopics = topics.map((tpc) => {
      if (tpc.id === topicId) {
        return {
          ...tpc,
          comments: tpc.comments.map((cmt) => {
            if (cmt.id === commentId) {
              return {
                ...cmt,
                replies: [...cmt.replies, newReply],
              };
            }
            return cmt;
          }),
        };
      }
      return tpc;
    });

    setTopics(updatedTopics);
    showToast('Tanggapan berhasil dikirim.');
  };

  // Actions: Like Comment
  const handleLikeComment = (topicId: string, commentId: string) => {
    const voterId = currentUser.isTeacher ? 'teacher-id' : currentUser.student?.id || 'std-1';

    const updatedTopics = topics.map((tpc) => {
      if (tpc.id === topicId) {
        return {
          ...tpc,
          comments: tpc.comments.map((cmt) => {
            if (cmt.id === commentId) {
              const alreadyLiked = cmt.likedBy.includes(voterId);
              if (alreadyLiked) {
                return {
                  ...cmt,
                  likes: Math.max(0, cmt.likes - 1),
                  likedBy: cmt.likedBy.filter((id) => id !== voterId),
                };
              } else {
                return {
                  ...cmt,
                  likes: cmt.likes + 1,
                  likedBy: [...cmt.likedBy, voterId],
                };
              }
            }
            return cmt;
          }),
        };
      }
      return tpc;
    });

    setTopics(updatedTopics);
  };

  // Actions: Create Topic
  const handleCreateTopic = (newTopic: ForumTopic) => {
    setTopics([newTopic, ...topics]);
    showToast('Topik musyawarah baru berhasil dibuka.');
  };

  // Actions: User Switch
  const handleSwitchUser = (isTeacher: boolean, student?: Student) => {
    setCurrentUser({ isTeacher, student });
    if (isTeacher) {
      showToast('Beralih ke Mode Guru PPKn (Drs. Supriyanto, M.Pd).');
    } else if (student) {
      showToast(`Aktif sebagai ${student.name} (${student.classGroup}).`);
    }
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents([...students, newStudent]);
  };

  // Stats calculation
  const totalCommentsCount = topics.reduce((acc, t) => acc + t.comments.length, 0);
  const gradedJournalsCount = journals.filter((j) => j.status === 'graded').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2.5 text-xs sm:text-sm animate-fade-in no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar (Strict 3-zone contract) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1">
        {/* Hero Section shown on primary landing tabs */}
        {activeTab === 'journals' && (
          <Hero
            totalJournals={journals.length}
            totalComments={totalCommentsCount}
            gradedCount={gradedJournalsCount}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onNavigateToForum={() => setActiveTab('forum')}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'journals' && (
            <JournalTab
              journals={journals}
              currentUser={currentUser}
              onSelectJournal={(j) => setSelectedJournal(j)}
              onOpenUpload={() => setIsUploadModalOpen(true)}
            />
          )}

          {activeTab === 'forum' && (
            <ForumTab
              topics={topics}
              currentUser={currentUser}
              onVotePoll={handleVotePoll}
              onAddComment={handleAddComment}
              onAddReply={handleAddReply}
              onLikeComment={handleLikeComment}
              onCreateTopic={handleCreateTopic}
            />
          )}

          {activeTab === 'pillars' && <PillarsTab />}

          {activeTab === 'teacher' && (
            <TeacherDashboardTab
              students={students}
              journals={journals}
              onSelectJournal={(j) => setSelectedJournal(j)}
            />
          )}
        </div>
      </main>

      {/* Detail Journal Modal (with Teacher Rubric grading & Print) */}
      <JournalDetailModal
        journal={selectedJournal}
        onClose={() => setSelectedJournal(null)}
        currentUser={currentUser}
        onSaveTeacherFeedback={handleSaveTeacherFeedback}
      />

      {/* Journal Upload / Entry Modal */}
      <JournalUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentUser={currentUser}
        onSaveJournal={handleSaveJournal}
      />

      {/* User Persona Switcher Modal */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        students={students}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onAddStudent={handleAddStudent}
      />

      {/* Clean Editorial Footer (Anti-slop compliant) */}
      <footer className="bg-white border-t border-slate-200 py-8 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p className="font-semibold text-slate-700">
              Ruang Refleksi & Demokrasi PPKn Kelas XI
            </p>
            <p className="text-2xs text-slate-400 mt-0.5">
              Model Refleksi 4F · 10 Pilar Demokrasi Ahmad Sanusi · Kurikulum Merdeka Fase F
            </p>
          </div>

          <div className="flex items-center gap-6 text-slate-600">
            <button
              onClick={() => setActiveTab('journals')}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              Jurnal Mingguan
            </button>
            <button
              onClick={() => setActiveTab('forum')}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              Forum Demokrasi
            </button>
            <button
              onClick={() => setActiveTab('pillars')}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              10 Pilar Konstitusi
            </button>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              Ganti Profil
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
