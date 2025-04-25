import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extiende los tipos de sesión y token para incluir 'id' y 'email'
declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      email?: string;
      name?: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    id: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
  }
}
