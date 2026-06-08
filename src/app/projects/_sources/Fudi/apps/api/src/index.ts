import Fastify from "fastify";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from './routers/index.js';
import { createContext } from './trpc.js';

const server = Fastify({ logger: true });

await server.register(cors, {
  origin: (origin, cb) => {
    // Permite front local y despliegues; ajustalo en prod
    if (!origin) return cb(null, true);
    const allowed = [/^http:\/\/localhost:3000$/, /^https:\/\/.*\.tu-dominio\.com$/];
    const ok = allowed.some((r) => r.test(origin));
    cb(ok ? null : new Error("Not allowed by CORS"), ok);
  },
  credentials: true
});

// Registrar tRPC
await server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    createContext,
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }: { path?: string; error: Error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  },
});

// Endpoints de salud y compatibilidad
server.get("/health", async () => ({ status: "ok" }));

// Endpoint para obtener el tipo del router (útil para el cliente)
server.get("/trpc-router-type", async () => {
  return { message: "Router type disponible en /trpc" };
});

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? "0.0.0.0";

server.listen({ port, host }).catch((err) => {
  server.log.error(err);
  process.exit(1);
});
