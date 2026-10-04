'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BlogHome() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');

  // State สำหรับ Authentication (Login / Register)
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false); // สลับ Login / Register
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // State สำหรับ Edit Modal (อัปเดตโพสต์)
  const [editArticle, setEditArticle] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', tag: '', author: '', content: '' });

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

  // ฟังก์ชัน เข้าสู่ระบบ / สมัครสมาชิก
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

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black tracking-wider text-amber-500 uppercase">Thitiwut World</span>
          <div className="hidden md:flex gap-6 text-sm text-slate-300 font-medium">
            <a href="#" className="hover:text-amber-400 transition">หน้าแรก</a>
            <a href="#article-section" className="hover:text-amber-400 transition">บทความทั้งหมด</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/create"
            id="link-create"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-full text-sm transition shadow-lg shadow-amber-500/20"
          >
            + เขียนบทความ
          </Link>

          {user ? (
            <div className="flex items-center gap-3 bg-slate-800 px-3.5 py-1.5 rounded-full border border-slate-700">
              <span className="text-xs text-amber-400 font-semibold">{user.name}</span>
              <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-red-400 font-medium">
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setShowAuthModal(true);
                setIsRegisterMode(false);
              }}
              id="btn-login-modal"
              className="border border-slate-600 hover:border-amber-500 hover:text-amber-400 px-4 py-2 rounded-full text-sm transition"
            >
              เข้าสู่ระบบ / สมัครสมาชิก
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-8 py-16 md:py-24 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7 space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-slate-100">
            Thitiwut World <br />
            <span className="text-amber-500">solutions for everyone</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl">
            แพลตฟอร์มบทความเทคโนโลยีและซอฟต์แวร์ รองรับระบบลงทะเบียนสมาชิก การจัดการบทความ และแนบรูปภาพประกอบแบบมัลติมีเดีย
          </p>
        </div>

        <div className="md:col-span-5 space-y-6 bg-slate-900/50 p-8 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
          <div>
            <div className="text-4xl font-extrabold text-slate-100">690+</div>
            <div className="text-slate-400 text-sm">บทความที่เผยแพร่แล้ว</div>
          </div>
          <div className="border-t border-slate-800 pt-4">
            <div className="text-4xl font-extrabold text-amber-500">500+</div>
            <div className="text-slate-400 text-sm">ผู้ใช้งานในระบบ</div>
          </div>
        </div>
      </section>

      {/* Article Listing Section */}
      <section id="article-section" className="max-w-7xl mx-auto px-8 py-12 border-t border-slate-900">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold text-slate-100">บทความทั้งหมด</h2>
          <input
            type="text"
            placeholder="ค้นหาบทความ..."
            id="search-input"
            className="bg-slate-900 border border-slate-800 text-slate-200 px-4 py-2.5 rounded-lg w-full md:w-80 focus:outline-none focus:border-amber-500 text-sm"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="article-list">
          {filteredArticles.length === 0 ? (
            <p className="text-slate-500 text-center col-span-2 py-12">ไม่พบบทความที่คุณค้นหา</p>
          ) : (
            filteredArticles.map((article) => (
              <div
                key={article.id || article._id}
                className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-6 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-1 rounded-full font-medium">
                      {article.tag || 'General'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(article)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded transition"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-2.5 py-1 rounded transition"
                      >
                        ลบ
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-100 mb-2">{article.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{article.content}</p>

                  {/* แสดงรูปภาพประกอบ (ถ้ามี) */}
                  {article.images && article.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {article.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`attached-${idx}`}
                          className="w-full h-24 object-cover rounded-lg border border-slate-800"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-800/60 pt-4">
                  <span>ผู้เขียน: {article.author}</span>
                  <span>วันที่: {article.createdAt}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* --- Auth Modal (Login & Register) --- */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-xl font-bold text-slate-100">
                {isRegisterMode ? 'สมัครสมาชิก (Register)' : 'เข้าสู่ระบบ (Login)'}
              </h3>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            {authError && <p className="text-red-400 text-sm mb-3">{authError}</p>}
            {authSuccess && <p className="text-green-400 text-sm mb-3">{authSuccess}</p>}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">ชื่อผู้ใช้ (Username)</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  value={authForm.username}
                  onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">รหัสผ่าน (Password)</label>
                <input
                  type="password"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-lg text-sm transition"
              >
                {isRegisterMode ? 'ยืนยันการสมัครสมาชิก' : 'เข้าสู่ระบบ'}
              </button>
            </form>

            <div className="mt-4 text-center text-xs text-slate-400 border-t border-slate-800 pt-3">
              {isRegisterMode ? (
                <p>
                  มีบัญชีอยู่แล้ว?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(false);
                      setAuthError('');
                    }}
                    className="text-amber-400 font-semibold hover:underline"
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
                    className="text-amber-400 font-semibold hover:underline"
                  >
                    สมัครสมาชิกใหม่
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Edit Article Modal --- */}
      {editArticle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-bold text-slate-100 mb-4">อัปเดตบทความหน้าเว็บ</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">หัวข้อบทความ</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">เนื้อหาบทความ</label>
                <textarea
                  rows="4"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                ></textarea>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-lg text-sm transition"
                >
                  บันทึกการแก้ไข
                </button>
                <button
                  type="button"
                  onClick={() => setEditArticle(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-lg text-sm transition"
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