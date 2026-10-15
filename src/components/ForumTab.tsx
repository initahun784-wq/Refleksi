import React, { useState } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  MessageCircle, 
  Send, 
  Plus, 
  CheckCircle2, 
  HelpCircle, 
  Search, 
  Scale, 
  Vote, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ForumTopic, ForumComment, ForumReply, ArgumentStance, Student, Poll } from '../types';

interface ForumTabProps {
  topics: ForumTopic[];
  currentUser: { isTeacher: boolean; student?: Student };
  onVotePoll: (topicId: string, optionId: string) => void;
  onAddComment: (topicId: string, stance: ArgumentStance, content: string) => void;
  onAddReply: (topicId: string, commentId: string, content: string) => void;
  onLikeComment: (topicId: string, commentId: string) => void;
  onCreateTopic: (newTopic: ForumTopic) => void;
}

export const ForumTab: React.FC<ForumTabProps> = ({
  topics,
  currentUser,
  onVotePoll,
  onAddComment,
  onAddReply,
  onLikeComment,
  onCreateTopic,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newCommentStance, setNewCommentStance] = useState<ArgumentStance>('solutif');
  const [newCommentContent, setNewCommentContent] = useState<string>('');
  const [replyInputOpen, setReplyInputOpen] = useState<Record<string, boolean>>({});
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState<boolean>(false);

  // New topic modal form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubtopic, setNewSubtopic] = useState('Demokrasi & Karakter Pancasila');
  const [newDescription, setNewDescription] = useState('');
  const [newCaseStudy, setNewCaseStudy] = useState('');
  const [enablePoll, setEnablePoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  const activeTopic = topics.find((t) => t.id === selectedTopicId) || topics[0];

  const currentUserId = currentUser.isTeacher ? 'teacher-id' : currentUser.student?.id || 'std-1';

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim() || !activeTopic) return;
    onAddComment(activeTopic.id, newCommentStance, newCommentContent.trim());
    setNewCommentContent('');
  };

  const handlePostReply = (commentId: string) => {
    const text = replyTexts[commentId];
    if (!text || !text.trim() || !activeTopic) return;
    onAddReply(activeTopic.id, commentId, text.trim());
    setReplyTexts({ ...replyTexts, [commentId]: '' });
    setReplyInputOpen({ ...replyInputOpen, [commentId]: false });
  };

  const handleCreateTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    let pollData: Poll | undefined = undefined;
    if (enablePoll && pollQuestion.trim()) {
      const validOptions = pollOptions.filter((opt) => opt.trim());
      if (validOptions.length >= 2) {
        pollData = {
          id: `poll-${Date.now()}`,
          question: pollQuestion.trim(),
          options: validOptions.map((opt, idx) => ({
            id: `opt-${Date.now()}-${idx}`,
            text: opt.trim(),
            votes: 0,
          })),
          totalVotes: 0,
          voterIds: [],
        };
      }
    }

    const today = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());

    const createdTopic: ForumTopic = {
      id: `tpc-${Date.now()}`,
      title: newTitle.trim(),
      chapter: 'Bab 2: Demokrasi Berdasarkan UUD NRI 1945',
      subtopic: newSubtopic,
      description: newDescription.trim(),
      caseStudy: newCaseStudy.trim(),
      bookReference: 'Diskusi Siswa Kelas XI',
      authorName: currentUser.isTeacher
        ? 'Jamal Akmalludin,S.Pd (Guru PPKn)'
        : `${currentUser.student?.name} (${currentUser.student?.classGroup})`,
      createdAt: today,
      poll: pollData,
      comments: [],
    };

    onCreateTopic(createdTopic);
    setSelectedTopicId(createdTopic.id);
    setIsCreateTopicModalOpen(false);
    // Reset
    setNewTitle('');
    setNewDescription('');
    setNewCaseStudy('');
    setEnablePoll(false);
  };

  const filteredTopics = topics.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.subtopic.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  });

  const stanceLabels: Record<ArgumentStance, { text: string; bg: string; textCol: string }> = {
    pro: { text: 'Perspektif Mendukung (Pro)', bg: 'bg-emerald-50', textCol: 'text-emerald-800' },
    kontra: { text: 'Perspektif Kritis (Kontra)', bg: 'bg-rose-50', textCol: 'text-rose-800' },
    solutif: { text: 'Perspektif Solutif & Rekomendasi', bg: 'bg-blue-50', textCol: 'text-blue-800' },
    netral: { text: 'Pandangan Netral / Reflektif', bg: 'bg-slate-50', textCol: 'text-slate-800' },
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Mimbar Demokrasi Interaktif Kelas XI
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Ruang dialog deliberatif untuk mendiskusikan studi kasus nyata, berargumen santun, dan menyampaikan suara melalui polling.
          </p>
        </div>

        <button
          onClick={() => setIsCreateTopicModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Ajukan Topik Diskusi Baru</span>
        </button>
      </div>

      {/* Main Grid: Left Topics Navigator (4 cols), Right Active Discussion (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Topic List Selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari topik demokrasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredTopics.map((topic) => {
                const isSelected = topic.id === activeTopic?.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopicId(topic.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-400 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-2xs font-semibold text-blue-800 mb-1">
                      {topic.subtopic}
                    </div>
                    <h4
                      className={`text-xs font-bold leading-snug ${
                        isSelected ? 'text-blue-950' : 'text-slate-900'
                      }`}
                    >
                      {topic.title}
                    </h4>

                    {/* Metadata zero-pill */}
                    <div className="flex items-center gap-2 text-2xs text-slate-500 mt-2">
                      <span>{topic.comments.length} argumen</span>
                      <span aria-hidden="true">·</span>
                      {topic.poll && (
                        <>
                          <span>{topic.poll.totalVotes} suara poll</span>
                          <span aria-hidden="true">·</span>
                        </>
                      )}
                      <span>{topic.createdAt.split(' ')[0]} {topic.createdAt.split(' ')[1]}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Topic Stage, Polling, and Arguments */}
        <div className="lg:col-span-8 space-y-5">
          {activeTopic ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
              {/* Topic Header */}
              <div className="border-b border-slate-200 pb-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-blue-800 font-semibold mb-1">
                  <span>{activeTopic.chapter || 'Bab 2: Demokrasi UUD 1945'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeTopic.subtopic}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                  {activeTopic.title}
                </h3>

                {/* Metadata zero-pill */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-2">
                  <span>Oleh: <strong className="text-slate-800 font-medium">{activeTopic.authorName}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>{activeTopic.createdAt}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeTopic.comments.length} Argumen Terdata</span>
                  {activeTopic.bookReference && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-blue-900 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {activeTopic.bookReference}
                      </span>
                    </>
                  )}
                </div>

                <p className="text-sm text-slate-700 leading-relaxed mt-4">
                  {activeTopic.description}
                </p>

                {/* Contextual Case Study Box */}
                {activeTopic.caseStudy && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
                      <Scale className="w-3.5 h-3.5 text-blue-700" />
                      <span>Studi Kasus Kontekstual untuk Dikaji:</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{activeTopic.caseStudy}"
                    </p>
                  </div>
                )}
              </div>

              {/* Interactive Polling Section (if exists) */}
              {activeTopic.poll && (
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Vote className="w-4 h-4 text-blue-700" />
                      <h4 className="text-sm font-bold text-slate-900">
                        Jajak Pendapat / Polling Demokrasi
                      </h4>
                    </div>
                    <span className="text-xs text-slate-500 tabular-nums">
                      Total: {activeTopic.poll.totalVotes} Suara Masuk
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700">
                    {activeTopic.poll.question}
                  </p>

                  {/* Poll Options */}
                  <div className="space-y-2.5">
                    {activeTopic.poll.options.map((option) => {
                      const hasVoted = activeTopic.poll?.voterIds.includes(currentUserId);
                      const votePercent =
                        activeTopic.poll && activeTopic.poll.totalVotes > 0
                          ? Math.round((option.votes / activeTopic.poll.totalVotes) * 100)
                          : 0;

                      return (
                        <div key={option.id} className="relative">
                          <button
                            disabled={hasVoted}
                            onClick={() => onVotePoll(activeTopic.id, option.id)}
                            className={`w-full text-left p-3 rounded-lg border transition-all relative overflow-hidden cursor-pointer ${
                              hasVoted
                                ? 'bg-white border-slate-200 cursor-default'
                                : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
                            }`}
                          >
                            {/* Visual Progress Bar */}
                            <div
                              className="absolute top-0 bottom-0 left-0 bg-blue-100/70 transition-all duration-500"
                              style={{ width: `${votePercent}%` }}
                            />

                            <div className="relative z-10 flex items-center justify-between gap-3 text-xs">
                              <span className="font-medium text-slate-800">{option.text}</span>
                              <div className="flex items-center gap-2 shrink-0 text-slate-600 font-semibold tabular-nums">
                                <span>{votePercent}%</span>
                                <span className="text-2xs text-slate-400">({option.votes})</span>
                              </div>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {activeTopic.poll.voterIds.includes(currentUserId) ? (
                    <p className="text-2xs text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Terima kasih! Suara Anda telah dicatat dalam musyawarah kelas.</span>
                    </p>
                  ) : (
                    <p className="text-2xs text-slate-500">
                      Klik salah satu opsi di atas untuk berpartisipasi dalam jajak pendapat.
                    </p>
                  )}
                </div>
              )}

              {/* Argument Submission Form */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Sampaikan Argumen / Pandangan Kritis Anda
                  </h4>
                  <span className="text-xs text-slate-500">
                    Sebagai: <strong className="text-slate-800">{currentUser.isTeacher ? 'Guru PPKn' : currentUser.student?.name}</strong>
                  </span>
                </div>

                <form onSubmit={handlePostComment} className="space-y-3">
                  {/* Stance Picker */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-600 font-medium">Sudut Pandang:</span>
                    <button
                      type="button"
                      onClick={() => setNewCommentStance('pro')}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                        newCommentStance === 'pro'
                          ? 'bg-emerald-600 text-white font-semibold'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Mendukung (Pro)
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCommentStance('kontra')}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                        newCommentStance === 'kontra'
                          ? 'bg-rose-600 text-white font-semibold'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Kritis (Kontra)
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCommentStance('solutif')}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                        newCommentStance === 'solutif'
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Solutif & Moderasi
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    placeholder="Tuliskan argumen berlandaskan data, etika Pancasila, atau pasal konstitusi UUD 1945..."
                    className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Utamakan santun berpendapat & hargai perbedaan.</span>
                    <button
                      type="submit"
                      disabled={!newCommentContent.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Argumen ke Forum</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Arguments & Comments Stream */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">
                    Daftar Argumen Siswa & Guru ({activeTopic.comments.length})
                  </h4>
                  <span className="text-xs text-slate-500">
                    Diurutkan berdasarkan kontribusi musyawarah
                  </span>
                </div>

                {activeTopic.comments.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                    <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">
                      Belum ada argumen yang diposting
                    </p>
                    <p className="text-2xs text-slate-500 mt-0.5">
                      Jadilah yang pertama menyampaikan pandangan kritis pada topik ini!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeTopic.comments.map((comment) => {
                      const stanceInfo = stanceLabels[comment.stance] || stanceLabels.netral;
                      const isLikedByMe = comment.likedBy.includes(currentUserId);
                      const isReplyOpen = !!replyInputOpen[comment.id];

                      return (
                        <div
                          key={comment.id}
                          className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 space-y-3"
                        >
                          {/* Comment Header with Stance & Unboxed metadata */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                              <span className="font-bold text-slate-900">
                                {comment.authorName}
                              </span>
                              {comment.classGroup && (
                                <span className="text-slate-500">({comment.classGroup})</span>
                              )}
                              <span aria-hidden="true" className="text-slate-300">·</span>
                              <span className="text-slate-400">{comment.createdAt}</span>
                              <span aria-hidden="true" className="text-slate-300">·</span>
                              <span className={`text-2xs font-semibold ${stanceInfo.textCol}`}>
                                {stanceInfo.text}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                            {comment.content}
                          </p>

                          {/* Action Buttons: Like / Reply */}
                          <div className="flex items-center gap-4 text-xs pt-1 border-t border-slate-100 text-slate-600">
                            <button
                              onClick={() => onLikeComment(activeTopic.id, comment.id)}
                              className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                                isLikedByMe ? 'text-blue-700 font-semibold' : 'hover:text-slate-900'
                              }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>Mendukung ({comment.likes})</span>
                            </button>

                            <button
                              onClick={() =>
                                setReplyInputOpen({
                                  ...replyInputOpen,
                                  [comment.id]: !isReplyOpen,
                                })
                              }
                              className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Tanggapi ({comment.replies.length})</span>
                            </button>
                          </div>

                          {/* Threaded Replies */}
                          {comment.replies.length > 0 && (
                            <div className="pl-4 sm:pl-6 border-l-2 border-slate-200 space-y-2.5 mt-2 pt-2">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="bg-slate-50/80 p-3 rounded-lg text-xs space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-900">
                                      {reply.authorName}
                                    </span>
                                    <span className="text-2xs text-slate-400">· {reply.createdAt}</span>
                                  </div>
                                  <p className="text-slate-700 leading-relaxed">{reply.content}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply Input Box */}
                          {isReplyOpen && (
                            <div className="mt-2 pt-2 pl-4 sm:pl-6 border-l-2 border-blue-300 flex items-center gap-2">
                              <input
                                type="text"
                                placeholder={`Tanggapi pandangan ${comment.authorName.split(' ')[0]} secara santun...`}
                                value={replyTexts[comment.id] || ''}
                                onChange={(e) =>
                                  setReplyTexts({ ...replyTexts, [comment.id]: e.target.value })
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handlePostReply(comment.id);
                                }}
                                className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                              />
                              <button
                                onClick={() => handlePostReply(comment.id)}
                                className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-2xs cursor-pointer"
                              >
                                Kirim
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Modal: Create New Topic */}
      {isCreateTopicModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                Buka Topik Musyawarah / Diskusi Demokrasi Baru
              </h3>
              <button
                onClick={() => setIsCreateTopicModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleCreateTopicSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Judul Topik Diskusi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Peran OSIS dalam Mengawal Demokrasi dan Keterbukaan Aspirasi Siswa"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Kategori Subtopik
                  </label>
                  <select
                    value={newSubtopic}
                    onChange={(e) => setNewSubtopic(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800"
                  >
                    <option value="Demokrasi & Karakter Pancasila">Demokrasi & Karakter Pancasila</option>
                    <option value="Demokrasi Digital & Media Sosial">Demokrasi Digital & Media Sosial</option>
                    <option value="Budaya Demokrasi di Sekolah">Budaya Demokrasi di Sekolah</option>
                    <option value="Partisipasi Pemilih Pemula">Partisipasi Pemilih Pemula</option>
                    <option value="Penegakan Hukum & HAM">Penegakan Hukum & HAM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Latar Belakang & Pemantik Diskusi
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Uraikan mengapa isu ini penting untuk diperbincangkan dalam kerangka demokrasi PPKn..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Studi Kasus Nyata (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh kasus di lingkungan sekolah atau berita aktual..."
                  value={newCaseStudy}
                  onChange={(e) => setNewCaseStudy(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Optional Poll Creator */}
              <div className="pt-2 border-t border-slate-200">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enablePoll}
                    onChange={(e) => setEnablePoll(e.target.checked)}
                    className="rounded text-blue-700"
                  />
                  <span>Sertakan Polling / Jajak Pendapat Kelas</span>
                </label>

                {enablePoll && (
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                    <input
                      type="text"
                      placeholder="Pertanyaan Polling (misal: Apakah Anda setuju jika...)"
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                    />
                    <div className="space-y-1">
                      {pollOptions.map((opt, i) => (
                        <input
                          key={i}
                          type="text"
                          placeholder={`Pilihan ${i + 1}`}
                          value={opt}
                          onChange={(e) => {
                            const updated = [...pollOptions];
                            updated[i] = e.target.value;
                            setPollOptions(updated);
                          }}
                          className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateTopicModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs"
                >
                  Terbitkan Topik Diskusi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
