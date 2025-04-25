import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/authOptions";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import NewTaskForm from './NewTaskForm';
import TaskItem from './TaskItem';

const prisma = new PrismaClient();

export default async function Dashboard() {
    const session = await getServerSession(authOptions);
    console.log('[DASHBOARD] session:', session);
    // Redirige si no hay sesión
    if (!session?.user?.email) {
        redirect('/login');
    }

    // Obtiene las tareas del usuario
    const tasks = await prisma.task.findMany({
        where: { 
            user: { 
                email: session.user.email 
            } 
        }
    });

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Panel de Control</h1>
            <NewTaskForm />
            <ul className="space-y-2">
                {tasks.map((t: { id: number; title: string }) => (
                    <li key={t.id} className="p-3 bg-white rounded-lg shadow">
                        <TaskItem id={t.id} title={t.title} />
                    </li>
                ))}
            </ul>
        </div>
    );
}