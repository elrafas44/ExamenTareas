import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    
    // Verificación de sesión
    if (!session?.user?.email) {
        return NextResponse.json(
            { error: "No autorizado" },
            { status: 401 }
        );
    }

    try {
        const { title } = await req.json();

        // Validación del título
        if (!title || typeof title !== "string") {
            return NextResponse.json(
                { error: "Título inválido" },
                { status: 400 }
            );
        }

        const task = await prisma.task.create({
            data: {
                title,
                user: {
                    connect: { email: session.user.email }
                }
            }
        });

        return NextResponse.json(task);

    } catch (error) {
        console.error("Error creando tarea:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    try {
        const { id } = await req.json();
        if (!id || typeof id !== "number") {
            return NextResponse.json({ error: "ID inválido" }, { status: 400 });
        }
        // Solo permite borrar tareas del usuario autenticado
        const deleted = await prisma.task.deleteMany({
            where: {
                id,
                user: { email: session.user.email }
            }
        });
        if (deleted.count === 0) {
            return NextResponse.json({ error: "Tarea no encontrada o no autorizada" }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error eliminando tarea:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    try {
        const { id, title } = await req.json();
        if (!id || typeof id !== "number" || !title || typeof title !== "string") {
            return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
        }
        // Solo permite actualizar tareas del usuario autenticado
        const updated = await prisma.task.updateMany({
            where: {
                id,
                user: { email: session.user.email }
            },
            data: { title }
        });
        if (updated.count === 0) {
            return NextResponse.json({ error: "Tarea no encontrada o no autorizada" }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error actualizando tarea:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}