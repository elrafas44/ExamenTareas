import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

// Configuración Singleton para Prisma
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log('[AUTH] Intentando login con:', credentials);
          if (!credentials?.email || !credentials.password) {
            console.error('[AUTH] Faltan email o contraseña');
            throw new Error("Email y contraseña son requeridos");
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          console.log('[AUTH] Usuario encontrado:', user);

          if (!user) {
            console.error('[AUTH] Usuario no encontrado para email:', credentials.email);
            throw new Error("Usuario no encontrado");
          }

          if (!user.password) {
            console.error('[AUTH] El usuario no tiene campo password:', user);
            throw new Error("El usuario no tiene contraseña registrada");
          }

          const isValid = await compare(credentials.password, user.password);
          console.log('[AUTH] ¿Contraseña válida?', isValid);
          if (!isValid) {
            console.error('[AUTH] Contraseña incorrecta para usuario:', credentials.email);
            throw new Error("Contraseña incorrecta");
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.email
          };
        } catch (error) {
          console.error("[AUTH] Error en autorización:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días de duración de sesión
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,

  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? `__Secure-next-auth.session-token` : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('[SESSION CALLBACK] token:', token);
      console.log('[SESSION CALLBACK] session:', session);
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV !== "production",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };