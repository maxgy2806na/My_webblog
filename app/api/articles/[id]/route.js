import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db('myBlogDB');

    const result = await db.collection('articles').deleteOne({ id: Number(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'ไม่พบบทความที่ต้องการลบ' }, { status: 404 });
    }

    return NextResponse.json({ message: 'ลบบทความเรียบร้อยแล้ว' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Database Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { title, tag, content, author, images } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ message: 'หัวข้อและเนื้อหาห้ามเป็นค่าว่าง' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('myBlogDB');

    const result = await db.collection('articles').updateOne(
      { id: Number(id) },
      { $set: { title, tag, content, author, images: Array.isArray(images) ? images : [] } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'ไม่พบบทความที่ต้องการแก้ไข' }, { status: 404 });
    }

    return NextResponse.json({ message: 'แก้ไขบทความเรียบร้อยแล้ว' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Database Error' }, { status: 500 });
  }
}