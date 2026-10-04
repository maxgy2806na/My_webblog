import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('myBlogDB');

    // ตรวจสอบว่าชื่อผู้ใช้ซ้ำหรือไม่
    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
      return NextResponse.json({ message: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' }, { status: 400 });
    }

    // บันทึกผู้ใช้ใหม่
    const newUser = {
      username,
      password, // สำหรับระบบทดสอบบันทึกตรง (ระบบ Production ควรใช้ bcrypt)
      createdAt: new Date().toISOString()
    };

    await db.collection('users').insertOne(newUser);

    return NextResponse.json({ message: 'สมัครสมาชิกสำเร็จ' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
  }
}