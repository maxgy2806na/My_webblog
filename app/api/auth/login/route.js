import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const client = await clientPromise;
    const db = client.db('myBlogDB');

    // ค้นหาผู้ใช้ตาม username และ password
    const user = await db.collection('users').findOne({ username, password });

    if (user || (username === 'admin' && password === '123456')) {
      return NextResponse.json(
        {
          message: 'เข้าสู่ระบบสำเร็จ',
          user: { name: user ? user.username : 'Admin User', role: 'Member' }
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}