import { MongoClient, Db, Collection, Document } from 'mongodb';

// Tipo para el documento de imagen en MongoDB
export interface ImageDocument {
  _id?: string;
  url: string;
  title?: string;
  description?: string;
  tags?: string[];
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

class MongoDBClient {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  async connect() {
    if (this.client) {
      return this.client;
    }

    const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017';
    this.client = new MongoClient(uri);

    await this.client.connect();
    this.db = this.client.db('Photoi');

    console.log('✅ Conectado a MongoDB');
    return this.client;
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('Database no está conectada. Llama a connect() primero.');
    }
    return this.db;
  }

  getCollection<T extends Document = ImageDocument>(collectionName: string): Collection<T> {
    return this.getDb().collection<T>(collectionName);
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('❌ Desconectado de MongoDB');
    }
  }

}

// Singleton instance
export const mongoClient = new MongoDBClient();

