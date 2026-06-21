import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables.');
}

const globalForMongo = global as typeof globalThis & {
  mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

let cached = globalForMongo.mongoose;

if (!cached) {
  cached = globalForMongo.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: 'agri-inventory',
      autoIndex: true,
    };
    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
