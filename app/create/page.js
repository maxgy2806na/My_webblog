'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateArticle() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', tag: 'General', author: '', content: '' });
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ตรวจสอบสถานะล็อกอินทันทีที่โหลดหน้านี้
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      alert('กรุณาเข้าสู่ระบบก่อนเขียนบทความ');
      router.push('/'); // ส่งกลับไปหน้าหลัก
    } else {
      const user = JSON.parse(savedUser);
      // ตั้งค่าชื่อผู้เขียนให้อัตโนมัติจากชื่อผู้ใช้ที่ล็อกอินอยู่
      setForm((prev) => ({ ...prev, author: user.name || user.username || '' }));
    }
  }, [router]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, images }),
    });

    if (res.ok) {
      router.push('/');
    } else {
      alert('เกิดข้อผิดพลาด ไม่สามารถเพิ่มบทความได้');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-slate-200 font-sans antialiased py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            ← กลับหน้าหลัก
          </Link>
          <h1 className="text-xl font-bold text-white">เขียนบทความใหม่</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5">
          <div>
            <label className="block text-xs text-slate-400 mb-2 font-light">หัวข้อบทความ</label>
            <input
              type="text"
              required
              placeholder="ระบุหัวข้อบทความ..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 transition-all placeholder:text-slate-600"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-2 font-light">หมวดหมู่ / แท็ก</label>
              <input
                type="text"
                required
                placeholder="เช่น Frontend, Design, General"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 transition-all placeholder:text-slate-600"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-2 font-light">ชื่อผู้เขียน</label>
              <input
                type="text"
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 transition-all bg-white/5 cursor-not-allowed"
                value={form.author}
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-2 font-light">เนื้อหาบทความ</label>
            <textarea
              rows="6"
              required
              placeholder="พิมพ์เนื้อหาที่นี่..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 transition-all placeholder:text-slate-600"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            ></textarea>
          </div>

          {/* แนบรูปภาพ */}
          <div>
            <label className="block text-xs text-slate-400 mb-2 font-light">แนบรูปภาพประกอบ</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20 cursor-pointer"
            />

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group aspect-video rounded-xl overflow-hidden border border-white/10">
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-400 hover:bg-amber-300 text-black font-semibold py-3 rounded-xl text-xs transition-all active:scale-95 shadow-lg shadow-amber-500/10 mt-4 disabled:opacity-50"
          >
            {isSubmitting ? 'กำลังบันทึก...' : 'เผยแพร่บทความ'}
          </button>
        </form>
      </div>
    </div>
  );
}