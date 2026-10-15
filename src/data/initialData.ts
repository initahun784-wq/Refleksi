import { Student, JournalEntry, ForumTopic, DemocracyPillar, SelfAssessmentItem } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    name: 'AL FATHIR FAHREZI PUTRA WIGUNA',
    absenNumber: 1,
    nisn: '0081230001',
    classGroup: 'XI-B',
    avatarColor: 'bg-blue-600',
    submittedCount: 0,
  },
  {
    id: 'std-2',
    name: 'ALI SAEPUL',
    absenNumber: 2,
    nisn: '0081230002',
    classGroup: 'XI-B',
    avatarColor: 'bg-emerald-600',
    submittedCount: 0,
  },
  {
    id: 'std-3',
    name: 'AQILAH OCTA KURNIA PUTRI',
    absenNumber: 3,
    nisn: '0081230003',
    classGroup: 'XI-B',
    avatarColor: 'bg-rose-600',
    submittedCount: 0,
  },
  {
    id: 'std-4',
    name: 'ARDIENATA DWI RUSPENDI',
    absenNumber: 4,
    nisn: '0081230004',
    classGroup: 'XI-B',
    avatarColor: 'bg-indigo-600',
    submittedCount: 0,
  },
  {
    id: 'std-5',
    name: 'ARIN SAPTAR HASANUDIN',
    absenNumber: 5,
    nisn: '0081230005',
    classGroup: 'XI-B',
    avatarColor: 'bg-amber-600',
    submittedCount: 0,
  },
  {
    id: 'std-6',
    name: 'ASHA ZASKIA BANOWATI',
    absenNumber: 6,
    nisn: '0081230006',
    classGroup: 'XI-B',
    avatarColor: 'bg-purple-600',
    submittedCount: 0,
  },
  {
    id: 'std-7',
    name: 'AURA BILQIS',
    absenNumber: 7,
    nisn: '0081230007',
    classGroup: 'XI-B',
    avatarColor: 'bg-pink-600',
    submittedCount: 0,
  },
  {
    id: 'std-8',
    name: 'AYATUL HUSNA',
    absenNumber: 8,
    nisn: '0081230008',
    classGroup: 'XI-B',
    avatarColor: 'bg-teal-600',
    submittedCount: 0,
  },
  {
    id: 'std-9',
    name: 'CHAMELLIA RAGIL SYAFITRI',
    absenNumber: 9,
    nisn: '0081230009',
    classGroup: 'XI-B',
    avatarColor: 'bg-violet-600',
    submittedCount: 0,
  },
  {
    id: 'std-10',
    name: 'DEA ZEVA AISYAH',
    absenNumber: 10,
    nisn: '0081230010',
    classGroup: 'XI-B',
    avatarColor: 'bg-cyan-600',
    submittedCount: 0,
  },
  {
    id: 'std-11',
    name: 'DEWI WILLA SETIASIH SOBARI',
    absenNumber: 11,
    nisn: '0081230011',
    classGroup: 'XI-B',
    avatarColor: 'bg-blue-600',
    submittedCount: 0,
  },
  {
    id: 'std-12',
    name: 'DINA PUSPITA',
    absenNumber: 12,
    nisn: '0081230012',
    classGroup: 'XI-B',
    avatarColor: 'bg-emerald-600',
    submittedCount: 0,
  },
  {
    id: 'std-13',
    name: 'ELVIRA NURFADILAH',
    absenNumber: 13,
    nisn: '0081230013',
    classGroup: 'XI-B',
    avatarColor: 'bg-rose-600',
    submittedCount: 0,
  },
  {
    id: 'std-14',
    name: 'FAIZAL AKBAR NUR ALAMSYAH',
    absenNumber: 14,
    nisn: '0081230014',
    classGroup: 'XI-B',
    avatarColor: 'bg-indigo-600',
    submittedCount: 0,
  },
  {
    id: 'std-15',
    name: 'FARREL PRIYATAMA SAGRAHA',
    absenNumber: 15,
    nisn: '0081230015',
    classGroup: 'XI-B',
    avatarColor: 'bg-amber-600',
    submittedCount: 0,
  },
  {
    id: 'std-16',
    name: 'FELLA DWI NURYANI',
    absenNumber: 16,
    nisn: '0081230016',
    classGroup: 'XI-B',
    avatarColor: 'bg-purple-600',
    submittedCount: 0,
  },
  {
    id: 'std-17',
    name: 'FIRDA KAMILAH',
    absenNumber: 17,
    nisn: '0081230017',
    classGroup: 'XI-B',
    avatarColor: 'bg-teal-600',
    submittedCount: 0,
  },
  {
    id: 'std-18',
    name: 'GHIFANI AGHNA RAMADHANI',
    absenNumber: 18,
    nisn: '0081230018',
    classGroup: 'XI-B',
    avatarColor: 'bg-blue-600',
    submittedCount: 0,
  },
  {
    id: 'std-19',
    name: 'GITA ZAHRA ARYANA',
    absenNumber: 19,
    nisn: '0081230019',
    classGroup: 'XI-B',
    avatarColor: 'bg-rose-600',
    submittedCount: 0,
  },
  {
    id: 'std-20',
    name: 'INTAN FITRIA DEWI',
    absenNumber: 20,
    nisn: '0081230020',
    classGroup: 'XI-B',
    avatarColor: 'bg-emerald-600',
    submittedCount: 0,
  },
  {
    id: 'std-21',
    name: 'JIHAN RAHMAWATI',
    absenNumber: 21,
    nisn: '0081230021',
    classGroup: 'XI-B',
    avatarColor: 'bg-violet-600',
    submittedCount: 0,
  },
  {
    id: 'std-22',
    name: 'KIKA DIANDRA PARAMITHA',
    absenNumber: 22,
    nisn: '0081230022',
    classGroup: 'XI-B',
    avatarColor: 'bg-indigo-600',
    submittedCount: 0,
  },
  {
    id: 'std-23',
    name: 'LIDIA ARNETA MARPAUNG',
    absenNumber: 23,
    nisn: '0081230023',
    classGroup: 'XI-B',
    avatarColor: 'bg-cyan-600',
    submittedCount: 0,
  },
  {
    id: 'std-24',
    name: 'MEDINA BUMI AYU',
    absenNumber: 24,
    nisn: '0081230024',
    classGroup: 'XI-B',
    avatarColor: 'bg-pink-600',
    submittedCount: 0,
  },
  {
    id: 'std-25',
    name: 'MILFA JAVANA ALMIRA',
    absenNumber: 25,
    nisn: '0081230025',
    classGroup: 'XI-B',
    avatarColor: 'bg-amber-600',
    submittedCount: 0,
  },
  {
    id: 'std-26',
    name: 'MUFADHAL ASYKAR MURRANT',
    absenNumber: 26,
    nisn: '0081230026',
    classGroup: 'XI-B',
    avatarColor: 'bg-blue-600',
    submittedCount: 0,
  },
  {
    id: 'std-27',
    name: 'NAURA GHAISANI SAHIRA',
    absenNumber: 27,
    nisn: '0081230027',
    classGroup: 'XI-B',
    avatarColor: 'bg-teal-600',
    submittedCount: 0,
  },
  {
    id: 'std-28',
    name: 'NAYSHA OKTAVIA',
    absenNumber: 28,
    nisn: '0081230028',
    classGroup: 'XI-B',
    avatarColor: 'bg-rose-600',
    submittedCount: 0,
  },
  {
    id: 'std-29',
    name: 'NAZWA SEKAR SAHRI',
    absenNumber: 29,
    nisn: '0081230029',
    classGroup: 'XI-B',
    avatarColor: 'bg-purple-600',
    submittedCount: 0,
  },
  {
    id: 'std-30',
    name: 'PUTRI RAHAYU',
    absenNumber: 30,
    nisn: '0081230030',
    classGroup: 'XI-B',
    avatarColor: 'bg-emerald-600',
    submittedCount: 0,
  },
  {
    id: 'std-31',
    name: 'QUENNA RAISYA TAFZILLAH PAMUJI',
    absenNumber: 31,
    nisn: '0081230031',
    classGroup: 'XI-B',
    avatarColor: 'bg-violet-600',
    submittedCount: 0,
  },
  {
    id: 'std-32',
    name: 'RADJA SAPUTRA ANWAR',
    absenNumber: 32,
    nisn: '0081230032',
    classGroup: 'XI-B',
    avatarColor: 'bg-blue-600',
    submittedCount: 0,
  },
  {
    id: 'std-33',
    name: 'RATU RISMAWAN SANGGARA HARTA',
    absenNumber: 33,
    nisn: '0081230033',
    classGroup: 'XI-B',
    avatarColor: 'bg-pink-600',
    submittedCount: 0,
  },
  {
    id: 'std-34',
    name: 'RESTA SALSA BELINDA',
    absenNumber: 34,
    nisn: '0081230034',
    classGroup: 'XI-B',
    avatarColor: 'bg-indigo-600',
    submittedCount: 0,
  },
  {
    id: 'std-35',
    name: 'RIFA AGUSTIN',
    absenNumber: 35,
    nisn: '0081230035',
    classGroup: 'XI-B',
    avatarColor: 'bg-teal-600',
    submittedCount: 0,
  },
  {
    id: 'std-36',
    name: 'SAUSAN SANIYYAH MULYADI',
    absenNumber: 36,
    nisn: '0081230036',
    classGroup: 'XI-B',
    avatarColor: 'bg-amber-600',
    submittedCount: 0,
  },
  {
    id: 'std-37',
    name: 'SERGIO ALVAREZ MARBUN',
    absenNumber: 37,
    nisn: '0081230037',
    classGroup: 'XI-B',
    avatarColor: 'bg-blue-600',
    submittedCount: 0,
  },
  {
    id: 'std-38',
    name: 'SHABITA SHAFA',
    absenNumber: 38,
    nisn: '0081230038',
    classGroup: 'XI-B',
    avatarColor: 'bg-purple-600',
    submittedCount: 0,
  },
  {
    id: 'std-39',
    name: 'TAUFAN MUHAMAD RIZQI',
    absenNumber: 39,
    nisn: '0081230039',
    classGroup: 'XI-B',
    avatarColor: 'bg-emerald-600',
    submittedCount: 0,
  },
  {
    id: 'std-40',
    name: 'VIRGIN LAUDYA SAKHIRA',
    absenNumber: 40,
    nisn: '0081230040',
    classGroup: 'XI-B',
    avatarColor: 'bg-rose-600',
    submittedCount: 0,
  },
  {
    id: 'std-41',
    name: 'ZIFARA CAHYA HADISTI',
    absenNumber: 41,
    nisn: '0081230041',
    classGroup: 'XI-B',
    avatarColor: 'bg-cyan-600',
    submittedCount: 0,
  },
];

/**
 * Daftar Jurnal Refleksi Siswa Awal
 * Dikosongkan agar siswa kelas XI-B dapat mengunggah jawaban jurnal secara mandiri
 */
export const INITIAL_JOURNALS: JournalEntry[] = [];

/**
 * Topik Diskusi Interaktif Forum Demokrasi
 * Disiapkan oleh guru PPKn Jamal Akmalludin,S.Pd dan referensi buku teks
 * Jawaban/komentar siswa dibersihkan agar siswa dapat mengisi argumen mereka sendiri
 */
export const INITIAL_TOPICS: ForumTopic[] = [
  {
    id: 'tpc-1',
    title: 'Indeks Demokrasi Indonesia EIU 6,71 (Flawed Democracy): Bagaimana Generasi Muda Memperkuat Budaya Politik?',
    chapter: 'Bab 2: Demokrasi Berdasarkan UUD NRI Tahun 1945',
    subtopic: 'Evaluasi Kualitas Demokrasi & Budaya Politik',
    description: 'Berdasarkan data Economist Intelligence Unit (EIU) di Buku Teks halaman 56, Indonesia meraih skor 6,71 dan tergolong demokrasi lemah (flawed democracy) akibat penurunan nilai budaya politik yang demokratis (4,38) dan kebebasan sipil (6,18). Apa akar penyebabnya di era medsos dan bagaimana siswa SMA dapat memperbaikinya?',
    caseStudy: 'Dalam 12 tahun terakhir, EIU mencatat tren naik-turun indeks demokrasi Indonesia. Penurunan terdalam terjadi pada indikator budaya politik dan kebebasan sipil, di mana masyarakat rentan terpolarisasi dan saling serang di media sosial saat berbeda pilihan politik.',
    bookReference: 'Buku Teks Pendidikan Pancasila Kelas XI, Bab 2 Subbab C, Halaman 56-57',
    authorName: 'Jamal Akmalludin,S.Pd (Guru PPKn)',
    createdAt: '14 Oktober 2026',
    isPinned: true,
    poll: {
      id: 'poll-1',
      question: 'Dari 5 indikator negara demokrasi (Affan Gaffar / EIU), sektor mana yang paling mendesak dibenahi oleh pelajar kelas 11?',
      options: [
        { id: 'opt-1', text: 'Budaya santun berpendapat & menghargai perbedaan di medsos', votes: 0 },
        { id: 'opt-2', text: 'Pendidikan literasi menangkal berita bohong / hoaks politik', votes: 0 },
        { id: 'opt-3', text: 'Partisipasi kritis pemilih pemula menolak politik uang', votes: 0 },
        { id: 'opt-4', text: 'Akuntabilitas pengurus organisasi kesiswaan / MPK / OSIS', votes: 0 },
      ],
      totalVotes: 0,
      voterIds: [],
    },
    comments: []
  },
  {
    id: 'tpc-2',
    title: 'Meme dan Mural sebagai Media Kritik: Apakah Sesuai Nilai Demokrasi Pancasila?',
    chapter: 'Bab 2: Demokrasi Berdasarkan UUD NRI Tahun 1945',
    subtopic: 'Media dan Ekspresi Aspirasi di Ruang Publik',
    description: 'Di halaman 57-58 Buku Teks, disajikan Gambar 2.8 mengenai mural sebagai media menyampaikan kritik. Bagaimana pandangan kalian mengenai meme dan mural sebagai media penyalur aspirasi di ruang publik? Di mana batas antara kritik konstruktif dan pelanggaran ketertiban?',
    caseStudy: 'Meme dan mural merupakan ekspresi para seniman dalam menyampaikan pesan terhadap kepuasan kinerja pemerintah atau elite politik. Pesan singkat dan langsung pada intinya dianggap media yang efektif menarik perhatian publik, namun sebagian pihak menganggapnya merusak keindahan kota jika dibuat di fasilitas umum tanpa izin.',
    bookReference: 'Buku Teks Pendidikan Pancasila Kelas XI, Bab 2 Subbab C, Halaman 57-58',
    authorName: 'Siti Nurjanah, S.Pd., M.Pd (Penulis Buku)',
    createdAt: '14 Oktober 2026',
    isPinned: false,
    poll: {
      id: 'poll-2',
      question: 'Bagaimana penilaian kalian terhadap kritik sosial lewat meme dan mural di tempat umum?',
      options: [
        { id: 'opt-21', text: 'Bentuk partisipasi demokratis yang sah jika mengedukasi & tidak mengandung fitnah', votes: 0 },
        { id: 'opt-22', text: 'Sebaiknya difasilitasi di dinding mural khusus resmi pemerintah daerah', votes: 0 },
        { id: 'opt-23', text: 'Kurang tepat karena rentan melanggar ketertiban & kebersihan fasilitas publik', votes: 0 },
      ],
      totalVotes: 0,
      voterIds: [],
    },
    comments: []
  },
  {
    id: 'tpc-3',
    title: 'Demokrasi Asli Desa (Bung Hatta 1960) vs Demokrasi Elektoral Modern: Pelajaran untuk Pemilihan Ketua OSIS',
    chapter: 'Bab 2: Demokrasi Berdasarkan UUD NRI Tahun 1945',
    subtopic: 'Akar Tradisi Demokrasi Nusantara',
    description: 'Bung Hatta menyatakan Indonesia sejak dahulu telah mempraktikkan demokrasi asli desa (rembug desa di Jawa, kerapatan adat nagari di Sumbar, riungan di Jabar, tudang sipulung di Sulsel). Bagaimana kita mengadopsi nilai musyawarah konsensus ini dalam pemilihan ketua OSIS/MPK sekolah agar tidak terjadi permusuhan antarpendukung calon?',
    caseStudy: 'Dalam Pilkasis sering terjadi kampanye hitam di media sosial antarpendukung kandidat yang berujung pada kerenggangan pertemanan di kelas pascapemilihan.',
    bookReference: 'Buku Teks Pendidikan Pancasila Kelas XI, Bab 2 Subbab A, Halaman 34-35',
    authorName: 'Jamal Akmalludin,S.Pd (Guru PPKn)',
    createdAt: '14 Oktober 2026',
    isPinned: false,
    comments: []
  },
  {
    id: 'tpc-4',
    title: '5 Kesepakatan Dasar MPR: Mengapa Khusus Bentuk NKRI Tidak Boleh Diubah?',
    chapter: 'Bab 2: Demokrasi Berdasarkan UUD NRI Tahun 1945',
    subtopic: 'Hukum Ketatanegaraan & Amandemen UUD 1945',
    description: 'Sesuai Pasal 37 ayat (5) UUD 1945 dan Kesepakatan Dasar MPR (hlm. 54 buku teks), bentuk Negara Kesatuan Republik Indonesia tidak dapat dilakukan perubahan. Mengapa bentuk kesatuan dianggap paling tepat mewadahi kemajemukan bangsa Indonesia dibanding negara serikat (federal)?',
    caseStudy: 'Indonesia pernah mengalami bentuk Republik Indonesia Serikat (RIS) pada 27 Desember 1949 s.d. 17 Agustus 1950, namun tuntutan rakyat dari negara-negara bagian (dimulai dari Jawa Timur dan Pasundan) mendesak kembali ke Negara Kesatuan karena federalisme dipandang sebagai siasat pecah belah kolonial.',
    bookReference: 'Buku Teks Pendidikan Pancasila Kelas XI, Bab 2 hlm. 40-42 & 54',
    authorName: 'Sri Cahyati, S.Pd., M.Pd (Penulis Buku)',
    createdAt: '14 Oktober 2026',
    isPinned: false,
    comments: []
  }
];

export const DEMOCRACY_PILLARS: DemocracyPillar[] = [
  {
    number: 1,
    title: 'Demokrasi yang Ber-Ketuhanan Yang Maha Esa',
    founderQuote: 'Sistem dan perilaku penyelenggaraan kenegaraan RI harus taat asas, konsisten, atau sesuai dengan nilai-nilai dan kaidah-kaidah dasar Ketuhanan YME.',
    explanation: 'Kekuasaan politik tidak bebas nilai dan tidak boleh melahirkan kezaliman. Setiap pemimpin dan warga negara bertanggung jawab secara moral kepada Tuhan.',
    schoolApplication: 'Menghargai ibadah teman sekelas saat kerja kelompok, serta menolak kecurangan saat pemilihan ketua kelas karena takut akan dosa.'
  },
  {
    number: 2,
    title: 'Demokrasi dengan Kecerdasan (Rule of Intelligence)',
    founderQuote: 'Mengatur dan menyelenggarakan demokrasi bukan dengan kekuatan naluri, emosi, atau kekuatan massa semata, melainkan dengan kecerdasan rohaniah, aqliyah, dan rasional.',
    explanation: 'Demokrasi menuntut rakyat dan pemimpin yang cerdas, mampu menimbang argumen logis, menganalisis data, dan menolak kabar bohong atau provokasi murahan.',
    schoolApplication: 'Memeriksa kebenaran fakta sebelum menyebarkan informasi di grup WhatsApp kelas dan mengutamakan data dalam debat PPKn.'
  },
  {
    number: 3,
    title: 'Demokrasi yang Berkedaulatan Rakyat',
    founderQuote: 'Kekuasaan tertinggi berada di tangan rakyat, yang dipercayakan melalui wakil-wakilnya secara sah dan berlandaskan konstitusi.',
    explanation: 'Rakyat adalah pemilik sejati kedaulatan negara. Pejabat publik adalah pelayan masyarakat, bukan penguasa mutlak di atas rakyat.',
    schoolApplication: 'Aktif memberikan suara dalam pemilihan ketua OSIS dan berani menyampaikan masukan kepada pengurus MPK.'
  },
  {
    number: 4,
    title: 'Demokrasi dengan Rule of Law',
    founderQuote: 'Kekuasaan negara RI harus mengandung kebenaran hukum, keadilan hukum, kepastian hukum, dan kemanfaatan hukum.',
    explanation: 'Tidak ada seorang pun warga negara atau pejabat yang kebal hukum. Hukum adalah panglima tertinggi dalam menyelesaikan sengketa.',
    schoolApplication: 'Mematuhi tata tertib sekolah tanpa mencari celah atau meminta perlakuan istimewa bila melanggar aturan.'
  },
  {
    number: 5,
    title: 'Demokrasi dengan Pemisahan Kekuasaan Negara',
    founderQuote: 'Demokrasi menurut UUD 1945 mengenal pembagian dan pemisahan kekuasaan dengan sistem check and balances.',
    explanation: 'Kekuasaan eksekutif, legislatif, dan yudikatif dipisahkan agar tidak terjadi pemusatan kekuasaan dan otoritarianisme.',
    schoolApplication: 'Pemisahan wewenang yang jelas antara OSIS (pelaksana program) dan MPK (pengawas serta penampung aspirasi siswa).'
  },
  {
    number: 6,
    title: 'Demokrasi dengan Hak Asasi Manusia (HAM)',
    founderQuote: 'Demokrasi yang menghormati, melindungi, dan menegakkan hak-hak asasi manusia yang martabatnya diakui secara universal.',
    explanation: 'Kedaulatan mayoritas tidak boleh mengorbankan hak-hak dasar manusia, termasuk hak hidup, hak berserikat, dan kebebasan berpikir.',
    schoolApplication: 'Menghentikan perundungan (bullying) di kelas dan tidak mendiskriminasi teman berdasarkan suku atau status ekonomi.'
  },
  {
    number: 7,
    title: 'Demokrasi dengan Pengadilan yang Merdeka',
    founderQuote: 'Memberi kesempatan seluas-luasnya kepada pencari keadilan untuk memperoleh putusan yang adil tanpa intervensi pihak mana pun.',
    explanation: 'Hakim dan lembaga peradilan harus independen dari pengaruh penguasa politik atau kekuasaan modal.',
    schoolApplication: 'Guru bimbingan konseling atau tim disiplin sekolah bertindak netral tanpa memihak saat mendamaikan perselisihan antarsiswa.'
  },
  {
    number: 8,
    title: 'Demokrasi dengan Otonomi Daerah',
    founderQuote: 'Pemerintah daerah mengatur dan mengurus sendiri urusan pemerintahan menurut asas otonomi dan tugas pembantuan.',
    explanation: 'Pemerintah pusat tidak mendominasi seluruh urusan daerah, memberi ruang prakarsa lokal untuk memajukan potensi daerah masing-masing.',
    schoolApplication: 'Tiap regu ekstrakurikuler atau seksi bidang OSIS diberi kemandirian menyusun kreativitas acaranya sendiri.'
  },
  {
    number: 9,
    title: 'Demokrasi dengan Kemakmuran',
    founderQuote: 'Demokrasi bukan hanya untuk kebebasan berpolitik, tetapi harus bermuara pada kesejahteraan dan kemakmuran rakyat yang sebesar-besarnya.',
    explanation: 'Demokrasi politik harus beriringan dengan demokrasi ekonomi (Pasal 33 UUD 1945), menjamin kebutuhan pangan, kesehatan, dan pendidikan rakyat.',
    schoolApplication: 'Koperasi siswa yang dikelola secara jujur dan transparan untuk membantu perlengkapan belajar teman yang kurang mampu.'
  },
  {
    number: 10,
    title: 'Demokrasi yang Berkeadilan Sosial',
    founderQuote: 'Menggariskan keadilan sosial di antara berbagai kelompok, golongan, dan lapisan masyarakat tanpa monopoli segelintir elite.',
    explanation: 'Semua warga negara berhak menikmati hasil pembangunan secara adil, tidak ada kelompok yang tertinggal atau dipinggirkan.',
    schoolApplication: 'Menghindari klik eksklusif pertemanan (geng) dan berbagi fasilitas belajar kelas secara merata kepada seluruh siswa.'
  }
];

/**
 * 10 Butir Instrumen Daftar Perilaku Demokratis
 * Sumber: Buku Siswa Pendidikan Pancasila Kelas XI, Tabel 2.5 Halaman 65-66
 */
export const BOOK_SELF_ASSESSMENT_ITEMS: SelfAssessmentItem[] = [
  { id: 1, behavior: 'Memutuskan kepentingan keluarga secara mufakat' },
  { id: 2, behavior: 'Melaksanakan tugas harian di keluarga sesuai pembagian tugas' },
  { id: 3, behavior: 'Tidak memaksakan kehendak kepada anggota keluarga lainnya' },
  { id: 4, behavior: 'Tidak memilih-milih teman dalam bergaul di sekolah' },
  { id: 5, behavior: 'Menerima hasil keputusan rapat, meskipun tidak sependapat' },
  { id: 6, behavior: 'Menghindari permusuhan terhadap siapa pun di sekolah' },
  { id: 7, behavior: 'Berani menyampaikan pendapat saat rapat di karang taruna / organisasi' },
  { id: 8, behavior: 'Menghargai pendapat orang lain dalam musyawarah' },
  { id: 9, behavior: 'Tidak memotong pembicaraan orang lain saat berdiskusi' },
  { id: 10, behavior: 'Memberi kesempatan kepada orang lain untuk menyampaikan pendapat' },
];

/**
 * 5 Indikator Negara Demokrasi menurut Affan Gaffar (Buku hlm. 36)
 */
export const AFFAN_GAFFAR_INDICATORS = [
  {
    name: 'Akuntabilitas',
    definition: 'Semua pemegang jabatan yang dipilih rakyat harus dapat mempertanggungjawabkan ucapan, perilaku, dan kebijakan yang diambil kepada rakyat.',
    example: 'Laporan pertanggungjawaban terbuka pengurus OSIS dan transparansi anggaran kegiatan sekolah.'
  },
  {
    name: 'Rotasi Kekuasaan',
    definition: 'Pergantian pemegang jabatan dilakukan secara teratur, damai, dan berkala sesuai konstitusi.',
    example: 'Masa jabatan ketua OSIS dan pengurus kelas dibatasi satu tahun periode kepengurusan.'
  },
  {
    name: 'Rekrutmen Politik Terbuka',
    definition: 'Semua orang memiliki peluang dan kesempatan yang sama dalam mengisi kekosongan jabatan tanpa diskriminasi.',
    example: 'Setiap siswa kelas 11 berhak mendaftar sebagai calon ketua OSIS/MPK asal memenuhi syarat kriteria umum.'
  },
  {
    name: 'Pemilihan Umum',
    definition: 'Wujud rotasi kepemimpinan di mana setiap warga negara berhak memilih dan dipilih secara bebas sesuai hati nurani tanpa paksaan.',
    example: 'Pilkasis LUBER JURDIL dengan bilik suara tertutup dan penghitungan suara terbuka.'
  },
  {
    name: 'Pemenuhan Hak-Hak Dasar',
    definition: 'Setiap warga negara dapat menikmati hak dasar mereka secara bebas: hak berpendapat, berserikat, berkumpul, dan pers yang bebas.',
    example: 'Mading sekolah, podcast kesiswaan, dan ruang diskusi kelas yang terbuka bagi aspirasi seluruh siswa.'
  }
];

/**
 * Periodisasi Pemberlakuan UUD di Indonesia (Buku hlm. 37-54)
 */
export const CONSTITUTION_PERIODS = [
  {
    period: '18 Agustus 1945 - 27 Desember 1949',
    name: 'UUD 1945 (Periode Kemerdekaan)',
    characteristics: 'Konstitusi pertama penanda demokrasi konstitusional. Berstatus sementara (revolutiegrondwet) karena situasi mendesak mempertahankan kemerdekaan. Maklumat Wapres No. X dan Maklumat 3 November 1945 merintis multipartai.'
  },
  {
    period: '27 Desember 1949 - 17 Agustus 1950',
    name: 'Konstitusi RIS 1949 (Bentuk Federal/Serikat)',
    characteristics: 'Hasil Konferensi Meja Bundar (KMB). Indonesia berbentuk federasi dengan sistem pemerintahan parlementer yang dipimpin perdana menteri. Tuntutan rakyat negara-negara bagian mendesak kembali ke NKRI.'
  },
  {
    period: '17 Agustus 1950 - 5 Juli 1959',
    name: 'UUDS 1950 (Demokrasi Parlementer / Liberal)',
    characteristics: 'Bentuk negara kesatuan, sistem parlementer. Terjadi 7 kali pergantian kabinet dalam 9 tahun yang menimbulkan instabilitas politik. Badan Konstituante gagal menyusun UUD tetap hingga lahir Dekrit Presiden 5 Juli 1959.'
  },
  {
    period: '5 Juli 1959 - 19 Oktober 1999',
    name: 'UUD 1945 (Demokrasi Terpimpin & Orde Baru)',
    characteristics: 'Diberlakukan kembali melalui Dekrit Presiden 5 Juli 1959. Terjadi pemusatan kekuasaan eksekutif yang sangat besar pada presiden tanpa mekanisme checks and balances yang memadai, memicu tuntutan Reformasi 1998.'
  },
  {
    period: '19 Oktober 1999 - Sekarang',
    name: 'UUD NRI Tahun 1945 Hasil Amandemen (I s/d IV)',
    characteristics: 'Mengalami empat kali perubahan (1999, 2000, 2001, 2002). Pembatasan masa jabatan presiden maksimal 2 periode, pemilihan presiden langsung, pembentukan Mahkamah Konstitusi & DPD, penguatan jaminan HAM Pasal 28A-28J.'
  }
];

export const REFLECTION_TOPIC_PRESETS = [
  'Bab 2: Praktik Musyawarah Mufakat vs Voting "50%+1" (Buku hlm. 34)',
  'Bab 2: Meme dan Mural sebagai Media Kritik Sosial Edukatif (Buku hlm. 57)',
  'Bab 2: Mengkaji Skor Indeks Demokrasi EIU 6,71 & Budaya Politik (Buku hlm. 56)',
  'Bab 2: Evaluasi 5 Indikator Negara Demokrasi Affan Gaffar (Buku hlm. 36)',
  'Bab 2: Analisis 5 Kesepakatan Dasar MPR dalam Amandemen UUD 1945 (Buku hlm. 54)',
  'Bab 1: Pancasila sebagai Meja Statis dan Leitstar Dinamis (Buku hlm. 27)',
  'Bab 3: 4 Metode Penyelesaian Konflik: Negosiasi, Mediasi, Arbitrase (Buku hlm. 91)',
  'Bab 4: Sistem Presidensial Indonesia: Distribution of Power (Buku hlm. 151)'
];
