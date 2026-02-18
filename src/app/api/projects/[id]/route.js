import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getTeamFromRequest } from "@/lib/auth";

// DELETE: Delete a project (owner or admin only)
export async function DELETE(request, { params }) {
    try {
        const team = await getTeamFromRequest();
        if (!team) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Check if project exists and belongs to team (or team is admin)
        const project = await pool.query("SELECT * FROM projects WHERE id = $1", [
            id,
        ]);

        if (project.rows.length === 0) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        if (project.rows[0].team_id !== team.id && !team.isAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await pool.query("DELETE FROM projects WHERE id = $1", [id]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete project error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
