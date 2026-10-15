import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const dbName = (process.env.AUTH_DB_NAME || process.env.DB_NAME || "Grocify").trim();
const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db(dbName);

/**
 * Better Auth server configuration for Grocify.
 *
 * Security model:
 * - Public registration always defaults to "customer". Role cannot be
 *   elevated by any client-supplied field — additionalFields.role has
 *   input: false so the server ignores any role value from the request body.
 * - The JWT plugin uses definePayload to embed the user''s `role` into the
 *   signed JWT token. The Express backend verifies the token against the
 *   JWKS public endpoint (/api/auth/jwks) and reads req.user.role exclusively
 *   from that verified payload — never from client input.
 */
export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      /**
       * role is always set server-side. The defaultValue guarantees that
       * every newly registered account starts as "customer".
       * input: false prevents any client from supplying this field during
       * sign-up or profile updates. Privileged roles are only assigned via
       * the owner-only PATCH /api/v1/users/:id/role endpoint.
       */
      role: {
        type: "string" as const,
        defaultValue: "customer",
        input: false,
      },
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt" as const,
      maxAge: 60 * 24 * 60, // 24 hours in seconds
    },
  },

  plugins: [
    jwt({
      jwt: {
        /**
         * definePayload embeds the role from the user record into the signed JWT.
         * The Express backend reads this from the verified token payload.
         * This must mirror the role field in the user''s database document.
         */
        definePayload: async (session) => ({
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: (session.user as Record<string, unknown>).role ?? "customer",
        }),
      },
    }),
  ],
});