'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTaskForm() {
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title })
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Error al crear la tarea');
            } else {
                setTitle("");
                router.refresh(); // Refresca el dashboard para mostrar la nueva tarea
            }
        } catch {
            setError('Error al crear la tarea');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleCreate} className="mb-6 flex gap-2">
            <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título de la tarea"
                className="border rounded px-2 py-1 flex-1"
                required
                disabled={loading}
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded" disabled={loading}>
                {loading ? 'Añadiendo...' : 'Añadir Tarea'}
            </button>
            {error && <span className="text-red-500 ml-2">{error}</span>}
        </form>
    );
}
