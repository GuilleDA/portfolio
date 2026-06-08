import { router } from '../trpc.js';
import { exampleRouter } from './example.js';

// Router principal que combina todos los routers
export const appRouter = router({
  example: exampleRouter,
  // Aquí puedes agregar más routers en el futuro
  // auth: authRouter,
  // photos: photosRouter,
  // etc.
});

export type AppRouter = typeof appRouter;
