'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTask() {
    const [title, setTitle] = useState("");
    const router = useRouter();

    const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        router.push('/dashboard');
    };

    return (
        <form onSubmit={handleCreate}>
            <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título de la tarea"
                required
            />
            <button type="submit">Añadir Tarea</button>
        </form>
    );
}