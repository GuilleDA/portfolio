import { router, publicProcedure } from "../trpc";

export const testRouter = router({
  getTestEnv: publicProcedure.query(() => {
    const testEnv =
      process.env.TEST_ENV || "No está definida la variable TEST_ENV";

    return {
      testEnv,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    };
  }),
});
