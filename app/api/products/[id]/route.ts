import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { price, stock } = body;

  if (typeof price !== 'number' || typeof stock !== 'number') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  await connectToDatabase();
  const product = await Product.findByIdAndUpdate(id, { price, stock }, { new: true });

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}
