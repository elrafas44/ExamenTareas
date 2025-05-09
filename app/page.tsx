// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Gestor de Tareas</h1>
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Iniciar Sesión
        </Link>
        <Link 
          href="/register" 
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Registrarse
        </Link>
      </div>
    </main>
  );
}