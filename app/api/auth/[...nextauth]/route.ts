import NextAuth from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions"; // ajusta si cambia la ruta

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };