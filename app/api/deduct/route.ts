import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, quantity } = body;

  if (!name || typeof quantity !== 'number') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  await connectToDatabase();
  const product = await Product.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  product.stock = Math.max(0, product.stock - quantity);
  await product.save();

  return NextResponse.json({ message: `Deducted ${quantity} from ${product.name}. New stock ${product.stock}.` });
}
