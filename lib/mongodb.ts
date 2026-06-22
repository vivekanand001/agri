import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables.');
}

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

const globalForMongo = global as typeof globalThis & { mongoose?: MongooseCache };

// Ensure a cache object exists on the global scope so it persists across
// module reloads in development (Next.js hot reloads).
if (!globalForMongo.mongoose) {
  globalForMongo.mongoose = { conn: null, promise: null };
}

const cached = globalForMongo.mongoose as MongooseCache;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: 'agri-inventory',
      autoIndex: true,
    } as mongoose.ConnectOptions;

    // `mongoose.connect` returns `Promise<typeof mongoose>` so this matches our cache type
    // MONGODB_URI is guaranteed to be defined due to the check at the top of this file
    cached.promise = mongoose.connect(process.env.MONGODB_URI as string, opts);
  }

  // Await the connection promise and store the resolved mongoose instance
  cached.conn = await cached.promise;

  // cached.conn is guaranteed to be non-null here because it was just assigned
  return cached.conn;
}
