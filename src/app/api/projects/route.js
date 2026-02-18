import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getTeamFromRequest } from "@/lib/auth";
import { initDatabase } from "@/lib/init-db";
import formidable from "formidable";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

// Disable Next.js body parser for file uploads
export const config = {
    api: {
        bodyParser: false,
    },
};

// GET: List all projects (public)
export async function GET() {
    try {
        await initDatabase();

        const result = await pool.query(`
      SELECT p.*, t.team_name, t.members
      FROM projects p
      JOIN teams t ON p.team_id = t.id
      ORDER BY p.created_at DESC
    `);

        return NextResponse.json({ projects: result.rows });
    } catch (error) {
        console.error("Get projects error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST: Create a new project (authenticated)
export async function POST(request) {
    try {
        await initDatabase();

        const team = await getTeamFromRequest();
        if (!team) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const projectName = formData.get("projectName");
        const description = formData.get("description");
        const image = formData.get("image");

        if (!projectName) {
            return NextResponse.json(
                { error: "Project name is required" },
                { status: 400 }
            );
        }

        let imageUrl = null;

        if (image && image.size > 0) {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadsDir = path.join(process.cwd(), "uploads");
            await mkdir(uploadsDir, { recursive: true });

            const ext = path.extname(image.name) || ".png";
            const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
            const filepath = path.join(uploadsDir, filename);

            await writeFile(filepath, buffer);
            imageUrl = `/api/uploads/${filename}`;
        }

        const result = await pool.query(
            `INSERT INTO projects (team_id, project_name, description, image_url)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [team.id, projectName, description || "", imageUrl]
        );

        return NextResponse.json({ project: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error("Create project error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
