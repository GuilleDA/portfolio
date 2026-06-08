import { initTRPC } from '@trpc/server';
import { z } from 'zod';

// Crear el contexto de tRPC
export const createContext = () => {
  return {
    // Aquí puedes agregar cosas como la base de datos, autenticación, etc.
    user: null, // Por ahora null, pero podrías agregar autenticación aquí
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// Inicializar tRPC
const t = initTRPC.context<Context>().create();

// Exportar los procedimientos que usaremos
export const router = t.router;
export const publicProcedure = t.procedure;
