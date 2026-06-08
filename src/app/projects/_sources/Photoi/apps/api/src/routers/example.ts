import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';

export const exampleRouter = router({
  // Procedimiento de ejemplo: saludar
  greet: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(({ input }) => {
      return {
        message: `¡Hola, ${input.name}!`,
        timestamp: new Date().toISOString(),
      };
    }),

  // Procedimiento de ejemplo: obtener usuarios (simulado)
  getUsers: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      offset: z.number().min(0).default(0)
    }))
    .query(({ input }) => {
      // Simulamos datos de usuarios
      const users = Array.from({ length: input.limit }, (_, i) => ({
        id: input.offset + i + 1,
        name: `Usuario ${input.offset + i + 1}`,
        email: `usuario${input.offset + i + 1}@ejemplo.com`,
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      }));

      return {
        users,
        total: 100, // Simulamos que hay 100 usuarios en total
        hasMore: input.offset + input.limit < 100,
      };
    }),

  // Procedimiento de ejemplo: crear usuario
  createUser: publicProcedure
    .input(z.object({
      name: z.string().min(2).max(50),
      email: z.string().email(),
    }))
    .mutation(({ input }) => {
      // Simulamos la creación de un usuario
      const newUser = {
        id: Math.floor(Math.random() * 1000) + 100,
        name: input.name,
        email: input.email,
        createdAt: new Date().toISOString(),
      };

      return {
        success: true,
        user: newUser,
        message: 'Usuario creado exitosamente',
      };
    }),

  // Procedimiento de ejemplo: obtener estadísticas
  getStats: publicProcedure
    .query(() => {
      return {
        totalUsers: 100,
        activeUsers: 75,
        totalPhotos: 1250,
        storageUsed: '2.5 GB',
        lastUpdated: new Date().toISOString(),
      };
    }),
});
