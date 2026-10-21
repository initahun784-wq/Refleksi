import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { JournalTab } from './components/JournalTab';
import { JournalDetailModal } from './components/JournalDetailModal';
import { JournalUploadModal } from './components/JournalUploadModal';
import { ForumTab } from './components/ForumTab';
import { PillarsTab } from './components/PillarsTab';
import { TeacherDashboardTab } from './components/TeacherDashboardTab';
import { StudentProfileModal } from './components/StudentProfileModal';
import { TeacherAuthModal } from './components/TeacherAuthModal';

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
import { db, handleFirestoreError, OperationType } from './firebase';
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';

export default function App() {
  // Cloud Database Status
  const [cloudStatus, setCloudStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  // Persistence state for XI-B students
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('ppkn_students_xib_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 41 && parsed[0]?.absenNumber === 1) {
          return parsed;
        }
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_STUDENTS;
  });

  // Journals state initialized from local cache to prevent flashing or data loss
  const [journals, setJournals] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('ppkn_journals_xib_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_JOURNALS;
  });

  const [topics, setTopics] = useState<ForumTopic[]>(() => {
    const saved = localStorage.getItem('ppkn_topics_xib_v4');
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

  // Teacher Security & Authentication (Secret Code: 11a1b13c)
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('ppkn_teacher_auth_11a1b13c') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isTeacherAuthModalOpen, setIsTeacherAuthModalOpen] = useState<boolean>(false);

  // UI state
  const [activeTab, setActiveTab] = useState<'journals' | 'forum' | 'pillars' | 'teacher'>('journals');
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. FIRESTORE REAL-TIME SYNC & AUTO-UPLOAD FOR JOURNALS
  useEffect(() => {
    let isSubscribed = true;
    const journalsCol = collection(db, 'journals');

    const unsubscribe = onSnapshot(
      journalsCol,
      (snapshot) => {
        if (!isSubscribed) return;
        setCloudStatus('connected');

        const remoteMap = new Map<string, JournalEntry>();
        snapshot.docs.forEach((docSnap) => {
          remoteMap.set(docSnap.id, docSnap.data() as JournalEntry);
        });

        // Safe auto-migration: scan all known local storage keys and storage slots
        const localJournalMap = new Map<string, JournalEntry>();
        const candidateKeys = [
          'ppkn_journals_xib_v4',
          'ppkn_journals_xib_v3',
          'ppkn_journals_xib_v2',
          'ppkn_journals_xib',
          'ppkn_journals',
          'journals',
        ];

        candidateKeys.forEach((k) => {
          try {
            const raw = localStorage.getItem(k);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) {
                parsed.forEach((j) => {
                  if (j && j.id && j.studentName) {
                    localJournalMap.set(j.id, j);
                  }
                });
              }
            }
          } catch (e) {}
        });

        // Also inspect any other key in localStorage in case custom key was used
        try {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('journal') || key.includes('xib') || key.includes('ppkn'))) {
              const raw = localStorage.getItem(key);
              if (raw) {
                try {
                  const parsed = JSON.parse(raw);
                  if (Array.isArray(parsed)) {
                    parsed.forEach((j) => {
                      if (j && j.id && j.studentName && j.reflection) {
                        localJournalMap.set(j.id, j);
                      }
                    });
                  } else if (parsed && parsed.id && parsed.studentName && parsed.reflection) {
                    localJournalMap.set(parsed.id, parsed);
                  }
                } catch (e) {}
              }
            }
          }
        } catch (e) {}

        // Upload any student journals that only existed on this local phone to remote Firestore
        let newlyUploadedCount = 0;
        localJournalMap.forEach((localJ, jId) => {
          if (!remoteMap.has(jId)) {
            remoteMap.set(jId, localJ);
            newlyUploadedCount++;
            setDoc(doc(db, 'journals', jId), localJ, { merge: true }).catch((err) => {
              console.warn('Auto-sync local journal failed:', err);
            });
          }
        });

        if (newlyUploadedCount > 0) {
          showToast(`Berhasil menyinkronkan ${newlyUploadedCount} jurnal dari HP ke database online!`);
        }

        const mergedJournals = Array.from(remoteMap.values());
        mergedJournals.sort((a, b) => (b.weekNumber || 0) - (a.weekNumber || 0));

        setJournals(mergedJournals);
        localStorage.setItem('ppkn_journals_xib_v4', JSON.stringify(mergedJournals));
      },
      (error) => {
        console.error('Firestore journals onSnapshot error:', error);
        setCloudStatus('error');
        try {
          handleFirestoreError(error, OperationType.LIST, 'journals');
        } catch (e) {}
      }
    );

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, []);

  // 2. FIRESTORE REAL-TIME SYNC FOR FORUM TOPICS
  useEffect(() => {
    let isSubscribed = true;
    const topicsCol = collection(db, 'forum_topics');

    const unsubscribe = onSnapshot(
      topicsCol,
      (snapshot) => {
        if (!isSubscribed) return;
        if (snapshot.empty) {
          // Initialize online database with curriculum topics
          INITIAL_TOPICS.forEach((t) => {
            setDoc(doc(db, 'forum_topics', t.id), t, { merge: true }).catch(console.error);
          });
          setTopics(INITIAL_TOPICS);
        } else {
          const remoteTopics: ForumTopic[] = [];
          snapshot.docs.forEach((d) => {
            remoteTopics.push(d.data() as ForumTopic);
          });
          remoteTopics.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
          setTopics(remoteTopics);
          localStorage.setItem('ppkn_topics_xib_v4', JSON.stringify(remoteTopics));
        }
      },
      (error) => {
        console.error('Firestore topics onSnapshot error:', error);
        try {
          handleFirestoreError(error, OperationType.LIST, 'forum_topics');
        } catch (e) {}
      }
    );

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, []);

  // Dynamically calculate submission counts & scores per student based on live journals
  const studentsWithStats = useMemo(() => {
    return students.map((std) => {
      const studentJournals = journals.filter((j) => j.studentId === std.id);
      const graded = studentJournals.filter((j) => j.status === 'graded' && typeof j.score === 'number');
      const avg =
        graded.length > 0
          ? Math.round(graded.reduce((acc, curr) => acc + (curr.score || 0), 0) / graded.length)
          : undefined;

      return {
        ...std,
        submittedCount: studentJournals.length,
        averageScore: avg,
      };
    });
  }, [students, journals]);

  // Actions: Journal Save (Student writes journal)
  const handleSaveJournal = async (newEntry: JournalEntry) => {
    // 1. Instant local update
    const updated = [newEntry, ...journals.filter((j) => j.id !== newEntry.id)];
    setJournals(updated);
    localStorage.setItem('ppkn_journals_xib_v4', JSON.stringify(updated));

    // 2. Direct online sync to Firestore
    try {
      await setDoc(doc(db, 'journals', newEntry.id), newEntry, { merge: true });
      showToast(`Jurnal Pekan ke-${newEntry.weekNumber} berhasil dikirim ke database Guru!`);
    } catch (err) {
      console.error('Error saving journal to Firestore:', err);
      showToast(`Jurnal tersimpan di HP. Akan otomatis tersinkron ke Guru.`);
      try {
        handleFirestoreError(err, OperationType.WRITE, `journals/${newEntry.id}`);
      } catch (e) {}
    }
  };

  // Actions: Teacher Grading (Guru menilai portofolio siswa)
  const handleSaveTeacherFeedback = async (
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

    const target = journals.find((j) => j.id === journalId);
    const updatedJournal: JournalEntry = {
      ...(target || {
        id: journalId,
        weekNumber: 1,
        date: today,
        studentId: 'std-1',
        studentName: 'Siswa',
        classGroup: 'XI-B',
        chapter: 'Bab 2',
        topicTitle: 'Refleksi PPKn',
        reflection: { facts: '', feelings: '', findings: '', future: '' },
        relatedSila: [4],
        status: 'submitted',
      }),
      status: 'graded',
      rubric,
      score: totalScore,
      teacherFeedback: feedback,
      teacherFeedbackDate: today,
    };

    // 1. Instant local update
    const updatedJournals = journals.map((j) => (j.id === journalId ? updatedJournal : j));
    setJournals(updatedJournals);
    localStorage.setItem('ppkn_journals_xib_v4', JSON.stringify(updatedJournals));

    if (selectedJournal && selectedJournal.id === journalId) {
      setSelectedJournal(updatedJournal);
    }

    // 2. Sync to Firestore
    try {
      await setDoc(doc(db, 'journals', journalId), updatedJournal, { merge: true });
      showToast(`Penilaian berhasil disimpan online (Skor: ${totalScore}/100)!`);
    } catch (err) {
      console.error('Error updating feedback in Firestore:', err);
      showToast(`Penilaian tersimpan di lokal.`);
      try {
        handleFirestoreError(err, OperationType.UPDATE, `journals/${journalId}`);
      } catch (e) {}
    }
  };

  // Actions: Forum Poll Vote
  const handleVotePoll = async (topicId: string, optionId: string) => {
    const voterId = currentUser.isTeacher ? 'teacher-id' : currentUser.student?.id || 'std-1';

    const currentTopic = topics.find((t) => t.id === topicId);
    if (!currentTopic || !currentTopic.poll) return;
    if (currentTopic.poll.voterIds.includes(voterId)) return;

    const updatedOptions = currentTopic.poll.options.map((opt) => {
      if (opt.id === optionId) {
        return { ...opt, votes: opt.votes + 1 };
      }
      return opt;
    });

    const updatedTopic: ForumTopic = {
      ...currentTopic,
      poll: {
        ...currentTopic.poll,
        options: updatedOptions,
        totalVotes: currentTopic.poll.totalVotes + 1,
        voterIds: [...currentTopic.poll.voterIds, voterId],
      },
    };

    setTopics((prev) => prev.map((t) => (t.id === topicId ? updatedTopic : t)));
    showToast('Suara polling Anda berhasil dicatat.');

    try {
      await setDoc(doc(db, 'forum_topics', topicId), updatedTopic, { merge: true });
    } catch (err) {
      console.error('Error voting poll in Firestore:', err);
    }
  };

  // Actions: Forum Comment
  const handleAddComment = async (topicId: string, stance: ArgumentStance, content: string) => {
    const authorId = currentUser.isTeacher ? 'teacher-id' : currentUser.student?.id || 'std-1';
    const authorName = currentUser.isTeacher
      ? 'Jamal Akmalludin,S.Pd (Guru PPKn)'
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

    const currentTopic = topics.find((t) => t.id === topicId);
    if (!currentTopic) return;

    const updatedTopic: ForumTopic = {
      ...currentTopic,
      comments: [newComment, ...currentTopic.comments],
    };

    setTopics((prev) => prev.map((t) => (t.id === topicId ? updatedTopic : t)));
    showToast('Argumen Anda berhasil dipublikasikan di forum diskusi.');

    try {
      await setDoc(doc(db, 'forum_topics', topicId), updatedTopic, { merge: true });
    } catch (err) {
      console.error('Error adding comment to Firestore:', err);
    }
  };

  // Actions: Forum Reply
  const handleAddReply = async (topicId: string, commentId: string, content: string) => {
    const authorId = currentUser.isTeacher ? 'teacher-id' : currentUser.student?.id || 'std-1';
    const authorName = currentUser.isTeacher
      ? 'Jamal Akmalludin,S.Pd (Guru PPKn)'
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

    const currentTopic = topics.find((t) => t.id === topicId);
    if (!currentTopic) return;

    const updatedTopic: ForumTopic = {
      ...currentTopic,
      comments: currentTopic.comments.map((cmt) => {
        if (cmt.id === commentId) {
          return {
            ...cmt,
            replies: [...cmt.replies, newReply],
          };
        }
        return cmt;
      }),
    };

    setTopics((prev) => prev.map((t) => (t.id === topicId ? updatedTopic : t)));
    showToast('Tanggapan berhasil dikirim.');

    try {
      await setDoc(doc(db, 'forum_topics', topicId), updatedTopic, { merge: true });
    } catch (err) {
      console.error('Error adding reply to Firestore:', err);
    }
  };

  // Actions: Like Comment
  const handleLikeComment = async (topicId: string, commentId: string) => {
    const voterId = currentUser.isTeacher ? 'teacher-id' : currentUser.student?.id || 'std-1';

    const currentTopic = topics.find((t) => t.id === topicId);
    if (!currentTopic) return;

    const updatedTopic: ForumTopic = {
      ...currentTopic,
      comments: currentTopic.comments.map((cmt) => {
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

    setTopics((prev) => prev.map((t) => (t.id === topicId ? updatedTopic : t)));

    try {
      await setDoc(doc(db, 'forum_topics', topicId), updatedTopic, { merge: true });
    } catch (err) {
      console.error('Error liking comment in Firestore:', err);
    }
  };

  // Actions: Create Topic
  const handleCreateTopic = async (newTopic: ForumTopic) => {
    setTopics((prev) => [newTopic, ...prev]);
    showToast('Topik musyawarah baru berhasil dibuka.');

    try {
      await setDoc(doc(db, 'forum_topics', newTopic.id), newTopic, { merge: true });
    } catch (err) {
      console.error('Error saving new topic to Firestore:', err);
    }
  };

  // Actions: Teacher Authorization & Locking (Secret Code: 11a1b13c)
  const handleTeacherAuthSuccess = () => {
    setIsTeacherAuthenticated(true);
    try {
      sessionStorage.setItem('ppkn_teacher_auth_11a1b13c', 'true');
    } catch (e) {}
    setIsTeacherAuthModalOpen(false);
    setCurrentUser({ isTeacher: true });
    setActiveTab('teacher');
    showToast('Kode terverifikasi! Selamat datang di Dashboard Guru, Bapak Jamal Akmalludin,S.Pd.');
  };

  const handleLockTeacher = () => {
    setIsTeacherAuthenticated(false);
    try {
      sessionStorage.removeItem('ppkn_teacher_auth_11a1b13c');
    } catch (e) {}
    const defaultStudent = students[0] || INITIAL_STUDENTS[0];
    setCurrentUser({ isTeacher: false, student: defaultStudent });
    setActiveTab('journals');
    showToast('Akses guru PPKn berhasil dikunci.');
  };

  // Actions: User Switch
  const handleSwitchUser = (isTeacher: boolean, student?: Student) => {
    if (isTeacher) {
      if (!isTeacherAuthenticated) {
        setIsTeacherAuthModalOpen(true);
        return;
      }
      setCurrentUser({ isTeacher: true });
      showToast('Beralih ke Mode Guru PPKn (Jamal Akmalludin,S.Pd).');
    } else if (student) {
      setCurrentUser({ isTeacher: false, student });
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
        isTeacherAuthenticated={isTeacherAuthenticated}
        onRequestTeacherAuth={() => setIsTeacherAuthModalOpen(true)}
        onLockTeacher={handleLockTeacher}
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
            isTeacherAuthenticated ? (
              <TeacherDashboardTab
                students={studentsWithStats}
                journals={journals}
                onSelectJournal={(j) => setSelectedJournal(j)}
                onLockTeacher={handleLockTeacher}
                cloudStatus={cloudStatus}
              />
            ) : null
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
        students={studentsWithStats}
        currentUser={currentUser}
        isTeacherAuthenticated={isTeacherAuthenticated}
        onRequestTeacherAuth={() => setIsTeacherAuthModalOpen(true)}
        onLockTeacher={handleLockTeacher}
        onSwitchUser={handleSwitchUser}
        onAddStudent={handleAddStudent}
      />

      {/* Teacher Authentication Modal */}
      <TeacherAuthModal
        isOpen={isTeacherAuthModalOpen}
        onClose={() => setIsTeacherAuthModalOpen(false)}
        onSuccess={handleTeacherAuthSuccess}
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
