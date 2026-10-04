import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('myBlogDB');
    const articles = await db.collection('articles').find({}).sort({ id: -1 }).toArray();
    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, tag, content, author, images } = body;

    if (!title || !content) {
      return NextResponse.json({ message: 'หัวข้อและเนื้อหาห้ามเป็นค่าว่าง' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('myBlogDB');

    const newArticle = {
      id: Date.now(),
      title,
      tag: tag || 'General',
      content,
      author: author || 'Anonymous',
      images: Array.isArray(images) ? images : [], // รองรับอาเรย์รูปภาพ (Base64)
      createdAt: new Date().toISOString().split('T')[0]
    };

    await db.collection('articles').insertOne(newArticle);

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Database Error' }, { status: 500 });
  }
}