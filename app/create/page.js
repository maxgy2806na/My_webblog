'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateArticlePage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', tag: '', content: '', author: '' });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  // ฟังก์ชันแปลงไฟล์เป็น Base64
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      alert('สามารถแนบรูปภาพได้สูงสุด 3 รูปเท่านั้น');
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result].slice(0, 3));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, images }),
    });

    if (res.ok) {
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-amber-500">เขียนบทความใหม่</h1>
        {error && <p id="error-msg" className="mb-4 text-red-400 font-semibold text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs text-slate-400 mb-1">หัวข้อบทความ *</label>
            <input
              type="text"
              id="title-input"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Tag หมวดหมู่</label>
              <input
                type="text"
                id="tag-input"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">ชื่อผู้เขียน</label>
              <input
                type="text"
                id="author-input"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              />
            </div>
          </div>

          {/* แนบรูปภาพ (สูงสุด 3 รูป) */}
          <div>
            <label className="block text-xs text-slate-400 mb-2">
              แนบรูปภาพประกอบ (เลือกได้ 0 - 3 รูป)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={images.length >= 3}
              onChange={handleImageUpload}
              className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-600 cursor-pointer disabled:opacity-50"
            />
            {images.length > 0 && (
              <div className="flex gap-3 mt-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 border border-slate-700 rounded-lg overflow-hidden group">
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">เนื้อหาบทความ *</label>
            <textarea
              id="content-input"
              rows="5"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            ></textarea>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              id="btn-publish"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-sm transition"
            >
              เผยแพร่บทความ
            </button>
            <Link
              href="/"
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-lg text-sm transition"
            >
              ยกเลิก
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}