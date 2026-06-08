import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../server/routers";
import { createContext } from "../../../server/trpc";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/projects/photoi/api/trpc",
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
