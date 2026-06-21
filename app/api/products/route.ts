import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  await connectToDatabase();
  const products = await Product.find({}).sort({ updatedAt: -1 }).lean();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, category, price, stock } = body;

  if (!name || !category || typeof price !== 'number' || typeof stock !== 'number') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  await connectToDatabase();
  const product = await Product.create({ name, category, price, stock });
  return NextResponse.json(product, { status: 201 });
}
