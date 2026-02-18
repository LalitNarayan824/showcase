import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getTeamFromRequest } from "@/lib/auth";

export async function GET() {
    try {
        const team = await getTeamFromRequest();
        if (!team || !team.isAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const result = await pool.query(`
      SELECT p.*, t.team_name, t.members
      FROM projects p
      JOIN teams t ON p.team_id = t.id
      ORDER BY p.created_at DESC
    `);

        return NextResponse.json({ projects: result.rows });
    } catch (error) {
        console.error("Admin projects error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
