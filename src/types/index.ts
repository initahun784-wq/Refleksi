/**
 * Types for PPKn Class 11 Reflection & Democracy Platform
 * Based on Buku Teks Utama Pendidikan Pancasila Kelas XI (Kemendikbudristek & BPIP 2023)
 * Penulis: Sri Cahyati, Siti Nurjanah, Ali Usman
 */

export interface Student {
  id: string;
  name: string;
  absenNumber: number;
  nisn: string;
  classGroup: string; // "XI-B"
  avatarColor: string;
  submittedCount: number;
  averageScore?: number;
}

export type PancasilaSila = 1 | 2 | 3 | 4 | 5;

export interface Reflection4F {
  facts: string; // Peristiwa (Aktivitas, fakta kegiatan belajar PPKn)
  feelings: string; // Perasaan (Respon emosional & refleksi batin)
  findings: string; // Pembelajaran (Konsep konstitusi & nilai Pancasila)
  future: string; // Aksi Nyata (Komitmen perilaku demokratis sehari-hari)
}

/**
 * Rubrik Penilaian Bernalar Kritis tentang Sikap Demokratis
 * Sumber: Buku Pendidikan Pancasila Kelas XI, Tabel 2.4 hlm. 62
 * Nilai Akhir = Jumlah (v) x 25 (Skor 25 - 100)
 */
export interface RubricCriteria {
  memprosesInformasi: number; // 1-4: Kemampuan memproses informasi kualitatif & kuantitatif
  menganalisisInformasi: number; // 1-4: Menganalisis dan mengevaluasi penalaran
  refleksiPemikiran: number; // 1-4: Merefleksikan pemikiran dan proses berpikir
  mengambilKesimpulan: number; // 1-4: Mengambil keputusan/kesimpulan solutif
}

export interface JournalEntry {
  id: string;
  weekNumber: number;
  date: string;
  studentId: string;
  studentName: string;
  classGroup: string;
  chapter: 'Bab 1' | 'Bab 2' | 'Bab 3' | 'Bab 4';
  topicTitle: string;
  activityRef?: string; // e.g. "Aktivitas 2.1", "Aktivitas 2.7", "Aktivitas 2.9"
  reflection: Reflection4F;
  relatedSila: PancasilaSila[];
  attachmentUrl?: string;
  attachmentName?: string;
  status: 'draft' | 'submitted' | 'graded';
  score?: number; // 0 - 100 (dari skor rubrik x 25)
  rubric?: RubricCriteria;
  teacherFeedback?: string;
  teacherFeedbackDate?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  voterIds: string[]; // student ids who voted
}

export type ArgumentStance = 'pro' | 'kontra' | 'solutif' | 'netral';

export interface ForumReply {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'siswa' | 'guru';
  classGroup?: string;
  content: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
}

export interface ForumComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'siswa' | 'guru';
  classGroup?: string;
  stance: ArgumentStance;
  content: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
  replies: ForumReply[];
}

export interface ForumTopic {
  id: string;
  title: string;
  chapter: string; // e.g. "Bab 2: Demokrasi Berdasarkan UUD NRI 1945"
  subtopic: string; // e.g. "Era Keterbukaan Informasi", "Periodisasi Konstitusi"
  description: string;
  caseStudy: string; // Studi kasus kontekstual dari buku teks
  bookReference?: string; // Halaman buku referensi
  authorName: string;
  createdAt: string;
  poll?: Poll;
  comments: ForumComment[];
  isPinned?: boolean;
}

export interface DemocracyPillar {
  number: number;
  title: string;
  founderQuote: string;
  explanation: string;
  schoolApplication: string;
}

export interface SelfAssessmentItem {
  id: number;
  behavior: string;
  frequency?: 'Selalu' | 'Sering' | 'Kadang-Kadang' | 'Tidak Pernah';
  reason?: string;
}
