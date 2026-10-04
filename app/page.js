'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // เพิ่ม useRouter

export default function BlogHome() {
  const router = useRouter(); // เรียกใช้งาน router
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');

  // Authentication State
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Edit Modal State
  const [editArticle, setEditArticle] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', tag: '', author: '', content: '' });

  // Full Screen Image State (Lightbox)
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchArticles = async () => {
    const res = await fetch('/api/articles');
    const data = await res.json();
    if (Array.isArray(data)) setArticles(data);
  };

  useEffect(() => {
    fetchArticles();
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // ฟังก์ชันสำหรับกดปุ่มเขียนบทความ
  const handleCreateClick = () => {
    if (user) {
      router.push('/create');
    } else {
      setIsRegisterMode(false);
      setShowAuthModal(true);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authForm),
    });

    const data = await res.json();

    if (res.ok) {
      if (isRegisterMode) {
        setAuthSuccess('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
        setIsRegisterMode(false);
        setAuthForm({ username: '', password: '' });
      } else {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setShowAuthModal(false);
        setAuthForm({ username: '', password: '' });
      }
    } else {
      setAuthError(data.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleDelete = async (id) => {
    if (!confirm('คุณต้องการลบบทความนี้ใช่หรือไม่?')) return;
    const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    if (res.ok) fetchArticles();
    else alert('ไม่สามารถลบบทความได้');
  };

  const openEditModal = (article) => {
    setEditArticle(article);
    setEditForm({
      title: article.title || '',
      tag: article.tag || '',
      author: article.author || '',
      content: article.content || '',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/articles/${editArticle.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm, images: editArticle.images || [] }),
    });

    if (res.ok) {
      setEditArticle(null);
      fetchArticles();
    } else {
      alert('แก้ไขบทความไม่สำเร็จ');
    }
  };

  const filteredArticles = articles.filter(
    (item) =>
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.tag?.toLowerCase().includes(search.toLowerCase())
  );

  const totalArticles = articles.length;
  const categoriesCount = new Set(articles.map((a) => a.tag || 'General')).size;
  const authorsCount = new Set(articles.map((a) => a.author || 'Anonymous')).size;
  const latestArticle = articles[0] ? articles[0].title : 'ยังไม่มีบทความ';

  return (
    <div className="min-h-screen bg-[#0d0f12] text-slate-200 font-sans antialiased selection:bg-amber-500 selection:text-black">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none blur-3xl -z-10" />

      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-[#0d0f12]/80 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-3 h-3 rounded-full bg-amber-500 group-hover:scale-125 transition-transform duration-300 shadow-lg shadow-amber-500/50" />
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
              BLOGNAJA<span className="text-amber-500">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* ปรับปุ่มเขียนบทความให้เรียก handleCreateClick */}
            <button
              onClick={handleCreateClick}
              className="group relative px-5 py-2.5 rounded-full text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all duration-200 shadow-md shadow-amber-500/10 hover:shadow-amber-500/25 flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>เขียนบทความ</span>
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/settings"
                  className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm transition-all group"
                  title="ตั้งค่าโปรไฟล์"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-[10px] font-bold text-amber-400">
                    {user.avatar ? (
                      <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                    ) : (
                      (user.name || user.username || 'U')[0].toUpperCase()
                    )}
                  </div>
                  <span className="text-xs text-amber-400 font-medium group-hover:text-amber-300 transition-colors">
                    {user.name || user.username}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs text-slate-400 hover:text-red-400 transition-colors duration-200 font-medium px-2 py-1"
                >
                  ออก
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setIsRegisterMode(false);
                }}
                className="px-5 py-2.5 rounded-full text-xs font-medium text-slate-300 border border-white/10 hover:border-amber-500/50 hover:text-white active:scale-95 transition-all duration-200 hover:bg-white/5"
              >
                เข้าสู่ระบบ
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Dashboard Section */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-400 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Blog Metrics & Overview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Dashboard ภาพรวมบล็อก
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-light max-w-sm">
            ติดตามความเคลื่อนไหว สถิิตการเผยแพร่บทความ และข้อมูลนักเขียนแบบ Real-time
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/[0.02] border border-white/10 hover:border-amber-500/30 rounded-2xl p-5 backdrop-blur-sm transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-medium text-slate-400">บทความทั้งหมด</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{totalArticles}</div>
            <p className="text-[11px] text-slate-500 font-light">รายการถูกเผยแพร่ในระบบ</p>
          </div>

          <div className="bg-white/[0.02] border border-white/10 hover:border-amber-500/30 rounded-2xl p-5 backdrop-blur-sm transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-medium text-slate-400">หมวดหมู่เนื้อหา</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 11h.01M7 15h.01M11 7h8M11 11h8M11 15h8" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{categoriesCount}</div>
            <p className="text-[11px] text-slate-500 font-light">หัวข้อที่แยกตามประเภท</p>
          </div>

          <div className="bg-white/[0.02] border border-white/10 hover:border-amber-500/30 rounded-2xl p-5 backdrop-blur-sm transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-medium text-slate-400">นักเขียนในระบบ</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{authorsCount}</div>
            <p className="text-[11px] text-slate-500 font-light">ผู้สร้างสรรค์เนื้อหาทั้งหมด</p>
          </div>

          <div className="bg-white/[0.02] border border-white/10 hover:border-amber-500/30 rounded-2xl p-5 backdrop-blur-sm transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-medium text-slate-400">โพสต์ล่าสุด</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-sm font-semibold text-amber-300 truncate mb-1" title={latestArticle}>
              {latestArticle}
            </div>
            <p className="text-[11px] text-slate-500 font-light">อัปเดตบทความล่าสุด</p>
          </div>
        </div>
      </section>

      {/* Article Listing Section */}
      <section id="article-section" className="max-w-6xl mx-auto px-6 py-12 border-t border-white/5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">บทความทั้งหมด</h2>
            <p className="text-xs text-slate-400 mt-1 font-light">ค้นหาและอ่านเนื้อหาที่คุณสนใจ</p>
          </div>

          <div className="relative w-full sm:w-72 group">
            <input
              type="text"
              placeholder="ค้นหาบทความ..."
              id="search-input"
              className="w-full bg-white/[0.03] border border-white/10 text-slate-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all duration-300 placeholder:text-slate-600"
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg
              className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-500 group-focus-within:text-amber-400 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="article-list">
          {filteredArticles.length === 0 ? (
            <div className="col-span-2 py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
              <p className="text-slate-500 text-sm font-light">ไม่พบบทความที่คุณต้องการ</p>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <article
                key={article.id || article._id}
                className="group relative bg-white/[0.02] border border-white/10 hover:border-amber-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/5 hover:bg-white/[0.03] flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {article.tag || 'General'}
                    </span>

                    <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(article)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="แก้ไข"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="ลบ"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors duration-200 mb-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-slate-400 text-xs leading-relaxed font-light mb-5 line-clamp-3">
                    {article.content}
                  </p>

                  {article.images && article.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-5">
                      {article.images.map((img, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedImage(img)}
                          className="overflow-hidden rounded-xl border border-white/10 aspect-video bg-black/40 cursor-pointer group/img relative"
                        >
                          <img
                            src={img}
                            alt="attached"
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <svg className="w-5 h-5 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-500 font-light border-t border-white/5 pt-4 mt-2">
                  <span>ผู้เขียน: <strong className="text-slate-400 font-normal">{article.author}</strong></span>
                  <span>{article.createdAt}</span>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center p-2">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 sm:top-2 sm:right-2 bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white border border-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-all z-10"
              title="ปิด"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Full view"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center p-4 z-50">
          <div className="bg-[#12151a] border border-white/10 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">
                {isRegisterMode ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
              </h3>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-white p-1 transition-colors"
              >
                ✕
              </button>
            </div>

            {authError && <p className="text-red-400 text-xs mb-4 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">{authError}</p>}
            {authSuccess && <p className="text-emerald-400 text-xs mb-4 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg">{authSuccess}</p>}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-light">ชื่อผู้ใช้</label>
                <input
                  type="text"
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 transition-all"
                  value={authForm.username}
                  onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-light">รหัสผ่าน</label>
                <input
                  type="password"
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 transition-all"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-300 text-black font-semibold py-3 rounded-xl text-xs transition-all active:scale-95 shadow-lg shadow-amber-500/10 mt-2"
              >
                {isRegisterMode ? 'ยืนยันการสมัครสมาชิก' : 'เข้าสู่ระบบ'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400 font-light pt-4 border-t border-white/5">
              {isRegisterMode ? (
                <p>
                  มีบัญชีแล้ว?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(false);
                      setAuthError('');
                    }}
                    className="text-amber-400 font-medium hover:underline ml-1"
                  >
                    เข้าสู่ระบบ
                  </button>
                </p>
              ) : (
                <p>
                  ยังไม่มีบัญชี?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(true);
                      setAuthError('');
                    }}
                    className="text-amber-400 font-medium hover:underline ml-1"
                  >
                    สมัครสมาชิก
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Article Modal */}
      {editArticle && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center p-4 z-50">
          <div className="bg-[#12151a] border border-white/10 rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-6">แก้ไขบทความ</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-light">หัวข้อบทความ</label>
                <input
                  type="text"
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 transition-all"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-light">เนื้อหาบทความ</label>
                <textarea
                  rows="4"
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 transition-all"
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-semibold py-2.5 rounded-xl text-xs transition-all active:scale-95"
                >
                  บันทึกการแก้ไข
                </button>
                <button
                  type="button"
                  onClick={() => setEditArticle(null)}
                  className="bg-white/5 hover:bg-white/10 text-slate-300 font-medium px-5 py-2.5 rounded-xl text-xs transition-all"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}