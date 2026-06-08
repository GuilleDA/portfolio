import { router } from '../trpc.js';
import { exampleRouter } from './example.js';
import { testRouter } from './test.js';
import { imagesRouter } from './images.js';

// Router principal que combina todos los routers
export const appRouter = router({
  example: exampleRouter,
  test: testRouter,
  images: imagesRouter,
  // Aquí puedes agregar más routers en el futuro
  // auth: authRouter,
  // photos: photosRouter,
  // etc.
});

export type AppRouter = typeof appRouter;
