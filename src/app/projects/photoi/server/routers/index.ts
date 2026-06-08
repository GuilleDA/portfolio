import { router } from "../trpc";
import { exampleRouter } from "./example";
import { testRouter } from "./test";
import { imagesRouter } from "./images";

export const appRouter = router({
  example: exampleRouter,
  test: testRouter,
  images: imagesRouter,
});

export type AppRouter = typeof appRouter;
