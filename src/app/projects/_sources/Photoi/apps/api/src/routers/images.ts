import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { generateEmbedding } from '../lib/replicate.js';
import { mongoClient, ImageDocument } from '../lib/mongodb.js';

export const imagesRouter = router({
  /**
   * Búsqueda vectorial de imágenes usando embeddings
   * Recibe texto, lo convierte a embedding y busca en MongoDB
   */
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1, 'La consulta no puede estar vacía'),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(20),
      })
    )
    .mutation(async ({ input }) => {
      const { query, page, limit } = input;
      const skip = (page - 1) * limit;

      try {
        const queryEmbedding = await generateEmbedding(query);

        await mongoClient.connect();
        const collection = mongoClient.getCollection<ImageDocument>('Images');

        // Realizar búsqueda vectorial usando el índice vector_index de MongoDB Atlas
        const pipeline: any[] = [
          {
            $vectorSearch: {
              index: 'vector_index',
              path: 'embedding',
              queryVector: queryEmbedding,
              numCandidates: 100, // Número de candidatos a considerar
              limit: limit + skip, // Traer todos los necesarios para la paginación
            },
          },
          {
            $project: {
              _id: 1,
              imageUrl: 1,
              descripcion: 1,
            },
          },
          // Aplicar skip y limit después del $vectorSearch
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
        ];

        const results = await collection.aggregate(pipeline).toArray();

        // Contar total aproximado (MongoDB Atlas Vector Search no soporta count exacto)
        // Usamos una búsqueda con límite alto para estimar
        const countPipeline: any[] = [
          {
            $vectorSearch: {
              index: 'vector_index',
              path: 'embedding',
              queryVector: queryEmbedding,
              numCandidates: 1000,
              limit: 1000,
            },
          },
          {
            $count: 'total',
          },
        ];

        const countResult = await collection.aggregate(countPipeline).toArray();
        const totalCount = countResult[0]?.total || results.length;

        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return {
          success: true,
          query,
          results: results.map((doc) => ({
            id: doc._id?.toString(),
            imageUrl: doc.imageUrl,
            description: doc.descripcion,
          })),
          pagination: {
            currentPage: page,
            totalPages,
            totalResults: totalCount,
            resultsPerPage: limit,
            hasNextPage,
            hasPreviousPage,
          },
        };
      } catch (error) {
        console.error('❌ Error en búsqueda de imágenes:', error);

        return {
          success: false,
          query,
          results: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalResults: 0,
            resultsPerPage: limit,
            hasNextPage: false,
            hasPreviousPage: false,
          },
          error: error instanceof Error ? error.message : 'Error desconocido',
        };
      }
    }),

  /**
   * Procedimiento auxiliar para obtener estadísticas de la colección
   */
  getStats: publicProcedure.query(async () => {
    try {
      await mongoClient.connect();
      const collection = mongoClient.getCollection<ImageDocument>('Images');

      const totalImages = await collection.countDocuments();
      const imagesWithEmbeddings = await collection.countDocuments({
        embedding: { $exists: true, $ne: null } as any,
      });

      return {
        success: true,
        totalImages,
        imagesWithEmbeddings,
        imagesWithoutEmbeddings: totalImages - imagesWithEmbeddings,
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      return {
        success: false,
        totalImages: 0,
        imagesWithEmbeddings: 0,
        imagesWithoutEmbeddings: 0,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }),
});

